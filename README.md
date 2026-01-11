# 🧠 Narrative Consistency Checker  
**Kharagpur Data Science Hackathon (KDSH) 2026**

An AI-powered system for validating whether a hypothetical character backstory is logically consistent with a long-form fictional narrative using causal reasoning, temporal tracking, and evidence-based verification.

---

## 🌐 Live Application  
**Access the system here:**  
👉 https://narrativecheck.lovable.app/

---

## 🚀 What This Project Does

Modern stories, novels, and fictional universes are massive — often exceeding 100,000 words — making it nearly impossible to manually verify whether a character’s claimed past aligns with what actually happened in the story.

The **Narrative Consistency Checker** solves this by:

- Extracting claims from a hypothetical backstory  
- Locating supporting or contradicting evidence inside a long narrative  
- Tracking events across time  
- Applying causal and character-based constraints  
- Producing a **binary consistency verdict**  
- Providing **verbatim evidence quotes** from the original text  

This allows writers, editors, game designers, and narrative AI systems to validate story logic automatically.

---

## 🧩 Core Capabilities

### 📚 Long-Context Reasoning  
Processes full novels (100,000+ words) without losing continuity.

### 🧠 Causal & Temporal Tracking  
Understands how events affect one another across time.

### 🧬 Constraint-Based Logic  
Tracks character, timeline, and world-state constraints to detect contradictions.

### 🔍 Evidence Linking  
Every verdict is backed by **exact quotes** extracted from the story.

### 📊 Structured Output  
Results are exportable in machine-readable format for downstream analysis.

---

## 🛤 Supported Research Tracks

This system supports two evaluation pipelines, allowing both symbolic and neural reasoning approaches:

### **Track A — NLP & Generative AI**  
Uses the **Pathway framework** to:
- Extract claims  
- Search long documents  
- Align story evidence  
- Perform LLM-based reasoning  

### **Track B — BDH-Driven Narrative Reasoning**  
Uses a structured **Behavior-Driven Hypothesis (BDH)** model to:
- Track story state over time  
- Enforce narrative constraints  
- Perform consistency checking using symbolic logic  

---

## 🧪 How It Works

1. **Input Ingestion**  
   - The full story (novel or narrative text)  
   - A hypothetical character backstory  

2. **Claim Extraction**  
   The system extracts factual claims from the backstory  
   *(e.g., “The character lost his arm before the war”)*  

3. **Evidence Mining**  
   The system searches the story for relevant passages  

4. **Constraint Tracking**  
   Time, causality, and character state are tracked across the narrative  

5. **Reasoning & Verdict**  
   The system evaluates whether all claims are consistent  
   Output is **CONSISTENT** or **INCONSISTENT**  

6. **Explainability Layer**  
   Supporting or contradicting quotes are returned verbatim  

---

## 📥 Inputs

| Field | Description |
|------|-------------|
| **Story Narrative** | Complete novel or story text (`.txt`) |
| **Hypothetical Backstory** | Character backstory to verify (`.txt`) |
| **Story ID (optional)** | Used for exporting structured results |

---

## 📤 Output

The system produces:

- A **binary consistency judgment**  
- A structured `results.csv`  
- Evidence excerpts for each evaluated claim  
- Constraint violation logs (for Track B)  

---

## 🏗 Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn UI  
- **Reasoning Engine:** Pathway + custom narrative logic  
- **Data Processing:** Streaming document ingestion, constraint tracking  
- **Output:** Structured CSV + explainable evidence links  

---

## 🎯 Why This Matters

Large fictional universes power:
- Games  
- Movies  
- AI roleplay  
- Interactive storytelling  
- Writer collaboration tools  

Yet they suffer from:
- Retcons  
- Plot holes  
- Character inconsistencies  

This project provides a **scalable, automated solution** to narrative integrity — turning stories into verifiable systems.

---

## 🏆 Hackathon Context

Built for  
**Kharagpur Data Science Hackathon 2026**

Theme: **AI-Driven Narrative Intelligence & Reasoning Systems**

---

## 📌 Project Vision

We envision a future where:
- Stories are logically validated like code  
- Character histories are machine-verifiable  
- AI systems can reason about fiction with human-level consistency  

This project is a step toward **formal narrative intelligence**.

---

**Narrative Consistency Checker — Making stories provably coherent.**
