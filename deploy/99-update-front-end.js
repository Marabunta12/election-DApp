const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile = "../election-dapp-frontend/constants/networkMapping.json";
const frontEndAbiLocation = "../election-dapp-frontend/constants/";

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...");
        await updateContractAddresses();
        await updateAbi();
    }
};

async function updateAbi() {
    const election = await ethers.getContract("Election");
    fs.writeFileSync(
        `${frontEndAbiLocation}Election.json`,
        election.interface.format(ethers.utils.FormatTypes.json)
    );
}

async function updateContractAddresses() {
    const election = await ethers.getContract("Election");
    const chainId = network.config.chainId.toString();
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["Election"].includes(election.address)) {
            contractAddresses[chainId]["Election"].push(election.address);
        }
    } else {
        contractAddresses[chainId] = { Election: [election.address] };
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
