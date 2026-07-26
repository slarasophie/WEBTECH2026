# Prog2-Lernguide: Wie man alle Übungen lösen lernt

Dieser Guide erklärt dir die Denkmuster hinter jedem Themenblock aus den Prog2-Übungen (Übung 1-13). Ziel ist nicht, dir fertige Lösungen zu geben, sondern dir beizubringen, *wie* du bei jedem Aufgabentyp vorgehst — damit du neue, unbekannte Aufgaben zum selben Thema selbstständig lösen kannst (das ist genau das, was in der Klausur verlangt wird).

Jeder Abschnitt hat: Kernkonzept → typisches Muster/Code-Idiom → häufige Fehler → eigene Übungsaufgaben zum Testen.

---

## Übung 1: Records & Wiederholung

**Konzept:** `record` ist eine kompakte Syntax für unveränderliche Datenklassen. Der Compiler generiert automatisch Konstruktor, Getter (`feldname()`, nicht `getFeldname()`), `equals()`, `hashCode()` und `toString()`.

```java
public record Point(int x, int y) { }
// Nutzung: Point p = new Point(1, 2); p.x(); p.y();
```

**Wann `record`, wann normale Klasse?** Record = reine Datenhalter ohne veränderlichen Zustand. Sobald du Felder nachträglich ändern willst (Setter) oder Vererbung brauchst, normale Klasse nehmen.

**Fallstricke:** Records können keine zusätzlichen Instanzfelder haben, nur die im Header deklarierten. Du kannst aber zusätzliche Methoden und einen "compact constructor" für Validierung ergänzen:
```java
public record Point(int x, int y) {
    public Point {
        if (x < 0) throw new IllegalArgumentException("x darf nicht negativ sein");
    }
}
```

**Zum Üben:** Definiere einen `record Fraction(int numerator, int denominator)` mit einer Methode `add(Fraction other)`, die eine neue `Fraction` zurückgibt. Validiere im compact constructor, dass `denominator != 0`.

---

## Übung 2: Strings & algorithmisches Denken

**Konzept:** Strings sind unveränderlich (immutable) — jede "Änderung" (`substring`, `replace`, `+`) erzeugt ein neues Objekt. Wichtige Methoden: `charAt`, `substring`, `split`, `toCharArray`, `StringBuilder` für Schleifen mit vielen Verkettungen.

**Typisches Muster — String rückwärts / Palindrom-Check:**
```java
public static boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++; right--;
    }
    return true;
}
```
Das Zwei-Zeiger-Muster (`left`/`right` laufen aufeinander zu) taucht in vielen String- und Array-Aufgaben auf.

**StringBuilder statt String-Verkettung in Schleifen:**
```java
StringBuilder sb = new StringBuilder();
for (char c : s.toCharArray()) sb.append(c);
String result = sb.toString();
```
`String result += c` in einer Schleife ist ineffizient (jedes Mal ein neues Objekt) — bei Aufgaben zu "algorithmischem Denken" wird sauberer Code oft mitbewertet.

**Zum Üben:** Schreibe `countVowels(String s)`, `reverseWords(String s)` (Wortreihenfolge umdrehen, nicht Buchstaben) und `isAnagram(String a, String b)`.

---

## Übung 3: `enum` & zweidimensionale Arrays

**Konzept enum:** Eine feste, typsichere Menge von Konstanten. Enums können Felder, Konstruktoren und Methoden haben:
```java
public enum State {
    EMPTY, X, O;
}
```
oder mit Zusatzdaten:
```java
public enum Direction {
    NORTH(0, -1), SOUTH(0, 1), EAST(1, 0), WEST(-1, 0);
    final int dx, dy;
    Direction(int dx, int dy) { this.dx = dx; this.dy = dy; }
}
```
`switch` über enums ist üblich und der Compiler kann warnen, wenn ein Fall fehlt.

**Konzept 2D-Arrays:** `Type[][] grid = new Type[rows][cols];` Zugriff über `grid[row][col]`. Standardmuster zum Durchlaufen:
```java
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        // grid[row][col]
    }
}
```

**Typisches Kombi-Beispiel (wie TicTacToe aus der Übung):** ein `State[][] board` durchlaufen und auf Musterreihen/-spalten/-diagonalen prüfen (Gewinnbedingung).

