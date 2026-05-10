export const enhancedAIOverview = {
  id: 'ai-overview',
  title: 'Artificial Intelligence Overview',
  subtitle: 'Understanding AI, Its Types, and Real-World Applications',
  summary: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think, learn, and problem-solve. It encompasses a broad range of techniques from rule-based systems to modern deep learning models.',
  analogy: 'Think of AI like teaching a child. You show them thousands of examples (training data), they learn patterns (model training), and eventually they can answer questions they have never seen before (inference). The smarter the teaching method, the better the child performs.',

  explanation: `WHAT IS ARTIFICIAL INTELLIGENCE?

Artificial Intelligence is the field of computer science focused on building systems that can perform tasks that typically require human intelligence — such as understanding language, recognizing images, making decisions, and solving problems.

THE AI HIERARCHY

AI is the broadest term. Inside AI lives Machine Learning (ML). Inside ML lives Deep Learning (DL). Inside DL lives modern Large Language Models (LLMs).

AI → Machine Learning → Deep Learning → LLMs (GPT, Gemini, Claude)

TYPES OF AI

1. NARROW AI (Weak AI)
Designed for a specific task. This is what exists today.
- Examples: ChatGPT (text), DALL-E (images), AlphaGo (chess/go), Siri (voice)
- Cannot generalize beyond its trained domain

2. GENERAL AI (Strong AI / AGI)
Can perform any intellectual task a human can. Does NOT exist yet.
- Hypothetical: a machine that can learn, reason, and adapt like a human

3. SUPER AI
Surpasses human intelligence in all domains. Theoretical / future concept.

BRANCHES OF AI

1. Machine Learning — Learning from data without explicit programming
2. Natural Language Processing (NLP) — Understanding and generating human language
3. Computer Vision — Understanding images and videos
4. Robotics — Physical machines that perceive and act
5. Expert Systems — Rule-based systems that mimic expert decision-making
6. Speech Recognition — Converting spoken language to text
7. Reinforcement Learning — Learning through rewards and penalties

HOW AI WORKS (HIGH LEVEL)

Step 1: Collect Data — Gather large amounts of relevant data
Step 2: Prepare Data — Clean, label, and preprocess the data
Step 3: Choose Model — Select an appropriate algorithm or architecture
Step 4: Train Model — Feed data to the model so it learns patterns
Step 5: Evaluate — Test the model on unseen data
Step 6: Deploy — Integrate the model into a real application
Step 7: Monitor — Track performance and retrain as needed

REAL-WORLD AI APPLICATIONS

Healthcare: Disease diagnosis, drug discovery, medical imaging
Finance: Fraud detection, algorithmic trading, credit scoring
Transportation: Self-driving cars, route optimization, traffic prediction
Retail: Recommendation systems, demand forecasting, chatbots
Entertainment: Content recommendation (Netflix, YouTube), game AI
Security: Facial recognition, intrusion detection, threat analysis

AI vs HUMAN INTELLIGENCE

AI Strengths: Speed, consistency, scale, pattern recognition in large data
AI Weaknesses: Common sense reasoning, creativity, emotional understanding, generalization
Human Strengths: Context understanding, creativity, ethics, adaptability
Human Weaknesses: Speed at scale, fatigue, inconsistency

HISTORY OF AI (KEY MILESTONES)

1950 — Alan Turing proposes the Turing Test
1956 — Term "Artificial Intelligence" coined at Dartmouth Conference
1980s — Expert Systems boom
1997 — IBM Deep Blue beats chess world champion Kasparov
2012 — AlexNet wins ImageNet, deep learning revolution begins
2017 — Transformer architecture introduced ("Attention is All You Need")
2020 — GPT-3 released, LLM era begins
2022 — ChatGPT launches, AI goes mainstream
2023+ — GPT-4, Gemini, Claude, multimodal AI explosion`,

  keyPoints: [
    'AI is the simulation of human intelligence in machines',
    'Narrow AI (task-specific) exists today; AGI (general) does not yet exist',
    'AI hierarchy: AI → Machine Learning → Deep Learning → LLMs',
    'Main branches: ML, NLP, Computer Vision, Robotics, Expert Systems',
    'AI pipeline: Data → Preprocessing → Model → Training → Evaluation → Deployment',
    'Transformer architecture (2017) revolutionized modern AI',
    'AI excels at pattern recognition at scale; struggles with common sense',
    'Real-world applications span healthcare, finance, retail, security, and more'
  ],

  codeExamples: [
    {
      title: 'Simple Rule-Based AI vs ML-Based AI',
      language: 'python',
      description: 'Contrast between old-school rule-based AI and modern ML-based AI for spam detection.',
      code: `# ============================================
# RULE-BASED AI (Traditional Approach)
# ============================================

# Manually written rules by a human expert
def is_spam_rule_based(email_text):
    spam_keywords = ["free money", "click here", "winner", "prize", "urgent"]
    email_lower = email_text.lower()
    
    for keyword in spam_keywords:
        if keyword in email_lower:
            return True  # Spam
    return False  # Not spam

# Works only for known patterns — brittle and limited
print(is_spam_rule_based("You are a WINNER! Claim your free money now!"))  # True
print(is_spam_rule_based("Meeting at 3pm tomorrow"))  # False


# ============================================
# ML-BASED AI (Modern Approach)
# ============================================

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Training data — model LEARNS from examples
emails = [
    "You are a winner! Claim your free money now!",
    "Urgent: Click here to get your prize",
    "Meeting at 3pm tomorrow",
    "Project deadline is Friday",
    "Free offer! Limited time only!",
    "Can we reschedule the call?",
]
labels = [1, 1, 0, 0, 1, 0]  # 1 = spam, 0 = not spam

# Step 1: Convert text to numbers (feature extraction)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

# Step 2: Train the model
model = MultinomialNB()
model.fit(X, labels)

# Step 3: Predict on new unseen email
new_email = ["Congratulations! You won a free vacation!"]
X_new = vectorizer.transform(new_email)
prediction = model.predict(X_new)

print(f"Spam prediction: {'Spam' if prediction[0] == 1 else 'Not Spam'}")
# Output: Spam prediction: Spam

# KEY DIFFERENCE:
# Rule-based: Human writes rules manually
# ML-based: Model learns rules automatically from data`
    },
    {
      title: 'AI Types Demonstration',
      language: 'python',
      description: 'Simple examples showing Narrow AI concepts in Python.',
      code: `# ============================================
# NARROW AI EXAMPLES
# ============================================

# 1. Image Classification (Computer Vision AI)
# Using a pre-trained model to classify images
# (Conceptual — requires tensorflow/keras)

"""
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
import numpy as np

model = MobileNetV2(weights='imagenet')

def classify_image(image_array):
    img = preprocess_input(image_array)
    img = np.expand_dims(img, axis=0)
    predictions = model.predict(img)
    return decode_predictions(predictions, top=3)[0]
"""

# 2. Text Classification (NLP AI)
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Sentiment analysis — is the review positive or negative?
reviews = [
    "This product is amazing, I love it!",
    "Terrible quality, waste of money",
    "Great value for the price",
    "Worst purchase I ever made",
    "Highly recommend this to everyone",
    "Do not buy this, it broke in a week",
]
sentiments = [1, 0, 1, 0, 1, 0]  # 1=positive, 0=negative

# Build a pipeline (vectorize + classify)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression())
])

pipeline.fit(reviews, sentiments)

# Test on new reviews
test_reviews = [
    "Absolutely fantastic product!",
    "Very disappointed with this purchase",
]

predictions = pipeline.predict(test_reviews)
for review, pred in zip(test_reviews, predictions):
    sentiment = "Positive" if pred == 1 else "Negative"
    print(f"Review: '{review}' → {sentiment}")

# Output:
# Review: 'Absolutely fantastic product!' → Positive
# Review: 'Very disappointed with this purchase' → Negative`
    }
  ],

  resources: [
    {
      title: 'AI For Everyone - Andrew Ng (Coursera)',
      url: 'https://www.coursera.org/learn/ai-for-everyone',
      description: 'Non-technical introduction to AI concepts and applications'
    },
    {
      title: 'What is Artificial Intelligence? - IBM',
      url: 'https://www.ibm.com/topics/artificial-intelligence',
      description: 'Comprehensive overview of AI from IBM'
    },
    {
      title: 'Artificial Intelligence - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/artificial-intelligence/',
      description: 'AI fundamentals with examples and interview prep'
    },
    {
      title: '3Blue1Brown - Neural Networks Series (YouTube)',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
      description: 'Visual and intuitive explanation of how neural networks work'
    }
  ],

  questions: [
    {
      question: 'What is Artificial Intelligence? How is it different from Machine Learning?',
      answer: 'AI is the broad field of building machines that simulate human intelligence. ML is a subset of AI where machines learn from data without being explicitly programmed. All ML is AI, but not all AI is ML. Rule-based expert systems are AI but not ML. Deep Learning is a subset of ML using neural networks with many layers.'
    },
    {
      question: 'What are the types of AI based on capability?',
      answer: '1) Narrow AI (Weak AI): Designed for a specific task — exists today (ChatGPT, Siri, AlphaGo). 2) General AI (AGI): Can perform any intellectual task a human can — does not exist yet. 3) Super AI: Surpasses human intelligence in all domains — theoretical. All current AI systems are Narrow AI.'
    },
    {
      question: 'What is the difference between AI, ML, Deep Learning, and LLMs?',
      answer: 'They are nested subsets: AI is the broadest field. ML is a subset of AI that learns from data. Deep Learning is a subset of ML using multi-layered neural networks. LLMs (Large Language Models like GPT, Claude) are a specific type of deep learning model trained on massive text data using the Transformer architecture.'
    },
    {
      question: 'What are the main branches of AI?',
      answer: '1) Machine Learning — learning from data, 2) Natural Language Processing — understanding text/speech, 3) Computer Vision — understanding images/video, 4) Robotics — physical agents that perceive and act, 5) Expert Systems — rule-based decision making, 6) Speech Recognition — speech to text, 7) Reinforcement Learning — learning through rewards.'
    },
    {
      question: 'What is the Turing Test?',
      answer: 'Proposed by Alan Turing in 1950, the Turing Test evaluates whether a machine can exhibit intelligent behavior indistinguishable from a human. A human judge converses with both a human and a machine via text. If the judge cannot reliably tell which is the machine, the machine is said to have passed the test. It is a philosophical benchmark, not a technical metric.'
    },
    {
      question: 'What are the real-world applications of AI?',
      answer: 'Healthcare: disease diagnosis, drug discovery. Finance: fraud detection, algorithmic trading. Transportation: self-driving cars, route optimization. Retail: recommendation systems, demand forecasting. Entertainment: Netflix/YouTube recommendations. Security: facial recognition, threat detection. Manufacturing: predictive maintenance, quality control. Education: personalized learning, automated grading.'
    },
    {
      question: 'What are the limitations of current AI systems?',
      answer: 'Current AI limitations: 1) Lack of common sense reasoning, 2) Cannot generalize beyond training distribution, 3) Requires massive amounts of labeled data, 4) Black-box nature (lack of explainability), 5) Bias from training data, 6) High computational cost, 7) No true understanding — pattern matching only, 8) Struggles with out-of-distribution scenarios, 9) Cannot learn continuously without retraining.'
    },
    {
      question: 'What was the significance of the Transformer architecture?',
      answer: 'The Transformer architecture (introduced in "Attention is All You Need", 2017) revolutionized AI by replacing sequential RNNs with a self-attention mechanism that processes all tokens in parallel. This enabled training on much larger datasets, led to BERT, GPT, and all modern LLMs. It is the foundation of the current AI revolution in NLP, vision (ViT), and multimodal models.'
    }
  ]
};
