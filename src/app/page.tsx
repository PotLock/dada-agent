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
  'Ethereum L2 ecosystem',
  'AI agents for good',
  'Account abstraction',
  'Academic research',
];

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    name: 'Protocol Guild',
    desc: 'Direct funding for Ethereum maintainers through a collective of core contributors enabling transparent support.',
    logo: 'https://pbs.twimg.com/profile_images/1511360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 31.87,
    score: 8.7,
  },
  {
    id: 2,
    name: 'MyFirstLayer2',
    desc: 'Aims to simplify Layer2 technology for beginners through educational resources.',
    logo: 'https://pbs.twimg.com/profile_images/1640738572342343680/1QwQnQwF_400x400.jpg',
    weighting: 24.91,
    score: 6.8,
  },
  {
    id: 3,
    name: 'Today in DeFi',
    desc: 'Daily educational news and analysis on DeFi, aiming to make web3 more accessible.',
    logo: 'https://pbs.twimg.com/profile_images/1411360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 23.81,
    score: 6.5,
  },
  {
    id: 4,
    name: 'Gator Labs',
    desc: 'Enhancing Ethereum security and usability with ERC 4337 account abstraction for smart contract wallets.',
    logo: 'https://pbs.twimg.com/profile_images/1421360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 19.41,
    score: 5.3,
  },
  {
    id: 5,
    name: 'Ethereum Cat Herders',
    desc: "Supporting Ethereum's evolution through protocol coordination, EIP support, and education.",
    logo: 'https://pbs.twimg.com/profile_images/1431360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 0.0,
    score: 8.5,
  },
  {
    id: 6,
    name: 'EIP-7265 Alliance - securing th...',
    desc: 'Contributor community advancing Ethereum through education, events, Hackerhouses, and more.',
    logo: 'https://pbs.twimg.com/profile_images/1441360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 0.0,
    score: 8.3,
  },
  {
    id: 7,
    name: 'EIPsInsight',
    desc: 'Data analytics tool for Ethereum Improvement Proposals.',
    logo: 'https://pbs.twimg.com/profile_images/1451360198572328961/2QwQnQwF_400x400.jpg',
    weighting: 0.0,
    score: 7.5,
  },
];

const NETWORKS = [
  { label: 'NEAR', icon: '🟩', logo: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#fff"/><path d="M9.5 22.5V9.5L22.5 22.5V9.5" stroke="#00DC82" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) },
  { label: 'Ethereum', icon: '🟦', logo: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#fff"/><path d="M16 6L16.2 6.6V21.6L16 22L15.8 21.6V6.6L16 6ZM16 22.8L24.8 17.2L16 26L7.2 17.2L16 22.8Z" fill="#627EEA"/></svg>
  ) },
];

const TABS = [
  { label: 'Project' },
  { label: 'Campaign' },
];

const MOCK_PROJECTS = [
  { ...MOCK_CAMPAIGNS[0], socials: [
    { type: 'website', url: 'https://protocolguild.org', icon: '🌐' },
    { type: 'twitter', url: 'https://twitter.com/protocolguild', icon: '🐦' },
    { type: 'github', url: 'https://github.com/protocolguild', icon: '💻' },
  ] },
  { ...MOCK_CAMPAIGNS[1], socials: [
    { type: 'website', url: 'https://myfirstlayer2.com', icon: '🌐' },
    { type: 'twitter', url: 'https://twitter.com/myfirstlayer2', icon: '🐦' },
  ] },
  { ...MOCK_CAMPAIGNS[2], socials: [
    { type: 'website', url: 'https://todayindefi.com', icon: '🌐' },
  ] },
  { ...MOCK_CAMPAIGNS[3], socials: [
    { type: 'website', url: 'https://gatorlabs.io', icon: '🌐' },
  ] },
];
const MOCK_CAMPAIGNS_LIST = [
  { ...MOCK_CAMPAIGNS[4], campaignUrl: 'https://catherders.com/campaign' },
  { ...MOCK_CAMPAIGNS[5], campaignUrl: 'https://eip7265alliance.org/campaign' },
  { ...MOCK_CAMPAIGNS[6], campaignUrl: 'https://eipsinsight.io/campaign' },
];

