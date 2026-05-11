import { getApiErrorMessage } from "../../shared/api/api-errors";

export function getAuthErrorMessage(error: unknown) {
  return getApiErrorMessage(error);
}
