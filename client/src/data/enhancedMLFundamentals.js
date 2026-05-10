export const enhancedMLFundamentals = {
  id: 'ml-fundamentals',
  title: 'Machine Learning Fundamentals',
  subtitle: 'Supervised, Unsupervised, and Reinforcement Learning',
  summary: 'Machine Learning is a subset of AI where systems learn patterns from data to make predictions or decisions without being explicitly programmed. The three core paradigms are supervised learning, unsupervised learning, and reinforcement learning.',
  analogy: 'Supervised learning is like studying with an answer key — you see questions and correct answers, and learn to map one to the other. Unsupervised learning is like sorting a pile of mixed coins without being told the categories — you find patterns yourself. Reinforcement learning is like training a dog with treats — good actions get rewarded, bad ones get penalized.',

  explanation: `WHAT IS MACHINE LEARNING?

Machine Learning (ML) is the science of getting computers to learn from data and improve their performance on a task over time without being explicitly programmed for every scenario.

Traditional Programming: Input + Rules → Output
Machine Learning: Input + Output → Rules (learned automatically)

THE THREE MAIN TYPES OF ML

═══════════════════════════════════════════════════════════════

1. SUPERVISED LEARNING

DEFINITION:
The model is trained on labeled data — each input has a corresponding correct output (label). The model learns to map inputs to outputs.

KEY CHARACTERISTICS:
- Requires labeled training data
- Has a clear "right answer" during training
- Goal: predict output for new unseen inputs

TWO SUBTYPES:
a) Classification — Output is a category/class
   Examples: Spam detection, disease diagnosis, image classification
   Algorithms: Logistic Regression, Decision Trees, SVM, Neural Networks

b) Regression — Output is a continuous number
   Examples: House price prediction, stock price, temperature forecast
   Algorithms: Linear Regression, Ridge, Lasso, Random Forest

COMMON SUPERVISED ALGORITHMS:
- Linear Regression (regression)
- Logistic Regression (classification)
- Decision Trees
- Random Forest
- Support Vector Machine (SVM)
- K-Nearest Neighbors (KNN)
- Neural Networks

═══════════════════════════════════════════════════════════════

2. UNSUPERVISED LEARNING

DEFINITION:
The model is trained on unlabeled data. It finds hidden patterns, structures, or groupings on its own without any guidance.

KEY CHARACTERISTICS:
- No labels required
- Model discovers structure in data
- Goal: find patterns, clusters, or compressed representations

THREE SUBTYPES:
a) Clustering — Group similar data points together
   Examples: Customer segmentation, document grouping, anomaly detection
   Algorithms: K-Means, DBSCAN, Hierarchical Clustering

b) Dimensionality Reduction — Compress data while preserving structure
   Examples: Visualization, noise reduction, feature extraction
   Algorithms: PCA, t-SNE, Autoencoders

c) Association Rule Learning — Find relationships between variables
   Examples: Market basket analysis ("people who buy X also buy Y")
   Algorithms: Apriori, FP-Growth

═══════════════════════════════════════════════════════════════

3. REINFORCEMENT LEARNING (RL)

DEFINITION:
An agent learns to make decisions by interacting with an environment. It receives rewards for good actions and penalties for bad ones, learning a policy to maximize cumulative reward.

KEY COMPONENTS:
- Agent: The learner/decision maker
- Environment: What the agent interacts with
- State: Current situation of the agent
- Action: What the agent can do
- Reward: Feedback signal (positive or negative)
- Policy: Strategy the agent follows

EXAMPLES:
- Game playing: AlphaGo, OpenAI Five (Dota 2)
- Robotics: Teaching robots to walk
- Autonomous driving: Navigation decisions
- Recommendation systems: Optimizing user engagement

ALGORITHMS:
- Q-Learning
- Deep Q-Network (DQN)
- Policy Gradient Methods
- Proximal Policy Optimization (PPO)

═══════════════════════════════════════════════════════════════

4. SEMI-SUPERVISED LEARNING

Uses a small amount of labeled data + large amount of unlabeled data.
Useful when labeling is expensive (e.g., medical images).

5. SELF-SUPERVISED LEARNING

Model generates its own labels from the data structure.
Used in LLMs: predict the next word in a sentence.
GPT is trained with self-supervised learning.

THE ML WORKFLOW

1. Define the problem (classification? regression? clustering?)
2. Collect and explore data (EDA)
3. Preprocess data (handle missing values, encode categories, scale features)
4. Split data (train / validation / test sets)
5. Choose and train a model
6. Evaluate performance (accuracy, F1, RMSE, etc.)
7. Tune hyperparameters
8. Deploy and monitor

BIAS-VARIANCE TRADEOFF

Bias: Error from wrong assumptions — model is too simple (underfitting)
Variance: Error from sensitivity to training data — model is too complex (overfitting)
Goal: Find the sweet spot with low bias AND low variance

Underfitting: High bias, low variance — model too simple
Overfitting: Low bias, high variance — model memorizes training data
Good fit: Balanced bias and variance — generalizes well`,

  keyPoints: [
    'ML learns patterns from data instead of following explicit rules',
    'Supervised learning uses labeled data for classification and regression',
    'Unsupervised learning finds hidden patterns in unlabeled data',
    'Reinforcement learning learns through rewards and penalties from environment interaction',
    'Semi-supervised learning combines small labeled + large unlabeled data',
    'Self-supervised learning (used in GPT) generates its own training labels',
    'Bias-variance tradeoff: underfitting vs overfitting',
    'ML workflow: Data → Preprocess → Train → Evaluate → Deploy → Monitor'
  ],

  codeExamples: [
    {
      title: 'Supervised Learning — Classification & Regression',
      language: 'python',
      description: 'Hands-on examples of supervised learning for both classification and regression tasks.',
      code: `from sklearn.datasets import load_iris, load_boston
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import accuracy_score, mean_squared_error
import numpy as np

# ============================================
# CLASSIFICATION EXAMPLE — Iris Flower Species
# ============================================

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target  # Features and labels

# Split into train and test sets (80/20 split)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features (important for many algorithms)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train a Logistic Regression classifier
clf = LogisticRegression(max_iter=200)
clf.fit(X_train_scaled, y_train)

# Evaluate
y_pred = clf.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"Classification Accuracy: {accuracy:.2%}")
# Output: Classification Accuracy: ~97%

# Predict a new flower
new_flower = [[5.1, 3.5, 1.4, 0.2]]
new_flower_scaled = scaler.transform(new_flower)
prediction = clf.predict(new_flower_scaled)
print(f"Predicted species: {iris.target_names[prediction[0]]}")
# Output: Predicted species: setosa


# ============================================
# REGRESSION EXAMPLE — House Price Prediction
# ============================================

# Synthetic house data
np.random.seed(42)
n_samples = 100

# Features: size (sqft), bedrooms, age
house_size = np.random.randint(500, 3000, n_samples)
bedrooms = np.random.randint(1, 6, n_samples)
age = np.random.randint(0, 50, n_samples)

X_houses = np.column_stack([house_size, bedrooms, age])

# Price = 100*size + 5000*bedrooms - 200*age + noise
price = (100 * house_size + 5000 * bedrooms - 200 * age
         + np.random.normal(0, 10000, n_samples))

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_houses, price, test_size=0.2, random_state=42
)

# Train Linear Regression
reg = LinearRegression()
reg.fit(X_train, y_train)

# Evaluate
y_pred = reg.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"\\nRegression RMSE: $" + "{rmse:,.0f}".format(rmse=rmse))

# Predict price for a new house
new_house = [[1500, 3, 10]]  # 1500 sqft, 3 beds, 10 years old
predicted_price = reg.predict(new_house)
print(f"Predicted house price: $" + "{:,.0f}".format(predicted_price[0]))`
    },
    {
      title: 'Unsupervised Learning — K-Means Clustering',
      language: 'python',
      description: 'Customer segmentation using K-Means clustering — a classic unsupervised learning use case.',
      code: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

# ============================================
# UNSUPERVISED LEARNING — Customer Segmentation
# ============================================

# Synthetic customer data: [annual_income, spending_score]
np.random.seed(42)

# Generate 3 natural customer groups
group1 = np.random.normal([30000, 20], [5000, 5], (40, 2))   # Low income, low spend
group2 = np.random.normal([70000, 60], [8000, 10], (40, 2))  # Mid income, mid spend
group3 = np.random.normal([120000, 85], [10000, 8], (40, 2)) # High income, high spend

customers = np.vstack([group1, group2, group3])

# Scale features
scaler = StandardScaler()
customers_scaled = scaler.fit_transform(customers)

# Apply K-Means with k=3 clusters
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(customers_scaled)

labels = kmeans.labels_
centers = scaler.inverse_transform(kmeans.cluster_centers_)

# Analyze each cluster
print("Customer Segments Found:")
print("=" * 50)

segment_names = {0: "Budget Shoppers", 1: "Mid-Tier Customers", 2: "Premium Customers"}

for cluster_id in range(3):
    mask = labels == cluster_id
    cluster_data = customers[mask]
    avg_income = cluster_data[:, 0].mean()
    avg_spend = cluster_data[:, 1].mean()
    count = mask.sum()
    
    print(f"\\nCluster {cluster_id}: {count} customers")
    print(f"  Avg Income:        $" + "{:,.0f}".format(avg_income))
    print(f"  Avg Spending Score: {avg_spend:.1f}/100")

# Predict segment for a new customer
new_customer = [[85000, 72]]  # income=85k, spending=72
new_scaled = scaler.transform(new_customer)
segment = kmeans.predict(new_scaled)[0]
print(f"\\nNew customer segment: Cluster {segment}")

# Output:
# Cluster 0: 40 customers — Low income, low spend
# Cluster 1: 40 customers — Mid income, mid spend
# Cluster 2: 40 customers — High income, high spend`
    },
    {
      title: 'Reinforcement Learning — Q-Learning Concept',
      language: 'python',
      description: 'Simple Q-Learning implementation showing how an agent learns to navigate a grid.',
      code: `import numpy as np

# ============================================
# REINFORCEMENT LEARNING — Q-Learning
# Simple Grid World: Agent learns to reach goal
# ============================================

# Grid: 4x4, Agent starts at (0,0), Goal at (3,3)
# Actions: 0=Up, 1=Down, 2=Left, 3=Right
# Reward: +100 at goal, -1 per step, -10 for wall

GRID_SIZE = 4
ACTIONS = 4  # up, down, left, right
GOAL = (3, 3)

# Q-table: state x action values (all start at 0)
Q = np.zeros((GRID_SIZE, GRID_SIZE, ACTIONS))

# Hyperparameters
alpha = 0.1    # Learning rate
gamma = 0.9    # Discount factor (value of future rewards)
epsilon = 0.3  # Exploration rate (random action probability)

def get_next_state(row, col, action):
    """Returns next state given current state and action."""
    moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]  # up, down, left, right
    dr, dc = moves[action]
    new_row = max(0, min(GRID_SIZE - 1, row + dr))
    new_col = max(0, min(GRID_SIZE - 1, col + dc))
    return new_row, new_col

def get_reward(row, col):
    """Returns reward for reaching a state."""
    if (row, col) == GOAL:
        return 100   # Big reward for reaching goal
    return -1        # Small penalty per step

# Training loop
for episode in range(1000):
    row, col = 0, 0  # Start at top-left

    for step in range(50):  # Max 50 steps per episode
        # Epsilon-greedy action selection
        if np.random.random() < epsilon:
            action = np.random.randint(ACTIONS)  # Explore
        else:
            action = np.argmax(Q[row, col])       # Exploit best known action

        # Take action, observe next state and reward
        next_row, next_col = get_next_state(row, col, action)
        reward = get_reward(next_row, next_col)

        # Q-Learning update rule
        # Q(s,a) = Q(s,a) + alpha * [reward + gamma * max(Q(s',a')) - Q(s,a)]
        best_next = np.max(Q[next_row, next_col])
        Q[row, col, action] += alpha * (reward + gamma * best_next - Q[row, col, action])

        row, col = next_row, next_col

        if (row, col) == GOAL:
            break  # Episode done

# Test the learned policy
print("Learned Policy (Best Action per Cell):")
action_symbols = ['↑', '↓', '←', '→']
for r in range(GRID_SIZE):
    row_str = ""
    for c in range(GRID_SIZE):
        if (r, c) == GOAL:
            row_str += " G "
        else:
            best_action = np.argmax(Q[r, c])
            row_str += f" {action_symbols[best_action]} "
    print(row_str)

# The agent learned to navigate toward G (goal) from any position`
    }
  ],

  resources: [
    {
      title: 'Machine Learning Course - Andrew Ng (Coursera)',
      url: 'https://www.coursera.org/learn/machine-learning',
      description: 'The most popular ML course — covers all fundamentals'
    },
    {
      title: 'Scikit-learn Documentation',
      url: 'https://scikit-learn.org/stable/',
      description: 'Official docs for the most widely used ML library in Python'
    },
    {
      title: 'Machine Learning - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/machine-learning/',
      description: 'ML concepts with examples and interview questions'
    },
    {
      title: 'StatQuest with Josh Starmer (YouTube)',
      url: 'https://www.youtube.com/c/joshstarmer',
      description: 'Best visual explanations of ML algorithms on YouTube'
    }
  ],

  questions: [
    {
      question: 'What is the difference between supervised, unsupervised, and reinforcement learning?',
      answer: 'Supervised: Learns from labeled data (input-output pairs) — used for classification and regression. Unsupervised: Finds patterns in unlabeled data — used for clustering and dimensionality reduction. Reinforcement: Agent learns by interacting with environment and receiving rewards/penalties — used for game playing and robotics. Key difference: supervised needs labels, unsupervised does not, RL learns from feedback.'
    },
    {
      question: 'What is the difference between classification and regression?',
      answer: 'Classification predicts a discrete category/class (spam or not spam, cat or dog). Regression predicts a continuous numerical value (house price, temperature). Both are supervised learning. Algorithms like Decision Trees and Neural Networks can do both. Evaluation metrics differ: accuracy/F1 for classification, RMSE/MAE for regression.'
    },
    {
      question: 'What is overfitting and underfitting? How do you fix them?',
      answer: 'Overfitting: Model memorizes training data, performs poorly on new data (high variance). Fix: more data, regularization (L1/L2), dropout, cross-validation, simpler model. Underfitting: Model is too simple, performs poorly on both train and test data (high bias). Fix: more complex model, more features, more training, reduce regularization. Goal: balance bias and variance.'
    },
    {
      question: 'What is the bias-variance tradeoff?',
      answer: 'Bias is error from wrong assumptions — a high-bias model underfits (too simple). Variance is error from sensitivity to training data — a high-variance model overfits (too complex). They trade off: reducing bias increases variance and vice versa. The goal is to find the sweet spot with low total error = bias² + variance + irreducible noise.'
    },
    {
      question: 'What is the train/validation/test split and why is it important?',
      answer: 'Training set: Used to train the model. Validation set: Used to tune hyperparameters and select the best model (prevents overfitting to test set). Test set: Used only once at the end to evaluate final model performance — simulates real-world unseen data. Typical splits: 70/15/15 or 80/10/10. Never use test data during training or tuning.'
    },
    {
      question: 'What is K-Means clustering? How does it work?',
      answer: 'K-Means is an unsupervised clustering algorithm. Steps: 1) Choose k (number of clusters), 2) Randomly initialize k centroids, 3) Assign each point to nearest centroid, 4) Recalculate centroids as mean of assigned points, 5) Repeat steps 3-4 until convergence. Limitation: must specify k in advance, sensitive to outliers, assumes spherical clusters. Use elbow method to choose k.'
    },
    {
      question: 'What is reinforcement learning? What are its key components?',
      answer: 'RL is learning through interaction with an environment. Key components: Agent (learner), Environment (what agent interacts with), State (current situation), Action (what agent can do), Reward (feedback signal), Policy (strategy mapping states to actions). Goal: maximize cumulative reward. Used in game AI (AlphaGo), robotics, autonomous driving. Q-Learning and PPO are common algorithms.'
    },
    {
      question: 'What is the difference between parameters and hyperparameters?',
      answer: 'Parameters are learned from data during training (e.g., weights in a neural network, coefficients in linear regression). Hyperparameters are set before training and control the learning process (e.g., learning rate, number of layers, k in K-Means, regularization strength). Parameters are optimized automatically; hyperparameters are tuned manually or via grid search/random search/Bayesian optimization.'
    }
  ]
};
