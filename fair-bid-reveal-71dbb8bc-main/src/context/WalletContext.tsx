import React, { createContext, useContext, useState, useEffect } from "react";
import { AccountInterface } from "starknet";

interface WalletContextType {
  account: AccountInterface | null;
  address: string;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  address: "",
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (!(window as any).starknet) {
        alert("Please install Argent X wallet!");
        return;
      }

      const starknet = (window as any).starknet;
      await starknet.enable({ showModal: true });
      setAccount(starknet.account);
      setAddress(starknet.selectedAddress);
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  useEffect(() => {
    if ((window as any).starknet && (window as any).starknet.isConnected) {
      setAccount((window as any).starknet.account);
      setAddress((window as any).starknet.selectedAddress);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, address, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);