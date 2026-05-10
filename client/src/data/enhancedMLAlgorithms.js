export const enhancedMLAlgorithms = {
  id: 'ml-algorithms',
  title: 'ML Algorithms',
  subtitle: 'Linear Regression, Decision Trees, SVM, Random Forest, K-Means, and More',
  summary: 'Machine learning algorithms are the mathematical engines that learn patterns from data. Understanding how each algorithm works, its assumptions, strengths, and weaknesses is essential for choosing the right tool for each problem.',
  analogy: 'ML algorithms are like different types of tools. Linear Regression is a ruler — great for straight-line relationships. Decision Trees are flowcharts — easy to understand and explain. Random Forest is a committee of experts — more reliable than any single expert. SVM is a boundary finder — draws the widest possible line between classes. K-Means is a sorter — groups similar things together.',

  explanation: `OVERVIEW OF ML ALGORITHMS

Choosing the right algorithm depends on:
- Problem type (classification, regression, clustering)
- Dataset size and dimensionality
- Need for interpretability
- Training time constraints
- Presence of non-linear relationships

═══════════════════════════════════════════════════════════════

1. LINEAR REGRESSION

TYPE: Supervised — Regression
IDEA: Fit a straight line (or hyperplane) through the data.
MODEL: y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
TRAINING: Minimize Mean Squared Error (MSE) using gradient descent or closed-form solution.

ASSUMPTIONS:
- Linear relationship between features and target
- Features are independent (no multicollinearity)
- Residuals are normally distributed
- Homoscedasticity (constant variance of residuals)

VARIANTS:
- Ridge (L2): Adds λ × Σwᵢ² penalty — handles multicollinearity
- Lasso (L1): Adds λ × Σ|wᵢ| penalty — performs feature selection
- Elastic Net: Combines L1 and L2

PROS: Fast, interpretable, works well when relationship is linear
CONS: Cannot capture non-linear relationships, sensitive to outliers

═══════════════════════════════════════════════════════════════

2. LOGISTIC REGRESSION

TYPE: Supervised — Classification (despite the name!)
IDEA: Apply sigmoid function to linear combination to output probability.
MODEL: P(y=1) = sigmoid(w₁x₁ + ... + wₙxₙ + b) = 1/(1+e^(-z))
TRAINING: Minimize Binary Cross-Entropy loss.

DECISION BOUNDARY: Linear (straight line in 2D)
OUTPUT: Probability between 0 and 1

PROS: Fast, interpretable, outputs probabilities, works well for linearly separable data
CONS: Cannot capture non-linear boundaries without feature engineering

═══════════════════════════════════════════════════════════════

3. DECISION TREES

TYPE: Supervised — Classification and Regression
IDEA: Recursively split data based on feature thresholds to create a tree of decisions.

HOW IT WORKS:
1. At each node, find the feature and threshold that best splits the data
2. Splitting criteria: Gini Impurity (classification), Information Gain/Entropy (classification), MSE reduction (regression)
3. Repeat until stopping criteria (max depth, min samples, etc.)
4. Leaf nodes contain the prediction

GINI IMPURITY: 1 - Σpᵢ²
ENTROPY: -Σpᵢ × log₂(pᵢ)
INFORMATION GAIN: Entropy(parent) - weighted average Entropy(children)

PROS: Interpretable, handles non-linear relationships, no feature scaling needed, handles mixed data types
CONS: Prone to overfitting, unstable (small data changes → different tree), biased toward features with more levels

═══════════════════════════════════════════════════════════════

4. RANDOM FOREST

TYPE: Supervised — Classification and Regression (Ensemble)
IDEA: Build many decision trees on random subsets of data and features, then aggregate predictions.

HOW IT WORKS:
1. Bootstrap sampling: Create N random subsets of training data (with replacement)
2. Feature randomness: At each split, consider only √(total features) random features
3. Train one decision tree on each subset
4. Prediction: Majority vote (classification) or average (regression)

KEY CONCEPTS:
- Bagging (Bootstrap Aggregating): Reduces variance by averaging many models
- Feature randomness: Decorrelates trees, further reduces variance
- Out-of-bag (OOB) error: Free validation using samples not in each tree's bootstrap

PROS: Excellent performance, handles overfitting, feature importance, robust to outliers
CONS: Less interpretable than single tree, slower than single tree, high memory usage

═══════════════════════════════════════════════════════════════

5. SUPPORT VECTOR MACHINE (SVM)

TYPE: Supervised — Classification and Regression
IDEA: Find the hyperplane that maximizes the margin between classes.

KEY CONCEPTS:
- Support Vectors: Data points closest to the decision boundary
- Margin: Distance between the hyperplane and nearest support vectors
- Maximum Margin Classifier: Maximize the margin for better generalization

KERNEL TRICK:
For non-linearly separable data, map features to higher dimensions where they become linearly separable.
- Linear kernel: for linearly separable data
- RBF (Radial Basis Function): most popular, handles non-linear boundaries
- Polynomial kernel: for polynomial boundaries

C PARAMETER: Controls trade-off between margin size and misclassification
- Small C: Larger margin, more misclassifications (underfitting)
- Large C: Smaller margin, fewer misclassifications (overfitting)

PROS: Effective in high dimensions, memory efficient (only support vectors matter), versatile with kernels
CONS: Slow on large datasets, sensitive to feature scaling, hard to interpret

═══════════════════════════════════════════════════════════════

6. K-NEAREST NEIGHBORS (KNN)

TYPE: Supervised — Classification and Regression
IDEA: Classify a new point based on the majority class of its K nearest neighbors.

HOW IT WORKS:
1. Store all training data (lazy learner — no training phase)
2. For a new point, compute distance to all training points
3. Find K nearest neighbors
4. Classification: majority vote. Regression: average.

DISTANCE METRICS: Euclidean, Manhattan, Minkowski

K SELECTION:
- Small K: Complex boundary, overfitting
- Large K: Smooth boundary, underfitting
- Use cross-validation to find optimal K

PROS: Simple, no training time, naturally handles multi-class, non-parametric
CONS: Slow prediction (O(n) per query), sensitive to irrelevant features, requires feature scaling, high memory

═══════════════════════════════════════════════════════════════

7. K-MEANS CLUSTERING

TYPE: Unsupervised — Clustering
IDEA: Partition data into K clusters by minimizing within-cluster variance.

ALGORITHM:
1. Initialize K centroids randomly
2. Assign each point to nearest centroid
3. Recompute centroids as mean of assigned points
4. Repeat steps 2-3 until convergence

CHOOSING K:
- Elbow Method: Plot inertia vs K, find the "elbow"
- Silhouette Score: Measures how similar a point is to its own cluster vs others

PROS: Simple, scalable, fast
CONS: Must specify K, sensitive to initialization, assumes spherical clusters, sensitive to outliers

═══════════════════════════════════════════════════════════════

8. GRADIENT BOOSTING (XGBoost, LightGBM)

TYPE: Supervised — Classification and Regression (Ensemble)
IDEA: Build trees sequentially, each correcting the errors of the previous.

HOW IT WORKS:
1. Start with a simple prediction (mean)
2. Compute residuals (errors)
3. Train a new tree to predict the residuals
4. Add the new tree to the ensemble (with a learning rate)
5. Repeat for N iterations

XGBoost: Extreme Gradient Boosting — regularization, parallel processing, handles missing values
LightGBM: Faster than XGBoost, leaf-wise tree growth, better for large datasets
CatBoost: Handles categorical features natively

PROS: State-of-the-art on tabular data, handles missing values, feature importance
CONS: Many hyperparameters, slower to train than Random Forest, can overfit`,

  keyPoints: [
    'Linear/Logistic Regression: fast, interpretable, assumes linear relationships',
    'Decision Trees: interpretable, handles non-linearity, prone to overfitting',
    'Random Forest: ensemble of trees, reduces overfitting via bagging + feature randomness',
    'SVM: maximizes margin between classes, kernel trick for non-linear boundaries',
    'KNN: lazy learner, no training, classify by majority vote of K nearest neighbors',
    'K-Means: unsupervised clustering, minimize within-cluster variance',
    'Gradient Boosting (XGBoost): sequential trees correcting errors, best for tabular data',
    'Feature scaling required for: KNN, SVM, Logistic Regression, Neural Networks'
  ],

  codeExamples: [
    {
      title: 'Algorithm Comparison on Same Dataset',
      language: 'python',
      description: 'Compare multiple ML algorithms on the same classification problem.',
      code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import f1_score
import numpy as np

# Generate dataset
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=15,
    n_redundant=5, random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ============================================
# DEFINE ALGORITHMS
# ============================================

algorithms = {
    "Logistic Regression": Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000, random_state=42))
    ]),
    "Decision Tree": DecisionTreeClassifier(max_depth=10, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
    "SVM (RBF)": Pipeline([
        ('scaler', StandardScaler()),
        ('clf', SVC(kernel='rbf', probability=True, random_state=42))
    ]),
    "KNN (k=5)": Pipeline([
        ('scaler', StandardScaler()),
        ('clf', KNeighborsClassifier(n_neighbors=5))
    ]),
}

