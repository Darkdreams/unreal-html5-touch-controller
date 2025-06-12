import { defineConfig } from "rollup";
import obfuscator from "rollup-plugin-obfuscator";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
	input: "./src/index.js",
	output: {
		file: "dist/index.es.min.js",
		format: "es",
		sourcemap: false,
	},
	plugins: [
		obfuscator({
			compact: true,
			controlFlowFlattening: true,
			deadCodeInjection: true,
			stringArray: true,
			selfDefending: true,
		}),
		terser({
			compress: true,
			mangle: true,
			format: {
				comments: false,
				beautify: false,
			},
		}),
	],
});
