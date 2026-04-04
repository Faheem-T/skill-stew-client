# SkillStew Design System

> This document is the single source of truth for all UI decisions in the SkillStew frontend. Every component built by a human or an AI agent must comply with the rules defined here. If a design decision is not explicitly covered, default to the Design Identity section and ask: does this choice feel precise, warm, and editorial?

---

## 1. Design Identity

SkillStew is a professional platform connecting learners with domain experts through live workshops and structured skill tracks. The UI should feel precise, warm, and editorial — like a well-considered content platform, not a generic SaaS product. It earns trust through clarity and structure, not decorative excess.

The learner-facing side carries the premium visual treatment. The app interior prioritizes function and legibility. The live streaming interface prioritizes real-time clarity.

**The UI is:**

- Structured, precise, editorial, confident, warm

**The UI is NOT:**

- Playful, bubbly, gradient-heavy, enterprise-generic, startup-template

---

## 2. UI Zones

The application is divided into three distinct zones. Each has its own density, typography behavior, and layout rules. Never mix zone rules within the same screen.

### Zone 1 — Marketing

Landing pages, about pages, pricing, and any surface shown before sign-in. This is the first impression. Uses expressive typography, comfortable density, and editorial layout.

### Zone 2 — App Interior

Dashboards, profile pages, skill browsing, booking flows, and all authenticated screens. Clean, functional, and out of the way. Uses compact density and DM Sans exclusively.

### Zone 3 — Live Streaming

The workshop viewer, chat panel, and all real-time session UI. Optimized for sustained focus during a live session. Minimal chrome, no distractions.

---

## 3. Theming

- **Default:** Light mode
- **Opt-in:** Dark mode via user preference
- All color values must use CSS variables — never hardcode hex or hsl values in components
- Dark mode is a complete token swap — no component should need structural changes to support it

---

## 4. Color System

### Roles

Every color token has a defined role. Use tokens by role, not by visual appearance.

| Token                      | Role                                              |
| -------------------------- | ------------------------------------------------- |
| `--background`             | Page background                                   |
| `--foreground`             | Primary text                                      |
| `--card`                   | Card and panel backgrounds                        |
| `--card-foreground`        | Text on cards                                     |
| `--popover`                | Popover and tooltip backgrounds                   |
| `--popover-foreground`     | Text in popovers                                  |
| `--primary`                | Primary actions, brand color                      |
| `--primary-foreground`     | Text on primary backgrounds                       |
| `--secondary`              | Secondary surfaces                                |
| `--secondary-foreground`   | Text on secondary surfaces                        |
| `--muted`                  | Muted backgrounds, skeletons                      |
| `--muted-foreground`       | Captions, placeholders, metadata                  |
| `--accent`                 | Hover states on ghost elements, subtle highlights |
| `--accent-foreground`      | Text on accent backgrounds                        |
| `--border`                 | All borders and dividers                          |
| `--input`                  | Input field backgrounds                           |
| `--ring`                   | Focus ring color                                  |
| `--destructive`            | Errors, destructive actions                       |
| `--destructive-foreground` | Text on destructive backgrounds                   |
| `--success`                | Confirmations, approvals, completions             |
| `--success-foreground`     | Text on success backgrounds                       |
| `--success-muted`          | Subtle success banners and badges                 |
| `--warning`                | Alerts, upcoming deadlines, incomplete states     |
| `--warning-foreground`     | Text on warning backgrounds                       |
| `--warning-muted`          | Subtle warning banners and badges                 |
| `--info`                   | Neutral notices, tips, guidance                   |
| `--info-foreground`        | Text on info backgrounds                          |
| `--info-muted`             | Subtle info banners and badges                    |
| `--live`                   | Live session indicators, real-time status         |
| `--live-foreground`        | Text on live backgrounds                          |
| `--live-muted`             | Subtle live badges and banners                    |

### Light Mode Values

