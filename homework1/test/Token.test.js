const {BN, constants, expectEvent, expectRevert, time} = require('@openzeppelin/test-helpers');
const {web3} = require('@openzeppelin/test-helpers/src/setup');
const {ZERO_ADDRESS} = constants;

const {expect} = require("chai");

const Token = artifacts.require("Token");
const Blacklist = artifacts.require("Blacklist");

contract ("Token test", (accounts) =>{
    const [deployer, FirstAccount, SecondAccount, ThirdAccount] = accounts;

    // beforeEach(async () => {
    //     this.token = await Token.new("Test2", "TT1");
    // })

    it("deployed", async () =>{

        this.blacklist = await Blacklist.deployed(); //necessary if before it is commented
        expect(this.blacklist.address).to.not.equal(ZERO_ADDRESS);
        expect(this.blacklist.address).to.match(/0x[a-fA-F0-9]{40}/);
        console.log("new blacklist address:"+this.blacklist.address);

        console.log("blacklist owner: " + await this.blacklist.owner());


        this.token = await Token.deployed(); //necessary if before it is commented
        expect(this.token.address).to.not.equal(ZERO_ADDRESS);
        expect(this.token.address).to.match(/0x[a-fA-F0-9]{40}/);
        console.log("new Token address:"+this.token.address);

        console.log("token owner: " + await this.token.owner());
    })

    it("transfer", async () =>{
        const bal1 = await this.token.balanceOf(SecondAccount); //expected to be 0
        console.log("SecondAccountbal before: " + web3.utils.fromWei(bal1));
        const bal11 = await this.token.balanceOf(deployer); //expected to be 0
        console.log("SecondAccountbal before: " + web3.utils.fromWei(bal11));

        await this.token.mint(deployer, web3.utils.toWei("200"), {from: deployer}); //deployer mint 200
        await this.token.mint(SecondAccount, web3.utils.toWei("100"), {from: deployer}); //deployer gives 100 to SecondAccount
        await this.token.transfer(SecondAccount, web3.utils.toWei("10"), {from: deployer}); //deployer transfers 10 to SecondAccount
        
        const bal2 = await this.token.balanceOf(deployer); //expected to be 200-10
        console.log("SecondAccountbal after: " + web3.utils.fromWei(bal2));
        const bal22 = await this.token.balanceOf(SecondAccount); //expected to be 100+10
        console.log("SecondAccountbal after: " + web3.utils.fromWei(bal22));

        //deployer gives 50 to FirstAccount (used in the following)
        await this.token.transfer(FirstAccount, web3.utils.toWei("50"), {from: deployer}); 
    })

    it("transfer", async () =>{
        const bal1 = await this.token.balanceOf(FirstAccount); 
        console.log("FirstAccountbal: " + web3.utils.fromWei(bal1));
        
        //SecondAccount transfers 10 to FirstAccount 
        await this.token.transfer(FirstAccount, web3.utils.toWei("10"), {from: SecondAccount}); 
        
        const bal2 = await this.token.balanceOf(FirstAccount); 
        console.log("FirstAccountbal after: " + web3.utils.fromWei(bal2));

        const bal3 = await this.token.balanceOf(SecondAccount); 
        console.log("SecondAccountbal after: " + web3.utils.fromWei(bal3)); 
    })

    it("transferFrom", async () =>{
        //firstaccount authorizes second to spend for him at most 30 tokens
        await this.token.approve(SecondAccount, web3.utils.toWei("30"), {from: FirstAccount});
        //from firstaccount to secondaccount
        await this.token.transferFrom(FirstAccount, SecondAccount, web3.utils.toWei("20"), {from: SecondAccount});

        const bal2 = await this.token.balanceOf(FirstAccount); 
        console.log("FirstAccountbal after: " + web3.utils.fromWei(bal2));

        const bal3 = await this.token.balanceOf(SecondAccount); 
        console.log("SecondAccountbal after: " + web3.utils.fromWei(bal3)); 
    })

    it("insert user in blacklist", async () =>{
        await this.blacklist.allowedToken(this.token.address, {from: deployer});
        await this.token.insertInBlacklist(ThirdAccount, {from: deployer});
        console.log(await this.blacklist.getBlackListStatus(ThirdAccount));
        

    })

    it("transfer to blacklisted", async () =>{
        // avrei anche potuto usare this.toke.mint e sarebbe comunque fallito
        await expectRevert(this.token.transfer(ThirdAccount, web3.utils.toWei("10"), {from: deployer}),
              "blacklisted addresses");
        
    })

    // it("transfer to non blacklisted", async () =>{
    //     await this.token.transfer(SecondAccount, web3.utils.toWei("10"), {from: deployer});
        

    // })

    it("insert user in blacklist", async () =>{
        await this.token.insertInBlacklist(SecondAccount, {from: deployer});
        console.log(await this.blacklist.getBlackListStatus(SecondAccount));
    })

    it("transfer from blacklisted", async () =>{
        await expectRevert(this.token.transfer(FirstAccount, web3.utils.toWei("10"), {from: SecondAccount}),
              "blacklisted addresses");
        
    })

    it("remove user from blacklist", async () =>{
        await this.token.removeFromBlacklist(SecondAccount, {from: deployer});
        console.log(await this.blacklist.getBlackListStatus(SecondAccount));
    })

    it("transfer to removed from blacklisted", async () =>{
        // avrei anche potuto usare this.toke.mint e sarebbe comunque fallito
        await this.token.transfer(FirstAccount, web3.utils.toWei("10"), {from: SecondAccount});
        
    })
    
})