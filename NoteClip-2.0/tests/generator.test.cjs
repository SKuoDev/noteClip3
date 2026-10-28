const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const generator = require("../note-generator.js");

function details(overrides = {}) {
  return {
    areas: [],
    findings: [],
    conditions: [],
    gate: "No gate",
    houseSpecific: "",
    ...overrides,
  };
}

function finding(id, kind, area, options = []) {
  return { id, kind, area, options };
}

const cases = {
  default: details(),
  exteriorClear: details({ areas: ["Exterior"] }),
  interiorClear: details({ areas: ["Interior"] }),
  bothClear: details({ areas: ["Exterior", "Interior"] }),
  ants: details({
    areas: ["Exterior"],
    findings: [finding("exterior-ants", "ants", "exterior", ["Ghost ants", "Crazy ants"])],
  }),
  interiorAnts: details({
    areas: ["Interior"],
    findings: [finding("interior-ants", "ants", "interior", ["Ghost ants"])],
  }),
  roaches: details({
    areas: ["Interior"],
    findings: [finding("interior-roaches", "interior-roaches", "interior", ["German roaches"])],
  }),
  exteriorRoaches: details({
    areas: ["Exterior"],
    findings: [finding("exterior-roaches", "roaches", "exterior")],
  }),
  webs: details({
    areas: ["Exterior"],
    findings: [finding("exterior-spiders", "spiders", "exterior", ["Webs", "Grass/bushes"])],
    conditions: ["Pool cage or lanai web buildup"],
  }),
  interiorSpiders: details({
    areas: ["Interior"],
    findings: [finding("interior-spiders", "interior-spiders", "interior", ["Webs", "Corners/closets", "Garage"])],
  }),
  millipedes: details({
    areas: ["Exterior"],
    findings: [finding("exterior-millipedes", "millipedes", "exterior")],
  }),
  wasps: details({
    areas: ["Exterior"],
    findings: [finding("exterior-wasps", "wasps", "exterior")],
  }),
  flies: details({
    areas: ["Interior"],
    findings: [finding("interior-flies", "flies", "interior", ["Drain flies", "Fungus gnats"])],
  }),
  pantry: details({
    areas: ["Interior"],
    findings: [finding("interior-pantry", "pantry", "interior", ["Pantry moths"])],
  }),
  silverfish: details({
    areas: ["Interior"],
    findings: [finding("interior-silverfish", "silverfish", "interior")],
  }),
  occasional: details({
    areas: ["Interior"],
    findings: [finding("interior-occasional", "occasional", "interior", ["Earwigs", "Millipedes"])],
  }),
  mixed: details({
    areas: ["Exterior", "Interior"],
    findings: [
      finding("exterior-ants", "ants", "exterior", ["Ghost ants"]),
      finding("interior-roaches", "interior-roaches", "interior", ["German roaches"]),
      finding("interior-spiders", "interior-spiders", "interior", ["Webs"]),
    ],
    conditions: ["Door sweep gap"],
    gate: "Gate closed",
  }),
  fogging: details({ areas: ["Mosquito"] }),
  mms: details({
    areas: ["Mosquito"],
    findings: [finding("mosquito-mms", "mosquito-mms", "mosquito")],
  }),
  boxes: details({
    areas: ["Mosquito"],
    findings: [finding("mosquito-mms", "mosquito-mms", "mosquito", ["Boxes serviced"])],
  }),
};

