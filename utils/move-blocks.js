//function used to mine some blocks after the transaction - in case of moralis server
//this is required as the transaction only gets approved after another block has
//been mined after it --> therefore this needs to be used for localhost

const { network } = require("hardhat");

function sleep(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

async function moveBlocks(amount, sleepAmount = 0) {
  console.log("Moving blocks.....");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
    if (sleepAmount) {
      console.log(`Sleeping for ${sleepAmount}`);
      await sleep(sleepAmount);
    }
  }
}