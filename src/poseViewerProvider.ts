import * as vscode from 'vscode';
import { getNonce } from './util';

export class PoseViewerProvider implements vscode.CustomReadonlyEditorProvider {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new PoseViewerProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            PoseViewerProvider.viewType,
            provider
        );
        return providerRegistration;
    }

    private static readonly viewType = 'poseViewer.pose';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<{ uri: vscode.Uri, dispose(): void }> {
        return { uri, dispose: () => { } };
    }

    async resolveCustomEditor(
        document: { uri: vscode.Uri },
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document.uri);
    }

    private getHtmlForWebview(webview: vscode.Webview, imageUri: vscode.Uri): string {
        const webviewImageUri = webview.asWebviewUri(imageUri);
        const nonce = getNonce();

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval' https://unpkg.com; connect-src ${webview.cspSource};">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pose Viewer</title>
                <script nonce="${nonce}" src="https://unpkg.com/pose-viewer@latest/dist/pose-viewer/pose-viewer.esm.js" type="module"></script>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        width: 100vw;
                        margin: 0px;
                        padding: 0px;
                        background-color: var(--vscode-editor-background);
                    }
                </style>
            </head>
            <body>
                <pose-viewer src="${webviewImageUri}" autoplay loop height=512 width=512></pose-viewer>
            </body>
            </html>`;
    }
}