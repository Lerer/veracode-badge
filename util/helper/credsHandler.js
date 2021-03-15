'use strict';

export function getApiKey() {
    return process.env.VERACODE_API_KEY;
}

export function getApiSecret() {
    return process.env.VERACODE_API_SECRET;
}
