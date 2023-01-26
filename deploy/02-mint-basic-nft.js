const { ethers, network, log } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = await deployments;

  await deploy("BasicNft", {
    from: deployer,
    args: [],
    log: true,
    blockConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "mintbasicnft"];
