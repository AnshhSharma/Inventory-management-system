import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Table from './Table';
import axios from 'axios';

export default function Orders(props) {
  const [data, setData] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [addingOrder, setAddingOrder] = useState(false);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      const orders = response.data;
      setData(orders);
      setPendingOrders(orders.filter((order) => order.state === 'pending'));
      setCompletedOrders(orders.filter((order) => order.state === 'completed'));
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const tableHeadings = ['ID', 'Type', 'Quantity'];

  const toggleNewOrder = () => {
    var element = document.getElementById("addOrderContainer");
    if (!addingOrder) {
      setAddingOrder(true);
      element.classList.remove("d-none");
    }
    else {
      setAddingOrder(false);
      element.classList.add("d-none");

    }
  }

  const addNewOrder = async (id, type, quantity, state) => {
    try {
      await axios.post('http://localhost:5000/orders', {
        id: id,
        type: type,
        quantity: quantity,
        state: state,
      });
      fetchOrders();
    } catch (error) {
      console.log('Error adding new order:', error);
    }
    toggleNewOrder();
  };

  const editOrder = async (order) => {
    try {
      await axios.put(`http://localhost:5000/orders/${order._id}`, order);
      fetchOrders();
    } catch (error) {
      console.log('Error editing order:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.log('Error deleting order:', error);
    }
  };

  const markAsCompleted = async (order) => {
    try {
      await axios.post('http://localhost:5000/orders/completed', order);
      await axios.delete(`http://localhost:5000/orders/${order._id}`);
      fetchOrders();
    } catch (error) {
      console.log('Error marking order as completed:', error);
    }
  };

  return (
    <>
      <div>
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
            <Table headings={tableHeadings} data={pendingOrders} onEdit={editOrder} onDelete={deleteOrder} onMarkAsCompleted={markAsCompleted} orderType="Pending" />
          </div>
          <div className="completed-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className="my-4">Completed Orders</h2>
            <Table headings={tableHeadings} data={completedOrders} onEdit={editOrder} onDelete={deleteOrder} orderType="Completed" />
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
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newOrderId'/>
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Product type</span>
          <select style={{ width: '12rem', float: 'right' }} id='newOrderType'>
            <option value={'OPC'}>OPC</option>
            <option value={'PPC'}>PPC</option>
            <option value={'RAPID'}>RAPID</option>
          </select>
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>Enter Quantity</span>
          <input type='number' style={{ width: '12rem', float: 'right' }} id='newOrderQuantity'/>
        </div>
        <div className='my-1' style={{ width: '22rem' }}>
          <span className='mx-3' style={{ width: '5rem' }}>State of order</span>
          <select style={{ width: '12rem', float: 'right' }} id='newOrderState'>
            <option value={'pending'}>Pending</option>
            <option value={'completed'}>Completed</option>
          </select>
        </div>
        <button className="btn btn-primary m-5" onClick={addNewOrder}>Add new order</button>
      </div>
    </>
  );
}
