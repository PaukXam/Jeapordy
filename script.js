// ================================================
// FLOWS
// Jede Funktion hier macht genau EINE Sache
// und wird vom Workflow weiter unten aufgerufen.
// ================================================

function datenLaden() {
  return fetch("data.json").then(function (antwort) {
    return antwort.json();
  });
}

function frageFinden(kategorie, punktzahl) {
  for (var f = 0; f < kategorie.question.length; f++) {
    var frage = kategorie.question[f];
    if (frage.points === punktzahl) {
      return frage;
    }
  }
  return null; 
}

function kopfzeileBauen(kategorien) {
  var kopfzeile = document.createElement("tr");

  for (var i = 0; i < kategorien.length; i++) {
    var th = document.createElement("th");
    th.textContent = kategorien[i].name;
    kopfzeile.appendChild(th);
  }

  return kopfzeile;
}

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

function zeileBauen(punktzahl, kategorien) {
  var zeile = document.createElement("tr");

  for (var k = 0; k < kategorien.length; k++) {
    var frage = frageFinden(kategorien[k], punktzahl);
    var zelle = zelleBauen(frage);
    zeile.appendChild(zelle);
  }

  return zeile;
}

function modalOeffnen(frage, zelle) {
  aktuelleZelle = zelle;
  aktuelleFrage = frage;

  modalFrage.textContent = frage.question;
  modalAntwort.textContent = frage.answer;
  modalAntwort.classList.remove("shown");
  buttonAntwortZeigen.style.display = "inline-block";

  overlay.classList.add("active");
}

function modalAntwortZeigen() {
  modalAntwort.classList.add("shown");
  buttonAntwortZeigen.style.display = "none";
  teamButtons.classList.add("shown");
}

function punkteVergeben(team) {
  if (team === "team1") {
    team1Punkte = team1Punkte + aktuelleFrage.points;
    team1ScoreFeld.textContent = team1Punkte;
  } else if (team === "team2") {
    team2Punkte = team2Punkte + aktuelleFrage.points;
    team2ScoreFeld.textContent = team2Punkte;
  } else if (team === "team3") {
    team3Punkte = team3Punkte + aktuelleFrage.points;
    team3ScoreFeld.textContent = team3Punkte;
  }

  modalSchliessen();
}

function modalSchliessen() {
  if (aktuelleZelle !== null) {
    aktuelleZelle.classList.add("used");
  }
  teamButtons.classList.remove("shown");
  overlay.classList.remove("active");
  aktuelleZelle = null;
  aktuelleFrage = null;
}


// ================================================
// WORKFLOW
// ================================================

var tabelle = document.getElementById("board");
var overlay = document.getElementById("overlay");
var modalFrage = document.getElementById("modal-clue");
var modalAntwort = document.getElementById("modal-answer");
var buttonAntwortZeigen = document.getElementById("btn-reveal");
var teamButtons = document.getElementById("team-buttons");
var buttonTeam1 = document.getElementById("btn-team1");
var buttonTeam2 = document.getElementById("btn-team2");
var buttonTeam3 = document.getElementById("btn-team3");
var buttonNiemand = document.getElementById("btn-none");
var team1ScoreFeld = document.getElementById("team1-score");
var team2ScoreFeld = document.getElementById("team2-score");
var team3ScoreFeld = document.getElementById("team3-score");

var aktuelleZelle = null;
var aktuelleFrage = null;
var team1Punkte = 0;
var team2Punkte = 0;
var team3Punkte = 0;

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
buttonTeam1.onclick = function () {
  punkteVergeben("team1");
};
buttonTeam2.onclick = function () {
  punkteVergeben("team2");
 };
buttonTeam3.onclick = function () {
  punkteVergeben("team3");
};
buttonNiemand.onclick = function () {
  punkteVergeben("niemand");
};

spielStarten();