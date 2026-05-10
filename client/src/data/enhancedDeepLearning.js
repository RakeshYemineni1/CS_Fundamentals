export const enhancedDeepLearning = {
  id: 'deep-learning',
  title: 'Deep Learning',
  subtitle: 'CNNs, RNNs, LSTMs, and the Transformer Architecture',
  summary: 'Deep Learning uses neural networks with many layers to automatically learn hierarchical representations from raw data. Key architectures include CNNs for images, RNNs/LSTMs for sequences, and Transformers for language and beyond.',
  analogy: 'Deep learning architectures are like specialized tools: CNNs are like eyes — they scan images in patches and recognize patterns. RNNs are like reading a book — they process words one by one, remembering context. Transformers are like a study group — everyone reads the whole text at once and pays attention to the most relevant parts simultaneously.',

  explanation: `WHAT IS DEEP LEARNING?

Deep Learning is a subset of Machine Learning that uses neural networks with many layers (deep networks) to automatically learn hierarchical feature representations from raw data. Instead of manually engineering features, deep learning learns them directly.

Shallow ML: Raw data → Manual features → Model → Prediction
Deep Learning: Raw data → Automatic feature learning → Prediction

WHY "DEEP"?
The depth refers to the number of hidden layers. More layers = more abstract representations:
- Layer 1: Detects edges and colors
- Layer 2: Combines edges into shapes
- Layer 3: Combines shapes into parts
- Layer 4: Combines parts into objects

═══════════════════════════════════════════════════════════════

1. CONVOLUTIONAL NEURAL NETWORKS (CNNs)

DESIGNED FOR: Images, video, spatial data

KEY IDEA: Instead of connecting every pixel to every neuron (too many parameters), use small filters that slide across the image detecting local patterns.

CORE LAYERS:

Convolutional Layer:
- Applies learnable filters (kernels) across the input
- Each filter detects a specific pattern (edge, curve, texture)
- Output: feature maps showing where patterns appear
- Parameters: filter size (3×3, 5×5), number of filters, stride, padding

Pooling Layer:
- Reduces spatial dimensions (downsampling)
- Max Pooling: takes the maximum value in each region
- Average Pooling: takes the average value
- Makes features translation-invariant

Fully Connected Layer:
- Flattens feature maps and connects to output
- Final classification/regression

FAMOUS CNN ARCHITECTURES:
- LeNet (1998): First successful CNN for digit recognition
- AlexNet (2012): Won ImageNet, started deep learning revolution
- VGG (2014): Very deep, simple 3×3 convolutions
- ResNet (2015): Residual connections, 152 layers, solved vanishing gradient
- EfficientNet (2019): Scales width, depth, resolution together

APPLICATIONS: Image classification, object detection, face recognition, medical imaging

═══════════════════════════════════════════════════════════════

2. RECURRENT NEURAL NETWORKS (RNNs)

DESIGNED FOR: Sequential data (text, time series, audio)

KEY IDEA: Process sequences one element at a time, maintaining a hidden state that carries information from previous steps.

ARCHITECTURE:
- At each time step t: h_t = f(W_h × h_{t-1} + W_x × x_t + b)
- Hidden state h_t acts as "memory" of past inputs
- Same weights used at every time step (weight sharing)

PROBLEM — VANISHING GRADIENT:
For long sequences, gradients vanish during backpropagation through time (BPTT). The network "forgets" information from early in the sequence.

═══════════════════════════════════════════════════════════════

3. LONG SHORT-TERM MEMORY (LSTM)

DESIGNED TO FIX: RNN's vanishing gradient / long-term dependency problem

KEY IDEA: Add a "cell state" (long-term memory) alongside the hidden state, controlled by three gates:

FORGET GATE: Decides what to erase from cell state
f_t = sigmoid(W_f × [h_{t-1}, x_t] + b_f)

INPUT GATE: Decides what new information to store
i_t = sigmoid(W_i × [h_{t-1}, x_t] + b_i)
c̃_t = tanh(W_c × [h_{t-1}, x_t] + b_c)

OUTPUT GATE: Decides what to output from cell state
o_t = sigmoid(W_o × [h_{t-1}, x_t] + b_o)
h_t = o_t × tanh(c_t)

GRU (Gated Recurrent Unit): Simplified LSTM with 2 gates instead of 3, faster to train, similar performance.

APPLICATIONS: Text generation, machine translation, speech recognition, time series forecasting

═══════════════════════════════════════════════════════════════

4. TRANSFORMER ARCHITECTURE

DESIGNED FOR: Sequences — but processes ALL positions in parallel (unlike RNNs)

INTRODUCED: "Attention is All You Need" (Vaswani et al., 2017)

KEY INNOVATION — SELF-ATTENTION:
Instead of processing tokens sequentially, every token attends to every other token simultaneously. This captures long-range dependencies without vanishing gradients.

SELF-ATTENTION MECHANISM:
1. For each token, compute Query (Q), Key (K), Value (V) vectors
2. Attention score = softmax(Q × K^T / √d_k)
3. Output = Attention score × V
4. Each token's output is a weighted sum of all other tokens' values

MULTI-HEAD ATTENTION:
Run self-attention multiple times in parallel (multiple "heads"), each learning different types of relationships. Concatenate and project results.

POSITIONAL ENCODING:
Since Transformers process all tokens in parallel, they have no inherent sense of order. Positional encodings are added to token embeddings to inject position information.

TRANSFORMER COMPONENTS:
- Encoder: Processes input sequence (used in BERT)
- Decoder: Generates output sequence (used in GPT)
- Encoder-Decoder: Both (used in T5, original translation models)

WHY TRANSFORMERS DOMINATE:
- Parallelizable (unlike RNNs) → trains faster on GPUs
- Captures long-range dependencies better than LSTMs
- Scales extremely well with more data and compute
- Foundation of all modern LLMs (GPT, BERT, T5, LLaMA)

═══════════════════════════════════════════════════════════════

COMPARISON TABLE

Architecture | Best For | Key Strength | Key Weakness
CNN | Images/spatial | Local pattern detection | Not for sequences
RNN | Short sequences | Sequential processing | Vanishing gradient
LSTM | Long sequences | Long-term memory | Slow (sequential)
Transformer | Text/any sequence | Parallel, long-range | High memory cost`,

  keyPoints: [
    'CNNs use convolutional filters to detect local spatial patterns in images',
    'Pooling layers reduce spatial dimensions and add translation invariance',
    'RNNs process sequences with a hidden state but suffer from vanishing gradients',
    'LSTMs solve vanishing gradients with forget, input, and output gates',
    'Transformers process all tokens in parallel using self-attention',
    'Self-attention: each token attends to all others — captures long-range dependencies',
    'Multi-head attention runs attention multiple times to learn different relationships',
    'Transformers are the foundation of all modern LLMs (GPT, BERT, LLaMA)'
  ],

  codeExamples: [
    {
      title: 'CNN for Image Classification',
      language: 'python',
      description: 'Build a CNN to classify images using Keras.',
      code: `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# ============================================
# CNN FOR IMAGE CLASSIFICATION (CIFAR-10)
# 10 classes: airplane, car, bird, cat, etc.
# ============================================

# Load and preprocess data
(X_train, y_train), (X_test, y_test) = keras.datasets.cifar10.load_data()

# Normalize pixel values to [0, 1]
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

# One-hot encode labels
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

print(f"Training data shape: {X_train.shape}")  # (50000, 32, 32, 3)

# ============================================
# BUILD CNN ARCHITECTURE
# ============================================

model = keras.Sequential([
    # Block 1: Detect low-level features (edges, colors)
    layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(32, 32, 3)),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),   # 32x32 → 16x16
    layers.Dropout(0.25),
    
    # Block 2: Detect mid-level features (shapes, textures)
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),   # 16x16 → 8x8
    layers.Dropout(0.25),
    
    # Block 3: Detect high-level features (object parts)
    layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),   # 8x8 → 4x4
    layers.Dropout(0.25),
    
    # Classifier head
    layers.Flatten(),              # 4x4x128 → 2048
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')  # 10 classes
])

model.compile(
    optimizer=keras.optimizers.Adam(0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()
# Total params: ~1.2M

# Train
history = model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=64,
    validation_split=0.1,
    callbacks=[keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)]
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_acc:.2%}")

# Predict
class_names = ['airplane','car','bird','cat','deer','dog','frog','horse','ship','truck']
predictions = model.predict(X_test[:3])
for i, pred in enumerate(predictions):
    print(f"Image {i+1}: {class_names[pred.argmax()]}")`
    },
    {
      title: 'LSTM for Time Series Forecasting',
      language: 'python',
      description: 'Use an LSTM to predict future values in a time series.',
      code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# ============================================
# LSTM FOR TIME SERIES FORECASTING
# Predict next value given past 30 values
# ============================================

# Generate synthetic time series (sine wave + noise)
np.random.seed(42)
t = np.linspace(0, 100, 1000)
series = np.sin(0.5 * t) + 0.5 * np.sin(1.5 * t) + np.random.normal(0, 0.1, 1000)

# Create sequences: use past 30 steps to predict next 1 step
def create_sequences(data, seq_length=30):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length])
        y.append(data[i + seq_length])
    return np.array(X), np.array(y)

SEQ_LEN = 30
X, y = create_sequences(series, SEQ_LEN)

# Reshape for LSTM: (samples, timesteps, features)
X = X.reshape(X.shape[0], X.shape[1], 1)

# Split
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

print(f"X_train shape: {X_train.shape}")  # (760, 30, 1)

# ============================================
# BUILD LSTM MODEL
# ============================================

model = keras.Sequential([
    # First LSTM layer — return sequences for stacking
    layers.LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, 1)),
    layers.Dropout(0.2),
    
    # Second LSTM layer — return only last output
    layers.LSTM(32, return_sequences=False),
    layers.Dropout(0.2),
    
    # Output: predict single next value
    layers.Dense(16, activation='relu'),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.summary()

# Train
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.1,
    callbacks=[keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)],
    verbose=1
)

