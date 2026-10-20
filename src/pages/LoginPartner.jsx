import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPartner = () => {

    const navigate = useNavigate();
    const handleSubmit =  async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const response = await axios.post("http://localhost:3000/api/auth/food-partner/login",{
            email,
            password
        }, {
            withCredentials: true });

        console.log(response.data);

        navigate("/create-food");
        };
  return (
    <div className="container">
      <div className="card">
        <h2>Partner sign in</h2>
        <p className="muted">Access your partner dashboard</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email"
            name="email"
             placeholder="partner@food.com"
              />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn">Sign in</button>
        </form>
        <p className="small">Need an account? <span className="brand">Register</span></p>
      </div>
    </div>
  )
}

export default LoginPartner