for (const [name, input] of Object.entries(cases)) {
  test(name + ": broad variation, stable drafts, and clean paragraphs", () => {
    const snapshot = JSON.stringify(input);
    const notes = new Set();
    for (let seed = 0; seed < 200; seed += 1) {
      const note = generator.generateNote(input, seed);
      assert.equal(note, generator.generateNote(input, seed));
      assert.ok(note.length > 80, note);
      assert.doesNotMatch(note, /\n|\s{2}|undefined|null|\.\.|What I saw:|For this home,|harborage|activity zones/);
      assert.doesNotMatch(note, /\bduring\b|\b(?:ant|roach|spider|millipede|wasp|silverfish|mosquito) treatment\b/i);
      assert.doesNotMatch(note, /^(?:I (?:treated|completed|applied|focused|used)|Treatment|The treatment|The accessible resting areas received)/);
      assert.ok((note.match(/\btoday(?:'s)?\b/gi) || []).length <= 1, note);
      assert.match(note, /[.!?]$/);
      assert.ok(note.split(/\s+/).length < 210, name + ": " + note);
      notes.add(note);
    }
    assert.ok(notes.size >= 160, name + " has only " + notes.size + " distinct notes");
    assert.equal(JSON.stringify(input), snapshot, "Generation mutated the technician inputs");
  });
}

test("variation preserves selected pest species, locations, and gate facts", () => {
  for (let seed = 0; seed < 200; seed += 1) {
    const ants = generator.generateNote(cases.ants, seed);
    assert.match(ants, /ghost ant/);
    assert.match(ants, /crazy ant/);
    assert.doesNotMatch(ants, /colony|bait|guarantee/i);
    const mixed = generator.generateNote(cases.mixed, seed);
    assert.match(mixed, /ghost ant/);
    assert.match(mixed, /German roach/);
    assert.match(mixed, /inside|interior/);
    assert.match(mixed, /outside|exterior/);
    assert.match(mixed, /door sweep/);
    assert.match(mixed, /gate.*closed|closed the gate/i);
    const spiders = generator.generateNote(cases.interiorSpiders, seed);
    assert.match(spiders, /corners and closets/);
    assert.match(spiders, /garage/);
    assert.match(spiders, /web/);
  }
});

test("findings come before treatment without repeating the pest list in the actions", () => {
  const input = details({
    areas: ["Exterior"],
    findings: [
      finding("exterior-ants", "ants", "exterior", ["Fire ants"]),
      finding("exterior-spiders", "spiders", "exterior", ["Webs"]),
    ],
    conditions: ["Moisture near home"],
    gate: "Gate closed",
  });
  for (let seed = 0; seed < 500; seed += 1) {
    const note = generator.generateNote(input, seed);
    const actionIndex = note.search(/\b(?:I (?:treated|applied|completed|focused)|[Tt]reatment covered|The treatment covered)\b/);
    const expectationIndex = note.search(/\b(?:Activity should|You should|Allow the treatment|Some activity|The treatment should|Sightings should|You may|Activity in|Please allow|Some sightings)\b/);
    assert.ok(actionIndex > note.indexOf("fire ant activity"), note);
    assert.ok(actionIndex > note.indexOf("spider webs"), note);
    assert.ok(actionIndex > note.indexOf("excess moisture"), note);
    assert.ok(expectationIndex > actionIndex, note);
    assert.match(note, /removed|cleared/);
    assert.equal((note.match(/fire ant/g) || []).length, 1, note);
    assert.equal((note.match(/spider/g) || []).length, 1, note);
    const findings = note.slice(0, actionIndex);
    assert.ok((findings.match(/\bnoted\b/g) || []).length <= 1, note);
    assert.ok((findings.match(/\bfound\b/g) || []).length <= 1, note);
  }
});

test("related source cleanup advice is combined instead of repeated", () => {
  const input = details({
    areas: ["Interior"],
    findings: [
      finding("interior-flies", "flies", "interior", ["Drain flies"]),
      finding("interior-pantry", "pantry", "interior", ["Pantry moths"]),
    ],
  });
  for (let seed = 0; seed < 200; seed += 1) {
    const note = generator.generateNote(input, seed);
    assert.match(note, /drain fly/);
    assert.match(note, /pantry moth/);
    assert.match(note, /pantry items|stored foods|affected foods/);
    assert.match(note, /breeding sources/);
    assert.doesNotMatch(note, /Source cleanup is important/);
  }
});

test("pest names share an activity ending while webs and nests stay distinct", () => {
  const exterior = details({
    areas: ["Exterior"],
    findings: [
      finding("exterior-ants", "ants", "exterior", ["Fire ants"]),
      finding("exterior-roaches", "roaches", "exterior"),
      finding("exterior-millipedes", "millipedes", "exterior"),
    ],
  });
  const withWebsAndNests = {
    ...exterior,
    findings: [
      ...exterior.findings,
      finding("exterior-spiders", "spiders", "exterior", ["Webs"]),
      finding("exterior-wasps", "wasps", "exterior"),
    ],
  };
  const interior = details({
    areas: ["Interior"],
    findings: [
      finding("interior-ants", "ants", "interior", ["Ghost ants"]),
      finding("interior-roaches", "interior-roaches", "interior", ["German roaches"]),
      finding("interior-silverfish", "silverfish", "interior"),
    ],
  });
  for (let seed = 0; seed < 200; seed += 1) {
    for (const input of [exterior, withWebsAndNests, interior]) {
      const opening = generator.generateNote(input, seed).split(".")[0];
      assert.equal((opening.match(/\bactivity\b/g) || []).length, 1, opening);
      if (input === interior) {
        assert.match(opening, /ghost ant, German roach, and silverfish activity/);
      } else {
        assert.match(opening, /fire ant, roach, and millipede activity/);
      }
      if (input === withWebsAndNests) {
        assert.match(opening, /spider webs and wasp nests/);
        assert.doesNotMatch(opening, /webs activity|nests activity/);
      }
    }
  }
});

test("exterior and interior findings have their own sentences before treatment", () => {
  for (let seed = 0; seed < 200; seed += 1) {
    const note = generator.generateNote(cases.mixed, seed);
    const sentences = note.split(".").map(sentence => sentence.trim());
    const actionIndex = note.search(/\b(?:I (?:treated|applied|completed|focused)|[Tt]reatment covered|The treatment covered)\b/);
    assert.match(sentences[0], /ghost ant/);
    assert.match(sentences[0], /outside|exterior/i);
    assert.doesNotMatch(sentences[0], /German roach|spider webs/);
    assert.match(sentences[1], /German roach/);
    assert.match(sentences[1], /spider webs/);
    assert.match(sentences[1], /inside|interior/i);
    assert.doesNotMatch(sentences[1], /ghost ant/);
    assert.ok(note.indexOf(sentences[1]) < actionIndex, note);
  }
});

test("web removal is included only when webs are selected", () => {
  const spiders = details({
    areas: ["Exterior"],
    findings: [finding("exterior-spiders", "spiders", "exterior", ["Grass/bushes"])],
  });
  for (let seed = 0; seed < 100; seed += 1) {
    assert.doesNotMatch(generator.generateNote(spiders, seed), /web/i);
    assert.match(generator.generateNote(cases.webs, seed), /removed|cleared/);
  }
});

test("house detail is retained as a sentence without contradicting it", () => {
  const houseSpecific = "Ants at the kitchen window.\nCustomer asked about the back door!";
  const input = details({ areas: ["Interior"], houseSpecific });
  for (let seed = 0; seed < 100; seed += 1) {
    const note = generator.generateNote(input, seed);
    assert.ok(note.includes("Ants at the kitchen window. Customer asked about the back door!"));
    assert.doesNotMatch(note, /no major|house-specific|For this home/);
  }
});

test("gated area not accessed does not imply it was locked or inaccessible", () => {
  for (let seed = 0; seed < 100; seed += 1) {
    const note = generator.generateNote(details({ gate: "Gate not accessed" }), seed);
    assert.match(note, /gated area/);
    assert.doesNotMatch(note, /locked|not accessible|could not|couldn't/);
  }
});

test("mosquito, MMS, and boxes retain their separate service facts", () => {
  for (let seed = 0; seed < 200; seed += 1) {
    const fogging = generator.generateNote(cases.fogging, seed);
    assert.match(fogging, /fogger|fogging/);
    assert.match(fogging, /adulticide and growth regulator/);
    assert.doesNotMatch(fogging, /monthly|boxes|foundation|entry points|I noted mosquito activity/);
    const mms = generator.generateNote(cases.mms, seed);
    assert.match(mms, /monthly/);
    assert.doesNotMatch(mms, /EcoVia|adulticide|growth regulator|fogger|fogging|boxes/i);
    const boxes = generator.generateNote(cases.boxes, seed);
    assert.match(boxes, /mosquito boxes/);
    assert.match(boxes, /water treatment/);
    assert.doesNotMatch(boxes, /EcoVia/i);
    const gated = generator.generateNote({ ...cases.boxes, gate: "Gate closed" }, seed);
    assert.match(gated, /gate.*closed|closed the gate/i);
  }
});

function loadApp() {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]));
  const elements = new Map();
  const clipboard = [];
  let nextSeed = 12345;
  class Element {
    constructor() {
      this.children = [];
      this.textContent = "";
      this.value = "";
      this.handlers = {};
      this.attributes = {};
      const classes = new Set();
      this.classList = {
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); },
        contains(name) { return classes.has(name); },
      };
    }
    set innerHTML(value) {
      assert.equal(value, "");
      this.children = [];
    }
    append(child) { this.children.push(child); }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    click() { return this.handlers.click(); }
  }
  const sandbox = {
    NoteClipGenerator: { ...generator, createSeed: () => nextSeed++ },
    document: {
      querySelector(selector) {
        const id = selector.slice(1);
        assert.ok(ids.has(id), "Missing HTML element: " + id);
        if (!elements.has(id)) elements.set(id, new Element());
        return elements.get(id);
      },
      createElement() { return new Element(); },
    },
    navigator: { clipboard: { async writeText(text) { clipboard.push(text); } } },
    window: { setTimeout() {} },
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), sandbox);
  return {
    elements,
    clipboard,
    sandbox,
    click(container, label) {
      function find(element) {
        if (element.textContent === label && element.handlers.click) return element;
        for (const child of element.children) {
          const match = find(child);
          if (match) return match;
        }
      }
      const button = find(elements.get(container));
      assert.ok(button, "Missing button: " + label);
      button.click();
    },
    note() { return elements.get("generatedNote").textContent; },
  };
}

