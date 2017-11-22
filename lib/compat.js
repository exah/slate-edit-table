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

const normalize = (reasons = {}) => (change, reason, context) => {
  const reasonFn = reasons[reason]
  if (reasonFn) {
    reasonFn(change, context)
  }
}

module.exports = {
  legacySchema,
  normalize
}
