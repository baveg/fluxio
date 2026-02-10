import { computeStyle, Css } from '../../html/css';
import { stopEvent } from '../../html/stopEvent';
import { Vector2 } from '../../types/Vector';
import { Vector4 } from '../../types/Vector';
import { Flux } from '../../flux/Flux';
import { onHtmlEvent } from '../../html/onEvent';
import { Unsubscribe } from '../../types/Unsubscribe';
import { getEventXY } from '../../html/getEventXY';
import { clamp } from '../../number/clamp';
import { toVoid } from '../../cast/toVoid';
import { useFlux } from '../hooks/useFlux';
import { portal } from './Portal';
import { comp } from '../utils/comp';
import { useMemo } from 'preact/hooks';
import { XIcon, CheckIcon, XCircleIcon, BanIcon } from 'lucide-react';
import { Button } from './Button';
import { useContext } from 'preact/hooks';
import { ComponentChildren, createContext } from 'preact';
import { Comp } from '../utils/comp';
import { clampVector, VECTOR2_ZERO, VECTOR4_MAX, VECTOR4_ZERO } from '../../number/vector';
import { mustExist } from '../../check/must';

export interface WindowFooterProps {
  yes?: (controller: WindowController) => void;
  no?: (controller: WindowController) => void;
  cancel?: (controller: WindowController) => void;
  confirm?: (controller: WindowController) => void;
}

export interface WindowProps extends WindowFooterProps {
  modal?: boolean;
  title?: string;
  content?: Comp;
  children?: ComponentChildren;
  controller?: WindowController;
  target?: HTMLElement | Event;
  pos?: Vector2;
  size?: Vector2;
  min?: Vector2 | Vector4;
  max?: Vector2 | Vector4;
  draggable?: boolean;
  resizable?: boolean;
}

export class WindowController {
  props: WindowProps = {};

  open$ = new Flux(false);
  mounted$ = new Flux(false);

  transform$ = new Flux<Vector4>(VECTOR4_ZERO);
  min: Vector4 = VECTOR4_ZERO;
  max: Vector4 = VECTOR4_ZERO;

  draggable = false;
  resizable = false;
  response$ = new Flux('');

  readonly offs: Unsubscribe[] = [];
  unmount: Unsubscribe = toVoid;

  private dragging = false;
  private resizeDir: Vector4 | null = null;
  private start = {
    event: null as Event | null,
    eventXY: VECTOR2_ZERO,
    transform: VECTOR4_ZERO,
  };

  constructor(props: WindowProps) {
    console.debug('WindowController constructor', props);
    this.init(props);
  }

  init(props: WindowProps) {
    console.debug('WindowController init', props);

    if (this.props === props) return this;
    this.props = props;

    const { target, pos, size, min, max, draggable, resizable } = props;

    let transform = VECTOR4_ZERO;

    // Get window size (use provided size or default to auto)
    const w = size?.[0] || 0;
    const h = size?.[1] || 0;

    let x: number;
    let y: number;

    const targetEl = target instanceof Event ? target.target : target;

    if (targetEl instanceof HTMLElement) {
      // Center window on target position
      const rect = targetEl.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      x = targetCenterX - w / 2;
      y = targetCenterY - h / 2;
    } else {
      // Center window on screen (for modals without target)
      x = (window.innerWidth - w) / 2;
      y = (window.innerHeight - h) / 2;
    }

    transform = [x, y, w, h];

    // Set min/max constraints
    const minX = 0;
    const minY = 0;
    const maxX = w > 0 ? window.innerWidth - w : window.innerWidth;
    const maxY = h > 0 ? window.innerHeight - h : window.innerHeight;

    this.min =
      min ?
        min.length === 2 ?
          [minX, minY, min[0], min[1]]
        : min
      : [minX, minY, 0, 0];
    this.max =
      max ?
        max.length === 2 ?
          [maxX, maxY, max[0], max[1]]
        : max
      : [maxX, maxY, VECTOR4_MAX[2], VECTOR4_MAX[3]];

    console.debug('WindowController transform', transform, this.min, this.max);

    // Clamp position to keep window on screen
    transform = clampVector(transform, this.min, this.max);
    this.transform$.set(transform);

    this.draggable = draggable !== undefined ? draggable : true;
    this.resizable = resizable || false;

    setTimeout(this.open, 10);

    return this;
  }

  private startDrag(event: Event) {
    if (!this.draggable) return;
    stopEvent(event);
    this.dragging = true;
    const eventXY = mustExist(getEventXY(event), 'startDrag eventXY');
    const transform = this.transform$.get();
    this.start = { event, eventXY, transform };
    this.bindEvents();
  }

