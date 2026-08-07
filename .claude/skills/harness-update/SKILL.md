---
name: harness-update
description: Hält die Harness-Bibliothek aktuell — zieht alle Quell-Repos neu, baut den Katalog neu und berichtet, was dazugekommen ist. Nimmt auch neue Repos auf oder entfernt sie. Nutzen bei "/update", "harness update", "Repos aktualisieren", "Bibliothek aktualisieren", "was gibt es Neues", "neues Repo hinzufügen", "Repo aufnehmen", "/harness-update".
---

# /harness-update — Bibliothek aktualisieren

Die Quell-Repos wachsen laufend, und es kommen neue dazu. Diese Skill hält den
Katalog auf Stand und sagt dem User, was sich fachlich geändert hat.

Bibliothek: `C:\Users\info\OneDrive\Desktop\Harnes Creator`
Repo-Klone: `C:\Users\info\.harness-sources\` (bewusst ausserhalb von OneDrive —
sonst synchronisiert OneDrive hunderte Megabyte an `.git`-Objekten)

## Der Befehl

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs update
```

Das führt drei Schritte aus: alle Repos aus `sources.txt` klonen oder pullen, den
Katalog neu aufbauen, und einen Eintrag in `CHANGELOG.md` schreiben. Der Lauf dauert
je nach Netz und Repo-Zahl ein bis mehrere Minuten. Führ ihn im Hintergrund aus,
wenn du parallel weiterarbeiten willst.

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

```powershell
Remove-Item "C:\Users\info\.harness-sources\owner__repo" -Recurse -Force
```

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

1. `catalogGeneratedAt` aus dem Manifest gegen den aktuellen Katalog halten
2. Für die betroffenen IDs im `CHANGELOG.md` nachsehen, ob sie unter "Geändert" stehen
3. Dem User die Liste vorlegen und ihn entscheiden lassen
4. Nur mit ausdrücklicher Zustimmung: `install <id> --to <projekt> --force`

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
