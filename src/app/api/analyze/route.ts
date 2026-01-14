import { getChannelIdFromInput, getSubscriptions } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url)
    return NextResponse.json({ error: "URL required" }, { status: 400 });

  try {
    const channelId = await getChannelIdFromInput(url);
    const subscriptions = await getSubscriptions(channelId);

    // Сортируем: самые старые вверху
    const sorted = subscriptions.sort(
      (a, b) =>
        new Date(a.snippet.publishedAt).getTime() -
        new Date(b.snippet.publishedAt).getTime()
    );

    return NextResponse.json(sorted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
