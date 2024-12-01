// src/Tiptap.tsx
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  EditorContent,
  useEditor,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

// define your extension array
const extensions = [StarterKit]

const content = "<p>Hello World!</p>"

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World 2!</p>",
  })
  return <EditorContent editor={editor}></EditorContent>
}

export default Tiptap
