const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");
const { ethers, network, deployments } = require("hardhat");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("nftMarketplace Contract", function () {
      let nftMarketplace, basicNft, deployer, accounts;

      beforeEach(async () => {
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NftMarketplace");
        accounts = await ethers.getSigners();
        deployer = accounts[0];

        //Mint 1 basic Nft
        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
      });

      describe("listItem function", () => {
        it("Reverts with error if price below 0", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0; //1 token was minted
          const price = ethers.utils.parseUnits("0", "ether");
          await expect(
            nftMarketplace.listItem(nftAddress, tokenId, price)
          ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero");
        });

        it("Reverts with error if token is not appoved by the owner for the listing to marketplace", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0; //1 token was minted
          const price = ethers.utils.parseUnits("1", "ether");
          await expect(
            nftMarketplace.listItem(nftAddress, tokenId, price)
          ).to.be.revertedWith("NftMarketplace__NotApprovedForMArketplace");
        });

        it("Reverts with error if token is already listed", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0; //1 token was minted
          const price = ethers.utils.parseUnits("1", "ether");
          //approve token for listing:
          await basicNft.approve(nftMarketplace.address, tokenId);

          //list nft
          await nftMarketplace.listItem(nftAddress, tokenId, price);
          await expect(
            nftMarketplace.listItem(nftAddress, tokenId, price)
          ).to.be.revertedWith("NftMarketplace__AlreadyListed");
        });

        it("Reverts with error if caller of the function is not the owner", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0;
          const price = ethers.utils.parseUnits("1", "ether");

          //renounce ownership of token
          recipientOfTokenTransfer = accounts[1];
          await basicNft.transferFrom(
            deployer.address,
            recipientOfTokenTransfer.address,
            tokenId
          );
          //try to list nft that is not owned by you
          await expect(
            nftMarketplace.listItem(nftAddress, tokenId, price)
          ).to.be.revertedWith("NftMarketplace__NotOwner");
        });
      });

      describe("buyItem function", () => {
        it("reverts with error if NFT is not listed", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0;
          await expect(
            nftMarketplace.buyItem(nftAddress, tokenId)
          ).to.be.revertedWith("NftMarketplace__NotListed");
        });

        it("reverts with error if price is not met", async () => {
          const nftAddress = basicNft.address;
          const tokenId = 0;
          const price = ethers.utils.parseUnits("1", "ether");
          //approve token for listing:
          await basicNft.approve(nftMarketplace.address, tokenId);
          //list token
          await nftMarketplace.listItem(nftAddress, tokenId, price);
        });
      });

      describe("cancelListing function", () => {});

      describe("updateListing function", () => {});

      describe("withdrawProceeds function", () => {});

      describe("getListing function", () => {});

      describe("getProceeds function", () => {});
    });
