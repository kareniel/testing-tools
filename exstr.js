/*
    list all hardcoded strings in a javascript file
*/

var fs = require('fs')
var path = require('path')
var esprima = require('esprima')
var estraverse = require('estraverse')
var args = process.argv.slice(2)
var filepath = args[0]

var file = fs.readFileSync(filepath).toString()
var ast = esprima.parse(file)
var filtered = require('./exstr-exceptions')

estraverse.traverse(ast, {
  enter: function (node, parent) {
    if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
      return estraverse.VisitorOption.skip
    }
  },
  leave: function (node, parent) {
    // console.log(node.type)
    if (node.type == 'Literal' && typeof node.value === 'string') {
      if (!filtered.includes(node.value)) {
        process.stdout.write(node.value + '\n')
      }
    }
  }
})