  private startResize(event: Event, dir: Vector4) {
    if (!this.resizable) return;
    stopEvent(event);
    this.dragging = false;
    this.resizeDir = dir;
    const eventXY = mustExist(getEventXY(event), 'startResize eventXY');
    const transform = this.transform$.get();
    this.start = { event, eventXY, transform };
    this.bindEvents();
  }

  private bindEvents() {
    this.offs.push(onHtmlEvent(0, 'mousemove', this.onMove), onHtmlEvent(0, 'mouseup', this.onUp));
  }

  private onMove = (event: Event) => {
    const {
      eventXY: [startEventX, startEventY],
      transform: [startX, startY, startW, startH],
    } = this.start;
    const eventXY = mustExist(getEventXY(event), 'onMouseMove eventXY');
    const [eventX, eventY] = eventXY;
    const dx = eventX - startEventX;
    const dy = eventY - startEventY;

    if (this.dragging) {
      this.transform$.set([startX + dx, startY + dy, startW, startH]);
    } else if (this.resizeDir) {
      const [xDir, yDir, wDir, hDir] = this.resizeDir;

      const x = startX + dx * xDir;
      const y = startY + dy * yDir;
      const w = clamp(startW + dx * wDir, this.min[0], this.max[0] || Number.MAX_VALUE);
      const h = clamp(startH + dy * hDir, this.min[1], this.max[1] || Number.MAX_VALUE);

      this.transform$.set([x, y, w, h]);
    }
  };

  private onUp = () => {
    this.dragging = false;
    this.resizeDir = null;
    for (const off of this.offs) off();
    this.offs.length = 0;
  };

  open = () => {
    this.mounted$.set(true);
    setTimeout(() => {
      if (this.mounted$.get() === true) {
        this.open$.set(true);
      }
    }, 10);
  };

  close = () => {
    console.debug('WindowController close');
    if (!this.response$.get()) {
      this.setResponse('cancel');
      return;
    }
    this.open$.set(false);
    setTimeout(() => {
      console.debug('WindowController close end');
      if (this.open$.get() === false) {
        console.debug('WindowController close unmount');
        this.onUp();
        this.unmount();
      }
    }, 500);
  };

  setResponse(response: string) {
    console.debug('WindowController setResponse', response);
    if (this.response$.get()) return;
    this.response$.set(response);
    this.close();
    const method = (this.props as any)[response];
    if (method) method(this);
  }

  handle(response: string) {
    return () => {
      this.setResponse(response);
    };
  }

  drag = (e: Event) => this.startDrag(e);

  resize(dir: Vector4) {
    return (e: Event) => this.startResize(e, dir);
  }
}

export const WindowContext = createContext<WindowController | null>(null);
export const useWindowController = () => useContext(WindowContext)!;

const c = Css('Window', {
  '': {
    position: 'fixed',
    xy: 0,
    opacity: 0,
    transition: 0.3,
  },
  '-modal': {
    wh: '100%',
    bg: 'mask',
    opacity: 0,
    transition: 0.3,
  },
  Box: {
    col: 1,
    position: 'absolute',
    elevation: 4,
    rounded: 7,
    bg: 'bg',
    fg: 'fg',
    resize: 'none',
    scale: 0.5,
    opacity: 0,
    transition: 0.1,
    overflow: 'hidden',
  },
  Header: {
    row: ['center', 'between'],
    pl: 8,
    bg: 'header',
    fg: 'headerFg',
    cursor: 'move',
  },
  Close: {
    fg: 'headerFg',
  },
  Title: {
    bold: 1,
    fontSize: 1.2,
  },
  Content: {
    col: 1,
    flex: 1,
    overflow: 'auto',
    p: 8,
  },
  Footer: {
    row: ['center', 'end'],
    bg: 'bg2',
  },
  'Footer .Button': {
    flex: 1,
    m: 0,
    rounded: 0,
    row: ['center', 'center'],
    h: 36,
  },
  'Footer .ButtonContent': {
    flex: 0,
  },
  '-open': {
    opacity: 1,
  },
  '-open &Box': {
    scale: 1,
    opacity: 1,
  },
});

type EdgeStyle = {
  cursor: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
};

const S = 8; // edge hit size
const H = 0.5;

