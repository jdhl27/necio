import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  site: "https://astro-theme-creek.netlify.app/",
  output: "server",
  adapter: netlify()
});