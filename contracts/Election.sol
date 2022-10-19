// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Election__NotAdmin();
error Election__NoRightToVote();
error Election__AlreadyVoted();
error Election__InvalidCandidateId();

contract Election {
    /* Type declarations */
    enum ElectionState {
        REGISTERING_VOTERS_AND_CANDIDATES,
        VOTING,
        CLOSED
    }

    struct Voter {
        bool hasRightToVote;
        bool voted;
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    /* State variables */
    address private immutable i_owner;
    mapping(address => Voter) private s_voters;
    mapping(uint256 => Candidate) private s_candidates;
    uint256 private s_votersCount = 0;
    uint256 private s_candidatesCount = 0;

    /* Events */
    event CandidateAdded(uint256 indexed candidateId);
    event Voted(uint256 candidateId);

    /* Modifiers */
    modifier onlyAdmin() {
        if (msg.sender != i_owner) revert Election__NotAdmin();
        _;
    }

    modifier onlyApprovedVoter() {
        if (s_voters[msg.sender].hasRightToVote == false)
            revert Election__NoRightToVote();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor() {
        i_owner = msg.sender;
    }

    function addVoter(address voterAddress) external onlyAdmin {
        s_voters[voterAddress] = Voter(true, false);
        s_votersCount++;
    }

    function addCandidate(string memory name) external onlyAdmin {
        s_candidatesCount++;
        s_candidates[s_candidatesCount] = Candidate(s_candidatesCount, name, 0);
        emit CandidateAdded(s_candidatesCount);
    }

    function vote(uint256 candidateId) external onlyApprovedVoter {
        if (s_voters[msg.sender].voted == true) revert Election__AlreadyVoted();
        if (candidateId <= 0 || candidateId > s_candidatesCount)
            revert Election__InvalidCandidateId();
        s_voters[msg.sender].voted == true;
        s_candidates[candidateId].voteCount++;
        emit Voted(candidateId);
    }

    function getVotersCount() external view returns (uint256) {
        return s_votersCount;
    }

    function getCandidatesCount() external view returns (uint256) {
        return s_candidatesCount;
    }
}
