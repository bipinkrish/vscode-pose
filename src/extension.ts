import * as vscode from "vscode";
import { PoseViewerProvider } from "./poseViewerProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(PoseViewerProvider.register(context));
}
