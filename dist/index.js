'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fetch = require('node-fetch');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Converts a version string (e.g., "1.2.0") to an integer (e.g., 120).
 * @param {string} version - The version string to convert.
 * @returns {number} - The integer version code.
 * @throws {Error} - If the input is not a valid version string.
 */
function parseVersion(version) {
    if (typeof version !== "string") {
        throw new Error("Version must be a string.");
    }
    const versionParts = version.split(".");
    if (!versionParts.every((part) => /^\d+$/.test(part))) {
        throw new Error('Invalid version format. Expected "x.y.z" with numeric parts.');
    }
    return parseInt(versionParts.join(""), 10);
}
/**
 * Utility function to check update requirements.
 * @param {string} configUrl - URL to the configuration file (force_update_config_file.json).
 * @param {string} currentVersion - Current version string of the app (e.g., "1.2.0").
 * @returns {Promise<{isMandatory: boolean, isOptional: boolean, updateUrl: string | null}>}
 */
function checkForUpdates(configUrl, currentVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!configUrl || !currentVersion) {
            throw new Error("Both configUrl and currentVersion are required.");
        }
        try {
            // Convert version string to integer
            const currentVersionCode = parseVersion(currentVersion);
            // Fetch the configuration file
            const response = yield fetch(configUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch config from ${configUrl}: ${response.statusText}`);
            }
            const config = (yield response.json());
            // Extract values from the config
            const { latest, minimum, url } = config.android || {};
            if (!latest || !minimum || !url) {
                throw new Error("Invalid configuration file. Missing required fields: latest, minimum, url.");
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
        }
        catch (error) {
            throw error;
        }
    });
}
function reactNativeUpdatePlugin() {
    return {
        name: "react-native-update-plugin",
    };
}

exports.checkForUpdates = checkForUpdates;
exports.default = reactNativeUpdatePlugin;
//# sourceMappingURL=index.js.map
