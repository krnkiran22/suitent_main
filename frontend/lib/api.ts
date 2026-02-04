// lib/api.ts - API client for backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

console.log("[API Client] Initialized with URL:", API_URL);

// Helper for API calls with logging
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API Client] ${options?.method || "GET"} ${url}`);

  if (options?.body) {
    console.log("[API Client] Request body:", options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[API Client] Error response:", data);
      throw new Error(data.error || `API error: ${response.status}`);
    }

    console.log("[API Client] Success response:", data);
    return data;
  } catch (error) {
    console.error("[API Client] Request failed:", error);
    throw error;
  }
}

// API Functions
export async function getTokens() {
  return apiCall<{ tokens: any[] }>("/api/tokens");
}

export async function getBalances(address: string) {
  return apiCall<{ address: string; balances: any[] }>(`/api/balances/${address}`);
}

export async function getSwapQuote(tokenIn: string, tokenOut: string, amountIn: string) {
  return apiCall<any>("/api/price/quote", {
    method: "POST",
    body: JSON.stringify({ tokenIn, tokenOut, amountIn }),
  });
}

export async function buildSwapTransaction(
  walletAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  slippage: number = 0.01
) {
  return apiCall<{ transaction: { txBytes: string }; quote: any }>("/api/swap/build", {
    method: "POST",
    body: JSON.stringify({ walletAddress, tokenIn, tokenOut, amountIn, slippage }),
  });
}

export async function getTransactionStatus(digest: string) {
  return apiCall<any>(`/api/transaction/${digest}`);
}
