import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert narrative consistency analyzer for the KDSH 2026 hackathon. Your task is to determine whether a hypothetical backstory is consistent with a given narrative (story).

## Your Analysis Process:

1. **Extract Claims**: Identify specific claims made in the backstory about the character's early life, formative experiences, beliefs, fears, ambitions, and assumptions.

2. **Find Evidence**: Search the narrative for passages that either support, contradict, or provide context for each claim.

3. **Analyze Constraints**: Check for:
   - Temporal constraints: Timeline consistency
   - Spatial constraints: Location/setting consistency  
   - Causal constraints: Cause-effect logic
   - Character constraints: Personality/motivation consistency
   - Factual constraints: World-building rules

4. **Make Judgment**: Determine if backstory is CONSISTENT (1) or CONTRADICTS (0) the narrative.

## Response Format (JSON):

{
  "prediction": "consistent" or "contradicted",
  "confidence": 0.0-1.0,
  "rationale": "One-line summary of conclusion",
  "explanation": "Detailed multi-paragraph explanation",
  "claims": [
    {
      "id": "claim_1",
      "text": "The claim from backstory",
      "status": "supported" or "contradicted" or "uncertain",
      "evidence": [
        {
          "id": "evidence_1",
          "excerpt": "Verbatim passage from narrative",
          "relevanceScore": 0.0-1.0,
          "analysisNote": "How this excerpt relates to the claim"
        }
      ]
    }
  ],
  "constraints": {
    "temporal": { "status": "satisfied" or "violated" or "uncertain", "note": "explanation" },
    "spatial": { "status": "satisfied" or "violated" or "uncertain", "note": "explanation" },
    "causal": { "status": "satisfied" or "violated" or "uncertain", "note": "explanation" },
    "character": { "status": "satisfied" or "violated" or "uncertain", "note": "explanation" },
    "factual": { "status": "satisfied" or "violated" or "uncertain", "note": "explanation" }
  }
}

Be thorough but concise. Focus on the most significant evidence. If the texts are very long, prioritize the most relevant passages.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyContent, backstoryContent, track, storyId } = await req.json();

    if (!storyContent || !backstoryContent) {
      return new Response(
        JSON.stringify({ error: 'Both story and backstory content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing narrative consistency for story: ${storyId || 'unnamed'}, track: ${track || 'A'}`);
    console.log(`Story length: ${storyContent.length} chars, Backstory length: ${backstoryContent.length} chars`);

    const userPrompt = `## NARRATIVE (Story):
${storyContent.substring(0, 50000)}${storyContent.length > 50000 ? '\n\n[...truncated for context limits...]' : ''}

## HYPOTHETICAL BACKSTORY:
${backstoryContent}

## TASK:
Analyze whether this backstory is consistent with the narrative. Provide your analysis in the JSON format specified.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI model');
    }

    console.log('Raw AI response:', content.substring(0, 500));

    // Parse JSON from the response (handle markdown code blocks)
    let analysisResult;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Return a structured error response
      analysisResult = {
        prediction: 'uncertain',
        confidence: 0.5,
        rationale: 'Analysis completed but response parsing failed',
        explanation: content,
        claims: [],
        constraints: {
          temporal: { status: 'uncertain', note: 'Could not parse structured analysis' },
          spatial: { status: 'uncertain', note: 'Could not parse structured analysis' },
          causal: { status: 'uncertain', note: 'Could not parse structured analysis' },
          character: { status: 'uncertain', note: 'Could not parse structured analysis' },
          factual: { status: 'uncertain', note: 'Could not parse structured analysis' }
        }
      };
    }

    // Add storyId to result
    analysisResult.storyId = storyId || 'story_1';

    console.log('Analysis complete:', analysisResult.prediction, 'confidence:', analysisResult.confidence);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-narrative:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
