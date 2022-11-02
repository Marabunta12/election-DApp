const { ethers } = require("hardhat");

async function startElection() {
    const election = await ethers.getContract("Election");
    console.log("Starting election!");
    const tx = await election.startElection();
    await tx.wait(1);
}

startElection()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
