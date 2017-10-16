# slate-edit-table (fork)

[![NPM version](https://badge.fury.io/js/%40exah%2Fslate-edit-table.svg)](http://badge.fury.io/js/slate-edit-table)

A Slate plugin to handle table edition.

### Install

```
npm install @exah/slate-edit-table
```

### Features

- Pressing <kbd>Up</kbd> and <kbd>Down</kbd>, move the cursor to next/previous row
- Pressing <kbd>Enter</kbd>, insert a new row
- Pressing <kbd>Tab</kbd>, move the select to next cell
- Pressing <kbd>Shift+Tab</kbd>, move the select to previous cell

### Simple Usage

```js
import EditTable from '@exah/slate-edit-table'

const plugins = [
  EditTable()
]
```

#### Arguments

- ``[typeTable: String]`` — type for table
- ``[typeRow: String]`` — type for the rows.
- ``[typeCell: String]`` — type for the cells.

### Utilities and Transform

`slate-edit-table` exports utilities and changes:

#### `utils.isSelectionInTable`

`plugin.utils.isSelectionInTable(state: State) => Boolean`

Return true if selection is inside a table.

#### `changes.insertTable`

`plugin.changes.insertTable(transform: Transform, columns: Number?, rows: Number?) => Transform`

Insert a new empty table.

#### `changes.insertRow`

`plugin.changes.insertRow(transform: Transform, at: Number?) => Transform`

Insert a new row after the current one or at the specific index (`at`).

#### `changes.insertColumn`

`plugin.changes.insertColumn(transform: Transform, at: Number?) => Transform`

Insert a new column after the current one or at the specific index (`at`).

#### `changes.removeTable`

`plugin.changes.removeTable(transform: Transform) => Transform`

Remove current table.

#### `changes.removeRow`

`plugin.changes.removeRow(transform: Transform, at: Number?) => Transform`

Remove current row or the one at a specific index (`at`).

#### `changes.removeColumn`

`plugin.changes.removeColumn(transform: Transform, at: Number?) => Transform`

Remove current column or the one at a specific index (`at`).

#### `changes.moveSelection`

`plugin.changes.moveSelection(transform: Transform, column: Number, row: Number) => Transform`

Move the selection to a specific position in the table.

#### `changes.moveSelectionBy`

`plugin.changes.moveSelectionBy(transform: Transform, column: Number, row: Number) => Transform`

Move the selection by the given amount of columns and rows.

#### `changes.setColumnAlign`

`plugin.changes.setColumnAlign(transform: Transform, align: String, at: Number) => Transform`

Sets column alignment for a given column (`at`), in the current table. `align`
defaults to center, `at` is optional and defaults to current cursor position.
