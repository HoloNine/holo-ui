import { forwardRef } from "react";

export interface ThumbProps extends React.ComponentPropsWithoutRef<"div"> {
  position: { x: number; y: number };
}

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
  ({ position }, ref) => (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: `${position.y * 100}%`,
        left: `${position.x * 100}%`,
        transform: "translate(-50%, -50%)",
        width: "12px",
        height: "12px",
        border: "1px solid #000",
        background: "transparent",
      }}
    />
  )
);