test("HTML loads the generator before the form script", () => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  assert.ok(html.indexOf('src="note-generator.js"') < html.indexOf('src="script.js"'));
  assert.match(html, /<p[^>]*id="generatedNote"/);
  assert.doesNotMatch(html, /<textarea[^>]*id="generatedNote"/);
  const browser = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../note-generator.js"), "utf8"), browser);
  assert.equal(typeof browser.NoteClipGenerator.generateNote, "function");
  const seed = browser.NoteClipGenerator.createSeed();
  assert.ok(Number.isInteger(seed) && seed >= 0 && seed <= 4294967295);
  assert.ok(browser.NoteClipGenerator.generateNote(cases.exteriorClear, seed).length > 80);
});

test("Generate note rewords the current facts; Copy Prompt uses exactly the preview", async () => {
  const app = loadApp();
  app.click("issueList", "Exterior");
  app.click("exteriorIssueList", "Ants");
  app.click("exteriorIssueList", "Ghost ants");
  const notes = new Set([app.note()]);
  for (let index = 0; index < 30; index += 1) {
    const previous = app.note();
    app.elements.get("generateButton").click();
    assert.notEqual(app.note(), previous);
    assert.match(app.note(), /ghost ant/);
    notes.add(app.note());
  }
  assert.ok(notes.size > 25);
  const preview = app.note();
  app.elements.get("conditionsToggle").click();
  assert.equal(app.note(), preview);
  await app.elements.get("copyNoteButton").click();
  assert.equal(app.clipboard.at(-1), preview);
  await app.elements.get("copyPromptButton").click();
  assert.ok(app.clipboard.at(-1).includes("Draft note:\n" + preview + "\n\nTechnician inputs:"));
  assert.equal(app.note(), preview);
});

