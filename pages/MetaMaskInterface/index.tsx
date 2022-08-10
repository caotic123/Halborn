import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useMetamask } from "use-metamask";
import Web3 from "web3";
import styles from "../../styles/Pages.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";

export default function MetaMaskInteface() {
  const { connect, metaState, getAccounts } = useMetamask();
  const [connected, setConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<{ address: string; eths: number }[]>(
    []
  );
  const router = useRouter();

  const updateDetails = async () => {
    const { web3 } = metaState;
    const accounts = await getAccounts();
    return await Promise.all(
      accounts.map(async (account: string) => ({
        address: account,
        eths: web3?.eth
          ? await metaState.web3.eth.getBalance(account)
          : await metaState.web3.getBalance(account),
      }))
    );
  };

  useEffect(() => {
    async function connectWallet() {
      if (connected) {
        if (metaState.isConnected) {
          setConnected(true);
          setDetails(await updateDetails());
          return;
        }

        try {
          setLoading(true);
          await connect(Web3);
          setLoading(false);
          setConnected(true);
        } catch (error) {
          console.log("Error : try reloading this page");
          console.log(error);
        }
      } else {
        setDetails([]);
      }
    }

    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, metaState.isConnected]);

  return (
    <div className={styles.container}>
      <Backdrop
        sx={{ color: "#fff", zIndex: 1000 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
                    <TableCell align="right">Eths</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map(({ address, eths }) => (
                    <TableRow
                      key={address}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {address}
                      </TableCell>
                      <TableCell align="right">{eths}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Button
            variant="contained"
            color="success"
            onClick={async () => setConnected((conex) => !conex)}
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
