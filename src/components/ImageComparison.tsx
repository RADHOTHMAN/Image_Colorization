import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  mode: "colorize" | "grayscale";
}

export const ImageComparison = ({
  originalImage,
  processedImage,
  isProcessing,
  mode,
}: ImageComparisonProps) => {
  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `processed-${mode}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Original
        </h3>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-card">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Processed
        </h3>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-card">
          {isProcessing ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {mode === "colorize" ? "Colorizing image..." : "Converting to grayscale..."}
                </p>
              </div>
            </div>
          ) : processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-full object-contain animate-fade-in"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Awaiting processing...
            </div>
          )}
        </div>
      </div>

      {processedImage && !isProcessing && (
        <div className="md:col-span-2 flex justify-center animate-fade-in">
          <Button
            onClick={handleDownload}
            size="lg"
            className="gap-2 shadow-glow"
          >
            <Download className="w-5 h-5" />
            Download Processed Image
          </Button>
        </div>
      )}
    </div>
  );
};
