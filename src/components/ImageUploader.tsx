import { Upload } from "lucide-react";
import { useCallback } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

export const ImageUploader = ({ onImageSelect, isProcessing }: ImageUploaderProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative border-2 border-dashed border-border rounded-xl p-12 text-center transition-all hover:border-primary hover:bg-muted/50 cursor-pointer group"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground mb-1">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, and WebP formats
          </p>
        </div>
      </div>
    </div>
  );
};
