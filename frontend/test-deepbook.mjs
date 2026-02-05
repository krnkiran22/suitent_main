import { SuiGrpcClient } from '@mysten/sui/grpc';
import { deepbook, DeepBookClient } from '@mysten/deepbook-v3';
import { Transaction } from '@mysten/sui/transactions';

console.log('Testing DeepBook SDK...\n');

const testAddress = '0xb33fb30bf11f051526224aa08dd9e6a3bb8e74fd65d635b4fb92b3907e5b3f34';

console.log('1. Creating SuiGrpcClient and extending...');
const baseClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const extension = deepbook({ address: testAddress });
const extendedClient = baseClient.$extend(extension);

console.log('2. Checking extended client structure...');
console.log('   Type:', typeof extendedClient);
console.log('   Keys:', Object.keys(extendedClient).slice(0, 20));
console.log('   Has deepbook:', 'deepbook' in extendedClient);
console.log('   Has deepBook:', 'deepBook' in extendedClient);

console.log('\n3. Checking what $extend returns...');
console.log('   Extension name:', extension.name);
console.log('   Extension keys:', Object.keys(extension));

// Try to access the registered extension
if (extension.name && extendedClient[extension.name]) {
  console.log(`\n4. Found extension at client.${extension.name}`);
  const dbClient = extendedClient[extension.name];
  console.log('   Type:', typeof dbClient);
  console.log('   Has deepBook:', 'deepBook' in dbClient);
  console.log('   Has swapExactQuoteForBase:', typeof dbClient.deepBook?.swapExactQuoteForBase);
  
  if (dbClient.deepBook?.swapExactQuoteForBase) {
    console.log('\n5. Testing swap...');
    const tx = new Transaction();
    try {
      const result = dbClient.deepBook.swapExactQuoteForBase({
        poolKey: 'DEEP_SUI',
        amount: 0.1,
        deepAmount: 0,
        minOut: 0.05,
      })(tx);
      console.log('   ✅ SUCCESS! Swap works!');
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
  }
} else {
  console.log('\n❌ Extension not found');
  console.log('   Trying all client properties...');
  for (const key of Object.keys(extendedClient).slice(0, 30)) {
    if (extendedClient[key] && typeof extendedClient[key] === 'object' && 'deepBook' in extendedClient[key]) {
      console.log(`   Found deepBook in: ${key}`);
    }
  }
}
