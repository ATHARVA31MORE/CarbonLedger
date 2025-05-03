import { ethers } from "ethers";
import GreenTokenABI from "./ABI/GreenToken.json";
import CarbonLedgerABI from "./ABI/CarbonLedger.json";
import CarbonLedgerWithOffset from "./ABI/CarbonLedgerWithOffset.json";

// Deployed contract addresses
export const GREEN_TOKEN_ADDRESS = "0xBe54631ED0C151Dd0B7f5795cbeBBFd7b5db19Ae";
export const CARBON_LEDGER_ADDRESS = "0xF8C326965D39b4cf233C620393d77c2d8Ce6A309";
export const CARBON_LEDGER_WITH_OFFSET_ADDRESS = "0x45C21305b621013718A28EBaf2F984BAF2EFBf1C";

// Function to get provider (Metamask or fallback)
export function getProvider() {
  if (window.ethereum) {
    // ethers v6 syntax for creating a provider
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // For read-only functionality when user doesn't have MetaMask
    return ethers.getDefaultProvider();
  }
}

// Functions to get contract instances
export function getGreenTokenContract(signerOrProvider) {
  return new ethers.Contract(GREEN_TOKEN_ADDRESS, GreenTokenABI.abi, signerOrProvider);
}

export function getCarbonLedgerContract(signerOrProvider) {
  return new ethers.Contract(CARBON_LEDGER_ADDRESS, CarbonLedgerABI.abi, signerOrProvider);
}
export function getCarbonLedgerWithOffsetContract(signerOrProvider) {
  return new ethers.Contract(CARBON_LEDGER_WITH_OFFSET_ADDRESS, CarbonLedgerWithOffset.abi, signerOrProvider); 
}


// Helper function to get a signer
export async function getSigner() {
  const provider = getProvider();
  
  // Make sure user has connected their wallet
  await provider.send("eth_requestAccounts", []);
  
  return provider.getSigner();
}

// Function to perform a write transaction with error handling
export async function executeTransaction(transactionFunction) {
  try {
    const tx = await transactionFunction();
    const receipt = await tx.wait();
    return { success: true, receipt };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { 
      success: false, 
      error: error.message || "Transaction failed",
      code: error.code
    };
  }
}