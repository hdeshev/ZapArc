## Context
Visual components and user interaction patterns.

## Decisions
- **Central Coordinator**: The Background Service Worker (Manifest V3) coordinates state and Breez SDK instances.
- **Cross-Component Communication**: Use `chrome.runtime.sendMessage` and `chrome.tabs.sendMessage`.
- **Floating Menu**: Injected via content script, provides quick access to domain management and wallet actions.
