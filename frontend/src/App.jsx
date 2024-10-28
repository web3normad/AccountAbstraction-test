import React, { useState } from "react";
import { ConnectButton, useSendTransaction } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { utils } from "ethers";
import accountAbstractionABI from "../abi.json";

const accountAbstractionAddress = "0x242dD9c49A948FE037CFD1335258e4bD5aA38cDc";
const client = createThirdwebClient({
  clientId: "3892e1dd132c745b196429192dd03438",
});

const chain = {
  rpc: "https://eth-sepolia.g.alchemy.com/v2/o1lEX0VBV5svBnSxttojbhEM0_p6uy4",
};

function App() {
  const [connected, setConnected] = useState(false);
  const { mutate: sendTx } = useSendTransaction();

  const executeTransaction = async () => {
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
        // chain: sepolia,
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

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <ConnectButton
        client={client}
        connectModal={{ size: "compact" }}
        onConnect={() => setConnected(true)}
      />

      {connected && (
        <button className="bg-green-500 py-2 px-4 rounded-lg" onClick={executeTransaction}>
          Execute Transaction
        </button>
      )}
    </div>
  );
}

export default App;