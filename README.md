# 📖 Menu Designer Pro – Nástroj pro tvorbu tiskových jídelních lístků

Vítejte v **Menu Designer Pro**! Tento moderní, plně klientský webový editor slouží k rychlému a vizuálnímu navrhování profesionálních, tiskem připravených jídelních a nápojových lístků. Umožňuje přesné rozvržení prvků, automatické i manuální stránkování a okamžitý export do vektorového formátu PDF.

Aplikace je dostupná online na: **[https://baaoh.github.io/FamilyKitchen-MenuMaker/](https://baaoh.github.io/FamilyKitchen-MenuMaker/)**

---

## 🚀 Klíčové Funkce

### 1. Správa položek a pokročilé rozvržení (Layouty)
* **Flexibilní mřížky položek**: Každou kategorii můžete uspořádat do různých formátů:
  * **Klasický seznam (1 sloupec)**
  * **2, 3 nebo 4sloupcová mřížka (Grid)** – ideální pro dezerty, piva či přílohy.
  * **Trojúhelníkové rozložení (Triangle of 3)** – estetické rozmístění 3 položek (2 nahoře, 1 centrovaná dole).
* **Nahrávání obrázků**: U každého jídla můžete aktivovat obrázek, nahrát lokální soubor a posuvníkem nastavit jeho měřítko (20% – 200%).
* **Štítky (Badges)**: Možnost přidat k položkám zvýrazněné štítky (např. *NOVINKA*, *PÁLIVÉ*, *VEGAN*), které se tisknou v barvě motivu.

### 2. Vizuální správa stránek a řazení (Drag-and-Drop)
* **Přetahování kategorií**: V levém panelu můžete uchopit kategorii za úchyt (`GripVertical`) a přetáhnout ji nahoru nebo dolů. Změna pořadí se ihned promítne do náhledu.
* **Optické rozdělení stránek**: V seznamu kategorií vidíte jasné přerušované čáry znázorňující hranice jednotlivých stránek (např. `Page 1 / Page 2 Split`), takže přesně víte, kde stránka končí.
* **Přímé ovládání stránek**: Přímo na tiskových listech v plátně můžete přidávat nové stránky nebo měnit jejich pořadí (posun nahoru/dolů) a mazat je. Při smazání stránky se obsah bezpečně přesune na předchozí stranu, aby nedošlo ke ztrátě dat.

### 3. Inteligentní detekce přetečení (Overset Warnings)
* **Detekce v reálném čase**: Systém neustále monitoruje výšku obsahu na všech stránkách.
* **Varovné indikátory**:
  * Pokud stránka přeteče, u jejího čísla se zobrazí červený štítek `⚠️ PAGE OVERFLOWS`.
  * Konkrétní kategorie, která již přesahuje okraje stránky a je oříznutá, se v náhledu zvýrazní červeným přerušovaným rámečkem a štítkem `⚠️ Cut off!`.
  * V pravém dolním rohu obrazovky se zobrazí přehledný panel s výpisem všech přetékajících stránek a názvů dotčených kategorií.

### 4. Stránkování (Pagination Modes)
* **Automatický režim (Auto)**: Spočítá výšky prvků na základě rozlišení a automaticky přesune kategorie na další stránky, pokud by došlo k přetečení.
* **Manuální režim**: Umožňuje vám plně kontrolovat zařazení kategorií na konkrétní stránky. Obsahuje tlačítko **"Re-calculate Page Flow"** (přepočítat tok stránek), které na jedno kliknutí srovná pořadí a automaticky přesune přetékající kategorie na další listy.

### 5. Synchronizace rolování (Scroll Sync)
* **Z plátna do editoru**: Při rolování náhledem menu se v levém panelu automaticky zvýrazní a vycentruje ta kategorie, kterou si právě prohlížíte.
* **Z editoru do plátna**: Kliknutím na rozbalení kategorie v postranním panelu se náhledové plátno plynule posune a vycentruje na danou kategorii.
* *Ochrana proti zacyklení*: Speciální zámek zabraňuje trhání obrazu při rychlém posunu.

### 6. Designový systém a písma
* **Nezávislá volba písem**: V panelu **Styling** můžete nastavit jiné moderní písmo pro nadpisy a jiné pro popisy/položky (písma jako Outfit, Lora, Cinzel, Open Sans, Inter apod.).
* **Nastavení mezer a ohraničení**: Dynamické posuvníky pro vnitřní okraje (padding), mezery mezi kategoriemi a položkami.
* **Barevná schémata**: Plná svoboda úpravy barev pozadí, textu, ohraničení a akcentů nebo rychlá volba z estetických šablon (např. Bistro Bistro, Slate Dark, Modern Drinks).

### 7. Správa projektů (Multi-Project) a Zámek
* **Více menu najednou**: V záhlaví můžete snadno přepínat například mezi Jídelním a Nápojovým lístkem.
* **Export a import**: Každé menu lze vyexportovat samostatně do formátu `.json` a uložit do počítače, případně zpětně nahrát.
* **Zabezpečení zámkem**: Každé menu můžete chránit přístupovým kódem (PINem). Po uzamčení je editor schován za bezpečnostní obrazovku a nelze v něm provádět změny bez zadání kódu.

### 8. Vektorový tisk a export do PDF
* Kliknutím na tlačítko **"Export PDF / Print"** se spustí tiskový dialog prohlížeče.
* Tiskové styly automaticky skryjí postranní lišty a editační prvky.
* Stránky se vytisknou v přesném formátu (např. A4, A5, Square) jedna po druhé, včetně barev pozadí, ohraničení, obrázků a barevných štítků (díky vynucenému CSS pravidlu `print-color-adjust: exact`).

---

## 🛠️ Jak spustit projekt lokálně

Pokud chcete editor spustit na vlastním počítači a provádět vývojové úpravy, postupujte podle následujících kroků:

### Požadavky
* Nainstalovaný **Node.js** (doporučená verze 20+)
* Správce balíčků **npm** (součástí Node.js)

### Krok 1: Instalace závislostí
Otevřete terminál v adresáři projektu (`Menu Maker`) a spusťte:
```bash
npm install
```

### Krok 2: Spuštění vývojového serveru
Spusťte lokální server s podporou hot-reloadu:
```bash
npm run dev
```
Aplikace se spustí na adrese **`http://localhost:3000/`**.

### Krok 3: Sestavení produkční verze
Pro vygenerování optimalizovaných statických souborů do složky `/dist` spusťte:
```bash
npm run build
```

---

## 🤖 Automatické nasazení (CI/CD)

Projekt je vybaven automatickým nasazováním na GitHub Pages pomocí **GitHub Actions** ([deploy.yml](.github/workflows/deploy.yml)).

Při každém odeslání kódu na větev `main` pomocí:
```bash
git add .
git commit -m "popis změn"
git push
```
GitHub automaticky:
1. Spustí virtuální server s Node.js.
2. Nainstaluje závislosti a sestaví produkční verzi projektu (`npm run build`).
3. Publikuje zkompilovanou složku `dist` do větve `gh-pages`.
4. Váš web na adrese **[baaoh.github.io/FamilyKitchen-MenuMaker/](https://baaoh.github.io/FamilyKitchen-MenuMaker/)** se během 1-2 minut sám aktualizuje.
