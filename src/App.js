import { useState } from 'react';
import './App.css';
import TrackingChart from "./charts"

function App() {
  const [days, setDays] = useState(1);
  return (
    <div className="App">
      <input onChange={v => setDays(v.target.value)} value={days} />
      <hr />
      <TrackingChart days={days} collectionName={"thuanhoremi"} />
      <hr />
      <TrackingChart days={days} collectionName={"hdthuan"} collectionColor="blue" />
    </div>
  );
}

export default App;
