// ===== AGENT DEFINITIONS =====
const AGENTS_CONFIG = [
  {
    id: 'research',
    name: 'Research',
    task: 'Scan src/ for auth patterns, map UserService usage across 23 modules',
    deps: [],
    duration: [12000, 18000],
    needsInputChance: 0,
    inputPromptText: '',
  },
  {
    id: 'plan',
    name: 'Planner',
    task: 'Design OAuth2 + session token hybrid flow for user authentication',
    deps: ['research'],
    duration: [10000, 16000],
    needsInputChance: 0.35,
    inputPromptText: 'Architecture decision required — extend existing UserService module or create a standalone AuthModule?',
  },
  {
    id: 'code',
    name: 'Coder',
    task: 'Build AuthProvider, useAuth hook, and token refresh middleware',
    deps: ['plan'],
    duration: [15000, 24000],
    needsInputChance: 0.15,
    inputPromptText: 'Ambiguous type inference at line 142. Use strict union type or generic constraint?',
  },
  {
    id: 'style',
    name: 'Designer',
    task: 'Create LoginForm, AuthModal, and UserAvatar with dark mode support',
    deps: ['plan'],
    duration: [13000, 20000],
    needsInputChance: 0.2,
    inputPromptText: 'Two layout candidates generated. Choose: Grid-based (A) or Flex composition (B)?',
  },
  {
    id: 'review',
    name: 'Reviewer',
    task: 'Review 847 changed lines across AuthProvider, hooks, and middleware',
    deps: ['code', 'style'],
    duration: [9000, 15000],
    needsInputChance: 0.5,
    inputPromptText: '3 issues flagged (2 warnings, 1 suggestion). Approve to continue with current implementation?',
  },
  {
    id: 'test',
    name: 'Tester',
    task: 'Run 32 tests — unit for useAuth, integration for login flow',
    deps: ['code'],
    duration: [12000, 19000],
    needsInputChance: 0.1,
    inputPromptText: 'Coverage at 78% — below 80% threshold. Proceed anyway or generate additional tests?',
  },
  {
    id: 'security',
    name: 'Security',
    task: 'Audit token storage, check XSS vectors, scan 287 dependencies',
    deps: ['code', 'style'],
    duration: [9000, 14000],
    needsInputChance: 0.25,
    inputPromptText: 'Medium-severity CVE in transitive dependency lodash@4.17.20. Override and continue?',
  },
  {
    id: 'deploy',
    name: 'Deployer',
    task: 'Bundle auth module, deploy to staging at staging.app.internal',
    deps: ['review', 'test', 'security'],
    duration: [10000, 16000],
    needsInputChance: 0,
    inputPromptText: '',
  },
];

