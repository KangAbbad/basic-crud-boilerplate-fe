const path = require('path')

function startsWithOnPrefix(name) {
  return /^on[A-Z]/.test(name)
}

function isAllowedReference(identifier) {
  if (!identifier || !identifier.parent) return false

  const parent = identifier.parent

  if (
    parent.type === 'Property' &&
    parent.value === identifier &&
    parent.key &&
    parent.key.type === 'Identifier' &&
    startsWithOnPrefix(parent.key.name)
  ) {
    return true
  }

  if (
    parent.type === 'AssignmentPattern' &&
    parent.left === identifier &&
    parent.parent &&
    parent.parent.type === 'ObjectPattern'
  ) {
    return true
  }

  return false
}

function shouldReport(variable) {
  if (!variable) return true
  return !variable.references.some((ref) => isAllowedReference(ref.identifier))
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Disallow using the 'on' prefix for internal function names",
      category: 'Best Practices',
    },
    schema: [],
    messages: {
      noOnPrefix: 'Function name "{{name}}" should not start with "on" unless it is a component prop handler.',
      noOnFilename: 'File name "{{name}}" should not start with "on". Rename the file to avoid the reserved prefix.',
    },
  },
  create(context) {
    const filename = context.getFilename()
    const basename = path.basename(filename, path.extname(filename))

    const reportedVariables = new Set()

    function reportIfInvalid(node, name, declaredVars) {
      if (!startsWithOnPrefix(name) || reportedVariables.has(name)) return

      const targetVar = declaredVars && declaredVars.length ? declaredVars[0] : undefined
      const shouldFlag = shouldReport(targetVar)

      if (shouldFlag) {
        context.report({
          node,
          messageId: 'noOnPrefix',
          data: { name },
        })
        reportedVariables.add(name)
      }
    }

    return {
      Program(node) {
        if (startsWithOnPrefix(basename) && filename !== '<input>') {
          context.report({
            node,
            messageId: 'noOnFilename',
            data: { name: basename },
          })
        }
      },

      VariableDeclarator(node) {
        if (node.id.type !== 'Identifier' || !startsWithOnPrefix(node.id.name)) return
        if (!node.init || (node.init.type !== 'ArrowFunctionExpression' && node.init.type !== 'FunctionExpression'))
          return

        const vars = context.getDeclaredVariables(node)
        reportIfInvalid(node.id, node.id.name, vars)
      },

      FunctionDeclaration(node) {
        if (!node.id || !startsWithOnPrefix(node.id.name)) return
        const vars = context.getDeclaredVariables(node)
        reportIfInvalid(node.id, node.id.name, vars)
      },

      MethodDefinition(node) {
        if (node.key.type !== 'Identifier' || !startsWithOnPrefix(node.key.name)) return
        const vars = context.getDeclaredVariables(node)
        reportIfInvalid(node.key, node.key.name, vars)
      },

      Property(node) {
        if (
          node.key.type !== 'Identifier' ||
          !startsWithOnPrefix(node.key.name) ||
          !node.value ||
          (node.value.type !== 'ArrowFunctionExpression' && node.value.type !== 'FunctionExpression')
        ) {
          return
        }

        // Allow properties nested inside objects that are passed directly as arguments or JSX attributes
        const ancestors = context.getAncestors()
        const hasJsxAncestor = ancestors.some((ancestor) => ancestor.type === 'JSXAttribute')

        if (hasJsxAncestor) return

        const parentObject = [...ancestors].reverse().find((ancestor) => ancestor.type === 'ObjectExpression')

        if (parentObject && parentObject.parent) {
          const parentParent = parentObject.parent
          if (
            parentParent.type === 'CallExpression' ||
            parentParent.type === 'NewExpression' ||
            parentParent.type === 'Property' ||
            parentParent.type === 'VariableDeclarator' ||
            parentParent.type === 'ArrayExpression' ||
            parentParent.type === 'ReturnStatement' ||
            parentParent.type === 'ArrowFunctionExpression'
          ) {
            return
          }
        }

        const vars = context.getDeclaredVariables(node)
        reportIfInvalid(node.key, node.key.name, vars)
      },
    }
  },
}
