/**
 *
 * Takes <input> and filters it for <XXpx> screen breakpoint, clearing file from media queries into <output>
 *
 * CLI arguments: input breakpointWidth output
 */
var fs = require('fs')
var css = require('css')
var mediaQuery = require('css-mediaquery')


var arguments = process.argv.slice(2)

var input = arguments[0]
var breakpointWidth = arguments[1]
var output = arguments[2]

var breakpoint = {
	type: 'screen',
	width: breakpointWidth
}

var file = fs.readFileSync(input).toString()
var ast = css.parse(file, { source: input })

ast.stylesheet.rules = ast.stylesheet.rules.reduce(function(rules, rule){

	if (!rule.type || rule.type !== 'media') {
		rules.push(rule)
		return rules
	}

	if (mediaQuery.match(rule.media, breakpoint)) {
		if (rule.media === 'print') {
			rules.push(rule)
			return rules
		}
		return rules.concat(rule.rules)
	}

	return rules
}, [])

var result = css.stringify(ast)

fs.writeFileSync(output, result)