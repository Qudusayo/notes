import { Box, Typography } from "@mui/joy";
import React from "react";
import CreateNote from "./CreateNote";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: ["", "", "center"],
        pt: 2,
      }}
      flexDirection={["column", "column", "row"]}
    >
      <div>
        <Typography
          level="h4"
          sx={{
            fontSize: "1.9rem",
            fontWeight: 500,
          }}
        >
          Notes
        </Typography>
        <Typography>
          Create and share your notes with your friends and family.
        </Typography>
      </div>
      <CreateNote type="create" />
    </Box>
  );
}
