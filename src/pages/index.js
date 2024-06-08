import * as React from "react";
import { useRouter } from "next/router";

// MUI 불러오기
import Grid from '@mui/material/Grid';

import LoginPage from "../views/LoginPage";

export default function Home(props) {
  const router = useRouter();

  const handleJoinRoom = (room_, name_, option) => {
    switch (option) {
      case "join":
        router.push(`/${room_}?name=${name_}`);
        break;
      case "tutorial":
        router.push("tutorial");
        break;
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      my={20}
    >
      <LoginPage type="home" btnFunction={handleJoinRoom} />
    </Grid>
  );
}