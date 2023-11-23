import axios from 'axios';
import React, { useState } from 'react'
import '../css/RegisterLand.css'

const RegisterLand = (props) => {

  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;

  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMzdkOTE0ZC01MjA4LTRkOGQtYmJmNS04Zjg0Yjg0ZDgzZjMiLCJlbWFpbCI6ImFkaXR5YXN1cnlhd2Fuc2hpNTQ1MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZWUzNDk3ZDYyMWQxZjlhMTIxZmIiLCJzY29wZWRLZXlTZWNyZXQiOiIzNTkxYTdhNzM0ODFkYzZhMGZhMzEzYTIzZDVlYjQ4MGM5ZjkxZDE3ODRiNDE4Y2JlNzI1MmM0MGM5ZTlkMWUwIiwiaWF0IjoxNjkxNjkzOTY1fQ.wYGUrY0SZkBOqjPHnElhgSGy0F9xNdNLXMgDehgIkJE';


  const [landDetails, setLandDetials] = useState({
    state: "M", district: "N", city: "Y", propertyId: "", surveyNo: "123", owner: props.account, marketValue: "", tenderName: "", tendertype: "", ipfsuri: ""
  })

  const onChangeFunc = (event) => {
    const { name, value } = event.target;
    setLandDetials({ ...landDetails, [name]: value });
  }

  const [URICame, setURICame] = useState(false);
  const [SetttedURl, setSetttedURl] = useState("")

  const uploadIPFsFile = async (e) => {
    const formData = new FormData();
    const FileUpload = e.target.files[0];

    const {name} = e.target;

    console.log(name);


    formData.append('file', FileUpload);

    const pinataMetadata = JSON.stringify({
      name: name,
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
      console.log(res.data.IpfsHash);
      const deliverabelURl=`https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      setSetttedURl(deliverabelURl)
      setLandDetials({ ...landDetails, [name]: deliverabelURl});
      setURICame(true)

    } catch (error) {
      console.log(error);
    }

  }

  const handleOnClick = async () => {
    await contract.registerLand(landDetails.state, landDetails.district, landDetails.city, landDetails.propertyId, landDetails.surveyNo, landDetails.owner, landDetails.marketValue, landDetails.tenderName, landDetails.tendertype, landDetails.ipfsuri, {
      from: account
    })
    console.log(landDetails)
    setLandDetials({ state: "", district: "", city: "", propertyId: "", surveyNo: "", owner: props.account, marketValue: "", tenderName: "", tendertype: "", ipfsuri: "" })
  }



  return (
    <div className='container registerLand-maindiv'>

      <div className='row'>

        <div className='col-12 col-sm-6'>

          <form method='POST' className='admin-form'>

            <div className='form-group'>
              <label>Market Value</label>
              <input type="number" className="form-control" name="marketValue" placeholder="Enter market value"
                autoComplete="off" value={landDetails.marketValue} onChange={onChangeFunc} />
            </div>


            <div className='form-group'>
              <label>Tender Type</label>
              <input type="text" className="form-control" name="tendertype" placeholder="Enter Tender Type"
                autoComplete="off" value={landDetails.tendertype} onChange={onChangeFunc} />
            </div>


            <div className='form-group'>
              <label>Tender Name</label>
              <input type="text" className="form-control" name="tenderName" placeholder="Enter Tender Name"
                autoComplete="off" value={landDetails.tenderName} onChange={onChangeFunc} />
            </div>

            <div className='form-group'>
              <label>Tender File</label>
              {!URICame ? <input type="file" accept='*' className="form-control" name="ipfsuri" placeholder="Enter Tender File"
                autoComplete="off"  onChange={uploadIPFsFile} />:<p><a href={SetttedURl} target='_blank'>IPFS</a></p>}
            </div>

          </form>
        </div>

      </div>
      <button className='admin-form-btn' onClick={handleOnClick}>Submit</button>
    </div>
  )
}

export default RegisterLand