const MOCK_DETAILS: Record<number, {
  icons: string[];
  description: string;
  score: number;
  breakdown: {
    relevance: number;
    impact: number;
    funding: number;
  };
}> = {
  1: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/dna_1f9ec.png',
      'https://em-content.zobj.net/source/twitter/376/shield_1f6e1-fe0f.png',
    ],
    description: 'Direct funding for Ethereum maintainers through a collective of core contributors enabling transparent and community-sourced funding distribution for Ethereum infrastructure.',
    score: 8.7,
    breakdown: {
      relevance: 8.5,
      impact: 8.5,
      funding: 9.0,
    },
  },
  2: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/rocket_1f680.png',
    ],
    description: 'Aims to simplify Layer2 technology for beginners through educational resources.',
    score: 6.8,
    breakdown: {
      relevance: 7.0,
      impact: 6.5,
      funding: 7.0,
    },
  },
  3: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/newspaper_1f4f0.png',
    ],
    description: 'Daily educational news and analysis on DeFi, aiming to make web3 more accessible.',
    score: 6.5,
    breakdown: {
      relevance: 6.0,
      impact: 6.5,
      funding: 7.0,
    },
  },
  4: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/crocodile_1f40a.png',
    ],
    description: 'Enhancing Ethereum security and usability with ERC 4337 account abstraction for smart contract wallets.',
    score: 5.3,
    breakdown: {
      relevance: 5.0,
      impact: 5.5,
      funding: 5.5,
    },
  },
  5: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/cat_1f408.png',
    ],
    description: "Supporting Ethereum's evolution through protocol coordination, EIP support, and education.",
    score: 8.5,
    breakdown: {
      relevance: 8.0,
      impact: 8.5,
      funding: 9.0,
    },
  },
  6: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/hammer_1f528.png',
    ],
    description: 'Contributor community advancing Ethereum through education, events, Hackerhouses, and more.',
    score: 8.3,
    breakdown: {
      relevance: 8.0,
      impact: 8.0,
      funding: 9.0,
    },
  },
  7: {
    icons: [
      'https://em-content.zobj.net/source/twitter/376/chart-increasing_1f4c8.png',
    ],
    description: 'Data analytics tool for Ethereum Improvement Proposals.',
    score: 7.5,
    breakdown: {
      relevance: 7.0,
      impact: 7.5,
      funding: 8.0,
    },
  },
};

