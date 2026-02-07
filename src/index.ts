import { env } from "./config"
import { JellyfinAPI } from "./jellyfin"
import { SimklAPI } from "./simkl"
import { getAbsoluteEpisodeNumber } from "./simkl/mock"
import { EpisodeTypeEnum } from "./simkl/types"

async function main() {
  const collection = await JellyfinAPI.getCollection(env.jellyfin.animeCollectionName)
  const shows = await JellyfinAPI.getItemsOfCollection(collection.Id, false)
  const filteredShows = shows.filter((show) => show.Name.includes("Naruto") || show.Name.includes("Boruto"))
  // const filteredShows = shows.filter((show) => show.Name.includes("Naruto Shippuden"))

  for (const show of filteredShows) {
    const [result] = await SimklAPI.searchTextAnime(show.Name)
    if (!result) {
      console.warn(`No result found for ${show.Name}`)
      continue
    }
    const specialEpisodes = await SimklAPI.listSpecialEpisodes(result.ids.simkl_id)
    const episodes = await JellyfinAPI.getEpisodesOfShow(show.Id)

    for (const episode of episodes) {
      const tags = await JellyfinAPI.getItemTags(episode.Id)
      const { IndexNumber: episodeNumber, ParentIndexNumber: seasonNumber } = await JellyfinAPI.getItem(episode.Id)
      const tagsSet = new Set(tags)

      tagsSet.delete(EpisodeTypeEnum.Canon)
      tagsSet.delete(EpisodeTypeEnum.Filler)
      tagsSet.delete(EpisodeTypeEnum.Mixed)

      const absoluteEpisodeNumber = getAbsoluteEpisodeNumber(result.ids.simkl_id, seasonNumber!, episodeNumber!)

      if (specialEpisodes.filler.includes(absoluteEpisodeNumber)) {
        tagsSet.add(EpisodeTypeEnum.Filler)
      } else if (specialEpisodes.mixed.includes(absoluteEpisodeNumber)) {
        tagsSet.add(EpisodeTypeEnum.Mixed)
      } else {
        tagsSet.add(EpisodeTypeEnum.Canon)
      }

      // Print the show, season, episode and tags that will be set
      console.log(
        `Show: %s, Season: %s, Episode: %s, Absolute Episode: %d, Tags: ${Array.from(tagsSet).join(", ")}`,
        show.Name,
        seasonNumber,
        episodeNumber,
        absoluteEpisodeNumber,
      )
      await JellyfinAPI.setItemTags(episode.Id, Array.from(tagsSet))
    }
  }
}

main()
