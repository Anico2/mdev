const Wallet = artifacts.require("Wallet");
const Token = artifacts.require("Token");
const PriceConsumerV3 = artifacts.require("PriceConsumerV3");

const ethUsdContract = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const azukiPriceContract = "0xa8b9a447c73191744d5b79bce864f343455e1150";

module.exports = async (deployer, _network, accounts) => {
    await deployer.deploy(Wallet, ethUsdContract, azukiPriceContract);
    const wallet = await Wallet.deployed();
    console.log ("Deployed wallet is @", wallet.address);

    await deployer.deploy(Token, "Test Token", "TT1", 1000000);
    const token = await Token.deployed();
    console.log ("Deployed token is @", token.address);

    await deployer.deploy(PriceConsumerV3, ethUsdContract)
    const ethUsdPrice = await PriceConsumerV3.deployed();
    console.log ("Deployed Price ETH/USD Mockup is @", ethUsdPrice.address);

    //await deployer.deploy(PriceConsumerV3, azukiPriceContract)
    //const azukiUsdPrice = await PriceConsumerV3.deployed();
    //console.log ("Deployed Price azuki/USD Mockup is @", azukiUsdPrice.address);
}