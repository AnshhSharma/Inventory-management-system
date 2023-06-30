import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Table from './OrderTable';
import axios from 'axios';

export default function Orders(props) {
  // const [data, setData] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [addingOrder, setAddingOrder] = useState(false);
  const tableHeadings = ["ID", "Type", "Quantity"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      const orders = response.data;
      // setData(orders);
      setPendingOrders(orders.filter((order) => order.state === 'pending'));
      setCompletedOrders(orders.filter((order) => order.state === 'completed'));
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const addNewOrder = async () => {
    const newOrderId = document.getElementById('newOrderId').value;
    const newOrderType = document.getElementById('newOrderType').value;
    const newOrderQuantity = document.getElementById('newOrderQuantity').value;
    const newOrderState = document.getElementById('newOrderState').value;

    if (!newOrderId || !newOrderType || !newOrderQuantity || !newOrderState) {
      alert('All fields are mandatory to fill');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/addorder', {
        id: newOrderId,
        type: newOrderType,
        quantity: newOrderQuantity,
        state: newOrderState,
      });

      if (response.data.status) {
        fetchData();
        toggleNewOrder();
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Display an alert if duplicate id error
        alert(error.response.data.error);
      } else {
        console.log('Error adding new order:', error);
      }
    }
  };



  const toggleNewOrder = () => {
    const element = document.getElementById('addOrderContainer');
    if (!addingOrder) {
      setAddingOrder(true);
      element.classList.remove('d-none');
    } else {
      setAddingOrder(false);
      element.classList.add('d-none');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/orders/delete/${orderId}`);
      console.log(response); // Log the response to the console for debugging
      fetchData();
    } catch (error) {
      console.log('Error deleting order:', error);
    }
  };
  
  const markAsCompleted = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/orders/convert/${orderId}`);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Display an alert if duplicate id error
        alert(error.response.data.error);
      } else {
      console.log('Error marking order as completed:', error);
      }
    }
  };

  return (
    <>
      <div style={addingOrder? {opacity: '0.5'}: {}}>
        <Navbar name={props.name} />
        <h1 style={{ textAlign: 'center' }}>ORDERS</h1>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary mx-5" onClick={() => toggleNewOrder(true)}>
            Add new order
          </button>
        </div>
        <div className="orders-container py-5 d-flex justify-content-center my-1" style={{ margin: '2rem', border: '2px solid black' }}>
          <div className="pending-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className="my-4">Pending Orders</h2>
            <Table headings={tableHeadings} data={pendingOrders} onDelete={deleteOrder} onMarkAsCompleted={markAsCompleted} orderType="Pending" />
          </div>
          <div className="completed-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className="my-4">Completed Orders</h2>
            <Table headings={tableHeadings} data={completedOrders} onDelete={deleteOrder} orderType="Completed" />
          </div>
        </div>
      </div>


      {/* the below container will only be displayed when user wants to add new order. Logic are on function addNewOrder & toggleNewOrder */}
      <div className="addOrder d-flex d-none flex-column align-items-center" id='addOrderContainer'>
        <div className="d-flex justify-content-end fa-xl" style={{ cursor: 'pointer', width: '100%' }}>
          <i className="fa-solid fa-rectangle-xmark" onClick={toggleNewOrder}></i>
        </div>
        <h1 className='my-5'>ADD NEW ORDER</h1>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Order ID</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newOrderId' />
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Product type</span>
          <select style={{ width: '12rem', float: 'right' }} id='newOrderType'>
          <option value={''}>Order Type</option>
            <option value={'OPC'}>OPC</option>
            <option value={'PPC'}>PPC</option>
            <option value={'RAPID'}>RAPID</option>
          </select>
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Quantity</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newOrderQuantity' />
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>State of order</span>
          <select style={{ width: '12rem', float: 'right' }} id='newOrderState'>
            <option value={''}>Choose Order </option>
            <option value={'pending'}>Pending</option>
            <option value={'completed'}>Completed</option>
          </select>
        </div>
        <button className="btn btn-primary m-5" onClick={addNewOrder}>Add new order</button>
      </div>
    </>
  )
}