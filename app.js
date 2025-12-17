console.log("app.js loaded");

let provider;
let signer;

const routerAddress = "0xe1aEe57F48830876B37A1a7d04d73eF9F1d069f2";

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender,uint value) external returns (bool)",
  "function decimals() view returns (uint8)"
];

// ================= CONNECT =================
let provider;
let signer;
let detectedProvider = null;

// listen provider (MetaMask)
window.addEventListener("eip6963:announceProvider", (event) => {
  if (event.detail.info.name === "MetaMask") {
    detectedProvider = event.detail.provider;
  }
});

// request provider
window.dispatchEvent(new Event("eip6963:requestProvider"));

async function connect() {
  if (!detectedProvider) {
    alert("MetaMask tidak terdeteksi");
    return;
  }

  provider = new ethers.providers.Web3Provider(detectedProvider);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  document.getElementById("wallet").innerText =
    await signer.getAddress();
}

// ================= DECIMALS =================
async function getDecimals(token) {
  const c = new ethers.Contract(token, erc20Abi, provider);
  return await c.decimals();
}

// ================= SWAP =================
async function swap() {
  if (!signer) {
    alert("Connect wallet dulu");
    return;
  }

  const tokenIn = document.getElementById("tokenIn").value;
  const tokenOut = document.getElementById("tokenOut").value;
  const amount = document.getElementById("amountIn").value;

  const decimals = await getDecimals(tokenIn);
  const amountIn = ethers.utils.parseUnits(amount, decimals);

  // approve
  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  await tokenContract.approve(routerAddress, amountIn);

  // swap
  const router = new ethers.Contract(routerAddress, routerAbi, signer);
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 600;

  await router.swapExactTokensForTokens(
    amountIn,
    0,
    path,
    await signer.getAddress(),
    deadline
  );

  alert("Swap success");
}
