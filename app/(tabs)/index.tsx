import { useRef } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { handleNativeFileMessage } from "@/lib/native-file-transfer";
import { visualizerHtml } from "@/lib/visualizer-html";

const LOCAL_ASSET_ROOT = "file:///android_asset/";

export default function HomeScreen() {
  const webView = useRef<WebView>(null);
  const source = { html: visualizerHtml, baseUrl: LOCAL_ASSET_ROOT };

  const handleMessage = async (event: WebViewMessageEvent) => {
    if (!event.nativeEvent.url.startsWith(LOCAL_ASSET_ROOT)) return;
    await handleNativeFileMessage(event.nativeEvent.data, (reply) => {
      const payload = JSON.stringify(reply).replace(/</g, "\\u003c");
      webView.current?.injectJavaScript(`window.__AudioVizNativeResponse(${payload});true;`);
    });
  };

  if (Platform.OS !== "android") {
    return (
      <View style={styles.fallback}>
        <Text style={styles.title}>Audio Visualizer Studio</Text>
        <Text style={styles.copy}>
          Versi offline ini tersedia sebagai APK Android dan aplikasi desktop Windows.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <WebView
        source={source}
        ref={webView}
        onMessage={handleMessage}
        originWhitelist={["file://*"]}
        onShouldStartLoadWithRequest={({ url }) => url.startsWith(LOCAL_ASSET_ROOT)}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs={false}
        allowUniversalAccessFromFileURLs={false}
        setSupportMultipleWindows={false}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="never"
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#36e3cf" size="large" />
            <Text style={styles.copy}>Menyiapkan studio offline…</Text>
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080b10" },
  webview: { flex: 1, backgroundColor: "#080b10" },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080b10",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080b10",
    padding: 24,
  },
  title: { color: "#f2f6fb", fontSize: 22, fontWeight: "700" },
  copy: { color: "#aebaca", fontSize: 13, textAlign: "center", marginTop: 12, lineHeight: 20 },
});
