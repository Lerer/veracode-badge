'use strict';

const { makeBadge, ValidationError } = require('badge-maker');

exports.handle = (event,context,callback) => {
    console.log(event);
    const body = JSON.parse(event.body); 
	console.log(`BODY:\n${body}`);
    
    const responseBody = {
		baseMessage: "Process request for Veracode badge request",
		message: "Easy deploy"
    };
    let responseCode = 200;

    const svg = generateBadge('Test App Name',undefined,'Pass');
    responseBody.svg = svg;
    
    const response = {
        headers: {
            "Content-Type": "application/json",
        },
        statusCode: responseCode,
        body: JSON.stringify(
            responseBody
        )
    };
    callback(null,response);
}

const generateBadge = (appName,sandboxName,policyCompliance) => {
    const format = {
        label: `Veracode - ${appName}`,
        message: `${sandboxName ? sandboxName : 'Policy'} - ${policyCompliance}`,
        color: 'green',
    }
    try {
        const svg = makeBadge(format)
        console.log(svg) // <svg...
        return svg;
    }  catch (e) {
        console.log(e) // ValidationError: Field `message` is required
    }
}
