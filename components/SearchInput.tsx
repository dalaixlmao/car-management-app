import SearchIcon from "@/public/icons/search-icon"

export default function SearchInput(){
    return <div className="w-48">
        <div className="flex flex-row items-center bg-white/10 border border-white/30 rounded-md px-2">
            <div className="w-6 opacity-30">
            <SearchIcon />
            </div>
          <input className="w-36 h-full bg-white/0 placeholder:text-white/30 ml-2 py-1 focus:outline-none" placeholder="Search cars..."/>
        </div>
    </div>
}