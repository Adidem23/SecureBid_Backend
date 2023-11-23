import React, { useState, useEffect } from 'react'
import DisplayExploreResult from './DisplayExploreResult';
import '../css/Explore.css'

const ExploreAll = (props) => {

    const { provider, web3, contract } = props.myWeb3Api;
    const account = props.account;

    const [requestList, setRequestList] = useState([])
    const [length, setLength] = useState(0);
    const [reload, setReload] = useState(0);
    var myArray = new Array(100);


    const [explore, setExplore] = useState({
        state: "", district: "", city: "", surveyNo: ""
    })

    const [landDetail, setLandDetail] = useState({
        owner: "", propertyId: "", index: "", marketValue: "", didIRequested: "", OwnerName: "" , tendorName:"",tendortype:"", ipfsuri:""
    })

    const [didIRequested, setDidIRequested] = useState(false);
    const [available, setAvailable] = useState(false);
    const [noResult, setNoResult] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    //   const onChangeFunc = (event) =>{
    //     const {name, value} = event.target;
    //     setExplore({...explore, [name]:value})
    //   }


    const reqArr = [];

    console.log("Line 36")

    const handlerequestForBuy = async (_surveyNo, _BidAmount, _FileURI) => {
        console.log("Survey Number" + _surveyNo)
        console.log(typeof (_surveyNo))
        await contract.RequestForBuy('M', 'N', 'Y', _surveyNo, _BidAmount, _FileURI, {
            from: account
        })
        myArray[_surveyNo - 1000] = true
        setDidIRequested(true);

    }



    useEffect(() => {
        const getRequests = async () => {
            // const _indices = await contract.getIndices({from: account});
            const _totalTendors = await contract.getTotalTendors({ from: account });

            //const _totalIndices = _indices[0].words[0];
            console.log("Line 54")

            if (_totalTendors > 0) {

                for (let j = 1000; j < _totalTendors; j++) {
                    console.log("Line 59")

                    const landDetails = await contract.getLandDetails('M', 'N', 'Y', j, {
                        from: account
                    })
                    const owner = landDetails[0];

                    const isAvaliable = await contract.isAvailable('M', 'N', 'Y', j, {
                        from: account
                    })
                    if (account === owner) {
                        setIsOwner(true)
                    }
                    else {
                        setIsOwner(false);
                        if (isAvaliable) {
                            const _didIRequested = await contract.didIRequested('M', 'N', 'Y', j, {
                                from: account
                            })
                            myArray[j - 1000] = _didIRequested;
                            setDidIRequested(_didIRequested);
                        }
                    }


                    const propertyId = landDetails[1].words[0]
                    const index = landDetails[2].words[0]
                    const marketValue = landDetails[3].words[0]
                   const tendorName = landDetails[4]
                    const tendortype = landDetails[5]
                    const ipfsuri = landDetails[6]
                    const surveyNo = j

                    const OwnerName = await contract.getUserName(landDetails[0]);

                    const reqDetails = {
                        owner: landDetails[0],
                        OwnerName: OwnerName,
                        tendortype:tendortype,
                        tendorName:tendorName,
                        ipfsuri:ipfsuri,
                        propertyId: landDetails[1].words[0],
                        index: landDetails[2].words[0],
                        indexj: j,
                        marketValue: landDetails[3].words[0],
                        surveyNo: j,
                        didIRequested: myArray[j - 1000]
                    }
                    console.log("below reqdetails.............")
                    reqArr.push(reqDetails);


                    setLandDetail({ owner, OwnerName,tendorName,tendortype,ipfsuri,propertyId, index, marketValue, surveyNo, didIRequested })
                    setAvailable(isAvaliable);
                    setNoResult(1);

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
        await contract.AcceptRequest(_index, _reqNo, { from: account });
        setReload(!reload);
    }



    return (
        <div className='container'>
            {
                (length == 0) ?
                    <div className="no-result-div">
                        <p className='no-result'>No Tendors &nbsp; :( </p>
                    </div>
                    :
                    requestList.map((landDetail, indexj) => {
                        return (
                            <DisplayExploreResult

                                owner={landDetail.owner}
                                OwnerName={landDetail.OwnerName}
                                tendorName={landDetail.tendorName}
                                tendortype={landDetail.tendortype}
                                ipfsuri={landDetail.ipfsuri}
                                propertyId={landDetail.propertyId}
                                surveyNo={landDetail.surveyNo}
                                marketValue={landDetail.marketValue}
                                available={available}
                                isAdmin={props.isAdmin}
                                didIRequested={landDetail.didIRequested}
                                noResult={noResult}
                                isOwner={isOwner}
                                requestForBuy={handlerequestForBuy}

                            />
                        )
                    })
            }
        </div>
    )
}

export default ExploreAll