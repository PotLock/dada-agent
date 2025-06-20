'use client';

import { useState, useEffect } from 'react';

const PRESETS = [2000, 10000, 100000, 250000];
const FUND_METHODS = [
  {
    key: 'automated-daily',
    title: 'Automated Daily',
    desc: 'Agent sends $1/day directly from your wallet.',
    details: 'Direct, seamless, set-and-forget.',
    icon: '🤖',
    color: 'border-purple-500 bg-purple-50',
  },
  {
    key: 'pooled-contribution',
    title: 'Pooled Contribution',
    desc: 'Contribute to a shared Funding AI pool for distribution.',
    details: 'Collaborative, scalable, collective impact.',
    icon: '💧',
    color: 'border-cyan-500 bg-cyan-50',
  },
  {
    key: 'manual-allocation',
    title: 'Manual Allocation',
    desc: 'Manually set percentages for your selected campaigns.',
    details: 'Granular control, custom distribution.',
    icon: '✍️',
    color: 'border-yellow-500 bg-yellow-50',
  },
  {
    key: 'impact-driven',
    title: 'Impact-Driven',
    desc: 'Prioritize campaigns with the highest impact scores.',
    details: 'Maximizes positive change per dollar.',
    icon: '📈',
    color: 'border-green-500 bg-green-50',
  },
  {
    key: 'time-based',
    title: 'Time-Based',
    desc: 'Distribute funds across campaigns over set periods.',
    details: 'Steady support, multiple beneficiaries.',
    icon: '⏳',
    color: 'border-red-500 bg-red-50',
  },
];
const SUPPLY = [
  { label: 'Sale', value: '92.5%', amount: '5.0M', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Treasury', value: '6.0%', amount: '324K', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Creator', value: '1.0%', amount: '54K', color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Support', value: '0.5%', amount: '27K', color: 'text-purple-600', bg: 'bg-purple-50' },
];

const SUGGESTIONS = [
  'Social impact in South America',
  'Near ecosystem',
  'AI agents for good',
  'Account abstraction',
  'Academic research',
  'DAO community',
  'Open source',
  'Social impact',
  'AI agents for good',
];

export interface SocialLink {
  type: string;
  url: string;
  icon: string;
}

export interface MockCampaign {
  id: number;
  name: string;
  desc: string;
  logo: string;
  weighting: number;
  score: number;
}

export interface MockProject extends MockCampaign {
  socials?: SocialLink[];
}

export interface MockCampaignListItem extends MockCampaign {
  campaignUrl?: string;
}


const NETWORKS = [
  { label: 'NEAR', icon: '🟩', logo: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#fff"/><path d="M9.5 22.5V9.5L22.5 22.5V9.5" stroke="#00DC82" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) },
  { label: 'Ethereum', icon: '🟦', logo: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#fff"/><path d="M16 6L16.2 6.6V21.6L16 22L15.8 21.6V6.6L16 6ZM16 22.8L24.8 17.2L16 26L7.2 17.2L16 22.8Z" fill="#627EEA"/></svg>
  ) },
];

const TABS = [
  { label: 'All' },
  { label: 'Project' },
  { label: 'Campaign' },
];

// Function to format social network URLs
function formatSocialUrl(type: string, url: string): string {
  if (!url) return '';
  
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Format based on social network type
  switch (type.toLowerCase()) {
    case 'twitter':
    case 'x':
      return url.startsWith('@') ? `https://x.com/${url.substring(1)}` : `https://x.com/${url}`;
    case 'github':
      return `https://github.com/${url}`;
    case 'telegram':
      return url.startsWith('@') ? `https://t.me/${url.substring(1)}` : `https://t.me/${url}`;
    case 'discord':
      return url.startsWith('discord.gg/') ? `https://${url}` : `https://discord.gg/${url}`;
    case 'linkedin':
      return url.startsWith('linkedin.com/') ? `https://www.${url}` : `https://www.linkedin.com/in/${url}`;
    case 'youtube':
      return url.startsWith('youtube.com/') ? `https://www.${url}` : `https://www.youtube.com/${url}`;
    case 'instagram':
      return `https://instagram.com/${url}`;
    case 'facebook':
      return `https://facebook.com/${url}`;
    case 'website':
    case 'web':
      return url.startsWith('http') ? url : `https://${url}`;
    default:
      return url.startsWith('http') ? url : `https://${url}`;
  }
}

export default function Home() {
  const [goal, setGoal] = useState(25000);
  const [selectedMethod, setSelectedMethod] = useState('crowd');
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<boolean[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<boolean[]>([]);
  const [weightings, setWeightings] = useState<number[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState('NEAR');
  const [selectedTab, setSelectedTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState('NEAR');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [combinedResults, setCombinedResults] = useState<any[]>([]);
  const [selectedCombined, setSelectedCombined] = useState<boolean[]>([]);

  useEffect(() => {
    if (search && !isSearching && !showResults) {
      handleSearch();
    }
  }, [search, isSearching, showResults]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!search.trim()) {
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Search both projects and campaigns by default
      const response = await fetch(`/api/search?query=${encodeURIComponent(search)}&topK=20&similarityWeight=0.7&rankWeight=0.3&type=all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const allResults = data.results || [];
      
      // Filter results based on type
      const projectResults = allResults.filter((result: any) => result.type === 'project');
      const campaignResults = allResults.filter((result: any) => result.type === 'campaign');
      
      // Set both filtered results
      setFilteredProjects(projectResults);
      setFilteredCampaigns(campaignResults);
      
      // Set combined results for "All" tab
      setCombinedResults(allResults);
      
      // Set selected states and weightings based on current tab
      if (selectedTab === 'All') {
        setSelectedCombined(allResults.map(() => false));
        setWeightings(allResults.map((item: any) => item.weighting ?? 0));
      } else if (selectedTab === 'Project') {
        setSelectedProjects(projectResults.map(() => false));
        setWeightings(projectResults.map((p: any) => p.weighting ?? 0));
      } else {
        setSelectedCampaigns(campaignResults.map(() => false));
        setWeightings(campaignResults.map((c: any) => c.weighting ?? 0));
      }

      setShowResults(true);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectedNetworkObj = NETWORKS.find(n => n.label === selectedNetwork);

  // Example NEAR conversion (replace with real API)
  const nearRate = 2.39;
  const nearAmount = (goal / nearRate).toFixed(2);

  const handleSelect = (idx: number) => {
    if (selectedTab === 'All') {
      setSelectedCombined(sel => sel.map((v, i) => (i === idx ? !v : v)));
    } else if (selectedTab === 'Project') {
      setSelectedProjects(sel => sel.map((v, i) => (i === idx ? !v : v)));
    } else {
      setSelectedCampaigns(sel => sel.map((v, i) => (i === idx ? !v : v)));
    }
  };

  const handleWeighting = (idx: number, value: number) => {
    setWeightings(ws => ws.map((w, i) => (i === idx ? value : w)));
  };

  // Helper for pluralization
  const selectedCount = selectedTab === 'All' 
    ? selectedCombined.filter(Boolean).length 
    : selectedTab === 'Project'
    ? selectedProjects.filter(Boolean).length 
    : selectedCampaigns.filter(Boolean).length;
  
  const allSelected = selectedTab === 'All'
    ? selectedCombined.every(Boolean)
    : selectedTab === 'Project'
    ? selectedProjects.every(Boolean)
    : selectedCampaigns.every(Boolean);

  const handleSelectAll = () => {
    if (selectedTab === 'All') {
      setSelectedCombined(prev => prev.map(() => !allSelected));
    } else if (selectedTab === 'Project') {
      setSelectedProjects(prev => prev.map(() => !allSelected));
    } else {
      setSelectedCampaigns(prev => prev.map(() => !allSelected));
    }
  };

  const handleConfirmSetup = async () => {
    setIsSettingUp(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSettingUp(false);
    setSetupSuccess(true);
    // Close modal after 2 seconds
    setTimeout(() => {
      setShowFundingModal(false);
      setSetupSuccess(false);
    }, 2000);
  };

  const handleAmountChange = (value: number) => {
    setFundingAmount(value);
  };

  const handlePresetClick = (amount: number) => {
    setFundingAmount(amount);
  };

  const handleTabChange = (newTab: 'All' | 'Project' | 'Campaign') => {
    setSelectedTab(newTab);
    
    // Update selected states and weightings based on the new tab
    if (newTab === 'All') {
      setSelectedCombined(combinedResults.map(() => false));
      setWeightings(combinedResults.map((item: any) => item.weighting ?? 0));
    } else if (newTab === 'Project') {
      setSelectedProjects(filteredProjects.map(() => false));
      setWeightings(filteredProjects.map((p: any) => p.weighting ?? 0));
    } else {
      setSelectedCampaigns(filteredCampaigns.map(() => false));
      setWeightings(filteredCampaigns.map((c: any) => c.weighting ?? 0));
    }
  };

  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 overflow-x-hidden pb-8">
      {/* Hero Section */}
      <section className={`w-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-transparent transition-all duration-700 px-4 ${showResults ? 'pt-24 sm:pt-20 pb-6' : 'h-screen'}`}>
        <div className={`flex flex-col items-center transition-all duration-700 w-full max-w-2xl ${showResults ? 'mt-0 scale-90' : 'mt-[-10vh] scale-100'}`}>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-pink-900 mb-2 sm:mb-3 transition-all duration-700 leading-tight ${showResults ? 'scale-90' : 'scale-100'}`}>
            AI-Powered Donations, Real-World Impact <span className="inline-block align-middle">🤖</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-center text-pink-800 mb-3 sm:mb-4 px-4 transition-all duration-700 leading-relaxed ${showResults ? 'opacity-0 hidden' : 'opacity-100'}`}>
            Automate your contributions to impactful projects and campaigns on NEAR and beyond.
          </p>
          <form
            className={`w-full flex items-center bg-pink-100/90 rounded-full shadow-lg px-4 sm:px-6 py-3 sm:py-2.5 mb-4 border border-pink-200 transition-all duration-700 ${showResults ? 'scale-90' : 'scale-100'}`}
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-base sm:text-lg md:text-xl placeholder:text-pink-400 text-pink-900 min-w-0"
              placeholder="What would you like to fund?"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`ml-3 sm:ml-4 bg-pink-300 hover:bg-pink-400 text-pink-900 rounded-full w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center transition ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
              aria-label="Search"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4 text-pink-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              )}
            </button>
          </form>
          {!showResults && (
            <div className={`w-full flex flex-wrap gap-2 justify-center items-center transition-all duration-700 px-2 ${showResults ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
              <span className="text-sm sm:text-base text-pink-800 font-medium mr-2">Some ideas:</span>
              {SUGGESTIONS.map((idea, idx) => (
                <button
                  key={idea}
                  className="bg-pink-200 hover:bg-pink-300 text-pink-900 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold shadow transition"
                  onClick={() => setSearch(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className={`w-full max-w-3xl mx-auto mt-4 px-4 transition-all duration-700 flex-1 flex flex-col`}>
          <div className={`mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-base sm:text-lg font-semibold text-pink-900">Results for <span className="font-bold">{search}</span></div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex rounded-full bg-pink-100 p-1 border border-pink-200">
                  {TABS.map(tab => (
                    <button
                      key={tab.label}
                    className={`px-3 sm:px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-150 ${selectedTab === tab.label ? 'bg-pink-200 text-pink-900 shadow' : 'text-pink-700 hover:text-pink-900'}`}
                    onClick={() => handleTabChange(tab.label as 'All' | 'Project' | 'Campaign')}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          <div className={`mb-3 p-3 sm:p-4 bg-pink-100/60 border border-pink-200 rounded-xl text-pink-800 text-sm sm:text-base transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            Take a moment to review the allocation strategy and make adjustments before moving forward with your donation. Be sure to select projects and campaigns that align with your funding goals.
          </div>
          <div className={`bg-white rounded-2xl shadow-lg border border-pink-200 overflow-hidden transition-all duration-700 flex-1 flex flex-col ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Mobile-friendly table header */}
            <div className="hidden sm:grid sm:grid-cols-12 items-center px-4 sm:px-6 py-3 border-b border-pink-200 text-xs font-semibold text-pink-800">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-2 border-pink-500 text-pink-600 focus:ring-pink-500 cursor-pointer transition-colors duration-200"
                />
                <span>{selectedTab === 'All' ? 'ALL' : selectedTab === 'Project' ? 'PROJECT' : 'CAMPAIGN'}</span>
              </div>
              <div className="col-span-7"></div>
              <div className="col-span-2 text-center">WEIGHTING</div>
              <div className="col-span-2 text-center">SCORE</div>
            </div>
            
            {/* Mobile-friendly results list */}
            <div className="sm:hidden flex-1 overflow-y-auto">
              {(selectedTab === 'All' ? combinedResults : selectedTab === 'Project' ? filteredProjects : filteredCampaigns).map((c, idx) => (
              <div
                  key={c.id || c.accountId || idx}
                  className={`p-4 border-b last:border-b-0 border-pink-100 transition bg-pink-100 cursor-pointer hover:bg-pink-50 ${(selectedTab === 'All' ? selectedCombined[idx] : selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]) ? 'bg-pink-50' : 'opacity-60'}`}
                  onClick={() => {
                    setModalData(c);
                    setModalOpen(true);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedTab === 'All' ? selectedCombined[idx] : selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]}
                        onChange={e => { e.stopPropagation(); handleSelect(idx); }}
                        className="w-5 h-5 rounded border-2 border-pink-500 text-pink-600 focus:ring-pink-500 cursor-pointer transition-colors duration-200"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={c.image || c.logo} alt={c.name} className="w-12 h-12 rounded-full border border-pink-200 object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-pink-900 text-base mb-1 flex items-center gap-2">
                            <span className="truncate">{c.name}</span>
                            {selectedTab === 'All' && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${c.type === 'project' ? 'bg-pink-100 text-pink-800' : 'bg-pink-200 text-pink-900'}`}>
                                {c.type === 'project' ? 'Project' : 'Campaign'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-pink-500 truncate">{c.desc || c.description}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-center">
                          <div className="text-xs text-pink-500 font-medium">WEIGHTING</div>
                          <div className="text-sm font-semibold text-pink-900">
                            {c.weightingScore !== undefined ? (c.weightingScore * 100).toFixed(1) : '-'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-pink-500 font-medium">SCORE</div>
                          <div className="text-sm font-semibold text-pink-900">
                            {c.overallScore !== undefined ? c.overallScore.toFixed(1) : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block flex-1 overflow-y-auto">
              {(selectedTab === 'All' ? combinedResults : selectedTab === 'Project' ? filteredProjects : filteredCampaigns).map((c, idx) => (
                <div
                  key={c.id || c.accountId || idx}
                  className={`grid grid-cols-12 items-center px-4 sm:px-6 py-4 border-b last:border-b-0 border-pink-100 transition bg-pink-100 cursor-pointer hover:bg-pink-50 ${(selectedTab === 'All' ? selectedCombined[idx] : selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]) ? 'bg-pink-50' : 'opacity-60'}`}
                onClick={() => {
                    setModalData(c);
                  setModalOpen(true);
                }}
              >
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                      checked={selectedTab === 'All' ? selectedCombined[idx] : selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]}
                    onChange={e => { e.stopPropagation(); handleSelect(idx); }}
                      className="w-4 h-4 rounded border-2 border-pink-500 text-pink-600 focus:ring-pink-500 cursor-pointer transition-colors duration-200"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-7 flex items-center gap-4">
                    <img src={c.image || c.logo} alt={c.name} className="w-10 h-10 rounded-full border border-pink-200 object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-pink-900 text-base mb-1 flex items-center gap-2">
                        <span className="truncate">{c.name}</span>
                        {selectedTab === 'All' && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${c.type === 'project' ? 'bg-pink-100 text-pink-800' : 'bg-pink-200 text-pink-900'}`}>
                            {c.type === 'project' ? 'Project' : 'Campaign'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-pink-500 truncate">{c.desc || c.description}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-semibold text-pink-900">
                    {c.weightingScore !== undefined ? (c.weightingScore * 100).toFixed(2) + '%' : '-'}
                </div>
                  <div className="col-span-2 text-center font-semibold text-pink-900">
                    {c.overallScore !== undefined ? c.overallScore.toFixed(2) : '-'}
                </div>
                </div>
              ))}
              </div>

            {/* Fund button at the bottom */}
            <div className="flex justify-center sm:justify-end px-4 sm:px-6 py-4 bg-pink-100 border-t border-pink-200 flex-shrink-0">
              <button
                className={`flex items-center gap-2 px-6 py-3 sm:px-5 sm:py-2 rounded-xl text-base font-semibold shadow transition-all duration-150 w-full sm:w-auto justify-center ${selectedCount === 0 ? 'bg-pink-100 text-pink-300 cursor-not-allowed' : 'bg-pink-300 text-pink-900 hover:bg-pink-400'}`}
                disabled={selectedCount === 0}
                onClick={() => setShowFundingModal(true)}
              >
                Fund {selectedCount} {selectedTab === 'All' ? 'items' : selectedTab === 'Project' ? (selectedCount === 1 ? 'project' : 'projects') : (selectedCount === 1 ? 'campaign' : 'campaigns')} <span className="text-lg">&rarr;</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Funding Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pink-100 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-pink-300">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-pink-900">Setup Funding</h2>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-pink-400 hover:text-pink-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-pink-900 mb-3 sm:mb-4">Target Funding</h3>
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      className="flex-1 px-4 py-3 sm:py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-pink-900 text-base"
                    />
                    <select 
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="px-4 py-3 sm:py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-pink-900 text-base"
                    >
                      <option>NEAR</option>
                      <option>ETH</option>
                      <option>USDC</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handlePresetClick(amount)}
                        className={`px-3 sm:px-4 py-2 rounded-lg border transition text-sm sm:text-base ${
                          fundingAmount === amount 
                            ? 'bg-pink-600 text-white border-pink-600' 
                            : 'border-pink-200 text-pink-900 hover:bg-pink-50 bg-white'
                        }`}
                      >
                        ${amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={fundingAmount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-pink-400 mt-1">
                      <span>$100</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-pink-900 mb-3 sm:mb-4">Funding Strategy</h3>
                <div className="space-y-2 sm:space-y-3">
                  {FUND_METHODS.map((method) => (
                    <label key={method.key} className="flex items-start gap-3 p-3 sm:p-4 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer bg-white">
                      <input type="radio" name="strategy" className="w-4 h-4 text-pink-600 mt-1 flex-shrink-0" />
                      <div className="text-xl sm:text-2xl flex-shrink-0">{method.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-pink-900 text-sm sm:text-base">{method.title}</div>
                        <div className="text-xs sm:text-sm text-pink-400 mt-1">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-center sm:justify-end pt-2">
                <button
                  onClick={handleConfirmSetup}
                  disabled={isSettingUp}
                  className={`px-6 py-3 sm:py-2 rounded-lg text-white font-medium transition w-full sm:w-auto ${isSettingUp ? 'bg-pink-400' : 'bg-pink-600 hover:bg-pink-700'}`}
                >
                  {isSettingUp ? (
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting up...
                    </div>
                  ) : setupSuccess ? (
                    <div className="flex items-center gap-2 justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Setup Successful!
                    </div>
                  ) : (
                    'Confirm Setup'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for project/campaign details */}
      {modalOpen && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-pink-100 rounded-2xl shadow-lg border border-pink-300 max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 relative">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-3xl text-pink-400 hover:text-pink-600 p-1"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            
            {modalData.type === 'campaign' && modalData.cover_image_url && (
              <img 
                src={modalData.cover_image_url} 
                alt={`${modalData.name} cover image`}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <div className="flex items-start gap-3 sm:gap-4 mb-4 pr-8 sm:pr-0">
              <img src={modalData.image || modalData.recipient_image || modalData.logo} alt={modalData.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-pink-300 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-pink-900 flex items-center gap-2 mb-2">
                  <span className="truncate">{modalData.name}</span>
                </div>
                {/* Social/Campaign URLs */}
                {modalData.socialUrl && typeof modalData.socialUrl === 'object' && (
                  <div className="flex gap-2 mb-2">
                    {Object.entries(modalData.socialUrl).map(([type, url]) => (
                      typeof url === 'string' && url ? (
                        <a
                          key={type}
                          href={formatSocialUrl(type, url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 text-lg sm:text-xl p-1"
                          title={type.charAt(0).toUpperCase() + type.slice(1)}
                        >
                          {type === 'twitter' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        )}
                          {type === 'github' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"></path></svg>
                          )}
                          {type === 'website' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          )}
                          {type === 'telegram' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-telegram">
                              <path d="M22 2L11 13"/>
                              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                          </svg>
                        )}
                          {type !== 'twitter' && type !== 'github' && type !== 'website' && type !== 'telegram' && <span>{type.charAt(0).toUpperCase()}</span>}
                      </a>
                      ) : null
                    ))}
                  </div>
                )}
                {/* Campaign URL */}
                {modalData.campaignUrl && (
                  <div className="mt-2">
                    <a
                      href={modalData.campaignUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      title="View Campaign on Potlock"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-external-link">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      View Campaign
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 text-pink-800 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
              {modalData.description}
            </div>
            {modalData.type === 'campaign' && (
              <div className="bg-white rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 space-y-2">
                <div>
                  <div className="text-xs text-pink-400 font-semibold">OWNER</div>
                  <div className="text-sm text-pink-800 truncate">{modalData.owner}</div>
                </div>
                <div>
                  <div className="text-xs text-pink-400 font-semibold">RECIPIENT</div>
                  <div className="flex items-center gap-2 text-sm text-pink-800 truncate">
                    {modalData.recipient_image && (
                      <img src={modalData.recipient_image} alt="Recipient profile" className="w-7 h-7 rounded-full border border-pink-300 object-cover" />
                    )}
                    <span>{modalData.recipient}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-pink-900 text-base sm:text-lg">WEIGHTING</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-pink-200 bg-pink-50 text-pink-800 font-semibold text-base ml-2">
                  {modalData.weightingScore !== undefined ? (modalData.weightingScore * 100).toFixed(2) + '%' : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-pink-900 text-base sm:text-lg">SCORE</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-pink-200 bg-pink-50 text-pink-800 font-semibold text-base ml-2">
                  {modalData.overallScore !== undefined ? modalData.overallScore.toFixed(2) : '-'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
                <div className="rounded-xl border border-pink-200 p-3 sm:p-4 text-center">
                  <div className="text-xs text-pink-400 font-semibold mb-1">RELEVANCE</div>
                  <div className="text-lg sm:text-xl font-bold text-pink-900">{modalData.evaluationScores?.relevance !== undefined ? modalData.evaluationScores.relevance.toFixed(2) : '-'} /10</div>
                </div>
                <div className="rounded-xl border border-pink-200 p-3 sm:p-4 text-center">
                  <div className="text-xs text-pink-400 font-semibold mb-1">IMPACT</div>
                  <div className="text-lg sm:text-xl font-bold text-pink-900">{modalData.evaluationScores?.impact !== undefined ? modalData.evaluationScores.impact.toFixed(2) : '-'} /10</div>
                </div>
                <div className="rounded-xl border border-pink-200 p-3 sm:p-4 text-center">
                  <div className="text-xs text-pink-400 font-semibold mb-1">FUNDING NEEDS</div>
                  <div className="text-lg sm:text-xl font-bold text-pink-900">{modalData.evaluationScores?.funding !== undefined ? modalData.evaluationScores.funding.toFixed(2) : '-'} /10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soft background decorations */}
      <div className="absolute left-0 top-0 w-64 h-64 bg-indigo-900/20 rounded-full opacity-30 blur-2xl -z-10" />
      <div className="absolute right-0 top-32 w-40 h-40 bg-purple-900/20 rounded-full opacity-20 blur-2xl -z-10" />
      <div className="absolute left-1/2 bottom-0 w-80 h-32 bg-indigo-600/10 blur-3xl -z-10" />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 