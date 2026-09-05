fetch("data.json")
  .then(function (antwort) {
    return antwort.json();
  })
  .then(function (daten) {
    tabelleAufbauen(daten);
  });


function tabelleAufbauen(daten) {
  var kategorien = daten.Kategorie; 
  var tabelle = document.getElementById("board");

  var kopfzeile = document.createElement("tr");

  for (var i = 0; i < kategorien.length; i++) {
    var kategorie = kategorien[i];

    var th = document.createElement("th");
    th.textContent = kategorie.name;

    kopfzeile.appendChild(th);
  }

  tabelle.appendChild(kopfzeile);

  var punktzahlen = [100, 200, 300, 400, 500];

  for (var p = 0; p < punktzahlen.length; p++) {
    var aktuellePunktzahl = punktzahlen[p];
    var zeile = document.createElement("tr");

    for (var k = 0; k < kategorien.length; k++) {
      var kat = kategorien[k];
      var gefundeneFrage = null;

      for (var f = 0; f < kat.question.length; f++) {
        var frage = kat.question[f];
        if (frage.points === aktuellePunktzahl) {
          gefundeneFrage = frage;
        }
      }

      var zelle = document.createElement("td");

      if (gefundeneFrage !== null) {
        zelle.textContent = gefundeneFrage.points;
        macheZelleKlickbar(zelle, gefundeneFrage);
      } else {
        zelle.textContent = "-";
      }

      zeile.appendChild(zelle);
    }

    tabelle.appendChild(zeile);
  }
}


function macheZelleKlickbar(zelle, frage) {
  zelle.onclick = function () {
    fensterOeffnen(frage, zelle);
  };
}

var overlay = document.getElementById("overlay");
var modalFrage = document.getElementById("modal-clue");
var modalAntwort = document.getElementById("modal-answer");
var buttonAntwortZeigen = document.getElementById("btn-reveal");
var buttonSchliessen = document.getElementById("btn-close");

var aktuelleZelle = null;

function fensterOeffnen(frage, zelle) {
  aktuelleZelle = zelle;

  modalFrage.textContent = frage.question;
  modalAntwort.textContent = frage.answer;

  modalAntwort.classList.remove("shown");
  buttonAntwortZeigen.style.display = "inline-block";

  overlay.classList.add("active");
}

buttonAntwortZeigen.onclick = function () {
  modalAntwort.classList.add("shown"); 
  buttonAntwortZeigen.style.display = "none";
};

buttonSchliessen.onclick = function () {
  if (aktuelleZelle !== null) {
    aktuelleZelle.classList.add("used"); 
  }
  overlay.classList.remove("active"); 
  aktuelleZelle = null;
};