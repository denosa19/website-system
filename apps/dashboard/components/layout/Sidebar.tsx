"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "../../config/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-neutral-800 bg-neutral-950 p-6">
      <h1 className="mb-10 text-2xl font-bold">
        Internet Firma OS
      </h1>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-white text-black"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}