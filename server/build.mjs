import * as esbuild from "esbuild";

await esbuild
    .build({
        logLevel: "info",
        entryPoints: ["./src/index.ts"],
        bundle: true,
        packages: "external",
        platform: "node",
        outfile: "./build/server.js",
    })
    .catch((err) => {
        process.exit(1);
    });
