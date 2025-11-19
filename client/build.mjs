import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "esbuild-plugin-external-global";
const { externalGlobalPlugin } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild
    .build({
        logLevel: "info",
        entryPoints: [path.resolve(__dirname, "../src/client/src/index.ts")],
        bundle: true,
        minify: true,
        platform: "browser",
        packages: "external",
        outfile: path.resolve(__dirname, "./build/index.js"),
        alias: {
            "@backend": path.resolve(__dirname, "../server/src"),
        },
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
