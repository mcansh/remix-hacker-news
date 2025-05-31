"use client";

import { useNavigation, useRouteError } from "react-router";

export function GlobalNavigationLoadingBar() {
  const navigation = useNavigation();

  if (navigation.state === "idle") return null;

  return (
    <div className="h-1 w-full bg-pink-100 overflow-hidden fixed top-0 left-0 z-50 opacity-50">
      <div className="animate-progress origin-[0%_50%] w-full h-full bg-pink-500" />
    </div>
  );
}

export function ErrorReporter() {
  const error = useRouteError();

  if (typeof document === "undefined") {
    console.error(error);
  }

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="p-2 text-black">
        <pre>Unknown.</pre>
      </div>
    );
  }

  return (
    <div className="p-2 text-black">
      {error instanceof Error ? (
        <pre>{error.message}</pre>
      ) : (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      )}
    </div>
  );
}
