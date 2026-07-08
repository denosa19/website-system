export const theme = {
  colors: {
    background: "bg-neutral-950",
    surface: "bg-neutral-900",
    surfaceLight: "bg-white/5",

    text: "text-white",
    muted: "text-neutral-300",

    border: "border border-white/10",

    primary: "bg-white text-black",
    primaryHover: "hover:bg-neutral-200",

    secondary:
      "bg-transparent text-white border border-white hover:bg-white hover:text-black",
  },

  radius: {
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
  },

  spacing: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-10",

    sectionSm: "py-12",
    sectionMd: "py-20",
    sectionLg: "py-28",

    buttonSm: "px-4 py-2",
    buttonMd: "px-8 py-4",
    buttonLg: "px-10 py-5",
  },

  typography: {
    h1: "text-5xl font-bold tracking-tight sm:text-6xl",

    h2: "text-4xl font-bold tracking-tight sm:text-5xl",

    h3: "text-2xl font-bold tracking-tight",

    body: "text-base",

    large: "text-xl",

    button: "font-semibold",
  },

  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-xl",
  },

  animation: {
    default: "transition-all duration-300",
  },

  container: {
    default: "mx-auto w-full max-w-7xl px-6",
  },
};