const path = require("path");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    const plugins = [];

    if (env.env === "local") {
        plugins.push(
            new Dotenv({
                path: `./.env`
            })
        );
    }
    return (
        {
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
            
            optimization: {
                minimizer: [
                  new TerserPlugin({
                    terserOptions: {
                      format: {
                        comments: false,
                      },
                    },
                    extractComments: false,
                  }),
                ],
            },
            
            plugins: plugins,
        }
    )
};
