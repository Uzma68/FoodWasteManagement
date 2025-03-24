// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract FoodWasteManagement {
    address public admin;
    uint public donationCount;

    struct Donation {
        uint id;
        string foodType;
        uint quantity;
        address donor;
        address recipient;
        bool claimed;
    }

    mapping(uint => Donation) public donations;

    event DonationCreated(uint donationId, string foodType, uint quantity, address donor);
    event DonationClaimed(uint donationId, address recipient);
    event AdminAssigned(address adminAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        donationCount = 0;
        emit AdminAssigned(admin);
    }

    function createDonation(string calldata _foodType, uint _quantity) external {
        require(bytes(_foodType).length > 0, "Food type cannot be empty");
        require(_quantity > 0, "Quantity must be greater than zero");

        donationCount++;
        donations[donationCount] = Donation(donationCount, _foodType, _quantity, msg.sender, address(0), false);

        emit DonationCreated(donationCount, _foodType, _quantity, msg.sender);
    }

    function claimDonation(uint _donationId) external {
        require(_donationId > 0 && _donationId <= donationCount, "Invalid donation ID");
        require(!donations[_donationId].claimed, "Donation already claimed");

        donations[_donationId].recipient = msg.sender;
        donations[_donationId].claimed = true;

        emit DonationClaimed(_donationId, msg.sender);
    }
}