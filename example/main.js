const React = require('react')
const createReactClass = require('create-react-class')
const ReactDOM = require('react-dom')
const Slate = require('slate')
const PluginEditTable = require('../lib/')

const stateJson = require('./state')

const tablePlugin = PluginEditTable({
  onTabCreateRow: false,
  onEnterCreateRow: false,
  typeDefault: 'paragraph'
})
const plugins = [
  tablePlugin
]

const schema = {
  nodes: {
    table: props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
    table_row: props => <tr {...props.attributes}>{props.children}</tr>,
    table_cell: (props) => {
      const align = props.node.get('data').get('align') || 'left'
      return <td style={{ textAlign: align }} {...props.attributes}>{props.children}</td>
    },
    paragraph: props => <p {...props.attributes}>{props.children}</p>,
    heading: props => <h1 {...props.attributes}>{props.children}</h1>
  }
}

const Example = createReactClass({
  getInitialState () {
    return {
      state: Slate.State.fromJSON(stateJson)
    }
  },

  handleChange (change) {
    this.setState({
      state: change.state
    })
  },

  handleInsertTable () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.insertTable(state.change())
    )
  },

  handleInsertColumn () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.insertColumn(state.change())
    )
  },

  handleInsertRow () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.insertRow(state.change())
    )
  },

  handleRemoveColumn () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.removeColumn(state.change())
    )
  },

  handleRemoveRow () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.removeRow(state.change())
    )
  },

  handleRemoveTable () {
    const { state } = this.state

    this.handleChange(
      tablePlugin.changes.removeTable(state.change())
    )
  },

  handleAlign (align) {
    return (event) => {
      const { state } = this.state

      this.handleChange(
        tablePlugin.changes.setColumnAlign(state.change(), align)
      )
    }
  },

  renderNormalToolbar () {
    return (
      <div>
        <button onClick={this.handleInsertTable}>Insert Table</button>
      </div>
    )
  },

  renderTableToolbar () {
    return (
      <div>
        <button onClick={this.handleInsertColumn}>Insert Column</button>
        <button onClick={this.handleInsertRow}>Insert Row</button>
        <button onClick={this.handleRemoveColumn}>Remove Column</button>
        <button onClick={this.handleRemoveRow}>Remove Row</button>
        <button onClick={this.handleRemoveTable}>Remove Table</button>
        <br />
        <button onClick={this.handleAlign('left')}>Set align left</button>
        <button onClick={this.handleAlign('center')}>Set align center</button>
        <button onClick={this.handleAlign('right')}>Set align right</button>
      </div>
    )
  },

  render () {
    const { state } = this.state
    const isTable = tablePlugin.utils.isSelectionInTable(state)

    return (
      <div>
        {isTable ? this.renderTableToolbar() : this.renderNormalToolbar()}
        <Slate.Editor
          placeholder={'Enter some text...'}
          plugins={plugins}
          state={state}
          onChange={this.handleChange}
          schema={schema}
        />
      </div>
    )
  }
})

ReactDOM.render(
  <Example />,
  document.getElementById('example')
)
