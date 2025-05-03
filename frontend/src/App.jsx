import { useState, useEffect } from 'react';
import { getProvider, getGreenTokenContract, getCarbonLedgerContract } from "./blockchain";
import { ethers } from "ethers";
import ProjectRegistration from "./components/ProjectRegistration";
import ProjectList from "./components/ProjectList";
import OwnershipManagement from "./components/OwnershipManagement";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [greenBalance, setGreenBalance] = useState("0");
  const [carbonOffset, setCarbonOffset] = useState("0");
  const [loading, setLoading] = useState(false);

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = getProvider();
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnected(true);
            await fetchUserData(accounts[0]);
          }
        } catch (err) {
          console.error("Failed to check wallet connection:", err);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchUserData(accounts[0]);
        } else {
          setAccount("");
          setConnected(false);
          setGreenBalance("0");
          setCarbonOffset("0");
        }
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      setLoading(true);
      try {
        const provider = getProvider();
        // ethers v6 syntax for requesting accounts
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        setConnected(true);
        await fetchUserData(address);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Wallet connection failed: " + (err && err.message ? err.message : err));
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function fetchUserData(address) {
    setLoading(true);
    try {
      const provider = getProvider();
      const greenToken = getGreenTokenContract(provider);
      const carbonLedger = getCarbonLedgerContract(provider);
      
      // Get token balance - ethers v6 syntax
      const balance = await greenToken.balanceOf(address);
      setGreenBalance(ethers.formatEther(balance));
      
      // Try to get carbon offset amount, but handle if function doesn't exist
      try {
        const offset = await carbonLedger.getUserCarbonOffset(address);
        setCarbonOffset(ethers.formatEther(offset));
      } catch (offsetErr) {
        console.warn("getUserCarbonOffset not available in contract:", offsetErr);
        setCarbonOffset("0"); // Set default value
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Function to refresh user data after project registration
  const handleProjectAdded = () => {
    if (account) {
      fetchUserData(account);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-green-100 p-4 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold text-green-800">CarbonLedger dApp</h1>
        <p className="text-green-600">Carbon offsetting with blockchain</p>
      </header>

      <div className="mb-6">
        <button
          onClick={connectWallet}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            connected 
              ? "bg-green-200 text-green-800 border border-green-400" 
              : "bg-green-500 hover:bg-green-600 text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Connecting..." : connected ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
        </button>
      </div>

      {connected && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Green Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">GREEN Token Balance</p>
                <p className="text-2xl font-bold">{greenBalance}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Carbon Offset (tons)</p>
                <p className="text-2xl font-bold">{carbonOffset}</p>
              </div>
            </div>
          </div>

          {/* Project Registration Form */}
          <ProjectRegistration onProjectAdded={handleProjectAdded} />
          
          {/* Ownership Management */}
          <OwnershipManagement />
          
          {/* List of Registered Projects */}
          <ProjectList />
        </>
      )}
    </div>
  );
}

export default App;