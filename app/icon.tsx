import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: 6,
          color: "#8b1e2d",
          fontSize: 19,
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: -1.5,
          textShadow:
            "0.6px 0 0 currentColor, -0.6px 0 0 currentColor, 0 0.6px 0 currentColor, 0 -0.6px 0 currentColor",
        }}
      >
        369
      </div>
    ),
    { ...size }
  );
}
