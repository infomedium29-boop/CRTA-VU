# CRTA VU – višestranični web sajt

Profesionalni statički web za **CRTA VU, obrt za uslužne djelatnosti u građevinarstvu, vl. Danijela Hardi**, Vijeća Europe 73, Vukovar.

## Izmjene u ovoj verziji

- Uklonjeni svi ukrasni nadnaslovi i generičke slogan-linije kroz cijeli web.
- Prepisani glavni naslovi, opisi usluga i ponavljajuće generičke rečenice.
- Uklonjeni nepotrebni natpisi iz logotipa, intro animacije i 3D sekcije; 3D prikaz ostaje funkcionalan.
- Uređen razmak i prijelomi naslova na mobitelu i računalu.
- Posljednje izmjene napravljene su u `scripts/build_site.py`, pa ostaju sačuvane pri regeneriranju stranica.

## Što je uključeno

- 16 sadržajnih HTML stranica + profesionalna `404.html` stranica.
- Premium tamni vizualni identitet, plutajuća navigacija, intro animacija, scroll animacije i responsive dizajn.
- Interaktivni **3D arhitektonski model**, vlastiti JavaScript/Canvas renderer bez vanjskih biblioteka, rotacija mišem/prstom i prebacivanje „Materijali / Nacrt”.
- Izvorni arhitektonski vizuali (AVIF), bez preuzimanja tuđih portfelj fotografija.
- Naslovnica, O nama, pregled usluga, šest SEO podstranica usluga, projekti/reference s dvije podstranice, FAQ, kontakt, politika privatnosti, uvjeti korištenja.
- Favicon, mobilni izbornik, pristupačna navigacija i podrška za `prefers-reduced-motion`.
- SEO naslovi/opisi, Open Graph, strukturirani `ProfessionalService` podaci, robots.txt, sitemap.xml i Cloudflare Pages `_headers`.
- Cookie consent s odbijanjem, prihvaćanjem i zasebnim opcijama. Nema praćenja prije privole.

## Stranice

- `/` — početna
- `/o-nama/`
- `/usluge/`
- `/usluge/projektna-dokumentacija/`
- `/usluge/snimke-postojeceg-stanja/`
- `/usluge/projekti-uklanjanja/`
- `/usluge/rekonstrukcije-i-sanacije/`
- `/usluge/troskovnici/`
- `/usluge/tehnicko-savjetovanje/`
- `/projekti/`
- `/projekti/batine-zgrade/`
- `/projekti/mostovi-adica/`
- `/faq/`
- `/kontakt/`
- `/politika-privatnosti/`
- `/uvjeti-koristenja/`
- `/404.html`

## Lokalno pokretanje

Ne otvarati direktno `index.html` dvostrukim klikom jer su putanje prilagođene produkcijskom rootu. U direktoriju projekta pokrenuti:

```bash
python -m http.server 8000
```

Zatim otvoriti `http://localhost:8000/` u pregledniku.

## Objavljivanje preko GitHub + Cloudflare Pages

1. Otpakirajte ZIP. Sadržaj foldera `CRTA_VU_WEBSITE` prenesite u root GitHub repozitorija.
2. U Cloudflare Dashboardu odaberite **Workers & Pages → Create → Pages → Connect to Git** i povežite repozitorij.
3. Framework preset: **None**; Build command: prazno; Build output directory: **/** (root repozitorija).
4. Prva, privatna prezentacijska verzija ima `noindex` i `robots.txt` zabranu indeksiranja. To je namjerno dok ne bude potvrđen sadržaj i domena.
5. Po potvrdi sadržaja i povezivanju stvarne domene pokrenite:

```bash
python scripts/build_site.py --domain https://www.stvarna-domena.hr --public
```

Ta naredba regenerira canonical oznake, OG URL-ove, sitemap.xml, `robots.txt` i meta robots za javnu verziju. Zamijenite navedenu domenu svojom stvarnom domenom. Ponovno commit/push.
6. Zatim povežite Search Console i pošaljite `/sitemap.xml` na indeksiranje.

**Važno:** `scripts/build_site.py` generira HTML stranice. Izmjene teksta usluga i stranica koje želite trajno zadržati unesite u taj skript, jer regeneriranje prepisuje generirane HTML datoteke.

## Kontakt forma

Podaci koje je potrebno potvrditi prije produkcije: službeni e-mail i broj telefona (trenutačno su uneseni prema javno dostupnim podacima), stvarni scope usluga, fotografije i ovlaštenja.

Trenutačno obrazac na `/kontakt/` provjerava obavezna polja i otvara unaprijed pripremljenu poruku u korisnikovoj mail aplikaciji. To nije automatski server-side poslani upit. Za automatizirano slanje:

1. Otvorite `assets/js/site.js`.
2. Postavite `WEB3FORMS_KEY` na aktivan, korisnički vlasnički pristupni ključ.
3. Konfigurirajte i provjerite servis i adresu primatelja, testirajte isporuku, spam zaštitu i GDPR politiku.
4. Po želji preimenujte gumb „Pripremi poruku” u „Pošaljite upit”.

## Google Analytics

U `assets/js/site.js` postavite `GA_ID` na stvarni Google Analytics 4 `G-...` ID. Skripta se uključuje isključivo nakon korisničkog pristanka na analitiku. Bez ID-a ne prikuplja se analitika.

## Pravne stranice

Nacrti politike privatnosti i uvjeta korištenja prilagođeni su trenutnim funkcionalnostima i javno dostupnim podacima. Potrebno ih je provjeriti s vlasnikom, naročito ako se doda Web3Forms, GA4, drugi servisi ili nove obrade podataka. Nacrt teksta nije zamjena za stručnu pravnu provjeru.

## Reference i vizuali

Za reference iz Vukovara izvori su:
- HRV: https://www.hrv.hr/clanak/do-kraja-2025-uklanjaju-se-rusevne-batine-zgrade-u-vukovaru
- Grad Vukovar: https://vukovar.hr/images/stories/files/uot/poziv/2022_11/gv11-01.pdf

Arhitektonske fotografije na webu originalno su generirane i služe kao ilustracije, ne kao dokaz da je obrt projektirao prikazane moderne kuće i paviljone. Nemojte ih prikazivati kao dokumentarne fotografije referenci.

## Provjere

```bash
python scripts/check_site.py
node --check assets/js/site.js
```

Prvo provjerava interne poveznice, lokalne slike, SEO osnovu, osnovnu semantičku strukturu i alt tekstove. Za potpunu javnu predaju dodatno pokrenuti Lighthouse, WCAG testiranje, testove obrazaca, provjeru vanjskih linkova i stvarne analitike.

## Napomena za održavanje

Nema WordPressa, build sustava, npm paketa ili vanjskih CSS/JS frameworka. Svi vizuali su lokalni AVIF, a 3D model je implementiran izravno u `assets/js/site.js`.
