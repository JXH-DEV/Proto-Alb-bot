// Ndërfaqja (DOM). Logjika e bisedës është te engine.js.

import { createState, reply, chipsFor, introHtml } from './engine.js';
import { GLOSSARY_TERMS } from './data.js';

const AUTO_RESTART_MS = 15000;   // sa pret pas mbarimit para se të rifillojë vetë
const FADE_MS = 500;
const MODAL_ANIM_MS = 300;

const $ = id => document.getElementById(id);
const messagesList = $('messages-list');
const typingIndicator = $('typing-indicator');
const chatForm = $('chat-form');
const userInput = $('user-input');
const sendBtn = $('send-btn');
const chatContainer = $('chat-container');
const quickReplies = $('quick-replies');
const restartBtn = $('restart-btn');

const glossaryBtn = $('glossary-btn');
const glossaryModal = $('glossary-modal');
const glossaryBackdrop = $('glossary-backdrop');
const glossaryPanel = $('glossary-panel');
const closeGlossaryBtn = $('close-glossary');
const glossaryContent = $('glossary-content');
const inertTargets = [$('app-header'), chatContainer, $('app-footer')];

const finePointer = window.matchMedia('(pointer: fine)').matches;

let state = createState();
let isTyping = false;
let session = 0;               // rritet te çdo rifillim; përgjigjet e vonuara të vjetra hidhen poshtë
let restartTimer = null;
let fadeTimer = null;

