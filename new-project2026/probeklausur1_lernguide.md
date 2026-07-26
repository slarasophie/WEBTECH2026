# Lernguide: Probeklausur 1 (Circle-Aufgabe)

Ziel: die Konzepte verstehen, die in der Aufgabe stecken, damit du sie selbst anwenden kannst — nicht nur diese eine Lösung auswendig lernen. Die Aufgabe kombiniert Stoff aus Übung 6 (Listen/Mengen), 7 (Maps), 5 (Exceptions), 9-11 (Lambdas/Streams) und 8 (Interfaces/Comparable).

## 1. `union(list1, list2)` — Duplikate entfernen mit `Set`

**Kernidee:** Ein `Set` speichert per Definition keine Duplikate (Gleichheit wird über `equals()`/`hashCode()` geprüft). Wenn du zwei Listen vereinigen willst, ohne Duplikate, ist ein `Set` das richtige Werkzeug — nicht eine Schleife mit manuellem `contains()`-Check (funktioniert auch, ist aber unnötig kompliziert).

Muster, das du dir merken solltest:
```java
Set<T> menge = new HashSet<>(liste1);
menge.addAll(liste2);
List<T> ergebnis = new ArrayList<>(menge);
```

**Voraussetzung:** Damit das funktioniert, muss die Klasse `T` (hier `Circle`) `equals()` und `hashCode()` sinnvoll überschreiben. Schau dir an, wonach `Circle.equals()` vergleicht (Radius) — das bestimmt, was als "gleich" zählt.

**Zum Selbst-Üben:** Schreib eine Methode `intersection(list1, list2)`, die nur die Elemente zurückgibt, die in *beiden* Listen vorkommen (Tipp: `retainAll`).

## 2. `createMap` / `addListToMap` — Gruppieren in eine `Map<K, List<V>>`

**Kernidee:** Das ist das klassische "Gruppieren nach einem Schlüssel"-Muster. Für jedes Element prüfst du: gibt es den Schlüssel schon?
- Wenn nein: neue Liste anlegen, Element reinpacken, in die Map einfügen.
- Wenn ja: vorhandene Liste holen, Element anhängen.

```java
for (Circle c : circles) {
    double key = c.area();
    if (!map.containsKey(key)) {
        List<Circle> list = new ArrayList<>();
        list.add(c);
        map.put(key, list);
    } else {
        map.get(key).add(c);
    }
}
```

**Kürzer mit der Java-API** (gut zu kennen, aber optional):
```java
map.computeIfAbsent(key, k -> new ArrayList<>()).add(c);
```
`computeIfAbsent` macht genau das if/else oben in einer Zeile.

`addListToMap` ist inhaltlich dieselbe Logik wie `createMap`, nur dass die Map schon existiert und du sie erweiterst statt neu zu bauen. Erkenne solche Wiederholungen — das ist ein Hinweis, dass beide Methoden dieselbe Hilfslogik nutzen könnten.

**Falle:** `Double` als Map-Schlüssel ist unpraktisch, weil Fließkommazahlen selten exakt gleich sind. Deshalb braucht `getFirstCircleOfKey` unten eine Toleranz-Prüfung statt eines direkten `map.get(key)`.

**Zum Selbst-Üben:** Gruppiere eine `List<String>` nach Wortlänge in eine `Map<Integer, List<String>>` — von Hand mit der if/else-Methode, dann nochmal mit `computeIfAbsent`.

## 3. `getFirstCircleOfKey` — Map durchsuchen + eigene Exception werfen

**Kernidee:** Du suchst nicht direkt mit `map.get()`, weil der Key ein `int` ist, aber die Map `Double`-Keys hat. Du musst also über `map.keySet()` iterieren und selbst vergleichen:

```java
for (Double k : map.keySet()) {
    if (k - key < 1 && k - key >= 0) {   // k liegt im Intervall [key, key+1)
        return map.get(k).get(0);
    }
}
throw new IllegalArgumentException("key " + key + " not found");
```

**Wichtig zum Verstehen von Exceptions (aus Übung 5):**
- `throw new IllegalArgumentException("...")` beendet die Methode sofort und wirft die Exception nach oben.
- Der Aufrufer fängt sie mit `try { ... } catch (IllegalArgumentException e) { ... e.getMessage() ... }`.
- Die Nachricht (`getMessage()`) ist Teil der "Vertrags" — Tests prüfen oft den exakten Text, also genau hinschauen, was verlangt wird (hier: `"key 79 not found"`).

**Zum Selbst-Üben:** Schreib eine Methode, die in einer `Map<String, Integer>` einen Wert sucht und `NoSuchElementException("Schlüssel " + k + " existiert nicht")` wirft, wenn er fehlt.

## 4. `getFirstCircleOfRadius` — `Optional` statt `null`