export default function Home() {
  const [goal, setGoal] = useState(25000);
  const [selectedMethod, setSelectedMethod] = useState('crowd');
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState(() => MOCK_PROJECTS.map(() => false));
  const [selectedCampaigns, setSelectedCampaigns] = useState(() => MOCK_CAMPAIGNS_LIST.map(() => false));
  const [weightings, setWeightings] = useState(() => MOCK_CAMPAIGNS.map(c => c.weighting));
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0].label);
  const [selectedTab, setSelectedTab] = useState(TABS[0].label);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof MOCK_PROJECTS[0] | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof MOCK_CAMPAIGNS_LIST[0] | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState('NEAR');

  // Add a useEffect to trigger search after search state update from idea buttons
  useEffect(() => {
    if (search && !isSearching && !showResults) {
      handleSearch();
    }
  }, [search, isSearching, showResults]);

  const selectedNetworkObj = NETWORKS.find(n => n.label === selectedNetwork);

  // Example NEAR conversion (replace with real API)
  const nearRate = 2.39;
  const nearAmount = (goal / nearRate).toFixed(2);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!search.trim()) {
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setShowResults(true);
    setSelectedProjects(MOCK_PROJECTS.map(() => false));
    setSelectedCampaigns(MOCK_CAMPAIGNS_LIST.map(() => false));
    setIsSearching(false);
  };

  const handleSelect = (idx: number) => {
    if (selectedTab === 'Project') {
      setSelectedProjects(sel => sel.map((v, i) => (i === idx ? !v : v)));
    } else {
      setSelectedCampaigns(sel => sel.map((v, i) => (i === idx ? !v : v)));
    }
  };

  const handleWeighting = (idx: number, value: number) => {
    setWeightings(ws => ws.map((w, i) => (i === idx ? value : w)));
  };

  // Helper for pluralization
  const selectedCount = selectedTab === 'Project' 
    ? selectedProjects.filter(Boolean).length 
    : selectedCampaigns.filter(Boolean).length;
  
  const allSelected = selectedTab === 'Project'
    ? selectedProjects.every(Boolean)
    : selectedCampaigns.every(Boolean);

  const handleSelectAll = () => {
    if (selectedTab === 'Project') {
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f8f6ff] to-[#f3f9fa]">
      {/* Hero Section */}
      <section className={`w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#e7eaff] to-transparent transition-all duration-700 ${showResults ? 'pt-12 pb-8' : 'h-screen'}`}>
        <div className={`flex flex-col items-center transition-all duration-700 ${showResults ? 'mt-0 scale-90' : 'mt-[-10vh] scale-100'}`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold text-center text-[#3a3a7c] mb-6 transition-all duration-700 ${showResults ? 'scale-90' : 'scale-100'}`}>
            Fund public goods like magic <span className="inline-block align-middle">✨</span>
          </h1>
          <form
            className={`w-full max-w-2xl flex items-center bg-white/90 rounded-full shadow-lg px-6 py-2.5 mb-4 border border-blue-100 transition-all duration-700 ${showResults ? 'scale-90' : 'scale-100'}`}
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-lg md:text-xl placeholder:text-blue-300"
              placeholder="What would you like to fund?"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`ml-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-2xl transition ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
              aria-label="Search"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <div className={`w-full max-w-2xl flex flex-wrap gap-2 justify-center items-center transition-all duration-700 ${showResults ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
              <span className="text-base text-blue-700 font-medium mr-2">Some ideas:</span>
              {SUGGESTIONS.map((idea, idx) => (
                <button
                  key={idea}
                  className="bg-blue-500/90 hover:bg-blue-600 text-white rounded-full px-4 py-1.5 text-sm font-semibold shadow transition"
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
        <section className={`w-full max-w-3xl mx-auto mt-4 transition-all duration-700`}>
          <div className={`mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-lg font-semibold text-blue-900">Results for <span className="font-bold">{search}</span></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex rounded-full bg-blue-50 p-1 border border-blue-100">
                  {TABS.map(tab => (
                    <button
                      key={tab.label}
                      className={`px-4 py-1 rounded-full font-semibold text-sm transition-all duration-150 ${selectedTab === tab.label ? 'bg-white text-blue-700 shadow' : 'text-blue-400 hover:text-blue-700'}`}
                      onClick={() => setSelectedTab(tab.label as 'project' | 'campaign')}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={`mb-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-blue-900 text-base transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            Take a moment to review the allocation strategy and make adjustments before moving forward with your donation. Be sure to select projects and campaigns that align with your funding goals.
          </div>
          <div className={`bg-white/90 rounded-2xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="grid grid-cols-12 items-center px-6 py-3 border-b border-blue-100 text-xs font-semibold text-blue-700">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-2 border-blue-200 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                />
                <span>{selectedTab === 'Project' ? 'PROJECT' : 'CAMPAIGN'}</span>
              </div>
              <div className="col-span-7"></div>
              <div className="col-span-2 text-center">WEIGHTING</div>
              <div className="col-span-2 text-center">SCORE</div>
            </div>
            {(selectedTab === 'Project' ? MOCK_PROJECTS : MOCK_CAMPAIGNS_LIST).map((c, idx) => (
              <div
                key={c.id}
                className={`grid grid-cols-12 items-center px-6 py-4 border-b last:border-b-0 border-blue-50 transition bg-white cursor-pointer ${(selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]) ? '' : 'opacity-60'}`}
                onClick={() => {
                  setModalData({
                    ...c,
                    ...MOCK_DETAILS[c.id],
                  });
                  setModalOpen(true);
                }}
              >
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedTab === 'Project' ? selectedProjects[idx] : selectedCampaigns[idx]}
                    onChange={e => { e.stopPropagation(); handleSelect(idx); }}
                    className="w-4 h-4 rounded border-2 border-blue-200 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-7 flex items-center gap-4">
                  <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-full border border-blue-100 object-cover" />
                  <div>
                    <div className="font-bold text-blue-900 text-base mb-1">{c.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{c.desc}</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={weightings[idx]}
                    onChange={e => handleWeighting(idx, Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-md border border-blue-200 text-blue-900 text-sm text-center bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={selectedTab === 'Project' ? !selectedProjects[idx] : !selectedCampaigns[idx]}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-blue-700 font-semibold">%</span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <span className={`font-bold text-lg ${c.score >= 8 ? 'text-green-500' : c.score >= 6 ? 'text-yellow-500' : 'text-orange-500'}`}>{c.score}</span>
                  <span className="text-gray-400">&gt;</span>
                </div>
              </div>
            ))}
            {/* Fund button at the bottom */}
            <div className="flex justify-end px-6 py-4 bg-white border-t border-blue-100">
              <button
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-base font-semibold shadow transition-all duration-150 ${selectedCount === 0 ? 'bg-blue-200 text-white cursor-not-allowed' : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'}`}
                style={{ minWidth: 120 }}
                disabled={selectedCount === 0}
                onClick={() => setShowFundingModal(true)}
              >
                Fund {selectedCount} {selectedTab === 'Project' ? (selectedCount === 1 ? 'project' : 'projects') : (selectedCount === 1 ? 'campaign' : 'campaigns')} <span className="text-lg">&rarr;</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Funding Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Setup Funding</h2>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Target Funding</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select 
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className={`px-4 py-2 rounded-lg border transition ${
                          fundingAmount === amount 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
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
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$100</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Funding Strategy</h3>
                <div className="space-y-3">
                  {FUND_METHODS.map((method) => (
                    <label key={method.key} className="flex items-center gap-3 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <input type="radio" name="strategy" className="w-4 h-4 text-blue-600" />
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <div className="font-medium text-blue-900">{method.title}</div>
                        <div className="text-sm text-gray-500">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleConfirmSetup}
                  disabled={isSettingUp}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                    isSettingUp ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSettingUp ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting up...
                    </div>
                  ) : setupSuccess ? (
                    <div className="flex items-center gap-2">
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              className="absolute top-4 right-4 text-3xl text-blue-500 hover:text-blue-700"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img src={modalData.logo} alt={modalData.name} className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover" />
              <div>
                <div className="text-2xl font-bold text-blue-900 flex items-center gap-2">{modalData.name}</div>
                {/* Social/Campaign URLs */}
                {selectedTab === 'Project' && modalData.socials && (
                  <div className="flex gap-3 mt-2">
                    {modalData.socials.map((s: any, i: number) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xl" title={s.type}>
                        {s.type === 'website' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe">
                            <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                        )}
                        {s.type === 'twitter' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                          </svg>
                        )}
                        {s.type === 'github' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M29.3444 30.4767C31.7481 29.9771 33.9292 29.1109 35.6247 27.8393C38.5202 25.6677 40 22.3137 40 19C40 16.6754 39.1187 14.5051 37.5929 12.6669C36.7427 11.6426 39.2295 4.00001 37.02 5.02931C34.8105 6.05861 31.5708 8.33691 29.8726 7.8341C28.0545 7.29577 26.0733 7.00001 24 7.00001C22.1992 7.00001 20.4679 7.22313 18.8526 7.63452C16.5046 8.23249 14.2591 6.00001 12 5.02931C9.74086 4.05861 10.9736 11.9633 10.3026 12.7946C8.84119 14.6052 8 16.7289 8 19C8 22.3137 9.79086 25.6677 12.6863 27.8393C14.6151 29.2858 17.034 30.2077 19.7401 30.6621"/>
                            <path d="M19.7402 30.662C18.5817 31.9372 18.0024 33.148 18.0024 34.2946C18.0024 35.4411 18.0024 38.3465 18.0024 43.0108"/>
                            <path d="M29.3443 30.4767C30.4421 31.9175 30.991 33.2112 30.991 34.3577C30.991 35.5043 30.991 38.3886 30.991 43.0108"/>
                            <path d="M6 31.2156C6.89887 31.3255 7.56554 31.7388 8 32.4555C8.65169 33.5304 11.0742 37.5181 13.8251 37.5181C15.6591 37.5181 17.0515 37.5181 18.0024 37.5181"/>
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                )}
                {selectedTab === 'Campaign' && modalData.campaignUrl && (
                  <div className="mt-2">
                    <a href={modalData.campaignUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline font-medium text-base">
                      View Campaign ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-blue-50/60 rounded-xl p-4 text-blue-900 text-base mb-6">
              {modalData.description}
            </div>
            <div className="bg-blue-50/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-blue-900 text-lg">Score</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold text-base ml-2">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12l6 6L20 6" /></svg>
                  {modalData.score}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="rounded-xl border border-blue-200 p-4 text-center">
                  <div className="text-xs text-blue-400 font-semibold mb-1">RELEVANCE</div>
                  <div className="text-xl font-bold text-blue-900">{modalData.breakdown?.relevance?.toFixed(2)}/10</div>
                </div>
                <div className="rounded-xl border border-blue-200 p-4 text-center">
                  <div className="text-xs text-blue-400 font-semibold mb-1">IMPACT</div>
                  <div className="text-xl font-bold text-blue-900">{modalData.breakdown?.impact?.toFixed(2)}/10</div>
                </div>
                <div className="rounded-xl border border-blue-200 p-4 text-center">
                  <div className="text-xs text-blue-400 font-semibold mb-1">FUNDING NEEDS</div>
                  <div className="text-xl font-bold text-blue-900">{modalData.breakdown?.funding?.toFixed(2)}/10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soft background decorations */}
      <div className="absolute left-0 top-0 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-2xl -z-10" />
      <div className="absolute right-0 top-32 w-40 h-40 bg-pink-100 rounded-full opacity-20 blur-2xl -z-10" />
      <div className="absolute left-1/2 bottom-0 w-80 h-32 bg-primary opacity-10 blur-3xl -z-10" />

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