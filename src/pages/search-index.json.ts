import type { APIRoute } from "astro";
import { fetchVideos, decodeEntities } from "../lib/youtube";

// Se sirve como función SSR en Netlify: el índice del buscador se arma
// directo desde YouTube, sin mantener un JSON a mano.
export const prerender = false;

export const GET: APIRoute = async () => {
  const videos = await fetchVideos();

  const index = videos.map((video) => ({
    slug: video.id.videoId,
    category: "video",
    title: decodeEntities(video.snippet.title),
    description: "",
    tags: [],
    body: decodeEntities(video.snippet.description),
    videoId: video.id.videoId,
    image: video.snippet.thumbnails.default.url,
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // El CDN de Netlify lo cachea 1 hora para no gastar cuota de la API
      // en cada visita; si la API falla, sirve la copia vieja hasta 1 día.
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control":
        "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
