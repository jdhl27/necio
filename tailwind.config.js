module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B10",
        surface: "#14141C",
        line: "rgba(244, 241, 234, 0.12)",
        cream: "#F4F1EA",
        muted: "#9B98A0",
        yellow: "#FFC933",
        pink: "#FF2E7D",
        teal: "#2FD4B5",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      fontSize: {
        "fluid-hero": "clamp(3.5rem, 11vw, 9rem)",
        "fluid-title": "clamp(2.25rem, 6vw, 4.5rem)",
        "fluid-sub": "clamp(1.5rem, 3.5vw, 2.5rem)",
      },
      letterSpacing: {
        widecaps: "0.25em",
      },
      maxWidth: {
        wrap: "78rem",
      },
    },
  },
  plugins: [],
};
