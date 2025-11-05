/**
 * ESLint rule: no-handle-prefix
 * Enforces that function names should not start with 'handle'
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow function names starting with "handle"',
      category: 'Best Practices',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noHandlePrefix: 'Function name "{{name}}" should not start with "handle". Use a more descriptive name.',
    },
  },
  create(context) {
    // Map of common handle patterns to better names
    const suggestionMap = {
      handleSubmit: 'submitForm',
      handleClick: 'executeAction',
      handleChange: 'updateValue',
      handleDelete: 'deleteEntity',
      handleCreate: 'createEntity',
      handleUpdate: 'updateEntity',
      handleSave: 'saveData',
      handleCancel: 'cancelOperation',
      handleClose: 'closeModal',
      handleOpen: 'openModal',
      handleSelect: 'selectOption',
      handleSearch: 'searchData',
      handleFilter: 'filterData',
      handleSort: 'sortData',
      handleReset: 'resetForm',
      handleValidate: 'validateInput',
      handleError: 'processError',
      handleSuccess: 'processSuccess',
      handleResponse: 'processResponse',
      handleRequest: 'sendRequest',
    }

    function getSuggestion(name) {
      // Check if we have a direct mapping
      if (suggestionMap[name]) {
        return suggestionMap[name]
      }

      // Try to create a suggestion by removing 'handle' and making it more descriptive
      const withoutHandle = name.replace(/^handle/, '')
      const firstLower = withoutHandle.charAt(0).toLowerCase() + withoutHandle.slice(1)

      // Add context based on common patterns
      if (firstLower.includes('Click')) return firstLower.replace('Click', 'Action')
      if (firstLower.includes('Change')) return `update${withoutHandle}`
      if (firstLower.includes('Submit')) return `submit${withoutHandle}`

      return firstLower
    }

    return {
      // Check variable declarations
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          node.id.name.startsWith('handle') &&
          node.init &&
          (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')
        ) {
          context.report({
            node: node.id,
            messageId: 'noHandlePrefix',
            data: {
              name: node.id.name,
              suggestion: getSuggestion(node.id.name),
            },
          })
        }
      },

      // Check function declarations
      FunctionDeclaration(node) {
        if (node.id && node.id.name.startsWith('handle')) {
          context.report({
            node: node.id,
            messageId: 'noHandlePrefix',
            data: {
              name: node.id.name,
              suggestion: getSuggestion(node.id.name),
            },
          })
        }
      },

      // Check method definitions in objects and classes
      MethodDefinition(node) {
        if (node.key.type === 'Identifier' && node.key.name.startsWith('handle')) {
          context.report({
            node: node.key,
            messageId: 'noHandlePrefix',
            data: {
              name: node.key.name,
              suggestion: getSuggestion(node.key.name),
            },
          })
        }
      },

      // Check object properties that are functions
      Property(node) {
        if (
          node.key.type === 'Identifier' &&
          node.key.name.startsWith('handle') &&
          node.value &&
          (node.value.type === 'ArrowFunctionExpression' || node.value.type === 'FunctionExpression')
        ) {
          context.report({
            node: node.key,
            messageId: 'noHandlePrefix',
            data: {
              name: node.key.name,
              suggestion: getSuggestion(node.key.name),
            },
          })
        }
      },
    }
  },
}
