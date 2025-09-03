export const walletApi = {
  production: 'https://wallet-kltuqnk1k-guidev28.vercel.app/api',
  development: 'http://localhost:3001/api',
  test: 'http://localhost:3001/api',
}

export const walletWeb = {
  production: 'https://wallet-web-six.vercel.app',
  development: 'http://localhost:3000',
  test: 'http://localhost:3000',
}

export const urls = {
  walletApi: walletApi[process.env.NODE_ENV],
  walletWeb: walletWeb[process.env.NODE_ENV],
}
