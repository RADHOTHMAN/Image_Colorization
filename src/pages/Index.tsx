import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageComparison } from "@/components/ImageComparison";
import { ModeSelector } from "@/components/ModeSelector";
import { convertToGrayscale, fileToBase64 } from "@/utils/imageProcessing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mode, setMode] = useState<"colorize" | "grayscale">("colorize");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file: File) => {
    try {
      const imageUrl = await fileToBase64(file);
      setOriginalImage(imageUrl);
      setProcessedImage(null);
      await processImage(file);
    } catch (error) {
      console.error("Error loading image:", error);
      toast.error("Failed to load image");
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProcessedImage(null);

    try {
      if (mode === "grayscale") {
        const grayscaleImage = await convertToGrayscale(file);
        setProcessedImage(grayscaleImage);
        toast.success("Image converted to grayscale!");
      } else {
        const imageData = await fileToBase64(file);
        
        const { data, error } = await supabase.functions.invoke("colorize-image", {
          body: { imageData },
        });

        if (error) {
          if (error.message.includes("429")) {
            toast.error("Rate limit exceeded. Please try again later.");
          } else if (error.message.includes("402")) {
            toast.error("Payment required. Please add credits to your workspace.");
          } else {
            throw error;
          }
          return;
        }

        if (data?.colorizedImage) {
          setProcessedImage(data.colorizedImage);
          toast.success("Image colorized successfully!");
        } else {
          throw new Error("No colorized image received");
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Image Colorizer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform grayscale images into vibrant color photos, or convert color images to classic black and white
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl shadow-glow p-8 space-y-8 animate-fade-in backdrop-blur-sm border border-border/50">
            <ModeSelector mode={mode} onModeChange={setMode} disabled={isProcessing} />

            {!originalImage ? (
              <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />
            ) : (
              <div className="space-y-6">
                <ImageComparison
                  originalImage={originalImage}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  mode={mode}
                />
                <div className="flex justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                  >
                    Upload New Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by Lovable Cloud • Free during beta period</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
