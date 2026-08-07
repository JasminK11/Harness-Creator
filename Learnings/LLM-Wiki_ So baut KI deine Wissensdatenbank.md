---
title: "LLM-Wiki: So baut KI deine Wissensdatenbank"
source: "https://www.youtube.com/watch?v=RU8Ad_5rrnE"
author:
  - "[[Philip Thomas]]"
published: 2026-07-15
created: 2026-08-07
description: "Community: https://philipthomas.de/lp-youtubeKarpathys Github Gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94fGoogles Open Knowledge Format: https://github.com/GoogleCloudPla"
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=RU8Ad_5rrnE)

Community: https://philipthomas.de/lp-youtube  
  
Karpathys Github Gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f  
Googles Open Knowledge Format: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md  
  
Ist das LLM-Wiki die bessere Alternative zu klassischem RAG? In diesem Video erfährst du, wie das Konzept von Andrej Karpathy funktioniert, wie du mit einem KI-Agenten, Markdown und Obsidian deine eigene Wissensdatenbank aufbaust und welche Rolle Googles Open Knowledge Format dabei spielt.  
  
Außerdem vergleichen wir die Stärken und Schwächen von LLM-Wikis und RAG-Systemen und klären, für welche Anwendungsfälle sich welcher Ansatz eignet.  
  
00:00 Intro  
00:36 Was das LLM-Wiki lösen will  
03:14 Googles Open Knowledge Format  
04:25 Tutorial: Eigenes LLM-Wiki bauen  
12:50 Anwendungsfälle für das LLM-Wiki  
13:59 Kritik am LLM-Wiki  
16:00 Mein Fazit zum LLM-Wiki  
  
#KI #LLM #RAG #Obsidian #llmwiki

## Transcript

### Intro

**0:00** · Es gibt eine neue vermeintlich bessere Alternative zu RAC, also dem klassischen Weg, wie man einem KI-Agenten eine Wissensdatenbank hinzufügt. Und die kommen von niemand geringerem als Andre Karty, dem ehemaligen Mitbegründer von Open AI und AI Direktor bei Tesla. Und selbst Google hat die Idee inzwischen aufgegriffen und weiterentwickelt.

**0:19** · Die Rede ist von LM und wir schauen uns heute an, was genau ein LM ist, wie ihr euch ganz einfach ein eigenes LM bauen könnt, wofür sich das Ganze eignet und ob es dann tatsächlich besser ist als ein klassisches Rexystem.

### What the LLM Wiki aims to solve

**0:38** · Bei einem klassischen Rex System, also Retrieval Augmented Generation, werden deine Dokumente in kleine Abschnitte aufgeteilt, sogenannte Chunks. Jeder Chunk wird in einen Zahlencode umgerechnet, der seine Bedeutung abbildet. Diese Codes nennt man Embeddings und sie landen in einer Vektordatenbank, wo inhaltlich ähnliches nahbeieinander liegt. Stellst du eine Frage, wird auch sie in so einen Zahlencode umgerechnet und das System holt sich per Ähnlichkeitssuche die Chunks, die inhaltlich am nächsten dran liegen. Aus diesen Treffern baut die KI dann ihre Antwort.

**1:10** · Das funktioniert auch soweit. Kapatis Kritik ist aber, das System baut die Zusammenhänge zwischen den Chunks nicht einmalig beim Einlesen der Dokumente auf, sondern bei jeder Frage neu. Führt die KI Chunks aus drei verschiedenen Dokumenten zusammen, ist diese Verknüpfung nach der Antwort wieder weg. Das klingt erstmal nach einem reinen Effizienzproblem. Die KI macht halt jedes Mal dieselbe Arbeit.

**1:34** · Der eigentliche Haken ist aber die Qualität. Weil nie ein Abgleich stattfindet, bleiben Widersprüche unbemerkt nebeneinander stehen. Lädst du ein Dokument hoch, das einem Älteren widerspricht, wird es nicht abgeglichen, sondern einfach zusätzlich abgelegt.

