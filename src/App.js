import './App.css';
import TrackingChart from "./charts"

function App() {
  return (
    <div className="App">
      <hr />
      <TrackingChart collectionName={"hdthuan"} collectionColor="blue" />
      <hr />
      <TrackingChart collectionName={"thuanhoremi"} />
    </div>
  );
}

export default App;
