export const enhancedModelServing = {
  id: 'model-serving',
  title: 'Model Serving & Inference Optimization',
  subtitle: 'Deploying ML Models at Scale — Latency, Throughput, Quantization, and Caching',
  summary: 'Model serving is the engineering discipline of deploying trained ML models to production and serving predictions at scale. It covers inference optimization techniques like batching, quantization, caching, and hardware acceleration to meet latency and throughput requirements.',
  analogy: 'Training a model is like writing a recipe. Serving it is like running a restaurant. You can have the best recipe in the world, but if your kitchen takes 10 minutes per dish, customers leave. Model serving is about making your kitchen fast, efficient, and able to handle hundreds of orders simultaneously.',

  explanation: `WHY MODEL SERVING IS AN SDE PROBLEM

Training a model is a data science problem. Serving it reliably at scale is a software engineering problem. SDEs at AI companies spend more time on serving infrastructure than on training. Key challenges:

- Latency: user-facing predictions must be fast (< 100ms for real-time)
- Throughput: handle thousands of requests per second
- Cost: GPU inference is expensive — optimize or go broke
- Reliability: 99.9%+ uptime, graceful degradation
- Versioning: deploy new models without downtime

═══════════════════════════════════════════════════════════════

INFERENCE vs TRAINING

Training:
- Runs once (or periodically)
- Batch processing, high memory usage
- Optimize for throughput, not latency
- GPU clusters, hours to days

Inference:
- Runs on every user request
- Low latency requirement (< 100ms typically)
- Optimize for latency AND throughput
- Can run on CPU, GPU, or specialized hardware (TPU, NPU)

═══════════════════════════════════════════════════════════════

INFERENCE OPTIMIZATION TECHNIQUES

1. BATCHING

Dynamic Batching: Group multiple incoming requests into a single batch.
- Single forward pass for N requests instead of N separate passes
- GPU utilization goes from 10% to 90%+
- Trade-off: adds latency (wait for batch to fill)
- Continuous batching (for LLMs): process requests as they arrive, not in fixed batches

Static Batching: Fixed batch size, pad shorter inputs.
Micro-batching: Very small batches for low-latency requirements.

2. QUANTIZATION

Reduce numerical precision of model weights:
- FP32 (32-bit float): full precision, 4 bytes per weight
- FP16 (16-bit float): half precision, 2 bytes — 2x smaller, minimal accuracy loss
- INT8 (8-bit integer): 4x smaller, ~1-2% accuracy loss, much faster on CPU
- INT4 (4-bit integer): 8x smaller, ~3-5% accuracy loss, enables large models on small hardware
- GPTQ, AWQ: advanced quantization methods for LLMs

Post-Training Quantization (PTQ): Quantize after training, no retraining needed.
Quantization-Aware Training (QAT): Simulate quantization during training, better accuracy.

3. PRUNING

Remove weights that contribute little to predictions:
- Unstructured pruning: zero out individual weights (sparse matrix)
- Structured pruning: remove entire neurons, heads, or layers
- Magnitude pruning: remove weights with smallest absolute values
- Result: smaller, faster model with minimal accuracy loss

4. KNOWLEDGE DISTILLATION

Train a small "student" model to mimic a large "teacher" model:
- Student learns from teacher's soft probability outputs (not just hard labels)
- Student is 10-100x smaller but retains most of teacher's performance
- Examples: DistilBERT (40% smaller than BERT, 97% of performance)

5. MODEL COMPILATION & OPTIMIZATION

ONNX (Open Neural Network Exchange):
- Standard format for ML models
- Convert PyTorch/TensorFlow → ONNX → optimized runtime
- ONNX Runtime: 2-5x faster inference than native PyTorch

TensorRT (NVIDIA):
- Optimizes models for NVIDIA GPUs
- Layer fusion, precision calibration, kernel auto-tuning
- 2-10x speedup over standard inference

TorchScript / torch.compile:
- Compile PyTorch models for faster inference
- Removes Python overhead, enables graph optimizations

6. CACHING

Semantic Caching: Cache LLM responses for similar queries.
- Embed the query, check if similar query was answered before
- Return cached response if similarity > threshold
- Reduces LLM API calls by 20-60% for repetitive queries

KV Cache (for LLMs): Cache key-value pairs from attention computation.
- Avoids recomputing attention for already-processed tokens
- Critical for long-context inference
- Memory trade-off: larger cache = more memory

Result Caching: Cache predictions for identical inputs (Redis, Memcached).

7. HARDWARE ACCELERATION

GPU: Best for large batch inference, parallel matrix operations
CPU: Good for small models, low-latency single requests
TPU (Google): Optimized for matrix operations, used in Google Cloud
NPU/Neural Engine: On-device inference (Apple M-series, Qualcomm)
FPGA: Custom hardware for specific model architectures

═══════════════════════════════════════════════════════════════

MODEL SERVING ARCHITECTURES

ONLINE SERVING (Real-time):
- Request → Load Balancer → Model Server → Response
- Latency: < 100ms
- Use: user-facing features (recommendations, search, chat)
- Tools: TorchServe, TensorFlow Serving, Triton Inference Server, vLLM

BATCH SERVING (Offline):
- Scheduled job processes large datasets
- Latency: hours acceptable
- Use: nightly recommendations, bulk scoring, report generation
- Tools: Spark MLlib, Ray, AWS Batch

STREAMING SERVING:
- Process data as it arrives (Kafka, Kinesis)
- Latency: seconds
- Use: fraud detection, real-time personalization

EDGE SERVING:
- Model runs on device (phone, IoT, browser)
- No network latency, privacy-preserving
- Tools: TensorFlow Lite, ONNX Runtime Mobile, Core ML

═══════════════════════════════════════════════════════════════

LLM-SPECIFIC SERVING

LLMs have unique serving challenges due to their size and autoregressive generation.

vLLM:
- PagedAttention: manages KV cache like OS virtual memory
- Continuous batching: process requests as they arrive
- 24x higher throughput than naive serving
- Industry standard for LLM serving

Key LLM Serving Metrics:
- TTFT (Time to First Token): latency until first token appears
- TPOT (Time Per Output Token): latency between tokens
- Throughput: tokens per second across all users

Speculative Decoding:
- Small draft model generates candidate tokens
- Large model verifies multiple tokens in parallel
- 2-3x speedup with no quality loss

Tensor Parallelism:
- Split model across multiple GPUs (each GPU holds part of each layer)
- Used for models too large for one GPU

Pipeline Parallelism:
- Split model layers across GPUs (GPU 1 = layers 1-12, GPU 2 = layers 13-24)
- Different from tensor parallelism

═══════════════════════════════════════════════════════════════

MONITORING IN PRODUCTION

Key Metrics to Track:
- Latency: p50, p95, p99 (tail latency matters most)
- Throughput: requests per second
- Error rate: failed predictions
- GPU/CPU utilization
- Memory usage
- Model accuracy drift over time
- Data drift: input distribution changes

SLOs (Service Level Objectives):
- p99 latency < 200ms
- Availability > 99.9%
- Error rate < 0.1%`,

  keyPoints: [
    'Batching: group requests into single forward pass — dramatically improves GPU utilization',
    'Quantization: FP32 → INT8 → INT4 reduces model size 4-8x with minimal accuracy loss',
    'Knowledge distillation: train small student model to mimic large teacher model',
    'ONNX + TensorRT: compile models for 2-10x faster inference on target hardware',
    'Semantic caching: cache LLM responses for similar queries — reduces API costs 20-60%',
    'vLLM + PagedAttention: industry standard for LLM serving, 24x throughput improvement',
    'Online (real-time <100ms) vs Batch (offline, hours) vs Edge (on-device) serving patterns',
    'Monitor p99 latency, throughput, error rate, GPU utilization, and model drift'
  ],

  codeExamples: [
    {
      title: 'FastAPI Model Server with Batching',
      language: 'python',
      description: 'Production-ready model serving with dynamic batching, caching, and monitoring.',
      code: `# pip install fastapi uvicorn scikit-learn joblib redis prometheus-client
import asyncio
import time
import hashlib
import json
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib

app = FastAPI(title="ML Model Server")

# ============================================
# LOAD MODEL AT STARTUP
# ============================================

model = None
scaler = None

@app.on_event("startup")
async def load_model():
    global model, scaler
    # model = joblib.load("model.pkl")
    # scaler = joblib.load("scaler.pkl")
    print("Model loaded successfully")

# ============================================
# REQUEST/RESPONSE SCHEMAS
# ============================================

class PredictionRequest(BaseModel):
    features: List[float]
    request_id: str = ""

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    latency_ms: float
    cached: bool = False

class BatchRequest(BaseModel):
    requests: List[PredictionRequest]

# ============================================
# SIMPLE IN-MEMORY CACHE
# ============================================

prediction_cache = {}
CACHE_TTL = 300  # 5 minutes

def get_cache_key(features: List[float]) -> str:
    return hashlib.md5(json.dumps(features, sort_keys=True).encode()).hexdigest()

def get_cached(key: str):
    if key in prediction_cache:
        entry = prediction_cache[key]
        if time.time() - entry['timestamp'] < CACHE_TTL:
            return entry['result']
        del prediction_cache[key]
    return None

def set_cache(key: str, result: dict):
    prediction_cache[key] = {'result': result, 'timestamp': time.time()}

# ============================================
# SINGLE PREDICTION ENDPOINT
# ============================================

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    start = time.time()
    
    # Check cache first
    cache_key = get_cache_key(request.features)
    cached = get_cached(cache_key)
    if cached:
        return PredictionResponse(**cached, cached=True, latency_ms=0)
    
    # Validate input
    if len(request.features) != 20:
        raise HTTPException(status_code=400, detail="Expected 20 features")
    
    # Preprocess and predict
    X = np.array(request.features).reshape(1, -1)
    # X_scaled = scaler.transform(X)
    # prediction = int(model.predict(X_scaled)[0])
    # probability = float(model.predict_proba(X_scaled)[0][1])
    
    # Mock prediction for demo
    prediction = int(np.random.random() > 0.5)
    probability = float(np.random.random())
    
    latency_ms = (time.time() - start) * 1000
    
    result = {"prediction": prediction, "probability": probability, "latency_ms": latency_ms}
    set_cache(cache_key, result)
    
    return PredictionResponse(**result)

# ============================================
# BATCH PREDICTION ENDPOINT
# ============================================

@app.post("/predict/batch")
async def predict_batch(batch: BatchRequest):
    start = time.time()
    
    results = []
    uncached_indices = []
    uncached_features = []
    
    # Check cache for each request
    for i, req in enumerate(batch.requests):
        cache_key = get_cache_key(req.features)
        cached = get_cached(cache_key)
        if cached:
            results.append({**cached, "cached": True})
        else:
            results.append(None)
            uncached_indices.append(i)
            uncached_features.append(req.features)
    
    # Batch predict uncached requests
    if uncached_features:
        X_batch = np.array(uncached_features)
        # X_scaled = scaler.transform(X_batch)
        # predictions = model.predict(X_scaled)
        # probabilities = model.predict_proba(X_scaled)[:, 1]
        
        # Mock batch prediction
        predictions = np.random.randint(0, 2, len(uncached_features))
        probabilities = np.random.random(len(uncached_features))
        
        for i, (idx, pred, prob) in enumerate(zip(uncached_indices, predictions, probabilities)):
            result = {"prediction": int(pred), "probability": float(prob), "latency_ms": 0, "cached": False}
            results[idx] = result
            set_cache(get_cache_key(uncached_features[i]), result)
    
    total_latency = (time.time() - start) * 1000
    
    return {
        "results": results,
        "total_latency_ms": round(total_latency, 2),
        "batch_size": len(batch.requests),
        "cache_hits": len(batch.requests) - len(uncached_features)
    }

# ============================================
# HEALTH AND METRICS ENDPOINTS
# ============================================

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None, "cache_size": len(prediction_cache)}

@app.get("/metrics")
async def metrics():
    return {
        "cache_entries": len(prediction_cache),
        "cache_hit_rate": "tracked_externally",
    }

# Run: uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4`
    },
    {
      title: 'Quantization & ONNX Export',
      language: 'python',
      description: 'Quantize a model and export to ONNX for faster inference.',
      code: `import numpy as np
import time

# ============================================
# QUANTIZATION COMPARISON
# ============================================

# Simulate model weights at different precisions
def simulate_inference_speed(precision_bits, n_weights=10_000_000, n_runs=100):
    """Simulate inference time at different precisions."""
    if precision_bits == 32:
        dtype = np.float32
    elif precision_bits == 16:
        dtype = np.float16
    elif precision_bits == 8:
        dtype = np.int8
    else:
        dtype = np.int8  # Approximate int4 with int8
    
    # Simulate weight matrix
    weights = np.random.randn(1000, 1000).astype(dtype)
    inputs = np.random.randn(32, 1000).astype(np.float32)
    
    # Warm up
    for _ in range(5):
        _ = inputs @ weights.astype(np.float32)
    
    # Benchmark
    start = time.time()
    for _ in range(n_runs):
        _ = inputs @ weights.astype(np.float32)
    elapsed = (time.time() - start) / n_runs * 1000
    
    memory_mb = weights.nbytes / (1024 * 1024)
    return elapsed, memory_mb

print("QUANTIZATION COMPARISON:")
print(f"{'Precision':<12} {'Latency (ms)':>14} {'Memory (MB)':>12} {'Speedup':>10}")
print("-" * 52)

baseline_latency = None
for bits in [32, 16, 8, 4]:
    latency, memory = simulate_inference_speed(bits)
    if baseline_latency is None:
        baseline_latency = latency
    speedup = baseline_latency / latency
    label = f"FP{bits}" if bits >= 16 else f"INT{bits}"
    print(f"{label:<12} {latency:>14.3f} {memory:>12.2f} {speedup:>10.2f}x")

# ============================================
# PYTORCH → ONNX EXPORT (conceptual)
# ============================================

onnx_export_code = '''
import torch
import torch.nn as nn
import onnxruntime as ort
import numpy as np

# Define a simple model
class SimpleClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(20, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.layers(x)

model = SimpleClassifier()
model.eval()

# Export to ONNX
dummy_input = torch.randn(1, 20)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["features"],
    output_names=["prediction"],
    dynamic_axes={"features": {0: "batch_size"}, "prediction": {0: "batch_size"}},
    opset_version=17
)

# Load and run with ONNX Runtime (2-5x faster than PyTorch)
session = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])

# Benchmark: PyTorch vs ONNX Runtime
import time

X = np.random.randn(32, 20).astype(np.float32)
X_tensor = torch.tensor(X)

# PyTorch inference
start = time.time()
for _ in range(1000):
    with torch.no_grad():
        _ = model(X_tensor)
pytorch_time = (time.time() - start) / 1000 * 1000

# ONNX Runtime inference
start = time.time()
for _ in range(1000):
    _ = session.run(None, {"features": X})
onnx_time = (time.time() - start) / 1000 * 1000

print(f"PyTorch:      {pytorch_time:.3f} ms per batch")
print(f"ONNX Runtime: {onnx_time:.3f} ms per batch")
print(f"Speedup:      {pytorch_time / onnx_time:.2f}x")
'''

print("\\nONNX EXPORT PATTERN:")
print("PyTorch model → torch.onnx.export() → model.onnx → onnxruntime.InferenceSession")
print("Typical speedup: 2-5x on CPU, more with TensorRT on GPU")

# ============================================
# SEMANTIC CACHING FOR LLMs
# ============================================

from sentence_transformers import SentenceTransformer
import numpy as np

class SemanticCache:
    """Cache LLM responses for semantically similar queries."""
    
    def __init__(self, similarity_threshold=0.92):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.threshold = similarity_threshold
        self.cache = []  # List of (embedding, query, response)
    
    def _cosine_similarity(self, a, b):
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
    def get(self, query: str):
        if not self.cache:
            return None
        query_emb = self.embedder.encode([query])[0]
        for emb, cached_query, response in self.cache:
            sim = self._cosine_similarity(query_emb, emb)
            if sim >= self.threshold:
                print(f"  Cache HIT (similarity: {sim:.3f}) — '{cached_query}'")
                return response
        return None
    
    def set(self, query: str, response: str):
        emb = self.embedder.encode([query])[0]
        self.cache.append((emb, query, response))

cache = SemanticCache(similarity_threshold=0.90)

# Simulate LLM calls with caching
queries = [
    ("What is machine learning?", "ML is a subset of AI where systems learn from data."),
    ("Explain machine learning to me", None),   # Should hit cache
    ("What is deep learning?", "DL uses neural networks with many layers."),
    ("Tell me about deep learning", None),       # Should hit cache
    ("What is Python?", "Python is a high-level programming language."),
]

print("\\nSEMANTIC CACHE DEMO:")
for query, mock_response in queries:
    cached = cache.get(query)
    if cached:
        print(f"Q: {query}")
        print(f"A: {cached} [FROM CACHE]\\n")
    else:
        response = mock_response or "No response available"
        cache.set(query, response)
        print(f"Q: {query}")
        print(f"A: {response} [LLM CALL]\\n")`
    }
  ],

  resources: [
    {
      title: 'vLLM — High-throughput LLM Serving',
      url: 'https://vllm.ai/',
      description: 'Industry-standard LLM serving framework with PagedAttention'
    },
    {
      title: 'ONNX Runtime Documentation',
      url: 'https://onnxruntime.ai/',
      description: 'Cross-platform inference engine for ONNX models'
    },
    {
      title: 'Triton Inference Server - NVIDIA',
      url: 'https://developer.nvidia.com/triton-inference-server',
      description: 'Production-grade model serving for GPU inference'
    },
    {
      title: 'Hugging Face Optimum',
      url: 'https://huggingface.co/docs/optimum',
      description: 'Toolkit for optimizing Transformers for inference'
    }
  ],

  questions: [
    {
      question: 'What is the difference between model training and model serving?',
      answer: 'Training: runs once or periodically, batch processing, optimize for throughput, GPU clusters, hours to days. Serving: runs on every user request, optimize for latency AND throughput, must handle thousands of concurrent requests, strict SLOs (p99 < 200ms). Training is a data science problem. Serving is a software engineering problem. SDEs at AI companies spend more time on serving infrastructure than training.'
    },
    {
      question: 'What is quantization and what are the trade-offs?',
      answer: 'Quantization reduces numerical precision of model weights: FP32 (4 bytes) → FP16 (2 bytes, 2x smaller) → INT8 (1 byte, 4x smaller, ~1-2% accuracy loss) → INT4 (0.5 bytes, 8x smaller, ~3-5% accuracy loss). Benefits: smaller model, faster inference, less memory. Trade-offs: accuracy loss, some hardware doesn\'t support low precision. Post-Training Quantization (PTQ) is easiest — no retraining. Quantization-Aware Training (QAT) is more accurate but requires retraining.'
    },
    {
      question: 'What is dynamic batching and why does it improve GPU utilization?',
      answer: 'Dynamic batching groups multiple incoming requests into a single batch for one forward pass. Without batching: 100 requests = 100 separate GPU calls, GPU utilization ~10%. With batching: 100 requests = 1 GPU call, GPU utilization ~90%. Trade-off: adds latency (wait for batch to fill). Solution: set a max wait time (e.g., 10ms) — if batch fills before that, process immediately; otherwise process at timeout. Critical for cost-efficient GPU serving.'
    },
    {
      question: 'What is knowledge distillation?',
      answer: 'Knowledge distillation trains a small "student" model to mimic a large "teacher" model. The student learns from the teacher\'s soft probability outputs (e.g., 70% cat, 20% dog, 10% other) rather than hard labels (cat). Soft outputs contain more information about the teacher\'s learned representations. Result: student is 10-100x smaller but retains most of teacher\'s performance. Example: DistilBERT is 40% smaller than BERT but retains 97% of performance.'
    },
    {
      question: 'What is vLLM and what problem does it solve?',
      answer: 'vLLM solves the KV cache memory management problem in LLM serving. Traditional serving pre-allocates memory for the maximum sequence length, wasting 60-80% of GPU memory. vLLM\'s PagedAttention manages KV cache like OS virtual memory — allocates memory in pages, only as needed. Combined with continuous batching (process requests as they arrive), vLLM achieves 24x higher throughput than naive serving. Industry standard for production LLM deployment.'
    },
    {
      question: 'What is semantic caching and when should you use it?',
      answer: 'Semantic caching stores LLM responses and returns cached answers for semantically similar queries (not just identical ones). Implementation: embed the query, check if any cached query has cosine similarity > threshold (e.g., 0.92), return cached response if so. Benefits: reduces LLM API costs by 20-60% for repetitive queries, reduces latency. Use when: many users ask similar questions (customer support, FAQ bots). Don\'t use when: queries are highly unique or require fresh information.'
    },
    {
      question: 'How would you design a model serving system for 10,000 requests per second?',
      answer: 'Design: 1) Load balancer distributes requests across model server replicas. 2) Dynamic batching groups requests for efficient GPU use. 3) Model optimization: quantize to INT8, export to ONNX/TensorRT. 4) Horizontal scaling: auto-scale replicas based on GPU utilization. 5) Caching: semantic cache for LLMs, result cache (Redis) for identical inputs. 6) Async processing: non-blocking I/O, async frameworks (FastAPI). 7) Monitoring: p99 latency, throughput, GPU utilization, error rate. 8) Circuit breaker: fail fast if downstream is slow.'
    }
  ]
};