# Evaluate
test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
print(f"\\nTest MAE: {test_mae:.4f}")

# Predict next 10 steps autoregressively
last_sequence = X_test[-1]  # Last known sequence
future_predictions = []

for _ in range(10):
    pred = model.predict(last_sequence.reshape(1, SEQ_LEN, 1), verbose=0)[0, 0]
    future_predictions.append(pred)
    # Slide window: remove oldest, add new prediction
    last_sequence = np.roll(last_sequence, -1)
    last_sequence[-1] = pred

print("\\nNext 10 predicted values:")
for i, val in enumerate(future_predictions, 1):
    print(f"  Step {i}: {val:.4f}")`
    },
    {
      title: 'Self-Attention Mechanism (Transformer Core)',
      language: 'python',
      description: 'Implement the self-attention mechanism from scratch to understand how Transformers work.',
      code: `import numpy as np

# ============================================
# SELF-ATTENTION MECHANISM FROM SCRATCH
# The core of the Transformer architecture
# ============================================

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / e_x.sum(axis=axis, keepdims=True)

def self_attention(Q, K, V):
    """
    Scaled Dot-Product Attention
    
    Q: Query matrix  (seq_len, d_k)
    K: Key matrix    (seq_len, d_k)
    V: Value matrix  (seq_len, d_v)
    
    Returns: attention output (seq_len, d_v)
    """
    d_k = Q.shape[-1]
    
    # Step 1: Compute attention scores
    # How much should each token attend to every other token?
    scores = Q @ K.T / np.sqrt(d_k)  # Scale to prevent vanishing gradients
    
    # Step 2: Apply softmax to get attention weights (probabilities)
    attention_weights = softmax(scores, axis=-1)
    
    # Step 3: Weighted sum of values
    output = attention_weights @ V
    
    return output, attention_weights

