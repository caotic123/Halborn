import * as React from "react";
import { NextPage } from "next";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import styles from "../styles/Pages.module.css";
import {
  Backdrop,
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Card from "@mui/material/Card";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Test: NextPage = () => {
  const router = useRouter();
  const { number } = router.query;
  const [input, setInput] = React.useState<string>("");
  const [msg, showMsg] = React.useState({
    visible: false,
    text: "",
    success: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [literal, setLiteral] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadNumberLiteral(number: string) {
      try {
        setLoading(true);
        const converted = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: parseInt(number) }),
        });
        setLoading(false);
        const {literal} = await converted.json();
        setLiteral(literal);
      } catch (e) {
        showMsg({
          visible: true,
          success: false,
          text: "The number needs to be less than 99999",
        });
      }
      return;
    }

    if (
      typeof number == "string" &&
      number.length > 0 &&
      parseInt(number) != NaN
    ) {
      loadNumberLiteral(number);
    }
  }, [number]);

  return (
    <div className={styles.container}>
        <title>
            Test Page - Halborn
        </title>
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
            width: 600,
            height: 600,
          },
        }}
      >
        <Paper className={styles.center}>
          {literal != null && (
            <div className={styles.label}>
              <Card sx={{ minWidth: 275, minHeight: 50 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Result/English : {literal}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          )}

          <Stack spacing={3}>
            <TextField
              label="Number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={input}
              onChange={(event) => {
                const value = event.target.value;
                if (parseInt(value) > 99999) {
                  setInput("99999");
                  showMsg({
                    visible: true,
                    success: false,
                    text: "The number needs to be less than 99999",
                  });
                  return;
                }
                setInput(value);
              }}
            />

            <Button
              variant="contained"
              color="success"
              onClick={() => {
                router.push({
                  pathname: "/test/",
                  query: { number: input },
                });
              }}
            >
              Convert
            </Button>
          </Stack>
        </Paper>
      </Box>
    </div>
  );
};

export default Test;
