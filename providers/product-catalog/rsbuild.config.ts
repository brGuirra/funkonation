import path from "node:path";
import { fileURLToPath } from "node:url";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { withZephyr } from "zephyr-rsbuild-plugin";

const workspaceUiSrc = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../packages/ui/src",
);

export default defineConfig(({ command }) => {
	const plugins = [
		pluginReact(),
		pluginModuleFederation({
			name: "product_catalog",
			exposes: {
				"./ProductList": "./src/components/ProductList.tsx",
			},
			shared: {
				react: {
					singleton: true,
				},
				"react-dom": {
					singleton: true,
				},
			},
		}),
	];

	if (command !== "dev") {
		plugins.push(withZephyr());
	}

	return {
		plugins,
		server: {
			port: 3001,
		},
		source: {
			include: [workspaceUiSrc],
		},
		tools: {
			postcss: {
				postcssOptions: {
					plugins: [tailwindcss()],
				},
			},
		},
	};
});
