"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapse = CollapsiblePrimitive.Root

const CollapseButton = CollapsiblePrimitive.Trigger

const CollapseContent = React.forwardRef(({ ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden"
    {...props}
  />
))
CollapseContent.displayName = "CollapseContent"

export { Collapse, CollapseButton, CollapseContent }
