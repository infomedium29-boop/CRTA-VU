# CRTA VU – završna checklistа (27. 10. 2026.)

Kategorije: ✅ implementirano i provjereno · ⚠️ potrebna dodatna konfiguracija ili završna provjera · ❌ nije implementirano.

| # | Stavka | Status | Napomena |
|---|---|---|---|
| 1 | Privacy Policy | ⚠️ | Stranica postoji; treba završna provjera s vlasnicom i ažuriranje nakon integracije obrazaca/analitike. |
| 2 | Terms Page | ⚠️ | Stranica postoji; potrebna potvrda teksta i opsega usluga. |
| 3 | Clear CTA | ✅ | Primarni i sekundarni CTA na početnoj, u zaglavlju i relevantnim podstranicama. |
| 4 | FAQ | ✅ | Zasebna FAQ stranica i kontekstualni odgovori na stranicama usluga. |
| 5 | robots.txt | ⚠️ | Postoji; namjerno blokira indeksiranje dok se ne odobri javna verzija. Automatski se mijenja s `--public`. |
| 6 | sitemap.xml | ⚠️ | Generiran za sve sadržajne stranice; koristi rezerviranu `.example` domenu dok nije poznata stvarna domena. |
| 7 | Custom 404 | ✅ | Posebno dizajniran `404.html` s povratnim CTA. |
| 8 | ALT Text | ✅ | Slike imaju opisne alternativne opise; SVG dekoracija označena kao dekorativna. |
| 9 | Analytics | ⚠️ | Siguran mehanizam za aktivaciju isključivo nakon privole postoji; nije postavljen stvarni GA4 ID. |
| 10 | Meta Titles | ✅ | Svi HTML dokumenti imaju naslove; automatizirani test bez dupliciranih. |
| 11 | Meta Description | ✅ | Jedinstveni opisi na svakoj stranici. |
| 12 | Social Share | ⚠️ | OG/Twitter oznake implementirane; konačni apsolutni URL-ovi tek nakon povezivanja domene. |
| 13 | Favicon | ✅ | Lokalni SVG favicon i Apple touch ikonica. |
| 14 | Canonical URLs | ⚠️ | Mehanizam implementiran; stvarna domena nije definirana. |
| 15 | Cookie Consent | ✅ | Prikaz i odluke za odbijanje/prihvaćanje/postavke, lokalno spremljene bez aktivacije analitike prije privole. |
| 16 | Mobile Version | ✅ | Izvedene i vizualno pregledane desktop i mobilna širina; nema horizontalnog overflowa na testiranim širinama. |
| 17 | Accessibility | ⚠️ | Semantika, skip link, focus states, labeli, reduced motion, mobilni izbornik; puna WCAG revizija nije dovršena. |
| 18 | Test Forms | ⚠️ | Browser validacija postoji; e-mail nacrt preko `mailto:` radi po namjeni. Nema konfiguriranog automatiziranog servisa niti završnog testa produkcijske isporuke. |
| 19 | Check Broken Links | ⚠️ | Automatski pregledano 687 lokalnih href poveznica i 15 slikovnih pojavljivanja kroz 17 HTML stranica, bez grešaka; vanjski URL-ovi trebaju završnu live provjeru. |
| 20 | Optimise Performance | ⚠️ | Lokalni AVIF (četiri slike ukupno oko 762 KB), odgođeni JS i animacije; nije proveden javni Lighthouse/Core Web Vitals test. |

## Provedena tehnička kontrola

- ✅ `scripts/check_site.py`: **17 HTML datoteka, 687 linkova, 15 slikovnih pojavljivanja, 0 strukturnih grešaka**.
- ✅ `node --check assets/js/site.js`: prolazi parsiranje.
- ✅ Pregled u Chromiumu: desktop 1440×900, mobitel 390×844, bez JavaScript pogrešaka i bez horizontalnog prelijevanja.
- ✅ Interaktivni 3D: rotacija i promjena „Materijali / Nacrt” funkcionalno testirane.
- ✅ Mobilni izbornik: testirano otvaranje.
- ✅ Kontakt forma: pregledana prisutnost i struktura polja; automatska server-side isporuka nije konfigurirana.

## Potrebno prije javne produkcije

1. Potvrditi stvarne usluge, podatke o obrtu, odgovarajuća ovlaštenja, reference, fotografije i sadržaj s vlasnicom.
2. Unijeti konačnu domenu, aktivirati `--public`, verificirati Search Console, sitemap i canonical.
3. Ako se koristi automatizirani kontakt obrazac, postaviti Web3Forms ključ, potvrditi primatelja i testirati slanje/privatnost.
4. Po želji povezati GA4 uz postojeći mehanizam privole.
5. Revidirati politiku privatnosti i uvjete za konačne tehnologije i poslovni model.
6. Napraviti završni Lighthouse, WCAG i provjeru vanjskih poveznica na objavljenoj domeni.
