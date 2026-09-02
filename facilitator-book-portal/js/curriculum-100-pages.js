/**
 * Complete 100-Page Curriculum & Activities Database
 * 10 Units x 10 Pages = 100 Pages
 * Page 11 is the dedicated "Forest Bubble Quest: Consonant Brambles" game.
 */

const CURRICULUM_UNITS = [
    { id: 1, title: "Unit 1: Alphabet Foundations", pages: "1–10", theme: "Forest Gate & Letter Recognition", color: "#10b981" },
    { id: 2, title: "Unit 2: Consonants & Vowels", pages: "11–20", theme: "Consonant Isolation & Short Vowels", color: "#059669" },
    { id: 3, title: "Unit 3: Short & Long Vowel Teams", pages: "21–30", theme: "Vowel Diphthongs & Rhymes", color: "#0284c7" },
    { id: 4, title: "Unit 4: Consonant Digraphs", pages: "31–40", theme: "sh, ch, th, wh, ph, ng Patterns", color: "#6366f1" },
    { id: 5, title: "Unit 5: Blends & Clusters", pages: "41–50", theme: "Initial & Final Blends (bl, cl, str)", color: "#8b5cf6" },
    { id: 6, title: "Unit 6: Sight Words & Core Vocabulary", pages: "51–60", theme: "High-Frequency Words & Speed", color: "#ec4899" },
    { id: 7, title: "Unit 7: Word Families & Rhyming", pages: "61–70", theme: "CVC, -at, -in, -op, -ug Families", color: "#f59e0b" },
    { id: 8, title: "Unit 8: Sentence Building & Grammar", pages: "71–80", theme: "Punctuation, Nouns & Verbs", color: "#ea580c" },
    { id: 9, title: "Unit 9: Story Comprehension", pages: "81–90", theme: "Passage Reading & Fact Finding", color: "#0d9488" },
    { id: 10, title: "Unit 10: Reading Mastery & Fluency", pages: "91–100", theme: "Grand Phonics Quest & Certificate", color: "#eab308" }
];