**Zum Üben:** Implementiere ein `enum Ampel { ROT, GELB, GRUEN }` mit Methode `next()`, die den nächsten Zustand liefert (ROT→GRÜN→GELB→ROT). Schreibe dann eine Methode, die ein `int[][]` transponiert (Zeilen/Spalten vertauschen).

---

## Übung 4 & 5: Exceptions, try-with-resources, eigene Exception-Klassen

**Konzept:** Exceptions signalisieren Fehlerfälle. Unterscheide:
- **Checked Exceptions** (z.B. `IOException`) — müssen deklariert (`throws`) oder gefangen werden.
- **Unchecked/Runtime Exceptions** (z.B. `IllegalArgumentException`, `NullPointerException`) — müssen nicht deklariert werden.

**Eigene Exception-Klasse:**
```java
public class MyIndexOutOfBoundsException extends RuntimeException {
    public MyIndexOutOfBoundsException(String message) {
        super(message);
    }
}
```
Faustregel: erbe von `RuntimeException`, wenn der Aufrufer den Fehler nicht zwingend behandeln muss; von `Exception`, wenn er es muss.

**try/catch/finally:**
```java
try {
    riskyOperation();
} catch (SpecificException e) {
    // konkreten Fehler behandeln
} finally {
    // läuft immer, z.B. Ressourcen schließen
}
```

**try-with-resources** — automatisches Schließen von Ressourcen, die `AutoCloseable`/`Closeable` implementieren (Dateien, Scanner):
```java
try (BufferedReader reader = new BufferedReader(new FileReader("datei.txt"))) {
    String line = reader.readLine();
} catch (IOException e) {
    System.out.println("Fehler: " + e.getMessage());
}
```
Kein `finally { reader.close(); }` nötig — das übernimmt try-with-resources selbst, auch wenn eine Exception auftritt.

**Wann werfe ich selbst eine Exception?** Wenn eine Methode mit ungültigen Eingaben nicht sinnvoll weiterarbeiten kann:
```java
public double divide(double a, double b) {
    if (b == 0) throw new ArithmeticException("Division durch 0");
    return a / b;
}
```

**Zum Üben:** Definiere `class NegativeAmountException extends RuntimeException`. Schreibe eine Klasse `Konto` mit `withdraw(double amount)`, die diese Exception wirft, wenn `amount < 0` oder größer als der Kontostand ist (unterschiedliche Nachrichten). Schreibe dann eine Methode, die eine Datei mit try-with-resources zeilenweise einliest und Zeilenanzahl zurückgibt.

---

## Übung 6: Listen und Mengen (List, Set)

**Konzept List:** geordnete, indexbasierte Sammlung, Duplikate erlaubt. `ArrayList` ist die Standardimplementierung.
```java
List<String> list = new ArrayList<>();
list.add("a"); list.get(0); list.remove("a"); list.contains("a");
```

**Konzept Set:** keine Duplikate, meist unsortiert (`HashSet`) oder sortiert (`TreeSet`). Gleichheit läuft über `equals()`/`hashCode()`.
```java
Set<String> set = new HashSet<>();
set.add("a"); set.add("a"); // wird ignoriert, Größe bleibt 1
```

**Häufigstes Muster: Duplikate aus einer Liste entfernen**
```java
List<T> withoutDuplicates = new ArrayList<>(new HashSet<>(list));
```

**Häufigstes Muster: Mengenoperationen**
```java
Set<T> union = new HashSet<>(a); union.addAll(b);          // Vereinigung
Set<T> intersection = new HashSet<>(a); intersection.retainAll(b); // Schnitt
Set<T> difference = new HashSet<>(a); difference.removeAll(b);     // Differenz
```

**Wichtige Voraussetzung:** Diese Operationen funktionieren nur korrekt, wenn deine Klasse `equals()` (und `hashCode()`, wenn `HashSet`/`HashMap` genutzt wird) sinnvoll überschreibt. Ohne das vergleicht Java Objekte per Referenz (`==`), nicht per Inhalt.

**Zum Üben:** Gegeben `List<Integer> a, b`. Schreibe Methoden für Vereinigung, Schnittmenge und symmetrische Differenz (Elemente, die in genau einer der beiden Listen sind, nicht in beiden). Danach: `removeDuplicatesKeepOrder(List<T> list)`, die Duplikate entfernt, aber die ursprüngliche Reihenfolge beibehält (Tipp: `LinkedHashSet`).

