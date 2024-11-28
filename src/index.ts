import fetch from "node-fetch";

export type TUpdateCheckResult = {
  result: string | null;
};

export type TConfig = {
  android: {
    latest: string;
    minimum: string;
    url: string;
  };
};

/**
 * Converts a version string (e.g., "1.2.0") to an integer (e.g., 120).
 * @param {string} version - The version string to convert.
 * @returns {number} - The integer version code.
 * @throws {Error} - If the input is not a valid version string.
 */
function parseVersion(version: string): number {
  if (typeof version !== "string") {
    throw new Error("Version must be a string.");
  }

  const versionParts = version.split(".");
  if (!versionParts.every((part) => /^\d+$/.test(part))) {
    throw new Error(
      'Invalid version format. Expected "x.y.z" with numeric parts.'
    );
  }

  return parseInt(versionParts.join(""), 10);
}

/**
 * Utility function to check update requirements.
 * @param {string} configUrl - URL to the configuration file (force_update_config_file.json).
 * @param {TConfig} configObject - Configuration object with latest, minimum, and url fields.
 * @param {string | number} currentVersion - Current version string of the app (e.g., "1.2.0").
 * @returns {Promise<{result: string | null}>}
 */
export async function checkForUpdates(
  currentVersion: string | number,
  configUrl?: string,
  configObject?: TConfig
): Promise<TUpdateCheckResult> {
  // Validate required parameters
  if (!currentVersion) {
    throw new Error("The 'currentVersion' parameter is required.");
  }
  if (!configUrl && !configObject) {
    throw new Error("Either 'configUrl' or 'configObject' must be provided.");
  }

  try {
    // Convert currentVersion to a numeric code
    const currentVersionCode =
      typeof currentVersion === "number"
        ? currentVersion
        : parseVersion(currentVersion);

    // Fetch the configuration if configObject is not provided
    const config: TConfig = configObject || (await fetchConfig(configUrl!));

    // Validate configuration file contents
    const { latest, minimum, url } = config.android || {};
    if (!latest || !minimum || !url) {
      throw new Error(
        "Invalid configuration file. Missing required fields: 'latest', 'minimum', or 'url'."
      );
    }

    // Convert versions to numeric codes
    const latestVersionCode = parseVersion(latest);
    const minimumVersionCode = parseVersion(minimum);

    // Determine update requirement
    if (currentVersionCode < minimumVersionCode) {
      return { result: "mandatory" };
    } else if (currentVersionCode < latestVersionCode) {
      return { result: "optional" };
    }

    return { result: null }; // App is up-to-date
  } catch (error) {
    throw error;
  }
}

// Helper function to fetch configuration file
async function fetchConfig(url: string): Promise<TConfig> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch config from ${url}: ${response.statusText}`
    );
  }
  return (await response.json()) as TConfig;
}

export default function reactNativeUpdatePlugin() {
  return {
    name: "react-native-update-plugin",
  };
}
