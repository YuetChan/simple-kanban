const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => ({
    entry: "./src/main.ts",
    target: "node",
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new Dotenv({
			path: `./.env.${env.env}`
		}),
    ],
});
