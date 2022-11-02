const { ethers } = require("hardhat");

const candidateName = "Candidate 1";

async function addCandidate() {
    const election = await ethers.getContract("Election");
    console.log(`Adding candidate: ${candidateName} ...`);

    const tx = await election.addCandidate(candidateName);
    await tx.wait(1);
    console.log("Candidate added!");
}

addCandidate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
