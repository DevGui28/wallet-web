export const walletApi = {
  production: 'https://wallet-api-tau.vercel.app/api',
  development: 'http://localhost:3001/api',
  test: 'http://localhost:3001/api',
}

export const walletWeb = {
  production: 'https://wallet-web-delta.vercel.app',
  development: 'http://localhost:3000',
  test: 'http://localhost:3000',
}

export const urls = {
  walletApi: walletApi[process.env.NODE_ENV],
  walletWeb: walletWeb[process.env.NODE_ENV],
}