// ===== LOG MESSAGES PER AGENT =====
const LOG_MESSAGES = {
  research: [
    'Initializing workspace scanner...',
    'Parsing project structure...',
    'Found 142 source files in 23 directories',
    'Analyzing import graph...',
    'Identified 8 core modules',
    'Detected: React 18, TypeScript 5.4, Vite 5',
    'Mapping component hierarchy...',
    'Found 34 components, 12 hooks',
    'Analyzing state management — Redux (12 slices)',
    'Cross-referencing documentation...',
    'Building dependency matrix...',
    'Generating requirements summary...',
    'Research complete — 47 findings documented',
  ],
  plan: [
    'Loading research findings...',
    'Evaluating architectural options...',
    'Option A: Extend UserService (complexity: low)',
    'Option B: New AuthModule (complexity: medium)',
    'Running trade-off analysis...',
    'Recommended: Option A with selective refactor',
    'Generating task breakdown...',
    'Identified 6 implementation tasks',
    'Estimating effort per task...',
    'Creating sequence diagram...',
    'Validating against constraints...',
    'Plan finalized — 6 tasks, 3 phases',
  ],
  code: [
    'Scaffolding module structure...',
    'Writing AuthProvider component...',
    'Implementing useAuth() hook...',
    'Adding token refresh logic...',
    'Creating middleware: validateSession()',
    'Writing data model: UserCredentials',
    'Applying pattern: Repository',
    'Connecting to existing Redux store...',
    'Adding error boundary wrappers...',
    'Implementing retry logic with backoff...',
    'Writing utility: parseJWT()',
    'Refactoring SessionContext...',
    'Adding TypeScript strict overloads...',
    'Code generation complete — 847 lines',
  ],
  style: [
    'Loading design token system...',
    'Generating component: LoginForm',
    'Applying responsive breakpoints...',
    'Building: AuthModal overlay',
    'Creating CSS module: auth.module.css',
    'Adding micro-interactions...',
    'Implementing skeleton loaders...',
    'Building: UserAvatar component',
    'Applying dark mode variants...',
    'Testing contrast ratios — WCAG AA pass',
    'Optimizing SVG icon sprites...',
    'UI components complete — 12 elements',
  ],
  review: [
    'Loading diff — 847 lines changed...',
    'Running static analysis...',
    'Checking naming conventions...',
    'Analyzing cyclomatic complexity...',
    'Flagged: unused import on line 23',
    'Suggestion: extract helper at line 89',
    'Warning: missing error boundary in AuthModal',
    'Checking for race conditions...',
    'Validating prop types...',
    'Pattern check: consistent with codebase',
    'Review complete — 2 warnings, 1 suggestion',
  ],
  test: [
    'Generating test suite...',
    'Writing: AuthProvider.test.tsx',
    'Writing: useAuth.test.ts',
    'Writing: validateSession.test.ts',
    'Running 24 unit tests...',
    '████████░░ 16/24 passing',
    '██████████ 24/24 passing',
    'Running 8 integration tests...',
    '██████████ 8/8 passing',
    'Calculating coverage...',
    'Coverage: 84.2% (target: 80%)',
    'All 32 tests passing ✓',
  ],
  security: [
    'Scanning dependency tree...',
    'Checking 287 packages...',
    'Running SAST analysis...',
    'Analyzing auth token handling...',
    'Checking for XSS vectors...',
    'Validating CSP headers...',
    'Scanning for hardcoded secrets...',
    'Checking CORS configuration...',
    'No critical vulnerabilities found',
    'Advisory: update lodash to 4.17.21',
    'Security scan complete — 0 critical, 1 advisory',
  ],
  deploy: [
    'Starting build pipeline...',
    'Compiling TypeScript...',
    'Bundling with Vite...',
    'Optimizing chunks — 3 splits',
    'Compressing assets...',
    'Bundle size: 142kb gzipped',
    'Running smoke tests on build...',
    'Uploading artifacts...',
    'Updating staging environment...',
    'Running health checks...',
    'Deployment complete — staging live',
    'URL: https://staging.app.internal',
  ],
};

// ===== STATE =====
let agents = [];
let initTimestamp = 0;
let missionElapsed = 0;
let animationFrameId = null;
let isComplete = false;

// ===== DOM REFS =====
const board = document.getElementById('board');
const svg = document.getElementById('dependency-svg');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const missionClock = document.getElementById('mission-clock');
const overallProgress = document.getElementById('overall-progress');
const headerBadge = document.getElementById('header-badge');
const resetBtn = document.getElementById('reset-btn');

// ===== INITIALIZATION =====
function init() {
  isComplete = false;
  headerBadge.textContent = 'LIVE';
  headerBadge.classList.remove('complete');

  // Remove any existing completion banner
  const existingBanner = document.querySelector('.completion-banner');
  if (existingBanner) existingBanner.remove();

  // Clear columns
  ['queued', 'running', 'needs-input', 'completed'].forEach(status => {
    document.getElementById(`col-${status}`).innerHTML = '';
  });
  svg.innerHTML = '';

  // Create agent state from config
  agents = AGENTS_CONFIG.map((config, index) => ({
    ...config,
    status: 'queued',
    elapsed: 0,
    targetDuration: randomRange(config.duration[0], config.duration[1]),
    progress: 0,
    logs: [],
    logIndex: 0,
    nextLogTime: 0,
    revealDelay: index * 300,
    revealed: false,
    cardElement: null,
  }));

  initTimestamp = 0;
  missionElapsed = 0;

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(tick);
}

