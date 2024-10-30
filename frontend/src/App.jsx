import React, { useState } from "react";
import { 
  ConnectButton, 
  useSendTransaction,
  useConnect
} from "thirdweb/react";
import { 
  inAppWallet,
  createWallet
} from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { utils } from "ethers";
import accountAbstractionABI from "../abi.json";

const accountAbstractionAddress = "0x242dD9c49A948FE037CFD1335258e4bD5aA38cDc";

const client = createThirdwebClient({
  clientId: "3892e1dd132c745b196429192dd03438",
  chains: [sepolia]
});

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram", 
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone"
      ]
    }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet")
];

function App() {
  const [connected, setConnected] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const { mutate: sendTransaction } = useSendTransaction();
  const { mutate: sendTx } = useSendTransaction();


  const handleExecute = async () => {
    if (!client) {
      console.error("No client available. Connect wallet first.");
      return;
    }

    try {
      const contract = {
        address: accountAbstractionAddress,
        abi: accountAbstractionABI,
        chain: sepolia
      };

      const call = {
        contract,
        method: "execute",
        chain: sepolia,
        params: [
          "0xB37D3f4815ba9ca3e2872e8867902E156aCD7E65",
          utils.parseEther("0.01").toString(),
          "0x",
        ],
      };

      sendTx(call);
      console.log("Transaction sent!");
    } catch (error) {
      console.error(`Transaction failed: ${error.message}`);
    }
  };

  const handleGetEntryPoint = async () => {
    try {
      const call = {
        contract: {
          address: accountAbstractionAddress,
          abi: accountAbstractionABI,
          chain: sepolia
        },
        method: "getEntryPoint",
        params: []
      };
      const result = await sendTransaction(call);
      console.log("Entry Point:", result);
    } catch (error) {
      console.error("Error getting entry point:", error);
    }
  };

  const handleRenounceOwnership = async () => {
    try {
      const call = {
        contract: {
          address: accountAbstractionAddress,
          abi: accountAbstractionABI,
          chain: sepolia
        },
        method: "renounceOwnership",
        params: []
      };
      await sendTransaction(call);
    } catch (error) {
      console.error("Error renouncing ownership:", error);
    }
  };

  const handleTransferOwnership = async (newOwnerAddress) => {
    try {
      const call = {
        contract: {
          address: accountAbstractionAddress,
          abi: accountAbstractionABI,
          chain: sepolia
        },
        method: "transferOwnership",
        params: [newOwnerAddress]
      };
      await sendTransaction(call);
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };

  const handleValidateUserOp = async (userOp, userOpHash, missingAccountFunds) => {
    try {
      const call = {
        contract: {
          address: accountAbstractionAddress,
          abi: accountAbstractionABI,
          chain: sepolia
        },
        method: "validateUserOp",
        params: [userOp, userOpHash, missingAccountFunds]
      };
      await sendTransaction(call);
    } catch (error) {
      console.error("Error validating user operation:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <div className="w-full flex flex-col items-center justify-center max-w-md space-y-4">
        <ConnectButton
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          onConnect={() => setConnected(true)}
        />
        
        {connected && (
          <div className="space-y-4 ">
            <button 
              onClick={handleExecute}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Execute
            </button>
            
            <button 
              onClick={handleGetEntryPoint}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Get EntryPoint
            </button>
            
            <button 
              onClick={handleRenounceOwnership}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Renounce Ownership
            </button>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="New Owner Address"
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={() => handleTransferOwnership(newOwner)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Transfer Ownership
              </button>
            </div>
            
            <button
              onClick={() =>
                handleValidateUserOp(
                  {
                    sender: "0xB37D3f4815ba9ca3e2872e8867902E156aCD7E65",
                    nonce: 1,
                    initCode: "0x",
                    callData: "0x",
                    accountGasLimits: "0x",
                    preVerificationGas: 1,
                    gasFees: "0x",
                    paymasterAndData: "0x",
                    signature: "0x",
                  },
                  "0x1234567890abcdef",
                  1
                )
              }
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Validate UserOp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;