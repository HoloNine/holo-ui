import * as React from "react";

// Utility function to compose multiple refs
function composeRefs<T>(
  ...refs: Array<React.Ref<T> | null>
): React.RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(value);
      } else if (typeof ref === "object" && ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

// Hook to compose multiple refs
function useRefs<T>(...refs: Array<React.Ref<T> | null>): React.RefCallback<T> {
  const stableRefs = React.useMemo(() => refs, [refs]);

  return React.useCallback(
    (instance: T | null) => {
      composeRefs(...stableRefs)(instance);
    },
    [stableRefs]
  );
}

export { composeRefs, useRefs };
