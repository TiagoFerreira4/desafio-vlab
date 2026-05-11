const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

type ApiIssue = {
  path: string;
  message: string;
};

type ApiErrorResponse = {
  message?: string;
  issues?: ApiIssue[];
};

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly issues: ApiIssue[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : null;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    throw new ApiError(
      response.status,
      errorData?.message ?? "Request failed.",
      errorData?.issues ?? [],
    );
  }

  return data as T;
}
