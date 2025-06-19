import { NextResponse } from 'next/server';
import { SocialLink } from '@/app/page';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from "@langchain/core/documents";
import { providers } from 'near-api-js';
import OpenAI from 'openai';

const REGISTRY_CONTRACT_ID = 'registry.potlock.near';
const SOCIAL_CONTRACT_ID = 'social.near';
const provider = new providers.JsonRpcProvider({ url: 'https://rpc.fastnear.com' });

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-ada-002"
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let projectsVectorStore: MemoryVectorStore | null = null;
let campaignsVectorStore: MemoryVectorStore | null = null;

// Utility: Fetch project data from smart contract and convert to Document[]
async function getProjectDocumentsFromContract(): Promise<Document[]> {
  const projectList: any[] = [];
  let from_index = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    const accountList = await provider.query({
      request_type: "call_function",
      account_id: REGISTRY_CONTRACT_ID,
      method_name: "get_projects",
      args_base64: Buffer.from(JSON.stringify({ from_index, limit })).toString("base64"),
      finality: "optimistic",
    }) as any;
    const projectObject = JSON.parse(Buffer.from(accountList.result).toString());
    const projects = Object.values(projectObject);

    // For each approved project, fetch profile data from social.near
    const enrichedProjects = await Promise.all(projects.map(async (project: any, index: number) => {
      if (project.status !== "Approved") return null;
      try {
        const projectDetail = await provider.query({
          request_type: "call_function",
          account_id: SOCIAL_CONTRACT_ID,
          method_name: "get",
          args_base64: Buffer.from(JSON.stringify({ "keys": [`${project.id}/profile/**`] })).toString("base64"),
          finality: "optimistic",
        }) as any;
        const dataProjectJson = JSON.parse(Buffer.from(projectDetail.result).toString());
        const key = Object.keys(dataProjectJson)[0];
        const item = Object.values(dataProjectJson)[0] as any;

        return {
          accountId: project.id,
          projectId: project.id,
          category: item.profile?.category?.text
            ? [item.profile.category.text]
            : item.profile?.category
              ? [item.profile.category]
              : (item.profile?.plCategories ? JSON.parse(item.profile.plCategories) : []),
          name: item.profile?.name || '',
          description: item.profile?.description || '',
          tagline: item.profile?.tagline || '',
          socialUrl: item.profile?.linktree || {},
          website: item.profile?.website || '',
          tags: Object.keys(item.profile?.tags || {}),
          url: `https://app.potlock.org/?tab=project&projectId=${project.id}`,
          status: project.status,
          image: item.profile?.image && item.profile.image.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${item.profile.image.ipfs_cid}`
            : '',
        };
      } catch (e) {
        // If profile fetch fails, skip this project
        return null;
      }
    }));

    // Only keep valid, enriched projects
    projectList.push(...enrichedProjects.filter(Boolean));
    from_index += projects.length;
    hasMore = projects.length === limit;
  }

  // Build Document objects
  return projectList
    .filter((project) => project && project.accountId)
    .map((project) => {
      const image = project.image
        ? project.image
        : (project.profile && project.profile.image && project.profile.image.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${project.profile.image.ipfs_cid}`
            : '');
      const pageContent = [
        typeof project.name === 'string' ? project.name : '',
        typeof project.description === 'string' ? project.description : '',
        typeof project.tagline === 'string' ? project.tagline : '',
        Array.isArray(project.tags) ? project.tags.join(' ') : '',
        typeof project.website === 'string' ? project.website : '',
        project.socialUrl && typeof project.socialUrl === 'object'
          ? Object.values(project.socialUrl).filter(Boolean).join(' ')
          : ''
      ].filter(Boolean).join('. ');
      const metadata = {
        ...project,
        image,
        source: `https://app.potlock.org/?tab=project&projectId=${project.accountId}`,
      };
      return new Document({ pageContent, metadata });
    });
}

async function getCampaignDocumentsFromContract(): Promise<Document[]> {
  const CAMPAIGN_CONTRACT_ID = 'v1.campaigns.staging.potlock.near';
  const campaignList: any[] = [];
  let from_index = 0;
  const limit = 50;
  let hasMore = true;

  console.log('Fetching campaigns from contract:', CAMPAIGN_CONTRACT_ID);

  while (hasMore) {
    const result = await provider.query({
      request_type: "call_function",
      account_id: CAMPAIGN_CONTRACT_ID,
      method_name: "get_campaigns",
      args_base64: Buffer.from(JSON.stringify({ from_index, limit })).toString("base64"),
      finality: "optimistic",
    }) as any;
    const campaigns = JSON.parse(Buffer.from(result.result).toString());
    console.log(`Fetched ${campaigns.length} campaigns from index ${from_index}`);
    campaignList.push(...campaigns);
    from_index += campaigns.length;
    hasMore = campaigns.length === limit;
  }

  console.log(`Total campaigns fetched: ${campaignList.length}`);

  // Build Document objects for each campaign
  return campaignList.map((campaign) => {
    const pageContent = [
      typeof campaign.name === 'string' ? campaign.name : '',
      typeof campaign.description === 'string' ? campaign.description : '',
      typeof campaign.recipient === 'string' ? campaign.recipient : '',
      typeof campaign.cover_image_url === 'string' ? campaign.cover_image_url : '',
      typeof campaign.target_amount === 'string' ? `Target: ${campaign.target_amount}` : '',
      typeof campaign.total_raised_amount === 'string' ? `Raised: ${campaign.total_raised_amount}` : '',
    ].filter(Boolean).join('. ');
    return new Document({
      pageContent,
      metadata: { 
        ...campaign,
        campaignUrl: `https://staging.alpha.potlock.org/campaign/${campaign.id}`
      }
    });
  });
}

async function ensureVectorStoresLoaded() {
  if (!projectsVectorStore || !campaignsVectorStore) {
    try {
      // Load projects data from smart contract
      let projectDocuments: Document[] = [];
      try {
        projectDocuments = await getProjectDocumentsFromContract();
        console.log(`Loaded ${projectDocuments.length} project documents`);
      } catch (err: any) {
        console.error('Error loading project documents:', err);
        projectDocuments = [];
      }
      projectsVectorStore = await MemoryVectorStore.fromDocuments(projectDocuments, embeddings);

      // Load campaigns data from smart contract
      let campaignDocuments: Document[] = [];
      try {
        campaignDocuments = await getCampaignDocumentsFromContract();
        console.log(`Loaded ${campaignDocuments.length} campaign documents`);
      } catch (err: any) {
        console.error('Error loading campaign documents:', err);
        campaignDocuments = [];
      }
      campaignsVectorStore = await MemoryVectorStore.fromDocuments(campaignDocuments, embeddings);

      console.log("Loaded vector stores for search");
      console.log(`Projects vector store: ${projectDocuments.length} documents`);
      console.log(`Campaigns vector store: ${campaignDocuments.length} documents`);
    } catch (error) {
      console.error("Error loading vector stores for search:", error);
      throw new Error("Vector stores not initialized and could not be created.");
    }
  }
}

// Define the structure of the metadata stored in the vector store
interface SearchResultMetadata {
  id: number;
  name: string;
  desc: string;
  score: number;
  type: 'project' | 'campaign';
  logo: string;
  weighting: number;
  socials?: SocialLink[];
  campaignUrl?: string;
}

// Define the full result structure including hybrid scores
interface HybridProjectResult extends SearchResultMetadata {
  finalScore: number;
  similarityScore: number;
  rankScore: number;
  type: 'project';
}

interface HybridCampaignResult extends SearchResultMetadata {
  finalScore: number;
  similarityScore: number;
  rankScore: number;
  type: 'campaign';
}

type HybridSearchResult = HybridProjectResult | HybridCampaignResult;

async function rerankWithOpenAI(query: string, docs: { pageContent: string }[]): Promise<number[]> {
  const scores: number[] = [];
  for (const doc of docs) {
    const prompt = `
Query: ${query}
Document: ${doc.pageContent}
Rate the relevance of the document to the query on a scale of 0 (irrelevant) to 10 (highly relevant). Only respond with the integer score.`.trim();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a language model designed to evaluate the relevance of documents to a query. Only respond with an integer from 0 to 10." },
        { role: "user", content: prompt }
      ],
      max_tokens: 5,
      temperature: 0,
    });
    const scoreText = completion.choices[0].message?.content?.trim() || "0";
    const score = parseInt(scoreText, 10);
    scores.push(isNaN(score) ? 0 : score);
  }
  return scores;
}

