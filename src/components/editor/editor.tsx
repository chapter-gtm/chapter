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
          class: "my-custom-heading",
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "my-custom-paragraph",
        },
      }),
      BulletList,
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
    ],
    content: content,
    editable: false,
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
