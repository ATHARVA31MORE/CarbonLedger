import { useState } from 'react'

import { getProvider, getGreenTokenContract, getCarbonLedgerContract } from "./blockchain";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = getProvider();
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setConnected(true);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Wallet connection failed: " + (err && err.message ? err.message : err));
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <>
      <h1 className='bg-amber-200'>hello </h1>
      <button onClick={connectWallet} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        {connected ? `Connected: ${account}` : "Connect Wallet"}
      </button>
    </>
  );
}

export default App
