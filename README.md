# Force Update Plugin

This plugin provides functionality to check if an app update is mandatory or optional.

## Installation

```bash
npm install force-update
```

## Usage

```bash
import { checkForUpdates } from "force-update";

const configUrl = "https://example.com/force_update_config.json";
const currentVersion = "1.0.0";

checkForUpdates(configUrl, currentVersion)
  .then((result) => {
    if (result.isMandatory) {
      console.log("Mandatory update required:", result.updateUrl);
    } else if (result.isOptional) {
      console.log("Optional update available:", result.updateUrl);
    } else {
      console.log("App is up to date.");
    }
  })
  .catch((error) => {
    console.error("Error checking for updates:", error);
  });

```
