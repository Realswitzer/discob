/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.ts", "./public/**/*.html"],
    theme: {
        colors: {
            lavender: "#b7bdf8",
            text: "#cad3f5",
            "subtext-1": "#b8c0e0",
            "subtext-0": "#a5adcb",
            "overlay-2": "#939ab7",
            "overlay-1": "#8087a2",
            "overlay-0": "#6e738d",
            "surface-2": "#5b6078",
            "surface-1": "#494d64",
            "surface-0": "#363a4f",
            base: "#24273a",
            mantle: "#1e2030",
            crust: "#181926",
            outline: "#181926",
        },
        fontFamily: {
            sans: ["Open Sans", "sans-serif"],
        },
        extend: {},
    },
    plugins: [],
};
