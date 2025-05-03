import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Test() {
  const [form, setForm] = useState({
    model_type: '',
    dataset_size_gb: '',
    task_type: '',
    budget: '',
    region: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Configure axios
  useEffect(() => {
    axios.defaults.timeout = 15000;
    axios.interceptors.request.use(request => {
      console.log('Request:', request);
      return request;
    });
  }, []);

  const validateForm = () => {
    return (
      form.model_type.trim() !== '' &&
      form.dataset_size_gb.trim() !== '' &&
      form.task_type !== '' &&
      form.region !== ''
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = {
        ...form,
        dataset_size_gb: parseFloat(form.dataset_size_gb),
        budget: form.budget ? parseFloat(form.budget) : undefined
      };
      
      const res = await axios.post('http://localhost:8080/recommendations', formData);
      
      if (Array.isArray(res.data) && res.data.length === 0) {
        setError('No GPU instances found matching your criteria');
        setResults([]);
      } else {
        setResults(Array.isArray(res.data) ? res.data : res.data.recommendations || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to get recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(results)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg mb-4">
            <div className="bg-gray-900 rounded-md px-4 py-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
                AI GPU Optimizer
              </h1>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Find the perfect GPU configuration for your machine learning workloads
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-blue-500 w-2 h-6 rounded-full mr-3"></span>
              Configuration Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Model Type */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="model_type"
                    placeholder="e.g. LLM, Vision Transformer, CNN"
                    value={form.model_type}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-700/50 border ${submitAttempted && !form.model_type.trim() ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                {submitAttempted && !form.model_type.trim() && (
                  <p className="mt-1 text-sm text-red-400">Please specify your model type</p>
                )}
              </div>

              {/* Dataset Size */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dataset Size (GB) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="dataset_size_gb"
                    placeholder="e.g. 50, 100, 500"
                    value={form.dataset_size_gb}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className={`w-full bg-gray-700/50 border ${submitAttempted && !form.dataset_size_gb ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                  </div>
                </div>
                {submitAttempted && !form.dataset_size_gb && (
                  <p className="mt-1 text-sm text-red-400">Please enter your dataset size</p>
                )}
              </div>

              {/* Task Type */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="task_type"
                    value={form.task_type}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-700/50 border ${submitAttempted && !form.task_type ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400 appearance-none`}
                  >
                    <option value="">Select your task</option>
                    <option value="training">Model Training</option>
                    <option value="inference">Inference</option>
                    <option value="fine-tuning">Fine-tuning</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {submitAttempted && !form.task_type && (
                  <p className="mt-1 text-sm text-red-400">Please select a task type</p>
                )}
              </div>

              {/* Budget */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget ($/hour)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="budget"
                    placeholder="Maximum hourly cost (optional)"
                    value={form.budget}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Region <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-700/50 border ${submitAttempted && !form.region ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400 appearance-none`}
                  >
                    <option value="">Select deployment region</option>
                    <option value="us-east-at-1">us-east-at-1</option>
                    <option value="ap-south-mum-1">ap-south-mum-1</option>
                    <option value="ap-south-noi-1">ap-south-noi-1</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                {submitAttempted && !form.region && (
                  <p className="mt-1 text-sm text-red-400">Please select a region</p>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/20'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Requirements...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Find Optimal GPUs
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-purple-500 w-2 h-6 rounded-full mr-3"></span>
              GPU Recommendations
            </h2>

            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-blue-300">
                    Found <span className="font-bold text-white">{results.length}</span> matching GPU configurations
                    {form.budget && <span> within your ${form.budget}/hour budget</span>}
                  </p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {results.map((gpu, idx) => (
                    <div 
                      key={idx}
                      className={`border rounded-xl p-5 transition-all duration-300 ${idx === 0 ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-600 shadow-lg' : 'bg-gray-700/30 border-gray-600 hover:border-blue-500'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold flex items-center">
                            {gpu.resource_class || gpu.gpu_description}
                            {idx === 0 && (
                              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Best Match
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-300 text-sm mt-1">{gpu.gpu_description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-400">${gpu.price_per_hour}<span className="text-sm font-normal text-gray-400">/hr</span></p>
                          {gpu.price_per_spot > 0 && (
                            <p className="text-sm text-purple-400">${gpu.price_per_spot}/hr (spot)</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">vCPUs</p>
                          <p className="text-lg font-semibold">{gpu.vcpus}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">RAM</p>
                          <p className="text-lg font-semibold">{gpu.ram} GB</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Region</p>
                          <p className="text-lg font-semibold">{gpu.region}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">OS</p>
                          <p className="text-lg font-semibold">{gpu.operating_system || 'Any'}</p>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-sm text-gray-300">{gpu.explanation}</p>
                      </div>

                      {/* <button className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-200">
                        REQUEST {when gpu not available}
                      </button> */}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <div className="bg-gray-700/50 rounded-full p-4 mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-400 max-w-md">
                  Submit your machine learning workload details to get optimized GPU recommendations tailored to your needs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
