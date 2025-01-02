import React from "react";
import { createRoot } from "react-dom/client";
import { Viewer } from "./Viewer";
import "./index.scss";

const root = createRoot(document.getElementById("root")!);
root.render(<Viewer />);
