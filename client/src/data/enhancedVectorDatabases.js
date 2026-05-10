export const enhancedVectorDatabases = {
  id: 'vector-databases',
  title: 'Vector Databases',
  subtitle: 'How Embeddings Are Stored, Indexed, and Searched at Scale',
  summary: 'A vector database stores high-dimensional vector embeddings and enables fast similarity search. It is the backbone of every RAG system, semantic search engine, and recommendation system built on top of LLMs.',
  analogy: 'A traditional database is like a filing cabinet — you find things by exact label. A vector database is like a library where books are arranged by topic similarity — you walk in asking for "something about space exploration" and it points you to the closest shelf, even if no book is titled exactly that.',

  explanation: `WHAT IS A VECTOR DATABASE?

A vector database is a specialized database designed to store, index, and query high-dimensional vectors (embeddings). Unlike traditional databases that match exact values, vector databases find the most semantically similar items using distance metrics.

WHY VECTORS?

When you pass text, images, or audio through an embedding model, you get a dense numerical vector (e.g., 1536 numbers for OpenAI's text-embedding-3-small). Semantically similar content produces vectors that are close together in this high-dimensional space.

"dog" and "puppy" → vectors very close together
"dog" and "quantum physics" → vectors far apart

This enables semantic search — finding meaning, not just keywords.

═══════════════════════════════════════════════════════════════

HOW VECTOR DATABASES WORK

STEP 1: EMBEDDING
Convert raw data (text, image, audio) into a vector using an embedding model.
- Text: OpenAI text-embedding-3-small, sentence-transformers
- Images: CLIP, ResNet
- Audio: Whisper embeddings

STEP 2: INDEXING
Store vectors in a data structure optimized for fast similarity search.
Naive approach: compare query vector to every stored vector (O(n)) — too slow at scale.
Solution: Approximate Nearest Neighbor (ANN) algorithms.

STEP 3: QUERYING
Embed the query → find the K most similar vectors → return associated data.

═══════════════════════════════════════════════════════════════

SIMILARITY METRICS

COSINE SIMILARITY:
cos(θ) = (A · B) / (|A| × |B|)
Measures angle between vectors. Range: -1 to 1.
Best for: text embeddings (direction matters, not magnitude)
1.0 = identical direction, 0 = orthogonal, -1 = opposite

EUCLIDEAN DISTANCE (L2):
d = √(Σ(aᵢ - bᵢ)²)
Measures straight-line distance. Lower = more similar.
Best for: image embeddings, spatial data

DOT PRODUCT:
A · B = Σ(aᵢ × bᵢ)
Fast to compute. Higher = more similar.
Best for: when vectors are normalized (equivalent to cosine similarity)

═══════════════════════════════════════════════════════════════

ANN INDEXING ALGORITHMS

HNSW (Hierarchical Navigable Small World):
- Graph-based index. Builds a multi-layer graph of vectors.
- Navigate from coarse to fine layers to find nearest neighbors.
- Best recall/speed tradeoff. Used by: Pinecone, Weaviate, Qdrant.
- Parameters: M (connections per node), ef_construction (build quality)

IVF (Inverted File Index):
- Clusters vectors into Voronoi cells using K-Means.
- At query time, search only the nearest clusters.
- Used by: FAISS (Facebook AI Similarity Search)
- Parameters: nlist (number of clusters), nprobe (clusters to search)

PQ (Product Quantization):
- Compresses vectors by splitting into sub-vectors and quantizing each.
- Reduces memory usage dramatically (32x compression possible).
- Slight accuracy loss. Often combined with IVF: IVF+PQ.

LSH (Locality Sensitive Hashing):
- Hash similar vectors to the same bucket.
- Fast but lower recall than HNSW.

FLAT (Brute Force):
- Compare query to every vector. 100% recall.
- Only feasible for small datasets (<100K vectors).

═══════════════════════════════════════════════════════════════

POPULAR VECTOR DATABASES

PINECONE:
- Fully managed, serverless
- HNSW index, supports metadata filtering
- Best for: production RAG, no infrastructure management
- Pricing: pay per usage

WEAVIATE:
- Open-source + cloud
- Built-in embedding models, GraphQL API
- Supports hybrid search (vector + keyword BM25)
- Best for: complex schemas, hybrid search

QDRANT:
- Open-source, Rust-based (very fast)
- Rich filtering, payload storage
- Best for: self-hosted, high performance

CHROMA:
- Open-source, Python-native
- Easiest to get started with
- Best for: local development, prototyping

PGVECTOR:
- PostgreSQL extension
- Add vector search to existing Postgres DB
- Best for: teams already using Postgres, don't want new infra

FAISS (Facebook AI Similarity Search):
- Library, not a database
- Extremely fast, runs in-memory
- Best for: research, custom implementations

═══════════════════════════════════════════════════════════════

KEY CONCEPTS FOR SDE INTERVIEWS

METADATA FILTERING:
Filter by structured fields before/after vector search.
Example: "Find similar products, but only in category='electronics' and price<100"
Pre-filtering: filter first, then search (fast but may miss results)
Post-filtering: search first, then filter (better recall, may need more results)

HYBRID SEARCH:
Combine vector similarity search with traditional keyword search (BM25).
Reciprocal Rank Fusion (RRF) merges results from both.
Better than pure vector search for exact keyword matches.

CHUNKING STRATEGY:
How you split documents before embedding matters enormously.
- Fixed size: split every N tokens (simple, may cut sentences)
- Sentence: split on sentence boundaries (better semantic units)
- Recursive: split on paragraphs → sentences → words
- Semantic: split when topic changes (best quality, expensive)
- Overlap: include N tokens from previous chunk (preserves context)

RERANKING:
After retrieving top-K chunks, use a cross-encoder reranker to re-score them.
Cross-encoders are slower but more accurate than bi-encoders.
Common: Cohere Rerank, BGE Reranker.

EMBEDDING MODEL CHOICE:
- Dimension: higher = more expressive but more storage/compute
- Domain: general vs domain-specific (legal, medical, code)
- Multilingual: mE5, multilingual-e5-large
- Speed vs quality tradeoff

SCALABILITY CONSIDERATIONS:
- Sharding: distribute vectors across multiple nodes
- Replication: copies for read scalability and fault tolerance
- Index build time vs query time tradeoff
- Memory vs disk: HNSW is memory-intensive`,

  keyPoints: [
    'Vector databases store embeddings and find similar items using distance metrics',
    'Cosine similarity measures angle between vectors — best for text embeddings',
    'HNSW is the most popular ANN algorithm — best recall/speed tradeoff',
    'IVF+PQ: clusters + compression — used in FAISS for large-scale search',
    'Pinecone (managed), Weaviate (hybrid), Qdrant (fast), Chroma (dev), pgvector (Postgres)',
    'Hybrid search combines vector similarity + BM25 keyword search for better results',
    'Chunking strategy (how you split docs) dramatically affects RAG quality',
    'Reranking with cross-encoders improves precision after initial retrieval'
  ],

  codeExamples: [
    {
      title: 'Vector Search from Scratch with FAISS',
      language: 'python',
      description: 'Build a semantic search engine using FAISS and sentence-transformers.',
      code: `# pip install faiss-cpu sentence-transformers numpy
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# ============================================
# STEP 1: EMBED DOCUMENTS
# ============================================

model = SentenceTransformer('all-MiniLM-L6-v2')  # 384-dim embeddings

documents = [
    "Python is a high-level programming language known for readability",
    "Machine learning enables computers to learn from data",
    "Docker containers package applications with their dependencies",
    "REST APIs use HTTP methods to communicate between services",
    "Git is a distributed version control system",
    "Kubernetes orchestrates containerized applications at scale",
    "Neural networks are inspired by the human brain structure",
    "SQL is used to query relational databases",
    "React is a JavaScript library for building user interfaces",
    "Microservices architecture splits apps into small independent services",
]

# Embed all documents
embeddings = model.encode(documents, normalize_embeddings=True)
print(f"Embeddings shape: {embeddings.shape}")  # (10, 384)

# ============================================
# STEP 2: BUILD FAISS INDEX
# ============================================

dimension = embeddings.shape[1]  # 384

# IndexFlatIP = brute-force inner product (cosine sim on normalized vectors)
index = faiss.IndexFlatIP(dimension)

# For large scale, use IVF+PQ instead:
# quantizer = faiss.IndexFlatIP(dimension)
# index = faiss.IndexIVFPQ(quantizer, dimension, nlist=100, m=8, nbits=8)
# index.train(embeddings)

index.add(embeddings.astype('float32'))
print(f"Index contains {index.ntotal} vectors")

# ============================================
# STEP 3: SEMANTIC SEARCH
# ============================================

def semantic_search(query, top_k=3):
    # Embed the query
    query_embedding = model.encode([query], normalize_embeddings=True)
    
    # Search: returns distances and indices of top_k results
    scores, indices = index.search(query_embedding.astype('float32'), top_k)
    
    results = []
    for score, idx in zip(scores[0], indices[0]):
        results.append({
            "document": documents[idx],
            "score": float(score),
            "index": int(idx)
        })
    return results

# Test queries
queries = [
    "How do I deploy applications?",
    "What is used for data storage and retrieval?",
    "Tell me about AI and learning systems",
]

for query in queries:
    print(f"\\nQuery: '{query}'")
    results = semantic_search(query, top_k=2)
    for i, r in enumerate(results, 1):
        print(f"  {i}. [{r['score']:.3f}] {r['document']}")

# ============================================
# STEP 4: HNSW INDEX (better for production)
# ============================================

# HNSW: much faster queries, slightly less recall than brute force
hnsw_index = faiss.IndexHNSWFlat(dimension, 32)  # M=32 connections per node
hnsw_index.hnsw.efConstruction = 200  # Build quality (higher = better but slower)
hnsw_index.hnsw.efSearch = 50         # Search quality (higher = better but slower)

hnsw_index.add(embeddings.astype('float32'))

scores, indices = hnsw_index.search(
    model.encode(["container orchestration"]).astype('float32'), 3
)
print("\\nHNSW Search — 'container orchestration':")
for score, idx in zip(scores[0], indices[0]):
    print(f"  [{score:.3f}] {documents[idx]}")`
    },
    {
      title: 'Production Vector DB with Chroma + Metadata Filtering',
      language: 'python',
      description: 'Use ChromaDB with metadata filtering and hybrid search patterns.',
      code: `# pip install chromadb sentence-transformers
import chromadb
from chromadb.utils import embedding_functions

# ============================================
# SETUP CHROMADB WITH EMBEDDING FUNCTION
# ============================================

client = chromadb.Client()

# Use sentence-transformers for embeddings
ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = client.create_collection(
    name="tech_articles",
    embedding_function=ef,
    metadata={"hnsw:space": "cosine"}  # Use cosine similarity
)

# ============================================
# ADD DOCUMENTS WITH METADATA
# ============================================

documents = [
    "Python decorators are a powerful way to modify function behavior",
    "Docker Compose orchestrates multi-container applications locally",
    "Kubernetes pods are the smallest deployable units in K8s",
    "React hooks like useState and useEffect manage component state",
    "PostgreSQL supports ACID transactions and complex queries",
    "Redis is an in-memory data store used for caching",
    "GraphQL allows clients to request exactly the data they need",
    "CI/CD pipelines automate testing and deployment workflows",
    "Microservices communicate via REST APIs or message queues",
    "JWT tokens are used for stateless authentication in APIs",
]

metadatas = [
    {"category": "python",     "difficulty": "intermediate", "year": 2023},
    {"category": "devops",     "difficulty": "beginner",     "year": 2023},
    {"category": "devops",     "difficulty": "advanced",     "year": 2024},
    {"category": "frontend",   "difficulty": "intermediate", "year": 2023},
    {"category": "database",   "difficulty": "intermediate", "year": 2022},
    {"category": "database",   "difficulty": "beginner",     "year": 2023},
    {"category": "api",        "difficulty": "intermediate", "year": 2023},
    {"category": "devops",     "difficulty": "intermediate", "year": 2024},
    {"category": "backend",    "difficulty": "advanced",     "year": 2023},
    {"category": "security",   "difficulty": "intermediate", "year": 2024},
]

ids = [f"doc_{i}" for i in range(len(documents))]

collection.add(documents=documents, metadatas=metadatas, ids=ids)
print(f"Added {collection.count()} documents")

# ============================================
# PURE VECTOR SEARCH
# ============================================

results = collection.query(
    query_texts=["how to deploy applications"],
    n_results=3
)
print("\\nVector Search — 'how to deploy applications':")
for doc, meta, dist in zip(
    results['documents'][0],
    results['metadatas'][0],
    results['distances'][0]
):
    print(f"  [{1-dist:.3f}] [{meta['category']}] {doc}")

# ============================================
# VECTOR SEARCH + METADATA FILTER
# ============================================

results = collection.query(
    query_texts=["data storage and retrieval"],
    n_results=3,
    where={"category": "database"}  # Only search database articles
)
print("\\nFiltered Search — 'data storage' in category=database:")
for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
    print(f"  [{meta['category']}] {doc}")

# Complex filter: devops articles from 2024
results = collection.query(
    query_texts=["container deployment"],
    n_results=5,
    where={"$and": [
        {"category": {"$eq": "devops"}},
        {"year": {"$gte": 2024}}
    ]}
)
print("\\nFiltered — devops articles from 2024+:")
for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
    print(f"  [{meta['year']}] {doc}")

# ============================================
# CHUNKING STRATEGY COMPARISON
# ============================================

def chunk_fixed(text, chunk_size=100, overlap=20):
    """Fixed-size chunking with overlap."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

def chunk_sentences(text):
    """Sentence-level chunking."""
    import re
    sentences = re.split(r'(?<=[.!?])\\s+', text)
    return [s.strip() for s in sentences if s.strip()]

sample_text = "Python is great. It has clean syntax. Machine learning uses Python heavily. Libraries like NumPy and Pandas are essential. TensorFlow and PyTorch enable deep learning."

print("\\nFixed chunks:", chunk_fixed(sample_text, chunk_size=10, overlap=2))
print("Sentence chunks:", chunk_sentences(sample_text))`
    }
  ],

  resources: [
    {
      title: 'Vector Databases Explained - Pinecone',
      url: 'https://www.pinecone.io/learn/vector-database/',
      description: 'Comprehensive guide to vector databases from Pinecone'
    },
    {
      title: 'FAISS Documentation - Facebook AI',
      url: 'https://faiss.ai/',
      description: 'Official FAISS library for efficient similarity search'
    },
    {
      title: 'HNSW Algorithm Paper',
      url: 'https://arxiv.org/abs/1603.09320',
      description: 'Original paper on Hierarchical Navigable Small World graphs'
    },
    {
      title: 'Chroma Documentation',
      url: 'https://docs.trychroma.com/',
      description: 'Getting started with ChromaDB for local vector search'
    }
  ],

  questions: [
    {
      question: 'What is a vector database and how is it different from a traditional database?',
      answer: 'A traditional database stores structured data and retrieves by exact match (WHERE id = 5). A vector database stores high-dimensional embeddings and retrieves by similarity — finding the K most similar vectors to a query vector. Traditional DB: exact lookup. Vector DB: "find me the 5 most semantically similar documents to this query." Used for semantic search, RAG, recommendations, duplicate detection.'
    },
    {
      question: 'What is cosine similarity and why is it used for text embeddings?',
      answer: 'Cosine similarity measures the angle between two vectors: cos(θ) = (A·B)/(|A||B|). Range: -1 to 1 (1 = identical direction, 0 = orthogonal). Used for text because embedding models encode meaning in the direction of the vector, not its magnitude. A short and long document about the same topic should be similar — cosine handles this by ignoring magnitude. Euclidean distance is better for spatial/image data.'
    },
    {
      question: 'What is HNSW and why is it the most popular ANN algorithm?',
      answer: 'HNSW (Hierarchical Navigable Small World) builds a multi-layer graph where each layer is a subset of the previous. Search starts at the top (coarse) layer and navigates down to find nearest neighbors. Best recall/speed tradeoff among ANN algorithms. Parameters: M (connections per node, higher = better recall but more memory), ef_construction (build quality), efSearch (query quality). Used by Pinecone, Weaviate, Qdrant, pgvector.'
    },
    {
      question: 'What is hybrid search and when should you use it?',
      answer: 'Hybrid search combines vector similarity search with keyword-based search (BM25/TF-IDF). Results from both are merged using Reciprocal Rank Fusion (RRF). Use when: 1) Users search for exact product names/codes (keyword wins), 2) Users search by meaning/concept (vector wins), 3) You want the best of both. Pure vector search misses exact keyword matches. Pure keyword search misses semantic meaning. Hybrid is best for production search systems.'
    },
    {
      question: 'How does chunking strategy affect RAG quality?',
      answer: 'Chunking splits documents before embedding. Too large: chunks contain multiple topics, embeddings are diluted. Too small: chunks lack context, answers are incomplete. Strategies: Fixed-size (simple, may cut sentences), Sentence-level (better semantic units), Recursive (paragraph → sentence → word), Semantic (split on topic change, best quality). Overlap (include N tokens from previous chunk) preserves context across boundaries. Chunking is one of the biggest levers for RAG quality.'
    },
    {
      question: 'What is metadata filtering in vector databases?',
      answer: 'Metadata filtering combines vector similarity search with structured attribute filters. Example: find similar products WHERE category=\'electronics\' AND price<100. Pre-filtering: apply filter first, then search the subset (fast but may miss results if subset is small). Post-filtering: search broadly, then filter results (better recall, need to retrieve more). Most production vector DBs support pre-filtering with HNSW index on filtered subsets.'
    },
    {
      question: 'How would you design a semantic search system for 100 million documents?',
      answer: 'Design: 1) Embedding pipeline — batch embed documents using GPU, store in object storage. 2) Vector index — use HNSW with IVF+PQ compression for memory efficiency. 3) Sharding — distribute index across multiple nodes by document ID range or category. 4) Replication — 2-3 replicas per shard for availability. 5) Caching — cache frequent query embeddings and results in Redis. 6) Reranking — retrieve top-100, rerank with cross-encoder, return top-10. 7) Monitoring — track query latency, recall@K, index freshness.'
    }
  ]
};
