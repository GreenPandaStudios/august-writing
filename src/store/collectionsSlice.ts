import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Collection {
  id: string;
  title: string;
  description: string;
  poems: string[];
  type: 'curated' | 'user';
}

interface CollectionsState {
  collections: Collection[];
  activeCollectionId: string | 'All';
}

const initialCurated: Collection[] = [
  {
    id: "architecture-of-growth",
    title: "The Architecture of Growth",
    description: "A chronological and thematic study of maturation, from the first steps of change to the complex realization of what we must leave behind.",
    poems: [
      "growing-up-part-1-.json", "growing-up-part-2-.json", "growing-up-part-3-.json", 
      "growing-up-part-4-.json", "growing-up-part-5-.json", "growing-up-part-6-.json", 
      "growing-up-part-7-.json", "growing-up-part-8-.json", "growing-up-part-9-.json", 
      "growing-up-part-10-.json", "growing-up-part-11-.json", "growing-up-part-12-.json", 
      "growing-up-part-13-.json", "i-grew.json", "grow-up.json", "learning-how.json",
      "destination.json", "start-today.json", "try-something-hard-today.json", "try-something-hard-today-2.json"
    ],
    type: "curated"
  },
  {
    id: "ordinary-wonders",
    title: "The Quiet & The Ordinary",
    description: "A celebration of the small rituals that anchor us—coffee, laundry, and the profound beauty hidden in the flavor of an ordinary day.",
    poems: [
      "the-way-i-make-coffee.json", "flavor-of-ordinary.json", "am-radio.json", "laundry.json", 
      "real-things.json", "richness.json", "special.json", "wonderful-things.json",
      "have-you-ever-noticed-something-perfect-.json", "homemade-poet-recipe.json",
      "the-trash-can-in-my-room.json", "tuesdays-on-a-wednesday.json", "fri-april-25th-2025.json"
    ],
    type: "curated"
  },
  {
    id: "anatomy-of-connection",
    title: "The Anatomy of Connection",
    description: "An exploration of the gravity between souls—the initial pull, the definition of love, and the complex reality of wanting another person.",
    poems: [
      "i-think-i-love-you.json", "define-love-.json", "i-know-we-just-began-.json", 
      "i-think-i-loved-you.json", "love-stories.json", "we-re-in-the-same-story.json",
      "another-poem-about-whatever-love-is.json", "for-you.json", "ellie.json",
      "unblinded.json", "you-made-me-feel-like-me.json", "you-re-in-it-all-.json",
      "tangled.json", "i-just-knew.json", "it-felt-like-seeing.json", "honestly.json"
    ],
    type: "curated"
  },
  {
    id: "geography-of-heartbreak",
    title: "The Geography of Heartbreak",
    description: "Mapping the terrain of loss, from the sharp sting of walking away to the long, dull ache of missing someone who is no longer there.",
    poems: [
      "i-walked-away.json", "i-miss-you.json", "thank-you-for-not-loving-me.json", 
      "i-won-t-love-you.json", "i-m-gone.json", "i-ll-lose-you-anyway.json",
      "last-fall-.json", "before-i-knew.json", "ghost.json", "vulture.json",
      "broken-promises.json", "okay-maybe-i-didn-t-love-you.json", "true-tragedy.json",
      "happy-from-a-distance-.json", "all-the-best-.json", "somewhere-else.json"
    ],
    type: "curated"
  },
  {
    id: "silence-between-us",
    title: "The Silence Between Us",
    description: "A journey through the negative space of conversation, finding weight in the things left unsaid and the quiet moments between breaths.",
    poems: [
      "the-quiet.json", "the-negative-space.json", "enough-unsaid.json", "things-unsaid.json",
      "just-breathe.json", "i-can-hold-my-breath.json", "words-mean-nothing.json", 
      "the-words-i-won-t-send.json", "hey-.json", "speaking.json", "nothing-at-all.json",
      "the-space-called-wanting.json", "steady-.json", "foggy-days.json"
    ],
    type: "curated"
  },
  {
    id: "mirror-and-the-maker",
    title: "The Mirror & The Maker",
    description: "A deeply introspective look at identity, art, and the difficult process of seeing oneself clearly through the lens of one's own creation.",
    poems: [
      "who-am-i-.json", "who-are-you-.json", "who-are-you.json", "who-i-am.json",
      "reflection.json", "mirrors.json", "-un-seen.json", "look-at-me-.json",
      "i-exist-.json", "because-i-m-nothing-.json", "i-was-nothing-.json",
      "my-best-art-is-behind-me-.json", "say-something-poetic.json", "homemade-poet-recipe.json",
      "characters.json", "seven-word-story.json"
    ],
    type: "curated"
  },
  {
    id: "currency-of-time",
    title: "The Currency of Time",
    description: "Reflections on the only thing we cannot earn back—nostalgia, the funny trick of time, and the legacy left behind by those before us.",
    poems: [
      "time-is-the-only-real-currency.json", "the-funny-thing-about-time.json", 
      "another-funny-thing-about-time.json", "time-travel.json", "nostalgia.json",
      "old-songs.json", "old-things.json", "last-fall-.json", "hope-at-50.json",
      "my-92-year-old-grandfather.json", "my-dad-told-me-something.json", 
      "how-my-great-grandfather-starts-every-story-.json", "time-well-spent.json"
    ],
    type: "curated"
  },
  {
    id: "art-of-resilience",
    title: "The Art of Resilience",
    description: "A testament to survival, teaching the vital lesson that it is okay to lose a few pieces as long as you keep moving forward.",
    poems: [
      "its-okay-to-lose-a-few-pieces.json", "carrying-on.json", "at-peace.json", 
      "go-live.json", "how-to-live.json", "now.json", "here-on-purpose-.json",
      "sudden-perspective.json", "difficult-decisions.json", "from-one-decision.json",
      "the-best-choice.json", "have-some-courage.json", "steady-.json", "i-stopped.json"
    ],
    type: "curated"
  },
  {
    id: "nocturnal-visions",
    title: "Nocturnal Visions",
    description: "Observations from the hours where the world is asleep—dreams, stars, and the loud music that fills the internal silence.",
    poems: [
      "1-02-am.json", "12-43-am.json", "my-dream-last-night.json", "the-dream.json",
      "north-star.json", "december.json", "loud-music.json", "rainy-day.json",
      "tomorrow.json", "tomorrow-2.json", "tomorrow-2-2.json", "running.json"
    ],
    type: "curated"
  },
  {
    id: "human-condition",
    title: "The Human Condition",
    description: "A catch-all of the messy, complicated, and often ironic truths of being alive, being bitter, and being enough.",
    poems: [
      "100-little-things-i-don-t-do.json", "kinda-okay.json", "honestly.json", 
      "everything.json", "unfair.json", "complicated.json", "unfair.json",
      "to-pieces-.json", "meltdown-.json", "find-out-.json", "i-m-not-good-enough-.json",
      "i-hesitate.json", "i-m-a-coward.json", "how-to-be-bitter.json", "vulture.json",
      "entitled.json", "the-sales-game.json", "you-suck-at-telling-stories-.json",
      "the-shoes-are-not-a-metaphor.json", "nerf-guns-among-other-things-.json",
      "this-is-an-intervention.json"
    ],
    type: "curated"
  },
  {
    id: "place-and-belonging",
    title: "Place & Belonging",
    description: "An exploration of where we fit in the world—homes, strangers, and the physical spaces that hold our memories.",
    poems: [
      "welcome-home.json", "home-again.json", "home.json", "place.json",
      "two-travelers.json", "two-strangers.json", "i-saw-a-stranger.json",
      "the-foot-of-a-path.json", "if-you-climb-trees.json", "carrying-on.json",
      "an-insignificant-case-study.json", "an-insignificant-case-study.json"
    ],
    type: "curated"
  },
  {
    id: "whispers-of-faith",
    title: "Whispers of Faith",
    description: "Brief, sharp reflections on the eternal, the divine, and the inevitable win of the light.",
    poems: [
      "god-always-wins-.json", "i-m-convinced-we-have-souls.json", "here-on-purpose-.json",
      "happiness.json", "beauty.json", "heaven.json", "heaven.json"
    ],
    type: "curated"
  }
];

