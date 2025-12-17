const routerAddress = "0xe1aEe57F48830876B37A1a7d04d73eF9F1d069f2";

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender,uint value) external returns (bool)",
  "function decimals() view returns (uint8)"
];

let provider, signer;
