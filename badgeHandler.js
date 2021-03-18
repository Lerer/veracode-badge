'use strict';

const { makeBadge, ValidationError } = require('badge-maker');

const appHandler = require('./util/apis/veracode/applications');

const POLICY_COMPLIANCE_STATUSES = [
    {value:  'DETERMINING',label:'DETERMINING',color:'#d3d3d3'},
    {value: 'NOT_ASSESSED',label:'NOT ASSESSED',color:'#d3d3d3'},
    {value: 'DID_NOT_PASS',label:'DID NOT PASS',color:'#e51e3e'},
    {value: 'CONDITIONAL_PASS',label:'CONDITIONAL PASS',color:'#f19325'}, 
    {value: 'PASSED',label:'PASSED',color: '#8cbe3f'}
];

const BADGE_STYLE = 'flat';

exports.handle = async (event,context) => {
    console.log(event.queryStringParameters ? JSON.stringify(event.queryStringParameters) : 'no query params');
    let badgeSVG;
    const appName = event.queryStringParameters.appname;
    if (!appName) {
        badgeSVG = generateErrorBadge('unknown profile');
    } else {
        const application = await appHandler.getApplicationByName(appName);
        // TODO - Sandbox update
        console.log(application);
        if (!application.id){
            badgeSVG = generateErrorBadge('unknown profile');
        } else {
            console.log(application.profile.policies[0].policy_compliance_status);

            const compliance = POLICY_COMPLIANCE_STATUSES.filter((statusObj) => statusObj.value === application.profile.policies[0].policy_compliance_status);

            badgeSVG = generateBadge(appName,undefined,compliance[0]);
        }
    }
    
    return {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "no-cache"
        },
        statusCode: 200,
        body: badgeSVG
    };
}

const generateErrorBadge = (message) => {
    const format = {
        label: `VERACODE`,
        message: `${message}`,
        style: BADGE_STYLE,
        labelColor: '#00b2e5',
        color:'grey'
    }
    try {
        return makeBadge(format);
    }  catch (e) {
        console.log(e) // ValidationError: Field `message` is required
    }
}

const generateBadge = (appName,sandboxName,complianceStatusObj) => {
    let labelPostfix;
    let message;
    if (sandboxName) {
        labelPostfix = ' - SANDBOX';
        message = `${complianceStatusObj.label}`;
    } else {
        labelPostfix = ' - POLICY'
        message = `${complianceStatusObj.label}`;
    }
    const format = {
        label: `VERACODE${labelPostfix}`,
        message,
        color: complianceStatusObj.color,
        style: BADGE_STYLE,
        labelColor: '#00b2e5'
    }
    try {
        return makeBadge(format);
    }  catch (e) {
        console.log(e) // ValidationError: Field `message` is required
    }
}

