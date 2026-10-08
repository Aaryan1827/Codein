const QUOTES_DATA = [
  // Motivation & Hustle
  {
    id: 1,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Dreams", "Future", "Inspiration"],
    theme: "neon"
  },
  {
    id: 2,
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "motivation",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Hustle", "Action", "Focus"],
    theme: "neon"
  },
  {
    id: 3,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "motivation",
    bg: "assets/images/bg-retro.jpg",
    tags: ["Wisdom", "Action", "Time"],
    theme: "retro"
  },
  {
    id: 4,
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "motivation",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Authenticity", "Life", "Focus"],
    theme: "pop"
  },
  {
    id: 5,
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "motivation",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Courage", "Fearless", "Growth"],
    theme: "cosmic"
  },
  {
    id: 6,
    text: "Do what you can, with what you have, where you are.",
    author: "Teddy Roosevelt",
    category: "motivation",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Action", "Mindset", "Drive"],
    theme: "neon"
  },
  
  // Funky & Witty
  {
    id: 7,
    text: "Reality is merely an illusion, albeit a very persistent one.",
    author: "Albert Einstein",
    category: "funky",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Physics", "Mind-bending", "Cosmic"],
    theme: "cosmic"
  },
  {
    id: 8,
    text: "I can resist everything except temptation.",
    author: "Oscar Wilde",
    category: "funky",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Wit", "Humor", "Wild"],
    theme: "pop"
  },
  {
    id: 9,
    text: "Stay hungry, stay foolish. And occasionally stay funky.",
    author: "Steve Jobs (Remixed)",
    category: "funky",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Funky", "Vibes", "Creative"],
    theme: "pop"
  },
  {
    id: 10,
    text: "I am so clever that sometimes I don't understand a single word of what I am saying.",
    author: "Oscar Wilde",
    category: "funky",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Wit", "Genius", "Humor"],
    theme: "pop"
  },
  {
    id: 11,
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
    category: "funky",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Humor", "Cosmic", "Truth"],
    theme: "cosmic"
  },
  {
    id: 12,
    text: "Do not take life too seriously. You will never get out of it alive.",
    author: "Elbert Hubbard",
    category: "funky",
    bg: "assets/images/bg-retro.jpg",
    tags: ["Vibes", "Humor", "Chill"],
    theme: "retro"
  },

  // Cosmic Wisdom & Deep Thinking
  {
    id: 13,
    text: "We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    category: "wisdom",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Space", "Cosmic", "Existence"],
    theme: "cosmic"
  },
  {
    id: 14,
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung",
    category: "wisdom",
    bg: "assets/images/bg-zen.jpg",
    tags: ["Self-Discovery", "Psychology", "Truth"],
    theme: "zen"
  },
  {
    id: 15,
    text: "Silence is a source of great strength.",
    author: "Lao Tzu",
    category: "wisdom",
    bg: "assets/images/bg-zen.jpg",
    tags: ["Zen", "Peace", "Mindfulness"],
    theme: "zen"
  },
  {
    id: 16,
    text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.",
    author: "Rumi",
    category: "wisdom",
    bg: "assets/images/bg-zen.jpg",
    tags: ["Soul", "Poetry", "Connection"],
    theme: "zen"
  },
  {
    id: 17,
    text: "We do not see things as they are, we see them as we are.",
    author: "Anaïs Nin",
    category: "wisdom",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Perception", "Mind", "Philosophy"],
    theme: "cosmic"
  },

  // Creativity & Art
  {
    id: 18,
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "creativity",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Art", "Play", "Genius"],
    theme: "pop"
  },
  {
    id: 19,
    text: "Learn the rules like a pro, so you can break them like an artist.",
    author: "Pablo Picasso",
    category: "creativity",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Art", "Rebel", "Rules"],
    theme: "pop"
  },
  {
    id: 20,
    text: "The chief enemy of creativity is 'good' sense.",
    author: "Pablo Picasso",
    category: "creativity",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Wild", "Expression", "Freedom"],
    theme: "pop"
  },
  {
    id: 21,
    text: "Inspiration exists, but it has to find you working.",
    author: "Pablo Picasso",
    category: "creativity",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Hustle", "Craft", "Creation"],
    theme: "neon"
  },
  {
    id: 22,
    text: "Have no fear of perfection - you'll never reach it.",
    author: "Salvador Dalí",
    category: "creativity",
    bg: "assets/images/bg-retro.jpg",
    tags: ["Surreal", "Art", "Perfection"],
    theme: "retro"
  },

  // Zen & Inner Peace
  {
    id: 23,
    text: "Flow with whatever may happen and let your mind be free.",
    author: "Zhuangzi",
    category: "zen",
    bg: "assets/images/bg-zen.jpg",
    tags: ["Flow", "Peace", "Freedom"],
    theme: "zen"
  },
  {
    id: 24,
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "zen",
    bg: "assets/images/bg-zen.jpg",
    tags: ["Serenity", "Inner Peace", "Calm"],
    theme: "zen"
  },
  {
    id: 25,
    text: "Empty your mind, be formless, shapeless, like water.",
    author: "Bruce Lee",
    category: "zen",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Martial Arts", "Adaptability", "Power"],
    theme: "neon"
  },
  {
    id: 26,
    text: "The soul should always stand ajar, ready to welcome the ecstatic experience.",
    author: "Emily Dickinson",
    category: "zen",
    bg: "assets/images/bg-cosmic.jpg",
    tags: ["Joy", "Openness", "Wonder"],
    theme: "cosmic"
  },

  // Genius & Mavericks
  {
    id: 27,
    text: "Here's to the crazy ones. The misfits. The rebels. The troublemakers.",
    author: "Steve Jobs",
    category: "rebel",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Mavericks", "Change", "Rebel"],
    theme: "neon"
  },
  {
    id: 28,
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
    category: "rebel",
    bg: "assets/images/bg-neon.jpg",
    tags: ["Grit", "Future", "Boldness"],
    theme: "neon"
  },
  {
    id: 29,
    text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    author: "Mark Zuckerberg",
    category: "rebel",
    bg: "assets/images/bg-pop.jpg",
    tags: ["Speed", "Disruption", "Tech"],
    theme: "pop"
  },
  {
    id: 30,
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "motivation",
    bg: "assets/images/bg-retro.jpg",
    tags: ["Perseverance", "Victory", "Hope"],
    theme: "retro"
  }
];
