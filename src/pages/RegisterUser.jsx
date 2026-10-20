import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RegisterUser = () => {

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

      const response = await axios.post("http://localhost:3000/api/auth/user/register" , {
            fullName: firstName + " " + lastName,
            email,
            password
        }, {
            withCredentials: true,
        })

        console.log(response.data);

        navigate("/")

    };
        
  return (
    <div className="container">
      <div className="card">
        <h2>Create your account</h2>
        <p className="muted">Join to explore and enjoy delicious meals.</p>
        <div className="switch" style={{textAlign:'center', marginBottom: '12px'}}>
          <span style={{color:'var(--muted)', fontSize:'0.8rem'}}>Switch: </span>
          <span className="brand" style={{marginLeft:8, marginRight:8}}>User</span>
          <Link to="/food-partner/register" className="muted" style={{marginLeft:4}}>Food partner</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>First Name</label>
              <input
               type="text" 
               name="firstName"
               placeholder="Jane"
                />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" />
            </div>
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" />
          </div>

          <div>
            <label>Password</label>
            <input type="password"
            name="password"
            placeholder="••••••••" />
          </div>

          <button type="submit" className="btn">Sign Up</button>
        </form>
        <p className="small">Already have an account? <Link to="/user/login" className="brand">Sign in</Link></p>
      </div>
    </div>
  )
}

export default RegisterUser
