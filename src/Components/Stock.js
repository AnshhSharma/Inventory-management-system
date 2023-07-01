import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import StockTable from './StockTable';
import axios from 'axios';
import { handlePdfDownload, handleXlDownload } from './Orders';

export default function Stock(props) {
  const [stockLogs, setStockLogs] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);
  const [addingStock, setAddingStock] = useState(false)
  const [stockTypePrice, setStockTypePrice] = useState()
  const logTableHeading = ['ID', 'TYPE', 'QUANTITY', 'PRICE'];
  const stockTableHeading = ['TYPE', 'QUANTITY', 'PRICE PER UNIT'];

  const STOCK_TYPE_PRICE = [{ type: 'OPC', price: 1500 }, { type: 'PPC', price: 2500 }, { type: 'RAPID', price: 5000 }];
  const getPriceByType = (type) => {
    const foundStock = STOCK_TYPE_PRICE.find(stock => stock.type === type);
    if (foundStock) {
      return foundStock.price;
    } else {
      return null; // or any other default value if type is not found
    }
  };

  const handleStockTypeChange = () => {
    const newStockType = document.getElementById('newStockType').value;
    setStockTypePrice(getPriceByType(newStockType));
  }


  useEffect(() => {
    fetchData();
    calculateStockSummary(stockLogs); // Calculate and set stock summary
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    calculateStockSummary(stockLogs);
    // eslint-disable-next-line
  }, [stockLogs]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stock');
      const stockData = response.data;
      setStockLogs(stockData); // Set all stock logs
      // console.log(stockLogs);
      calculateStockSummary(stockLogs); // Calculate and set stock summary
    } catch (error) {
      console.log('Error fetching stock data:', error);
    }
  };

  const addNewStock = async () => {
    const newStockId = document.getElementById('newStockId').value;
    const newStockType = document.getElementById('newStockType').value;
    const newStockQuantity = document.getElementById('newStockQuantity').value;

    if (!newStockId || !newStockType || !newStockQuantity) {
      alert('All fields are mandatory to fill');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/addstock', {
        id: newStockId,
        type: newStockType,
        quantity: newStockQuantity,
        price: stockTypePrice * newStockQuantity
      });

      if (response.data.status) {
        fetchData();
        toggleNewStock();
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Display an alert if duplicate id error
        alert(error.response.data.error);
      } else {
        console.log('Error adding new stock:', error);
      }
    }
  };

  const calculateStockSummary = (stockData) => {
    // Group stock data by type and calculate total quantity
    const summary = stockData.reduce((acc, stock) => {
      const { type, quantity } = stock;
      const existingStock = acc.find((item) => item.type === type);
      if (existingStock) {
        existingStock.quantity += quantity;
      } else {
        acc.push({ type, quantity });
      }
      return acc;
    }, []);
    // Add 'pricePerUnit' to each summary object
    const summaryWithPrice = summary.map((item) => ({
      ...item,
      pricePerUnit: getPriceByType(item.type)
    }));

    // Send summary to backend
    axios.post('http://localhost:5000/stock-summary', summaryWithPrice)
      .then(response => {
        console.log('Summary inserted into database:', response.data);
      })
      .catch(error => {
        console.log('Error inserting summary into database:', error);
      });

    setStockSummary(summaryWithPrice);
    // console.log("Stock Summary: ", stockSummary);
  };




  const toggleNewStock = () => {
    const element = document.getElementById('addStockContainer');
    if (!addingStock) {
      setAddingStock(true);
      element.classList.remove('d-none');
    } else {
      setAddingStock(false);
      element.classList.add('d-none');
    }
  };

  const deleteStockLog = async (stockId) => {
    try {
      await axios.delete(`http://localhost:5000/stock/delete/${stockId}`);
      fetchData();
    } catch (error) {
      console.log('Error deleting stock log:', error);
    }
  };

  return (
    <>
      <div style={addingStock ? { opacity: '0.5' } : {}}>
        <Navbar name={props.name} />
        <h1 style={{ textAlign: 'center' }}>STOCKS</h1>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary mx-5" onClick={() => toggleNewStock(true)}>
            Add new Stock
          </button>
        </div>
        <div className="orders-container py-5 d-flex justify-content-center my-1" style={{ margin: '2rem', border: '2px solid black' }}>
          <div className="pending-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className="my-4">Stock Log</h2>
            <StockTable tableOf='log' headings={logTableHeading} data={stockLogs} onDelete={deleteStockLog} onPdfDownload = { ()=> handlePdfDownload('stock-log')} onXlDownload = {()=> handleXlDownload('stock-log')} />
          </div>
          <div className="completed-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className="my-4">Total Stock</h2>
            <StockTable tableOf='Overall' headings={stockTableHeading} data={stockSummary} onPdfDownload = { ()=> handlePdfDownload('stock')}onXlDownload = {()=> handleXlDownload('stock')} />
          </div>
        </div>
      </div>
      {/* the below container will only be displayed when user wants to add new Stock. Logic are on function addNewStock & toggleNewStock */}
      <div className="addStock d-flex d-none flex-column align-items-center" id='addStockContainer'>
        <div className="d-flex justify-content-end fa-xl" style={{ cursor: 'pointer', width: '100%' }}>
          <i className="fa-solid fa-rectangle-xmark" onClick={toggleNewStock}></i>
        </div>
        <h1 className='my-5'>ADD NEW STOCK</h1>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Stock ID</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newStockId' />
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Product type</span>
          <select style={{ width: '12rem', float: 'right' }} id='newStockType' onChange={handleStockTypeChange}>
            <option value={''}>Stock Type</option>
            <option value={'OPC'}>OPC</option>
            <option value={'PPC'}>PPC</option>
            <option value={'RAPID'}>RAPID</option>
          </select>
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Quantity</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newStockQuantity' />
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Price</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newStockPrice' disabled placeholder={stockTypePrice} />
        </div>
        <button className="btn btn-primary m-5" onClick={addNewStock}>Add new order</button>
      </div>
    </>
  )
}