// ===== MAIN LOOP =====
function tick(timestamp) {
  if (!initTimestamp) initTimestamp = timestamp;
  const elapsed = timestamp - initTimestamp;
  missionElapsed = elapsed;

  let needsReconcile = false;

  // Phase 1: Staggered card reveal
  for (const agent of agents) {
    if (!agent.revealed && elapsed >= agent.revealDelay) {
      agent.revealed = true;
      needsReconcile = true;
    }
  }

  // Phase 2: Auto-start agents whose deps are all met
  const allRevealed = agents.every(a => a.revealed);
  if (allRevealed) {
    for (const agent of agents) {
      if (agent.status === 'queued' && depsMetFor(agent)) {
        agent.status = 'running';
        agent.nextLogTime = timestamp + 800;
        needsReconcile = true;
      }
    }
  }

  // Phase 3: Update running agents
  for (const agent of agents) {
    if (agent.status !== 'running') continue;

    agent.elapsed += 16.67; // approximate frame duration
    agent.progress = Math.min(agent.elapsed / agent.targetDuration, 1);

    // Emit log lines
    if (timestamp >= agent.nextLogTime && agent.logIndex < LOG_MESSAGES[agent.id].length) {
      const msg = LOG_MESSAGES[agent.id][agent.logIndex];
      agent.logs.push(msg);
      agent.logIndex++;
      agent.nextLogTime = timestamp + randomRange(800, 2000);
      appendLogLine(agent, msg);
    }

    // Update card time & progress in DOM
    updateCardLive(agent);

    // Check completion
    if (agent.progress >= 1) {
      if (agent.needsInputChance > 0 && Math.random() < agent.needsInputChance) {
        agent.status = 'needs-input';
      } else {
        agent.status = 'completed';
        agent.logs.push('— task completed');
      }
      needsReconcile = true;
    }
  }

  if (needsReconcile) {
    reconcileBoard();
  }

  updateDependencyLines();
  updateMissionClock();
  updateOverallProgress();

  // Check if all done
  if (agents.every(a => a.status === 'completed') && !isComplete) {
    isComplete = true;
    showCompletionState();
  }

  if (!isComplete) {
    animationFrameId = requestAnimationFrame(tick);
  }
}

// ===== DEPENDENCY CHECK =====
function depsMetFor(agent) {
  if (agent.deps.length === 0) return true;
  return agent.deps.every(depId => {
    const dep = agents.find(a => a.id === depId);
    return dep && dep.status === 'completed';
  });
}

// ===== BOARD RECONCILIATION =====
function reconcileBoard() {
  const columns = {
    queued: document.getElementById('col-queued'),
    running: document.getElementById('col-running'),
    'needs-input': document.getElementById('col-needs-input'),
    completed: document.getElementById('col-completed'),
  };

  for (const agent of agents) {
    if (!agent.revealed) continue;

    const targetCol = columns[agent.status];
    let cardEl = agent.cardElement;

    if (cardEl) {
      if (cardEl.parentElement !== targetCol) {
        // Card needs to move to a new column
        cardEl.remove();
        cardEl = createCardElement(agent);
        agent.cardElement = cardEl;
        targetCol.appendChild(cardEl);
      }
    } else {
      // Create new card
      cardEl = createCardElement(agent);
      agent.cardElement = cardEl;
      targetCol.appendChild(cardEl);
    }
  }

  updateCounts();
}

