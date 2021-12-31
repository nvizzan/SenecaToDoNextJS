module.exports = {
  reactStrictMode: true,
  env: {
    SENECA_BACKEND_URL: process.env.SENECA_BACKEND_URL, 
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    VERCEL_URL: process.env.VERCEL_URL
  },    
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
}
