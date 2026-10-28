const serviceAreas = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "mosquito", label: "Mosquito" },
];

const antSpecies = [
  "White-footed ants",
  "Crazy ants",
  "Bigheaded ants",
  "Ghost ants",
  "Pyramid ants",
  "Fire ants",
  "Carpenter ants",
  "Acrobat ants",
  "Argentine ants",
  "Pharaoh ants",
];

const exteriorSpiderActivity = ["Webs", "Grass/bushes"];
const interiorSpiderActivity = ["Webs", "Corners/closets", "Garage"];

const findingGroups = {
  exterior: [
    {
      id: "exterior-ants",
      kind: "ants",
      label: "Ants",
      subheading: "Ant species",
      options: antSpecies,
    },
    {
      id: "exterior-millipedes",
      kind: "millipedes",
      label: "Millipedes",
    },
    {
      id: "exterior-roaches",
      kind: "roaches",
      label: "Roaches",
    },
    {
      id: "exterior-spiders",
      kind: "spiders",
      label: "Spiders",
      subheading: "Spider activity",
      options: exteriorSpiderActivity,
    },
    {
      id: "exterior-wasps",
      kind: "wasps",
      label: "Wasp nests",
    },
  ],
  interior: [
    {
      id: "interior-ants",
      kind: "ants",
      label: "Ants",
      subheading: "Ant species",
      options: antSpecies,
    },
    {
      id: "interior-roaches",
      kind: "interior-roaches",
      label: "Cockroaches",
      subheading: "Roach type",
      options: ["German roaches", "American roaches", "Smokybrown roaches", "Australian roaches", "Oriental roaches"],
    },
    {
      id: "interior-flies",
      kind: "flies",
      label: "Flies/gnats",
      subheading: "Fly or gnat type",
      options: ["Drain flies", "Fruit flies", "House flies", "Fungus gnats"],
    },
    {
      id: "interior-occasional",
      kind: "occasional",
      label: "Occasional invaders",
      subheading: "Activity type",
      options: ["Earwigs", "Millipedes", "Pill bugs", "Centipedes"],
    },
    {
      id: "interior-pantry",
      kind: "pantry",
      label: "Pantry pests",
      subheading: "Pantry pest type",
      options: ["Pantry moths", "Stored-product beetles"],
    },
    {
      id: "interior-silverfish",
      kind: "silverfish",
      label: "Silverfish",
    },
    {
      id: "interior-spiders",
      kind: "interior-spiders",
      label: "Spiders",
      subheading: "Spider activity",
      options: interiorSpiderActivity,
    },
  ],
  mosquito: [
    {
      id: "mosquito-mms",
      kind: "mosquito-mms",
      label: "MMS",
      subheading: "MMS details",
      options: ["Boxes serviced"],
    },
  ],
};

const conditions = [
  "Mulch against foundation",
  "Moisture near home",
  "Vegetation touching structure",
  "Branches touching roofline",
  "Leaf litter",
  "Stored items or debris",
  "Firewood near structure",
  "Exterior gaps",
  "Door sweep gap",
  "Trash or food source",
  "Gutter or drainage issue",
  "Pool cage or lanai web buildup",
];

const gateOptions = [
  { id: "none", label: "No gate" },
  { id: "closed", label: "Gate closed" },
  { id: "not-accessed", label: "Gate not accessed" },
];

const state = {
  noteSeed: NoteClipGenerator.createSeed(),
  areas: new Set(),
  findings: new Set(),
  subFindings: {},
  conditions: new Set(),
  conditionsOpen: false,
  gate: "none",
  houseSpecific: "",
};

const issueList = document.querySelector("#issueList");
const exteriorPanel = document.querySelector("#exteriorPanel");
const exteriorIssueList = document.querySelector("#exteriorIssueList");
const interiorPanel = document.querySelector("#interiorPanel");
const interiorIssueList = document.querySelector("#interiorIssueList");
const mosquitoPanel = document.querySelector("#mosquitoPanel");
const mosquitoIssueList = document.querySelector("#mosquitoIssueList");
const conditionsPanel = document.querySelector("#conditionsPanel");
const conditionsToggle = document.querySelector("#conditionsToggle");
const conditionListWrap = document.querySelector("#conditionListWrap");
const conditionList = document.querySelector("#conditionList");
const gateList = document.querySelector("#gateList");
const houseSpecific = document.querySelector("#houseSpecific");
const generatedNote = document.querySelector("#generatedNote");
const copyStatus = document.querySelector("#copyStatus");
const generateButton = document.querySelector("#generateButton");
const copyNoteButton = document.querySelector("#copyNoteButton");
const copyPromptButton = document.querySelector("#copyPromptButton");
const resetButton = document.querySelector("#resetButton");
const topResetButton = document.querySelector("#topResetButton");

