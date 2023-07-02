import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = (props) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: 'Quantity',
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
      },
    },
  });

  useEffect(() => {
    if (props.by === 'MRP') {
      // Fetch data from stockSummary for MRP chart
      fetch('http://localhost:5000/stockSummary')
        .then(response => response.json())
        .then(data => {
          const series = [{
            data: data.map(item => item.pricePerUnit),
          }];
          const categories = data.map(item => item.type);

          setChartData(prevData => ({
            ...prevData,
            series,
            options: {
              ...prevData.options,
              xaxis: {
                ...prevData.options.xaxis,
                categories,
              },
            },
          }));
        })
        .catch(error => console.log(error));
    } else if (props.by === 'pendingOrder-availableStock') {
      // Fetch data from the database
      Promise.all([
        fetch('http://localhost:5000/stockSummary').then((response) => response.json()),
        fetch('http://localhost:5000/orders').then((response) => response.json()),
      ])
        .then(([stockData, orderData]) => {
          // Merge and sum quantities for stock types
          const stockQuantityMap = stockData.reduce((map, item) => {
            const { type, quantity } = item;
            if (map.has(type)) {
              map.set(type, map.get(type) + quantity);
            } else {
              map.set(type, quantity);
            }
            return map;
          }, new Map());

          // Merge and sum quantities for order types
          const orderQuantityMap = orderData.reduce((map, item) => {
            const { type, quantity } = item;
            if (map.has(type)) {
              map.set(type, map.get(type) + quantity);
            } else {
              map.set(type, quantity);
            }
            return map;
          }, new Map());

          // Extract merged types and quantities for stock and order
          const stockTypes = Array.from(stockQuantityMap.keys());
          const stockQuantities = Array.from(stockQuantityMap.values());
          const orderTypes = Array.from(orderQuantityMap.keys());
          const orderQuantities = Array.from(orderQuantityMap.values());

          // Combine stock and order types
          const categories = [...stockTypes, ...orderTypes];
          // so that categories do not repeat on x axis
          const uniqueCategories = [...new Set(categories)];

          setChartData((prevData) => ({
            ...prevData,
            options: {
              ...prevData.options,
              xaxis: {
                ...prevData.options.xaxis,
                categories: uniqueCategories,
              },
            },
            series: [
              {
                name: 'Pending Orders',
                data: orderQuantities,
              },
              {
                name: 'Remaining Stock',
                data: stockQuantities,
              },
            ],
          }));
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line
  }, []);


  return (
    <div className='m-3 p-3' style={{ border: '1px solid black', width: '400px', height: '450px', borderRadius: '10px', backgroundColor: 'azure' }}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={380}
      />
      {props.by === 'MRP' ? (
        <span className='chart-heading'>Stock by MRP</span>
      ) : (
        <span className='chart-heading'>Pending Orders vs Available Stock</span>
      )}
    </div>
  );
};

export default BarChart;
