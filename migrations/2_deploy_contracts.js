// migrations/2_deploy_contracts.js

const Voting = artifacts.require("Voting");

module.exports = async function (deployer, network, accounts) {
  const candidates = ["Alice", "Bob", "Charlie"];

  await deployer.deploy(Voting, candidates);
};
