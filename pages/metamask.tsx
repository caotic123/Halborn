import { NextPage } from "next";
import dynamic from "next/dynamic";
import { MetamaskStateProvider } from "use-metamask";

const MetaMaskInterface = dynamic(
  () => {
    return import("./MetaMaskInterface/index");
  },
  { ssr: false }
);

const MetaMask: NextPage = () => {
  return (
    <MetamaskStateProvider>
      <MetaMaskInterface />
    </MetamaskStateProvider>
  );
};

export default MetaMask;
