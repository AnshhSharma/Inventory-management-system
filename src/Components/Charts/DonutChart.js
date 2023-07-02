import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Chart.css';

const DonutChart = () => {
  const [chartData, setChartData] = useState(null);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    // Fetch data from the API or database
    Promise.all([fetchOrders(), fetchStockSummary()])
      .then(([ordersData, stockSummaryData]) => {
        const completedOrders = ordersData.filter(order => order.state === 'completed');

        // Create a map to store pricePerUnit by product type
        const pricePerUnitMap = new Map();
        stockSummaryData.forEach(stockItem => {
          pricePerUnitMap.set(stockItem.type, stockItem.pricePerUnit);
        });

        const salesByType = completedOrders.reduce((acc, order) => {
          const { type, quantity } = order;
          const pricePerUnit = pricePerUnitMap.get(type);
          if (pricePerUnit) {
            const sales = quantity * pricePerUnit;
            if (acc[type]) {
              acc[type] += sales;
            } else {
              acc[type] = sales;
            }
          }
          return acc;
        }, {});

        const chartData = {
          options: {
            chart: {
              type: 'donut',
            },
            labels: Object.keys(salesByType),
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val.toFixed(2) + '%';
              },
              dropShadow: {
                enabled: false,
              },
            },
          },
          series: Object.values(salesByType),
        };

        setChartData(chartData);

        const totalSalesValue = Object.values(salesByType).reduce((total, value) => total + value, 0);
        setTotalSales(totalSalesValue);
      })
      .catch(error => console.log(error));
  }, []);

  const fetchOrders = () => {
    return fetch('http://localhost:5000/orders').then(response => response.json());
  };

  const fetchStockSummary = () => {
    return fetch('http://localhost:5000/stockSummary').then(response => response.json());
  };

  return (
    <div className="m-3 p-3" style={{ border: '1px solid black', width: '400px', height: '450px', borderRadius: '10px', backgroundColor: 'azure' }}>
      {chartData ? (
        <>
          <ReactApexChart options={chartData.options} series={chartData.series} type="donut" height={400} width={400} />
          <div className="donut-chart-label">{totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
        </>
      ) : (
        <div>Loading chart data...</div>
      )}
      <span className="chart-heading">Total Sales by Product Type</span>
    </div>
  );
};

export default DonutChart;