// ===== CARD CREATION =====
function createCardElement(agent) {
  const card = document.createElement('div');
  card.className = `card status-${agent.status}`;
  card.id = `card-${agent.id}`;
  card.setAttribute('data-agent', agent.id);

  let inner = `
    <div class="card-top">
      <div class="card-indicator">
        <span class="status-dot"></span>
        <span class="card-name">${sanitize(agent.name)}</span>
      </div>
      ${agent.elapsed > 0 ? `<span class="card-time">${formatTime(agent.elapsed)}</span>` : ''}
    </div>
    <p class="card-task">${sanitize(agent.task)}</p>
  `;

  // Dependency tags (show when queued)
  if (agent.status === 'queued' && agent.deps.length > 0) {
    const tags = agent.deps.map(depId => {
      const dep = agents.find(a => a.id === depId);
      const met = dep && dep.status === 'completed';
      return `<span class="dep-pill ${met ? 'met' : 'pending'}">${met ? '●' : '○'} ${sanitize(dep.name)}</span>`;
    }).join('');
    inner += `<div class="card-deps">${tags}</div>`;
  }

  // Log output (running cards)
  if (agent.status === 'running') {
    const logHtml = agent.logs.slice(-4).map(l =>
      `<div class="log-line">&gt; ${sanitize(l)}</div>`
    ).join('');
    inner += `<div class="card-log">${logHtml}</div>`;
  }

  // Input prompt (needs-input cards)
  if (agent.status === 'needs-input') {
    inner += `
      <div class="card-input">
        <p class="input-prompt">${sanitize(agent.inputPromptText)}</p>
        <button class="approve-btn" data-agent="${agent.id}">APPROVE &amp; CONTINUE</button>
      </div>
    `;
  }

  // Progress bar (running, needs-input, completed)
  if (agent.status !== 'queued') {
    const pct = Math.round(agent.progress * 100);
    const label = agent.status === 'completed' ? '✓' : `${pct}%`;
    inner += `
      <div class="card-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="progress-text">${label}</span>
      </div>
    `;
  }

  card.innerHTML = inner;

  // Event: click card to show modal
  card.addEventListener('click', (e) => {
    if (e.target.closest('.approve-btn')) return;
    showModal(agent.id);
  });

  // Event: hover to show dependency lines
  card.addEventListener('mouseenter', () => highlightLines(agent.id));
  card.addEventListener('mouseleave', () => clearLineHighlights());

  // Event: approve button
  const approveBtn = card.querySelector('.approve-btn');
  if (approveBtn) {
    approveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      approveAgent(agent.id);
    });
  }

  return card;
}