---

## Übung 7: Maps

**Konzept:** Schlüssel-Wert-Paare, `HashMap<K,V>` ist Standard. Ein Schlüssel kommt höchstens einmal vor.
```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");                 // 1
map.getOrDefault("x", 0);     // 0, falls "x" fehlt
map.containsKey("a");
```

**Muster 1 — Gruppieren (Wortzähler / Häufigkeiten):**
```java
Map<String, Integer> count = new HashMap<>();
for (String word : words) {
    count.put(word, count.getOrDefault(word, 0) + 1);
}
```
oder mit `merge`:
```java
count.merge(word, 1, Integer::sum);
```

**Muster 2 — Gruppieren in Listen (Map<K, List<V>>):**
```java
Map<Character, List<String>> byFirstLetter = new HashMap<>();
for (String word : words) {
    char key = word.charAt(0);
    byFirstLetter.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
```

**Muster 3 — Iterieren über eine Map:**
```java
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}
```

**Zum Üben:** Zähle Buchstabenhäufigkeit in einem String (`Map<Character, Integer>`). Danach: Gruppiere eine `List<Student>` nach Note in `Map<Integer, List<Student>>` (ohne Streams, mit `computeIfAbsent`).

---

## Übung 8: Interfaces (und abstrakte Klassen, Generics)

**Konzept Interface:** definiert einen Vertrag (Methodensignaturen ohne Implementierung), den Klassen erfüllen müssen.
```java
public interface Comparable<T> {
    int compareTo(T other);
}
public class Circle implements Comparable<Circle> {
    public int compareTo(Circle other) { return Double.compare(this.radius, other.radius); }
}
```
Eine Klasse kann mehrere Interfaces implementieren, aber nur von einer Klasse erben — Interfaces sind der Weg zu "Mehrfachvererbung von Verhalten".

**Abstrakte Klasse vs. Interface:** Abstrakte Klasse kann bereits Zustand (Felder) und teilweise Implementierung mitbringen, Interface (klassisch) nicht. Faustregel: "ist-ein"-Beziehung mit gemeinsamem Code → abstrakte Klasse; "kann-das"-Fähigkeit → Interface.
```java
public abstract class Shape {
    abstract double area();               // muss implementiert werden
    void printArea() { System.out.println(area()); }  // fertige Methode
}
```

**Generics:** typsichere Wiederverwendung von Code für beliebige Typen.
```java
public class Box<T> {
    private T content;
    public void set(T content) { this.content = content; }
    public T get() { return content; }
}
```
Bounded Types, wenn du z.B. nur mit vergleichbaren Typen arbeiten willst: `<T extends Comparable<T>>`.

**Zum Üben:** Definiere ein Interface `Drawable` mit Methode `draw()`. Lass `Circle` und `Square` es implementieren. Schreibe dann eine generische Klasse `Pair<A, B>` mit `getFirst()`/`getSecond()` und einer Methode `swap()`, die ein neues `Pair<B, A>` zurückgibt.

---

## Übung 9: Lambdas & Functional Interfaces & Comparator

**Konzept:** Ein Functional Interface hat genau eine abstrakte Methode — dafür kannst du statt einer Klasse eine Lambda-Expression übergeben.
```java
@FunctionalInterface
interface Operation { int apply(int a, int b); }

Operation add = (a, b) -> a + b;
System.out.println(add.apply(2, 3)); // 5
```

**`Comparator` ist das wichtigste Beispiel dafür in diesem Kurs:**
```java
List<Student> students = ...;
students.sort((s1, s2) -> s1.getName().compareTo(s2.getName()));
// oder lesbarer:
students.sort(Comparator.comparing(Student::getName));
students.sort(Comparator.comparing(Student::getGrade).reversed());
students.sort(Comparator.comparing(Student::getGrade).thenComparing(Student::getName));
```
`Comparator` vs. `Comparable`: `Comparable` legt EINE "natürliche" Ordnung in der Klasse selbst fest (`compareTo`). `Comparator` erlaubt beliebig viele externe Sortierregeln, ohne die Klasse zu ändern.

