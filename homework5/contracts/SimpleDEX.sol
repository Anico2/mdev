// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConsumer.sol";
import "./interfaces/IErrors.sol";
import "./interfaces/ITreasury.sol";
import "./interfaces/IToken.sol";

contract SimpleDEX is Ownable, IErrors{
    address public token;
    address public externalTreasury;

    PriceConsumerV3 public ethUsdContract;
    uint256 public ethPriceDecimals;
    uint256 public ethPrice;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor(address _token, address oracleEthUSdPrice) {
        token = _token;
        ethUsdContract = new PriceConsumerV3(oracleEthUSdPrice);
        ethPriceDecimals = ethUsdContract.getDecimals();
    }

    receive() external payable {
        buyToken();
    }

    function setTreasury(address _treasury) external onlyOwner {
        if(_treasury == address(0)){
            revert invalidAddress();
        }
        externalTreasury = _treasury;
    }

    function treasuryMovs(address _to, uint256 _amount) internal {
        (bool sent, ) = payable(_to).call{value: _amount}("");
        if (!sent){
            revert ethNotSent();
        }
    }


    function buyToken() payable public {
        if (externalTreasury == address(0)){
            revert invalidTreasuryAddress();
            }
        uint256 amountToBuy = msg.value;
        if (amountToBuy == 0){
            revert invalidAmount();
        }

        ethPrice = uint256(ethUsdContract.getLatestPrice());
        uint256 amountToSend = amountToBuy * ethPrice / (10**ethPriceDecimals);

        
        treasuryMovs(externalTreasury, amountToBuy);

        IToken(token).mint(msg.sender, amountToSend);
        emit Bought(amountToSend);


    }

    function sellToken(uint256 amount) public {
        if (amount == 0){
            revert invalidAmount();
        }

        if(IERC20(token).balanceOf(msg.sender) < amount){
            revert invalidUserBalance();
        }

        ethPrice = uint256(ethUsdContract.getLatestPrice());
        uint256 amountToSend = amount * ethPrice / (10**ethPriceDecimals);


        IToken(token).burn(msg.sender, amount);

        if (address(externalTreasury).balance < amountToSend){
            revert notEnoughBalance();
        }

        //treasuryMovs(msg.sender, amountToSend);

        ITreasury(externalTreasury).withdraw(msg.sender, amountToSend);
        emit Sold(amount);
    }
}