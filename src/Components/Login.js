import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

export default function Login() {

    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/", {
                email, password
            })
                .then(res => {
                    if (res.data.status) {
                        history("/home", { state: { id: res.data.name } });
                    }
                    else {
                        alert("Email doesnt exist! Please Sign-Up");
                    }
                })
                .catch(e => {
                    alert("Error")
                    console.log(e);
                })
        }
        catch {
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
                                    <h4 className="fw-bold mb-2 text-uppercase">Login</h4>
                                    <p className="text-white-50 mb-5">
                                        Please enter your Email and password!
                                    </p>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="email"
                                            id="login-email"
                                            className="form-control form-control-lg"
                                            placeholder='Email'
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
                                            id="login-password"
                                            className="form-control form-control-lg"
                                            placeholder='Password'
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
                                        value={'Login'}
                                        onClick={submit}
                                    />
                                    <p className="my-5">
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="text-white-50 fw-bold">
                                            Sign Up
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
