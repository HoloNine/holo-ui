import * as React from "react";
import { Thumb } from "../thumb/thumb";

import { useDragTracking } from "../../../hooks/use-drag-tracking";

interface HueSliderProps {
  value: number; // Current hue value (0-360)
  onChange: (value: number) => void; // Callback when hue changes
}

const HueSlider = ({ value, onChange }: HueSliderProps) => {
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

    // Convert the relative position to a hue value (0 - 360)
    const newHue = relativeX * 360;

    // Update the hue value
    onChange(newHue);
  };

  // Handle mouse or touch drag
  const { handleMouseDown } = useDragTracking(handleMove);

  // Calculate the thumb position as a percentage of the width
  const thumbX = (value / 360) * 100;
  const thumbY = 50; // Fixed vertical position at 50% for horizontal sliders

  return (
    <div
      className="hue-slider"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ position: "relative", width: "100%", height: "20px" }}
    >
      <div
        className="hue-gradient"
        style={{
          background:
            "linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)",
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

export { HueSlider };
