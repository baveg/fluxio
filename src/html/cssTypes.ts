type CssNumber = string | number;

export interface CssStyle {
  // Display & Visibility
  display?:
    | 'none'
    | 'block'
    | 'inline'
    | 'inline-block'
    | 'flex'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid'
    | 'table'
    | 'table-row'
    | 'table-cell'
    | 'contents';
  visibility?: 'visible' | 'hidden' | 'collapse';
  opacity?: CssNumber;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Position & Layout
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: CssNumber;
  right?: CssNumber;
  bottom?: CssNumber;
  left?: CssNumber;
  zIndex?: CssNumber;

  // Box Model - Dimensions
  width?: CssNumber;
  height?: CssNumber;
  minWidth?: CssNumber;
  minHeight?: CssNumber;
  maxWidth?: CssNumber;
  maxHeight?: CssNumber;

  // Box Model - Margin
  margin?: CssNumber;
  marginTop?: CssNumber;
  marginRight?: CssNumber;
  marginBottom?: CssNumber;
  marginLeft?: CssNumber;

  // Box Model - Padding
  padding?: CssNumber;
  paddingTop?: CssNumber;
  paddingRight?: CssNumber;
  paddingBottom?: CssNumber;
  paddingLeft?: CssNumber;

  // Box Model - Border
  border?: CssNumber;
  borderTop?: CssNumber;
  borderRight?: CssNumber;
  borderBottom?: CssNumber;
  borderLeft?: CssNumber;
  borderWidth?: CssNumber;
  borderStyle?:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
  borderColor?: string;
  borderRadius?: CssNumber;
  borderTopLeftRadius?: CssNumber;
  borderTopRightRadius?: CssNumber;
  borderBottomLeftRadius?: CssNumber;
  borderBottomRightRadius?: CssNumber;

  // Box Model - Box Sizing
  boxSizing?: 'content-box' | 'border-box';
  boxShadow?: string;

  // Flexbox Container
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexFlow?: CssNumber;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'baseline'
    | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  gap?: CssNumber;
  rowGap?: CssNumber;
  columnGap?: CssNumber;

  // Flexbox Item
  flex?: CssNumber;
  flexGrow?: CssNumber;
  flexShrink?: CssNumber;
  flexBasis?: string;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  order?: CssNumber;

  // Grid Container
  gridTemplateColumns?: CssNumber;
  gridTemplateRows?: CssNumber;
  gridTemplateAreas?: CssNumber;
  gridAutoColumns?: CssNumber;
  gridAutoRows?: CssNumber;
  gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  justifyItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  placeItems?: CssNumber;

  // Grid Item
  gridColumn?: CssNumber;
  gridRow?: CssNumber;
  gridArea?: CssNumber;
  gridColumnStart?: CssNumber;
  gridColumnEnd?: CssNumber;
  gridRowStart?: CssNumber;
  gridRowEnd?: CssNumber;
  justifySelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
  placeSelf?: CssNumber;

  // Background
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: CssNumber;
  backgroundPositionX?: 'left' | 'center' | 'right' | CssNumber;
  backgroundPositionY?: 'top' | 'center' | 'bottom' | CssNumber;
  backgroundSize?: 'auto' | 'cover' | 'contain' | '100% 100%' | CssNumber;
  backgroundRepeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';
  backgroundAttachment?: 'scroll' | 'fixed' | 'local';
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box' | 'text';
  backgroundOrigin?: 'border-box' | 'padding-box' | 'content-box';

  // Typography - Font
  color?: string;
  fontFamily?: string;
  fontSize?: CssNumber;
  fontWeight?:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 'light'
    | 'regular'
    | 'medium'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | string
    | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontVariant?: 'normal' | 'small-caps';
  lineHeight?: CssNumber;
  letterSpacing?: CssNumber;
  wordSpacing?: CssNumber;

  // Typography - Text
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  textAlignLast?: 'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  textDecoration?: string;
  textDecorationLine?: 'none' | 'underline' | 'overline' | 'line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
  textDecorationColor?: string;
  textIndent?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textOverflow?: 'clip' | 'ellipsis';
  textShadow?: string;
  verticalAlign?:
    | 'baseline'
    | 'sub'
    | 'super'
    | 'top'
    | 'text-top'
    | 'middle'
    | 'bottom'
    | 'text-bottom'
    | string;

