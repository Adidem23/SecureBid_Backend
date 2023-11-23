import React, { useEffect, useState } from 'react'
import emblem from '../images/emblem.svg'
import '../css/SuperAdmin.css'
import { NavLink } from 'react-router-dom';

const AddAdmin = (props) => {

  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;
  
  const [adminData, setAdminData] = useState({
    address:"", state:"M", district:"N", city:"Y", fullName:"", gender:"Male", email:"", contact:"", resendencialAddr:"",state1:"", district1:"", city1:""
  });

  const onChangeFunc = (event) =>{
    const {name, value} = event.target;
    setAdminData({...adminData, [name]:value});
  }

  const handleSubmit = async () =>{
    await contract.addAdmin(adminData.address, adminData.state, adminData.district, adminData.city, adminData.fullName,adminData.gender,adminData.email,adminData.contact, adminData.resendencialAddr+" ,"+adminData.city1+", "+adminData.district1+", "+adminData.state1+".",{
      from: account
    })

    console.log('admin details submitted');
    setAdminData({address:"", state1:"", district1:"", city1:"",fullName:"", gender:"", email:"", contact:"", resendencialAddr:""});
  }


  return (
    <div className='container superAdmin-mainDiv'>
      <div className='superAdmin-heading-div'>
          <NavLink to='/'>
          <img src={emblem} alt="emblem" className="emblem" />
          </NavLink>
          <h1>Super Admin</h1>
      </div>

      <p className='superAdmin-p'>Add an Admin</p>

      <form method='POST' className='admin-form'>
        <div className='form-group'>
            <label>Admin Address</label>
            <input type="text" className="form-control" name="address" placeholder="Enter admin address" 
            autoComplete="off" value={adminData.address} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>State</label>
            <input type="text" className="form-control" name="state1" placeholder="Enter state" 
            autoComplete="off" value={adminData.state1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>District</label>
            <input type="text" className="form-control" name="district1" placeholder="Enter district" 
            autoComplete="off" value={adminData.district1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>City</label>
            <input type="text" className="form-control" name="city1" placeholder="Enter city" 
            autoComplete="off" value={adminData.city1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Full Name</label>
            <input type="text" className="form-control" name="fullName" placeholder="Enter full name" 
            autoComplete="off" value={adminData.fullName} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>email</label>
            <input type="text" className="form-control" name="email" placeholder="Enter admin email" 
            autoComplete="off" value={adminData.email} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>contact</label>
            <input type="text" className="form-control" name="contact" placeholder="Enter admin contact" 
            autoComplete="off" value={adminData.contact} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Address</label>
            <input type="text" className="form-control" name="resendencialAddr" placeholder="Enter admin residencial address" 
            autoComplete="off" value={adminData.resendencialAddr} onChange={onChangeFunc}/>
        </div>
        
      </form>
      <button className='admin-form-btn' onClick={handleSubmit}>Submit</button>
    </div>

  )
}

export default AddAdmin