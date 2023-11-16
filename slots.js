// Define the images for the slot machine reels
const reelImages = [
    "reel/1.png",
    "reel/2.png",
    "reel/3.png",
    // Add more reel images here
];
// Variables to track the current state of the slot machine
let isSpinning = false;

let currentSpinResult = [0, 0, 0]; // Initialize with default values

// Function to spin the slot machine

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
// Event listener for the spin button

const spinButton = document.getElementById("spin-button");

spinButton.addEventListener("click", spinSlotMachine);
// Initial setup: Load reel images and display default result

window.addEventListener("load", () => {
    updateSlotMachine();
});
