const Token = artifacts.require("Token")
const Blacklist = artifacts.require("Blacklist")

module.exports = async(deployer, network, accounts) =>{
    await deployer.deploy(Blacklist);
    const blacklist = await Blacklist.deployed();
    console.log("blacklist deployed @: " + blacklist.address);

    await deployer.deploy(Token, "Test1", "TT1", blacklist.address);
    const token = await Token.deployed();
    console.log("token deployed @: " + token.address);
}