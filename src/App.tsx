import {Button} from "./components/ui/button"
import { Calendar } from "./components/ui/calendar";
import {Input} from "./components/ui/input"
function App() {
  return <>
  <Button>Hello there</Button>
  <Calendar mode="range" className="rounded-lg border"/>
  <Input></Input>
  </>
}

export default App;
