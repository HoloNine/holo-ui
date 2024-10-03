import * as React from "react";

const useDragTracking = (
  handleMove: (event: MouseEvent | TouchEvent) => void
) => {
  const animationFrameRef = React.useRef<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    const nativeEvent = event.nativeEvent as MouseEvent | TouchEvent;

    // Ensure that the animation frame is reset at the start of a new drag interaction
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const moveListener = (moveEvent: MouseEvent | TouchEvent) => {
      // Use requestAnimationFrame for smooth updates
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          handleMove(moveEvent);
          animationFrameRef.current = null; // Reset RAF reference after move
        });
      }
    };

    const stopListening = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
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
