import { useState, useEffect } from 'react';
import { getProvider, getCarbonLedgerContract } from '../blockchain';
import { ethers } from 'ethers';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = getProvider();
      const carbonLedgerContract = getCarbonLedgerContract(provider);
      
      // Get the total number of projects
      const projectCount = await carbonLedgerContract.getProjectCount();
      
      // Convert BigInt to number for iteration
      const count = Number(projectCount);
      
      // Fetch all projects
      const projectsData = [];
      for (let i = 0; i < count; i++) {
        const [name, projectType, co2Saved, creditsIssued] = await carbonLedgerContract.getProject(i);
        projectsData.push({
          id: i,
          name,
          projectType,
          co2Saved: ethers.formatEther(co2Saved),
          creditsIssued: ethers.formatEther(creditsIssued)
        });
      }
      
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Registered Green Projects</h2>
        <button 
          onClick={fetchProjects}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No green projects registered yet.</p>
          <p className="text-sm text-gray-400 mt-1">Register a new project to see it here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ Saved (tons)</th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Issued</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{project.id}</td>
                  <td className="py-3 px-4 border-b font-medium">{project.name}</td>
                  <td className="py-3 px-4 border-b">{project.projectType}</td>
                  <td className="py-3 px-4 border-b text-green-600 font-medium">{project.co2Saved}</td>
                  <td className="py-3 px-4 border-b text-blue-600 font-medium">{project.creditsIssued}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectList;