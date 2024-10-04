import * as React from "react";
import { Thumb } from "../thumb/thumb";

import { useDragTracking } from "../../../hooks/use-drag-tracking";

interface AlphaSliderProps {
  value: number; // Current alpha value (0-1)
  onChange: (value: number) => void; // Callback when alpha changes
}

const AlphaSlider = ({ value, onChange }: AlphaSliderProps) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // Function to handle dragging and clicking on the slider
  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;

    // Get the bounding rectangle of the slider
    const { left, width } = sliderRef.current.getBoundingClientRect();

    // Get the mouse or touch position
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;

    // Calculate the relative position within the slider (0 - 1)
    const relativeX = Math.min(Math.max(clientX - left, 0), width) / width;

    // Convert the relative position to an alpha value (0 - 1)
    const newAlpha = relativeX;

    // Update the alpha value
    onChange(newAlpha);
  };

  const { handleMouseDown } = useDragTracking(handleMove);

  // Calculate the thumb position as a percentage of the width
  const thumbX = value * 100;
  const thumbY = 50; // Fixed vertical position at 50% for horizontal sliders

  return (
    <div
      className="alpha-slider"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ position: "relative", width: "100%", height: "20px" }}
    >
      <div
        className="alpha-gradient"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0, 0, 0, 1))",
          width: "100%",
          height: "100%",
          borderRadius: "4px",
        }}
      />
      <Thumb
        position={{ x: thumbX, y: thumbY }} // Pass the new position object
        style={{
          position: "absolute",
          top: "50%",
          transform: `translateX(-50%) translateY(-50%)`,
        }}
      />
    </div>
  );
};

export { AlphaSlider };