# ============================================
# TRAIN AND EVALUATE ALL ALGORITHMS
# ============================================

print(f"{'Algorithm':<25} {'Train F1':>10} {'Test F1':>10} {'CV F1 (5-fold)':>15}")
print("-" * 65)

results = {}
for name, model in algorithms.items():
    # Train
    model.fit(X_train, y_train)
    
    # Evaluate
    train_f1 = f1_score(y_train, model.predict(X_train))
    test_f1  = f1_score(y_test, model.predict(X_test))
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='f1')
    cv_mean = cv_scores.mean()
    
    results[name] = {"train_f1": train_f1, "test_f1": test_f1, "cv_f1": cv_mean}
    
    # Detect overfitting
    gap = train_f1 - test_f1
    flag = " ⚠️ OVERFIT" if gap > 0.1 else ""
    
    print(f"{name:<25} {train_f1:>10.3f} {test_f1:>10.3f} {cv_mean:>15.3f}{flag}")

# Best model
best = max(results, key=lambda k: results[k]['cv_f1'])
print(f"\\n✅ Best model: {best} (CV F1: {results[best]['cv_f1']:.3f})")`
    },
    {
      title: 'Decision Tree Visualization & Feature Importance',
      language: 'python',
      description: 'Train a decision tree and understand how it makes decisions.',
      code: `from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

