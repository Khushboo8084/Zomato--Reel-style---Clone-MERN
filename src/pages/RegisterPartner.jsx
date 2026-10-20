import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPartner = () => {

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const businessName = e.target.businessName.value;
        const contactName = e.target.contactName.value;
        const phone = e.target.phone.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
    
        const address = e.target.address.value;

        axios.post("http://localhost:3000/api/auth/food-partner/register",{
            name : businessName,
            contactName,
            phone,
            email,
            password,
            confirmPassword,
            address
        }, {
            withCredentials: true,
        })
        .then((response) => {
            console.log(response.data);
            navigate("/create-food");
        })
        .catch(error => {
            console.error("There was an error registering:", error);
        });
    };
  return (
    <div className="container">
      <div className="card">
        <h2>Partner sign up</h2>
        <p className="muted">Grow your business with our platform</p>
        <div className="switch" style={{textAlign:'center', marginBottom: '12px'}}>
          <span style={{color:'var(--muted)', fontSize:'0.8rem'}}>Switch: </span>
          <Link to="/user/register" className="muted" style={{marginLeft:8, marginRight:8}}>User</Link>
          <span className="brand" style={{marginLeft:4}}>Food partner</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Business name</label>
            <input type="text"
            name="businessName"
             placeholder="Tasty Bites"
              />
          </div>

          <div className="form-row">
            <div>
              <label>Contact name</label>
              <input type="text" name="contactName" placeholder="Jane Doe" />
            </div>
            <div>
              <label>Phone</label>
              <input type="text" name="phone" placeholder="+1 555 123 4567" />
            </div>
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email"  placeholder="business@example.com" />
          </div>

          <div className="form-row">
            <div>
              <label>Password</label>
              <input type="password" name="password" placeholder="Create password" />
            </div>
            <div>
              <label>Confirm</label>
              <input type="password" name="confirmPassword" placeholder="Repeat" />
            </div>
          </div>

          <div>
            <label>Address</label>
            <input type="text" name="address" placeholder="123 Market Street" />
            <div className="helper">Full address helps customers find you faster.</div>
          </div>

          <button type="submit" className="btn">Create Partner Account</button>
        </form>
        <p className="small">Already registered? <span className="brand">Sign in</span></p>
      </div>
    </div>
  )
}

export default RegisterPartner
