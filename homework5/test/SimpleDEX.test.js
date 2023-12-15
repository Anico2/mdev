require("dotenv").config();
const { expect } = require("chai");
const  {BigNumber, constants} = require("ethers");
const {AddressZero, EtherSymbol} = constants;

require("@nomicfoundation/hardhat-chai-matchers");

const fromWei = (x) => ethers.utils.formatEther(x.toString());
const toWei = (x) => ethers.utils.parseEther(x.toString());
const fromWei8Dec = (x) => x / Math.pow
const toWei8Dec = (x) => x * Math.pow(10, 8);

const ETHUSD = "0x8110cDF953323E1c78eBebA46195F3F6d65A04C5";

describe("SimpleDEX", function (accounts) {

    it("system setup", async function () {
        [testOwner, other1, other2, other3] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("myToken", "myT1", 1000000);
        expect(token.address).to.be.not.equal(AddressZero);
        expect(token.address).to.match(/0x[0-9a-fA-F]{40}/);

        const SimpleDex = await ethers.getContractFactory("SimpleDEX");
        simpleDex = await SimpleDex.deploy(token.address, ETHUSD);
        expect(simpleDex.address).to.be.not.equal(AddressZero);
        expect(simpleDex.address).to.match(/0x[0-9a-fA-F]{40}/);

        const Oracle = await ethers.getContractFactory("PriceConsumerV3");
        priceConsumerAddress = await simpleDex.ethUsdContract();
        pcContract = await Oracle.attach(priceConsumerAddress);
        console.log("priceConsumer @:" + priceConsumerAddress);

        const Treasury = await ethers.getContractFactory("Treasury");
        treasury = await Treasury.deploy(simpleDex.address);
        expect(treasury.address).to.be.not.equal(AddressZero);
        expect(treasury.address).to.match(/0x[0-9a-fA-F]{40}/);

    });

    it("DEX receives Tokens and ETH from owner", async function () {
        lastPrice = await pcContract.getLatestPrice();
        console.log(fromWei8Dec(lastPrice));

        //tx = await token.connect(testOwner).transfer(simpleDex.address, toWei(1000));
        //tx = await testOwner.sendTransaction({to: simpleDex.address, value: toWei(10)});
        console.log("ETH/USD decimals:" + await simpleDex.ethPriceDecimals());

        await simpleDex.connect(testOwner).setTreasury(treasury.address);
        await token.connect(testOwner).setMinter(simpleDex.address);

        
    })

    it("users change ethers for tokens in simple DEX", async function () {
        tx = await simpleDex.connect(other1).buyTokens({value: toWei(1)});
        console.log("ETH/USD decimals:" + fromWei8Dec(await simpleDex.ethPriceDecimals()));
        tx = await simpleDex.connect(other2).buyTokens({value: toWei(1.5)});
        tx = await simpleDex.connect(other3).buyTokens({value: toWei(2.5)});
        
    })

    it("simple DEX parameters", async function () {
        console.log("Token balance in dex contract:" + fromWei(await token.balanceOf(simpleDex.address)));
        console.log("ETH balance in dex contract:" + fromWei(await simpleDex.provider.getBalance(simpleDex.address)));

        console.log("Other1 Token balance:" + fromWei(await token.balanceOf(other1.address)));
        console.log("Other2 Token balance:" + fromWei(await token.balanceOf(other2.address)));
        console.log("Other3 Token balance:" + fromWei(await token.balanceOf(other3.address)));
        console.log("ETH balance in Treasury contract:" + fromWei(await treasury.provider.getBalance(treasury.address)));

        console.log("Other1 ETH balance:" + fromWei(await other1.provider.getBalance(other1.address)));
        console.log("Other2 ETH balance:" + fromWei(await other2.provider.getBalance(other2.address)));
        console.log("Other3 ETH balance:" + fromWei(await other3.provider.getBalance(other3.address)));
    })

    it("users withdraw tokens from simple DEX", async function () {
        tx = await simpleDex.connect(other1).sellToken(toWei(100));


        tx = await simpleDex.connect(other2).sellToken(toWei(1000));

        tx = await simpleDex.connect(other3).sellToken(toWei(10000));
        })
    
    it("simple DEX parameters", async function () {

        console.log("Token balance in dex contract:" + fromWei(await token.balanceOf(simpleDex.address)));
        console.log("ETH balance in dex contract:" + fromWei(await simpleDex.provider.getBalance(simpleDex.address)));

        console.log("Other1 Token balance:" + fromWei(await token.balanceOf(other1.address)));
        console.log("Other2 Token balance:" + fromWei(await token.balanceOf(other2.address)));
        console.log("Other3 Token balance:" + fromWei(await token.balanceOf(other3.address)));
        console.log("ETH balance in Treasury contract:" + fromWei(await treasury.provider.getBalance(treasury.address)));

        console.log("Other1 ETH balance:" + fromWei(await other1.provider.getBalance(other1.address)));
        console.log("Other2 ETH balance:" + fromWei(await other2.provider.getBalance(other2.address)));
        console.log("Other3 ETH balance:" + fromWei(await other3.provider.getBalance(other3.address)));

    })
});