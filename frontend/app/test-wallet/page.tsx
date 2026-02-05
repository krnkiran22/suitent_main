'use client';

import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

export default function TestWalletPage() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [status, setStatus] = useState('');
  const [digest, setDigest] = useState('');

  const testSwap = async () => {
    if (!currentAccount) {
      setStatus('❌ Please connect wallet first');
      return;
    }

    setStatus('⏳ Building transaction...');

    try {
      // Build transaction via backend (same as Turnkey)
      const buildRes = await fetch('http://localhost:3001/api/swap/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: currentAccount.address,
          tokenIn: 'SUI',
          tokenOut: 'DEEP',
          amountIn: '0.2',
          minAmountOut: '7.0',
        }),
      });

      const buildData = await buildRes.json();
      const txBytes = buildData.transaction.txBytes;

      setStatus('⏳ Signing with standard wallet...');

      // Sign and execute with standard wallet (Suiet, Sui Wallet, etc.)
      signAndExecute(
        {
          transaction: Transaction.from(Buffer.from(txBytes, 'base64')),
        },
        {
          onSuccess: (result) => {
            console.log('✅ Transaction successful:', result);
            setDigest(result.digest);
            setStatus(`✅ Success! Digest: ${result.digest}`);
          },
          onError: (error) => {
            console.error('❌ Transaction failed:', error);
            setStatus(`❌ Failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test Standard Wallet</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connect Standard Sui Wallet</h2>
          <p className="text-gray-400 mb-4">
            This tests the swap with <strong>Suiet</strong>, <strong>Sui Wallet</strong>, or other standard wallets
            instead of Turnkey.
          </p>
          
          <ConnectButton />
          
          {currentAccount && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="text-sm text-gray-300">Connected Address:</p>
              <p className="font-mono text-xs break-all">{currentAccount.address}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Swap: 0.2 SUI → DEEP</h2>
          <p className="text-gray-400 mb-4">
            This will execute the <strong>exact same transaction</strong> as your Turnkey wallet,
            but signed by a standard wallet. If it works here, the issue is Turnkey-specific.
          </p>
          
          <button
            onClick={testSwap}
            disabled={!currentAccount}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition"
          >
            {currentAccount ? 'Execute Swap' : 'Connect Wallet First'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="text-sm whitespace-pre-wrap">{status}</p>
            </div>
          )}

          {digest && (
            <div className="mt-4">
              <a
                href={`https://testnet.suiscan.xyz/tx/${digest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                View on Suiscan →
              </a>
            </div>
          )}
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 What to test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Install <strong>Suiet</strong> or <strong>Sui Wallet</strong> browser extension</li>
            <li>Make sure you have testnet SUI (at least 0.3 SUI)</li>
            <li>Click "Connect Wallet" and connect your standard wallet</li>
            <li>Click "Execute Swap" and approve in wallet</li>
            <li>Check if DEEP tokens appear in your balance</li>
            <li>Compare Suiscan transaction with Turnkey's transaction</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-400 hover:underline"
          >
            ← Back to main app (Turnkey)
          </a>
        </div>
      </div>
    </div>
  );
}
