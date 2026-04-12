import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// For local network testing, use: next dev -H 0.0.0.0
	experimental: {
		optimizePackageImports: ["@sushiswap/ui"],
	},
};

export default nextConfig;
