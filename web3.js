let web3, contract, userAddress;

// Define the images for the slot machine reels
const reelImages = [
	"./reel/1.png",
	"./reel/2.png",
	"./reel/3.png",
	"./reel/4.png",
	"./reel/5.png",
	"./reel/6.png",
	"./reel/7.png",
];
// Variables to track the current state of the slot machine
let isSpinning = false;

let currentSpinResult = [0, 0, 0]; // Initialize with default values

// Get the modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("load-dogespin-button");
var confirmLoadBtn = document.getElementById("confirm-load");
var closespan = document.getElementsByClassName("close")[0];

btn.onclick = function () {
	modal.style.display = "block";
}
// When the user clicks on the close button, close the modal
closespan.onclick = function () {
	modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

confirmLoadBtn.onclick = function () {
	var loadWCVal = document.querySelector('input[name="load-wc"]:checked').value;
	// Call the contract's getGreeting function
	contract.methods.depositWDOGE(loadWCVal).send({from: userAddress})
		.then(result => console.log(result))
		.catch(error => console.error(error));
}

function spinSlotMachine() {
	if (isSpinning) return; // Prevent multiple spins

	isSpinning = true;
	// Simulate spinning by changing the images rapidly
	const reelElements = document.querySelectorAll(".reel img");
	const spinDuration = 3000; // Adjust the duration as needed

	// Generate random results (0 to reelImages.length - 1) for each reel
	const randomResults = [];
	for (let i = 0; i < 3; i++) {
		randomResults.push(Math.floor(Math.random() * reelImages.length));
	}
	// Perform the spinning animation
	const startTime = Date.now();
	function spin() {
		const currentTime = Date.now();
		const elapsedTime = currentTime - startTime;
		if (elapsedTime >= spinDuration) {
			// Stop spinning and display the result
			isSpinning = false;
			currentSpinResult = randomResults;
			updateSlotMachine();
			return;
		}
		// Rotate the images
		for (let i = 0; i < reelElements.length; i++) {
			const newIndex = (randomResults[i] + Math.floor(elapsedTime / 100)) % reelImages.length;
			reelElements[i].src = reelImages[newIndex];
		}
		requestAnimationFrame(spin);
	}
	spin();
	console.log('randomResults ==> ', randomResults);
}

// Function to update the slot machine display based on the current result
function updateSlotMachine() {
	const reelElements = document.querySelectorAll(".reel img");
	for (let i = 0; i < reelElements.length; i++) {
		reelElements[i].src = reelImages[currentSpinResult[i]];
	}
}

async function contractFunc() {
	web3 = new Web3(window.ethereum);
	contract = new web3.eth.Contract(abi, contractAddress);

	// Get the user's Ethereum address
	const accounts = await web3.eth.getAccounts();
	userAddress = accounts[0];
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


	// Enable the spin button
	document.getElementById('spin-button').removeAttribute('disabled');
	document.getElementById('spin-button').addEventListener('click', () => spinSlotMachine());
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
