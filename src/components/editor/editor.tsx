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

interface TextEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
        emptyEditorClass: "is-editor-empty",
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "text-zinc-700 dark:text-zinc-200",
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "p-0 m-0",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "line-height-6",
        },
      }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
    ],
    content: content,
    editable: true,
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "prose m-0 focus:outline-none p-6 text-zinc-700 dark:text-zinc-200",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
