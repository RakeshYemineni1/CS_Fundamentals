export const enhancedResponsibleAI = {
  id: 'responsible-ai',
  title: 'Responsible AI, Bias & Fairness',
  subtitle: 'Ethics, Bias Detection, Fairness Metrics, Explainability, and GDPR in AI',
  summary: 'Responsible AI is the practice of designing, building, and deploying AI systems that are fair, transparent, accountable, and safe. It covers bias in training data, fairness metrics, explainability (XAI), privacy regulations like GDPR, and governance frameworks.',
  analogy: 'Building AI without responsible AI practices is like building a bridge without safety codes. It might work most of the time, but when it fails, it fails catastrophically — and the people most likely to be hurt are those who were already vulnerable. Responsible AI is the safety code for AI systems.',

  explanation: `WHY RESPONSIBLE AI MATTERS FOR SDEs

As an SDE building AI systems, you are responsible for the downstream impact of your code. A biased hiring algorithm, a discriminatory loan model, or a privacy-violating recommendation system can cause real harm to real people — and legal liability for your company.

Companies like Google, Meta, Microsoft, and Amazon have entire teams dedicated to Responsible AI. It comes up in SDE interviews at these companies.

═══════════════════════════════════════════════════════════════

TYPES OF BIAS IN AI

1. DATA BIAS
The training data does not represent the real world fairly.

Historical Bias: Data reflects past discrimination.
Example: A hiring model trained on historical data learns that engineers are male because historically most engineers were male.

Representation Bias: Some groups are underrepresented in training data.
Example: A facial recognition model trained mostly on light-skinned faces performs poorly on dark-skinned faces.

Measurement Bias: The way data is collected introduces errors.
Example: Using arrest records as a proxy for crime — arrests reflect policing patterns, not actual crime rates.

Label Bias: Human annotators introduce their own biases.
Example: Sentiment analysis trained on data labeled by annotators from one culture may not generalize globally.

2. ALGORITHMIC BIAS
The model amplifies or introduces bias even with unbiased data.

Feedback Loops: Model predictions influence future data.
Example: A recommendation system shows users content they already like → they engage more → model shows more of the same → filter bubble.

Proxy Variables: Model uses seemingly neutral features that correlate with protected attributes.
Example: Zip code correlates with race due to historical redlining → using zip code in a loan model is effectively using race.

3. DEPLOYMENT BIAS
The model is used in a context different from where it was trained.
Example: A model trained on US medical data deployed in India.

═══════════════════════════════════════════════════════════════

FAIRNESS METRICS

There is no single definition of fairness — different metrics capture different notions.

DEMOGRAPHIC PARITY (Statistical Parity):
P(ŷ=1 | group=A) = P(ŷ=1 | group=B)
Positive prediction rate should be equal across groups.
Problem: ignores actual differences in base rates.

EQUAL OPPORTUNITY:
P(ŷ=1 | y=1, group=A) = P(ŷ=1 | y=1, group=B)
True positive rate (recall) should be equal across groups.
Best for: high-stakes decisions where missing a positive is costly (loan approval, hiring).

EQUALIZED ODDS:
Both TPR and FPR should be equal across groups.
Stricter than equal opportunity.

INDIVIDUAL FAIRNESS:
Similar individuals should receive similar predictions.
"Treat like cases alike."

CALIBRATION:
P(y=1 | ŷ=p, group=A) = P(y=1 | ŷ=p, group=B)
Predicted probabilities should be equally accurate across groups.

IMPOSSIBILITY THEOREM:
You cannot simultaneously satisfy demographic parity, equal opportunity, and calibration (except in trivial cases). You must choose which fairness notion matters most for your use case.

═══════════════════════════════════════════════════════════════

EXPLAINABILITY (XAI — Explainable AI)

WHY EXPLAINABILITY MATTERS:
- Legal requirements (GDPR Article 22: right to explanation)
- Debugging model failures
- Building user trust
- Detecting bias
- Regulatory compliance (finance, healthcare)

TYPES OF EXPLANATIONS:

Global Explanations: How does the model work overall?
- Feature importance (which features matter most)
- Partial dependence plots (how does output change with one feature)

Local Explanations: Why did the model make THIS specific prediction?
- LIME: perturb the input, fit a local linear model
- SHAP: game-theory-based attribution of each feature's contribution

KEY METHODS:

SHAP (SHapley Additive exPlanations):
- Based on Shapley values from cooperative game theory
- Each feature gets a contribution score for a specific prediction
- Positive SHAP = pushed prediction higher, Negative = pushed lower
- Model-agnostic, works for any ML model
- Gold standard for local explanations

LIME (Local Interpretable Model-agnostic Explanations):
- Perturb the input slightly, observe how prediction changes
- Fit a simple linear model locally around the prediction
- Explains individual predictions in human-readable terms

Attention Visualization:
- For Transformers: visualize which tokens the model attended to
- Useful but not always faithful to actual model reasoning

Saliency Maps:
- For CNNs: highlight which pixels influenced the prediction most
- Grad-CAM: gradient-weighted class activation mapping

═══════════════════════════════════════════════════════════════

PRIVACY IN AI

GDPR (General Data Protection Regulation) — EU:
- Article 22: Right not to be subject to automated decision-making
- Right to explanation for automated decisions
- Data minimization: only collect what you need
- Right to erasure ("right to be forgotten")
- Data portability

CCPA (California Consumer Privacy Act) — US equivalent

PRIVACY-PRESERVING ML TECHNIQUES:

Differential Privacy:
- Add calibrated noise to data or model outputs
- Mathematically guarantees individual privacy
- Used by Apple, Google for collecting usage statistics
- Trade-off: privacy vs accuracy

Federated Learning:
- Train model on distributed data without centralizing it
- Data stays on user devices, only model updates are shared
- Used by Google for Gboard keyboard predictions
- Reduces privacy risk but adds communication overhead

Data Anonymization:
- Remove or hash PII before training
- k-anonymity: each record is indistinguishable from k-1 others
- Limitation: re-identification attacks are possible

Model Inversion Attacks:
- Attacker queries the model to reconstruct training data
- Defense: differential privacy, output perturbation

Membership Inference Attacks:
- Attacker determines if a specific record was in the training data
- Defense: differential privacy, regularization

═══════════════════════════════════════════════════════════════

AI GOVERNANCE FRAMEWORKS

EU AI ACT (2024):
- Risk-based classification: Unacceptable → High → Limited → Minimal
- Unacceptable: social scoring, real-time biometric surveillance — BANNED
- High risk: hiring, credit, medical, law enforcement — strict requirements
- Requires transparency, human oversight, bias testing for high-risk AI

NIST AI RMF (Risk Management Framework):
- Govern, Map, Measure, Manage
- Framework for organizations to manage AI risks

RESPONSIBLE AI PRINCIPLES (common across companies):
1. Fairness: AI should treat all people equitably
2. Reliability & Safety: AI should perform reliably and safely
3. Privacy & Security: AI should respect privacy
4. Inclusiveness: AI should empower everyone
5. Transparency: AI should be understandable
6. Accountability: People should be accountable for AI`,

  keyPoints: [
    'Bias types: data bias (historical, representation, measurement), algorithmic bias, deployment bias',
    'Proxy variables: neutral features that correlate with protected attributes (zip code ↔ race)',
    'Fairness metrics: demographic parity, equal opportunity, equalized odds — cannot satisfy all simultaneously',
    'SHAP: Shapley-value-based feature attribution — gold standard for local explanations',
    'LIME: perturb input, fit local linear model — explains individual predictions',
    'GDPR Article 22: right to explanation for automated decisions affecting individuals',
    'Differential privacy: add calibrated noise to guarantee individual privacy mathematically',
    'Federated learning: train on distributed data without centralizing it — used by Google'
  ],

  codeExamples: [
    {
      title: 'Bias Detection and Fairness Metrics',
      language: 'python',
      description: 'Detect bias in a model and compute fairness metrics across demographic groups.',
      code: `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.preprocessing import StandardScaler

# ============================================
# SIMULATE BIASED LOAN APPROVAL DATASET
# ============================================

np.random.seed(42)
n = 2000

# Features
income = np.random.normal(50000, 20000, n).clip(10000, 150000)
credit_score = np.random.normal(650, 100, n).clip(300, 850)
group = np.random.choice(['A', 'B'], n, p=[0.6, 0.4])  # Protected attribute

# INTRODUCE BIAS: Group B has lower approval rate due to historical bias in training data
base_approval = (income > 45000).astype(float) * 0.4 + (credit_score > 620).astype(float) * 0.4
group_bias = np.where(group == 'B', -0.2, 0.1)  # Unfair penalty for group B
approval_prob = np.clip(base_approval + group_bias + np.random.normal(0, 0.1, n), 0, 1)
approved = (np.random.random(n) < approval_prob).astype(int)

df = pd.DataFrame({
    'income': income,
    'credit_score': credit_score,
    'group': group,
    'approved': approved
})

print("Dataset Statistics:")
print(df.groupby('group')['approved'].agg(['mean', 'count']).round(3))

# ============================================
# TRAIN MODEL (without group feature — but bias persists via proxies)
# ============================================

X = df[['income', 'credit_score']]  # No group feature
y = df['approved']

X_train, X_test, y_train, y_test, g_train, g_test = train_test_split(
    X, y, df['group'], test_size=0.3, random_state=42
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = LogisticRegression(random_state=42)
model.fit(X_train_s, y_train)
y_pred = model.predict(X_test_s)

# ============================================
# FAIRNESS METRICS
# ============================================

def fairness_report(y_true, y_pred, groups):
    report = {}
    for group in groups.unique():
        mask = groups == group
        yt = y_true[mask]
        yp = y_pred[mask]
        
        tn, fp, fn, tp = confusion_matrix(yt, yp, labels=[0, 1]).ravel()
        
        approval_rate = yp.mean()                                    # Demographic parity
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0               # Equal opportunity
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0               # Equalized odds (FPR)
        
        report[group] = {
            'n': mask.sum(),
            'approval_rate': round(approval_rate, 3),
            'true_positive_rate': round(tpr, 3),
            'false_positive_rate': round(fpr, 3),
        }
    return report

test_groups = g_test.reset_index(drop=True)
y_test_reset = y_test.reset_index(drop=True)
y_pred_series = pd.Series(y_pred)

report = fairness_report(y_test_reset, y_pred_series, test_groups)

print("\\nFAIRNESS REPORT:")
print(f"{'Metric':<25} {'Group A':>10} {'Group B':>10} {'Disparity':>12}")
print("-" * 60)

metrics = ['approval_rate', 'true_positive_rate', 'false_positive_rate']
for metric in metrics:
    a_val = report['A'][metric]
    b_val = report['B'][metric]
    disparity = abs(a_val - b_val)
    flag = " ⚠️ BIASED" if disparity > 0.05 else " ✅ FAIR"
    print(f"{metric:<25} {a_val:>10.3f} {b_val:>10.3f} {disparity:>12.3f}{flag}")

# ============================================
# DEMOGRAPHIC PARITY CHECK
# ============================================

approval_A = report['A']['approval_rate']
approval_B = report['B']['approval_rate']
print(f"\\nDemographic Parity:")
print(f"  Group A approval rate: {approval_A:.1%}")
print(f"  Group B approval rate: {approval_B:.1%}")
print(f"  Disparate Impact Ratio: {min(approval_A, approval_B) / max(approval_A, approval_B):.3f}")
print(f"  (< 0.8 = potential discrimination under 80% rule)")`
    },
    {
      title: 'SHAP Explainability',
      language: 'python',
      description: 'Use SHAP to explain individual model predictions and detect feature-level bias.',
      code: `# pip install shap scikit-learn
import shap
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# ============================================
# TRAIN A MODEL
# ============================================

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'age':          np.random.randint(22, 65, n),
    'income':       np.random.normal(60000, 25000, n).clip(15000, 200000),
    'credit_score': np.random.normal(660, 90, n).clip(300, 850),
    'debt_ratio':   np.random.uniform(0.1, 0.8, n),
    'employment_years': np.random.randint(0, 30, n),
})

# Target: loan approved
df['approved'] = (
    (df['income'] > 50000) &
    (df['credit_score'] > 640) &
    (df['debt_ratio'] < 0.5)
).astype(int)

X = df.drop('approved', axis=1)
y = df['approved']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ============================================
# SHAP EXPLANATIONS
# ============================================

# Create SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# shap_values[1] = SHAP values for class 1 (approved)
shap_approved = shap_values[1]

# ============================================
# GLOBAL EXPLANATION: Feature Importance
# ============================================

mean_abs_shap = np.abs(shap_approved).mean(axis=0)
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'mean_abs_shap': mean_abs_shap
}).sort_values('mean_abs_shap', ascending=False)

print("GLOBAL FEATURE IMPORTANCE (SHAP):")
print(f"{'Feature':<20} {'Mean |SHAP|':>12} {'Impact'}")
for _, row in feature_importance.iterrows():
    bar = '█' * int(row['mean_abs_shap'] * 100)
    print(f"{row['feature']:<20} {row['mean_abs_shap']:>12.4f} {bar}")

# ============================================
# LOCAL EXPLANATION: Why was THIS person approved/denied?
# ============================================

def explain_prediction(idx):
    person = X_test.iloc[idx]
    prediction = model.predict([person])[0]
    probability = model.predict_proba([person])[0][1]
    shap_vals = shap_approved[idx]
    
    print(f"\\nPerson #{idx} — {'APPROVED' if prediction == 1 else 'DENIED'} ({probability:.1%} probability)")
    print(f"{'Feature':<20} {'Value':>12} {'SHAP':>10} {'Direction'}")
    print("-" * 55)
    
    for feature, value, shap_val in zip(X.columns, person, shap_vals):
        direction = "↑ pushes approval" if shap_val > 0 else "↓ pushes denial"
        print(f"{feature:<20} {value:>12.1f} {shap_val:>10.4f}  {direction}")

explain_prediction(0)
explain_prediction(5)

# ============================================
# BIAS DETECTION VIA SHAP
# ============================================

# Check if any feature has unexpectedly high SHAP values
# (could indicate proxy discrimination)
print("\\nBIAS CHECK — Top contributing features per decision:")
print("If 'age' or demographic proxies have high SHAP, investigate for bias.")
for feature, importance in zip(feature_importance['feature'], feature_importance['mean_abs_shap']):
    if importance > 0.05:
        print(f"  ⚠️  {feature}: {importance:.4f} — review for potential bias")`
    }
  ],

  resources: [
    {
      title: 'SHAP Documentation',
      url: 'https://shap.readthedocs.io/',
      description: 'Official SHAP library docs with tutorials and examples'
    },
    {
      title: 'Fairlearn - Microsoft',
      url: 'https://fairlearn.org/',
      description: 'Open-source toolkit for assessing and improving fairness in AI'
    },
    {
      title: 'EU AI Act Summary',
      url: 'https://artificialintelligenceact.eu/',
      description: 'Plain-language summary of the EU AI Act requirements'
    },
    {
      title: 'Google Responsible AI Practices',
      url: 'https://ai.google/responsibility/responsible-ai-practices/',
      description: 'Google\'s framework and practices for responsible AI development'
    }
  ],

  questions: [
    {
      question: 'What are the main types of bias in AI systems?',
      answer: 'Data bias: Historical bias (data reflects past discrimination), Representation bias (groups underrepresented in training data), Measurement bias (data collection method introduces errors), Label bias (human annotators introduce their own biases). Algorithmic bias: Feedback loops (predictions influence future data), Proxy variables (neutral features correlating with protected attributes like zip code ↔ race). Deployment bias: model used in a different context than it was trained on.'
    },
    {
      question: 'What is the difference between demographic parity and equal opportunity?',
      answer: 'Demographic parity: positive prediction rate should be equal across groups — P(ŷ=1|group=A) = P(ŷ=1|group=B). Ignores actual differences in base rates. Equal opportunity: true positive rate (recall) should be equal across groups — P(ŷ=1|y=1,group=A) = P(ŷ=1|y=1,group=B). Better for high-stakes decisions where missing a positive is costly. Key insight: you cannot simultaneously satisfy all fairness metrics (Impossibility Theorem) — choose based on use case.'
    },
    {
      question: 'What is SHAP and how does it work?',
      answer: 'SHAP (SHapley Additive exPlanations) assigns each feature a contribution score for a specific prediction, based on Shapley values from cooperative game theory. For each prediction, SHAP computes how much each feature pushed the prediction above or below the baseline. Positive SHAP = feature pushed prediction higher. Negative SHAP = pushed lower. Model-agnostic, works for any ML model. Gold standard for local explanations. Also provides global feature importance via mean absolute SHAP values.'
    },
    {
      question: 'What is GDPR and how does it affect AI systems?',
      answer: 'GDPR (General Data Protection Regulation) is EU law governing personal data. Key AI implications: Article 22 — right not to be subject to solely automated decisions with significant effects (must provide human review option). Right to explanation — users can request why an automated decision was made. Data minimization — only collect data necessary for the purpose. Right to erasure — users can request their data be deleted. Requires SDEs to build explainability, audit trails, and data deletion capabilities into AI systems.'
    },
    {
      question: 'What is differential privacy?',
      answer: 'Differential privacy adds carefully calibrated mathematical noise to data or model outputs to guarantee that the presence or absence of any individual record cannot be determined from the output. Formally: P(M(D) ∈ S) ≤ e^ε × P(M(D\') ∈ S) where D and D\' differ by one record. ε (epsilon) controls privacy-accuracy tradeoff: smaller ε = more privacy, less accuracy. Used by Apple (iOS analytics), Google (Chrome), US Census Bureau. Key for GDPR compliance.'
    },
    {
      question: 'What is federated learning and when is it used?',
      answer: 'Federated learning trains a model across many devices/servers without centralizing the data. Each device trains on local data, sends only model updates (gradients) to a central server, which aggregates them. Data never leaves the device. Used by: Google (Gboard next-word prediction), Apple (Siri improvements), healthcare (hospitals train on patient data without sharing it). Trade-offs: communication overhead, harder to debug, non-IID data distribution challenges.'
    },
    {
      question: 'What is the EU AI Act and what does it mean for developers?',
      answer: 'The EU AI Act (2024) classifies AI systems by risk: Unacceptable risk (banned): social scoring, real-time biometric surveillance in public. High risk (strict requirements): hiring, credit scoring, medical devices, law enforcement — must have human oversight, bias testing, transparency, audit logs. Limited risk: chatbots must disclose they are AI. Minimal risk: spam filters, AI in games. For SDEs: high-risk AI systems require documentation, bias audits, human oversight mechanisms, and incident reporting.'
    }
  ]
};