**Kernidee:** Wenn eine Suche fehlschlagen *darf* (im Gegensatz zu Punkt 3, wo es eine Exception gibt), ist `Optional<T>` das passende Rückgabetyp — nicht `null` zurückgeben oder eine Exception werfen.

```java
for (List<Circle> list : map.values()) {
    for (Circle c : list) {
        if (Double.compare(c.getRadius(), radius) == 0) {
            return Optional.of(c);
        }
    }
}
return Optional.empty();
```

Aufrufer-Seite:
```java
Optional<Circle> result = getFirstCircleOfRadius(map, 5.0);
if (result.isPresent()) {
    System.out.println("found: " + result.get());
} else {
    System.out.println("not found");
}
```

**Merksatz:** `Optional` = "vielleicht gibt es ein Ergebnis, vielleicht nicht, und das ist ein normaler Fall" → Exception = "das ist ein Fehler/Sonderfall".

**Zum Selbst-Üben:** Schreib `findFirstEven(List<Integer> nums)` mit Rückgabetyp `Optional<Integer>`.

## 5. `Circle implements Comparable<Circle>` — natürliche Ordnung

**Kernidee:** Damit `Collections.sort()`, `list.sort(null)` oder `Stream.sorted()` (ohne Comparator) funktionieren, muss die Klasse `Comparable<T>` implementieren:

```java
public class Circle implements Comparable<Circle> {
    @Override
    public int compareTo(Circle other) {
        return Double.compare(this.radius, other.radius);
    }
}
```

Regel: negativ = "kleiner", 0 = "gleich", positiv = "größer". `Double.compare` macht das für dich richtig (Vorsicht bei `this.radius - other.radius`, das kann bei Doubles ungenau werden).

**Zusammenhang mit Übung 8/9:** `Comparable` ist ein Interface mit genau einer Methode — dasselbe Prinzip wie bei den funktionalen Interfaces (`Comparator`), nur dass `compareTo` in der Klasse selbst lebt statt separat übergeben zu werden.

## 6. Streams & `Collectors` — `createSortedListOfCircles` / `...EvenRadiiFirst`

**Sortieren mit Stream:**
```java
List<Circle> sorted = circles.stream()
    .sorted()                       // nutzt compareTo() aus Punkt 5
    .collect(Collectors.toList());
```

**Aufteilen in zwei Gruppen mit `partitioningBy`:**
```java
Map<Boolean, List<Circle>> parts = circles.stream()
    .collect(Collectors.partitioningBy(c -> c.getRadius() % 2 == 1));
// parts.get(false) = gerade Radien, parts.get(true) = ungerade Radien
```
`partitioningBy` teilt einen Stream anhand eines Predicates (true/false) in genau zwei Listen. Danach beide Teile sortieren und in der gewünschten Reihenfolge zusammenführen:
```java
List<Circle> result = Stream.concat(
    parts.get(false).stream().sorted(),   // gerade zuerst
    parts.get(true).stream().sorted()
).collect(Collectors.toList());
```

**Zum Selbst-Üben:** Teile eine `List<Integer>` mit `partitioningBy` in positive und negative Zahlen und gib beide sortiert aus.

## Wie du generell an solche Aufgaben herangehst

1. **Signatur lesen, bevor du codierst:** Rückgabetyp verrät oft die Lösung (`Optional<T>` → keine Exception werfen; `void` → Map wird verändert, nicht zurückgegeben).
2. **Tests zuerst lesen.** Die Testmethode zeigt dir exakt, welches Verhalten erwartet wird (Fehlermeldungen, Grenzfälle, Reihenfolge).
3. **Muster erkennen statt auswendig lernen:** "Duplikate entfernen" → Set. "Gruppieren" → Map<K, List<V>>. "Suche kann fehlschlagen, ist aber kein Fehler" → Optional. "Suche ist ein Fehler" → Exception. "Sortierbar machen" → Comparable.
4. **Erst mit Schleifen lösen, dann mit Streams verschönern** — wenn dir die Schleifen-Logik klar ist, ist die Stream-Version meist eine direkte Übersetzung.
5. **Übungsblätter 5-11 nochmal durchgehen**, wenn ein Baustein hier unklar war — die Probeklausur testet genau diese Themen in Kombination.

## Empfohlene nächste Schritte
- Löse die 5 Übungsaufgaben oben ("Zum Selbst-Üben") selbst, ohne in die Musterlösung zu schauen.
- Danach: implementiere `Probeklausur1.java` selbst aus der Aufgabenstellung, und vergleiche erst am Ende mit der Musterlösung.
- Wenn ein Test fehlschlägt: lies die Fehlermeldung genau — "click on Click to see difference in IntelliJ" bei Map-Vergleichen bedeutet oft ein Encoding/Rundungsproblem bei den `Double`-Keys.