**1:49** · Beide Versionen liegen danach gleichberechtigt in der Datenbank. Und wenn die KI aus mehreren Dokumenten etwas Neues zusammenreimt, dann ist dieser Gedanke nach der Antwort wieder verschwunden. Er wird nirgendwo festgehalten. Fragst du später noch mal, musst du hoffen, dass die KI wieder die gleichen Schlüsse zieht. Kartis Idee dreht das Ganze um.

**2:08** · Die eigentliche Denkarbeit, also das Lesen, Zusammenfassen, Verknüpfen und Widersprüche auflösen, passiert nur ein einziges Mal, nämlich beim Einpflegen neuer Dokumente und nicht bei jeder einzelnen Frage, die du dann an das System stellst. Konkret lässt man die KI ein strukturiertes Wiki aus Markdown Dateien aufbauen und laufend pflegen.

**2:30** · Kommt eine neue Quelle rein, wird sie nicht einfach abgelegt. Die KI liest sie, arbeitet die Erkenntnisse in die bestehenden Seiten ein, ergänzt Querverweise und löst Widersprüche auf oder markiert sie zumindest. Und da es sich um lesbare Markdown Dateien handelt, kannst du nach diesem Schritt einmalig prüfen, ob die generierte Wissensdatenbank alles Wichtige enthält und deinen Vorstellungen entspricht.

**2:53** · Dazu pflegt die KI ein Inhaltsverzeichnis mit, also einen Überblick, was wo im Wiki steht. Genau dieses Inhaltsverzeichnis soll die Vektordatenbank und Ähnlichkeitssuche wie bei einem Rexystem überflüssig machen. Hast du eine Frage, liest die KI erst das Inhaltsverzeichnis, öffnet gezielt die passenden Seiten und beantwortet daraus dann deine Frage.

### Google's Open Knowledge Format

**3:16** · Das grobe Konzept für das LM Wiki hat Carpati in einer einzigen Datei zusammengefasst und über ein Gitub Gist geteilt. Wie ist dafür gedacht, dass du sie deinem KI Agenten gibst und der dann zusammen mit dir dein persönliches Wiki aufsetzt? Kapati gibt dabei bewusst nur die Idee vor und keine feste Struktur.

**3:34** · Und weil so ein Wiki, wenn man nur eine grobe Idee reingibt, jedes Mal anders strukturiert ist, hat Google Cloud einen offenen Standard dafür entwickelt, das Open Knowledge Format kurz OKF. Das legt mit ein paar festen Regeln fest, wie so ein Wiki bzw. also die einzelnen Seiten im Wiki aufgebaut sein sollen. Das ist wie bei Kapatis LLM Wiki eigentlich nur eine einzige Datei, die man beim Erstellen des Wikis seinem KI Agenten mitgeben muss, damit dieser weiß, wie er das Ganze strukturieren soll.

**4:02** · Warum so ein festes Format überhaupt was bringt, kennst du vielleicht schon von Agent Skills. Die sind ja im Grunde auch nur ein festgelegtes Format, mit dem man einem KI-Agenten spezielles Wissen mitgeben kann. Und weil sich daran alle halten, kann man Skills ohne Anpassung untereinander austauschen. Bei OK ist es ein ähnlicher Gedanke, nur eben für Wikis.

### Tutorial: Building your own LLM Wiki

**4:27** · Das einzige, was du auf jeden Fall für dein LM Wiki brauchst, ist einen KI Agenten zum Schreiben und Lesen von Dateien auf deinem Computer. Ich benutze Cloud Code. Du kannst aber auch einen beliebigen anderen nutzen, wie z.B.

**4:39** · Codex oder Open Code. Mehr brauchen wir theoretisch nicht, denn unser Wiki ist am Ende eigentlich nur ein Ordner mit Markdown Dateien, die von unserem Agenten geschrieben und verwaltet werden. Ich benutze in dieser Demo außerdem Obsidian, um durch mein Wiki zu navigieren. Wer Obsidian noch nicht kennt, das ist im Kern eine kostenlose Notizapp, mit der man sich die Zusammenhänge im Wiki gut visualisieren lassen kann. Entsprechend ist das auch K Partys Empfehlung. Ihr könnt alternativ aber genauso gut eine IDE wie Visual Studio Code oder sogar einen ganz normalen Texteditor dafür nehmen.

