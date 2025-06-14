'use client';

import { useState } from 'react';

// Mock data for demonstration
const MOCK_AUTOMATIONS = [
  {
    id: 1,
    name: 'Daily NEAR Protocol Guild Donation',
    status: 'Active',
    frequency: 'Daily',
    amount: '1 NEAR',
    lastRun: '2023-10-26 10:00 AM',
    nextRun: '2023-10-27 10:00 AM',
  },
  {
    id: 2,
    name: 'Weekly ETH Layer2 Research Fund',
    status: 'Paused',
    frequency: 'Weekly',
    amount: '0.05 ETH',
    lastRun: '2023-10-20 03:00 PM',
    nextRun: 'N/A',
  },
  {
    id: 3,
    name: 'Monthly Web3 Education Initiative',
    status: 'Active',
    frequency: 'Monthly',
    amount: '50 USDC',
    lastRun: '2023-10-01 09:00 AM',
    nextRun: '2023-11-01 09:00 AM',
  },
];

const MOCK_DONATION_HISTORY = [
  {
    id: 101,
    date: '2023-10-26',
    campaign: 'Protocol Guild',
    amount: '1 NEAR',
    status: 'Completed',
    txId: '0xabc123...', // Mock transaction ID
  },
  {
    id: 102,
    date: '2023-10-25',
    campaign: 'MyFirstLayer2',
    amount: '0.01 ETH',
    status: 'Completed',
    txId: '0xdef456...', // Mock transaction ID
  },
  {
    id: 103,
    date: '2023-10-24',
    campaign: 'Today in DeFi',
    amount: '10 USDC',
    status: 'Completed',
    txId: '0xghi789...', // Mock transaction ID
  },
  {
    id: 104,
    date: '2023-10-23',
    campaign: 'Gator Labs',
    amount: '0.5 NEAR',
    status: 'Pending',
    txId: '0xjkl012...', // Mock transaction ID
  },
];

export default function DashboardPage() {
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);
  const [donationHistory, setDonationHistory] = useState(MOCK_DONATION_HISTORY);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [automationToRemove, setAutomationToRemove] = useState<number | null>(null);

  const handleRemoveClick = (id: number) => {
    setAutomationToRemove(id);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (automationToRemove) {
      console.log('Removing automation', automationToRemove);
      setAutomations(automations.filter(auto => auto.id !== automationToRemove));
      setShowRemoveModal(false);
      setAutomationToRemove(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6ff] to-[#f3f9fa] pt-8 pb-12 px-4">
      <div className="w-full max-w-3xl mx-auto mt-4">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">Your Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Donated</h2>
            <p className="text-4xl font-bold text-green-600">$1,234.56</p>
            <p className="text-sm text-gray-500">Across all campaigns</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Active Automations</h2>
            <p className="text-4xl font-bold text-purple-600">{automations.filter(a => a.status === 'Active').length}</p>
            <p className="text-sm text-gray-500">Currently running</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Last Donation</h2>
            <p className="text-4xl font-bold text-orange-600">{donationHistory[0]?.amount || 'N/A'}</p>
            <p className="text-sm text-gray-500">{donationHistory[0]?.date || 'N/A'}</p>
          </div>
        </div>

        {/* Automation List */}
        <section className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Your Automations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Frequency</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Last Run</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Next Run</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((auto) => (
                  <tr key={auto.id} className="hover:bg-blue-50">
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{auto.name}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${auto.status === 'Active' ? 'text-green-900' : 'text-red-900'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${auto.status === 'Active' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{auto.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{auto.frequency}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{auto.amount}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-gray-500">{auto.lastRun}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-gray-500">{auto.nextRun}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm">
                      <div className="flex gap-2">
                        {auto.status === 'Active' ? (
                          <button
                            onClick={() => console.log('Pause automation', auto.id)}
                            className="p-1 rounded-full text-yellow-600 hover:bg-yellow-100 transition"
                            title="Pause"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause-circle"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => console.log('Run automation', auto.id)}
                            className="p-1 rounded-full text-green-600 hover:bg-green-100 transition"
                            title="Run"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveClick(auto.id)}
                          className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Donation History */}
        <section className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Donation History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Campaign</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 border-b-2 border-blue-100 bg-blue-50 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation) => (
                  <tr key={donation.id} className="hover:bg-blue-50">
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{donation.date}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{donation.campaign}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-900">{donation.amount}</td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${donation.status === 'Completed' ? 'text-green-900' : 'text-orange-900'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${donation.status === 'Completed' ? 'bg-green-200' : 'bg-orange-200'}`}></span>
                        <span className="relative">{donation.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-blue-50 text-sm text-blue-500 underline truncate max-w-[150px]">{donation.txId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Remove Confirmation Modal */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Remove Automation</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove this automation? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 