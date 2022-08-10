import type { NextPage } from "next";
import Head from "next/head";
import CardProfile from "../components/Card";
import styles from "../styles/Home.module.css";
import Github from "@mui/icons-material/GitHub";
import CV from "@mui/icons-material/PictureAsPdfOutlined";
import Link from "@mui/icons-material/Link";
import { Box } from "@mui/system";
import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Hallborn</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to my application</h1>

        <p className={styles.description}>
          Tiago Campos Ferreira
        </p>

        <div className={styles.grid}>
          <CardProfile
            title="FullStack Developer"
            subtitle="Since 2018"
            src={"/node-js.png"}
            content={
              <>
                {" "}
                I have worked as a full stack almost 4 years, and my tech skills
                include as a fullstack Node.js, React.js, Typescript, React
                Native, Redux, Next.js, NestJs, Microservices, Docker, Kakfka, RabbitMq, Ether.js,
                Sequelize, Haskell and more... My preferred database is the
                non-relational MongoDB, however, I have also worked with Sqlite
                and ElasticSearch.
              </>
            }
            icons={[[<CV key="CV" />, "/CV_2022.pdf"]]}
          />

          <CardProfile
            title="Functional/Formal Methods"
            subtitle="2021"
            src={"/eth-logo.png"}
            content={
              <>
                I have worked with the formalization of the internal algorithm
                (RLP Encoding) of the Ethereum Virtual Machine in order to
                provide proof that part of Ethereum is mathematically not
                error-prone. This project received a grant from the Ethereum
                Foundation. The proof was made in Kind Language and I have
                started another formalization in Coq proof assistant.
              </>
            }
            icons={[
              [
                <Link key="Ethereum" />,
                "https://blog.ethereum.org/2022/02/15/esp-q3-q4-allocation-update/",
              ],
            ]}
          />

          <CardProfile
            title="OpenSource/ PL Curious"
            subtitle="2021"
            src={"/github.png"}
            content={
              <>
                I like to contribute to open source projects and have personal
                projects. this includes Web apps, Mobile apps, libraries, and
                programming languages. I am PL curious (have worked with compilers, type checkers, dependent types and etc...)
                in love with functional
                programming, async programming, types, and formal methods.
              </>
            }
            icons={[[<Github key="Githib" />, "https://github.com/caotic123"]]}
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 345,
                height: 470,
              },
            }}
          >
            <Paper elevation={3} className={styles.nextCard}>
              <Stack spacing={2}>
                <div>That&apos;s it :)</div>
                <Button variant="contained" color="success" onClick = {() => router.push("/test")}>
                  Code Test Page & API
                </Button>

                <Button variant="contained" onClick={() => router.push("/metamask")}>MetaMask Page</Button>
              </Stack>
            </Paper>
          </Box>
        </div>
      </main>
    </div>
  );
};

export default Home;
