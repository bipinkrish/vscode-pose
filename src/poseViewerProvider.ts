import * as vscode from "vscode";

export class PoseViewerProvider implements vscode.CustomReadonlyEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new PoseViewerProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      PoseViewerProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "poseViewer.pose";
  constructor(private readonly context: vscode.ExtensionContext) {}

  async openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): Promise<{ uri: vscode.Uri; dispose(): void }> {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: { uri: vscode.Uri },
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    const documentUri = webviewPanel.webview.asWebviewUri(document.uri);
    const webviewUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      "out",
      "webview.js"
    );

    webviewPanel.webview.html = `
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          margin: 0px;
          padding: 0px;
        }
      </style>
      <div id="root"></div>
      <script>const documentUri = "${documentUri}";</script>
      <script type="module" src="${webviewPanel.webview.asWebviewUri(
        webviewUri
      )}"></script>
    `;
  }
}
