export async function getChannelIdFromInput(input: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) throw new Error("API_KEY_MISSING");

  // 1. Очистка инпута от мусора
  let cleanInput = input.split("?")[0].trim();
  if (cleanInput.endsWith("/")) cleanInput = cleanInput.slice(0, -1);

  // 2. Если это уже прямой ID (начинается с UC и длина 24)
  if (cleanInput.startsWith("UC") && cleanInput.length === 24)
    return cleanInput;

  // 3. Пытаемся угадать хэндл (с собачкой)
  let possibleHandle = "";

  if (cleanInput.includes("@")) {
    // Если пользователь сам ввел @ (например, из ссылки или просто @name)
    // Берем только то, что после @ (отрезая всё остальное)
    possibleHandle = "@" + cleanInput.split("@")[1].split("/")[0];
  } else if (!cleanInput.includes("youtube.com") && !cleanInput.includes(" ")) {
    // УМНАЯ ЧАСТЬ: Если это просто одно слово (без пробелов и ссылок),
    // мы предполагаем, что человек забыл написать @, и подставляем сами.
    possibleHandle = "@" + cleanInput;
  }

  // Если у нас есть догадка, что это хэндл, проверяем через точный API
  if (possibleHandle) {
    const handleUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(possibleHandle)}&key=${API_KEY}`;
    const handleRes = await fetch(handleUrl);

    if (handleRes.ok) {
      const handleData = await handleRes.json();
      if (handleData.items && handleData.items.length > 0) {
        return handleData.items[0].id; // Ура, нашли точно по хэндлу!
      }
    }
    // Если мы сами подставили @, но такого хэндла нет, код просто пойдет дальше (к обычному поиску)
  }

  // 4. Fallback: Обычный поиск (Search API)
  // Сюда код дойдет, если это старая ссылка (youtube.com/user/name)
  // или если человек ввел название канала из нескольких слов ("BadComedian review")
  let identifier = cleanInput;
  if (cleanInput.includes("youtube.com/")) {
    const pathParts = cleanInput.split("/").filter((p) => p !== "");
    identifier = pathParts[pathParts.length - 1]; // Берем последний кусок ссылки
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(identifier)}&type=channel&key=${API_KEY}&maxResults=1`;
  const searchRes = await fetch(searchUrl);

  if (!searchRes.ok) throw new Error("API_ERROR");

  const searchData = await searchRes.json();
  if (searchData.items && searchData.items.length > 0) {
    return searchData.items[0].id.channelId;
  }

  // Если и тут не нашли, значит канала реально не существует
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
