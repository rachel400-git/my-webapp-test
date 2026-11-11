/**
 * DevPulse - Main Application Logic
 * Pure Vanilla JavaScript (ES6+), Zero Dependencies, Fully Offline Capable
 */

(function () {
  'use strict';

  // State Management
  const STATE = {
    theme: localStorage.getItem('devpulse_theme') || 'dark',
    activeTab: 'dashboard',
    tasks: JSON.parse(localStorage.getItem('devpulse_tasks')) || [
      {
        id: 'task-1',
        title: 'Launch DevPulse on GitHub Pages',
        desc: 'Commit repository, push to GitHub, and enable Pages in repo settings.',
        status: 'in-progress',
        priority: 'high',
        tag: 'DevOps'
      },
      {
        id: 'task-2',
        title: 'Explore Dev Toolbox Utilities',
        desc: 'Test JSON validator, Base64 encoder, and UUID generator.',
        status: 'todo',
        priority: 'medium',
        tag: 'Feature'
      },
      {
        id: 'task-3',
        title: 'Complete 25-minute Deep Work Sprint',
        desc: 'Use the built-in Pomodoro timer to focus on a programming session.',
        status: 'todo',
        priority: 'low',
        tag: 'Productivity'
      },
      {
        id: 'task-4',
        title: 'Project architecture setup',
        desc: 'HTML5, CSS Custom Properties, and Vanilla JavaScript structure completed.',
        status: 'done',
        priority: 'high',
        tag: 'Setup'
      }
    ],
    timer: {
      mode: 'pomodoro', // pomodoro, shortBreak, longBreak
      durations: {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
      },
      timeLeft: 25 * 60,
      isRunning: false,
      intervalId: null,
      sessionsCompleted: parseInt(localStorage.getItem('devpulse_pomodoro_count') || '3', 10),
      soundEnabled: true,
      autoStart: false
    },
    projects: [
      {
        title: 'DevPulse Hub',
        desc: 'Developer dashboard with Pomodoro timer, Kanban board, and utilities playground.',
        type: 'web',
        icon: '⚡',
        tech: ['Vanilla JS', 'CSS Grid', 'GitHub Pages'],
        demoUrl: '#'
      },
      {
        title: 'Cloud Canvas API',
        desc: 'High performance real-time image processing microservice built with WebAssembly.',
        type: 'tool',
        icon: '🎨',
        tech: ['Rust', 'Wasm', 'TypeScript'],
        demoUrl: '#'
      },
      {
        title: 'SyntaxFlow Studio',
        desc: 'Modern browser-based code snippet animator and social preview generator.',
        type: 'web',
        icon: '✨',
        tech: ['WebAudio', 'Canvas', 'HTML5'],
        demoUrl: '#'
      },
      {
        title: 'NanoStore DB',
        desc: 'Ultra-lightweight embedded key-value document store with zero external dependencies.',
        type: 'demo',
        icon: '📦',
        tech: ['JavaScript', 'JSON', 'IndexedDB'],
        demoUrl: '#'
      }
    ],
    quotes: [
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
      { text: "Clean code always looks like it was written by someone who cares.", author: "Michael Feathers" },
      { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
    ]
  };

  // DOM Elements
  const DOM = {
    // Nav
    navButtons: document.querySelectorAll('.nav-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    pageHeading: document.getElementById('pageHeading'),
    pageSubheading: document.getElementById('pageSubheading'),
    sidebar: document.querySelector('.sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    liveClock: document.getElementById('liveClock'),
    themeToggle: document.getElementById('themeToggle'),

    // Dashboard
    statCompletedTasks: document.getElementById('statCompletedTasks'),
    statFocusTime: document.getElementById('statFocusTime'),
    statSessionsDone: document.getElementById('statSessionsDone'),
    statStreak: document.getElementById('statStreak'),
    totalTasksCount: document.getElementById('totalTasksCount'),
    quoteText: document.getElementById('quoteText'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    newQuoteBtn: document.getElementById('newQuoteBtn'),
    productivityChart: document.getElementById('productivityChart'),

    // Kanban
    todoList: document.getElementById('todoList'),
    inProgressList: document.getElementById('inProgressList'),
    doneList: document.getElementById('doneList'),
    todoCount: document.getElementById('todoCount'),
    inProgressCount: document.getElementById('inProgressCount'),
    doneCount: document.getElementById('doneCount'),
    openAddTaskModalBtn: document.getElementById('openAddTaskModalBtn'),
    taskSearchInput: document.getElementById('taskSearchInput'),
    priorityFilter: document.getElementById('priorityFilter'),

    // Modal
    taskModal: document.getElementById('taskModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    taskForm: document.getElementById('taskForm'),
    modalTitle: document.getElementById('modalTitle'),
    taskId: document.getElementById('taskId'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    taskDescInput: document.getElementById('taskDescInput'),
    taskPriorityInput: document.getElementById('taskPriorityInput'),
    taskCategoryInput: document.getElementById('taskCategoryInput'),

    // Pomodoro
    timerModes: document.querySelectorAll('.timer-mode-btn'),
    timerProgressFill: document.getElementById('timerProgressFill'),
    timerCountdown: document.getElementById('timerCountdown'),
    timerLabel: document.getElementById('timerLabel'),
    toggleTimerBtn: document.getElementById('toggleTimerBtn'),
    resetTimerBtn: document.getElementById('resetTimerBtn'),
    skipTimerBtn: document.getElementById('skipTimerBtn'),
    soundToggle: document.getElementById('soundToggle'),
    autoStartToggle: document.getElementById('autoStartToggle'),

    // Toolbox
    jsonInput: document.getElementById('jsonInput'),
    jsonFeedback: document.getElementById('jsonFeedback'),
    formatJsonBtn: document.getElementById('formatJsonBtn'),
    minifyJsonBtn: document.getElementById('minifyJsonBtn'),
    sampleJsonBtn: document.getElementById('sampleJsonBtn'),

    base64Input: document.getElementById('base64Input'),
    base64Feedback: document.getElementById('base64Feedback'),
    encodeBase64Btn: document.getElementById('encodeBase64Btn'),
    decodeBase64Btn: document.getElementById('decodeBase64Btn'),
    clearBase64Btn: document.getElementById('clearBase64Btn'),

    generateUuidBtn: document.getElementById('generateUuidBtn'),
    uuidList: document.getElementById('uuidList'),

    urlInput: document.getElementById('urlInput'),
    urlFeedback: document.getElementById('urlFeedback'),
    urlEncodeBtn: document.getElementById('urlEncodeBtn'),
    urlDecodeBtn: document.getElementById('urlDecodeBtn'),

    // Projects
    projectsGrid: document.getElementById('projectsGrid'),
    projectFilterPills: document.getElementById('projectFilterPills'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  /* ========================================================
     Notification / Toast System
     ======================================================== */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '⚡';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  /* ========================================================
     Theme System
     ======================================================== */
  function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devpulse_theme', theme);
    renderChart(); // redraw chart with theme-aware colors
  }

  DOM.themeToggle.addEventListener('click', () => {
    const newTheme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  /* ========================================================
     Live Clock
     ======================================================== */
  function updateLiveClock() {
    const now = new Date();
    DOM.liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  /* ========================================================
     Sidebar & Navigation
     ======================================================== */
  const tabDescriptions = {
    dashboard: { title: 'Dashboard', sub: 'System overview and productivity metrics' },
    kanban: { title: 'Task Board', sub: 'Manage, organize, and prioritize your sprints' },
    pomodoro: { title: 'Focus Timer', sub: 'Pomodoro timer with sound notification' },
    tools: { title: 'Dev Toolbox', sub: 'Formatters, validators, generators, and converters' },
    projects: { title: 'Project Showcase', sub: 'Featured demo applications and utilities' }
  };

  DOM.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
      // Close mobile sidebar if open
      if (DOM.sidebar.classList.contains('open')) {
        DOM.sidebar.classList.remove('open');
      }
    });
  });

  function switchTab(tabId) {
    STATE.activeTab = tabId;
    DOM.navButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    DOM.tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-${tabId}`));

    if (tabDescriptions[tabId]) {
      DOM.pageHeading.textContent = tabDescriptions[tabId].title;
      DOM.pageSubheading.textContent = tabDescriptions[tabId].sub;
    }

    if (tabId === 'dashboard') {
      renderChart();
      updateDashboardStats();
    }
  }

  if (DOM.sidebarToggle) {
    DOM.sidebarToggle.addEventListener('click', () => {
      DOM.sidebar.classList.toggle('open');
    });
  }

  /* ========================================================
     Quotes Generator
     ======================================================== */
  function setRandomQuote() {
    const quote = STATE.quotes[Math.floor(Math.random() * STATE.quotes.length)];
    DOM.quoteText.textContent = `"${quote.text}"`;
    DOM.quoteAuthor.textContent = `— ${quote.author}`;
  }

  DOM.newQuoteBtn.addEventListener('click', () => {
    setRandomQuote();
  });

  /* ========================================================
     Kanban Task Board & State Management
     ======================================================== */
  function saveTasks() {
    localStorage.setItem('devpulse_tasks', JSON.stringify(STATE.tasks));
    renderTasks();
    updateDashboardStats();
  }

  function renderTasks() {
    const searchTerm = DOM.taskSearchInput.value.toLowerCase().trim();
    const priority = DOM.priorityFilter.value;

    const filtered = STATE.tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm) || (t.desc && t.desc.toLowerCase().includes(searchTerm));
      const matchesPriority = priority === 'all' || t.priority === priority;
      return matchesSearch && matchesPriority;
    });

    const lists = {
      todo: DOM.todoList,
      'in-progress': DOM.inProgressList,
      done: DOM.doneList
    };

    Object.values(lists).forEach(list => list.innerHTML = '');

    const counts = { todo: 0, 'in-progress': 0, done: 0 };

    filtered.forEach(task => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      const targetList = lists[task.status];
      if (!targetList) return;

      const card = document.createElement('div');
      card.className = 'task-card';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-id', task.id);

      card.innerHTML = `
        <div class="task-card-header">
          <div class="task-card-title">${escapeHtml(task.title)}</div>
        </div>
        ${task.desc ? `<div class="task-card-desc">${escapeHtml(task.desc)}</div>` : ''}
        <div class="task-card-footer">
          <span class="task-tag">${escapeHtml(task.tag || 'General')}</span>
          <span class="task-priority-badge ${task.priority}">${task.priority}</span>
        </div>
        <div class="task-actions">
          ${task.status !== 'todo' ? `<button class="task-action-btn" data-action="prev" title="Move back">← Move</button>` : ''}
          ${task.status !== 'done' ? `<button class="task-action-btn" data-action="next" title="Advance">Advance →</button>` : ''}
          <button class="task-action-btn" data-action="delete" style="margin-left: auto; color: var(--status-red);">Delete</button>
        </div>
      `;

      // Drag and drop listeners
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);

      // Action buttons
      card.querySelectorAll('.task-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.getAttribute('data-action');
          if (action === 'delete') {
            deleteTask(task.id);
          } else if (action === 'next') {
            advanceTask(task.id);
          } else if (action === 'prev') {
            regressTask(task.id);
          }
        });
      });

      targetList.appendChild(card);
    });

    DOM.todoCount.textContent = counts.todo;
    DOM.inProgressCount.textContent = counts['in-progress'];
    DOM.doneCount.textContent = counts.done;
    DOM.totalTasksCount.textContent = STATE.tasks.length;
  }

  function advanceTask(id) {
    const task = STATE.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'todo') task.status = 'in-progress';
    else if (task.status === 'in-progress') task.status = 'done';
    saveTasks();
    showToast(`Task moved to ${task.status}`);
  }

  function regressTask(id) {
    const task = STATE.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'done') task.status = 'in-progress';
    else if (task.status === 'in-progress') task.status = 'todo';
    saveTasks();
    showToast(`Task moved back`);
  }

  function deleteTask(id) {
    STATE.tasks = STATE.tasks.filter(t => t.id !== id);
    saveTasks();
    showToast('Task removed');
  }

  // Drag & Drop
  let draggedTaskId = null;

  function handleDragStart(e) {
    draggedTaskId = this.getAttribute('data-id');
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', draggedTaskId);
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    draggedTaskId = null;
  }

  [DOM.todoList, DOM.inProgressList, DOM.doneList].forEach(list => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      list.style.background = 'rgba(88, 166, 255, 0.05)';
    });

    list.addEventListener('dragleave', () => {
      list.style.background = 'transparent';
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.style.background = 'transparent';
      const newStatus = list.getAttribute('data-status');
      if (draggedTaskId && newStatus) {
        const task = STATE.tasks.find(t => t.id === draggedTaskId);
        if (task && task.status !== newStatus) {
          task.status = newStatus;
          saveTasks();
          showToast(`Task moved to ${newStatus}`);
        }
      }
    });
  });

  DOM.taskSearchInput.addEventListener('input', renderTasks);
  DOM.priorityFilter.addEventListener('change', renderTasks);

  // Modal open/close
  DOM.openAddTaskModalBtn.addEventListener('click', () => {
    DOM.modalTitle.textContent = 'Add New Task';
    DOM.taskForm.reset();
    DOM.taskId.value = '';
    DOM.taskModal.classList.add('open');
    DOM.taskTitleInput.focus();
  });

  function closeModal() {
    DOM.taskModal.classList.remove('open');
  }

  DOM.closeModalBtn.addEventListener('click', closeModal);
  DOM.cancelModalBtn.addEventListener('click', closeModal);
  DOM.taskModal.addEventListener('click', (e) => {
    if (e.target === DOM.taskModal) closeModal();
  });

  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = DOM.taskTitleInput.value.trim();
    if (!title) return;

    const newTask = {
      id: 'task-' + Date.now(),
      title: title,
      desc: DOM.taskDescInput.value.trim(),
      priority: DOM.taskPriorityInput.value,
      tag: DOM.taskCategoryInput.value.trim() || 'General',
      status: 'todo'
    };

    STATE.tasks.unshift(newTask);
    saveTasks();
    closeModal();
    showToast('Task added successfully', 'success');
  });

  /* ========================================================
     Pomodoro Focus Timer
     ======================================================== */
  const circumference = 2 * Math.PI * 110;
  DOM.timerProgressFill.style.strokeDasharray = `${circumference} ${circumference}`;

  function setTimerProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    DOM.timerProgressFill.style.strokeDashoffset = offset;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    DOM.timerCountdown.textContent = formatTime(STATE.timer.timeLeft);
    const totalDuration = STATE.timer.durations[STATE.timer.mode];
    const progress = ((totalDuration - STATE.timer.timeLeft) / totalDuration) * 100;
    setTimerProgress(progress);
    document.title = `${formatTime(STATE.timer.timeLeft)} — DevPulse`;
  }

  function switchTimerMode(mode) {
    STATE.timer.mode = mode;
    STATE.timer.timeLeft = STATE.timer.durations[mode];
    stopTimer();
    DOM.timerModes.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-mode') === mode));
    DOM.timerLabel.textContent = mode === 'pomodoro' ? 'Stay focused' : 'Take a breather';
    updateTimerDisplay();
  }

  DOM.timerModes.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTimerMode(btn.getAttribute('data-mode'));
    });
  });

  function startTimer() {
    if (STATE.timer.isRunning) return;
    STATE.timer.isRunning = true;
    DOM.toggleTimerBtn.textContent = 'Pause';
    DOM.toggleTimerBtn.classList.replace('btn-primary', 'btn-secondary');

    STATE.timer.intervalId = setInterval(() => {
      if (STATE.timer.timeLeft > 0) {
        STATE.timer.timeLeft--;
        updateTimerDisplay();
      } else {
        timerFinished();
      }
    }, 1000);
  }

  function stopTimer() {
    STATE.timer.isRunning = false;
    clearInterval(STATE.timer.intervalId);
    DOM.toggleTimerBtn.textContent = 'Start Focus';
    DOM.toggleTimerBtn.classList.replace('btn-secondary', 'btn-primary');
    document.title = 'DevPulse — Modern Developer Hub';
  }

  function timerFinished() {
    stopTimer();
    playChime();

    if (STATE.timer.mode === 'pomodoro') {
      STATE.timer.sessionsCompleted++;
      localStorage.setItem('devpulse_pomodoro_count', STATE.timer.sessionsCompleted);
      updateDashboardStats();
      showToast('🎉 Focus session completed! Great work.', 'success');
      switchTimerMode('shortBreak');
    } else {
      showToast('Break finished! Ready to focus?', 'info');
      switchTimerMode('pomodoro');
    }

    if (DOM.autoStartToggle.checked) {
      startTimer();
    }
  }

  DOM.toggleTimerBtn.addEventListener('click', () => {
    if (STATE.timer.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  DOM.resetTimerBtn.addEventListener('click', () => {
    stopTimer();
    STATE.timer.timeLeft = STATE.timer.durations[STATE.timer.mode];
    updateTimerDisplay();
    showToast('Timer reset');
  });

  DOM.skipTimerBtn.addEventListener('click', () => {
    stopTimer();
    if (STATE.timer.mode === 'pomodoro') {
      switchTimerMode('shortBreak');
    } else {
      switchTimerMode('pomodoro');
    }
  });

  // Pleasant Web Audio Chime (Zero external mp3 needed!)
  function playChime() {
    if (!DOM.soundToggle.checked) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.65);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  /* ========================================================
     Dashboard Metrics & Canvas Chart
     ======================================================== */
  function updateDashboardStats() {
    const doneTasks = STATE.tasks.filter(t => t.status === 'done').length;
    DOM.statCompletedTasks.textContent = doneTasks;

    const totalMinutes = STATE.timer.sessionsCompleted * 25;
    const hours = (totalMinutes / 60).toFixed(1);
    DOM.statFocusTime.textContent = `${hours}h`;
    DOM.statSessionsDone.textContent = `${STATE.timer.sessionsCompleted} completed pomodoros`;
  }

  function renderChart() {
    const canvas = DOM.productivityChart;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 500;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const isDark = STATE.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#8b949e' : '#656d76';
    const accentColor = isDark ? '#58a6ff' : '#0969da';
    const gradientFill = ctx.createLinearGradient(0, 0, 0, height);
    gradientFill.addColorStop(0, isDark ? 'rgba(88, 166, 255, 0.35)' : 'rgba(9, 105, 218, 0.25)');
    gradientFill.addColorStop(1, 'rgba(88, 166, 255, 0.0)');

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [2.5, 4.0, 3.2, 5.5, 4.8, 6.2, 3.8]; // Focus hours

    ctx.clearRect(0, 0, width, height);

    // Draw horizontal grid lines
    const padding = { top: 20, bottom: 40, left: 40, right: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = (8 - i * 2) + 'h';
      ctx.fillStyle = textColor;
      ctx.font = '11px monospace';
      ctx.fillText(val, 8, y + 4);
    }

    // Calculate points
    const maxVal = 8;
    const points = data.map((val, idx) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * idx;
      const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, val };
    });

    // Draw gradient area
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach((pt, idx) => {
      if (idx === 0) ctx.lineTo(pt.x, pt.y);
      else {
        const prev = points[idx - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradientFill;
    ctx.fill();

    // Draw stroke line
    ctx.beginPath();
    points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else {
        const prev = points[idx - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw dots and day labels
    points.forEach((pt, idx) => {
      // Circle
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = isDark ? '#161b22' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Day text
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(days[idx], pt.x, height - 14);
    });
  }

  window.addEventListener('resize', () => {
    if (STATE.activeTab === 'dashboard') renderChart();
  });

  /* ========================================================
     Developer Toolbox
     ======================================================== */
  // JSON Formatter
  DOM.formatJsonBtn.addEventListener('click', () => {
    try {
      const val = DOM.jsonInput.value.trim();
      if (!val) {
        DOM.jsonFeedback.className = 'tool-feedback';
        DOM.jsonFeedback.textContent = 'Status: Please enter some JSON first.';
        return;
      }
      const parsed = JSON.parse(val);
      DOM.jsonInput.value = JSON.stringify(parsed, null, 2);
      DOM.jsonFeedback.className = 'tool-feedback success';
      DOM.jsonFeedback.textContent = 'Status: Valid JSON formatted successfully!';
      showToast('JSON beautified', 'success');
    } catch (err) {
      DOM.jsonFeedback.className = 'tool-feedback error';
      DOM.jsonFeedback.textContent = `Error: ${err.message}`;
    }
  });

  DOM.minifyJsonBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(DOM.jsonInput.value);
      DOM.jsonInput.value = JSON.stringify(parsed);
      DOM.jsonFeedback.className = 'tool-feedback success';
      DOM.jsonFeedback.textContent = 'Status: Valid JSON minified!';
    } catch (err) {
      DOM.jsonFeedback.className = 'tool-feedback error';
      DOM.jsonFeedback.textContent = `Error: ${err.message}`;
    }
  });

  DOM.sampleJsonBtn.addEventListener('click', () => {
    const sample = {
      app: "DevPulse",
      version: "1.0.0",
      deployed_on: "GitHub Pages",
      features: ["Kanban", "Pomodoro", "Toolbox"],
      config: {
        theme: "dark",
        offline_ready: true
      }
    };
    DOM.jsonInput.value = JSON.stringify(sample, null, 2);
    DOM.jsonFeedback.className = 'tool-feedback success';
    DOM.jsonFeedback.textContent = 'Status: Sample JSON loaded.';
  });

  // Base64
  DOM.encodeBase64Btn.addEventListener('click', () => {
    try {
      const str = DOM.base64Input.value;
      const encoded = btoa(unescape(encodeURIComponent(str)));
      DOM.base64Input.value = encoded;
      DOM.base64Feedback.className = 'tool-feedback success';
      DOM.base64Feedback.textContent = 'Status: Encoded to Base64.';
      showToast('Encoded to Base64');
    } catch (e) {
      DOM.base64Feedback.className = 'tool-feedback error';
      DOM.base64Feedback.textContent = `Error: ${e.message}`;
    }
  });

  DOM.decodeBase64Btn.addEventListener('click', () => {
    try {
      const str = DOM.base64Input.value.trim();
      const decoded = decodeURIComponent(escape(atob(str)));
      DOM.base64Input.value = decoded;
      DOM.base64Feedback.className = 'tool-feedback success';
      DOM.base64Feedback.textContent = 'Status: Decoded from Base64.';
      showToast('Decoded from Base64');
    } catch (e) {
      DOM.base64Feedback.className = 'tool-feedback error';
      DOM.base64Feedback.textContent = `Error: Invalid Base64 string (${e.message})`;
    }
  });

  DOM.clearBase64Btn.addEventListener('click', () => {
    DOM.base64Input.value = '';
    DOM.base64Feedback.className = 'tool-feedback';
    DOM.base64Feedback.textContent = 'Status: Cleared.';
  });

  // UUID Generator
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function renderUuids() {
    DOM.uuidList.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const uuid = generateUUID();
      const item = document.createElement('div');
      item.className = 'uuid-item';
      item.innerHTML = `
        <span>${uuid}</span>
        <button class="btn btn-small btn-secondary copy-uuid-btn" data-uuid="${uuid}">Copy</button>
      `;
      DOM.uuidList.appendChild(item);
    }

    DOM.uuidList.querySelectorAll('.copy-uuid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-uuid');
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 1500);
          showToast('UUID copied to clipboard');
        });
      });
    });
  }

  DOM.generateUuidBtn.addEventListener('click', renderUuids);

  // URL Encoder / Decoder
  DOM.urlEncodeBtn.addEventListener('click', () => {
    const val = DOM.urlInput.value;
    DOM.urlInput.value = encodeURIComponent(val);
    DOM.urlFeedback.className = 'tool-feedback success';
    DOM.urlFeedback.textContent = 'Status: URL encoded.';
  });

  DOM.urlDecodeBtn.addEventListener('click', () => {
    try {
      const val = DOM.urlInput.value;
      DOM.urlInput.value = decodeURIComponent(val);
      DOM.urlFeedback.className = 'tool-feedback success';
      DOM.urlFeedback.textContent = 'Status: URL decoded.';
    } catch (e) {
      DOM.urlFeedback.className = 'tool-feedback error';
      DOM.urlFeedback.textContent = `Error: ${e.message}`;
    }
  });

  /* ========================================================
     Projects Showcase
     ======================================================== */
  function renderProjects(filter = 'all') {
    DOM.projectsGrid.innerHTML = '';
    const filtered = STATE.projects.filter(p => filter === 'all' || p.type === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div class="project-icon">${p.icon}</div>
          <span class="project-badge ${p.type}">${p.type.toUpperCase()}</span>
        </div>
        <h4 class="project-title">${escapeHtml(p.title)}</h4>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
        <div class="project-tech">
          ${p.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <button class="btn btn-secondary btn-small" style="margin-top: auto;" onclick="alert('Viewing demo for: ${p.title}')">
          View Demo →
        </button>
      `;
      DOM.projectsGrid.appendChild(card);
    });
  }

  DOM.projectFilterPills.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.projectFilterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderProjects(pill.getAttribute('data-filter'));
    });
  });

  /* ========================================================
     Utility Helpers
     ======================================================== */
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ========================================================
     Initial App Boot
     ======================================================== */
  function init() {
    applyTheme(STATE.theme);
    setRandomQuote();
    renderTasks();
    updateTimerDisplay();
    renderUuids();
    renderProjects('all');
    updateDashboardStats();
    setTimeout(renderChart, 100);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