**5:13** · Obsidian kannst du kostenlos auf obsidian.m runterladen. Sobald du das gemacht hast, startest du die App und kannst dann einen neuen Wol erstellen.

**5:22** · WT ist in diesem Fall einfach nur eine andere Bezeichnung für einen Ordner auf deinem Computer. Du gibst einfach einen Namen deiner Wahl ein. Ich nehme jetzt hier mal Fotoi. Dann wählst du den Ort zum Speichern aus und klickst auf Create. Jetzt landen wir direkt in unserem Wult und sehen hier eine Welcome Datei. Die brauchen wir nicht und deswegen löschen wir sie einfach wieder.

**5:42** · Wir können jetzt theoretisch die ganze Grundstruktur vom Wiki selbst anlegen, aber wir lassen uns das Ganze in einem nächsten Schritt komplett von unserem KI Agenten bauen. Und damit das Wiki jetzt auch wirklich der Idee von Karty und Googles Open Knowledge Format folgt, geben wir der KI zwei Textdateien an die Hand. Die verlinke ich euch in der Beschreibung. Die erste Datei ist aus Kartis Gitup Gist zum LM Wiki.

**6:04** · Dort hat er wie eben schon gesagt grob festgehalten, wie so ein Wiki aufgebaut sein soll und welche Aktion die KI durchführen soll, nämlich das Hinzufügen von Quellen zum Wiki, das Abfragen von Wissen, wenn du Fragen hast und das Überprüfen und Korrigieren des Wikis.

**6:21** · Die zweite Datei ist die Speckmd von Google. Die Speckmd konkretisiert das Format des Wikis, also z.B. welche Metadaten oben auf einer Wiki Seite stehen, wie das Inhaltsverzeichnis aussieht und so weiter. Beide Dateien habe ich mir jetzt einmal heruntergeladen und in meinem Foto Wiki Ordner gespeichert.

**6:37** · Jetzt starte ich über das Terminal in meinem LM Wiki Ordner Cloud und sage ihm einfach, bitte li LM Wiki MD, also Kartys ED für ein persönliches Wiki und die Speckmd, also Google Spezifikation für ein standardisiertes Format im aktuellen Ordner und erstelle daraus nur die Struktur und Datei bzw. Ordnergrundlage für ein persönliches Fotografie Wiki.

**7:02** · Fülle keine Inhalte aus, lege nur das Gerüst nach Kapatis Konzept an und halte dich dabei an die Google Spezifikationen. Und jetzt warten wir mal ab, was Cloud uns hier zusammenbaut.

**7:13** · So, Clud hat uns jetzt die Grundstruktur für unser Wiki gebaut und die entspricht genau Kartis Idee. Erstmal haben wir hier unseren RAW Ordner. Das ist der Ordner, in den ihr die Originaldokumente legt, deren Inhalt ins Wiki aufgenommen werden soll. Das können Bilder, Transkripte, Notizen, PDFs und so weiter sein. Cloud darf diese Dateien nicht ändern, sondern nur lesen. Als zweites haben wir den Wiki Ordner. Hier landen die Markdown Dateien, die die KI auf Basis eurer Originaldateien komplett selbst schreibt und pflegt.

**7:45** · Also das ist euer eigentliches Wiki. Cloud hat das Thema Fotografie jetzt auch schon mal in Unterthemen heruntergebrochen und Unterordner erstellt, die natürlich jetzt noch leer sind. Außerdem gibt es noch zwei spezielle Dateien im Wiki Ordner. Die erste ist die Index MD, dein Inhaltsverzeichnis. In unserem Fall hat Cloud das sogar zweistufig angelegt.

**8:05** · Die oberste Index MD verlinkt auf die einzelnen Themen Unterordner und in jedem Unterordner liegt noch mal eine eigene Index MD, die die Seiten darin auflistet, jeweils mit kurzer Beschreibung. Der Sinn dahinter: Die KI muss nicht bei jeder Frage das komplette Wiki lesen. Sie schaut erst in den Index, findet über die Beschreibungen die relevanten Seiten und öffnet gezielt nur diese. Die zweite Datei ist die LogmD, das Änderungsprotokoll.

