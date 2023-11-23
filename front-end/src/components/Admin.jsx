import React from 'react'
import Navbar from './Navbar'
import { Routes, Route } from 'react-router-dom';
import RegisterLand from './RegisterLand';
import ExploreAll from './ExploreAll';
import Profile from './Profile';
import Property from './Property';
import Requested from './Requested';
import Requests from './Requests';



const Admin = (props) => {
  return (
    <>
      <Navbar isAdmin={true} />
      <Routes>

       <Route path='/userprofile' element={<Profile myWeb3Api={props.myWeb3Api} account={props.account} />} />


        <Route path='/' element={<RegisterLand myWeb3Api={props.myWeb3Api} account={props.account} />} />

        <Route path='/explore' element={<ExploreAll myWeb3Api={props.myWeb3Api} account={props.account} isAdmin={true} />} />

        <Route path='/property' element={<Property myWeb3Api={props.myWeb3Api} account={props.account} />} />

        <Route path='/requests' element={<Requests myWeb3Api={props.myWeb3Api} account={props.account} />} />


      </Routes>
    </>
  )
}

export default Admin