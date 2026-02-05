import { config } from "../config/index.js";
import { Pool } from "../types/index.js";
import { ApiError, ErrorCodes } from "../utils/errors.js";

export class PoolService {
  private poolCache: Map<string, Pool> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async fetchPools(): Promise<Pool[]> {
    const now = Date.now();
    
    // Return cached pools if still fresh
    if (this.poolCache.size > 0 && now - this.lastFetch < this.CACHE_TTL) {
      return Array.from(this.poolCache.values());
    }

    try {
      const response = await fetch(`${config.deepbookIndexerUrl}/get_pools`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pools: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Clear old cache
      this.poolCache.clear();
      
      // Data is an array of pools directly
      const pools = Array.isArray(data) ? data : (data.pools || []);
      
      for (const pool of pools) {
        // Use base_asset_symbol and quote_asset_symbol from indexer
        const poolData = {
          poolId: pool.pool_id,
          poolName: pool.pool_name,
          baseCoin: pool.base_asset_symbol,
          quoteCoin: pool.quote_asset_symbol,
          baseDecimals: pool.base_asset_decimals || 9,
          quoteDecimals: pool.quote_asset_decimals || 6,
          lotSize: pool.lot_size?.toString() || "1000000",
          tickSize: pool.tick_size?.toString() || "1000",
        };
        
        this.poolCache.set(pool.pool_name, poolData);
        
        // Log each pool for debugging
        console.log(`[PoolService] Added pool: ${pool.pool_name} (${pool.base_asset_symbol}/${pool.quote_asset_symbol})`);
      }
      
      this.lastFetch = now;
      console.log(`✅ Fetched ${this.poolCache.size} pools from indexer`);
      
      return Array.from(this.poolCache.values());
    } catch (error) {
      console.error("❌ Error fetching pools:", error);
      
      // Return cached pools if available, even if stale
      if (this.poolCache.size > 0) {
        console.log("⚠️  Using stale pool cache");
        return Array.from(this.poolCache.values());
      }
      
      throw new ApiError(
        503,
        "Failed to fetch pools from DeepBook indexer",
        ErrorCodes.NETWORK_ERROR
      );
    }
  }

  async getPoolByPair(baseCoin: string, quoteCoin: string): Promise<Pool & { isReversed: boolean }> {
    await this.fetchPools(); // Ensure cache is fresh
    
    // Try the requested direction first
    const poolName = `${baseCoin}_${quoteCoin}`;
    let pool = this.poolCache.get(poolName);
    
    if (pool) {
      return { ...pool, isReversed: false };
    }
    
    // Try reverse direction (e.g., SUI_DEEP doesn't exist, but DEEP_SUI does)
    const reversePoolName = `${quoteCoin}_${baseCoin}`;
    pool = this.poolCache.get(reversePoolName);
    
    if (pool) {
      console.log(`[PoolService] Using reverse pool: ${reversePoolName} for ${baseCoin}/${quoteCoin}`);
      return { ...pool, isReversed: true };
    }
    
    throw new ApiError(
      404,
      `Pool not found for pair ${baseCoin}/${quoteCoin} or reverse ${quoteCoin}/${baseCoin}`,
      ErrorCodes.POOL_NOT_FOUND
    );
  }

  async getPoolById(poolId: string): Promise<Pool | undefined> {
    await this.fetchPools();
    
    for (const pool of this.poolCache.values()) {
      if (pool.poolId === poolId) {
        return pool;
      }
    }
    
    return undefined;
  }
}

export const poolService = new PoolService();
