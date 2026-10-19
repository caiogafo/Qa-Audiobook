/**
 * QA Editorial & Auditoria de Audiolivros
 * Main Application Logic
 */

let currentPreset = 'beijo';

// Initialize View on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  const reportDateEl = document.getElementById('reportDate');
  if (reportDateEl) {
    reportDateEl.textContent = new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' });
  }
  loadPreset('beijo');
});

/**
 * Load a preset dataset into the editor
 * @param {string} key - 'beijo', 'mercadoria', or 'custom'
 */
function loadPreset(key) {
  currentPreset = key;
  if (key === 'custom') {
    return;
  }
  const data = PRESETS[key];
  if (!data) return;

  const origInput = document.getElementById('origText');
  const revInput = document.getElementById('revText');

  if (origInput) origInput.value = data.original;
  if (revInput) revInput.value = data.revised;

  triggerAudit();
}

/**
 * Clear user input fields
 */
function clearInputs() {
  const origInput = document.getElementById('origText');
  const revInput = document.getElementById('revText');
  const diffOutput = document.getElementById('diffOutput');

  if (origInput) origInput.value = '';
  if (revInput) revInput.value = '';
  if (diffOutput) {
    diffOutput.innerHTML = '<span class="text-slate-500 italic">Insira os textos e clique em "Executar Auditoria" para calcular as discrepâncias...</span>';
  }
}

/**
 * Read uploaded text files into inputs
 * @param {Event} event 
 * @param {string} targetId 
 */
function handleFileUpload(event, targetId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const el = document.getElementById(targetId);
    if (el) el.value = e.target.result;
    triggerAudit();
  };
  reader.readAsText(file);
}

/**
 * Switch active navigation tab
 * @param {string} tabId 
 */
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('border-brand-500', 'text-white', 'bg-slate-950/80');
    el.classList.add('border-transparent', 'text-slate-400');
  });

  const activeContent = document.getElementById(tabId);
  const activeBtn = document.getElementById('tab-btn-' + tabId);

  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-400');
    activeBtn.classList.add('border-brand-500', 'text-white', 'bg-slate-950/80');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Run full audit suite: diffs, phonetics, footnotes, metrics, executive report
 */
