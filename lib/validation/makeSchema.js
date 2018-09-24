const { normalize } = require('../utils/compat')

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
            match: { type: opts.typeRow },
            min: 1
          }
        ],
        parent: {
          object: 'document'
        },
        normalize: normalize({
          child_type_invalid: (change, context) => (
            change.wrapBlockByKey(
              context.child.key,
              { type: opts.typeRow },
              { normalize: false }
            )
          ),
          parent_object_invalid: (change, context) => {
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
            match: { type: opts.typeCell },
            min: 1
          }
        ],
        parent: {
          type: opts.typeTable
        },
        normalize: normalize({
          child_type_invalid: (change, context) => (
            change.wrapBlockByKey(context.child.key, { type: opts.typeCell }, {
              normalize: context.child.object === 'block'
            })
          ),
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
            match: { object: 'block' },
            min: 1
          }
        ],
        parent: {
          type: opts.typeRow
        },
        normalize: normalize({
          child_object_invalid: (change, context) => {
            change.wrapBlockByKey(context.node.nodes.first().key, opts.typeDefault, {
              normalize: false
            })

            const wrapper = change.value.document.getDescendant(context.node.key).nodes.first()

            // Add in the remaining items
            context.node.nodes.rest().forEach((child, index) =>
              change.moveNodeByKey(child.key, wrapper.key, index + 1, {
                normalize: false
              })
            )

            return change
          },
          parent_type_invalid: (change, context) => (
            change.wrapBlockByKey(
              context.node.key,
              opts.typeRow,
              { normalize: false }
            )
          )
        })
      }
    }
  }
}


module.exports = makeSchema