```css
--background: hsl(30, 20%, 97%);
--foreground: hsl(0, 10%, 12%);

--card: hsl(30, 15%, 95%);
--card-foreground: hsl(0, 10%, 12%);

--popover: hsl(30, 20%, 97%);
--popover-foreground: hsl(0, 10%, 12%);

--primary: hsl(0, 28.9855%, 27.0588%);
--primary-foreground: hsl(0, 0%, 100%);

--secondary: hsl(30, 12%, 91%);
--secondary-foreground: hsl(0, 10%, 20%);

--muted: hsl(30, 10%, 92%);
--muted-foreground: hsl(0, 5%, 45%);

--accent: hsl(0, 23%, 79%);
--accent-foreground: hsl(0, 10%, 12%);

--border: hsl(30, 10%, 87%);
--input: hsl(30, 12%, 93%);
--ring: hsl(0, 28.9855%, 27.0588%);

--destructive: hsl(0, 72%, 50%);
--destructive-foreground: hsl(0, 0%, 100%);

--success: hsl(142, 38%, 32%);
--success-foreground: hsl(0, 0%, 100%);
--success-muted: hsl(142, 30%, 92%);

--warning: hsl(35, 75%, 42%);
--warning-foreground: hsl(0, 0%, 100%);
--warning-muted: hsl(35, 70%, 93%);

--info: hsl(210, 45%, 40%);
--info-foreground: hsl(0, 0%, 100%);
--info-muted: hsl(210, 40%, 93%);

--live: hsl(0, 68%, 48%);
--live-foreground: hsl(0, 0%, 100%);
--live-muted: hsl(0, 60%, 93%);
```

### Usage Rules

- Never use `--live` and `--destructive` interchangeably — live is energetic, destructive is an error
- Never use semantic colors for decorative purposes
- Never place `--muted-foreground` text on `--muted` backgrounds without checking contrast
- `--primary` is never used as a large background fill — buttons and small accents only

---

## 5. Typography

### Fonts

| Role      | Font             | Usage                         |
| --------- | ---------------- | ----------------------------- |
| Display   | Playfair Display | Marketing headings only       |
| Body / UI | DM Sans          | All app UI, labels, body text |
| Mono      | JetBrains Mono   | Code, tags, IDs, metadata     |

### Usage Rules

**Playfair Display:**

- Marketing zone H1 and H2 only
- Logo wordmark
- Pull quotes and editorial callouts on marketing pages
- Never below 24px
- Never used inside the App Interior or Live Streaming zones

**DM Sans:**

- Everything else — all app UI, buttons, labels, body text, navigation
- Allowed weights: 400 (body), 500 (medium emphasis), 600 (strong emphasis)
- Weight 700 only for critical numerics and stats
- Never use weight 800 or 900

**JetBrains Mono:**

- Code snippets
- Session IDs, reference numbers
- Technical tags and metadata

### Type Scale

```
12px — captions, fine print, timestamps
13px — secondary labels, metadata, sidebar nav
14px — body text, card content, form labels
16px — primary body text on content pages
18px — lead paragraphs, feature descriptions
24px — H3, section subheadings (DM Sans 600)
32px — H2, section headings (Playfair or DM Sans 600)
48px — H1, page heroes (Playfair 700)
60px — Display, marketing hero only (Playfair 700)
```

### Spacing and Rhythm

```
Body line height:          1.6
UI labels and buttons:     1.2
Headings:                  1.1
Heading letter spacing:    -0.02em
Body letter spacing:       0
Uppercase label tracking:  0.08em
```

### Uppercase Labels

- Allowed only for section metadata, category tags, and status labels
- Maximum 11px when uppercase
- Always pair with `letter-spacing: 0.08em`
- Never use uppercase for body copy or headings

## 5.1 Microcopy

- UI copy should be sparse, direct, and product-facing
- Prefer interfaces that explain themselves through structure, labels, affordances, and state
- Do not write explanatory helper text about the mechanics of the UI itself
- Avoid copy such as:
  - "invalid dates are disabled"
  - "click here to"
  - "the frontend shows"
  - "exact dates appear after save"
- Reserve helper text for domain rules or consequences the interface cannot make obvious on its own
- If a sentence can be removed without losing task comprehension, remove it

---

## 6. Spacing Scale

All spacing in the application must come from this scale. Never use arbitrary values.

```
4px   — 1   (tight inline spacing, icon gaps)
8px   — 2   (compact element spacing)
12px  — 3   (small component padding)
16px  — 4   (standard component padding)
24px  — 6   (comfortable component padding)
32px  — 8   (section spacing, compact)
40px  — 10  (section spacing, standard)
48px  — 12  (section spacing, comfortable)
64px  — 16  (major section gaps, app interior)
80px  — 20  (major section gaps, marketing)
96px  — 24  (large section gaps, marketing)
128px — 32  (hero spacing, marketing only)
```

