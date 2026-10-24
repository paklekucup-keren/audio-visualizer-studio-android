import React from "react";
import { visualizerHtml } from "@/lib/visualizer-html";

const IFrame = "iframe" as unknown as React.ComponentType<{
  title: string;
  srcDoc: string;
  style: React.CSSProperties;
}>;

export default function WebPreview() {
  return (
    <IFrame
      title="Audio Visualizer Studio preview"
      srcDoc={visualizerHtml}
      style={{ width: "100%", height: "100%", border: 0, background: "#080b10" }}
    />
  );
}
