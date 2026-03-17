import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { withZephyr } from "zephyr-rsbuild-plugin";

export default defineConfig({
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "cart",
			dts: false,
			exposes: {
				"./CartView": "./src/components/CartView.tsx",
				"./CartBadge": "./src/components/CartBadge.tsx",
			},
			filename: "remoteEntry.js",
			shared: {
				react: { singleton: true },
				"react-dom": { singleton: true },
				"lucide-react": { singleton: true },
			},
		}),
		withZephyr(),
	],
	server: {
		port: 3002,
		open: false,
	},
	tools: {
		rspack(config) {
			config.output ??= {};
			config.output.publicPath = "auto";
		},
		postcss: {
			postcssOptions: {
				plugins: [tailwindcss()],
			},
		},
	},
});
