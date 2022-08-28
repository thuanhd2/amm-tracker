import { useState } from 'react';
import queryString from "query-string";
import './App.css';
import TrackingChart from "./charts"

function App() {
  const [days, setDays] = useState(1);
  let defaultCollectionNames = ["thuanhoremi"]
  const query = queryString.parse(window.location.search);
  console.log(query);
  const paramsUsernames = query && query.u ? query.u.split(",") : null;
  if (paramsUsernames) {
    defaultCollectionNames = paramsUsernames;
  }
  return (
    <div className="App">
      <input onChange={v => setDays(v.target.value)} value={days} />
      {
        defaultCollectionNames.map(collectionName =>
          <div key={collectionName}>
            <hr />
            <TrackingChart collectionName={collectionName} days={days} />
          </div>
        )
      }
    </div>
  );
}

export default App;
