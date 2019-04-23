function getContract() {
	let address = "0xd8572475e0da40e8b96b6c71524e4e26b352291e"; // TODO: replace with your contract's address
	let abi = [
		{
			"constant": true,
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "totalVotes",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"name": "candidates",
			"outputs": [
				{
					"name": "name",
					"type": "string"
				},
				{
					"name": "voteCount",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "voters",
			"outputs": [
				{
					"name": "authorized",
					"type": "bool"
				},
				{
					"name": "voted",
					"type": "bool"
				},
				{
					"name": "vote",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"name": "_name",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "candidateName",
					"type": "string"
				},
				{
					"indexed": false,
					"name": "voteCount",
					"type": "uint256"
				}
			],
			"name": "Vote",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "candidateName",
					"type": "string"
				}
			],
			"name": "NewCandidate",
			"type": "event"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getNumCandidate",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "string"
				}
			],
			"name": "addCandidate",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_voter",
					"type": "address"
				}
			],
			"name": "authorize",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_candidate",
					"type": "uint256"
				}
			],
			"name": "vote",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]// TODO: copy and paste the ABI from remix
	validateMetaMask();
	//
	//web3.currentProvider.publicConfigStore.on('update', ()=>{console.log('ok');});


	// window.ethereum.enable();


	this.provider = new ethers.providers.Web3Provider(web3.currentProvider); // connect to Metamask
	//let provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // connect to Ganache locally
	let contract = new ethers.Contract(address, abi, provider.getSigner());
	console.log(provider.getSigner().getAddress());
	//console.log(web3.currentProvider);
	console.log("Contract Initialization Successful");
	return contract;
}
let contract;
ethereum.on('accountsChanged', async function (accounts) {
	contract = getContract();
	//alert("accountsChanged");
	await getElectionName();
})


//var contract = getContract();


function validateMetaMask() {
	if (typeof web3 !== 'undefined') {
		console.log('MetaMask is installed')
		web3.eth.getAccounts(function (err, accounts) {
			if (err != null) {
				console.log(err)
			}
			else if (accounts.length === 0) {
				console.log('MetaMask is locked')
			}
			else {
				console.log('MetaMask is unlocked')
			}
		});
	}
	else {
		console.log('MetaMask is not installed')
	}
}
