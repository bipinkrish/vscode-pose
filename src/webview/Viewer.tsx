import React, { useState, useRef } from "react";
import { PoseViewer } from "react-pose-viewer";

export const Viewer: React.FC = () => {
  // @ts-expect-error magic
  const documentSrc = documentUri;
  const viewer = useRef(null);
  const [counter, setCounter] = useState(0);
  const savedSettings = localStorage.getItem("poseViewerSettings");
  const parsedSettings = savedSettings ? JSON.parse(savedSettings) : null;
  const defaultSettings = {
    aspectRatio: "1",
    background: "transparent",
    height: 512,
    width: 512,
    autoplay: true,
    loop: true,
    playbackRate: 1,
    thickness: 2,
  };
  const initialSettings = parsedSettings ?? defaultSettings;
  const [settings, setSettings] = useState(initialSettings);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("poseViewerSettings", JSON.stringify(newSettings));
    if (["aspectRatio", "width", "height", "autoplay", "loop"].includes(key)) {
      setCounter((prev) => prev + 1);
    }
  };

  return (
    <div className="vscode-react-pose-viewer">
      <div className="viewer-container">
        <PoseViewer
          key={counter}
          ref={viewer}
          src={documentSrc}
          {...settings}
        />
      </div>
        <div className="floating-controls">
          <div className="control-group">
            <label>Aspect Ratio</label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => handleChange("aspectRatio", e.target.value)}
            >
              <option value="1">1:1</option>
              <option value="1.33">4:3</option>
              <option value="1.77">16:9</option>
            </select>
          </div>

          <div className="control-group">
            <label>Size</label>
            <div className="size-inputs">
              <input
                type="number"
                value={settings.width}
                onChange={(e) => handleChange("width", parseInt(e.target.value))}
              />
              <span>x</span>
              <input
                type="number"
                value={settings.height}
                onChange={(e) => handleChange("height", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <label>Thickness</label>
            <select
              value={settings.thickness}
              onChange={(e) =>
                handleChange("thickness", parseInt(e.target.value))
              }
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Background</label>
            <input
              type="color"
              value={settings.background}
              onChange={(e) => handleChange("background", e.target.value)}
            />
          </div>

          <div className="control-group">
            <label>Playback</label>
            <div className="playback-controls">
              <button
                className={settings.autoplay ? "active" : ""}
                onClick={() => handleChange("autoplay", !settings.autoplay)}
              >
                Autoplay
              </button>
              <button
                className={settings.loop ? "active" : ""}
                onClick={() => handleChange("loop", !settings.loop)}
              >
                Loop
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Playback Rate</label>
            <input
              type="range"
              min="0.25"
              max="5"
              step="0.25"
              value={settings.playbackRate}
              onChange={(e) =>
                handleChange("playbackRate", parseFloat(e.target.value))
              }
            />
            <span className="pb-rate">{settings.playbackRate}x</span>
          </div>
        </div>
    </div>
  );
};
