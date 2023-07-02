import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

export default function Home({ name, setName }) {
  const location = useLocation();

  useEffect(() => {
    setName(location.state.id);
  }, [location.state.id, setName]);

  return (
    <>
      <Navbar name={name} />
      <div className="home">
        
      </div>
    </>
  );
}
