
import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import moment from "moment";

import { db } from '../db'


import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};


const View = ({ collectionName, collectionColor }) => {
  const [dataSet, setDataSet] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [profit, setProfit] = React.useState(0);
  const [profitPercentage, setProfitPercentage] = React.useState(0);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('created', 'asc'))
    onSnapshot(q, (querySnapshot) => {
      const points = querySnapshot.docs.map(doc => doc.data()).filter(r => r.created && r.totalValue);
      const labels = points.map(point => moment(new Date(point.created.seconds * 1000)).format("DD/MM HH:mm"));
      const valuePoints = points.map(point => point.totalValue)
      const firstPoint = points[0]
      const lastPoint = points[points.length - 1]
      const profit = lastPoint.totalValue - firstPoint.totalValue;
      const profitPercentage = (profit * 1.0 / firstPoint.totalValue) * 100;

      setDataSet(valuePoints);
      setLabels(labels);
      setProfit(profit);
      setProfitPercentage(profitPercentage);
    })
  }, [collectionName])

  const data = {
    labels,
    datasets: [
      {
        label: collectionName,
        data: dataSet,
        borderColor: collectionColor || 'rgb(255, 99, 132)',
        backgroundColor: collectionColor || 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <div>
      <div>${profit.toFixed(2)} | {profitPercentage.toFixed(2)}%</div>
      <Line options={options} data={data} />
    </div>
  );
}

export default View;
