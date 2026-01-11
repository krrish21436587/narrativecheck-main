import { useState } from 'react';
import { ArrowRight, BookOpen, Brain, FileSearch, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingView } from '@/components/ProcessingView';
import { ResultsView } from '@/components/ResultsView';
import { MetricsPanel } from '@/components/MetricsPanel';
import { TrackSelector } from '@/components/TrackSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useToast } from '@/hooks/use-toast';
import { UploadedFile, Track } from '@/types/analysis';

type ViewState = 'upload' | 'processing' | 'results';

export default function Index() {
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [storyFile, setStoryFile] = useState<UploadedFile | null>(null);
  const [backstoryFile, setBackstoryFile] = useState<UploadedFile | null>(null);
  const [storyId, setStoryId] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track>('A');
  const [showMetrics, setShowMetrics] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { job, metrics, runAnalysis, reset } = useAnalysis();
  const { toast } = useToast();

  const canSubmit = storyFile && backstoryFile && !isAnalyzing;

  const handleSubmit = async () => {
    if (!storyFile || !backstoryFile) return;
    
    setViewState('processing');
    setIsAnalyzing(true);
    
    try {
      await runAnalysis(storyFile, backstoryFile, selectedTrack, storyId || undefined);
      setViewState('results');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      toast({
        title: 'Analysis Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // Stay on processing view to show error in logs
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStoryFile(null);
    setBackstoryFile(null);
    setStoryId('');
    setShowMetrics(false);
    setViewState('upload');
    setIsAnalyzing(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
        {viewState === 'upload' && (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-slide-up">
            {/* Hero */}
            <div className="text-center py-4 sm:py-6">
              <span className="badge badge-track mb-2 sm:mb-3">KDSH 2026</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 px-2">
                Narrative Consistency Checker
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                Determine whether a hypothetical backstory is consistent with a long-form narrative 
                using constraint tracking and causal reasoning.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: BookOpen, title: 'Long Context', desc: 'Handles 100k+ word novels' },
                { icon: Brain, title: 'Causal Reasoning', desc: 'Tracks constraints over time' },
                { icon: FileSearch, title: 'Evidence Linking', desc: 'Verbatim quote extraction' },
              ].map((item) => (
                <div key={item.title} className="card-elevated p-3 sm:p-4 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Track Selector */}
            <TrackSelector 
              selectedTrack={selectedTrack} 
              onTrackChange={setSelectedTrack} 
            />

            {/* File Upload Section */}
            <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3">
                <span className="step-indicator step-active text-xs sm:text-sm">1</span>
                <div>
                  <h2 className="font-semibold text-foreground text-sm sm:text-base">Upload Files</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Provide the story text and hypothetical backstory
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FileUpload
                  label="Story Narrative"
                  description="Complete novel text (.txt)"
                  onFileSelect={setStoryFile}
                  selectedFile={storyFile}
                />
                <FileUpload
                  label="Hypothetical Backstory"
                  description="Character backstory to verify"
                  onFileSelect={setBackstoryFile}
                  selectedFile={backstoryFile}
                />
              </div>

              {/* Story ID input */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Story ID <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  value={storyId}
                  onChange={(e) => setStoryId(e.target.value)}
                  placeholder="e.g., 1, 2, story_001..."
                  className="max-w-full sm:max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Used in the results.csv export. Auto-generated if not provided.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            {canSubmit && (
              <div className="flex justify-center animate-fade-in">
                <Button onClick={handleSubmit} size="lg" className="gap-2 w-full sm:w-auto">
                  Run Analysis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Info Note */}
            <div className="card-elevated p-3 sm:p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works</p>
                <p className="leading-relaxed">
                  The system extracts claims from the backstory, finds supporting or contradicting 
                  evidence in the narrative, and evaluates temporal, causal, and character constraints 
                  to produce a binary consistency judgment.
                </p>
              </div>
            </div>
          </div>
        )}

        {viewState === 'processing' && job && (
          <div className="max-w-3xl mx-auto space-y-4">
            <ProcessingView job={job} onRetry={job.status === 'failed' ? handleReset : undefined} />
            {job.status === 'failed' && (
              <div className="flex justify-center">
                <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                  ← Back to Upload
                </Button>
              </div>
            )}
          </div>
        )}

        {viewState === 'results' && job?.result && (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <Button variant="ghost" onClick={handleReset} className="order-2 sm:order-1">
                ← New Analysis
              </Button>
              <Button
                variant={showMetrics ? 'default' : 'outline'}
                onClick={() => setShowMetrics(!showMetrics)}
                className="order-1 sm:order-2"
              >
                {showMetrics ? 'Show Results' : 'Show Metrics'}
              </Button>
            </div>

            {showMetrics && metrics ? (
              <MetricsPanel metrics={metrics} />
            ) : (
              <ResultsView result={job.result} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 sm:mt-12 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Kharagpur Data Science Hackathon 2026 • 
            <a 
              href="https://pathway.com" 
              className="text-primary hover:underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Pathway
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}