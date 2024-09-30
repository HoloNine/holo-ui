import * as React from "react";
import { composeRefs } from "../use-refs";

// Slot component
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  // Memoize children array and slottable lookup to avoid recalculations
  const childrenArray = React.useMemo(
    () => React.Children.toArray(children),
    [children]
  );
  const slottable = React.useMemo(
    () => childrenArray.find(isSlottable),
    [childrenArray]
  );

  // If slottable is found, slot its inner children
  if (slottable && React.isValidElement(slottable)) {
    const newElement = (slottable as React.ReactElement).props.children;

    // Early return if there is more than one child within the slottable
    if (React.Children.count(newElement) > 1) {
      console.warn("Slottable child should have exactly one child.");
      return null;
    }

    // Map over children and replace the slottable element with its children
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        return React.isValidElement(newElement)
          ? (newElement as React.ReactElement).props.children
          : null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  // Return the original children when no slottable element is found
  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = "Slot";

// SlotClone component
interface SlotCloneProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<HTMLElement, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    // Check if children is a valid React element
    if (React.isValidElement(children)) {
      // Safely get the ref from the child element
      const childrenRef = getElementRef(children);

      // Define a type that includes the ref property
      type PropsWithRef = typeof children.props & {
        ref?: React.Ref<HTMLElement>;
      };

      // Merge props and refs, and return the cloned element
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props as AnyProps),
        ref: forwardedRef
          ? composeRefs(forwardedRef, childrenRef)
          : childrenRef, // Use either the composed ref or the child’s original ref
      } as PropsWithRef);
    }

    // If children is not a valid element, return null or handle fragments
    return null;
  }
);

SlotClone.displayName = "SlotClone";

// Slottable component
const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      const classNameSet = new Set<string>();

      if (slotPropValue && typeof slotPropValue === "string") {
        slotPropValue
          .split(" ")
          .filter(Boolean)
          .forEach((name) => classNameSet.add(name));
      }
      if (childPropValue && typeof childPropValue === "string") {
        childPropValue
          .split(" ")
          .filter(Boolean)
          .forEach((name) => classNameSet.add(name));
      }

      overrideProps[propName] = [...classNameSet].join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

// Function to safely get the ref from an element
function getElementRef(element: React.ReactElement) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element as any).ref;
  }

  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }

  return element.props.ref || (element as any).ref;
}

export { Slot, Slottable };
export type { SlotProps };
