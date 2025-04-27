import {
  ApiError,
  ApiValidationError,
  ForbiddenResourceError,
  UnauthorizedClientError,
} from './errors'
import { store } from '../../reducers/index'

export const http = {
  validateResponse: async (response: Response): Promise<Response> => {
    if (response.status === 401) {
      throw new UnauthorizedClientError()
    } else if (response.status === 403) {
      throw new ForbiddenResourceError()
    } else if (response.status === 422) {
      const payload: ApiError = await response.json()
      throw new ApiValidationError(payload)
    }

    return response
  },
  fetch: async (url: string, options: RequestInit | null = null) => {
    const token: string | null = store.getState().session.token

    const response: Response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return http.validateResponse(response)
  },
  fetchAnonymous: async (url: string, options: RequestInit | null = null) => {
    const response: Response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return http.validateResponse(response)
  },
  post: async (url: string, body: unknown) => {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
    }

    return http.fetch(url, options)
  },
  postAnonymous: async (url: string, body: unknown) => {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
    }
    return http.fetchAnonymous(url, options)
  },
  get: async (url: string) => {
    const options: RequestInit = {
      method: 'GET',
    }

    return http.fetch(url, options)
  },
  getAnonymous: async (url: string) => {
    const options: RequestInit = {
      method: 'GET',
    }
    return http.fetchAnonymous(url, options)
  },
  delete: async (url: string) => {
    const options: RequestInit = {
      method: 'DELETE',
    }

    return http.fetch(url, options)
  },
  deleteAnonymous: async (url: string) => {
    const options: RequestInit = {
      method: 'DELETE',
    }
    return http.fetchAnonymous(url, options)
  },
}
