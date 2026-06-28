# Accessibility Commitment

## 1. Our commitment

Accessibility is a quality concern, not an afterthought. This project targets **WCAG 2.2 Level AA** for all user-facing pages and interactive components.

Supported environments:

| Environment | Coverage |
| :--- | :--- |
| **Browsers** | Last 2 major versions of Chrome, Firefox, and Safari |
| **Screen readers** | No screen reader testing was carried out during this tech test. Semantic HTML, ARIA attributes, and live regions are in place; formal testing with VoiceOver and NVDA would be a next step in a production project. |
| **Input methods** | Pointer (mouse/touch) and keyboard |

---

## 2. What is implemented

### 2.1 Page structure

- Every page has exactly **one `<h1>`** rendered via the `PageHeader` component.
- Heading hierarchy (`h1` → `h2`) is enforced through the polymorphic `Heading` atom.
- Each page is wrapped in a `<main id="main-content">` landmark via `PageContainer`.
- A **skip navigation link** (`Skip to main content`) is the first focusable element on every page, visible on focus.
- `<html lang="en">` is set in the root layout.
- Per-page `<title>` values are set via Next.js `metadata` / `generateMetadata` exports on every route.
- A custom `not-found.tsx` provides a branded, navigable 404 experience with a proper `<h1>`.

### 2.2 Keyboard navigation

- All interactive elements (links, buttons, form fields) are reachable and operable by keyboard alone.
- Focus order follows the logical reading order of the page.
- The `Button` component (`components/atoms/Button.tsx`) renders either a semantic `<button>` or a `<Link>` depending on whether an `href` is supplied — never a `<div>` or `<span>`.
- `CakeCard` exposes the whole card as a single focusable `<Link>` rather than nesting multiple interactive elements.

### 2.3 Focus indicators

- **Global fallback**: `globals.css` applies a `2px solid #4f46e5` outline with `2px offset` on `:focus-visible` for any element not handled explicitly.
- **Buttons**: `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` via `baseStyles` in `Button.tsx`.
- **Card links**: same `focus-visible:ring-*` classes applied directly.
- `focus:outline-none` is used together with a `focus-visible` alternative — never alone — so keyboard users always see a clear indicator.

### 2.4 Colour contrast

All foreground/background pairings meet the WCAG 2.2 AA 4.5:1 ratio for normal text:

| Token | Hex | Approximate ratio on white | Usage |
| :--- | :--- | :--- | :--- |
| `text-slate-900` | `#0f172a` | 19:1 | Headings |
| `text-slate-600` | `#475569` | 5.9:1 | Body / muted text |
| `text-red-700` | `#b91c1c` | 5.9:1 | Error messages |
| `text-amber-700` | `#b45309` | 4.9:1 | Warning (char counter) |
| `text-indigo-600` | `#4f46e5` | 4.6:1 | Accent / yum factor |

Colour is **never the sole means** of conveying state: error fields also use `border-red-500`, `aria-invalid`, and visible `FieldError` text.

### 2.5 Forms

- Every input has a visible `<Label>` element associated via `htmlFor` / `id`.
- `aria-required="true"` is set on all required fields.
- `aria-invalid` is set to `true` when a field has a validation error.
- `aria-describedby` links each field to its `FieldError` element when an error is present.
- `FieldError` elements are always present in the DOM (rendered empty when no error) so `aria-live="polite"` can announce injected error text without race conditions.
- On form submission with validation errors, focus is programmatically moved to the first invalid field.
- The comment `<textarea>` has `maxLength={200}` matching server-side validation, preventing silent data truncation.
- A character counter (`{n} of 200 characters remaining`) is linked to the textarea via `aria-describedby` and announced by `aria-live="polite"`. It is labelled `aria-label="Characters remaining"` for screen reader context.
- The Yum Factor `<select>` lives inside a `<fieldset>` with a `<legend>` — the legend names the group so no redundant `aria-label` is needed on the `<select>` itself.
- Yum Factor options include descriptive labels (`1 – Not great` through `5 – Outstanding`) so the value is meaningful when the list is open.
- `noValidate` is set on the form to disable native browser validation bubbles, relying on the custom accessible error handling above.
- `aria-busy="true"` is set on the form during submission to signal processing state.

### 2.6 Images

- Decorative card images use `alt=""` because the adjacent visible heading (`<h2>`) already conveys the content.
- The cake detail page uses `alt="Photo of {cake.name}"` to describe the subject meaningfully.

### 2.7 Motion

- The card hover scale animation (`group-hover:scale-105`) is suppressed via `motion-reduce:transform-none` for users who have set "Reduce Motion" in their OS.

### 2.8 Progressive Web App

- The PWA manifest, icons, and service worker are purely additive and do not change the page's interactive structure.

---

## 3. Known limitations and future work

| Area | Description | Priority |
| :--- | :--- | :--- |
| **No auth / user sessions** | No login UI means no session timeout notices or protected route redirects to audit | N/A for this scope |
| **No dark mode** | The app uses a fixed light palette; a `prefers-color-scheme: dark` theme would need a full contrast re-check | Medium |
| **No automated a11y tests in CI** | `axe-core` or `pa11y` could be integrated into the Lighthouse CI workflow to catch regressions automatically | Medium |
| **No skip link for footer** | The current layout has no footer; if one is added it should include a skip link where appropriate | Low |
| **Screen reader testing** | No screen reader testing was carried out. Semantic HTML and ARIA are in place but should be verified with VoiceOver and NVDA before production release. | High |

---

## 4. Development guidelines

When adding or modifying UI in this project, follow these rules:

### Headings
- Use the `Heading` atom (`components/atoms/Heading.tsx`) — never raw `<h1>`–`<h6>` tags.
- Every page must have exactly one `<h1>` via `PageHeader`.
- Do not skip heading levels (e.g. do not jump from `h1` to `h3`).

### Interactive elements
- Use `Button` for actions; use `<Link>` (via `Button href` prop) for navigation.
- Never make a non-interactive element focusable with `tabIndex={0}` unless it has a keyboard handler.
- Ensure every interactive element has a visible focus indicator; do not use `focus:outline-none` without a `focus-visible` alternative.

### Forms
- Add `aria-required="true"` to every required field.
- Add `aria-describedby` pointing to the `FieldError` id when an error is present.
- Use `hasError` prop on form atom components — this sets `aria-invalid` automatically.
- Move focus to the first invalid field after a failed submission.

### Images
- Decorative images: `alt=""`.
- Informative images: concise, meaningful alt text (not the filename or "image of an image").

### Colour
- Do not introduce `text-slate-400`, `text-slate-500`, `text-gray-400`, `text-amber-500`, or `text-red-500` for body or error text — these fail 4.5:1 contrast on white.
- Use `text-slate-600` or darker for muted body copy.
- Never convey state through colour alone.

### Motion
- Add `motion-reduce:transform-none` (or equivalent) to any CSS transition or animation.

