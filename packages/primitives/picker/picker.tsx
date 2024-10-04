import * as React from "react";
import { AlphaSlider } from "./alpha-slider/alpha-slider";
import { HueSlider } from "./hue-slider/hue-slider";
import { Saturation } from "./saturation/saturation";
import { useDidUpdate } from "../../hooks/use-did-update";
import { ColorFormat, HsvaColor } from "../../types/color.types";
import { isColorValid, parseColor } from "../../utils/parsers";
import { convertHsvaTo } from "@holo-ui/utils/converters";

interface PickerProps {
  format?: ColorFormat;
  value: string;
  onChange: (value: string) => void;
  onChangeEnd?: (value: string) => void;
}

const Picker = ({ format, value, onChange, onChangeEnd }: PickerProps) => {
  const formatRef = React.useRef(format);
  const valueRef = React.useRef<string>();
  const scrubTimeoutRef = React.useRef<number>(-1);
  const isScrubbingRef = React.useRef(false);

  const [_value, setValue] = React.useState(value);

  const [parsed, setParsed] = React.useState<HsvaColor>(parseColor(_value));

  useDidUpdate(() => {
    if (isColorValid(value!)) {
      setParsed(parseColor(value!));
    }
  }, [value]);

  useDidUpdate(() => {
    formatRef.current = format;
    setValue(convertHsvaTo(format!, parsed));
  }, [format]);

  const handleChange = (color: Partial<HsvaColor>) => {
    setParsed((current) => {
      const next = { ...current, ...color };
      valueRef.current = convertHsvaTo(formatRef.current!, next);
      return next;
    });

    setValue(valueRef.current!);
    onChange(valueRef.current!);
  };

  const startScrubbing = () => {
    window.clearTimeout(scrubTimeoutRef.current);
    isScrubbingRef.current = true;
  };

  const stopScrubbing = () => {
    window.clearTimeout(scrubTimeoutRef.current);
    scrubTimeoutRef.current = window.setTimeout(() => {
      isScrubbingRef.current = false;
    }, 200);
  };

  return (
    <div className="color-picker">
      <Saturation
        value={parsed}
        onChange={handleChange}
        onChangeEnd={({ s, v }) =>
          onChangeEnd?.(
            convertHsvaTo(formatRef.current!, { ...parsed, s: s!, v: v! })
          )
        }
        onScrubStart={startScrubbing}
        onScrubEnd={stopScrubbing}
      />
      <HueSlider
        value={parsed.h}
        onChange={(h) => handleChange({ h })}
        onChangeEnd={(h) =>
          onChangeEnd?.(convertHsvaTo(formatRef.current!, { ...parsed, h }))
        }
        onScrubStart={startScrubbing}
        onScrubEnd={stopScrubbing}
      />
      <AlphaSlider
        value={parsed.a}
        onChange={(a) => handleChange({ a })}
        onChangeEnd={(a) => {
          onChangeEnd?.(convertHsvaTo(formatRef.current!, { ...parsed, a }));
        }}
        onScrubStart={startScrubbing}
        onScrubEnd={stopScrubbing}
      />
    </div>
  );
};

export { Picker };
