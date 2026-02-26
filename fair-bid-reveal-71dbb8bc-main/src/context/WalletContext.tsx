import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AccountInterface } from "starknet";

interface WalletContextType {
  account: AccountInterface | null;
  address: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  address: "",
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const starknet = (window as any).starknet;

      if (!starknet) {
        alert(
          "No StarkNet wallet detected! Install Ready Wallet, Braavos, or Voyager."
        );
        return;
      }

      // Check supported wallets
      const isSupported =
        starknet.isReady || starknet.isBraavos || starknet.isVoyager;

      if (!isSupported) {
        alert("Detected wallet is not supported.");
        return;
      }

      // Enable wallet (shows modal)
      await starknet.enable({ showModal: true });

      setAccount(starknet.account || null);
      setAddress(starknet.selectedAddress || "");
      setIsConnected(true);

      // Listen for account changes
      starknet.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          disconnectWallet();
        }
      });
    } catch (err) {
      console.error("Wallet connect error:", err);
      alert("Failed to connect wallet. Try again.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAddress("");
    setIsConnected(false);
  };

  // Auto-connect if wallet already connected
  useEffect(() => {
    const starknet = (window as any).starknet;
    if (starknet && starknet.selectedAddress) {
      setAccount(starknet.account || null);
      setAddress(starknet.selectedAddress || "");
      setIsConnected(true);

      starknet.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          disconnectWallet();
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, address, connectWallet, disconnectWallet, isConnected }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);