# 🧠 Dada Agent - Intelligent Funding Platform

A sophisticated AI-powered funding platform that intelligently matches donors with impactful projects and campaigns on the NEAR blockchain. The platform uses advanced search algorithms, vector similarity, and LLM-based evaluation to provide personalized funding recommendations.

## 🚀 Features

### Core Functionality
- **🔍 Intelligent Search**: Vector similarity search across projects and campaigns
- **🤖 AI-Powered Evaluation**: LLM-based relevance scoring and holistic evaluation
- **📊 Smart Ranking**: Hybrid ranking combining similarity scores and AI evaluation
- **🎯 Personalized Recommendations**: Weighted allocation based on user preferences
- **🌐 Multi-Platform Integration**: Support for projects and campaigns from Potlock ecosystem

### Search & Discovery
- **Unified Search**: Search across both projects and campaigns simultaneously
- **Tabbed Interface**: View "All", "Projects", or "Campaigns" separately
- **Real-time Results**: Live data fetching from NEAR smart contracts
- **Rich Metadata**: Display images, descriptions, social links, and evaluation scores

### Evaluation System
- **Relevance Scoring**: AI evaluation of query relevance (0-10 scale)
- **Impact Assessment**: Evaluation of project/campaign potential impact
- **Funding Needs Analysis**: Assessment of funding requirements and urgency
- **Holistic Reports**: Comprehensive evaluation reports for each item

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local state
- **UI Components**: Custom components with responsive design
- **Icons**: Feather Icons for consistent iconography

### Backend & AI
- **Search Engine**: LangChain MemoryVectorStore for vector similarity search
- **Embeddings**: OpenAI text-embedding-ada-002 for semantic search
- **LLM Integration**: OpenAI GPT-3.5-turbo for evaluation and ranking
- **API Routes**: Next.js API routes for search functionality

### Blockchain Integration
- **NEAR Protocol**: Direct integration with NEAR blockchain
- **Smart Contracts**: 
  - Potlock Projects Contract (`v1.social08.near`)
  - Potlock Campaigns Contract (`v1.campaigns.staging.potlock.near`)
- **Data Fetching**: Real-time data from NEAR RPC endpoints
- **Profile Enrichment**: Integration with `social.near` for project metadata

### Search Pipeline
1. **Data Ingestion**: Fetch projects and campaigns from smart contracts
2. **Vector Embedding**: Convert text content to vector embeddings
3. **Similarity Search**: Find relevant items using vector similarity
4. **LLM Reranking**: Use GPT-3.5-turbo to rerank results by relevance
5. **Holistic Evaluation**: Generate comprehensive evaluation reports
6. **Scoring**: Assign scores for relevance, impact, and funding needs
7. **Weighted Allocation**: Calculate allocation percentages based on scores

## 🔧 Implementation Details

### Search Algorithm
```typescript
// Hybrid search combining vector similarity and LLM evaluation
const searchPipeline = async (query: string) => {
  // 1. Vector similarity search
  const vectorResults = await vectorStore.similaritySearch(query, topK);
  
  // 2. LLM reranking
  const rerankedResults = await rerankWithOpenAI(query, vectorResults);
  
  // 3. Holistic evaluation
  const evaluations = await Promise.all(
    rerankedResults.map(result => generateEvaluationReport(query, result))
  );
  
  // 4. Scoring and allocation
  const scoredResults = await Promise.all(
    evaluations.map(evaluation => scoreEvaluationReport(evaluation))
  );
  
  return scoredResults;
};
```

### Data Processing
- **Project Data**: Enriched with profile information from `social.near`
- **Campaign Data**: Direct from Potlock campaigns contract
- **Image Handling**: IPFS integration for project logos and images
- **Social Links**: Automatic URL formatting for various platforms

### URL Formatting
The platform automatically formats social media URLs:
- **Twitter/X**: `https://x.com/{username}`
- **GitHub**: `https://github.com/{username}`
- **Telegram**: `https://t.me/{username}`
- **Discord**: `https://discord.gg/{invite}`
- **LinkedIn**: `https://www.linkedin.com/in/{profile}`
- **Website**: `https://{domain}`

## 📁 Project Structure

```
dada-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── search/
│   │   │       └── route.ts          # Search API endpoint
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main search interface
│   ├── components/
│   │   ├── Footer.tsx                # Footer component
│   │   └── Header.tsx                # Header component
│   └── contexts/
│       └── WalletSelectorContext.tsx # NEAR wallet integration
├── package.json                      # Dependencies and scripts
├── tailwind.config.js               # Tailwind configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NEAR account (for blockchain interactions)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dada-agent.git
   cd dada-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key and other environment variables
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
NEAR_NETWORK_ID=testnet
NEAR_NODE_URL=https://rpc.testnet.near.org
```

## 🔍 Usage

### Search Interface
1. **Enter your funding interests** in the search bar
2. **Browse results** across the "All", "Projects", and "Campaigns" tabs
3. **Review evaluation scores** for relevance, impact, and funding needs
4. **Select items** you want to fund
5. **Configure funding** amount and strategy
6. **Execute donations** through the funding modal

### Search Features
- **Real-time search**: Results update as you type
- **Smart suggestions**: Pre-defined search suggestions for common interests
- **Rich results**: View images, descriptions, social links, and evaluation scores
- **Campaign URLs**: Direct links to campaign pages on Potlock platform

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Key Components

#### Search API (`/api/search`)
- **Vector similarity search** using LangChain
- **LLM-based reranking** with OpenAI GPT-3.5-turbo
- **Holistic evaluation** with comprehensive scoring
- **Real-time data fetching** from NEAR smart contracts

#### Main Interface (`page.tsx`)
- **Responsive design** with Tailwind CSS
- **Tabbed interface** for different result types
- **Modal system** for detailed item views
- **Funding workflow** with amount selection and strategy

#### Data Processing
- **Project enrichment** with social.near integration
- **Campaign data** from Potlock contracts
- **Image handling** with IPFS integration
- **Social link formatting** for various platforms

## 🔮 Future Enhancements

### Planned Features
- **Advanced filtering** by category, funding amount, and impact area
- **User preferences** and personalized recommendations
- **Donation history** and tracking
- **Social features** for sharing and collaboration
- **Analytics dashboard** for funding impact

### Technical Improvements
- **Caching layer** for improved performance
- **Real-time updates** for live data
- **Advanced AI models** for better evaluation
- **Multi-chain support** for other blockchains
- **Mobile app** for on-the-go funding

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NEAR Protocol** for blockchain infrastructure
- **Potlock** for campaign and project data
- **OpenAI** for AI capabilities
- **LangChain** for vector search functionality
- **Tailwind CSS** for styling framework

---

Built with ❤️ for the NEAR ecosystem 