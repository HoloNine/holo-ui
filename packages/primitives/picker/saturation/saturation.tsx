import * as React from "react";
import { useMove } from "../../../hooks";
import { Thumb } from "../thumb/thumb";
import { HsvaColor } from "../../../types/color.types";

interface SaturationProps {
  onChange: (value: { s: number; v: number }) => void;
  onChangeEnd?: (value: { s: number; v: number }) => void;
  value: HsvaColor;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

const Saturation = ({
  onChange,
  onChangeEnd,
  value,
  onScrubStart,
  onScrubEnd,
}: SaturationProps) => {
  const [position, setPosition] = React.useState({
    x: value.s / 100,
    y: 1 - value.v / 100,
  });
  const positionRef = React.useRef(position);

  const { ref } = useMove(
    ({ x, y }) => {
      positionRef.current = { x, y };
      onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
    },
    {
      onScrubEnd: () => {
        const { x, y } = positionRef.current;
        onChangeEnd?.({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
        onScrubEnd?.();
      },
      onScrubStart,
    }
  );

  React.useEffect(() => {
    setPosition({ x: value.s / 100, y: 1 - value.v / 100 });
  }, [value.s, value.v]);

  return (
    <div
      ref={ref as any}
      style={{
        position: "relative",
        width: "100%",
        height: "200px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `hsl(${value.h}, 100%, 50%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(90deg, #fff, transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(0deg, #000, transparent)",
        }}
      />

      <Thumb position={position} />
    </div>
  );
};

export { Saturation };
