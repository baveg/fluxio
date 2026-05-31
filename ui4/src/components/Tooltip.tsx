import { cls } from "@fluxio/core/html/cls";
import { comp, type Comp } from "../utils/comp";
import { type DivProps } from "./types";
import { getTargetEl } from "@fluxio/core/html/getTargetEl";
import { type Unsubscribe } from "@fluxio/core/types/Unsubscribe";
import { onHtmlEvent } from "@fluxio/core/html/onEvent";
import { portal } from "./Portal";

export interface TooltipProps extends Omit<DivProps, 'title'> {
  target: HTMLElement;
  children: Comp;
}
export const Tooltip = ({ target, children, class: extraCls, ...props }: TooltipProps) => {
  const { top, left, width, height } = target.getBoundingClientRect();

  if (!children) return null;

  const isTop = top > 200;
  const contentPos = isTop ? 'top-0 -translate-y-full' : 'bottom-0 translate-y-full';
  const arrowPos = isTop ? 'top-0' : 'bottom-0';

  return (
    <div
      {...props}
      class={cls('absolute select-none pointer-events-none z-[9999]', extraCls)}
      style={{ top, left, width, height }}
    >
      <div class={cls('absolute left-1/2 -m-1 w-2 h-2 bg-base-100 rotate-45', arrowPos)} />
      <div
        class={cls(
          'absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-center min-w-20 p-2 bg-base-100 text-base-content rounded shadow-md',
          contentPos
        )}
      >
        {comp(children)}
      </div>
    </div>
  );
};

const createTooltip = (eventOrTarget: Event | HTMLElement, content: Comp) => {
  const target = getTargetEl(eventOrTarget);
  if (!target) return;

  const el = target as any;
  if (el._tip) return;

  const disposes: Unsubscribe[] = [];

  const dispose = () => {
    for (const d of disposes) d();
    disposes.length = 0;
    delete el._tip;
  };

  const interval = setInterval(() => {
    if (!target.isConnected) {
      dispose();
    }
  }, 500);

  disposes.push(() => clearInterval(interval));
  disposes.push(onHtmlEvent(target, 'mouseleave', dispose));
  disposes.push(onHtmlEvent(0, 'click', dispose));

  const disposePortal = portal(<Tooltip target={target}>{content}</Tooltip>);
  el._tip = 1;

  disposes.push(disposePortal);
};

export const tooltipProps = (content: Comp) => {
  return content ?
      {
        onMouseOver: (event: Event) => {
          createTooltip(event, content);
        },
      }
    : {};
};
