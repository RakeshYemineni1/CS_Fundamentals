export const enhancedAIPipeline = {
  id: 'ai-pipeline',
  title: 'AI / ML Pipeline',
  subtitle: 'End-to-End Process of Building and Deploying ML Models',
  summary: 'An AI/ML pipeline is the complete end-to-end workflow for building, training, evaluating, and deploying machine learning models. It covers every step from raw data collection to a live production system.',
  analogy: 'An AI pipeline is like a factory assembly line. Raw materials (data) come in, go through multiple processing stations (cleaning, feature engineering, training), quality checks (evaluation), and finally a finished product (deployed model) comes out the other end — ready to serve customers (make predictions).',

  explanation: `WHAT IS AN AI/ML PIPELINE?

An AI/ML pipeline is a structured sequence of steps that transforms raw data into a deployed, production-ready machine learning model. Every real-world ML project follows this pipeline, though the complexity varies.

THE 8 STAGES OF AN AI/ML PIPELINE

═══════════════════════════════════════════════════════════════

STAGE 1: PROBLEM DEFINITION

Before writing any code, define:
- What problem are you solving?
- Is it classification, regression, clustering, or generation?
- What does success look like? (metric: accuracy, F1, RMSE?)
- What data is available?
- What are the constraints? (latency, cost, interpretability)

Example: "Predict whether a customer will churn in the next 30 days" → Binary classification, metric = F1 score

═══════════════════════════════════════════════════════════════

STAGE 2: DATA COLLECTION

Sources of data:
- Databases (SQL, NoSQL)
- APIs and web scraping
- Public datasets (Kaggle, UCI, HuggingFace)
- Sensors and IoT devices
- User interactions and logs
- Third-party data providers

Key considerations:
- Volume: Enough data to train a good model?
- Quality: Is the data accurate and reliable?
- Diversity: Does it represent all real-world scenarios?
- Labeling: Is labeled data available or does it need annotation?

═══════════════════════════════════════════════════════════════

STAGE 3: EXPLORATORY DATA ANALYSIS (EDA)

Understand your data before modeling:
- Shape and size of dataset
- Data types (numerical, categorical, text, image)
- Missing values and their distribution
- Statistical summaries (mean, median, std, min, max)
- Distributions and outliers
- Correlations between features
- Class imbalance (for classification)

Tools: Pandas, Matplotlib, Seaborn, Plotly

═══════════════════════════════════════════════════════════════

STAGE 4: DATA PREPROCESSING

Transform raw data into model-ready format:

a) Handling Missing Values:
   - Drop rows/columns with too many missing values
   - Impute with mean/median/mode
   - Use model-based imputation (KNN imputer)

b) Encoding Categorical Variables:
   - Label Encoding: cat → 0, dog → 1
   - One-Hot Encoding: [1,0,0], [0,1,0], [0,0,1]
   - Target Encoding: replace category with mean target value

c) Feature Scaling:
   - Standardization (Z-score): mean=0, std=1 → for SVM, neural nets
   - Min-Max Normalization: scale to [0,1] → for KNN, neural nets
   - Log Transform: for skewed distributions

d) Handling Outliers:
   - Remove, cap, or transform extreme values

e) Train/Validation/Test Split:
   - Typical: 70% train, 15% validation, 15% test
   - Stratified split for imbalanced classes

═══════════════════════════════════════════════════════════════

STAGE 5: FEATURE ENGINEERING

Create new features that help the model learn better:
- Combine existing features (e.g., BMI = weight/height²)
- Extract from datetime (hour, day of week, month)
- Text features (TF-IDF, word embeddings)
- Interaction features (feature_A × feature_B)
- Polynomial features for non-linear relationships

Feature Selection:
- Remove irrelevant or redundant features
- Methods: correlation analysis, feature importance, PCA, LASSO

═══════════════════════════════════════════════════════════════

STAGE 6: MODEL TRAINING

Select and train the model:

a) Choose algorithm based on:
   - Problem type (classification/regression/clustering)
   - Data size and dimensionality
   - Interpretability requirements
   - Latency constraints

b) Training process:
   - Feed training data to the model
   - Model adjusts internal parameters to minimize loss
   - Use cross-validation to get reliable performance estimates

c) Hyperparameter Tuning:
   - Grid Search: try all combinations
   - Random Search: try random combinations
   - Bayesian Optimization: smart search using past results

═══════════════════════════════════════════════════════════════

STAGE 7: MODEL EVALUATION

Measure how well the model performs:

Classification Metrics:
- Accuracy: correct predictions / total predictions
- Precision: TP / (TP + FP) — how many predicted positives are correct
- Recall: TP / (TP + FN) — how many actual positives were found
- F1 Score: harmonic mean of precision and recall
- AUC-ROC: area under the ROC curve

Regression Metrics:
- MAE: Mean Absolute Error
- MSE: Mean Squared Error
- RMSE: Root Mean Squared Error
- R²: proportion of variance explained

Validation Techniques:
- Hold-out validation
- K-Fold Cross Validation
- Stratified K-Fold (for imbalanced data)

═══════════════════════════════════════════════════════════════

STAGE 8: DEPLOYMENT & MONITORING

Deploy the model to production:

a) Deployment Options:
   - REST API (Flask, FastAPI) — most common
   - Batch prediction (scheduled jobs)
   - Edge deployment (mobile, IoT)
   - Cloud ML services (AWS SageMaker, GCP Vertex AI, Azure ML)

b) Model Serving:
   - Containerize with Docker
   - Orchestrate with Kubernetes
   - Use model registries (MLflow, W&B)

c) Monitoring:
   - Track prediction accuracy over time
   - Detect data drift (input distribution changes)
   - Detect concept drift (relationship between input/output changes)
   - Set up alerts and automated retraining

MLOPS — OPERATIONALIZING ML

MLOps is the practice of applying DevOps principles to ML:
- Version control for data, code, and models
- CI/CD pipelines for automated training and deployment
- Experiment tracking (MLflow, Weights & Biases)
- Feature stores (Feast, Tecton)
- Model registries and A/B testing`,

  keyPoints: [
    'Stage 1: Problem definition — define metric, type, and constraints',
    'Stage 2: Data collection — volume, quality, diversity, and labeling',
    'Stage 3: EDA — understand distributions, missing values, correlations',
    'Stage 4: Preprocessing — handle missing values, encode, scale, split',
    'Stage 5: Feature engineering — create and select informative features',
    'Stage 6: Model training — choose algorithm, train, tune hyperparameters',
    'Stage 7: Evaluation — accuracy, F1, RMSE, cross-validation',
    'Stage 8: Deployment — REST API, Docker, monitoring, data drift detection'
  ],

  codeExamples: [
    {
      title: 'Complete ML Pipeline — End to End',
      language: 'python',
      description: 'A full ML pipeline from raw data to trained model using scikit-learn Pipeline.',
      code: `import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report

# ============================================
# STAGE 1: SIMULATE RAW DATA
# ============================================

np.random.seed(42)
n = 500

data = pd.DataFrame({
    'age':        np.random.randint(18, 70, n),
    'income':     np.random.randint(20000, 150000, n),
    'tenure':     np.random.randint(0, 10, n),
    'plan':       np.random.choice(['basic', 'standard', 'premium'], n),
    'support_calls': np.random.randint(0, 20, n),
})

# Introduce some missing values
data.loc[np.random.choice(n, 30), 'income'] = np.nan
data.loc[np.random.choice(n, 20), 'age'] = np.nan

# Target: churn (1 = churned, 0 = stayed)
# Higher support calls + lower tenure = more likely to churn
churn_prob = (data['support_calls'] / 20 + (10 - data['tenure']) / 10) / 2
data['churn'] = (np.random.random(n) < churn_prob).astype(int)

print("Dataset shape:", data.shape)
print("Churn rate:", data['churn'].mean().round(2))
print(data.head())

# ============================================
# STAGE 2: SPLIT DATA
# ============================================

X = data.drop('churn', axis=1)
y = data['churn']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ============================================
# STAGE 3: BUILD PREPROCESSING PIPELINE
# ============================================

# Numerical features: impute missing + scale
numerical_features = ['age', 'income', 'tenure', 'support_calls']
numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Categorical features: impute missing + one-hot encode
categorical_features = ['plan']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

# Combine both transformers
preprocessor = ColumnTransformer(transformers=[
    ('num', numerical_transformer, numerical_features),
    ('cat', categorical_transformer, categorical_features)
])

# ============================================
# STAGE 4: BUILD FULL PIPELINE (PREPROCESS + MODEL)
# ============================================

full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# ============================================
# STAGE 5: TRAIN
# ============================================

full_pipeline.fit(X_train, y_train)

# ============================================
# STAGE 6: EVALUATE
# ============================================

# Cross-validation score
cv_scores = cross_val_score(full_pipeline, X_train, y_train, cv=5, scoring='f1')
print(f"\\nCross-Val F1: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# Test set evaluation
y_pred = full_pipeline.predict(X_test)
print("\\nTest Set Report:")
print(classification_report(y_test, y_pred, target_names=['Stayed', 'Churned']))

# ============================================
# STAGE 7: PREDICT ON NEW DATA
# ============================================

new_customer = pd.DataFrame({
    'age': [35],
    'income': [55000],
    'tenure': [1],
    'plan': ['basic'],
    'support_calls': [15]
})

prediction = full_pipeline.predict(new_customer)
probability = full_pipeline.predict_proba(new_customer)

print(f"\\nNew Customer Prediction: {'Will Churn' if prediction[0] == 1 else 'Will Stay'}")
print(f"Churn Probability: {probability[0][1]:.1%}")`
    },
    {
      title: 'Model Deployment as REST API',
      language: 'python',
      description: 'Deploy a trained ML model as a REST API using FastAPI — the most common deployment pattern.',
      code: `# ============================================
# STAGE 8: DEPLOYMENT — FastAPI REST API
# ============================================
# Install: pip install fastapi uvicorn scikit-learn joblib

import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

# --- Save the trained model (run once after training) ---
# joblib.dump(full_pipeline, 'churn_model.pkl')

# --- Load the model ---
# model = joblib.load('churn_model.pkl')

# --- Define the API ---
app = FastAPI(title="Churn Prediction API")

# Input schema — validates incoming request data
class CustomerData(BaseModel):
    age: float
    income: float
    tenure: int
    plan: str
    support_calls: int

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "churn_predictor_v1"}

# Prediction endpoint
@app.post("/predict")
def predict_churn(customer: CustomerData):
    # Convert input to DataFrame
    import pandas as pd
    input_data = pd.DataFrame([customer.dict()])
    
    # Make prediction
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]
    
    return {
        "will_churn": bool(prediction),
        "churn_probability": round(float(probability), 4),
        "risk_level": "High" if probability > 0.7 else "Medium" if probability > 0.4 else "Low"
    }

# Run with: uvicorn app:app --reload
# Test with: curl -X POST http://localhost:8000/predict \\
#   -H "Content-Type: application/json" \\
#   -d '{"age":35,"income":55000,"tenure":1,"plan":"basic","support_calls":15}'

# ============================================
# MONITORING — Detect Data Drift
# ============================================

from scipy import stats

def detect_data_drift(reference_data, new_data, threshold=0.05):
    """
    Detect if new incoming data has drifted from training distribution.
    Uses Kolmogorov-Smirnov test for numerical features.
    """
    drift_report = {}
    
    for column in reference_data.select_dtypes(include=[np.number]).columns:
        stat, p_value = stats.ks_2samp(
            reference_data[column].dropna(),
            new_data[column].dropna()
        )
        drift_detected = p_value < threshold
        drift_report[column] = {
            "p_value": round(p_value, 4),
            "drift_detected": drift_detected
        }
        if drift_detected:
            print(f"⚠️  DRIFT DETECTED in '{column}' (p={p_value:.4f})")
    
    return drift_report`
    }
  ],

  resources: [
    {
      title: 'MLOps Fundamentals - Google Cloud',
      url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning',
      description: 'Google\'s guide to MLOps and ML pipeline automation'
    },
    {
      title: 'Full Stack Deep Learning',
      url: 'https://fullstackdeeplearning.com/',
      description: 'End-to-end ML engineering from data to deployment'
    },
    {
      title: 'MLflow Documentation',
      url: 'https://mlflow.org/docs/latest/index.html',
      description: 'Open-source platform for ML lifecycle management'
    },
    {
      title: 'FastAPI for ML Deployment',
      url: 'https://fastapi.tiangolo.com/',
      description: 'Modern, fast web framework for building ML APIs'
    }
  ],

  questions: [
    {
      question: 'What are the stages of an ML pipeline?',
      answer: '1) Problem Definition — define task, metric, constraints. 2) Data Collection — gather relevant data. 3) EDA — explore distributions, missing values, correlations. 4) Preprocessing — clean, encode, scale, split. 5) Feature Engineering — create/select informative features. 6) Model Training — choose algorithm, train, tune hyperparameters. 7) Evaluation — measure performance on test set. 8) Deployment — serve via API, monitor for drift.'
    },
    {
      question: 'What is data preprocessing and why is it important?',
      answer: 'Data preprocessing transforms raw data into a format suitable for ML models. Steps include: handling missing values (imputation or removal), encoding categorical variables (one-hot, label encoding), feature scaling (standardization, normalization), handling outliers, and splitting into train/validation/test sets. Most ML algorithms cannot handle raw messy data — preprocessing directly impacts model performance.'
    },
    {
      question: 'What is feature engineering?',
      answer: 'Feature engineering is the process of creating new informative features from existing data to improve model performance. Examples: extracting hour/day from timestamps, computing BMI from height and weight, creating interaction features (A × B), applying log transforms to skewed data, generating TF-IDF features from text. Good feature engineering often matters more than algorithm choice.'
    },
    {
      question: 'What is cross-validation and why use it?',
      answer: 'Cross-validation is a technique to reliably estimate model performance. In K-Fold CV, data is split into K folds; the model trains on K-1 folds and validates on the remaining fold, repeated K times. Final score is the average. Benefits: uses all data for both training and validation, reduces variance in performance estimate, helps detect overfitting. Standard practice: 5-fold or 10-fold CV.'
    },
    {
      question: 'What is data drift and concept drift?',
      answer: 'Data drift (covariate shift): The distribution of input features changes over time (e.g., user demographics shift). Concept drift: The relationship between inputs and outputs changes (e.g., what predicts churn changes). Both cause model performance to degrade in production. Detection: monitor feature distributions (KS test, PSI), track prediction distributions, monitor model metrics. Solution: retrain on fresh data.'
    },
    {
      question: 'What is MLOps?',
      answer: 'MLOps (Machine Learning Operations) applies DevOps principles to ML systems. It covers: version control for data, code, and models; CI/CD pipelines for automated training and deployment; experiment tracking (MLflow, W&B); feature stores; model registries; A/B testing; monitoring for drift. Goal: make ML systems reliable, reproducible, and scalable in production. Key tools: MLflow, Kubeflow, SageMaker, Vertex AI.'
    },
    {
      question: 'How do you handle class imbalance in a dataset?',
      answer: 'Class imbalance (e.g., 95% negative, 5% positive) causes models to predict the majority class. Solutions: 1) Resampling — oversample minority (SMOTE) or undersample majority. 2) Class weights — penalize misclassification of minority class more. 3) Use appropriate metrics — F1, AUC-ROC instead of accuracy. 4) Threshold tuning — adjust decision threshold. 5) Ensemble methods — balanced random forest. Never evaluate with accuracy alone on imbalanced data.'
    },
    {
      question: 'What are the common ways to deploy an ML model?',
      answer: '1) REST API (Flask/FastAPI) — most common, model serves predictions via HTTP. 2) Batch prediction — scheduled jobs process large datasets offline. 3) Embedded/Edge — model runs on device (mobile, IoT) using TensorFlow Lite or ONNX. 4) Cloud ML services — AWS SageMaker, GCP Vertex AI, Azure ML handle infrastructure. 5) Streaming — real-time predictions on data streams (Kafka + ML). Choice depends on latency, scale, and cost requirements.'
    }
  ]
};
