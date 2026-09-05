// ================================================
// FLOWS
// Jede Funktion hier macht genau EINE Sache
// und wird vom Workflow weiter unten aufgerufen.
// ================================================

// Flow: Daten von der data.json holen
function datenLaden() {
  return fetch("data.json").then(function (antwort) {
    return antwort.json();
  });
}

// Flow: sucht in einer Kategorie die Frage mit einer bestimmten Punktzahl
function frageFinden(kategorie, punktzahl) {
  for (var f = 0; f < kategorie.question.length; f++) {
    var frage = kategorie.question[f];
    if (frage.points === punktzahl) {
      return frage;
    }
  }
  return null; // keine passende Frage gefunden
}

// Flow: baut die Kopfzeile mit den Kategorienamen
function kopfzeileBauen(kategorien) {
  var kopfzeile = document.createElement("tr");

  for (var i = 0; i < kategorien.length; i++) {
    var th = document.createElement("th");
    th.textContent = kategorien[i].name;
    kopfzeile.appendChild(th);
  }

  return kopfzeile;
}

// Flow: baut eine einzelne Zelle (Kachel) für eine Frage
function zelleBauen(frage) {
  var zelle = document.createElement("td");

  if (frage !== null) {
    zelle.textContent = frage.points;
    zelle.onclick = function () {
      modalOeffnen(frage, zelle);
    };
  } else {
    zelle.textContent = "-";
  }

  return zelle;
}

// Flow: baut eine ganze Zeile (eine Punktzahl, quer über alle Kategorien)
function zeileBauen(punktzahl, kategorien) {
  var zeile = document.createElement("tr");

  for (var k = 0; k < kategorien.length; k++) {
    var frage = frageFinden(kategorien[k], punktzahl);
    var zelle = zelleBauen(frage);
    zeile.appendChild(zelle);
  }

  return zeile;
}

// Flow: öffnet das Frage-Fenster (Modal)
function modalOeffnen(frage, zelle) {
  aktuelleZelle = zelle;

  modalFrage.textContent = frage.question;
  modalAntwort.textContent = frage.answer;
  modalAntwort.classList.remove("shown");
  buttonAntwortZeigen.style.display = "inline-block";

  overlay.classList.add("active");
}

// Flow: zeigt die Antwort im Modal an
function modalAntwortZeigen() {
  modalAntwort.classList.add("shown");
  buttonAntwortZeigen.style.display = "none";
}

// Flow: schließt das Modal und markiert die Kachel als benutzt
function modalSchliessen() {
  if (aktuelleZelle !== null) {
    aktuelleZelle.classList.add("used");
  }
  overlay.classList.remove("active");
  aktuelleZelle = null;
}


// ================================================
// WORKFLOW
// ================================================

var tabelle = document.getElementById("board");
var overlay = document.getElementById("overlay");
var modalFrage = document.getElementById("modal-clue");
var modalAntwort = document.getElementById("modal-answer");
var buttonAntwortZeigen = document.getElementById("btn-reveal");
var buttonSchliessen = document.getElementById("btn-close");
var aktuelleZelle = null;

function tabelleAufbauen(daten) {
  var kategorien = daten.Kategorie;
  var punktzahlen = [100, 200, 300, 400, 500];

  tabelle.appendChild(kopfzeileBauen(kategorien));

  for (var p = 0; p < punktzahlen.length; p++) {
    var zeile = zeileBauen(punktzahlen[p], kategorien);
    tabelle.appendChild(zeile);
  }
}

function spielStarten() {
  datenLaden().then(function (daten) {
    tabelleAufbauen(daten);
  });
}

buttonAntwortZeigen.onclick = modalAntwortZeigen;
buttonSchliessen.onclick = modalSchliessen;

spielStarten();