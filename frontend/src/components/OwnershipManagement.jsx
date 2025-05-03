import { useState } from 'react';
import { getSigner, getCarbonLedgerContract, executeTransaction } from '../blockchain';

function OwnershipManagement() {
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentOwner, setCurrentOwner] = useState('');

  // Fetch current owner when component mounts
  const fetchCurrentOwner = async () => {
    try {
      const signer = await getSigner();
      const carbonLedgerContract = getCarbonLedgerContract(signer);
      const owner = await carbonLedgerContract.owner();
      setCurrentOwner(owner);
    } catch (err) {
      console.error('Failed to fetch current owner:', err);
      setError('Failed to fetch current owner. Please try again.');
    }
  };

  const handleChange = (e) => {
    setNewOwnerAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate input
      if (!newOwnerAddress) {
        throw new Error('New owner address is required');
      }

      // Get signer and contract
      const signer = await getSigner();
      const carbonLedgerContract = getCarbonLedgerContract(signer);

      // Execute the transaction
      const result = await executeTransaction(() => 
        carbonLedgerContract.transferOwnership(newOwnerAddress)
      );

      if (result.success) {
        setSuccess(true);
        setNewOwnerAddress('');
        // Update current owner
        await fetchCurrentOwner();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to transfer ownership');
      console.error('Ownership transfer error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Contract Ownership Management</h2>
      
      <button 
        onClick={fetchCurrentOwner}
        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 mb-4"
      >
        Check Current Owner
      </button>
      
      {currentOwner && (
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-600">Current Owner:</p>
          <p className="font-mono break-all">{currentOwner}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Ownership successfully transferred!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newOwnerAddress">
            New Owner Address
          </label>
          <input
            type="text"
            id="newOwnerAddress"
            name="newOwnerAddress"
            value={newOwnerAddress}
            onChange={handleChange}
            placeholder="0x..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Transfer Ownership'}
        </button>
      </form>
    </div>
  );
}

export default OwnershipManagement;