// Helper to generate comprehensive 100 pages
function generate100PagesCurriculum() {
    const pages = [];

    const pageTitles = [
        // Unit 1 (1-10)
        "The Forest Gate: Alphabet Introduction",
        "Uppercase Kingdom: A to G",
        "Uppercase Kingdom: H to N",
        "Uppercase Kingdom: O to T",
        "Uppercase Kingdom: U to Z",
        "Lowercase Meadow: a to g",
        "Lowercase Meadow: h to n",
        "Lowercase Meadow: o to t",
        "Lowercase Meadow: u to z",
        "Alphabet Bridge: Case Matching Challenge",

        // Unit 2 (11-20)
        "The Consonant Bramble Glade", // PAGE 11 (SPECIAL GAME)
        "Short Vowel /a/ at the Brook",
        "Short Vowel /e/ on the Mossy Stone",
        "Short Vowel /i/ in Whispering Pines",
        "Short Vowel /o/ in the Hollow Log",
        "Short Vowel /u/ under the Umbrella",
        "The 5 Vowels Island Challenge",
        "Hard & Soft 'C' in the Cave",
        "Hard & Soft 'G' in the Giant Tree",
        "Consonant vs Vowel Forest Showdown",

        // Unit 3 (21-30)
        "Long Vowel /a_e/ Silent Magic E",
        "Long Vowel /i_e/ Kite Flight",
        "Long Vowel /o_e/ Stone Trail",
        "Long Vowel /u_e/ Flute Hollow",
        "Long Vowel /e_e/ & /ee/ Pine Peak",
        "Vowel Team /ai/ & /ay/ Rain Forest",
        "Vowel Team /oa/ & /ow/ Boat Rapids",
        "Vowel Team /ea/ & /ee/ Eagle Nest",
        "Diphthongs /oi/ & /oy/ Coin Cavern",
        "Diphthongs /ou/ & /ow/ Owl Outlook",

        // Unit 4 (31-40)
        "Digraph /sh/ in the Shimmering Brook",
        "Digraph /ch/ Chimney Rock",
        "Digraph /th/ Thorny Briars",
        "Digraph /wh/ Whispering Windmill",
        "Digraph /ph/ Phoenix Feather",
        "Digraph /ng/ Songbird Clearing",
        "Digraph /ck/ at the Duck Pond",
        "Silent Letter 'kn' & 'gn' Gnome Knoll",
        "Silent Letter 'wr' Writer's Treehouse",
        "Digraph Detective Master Challenge",

        // Unit 5 (41-50)
        "L-Blends: bl, cl, fl at Flower Bank",
        "L-Blends: gl, pl, sl at Slide Meadow",
        "R-Blends: br, cr, dr at Dragon Ridge",
        "R-Blends: fr, gr, pr at Prairie Sun",
        "R-Blends: tr, str at Trail Crossing",
        "S-Blends: sc, sk, sl at Sky Summit",
        "S-Blends: sm, sn, sp at Spring Bloom",
        "S-Blends: st, sw at Sweet Stream",
        "Three-Letter Blends: scr, spl, spr",
        "Blend Builder Forest Relay",

        // Unit 6 (51-60)
        "Sight Words 1: the, of, and, a, to",
        "Sight Words 2: in, is, you, that, it",
        "Sight Words 3: he, was, for, on, are",
        "Sight Words 4: as, with, his, they, I",
        "Sight Words 5: at, be, this, have, from",
        "Sight Words 6: or, one, had, by, word",
        "Sight Words 7: but, not, what, all, were",
        "Sight Words 8: we, when, your, can, said",
        "Sight Words 9: there, use, an, each, which",
        "Sight Word Speed Race Challenge",

        // Unit 7 (61-70)
        "Word Family: -at (cat, bat, hat, rat)",
        "Word Family: -an (pan, fan, can, man)",
        "Word Family: -en & -ed (hen, pen, bed)",
        "Word Family: -ip & -in (pip, ship, pin)",
        "Word Family: -og & -op (dog, log, top)",
        "Word Family: -ug & -un (bug, mug, sun)",
        "Compound Words: Sun + flower = Sunflower",
        "Compound Words: Rain + bow = Rainbow",
        "Prefixes: un-, re-, pre- Woods",
        "Suffixes: -ing, -ed, -ful Meadow",

        // Unit 8 (71-80)
        "Building Simple Sentences",
        "Nouns: Animals & Forest Objects",
        "Verbs: Run, Jump, Hop, Glide",
        "Adjectives: Bright, Sunny, Swift",
        "Capital Letters & Full Stops",
        "Question Marks & Wondering Sentences",
        "Exclamation Marks in the Wild!",
        "Who, What, Where in the Story",
        "Sentence Scramble Forest Puzzle",
        "Story Scribe Beginner Challenge",

        // Unit 9 (81-90)
        "Reading Passage: Barnaby's Great Map",
        "Reading Passage: Pippin's Fast Acorn",
        "Reading Passage: The Secret Waterfall",
        "Reading Passage: The Lost Hummingbird",
        "Reading Passage: Camping under the Stars",
        "Reading Passage: The Moonlight Concert",
        "Reading Passage: The Clever Beaver's Dam",
        "Reading Passage: The Rainbow Over Wood",
        "Reading Passage: The Whispering Tree Key",
        "Passage Comprehension Challenge",

        // Unit 10 (91-100)
        "Mastery Quest: Alphabet Sprint",
        "Mastery Quest: Vowel Vault",
        "Mastery Quest: Consonant Fortress",
        "Mastery Quest: Blend Bridge",
        "Mastery Quest: Digraph Dungeon",
        "Mastery Quest: Sight Word Safari",
        "Mastery Quest: Fluency Flight",
        "Mastery Quest: Comprehension Champion",
        "Grand Forest Tournament (Final Exam)",
        "Graduation Day & Master Certificate!"
    ];

    for (let pageNum = 1; pageNum <= 100; pageNum++) {
        const unitIndex = Math.floor((pageNum - 1) / 10);
        const unit = CURRICULUM_UNITS[unitIndex];
        const title = pageTitles[pageNum - 1] || `Page ${pageNum} Phonics Activity`;
        const isPage11 = pageNum === 11;

        const activities = [];

        if (isPage11) {
            // PAGE 11: DEDICATED FOREST BUBBLE QUEST GAME
            activities.push({
                id: "act-11-1",
                title: "Forest Bubble Quest: Consonant Glade",
                type: "interactive-game",
                gameEngineType: "forest-bubble-quest",
                isFeatured: true,
                badge: "Featured Canvas Game ⭐",
                icon: "🫧",
                description: "Pop falling bubbles with CONSONANTS (B, C, D, F, G...) before they touch the ground brambles! Dodge the vowels.",
                skills: ["Consonant Sound Isolation", "Phonemic Discrimination", "Reaction Speed"],
                difficulty: "Medium",
                estimatedTime: "3–5 mins",
                targetGoal: 10
            });
            activities.push({
                id: "act-11-2",
                title: "Consonant & Vowel Soundboard",
                type: "soundboard-practice",
                badge: "Audio Practice",
                icon: "🗣️",
                description: "Interactive audio flashcards sounding out all 21 consonants and 5 vowels with teacher phonics pronunciation.",
                skills: ["Pronunciation", "Phonetic Awareness"],
                difficulty: "Easy",
                estimatedTime: "2 mins"
            });
        } else {
            // Standard dynamic interactive activities for all other pages
            activities.push({
                id: `act-${pageNum}-1`,
                title: `${title} - Primary Challenge`,
                type: "interactive-game",
                gameEngineType: "mini-catcher",
                isFeatured: true,
                badge: "Interactive Practice ⭐",
                icon: getUnitIcon(unitIndex),
                description: `Interactive learning game designed specifically for ${title}. Test learner mastery with visual and audio feedback.`,
                skills: [unit.title.split(':')[1].trim(), "Phonics Mastery"],
                difficulty: pageNum < 30 ? "Easy" : (pageNum < 70 ? "Medium" : "Advanced"),
                estimatedTime: "3 mins"
            });

            activities.push({
                id: `act-${pageNum}-2`,
                title: `${title} - Comprehension Quiz`,
                type: "quiz",
                badge: "Quick Quiz",
                icon: "📝",
                description: `5-question interactive check for understanding to verify learner comprehension of Page ${pageNum}.`,
                skills: ["Comprehension", "Concept Review"],
                difficulty: "Easy",
                estimatedTime: "2 mins"
            });
        }

        pages.push({
            pageNumber: pageNum,
            unitId: unit.id,
            unitTitle: unit.title,
            title: title,
            theme: unit.theme,
            isPage11: isPage11,
            activitiesCount: activities.length,
            facilitatorObjective: `Learners will demonstrate mastery of ${title} through interactive gameplay and immediate feedback.`,
            facilitatorTips: `Encourage learners to say sounds aloud when popping or tapping items. Model pronunciation for struggling readers.`,
            activities: activities
        });
    }

    return pages;
}

function getUnitIcon(unitIdx) {
    const icons = ["🔤", "🫧", "🌊", "🔍", "🌪️", "⚡", "🧩", "✍️", "📖", "🏆"];
    return icons[unitIdx] || "🎮";
}

window.FULL_100_PAGES_DATA = generate100PagesCurriculum();
window.CURRICULUM_UNITS = CURRICULUM_UNITS;
