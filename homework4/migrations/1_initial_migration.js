const {deployProx, upgradeProx, deployProxy, upgradeProxy} = require("@openzeppelin/truffle-upgrades");

const Notarize = artifacts.require("Notarize");

module.exports = async function (deployer, accounts) {

    deployer = accounts[0];

    const IS_UPGRADING = true;
    const NOTARIZE_ADDRESS = "0x30BD8B22144f2f4D3AfE176c7D78Cd648deD6657";

    if (!IS_UPGRADING) {
        await deployProxy(Notarize, {from: deployer});
        const noteAddress = await Notarize.deployed();
        console.log("notarize address @: ", noteAddress.address);
    } else {
        console.log("upgrading...");
        const noteAddress = await upgradeProxy(NOTARIZE_ADDRESS, Notarize, {from: deployer});
        console.log("upgraded Notarize contract @: ", noteAddress.address);
    
    }

};