(function () {
  "use strict";

  const STORAGE_KEY = "resumeBuilder.draft.v1";

  /* ---------------------------------------------------------
     Field schemas per repeatable section
     --------------------------------------------------------- */
  const SCHEMAS = {
    experience: { listId: "experienceList", tplId: "tpl-experience", keys: ["title", "company", "location", "start", "end", "bullets"] },
    project:    { listId: "projectList",    tplId: "tpl-project",    keys: ["title", "stack", "link", "bullets"] },
    education:  { listId: "educationList",  tplId: "tpl-education",  keys: ["title", "company", "location", "start", "end", "bullets"] },
    cert:       { listId: "certList",       tplId: "tpl-cert",       keys: ["title", "company", "start"] },
  };

  const $ = (id) => document.getElementById(id);

  /* ---------------------------------------------------------
     Entry card creation / removal
     --------------------------------------------------------- */
  function addEntry(kind, data) {
    const schema = SCHEMAS[kind];
    const tpl = $(schema.tplId);
    const node = tpl.content.firstElementChild.cloneNode(true);
    const list = $(schema.listId);

    if (data) {
      schema.keys.forEach((key) => {
        const input = node.querySelector(`[data-key="${key}"]`);
        if (input && data[key] != null) input.value = data[key];
      });
    }

    node.addEventListener("input", scheduleCompile);
    node.querySelector(".entry-remove").addEventListener("click", () => {
      node.remove();
      scheduleCompile();
    });

    list.appendChild(node);
    return node;
  }

  function collectEntries(kind) {
    const schema = SCHEMAS[kind];
    const cards = $(schema.listId).querySelectorAll(".entry-card");
    const out = [];
    cards.forEach((card) => {
      const entry = {};
      schema.keys.forEach((key) => {
        const input = card.querySelector(`[data-key="${key}"]`);
        entry[key] = input ? input.value.trim() : "";
      });
      const hasContent = Object.values(entry).some((v) => v.length > 0);
      if (hasContent) out.push(entry);
    });
    return out;
  }

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      addEntry(btn.dataset.add);
      scheduleCompile();
    });
  });

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function bulletsToList(text) {
    const lines = String(text || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return "";
    return `<ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`;
  }

  function dateRange(start, end) {
    const s = escapeHtml(start), e = escapeHtml(end);
    if (s && e) return `${s} – ${e}`;
    return s || e || "";
  }

  function normalizeUrl(url) {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  /* ---------------------------------------------------------
     Compile: read all inputs -> render preview
     --------------------------------------------------------- */
  function compile() {
    const name = $("fullName").value.trim();
    const role = $("role").value.trim();
    const email = $("email").value.trim();
    const phone = $("phone").value.trim();
    const location = $("location").value.trim();
    const linkedin = $("linkedin").value.trim();
    const github = $("github").value.trim();
    const website = $("website").value.trim();
    const summary = $("summary").value.trim();
    const skillsRaw = $("skills").value.trim();

    // header
    $("rName").textContent = name || "Your Name";
    $("rRole").textContent = role;

    const contactParts = [email, phone, location].filter(Boolean);
    $("rContact").textContent = contactParts.join("  ·  ");

    const links = [];
    if (linkedin) links.push(`<a href="${normalizeUrl(linkedin)}" target="_blank" rel="noopener">${escapeHtml(linkedin.replace(/^https?:\/\//i, ""))}</a>`);
    if (github) links.push(`<a href="${normalizeUrl(github)}" target="_blank" rel="noopener">${escapeHtml(github.replace(/^https?:\/\//i, ""))}</a>`);
    if (website) links.push(`<a href="${normalizeUrl(website)}" target="_blank" rel="noopener">${escapeHtml(website.replace(/^https?:\/\//i, ""))}</a>`);
    $("rLinks").innerHTML = links.join("  ·  ");

    // summary
    $("rSummarySection").hidden = !summary;
    $("rSummary").textContent = summary;

    // experience
    const experience = collectEntries("experience");
    $("rExperienceSection").hidden = experience.length === 0;
    $("rExperience").innerHTML = experience.map((e) => `
      <div class="r-item">
        <div class="r-item-head">
          <span class="r-item-title">${escapeHtml(e.title) || "Role"}</span>
          <span class="r-item-meta">${dateRange(e.start, e.end)}</span>
        </div>
        <div class="r-item-sub">${[escapeHtml(e.company), escapeHtml(e.location)].filter(Boolean).join(" · ")}</div>
        ${bulletsToList(e.bullets)}
      </div>`).join("");

    // projects
    const projects = collectEntries("project");
    $("rProjectSection").hidden = projects.length === 0;
    $("rProjects").innerHTML = projects.map((p) => `
      <div class="r-item">
        <div class="r-item-head">
          <span class="r-item-title">${escapeHtml(p.title) || "Project"}</span>
          ${p.link ? `<span class="r-item-meta"><a href="${normalizeUrl(p.link)}" target="_blank" rel="noopener">${escapeHtml(p.link.replace(/^https?:\/\//i, ""))}</a></span>` : ""}
        </div>
        <div class="r-item-sub">${escapeHtml(p.stack)}</div>
        ${bulletsToList(p.bullets)}
      </div>`).join("");

    // education
    const education = collectEntries("education");
    $("rEducationSection").hidden = education.length === 0;
    $("rEducation").innerHTML = education.map((e) => `
      <div class="r-item">
        <div class="r-item-head">
          <span class="r-item-title">${escapeHtml(e.title) || "Degree"}</span>
          <span class="r-item-meta">${dateRange(e.start, e.end)}</span>
        </div>
        <div class="r-item-sub">${[escapeHtml(e.company), escapeHtml(e.location)].filter(Boolean).join(" · ")}</div>
        ${bulletsToList(e.bullets)}
      </div>`).join("");

    // skills
    const skills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    $("rSkillsSection").hidden = skills.length === 0;
    $("rSkills").innerHTML = skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("");

    // certifications
    const certs = collectEntries("cert");
    $("rCertSection").hidden = certs.length === 0;
    $("rCerts").innerHTML = certs.map((c) => `
      <div class="r-item">
        <div class="r-item-head">
          <span class="r-item-title">${escapeHtml(c.title) || "Certification"}</span>
          <span class="r-item-meta">${escapeHtml(c.start)}</span>
        </div>
        <div class="r-item-sub">${escapeHtml(c.company)}</div>
      </div>`).join("");

    // empty-state message
    const isEmpty = !name && !summary && experience.length === 0 && projects.length === 0 &&
      education.length === 0 && skills.length === 0 && certs.length === 0;
    $("rEmpty").hidden = !isEmpty;

    saveDraft();
    flashCompiled();
  }

  let compileTimer = null;
  function scheduleCompile() {
    const status = $("compileStatus");
    status.textContent = "compiling…";
    status.classList.add("is-compiling");
    clearTimeout(compileTimer);
    compileTimer = setTimeout(compile, 220);
  }
  function flashCompiled() {
    const status = $("compileStatus");
    status.textContent = "compiled ✓";
    status.classList.remove("is-compiling");
  }

  /* ---------------------------------------------------------
     Photo handling
     --------------------------------------------------------- */
  $("photoToggle").addEventListener("change", (e) => {
    $("photoFieldWrap").hidden = !e.target.checked;
    if (!e.target.checked) {
      $("photoField").value = "";
      $("rPhoto").hidden = true;
      $("rPhoto").removeAttribute("src");
      saveDraft();
    }
  });

  $("photoField").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      $("rPhoto").src = reader.result;
      $("rPhoto").hidden = false;
      saveDraft();
    };
    reader.readAsDataURL(file);
  });

  /* ---------------------------------------------------------
     Autosave / restore
     --------------------------------------------------------- */
  function saveDraft() {
    try {
      const data = {
        fullName: $("fullName").value,
        role: $("role").value,
        email: $("email").value,
        phone: $("phone").value,
        location: $("location").value,
        linkedin: $("linkedin").value,
        github: $("github").value,
        website: $("website").value,
        summary: $("summary").value,
        skills: $("skills").value,
        photo: $("photoToggle").checked ? ($("rPhoto").getAttribute("src") || "") : "",
        experience: collectEntries("experience"),
        project: collectEntries("project"),
        education: collectEntries("education"),
        cert: collectEntries("cert"),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      // storage full or unavailable — fail silently, builder still works in-session
    }
  }

  function loadDraft() {
    let data;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      data = JSON.parse(raw);
    } catch (err) {
      return false;
    }

    ["fullName", "role", "email", "phone", "location", "linkedin", "github", "website", "summary", "skills"]
      .forEach((id) => { if (data[id]) $(id).value = data[id]; });

    if (data.photo) {
      $("photoToggle").checked = true;
      $("photoFieldWrap").hidden = false;
      $("rPhoto").src = data.photo;
      $("rPhoto").hidden = false;
    }

    ["experience", "project", "education", "cert"].forEach((kind) => {
      (data[kind] || []).forEach((entry) => addEntry(kind, entry));
    });

    return true;
  }

  /* ---------------------------------------------------------
     Reset
     --------------------------------------------------------- */
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Clear everything and start a blank document?")) return;
    localStorage.removeItem(STORAGE_KEY);
    document.querySelectorAll(".entries").forEach((el) => (el.innerHTML = ""));
    document.querySelectorAll(".editor input, .editor textarea").forEach((el) => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });
    $("photoFieldWrap").hidden = true;
    $("rPhoto").hidden = true;
    $("rPhoto").removeAttribute("src");
    compile();
  });

  /* ---------------------------------------------------------
     Print
     --------------------------------------------------------- */
  $("printBtn").addEventListener("click", () => window.print());

  /* ---------------------------------------------------------
     Wire up live-compile on every input in the editor
     --------------------------------------------------------- */
  $("editorPane").addEventListener("input", (e) => {
    if (e.target.id === "photoField") return; // handled separately
    scheduleCompile();
  });

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  const restored = loadDraft();
  if (!restored) {
    // seed one blank card per repeatable section so the form doesn't look empty
    addEntry("experience");
    addEntry("project");
    addEntry("education");
  }
  compile();
})();