test("service switching, MMS boxes, house detail, and reset work through form controls", async () => {
  const app = loadApp();
  app.click("issueList", "Exterior");
  app.click("exteriorIssueList", "Ants");
  app.click("exteriorIssueList", "Ghost ants");
  app.elements.get("conditionsToggle").click();
  app.click("conditionList", "Door sweep gap");
  app.click("gateList", "Gate closed");
  app.click("issueList", "Mosquito");
  assert.doesNotMatch(app.note(), /ghost ant|door sweep|foundation/);
  assert.match(app.note(), /adulticide and growth regulator/);
  assert.equal(app.elements.get("conditionsPanel").classList.contains("is-hidden"), true);
  app.click("mosquitoIssueList", "MMS");
  app.click("mosquitoIssueList", "Boxes serviced");
  assert.match(app.note(), /monthly/);
  assert.match(app.note(), /mosquito boxes/);
  assert.match(app.note(), /water treatment/);
  assert.doesNotMatch(app.note(), /EcoVia|fogger|adulticide/i);
  const house = app.elements.get("houseSpecific");
  house.value = "Customer asked about the back patio.";
  house.handlers.input();
  assert.ok(app.note().includes(house.value));
  await app.elements.get("copyPromptButton").click();
  assert.ok(app.clipboard.at(-1).includes(app.note()));
  app.elements.get("topResetButton").click();
  assert.equal(house.value, "");
  assert.doesNotMatch(app.note(), /monthly|boxes|Customer asked|gate/i);
  assert.equal(app.elements.get("conditionsPanel").classList.contains("is-hidden"), false);
});

test("every available pest, subtype, and condition can generate a note", () => {
  const app = loadApp();
  const groups = vm.runInContext("findingGroups", app.sandbox);
  for (const [area, findings] of Object.entries(groups)) {
    for (const item of findings) {
      const input = details({
        areas: [area.charAt(0).toUpperCase() + area.slice(1)],
        findings: [finding(item.id, item.kind, area, Array.from(item.options || []))],
      });
      assert.ok(generator.generateNote(input, 42).length > 80);
    }
  }
  const conditions = Array.from(vm.runInContext("conditions", app.sandbox));
  for (const condition of conditions) {
    assert.ok(generator.generateNote(details({ conditions: [condition] }), 42).length > 80);
  }
  const allFindings = Array.from(groups.exterior).concat(Array.from(groups.interior)).map((item) =>
    finding(item.id, item.kind, item.id.startsWith("interior") ? "interior" : "exterior", Array.from(item.options || []))
  );
  assert.doesNotMatch(generator.generateNote(details({
    areas: ["Exterior", "Interior"],
    findings: allFindings,
    conditions,
  }), 42), /undefined|null|\n/);
});
