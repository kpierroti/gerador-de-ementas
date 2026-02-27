const CFG = window.PUD_CONFIG;
if (!CFG) {
  throw new Error("PUD_CONFIG não encontrado. Verifique se data-config.js foi carregado antes do app.js");
}


// Config 
const { STORAGE_KEY, WEEKDAYS, BASE_DATA, PUD_AREA_LABEL } = CFG;

// Status
let courses = loadCourses(); // array de cursos
let editingId = null;

// Helpers
const el = (id) => document.getElementById(id);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function normalizeTitle(t) {
  return (t || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function isNonEmptyValue(v) {
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return v !== null && v !== undefined;
}

function mergeNonEmpty(existing, incoming) {
  const merged = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (key === "id") continue; // preserva id do existente
    if (isNonEmptyValue(value)) merged[key] = value;
  }
  return merged;
}

function loadCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCourses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

function linesToArray(text) {
  return (text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(s) {
  return (s ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelAudience(key) {
  return (
    {
      criancas: "Crianças",
      jovens_adultos: "Jovens e Adultos",
      seniors: "Seniors",
      nivelamento: "Nivelamento",
    }[key] || key
  );
}

function formatSchedule(course) {
  const days = (course.daysOfWeek || [])
    .map((d) => WEEKDAYS.find((w) => w.key === d)?.label)
    .filter(Boolean);

  const dayStr = days.length ? days.join(", ") : "—";
  const dateStr =
    course.startDate && course.endDate ? `${course.startDate} → ${course.endDate}` : "—";
  const timeStr =
    course.startTime && course.endTime ? `${course.startTime} → ${course.endTime}` : "—";

  return `${dayStr} | ${dateStr} | ${timeStr}`;
}

function requiredMissing(course) {
  const required = [
    ["title", "Título"],
    ["note", "Resumo curto (nota)"],
    ["objectives", "Objetivos"],
    ["workload", "Carga horária"],
    ["prereq", "Pré-requisitos"],
    ["syllabus", "Conteúdo programático"],
    ["daysOfWeek", "Dias da semana"],
    ["startDate", "Data de início"],
    ["endDate", "Data final"],
    ["startTime", "Horário início"],
    ["endTime", "Horário final"],
    ["materials", "Materiais"],
    ["format", "Formato"],
    ["audience", "Público"],
    ["area", "Área"],
    ["laneLabel", "Trilha (Lane)"],
  ];

  const missing = [];
  for (const [key, label] of required) {
    const v = course[key];
    const emptyArr = Array.isArray(v) && v.length === 0;
    const emptyStr = typeof v === "string" && !v.trim();
    if (v == null || emptyArr || emptyStr) missing.push(label);
  }
  return missing;
}

// Dias da semana
function renderWeekdays() {
  const box = el("weekdayBox");
  box.innerHTML = "";

  WEEKDAYS.forEach((w) => {
    const wrap = document.createElement("label");
    wrap.className = "chip";
    wrap.innerHTML = `<input type="checkbox" value="${w.key}"> ${w.label}`;
    box.appendChild(wrap);
  });
}

function getSelectedWeekdays() {
  return [...el("weekdayBox").querySelectorAll("input[type=checkbox]:checked")].map(
    (i) => i.value
  );
}

function setSelectedWeekdays(keys) {
  const set = new Set(keys || []);
  [...el("weekdayBox").querySelectorAll("input[type=checkbox]")].forEach(
    (i) => (i.checked = set.has(i.value))
  );
}

// Formulario
function clearForm() {
  editingId = null;
  el("saveBtn").textContent = "Salvar curso";

  el("audience").value = "criancas";
  el("area").value = "audiovisual";
  el("laneLabel").value = "";

  el("title").value = "";
  el("note").value = "";
  el("objectives").value = "";
  el("workload").value = "";
  el("format").value = "";
  el("prereq").value = "";
  el("syllabus").value = "";
  el("materials").value = "";

  el("startDate").value = "";
  el("endDate").value = "";
  el("startTime").value = "";
  el("endTime").value = "";

  setSelectedWeekdays([]);
}

function readForm() {
  return {
    id: editingId || uid(),
    audience: el("audience").value,
    area: el("area").value,
    laneLabel: el("laneLabel").value.trim(),

    title: el("title").value.trim(),
    note: el("note").value.trim(),

    objectives: el("objectives").value.trim(),
    workload: el("workload").value.trim(),
    prereq: el("prereq").value.trim(),
    syllabus: el("syllabus").value.trim(),
    materials: el("materials").value.trim(),
    format: el("format").value.trim(),

    daysOfWeek: getSelectedWeekdays(),
    startDate: el("startDate").value,
    endDate: el("endDate").value,
    startTime: el("startTime").value,
    endTime: el("endTime").value,
  };
}

function fillForm(course) {
  editingId = course.id;
  el("saveBtn").textContent = "Atualizar curso";

  el("audience").value = course.audience;
  el("area").value = course.area;
  el("laneLabel").value = course.laneLabel || "";

  el("title").value = course.title || "";
  el("note").value = course.note || "";

  el("objectives").value = course.objectives || "";
  el("workload").value = course.workload || "";
  el("format").value = course.format || "";
  el("prereq").value = course.prereq || "";
  el("syllabus").value = course.syllabus || "";
  el("materials").value = course.materials || "";

  el("startDate").value = course.startDate || "";
  el("endDate").value = course.endDate || "";
  el("startTime").value = course.startTime || "";
  el("endTime").value = course.endTime || "";

  setSelectedWeekdays(course.daysOfWeek || []);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Lista
function renderList() {
  const list = el("courseList");
  if (!courses.length) {
    list.innerHTML = `<div class="muted">Nenhum curso cadastrado ainda.</div>`;
    return;
  }

  list.innerHTML = "";
  courses.forEach((c) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="item-title">
        <div>
          <strong>${escapeHtml(c.title)}</strong>
          <div class="muted">${escapeHtml(labelAudience(c.audience))} • ${escapeHtml(PUD_AREA_LABEL[c.area] || c.area)} • Trilha: ${escapeHtml(c.laneLabel || "—")}</div>
          <div class="muted">${escapeHtml(formatSchedule(c))}</div>
        </div>
        <div class="actions">
          <button class="secondary" data-act="edit" data-id="${c.id}">Editar</button>
          <button class="danger" data-act="del" data-id="${c.id}">Remover</button>
        </div>
      </div>
      <div class="muted">${escapeHtml(c.note)}</div>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll("button[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const act = btn.getAttribute("data-act");
      const course = courses.find((x) => x.id === id);
      if (!course) return;

      if (act === "edit") fillForm(course);
      if (act === "del") {
        if (!confirm("Remover este curso?")) return;
        courses = courses.filter((x) => x.id !== id);
        saveCourses();
        renderList();
      }
    });
  });
}

// Build PUD_DATA
function buildPudDataFromCourses() {
  const data = JSON.parse(JSON.stringify(BASE_DATA)); // clone

  for (const c of courses) {
    if (!data[c.audience]) continue;
    if (!data[c.audience].areas[c.area]) continue;

    const lanes = data[c.audience].areas[c.area].lanes;

    let lane = lanes.find(
      (l) => l.label.toLowerCase() === (c.laneLabel || "").toLowerCase()
    );
    if (!lane) {
      lane = { label: c.laneLabel || "Trilha", steps: [] };
      lanes.push(lane);
    }

    lane.steps.push({
      title: c.title,
      note: c.note,
      meta: {
        objetivos: linesToArray(c.objectives),
        carga_horaria: c.workload,
        pre_requisitos: linesToArray(c.prereq),
        conteudo_programatico: linesToArray(c.syllabus),
        dias_da_semana: c.daysOfWeek,
        data_inicio: c.startDate,
        data_final: c.endDate,
        horario_inicio: c.startTime,
        horario_final: c.endTime,
        materiais: linesToArray(c.materials),
        formato: c.format,
      },
    });
  }

  return data;
}

function exportDataJs() {
  const pudData = buildPudDataFromCourses();
  const out = `// data.js
// Gerado pela Tela de Cadastro PUD

window.PUD_DATA = ${JSON.stringify(pudData, null, 2)};

window.PUD_AREA_LABEL = ${JSON.stringify(PUD_AREA_LABEL, null, 2)};
`;
  el("output").textContent = out;
}


function init() {
  renderWeekdays();
  renderList();
  clearForm();

  el("saveBtn").addEventListener("click", (e) => {
    e.preventDefault();

    const incoming = readForm();

    if (!incoming.title || !incoming.title.trim()) {
      alert("Preencha o Título do curso.");
      return;
    }

    const normIncomingTitle = normalizeTitle(incoming.title);

    if (editingId) {
      const idx = courses.findIndex((c) => c.id === editingId);
      if (idx >= 0) {
        courses[idx] = mergeNonEmpty(courses[idx], incoming);
        saveCourses();
        renderList();
        clearForm();
        alert("Curso atualizado (campos preenchidos sobrescreveram).");
        return;
      }
    }

    const sameTitleIdx = courses.findIndex(
      (c) => normalizeTitle(c.title) === normIncomingTitle
    );

    if (sameTitleIdx >= 0) {
      courses[sameTitleIdx] = mergeNonEmpty(courses[sameTitleIdx], incoming);

      const updated = courses.splice(sameTitleIdx, 1)[0];
      courses.unshift(updated);

      saveCourses();
      renderList();
      clearForm();
      alert("Curso encontrado pelo mesmo nome e atualizado (merge por campos não vazios).");
      return;
    }

    const missingNew = requiredMissing(incoming);
    if (missingNew.length) {
      alert("Para criar um curso novo, preencha os campos obrigatórios:\n- " + missingNew.join("\n- "));
      return;
    }

    courses.unshift(incoming);
    saveCourses();
    renderList();
    clearForm();
    alert("Curso salvo!");
  });

  el("clearBtn").addEventListener("click", () => clearForm());
  el("exportBtn").addEventListener("click", () => exportDataJs());

  el("copyBtn").addEventListener("click", async () => {
    const text = el("output").textContent || "";
    if (!text.trim() || text.includes('Clique em "Gerar data.js"')) {
      alert('Primeiro clique em "Gerar data.js".');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert("Copiado!");
    } catch {
      alert("Não consegui copiar automaticamente. Selecione o texto e copie manualmente.");
    }
  });

  el("resetBtn").addEventListener("click", () => {
    if (!confirm("Apagar todos os cursos cadastrados (do navegador)?")) return;
    courses = [];
    saveCourses();
    renderList();
    el("output").textContent = '// Clique em "Gerar data.js"';
    clearForm();
  });
}

document.addEventListener("DOMContentLoaded", init);