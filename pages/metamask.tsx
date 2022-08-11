import dynamic from "next/dynamic";

export default dynamic(
    () => {
      return import("./MetaMaskInterface/index");
    },
    { ssr: false }
  );;
