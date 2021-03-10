//import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.js",
    output: [
        {
            file: "dist/index.js",
            format: "umd",
            name: "ArrQL",
            //sourcemap: true,
            //plugins: [terser()],
        },
    ],
};