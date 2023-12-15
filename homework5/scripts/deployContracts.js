const {ethers, network} = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("Token");
  console.log("Deploying Token contract...");
  const token = await Token.deploy("myToken", "myToken1", 1000000);
  await token.waitForDeployment();
  console.log("Token contract deployed to:", await token.getAddress());

  const SimpleDex = await ethers.getContractFactory("SimpleDEX");
  console.log("Deploying SimpleDex contract...");
  const simpleDex = await SimpleDex.deploy(token.address, "0x8110cDF953323E1c78eBebA46195F3F6d65A04C5");
  await simpleDex.waitForDeployment();
  console.log("SimpleDex contract deployed to:", await simpleDex.getAddress());

  const Treasury = await ethers.getContractFactory("Treasury");
  console.log("Deploying Treasury contract...");
  const treasury = await Treasury.deploy(simpleDex.address);
  await treasury.waitForDeployment();
  console.log("Treasury contract deployed to:", await treasury.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });