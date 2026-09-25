# Assumptions (Phases 1–2)

Calls I made where CONTENT-TODO.md was silent or ambiguous. Anything here can be reversed in one edit.

## Design system
- **Single fixed green (your request).** Every section is emerald (hue 148, 74% saturation). There is no scroll recolouring and no drift. Contrast: accent 12.9:1, body text 6.4:1. To bring shifting back, give sections different `data-hue` values.
- **Drift** is removed. `--drift` stays in tokens.css at 0.
- **Fonts.** Inter Tight (400/600) comes from Google Fonts with `display=swap`. Space Mono is self-hosted, latin subset, 400 and 700 (16 KB each).
- **Section hues.** The brief's rotating palette was replaced by one green.

## Content
- **Thesis line (I wrote it; please rewrite it in your own words):** "If something is harder than it should be, it's usually a tool nobody has built yet." It echoes the hero headline.
- **Hero headline** is the brief's example, used as-is.
- **Hero body** is my three-line summary, built from facts in the brief and TODO.
- **About paragraph** is the existing site copy, verbatim, except "co-founding Aspire.AI" is now "founding Aspire.AI" to match your Founder title.
- **Fulminare** shows the role "AI Research Partner" with no description, since you didn't give one. Status reads "Ongoing" and it links to fulmina.re.
- **Tech chips** only restate facts you gave (Browser-based, Local, Voice, Linux Mint, Vision, Step marking). I didn't guess any frameworks. Cards without known facts have no chips.
- **Projects the brief named but TODO section D left out** are not shown: SIH solver, CAFO detector, DataForge x Rime.
- **Timeline** is newest first. The Guinness World Record is cut, per your instruction. The Team Velora Curtin STEM result (4th of 150+) is listed under 2025.
- **Debate** year is 2025, per your message.
- **The Dropout Myth** is marked complete and links to welcome.inquires-thedropoutmyth.workers.dev. **Aspire.AI** stays Building, with no link. **Medium** is text only ("published as Nirbav Sankar"), because no profile URL was given. **NASA citizen science** is text only.
- **Contact.** The phone/WhatsApp number was dropped from the public page, since a minor's personal number on a public site is a risk. Email, LinkedIn and Instagram kept their existing URLs. There's no GitHub link because the URL was blank.
- **Marquee.** ELECTRICAL DESIGN and DATA CENTRES were removed, since the engineering section is omitted. AI AGENTS, PODCASTS and RESEARCH were added from real content.
- **"What I work on"** panel lists the six old Services titles as chips. The long service descriptions were cut.

## Routes
- `projects.html` → `/#software`, `services.html` → `/#about`, `milestones.html` and `certifications.html` → `/#competitions`. They're static meta-refresh stubs with a visible link, so they work without JS. `vercel.json` is unchanged.
- `index.html#about` and `#contact` still resolve, since those ids are kept.

## Cut
- **Background videos** (3.8 MB), per TODO A.
- **LineWaves shader and lanyard sway.** They exist in the old pages as a 30 KB inline React component (WebGL canvas plus a CSS keyframe). They depend on the 212 KB dc-runtime and React. Cut for the budget. They're recoverable from git (`dcadfb1`).
- **dc-runtime, React, 26 unused font files, animated nav-logo GIF (223 KB), PNG favicon (94 KB), cursor-trail images.** Replaced by an SVG favicon.

## Not done
- **"We don't cancel" line.** It isn't in `muntool/index.html` (checked case-insensitively for "cancel") or in `~/sodmun-website`. The live MUN site may be deployed from a repo that isn't on this machine.
- **`muntool/index.html`** still has one 58 KB base64 logo inside a JS constant (`BRAND_LOGO`). It's a separate app, so I left it alone.
- **Phase 0 image-name bug.** The six Services images and five cursor-trail images had swapped names. Fixed by renaming. The mapping in the report still needs your confirmation.

## Photo and legal
- **Portrait:** the existing `nirbav-portrait.jpg` (1084×1440, 87 KB) is in the About panel. It lazy-loads and has width and height set, so it doesn't shift the layout.
- **Privacy notice** (`/privacy.html`) is linked from the footer. It covers Vercel server logs and Google Fonts IP requests. It's plain-language and not legal advice.
- **Terms of use** (`/terms.html`) was added at your request. It covers content ownership, third-party logos (shown to identify, not endorse), external links and "as is". Plain-language, not legal advice. Privacy and Terms are underlined links in every footer.

