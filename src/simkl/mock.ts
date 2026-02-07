// Naruto
// Mixed Canon/Filler Episodes:
// 7, 9, 14-16, 18-21, 23-24, 27-30, 37-41, 43-47, 49, 52-60, 63, 66, 69-72, 74, 83, 98, 100, 112-114, 126-127, 130-131, 141-142, 220
// Filler Episodes:
// 26, 97, 99, 101-106, 136-140, 143-219

// Naruto Shippuden
// Mixed Canon/Filler Episodes:
// 1-19, 24-25, 45, 49-50, 54, 56, 89, 115, 127-128, 213, 324, 327-328, 330-331, 338, 346, 385-386, 388, 417, 419, 426, 451-458, 460-462, 471-472, 478-479, 484-500
// Filler Episodes:
// 28, 57-71, 90-112, 144-151, 170-171, 176-196, 223-242, 257-260, 271, 279-281, 284-295, 303-320, 347-361, 376-377, 389-390, 394-413, 416, 422-423, 427-450, 464-469, 480-483

// Boruto
// Mixed Canon/Filler Episodes:
// 1, 18, 24, 59, 93-95, 127, 157, 192, 210-211
// Filler Episodes:
// 16-17, 40-41, 48-50, 67-69, 96-97, 112-119, 138-140, 152-154, 156, 256

type Range = [number, number]
type EpisodeList = (number | Range)[]
const mixed: Record<string, EpisodeList> = {
  // Naruto
  "39508": [
    7,
    9,
    [14, 16],
    [18, 21],
    [23, 24],
    [27, 30],
    [37, 41],
    [43, 47],
    49,
    [52, 60],
    63,
    66,
    [69, 72],
    74,
    83,
    98,
    100,
    [112, 114],
    [126, 127],
    [130, 131],
    [141, 142],
    220,
  ],
  // Naruto Shippuden
  "40053": [
    [1, 19],
    [24, 25],
    45,
    [49, 50],
    54,
    56,
    89,
    115,
    [127, 128],
    213,
    324,
    [327, 328],
    [330, 331],
    338,
    346,
    [385, 386],
    388,
    417,
    419,
    426,
    [451, 458],
    [460, 462],
    [471, 472],
    [478, 479],
    [484, 500],
  ],
  // Boruto
  "643731": [
    1,
    18,
    24,
    59,
    [93, 95],
    127,
    157,
    192,
    [210, 211],
  ],
}

const fillers: Record<string, EpisodeList> = {
  // Naruto
  "39508": [
    26,
    97,
    99,
    [101, 106],
    [136, 140],
    [143, 219],
  ],
  // Naruto Shippuden
  "40053": [
    28,
    [57, 71],
    [90, 112],
    [144, 151],
    [170, 171],
    [176, 196],
    [223, 242],
    [257, 260],
    271,
    [279, 281],
    [284, 295],
    [303, 320],
    [347, 361],
    [376, 377],
    [389, 390],
    [394, 413],
    416,
    [422, 423],
    [427, 450],
    [464, 469],
    [480, 483],
  ],
  // Boruto
  "643731": [
    [16, 17],
    [40, 41],
    [48, 50],
    [67, 69],
    [96, 97],
    [112, 119],
    [138, 140],
    [152, 154],
    156,
    256,
  ],
}

const episodesPerSeason: Record<string, number[]> = {
  // Naruto
  // 5 seasons, 220 episodes
  "39508": [
    35,
    48,
    48,
    48,
    41,
  ],
  // Naruto Shippuden
  // 22 seasons, 500 episodes
  "40053": [
    32,
    21,
    18,
    17,
    24,
    31,
    8,
    24,
    21,
    26,
    20,
    18,
    35,
    25,
    28,
    13,
    32,
    20,
    18,
    19,
    8,
    42,
  ],
  // Boruto
  // 1 season, 293 episodes
  "643731": [293],
}

function expandList(list: EpisodeList): number[] {
  const expanded: number[] = []
  for (const item of list) {
    if (typeof item === "number") {
      expanded.push(item)
    } else {
      const [start, end] = item
      for (let i = start; i <= end; i++) {
        expanded.push(i)
      }
    }
  }
  return expanded
}

export function getList(simklId: number): { mixed: number[]; filler: number[] } {
  const mixedList = mixed[simklId.toString()] || []
  const fillerList = fillers[simklId.toString()] || []

  return {
    mixed: expandList(mixedList),
    filler: expandList(fillerList),
  }
}

export function getAbsoluteEpisodeNumber(simklId: number, season: number, episode: number): number {
  const seasons = episodesPerSeason[simklId.toString()]
  if (!seasons) {
    throw new Error(`No episode count found for simklId ${simklId}`)
  }

  let absoluteEpisodeNumber = episode
  for (let i = 0; i < season - 1; i++) {
    absoluteEpisodeNumber += seasons[i]
  }

  return absoluteEpisodeNumber
}