/** Mesazhet e botit janë HTML i besuar (nga data.js). Mesazhet e përdoruesit shfaqen vetëm si tekst. */
function appendMessage(sender, content) {
    const isBot = sender === 'bot';

    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full mb-6 animate-slide-up ${isBot ? 'justify-start' : 'justify-end'}`;

    const inner = document.createElement('div');
    inner.className = `flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`;

    const avatar = document.createElement('div');
    avatar.setAttribute('aria-hidden', 'true');
    avatar.className = `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${isBot ? 'bg-albania-charcoal border border-white/10 text-red-500' : 'bg-albania-red text-white'}`;
    avatar.innerHTML = isBot
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

    const bubble = document.createElement('div');
    bubble.className = `px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-md transition-all break-words min-w-0 ${
        isBot
            ? 'bg-albania-bubbleBot text-gray-100 rounded-bl-none border border-white/5'
            : 'bg-albania-red text-white rounded-br-none shadow-red-900/20'
    }`;

    const body = document.createElement('div');
    if (isBot) body.innerHTML = content;
    else body.textContent = content;

    bubble.appendChild(body);
    inner.append(avatar, bubble);
    wrapper.appendChild(inner);
    messagesList.appendChild(wrapper);
    reveal(wrapper);
}

// Përgjigje më e gjatë se ekrani shfaqet nga fillimi (jo nga fundi), që të lexohet normalisht.
function reveal(wrapper) {
    if (wrapper.offsetHeight > chatContainer.clientHeight - 24) {
        chatContainer.scrollTop = wrapper.offsetTop - 12;
    } else {
        scrollToBottom();
    }
}

function showTyping(show) {
    isTyping = show;
    typingIndicator.classList.toggle('hidden', !show);
    if (show) scrollToBottom();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderChips(chips) {
    quickReplies.replaceChildren();
    for (const chip of chips) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.textContent = chip.label;
        btn.addEventListener('click', () => {
            if (chip.action === 'restart') restartConversation();
            else submitText(chip.text);
        });
        quickReplies.appendChild(btn);
    }
    quickReplies.classList.toggle('hidden', chips.length === 0);
}

async function submitText(raw) {
    const text = raw.trim();
    if (!text || isTyping || state.step === 4) return;

    userInput.value = '';
    renderChips([]);
    appendMessage('user', text);
    markInteraction();

    const mySession = session;
    showTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    if (mySession !== session) return; // biseda u rifillua ndërkohë

    const result = reply(state, text);
    state = result.state;
    showTyping(false);

    // Footer-i përditësohet para mesazhit, që lartësia e bisedës të jetë përfundimtare kur matet.
    if (result.ended) {
        setInputEnabled(false, 'Biseda po përfundon...');
        renderChips([{ label: 'Rifillo bisedën', action: 'restart' }]);
    } else {
        renderChips(result.chips);
    }
    if (result.html) appendMessage('bot', result.html);

    if (result.ended) scheduleAutoRestart();
    else if (finePointer) userInput.focus();
}

function setInputEnabled(enabled, placeholder = 'Shkruaj përgjigjen tënde...') {
    userInput.disabled = !enabled;
    sendBtn.disabled = !enabled;
    userInput.placeholder = placeholder;
}

function startConversation() {
    state = createState();
    messagesList.replaceChildren();
    setInputEnabled(true);
    userInput.value = '';
    renderChips(chipsFor(state));
    appendMessage('bot', introHtml());
    if (finePointer) userInput.focus();
}

function restartConversation() {
    session++;
    clearTimeout(restartTimer);
    clearTimeout(fadeTimer);
    showTyping(false);
    messagesList.classList.add('is-fading');
    fadeTimer = setTimeout(() => {
        messagesList.classList.remove('is-fading');
        startConversation();
    }, FADE_MS);
}

// Rifillimi automatik pas mbarimit; ndërpritet sa herë përdoruesi prek ose lëviz bisedën.
function scheduleAutoRestart() {
    clearTimeout(restartTimer);
    restartTimer = setTimeout(restartConversation, AUTO_RESTART_MS);
}

function markInteraction() {
    if (state.step === 4) scheduleAutoRestart();
}
for (const ev of ['pointerdown', 'wheel', 'touchmove', 'scroll']) {
    chatContainer.addEventListener(ev, markInteraction, { passive: true });
}

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    submitText(userInput.value);
});
restartBtn.addEventListener('click', restartConversation);
// Prekja e butonit "Dërgo" nuk duhet ta heqë fokusin nga fusha (tastiera mbetet hapur).
sendBtn.addEventListener('pointerdown', e => {
    if (document.activeElement === userInput) e.preventDefault();
});

// Udhëzuesi (glosari)
let modalOpen = false;
let modalCloseTimer = null;
let modalOpener = null;
let modalHistoryEntry = false;

function renderGlossary() {
    glossaryContent.replaceChildren(...GLOSSARY_TERMS.map(item => {
        const card = document.createElement('div');
        card.className = 'p-3 bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30 transition-colors group';
        card.innerHTML = `
            <h4 class="text-red-400 font-bold mb-1 group-hover:text-red-300 transition-colors">${item.term}</h4>
            <p class="text-gray-300 text-sm leading-relaxed">${item.def}</p>`;
        return card;
    }));
}

function setBackgroundInert(inert) {
    for (const el of inertTargets) el.toggleAttribute('inert', inert);
}

function openGlossary() {
    if (modalOpen) return;
    modalOpen = true;
    modalOpener = document.activeElement;
    clearTimeout(modalCloseTimer);           // rihapja brenda 300 ms nuk duhet ta fshehë më pas
    glossaryModal.classList.remove('hidden');
    setBackgroundInert(true);
    // Butoni "Mbrapa" i Android-it mbyll udhëzuesin në vend që të dalë nga aplikacioni.
    history.pushState({ glossary: true }, '');
    modalHistoryEntry = true;
    requestAnimationFrame(() => {
        glossaryBackdrop.classList.remove('opacity-0');
        glossaryPanel.classList.remove('opacity-0', 'scale-95');
        glossaryPanel.classList.add('opacity-100', 'scale-100');
        closeGlossaryBtn.focus();
    });
}

function closeGlossary({ fromHistory = false } = {}) {
    if (!modalOpen) return;
    modalOpen = false;
    if (modalHistoryEntry) {
        modalHistoryEntry = false;
        if (!fromHistory) history.back();
    }
    glossaryBackdrop.classList.add('opacity-0');
    glossaryPanel.classList.add('opacity-0', 'scale-95');
    glossaryPanel.classList.remove('opacity-100', 'scale-100');
    setBackgroundInert(false);
    modalCloseTimer = setTimeout(() => glossaryModal.classList.add('hidden'), MODAL_ANIM_MS);
    if (modalOpener && typeof modalOpener.focus === 'function') modalOpener.focus();
    modalOpener = null;
}

glossaryBtn.addEventListener('click', openGlossary);
closeGlossaryBtn.addEventListener('click', () => closeGlossary());
glossaryBackdrop.addEventListener('click', () => closeGlossary());
window.addEventListener('popstate', () => closeGlossary({ fromHistory: true }));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOpen) closeGlossary();
});

renderGlossary();
setTimeout(startConversation, 500);
