---
name: harness-update
description: Wirkt auf die BIBLIOTHEK selbst, nie auf ein Zielprojekt. Zieht alle Quell-Repos neu, baut den Katalog neu und berichtet, was fachlich dazugekommen ist. Nimmt auch Repos in sources.txt auf oder entfernt sie. Nutzen bei "/update", "harness update", "Repos aktualisieren", "Bibliothek aktualisieren", "was gibt es Neues", "neues Repo hinzufügen", "Repo aufnehmen", "/harness-update". Installiert nichts in ein Projekt (das ist /harness-build) und plant kein Vorhaben (das ist /harness-plan).
---

# /harness-update — Bibliothek aktualisieren

Die Quell-Repos wachsen laufend, und es kommen neue dazu. Diese Skill hält den
Katalog auf Stand und sagt dem User, was sich fachlich geändert hat.

Bibliothek: `<projektverzeichnis>`
Repo-Klone: das Klon-Verzeichnis (`~/.harness-sources`, überschreibbar mit
HARNESS_SOURCES — bewusst ausserhalb von Cloud-Sync-Ordnern, sonst synchronisieren
diese hunderte Megabyte an `.git`-Objekten)

## Der Befehl

```bash
cd "<projektverzeichnis>"
node tools/harness.mjs update
```

Das führt **vier** Schritte aus: alle Repos aus `sources.txt` klonen oder pullen, den
Katalog neu aufbauen, den Changelog-Eintrag zusammenstellen, und die Routing-Evals
fahren. Der Lauf dauert je nach Netz und Repo-Zahl ein bis mehrere Minuten. Führ ihn
im Hintergrund aus, wenn du parallel weiterarbeiten willst.

`CHANGELOG.md` **entsteht bei diesem Lauf**; vor dem ersten `update` gibt es sie nicht.
Geschrieben wird sie erst nach Schritt 4, damit die Eval-Zeile im obersten Abschnitt
steht und nicht als Nachtrag darunter.

### Schritt 4 ist eine Sperre, kein Anhängsel

`update` fährt am Ende `eval` über den **soeben gebauten** Katalog: findet die Suche
noch, was sie finden soll? Ein neues Repo, das die bisherigen Treffer verdrängt, ist
ein Ergebnis genau dieses Laufs — später gemessen wäre die Ursache nicht mehr
zuzuordnen.

**Der Exit-Code von `update` hängt damit am Eval-Lauf.** Ein Update, das die Suche
verschlechtert, ist kein erfolgreiches Update. Fehlt das `evals/`-Verzeichnis, wird
der Schritt übersprungen und der Lauf endet trotzdem regulär.

**Ein roter Eval-Lauf geht an den User, nicht in die Rohausgabe.** Die Zeile
`Routing-Evals: X von Y Pflichtfällen bestanden` steht im obersten Abschnitt von
`CHANGELOG.md` — lies sie und melde sie ausdrücklich, wenn X kleiner als Y ist oder
Rangänderungen gemeldet werden. Sag dazu, welcher Fall gefallen ist und welches Repo
in diesem Lauf dazukam; das ist meistens dieselbe Antwort. Nachfahren lässt sich der
Lauf jederzeit einzeln:

```bash
node tools/harness.mjs eval
```

Die Ausgabe verwendet folgende Zeichen pro Repo:

| Zeichen | Bedeutung |
|---|---|
| `=` | unverändert |
| `^` | aktualisiert (neue Commits geholt) |
| `+` | neu geklont |
| `!` | Fehler — siehe Fehlerbehandlung |
| `?` | Klon liegt noch da, steht aber nicht mehr in `sources.txt` |

## Fachlich berichten, nicht Zahlen dumpen

Der Rohtext des CLI hilft dem User wenig. "25.593 Bausteine, 42 neu" sagt nichts
darüber, ob etwas Brauchbares dazugekommen ist.

Lies stattdessen den obersten Abschnitt von `CHANGELOG.md` — er listet die neuen und
geänderten Bausteine mit Beschreibung. Sieh dir die interessanten mit
`node tools/harness.mjs show <id> --head 25` an und berichte dann in dieser Form:

- Wie viele Repos aktualisiert wurden, wie viele Bausteine netto dazukamen
- **Welche neuen Bausteine sich lohnen und wofür** — das ist der eigentliche Bericht.
  Zwei bis fünf Stück, mit dem Problem, das sie lösen.
- Was entfernt wurde, falls etwas verschwunden ist. Das ist relevant, wenn ein
  Projekt diesen Baustein installiert hat.
- Fehler, in verständlicher Form zusammengefasst

Wenn sich nichts geändert hat, sag das in einem Satz. Kein Bericht über nichts.

## Neues Repo aufnehmen

Der User nennt eine GitHub-URL. Vorgehen:

1. **Kurz prüfen, ob es passt.** Hol dir die README des Repos und sieh nach, ob dort
   überhaupt Claude-Bausteine drin sind — `SKILL.md`-Dateien, `agents/`, `commands/`,
   `hooks/`, `.claude/`. Wenn nicht, sag das dem User, bevor du es aufnimmst. Ein Repo
   ohne Bausteine liefert null Einträge und kostet nur Klonzeit.

