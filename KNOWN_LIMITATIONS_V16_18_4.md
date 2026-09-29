# Known Limitations — V16.18.4

1. Real-device Production Pilot testing is still required; static/controller tests do not prove Android/iPad lifecycle behavior.
2. Hospital Drug Library, Case Drug Plan configuration, protocol governance, and medication workspace now cross an injected controller boundary; future changes must keep those interfaces synchronized.
3. Medication reconciliation remains a separate post-load module and is intentionally not merged into the active medication workspace controller.
4. ANESVET is not a continuous physiologic monitor and still relies on manually documented medication administration unless external integrations are added later.
5. Local archive verification does not substitute for an external backup.
