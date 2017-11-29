# atom-multiline-bracket
Split the enclosed contents of `{}`, `()`, and `{}` over multiple lines in atom.

Use <kbd>ctrl-alt-m</kbd> to split a matching pair of `{}`, `()`, or `{}` in the current line of the cursor.

This tool supports one match on a single line only (for now).
For multiple cursors, it will take the most recently added cursor as the target.

![Demo](https://i.gyazo.com/7943d1492ef25e2e923593c4458a6ba9.gif)

---
### Configuration

#### Last Trailing Comma

You can enable or disable (default: enabled) the addition of
a trailing comma at the last item:
```
const {
  foo,
  bar,
  baz,
  qux, <--
} = this.props
```
