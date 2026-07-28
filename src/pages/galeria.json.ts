import type { APIRoute } from "astro";
import { fetchGalleryImages } from "../lib/cloudinary";

// Se sirve como función SSR en Netlify: la galería se alimenta de la carpeta
// "galeria" de Cloudinary, donde el cliente sube sus fotos sin tocar código.
export const prerender = false;

export const GET: APIRoute = async () => {
  const images = await fetchGalleryImages();
  // src = grilla (800px), full = lightbox (1600px)
  return new Response(JSON.stringify(images), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // El CDN de Netlify lo cachea 1 hora; si Cloudinary falla, sirve la
      // copia vieja hasta 1 día.
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control":
        "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
