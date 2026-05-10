export const enhancedDataEngineeringAI = {
  id: 'data-engineering-ai',
  title: 'Data Engineering for AI',
  subtitle: 'Feature Stores, Data Pipelines, Streaming vs Batch, and Data Quality for ML',
  summary: 'Data engineering for AI is the discipline of building reliable, scalable pipelines that collect, transform, store, and serve data for machine learning systems. It covers feature stores, streaming vs batch processing, data quality, and the infrastructure that keeps ML models fed with fresh, clean data.',
  analogy: 'Data engineering for AI is like the supply chain for a restaurant. The chef (ML model) is only as good as the ingredients (data) they receive. A bad supply chain — stale ingredients, wrong quantities, inconsistent quality — produces bad food no matter how talented the chef. Data engineering ensures the right data arrives fresh, clean, and on time.',

  explanation: `WHY DATA ENGINEERING IS CRITICAL FOR AI

80% of an ML project is data work. Models are only as good as the data they are trained on and served with. SDEs at AI companies spend most of their time building and maintaining data infrastructure, not training models.

Common data problems that kill ML projects:
- Training-serving skew: features computed differently at training vs inference
- Data leakage: future information leaks into training features
- Stale features: model served with outdated feature values
- Data quality issues: nulls, outliers, schema changes break pipelines
- Feature duplication: 10 teams compute the same feature 10 different ways

═══════════════════════════════════════════════════════════════

FEATURE STORES

WHAT IS A FEATURE STORE?
A feature store is a centralized repository for storing, managing, and serving ML features. It solves the problem of feature duplication, training-serving skew, and feature reuse across teams.

COMPONENTS:

Offline Store:
- Historical feature values for model training
- Typically a data warehouse or data lake (S3 + Parquet, BigQuery, Snowflake)
- Supports point-in-time correct queries (no data leakage)

Online Store:
- Latest feature values for real-time inference
- Low-latency key-value store (Redis, DynamoDB, Cassandra)
- Latency: <10ms for feature retrieval

Feature Registry:
- Catalog of all features with metadata (owner, description, schema, lineage)
- Prevents duplication, enables discovery and reuse

Feature Pipeline:
- Computes features from raw data
- Writes to both offline and online stores
- Can be batch (daily/hourly) or streaming (real-time)

POINT-IN-TIME CORRECT QUERIES:
Critical for preventing data leakage in training.
When creating training data for a model that predicts at time T, you must use only features available at time T — not future values.

Example: Predicting loan default at time T.
Wrong: use account balance from T+30 days (future leakage)
Right: use account balance from T-1 day (point-in-time correct)

POPULAR FEATURE STORES:
- Feast (open-source): most popular, supports offline + online
- Tecton: managed, enterprise-grade
- Hopsworks: open-source, supports streaming features
- AWS SageMaker Feature Store: managed, AWS-native
- Vertex AI Feature Store: managed, GCP-native

TRAINING-SERVING SKEW:
The #1 silent killer of ML models in production.
Occurs when features are computed differently during training vs serving.

Example:
Training: age = (current_date - birth_date).days / 365
Serving: age = user_profile.age (integer, updated annually)
Result: model trained on precise age, served with rounded age → performance degradation

Solution: use the same feature computation code for both training and serving (feature store enforces this).

═══════════════════════════════════════════════════════════════

BATCH vs STREAMING DATA PIPELINES

BATCH PROCESSING:
- Process large volumes of data at scheduled intervals (hourly, daily)
- High throughput, high latency (minutes to hours)
- Tools: Apache Spark, dbt, Airflow, AWS Glue
- Use for: model training, historical feature computation, reporting

STREAMING PROCESSING:
- Process data continuously as it arrives
- Low latency (milliseconds to seconds)
- Tools: Apache Kafka, Apache Flink, Apache Spark Streaming, AWS Kinesis
- Use for: real-time features (fraud detection, recommendations), event-driven pipelines

LAMBDA ARCHITECTURE:
Combines batch and streaming:
- Batch layer: accurate, complete historical processing (Spark)
- Speed layer: real-time approximate processing (Flink/Kafka)
- Serving layer: merges results from both layers
- Complexity: maintaining two codebases for same logic

KAPPA ARCHITECTURE:
Streaming-only, simpler than Lambda:
- All processing done in streaming layer
- Replay historical data through streaming pipeline for reprocessing
- Simpler but requires streaming system to handle batch-scale loads

═══════════════════════════════════════════════════════════════

DATA QUALITY FOR ML

DATA QUALITY DIMENSIONS:
- Completeness: are all required fields present? (null rate)
- Accuracy: are values correct? (range checks, format validation)
- Consistency: same entity has consistent values across sources
- Timeliness: is data fresh enough? (staleness checks)
- Uniqueness: no duplicate records
- Schema validity: correct data types, no unexpected columns

DATA VALIDATION TOOLS:
- Great Expectations: define expectations, validate data, generate reports
- dbt tests: SQL-based data quality tests in transformation pipelines
- Pandera: pandas DataFrame validation
- TFX Data Validation: TensorFlow Extended data validation

COMMON ML DATA ISSUES:

Distribution Shift:
- Training data distribution ≠ production data distribution
- Causes model performance degradation over time
- Detection: monitor feature distributions (KS test, PSI)
- Fix: retrain on recent data, use domain adaptation

Label Leakage:
- Features that directly or indirectly encode the label
- Example: using "refund_requested" to predict "customer_churn" — refund IS churn
- Detection: suspiciously high model accuracy, feature importance analysis

Class Imbalance:
- Rare events (fraud, disease) are underrepresented
- Model learns to predict majority class
- Fix: oversampling (SMOTE), undersampling, class weights, threshold tuning

Missing Data Patterns:
- MCAR (Missing Completely At Random): safe to impute
- MAR (Missing At Random): depends on other observed variables
- MNAR (Missing Not At Random): missingness encodes information — dangerous to impute

═══════════════════════════════════════════════════════════════

DATA PIPELINES FOR ML

ETL vs ELT:
- ETL (Extract, Transform, Load): transform before loading — traditional
- ELT (Extract, Load, Transform): load raw, transform in warehouse — modern (dbt)

ORCHESTRATION TOOLS:
- Apache Airflow: most popular, Python-based DAGs, rich ecosystem
- Prefect: modern Airflow alternative, better error handling
- Dagster: asset-based orchestration, built for data/ML
- Kubeflow Pipelines: ML-specific, Kubernetes-native

DATA VERSIONING:
- DVC (Data Version Control): Git for data and models
- Delta Lake: ACID transactions on data lakes, time travel
- Apache Iceberg: open table format with schema evolution and time travel
- LakeFS: Git-like branching for data lakes

DATA LINEAGE:
Track where data came from and how it was transformed.
- OpenLineage: open standard for lineage metadata
- Apache Atlas: data governance and lineage
- Why it matters: debug data quality issues, understand model inputs, compliance

MONITORING DATA PIPELINES:
- SLA monitoring: alert if pipeline doesn't complete by expected time
- Data freshness: alert if data is older than threshold
- Row count checks: alert if output has unexpected number of rows
- Schema drift: alert if input schema changes unexpectedly`,

  keyPoints: [
    'Feature store: centralized repository for ML features — prevents duplication and training-serving skew',
    'Training-serving skew: features computed differently at training vs inference — #1 silent model killer',
    'Point-in-time correct queries: use only features available at prediction time — prevents data leakage',
    'Batch: high throughput, high latency (Spark, Airflow). Streaming: low latency (Kafka, Flink)',
    'Lambda architecture: batch + streaming layers. Kappa: streaming-only, simpler',
    'Data quality: completeness, accuracy, consistency, timeliness, uniqueness, schema validity',
    'Distribution shift: training data distribution ≠ production — monitor with KS test, PSI',
    'DVC for data versioning, Delta Lake/Iceberg for ACID transactions on data lakes'
  ],

  codeExamples: [
    {
      title: 'Feature Store Implementation',
      language: 'python',
      description: 'Build a simple feature store with offline and online stores.',
      code: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import redis  # pip install redis

# ============================================
# SIMPLE FEATURE STORE IMPLEMENTATION
# ============================================

class OfflineStore:
    """Stores historical feature values for training."""

    def __init__(self):
        self.data = {}  # In production: S3 + Parquet / BigQuery

    def write(self, feature_group: str, df: pd.DataFrame):
        """Write features with timestamps."""
        if feature_group not in self.data:
            self.data[feature_group] = []
        self.data[feature_group].append(df.copy())
        print(f"Offline store: wrote {len(df)} rows to '{feature_group}'")

    def get_historical_features(self, entity_df: pd.DataFrame,
                                 feature_group: str, features: list) -> pd.DataFrame:
        """
        Point-in-time correct feature retrieval.
        For each row in entity_df (with timestamp), get feature values
        that were available AT that timestamp — no future leakage.
        """
        if feature_group not in self.data:
            raise ValueError(f"Feature group '{feature_group}' not found")

        all_data = pd.concat(self.data[feature_group])
        result_rows = []

        for _, entity_row in entity_df.iterrows():
            entity_id = entity_row['entity_id']
            event_time = entity_row['event_timestamp']

            # Get feature values available AT event_time (point-in-time correct)
            entity_features = all_data[
                (all_data['entity_id'] == entity_id) &
                (all_data['timestamp'] <= event_time)
            ].sort_values('timestamp').tail(1)

            if len(entity_features) > 0:
                row = entity_row.to_dict()
                for feat in features:
                    row[feat] = entity_features.iloc[0].get(feat, np.nan)
                result_rows.append(row)

        return pd.DataFrame(result_rows)


class OnlineStore:
    """Stores latest feature values for real-time inference."""

    def __init__(self):
        # In production: Redis or DynamoDB
        self._store = {}

    def write(self, feature_group: str, entity_id: str, features: dict):
        key = f"{feature_group}:{entity_id}"
        self._store[key] = {**features, 'updated_at': datetime.now().isoformat()}

    def read(self, feature_group: str, entity_id: str, feature_names: list) -> dict:
        key = f"{feature_group}:{entity_id}"
        data = self._store.get(key, {})
        return {f: data.get(f) for f in feature_names}


class FeatureStore:
    """Unified feature store with offline and online components."""

    def __init__(self):
        self.offline = OfflineStore()
        self.online  = OnlineStore()
        self.registry = {}  # Feature metadata

    def register_feature_group(self, name: str, entity: str,
                                features: list, description: str = ""):
        self.registry[name] = {
            'entity': entity, 'features': features,
            'description': description, 'created_at': datetime.now().isoformat()
        }
        print(f"Registered feature group: '{name}' with features: {features}")

    def ingest(self, feature_group: str, df: pd.DataFrame):
        """Ingest features into both offline and online stores."""
        # Write to offline store (historical)
        self.offline.write(feature_group, df)

        # Write latest values to online store
        for _, row in df.iterrows():
            features = {col: row[col] for col in df.columns
                       if col not in ['entity_id', 'timestamp']}
            self.online.write(feature_group, str(row['entity_id']), features)

    def get_training_features(self, entity_df: pd.DataFrame,
                               feature_group: str) -> pd.DataFrame:
        """Get point-in-time correct features for training."""
        features = self.registry[feature_group]['features']
        return self.offline.get_historical_features(entity_df, feature_group, features)

    def get_online_features(self, feature_group: str,
                             entity_id: str) -> dict:
        """Get latest features for real-time inference."""
        features = self.registry[feature_group]['features']
        return self.online.read(feature_group, entity_id, features)


# ============================================
# USAGE EXAMPLE: USER FEATURES
# ============================================

fs = FeatureStore()

# Register feature group
fs.register_feature_group(
    name='user_activity',
    entity='user_id',
    features=['total_purchases', 'avg_order_value', 'days_since_last_purchase'],
    description='User purchase behavior features'
)

# Simulate feature data over time
base_date = datetime(2024, 1, 1)
feature_data = []
for user_id in range(1, 6):
    for day_offset in [0, 7, 14, 21]:
        feature_data.append({
            'entity_id': user_id,
            'timestamp': base_date + timedelta(days=day_offset),
            'total_purchases': np.random.randint(1, 50),
            'avg_order_value': round(np.random.uniform(20, 200), 2),
            'days_since_last_purchase': np.random.randint(0, 30),
        })

fs.ingest('user_activity', pd.DataFrame(feature_data))

# Training: point-in-time correct feature retrieval
training_entities = pd.DataFrame([
    {'entity_id': 1, 'event_timestamp': base_date + timedelta(days=10)},
    {'entity_id': 2, 'event_timestamp': base_date + timedelta(days=5)},
    {'entity_id': 3, 'event_timestamp': base_date + timedelta(days=20)},
])

training_features = fs.get_training_features(training_entities, 'user_activity')
print("\nTraining features (point-in-time correct):")
print(training_features.to_string(index=False))

# Inference: get latest features for real-time prediction
print("\nOnline features for user 1 (latest values):")
online_feats = fs.get_online_features('user_activity', '1')
print(online_feats)`
    },
    {
      title: 'Data Quality Validation Pipeline',
      language: 'python',
      description: 'Build a data quality validation system for ML pipelines.',
      code: `import pandas as pd
import numpy as np
from scipy import stats
from dataclasses import dataclass, field
from typing import List, Optional

# ============================================
# DATA QUALITY VALIDATION FRAMEWORK
# ============================================

@dataclass
class ValidationResult:
    check_name: str
    passed: bool
    message: str
    severity: str = "ERROR"  # ERROR, WARNING, INFO

class DataValidator:
    """Validate ML training and serving data."""

    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.results: List[ValidationResult] = []

    def check_null_rate(self, column: str, max_null_rate: float = 0.05):
        null_rate = self.df[column].isnull().mean()
        passed = null_rate <= max_null_rate
        self.results.append(ValidationResult(
            check_name=f"null_rate:{column}",
            passed=passed,
            message=f"Null rate {null_rate:.1%} {'<=' if passed else '>'} threshold {max_null_rate:.1%}",
            severity="ERROR" if not passed else "INFO"
        ))
        return self

    def check_value_range(self, column: str, min_val=None, max_val=None):
        series = self.df[column].dropna()
        violations = 0
        if min_val is not None:
            violations += (series < min_val).sum()
        if max_val is not None:
            violations += (series > max_val).sum()
        passed = violations == 0
        self.results.append(ValidationResult(
            check_name=f"value_range:{column}",
            passed=passed,
            message=f"{violations} values outside [{min_val}, {max_val}]",
            severity="ERROR" if not passed else "INFO"
        ))
        return self

    def check_no_duplicates(self, subset: Optional[List[str]] = None):
        n_dupes = self.df.duplicated(subset=subset).sum()
        passed = n_dupes == 0
        self.results.append(ValidationResult(
            check_name="no_duplicates",
            passed=passed,
            message=f"{n_dupes} duplicate rows found",
            severity="WARNING" if not passed else "INFO"
        ))
        return self

    def check_schema(self, expected_schema: dict):
        """Validate column types match expected schema."""
        for col, expected_type in expected_schema.items():
            if col not in self.df.columns:
                self.results.append(ValidationResult(
                    check_name=f"schema:{col}",
                    passed=False,
                    message=f"Column '{col}' missing from dataset",
                    severity="ERROR"
                ))
            else:
                actual_type = str(self.df[col].dtype)
                passed = expected_type in actual_type
                self.results.append(ValidationResult(
                    check_name=f"schema:{col}",
                    passed=passed,
                    message=f"Column '{col}': expected {expected_type}, got {actual_type}",
                    severity="ERROR" if not passed else "INFO"
                ))
        return self

    def check_distribution_shift(self, column: str, reference_df: pd.DataFrame,
                                  p_value_threshold: float = 0.05):
        """Detect if distribution has shifted from reference (training) data."""
        current = self.df[column].dropna()
        reference = reference_df[column].dropna()
        stat, p_value = stats.ks_2samp(reference, current)
        passed = p_value >= p_value_threshold
        self.results.append(ValidationResult(
            check_name=f"distribution_shift:{column}",
            passed=passed,
            message=f"KS test p-value={p_value:.4f} ({'no shift' if passed else 'SHIFT DETECTED'})",
            severity="WARNING" if not passed else "INFO"
        ))
        return self

    def check_row_count(self, min_rows: int, max_rows: Optional[int] = None):
        n = len(self.df)
        passed = n >= min_rows and (max_rows is None or n <= max_rows)
        self.results.append(ValidationResult(
            check_name="row_count",
            passed=passed,
            message=f"Row count {n} {'within' if passed else 'outside'} expected range [{min_rows}, {max_rows or 'inf'}]",
            severity="ERROR" if not passed else "INFO"
        ))
        return self

    def report(self) -> bool:
        """Print validation report. Returns True if all checks passed."""
        errors = [r for r in self.results if not r.passed and r.severity == "ERROR"]
        warnings = [r for r in self.results if not r.passed and r.severity == "WARNING"]
        passed_checks = [r for r in self.results if r.passed]

        print(f"\nDATA VALIDATION REPORT")
        print(f"{'='*60}")
        print(f"Total checks: {len(self.results)} | Passed: {len(passed_checks)} | Errors: {len(errors)} | Warnings: {len(warnings)}")

        if errors:
            print(f"\n❌ ERRORS ({len(errors)}):")
            for r in errors:
                print(f"  [{r.check_name}] {r.message}")

        if warnings:
            print(f"\n⚠️  WARNINGS ({len(warnings)}):")
            for r in warnings:
                print(f"  [{r.check_name}] {r.message}")

        if not errors and not warnings:
            print("\n✅ All checks passed!")

        return len(errors) == 0


# ============================================
# USAGE: VALIDATE ML TRAINING DATA
# ============================================

np.random.seed(42)
n = 1000

# Simulate training data with some issues
df = pd.DataFrame({
    'user_id':    range(n),
    'age':        np.random.randint(18, 80, n),
    'income':     np.random.normal(60000, 20000, n),
    'credit_score': np.random.randint(300, 850, n),
    'label':      np.random.randint(0, 2, n),
})

# Introduce issues
df.loc[np.random.choice(n, 60), 'income'] = np.nan   # 6% nulls
df.loc[np.random.choice(n, 5), 'age'] = -5            # Invalid ages
df = pd.concat([df, df.iloc[:10]])                     # Duplicate rows

# Reference data (training distribution)
reference_df = pd.DataFrame({'income': np.random.normal(60000, 20000, 1000)})

# Validate
validator = DataValidator(df)
all_passed = (
    validator
    .check_row_count(min_rows=900)
    .check_null_rate('income', max_null_rate=0.05)
    .check_null_rate('age', max_null_rate=0.01)
    .check_value_range('age', min_val=0, max_val=120)
    .check_value_range('credit_score', min_val=300, max_val=850)
    .check_no_duplicates(subset=['user_id'])
    .check_schema({'user_id': 'int', 'age': 'int', 'income': 'float', 'label': 'int'})
    .check_distribution_shift('income', reference_df)
    .report()
)

print(f"\nPipeline should {'PROCEED' if all_passed else 'HALT — fix errors before proceeding'}")`
    }
  ],

  resources: [
    {
      title: 'Feast Feature Store Documentation',
      url: 'https://docs.feast.dev/',
      description: 'Official docs for Feast — the most popular open-source feature store'
    },
    {
      title: 'Great Expectations Documentation',
      url: 'https://docs.greatexpectations.io/',
      description: 'Data quality validation framework for ML pipelines'
    },
    {
      title: 'The Data Engineering Cookbook',
      url: 'https://github.com/andkret/Cookbook',
      description: 'Free comprehensive guide to data engineering concepts'
    },
    {
      title: 'dbt Documentation',
      url: 'https://docs.getdbt.com/',
      description: 'Transform data in your warehouse with dbt — essential for ML data pipelines'
    }
  ],

  questions: [
    {
      question: 'What is a feature store and why is it needed?',
      answer: 'A feature store is a centralized repository for storing, managing, and serving ML features. Needed because: 1) Prevents feature duplication — 10 teams computing the same feature 10 ways. 2) Prevents training-serving skew — same computation code for training and inference. 3) Enables point-in-time correct queries — no data leakage. 4) Feature reuse — discover and reuse features across teams. Components: offline store (historical, for training), online store (latest values, for inference), feature registry (metadata catalog).'
    },
    {
      question: 'What is training-serving skew and how do you prevent it?',
      answer: 'Training-serving skew occurs when features are computed differently during training vs serving, causing model performance to degrade in production. Example: training uses precise age from birth date, serving uses integer age from profile — different distributions. Prevention: 1) Use a feature store that enforces the same computation code for both. 2) Log features used at serving time and compare to training distribution. 3) Shadow mode testing — run new feature pipeline in parallel before switching. 4) Feature monitoring — alert when serving feature distribution diverges from training.'
    },
    {
      question: 'What is point-in-time correct feature retrieval?',
      answer: 'Point-in-time correct retrieval ensures that when creating training data for a prediction at time T, you only use feature values that were available at time T — not future values. Example: predicting loan default at time T — must use account balance from T-1, not T+30. Without this, you get data leakage — model learns from future information it won\'t have at inference time, leading to unrealistically high training accuracy and poor production performance. Feature stores implement this via temporal joins.'
    },
    {
      question: 'What is the difference between batch and streaming data pipelines?',
      answer: 'Batch: processes large volumes at scheduled intervals (hourly/daily). High throughput, high latency (minutes to hours). Tools: Spark, Airflow, dbt. Use for: model training, historical features, reporting. Streaming: processes data continuously as it arrives. Low latency (milliseconds to seconds). Tools: Kafka, Flink, Kinesis. Use for: real-time features (fraud detection), event-driven pipelines. Lambda architecture combines both. Kappa architecture uses streaming only — simpler but harder to scale for batch workloads.'
    },
    {
      question: 'What is distribution shift and how do you detect it?',
      answer: 'Distribution shift: the statistical distribution of input features in production differs from training data, causing model performance to degrade. Types: covariate shift (input distribution changes), concept drift (relationship between input and output changes). Detection: Kolmogorov-Smirnov (KS) test compares distributions statistically, Population Stability Index (PSI) measures distribution change, monitor feature means/std/percentiles over time. Response: alert when PSI > 0.2, retrain on recent data, investigate root cause (seasonality, data pipeline change, real-world change).'
    },
    {
      question: 'What is data leakage in ML and how do you prevent it?',
      answer: 'Data leakage: training data contains information that would not be available at prediction time, causing unrealistically high training accuracy and poor production performance. Types: 1) Target leakage — feature directly encodes the label (e.g., "refund_requested" predicts "churn"). 2) Temporal leakage — future data used in training (e.g., using T+30 features to predict at T). 3) Train-test contamination — preprocessing (scaling, imputation) fit on full dataset including test set. Prevention: point-in-time correct feature retrieval, strict temporal train/test splits, fit preprocessors only on training data.'
    },
    {
      question: 'What is DVC and why is data versioning important for ML?',
      answer: 'DVC (Data Version Control) is Git for data and models. Tracks large files (datasets, models) in Git-compatible way, storing actual data in remote storage (S3, GCS) and metadata in Git. Important because: 1) Reproducibility — reproduce any experiment with exact data and code. 2) Collaboration — team members use same dataset versions. 3) Auditability — know exactly what data trained each model version. 4) Rollback — revert to previous data version if quality issues found. Alternative: Delta Lake/Apache Iceberg provide ACID transactions and time travel on data lakes.'
    }
  ]
};
