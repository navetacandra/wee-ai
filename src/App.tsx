import { HashRouter, Route, Routes } from "react-router-dom";
import GenerateImage from "./pages/generate-image";
import Chat from "./pages/chat";
import { useEffect } from "react";
import DevtoolAlert from "./pages/devtool-alert";

export default function App() {
  useEffect(() => {
    const disableDevtool = ["chat", "image"];
    const detector = setInterval(() => {
      const currentPath = window.location.hash.replace("#/", "");
      if (!disableDevtool.includes(currentPath)) {
        return;
      }

      const time = Date.now();
      (() => {
        // eslint-disable-next-line no-debugger
        debugger;
      })();
      if (Date.now() - time > 100) {
        window.location.href = `/#/devtool?back=${currentPath}`;
      }
    }, 500);

    return () => {
      clearInterval(detector);
    };
  }, []);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/image" element={<GenerateImage />} />
          <Route path="/devtool" element={<DevtoolAlert />} />
        </Routes>
      </HashRouter>
    </>
  );
}
