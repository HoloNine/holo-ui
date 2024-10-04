import * as React from "react";
import { Thumb } from "../thumb/thumb";

import { useDragTracking } from "../../../hooks/use-drag-tracking";

interface SaturationProps {
  hue: number; // Current hue value as a string
  saturation: number; // Current saturation value (0-1)
  brightness: number; // Current brightness value (0-1)
  onChange: (saturation: number, brightness: number) => void; // Callback for changes
}

const Saturation = ({
  hue,
  saturation,
  brightness,
  onChange,
}: SaturationProps) => {
  const saturationRef = React.useRef<HTMLDivElement>(null);

  // Function to handle dragging and clicking on the saturation area
  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!saturationRef.current) return;

    // Get the bounding rectangle of the saturation area
    const { left, top, width, height } =
      saturationRef.current.getBoundingClientRect();

    // Get the mouse or touch position
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      "touches" in event ? event.touches[0].clientY : event.clientY;

    // Calculate the relative position within the saturation area (0 - 1)
    const relativeX = Math.min(Math.max(clientX - left, 0), width) / width;
    const relativeY = Math.min(Math.max(clientY - top, 0), height) / height;

    // Convert the relative positions to saturation and brightness values
    const newSaturation = relativeX; // x-axis controls saturation (0-1)
    const newBrightness = 1 - relativeY; // y-axis controls brightness (inverted, 0-1)

    // Update the saturation and brightness values
    onChange(newSaturation, newBrightness);
  };

  // Handle mouse or touch drag
  const { handleMouseDown } = useDragTracking(handleMove);

  // Calculate the thumb position based on the current saturation and brightness values
  const thumbX = saturation * 100;
  const thumbY = (1 - brightness) * 100;

  return (
    <div
      className="saturation"
      ref={saturationRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ position: "relative", width: "100%", height: "200px" }}
    >
      {/* Render the hue overlay as the background */}
      <div
        className="saturation-gradient"
        style={{
          background: `linear-gradient(to right, white, ${hue}), linear-gradient(to top, black, transparent)`,
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "4px",
        }}
      />
      {/* Render the thumb with x and y coordinates */}
      <Thumb
        position={{ x: thumbX, y: thumbY }}
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%)`,
        }}
      />
    </div>
  );
};

export { Saturation };
