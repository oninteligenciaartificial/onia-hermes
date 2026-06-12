export type UnsplashPhoto = {
  id: string;
  alt: string;
  thumb: string;
  regular: string;
  full: string;
  author: string;
  authorUrl: string;
};

export async function searchUnsplash(
  query: string,
  n = 6,
  fetchImpl: typeof fetch = fetch,
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is required in web-factory/.env.");
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(n));

  const response = await fetchImpl(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash search failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as {
    results: Array<{
      id: string;
      alt_description: string | null;
      description: string | null;
      urls: { thumb: string; regular: string; full: string };
      user: { name: string; links: { html: string } };
    }>;
  };

  return payload.results.map((photo) => ({
    id: photo.id,
    alt: photo.alt_description ?? photo.description ?? "",
    thumb: photo.urls.thumb,
    regular: photo.urls.regular,
    full: photo.urls.full,
    author: photo.user.name,
    authorUrl: photo.user.links.html,
  }));
}
