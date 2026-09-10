# PostAir Weather API – Automated Data Validation & Resilient Testing Suite

![API Tests](https://github.com/xfxradeon/PostAir-Weather-API-Data-Validation/actions/workflows/api-tests.yml/badge.svg)

An automated Postman API testing framework focused on payload contract validation, type safety, field formats, and graceful pipeline execution via the `skipTest` resilience pattern.

---

### Key Highlights

* **Deep Contract Verification:** Enforces payload schema integrity beyond HTTP 200 checks using comprehensive field assertions.
* **Regex Pattern Matching:** Validates alphanumeric primary key conventions (`/^FL-\d+$/`).
* **Strict Enum Auditing:** Restricts dynamic state attributes to explicit business domain sets.
* **ISO 8601 Temporal Checks:** Parses date strings to ensure standard timestamp formats.
* **Resilient `skipTest` Pattern:** Automatically catches missing test records (`404`), logs structured warnings via `console.warn()`, and prevents false-negative pipeline failures.
* **CI/CD Execution:** Continuously runs headlessly via GitHub Actions and Newman with interactive HTML reporting.

---

### Validation Rules Matrix

| Validation Type | Target Field | Assertion Specification |
| :--- | :--- | :--- |
| **Required Keys** | Root payload | `id`, `airline`, `departure`, `arrival`, `status`, `aircraft` |
| **Regex Format** | `flight.id` | `/^FL-\d+$/` (e.g., `FL-1042`) |
| **Enum Membership** | `flight.status` | `["scheduled", "boarding", "departed", "in_air", "landed", "cancelled"]` |
| **ISO 8601 Date** | `flight.departure` | `new Date(val).toString() !== "Invalid Date"` |
| **Pipeline Guard** | 404 status check | `skipTest` conditional routing |

---

### Local Execution

```bash
# 1. Start mock server
node mock-server.js

# 2. Run via Newman
newman run PostAir_Data_Validation.postman_collection.json \
  -e PostAirTesting.postman_environment.json \
  --env-var "baseUrl=localhost:3001"
