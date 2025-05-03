import { ethers } from "ethers";
import GreenTokenABI from "./ABI/GreenToken.json";
import CarbonLedgerABI from "./ABI/CarbonLedger.json";

// Deployed contract addresses
export const GREEN_TOKEN_ADDRESS = "0x1d72D76c8B456297900eA6FDEb5c9a50f42baFd2";
export const CARBON_LEDGER_ADDRESS = "0xb4dAA0e89CB3b8e21D48C1D3E592747A2736EF03";

// Function to get provider (Metamask or fallback)
export function getProvider() {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    return ethers.getDefaultProvider();
  }
}

// Functions to get contract instances
export function getGreenTokenContract(signerOrProvider) {
  return new ethers.Contract(GREEN_TOKEN_ADDRESS, GreenTokenABI, signerOrProvider);
}

export function getCarbonLedgerContract(signerOrProvider) {
  return new ethers.Contract(CARBON_LEDGER_ADDRESS, CarbonLedgerABI, signerOrProvider);
}