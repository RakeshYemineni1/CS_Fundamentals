export const enhancedKnowledgeGraphs = {
  id: 'knowledge-graphs',
  title: 'Knowledge Graphs & Structured Data in AI',
  subtitle: 'Graph Databases, Entity Linking, Knowledge-Augmented Generation, and GraphRAG',
  summary: 'Knowledge graphs represent information as entities and relationships in a graph structure. They power Google Knowledge Panel, LinkedIn\'s people graph, and enterprise AI systems. For SDEs, understanding graph databases, entity linking, and how to combine knowledge graphs with LLMs (GraphRAG) is increasingly important.',
  analogy: 'A knowledge graph is like a city map where every landmark (entity) is connected to other landmarks by labeled roads (relationships). "Paris" is connected to "France" by "is capital of," to "Eiffel Tower" by "contains," and to "French" by "official language is." An LLM is like a person who has read about the city but might misremember details. The knowledge graph is the authoritative map they can consult.',

  explanation: `WHAT IS A KNOWLEDGE GRAPH?

A knowledge graph represents knowledge as a collection of entities (nodes) and relationships (edges) between them. Each fact is a triple: (Subject, Predicate, Object).

Examples:
- (Python, created_by, Guido van Rossum)
- (Python, first_released, 1991)
- (TensorFlow, developed_by, Google)
- (TensorFlow, written_in, Python)
- (Google, headquartered_in, Mountain View)

This structured representation enables:
- Precise factual queries ("Who created Python?")
- Multi-hop reasoning ("What language is TensorFlow written in, and who created that language?")
- Relationship discovery ("What do Python and TensorFlow have in common?")

FAMOUS KNOWLEDGE GRAPHS:
- Google Knowledge Graph: powers Knowledge Panel in search results
- Wikidata: open knowledge graph with 100M+ items
- DBpedia: structured data extracted from Wikipedia
- LinkedIn Economic Graph: people, companies, jobs, skills
- Facebook Social Graph: people, friendships, interests
- Amazon Product Graph: products, categories, attributes, relationships

═══════════════════════════════════════════════════════════════

GRAPH DATABASE FUNDAMENTALS

WHY NOT RELATIONAL DATABASES?
Relational DBs store relationships as foreign keys — multi-hop queries require expensive JOINs.
"Find all colleagues of colleagues of Alice who work at Google" = 3 JOINs = slow.
Graph DBs traverse relationships natively — same query = fast graph traversal.

PROPERTY GRAPH MODEL:
- Nodes: entities with labels and properties
  - (:Person {name: "Alice", age: 30})
  - (:Company {name: "Google", founded: 1998})
- Edges: directed relationships with type and properties
  - (Alice)-[:WORKS_AT {since: 2020}]->(Google)
  - (Alice)-[:KNOWS {since: 2015}]->(Bob)

RDF (Resource Description Framework):
- W3C standard for knowledge representation
- Triples: (subject, predicate, object)
- URIs identify entities: <http://dbpedia.org/resource/Python_(programming_language)>
- SPARQL: query language for RDF graphs

POPULAR GRAPH DATABASES:

Neo4j:
- Most popular graph database
- Property graph model
- Cypher query language (intuitive, SQL-like)
- ACID transactions
- Used by: LinkedIn, eBay, NASA, Walmart

Amazon Neptune:
- Managed graph database on AWS
- Supports both Property Graph (Gremlin) and RDF (SPARQL)
- Highly available, scales to billions of edges

TigerGraph:
- Distributed graph database
- Designed for real-time deep link analytics
- Used by: Uber, Twitter, Intuit

ArangoDB:
- Multi-model: graph + document + key-value
- AQL query language

CYPHER QUERY LANGUAGE (Neo4j):
Pattern matching syntax: (node)-[:RELATIONSHIP]->(node)

MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WHERE c.name = "Google"
RETURN p.name, p.age

MATCH (a:Person {name: "Alice"})-[:KNOWS*2..3]-(b:Person)
RETURN DISTINCT b.name  -- Friends of friends (2-3 hops)

═══════════════════════════════════════════════════════════════

ENTITY LINKING AND NAMED ENTITY RECOGNITION

NAMED ENTITY RECOGNITION (NER):
Identify and classify entities in text:
- "Apple released the iPhone 15 in September 2023 in Cupertino."
- Apple → ORG
- iPhone 15 → PRODUCT
- September 2023 → DATE
- Cupertino → LOC

ENTITY LINKING (EL) / ENTITY DISAMBIGUATION:
Link extracted entities to their canonical representation in a knowledge base.
- "Apple" → Apple Inc. (not apple the fruit)
- "Paris" → Paris, France (not Paris, Texas)
- "Python" → Python programming language (not the snake)

PIPELINE:
1. NER: extract entity mentions from text
2. Candidate generation: find candidate entities in KB for each mention
3. Entity disambiguation: select the correct candidate using context
4. Linking: connect mention to KB entity

TOOLS:
- spaCy: NER with pre-trained models
- NLTK: classic NLP toolkit
- Hugging Face NER models: BERT-based, state-of-the-art
- REL (Radboud Entity Linker): end-to-end entity linking
- BLINK (Facebook): bi-encoder entity linking

═══════════════════════════════════════════════════════════════

KNOWLEDGE GRAPHS + LLMs

PROBLEM WITH PURE LLMs:
- Hallucinate facts ("Python was created in 1985" — wrong, it was 1991)
- Knowledge cutoff (don't know recent events)
- Can't do precise multi-hop reasoning reliably
- No source attribution

PROBLEM WITH PURE KNOWLEDGE GRAPHS:
- Can't handle natural language queries directly
- Rigid schema — can't answer questions outside the graph
- No language understanding or generation

SOLUTION: COMBINE BOTH

KNOWLEDGE-AUGMENTED GENERATION:
1. Extract entities from user query (NER + entity linking)
2. Query knowledge graph for relevant facts
3. Inject facts into LLM prompt as structured context
4. LLM generates natural language answer grounded in KG facts

Example:
Query: "What programming language was TensorFlow written in, and who created that language?"
1. Extract: TensorFlow, programming language
2. KG query: TensorFlow → written_in → Python → created_by → Guido van Rossum
3. Inject: "TensorFlow is written in Python. Python was created by Guido van Rossum."
4. LLM: "TensorFlow is written in Python, which was created by Guido van Rossum in 1991."

GRAPHRAG (Microsoft):
Combines knowledge graph construction with RAG.
1. Build a knowledge graph from documents (extract entities and relationships)
2. Create community summaries (summarize clusters of related entities)
3. At query time: retrieve relevant graph communities + document chunks
4. LLM generates answer using both graph structure and text

Benefits over standard RAG:
- Better for global questions ("What are the main themes in this document set?")
- Captures relationships between entities across documents
- More structured reasoning

GRAPH NEURAL NETWORKS (GNNs) FOR KNOWLEDGE GRAPHS:
- Learn embeddings for entities and relationships
- TransE: entity + relation ≈ tail entity (h + r ≈ t)
- RotatE: relation as rotation in complex space
- Used for: link prediction (predict missing relationships), entity classification

═══════════════════════════════════════════════════════════════

PRACTICAL USE CASES FOR SDEs

FRAUD DETECTION:
- Graph of accounts, devices, IP addresses, transactions
- Fraud rings: clusters of connected fraudulent accounts
- Graph algorithms: community detection, PageRank for suspicious nodes
- GNN: classify nodes as fraudulent based on neighborhood

RECOMMENDATION SYSTEMS:
- User-item-attribute graph
- Graph traversal: "users who bought X also bought Y"
- Knowledge graph enrichment: item attributes from product KG

ENTERPRISE SEARCH:
- Build KG from company documents, emails, wikis
- Entity-aware search: "find documents about our partnership with Acme Corp"
- Relationship queries: "who worked on Project X and also knows Python?"

DRUG DISCOVERY:
- KG of drugs, proteins, diseases, side effects
- Link prediction: predict new drug-disease relationships
- Used by: BioNTech, Pfizer, AstraZeneca

CUSTOMER 360:
- Unified graph of customer interactions, purchases, support tickets
- Multi-hop queries: "customers who bought X and had a support issue in the last 30 days"`,

  keyPoints: [
    'Knowledge graph: entities (nodes) + relationships (edges) as triples (Subject, Predicate, Object)',
    'Graph DBs vs relational: multi-hop traversal is native and fast vs expensive JOINs',
    'Neo4j + Cypher: most popular graph DB — pattern matching queries like (a)-[:KNOWS]->(b)',
    'NER: extract entities from text. Entity linking: map mentions to canonical KB entries',
    'Knowledge-augmented generation: extract entities → query KG → inject facts → LLM generates answer',
    'GraphRAG: build KG from documents, use graph communities + text chunks for richer RAG',
    'GNNs: learn entity/relation embeddings for link prediction and entity classification',
    'Use cases: fraud detection (fraud rings), recommendations, enterprise search, drug discovery'
  ],

  codeExamples: [
    {
      title: 'Knowledge Graph with Neo4j',
      language: 'python',
      description: 'Build and query a knowledge graph using Neo4j and Python.',
      code: `# pip install neo4j
from neo4j import GraphDatabase
import json

# ============================================
# NEO4J KNOWLEDGE GRAPH
# ============================================

class KnowledgeGraph:
    def __init__(self, uri="bolt://localhost:7687",
                 user="neo4j", password="password"):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def run_query(self, query: str, params: dict = None):
        with self.driver.session() as session:
            result = session.run(query, params or {})
            return [record.data() for record in result]

    # ============================================
    # BUILD THE GRAPH
    # ============================================

    def create_tech_knowledge_graph(self):
        """Build a tech knowledge graph with languages, frameworks, companies."""

        # Create nodes and relationships
        queries = [
            # Programming languages
            "MERGE (py:Language {name: 'Python', created: 1991})",
            "MERGE (js:Language {name: 'JavaScript', created: 1995})",
            "MERGE (go:Language {name: 'Go', created: 2009})",
            "MERGE (rs:Language {name: 'Rust', created: 2010})",

            # Frameworks
            "MERGE (tf:Framework {name: 'TensorFlow', type: 'ML'})",
            "MERGE (pt:Framework {name: 'PyTorch', type: 'ML'})",
            "MERGE (react:Framework {name: 'React', type: 'Frontend'})",
            "MERGE (dj:Framework {name: 'Django', type: 'Backend'})",

            # Companies
            "MERGE (google:Company {name: 'Google', founded: 1998})",
            "MERGE (meta:Company {name: 'Meta', founded: 2004})",
            "MERGE (ms:Company {name: 'Microsoft', founded: 1975})",

            # People
            "MERGE (guido:Person {name: 'Guido van Rossum'})",
            "MERGE (brendan:Person {name: 'Brendan Eich'})",

            # Relationships
            "MATCH (py:Language {name:'Python'}), (guido:Person {name:'Guido van Rossum'}) "
            "MERGE (guido)-[:CREATED]->(py)",

            "MATCH (js:Language {name:'JavaScript'}), (brendan:Person {name:'Brendan Eich'}) "
            "MERGE (brendan)-[:CREATED]->(js)",

            "MATCH (tf:Framework {name:'TensorFlow'}), (py:Language {name:'Python'}) "
            "MERGE (tf)-[:WRITTEN_IN]->(py)",

            "MATCH (pt:Framework {name:'PyTorch'}), (py:Language {name:'Python'}) "
            "MERGE (pt)-[:WRITTEN_IN]->(py)",

            "MATCH (react:Framework {name:'React'}), (js:Language {name:'JavaScript'}) "
            "MERGE (react)-[:WRITTEN_IN]->(js)",

            "MATCH (tf:Framework {name:'TensorFlow'}), (google:Company {name:'Google'}) "
            "MERGE (google)-[:DEVELOPED]->(tf)",

            "MATCH (pt:Framework {name:'PyTorch'}), (meta:Company {name:'Meta'}) "
            "MERGE (meta)-[:DEVELOPED]->(pt)",

            "MATCH (react:Framework {name:'React'}), (meta:Company {name:'Meta'}) "
            "MERGE (meta)-[:DEVELOPED]->(react)",
        ]

        for query in queries:
            self.run_query(query)
        print("Knowledge graph created successfully")

    # ============================================
    # QUERY THE GRAPH
    # ============================================

    def find_frameworks_by_language(self, language: str) -> list:
        """Find all frameworks written in a given language."""
        result = self.run_query("""
            MATCH (f:Framework)-[:WRITTEN_IN]->(l:Language {name: $language})
            RETURN f.name AS framework, f.type AS type
            ORDER BY f.name
        """, {"language": language})
        return result

    def find_company_tech_stack(self, company: str) -> list:
        """Find all technologies developed by a company."""
        result = self.run_query("""
            MATCH (c:Company {name: $company})-[:DEVELOPED]->(f:Framework)
            -[:WRITTEN_IN]->(l:Language)
            RETURN f.name AS framework, l.name AS language, f.type AS type
        """, {"company": company})
        return result

    def multi_hop_query(self, person: str) -> list:
        """Find all companies connected to a person through their creations."""
        result = self.run_query("""
            MATCH (p:Person {name: $person})-[:CREATED]->(l:Language)
            <-[:WRITTEN_IN]-(f:Framework)
            <-[:DEVELOPED]-(c:Company)
            RETURN p.name AS person, l.name AS language,
                   f.name AS framework, c.name AS company
        """, {"person": person})
        return result

    def find_shortest_path(self, from_node: str, to_node: str) -> list:
        """Find shortest path between two entities."""
        result = self.run_query("""
            MATCH path = shortestPath(
                (a {name: $from_node})-[*]-(b {name: $to_node})
            )
            RETURN [node in nodes(path) | node.name] AS path_nodes,
                   length(path) AS hops
        """, {"from_node": from_node, "to_node": to_node})
        return result


# ============================================
# KNOWLEDGE-AUGMENTED GENERATION
# ============================================

def knowledge_augmented_answer(query: str, kg: KnowledgeGraph) -> str:
    """Answer a query by combining KG facts with LLM generation."""
    from openai import OpenAI
    client = OpenAI(api_key="<your-api-key>")

    # Step 1: Extract entities from query (simplified)
    entities = []
    tech_entities = ["Python", "TensorFlow", "PyTorch", "React", "Google", "Meta"]
    for entity in tech_entities:
        if entity.lower() in query.lower():
            entities.append(entity)

    # Step 2: Query knowledge graph for relevant facts
    facts = []
    for entity in entities:
        # Get frameworks written in this language
        if entity in ["Python", "JavaScript"]:
            frameworks = kg.find_frameworks_by_language(entity)
            for f in frameworks:
                facts.append(f"{f['framework']} is written in {entity}")

        # Get company tech stack
        if entity in ["Google", "Meta", "Microsoft"]:
            stack = kg.find_company_tech_stack(entity)
            for s in stack:
                facts.append(f"{entity} developed {s['framework']} (written in {s['language']})")

    # Step 3: Build prompt with KG facts
    facts_text = "\n".join(f"- {fact}" for fact in facts) if facts else "No relevant facts found."

    prompt = f"""Answer the following question using the provided facts.
Only use information from the facts — do not add information not present.

Facts from knowledge graph:
{facts_text}

Question: {query}

Answer:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content

# Demo (requires Neo4j running locally)
print("Knowledge Graph + LLM Integration Pattern:")
print("1. Extract entities from query")
print("2. Query KG for relevant facts")
print("3. Inject facts into LLM prompt")
print("4. LLM generates grounded answer")
print()
print("Example Cypher queries:")
print("  MATCH (f:Framework)-[:WRITTEN_IN]->(l:Language {name: 'Python'})")
print("  RETURN f.name, f.type")
print()
print("  MATCH (p:Person)-[:CREATED]->(l)<-[:WRITTEN_IN]-(f)<-[:DEVELOPED]-(c)")
print("  RETURN p.name, l.name, f.name, c.name")`
    },
    {
      title: 'Entity Linking and GraphRAG',
      language: 'python',
      description: 'Implement entity linking and a simplified GraphRAG pipeline.',
      code: `# pip install spacy transformers sentence-transformers
import spacy
import numpy as np
from collections import defaultdict

# ============================================
# NAMED ENTITY RECOGNITION WITH spaCy
# ============================================

# Load spaCy model: python -m spacy download en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
except:
    SPACY_AVAILABLE = False
    print("spaCy model not loaded — showing conceptual output")

def extract_entities(text: str) -> list:
    """Extract named entities from text."""
    if not SPACY_AVAILABLE:
        # Simulated output
        return [
            {"text": "Python", "label": "PRODUCT", "start": 0, "end": 6},
            {"text": "Guido van Rossum", "label": "PERSON", "start": 20, "end": 36},
            {"text": "1991", "label": "DATE", "start": 50, "end": 54},
        ]

    doc = nlp(text)
    return [
        {
            "text": ent.text,
            "label": ent.label_,
            "start": ent.start_char,
            "end": ent.end_char
        }
        for ent in doc.ents
    ]

# Test NER
sample_text = "Python was created by Guido van Rossum and first released in 1991. Google developed TensorFlow in 2015."
entities = extract_entities(sample_text)
print("NAMED ENTITY RECOGNITION:")
for ent in entities:
    print(f"  '{ent['text']}' → {ent['label']}")

# ============================================
# SIMPLE ENTITY LINKER
# ============================================

class SimpleEntityLinker:
    """Link entity mentions to a knowledge base."""

    def __init__(self):
        from sentence_transformers import SentenceTransformer
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')

        # Knowledge base: entity name → canonical ID + description
        self.kb = {
            "python_lang": {
                "name": "Python (programming language)",
                "aliases": ["Python", "python", "Python3", "Python 3"],
                "description": "High-level programming language created by Guido van Rossum"
            },
            "python_snake": {
                "name": "Python (snake)",
                "aliases": ["python", "Python", "ball python", "reticulated python"],
                "description": "Large non-venomous snake found in Africa and Asia"
            },
            "tensorflow": {
                "name": "TensorFlow",
                "aliases": ["TensorFlow", "tensorflow", "TF"],
                "description": "Open-source ML framework developed by Google"
            },
            "google": {
                "name": "Google LLC",
                "aliases": ["Google", "google", "Alphabet", "Google Inc"],
                "description": "American multinational technology company"
            },
        }

        # Pre-compute embeddings for all entity descriptions
        self.entity_embeddings = {}
        for entity_id, entity_data in self.kb.items():
            text = f"{entity_data['name']}: {entity_data['description']}"
            self.entity_embeddings[entity_id] = self.embedder.encode([text])[0]

    def link(self, mention: str, context: str = "") -> dict:
        """Link a mention to the most likely KB entity given context."""
        # Embed mention + context
        query = f"{mention} {context}"
        query_emb = self.embedder.encode([query])[0]

        # Find most similar entity
        best_entity = None
        best_score = -1

        for entity_id, entity_emb in self.entity_embeddings.items():
            score = np.dot(query_emb, entity_emb) / (
                np.linalg.norm(query_emb) * np.linalg.norm(entity_emb)
            )
            if score > best_score:
                best_score = score
                best_entity = entity_id

        return {
            "mention": mention,
            "linked_entity": best_entity,
            "entity_name": self.kb[best_entity]["name"],
            "confidence": float(best_score)
        }

linker = SimpleEntityLinker()

# Test entity linking with disambiguation
test_cases = [
    ("Python", "I use Python for machine learning and data science"),
    ("Python", "The python slithered through the jungle"),
    ("Google", "Google released TensorFlow as open source"),
]

print("\nENTITY LINKING (disambiguation):")
for mention, context in test_cases:
    result = linker.link(mention, context)
    print(f"  '{mention}' in context '{context[:40]}...'")
    print(f"    → {result['entity_name']} (confidence: {result['confidence']:.3f})")

# ============================================
# SIMPLIFIED GRAPHRAG PIPELINE
# ============================================

class SimpleGraphRAG:
    """
    GraphRAG: Build a knowledge graph from documents,
    use it to answer questions with better context.
    """

    def __init__(self):
        self.entities = {}      # entity_id → {name, type, description}
        self.relationships = [] # (entity1, relation, entity2)
        self.communities = {}   # community_id → [entity_ids]

    def extract_and_build_graph(self, documents: list):
        """Extract entities and relationships from documents."""
        # In production: use LLM to extract entities and relationships
        # Simplified: use predefined extraction

        for doc in documents:
            entities_in_doc = extract_entities(doc)
            for ent in entities_in_doc:
                entity_id = ent['text'].lower().replace(' ', '_')
                self.entities[entity_id] = {
                    'name': ent['text'],
                    'type': ent['label'],
                    'mentions': self.entities.get(entity_id, {}).get('mentions', 0) + 1
                }

        print(f"Extracted {len(self.entities)} entities from {len(documents)} documents")

    def query(self, question: str) -> str:
        """Answer a question using the knowledge graph."""
        # Find relevant entities in the question
        question_entities = extract_entities(question)
        relevant_entity_ids = [
            e['text'].lower().replace(' ', '_')
            for e in question_entities
            if e['text'].lower().replace(' ', '_') in self.entities
        ]

        # Build context from graph
        context_parts = []
        for entity_id in relevant_entity_ids:
            entity = self.entities[entity_id]
            context_parts.append(
                f"Entity: {entity['name']} (type: {entity['type']}, "
                f"mentioned {entity['mentions']} times)"
            )

        context = "\n".join(context_parts) if context_parts else "No relevant entities found."
        return f"GraphRAG context:\n{context}\n\nAnswer would be generated by LLM using this context."

# Demo
docs = [
    "Python was created by Guido van Rossum at CWI in the Netherlands.",
    "Google developed TensorFlow and released it as open source in 2015.",
    "Meta developed PyTorch which is widely used in research.",
    "Python is the most popular language for machine learning.",
]

graphrag = SimpleGraphRAG()
graphrag.extract_and_build_graph(docs)
print("\nGraphRAG query result:")
print(graphrag.query("Who created Python and what is it used for?"))`
    }
  ],

  resources: [
    {
      title: 'Neo4j Graph Database Documentation',
      url: 'https://neo4j.com/docs/',
      description: 'Official Neo4j docs — Cypher query language, graph modeling'
    },
    {
      title: 'GraphRAG - Microsoft Research',
      url: 'https://microsoft.github.io/graphrag/',
      description: 'Microsoft\'s GraphRAG framework — knowledge graph + RAG'
    },
    {
      title: 'Wikidata Query Service',
      url: 'https://query.wikidata.org/',
      description: 'Interactive SPARQL query interface for Wikidata knowledge graph'
    },
    {
      title: 'spaCy Named Entity Recognition',
      url: 'https://spacy.io/usage/linguistic-features#named-entities',
      description: 'spaCy NER documentation with pre-trained models'
    }
  ],

  questions: [
    {
      question: 'What is a knowledge graph and how is it different from a relational database?',
      answer: 'A knowledge graph represents knowledge as entities (nodes) and relationships (edges) as triples: (Subject, Predicate, Object). Relational DB: stores data in tables with foreign keys — multi-hop queries require expensive JOINs. Graph DB: relationships are first-class citizens — multi-hop traversal is native and fast. Example: "Find all colleagues of colleagues of Alice who work at Google" = 3 JOINs in SQL (slow) vs simple graph traversal (fast). Use graph DBs when relationships are central to your queries.'
    },
    {
      question: 'What is entity linking and why is it important?',
      answer: 'Entity linking maps entity mentions in text to their canonical representation in a knowledge base. Handles disambiguation: "Apple" → Apple Inc. (not apple fruit), "Python" → Python programming language (not snake), "Paris" → Paris, France (not Paris, Texas). Pipeline: NER (extract mentions) → candidate generation (find KB candidates) → disambiguation (select correct one using context). Important for: knowledge-augmented generation (ground LLM in facts), information extraction, question answering.'
    },
    {
      question: 'What is GraphRAG and how does it improve on standard RAG?',
      answer: 'GraphRAG (Microsoft) builds a knowledge graph from documents, then uses both graph structure and text for retrieval. Standard RAG: retrieve relevant text chunks. GraphRAG: extract entities and relationships → build KG → create community summaries (clusters of related entities) → retrieve relevant communities + chunks. Better for: global questions ("What are the main themes?"), multi-hop reasoning ("What connects X and Y?"), relationship discovery. Standard RAG is better for: specific factual lookup, simpler queries.'
    },
    {
      question: 'What is Cypher and how do you write graph queries?',
      answer: 'Cypher is Neo4j\'s graph query language using ASCII art pattern matching. Nodes: (n:Label {property: value}). Relationships: -[:TYPE {property: value}]->. Example: MATCH (p:Person)-[:WORKS_AT]->(c:Company {name: "Google"}) RETURN p.name. Multi-hop: MATCH (a:Person {name: "Alice"})-[:KNOWS*2..3]-(b:Person) RETURN b.name (friends of friends, 2-3 hops). Shortest path: MATCH path = shortestPath((a)-[*]-(b)) RETURN path. Much more intuitive than SQL JOINs for graph queries.'
    },
    {
      question: 'What are Graph Neural Networks (GNNs) and what are they used for?',
      answer: 'GNNs learn embeddings for nodes and edges by aggregating information from neighbors. Each node\'s embedding is updated by combining its own features with its neighbors\' features (message passing). Used for: link prediction (predict missing relationships in KG), node classification (classify entities as fraudulent/legitimate), graph classification (classify entire graphs). Knowledge graph embeddings: TransE (h + r ≈ t), RotatE (relation as rotation). Applications: fraud detection (fraud ring detection), drug discovery (predict drug-protein interactions), recommendation systems.'
    }
  ]
};
