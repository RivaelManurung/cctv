"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/** Root of the collapsible; owns the open state. */
const Collapsible = CollapsiblePrimitive.Root;

/** Element that expands or collapses the content. */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/** Region revealed while the collapsible is open. */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
