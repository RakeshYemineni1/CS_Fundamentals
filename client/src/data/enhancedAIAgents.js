export const enhancedAIAgents = {
  id: 'ai-agents',
  title: 'AI Agents & Agentic Systems',
  subtitle: 'ReAct, Tool Use, Multi-Agent Systems, and Building Autonomous AI',
  summary: 'AI agents are LLM-powered systems that can reason, plan, use tools, and take actions autonomously to complete complex multi-step tasks. They go beyond single-turn Q&A to execute workflows, browse the web, write and run code, and interact with external APIs.',
  analogy: 'A basic LLM is like a very smart person locked in a room with no tools — they can only think and talk. An AI agent is that same person but now given a computer, internet access, a calculator, and the ability to send emails. They can actually go do things, not just describe how to do them.',

  explanation: `WHAT IS AN AI AGENT?

An AI agent is a system where an LLM acts as the "brain" that perceives its environment, reasons about what to do, takes actions using tools, observes results, and repeats until the task is complete. Unlike a single LLM call, agents operate in a loop.

AGENT LOOP (Core Architecture):
1. Perceive — receive task/observation from environment
2. Think — LLM reasons about what to do next
3. Act — execute a tool or action
4. Observe — receive result of the action
5. Repeat — until task is complete or max steps reached

═══════════════════════════════════════════════════════════════

THE REACT PATTERN (Reasoning + Acting)

Introduced in the paper "ReAct: Synergizing Reasoning and Acting in Language Models" (2022).

The LLM alternates between:
- Thought: "I need to find the current weather in Paris"
- Action: call_tool(weather_api, city="Paris")
- Observation: "Paris: 18°C, partly cloudy"
- Thought: "Now I have the weather, I can answer the question"
- Final Answer: "It is currently 18°C and partly cloudy in Paris"

This interleaving of reasoning and acting is more reliable than pure reasoning (hallucination) or pure acting (no planning).

═══════════════════════════════════════════════════════════════

TOOL USE / FUNCTION CALLING

Tools are functions the agent can call to interact with the world:

COMMON TOOL TYPES:
- Search: web search, vector DB search, document retrieval
- Code execution: run Python, JavaScript, shell commands
- APIs: weather, maps, calendar, email, databases
- File operations: read/write files, parse PDFs
- Browser: navigate web pages, click, fill forms
- Memory: read/write to persistent storage

FUNCTION CALLING (OpenAI):
The LLM outputs a structured JSON specifying which function to call and with what arguments. The application executes the function and returns the result to the LLM.

TOOL SELECTION:
The LLM decides which tool to use based on the task. Good tool descriptions are critical — the LLM reads them to decide.

═══════════════════════════════════════════════════════════════

MEMORY IN AGENTS

TYPES OF MEMORY:

1. In-Context Memory (Short-term):
   - The conversation history in the context window
   - Limited by context window size
   - Lost when conversation ends

2. External Memory (Long-term):
   - Vector database storing past interactions, facts, documents
   - Retrieved via semantic search when relevant
   - Persists across sessions

3. Episodic Memory:
   - Records of past agent runs and their outcomes
   - Helps agent learn from past successes/failures

4. Semantic Memory:
   - Factual knowledge stored in a knowledge base
   - Retrieved when the agent needs domain knowledge

5. Procedural Memory:
   - Stored workflows and procedures
   - Agent knows "how to do X" from past experience

═══════════════════════════════════════════════════════════════

PLANNING STRATEGIES

CHAIN-OF-THOUGHT (CoT):
Linear step-by-step reasoning. Simple, works for straightforward tasks.

TREE OF THOUGHTS (ToT):
Explore multiple reasoning branches simultaneously. Best for complex problems with multiple valid approaches.

PLAN-AND-EXECUTE:
1. Planner LLM creates a high-level plan (list of steps)
2. Executor LLM executes each step
3. Separation of concerns — planner doesn't get distracted by details

REFLEXION:
Agent reflects on its past failures and generates improved plans.
Stores verbal feedback in memory to avoid repeating mistakes.

═══════════════════════════════════════════════════════════════

MULTI-AGENT SYSTEMS

Multiple specialized agents collaborate to complete complex tasks.

PATTERNS:

1. Supervisor Pattern:
   - One orchestrator agent delegates to specialist agents
   - Orchestrator: "Research agent, find info. Writer agent, draft the report."
   - Good for: complex workflows with clear specializations

2. Peer-to-Peer Pattern:
   - Agents communicate directly with each other
   - Good for: debate, critique, collaborative problem solving

3. Pipeline Pattern:
   - Output of one agent feeds into the next
   - Agent A → Agent B → Agent C → Final output
   - Good for: sequential processing workflows

4. Debate Pattern:
   - Multiple agents argue different positions
   - Final agent synthesizes the best answer
   - Good for: improving reasoning quality, reducing bias

POPULAR FRAMEWORKS:
- LangChain / LangGraph: most popular, Python
- AutoGen (Microsoft): multi-agent conversations
- CrewAI: role-based multi-agent teams
- OpenAI Assistants API: managed agent infrastructure

═══════════════════════════════════════════════════════════════

CHALLENGES IN AGENT SYSTEMS

RELIABILITY:
- Agents can get stuck in loops
- Tool failures cascade
- LLM reasoning errors compound over many steps
- Solution: max steps limit, error handling, human-in-the-loop checkpoints

COST:
- Each step = LLM API call = money
- Long agent runs can be expensive
- Solution: caching, smaller models for simple steps, early termination

LATENCY:
- Sequential tool calls add up
- Solution: parallel tool execution where possible

SECURITY:
- Prompt injection via tool outputs (malicious web pages)
- Agents with write access can cause irreversible damage
- Solution: sandboxing, permission scoping, human approval for destructive actions

EVALUATION:
- Hard to evaluate open-ended agent behavior
- Metrics: task completion rate, steps to completion, cost per task`,

  keyPoints: [
    'Agent loop: Perceive → Think → Act → Observe → Repeat until done',
    'ReAct pattern: interleave Thought, Action, Observation for reliable reasoning',
    'Tools give agents the ability to search, run code, call APIs, and interact with the world',
    'Memory types: in-context (short-term), vector DB (long-term), episodic, semantic',
    'Planning: CoT (linear), ToT (branching), Plan-and-Execute (planner + executor)',
    'Multi-agent: Supervisor, Pipeline, Peer-to-Peer, and Debate patterns',
    'Key challenges: reliability (loops/errors), cost (API calls), security (prompt injection)',
    'Frameworks: LangChain/LangGraph, AutoGen, CrewAI, OpenAI Assistants API'
  ],

  codeExamples: [
    {
      title: 'ReAct Agent from Scratch',
      language: 'python',
      description: 'Build a simple ReAct agent loop with tool use from scratch.',
      code: `from openai import OpenAI
import json
import math

client = OpenAI(api_key="<your-api-key>")

# ============================================
# DEFINE TOOLS
# ============================================

def calculator(expression: str) -> str:
    """Safely evaluate a math expression."""
    try:
        # Only allow safe math operations
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith('_')}
        result = eval(expression, {"__builtins__": {}}, allowed)
        return str(result)
    except Exception as e:
        return f"Error: {e}"

def get_weather(city: str) -> str:
    """Mock weather API."""
    weather_data = {
        "london": "15°C, rainy",
        "paris": "18°C, sunny",
        "tokyo": "22°C, cloudy",
        "new york": "12°C, windy",
    }
    return weather_data.get(city.lower(), f"Weather data not available for {city}")

def search_web(query: str) -> str:
    """Mock web search."""
    results = {
        "python creator": "Python was created by Guido van Rossum, first released in 1991.",
        "largest planet": "Jupiter is the largest planet in our solar system.",
        "openai founded": "OpenAI was founded in December 2015 by Sam Altman, Elon Musk, and others.",
    }
    for key, value in results.items():
        if any(word in query.lower() for word in key.split()):
            return value
    return f"Search results for '{query}': No specific results found."

# Tool registry
TOOLS = {
    "calculator": calculator,
    "get_weather": get_weather,
    "search_web": search_web,
}

# Tool schemas for the LLM
TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Evaluate mathematical expressions. Use for any arithmetic or math.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression to evaluate, e.g. '2 + 2' or 'sqrt(16)'"}
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"}
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web for factual information.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"}
                },
                "required": ["query"]
            }
        }
    }
]

# ============================================
# REACT AGENT LOOP
# ============================================

def run_agent(task: str, max_steps: int = 10):
    print(f"Task: {task}")
    print("=" * 50)
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use tools to answer questions accurately. Think step by step."},
        {"role": "user", "content": task}
    ]
    
    for step in range(max_steps):
        # LLM decides what to do next
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto"
        )
        
        message = response.choices[0].message
        messages.append(message)
        
        # Check if agent is done (no more tool calls)
        if not message.tool_calls:
            print(f"\\nFinal Answer: {message.content}")
            return message.content
        
        # Execute each tool call
        for tool_call in message.tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)
            
            print(f"\\nStep {step + 1}:")
            print(f"  Thought: Using {tool_name} with {tool_args}")
            
            # Execute the tool
            result = TOOLS[tool_name](**tool_args)
            print(f"  Observation: {result}")
            
            # Add tool result to messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })
    
    return "Max steps reached"

# Test the agent
run_agent("What is the weather in Paris? Also, what is 15% of the temperature in Celsius?")
run_agent("Who created Python and in what year? How many years ago was that from 2024?")`
    },
    {
      title: 'Multi-Agent System — Supervisor Pattern',
      language: 'python',
      description: 'Build a supervisor agent that delegates to specialized sub-agents.',
      code: `from openai import OpenAI
import json

client = OpenAI(api_key="<your-api-key>")

# ============================================
# SPECIALIZED AGENTS
# ============================================

def researcher_agent(topic: str) -> str:
    """Agent specialized in research and fact-finding."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a research specialist. Provide accurate, concise factual information. Cite key facts with confidence levels."},
            {"role": "user", "content": f"Research this topic and provide key facts: {topic}"}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content

def writer_agent(content: str, style: str = "professional") -> str:
    """Agent specialized in writing and formatting."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a professional writer. Write in a {style} style. Be clear and engaging."},
            {"role": "user", "content": f"Write a well-structured summary based on this content:\\n{content}"}
        ],
        max_tokens=400
    )
    return response.choices[0].message.content

def critic_agent(content: str) -> str:
    """Agent specialized in reviewing and improving content."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a critical reviewer. Identify weaknesses, inaccuracies, and suggest specific improvements."},
            {"role": "user", "content": f"Review this content and provide specific feedback:\\n{content}"}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content

# ============================================
# SUPERVISOR AGENT
# ============================================

AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "researcher_agent",
            "description": "Use when you need to research facts, gather information, or find data about a topic.",
            "parameters": {
                "type": "object",
                "properties": {"topic": {"type": "string"}},
                "required": ["topic"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "writer_agent",
            "description": "Use when you need to write, format, or structure content into a readable form.",
            "parameters": {
                "type": "object",
                "properties": {
                    "content": {"type": "string"},
                    "style": {"type": "string", "enum": ["professional", "casual", "technical"]}
                },
                "required": ["content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "critic_agent",
            "description": "Use when you need to review, critique, or improve existing content.",
            "parameters": {
                "type": "object",
                "properties": {"content": {"type": "string"}},
                "required": ["content"]
            }
        }
    }
]

AGENTS = {
    "researcher_agent": researcher_agent,
    "writer_agent": writer_agent,
    "critic_agent": critic_agent,
}

def supervisor_agent(task: str):
    """Supervisor that orchestrates specialized agents."""
    print(f"Supervisor received task: {task}\\n")
    
    messages = [
        {"role": "system", "content": """You are a supervisor that coordinates specialized agents to complete tasks.
Available agents:
- researcher_agent: finds facts and information
- writer_agent: writes and formats content  
- critic_agent: reviews and improves content

Break down the task and delegate to appropriate agents. Synthesize their outputs."""},
        {"role": "user", "content": task}
    ]
    
    step = 0
    while step < 8:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=AGENT_TOOLS,
            tool_choice="auto"
        )
        
        message = response.choices[0].message
        messages.append(message)
        
        if not message.tool_calls:
            print(f"\\n{'='*50}")
            print("FINAL OUTPUT:")
            print(message.content)
            return message.content
        
        for tool_call in message.tool_calls:
            agent_name = tool_call.function.name
            agent_args = json.loads(tool_call.function.arguments)
            
            print(f"Supervisor → {agent_name}")
            result = AGENTS[agent_name](**agent_args)
            print(f"Result preview: {result[:100]}...\\n")
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })
        step += 1

# Run the multi-agent system
supervisor_agent(
    "Create a short, professional summary about the history and impact of the Python programming language. Research it, write it, then critique and improve it."
)`
    }
  ],

  resources: [
    {
      title: 'ReAct Paper - Reasoning and Acting in LLMs',
      url: 'https://arxiv.org/abs/2210.03629',
      description: 'Original ReAct paper introducing the Thought-Action-Observation loop'
    },
    {
      title: 'LangGraph Documentation',
      url: 'https://langchain-ai.github.io/langgraph/',
      description: 'Build stateful multi-agent applications with LangGraph'
    },
    {
      title: 'OpenAI Function Calling Guide',
      url: 'https://platform.openai.com/docs/guides/function-calling',
      description: 'Official guide to tool use and function calling with OpenAI'
    },
    {
      title: 'AutoGen - Microsoft Multi-Agent Framework',
      url: 'https://microsoft.github.io/autogen/',
      description: 'Microsoft\'s framework for building multi-agent conversations'
    }
  ],

  questions: [
    {
      question: 'What is an AI agent and how is it different from a regular LLM call?',
      answer: 'A regular LLM call is a single input → output. An AI agent runs in a loop: Perceive → Think → Act → Observe → Repeat. The agent uses tools (search, code execution, APIs) to interact with the world, observes results, and continues reasoning until the task is complete. Agents can handle multi-step tasks that require gathering information, making decisions, and taking actions — not just generating text.'
    },
    {
      question: 'What is the ReAct pattern?',
      answer: 'ReAct (Reasoning + Acting) interleaves Thought, Action, and Observation steps. Thought: the LLM reasons about what to do next. Action: calls a tool with specific arguments. Observation: receives the tool result. This loop continues until the task is done. More reliable than pure reasoning (which hallucinates) or pure acting (which lacks planning). The interleaving grounds reasoning in real observations.'
    },
    {
      question: 'What are the types of memory in an AI agent?',
      answer: 'In-context (short-term): conversation history in the context window — fast but limited and lost when session ends. External/Vector DB (long-term): past interactions and documents stored in a vector DB, retrieved via semantic search — persists across sessions. Episodic: records of past agent runs and outcomes. Semantic: factual knowledge base. Procedural: stored workflows. Most production agents combine in-context + vector DB memory.'
    },
    {
      question: 'What are the main multi-agent patterns?',
      answer: 'Supervisor: one orchestrator delegates to specialist agents — good for complex workflows. Pipeline: output of one agent feeds the next (A → B → C) — good for sequential processing. Peer-to-Peer: agents communicate directly — good for collaboration. Debate: multiple agents argue positions, one synthesizes — improves reasoning quality. Choice depends on task structure: use Supervisor for parallel specialization, Pipeline for sequential steps.'
    },
    {
      question: 'What are the main challenges in building reliable agent systems?',
      answer: 'Reliability: agents can loop, compound errors over many steps, or get stuck. Fix: max steps limit, error handling, human-in-the-loop checkpoints. Cost: each step = LLM API call. Fix: caching, smaller models for simple steps. Latency: sequential tool calls add up. Fix: parallel tool execution. Security: prompt injection via tool outputs, agents with write access causing damage. Fix: sandboxing, permission scoping, human approval for destructive actions.'
    },
    {
      question: 'What is function calling / tool use in LLMs?',
      answer: 'Function calling allows LLMs to output structured JSON specifying which function to call and with what arguments, instead of free text. The application executes the function and returns the result to the LLM. The LLM never directly executes code — it just outputs the intent. Key for agents: enables reliable, structured tool use. Tool descriptions must be clear — the LLM reads them to decide which tool to use. Supported by OpenAI, Anthropic, Google.'
    },
    {
      question: 'How would you design an agent system for automated code review?',
      answer: 'Design: 1) Orchestrator agent receives PR diff. 2) Delegates to specialist agents in parallel: Security agent (checks for vulnerabilities), Performance agent (checks for inefficiencies), Style agent (checks conventions). 3) Each agent uses tools: code search (find similar patterns), static analysis API, documentation lookup. 4) Critic agent reviews all findings and removes duplicates/false positives. 5) Writer agent formats final review comment. 6) Human approval before posting. Key: parallel execution for speed, human-in-the-loop for safety.'
    }
  ]
};
