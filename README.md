### Force Update Plugin

A utility to check for app updates in React Native based on a configuration file or object.

---

### Features

- Supports **remote config file** or **local config object**.
- Handles app versions as **strings** (e.g., `"1.2.0"`) or **integers** (e.g., `10203`).
- Returns **mandatory**, **optional**, or **none** to indicate update status.

---

### Installation

```bash
npm install force-update
```

---

### Usage

#### 1. Using a Remote Config File

```typescript
import { checkForUpdates } from "force-update";

const currentVersion = "1.0.0"; // Current app version
const configUrl = "https://example.com/force_update_config.json"; // Remote config URL

const result = await checkForUpdates(currentVersion, configUrl);
console.log(result); // { result: "mandatory" | "optional" | "none" }
```

#### 2. Using a Local Config Object

```typescript
import { checkForUpdates } from "force-update";

const currentVersion = 100; // Current app version as integer
const configObject = {
  android: {
    latest: "1.2.0",
    minimum: "1.1.0",
    url: "https://example.com/update",
  },
};

const result = await checkForUpdates(currentVersion, undefined, configObject);
console.log(result); // { result: "mandatory" | "optional" | "none" }
```

---

### Config Format

```json
{
  "android": {
    "latest": "1.2.0",
    "minimum": "1.1.0",
    "url": "https://example.com/update"
  }
}
```

---

### Return Values

- **`mandatory`**: Update required (current version < `minimum`).
- **`optional`**: Update available (current version < `latest`).
- **`none`**: App is up-to-date.

---
