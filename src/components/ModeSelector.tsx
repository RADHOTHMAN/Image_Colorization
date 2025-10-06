import { Palette, ImageIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSelectorProps {
  mode: "colorize" | "grayscale";
  onModeChange: (mode: "colorize" | "grayscale") => void;
  disabled: boolean;
}

export const ModeSelector = ({ mode, onModeChange, disabled }: ModeSelectorProps) => {
  return (
    <div className="flex gap-4 p-2 bg-muted rounded-xl">
      <Button
        variant={mode === "colorize" ? "default" : "ghost"}
        onClick={() => onModeChange("colorize")}
        disabled={disabled}
        className="flex-1 gap-2"
      >
        <Palette className="w-5 h-5" />
        Colorize
      </Button>
      <Button
        variant={mode === "grayscale" ? "default" : "ghost"}
        onClick={() => onModeChange("grayscale")}
        disabled={disabled}
        className="flex-1 gap-2"
      >
        <ImageIcon className="w-5 h-5" />
        Grayscale
      </Button>
    </div>
  );
};
