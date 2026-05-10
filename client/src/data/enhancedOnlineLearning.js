export const enhancedOnlineLearning = {
  id: 'online-learning',
  title: 'Online Learning & Real-Time ML',
  subtitle: 'Streaming ML, Bandit Algorithms, Concept Drift, and Continual Learning',
  summary: 'Online learning updates ML models incrementally as new data arrives, without retraining from scratch. It powers real-time personalization, fraud detection, ad bidding, and recommendation systems that must adapt to changing user behavior and concept drift.',
  analogy: 'Batch learning is like studying for an exam by reading a textbook once. Online learning is like a doctor who updates their knowledge with every new patient they see — they never stop learning. Bandit algorithms are like a slot machine player who tries different machines and gradually shifts to the one that pays out most, balancing exploration (trying new machines) with exploitation (playing the best known machine).',

  explanation: `WHAT IS ONLINE LEARNING?

Online learning (incremental learning) updates a model with each new data point or small batch, rather than retraining from scratch on the full dataset. The model continuously adapts as new data arrives.

BATCH LEARNING vs ONLINE LEARNING:

Batch Learning:
- Train on full dataset → deploy → collect new data → retrain → redeploy
- Cycle: days to weeks
- Pros: stable, well-understood, easy to evaluate
- Cons: stale model between retraining cycles, expensive retraining

Online Learning:
- Model updates continuously as new data arrives
- Cycle: milliseconds to seconds
- Pros: adapts to changing patterns immediately, no retraining cost
- Cons: harder to debug, can degrade if bad data arrives, catastrophic forgetting

WHEN TO USE ONLINE LEARNING:
- Data distribution changes rapidly (user preferences, market conditions)
- Real-time personalization (each user interaction updates the model)
- Fraud detection (new fraud patterns emerge constantly)
- Ad bidding (click rates change by the minute)
- Financial markets (prices change continuously)

═══════════════════════════════════════════════════════════════

ONLINE LEARNING ALGORITHMS

STOCHASTIC GRADIENT DESCENT (SGD):
The foundation of online learning for neural networks.
- Process one sample (or small mini-batch) at a time
- Update weights immediately: w = w - lr × gradient
- Learning rate schedule: decrease over time to stabilize

ONLINE GRADIENT DESCENT:
For convex problems, provably converges to optimal solution.
Regret bound: O(√T) — performance approaches optimal as T → ∞.

PASSIVE-AGGRESSIVE ALGORITHMS:
- Passive: if prediction is correct, don't update
- Aggressive: if prediction is wrong, update aggressively to correct it
- Good for classification and regression with concept drift

FOLLOW THE REGULARIZED LEADER (FTRL):
- Used by Google for ad click prediction
- Handles sparse features efficiently
- Produces sparse models (many zero weights)
- Better than SGD for sparse high-dimensional data

RIVER (Python library):
- Dedicated library for online machine learning
- Implements: Hoeffding Trees, online Naive Bayes, online linear models
- Handles concept drift detection and adaptation

═══════════════════════════════════════════════════════════════

CONCEPT DRIFT

WHAT IS CONCEPT DRIFT?
The statistical relationship between input features and the target variable changes over time.

TYPES:

Sudden Drift:
- Abrupt change in data distribution
- Example: COVID-19 suddenly changed shopping patterns overnight
- Detection: statistical tests on recent vs historical data

Gradual Drift:
- Slow, continuous change over time
- Example: user preferences slowly evolve over months
- Detection: monitoring rolling window statistics

Recurring Drift:
- Patterns that repeat cyclically
- Example: seasonal shopping patterns (Black Friday, Christmas)
- Handling: time-aware models, seasonal features

Incremental Drift:
- Gradual shift in the boundary between classes
- Example: spam patterns slowly evolve as spammers adapt

DETECTION METHODS:

ADWIN (Adaptive Windowing):
- Maintains a sliding window of recent data
- Detects when the mean of the window changes significantly
- Automatically adjusts window size
- Most popular drift detector

Page-Hinkley Test:
- Detects changes in the mean of a sequence
- Cumulative sum of deviations from running mean
- Triggers alert when sum exceeds threshold

DDM (Drift Detection Method):
- Monitors error rate of the model
- Detects when error rate increases significantly
- Simple and effective for classification

KSWIN (Kolmogorov-Smirnov Windowing):
- Uses KS test to compare recent vs historical distributions
- Works for any distribution, not just mean changes

HANDLING CONCEPT DRIFT:

Retraining: retrain model on recent data when drift detected
Ensemble: maintain multiple models trained on different time windows
Adaptive learning rate: increase learning rate when drift detected
Forgetting: weight recent examples more heavily (exponential forgetting)

═══════════════════════════════════════════════════════════════

MULTI-ARMED BANDIT ALGORITHMS

PROBLEM: Exploration vs Exploitation
- Exploitation: use the best known option to maximize immediate reward
- Exploration: try new options to discover potentially better ones
- Pure exploitation: miss better options
- Pure exploration: waste resources on bad options

APPLICATIONS:
- A/B testing: which version of a feature performs better?
- Ad selection: which ad to show to maximize clicks?
- Recommendation: which item to recommend?
- Hyperparameter tuning: which hyperparameters to try next?
- Clinical trials: which treatment to give patients?

ALGORITHMS:

EPSILON-GREEDY:
- With probability ε: explore (random action)
- With probability 1-ε: exploit (best known action)
- Simple, widely used
- Problem: explores randomly, not intelligently

UCB (Upper Confidence Bound):
- Select action with highest: Q(a) + c × √(ln(t) / N(a))
- Q(a): estimated reward for action a
- N(a): number of times action a was tried
- t: total number of trials
- Principle: optimism in the face of uncertainty
- Explores actions that haven't been tried much

THOMPSON SAMPLING:
- Maintain a probability distribution over each action's reward
- Sample from each distribution, pick action with highest sample
- Update distribution based on observed reward (Bayesian update)
- Best empirical performance in most settings
- Used by Google, Microsoft for ad selection

CONTEXTUAL BANDITS:
- Bandit with context (features about the user/situation)
- Select action based on both context and past rewards
- LinUCB: linear model for reward given context
- Neural Bandits: neural network for reward prediction
- Used for: personalized recommendations, personalized ads

═══════════════════════════════════════════════════════════════

CONTINUAL LEARNING

WHAT IS CONTINUAL LEARNING?
Train a model on a sequence of tasks without forgetting previous tasks.

CATASTROPHIC FORGETTING:
When a neural network is trained on a new task, it forgets how to do previous tasks.
The new task's gradients overwrite the weights learned for previous tasks.

APPROACHES:

Regularization-Based:
- EWC (Elastic Weight Consolidation): add penalty for changing important weights
- Important weights (for previous tasks) are penalized from changing
- Importance measured by Fisher information matrix

Replay-Based:
- Store a small buffer of examples from previous tasks
- Replay them during training on new tasks
- Experience Replay: random sample from buffer
- Prioritized Replay: sample important examples more often

Architecture-Based:
- Progressive Neural Networks: add new columns for new tasks, freeze old ones
- PackNet: prune network after each task, use freed capacity for next task

ONLINE CONTINUAL LEARNING:
- Learn from a stream of data without storing all past data
- Must handle concept drift AND catastrophic forgetting simultaneously
- Most challenging setting — active research area

═══════════════════════════════════════════════════════════════

REAL-TIME ML SYSTEMS

STREAMING ML PIPELINE:
Data stream (Kafka) → Feature extraction → Online model → Prediction → Feedback loop

FEATURE ENGINEERING FOR STREAMING:
- Windowed aggregations: count, sum, mean over last N minutes/hours
- Sliding windows: update incrementally as new events arrive
- Approximate algorithms: HyperLogLog (cardinality), Count-Min Sketch (frequency)

LAMBDA ARCHITECTURE FOR ML:
- Batch layer: accurate historical features (Spark, daily)
- Speed layer: real-time approximate features (Flink, seconds)
- Serving layer: merge batch + real-time features for prediction

TOOLS:
- Apache Flink: stateful stream processing, exactly-once semantics
- Apache Kafka Streams: stream processing on Kafka
- Apache Spark Streaming: micro-batch streaming
- River: Python online ML library
- Vowpal Wabbit: fast online learning library (used at Microsoft)`,

  keyPoints: [
    'Online learning: update model incrementally with each new data point — no full retraining',
    'SGD is the foundation of online learning — process one sample, update immediately',
    'Concept drift: statistical relationship between features and target changes over time',
    'ADWIN: adaptive windowing drift detector — most popular, automatically adjusts window size',
    'Bandit algorithms: balance exploration (try new options) vs exploitation (use best known)',
    'Thompson Sampling: Bayesian bandit — best empirical performance, used by Google/Microsoft',
    'Contextual bandits: select action based on user/situation context — powers personalized ads',
    'Catastrophic forgetting: neural networks forget old tasks when trained on new ones — use EWC or replay'
  ],

  codeExamples: [
    {
      title: 'Online Learning with Concept Drift Detection',
      language: 'python',
      description: 'Implement online learning with ADWIN drift detection using the River library.',
      code: `# pip install river scikit-learn numpy
import numpy as np
from collections import deque

# ============================================
# ADWIN DRIFT DETECTOR (from scratch)
# ============================================

class ADWIN:
    """
    Adaptive Windowing drift detector.
    Detects when the mean of a data stream changes significantly.
    """
    def __init__(self, delta: float = 0.002):
        self.delta = delta  # Confidence parameter
        self.window = deque()
        self.total = 0.0
        self.variance = 0.0
        self.drift_detected = False

    def add_element(self, value: float) -> bool:
        """Add new element. Returns True if drift detected."""
        self.window.append(value)
        self.total += value
        self.drift_detected = False

        # Check for drift by comparing sub-windows
        n = len(self.window)
        if n < 2:
            return False

        window_list = list(self.window)
        mean_total = self.total / n

        # Try all possible split points
        for split in range(1, n):
            n0 = split
            n1 = n - split
            mean0 = sum(window_list[:split]) / n0
            mean1 = sum(window_list[split:]) / n1

            # Hoeffding bound for drift detection
            m = 1.0 / (1.0/n0 + 1.0/n1)
            epsilon_cut = np.sqrt((1.0 / (2*m)) * np.log(4 * n / self.delta))

            if abs(mean0 - mean1) >= epsilon_cut:
                # Drift detected — remove old part of window
                self.window = deque(window_list[split:])
                self.total = sum(self.window)
                self.drift_detected = True
                return True

        return False

    def reset(self):
        self.window.clear()
        self.total = 0.0
        self.drift_detected = False


# ============================================
# ONLINE LOGISTIC REGRESSION
# ============================================

class OnlineLogisticRegression:
    """Simple online logistic regression with SGD."""

    def __init__(self, n_features: int, lr: float = 0.01, reg: float = 0.001):
        self.weights = np.zeros(n_features)
        self.bias = 0.0
        self.lr = lr
        self.reg = reg
        self.n_updates = 0

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def predict_proba(self, x: np.ndarray) -> float:
        return self.sigmoid(np.dot(self.weights, x) + self.bias)

    def predict(self, x: np.ndarray) -> int:
        return 1 if self.predict_proba(x) >= 0.5 else 0

    def update(self, x: np.ndarray, y: int):
        """Update model with a single example."""
        p = self.predict_proba(x)
        error = y - p

        # SGD update with L2 regularization
        self.weights += self.lr * (error * x - self.reg * self.weights)
        self.bias += self.lr * error
        self.n_updates += 1

    def reset_weights(self):
        """Reset weights when drift is detected."""
        self.weights = np.zeros(len(self.weights))
        self.bias = 0.0
        print(f"  Model reset after {self.n_updates} updates")
        self.n_updates = 0


# ============================================
# SIMULATE CONCEPT DRIFT SCENARIO
# ============================================

np.random.seed(42)
n_features = 5

# Phase 1: Normal data (1000 samples)
# Class 1 if feature[0] > 0
X_phase1 = np.random.randn(1000, n_features)
y_phase1 = (X_phase1[:, 0] > 0).astype(int)

# Phase 2: DRIFT — now class 1 if feature[1] > 0 (concept changed!)
X_phase2 = np.random.randn(1000, n_features)
y_phase2 = (X_phase2[:, 1] > 0).astype(int)

# Combine
X_stream = np.vstack([X_phase1, X_phase2])
y_stream = np.concatenate([y_phase1, y_phase2])

# ============================================
# ONLINE LEARNING WITH DRIFT DETECTION
# ============================================

model = OnlineLogisticRegression(n_features=n_features, lr=0.05)
drift_detector = ADWIN(delta=0.002)

window_size = 100
recent_errors = deque(maxlen=window_size)
drift_points = []
accuracy_history = []

print("ONLINE LEARNING WITH DRIFT DETECTION:")
print(f"{'Step':>6} {'Accuracy':>10} {'Drift':>8}")
print("-" * 30)

for i, (x, y) in enumerate(zip(X_stream, y_stream)):
    # Predict before updating
    pred = model.predict(x)
    error = int(pred != y)
    recent_errors.append(1 - error)  # 1 = correct

    # Drift detection
    drift_detected = drift_detector.add_element(float(error))

    if drift_detected:
        drift_points.append(i)
        print(f"{i:>6} {'DRIFT DETECTED':>10} {'⚠️':>8}")
        # Reset model to adapt to new concept
        model.reset_weights()
        drift_detector.reset()

    # Update model with true label
    model.update(x, y)

    # Log accuracy every 100 steps
    if (i + 1) % 100 == 0:
        acc = np.mean(list(recent_errors))
        accuracy_history.append(acc)
        print(f"{i+1:>6} {acc:>10.3f} {'':>8}")

print(f"\nDrift detected at steps: {drift_points}")
print(f"Expected drift at step: 1000 (concept change)")
print(f"Final accuracy: {accuracy_history[-1]:.3f}")`
    },
    {
      title: 'Multi-Armed Bandit Algorithms',
      language: 'python',
      description: 'Implement and compare epsilon-greedy, UCB, and Thompson Sampling.',
      code: `import numpy as np
from scipy import stats

# ============================================
# MULTI-ARMED BANDIT ENVIRONMENT
# ============================================

class BanditEnvironment:
    """Simulates a multi-armed bandit (e.g., A/B/C test)."""

    def __init__(self, true_probs: list):
        """true_probs: true click-through rates for each arm."""
        self.true_probs = true_probs
        self.n_arms = len(true_probs)
        self.best_arm = np.argmax(true_probs)

    def pull(self, arm: int) -> int:
        """Pull an arm. Returns 1 (reward) or 0 (no reward)."""
        return 1 if np.random.random() < self.true_probs[arm] else 0

    def regret(self, arm: int) -> float:
        """Regret = best possible reward - actual reward."""
        return self.true_probs[self.best_arm] - self.true_probs[arm]


# ============================================
# BANDIT ALGORITHMS
# ============================================

class EpsilonGreedy:
    def __init__(self, n_arms: int, epsilon: float = 0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.counts = np.zeros(n_arms)
        self.values = np.zeros(n_arms)

    def select_arm(self) -> int:
        if np.random.random() < self.epsilon:
            return np.random.randint(self.n_arms)  # Explore
        return np.argmax(self.values)               # Exploit

    def update(self, arm: int, reward: float):
        self.counts[arm] += 1
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n  # Running mean


class UCB:
    """Upper Confidence Bound — optimism in the face of uncertainty."""

    def __init__(self, n_arms: int, c: float = 2.0):
        self.n_arms = n_arms
        self.c = c
        self.counts = np.zeros(n_arms)
        self.values = np.zeros(n_arms)
        self.t = 0

    def select_arm(self) -> int:
        self.t += 1
        # Pull each arm at least once
        for arm in range(self.n_arms):
            if self.counts[arm] == 0:
                return arm

        # UCB: estimated value + exploration bonus
        ucb_values = self.values + self.c * np.sqrt(
            np.log(self.t) / self.counts
        )
        return np.argmax(ucb_values)

    def update(self, arm: int, reward: float):
        self.counts[arm] += 1
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n


class ThompsonSampling:
    """
    Thompson Sampling — Bayesian bandit.
    Maintains Beta distribution for each arm's success probability.
    Beta(alpha, beta): alpha = successes + 1, beta = failures + 1
    """

    def __init__(self, n_arms: int):
        self.n_arms = n_arms
        self.alpha = np.ones(n_arms)  # Successes + 1
        self.beta = np.ones(n_arms)   # Failures + 1

    def select_arm(self) -> int:
        # Sample from each arm's Beta distribution
        samples = np.random.beta(self.alpha, self.beta)
        return np.argmax(samples)

    def update(self, arm: int, reward: float):
        if reward == 1:
            self.alpha[arm] += 1
        else:
            self.beta[arm] += 1

    def get_posterior_means(self) -> np.ndarray:
        """Expected value of each arm's Beta distribution."""
        return self.alpha / (self.alpha + self.beta)


# ============================================
# SIMULATION AND COMPARISON
# ============================================

def simulate_bandit(algorithm, env: BanditEnvironment, n_steps: int = 1000):
    """Run a bandit algorithm and track cumulative regret."""
    cumulative_regret = 0
    regrets = []
    arm_counts = np.zeros(env.n_arms)

    for _ in range(n_steps):
        arm = algorithm.select_arm()
        reward = env.pull(arm)
        algorithm.update(arm, reward)

        cumulative_regret += env.regret(arm)
        regrets.append(cumulative_regret)
        arm_counts[arm] += 1

    return regrets, arm_counts

# Setup: 4 arms with different true click rates
# Best arm is arm 2 (30% CTR)
true_probs = [0.10, 0.15, 0.30, 0.20]
env = BanditEnvironment(true_probs)
n_steps = 2000

print(f"BANDIT SIMULATION ({n_steps} steps)")
print(f"True CTRs: {true_probs}")
print(f"Best arm: {env.best_arm} (CTR={true_probs[env.best_arm]:.0%})")
print()

algorithms = {
    "Epsilon-Greedy (ε=0.1)": EpsilonGreedy(4, epsilon=0.1),
    "UCB (c=2.0)":             UCB(4, c=2.0),
    "Thompson Sampling":       ThompsonSampling(4),
}

print(f"{'Algorithm':<30} {'Final Regret':>14} {'Best Arm %':>12} {'Arm Counts'}")
print("-" * 80)

for name, algo in algorithms.items():
    regrets, arm_counts = simulate_bandit(algo, env, n_steps)
    best_arm_pct = arm_counts[env.best_arm] / n_steps

    print(f"{name:<30} {regrets[-1]:>14.1f} {best_arm_pct:>12.1%} "
          f"{arm_counts.astype(int).tolist()}")

# Thompson Sampling posterior
ts = ThompsonSampling(4)
for _ in range(500):
    arm = ts.select_arm()
    reward = env.pull(arm)
    ts.update(arm, reward)

print(f"\nThompson Sampling posterior means after 500 steps:")
for i, mean in enumerate(ts.get_posterior_means()):
    print(f"  Arm {i}: estimated CTR = {mean:.3f} (true = {true_probs[i]:.3f})")`
    }
  ],

  resources: [
    {
      title: 'River - Online Machine Learning Library',
      url: 'https://riverml.xyz/',
      description: 'Python library for online/streaming machine learning'
    },
    {
      title: 'Vowpal Wabbit',
      url: 'https://vowpalwabbit.org/',
      description: 'Fast online learning library used at Microsoft — supports contextual bandits'
    },
    {
      title: 'Bandit Algorithms for Website Optimization',
      url: 'https://www.oreilly.com/library/view/bandit-algorithms-for/9781449341565/',
      description: 'Practical guide to multi-armed bandit algorithms'
    },
    {
      title: 'Concept Drift - Survey Paper',
      url: 'https://arxiv.org/abs/2004.05785',
      description: 'Comprehensive survey of concept drift detection and adaptation methods'
    }
  ],

  questions: [
    {
      question: 'What is online learning and when should you use it instead of batch learning?',
      answer: 'Online learning updates the model incrementally with each new data point, without retraining from scratch. Use when: data distribution changes rapidly (user preferences, fraud patterns), real-time personalization needed (each interaction updates the model), data volume is too large to store and retrain on, latency of retraining is unacceptable. Use batch learning when: distribution is stable, reproducibility is critical, need careful evaluation before deployment, data arrives in large periodic batches.'
    },
    {
      question: 'What is concept drift and how do you detect it?',
      answer: 'Concept drift: the statistical relationship between input features and target variable changes over time. Types: sudden (abrupt change — COVID-19 changing shopping patterns), gradual (slow evolution — user preferences), recurring (seasonal patterns), incremental (gradual boundary shift). Detection: ADWIN (adaptive windowing — most popular, automatically adjusts window size), Page-Hinkley test (detects mean changes), DDM (monitors model error rate), KS test (compares distributions). Response: retrain on recent data, increase learning rate, use ensemble of models from different time windows.'
    },
    {
      question: 'What is the exploration-exploitation trade-off in bandit algorithms?',
      answer: 'Exploitation: always choose the best known option — maximizes immediate reward but may miss better options. Exploration: try new options — may find better options but wastes resources on bad ones. Pure exploitation: converges to suboptimal solution. Pure exploration: never converges. Algorithms: Epsilon-greedy (random exploration with probability ε), UCB (explore options with high uncertainty — optimism in face of uncertainty), Thompson Sampling (Bayesian — sample from posterior, best empirical performance). Used in: A/B testing, ad selection, recommendations, hyperparameter tuning.'
    },
    {
      question: 'What is Thompson Sampling and why is it preferred?',
      answer: 'Thompson Sampling maintains a Beta distribution for each arm\'s reward probability. At each step: sample from each arm\'s distribution, select arm with highest sample, observe reward, update distribution (Bayesian update: success → alpha+1, failure → beta+1). Preferred because: 1) Best empirical performance in most settings, 2) Naturally balances exploration/exploitation — uncertain arms get explored more, 3) Bayesian — incorporates prior knowledge, 4) Computationally efficient. Used by Google, Microsoft for ad selection. Contextual Thompson Sampling extends this to use user features.'
    },
    {
      question: 'What is catastrophic forgetting and how do you prevent it?',
      answer: 'Catastrophic forgetting: when a neural network is trained on a new task, it forgets how to do previous tasks — new gradients overwrite weights learned for old tasks. Prevention: 1) EWC (Elastic Weight Consolidation) — add penalty for changing weights important to previous tasks (measured by Fisher information). 2) Experience Replay — store buffer of old examples, replay during new task training. 3) Progressive Neural Networks — add new columns for new tasks, freeze old ones. 4) PackNet — prune network after each task, use freed capacity for next. Most practical: experience replay with a small buffer.'
    },
    {
      question: 'How do you build a real-time ML system for fraud detection?',
      answer: 'Architecture: 1) Event stream (Kafka): transaction events arrive in real-time. 2) Feature extraction (Flink): compute real-time features — velocity (transactions in last 5 min), amount deviation from user average, new merchant flag. 3) Feature store: merge real-time features with historical features (avg spend, typical merchants). 4) Online model: FTRL or gradient boosted trees updated with each labeled transaction. 5) Drift detection: ADWIN monitors error rate, triggers retraining when drift detected. 6) Feedback loop: confirmed fraud/chargebacks → labeled examples → model update. Latency target: <50ms end-to-end.'
    }
  ]
};
