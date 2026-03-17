import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { withZephyr } from "zephyr-rsbuild-plugin";

export default defineConfig({
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "ecommerce",
			dts: false,
			remotes: {
				product_catalog: "product_catalog@http://localhost:3001/remoteEntry.js",
				cart: "cart@http://localhost:3002/remoteEntry.js",
			},
			shared: {
				react: { singleton: true, eager: true },
				"react-dom": { singleton: true, eager: true },
				"lucide-react": { singleton: true },
			},
		}),
		withZephyr(),
	],
	server: {
		port: 3000,
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
