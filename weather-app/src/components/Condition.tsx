import isLoadingProps from "@/types/isLoading"

export default function Conditions({ loading }: isLoadingProps) {
  const baseConditions = [
    { condition: "Feels Like", data: "18°" },
    { condition: "Humidity", data: "46%" },
    { condition: "Wind", data: "14 km/h" },
    { condition: "Precipitation", data: "0 mm" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {baseConditions.map((wc, i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-neutral-800 rounded-lg p-4"
        >
          {/* Label */}
          <h6 className="text-sm font-medium text-neutral-400">{wc.condition}</h6>

          {/* Data / Skeleton */}
          {loading ? (
            <div className="h-5 w-16 mt-2 rounded bg-neutral-700 animate-pulse" />
          ) : (
            <span className="text-lg font-semibold font-sans">{wc.data}</span>
          )}
        </div>
      ))}
    </div>
  )
}
