import requests

def get_crypto_prices(ids="bitcoin,ethereum,sui,solana", vs_currencies="usd"):
    """
    Fetches cryptocurrency prices from CoinGecko API.
    """
    try:
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": ids,
            "vs_currencies": vs_currencies,
            "include_24hr_change": "true"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching crypto prices: {e}")
        return {}

from duckduckgo_search import DDGS
import json
from concurrent.futures import ThreadPoolExecutor

def search_videos(ddgs, query):
    try:
        y_results = list(ddgs.videos(f"site:youtube.com {query}", max_results=2))
        return [{
            "title": r.get("title"),
            "url": r.get("content"),
            "thumbnail": r.get("images", {}).get("large") or r.get("images", {}).get("medium") or r.get("images", {}).get("small")
        } for r in y_results]
    except: return []

def search_articles(ddgs, query):
    try:
        blog_query = f"(site:medium.com OR site:geeksforgeeks.org OR site:hashnode.com OR site:dev.to) {query}"
        b_results = list(ddgs.text(blog_query, max_results=3))
        return [{
            "title": r.get("title"),
            "url": r.get("href"),
            "snippet": r.get("body"),
            "source": "blog"
        } for r in b_results]
    except: return []

def search_docs(ddgs, query):
    try:
        doc_query = f"(site:docs.* OR site:*.gitbook.io OR filetype:pdf) {query} documentation"
        d_results = list(ddgs.text(doc_query, max_results=2))
        return [{
            "title": r.get("title"),
            "url": r.get("href"),
            "snippet": r.get("body")
        } for r in d_results]
    except: return []

def search_images(ddgs, query):
    try:
        i_results = list(ddgs.images(query, max_results=4, safesearch="on"))
        return [{
            "title": r.get("title"),
            "url": r.get("image"),
            "thumbnail": r.get("thumbnail")
        } for r in i_results]
    except: return []

def search_web(query, max_results=8):
    """
    Find actual URLs for diverse assets using Parallel DuckDuckGo search.
    """
    results = {"videos": [], "articles": [], "images": [], "docs": []}
    
    try:
        with DDGS() as ddgs:
            with ThreadPoolExecutor(max_workers=4) as executor:
                # Dispatch all searches in parallel
                future_v = executor.submit(search_videos, ddgs, query)
                future_a = executor.submit(search_articles, ddgs, query)
                future_d = executor.submit(search_docs, ddgs, query)
                future_i = executor.submit(search_images, ddgs, query)
                
                # Collect results as they finish
                results["videos"] = future_v.result()
                results["articles"] = future_a.result()
                results["docs"] = future_d.result()
                results["images"] = future_i.result()
                
        return results
    except Exception as e:
        print(f"Parallel Search error: {e}")
        return results