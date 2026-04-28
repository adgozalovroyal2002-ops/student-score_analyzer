// ============================================================
// Student Score Analyzer — app.js
// ============================================================

function getGrade(pct) {
    if (pct >= 90) return { letter: 'A', cls: 'g-a', fill: 'fill-a', label: 'Əla' };
    if (pct >= 75) return { letter: 'B', cls: 'g-b', fill: 'fill-b', label: 'Yaxşı' };
    if (pct >= 60) return { letter: 'C', cls: 'g-c', fill: 'fill-c', label: 'Kafi' };
    if (pct >= 50) return { letter: 'D', cls: 'g-d', fill: 'fill-d', label: 'Zəif' };
    return { letter: 'F', cls: 'g-f', fill: 'fill-f', label: 'Qeyri-kafi' };
  }
  
  function parseInput(raw, max) {
    const lines = raw.trim().split('\n');
    const students = [];
    const errors = [];
  
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return;
  
      // Support both comma and space as separator for last token being number
      const lastComma = trimmed.lastIndexOf(',');
      if (lastComma === -1) {
        errors.push(`Sətir ${i+1}: vergül tapılmadı — "${trimmed}"`);
        return;
      }
  
      const name = trimmed.slice(0, lastComma).trim();
      const scoreStr = trimmed.slice(lastComma + 1).trim();
      const score = parseFloat(scoreStr);
  
      if (!name) { errors.push(`Sətir ${i+1}: ad boşdur`); return; }
      if (isNaN(score)) { errors.push(`Sətir ${i+1}: bal rəqəm deyil — "${scoreStr}"`); return; }
      if (score < 0 || score > max) { errors.push(`Sətir ${i+1}: bal 0–${max} arasında olmalıdır`); return; }
  
      students.push({ name, score });
    });
  
    return { students, errors };
  }
  
  function analyze() {
    const rawInput = document.getElementById('studentInput').value;
    const maxScore = parseFloat(document.getElementById('maxScore').value) || 100;
    const testName = document.getElementById('testName').value.trim();
  
    if (!rawInput.trim()) {
      alert('Zəhmət olmasa, şagird məlumatlarını daxil edin.');
      return;
    }
  
    const { students, errors } = parseInput(rawInput, maxScore);
  
    if (errors.length > 0) {
      alert('Xəta(lar) aşkarlandı:\n\n' + errors.join('\n') + '\n\nDüzəldin və yenidən cəhd edin.');
      return;
    }
  
    if (students.length === 0) {
      alert('Heç bir şagird məlumatı tapılmadı.');
      return;
    }
  
    // Sort by score descending
    students.sort((a, b) => b.score - a.score);
  
    // Compute stats
    const scores = students.map(s => s.score);
    const n = scores.length;
    const avg = scores.reduce((a, b) => a + b, 0) / n;
    const maxS = Math.max(...scores);
    const minS = Math.min(...scores);
    const passCount = scores.filter(s => (s / maxScore) * 100 >= 50).length;
    const passRate = ((passCount / n) * 100).toFixed(1);
  
    // Median
    const sorted = [...scores].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  
    // Grade distribution
    const gradeDist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    students.forEach(s => {
      const pct = (s.score / maxScore) * 100;
      gradeDist[getGrade(pct).letter]++;
    });
  
    // Render stats cards
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';
  
    const cards = [
      { label: 'Şagird sayı', value: n, sub: 'nəfər' },
      { label: 'Orta bal',    value: avg.toFixed(1), sub: `/ ${maxScore}` },
      { label: 'Mediana',     value: median.toFixed(1), sub: `/ ${maxScore}` },
      { label: 'Ən yüksək',   value: maxS, sub: `/ ${maxScore}`, color: 'var(--accent2)' },
      { label: 'Ən aşağı',    value: minS, sub: `/ ${maxScore}`, color: 'var(--accent3)' },
      { label: 'Keçən',       value: passRate + '%', sub: `${passCount} / ${n} nəfər`, color: passRate >= 60 ? 'var(--accent2)' : 'var(--accent3)' },
    ];
  
    cards.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.style.animationDelay = (i * 0.06) + 's';
      card.innerHTML = `
        <div class="stat-label">${c.label}</div>
        <div class="stat-value" ${c.color ? `style="color:${c.color}"` : ''}>${c.value}</div>
        <div class="stat-sub">${c.sub}</div>
      `;
      statsGrid.appendChild(card);
    });
  
    // Render grade bars
    const gradeBars = document.getElementById('gradeBars');
    gradeBars.innerHTML = '';
  
    const gradeConfig = [
      { key: 'A', label: 'A — Əla (≥90%)',      cls: 'fill-a' },
      { key: 'B', label: 'B — Yaxşı (75–89%)',   cls: 'fill-b' },
      { key: 'C', label: 'C — Kafi (60–74%)',     cls: 'fill-c' },
      { key: 'D', label: 'D — Zəif (50–59%)',     cls: 'fill-d' },
      { key: 'F', label: 'F — Qeyri-kafi (<50%)', cls: 'fill-f' },
    ];
  
    gradeConfig.forEach((g, i) => {
      const cnt = gradeDist[g.key];
      const widthPct = n > 0 ? (cnt / n) * 100 : 0;
  
      const row = document.createElement('div');
      row.className = 'grade-row';
      row.style.animationDelay = (i * 0.08) + 's';
      row.innerHTML = `
        <div class="grade-label">${g.key}</div>
        <div class="grade-track">
          <div class="grade-fill ${g.cls}" style="width: 0%"
               data-target="${widthPct.toFixed(1)}"></div>
        </div>
        <div class="grade-count">${cnt}</div>
      `;
      gradeBars.appendChild(row);
  
      // Animate fill after paint
      setTimeout(() => {
        const fill = row.querySelector('.grade-fill');
        fill.style.width = widthPct.toFixed(1) + '%';
      }, 80 + i * 80);
    });
  
    // Render histogram (10 buckets: 0-9, 10-19, ..., 90-100)
    const histogram = document.getElementById('histogram');
    histogram.innerHTML = '';
  
    const buckets = Array(10).fill(0);
    students.forEach(s => {
      const pct = (s.score / maxScore) * 100;
      const idx = Math.min(Math.floor(pct / 10), 9);
      buckets[idx]++;
    });
  
    const maxBucket = Math.max(...buckets, 1);
  
    buckets.forEach((cnt, i) => {
      const heightPct = (cnt / maxBucket) * 100;
      const wrap = document.createElement('div');
      wrap.className = 'hist-bar-wrap';
      wrap.title = `${i*10}–${i===9?'100':i*10+9}%: ${cnt} şagird`;
      wrap.innerHTML = `
        <div class="hist-bar" style="height: ${Math.max(heightPct, cnt>0?8:4)}%"></div>
        <div class="hist-label">${i*10}${i===9?'+':''}</div>
      `;
      histogram.appendChild(wrap);
    });
  
    // Render table
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
  
    students.forEach((s, i) => {
      const pct = (s.score / maxScore) * 100;
      const grade = getGrade(pct);
      const pass = pct >= 50;
  
      const tr = document.createElement('tr');
      tr.style.animationDelay = (i * 0.04) + 's';
      tr.innerHTML = `
        <td class="rank-num">${i + 1}</td>
        <td class="student-name">${escapeHtml(s.name)}</td>
        <td class="score-cell">${s.score}</td>
        <td class="pct-cell">${pct.toFixed(1)}%</td>
        <td><span class="grade-badge ${grade.cls}">${grade.letter} — ${grade.label}</span></td>
        <td class="${pass ? 'status-pass' : 'status-fail'}">${pass ? '✓ Keçdi' : '✗ Qaldı'}</td>
      `;
      tableBody.appendChild(tr);
    });
  
    // Show results
    document.getElementById('emptyState').style.display = 'none';
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('hidden');
    resultsEl.style.animation = 'none';
    void resultsEl.offsetWidth;
    resultsEl.style.animation = 'slideUp 0.5s ease';
  }
  
  function clearAll() {
    document.getElementById('studentInput').value = '';
    document.getElementById('testName').value = '';
    document.getElementById('maxScore').value = '100';
    document.getElementById('results').classList.add('hidden');
    document.getElementById('emptyState').style.display = '';
  }
  
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }