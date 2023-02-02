const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const TOKEN_ID = 0;

async function buyItem() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const lisitng = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = lisitng.price.toString();

  const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: price,
  });
  console.log("Bought NFT");
  if ((network.config.chainId = "31337")) {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
