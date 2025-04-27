export class UnauthorizedClientError extends Error {}

export class ForbiddenResourceError extends Error {}

export interface ApiError {
  message: string
  errors: { [key: string]: string[] }
}

export class ApiValidationError extends Error {
  errors: { [key: string]: string[] }

  constructor(error: ApiError) {
    super(error.message)

    this.errors = error.errors
  }
}
