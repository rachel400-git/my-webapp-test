/**
 * DevPulse - לוגיקת האפליקציה הראשית (עברית & RTL מלא)
 * Vanilla JavaScript (ES6+), ללא ספריות חיצוניות, תמיכה מלאה באופליין
 */

(function () {
  'use strict';

  // ניהול מצב האפליקציה (State)
  const STATE = {
    theme: localStorage.getItem('devpulse_theme') || 'dark',
    activeTab: 'dashboard',
    // משימות ברירת מחדל בעברית
    tasks: JSON.parse(localStorage.getItem('devpulse_tasks_v2')) || [
      {
        id: 'task-1',
        title: 'בדיקת האפליקציה בסביבה מקומית',
        desc: 'בדיקת תצוגה מקדימה, מעבר בין לשוניות ואימות תקינות RTL.',
        status: 'in-progress',
        priority: 'high',
        tag: 'בדיקות'
      },
      {
        id: 'task-2',
        title: 'פריסת DevPulse ב-GitHub Pages',
        desc: 'דחיפת השינויים לגיטהאב לאחר אישור הבדיקה המקומית.',
        status: 'todo',
        priority: 'high',
        tag: 'DevOps'
      },
      {
        id: 'task-3',
        title: 'בדיקת כלי הפיתוח בארגז הכלים',
        desc: 'בדיקת מעצב ה-JSON, מקודד Base64 ומחולל ה-UUID.',
        status: 'todo',
        priority: 'medium',
        tag: 'ארגז כלים'
      },
      {
        id: 'task-4',
        title: 'סשן עבודה ממוקד של 25 דקות',
        desc: 'שימוש בטיימר הפומודורו המובנה עם צליל התראה מלודי.',
        status: 'todo',
        priority: 'low',
        tag: 'פרודוקטיביות'
      },
      {
        id: 'task-5',
        title: 'המרת הממשק לעברית מלאה (RTL)',
        desc: 'תרגום מלא של כל הרכיבים, התאמת עיצוב ימין-שמאל ופונט רוביק.',
        status: 'done',
        priority: 'high',
        tag: 'עיצוב'
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
        title: 'מרכז המפתחים DevPulse',
        desc: 'לוח בקרה אינטראקטיבי למפתחים עם טיימר פומודורו, לוח משימות קנבן וארגז כלים.',
        type: 'web',
        icon: '⚡',
        tech: ['Vanilla JS', 'CSS Grid', 'GitHub Pages'],
        demoUrl: '#'
      },
      {
        title: 'מנוע עיבוד תמונה CloudCanvas',
        desc: 'מיקרו-שירות מהיר לעיבוד תמונה בזמן אמת המבוסס על WebAssembly.',
        type: 'tool',
        icon: '🎨',
        tech: ['Rust', 'Wasm', 'TypeScript'],
        demoUrl: '#'
      },
      {
        title: 'סטודיו SyntaxFlow',
        desc: 'סטודיו מתקדם בדפדפן ליצירת אנימציות של קטעי קוד ותצוגה מקדימה שיתופית.',
        type: 'web',
        icon: '✨',
        tech: ['WebAudio', 'Canvas', 'HTML5'],
        demoUrl: '#'
      },
      {
        title: 'מסד נתונים NanoStore DB',
        desc: 'מסד נתונים קל-משקל ומהיר בזיכרון המקומי ללא תלויות חיצוניות כלל.',
        type: 'demo',
        icon: '📦',
        tech: ['JavaScript', 'JSON', 'IndexedDB'],
        demoUrl: '#'
      }
    ],
    quotes: [
      { text: "קודם כל פתור את הבעיה. רק לאחר מכן, כתוב את הקוד.", author: "ג'ון ג'ונסון" },
      { text: "פשטות היא תנאי מוקדם והכרחי לאמינות.", author: "אדסחר דייקסטרה" },
      { text: "גרום לזה לעבוד, גרום לזה להיות נכון, גרום לזה להיות מהיר.", author: "קנט בק" },
      { text: "קוד הוא כמו הומור. אם צריך להסביר אותו, הוא כנראה לא טוב.", author: "קורי האוס" },
      { text: "קוד נקי תמיד נראה כאילו נכתב על ידי מישהו שאכפת לו.", author: "מייקל פת'רס" },
      { text: "כל טיפש יכול לכתוב קוד שמחשב מבין. מתכנתים טובים כותבים קוד שבני אדם מבינים.", author: "מרטין פאולר" }
    ]
  };

  // רכיבי DOM
  const DOM = {
    // ניווט ותפריטים
    navButtons: document.querySelectorAll('.nav-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    pageHeading: document.getElementById('pageHeading'),
    pageSubheading: document.getElementById('pageSubheading'),
    sidebar: document.querySelector('.sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    liveClock: document.getElementById('liveClock'),
    themeToggle: document.getElementById('themeToggle'),

    // לוח בקרה ומדדים
    statCompletedTasks: document.getElementById('statCompletedTasks'),
    statFocusTime: document.getElementById('statFocusTime'),
    statSessionsDone: document.getElementById('statSessionsDone'),
    statStreak: document.getElementById('statStreak'),
    totalTasksCount: document.getElementById('totalTasksCount'),
    quoteText: document.getElementById('quoteText'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    newQuoteBtn: document.getElementById('newQuoteBtn'),
    productivityChart: document.getElementById('productivityChart'),

    // קנבן (משימות)
    todoList: document.getElementById('todoList'),
    inProgressList: document.getElementById('inProgressList'),
    doneList: document.getElementById('doneList'),
    todoCount: document.getElementById('todoCount'),
    inProgressCount: document.getElementById('inProgressCount'),
    doneCount: document.getElementById('doneCount'),
    openAddTaskModalBtn: document.getElementById('openAddTaskModalBtn'),
    taskSearchInput: document.getElementById('taskSearchInput'),
    priorityFilter: document.getElementById('priorityFilter'),

    // מודאל יצירת/עריכת משימה
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

    // פומודורו (טיימר)
    timerModes: document.querySelectorAll('.timer-mode-btn'),
    timerProgressFill: document.getElementById('timerProgressFill'),
    timerCountdown: document.getElementById('timerCountdown'),
    timerLabel: document.getElementById('timerLabel'),
    toggleTimerBtn: document.getElementById('toggleTimerBtn'),
    resetTimerBtn: document.getElementById('resetTimerBtn'),
    skipTimerBtn: document.getElementById('skipTimerBtn'),
    soundToggle: document.getElementById('soundToggle'),
    autoStartToggle: document.getElementById('autoStartToggle'),

    // ארגז כלים
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

    // פרויקטים
    projectsGrid: document.getElementById('projectsGrid'),
    projectFilterPills: document.getElementById('projectFilterPills'),

    // התראות קופצות (Toasts)
    toastContainer: document.getElementById('toastContainer')
  };

  /* ========================================================
     מערכת התראות קופצות (Toasts)
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
     מערכת החלפת ערכות נושא (כהה / בהיר)
     ======================================================== */
  function updateThemeUI(theme) {
    const isBright = theme === 'light';
    const nextThemeLabel = isBright ? 'מצב כהה' : 'מצב בהיר';
    const nextThemeIcon = isBright ? '🌙' : '☀️';
    const sidebarText = isBright ? 'מעבר למצב כהה' : 'מעבר למצב בהיר';

    const headerIcon = document.getElementById('themeToggleIcon');
    const headerLabel = document.getElementById('themeToggleLabel');
    if (headerIcon) headerIcon.textContent = nextThemeIcon;
    if (headerLabel) headerLabel.textContent = nextThemeLabel;

    const sidebarIcon = document.getElementById('sidebarThemeIcon');
    const sidebarLabel = document.getElementById('sidebarThemeText');
    if (sidebarIcon) sidebarIcon.textContent = nextThemeIcon;
    if (sidebarLabel) sidebarLabel.textContent = sidebarText;
  }

  function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devpulse_theme', theme);
    updateThemeUI(theme);
    renderChart();
  }

  function toggleTheme() {
    const newTheme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(newTheme === 'light' ? '☀️ הוחלף למצב בהיר' : '🌙 הוחלף למצב כהה', 'info');
  }

  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener('click', toggleTheme);
  }

  const sidebarThemeBtn = document.getElementById('sidebarThemeToggle');
  if (sidebarThemeBtn) {
    sidebarThemeBtn.addEventListener('click', toggleTheme);
  }

  /* ========================================================
     שעון חי
     ======================================================== */
  function updateLiveClock() {
    const now = new Date();
    DOM.liveClock.textContent = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  /* ========================================================
     ניווט ומעבר בין לשוניות
     ======================================================== */
  const tabDescriptions = {
    dashboard: { title: 'לוח בקרה', sub: 'סקירת מערכת ומדדי פרודוקטיביות' },
    kanban: { title: 'לוח משימות', sub: 'ניהול, ארגון ותעדוף ספרינטים' },
    pomodoro: { title: 'טיימר ריכוז', sub: 'טיימר פומודורו עם צליל התראה מובנה' },
    tools: { title: 'ארגז כלים למפתחים', sub: 'מעצבים, מאמתים, מחוללים וממירי נתונים' },
    projects: { title: 'גלריית פרויקטים', sub: 'פרויקטים נבחרים, כלים ואבות-טיפוס' }
  };

  DOM.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
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
     מחולל ציטוטי השראה
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
     לוח משימות קנבן
     ======================================================== */
  function saveTasks() {
    localStorage.setItem('devpulse_tasks_v2', JSON.stringify(STATE.tasks));
    renderTasks();
    updateDashboardStats();
  }

  const priorityLabels = {
    high: 'גבוהה 🔥',
    medium: 'בינונית',
    low: 'נמוכה'
  };

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

      // ב-RTL קידום הוא שמאלה (←) והחזרה היא ימינה (→)
      card.innerHTML = `
        <div class="task-card-header">
          <div class="task-card-title">${escapeHtml(task.title)}</div>
        </div>
        ${task.desc ? `<div class="task-card-desc">${escapeHtml(task.desc)}</div>` : ''}
        <div class="task-card-footer">
          <span class="task-tag">${escapeHtml(task.tag || 'כללי')}</span>
          <span class="task-priority-badge ${task.priority}">${priorityLabels[task.priority] || task.priority}</span>
        </div>
        <div class="task-actions">
          ${task.status !== 'done' ? `<button class="task-action-btn" data-action="next" title="קדם שלב">קדם ←</button>` : ''}
          ${task.status !== 'todo' ? `<button class="task-action-btn" data-action="prev" title="החזר שלב">→ החזר</button>` : ''}
          <button class="task-action-btn" data-action="delete" style="color: var(--status-red);">מחק</button>
        </div>
      `;

      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);

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
    showToast('המשימה קודמה לשלב הבא');
  }

  function regressTask(id) {
    const task = STATE.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'done') task.status = 'in-progress';
    else if (task.status === 'in-progress') task.status = 'todo';
    saveTasks();
    showToast('המשימה הוחזרה לשלב הקודם');
  }

  function deleteTask(id) {
    STATE.tasks = STATE.tasks.filter(t => t.id !== id);
    saveTasks();
    showToast('המשימה נמחקה בהצלחה');
  }

  // גרירה ושחרור (Drag & Drop)
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
          showToast(`המשימה הועברה בהצלחה`);
        }
      }
    });
  });

  DOM.taskSearchInput.addEventListener('input', renderTasks);
  DOM.priorityFilter.addEventListener('change', renderTasks);

  // מודאל הוספת משימה
  DOM.openAddTaskModalBtn.addEventListener('click', () => {
    DOM.modalTitle.textContent = 'יצירת משימה חדשה';
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
      tag: DOM.taskCategoryInput.value.trim() || 'כללי',
      status: 'todo'
    };

    STATE.tasks.unshift(newTask);
    saveTasks();
    closeModal();
    showToast('המשימה נוספה בהצלחה', 'success');
  });

  /* ========================================================
     טיימר ריכוז (פומודורו)
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
    DOM.timerLabel.textContent = mode === 'pomodoro' ? 'הישאר ממוקד' : 'קח הפסקה קצרה למנוחה';
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
    DOM.toggleTimerBtn.textContent = 'השהה';
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
    DOM.toggleTimerBtn.textContent = 'הפעל ריכוז';
    DOM.toggleTimerBtn.classList.replace('btn-secondary', 'btn-primary');
    document.title = 'DevPulse — מרכז הפיתוח והפרודוקטיביות';
  }

  function timerFinished() {
    stopTimer();
    playChime();

    if (STATE.timer.mode === 'pomodoro') {
      STATE.timer.sessionsCompleted++;
      localStorage.setItem('devpulse_pomodoro_count', STATE.timer.sessionsCompleted);
      updateDashboardStats();
      showToast('🎉 סבב ריכוז הסתיים בהצלחה! עבודה מצוינת.', 'success');
      switchTimerMode('shortBreak');
    } else {
      showToast('ההפסקה הסתיימה! מוכנים לסבב ריכוז חדש?', 'info');
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
    showToast('הטיימר אופס');
  });

  DOM.skipTimerBtn.addEventListener('click', () => {
    stopTimer();
    if (STATE.timer.mode === 'pomodoro') {
      switchTimerMode('shortBreak');
    } else {
      switchTimerMode('pomodoro');
    }
  });

  // צליל מלודי נעים (Web Audio API - פועל בכל דפדפן ללא צורך בקובץ אודיו חיצוני)
  function playChime() {
    if (!DOM.soundToggle.checked) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
      console.warn('שגיאת אודיו', e);
    }
  }

  /* ========================================================
     מדדי לוח בקרה וגרף פעילות שבועי (HTML5 Canvas)
     ======================================================== */
  function updateDashboardStats() {
    const doneTasks = STATE.tasks.filter(t => t.status === 'done').length;
    DOM.statCompletedTasks.textContent = doneTasks;

    const totalMinutes = STATE.timer.sessionsCompleted * 25;
    const hours = (totalMinutes / 60).toFixed(1);
    DOM.statFocusTime.textContent = `${hours} שעות`;
    DOM.statSessionsDone.textContent = `${STATE.timer.sessionsCompleted} סבבי פומודורו שהושלמו`;
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
    const accentColor = isDark ? '#58a6ff' : '#2563eb';
    const gradientFill = ctx.createLinearGradient(0, 0, 0, height);
    gradientFill.addColorStop(0, isDark ? 'rgba(88, 166, 255, 0.35)' : 'rgba(37, 99, 235, 0.25)');
    gradientFill.addColorStop(1, 'rgba(88, 166, 255, 0.0)');

    // ימי השבוע בעברית (מימין לשמאל: א' עד שבת)
    const days = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    const data = [3.8, 6.2, 4.8, 5.5, 3.2, 4.0, 2.5]; // שעות ריכוז

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, bottom: 40, left: 30, right: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // קווי רשת אופקיים
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = (8 - i * 2) + ' שע׳';
      ctx.fillStyle = textColor;
      ctx.font = '11px Rubik, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val, width - 6, y + 4);
    }

    // חישוב נקודות
    const maxVal = 8;
    const points = data.map((val, idx) => {
      // ב-RTL הנקודות זורמות מימין לשמאל
      const x = (width - padding.right) - (chartWidth / (data.length - 1)) * idx;
      const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, val };
    });

    // מילוי שטח הגרף
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

    // ציור קו הגרף
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

    // נקודות ותוויות ימים
    points.forEach((pt, idx) => {
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isDark ? '#161b22' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '12px Rubik, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(days[idx], pt.x, height - 14);
    });
  }

  window.addEventListener('resize', () => {
    if (STATE.activeTab === 'dashboard') renderChart();
  });

  /* ========================================================
     ארגז כלים למפתחים
     ======================================================== */
  // מעצב ומאמת JSON
  DOM.formatJsonBtn.addEventListener('click', () => {
    try {
      const val = DOM.jsonInput.value.trim();
      if (!val) {
        DOM.jsonFeedback.className = 'tool-feedback';
        DOM.jsonFeedback.textContent = 'סטטוס: נא להזין מחרוזת JSON תחילה.';
        return;
      }
      const parsed = JSON.parse(val);
      DOM.jsonInput.value = JSON.stringify(parsed, null, 2);
      DOM.jsonFeedback.className = 'tool-feedback success';
      DOM.jsonFeedback.textContent = 'סטטוס: ה-JSON תקין ועוצב בהצלחה!';
      showToast('ה-JSON עוצב בהצלחה', 'success');
    } catch (err) {
      DOM.jsonFeedback.className = 'tool-feedback error';
      DOM.jsonFeedback.textContent = `שגיאת תחביר: ${err.message}`;
    }
  });

  DOM.minifyJsonBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(DOM.jsonInput.value);
      DOM.jsonInput.value = JSON.stringify(parsed);
      DOM.jsonFeedback.className = 'tool-feedback success';
      DOM.jsonFeedback.textContent = 'סטטוס: ה-JSON נדחס בהצלחה!';
      showToast('ה-JSON נדחס');
    } catch (err) {
      DOM.jsonFeedback.className = 'tool-feedback error';
      DOM.jsonFeedback.textContent = `שגיאה: ${err.message}`;
    }
  });

  DOM.sampleJsonBtn.addEventListener('click', () => {
    const sample = {
      app: "DevPulse",
      version: "1.0.0",
      language: "hebrew",
      rtl_enabled: true,
      features: ["לוח משימות", "טיימר פומודורו", "ארגז כלים למפתחים"],
      settings: {
        theme: STATE.theme,
        sound: true
      }
    };
    DOM.jsonInput.value = JSON.stringify(sample, null, 2);
    DOM.jsonFeedback.className = 'tool-feedback success';
    DOM.jsonFeedback.textContent = 'סטטוס: נתוני JSON לדוגמה נטענו.';
  });

  // Base64
  DOM.encodeBase64Btn.addEventListener('click', () => {
    try {
      const str = DOM.base64Input.value;
      const encoded = btoa(unescape(encodeURIComponent(str)));
      DOM.base64Input.value = encoded;
      DOM.base64Feedback.className = 'tool-feedback success';
      DOM.base64Feedback.textContent = 'סטטוס: הטקסט קודד בהצלחה ל-Base64.';
      showToast('קודד בהצלחה ל-Base64');
    } catch (e) {
      DOM.base64Feedback.className = 'tool-feedback error';
      DOM.base64Feedback.textContent = `שגיאה: ${e.message}`;
    }
  });

  DOM.decodeBase64Btn.addEventListener('click', () => {
    try {
      const str = DOM.base64Input.value.trim();
      const decoded = decodeURIComponent(escape(atob(str)));
      DOM.base64Input.value = decoded;
      DOM.base64Feedback.className = 'tool-feedback success';
      DOM.base64Feedback.textContent = 'סטטוס: המחרוזת פוענחה בהצלחה מ-Base64.';
      showToast('פוענח בהצלחה מ-Base64');
    } catch (e) {
      DOM.base64Feedback.className = 'tool-feedback error';
      DOM.base64Feedback.textContent = `שגיאה: מחרוזת Base64 אינה תקינה (${e.message})`;
    }
  });

  DOM.clearBase64Btn.addEventListener('click', () => {
    DOM.base64Input.value = '';
    DOM.base64Feedback.className = 'tool-feedback';
    DOM.base64Feedback.textContent = 'סטטוס: השדה נוקה.';
  });

  // מחולל UUID v4
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
        <span dir="ltr">${uuid}</span>
        <button class="btn btn-small btn-secondary copy-uuid-btn" data-uuid="${uuid}">העתק</button>
      `;
      DOM.uuidList.appendChild(item);
    }

    DOM.uuidList.querySelectorAll('.copy-uuid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-uuid');
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'הועתק!';
          setTimeout(() => btn.textContent = 'העתק', 1500);
          showToast('מזהה ה-UUID הועתק ללוח');
        });
      });
    });
  }

  DOM.generateUuidBtn.addEventListener('click', renderUuids);

  // מקודד ומפענח URL
  DOM.urlEncodeBtn.addEventListener('click', () => {
    const val = DOM.urlInput.value;
    DOM.urlInput.value = encodeURIComponent(val);
    DOM.urlFeedback.className = 'tool-feedback success';
    DOM.urlFeedback.textContent = 'סטטוס: הכתובת קודדה בהצלחה.';
    showToast('הכתובת קודדה');
  });

  DOM.urlDecodeBtn.addEventListener('click', () => {
    try {
      const val = DOM.urlInput.value;
      DOM.urlInput.value = decodeURIComponent(val);
      DOM.urlFeedback.className = 'tool-feedback success';
      DOM.urlFeedback.textContent = 'סטטוס: הכתובת פוענחה בהצלחה.';
      showToast('הכתובת פוענחה');
    } catch (e) {
      DOM.urlFeedback.className = 'tool-feedback error';
      DOM.urlFeedback.textContent = `שגיאה: ${e.message}`;
    }
  });

  /* ========================================================
     גלריית פרויקטים
     ======================================================== */
  const categoryLabels = {
    web: 'אפליקציית רשת',
    tool: 'כלי פיתוח',
    demo: 'דמו'
  };

  function renderProjects(filter = 'all') {
    DOM.projectsGrid.innerHTML = '';
    const filtered = STATE.projects.filter(p => filter === 'all' || p.type === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div class="project-icon">${p.icon}</div>
          <span class="project-badge ${p.type}">${categoryLabels[p.type] || p.type}</span>
        </div>
        <h4 class="project-title">${escapeHtml(p.title)}</h4>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
        <div class="project-tech">
          ${p.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <button class="btn btn-secondary btn-small" style="margin-top: auto;" onclick="alert('תצוגת דמו עבור: ${p.title}')">
          צפה בדמו ←
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
     פונקציות עזר
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
     אתחול האפליקציה (Init)
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
