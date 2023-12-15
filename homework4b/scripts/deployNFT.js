const {ethers} = require("hardhat");
const hre = require("hardhat");

const name = "MyCollection";
const symbol = "MC";

async function main() {
  const TokenNFTFactory = await hre.ethers.getContractFactory("MyNFTTokenFactory");
  console.log("Deploying NFT token Factory...");
  const nftTokenFactory = await TokenNFTFactory.deploy();
  await nftTokenFactory.deployed();
  console.log("NFT token Factory deployed to:", nftTokenFactory.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });