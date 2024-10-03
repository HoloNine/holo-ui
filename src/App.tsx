import { ColorPicker } from "@holo-ui/primitives";

const App = () => {
  return (
    <ColorPicker value="#ff0000" onChange={(color) => console.log(color)} />
  );
};

export default App;
