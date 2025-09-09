import isLoadingProps from "@/types/isLoading"

export default function WeatherCard({ loading }: isLoadingProps) {
  return (
    <div
      className={`rounded-lg p-6 text-center transition-colors duration-300 w-full h-64 flex items-center justify-center ${
        loading ? "bg-neutral-800" : "bgImage bg-cover bg-center"
      }`}
    >
      {loading ? (
        <div className="flex flex-col items-center space-x-1">
          <span className="flex space-x-1">
            <span className="animate-bounce [animation-delay:0ms] text-white font-bold text-3xl rounded-full">.</span>
            <span className="animate-bounce [animation-delay:150ms] text-white font-bold text-3xl rounded-full">.</span>
            <span className="animate-bounce [animation-delay:300ms] text-white font-bold text-3xl rounded-full">.</span>
          </span>
          <span className="text-gray-400 text-sm font-thin">Loading...</span>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Today’s Weather</h2>
          <p className="text-5xl font-bold text-white">24°</p>
          <span className="text-neutral-300">Sunny</span>
        </div>
      )}
    </div>
  )
}
