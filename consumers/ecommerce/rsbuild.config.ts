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
			name: "ecommerce",
			remotes: {
				product_catalog:
					"product_catalog@http://localhost:3001/mf-manifest.json",
			},
			dts: {
				generateTypes: false,
				consumeTypes: false,
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
			port: 3000,
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
