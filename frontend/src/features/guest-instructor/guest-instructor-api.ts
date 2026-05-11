import type { GuestInstructor, RandomUserApiResponse } from "./types";

const RANDOM_USER_API_URL = "https://randomuser.me/api/1.4/";

function mapRandomUserToGuestInstructor(
  data: RandomUserApiResponse,
): GuestInstructor {
  const user = data.results?.[0];
  const firstName = user?.name?.first?.trim();
  const lastName = user?.name?.last?.trim();
  const email = user?.email?.trim();
  const avatarUrl = user?.picture?.large?.trim();
  const nationality = user?.nat?.trim();

  if (!firstName || !lastName || !email || !avatarUrl || !nationality) {
    throw new Error("Invalid guest instructor response.");
  }

  return {
    name: `${firstName} ${lastName}`,
    email,
    avatarUrl,
    nationality,
  };
}

export async function getGuestInstructor(courseId: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    seed: courseId,
    inc: "name,picture,email,nat",
  });

  const response = await fetch(
    `${RANDOM_USER_API_URL}?${params.toString()}&noinfo`,
    {
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error("Guest instructor request failed.");
  }

  const data = (await response.json()) as RandomUserApiResponse;

  return mapRandomUserToGuestInstructor(data);
}
