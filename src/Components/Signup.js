import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

export default function Signup() {

    const history = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const submit = async (e)=>{
        e.preventDefault();

        try{
            await axios.post("http://localhost:5000/signup",{
                name,email,password
            })
            .then(res=>{
                if(res.data.status){
                    history("/home", {state:{id:name}});
                }
                else{
                    alert("Email Already exist! Please log In");
                }
            })
            .catch(e=>{
                alert("Error")
                console.log(e);
            })
        }
        catch{
            console.log(e);
        }
    }

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div
                            className="card bg-dark text-white"
                            style={{ borderRadius: "1rem" }}
                        >
                            <form action='POST' className="card-body p-5 text-center" style={{ height: '90vh' }}>
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw mb-2 text-uppercase">UltraTech Cement</h2>
                                    <h4 className="fw-bold mb-2 text-uppercase">Sign-Up</h4>
                                    <p className="text-white-50 mb-5">
                                        Please Fill the Details!
                                    </p>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control form-control-lg"
                                            placeholder='Enter your name'
                                            onChange={(e) => { setName(e.target.value) }}
                                            required
                                        />
                                        <label className="form-label" htmlFor="typeEmailX">
                                            Name
                                        </label>
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="email"
                                            id="signup-email"
                                            className="form-control form-control-lg"
                                            placeholder='Enter your email'
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            required
                                        />
                                        <label className="form-label" htmlFor="typeEmailX">
                                            Email
                                        </label>
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="password"
                                            id="signup-password"
                                            className="form-control form-control-lg"
                                            placeholder='Set your Password'
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            required
                                        />
                                        <label className="form-label" htmlFor="typePasswordX">
                                            Password
                                        </label>
                                    </div>
                                    {/* <p className="small mb-5 pb-lg-2">
                                        <a className="text-white-50" href="#!">
                                            Forgot password?
                                        </a>
                                    </p> */}
                                    <input
                                        className="btn btn-outline-light btn-lg px-5"
                                        type="submit"
                                        value={'Sign Up'}
                                        onClick={submit}
                                    />
                                    <p className="my-5">
                                        Already have an account?{" "}
                                        <Link to="/" className="text-white-50 fw-bold">
                                            Log In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
