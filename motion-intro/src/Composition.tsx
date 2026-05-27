import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  bg: "#08111f",
  bgGlow: "#112444",
  teal: "#39d8b6",
  blue: "#2663ff",
  cream: "#f4f0e8",
  ink: "#d7e3f7",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const GlowOrb: React.FC<{
  size: number;
  color: string;
  left: string;
  top: string;
  opacity: number;
  blur: number;
  scale?: number;
}> = ({ size, color, left, top, opacity, blur, scale = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    />
  );
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoPop = spring({
    fps,
    frame,
    config: {
      damping: 18,
      stiffness: 120,
      mass: 0.9,
    },
  });

  const logoScale = interpolate(logoPop, [0, 1], [0.28, 0.96], clamp);
  const logoRotate = interpolate(frame, [0, 1.65 * fps], [-18, 408], {
    ...clamp,
    easing: easeInOut,
  });
  const logoOpacity = interpolate(frame, [0, 0.4 * fps, 2.1 * fps], [0, 1, 0], {
    ...clamp,
    easing: easeOut,
  });
  const logoY = interpolate(frame, [0, 1.7 * fps], [80, -10], {
    ...clamp,
    easing: easeOut,
  });

  const introLightOpacity = interpolate(frame, [0, 1.6 * fps, 2.4 * fps], [1, 1, 0], {
    ...clamp,
    easing: easeOut,
  });

  const introLightScale = interpolate(frame, [0, 2.3 * fps], [1, 1.08], {
    ...clamp,
    easing: easeInOut,
  });

  const bloomScale = interpolate(frame, [0.9 * fps, 2.45 * fps], [0.3, 4.2], {
    ...clamp,
    easing: easeOut,
  });
  const bloomOpacity = interpolate(frame, [0.8 * fps, 1.8 * fps, 2.7 * fps], [0, 0.95, 0], {
    ...clamp,
    easing: easeOut,
  });

  const teachingOpacity = interpolate(frame, [1.4 * fps, 2.7 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const teachingScale = interpolate(frame, [1.4 * fps, 5 * fps], [1.1, 1], {
    ...clamp,
    easing: easeOut,
  });
  const teachingX = interpolate(frame, [1.4 * fps, 5 * fps], [24, 0], {
    ...clamp,
    easing: easeOut,
  });

  const quoteOpacity = interpolate(frame, [2.4 * fps, 3 * fps, 5 * fps], [0, 1, 1], {
    ...clamp,
    easing: easeOut,
  });
  const quoteY = interpolate(frame, [2.4 * fps, 3.2 * fps], [28, 0], {
    ...clamp,
    easing: easeOut,
  });

  const quoteLineWidth = interpolate(frame, [2.5 * fps, 3.4 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: `radial-gradient(circle at 50% 18%, rgba(37,99,255,0.18), transparent 34%), linear-gradient(160deg, ${COLORS.bg} 0%, #050b14 48%, #0b1e39 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: introLightOpacity,
          transform: `scale(${introLightScale})`,
          background:
            "radial-gradient(circle at 18% 16%, rgba(57,216,182,0.18), transparent 22%), radial-gradient(circle at 84% 18%, rgba(38,99,255,0.16), transparent 24%), linear-gradient(180deg, #fffdf8 0%, #f5efe3 58%, #ede5d7 100%)",
        }}
      />

      <GlowOrb
        size={width * 0.56}
        color="rgba(57, 216, 182, 0.18)"
        left="18%"
        top="18%"
        opacity={0.85}
        blur={120}
      />
      <GlowOrb
        size={width * 0.44}
        color="rgba(38, 99, 255, 0.14)"
        left="82%"
        top="80%"
        opacity={0.9}
        blur={90}
      />

      <AbsoluteFill
        style={{
          opacity: bloomOpacity,
          transform: `scale(${bloomScale})`,
          transformOrigin: "50% 30%",
        }}
      >
        <GlowOrb
          size={width * 0.34}
          color="rgba(57, 216, 182, 0.85)"
          left="50%"
          top="30%"
          opacity={0.8}
          blur={48}
        />
        <GlowOrb
          size={width * 0.3}
          color="rgba(38, 99, 255, 0.72)"
          left="50%"
          top="30%"
          opacity={0.75}
          blur={80}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 560,
            height: 560,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            filter: "drop-shadow(0 18px 42px rgba(12, 18, 26, 0.16))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "16%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
            }}
          />
          <Img
            src={staticFile("HappyAIPath-small-2x.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: teachingOpacity }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(8,17,31,0.78) 0%, rgba(8,17,31,0.54) 34%, rgba(8,17,31,0.18) 58%, rgba(8,17,31,0.42) 100%)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${teachingScale}) translateX(${teachingX}px)`,
          }}
        >
          <Img
            src={staticFile("osu-jim-teaching.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              filter: "saturate(1.02) contrast(1.04)",
            }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "space-between",
          padding: "110px 120px 96px",
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: COLORS.ink,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 84 * quoteLineWidth,
              height: 4,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.blue})`,
            }}
          />
          Happy AI Path
        </div>

        <div
          style={{
            width: "58%",
            maxWidth: 980,
            marginTop: 36,
          }}
        >
          <div
            style={{
              color: COLORS.cream,
              fontFamily: "Georgia, Times New Roman, serif",
              fontSize: 86,
              lineHeight: 1.02,
              fontWeight: 700,
              textShadow: "0 18px 50px rgba(0,0,0,0.32)",
            }}
          >
            Well paced, engaging,
            <br />
            and time well spent.
          </div>
          <div
            style={{
              marginTop: 28,
              color: COLORS.ink,
              fontFamily: "Arial, sans-serif",
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 720,
            }}
          >
            Real AI instruction, real classrooms, real confidence built one team at a
            time.
          </div>
        </div>

        <div
          style={{
            alignSelf: "flex-end",
            color: "rgba(215, 227, 247, 0.84)",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Workshop participant quote  |  Jim Perry teaching at Ohio State
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,8,16,0.04) 0%, rgba(4,8,16,0) 30%, rgba(4,8,16,0.24) 100%)",
          boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.5)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: `${width / 16}px ${height / 10}px`,
          maskImage: "linear-gradient(180deg, transparent 0%, black 18%, black 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
