---
name: front-mui-a11y
description: Audit and fix Material UI components for accessible labels, keyboard support, and clear component boundaries in the Finance Dashboard.
---

# front-mui-a11y

Use this skill when working on frontend components in this repo and you need to make Material UI interactions accessible without changing the intended UI.

## When to use

- Icon-only controls such as `IconButton`, `Checkbox`, and `Pagination` controls.
- Form controls such as `TextField`, `Select`, `NativeSelect`, `Checkbox`, `Radio`, `Switch`, and `Autocomplete`.
- Menus, dialogs, tooltips, table actions, and other interactive dashboard elements.
- Refactors that split a large component into smaller pieces while keeping state in the parent.

## Workflow

1. Identify every interactive control in the target UI and classify whether it already has visible text, a label, or an accessible name.
2. Add the right MUI accessibility hook for the component:
   - `slotProps` for input-level accessibility attributes on modern MUI components.
   - `aria-label` for icon-only buttons and standalone controls.
   - `label`, `InputLabel`, `labelId`, and `id` for selects and other labeled form fields.
   - `aria-describedby` for helper text, errors, or secondary instructions.
   - `aria-labelledby` when a visible element should name the control.
3. Check table and menu actions for row-specific behavior so labels stay unique and meaningful.
4. If a component is too large, extract toolbar/table/modal sections into typed child components and keep the state and business logic in the parent.
5. Pass state and callbacks through explicit TypeScript props instead of relying on hidden module state.
6. Validate the result with the repo lint/build commands and confirm the UI still behaves the same.

## Quality checks

- Every icon-only `IconButton` has a meaningful `aria-label`.
- Every input or select has a programmatic label that matches its visible purpose.
- Prefer `slotProps` over deprecated `inputProps` when the component supports it.
- Table selection, pagination, and menu actions remain keyboard accessible.
- No raw `<a>` tags are introduced for internal navigation.
- Component extraction preserves behavior, types, and the current MUI visual style.

## Reference files

- [AGENTS.md](../../../AGENTS.md)
- [README.md](../../../README.md)
- [.github/copilot-instructions.md](../../../.github/copilot-instructions.md)
