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
			dts: {
				generateTypes: false,
			},
			name: "cart",
			exposes: {
				"./CartView": "./src/components/CartView.tsx",
			},
			filename: "remoteEntry.js",
			shared: {
				react: {
					singleton: true,
				},
				"react-dom": {
					singleton: true,
				},
				"lucide-react": {},
			},
		}),
	];

	if (command !== "dev" && process.env.ZEPHYR_ENABLED !== "false") {
		plugins.push(withZephyr());
	}

	return {
		plugins,
		server: {
			port: 3002,
			open: false,
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
