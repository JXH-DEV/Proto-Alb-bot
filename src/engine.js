// Logjika e bisedës, pa DOM: reply(state, text) -> { state, html, chips, ended }.
// E ndarë nga ndërfaqja që të testohet me `npm test`.

import { INITIAL_MESSAGE_TEXT, MOTIVATIONAL_QUOTES, SYNTAX_DATA } from './data.js';

/** Shkronja të vogla, pa diakritikë, apostrofat e drejta, pa pikësim. */
export function normalize(text) {
    return String(text ?? '')
        .toLowerCase()
        .replace(/[’‘`´ʼ]/g, "'")
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9'\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function tokenize(text) {
    const norm = normalize(text);
    return norm ? norm.split(' ') : [];
}

const hasPhrase = (norm, phrase) => ` ${norm} `.includes(` ${phrase} `);
const startsWithAny = (tokens, stems) => tokens.some(t => stems.some(s => t.startsWith(s)));

const YES_TOKENS = new Set([
    'po', 'sigurisht', 'sigurt', 'patjeter', 'natyrisht', 'dakord', 'ok', 'okay',
    'mire', 'dua', 'deshiroj', 'vazhdo', 'vazhdojme'
]);
const NO_TOKENS = new Set(['jo', 'nuk', 'mos', "s'dua", 'sdua', "s'kam", 'skam']);
const YES_PHRASES = ['pse jo', 'ne rregull', 'pa dyshim'];
const STOP_TOKENS = new Set(['mjaft', 'stop', 'faleminderit', 'mbaro', 'ndalo']);
const REFUSAL_PHRASES = ['nuk dua', "s'dua", 'sdua', 'nuk kam deshire', 'nuk kam gje', 'nuk kam asgje'];

/** 'yes' | 'no' | 'unclear'. Mohimi ka përparësi ndaj pohimit ("po jo" → 'no'). */
export function classifyYesNo(text) {
    const norm = normalize(text);
    if (!norm) return 'unclear';
    if (YES_PHRASES.some(p => hasPhrase(norm, p))) return 'yes';
    const tokens = norm.split(' ');
    if (tokens.some(t => NO_TOKENS.has(t))) return 'no';
    if (tokens.some(t => YES_TOKENS.has(t))) return 'yes';
    return 'unclear';
}

/** Refuzim i qartë për të ndarë një gjë të bukur ("jo", "nuk dua të tregoj"...). */
export function isRefusal(text) {
    const norm = normalize(text);
    if (!norm) return false;
    const first = norm.split(' ')[0];
    return first === 'jo' || first === 'mos' || REFUSAL_PHRASES.some(p => hasPhrase(norm, p));
}

const TOPIC_KEYS = Object.keys(SYNTAX_DATA);
const TOPIC_STEMS = Object.fromEntries(
    TOPIC_KEYS.map(key => [key, SYNTAX_DATA[key].keywords.map(normalize)])
);

// Krahasimi me fillim fjale që "kryefjalën", "kallëzuesin" etj. të njihen.
function findTopic(tokens) {
    return TOPIC_KEYS.find(key => startsWithAny(tokens, TOPIC_STEMS[key])) ?? null;
}

const topicNames = () => TOPIC_KEYS.map(k => SYNTAX_DATA[k].label);

export function createState() {
    return { step: 0, activeTopic: null, subContext: null };
}

export function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Mirëmëngjes';
    if (hour >= 12 && hour < 18) return 'Mirëdita';
    return 'Mirëmbrëma';
}

export function introHtml(date = new Date()) {
    return `<strong class="text-red-400 text-lg">${getGreeting(date.getHours())}!</strong><br>${INITIAL_MESSAGE_TEXT}`;
}

const CLARIFY_YES_NO =
    'Nuk të kuptova qartë. Të lutem përgjigju me <strong>po</strong> ose <strong>jo</strong>.';
const MORE_QUESTIONS = '<br><br>Dëshiron të pyesësh për ndonjë gjymtyrë tjetër?';

// "Kryefjalën, Kallëzuesin, ... ose Rrethanorin" (rasa kallëzore, si në tekstin origjinal)
const topicListHtml = () => {
    const spans = TOPIC_KEYS.map(k => `<span class="text-red-400">${SYNTAX_DATA[k].accusative}</span>`);
    return `${spans.slice(0, -1).join(', ')} ose ${spans[spans.length - 1]}`;
};

function closing(intro, random) {
    const quote = MOTIVATIONAL_QUOTES[Math.floor(random() * MOTIVATIONAL_QUOTES.length)];
    return `${intro}<br><br><em class="block mb-2">"${quote}"</em><br><strong>Unë jam këtu në çdo moment për të të ndihmuar.</strong>`;
}

const SILENCE = 'E kuptoj heshtjen tënde. Ndonjëherë fjalët nuk janë të nevojshme.';

const YES_NO_CHIPS = [
    { label: 'Po', text: 'Po' },
    { label: 'Jo', text: 'Jo' }
];

/** Butonat e shpejtë që i përshtaten gjendjes (shkrimi i lirë vazhdon të funksionojë). */
export function chipsFor(state) {
    switch (state.step) {
        case 0:
        case 1:
        case 5:
            return YES_NO_CHIPS;
        case 3: {
            if (!state.activeTopic) {
                return [
                    ...TOPIC_KEYS.map(k => ({ label: SYNTAX_DATA[k].label, text: SYNTAX_DATA[k].label })),
                    { label: 'Mjaft', text: 'Mjaft' }
                ];
            }
            if (state.subContext) return YES_NO_CHIPS;
            const d = SYNTAX_DATA[state.activeTopic];
            if (d.llojet && d.shprehet) {
                return [
                    { label: 'Llojet', text: 'Llojet' },
                    { label: 'Me çfarë shprehet', text: 'Me çfarë shprehet' },
                    { label: 'Gjymtyrë tjetër', text: 'Gjymtyrë tjetër' }
                ];
            }
            return YES_NO_CHIPS;
        }
        default:
            return [];
    }
}

/**
 * Një hap i bisedës. Nuk e ndryshon `prev`; kthen gjendjen e re.
 * `random` jepet nga jashtë që testet të jenë përcaktuese.
 */
export function reply(prev, userText, { random = Math.random } = {}) {
    const state = { ...prev };
    const tokens = tokenize(userText);
    const yn = classifyYesNo(userText);
    let html = '';

    switch (state.step) {
        case 0:
            if (yn === 'yes') {
                state.step = 1;
                html = 'Më vjen mirë. A dëshiron të vazhdojmë me pyetjet?';
            } else if (yn === 'no') {
                state.step = 5;
                html = 'E kuptoj. Dëshiron të ndash me mua një gjë të bukur që të ka ndodhur sot?';
            } else {
                html = CLARIFY_YES_NO;
            }
            break;

        case 1:
            if (yn === 'yes') {
                state.step = 3;
                html = 'Shkëlqyeshëm! Mund të më pyesësh rreth <strong>sintaksës së gjuhës shqipe</strong>.';
            } else if (yn === 'no') {
                state.step = 2;
                html = 'Mirë. Atëherë më thuaj një gjë të bukur që të ka ndodhur sot?';
            } else {
                html = CLARIFY_YES_NO;
            }
            break;

        case 5:
            if (yn === 'yes') {
                state.step = 6;
                html = 'Po të dëgjoj. Të lutem më trego. 👂';
            } else if (yn === 'no') {
                state.step = 4;
                html = closing(SILENCE, random);
            } else {
                html = CLARIFY_YES_NO;
            }
            break;

        case 6:
            state.step = 4;
            html = closing('Sa gjë e bukur! Më vjen mirë që e ndave këtë moment me mua. Është vërtet frymëzuese. 🤍', random);
            break;

        case 2:
            state.step = 4;
            html = isRefusal(userText)
                ? closing(`${SILENCE} 🤍`, random)
                : closing('Sa gjë e bukur! Faleminderit që e ndave këtë moment me mua. 🤍', random);
            break;

        case 3:
            html = grammarReply(state, userText, tokens, yn);
            break;

        default:
            // step 4: biseda mbaroi dhe pret rifillimin
            break;
    }

    return { state, html, chips: chipsFor(state), ended: state.step === 4 };
}

function grammarReply(state, userText, tokens, yn) {
    // Mbyllja e bisedës për gjuhën.
    const wantsStop = tokens.some(t => STOP_TOKENS.has(t));
    if (wantsStop || (!state.activeTopic && isRefusal(userText))) {
        state.step = 2;
        state.activeTopic = null;
        state.subContext = null;
        return 'Kënaqësi të bisedonim për gjuhën! Atëherë më thuaj një gjë të bukur që të ka ndodhur sot?';
    }

    // Çdo gjymtyrë e përmendur hap temën e saj.
    const newTopic = findTopic(tokens);
    if (newTopic) {
        const data = SYNTAX_DATA[newTopic];
        state.activeTopic = newTopic;
        state.subContext = null;
        return `${data.def}<br><br><span class="text-red-300 italic">${data.question}</span>`;
    }

    if (!state.activeTopic) {
        return `Nuk të kuptova qartë. Mund të pyesësh për: ${topicListHtml()}.`;
    }

    const data = SYNTAX_DATA[state.activeTopic];

    if (yn === 'no' || tokens.includes('tjeter')) {
        state.activeTopic = null;
        state.subContext = null;
        return `Në rregull. Mund të vazhdojmë me elemente të tjera të sintaksës (${topicNames().join(', ')}). Për cilën dëshiron të dish më shumë?`;
    }

    if (startsWithAny(tokens, ['lloj', 'klasifik'])) {
        let html = data.llojet ?? 'Për këtë gjymtyrë nuk kemi klasifikim llojesh.';
        if (data.shprehet && state.subContext !== 'shprehet') {
            html += "<br><br><span class='text-red-300 italic'>A dëshiron të dish gjithashtu se me çfarë shprehet?</span>";
            state.subContext = 'llojet';
        } else {
            state.activeTopic = null;
            state.subContext = null;
            html += MORE_QUESTIONS;
        }
        return html;
    }

    if (startsWithAny(tokens, ['shpreh', 'formo', 'formim', 'behet'])) {
        let html = data.shprehet ?? 'Më fal, nuk kam informacion specifik për shprehjen e saj.';
        if (data.llojet && state.subContext !== 'llojet') {
            html += "<br><br><span class='text-red-300 italic'>A dëshiron të dish gjithashtu llojet?</span>";
            state.subContext = 'shprehet';
        } else {
            state.activeTopic = null;
            state.subContext = null;
            html += MORE_QUESTIONS;
        }
        return html;
    }

    if (yn === 'yes') {
        let html;
        if (state.subContext === 'llojet' && data.shprehet) {
            html = data.shprehet;
        } else if (state.subContext === 'shprehet' && data.llojet) {
            html = data.llojet;
        } else if (data.llojet && data.shprehet) {
            html = `${data.llojet}<br><br>${data.shprehet}`;
        } else {
            html = data.llojet ?? data.shprehet;
        }
        state.activeTopic = null;
        state.subContext = null;
        return html + MORE_QUESTIONS;
    }

    return 'Më fal, nuk të kuptova qartë. A dëshiron të dish <strong>llojet</strong>, <strong>me çfarë shprehet</strong>, apo të flasim për një gjymtyrë tjetër?';
}
