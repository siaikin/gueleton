export interface TweetCard {
  id: number;
  content: string;
  author: string;
  date: string;
  avatar: string;
  likes: number;
  retweets: number;
  comments: number;
}

export async function mockRequest(delay = 500): Promise<TweetCard[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return TweetCard;
}

const TweetCard: TweetCard[] = [
    {
        "id": 1,
        "content": "Abscido solum pauper arbor acerbitas ultra consectetur absque repudiandae.",
        "author": "Nancy Dach",
        "date": "2024-09-19",
        "avatar": "https://avatars.githubusercontent.com/u/1080372",
        "likes": 940,
        "retweets": 425,
        "comments": 47
    },
    {
        "id": 2,
        "content": "Cura attonbitus uberrime debilito aspicio utilis ara.",
        "author": "Meghan King",
        "date": "2025-03-17",
        "avatar": "https://avatars.githubusercontent.com/u/35389904",
        "likes": 897,
        "retweets": 305,
        "comments": 18
    },
    {
        "id": 3,
        "content": "Delibero sumptus vehemens amicitia commemoro suadeo in.",
        "author": "Jeremy Zboncak",
        "date": "2025-08-09",
        "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/63.jpg",
        "likes": 835,
        "retweets": 496,
        "comments": 135
    },
    {
        "id": 4,
        "content": "Chirographum anser error nam nostrum claro bestia derideo abutor.",
        "author": "Helen Bartoletti",
        "date": "2024-09-26",
        "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/91.jpg",
        "likes": 275,
        "retweets": 312,
        "comments": 190
    },
    {
        "id": 5,
        "content": "Substantia adulescens corroboro attonbitus curriculum atrox dedico terga enim.",
        "author": "Douglas Spencer",
        "date": "2025-04-13",
        "avatar": "https://avatars.githubusercontent.com/u/53729829",
        "likes": 176,
        "retweets": 150,
        "comments": 197
    },
    {
        "id": 6,
        "content": "Somniculosus peccatus aliquam voluptatum pel sperno apud.",
        "author": "Julio Hahn DVM",
        "date": "2024-12-01",
        "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/22.jpg",
        "likes": 136,
        "retweets": 78,
        "comments": 105
    },
]
