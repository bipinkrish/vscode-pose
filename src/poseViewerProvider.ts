import * as vscode from 'vscode';

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
        const localSrcUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'src', 'lib', 'pose-viewer.esm.js')
        );

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pose Viewer</title>
                <script type="module">
                    import('https://unpkg.com/pose-viewer@latest/dist/pose-viewer/pose-viewer.esm.js')
                        .catch(() => {
                            const script = document.createElement('script');
                            script.type = 'module';
                            script.src = '${localSrcUri}';
                            document.head.appendChild(script);
                        });
                </script>
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
            </head>
            <body>
                <pose-viewer src="${webviewImageUri}" autoplay loop height=512 width=512></pose-viewer>
            </body>
            </html>`;
    }
}
