const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Election", function () {
          let election, deployer, player;
          beforeEach(async function () {
              await deployments.fixture(["all"]);
              election = await ethers.getContract("Election");
              deployer = (await getNamedAccounts()).deployer;
              player = (await getNamedAccounts()).player;
          });

          describe("constructor", function () {
              it("sets contract admin correctly", async function () {
                  const admin = await election.getAdmin();
                  assert.equal(admin, deployer);
              });
              it("sets correct election state", async function () {
                  const electionState = await election.getElectionState();
                  assert.equal(electionState, "0");
              });
          });

          describe("addVoter", function () {
              it("reverts if election is not in setup state", async function () {
                  await election.startElection();
                  await expect(election.addVoter(player)).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
                  await election.endElection();
                  await expect(election.addVoter(player)).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
              });
              it("reverts when not admin tries to add voter", async function () {
                  const playerConnectedElection = await ethers.getContract("Election", player);
                  await expect(playerConnectedElection.addVoter(player)).to.be.revertedWith(
                      "Election__NotAdmin"
                  );
              });
              it("adds voter to voters mapping correctly", async function () {
                  await election.addVoter(player);
                  const { hasRightToVote, voted } = await election.getVoter(player);
                  assert.equal(hasRightToVote, true);
                  assert.equal(voted, false);
              });
              it("updates voters count", async function () {
                  await election.addVoter(player);
                  const votersCount = await election.getVotersCount();
                  assert.equal(votersCount, 1);
              });
          });
      });
