const { normalize } = require('./compat')

/**
 * Create a schema for tables
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A schema definition with rules to normalize tables
 */
function makeSchema (opts) {
  return {
    blocks: {
      [opts.typeTable]: {
        nodes: [
          {
            types: [ opts.typeRow ],
            min: 1
          }
        ],
        parent: {
          kinds: [ 'document' ]
        },
        normalize: normalizeChild(opts.typeRow, {
          parent_kind_invalid: (change, context) => {
            const { document } = change.value
            const furthest = document.getFurthestBlock(context.parent.key)
            const index = document.nodes.findIndex(n => n.key === furthest.key)
            return change.moveNodeByKey(context.node.key, document.key, index + 1, {
              normalize: false
            })
          }
        })
      },
      [opts.typeRow]: {
        nodes: [
          {
            types: [ opts.typeCell ],
            min: 1
          }
        ],
        parent: {
          types: [ opts.typeTable ]
        },
        normalize: normalizeChild(opts.typeCell, {
          parent_type_invalid: (change, context) => (
            change.wrapBlockByKey(
              context.node.key,
              opts.typeTable,
              { normalize: false }
            )
          )
        })
      },
      [opts.typeCell]: {
        nodes: [
          {
            kinds: [ 'block' ],
            min: 1
          }
        ],
        parent: {
          types: [ opts.typeRow ]
        },
        normalize: normalize({
          child_kind_invalid: (change, context) => (
            wrapChildrenInDefaultBlock(opts, change, context.node)
          ),
          parent_type_invalid: (change, context) => (
            change.wrapBlockByKey(
              context.node.key,
              opts.typeRow
            )
          )
        })
      }
    }
  }
}

const normalizeChild = (type, extraRules) => normalize(
  Object.assign({}, extraRules, {
    child_type_invalid: (change, context) => (
      change.wrapBlockByKey(
        context.child.key,
        { type },
        { normalize: false }
      )
    )
  })
)

function wrapChildrenInDefaultBlock (opts, change, node) {
  change.wrapBlockByKey(node.nodes.first().key, opts.typeDefault, {
    normalize: false
  })

  const wrapper = change.value.document.getDescendant(node.key).nodes.first()

  // Add in the remaining items
  node.nodes.rest().forEach((child, index) =>
    change.moveNodeByKey(child.key, wrapper.key, index + 1, {
      normalize: false
    })
  )

  return change
}

module.exports = makeSchema
