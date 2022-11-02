const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Election", function () {
          let election, deployer, player, candidateName, playerConnectedElection;
          beforeEach(async function () {
              election = await ethers.getContract("Election");
              deployer = (await getNamedAccounts()).deployer;
              player = (await getNamedAccounts()).player;
              playerConnectedElection = await ethers.getContract("Election", player);
              candidateName = "Candidate 1";
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
          describe("addCandidate", function () {
              it("reverts if election is not in setup state", async function () {
                  await election.startElection();
                  await expect(election.addCandidate(player)).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
                  await election.endElection();
                  await expect(election.addCandidate(player)).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
              });
              it("reverts when not admin tries to add candidate", async function () {
                  await expect(playerConnectedElection.addCandidate(player)).to.be.revertedWith(
                      "Election__NotAdmin"
                  );
              });
              it("adds candidate to candidates mapping correctly", async function () {
                  await election.addCandidate(candidateName);
                  const { id, name, voteCount } = await election.getCandidate(1);
                  assert.equal(id, 1);
                  assert.equal(name, candidateName);
                  assert.equal(voteCount, 0);
              });
              it("updates candidates count", async function () {
                  await election.addCandidate(candidateName);
                  const candidatesCount = await election.getCandidatesCount();
                  assert.equal(candidatesCount, 1);
              });
              it("emits an event after adding candidate", async function () {
                  expect(await election.addCandidate(candidateName)).to.emit("CandidateAdded");
              });
          });
          describe("startElection", function () {
              it("reverts when not admin tries to start election", async function () {
                  await expect(playerConnectedElection.startElection()).to.be.revertedWith(
                      "Election__NotAdmin"
                  );
              });
              it("reverts if election is not in setup state", async function () {
                  await election.startElection();
                  await expect(election.startElection()).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
                  await election.endElection();
                  await expect(election.startElection()).to.be.revertedWith(
                      "Election__NotInSetupState"
                  );
              });
              it("sets election to open state", async function () {
                  await election.startElection();
                  const electionState = await election.getElectionState();
                  assert.equal(electionState, "1");
              });
          });
          describe("endElection", function () {
              it("reverts when not admin tries to end election", async function () {
                  await expect(playerConnectedElection.endElection()).to.be.revertedWith(
                      "Election__NotAdmin"
                  );
              });
              it("reverts if election is not in open state", async function () {
                  await expect(election.endElection()).to.be.revertedWith(
                      "Election__NotInOpenState"
                  );
                  await election.startElection();
                  await election.endElection();
                  await expect(election.endElection()).to.be.revertedWith(
                      "Election__NotInOpenState"
                  );
              });
              it("sets election to closed state", async function () {
                  await election.startElection();
                  await election.endElection();
                  const electionState = await election.getElectionState();
                  assert.equal(electionState, "2");
              });
          });
          describe("vote", async function () {
              it("reverts if election is not in open state", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);

                  await expect(playerConnectedElection.vote(1)).to.be.revertedWith(
                      "Election__NotInOpenState"
                  );
                  await election.startElection();
                  await election.endElection();
                  await expect(playerConnectedElection.vote(1)).to.be.revertedWith(
                      "Election__NotInOpenState"
                  );
              });
              it("reverts when not approved voter tries to vote", async function () {
                  await election.addCandidate(candidateName);
                  await election.startElection();

                  await expect(playerConnectedElection.vote(1)).to.be.revertedWith(
                      "Election__NoRightToVote"
                  );
              });
              it("reverts when candidate with chosen id does not exist", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);
                  await election.startElection();
                  await expect(playerConnectedElection.vote(2)).to.be.revertedWith(
                      "Election__InvalidCandidateId"
                  );
                  await expect(playerConnectedElection.vote(0)).to.be.revertedWith(
                      "Election__InvalidCandidateId"
                  );
              });
              it("updates voter voted field", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);
                  await election.startElection();
                  await playerConnectedElection.vote(1);
                  const { voted } = await election.getVoter(player);
                  assert.equal(voted, true);
              });
              it("reverts when voter tries to vote twice", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);
                  await election.startElection();
                  await playerConnectedElection.vote(1);
                  await expect(playerConnectedElection.vote(1)).to.be.revertedWith(
                      "Election__AlreadyVoted"
                  );
              });
              it("updates candidate vote count", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);
                  await election.startElection();
                  await playerConnectedElection.vote(1);
                  const { voteCount } = await election.getCandidate(1);
                  assert.equal(voteCount, 1);
              });
              it("emits an event after voting", async function () {
                  await election.addCandidate(candidateName);
                  await election.addVoter(player);
                  await election.startElection();
                  expect(await playerConnectedElection.vote(1)).to.emit("Voted");
              });
          });
      });
