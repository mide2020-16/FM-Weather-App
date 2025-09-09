"use client";

import Image from "next/image";
import Link from "next/link";
import UnitsDropdown from "./Units";

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="#">
          <Image src="/logo.svg" alt="Weather Now Image" width={150} height={40} />
        </Link>

        {/* Dropdown */}
        <UnitsDropdown />
      </div>
    </header>
  );
}