**Methodenreferenzen** (`Klasse::methode`) sind eine Kurzschreibweise für Lambdas, die nur eine bestehende Methode aufrufen:
```java
list.forEach(System.out::println);   // statt (x) -> System.out.println(x)
```

**Zum Üben:** Sortiere eine `List<Person>` einmal nach Alter aufsteigend, einmal nach Nachname und dann Vorname. Schreibe ein eigenes Functional Interface `Validator<T>` mit `boolean isValid(T t)` und nutze es, um eine Liste zu filtern (ohne Streams, per Hand mit Schleife).

---

## Übung 10 & 11: Streams

**Konzept:** Ein Stream beschreibt eine *Pipeline* von Operationen auf einer Datenquelle (meist einer Collection), ohne die Quelle zu verändern. Drei Phasen: Quelle → Zwischenoperationen (`filter`, `map`, `sorted`, ...) → Terminaloperation (`collect`, `forEach`, `count`, ...).

```java
List<String> names = students.stream()
    .filter(s -> s.getGrade() <= 2)
    .map(Student::getName)
    .sorted()
    .collect(Collectors.toList());
```

**Die wichtigsten Bausteine:**
| Operation | Zweck |
|---|---|
| `filter(Predicate)` | nur Elemente behalten, die eine Bedingung erfüllen |
| `map(Function)` | jedes Element in etwas anderes umwandeln |
| `sorted()` / `sorted(Comparator)` | sortieren |
| `collect(Collectors.toList())` | Ergebnis in eine Liste sammeln |
| `collect(Collectors.groupingBy(...))` | wie Map-Gruppierung, aber deklarativ |
| `collect(Collectors.partitioningBy(Predicate))` | in genau 2 Gruppen (true/false) aufteilen |
| `reduce(...)` | alle Elemente zu einem Wert zusammenfassen (Summe, Max, ...) |
| `count()`, `anyMatch()`, `allMatch()` | Aggregation/Prüfung |

**Muster — Gruppieren mit Streams (Ersatz für das Map-Muster aus Übung 7):**
```java
Map<Integer, List<Student>> byGrade = students.stream()
    .collect(Collectors.groupingBy(Student::getGrade));
```

**Muster — Aufteilen in zwei Gruppen:**
```java
Map<Boolean, List<Integer>> parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
```

**Denkweise beim Übersetzen einer Schleifenlösung in Streams:**
1. Löse die Aufgabe zuerst mit einer klassischen for-Schleife — das stellt sicher, dass du die Logik verstehst.
2. Identifiziere die Schritte: Was wird gefiltert? Was wird umgewandelt? Was ist das Endergebnis (Liste, Zahl, Map)?
3. Übersetze Schritt für Schritt: Filter-Bedingung → `filter`, Transformation → `map`, Endergebnis → passender `collect`/`reduce`.

**Zum Üben:** Gegeben `List<Student>`. Finde mit Streams: Namen aller Studenten mit Note besser als 2,0 (sortiert); Durchschnittsnote (`mapToDouble(...).average()`); Anzahl der Studenten pro Note (`groupingBy` + `counting()`).

---

## Optionals (ergänzend zu Streams, oft in Übung 10/11 mit dabei)

**Konzept:** `Optional<T>` ist ein Container, der "vielleicht einen Wert" enthält — Alternative zu `null`, um `NullPointerException`s zu vermeiden und den Aufrufer zu zwingen, den Fehlfall zu behandeln.
```java
Optional<Student> best = students.stream()
    .filter(s -> s.getGrade() == 1)
    .findFirst();

if (best.isPresent()) {
    System.out.println(best.get());
} else {
    System.out.println("keiner gefunden");
}
// kürzer:
best.ifPresentOrElse(
    s -> System.out.println(s),
    () -> System.out.println("keiner gefunden")
);
System.out.println(best.orElse(defaultStudent));
```
Merksatz: `Optional` = normaler "kann fehlen"-Fall, keine Exception. Nutze es als Rückgabetyp von Suchmethoden, die auch mal nichts finden können.

**Zum Üben:** Schreibe `findByName(List<Student> list, String name)` mit Rückgabe `Optional<Student>`. Rufe sie zweimal auf (Treffer/kein Treffer) und behandle beide Fälle mit `ifPresentOrElse`.

