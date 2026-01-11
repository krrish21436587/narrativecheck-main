import { Metrics } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface MetricsPanelProps {
  metrics: Metrics;
}

function MetricValue({ label, value }: { label: string; value: number }) {
  const displayValue = (value * 100).toFixed(1);
  
  return (
    <div className="metric-card">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-3xl font-bold text-primary mt-1">
        {displayValue}%
      </span>
    </div>
  );
}

function ConfusionMatrix({ matrix }: { matrix: Metrics['confusionMatrix'] }) {
  const cells = [
    { label: 'TP', value: matrix.truePositive, isCorrect: true },
    { label: 'FP', value: matrix.falsePositive, isCorrect: false },
    { label: 'FN', value: matrix.falseNegative, isCorrect: false },
    { label: 'TN', value: matrix.trueNegative, isCorrect: true },
  ];

  return (
    <div className="card-elevated p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Confusion Matrix</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-2">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className={cn(
                'w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center border',
                cell.isCorrect 
                  ? 'bg-success/5 border-success/20' 
                  : 'bg-destructive/5 border-destructive/20'
              )}
            >
              <span className="text-xs font-mono text-muted-foreground">{cell.label}</span>
              <span className={cn(
                'text-xl sm:text-2xl font-bold',
                cell.isCorrect ? 'text-success' : 'text-destructive'
              )}>
                {cell.value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/20 border border-success/20" />
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/20" />
            <span>Incorrect</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const exportMetrics = () => {
    const content = [
      '# Evaluation Metrics',
      '',
      `Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%`,
      `Precision: ${(metrics.precision * 100).toFixed(2)}%`,
      `Recall: ${(metrics.recall * 100).toFixed(2)}%`,
      `F1 Score: ${(metrics.f1Score * 100).toFixed(2)}%`,
      '',
      '# Confusion Matrix',
      `True Positive: ${metrics.confusionMatrix.truePositive}`,
      `True Negative: ${metrics.confusionMatrix.trueNegative}`,
      `False Positive: ${metrics.confusionMatrix.falsePositive}`,
      `False Negative: ${metrics.confusionMatrix.falseNegative}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metrics.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to metrics.txt');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header mb-0">Evaluation Metrics</h3>
          <Button onClick={exportMetrics} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricValue label="Accuracy" value={metrics.accuracy} />
          <MetricValue label="Precision" value={metrics.precision} />
          <MetricValue label="Recall" value={metrics.recall} />
          <MetricValue label="F1 Score" value={metrics.f1Score} />
        </div>
      </div>

      <ConfusionMatrix matrix={metrics.confusionMatrix} />
    </div>
  );
}