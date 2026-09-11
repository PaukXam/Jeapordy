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

function zelleBauen(frage, kategorieName) {
  var zelle = document.createElement("td");

  if (frage !== null) {
    zelle.textContent = frage.points;
    zelle.onclick = function () {
      modalOeffnen(frage, zelle, kategorieName);
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
    var zelle = zelleBauen(frage, kategorien[k].name);
    zeile.appendChild(zelle);
  }

  return zeile;
}

function modalOeffnen(frage, zelle, kategorieName) {
  aktuelleZelle = zelle;
  aktuelleFrage = frage;

  modalKategorie.textContent = kategorieName;
  modalFrage.textContent = frage.question;
  modalAntwort.textContent = frage.answer;
  modalAntwort.classList.remove("shown");
  buttonAntwortZeigen.style.display = "inline-block";

  if (frage.image) {
    modalBild.src = frage.image;
    modalBild.classList.add("shown");
  } else {
    modalBild.src = "";
    modalBild.classList.remove("shown");
  }

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
  } else if (team === "team2") {
    team2Punkte = team2Punkte + aktuelleFrage.points;
  } else if (team === "team3") {
    team3Punkte = team3Punkte + aktuelleFrage.points;
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

function punktestandVerstecken() {
  team1ScoreFeld.textContent = "?";
  team2ScoreFeld.textContent = "?";
  team3ScoreFeld.textContent = "?";
}

function punktestandAufdecken() {
  team1ScoreFeld.textContent = team1Punkte;
  team2ScoreFeld.textContent = team2Punkte;
  team3ScoreFeld.textContent = team3Punkte;
}

var tabelle = document.getElementById("board");
var overlay = document.getElementById("overlay");
var modalKategorie = document.getElementById("modal-category");
var modalFrage = document.getElementById("modal-clue");
var modalBild = document.getElementById("modal-image");
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
var buttonPunktestandZeigen = document.getElementById("btn-punktestand-zeigen");

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
buttonPunktestandZeigen.onmousedown = punktestandAufdecken;
buttonPunktestandZeigen.onmouseup = punktestandVerstecken;
buttonPunktestandZeigen.onmouseleave = punktestandVerstecken;
buttonPunktestandZeigen.ontouchstart = punktestandAufdecken;
buttonPunktestandZeigen.ontouchend = punktestandVerstecken;

punktestandVerstecken();
spielStarten();