"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

import { Button, Drawer } from "@heroui/react";

import Footer from "./Footer";
import NavBar from "./nav-bar";
import Sidebar from "./Sidebar";

import AudioPlayer from "./AudioPlayer/AudioPlayer";
import VideoBackground from "./VideoBackground";

import { FavoriteTracksProvider } from "../context/FavoriteTracksContext";
import { PlaybackProvider } from "../context/PlaybackContext";
import { TrackListProvider } from "../context/TrackListContext";
import { TrackManagerProvider } from "../context/TrackManagerContext";

/* -------------------- */
/* PROVIDERS */
/* -------------------- */

function AppProviders({ children }) {
  return (
    <FavoriteTracksProvider>
      <TrackListProvider>
        <TrackManagerProvider>
          <PlaybackProvider>{children}</PlaybackProvider>
        </TrackManagerProvider>
      </TrackListProvider>
    </FavoriteTracksProvider>
  );
}

/* -------------------- */
/* MOBILE SIDEBAR DRAWER */
/* -------------------- */

function MobileSidebarDrawer() {
  return (
    <Drawer>
      <Button
        isIconOnly
        variant="light"
        className="text-primary sm:hidden"
        aria-label="Open sidebar menu"
      >
        <Menu size={24} />
      </Button>

      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="w-max">
          <Drawer.Dialog className="bg-background w-max p-0">
            <Drawer.Body className="p-0">
              <Sidebar
                className="h-screen !w-64"
                classNames={{
                  logo: "mr-8",
                }}
              />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

/* -------------------- */
/* APP LAYOUT */
/* -------------------- */

export default function App({ children }) {
  const pathname = usePathname();

  return (
    <AppProviders>
      <div
        id="App"
        className="text-foreground relative isolate flex h-dvh min-h-0 flex-col overflow-hidden"
      >
        <VideoBackground playVideo={pathname === "/home"} />

        <Toaster position="bottom-center" />

        <Sidebar className="fixed top-0 left-0 z-40 hidden h-full !w-64 sm:flex" />

        <div className="ml-0 flex min-h-0 flex-1 flex-col transition-all sm:ml-64">
          <NavBar LeftContent={<MobileSidebarDrawer />} />

          <main
            id="Full_Content"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
          >
            <section
              id="content"
              className="flex min-h-0 min-w-72 flex-1 flex-col items-center overflow-auto p-4 *:max-w-full"
            >
              {children}
            </section>

            <section
              id="Audio_Player_Section"
              className="hidden shrink-0 md:block"
            >
              <AudioPlayer className="mx-auto" />
            </section>

            <footer
              id="Bottom_Content"
              className="flex shrink-0 flex-col items-center gap-8"
            >
              <Footer />
            </footer>
          </main>
        </div>
      </div>
    </AppProviders>
  );
}
