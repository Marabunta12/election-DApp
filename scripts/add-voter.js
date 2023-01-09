const { ethers } = require("hardhat");

const VOTER_ADDRESS = "0x69de9AB7a9A14A72cAaA7ca595e584fBD6eb34Ad";

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
