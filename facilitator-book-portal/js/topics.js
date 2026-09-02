/**
 * Topics for Page 11 Forest Bubble Sorting Quest
 */
const TOPIC_LIBRARY = {
    "consonants-quest": {
        id: "consonants-quest",
        title: "Consonant Letters Quest",
        subject: "Consonants",
        description: "Pop all 21 consonant letters before they touch the forest brambles!",
        levels: [
            {
                levelNumber: 1,
                name: "Pop the Consonants!",
                targetRule: "Pop CONSONANTS (B, C, D, F, G, H...)! (Let vowels A, E, I, O, U drop into the brambles!)",
                targetGoal: 10,
                speedMultiplier: 1.0,
                items: [
                    { text: "B", sound: "/b/", isTarget: true },
                    { text: "C", sound: "/k/", isTarget: true },
                    { text: "D", sound: "/d/", isTarget: true },
                    { text: "F", sound: "/f/", isTarget: true },
                    { text: "G", sound: "/g/", isTarget: true },
                    { text: "H", sound: "/h/", isTarget: true },
                    { text: "J", sound: "/j/", isTarget: true },
                    { text: "K", sound: "/k/", isTarget: true },
                    { text: "L", sound: "/l/", isTarget: true },
                    { text: "M", sound: "/m/", isTarget: true },
                    { text: "N", sound: "/n/", isTarget: true },
                    { text: "P", sound: "/p/", isTarget: true },
                    { text: "Q", sound: "/kw/", isTarget: true },
                    { text: "R", sound: "/r/", isTarget: true },
                    { text: "S", sound: "/s/", isTarget: true },
                    { text: "T", sound: "/t/", isTarget: true },
                    { text: "V", sound: "/v/", isTarget: true },
                    { text: "W", sound: "/w/", isTarget: true },
                    { text: "X", sound: "/ks/", isTarget: true },
                    { text: "Y", sound: "/y/", isTarget: true },
                    { text: "Z", sound: "/z/", isTarget: true },
                    { text: "A", sound: "/æ/", isTarget: false },
                    { text: "E", sound: "/ɛ/", isTarget: false },
                    { text: "I", sound: "/ɪ/", isTarget: false },
                    { text: "O", sound: "/ɒ/", isTarget: false },
                    { text: "U", sound: "/ʌ/", isTarget: false }
                ]
            }
        ]
    },
    "vowels-quest": {
        id: "vowels-quest",
        title: "Vowel Letters Quest",
        subject: "Vowels",
        description: "Pop the 5 vowel letters (A, E, I, O, U) before they touch the forest brambles!",
        levels: [
            {
                levelNumber: 1,
                name: "Pop the Vowels!",
                targetRule: "Pop VOWELS (A, E, I, O, U)! (Let consonants drop into the brambles!)",
                targetGoal: 10,
                speedMultiplier: 1.0,
                items: [
                    { text: "A", sound: "/æ/", isTarget: true },
                    { text: "E", sound: "/ɛ/", isTarget: true },
                    { text: "I", sound: "/ɪ/", isTarget: true },
                    { text: "O", sound: "/ɒ/", isTarget: true },
                    { text: "U", sound: "/ʌ/", isTarget: true },
                    { text: "B", sound: "/b/", isTarget: false },
                    { text: "C", sound: "/k/", isTarget: false },
                    { text: "D", sound: "/d/", isTarget: false },
                    { text: "F", sound: "/f/", isTarget: false },
                    { text: "G", sound: "/g/", isTarget: false },
                    { text: "H", sound: "/h/", isTarget: false },
                    { text: "K", sound: "/k/", isTarget: false },
                    { text: "L", sound: "/l/", isTarget: false },
                    { text: "M", sound: "/m/", isTarget: false },
                    { text: "P", sound: "/p/", isTarget: false },
                    { text: "R", sound: "/r/", isTarget: false },
                    { text: "S", sound: "/s/", isTarget: false },
                    { text: "T", sound: "/t/", isTarget: false },
                    { text: "Z", sound: "/z/", isTarget: false }
                ]
            }
        ]
    }
};

class TopicManager {
    getAllTopics() { return TOPIC_LIBRARY; }
    getTopic(id) { return TOPIC_LIBRARY[id] || TOPIC_LIBRARY["consonants-quest"]; }
}

window.topicManager = new TopicManager();
