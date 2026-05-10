export const enhancedMultimodalAI = {
  id: 'multimodal-ai',
  title: 'Multimodal AI',
  subtitle: 'Vision-Language Models, CLIP, GPT-4V, Image Generation, and Multimodal Pipelines',
  summary: 'Multimodal AI systems process and generate multiple types of data — text, images, audio, and video — within a single model. They power image captioning, visual question answering, text-to-image generation, and document understanding.',
  analogy: 'A unimodal AI is like a person who can only read — they understand text perfectly but are blind to images. A multimodal AI is like a person with all senses — they can look at a photo and describe it, read a document with diagrams, or generate an image from a description. The world is multimodal; AI is catching up.',

  explanation: `WHAT IS MULTIMODAL AI?

Multimodal AI processes and generates multiple modalities — text, images, audio, video, code — within a single unified model. Unlike unimodal models (text-only LLMs, image-only CNNs), multimodal models understand relationships between different types of data.

MODALITIES:
- Text: natural language, code, structured data
- Images: photographs, diagrams, charts, screenshots
- Audio: speech, music, environmental sounds
- Video: sequences of frames + audio
- Documents: PDFs with mixed text and images

TYPES OF MULTIMODAL TASKS:
- Image → Text: image captioning, visual question answering (VQA), OCR
- Text → Image: text-to-image generation (DALL-E, Stable Diffusion, Midjourney)
- Image + Text → Text: visual Q&A, document understanding, chart analysis
- Text → Audio: text-to-speech (TTS)
- Audio → Text: speech recognition (ASR)
- Video → Text: video captioning, action recognition

═══════════════════════════════════════════════════════════════

CLIP (Contrastive Language-Image Pre-training)

Introduced by OpenAI in 2021. One of the most influential multimodal models.

ARCHITECTURE:
- Two encoders: image encoder (ViT or ResNet) + text encoder (Transformer)
- Both encoders project to the same embedding space
- Image and its caption have similar embeddings; unrelated pairs have dissimilar embeddings

TRAINING (Contrastive):
- Trained on 400M (image, text) pairs from the internet
- For a batch of N pairs, create N×N matrix of similarities
- Maximize similarity of N correct (image, text) pairs
- Minimize similarity of N²-N incorrect pairs
- No labels needed — self-supervised on internet data

CAPABILITIES:
- Zero-shot image classification: "Is this a cat or a dog?" without training on those classes
- Image-text similarity: find images matching a text query
- Semantic image search: search image database with natural language
- Foundation for text-to-image models (DALL-E, Stable Diffusion use CLIP for text encoding)

ZERO-SHOT CLASSIFICATION:
1. Encode image → image_embedding
2. Encode candidate labels as text: "a photo of a cat", "a photo of a dog"
3. Find label with highest cosine similarity to image_embedding
4. No task-specific training needed!

═══════════════════════════════════════════════════════════════

VISION-LANGUAGE MODELS (VLMs)

Models that understand both images and text together.

GPT-4V (Vision):
- GPT-4 with vision capabilities
- Can analyze images, answer questions about them, read text in images
- Use cases: document analysis, chart interpretation, code screenshot debugging

Claude 3 (Anthropic):
- Strong vision capabilities, 200K context window
- Excellent at document understanding, diagram analysis

Gemini (Google):
- Natively multimodal from the ground up
- Processes text, images, audio, video, code
- Gemini 1.5 Pro: 1M token context, can process 1 hour of video

LLaVA (Large Language and Vision Assistant):
- Open-source VLM
- Connects CLIP image encoder to LLaMA language model
- Architecture: CLIP encoder → projection layer → LLaMA

ARCHITECTURE PATTERN (most VLMs):
1. Image Encoder: extract visual features (CLIP ViT, or custom)
2. Projection Layer: map image features to language model's embedding space
3. Language Model: process combined image + text tokens
4. Output: text generation conditioned on both image and text

IMAGE TOKENS:
Images are converted to a sequence of tokens before being fed to the language model.
- ViT (Vision Transformer): divide image into 16×16 patches, each patch = one token
- 224×224 image → 196 patches → 196 image tokens
- High-resolution images → more tokens → more context used

═══════════════════════════════════════════════════════════════

TEXT-TO-IMAGE GENERATION

DALL-E 3 (OpenAI):
- Generates high-quality images from text descriptions
- Uses diffusion model architecture
- Integrated with ChatGPT

Stable Diffusion (Stability AI):
- Open-source text-to-image model
- Latent Diffusion Model: operates in compressed latent space
- Can run locally on consumer GPUs
- Highly customizable with LoRA fine-tuning

Midjourney:
- Highest quality aesthetic images
- Discord-based interface
- Proprietary model

HOW DIFFUSION MODELS WORK:
1. Forward process: gradually add Gaussian noise to an image over T steps
2. Reverse process: train a neural network to predict and remove noise step by step
3. Generation: start from pure noise, iteratively denoise guided by text prompt
4. Text conditioning: CLIP text encoder guides the denoising toward the prompt

LATENT DIFFUSION (Stable Diffusion):
- Instead of diffusing in pixel space (expensive), diffuse in compressed latent space
- VAE (Variational Autoencoder) compresses image to latent representation
- Diffusion happens in latent space (much smaller)
- VAE decoder reconstructs image from denoised latent
- 8x compression: 512×512 image → 64×64 latent

═══════════════════════════════════════════════════════════════

MULTIMODAL PIPELINES FOR SDEs

DOCUMENT UNDERSTANDING PIPELINE:
1. PDF/image input
2. OCR: extract text from images (Tesseract, AWS Textract, Azure Document Intelligence)
3. Layout analysis: identify tables, figures, headers
4. VLM: understand charts, diagrams, complex layouts
5. Chunk and embed text + image descriptions
6. Store in vector DB for RAG

VISUAL SEARCH PIPELINE:
1. User uploads image or types text query
2. Encode query (CLIP image encoder or text encoder)
3. ANN search in vector DB of pre-encoded product images
4. Return visually similar products
5. Rerank with cross-modal reranker

SPEECH-TO-TEXT-TO-ACTION PIPELINE:
1. Audio input (microphone)
2. Whisper (OpenAI): speech → text transcription
3. LLM: understand intent, extract entities
4. Tool use: execute action (search, book, send)
5. TTS: convert response back to speech

KEY CHALLENGES:
- Alignment: ensuring image and text representations are truly aligned
- Hallucination: VLMs can hallucinate image content
- Resolution: high-res images use many tokens, expensive
- Latency: image encoding adds overhead vs text-only
- Evaluation: harder to evaluate multimodal outputs than text`,

  keyPoints: [
    'CLIP: dual encoder (image + text) trained contrastively on 400M pairs — enables zero-shot image classification',
    'VLMs: image encoder → projection layer → language model — GPT-4V, Claude 3, Gemini, LLaVA',
    'Images converted to tokens: ViT divides image into 16×16 patches, each patch = one token',
    'Diffusion models: add noise (forward) then learn to denoise (reverse) — guided by text prompt',
    'Latent diffusion (Stable Diffusion): diffuse in compressed latent space, 8x more efficient',
    'Whisper: OpenAI speech recognition model — audio → text, supports 99 languages',
    'Multimodal RAG: embed both text and image descriptions, retrieve across modalities',
    'Key challenges: hallucination in VLMs, high token cost for images, alignment quality'
  ],

  codeExamples: [
    {
      title: 'CLIP for Zero-Shot Image Classification and Semantic Search',
      language: 'python',
      description: 'Use CLIP for zero-shot classification and building a visual search engine.',
      code: `# pip install transformers torch Pillow requests
import torch
import numpy as np
from PIL import Image
import requests
from io import BytesIO
from transformers import CLIPProcessor, CLIPModel

# ============================================
# LOAD CLIP MODEL
# ============================================

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

def load_image_from_url(url: str) -> Image.Image:
    response = requests.get(url, timeout=10)
    return Image.open(BytesIO(response.content)).convert("RGB")

def get_image_embedding(image: Image.Image) -> np.ndarray:
    """Get CLIP embedding for an image."""
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        features = model.get_image_features(**inputs)
    # L2 normalize
    features = features / features.norm(dim=-1, keepdim=True)
    return features.numpy()[0]

def get_text_embedding(text: str) -> np.ndarray:
    """Get CLIP embedding for text."""
    inputs = processor(text=[text], return_tensors="pt", padding=True)
    with torch.no_grad():
        features = model.get_text_features(**inputs)
    features = features / features.norm(dim=-1, keepdim=True)
    return features.numpy()[0]

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))

# ============================================
# ZERO-SHOT IMAGE CLASSIFICATION
# ============================================

def zero_shot_classify(image: Image.Image, candidate_labels: list) -> dict:
    """
    Classify image into one of the candidate labels WITHOUT any training.
    CLIP compares image embedding to text embeddings of each label.
    """
    image_emb = get_image_embedding(image)

    scores = {}
    for label in candidate_labels:
        # Format as natural language description
        text = f"a photo of a {label}"
        text_emb = get_text_embedding(text)
        scores[label] = cosine_similarity(image_emb, text_emb)

    # Softmax to get probabilities
    score_values = np.array(list(scores.values()))
    exp_scores = np.exp(score_values * 100)  # Temperature scaling
    probs = exp_scores / exp_scores.sum()

    return {label: float(prob) for label, prob in zip(scores.keys(), probs)}

# Example: classify a dog image
# image = load_image_from_url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/1200px-YellowLabradorLooking_new.jpg")
# results = zero_shot_classify(image, ["dog", "cat", "bird", "car", "airplane"])
# for label, prob in sorted(results.items(), key=lambda x: x[1], reverse=True):
#     print(f"  {label}: {prob:.1%}")

# ============================================
# VISUAL SEARCH ENGINE
# ============================================

class VisualSearchEngine:
    """Search images using text queries or image queries."""

    def __init__(self):
        self.image_embeddings = []
        self.image_metadata = []

    def index_image(self, image: Image.Image, metadata: dict):
        """Add an image to the search index."""
        embedding = get_image_embedding(image)
        self.image_embeddings.append(embedding)
        self.image_metadata.append(metadata)
        print(f"Indexed: {metadata.get('name', 'unknown')}")

    def search_by_text(self, query: str, top_k: int = 3) -> list:
        """Find images matching a text description."""
        query_emb = get_text_embedding(query)
        return self._search(query_emb, top_k)

    def search_by_image(self, image: Image.Image, top_k: int = 3) -> list:
        """Find images similar to a query image."""
        query_emb = get_image_embedding(image)
        return self._search(query_emb, top_k)

    def _search(self, query_emb: np.ndarray, top_k: int) -> list:
        if not self.image_embeddings:
            return []
        embeddings = np.array(self.image_embeddings)
        scores = embeddings @ query_emb
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [
            {**self.image_metadata[i], "score": float(scores[i])}
            for i in top_indices
        ]

# Simulate a product catalog
search_engine = VisualSearchEngine()

# In production: index thousands of product images
# For demo, we'll show the pattern
print("Visual Search Engine initialized")
print("Usage:")
print("  search_engine.index_image(product_image, {'name': 'Red Sneakers', 'price': 89.99})")
print("  results = search_engine.search_by_text('comfortable running shoes')")
print("  results = search_engine.search_by_image(user_uploaded_image)")

# ============================================
# MULTIMODAL RAG WITH GPT-4V
# ============================================

from openai import OpenAI
import base64

client = OpenAI(api_key="<your-api-key>")

def encode_image_base64(image_path: str) -> str:
    """Encode image to base64 for GPT-4V API."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def analyze_image_with_gpt4v(image_path: str, question: str) -> str:
    """Use GPT-4V to analyze an image and answer a question."""
    base64_image = encode_image_base64(image_path)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"  # "low" = faster/cheaper, "high" = more detail
                        }
                    },
                    {
                        "type": "text",
                        "text": question
                    }
                ]
            }
        ],
        max_tokens=500
    )
    return response.choices[0].message.content

# Example usage:
# answer = analyze_image_with_gpt4v("chart.png", "What trend does this chart show?")
# answer = analyze_image_with_gpt4v("receipt.jpg", "What is the total amount on this receipt?")
# answer = analyze_image_with_gpt4v("code_screenshot.png", "What bug do you see in this code?")

print("\\nGPT-4V usage pattern:")
print("  analyze_image_with_gpt4v('chart.png', 'What trend does this show?')")
print("  analyze_image_with_gpt4v('receipt.jpg', 'What is the total?')")`
    },
    {
      title: 'Speech Recognition and Multimodal Pipeline',
      language: 'python',
      description: 'Build a speech-to-text-to-action pipeline using Whisper and GPT.',
      code: `# pip install openai-whisper sounddevice scipy
import whisper
import numpy as np
from openai import OpenAI

client = OpenAI(api_key="<your-api-key>")

# ============================================
# WHISPER SPEECH RECOGNITION
# ============================================

# Load Whisper model
# Sizes: tiny, base, small, medium, large-v3
# Larger = more accurate but slower
whisper_model = whisper.load_model("base")

def transcribe_audio(audio_path: str, language: str = None) -> dict:
    """
    Transcribe audio file to text using Whisper.
    Supports 99 languages, auto-detects if language not specified.
    """
    result = whisper_model.transcribe(
        audio_path,
        language=language,
        task="transcribe",  # or "translate" to translate to English
        word_timestamps=True,  # Get timestamps for each word
        verbose=False
    )

    return {
        "text": result["text"],
        "language": result["language"],
        "segments": [
            {
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"]
            }
            for seg in result["segments"]
        ]
    }

# ============================================
# SPEECH-TO-TEXT-TO-ACTION PIPELINE
# ============================================

def extract_intent_and_entities(text: str) -> dict:
    """Use LLM to understand intent and extract entities from transcribed speech."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """Extract intent and entities from user speech.
Return JSON with:
- intent: one of [search, book_meeting, send_email, set_reminder, answer_question, other]
- entities: relevant extracted information
- confidence: 0.0-1.0"""},
            {"role": "user", "content": f"User said: '{text}'"}
        ],
        response_format={"type": "json_object"},
        temperature=0
    )

    import json
    return json.loads(response.choices[0].message.content)

def execute_action(intent: str, entities: dict) -> str:
    """Execute the identified action."""
    actions = {
        "search": lambda e: f"Searching for: {e.get('query', 'unknown')}",
        "book_meeting": lambda e: f"Booking meeting with {e.get('person', 'unknown')} at {e.get('time', 'unknown')}",
        "send_email": lambda e: f"Sending email to {e.get('recipient', 'unknown')}: {e.get('subject', 'no subject')}",
        "set_reminder": lambda e: f"Setting reminder: {e.get('reminder', 'unknown')} at {e.get('time', 'unknown')}",
        "answer_question": lambda e: f"Answering: {e.get('question', 'unknown')}",
        "other": lambda e: f"Processing: {e}",
    }
    action_fn = actions.get(intent, actions["other"])
    return action_fn(entities)

def voice_assistant_pipeline(audio_path: str) -> dict:
    """Full pipeline: audio → transcription → intent → action."""
    print(f"Processing audio: {audio_path}")

    # Step 1: Transcribe
    transcription = transcribe_audio(audio_path)
    print(f"Transcribed: '{transcription['text']}'")
    print(f"Language: {transcription['language']}")

    # Step 2: Extract intent
    intent_data = extract_intent_and_entities(transcription["text"])
    print(f"Intent: {intent_data.get('intent')} (confidence: {intent_data.get('confidence')})")
    print(f"Entities: {intent_data.get('entities')}")

    # Step 3: Execute action
    result = execute_action(intent_data.get("intent", "other"),
                            intent_data.get("entities", {}))
    print(f"Action: {result}")

    return {
        "transcription": transcription["text"],
        "intent": intent_data,
        "action_result": result
    }

# ============================================
# DOCUMENT UNDERSTANDING PIPELINE
# ============================================

def process_document_with_vision(image_path: str) -> dict:
    """
    Extract structured information from a document image
    (invoice, receipt, form, chart) using GPT-4V.
    """
    import base64
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
                },
                {
                    "type": "text",
                    "text": """Analyze this document and extract:
1. Document type (invoice, receipt, form, chart, etc.)
2. Key information (amounts, dates, names, values)
3. Any tables or structured data
4. Summary of main content

Return as structured JSON."""
                }
            ]
        }],
        response_format={"type": "json_object"},
        max_tokens=1000
    )

    import json
    return json.loads(response.choices[0].message.content)

print("Multimodal pipeline components:")
print("  1. CLIP: zero-shot image classification + visual search")
print("  2. GPT-4V: visual Q&A, document understanding, chart analysis")
print("  3. Whisper: speech recognition in 99 languages")
print("  4. Stable Diffusion: text-to-image generation")
print("  5. Combined: voice assistant, document processing, visual RAG")`
    }
  ],

  resources: [
    {
      title: 'CLIP Paper - OpenAI',
      url: 'https://arxiv.org/abs/2103.00020',
      description: 'Original CLIP paper: Learning Transferable Visual Models From Natural Language Supervision'
    },
    {
      title: 'OpenAI Vision Guide',
      url: 'https://platform.openai.com/docs/guides/vision',
      description: 'Official guide to using GPT-4V for image understanding'
    },
    {
      title: 'Whisper - OpenAI',
      url: 'https://github.com/openai/whisper',
      description: 'Open-source speech recognition model supporting 99 languages'
    },
    {
      title: 'Stable Diffusion - Hugging Face',
      url: 'https://huggingface.co/docs/diffusers/index',
      description: 'Diffusers library for running Stable Diffusion and other diffusion models'
    }
  ],

  questions: [
    {
      question: 'What is CLIP and how does it enable zero-shot image classification?',
      answer: 'CLIP (Contrastive Language-Image Pre-training) trains two encoders — image and text — to produce embeddings in the same space, using contrastive learning on 400M (image, text) pairs. Zero-shot classification: encode the image, encode candidate labels as text ("a photo of a cat"), find the label with highest cosine similarity to the image embedding. No task-specific training needed. Also enables visual search: encode text query, find images with similar embeddings.'
    },
    {
      question: 'How do Vision-Language Models (VLMs) work architecturally?',
      answer: 'Most VLMs follow: 1) Image encoder (CLIP ViT or custom) extracts visual features from image patches. 2) Projection layer maps image features to the language model\'s embedding space. 3) Language model processes combined image tokens + text tokens. 4) Generates text output conditioned on both. Images are divided into 16×16 patches (ViT), each patch becomes one token — a 224×224 image = 196 image tokens. High-resolution images use more tokens and more context window.'
    },
    {
      question: 'How do diffusion models generate images?',
      answer: 'Diffusion models: Forward process — gradually add Gaussian noise to a real image over T steps until it becomes pure noise. Reverse process — train a neural network (U-Net) to predict and remove noise step by step. Generation — start from pure noise, iteratively denoise guided by text prompt (via CLIP text encoder). Latent diffusion (Stable Diffusion) — diffuse in compressed latent space (8x smaller than pixel space) using a VAE, making it much more efficient.'
    },
    {
      question: 'What is Whisper and what makes it powerful?',
      answer: 'Whisper is OpenAI\'s open-source speech recognition model trained on 680K hours of multilingual audio. Supports 99 languages, automatic language detection, translation to English, and word-level timestamps. Architecture: encoder-decoder Transformer — audio spectrogram → encoder → decoder → text. Sizes: tiny (39M params, fast) to large-v3 (1.5B params, most accurate). Used in voice assistants, transcription services, accessibility tools. Available via OpenAI API or run locally.'
    },
    {
      question: 'How would you build a multimodal RAG system for document understanding?',
      answer: 'Pipeline: 1) Ingest documents (PDFs, images). 2) Extract text with OCR (Tesseract, AWS Textract). 3) Use VLM (GPT-4V) to describe charts, diagrams, tables as text. 4) Chunk text + image descriptions. 5) Embed with multimodal embedding model (CLIP or text embedder for descriptions). 6) Store in vector DB. 7) At query time: embed query, retrieve relevant chunks (text + image descriptions), inject into VLM prompt with original images if needed. 8) VLM generates answer grounded in retrieved content.'
    },
    {
      question: 'What are the key challenges in multimodal AI systems?',
      answer: '1) Hallucination: VLMs can hallucinate image content — describe things not in the image. 2) Token cost: images use many tokens (196+ per image), expensive for large-scale processing. 3) Alignment: ensuring image and text representations are truly semantically aligned. 4) Resolution trade-off: high-res = more detail but more tokens and latency. 5) Evaluation: harder to evaluate multimodal outputs than text. 6) Latency: image encoding adds overhead. 7) Data: multimodal training data is harder to collect and label than text.'
    }
  ]
};
