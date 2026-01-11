import { Track } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Cpu, Sparkles } from 'lucide-react';

interface TrackSelectorProps {
  selectedTrack: Track;
  onTrackChange: (track: Track) => void;
}

export function TrackSelector({ selectedTrack, onTrackChange }: TrackSelectorProps) {
  return (
    <div className="card-elevated p-3 sm:p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Select Track</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onTrackChange('A')}
          className={cn(
            'p-3 sm:p-4 rounded-lg border-2 text-left transition-all',
            selectedTrack === 'A'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/30'
          )}
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Sparkles className={cn(
              'w-4 h-4',
              selectedTrack === 'A' ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'font-semibold text-sm sm:text-base',
              selectedTrack === 'A' ? 'text-primary' : 'text-foreground'
            )}>
              Track A
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            NLP & Generative AI approach using Pathway framework
          </p>
        </button>

        <button
          onClick={() => onTrackChange('B')}
          className={cn(
            'p-3 sm:p-4 rounded-lg border-2 text-left transition-all',
            selectedTrack === 'B'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/30'
          )}
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Cpu className={cn(
              'w-4 h-4',
              selectedTrack === 'B' ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'font-semibold text-sm sm:text-base',
              selectedTrack === 'B' ? 'text-primary' : 'text-foreground'
            )}>
              Track B
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            BDH-Driven Continuous Narrative Reasoning
          </p>
        </button>
      </div>
    </div>
  );
}