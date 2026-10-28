(function (root) {
  "use strict";

  const pestLanguage = {
    ants: { name: "ant" },
    roaches: { name: "roach" },
    spiders: { name: "spider" },
    millipedes: {
      name: "millipede",
      followups: [
        "Wet weather can temporarily increase millipede activity.",
        "Millipede sightings may increase after rain.",
        "Damp conditions can lead to more millipede activity between services.",
        "Millipede activity can fluctuate after periods of wet weather.",
      ],
    },
    wasps: {
      name: "wasp nests",
      followups: [
        "Some wasps may return to the treated nests before activity settles down.",
        "Returning wasps may still be seen near the treated nests.",
        "Some wasps may return to the nesting areas at first.",
        "Some returning wasps are possible around the treated nests.",
      ],
    },
    flies: {
      name: "fly or gnat",
      followups: [
        "Cleaning up breeding sources will help prevent returning activity.",
        "Source cleanup is important for keeping activity down.",
        "Keeping possible breeding sources clean will support the treatment.",
        "Removing the source helps prevent activity from continuing.",
      ],
    },
    occasional: { name: "occasional invader" },
    pantry: {
      name: "pantry pest",
      followups: [
        "Please check stored foods and remove any affected items to address the source.",
        "Removing affected pantry items will help keep activity from returning.",
        "Check stored foods for affected items, which can allow activity to continue.",
        "Checking stored foods and discarding affected items will support the service.",
      ],
    },
    silverfish: { name: "silverfish" },
  };

  const conditionLanguage = {
    "Mulch against foundation": {
      note: "mulch close to the foundation",
      tips: [
        "Pulling mulch back from the foundation can help reduce moisture and pest shelter.",
        "Keeping mulch away from direct contact with the foundation will help reduce pest shelter.",
      ],
    },
    "Moisture near home": {
      note: "excess moisture near the home",
      tips: [
        "Reducing the excess moisture will help make the area less inviting to pests.",
        "Keeping the area drier will help support the treatment.",
      ],
    },
    "Vegetation touching structure": {
      note: "vegetation touching the structure",
      tips: [
        "Trimming plants back from the home will help reduce pest access.",
        "Keeping vegetation off the structure helps limit routes pests can use to reach the home.",
      ],
    },
    "Branches touching roofline": {
      note: "branches touching the roofline",
      tips: [
        "Trimming branches away from the roofline can help limit pest access.",
        "Keeping branches off the roof helps remove a route pests can use to reach the home.",
      ],
    },
    "Leaf litter": {
      note: "leaf buildup",
      tips: [
        "Clearing the leaf buildup will help reduce moisture and pest shelter.",
        "Removing leaves from around the home helps take away damp hiding places.",
      ],
    },
    "Stored items or debris": {
      note: "stored items or debris near the home",
      tips: [
        "Moving stored items away from the foundation will help reduce pest hiding places.",
        "Keeping debris cleared and stored items off the ground helps reduce pest shelter.",
      ],
    },
    "Firewood near structure": {
      note: "firewood stored near the structure",
      tips: [
        "Storing firewood away from the home and off the ground can help reduce pest shelter.",
        "Moving wood away from the structure helps reduce nearby pest hiding places.",
      ],
    },
    "Exterior gaps": {
      note: "exterior gaps or openings",
      tips: [
        "Sealing the exterior gaps will help limit pest entry.",
        "Closing the openings can help reduce pests getting inside.",
      ],
    },
    "Door sweep gap": {
      note: "a gap at a door sweep",
      tips: [
        "Repairing the door sweep will help reduce pest entry.",
        "Closing the gap beneath the door will help keep pests outside.",
      ],
    },
    "Trash or food source": {
      note: "trash or food sources that may attract pests",
      tips: [
        "Keeping food and trash sealed and the area clean will help reduce returning activity.",
        "Removing food residue and keeping waste covered will help support the service.",
      ],
    },
    "Gutter or drainage issue": {
      note: "a gutter or drainage issue",
      tips: [
        "Correcting the drainage will help reduce moisture near the home.",
        "Addressing the gutter or drainage issue can help keep the area drier and less inviting to pests.",
      ],
    },
    "Pool cage or lanai web buildup": {
      note: "web buildup around the pool cage or lanai",
      tips: [
        "Webs can return around the pool cage or lanai between visits.",
        "Some new webbing around the pool cage or lanai is possible between services.",
      ],
    },
  };

  const optionNames = {
    "Drain flies": "drain fly",
    "Fruit flies": "fruit fly",
    "House flies": "house fly",
    "Fungus gnats": "fungus gnat",
    Earwigs: "earwig",
    Millipedes: "millipede",
    "Pill bugs": "pill bug",
    Centipedes: "centipede",
    "Pantry moths": "pantry moth",
    "Stored-product beetles": "stored-product beetle",
  };

  const clearOpenings = [
    "I found no major pest activity {scope} today.",
    "No major pest activity was noted {scope}.",
    "I didn't find any major pest issues {scope}.",
    "I checked {scope} and didn't see any major pest activity.",
    "No major pest concerns were noted {scope} today.",
    "Today's check {scope} did not turn up any major pest activity.",
    "I did not see any major pest activity {scope}.",
    "I checked {scope}; no major pest activity stood out today.",
    "The inspection showed no major pest issues {scope}.",
    "I found no major pest activity {scope} on this visit.",
    "I checked the service areas {scope}; no major pest activity was noted.",
    "There was no major pest activity to report {scope} today.",
  ];

  const monitoringClosings = [
    "We'll keep an eye on these areas at future visits.",
    "I'll continue checking for new activity at future services.",
    "We'll continue monitoring for changes between regular services.",
    "Please let us know if you notice any new activity between visits.",
    "We'll check for any changes at the next service.",
    "Continue to watch for new activity and let us know if anything changes.",
    "The regular service will help us stay on top of new activity.",
    "We'll keep monitoring as part of the regular service.",
    "If any new activity comes up, please let us know.",
    "I'll keep checking the property at your regular visits.",
  ];

  const treatmentExpectations = [
    "Activity should gradually decrease as the treatment takes effect.",
    "You should see fewer sightings as the treatment has time to work.",
    "Allow the treatment time to work; activity should begin to settle down.",
    "Some activity may continue at first, then taper down as the treatment works.",
    "You should see less activity as the treatment works.",
    "Sightings should become less frequent as the treatment takes effect.",
    "You may still notice some activity while the treatment has time to work.",
    "Activity in the treated areas should gradually ease.",
    "Please allow time for the treatment to take effect and activity to decrease.",
    "The treatment should help bring activity down over time.",
    "You should notice less activity as the treatment begins to work.",
    "Some sightings may continue while the treatment takes effect.",
  ];

  const webExpectations = [
    "Some new webbing may appear between services.",
    "New webs can still appear between visits.",
    "You may see new webs over time.",
    "Some webbing may return before the next service.",
    "We'll keep an eye on any returning webbing at regular visits.",
    "Some new webs are possible between services.",
  ];

  const mosquitoLanguage = {
    fogging: {
      observations: [
        "I checked the mosquito resting areas around the property.",
        "I looked over the shaded areas where mosquitoes commonly rest.",
        "I checked the accessible resting areas around the home.",
        "The exterior check covered the areas where mosquitoes tend to rest.",
        "I looked over the mosquito resting areas outside.",
        "I checked the property's accessible mosquito resting areas.",
        "I inspected the resting areas around the home before treatment.",
        "I checked the shaded mosquito resting areas around the exterior.",
        "The inspection covered accessible resting areas around the property.",
        "I checked the exterior resting areas as part of the service.",
        "I looked over the accessible areas where mosquitoes commonly rest.",
        "I checked the mosquito resting areas around the exterior today.",
      ],
      treatments: [
        "I applied an adulticide and growth regulator with the fogger to the accessible resting areas.",
        "I treated the accessible resting areas with the fogger using an adulticide and growth regulator.",
        "I used the fogger to apply an adulticide and growth regulator to those areas.",
        "The accessible resting areas received a fogger application of adulticide and growth regulator.",
        "I completed treatment with the fogger, applying an adulticide and growth regulator.",
        "I applied treatment with the fogger using an adulticide and growth regulator.",
        "I completed the fogging application in the accessible resting areas using an adulticide and growth regulator.",
        "I used an adulticide and growth regulator for the fogger application in those areas.",
        "Treatment included a fogger application of adulticide and growth regulator to the accessible resting areas.",
        "I applied an adulticide and growth regulator to those areas with the fogger.",
      ],
      expectations: [
        "Activity should decrease as the treatment takes effect, though mosquitoes can move in from nearby areas.",
        "The treatment should help reduce activity; weather and nearby breeding sources can still affect sightings.",
        "You should see less activity as the treatment works, with some returning mosquitoes possible.",
        "Allow time for the treatment to work. Nearby breeding sources can still bring mosquitoes onto the property.",
        "The service should help reduce adult mosquitoes and interrupt development, with some sightings still possible between visits.",
        "Activity should settle down as the treatment takes effect. Removing standing water will help support the service.",
        "You should see a reduction in activity, although some mosquitoes may still be present.",
        "The treatment should help bring activity down, while rain and nearby standing water can affect how quickly mosquitoes return.",
        "Activity should ease as the treatment works. Keeping standing water reduced will also help.",
        "Some mosquitoes may return from surrounding areas, but activity should decrease as the treatment takes effect.",
      ],
    },
    mms: {
      observations: [
        "I checked the mosquito resting areas for the monthly service.",
        "The monthly visit included a check of the accessible resting areas.",
        "I looked over the resting areas around the home for the monthly service.",
        "I checked the accessible mosquito resting areas as part of the monthly service.",
        "I checked the property's resting areas for the scheduled monthly service.",
        "The monthly inspection covered accessible resting areas around the home.",
        "I looked over the mosquito resting areas at the monthly visit.",
        "I checked the accessible resting areas for the monthly service today.",
        "The monthly check included the mosquito resting areas around the property.",
        "I looked over the exterior resting areas for the monthly service.",
        "I checked the mosquito resting areas as part of the monthly visit.",
        "The monthly visit covered accessible resting areas around the property.",
      ],
      treatments: [
        "I applied treatment to the accessible resting areas.",
        "I treated those areas as part of the service.",
        "Treatment covered the accessible resting areas around the home.",
        "I applied treatment around the accessible resting areas.",
        "I completed treatment in the accessible resting areas.",
        "The accessible resting areas received the scheduled treatment.",
        "I completed treatment around the resting areas checked.",
        "I treated the accessible areas where mosquitoes commonly rest.",
        "I applied treatment to the resting areas included in the service.",
        "I treated the accessible resting areas around the property.",
      ],
      expectations: [
        "The recurring service should help keep activity down, although some mosquitoes can return between visits.",
        "Continued service should help reduce activity over time. Nearby standing water and weather can still affect sightings.",
        "The treatment should help reduce activity between visits; removing standing water will also help.",
        "Some mosquitoes may return between visits, with recurring service helping manage ongoing activity.",
        "The treatment should help keep activity lower, with some fluctuation after rain or from nearby breeding sources.",
        "Continued service should help reduce activity, although mosquitoes can still move in from surrounding areas.",
        "The service should help manage activity between visits. Keeping standing water reduced will support the treatment.",
        "Activity should be more manageable with recurring service, though some sightings are still possible.",
        "Activity should decrease as the treatment works, with some returning mosquitoes possible between visits.",
        "Regular service should help keep activity down, while weather and nearby breeding sources can affect results.",
      ],
    },
    boxes: [
      "I also serviced the mosquito boxes and checked the water treatment inside.",
      "I serviced the mosquito boxes, including a check of the water treatment.",
      "I checked the water treatment while servicing the mosquito boxes.",
      "I also serviced the mosquito boxes and their water treatment.",
      "The mosquito boxes were serviced, including a check of the water treatment.",
      "I serviced the mosquito boxes as well and checked the water treatment inside.",
    ],
  };

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value = Math.imul(value ^ text.charCodeAt(index), 16777619);
    }
    value ^= value >>> 16;
    value = Math.imul(value, 0x85ebca6b);
    value ^= value >>> 13;
    value = Math.imul(value, 0xc2b2ae35);
    return (value ^ (value >>> 16)) >>> 0;
  }

  function createSeed() {
    if (root.crypto && root.crypto.getRandomValues) {
      return root.crypto.getRandomValues(new Uint32Array(1))[0];
    }
    return (Date.now() ^ Math.floor(Math.random() * 4294967296)) >>> 0;
  }

  function pick(choices, seed, key) {
    // Each phrase gets its own choice so equally sized banks can combine freely.
    return choices[hash(String(seed) + ":" + key) % choices.length];
  }

  function list(items) {
    if (items.length < 2) {
      return items[0] || "";
    }
    if (items.length === 2) {
      return items.join(" and ");
    }
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }

  function sentence(text) {
    const clean = text.trim().replace(/\s+/g, " ");
    if (!clean) {
      return "";
    }
    const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
    return /[.!?]["')\]]?$/.test(capitalized) ? capitalized : capitalized + ".";
  }

  function kindOf(finding) {
    if (finding.kind === "interior-roaches") {
      return "roaches";
    }
    if (finding.kind === "interior-spiders") {
      return "spiders";
    }
    return finding.kind;
  }

  function hasWebs(finding) {
    return kindOf(finding) === "spiders" && finding.options.includes("Webs");
  }

  function findingParts(finding) {
    const kind = kindOf(finding);
    if (kind === "spiders") {
      const places = [];
      if (finding.options.includes("Grass/bushes")) {
        places.push("the grass and bushes");
      }
      if (finding.options.includes("Corners/closets")) {
        places.push("corners and closets");
      }
      if (finding.options.includes("Garage")) {
        places.push("the garage");
      }
      if (hasWebs(finding)) {
        const features = places.length
          ? ["webbing", "spiders in " + list(places)]
          : ["spider webs"];
        return { pests: [], features: features };
      }
      return places.length
        ? { pests: [], features: ["spiders in " + list(places)] }
        : { pests: ["spider"], features: [] };
    }
    if (kind === "wasps") {
      return { pests: [], features: [pestLanguage[kind].name] };
    }
    if (finding.options.length) {
      const names = finding.options.map(function (option) {
        if (kind === "ants") {
          return option.toLowerCase().replace(/ ants$/, " ant");
        }
        if (kind === "roaches") {
          return option.replace(/ roaches$/i, " roach");
        }
        return optionNames[option] || option.toLowerCase();
      });
      return { pests: names, features: [] };
    }
    return { pests: [pestLanguage[kind].name], features: [] };
  }

  function describeFindings(findings) {
    const pests = new Set();
    const features = new Set();
    findings.forEach(function (finding) {
      const parts = findingParts(finding);
      parts.pests.forEach(function (name) { pests.add(name); });
      parts.features.forEach(function (feature) { features.add(feature); });
    });
    const activity = pests.size ? list(Array.from(pests)) + " activity" : "";
    const otherFindings = list(Array.from(features));
    if (activity && otherFindings) {
      return activity + ", along with " + otherFindings;
    }
    return activity || otherFindings;
  }

  function scopeOf(details) {
    if (details.areas.includes("Exterior") && details.areas.includes("Interior")) {
      return "inside and outside";
    }
    if (details.areas.includes("Interior")) {
      return "inside";
    }
    if (details.areas.includes("Exterior")) {
      return "around the exterior";
    }
    return "";
  }

  function observation(details, seed) {
    if (!details.findings.length) {
      const scope = scopeOf(details);
      if (details.houseSpecific.trim()) {
        return pick([
          "I checked the service areas {scope}.",
          "I looked over the accessible areas {scope}.",
          "I checked the accessible areas {scope} before treatment.",
          "The inspection covered the accessible service areas {scope}.",
        ], seed, "inspection").replace(" {scope}", scope ? " " + scope : "");
      }
      return pick(clearOpenings, seed, "clear").replace(" {scope}", scope ? " " + scope : "");
    }

    const byArea = {};
    ["exterior", "interior"].forEach(function (area) {
      const findings = details.findings.filter(function (finding) {
        return finding.area === area;
      });
      byArea[area] = describeFindings(findings);
    });

    if (byArea.exterior && byArea.interior) {
      const outside = byArea.exterior;
      const inside = byArea.interior;
      return pick([
        "I found " + outside + " outside. Inside, I noted " + inside + ".",
        "Outside, I noted " + outside + ". I found " + inside + " inside.",
        "The exterior check showed " + outside + ". Inside, I found " + inside + ".",
        "I saw " + outside + " outside. The interior check showed " + inside + ".",
        "Outside, I found " + outside + ". The interior check showed " + inside + ".",
        "I noted " + outside + " around the exterior. Inside, I saw " + inside + ".",
        "The exterior check showed " + outside + ". I noted " + inside + " inside.",
        "I found " + outside + " outside. The interior check showed " + inside + ".",
      ], seed, "mixed-findings");
    }

    return ["exterior", "interior"].map(function (area) {
      const found = byArea[area];
      if (!found) {
        return "";
      }
      const activity = found;
      const location = area === "exterior" ? "outside" : "inside";
      return pick([
        "I found " + activity + " " + location + ".",
        "I noted " + activity + " " + location + ".",
        "I saw " + activity + " " + location + ".",
        "The " + area + " check showed " + activity + ".",
        "I found " + activity + " while checking " + location + ".",
        "My " + area + " check showed " + activity + ".",
        "I noted " + activity + " " + location + " on this visit.",
        "While checking " + location + ", I found " + activity + ".",
      ], seed, "findings-" + area);
    }).filter(Boolean).join(" ");
  }

  function conditionObservation(details, seed, opening) {
    const notes = details.conditions.map(function (condition) {
      return conditionLanguage[condition].note;
    });
    if (!notes.length) {
      return "";
    }
    const choices = [
      "I also noted " + list(notes) + ".",
      "The property also had " + list(notes) + ".",
      "I noted " + list(notes) + " as well.",
      "I also found " + list(notes) + ".",
      "Other conditions included " + list(notes) + ".",
      "I found " + list(notes) + " as well.",
    ].filter(function (choice) {
      return !["found", "noted"].some(function (verb) {
        const word = new RegExp("\\b" + verb + "\\b", "i");
        return word.test(opening) && word.test(choice);
      });
    });
    return pick(choices, seed, "conditions");
  }

  function treatment(details, seed) {
    const kinds = new Set(details.findings.map(kindOf));
    const exterior = details.areas.includes("Exterior");
    const interior = details.areas.includes("Interior");
    const targets = [];

    if (exterior) {
      targets.push("the foundation", "accessible entry points");
    } else if (kinds.has("occasional")) {
      targets.push("accessible entry points");
    }

    if (details.findings.length) {
      targets.push(exterior && interior
        ? "affected areas inside and outside"
        : interior ? "affected interior areas" : "affected areas");
    } else if (interior) {
      targets.push("accessible interior areas");
    } else if (!exterior) {
      targets.push("the accessible service areas");
    }

    if (kinds.has("pantry") || kinds.has("silverfish")) {
      targets.push("accessible cracks and crevices");
    }
    if (kinds.has("wasps")) {
      targets.push("accessible nests");
    }

    const areas = list(targets);
    const applied = pick([
      "I treated " + areas + ".",
      "Treatment covered " + areas + ".",
      "I applied treatment to " + areas + ".",
      "I completed treatment in and around " + areas + ".",
      "I focused treatment on " + areas + ".",
      "I completed treatment around " + areas + ".",
      "The treatment covered " + areas + ".",
      "I applied treatment in and around " + areas + ".",
      "I completed the service by treating " + areas + ".",
      "I treated " + areas + " as part of the service.",
    ], seed, "service");

    // Findings share one treatment statement; distinct tasks are mentioned once.
    const tasks = [];
    if (details.findings.some(hasWebs)) {
      tasks.push(pick([
        "removed accessible webs",
        "cleared the accessible webbing",
        "removed the webs I could reach",
        "cleared away accessible webs",
        "removed the accessible webbing",
        "cleared the webs I could reach",
      ], seed, "web-removal"));
    }
    if (kinds.has("flies")) {
      tasks.push(pick([
        "checked possible breeding sources",
        "checked possible source areas",
        "looked for possible breeding sources",
        "checked likely source areas",
        "checked for possible sources",
      ], seed, "source-check"));
    }

    const extra = tasks.length
      ? pick(["I also ", "I "], seed, "task-lead") + list(tasks) + "."
      : "";
    return [applied, extra].filter(Boolean).join(" ");
  }

  function expectations(details, seed) {
    const kinds = Array.from(new Set(details.findings.map(kindOf)));
    const parts = [
      pick(kinds.length ? treatmentExpectations : monitoringClosings, seed, "response"),
    ];

    if (details.findings.some(hasWebs)) {
      parts.push(pick(webExpectations, seed, "web-expectation"));
    }

    const combinedSources = kinds.includes("pantry") && kinds.includes("flies");
    if (combinedSources) {
      parts.push(pick([
        "Removing affected pantry items and cleaning possible breeding sources will help keep activity down.",
        "Check stored foods for affected items and clean possible breeding sources to help prevent returning activity.",
        "Removing affected foods and keeping possible breeding sources clean will support the treatment.",
        "Check stored foods and clean possible breeding sources to help address the sources of activity.",
      ], seed, "combined-sources"));
    }
    const followups = ["pantry", "flies", "millipedes", "wasps"].filter(function (kind) {
      if (combinedSources && (kind === "pantry" || kind === "flies")) {
        return false;
      }
      return kinds.includes(kind);
    });
    followups.slice(0, combinedSources ? 1 : 2).forEach(function (kind) {
      parts.push(pick(pestLanguage[kind].followups, seed, "followup-" + kind));
    });

    const exteriorWebs = details.findings.some(function (finding) {
      return finding.area === "exterior" && hasWebs(finding);
    });
    const tips = details.conditions.filter(function (condition) {
      return !(exteriorWebs && condition === "Pool cage or lanai web buildup");
    });
    tips.slice(0, 2).forEach(function (condition) {
      parts.push(pick(conditionLanguage[condition].tips, seed, "tip-" + condition));
    });

    if (kinds.length && !combinedSources && !followups.length && !tips.length && !details.findings.some(hasWebs)) {
      parts.push(pick([
        "",
        "",
        "",
        "Please let us know if activity continues or increases.",
        "Let us know if you continue noticing activity between visits.",
      ], seed, "contact"));
    }
    return parts.filter(Boolean).join(" ");
  }

  function gateNote(details, seed) {
    if (details.gate === "Gate closed") {
      return pick([
        "I closed the gate after service.",
        "The gate was closed before I left.",
        "I left the gate closed when finished.",
        "The gate was closed when finished.",
        "I made sure the gate was closed before leaving.",
        "I closed the gate when the service was complete.",
      ], seed, "gate-closed");
    }
    if (details.gate === "Gate not accessed") {
      return pick([
        "The gated area was not accessed.",
        "I did not access the gated area.",
        "Service did not include the gated area.",
        "The gated area was not included in the service.",
        "I did not enter the gated area.",
      ], seed, "gate-not-accessed");
    }
    return "";
  }

  function compose(parts) {
    // Keep the service story in order while varying wording within each stage.
    return [
      parts.observation,
      parts.detail,
      parts.conditions,
      parts.treatment,
      parts.gate,
      parts.expectation,
    ].filter(Boolean).join(" ");
  }

  function generateNote(details, seed) {
    if (details.areas.includes("Mosquito")) {
      const mms = details.findings.find(function (finding) {
        return finding.id === "mosquito-mms";
      });
      const bank = mms ? mosquitoLanguage.mms : mosquitoLanguage.fogging;
      const boxes = mms && mms.options.includes("Boxes serviced")
        ? pick(mosquitoLanguage.boxes, seed, "mosquito-boxes")
        : "";
      return compose({
        observation: pick(bank.observations, seed, "mosquito-observation"),
        treatment: [pick(bank.treatments, seed, "mosquito-treatment"), boxes].filter(Boolean).join(" "),
        detail: sentence(details.houseSpecific),
        expectation: pick(bank.expectations, seed, "mosquito-expectation"),
        gate: gateNote(details, seed),
      });
    }
    const opening = observation(details, seed);
    return compose({
      observation: opening,
      treatment: treatment(details, seed),
      conditions: conditionObservation(details, seed, opening),
      detail: sentence(details.houseSpecific),
      expectation: expectations(details, seed),
      gate: gateNote(details, seed),
    });
  }

  const api = { createSeed: createSeed, generateNote: generateNote };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.NoteClipGenerator = api;
  }
})(globalThis);
