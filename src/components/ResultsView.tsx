import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Quote,
  Clock,
  AlertTriangle,
  Download,
  Copy
} from 'lucide-react';
import { AnalysisResult, Claim, Evidence, ConstraintAnalysis, ExportRow } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ResultsViewProps {
  result: AnalysisResult;
}

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <Quote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm italic text-foreground">"{evidence.quote}"</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span>{evidence.chapterRef}</span>
            <span className="badge badge-track">
              {(evidence.relevanceScore * 100).toFixed(0)}% relevance
            </span>
          </div>
          {evidence.analysisNote && (
            <p className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
              <strong>Analysis:</strong> {evidence.analysisNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ClaimCard({ claim }: { claim: Claim }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-elevated overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="shrink-0 mt-0.5">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground">{claim.text}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={cn(
              'badge',
              claim.status === 'supported' && 'badge-supported',
              claim.status === 'contradicted' && 'badge-contradicted',
              claim.status === 'unverified' && 'badge-unverified'
            )}>
              {claim.status}
            </span>
            <span className="text-xs text-muted-foreground">
              {claim.evidence.length} excerpt{claim.evidence.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-muted-foreground">
              {(claim.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>
      </button>
      
      {expanded && claim.evidence.length > 0 && (
        <div className="px-4 pb-4 pl-11 space-y-3 animate-fade-in">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Linked Excerpts from Primary Text
          </h4>
          {claim.evidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConstraintCard({ constraint }: { constraint: ConstraintAnalysis }) {
  const icons = {
    temporal: Clock,
    causal: ChevronRight,
    character: CheckCircle2,
    factual: CheckCircle2,
    spatial: AlertTriangle,
  };
  const Icon = icons[constraint.constraintType] || AlertTriangle;

  return (
    <div className={cn(
      'constraint-card',
      constraint.status === 'satisfied' && 'constraint-satisfied',
      constraint.status === 'violated' && 'constraint-violated',
      constraint.status === 'uncertain' && 'constraint-uncertain'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          constraint.status === 'satisfied' && 'bg-success/20 text-success',
          constraint.status === 'violated' && 'bg-destructive/20 text-destructive',
          constraint.status === 'uncertain' && 'bg-warning/20 text-warning'
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {constraint.constraintType}
            </span>
            <span className={cn(
              'text-xs font-medium capitalize',
              constraint.status === 'satisfied' && 'text-success',
              constraint.status === 'violated' && 'text-destructive',
              constraint.status === 'uncertain' && 'text-warning'
            )}>
              {constraint.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{constraint.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ResultsView({ result }: ResultsViewProps) {
  const isConsistent = result.consistencyLabel === 1;

  const exportCSV = () => {
    const row: ExportRow = {
      storyId: result.storyId,
      prediction: result.consistencyLabel,
      rationale: result.rationale,
    };
    
    const csvContent = [
      'Story ID,Prediction,Rationale',
      `${row.storyId},${row.prediction},"${row.rationale.replace(/"/g, '""')}"`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to results.csv');
  };

  const copyResults = () => {
    const text = `Story ID: ${result.storyId}\nPrediction: ${result.consistencyLabel}\nRationale: ${result.rationale}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Main Result */}
      <div className={cn(
        'card-elevated p-4 sm:p-6 md:p-8',
        isConsistent ? 'border-success/30' : 'border-destructive/30'
      )}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className={cn(
            'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0',
            isConsistent ? 'bg-success/10' : 'bg-destructive/10'
          )}>
            {isConsistent ? (
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-success" />
            ) : (
              <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isConsistent ? 'Consistent' : 'Inconsistent'}
              </h2>
              <span className={cn(
                'badge text-xs sm:text-sm',
                isConsistent ? 'badge-consistent' : 'badge-inconsistent'
              )}>
                Label: {result.consistencyLabel}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
              <span>Story: <strong className="text-foreground">{result.storyId}</strong></span>
              <span>{(result.overallConfidence * 100).toFixed(1)}%</span>
              <span>{(result.processingTime / 1000).toFixed(1)}s</span>
              <span className="badge badge-track">Track {result.track}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Rationale</h3>
          <p className="text-sm sm:text-base text-foreground">{result.rationale}</p>
        </div>

        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Detailed Explanation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
          <Button onClick={exportCSV} variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={copyResults} variant="ghost" size="sm" className="w-full sm:w-auto">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      {/* Evidence Dossier */}
      <div className="card-elevated p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
          Evidence Dossier
          <span className="text-muted-foreground text-xs sm:text-sm font-normal ml-2">
            ({result.claims.length} claims)
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Each backstory claim is linked to verbatim excerpts from the primary text.
        </p>
        <div className="space-y-3">
          {result.claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>

      {/* Constraint Analysis */}
      <div className="card-elevated p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Constraint Analysis</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Evaluation of temporal, causal, character, and factual constraints.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.constraintAnalysis.map((constraint) => (
            <ConstraintCard key={constraint.id} constraint={constraint} />
          ))}
        </div>
      </div>
    </div>
  );
}