import Image from "next/image";

export default function SearchBar () {
    return (
        <form
        action="#"
        className="flex w-full max-w-md items-center gap-2 mb-8"
      >
        <div className="bg-neutral-800 flex w-full items-center gap-2 rounded-lg px-3 py-2">
          <Image
            src="/icon-search.svg"
            alt="search icon"
            width={18}
            height={18}
            className="opacity-70"
          />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search city..."
            aria-label="Search city"
            className="w-full bg-transparent focus:outline-none px-2 text-sm placeholder-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          Search
        </button>
      </form>
    )
}