# ============================================
# DECISION TREE — INTERPRETABILITY
# ============================================

iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
class_names = iris.target_names

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train decision tree
dt = DecisionTreeClassifier(max_depth=3, random_state=42)
dt.fit(X_train, y_train)

print(f"Decision Tree Accuracy: {accuracy_score(y_test, dt.predict(X_test)):.2%}")
print(f"Tree depth: {dt.get_depth()}")
print(f"Number of leaves: {dt.get_n_leaves()}")

# Print the tree rules (human-readable!)
tree_rules = export_text(dt, feature_names=feature_names)
print("\\nDECISION TREE RULES:")
print(tree_rules)

# ============================================
# RANDOM FOREST — FEATURE IMPORTANCE
# ============================================

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

print(f"\\nRandom Forest Accuracy: {accuracy_score(y_test, rf.predict(X_test)):.2%}")

# Feature importance (how much each feature contributes to predictions)
importances = rf.feature_importances_
sorted_idx = np.argsort(importances)[::-1]

print("\\nFEATURE IMPORTANCE (Random Forest):")
for i, idx in enumerate(sorted_idx):
    bar = "█" * int(importances[idx] * 50)
    print(f"  {i+1}. {feature_names[idx]:<30} {importances[idx]:.4f} {bar}")

# ============================================
# GRADIENT BOOSTING — HOW IT BUILDS SEQUENTIALLY
# ============================================

from sklearn.ensemble import GradientBoostingClassifier

# Show how performance improves with more trees
print("\\nGRADIENT BOOSTING — Performance vs Number of Trees:")
print(f"{'Trees':>8} {'Train Acc':>12} {'Test Acc':>12}")

for n_trees in [1, 5, 10, 25, 50, 100, 200]:
    gb = GradientBoostingClassifier(n_estimators=n_trees, learning_rate=0.1, random_state=42)
    gb.fit(X_train, y_train)
    train_acc = accuracy_score(y_train, gb.predict(X_train))
    test_acc  = accuracy_score(y_test, gb.predict(X_test))
    print(f"{n_trees:>8} {train_acc:>12.3f} {test_acc:>12.3f}")

# ============================================
# SVM — EFFECT OF C AND KERNEL
# ============================================

from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

print("\\nSVM — Effect of C parameter (RBF kernel):")
print(f"{'C':>8} {'Train Acc':>12} {'Test Acc':>12} {'Diagnosis':>15}")

