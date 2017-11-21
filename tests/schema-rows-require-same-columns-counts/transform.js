const Slate = require('slate')

module.exports = function (plugin, value) {
  const schema = new Slate.Schema(plugin.schema)
  return value.change().normalize(schema)
}