---

## Übung 12: JUnit

**Konzept:** Automatisierte Tests statt manuellem Ausprobieren in `main`. Grundbausteine (JUnit 5):
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import static org.junit.jupiter.api.Assertions.*;

public class CircleTest {
    static Circle c;

    @BeforeAll
    static void setup() { c = new Circle(2.0); }

    @Test
    void testArea() {
        assertEquals(Math.PI * 4, c.area(), 0.001);   // Delta für double-Vergleich!
    }

    @Test
    void testExceptionOnNegativeRadius() {
        assertThrows(IllegalArgumentException.class, () -> new Circle(-1));
    }
}
```

**Wichtige Assertions:** `assertEquals(expected, actual)`, `assertTrue`/`assertFalse`, `assertNull`/`assertNotNull`, `assertThrows(Exception.class, () -> ...)`, `assertEquals(expected, actual, delta)` für `double`-Werte (exakter Vergleich ist bei Fließkommazahlen riskant).

**Wie du selbst Tests entwirfst — Checkliste:**
1. **Normalfall:** funktioniert die Methode mit typischen, gültigen Eingaben?
2. **Randfälle:** leere Liste, 0, negative Zahl, ein einzelnes Element.
3. **Fehlerfälle:** wird die richtige Exception mit der richtigen Nachricht geworfen?
4. Ein `@Test` pro Verhalten, nicht ein riesiger Test für alles — dann siehst du beim Fehlschlagen sofort, was kaputt ist.

**Zum Üben:** Schreibe zu deiner `Konto`-Klasse aus dem Exceptions-Abschnitt oben JUnit-Tests: Einzahlen, Abheben (Normalfall), Abheben mit zu hohem Betrag (erwartet Exception), Abheben negativer Betrag (erwartet Exception).

---

## Übung 13: Collections-Wiederholung

Diese Übung (und die Probeklausuren) kombinieren alles oben Gelernte. Der Schlüssel ist nicht neues Wissen, sondern **Muster erkennen und kombinieren**:

| Aufgabentyp im Angebot | Werkzeug |
|---|---|
| Duplikate entfernen | `Set` |
| Nach Eigenschaft gruppieren | `Map<K, List<V>>` + `computeIfAbsent` oder `Collectors.groupingBy` |
| Suche, die fehlschlagen darf | `Optional<T>` |
| Suche, die ein Fehler ist | eigene Exception werfen |
| Sortieren (eine feste Ordnung) | `Comparable` + `compareTo` |
| Sortieren (mehrere Ordnungen) | `Comparator` |
| Filtern/Transformieren/Aggregieren | Streams (`filter`, `map`, `reduce`, `collect`) |
| Verhalten prüfen | JUnit-Tests mit Normal-/Rand-/Fehlerfällen |

---

## Allgemeine Vorgehensweise für jede neue Aufgabe

1. **Signatur zuerst lesen.** Rückgabetyp verrät oft das Werkzeug: `Optional<T>` → kein Fehler, sondern "kann fehlen"; `void` mit Map-Parameter → die Map wird verändert, nicht neu zurückgegeben; `boolean` → meist eine Prüfmethode.
2. **Gegebene Tests lesen, bevor du codierst.** Sie zeigen exakt erwartetes Verhalten, Fehlermeldungen, Grenzfälle.
3. **Erst mit Schleifen lösen**, dann ggf. mit Streams verschönern, wenn die Logik sitzt.
4. **Tabelle oben nutzen**, um schnell zu erkennen: "Was für ein Aufgabentyp ist das eigentlich?"
5. Übungsaufgaben aus diesem Guide selbst durchrechnen, bevor du in Musterlösungen schaust — das Erkennen des richtigen Werkzeugs ist die eigentliche Prüfungskompetenz, nicht das Auswendiglernen von Codezeilen.

## Weiterführende Themenseiten des Kurses
Für Detailwissen zu einzelnen Themen (Syntax, Sonderfälle) sind die Theorie-Seiten des Kurses eine gute Ergänzung zu diesem Guide: Enum, Wrapper-Klassen, Exceptions, Collections, Maps, Abstrakte Klassen, Generics, Interfaces, Lambdas, Streams, Optionals, JUnit — jeweils unter freiheit.f4.htw-berlin.de/prog2/.
