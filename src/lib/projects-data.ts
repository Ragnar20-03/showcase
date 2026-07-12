export type ProjectCategory = "web3" | "fullstack" | "ai";

export type Project = {
  name: string;
  description: string;
  github: string;
  tech: string[];
  category: ProjectCategory;
  highlight?: string;
};

export const CATEGORIES: ProjectCategory[] = ["web3", "fullstack", "ai"];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI / ML",
  web3: "Web3 / Blockchain",
  fullstack: "Full Stack",
};

export const defaultProjects: Project[] = [
  {
    name: "Decentralized Exchange",
    description: "A full DEX for Solana tokens — swap, liquidity pools, and on-chain order book.",
    github: "https://github.com/Ragnar20-03/decentralized-exhange",
    tech: ["TypeScript", "Solana", "React", "Anchor"],
    category: "web3",
    highlight: "DeFi",
  },
  {
    name: "On-Chain TicTacToe",
    description: "Fully on-chain TicTacToe game on Solana. Game state lives on the blockchain.",
    github: "https://github.com/Ragnar20-03/on-chain-ox",
    tech: ["TypeScript", "Solana", "Anchor", "React"],
    category: "web3",
    highlight: "On-Chain",
  },
  {
    name: "EduCred",
    description: "Reputation coin system for education — earn tokens for learning achievements.",
    github: "https://github.com/Ragnar20-03/educred",
    tech: ["TypeScript", "Blockchain", "React", "Node.js"],
    category: "web3",
    highlight: "EdTech",
  },
  {
    name: "Solana Token Launchpad",
    description: "Launch your own SPL tokens on Solana with this no-code launchpad interface.",
    github: "https://github.com/Ragnar20-03/solana-token-launchpad",
    tech: ["TypeScript", "Solana", "Web3.js", "React"],
    category: "web3",
  },
  {
    name: "SOL Faucet",
    description: "Airdrop SOL tokens to devnet/testnet wallets. Built for Solana developers.",
    github: "https://github.com/Ragnar20-03/web3_sol_faucet",
    tech: ["TypeScript", "Solana", "React"],
    category: "web3",
  },
  {
    name: "Solana Donate",
    description: "Anyone can donate SOL to a wallet address — on-chain crowdfunding made simple.",
    github: "https://github.com/Ragnar20-03/solana-donate",
    tech: ["TypeScript", "Solana", "React"],
    category: "web3",
  },
  {
    name: "Whisper",
    description: "Real-time chat application with WebSocket, rooms, and message persistence.",
    github: "https://github.com/Ragnar20-03/Whisper",
    tech: ["TypeScript", "WebSocket", "Node.js", "React"],
    category: "fullstack",
    highlight: "Real-time",
  },
  {
    name: "Minimi",
    description: "A social media platform — posts, follows, likes, feed algorithm.",
    github: "https://github.com/Ragnar20-03/Minimi",
    tech: ["JavaScript", "Node.js", "MongoDB", "React"],
    category: "fullstack",
    highlight: "Social",
  },
  {
    name: "Chess.com Replica",
    description: "Online multiplayer chess — real-time moves via WebSocket, full chess logic.",
    github: "https://github.com/Ragnar20-03/Chess.com",
    tech: ["TypeScript", "WebSocket", "React", "Node.js"],
    category: "fullstack",
    highlight: "WebSocket",
  },
  {
    name: "Omegle Clone",
    description: "Random video chat using WebRTC — peer-to-peer video calls between strangers.",
    github: "https://github.com/Ragnar20-03/Omegle",
    tech: ["TypeScript", "WebRTC", "Node.js", "React"],
    category: "fullstack",
    highlight: "WebRTC",
  },
  {
    name: "GarageKeeperX",
    description: "Full-stack garage management platform — bookings, inventory, and billing.",
    github: "https://github.com/Ragnar20-03/GarageKeeperX",
    tech: ["TypeScript", "Next.js", "Node.js", "MongoDB"],
    category: "fullstack",
  },
  {
    name: "SpotLight",
    description: "The musician app — artists showcase their work, fans discover local talent.",
    github: "https://github.com/Ragnar20-03/SpotLight-The-Musician-App",
    tech: ["TypeScript", "React", "Node.js"],
    category: "fullstack",
  },
  {
    name: "Product Recommendation AI",
    description: "ML-based product recommendation system using collaborative filtering.",
    github: "https://github.com/Ragnar20-03/Product-Recommendation-System",
    tech: ["Python", "Jupyter", "Pandas", "Scikit-learn"],
    category: "ai",
    highlight: "ML",
  },
  {
    name: "Worker Safety App",
    description: "AI-powered worker safety monitoring app with real-time alerts.",
    github: "https://github.com/Ragnar20-03/Worker_Saftey_App",
    tech: ["TypeScript", "React Native", "Node.js"],
    category: "ai",
    highlight: "Safety AI",
  },
  {
    name: "PDF Chat Assistant",
    description: "RAG pipeline for chatting with PDFs — chunking, vector search, and citations.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/01_pdf_chat",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
    highlight: "RAG",
  },
  {
    name: "Website RAG",
    description: "RAG over live websites — BFS crawling, scraping, and HTML cleaning.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/02_website_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "Multi-Doc Knowledge Base",
    description: "RAG across multiple file types with metadata filtering and document management.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/03_multi_doc_kb",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "Hybrid Search RAG",
    description: "Combines BM25 keyword search with vector search via RRF merging and cross-encoder reranking.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/04_hybrid_search",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
    highlight: "Hybrid",
  },
  {
    name: "GitHub Codebase RAG",
    description: "RAG over codebases — AST-aware code chunking and repo ingestion.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/05_github_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "SQL + RAG",
    description: "Text-to-SQL combined with hybrid structured and unstructured retrieval.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/06_sql_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "Multimodal RAG",
    description: "RAG with vision models — image understanding and PDF visual extraction.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/07_multimodal_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "Knowledge Graph RAG",
    description: "Entity extraction and graph traversal fused with vector retrieval.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/08_knowledge_graph_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
  },
  {
    name: "Agentic RAG",
    description: "ReAct-pattern agent with tool calling and dynamic multi-step reasoning over retrieved data.",
    github: "https://github.com/Ragnar20-03/rag_mastery/tree/main/09_agentic_rag",
    tech: ["Python", "Ollama", "ChromaDB", "LangChain"],
    category: "ai",
    highlight: "Agentic",
  },
];
