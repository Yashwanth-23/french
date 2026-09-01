const fs = require('fs');
const path = require('path');

const bridges = [
  {
    id: "bridge-gender",
    topic: "Grammatical Gender for Inanimate Objects",
    category: "Grammar",
    frenchConcept: "All nouns in French are either Masculine (un/le) or Feminine (une/la). Adjectives must agree in gender and number.",
    hindiAnalogy: "Identical to Hindi! In Hindi, inanimate objects have grammatical gender (कमरा m, किताब f) and adjectives change accordingly (बड़ा कमरा, बड़ी किताब).",
    teluguAnalogy: "Unlike Telugu which uses natural gender (Mahat/Mahati vs Neut/Achethana), French forces gender onto inanimate things. Do not think in Telugu neuter terms.",
    englishAnalogy: "English lost grammatical gender centuries ago, so English speakers struggle with this. Use your Hindi mental model instead.",
    exampleFrench: "Une grande maison (f) / Un grand livre (m)",
    exampleHindi: "एक बड़ा घर (m) / एक बड़ी किताब (f)",
    exampleTelugu: "ఒక పెద్ద ఇల్లు / ఒక పెద్ద పుస్తకం (లింగ భేదం లేదు)",
    exampleEnglish: "A big house / A big book (No gender distinction)",
    practicalTip: "Always memorize every French noun with its article (le/la or un/une). Never write down a French noun alone."
  },
  {
    id: "bridge-tu-vous",
    topic: "Formal vs Informal Pronouns of Address",
    category: "Sociolinguistics",
    frenchConcept: "\"Tu\" is strictly informal (friends, kids, family). \"Vous\" is formal (strangers, elders, boss) or plural (you all).",
    hindiAnalogy: "Exact 1-to-1 match with Hindi: \"Tu\" = तू / तुम, and \"Vous\" = आप. Mixing them up causes offense just like in Hindi.",
    teluguAnalogy: "Exact 1-to-1 match with Telugu: \"Tu\" = నువ్వు (Nuvvu), \"Vous\" = మీరు (Meeru).",
    englishAnalogy: "English only has the generic \"you\", causing English natives to struggle with register. As an Indian speaker, your intuition is already perfect here.",
    exampleFrench: "Comment vas-tu ? (Informal) vs Comment allez-vous ? (Formal)",
    exampleHindi: "तू कैसा है? vs आप कैसे हैं?",
    exampleTelugu: "నువ్వు ఎలా ఉన్నావు? vs మీరు ఎలా ఉన్నారు?",
    exampleEnglish: "How are you? vs How are you? (Context-dependent)",
    practicalTip: "In TEF/TCF Speaking Section A (asking questions to an administrative clerk/agent), ALWAYS use VOUS. In Section B (persuading a friend), ALWAYS use TU."
  },
  {
    id: "bridge-nasals",
    topic: "Nasal Vowels (an/en, in/ain, on, un)",
    category: "Phonetics",
    frenchConcept: "Vowels followed by n/m in the same syllable are nasalized without pronouncing the N or M consonant.",
    hindiAnalogy: "Directly equivalent to the Hindi Chandrabindu / Anunasika (माँ, आँख, चाँद) and Anusvara (संसार). Air escapes through both mouth and nose simultaneously.",
    teluguAnalogy: "Similar to Telugu Sunna (సున్నా / Anusvara - ం) when pronounced before non-plosives, softening the vowel.",
    englishAnalogy: "English has no true nasal vowels. English speakers falsely pronounce the final \"N\" consonant (e.g. saying \"bonn\" instead of [bɔ̃]).",
    exampleFrench: "Pain [pɛ̃] (bread), Bon [bɔ̃] (good), Blanc [blɑ̃] (white)",
    exampleHindi: "हंस, चाँद, माँ (No hard \"n\" consonant struck at the end)",
    exampleTelugu: "అం, కం (అనునాసిక శబ్దాలు)",
    exampleEnglish: "Pan, Bone, Blank (Notice how English strikes a hard N/K consonant)",
    practicalTip: "Block your nasal passage slightly with your fingers. If you feel vibration and no tongue touch against your upper teeth, you are pronouncing French nasals correctly."
  },
  {
    id: "bridge-word-order",
    topic: "Sentence Syntax: SVO vs SOV",
    category: "Grammar",
    frenchConcept: "French is strictly Subject - Verb - Object (SVO): \"Je mange une pomme\".",
    hindiAnalogy: "Hindi is Subject - Object - Verb (SOV): \"मैं सेब खाता हूँ\". Do NOT translate word-for-word from Hindi order into French.",
    teluguAnalogy: "Telugu is strictly SOV: \"నేను ఆపిల్ తింటున్నాను\" (Nenu apple thintunnanu). Avoid placing the verb at the end.",
    englishAnalogy: "English is strictly SVO: \"I eat an apple\". Leverage your English syntax reflexes for basic French sentences.",
    exampleFrench: "S: Je (I) + V: regarde (watch) + O: la télévision (the TV)",
    exampleHindi: "S: मैं + O: टीवी + V: देखता हूँ (Verb is at the end)",
    exampleTelugu: "S: నేను + O: టీవీ + V: చూస్తున్నాను (Verb is at the end)",
    exampleEnglish: "S: I + V: watch + O: the TV",
    practicalTip: "Exception alert: When using object pronouns (me, te, le, la, lui, en, y), French moves them BEFORE the verb (\"Je la regarde\"). Think of this as a temporary switch to SOV."
  },
  {
    id: "bridge-passe-imparfait",
    topic: "Past Tense: Passé Composé vs Imparfait",
    category: "Grammar",
    frenchConcept: "Passé Composé = completed one-time events. Imparfait = ongoing background states, descriptions, or habitual actions.",
    hindiAnalogy: "Passé Composé = मैंने देखा / वह गया (simple past event). Imparfait = मैं देखता था / वह जा रहा था (habitual or continuous past).",
    teluguAnalogy: "Passé Composé = నేను చూశాను (Nenu choosanu). Imparfait = నేను చూసేవాడిని / చూస్తూ ఉన్నాను (Habitual / continuous past).",
    englishAnalogy: "Passé Composé = I saw / I went. Imparfait = I was seeing / I used to go.",
    exampleFrench: "Il pleuvait (Imparfait: background) quand je suis sorti (Passé Composé: specific action).",
    exampleHindi: "बारिश हो रही थी (background) जब मैं बाहर निकला (event).",
    exampleTelugu: "వర్షం పడుతూ ఉంది (background) నేను బయటకు వెళ్ళినప్పుడు (event).",
    exampleEnglish: "It was raining (background) when I went outside (event).",
    practicalTip: "Ask yourself: \"Did this action happen at a precise moment and finish, or was it set as the ongoing scene?\""
  },
  {
    id: "bridge-latin-cognates",
    topic: "Latin & Norman English Cognates (35% Free Vocabulary)",
    category: "Vocabulary",
    frenchConcept: "Thousands of French words ending in -tion, -able, -ible, -ique, -ment are virtually identical to English words.",
    hindiAnalogy: "Similar to how Sanskrit/Tatsama words exist identically in Hindi, Telugu, and Marathi with minor phonetic endings.",
    teluguAnalogy: "Tatsama loanwords common across Indian languages.",
    englishAnalogy: "Direct cognates: Information, Condition, Situation, Possible, Important, Transparent.",
    exampleFrench: "La situation économique est difficile.",
    exampleHindi: "आर्थिक स्थिति कठिन है।",
    exampleTelugu: "ఆర్థిక పరిస్థితి కష్టంగా ఉంది.",
    exampleEnglish: "The economic situation is difficult.",
    practicalTip: "Convert English words ending in \"-ty\" to \"-té\" (Liberty -> Liberté, Activity -> Activité) and \"-ly\" to \"-ment\" (Rapidly -> Rapidement)."
  }
];

