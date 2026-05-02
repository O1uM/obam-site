import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoxDrop — Video Transcription — obam.ai",
  description:
    "VoxDrop — paste a video link or upload a file to get an AI-generated transcript with timestamps, plain text, or SRT subtitles.",
};

export default function VoxDropPage() {
  return (
    <iframe
      src="/voxdrop.html"
      title="VoxDrop — Video Transcription"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 1,
      }}
    />
  );
}
