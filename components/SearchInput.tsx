import SearchIcon from "@/public/icons/search-icon";

// Accept props for searchText and setSearchText
interface SearchInputProps {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
}

export default function SearchInput({
  setSearchText,
  searchText,
}: SearchInputProps) {
  // Handle input change and update the state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="w-48">
      <div className="flex flex-row items-center bg-white/10 border border-white/30 rounded-md px-2">
        <div className="w-6 opacity-30">
          <SearchIcon />
        </div>
        <input
          className="w-36 h-full bg-white/0 placeholder:text-white/30 ml-2 py-1 focus:outline-none"
          placeholder="Search cars..."
          value={searchText} // Bind the input value to searchText
          onChange={handleChange} // Update state on change
        />
      </div>
    </div>
  );
}
