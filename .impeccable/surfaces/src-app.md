---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: []
---

# CourtSide app — surface brief

Scope: the whole native app (Games feed, game detail, Host form, Profile, sign-in, tab bar). Mode: Operate. iOS + Android, portrait, light-first with a full dark theme following the system.
Audience/job: students on one campus deciding in seconds whether a game is on, where, when, and how many spots; one tap to join. Memorable moment: watching a live score tick on a game's own court.
Constraints: data, RLS, realtime, and routes untouched. Guests see host, counts, live score; never the roster.
Unresolved: launch campus name; app icon/splash art.

## Direction contract

THESIS: The screen is painted like the court you're browsing. Each sport's own play area (hardwood, pitch, hard court, gridiron, diamond) is the banner and the card thumbnail. Refuses the category default: a stack of photo-header cards with an orange Join pill.

OWN-WORLD: Neutral #F3F4F2 ground, white cards, rounded Nunito with tabular figures. Sport surfaces in their real colors (maple #E3BD86, pitch #3A7449, hard court #2F6E9E, turf #2F6B3F, clay #B5653A) carry white painted markings. Navy boundary paint #1F3A5F for times and selected chips. Orange #FF6B2C is key paint: actions, live score tile, Host tab; orange text uses #C2410C. Dark theme dims surfaces like dusk.

STORY: The visitor sees which sport's court they're on, reads "One soccer game near you", sees the live score on the court itself, then scans Today and Later, and joins.

FIRST VIEWPORT: Full-width sport-surface banner (about 300pt) under the status bar: headline counting what's on, sport chips, and the live game card sitting on the surface with an orange score tile and pulsing dot. Below: Live now / Today / Later this week sections of white cards with surface thumbnails, time in navy, spots right. Tab bar: Games, Host (orange + about 40% larger, in the bar), Profile.

FORM: Hardwood, light-first (grounded candidate 2 of my list, user-chosen over Arena Scoreboard, Varsity, and canon). seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
