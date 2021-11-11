import { initializeIcons } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainWindow } from "./MainWindow";

function render() {
  initializeIcons();
  ReactDOM.render(<MainWindow />, document.body);
}
render();
