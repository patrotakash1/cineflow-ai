"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

interface Scene {
  scene_number: number;
  heading: string;
  location: string;
  time_of_day: string;
  characters: string[];
  action: string;
}

interface ScriptResult {
  filename: string;
  total_scenes: number;
  scenes: Scene[];
}

export default function ScriptAnalyzerPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/script/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc", ".docx"],
      "application/octet-stream": [".docx"],
    },
    maxFiles: 1,
  });

  function handleGenerateSchedule() {
    if (!result) return;
    // Save scenes to localStorage so schedule page can pick them up
    localStorage.setItem("script_scenes", JSON.stringify(result.scenes));
    localStorage.setItem("script_filename", result.filename);
    router.push("/schedule");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080810", color: "white", padding: "40px 24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#C9A84C", marginBottom: "8px" }}>
          🎬 Script Analyzer
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "40px" }}>
          Upload your screenplay (PDF or DOCX) and we'll extract every scene automatically.
        </p>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? "#C9A84C" : "#334155"}`,
            borderRadius: "12px",
            padding: "60px 40px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#1a1a2e" : "#0f0f1a",
            transition: "all 0.2s ease",
            marginBottom: "40px",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
          {uploading ? (
            <p style={{ color: "#C9A84C", fontSize: "18px" }}>⏳ Analyzing your script...</p>
          ) : isDragActive ? (
            <p style={{ color: "#C9A84C", fontSize: "18px" }}>Drop it here!</p>
          ) : (
            <>
              <p style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}>
                Drag & drop your screenplay here
              </p>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                or click to browse — PDF and DOCX supported
              </p>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "#2d0a0a",
            border: "1px solid #7f1d1d",
            borderRadius: "8px",
            padding: "16px",
            color: "#fca5a5",
            marginBottom: "32px"
          }}>
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Summary Bar */}
            <div style={{
              backgroundColor: "#0f0f1a",
              border: "1px solid #C9A84C",
              borderRadius: "12px",
              padding: "20px 28px",
              marginBottom: "32px",
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>FILENAME</p>
                  <p style={{ color: "white", fontWeight: "600" }}>{result.filename}</p>
                </div>
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>TOTAL SCENES</p>
                  <p style={{ color: "#C9A84C", fontWeight: "700", fontSize: "24px" }}>{result.total_scenes}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {/* Generate Schedule Button */}
                <button
                  onClick={handleGenerateSchedule}
                  style={{
                    background: "#C9A84C",
                    color: "#080810",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  📅 Generate Schedule
                </button>
                <button
                  onClick={() => { setResult(null); setError(null); }}
                  style={{
                    background: "transparent",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ↩ Upload New Script
                </button>
              </div>
            </div>

            {/* Scene Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {result.scenes.map((scene) => (
                <div
                  key={scene.scene_number}
                  style={{
                    backgroundColor: "#0f0f1a",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{
                      backgroundColor: "#C9A84C",
                      color: "#080810",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}>
                      SCENE {scene.scene_number}
                    </span>
                    <span style={{
                      backgroundColor: "#1e293b",
                      color: "#94a3b8",
                      borderRadius: "6px",
                      padding: "2px 10px",
                      fontSize: "12px",
                    }}>
                      {scene.time_of_day}
                    </span>
                  </div>

                  <p style={{ color: "#C9A84C", fontWeight: "600", marginBottom: "8px", fontFamily: "monospace" }}>
                    {scene.heading}
                  </p>

                  {scene.action && (
                    <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "12px", lineHeight: "1.6" }}>
                      {scene.action.length > 200 ? scene.action.substring(0, 200) + "..." : scene.action}
                    </p>
                  )}

                  {scene.characters.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {scene.characters.map((char, i) => (
                        <span key={i} style={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #334155",
                          color: "#e2e8f0",
                          borderRadius: "20px",
                          padding: "2px 12px",
                          fontSize: "12px",
                        }}>
                          👤 {char}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}