import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import dashboardImg from '../Media/dashboard.png'
import insightImg from '../Media/insightsAnalytics.png'
import orderProcessingImg from '../Media/orderProcessing.jpg'
import stockManagementImg from '../Media/stockManagement.png'

export default function Home({ name, setName }) {

  const [feedbackText, setFeedbackText] = useState('');

  const handleTextChange = (event) => {
    setFeedbackText(event.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim().length > 0) {
      // Create the feedback object
      const feedbackData = {
        text: feedbackText,
        name: name
      };

      // Make an HTTP POST request to your backend API using Axios
      axios.post('http://localhost:5000/feedback', feedbackData)
        .then((response) => {
          console.log('Feedback submitted successfully:', response.data);
          // Reset the textarea
          setFeedbackText('');
          alert("Thanks for the feedback!")
        })
        .catch((error) => {
          console.error('Error submitting feedback:', error);
        });
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.id) {
      setName(location.state.id);
    }
  }, [location.state, setName]);

  return (
    <>
      <Navbar name={name} />
      <div className="home">
        <div className="homeHeaders p-5">
          <u><h1>INVENTORY MANAGEMENT SYSTEM</h1></u>
          <p className='my-4'>Efficiently Manage Stock, Orders, and Operations with our Inventory Management System and Dashboard. Gain Real-time Insights, Track Inventory Movement, and Optimize Stock Levels. Simplify Order Processing, Monitor Sales Performance, and Make Informed Business Decisions. Visualize Data with Interactive Charts and Graphs for Enhanced Analysis and Decision-Making.</p>
        </div>
        <h2 className='my-3 mx-5'>Welcome, {name}</h2>
        <hr />
        <h2 style={{ textAlign: 'center' }}>Key Features</h2>
        <div className="features my-5 d-flex" style={{ textAlign: 'center' }}>
          <div className="card mx-4" style={{ width: '100%', height: '30rem' }}>
            <img src={stockManagementImg} className="card-img-top home-card-image" alt="Stock Management" />
            <div className="card-body home-card">
              <h5 className="card-title">Comprehensive Stock Management: </h5>
              <p className="card-text">Effectively track and manage your inventory, including incoming and outgoing stock, stock levels, and stock movement, ensuring accurate stock control and minimizing stockouts or overstocking.</p>
            </div>
          </div>
          <div className="card mx-4" style={{ width: '100%', height: '30rem' }}>
            <img src={orderProcessingImg} className="card-img-top home-card-image" alt="Order Processing" />
            <div className="card-body home-card">
              <h5 className="card-title">Streamlined Order Processing: </h5>
              <p className="card-text">Simplify order management with streamlined processes, from order placement to fulfillment. Efficiently process orders, track their status, and streamline communication with customers, ensuring timely delivery and customer satisfaction.</p>
            </div>
          </div>
          <div className="card mx-4" style={{ width: '100%', height: '30rem' }}>
            <img src={insightImg} className="card-img-top home-card-image" alt="Insight" />
            <div className="card-body home-card">
              <h5 className="card-title">Real-time Insights and Analytics: </h5>
              <p className="card-text">Gain valuable insights into your business operations with real-time data and analytics. Monitor key metrics, track sales performance, analyze trends, and make data-driven decisions to optimize inventory, improve efficiency, and drive profitability.</p>
            </div>
          </div>
          <div className="card mx-4" style={{ width: '100%', height: '30rem' }}>
            <img src={dashboardImg} className="card-img-top home-card-image" alt="Dashboard" />
            <div className="card-body home-card">
              <h5 className="card-title">Interactive Dashboard and Visualizations: </h5>
              <p className="card-text">Visualize your inventory and order data through an intuitive and interactive dashboard. Leverage interactive charts, graphs, and visualizations to gain a holistic view of your stock levels, order status, and their correlation, facilitating better analysis and strategic planning.</p>
            </div>
          </div>

        </div>
        <hr />
        <div className="feedback-container d-flex flex-column align-items-center my-5">
          <h2>Share us your feedback</h2>
          <form className='m-2' action='POST'>
            <div className="form-group">
              <textarea
                className="form-control"
                id="feedbackText"
                rows={6}
                cols={100}
                value={feedbackText}
                onChange={handleTextChange}
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-success my-1 btn-block" style={{ width: '50rem' }} disabled={feedbackText.trim().length === 0} onClick={handleFeedbackSubmit}>Submit Feedback</button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
