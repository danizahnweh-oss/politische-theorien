const operators = [
  ["nennen","AFB I","Information knapp wiedergeben, ohne lange Erklärung."],
  ["beschreiben","AFB I","Material geordnet darstellen: Was sieht man? Was steht da?"],
  ["herausarbeiten","AFB II","Zentrale Aussagen gezielt aus Material entnehmen und ordnen."],
  ["erläutern","AFB II","Eine Aussage erklären und mit Hintergrundwissen verständlich machen."],
  ["vergleichen","AFB II","Gemeinsamkeiten und Unterschiede nach klaren Kriterien zeigen."],
  ["analysieren","AFB II","Material untersuchen: Aufbau, Inhalt, Aussage, Wirkung."],
  ["beurteilen","AFB III","Argumente abwägen und zu einem begründeten Sachurteil kommen."],
  ["bewerten","AFB III","Ein begründetes Urteil mit eigenen oder vorgegebenen Wertmaßstäben formulieren."]
];
const vocab = [
  ["Naturrechte","Vorstaatliche Rechte, die jedem Menschen zukommen, etwa Leben, Freiheit und Eigentum."],
  ["Gesellschaftsvertrag","Denkmodell: Menschen gründen eine politische Ordnung, um Freiheit und Sicherheit zu sichern."],
  ["Volkssouveränität","Die legitime Staatsgewalt geht vom Volk aus."],
  ["Gewaltenteilung","Staatsgewalt wird auf Legislative, Exekutive und Judikative verteilt."],
  ["Konservatismus","Politisches Denken, das Tradition, Ordnung und organischen Wandel betont."],
  ["Liberalismus","Politisches Denken, das individuelle Freiheit, Rechte und begrenzte Herrschaft betont."],
  ["Sozialismus","Politisches Denken, das soziale Gleichheit und Kritik an kapitalistischer Ausbeutung betont."],
  ["Gemeinwille","Bei Rousseau der auf das Gemeinwohl gerichtete Wille des Volkes."],
  ["Sozialstaat","Staatsprinzip, das soziale Sicherheit und faire Teilhabe sichern soll."],
  ["Rechtsstaat","Staatliche Macht ist an Recht, Verfahren und Grundrechte gebunden."]
];

// Aktiven Navigationspunkt anhand des Dateinamens markieren
const currentPage = (location.pathname.split("/").pop() || "index.html");
document.querySelectorAll("nav a").forEach(link => {
  const target = link.getAttribute("href");
  if(target === currentPage || (currentPage === "" && target === "index.html")){
    link.classList.add("active");
  }
});

// Operatoren-Panel (auf allen Seiten vorhanden)
const opList = document.querySelector("#opList");
if(opList){
  operators.forEach(([name, afb, text]) => {
    const item = document.createElement("div");
    item.className = "op-item";
    item.innerHTML = `<div><span class="op-name">${name}</span><span class="op-afb">${afb}</span></div><p class="op-def">${text}</p>`;
    opList.appendChild(item);
  });
}

// Wortschatzkarten (nur auf der Wortschatz-Seite)
// Karte ist ein div (kein button): Chromium flacht 3D-Transforms in
// button-Elementen ab, dadurch würde der Flip nicht sichtbar sein.
const vocabWrap = document.querySelector("#vocab");
if(vocabWrap){
  vocab.forEach(([term, definition]) => {
    const card = document.createElement("div");
    card.className = "vcard";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Begriff ${term}, umdrehen für Definition`);
    card.innerHTML = `<span class="vcard-inner"><span class="vface vfront"><span class="vterm">${term}</span><span class="vhint">anklicken zum Umdrehen</span></span><span class="vface vback">${definition}</span></span>`;
    const flip = () => card.classList.toggle("flip");
    card.addEventListener("click", flip);
    card.addEventListener("keydown", event => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        flip();
      }
    });
    vocabWrap.appendChild(card);
  });
}

const opToggle = document.querySelector("#opToggle");
const opPanel = document.querySelector("#opPanel");
const opClose = document.querySelector("#opClose");
if(opToggle && opPanel && opClose){
  const setOp = open => {
    opPanel.classList.toggle("show", open);
    opToggle.setAttribute("aria-expanded", String(open));
    if(open){opClose.focus();}
  };
  opToggle.addEventListener("click", () => setOp(!opPanel.classList.contains("show")));
  opClose.addEventListener("click", () => setOp(false));
  document.addEventListener("keydown", event => {
    if(event.key === "Escape" && opPanel.classList.contains("show")){
      setOp(false);
      opToggle.focus();
    }
  });
}

document.querySelectorAll("textarea").forEach(area => {
  const task = area.closest(".task");
  const min = Number(area.dataset.min || 120);
  const count = task.querySelector(".cnt");
  const bar = task.querySelector(".ta-bar i");
  const btn = task.querySelector(".btn:not(.ghost)");
  area.addEventListener("input", () => {
    const len = area.value.trim().length;
    count.textContent = `${len} Zeichen`;
    bar.style.transform = `scaleX(${Math.min(1, len / min)})`;
    btn.disabled = len < min;
  });
  btn.addEventListener("click", () => {
    const reveal = task.querySelector(".reveal");
    reveal.classList.add("show");
    btn.disabled = true;
  });
});

document.querySelectorAll(".diff").forEach(diff => {
  const buttons = diff.querySelectorAll(".diff-btn");
  const bodies = diff.querySelectorAll(".diff-body");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      bodies[index].classList.toggle("show");
    });
  });
});

const progress = document.querySelector("#progress");
if(progress){
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${p})`;
  }, {passive:true});
}
