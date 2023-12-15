//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PriceConsumer.sol";



contract Wallet is Ownable {
    uint public constant usdDecimals = 2;
    uint public nftDecimals = 18;
    uint public nftPrice = 100;
    uint public ownerEthAmountToWithdraw;
    uint public ownerTokenAmountToWithdraw;

    address public oracleEthUsdPrice;
    address public oracleTokenEthPrice;

    PriceConsumerV3 public ethUsdContract;
    PriceConsumerV3 public tokenEthContract;

    mapping(address => uint) public userEthDeposits;

    mapping(address => mapping(address => uint)) public userTokenDeposits;

    constructor(address clEthUsd, address clTokenUsd) {
        oracleEthUsdPrice = clEthUsd;
        oracleTokenEthPrice = clTokenUsd;
        
        ethUsdContract = new PriceConsumerV3(oracleEthUsdPrice);
        tokenEthContract = new PriceConsumerV3(oracleTokenEthPrice);
    }

    receive() external payable {
        registerUserDeposit(msg.sender, msg.value);
    }

    function registerUserDeposit(address sender, uint256 value) internal {
        userEthDeposits[sender] += value;
    }

    function getNFTPrice() external view returns (uint){
        uint price;
        int iPrice;
        AggregatorV3Interface nftOraclePrice = AggregatorV3Interface(oracleTokenEthPrice);
        (,iPrice,,,) = nftOraclePrice.latestRoundData();
        price = uint(iPrice);
        return price;
    }

    function convertEthInUsd(address user) public view returns (uint) {
        uint ethPrice = uint(ethUsdContract.getLatestPrice()); // scaled by 1e8
        uint ethPriceDecimals = ethUsdContract.getPriceDecimals(); //8 decimals
        uint divDecs = 18 + ethPriceDecimals - usdDecimals;
        uint userUSDDeposit = userEthDeposits[user] * ethPrice / 10 ** divDecs; //scaled by 1e26/1e24 = 1e2
        return userUSDDeposit;
    }

    function convertUSDInETH(uint usdAmount) public view returns (uint) {

        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        uint mulDecs = 18 + ethPriceDecimals - usdDecimals;
        uint convertAmountInEth = usdAmount * (10 ** mulDecs) / ethPrice;
        return convertAmountInEth;
    }

    function transferEthAmountOnBuy(uint nftNUmber) public {
        uint calcTotalUSDAMount = nftPrice * nftNUmber * (10**2); // in USD
        uint ethAmountForBuying = convertUSDInETH(calcTotalUSDAMount); // in ETH
        require(userEthDeposits[msg.sender] >= ethAmountForBuying, "not enough deposits by the user");
        ownerEthAmountToWithdraw += ethAmountForBuying;
        userEthDeposits[msg.sender] -= ethAmountForBuying;
    }

    /** Tokens */
    function userDeposit(address token, uint amount) external {
        SafeERC20.safeTransferFrom(IERC20(token), msg.sender, address(this), amount);
        userTokenDeposits[msg.sender][token] += amount;
    }

    function convertNFTPriceInUSD() public view returns (uint) {
        uint tokenPriceDecimals = tokenEthContract.getPriceDecimals(); //18 decimals
        uint tokenPrice = uint(tokenEthContract.getLatestPrice()); //scaled by 1e18
        

        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        uint divDecs = tokenPriceDecimals + ethPriceDecimals - usdDecimals;
        uint tokenUSDPrice = tokenPrice * ethPrice / 10 ** divDecs; //1e18 * 1e8 / 1e24 = 1e2
        return tokenUSDPrice;
    }

    function convertUSDInNFTAmount(uint usdAmount) public view returns (uint, uint) {
        uint tokenPriceDecimals = tokenEthContract.getPriceDecimals(); //18
        uint tokenPrice = uint(tokenEthContract.getLatestPrice());

        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        

        uint mulDecs = tokenPriceDecimals + ethPriceDecimals - usdDecimals;
        uint convertAmountInETH = usdAmount * (10 ** mulDecs) / ethPrice; //1e26 / 1e8 = 1e18
        uint convertETHInTokens = convertAmountInETH /* (10**18) **/ / tokenPrice; 
        uint totalCosts = convertETHInTokens * tokenPrice * ethPrice / (10**8) ; //1e0 * 1e18 * 1e8 = 1e26 
        uint remainingUSD = usdAmount - totalCosts;
        return (convertETHInTokens, remainingUSD);
    }

    function transferTokenAmountOnBuy(address token, uint nftNUmber) public {
        uint calcTotalUSDAMount = nftPrice * nftNUmber * (10**2); // in USD
        (uint tokenAmountForBuying,) = convertUSDInNFTAmount(calcTotalUSDAMount); // in ETH
        require(userTokenDeposits[msg.sender][token] >= tokenAmountForBuying, "not enough deposits by the user");
        ownerTokenAmountToWithdraw += tokenAmountForBuying;
        userTokenDeposits[msg.sender][token] -= tokenAmountForBuying;
    }

    function getNativeCoinsBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getTokenBalance(address _token) external view returns (uint) {
        return IERC20(_token).balanceOf(address(this));
    }

    function nativeCoinsWithdraw() external onlyOwner {
        require(ownerEthAmountToWithdraw > 0, "no eth to withdraw");
        uint256 tmpAccount = ownerEthAmountToWithdraw;
        ownerEthAmountToWithdraw = 0;
        (bool sent, ) = payable(_msgSender()).call{value: tmpAccount}("");
        require(sent, "!sent");
    }

    function userETHWithdraw() external {
        require(userEthDeposits[msg.sender] > 0, "no eth to withdraw");
        (bool sent, ) = payable(_msgSender()).call{value: userEthDeposits[msg.sender]}("");
        require(sent, "!sent");
        userEthDeposits[msg.sender] = 0;
    }

    function tokenWithdraw(address _token) external onlyOwner {
        require(ownerTokenAmountToWithdraw > 0, "no token to withdraw");
        uint256 tmpAccount = ownerTokenAmountToWithdraw;
        ownerTokenAmountToWithdraw = 0;
        SafeERC20.safeTransfer(IERC20(_token), _msgSender(), tmpAccount);
    }

    function userTokenWithdraw(address _token) external {
        require(userTokenDeposits[msg.sender][_token] > 0, "no token to withdraw");
        uint256 tmpAccount = userTokenDeposits[msg.sender][_token];
        userTokenDeposits[msg.sender][_token] = 0;
        SafeERC20.safeTransfer(IERC20(_token), _msgSender(), tmpAccount);
    }





}
