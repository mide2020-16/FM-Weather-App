import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-neutral-900 text-white">
            <h1 className="text-6xl font-bold mb-4">
                404
            </h1>
            <p className="text-lg mb-6">
                Sorry, we could not find that page.
            </p>
            <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                Return Home
            </Link>
        </div>
    )
}
