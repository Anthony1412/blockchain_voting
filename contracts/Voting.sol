// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    Candidate[] private candidateList; // Changed to private, expose via getter
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _candidateNames) {
        admin = msg.sender;
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidateList.push(Candidate({ name: _candidateNames[i], voteCount: 0 }));
        }
    }

    function vote(uint256 candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateIndex < candidateList.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidateList[candidateIndex].voteCount++;
    }

    /// @notice Returns all candidates with their names and vote counts
    function getCandidates() public view returns (Candidate[] memory) {
        return candidateList;
    }

    /// @notice Returns total number of candidates (optional utility)
    function getCandidateCount() public view returns (uint256) {
        return candidateList.length;
    }

    /// @notice Returns a single candidate's data (optional)
    function getCandidate(uint256 index) public view returns (string memory name, uint256 voteCount) {
        require(index < candidateList.length, "Invalid index");
        Candidate memory c = candidateList[index];
        return (c.name, c.voteCount);
    }
}