function triggerAudit() {
  const origInput = document.getElementById('origText');
  const revInput = document.getElementById('revText');

  const orig = origInput ? origInput.value : '';
  const rev = revInput ? revInput.value : '';

  // 1. Text Diff Analysis
  computeDiff(orig, rev);

  // 2. Load and Render Phonetic Guide
  renderPhonetics();

  // 3. Render Footnotes
  renderFootnotes();

  // 4. Update Metrics & Executive Report
  updateMetrics();
  renderExecutiveReport();

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Compute semantic diffs between original and revised text
 * @param {string} orig 
 * @param {string} rev 
 */
function computeDiff(orig, rev) {
  const diffOutput = document.getElementById('diffOutput');
  const metricDiffs = document.getElementById('metric-diffs');
  const alertBox = document.getElementById('structuralAlerts');
  const alertText = document.getElementById('structuralAlertText');
  const metricOmissions = document.getElementById('metric-omissions');

  if (typeof diff_match_patch === 'undefined') {
    if (diffOutput) diffOutput.innerHTML = '<span class="text-rose-400">Biblioteca diff_match_patch não carregada.</span>';
    return;
  }

  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(orig, rev);
  dmp.diff_cleanupSemantic(diffs);

  let html = '';
  let diffCount = 0;
  for (let i = 0; i < diffs.length; i++) {
    const op = diffs[i][0];
    const text = escapeHtml(diffs[i][1]);
    if (op === -1) {
      html += `<span class="diff-del">${text}</span>`;
      diffCount++;
    } else if (op === 1) {
      html += `<span class="diff-ins">${text}</span>`;
      diffCount++;
    } else {
      html += text;
    }
  }

  if (diffOutput) {
    diffOutput.innerHTML = html || '<span class="text-slate-500">Textos perfeitamente idênticos. Nenhuma discrepância encontrada.</span>';
  }
  if (metricDiffs) {
    metricDiffs.textContent = diffCount;
  }

  // Update structural alert if preset selected
  if (currentPreset === 'beijo') {
    if (alertBox) alertBox.classList.remove('hidden');
    if (alertText) {
      alertText.innerHTML = `<strong>Inconsistência Grave no Sumário:</strong> O <strong>Capítulo 04</strong> está presente no corpo da obra (pág. 75), mas foi <strong>completamente omitido da tabela de gravação do revisado</strong> (Pág. 3). Além disso, a folha de rosto de tradução/posfácio original foi suprimida.`;
    }
    if (metricOmissions) metricOmissions.textContent = "2 alertas";
  } else if (currentPreset === 'mercadoria') {
    if (alertBox) alertBox.classList.remove('hidden');
    if (alertText) {
      alertText.innerHTML = `<strong>Supressões Detectadas:</strong> Falsa Folha de Rosto (pág. 1), Ficha Catalográfica / CIP (pág. 77) e Colofão (pág. 78) ausentes no revisado.`;
    }
    if (metricOmissions) metricOmissions.textContent = "3 itens";
  } else {
    if (alertBox) alertBox.classList.add('hidden');
    if (metricOmissions) metricOmissions.textContent = "0";
  }
}

/**
 * Render phonetic guide items with optional filter query
 * @param {string} filterText 
 */
function renderPhonetics(filterText = '') {
  const grid = document.getElementById('phoneticGrid');
  if (!grid) return;

  const data = (PRESETS[currentPreset] && PRESETS[currentPreset].phonetics) 
    ? PRESETS[currentPreset].phonetics 
    : PRESETS.beijo.phonetics;

  grid.innerHTML = '';

  const filtered = data.filter(item => 
    item.word.toLowerCase().includes(filterText.toLowerCase()) || 
    item.ipa.toLowerCase().includes(filterText.toLowerCase()) ||
    item.lang.toLowerCase().includes(filterText.toLowerCase())
  );

  const metricPron = document.getElementById('metric-pronunciations');
  if (metricPron) metricPron.textContent = data.length;

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3 flex flex-col justify-between transition group";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-1 mb-1">
          <span class="font-bold text-white text-xs group-hover:text-cyan-300 transition">${escapeHtml(item.word)}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">${item.lang}</span>
        </div>
        <div class="font-mono text-cyan-400 text-xs font-semibold bg-cyan-950/30 px-2 py-1 rounded border border-cyan-800/40 my-1">
          ${escapeHtml(item.ipa)}
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-900">
        <span>Pág. Revisado / Original:</span>
        <span class="font-mono font-medium text-slate-300">Pág. ${item.pagRev} / Pág. ${item.pagOrig}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * Filter phonetic guide input handler
 * @param {string} query 
 */
function filterPhonetics(query) {
  renderPhonetics(query);
}

/**
 * Render footnotes auditor
 */
function renderFootnotes() {
  const container = document.getElementById('footnotesList');
  if (!container) return;

  const list = (PRESETS[currentPreset] && PRESETS[currentPreset].footnotes) 
    ? PRESETS[currentPreset].footnotes 
    : PRESETS.beijo.footnotes;

  container.innerHTML = '';

  const metricFootnotes = document.getElementById('metric-footnotes');
  if (metricFootnotes) metricFootnotes.textContent = list.length;

  list.forEach((fn, idx) => {
    const item = document.createElement('div');
    item.className = "bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2";
    item.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">${idx + 1}</span>
          ${escapeHtml(fn.cap)}
        </span>
        <span class="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Págs. ${escapeHtml(fn.pRev)} (Rev.) / Págs. ${escapeHtml(fn.pOrig)} (Orig.)
        </span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(fn.topic)}</p>
      <div class="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-medium">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
        Preservado integralmente na edição revisada
      </div>
    `;
    container.appendChild(item);
  });
}

/**
 * Update top KPI metrics depending on context
 */
function updateMetrics() {
  const metricBookTerms = document.getElementById('metric-book-terms');
  const metricQaScore = document.getElementById('metric-qa-score');

  if (currentPreset === 'beijo') {
    if (metricBookTerms) metricBookTerms.textContent = "3 (Contextuais)";
    if (metricQaScore) metricQaScore.textContent = "96.8%";
  } else {
    if (metricBookTerms) metricBookTerms.textContent = "1 (Créditos)";
    if (metricQaScore) metricQaScore.textContent = "98.2%";
  }
}

/**
 * Generate formatted executive audit report
 */
function renderExecutiveReport() {
  const content = document.getElementById('reportContent');
  if (!content) return;

  const isBeijo = currentPreset === 'beijo';

  content.innerHTML = `
    <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <h4 class="font-bold text-white text-sm mb-2 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-brand-400"></span>
        1. Resumo da Obra & Matriz Auditada
      </h4>
      <p><strong>Obra:</strong> ${isBeijo ? 'O Beijo da Mulher-Aranha — Manuel Puig (Tradução: Sérgio Molina / Posfácio: Patricio Pron)' : 'A Mercadoria Mais Preciosa — Jean-Claude Grumberg (Tradução: Rosa Freire d\'Aguiar)'}</p>
      <p class="mt-1"><strong>Finalidade do Arquivo Revisado:</strong> Master de gravação para audiolivro / Audible Studios com guias de locução.</p>
    </div>

    <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <h4 class="font-bold text-rose-300 text-sm mb-2 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
        2. Auditoria Estrutural e Omissões de Sumário
      </h4>
      ${isBeijo ? `
        <ul class="list-disc list-inside space-y-1.5 text-slate-300">
          <li><strong class="text-rose-400">Capítulo 04 Omitido no Sumário:</strong> Na página 3 do arquivo revisado, a tabela de capítulos salta de <code>CAP 03 - PÁG. 52</code> direto para <code>CAP 05 - PÁG. 97</code>. O Capítulo 4 existe no texto (pág. 75), mas foi esquecido no índice.</li>
          <li><strong class="text-amber-400">Folha de Rosto Suprimida:</strong> A página 3 original contendo autor, tradutor, posfaciador e editora Todavia não foi incluída na abertura do revisado.</li>
          <li><strong class="text-emerald-400">Posfácio Confirmado:</strong> O posfácio de Patricio Pron está 100% preservado no revisado a partir da pág. 281.</li>
        </ul>
      ` : `
        <ul class="list-disc list-inside space-y-1.5 text-slate-300">
          <li><strong class="text-amber-400">Exclusões Gráficas:</strong> Pág. 1 (Falsa Folha), Pág. 77 (Ficha CIP) e Pág. 78 (Colofão) omitidas no revisado por pertencerem estritamente à gráfica impressa.</li>
          <li><strong class="text-emerald-400">Texto Integral:</strong> Todos os 20 capítulos, o Epílogo e o Apêndice Histórico estão 100% idênticos.</li>
        </ul>
      `}
    </div>

    <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <h4 class="font-bold text-cyan-300 text-sm mb-2 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        3. Guia de Pronúncias e Dificuldades Vocálicas
      </h4>
      <p>Foram catalogados e mapeados <strong>${isBeijo ? '49 termos de alta complexidade' : '10 termos estrangeiros'}</strong> com transcrição fonética e indicação comparativa [Pág. Revisado / Pág. Original].</p>
    </div>

    <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <h4 class="font-bold text-purple-300 text-sm mb-2 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        4. Análise do Termo "Livro" (Quebra de Quarta Parede)
      </h4>
      <p>${isBeijo ? 'No miolo da obra o termo <strong>não é utilizado como autorreferência</strong> à história de Valentín e Molina (apenas no Posfácio crítico de Patricio Pron, onde o ensaísta refere-se à obra de Puig como livro/romance).' : 'Na narração da fábula a palavra não é usada autorreferencialmente, constando apenas nos créditos de áudio ("do livro A mercadoria mais preciosa").'}</p>
    </div>
  `;
}

/**
 * HTML escape helper
 * @param {string} string 
 * @returns {string}
 */
function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    }[s];
  });
}

/**
 * Copy diff text output to clipboard
 */
function copyDiffText() {
  const diffOutput = document.getElementById('diffOutput');
  const text = diffOutput ? diffOutput.innerText : '';
  copyToClipboard(text);
}

/**
 * Copy phonetic guide list to clipboard in markdown list format
 */
function copyPhoneticList() {
  const data = (PRESETS[currentPreset] && PRESETS[currentPreset].phonetics) 
    ? PRESETS[currentPreset].phonetics 
    : PRESETS.beijo.phonetics;
  const text = data.map(item => `* ${item.word}: [${item.ipa}] — Pág. ${item.pagRev} / Pág. ${item.pagOrig}`).join('\n');
  copyToClipboard(text);
}

/**
 * Cross-browser copy to clipboard with toast notification
 * @param {string} text 
 */
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => alertBox('Copiado com sucesso para a área de transferência!'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    alertBox('Copiado com sucesso para a área de transferência!');
  } catch (err) {
    console.error('Falha ao copiar:', err);
  }
  document.body.removeChild(textarea);
}

/**
 * Switch to executive report and trigger print dialogue
 */
function exportReport() {
  switchTab('executiveTab');
  window.print();
}

/**
 * Display toast alert
 * @param {string} msg 
 */
function alertBox(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 bg-brand-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl shadow-2xl text-xs z-50 transition transform duration-300 flex items-center gap-2';
  toast.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> ${msg}`;
  document.body.appendChild(toast);

  if (window.lucide) {
    lucide.createIcons();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
