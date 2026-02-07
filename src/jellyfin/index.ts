import axios from "axios"

import { env } from "../config"

type Item = {
  Id: string
  Name: string
  Type: string
  Tags?: string[]
  Trickplay?: any
  IndexNumber?: number
  ParentIndexNumber?: number
}

type Collection = Item & {
  ImageTags: {
    Primary: string
  }
}

type ItemSearch<T> = {
  Items: T[]
  TotalRecordCount: number
  StartIndex: number
}

const instance = axios.create({ baseURL: env.jellyfin.url })
instance.interceptors.request.use((config) => {
  const url = new URL(config.url, env.jellyfin.url)
  url.searchParams.append("api_key", env.jellyfin.token)
  config.url = url.pathname + url.search

  return config
})

async function getCollection(collectionName: string): Promise<Collection> {
  const {
    data: { Items },
  } = await instance.get<ItemSearch<Collection>>(`/Items?searchTerm=${collectionName}&Recursive=true`)
  return Items[0]
}

async function getItemsOfCollection(collectionId: string, recursive: boolean): Promise<Item[]> {
  const {
    data: { Items },
  } = await instance.get<ItemSearch<Item>>(`/Items?ParentId=${collectionId}&Recursive=${recursive}&hasImdbId=true`)
  return Items
}

async function getEpisodesOfShow(showId: string): Promise<Item[]> {
  const {
    data: { Items },
  } = await instance.get<ItemSearch<Item>>(`/Items?ParentId=${showId}&includeItemTypes=Episode&Recursive=true`)
  return Items
}

async function getMediaInfo(itemId: string): Promise<any> {
  const { data } = await instance.get(`/Items/${itemId}/PlaybackInfo`)
  return data
}

async function getItemTags(itemId: string): Promise<string[]> {
  const { data } = await instance.get<{ Tags: string[] }>(`/Users/${env.jellyfin.userId}/Items/${itemId}`)
  return data.Tags || []
}

async function getItem(itemId: string): Promise<Item> {
  const { data } = await instance.get<Item>(`/Users/${env.jellyfin.userId}/Items/${itemId}`)
  return data
}

async function setItemTags(Id: string, tags: string[]): Promise<void> {
  const data = await getItem(Id)
  delete data.Trickplay
  await instance.post(`/Items/${Id}`, { ...data, Tags: tags }, { headers: { "Content-Type": "application/json" } })
}

const JellyfinAPI = {
  getCollection,
  getItemsOfCollection,
  getEpisodesOfShow,
  getMediaInfo,
  getItem,
  getItemTags,
  setItemTags,
}

export { JellyfinAPI }
