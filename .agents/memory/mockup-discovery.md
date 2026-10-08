---
name: Mockup preview discovery
description: Security constraint for the mockup component discovery dependency.
---

The mockup preview plugin uses Node filesystem traversal instead of `fast-glob`. The current `braces` v3 release has a known stack-exhaustion advisory with no patched v3 release.

**Why:** Replacing only the scanner dependency path cleared the vulnerability without removing mockup preview functionality.

**How to apply:** Before reintroducing a globbing package for mockup discovery, verify that its dependency tree no longer includes vulnerable `braces` v3. Preserve the underscore-prefixed path exclusions and deterministic ordering.
