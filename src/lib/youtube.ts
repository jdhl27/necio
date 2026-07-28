export interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { default: { url: string } };
  };
}

/** La API de YouTube devuelve los títulos con entidades HTML escapadas */
export function decodeEntities(text: string = ""): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Trae todos los videos públicos del canal de Necio, del más nuevo al más
 * viejo, con thumbnails en alta resolución. Devuelve [] si la API falla.
 *
 * Usa la playlist de "subidas" del canal (playlistItems cuesta 1 unidad de
 * cuota por página, frente a 100 del endpoint search).
 */
export async function fetchVideos(): Promise<YouTubeVideo[]> {
  const ID_CHANNEL_YOUTUBE = import.meta.env.PUBLIC_ID_CHANNEL_YOUTUBE;
  const API_KEY = import.meta.env.PUBLIC_API_KEY_GOOGLE;

  // La playlist de subidas de un canal es su ID cambiando el prefijo UC por UU
  const uploadsPlaylist = ID_CHANNEL_YOUTUBE?.replace(/^UC/, "UU");

  try {
    const videos: YouTubeVideo[] = [];
    let pageToken = "";

    do {
      const url =
        `https://www.googleapis.com/youtube/v3/playlistItems` +
        `?key=${API_KEY}&playlistId=${uploadsPlaylist}` +
        `&part=snippet&maxResults=50` +
        (pageToken ? `&pageToken=${pageToken}` : "");

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      for (const item of data.items ?? []) {
        const videoId = item.snippet?.resourceId?.videoId;
        if (!videoId) continue;
        videos.push({
          id: { videoId },
          snippet: {
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnails: {
              default: {
                url: `https://i.ytimg.com/vi/${videoId}/maxres2.jpg`,
              },
            },
          },
        });
      }

      pageToken = data.nextPageToken ?? "";
    } while (pageToken);

    videos.sort((a, b) =>
      b.snippet.publishedAt.localeCompare(a.snippet.publishedAt)
    );

    return videos;
  } catch (error) {
    console.error("No se pudieron cargar los videos de YouTube", error);
    return [];
  }
}
