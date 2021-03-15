const { makeBadge, ValidationError } = require('badge-maker');

const format = {
    label: 'build time and aplication name',
    message: 'passed fdsfds fdsfdsfds fdsfdsfds fdsfdsf fdfs',
    color: 'green',
}

const svg = makeBadge(format)
console.log(svg) // <svg...

try {
    makeBadge({})
} catch (e) {
    console.log(e) // ValidationError: Field `message` is required
}