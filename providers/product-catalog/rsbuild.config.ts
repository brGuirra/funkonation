import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { withZephyr } from "zephyr-rsbuild-plugin";

export default defineConfig({
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: "product_catalog",
			dts: false,
			exposes: {
				"./ProductList": "./src/components/ProductList.tsx",
				"./ProductDetails": "./src/components/ProductDetails.tsx",
				"./ProductCard": "./src/components/ProductCard.tsx",
				"./SeriesFilter": "./src/components/SeriesFilter.tsx",
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
		port: 3001,
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
