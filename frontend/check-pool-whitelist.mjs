import { SuiGrpcClient } from '@mysten/sui/grpc';

// Pool addresses
const DEEP_SUI_POOL = '0x48c95963e9eac37a316b7ae04a0deb761bcdcc2b67912374d6036e7f0e9bae9f';
const SUI_DBUSDC_POOL = '0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33';

const client = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });

async function checkWhitelist(poolAddress, poolName) {
  console.log(`\n🔍 Checking ${poolName}...`);
  console.log(`Pool: ${poolAddress}`);
  
  try {
    // Get pool object
    const pool = await client.getObject({
      id: poolAddress,
      options: {
        showContent: true,
      },
    });

    if (pool.data?.content?.dataType === 'moveObject') {
      const fields = pool.data.content.fields;
      
      // Look for whitelisted field in state or governance
      const state = fields.state;
      console.log('Pool state fields:', JSON.stringify(state, null, 2));
      
      // Check if governance has whitelisted field
      if (state?.fields?.governance?.fields?.whitelisted !== undefined) {
        const isWhitelisted = state.fields.governance.fields.whitelisted;
        console.log(`✅ Whitelisted: ${isWhitelisted}`);
        return isWhitelisted;
      }
    }
  } catch (error) {
    console.error(`❌ Error checking pool: ${error.message}`);
  }
}

console.log('=== DeepBook V3 Pool Whitelist Checker ===');

await checkWhitelist(DEEP_SUI_POOL, 'DEEP_SUI');
await checkWhitelist(SUI_DBUSDC_POOL, 'SUI_DBUSDC');

console.log('\n✅ Done!');
