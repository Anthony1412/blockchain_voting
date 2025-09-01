let web3;
let account;
let contract;

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidateNames",
        "type": "string[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Your deployed contract address here
const contractAddress = "0x2456BC63984ec7c6960954A448Ae1070B291E605";


// DOM elements cached at the top for efficiency
const statusEl = document.getElementById('status');
const accountEl = document.getElementById('account');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const voteButton = document.getElementById('vote-button');
const candidateSelect = document.getElementById('candidate-select');

// Disable vote UI initially
voteButton.disabled = true;
candidateSelect.disabled = true;

// Connect Wallet Button Listener
connectWalletBtn.addEventListener('click', async () => {
  if (typeof window.ethereum === 'undefined') {
    statusEl.innerText = '❌ MetaMask is not installed. Please install it to use this DApp.';
    return;
  }

  web3 = new Web3(window.ethereum);

  try {
    // Request accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
    accountEl.innerHTML = `Account: <span class="status-text">${account}</span>`;

    // Initialize contract instance
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Enable voting UI now
    voteButton.disabled = false;
    candidateSelect.disabled = false;

    // Load candidates from contract
    await loadCandidates();

    statusEl.innerText = '';
    connectWalletBtn.style.display = 'none';  // Hide connect button

    // Reload on account or network change
    window.ethereum.on('accountsChanged', () => window.location.reload());
    window.ethereum.on('chainChanged', () => window.location.reload());

  } catch (error) {
    console.error('MetaMask connection error:', error);
    if (error.code === 4001) {
      statusEl.innerText = '⚠️ Access to MetaMask was denied.';
    } else if (error.message) {
      statusEl.innerText = `❌ Error: ${error.message}`;
    } else {
      statusEl.innerText = '❌ Unknown error connecting to MetaMask.';
    }
  }
});

// Load candidates from the contract and populate UI
async function loadCandidates() {
  if (!contract) throw new Error('Contract not initialized');

  const candidateList = document.getElementById('candidate-list');

  candidateList.innerHTML = '';
  candidateSelect.innerHTML = '';

  try {
    // Fetch candidates from contract
    const candidates = await contract.methods.getCandidates().call();

    // Add a placeholder disabled option
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = 'Select a candidate';
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    candidateSelect.appendChild(placeholderOption);

    candidates.forEach((candidate, index) => {
      // Display candidates in list
      const listItem = document.createElement('li');
      listItem.textContent = `${candidate.name} — 🗳️ ${candidate.voteCount} votes`;
      candidateList.appendChild(listItem);

      // Add candidates to dropdown select
      const option = document.createElement('option');
      option.value = index;
      option.textContent = candidate.name;
      candidateSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading candidates:', error);
    statusEl.innerText = '❌ Failed to load candidates from contract.';
  }
}

// Voting function called on button click
async function vote() {
  if (!contract || !account) {
    statusEl.innerText = '⛔ Contract not initialized or account not connected.';
    return;
  }

  const candidateId = candidateSelect.value;
  if (candidateId === '') {
    statusEl.innerText = '⚠️ Please select a candidate before voting.';
    return;
  }

  try {
    statusEl.innerText = '⏳ Submitting your vote...';

    await contract.methods.vote(candidateId).send({ from: account });

    statusEl.innerText = '✅ Vote submitted successfully!';

    // Refresh candidate list after voting
    await loadCandidates();
  } catch (err) {
    console.error('Vote failed:', err);
    if (err.code === 4001) {
      statusEl.innerText = '❌ Transaction rejected by user.';
    } else {
      statusEl.innerText = '❌ Error submitting vote. Check console for details.';
    }
  }
}
