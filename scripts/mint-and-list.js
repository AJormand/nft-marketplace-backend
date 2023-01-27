//to test the script run hardhat node in one window (contracts will get deployed automatically) and then run script on localhost
//yarn hardhat node
//yarn hardhat run .\scripts\mint-and-list.js --network localhost

const { ethers } = require("hardhat");

const PRICE = ethers.utils.parseUnits("0.1", "ether");

async function mintAndList() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");

  console.log("Minting......");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId; //when minting we are emiting an event that contains tokenId

  console.log("Approving Nft....");
  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approvalTx.wait(1);

  console.log("Listing NFT....");
  const listingTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE
  );
  await listingTx.wait(1);
  console.log("Nft listed!");
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
