import "@/styles/globals.css";
import joyTheme from "@/theme/joyTheme";
import "@fontsource/inter";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { NoteProvider } from "@/contexts/NoteContext";

const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Decentralized Notes",
  projectId: "8c3db781bcd40742eed0618e5e65e8e8",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <CssVarsProvider defaultMode="system" theme={joyTheme}>
          <CssBaseline />
          <NoteProvider>
            <Component {...pageProps} />
          </NoteProvider>
        </CssVarsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
