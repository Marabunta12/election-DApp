const { ethers } = require("hardhat");

async function endElection() {
    const election = await ethers.getContract("Election");
    console.log("Ending election!");
    const tx = await election.endElection();
    await tx.wait(1);
}

endElection()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
