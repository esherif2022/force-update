import fetch from "node-fetch";

export type TUpdateCheckResult = {
  isMandatory: boolean;
  isOptional: boolean;
  updateUrl: string | null;
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
 * @param {string} currentVersion - Current version string of the app (e.g., "1.2.0").
 * @returns {Promise<{isMandatory: boolean, isOptional: boolean, updateUrl: string | null}>}
 */
export async function checkForUpdates(
  configUrl: string,
  currentVersion: string
): Promise<TUpdateCheckResult> {
  if (!configUrl || !currentVersion) {
    throw new Error("Both configUrl and currentVersion are required.");
  }

  try {
    // Convert version string to integer
    const currentVersionCode = parseVersion(currentVersion);

    // Fetch the configuration file
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch config from ${configUrl}: ${response.statusText}`
      );
    }
    const config = (await response.json()) as TConfig;

    // Extract values from the config
    const { latest, minimum, url } = config.android || {};

    if (!latest || !minimum || !url) {
      throw new Error(
        "Invalid configuration file. Missing required fields: latest, minimum, url."
      );
    }
    const latestVersionCode = parseVersion(latest);
    const minimumVersionCode = parseVersion(minimum);

    // Determine flags
    const isMandatory = currentVersionCode < minimumVersionCode;
    const isOptional = !isMandatory && currentVersionCode < latestVersionCode;

    return {
      isMandatory,
      isOptional,
      updateUrl: isMandatory || isOptional ? url : null,
    };
  } catch (error) {
    throw error;
  }
}

export default function reactNativeUpdatePlugin() {
  return {
    name: "react-native-update-plugin",
  };
}