function createToggleButton(label, selected, onClick, className = "pill-button") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.setAttribute("aria-pressed", String(selected));
  button.addEventListener("click", onClick);
  return button;
}

function toggleSetValue(set, value) {
  if (set.has(value)) {
    set.delete(value);
    return;
  }
  set.add(value);
}

function getFindingById(findingId) {
  return [...findingGroups.exterior, ...findingGroups.interior, ...findingGroups.mosquito].find((finding) => finding.id === findingId);
}

function getFindingArea(findingId) {
  for (const areaId of Object.keys(findingGroups)) {
    if (findingGroups[areaId].some((finding) => finding.id === findingId)) {
      return areaId;
    }
  }
  return "";
}

function getSubSet(findingId) {
  if (!state.subFindings[findingId]) {
    state.subFindings[findingId] = new Set();
  }
  return state.subFindings[findingId];
}

function clearAreaFindings(areaId) {
  findingGroups[areaId].forEach((finding) => {
    state.findings.delete(finding.id);
    delete state.subFindings[finding.id];
  });
}

function renderFindingGroup(areaId, container) {
  container.innerHTML = "";

  findingGroups[areaId].forEach((finding) => {
    const group = document.createElement("div");
    group.className = "finding-group";

    group.append(
      createToggleButton(finding.label, state.findings.has(finding.id), () => {
        toggleSetValue(state.findings, finding.id);
        if (!state.findings.has(finding.id)) {
          delete state.subFindings[finding.id];
        }
        renderSelections();
        syncOutputs();
      }, "pill-button finding-button"),
    );

    if (finding.options && state.findings.has(finding.id)) {
      const subPanel = document.createElement("div");
      subPanel.className = "sub-panel compact-sub-panel";

      const heading = document.createElement("h3");
      heading.textContent = finding.subheading;
      subPanel.append(heading);

      const subList = document.createElement("div");
      subList.className = "pill-stack";
      subList.setAttribute("aria-label", finding.subheading);

      finding.options.forEach((option) => {
        const subSet = getSubSet(finding.id);
        subList.append(
          createToggleButton(option, subSet.has(option), () => {
            toggleSetValue(subSet, option);
            renderSelections();
            syncOutputs();
          }),
        );
      });

      subPanel.append(subList);
      group.append(subPanel);
    }

    container.append(group);
  });
}

function renderSelections() {
  issueList.innerHTML = "";
  serviceAreas.forEach((area) => {
    issueList.append(
      createToggleButton(area.label, state.areas.has(area.id), () => {
        toggleSetValue(state.areas, area.id);
        if (state.areas.has("mosquito") && area.id === "mosquito") {
          ["exterior", "interior"].forEach((areaToClear) => {
            state.areas.delete(areaToClear);
            clearAreaFindings(areaToClear);
          });
          state.conditions.clear();
          state.conditionsOpen = false;
        }
        if (state.areas.has(area.id) && area.id !== "mosquito") {
          state.areas.delete("mosquito");
          clearAreaFindings("mosquito");
        }
        if (!state.areas.has(area.id)) {
          clearAreaFindings(area.id);
        }
        renderSelections();
        syncOutputs();
      }, "pill-button area-button"),
    );
  });

  exteriorPanel.classList.toggle("is-hidden", !state.areas.has("exterior"));
  interiorPanel.classList.toggle("is-hidden", !state.areas.has("interior"));
  mosquitoPanel.classList.toggle("is-hidden", !state.areas.has("mosquito"));
  conditionsPanel.classList.toggle("is-hidden", state.areas.has("mosquito"));
  renderFindingGroup("exterior", exteriorIssueList);
  renderFindingGroup("interior", interiorIssueList);
  renderFindingGroup("mosquito", mosquitoIssueList);

  conditionsToggle.textContent = state.conditionsOpen
    ? `Hide conducive conditions${state.conditions.size ? ` (${state.conditions.size})` : ""}`
    : `Add conducive conditions${state.conditions.size ? ` (${state.conditions.size})` : ""}`;
  conditionsToggle.setAttribute("aria-expanded", String(state.conditionsOpen));
  conditionListWrap.classList.toggle("is-hidden", !state.conditionsOpen);

  conditionList.innerHTML = "";
  conditions.forEach((condition) => {
    conditionList.append(
      createToggleButton(condition, state.conditions.has(condition), () => {
        toggleSetValue(state.conditions, condition);
        syncOutputs();
        renderSelections();
      }),
    );
  });

  gateList.innerHTML = "";
  gateOptions.forEach((option) => {
    gateList.append(
      createToggleButton(option.label, state.gate === option.id, () => {
        state.gate = option.id;
        syncOutputs();
        renderSelections();
      }, "segment-button"),
    );
  });
}