// ===== LIVE CARD UPDATES =====
function updateCardLive(agent) {
  const card = agent.cardElement;
  if (!card) return;

  const timeEl = card.querySelector('.card-time');
  if (timeEl) {
    timeEl.textContent = formatTime(agent.elapsed);
  }

  const progressFill = card.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${Math.round(agent.progress * 100)}%`;
  }

  const progressText = card.querySelector('.progress-text');
  if (progressText) {
    progressText.textContent = `${Math.round(agent.progress * 100)}%`;
  }
}

function appendLogLine(agent, msg) {
  const card = agent.cardElement;
  if (!card) return;

  const logEl = card.querySelector('.card-log');
  if (!logEl) return;

  const line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = `> ${msg}`;
  logEl.appendChild(line);

  // Keep only last ~6 visible lines
  while (logEl.children.length > 6) {
    logEl.removeChild(logEl.firstChild);
  }

  logEl.scrollTop = logEl.scrollHeight;
}

// ===== APPROVE AGENT =====
function approveAgent(agentId) {
  const agent = agents.find(a => a.id === agentId);
  if (!agent || agent.status !== 'needs-input') return;

  agent.status = 'completed';
  agent.logs.push('✓ Approved by operator');
  reconcileBoard();
}

// ===== COLUMN COUNTS =====
function updateCounts() {
  const counts = { queued: 0, running: 0, 'needs-input': 0, completed: 0 };
  for (const agent of agents) {
    if (agent.revealed) counts[agent.status]++;
  }
  document.getElementById('count-queued').textContent = counts.queued;
  document.getElementById('count-running').textContent = counts.running;
  document.getElementById('count-needs-input').textContent = counts['needs-input'];
  document.getElementById('count-completed').textContent = counts.completed;
}

// ===== DEPENDENCY LINES =====
function updateDependencyLines() {
  if (window.innerWidth < 900) return;

  const boardRect = board.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);

  // Clear old lines
  svg.innerHTML = '';

  for (const agent of agents) {
    if (!agent.revealed || agent.deps.length === 0) continue;

    const targetCard = agent.cardElement;
    if (!targetCard || !targetCard.offsetParent) continue;

    for (const depId of agent.deps) {
      const depAgent = agents.find(a => a.id === depId);
      if (!depAgent || !depAgent.revealed) continue;

      const sourceCard = depAgent.cardElement;
      if (!sourceCard || !sourceCard.offsetParent) continue;

      const sourceRect = sourceCard.getBoundingClientRect();
      const targetRect = targetCard.getBoundingClientRect();

      // Coordinates relative to board
      const x1 = sourceRect.right - boardRect.left;
      const y1 = sourceRect.top + sourceRect.height / 2 - boardRect.top;
      const x2 = targetRect.left - boardRect.left;
      const y2 = targetRect.top + targetRect.height / 2 - boardRect.top;

      // Determine line state
      let lineClass = 'dep-line ';
      if (depAgent.status === 'completed') {
        lineClass += 'met';
      } else if (depAgent.status === 'running') {
        lineClass += 'active';
      } else {
        lineClass += 'pending';
      }

      const midX = (x1 + x2) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      path.setAttribute('class', lineClass);
      path.setAttribute('data-from', depAgent.id);
      path.setAttribute('data-to', agent.id);
      svg.appendChild(path);
    }
  }
}

// ===== LINE HOVER HIGHLIGHTS =====
function highlightLines(agentId) {
  svg.querySelectorAll('.dep-line').forEach(line => {
    if (line.getAttribute('data-from') === agentId || line.getAttribute('data-to') === agentId) {
      line.classList.add('visible');
    }
  });
}

function clearLineHighlights() {
  svg.querySelectorAll('.dep-line.visible').forEach(line => {
    line.classList.remove('visible');
  });
}

// ===== MODAL =====
function showModal(agentId) {
  const agent = agents.find(a => a.id === agentId);
  if (!agent) return;

  modalTitle.textContent = `${agent.name} Agent`;

  const statusLabel = agent.status.replace('-', ' ').toUpperCase();
  const statusClass = agent.status === 'needs-input' ? 'needs-input' : agent.status;

  let html = `
    <div class="modal-status ${statusClass}">${sanitize(statusLabel)}</div>
    <p class="modal-task">${sanitize(agent.task)}</p>
    <div class="modal-meta">
      <span>Elapsed: ${formatTime(agent.elapsed)}</span>
      <span>Progress: ${Math.round(agent.progress * 100)}%</span>
    </div>
  `;

  // Dependencies
  if (agent.deps.length > 0) {
    html += `<div class="modal-deps"><h3 class="modal-section-title">Dependencies</h3><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">`;
    for (const depId of agent.deps) {
      const dep = agents.find(a => a.id === depId);
      const met = dep && dep.status === 'completed';
      html += `<span class="dep-pill ${met ? 'met' : 'pending'}">${met ? '●' : '○'} ${sanitize(dep.name)}</span>`;
    }
    html += `</div></div>`;
  }

  // Logs
  if (agent.logs.length > 0) {
    html += `
      <div class="modal-logs">
        <h3 class="modal-section-title">Output Log</h3>
        <div class="modal-log-container">
          ${agent.logs.map(l => `<div class="log-line">&gt; ${sanitize(l)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  // Needs input prompt
  if (agent.status === 'needs-input') {
    html += `
      <div class="modal-input">
        <p class="input-prompt">${sanitize(agent.inputPromptText)}</p>
        <button class="approve-btn" id="modal-approve-btn">APPROVE &amp; CONTINUE</button>
      </div>
    `;
  }

  modalBody.innerHTML = html;
  modalOverlay.classList.add('active');

  // Bind modal approve button
  const modalApproveBtn = document.getElementById('modal-approve-btn');
  if (modalApproveBtn) {
    modalApproveBtn.addEventListener('click', () => {
      approveAgent(agent.id);
      hideModal();
    });
  }
}

function hideModal() {
  modalOverlay.classList.remove('active');
}

// ===== CLOCK & PROGRESS =====
function updateMissionClock() {
  const secs = Math.floor(missionElapsed / 1000);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  missionClock.textContent = `T+ ${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateOverallProgress() {
  const completed = agents.filter(a => a.status === 'completed').length;
  overallProgress.textContent = `${completed} / ${agents.length} COMPLETE`;
}

// ===== COMPLETION =====
function showCompletionState() {
  headerBadge.textContent = 'COMPLETE';
  headerBadge.classList.add('complete');

  const banner = document.createElement('div');
  banner.className = 'completion-banner';
  banner.innerHTML = '<div class="completion-banner-text">MISSION COMPLETE — ALL AGENTS FINISHED</div>';
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('active'));

  // Flash column borders
  document.querySelectorAll('.column').forEach(col => {
    col.style.animation = 'completionFlash 1.5s ease-out';
  });
}

// ===== UTILITIES =====
function formatTime(ms) {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sanitize(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

// ===== EVENT LISTENERS =====
modalClose.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) hideModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideModal();
});
resetBtn.addEventListener('click', init);
window.addEventListener('resize', updateDependencyLines);

// ===== START =====
init();
