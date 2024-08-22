import "./editor.css";

import Tiptap from "@/TipTap";
import {
  useCurrentEditor,
  EditorProvider,
  FloatingMenu,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";

export default function TextEditor({ description }: { description: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
        emptyEditorClass: "is-editor-empty",
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
    ],
    content: description,
    editable: true,
    // autofocus: true,
    editorProps: {
      attributes: {
        class:
          "p-6 min-h-[400px] border-none border-0 focus:border-none focus:ring-0",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    },
  });

  return (
    <>
      {/* {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="floating-menu">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              Bullet list
            </button>
          </div>
        </FloatingMenu>
      )} */}
      <EditorContent editor={editor} />
    </>
  );
}
