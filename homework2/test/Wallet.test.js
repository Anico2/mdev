const {BN, constants, expectEvent, expectRevert, time} = require('@openzeppelin/test-helpers');
const {web3} = require('@openzeppelin/test-helpers/src/setup');
const {ZERO_ADDRESS} = constants;

const {expect} = require('chai');

const Wallet = artifacts.require("Wallet");
const Token = artifacts.require("Token");
const PriceConsumerV3 = artifacts.require("PriceConsumerV3");
const AggregatorProxy = artifacts.require("AggregatorProxy");

const ethUsdContract = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const azukiPriceContract = "0xa8b9a447c73191744d5b79bce864f343455e1150";

const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());
const fromWei8Dec = (x) => Number(x) / Math.pow(10, 8);
const toWei8Dec = (x) => Number(x) * Math.pow(10, 8);
const fromWei2Dec = (x) => Number(x) / Math.pow(10, 2);
const toWei2Dec = (x) => Number(x) * Math.pow(10, 2);


contract('Wallet', (accounts) => {
    const [deployer, firstAccount, secondAccount, fakeOwner] = accounts;

    it('retrieve deployed contracts', async () => {
        tokenContract = await Token.deployed();
        expect(tokenContract.address).to.not.equal(ZERO_ADDRESS);
        expect(tokenContract.address).to.match(/0x[0-9a-fA-F]{40}/);

        walletContract = await Wallet.deployed();

        priceEthUsd = await PriceConsumerV3.deployed();
    });

    it('distribute some tokens from deployer', async () => {
        await tokenContract.transfer(firstAccount, toWei(10000))
        await tokenContract.transfer(secondAccount, toWei(15000))

        balDepl = await tokenContract.balanceOf(deployer);
        balFA = await tokenContract.balanceOf(firstAccount);
        balSA = await tokenContract.balanceOf(secondAccount);

        console.log(fromWei(balDepl), fromWei(balFA), fromWei(balSA));
    });

    it("Eth /Usd price", async () => {
        ret = await priceEthUsd.getPriceDecimals();
        console.log("Eth/Usd price is", ret.toString());
        res = await priceEthUsd.getLatestPrice();
        console.log("Eth/Usd price is", fromWei8Dec(res));
    });

    it("azuki /Eth price", async () => {
        azukiUsdData = await AggregatorProxy.at(azukiPriceContract)
        ret = await azukiUsdData.decimals();
        console.log("Eth/Usd price is", ret.toString());
        res = await azukiUsdData.latestRoundData();
        console.log("Eth/Usd price is", fromWei(res[1]));
 
        console.log( fromWei( await walletContract.getNFTPrice()) );
    });

    it ('convert ETH in USD', async () => {
        await walletContract.sendTransaction({from: firstAccount, value: toWei(1) })
        ret = await walletContract.convertEthInUsd(firstAccount)
        console.log(fromWei2Dec(ret));

        ret = await walletContract.convertUSDInETH(toWei2Dec(5000));
        console.log(fromWei(ret))

        ret = await walletContract.convertNFTPriceInUSD();
        console.log(fromWei2Dec(ret))

        
        ret = await walletContract.convertUSDInNFTAmount(toWei2Dec(5000));
        console.log(ret[0].toString(), fromWei2Dec(ret[1]))

        ret = await walletContract.convertUSDInNFTAmount(toWei2Dec(9000));
        console.log(ret[0].toString(), fromWei2Dec(ret[1]))
    });
});