**8:31** · Da wird nichts gelöscht, sondern nur ergänzt mit Zeitstempel, wann was dazu kam oder sich geändert hat. So kannst du später nachvollziehen, wie sich dein Wiki entwickelt hat. Und als drittes haben wir eine Skema Datei. Wie die Datei genau heißt, hängt von eurem KI Agenten ab. Bei Codex wäre es z.B. die Agents MD und in unserem Fall, weil wir Cloud nutzen, ist das die Cloud MD. Diese Datei ist quasi die Bedienungsanleitung für die KI.

**9:00** · Da steht drin, wie das Wiki strukturiert ist. was passieren soll, wenn eine neue Quelle reinkommt oder ich eine Frage stelle, wie die KI bei Widersprüchen vorgeht und so weiter.

**9:10** · Beim Schreiben der Datei hat Cloud sich an Kartis Idee zum LM Wiki und Googles Open Knowledge Format für die Standardisierung orientiert. Die können wir jetzt aber natürlich noch an unsere eigenen Vorstellungen anpassen. Wenn ich z.B. bei jedem Hinzufügen einer Datei erstmal einen genauen Plan von Cloud haben möchte, welche Seiten er in meinem Wiki anpasst oder hinzufügt, könnte ich das hier noch konkretisieren. Ich würde die Datei jetzt aber erstmal so lassen.

**9:37** · Um jetzt die ersten Inhalte zu eurem Wiki hinzuzufügen, müsst ihr eigentlich nichts weiter tun, als eine Datei in den RAW Ordner zu legen, in euren Chat mit Cloud zu wechseln und ihm zu sagen, dass er die Datei hinzufügen soll. Ich füge jetzt als Beispiel einmal den Wikipedia Artikel zum Thema Fotografie hinzu. Um das möglichst einfach zu machen, habe ich die Obsidian Webclipper Extension aktiviert. Mit der kann man Internetseiten direkt als Markdown in Obsidian laden. Dafür klicke ich, wenn ich auf der gewünschten Seite bin, hier oben auf das Obsidian Symbol und danach auf Add to Obsidian.

**10:08** · In Obsidian findet man diese Seite dann unter Clippings und die ziehe ich von dort einmal in unseren RAW Ordner. Und jetzt wechsel ich ins Terminal und sage Cloud, ich habe die erste Datei in den RAW Ordner gelegt.

**10:22** · Bitte dem Wiki hinzufügen. Und jetzt sehen wir, dass unser Wiki sich mit Wissen gefüllt hat. Z.B. sehen wir im Ordner Concepts, eine Seite zur Fotografie als Kunst, wobei wir hier oben ein paar Metaden haben, die orientieren sich an Googles Open Knowledge Format und darunter dann den eigentlichen Inhalt schön zusammengefasst und strukturiert und mit Verweisen zu anderen Themen. Und wenn ich jetzt in Obsidian über die seitliche Navigation in den sogenannten Grathiew wechsle, sehe ich mein ganzes Wiki als grafische Darstellung.

**10:51** · Jedes Thema ist ein Punkt und die Linien dazwischen sind die Verknüpfungen. Ich kann einzelne Punkte anklicken, sehe deren Verbindungen und kann mich von da direkt zu den einzelnen Themen durchklicken.

**11:03** · Man kann übrigens anpassen, was in diesem Grafen angezeigt wird. Aktuell werden alle Verbindungen zwischen allen Dateien in meinem Oberordner angezeigt, aber ich will eigentlich nur meinen Wiki Ordner sehen. Und auch im Wiki Ordner brauche ich z.B. die Indexdateien nicht, die ja einfach nur auf die ganzen Unterseiten des Ordners verlinken.

**11:23** · Anpassen kann man das Ganze über Einstellungen, Files and Links, Advanced, excluded Files und da kann man dann Filter hinzufügen. Ich habe das jetzt hier über eine regular Expression gemacht und ich will jetzt auch einmal wissen, ob Cloud mir mit Hilfe des Wikis Antworten auf meine Fragen geben kann.

