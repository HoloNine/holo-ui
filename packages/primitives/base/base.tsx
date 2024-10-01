import * as React from "react";
import * as ReactDOM from "react-dom";
import { Slot } from "../slot";

// Internal dependencies
const NODES = ["button", "div", "section"] as const;

// Types
type Bases = {
  [E in (typeof NODES)[number]]: BaseForwardRefComponent<E>;
};

type BasePropsWithRef<E extends React.ElementType> =
  React.ComponentPropsWithRef<E> & {
    asChild?: boolean;
  };

type BaseForwardRefComponent<E extends React.ElementType> =
  React.ForwardRefExoticComponent<BasePropsWithRef<E>>;

// Base component
const Base = NODES.reduce((Base, node) => {
  const Node = React.forwardRef(
    (props: BasePropsWithRef<typeof node>, forwardedRef: any) => {
      const { asChild, ...BaseProps } = props;
      const Comp: any = asChild ? Slot : node;

      if (typeof window !== "undefined") {
        (window as any)[Symbol.for("radix-ui")] = true;
      }

      return <Comp {...BaseProps} ref={forwardedRef} />;
    }
  );

  Node.displayName = `Base.${node}`;

  return { ...Base, [node]: Node };
}, {} as Bases);

// Custom event dispatcher
function dispatchDiscreteCustomEvent<E extends CustomEvent>(
  target: E["target"],
  event: E
) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}

export { Base, dispatchDiscreteCustomEvent };
export type { BasePropsWithRef };
