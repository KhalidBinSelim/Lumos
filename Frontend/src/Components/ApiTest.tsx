import { useState } from 'react';
import api from '../api/axios';
import { authApi } from '../api';

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    setTestResult('Testing health check...\n');
    
    try {
      console.log('Testing health endpoint...');
      const response = await api.get('/health');
      setTestResult(`✅ Health Check Success!\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(response.data, null, 2)}\n\nCheck browser console for detailed logs.`);
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        isNetworkError: error.isNetworkError,
        data: error.data,
        fullError: error,
      };
      setTestResult(`❌ Health Check Failed!\n\nError Details:\n${JSON.stringify(errorDetails, null, 2)}\n\nCheck browser console (F12) for more information.`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setTestResult('Testing registration API...\n');
    
    try {
      // Generate unique email for testing
      const testEmail = `test${Date.now()}@example.com`;
      const response = await authApi.register({
        email: testEmail,
        password: 'test123456',
        fullName: 'Test User',
      });
      setTestResult(`✅ Registration API Success!\n\nRegistered with email: ${testEmail}\n\nResponse:\n${JSON.stringify(response, null, 2)}\n\nCheck browser console for detailed logs.`);
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        isNetworkError: error.isNetworkError,
        data: error.data,
      };
      setTestResult(`❌ Registration API Failed!\n\nError Details:\n${JSON.stringify(errorDetails, null, 2)}\n\nCheck browser console (F12) for more information.`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Testing login API...\n');
    
    try {
      // Try with test credentials (you need to register first)
      const response = await authApi.login({
        email: 'test@example.com',
        password: 'test123456',
      });
      setTestResult(`✅ Login API Success!\n\nResponse:\n${JSON.stringify(response, null, 2)}\n\nCheck browser console for detailed logs.`);
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        isNetworkError: error.isNetworkError,
        data: error.data,
      };
      setTestResult(`❌ Login API Failed!\n\nError Details:\n${JSON.stringify(errorDetails, null, 2)}\n\nNote: You need to register first. Try "Test Registration" button.\n\nCheck browser console (F12) for more information.`);
    } finally {
      setLoading(false);
    }
  };

  const testGetScholarships = async () => {
    setLoading(true);
    setTestResult('Testing get scholarships API...\n');
    
    try {
      console.log('Testing scholarships endpoint...');
      const response = await api.get('/scholarships?limit=5');
      setTestResult(`✅ Get Scholarships Success!\n\nStatus: ${response.status}\nFound: ${response.data.data?.length || 0} scholarships\n\nResponse:\n${JSON.stringify(response.data, null, 2)}\n\nCheck browser console for detailed logs.`);
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        isNetworkError: error.isNetworkError,
        data: error.data,
      };
      setTestResult(`❌ Get Scholarships Failed!\n\nError Details:\n${JSON.stringify(errorDetails, null, 2)}\n\nCheck browser console (F12) for more information.`);
    } finally {
      setLoading(false);
    }
  };

  const checkApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    setTestResult(`Current API URL: ${apiUrl}\n\nEnvironment variable VITE_API_URL: ${import.meta.env.VITE_API_URL || 'Not set (using default)'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={checkApiUrl}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Check API URL
            </button>
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
            >
              Test Health Check
            </button>
            <button
              onClick={testGetScholarships}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50"
            >
              Test Get Scholarships
            </button>
            <button
              onClick={testRegister}
              disabled={loading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition disabled:opacity-50"
            >
              Test Registration
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition disabled:opacity-50"
            >
              Test Login API
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {testResult && (
            <div className="mt-4 p-4 bg-slate-800 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Troubleshooting Steps:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure the backend server is running on port 5000</li>
            <li>Check that MongoDB is connected (check backend console)</li>
            <li>Verify CORS is allowing requests from your frontend URL</li>
            <li>Check browser console (F12) for any errors</li>
            <li>Check Network tab to see if requests are being sent</li>
            <li>Verify .env file exists with VITE_API_URL (or it will use default)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

