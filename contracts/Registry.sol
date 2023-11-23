// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

contract Registry {
    address public superAdmin;
    uint256 public totalAdmins;
    uint256 public totalVendors;
    uint256 public totalTendors = 1000;

    struct Admin {
        address adminAddress;
        string city;
        string district;
        string state;
    }

    struct Vendor {
        address vendorAddress;
        string city;
        string district;
        string state;
        string year;
        string vendortype;
        uint256 rating;
        uint256 noofRaters;
    }

    struct LandDetails {
        address owner;
        string tendertype;
        string tenderName;
        address admin;
        string ipfsuri;
        uint256 propertyId;
        uint256 surveyNumber;
        uint256 index;
        bool registered;
        uint256 marketValue;
        bool markAvailable;
        mapping(uint256 => RequestDetails) requests; // reqNo => RequestDetails
        uint256 noOfRequests; // other users requested to this land
    }

    struct UserProfile {
        address userAddr;
        string fullName;
        string gender;
        string email;
        string contact;
        string residentialAddr;
        uint256 totalIndices;
        uint256 requestIndices; // this user requested to other lands
    }

    struct OwnerOwns {
        uint256 surveyNumber;
        string state;
        string district;
        string city;
    }

    struct AdminOwns {
        uint256 surveyNo;
        string state;
        string district;
        string city;
        address AllocatedTo;
    }

    struct RequestedLands {
        uint256 surveyNumber;
        string state;
        string district;
        string city;
    }

    struct RequestDetails {
        address whoRequested;
        uint256 reqIndex;
        uint256 BidAmount;
        string FileURI;
    }

    mapping(address => Admin) public admins;
    mapping(address => Vendor) public vendors;
    mapping(address => mapping(uint256 => OwnerOwns)) public ownerMapsProperty;
    mapping(address => mapping(uint256 => AdminOwns)) public adminMapsProperty; // ownerAddr => index no. => OwnerOwns
    mapping(address => mapping(uint256 => RequestedLands))
        public requestedLands; // ownerAddr => reqIndex => RequestedLands
    mapping(string => mapping(string => mapping(string => mapping(uint256 => LandDetails))))
        public landDetalsMap; // state => district => city => surveyNo => LandDetails
    mapping(address => UserProfile) public userProfile;

    constructor() {
        superAdmin = msg.sender;
    }

    modifier onlyAdmin() {
        require(
            admins[msg.sender].adminAddress == msg.sender,
            "Only admin can Register land"
        );
        _;
    }

    // SuperAdmin: Registers new admin
    function addAdmin(
        address _adminAddr,
        string memory _state,
        string memory _district,
        string memory _city,
        string memory _fullName,
        string memory _gender,
        string memory _email,
        string memory _contact,
        string memory _residentialAddr
    ) external {
        Admin storage newAdmin = admins[_adminAddr];
        totalAdmins++;

        newAdmin.adminAddress = _adminAddr;
        newAdmin.city = _city;
        newAdmin.district = _district;
        newAdmin.state = _state;

        UserProfile storage newUserProfile = userProfile[_adminAddr];

        newUserProfile.fullName = _fullName;
        newUserProfile.gender = _gender;
        newUserProfile.email = _email;
        newUserProfile.contact = _contact;
        newUserProfile.residentialAddr = _residentialAddr;
    }

    function addVendor(
        address _vendorAddr,
        string memory _state,
        string memory _district,
        string memory _city,
        string memory _fullName,
        string memory _gender,
        string memory _email,
        string memory _contact,
        string memory _residentialAddr,
        string memory _year,
        string memory _vendortype
    ) external {
        Vendor storage newVendor = vendors[_vendorAddr];
        totalVendors++;

        newVendor.vendorAddress = _vendorAddr;
        newVendor.city = _city;
        newVendor.district = _district;
        newVendor.state = _state;
        newVendor.rating = 5;
        newVendor.noofRaters = 1;
        newVendor.vendortype = _vendortype;
        newVendor.year = _year;

        UserProfile storage newUserProfile = userProfile[_vendorAddr];

        newUserProfile.fullName = _fullName;
        newUserProfile.gender = _gender;
        newUserProfile.email = _email;
        newUserProfile.contact = _contact;
        newUserProfile.residentialAddr = _residentialAddr;
    }

    //function Give Rating
    function GiveRating(address _vendortorating, uint256 _ratenumber) public {
        vendors[_vendortorating].rating =
            vendors[_vendortorating].rating +
            _ratenumber;
        vendors[_vendortorating].noofRaters++;
    }

    // check if it is admin
    function isAdmin() external view returns (bool) {
        if (admins[msg.sender].adminAddress == msg.sender) {
            return true;
        } else return false;
    }

    //Chekc if it is Vendor
    function isVendor() external view returns (bool) {
        if (vendors[msg.sender].vendorAddress == msg.sender) {
            return true;
        } else return false;
    }

    // Admin: registers land
    function registerLand(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _propertyId,
        uint256 _surveyNo,
        address _owner,
        uint256 _marketValue,
        string memory _tenderName,
        string memory _tendertype,
        string memory _ipfsuri
    ) external onlyAdmin {
        require(
            keccak256(abi.encodePacked(admins[msg.sender].state)) ==
                keccak256(abi.encodePacked(_state)) &&
                keccak256(abi.encodePacked(admins[msg.sender].district)) ==
                keccak256(abi.encodePacked(_district)) &&
                keccak256(abi.encodePacked(admins[msg.sender].city)) ==
                keccak256(abi.encodePacked(_city)),
            "Admin can only register land of same city."
        );

        require(
            landDetalsMap[_state][_district][_city][totalTendors].registered ==
                false,
            "Survey Number already registered!"
        );

        LandDetails storage newLandRegistry = landDetalsMap[_state][_district][
            _city
        ][totalTendors];

        OwnerOwns storage newOwnerOwns = ownerMapsProperty[msg.sender][
            userProfile[msg.sender].totalIndices
        ];

        AdminOwns storage newAdminOwns = adminMapsProperty[msg.sender][
            userProfile[msg.sender].totalIndices
        ];

        newLandRegistry.owner = _owner;
        newLandRegistry.admin = msg.sender;
        newLandRegistry.propertyId = totalTendors;
        newLandRegistry.surveyNumber = totalTendors;
        newLandRegistry.index = userProfile[_owner].totalIndices;
        newLandRegistry.registered = true;
        newLandRegistry.marketValue = _marketValue;
        newLandRegistry.markAvailable = true;
        newLandRegistry.tenderName = _tenderName;
        newLandRegistry.tendertype = _tendertype;
        newLandRegistry.ipfsuri = _ipfsuri;

        newOwnerOwns.surveyNumber = totalTendors;
        newOwnerOwns.state = _state;
        newOwnerOwns.district = _district;
        newOwnerOwns.city = _city;

        userProfile[_owner].totalIndices++;

        totalTendors++;
    }

    // User_1: set user profile
    function setUserProfile(
        string memory _fullName,
        string memory _gender,
        string memory _email,
        string memory _contact,
        string memory _residentialAddr
    ) public {
        UserProfile storage newUserProfile = userProfile[msg.sender];

        newUserProfile.fullName = _fullName;
        newUserProfile.gender = _gender;
        newUserProfile.email = _email;
        newUserProfile.contact = _contact;
        newUserProfile.residentialAddr = _residentialAddr;
    }

    // User_1: mark property available
    function markMyPropertyAvailable(uint256 indexNo) external {
        string memory state = ownerMapsProperty[msg.sender][indexNo].state;
        string memory district = ownerMapsProperty[msg.sender][indexNo]
            .district;
        string memory city = ownerMapsProperty[msg.sender][indexNo].city;
        uint256 surveyNumber = ownerMapsProperty[msg.sender][indexNo]
            .surveyNumber;

        require(
            landDetalsMap[state][district][city][surveyNumber].markAvailable ==
                false,
            "Property already marked available"
        );

        landDetalsMap[state][district][city][surveyNumber].markAvailable = true;
    }

    // User_2: Request for buy  ownerAddress & index = arguements
    function RequestForBuy(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo,
        uint256 _BidAmount,
        string memory _FileURI
    ) external {
        LandDetails storage thisLandDetail = landDetalsMap[_state][_district][
            _city
        ][_surveyNo];
        require(
            thisLandDetail.markAvailable == true,
            "This property is NOT marked for sale!"
        );

        uint256 req_serialNum = thisLandDetail.noOfRequests;
        thisLandDetail.requests[req_serialNum].whoRequested = msg.sender;
        thisLandDetail.requests[req_serialNum].reqIndex = userProfile[
            msg.sender
        ].requestIndices;
        thisLandDetail.requests[req_serialNum].BidAmount = _BidAmount;
        thisLandDetail.requests[req_serialNum].FileURI = _FileURI;
        thisLandDetail.noOfRequests++;

        // adding requested land to user_2 profile
        RequestedLands storage newReqestedLands = requestedLands[msg.sender][
            userProfile[msg.sender].requestIndices
        ];
        newReqestedLands.surveyNumber = _surveyNo;
        newReqestedLands.state = _state;
        newReqestedLands.district = _district;
        newReqestedLands.city = _city;

        userProfile[msg.sender].requestIndices++;
    }

    // User_1: Accept the buy request; sell.
    function AcceptRequest(uint256 _index, uint256 _reqNo) public {
        uint256 _surveyNo = ownerMapsProperty[msg.sender][_index].surveyNumber;
        string memory _state = ownerMapsProperty[msg.sender][_index].state;
        string memory _district = ownerMapsProperty[msg.sender][_index]
            .district;
        string memory _city = ownerMapsProperty[msg.sender][_index].city;

        // updating LandDetails
        address newOwner = landDetalsMap[_state][_district][_city][_surveyNo]
            .requests[_reqNo]
            .whoRequested;

        uint256 newOwner_reqIndex = landDetalsMap[_state][_district][_city][
            _surveyNo
        ].requests[_reqNo].reqIndex;

        uint256 noOfReq = landDetalsMap[_state][_district][_city][_surveyNo]
            .noOfRequests;

        string memory _FileURI = landDetalsMap[_state][_district][_city][
                _surveyNo
            ].requests[_reqNo].FileURI;

        uint256 _BidAmount = landDetalsMap[_state][_district][_city][
                _surveyNo
            ].requests[_reqNo].BidAmount;

        // deleting requested land from all requesters AND removing all incoming requests
        for (uint256 i = 0; i < noOfReq; i++) {
            address requesterAddr = landDetalsMap[_state][_district][_city][
                _surveyNo
            ].requests[i].whoRequested;
            uint256 requester_reqIndx = landDetalsMap[_state][_district][_city][
                _surveyNo
            ].requests[i].reqIndex;

            delete requestedLands[requesterAddr][requester_reqIndx];
            delete landDetalsMap[_state][_district][_city][_surveyNo].requests[
                i
            ];
        }
        
        

        landDetalsMap[_state][_district][_city][_surveyNo].owner = newOwner;
        landDetalsMap[_state][_district][_city][_surveyNo].ipfsuri = _FileURI;
        landDetalsMap[_state][_district][_city][_surveyNo].marketValue = _BidAmount;
        landDetalsMap[_state][_district][_city][_surveyNo]
            .markAvailable = false;
        landDetalsMap[_state][_district][_city][_surveyNo].noOfRequests = 0;

        // deleting property from user_1's ownerMapsProperty
        // delete ownerMapsProperty[msg.sender][_index];

        // adding ownerMapsProperty for newOwner
        uint256 newOwnerTotProp = userProfile[newOwner].totalIndices;
        OwnerOwns storage newOwnerOwns = ownerMapsProperty[newOwner][
            newOwnerTotProp
        ];

        newOwnerOwns.surveyNumber = _surveyNo;
        newOwnerOwns.state = _state;
        newOwnerOwns.district = _district;
        newOwnerOwns.city = _city;

        landDetalsMap[_state][_district][_city][_surveyNo]
            .index = newOwnerTotProp;

        userProfile[newOwner].totalIndices++;
    }

    //******* GETTERS **********

    // return land details
    function getLandDetails(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo
    )
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            string memory,
            string memory,
            string memory
        )
    {
        address owner = landDetalsMap[_state][_district][_city][_surveyNo]
            .owner;
        uint256 propertyid = landDetalsMap[_state][_district][_city][_surveyNo]
            .propertyId;
        uint256 indx = landDetalsMap[_state][_district][_city][_surveyNo].index;

        uint256 mv = landDetalsMap[_state][_district][_city][_surveyNo]
            .marketValue;

        string memory tendorName = landDetalsMap[_state][_district][_city][
            _surveyNo
        ].tenderName;

        string memory tendortype = landDetalsMap[_state][_district][_city][
            _surveyNo
        ].tendertype;

        string memory ipfsuri = landDetalsMap[_state][_district][_city][
            _surveyNo
        ].ipfsuri;

        return (owner, propertyid, indx, mv, tendorName, tendortype, ipfsuri);
    }

    function getRequestCnt_propId(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo
    ) external view returns (uint256, uint256) {
        uint256 _noOfRequests = landDetalsMap[_state][_district][_city][
            _surveyNo
        ].noOfRequests;
        uint256 _propertyId = landDetalsMap[_state][_district][_city][_surveyNo]
            .propertyId;
        return (_noOfRequests, _propertyId);
    }

    function getRequesterDetail(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo,
        uint256 _reqIndex
    ) external view returns (address) {
        address requester = landDetalsMap[_state][_district][_city][_surveyNo]
            .requests[_reqIndex]
            .whoRequested;

        return (requester);
    }

    function getRequesterBidAmount(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo,
        uint256 _reqIndex
    ) external view returns (uint256) {
        uint256 BidAmount = landDetalsMap[_state][_district][_city][_surveyNo]
            .requests[_reqIndex]
            .BidAmount;

        return (BidAmount);
    }

    function getRequesterFileURI(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo,
        uint256 _reqIndex
    ) external view returns (string memory) {
        string memory RequesterFileURI = landDetalsMap[_state][_district][
            _city
        ][_surveyNo].requests[_reqIndex].FileURI;

        return (RequesterFileURI);
    }

    function getRequesterName(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo,
        uint256 _reqIndex
    ) external view returns (string memory) {
        address requester = landDetalsMap[_state][_district][_city][_surveyNo]
            .requests[_reqIndex]
            .whoRequested;

        string memory NameofRequester = userProfile[requester].fullName;
        return (NameofRequester);
    }

    function isAvailable(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo
    ) external view returns (bool) {
        bool available = landDetalsMap[_state][_district][_city][_surveyNo]
            .markAvailable;
        return (available);
    }

    function getOwnerOwns(
        uint256 indx
    )
        external
        view
        returns (string memory, string memory, string memory, uint256)
    {
        uint256 surveyNo = ownerMapsProperty[msg.sender][indx].surveyNumber;
        string memory state = ownerMapsProperty[msg.sender][indx].state;
        string memory district = ownerMapsProperty[msg.sender][indx].district;
        string memory city = ownerMapsProperty[msg.sender][indx].city;

        return (state, district, city, surveyNo);
    }

    function getAdminOwns(
        uint256 indx
    )
        external
        view
        returns (string memory, string memory, string memory, uint256)
    {
        uint256 surveyNo = adminMapsProperty[msg.sender][indx].surveyNo;
        string memory state = adminMapsProperty[msg.sender][indx].state;
        string memory district = adminMapsProperty[msg.sender][indx].district;
        string memory city = adminMapsProperty[msg.sender][indx].city;

        return (state, district, city, surveyNo);
    }

    function getRequestedLands(
        uint256 indx
    )
        external
        view
        returns (string memory, string memory, string memory, uint256)
    {
        uint256 surveyNo = requestedLands[msg.sender][indx].surveyNumber;
        string memory state = requestedLands[msg.sender][indx].state;
        string memory district = requestedLands[msg.sender][indx].district;
        string memory city = requestedLands[msg.sender][indx].city;

        return (state, district, city, surveyNo);
    }

    function getUserProfile()
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        string memory fullName = userProfile[msg.sender].fullName;
        string memory gender = userProfile[msg.sender].gender;
        string memory email = userProfile[msg.sender].email;
        string memory contact = userProfile[msg.sender].contact;
        string memory residentialAddr = userProfile[msg.sender].residentialAddr;

        return (fullName, gender, email, contact, residentialAddr);
    }

    function getUserName(address _addr) external view returns (string memory) {
        string memory fullName = userProfile[_addr].fullName;

        return (fullName);
    }



    function getestablishYear(
        address _addr
    ) external view returns (string memory) {
        string memory year = vendors[_addr].year;

        return (year);
    }

    function getIndices() external view returns (uint256, uint256) {
        uint256 _totalIndices = userProfile[msg.sender].totalIndices;
        uint256 _reqIndices = userProfile[msg.sender].requestIndices;

        return (_totalIndices, _reqIndices);
    }

    function didIRequested(
        string memory _state,
        string memory _district,
        string memory _city,
        uint256 _surveyNo
    ) external view returns (bool) {
        LandDetails storage thisLandDetail = landDetalsMap[_state][_district][
            _city
        ][_surveyNo];
        uint256 _noOfRequests = thisLandDetail.noOfRequests;

        if (_noOfRequests == 0) return (false);

        for (uint256 i = 0; i < _noOfRequests; i++) {
            if (thisLandDetail.requests[i].whoRequested == msg.sender) {
                return (true);
            }
        }

        return (false);
    }

    function getTotalTendors() external view returns (uint256) {
        return (totalTendors);
    }
}
