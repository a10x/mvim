import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
	mode: "development",
	entry: {
		background: path.resolve("src/", "background.ts"),
		//popup: path.resolve("src/", "popup.ts")
	},
	output: {path: path.join(__dirname, "out/"), filename: "[name].js"},
	resolve: {extensions: [".ts", ".js"]},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			}
		]
	}
};