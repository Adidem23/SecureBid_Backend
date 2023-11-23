import React, { useState, useEffect } from 'react'
import DisplayRequests from './DisplayRequests';
import {ethers} from 'ethers'

const Requests = (props) => {

  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;

  const [requestList, setRequestList] = useState([])
  const [length, setLength] = useState(0);
  const [reload, setReload] = useState(0);
  const reqArr = [];

  useEffect(() => {
    const getRequests = async () => {
      const _indices = await contract.getIndices({ from: account });
      const _totalIndices = _indices[0].words[0];

      for (let i = 0; i < _totalIndices; i++) {
        const ownerOwns = await contract.getOwnerOwns(i, { from: account });  // returns object

        // if survey no. != 0
        if (ownerOwns[3].words[0] != 0) {

          const reqCnt_propId = await contract.getRequestCnt_propId(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3].words[0], {
            from: account
          })

          console.log(reqCnt_propId);

          const noOfRequests = reqCnt_propId[0].words[0];
          const propertyId = reqCnt_propId[1].words[0];

          if (noOfRequests > 0) {

            for (let j = 0; j < noOfRequests; j++) {

              const requester = await contract.getRequesterDetail(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3].words[0], j, {
                from: account
              })

              const establishmentyear = await contract.getestablishYear(requester)

              const requesterName = await contract.getRequesterName(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3].words[0], j, {
                from: account
              })
              console.log(typeof (requesterName))

              const requesterBidAmount = await contract.getRequesterBidAmount(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3].words[0], j, {
                from: account
              })

              const stringBidAmount = parseFloat(requesterBidAmount)

              const requesterFileURI = await contract.getRequesterFileURI(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3].words[0], j, {
                from: account
              });

              const landDetails = await contract.getLandDetails('M', 'N', 'Y',ownerOwns[3], {
                from: account
              });

              const tendorName = landDetails[4];


              const reqDetails = { state: ownerOwns[0], district: ownerOwns[1], city: ownerOwns[2], surveyNo: ownerOwns[3].words[0], index: i, reqNo: j, requesterName: requesterName, stringBidAmount: stringBidAmount, requesterFileURI: requesterFileURI, establishmentyear: establishmentyear, requester, propertyId , tendorName:tendorName}
              console.log("below reqdetails.............")
              reqArr.push(reqDetails);

            }
          }
        }
      }

      setRequestList(reqArr);
      console.log("Below setreqArr  ................")
      setLength(reqArr.length);
      console.log(reqArr);
      console.log("Below reqArr  ................")
    }

    getRequests();

  }, [reload])

  const handleAcceptReq = async (_index, _reqNo) => {
  
    await contract.AcceptRequest(_index, _reqNo, { from: account, gas: 2000000 });

    const providers = new ethers.providers.Web3Provider(window.ethereum);

    const Signer = providers.getSigner();

    const bigvalue=requestList[_reqNo].stringBidAmount;

    const value = ethers.utils.parseEther(bigvalue.toString());

    try {
      const tx = await Signer.sendTransaction({
        to: requestList[_reqNo].requester,
        value:value,
      });

      await tx.wait();
      alert('Successful');
    } catch (error) {
      alert(`Transaction failed: ${error.message}`);
      console.log(error)
    }

    setReload(!reload);
  }

  return (
    <div className='container'>
      {
        (length == 0) ?
          <div className="no-result-div">
            <p className='no-result'>No incoming requests.</p>
          </div>
          :
          requestList.map((details, index) => {
            return (
              <DisplayRequests

                key={index}
                propertyId={details.propertyId}
                requester={details.requester}
                requesterName={details.requesterName}
                requesterFileURI={details.requesterFileURI}
                tendorName={details.tendorName}
                stringBidAmount={details.stringBidAmount}
                establishmentyear={details.establishmentyear}
                index={details.index}
                reqNo={details.reqNo}
                state={details.state}
                district={details.district}
                city={details.city}
                surveyNo={details.surveyNo}
                acceptReq={handleAcceptReq}

              />
            )
          })
      }
    </div>
  )
}

export default Requests