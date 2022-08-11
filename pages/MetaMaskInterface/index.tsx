import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import styles from "../../styles/Pages.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Alert, Button, Snackbar } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { BigNumber, ethers, providers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

/**
 * Defines the MetaMask Viewer Wrapped by a use-metamask context
 * @name MetaMaskInteface
 * @component
 */

const useEtherMetaMask = () => {
  const [signer, setSigner] = useState<{
    state: ethers.providers.Web3Provider;
    accounts: string[];
  } | null>(null);

  return {
    connect: async () => {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const provider = new ethers.providers.Web3Provider(
        (window as Record<string, any>).ethereum
      );
      const { provider: ethereum } = provider;

      // MetaMask requires requesting permission to connect users accounts
      const accounts = await provider.send("eth_requestAccounts", []);

      (ethereum as any).on("accountsChanged", (accounts: Array<any>) => {
        if (accounts.length == 0) {
          setSigner(null);
        }
      });
      setSigner({
        state: provider,
        accounts,
      });
    },
    getBalanceFromAccounts: (): Promise<
      { address: string; eths: string; code: string }[]
    > => {
      if (signer == null) {
        throw Error("Not connected");
      }

      return Promise.all(
        signer.accounts.map(async (address: string) => ({
          address,
          code: await signer.state.getCode(address),
          eths: formatUnits(await signer.state.getBalance(address), "ether"),
        }))
      );
    },
    isConnected: signer != null,
    disconnect: () => {
      const provider = new ethers.providers.Web3Provider(
        (window as Record<string, any>).ethereum
      );
      setSigner(null);
    },
  };
};

export default function MetaMaskInteface() {
  const { connect, disconnect, isConnected, getBalanceFromAccounts } =
    useEtherMetaMask();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<
    { address: string; eths: string; code: string }[]
  >([]);
  const [msg, showMsg] = useState({
    visible: false,
    text: "",
    success: false,
  });

  useEffect(() => {
    connect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function addDetails() {
      setDetails(
        isConnected
          ? await getBalanceFromAccounts()
          : [{ address: "Off", eths: "0", code: "off" }]
      );
    }

    addDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <Backdrop
        sx={{ color: "#fff", zIndex: 1000 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={msg.visible}
        autoHideDuration={6000}
        onClose={() => showMsg((prev) => ({ ...prev, visible: false }))}
      >
        <Alert
          onClose={() => showMsg((prev) => ({ ...prev, visible: false }))}
          severity={msg.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {msg.text}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 1000,
            height: 600,
          },
        }}
      >
        <Paper className={styles.center}>
          <div style={{ height: 400, width: "96%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Code</TableCell>
                    <TableCell align="right">Eths</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map(({ address, eths, code }) => (
                    <TableRow
                      key={address}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {address}
                      </TableCell>
                      <TableCell align="right">{code}</TableCell>
                      <TableCell align="right">{eths} Eths</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              if (isConnected) {
                disconnect();
                return;
              }
              try {
                connect();
              } catch (e) {
                const error = e as {
                  code: number;
                  msg: string;
                };
                if (error.code == -32002) {
                  showMsg({
                    visible: true,
                    text: "Metamask already open",
                    success: false,
                  });
                }
              }
            }}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
