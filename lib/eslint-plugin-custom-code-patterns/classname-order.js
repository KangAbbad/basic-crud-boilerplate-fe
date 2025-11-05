/**
 * Custom ESLint Plugin for Tailwind className Ordering
 */

// Inline the sorter to avoid path issues when installed in node_modules
// Order: Border > Display/Position > Background > Typography > Sizing > Other (animations/transforms) > Padding > Margin

const classOrder = [
  // 1. Border classes
  {
    category: 'border',
    patterns: [
      /^border($|-)/, // border, border-*, border-gray-200
      /^rounded(-|$)/, // rounded, rounded-*, rounded-xl
      /^ring(-|$)/, // ring, ring-*
      /^divide(-|$)/, // divide, divide-*
    ],
  },

  // 2. Display/Position classes
  {
    category: 'display-position',
    patterns: [
      /^(block|inline|flex|grid|table|hidden)$/, // display types
      /^flex(-|$)/, // flex, flex-row, flex-col, flex-wrap
      /^grid(-|$)/, // grid, grid-cols-*
      /^(static|fixed|absolute|relative|sticky)$/, // position
      /^(top|right|bottom|left|inset)(-|$)/, // positioning
      /^z-/, // z-index
      /^items-/, // items-center, items-start
      /^justify-/, // justify-center, justify-between
      /^content-/, // content-center
      /^place-/, // place-items-*, place-content-*
      /^self-/, // self-center, self-start
      /^order-/, // order-*
      /^gap-/, // gap-*, gap-x-*, gap-y-*
      /^space(-|$)/, // space-x-*, space-y-*
      /^overflow(-|$)/, // overflow, overflow-x-*, overflow-hidden
      /^(visible|invisible)$/, // visibility
      /^group($|-)/, // group, group-hover
    ],
  },

  // 3. Background classes
  {
    category: 'background',
    patterns: [
      /^bg-/, // bg-*, bg-white, bg-primary-500
      /^from-/, // gradient from
      /^via-/, // gradient via
      /^to-/, // gradient to
      /^gradient(-|$)/, // gradient-*
    ],
  },

  // 4. Typography classes
  {
    category: 'typography',
    patterns: [
      /^font-/, // font-*, font-lato, font-bold
      /^text-/, // text-*, text-gray-700, text-center, text-lg
      /^leading-/, // leading-*, line-height
      /^tracking-/, // tracking-*, letter-spacing
      /^(italic|not-italic)$/, // font-style
      /^(uppercase|lowercase|capitalize|normal-case)$/, // text-transform
      /^(underline|line-through|no-underline)$/, // text-decoration
      /^(truncate|overflow-ellipsis|overflow-clip)$/, // text-overflow
      /^whitespace-/, // whitespace-*
      /^break-/, // break-words, break-all
    ],
  },

  // 5. Sizing classes
  {
    category: 'sizing',
    patterns: [
      /^w-/, // w-*, w-full, w-screen
      /^h-/, // h-*, h-screen, h-full
      /^min-w-/, // min-w-*
      /^min-h-/, // min-h-*
      /^max-w-/, // max-w-*
      /^max-h-/, // max-h-*
      /^size-/, // size-*
    ],
  },

  // 6. Other utility classes (transitions, transforms, etc.)
  {
    category: 'other',
    patterns: [
      /^transition(-|$)/, // transition, transition-*
      /^duration-/, // duration-*
      /^ease-/, // ease-*
      /^delay-/, // delay-*
      /^animate-/, // animate-*
      /^transform(-|$)/, // transform, transform-*
      /^scale-/, // scale-*
      /^rotate-/, // rotate-*
      /^translate(-|$)/, // translate-*
      /^skew-/, // skew-*
      /^origin-/, // transform-origin
      /^opacity-/, // opacity-*
      /^cursor-/, // cursor-*
      /^select-/, // user-select
      /^pointer-events-/, // pointer-events
      /^resize(-|$)/, // resize
      /^(outline|focus|active|hover|disabled|group-hover)(-|:)/, // state modifiers
    ],
  },

  // 7. Padding classes
  {
    category: 'padding',
    patterns: [
      /^p-/, // p-*, p-4
      /^px-/, // px-*, px-6
      /^py-/, // py-*, py-2
      /^pt-/, // pt-*
      /^pr-/, // pr-*
      /^pb-/, // pb-*
      /^pl-/, // pl-*
    ],
  },

  // 8. Margin classes
  {
    category: 'margin',
    patterns: [
      /^m-/, // m-*, m-4
      /^mx-/, // mx-*, mx-auto
      /^my-/, // my-*
      /^mt-/, // mt-*, mt-2
      /^mr-/, // mr-*
      /^mb-/, // mb-*
      /^ml-/, // ml-*
      /^-m-/, // negative margins
      /^-mx-/,
      /^-my-/,
      /^-mt-/,
      /^-mr-/,
      /^-mb-/,
      /^-ml-/,
    ],
  },
]

