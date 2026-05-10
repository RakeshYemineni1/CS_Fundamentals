export const enhancedAISystemDesign = {
  id: 'ai-system-design',
  title: 'AI System Design',
  subtitle: 'Designing Recommendation Systems, Search Engines, Chatbots, and AI Pipelines at Scale',
  summary: 'AI system design interviews ask you to architect end-to-end AI-powered systems — recommendation engines, semantic search, chatbots, fraud detection, and more. You need to cover data flow, model selection, serving infrastructure, scalability, and trade-offs.',
  analogy: 'Designing an AI system is like designing a city. You need roads (data pipelines), buildings (models), utilities (serving infrastructure), traffic rules (rate limiting, caching), emergency services (monitoring, fallbacks), and zoning laws (guardrails, compliance). Each piece must work together at scale.',

  explanation: `AI SYSTEM DESIGN INTERVIEW FORMAT

Typical question: "Design a recommendation system for Netflix" or "Design a semantic search engine" or "Design a chatbot for customer support."

Interviewers evaluate:
- Can you break down a vague problem into concrete components?
- Do you understand the full ML lifecycle, not just modeling?
- Can you reason about scale, latency, and trade-offs?
- Do you know when NOT to use ML?

FRAMEWORK: 5-STEP APPROACH

1. CLARIFY REQUIREMENTS (2-3 min)
   - Scale: how many users, requests per second?
   - Latency: real-time (<100ms) or batch (hours)?
   - Freshness: how often does data/model need to update?
   - Accuracy vs speed trade-off?
   - Cold start: how to handle new users/items?

2. HIGH-LEVEL ARCHITECTURE (5 min)
   - Draw the major components and data flow
   - Identify offline (training) vs online (serving) paths

3. DEEP DIVE COMPONENTS (15 min)
   - Data collection and storage
   - Feature engineering
   - Model architecture and training
   - Serving and inference
   - Monitoring

4. SCALE AND TRADE-OFFS (5 min)
   - Bottlenecks and how to address them
   - Consistency vs availability
   - Accuracy vs latency

5. FOLLOW-UPS
   - A/B testing strategy
   - Cold start problem
   - Handling data drift

═══════════════════════════════════════════════════════════════

DESIGN 1: RECOMMENDATION SYSTEM (Netflix / YouTube / Amazon)

PROBLEM: Given a user, recommend N items they are likely to engage with.

COMPONENTS:

Candidate Generation (Retrieval):
- Goal: narrow millions of items to hundreds of candidates fast
- Methods:
  a) Collaborative Filtering: users who liked X also liked Y
     - Matrix Factorization (ALS, SVD): decompose user-item matrix
     - Two-Tower Model: embed users and items separately, dot product for similarity
  b) Content-Based: recommend items similar to what user liked
     - Item embeddings from metadata (genre, description, tags)
  c) Popularity-Based: trending items, good for cold start

Ranking (Scoring):
- Goal: score and rank the ~500 candidates to find top 10
- Model: deep neural network with rich features
- Features: user history, item metadata, context (time, device), interaction features
- Output: predicted engagement probability (click, watch, purchase)

Re-ranking (Business Logic):
- Apply diversity constraints (don't show 10 similar items)
- Apply business rules (promote new content, sponsored items)
- Filter already-seen items

DATA FLOW:
User request → Candidate generation (ANN search in vector DB) → Ranking model → Re-ranking → Response

OFFLINE PIPELINE:
User events (clicks, watches) → Feature store → Train two-tower + ranking model → Push embeddings to vector DB

COLD START SOLUTIONS:
- New user: use demographic info, ask onboarding questions, show popular items
- New item: use content embeddings from metadata before behavioral data exists

═══════════════════════════════════════════════════════════════

DESIGN 2: SEMANTIC SEARCH ENGINE

PROBLEM: Given a text query, return the most relevant documents from a large corpus.

COMPONENTS:

Indexing Pipeline (Offline):
- Crawl/ingest documents
- Chunk documents (sentence/paragraph level)
- Embed chunks using bi-encoder (e.g., sentence-transformers)
- Store embeddings in vector DB (Pinecone, Weaviate, pgvector)
- Also index in Elasticsearch for keyword search (BM25)

Query Pipeline (Online):
- Embed query using same bi-encoder
- Vector search: retrieve top-100 by cosine similarity
- Keyword search: retrieve top-100 by BM25
- Hybrid fusion: merge results using Reciprocal Rank Fusion (RRF)
- Reranking: cross-encoder reranker scores top-50, returns top-10
- Return results with snippets

LATENCY BUDGET (100ms total):
- Query embedding: 10ms
- Vector search: 20ms
- Keyword search: 15ms
- Reranking: 40ms
- Network + overhead: 15ms

SCALE:
- 1B documents: shard vector index across multiple nodes
- 10K QPS: horizontal scaling of query servers, cache popular queries
- Index freshness: streaming pipeline updates index within minutes of new docs

═══════════════════════════════════════════════════════════════

DESIGN 3: LLM-POWERED CHATBOT (Customer Support)

PROBLEM: Build a chatbot that answers customer questions using company knowledge base.

COMPONENTS:

Knowledge Base:
- Ingest: PDFs, docs, FAQs, support tickets → chunk → embed → vector DB
- Update pipeline: detect new/changed docs, re-embed, update index

Conversation Manager:
- Maintain conversation history (last N turns)
- Summarize long conversations to fit context window
- Session management (Redis for active sessions)

RAG Pipeline:
- Embed user query
- Retrieve top-K relevant chunks from vector DB
- Inject into LLM prompt with conversation history
- Generate response

Guardrails Layer:
- Input: detect PII, off-topic queries, injection attempts
- Output: toxicity check, hallucination risk flag, PII leak detection

Escalation Logic:
- Confidence threshold: if model is uncertain, escalate to human
- Sentiment detection: if user is frustrated, escalate
- Topic detection: legal/medical/financial → always escalate

Feedback Loop:
- Thumbs up/down on responses
- Human agent corrections feed back into training data
- Periodic fine-tuning on high-quality examples

═══════════════════════════════════════════════════════════════

DESIGN 4: FRAUD DETECTION SYSTEM

PROBLEM: Detect fraudulent transactions in real-time (<100ms).

COMPONENTS:

Feature Engineering:
- Real-time features: transaction amount, merchant, location, time
- Historical features (from feature store): avg spend, typical merchants, velocity
- Graph features: connections between accounts, devices, IPs

Models (Ensemble):
- Rule engine: fast, interpretable, catches known patterns
- Gradient boosting (XGBoost): tabular features, high accuracy
- Graph neural network: detects fraud rings
- Anomaly detection: catches novel fraud patterns

Decision Logic:
- Score from each model → weighted ensemble → final score
- Thresholds: auto-approve (<0.1), review (0.1-0.7), auto-decline (>0.7)
- Human review queue for middle tier

Latency:
- Rule engine: <1ms
- XGBoost: <5ms
- Total decision: <50ms (well within 100ms budget)

Feedback Loop:
- Chargebacks and confirmed fraud → label → retrain
- False positive complaints → adjust thresholds

KEY TRADE-OFF: Precision vs Recall
- High recall (catch more fraud) → more false positives → customer friction
- High precision (fewer false positives) → miss more fraud → financial loss
- Business decides acceptable trade-off

═══════════════════════════════════════════════════════════════

COMMON TRADE-OFFS IN AI SYSTEM DESIGN

Accuracy vs Latency:
- More complex model = better accuracy but slower
- Solution: two-stage (fast retrieval + slow reranking)

Freshness vs Cost:
- Real-time features = fresh but expensive
- Batch features = stale but cheap
- Solution: mix of real-time and batch features

Personalization vs Privacy:
- More user data = better recommendations
- More data collection = privacy concerns
- Solution: on-device processing, differential privacy, data minimization

Scalability vs Consistency:
- Distributed systems trade consistency for availability
- Eventual consistency acceptable for recommendations
- Strong consistency required for fraud detection`,

  keyPoints: [
    'Framework: Clarify → High-level architecture → Deep dive → Scale → Trade-offs',
    'Recommendation: Candidate generation (fast, millions→hundreds) + Ranking (slow, hundreds→10)',
    'Two-tower model: embed users and items separately, ANN search for candidates',
    'Semantic search: bi-encoder retrieval + BM25 keyword + RRF fusion + cross-encoder reranking',
    'Chatbot: RAG pipeline + conversation manager + guardrails + escalation logic',
    'Fraud detection: rule engine + ML ensemble + graph features, <100ms latency',
    'Cold start: new users/items have no history — use content embeddings or popularity',
    'Key trade-offs: accuracy vs latency, freshness vs cost, personalization vs privacy'
  ],

  codeExamples: [
    {
      title: 'Two-Tower Recommendation Model',
      language: 'python',
      description: 'Implement a two-tower model for candidate generation in a recommendation system.',
      code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# ============================================
# TWO-TOWER MODEL FOR RECOMMENDATIONS
# User tower + Item tower → dot product similarity
# ============================================

# Simulate data
NUM_USERS = 10000
NUM_ITEMS = 50000
EMBEDDING_DIM = 64

# Synthetic interaction data: (user_id, item_id, label)
np.random.seed(42)
n_interactions = 100000

user_ids = np.random.randint(0, NUM_USERS, n_interactions)
item_ids = np.random.randint(0, NUM_ITEMS, n_interactions)
labels = np.random.randint(0, 2, n_interactions).astype(np.float32)

# User features (age group, country, device)
user_age = np.random.randint(0, 5, n_interactions)      # 5 age groups
user_country = np.random.randint(0, 50, n_interactions)  # 50 countries

# Item features (category, language, duration bucket)
item_category = np.random.randint(0, 20, n_interactions)  # 20 categories
item_language = np.random.randint(0, 10, n_interactions)  # 10 languages

# ============================================
# USER TOWER
# ============================================

def build_user_tower():
    # Inputs
    user_id_input    = keras.Input(shape=(1,), name='user_id')
    user_age_input   = keras.Input(shape=(1,), name='user_age')
    user_country_input = keras.Input(shape=(1,), name='user_country')

    # Embeddings
    user_emb     = layers.Embedding(NUM_USERS, 32)(user_id_input)
    age_emb      = layers.Embedding(5, 8)(user_age_input)
    country_emb  = layers.Embedding(50, 16)(user_country_input)

    # Flatten and concatenate
    user_emb    = layers.Flatten()(user_emb)
    age_emb     = layers.Flatten()(age_emb)
    country_emb = layers.Flatten()(country_emb)

    x = layers.Concatenate()([user_emb, age_emb, country_emb])
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dense(64, activation='relu')(x)
    # L2 normalize so dot product = cosine similarity
    user_embedding = layers.Lambda(lambda v: tf.math.l2_normalize(v, axis=1),
                                   name='user_embedding')(x)

    return keras.Model(
        inputs=[user_id_input, user_age_input, user_country_input],
        outputs=user_embedding,
        name='user_tower'
    )

# ============================================
# ITEM TOWER
# ============================================

def build_item_tower():
    item_id_input       = keras.Input(shape=(1,), name='item_id')
    item_category_input = keras.Input(shape=(1,), name='item_category')
    item_language_input = keras.Input(shape=(1,), name='item_language')

    item_emb     = layers.Embedding(NUM_ITEMS, 32)(item_id_input)
    cat_emb      = layers.Embedding(20, 8)(item_category_input)
    lang_emb     = layers.Embedding(10, 8)(item_language_input)

    item_emb = layers.Flatten()(item_emb)
    cat_emb  = layers.Flatten()(cat_emb)
    lang_emb = layers.Flatten()(lang_emb)

    x = layers.Concatenate()([item_emb, cat_emb, lang_emb])
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dense(64, activation='relu')(x)
    item_embedding = layers.Lambda(lambda v: tf.math.l2_normalize(v, axis=1),
                                   name='item_embedding')(x)

    return keras.Model(
        inputs=[item_id_input, item_category_input, item_language_input],
        outputs=item_embedding,
        name='item_tower'
    )

# ============================================
# COMBINED TWO-TOWER MODEL
# ============================================

user_tower = build_user_tower()
item_tower = build_item_tower()

# Inputs for combined model
user_id_in      = keras.Input(shape=(1,), name='user_id')
user_age_in     = keras.Input(shape=(1,), name='user_age')
user_country_in = keras.Input(shape=(1,), name='user_country')
item_id_in      = keras.Input(shape=(1,), name='item_id')
item_cat_in     = keras.Input(shape=(1,), name='item_category')
item_lang_in    = keras.Input(shape=(1,), name='item_language')

user_emb = user_tower([user_id_in, user_age_in, user_country_in])
item_emb = item_tower([item_id_in, item_cat_in, item_lang_in])

# Dot product similarity score
score = layers.Dot(axes=1, normalize=False)([user_emb, item_emb])
output = layers.Activation('sigmoid')(score)

model = keras.Model(
    inputs=[user_id_in, user_age_in, user_country_in,
            item_id_in, item_cat_in, item_lang_in],
    outputs=output
)

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['AUC'])
model.summary()

# ============================================
# SERVING: BUILD ITEM INDEX FOR ANN SEARCH
# ============================================

# After training, pre-compute all item embeddings
# and store in a vector DB for fast ANN retrieval

def build_item_index(item_tower, num_items=1000):
    """Pre-compute item embeddings for ANN index."""
    item_ids   = np.arange(num_items).reshape(-1, 1)
    categories = np.random.randint(0, 20, num_items).reshape(-1, 1)
    languages  = np.random.randint(0, 10, num_items).reshape(-1, 1)

    embeddings = item_tower.predict([item_ids, categories, languages], verbose=0)
    print(f"Item index shape: {embeddings.shape}")  # (1000, 64)
    return embeddings

def get_recommendations(user_tower, item_embeddings, user_id, user_age, user_country, top_k=10):
    """Get top-K recommendations for a user."""
    # Get user embedding
    user_emb = user_tower.predict(
        [np.array([[user_id]]), np.array([[user_age]]), np.array([[user_country]])],
        verbose=0
    )[0]

    # Cosine similarity with all items (in production: use FAISS/ANN)
    similarities = item_embeddings @ user_emb
    top_k_indices = np.argsort(similarities)[::-1][:top_k]

    return top_k_indices, similarities[top_k_indices]

item_embeddings = build_item_index(item_tower, num_items=1000)
recs, scores = get_recommendations(user_tower, item_embeddings,
                                   user_id=42, user_age=2, user_country=5)
print(f"Top recommendations: {recs}")
print(f"Similarity scores:   {scores.round(3)}")`
    },
    {
      title: 'Hybrid Search with RRF Fusion',
      language: 'python',
      description: 'Implement hybrid search combining vector similarity and BM25 keyword search.',
      code: `import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ============================================
# HYBRID SEARCH: VECTOR + BM25 + RRF FUSION
# ============================================

documents = [
    "Python is a high-level programming language emphasizing readability",
    "Machine learning algorithms learn patterns from training data",
    "Docker containers package applications with all dependencies",
    "Kubernetes orchestrates containerized workloads at scale",
    "REST APIs use HTTP methods for client-server communication",
    "PostgreSQL is a powerful open-source relational database",
    "Redis is an in-memory key-value store used for caching",
    "React is a JavaScript library for building user interfaces",
    "Neural networks are inspired by biological brain structure",
    "Git enables distributed version control for source code",
    "GraphQL provides a flexible query language for APIs",
    "Microservices decompose applications into small independent services",
]

# ============================================
# VECTOR SEARCH (Semantic)
# ============================================

embedder = SentenceTransformer('all-MiniLM-L6-v2')
doc_embeddings = embedder.encode(documents, normalize_embeddings=True)

def vector_search(query, top_k=5):
    query_emb = embedder.encode([query], normalize_embeddings=True)
    scores = (doc_embeddings @ query_emb.T).flatten()
    ranked = np.argsort(scores)[::-1][:top_k]
    return [(int(idx), float(scores[idx])) for idx in ranked]

# ============================================
# BM25 KEYWORD SEARCH (approximate with TF-IDF)
# ============================================

tfidf = TfidfVectorizer(ngram_range=(1, 2))
tfidf_matrix = tfidf.fit_transform(documents)

def keyword_search(query, top_k=5):
    query_vec = tfidf.transform([query])
    scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
    ranked = np.argsort(scores)[::-1][:top_k]
    return [(int(idx), float(scores[idx])) for idx in ranked]

# ============================================
# RECIPROCAL RANK FUSION (RRF)
# Merges ranked lists from multiple retrieval systems
# ============================================

def reciprocal_rank_fusion(ranked_lists, k=60):
    """
    RRF score = sum(1 / (k + rank)) across all lists.
    k=60 is the standard constant that dampens high-rank advantage.
    """
    rrf_scores = {}
    for ranked_list in ranked_lists:
        for rank, (doc_id, _) in enumerate(ranked_list, start=1):
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (k + rank)
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)

def hybrid_search(query, top_k=5, vector_weight=0.7, keyword_weight=0.3):
    """Hybrid search combining vector and keyword results."""
    vec_results = vector_search(query, top_k=top_k * 2)
    kw_results  = keyword_search(query, top_k=top_k * 2)

    # RRF fusion
    fused = reciprocal_rank_fusion([vec_results, kw_results])
    return fused[:top_k]

# ============================================
# COMPARE: VECTOR vs KEYWORD vs HYBRID
# ============================================

queries = [
    "how to deploy containerized apps",   # Semantic query
    "PostgreSQL database",                 # Exact keyword query
    "learning from data patterns",         # Semantic query
]

for query in queries:
    print(f"\nQuery: '{query}'")
    print(f"{'Rank':<6} {'Vector':<45} {'Keyword':<45} {'Hybrid':<45}")
    print("-" * 140)

    vec = vector_search(query, top_k=3)
    kw  = keyword_search(query, top_k=3)
    hyb = hybrid_search(query, top_k=3)

    for i in range(3):
        v_doc = documents[vec[i][0]][:40] if i < len(vec) else ""
        k_doc = documents[kw[i][0]][:40]  if i < len(kw)  else ""
        h_doc = documents[hyb[i][0]][:40] if i < len(hyb) else ""
        print(f"{i+1:<6} {v_doc:<45} {k_doc:<45} {h_doc:<45}")`
    }
  ],

  resources: [
    {
      title: 'System Design for ML - Chip Huyen',
      url: 'https://huyenchip.com/machine-learning-systems-design/toc.html',
      description: 'The best free resource for ML system design interviews'
    },
    {
      title: 'Designing ML Systems - O\'Reilly (Chip Huyen)',
      url: 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/',
      description: 'Comprehensive book on production ML system design'
    },
    {
      title: 'Eugene Yan - Applied ML',
      url: 'https://eugeneyan.com/',
      description: 'Real-world ML system design case studies from Amazon'
    },
    {
      title: 'ML System Design Interview - Educative',
      url: 'https://www.educative.io/courses/machine-learning-system-design',
      description: 'Structured ML system design interview preparation'
    }
  ],

  questions: [
    {
      question: 'How would you design a recommendation system for a streaming platform?',
      answer: 'Two-stage architecture: 1) Candidate Generation — two-tower model embeds users and items separately, ANN search retrieves top-500 candidates from millions of items in <20ms. 2) Ranking — deep neural network with rich features (user history, item metadata, context) scores candidates, returns top-10. 3) Re-ranking — apply diversity, business rules, filter seen items. Offline: train on user events → push embeddings to vector DB. Cold start: content embeddings for new items, popularity for new users.'
    },
    {
      question: 'What is the two-tower model and why is it used for recommendations?',
      answer: 'Two-tower model has separate neural networks (towers) for users and items, each producing an embedding. Similarity = dot product of user and item embeddings. Why: 1) Item embeddings can be pre-computed offline and indexed in a vector DB. 2) At query time, only compute user embedding, then do fast ANN search. 3) Scales to millions of items. 4) Each tower can use rich features. Alternative: matrix factorization (simpler but less expressive). Used by YouTube, Pinterest, Twitter.'
    },
    {
      question: 'How would you design a semantic search engine for 1 billion documents?',
      answer: 'Indexing: chunk docs → embed with bi-encoder → store in sharded vector DB + Elasticsearch for BM25. Query: embed query → parallel vector search + BM25 → RRF fusion → cross-encoder reranking → return top-10. Scale: shard vector index across nodes by doc ID range, replicate for read throughput, cache popular query embeddings in Redis. Latency budget: 100ms total — embedding 10ms, retrieval 20ms, reranking 40ms, overhead 30ms.'
    },
    {
      question: 'What is the cold start problem and how do you solve it?',
      answer: 'Cold start: new users or items have no interaction history for collaborative filtering. Solutions for new users: ask onboarding questions, use demographic features, show popular/trending items, use content-based filtering until enough interactions. Solutions for new items: use content embeddings from metadata (title, description, category) before behavioral data exists, promote new items with exploration budget. Hybrid approach: blend collaborative + content-based, weight toward content-based for cold entities.'
    },
    {
      question: 'How would you design a real-time fraud detection system?',
      answer: 'Three-layer architecture: 1) Rule engine (<1ms): fast, interpretable, catches known patterns. 2) ML ensemble (<50ms): XGBoost on tabular features + graph neural network for fraud rings + anomaly detection for novel patterns. 3) Human review queue: middle-confidence scores. Features: real-time (amount, merchant, location) + historical from feature store (velocity, typical behavior) + graph features (shared devices/IPs). Key trade-off: precision vs recall — business decides acceptable false positive rate.'
    },
    {
      question: 'What are the key trade-offs in AI system design?',
      answer: 'Accuracy vs Latency: complex model = better accuracy but slower — solve with two-stage (fast retrieval + slow reranking). Freshness vs Cost: real-time features = fresh but expensive — mix real-time and batch features. Personalization vs Privacy: more data = better recommendations but privacy concerns — use on-device processing, differential privacy. Scalability vs Consistency: distributed systems trade consistency for availability — eventual consistency OK for recommendations, strong consistency needed for fraud/payments.'
    },
    {
      question: 'How do you handle A/B testing for ML models?',
      answer: 'A/B testing for ML: 1) Traffic splitting — route X% of users to new model, rest to control. 2) Randomization unit — user-level (consistent experience) or request-level (more statistical power). 3) Metrics — online metrics (CTR, conversion) + guardrail metrics (latency, error rate). 4) Statistical significance — run until p-value < 0.05 with sufficient power. 5) Novelty effect — users engage more with anything new, wait 1-2 weeks. 6) Canary deployment — start with 1% traffic, gradually increase. Shadow mode: run new model in parallel without serving results, compare offline.'
    }
  ]
};
