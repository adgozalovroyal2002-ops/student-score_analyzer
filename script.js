function getGrade(pct) {
    if (pct >= 90) return { letter: 'A', cls: 'g-a', fill: 'fill-a', label: 'Əla' };
    if (pct >= 75) return { letter: 'B', cls: 'g-b', fill: 'fill-b', label: 'Yaxşı' };
    if (pct >= 60) return { letter: 'C', cls: 'g-c', fill: 'fill-c', label: 'Kafi' };
    if (pct >= 50) return { letter: 'D', cls: 'g-d', fill: 'fill-d', label: 'Zəif' };
  
    return { letter: 'F', cls: 'g-f', fill: 'fill-f', label: 'Qeyri-kafi' };
  }
  
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  function clearAll() {
    document.getElementById('studentInput').value = '';
    document.getElementById('testName').value = '';
    document.getElementById('maxScore').value = '100';
  
    document.getElementById('results').classList.add('hidden');
    document.getElementById('emptyState').style.display = '';
  }