const diagnostic = [
  {
    id: "diag-1",
    level: "A0",
    skill: "Phonetics",
    question: "In the French word \"Comment\" (as in \"Comment allez-vous ?\"), which letter is silent?",
    options: ["The letter C", "The letter O", "The letter T", "The letter M"],
    correctIndex: 2,
    explanation: "In French, final consonants (D, P, S, T, X, Z) are generally silent unless followed by a vowel or governed by the CaReFuL rule."
  },
  {
    id: "diag-2",
    level: "A1",
    skill: "Conjugation",
    question: "Choose the correct present tense conjugation: \"Nous _____ à Paris.\" (aller)",
    options: ["allons", "allez", "vont", "vas"],
    correctIndex: 0,
    explanation: "The irregular verb \"aller\" conjugates with \"nous\" as \"nous allons\"."
  },
  {
    id: "diag-3",
    level: "A1",
    skill: "Grammar",
    question: "Which auxiliary verb is used to form the Passé Composé for the movement verb \"partir\" (to leave)?",
    options: ["Avoir (\"J'ai parti\")", "Être (\"Je suis parti\")", "Faire (\"Je fais parti\")", "Aller (\"Je vais parti\")"],
    correctIndex: 1,
    explanation: "\"Partir\" is part of the DR & MRS VANDERTRAMP group of movement verbs that take ÊTRE as their auxiliary in Passé Composé."
  },
  {
    id: "diag-4",
    level: "A2",
    skill: "Grammar",
    question: "Complete the sentence with the correct pronoun: \"Tu as vu la nouvelle voiture de Marc ? — Oui, je _____ ai vue hier.\"",
    options: ["le", "lui", "la", "en"],
    correctIndex: 2,
    explanation: "\"La voiture\" is a feminine singular direct object (COD). It is replaced by the pronoun \"la\" (placed before the verb)."
  },
  {
    id: "diag-5",
    level: "A2",
    skill: "Grammar",
    question: "Choose the correct tense combination: \"Pendant que je _____ (dormir), mon téléphone _____ (sonner).\"",
    options: [
      "dormais (Imparfait) / a sonné (Passé Composé)",
      "ai dormi (Passé Composé) / sonnait (Imparfait)",
      "dormais (Imparfait) / sonnait (Imparfait)",
      "ai dormi (Passé Composé) / a sonné (Passé Composé)"
    ],
    correctIndex: 0,
    explanation: "Sleeping is an ongoing background state (Imparfait: je dormais) interrupted by a specific instantaneous event (Passé Composé: a sonné)."
  },
  {
    id: "diag-6",
    level: "B1",
    skill: "Grammar",
    question: "Which mood must follow the expression \"Il est nécessaire que...\" ?",
    options: ["Indicatif Présent", "Subjonctif Présent", "Conditionnel Présent", "Futur Simple"],
    correctIndex: 1,
    explanation: "Expressions of necessity, emotion, doubt, and obligation (Il faut que, Il est nécessaire que) strictly trigger the Subjonctif in French."
  },
  {
    id: "diag-7",
    level: "B1",
    skill: "Grammar",
    question: "How do you replace \"à la bibliothèque\" in: \"Je vais à la bibliothèque demain\" ?",
    options: [
      "Je lui vais demain",
      "Je m'y vais demain",
      "J'y vais demain",
      "J'en vais demain"
    ],
    correctIndex: 2,
    explanation: "The pronoun \"Y\" replaces places introduced by prepositions like \"à\", \"en\", \"dans\", or \"chez\"."
  },
  {
    id: "diag-8",
    level: "B2",
    skill: "CO",
    question: "In Canadian / Québécois French, what does the expression \"magasiner\" mean?",
    options: [
      "To read magazines",
      "To go shopping for clothes / goods",
      "To build a house",
      "To store merchandise in a warehouse"
    ],
    correctIndex: 1,
    explanation: "In Québécois French, \"magasiner\" is the standard term for \"faire les courses / faire du shopping\"."
  }
];

const examTemplates = [
  {
    id: "tef-eo-section-a",
    section: "EO_SectionA",
    examType: "TEF_Canada",
    title: "Expression Orale - Section A: Gathering Information (Inquiry)",
    timeLimitMinutes: 5,
    objective: "Call or meet an interlocutor (the examiner) based on a short advertisement (job ad, house rental, trip, event) and ask 10+ coherent, varied questions to obtain precise details.",
    structuralFormula: [
      "1. Opening Salutation & Context: \"Bonjour Monsieur/Madame, je vous appelle au sujet de votre annonce concernant...\"",
      "2. Availability & Logistics: Ask regarding dates, schedules, duration, location.",
      "3. Target & Requirements: Ask about requirements, experience, age limits, equipment.",
      "4. Financial Details: Ask regarding exact cost, discounts, payment terms, deposit.",
      "5. Concluding & Next Steps: \"Parfait, comment puis-je m'inscrire ? Merci beaucoup pour vos renseignements, bonne journée !\""
    ],
    essentialConnectors: [
      { french: "Je souhaiterais savoir si...", english: "I would like to know if...", example: "Je souhaiterais savoir si les frais d'inscription sont inclus." },
      { french: "Pourriez-vous me préciser...", english: "Could you clarify for me...", example: "Pourriez-vous me préciser les horaires exacts des cours ?" },
      { french: "Qu'en est-il de...", english: "What is the situation regarding...", example: "Qu'en est-il du matériel nécessaire ? Est-il fourni ?" },
      { french: "Serait-il possible de...", english: "Would it be possible to...", example: "Serait-il possible de visiter les lieux avant de s'engager ?" }
    ],
    modelScriptSnippet: "\"Bonjour Madame ! J'ai vu votre petite annonce dans le journal local pour les cours de cuisine du terroir. Je me permets de vous contacter car je serais vivement intéressé. Tout d'abord, pourriez-vous me préciser quand débutera la prochaine session ? Et qu'en est-il du niveau requis ?...\"",
    samplePrompt: "Vous avez vu une annonce pour un séjour linguistique immersif d'une semaine au Québec. Vous téléphonez à l'organisme pour poser des questions.",
    gradingCriteria: [
      "Fluency and naturalness of question structures (Inversion, Est-ce que, Intonation)",
      "Politeness and consistent use of VOUS",
      "Relevance and variety of information sought (at least 8-10 distinct questions)",
      "Immediate comprehension and reaction to examiner responses"
    ]
  },
  {
    id: "tef-eo-section-b",
    section: "EO_SectionB",
    examType: "TEF_Canada",
    title: "Expression Orale - Section B: Persuading a Friend (Argumentation)",
    timeLimitMinutes: 10,
    objective: "Convince a reluctant friend (the examiner) to join you in an activity, purchase, trip, or lifestyle change based on an advertisement.",
    structuralFormula: [
      "1. Enthusiastic Friendly Hook: \"Salut [Prénom] ! Tu ne devineras jamais sur quoi je viens de tomber !\"",
      "2. Pitching the Idea: Explain why this is an unmissable opportunity tailor-made for them.",
      "3. Argument 1 (Personal Benefit / Health / Career): Lay out concrete positive impacts.",
      "4. Argument 2 (Financial / Convenience / Timing): Highlight discounts, flexibility, proximity.",
      "5. Overcoming Objections (Active Listening): Counter examiner doubts with empathy + solutions.",
      "6. Closing Call to Action: \"Allez, viens, on s'inscrit ensemble, je t'assure que tu ne le regretteras pas !\""
    ],
    essentialConnectors: [
      { french: "D'une part... d'autre part...", english: "On one hand... on the other hand...", example: "D'une part, cela nous fera bouger, et d'autre part, le tarif est très avantageux." },
      { french: "En plus de cela...", english: "In addition to that...", example: "En plus de cela, c'est juste à côté de chez toi !" },
      { french: "Je comprends tes réticences, mais...", english: "I understand your hesitation, but...", example: "Je comprends tes réticences, mais sache que l'horaire est modulable." },
      { french: "C'est l'occasion rêvée de...", english: "It's the dream opportunity to...", example: "C'est l'occasion rêvée de décompresser après une longue semaine." }
    ],
    modelScriptSnippet: "\"Salut Rahul ! Tu as deux minutes ? Écoute, je viens de voir une annonce extraordinaire pour un atelier de prise de parole en public à Montréal ! Je sais à quel point tu souhaites progresser pour tes présentations professionnelles. Regarde, d'un côté le formateur a plus de vingt ans d'expérience, et de l'autre côté, les séances ont lieu en soirée le week-end, donc aucun conflit d'horaire ! Qu'en penses-tu ?\"",
    samplePrompt: "Vous avez trouvé une brochure pour un abonnement partagé à une salle d'escalade. Votre ami(e) est sceptique et pense que c'est trop cher et dangereux. Convainquez-le/la.",
    gradingCriteria: [
      "Use of informal register (TU) throughout",
      "Variety and strength of arguments (avoiding repetitive loops)",
      "Spontaneous rebuttal of 3 to 4 examiner objections",
      "Richness of vocabulary and natural intonation"
    ]
  },
  {
    id: "tef-ee-section-a",
    section: "EE_SectionA",
    examType: "TEF_Canada",
    title: "Expression Écrite - Section A: Continuing a News Snippet (Fait Divers)",
    timeLimitMinutes: 15,
    wordCountTarget: "80 words minimum (aim for 90-110 words)",
    objective: "Continue a newspaper snippet describing an unexpected or curious event. Complete the story logically using the past tenses (Passé Composé & Imparfait).",
    structuralFormula: [
      "1. Continuity: Pick up immediately from the prompt's scenario.",
      "2. Circumstances & Context (Imparfait): What was happening just before?",
      "3. Climactic Event (Passé Composé): What sudden incident occurred?",
      "4. Aftermath & Resolution: How did the authorities/people react and how did it conclude?"
    ],
    essentialConnectors: [
      { french: "Soudainement / Tout à coup", english: "Suddenly", example: "Tout à coup, une alarme a retenti dans tout l'immeuble." },
      { french: "Fort heureusement", english: "Fortunately", example: "Fort heureusement, aucun blessé n'a été à déplorer." },
      { french: "Aussitôt alertés", english: "Immediately alerted", example: "Aussitôt alertés, les pompiers se sont rendus sur les lieux." }
    ],
    modelScriptSnippet: "\"Le chat d'une retraitée a réussi à mettre en fuite deux cambrioleurs hier soir à Québec. Alors que les malfaiteurs tentaient de forcer la serrure, le félin a bondi du haut d'une armoire en poussant un feulement terrifiant. Paniqués, les intrus ont pris la fuite sans rien emporter. La police a ouvert une enquête pour identifier les fuyards, tandis que le chat a reçu une double ration de friandises pour sa bravoure.\"",
    samplePrompt: "Début de l'article: Un touriste égaré dans la forêt boréale a été secouru grâce à un drone amateur...",
    gradingCriteria: [
      "Strict coherence with the introductory prompt",
      "Flawless mastery of Passé Composé vs Imparfait",
      "Concise narrative flow within the ~100 word ceiling"
    ]
  },
  {
    id: "tef-ee-section-b",
    section: "EE_SectionB",
    examType: "TEF_Canada",
    title: "Expression Écrite - Section B: Formal Argumentative Letter / Article",
    timeLimitMinutes: 45,
    wordCountTarget: "200 words minimum (aim for 220-250 words)",
    objective: "Write a formal letter to the editor or mayor taking a strong, clear stance on a controversial public issue.",
    structuralFormula: [
      "1. Formal Salutation: \"Monsieur le Rédacteur en chef / Madame la Mairesse,\"",
      "2. Context & Stance: State why you are writing and declare your explicit position.",
      "3. Argument 1 (Social/Economic Impact): Support with a concrete example.",
      "4. Argument 2 (Environmental/Educational Impact): Support with a secondary example.",
      "5. Rebuttal of Counter-argument: Acknowledge the opposing view and refute it.",
      "6. Conclusion & Call to Action: Call for thoughtful policy decisions.",
      "7. Formal Sign-off: \"Je vous prie d'agréer, Madame/Monsieur, l'expression de mes salutations distinguées.\""
    ],
    essentialConnectors: [
      { french: "En premier lieu / Tout d'abord", english: "First of all", example: "En premier lieu, une telle mesure favoriserait la santé publique." },
      { french: "Il est indéniable que...", english: "It is undeniable that...", example: "Il est indéniable que le coût initial sera amorti à long terme." },
      { french: "Force est de constater que...", english: "It must be recognized that...", example: "Force est de constater que les alternatives actuelles demeurent insuffisantes." },
      { french: "En dépit de...", english: "Despite...", example: "En dépit des craintes exprimées par certains commerçants..." }
    ],
    modelScriptSnippet: "\"Monsieur le Rédacteur en chef,\n\nJe me permets de vous adresser cette lettre afin de réagir à votre récent article concernant l'interdiction des véhicules thermiques dans notre centre-ville. Étant moi-même citoyen et usager quotidien des transports urbains, je tiens à exprimer mon soutien indéfectible à cette initiative.\n\nEn premier lieu, il est indéniable que la réduction drastique de la circulation diminuera la pollution atmosphérique, améliorant ainsi la qualité de vie de milliers d'habitants. Par ailleurs, force est de constater que les villes piétonnes attirent davantage de dynamisme commercial...\n\nJe vous prie d'agréer, Monsieur, l'expression de mes salutations distinguées.\n[Votre Nom]\"",
    samplePrompt: "Le journal local propose d'interdire complètement l'utilisation des téléphones portables dans tous les établissements scolaires et universités. Écrivez une lettre au rédacteur en chef pour exprimer votre point de vue argumenté.",
    gradingCriteria: [
      "Clear thesis statement with 2 to 3 well-developed arguments and real-world examples",
      "Sophisticated logical connectors and complex grammatical structures (Subjunctive, Relative clauses)",
      "Strict adherence to formal letter conventions and register"
    ]
  }
];

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'linguisticBridges.json'), JSON.stringify(bridges, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'diagnostic.json'), JSON.stringify(diagnostic, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'examTemplates.json'), JSON.stringify(examTemplates, null, 2), 'utf8');

console.log('Successfully generated all data JSON files!');