In Tailwind: use only named spacing utilities (p-1, p-2, p-3... p-32). Never use arbitrary values like `p-[13px]` or `gap-[22px]`.

---

## 7. Border Radius

```
--radius-sm:   4px    — badges, tags, inline chips
--radius-md:   6px    — inputs, dropdowns, small cards, buttons
--radius-lg:   8px    — cards, modals, panels
--radius-xl:   12px   — large feature cards, hero elements
--radius-full: 9999px — avatars, status dots, pill elements only
```

### Rules

- Buttons always use `--radius-md` — never fully rounded
- `--radius-full` is reserved for avatars, status indicator dots, and explicitly pill-shaped elements
- Cards always use `--radius-lg`
- Modals and drawers use `--radius-lg`
- Never mix radius values within the same component

---

## 8. Shadows

Shadows are for floating elements only. Grounded elements (cards, inputs, sections) use borders, not shadows.

```
--shadow-sm:  0px 1px 3px hsl(0, 10%, 0%, 0.08)    — inputs on focus
--shadow-md:  0px 4px 12px hsl(0, 10%, 0%, 0.10)   — dropdowns, popovers
--shadow-lg:  0px 8px 24px hsl(0, 10%, 0%, 0.12)   — modals, drawers
--shadow-xl:  0px 16px 40px hsl(0, 10%, 0%, 0.14)  — command palette, full overlays
```

### Rules

- Cards use `--border` only — no shadow
- Buttons use no shadow — not on default, not on hover
- Badges and tags use no shadow
- Never stack multiple shadows on a single element — choose one level
- Dropdowns and popovers use `--shadow-md`
- Modals use `--shadow-lg`
- Never use `box-shadow` for decorative purposes

---

## 9. Motion and Animation

### Timing Tokens

```
--duration-fast:    100ms  — tooltips, small toggles
--duration-normal:  150ms  — hover states, button transitions
--duration-slow:    250ms  — page elements entering, drawers sliding
--duration-enter:   300ms  — modals and large panels appearing
```

### Easing Tokens

```
--ease-default:  ease-out
--ease-enter:    cubic-bezier(0.16, 1, 0.3, 1)
--ease-exit:     ease-in
```

### Rules

- All hover and focus transitions use `--duration-normal` + `--ease-default`
- Elements entering the screen use `--duration-slow` + `--ease-enter`
- Elements leaving use `--duration-fast` + `--ease-exit`
- Staggered entrance animations: 50ms delay per element, maximum 4 elements — no stagger beyond that
- Never animate layout properties — only `transform` and `opacity`
- No bounce or spring animations on functional UI
- No infinite animations except the live session pulse indicator
- Celebratory animations (booking confirmed, etc.) are the only exception to the no-bounce rule

---

## 10. Layout

### Global

```
Max content width:   1200px
Grid columns:        12
Grid gap:            24px
```

### Zone 1 — Marketing

```
Page padding desktop:   80px horizontal
Page padding mobile:    16px horizontal
Section vertical gap:   96px between major sections
Navigation:             Top navbar only, 56px height
```

### Zone 2 — App Interior

```
Page padding desktop:   40px horizontal
Page padding mobile:    16px horizontal
Top navbar height:      56px (current)
Sidebar width:          240px fixed (planned)
Content max width:      880px for content-heavy pages
Navigation current:     Top navbar only
Navigation planned:     Sidebar replaces top navbar
```

### Zone 3 — Live Streaming

```
Navigation:         Minimal header only — no navbar, no sidebar
Video panel:        Flexible width, takes all space left of chat
Chat panel:         320px fixed, pinned right
Chat input area:    56px fixed height, pinned bottom of chat panel
Max width:          Full viewport — no content width constraint
```

### Layout Transition Rules

- Marketing pages always use top navbar, never sidebar
- When sidebar is introduced in the app interior, it replaces the top navbar entirely on that zone
- Streaming zone never inherits layout from app interior — always full viewport

---

## 11. Density

### Comfortable — Zone 1 (Marketing) and all form layouts

