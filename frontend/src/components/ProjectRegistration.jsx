import { useState } from 'react';
import { getSigner, getCarbonLedgerContract, executeTransaction } from '../blockchain';

function ProjectRegistration({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    projectType: '',
    co2Saved: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!formData.name || !formData.projectType || !formData.co2Saved) {
        throw new Error('All fields are required');
      }

      if (isNaN(formData.co2Saved) || parseFloat(formData.co2Saved) <= 0) {
        throw new Error('CO₂ saved must be a positive number');
      }

      // Get signer and contract
      const signer = await getSigner();
      const carbonLedgerContract = getCarbonLedgerContract(signer);

      // Convert CO2 saved to wei (multiply by 10^18)
      const co2SavedInWei = BigInt(parseFloat(formData.co2Saved) * 1e18);

      // Execute the transaction
      const result = await executeTransaction(() => 
        carbonLedgerContract.addGreenProject(
          formData.name,
          formData.projectType,
          co2SavedInWei
        )
      );

      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          projectType: '',
          co2Saved: ''
        });
        // Notify parent component that a project was added
        if (onProjectAdded) onProjectAdded();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to register project');
      console.error('Project registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Register Green Project</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Project successfully registered! GreenTokens have been minted.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Solar Train Route"
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectType">
            Project Type
          </label>
          <input
            type="text"
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Electrification, Reforestation"
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="co2Saved">
            CO₂ Saved (tons)
          </label>
          <input
            type="number"
            id="co2Saved"
            name="co2Saved"
            value={formData.co2Saved}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 100"
            min="0.01"
            step="0.01"
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectRegistration;