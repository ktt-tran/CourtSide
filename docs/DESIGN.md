---
name: CourtSide
description: Pickup games on one campus, painted on the court you're browsing.
colors:
  key-paint-orange: "#FF6B2C"
  key-paint-pressed: "#E85A1D"
  orange-ink: "#C2410C"
  boundary-navy: "#1F3A5F"
  on-navy: "#FFFFFF"
  navy-tint: "#E4E9F0"
  ground: "#F3F4F2"
  paper: "#FFFFFF"
  line: "#E2E4DF"
  ink: "#1B1D1B"
  ink-soft: "#545A55"
  ink-faint: "#6F756F"
  pressed: "#ECEDEA"
  tab-bar: "#FFFFFF"
  danger: "#B3261E"
  danger-tint: "#FCE8E6"
  surface-maple: "#E3BD86"
  surface-maple-alt: "#DCB37B"
  surface-pitch: "#3A7449"
  surface-pitch-alt: "#356C44"
  surface-tennis: "#3B7A57"
  surface-hard-court: "#2F6E9E"
  surface-turf: "#2F6B3F"
  surface-turf-alt: "#2B6339"
  surface-diamond-grass: "#3D7A46"
  surface-clay: "#B5653A"
  surface-pickup: "#4A4F57"
  surface-pickup-alt: "#454A52"
  court-paint: "#FFFFFF"
  dusk-overlay: "#0B0D12"
  dusk-ink: "#FFF4E6"
  dark-ground: "#15171C"
  dark-paper: "#1F2229"
  dark-line: "#2E323B"
  dark-ink: "#EDEAE3"
  dark-ink-soft: "#B4B7BE"
  dark-ink-faint: "#8E929A"
  dark-navy: "#A9C1E3"
  dark-navy-tint: "#26303F"
  dark-orange-ink: "#FFB27A"
  dark-danger: "#F2B8B5"
  dark-danger-tint: "#3B1F1E"
  dark-tab-bar: "#111317"
  dark-pressed: "#272B33"
typography:
  display:
    fontFamily: "Nunito_900Black"
    fontSize: "30px"
    lineHeight: "35px"
    letterSpacing: "-0.3px"
  title:
    fontFamily: "Nunito_800ExtraBold"
    fontSize: "22px"
    lineHeight: "28px"
  headline:
    fontFamily: "Nunito_800ExtraBold"
    fontSize: "17px"
    lineHeight: "22px"
  body:
    fontFamily: "Nunito_600SemiBold"
    fontSize: "16px"
    lineHeight: "23px"
  meta:
    fontFamily: "Nunito_700Bold"
    fontSize: "14px"
    lineHeight: "19px"
  small:
    fontFamily: "Nunito_700Bold"
    fontSize: "12px"
    lineHeight: "16px"
  section:
    fontFamily: "Nunito_900Black"
    fontSize: "13px"
    lineHeight: "18px"
    letterSpacing: "0.9px"
  score:
    fontFamily: "Nunito_900Black"
    fontSize: "26px"
    lineHeight: "30px"
    fontFeature: "tnum"
  score-huge:
    fontFamily: "Nunito_900Black"
    fontSize: "56px"
    lineHeight: "60px"
    fontFeature: "tnum"
rounded:
  sm: "10px"
  md: "14px"
  lg: "20px"
  banner: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.key-paint-orange}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "50px"
  button-primary-pressed:
    backgroundColor: "{colors.key-paint-pressed}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "50px"
  button-secondary-pressed:
    backgroundColor: "{colors.pressed}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  chip-selected:
    backgroundColor: "{colors.boundary-navy}"
    textColor: "{colors.on-navy}"
  feed-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px"
  live-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px"
  score-tile:
    backgroundColor: "{colors.key-paint-orange}"
    textColor: "{colors.ink}"
    typography: "{typography.score}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  sport-thumb:
    rounded: "{rounded.md}"
    size: "64px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "50px"
  avatar:
    backgroundColor: "{colors.navy-tint}"
    textColor: "{colors.boundary-navy}"
    rounded: "{rounded.pill}"
    size: "36px"
  host-tab-tile:
    backgroundColor: "{colors.key-paint-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "32px"
---

<!-- Recorded from the shipped build on 2026-10-19. Verified by the user on one iPhone in light mode only. The live state and dark mode have not been captured, and Android is unverified. Open follow-up: the app icon and splash are still Expo default assets. -->

# Design System: CourtSide

## Overview

**Creative North Star: "Hardwood"**

The screen is painted like the court you're browsing. Each sport's own play area (maple boards, a mowed pitch, a hard court, a gridiron, a clay diamond) is drawn as flat vector art with white painted lines, and it becomes the feed banner and every card thumbnail. Around that painted surface the app is quiet: a soft neutral ground, white cards, rounded Nunito, figures that line up. The paint carries the meaning. Navy is boundary paint (times, selection). Orange is key paint: the thing you tap, the score that's live, the tab that makes a game exist.

Density is a compact event listing, not a social feed. Each card holds a court, a navy time, a title, a place and distance, and a big spots count on the right. Light is the default. The dark theme is the same court after dusk: the surfaces dim under an overlay, the paint stays bright, and text on the court turns warm cream.

The world refuses the category default of photo-header cards with an orange Join pill. It also avoids the anti-references in PRODUCT.md (hardcore or elite, corporate booking). Nothing here is pro-league chrome or a time-slot table.

**Key Characteristics:**
- Sport surfaces are the only imagery, and every one is react-native-svg vector art in its real color.
- Orange is key paint only. Navy is boundary paint. Neutrals carry the structure.
- Rounded Nunito throughout. Rank comes from weight first and size second. Every number uses tabular figures.
- Flat at rest. The only shadow belongs to cards sitting on a painted surface.
- Soft forms: 20pt cards, pill buttons and chips, a banner with 28pt rounded bottom corners.
- Motion is minimal: native transitions plus one pulsing live dot, which holds still under Reduce Motion.

## Colors

The palette is a quiet neutral frame around real playing-surface colors, with two paints on top: navy for boundaries and orange for keys.

### Primary
- **Key Paint Orange** (key-paint-orange): basketball orange. It fills primary buttons, the live score tile, the live dot, and the Host tab tile. Fills always carry dark ink (`ink` in light, `dark-ground` in dark). It is the same value in both themes. Pressed primary buttons use Key Paint Pressed.
- **Orange Ink** (orange-ink; dark-orange-ink in dark): the only way orange appears as text. It covers the "LIVE · 22:14" label, the Host tab's active label, the sign-in mode switch link, and the input cursor.

### Secondary
- **Boundary Navy** (boundary-navy; dark-navy in dark): times on feed cards, selected chips, the active tab tint, the focused input border, the selected sport tile border, and avatar initials. On the basketball court it also fills the painted lane and key, in both themes.
- **Navy Tint** (navy-tint; dark-navy-tint in dark): avatar backgrounds only.

### Tertiary: Sport Surfaces
- **Maple** (surface-maple / surface-maple-alt): hardwood boards with faint seams. Text on maple is Boundary Navy.
- **Pitch** (surface-pitch / surface-pitch-alt): soccer, with mowing stripes.
- **Tennis** (surface-tennis outer, surface-hard-court inside the lines).
- **Turf** (surface-turf / surface-turf-alt): the football gridiron.
- **Diamond** (surface-diamond-grass outfield, surface-clay infield).
- **Pickup Asphalt** (surface-pickup / surface-pickup-alt): the fallback for "other" and the location-off state.
- **Court Paint** (court-paint): every line marking.
- Text on the green, blue, and asphalt surfaces is white in light mode. In dark mode all text on any surface is **Dusk Ink** (dusk-ink).

### Neutral
- **Ground** (ground): screen background, headers, scene background, splash and adaptive-icon background.
- **Paper** (paper): cards, inputs, secondary buttons, unselected chips, and the tab bar.
- **Line** (line): 1pt card borders, 1.5pt input, chip, and secondary-button borders, and the tab bar's top hairline.
- **Ink / Ink Soft / Ink Faint**: primary text, secondary text and inactive tab icons, then placeholders and the struck-through "Full" count.
- **Pressed** (pressed): the pressed fill for chips, secondary buttons, and sport tiles.
- **Danger / Danger Tint**: errors only.
- Each neutral has a dark counterpart (dark-*). The dark tab bar (dark-tab-bar) sits deeper than the ground.

### Named Rules
**The Key Paint Rule.** Orange (key-paint-orange) goes only on primary actions, the live score tile, the live dot, and the Host tab tile. Never use it to decorate a surface, an avatar, a border, or a background. Orange text always uses Orange Ink, never the fill value.

**The Live Is Never Red Rule.** Live state is orange plus motion. Danger red is for errors only.

**The Dusk Rule.** In dark mode, surfaces dim under a dusk-overlay layer at 40% opacity while the paint (key paint fills, court paint) stays bright. Text on a surface uses Dusk Ink.

## Typography

**Display Font:** Nunito Black (Nunito_900Black), falling back to the system font if loading fails
**Body Font:** Nunito SemiBold (Nunito_600SemiBold)
**Label Font:** Nunito Bold / ExtraBold

**Character:** One rounded, friendly sans at four weights. It reads like a campus intramural sign, not a pro league. Rank comes from weight first and size second. Sizes are React Native points (dp).

### Hierarchy
- **Display** (Black, 30/35, -0.3 tracking): the feed banner headline, the game detail title on its court, and the sign-in heading.
- **Title** (ExtraBold, 22/28): empty-state and screen headings, the spots count on feed cards, the profile name, and "Who's going".
- **Headline** (ExtraBold, 17/22; 16 in buttons): card titles, button labels, host name, and team names.
- **Body** (SemiBold, 16/23): descriptions, input text, banner notes, and Meta rows. Centered body copy caps at 300 to 320pt wide.
- **Meta** (Bold, 14/19): card time (navy), place and distance, field labels, and chip labels.
- **Small** (Bold, 12/16): "spots left" and the live clock. The live label adds 0.6 tracking.
- **Section** (Black, 13/18, 0.9 tracking, uppercase, Ink Soft): feed time sections such as TODAY and LATER THIS WEEK.
- **Score / Score Huge** (Black, 26/30 and 56/60, tabular): the score tile on a live card and on the game detail screen.
- Navigation titles use Black at 18. Tab labels use ExtraBold at 11.

### Named Rules
**The Separate Families Rule.** Each Nunito weight is its own family. Pick the weight by `fontFamily` and never set `fontWeight` alongside it.

**The Tabular Figures Rule.** Every number uses tabular figures (`fontVariant: ['tabular-nums']` via `type.numeric`, `type.score`, or `type.scoreHuge`): times, distances, counts, scores, and clocks.

**The Section Is the Heading Rule.** Section labels such as TODAY and LATER THIS WEEK are headings themselves (accessibilityRole header). Nothing sits above a heading as a kicker or eyebrow.

**The Honest Count Rule.** The feed headline agrees in number: "One soccer game near you", "3 soccer games near you", "No soccer games yet". It reads "Finding games near you" while loading.

## Layout

The app is portrait only, single column, with 16pt screen gutters. The spacing scale runs 4 / 8 / 12 / 16 / 24 / 32. In practice: 10pt between feed cards, 26pt above a section heading and 10pt below it, 22pt between Host form groups, 18pt between detail-screen blocks, and 32pt padding around centered empty and prompt states.

