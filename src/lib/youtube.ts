const API_KEY = process.env.YOUTUBE_API_KEY;

export async function getChannelIdFromInput(input: string) {
  // 1. Если это уже ID (начинается с UC...)
  if (input.startsWith("UC") && input.length === 24) return input;

  // 2. Извлекаем handle (например, @username) или имя из ссылки
  let identifier = input.trim();
  if (input.includes("youtube.com/")) {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const path = url.pathname.split("/");
    identifier = path[path.length - 1]; // Берем последнюю часть пути
  }

  // 3. Запрос к YouTube API, чтобы найти ID по хэндлу или названию
  // Используем search для универсальности или channels.list для @handle
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${identifier}&type=channel&key=${API_KEY}&maxResults=1`;

  const res = await fetch(searchUrl);
  const data = await res.json();

  if (data.items && data.items.length > 0) {
    return data.items[0].id.channelId;
  }

  throw new Error("Канал не найден");
}

export async function getSubscriptions(channelId: string) {
  let allSubs: any[] = [];
  let nextPageToken = "";

  // YouTube отдает максимум 50 за раз. Цикл соберет все.
  do {
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&channelId=${channelId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      // Если подписки скрыты, API вернет ошибку 403
      if (data.error.errors[0].reason === "subscriptionForbidden") {
        throw new Error("SUBS_PRIVATE");
      }
      throw new Error("API_ERROR");
    }

    if (data.items) {
      allSubs = [...allSubs, ...data.items];
    }
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allSubs;
}
