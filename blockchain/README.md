# SuiTent Backend

DeepBook V3 Swap API on Sui Testnet for SuiTent intent-based trading platform.

## Features

- ✅ Pool discovery via DeepBook indexer
- ✅ Price quotes for token swaps
- ✅ Unsigned transaction building for swaps
- ✅ Token balance queries
- ✅ Transaction status checking
- ✅ TypeScript with strict typing
- ✅ Express.js REST API

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Blockchain**: Sui Testnet
- **DEX**: DeepBook V3

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## Environment Variables

```env
# Sui Network
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# DeepBook V3 Indexer
DEEPBOOK_INDEXER_URL=https://deepbook-indexer.testnet.mystenlabs.com

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Get Available Pools
```bash
GET /api/pools
```

### Get Pool by Pair
```bash
GET /api/pools/:baseCoin/:quoteCoin

# Example
GET /api/pools/SUI/USDC
```

### Get Price Quote
```bash
POST /api/price/quote
Content-Type: application/json

{
  "tokenIn": "USDC",
  "tokenOut": "SUI",
  "amountIn": "100"
}
```

### Build Swap Transaction
```bash
POST /api/swap/build
Content-Type: application/json

{
  "walletAddress": "0x...",
  "tokenIn": "USDC",
  "tokenOut": "SUI",
  "amountIn": "100",
  "minAmountOut": "40"
}
```

### Get Token Balances
```bash
GET /api/swap/balances/:walletAddress

# Example
GET /api/swap/balances/0x1234...
```

### Get Transaction Status
```bash
GET /api/swap/transaction/:txDigest

# Example
GET /api/swap/transaction/0xabc123...
```

## Testing

```bash
# Test health check
curl http://localhost:3001/api/health

# Test get pools
curl http://localhost:3001/api/pools

# Test price quote
curl -X POST http://localhost:3001/api/price/quote \
  -H "Content-Type: application/json" \
  -d '{"tokenIn": "USDC", "tokenOut": "SUI", "amountIn": "100"}'

# Test build swap
curl -X POST http://localhost:3001/api/swap/build \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x...",
    "tokenIn": "USDC",
    "tokenOut": "SUI",
    "amountIn": "100",
    "minAmountOut": "40"
  }'
```

## Project Structure

```
blockchain/
├── src/
│   ├── index.ts                 # Express app entry
│   ├── config/
│   │   ├── index.ts             # Environment config
│   │   └── tokens.ts            # Token definitions
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── swap.routes.ts       # Swap endpoints
│   │   ├── pools.routes.ts      # Pool endpoints
│   │   └── price.routes.ts      # Price endpoints
│   ├── services/
│   │   ├── deepbook.service.ts  # DeepBook V3 integration
│   │   ├── sui.service.ts       # Sui client
│   │   └── pool.service.ts      # Pool discovery
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── utils/
│       ├── format.ts            # Formatting helpers
│       └── errors.ts            # Error handling
├── package.json
├── tsconfig.json
└── README.md
```

## Supported Tokens (Testnet)

- **SUI**: Native Sui token (9 decimals)
- **USDC**: USD Coin (6 decimals)

## Frontend Integration

The frontend should:
1. Call `/api/swap/build` to get unsigned transaction
2. Sign transaction with Turnkey wallet
3. Submit signed transaction to Sui network
4. Poll `/api/swap/transaction/:digest` for status

Example frontend code:
```typescript
// 1. Get quote
const quote = await fetch('http://localhost:3001/api/price/quote', {
  method: 'POST',
  body: JSON.stringify({
    tokenIn: 'USDC',
    tokenOut: 'SUI',
    amountIn: '100'
  })
});

// 2. Build transaction
const { transaction } = await fetch('http://localhost:3001/api/swap/build', {
  method: 'POST',
  body: JSON.stringify({
    walletAddress: userAddress,
    tokenIn: 'USDC',
    tokenOut: 'SUI',
    amountIn: '100',
    minAmountOut: '40'
  })
});

// 3. Sign with Turnkey (frontend)
const signed = await signWithTurnkey(transaction.txBytes);

// 4. Submit to Sui (frontend)
const result = await suiClient.executeTransactionBlock({
  transactionBlock: signed,
  options: { showEffects: true }
});
```

## Notes

- **MVP Status**: Current implementation uses simplified price calculations. Production should integrate actual DeepBook V3 orderbook queries.
- **Gas**: Users pay gas fees. Transactions are unsigned and must be signed by the user's wallet.
- **Slippage**: Frontend calculates `minAmountOut` based on quote and user's slippage tolerance.
- **Network**: Configured for Sui testnet. Update `SUI_NETWORK` in `.env` for other networks.

## Next Steps

1. Integrate actual DeepBook V3 SDK swap methods
2. Implement real-time orderbook depth queries
3. Add advanced order types (limit, stop-loss, DCA)
4. Implement WebSocket for live price updates
5. Add rate limiting and authentication

## License

MIT
