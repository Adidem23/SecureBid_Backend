import React, { useEffect, useState } from 'react'
import emblem from '../images/emblem.svg'
import '../css/SuperAdmin.css'
import { NavLink, useNavigate } from 'react-router-dom';


const SuperAdmin = (props) => {
const navigator = useNavigate()
  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;
  
  const [adminData, setAdminData] = useState({
    address:"", state:"", district:"", city:"", fullName:"", gender:"", email:"", contact:"", resendencialAddr:""
  });

  const onChangeFunc = (event) =>{
    const {name, value} = event.target;
    setAdminData({...adminData, [name]:value});
  }

  const handleSubmit = async () =>{
    await contract.addAdmin(adminData.address, adminData.state, adminData.district, adminData.city, adminData.fullName,adminData.gender,adminData.email,adminData.contact, adminData.resendencialAddr,{
      from: account
    })

    console.log('admin details submitted');
    setAdminData({address:"", state:"", district:"", city:"",fullName:"", gender:"", email:"", contact:"", resendencialAddr:""});
  }

  const handleAdmin = () =>{
    navigator("/AddAdmin")

  }
  const handleVendor = () =>{
    navigator("/AddVendor")

  }
  return (
    <div className='container superAdmin-mainDiv'>
      <div className='superAdmin-heading-div'>
          <NavLink to='/'>
          <img src={emblem} alt="emblem" className="emblem" />
          </NavLink>
          <h1>Super Admin</h1>
      </div>

      <p className='superAdmin-p'>Choose the option</p>

      <button className='admin-form-btn' onClick={handleAdmin}>Add Admin</button>
      <button className='admin-form-btn'style={{marginLeft:"50px"}} onClick={handleVendor}>Add Vendor</button>
    </div>

  )
}

export default SuperAdmin