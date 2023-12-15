# Solidity API

## Cats

### CAT1

```solidity
uint256 CAT1
```

### CAT2

```solidity
uint256 CAT2
```

### CAT3

```solidity
uint256 CAT3
```

### CAT4

```solidity
uint256 CAT4
```

### CAT5

```solidity
uint256 CAT5
```

### FOOD1

```solidity
uint256 FOOD1
```

### FOOD2

```solidity
uint256 FOOD2
```

### _uris

```solidity
mapping(uint256 => string) _uris
```

### constructor

```solidity
constructor() public
```

contract constructor with ipfs link to metadata

### mint

```solidity
function mint(address to, uint256 id, uint256 amount, bytes data) external
```

_mint a new token id, amount and data_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | recipient address |
| id | uint256 | token id |
| amount | uint256 | token amount |
| data | bytes | additional data |

### mintBatch

```solidity
function mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data) external
```

### setTokenUri

```solidity
function setTokenUri(uint256 tokenId, string tokenUri) external
```

### getTokenUri

```solidity
function getTokenUri(uint256 tokenId) external view returns (string)
```

