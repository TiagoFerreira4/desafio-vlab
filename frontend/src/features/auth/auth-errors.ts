import { ApiError } from "../../shared/api/api-client";

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const issueMessage = error.issues[0]?.message;
    return issueMessage ?? error.message;
  }

  return "Nao foi possivel concluir a solicitacao.";
}
