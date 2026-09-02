"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import react-quill to avoid SSR issues with the document object
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="h-40 w-full animate-pulse rounded-xl bg-stone-100" /> });

interface RichTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextField({ label, value, onChange, placeholder }: RichTextFieldProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">{label}</label>
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-stone-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-b-stone-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-slate-800">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
