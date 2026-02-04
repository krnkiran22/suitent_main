import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import { messageWithIntent } from '@mysten/sui/cryptography';
import { blake2b } from '@noble/hashes/blake2b';
import { bytesToHex } from '@noble/hashes/utils';

// Helper to serialize signature for Sui
function toSerializedSignature({
  signature,
  pubKey,
}: {
  signature: Uint8Array;
  pubKey: Ed25519PublicKey;
}): string {
  const scheme = new Uint8Array([0x00]); // ED25519 flag
  const pubKeyBytes = pubKey.toRawBytes();
  const serialized = new Uint8Array(
    scheme.length + signature.length + pubKeyBytes.length
  );
  serialized.set(scheme, 0);
  serialized.set(signature, scheme.length);
  serialized.set(pubKeyBytes, scheme.length + signature.length);
  return Buffer.from(serialized).toString('base64');
}

// Main signing function to be called with Turnkey client
export async function signAndExecuteSuiTransaction({
  turnkeyClient,
  suiAddress,
  suiPublicKey,
  transaction,
  network = 'testnet',
}: {
  turnkeyClient: any; // TurnkeyClient from useTurnkey hook
  suiAddress: string;
  suiPublicKey: string;
  transaction: Transaction;
  network?: 'mainnet' | 'testnet' | 'devnet';
}) {
  const provider = new SuiJsonRpcClient({ 
    network, 
    url: getJsonRpcFullnodeUrl(network) 
  });
  const publicKey = new Ed25519PublicKey(Buffer.from(suiPublicKey, 'hex'));

  // Build the transaction
  transaction.setSender(suiAddress);
  transaction.setGasPrice(await provider.getReferenceGasPrice());
  transaction.setGasBudget(BigInt(5_000_000));

  const txBytes = await transaction.build({ client: provider });

  // Create the digest for signing
  const intentMsg = messageWithIntent('TransactionData', txBytes);
  const digest = blake2b(intentMsg, { dkLen: 32 });

  // Sign with Turnkey
  const { r, s } = await turnkeyClient.signRawPayload({
    signWith: suiAddress,
    payload: bytesToHex(digest),
    encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
    hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE',
  });

  // Serialize the signature
  const signature = Buffer.from(r + s, 'hex');
  const serialized = toSerializedSignature({ signature, pubKey: publicKey });

  // Execute the transaction
  const result = await provider.executeTransactionBlock({
    transactionBlock: Buffer.from(txBytes).toString('base64'),
    signature: serialized,
    requestType: 'WaitForEffectsCert',
    options: { showEffects: true },
  });

  return result;
}