for C in [0.01, 0.1, 1, 10, 100, 1000]:
    svm = SVC(C=C, kernel='rbf', random_state=42)
    svm.fit(X_train_s, y_train)
    train_acc = accuracy_score(y_train, svm.predict(X_train_s))
    test_acc  = accuracy_score(y_test, svm.predict(X_test_s))
    gap = train_acc - test_acc
    diagnosis = "Overfit" if gap > 0.05 else "Underfit" if test_acc < 0.85 else "Good"
    print(f"{C:>8} {train_acc:>12.3f} {test_acc:>12.3f} {diagnosis:>15}")`
    }
  ],

  resources: [
    {
      title: 'Scikit-learn Algorithm Cheat Sheet',
      url: 'https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html',
      description: 'Official guide for choosing the right ML algorithm'
    },
    {
      title: 'StatQuest ML Algorithms (YouTube)',
      url: 'https://www.youtube.com/c/joshstarmer',
      description: 'Best visual explanations of every ML algorithm'
    },
    {
      title: 'XGBoost Documentation',
      url: 'https://xgboost.readthedocs.io/',
      description: 'Official XGBoost docs — the most popular ML library for tabular data'
    },
    {
      title: 'An Introduction to Statistical Learning (Free Book)',
      url: 'https://www.statlearning.com/',
      description: 'The best textbook for understanding ML algorithms mathematically'
    }
  ],

  questions: [
    {
      question: 'What is the difference between Linear Regression and Logistic Regression?',
      answer: 'Linear Regression predicts a continuous value (house price, temperature) by fitting a line: y = wx + b. Logistic Regression predicts a probability for classification by applying sigmoid to the linear combination: P(y=1) = sigmoid(wx + b). Despite the name, Logistic Regression is a classification algorithm. Both have linear decision boundaries. Use Linear for regression, Logistic for binary classification.'
    },
    {
      question: 'How does a Decision Tree work? What are Gini Impurity and Information Gain?',
      answer: 'A Decision Tree recursively splits data by finding the feature and threshold that best separates classes. Gini Impurity = 1 - Σpᵢ² (0 = pure node, 0.5 = maximum impurity). Information Gain = Entropy(parent) - weighted average Entropy(children). The algorithm chooses the split that maximizes Information Gain or minimizes Gini Impurity. Stops when max depth reached, min samples per leaf, or node is pure.'
    },
    {
      question: 'What is Random Forest and how does it reduce overfitting?',
      answer: 'Random Forest builds many decision trees on random subsets of data (bootstrap sampling) and random subsets of features, then aggregates predictions (majority vote for classification, average for regression). Reduces overfitting via: 1) Bagging — averaging many models reduces variance, 2) Feature randomness — decorrelates trees so errors don\'t correlate. Result: much more robust than a single decision tree. Also provides feature importance.'
    },
    {
      question: 'How does SVM work? What is the kernel trick?',
      answer: 'SVM finds the hyperplane that maximizes the margin between classes. Support vectors are the data points closest to the boundary. The kernel trick maps data to higher dimensions where it becomes linearly separable, without explicitly computing the transformation. Common kernels: Linear (linearly separable data), RBF (most popular, handles non-linear), Polynomial. C parameter controls margin size vs misclassification trade-off.'
    },
    {
      question: 'What is the difference between bagging and boosting?',
      answer: 'Bagging (Bootstrap Aggregating): Train multiple models in parallel on random subsets of data, aggregate predictions. Reduces variance. Example: Random Forest. Boosting: Train models sequentially, each correcting errors of the previous. Reduces bias. Example: XGBoost, LightGBM, AdaBoost. Bagging is more robust to overfitting. Boosting typically achieves higher accuracy but can overfit. Both are ensemble methods that combine weak learners.'
    },
    {
      question: 'When should you use each algorithm?',
      answer: 'Linear/Logistic Regression: linear relationships, need interpretability, fast. Decision Tree: need interpretability, mixed data types, non-linear. Random Forest: general purpose, tabular data, need feature importance. Gradient Boosting (XGBoost): best performance on tabular data, Kaggle competitions. SVM: high-dimensional data, small-medium datasets, clear margin of separation. KNN: simple baseline, small datasets. Neural Networks: images, text, audio, very large datasets.'
    },
    {
      question: 'What algorithms require feature scaling and why?',
      answer: 'Algorithms that require feature scaling: KNN (distance-based — large-scale features dominate), SVM (distance-based), Logistic Regression (gradient descent converges faster), Neural Networks (gradient descent). Algorithms that do NOT require scaling: Decision Trees, Random Forest, Gradient Boosting (tree-based — use thresholds, not distances). Rule: if the algorithm uses distances or gradient descent, scale your features (StandardScaler or MinMaxScaler).'
    }
  ]
};
