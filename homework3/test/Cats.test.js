const {BigNumber, constants} = require("ethers");
const {expect} = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");

let catContract;
describe("cats test", function(accounts){
    baseURI = "ipfs://QmPFLs9GNMeJCEwJaPtA1KvjX8cGGXw62319Mgt1bdwrjg"

    it("contract setup", async function(){

        [owner, user1, user2, user3] = await ethers.getSigners();
        const Cat = await ethers.getContractFactory("Cats");
        catContract = await Cat.deploy();
        await catContract.waitForDeployment();
        console.log("contract deployed to:", await catContract.getAddress());

    })

    it("owner misnt some tokens", async function(){
        catContract.connect(owner).mint(user1.address, 1, 2, "0x");
        catContract.connect(owner).mint(user2.address, 2, 2, "0x4369616F207469206D616E646F203120746F6B656E");
    })

    it("owner batch-mints some tokens", async function(){
        catContract.connect(owner).mintBatch(user3.address, [1,4,5], [2,2,2], "0x");
    })

})