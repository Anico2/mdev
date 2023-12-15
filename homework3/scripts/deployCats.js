const hre = require("hardhat");

async function main() {
    const Cat = await hre.ethers.getContractFactory("Cats");
    const cat = await Cat.deploy();
    await cat.waitForDeployment();
    console.log("Cats deployed to:", await cat.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });