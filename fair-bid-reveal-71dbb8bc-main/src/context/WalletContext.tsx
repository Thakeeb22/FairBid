import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AccountInterface } from "starknet";

interface WalletContextType {
  account: AccountInterface | null;
  address: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  address: "",
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [address, setAddress] = useState("");

  // Connect Argent X
  const connectWallet = async () => {
    try {
      if (!(window as any).starknet) {
        alert("Please install Argent X wallet!");
        return;
      }

      const starknet = (window as any).starknet;

      // enable wallet (shows modal)
      await starknet.enable({ showModal: true });

      setAccount(starknet.account);
      setAddress(starknet.selectedAddress);

      // Listen for account changes
      starknet.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) setAddress(accounts[0]);
        else disconnectWallet();
      });
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAddress("");
  };

  // Check if already connected on load
  useEffect(() => {
    const starknet = (window as any).starknet;
    if (starknet && starknet.selectedAddress) {
      setAccount(starknet.account);
      setAddress(starknet.selectedAddress);

      // Listen for account changes
      starknet.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) setAddress(accounts[0]);
        else disconnectWallet();
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, address, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);