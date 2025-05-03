import React from 'react';

const ComparisonModal = ({ isOpen, onClose, instances }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" 
            onClick={onClose}
          ></div>
        </div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">
              GPU Instance Comparison
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Detailed cost analysis of recommended configurations
            </p>
          </div>

          <div className="bg-gray-800 px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Instance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      GPU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      On-Demand ($/hr)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Spot ($/hr)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Monthly Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      vCPUs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      RAM (GB)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {instances.map((instance, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/30'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-blue-400">
                          {instance.resource_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {instance.region}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {instance.gpu_description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-400">
                        ${instance.price_per_hour?.toFixed(3) || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-purple-400">
                        ${instance.price_per_spot?.toFixed(3) || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        ${instance.price_per_month?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {instance.vcpus}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {instance.ram}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Showing {instances.length} configurations
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;