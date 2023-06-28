import React from 'react'
import Navbar from './Navbar'
import Table from './Table'
import { useState } from 'react';

export default function Orders(props) {

  const tableHeadings = ["ID", "Type", "Quantity"];
  const data = [{ id: 101, type: "OPC", quantity: 125, state: 'pending' }, { id: 101, type: "PPC", quantity: 125, state: 'pending' }, { id: 101, type: "RAPID", quantity: 125, state: 'completed' }]

  const [addingOrder, setAddingOrder] = useState(false);

  const addNewOrder = () => {
    let a = document.getElementById('newOrderId');
    let b = document.getElementById('newOrderType');
    let c = document.getElementById('newOrderQuantity');
    let d = document.getElementById('newOrderState');
      if(a===""||b===""||c===""||d===""||a===null||b===null||c===null||d===null){
        alert("All Feilds are mandatory to fill");
        return;
      }
      else{
        var element = {};
        element.id =a;
        element.type =b;
        element.quantity =c;
        element.state =d;
        data.push(element);
      }
    toggleNewOrder();

  }

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

  return (
    <>
      <div style={addingOrder ? { opacity: '0.4' } : { opacity: '1' }}>
        <Navbar name={props.name} />
        <h1 style={{ textAlign: 'center' }}>ORDERS</h1>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary mx-5" onClick={toggleNewOrder}>Add new order</button>
        </div>
        <div className="orders-container py-5 d-flex justify-content-center my-1" style={{ margin: '2rem', border: '2px solid black' }}>
          <div className="pending-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className='my-4'>Pending Orders</h2>
            <Table headings={tableHeadings} data={data} />
          </div>
          <div className="completed-orders mx-5 d-flex flex-column align-items-center" style={{ width: '40vw' }}>
            <h2 className='my-4'>Completed Orders</h2>
            <Table headings={tableHeadings} data={data} />
          </div>
        </div>
      </div>
      <div className="addOrder d-flex d-none flex-column align-items-center" id='addOrderContainer'>
        <div className="d-flex justify-content-end fa-xl" style={{ cursor: 'pointer', width: '100%' }}>
          <i className="fa-solid fa-rectangle-xmark" onClick={toggleNewOrder}></i>
        </div>
        <h1 className='my-5'>Add new order</h1>
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
        <button className="btn btn-primary mx-5" onClick={addNewOrder}>Add new order</button>
      </div>
    </>
  )
}
