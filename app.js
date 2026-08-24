(() => {
  'use strict';

  const content = window.ADRIATIC14_CONTENT;
  if (!content) {
    document.body.innerHTML = '<p style="padding:2rem">Adriatic 14 content could not be loaded.</p>';
    return;
  }

  const STORAGE_KEY = 'adriatic14-state-v1';
  const { phrases, lessons, trip, quickCategories, countryGuide } = content;
  const phraseMap = new Map(phrases.map(item => [item.id, item]));
  const lessonMap = new Map(lessons.map(item => [Number(item.id), item]));
  const tripShortcuts = [
    { key: 'perast', city: 'Perast', flag: '🇲🇪', country: 'montenegro', lessonIds: [8] },
    { key: 'zabljak', city: 'Žabljak', flag: '🇲🇪', country: 'montenegro', lessonIds: [9] },
    { key: 'korcula', city: 'Korčula', flag: '🇭🇷', country: 'croatia', lessonIds: [10, 11] },
    { key: 'dubrovnik', city: 'Dubrovnik', flag: '🇭🇷', country: 'croatia', lessonIds: [12, 13, 14] }
  ];

  const defaultState = {
    country: 'croatia',
    completedLessons: [],
    favorites: [],
    phraseRatings: {},
    reviewStats: {},
    quizScores: {},
    scenarioScores: {},
    stats: {
      spokenAttempts: 0,
      listeningCorrect: 0,
      listeningTotal: 0,
      rescueUses: 0
    },
    settings: {
      name: 'Dave',
      startDate: '2026-08-24',
      speechRate: 0.9,
      showPronunciation: true,
      haptics: true
    }
  };

  let state = loadState();
  let deferredInstallPrompt = null;
  let toastTimer = null;
  let activeRecognition = null;
  let speechVoices = [];
  let speechVoicesReady = false;
  let voiceLoadPromise = null;
  let lastVoiceNotice = '';
  const micState = { status: 'checking', permission: 'unknown', message: 'Checking microphone access…' };
  let micProbePromise = null;

  const ui = {
    phrasebookQuery: '',
    phrasebookFilter: 'All',
    lessonTabs: {},
    quiz: {},
    scenario: {},
    flashIndex: 0,
    flashFlipped: false,
    flashQueue: [],
    listening: null,
    speakingPhraseId: null,
    quickCategoryIndex: 0,
    quickPhraseIndex: 0,
    tripLocation: null,
    installDismissed: false
  };

  const view = document.getElementById('view');
  const countryToggle = document.getElementById('country-toggle');
  const countryFlag = document.getElementById('country-flag');
  const countryName = document.getElementById('country-name');
  const quickSheet = document.getElementById('quick-say');
  const quickContent = document.getElementById('quick-say-content');
  const settingsSheet = document.getElementById('settings-sheet');
  const settingsForm = document.getElementById('settings-form');
  const toast = document.getElementById('toast');

  const icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h4l5 4V6l-5 4Z"/><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M4 5.5v16"/><path d="M8 7h8M8 11h8"/></svg>',
    route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h7l-1 8 8-12h-7Z"/></svg>',
    headphones: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1ZM20 14h-3v6h2a1 1 0 0 0 1-1Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>'
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return structuredClone(defaultState);
      return {
        ...structuredClone(defaultState),
        ...saved,
        settings: { ...defaultState.settings, ...(saved.settings || {}) },
        stats: { ...defaultState.stats, ...(saved.stats || {}) }
      };
    } catch (error) {
      console.warn('Could not load saved progress', error);
      return structuredClone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Progress could not be persisted in this browsing mode.', error);
    }
    updateCountryButton();
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function interpolate(value) {
    return String(value ?? '').replaceAll('{name}', state.settings.name || 'Dave');
  }

  function display(value) {
    return escapeHtml(interpolate(value));
  }

  // Croatian and Montenegrin spelling is highly phonemic. Generate a consistent
  // English-friendly sound guide from the same local text sent to TTS instead of
  // maintaining a separate hand-written pronunciation string that can drift.
  function pronunciationGuide(value) {
    let text = interpolate(value).toLocaleLowerCase('hr');
    const digraphs = [
      ['dž', 'j'], ['lj', 'ly'], ['nj', 'ny']
    ];
    for (const [from, to] of digraphs) text = text.replaceAll(from, to);
    const map = {
      'a':'ah', 'b':'b', 'c':'ts', 'č':'ch', 'ć':'ch', 'd':'d', 'đ':'dy',
      'e':'eh', 'f':'f', 'g':'g', 'h':'h', 'i':'ee', 'j':'y', 'k':'k',
      'l':'l', 'm':'m', 'n':'n', 'o':'oh', 'p':'p', 'r':'r', 's':'s',
      'š':'sh', 't':'t', 'u':'oo', 'v':'v', 'z':'z', 'ž':'zh'
    };
    let out = '';
    for (const ch of text) out += map[ch] ?? ch;
    return out
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.!?;:])/g, '$1')
      .trim();
  }

  function pronunciationMarkup(phrase) {
    if (!state.settings.showPronunciation || !phrase?.local) return '';
    return `<div class="phrase-pronunciation" title="Sound guide derived from the same local spelling used for audio; stress and rhythm follow the selected voice.">${escapeHtml(pronunciationGuide(phrase.local))}</div>`;
  }

  function currentCountry() {
    return countryGuide[state.country];
  }

  function phraseCountryLabel(country) {
    if (country === 'croatia') return { text: '🇭🇷 Croatia', cls: 'croatia' };
    if (country === 'montenegro') return { text: '🇲🇪 Montenegro', cls: 'montenegro' };
    return { text: 'Shared', cls: 'shared' };
  }

  function countryLabel(country) {
    if (country === 'croatia') return '🇭🇷 Croatia';
    if (country === 'montenegro') return '🇲🇪 Montenegro';
    return '🇭🇷 + 🇲🇪 Shared';
  }

  function relevantPhrases(options = {}) {
    const includeAll = options.all === true;
    return phrases.filter(phrase => includeAll || phrase.country === 'shared' || phrase.country === state.country);
  }

  function resolveSpeechLocale(country) {
    if (country === 'croatia') return 'hr-HR';
    if (country === 'montenegro') return 'sr-RS';
    return currentCountry().speechLocale;
  }

  function haptic(pattern = 10) {
    const hasUserGesture = !navigator.userActivation || navigator.userActivation.isActive;
    if (state.settings.haptics && navigator.vibrate && hasUserGesture) navigator.vibrate(pattern);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function routeTo(route) {
    const normalized = String(route).replace(/^#?\/?/, '');
    location.hash = `#/${normalized || 'home'}`;
  }

  function getRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  }

  function setNavActive(route) {
    const root = route.split('/')[0];
    document.querySelectorAll('.nav-item').forEach(button => {
      button.classList.toggle('active', button.dataset.route === root || (root === 'lesson' && button.dataset.route === 'course'));
    });
  }

  function updateCountryButton() {
    const guide = currentCountry();
    countryFlag.textContent = guide.flag;
    countryName.textContent = guide.name;
    countryToggle.title = `Current mode: ${guide.name}. Tap to switch.`;
  }

  function getCompletionPercent() {
    return Math.round((state.completedLessons.length / lessons.length) * 100);
  }

  function getNextLesson() {
    return lessons.find(lesson => !state.completedLessons.includes(lesson.id)) || lessons[lessons.length - 1];
  }

  function getCourseDay() {
    const start = new Date(`${state.settings.startDate}T12:00:00`);
    const now = new Date();
    if (Number.isNaN(start.getTime())) return 1;
    const diff = Math.floor((now - start) / 86400000) + 1;
    return Math.min(14, Math.max(1, diff));
  }

  function lessonDate(id) {
    const start = new Date(`${state.settings.startDate}T12:00:00`);
    if (Number.isNaN(start.getTime())) return '';
    start.setDate(start.getDate() + Number(id) - 1);
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(start);
  }

  function render() {
    const route = getRoute();
    setNavActive(route);
    updateCountryButton();
    window.speechSynthesis?.cancel();

    const [root, param] = route.split('/');
    if (root === 'lesson') {
      const routedLesson = lessonMap.get(Number(param));
      if (routedLesson && routedLesson.country !== 'shared' && state.country !== routedLesson.country) {
        state.country = routedLesson.country;
        saveState();
      }
    }
    switch (root) {
      case 'course': view.innerHTML = renderCourse(); break;
      case 'lesson': view.innerHTML = renderLesson(Number(param) || 1); break;
      case 'practice': view.innerHTML = renderPractice(param); break;
      case 'phrasebook': view.innerHTML = renderPhrasebook(); break;
      case 'trip': view.innerHTML = renderTrip(); break;
      default: view.innerHTML = renderHome(); break;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    hydrateCurrentView(root, param);
  }

  function renderInstallBanner() {
    if (!deferredInstallPrompt || ui.installDismissed) return '';
    return `
      <div class="install-banner">
        <p><strong>Install Adriatic 14</strong><br><span class="muted">Keep lessons and phrase cards on your home screen.</span></p>
        <div class="page-header-actions">
          <button class="text-button" data-dismiss-install>Not now</button>
          <button class="secondary-button" data-install-app>${icons.download} Install</button>
        </div>
      </div>`;
  }

  function renderHome() {
    const next = getNextLesson();
    const mastered = Object.values(state.phraseRatings).filter(value => Number(value) >= 2).length;
    const scenarios = Object.keys(state.scenarioScores).filter(id => state.scenarioScores[id]?.complete).length;
    const day = getCourseDay();
    const percent = getCompletionPercent();

    return `
      ${renderInstallBanner()}
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Day ${day} of 14 · ${currentCountry().flag} ${currentCountry().name} mode</p>
          <h1>Speak your way through the Adriatic.</h1>
          <p>Short, practical conversations for your Dubrovnik–Montenegro–Korčula route. Learn the phrase, hear the reply and practice recovering when it changes.</p>
          <div class="hero-actions">
            <button class="primary-button" data-lesson="${next.id}">${state.completedLessons.length ? 'Continue' : 'Start Day 1'} · ${escapeHtml(next.title)}</button>
            <button class="secondary-button" data-open-quick>Say it now</button>
          </div>
        </div>
        <div class="hero-progress">
          <div class="progress-ring" style="--progress:${percent}%">
            <strong>${percent}%</strong>
            <span>course complete</span>
          </div>
        </div>
      </section>

      <section class="section trip-shortcut-strip">
        <div class="section-heading"><div><p class="eyebrow">Traveling now?</p><h2>Trip mode</h2><p class="muted">Jump straight to the phrases and scenarios for your current stop.</p></div></div>
        <div class="trip-shortcut-buttons">${tripShortcuts.map(stop => `<button class="chip-button trip-shortcut" data-trip-shortcut="${stop.key}">${stop.flag} ${escapeHtml(stop.city)}</button>`).join('')}</div>
      </section>

      <section class="section">
        <div class="stat-grid">
          <div class="stat-card"><strong>${state.completedLessons.length}/14</strong><span>Missions complete</span></div>
          <div class="stat-card"><strong>${mastered}</strong><span>Phrases comfortable</span></div>
          <div class="stat-card"><strong>${scenarios}</strong><span>Scenarios cleared</span></div>
          <div class="stat-card"><strong>${state.stats.rescueUses}</strong><span>Successful recoveries</span></div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading"><div><p class="eyebrow">Five-minute options</p><h2>Practice without starting a lesson</h2></div></div>
        <div class="card-grid">
          ${actionCard('bolt', 'Say it now', 'Open a large offline phrase card for the situation in front of you.', 'open-quick')}
          ${actionCard('wave', 'Today’s review', 'Revisit phrases you struggled with before newer material.', 'route', 'practice/flashcards')}
          ${actionCard('route', 'Trip simulator', 'Practice the full route as a sequence of decisions.', 'route', 'practice/scenario')}
        </div>
      </section>

      <section class="section">
        <div class="section-heading"><div><p class="eyebrow">Your route</p><h2>One course, two local modes</h2></div><button class="text-button" data-route="trip">View trip plan →</button></div>
        <div class="route-strip">
          ${trip.slice(1).map(stop => `
            <div class="route-stop">
              <span class="flag">${stop.flag}</span>
              <strong>${escapeHtml(stop.city)}</strong>
              <span>${escapeHtml(stop.nights)} · ${escapeHtml(stop.focus.split(',')[0])}</span>
            </div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-heading"><div><p class="eyebrow">Next mission</p><h2>Day ${next.id}: ${escapeHtml(next.title)}</h2></div><span class="tag">${next.minutes} min</span></div>
        <div class="lesson-card" data-lesson="${next.id}" role="button" tabindex="0">
          <div class="lesson-number">${next.id}</div>
          <div><h3>${escapeHtml(next.mission)}</h3><div class="lesson-meta"><span>${countryLabel(next.country)}</span><span>${escapeHtml(next.location)}</span></div></div>
          <div class="lesson-status">Begin →</div>
        </div>
      </section>`;
  }

  function actionCard(icon, title, text, action, value = '') {
    const attrs = action === 'route' ? `data-route="${value}"` : `data-${action}`;
    return `
      <button class="action-card" ${attrs}>
        <span class="action-card-icon">${icons[icon]}</span>
        <span class="arrow">→</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
      </button>`;
  }

  function renderCourse() {
    const completed = state.completedLessons.length;
    return `
      <header class="page-header">
        <div><p class="eyebrow">14-day route curriculum</p><h1>Your course</h1><p>${completed} of 14 missions complete. Lessons are always open, so you can jump ahead to a location before you arrive.</p></div>
        <div class="page-header-actions"><button class="secondary-button" data-route="practice">Practice</button><button class="primary-button" data-lesson="${getNextLesson().id}">Continue</button></div>
      </header>
      <div class="inline-alert"><strong>Course dates:</strong> ${lessonDate(1)}–${lessonDate(14)}. Change the start date in Settings at any time.</div>
      <div class="lesson-list">
        ${lessons.map(lesson => {
          const done = state.completedLessons.includes(lesson.id);
          const score = state.quizScores[lesson.id];
          return `
            <article class="lesson-card ${done ? 'completed' : ''}" data-lesson="${lesson.id}" role="button" tabindex="0">
              <div class="lesson-number">${done ? '✓' : lesson.id}</div>
              <div>
                <div class="lesson-meta"><span class="country-badge ${lesson.country}">${countryLabel(lesson.country)}</span><span>${lessonDate(lesson.id)}</span><span>${lesson.minutes} min</span></div>
                <h3>${escapeHtml(lesson.title)}</h3>
                <div class="lesson-meta"><span>${escapeHtml(lesson.location)}</span><span>${escapeHtml(lesson.objective)}</span></div>
              </div>
              <div class="lesson-status">${done ? `Complete${score ? ` · ${score}/3` : ''}` : lesson.id === getNextLesson().id ? 'Next →' : 'Open →'}</div>
            </article>`;
        }).join('')}
      </div>`;
  }

  function renderLesson(id) {
    const lesson = lessonMap.get(id) || lessons[0];
    const activeTab = ui.lessonTabs[id] || 'phrases';
    const phraseList = lesson.phraseIds.map(phraseId => phraseMap.get(phraseId)).filter(Boolean);
    const done = state.completedLessons.includes(lesson.id);
    const lessonProgress = calculateLessonProgress(lesson);

    return `
      <button class="text-button" data-route="course">← All lessons</button>
      <section class="lesson-hero">
        <div class="lesson-hero-content">
          <p class="eyebrow">Day ${lesson.id} · ${countryLabel(lesson.country)} · ${lesson.minutes} minutes</p>
          <h1>${escapeHtml(lesson.title)}</h1>
          <p>${escapeHtml(lesson.mission)}</p>
          <div class="lesson-progress-row"><div class="progress-track"><div class="progress-fill" style="width:${lessonProgress}%"></div></div><span>${lessonProgress}% ready</span></div>
        </div>
      </section>

      <nav class="lesson-tabs" aria-label="Lesson sections">
        ${[['phrases','Phrases'],['dialogue','Dialogue'],['challenge','Challenge'],['roleplay','Role-play']].map(([key,label]) => `<button class="lesson-tab ${activeTab === key ? 'active' : ''}" data-lesson-tab="${key}" data-lesson-id="${lesson.id}">${label}</button>`).join('')}
      </nav>

      <section class="lesson-panel ${activeTab === 'phrases' ? 'active' : ''}" data-panel="phrases">
        <div class="section-heading"><div><p class="eyebrow">Learn the chunks</p><h2>${phraseList.length} phrases for this mission</h2></div><button class="secondary-button" data-speak-lesson="${lesson.id}">Listen to all</button></div>
        <div class="inline-alert"><strong>Sound focus:</strong> ${escapeHtml(lesson.soundTip)}</div>
        <div class="phrase-stack">${phraseList.map(renderPhraseCard).join('')}</div>
      </section>

      <section class="lesson-panel ${activeTab === 'dialogue' ? 'active' : ''}" data-panel="dialogue">
        ${renderDialogue(lesson)}
      </section>

      <section class="lesson-panel ${activeTab === 'challenge' ? 'active' : ''}" data-panel="challenge">
        ${renderLessonChallenge(lesson)}
      </section>

      <section class="lesson-panel ${activeTab === 'roleplay' ? 'active' : ''}" data-panel="roleplay">
        ${renderLessonScenario(lesson)}
      </section>

      <section class="section">
        <div class="info-card">
          <div class="section-heading"><div><p class="eyebrow">Mission outcome</p><h2>${escapeHtml(lesson.objective)}</h2></div><span class="country-badge ${lesson.country}">${escapeHtml(lesson.location)}</span></div>
          <button class="${done ? 'secondary-button' : 'primary-button'}" data-complete-lesson="${lesson.id}">${done ? '✓ Mission complete' : 'Mark mission complete'}</button>
        </div>
      </section>`;
  }

  function calculateLessonProgress(lesson) {
    let score = 20;
    if (state.quizScores[lesson.id]) score += Math.round((state.quizScores[lesson.id] / 3) * 35);
    if (state.scenarioScores[lesson.id]?.complete) score += 30;
    if (state.completedLessons.includes(lesson.id)) score = 100;
    return Math.min(100, score);
  }

  function renderPhraseCard(phrase) {
    const badge = phraseCountryLabel(phrase.country);
    const favorite = state.favorites.includes(phrase.id);
    const pronunciation = pronunciationMarkup(phrase);
    return `
      <article class="phrase-card">
        <div class="phrase-card-main">
          <span class="country-badge ${badge.cls}">${badge.text}</span>
          <div class="phrase-local">${display(phrase.local)}</div>
          ${pronunciation}
          <div class="phrase-english">${display(phrase.english)}</div>
          ${phrase.note ? `<p class="phrase-note">${escapeHtml(phrase.note)}</p>` : ''}
        </div>
        <div class="phrase-actions">
          <button class="speak-button" data-speak-phrase="${phrase.id}" aria-label="Play ${escapeHtml(interpolate(phrase.local))}">${icons.speaker}</button>
          <button class="favorite-button ${favorite ? 'active' : ''}" data-favorite="${phrase.id}" aria-label="${favorite ? 'Remove from' : 'Add to'} favorites">${favorite ? '★' : '☆'}</button>
        </div>
      </article>`;
  }

  function renderDialogue(lesson) {
    return `
      <div class="dialogue-card">
        <div class="dialogue-header"><div><p class="eyebrow">Listen, then shadow</p><h2>Model conversation</h2></div><button class="secondary-button" data-speak-dialogue="${lesson.id}">${icons.speaker} Play dialogue</button></div>
        <div class="dialogue-list">
          ${lesson.dialogue.map((turn, index) => `
            <div class="dialogue-turn ${turn.speaker === 'you' ? 'you' : ''}">
              <div class="avatar">${turn.speaker === 'you' ? 'D' : 'L'}</div>
              <div class="bubble">
                <strong>${display(turn.local)}</strong>
                <span>${display(turn.english)}</span>
              </div>
              <button class="speak-button" data-speak-raw="${encodeURIComponent(interpolate(turn.local))}" data-speech-country="${lesson.country}" aria-label="Play line ${index + 1}">${icons.speaker}</button>
            </div>`).join('')}
        </div>
      </div>
      <div class="section info-card">
        <p class="eyebrow">Shadowing method</p>
        <h3>Listen once, then speak over the second playback.</h3>
        <p class="muted">Aim for rhythm and understandable consonants. The goal is not to erase your accent.</p>
      </div>`;
  }

  function getQuizState(lesson) {
    if (!ui.quiz[lesson.id]) ui.quiz[lesson.id] = { index: 0, correct: 0, answered: false, selected: null, finished: false };
    return ui.quiz[lesson.id];
  }

  function renderLessonChallenge(lesson) {
    const quizState = getQuizState(lesson);
    const phraseChoices = lesson.phraseIds.map(id => phraseMap.get(id)).filter(Boolean);
    const speakingId = ui.speakingPhraseId && phraseChoices.some(item => item.id === ui.speakingPhraseId)
      ? ui.speakingPhraseId : phraseChoices[0]?.id;
    ui.speakingPhraseId = speakingId;
    const target = phraseMap.get(speakingId);

    return `
      <div id="quiz-mount">${renderQuizCard(lesson, quizState)}</div>
      <section class="section speak-lab">
        <p class="eyebrow">Speak it</p>
        <h2>Say the target phrase</h2>
        <p class="speak-target">${target ? display(target.local) : ''}</p>
        <p class="muted">${target ? display(target.english) : ''}</p>
        <div class="page-header-actions" style="justify-content:center">
          ${target ? `<button class="secondary-button" data-speak-phrase="${target.id}">${icons.speaker} Hear it</button>` : ''}
          <button class="ghost-button" data-next-speaking="${lesson.id}">Another phrase</button>
        </div>
        ${micStatusMarkup()}
        <button class="mic-button" data-record-phrase="${target?.id || ''}" aria-label="Start speaking practice">${icons.mic}</button>
        <p class="microcopy" id="speech-status">Tap the microphone and speak after the prompt.</p>
        <div class="speech-result" id="speech-result">Your transcript and an understandable-speech score will appear here.</div>
      </section>`;
  }

  function renderQuizCard(lesson, quizState) {
    if (quizState.finished) {
      return `
        <div class="quiz-card">
          <p class="eyebrow">Listening check complete</p>
          <h2>${quizState.correct}/3 correct</h2>
          <p class="muted">${quizState.correct === 3 ? 'You caught every key distinction.' : 'Review the missed phrases once, then continue to role-play.'}</p>
          <button class="secondary-button" data-restart-quiz="${lesson.id}">Try again</button>
        </div>`;
    }

    const question = lesson.quiz[quizState.index];
    return `
      <div class="quiz-card">
        <div class="section-heading"><div><p class="eyebrow">Meaning check · ${quizState.index + 1} of ${lesson.quiz.length}</p><h2>${escapeHtml(question.prompt)}</h2></div><span class="score-badge">${quizState.correct} correct</span></div>
        <div class="quiz-options">
          ${question.options.map((option, index) => {
            let cls = '';
            if (quizState.answered && index === question.answer) cls = 'correct';
            if (quizState.answered && index === quizState.selected && index !== question.answer) cls = 'incorrect';
            return `<button class="quiz-option ${cls}" data-quiz-answer="${index}" data-lesson-id="${lesson.id}" ${quizState.answered ? 'disabled' : ''}><span class="letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`;
          }).join('')}
        </div>
        <p class="quiz-feedback ${quizState.answered ? (quizState.selected === question.answer ? 'good' : 'bad') : ''}">${quizState.answered ? escapeHtml(question.explanation) : '&nbsp;'}</p>
        ${quizState.answered ? `<button class="primary-button" data-next-quiz="${lesson.id}">${quizState.index === lesson.quiz.length - 1 ? 'Finish check' : 'Next question'}</button>` : ''}
      </div>`;
  }

  function getScenarioState(lesson) {
    if (!ui.scenario[lesson.id]) ui.scenario[lesson.id] = { step: 0, score: 0, feedback: '', selected: null, complete: false };
    return ui.scenario[lesson.id];
  }

  function renderLessonScenario(lesson) {
    const scenarioState = getScenarioState(lesson);
    return renderScenarioCard(lesson, scenarioState, false);
  }

  function renderScenarioCard(lesson, scenarioState, topLevel) {
    const scenario = lesson.scenario;
    if (scenarioState.complete) {
      return `
        <div class="scenario-card">
          <p class="eyebrow">Scenario complete</p>
          <h2>${escapeHtml(scenario.title)}</h2>
          <p class="muted">You completed ${scenario.steps.length} conversational decisions with a score of ${scenarioState.score}/${scenario.steps.length * 2}.</p>
          <button class="secondary-button" data-restart-scenario="${lesson.id}" ${topLevel ? 'data-top-level="true"' : ''}>Run it again</button>
          ${topLevel ? `<button class="text-button" data-route="practice">Back to practice</button>` : ''}
        </div>`;
    }

    const step = scenario.steps[scenarioState.step];
    return `
      <div class="scenario-card">
        <div class="section-heading"><div><p class="eyebrow">Role-play · Step ${scenarioState.step + 1} of ${scenario.steps.length}</p><h2>${escapeHtml(scenario.title)}</h2></div><span class="tag">${escapeHtml(scenario.role)}</span></div>
        <div class="scenario-stage">
          <div class="scenario-speaker"><div class="avatar">L</div><div><strong>${escapeHtml(scenario.role)}</strong><div class="microcopy">${countryLabel(lesson.country)}</div></div><button class="speak-button" data-speak-raw="${encodeURIComponent(interpolate(step.line))}" data-speech-country="${lesson.country}">${icons.speaker}</button></div>
          <p class="scenario-line">${display(step.line)}</p>
          <p class="scenario-translation">${display(step.english)}</p>
          <div class="scenario-choices">
            ${step.choices.map((choice, index) => `<button class="scenario-choice" data-scenario-choice="${index}" data-lesson-id="${lesson.id}" ${topLevel ? 'data-top-level="true"' : ''}><strong>${display(choice.local)}</strong><span>${display(choice.english)}</span></button>`).join('')}
          </div>
        </div>
        ${scenarioState.feedback ? `<p class="quiz-feedback ${scenarioState.selected?.quality === 'retry' ? 'bad' : 'good'}">${escapeHtml(scenarioState.feedback)}</p>` : ''}
      </div>`;
  }

  function renderPractice(mode) {
    switch (mode) {
      case 'flashcards': return renderFlashcards();
      case 'listening': return renderListeningPractice();
      case 'speaking': return renderSpeakingPractice();
      case 'scenario': return renderTopScenario();
      default: return renderPracticeHome();
    }
  }

  function renderPracticeHome() {
    const queue = buildReviewQueue();
    const review = reviewQueueSummary();
    return `
      <header class="page-header">
        <div><p class="eyebrow">Five-minute repetitions</p><h1>Practice</h1><p>Today’s review is rebuilt automatically from phrases you missed or rated difficult, then filled with recently introduced vocabulary.</p></div>
        <button class="primary-button" data-route="practice/flashcards">Start review</button>
      </header>
      <div class="practice-grid">
        ${practiceCard('book','Today’s review','Recall your weakest phrases first, with spaced follow-ups after successful recalls.',`${review.total} ready · ${review.struggled} from struggles`,'practice/flashcards')}
        ${practiceCard('headphones','Listening','Hear a phrase without text and choose what it means.','Natural-speed audio','practice/listening')}
        ${practiceCard('mic','Speaking','Use device speech recognition to check understandable output.','Microphone practice','practice/speaking')}
        ${practiceCard('route','Trip simulator','Run the final route scenario from rental desk to Dubrovnik.','5 travel decisions','practice/scenario')}
      </div>
      <section class="section info-card">
        <p class="eyebrow">Current mode</p>
        <h2>${currentCountry().flag} ${currentCountry().language}</h2>
        <p class="muted">Shared phrases remain available in both modes. Local variants are selected automatically for practice.</p>
      </section>`;
  }

  function practiceCard(icon, title, text, label, route) {
    return `
      <button class="practice-card" data-route="${route}">
        <span class="action-card-icon">${icons[icon]}</span>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
        <div class="practice-card-footer"><span class="tag">${escapeHtml(label)}</span><strong>Begin →</strong></div>
      </button>`;
  }

  function isoDay(date = new Date()) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function addDaysIso(days) {
    const date = new Date();
    date.setDate(date.getDate() + Number(days || 0));
    return isoDay(date);
  }

  function recordReviewOutcome(id, outcome, source = 'practice', spacingDays = null) {
    if (!phraseMap.has(id)) return;
    const existing = state.reviewStats[id] || { attempts: 0, struggles: 0, successes: 0, streak: 0 };
    const now = new Date().toISOString();
    existing.attempts += 1;
    existing.lastAttempt = now;
    existing.lastSource = source;
    if (outcome === 'struggle') {
      existing.struggles += 1;
      existing.streak = 0;
      existing.lastStruggle = now;
      existing.nextDue = isoDay();
    } else if (outcome === 'success') {
      existing.successes += 1;
      existing.streak += 1;
      const days = spacingDays ?? Math.min(5, Math.max(1, existing.streak + 1));
      existing.nextDue = addDaysIso(days);
    }
    state.reviewStats[id] = existing;
  }

  function introducedPhraseIds() {
    const day = getCourseDay();
    const ids = new Set();
    lessons.forEach(lesson => {
      if (lesson.id <= day || state.completedLessons.includes(lesson.id)) {
        lesson.phraseIds.forEach(id => ids.add(id));
      }
    });
    return ids;
  }

  function reviewPriority(phrase) {
    const rec = state.reviewStats[phrase.id];
    const hasRating = Object.prototype.hasOwnProperty.call(state.phraseRatings, phrase.id);
    const rating = Number(state.phraseRatings[phrase.id] || 0);
    const today = isoDay();
    if (rec) {
      const due = !rec.nextDue || rec.nextDue <= today;
      return (due ? 120 : 0) + (rec.struggles || 0) * 24 - (rec.successes || 0) * 4 - rating * 5 + (state.favorites.includes(phrase.id) ? 4 : 0);
    }
    if (hasRating && rating === 0) return 110;
    if (hasRating) return 25 - rating * 4;
    return 5;
  }

  function buildReviewQueue() {
    const introduced = introducedPhraseIds();
    let relevant = relevantPhrases().filter(phrase => introduced.has(phrase.id));
    if (!relevant.length) relevant = relevantPhrases().filter(phrase => lessonMap.get(1)?.phraseIds.includes(phrase.id));
    const today = isoDay();
    const dueOrStruggled = relevant.filter(phrase => {
      const rec = state.reviewStats[phrase.id];
      const explicitHard = Object.prototype.hasOwnProperty.call(state.phraseRatings, phrase.id) && Number(state.phraseRatings[phrase.id]) === 0;
      return explicitHard || (rec && ((rec.struggles || 0) > 0) && (!rec.nextDue || rec.nextDue <= today));
    });
    const ranked = [...relevant].sort((a, b) => reviewPriority(b) - reviewPriority(a));
    const queue = [...dueOrStruggled.sort((a, b) => reviewPriority(b) - reviewPriority(a))];
    for (const phrase of ranked) {
      if (!queue.some(item => item.id === phrase.id)) queue.push(phrase);
      if (queue.length >= 16) break;
    }
    return queue.slice(0, 16);
  }

  function reviewQueueSummary() {
    const queue = buildReviewQueue();
    const struggled = queue.filter(phrase => (state.reviewStats[phrase.id]?.struggles || 0) > 0 || (Object.prototype.hasOwnProperty.call(state.phraseRatings, phrase.id) && Number(state.phraseRatings[phrase.id]) === 0)).length;
    return { total: queue.length, struggled };
  }

  function ensureFlashQueue() {
    if (!ui.flashQueue.length) ui.flashQueue = shuffle(buildReviewQueue());
    if (ui.flashIndex >= ui.flashQueue.length) ui.flashIndex = 0;
  }

  function renderFlashcards() {
    ensureFlashQueue();
    const phrase = ui.flashQueue[ui.flashIndex] || relevantPhrases()[0];
    const rating = Number(state.phraseRatings[phrase.id] || 0);
    return `
      <header class="page-header"><div><button class="text-button" data-route="practice">← Practice</button><p class="eyebrow">Recall drill · ${ui.flashIndex + 1} of ${ui.flashQueue.length}</p><h1>Flashcards</h1></div><span class="score-badge">Comfort ${rating}/3</span></header>
      <div class="flashcard ${ui.flashFlipped ? 'flipped' : ''}" data-flip-card role="button" tabindex="0" aria-label="Flip flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div><p class="eyebrow">Say this in ${currentCountry().language}</p><div class="flashcard-main">${display(phrase.english)}</div></div>
            <span class="flashcard-hint">Tap to reveal</span>
          </div>
          <div class="flashcard-face flashcard-back">
            <div><p class="eyebrow" style="color:#a9ded8">${phraseCountryLabel(phrase.country).text}</p><div class="flashcard-main">${display(phrase.local)}</div>${state.settings.showPronunciation ? `<p>${escapeHtml(pronunciationGuide(phrase.local))}</p>` : ''}<button class="secondary-button" data-speak-phrase="${phrase.id}" style="margin-top:1rem">${icons.speaker} Hear it</button></div>
            <span class="flashcard-hint">Rate recall below</span>
          </div>
        </div>
      </div>
      <div class="flash-controls">
        <button class="rating-button hard" data-rate-phrase="${phrase.id}" data-rating="0">Again</button>
        <button class="rating-button good" data-rate-phrase="${phrase.id}" data-rating="2">Got it</button>
        <button class="rating-button easy" data-rate-phrase="${phrase.id}" data-rating="3">Easy</button>
      </div>`;
  }

  function buildListeningQuestion() {
    const pool = relevantPhrases().filter(item => item.local.length < 90);
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = shuffle(pool.filter(item => item.id !== target.id && item.english !== target.english)).slice(0, 2);
    return { targetId: target.id, options: shuffle([target, ...distractors]).map(item => item.id), answered: false, selectedId: null };
  }

  function renderListeningPractice() {
    if (!ui.listening) ui.listening = buildListeningQuestion();
    const q = ui.listening;
    const target = phraseMap.get(q.targetId);
    return `
      <header class="page-header"><div><button class="text-button" data-route="practice">← Practice</button><p class="eyebrow">Listen before reading</p><h1>What did you hear?</h1><p>Play the phrase, then choose its meaning.</p></div><span class="score-badge">${state.stats.listeningCorrect}/${state.stats.listeningTotal || 0} correct</span></header>
      <div class="quiz-card" style="text-align:center">
        <button class="mic-button" data-speak-phrase="${target.id}" aria-label="Play listening phrase">${icons.headphones}</button>
        <p class="microcopy">${q.answered ? display(target.local) : 'Tap to hear it again'}</p>
        <div class="quiz-options" style="text-align:left">
          ${q.options.map((id, index) => {
            const phrase = phraseMap.get(id);
            let cls = '';
            if (q.answered && id === q.targetId) cls = 'correct';
            if (q.answered && id === q.selectedId && id !== q.targetId) cls = 'incorrect';
            return `<button class="quiz-option ${cls}" data-listening-answer="${id}" ${q.answered ? 'disabled' : ''}><span class="letter">${String.fromCharCode(65 + index)}</span><span>${display(phrase.english)}</span></button>`;
          }).join('')}
        </div>
        ${q.answered ? `<p class="quiz-feedback ${q.selectedId === q.targetId ? 'good' : 'bad'}">${q.selectedId === q.targetId ? 'Correct.' : 'Not this time.'} You heard: <strong>${display(target.local)}</strong></p><button class="primary-button" data-next-listening>Next phrase</button>` : ''}
      </div>`;
  }

  function ensureSpeakingPhrase() {
    const pool = relevantPhrases().filter(item => item.local.length < 100);
    if (!ui.speakingPhraseId || !pool.some(item => item.id === ui.speakingPhraseId)) ui.speakingPhraseId = pool[0]?.id;
    return phraseMap.get(ui.speakingPhraseId);
  }

  function renderSpeakingPractice() {
    const target = ensureSpeakingPhrase();
    return `
      <header class="page-header"><div><button class="text-button" data-route="practice">← Practice</button><p class="eyebrow">Understandable speech</p><h1>Speaking lab</h1><p>Hear the phrase once, then record it. Scoring is approximate and depends on your device’s recognition support.</p></div></header>
      <section class="speak-lab">
        <span class="country-badge ${target.country}">${phraseCountryLabel(target.country).text}</span>
        <p class="speak-target">${display(target.local)}</p>
        <p class="muted">${display(target.english)}</p>
        ${state.settings.showPronunciation ? `<p class="phrase-pronunciation">${escapeHtml(pronunciationGuide(target.local))}</p>` : ''}
        <div class="page-header-actions" style="justify-content:center"><button class="secondary-button" data-speak-phrase="${target.id}">${icons.speaker} Hear it</button><button class="ghost-button" data-next-speaking="all">Another phrase</button></div>
        ${micStatusMarkup()}
        <button class="mic-button" data-record-phrase="${target.id}" aria-label="Record phrase">${icons.mic}</button>
        <p class="microcopy" id="speech-status">Tap the microphone and speak.</p>
        <div class="speech-result" id="speech-result">The app will compare the recognized words with the target phrase.</div>
      </section>`;
  }

  function renderTopScenario() {
    const lesson = lessonMap.get(14);
    const scenarioState = getScenarioState(lesson);
    return `
      <header class="page-header"><div><button class="text-button" data-route="practice">← Practice</button><p class="eyebrow">Final route rehearsal</p><h1>Trip simulator</h1><p>Five decisions covering the most consequential interactions on your route.</p></div></header>
      <div id="top-scenario-mount">${renderScenarioCard(lesson, scenarioState, true)}</div>`;
  }

  function phrasebookCategories() {
    return ['All','Favorites',...new Set(phrases.map(item => item.category))];
  }

  function filteredPhrasebook() {
    const query = ui.phrasebookQuery.trim().toLocaleLowerCase();
    return phrases.filter(phrase => {
      const localMatch = phrase.country === 'shared' || phrase.country === state.country || ui.phrasebookFilter === 'All' || ui.phrasebookFilter === 'Favorites';
      const filterMatch = ui.phrasebookFilter === 'All'
        ? localMatch
        : ui.phrasebookFilter === 'Favorites'
          ? state.favorites.includes(phrase.id)
          : phrase.category === ui.phrasebookFilter && localMatch;
      const queryMatch = !query || [phrase.local, phrase.english, phrase.category].some(value => value.toLocaleLowerCase().includes(query));
      return filterMatch && queryMatch;
    });
  }

  function renderPhrasebook() {
    const list = filteredPhrasebook();
    return `
      <header class="page-header">
        <div><p class="eyebrow">Offline reference</p><h1>Phrasebook</h1><p>Search in English or the local language. By default, local variants match ${currentCountry().name} mode.</p></div>
        <button class="primary-button" data-open-quick>Say it now</button>
      </header>
      <div class="search-row"><input class="search-input" id="phrase-search" type="search" placeholder="Search phrases, e.g. parking" value="${escapeHtml(ui.phrasebookQuery)}" aria-label="Search phrases"><button class="secondary-button" data-clear-search>Clear</button></div>
      <div class="filter-row">${phrasebookCategories().map(category => `<button class="chip-button ${ui.phrasebookFilter === category ? 'active' : ''}" data-phrase-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div>
      <div class="section-heading" style="margin-top:.8rem"><p class="muted">${list.length} phrases</p><span class="country-badge ${state.country}">${currentCountry().flag} ${currentCountry().name} local variants</span></div>
      <div id="phrasebook-results" class="phrasebook-list">${list.length ? list.map(renderPhraseCard).join('') : '<div class="empty-state"><h3>No matching phrases</h3><p>Try a broader search or another category.</p></div>'}</div>`;
  }

  function tripShortcutByKey(key) {
    return tripShortcuts.find(stop => stop.key === key) || null;
  }

  function tripShortcutPhrases(stop) {
    if (!stop) return [];
    const ids = [];
    stop.lessonIds.forEach(id => {
      const lesson = lessonMap.get(id);
      lesson?.phraseIds.forEach(phraseId => { if (!ids.includes(phraseId)) ids.push(phraseId); });
    });
    const local = ids.map(id => phraseMap.get(id)).filter(Boolean).filter(phrase => phrase.country === 'shared' || phrase.country === stop.country);
    return local.slice(0, 10);
  }

  function renderTripShortcutPanel() {
    const stop = tripShortcutByKey(ui.tripLocation);
    if (!stop) return '';
    const stopPhrases = tripShortcutPhrases(stop);
    return `
      <section class="section trip-mode-panel" id="trip-mode-panel">
        <div class="section-heading"><div><p class="eyebrow">Trip mode · ${stop.flag} ${escapeHtml(stop.city)}</p><h2>Use these first</h2><p class="muted">High-value phrases and role-plays already included in your course, surfaced for this stop.</p></div><button class="text-button" data-close-trip-shortcut>Close</button></div>
        <div class="trip-phrase-grid">${stopPhrases.map(renderPhraseCard).join('')}</div>
        <div class="trip-scenario-actions">
          ${stop.lessonIds.map(id => `<button class="secondary-button" data-trip-scenario="${id}">Role-play: ${escapeHtml(lessonMap.get(id).title)}</button>`).join('')}
        </div>
      </section>`;
  }

  function renderTrip() {
    return `
      <header class="page-header">
        <div><p class="eyebrow">Itinerary-aware learning</p><h1>Your Adriatic route</h1><p>Select your current stop for instant access to its most useful phrases and role-plays, or use the full route below.</p></div>
        <button class="primary-button" data-route="practice/scenario">Run full simulation</button>
      </header>
      <div class="inline-alert"><strong>Practice examples:</strong> Times, prices, ferry schedules and directions in the dialogues are illustrative. Verify actual travel details during the trip.</div>
      <section class="section trip-shortcut-strip">
        <div class="trip-shortcut-buttons">${tripShortcuts.map(stop => `<button class="chip-button trip-shortcut ${ui.tripLocation === stop.key ? 'active' : ''}" data-trip-shortcut="${stop.key}">${stop.flag} ${escapeHtml(stop.city)}</button>`).join('')}</div>
      </section>
      ${renderTripShortcutPanel()}
      <section class="trip-map">
        <div class="route-line" aria-hidden="true"></div>
        <div class="trip-stops">
          ${trip.map(stop => `
            <div class="trip-stop">
              <div class="trip-stop-dot">${stop.flag}</div>
              <div><h3>${escapeHtml(stop.city)}</h3><p>${escapeHtml(stop.country)} · ${escapeHtml(stop.focus)}</p></div>
              <span class="nights">${escapeHtml(stop.nights)}</span>
            </div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-heading"><div><p class="eyebrow">Stop-by-stop missions</p><h2>Practice the interaction before you need it</h2></div></div>
        <div class="lesson-list">
          ${trip.map(stop => `
            <div class="route-card" style="padding:1rem">
              <div class="section-heading"><div><span class="flag" style="font-size:1.4rem">${stop.flag}</span><h2>${escapeHtml(stop.city)}</h2><p class="muted">${escapeHtml(stop.focus)}</p></div><span class="tag">${escapeHtml(stop.nights)}</span></div>
              <div class="page-header-actions">${stop.lessonIds.map(id => `<button class="secondary-button" data-lesson="${id}">Day ${id}: ${escapeHtml(lessonMap.get(id).title)}</button>`).join('')}</div>
            </div>`).join('')}
        </div>
      </section>

      <section class="section info-grid">
        <div class="info-card"><p class="eyebrow">Croatia mode</p><h2>🇭🇷 Listen for</h2><ul>${countryGuide.croatia.preferred.map(([english, local]) => `<li><strong>${escapeHtml(local)}</strong> — ${escapeHtml(english)}</li>`).join('')}</ul></div>
        <div class="info-card"><p class="eyebrow">Montenegro mode</p><h2>🇲🇪 Listen for</h2><ul>${countryGuide.montenegro.preferred.map(([english, local]) => `<li><strong>${escapeHtml(local)}</strong> — ${escapeHtml(english)}</li>`).join('')}</ul></div>
      </section>`;
  }

  function hydrateCurrentView(root, param) {
    if (root === 'listening' || (root === 'practice' && param === 'listening')) {
      setTimeout(() => {
        const target = ui.listening && phraseMap.get(ui.listening.targetId);
        if (target && !ui.listening.answered) speakPhrase(target);
      }, 250);
    }
  }

  function renderQuickSheet() {
    const category = quickCategories[ui.quickCategoryIndex] || quickCategories[0];
    let available = category.phraseIds.map(id => phraseMap.get(id)).filter(Boolean).filter(item => item.country === 'shared' || item.country === state.country);
    if (!available.length) available = category.phraseIds.map(id => phraseMap.get(id)).filter(Boolean);
    if (ui.quickPhraseIndex >= available.length) ui.quickPhraseIndex = 0;
    const phrase = available[ui.quickPhraseIndex];

    quickContent.innerHTML = `
      <div class="quick-category-grid">
        ${quickCategories.map((item, index) => `<button class="quick-category ${index === ui.quickCategoryIndex ? 'active' : ''}" data-quick-category="${index}"><span style="font-size:1.25rem">${item.icon}</span><br><strong>${escapeHtml(item.name)}</strong></button>`).join('')}
      </div>
      <div class="quick-card">
        <span class="country-badge ${phrase.country}">${phraseCountryLabel(phrase.country).text}</span>
        <div class="local">${display(phrase.local)}</div>
        <div class="english">${display(phrase.english)}</div>
        <button class="primary-button" data-speak-phrase="${phrase.id}">${icons.speaker} Play aloud</button>
      </div>
      <div class="quick-next"><button class="secondary-button" data-quick-prev>← Previous</button><button class="secondary-button" data-quick-next>Next →</button></div>
      <p class="microcopy" style="margin-top:.8rem;text-align:center">This card remains available after the app has been loaded offline.</p>`;
  }

  function openQuickSheet() {
    renderQuickSheet();
    quickSheet.classList.add('open');
    quickSheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickSheet() {
    quickSheet.classList.remove('open');
    quickSheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openSettings() {
    document.getElementById('setting-name').value = state.settings.name;
    document.getElementById('setting-start-date').value = state.settings.startDate;
    document.getElementById('setting-speech-rate').value = String(state.settings.speechRate);
    document.getElementById('setting-pronunciation').checked = state.settings.showPronunciation;
    document.getElementById('setting-haptics').checked = state.settings.haptics;
    ensureSpeechVoices().then(updateVoiceStatus);
    settingsSheet.classList.add('open');
    settingsSheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSettings() {
    settingsSheet.classList.remove('open');
    settingsSheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function refreshSpeechVoices() {
    speechVoices = window.speechSynthesis?.getVoices?.() || [];
    if (speechVoices.length) speechVoicesReady = true;
    updateVoiceStatus();
    return speechVoices;
  }

  function ensureSpeechVoices() {
    if (!('speechSynthesis' in window)) return Promise.resolve([]);
    refreshSpeechVoices();
    if (speechVoices.length) return Promise.resolve(speechVoices);
    if (voiceLoadPromise) return voiceLoadPromise;

    voiceLoadPromise = new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        refreshSpeechVoices();
        resolve(speechVoices);
      };
      const onChanged = () => {
        refreshSpeechVoices();
        if (speechVoices.length) {
          window.speechSynthesis.removeEventListener?.('voiceschanged', onChanged);
          finish();
        }
      };
      window.speechSynthesis.addEventListener?.('voiceschanged', onChanged);
      setTimeout(finish, 1200);
    }).finally(() => { voiceLoadPromise = null; });

    return voiceLoadPromise;
  }

  function voiceCandidates(locale) {
    const lower = locale.toLowerCase();
    const primary = lower.split('-')[0];
    const exact = speechVoices.filter(v => v.lang.toLowerCase() === lower);
    const sameLanguage = speechVoices.filter(v => v.lang.toLowerCase().split('-')[0] === primary && !exact.includes(v));

    // Montenegrin has little dedicated browser-TTS support. Serbian is the first
    // choice; Croatian is an explicit, visible proxy because it shares the same
    // Latin-script sound inventory needed by this travel curriculum.
    let proxy = [];
    if (primary === 'sr') {
      proxy = speechVoices.filter(v => v.lang.toLowerCase().split('-')[0] === 'hr' && !exact.includes(v) && !sameLanguage.includes(v));
    }
    return [...exact, ...sameLanguage, ...proxy];
  }

  function findVoice(locale) {
    const candidates = voiceCandidates(locale);
    if (!candidates.length) return null;
    return candidates.find(v => v.localService) || candidates[0];
  }

  function describeVoice(locale) {
    const voice = findVoice(locale);
    if (!voice) return { voice: null, proxy: false, label: 'No compatible voice installed' };
    const requested = locale.toLowerCase().split('-')[0];
    const actual = voice.lang.toLowerCase().split('-')[0];
    const proxy = requested !== actual;
    return { voice, proxy, label: `${voice.name} (${voice.lang})${proxy ? ' — Croatian proxy' : ''}` };
  }

  function updateVoiceStatus() {
    const node = document.getElementById('voice-status');
    if (!node) return;
    if (!('speechSynthesis' in window)) {
      node.textContent = 'Audio: browser speech synthesis is unavailable.';
      return;
    }
    const locale = resolveSpeechLocale(state.country);
    const info = describeVoice(locale);
    if (!speechVoicesReady && !speechVoices.length) {
      node.textContent = 'Audio: loading compatible voices…';
    } else if (!info.voice) {
      node.textContent = `Audio: no compatible ${state.country === 'croatia' ? 'Croatian' : 'Serbian/Croatian'} voice is installed. Playback will stay off rather than use an unrelated voice.`;
    } else {
      node.textContent = `Audio voice: ${info.label}. The sound guide is generated from the same local spelling sent to this voice.`;
    }
  }

  async function speakText(text, country = state.country, options = {}) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech playback is not supported in this browser.');
      return false;
    }

    await ensureSpeechVoices();
    const resolved = interpolate(text).replace(/[·]/g, ',');
    const locale = resolveSpeechLocale(country);
    const info = describeVoice(locale);
    if (!info.voice) {
      showToast(`No compatible ${country === 'croatia' ? 'Croatian' : 'Serbian/Croatian'} speech voice is installed. Audio was not played.`);
      return false;
    }

    if (info.proxy) {
      const notice = `${info.voice.name}|${info.voice.lang}`;
      if (notice !== lastVoiceNotice) {
        lastVoiceNotice = notice;
        showToast(`Using ${info.voice.name} (${info.voice.lang}) as the Montenegrin pronunciation voice.`);
      }
    }

    const utterance = new SpeechSynthesisUtterance(resolved);
    utterance.voice = info.voice;
    utterance.lang = info.voice.lang;
    utterance.rate = Number(options.rate || state.settings.speechRate || 0.9);
    utterance.pitch = 1;

    return new Promise(resolve => {
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      window.speechSynthesis.speak(utterance);
    });
  }

  function speakPhrase(phrase) {
    window.speechSynthesis?.cancel();
    return speakText(phrase.local, phrase.country === 'shared' ? state.country : phrase.country);
  }

  async function speakLessonPhrases(lesson) {
    window.speechSynthesis?.cancel();
    const items = lesson.phraseIds.map(id => phraseMap.get(id)).filter(Boolean).filter(item => item.country === 'shared' || item.country === lesson.country || lesson.country === 'shared');
    for (const phrase of items) {
      await speakText(phrase.local, phrase.country === 'shared' ? state.country : phrase.country, { rate: Math.min(0.92, state.settings.speechRate) });
    }
  }

  async function speakDialogue(lesson) {
    window.speechSynthesis?.cancel();
    for (const turn of lesson.dialogue) {
      const rate = turn.speaker === 'you' ? Math.min(0.86, state.settings.speechRate) : state.settings.speechRate;
      await speakText(turn.local, lesson.country, { rate });
    }
  }

  function normalizeSpeech(text) {
    return String(text || '')
      .toLocaleLowerCase('hr')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));
    for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  }

  function similarity(a, b) {
    const left = normalizeSpeech(a);
    const right = normalizeSpeech(b);
    if (!left || !right) return 0;
    const editScore = 1 - (levenshtein(left, right) / Math.max(left.length, right.length));
    const targetWords = new Set(right.split(' '));
    const heardWords = new Set(left.split(' '));
    const overlap = [...targetWords].filter(word => heardWords.has(word)).length / targetWords.size;
    return Math.max(0, Math.min(1, editScore * 0.55 + overlap * 0.45));
  }

  function micStatusMarkup() {
    const statusClass = micState.status === 'ready' ? 'ready' : micState.status === 'blocked' || micState.status === 'unsupported' ? 'blocked' : 'needs-action';
    const label = micState.status === 'ready' ? 'Microphone ready' : micState.status === 'blocked' ? 'Microphone blocked' : micState.status === 'unsupported' ? 'Speaking check unavailable' : 'Microphone setup';
    const action = micState.status === 'needs-permission' || micState.status === 'unknown' || micState.status === 'checking'
      ? '<button class="text-button mic-setup-action" data-enable-mic>Enable microphone</button>'
      : micState.status === 'blocked' ? '<button class="text-button mic-setup-action" data-enable-mic>Check again</button>' : '';
    return `<div class="mic-setup ${statusClass}" id="mic-setup"><div><strong>${label}</strong><p>${escapeHtml(micState.message)}</p></div>${action}</div>`;
  }

  function updateMicStatusUI() {
    document.querySelectorAll('#mic-setup').forEach(node => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = micStatusMarkup();
      node.replaceWith(wrapper.firstElementChild);
    });
  }

  function micErrorMessage(error) {
    const name = error?.name || '';
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'Microphone access is blocked. Allow microphone access for this site in your browser or phone settings, then tap Check again.';
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'No microphone was found on this device.';
    if (name === 'NotReadableError' || name === 'TrackStartError') return 'The microphone is unavailable or is being used by another app. Close the other app and try again.';
    return 'The microphone could not be opened. Check the browser or phone microphone permission and try again.';
  }

  async function probeMicrophone({ request = false } = {}) {
    if (micProbePromise && !request) return micProbePromise;
    const run = (async () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!window.isSecureContext || location.protocol === 'file:') {
        micState.status = 'unsupported';
        micState.permission = 'unavailable';
        micState.message = 'Speaking practice requires the app to be served over HTTPS (or localhost). The downloaded HTML preview cannot request reliable microphone access.';
        updateMicStatusUI();
        return false;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        micState.status = 'unsupported';
        micState.permission = 'unavailable';
        micState.message = 'This browser does not provide microphone access to web apps.';
        updateMicStatusUI();
        return false;
      }
      if (!SpeechRecognition) {
        micState.status = 'unsupported';
        micState.permission = 'unknown';
        micState.message = 'This browser can access the microphone, but it does not support the speech-recognition feature used for pronunciation scoring.';
        updateMicStatusUI();
        return false;
      }

      if (!request && navigator.permissions?.query) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' });
          micState.permission = permission.state;
          if (permission.state === 'granted') {
            micState.status = 'ready';
            micState.message = 'Permission is granted. Tap the microphone and speak after the prompt.';
          } else if (permission.state === 'denied') {
            micState.status = 'blocked';
            micState.message = 'Microphone access is blocked for this site. Change the site permission in your browser or phone settings, then tap Check again.';
          } else {
            micState.status = 'needs-permission';
            micState.message = 'Tap Enable microphone. Your browser or phone will ask you to allow access.';
          }
          permission.onchange = () => { micProbePromise = null; probeMicrophone(); };
          updateMicStatusUI();
          return permission.state === 'granted';
        } catch (error) {
          // Some browsers do not expose microphone through the Permissions API.
        }
      }

      if (!request) {
        micState.status = 'needs-permission';
        micState.message = 'Tap Enable microphone to check access. Your browser or phone may ask you to allow the microphone.';
        updateMicStatusUI();
        return false;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        micState.status = 'ready';
        micState.permission = 'granted';
        micState.message = 'Microphone access is working. Tap the microphone and speak after the prompt.';
        updateMicStatusUI();
        return true;
      } catch (error) {
        micState.status = error?.name === 'NotAllowedError' || error?.name === 'SecurityError' ? 'blocked' : 'unsupported';
        micState.permission = micState.status === 'blocked' ? 'denied' : 'unavailable';
        micState.message = micErrorMessage(error);
        updateMicStatusUI();
        return false;
      }
    })();
    if (!request) micProbePromise = run.finally(() => { micProbePromise = null; });
    return run;
  }

  async function enableMicrophone() {
    micState.status = 'checking';
    micState.message = 'Checking microphone access…';
    updateMicStatusUI();
    const ok = await probeMicrophone({ request: true });
    showToast(ok ? 'Microphone ready' : 'Microphone setup needs attention');
    return ok;
  }

  async function recordPhrase(phrase) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const status = document.getElementById('speech-status');
    const result = document.getElementById('speech-result');
    const button = document.querySelector(`[data-record-phrase="${CSS.escape(phrase.id)}"]`);

    if (!SpeechRecognition) {
      if (result) result.innerHTML = '<strong>Speech recognition is not available in this browser.</strong><br>You can still use playback and shadowing practice.';
      showToast('Speech recognition is unavailable here.');
      return;
    }

    const micReady = micState.status === 'ready' || await probeMicrophone({ request: true });
    if (!micReady) {
      if (status) status.textContent = 'Microphone setup is required before speaking practice.';
      if (result) result.textContent = micState.message;
      return;
    }

    if (activeRecognition) {
      activeRecognition.abort();
      activeRecognition = null;
    }

    const recognition = new SpeechRecognition();
    activeRecognition = recognition;
    recognition.lang = resolveSpeechLocale(phrase.country === 'shared' ? state.country : phrase.country);
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      button?.classList.add('listening');
      if (status) status.textContent = 'Listening… speak now.';
      if (result) result.textContent = '…';
      haptic([15, 30, 15]);
    };

    recognition.onresult = event => {
      const alternatives = [...event.results[0]].map(item => item.transcript);
      const target = interpolate(phrase.local);
      const scored = alternatives.map(transcript => ({ transcript, score: similarity(transcript, target) })).sort((a, b) => b.score - a.score)[0];
      const percent = Math.round(scored.score * 100);
      const label = percent >= 82 ? 'Clearly understood' : percent >= 62 ? 'Mostly understood' : 'Try once more';
      state.stats.spokenAttempts += 1;
      const current = Number(state.phraseRatings[phrase.id] || 0);
      if (percent >= 82) {
        state.phraseRatings[phrase.id] = Math.max(current, 2);
        recordReviewOutcome(phrase.id, 'success', 'speaking', 2);
      } else {
        recordReviewOutcome(phrase.id, 'struggle', 'speaking');
      }
      saveState();
      if (status) status.textContent = label;
      if (result) result.innerHTML = `<span class="score-badge">${percent}% match</span><p><strong>Heard:</strong> ${escapeHtml(scored.transcript)}</p><p class="microcopy">Target: ${display(phrase.local)}</p>`;
      haptic(percent >= 62 ? 20 : [10, 40, 10]);
    };

    recognition.onerror = event => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        micState.status = 'blocked';
        micState.permission = 'denied';
        micState.message = 'Microphone or speech-recognition access was blocked. Allow access for this site in your browser or phone settings, then tap Check again.';
        updateMicStatusUI();
        if (status) status.textContent = 'Microphone access is blocked.';
        if (result) result.textContent = micState.message;
      } else if (event.error === 'audio-capture') {
        if (status) status.textContent = 'The microphone could not be used.';
        if (result) result.textContent = 'Check that another app is not using the microphone, then try again.';
      } else if (event.error === 'network') {
        if (status) status.textContent = 'Speech recognition could not connect.';
        if (result) result.textContent = 'Your browser may require an internet connection for speech recognition. Try again when connected.';
      } else {
        if (status) status.textContent = 'No usable speech was captured.';
        if (result) result.textContent = 'Try again in a quieter place and speak after the Listening prompt appears.';
      }
    };

    recognition.onend = () => {
      button?.classList.remove('listening');
      activeRecognition = null;
    };

    speakPhrase(phrase).then(() => setTimeout(() => recognition.start(), 250));
  }

  function nextSpeakingPhrase(scope) {
    const pool = scope === 'all'
      ? relevantPhrases().filter(item => item.local.length < 100)
      : lessonMap.get(Number(scope))?.phraseIds.map(id => phraseMap.get(id)).filter(Boolean) || relevantPhrases();
    const currentIndex = pool.findIndex(item => item.id === ui.speakingPhraseId);
    ui.speakingPhraseId = pool[(currentIndex + 1) % pool.length]?.id;
    render();
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) state.favorites = state.favorites.filter(item => item !== id);
    else state.favorites.push(id);
    saveState();
    haptic();
    render();
  }

  function answerQuiz(lessonId, selected) {
    const lesson = lessonMap.get(Number(lessonId));
    const quizState = getQuizState(lesson);
    if (quizState.answered) return;
    const question = lesson.quiz[quizState.index];
    quizState.answered = true;
    quizState.selected = Number(selected);
    if (quizState.selected === question.answer) {
      quizState.correct += 1;
      haptic(20);
    } else haptic([10, 40, 10]);
    refreshQuizMount(lesson);
  }

  function nextQuiz(lessonId) {
    const lesson = lessonMap.get(Number(lessonId));
    const quizState = getQuizState(lesson);
    if (quizState.index >= lesson.quiz.length - 1) {
      quizState.finished = true;
      state.quizScores[lesson.id] = quizState.correct;
      saveState();
      showToast(`Meaning check complete: ${quizState.correct}/3`);
    } else {
      quizState.index += 1;
      quizState.answered = false;
      quizState.selected = null;
    }
    refreshQuizMount(lesson);
  }

  function refreshQuizMount(lesson) {
    const mount = document.getElementById('quiz-mount');
    if (mount) mount.innerHTML = renderQuizCard(lesson, getQuizState(lesson));
  }

  function restartQuiz(lessonId) {
    ui.quiz[lessonId] = { index: 0, correct: 0, answered: false, selected: null, finished: false };
    refreshQuizMount(lessonMap.get(Number(lessonId)));
  }

  function chooseScenario(lessonId, choiceIndex, topLevel) {
    const lesson = lessonMap.get(Number(lessonId));
    const scenarioState = getScenarioState(lesson);
    if (scenarioState.complete) return;
    const step = lesson.scenario.steps[scenarioState.step];
    const choice = step.choices[Number(choiceIndex)];
    scenarioState.selected = choice;
    scenarioState.feedback = choice.feedback;

    if (choice.quality === 'retry') {
      haptic([10, 40, 10]);
      refreshScenario(lesson, topLevel);
      return;
    }

    scenarioState.score += choice.quality === 'good' ? 2 : 1;
    if (/Ne razumijem|Sporije/.test(choice.local)) state.stats.rescueUses += 1;
    haptic(20);

    setTimeout(() => {
      if (scenarioState.step >= lesson.scenario.steps.length - 1) {
        scenarioState.complete = true;
        state.scenarioScores[lesson.id] = { complete: true, score: scenarioState.score, completedAt: new Date().toISOString() };
        saveState();
        showToast('Scenario complete');
      } else {
        scenarioState.step += 1;
        scenarioState.feedback = '';
        scenarioState.selected = null;
      }
      refreshScenario(lesson, topLevel);
    }, 600);
    refreshScenario(lesson, topLevel);
  }

  function refreshScenario(lesson, topLevel) {
    const selector = topLevel ? '#top-scenario-mount' : '[data-panel="roleplay"]';
    const mount = document.querySelector(selector);
    if (mount) mount.innerHTML = renderScenarioCard(lesson, getScenarioState(lesson), topLevel);
  }

  function restartScenario(lessonId, topLevel) {
    ui.scenario[lessonId] = { step: 0, score: 0, feedback: '', selected: null, complete: false };
    refreshScenario(lessonMap.get(Number(lessonId)), topLevel);
  }

  function completeLesson(id) {
    const lessonId = Number(id);
    if (state.completedLessons.includes(lessonId)) {
      state.completedLessons = state.completedLessons.filter(item => item !== lessonId);
      showToast('Mission marked incomplete');
    } else {
      state.completedLessons.push(lessonId);
      state.completedLessons.sort((a, b) => a - b);
      showToast(`Day ${lessonId} complete`);
      haptic([20, 50, 20]);
    }
    saveState();
    render();
  }

  function ratePhrase(id, rating) {
    const numericRating = Number(rating);
    state.phraseRatings[id] = numericRating;
    if (numericRating === 0) recordReviewOutcome(id, 'struggle', 'flashcard');
    else recordReviewOutcome(id, 'success', 'flashcard', numericRating >= 3 ? 4 : 2);
    saveState();
    ui.flashFlipped = false;
    ui.flashIndex = (ui.flashIndex + 1) % ui.flashQueue.length;
    haptic();
    render();
  }

  function answerListening(id) {
    if (!ui.listening || ui.listening.answered) return;
    ui.listening.answered = true;
    ui.listening.selectedId = id;
    state.stats.listeningTotal += 1;
    if (id === ui.listening.targetId) {
      state.stats.listeningCorrect += 1;
      const current = Number(state.phraseRatings[id] || 0);
      state.phraseRatings[id] = Math.max(current, 1);
      recordReviewOutcome(ui.listening.targetId, 'success', 'listening', 2);
      haptic(20);
    } else {
      recordReviewOutcome(ui.listening.targetId, 'struggle', 'listening');
      haptic([10, 40, 10]);
    }
    saveState();
    render();
  }

  function nextListening() {
    ui.listening = buildListeningQuestion();
    render();
    setTimeout(() => speakPhrase(phraseMap.get(ui.listening.targetId)), 250);
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function exportProgress() {
    const payload = {
      app: 'Adriatic 14',
      exportedAt: new Date().toISOString(),
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adriatic14-progress-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported');
  }

  function handleClick(event) {
    const target = event.target.closest('button, [role="button"]');
    if (!target) return;

    if (target.dataset.route !== undefined) return routeTo(target.dataset.route);
    if (target.dataset.lesson) return routeTo(`lesson/${target.dataset.lesson}`);
    if (target.dataset.openQuick !== undefined) return openQuickSheet();
    if (target.dataset.closeSheet !== undefined) return closeQuickSheet();
    if (target.dataset.closeSettings !== undefined) return closeSettings();
    if (target.dataset.installApp !== undefined) return installApp();
    if (target.dataset.dismissInstall !== undefined) { ui.installDismissed = true; return render(); }
    if (target.dataset.enableMic !== undefined) return enableMicrophone();
    if (target.dataset.tripShortcut) {
      const stop = tripShortcutByKey(target.dataset.tripShortcut);
      if (!stop) return;
      ui.tripLocation = stop.key;
      state.country = stop.country;
      ui.flashQueue = [];
      ui.listening = null;
      ui.speakingPhraseId = null;
      saveState();
      if (getRoute() !== 'trip') return routeTo('trip');
      render();
      setTimeout(() => document.getElementById('trip-mode-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      return;
    }
    if (target.dataset.closeTripShortcut !== undefined) {
      ui.tripLocation = null;
      render();
      return;
    }
    if (target.dataset.tripScenario) {
      const lessonId = Number(target.dataset.tripScenario);
      ui.lessonTabs[lessonId] = 'roleplay';
      return routeTo(`lesson/${lessonId}`);
    }

    if (target.dataset.speakPhrase) {
      const phrase = phraseMap.get(target.dataset.speakPhrase);
      if (phrase) speakPhrase(phrase);
      return;
    }
    if (target.dataset.speakRaw) return speakText(decodeURIComponent(target.dataset.speakRaw), target.dataset.speechCountry || state.country);
    if (target.dataset.speakLesson) return speakLessonPhrases(lessonMap.get(Number(target.dataset.speakLesson)));
    if (target.dataset.speakDialogue) return speakDialogue(lessonMap.get(Number(target.dataset.speakDialogue)));
    if (target.dataset.favorite) return toggleFavorite(target.dataset.favorite);
    if (target.dataset.completeLesson) return completeLesson(target.dataset.completeLesson);
    if (target.dataset.recordPhrase) {
      const phrase = phraseMap.get(target.dataset.recordPhrase);
      if (phrase) recordPhrase(phrase);
      return;
    }
    if (target.dataset.nextSpeaking) return nextSpeakingPhrase(target.dataset.nextSpeaking);

    if (target.dataset.lessonTab) {
      const lessonId = Number(target.dataset.lessonId);
      ui.lessonTabs[lessonId] = target.dataset.lessonTab;
      render();
      return;
    }
    if (target.dataset.quizAnswer !== undefined) return answerQuiz(target.dataset.lessonId, target.dataset.quizAnswer);
    if (target.dataset.nextQuiz) return nextQuiz(target.dataset.nextQuiz);
    if (target.dataset.restartQuiz) return restartQuiz(target.dataset.restartQuiz);
    if (target.dataset.scenarioChoice !== undefined) return chooseScenario(target.dataset.lessonId, target.dataset.scenarioChoice, target.dataset.topLevel === 'true');
    if (target.dataset.restartScenario) return restartScenario(target.dataset.restartScenario, target.dataset.topLevel === 'true');

    if (target.dataset.flipCard !== undefined || target.closest('[data-flip-card]')) {
      if (target.closest('[data-speak-phrase]')) return;
      ui.flashFlipped = !ui.flashFlipped;
      render();
      return;
    }
    if (target.dataset.ratePhrase) return ratePhrase(target.dataset.ratePhrase, target.dataset.rating);
    if (target.dataset.listeningAnswer) return answerListening(target.dataset.listeningAnswer);
    if (target.dataset.nextListening !== undefined) return nextListening();

    if (target.dataset.phraseFilter !== undefined) {
      ui.phrasebookFilter = target.dataset.phraseFilter;
      render();
      return;
    }
    if (target.dataset.clearSearch !== undefined) {
      ui.phrasebookQuery = '';
      render();
      return;
    }

    if (target.dataset.quickCategory !== undefined) {
      ui.quickCategoryIndex = Number(target.dataset.quickCategory);
      ui.quickPhraseIndex = 0;
      renderQuickSheet();
      return;
    }
    if (target.dataset.quickPrev !== undefined) {
      const category = quickCategories[ui.quickCategoryIndex];
      const count = category.phraseIds.map(id => phraseMap.get(id)).filter(item => item && (item.country === 'shared' || item.country === state.country)).length || 1;
      ui.quickPhraseIndex = (ui.quickPhraseIndex - 1 + count) % count;
      renderQuickSheet();
      return;
    }
    if (target.dataset.quickNext !== undefined) {
      const category = quickCategories[ui.quickCategoryIndex];
      const count = category.phraseIds.map(id => phraseMap.get(id)).filter(item => item && (item.country === 'shared' || item.country === state.country)).length || 1;
      ui.quickPhraseIndex = (ui.quickPhraseIndex + 1) % count;
      renderQuickSheet();
    }
  }

  async function installApp() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    render();
  }

  document.addEventListener('click', handleClick);

  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[role="button"][data-lesson]')) {
      event.preventDefault();
      routeTo(`lesson/${event.target.dataset.lesson}`);
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-flip-card]')) {
      event.preventDefault();
      ui.flashFlipped = !ui.flashFlipped;
      render();
    }
    if (event.key === 'Escape') {
      closeQuickSheet();
      closeSettings();
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'phrase-search') {
      ui.phrasebookQuery = event.target.value;
      const results = document.getElementById('phrasebook-results');
      if (results) {
        const list = filteredPhrasebook();
        results.innerHTML = list.length ? list.map(renderPhraseCard).join('') : '<div class="empty-state"><h3>No matching phrases</h3><p>Try a broader search or another category.</p></div>';
      }
    }
  });

  countryToggle.addEventListener('click', () => {
    state.country = state.country === 'croatia' ? 'montenegro' : 'croatia';
    ui.flashQueue = [];
    ui.listening = null;
    ui.speakingPhraseId = null;
    saveState();
    haptic();
    if (quickSheet.classList.contains('open')) renderQuickSheet();
    render();
    showToast(`${currentCountry().flag} ${currentCountry().name} mode`);
  });

  document.getElementById('settings-button').addEventListener('click', openSettings);
  document.querySelectorAll('[data-close-sheet]').forEach(item => item.addEventListener('click', closeQuickSheet));
  document.querySelectorAll('[data-close-settings]').forEach(item => item.addEventListener('click', closeSettings));

  settingsForm.addEventListener('submit', event => {
    event.preventDefault();
    state.settings.name = document.getElementById('setting-name').value.trim() || 'Dave';
    state.settings.startDate = document.getElementById('setting-start-date').value || defaultState.settings.startDate;
    state.settings.speechRate = Number(document.getElementById('setting-speech-rate').value);
    state.settings.showPronunciation = document.getElementById('setting-pronunciation').checked;
    state.settings.haptics = document.getElementById('setting-haptics').checked;
    saveState();
    closeSettings();
    render();
    showToast('Settings saved');
  });

  document.getElementById('export-progress').addEventListener('click', exportProgress);
  document.getElementById('reset-progress').addEventListener('click', () => {
    const confirmed = window.confirm('Reset all lessons, phrase ratings and practice scores?');
    if (!confirmed) return;
    state = structuredClone(defaultState);
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { console.warn('Stored progress could not be cleared.', error); }
    Object.keys(ui.quiz).forEach(key => delete ui.quiz[key]);
    Object.keys(ui.scenario).forEach(key => delete ui.scenario[key]);
    ui.flashQueue = [];
    closeSettings();
    routeTo('home');
    render();
    showToast('Progress reset');
  });

  window.addEventListener('hashchange', render);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    render();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    showToast('Adriatic 14 installed');
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Service worker registration failed', error)));
  }

  if ('speechSynthesis' in window) {
    refreshSpeechVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshSpeechVoices);
    ensureSpeechVoices();
  }

  if (!location.hash) location.hash = '#/home';
  updateCountryButton();
  render();
  setTimeout(() => probeMicrophone(), 0);
  window.__ADRIATIC14_READY__ = true;
})();
