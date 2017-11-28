'use babel'

import { CompositeDisposable, Range } from 'atom'

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'multiline-bracket:apply': () => this.apply()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
    return {}
  },

  matchBraces(line) {
    let mode
    let start
    let end

    line.split('').some((char, index) => {
      if (
        char === '{' ||
        char === '[' ||
        char === '('
      ) {
        mode = char
        start = index + 1
      }
      else if (
        (char === '}' && mode === '{') ||
        (char === ']' && mode === '[') ||
        (char === ')' && mode === '(')
      ) {
        return end = index
      }
    })

    if (!start || !end) return
    return {
      frag: line.substring(start, end).trim(),
      start,
      end,
    }
  },

  apply() {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) return

    const bufferRow = editor.getCursorBufferPosition().row
    const indent = editor.indentationForBufferRow(bufferRow)
    const line = editor.lineTextForBufferRow(bufferRow)
    if (!line.length) return

    const match = this.matchBraces(line)
    if (!match) return

    const items = match.frag.split(',').filter(str => !!str)
    if (!items.length) return

    const range = new Range([bufferRow, match.start], [bufferRow, match.end])
    const newText = `\n${items.join(',\n')},\n`

    const checkpoint = editor.createCheckpoint()
    editor.setTextInBufferRange(range, newText)

    items.forEach((item, index) => {
      editor.setIndentationForBufferRow(bufferRow + index + 1, indent + 1)
    })
    editor.setIndentationForBufferRow(bufferRow + items.length + 1, indent)

    editor.groupChangesSinceCheckpoint(checkpoint)
  }

}
