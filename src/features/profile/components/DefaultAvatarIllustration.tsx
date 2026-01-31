export const DefaultAvatarIllustration = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="100" fill="hsl(0 23.3645% 79.0196%)" opacity="0.2" />

      {/* Head */}
      <circle
        cx="100"
        cy="70"
        r="28"
        fill="hsl(0 28.9855% 27.0588%)"
      />

      {/* Left eye */}
      <circle cx="90" cy="65" r="3.5" fill="white" />

      {/* Right eye */}
      <circle cx="110" cy="65" r="3.5" fill="white" />

      {/* Smile - simple arc */}
      <path
        d="M 92 75 Q 100 80 108 75"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M 72 98 L 128 98 L 130 160 Q 100 170 70 160 Z"
        fill="hsl(0 28.9855% 27.0588%)"
      />

      {/* Accent circle on chest */}
      <circle cx="100" cy="120" r="8" fill="hsl(0 23.3645% 79.0196%)" opacity="0.5" />
    </svg>
  );
};
