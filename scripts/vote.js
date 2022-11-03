const { ethers, getNamedAccounts } = require("hardhat");

const candidateId = 1;

async function vote() {
    const { player } = await getNamedAccounts();
    const election = await ethers.getContract("Election", player);
    console.log(`Voting for candidate number: ${candidateId}!`);
    const tx = await election.vote(candidateId);
    await tx.wait(1);
}

vote()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
