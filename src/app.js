const Web3 = require('web3');

// Replace with your contract address
const contractAddress = 0x99581Ca2b96Da11009C5054Ad3605C313f8fAdeF;

// Replace with your Infura project ID or Ethereum node URL
const sepoliaUrl = https://eth-sepolia.g.https://eth-sepolia.g.alchemy.com/v2/W7JcG-jpCCoDS1BsuMaYtU49Fmi4zIvualchemy.com/v2/YOUR_API_KEY';
// Initialize Web3
const web3 = new Web3(sepoliaUrl);

// ABI from the FoodWasteManagement.json file
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "adminAddress",
        "type": "address"
      }
    ],
    "name": "AdminAssigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "donationId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "DonationClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "donationId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "foodType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      }
    ],
    "name": "DonationCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "donationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "donations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "foodType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_foodType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "createDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_donationId",
        "type": "uint256"
      }
    ],
    "name": "claimDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to create a donation
async function createDonation(foodType, quantity) {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  const result = await contract.methods.createDonation(foodType, quantity).send({ from: sender });
  console.log('Donation created:', result);

  // Update the DOM
  document.getElementById('donation-status').innerText = `Donation created: ${quantity} ${foodType}`;
}

// Function to claim a donation
async function claimDonation(donationId) {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  const result = await contract.methods.claimDonation(donationId).send({ from: sender });
  console.log('Donation claimed:', result);

  // Update the DOM
  document.getElementById('claim-status').innerText = `Donation claimed: ID ${donationId}`;
}

// Function to display available donations
async function displayDonations() {
  const donationCount = await contract.methods.donationCount().call();
  const donationsList = document.getElementById('donations-list');
  donationsList.innerHTML = ''; // Clear previous list

  for (let i = 1; i <= donationCount; i++) {
    const donation = await contract.methods.donations(i).call();
    if (!donation.claimed) {
      const listItem = document.createElement('li');
      listItem.innerText = `ID: ${donation.id}, Food: ${donation.foodType}, Quantity: ${donation.quantity}`;
      donationsList.appendChild(listItem);
    }
  }
}

// Event Listeners
contract.events.DonationCreated({ fromBlock: 0 }, (error, event) => {
  if (error) console.error(error);
  else {
    console.log('DonationCreated event:', event);
    displayDonations(); // Refresh the donations list
  }
});

contract.events.DonationClaimed({ fromBlock: 0 }, (error, event) => {
  if (error) console.error(error);
  else {
    console.log('DonationClaimed event:', event);
    displayDonations(); // Refresh the donations list
  }
});

// Initialize
displayDonations();
