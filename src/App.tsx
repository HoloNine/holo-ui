import { Picker } from "@holo-ui/primitives";

const App = () => {
  return <Picker value="#ff0000" onChange={(color) => console.log(color)} />;
};

export default App;
