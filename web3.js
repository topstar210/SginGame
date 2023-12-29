let web3, contract, userAddress, spinToken;

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
let startTime, reelElements;
let isSpinning = false;
const spinDuration = 3000; // Adjust the duration as needed

let currentSpinResult = [0, 0, 0]; // Initialize with default values

// Get the modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("load-dogespin-button");
const spinBtn = document.getElementById('spin-button');
const cashOutBtn = document.getElementById('cash-out-button');
const confirmLoadBtn = document.getElementById("confirm-load");
const closespan = document.getElementsByClassName("close")[0];

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

// handle click deposit button
confirmLoadBtn.onclick = () => depositBalance()

// handle click "spin" button
spinBtn.onclick = () => spinSlotMachine();

// handle click cash out
cashOutBtn.onclick = () => cashOut();


// Check allowance and approve the token
async function checkAllowanceAndApprove(amount) {
	const allowance = await spinToken.methods.allowance(userAddress, contractAddress).call();

	if (allowance < amount) {
		try {
			const maxApprovalValue = "115792089237316195423570985008687907853269984665640564039457584007913129639935"; // Maximum uint256 value
			const approveTx = await spinToken.methods.approve(contractAddress, maxApprovalValue).send({ from: userAddress });
			console.log("Token approved for deposit", approveTx);
		} catch (error) {
			console.error("Error:", error);
			return false
		}
	} else {
		console.log("Sufficient allowance already granted");
	}
	return true;
}

// button disable
function disableButton(btn) {
	btn.innerHTML = 'Loading...';
	btn.disabled = true
}

// enable button
function enableButton(btn, btnTxt = '') {
	btn.innerHTML = btnTxt;
	btn.disabled = false;
	modal.style.display = "none";
	updateBalance();
}


// Function to update the slot machine display based on the current result
function updateSlotMachine() {
	const reelElements = document.querySelectorAll(".reel img");
	for (let i = 0; i < reelElements.length; i++) {
		reelElements[i].src = reelImages[currentSpinResult[i]];
	}
}

// Perform the spinning animation
async function spin(randomResults) {
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
	requestAnimationFrame(() => spin(randomResults));
}

async function spinSlotMachine() {
	if (isSpinning) return; // Prevent multiple spins
	disableButton(spinBtn);

	isSpinning = true;
	reelElements = document.querySelectorAll(".reel img"); // Simulate spinning by changing the images rapidly

	// Generate random results (0 to reelImages.length - 1) for each reel
	// const randomResults = [];
	// for (let i = 0; i < 3; i++) {
	// 	randomResults.push(Math.floor(Math.random() * reelImages.length));
	// }

	try {
		const estimatedGas = await contract.methods.spin().estimateGas({ from: userAddress });
		const spinResTx = await contract.methods.spin().send({ from: userAddress, gas: estimatedGas + BigInt(6000) });
		const spinRes = spinResTx.events.Spun.returnValues.result;
		const rewardAmount = await web3.utils.fromWei(spinResTx.events.Spun.returnValues.rewardAmount, "ether");
		console.log('rewardAmount === ', rewardAmount);

		const randomResults = spinRes.map(val => parseInt(val));
		startTime = Date.now();
		await spin(randomResults);
	} catch (error) {
		console.error("Spin Err: ", error);
	}
	enableButton(spinBtn, 'Spin');
}

// cash out function 
async function cashOut() {
	disableButton(cashOutBtn);
	const rewardBalance = document.getElementById('reward-balance').innerText;
	const amount = await web3.utils.toWei(Number(rewardBalance), "ether");
	await contract.methods.withdrawDCToken(amount).send({ from: userAddress })
		.then(result => console.log(result))
		.catch(error => console.error(error));

	enableButton(cashOutBtn, 'Cash Out');
}

// deposit balance
async function depositBalance() {
	disableButton(confirmLoadBtn);
	const loadWCVal = document.querySelector('input[name="load-wc"]:checked').value;
	const amount = await web3.utils.toWei(loadWCVal, "ether");

	const chkRes = await checkAllowanceAndApprove(amount);
	if (!chkRes) return;

	// Call the contract's getGreeting function
	await contract.methods.depositWDOGE(amount).send({ from: userAddress })
		.then(result => console.log(result))
		.catch(error => console.error(error));

	enableButton(confirmLoadBtn, 'Confirm');
}

async function updateBalance() {
	const balance = await contract.methods.wDOGEBalances(userAddress).call();
	const dcBalance = await contract.methods.DCBalances(userAddress).call();
	const spinTkBalance = await web3.utils.fromWei(balance, "ether");
	const rewardTkBalance = await web3.utils.fromWei(dcBalance, "ether");
	document.getElementById('spin-balance').innerHTML = Number(spinTkBalance).toFixed(2);
	document.getElementById('reward-balance').innerHTML = Number(rewardTkBalance).toFixed(2);
}

async function contractFunc() {
	web3 = new Web3(window.ethereum);
	contract = new web3.eth.Contract(abi, contractAddress);
	spinToken = new web3.eth.Contract(spinTokenABI, spinTokenAddress);
	rewardToken = new web3.eth.Contract(rewardTokenABI, rewardTokenAddress);

	// Get the user's Ethereum address
	const accounts = await web3.eth.getAccounts();
	userAddress = accounts[0];
	const shortenedAddress = `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
	// Display the connected address
	document.getElementById("connectButton").style.display = 'none';
	document.getElementById("addresss-div").style.display = 'block';
	document.getElementById("connected-address").innerHTML = shortenedAddress;

	updateBalance();
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
		document.getElementById('reward-balance').innerText = "0"
		document.getElementById('spin-balance').innerText = "0"
		return;
	}

	window.ethereum.on('connect', (connectInfo) => {
		console.log(connectInfo);
		contractFunc();
	});
	window.ethereum.on('accountschanged', (connectInfo) => {
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
