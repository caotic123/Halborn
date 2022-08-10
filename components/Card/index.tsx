import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import styles from "./card.module.css";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useRouter } from "next/router";
import ReactDOM from "react-dom";
import { Stack } from "@mui/material";

type PropsCard = {
  title: string;
  subtitle: string;
  src: string;
  content: ReactJSXElement;
  icons: [ReactJSXElement, string][];
};

export default function CardProfile({
  title,
  subtitle,
  src,
  content,
  icons = [],
}: PropsCard) {
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 345, height: 470 }}>
      <CardHeader
        avatar={<Avatar src="me.jpeg" />}
        action={icons.map(([icon, link]) => (
          <Stack flexDirection="row" key={link}>
            <IconButton
              onClick={() => {
                router.push(link);
              }}
            >
              {icon}
            </IconButton>
          </Stack>
        ))}
        title={title}
        subheader={subtitle}
      />
      <div className={styles.container}>
        <Image src={src} width={194} height={194} alt="" />
      </div>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