function getClassSortIndex(className) {
  // Remove modifiers (e.g., "hover:", "md:", "!") to get base class
  const baseClass = className.replace(/^[!@]/, '').replace(/^(\w+:)+/, '')

  // Find which category this class belongs to
  for (let i = 0; i < classOrder.length; i++) {
    const { patterns } = classOrder[i]
    for (const pattern of patterns) {
      if (pattern.test(baseClass)) {
        return i * 1000 // Category weight
      }
    }
  }

  // Unknown classes go to the end
  return 999999
}

function sortTailwindClasses(classStr) {
  if (!classStr || typeof classStr !== 'string') return classStr

  const classes = classStr.trim().split(/\s+/)

  const sorted = classes.sort((a, b) => {
    const indexA = getClassSortIndex(a)
    const indexB = getClassSortIndex(b)

    if (indexA !== indexB) {
      return indexA - indexB
    }

    // Within the same category, maintain original order
    return 0
  })

  return sorted.join(' ')
}

const rule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce custom Tailwind className ordering',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      incorrectOrder: 'Tailwind classes are not in the correct order. Expected: "{{ expected }}"',
    },
    schema: [], // no options
  },

  create(context) {
    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== 'className') {
          return
        }

        // Skip if no value
        if (!node.value) {
          return
        }

        let originalValue = null
        let sortedValue = null
        let valueNode = null

        // Handle string literals
        if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
          originalValue = node.value.value
          sortedValue = sortTailwindClasses(originalValue)
          valueNode = node.value
        }
        // Handle JSX expression containers with string literals
        else if (
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'Literal' &&
          typeof node.value.expression.value === 'string'
        ) {
          originalValue = node.value.expression.value
          sortedValue = sortTailwindClasses(originalValue)
          valueNode = node.value.expression
        }
        // Handle template literals
        else if (
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'TemplateLiteral' &&
          node.value.expression.quasis.length === 1 &&
          node.value.expression.expressions.length === 0
        ) {
          originalValue = node.value.expression.quasis[0].value.raw
          sortedValue = sortTailwindClasses(originalValue)
          valueNode = node.value.expression
        }

        // If we couldn't extract a value or it's already sorted, skip
        if (!originalValue || !sortedValue || originalValue === sortedValue) {
          return
        }

        // Report the issue
        context.report({
          node: valueNode,
          messageId: 'incorrectOrder',
          data: {
            expected: sortedValue,
          },
          fix(fixer) {
            // Determine the quote character used
            let quoteChar = '"'
            if (valueNode.raw && valueNode.raw[0]) {
              quoteChar = valueNode.raw[0]
            }

            // For template literals
            if (valueNode.type === 'TemplateLiteral') {
              return fixer.replaceText(valueNode, `\`${sortedValue}\``)
            }

            // For regular string literals
            return fixer.replaceText(valueNode, `${quoteChar}${sortedValue}${quoteChar}`)
          },
        })
      },
    }
  },
}

module.exports = rule
