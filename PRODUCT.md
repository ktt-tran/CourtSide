# CourtSide — Product

## One line
A local pickup-game feed for one college campus: host a game, see what's happening nearby, watch the score live, show up.

## Platform
ios + android (Expo SDK 57, React Native, Expo Router). Portrait only. Web guest view is on the roadmap, not shipping now.
Native affordances win over custom chrome: tab bar, modal sheets, system back gestures, Dynamic Type.

## Users
- **Primary: students on one launch campus** who want a game *today*: basketball first, then soccer, football, baseball, tennis.
- **Hosts:** students who already organize runs in group chats. They're the supply side and the most valuable users.
- **Guests:** can browse the feed, counts, and live scores without an account. They need an account to RSVP, host, or see who's going (enforced by RLS).
- Usage scene: on a phone, often outdoors or walking to the gym, deciding in seconds whether to go.

## Core jobs
1. "Is anything happening near me right now / soon?" (proximity feed, sport filter)
2. "Get people to my game" (host: title, sport, time, max players, pinned to current location)
3. "I'm in" (RSVP; going vs. playing are separate)
4. "What's the score?" (host flips game live, realtime score and elapsed time)

## Product truths and constraints
- Cold start is the main risk. An empty feed teaches "nothing happens here," so empty and sparse states are first-class surfaces, not afterthoughts.
- Privacy line: the public sees the host and aggregate counts, never the roster. Signed-in users see the roster.
- Live state is special and rare: only live games get the live treatment.
- The feed card is closer to an event listing than a social post: avatar-first and compact, but carrying structured info (where, how far, when, how many).
- Trust at in-person meetups matters (report/block and host verification come later; leave room for them).
- Not built yet: address search, profile photos, recurring games, ranked feed, comments/chat.

## Brand personality
**Friendly and casual.** All levels welcome, low pressure, the feeling of a campus where there's always a game. Confident about the game itself, never about the player's skill.
Voice: short, plain, warm, the way a friend texts the group chat ("Run at the Rec, 6pm, need 3"). Encouraging empty states. No jargon, no hype, no exclamation-mark spam.

## References
- `references/inspiration.png` (BeSport concept): **strong reference.** Take its dark UI, single bold warm accent, venue photography, dense game cards with avatar stacks and spot counts, and prominent primary action. Make it warmer and more welcoming than the original's competitive edge.

## Anti-references (never feel like)
- **Hardcore / elite:** skill gatekeeping, pro-league or esports aesthetics, intimidating "ballers only" energy.
- **Corporate booking:** facilities-portal forms, reservation-system coldness, tables of time slots.

## Design direction (agreed 2026-10-19)
Decided with the user before the visual build. The design pass turns these into tokens and DESIGN.md.
- **Theme:** light by default (revised 2026-10-19 after seeing both), plus a full dark theme that follows the system setting.
- **Accent:** basketball orange (~#FF6B2C) is the only brand color. It covers primary actions, the active tab, and live state.
- **Live:** shown with the accent plus motion (pulsing dot, ticking clock). No separate red.
- **Type:** a rounded, friendly sans throughout.
- **Shape:** soft and rounded. Cards around 16–20 radius, pill buttons.
- **Imagery:** each sport has its own playing surface (maple court, striped pitch, hard court, clay diamond) with painted markings. It is the feed banner for the selected sport tab and the card thumbnail, until host photos exist.
- **Visual world:** "Hardwood", the painted playing surface. Chosen 2026-10-19 over Arena Scoreboard, Varsity, and the category standard.
- **Feed:** sections by time: Live now → Today → Later this week. Sport filter stays.
- **Banner per sport tab:** each sport tab's banner is that sport's own play area (Basketball → hardwood court, Soccer → pitch, Tennis → tennis court, Football → gridiron, Baseball → diamond). The headline counts what's on and matches the number: "One soccer game near you" / "3 soccer games near you". No small label stacked above the heading.
- **Host CTA:** the center tab, an orange + icon clearly larger than the other tab icons (about 40%); it sits in the bar, not raised or floating.
- **Motion:** minimal. Native transitions plus the live pulse; respect Reduce Motion.
- **Empty feed:** fall back to a preview of the coming week's scheduled games. If that's empty too, invite the user to host.

## Open follow-ups
- Splash and app icon artwork still carry the default Expo assets; replace with CourtSide marks during the design pass.
- Launch campus not yet named.
- The current light theme (`src/lib/theme.ts`, `userInterfaceStyle: "light"`) is replaced by the Hardwood direction above; `app.json` must move to `"automatic"` so dark mode follows the system.