```
Component padding:   24px
Stack gap:           16px between related elements
Section gap:         64px between distinct sections
```

### Compact — Zone 2 (App Interior) and Zone 3 (Streaming)

```
Component padding:   12px–16px
Stack gap:           8px between related elements
Section gap:         32px between distinct sections
```

### Rules

- Never mix density modes within the same UI zone
- Form layouts always use Comfortable density regardless of zone
- Streaming zone uses Compact density

---

## 12. Iconography

```
Library:      Lucide — exclusively, no exceptions
Sizes:        16px (inline, small UI), 20px (standard), 24px (empty states only)
Stroke width: 1.5 — always, never 1 or 2
Color:        currentColor — never hardcoded
```

### Accessibility

- Decorative icons: always `aria-hidden="true"`
- Interactive icons without text labels: always include `aria-label`
- Never use an icon as the only affordance for a critical action without a text label

---

## 13. Interactive States

These rules apply universally to every interactive element in the application.

### Hover

```
Transition:              150ms ease-out on all properties
Background elements:     8% lightness shift toward background
Text elements:           shift from --muted-foreground to --foreground
Bordered elements:       border color shifts to --primary
```

### Focus

```
Style:     2px solid ring using --ring, 2px offset
Never:     Remove focus outline — only restyle it
Never:     Use outline: none without a visible replacement
```

### Disabled

```
Opacity:   40%
Cursor:    not-allowed
States:    No hover or focus effects when disabled
```

### Loading

```
Skeletons:   --muted background with subtle pulse animation
Buttons:     Show spinner, maintain exact original dimensions
Layout:      Never shift layout during a loading state
```

### Error

```
Input border:    shifts to --destructive
Message:         Displayed below the element, never as tooltip
Background:      Never apply red background to inputs — border only
```

---

## 14. Anti-Patterns

These are explicitly forbidden. Agents must not produce these patterns under any circumstances.

### Color

- Never use cool-tinted grays (`hsl(220–260, ...)`) anywhere in the UI
- Never hardcode hex, rgb, or hsl values in components — always use CSS variables
- Never use purple, blue, or blue-to-purple gradients as theme or decorative elements
- Never use `--live` and `--destructive` interchangeably
- Never apply semantic colors for decoration

### Typography

- Never use Inter, Roboto, Arial, or system fonts — DM Sans only for UI
- Never use Playfair Display inside the App Interior or Live Streaming zones
- Never use font-weight 800 or 900
- Never use uppercase text above 11px
- Never center-align body paragraphs

### Spacing and Layout

- Never use arbitrary spacing values (`p-[13px]`, `gap-[22px]`, `mt-[37px]`)
- Never mix density modes within the same UI zone
- Never build the classic AI hero layout: centered headline + subheadline + single CTA on a gradient background

### Components

- Never use fully rounded buttons (`border-radius: 9999px`)
- Never apply box-shadow to cards, buttons, badges, or tags
- Never stack multiple shadows on a single element
- Never apply `backdrop-filter: blur()` as decoration — modals and overlays only
- Never show error messages as tooltips — always below the element
- Never apply a red background to error inputs — border color change only
- Never shift layout during a loading state
- Never use emoji in UI elements unless explicitly specified in the feature

### Motion

- Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- Never use bounce or spring animations on functional UI elements
- Never use infinite animations except the live session pulse indicator
- Never stagger more than 4 elements in an entrance animation sequence
- Never use `transition: all` — always specify the exact property

### Icons

- Never mix icon libraries — Lucide only
- Never hardcode icon color — always use `currentColor`
- Never use stroke-width other than 1.5
- Never use a 24px icon in dense UI — 16px or 20px only

---

## 15. Agent Instructions

If you are an AI agent generating UI for this application, read this section first.

1. Read this entire document before writing any code
2. Every component you produce must comply with all rules defined here
3. When a decision is not explicitly covered, refer to the Design Identity in Section 1
4. Never import fonts, icon libraries, or color values not specified in this document
5. Never use arbitrary Tailwind values — only named utilities from the spacing scale
6. Always use CSS variables for color — never raw values
7. When in doubt between two approaches, choose the one that is more restrained
8. The goal is UI that feels like it was designed by one person with a clear point of view — not assembled from defaults
