import * as React from "react";

const useDragTracking = (
  handleMove: (event: MouseEvent | TouchEvent) => void
) => {
  const animationFrameRef = React.useRef<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    const nativeEvent = event.nativeEvent as MouseEvent | TouchEvent;

    const moveListener = (moveEvent: MouseEvent | TouchEvent) => {
      // Use requestAnimationFrame for smooth updates
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          handleMove(moveEvent);
          animationFrameRef.current = null; // Reset RAF reference
        });
      }
    };

    const stopListening = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("mousemove", moveListener);
      document.removeEventListener("mouseup", stopListening);
      document.removeEventListener("touchmove", moveListener);
      document.removeEventListener("touchend", stopListening);
    };

    // Call handleMove for the initial click or touch
    handleMove(nativeEvent);

    // Start listening for movement
    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", stopListening);
    document.addEventListener("touchmove", moveListener);
    document.addEventListener("touchend", stopListening);
  };

  return { handleMouseDown };
};

export { useDragTracking };
