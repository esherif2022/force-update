export type TUpdateCheckResult = {
    result: 'mandatory' | 'optional' | null;
    url?: string;
};

export type TConfig = {
    versionCode: number | string;
    minimumVersionCode: number | string;
    url?: string;
};

/**
 * Converts a version string (e.g., "1.2.0") to an integer (e.g., 120).
 * @param {string} version - The version string to convert.
 * @returns {number} - The integer version code.
 * @throws {Error} - If the input is not a valid version string.
 */
function parseVersion(version: string): number {
    if (typeof version !== 'string') {
        throw new Error('Version must be a string.');
    }

    const versionParts = version.split('.');
    if (!versionParts.every((part) => /^\d+$/.test(part))) {
        throw new Error(
            'Invalid version format. Expected "x.y.z" with numeric parts.'
        );
    }

    return parseInt(versionParts.join(''), 10);
}

/**
 * Helper function to determine update requirements.
 * @param {number} currentVersionCode - Numeric version code of the app.
 * @param {TConfig} config - Configuration object.
 * @returns {TUpdateCheckResult}
 */
function determineUpdateRequirement(
    currentVersionCode: number,
    config: TConfig
): TUpdateCheckResult {
    const url = config.url;
    const configVersionCode =
        typeof config.versionCode === 'number'
            ? config.versionCode
            : parseVersion(config.versionCode);
    const configMinimumVersionCode =
        typeof config.minimumVersionCode === 'number'
            ? config.minimumVersionCode
            : parseVersion(config.minimumVersionCode);

    if (currentVersionCode < configMinimumVersionCode) {
        return {
            result: 'mandatory',
            url,
        };
    } else if (currentVersionCode < configVersionCode) {
        return {
            result: 'optional',
            url,
        };
    }
    return {
        result: null,
        url,
    };
}

// Helper function to fetch configuration file
async function fetchConfig(url: string): Promise<TConfig> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch config from ${url}: ${response.statusText}`
        );
    }
    const result = (await response.json()) as TConfig;
    if (!result.versionCode || !result.minimumVersionCode) {
        throw new Error(
            'Invalid configuration file. Missing required fields: versionCode, minimumVersionCode'
        );
    }
    return result;
}

/**
 * Checks for updates using a configuration URL.
 * @param {string} configUrl - URL to the configuration file.
 * @param {string | number} currentVersion - Current version of the app.
 * @returns {Promise<TUpdateCheckResult>}
 */
export async function checkForUpdatesFromUrl({
    currentVersion,
    configUrl,
}: {
    currentVersion: string | number;
    configUrl: string;
}): Promise<TUpdateCheckResult> {
    if (!configUrl) {
        throw new Error("The 'configUrl' parameter is required.");
    }
    const config = await fetchConfig(configUrl);
    const currentVersionCode =
        typeof currentVersion === 'number'
            ? currentVersion
            : parseVersion(currentVersion);

    return determineUpdateRequirement(currentVersionCode, config);
}

/**
 * Checks for updates using a configuration object.
 * @param {TConfig} config - Configuration object.
 * @param {string | number} currentVersion - Current version of the app.
 * @returns {TUpdateCheckResult}
 */
export function checkForUpdatesFromFile({
    currentVersion,
    config,
}: {
    currentVersion: string | number;
    config: TConfig;
}): TUpdateCheckResult {
    if (!config) {
        throw new Error("The 'config' parameter is required.");
    }
    const currentVersionCode =
        typeof currentVersion === 'number'
            ? currentVersion
            : parseVersion(currentVersion);

    return determineUpdateRequirement(currentVersionCode, config);
}

export default function forceUpdate() {
    return {
        name: 'force-update',
    };
}
