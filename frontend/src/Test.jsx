import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/recommendations', form);
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching recommendations', err);
      alert('Failed to get recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🎯 GPU Recommendation Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          name="model_type"
          placeholder="Model Type (e.g. LLM)"
          value={form.model_type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="dataset_size_gb"
          placeholder="Dataset Size (GB)"
          value={form.dataset_size_gb}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="task_type"
          value={form.task_type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Task</option>
          <option value="training">Training</option>
          <option value="inference">Inference</option>
        </select>
        <input
          type="number"
          name="budget"
          placeholder="Budget ($)"
          value={form.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Region</option>
          <option value="us-east-at-1">us-east-at-1</option>
          <option value="ap-south-mum-1">ap-south-mum-1</option>
          <option value="ap-south-del-1">ap-south-del-1</option>
          <option value="ap-south-noi-1">ap-south-noi-1</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-center">✅ Recommended Instances</h3>
          {results.map((gpu, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <h4 className="font-bold text-lg">{gpu.resource_class}</h4>
              <p className="text-sm text-gray-600">{gpu.gpu_description}</p>
              <ul className="mt-2 text-sm">
                <li><strong>vCPUs:</strong> {gpu.vcpus}</li>
                <li><strong>RAM:</strong> {gpu.ram} GB</li>
                <li><strong>Region:</strong> {gpu.region}</li>
                <li><strong>Hourly:</strong> ${gpu.price_per_hour}</li>
                <li><strong>Spot:</strong> ${gpu.price_per_spot}</li>
              </ul>
              <p className="mt-2 italic text-green-700">{gpu.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Test;
