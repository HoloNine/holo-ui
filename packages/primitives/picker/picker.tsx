import * as React from "react";
import { AlphaSlider } from "./alpha-slider/alpha-slider";
import { HueSlider } from "./hue-slider/hue-slider";
import { Saturation } from "./saturation/saturation";
import { hsbToRgba } from "../../utils/color-utils";
import { ColorFormat } from "../../types/color.types";
import { useDidUpdate } from "../../hooks/use-did-update";

interface PickerProps {
  format?: ColorFormat;
  value: string;
  onChange: (value: string) => void;
}

const Picker = ({ format, value, onChange }: PickerProps) => {
  const formatRef = React.useRef(format);

  const [hue, setHue] = React.useState(0); // Hue is an angle from 0-360
  const [alpha, setAlpha] = React.useState(1); // Alpha (0-1)
  const [saturation, setSaturation] = React.useState(1); // Saturation (0-1)
  const [brightness, setBrightness] = React.useState(1); // Brightness (0-1)

  useDidUpdate(() => {
    if (isColorValid(value!) && !isScrubbingRef.current) {
      setParsed(parseColor(value!));
    }
  }, [value]);

  // Handle changes from the HueSlider
  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    updateColor(newHue, saturation, brightness, alpha);
  };

  // Handle changes from the AlphaSlider
  const handleAlphaChange = (newAlpha: number) => {
    setAlpha(newAlpha);
    updateColor(hue, saturation, brightness, newAlpha);
  };

  // Handle changes from the Saturation component
  const handleSaturationChange = (
    newSaturation: number,
    newBrightness: number
  ) => {
    setSaturation(newSaturation);
    setBrightness(newBrightness);
    updateColor(hue, newSaturation, newBrightness, alpha);
  };

  // Update the color and notify the parent component
  const updateColor = (h: number, s: number, b: number, a: number) => {
    const rgbaColor = hsbToRgba(h, s * 100, b * 100, a); // Convert to RGBA format
    onChange(rgbaColor); // Call the parent with the new color
  };

  return (
    <div className="color-picker">
      <Saturation
        hue={hue}
        saturation={saturation}
        brightness={brightness}
        onChange={handleSaturationChange}
      />
      <HueSlider value={hue} onChange={handleHueChange} />
      <AlphaSlider value={alpha} onChange={handleAlphaChange} />
    </div>
  );
};

export { Picker };