**11:41** · Konkret frage ich jetzt mal, was kannst du mir zum entscheidenden Augenblick sagen? Und Clord geht jetzt genauso vor, wie wir uns das vorgestellt haben. Er schaut sich erstmal alles an, was im Index steht, welche Seite relevant sein könnte, liest die durch und gibt mir die richtige Antwort. Neben dem Hinzufügen und dem Abfragen von Wissen gibt's noch eine dritte Aktion, die von Kati vorgesehen und auch in unserer Cloud MD beschrieben ist. Und das ist die Überprüfung des Wikis.

**12:07** · Es können sich natürlich mit der Zeit und mit dem Wachsen des Wikis Fehler einschleichen und genau das wollen wir natürlich vermeiden, damit das Wiki langfristig brauchbar bleibt. Entsprechend bitte ich Cloud jetzt einmal das ganze Wiki zu überprüfen, auch wenn das jetzt natürlich noch nicht so viel Sinn ergibt. Das ganze mache ich mit dem Prompt. Bitte überprüfe das gesamte Wiki und er hat auch tatsächlich ein paar Kleinigkeiten gefunden, obwohl wir nur eine einzige Quelle bisher hinzugefügt haben.

**12:34** · Unter anderem habe ich mich scheinbar in der Zwischenzeit einmal verklickt und aus Versehen einen neuen Ordner Konzepts angelegt, den es eigentlich schon gibt. Da wartet er auf meine Erlaubnis, den zu löschen, was ich ihm jetzt einmal erlaube, damit unser Wiki wieder sauber ist. \[musik\] Jetzt wo ihr das Wiki in Aktion gesehen habt, stellt ihr euch vielleicht die Frage, wann so ein LM Wiki überhaupt Sinn ergibt.

### Use cases for the LLM Wiki

**12:58** · Kapati hat in seinem GitHub Gist ein paar Anwendungsfälle aufgelistet, z.B. die Recherche zu einem bestimmten Thema oder auch zu einem persönlichen Hobby wie Fotografie. Für solche Anwendungsfälle finde ich so einen sehr pragmatischen und einfachen Ansatz valide. Ihr wollt euch wahrscheinlich nicht lange mit dem Setup rumschlagen und der Aufwand ist mit so einem Wiki recht überschaubar. Außerdem habt ihr auch, wenn ihr nicht die KI benutzt, um euch Fragen beantworten zu lassen, ein übersichtliches und für euch verständliches Nachschlagewerk, in das ihr jederzeit reinschauen könnt.

**13:29** · Bei einem klassischen Rex System mit einer Vektordatenbank ist das Ganze natürlich deutlich abstrakter und weniger einfach nachzuvollziehen. Ein Punkt, der aber außerdem auftaucht und den auch Google als Anwendungsfall nennt, ist der Unternehmenskontext. Und den finde ich ehrlich gesagt etwas problematisch, denn es gibt ein paar echte Probleme beim LM Wiki, die aus meiner Sicht nicht vernachlässigbar sind, wenn man sich in einem professionellen Kontext befindet, in dem das Wiki zuverlässig funktionieren muss.

### Criticism of the LLM Wiki

**14:01** · Eine Schwäche des Wikis ist verlustbehaftete Kompression. Das Wiki ist ja nicht die Originalquelle, sondern eine Umformulierung davon. Wenn in einer Quelle wichtige Einschränkungen stehen, also z.B. Dieses Ergebnis gilt nur unter Bedingung X, dann kann es passieren, dass die KI diese Einschränkung in der Wiki Zusammenfassung weglässt. Wenn ihr dann später nur noch das Wiki lest, ist diese Einschränkung effektiv aus eurer Wissensbasis verschwunden. Und jedes Mal, wenn dieses komprimierte Wissen erneut aktualisiert wird, kann sich der Fehler weiter verstärken.

**14:32** · Dazu kommt das Problem der sauberen Aktualisierung.

**14:37** · Wenn eine neue Quelle zwölf bestehende Seiten betrifft, wie stellt man sicher, dass Konflikte sauber aufgelöst und alle wichtigen Stellen angepasst werden?

