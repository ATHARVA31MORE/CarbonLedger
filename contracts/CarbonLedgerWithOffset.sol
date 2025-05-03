// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./GreenToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonLedgerWithOffset is Ownable {
    GreenToken public greenToken;

    struct Project {
        string name;
        string projectType;
        uint256 co2Saved; // in tons
        uint256 creditsIssued;
    }

    // Mapping to track user carbon offsets
    mapping(address => uint256) private userCarbonOffsets;

    Project[] public projects;

    event ProjectAdded(uint256 indexed projectId, string name, uint256 co2Saved, uint256 creditsIssued);
    event CarbonOffsetRecorded(address indexed user, uint256 amount);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        greenToken = GreenToken(tokenAddress);
    }

    function addGreenProject(
        string memory _name,
        string memory _projectType,
        uint256 _co2Saved
    ) public onlyOwner {
        uint256 credits = _co2Saved * 1e18; // 1 ton CO2 = 1 token (with 18 decimals)
        projects.push(Project(_name, _projectType, _co2Saved, credits));
        greenToken.mint(owner(), credits);
        emit ProjectAdded(projects.length - 1, _name, _co2Saved, credits);
    }

    // Function to record carbon offset for a user
    function recordCarbonOffset(address user, uint256 amount) public onlyOwner {
        userCarbonOffsets[user] += amount;
        emit CarbonOffsetRecorded(user, amount);
    }

    // Function to get a user's carbon offset
    function getUserCarbonOffset(address user) public view returns (uint256) {
        return userCarbonOffsets[user];
    }

    function getProject(uint256 index)
        public
        view
        returns (string memory, string memory, uint256, uint256)
    {
        Project memory proj = projects[index];
        return (proj.name, proj.projectType, proj.co2Saved, proj.creditsIssued);
    }

    function getProjectCount() public view returns (uint256) {
        return projects.length;
    }
}