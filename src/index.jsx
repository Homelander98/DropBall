import React from "react";
import { createRoot } from "react-dom/client";
import BallDropGame from "./App";
import "./style.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<BallDropGame />);
