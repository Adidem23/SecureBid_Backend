import React, { useEffect, useState } from 'react'
import emblem from '../images/emblem.svg'
import '../css/SuperAdmin.css'
import { NavLink } from 'react-router-dom';

const AddVendor = (props) => {

  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;
  
  const [vendorData, setvendorData] = useState({
    address:"", state:"M", district:"N", city:"Y", fullName:"", gender:"Male", email:"", contact:"", resendencialAddr:"" , vendortype:"", year:"" , state1:"" , district1:"" , city1:""
  });

  const onChangeFunc = (event) =>{
    const {name, value} = event.target;
    setvendorData({...vendorData, [name]:value});
  }

  const handleSubmit = async () =>{

    await contract.addVendor(vendorData.address, vendorData.state, vendorData.district, vendorData.city, vendorData.fullName, vendorData.gender, vendorData.email, vendorData.contact, vendorData.resendencialAddr+vendorData.city1+ vendorData.district1+ vendorData.state1, vendorData.year ,vendorData.vendortype,{
      from: account
    })

    console.log('Vendor details submitted');
    setvendorData({address:"", state1:"", district1:"", city1:"", fullName:"", gender:"", email:"", contact:"", resendencialAddr:"", vendortype:"", year:""});
  }


  return (
    <div className='container superAdmin-mainDiv'>
      <div className='superAdmin-heading-div'>
          <NavLink to='/'>
          <img src={emblem} alt="emblem" className="emblem" />
          </NavLink>
          <h1>Super Admin</h1>
      </div>

      <p className='superAdmin-p'>Add an Vendor</p>

      <form method='POST' className='admin-form'>
        <div className='form-group'>
            <label>Vendor Address</label>
            <input type="text" className="form-control" name="address" placeholder="Enter vendor address" 
            autoComplete="off" value={vendorData.address} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>State</label>
            <input type="text" className="form-control" name="state1" placeholder="Enter state" 
            autoComplete="off" value={vendorData.state1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>District</label>
            <input type="text" className="form-control" name="district1" placeholder="Enter district" 
            autoComplete="off" value={vendorData.district1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>City</label>
            <input type="text" className="form-control" name="city1" placeholder="Enter city" 
            autoComplete="off" value={vendorData.city1} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Vendor Name</label>
            <input type="text" className="form-control" name="fullName" placeholder="Enter full name" 
            autoComplete="off" value={vendorData.fullName} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Email</label>
            <input type="text" className="form-control" name="email" placeholder="Enter email" 
            autoComplete="off" value={vendorData.email} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Contact</label>
            <input type="text" className="form-control" name="contact" placeholder="Enter contact" 
            autoComplete="off" value={vendorData.contact} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Address</label>
            <input type="text" className="form-control" name="resendencialAddr" placeholder="Enter address" 
            autoComplete="off" value={vendorData.resendencialAddr} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Establishment Year</label>
            <input type="text" className="form-control" name="year" placeholder="Enter year of establishment" 
            autoComplete="off" value={vendorData.year} onChange={onChangeFunc}/>
        </div>
        <div className='form-group'>
            <label>Vendor Type</label>
            <input type="text" className="form-control" name="vendortype" placeholder="Enter type of the vendor" 
            autoComplete="off" value={vendorData.vendortype} onChange={onChangeFunc}/>
        </div>
        
      </form>
      <button className='admin-form-btn' onClick={handleSubmit}>Submit</button>
    </div>

  )
}

export default AddVendor