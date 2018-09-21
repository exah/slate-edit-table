const legacySchema = (schema) => {
  const renderNode = (props) => {
    const render = schema.nodes[props.node.type]
    return render ? render(props) : null
  }

  const renderMark = (props) => {
    const render = schema.marks[props.mark.type]
    return render ? render(props) : null
  }

  return {
    schema: {
      document: {
        nodes: Object.keys(schema.nodes)
      }
    },
    renderMark,
    renderNode
  }
}

const normalize = (reasons = {}) => (change, error) => {
  const reasonFn = reasons[error.code]
  if (reasonFn) {
    reasonFn(change, error)
  }
}

const validateRules = (rules) => {
  const validators = rules.map((rule) => {
    return function validateRule (node) {
      if (!rule.match(node)) {
        return
      }

      const validationResult = rule.validate(node)

      if (validationResult == null) {
        return
      }

      return change => rule.normalize(change, node, validationResult)
    }
  })

  return function validateTableNode (node) {
    let changer

    validators.find(validator => {
      changer = validator(node)
      return Boolean(changer)
    })

    return changer
  }
}

module.exports = {
  legacySchema,
  validateRules,
  normalize
}
