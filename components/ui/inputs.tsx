import { useState } from "react";

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  setFunction: (a: string) => void;
}

export function FormInput({
  label,
  type,
  placeholder,
  setFunction,
}: InputProps) {
  return (
    <div className="flex w-full flex-col items-start mt-5 text-sm">
      <div className="text-white/50">{label}</div>
      <input
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

export function TagsInput({setFunction}:{setFunction: (a:string[])=>void}) {
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");

  const addTag = () => {
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setValue("");
      setFunction(tags);
    }
  };

  return (
    <div className="flex mt-5 flex-col items-start w-full">
      <div className="text-white/30">Add Tags</div>
      <div className="flex flex-wrap">
        {Array.from(new Set(tags)).map((tag) => (
          <div
            key={tag}
            className="mx-2 my-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white/30"
          >
            {tag}
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
