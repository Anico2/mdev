const {expect} = require("chai");

const {
    BN, //Big NUmber support
    constants, //Common constants, like 0 address and largest integer
    expectEvent, //Asserions for emitted events
    expectRevert, //Assertions for transactions that should fail
    time //Time utilities
} = require('@openzeppelin/test-helpers');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));



const Notarize = artifacts.require("Notarize");
const {ZERO_ADDRESS} = constants;

const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());

// aggiunger 0x davanti agli hash calcolati!!
const HashWriter = "0x9bd7b39e404ec8163ddb5278c0044198ca50a2bf864985cbc93f934a5afed5d6"
const DefaultAdminRole = "0x0000000000000000000000000000000000000000000000000000000000000000";
const hash1 = "0x4df6da8fb90bf07cca00104ea30a84e39a27a1e4029fce6f2e99e6466eb7d5df" //hash della parola hash1
const hash2 = "0xf748a54bb7b69310fdbd21f29eb3f7e159ac747f21186df0d28adf60a8400648" //hash della parola hash2

contract ("Notarization test", function(accounts){
    const Admin = accounts[0];
    const HashWriter1 = accounts[1];

    it("retrieve contract", async function (){
        NotarizeContract = await Notarize.deployed();
        expect(NotarizeContract.address).to.not.equal(ZERO_ADDRESS);
        expect(NotarizeContract.address).to.match(/0x[a-fA-F0-9]{40}/);
        
    });

    it("Contract admin assign hash writer role to account1", async function(){
        //fallisce per mancanza di permessi
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
        "AccessControl: account " + HashWriter1.toLowerCase() + " is missing role " + DefaultAdminRole);
        //la seguente non fallisce
        await NotarizeContract.setHashWriterRole(HashWriter1, {from: Admin});
        expect(await NotarizeContract.hasRole(HashWriter,HashWriter1)).to.be.true;
    });

    it("A hash writer address cannot assign the same role to another address", async function(){
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
        "AccessControl: account " + HashWriter1.toLowerCase() + " is missing role " + DefaultAdminRole);
    });

    it("An admin address cannot notarize a document", async function(){
        //admin non ha il ruolo di hash writer
        await expectRevert(NotarizeContract.addNewDocument("http://www.example.com/pdf1.pdf",hash1, {from: Admin}),
        "AccessControl: account " + Admin.toLowerCase() + " is missing role " + HashWriter);
    });

    it("A hash writer address can notarize a document and get notarized doc back", async function(){
        await NotarizeContract.addNewDocument("http://www.example.com/pdf1.pdf",hash1, {from: HashWriter1});
        tot = await NotarizeContract.getDocsCount();
        console.log("tot: " + tot.toString());
        result = await NotarizeContract.getDocInfo(tot-1);
        //result[0] is the uri of the doc and result[1] is the hash
        console.log(result[0].toString()+ " : " + result[1]);
        });

    it("A hash writer cannot notarize a doc twice", async function(){
        await expectRevert(NotarizeContract.addNewDocument("http://www.example.com/pdf1.pdf",hash1, {from: HashWriter1}),
        "Hash already notarized");
        tot = await NotarizeContract.getDocsCount();
        console.log("tot: " + tot.toString());
        ;
        });

    it("A hash writer address can notarize another document and get notarized doc back", async function(){
        await NotarizeContract.addNewDocument("http://www.example.com/pdf2.pdf",hash2, {from: HashWriter1});
        tot = await NotarizeContract.getDocsCount();
        console.log("tot: " + tot.toString());
        result = await NotarizeContract.getDocInfo(tot-1);
        //result[0] is the uri of the doc and result[1] is the hash
        console.log(result[0].toString()+ " : " + result[1]);
        });
    
    it ("how many requests on document info", async function(){
        getInfoCounter = await NotarizeContract.getInfoCounter();
        console.log("getInfoCounter: " + getInfoCounter.toString());

        tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
        getInfoCounter = await NotarizeContract.getInfoCounter();
        console.log("getInfoCounter: " + getInfoCounter.toString());

        tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
        getInfoCounter = await NotarizeContract.getInfoCounter();
        console.log("getInfoCounter: " + getInfoCounter.toString());
        
        tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
        getInfoCounter = await NotarizeContract.getInfoCounter();
        console.log("getInfoCounter: " + getInfoCounter.toString());

    });
    
    it("is document already registered", async function(){
        expect(await NotarizeContract.getRegisteredHash(hash1)).to.be.true
        const hash1Corrupted = "0x55c129aba06f3ca62363a8e7724b4fac6f3889223d0e632352c75bb41a10de50" //random hash
        expect(await NotarizeContract.getRegisteredHash(hash1Corrupted)).to.be.false

    });
  
})
