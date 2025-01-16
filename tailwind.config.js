/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito-Regular", "sans-serif"],
        "nunito-bold": ["Nunito-Bold", "sans-serif"],
        "nunito-black": ["Nunito-Black", "sans-serif"],
        "nunito-light": ["Nunito-Light", "sans-serif"],
        "nunito-italic": ["Nunito-Italic", "sans-serif"],
        "nunito-medium": ["Nunito-Medium", "sans-serif"],
        "nunito-medium-italic": ["Nunito-MediumItalic", "sans-serif"],
        "nunito-semi-bold": ["Nunito-SemiBold", "sans-serif"],
        "nunito-extra-bold": ["Nunito-ExtraBold", "sans-serif"],
        "nunito-light-italic": ["Nunito-LightItalic", "sans-serif"],
        "nunito-black-italic": ["Nunito-BlackItalic", "sans-serif"],
        "nunito-bold-italic": ["Nunito-BoldItalic", "sans-serif"],
        "nunito-extra-bold-italic": ["Nunito-ExtraBoldItalic", "sans-serif"],
        "nunito-extra-light": ["Nunito-ExtraLight", "sans-serif"],
        "nunito-extra-light-italic": ["Nunito-ExtraLightItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
