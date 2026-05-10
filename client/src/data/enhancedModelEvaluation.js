export const enhancedModelEvaluation = {
  id: 'model-evaluation',
  title: 'Model Evaluation & Metrics',
  subtitle: 'How to Measure and Improve ML Model Performance',
  summary: 'Model evaluation is the process of measuring how well a machine learning model performs on unseen data. Choosing the right metrics is critical — using accuracy alone on an imbalanced dataset can be dangerously misleading.',
  analogy: 'Evaluating a model is like grading a student. Accuracy is like overall grade — useful but incomplete. Precision is like "of all the answers you marked correct, how many actually were?" Recall is like "of all the correct answers, how many did you find?" F1 is the balanced score. You need all of them to truly understand performance.',

  explanation: `WHY EVALUATION MATTERS

Choosing the wrong metric can lead to deploying a model that looks great on paper but fails in production. A model that predicts "no cancer" for every patient achieves 99% accuracy on a dataset where 99% of patients are healthy — but it is completely useless.

TRAIN / VALIDATION / TEST SPLIT

Training Set (60-80%): Used to train the model (adjust weights)
Validation Set (10-20%): Used to tune hyperparameters and select the best model
Test Set (10-20%): Used ONLY ONCE at the end to estimate real-world performance

NEVER use test data during training or hyperparameter tuning — it leads to overly optimistic estimates.

K-FOLD CROSS VALIDATION:
Split data into K folds. Train on K-1 folds, validate on 1 fold. Repeat K times.
Final score = average of K validation scores.
More reliable than a single train/test split. Standard: 5-fold or 10-fold.

═══════════════════════════════════════════════════════════════

CLASSIFICATION METRICS

CONFUSION MATRIX:
The foundation of all classification metrics.

                  Predicted Positive  Predicted Negative
Actual Positive:  True Positive (TP)  False Negative (FN)
Actual Negative:  False Positive (FP) True Negative (TN)

TP: Correctly predicted positive (cancer patient correctly identified)
TN: Correctly predicted negative (healthy patient correctly identified)
FP: False alarm (healthy patient flagged as cancer) — Type I Error
FN: Missed case (cancer patient missed) — Type II Error

ACCURACY:
(TP + TN) / (TP + TN + FP + FN)
Proportion of all correct predictions.
PROBLEM: Misleading for imbalanced datasets.

PRECISION:
TP / (TP + FP)
Of all predicted positives, how many are actually positive?
"When the model says YES, how often is it right?"
High precision = few false alarms.
Use when: false positives are costly (spam filter — don't want to block real emails)

RECALL (Sensitivity):
TP / (TP + FN)
Of all actual positives, how many did the model find?
"Of all the real positives, how many did we catch?"
High recall = few missed cases.
Use when: false negatives are costly (cancer detection — don't want to miss cases)

F1 SCORE:
2 × (Precision × Recall) / (Precision + Recall)
Harmonic mean of precision and recall.
Use when: you need balance between precision and recall.
Use when: dataset is imbalanced.

F-BETA SCORE:
(1 + β²) × (Precision × Recall) / (β² × Precision + Recall)
β > 1: weights recall more (use for medical diagnosis)
β < 1: weights precision more (use for spam detection)

AUC-ROC:
Area Under the Receiver Operating Characteristic Curve.
ROC curve plots True Positive Rate vs False Positive Rate at different thresholds.
AUC = 1.0: Perfect classifier
AUC = 0.5: Random classifier (no skill)
AUC = 0.0: Perfectly wrong
Use when: you want threshold-independent evaluation.

PRECISION-RECALL CURVE:
Better than ROC for highly imbalanced datasets.
Plots Precision vs Recall at different thresholds.

═══════════════════════════════════════════════════════════════

REGRESSION METRICS

MAE (Mean Absolute Error):
Average of |actual - predicted|
Intuitive, same units as target, robust to outliers.
Use when: outliers should not dominate.

MSE (Mean Squared Error):
Average of (actual - predicted)²
Penalizes large errors more heavily.
Sensitive to outliers.

RMSE (Root Mean Squared Error):
√MSE — same units as target.
Most commonly reported regression metric.
Use when: large errors are particularly bad.

R² (R-Squared / Coefficient of Determination):
1 - (SS_residual / SS_total)
Proportion of variance in target explained by the model.
R² = 1.0: Perfect fit
R² = 0.0: Model no better than predicting the mean
R² < 0: Model worse than predicting the mean

MAPE (Mean Absolute Percentage Error):
Average of |actual - predicted| / actual × 100%
Intuitive percentage error.
Problem: undefined when actual = 0.

═══════════════════════════════════════════════════════════════

OVERFITTING AND UNDERFITTING

UNDERFITTING (High Bias):
- Training accuracy is low
- Validation accuracy is also low
- Model is too simple
- Fix: more complex model, more features, more training

OVERFITTING (High Variance):
- Training accuracy is high
- Validation accuracy is much lower
- Model memorized training data
- Fix: more data, regularization, dropout, simpler model, early stopping

LEARNING CURVES:
Plot training and validation loss vs training set size or epochs.
Diagnose underfitting/overfitting visually.

REGULARIZATION TECHNIQUES:
L1 (Lasso): Adds |weights| penalty — drives some weights to exactly 0 (feature selection)
L2 (Ridge): Adds weights² penalty — shrinks all weights toward 0
Elastic Net: Combination of L1 and L2
Dropout: Randomly deactivate neurons during training (neural networks)
Early Stopping: Stop training when validation loss stops improving`,

  keyPoints: [
    'Never evaluate on training data — always use a held-out test set',
    'Accuracy is misleading for imbalanced datasets — use F1, AUC-ROC instead',
    'Precision: minimize false positives (spam filter). Recall: minimize false negatives (cancer detection)',
    'F1 score is the harmonic mean of precision and recall — use for imbalanced data',
    'AUC-ROC measures classifier performance across all thresholds (1.0 = perfect, 0.5 = random)',
    'RMSE is the most common regression metric — penalizes large errors more',
    'R² measures proportion of variance explained (1.0 = perfect, 0.0 = no better than mean)',
    'Learning curves diagnose underfitting (high bias) vs overfitting (high variance)'
  ],

  codeExamples: [
    {
      title: 'Complete Classification Evaluation',
      language: 'python',
      description: 'Comprehensive evaluation of a classification model with all key metrics.',
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    precision_recall_curve, roc_curve
)
from sklearn.preprocessing import StandardScaler

# ============================================
# GENERATE IMBALANCED DATASET (realistic scenario)
# ============================================

X, y = make_classification(
    n_samples=1000,
    n_features=20,
    weights=[0.9, 0.1],  # 90% negative, 10% positive (imbalanced!)
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]  # Probability of positive class

# ============================================
# CONFUSION MATRIX
# ============================================

cm = confusion_matrix(y_test, y_pred)
tn, fp, fn, tp = cm.ravel()

print("CONFUSION MATRIX:")
print(f"  True Negatives  (TN): {tn}  — Correctly predicted negative")
print(f"  False Positives (FP): {fp}  — Predicted positive, actually negative")
print(f"  False Negatives (FN): {fn}  — Predicted negative, actually positive")
print(f"  True Positives  (TP): {tp}  — Correctly predicted positive")

# ============================================
# ALL CLASSIFICATION METRICS
# ============================================

accuracy  = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall    = recall_score(y_test, y_pred)
f1        = f1_score(y_test, y_pred)
auc_roc   = roc_auc_score(y_test, y_prob)

print(f"\\nMETRICS:")
print(f"  Accuracy:  {accuracy:.3f}  ← Misleading on imbalanced data!")
print(f"  Precision: {precision:.3f}  ← Of predicted positives, how many correct?")
print(f"  Recall:    {recall:.3f}  ← Of actual positives, how many found?")
print(f"  F1 Score:  {f1:.3f}  ← Harmonic mean of precision & recall")
print(f"  AUC-ROC:   {auc_roc:.3f}  ← Threshold-independent performance")

# Full report
print("\\nFULL CLASSIFICATION REPORT:")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

# ============================================
# CROSS-VALIDATION (more reliable estimate)
# ============================================

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_f1 = cross_val_score(model, X, y, cv=cv, scoring='f1')
cv_auc = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')

print(f"\\n5-FOLD CROSS-VALIDATION:")
print(f"  F1:      {cv_f1.mean():.3f} ± {cv_f1.std():.3f}")
print(f"  AUC-ROC: {cv_auc.mean():.3f} ± {cv_auc.std():.3f}")

# ============================================
# THRESHOLD TUNING
# ============================================

# Default threshold is 0.5 — but we can tune it
# For medical diagnosis: lower threshold → higher recall (catch more cases)
# For spam filter: higher threshold → higher precision (fewer false alarms)

thresholds = [0.3, 0.4, 0.5, 0.6, 0.7]
print("\\nTHRESHOLD ANALYSIS:")
print(f"{'Threshold':>10} {'Precision':>10} {'Recall':>10} {'F1':>10}")
for t in thresholds:
    y_pred_t = (y_prob >= t).astype(int)
    p = precision_score(y_test, y_pred_t, zero_division=0)
    r = recall_score(y_test, y_pred_t, zero_division=0)
    f = f1_score(y_test, y_pred_t, zero_division=0)
    print(f"{t:>10.1f} {p:>10.3f} {r:>10.3f} {f:>10.3f}")`
    },
    {
      title: 'Regression Evaluation & Learning Curves',
      language: 'python',
      description: 'Evaluate regression models and diagnose overfitting/underfitting with learning curves.',
      code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

# ============================================
# REGRESSION METRICS
# ============================================

X, y = make_regression(n_samples=500, n_features=10, noise=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

mae  = mean_absolute_error(y_test, y_pred)
mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_test, y_pred)
mape = np.mean(np.abs((y_test - y_pred) / (np.abs(y_test) + 1e-8))) * 100

print("REGRESSION METRICS:")
print(f"  MAE:  {mae:.2f}  — Average absolute error (same units as target)")
print(f"  MSE:  {mse:.2f}  — Penalizes large errors more")
print(f"  RMSE: {rmse:.2f}  — Most common, same units as target")
print(f"  R²:   {r2:.4f}  — Proportion of variance explained (1.0 = perfect)")
print(f"  MAPE: {mape:.2f}%  — Percentage error")

# ============================================
# DIAGNOSING OVERFITTING vs UNDERFITTING
# ============================================

def evaluate_model(model, X_train, X_test, y_train, y_test, name):
    model.fit(X_train, y_train)
    train_r2 = r2_score(y_train, model.predict(X_train))
    test_r2  = r2_score(y_test, model.predict(X_test))
    gap = train_r2 - test_r2
    
    if train_r2 < 0.5:
        diagnosis = "UNDERFITTING (high bias)"
    elif gap > 0.2:
        diagnosis = "OVERFITTING (high variance)"
    else:
        diagnosis = "GOOD FIT"
    
    print(f"\\n{name}:")
    print(f"  Train R²: {train_r2:.3f}")
    print(f"  Test R²:  {test_r2:.3f}")
    print(f"  Gap:      {gap:.3f}")
    print(f"  Diagnosis: {diagnosis}")

# Underfitting example: too simple model
evaluate_model(LinearRegression(), X_train, X_test, y_train, y_test, "Linear Regression")

# Good fit
evaluate_model(RandomForestRegressor(n_estimators=100, random_state=42),
               X_train, X_test, y_train, y_test, "Random Forest (good)")

# Overfitting example: too complex, no regularization
evaluate_model(RandomForestRegressor(n_estimators=100, max_depth=None, min_samples_leaf=1, random_state=42),
               X_train, X_test, y_train, y_test, "Random Forest (overfit)")

# ============================================
# LEARNING CURVES — Visualize bias/variance
# ============================================

from sklearn.model_selection import learning_curve

def get_learning_curve_data(model, X, y):
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y,
        train_sizes=np.linspace(0.1, 1.0, 10),
        cv=5,
        scoring='r2',
        n_jobs=-1
    )
    return {
        "train_sizes": train_sizes,
        "train_mean": train_scores.mean(axis=1),
        "val_mean": val_scores.mean(axis=1)
    }

rf_curves = get_learning_curve_data(
    RandomForestRegressor(n_estimators=50, random_state=42), X, y
)

print("\\nLEARNING CURVE (Random Forest):")
print(f"{'Train Size':>12} {'Train R²':>10} {'Val R²':>10} {'Gap':>8}")
for size, tr, vr in zip(rf_curves['train_sizes'], rf_curves['train_mean'], rf_curves['val_mean']):
    print(f"{int(size):>12} {tr:>10.3f} {vr:>10.3f} {tr-vr:>8.3f}")

# Interpretation:
# - If both curves are low → underfitting (need more complex model)
# - If train is high, val is low → overfitting (need more data or regularization)
# - If both curves converge at high value → good fit`
    }
  ],

  resources: [
    {
      title: 'Scikit-learn Metrics Documentation',
      url: 'https://scikit-learn.org/stable/modules/model_evaluation.html',
      description: 'Complete reference for all evaluation metrics in scikit-learn'
    },
    {
      title: 'Precision and Recall - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Precision_and_recall',
      description: 'Detailed explanation of precision, recall, and F1 with examples'
    },
    {
      title: 'Understanding AUC-ROC - Towards Data Science',
      url: 'https://towardsdatascience.com/understanding-auc-roc-curve-68b2303cc9c5',
      description: 'Visual guide to understanding ROC curves and AUC'
    },
    {
      title: 'StatQuest - Confusion Matrix (YouTube)',
      url: 'https://www.youtube.com/watch?v=Kdsp6soqA7o',
      description: 'Clear visual explanation of confusion matrix and derived metrics'
    }
  ],

  questions: [
    {
      question: 'Why is accuracy a bad metric for imbalanced datasets?',
      answer: 'On a dataset with 99% negative and 1% positive, a model that always predicts negative achieves 99% accuracy but is completely useless — it never detects the positive class. Better metrics: F1 score (balances precision and recall), AUC-ROC (threshold-independent), Precision-Recall AUC (best for highly imbalanced). Always check class distribution before choosing metrics.'
    },
    {
      question: 'What is the difference between precision and recall? When do you prioritize each?',
      answer: 'Precision = TP/(TP+FP): Of all predicted positives, how many are correct? Prioritize when false positives are costly (spam filter — don\'t block real emails). Recall = TP/(TP+FN): Of all actual positives, how many did we find? Prioritize when false negatives are costly (cancer detection — don\'t miss cases). F1 balances both. Use F-beta to weight one over the other.'
    },
    {
      question: 'What is AUC-ROC and what does it measure?',
      answer: 'AUC-ROC (Area Under the ROC Curve) measures classifier performance across all classification thresholds. The ROC curve plots True Positive Rate (recall) vs False Positive Rate at different thresholds. AUC = 1.0: perfect classifier. AUC = 0.5: random (no skill). AUC = 0.0: perfectly wrong. Advantage: threshold-independent, works well for balanced datasets. For imbalanced data, prefer Precision-Recall AUC.'
    },
    {
      question: 'What is cross-validation and why is it better than a single train/test split?',
      answer: 'K-Fold cross-validation splits data into K folds, trains on K-1 folds, validates on 1 fold, repeats K times, and averages scores. Better than single split because: 1) Uses all data for both training and validation, 2) Reduces variance in performance estimate, 3) More reliable for small datasets, 4) Detects overfitting more reliably. Standard: 5-fold or 10-fold. Use StratifiedKFold for classification to maintain class ratios.'
    },
    {
      question: 'What is the difference between MAE, MSE, and RMSE?',
      answer: 'MAE (Mean Absolute Error): average of |actual - predicted|. Intuitive, robust to outliers, same units as target. MSE (Mean Squared Error): average of (actual - predicted)². Penalizes large errors more, sensitive to outliers. RMSE (Root MSE): √MSE, same units as target, most commonly reported. Use MAE when outliers should not dominate. Use RMSE when large errors are particularly bad. R² measures proportion of variance explained (1.0 = perfect).'
    },
    {
      question: 'How do you diagnose overfitting vs underfitting?',
      answer: 'Underfitting (high bias): Both training and validation accuracy are low — model too simple. Fix: more complex model, more features, more training. Overfitting (high variance): Training accuracy is high but validation accuracy is much lower — model memorized training data. Fix: more data, regularization (L1/L2), dropout, early stopping, simpler model. Learning curves: plot train/val performance vs training size — converging curves = good fit, large gap = overfitting.'
    },
    {
      question: 'What is regularization and what are the types?',
      answer: 'Regularization adds a penalty to the loss function to prevent overfitting by discouraging large weights. L1 (Lasso): adds sum of |weights| — drives some weights to exactly 0, performs feature selection. L2 (Ridge): adds sum of weights² — shrinks all weights toward 0, handles correlated features. Elastic Net: combination of L1 and L2. Dropout: randomly deactivates neurons during training (neural networks). Early stopping: stop training when validation loss stops improving.'
    }
  ]
};
