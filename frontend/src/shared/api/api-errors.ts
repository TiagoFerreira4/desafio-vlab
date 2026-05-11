import { ApiError } from "./api-client";

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const issueMessage = error.issues[0]?.message;
    return issueMessage ?? error.message;
  }

  return "Nao foi possivel concluir a solicitacao.";
}