# ============================================
# EXAMPLE: 4 tokens, d_model=8
# Sentence: "The cat sat down"
# ============================================

np.random.seed(42)
seq_len = 4   # 4 tokens
d_model = 8   # Embedding dimension
d_k = 4       # Key/Query dimension

# Simulated token embeddings (normally from an embedding layer)
token_embeddings = np.random.randn(seq_len, d_model)

# Learnable weight matrices (normally trained via backprop)
W_Q = np.random.randn(d_model, d_k)
W_K = np.random.randn(d_model, d_k)
W_V = np.random.randn(d_model, d_k)

# Project embeddings to Q, K, V
Q = token_embeddings @ W_Q  # (4, 4)
K = token_embeddings @ W_K  # (4, 4)
V = token_embeddings @ W_V  # (4, 4)

# Compute self-attention
output, attention_weights = self_attention(Q, K, V)

print("Token embeddings shape:", token_embeddings.shape)
print("Q, K, V shape:", Q.shape)
print("Attention output shape:", output.shape)
print()
print("Attention weights (each row sums to 1.0):")
print(np.round(attention_weights, 3))
print()
print("Interpretation:")
print("attention_weights[i][j] = how much token i attends to token j")
print("Row 0 (The): attends to all tokens with these weights:")
tokens = ["The", "cat", "sat", "down"]
for j, (token, weight) in enumerate(zip(tokens, attention_weights[0])):
    print(f"  → '{token}': {weight:.3f}")

# ============================================
# MULTI-HEAD ATTENTION (conceptual)
# ============================================

