// src/utils/api.ts
const API_URL = "http://127.0.0.1:8000"; // or your base URL

export async function postVideoProgress({
  u_id,
  topic_id,
  is_completed,
  is_locked,
}: {
  u_id: string;
  topic_id: string;
  is_completed: boolean;
  is_locked: boolean;
}) {
  try {
    // const response = await fetch(`${API_URL}/video-progress`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ u_id, topic_id, is_completed, is_locked }),
    //   next: { revalidate: 0 }, // optional, no caching
    // });

    // if (!response.ok) {
    //   const errText = await response.text();
    //   console.error("API error:", errText);
    //   return { success: false };
    // }

    // const json = await response.json();
    return console.log("video data saved");
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false };
  }
}
