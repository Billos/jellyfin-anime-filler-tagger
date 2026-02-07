import axios from "axios"

import { env } from "../config"
import mainLogger from "../utils/logger"
import { getList } from "./mock"
import { AnimeSearchResult } from "./types"

const instance = axios.create({ baseURL: env.simkl.url })
instance.interceptors.request.use((config) => {
  const url = new URL(config.url, env.simkl.url)
  url.searchParams.append("client_id", env.simkl.clientId)
  config.url = url.pathname + url.search
  return config
})

async function searchTextAnime(text: string): Promise<AnimeSearchResult[]> {
  const logger = mainLogger.child({
    name: "Simkl",
    func: "searchTextAnime",
    data: { text },
  })
  logger.silly("searchTextAnime")
  const { data } = await instance.get<AnimeSearchResult[]>(`/search/anime?q=${text}`)

  return data
}

// We can't retrieve the canon, mixed and filler episodes on SIMKL.
// So for now we'll just manually retrieve the list and hardcode it in the code.

async function listSpecialEpisodes(simklId: number): Promise<{ mixed: number[]; filler: number[] }> {
  return getList(simklId)
}

const SimklAPI = { searchTextAnime, listSpecialEpisodes }

export { SimklAPI }
