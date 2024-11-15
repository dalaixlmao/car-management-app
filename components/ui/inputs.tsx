import { useState } from "react";
import { X } from "lucide-react";

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  setFunction: (a: string) => void;
  value?: string;
}

export function FormInput({
  label,
  type,
  placeholder,
  setFunction,
  value,
}: InputProps) {
  return (
    <div className="flex w-full flex-col items-start mt-5 text-sm">
      <div className="text-white/50">{label}</div>
      <input
        value={value ? value : ""}
        onChange={(e) => {
          setFunction(e.target.value);
        }}
        type={type}
        className="mt-2 w-full rounded-md px-3 py-1 bg-white/10 border border-white/30 placeholder:text-white/30"
        placeholder={placeholder}
      />
    </div>
  );
}

export function TagsInput({
  setFunction,
  existingTags,
}: {
  setFunction: (a: string[]) => void;
  existingTags?: string[];
}) {
  const [tags, setTags] = useState<string[]>(existingTags ? existingTags : []);
  const [value, setValue] = useState<string>("");

  const addTag = () => {
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setValue("");
      setFunction(tags);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((existingTags || []).filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex mt-5 flex-col items-start w-full">
      <div className="text-white/30">Add Tags</div>
      <div className="flex flex-wrap gap-2 mb-2 mt-2">
        {(tags || []).map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-white/10 rounded-full px-3 py-1"
          >
            <span className="mr-2">{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-row w-full justify-between items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          className="w-full rounded-md px-3 py-1 text-sm bg-white/10 border border-white/30 placeholder:text-white/30"
          placeholder="Enter tag"
        />
        <button
          onClick={addTag}
          className="ml-3 rounded-md px-4 py-1 text-sm text-white/60 bg-white/10 bg-gradient-to-b from-white/10 to-white/0 border border-white/30 transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