2. **Zeile in `sources.txt` eintragen**, in den thematisch passenden Abschnitt. Die
   Datei hat Kommentar-Überschriften der Form `# --- Thema ---`. Gibt es kein
   passendes Thema, leg einen neuen Abschnitt an.

   ```
   # --- Neues Thema ---
   https://github.com/owner/repo
   ```

   Zwei optionale Zusätze:
   - Branch: `https://github.com/owner/repo #develop`
   - `!bulk` am Zeilenende, wenn das Repo sehr viele Bausteine liefert. Es bleibt
     dann katalogisiert, taucht aber nicht in der Standardsuche auf, sondern nur mit
     `--repo`, `--domain` oder `--all`. Ohne Marker greift die Automatik ab 2000
     Bausteinen.

3. **`update` laufen lassen.**

4. **Berichten, was das Repo beigesteuert hat** — Anzahl und Art der Bausteine, und
   ob etwas davon für die laufenden Projekte des Users interessant ist.

## Repo entfernen

Zeile aus `sources.txt` löschen oder mit `#` auskommentieren, dann `update`.

Das CLI meldet den Klon danach als `?` — er bleibt auf der Platte liegen. **Das ist
Absicht: das CLI löscht nie von selbst.** Wenn der User den Platz zurückwill:

```bash
rm -rf "$HARNESS_SOURCES/owner__repo"
```

`$HARNESS_SOURCES` ist dieselbe Variable, die auch das CLI auswertet; ist sie nicht
gesetzt, gilt der Standard `~/.harness-sources`.

Weis den User darauf hin, wenn ein Projekt Bausteine aus diesem Repo installiert hat
— die bleiben dort funktionsfähig, bekommen aber keine Updates mehr.

## Fehlerbehandlung

Das CLI bricht bei einem Repo-Fehler nicht ab, sondern macht mit dem nächsten weiter
und meldet den Fehler am Ende. Häufige Fälle:

| Meldung | Ursache | Was tun |
|---|---|---|
| `repository not found` | URL falsch, Repo gelöscht oder privat | URL prüfen; bei privat ist Git-Authentifizierung nötig |
| `couldn't find remote ref` | Branch existiert nicht (mehr) | Branch-Angabe in `sources.txt` korrigieren oder weglassen |
| `could not resolve host` | keine Netzverbindung oder Proxy | später erneut versuchen |
| `SSL certificate problem` | Proxy oder Firewall im Weg | Netzwerk klären, nicht die Zertifikatsprüfung abschalten |

Fasse Fehler zusammen, statt den Rohtext weiterzureichen: "11 von 13 Repos
aktualisiert. `owner/repo` ist nicht erreichbar (Repo gelöscht oder privat),
`owner2/repo2` hat keinen Branch `main` mehr."

## Drift: installierte Bausteine gegen aktuellen Katalog

Projekte, die mit `install` Bausteine übernommen haben, führen
`.claude/harness-manifest.json` mit. Darin steht `catalogGeneratedAt` — der Stand des
Katalogs zum Installationszeitpunkt.

Weicht der vom aktuellen Katalog ab, kann sich der Baustein in der Quelle geändert
haben. **Nie automatisch überschreiben.** Der User kann den Baustein im Projekt
angepasst haben; ein stilles Update würde diese Arbeit zerstören.

Richtiges Vorgehen, wenn der User das prüfen will:

```bash
node tools/harness.mjs check --to <projekt>
```

Der Befehl meldet je Eintrag einen von drei Zuständen: `[aktuell]`,
`[geändert]` oder `[entfernt]`; er endet mit Exit-Code 1 nur bei echten
Brüchen (entfernte IDs, fehlende Dateien) und ist damit als Schranke in
Skripte benutzbar. Lokale Anpassungen an installierten Dateien werden
zusätzlich als „lokal angepasst" gemeldet. Die Liste dem User vorlegen und
ihn entscheiden lassen; nur mit ausdrücklicher Zustimmung
`install <id> --to <projekt> --force`. Als Rückfallebene, etwa wenn `check`
nicht verfügbar ist: `catalogGeneratedAt` aus dem Manifest gegen den
aktuellen Katalog halten und im `CHANGELOG.md` nachsehen, ob die IDs unter
"Geändert" stehen.

## Wann updaten

- **Nicht bei jedem Projektstart.** Der Lauf kostet Zeit und liefert meist nichts,
  was die aktuelle Auswahl ändert.
- **Sinnvoll:** vor einem grösseren Harness-Umbau, nach dem Aufnehmen eines neuen
  Repos, und in lockerem Rhythmus — etwa wöchentlich — um mitzubekommen, was
  dazugekommen ist.
- **Immer:** wenn eine Suche nichts Passendes findet und der Verdacht besteht, dass
  es das Gesuchte inzwischen geben müsste.

## Verwandte Skills

- `/harness-build` — Bausteine für ein konkretes Projekt auswählen und installieren
