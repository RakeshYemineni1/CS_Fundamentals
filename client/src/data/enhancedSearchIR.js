export const enhancedSearchIR = {
  id: 'search-information-retrieval',
  title: 'Search & Information Retrieval',
  subtitle: 'Inverted Index, TF-IDF, BM25, Query Processing, and Learning to Rank',
  summary: 'Information retrieval is the science of finding relevant documents from a large corpus given a query. It powers Google Search, Elasticsearch, Solr, and every search box in every application. Understanding inverted indexes, TF-IDF, BM25, and learning to rank is essential for any SDE working on search.',
  analogy: 'An inverted index is like the index at the back of a textbook. Instead of reading every page to find "neural network," you look up the word in the index and it tells you exactly which pages contain it. TF-IDF is the librarian deciding which pages are most relevant — a page that mentions "neural network" 20 times is probably more relevant than one that mentions it once.',

  explanation: `WHY SEARCH & IR MATTERS FOR SDEs

Search is everywhere — product search, document search, code search, log search, semantic search. Every company with data has a search problem. Elasticsearch is one of the most deployed databases in the world. If you interview at Google, Elastic, Algolia, Lucene-based companies, or any company with a search feature, this is tested.

═══════════════════════════════════════════════════════════════

THE INVERTED INDEX

The core data structure of all search engines.

FORWARD INDEX: document → list of words
- Document 1: ["the", "cat", "sat", "on", "the", "mat"]
- Document 2: ["the", "dog", "ran", "in", "the", "park"]

INVERTED INDEX: word → list of documents (and positions)
- "the": [Doc1: [0,4], Doc2: [0,4]]
- "cat": [Doc1: [1]]
- "dog": [Doc2: [1]]
- "sat": [Doc1: [2]]

POSTING LIST: for each term, a sorted list of (doc_id, frequency, positions)
- Sorted by doc_id for efficient intersection (AND queries)
- Compressed with delta encoding (store differences, not absolute IDs)

BUILDING THE INDEX:
1. Tokenize documents (split into terms)
2. Normalize (lowercase, remove punctuation)
3. Remove stop words ("the", "a", "is")
4. Stemming/Lemmatization ("running" → "run")
5. Build posting lists for each term
6. Sort and compress

QUERY PROCESSING:
AND query ("cat AND dog"): intersect posting lists
OR query ("cat OR dog"): union posting lists
NOT query ("cat NOT dog"): difference of posting lists
Phrase query ("cat sat"): find docs where terms appear adjacent

BOOLEAN RETRIEVAL:
Simple AND/OR/NOT — returns exact matches, no ranking.
Problem: too many or too few results, no relevance ordering.

═══════════════════════════════════════════════════════════════

TF-IDF (Term Frequency - Inverse Document Frequency)

Assigns a weight to each (term, document) pair based on:
1. How often the term appears in the document (TF)
2. How rare the term is across all documents (IDF)

TERM FREQUENCY (TF):
TF(t, d) = count of term t in document d / total terms in d
Intuition: a document mentioning "neural network" 10 times is more about it than one mentioning it once.

Variants:
- Raw count: TF = count(t, d)
- Log normalization: TF = 1 + log(count(t, d)) — dampens effect of very high counts
- Augmented: TF = 0.5 + 0.5 × count(t,d) / max_count(d) — prevents bias toward long docs

INVERSE DOCUMENT FREQUENCY (IDF):
IDF(t) = log(N / df(t))
N: total number of documents
df(t): number of documents containing term t

Intuition: "the" appears in every document → IDF ≈ 0 (not useful for ranking)
"neural" appears in few documents → high IDF (very discriminative)

TF-IDF SCORE:
TF-IDF(t, d) = TF(t, d) × IDF(t)

DOCUMENT RANKING:
For a multi-term query q = {t1, t2, ..., tk}:
Score(d, q) = Σ TF-IDF(ti, d) for all ti in q

═══════════════════════════════════════════════════════════════

BM25 (Best Match 25)

The gold standard for keyword search. Used by Elasticsearch, Solr, Lucene.
Improves on TF-IDF with better term frequency saturation and document length normalization.

BM25 FORMULA:
Score(d, q) = Σ IDF(ti) × [TF(ti,d) × (k1+1)] / [TF(ti,d) + k1 × (1 - b + b × |d|/avgdl)]

Where:
- k1: term frequency saturation parameter (typically 1.2-2.0)
  - Controls how much additional occurrences of a term increase the score
  - High k1: more occurrences = much higher score (no saturation)
  - Low k1: diminishing returns quickly (strong saturation)
- b: document length normalization (typically 0.75)
  - b=0: no length normalization
  - b=1: full normalization (longer docs penalized)
- |d|: document length (number of terms)
- avgdl: average document length in corpus

KEY IMPROVEMENTS OVER TF-IDF:
1. Term frequency saturation: score increases with TF but with diminishing returns
   - TF-IDF: score grows linearly with TF
   - BM25: score asymptotically approaches a maximum (k1+1) × IDF
2. Document length normalization: longer documents are penalized
   - A 10,000-word document mentioning "cat" once is less relevant than a 100-word document mentioning it once

BM25 IDF:
IDF(t) = log((N - df(t) + 0.5) / (df(t) + 0.5) + 1)
Slightly different from TF-IDF IDF, handles edge cases better.

═══════════════════════════════════════════════════════════════

QUERY UNDERSTANDING

QUERY EXPANSION:
Add related terms to improve recall.
- Synonym expansion: "car" → "car OR automobile OR vehicle"
- Stemming: "running" → "run"
- Spell correction: "nural network" → "neural network"
- Acronym expansion: "ML" → "machine learning"

QUERY CLASSIFICATION:
Classify query intent before retrieval:
- Navigational: user wants a specific page ("Facebook login")
- Informational: user wants to learn ("how does BM25 work")
- Transactional: user wants to do something ("buy iPhone 15")

QUERY REWRITING:
Transform query to improve results:
- Remove stop words
- Expand abbreviations
- Add context from user history

═══════════════════════════════════════════════════════════════

LEARNING TO RANK (LTR)

Use machine learning to rank search results better than BM25 alone.

FEATURE ENGINEERING FOR LTR:
Query-document features:
- BM25 score, TF-IDF score
- Query term coverage (fraction of query terms in document)
- Semantic similarity (embedding cosine similarity)
- Field-specific scores (title match vs body match)

Document features:
- PageRank / authority score
- Document freshness (recency)
- Click-through rate (CTR) from logs
- Document length

Query features:
- Query length
- Query type (navigational/informational/transactional)

THREE APPROACHES:

Pointwise: treat each (query, document) pair independently
- Predict relevance score for each document
- Standard regression/classification
- Ignores relative ordering

Pairwise: learn from pairs of documents
- For each query, learn which of two documents is more relevant
- RankNet, LambdaRank
- More natural for ranking than pointwise

Listwise: optimize ranking of entire list
- Directly optimize ranking metrics (NDCG)
- LambdaMART (gradient boosted trees) — most popular in practice
- ListNet, AdaRank

LAMBDAMART:
- Gradient boosted decision trees
- Optimizes NDCG directly
- Used by Bing, Yahoo, and most production LTR systems
- Features: BM25, TF-IDF, PageRank, CTR, freshness, semantic similarity

═══════════════════════════════════════════════════════════════

ELASTICSEARCH ARCHITECTURE

CLUSTER: multiple nodes working together
NODE: single server in the cluster
INDEX: collection of documents (like a database)
SHARD: horizontal partition of an index
REPLICA: copy of a shard for fault tolerance and read scaling

WRITE PATH:
1. Document sent to coordinating node
2. Routed to primary shard (based on doc_id hash)
3. Indexed (inverted index updated)
4. Replicated to replica shards
5. Acknowledged to client

READ PATH:
1. Query sent to coordinating node
2. Broadcast to all shards (primary or replica)
3. Each shard returns top-K results
4. Coordinating node merges and re-ranks
5. Returns final results

RELEVANCE SCORING:
Elasticsearch uses BM25 by default (since v5.0, replaced TF-IDF).
Custom scoring: function_score query, script_score.

NEAR-REAL-TIME SEARCH:
Documents indexed in memory buffer → flushed to segment every 1 second.
Segments are immutable — updates = delete + re-index.
Merge process combines small segments into larger ones.`,

  keyPoints: [
    'Inverted index: term → posting list (doc_id, frequency, positions) — core data structure of all search engines',
    'TF-IDF: term frequency × inverse document frequency — rare terms in relevant docs score highest',
    'BM25: improves TF-IDF with term frequency saturation (k1) and document length normalization (b)',
    'BM25 parameters: k1=1.2-2.0 (TF saturation), b=0.75 (length normalization) — Elasticsearch defaults',
    'Query expansion: synonyms, stemming, spell correction — improves recall',
    'Learning to Rank: use ML (LambdaMART) to rank results using BM25 + semantic + CTR features',
    'Elasticsearch: distributed inverted index — shards for scale, replicas for availability',
    'Hybrid search: BM25 (keyword) + vector similarity (semantic) + RRF fusion = best results'
  ],

  codeExamples: [
    {
      title: 'BM25 from Scratch',
      language: 'python',
      description: 'Implement BM25 ranking from scratch and compare with TF-IDF.',
      code: `import numpy as np
import math
from collections import defaultdict, Counter

# ============================================
# BM25 IMPLEMENTATION FROM SCRATCH
# ============================================

class BM25:
    def __init__(self, k1=1.5, b=0.75):
        self.k1 = k1  # Term frequency saturation
        self.b = b    # Document length normalization
        self.corpus = []
        self.doc_freqs = []
        self.idf = {}
        self.doc_len = []
        self.avgdl = 0
        self.N = 0

    def fit(self, corpus: list):
        """Build BM25 index from corpus."""
        self.corpus = corpus
        self.N = len(corpus)

        # Tokenize and compute term frequencies per document
        self.doc_freqs = []
        self.doc_len = []
        df = defaultdict(int)  # Document frequency per term

        for doc in corpus:
            tokens = self._tokenize(doc)
            self.doc_len.append(len(tokens))
            tf = Counter(tokens)
            self.doc_freqs.append(tf)
            for term in tf:
                df[term] += 1

        self.avgdl = sum(self.doc_len) / self.N

        # Compute IDF for each term
        for term, freq in df.items():
            self.idf[term] = math.log(
                (self.N - freq + 0.5) / (freq + 0.5) + 1
            )

        return self

    def _tokenize(self, text: str) -> list:
        """Simple tokenizer: lowercase, split on whitespace."""
        return text.lower().split()

    def score(self, query: str, doc_idx: int) -> float:
        """Compute BM25 score for a (query, document) pair."""
        query_terms = self._tokenize(query)
        tf = self.doc_freqs[doc_idx]
        dl = self.doc_len[doc_idx]
        score = 0.0

        for term in query_terms:
            if term not in self.idf:
                continue
            tf_td = tf.get(term, 0)
            # BM25 term score
            numerator = tf_td * (self.k1 + 1)
            denominator = tf_td + self.k1 * (1 - self.b + self.b * dl / self.avgdl)
            score += self.idf[term] * (numerator / denominator)

        return score

    def search(self, query: str, top_k: int = 5) -> list:
        """Return top-K documents for a query."""
        scores = [(i, self.score(query, i)) for i in range(self.N)]
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]


# ============================================
# EXAMPLE: SEARCH OVER TECH DOCUMENTS
# ============================================

corpus = [
    "Python is a high-level programming language with clean readable syntax",
    "Machine learning algorithms learn patterns from training data automatically",
    "Docker containers package applications with all their dependencies",
    "Kubernetes orchestrates containerized applications across a cluster of machines",
    "PostgreSQL is a powerful open-source relational database with ACID compliance",
    "Redis is an in-memory key-value store used for caching and session management",
    "Neural networks are computing systems inspired by biological brain structure",
    "The transformer architecture uses self-attention to process sequences in parallel",
    "Git is a distributed version control system for tracking source code changes",
    "REST APIs use HTTP methods like GET POST PUT DELETE for client-server communication",
    "GraphQL provides a flexible query language allowing clients to request specific data",
    "Microservices architecture decomposes applications into small independent services",
    "BM25 is the gold standard ranking function used by Elasticsearch and Solr",
    "TF-IDF weights terms by frequency in document and rarity across corpus",
    "Inverted index maps terms to posting lists for fast document retrieval",
]

bm25 = BM25(k1=1.5, b=0.75)
bm25.fit(corpus)

queries = [
    "how do containers work",
    "database for storing data",
    "search ranking algorithm",
    "machine learning neural network",
]

for query in queries:
    print(f"\nQuery: '{query}'")
    results = bm25.search(query, top_k=3)
    for rank, (doc_idx, score) in enumerate(results, 1):
        print(f"  {rank}. [{score:.3f}] {corpus[doc_idx][:70]}")

# ============================================
# BM25 PARAMETER SENSITIVITY
# ============================================

print("\nBM25 PARAMETER SENSITIVITY:")
print("k1 controls TF saturation:")
for k1 in [0.5, 1.2, 2.0, 5.0]:
    bm25_test = BM25(k1=k1, b=0.75)
    bm25_test.fit(corpus)
    results = bm25_test.search("machine learning", top_k=1)
    doc_idx, score = results[0]
    print(f"  k1={k1}: top result score={score:.3f} — '{corpus[doc_idx][:50]}'")

print("\nb controls document length normalization:")
for b in [0.0, 0.25, 0.75, 1.0]:
    bm25_test = BM25(k1=1.5, b=b)
    bm25_test.fit(corpus)
    results = bm25_test.search("database", top_k=1)
    doc_idx, score = results[0]
    print(f"  b={b}: top result score={score:.3f} — '{corpus[doc_idx][:50]}'")`
    },
    {
      title: 'Elasticsearch Query Patterns',
      language: 'python',
      description: 'Common Elasticsearch query patterns for production search systems.',
      code: `# pip install elasticsearch
from elasticsearch import Elasticsearch
import json

# ============================================
# ELASTICSEARCH SETUP AND INDEXING
# ============================================

es = Elasticsearch("http://localhost:9200")

# Create index with custom mapping
index_name = "tech_articles"

mapping = {
    "settings": {
        "number_of_shards": 3,
        "number_of_replicas": 1,
        "analysis": {
            "analyzer": {
                "custom_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "stop", "snowball"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "custom_analyzer",
                "boost": 2.0  # Title matches worth 2x body matches
            },
            "body": {
                "type": "text",
                "analyzer": "custom_analyzer"
            },
            "category": {"type": "keyword"},  # Exact match, not analyzed
            "published_date": {"type": "date"},
            "view_count": {"type": "integer"},
            "embedding": {
                "type": "dense_vector",
                "dims": 384,
                "index": True,
                "similarity": "cosine"
            }
        }
    }
}

# es.indices.create(index=index_name, body=mapping)

# ============================================
# QUERY PATTERNS
# ============================================

# 1. BASIC FULL-TEXT SEARCH (BM25)
basic_query = {
    "query": {
        "multi_match": {
            "query": "machine learning neural network",
            "fields": ["title^2", "body"],  # Title matches weighted 2x
            "type": "best_fields",
            "fuzziness": "AUTO"  # Handle typos
        }
    },
    "size": 10
}

# 2. FILTERED SEARCH (BM25 + filter)
filtered_query = {
    "query": {
        "bool": {
            "must": {
                "multi_match": {
                    "query": "containerization deployment",
                    "fields": ["title^2", "body"]
                }
            },
            "filter": [
                {"term": {"category": "devops"}},
                {"range": {"published_date": {"gte": "2023-01-01"}}},
                {"range": {"view_count": {"gte": 100}}}
            ]
        }
    }
}

# 3. HYBRID SEARCH (BM25 + Vector similarity)
hybrid_query = {
    "query": {
        "bool": {
            "should": [
                # BM25 keyword search
                {
                    "multi_match": {
                        "query": "how to deploy containers",
                        "fields": ["title^2", "body"],
                        "boost": 0.3
                    }
                },
                # Vector similarity search
                {
                    "knn": {
                        "field": "embedding",
                        "query_vector": [0.1] * 384,  # Replace with actual query embedding
                        "num_candidates": 100,
                        "boost": 0.7
                    }
                }
            ]
        }
    }
}

# 4. FUNCTION SCORE (boost by recency and popularity)
function_score_query = {
    "query": {
        "function_score": {
            "query": {
                "multi_match": {
                    "query": "python tutorial",
                    "fields": ["title^2", "body"]
                }
            },
            "functions": [
                # Boost recent articles
                {
                    "gauss": {
                        "published_date": {
                            "origin": "now",
                            "scale": "30d",
                            "decay": 0.5
                        }
                    },
                    "weight": 1.5
                },
                # Boost popular articles
                {
                    "field_value_factor": {
                        "field": "view_count",
                        "factor": 0.001,
                        "modifier": "log1p"
                    }
                }
            ],
            "score_mode": "multiply",
            "boost_mode": "multiply"
        }
    }
}

# 5. AGGREGATIONS (faceted search)
faceted_query = {
    "query": {"match": {"body": "machine learning"}},
    "aggs": {
        "categories": {
            "terms": {"field": "category", "size": 10}
        },
        "date_histogram": {
            "date_histogram": {
                "field": "published_date",
                "calendar_interval": "month"
            }
        },
        "avg_views": {
            "avg": {"field": "view_count"}
        }
    },
    "size": 10
}

print("Elasticsearch Query Patterns:")
print("1. Basic BM25 full-text search")
print("2. Filtered search (BM25 + structured filters)")
print("3. Hybrid search (BM25 + vector similarity)")
print("4. Function score (boost by recency + popularity)")
print("5. Aggregations (faceted search)")
print()
print("Key Elasticsearch concepts:")
print("  - Shards: horizontal partitions for scale")
print("  - Replicas: copies for availability and read throughput")
print("  - Segments: immutable Lucene index files")
print("  - Refresh interval: 1s default (near-real-time search)")
print("  - BM25 default since ES 5.0 (replaced TF-IDF)")`
    }
  ],

  resources: [
    {
      title: 'Introduction to Information Retrieval - Stanford',
      url: 'https://nlp.stanford.edu/IR-book/',
      description: 'Free textbook — the definitive reference for IR concepts'
    },
    {
      title: 'Elasticsearch Documentation',
      url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html',
      description: 'Official Elasticsearch docs — query DSL, mappings, aggregations'
    },
    {
      title: 'BM25 Explained - Elastic Blog',
      url: 'https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables',
      description: 'Practical explanation of BM25 parameters and tuning'
    },
    {
      title: 'Learning to Rank - Microsoft Research',
      url: 'https://www.microsoft.com/en-us/research/project/mslr/',
      description: 'Microsoft Learning to Rank datasets and research'
    }
  ],

  questions: [
    {
      question: 'What is an inverted index and how does it enable fast search?',
      answer: 'An inverted index maps each term to a posting list — a sorted list of (doc_id, frequency, positions) for all documents containing that term. Enables fast search: AND query = intersect posting lists (merge sorted lists in O(n)), OR query = union, phrase query = find adjacent positions. Without inverted index, searching N documents for a term = O(N). With inverted index = O(df(t)) where df(t) is the number of documents containing the term — much faster for rare terms.'
    },
    {
      question: 'What is BM25 and how does it improve on TF-IDF?',
      answer: 'BM25 improves TF-IDF in two ways: 1) Term frequency saturation (k1 parameter): TF-IDF score grows linearly with term frequency, but BM25 score asymptotically approaches a maximum — the 100th occurrence of a term adds much less than the 1st. 2) Document length normalization (b parameter): longer documents are penalized — a 10,000-word document mentioning "cat" once is less relevant than a 100-word document. BM25 is the default in Elasticsearch, Solr, and Lucene. Typical parameters: k1=1.2-2.0, b=0.75.'
    },
    {
      question: 'What is Learning to Rank and what are the three approaches?',
      answer: 'Learning to Rank uses ML to rank search results better than BM25 alone. Features: BM25 score, semantic similarity, CTR, PageRank, freshness. Three approaches: Pointwise — predict relevance score for each document independently (standard regression, ignores ordering). Pairwise — learn which of two documents is more relevant (RankNet, LambdaRank). Listwise — optimize ranking of entire list, directly optimize NDCG (LambdaMART — most popular in production). LambdaMART (gradient boosted trees) is used by Bing, Yahoo, and most production systems.'
    },
    {
      question: 'How does Elasticsearch scale to billions of documents?',
      answer: 'Elasticsearch scales via sharding: each index is split into N primary shards, each shard is a full Lucene index. Documents routed to shards by hash(doc_id) % N. Replicas: each primary shard has R replica shards for fault tolerance and read scaling. Query execution: coordinating node broadcasts query to all shards, each shard returns top-K results, coordinating node merges and re-ranks. Write: primary shard indexes, replicates to replicas. Near-real-time: documents visible within 1 second (refresh interval).'
    },
    {
      question: 'What is hybrid search and why is it better than pure vector or keyword search?',
      answer: 'Hybrid search combines BM25 keyword search with vector similarity search. Pure keyword (BM25): misses semantic meaning — "automobile" doesn\'t match "car." Pure vector: misses exact keyword matches — product codes, names, rare terms. Hybrid: best of both. Implementation: run BM25 and vector search in parallel, merge results with Reciprocal Rank Fusion (RRF). RRF score = Σ(1/(k+rank)) across all lists. Elasticsearch supports hybrid search natively with knn + multi_match in a bool query.'
    },
    {
      question: 'What is query expansion and when should you use it?',
      answer: 'Query expansion adds related terms to improve recall (find more relevant documents). Types: Synonym expansion ("car" → "car OR automobile OR vehicle"), stemming ("running" → "run"), spell correction ("nural" → "neural"), acronym expansion ("ML" → "machine learning"), pseudo-relevance feedback (take top results, extract key terms, re-query). Use when: recall is low (users not finding what they need), domain has many synonyms or abbreviations. Risk: can hurt precision if expansion adds irrelevant terms. Evaluate with A/B tests.'
    }
  ]
};
