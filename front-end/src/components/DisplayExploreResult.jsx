import React from 'react'
import { useState } from 'react';
import axios from 'axios';


const DisplayExploreResult = (props) => {
  const [BidAmount, setBidAmount] = useState(0);
  const [FileURI, setFileURI] = useState("");
  const [ForClicked, setForClicked] = useState(false);

  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMzdkOTE0ZC01MjA4LTRkOGQtYmJmNS04Zjg0Yjg0ZDgzZjMiLCJlbWFpbCI6ImFkaXR5YXN1cnlhd2Fuc2hpNTQ1MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZWUzNDk3ZDYyMWQxZjlhMTIxZmIiLCJzY29wZWRLZXlTZWNyZXQiOiIzNTkxYTdhNzM0ODFkYzZhMGZhMzEzYTIzZDVlYjQ4MGM5ZjkxZDE3ODRiNDE4Y2JlNzI1MmM0MGM5ZTlkMWUwIiwiaWF0IjoxNjkxNjkzOTY1fQ.wYGUrY0SZkBOqjPHnElhgSGy0F9xNdNLXMgDehgIkJE';

  const uploadFiletoIPFS = async (e) => {
    const formData = new FormData();
    const FileUpload = e.target.files[0];

    formData.append('file', FileUpload);

    const pinataMetadata = JSON.stringify({
      name: "FilesTobeUploaded",
    });

    formData.append('pinataMetadata', pinataMetadata)
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log("Hash of the data : "+res.data.IpfsHash);
      const deliverabelURl=`https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      setFileURI(deliverabelURl);
      setForClicked(true)

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <>
      {
        (props.propertyId != 0) ?   // propertyId != 0 means we got a result while exploring.
          (
            <div className='explore-result'>
              <p><b>Owner Address:</b> {props.owner}</p>
              <p><b>Owner Name:</b>{props.OwnerName}</p>
              <p><b>Survey Number:</b> {props.surveyNo}</p>
              <p><b>Market Value:</b> {props.marketValue}</p>
              <p><b>TenderName:</b> {props.tendorName}</p>
              <p><b>TenderType:</b> {props.tendortype}</p>
              <p><b>ipfsURI:</b> {props.ipfsuri}</p>

              {
                (props.available) ?  // if land is marked for sale.
                  (
                    (props.isAdmin || props.isOwner) ?  // isOwner means "is Owner exploring its own land?"
                      (
                        // if owner is exploring its own land, then, owner CANNOT request its own land, hence "Marked for sale" will be displayed only.
                        <button className='marked-sale'><b>Marked for sale</b></button>
                      )
                      :
                      (
                        // if owner is exploring other's land, then owner can request to buy other's land, hence "Request for buy" can be displayed on button.
                        (props.didIRequested) ?
                          <button className='req-pending'><b>Request Pending</b></button>
                          :
                          // <button className='buy-btn'onClick={props.requestForBuy(props.surveyNo)}><b>Request for buy</b></button>
                          <>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <p><b>Budget:</b></p>
                              <input type="number" onChange={(e) => { setBidAmount(e.target.value) }} placeholder='Enter Bid Amount' style={{ marginLeft: "10px" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", marginTop: "15px" }}>
                              <p><b>FileURI:</b></p>

                             {!ForClicked ? <input type="file" accept='*' onChange={uploadFiletoIPFS} placeholder='Enter File URI' style={{ marginLeft: "10px", }} />: <p><a href={FileURI} target='_blank'>IPFS</a></p>}

                            </div>

                            <button className='buy-btn' style={{ marginTop: "20px" }} onClick={() => props.requestForBuy(props.surveyNo, BidAmount, FileURI)}><b>Request for buy</b></button>

                          </>

                      )
                  )
                  :
                  <button className='no-sale'><b>Not Available</b></button>
              }

            </div>
          )
          :
          (
            (props.noResult) ?
              <div className="no-result-div">
                <p className='no-result'>No result found :(</p>
              </div>
              :
              <></>
          )
      }
    </>
  )
}

export default DisplayExploreResult