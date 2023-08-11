import { extendTheme } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface PalettePrimaryOverrides {
    50: false;
  }
}

const joyTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        danger: {
          "700": "#F4212E",
        },
        warning: {
          "700": "#efce45",
        },
      },
    },
    dark: {
      palette: {},
    },
  },
});

export default joyTheme;
