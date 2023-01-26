const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const arguments = [];

  const nftMarketPlaceContract = await deploy("NftMarketplace", {
    from: deployer,
    args: arguments,
    log: true,
    blockConfirmations: network.config.blockConfirmations || 1,
  });

  //verify contract if not on local network
  if (!developmentChains.includes(network.name)) {
    verify(nftMarketPlaceContract.address, arguments);
  }
};

module.exports.tags = ["all", "nftmarketplace"];
