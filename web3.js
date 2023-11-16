async function spinSlotMachine(contract) {
	if (isSpinning) return; // Prevent multiple spins

	isSpinning = true;
	// Simulate spinning by changing the images rapidly

	const reelElements = document.querySelectorAll('.reel img');
	const spinDuration = 3000; // Adjust the duration as needed

	// Call the spin function on your contract

	try {
		await contract.methods.spin().send({ from: userAddress, value: spinCost });
		const spinResult = await contract.methods.wDOGEBalances(userAddress).call();
		// Update the currentSpinResult with the result from the contract

		currentSpinResult = spinResult;
	} catch (error) {
		console.error(error);
		isSpinning = false;
		return;
	}
	// Perform the spinning animation (modify as needed)
	// ...
	// Update the slot machine display

	updateSlotMachine();
}

async function contractFunc() {
	const web3 = new Web3(window.ethereum);

	// Get the user's Ethereum address
	const accounts = await web3.eth.getAccounts();
	const userAddress = accounts[0];
	const shortenedAddress = `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
	// Display the connected address
	document.getElementById("connectButton").style.display = 'none';
	document.getElementById("addresss-div").style.display = 'block';
	document.getElementById("connected-address").innerHTML = shortenedAddress;


	const balance = await web3.eth.getBalance(userAddress);
	const contractBalance = await web3.eth.getBalance(contractAddress);
	const wDogeBalance = await web3.utils.fromWei(balance, "ether");
	const DCTokenBalance = await web3.utils.fromWei(contractBalance, "ether");
	document.getElementById('wDOGE-balance').innerHTML = parseInt(wDogeBalance);
	document.getElementById('DC-token-balance').innerHTML = parseInt(DCTokenBalance);


	return;

	// Create a contract instance
	const spinCost = await contract.methods.spinCost().call();

	document.getElementById('DC-token-balance').textContent = parseInt(DCTokenBalance);
	document.getElementById('wDOGE-balance').textContent = parseInt(wDogeBalance);
	document.getElementById('spin-cost').textContent = `${spinCost} wDOGE`;
	// Enable the spin button

	document.getElementById('spin-button').removeAttribute('disabled');
	document.getElementById('spin-button').addEventListener('click', () => spinSlotMachine(contract));
	// Add a click event listener to the "Connect" button

	document.getElementById('connectButton').addEventListener('click', connectToMetamask);
}

// Function to initialize the app after connecting to MetaMask
async function initializeApp() {
	// Check if web3 is already initialized
	if (!window.ethereum.isMetaMask) {
		alert("You need to install Matamast first.");
	}

	if (typeof window.ethereum !== 'undefined') {
		await window.ethereum.enable();
		contractFunc();
	} else {
		alert('Web3 is not initialized. Please connect to MetaMask first.');
		document.getElementById('DC-token-balance').innerText = "0"
		document.getElementById('wDOGE-balance').innerText = "0"
		return;
	}

	window.ethereum.on('connect', (connectInfo) => {
		console.log(connectInfo);
		contractFunc();
	});
}


// Function to connect to Metamask
async function connectToMetamask() {
	if (window.ethereum) {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			alert('Connected to Metamask!');
		} catch (error) {
			console.error(error);
			alert('Error connecting to Metamask. Please make sure it is installed and unlocked.');
		}
	} else {
		alert('Metamask is not installed. Please install it to use this feature.');
	}
}
// Add a click event listener to the button

document.getElementById('connectButton').addEventListener('click', connectToMetamask);

window.addEventListener('load', initializeApp);
