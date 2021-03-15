'use strict';

exports.getApiKey = () => {
    return process.env.VERACODE_API_KEY;
}

exports.getApiSecret = () => {
    return process.env.VERACODE_API_SECRET;
}
