const { ethers } = require("hardhat");

const VOTER_ADDRESS = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

async function addVoter() {
    const election = await ethers.getContract("Election");
    console.log("Adding voter...");

    const tx = await election.addVoter(VOTER_ADDRESS);
    await tx.wait(1);
    console.log("Added voter!");
}

addVoter()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
