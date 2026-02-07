const env = {
  jellyfin: {
    url: process.env.JELLYFIN_URL,
    token: process.env.JELLYFIN_API_KEY,
    animeCollectionName: process.env.JELLYFIN_ANIME_COLLECTION_NAME || "Anime",
    userId: process.env.JELLYFIN_USER_ID,
  },
  simkl: {
    url: process.env.SIMKL_URL || "https://api.simkl.com",
    clientId: process.env.SIMKL_CLIENT_ID,
    clientSecret: process.env.SIMKL_CLIENT_SECRET,
  },
  logLevel: process.env.LOG_LEVEL || "info",
  logData: process.env.LOG_DATA === "true",
}

export { env }
