export const enhancedLLMs = {
  id: 'llms',
  title: 'Large Language Models (LLMs)',
  subtitle: 'GPT, BERT, Fine-Tuning, RAG, and How LLMs Work',
  summary: 'Large Language Models (LLMs) are massive neural networks trained on vast amounts of text data using the Transformer architecture. They can understand and generate human language, answer questions, write code, and perform a wide range of language tasks.',
  analogy: 'An LLM is like a person who has read the entire internet. They have absorbed patterns from billions of documents and can predict what word comes next in any context. Fine-tuning is like giving that person specialized training for a specific job. RAG is like giving them access to a search engine so they can look up facts before answering.',

  explanation: `WHAT ARE LARGE LANGUAGE MODELS?

Large Language Models (LLMs) are deep learning models based on the Transformer architecture, trained on massive text corpora (hundreds of billions to trillions of tokens). They learn to predict the next token in a sequence, which enables them to understand and generate coherent, contextually relevant text.

Scale: GPT-3 has 175B parameters. GPT-4 is estimated at ~1.8T. LLaMA 3 has 70B-405B.

HOW LLMs ARE TRAINED

STAGE 1: PRE-TRAINING (Self-Supervised)
- Train on massive text corpus (Common Crawl, Wikipedia, books, code)
- Objective: predict the next token given all previous tokens
- This is self-supervised — no human labels needed
- Learns grammar, facts, reasoning, coding, and world knowledge
- Extremely expensive: GPT-3 training cost ~$4.6M

STAGE 2: SUPERVISED FINE-TUNING (SFT)
- Fine-tune on high-quality instruction-following examples
- Human-written (prompt, ideal response) pairs
- Teaches the model to follow instructions and be helpful

STAGE 3: RLHF (Reinforcement Learning from Human Feedback)
- Human raters rank model responses
- Train a reward model to predict human preferences
- Use PPO (Proximal Policy Optimization) to optimize the LLM
- Makes the model helpful, harmless, and honest (HHH)
- Used by ChatGPT, Claude, Gemini

KEY LLM ARCHITECTURES

GPT (Generative Pre-trained Transformer) — OpenAI:
- Decoder-only Transformer
- Autoregressive: generates one token at a time
- GPT-1 (2018) → GPT-2 (2019) → GPT-3 (2020) → GPT-4 (2023)
- Used for: text generation, chat, code, reasoning

BERT (Bidirectional Encoder Representations from Transformers) — Google:
- Encoder-only Transformer
- Bidirectional: sees context from both left and right
- Pre-trained with Masked Language Modeling (MLM)
- Used for: classification, NER, question answering, embeddings

T5 (Text-to-Text Transfer Transformer) — Google:
- Encoder-Decoder Transformer
- Frames all NLP tasks as text-to-text
- Used for: translation, summarization, Q&A

LLaMA (Meta):
- Open-source decoder-only model
- LLaMA 2 (2023), LLaMA 3 (2024)
- Foundation for many open-source fine-tuned models

TOKENIZATION

LLMs don't process raw text — they process tokens:
- Tokens are subword units (not always full words)
- "unhappiness" → ["un", "happiness"] or ["un", "hap", "pi", "ness"]
- Common tokenizers: BPE (Byte Pair Encoding), WordPiece, SentencePiece
- GPT-4 uses ~100K token vocabulary
- Rule of thumb: 1 token ≈ 0.75 words

CONTEXT WINDOW

The maximum number of tokens an LLM can process at once:
- GPT-3: 4K tokens
- GPT-4: 8K-128K tokens
- Claude 3: 200K tokens
- Gemini 1.5 Pro: 1M tokens
Longer context = can process more text but costs more compute

FINE-TUNING

Adapting a pre-trained LLM to a specific task or domain:

Full Fine-Tuning: Update all model weights — expensive, requires lots of GPU memory
LoRA (Low-Rank Adaptation): Add small trainable matrices to frozen weights — efficient, popular
QLoRA: LoRA + quantization (4-bit) — fine-tune large models on consumer GPUs
Instruction Fine-Tuning: Train on (instruction, response) pairs to follow commands

RETRIEVAL-AUGMENTED GENERATION (RAG)

Problem: LLMs have a knowledge cutoff and can hallucinate facts.
Solution: RAG retrieves relevant documents at inference time and provides them as context.

RAG Pipeline:
1. Index documents into a vector database (embed with embedding model)
2. User asks a question
3. Embed the question and search for similar documents
4. Retrieve top-k relevant chunks
5. Inject retrieved context into the LLM prompt
6. LLM generates answer grounded in retrieved facts

Benefits: Up-to-date information, reduced hallucination, source attribution

HALLUCINATION

LLMs sometimes generate confident but factually incorrect information.
Causes: Training data errors, lack of knowledge, overconfidence
Mitigation: RAG, grounding, fact-checking, temperature reduction, chain-of-thought

EMBEDDINGS

Vector representations of text where semantically similar texts are close in vector space:
- "king" - "man" + "woman" ≈ "queen"
- Used for: semantic search, RAG, clustering, classification
- Models: text-embedding-ada-002 (OpenAI), sentence-transformers (open-source)

QUANTIZATION

Reduce model size by using lower precision numbers:
- FP32 (32-bit) → FP16 (16-bit) → INT8 (8-bit) → INT4 (4-bit)
- 4-bit quantization: 4× smaller model, ~5-10% accuracy loss
- Enables running large models on consumer hardware`,

  keyPoints: [
    'LLMs are Transformer-based models trained to predict the next token on massive text corpora',
    'Training stages: Pre-training (self-supervised) → SFT → RLHF',
    'GPT = decoder-only (generation), BERT = encoder-only (understanding), T5 = encoder-decoder',
    'Tokenization: text is split into subword tokens before processing',
    'Context window = max tokens the model can process at once',
    'Fine-tuning adapts pre-trained models; LoRA/QLoRA are efficient methods',
    'RAG retrieves relevant documents to ground LLM responses in facts',
    'Hallucination: LLMs can generate confident but incorrect information'
  ],

  codeExamples: [
    {
      title: 'Using LLMs via API (OpenAI)',
      language: 'python',
      description: 'Interact with GPT models via the OpenAI API for various tasks.',
      code: `from openai import OpenAI

client = OpenAI(api_key="<your-api-key>")

# ============================================
# BASIC CHAT COMPLETION
# ============================================

def chat(user_message, system_prompt="You are a helpful assistant."):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,      # 0=deterministic, 1=creative
        max_tokens=500,       # Max response length
    )
    return response.choices[0].message.content

# Simple Q&A
answer = chat("What is the difference between supervised and unsupervised learning?")
print(answer)

# ============================================
# MULTI-TURN CONVERSATION
# ============================================

def multi_turn_chat(conversation_history, user_message):
    conversation_history.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history,
        temperature=0.7
    )
    
    assistant_message = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message, conversation_history

# Start a conversation
history = [{"role": "system", "content": "You are a CS tutor."}]

response1, history = multi_turn_chat(history, "What is a neural network?")
print("Bot:", response1)

response2, history = multi_turn_chat(history, "Can you give me a simple example?")
print("Bot:", response2)

# ============================================
# STRUCTURED OUTPUT (JSON MODE)
# ============================================

import json

def extract_structured_data(text):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Extract information as JSON."},
            {"role": "user", "content": f"Extract name, age, and skills from: {text}"}
        ],
        response_format={"type": "json_object"},
        temperature=0
    )
    return json.loads(response.choices[0].message.content)

result = extract_structured_data(
    "John Smith is a 28-year-old software engineer skilled in Python, ML, and AWS."
)
print(json.dumps(result, indent=2))
# Output:
# {
#   "name": "John Smith",
#   "age": 28,
#   "skills": ["Python", "ML", "AWS"]
# }

# ============================================
# EMBEDDINGS FOR SEMANTIC SEARCH
# ============================================

def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Semantic search example
documents = [
    "Python is a high-level programming language",
    "Machine learning uses algorithms to learn from data",
    "The Eiffel Tower is in Paris, France",
    "Neural networks are inspired by the human brain",
]

query = "How do computers learn?"

# Embed all documents and query
doc_embeddings = [get_embedding(doc) for doc in documents]
query_embedding = get_embedding(query)

# Find most similar document
similarities = [cosine_similarity(query_embedding, doc_emb) for doc_emb in doc_embeddings]
best_match_idx = np.argmax(similarities)

print(f"Query: '{query}'")
print(f"Best match: '{documents[best_match_idx]}' (similarity: {similarities[best_match_idx]:.3f})")`
    },
    {
      title: 'RAG — Retrieval-Augmented Generation',
      language: 'python',
      description: 'Build a simple RAG pipeline to answer questions from a custom knowledge base.',
      code: `# ============================================
# RAG PIPELINE — Answer questions from docs
# pip install openai chromadb sentence-transformers
# ============================================

import chromadb
from sentence_transformers import SentenceTransformer
from openai import OpenAI

client = OpenAI(api_key="<your-api-key>")

# ============================================
# STEP 1: PREPARE KNOWLEDGE BASE
# ============================================

# Your custom documents (could be PDFs, web pages, etc.)
documents = [
    {"id": "1", "text": "Python was created by Guido van Rossum and released in 1991. It emphasizes code readability and simplicity."},
    {"id": "2", "text": "Machine learning is a subset of AI where systems learn from data. Key types: supervised, unsupervised, reinforcement learning."},
    {"id": "3", "text": "The Transformer architecture was introduced in 2017 in the paper 'Attention is All You Need' by Google researchers."},
    {"id": "4", "text": "GPT (Generative Pre-trained Transformer) is developed by OpenAI. GPT-4 was released in March 2023."},
    {"id": "5", "text": "BERT stands for Bidirectional Encoder Representations from Transformers. It was released by Google in 2018."},
    {"id": "6", "text": "RAG (Retrieval-Augmented Generation) combines retrieval systems with generative models to reduce hallucination."},
]

# ============================================
# STEP 2: CREATE VECTOR DATABASE
# ============================================

# Initialize embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize ChromaDB (in-memory vector store)
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("knowledge_base")

# Embed and store all documents
texts = [doc["text"] for doc in documents]
embeddings = embedder.encode(texts).tolist()
ids = [doc["id"] for doc in documents]

collection.add(
    documents=texts,
    embeddings=embeddings,
    ids=ids
)

print(f"Indexed {len(documents)} documents into vector database")

# ============================================
# STEP 3: RAG QUERY FUNCTION
# ============================================

def rag_query(question, top_k=3):
    """
    1. Embed the question
    2. Retrieve top-k similar documents
    3. Build prompt with retrieved context
    4. Generate answer with LLM
    """
    
    # Retrieve relevant documents
    question_embedding = embedder.encode([question]).tolist()
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=top_k
    )
    
    retrieved_docs = results['documents'][0]
    
    # Build context from retrieved documents
    context = "\\n".join([f"- {doc}" for doc in retrieved_docs])
    
    # Build RAG prompt
    prompt = f"""Answer the question based ONLY on the provided context.
If the answer is not in the context, say "I don't have information about that."

Context:
{context}

Question: {question}

Answer:"""
    
    # Generate answer
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    answer = response.choices[0].message.content
    
    return {
        "question": question,
        "answer": answer,
        "sources": retrieved_docs
    }

# ============================================
# STEP 4: TEST THE RAG SYSTEM
# ============================================

questions = [
    "When was the Transformer architecture introduced?",
    "What is the difference between GPT and BERT?",
    "What is RAG and why is it useful?",
]

for q in questions:
    result = rag_query(q)
    print(f"Q: {result['question']}")
    print(f"A: {result['answer']}")
    print(f"Sources used: {len(result['sources'])} documents")
    print("-" * 50)`
    },
    {
      title: 'Fine-Tuning with LoRA (Efficient)',
      language: 'python',
      description: 'Fine-tune a pre-trained LLM efficiently using LoRA (Low-Rank Adaptation).',
      code: `# ============================================
# FINE-TUNING WITH LoRA
# pip install transformers peft datasets trl
# ============================================

from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import Dataset

# ============================================
# STEP 1: LOAD BASE MODEL
# ============================================

model_name = "meta-llama/Llama-3.2-1B"  # Small model for demo

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_4bit=True,   # QLoRA: load in 4-bit to save memory
    device_map="auto"
)

print(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")

# ============================================
# STEP 2: CONFIGURE LoRA
# ============================================

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,              # Rank of the low-rank matrices (higher = more capacity)
    lora_alpha=32,     # Scaling factor
    lora_dropout=0.1,  # Dropout for LoRA layers
    target_modules=["q_proj", "v_proj"],  # Which layers to apply LoRA to
    bias="none"
)

# Wrap model with LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 2,097,152 || all params: 1,237,000,000 || trainable%: 0.17%
# Only 0.17% of parameters are trained! Much more efficient than full fine-tuning.

# ============================================
# STEP 3: PREPARE TRAINING DATA
# ============================================

# Format: instruction-following pairs
training_data = [
    {"text": "### Instruction: What is machine learning?\n### Response: Machine learning is a subset of AI where systems learn patterns from data without being explicitly programmed."},
    {"text": "### Instruction: Explain overfitting.\n### Response: Overfitting occurs when a model memorizes training data too well and fails to generalize to new unseen data."},
    {"text": "### Instruction: What is a neural network?\n### Response: A neural network is a computational model inspired by the brain, consisting of layers of interconnected neurons that learn to map inputs to outputs."},
    # Add hundreds/thousands more examples for real fine-tuning
]

dataset = Dataset.from_list(training_data)

# ============================================
# STEP 4: TRAIN
# ============================================

training_args = TrainingArguments(
    output_dir="./lora-finetuned-model",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_strategy="epoch",
)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=512,
    args=training_args,
)

trainer.train()

# ============================================
# STEP 5: INFERENCE WITH FINE-TUNED MODEL
# ============================================

def generate_response(instruction, max_new_tokens=200):
    prompt = f"### Instruction: {instruction}\\n### Response:"
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("### Response:")[-1].strip()

print(generate_response("What is transfer learning?"))`
    }
  ],

  resources: [
    {
      title: 'The Illustrated GPT-2 - Jay Alammar',
      url: 'https://jalammar.github.io/illustrated-gpt2/',
      description: 'Best visual explanation of how GPT models work'
    },
    {
      title: 'Hugging Face NLP Course',
      url: 'https://huggingface.co/learn/nlp-course',
      description: 'Free course covering Transformers, BERT, GPT, and fine-tuning'
    },
    {
      title: 'LLM University - Cohere',
      url: 'https://docs.cohere.com/docs/llmu',
      description: 'Comprehensive free course on LLMs and embeddings'
    },
    {
      title: 'Andrej Karpathy - Let\'s build GPT (YouTube)',
      url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
      description: 'Build GPT from scratch in code — the best deep dive into LLMs'
    }
  ],

  questions: [
    {
      question: 'What is an LLM and how is it trained?',
      answer: 'An LLM (Large Language Model) is a Transformer-based model trained on massive text data. Training stages: 1) Pre-training — self-supervised next-token prediction on billions of documents (learns language, facts, reasoning). 2) Supervised Fine-Tuning (SFT) — train on instruction-response pairs to follow instructions. 3) RLHF — human raters rank responses, train a reward model, use PPO to optimize for human preferences. Result: a helpful, harmless, honest assistant.'
    },
    {
      question: 'What is the difference between GPT and BERT?',
      answer: 'GPT is a decoder-only Transformer trained with causal (left-to-right) language modeling — predicts next token. Best for text generation, chat, code. BERT is an encoder-only Transformer trained with masked language modeling (predict masked tokens) — bidirectional context. Best for classification, NER, question answering, embeddings. T5 combines both as encoder-decoder. GPT = generative, BERT = understanding.'
    },
    {
      question: 'What is RAG (Retrieval-Augmented Generation)?',
      answer: 'RAG combines a retrieval system with an LLM. Pipeline: 1) Index documents into a vector database using embeddings. 2) User asks a question. 3) Embed the question and retrieve top-k similar document chunks. 4) Inject retrieved context into the LLM prompt. 5) LLM generates an answer grounded in retrieved facts. Benefits: up-to-date information (no knowledge cutoff), reduced hallucination, source attribution, no need to fine-tune.'
    },
    {
      question: 'What is fine-tuning and when should you use it vs RAG?',
      answer: 'Fine-tuning updates model weights on task-specific data to change model behavior/style/knowledge. Use when: you need specific tone/format, domain-specific language, or task-specific behavior. RAG retrieves external knowledge at inference time. Use when: you need up-to-date information, factual accuracy, or source attribution. Often combine both: fine-tune for behavior, RAG for knowledge. Fine-tuning is expensive; RAG is cheaper and more flexible.'
    },
    {
      question: 'What is LoRA and why is it used?',
      answer: 'LoRA (Low-Rank Adaptation) is an efficient fine-tuning method that adds small trainable low-rank matrices to frozen pre-trained weights instead of updating all parameters. Benefits: trains only ~0.1-1% of parameters, requires much less GPU memory, nearly as effective as full fine-tuning. QLoRA extends this with 4-bit quantization, enabling fine-tuning of 70B models on a single GPU. Standard approach for fine-tuning large models.'
    },
    {
      question: 'What is hallucination in LLMs and how do you reduce it?',
      answer: 'Hallucination is when an LLM generates confident but factually incorrect information. Causes: training data errors, lack of knowledge, pattern completion without factual grounding. Mitigation: 1) RAG — ground responses in retrieved facts, 2) Lower temperature — more deterministic outputs, 3) Chain-of-thought prompting — step-by-step reasoning, 4) Fact-checking with external tools, 5) Asking the model to cite sources, 6) RLHF training for honesty.'
    },
    {
      question: 'What is RLHF and why is it important?',
      answer: 'RLHF (Reinforcement Learning from Human Feedback) aligns LLMs with human preferences. Process: 1) Collect human preference data (rank model responses), 2) Train a reward model to predict human preferences, 3) Use PPO (reinforcement learning) to optimize the LLM to maximize reward. Result: model becomes helpful, harmless, and honest. Used by ChatGPT, Claude, Gemini. Without RLHF, pre-trained LLMs can be toxic, biased, or unhelpful.'
    },
    {
      question: 'What is a context window and why does it matter?',
      answer: 'The context window is the maximum number of tokens an LLM can process in a single forward pass (input + output combined). Matters because: 1) Limits how much text you can analyze at once, 2) Affects RAG chunk size and retrieval strategy, 3) Longer context = more expensive (quadratic attention cost). GPT-4: 128K tokens, Claude 3: 200K, Gemini 1.5: 1M. For documents exceeding context window, use chunking + RAG or summarization.'
    }
  ]
};