// Utility: Generate holistic evaluation report for a project
async function generateEvaluationReport(query: string, project: { pageContent: string }) {
  const prompt = `Given the following project description, generate a report with three sections:\n
a) Relevance to the query: "${query}"
b) Impact: What is the potential or demonstrated impact of this project?
c) Funding Needs: What are the project's funding needs and why?\n\nProject: ${project.pageContent}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an expert project evaluator. Write a clear, concise report for each project." },
      { role: "user", content: prompt }
    ],
    max_tokens: 512,
    temperature: 0.2,
  });
  return completion.choices[0].message?.content?.trim() || '';
}

// Utility: Score a report (0-10 for each criterion)
async function scoreEvaluationReport(report: string) {
  const prompt = `Given the following project evaluation report, assign a score from 0-10 for each of the following:\na) Relevance\nb) Impact\nc) Funding Needs\nOnly respond with three numbers separated by commas.\nReport: ${report}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a project evaluation scoring assistant. Only respond with three integers separated by commas." },
      { role: "user", content: prompt }
    ],
    max_tokens: 10,
    temperature: 0,
  });
  const scoreText = completion.choices[0].message?.content?.trim() || '0,0,0';
  const [relevance, impact, funding] = scoreText.split(',').map(s => parseInt(s, 10));
  return {
    relevance: isNaN(relevance) ? 0 : relevance,
    impact: isNaN(impact) ? 0 : impact,
    funding: isNaN(funding) ? 0 : funding,
  };
}

