export const enhancedMLOps = {
  id: 'mlops',
  title: 'MLOps & Experiment Tracking',
  subtitle: 'MLflow, Weights & Biases, CI/CD for ML, Model Registry, and A/B Testing',
  summary: 'MLOps applies DevOps principles to machine learning — automating the ML lifecycle from experiment tracking and model versioning to CI/CD pipelines, model registry, and production monitoring. It is the engineering discipline that makes ML systems reliable, reproducible, and scalable.',
  analogy: 'MLOps is to ML what DevOps is to software. Before DevOps, deploying software was manual, error-prone, and slow. Before MLOps, deploying ML models was the same — scientists emailing model files, no versioning, no automated testing. MLOps brings the same discipline of automation, reproducibility, and reliability to the ML lifecycle.',

  explanation: `WHY MLOPS MATTERS FOR SDEs

Without MLOps:
- "It works on my machine" — model trained locally, can't reproduce
- No versioning — which model is in production? What data trained it?
- Manual deployment — scientist emails a pickle file to an engineer
- No monitoring — model silently degrades, nobody notices
- Experiment chaos — 50 experiments, no record of what worked

With MLOps:
- Every experiment tracked with parameters, metrics, artifacts
- Models versioned and stored in a registry
- Automated CI/CD pipelines test and deploy models
- Production monitoring detects drift and triggers retraining
- Full reproducibility — any experiment can be reproduced exactly

═══════════════════════════════════════════════════════════════

EXPERIMENT TRACKING

WHAT TO TRACK:
- Parameters: hyperparameters, model architecture choices, data preprocessing settings
- Metrics: training loss, validation accuracy, F1, AUC — at each epoch
- Artifacts: trained model files, plots, confusion matrices, feature importance
- Code: git commit hash, environment (requirements.txt, conda env)
- Data: dataset version, data hash, train/val/test split

MLFLOW:
Open-source MLOps platform. Four components:

1. MLflow Tracking:
   - Log parameters, metrics, artifacts to a central server
   - Compare runs side-by-side
   - Query runs programmatically

2. MLflow Projects:
   - Package ML code in a reproducible format
   - Define dependencies and entry points
   - Run on any platform

3. MLflow Models:
   - Standard format for packaging ML models
   - Supports multiple flavors (sklearn, pytorch, tensorflow, pyfunc)
   - Deploy to REST API, batch, or cloud

4. MLflow Model Registry:
   - Centralized model store with versioning
   - Lifecycle stages: Staging → Production → Archived
   - Approval workflows, annotations

WEIGHTS & BIASES (W&B):
- More feature-rich than MLflow, better visualizations
- Real-time metric streaming during training
- Hyperparameter sweep automation (Bayesian, grid, random)
- Artifact versioning with lineage tracking
- Team collaboration features
- Preferred at research labs and AI companies

NEPTUNE.AI, COMET.ML:
- Similar to W&B, different pricing/features
- Neptune: strong on metadata management
- Comet: good for NLP and computer vision

═══════════════════════════════════════════════════════════════

MODEL REGISTRY

A model registry is a centralized store for managing ML model versions throughout their lifecycle.

LIFECYCLE STAGES:
None → Staging → Production → Archived

None: Newly registered, not yet reviewed
Staging: Validated, ready for testing in staging environment
Production: Currently serving live traffic
Archived: Retired, kept for audit/rollback

KEY FEATURES:
- Version control: every model version stored with metadata
- Lineage: which experiment, data, and code produced this model
- Annotations: notes, tags, approval comments
- Transition history: who promoted/demoted the model and when
- Rollback: instantly revert to previous production model

DEPLOYMENT PATTERNS:

Blue-Green Deployment:
- Two identical environments: Blue (current production) and Green (new version)
- Switch traffic from Blue to Green atomically
- Instant rollback: switch back to Blue if issues
- Zero downtime deployment

Canary Deployment:
- Gradually route small % of traffic to new model (1% → 5% → 25% → 100%)
- Monitor metrics at each stage before increasing traffic
- Automatic rollback if metrics degrade
- Reduces blast radius of bad deployments

Shadow Mode:
- New model runs in parallel with production model
- New model's predictions are NOT served to users
- Compare new model's predictions to production offline
- Validate before any traffic switch

A/B Testing:
- Route X% of users to model A, Y% to model B
- Measure business metrics (CTR, conversion, revenue)
- Statistical significance test before declaring winner
- Randomization unit: user-level (consistent experience) vs request-level (more power)

═══════════════════════════════════════════════════════════════

CI/CD FOR ML

CONTINUOUS INTEGRATION (CI) FOR ML:
Triggered on every code commit:
1. Unit tests: test feature engineering functions, preprocessing code
2. Data validation: validate training data quality
3. Model training: train on small subset to verify pipeline works
4. Model evaluation: check metrics meet minimum thresholds
5. Integration tests: test model serving endpoint

CONTINUOUS DELIVERY (CD) FOR ML:
Triggered when CI passes:
1. Full model training on complete dataset
2. Model evaluation against champion model
3. If challenger beats champion: promote to staging
4. Staging validation: load test, latency check, integration test
5. Canary deployment to production
6. Monitor and auto-rollback if metrics degrade

RETRAINING TRIGGERS:
- Scheduled: retrain weekly/monthly regardless
- Performance-based: retrain when accuracy drops below threshold
- Data drift: retrain when input distribution shifts significantly
- Data volume: retrain when N new labeled examples available

TOOLS:
- GitHub Actions / GitLab CI: general CI/CD, good for simple ML pipelines
- Kubeflow Pipelines: Kubernetes-native ML pipelines
- MLflow Projects: reproducible ML pipeline packaging
- Metaflow (Netflix): Python-native ML workflow framework
- ZenML: MLOps framework with stack abstraction

═══════════════════════════════════════════════════════════════

PRODUCTION MONITORING

WHAT TO MONITOR:

Model Performance Metrics:
- Accuracy, F1, AUC on labeled production data (if labels available)
- Proxy metrics: CTR, conversion rate, user engagement

Data/Feature Drift:
- Monitor input feature distributions vs training baseline
- KS test, PSI (Population Stability Index) for each feature
- Alert when PSI > 0.2 (significant drift)

Prediction Drift:
- Monitor distribution of model outputs/predictions
- Sudden shift in prediction distribution = something changed

Infrastructure Metrics:
- Latency (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- GPU/CPU utilization, memory usage

MONITORING TOOLS:
- Evidently AI: open-source ML monitoring, drift detection
- WhyLabs: ML observability platform
- Arize AI: ML monitoring and explainability
- Prometheus + Grafana: infrastructure metrics
- DataDog: full-stack monitoring including ML metrics

ALERTING STRATEGY:
- P0 (immediate): model serving errors, latency > 2x baseline
- P1 (within 1 hour): accuracy drop > 5%, significant data drift
- P2 (within 1 day): gradual drift, minor performance degradation`,

  keyPoints: [
    'Experiment tracking: log parameters, metrics, artifacts, code, and data for every run',
    'MLflow: open-source tracking + projects + models + registry. W&B: richer features, better viz',
    'Model registry: version models through None → Staging → Production → Archived lifecycle',
    'Blue-green: atomic traffic switch, instant rollback. Canary: gradual rollout, reduce blast radius',
    'Shadow mode: run new model in parallel without serving — validate before any traffic switch',
    'CI/CD for ML: unit tests → data validation → training → evaluation → staging → canary → production',
    'Retraining triggers: scheduled, performance-based, data drift, or data volume',
    'Monitor: model accuracy, feature drift (PSI), prediction drift, latency, error rate'
  ],

  codeExamples: [
    {
      title: 'MLflow Experiment Tracking',
      language: 'python',
      description: 'Track ML experiments with MLflow — parameters, metrics, and model artifacts.',
      code: `# pip install mlflow scikit-learn
import mlflow
import mlflow.sklearn
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import f1_score, roc_auc_score, accuracy_score

# ============================================
# SETUP MLFLOW
# ============================================

mlflow.set_tracking_uri("sqlite:///mlflow.db")  # Local SQLite DB
mlflow.set_experiment("loan_default_prediction")

# Generate dataset
X, y = make_classification(n_samples=2000, n_features=20,
                            n_informative=15, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ============================================
# EXPERIMENT 1: LOGISTIC REGRESSION
# ============================================

with mlflow.start_run(run_name="logistic_regression_baseline"):
    # Log parameters
    params = {"C": 1.0, "max_iter": 1000, "solver": "lbfgs"}
    mlflow.log_params(params)
    mlflow.log_param("model_type", "LogisticRegression")
    mlflow.log_param("train_size", len(X_train))
    mlflow.log_param("test_size", len(X_test))

    # Train
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(**params, random_state=42))
    ])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    # Log metrics
    metrics = {
        "accuracy":  accuracy_score(y_test, y_pred),
        "f1_score":  f1_score(y_test, y_pred),
        "auc_roc":   roc_auc_score(y_test, y_prob),
    }
    mlflow.log_metrics(metrics)

    # Cross-validation metrics
    cv_f1 = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='f1')
    mlflow.log_metric("cv_f1_mean", cv_f1.mean())
    mlflow.log_metric("cv_f1_std", cv_f1.std())

    # Log model
    mlflow.sklearn.log_model(pipeline, "model",
                              registered_model_name="loan_default_model")

    print(f"LR — F1: {metrics['f1_score']:.3f}, AUC: {metrics['auc_roc']:.3f}")

# ============================================
# EXPERIMENT 2: RANDOM FOREST WITH HYPERPARAMETER SWEEP
# ============================================

for n_estimators in [50, 100, 200]:
    for max_depth in [5, 10, None]:
        with mlflow.start_run(run_name=f"rf_n{n_estimators}_d{max_depth}"):
            params = {
                "n_estimators": n_estimators,
                "max_depth": max_depth,
                "min_samples_leaf": 5,
            }
            mlflow.log_params(params)
            mlflow.log_param("model_type", "RandomForest")

            model = RandomForestClassifier(**params, random_state=42, n_jobs=-1)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]

            metrics = {
                "accuracy": accuracy_score(y_test, y_pred),
                "f1_score": f1_score(y_test, y_pred),
                "auc_roc":  roc_auc_score(y_test, y_prob),
            }
            mlflow.log_metrics(metrics)

            # Log feature importance as artifact
            importance_str = "\n".join([
                f"feature_{i}: {imp:.4f}"
                for i, imp in enumerate(model.feature_importances_)
            ])
            with open("/tmp/feature_importance.txt", "w") as f:
                f.write(importance_str)
            mlflow.log_artifact("/tmp/feature_importance.txt")

            mlflow.sklearn.log_model(model, "model")

# ============================================
# QUERY EXPERIMENTS PROGRAMMATICALLY
# ============================================

runs = mlflow.search_runs(
    experiment_names=["loan_default_prediction"],
    order_by=["metrics.f1_score DESC"]
)

print("\nTop 5 runs by F1 score:")
print(runs[['run_id', 'params.model_type', 'params.n_estimators',
            'metrics.f1_score', 'metrics.auc_roc']].head(5).to_string(index=False))

best_run = runs.iloc[0]
print(f"\nBest run: {best_run['run_id']}")
print(f"F1: {best_run['metrics.f1_score']:.3f}")
print(f"AUC: {best_run['metrics.auc_roc']:.3f}")`
    },
    {
      title: 'Model Registry & Deployment Pipeline',
      language: 'python',
      description: 'Manage model lifecycle with MLflow registry and implement canary deployment logic.',
      code: `import mlflow
from mlflow.tracking import MlflowClient
import numpy as np
from sklearn.metrics import f1_score

# ============================================
# MODEL REGISTRY OPERATIONS
# ============================================

client = MlflowClient(tracking_uri="sqlite:///mlflow.db")

def register_model(run_id: str, model_name: str, description: str = ""):
    """Register a model from a run into the model registry."""
    model_uri = f"runs:/{run_id}/model"
    model_version = mlflow.register_model(model_uri, model_name)
    
    # Add description
    client.update_model_version(
        name=model_name,
        version=model_version.version,
        description=description
    )
    print(f"Registered {model_name} v{model_version.version}")
    return model_version.version

def promote_to_staging(model_name: str, version: int):
    """Promote a model version to Staging."""
    client.transition_model_version_stage(
        name=model_name, version=version, stage="Staging",
        archive_existing_versions=False
    )
    print(f"Promoted {model_name} v{version} to Staging")

def promote_to_production(model_name: str, version: int):
    """Promote a model version to Production (archives current production)."""
    client.transition_model_version_stage(
        name=model_name, version=version, stage="Production",
        archive_existing_versions=True  # Archive current production model
    )
    print(f"Promoted {model_name} v{version} to Production")

def get_production_model(model_name: str):
    """Load the current production model."""
    model_uri = f"models:/{model_name}/Production"
    return mlflow.sklearn.load_model(model_uri)

# ============================================
# AUTOMATED CHAMPION/CHALLENGER EVALUATION
# ============================================

def evaluate_challenger(champion_model, challenger_model,
                         X_test, y_test, threshold: float = 0.02):
    """
    Compare challenger vs champion model.
    Promote challenger only if it beats champion by threshold.
    """
    champion_pred = champion_model.predict(X_test)
    challenger_pred = challenger_model.predict(X_test)

    champion_f1   = f1_score(y_test, champion_pred)
    challenger_f1 = f1_score(y_test, challenger_pred)
    improvement   = challenger_f1 - champion_f1

    print(f"\nChampion F1:   {champion_f1:.4f}")
    print(f"Challenger F1: {challenger_f1:.4f}")
    print(f"Improvement:   {improvement:+.4f}")

    if improvement >= threshold:
        print(f"✅ Challenger wins by {improvement:.4f} (>= threshold {threshold})")
        return True
    else:
        print(f"❌ Challenger does not beat champion by threshold {threshold}")
        return False

# ============================================
# CANARY DEPLOYMENT SIMULATION
# ============================================

class CanaryDeployment:
    """Gradually shift traffic from champion to challenger."""

    def __init__(self, champion, challenger, initial_canary_pct=0.05):
        self.champion = champion
        self.challenger = challenger
        self.canary_pct = initial_canary_pct
        self.champion_errors = 0
        self.challenger_errors = 0
        self.total_requests = 0

    def predict(self, X):
        """Route request to champion or challenger based on canary %."""
        self.total_requests += 1
        use_challenger = np.random.random() < self.canary_pct

        try:
            if use_challenger:
                return self.challenger.predict(X), "challenger"
            else:
                return self.champion.predict(X), "champion"
        except Exception as e:
            if use_challenger:
                self.challenger_errors += 1
            else:
                self.champion_errors += 1
            raise e

    def increase_canary(self, new_pct: float):
        """Increase canary traffic percentage."""
        print(f"Increasing canary: {self.canary_pct:.0%} → {new_pct:.0%}")
        self.canary_pct = new_pct

    def rollback(self):
        """Roll back to 0% canary traffic."""
        print("🚨 Rolling back canary deployment!")
        self.canary_pct = 0.0

    def status(self):
        champion_rate = self.champion_errors / max(self.total_requests, 1)
        challenger_rate = self.challenger_errors / max(self.total_requests, 1)
        print(f"\nCanary Status:")
        print(f"  Traffic to challenger: {self.canary_pct:.0%}")
        print(f"  Total requests: {self.total_requests}")
        print(f"  Champion error rate: {champion_rate:.2%}")
        print(f"  Challenger error rate: {challenger_rate:.2%}")

# ============================================
# PRODUCTION MONITORING
# ============================================

class ModelMonitor:
    """Monitor model performance and data drift in production."""

    def __init__(self, reference_predictions: np.ndarray):
        self.reference_preds = reference_predictions
        self.production_preds = []
        self.alerts = []

    def log_prediction(self, prediction: float):
        self.production_preds.append(prediction)

    def check_prediction_drift(self, window_size: int = 100):
        """Alert if prediction distribution has shifted."""
        if len(self.production_preds) < window_size:
            return

        from scipy import stats
        recent = np.array(self.production_preds[-window_size:])
        stat, p_value = stats.ks_2samp(self.reference_preds, recent)

        if p_value < 0.05:
            alert = f"⚠️  Prediction drift detected! KS p-value={p_value:.4f}"
            self.alerts.append(alert)
            print(alert)
            return True
        return False

    def check_error_rate(self, recent_errors: int, recent_total: int,
                          threshold: float = 0.01):
        """Alert if error rate exceeds threshold."""
        error_rate = recent_errors / max(recent_total, 1)
        if error_rate > threshold:
            alert = f"🚨 High error rate: {error_rate:.2%} > {threshold:.2%}"
            self.alerts.append(alert)
            print(alert)
            return True
        return False

print("MLOps pipeline components initialized successfully")
print("Key components: Experiment Tracking → Model Registry → CI/CD → Monitoring")`
    }
  ],

  resources: [
    {
      title: 'MLflow Documentation',
      url: 'https://mlflow.org/docs/latest/index.html',
      description: 'Official MLflow docs — tracking, projects, models, registry'
    },
    {
      title: 'Weights & Biases Documentation',
      url: 'https://docs.wandb.ai/',
      description: 'W&B docs — experiment tracking, sweeps, artifacts'
    },
    {
      title: 'Made With ML - MLOps Course',
      url: 'https://madewithml.com/',
      description: 'Free end-to-end MLOps course covering the full ML lifecycle'
    },
    {
      title: 'Evidently AI Documentation',
      url: 'https://docs.evidentlyai.com/',
      description: 'Open-source ML monitoring and drift detection'
    }
  ],

  questions: [
    {
      question: 'What is MLOps and why is it important?',
      answer: 'MLOps applies DevOps principles to ML — automating the ML lifecycle from experiment tracking to deployment and monitoring. Important because without it: no reproducibility (can\'t recreate results), no versioning (which model is in production?), manual deployment (error-prone), no monitoring (silent degradation). With MLOps: every experiment tracked, models versioned, automated CI/CD, production monitoring. Reduces time from experiment to production from weeks to hours.'
    },
    {
      question: 'What should you track in an ML experiment?',
      answer: 'Parameters: hyperparameters, model architecture, preprocessing settings. Metrics: training/validation loss, accuracy, F1, AUC — at each epoch. Artifacts: trained model file, plots, confusion matrix, feature importance. Code: git commit hash (exact code version). Environment: requirements.txt, Python version, library versions. Data: dataset version/hash, train/val/test split sizes. Without tracking all of these, experiments are not reproducible.'
    },
    {
      question: 'What is the difference between MLflow and Weights & Biases?',
      answer: 'MLflow: open-source, self-hosted, four components (tracking, projects, models, registry), good for enterprise/on-premise, integrates with most ML frameworks. W&B: cloud-based (free tier available), richer visualizations, real-time metric streaming, built-in hyperparameter sweep automation (Bayesian/grid/random), better team collaboration, preferred at research labs. Both track experiments and store models. Choose MLflow for self-hosted/enterprise, W&B for research and better UX.'
    },
    {
      question: 'What is canary deployment for ML models?',
      answer: 'Canary deployment gradually routes a small percentage of traffic to a new model version while the rest goes to the current production model. Process: 1% → 5% → 25% → 50% → 100%. At each stage, monitor metrics (accuracy, latency, error rate). If metrics degrade, automatically roll back to 0%. Benefits: reduces blast radius of bad deployments, real production validation before full rollout. Alternative: blue-green (atomic switch, instant rollback) or shadow mode (no traffic, offline comparison).'
    },
    {
      question: 'What is a model registry and what lifecycle stages does it have?',
      answer: 'A model registry is a centralized store for managing ML model versions. Lifecycle stages: None (newly registered, not reviewed) → Staging (validated, ready for testing) → Production (serving live traffic) → Archived (retired, kept for audit). Features: version control, lineage tracking (which experiment/data/code), annotations, transition history, rollback capability. MLflow Model Registry and W&B Artifacts are the most common implementations.'
    },
    {
      question: 'How do you implement CI/CD for ML?',
      answer: 'CI (on every commit): unit tests for feature engineering code, data validation checks, train on small data subset to verify pipeline, evaluate metrics meet minimum thresholds, integration tests for serving endpoint. CD (on CI pass): full training on complete dataset, champion/challenger evaluation (promote only if challenger beats champion by threshold), staging deployment with load testing, canary deployment to production, automated rollback if metrics degrade. Tools: GitHub Actions + MLflow, Kubeflow Pipelines, ZenML.'
    },
    {
      question: 'What metrics should you monitor for a production ML model?',
      answer: 'Model performance: accuracy/F1/AUC on labeled production data, proxy metrics (CTR, conversion) when labels are delayed. Data drift: KS test or PSI for each input feature vs training baseline — alert when PSI > 0.2. Prediction drift: distribution of model outputs — sudden shift indicates something changed. Infrastructure: p99 latency, throughput (RPS), error rate, GPU/CPU utilization, memory. Business metrics: revenue impact, user engagement. Set up automated alerts for P0 (immediate), P1 (1 hour), P2 (1 day) severity levels.'
    }
  ]
};
