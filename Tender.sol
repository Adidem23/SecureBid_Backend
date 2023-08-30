// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Tendor {
    address public SuperAdminAddress;
    uint256 public TotalAdmins;
    uint256 public TotalVendors;
    uint256 public TotalTenders;
    uint256 public TenderIDConstant = 10000;

    struct Admin {
        string AdminName;
        address AdminAddress;
        string AdminContactAddress;
        string AdminContactNumber;
        string AdminEmailAddress;
    }

    struct Vendor {
        string VendorName;
        address VendorAddress;
        string VendorType;
        string EstablishedYear;
        string VendorContactAddress;
        string VendorContactNumber;
        string VendorEmailAddress;
        uint256 VendorRating;
        uint256 TotalIndices; // Land-Registry
        uint256 Requestindices;
    }

    struct Tender {
        uint256 TenderId;
        string TenderName;
        string TenderType;
        string Description;
        uint256 TenderBudget;
        string TenderDeadline;
        string TenderLocation;
        address TenderCreator;
        mapping(uint256 => RequestDetails) requests;
        uint256 NoOfRequests;
        address TenderHolder;
        bool TenderAllocated;
        bool TenderStatus;
    }

    struct RequestDetails {
        address Whorequested;
        uint256 BidAmount;
        uint256 reqIndex;
        //details
    }

    struct RequestedTenders {
        uint256 TenderId;
        uint256 BidAmount;
    }

    struct VenderOwns {
        uint TenderId;
    }

    VenderOwns public VenderOwnsPublic;

    mapping(address => Admin) public admins;
    mapping(address => Vendor) public vendors;
    mapping(uint256 => Tender) public tenders;
    mapping(address => mapping(uint256 => RequestedTenders)) public requestedTendersmapping;
    mapping(address => mapping(uint256 => VenderOwns)) public VenderOwnsTenderMapping;

    constructor() {
        SuperAdminAddress = msg.sender;
    }

    modifier OnlySuperAdmin() {
        require(SuperAdminAddress == msg.sender, "Only SuperAdmin Can Change");
        _;
    }

    modifier OnlyAdmin() {
        require(
            admins[msg.sender].AdminAddress == msg.sender,
            "Only Admin Can Change"
        );
        _;
    }

    modifier OnlyVendor() {
        require(
            vendors[msg.sender].VendorAddress == msg.sender,
            "You Must Be a Vendor"
        );
        _;
    }

    function AddAdmin(
        string memory _AdminName,
        address _Adminaddress,
        string memory _AdminContactAddress,
        string memory _AdminContactNumber,
        string memory _AdminEmailAddress
    ) external OnlySuperAdmin {
        Admin storage NewAdmin = admins[_Adminaddress];
        NewAdmin.AdminName = _AdminName;
        NewAdmin.AdminAddress = _Adminaddress;
        NewAdmin.AdminContactAddress = _AdminContactAddress;
        NewAdmin.AdminContactNumber = _AdminContactNumber;
        NewAdmin.AdminEmailAddress = _AdminEmailAddress;
        TotalAdmins++;
    }

    function isAdmin() external view returns (bool) {
        if (admins[msg.sender].AdminAddress == msg.sender) {
            return true;
        } else return false;
    }

    function AddVendors(
        string memory _VendorName,
        address _VendorAddress,
        string memory _VendorType,
        string memory _EstablishedYear,
        string memory _VendorContactAddress,
        string memory _VendorContactNumber,
        string memory _VendorEmailAddress,
        uint256 _VendorRating
    ) external OnlySuperAdmin {
        Vendor storage NewVendor = vendors[_VendorAddress];
        NewVendor.VendorName = _VendorName;
        NewVendor.VendorAddress = _VendorAddress;
        NewVendor.VendorType = _VendorType;
        NewVendor.EstablishedYear = _EstablishedYear;
        NewVendor.VendorContactAddress = _VendorContactAddress;
        NewVendor.VendorContactNumber = _VendorContactNumber;
        NewVendor.VendorEmailAddress = _VendorEmailAddress;
        NewVendor.VendorRating = _VendorRating;
        TotalVendors++;
    }

    function isVendor() external view returns (bool) {
        if (vendors[msg.sender].VendorAddress == msg.sender) {
            return true;
        } else return false;
    }

    function CreateTender(
        string memory _TenderName,
        string memory _TenderType,
        string memory _Description,
        uint256 _Budget,
        string memory _TenderDeadline,
        string memory _TenderLocation
    ) external OnlyAdmin {
        Tender storage NewTenders = tenders[TenderIDConstant];

        NewTenders.TenderId = TenderIDConstant;
        NewTenders.TenderName = _TenderName;
        NewTenders.TenderType = _TenderType;
        NewTenders.Description = _Description;
        NewTenders.TenderBudget = _Budget;
        NewTenders.TenderDeadline = _TenderDeadline;
        NewTenders.TenderLocation = _TenderLocation;
        NewTenders.TenderCreator = msg.sender;
        NewTenders.TenderHolder = msg.sender;
        NewTenders.TenderStatus = true;
        NewTenders.TenderAllocated=false;
        TenderIDConstant++;
        TotalTenders++;
    }

    function getParticulartendor(uint256 _TenderId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            address,
            address,
            bool,
            bool
        )
    {
        Tender storage ParticularTender = tenders[_TenderId];
        return (
            ParticularTender.TenderName,
            ParticularTender.TenderType,
            ParticularTender.Description,
            ParticularTender.TenderBudget,
            ParticularTender.TenderDeadline,
            ParticularTender.TenderLocation,
            ParticularTender.TenderCreator,
            ParticularTender.TenderHolder,
            ParticularTender.TenderStatus,
            ParticularTender.TenderAllocated
        );
    }

    function MakeBid(uint256 _TenderId, uint256 _BidAmount) public OnlyVendor {
        Tender storage thisTender = tenders[_TenderId];
        require(thisTender.TenderStatus == true, "Tender is Not Available");
        uint256 req_serialNum = thisTender.NoOfRequests;
        thisTender.requests[req_serialNum].Whorequested = msg.sender;
        thisTender.requests[req_serialNum].reqIndex = vendors[msg.sender].Requestindices;
        thisTender.requests[req_serialNum].BidAmount = _BidAmount;
        thisTender.NoOfRequests++;

        // Adding Requested Tender to Vendor Profile //
        RequestedTenders storage NewRequestedTenders = requestedTendersmapping[msg.sender][vendors[msg.sender].Requestindices];
        NewRequestedTenders.TenderId = _TenderId;
        NewRequestedTenders.BidAmount = _BidAmount;

        vendors[msg.sender].Requestindices++;
    }

    //Allocate Tender
    function AllocateTender(uint256 _index, uint256 _Reqno) external {

        uint256 _TenderIdToAllocate = VenderOwnsTenderMapping[msg.sender][_index].TenderId;
        address NewTenderOwner = tenders[_TenderIdToAllocate].requests[_Reqno].Whorequested;
        tenders[_TenderIdToAllocate].TenderHolder = NewTenderOwner;
        tenders[_TenderIdToAllocate].TenderAllocated=true;
        tenders[_TenderIdToAllocate].TenderStatus=false;

     // Adding VendorOwns To newvendor 
       uint newOwnerToTender=vendors[NewTenderOwner].TotalIndices;
       VenderOwns storage NewVenderOwns=VenderOwnsTenderMapping[NewTenderOwner][newOwnerToTender];

       NewVenderOwns.TenderId==_TenderIdToAllocate;

       vendors[NewTenderOwner].TotalIndices++;

    }

    function getRequestedvendorDetails(uint _tenderid,uint _reqindex) public view returns(address){
       return tenders[_tenderid].requests[_reqindex].Whorequested;
    }
  


}
