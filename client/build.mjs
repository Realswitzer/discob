import * as esbuild from "esbuild";
import pkg from "esbuild-plugin-external-global";
const { externalGlobalPlugin } = pkg;

await esbuild
    .build({
        logLevel: "info",
        entryPoints: ["./src/index.ts"],
        bundle: true,
        minify: true,
        platform: "browser",
        packages: "external",
        outfile: "./build/index.js",
        plugins: [
            externalGlobalPlugin({
                "socket.io-client": "io",
                twemoji: "twemoji",
            }),
        ],
    })
    .catch((err) => {
        process.exit(1);
    });
