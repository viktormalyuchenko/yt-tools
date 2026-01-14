export async function getChannelIdFromInput(input: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error("ОШИБКА: API ключ отсутствует в process.env");
    throw new Error("API_KEY_MISSING");
  }

  const identifier = input.trim();
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    identifier
  )}&type=channel&key=${API_KEY}&maxResults=1`;

  const res = await fetch(searchUrl);

  if (!res.ok) {
    const errorData = await res.json();
    console.error("YouTube API Search Error:", JSON.stringify(errorData)); // ЭТО ПОЯВИТСЯ В ЛОГАХ VERCEL
    throw new Error(`GOOGLE_API_ERROR: ${res.status}`);
  }

  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id.channelId;
  }

  throw new Error("CHANNEL_NOT_FOUND");
}

export async function getSubscriptions(channelId: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  let allSubs: any[] = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&channelId=${channelId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("YouTube API Subs Error:", JSON.stringify(errorData)); // И ЭТО
      if (res.status === 403) throw new Error("SUBS_PRIVATE");
      throw new Error("SUBS_FETCH_FAILED");
    }

    const data = await res.json();
    if (data.items) allSubs.push(...data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allSubs;
}
