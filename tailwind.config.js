import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
        "./node_modules/flowbite-react/lib/esm/**/*.js",
        "./node_modules/react-tailwindcss-select/dist/index.esm.js",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
            zIndex: {
                999999: "999999",
                99999: "99999",
                9999: "9999",
                999: "999",
                99: "99",
                9: "9",
                1: "1",
            },
            gridTemplateColumns: {
                // Simple 13 column grid
                13: "repeat(13, minmax(0, 1fr))",
                14: "repeat(14, minmax(0, 1fr))",
            },
        },
        screens: {
            xs: "360px",
            // => @media (min-width: 640px) { ... }

            sm: "640px",
            // => @media (min-width: 640px) { ... }

            md: "768px",
            // => @media (min-width: 768px) { ... }

            lg: "1024px",
            // => @media (min-width: 1024px) { ... }

            xl: "1280px",
            // => @media (min-width: 1280px) { ... }

            "1xl": "1366px",
            // => @media (min-width: 1366px) { ... }

            "2xl": "1920px",
            // => @media (min-width: 1920px) { ... }
        },
    },

    plugins: [forms, require("flowbite/plugin")],
};
