import { NextPage } from "next";
import { MetamaskStateProvider } from "use-metamask";
import MetaMaskInterface from ".";

const MetaMask: NextPage = () => {
    return (
      <MetamaskStateProvider>
        <MetaMaskInterface />
      </MetamaskStateProvider>
    );
  };

export default MetaMask