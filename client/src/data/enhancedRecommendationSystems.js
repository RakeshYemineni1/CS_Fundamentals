export const enhancedRecommendationSystems = {
  id: 'recommendation-systems',
  title: 'Recommendation Systems',
  subtitle: 'Collaborative Filtering, Matrix Factorization, Cold Start, and Online Learning',
  summary: 'Recommendation systems predict what a user will like based on their history and the behavior of similar users. They power Netflix, YouTube, Spotify, Amazon, and TikTok. Understanding the math behind collaborative filtering, matrix factorization, and how to handle cold start is essential for SDE interviews at consumer tech companies.',
  analogy: 'A recommendation system is like a very well-read librarian. Collaborative filtering is the librarian saying "people who liked the same books as you also loved this one." Content-based filtering is the librarian saying "you liked mystery novels set in Paris, here\'s another one." Matrix factorization is the librarian discovering hidden themes — "you seem to like books with strong female protagonists and historical settings" — without you ever saying so.',

  explanation: `WHY RECOMMENDATION SYSTEMS MATTER FOR SDEs

Recommendation systems are at the core of every major consumer tech product. Netflix attributes 80% of content watched to recommendations. Amazon attributes 35% of revenue to recommendations. YouTube recommendations drive 70% of watch time. If you interview at any consumer tech company, you will be asked about this.

═══════════════════════════════════════════════════════════════

TYPES OF RECOMMENDATION APPROACHES

1. COLLABORATIVE FILTERING (CF)

"Users who behaved like you also liked X."
Uses only user-item interaction data — no item features needed.

USER-BASED CF:
- Find users similar to the target user (cosine similarity or Pearson correlation on rating vectors)
- Recommend items those similar users liked that the target user hasn't seen
- Problem: doesn't scale — computing similarity between all user pairs is O(U²)

ITEM-BASED CF:
- Find items similar to items the user has liked
- Recommend those similar items
- More scalable — item similarities are precomputed offline
- More stable — item similarities change less than user similarities
- Used by Amazon's original recommendation engine

SIMILARITY METRICS:
Cosine Similarity: cos(u, v) = (u · v) / (|u| × |v|)
Pearson Correlation: accounts for rating scale differences between users
Jaccard Similarity: |A ∩ B| / |A ∪ B| — for implicit feedback (clicked or not)

EXPLICIT vs IMPLICIT FEEDBACK:
Explicit: user gives a rating (1-5 stars) — rare, biased (only engaged users rate)
Implicit: user behavior (clicks, views, purchases, time spent) — abundant, noisy
Most real systems use implicit feedback.

2. MATRIX FACTORIZATION

Decompose the user-item interaction matrix R (U×I) into two lower-rank matrices:
R ≈ P × Q^T
P: user latent factor matrix (U × K)
Q: item latent factor matrix (I × K)
K: number of latent factors (typically 50-300)

Each user and item is represented as a K-dimensional vector of latent factors.
Predicted rating: r̂(u,i) = p_u · q_i (dot product)

LATENT FACTORS:
The K dimensions capture hidden patterns — e.g., for movies:
- Factor 1 might represent "action vs drama"
- Factor 2 might represent "mainstream vs indie"
- Factor 3 might represent "recent vs classic"
Users and items are positioned along these axes.

TRAINING:
Minimize: Σ(r_ui - p_u · q_i)² + λ(|p_u|² + |q_i|²)
- First term: reconstruction error on observed ratings
- Second term: L2 regularization to prevent overfitting
- Optimization: SGD or ALS (Alternating Least Squares)

ALS (Alternating Least Squares):
- Fix Q, solve for P analytically (closed-form solution)
- Fix P, solve for Q analytically
- Alternate until convergence
- Parallelizable — used in Spark MLlib for large-scale CF

SVD (Singular Value Decomposition):
- Exact matrix factorization: R = U × Σ × V^T
- Truncated SVD: keep only top K singular values
- Problem: requires complete matrix (no missing values)
- Solution: fill missing values with 0 or mean, or use SGD-based MF

BIASES:
Add user bias (b_u) and item bias (b_i) to capture systematic effects:
r̂(u,i) = μ + b_u + b_i + p_u · q_i
μ: global average rating
b_u: user's tendency to rate higher/lower than average
b_i: item's tendency to receive higher/lower ratings

3. CONTENT-BASED FILTERING

Recommend items similar to what the user has liked, based on item features.
- Item features: genre, director, cast, description, tags
- User profile: weighted average of features of liked items
- Similarity: cosine similarity between user profile and item feature vectors

Pros: No cold start for items (works immediately for new items with features)
Cons: Over-specialization (filter bubble), requires good item features

4. HYBRID APPROACHES

Combine collaborative and content-based:
- Weighted hybrid: blend scores from both approaches
- Switching: use content-based for cold start, switch to CF once enough data
- Feature augmentation: use content features as additional input to CF model

═══════════════════════════════════════════════════════════════

DEEP LEARNING FOR RECOMMENDATIONS

NEURAL COLLABORATIVE FILTERING (NCF):
Replace dot product with a neural network:
- Embed user and item IDs
- Concatenate embeddings
- Pass through MLP layers
- Output: predicted interaction probability
- Captures non-linear user-item interactions

TWO-TOWER MODEL (covered in AI System Design):
- Separate neural networks for users and items
- Dot product similarity for fast ANN retrieval
- Used by YouTube, Pinterest, Twitter

WIDE & DEEP (Google):
- Wide component: memorization (linear model on cross-product features)
- Deep component: generalization (deep neural network on embeddings)
- Combines memorization of specific patterns with generalization to new ones
- Used in Google Play app recommendations

SEQUENCE-BASED MODELS:
- Model user's interaction history as a sequence
- LSTM/Transformer: predict next item based on sequence
- BERT4Rec: bidirectional transformer for sequential recommendation
- SASRec: self-attentive sequential recommendation

═══════════════════════════════════════════════════════════════

COLD START PROBLEM

NEW USER COLD START:
User has no interaction history — can't use CF.
Solutions:
- Onboarding: ask user to rate a few items or select preferences
- Demographic-based: use age, location, device to find similar users
- Popularity-based: recommend trending/popular items
- Content-based: use any available user features
- Exploration: show diverse items to learn preferences quickly

NEW ITEM COLD START:
Item has no interactions — can't use CF.
Solutions:
- Content-based: use item features (description, category, metadata)
- Item embeddings from content: embed item description with BERT
- Exploration budget: show new items to a random subset of users
- Transfer learning: use embeddings from similar items

SYSTEM COLD START:
Brand new system with no data at all.
Solutions:
- Import data from similar domain
- Use content-based filtering initially
- Collect data through exploration before switching to CF

═══════════════════════════════════════════════════════════════

EVALUATION METRICS

OFFLINE METRICS (on historical data):
- Precision@K: fraction of top-K recommendations that are relevant
- Recall@K: fraction of relevant items that appear in top-K
- NDCG@K: normalized discounted cumulative gain — rewards relevant items ranked higher
- MAP (Mean Average Precision): average precision across all users
- Hit Rate@K: fraction of users for whom at least one relevant item is in top-K
- Coverage: fraction of items that ever get recommended (diversity)
- Novelty: how surprising/unexpected the recommendations are

ONLINE METRICS (A/B test in production):
- CTR (Click-Through Rate): clicks / impressions
- Conversion Rate: purchases / clicks
- Watch Time / Session Length
- Revenue per user
- Long-term retention

OFFLINE ≠ ONLINE:
A model with better NDCG offline may have worse CTR online.
Always validate with A/B tests before full rollout.

═══════════════════════════════════════════════════════════════

PRODUCTION CONSIDERATIONS

SCALABILITY:
- Millions of users × millions of items = can't score all pairs at inference time
- Solution: two-stage (candidate generation + ranking)
- Candidate generation: ANN search in embedding space (fast, ~500 candidates)
- Ranking: deep model scores candidates (slow but only ~500 items)

FRESHNESS:
- User preferences change — stale recommendations hurt engagement
- Real-time features: recent clicks, current session context
- Near-real-time model updates: retrain daily or use online learning

DIVERSITY AND SERENDIPITY:
- Pure accuracy optimization leads to filter bubbles
- Add diversity constraints: don't recommend 10 items from same category
- Exploration-exploitation: occasionally recommend outside comfort zone (ε-greedy)
- Maximal Marginal Relevance (MMR): balance relevance and diversity

POSITION BIAS:
- Items shown at top get more clicks regardless of quality
- Inverse Propensity Scoring (IPS): weight training examples by inverse of their display probability
- Debiasing is critical for learning true user preferences`,

  keyPoints: [
    'Collaborative filtering: user-based (similar users) or item-based (similar items) — uses only interaction data',
    'Matrix factorization: decompose R ≈ P × Q^T — learns K latent factors per user and item',
    'ALS: alternating least squares — parallelizable MF training used in Spark MLlib',
    'Implicit feedback (clicks, views) is more abundant than explicit ratings but noisier',
    'Cold start: new user (onboarding/popularity), new item (content embeddings/exploration)',
    'Two-stage: candidate generation (ANN, fast, millions→500) + ranking (deep model, slow, 500→10)',
    'Offline metrics: NDCG@K, Precision@K, Recall@K. Online metrics: CTR, conversion, retention',
    'Position bias: items shown at top get more clicks — use IPS debiasing for fair training'
  ],

  codeExamples: [
    {
      title: 'Matrix Factorization from Scratch',
      language: 'python',
      description: 'Implement matrix factorization with SGD and ALS for collaborative filtering.',
      code: `import numpy as np
from sklearn.metrics import mean_squared_error

# ============================================
# MATRIX FACTORIZATION WITH SGD
# ============================================

class MatrixFactorization:
    def __init__(self, n_factors=50, lr=0.01, reg=0.01, n_epochs=20):
        self.n_factors = n_factors
        self.lr = lr
        self.reg = reg
        self.n_epochs = n_epochs

    def fit(self, ratings_matrix):
        """
        ratings_matrix: (n_users, n_items) with 0 for unobserved
        """
        self.n_users, self.n_items = ratings_matrix.shape
        self.global_mean = ratings_matrix[ratings_matrix > 0].mean()

        # Initialize latent factors with small random values
        self.P = np.random.normal(0, 0.1, (self.n_users, self.n_factors))  # User factors
        self.Q = np.random.normal(0, 0.1, (self.n_items, self.n_factors))  # Item factors
        self.bu = np.zeros(self.n_users)  # User biases
        self.bi = np.zeros(self.n_items)  # Item biases

        # Get observed (user, item, rating) triples
        observed = [(u, i, ratings_matrix[u, i])
                    for u in range(self.n_users)
                    for i in range(self.n_items)
                    if ratings_matrix[u, i] > 0]

        for epoch in range(self.n_epochs):
            np.random.shuffle(observed)
            total_loss = 0

            for u, i, r_ui in observed:
                # Predicted rating
                r_hat = self.global_mean + self.bu[u] + self.bi[i] + self.P[u] @ self.Q[i]

                # Error
                e_ui = r_ui - r_hat
                total_loss += e_ui ** 2

                # Update biases
                self.bu[u] += self.lr * (e_ui - self.reg * self.bu[u])
                self.bi[i] += self.lr * (e_ui - self.reg * self.bi[i])

                # Update latent factors
                P_u_old = self.P[u].copy()
                self.P[u] += self.lr * (e_ui * self.Q[i] - self.reg * self.P[u])
                self.Q[i] += self.lr * (e_ui * P_u_old - self.reg * self.Q[i])

            rmse = np.sqrt(total_loss / len(observed))
            if epoch % 5 == 0:
                print(f"Epoch {epoch:3d} | RMSE: {rmse:.4f}")

        return self

    def predict(self, user_id, item_id):
        """Predict rating for a (user, item) pair."""
        return (self.global_mean
                + self.bu[user_id]
                + self.bi[item_id]
                + self.P[user_id] @ self.Q[item_id])

    def recommend(self, user_id, n=10, exclude_seen=None):
        """Get top-N recommendations for a user."""
        scores = []
        for item_id in range(self.n_items):
            if exclude_seen and item_id in exclude_seen:
                continue
            score = self.predict(user_id, item_id)
            scores.append((item_id, score))
        return sorted(scores, key=lambda x: x[1], reverse=True)[:n]


# ============================================
# EXAMPLE: MOVIE RATINGS
# ============================================

np.random.seed(42)
n_users, n_items = 100, 50

# Simulate rating matrix (0 = unobserved)
# Users have latent preferences, items have latent attributes
true_user_factors = np.random.randn(n_users, 5)
true_item_factors = np.random.randn(n_items, 5)
true_ratings = true_user_factors @ true_item_factors.T

# Normalize to 1-5 scale
true_ratings = (true_ratings - true_ratings.min()) / (true_ratings.max() - true_ratings.min()) * 4 + 1

# Observe only 20% of ratings (sparse matrix)
observed_mask = np.random.random((n_users, n_items)) < 0.2
ratings_matrix = true_ratings * observed_mask

print(f"Rating matrix: {n_users} users × {n_items} items")
print(f"Observed ratings: {observed_mask.sum()} ({observed_mask.mean():.1%} density)")
print()

# Train
mf = MatrixFactorization(n_factors=10, lr=0.005, reg=0.02, n_epochs=20)
mf.fit(ratings_matrix)

# Evaluate on held-out ratings
test_mask = (ratings_matrix > 0)
predictions = []
actuals = []
for u in range(n_users):
    for i in range(n_items):
        if test_mask[u, i]:
            predictions.append(mf.predict(u, i))
            actuals.append(ratings_matrix[u, i])

rmse = np.sqrt(mean_squared_error(actuals, predictions))
print(f"\nFinal RMSE on observed ratings: {rmse:.4f}")

# Get recommendations for user 0
seen_items = set(np.where(ratings_matrix[0] > 0)[0])
recs = mf.recommend(user_id=0, n=5, exclude_seen=seen_items)
print(f"\nTop 5 recommendations for User 0:")
for item_id, score in recs:
    print(f"  Item {item_id:3d}: predicted rating = {score:.2f}")`
    },
    {
      title: 'Evaluation Metrics & Cold Start Handling',
      language: 'python',
      description: 'Implement recommendation evaluation metrics and cold start strategies.',
      code: `import numpy as np
from collections import defaultdict

# ============================================
# RECOMMENDATION EVALUATION METRICS
# ============================================

def precision_at_k(recommended: list, relevant: set, k: int) -> float:
    """Fraction of top-K recommendations that are relevant."""
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in relevant)
    return hits / k

def recall_at_k(recommended: list, relevant: set, k: int) -> float:
    """Fraction of relevant items that appear in top-K."""
    if not relevant:
        return 0.0
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in relevant)
    return hits / len(relevant)

def ndcg_at_k(recommended: list, relevant: set, k: int) -> float:
    """
    Normalized Discounted Cumulative Gain.
    Rewards relevant items ranked higher.
    """
    top_k = recommended[:k]

    # DCG: sum of relevance / log2(rank + 1)
    dcg = sum(
        (1 / np.log2(rank + 2))  # rank is 0-indexed, so +2
        for rank, item in enumerate(top_k)
        if item in relevant
    )

    # Ideal DCG: all relevant items at top
    ideal_hits = min(len(relevant), k)
    idcg = sum(1 / np.log2(rank + 2) for rank in range(ideal_hits))

    return dcg / idcg if idcg > 0 else 0.0

def hit_rate_at_k(recommended: list, relevant: set, k: int) -> float:
    """1 if at least one relevant item in top-K, else 0."""
    return 1.0 if any(item in relevant for item in recommended[:k]) else 0.0

def evaluate_recommendations(user_recommendations: dict,
                               user_relevant_items: dict,
                               k: int = 10) -> dict:
    """
    Evaluate recommendations across all users.
    user_recommendations: {user_id: [item_id, ...]} (ranked list)
    user_relevant_items: {user_id: {item_id, ...}} (ground truth)
    """
    metrics = defaultdict(list)

    for user_id, recommended in user_recommendations.items():
        relevant = user_relevant_items.get(user_id, set())
        if not relevant:
            continue

        metrics['precision'].append(precision_at_k(recommended, relevant, k))
        metrics['recall'].append(recall_at_k(recommended, relevant, k))
        metrics['ndcg'].append(ndcg_at_k(recommended, relevant, k))
        metrics['hit_rate'].append(hit_rate_at_k(recommended, relevant, k))

    return {
        f'precision@{k}': np.mean(metrics['precision']),
        f'recall@{k}':    np.mean(metrics['recall']),
        f'ndcg@{k}':      np.mean(metrics['ndcg']),
        f'hit_rate@{k}':  np.mean(metrics['hit_rate']),
        'n_users_evaluated': len(metrics['precision'])
    }

# Test evaluation
np.random.seed(42)
n_users, n_items = 50, 100

# Simulate recommendations and ground truth
user_recs = {u: list(np.random.choice(n_items, 20, replace=False)) for u in range(n_users)}
user_relevant = {u: set(np.random.choice(n_items, 5, replace=False)) for u in range(n_users)}

results = evaluate_recommendations(user_recs, user_relevant, k=10)
print("EVALUATION RESULTS:")
for metric, value in results.items():
    if isinstance(value, float):
        print(f"  {metric}: {value:.4f}")
    else:
        print(f"  {metric}: {value}")

# ============================================
# COLD START STRATEGIES
# ============================================

class ColdStartHandler:
    """Handle cold start for new users and new items."""

    def __init__(self, item_features: dict, item_popularity: dict):
        self.item_features = item_features    # {item_id: feature_vector}
        self.item_popularity = item_popularity # {item_id: interaction_count}

    def recommend_new_user(self, user_demographics: dict = None,
                            onboarding_ratings: dict = None,
                            strategy: str = 'popularity', n: int = 10) -> list:
        """Recommend items for a new user with no history."""

        if strategy == 'popularity':
            # Recommend most popular items
            sorted_items = sorted(self.item_popularity.items(),
                                  key=lambda x: x[1], reverse=True)
            return [item_id for item_id, _ in sorted_items[:n]]

        elif strategy == 'onboarding' and onboarding_ratings:
            # User rated a few items during onboarding
            # Build user profile from rated items
            rated_features = [
                self.item_features[item_id]
                for item_id in onboarding_ratings
                if item_id in self.item_features
            ]
            if not rated_features:
                return self.recommend_new_user(n=n, strategy='popularity')

            # User profile = weighted average of rated item features
            weights = list(onboarding_ratings.values())
            user_profile = np.average(rated_features, axis=0, weights=weights)

            # Find most similar items
            scores = []
            for item_id, features in self.item_features.items():
                if item_id not in onboarding_ratings:
                    sim = np.dot(user_profile, features) / (
                        np.linalg.norm(user_profile) * np.linalg.norm(features) + 1e-8
                    )
                    scores.append((item_id, sim))

            return [item_id for item_id, _ in sorted(scores, key=lambda x: x[1], reverse=True)[:n]]

        elif strategy == 'diverse':
            # Show diverse items to learn preferences quickly
            # Sample from different categories
            categories = defaultdict(list)
            for item_id in self.item_features:
                cat = item_id % 10  # Simulate categories
                categories[cat].append(item_id)

            diverse_items = []
            for cat_items in categories.values():
                if len(diverse_items) < n:
                    diverse_items.append(np.random.choice(cat_items))

            return diverse_items[:n]

        return []

    def get_item_embedding_for_cold_item(self, item_description: str) -> np.ndarray:
        """
        For a new item with no interactions, generate embedding from content.
        In production: use BERT/sentence-transformers to embed description.
        """
        # Simulate content-based embedding
        np.random.seed(hash(item_description) % 2**32)
        return np.random.randn(64)  # 64-dim content embedding

# Demo
n_items = 100
item_features = {i: np.random.randn(64) for i in range(n_items)}
item_popularity = {i: np.random.randint(1, 1000) for i in range(n_items)}

handler = ColdStartHandler(item_features, item_popularity)

print("\nCOLD START RECOMMENDATIONS:")
print("New user (popularity-based):", handler.recommend_new_user(strategy='popularity', n=5))
print("New user (onboarding):", handler.recommend_new_user(
    onboarding_ratings={5: 5.0, 12: 4.0, 23: 2.0},
    strategy='onboarding', n=5
))`
    }
  ],

  resources: [
    {
      title: 'Netflix Prize and Matrix Factorization',
      url: 'https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf',
      description: 'The paper that popularized matrix factorization for recommendations'
    },
    {
      title: 'Surprise Library - Python',
      url: 'https://surpriselib.com/',
      description: 'Python library for building and evaluating recommendation systems'
    },
    {
      title: 'Deep Learning for Recommender Systems - RecSys',
      url: 'https://arxiv.org/abs/1707.07435',
      description: 'Survey of deep learning approaches for recommendation'
    },
    {
      title: 'YouTube Recommendation System Paper',
      url: 'https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf',
      description: 'Google\'s deep neural network approach to YouTube recommendations'
    }
  ],

  questions: [
    {
      question: 'What is collaborative filtering and what are its types?',
      answer: 'Collaborative filtering recommends items based on user-item interaction patterns — no item features needed. User-based CF: find similar users, recommend what they liked. Item-based CF: find items similar to what the user liked — more scalable (item similarities precomputed offline), more stable. Both use similarity metrics: cosine similarity, Pearson correlation, Jaccard (for implicit feedback). Main limitation: cold start problem — can\'t recommend for new users/items with no history.'
    },
    {
      question: 'How does matrix factorization work for recommendations?',
      answer: 'Matrix factorization decomposes the user-item rating matrix R (U×I) into two lower-rank matrices: R ≈ P × Q^T, where P is user latent factors (U×K) and Q is item latent factors (I×K). Each user and item gets a K-dimensional embedding. Predicted rating = p_u · q_i (dot product). Training: minimize reconstruction error + L2 regularization via SGD or ALS. Latent factors capture hidden patterns (genre preferences, style) without explicit labels. Add user/item biases for better accuracy.'
    },
    {
      question: 'What is the cold start problem and how do you solve it?',
      answer: 'Cold start: new users or items have no interaction history, so collaborative filtering can\'t work. New user solutions: onboarding questions (ask to rate a few items), demographic-based (find similar users by age/location), popularity-based (show trending items), diverse exploration (show varied items to learn preferences). New item solutions: content-based embeddings (embed description with BERT), exploration budget (show to random users), transfer from similar items. Hybrid: use content-based for cold entities, switch to CF once enough data.'
    },
    {
      question: 'What is NDCG and why is it better than accuracy for recommendations?',
      answer: 'NDCG (Normalized Discounted Cumulative Gain) measures ranking quality — it rewards relevant items ranked higher. DCG = Σ(relevance / log2(rank+1)). NDCG = DCG / ideal DCG. Better than accuracy because: 1) Position matters — showing a relevant item at rank 1 is better than rank 10. 2) Handles multiple relevant items. 3) Normalized to [0,1] for comparison across users. Accuracy treats all positions equally. For recommendations, rank 1 gets far more clicks than rank 10 — NDCG captures this.'
    },
    {
      question: 'What is position bias in recommendations and how do you handle it?',
      answer: 'Position bias: items shown at higher positions get more clicks regardless of quality — users click top results more. This corrupts training data — model learns "items at top are good" rather than "good items are at top." Solutions: Inverse Propensity Scoring (IPS) — weight training examples by inverse of display probability (items shown less get higher weight). Randomization experiments — occasionally show random items to collect unbiased data. Counterfactual learning — model the display mechanism explicitly.'
    },
    {
      question: 'How do you evaluate a recommendation system?',
      answer: 'Offline metrics (on historical data): Precision@K (fraction of top-K that are relevant), Recall@K (fraction of relevant items in top-K), NDCG@K (ranking quality), Hit Rate@K (at least one relevant item in top-K), Coverage (fraction of items ever recommended). Online metrics (A/B test): CTR, conversion rate, session length, revenue, long-term retention. Critical: offline metrics don\'t always predict online performance — always validate with A/B tests. Also measure diversity and novelty to avoid filter bubbles.'
    }
  ]
};
