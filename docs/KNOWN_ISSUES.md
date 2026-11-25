# Known issues — frontend

Bugs and quirks found while building the 4-week schedule (PR #327) and left as they are on purpose: the intended behaviour isn't clear yet, or the fix is outside that PR's scope.
Method and computed names are the stable reference; line numbers drift.

## `RadioPlayer.vue`

### Crashes

- **A failed episode fetch takes down the whole page.** `getLatestEpisodeFromArcsi` catches errors with `this.$nuxt.error({ statusCode: 404 })`, which replaces the site with the error page. It's a background request every 15s. A show with no episodes triggers it: arcsi's `get_show_items` does `items[0]` on an empty list → `IndexError` → 500.

### Name match miss

- **When the Azuracast name matches no arcsi show, the player shows nothing** (no show, no episode, default art). `checkNowPlaying` sets `this.show = arcsiShowList.find(...)` by name; on a miss it's `undefined`. This used to throw a `TypeError` in `getLatestEpisodeFromArcsi` and `nowPlayingArt`; guarded in PR #327.
- Misses got likelier in PR #327: the player only knows today's rotation week. So a show playing outside its scheduled week isn't found, and neither is any show while today's week isn't loaded yet (the SSR request failed, or up to a minute after the Sunday → Monday rollover).
- Alternative, not built: fall back to the time-based pick below.

### "Now playing by time" fallback

`findShowOnAir` in `app/plugins/showOnAir.js`, moved 1:1 out of `checkNowPlaying`. Pinned by tests marked "current behaviour" in `app/tests/showOnAir.test.js`.
- No match → `this.show` stays the **last show of the day**, so something is always "on air".
- Compares hours only, end inclusive: at 19:30, an 18:00–19:00 show still matches and wins over a 19:00–20:00 one.
- `getCurrentTimeHourCET()` (`toLocaleString` with `hour12: false`) returns `"24"` at midnight on Node 20.10, so a 00:00–01:00 show never matches. **It depends on the runtime's ICU data:** Node 24 returns `"00"`, and the "current behaviour" test fails there. Browsers may differ the same way. `hourCycle: 'h23'` would make it `"00"` everywhere.
- Compares strings, not numbers. It works only because both sides are zero-padded to 2 digits.
- Shows that cross midnight (e.g. 23:00–01:00) aren't handled here. (The schedule page's "On Air" marker handles them since PR #327.)
- Empty day → `this.show` keeps whatever it held before: yesterday's fallback pick, or the last name match.

### Other

- **Episode fetch runs when it isn't needed.** `getLatestEpisodeFromArcsi` runs every 15s whenever `showCheck` is true, but `latestEpisodeData` is only read when Azuracast has no now-playing info. Which episode it should pick (`/page?filter=latest` = newest by `play_date`, archived or not) is an open question for the arcsi admins.
- **`nowPlayingShow` commits to the store as a side effect of a computed.** It sets `player/setStreamShowTitle` whenever it re-evaluates, so a commit from anywhere else is overwritten. Hard to test or reason about; worth moving into `checkNowPlaying`.
- **`player/showsByDate` uses the current rotation week for all 7 days.** On Saturday, "Monday" really belongs to next week. Only `components/schedule/Home.vue` reads it, and only `[0]` (today), so nothing visible breaks.

## Schedule page

- **Week 53 header shows the ISO year, not the calendar year.** Dec 28 2026 – Jan 3 2027 reads "Week 53 · 2026", including on Jan 1–3 2027. Open question for the admins: how does the mobile app label it? Web should match.
  - Proposed fix (not built): when Monday and Sunday fall in different calendar years, show both: "Week 53 · 2026/27". Covers every week that crosses New Year, not only W53 (e.g. 2027-12-27 – 2028-01-02 → "Week 52 · 2027/28"). Week number stays ISO, so it still matches arcsi and the mobile app.
  - Not an option: "Week 52 · 2026 / Week 1 · 2027" — those are other weeks.
  - Next W53 after 2026: 2032.
- **53-week years repeat a rotation week.** Rotation week = ISO week % 4, the same formula arcsi and the playout use. 2026-W53 and 2027-W01 are both B, so every show shifts by one week for 2027 compared to a continuous A-B-C-D cycle. Copied as-is so the site matches what airs; asked the admins whether it's intended.
- **Sunday's late show loses "On Air" at midnight.** The current week moves on to the new Monday, so a Sunday 23:00–01:00 show that is still on air sits in the previous week. Visible only after paging back.
- **Same show name on two consecutive days, crossing midnight:** after midnight both entries are marked "On Air" (yesterday's, which is running, and today's later one). The marker matches by name and doesn't check the time of day.
- **Shows with `day: 0` are never listed.** PROD has one (show 219). Both the schedule page and `groupShowsByDay` only know `1` (Monday) .. `7` (Sunday). Meaning asked to the admins.

## Store / SSR

- **A failed tiles request takes down every page.** `nuxtServerInit` calls `error({ statusCode: 404 })` when `all_details` fails, so every route renders the 404 page, and a transient server error is reported as "not found". The schedule request no longer does this (PR #327: Sentry + an error state on the schedule page, retried on the client). Proposal: the same treatment for the tiles.

## Tooling

- **ESLint is broken project-wide.** The root `.eslintrc` extends `@nuxtjs`, but `@nuxtjs/eslint-config` lives in `app/node_modules`, so ESLint can't resolve it.
- **Unit tests need Node ≥ 20.10; the project pins 14.21.3** (`app/.nvmrc`, Dockerfile). `yarn test` uses `node:test` with `--experimental-detect-module`. Tests run locally, not in the image. On Node 24, one test fails (see the `"24"` hour quirk above).
