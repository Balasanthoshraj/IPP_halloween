import { ViewTransition, type ReactNode } from "react";

// Every page sits in one of these: when you navigate, the browser animates the old page out and the new one in
// (the `page-out` / `page-in` rules in globals.css). Browsers without view transitions just swap the pages.
export default function Transition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
