'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import type { WalletSelector, AccountState } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accounts: AccountState[];
  accountId: string | null;
}

const WalletSelectorContext = createContext<WalletSelectorContextValue>({
  selector: null,
  modal: null,
  accounts: [],
  accountId: null,
});

export function WalletSelectorProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const _selector = await setupWalletSelector({
        network: "testnet",
        modules: [
          setupMyNearWallet(),
          setupSender(),
          // WORKAROUND for version mismatch in @near-wallet-selector packages.
          // This may cause runtime errors. Aligning versions is recommended.
          setupMeteorWallet() as any,
        ],
      });

      const _modal = setupModal(_selector, {
        contractId: "v1.campaigns.staging.potlock.near", // Replace with your contract ID
      });

      const state = _selector.store.getState();
      setAccounts(state.accounts);
      setAccountId(state.accounts[0]?.accountId || null);

      window.selector = _selector;
      window.modal = _modal;

      setSelector(_selector);
      setModal(_modal);
    };

    init().catch((err) => {
      console.error("Failed to initialize wallet selector:", err);
    });
  }, []);

  useEffect(() => {
    if (!selector) return;

    const subscription = selector.store.observable.subscribe((state) => {
      setAccounts(state.accounts);
      setAccountId(state.accounts[0]?.accountId || null);
    });

    return () => subscription.unsubscribe();
  }, [selector]);

  return (
    <WalletSelectorContext.Provider value={{ selector, modal, accounts, accountId }}>
      {children}
    </WalletSelectorContext.Provider>
  );
}

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);
  if (!context) {
    throw new Error("useWalletSelector must be used within a WalletSelectorProvider");
  }
  return context;
} 