export const enhancedNeuralNetworks = {
  id: 'neural-networks',
  title: 'Neural Networks',
  subtitle: 'How Artificial Neural Networks Learn from Data',
  summary: 'Neural networks are computing systems inspired by the biological neural networks in the human brain. They consist of layers of interconnected nodes (neurons) that learn to recognize patterns by adjusting connection weights through a process called backpropagation.',
  analogy: 'A neural network is like a team of specialists working in layers. The first layer notices basic shapes, the next layer combines shapes into parts, and the final layer combines parts into a full decision. Each specialist adjusts their judgment based on how wrong the final answer was — this is backpropagation.',

  explanation: `WHAT IS A NEURAL NETWORK?

A neural network is a mathematical model inspired by the human brain. It consists of layers of artificial neurons (nodes) connected by weighted edges. By adjusting these weights during training, the network learns to map inputs to outputs.

THE BUILDING BLOCKS

1. NEURON (NODE)
A single computational unit that:
- Receives inputs (x₁, x₂, ..., xₙ)
- Multiplies each by a weight (w₁, w₂, ..., wₙ)
- Adds a bias term (b)
- Applies an activation function (f)
- Outputs: f(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)

2. LAYERS
- Input Layer: Receives raw features (one node per feature)
- Hidden Layers: Extract increasingly abstract representations
- Output Layer: Produces final prediction

3. WEIGHTS AND BIASES
- Weights: Strength of connection between neurons (learned during training)
- Bias: Allows the activation function to shift (like the intercept in linear regression)

4. ACTIVATION FUNCTIONS
Non-linear functions that allow networks to learn complex patterns:

ReLU (Rectified Linear Unit): f(x) = max(0, x)
- Most popular for hidden layers
- Fast to compute, avoids vanishing gradient
- Problem: "dying ReLU" (neurons stuck at 0)

Sigmoid: f(x) = 1 / (1 + e^(-x))
- Output range: (0, 1)
- Used in output layer for binary classification
- Problem: vanishing gradient for deep networks

Tanh: f(x) = (e^x - e^(-x)) / (e^x + e^(-x))
- Output range: (-1, 1)
- Zero-centered, better than sigmoid for hidden layers

Softmax: Converts logits to probabilities that sum to 1
- Used in output layer for multi-class classification

Leaky ReLU: f(x) = x if x > 0, else 0.01x
- Fixes dying ReLU problem

HOW NEURAL NETWORKS LEARN

STEP 1: FORWARD PASS
Input data flows through the network layer by layer.
Each layer transforms the data using weights, biases, and activation functions.
Final layer produces a prediction.

STEP 2: LOSS CALCULATION
Compare prediction to actual label using a loss function:
- Binary Cross-Entropy: for binary classification
- Categorical Cross-Entropy: for multi-class classification
- Mean Squared Error (MSE): for regression

STEP 3: BACKPROPAGATION
Calculate how much each weight contributed to the error.
Uses the chain rule of calculus to compute gradients.
Gradients flow backward from output to input layer.

STEP 4: GRADIENT DESCENT
Update weights in the direction that reduces the loss:
w = w - learning_rate × gradient

STEP 5: REPEAT
Repeat steps 1-4 for many iterations (epochs) until loss converges.

KEY HYPERPARAMETERS

Learning Rate: How big each weight update step is
- Too high: overshoots minimum, diverges
- Too low: very slow convergence
- Typical: 0.001 to 0.01

Batch Size: How many samples to process before updating weights
- Mini-batch (32-256): most common, balance of speed and stability
- Stochastic (1): noisy but can escape local minima
- Full batch: stable but slow for large datasets

Epochs: Number of complete passes through training data

Optimizers:
- SGD (Stochastic Gradient Descent): basic, requires careful tuning
- Adam: adaptive learning rates, most popular default choice
- RMSprop: good for RNNs

REGULARIZATION TECHNIQUES

Dropout: Randomly deactivate neurons during training (prevents co-adaptation)
L1/L2 Regularization: Add penalty for large weights to loss function
Batch Normalization: Normalize layer inputs, speeds up training
Early Stopping: Stop training when validation loss stops improving

UNIVERSAL APPROXIMATION THEOREM

A neural network with at least one hidden layer and enough neurons can approximate any continuous function to arbitrary precision. This is why neural networks are so powerful.`,

  keyPoints: [
    'Neurons compute: f(w₁x₁ + w₂x₂ + ... + b) where f is an activation function',
    'Three layer types: input, hidden (one or more), output',
    'ReLU is the most popular activation for hidden layers',
    'Softmax for multi-class output, Sigmoid for binary output',
    'Learning = Forward pass → Loss → Backpropagation → Gradient Descent',
    'Adam optimizer is the most popular default choice',
    'Dropout and L2 regularization prevent overfitting',
    'Batch Normalization speeds up training and stabilizes learning'
  ],

  codeExamples: [
    {
      title: 'Neural Network from Scratch',
      language: 'python',
      description: 'Build a simple neural network from scratch using only NumPy to understand the math.',
      code: `import numpy as np

# ============================================
# NEURAL NETWORK FROM SCRATCH (NumPy only)
# Binary Classification: XOR problem
# ============================================

class NeuralNetwork:
    def __init__(self, layer_sizes):
        """
        layer_sizes: list of neurons per layer
        e.g., [2, 4, 1] = 2 inputs, 4 hidden, 1 output
        """
        self.weights = []
        self.biases = []
        
        # Initialize weights with small random values (Xavier init)
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * 0.1
            b = np.zeros((1, layer_sizes[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    
    def sigmoid_derivative(self, z):
        s = self.sigmoid(z)
        return s * (1 - s)
    
    def relu(self, z):
        return np.maximum(0, z)
    
    def relu_derivative(self, z):
        return (z > 0).astype(float)
    
    def forward(self, X):
        """Forward pass: compute predictions."""
        self.activations = [X]
        self.z_values = []
        
        current = X
        for i, (w, b) in enumerate(zip(self.weights, self.biases)):
            z = current @ w + b
            self.z_values.append(z)
            
            # ReLU for hidden layers, Sigmoid for output
            if i < len(self.weights) - 1:
                current = self.relu(z)
            else:
                current = self.sigmoid(z)
            
            self.activations.append(current)
        
        return current
    
    def compute_loss(self, y_pred, y_true):
        """Binary cross-entropy loss."""
        eps = 1e-8  # Prevent log(0)
        return -np.mean(
            y_true * np.log(y_pred + eps) + 
            (1 - y_true) * np.log(1 - y_pred + eps)
        )
    
    def backward(self, y_true, learning_rate=0.01):
        """Backpropagation: compute gradients and update weights."""
        m = y_true.shape[0]
        
        # Output layer gradient
        delta = self.activations[-1] - y_true
        
        # Backpropagate through layers
        for i in reversed(range(len(self.weights))):
            # Gradient for weights and biases
            dW = self.activations[i].T @ delta / m
            db = np.mean(delta, axis=0, keepdims=True)
            
            # Gradient for previous layer
            if i > 0:
                delta = (delta @ self.weights[i].T) * self.relu_derivative(self.z_values[i-1])
            
            # Update weights (gradient descent)
            self.weights[i] -= learning_rate * dW
            self.biases[i] -= learning_rate * db
    
    def train(self, X, y, epochs=1000, learning_rate=0.1):
        """Train the network."""
        for epoch in range(epochs):
            y_pred = self.forward(X)
            loss = self.compute_loss(y_pred, y)
            self.backward(y, learning_rate)
            
            if epoch % 200 == 0:
                print(f"Epoch {epoch:4d} | Loss: {loss:.4f}")
    
    def predict(self, X, threshold=0.5):
        return (self.forward(X) >= threshold).astype(int)


# ============================================
# TRAIN ON XOR PROBLEM
# XOR: output is 1 only when inputs differ
# ============================================

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])  # XOR labels

# Create network: 2 inputs → 4 hidden → 1 output
nn = NeuralNetwork([2, 4, 1])

print("Training Neural Network on XOR problem...")
nn.train(X, y, epochs=1000, learning_rate=0.5)

print("\\nPredictions after training:")
predictions = nn.predict(X)
for inputs, pred, actual in zip(X, predictions, y):
    print(f"  Input: {inputs} → Predicted: {pred[0]}, Actual: {actual[0]}")`
    },
    {
      title: 'Neural Network with Keras/TensorFlow',
      language: 'python',
      description: 'Build and train a neural network using Keras for a real classification task.',
      code: `import numpy as np
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ============================================
# BUILD A NEURAL NETWORK WITH KERAS
# ============================================

# Generate synthetic dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=15,
    n_redundant=5, random_state=42
)

# Preprocess
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ============================================
# DEFINE THE MODEL ARCHITECTURE
# ============================================

model = keras.Sequential([
    # Input layer (implicit) + First hidden layer
    layers.Dense(64, activation='relu', input_shape=(20,)),
    layers.BatchNormalization(),   # Normalize activations
    layers.Dropout(0.3),           # Drop 30% of neurons randomly
    
    # Second hidden layer
    layers.Dense(32, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.2),
    
    # Output layer — sigmoid for binary classification
    layers.Dense(1, activation='sigmoid')
])

# ============================================
# COMPILE — Choose optimizer, loss, metrics
# ============================================

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()
# Shows: total parameters, trainable parameters per layer

# ============================================
# TRAIN WITH CALLBACKS
# ============================================

callbacks = [
    # Stop training if val_loss doesn't improve for 10 epochs
    keras.callbacks.EarlyStopping(
        monitor='val_loss', patience=10, restore_best_weights=True
    ),
    # Reduce learning rate when stuck
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss', factor=0.5, patience=5
    )
]

history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# EVALUATE
# ============================================

test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\\nTest Accuracy: {test_accuracy:.2%}")
print(f"Test Loss: {test_loss:.4f}")

# Predict probabilities
probabilities = model.predict(X_test[:5])
print("\\nSample predictions (probabilities):")
for i, prob in enumerate(probabilities):
    print(f"  Sample {i+1}: {prob[0]:.3f} → {'Positive' if prob[0] > 0.5 else 'Negative'}")`
    }
  ],

  resources: [
    {
      title: 'Neural Networks and Deep Learning - Michael Nielsen',
      url: 'http://neuralnetworksanddeeplearning.com/',
      description: 'Free online book — best resource for understanding neural networks from scratch'
    },
    {
      title: '3Blue1Brown Neural Networks (YouTube)',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
      description: 'Beautiful visual explanations of neural networks and backpropagation'
    },
    {
      title: 'TensorFlow / Keras Documentation',
      url: 'https://www.tensorflow.org/tutorials',
      description: 'Official TensorFlow tutorials for building neural networks'
    },
    {
      title: 'Deep Learning Specialization - Andrew Ng (Coursera)',
      url: 'https://www.coursera.org/specializations/deep-learning',
      description: 'The definitive deep learning course covering all neural network concepts'
    }
  ],

  questions: [
    {
      question: 'What is a neural network and how does it work?',
      answer: 'A neural network is a mathematical model inspired by the brain, consisting of layers of interconnected neurons. Each neuron computes: output = activation(weights × inputs + bias). Data flows forward through layers (forward pass), a loss is computed, gradients are calculated via backpropagation, and weights are updated via gradient descent. This process repeats until the network learns to map inputs to correct outputs.'
    },
    {
      question: 'What are activation functions and why are they needed?',
      answer: 'Activation functions introduce non-linearity into neural networks. Without them, stacking layers would just be matrix multiplication — equivalent to a single linear layer. Common ones: ReLU (max(0,x)) — most popular for hidden layers, fast and avoids vanishing gradient. Sigmoid — for binary output (0 to 1). Softmax — for multi-class output (probabilities sum to 1). Tanh — zero-centered, better than sigmoid for hidden layers.'
    },
    {
      question: 'What is backpropagation?',
      answer: 'Backpropagation is the algorithm for computing gradients in a neural network. After a forward pass produces a prediction and a loss is computed, backpropagation uses the chain rule of calculus to compute how much each weight contributed to the error. Gradients flow backward from output to input. These gradients are then used by gradient descent to update weights: w = w - learning_rate × gradient.'
    },
    {
      question: 'What is gradient descent and what are its variants?',
      answer: 'Gradient descent updates weights in the direction that reduces loss: w = w - lr × gradient. Variants: 1) Batch GD — uses all data, stable but slow. 2) Stochastic GD (SGD) — one sample at a time, noisy but fast. 3) Mini-batch GD — small batches (32-256), best of both. Optimizers: Adam (adaptive learning rates, most popular), RMSprop (good for RNNs), AdaGrad. Adam is the default choice for most problems.'
    },
    {
      question: 'What is the vanishing gradient problem?',
      answer: 'In deep networks, gradients can become extremely small as they propagate backward through many layers, making early layers learn very slowly or not at all. Caused by sigmoid/tanh activations squashing gradients. Solutions: 1) Use ReLU instead of sigmoid/tanh, 2) Batch Normalization, 3) Residual connections (skip connections in ResNet), 4) Careful weight initialization (Xavier, He), 5) Gradient clipping.'
    },
    {
      question: 'What is dropout and how does it prevent overfitting?',
      answer: 'Dropout randomly deactivates a fraction of neurons during each training step (e.g., 20-50%). This prevents neurons from co-adapting — each neuron must learn useful features independently. At inference time, all neurons are active but their outputs are scaled. Effect: acts like training an ensemble of many different networks. Typical dropout rates: 0.2-0.5 for hidden layers, 0.1-0.2 for input layers.'
    },
    {
      question: 'What is batch normalization and why is it used?',
      answer: 'Batch Normalization normalizes the inputs to each layer to have zero mean and unit variance, then applies learnable scale and shift parameters. Benefits: 1) Allows higher learning rates, 2) Reduces sensitivity to weight initialization, 3) Acts as regularization (reduces need for dropout), 4) Speeds up training significantly. Applied before or after activation function, typically before. Essential in deep networks.'
    },
    {
      question: 'What is the Universal Approximation Theorem?',
      answer: 'The Universal Approximation Theorem states that a neural network with at least one hidden layer containing enough neurons can approximate any continuous function to arbitrary precision. This theoretically justifies why neural networks are so powerful. However, it says nothing about how many neurons are needed, how to train the network, or whether training will converge — those are practical challenges.'
    }
  ]
};
