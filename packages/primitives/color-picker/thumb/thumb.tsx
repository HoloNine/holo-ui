import React from "react";

interface ThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  position: { x: number; y: number };
}

const Thumb = ({ position, ...props }: ThumbProps) => {
  return (
    <div
      {...props}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        position: "absolute",
        width: "8px",
        height: "8px",
        backgroundColor: "black",
      }}
      className="thumb"
    />
  );
};

export { Thumb };
