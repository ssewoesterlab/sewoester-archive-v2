/*
 * THE SEWÖSTER ARCHIVE — Aufgabenregister
 *
 * Echte Aufgaben werden hier der Reihe nach ergänzt.
 * Antworten werden nicht im Klartext gespeichert, sondern als SHA-256-Prüfsummen.
 * Dadurch sind Lösungen im GitHub-Pages-Quelltext nicht unmittelbar sichtbar.
 */

window.SEWOESTER_PUZZLES = [
  {
    id: 1,
    title: "Das Ankunftsprotokoll",
    subtitle: "Archivfragment 01/2407",
    difficulty: "SCHWIERIG",
    answerLabel: "Gesuchter Vorgang",
    body: [
      "Der ursprüngliche Datensatz wurde beschädigt.",
      "Elf Einträge konnten wiederhergestellt werden. Nur sieben davon gehören zur gesuchten Nachricht.",
      {
        type: "code",
        text:
`ZEIT     ZIMMER   DATENSATZ        STATUS
08:40      200     SCHLUESSEL       ANGEKOMMEN
06:55      321     FRUEHSTUECK      STORNIERT
10:20      110     ANMELDUNG        ANGEKOMMEN
07:35      112     BUCHUNG          ANGEKOMMEN
11:05      305     ABREISE          NICHT ERSCHIENEN
09:50      124     RESERVIERUNG     ANGEKOMMEN
08:05      101     REZEPTION        ANGEKOMMEN
07:10      102     NACHT            ANGEKOMMEN
10:05      411     KORRIDOR         STORNIERT
09:15      210     ANKUNFT          ANGEKOMMEN
07:50      220     HOTEL            NICHT ERSCHIENEN`
      },
      "ARCHIVNOTIZ A — Nur echte Ankünfte erinnern sich.",
      "ARCHIVNOTIZ B — Die Zeit lügt nicht. Was zuerst geschah, spricht zuerst.",
      "ARCHIVNOTIZ C — Zimmer werden kleiner, bevor sie etwas verraten.",
      "ARCHIVNOTIZ D — Die Zahl ist nicht die Antwort. Sie zeigt dir nur, wo du suchen musst.",
      "Gesucht wird der Vorgang, mit dem unsere allererste Nachricht begann."
    ],
    answerHashes: [
      "0630e40913146a92301416fc102decfdc830dbf8af5c8ee1c3176c1e58ab9b55"
    ],
    hints: [
      "Nicht jeder wiederhergestellte Datensatz gehört zur Lösung.",
      "Der Status entscheidet, welche Zeilen überleben.",
      "102 ist für diese Akte nicht 102.",
      "1 + 0 + 2 = 3",
      "Benutze die verkleinerte Zimmernummer als Position innerhalb des Datensatz-Wortes."
    ],
    failureText: "Datensatz nicht bestätigt. Die Rekonstruktion ist fehlerhaft.",
    successText: "Datensatz bestätigt. Der erste Vorgang wurde wiederhergestellt."
  }
];
