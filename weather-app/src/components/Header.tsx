"use client";

import Image from "next/image";
import Link from "next/link";
import UnitsDropdown from "./Units";
import ThemeSwitcher from "./ThemeSwitcher";
import { LucideArrowDownUp } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <Link href="/" className="transition hover:opacity-90">
          <Image 
            src="/logo.svg" 
            alt="Weather Now Logo" 
            width={170} 
            height={50}
          />
        </Link>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitcher />
          
          <Link 
            href="#compare"
            className="flex items-center justify-between p-3 text-sm font-medium rounded-2xl border border-border text-foreground hover:opacity-80 transition-all duration-200 transform active:scale-95"
          >
            <span className="pr-1">
            <LucideArrowDownUp className="font-extrabold w-4 h-4"/>
            </span>
            Compare
          </Link>

          <UnitsDropdown />
        </div>

      </div>
    </header>
  );
}
