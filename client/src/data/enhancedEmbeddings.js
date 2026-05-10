export const enhancedEmbeddings = {
  id: 'embeddings',
  title: 'Embeddings & Semantic Search',
  subtitle: 'How Embeddings Work, Bi-Encoders vs Cross-Encoders, Fine-Tuning, and Sentence Transformers',
  summary: 'Embeddings are dense vector representations of data (text, images, code) where semantic similarity is captured as geometric proximity. They are the foundation of semantic search, RAG, recommendations, and clustering in modern AI systems.',
  analogy: 'Embeddings are like GPS coordinates for meaning. Just as two cities close on a map are geographically near, two sentences with similar meaning have vectors that are close in embedding space. "dog" and "puppy" are neighbors. "dog" and "quantum physics" are on opposite sides of the world.',

  explanation: `WHAT ARE EMBEDDINGS?

An embedding is a dense, fixed-size numerical vector that represents the semantic meaning of data. Unlike one-hot encoding (sparse, no semantic meaning), embeddings capture relationships:

One-hot: "cat" = [1,0,0,0,...], "dog" = [0,1,0,0,...] — no relationship
Embedding: "cat" ≈ [0.2, -0.5, 0.8, ...], "dog" ≈ [0.3, -0.4, 0.7, ...] — close vectors

WORD EMBEDDINGS (Historical Context)

Word2Vec (2013, Google):
- Trained by predicting surrounding words (CBOW) or predicting word from context (Skip-gram)
- Famous property: king - man + woman ≈ queen
- Limitation: one vector per word regardless of context ("bank" = river bank or financial bank?)

GloVe (2014, Stanford):
- Global Vectors — trained on word co-occurrence statistics
- Similar to Word2Vec but uses global corpus statistics

FastText (2016, Facebook):
- Extends Word2Vec with subword information
- Handles out-of-vocabulary words by composing character n-grams

CONTEXTUAL EMBEDDINGS

BERT and its variants produce different embeddings for the same word depending on context:
- "I went to the bank to deposit money" → bank = financial institution
- "I sat by the river bank" → bank = riverbank
Each token gets a unique embedding based on its full context.

SENTENCE EMBEDDINGS

For semantic search and RAG, you need embeddings for entire sentences/paragraphs, not just words.

Naive approach: average word embeddings → loses word order and context
Better: use a model specifically trained to produce good sentence embeddings

SENTENCE TRANSFORMERS:
- Fine-tuned BERT/RoBERTa using Siamese network training
- Trained on sentence pairs with similarity labels
- Produces semantically meaningful sentence-level embeddings
- Models: all-MiniLM-L6-v2 (fast, small), all-mpnet-base-v2 (better quality), e5-large (best quality)

═══════════════════════════════════════════════════════════════

BI-ENCODER vs CROSS-ENCODER

This is one of the most important concepts for semantic search SDE interviews.

BI-ENCODER (Dual Encoder):
Architecture: Two separate encoders (can be same model with shared weights)
- Encode query: q_emb = encoder(query)
- Encode document: d_emb = encoder(document)
- Similarity: cosine_similarity(q_emb, d_emb)

Key property: document embeddings can be pre-computed and cached
Speed: O(1) per query (just embed query + ANN search)
Quality: Good but not perfect — query and document encoded independently

Use for: First-stage retrieval (retrieve top-100 from millions)

CROSS-ENCODER (Reranker):
Architecture: Query and document concatenated, fed through single encoder
- Input: [CLS] query [SEP] document [SEP]
- Output: single relevance score
- Query and document attend to each other (full cross-attention)

Key property: cannot pre-compute — must run for every (query, document) pair
Speed: O(n) per query — slow for large corpora
Quality: Much better than bi-encoder — full interaction between query and document

Use for: Second-stage reranking (rerank top-100 to get top-10)

THE TWO-STAGE PIPELINE:
Query → Bi-encoder → ANN search → Top-100 candidates → Cross-encoder → Top-10 results

This gives you the speed of bi-encoders with the quality of cross-encoders.

═══════════════════════════════════════════════════════════════

EMBEDDING DIMENSIONS AND MODELS

Dimension trade-offs:
- Higher dimension = more expressive, captures more nuance
- Higher dimension = more storage, slower ANN search, more compute
- Typical: 384 (MiniLM), 768 (BERT-base), 1024 (large models), 1536 (OpenAI ada-002), 3072 (OpenAI text-embedding-3-large)

POPULAR EMBEDDING MODELS:

Text:
- all-MiniLM-L6-v2: 384-dim, very fast, good quality — best for prototyping
- all-mpnet-base-v2: 768-dim, better quality, slower
- e5-large-v2: 1024-dim, excellent quality
- text-embedding-3-small (OpenAI): 1536-dim, great quality, API-based
- text-embedding-3-large (OpenAI): 3072-dim, best quality, expensive

Code:
- CodeBERT: code understanding
- code-search-net: code + natural language

Multilingual:
- multilingual-e5-large: 100+ languages
- paraphrase-multilingual-mpnet-base-v2

Image:
- CLIP (OpenAI): image + text in same embedding space
- ViT (Vision Transformer): image embeddings

═══════════════════════════════════════════════════════════════

FINE-TUNING EMBEDDINGS

Pre-trained embedding models are general-purpose. Fine-tuning on domain-specific data dramatically improves performance for specialized use cases (legal, medical, code, finance).

TRAINING APPROACHES:

1. Contrastive Learning (most common):
   - Positive pairs: semantically similar sentences
   - Negative pairs: semantically different sentences
   - Loss: pull positives together, push negatives apart

2. Multiple Negatives Ranking Loss:
   - For each (query, positive_doc) pair, treat all other docs in batch as negatives
   - Efficient — no need to explicitly mine negatives
   - Used by most modern sentence transformer training

3. Triplet Loss:
   - (anchor, positive, negative) triplets
   - Loss = max(0, d(anchor, positive) - d(anchor, negative) + margin)

4. Knowledge Distillation:
   - Train small bi-encoder to mimic cross-encoder scores
   - Get cross-encoder quality at bi-encoder speed

DATA FOR FINE-TUNING:
- (query, relevant_document) pairs from search logs
- (question, answer) pairs from Q&A datasets
- Paraphrase pairs
- Hard negatives: documents that look similar but are not relevant (most important for quality)

HARD NEGATIVE MINING:
- Easy negatives: random documents — model learns too easily
- Hard negatives: top-K results from BM25 or bi-encoder that are NOT relevant
- Hard negatives force the model to learn fine-grained distinctions

═══════════════════════════════════════════════════════════════

EMBEDDING EVALUATION

METRICS:
- NDCG@K (Normalized Discounted Cumulative Gain): measures ranking quality
- MRR (Mean Reciprocal Rank): average of 1/rank of first relevant result
- Recall@K: fraction of relevant docs in top-K results
- MAP (Mean Average Precision): average precision across all queries

BENCHMARKS:
- MTEB (Massive Text Embedding Benchmark): 56 tasks across 8 categories
- BEIR: heterogeneous retrieval benchmark
- MS MARCO: large-scale passage retrieval

EMBEDDING DRIFT:
Over time, language evolves and new concepts emerge. Monitor:
- Distribution of embedding norms
- Cosine similarity distribution of random pairs
- Downstream task performance`,

  keyPoints: [
    'Embeddings: dense vectors where semantic similarity = geometric proximity',
    'Word2Vec/GloVe: static word embeddings. BERT: contextual embeddings (same word, different vectors)',
    'Sentence Transformers: fine-tuned BERT for sentence-level embeddings — foundation of semantic search',
    'Bi-encoder: encode query and doc separately, fast ANN search — use for retrieval (top-100)',
    'Cross-encoder: encode query+doc together, full attention — use for reranking (top-100 → top-10)',
    'Two-stage pipeline: bi-encoder retrieval + cross-encoder reranking = speed + quality',
    'Fine-tuning with contrastive learning + hard negatives dramatically improves domain performance',
    'Evaluate with NDCG@K, MRR, Recall@K on domain-specific benchmark'
  ],

  codeExamples: [
    {
      title: 'Bi-Encoder vs Cross-Encoder Comparison',
      language: 'python',
      description: 'Compare bi-encoder and cross-encoder for semantic search quality and speed.',
      code: `# pip install sentence-transformers
import time
import numpy as np
from sentence_transformers import SentenceTransformer, CrossEncoder

# ============================================
# BI-ENCODER (Fast Retrieval)
# ============================================

bi_encoder = SentenceTransformer('all-MiniLM-L6-v2')

documents = [
    "Python is a high-level programming language known for clean syntax",
    "Machine learning models learn patterns from training data",
    "Docker packages applications with their dependencies into containers",
    "Kubernetes manages containerized applications across a cluster",
    "PostgreSQL is an open-source relational database with ACID compliance",
    "Redis is an in-memory data structure store used as cache and message broker",
    "React is a JavaScript library for building component-based UIs",
    "Neural networks consist of layers of interconnected artificial neurons",
    "Git is a distributed version control system for tracking code changes",
    "REST APIs use HTTP verbs to perform CRUD operations on resources",
    "GraphQL is a query language that lets clients request specific data",
    "Microservices split applications into small, independently deployable services",
    "Transformers use self-attention to process sequences in parallel",
    "BERT is a bidirectional transformer pre-trained on masked language modeling",
    "Gradient descent optimizes model parameters by following the loss gradient",
]

# Pre-compute document embeddings (done ONCE offline)
start = time.time()
doc_embeddings = bi_encoder.encode(documents, normalize_embeddings=True)
index_time = (time.time() - start) * 1000
print(f"Indexed {len(documents)} docs in {index_time:.1f}ms")
print(f"Embedding shape: {doc_embeddings.shape}")

def bi_encoder_search(query, top_k=5):
    start = time.time()
    query_emb = bi_encoder.encode([query], normalize_embeddings=True)
    scores = (doc_embeddings @ query_emb.T).flatten()
    top_indices = np.argsort(scores)[::-1][:top_k]
    elapsed = (time.time() - start) * 1000
    results = [(documents[i], float(scores[i])) for i in top_indices]
    return results, elapsed

# ============================================
# CROSS-ENCODER (Accurate Reranking)
# ============================================

cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def cross_encoder_rerank(query, candidates):
    start = time.time()
    pairs = [[query, doc] for doc, _ in candidates]
    scores = cross_encoder.predict(pairs)
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    elapsed = (time.time() - start) * 1000
    results = [(doc, float(score)) for (doc, _), score in ranked]
    return results, elapsed

# ============================================
# TWO-STAGE PIPELINE
# ============================================

def two_stage_search(query, retrieve_k=8, final_k=3):
    print(f"\nQuery: '{query}'")
    print("=" * 70)

    # Stage 1: Bi-encoder retrieval (fast)
    candidates, bi_time = bi_encoder_search(query, top_k=retrieve_k)
    print(f"\nStage 1 — Bi-encoder ({bi_time:.1f}ms) — Top {retrieve_k} candidates:")
    for i, (doc, score) in enumerate(candidates, 1):
        print(f"  {i}. [{score:.3f}] {doc[:60]}")

    # Stage 2: Cross-encoder reranking (accurate)
    reranked, ce_time = cross_encoder_rerank(query, candidates)
    print(f"\nStage 2 — Cross-encoder reranking ({ce_time:.1f}ms) — Final top {final_k}:")
    for i, (doc, score) in enumerate(reranked[:final_k], 1):
        print(f"  {i}. [{score:.3f}] {doc[:60]}")

    print(f"\nTotal latency: {bi_time + ce_time:.1f}ms")
    return reranked[:final_k]

two_stage_search("how do containers work in production?")
two_stage_search("what is used for learning from data?")`
    },
    {
      title: 'Fine-Tuning Embeddings with Contrastive Learning',
      language: 'python',
      description: 'Fine-tune a sentence transformer on domain-specific data using contrastive learning.',
      code: `# pip install sentence-transformers datasets
from sentence_transformers import SentenceTransformer, InputExample, losses
from sentence_transformers.evaluation import InformationRetrievalEvaluator
from torch.utils.data import DataLoader
import numpy as np

# ============================================
# PREPARE TRAINING DATA
# (query, positive_document) pairs
# ============================================

# Domain: software engineering Q&A
train_examples = [
    InputExample(texts=[
        "What is dependency injection?",
        "Dependency injection is a design pattern where objects receive their dependencies from external sources rather than creating them internally."
    ]),
    InputExample(texts=[
        "How does garbage collection work?",
        "Garbage collection automatically reclaims memory occupied by objects that are no longer referenced by the program."
    ]),
    InputExample(texts=[
        "What is the difference between stack and heap memory?",
        "Stack memory stores local variables and function calls with automatic allocation/deallocation. Heap memory is dynamically allocated and managed manually or by GC."
    ]),
    InputExample(texts=[
        "Explain the CAP theorem",
        "CAP theorem states that a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance."
    ]),
    InputExample(texts=[
        "What is eventual consistency?",
        "Eventual consistency guarantees that if no new updates are made, all replicas will eventually converge to the same value, though they may temporarily differ."
    ]),
    InputExample(texts=[
        "How does a hash table work?",
        "A hash table uses a hash function to map keys to array indices, enabling O(1) average-case lookup, insertion, and deletion."
    ]),
    InputExample(texts=[
        "What is a deadlock?",
        "A deadlock occurs when two or more processes are blocked forever, each waiting for a resource held by the other."
    ]),
    InputExample(texts=[
        "Explain load balancing strategies",
        "Load balancing distributes incoming requests across multiple servers. Strategies include round-robin, least connections, IP hash, and weighted distribution."
    ]),
]

# ============================================
# LOAD BASE MODEL AND FINE-TUNE
# ============================================

model = SentenceTransformer('all-MiniLM-L6-v2')

# DataLoader
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=4)

# Multiple Negatives Ranking Loss
# For each (query, positive) pair, all other positives in the batch are negatives
# This is the most effective loss for semantic search fine-tuning
train_loss = losses.MultipleNegativesRankingLoss(model)

print("Fine-tuning embedding model...")
model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=3,
    warmup_steps=10,
    show_progress_bar=True,
    output_path='./finetuned-embeddings'
)

# ============================================
# EVALUATE: BEFORE vs AFTER FINE-TUNING
# ============================================

base_model = SentenceTransformer('all-MiniLM-L6-v2')
fine_tuned  = SentenceTransformer('./finetuned-embeddings')

test_queries = [
    "memory management in programming",
    "distributed systems consistency",
    "data structure for fast lookup",
]

test_docs = [
    "Garbage collection automatically reclaims unused memory",
    "Stack stores local variables, heap stores dynamic allocations",
    "CAP theorem: consistency, availability, partition tolerance",
    "Eventual consistency: replicas converge over time",
    "Hash tables provide O(1) average lookup using hash functions",
    "Deadlock: circular wait between processes for resources",
]

def evaluate_model(model, queries, docs, name):
    doc_embs = model.encode(docs, normalize_embeddings=True)
    print(f"\n{name}:")
    for query in queries:
        q_emb = model.encode([query], normalize_embeddings=True)
        scores = (doc_embs @ q_emb.T).flatten()
        best_idx = np.argmax(scores)
        print(f"  Q: {query[:45]}")
        print(f"  A: [{scores[best_idx]:.3f}] {docs[best_idx][:60]}")

evaluate_model(base_model, test_queries, test_docs, "BASE MODEL")
evaluate_model(fine_tuned,  test_queries, test_docs, "FINE-TUNED MODEL")

# ============================================
# HARD NEGATIVE MINING
# ============================================

def mine_hard_negatives(model, queries, corpus, top_k=10):
    """
    Hard negatives: top-K retrieved docs that are NOT relevant.
    These are the most informative negatives for training.
    """
    corpus_embs = model.encode(corpus, normalize_embeddings=True)
    hard_negatives = {}

    for query in queries:
        q_emb = model.encode([query], normalize_embeddings=True)
        scores = (corpus_embs @ q_emb.T).flatten()
        # Top-K results (excluding the true positive) are hard negatives
        top_k_idx = np.argsort(scores)[::-1][:top_k]
        hard_negatives[query] = [corpus[i] for i in top_k_idx]

    return hard_negatives

hard_negs = mine_hard_negatives(base_model, test_queries, test_docs)
print("\nHard negatives for 'memory management in programming':")
for doc in hard_negs["memory management in programming"][:3]:
    print(f"  - {doc}")`
    }
  ],

  resources: [
    {
      title: 'Sentence Transformers Documentation',
      url: 'https://www.sbert.net/',
      description: 'Official docs for sentence-transformers — the go-to library for embeddings'
    },
    {
      title: 'MTEB Leaderboard',
      url: 'https://huggingface.co/spaces/mteb/leaderboard',
      description: 'Massive Text Embedding Benchmark — compare all embedding models'
    },
    {
      title: 'The Illustrated Word2Vec - Jay Alammar',
      url: 'https://jalammar.github.io/illustrated-word2vec/',
      description: 'Best visual explanation of word embeddings'
    },
    {
      title: 'Bi-Encoder vs Cross-Encoder - SBERT',
      url: 'https://www.sbert.net/examples/applications/cross-encoder/README.html',
      description: 'Official comparison of bi-encoders and cross-encoders'
    }
  ],

  questions: [
    {
      question: 'What is an embedding and why is it useful?',
      answer: 'An embedding is a dense fixed-size vector representing the semantic meaning of data. Semantically similar items have vectors close together in embedding space. Useful because: 1) Captures meaning, not just exact matches, 2) Enables semantic search (find similar meaning, not just keywords), 3) Enables clustering, classification, and anomaly detection on text/images, 4) Foundation of RAG, recommendations, and duplicate detection. Unlike one-hot encoding, embeddings capture relationships between concepts.'
    },
    {
      question: 'What is the difference between a bi-encoder and a cross-encoder?',
      answer: 'Bi-encoder: encodes query and document independently, similarity = dot product of embeddings. Fast — document embeddings pre-computed offline, query time is O(1) + ANN search. Use for first-stage retrieval (millions → top-100). Cross-encoder: concatenates query and document, runs through single model with full cross-attention. Slow — must run for every (query, doc) pair, O(n). Much more accurate. Use for second-stage reranking (top-100 → top-10). Production: bi-encoder retrieval + cross-encoder reranking.'
    },
    {
      question: 'What is contrastive learning for embeddings?',
      answer: 'Contrastive learning trains embeddings by pulling similar pairs together and pushing dissimilar pairs apart in vector space. Training data: positive pairs (semantically similar sentences) and negative pairs (dissimilar). Loss functions: Contrastive Loss, Triplet Loss (anchor, positive, negative), Multiple Negatives Ranking Loss (most efficient — treats all other positives in batch as negatives). Hard negative mining — using top-K retrieved but non-relevant docs as negatives — is critical for quality.'
    },
    {
      question: 'What is hard negative mining and why does it matter?',
      answer: 'Hard negatives are documents that are retrieved by the model (look similar) but are NOT actually relevant. Easy negatives (random documents) are too easy — model learns nothing. Hard negatives force the model to learn fine-grained distinctions. Process: 1) Run current model on training queries, 2) Retrieve top-K results, 3) Filter out true positives, 4) Use remaining as hard negatives in training. Hard negatives are the single biggest lever for improving embedding model quality.'
    },
    {
      question: 'How do you evaluate embedding model quality?',
      answer: 'Metrics: NDCG@K (ranking quality — higher-ranked relevant docs score more), MRR (mean reciprocal rank of first relevant result), Recall@K (fraction of relevant docs in top-K). Benchmarks: MTEB (56 tasks, 8 categories — the standard), BEIR (heterogeneous retrieval), MS MARCO (passage retrieval). Domain-specific: create a test set of (query, relevant_doc) pairs from your domain and measure Recall@10 and NDCG@10. Always evaluate on your specific domain — general benchmarks may not reflect your use case.'
    },
    {
      question: 'What is the difference between Word2Vec and BERT embeddings?',
      answer: 'Word2Vec: static embeddings — each word has one fixed vector regardless of context. "bank" has the same vector in "river bank" and "bank account." Trained by predicting surrounding words. GloVe: similar, uses global co-occurrence statistics. BERT: contextual embeddings — same word gets different vectors based on surrounding context. "bank" in financial context ≠ "bank" in river context. Much richer representations. For sentence embeddings, use Sentence Transformers (fine-tuned BERT) rather than averaging Word2Vec.'
    }
  ]
};
