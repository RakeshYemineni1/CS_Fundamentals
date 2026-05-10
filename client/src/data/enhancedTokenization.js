export const enhancedTokenization = {
  id: 'tokenization',
  title: 'Tokenization & Text Processing',
  subtitle: 'BPE, WordPiece, SentencePiece, Context Windows, and Why Tokenization Matters',
  summary: 'Tokenization is the process of converting raw text into tokens — the atomic units that LLMs process. Understanding tokenization is critical for estimating API costs, managing context windows, debugging unexpected model behavior, and building efficient text processing pipelines.',
  analogy: 'Tokenization is like breaking a sentence into LEGO bricks before building with them. You can\'t hand an LLM a whole sentence — it needs individual pieces. The way you break the sentence into pieces (the tokenizer) affects how well the model understands it, how much it costs, and how many words fit in the context window.',

  explanation: `WHAT IS TOKENIZATION?

Tokenization converts raw text into a sequence of tokens — integer IDs that the model processes. LLMs don't see characters or words; they see token IDs.

"Hello, world!" → [15496, 11, 995, 0] (GPT-2 tokenization)

WHY IT MATTERS FOR SDEs:
- Cost: LLM APIs charge per token — understanding tokenization = controlling costs
- Context window: measured in tokens, not words or characters
- Performance: some languages tokenize less efficiently (more tokens per word)
- Debugging: unexpected model behavior often traced to tokenization issues
- Prompt design: knowing token boundaries helps write efficient prompts

RULE OF THUMB:
1 token ≈ 4 characters ≈ 0.75 words (for English)
100 tokens ≈ 75 words ≈ 1 short paragraph

═══════════════════════════════════════════════════════════════

TOKENIZATION ALGORITHMS

1. CHARACTER-LEVEL TOKENIZATION
Split text into individual characters.
Vocabulary size: ~100 (all ASCII/Unicode chars)
Pros: handles any word, no OOV (out-of-vocabulary) problem
Cons: very long sequences, model must learn to compose characters into words
Used by: early character-level RNNs

2. WORD-LEVEL TOKENIZATION
Split on whitespace and punctuation.
Vocabulary size: 50,000-100,000+ words
Pros: intuitive, short sequences
Cons: OOV problem (new words not in vocabulary), large vocabulary, morphological variants treated as different tokens ("run", "running", "ran" = 3 separate tokens)
Used by: early NLP models

3. SUBWORD TOKENIZATION (Modern Standard)
Split words into subword units — balance between character and word level.
Handles OOV by decomposing unknown words into known subwords.
"unhappiness" → ["un", "happiness"] or ["un", "hap", "pi", "ness"]
Vocabulary size: 30,000-100,000 subword units

THREE MAIN ALGORITHMS:

BPE (BYTE PAIR ENCODING):
Used by: GPT-2, GPT-3, GPT-4, RoBERTa, LLaMA

Algorithm:
1. Start with character-level vocabulary
2. Count all adjacent pair frequencies in corpus
3. Merge the most frequent pair into a new token
4. Repeat until vocabulary reaches target size

Example:
Corpus: "low lower lowest"
Start: l-o-w, l-o-w-e-r, l-o-w-e-s-t
Merge "l"+"o" → "lo": lo-w, lo-w-e-r, lo-w-e-s-t
Merge "lo"+"w" → "low": low, low-e-r, low-e-s-t
Merge "low"+"e" → "lowe": low, lowe-r, lowe-s-t
...

Result: common words become single tokens, rare words split into subwords.

WORDPIECE:
Used by: BERT, DistilBERT, ELECTRA

Similar to BPE but uses likelihood instead of frequency:
- Merges pairs that maximize language model likelihood
- Marks subwords with "##" prefix: "playing" → ["play", "##ing"]
- Slightly different vocabulary from BPE for same corpus

SENTENCEPIECE:
Used by: T5, LLaMA, Gemini, many multilingual models

Key difference: treats text as raw bytes, no pre-tokenization on whitespace.
- Language-agnostic: works for Chinese, Japanese, Arabic without word boundaries
- Marks word beginnings with "▁" (underscore): "Hello world" → ["▁Hello", "▁world"]
- Can use BPE or Unigram algorithm underneath
- Handles any language uniformly

BYTE-LEVEL BPE:
Used by: GPT-2, GPT-3, GPT-4, LLaMA

Operates on raw bytes (0-255) instead of characters.
- Vocabulary starts with 256 byte tokens
- Merges byte pairs using BPE algorithm
- Handles any Unicode text without OOV
- Emojis, code, any language — all handled uniformly

═══════════════════════════════════════════════════════════════

CONTEXT WINDOWS AND TOKEN COUNTING

CONTEXT WINDOW:
Maximum number of tokens the model can process at once (input + output combined).

Model context windows:
- GPT-3.5: 4K or 16K tokens
- GPT-4: 8K, 32K, or 128K tokens
- Claude 3: 200K tokens
- Gemini 1.5 Pro: 1M tokens
- LLaMA 3: 8K or 128K tokens

PRACTICAL IMPLICATIONS:
- 128K tokens ≈ 100,000 words ≈ a full novel
- 1M tokens ≈ 750,000 words ≈ 10 novels
- Longer context = more expensive (quadratic attention cost)
- Longer context ≠ better performance (models struggle with very long contexts)

TOKEN COUNTING FOR COST ESTIMATION:
OpenAI pricing (approximate): $0.01 per 1K input tokens, $0.03 per 1K output tokens
1M tokens ≈ $10-30 depending on model

TOKENIZATION EFFICIENCY BY LANGUAGE:
English: ~1.3 tokens per word (most efficient)
Spanish/French: ~1.5 tokens per word
Chinese/Japanese: ~2-3 tokens per character (less efficient)
Code: varies widely — Python ~1.5 tokens/word, some languages much more

═══════════════════════════════════════════════════════════════

SPECIAL TOKENS

Special tokens serve structural purposes in LLM inputs:

[CLS]: Classification token — BERT uses this for sentence-level tasks
[SEP]: Separator — separates sentences in BERT
[PAD]: Padding — pads shorter sequences to same length in a batch
[MASK]: Masked token — used in BERT's masked language modeling training
[UNK]: Unknown token — represents OOV tokens (rare in subword models)
<|endoftext|>: GPT's end-of-text token
<s>, </s>: Start/end of sequence tokens (LLaMA, T5)
<|im_start|>, <|im_end|>: Chat message delimiters (ChatML format)

CHAT TEMPLATES:
Modern LLMs use structured templates to format conversations:

ChatML format (OpenAI):
<|im_start|>system
You are a helpful assistant.
<|im_end|>
<|im_start|>user
What is Python?
<|im_end|>
<|im_start|>assistant

The model generates tokens after the final assistant tag.

═══════════════════════════════════════════════════════════════

TEXT PREPROCESSING PIPELINE

Before tokenization, text often needs preprocessing:

1. Normalization: lowercase, remove accents, normalize unicode
2. Cleaning: remove HTML tags, special characters, extra whitespace
3. Sentence splitting: split documents into sentences
4. Tokenization: apply tokenizer
5. Truncation/Padding: ensure all sequences are same length for batching

TRUNCATION STRATEGIES:
- Truncate from right: remove tokens from end (most common)
- Truncate from left: remove tokens from beginning (for tasks where end matters)
- Sliding window: split long documents into overlapping chunks

PADDING STRATEGIES:
- Pad to max length: all sequences padded to model's max length (wasteful)
- Pad to longest in batch: dynamic padding, more efficient
- No padding: use attention masks, process variable-length sequences`,

  keyPoints: [
    '1 token ≈ 4 characters ≈ 0.75 words — critical for cost estimation and context window planning',
    'BPE (GPT): merge most frequent character pairs. WordPiece (BERT): maximize likelihood. SentencePiece (LLaMA): language-agnostic byte-level',
    'Subword tokenization solves OOV problem — unknown words split into known subwords',
    'Byte-level BPE (GPT-4, LLaMA): operates on raw bytes, handles any Unicode uniformly',
    'Context window measured in tokens — 128K tokens ≈ 100K words ≈ a full novel',
    'Non-English languages tokenize less efficiently — more tokens per word = higher cost',
    'Special tokens: [CLS], [SEP], [PAD], [MASK] for BERT; <|im_start|> for chat templates',
    'Dynamic padding (pad to longest in batch) is more efficient than padding to max length'
  ],

  codeExamples: [
    {
      title: 'Tokenization Deep Dive',
      language: 'python',
      description: 'Explore tokenization with different tokenizers and understand token counts.',
      code: `# pip install transformers tiktoken
from transformers import AutoTokenizer
import tiktoken

# ============================================
# TIKTOKEN — OpenAI's Tokenizer (GPT-3/4)
# ============================================

enc = tiktoken.get_encoding("cl100k_base")  # GPT-4 tokenizer

texts = [
    "Hello, world!",
    "Machine learning is a subset of artificial intelligence.",
    "The quick brown fox jumps over the lazy dog.",
    "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
    "こんにちは世界",  # Japanese: "Hello World"
    "مرحبا بالعالم",  # Arabic: "Hello World"
    "🚀🤖💡",         # Emojis
]

print("TIKTOKEN (GPT-4) TOKENIZATION:")
print(f"{'Text':<55} {'Tokens':>8} {'Token IDs'}")
print("-" * 100)

for text in texts:
    tokens = enc.encode(text)
    token_strs = [enc.decode([t]) for t in tokens]
    print(f"{text[:52]:<55} {len(tokens):>8}  {token_strs}")

# ============================================
# COST ESTIMATION
# ============================================

def estimate_cost(text: str, model: str = "gpt-4o",
                  is_input: bool = True) -> dict:
    """Estimate API cost for a given text."""
    enc = tiktoken.get_encoding("cl100k_base")
    n_tokens = len(enc.encode(text))

    # Approximate pricing (per 1K tokens)
    pricing = {
        "gpt-4o":       {"input": 0.005, "output": 0.015},
        "gpt-4o-mini":  {"input": 0.00015, "output": 0.0006},
        "gpt-3.5-turbo":{"input": 0.0005, "output": 0.0015},
    }

    price_per_1k = pricing[model]["input" if is_input else "output"]
    cost = (n_tokens / 1000) * price_per_1k

    return {"tokens": n_tokens, "cost_usd": cost, "model": model}

sample_prompt = "You are a helpful assistant. " * 50  # ~350 tokens
result = estimate_cost(sample_prompt, "gpt-4o")
print(f"\nCost estimate for {result['tokens']} tokens: $" + f"{result['cost_usd']:.6f}")

# ============================================
# BERT TOKENIZER (WordPiece)
# ============================================

bert_tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

words = ["unhappiness", "tokenization", "preprocessing",
         "antidisestablishmentarianism", "supercalifragilistic"]

print("\nBERT WordPiece Tokenization:")
for word in words:
    tokens = bert_tokenizer.tokenize(word)
    print(f"  {word:<35} → {tokens}")

# Note: ## prefix means continuation of a word
# "unhappiness" → ["un", "##happiness"] or ["un", "##hap", "##pi", "##ness"]

# ============================================
# LLAMA TOKENIZER (SentencePiece)
# ============================================

# Conceptual — requires downloading LLaMA tokenizer
llama_example = """
# SentencePiece key differences:
# 1. No pre-tokenization on whitespace
# 2. ▁ (underscore) marks word beginnings
# 3. Language-agnostic — works for any language

# Example output:
# "Hello world" → ["▁Hello", "▁world"]
# "Hello" → ["▁Hello"]  (same token whether at start or middle of sentence)
# "world" → ["▁world"]

# This is why LLaMA handles multilingual text better than GPT-2
"""
print(llama_example)

# ============================================
# CONTEXT WINDOW MANAGEMENT
# ============================================

def count_tokens(text: str) -> int:
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))

def truncate_to_token_limit(text: str, max_tokens: int = 4000) -> str:
    """Truncate text to fit within token limit."""
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    if len(tokens) <= max_tokens:
        return text
    # Truncate and decode
    truncated_tokens = tokens[:max_tokens]
    return enc.decode(truncated_tokens)

def chunk_text_by_tokens(text: str, chunk_size: int = 512,
                          overlap: int = 50) -> list:
    """Split text into chunks of approximately chunk_size tokens with overlap."""
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    chunks = []

    for i in range(0, len(tokens), chunk_size - overlap):
        chunk_tokens = tokens[i:i + chunk_size]
        chunk_text = enc.decode(chunk_tokens)
        chunks.append(chunk_text)
        if i + chunk_size >= len(tokens):
            break

    return chunks

# Test chunking
long_text = "Machine learning is fascinating. " * 200  # ~1000 tokens
chunks = chunk_text_by_tokens(long_text, chunk_size=100, overlap=20)
print(f"Long text: {count_tokens(long_text)} tokens")
print(f"Split into {len(chunks)} chunks of ~100 tokens each")
for i, chunk in enumerate(chunks[:3]):
    print(f"  Chunk {i+1}: {count_tokens(chunk)} tokens")`
    },
    {
      title: 'Building a Token-Aware Text Processing Pipeline',
      language: 'python',
      description: 'Build a production-ready text processing pipeline that respects token limits.',
      code: `import tiktoken
from typing import List, Dict
import re

# ============================================
# TOKEN-AWARE TEXT PROCESSING PIPELINE
# ============================================

class TokenAwareProcessor:
    """Process text while respecting LLM token limits."""

    def __init__(self, model: str = "gpt-4o", max_context_tokens: int = 128000):
        self.enc = tiktoken.get_encoding("cl100k_base")
        self.model = model
        self.max_context = max_context_tokens

        # Reserve tokens for system prompt and response
        self.system_prompt_tokens = 500
        self.response_tokens = 1000
        self.available_tokens = (max_context_tokens
                                  - self.system_prompt_tokens
                                  - self.response_tokens)

    def count(self, text: str) -> int:
        return len(self.enc.encode(text))

    def fits_in_context(self, text: str) -> bool:
        return self.count(text) <= self.available_tokens

    def smart_chunk(self, text: str, chunk_size: int = 1000,
                    overlap: int = 100) -> List[Dict]:
        """
        Split text into token-aware chunks with metadata.
        Tries to split on sentence boundaries.
        """
        # Split into sentences first
        sentences = re.split(r'(?<=[.!?])\\s+', text)
        chunks = []
        current_chunk = []
        current_tokens = 0

        for sentence in sentences:
            sentence_tokens = self.count(sentence)

            if current_tokens + sentence_tokens > chunk_size and current_chunk:
                # Save current chunk
                chunk_text = ' '.join(current_chunk)
                chunks.append({
                    'text': chunk_text,
                    'tokens': current_tokens,
                    'chunk_id': len(chunks)
                })

                # Keep overlap: last few sentences
                overlap_sentences = []
                overlap_token_count = 0
                for s in reversed(current_chunk):
                    s_tokens = self.count(s)
                    if overlap_token_count + s_tokens <= overlap:
                        overlap_sentences.insert(0, s)
                        overlap_token_count += s_tokens
                    else:
                        break

                current_chunk = overlap_sentences
                current_tokens = overlap_token_count

            current_chunk.append(sentence)
            current_tokens += sentence_tokens

        # Don't forget the last chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            chunks.append({
                'text': chunk_text,
                'tokens': current_tokens,
                'chunk_id': len(chunks)
            })

        return chunks

    def build_prompt(self, system: str, context_chunks: List[str],
                     query: str) -> str:
        """
        Build a prompt that fits within context window.
        Prioritizes most relevant chunks if context is too long.
        """
        system_tokens = self.count(system)
        query_tokens = self.count(query)
        available = self.max_context - system_tokens - query_tokens - self.response_tokens - 200

        # Add chunks until we hit the limit
        selected_chunks = []
        used_tokens = 0

        for chunk in context_chunks:
            chunk_tokens = self.count(chunk)
            if used_tokens + chunk_tokens <= available:
                selected_chunks.append(chunk)
                used_tokens += chunk_tokens
            else:
                break

        context = "\\n\\n".join(selected_chunks)
        prompt = f"{system}\\n\\nContext:\\n{context}\\n\\nQuestion: {query}"

        return prompt, {
            'total_tokens': self.count(prompt),
            'chunks_used': len(selected_chunks),
            'chunks_dropped': len(context_chunks) - len(selected_chunks)
        }

    def estimate_batch_cost(self, texts: List[str],
                             price_per_1k_input: float = 0.005) -> Dict:
        """Estimate total cost for processing a batch of texts."""
        total_tokens = sum(self.count(t) for t in texts)
        total_cost = (total_tokens / 1000) * price_per_1k_input
        return {
            'total_tokens': total_tokens,
            'avg_tokens_per_text': total_tokens / len(texts),
            'estimated_cost_usd': total_cost,
            'texts_count': len(texts)
        }


# ============================================
# USAGE EXAMPLE
# ============================================

processor = TokenAwareProcessor(model="gpt-4o", max_context_tokens=128000)

# Long document
document = """
Machine learning is a method of data analysis that automates analytical model building.
It is based on the idea that systems can learn from data, identify patterns and make decisions.
Deep learning is part of a broader family of machine learning methods based on neural networks.
Neural networks are computing systems inspired by biological neural networks in animal brains.
The transformer architecture revolutionized natural language processing in 2017.
Large language models like GPT-4 are trained on massive text corpora using transformers.
""" * 50  # Make it long

print(f"Document tokens: {processor.count(document)}")
print(f"Fits in context: {processor.fits_in_context(document)}")

# Smart chunking
chunks = processor.smart_chunk(document, chunk_size=200, overlap=30)
print(f"\\nSplit into {len(chunks)} chunks:")
for chunk in chunks[:3]:
    print(f"  Chunk {chunk['chunk_id']}: {chunk['tokens']} tokens")

# Build token-aware prompt
prompt, stats = processor.build_prompt(
    system="You are a helpful assistant. Answer based on the provided context.",
    context_chunks=[c['text'] for c in chunks],
    query="What is the transformer architecture?"
)
print(f"\\nPrompt stats: {stats}")

# Batch cost estimation
sample_texts = [f"Process this document number {i}: " + "content " * 100 for i in range(100)]
cost = processor.estimate_batch_cost(sample_texts)
print(f"\\nBatch cost estimate:")
print(f"  Total tokens: {cost['total_tokens']:,}")
print(f"  Avg per text: {cost['avg_tokens_per_text']:.0f}")
print(f"  Estimated cost: $" + f"{cost['estimated_cost_usd']:.4f}")`
    }
  ],

  resources: [
    {
      title: 'Tiktoken - OpenAI Tokenizer',
      url: 'https://github.com/openai/tiktoken',
      description: 'OpenAI\'s fast BPE tokenizer used by GPT models'
    },
    {
      title: 'Hugging Face Tokenizers Documentation',
      url: 'https://huggingface.co/docs/tokenizers/',
      description: 'Fast tokenizers library supporting BPE, WordPiece, SentencePiece'
    },
    {
      title: 'OpenAI Tokenizer Playground',
      url: 'https://platform.openai.com/tokenizer',
      description: 'Interactive tool to visualize how GPT tokenizes text'
    },
    {
      title: 'BPE Paper - Neural Machine Translation',
      url: 'https://arxiv.org/abs/1508.07909',
      description: 'Original paper introducing BPE for NLP'
    }
  ],

  questions: [
    {
      question: 'What is tokenization and why does it matter for LLMs?',
      answer: 'Tokenization converts raw text into tokens — integer IDs that LLMs process. Matters for: 1) Cost — LLM APIs charge per token, understanding tokenization controls costs. 2) Context window — measured in tokens, not words. 3) Performance — some languages tokenize less efficiently. 4) Debugging — unexpected behavior often traced to tokenization. Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 words for English. 100 tokens ≈ 75 words ≈ 1 short paragraph.'
    },
    {
      question: 'What is BPE (Byte Pair Encoding) and how does it work?',
      answer: 'BPE starts with a character-level vocabulary, then iteratively merges the most frequent adjacent pair of tokens into a new token, until the vocabulary reaches the target size. Result: common words become single tokens, rare words split into subwords. Used by GPT-2, GPT-3, GPT-4, LLaMA. Byte-level BPE (used by GPT-4) operates on raw bytes (0-255) instead of characters, handling any Unicode text including emojis and non-Latin scripts without OOV issues.'
    },
    {
      question: 'What is the difference between BPE, WordPiece, and SentencePiece?',
      answer: 'BPE (GPT): merges most frequent character pairs iteratively. WordPiece (BERT): similar to BPE but merges pairs that maximize language model likelihood, marks subwords with ## prefix. SentencePiece (LLaMA, T5, Gemini): language-agnostic, treats text as raw bytes without pre-tokenization on whitespace, marks word beginnings with ▁, works uniformly for any language including Chinese/Japanese/Arabic. SentencePiece is preferred for multilingual models.'
    },
    {
      question: 'How do you estimate LLM API costs?',
      answer: 'Cost = (input_tokens / 1000) × input_price + (output_tokens / 1000) × output_price. Use tiktoken library to count tokens accurately. Approximate: 1 token ≈ 4 chars ≈ 0.75 words. GPT-4o pricing: ~$0.005/1K input, $0.015/1K output. For 1M tokens: ~$5-15. Cost optimization: use smaller models (GPT-4o-mini is 30x cheaper), semantic caching (cache similar queries), prompt compression (remove redundant text), batch requests, choose appropriate context window size.'
    },
    {
      question: 'What are special tokens and why are they important?',
      answer: 'Special tokens serve structural purposes: [CLS] (BERT classification token), [SEP] (sentence separator), [PAD] (padding to equal length), [MASK] (masked language modeling), [UNK] (unknown token), <|endoftext|> (GPT end of text), <s>/<\/s> (sequence start/end in LLaMA). Chat templates use special tokens to structure conversations: <|im_start|>system, <|im_start|>user, <|im_start|>assistant. The model generates tokens after the final assistant tag. Incorrect special token handling causes unexpected model behavior.'
    },
    {
      question: 'How do you handle documents that exceed the context window?',
      answer: 'Strategies: 1) Chunking — split document into overlapping chunks (overlap preserves context across boundaries), embed each chunk, use RAG to retrieve relevant chunks. 2) Summarization — recursively summarize sections, then summarize summaries (map-reduce). 3) Sliding window — process document in overlapping windows, aggregate results. 4) Truncation — keep most relevant portion (beginning for context, end for recent events). 5) Use longer context models (Claude 200K, Gemini 1M). For RAG: chunk at sentence boundaries, 512-1024 tokens per chunk, 10-20% overlap.'
    }
  ]
};
