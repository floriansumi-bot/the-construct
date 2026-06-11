/* ============================================================
   content-fr.js — French lesson overlay for THE CONSTRUCT.
   Keyed by track id; merged onto each module/exercise as `_fr`
   at start() by applyContentOverlay() in app.js. The render
   helper Lx(obj,field) uses these strings ONLY when French is
   active AND the field is present — otherwise it falls back to
   the English original, so partial coverage is always safe.

   TRANSLATION CONTRACT (must hold for grading to stay correct):
     • Code fences (~~~python / ~~~text) and their contents are
       NEVER translated — they are literal output the learner must
       reproduce byte-for-byte, or code to type.
     • Inline `code spans`, function names, print(), sep=, end="",
       escape sequences (\\n \\t \\\\) stay verbatim.
     • Only prose, titles, briefs and hints are translated.
     • `lore` is intentionally left untranslated (iconic quotes)
       so it falls back to the English original.
   ============================================================ */
window.CONTENT_FR = window.CONTENT_FR || {};

window.CONTENT_FR.python = {
  track: {
    blurb: `Du vrai CPython 3.12 dans votre navigateur. Le parcours CS50P + Dataquest, relooké pour le Wired.`,
    intro: `Du vrai CPython 3.12, compilé en WebAssembly, exécuté en local. Lisez le briefing, forcez les nœuds — chacun corrigé en direct par des vecteurs de test cachés. Parcours carrière : de zéro à opérateur.`,
  },

  modules: {
    "m01-boot": {
      title: `SÉQUENCE D'AMORÇAGE`,
      subtitle: `print() · chaînes · commentaires · vos premières transmissions`,
      theory: `
## Connexion
Tout programme est une pile d'**instructions** que la machine exécute de haut en bas. Votre premier outil est **print()** — il envoie du texte vers le terminal (stdout).

~~~python
print("Wake up, Neo...")
~~~

Un texte entre guillemets est une **chaîne** (string). Guillemets simples ou doubles, les deux fonctionnent — choisissez-en un et restez cohérent.

## Commentaires
Une ligne qui commence par **#** est un commentaire. Python l'ignore ; c'est une note pour les humains.

~~~python
# cette ligne ne fait rien — c'est un commentaire
print("but this runs")   # les commentaires en fin de ligne marchent aussi
~~~

## Séquences d'échappement
Certains caractères se tapent avec une barre oblique inverse :
- **\\n** — saut de ligne
- **\\t** — tabulation
- **\\\\** — une barre oblique inverse littérale

~~~python
print("NAME:\\tSPIKE")   # NAME:  <tab>  SPIKE
~~~

## Un print, plusieurs morceaux
print() accepte plusieurs valeurs et les assemble avec un séparateur (une espace par défaut). Changez-le avec **sep=**. Mélanger **texte et nombres** ne pose aucun problème — la virgule s'en occupe, aucune conversion manuelle nécessaire.

~~~python
print("SOL", "GATE", "MARS", sep=" :: ")   # SOL :: GATE :: MARS
print("CYCLES REMAINING:", 3)              # CYCLES REMAINING: 3
~~~

## Rester sur la même ligne
Par défaut, print() termine par un saut de ligne. Passez **end=""** pour garder le print() suivant sur la **même ligne**.

~~~python
print("LOADING", end="")
print("...")            # LOADING... sur UNE seule ligne
~~~

## Chaînes multi-lignes
Entourez le texte de **triples guillemets** pour l'étaler sur plusieurs lignes dans une seule chaîne — un seul print() peut afficher toute une bannière.

~~~python
print("""+----------+
| BEBOP ON |
+----------+""")
~~~

## Construire des chaînes
- **+** colle deux chaînes bout à bout (sans espace automatique)
- **\\*** répète une chaîne (la répéter 0 fois donne la chaîne vide "")

~~~python
"Spike" + " " + "Spiegel"   # "Spike Spiegel"
"=" * 5                      # "====="
print("=" * 16)              # ================
~~~

> INTEL — Dans ce simulateur, un nœud **script** signifie : écrivez un programme normal. Appuyez sur EXÉCUTER et le noyau le lance pour de vrai, puis vérifie ce qu'il a affiché.
`,
    },
  },

  exercises: {
    "boot-wake": {
      title: `RÉVEILLE-TOI`,
      brief: `Premier contact. Transmettez le signal.`,
      prompt: `
Le lapin blanc attend. Affichez ces **trois lignes, exactement**, dans l'ordre :

~~~text
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
~~~

Utilisez trois appels à **print()**.
`,
      hint: `Trois appels print() distincts. Reproduisez la ponctuation et les majuscules caractère par caractère, y compris les \`...\`.`,
    },

    "boot-callsign": {
      title: `INDICATIF DE COWBOY`,
      brief: `Enregistrez le chasseur de primes au registre.`,
      prompt: `
Affichez deux entrées, chacune sous la forme **étiquette, une TABULATION, puis valeur** :

~~~text
NAME:	SPIKE
SHIP:	Bebop
~~~

L'écart entre l'étiquette et la valeur doit être une vraie **tabulation** — utilisez l'échappement \`\\t\`, pas des espaces.
`,
      hint: `print("NAME:\\tSPIKE") place une tabulation entre NAME: et SPIKE.`,
    },

    "boot-coords": {
      title: `COORDONNÉES DE SAUT`,
      brief: `Verrouillez la séquence de la porte hyperspatiale.`,
      prompt: `
Avec un **seul** appel à print() et l'argument **sep=**, affichez trois points de passage reliés par \` :: \` :

~~~text
SOL :: GATE :: MARS
~~~

Passez les trois points de passage comme arguments séparés — laissez \`sep\` faire la jointure.
`,
      hint: `print(a, b, c, sep=" :: ") relie les trois valeurs avec " :: " entre elles.`,
    },

    "boot-banner": {
      title: `BANNIÈRE DU BEBOP`,
      brief: `Peignez la bannière d'amorçage du vaisseau sur la console.`,
      prompt: `
Une chaîne en triples guillemets (\`"""..."""\`) peut s'étaler sur plusieurs lignes, donc un seul print() affiche toute une bannière. Affichez ces **trois lignes, exactement** :

~~~text
+------------------+
|   BEBOP ONLINE   |
+------------------+
~~~

Utilisez **une seule** chaîne en triples guillemets dans un unique print().
`,
      hint: `Ouvrez avec print(""" puis tapez les trois lignes sur trois vraies lignes, et fermez avec """) à la fin.`,
    },

    "boot-oneline": {
      title: `SÉQUENCE DE CHARGEMENT`,
      brief: `Faites défiler les points sans casser la ligne.`,
      prompt: `
Par défaut, print() termine par un saut de ligne. Passez **end=""** pour garder le print() suivant sur la **même ligne**.

Avec plusieurs appels à print(), produisez exactement une ligne :

~~~text
LOADING...
~~~

Affichez d'abord **LOADING** (avec end=""), puis les trois points. Seul le dernier print() doit terminer la ligne.
`,
      hint: `print("LOADING", end="") laisse le curseur sur la même ligne ; le dernier print(".") fournit le saut de ligne.`,
    },

    "boot-splice": {
      title: `FUSION D'INDICATIFS`,
      brief: `Soudez un prénom et un nom en un seul indicatif.`,
      prompt: `
Les chaînes se joignent avec **+**. Définissez **splice(first, last)** qui **renvoie** les deux noms reliés par une seule espace.

~~~python
splice("Spike", "Spiegel")   -> "Spike Spiegel"
~~~

Construisez-la avec **+** — exactement une espace au milieu. N'affichez rien ; **renvoyez** la chaîne.
`,
      hint: `return first + " " + last — remarquez le " " littéral (une espace) au milieu.`,
    },

    "boot-rule": {
      title: `RÈGLE DE SÉPARATION`,
      brief: `Forgez une ligne horizontale de n'importe quelle largeur.`,
      prompt: `
Une chaîne multipliée par un entier se répète : \`"=" * 3\` donne \`"==="\`. Définissez **rule(n)** qui **renvoie** une chaîne de **n** signes égal.

~~~python
rule(5)    -> "====="
rule(0)    -> ""
~~~

Utilisez la répétition de chaîne avec **\\***. Renvoyez la chaîne ; n'affichez rien.
`,
      hint: `return "=" * n. Répéter par 0 donne naturellement la chaîne vide "".`,
    },

    "boot-countdown": {
      title: `COMPTE À REBOURS`,
      brief: `Affichez un nombre à côté de son étiquette.`,
      prompt: `
print() peut prendre plusieurs valeurs séparées par des virgules et insère une espace entre elles — vous pouvez donc mélanger **texte** et **nombre** sans conversion manuelle. Affichez exactement :

~~~text
CYCLES REMAINING: 3
~~~

Le **3** doit être l'entier 3 (passez-le via une virgule, ou convertissez avec str()) — pas le texte "3".
`,
      hint: `print("CYCLES REMAINING:", 3) — la virgule relie texte et nombre avec une seule espace.`,
    },
  },
};
