import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await  axios.post("http://localhost:3000/api/auth/user/login" , {
            email,
            password
        }, {
            withCredentials: true,
        })

        console.log(response.data);

        navigate("/");
        };
  return (
    <div className="container">
      <div className="card">
        <h2>Welcome back</h2>
        <p className="muted">Login to your account</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn">Sign in</button>
        </form>
        <p className="small">New here? <span className="brand">Register</span></p>
      </div>
    </div>
  )
}

export default LoginUser
