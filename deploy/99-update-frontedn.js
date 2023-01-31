const { ethers, network } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const frontEndContractFile =
  "../nft-marketplace-client/constants/networkMapping.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating frontend");
    await updateContractAddress();
  }
};

async function updateContractAddress() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const chainId = network.config.chainId.toString();
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractFile, "utf8")
  );

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = {
      NftMarketplace: [nftMarketplace.address],
    };
  }

  fs.writeFileSync(frontEndContractFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