def multi_head_attention(X, num_heads=2, d_model=8):
    """
    Run self-attention multiple times in parallel.
    Each head learns different types of relationships.
    """
    d_k = d_model // num_heads
    outputs = []
    
    for head in range(num_heads):
        # Each head has its own weight matrices
        W_Q_h = np.random.randn(d_model, d_k)
        W_K_h = np.random.randn(d_model, d_k)
        W_V_h = np.random.randn(d_model, d_k)
        
        Q_h = X @ W_Q_h
        K_h = X @ W_K_h
        V_h = X @ W_V_h
        
        head_output, _ = self_attention(Q_h, K_h, V_h)
        outputs.append(head_output)
    
    # Concatenate all heads
    multi_head_output = np.concatenate(outputs, axis=-1)  # (seq_len, d_model)
    return multi_head_output

mha_output = multi_head_attention(token_embeddings, num_heads=2, d_model=8)
print(f"\\nMulti-head attention output shape: {mha_output.shape}")
print("Each token now has a rich representation informed by all other tokens")`
    }
  ],

  resources: [
    {
      title: 'Attention is All You Need (Original Paper)',
      url: 'https://arxiv.org/abs/1706.03762',
      description: 'The original Transformer paper that changed AI forever'
    },
    {
      title: 'The Illustrated Transformer - Jay Alammar',
      url: 'https://jalammar.github.io/illustrated-transformer/',
      description: 'Best visual explanation of the Transformer architecture'
    },
    {
      title: 'CS231n: CNNs for Visual Recognition - Stanford',
      url: 'https://cs231n.github.io/',
      description: 'Stanford\'s famous CNN course — free lecture notes and assignments'
    },
    {
      title: 'Understanding LSTMs - Christopher Olah',
      url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/',
      description: 'The definitive visual guide to understanding LSTMs'
    }
  ],

  questions: [
    {
      question: 'What is a CNN and why is it used for images?',
      answer: 'A CNN (Convolutional Neural Network) uses convolutional filters that slide across an image to detect local patterns (edges, textures, shapes). Key advantages over fully connected networks: 1) Parameter sharing — same filter applied everywhere, 2) Local connectivity — each neuron sees only a local region, 3) Translation invariance via pooling. Architecture: Conv → Pool → Conv → Pool → Flatten → Dense → Output.'
    },
    {
      question: 'What is the difference between RNN, LSTM, and GRU?',
      answer: 'RNN: Basic recurrent network with hidden state, suffers from vanishing gradient for long sequences. LSTM: Adds cell state (long-term memory) + 3 gates (forget, input, output) to control information flow — solves vanishing gradient. GRU: Simplified LSTM with 2 gates (reset, update), fewer parameters, similar performance, faster to train. Use LSTM/GRU for sequences longer than ~20 steps; Transformers for very long sequences.'
    },
    {
      question: 'What is self-attention in Transformers?',
      answer: 'Self-attention allows each token to attend to all other tokens in the sequence simultaneously. For each token, compute Query (Q), Key (K), Value (V) vectors. Attention score = softmax(Q × K^T / √d_k). Output = weighted sum of V vectors. This captures long-range dependencies without sequential processing. Unlike RNNs, all positions are processed in parallel, making Transformers much faster to train.'
    },
    {
      question: 'What is multi-head attention?',
      answer: 'Multi-head attention runs self-attention multiple times in parallel with different learned weight matrices (heads). Each head can learn different types of relationships (e.g., syntactic vs semantic). Outputs from all heads are concatenated and projected. Benefit: richer representations than single-head attention. Typical: 8-16 heads in large models. GPT-3 uses 96 attention heads.'
    },
    {
      question: 'Why did Transformers replace RNNs for NLP?',
      answer: '1) Parallelization: Transformers process all tokens simultaneously (RNNs are sequential → slow). 2) Long-range dependencies: Self-attention directly connects any two positions (RNNs struggle with long sequences). 3) Scalability: Transformers scale much better with more data and compute. 4) No vanishing gradient: Direct connections between all positions. Result: Transformers train faster, perform better, and scale to billions of parameters.'
    },
    {
      question: 'What is transfer learning in deep learning?',
      answer: 'Transfer learning uses a model pre-trained on a large dataset as a starting point for a new task. Instead of training from scratch, you fine-tune the pre-trained weights on your smaller dataset. Examples: Use ResNet (trained on ImageNet) for medical image classification. Use BERT (trained on Wikipedia) for sentiment analysis. Benefits: requires less data, trains faster, achieves better performance. The foundation of modern AI — GPT, BERT, etc. are all used via transfer learning.'
    },
    {
      question: 'What is ResNet and what problem does it solve?',
      answer: 'ResNet (Residual Network, 2015) introduced skip connections (residual connections) that add the input of a layer directly to its output: output = F(x) + x. This solves the vanishing gradient problem in very deep networks by providing a gradient highway. ResNet-152 has 152 layers and won ImageNet 2015. The concept of residual connections is now used in virtually all modern deep learning architectures including Transformers.'
    }
  ]
};
