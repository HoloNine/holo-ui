import * as React from "react";
import { useDidUpdate, useMergedRef, useMove } from "../../../hooks";
import { Thumb } from "../thumb/thumb";

interface AlphaSliderProps {
  value: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  maxValue?: number;
}

const AlphaSlider = (
  {
    value,
    maxValue = 1,
    onChange,
    onChangeEnd,
    onScrubStart,
    onScrubEnd,
  }: AlphaSliderProps,
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
      className="alpha-slider"
      ref={useMergedRef(sliderRef, ref)}
      style={{ position: "relative", width: "100%", height: "20px" }}
    >
      <Thumb position={position} />
    </div>
  );
};

export { AlphaSlider };
