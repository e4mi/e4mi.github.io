import storage from "./storage.js"
let editor
let editView
function initEditor () {
  editView = document.createElement("div")
  editView.className = "editView"
  editor = document.createElement("textarea")
  editor.id = "editor"
  editor.className = "editor"
  editor.spellcheck = false
  editor.ondblclick = followLink
  editor.value = window.text
  editView.append(editor)
  const buttons = document.createElement("div")
  buttons.className = "buttons"
  const saveButton = document.createElement("button")
  saveButton.className = "button"
  saveButton.innerText = "Save"
  saveButton.onclick = save
  buttons.append(saveButton)
  const cancelButton = document.createElement("button")
  cancelButton.className = "button"
  cancelButton.innerText = "Cancel"
  cancelButton.onclick = cancel
  buttons.append(cancelButton)
  editView.append(buttons)
  document.body.append(editView)
  document.querySelector("#content").hidden = true
  const style = document.createElement("style")
  style.innerText = `
  .editView {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: calc(100vh - 2rem);
  }
  .editor {
    outline: none;
    width: 100%;
    resize: none;
    flex: 1;
  }
  .buttons {
    display: flex;
    gap: 0.5rem;
  }
  .button {
    border: 1px solid;
    align-self: start;
    padding: 0 1rem;
    min-width: 6rem;
    &:hover {
      background-color: light-dark(black, white);
      color: light-dark(white, black);
    }
    &:active {
      opacity: 0.5;
    }
  }
  `
  document.head.append(style)
}
function edit (event) {
  if (event.target.tagName == "A") {
    return
  }
  editView.hidden = false
  editor.value = text
  content.hidden = true
  editor.focus()
}
async function save () {
  const id = location.hash.slice(1) || "README"
  window.text = editor.value
  const text = window.text
  editView.hidden = true
  window.content.hidden = false
  content.innerHTML = window.markdownToHtml(text)
  await storage.set(id + ".md", text)
  location.reload()
}
function cancel () {
  editView.hidden = true
  content.hidden = false
}
function followLink (event) {
  const linkStart = editor.value.slice(0, editor.selectionStart).lastIndexOf("[")
  if (linkStart < 0) {
    return
  }
  const link = editor.value.slice(linkStart).match(/\[(.*?)\]\((.*?)\)/)
  if (!link) {
    return
  }
  if (link[2].includes("//")) {
    window.open(link[2])
  }
  location.hash = link[2]
}

initEditor()