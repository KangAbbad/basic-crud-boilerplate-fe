/**
 * ESLint rule: no-item-terminology
 * Enforces that the words "item" or "Item" should not be used
 *
 * Automatically ignores:
 * - Types and identifiers imported from third-party libraries (default: antd, react, @ant-design, @mui, etc.)
 * - Standalone "Item" (for Form.Item, Menu.Item, List.Item, etc.)
 *
 * Configuration options:
 * - ignoreTestFiles: Skip test/spec files (default: true)
 * - ignoreFiles: Array of file paths or patterns to ignore (e.g., ['*\/migrations\/*', '*\/seeds\/*'])
 * - ignoreDirectories: Array of directory paths to ignore (e.g., ['app/services', 'app/utils'])
 * - libraryPatterns: Additional library patterns to ignore imports from (e.g., ['my-ui-lib', '@company/ui'])
 *
 * Example configuration in .eslintrc:
 * {
 *   "rules": {
 *     "custom-code-patterns/no-item-terminology": [
 *       "warn",
 *       {
 *         "ignoreTestFiles": true,
 *         "ignoreFiles": ["*\/BaseResponse.ts", "*\/migrations\/*"],
 *         "ignoreDirectories": ["app/services", "app/utils"],
 *         "libraryPatterns": ["@my-company/ui", "custom-components"]
 *       }
 *     ]
 *   }
 * }
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow "item" or "Item" terminology',
      category: 'Best Practices',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreTestFiles: {
            type: 'boolean',
            default: true,
            description: 'Skip enforcing the rule inside test/spec files.',
          },
          ignoreFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
            description: 'Array of file paths or glob patterns to ignore.',
          },
          ignoreDirectories: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
            description: 'Array of directory paths to ignore.',
          },
          libraryPatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
            description: 'Additional library patterns to ignore imports from (e.g., ["my-ui-lib", "@company/ui"]).',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noItemTerminology:
        'The term "{{term}}" in identifier "{{name}}" is too generic. Use a more specific entity name like product, user, order, etc.',
      noItemInComponent: 'Component name "{{name}}" should not contain "Item". Use a specific entity name instead.',
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const ignoreTestFiles = options.ignoreTestFiles !== undefined ? options.ignoreTestFiles : true
    const ignoreFiles = options.ignoreFiles || []
    const ignoreDirectories = options.ignoreDirectories || []
    const userLibraryPatterns = options.libraryPatterns || []

    const filename = context.getFilename()

    // Track identifiers imported from third-party libraries
    const importedFromLibraries = new Set()
    // Default library patterns plus user-configured patterns
    const defaultLibraryPatterns = ['node_modules', 'antd', 'react', '@ant-design', '@mui', '@chakra-ui', '@headlessui']
    const libraryPatterns = [...defaultLibraryPatterns, ...userLibraryPatterns]

    // Check if file should be ignored based on test file patterns
    if (ignoreTestFiles && (filename.includes('.test.') || filename.includes('.spec.'))) {
      return {}
    }

    // Check if file matches any ignored file patterns
    if (ignoreFiles.length > 0) {
      const normalizedFilename = filename.replace(/\\/g, '/')
      for (const pattern of ignoreFiles) {
        const normalizedPattern = pattern.replace(/\\/g, '/')
        // Support both exact matches and wildcard patterns
        if (normalizedPattern.includes('*')) {
          // Simple glob pattern matching (supports * wildcard)
          const regex = new RegExp('^' + normalizedPattern.replace(/\*/g, '.*') + '$')
          if (regex.test(normalizedFilename)) {
            return {}
          }
        } else if (normalizedFilename.includes(normalizedPattern) || normalizedFilename === normalizedPattern) {
          return {}
        }
      }
    }

    // Check if file is in any ignored directory
    if (ignoreDirectories.length > 0) {
      const normalizedFilename = filename.replace(/\\/g, '/')
      for (const dir of ignoreDirectories) {
        const normalizedDir = dir.replace(/\\/g, '/')
        // Ensure the directory path ends with / for proper matching
        const dirPath = normalizedDir.endsWith('/') ? normalizedDir : normalizedDir + '/'
        if (normalizedFilename.includes(dirPath)) {
          return {}
        }
      }
    }

    function checkIdentifier(node, name) {
      // Special case: Skip standalone "Item" completely (for Form.Item, Menu.Item, List.Item, etc.)
      // This is very common in UI libraries like Ant Design
      if (name === 'Item') {
        return
      }

      // Skip if this identifier was imported from a third-party library
      if (importedFromLibraries.has(name)) {
        return
      }

      // Check for 'item' or 'Item' in the identifier
      // Match patterns like: testItem, ItemTest, test_item, Item, ITEM, etc.
      if (/item/i.test(name)) {
        const match = name.match(/item/i)
        context.report({
          node,
          messageId: name.includes('Component') ? 'noItemInComponent' : 'noItemTerminology',
          data: {
            term: match[0],
            name,
          },
        })
      }
    }

    function isThirdPartyLibrary(source) {
      if (!source) return false
      // Check if the import source matches any library pattern
      return libraryPatterns.some((pattern) => source.includes(pattern))
    }

    return {
      // Track imports from third-party libraries
      ImportDeclaration(node) {
        if (isThirdPartyLibrary(node.source.value)) {
          // Track all imported identifiers that contain "item" or "Item"
          node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              // Named import: import { ItemType } from 'antd'
              const importedName = specifier.imported.name
              if (/item/i.test(importedName)) {
                importedFromLibraries.add(importedName)
                // Also track the local name if it's different
                if (specifier.local && specifier.local.name !== importedName) {
                  if (/item/i.test(specifier.local.name)) {
                    importedFromLibraries.add(specifier.local.name)
                  }
                }
              }
            } else if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
              // Default or namespace import
              const localName = specifier.local.name
              if (/item/i.test(localName)) {
                importedFromLibraries.add(localName)
              }
            }
          })
        }
      },

      // Check variable names
      Identifier(node) {
        // Skip if it's a property access (like object.item)
        if (node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) {
          return
        }

        // Skip if it's a key in object literal
        if (node.parent && node.parent.type === 'Property' && node.parent.key === node && !node.parent.shorthand) {
          return
        }

        // Check the identifier
        checkIdentifier(node, node.name)
      },

      // Check JSX component names
      JSXIdentifier(node) {
        // Skip if it's part of a member expression (e.g., Form.Item, Table.Column)
        if (node.parent && node.parent.type === 'JSXMemberExpression') {
          return
        }

        // Only check component names (capitalized)
        if (node.name[0] === node.name[0].toUpperCase()) {
          checkIdentifier(node, node.name)
        }
      },

      // Check type/interface names
      TSTypeAliasDeclaration(node) {
        if (node.id) {
          // Skip type aliases that are extending or using imported library types
          // Check if the type references any imported library types
          let usesImportedTypes = false
          if (node.typeAnnotation) {
            // Simple check: if the type references imported identifiers
            const typeString = context.getSourceCode().getText(node.typeAnnotation)
            usesImportedTypes = Array.from(importedFromLibraries).some((imported) => typeString.includes(imported))
          }

          if (!usesImportedTypes) {
            checkIdentifier(node.id, node.id.name)
          }
        }
      },

      TSInterfaceDeclaration(node) {
        if (node.id) {
          checkIdentifier(node.id, node.id.name)
        }
      },

      // Check function names
      FunctionDeclaration(node) {
        if (node.id) {
          checkIdentifier(node.id, node.id.name)
        }
      },

      // Check class names
      ClassDeclaration(node) {
        if (node.id) {
          checkIdentifier(node.id, node.id.name)
        }
      },
    }
  },
}