export async function GET(request: Request) {
  try {
    await ensureVectorStoresLoaded();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const topK = parseInt(searchParams.get('topK') || '10');
    const similarityWeight = parseFloat(searchParams.get('similarityWeight') || '0.7');
    const rankWeight = parseFloat(searchParams.get('rankWeight') || '0.3');
    const type = searchParams.get('type') || 'all';

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    let projectResults: [Document, number][] = [];
    let campaignResults: [Document, number][] = [];

    if (type === 'all' || type === 'project') {
      projectResults = await projectsVectorStore!.similaritySearchWithScore(query, topK);
      console.log(`Project search returned ${projectResults.length} results`);
    }
    if (type === 'all' || type === 'campaign') {
      campaignResults = await campaignsVectorStore!.similaritySearchWithScore(query, topK);
      console.log(`Campaign search returned ${campaignResults.length} results`);
    }

    // Combine and flatten results, add rerankScore type
    type RerankResult = { doc: Document, distance: number, type: string, rerankScore?: number };
    const allResults: RerankResult[] = [
      ...projectResults.map(([doc, distance]) => ({ doc, distance, type: 'project' })),
      ...campaignResults.map(([doc, distance]) => ({ doc, distance, type: 'campaign' })),
    ];

    console.log(`Total combined results: ${allResults.length} (${projectResults.length} projects, ${campaignResults.length} campaigns)`);

    // Rerank with OpenAI
    const rerankScores = await rerankWithOpenAI(query, allResults.map(r => r.doc));
    allResults.forEach((r, i) => { r.rerankScore = rerankScores[i]; });

    // Sort by rerankScore (descending)
    const sortedResults = allResults.sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0));
    const topResults = sortedResults.slice(0, topK);

    // Holistic evaluation: generate report and score for each top project
    const holisticEvaluations = await Promise.all(topResults.map(async (r) => {
      const metadata = r.doc.metadata as any;
      const similarityScore = 1 - r.distance;
      const weightingScore = (similarityWeight * similarityScore) + (rankWeight * (r.rerankScore ?? 0) / 10);
      // Generate report
      const report = await generateEvaluationReport(query, r.doc);
      // Score report
      const scores = await scoreEvaluationReport(report);
      // Compute overall score (weighted average, you can adjust weights)
      const overallScore = (scores.relevance + scores.impact + scores.funding) / 3;
      return {
        ...metadata,
        rerankScore: r.rerankScore,
        similarityScore,
        weightingScore,
        type: r.type,
        report,
        evaluationScores: scores,
        overallScore,
      };
    }));

    // Compute allocation percentages
    const totalScore = holisticEvaluations.reduce((sum, e) => sum + e.overallScore, 0) || 1;
    const withAllocations = holisticEvaluations.map(e => ({
      ...e,
      allocation: e.overallScore / totalScore
    }));

    return NextResponse.json({
      results: withAllocations,
    });
  } catch (err: any) {
    console.error('Error searching data:', err);
    return NextResponse.json({ error: err.message || 'Error searching data' }, { status: 500 });
  }
} 