**14:45** · Kapatis Antwort ist human in the loop, also dass ihr jede Quelle einzeln einarbeiten lasst und die Updates überprüft. Das ist natürlich etwas Arbeit, fängt aber offensichtliche Fehler ab. Was es nicht abfängt, sind Sachen, die weggelassen werden, weil ihr ja nur das seht, was die KI geschrieben hat. Wenn ihr euch jetzt dagegen absichern wollt, indem ihr jede Quelle vollständig selbst lest, dann ist ein großer Teil des Effizienzgewinns davon, dass die KI das Wiki schreibt wieder weg. Das nächste, was problematisch werden könnte, ist das gleichzeitige Bearbeiten durch mehrere Personen.

**15:17** · Wie stellt man sicher, dass man sich nicht gegenseitig beim Updaten in die Quere kommt? Dafür gibt es aktuell keine Lösung. Die letzte Schwäche, die ich nennen möchte, ist die Skalierung.

**15:30** · Kapati sagt selbst, dass sein Wiki bei rund 100 Quellen und mehreren hundert Seiten ganz gut funktioniert. Darüber hinaus kann es aber schwieriger werden.

**15:39** · Sobald der Index samt der relevanten gelesenen Seiten nicht mehr komplett in den Kontext passt, braucht ihr wieder eine echte Suche mit Ranking über die Wiki Seiten. Also ein Teil genau der Infrastruktur, die man mit dem reinen Index eigentlich vermeiden wollte. Und auch das saubere Aktualisieren und überprüfen wird mit wachsendem Wiki für die KI immer schwieriger.

### My conclusion on the LLM Wiki

**16:02** · \[musik\] Kapati hat recht damit, dass klassische Rexysteme echte Schwächen haben. Das LM Wiki ist eine sehr einfache Antwort darauf und klingt fast so gut, um wahr zu sein. Ihr habt es in kurzer Zeit stehen, braucht keine Datenbank und kein großes technisches Wissen. Was in der ganzen R ist Toddiskussion aber fast immer untergeht, das Wiki ist nicht der einzige Weg diese Schwäche anzugehen.

**16:26** · Auch in der Rwelt gibt es schon länger fortgeschrittenere Ansätze, die die von Kapati geschilderten Probleme adressieren. Nur haben die ihren Preis.

**16:35** · Während ihr das Wiki in wenigen Minuten aufsetzt, braucht ihr dafür deutlich mehr Zeit und auch echtes Fachwissen.

**16:41** · Was außerdem fehlt, sind belastbare Tests, beide Ansätze gegeneinander. Wir wissen überhaupt nicht, wie gut ein LMI im Vergleich zu einem Rex System abschneidet. Was wir aber wissen, beides sind komplett unterschiedliche Ansätze mit unterschiedlichen Stärken und Schwächen. Und deswegen würde ich sowieso keine der beiden Lösungen als Ersatz für die andere sehen. Wenn ihr eine kleine Wissensdatenbank für euch selbst aufbauen wollt und euch ist wichtig, dass das Ergebnis für euch lesbar und der Ansatz einfach ist, würde ich euch eher kein Rexystem mit einer Vektordatenbank empfehlen.

**17:13** · Wenn ihr im Unternehmenskontext seid und einen internen Chatboot bauen wollt, der auch Zugang zu einer Datenbank hat und dort Live Daten auslesen kann, wäre einic System passender als ein LM Wiki.

**17:27** · Welcher Weg für euch der Richtige ist, hängt davon ab, was ihr genau braucht und wie viel Aufwand ihr bereit seid zu investieren. Mein Rat daher zum Schluss: probiert das Wikipattern aus, wenn euer Usecase dazu passt und ihr möglichst schnell ohne Vielfachwissen starten wollt. Ein pauschaler Ersatz für R ist es aber nicht. Ich hoffe euch hat das Video gefallen und vor allem geholfen LM Wiki zu verstehen und vielleicht auch euer eigenes aufzubauen. Sollte dem so sein, lasst gerne ein Like da.

**17:53** · Solltet ihr noch Fragen haben, schreibt sie gerne in die Kommentare und wenn ihr keine Videos dieser und ähnlicher Art mehr verpassen wollt, abonniert auch gerne den Kanal. Und wenn ihr tiefer in das Thema KI und Automation einsteigen wollt, dann schaut auch gerne in der Community vorbei. Den Link findet ihr unten in der Beschreibung. In diesem Sinne, bis zum \[musik\] nächsten Mal.

**18:15** · เ \[musik\]