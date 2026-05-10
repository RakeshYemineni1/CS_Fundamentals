export const enhancedGPUDistributedTraining = {
  id: 'gpu-distributed-training',
  title: 'GPU Architecture & Distributed Training',
  subtitle: 'CUDA, Tensor Cores, Data Parallelism, Model Parallelism, and Gradient Checkpointing',
  summary: 'Training large AI models requires understanding GPU architecture and distributed training strategies. This covers how GPUs accelerate matrix operations, how to split training across multiple GPUs, and optimization techniques like gradient checkpointing and mixed precision training.',
  analogy: 'A GPU is like a factory with thousands of small workers (CUDA cores) doing simple tasks in parallel, versus a CPU which is a few highly skilled workers doing complex tasks sequentially. Distributed training is like splitting a massive construction project across multiple factories — you need to coordinate carefully so all factories build compatible pieces.',

  explanation: `WHY GPU ARCHITECTURE MATTERS FOR AI SDEs

If you are interviewing at companies that train their own models (OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral), you will be asked about GPU architecture and distributed training. Even at companies that only do inference, understanding GPU constraints helps you make better serving decisions.

═══════════════════════════════════════════════════════════════

GPU ARCHITECTURE FUNDAMENTALS

CPU vs GPU:
- CPU: few powerful cores (4-128), optimized for sequential tasks, large cache, complex branch prediction
- GPU: thousands of simple cores (thousands to tens of thousands), optimized for parallel tasks, high memory bandwidth
- AI workloads = massive matrix multiplications = perfectly parallel = GPU wins

KEY GPU COMPONENTS:

CUDA Cores (NVIDIA):
- Basic parallel processing units
- Each core executes one floating-point operation per clock cycle
- A100: 6912 CUDA cores, H100: 16896 CUDA cores

Tensor Cores:
- Specialized hardware for matrix multiply-accumulate (MMA) operations
- Operate on 4×4 or 16×16 matrix tiles in a single instruction
- 8-16x faster than CUDA cores for matrix operations
- Critical for transformer training and inference
- Support mixed precision: FP16/BF16 inputs, FP32 accumulation

Memory Hierarchy:
- Registers: fastest, per-thread, ~KB
- Shared Memory (SRAM): fast, per-block, ~48-228KB
- L2 Cache: medium, per-GPU, ~40-50MB
- HBM (High Bandwidth Memory): main GPU memory, slow but large
  - A100: 80GB HBM2e, 2TB/s bandwidth
  - H100: 80GB HBM3, 3.35TB/s bandwidth
- PCIe/NVLink: GPU-to-GPU communication

MEMORY BANDWIDTH vs COMPUTE:
- Arithmetic Intensity = FLOPs / bytes of memory accessed
- Memory-bound operations: low arithmetic intensity (elementwise ops, attention with small batch)
- Compute-bound operations: high arithmetic intensity (large matrix multiplications)
- Goal: keep tensor cores busy, minimize memory transfers

NVIDIA GPU GENERATIONS:
- V100 (2017): 16/32GB, 900GB/s bandwidth — first with Tensor Cores
- A100 (2020): 40/80GB, 2TB/s — dominant for training
- H100 (2022): 80GB, 3.35TB/s, 4th gen Tensor Cores — current state of art
- H200 (2024): 141GB HBM3e — for very large models

═══════════════════════════════════════════════════════════════

MIXED PRECISION TRAINING

Train with lower precision to use Tensor Cores efficiently:

FP32 (32-bit float): full precision, 4 bytes per value
FP16 (16-bit float): half precision, 2 bytes — 2x memory, 2x bandwidth
BF16 (Brain Float 16): same exponent range as FP32, less precision — preferred for training

AUTOMATIC MIXED PRECISION (AMP):
- Forward pass and gradients in FP16/BF16
- Master weights kept in FP32 for numerical stability
- Loss scaling: multiply loss by large factor to prevent FP16 underflow
- PyTorch: torch.cuda.amp.autocast()
- 2-3x speedup, 2x memory reduction, minimal accuracy loss

═══════════════════════════════════════════════════════════════

GRADIENT CHECKPOINTING

PROBLEM: Storing all intermediate activations for backpropagation requires O(n) memory where n = number of layers. For large models, this exceeds GPU memory.

SOLUTION: Gradient checkpointing (activation recomputation)
- During forward pass: only save activations at checkpoint boundaries, discard the rest
- During backward pass: recompute discarded activations from checkpoints as needed
- Trade-off: ~33% more compute, but memory reduced from O(n) to O(√n)
- Enables training models that would otherwise not fit in GPU memory

═══════════════════════════════════════════════════════════════

DISTRIBUTED TRAINING STRATEGIES

When a model or dataset is too large for a single GPU, distribute across multiple GPUs.

1. DATA PARALLELISM (DP)

Each GPU has a full copy of the model.
Split the batch across GPUs — each GPU processes a different mini-batch.
After each step: average gradients across all GPUs (AllReduce).

Pros: Simple, works well when model fits on one GPU
Cons: Each GPU needs full model copy — doesn't help with model size

PyTorch: DistributedDataParallel (DDP) — preferred over DataParallel
- Each process has one GPU
- Gradients synchronized via NCCL AllReduce
- Linear scaling: 8 GPUs = ~8x throughput (with good communication)

2. MODEL PARALLELISM (MP)

Split the model itself across GPUs — different layers on different GPUs.

Pipeline Parallelism:
- GPU 1: layers 1-12, GPU 2: layers 13-24, GPU 3: layers 25-36
- Data flows through GPUs sequentially like a pipeline
- Problem: GPU bubble — GPUs idle while waiting for previous GPU
- Solution: micro-batching — split batch into micro-batches, pipeline them
- Used by: GPipe, PipeDream

Tensor Parallelism:
- Split individual layers (weight matrices) across GPUs
- Each GPU holds a slice of each weight matrix
- Requires communication within each layer (AllReduce after each layer)
- More communication overhead but better GPU utilization
- Used by: Megatron-LM (NVIDIA)

3. FULLY SHARDED DATA PARALLELISM (FSDP)

Shard model parameters, gradients, AND optimizer states across GPUs.
Each GPU only holds 1/N of the model at any time.
Before each layer's forward/backward: gather the full layer weights (AllGather).
After backward: shard gradients again (ReduceScatter).

Pros: Memory scales linearly with number of GPUs — enables training 100B+ models
Cons: More communication overhead than DDP
PyTorch: torch.distributed.fsdp.FullyShardedDataParallel
Used by: Meta for training LLaMA

4. 3D PARALLELISM

Combine all three: Data Parallelism + Pipeline Parallelism + Tensor Parallelism
Used by: Megatron-DeepSpeed for training GPT-3 scale models
Requires careful tuning of parallelism dimensions

DEEPSPEED (Microsoft):
- ZeRO (Zero Redundancy Optimizer): shards optimizer states, gradients, parameters
- ZeRO Stage 1: shard optimizer states only
- ZeRO Stage 2: shard optimizer states + gradients
- ZeRO Stage 3: shard optimizer states + gradients + parameters (= FSDP)
- ZeRO-Infinity: offload to CPU/NVMe for even larger models

═══════════════════════════════════════════════════════════════

COMMUNICATION PRIMITIVES

AllReduce: sum/average tensors across all GPUs — used in DDP gradient sync
AllGather: each GPU contributes its shard, all GPUs get full tensor — used in FSDP
ReduceScatter: reduce across GPUs, each GPU gets a different shard — used in FSDP
Broadcast: one GPU sends tensor to all others — used for parameter initialization

INTERCONNECTS:
- NVLink: NVIDIA's high-speed GPU-to-GPU interconnect within a node
  - NVLink 4.0 (H100): 900GB/s bidirectional bandwidth
- InfiniBand: high-speed network between nodes
  - HDR InfiniBand: 200Gb/s
- PCIe: slower, used when NVLink not available

COMMUNICATION BOTTLENECK:
For large models, communication can dominate training time.
Gradient compression, overlap of compute and communication, and topology-aware scheduling help.

═══════════════════════════════════════════════════════════════

TRAINING OPTIMIZATION TECHNIQUES

Gradient Accumulation:
- Simulate larger batch sizes without more memory
- Accumulate gradients over N steps before updating weights
- Effective batch size = batch_size × accumulation_steps

Flash Attention:
- Recomputes attention scores in tiles to avoid storing full N×N attention matrix
- Reduces attention memory from O(N²) to O(N)
- 2-4x faster than standard attention, critical for long sequences
- Used in all modern LLM training

Optimizer State Sharding:
- Adam optimizer stores: parameters (fp32) + gradients (fp32) + momentum (fp32) + variance (fp32)
- = 4× model size in memory just for optimizer
- ZeRO shards this across GPUs

Learning Rate Scheduling:
- Warmup: gradually increase LR from 0 to target (prevents early instability)
- Cosine decay: smoothly decrease LR to near 0
- Linear decay: simpler alternative
- Standard: warmup for 1-5% of training steps, then cosine decay`,

  keyPoints: [
    'GPU: thousands of simple parallel cores + Tensor Cores for matrix ops — perfect for AI',
    'Tensor Cores: specialized hardware for matrix multiply, 8-16x faster than CUDA cores',
    'Mixed precision (BF16/FP16 + FP32 master weights): 2-3x speedup, 2x memory reduction',
    'Gradient checkpointing: recompute activations during backward — trades compute for memory',
    'Data Parallelism: full model on each GPU, split batch — simple, scales throughput',
    'Model Parallelism: split model across GPUs — pipeline (layers) or tensor (weight matrices)',
    'FSDP/ZeRO: shard parameters + gradients + optimizer states — enables 100B+ model training',
    'Flash Attention: tiled attention computation — O(N) memory instead of O(N²)'
  ],

  codeExamples: [
    {
      title: 'Mixed Precision Training & Gradient Checkpointing',
      language: 'python',
      description: 'Implement mixed precision training and gradient checkpointing in PyTorch.',
      code: `import torch
import torch.nn as nn
from torch.cuda.amp import autocast, GradScaler
from torch.utils.checkpoint import checkpoint

# ============================================
# MIXED PRECISION TRAINING WITH AMP
# ============================================

class TransformerBlock(nn.Module):
    def __init__(self, d_model=512, n_heads=8, d_ff=2048):
        super().__init__()
        self.attention = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.ff = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model)
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x):
        attn_out, _ = self.attention(x, x, x)
        x = self.norm1(x + attn_out)
        x = self.norm2(x + self.ff(x))
        return x

class SimpleTransformer(nn.Module):
    def __init__(self, vocab_size=50000, d_model=512, n_layers=12):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.layers = nn.ModuleList([
            TransformerBlock(d_model) for _ in range(n_layers)
        ])
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x, use_checkpointing=False):
        x = self.embedding(x)
        for layer in self.layers:
            if use_checkpointing:
                # Gradient checkpointing: recompute activations during backward
                # Saves memory at cost of ~33% more compute
                x = checkpoint(layer, x, use_reentrant=False)
            else:
                x = layer(x)
        return self.head(x)

# ============================================
# TRAINING LOOP WITH AMP
# ============================================

def train_with_amp(model, dataloader, optimizer, n_epochs=3):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)

    # GradScaler: scales loss to prevent FP16 underflow
    scaler = GradScaler()

    for epoch in range(n_epochs):
        for batch_idx, (input_ids, labels) in enumerate(dataloader):
            input_ids = input_ids.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            # autocast: automatically uses FP16/BF16 for eligible operations
            with autocast(dtype=torch.bfloat16):
                logits = model(input_ids, use_checkpointing=True)
                loss = nn.CrossEntropyLoss()(
                    logits.view(-1, logits.size(-1)),
                    labels.view(-1)
                )

            # Scale loss, backward, unscale, clip, step
            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimizer)
            scaler.update()

            if batch_idx % 100 == 0:
                print(f"Epoch {epoch}, Step {batch_idx}, Loss: {loss.item():.4f}")

# ============================================
# MEMORY COMPARISON: WITH vs WITHOUT CHECKPOINTING
# ============================================

def measure_memory(model, batch_size=4, seq_len=512, use_checkpointing=False):
    if not torch.cuda.is_available():
        print("CUDA not available — showing conceptual comparison")
        return

    device = torch.device('cuda')
    model = model.to(device)
    torch.cuda.reset_peak_memory_stats()

    x = torch.randint(0, 50000, (batch_size, seq_len)).to(device)
    labels = torch.randint(0, 50000, (batch_size, seq_len)).to(device)

    with autocast(dtype=torch.bfloat16):
        logits = model(x, use_checkpointing=use_checkpointing)
        loss = nn.CrossEntropyLoss()(logits.view(-1, 50000), labels.view(-1))

    loss.backward()
    peak_memory = torch.cuda.max_memory_allocated() / 1024**3
    print(f"Checkpointing={'ON' if use_checkpointing else 'OFF'}: Peak memory = {peak_memory:.2f} GB")

model = SimpleTransformer(n_layers=12)
print("Memory usage comparison:")
print("Without checkpointing: stores ALL intermediate activations")
print("With checkpointing: recomputes activations, ~33% more compute but ~50% less memory")
print()
print("Rule of thumb:")
print("  - 1B parameter model in BF16 = ~2GB just for weights")
print("  - Optimizer states (Adam) = ~4x weights = ~8GB")
print("  - Activations = depends on batch size and sequence length")
print("  - Gradient checkpointing reduces activation memory from O(n_layers) to O(sqrt(n_layers))")`
    },
    {
      title: 'Distributed Data Parallel Training',
      language: 'python',
      description: 'Set up distributed training with PyTorch DDP across multiple GPUs.',
      code: `import torch
import torch.nn as nn
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, DistributedSampler
import os

# ============================================
# DISTRIBUTED DATA PARALLEL (DDP) TRAINING
# Run with: torchrun --nproc_per_node=4 train.py
# ============================================

def setup_distributed():
    """Initialize the distributed process group."""
    dist.init_process_group(backend='nccl')  # NCCL: optimized for NVIDIA GPUs
    local_rank = int(os.environ['LOCAL_RANK'])
    torch.cuda.set_device(local_rank)
    return local_rank

def cleanup_distributed():
    dist.destroy_process_group()

def train_ddp():
    local_rank = setup_distributed()
    world_size = dist.get_world_size()  # Total number of GPUs
    global_rank = dist.get_rank()       # This GPU's rank

    if global_rank == 0:
        print(f"Training with {world_size} GPUs")

    # ============================================
    # MODEL: wrap with DDP
    # ============================================
    model = nn.Sequential(
        nn.Linear(1024, 2048),
        nn.ReLU(),
        nn.Linear(2048, 1024),
        nn.ReLU(),
        nn.Linear(1024, 10)
    ).to(local_rank)

    # DDP wraps model — handles gradient synchronization automatically
    model = DDP(model, device_ids=[local_rank])

    # ============================================
    # DATA: DistributedSampler ensures each GPU sees different data
    # ============================================
    from torch.utils.data import TensorDataset
    dataset = TensorDataset(
        torch.randn(10000, 1024),
        torch.randint(0, 10, (10000,))
    )

    # DistributedSampler: partitions dataset across GPUs
    sampler = DistributedSampler(
        dataset,
        num_replicas=world_size,
        rank=global_rank,
        shuffle=True
    )

    dataloader = DataLoader(dataset, batch_size=32, sampler=sampler)

    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss()

    # ============================================
    # TRAINING LOOP
    # ============================================
    for epoch in range(10):
        sampler.set_epoch(epoch)  # Important: ensures different shuffling each epoch
        model.train()

        for batch_idx, (x, y) in enumerate(dataloader):
            x, y = x.to(local_rank), y.to(local_rank)

            optimizer.zero_grad()
            output = model(x)
            loss = criterion(output, y)
            loss.backward()  # DDP automatically AllReduces gradients here

            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()

        # Only rank 0 saves checkpoints and logs
        if global_rank == 0 and epoch % 2 == 0:
            print(f"Epoch {epoch}, Loss: {loss.item():.4f}")
            # Save model (unwrap DDP to get underlying model)
            torch.save(model.module.state_dict(), f'checkpoint_epoch_{epoch}.pt')

    cleanup_distributed()

# ============================================
# FSDP (Fully Sharded Data Parallel)
# For models too large for DDP
# ============================================

from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import ShardingStrategy, MixedPrecision
import torch

def train_fsdp():
    local_rank = setup_distributed()

    # Mixed precision policy for FSDP
    mp_policy = MixedPrecision(
        param_dtype=torch.bfloat16,    # Parameters in BF16
        reduce_dtype=torch.float32,    # Gradient reduction in FP32
        buffer_dtype=torch.bfloat16,   # Buffers in BF16
    )

    model = nn.Sequential(
        nn.Linear(4096, 4096),
        nn.ReLU(),
        nn.Linear(4096, 4096),
    )

    # FSDP: shards parameters, gradients, and optimizer states across GPUs
    model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD,  # ZeRO Stage 3
        mixed_precision=mp_policy,
        device_id=local_rank,
    )

    print(f"FSDP model on GPU {local_rank}")
    print("Each GPU holds only 1/N of the model parameters")
    print("Parameters gathered before each layer's forward/backward pass")

# ============================================
# MEMORY MATH
# ============================================

def estimate_training_memory(n_params_billions: float,
                              n_gpus: int = 1,
                              use_fsdp: bool = False) -> dict:
    """Estimate GPU memory required for training."""
    n_params = n_params_billions * 1e9

    # Memory in GB
    params_bf16 = n_params * 2 / 1e9          # BF16 weights
    params_fp32 = n_params * 4 / 1e9          # FP32 master weights
    gradients   = n_params * 4 / 1e9          # FP32 gradients
    adam_m      = n_params * 4 / 1e9          # Adam first moment
    adam_v      = n_params * 4 / 1e9          # Adam second moment

    total_per_gpu = params_bf16 + params_fp32 + gradients + adam_m + adam_v

    if use_fsdp:
        total_per_gpu /= n_gpus  # FSDP shards everything

    return {
        'model_params_bf16_gb': round(params_bf16, 1),
        'optimizer_states_gb': round(params_fp32 + gradients + adam_m + adam_v, 1),
        'total_without_activations_gb': round(total_per_gpu, 1),
        'note': 'Add activation memory based on batch size and sequence length'
    }

print("Memory estimates for training:")
for size in [7, 13, 70]:
    mem = estimate_training_memory(size, n_gpus=8, use_fsdp=True)
    print(f"  {size}B params with FSDP on 8 GPUs: ~{mem['total_without_activations_gb']}GB per GPU")`
    }
  ],

  resources: [
    {
      title: 'PyTorch Distributed Training Guide',
      url: 'https://pytorch.org/tutorials/beginner/dist_overview.html',
      description: 'Official PyTorch guide to distributed training with DDP and FSDP'
    },
    {
      title: 'DeepSpeed Documentation',
      url: 'https://www.deepspeed.ai/',
      description: 'Microsoft DeepSpeed — ZeRO optimizer and distributed training'
    },
    {
      title: 'Megatron-LM Paper',
      url: 'https://arxiv.org/abs/1909.08053',
      description: 'NVIDIA\'s tensor parallelism approach for training large language models'
    },
    {
      title: 'Flash Attention Paper',
      url: 'https://arxiv.org/abs/2205.14135',
      description: 'IO-aware exact attention algorithm — critical for long-context training'
    }
  ],

  questions: [
    {
      question: 'Why are GPUs better than CPUs for training neural networks?',
      answer: 'Neural network training is dominated by matrix multiplications — inherently parallel operations. GPUs have thousands of simple cores (A100: 6912 CUDA cores) that execute these in parallel, vs CPUs with few powerful cores optimized for sequential tasks. Tensor Cores (specialized hardware in modern GPUs) perform 4×4 matrix multiply-accumulate in a single instruction, 8-16x faster than CUDA cores. High memory bandwidth (A100: 2TB/s vs CPU: ~50GB/s) feeds data to these cores fast enough to keep them busy.'
    },
    {
      question: 'What is mixed precision training and why is it used?',
      answer: 'Mixed precision training uses FP16/BF16 for forward pass and gradients (2 bytes per value) while keeping FP32 master weights for numerical stability (4 bytes). Benefits: 2x memory reduction, 2-3x speedup (Tensor Cores optimized for FP16/BF16), higher throughput. BF16 preferred over FP16 for training — same exponent range as FP32 so no overflow issues. Loss scaling needed for FP16 to prevent underflow. PyTorch: torch.cuda.amp.autocast() handles this automatically.'
    },
    {
      question: 'What is gradient checkpointing and when should you use it?',
      answer: 'Gradient checkpointing (activation recomputation) saves memory by not storing all intermediate activations during the forward pass. Instead, only checkpoint activations at boundaries and recompute discarded ones during backward pass. Memory: O(n) → O(√n) layers. Cost: ~33% more compute. Use when: model doesn\'t fit in GPU memory due to activations, training with large batch sizes or long sequences. Essential for training large models. PyTorch: torch.utils.checkpoint.checkpoint().'
    },
    {
      question: 'What is the difference between data parallelism and model parallelism?',
      answer: 'Data Parallelism (DDP): full model copy on each GPU, split batch across GPUs, sync gradients via AllReduce after each step. Simple, scales throughput linearly. Requires model to fit on one GPU. Model Parallelism: split the model itself across GPUs. Pipeline parallelism: different layers on different GPUs (GPU1=layers1-12, GPU2=layers13-24). Tensor parallelism: split weight matrices across GPUs. Use when model is too large for one GPU. More complex, more communication overhead.'
    },
    {
      question: 'What is FSDP/ZeRO and how does it enable training very large models?',
      answer: 'FSDP (Fully Sharded Data Parallel) / ZeRO (Zero Redundancy Optimizer) shards model parameters, gradients, AND optimizer states across all GPUs. Each GPU holds only 1/N of everything. Before each layer\'s forward/backward: AllGather to reconstruct full layer. After backward: ReduceScatter to re-shard gradients. Memory scales linearly with GPUs — 8 GPUs = 8x less memory per GPU. Enables training 70B+ models on commodity GPU clusters. ZeRO Stage 3 = FSDP. Used by Meta for LLaMA training.'
    },
    {
      question: 'What is Flash Attention and why is it important?',
      answer: 'Standard attention stores the full N×N attention matrix in HBM (GPU main memory), requiring O(N²) memory — prohibitive for long sequences. Flash Attention computes attention in tiles that fit in fast SRAM (shared memory), never materializing the full N×N matrix. Memory: O(N²) → O(N). Speed: 2-4x faster due to reduced HBM reads/writes. Critical for long-context training (128K+ tokens). Used in all modern LLM training. Flash Attention 2 and 3 further improve GPU utilization.'
    }
  ]
};
