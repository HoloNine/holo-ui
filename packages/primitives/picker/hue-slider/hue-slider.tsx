import * as React from "react";
import { useDidUpdate, useMergedRef, useMove } from "../../../hooks";
import { Thumb } from "../thumb/thumb";

interface HueSliderProps {
  value: number;
  maxValue?: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

const HueSlider = (
  {
    value,
    onChange,
    maxValue = 360,
    onChangeEnd,
    onScrubEnd,
    onScrubStart,
  }: HueSliderProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const [position, setPosition] = React.useState({ y: 0, x: value / maxValue });
  const positionRef = React.useRef(position);
  const getChangeValue = (val: number) => val * maxValue;
  const { ref: sliderRef } = useMove(
    ({ x, y }) => {
      positionRef.current = { x, y };
      onChange?.(getChangeValue(x));
    },
    {
      onScrubEnd: () => {
        const { x } = positionRef.current;
        onChangeEnd?.(getChangeValue(x));
        onScrubEnd?.();
      },
      onScrubStart,
    }
  );

  useDidUpdate(() => {
    setPosition({ y: 0, x: value / maxValue });
  }, [value]);

  return (
    <div
      className="hue-slider"
      ref={useMergedRef(sliderRef, ref)}
      style={{
        position: "relative",
        width: "100%",
        height: "20px",
        background:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      }}
    >
      <Thumb position={position} />
    </div>
  );
};

export { HueSlider };
