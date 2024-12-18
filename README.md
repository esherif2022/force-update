### Force Update Plugin

A utility to check for app updates in React Native based on a configuration file or object.

---

### Features

-   Supports **remote config file** or **local config object**.
-   Handles app versions as **strings** (e.g., `"1.2.0"`) or **integers** (e.g., `10203`).
-   Returns **mandatory**, **optional**, or **null** to indicate update status.
-   Provides a URL for latest version when applicable in the config file.

---

### Installation

```bash
npm install force-update
```

---

### Usage

#### 1. Using a Remote Config File

```typescript
import { checkForUpdatesFromUrl } from 'force-update';

const currentVersion = '1.0.0'; // Current app version
const configUrl = 'https://example.com/force_update_config.json'; // Remote config URL

const result = await checkForUpdatesFromUrl({ currentVersion, configUrl });
console.log(result);
// { result: "mandatory" | "optional" | null, url?: "https://example.com/update" }
```

#### 2. Using a Local Config Object

##### a. Using strings for version codes

```typescript
import { checkForUpdatesFromFile } from 'force-update';

const currentVersion = '1.0.0'; // Current app version
const configObject = {
    versionCode: '1.2.0', // Latest app version
    minimumVersionCode: '1.1.0', // Minimum required app version
    url: 'https://example.com/update', // Latest version URL (optional)
};

const result = checkForUpdatesFromFile({
    currentVersion,
    config: configObject,
});
console.log(result);
// { result: "mandatory" | "optional" | null, url: "https://example.com/update" }
```

##### b. Using integers for version codes

```typescript
import { checkForUpdatesFromFile } from 'force-update';

const currentVersion = 100; // Current app version
const configObject = {
    versionCode: 101, // Latest app version
    minimumVersionCode: 102, // Minimum required app version
    url: 'https://example.com/update', // Latest version URL (optional)
};

const result = checkForUpdatesFromFile({
    currentVersion,
    config: configObject,
});
console.log(result);
// { result: "mandatory" | "optional" | null, url: "https://example.com/update" }
```

---

### Config Format

For remote or local configuration, the format should be as follows:

```json
{
    "versionCode": "1.2.0",
    "minimumVersionCode": "1.1.0",
    "url": "https://example.com/update"
}
```

or

```json
{
    "versionCode": 10203,
    "minimumVersionCode": 10102
}
```

---

### Return Values (result)

-   **`mandatory`**: Update required (current version < `minimumVersionCode`).
-   **`optional`**: Update available (current version < `versionCode`).
-   **`null`**: App is up-to-date.

---
