export type AnimeSearchResult = {
  title: string
  title_romaji: string
  year: number
  endpoint_type: string
  type: string
  poster: string
  ids: {
    simkl_id: number
    slug: string
    tmdb: string
  }
}

export enum EpisodeTypeEnum {
  Canon = "canon",
  Filler = "filler",
  Mixed = "mixed",
}

export type Episode = {
  number: number
  type: EpisodeTypeEnum
}
