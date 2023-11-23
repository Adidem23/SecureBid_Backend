import React from 'react'

const DisplayRequested = (props) => {
  return (
    <>
        <div className='explore-result'>
          <div className='row'>
            <div className='col-12 col-md-6'>
                <p><b>Owner:</b> {props.owner}</p>
                <p><b>Tender ID:</b> {props.propertyId}</p>
                <p><b>Market Value:</b> {props.marketValue}</p>
                <p><b>Tender File:</b> {props.ipfsuri}</p>
              </div>
              
              <div className='col-12 col-md-6'>
                <p><b>Owned By:</b> {props.ownerName}</p>
                <p><b>Tender Name:</b> {props.tendorName}</p>
                <p><b>Tender Type:</b> {props.tendortype}</p>
            </div>
          </div>

            <button className='no-sale'><b>Request Pending</b></button>
        </div>
    </>
  )
}

export default DisplayRequested