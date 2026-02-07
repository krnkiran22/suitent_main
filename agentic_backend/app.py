from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
import uuid
from helpers import get_mixed_prompt
from tools import get_crypto_prices, search_web
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app)

conversation_history = {}

# Quote endpoint for getting swap estimates
@app.route('/quote', methods=['GET'])
def get_quote():
    token_in = request.args.get('token_in')
    token_out = request.args.get('token_out') 
    amount_in = request.args.get('amount_in')
    
    if not all([token_in, token_out, amount_in]):
        return jsonify({"error": "Missing required parameters: token_in, token_out, amount_in"}), 400
    
    try:
        # Mock quote calculation (replace with actual DeepBook/Uniswap API call)
        estimated_out = float(amount_in) * 0.95  # Simple 5% slippage estimate
        
        quote_data = {
            "token_in": token_in,
            "token_out": token_out,
            "amount_in": amount_in,
            "estimated_out": str(estimated_out),
            "slippage": "0.05",
            "price_impact": "0.01"
        }
        
        return jsonify(quote_data)
    except Exception as e:
        return jsonify({"error": f"Quote calculation failed: {str(e)}"}), 500

@app.route('/chat', methods=['GET'])
def chat():
    query = request.args.get('query')
    conversation_id = request.args.get('conversation_id')
    api_key = request.args.get('api_key')

    if not query:
        return Response("Error: Query parameter is required", status=400, content_type="text/plain")
    
    if not api_key:
        return Response("Error: Groq API Key is required. Please set it in the settings.", status=401, content_type="text/plain")

    # Initialize LLMs
    try:
        # Fast model for intent routing (Lightning-quick classification)
        fast_llm = ChatGroq(model="llama-3.1-8b-instant", api_key=api_key)
        # Primary model for deep reasoning and formatting
        llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key)
    except Exception as e:
        return jsonify({"error": f"Invalid API Key or LLM initialization failed: {str(e)}"}), 401

    if not conversation_id:
        conversation_id = str(uuid.uuid4())

    # Fetch real-time crypto data if context implies trading
    keywords = ['price', 'market', 'trading', 'bitcoin', 'btc', 'ethereum', 'eth', 'sui', 'solana', 'sol', 'crypto', 'trend']
    market_context = ""
    if any(k in query.lower() for k in keywords):
        print("Fetching market data...")
        prices = get_crypto_prices() # Fetches default set (btc, eth, sui, sol)
        if prices:
             market_context = f"\n[REAL-TIME MARKET DATA]: {json.dumps(prices, indent=2)}\nUse this data to answer questions about current prices."

    # --- AGENT 1: SIMPLE SWAP DETECTION ---
    # Check for swap intents using regex first (faster and more reliable)
    import re
    swap_patterns = [
        r'swap\s+(\d*\.?\d+)\s+(\w+)\s+to\s+(\w+)',
        r'swap\s+(\d*\.?\d+)\s+(\w+)\s+for\s+(\w+)', 
        r'trade\s+(\d*\.?\d+)\s+(\w+)\s+for\s+(\w+)',
        r'trade\s+(\d*\.?\d+)\s+(\w+)\s+to\s+(\w+)',
        r'exchange\s+(\d*\.?\d+)\s+(\w+)\s+to\s+(\w+)',
        r'exchange\s+(\d*\.?\d+)\s+(\w+)\s+for\s+(\w+)',
        r'convert\s+(\d*\.?\d+)\s+(\w+)\s+to\s+(\w+)',
        r'convert\s+(\d*\.?\d+)\s+(\w+)\s+for\s+(\w+)',
        # Additional patterns for more natural language
        r'sell\s+(\d*\.?\d+)\s+(\w+)\s+for\s+(\w+)',
        r'buy\s+(\w+)\s+with\s+(\d*\.?\d+)\s+(\w+)',  # Special case: buy TOKEN with AMOUNT TOKEN
        r'get\s+(\w+)\s+for\s+(\d*\.?\d+)\s+(\w+)'   # Special case: get TOKEN for AMOUNT TOKEN
    ]
    
    query_lower = query.lower()
    print(f"Checking query: '{query_lower}'")
    
    for i, pattern in enumerate(swap_patterns):
        print(f"Testing pattern {i+1}: {pattern}")
        match = re.search(pattern, query_lower)
        if match:
            print(f"Pattern {i+1} matched! Groups: {match.groups()}")
            try:
                # Handle different patterns that have different group orders
                if i == 9:  # "buy TOKEN with AMOUNT TOKEN" pattern
                    to_token = match.group(1).upper() if match.group(1) else "UNKNOWN"
                    amount = match.group(2) if match.group(2) else "0"
                    from_token = match.group(3).upper() if match.group(3) else "UNKNOWN"
                elif i == 10:  # "get TOKEN for AMOUNT TOKEN" pattern  
                    to_token = match.group(1).upper() if match.group(1) else "UNKNOWN"
                    amount = match.group(2) if match.group(2) else "0"
                    from_token = match.group(3).upper() if match.group(3) else "UNKNOWN"
                else:  # Standard patterns: "swap AMOUNT FROM to TO"
                    amount = match.group(1) if match.group(1) else "0"
                    from_token = match.group(2).upper() if match.group(2) else "UNKNOWN"
                    to_token = match.group(3).upper() if match.group(3) else "UNKNOWN"
                
                # Additional validation
                if not amount or not from_token or not to_token:
                    print(f"Invalid extraction: amount={amount}, from_token={from_token}, to_token={to_token}")
                    continue
                
                # Normalize token symbols (handle common variations)
                token_mappings = {
                    'DEEP': 'DEEP',
                    'SUI': 'SUI', 
                    'USDC': 'USDC',
                    'USDT': 'USDT',
                    'BTC': 'BTC',
                    'ETH': 'ETH',
                    'WETH': 'WETH'
                }
                
                from_token = token_mappings.get(from_token, from_token)
                to_token = token_mappings.get(to_token, to_token)
                    
                swap_data = {
                    "amount": amount,
                    "from_token": from_token,
                    "to_token": to_token
                }
                
                response_data = {
                    "type": "swap_intent",
                    "swap_data": swap_data,
                    "message": f"Ready to swap {amount} {from_token} to {to_token}. Confirm?",
                    "assets": []
                }
                
                print(f"Swap detected via regex: {swap_data}")
                return jsonify(response_data)
            except Exception as e:
                print(f"Error processing match: {e}")
                continue

    # --- TAKE PROFIT / STOP LOSS DETECTION ---
    # Check for TP/SL intents using regex
    tp_sl_patterns = [
        r'create.*take\s*profit.*at\s*(\d+)%.*from.*current.*price',
        r'set.*take\s*profit.*(\d+)%.*from.*current.*price', 
        r'take\s*profit.*at\s*(\d+)%.*from.*current.*price',
        r'tp.*at\s*(\d+)%.*from.*current.*price',
        r'create.*stop\s*loss.*at\s*(\d+)%.*from.*current.*price',
        r'set.*stop\s*loss.*(\d+)%.*from.*current.*price',
        r'stop\s*loss.*at\s*(\d+)%.*from.*current.*price', 
        r'sl.*at\s*(\d+)%.*from.*current.*price'
    ]
    
    for i, pattern in enumerate(tp_sl_patterns):
        print(f"Testing TP/SL pattern {i+1}: {pattern}")
        match = re.search(pattern, query_lower)
        if match:
            print(f"TP/SL Pattern {i+1} matched! Groups: {match.groups()}")
            try:
                percentage = match.group(1)
                
                # Determine if it's take profit or stop loss
                is_take_profit = any(keyword in query_lower for keyword in ['take profit', 'tp'])
                is_stop_loss = any(keyword in query_lower for keyword in ['stop loss', 'sl'])
                
                order_type = "take_profit" if is_take_profit else "stop_loss"
                
                tp_sl_data = {
                    "type": order_type,
                    "percentage": percentage,
                    "direction": "above" if is_take_profit else "below"
                }
                
                response_data = {
                    "type": "tp_sl_intent",
                    "tp_sl_data": tp_sl_data,
                    "message": f"Perfect! I'll set a {'take profit' if is_take_profit else 'stop loss'} level at {percentage}% {'above' if is_take_profit else 'below'} the current market price. This will be automatically calculated using real-time price data and visualized on your trading chart. You can monitor it in the /swap page!",
                    "assets": []
                }
                
                print(f"TP/SL detected via regex: {tp_sl_data}")
                return jsonify(response_data)
            except Exception as e:
                print(f"Error processing TP/SL match: {e}")
                continue

    # --- PRICE CHECK DETECTION ---
    # Check for price inquiry patterns
    price_check_patterns = [
        r'what.*current.*price.*(\w+)',
        r'current.*price.*(\w+)',
        r'price.*of.*(\w+)',
        r'(\w+).*price.*now',
        r'show.*price.*(\w+)',
        r'get.*price.*(\w+)'
    ]
    
    for i, pattern in enumerate(price_check_patterns):
        print(f"Testing price check pattern {i+1}: {pattern}")
        match = re.search(pattern, query_lower)
        if match:
            print(f"Price check pattern {i+1} matched! Groups: {match.groups()}")
            try:
                token = match.group(1).upper()
                
                response_data = {
                    "type": "price_check",
                    "token": token,
                    "message": f"I'll get the current price for {token}. Check your trading chart for the most up-to-date price information!",
                    "assets": []
                }
                
                print(f"Price check detected for token: {token}")
                return jsonify(response_data)
            except Exception as e:
                print(f"Error processing price check match: {e}")
                continue
    
    # Determine if this needs research/assets or is just simple chat
    router_prompt = f"""
    Analyze user intent: "{query}"
    
    CLASSIFICATION CRITERIA:
    - Respond 'LEARN': If the query contains a SUBJECT (e.g., "Space", "Sui", "React", "Cooking", "DeFi", "News"). Any question starting with "What", "How", "Why", "Tell me about", or "Chat about [topic]" MUST be 'LEARN'.
    - Respond 'CHAT': ONLY for social filler, greetings ("Hi", "Hello"), or basic wellness checks ("How are you?").
    
    Decision (LEARN/CHAT):
    """
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        # Start both Router and Web Search in parallel for ALL queries
        # The 8B model will dynamically decide the intent without hardcoded rules
        future_router = executor.submit(fast_llm.invoke, [HumanMessage(content=router_prompt)])
        future_search = executor.submit(search_web, query)

        # 1. Get Dynamic Router Decision
        needs_research = True
        try:
            route_decision = future_router.result().content.strip().upper()
            needs_research = "LEARN" in route_decision
        except Exception as e:
            print(f"Router failed: {e}")
            needs_research = True # Default to research on error

        # 2. Process Search Context
        search_context = ""
        if needs_research:
            try:
                search_results = future_search.result()
                if search_results:
                    search_context = f"\n[SEARCHED ASSETS - USE THESE REAL LINKS]:\n{json.dumps(search_results, indent=2)}\nIMPORTANT: Use the actual 'url' fields from these results."
            except Exception as e:
                print(f"Search failed: {e}")
        else:
            search_context = "\n[MODE]: CASUAL CHAT. Do NOT generate any 'assets' for this response. Keep it empty []."

    if conversation_id not in conversation_history:
        current_path = os.path.dirname(os.path.abspath(__file__))
        path_to_try = os.path.join(current_path, "sui_tent_prompt.txt")
        if not os.path.exists(path_to_try):
            path_to_try = os.path.join(current_path, "web3_prompt.txt")
            
        with open(path_to_try, "r") as file:
            base_context = file.read()
            
        # Use base context from file (Sofia/SuiTent) and append Format Instructions
        system_prompt = base_context
        
        system_prompt += '''
        IMPORTANT: SPEECH AND ANIMATION SYNCHRONIZATION
        1. SPEECH RULE: If a segment in "messages" contains text longer than 2 words, you MUST use one of the talking animations: "Talking_0", "Talking_1", or "Talking_2". 
        2. NON-VERBAL RULE: Only use "Laughing", "Angry", "Crying", "Terrified", or "Standing Idle" for short exclamations or emotional beats, OR if the text specifically describes a non-verbal reaction.
        3. TEACHING TONE: When acting as "Visual Teacher", prioritize "Talking_1" (expressive) and "Talking_2" (casual) to make the explanation engaging.
        4. VARIETY: NEVER use the same animation for two consecutive segments.

        AVAILABLE ANIMATIONS (EXACT NAMES):
        - "Talking_0", "Talking_1", "Talking_2", "Standing Idle", "Laughing", "Angry", "Crying", "Terrified", "Rumba Dancing"
        
        AVAILABLE FACIAL EXPRESSIONS:
        - "default", "smile", "funnyFace", "sad", "surprised", "angry", "crazy"

        CRITICAL: RESPONSE FORMAT
        {  
            "html_response": "<Tailwind styled chat bubble HTML>",
            "messages": [
                { 
                  "text": "Check out this blog on Medium about SUI.", 
                  "facialExpression": "smile", 
                  "animation": "Talking_1",
                  "assets": [
                    { "type": "blog", "url": "https://medium.com/...", "caption": "Deep Dive into SUI" },
                    { "type": "docs", "url": "https://docs.sui.io/...", "caption": "Official SUI Documentation" }
                  ]
                }
            ],
            "suggestions": ["...", "..."]
        }
        
        RULES:
        - ASSET CATEGORIES: Use 'youtube' for videos, 'blog' for Medium/GeeksForGeeks/Dev.to, 'docs' for official technical documentation, and 'image' for visual aids.
        - ACTUAL LINKS ONLY: Use the real URLs provided in the [SEARCHED ASSETS] context. Do NOT make up URLs.
        - ASSET QUOTA: You MUST prioritize a mix (e.g., 1 video + 1 blog OR 1 image + 1 docs). Provide at least 2 distinct assets.
        - SUGGESTIONS: Provide 2-3 short, clickable questions in the "suggestions" array. Keep them under 8 words each (e.g., "Tell me more about Sui DeFi").
        - CLEAN UI: Keep asset 'caption' field strictly between 3 to 5 words. Do NOT provide long descriptions in the caption.
        - SEGMENTATION: Attach assets to the specific message segment they relate to. This allows them to appear while you are speaking that part.
        - NO IDLE DURING SPEECH: If the AI is speaking text, it MUST be animating its mouth with a "Talking_" animation.
        - EMOTION: Match facialExpression and animation to the tone of your text strictly.
        '''
        
        conversation_history[conversation_id] = [
            SystemMessage(content=system_prompt)
        ]

    # Inject market context into the current turn if available
    input_message = query
    if market_context:
        input_message += market_context
    if search_context:
        input_message += search_context

    conversation_history[conversation_id].append(HumanMessage(content=input_message))

    # Get the response
    try:
        result = llm.invoke(conversation_history[conversation_id])
        output_str = result.content
        print(output_str)
        conversation_history[conversation_id].append(AIMessage(content=output_str))
        
        # Parse and return as JSON
        parsed_response = json.loads(output_str)
        
        # Ensure 'messages' exists to satisfy frontend
        if "messages" not in parsed_response:
            parsed_response["messages"] = [{
                "text": output_str if isinstance(output_str, str) else "I'm sorry, I had trouble formatting that. How else can I help?",
                "facialExpression": "default",
                "animation": "Talking_2"
            }]
        if "suggestions" not in parsed_response:
            parsed_response["suggestions"] = []
            
        return jsonify(parsed_response)
    except json.JSONDecodeError:
        # Fallback for bad JSON - try to extract JSON part
        try:
             import re
             json_match = re.search(r'\{.*\}', output_str, re.DOTALL)
             if json_match:
                 parsed_match = json.loads(json_match.group(0))
                 if "messages" not in parsed_match:
                     parsed_match["messages"] = [{"text": output_str, "facialExpression": "default", "animation": "Talking_2"}]
                 return jsonify(parsed_match)
        except:
             pass
        # Final safety wrapper
        return jsonify({
            "messages": [{"text": "I'm sorry, let me try that again. What was your question?", "facialExpression": "sad", "animation": "Talking_0"}],
            "suggestions": [],
            "error": "JSON Parse Error",
            "raw_response": output_str
        })
    except Exception as e:
        return jsonify({
            "messages": [{"text": f"Error: {str(e)}", "facialExpression": "sad", "animation": "Talking_0"}],
            "suggestions": []
        })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
    