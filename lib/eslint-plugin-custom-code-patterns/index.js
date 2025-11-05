/**
 * Custom ESLint plugin for code patterns and Tailwind class ordering
 * Last modified: 2025-01-05
 */

const classnameOrder = require('./classname-order')
const noHandlePrefix = require('./no-handle-prefix')
const noItemTerminology = require('./no-item-terminology')
const noOnPrefix = require('./no-on-prefix')

module.exports = {
  rules: {
    'no-handle-prefix': noHandlePrefix,
    'no-on-prefix': noOnPrefix,
    'no-item-terminology': noItemTerminology,
    'classname-order': classnameOrder,
  },
}