The feed opens on the **court banner**: the selected sport's surface painted edge to edge under the status bar (top padding is the safe-area inset plus 14pt). The headline and an optional note sit on bare surface, with sport chips 16pt below them. Any live games sit on the court after that. Minimum height is 220pt. With nothing live, the banner adds 130pt of bottom padding so one whole court end is drawn below the chips. The game detail hero follows the same pattern: minimum 240pt, 150pt of court room when the game isn't live, and content pinned to the bottom under a transparent header. The status bar and header tint follow the surface's ink.

Horizontal chip rows bleed to the screen edge, with a 16pt content inset. The Host sport picker is a wrapping grid of three tiles (31% width, growing to fill).

### Named Rules
**The Clear Court Rule.** Court markings never sit behind the headline or the chips. Markings start below the measured text and chip heights (`top`), and the banner keeps room for a whole court end when nothing is live.

## Elevation & Depth

The system is flat at rest. Depth comes from layering: ground, then paper with a 1pt line border, then painted surface. There is one shadow, and it marks a card resting on a painted court.

### Shadow Vocabulary
- **On-Court Lift** (shadowColor #000, opacity 0.16, radius 10 on the live card and 12 on the detail live card, offset 0/4, Android elevation 4): only for the live card sitting on the court banner and the live panel on the game detail hero.

### Named Rules
**The Flat Ground Rule.** Cards on the neutral ground use a hairline border, not a shadow. A shadow means the card sits on a painted court.

## Shapes

Forms are soft and rounded throughout. Corners step from 10 (Host tab tile) to 14 (thumbnails, inputs, score tile) to 20 (cards, fact panels, large score tile, sport tiles, error box). The banner and detail hero round only their bottom corners at 28. Buttons and chips are full pills, and avatars are circles. Borders are thin and neutral: 1pt on cards, 1.5pt on inputs, chips, and secondary buttons, and 2pt on Host sport tiles, which turn navy when selected. Inside the art, the court markings are geometric (lanes, arcs, center circles, boxes) and always in Court Paint.

## Components

### Buttons
Tactile and plain: a pill that tells you what it does.
- **Shape:** full pill (rounded.pill), 50pt minimum height, 22pt horizontal padding, optional 18pt Ionicon 8pt before the label.
- **Primary:** Key Paint Orange with dark ink. Pressed state uses Key Paint Pressed.
- **Secondary:** a paper pill with a 1.5pt Line border and ink text. Pressed state uses Pressed.
- **Disabled / Busy:** 45% opacity when disabled. Busy swaps the label for a spinner in the label color.

### Chips
- **Style:** 38pt pills with a Paper fill, 1.5pt Line border, Meta label in Ink, 8pt gaps, and a 5pt vertical hit slop. Single-select.
- **State:** selected chips fill with Boundary Navy and use On Navy text. Pressed chips use Pressed.
- **On Surface:** on a painted banner the border goes transparent so the chip reads as an opaque white token on the court.

### Cards / Containers
- **Feed Card:** a Paper row with a 1pt Line border, rounded.lg, 12pt padding, and 14pt gaps. Left to right: a 64pt sport thumbnail, then the body (navy tabular time, a two-line Headline title, Meta place and distance), then a spots column (Title-size tabular count over Small caption, minimum width 54pt). "Full" turns Ink Faint and struck through. Pressed: 88% opacity at 0.99 scale. Cards show counts only, never names.
- **Live Card:** a Paper card on the banner with On-Court Lift, 14pt padding, and no border. A score tile sits on the left. The body has the live label, the title, then teams or place, then place or host.
- **Fact Panel / Locked Roster:** a Paper panel with a Line border, rounded.lg, and 16 to 18pt padding, holding Meta rows (17pt Ink Soft icon plus tabular Body text).

### Inputs / Fields
- **Style:** a Meta label in Ink Soft 8pt above the input. The input is 50pt tall with a 1.5pt Line border, rounded.md, Paper fill, and 14pt horizontal padding. Multiline inputs are 100pt minimum.
- **Focus:** the border turns Boundary Navy. The cursor uses Orange Ink and the selection uses Key Paint Orange.
- **Error:** errors render as Meta text in Danger below the form, not on the field.

### Navigation
- **Tab bar:** three tabs (Games, Host, Profile) on the Tab Bar color with a Line top hairline. Labels are ExtraBold 11. The active tint is Boundary Navy and the inactive tint is Ink Soft. Games and Profile use 24pt Ionicons, switching from outline to filled when focused.
- **Host tile:** a 32pt Key Paint Orange rounded square (rounded.sm) with a 25pt dark "add" glyph, sitting in the bar and not raised or floating. It scales to 1.06 when focused. Its active label uses Orange Ink.
- **Stack:** headers on Ground with no shadow, titles in Black 18, and a minimal back button. Sign-in is a modal.

### Sport Surface (signature)
This is the world itself: `SportSurface` draws a sport's play area at any size in two variants. The **banner** variant draws a whole court end (for basketball: lane in navy, free-throw circle, three-point arc) from the `top` line downward. The **thumb** variant draws a complete miniature court clipped to rounded.md. Boards and mowing stripes alternate base and alt tones. In dark mode the dusk overlay sits on top. The empty and sign-in prompts reuse thumbnails, and the sign-in prompt fans three at ±6°.

### Live Score (signature)
- **Live Dot:** an 8pt Key Paint Orange dot with a ring that scales to 2.4x and fades over 1100ms (ease-out quad), repeating. Under Reduce Motion there is no ring. This is the only looping motion in the app.
- **Live Label:** the dot plus "LIVE · 22:14" in Small Orange Ink at 0.6 tracking, with a ticking tabular clock. It is live status data, not a heading label.
- **Score Tile:** a Key Paint Orange tile, rounded.md, at least 92×68pt, showing the score ("14–11") in tabular Score with the clock in Small beneath, both in dark ink. Before the first score it shows "0–0" at 55% opacity. The large variant stretches full width with Score Huge and rounded.lg.

### Avatar
Initials (the first two characters, uppercase, Black at 38% of the size) in Boundary Navy on a Navy Tint circle. It comes in 36, 44, and 80pt sizes. Photos will replace initials when uploads exist.

## Do's and Don'ts

### Do:
- **Do** paint the selected sport's own surface as the banner and thumbnail, and draw it as react-native-svg vector art in the colors from `src/lib/surfaces.ts`.
- **Do** keep orange to key paint: primary buttons, the score tile, the live dot, and the Host tab tile. Fills carry dark ink, and orange text uses Orange Ink (#C2410C light, #FFB27A dark).
- **Do** use Boundary Navy for times, selection, focus, and the active tab.
- **Do** give every avatar a Navy Tint background with navy initials.
- **Do** start court markings below the headline and chips, and leave room for a whole court end when nothing is live.
- **Do** make section labels (TODAY, LATER THIS WEEK) the headings themselves.
- **Do** make the feed headline agree in number: "One soccer game near you" / "3 soccer games near you" / "No soccer games yet".
- **Do** use tabular figures for every number.
- **Do** select Nunito weights by family name (fonts.semibold through fonts.black).
- **Do** dim surfaces in dark mode with the dusk overlay at 40%, keep the paint bright, and set text on surfaces in Dusk Ink.
- **Do** build styles with `createStyles` so both themes come from one palette.

### Don't:
- **Don't** put decorative orange on surfaces, avatars, borders, or backgrounds, or use the orange fill value for text.
- **Don't** use red for live. Danger is for errors only.
- **Don't** set `fontWeight` on Nunito text.
- **Don't** place a kicker or eyebrow label above a heading.
- **Don't** draw court markings behind the headline or the chips.
- **Don't** ship raster imagery for surfaces or swap in photo-header cards.
- **Don't** give cards on the neutral ground a shadow. Shadows mean a card sits on a painted court.
