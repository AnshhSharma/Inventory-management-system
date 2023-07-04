import React from 'react'
import Navbar from './Navbar'
import PieChart from './Charts/PieChart';
import RadialChart from './Charts/RadialChart';
import BarChart from './Charts/BarChart';
import DonutChart from './Charts/DonutChart';


export default function Dashboard(props) {

  return (
    <div className='dashboard'>
      <Navbar name={props.name} />
      <h1 className='mx-4' style={{ textAlign: 'center', marginTop: '9vh' }}>DASHBOARD</h1>
      <hr></hr>
      <div className = 'm-4 py-2' style={{ border: '1px solid black', textAlign: 'center' , borderRadius: '5px', backgroundColor: '#eff4f7'}}>
        <h2>Orders Stats.</h2>
        <div className="d-flex justify-content-around flex-wrap m-2 p-2"  >
          <PieChart collectionData='orders' by='order-pending-type' />
          <RadialChart/>
          <PieChart collectionData='orders' by='order-completed-type' />
          <PieChart collectionData='orders' by='order-type' />
        </div>
      </div>
      <div className = 'm-4 py-2' style={{ border: '1px solid black', textAlign: 'center' , borderRadius: '5px', backgroundColor: '#eff4f7'}}>
        <h2>Stock Stats.</h2>
        <div className="d-flex justify-content-around flex-wrap m-2 p-2"  >
          <BarChart by ='MRP' />
          <PieChart collectionData='stock' by='stock-type' />
          <BarChart by ='pendingOrder-availableStock' />
          <DonutChart/>
        </div>
      </div>
    </div>
  )
}
