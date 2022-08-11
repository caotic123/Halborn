import { NextPage } from "next";
import dynamic from "next/dynamic";
import { MetamaskStateProvider } from "use-metamask";

export default dynamic(
    () => {
      return import("./MetaMaskInterface/home");
    },
    { ssr: false }
  );;
