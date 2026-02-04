"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";

export default function SettingsPage() {
  const { isConnected } = useWallet();
  const [slippage, setSlippage] = useState("0.5");
  const [notifications, setNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  const handleSave = () => {
    // TODO: Save settings
    console.log("Settings saved:", { slippage, notifications, autoApprove });
  };

  return (
    <>
      <Header />
      <PageWrapper>
        <main className="min-h-screen bg-sui-dark pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-sui-mist">Customize your trading experience</p>
            </div>

            {!isConnected ? (
              <div className="text-center py-20">
                <p className="text-sui-mist text-lg">
                  Please connect your wallet to access settings
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Trading Settings */}
                <Card glass className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Trading Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sui-steel mb-2">
                        Slippage Tolerance (%)
                      </label>
                      <div className="flex gap-2">
                        {["0.1", "0.5", "1.0", "3.0"].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              slippage === value
                                ? "bg-sui-blue text-white"
                                : "bg-white/5 text-sui-mist hover:bg-white/10"
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                        <input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sui-steel text-sm"
                          step="0.1"
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-white/10">
                      <div>
                        <p className="text-sui-steel font-medium">Auto-approve Transactions</p>
                        <p className="text-sm text-sui-mist mt-1">
                          Skip confirmation for small transactions
                        </p>
                      </div>
                      <button
                        onClick={() => setAutoApprove(!autoApprove)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          autoApprove ? "bg-sui-blue" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            autoApprove ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Notification Settings */}
                <Card glass className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sui-steel font-medium">Push Notifications</p>
                      <p className="text-sm text-sui-mist mt-1">
                        Get notified about order fills and price alerts
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications ? "bg-sui-blue" : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          notifications ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </>
  );
}
