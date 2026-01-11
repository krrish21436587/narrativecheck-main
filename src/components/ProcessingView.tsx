import { useEffect, useRef } from 'react';
import { Loader2, Check, AlertCircle, Info, Clock } from 'lucide-react';
import { AnalysisJob, ProcessingLog } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ProcessingViewProps {
  job: AnalysisJob;
  onRetry?: () => void;
}

const PHASES = [
  { key: 'chunking', label: 'Text Chunking', description: 'Splitting narrative into segments' },
  { key: 'embedding', label: 'Embedding Generation', description: 'Creating vector representations' },
  { key: 'reasoning', label: 'Reasoning Analysis', description: 'Evaluating consistency' },
  { key: 'complete', label: 'Complete', description: 'Analysis finished' },
];

function LogIcon({ level }: { level: ProcessingLog['level'] }) {
  switch (level) {
    case 'success':
      return <Check className="w-3 h-3 text-success" />;
    case 'warning':
      return <AlertCircle className="w-3 h-3 text-warning" />;
    case 'error':
      return <AlertCircle className="w-3 h-3 text-destructive" />;
    default:
      return <Info className="w-3 h-3 text-muted-foreground" />;
  }
}

export function ProcessingView({ job, onRetry }: ProcessingViewProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [job.logs]);

  const isFailed = job.status === 'failed';
  const currentPhaseIndex = isFailed ? -1 : PHASES.findIndex(p => p.key === job.status);
  const elapsedTime = job.endTime 
    ? Math.round((job.endTime.getTime() - job.startTime.getTime()) / 1000)
    : Math.round((new Date().getTime() - job.startTime.getTime()) / 1000);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card-elevated p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={cn(
              'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0',
              isFailed ? 'bg-destructive/10' : 'bg-primary/10'
            )}>
              {isFailed ? (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
              ) : (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground text-sm sm:text-base">
                {isFailed ? 'Analysis Failed' : 'Processing Analysis'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Story: {job.storyFileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm shrink-0">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-mono">{elapsedTime}s</span>
          </div>
        </div>

        {/* Error message */}
        {isFailed && job.error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
            {job.error}
          </div>
        )}

        {/* Retry button */}
        {isFailed && onRetry && (
          <div className="mb-4">
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{job.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${job.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Phase Steps */}
      <div className="card-elevated p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Processing Steps</h3>
        <div className="space-y-2 sm:space-y-3">
          {PHASES.map((phase, index) => {
            const isActive = phase.key === job.status;
            const isComplete = index < currentPhaseIndex || job.status === 'complete';
            const isPending = index > currentPhaseIndex;

            return (
              <div
                key={phase.key}
                className={cn(
                  'flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg transition-colors',
                  isActive && 'bg-primary/5'
                )}
              >
                <div className={cn(
                  'step-indicator w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm',
                  isComplete && 'step-complete',
                  isActive && 'step-active',
                  isPending && 'step-pending'
                )}>
                  {isComplete ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : isActive ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium text-sm sm:text-base',
                    isActive && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}>
                    {phase.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{phase.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logs */}
      <div className="card-elevated p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Processing Log</h3>
        <div className="bg-muted/50 rounded-lg border border-border p-2 sm:p-4 max-h-40 sm:max-h-48 overflow-y-auto overflow-x-hidden">
          <div className="space-y-1">
            {job.logs.map((log) => (
              <div
                key={log.id}
                className={cn('log-entry flex items-start gap-1 sm:gap-2 text-[10px] sm:text-xs', `log-${log.level}`)}
              >
                <LogIcon level={log.level} />
                <span className="text-muted-foreground/60 shrink-0 hidden sm:inline">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-primary/70 shrink-0">[{log.phase}]</span>
                <span className="break-words min-w-0">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}