function getSelectedLabels() {
  const selectedFindings = [...state.findings].map((findingId) => {
    const finding = getFindingById(findingId);
    return {
      id: findingId,
      area: getFindingArea(findingId),
      kind: finding.kind,
      label: finding.label,
      options: [...getSubSet(findingId)],
    };
  });

  return {
    areas: serviceAreas.filter((area) => state.areas.has(area.id)).map((area) => area.label),
    findings: selectedFindings,
    conditions: [...state.conditions],
    gate: gateOptions.find((option) => option.id === state.gate)?.label ?? "No gate",
    houseSpecific: state.houseSpecific,
  };
}

function buildNote() {
  return NoteClipGenerator.generateNote(getSelectedLabels(), state.noteSeed);
}

function generateAnotherNote() {
  const previous = generatedNote.textContent;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    state.noteSeed = (state.noteSeed + 1) >>> 0;
    syncOutputs();
    if (generatedNote.textContent !== previous) {
      break;
    }
  }
  setStatus("Generated", "success");
  window.setTimeout(() => setStatus("Ready"), 1100);
}

function buildPrompt() {
  const labels = getSelectedLabels();
  const details = {
    serviceAreas: labels.areas,
    findings: labels.findings,
    conduciveConditions: labels.conditions,
    gateStatus: labels.gate,
    houseSpecific: state.houseSpecific.trim(),
  };

  return `Rewrite the draft note below into one polished customer-facing pest control service note.

Company voice: a friendly, experienced technician writing directly to the homeowner. Use plain, professional language and natural sentences.
Required content:
- Include what the technician saw.
- Include what the technician did.
- Include what the customer should expect next.
- Put findings first, completed work next, and expectations last.
- Keep it to one good paragraph, not headings or bullets.
- Preserve the meaning of the draft note.
- Keep the house-specific detail and service facts intact.
- Avoid marketing language, unnecessary technical terms, and stock phrases.
- Selected pest findings also confirm treatment in this workflow.
- Avoid repeating the pest list in the treatment sentence or adding repeated visit/check prefaces.
- Group pest names under a shared "activity" ending where possible, keeping webs and nests distinct.
- Give exterior and interior findings separate sentences.

Do not invent inaccessible areas, product names, chemical names, guarantees, or severe infestations. Mention gate status only when relevant.

Draft note:
${generatedNote.textContent || buildNote()}

Technician inputs:
${JSON.stringify(details, null, 2)}`;
}

function syncOutputs() {
  state.houseSpecific = houseSpecific.value;
  generatedNote.textContent = buildNote();
}

function setStatus(message, type = "") {
  copyStatus.textContent = message;
  copyStatus.className = `status-pill${type ? ` is-${type}` : ""}`;
}

async function writeToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the textarea copy path below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const didCopy = document.execCommand("copy");
  textarea.remove();

  if (!didCopy) {
    throw new Error("Copy command failed");
  }
}

async function copyText(text, successMessage) {
  try {
    await writeToClipboard(text);
    setStatus(successMessage, "success");
    window.setTimeout(() => setStatus("Ready"), 1300);
  } catch {
    setStatus("Copy failed", "error");
  }
}

function resetForm() {
  state.noteSeed = NoteClipGenerator.createSeed();
  state.areas.clear();
  state.findings.clear();
  state.subFindings = {};
  state.conditions.clear();
  state.conditionsOpen = false;
  state.gate = "none";
  state.houseSpecific = "";
  houseSpecific.value = "";
  renderSelections();
  syncOutputs();
  setStatus("Reset");
  window.setTimeout(() => setStatus("Ready"), 900);
}

conditionsToggle.addEventListener("click", () => {
  state.conditionsOpen = !state.conditionsOpen;
  renderSelections();
});
houseSpecific.addEventListener("input", () => syncOutputs());
generateButton.addEventListener("click", generateAnotherNote);
copyNoteButton.addEventListener("click", () => copyText(generatedNote.textContent, "Note copied"));
copyPromptButton.addEventListener("click", () => copyText(buildPrompt(), "Prompt copied"));
resetButton.addEventListener("click", resetForm);
topResetButton.addEventListener("click", resetForm);

renderSelections();
syncOutputs();
