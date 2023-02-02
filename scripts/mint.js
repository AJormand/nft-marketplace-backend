//to test the script run hardhat node in one window (contracts will get deployed automatically) and then run script on localhost
//yarn hardhat node
//yarn hardhat run .\scripts\mint-and-list.js --network localhost

const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseUnits("0.1", "ether");

async function mint() {
  const basicNft = await ethers.getContract("BasicNft");

  console.log("Minting......");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);

  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
