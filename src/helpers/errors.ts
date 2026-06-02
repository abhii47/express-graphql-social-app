import { GraphQLError } from "graphql";

export const graphQLError = (message: string, code: string, status: number) =>
  new GraphQLError(message, {
    extensions: {
      code,
      http: {
        status,
      },
    },
  });

export const unauthorizedError = (message = "Not authenticated") =>
  graphQLError(message, "UNAUTHENTICATED", 401);

export const notFoundError = (message: string) =>
  graphQLError(message, "NOT_FOUND", 404);

export const badRequestError = (message: string) =>
  graphQLError(message, "BAD_REQUEST", 400);

export const accessForbiddenError = (message: string) =>
  graphQLError(message, "ACCESS_FORBIDDEN", 403);

export const validationError = (message: string) =>
  graphQLError(message, "VALIDATION_ERROR", 400);

export const internalServerError = (message: string) =>
  graphQLError(message, "INTERNAL_SERVER_ERROR", 500);
