import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

export default function Home({ name, setName }) {
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
        {/* Home content */}
      </div>
    </>
  );
}
