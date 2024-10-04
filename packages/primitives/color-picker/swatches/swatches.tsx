import * as React from "react";

interface SwatchesProps {
  colors: string[]; // Array of hex color codes
  onSelect: (color: string) => void;
}

const Swatches = ({ colors, onSelect }: SwatchesProps) => {
  return (
    <div className="swatches">
      {colors.map((color) => (
        <div
          key={color}
          className="swatch"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
};

export { Swatches };
