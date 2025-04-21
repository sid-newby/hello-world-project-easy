# Legacy UI Snapshot for PitchCraft

## Purpose

This directory contains a complete, isolated snapshot of the PitchCraft application's user interface as of the latest version. It is intended as a reference baseline for rebuilding the UI with improved design, maintainability, and compatibility. Use this as a source of truth for structure, features, and component behavior during the UI overhaul.

---

## Directory Structure

```
legacy-ui/
├── App.tsx
├── App.css
├── index.css
├── main.tsx
├── assets/
│   └── [SVG icons, images]
├── components/
│   └── [All UI React components]
├── styles/
│   └── [Global and token CSS]
├── pages/
│   └── [Page-level React components]
├── context/
│   └── [UI context providers]
├── hooks/
│   └── [UI state management hooks]
├── data/
│   └── [UI-related static data]
├── types/
│   └── [TypeScript types for UI]
├── utils/
│   └── [UI utility functions]
└── README.md
```

---

## Requirements & Notes

- **Frameworks & Tooling:**  
  - React (functional components, TypeScript)
  - Vite (build tool)
  - UnoCSS/Tailwind CSS (for styling, see original uno.config.ts or tailwind.config.js)
  - All dependencies as defined in the main app's `package.json`
- **Design:**  
  - Mobile-first, responsive layouts
  - Accessibility best practices (semantic HTML, ARIA, keyboard navigation, color contrast)
  - Consistent use of design tokens and utility classes
- **State Management:**  
  - Local state via React hooks
  - Global state and data fetching via custom hooks (see hooks/)
- **Assets:**  
  - All icons and images are included in `assets/`
- **Types:**  
  - All UI-related types are included in `types/`
- **Caveats:**  
  - Some relative imports may be broken in this isolated snapshot; adjust as needed for reference.
  - Business logic and backend integration are not included unless directly tied to UI rendering.
  - This snapshot is not intended to be run standalone, but as a static reference for rebuilding.

---

## Rebuild Checklist

- [ ] Review all components and pages for required features and props
- [ ] Ensure all UI elements are present and match the legacy structure
- [ ] Re-implement styling using the new design system (if applicable)
- [ ] Maintain or improve accessibility and responsiveness
- [ ] Decouple business logic from UI where possible
- [ ] Validate that all assets and icons are available and optimized
- [ ] Update or refactor context/providers and hooks for new architecture
- [ ] Test new UI for compatibility with existing app logic and data flows

---

## How to Use This Reference

1. Use this directory as a static reference for the legacy UI.
2. When rebuilding, refer to the structure, component APIs, and styling patterns.
3. Document any deviations or improvements in the new implementation.
4. Use the checklist above to ensure feature parity and compatibility.

---

## Additional Notes

- If you encounter missing dependencies or unclear component relationships, refer to the main app's `package.json` and `tsconfig.json`.
- For questions about design intent or business logic, consult the main repository documentation or contact the original developers.
- This snapshot is intended to save time and reduce errors during the UI rebuild by providing a complete, isolated reference.
