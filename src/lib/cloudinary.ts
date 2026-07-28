export interface GalleryImage {
  /** Versión para la grilla (800px) */
  src: string;
  /** Versión para el lightbox ampliado (1600px) */
  full: string;
  width: number;
  height: number;
}

/**
 * Lista las imágenes de la carpeta "galeria" en Cloudinary, de la más nueva
 * a la más vieja. Devuelve [] si faltan credenciales o la API falla, para
 * que la galería pueda caer al contenido local sin romperse.
 *
 * Las credenciales (server-only, sin prefijo PUBLIC_) van en .env:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = import.meta.env.CLOUDINARY_API_KEY;
  const API_SECRET = import.meta.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return [];
  }

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

  async function search(expression: string) {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression,
          sort_by: [{ created_at: "desc" }],
          max_results: 100,
        }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.resources ?? null;
  }

  try {
    // Las cuentas nuevas de Cloudinary usan "asset_folder"; las viejas, "folder"
    const expressions = [
      'resource_type:image AND asset_folder="necio"',
      'resource_type:image AND folder="necio"',
      'resource_type:image AND asset_folder="galeria"',
      'resource_type:image AND folder="galeria"',
    ];

    let resources = null;
    for (const expression of expressions) {
      resources = await search(expression);
      if (resources?.length) break;
    }

    return (resources ?? []).map((img: any) => ({
      // f_auto,q_auto: Cloudinary sirve WebP/AVIF comprimido según el navegador
      src: img.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_800/"),
      full: img.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1600/"
      ),
      width: img.width,
      height: img.height,
    }));
  } catch (error) {
    console.error("No se pudieron cargar las imágenes de Cloudinary", error);
    return [];
  }
}