  // Typography - White Space & Word Breaking
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  wordWrap?: 'normal' | 'break-word';
  overflowWrap?: 'normal' | 'break-word' | 'anywhere';
  hyphens?: 'none' | 'manual' | 'auto';

  // Transform & Transition
  transform?: string;
  transformOrigin?: CssNumber;
  transformStyle?: 'flat' | 'preserve-3d';
  transition?: CssNumber;
  transitionProperty?: string;
  transitionDuration?: CssNumber;
  transitionTimingFunction?: string;
  transitionDelay?: CssNumber;

  // Animation
  animation?: string;
  animationName?: string;
  animationDuration?: CssNumber;
  animationTimingFunction?:
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | string;
  animationDelay?: CssNumber;
  animationIterationCount?: 'infinite' | CssNumber;
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  animationPlayState?: 'running' | 'paused';

  // List
  listStyle?: string;
  listStyleType?: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | string;
  listStylePosition?: 'inside' | 'outside';
  listStyleImage?: string;

  // Table
  tableLayout?: 'auto' | 'fixed';
  borderCollapse?: 'collapse' | 'separate';
  borderSpacing?: CssNumber;
  captionSide?: 'top' | 'bottom';
  emptyCells?: 'show' | 'hide';

  // Cursor & Pointer Events
  cursor?:
    | 'auto'
    | 'default'
    | 'pointer'
    | 'text'
    | 'wait'
    | 'move'
    | 'not-allowed'
    | 'help'
    | 'grab'
    | 'grabbing'
    | 'crosshair'
    | 'zoom-in'
    | 'zoom-out'
    | string;
  pointerEvents?:
    | 'auto'
    | 'none'
    | 'visiblePainted'
    | 'visibleFill'
    | 'visibleStroke'
    | 'visible'
    | 'all';
  userSelect?: 'auto' | 'none' | 'text' | 'contain' | 'all';
  touchAction?:
    | 'auto'
    | 'none'
    | 'pan-x'
    | 'pan-y'
    | 'pan-left'
    | 'pan-right'
    | 'pan-up'
    | 'pan-down'
    | 'pinch-zoom'
    | 'manipulation'
    | string;

  // Content & Counters
  content?: string;
  counterIncrement?: string;
  counterReset?: string;
  quotes?: string;

  // Clipping & Masking
  clip?: string;
  clipPath?: string;
  mask?: string;
  maskImage?: string;
  maskMode?: string;
  maskRepeat?: string;
  maskPosition?: string;
  maskClip?: string;
  maskOrigin?: string;
  maskSize?: string;

  // Filter & Backdrop
  filter?: string;
  backdropFilter?: string;

  // Object Fit & Position (for images/video)
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;

  // Scrolling
  scrollBehavior?: 'auto' | 'smooth';
  overscrollBehavior?: 'auto' | 'contain' | 'none';
  overscrollBehaviorX?: 'auto' | 'contain' | 'none';
  overscrollBehaviorY?: 'auto' | 'contain' | 'none';

  // Writing Mode
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
  direction?: 'ltr' | 'rtl';
  unicodeBidi?: 'normal' | 'embed' | 'bidi-override' | 'isolate' | 'isolate-override' | 'plaintext';

  // Misc
  outline?: string;
  outlineWidth?: string;
  outlineStyle?: string;
  outlineColor?: string;
  outlineOffset?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  aspectRatio?: string;
  mixBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | string;
  isolation?: 'auto' | 'isolate';
  willChange?: string;
  contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | string;

  // WebKit
  '-webkit-text-fill-color'?: string;
  '-webkit-box-shadow'?: string;
  caretColor?: string;
}

export type StyleTransform =
  | string
  | {
      rotate?: CssNumber; // 0deg
      scale?: CssNumber;
      translateX?: CssNumber;
      translateY?: CssNumber;
    };

export type StyleAnim =
  | string
  | {
      name?: CssStyle['animationName'];
      count?: CssStyle['animationIterationCount'] | number;
      timing?: CssStyle['animationTimingFunction'];
      duration?: CssStyle['animationDuration'] | number;
      keyframes?: Record<'from' | 'to' | string, { transform: StyleTransform }>;
    };

export type StyleFlexDirection = CssStyle['flexDirection'];
export type StyleFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type StyleFlexJustify =
  | 'auto'
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'space-evenly'
  | 'baseline'
  | 'stretch';
