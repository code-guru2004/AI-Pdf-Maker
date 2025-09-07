'use client'

import { UserButton } from "@clerk/nextjs"

function Header() {
  return (
    <div className="flex justify-end p-4 shadow-sm">
        <UserButton/>
    </div>
  )
}

export default Header