const initialState: CollectionsState = {
  collections: initialCurated,
  activeCollectionId: 'All',
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setActiveCollection: (state, action: PayloadAction<string>) => {
      state.activeCollectionId = action.payload;
    },
    addUserCollection: (state, action: PayloadAction<{ title: string; description: string }>) => {
      const newCol: Collection = {
        id: `user-${Date.now()}`,
        title: action.payload.title,
        description: action.payload.description,
        poems: [],
        type: 'user'
      };
      state.collections.push(newCol);
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter(c => c.id !== action.payload || c.type === 'curated');
    },
    addPoemToCollection: (state, action: PayloadAction<{ collectionId: string; poemKey: string }>) => {
      const col = state.collections.find(c => c.id === action.payload.collectionId);
      if (col && !col.poems.includes(action.payload.poemKey)) {
        col.poems.push(action.payload.poemKey);
      }
    },
    removePoemFromCollection: (state, action: PayloadAction<{ collectionId: string; poemKey: string }>) => {
      const col = state.collections.find(c => c.id === action.payload.collectionId);
      if (col) {
        col.poems = col.poems.filter(pk => pk !== action.payload.poemKey);
      }
    },
    updateCollection: (state, action: PayloadAction<Collection>) => {
      const index = state.collections.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.collections[index] = action.payload;
      }
    }
  },
});

export const { 
  setActiveCollection, 
  addUserCollection, 
  deleteCollection, 
  addPoemToCollection, 
  removePoemFromCollection,
  updateCollection
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
