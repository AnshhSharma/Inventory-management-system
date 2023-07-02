import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
export default function Navbar(props) {
    const history = useNavigate();
    const handleLogOut = async () => {
        try {
            await axios.post('http://localhost:5000/logout')
                .then(res => {
                    history("/");
                })
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleLogoClick = async () => {
        history("/home", { state: { id: props.name } });
    };
    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/* Container wrapper */}
                <div className="container-fluid">
                    {/* Toggle button */}
                    {/* Collapsible wrapper */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* Navbar brand */}
                        <div className="navbar-bLand mt-2 mt-lg-0" style={{ marginRight: '10px' }}>
                            <img
                                src="https://www.ultratechcement.com/content/dam/ultratechcementwebsite/new-header-design/desk.png"
                                height={50}
                                alt="UT Logo"
                                onClick={handleLogoClick}
                                style={{cursor: 'pointer'}}
                            />
                        </div>
                        {/* Left links */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <span className="nav-link" style={{cursor: 'pointer'}} onClick={handleLogoClick}>Home</span>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">Manage Orders</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/stock">Manage Stock</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                        </ul>
                        {/* Left links */}
                    </div>
                    {/* Collapsible wrapper */}
                    {/* Right elements */}
                    <div className="d-flex align-items-center">

                        {/* Avatar */}
                        <div className="dropdown">
                            <span className='mx-2'>{props.name}</span>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAaN1bnmFRgMyxfVfuOU3-L9jI9dL4_d_RGhi321w&s"
                                className="rounded-circle"
                                height={35}
                                alt="Black and White Portrait of a Man"
                            />
                            <button className="btn btn-primary mx-4" onClick={handleLogOut}>
                                Log Out
                            </button>

                        </div>
                    </div>
                    {/* Right elements */}
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}
        </>

    )
}
