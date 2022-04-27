
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
import { collection, query, orderBy, where, Timestamp, doc, deleteDoc, getDocs } from "firebase/firestore"
import moment from "moment";

import { db } from '../db'


import { Line } from 'react-chartjs-2';

function formatCurrency(num) {
  return num.toLocaleString("en-US");
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function footerTooltipHandler(rawPoints) {
  return (tooltipItems) => {
    const point = rawPoints[tooltipItems[0].dataIndex];
    return JSON.stringify({ ...point, created: undefined }, null, 2);
  }
}

const View = ({ collectionName, collectionColor, days }) => {
  const [dataSet, setDataSet] = React.useState([]);
  const [dataSetVndr, setDataSetVndr] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [docIds, setDocIds] = React.useState([]);
  const [profit, setProfit] = React.useState(0);
  const [profitPercentage, setProfitPercentage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [rawPoints, setRawPoints] = React.useState([]);

  useEffect(() => {
    let daysNumber = 1;
    try {
      daysNumber = parseFloat(days);
    } catch (e) {
    }
    if (isNaN(daysNumber)) {
      daysNumber = 1;
    }
    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    timestamp.seconds -= daysNumber * 24 * 60 * 60;
    console.log(timestamp);
    const q = query(collection(db, collectionName), orderBy('created', 'asc'), where('created', '>', timestamp))
    getDocs(q).then(querySnapshot => {
      const points = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(r => r.created && r.totalValue);
      const ids = points.map(doc => doc.id);
      const labels = points.map(point => moment(new Date(point.created.seconds * 1000)).format("DD/MM HH:mm"));
      const valuePoints = points.map(point => point.totalValue)
      const valuePointsVndr = points.map(point => point.totalValue * point.poolPrice);
      const firstPoint = points[0]
      const lastPoint = points[points.length - 1]
      const profit = lastPoint.totalValue - firstPoint.totalValue;
      const profitPercentage = (profit * 1.0 / firstPoint.totalValue) * 100;

      setDataSet(valuePoints);
      setDataSetVndr(valuePointsVndr);
      setLabels(labels);
      setProfit(profit);
      setProfitPercentage(profitPercentage);
      setTotal(lastPoint.totalValue);
      setDocIds(ids);
      setRawPoints(points);
    });
  }, [collectionName, days])
  const data = {
    labels,
    datasets: [
      {
        label: "USDT",
        data: dataSet,
        borderColor: collectionColor || 'rgb(255, 99, 132)',
        backgroundColor: collectionColor || 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: "VNDR",
        data: dataSetVndr,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: collectionName,
      },
      tooltip: {
        callbacks: {
          footer: footerTooltipHandler(rawPoints),
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    onClick: function (evt, element) {
      if (element.length > 0) {
        var ind = element[0].index;
        if (window.confirm('Do you want to remove this point?')) {
          deleteDoc(doc(db, collectionName, docIds[ind]));
        }
      }
    },
  };

  return (
    <div>
      <div>${formatCurrency(total)} | ${profit.toFixed(2)} | {profitPercentage.toFixed(2)}%</div>
      <Line options={options} data={data} />
    </div>
  );
}

export default View;