## React components (GridMotion, DodgeField, LatticeLoader)
- **Rebuilt in plain JS and CSS from the props you pasted.** The component source wasn't included, and React alone would cost about 140 KB. `js/fun.js` is 7.6 KB.
- **GridMotion** is an auto-running, CSS-only band between /01 and /02. It never pauses, per your request, but stops under reduced motion. The tiles are your projects, awards and own photos. The Unsplash stock image was not used, because the brief bans stock photography.
- **LatticeLoader** runs at startup on deep green (`hsl(148 58% 11%)`), in 3×3 orbit, 90 ms steps, showing "Thinking" with a timer and then "Done in X s" in #22c55e. It stays at least 0.9 s so it's visible, and a CSS failsafe hides it after 5 s. It never appears with JS off. It may cost some Lighthouse LCP time; this gets measured in Phase 4.
- **Easter eggs:** the footer button dodges 4 times, then says "u r jobless. stop clicking me". Reaching the very bottom shows the toast "you read my whole website. respect." once per session. Typing `bocajuniors` (blue and gold bugs) or `mun` releases bugs that flee the cursor; click to squash, Esc to clear.

## Mobile
- **Nav:** all five links stay on phones as a swipeable strip with a fade at the right edge. Nothing is hidden.
- **Tap targets:** on touch screens every link has a 44 px minimum tap area. Hover effects don't stick after a tap.
- **Easter eggs without a keyboard:** 5 quick taps on the NIRBAV_ logo releases the `mun` bugs, and 5 quick taps on the giant footer wordmark releases the Boca bugs. The dodging button already works by tap.
- **Grid band:** tiles shrink to 150×84 under 560 px.
- **Grid logos:** your gavel (for MUN), SODMUN, Dropout Myth, Falcon Motorsport, Fulminare and YBS. All six were rescaled to about 480 px (high-quality bicubic; the Myth source is only 51 px, so it stays soft), their backgrounds made transparent, and dark marks recoloured white. The Falcon white disc was removed; the red MOTORSPORT is kept. The only MUN name left in the grid is SODMUN; the conference award tiles, Chair logs, Secretariat and the MUN Tools text tile were removed. The software cards and timeline still name those conferences.
- **Logos replace placeholders.** In the grid, "The Dropout Myth", "Falcon Motorsport" and "Youth Builder Society" text tiles are now logo tiles. Small logos sit beside the Fulminare, Dropout Myth, YBS and Falcon Motorsports names in the cards and timeline, decorative with empty alt. The SODMUN logo replaces the word itself ("[SODMUN] V", alt "SODMUN").
- **Beyond the Bite** logo cut out (dark green → white, gold kept) via `tools/logo-cutout.ps1`. It replaces the text tiles and old photo tile in the grid and sits beside the Writing card title. **F1 in Schools** text tiles and marquee items now show the Falcon Motorsport logo. **Linux Mint** was removed: the grid tile became "Podcasts" and the Jason chip is gone.
- **Grid rebuilt by `tools/build-grid.js`:** a seeded shuffle where no tile repeats within a row (so never next to itself, even at the loop seam), never sits directly above its twin, and no two green tiles touch.
  - The INSPIRE '26 tiles show your prototype photo.
  - CBSE grader is the existing CBSE Helper screenshot.
  - Aspire.AI was removed from the grid only; it's still in the hero windows, software card and About text.
  - The FIDE chess tile is a hand-drawn black-and-white pawn plus "chess.com" text, **not** the official logo, because downloading it needs your OK.
- **SODMUN V card** links to https://sodmun.com.
- **Content update:**
  - Aspire.AI is removed everywhere (card, hero window → Fulminare, About).
  - NASA citizen science is removed everywhere.
  - Fulminare's role is "Senior Lead". YBS reads "Co-founder and Head of Outreach".
  - Medium links to @nirbavsankar in the Writing card and contact links.
  - About now reads "as a Senior Lead at Fulminare and leading design for F1 in Schools".
- **Timeline:** 2026 has "Team Velora begins", a native `<details>` arrow that expands to show Curtin (4th of 150+), DYIO and INSPIRE '26. It works without JS.
  - Curtin was dated 2025 earlier; it now sits inside the 2026 Velora group, per your latest instruction.
  - 2025 keeps Model UN, the Coimbatore debate and the Litigation Law Simulation.
- **Intro sequence** (about 3.5 s in total): 26 green equaliser bars sweep in from the left while pulsing, drift right, then scatter (0–1.9 s). The Thinking lattice takes over, shows "Done in X s", and fades out. The hero entrance waits for it via `html.loaded`, and stat counters start after that. Failsafes: the loader hides itself at 7 s, and `loaded` is forced at 7 s. It's skipped entirely under reduced motion. It will cost Lighthouse LCP time; the trade-off gets measured in Phase 4.
