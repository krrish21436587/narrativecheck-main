import { useCallback, useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { UploadedFile } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  description: string;
  accept?: string;
  onFileSelect: (file: UploadedFile | null) => void;
  selectedFile: UploadedFile | null;
}

export function FileUpload({
  label,
  description,
  accept = '.txt',
  onFileSelect,
  selectedFile,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const content = await file.text();
    onFileSelect({
      file,
      name: file.name,
      size: file.size,
      content,
    });
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getWordCount = (content?: string) => {
    if (!content) return 0;
    return content.split(/\s+/).filter(Boolean).length;
  };

  if (selectedFile) {
    return (
      <div className="card-elevated p-4 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)} • {getWordCount(selectedFile.content).toLocaleString()} words
              </p>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {selectedFile.content && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-mono text-muted-foreground line-clamp-2">
              {selectedFile.content.slice(0, 200)}...
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('upload-zone animate-fade-in', isDragging && 'active')}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        id={`file-upload-${label}`}
      />
      <label htmlFor={`file-upload-${label}`} className="cursor-pointer block">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse
          </p>
        </div>
      </label>
    </div>
  );
}