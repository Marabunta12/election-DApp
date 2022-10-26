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
      });
