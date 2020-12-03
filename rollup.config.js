import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: "./src/main.ts",
	output: {
		// dir: "/Users/dahawong/Documents/Note/丸记/.obsidian/plugins/footlink",
		dir: "./build",
		sourcemap: "inline",
		format: "cjs",
		exports: "default",
	},
	external: ["obsidian"],
	plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
};
