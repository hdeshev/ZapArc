## Context
Injecting tip requests into common social media platforms.

## Decisions
- **Platform Selectors**: Maintain a registry of specific selectors for Facebook, Twitter, and Reddit.
- **Heuristics**: Fallback to detecting `textarea` and `contenteditable` elements with specific size and placeholder indicators (e.g., "post", "comment").
- **Automatic Appending**: Insert tip strings at the end of detected input areas.
