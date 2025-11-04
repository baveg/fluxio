# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Fluxio is a lightweight, functional utility library for TypeScript that provides reactive state management, CSS-in-JS capabilities, and comprehensive utility functions. It's designed as a standalone NPM package with zero runtime dependencies and full tree-shaking support.

## Development Commands

- `npm run build` - Build the library using tsup (outputs CommonJS and ES Modules to `dist/`)
- `npm run prepublishOnly` - Automatically builds before publishing to npm

## Build Configuration

**Build Tool**: tsup (configured in `tsup.config.ts`)

- **Entry Point**: `src/index.ts`
- **Output Formats**: CommonJS (`.js`) and ES Modules (`.mjs`)
- **TypeScript Declarations**: Generated (`.d.ts` files)
- **Tree-shaking**: Enabled for optimal bundle size
- **Source Maps**: Included

**Package Exports**:
```json
{
  "main": "dist/index.js",        // CommonJS
  "module": "dist/index.mjs",     // ES Module
  "types": "dist/index.d.ts"      // TypeScript declarations
}
```

## Library Architecture

### Module Organization

The library is organized into 19 specialized modules, all exported from `src/index.ts`:

**Core Modules**:

1. **flux/** - Reactive state management with observer pattern
   - `Flux<T>` - Core reactive state container
   - `Pipe<T, U>` - Derived reactive state with bidirectional transformations
   - `fluxStored` - Persistent state with localStorage sync
   - `combineFlux` - Combine multiple Flux instances
   - `fluxDictionary` - Dictionary-based reactive collections
   - `fluxEvent` - Event-based reactive streams
   - `fluxTimer` - Time-based reactive updates

2. **html/css.ts** - CSS-in-JS system with utility functions
   - `Css()` - Type-safe CSS-in-JS with powerful utilities
   - `setCss()` - Dynamic stylesheet injection
   - Utility functions: fRow, fCol, fCenter, elevation, rounded, transitions, transforms, animations

3. **html/** - DOM manipulation and utilities
   - Element creation: createEl, setEl, htmlToEl
   - Event handling: onEvent, stopEvent, getEventXY
   - Resource loading: addCssFile, addJsFile, waitScriptLoaded
   - UI helpers: overlay, autoScrollEnd, setSiteTitle
   - Class management: cls, clsx
   - Styling: style, attributes

**Utility Modules**:

4. **array/** - Array operations with circular indexing support
5. **storage/** - localStorage abstraction with validation
6. **req/** - Universal HTTP client with retry logic
7. **async/** - Async utilities (debounce, throttle, sleep, retry, withTimeout)
8. **string/** - String manipulation and formatting
9. **color/** - Color space conversions and manipulation
10. **datetime/** - Date/time formatting and parsing
11. **number/** - Number utilities and formatting
12. **object/** - Deep operations, merging, cloning
13. **check/** - Comprehensive type guards
14. **cast/** - Safe type conversions
15. **url/** - URL construction and parsing
16. **error/** - Error handling utilities
17. **logger/** - Tagged logger factory with counting
18. **types/** - Core type definitions (Dictionary<T>, XY)
19. **glb.ts** - Cross-platform global object detection

### File Organization Pattern

- **One function per file**: Each utility function lives in its own file (e.g., `src/array/normalizeIndex.ts`)
- **Barrel exports**: Each module has an `index.ts` that re-exports all functions
- **Consistent naming**: camelCase for functions, PascalCase for classes
- **Modular structure**: Import only what you need for optimal tree-shaking

### Core Patterns

#### 1. Reactive State Management Pattern

The `Flux<T>` class implements the Observer pattern for reactive state:

```typescript
// Create reactive state
const count$ = flux(0);

// Subscribe to changes
count$.on((value) => console.log('Count:', value));

// Update state
count$.set(1);                    // Set absolute value
count$.set(prev => prev + 1);    // Update based on previous

// Advanced operations
count$.map(x => x * 2);          // Transform values
count$.filter(x => x > 0);       // Filter updates
count$.debounce(300);            // Debounce changes
```

**Key Flux Features**:
- **Transformations**: map, mapAsync, filter, scan
- **Timing**: debounce, throttle, delay
- **Persistence**: fluxStored for localStorage sync
- **Combination**: combineFlux for merging streams
- **Async operations**: wait() method for conditional resolution
- **Bidirectional pipes**: Pipe class for two-way data binding

**Bidirectional Pipe Example**:
```typescript
const celsius$ = flux(0);
const fahrenheit$ = celsius$.map(
  c => c * 9/5 + 32,    // Forward transform
  f => (f - 32) * 5/9   // Reverse transform
);

fahrenheit$.set(100);   // Updates celsius$ to ~37.78
```

#### 2. CSS-in-JS Pattern

Fluxio provides a powerful CSS-in-JS system:

```typescript
const css = Css('MyComponent', {
  '': {
    fCol: 1,              // display: flex; flex-direction: column
    p: 2,                 // padding: 2rem
    bg: 'primary',        // background-color: var(--primary-color)
    elevation: 2,         // box-shadow with depth
    rounded: 3,           // border-radius: 0.6rem
    transition: 0.2       // transition: all 0.2s ease
  },
  'Header': {
    fRow: ['center', 'space-between'],
    fontSize: 1.5,
    bold: 1
  }
});

// Returns class name objects
css()          // { class: 'MyComponent' }
css('Header')  // { class: 'MyComponentHeader' }
```

**CSS Utility Functions**:
- **Layout**: x, y, xy, l, t, r, b, inset, w, h, wh, wMax, hMax, wMin, hMin
- **Flexbox**: fRow, fCol, fCenter with alignment/justification
- **Spacing**: m, mt, mb, ml, mr, mx, my (margins); p, pt, pb, pl, pr, px, py (padding)
- **Visual**: bg, fg, bColor, elevation, rounded, bold, fontSize
- **Background**: bgUrl, bgMode, itemFit
- **Transform**: rotate, scale, translate (with X/Y variants)
- **Animation**: anim with keyframe support
- **Transitions**: transition property

**Dynamic CSS Injection**:
CSS is automatically injected into `<head>` as `<style>` elements:
```typescript
// First call creates <style> element
const css = Css('Button', { '': { bg: 'blue' } });

// Update existing CSS
setCss('Button', { '': { bg: 'red' } }, 10, true);
```

#### 3. Storage Pattern

localStorage abstraction with validation:

```typescript
const storage = new Storage();

// Get with factory and validation
const config = storage.get(
  'config',
  () => ({ theme: 'dark' }),           // Factory function
  (value) => value.theme !== undefined, // Validator
  (value) => ({ ...value, theme: value.theme || 'light' }) // Cleaner
);

// Set value
storage.set('config', { theme: 'light' });

// Clear storage
storage.clear();
```

Features:
- JSON serialization/deserialization
- In-memory fallback when localStorage unavailable
- Prefix support for namespacing

#### 4. HTTP Request Pattern

Universal HTTP client supporting fetch and XHR:

```typescript
const data = await req({
  url: '/api/users',
  method: 'POST',
  json: { name: 'John' },
  resType: 'json',
  retry: 3,                    // Retry failed requests
  timeout: 5000,              // 5 second timeout
  onError: (error) => console.error(error),
  cast: (ctx) => ctx.data.users,  // Transform response
  after: (ctx) => console.log('Done')
});
```

Features:
- Automatic retry with exponential backoff
- Request/response transformation pipelines
- FormData and JSON body support
- Progress tracking via XHR
- Error handling with context preservation

#### 5. Circular Array Indexing

Array utilities support circular/wrap-around indexing:

```typescript
// Array: [0, 1, 2, 3]
normalizeIndex(-1, 4)  // 3 (wraps to end)
normalizeIndex(5, 4)   // 1 (wraps to start)

// Used throughout array utilities
moveIndex([1, 2, 3], -1, 0)  // Moves last item to first position
```

Functions with circular indexing:
- `normalizeIndex` - Convert any index to valid array index
- `moveIndex` - Move item with wrap-around support
- `setItemIndex` - Update item at any index (including negative)
- Supports negative indices and overflow handling

#### 6. Logger Pattern

Tagged logger factory with automatic instance counting:

```typescript
const log = logger('api');    // Creates [api]
const log2 = logger('api');   // Creates [api2]
const log3 = logger('api');   // Creates [api3]

log.d('Debug message');       // [api] Debug message
log.i('Info message');        // [api] Info message
log.w('Warning');            // [api] ⚠️ Warning
log.e('Error');              // [api] ❌ Error
```

Features:
- Automatic instance counting for same tags
- Icons for warnings and errors
- Custom log implementation support
- Void logger for testing

## Development Patterns

### Adding New Utility Functions

1. Create function file in appropriate module directory:
   ```typescript
   // src/array/myFunction.ts
   export const myFunction = (arr: any[], index: number) => {
     // Implementation
   };
   ```

2. Export from module's index.ts:
   ```typescript
   // src/array/index.ts
   export * from './myFunction';
   ```

3. Re-export from root index.ts:
   ```typescript
   // src/index.ts
   export * from './array';
   ```

### TypeScript Conventions

- Use generic types for flexibility (e.g., `Flux<T>`, `Dictionary<T>`)
- Provide comprehensive type guards in check/ module
- Use JSDoc comments on public APIs
- Include usage examples in complex functions

### Functional Approach

- Write pure functions where possible
- Return new arrays/objects (immutability)
- Avoid side effects except where necessary (DOM, storage, HTTP)
- Support function composition

## Build & Publishing

**Before Publishing**:
1. Update version in `package.json`
2. Run `npm run build` to ensure clean build
3. Test the build in a separate project by installing locally

**Publishing to npm**:
```bash
npm publish
```
The `prepublishOnly` script automatically runs the build.

## Browser/Node.js Compatibility

The library works in both environments:
- Uses `glb` for global object detection (window/global)
- Storage class checks for localStorage availability
- HTTP client supports both fetch (modern) and XHR (legacy)
- Automatic fallbacks for missing APIs

## Dependencies

- **Runtime Dependencies**: Zero (completely standalone)
- **Dev Dependencies**: tsup (build tool), typescript (compiler)

This keeps the library lightweight and avoids version conflicts.

## Key Design Principles

1. **Modularity** - Each utility in its own file, organized by category
2. **Type Safety** - Comprehensive TypeScript support throughout
3. **Functional** - Pure functions, immutability, composability
4. **Reactive** - Flux-based state management at core
5. **Lightweight** - Zero dependencies, tree-shakeable
6. **Flexible** - Works in browser and Node.js environments
7. **Developer Experience** - Clear APIs, sensible defaults, good documentation
