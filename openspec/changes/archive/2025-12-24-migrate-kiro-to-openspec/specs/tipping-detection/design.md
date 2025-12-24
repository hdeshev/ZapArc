## Context
Patterns for identifying tipping requests in web content.

## Decisions
- **Standardized Format**: Regex pattern `\[lntip:lnurl:([a-zA-Z0-9]+):(\d+):(\d+):(\d+)\]`.
- **Metadata Detection**: Scan for `<meta name="lntip" content="...">`.
- **Performance**: Use `MutationObserver` with a 1-second throttle for DOM scanning.
