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
 * Utility function to check update requirements.
 * @param {string} configUrl - URL to the configuration file (force_update_config_file.json).
 * @param {string} currentVersion - Current version string of the app (e.g., "1.2.0").
 * @returns {Promise<{isMandatory: boolean, isOptional: boolean, updateUrl: string | null}>}
 */
export declare function checkForUpdates(configUrl: string, currentVersion: string): Promise<TUpdateCheckResult>;
export default function reactNativeUpdatePlugin(): {
    name: string;
};
//# sourceMappingURL=index.d.ts.map