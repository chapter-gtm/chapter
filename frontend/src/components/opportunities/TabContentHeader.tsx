"use client"

import * as React from "react"

interface TabContentHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabContentHeader({ children, ...props }: TabContentHeaderProps) {
  return (
    <div {...props}>
      <label className="tracking-[0.5px] text-lg font-normal py-3 flex text-primary">
        {children}
      </label>
    </div>
  )
}

export { TabContentHeader }