// [name, [xDir, yDir, wDir, hDir], [top, left, cursor]]
type EdgeDir = Vector4<0 | 1 | -1>;
type EdgeXY = Vector2<number | string>;
const EDGES: [string, EdgeDir, EdgeXY, string][] = [
  ['n', [0, 1, 0, -1], [0, H], 'ns-resize'],
  ['s', [0, 0, 0, 1], ['auto', H], 'ns-resize'],
  ['e', [0, 0, 1, 0], [H, 'auto'], 'ew-resize'],
  ['w', [1, 0, -1, 0], [H, 0], 'ew-resize'],
  ['ne', [0, 1, 1, -1], [0, 'auto'], 'nesw-resize'],
  ['nw', [1, 1, -1, -1], [0, 0], 'nwse-resize'],
  ['se', [0, 0, 1, 1], ['auto', 'auto'], 'nwse-resize'],
  ['sw', [1, 0, -1, 1], ['auto', 0], 'nesw-resize'],
];

const edges: [string, Vector4, EdgeStyle][] = EDGES.map(([name, dir, [top, left], cursor]) => {
  const isCorner = name.length === 2;
  const isVertical = name === 'n' || name === 's';
  const isHorizontal = name === 'e' || name === 'w';

  return [
    name,
    dir,
    {
      cursor,
      position: 'absolute',
      top:
        top === 'auto' ? 'auto'
        : typeof top === 'number' ? `${top * 100}%`
        : top,
      left:
        left === 'auto' ? 'auto'
        : typeof left === 'number' ? `${left * 100}%`
        : left,
      right: left === 'auto' ? '0' : undefined,
      bottom: top === 'auto' ? '0' : undefined,
      width:
        isCorner ? `${S}px`
        : isVertical ? `calc(100% - ${S * 2}px)`
        : `${S}px`,
      height:
        isCorner ? `${S}px`
        : isHorizontal ? `calc(100% - ${S * 2}px)`
        : `${S}px`,
      marginTop: isCorner || isVertical ? `-${S / 2}px` : undefined,
      marginLeft: isCorner || isHorizontal ? `-${S / 2}px` : undefined,
    } as EdgeStyle,
  ];
});

export const WindowFooter = ({ yes, no, cancel, confirm }: WindowFooterProps) => {
  const controller = useWindowController();
  const hasButtons = yes || no || cancel || confirm;
  if (!hasButtons) return null;

  return (
    <div {...c('Footer')}>
      {yes && (
        <Button color="success" icon={CheckIcon} title="Oui" onClick={controller.handle('yes')} />
      )}
      {no && (
        <Button color="warn" icon={XCircleIcon} title="Non" onClick={controller.handle('no')} />
      )}
      {cancel && (
        <Button
          color="error"
          icon={BanIcon}
          title="Annuler"
          onClick={controller.handle('cancel')}
        />
      )}
      {confirm && (
        <Button
          color="success"
          icon={CheckIcon}
          title="Valider"
          onClick={controller.handle('confirm')}
        />
      )}
    </div>
  );
};

const WindowRender = (props: WindowProps) => {
  const controller = useMemo(
    () => props.controller?.init(props) || new WindowController(props),
    [props.controller]
  );

  const { modal, draggable, resizable, title, content, children, yes, no, cancel, confirm } = props;

  const mounted = useFlux(controller.mounted$);
  const open = useFlux(controller.open$);
  const [x, y, w, h] = useFlux(controller.transform$);

  const boxStyle = computeStyle({ x, y, w, h, resize: resizable ? 'both' : 'none' });

  return (
    <WindowContext value={controller}>
      <div
        {...c('', modal && '-modal', open && '-open', mounted && '-mounted')}
        onClick={controller.close}
      >
        <div {...c('Box')} style={boxStyle as any} onClick={stopEvent}>
          <div {...c('Header', draggable && '-draggable')} onMouseDown={controller.drag}>
            {title && <div {...c('Title')}>{title}</div>}
            <Button {...c('Close')} icon={XIcon} onClick={controller.close} />
          </div>
          <div {...c('Content')}>
            {open ? comp(content) : null}
            {open ? children : null}
          </div>
          <WindowFooter yes={yes} no={no} cancel={cancel} confirm={confirm} />
          {resizable &&
            edges.map(([name, dir, style]) => (
              <div key={name} style={style as any} onMouseDown={controller.resize(dir)} />
            ))}
        </div>
      </div>
    </WindowContext>
  );
};

export const createWindow = (props: WindowProps) => {
  console.debug('createWindow', props);
  const controller = (props.controller || new WindowController(props)).init(props);
  controller.unmount = portal(<WindowRender {...props} controller={controller} />);
  return controller;
};
