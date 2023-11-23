import React from 'react'

const DisplayRequests = (props) => {
  return (
        <div className='explore-result'>
            <h4><b>Tender ID : {props.propertyId}</b></h4>
            <p><b>Requested by:</b> {props.requester}</p>
            <p><b>Requested by Name:</b> {props.requesterName}</p>
            <p><b>Bid Amount:</b> {props.stringBidAmount}</p>
            <p><b>RequesterFileURI:</b> {props.requesterFileURI}</p>
            <p><b>TenderName:</b> {props.tendorName}</p>
            <p><b>Establishment Year:</b> {props.establishmentyear}</p>

            <button className='accept-req' onClick={() => {props.acceptReq(props.index, props.reqNo)}}><b>Accept Request</b></button>
        </div>
  )
}

export default DisplayRequests