import { urls } from '../../constants/urls'

export const tokenInterceptor = (error: any) => {
  if (error.response?.status === 403) {
    window.location.replace(`${urls.walletWeb}/session-expired`)
  }

  return Promise.reject(error)
}
