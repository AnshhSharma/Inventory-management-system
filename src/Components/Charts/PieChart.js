import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Chart.css'

const PieChart = (props) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      chart: {
        id: 'pie-chart',
        toolbar: {
          show: true,
          exportMenu: {
            csv: {
              fileName: 'pie-chart',
              exportData: {
                categoryHeader: 'Type',
                format: 'csv'
              }
            },
            png: {
              fileName: 'pie-chart',
              exportData: {
                categoryHeader: 'Type',
                format: 'png'
              }
            },
            svg: {
              fileName: 'pie-chart',
              exportData: {
                categoryHeader: 'Type',
                format: 'svg'
              }
            }
          }
        }
      },
      legend: {
        position: 'right',
      }
    }
  });
  useEffect(() => {
    // Fetch data from the database
    fetch(`http://localhost:5000/${props.collectionData}`)
      .then(response => response.json())
      .then(data => {
        // Create an object to store the combined quantities based on type
        const quantityMap = {};

        if (props.by === 'order-type' || props.by === 'stock-type') {
          // Iterate over the data and sum the quantities for each type
          data.forEach(item => {
            const { type, quantity } = item;
            if (quantityMap[type]) {
              quantityMap[type] += quantity;
            } else {
              quantityMap[type] = quantity;
            }
          });
        }
        else if (props.by === 'order-pending-type') {
          const filteredData = data.filter(item => item.state === 'pending');
          filteredData.forEach(item => {
            const { type, quantity } = item;
            if (quantityMap[type]) {
              quantityMap[type] += quantity;
            } else {
              quantityMap[type] = quantity;
            }
          });
        }
        else if (props.by === 'order-completed-type') {
          const filteredData = data.filter(item => item.state === 'completed');
          filteredData.forEach(item => {
            const { type, quantity } = item;
            if (quantityMap[type]) {
              quantityMap[type] += quantity;
            } else {
              quantityMap[type] = quantity;
            }
          });
        }

        // Extract the combined types and quantities from the quantityMap
        const series = Object.values(quantityMap);
        const labels = Object.keys(quantityMap);

        setChartData(prevData => ({
          ...prevData,
          series,
          options: {
            ...prevData.options,
            labels
          }
        }));
      })
      .catch(error => console.log(error));
    // eslint-disable-next-line
  }, []);


  return (
    <div>
      <div className='m-3 p-3' style={{border : '1px solid black' , width: '400px', height: '450px', borderRadius: '10px', backgroundColor: 'azure'}}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width="380"
        />
        {props.by === 'order-type' ? <span className='chart-heading'>Total Orders </span> : (props.by === 'order-pending-type' ? <span className='chart-heading'>Pending Orders</span> : (props.by === 'order-completed-type' ? <span className='chart-heading'>Completed Orders</span> : <span className='chart-heading'>Available Stock</span>))} <span className='chart-heading'>With respect to the Order Type</span>
      </div>
    </div>
  );
};

export default PieChart;
