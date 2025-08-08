# unreal-html5-touch-controller

A lightweight JavaScript module to enable mobile touch controls for Unreal Engine HTML5 builds.

## Features

- Left-side joystick for movement (WASD simulation)
- Right-side touch drag for camera control (mouse simulation)
- Customizable button bindings for UE key mappings

## Installation

```bash
npm install unreal-html5-touch-controller
```

## Usage

```js
import { UnrealHTML5TouchController } from 'unreal-html5-touch-controller';

const control = new UnrealHTML5TouchController({
  canvasId: 'canvas',
  joystickId: 'joystick-left'
});

// Custom actions
control.keyController.bindButton('#jump-btn', 'Space');
control.keyController.bindButton('#sprint-btn', 'ShiftLeft');
```

### Constructor options

`UnrealHTML5TouchController` and its internal helpers expose several options for
deep customization:

- `viewTouchRegion` *(default: `0.5`)* – portion of the screen reserved for
  camera controls. Pass a number between `0` and `1` or a custom function that
  receives an `x` coordinate and returns `true` when the view should handle the
  touch.
- `applyBodyStyle` *(default: `true`)* – when `true`, the module applies and
  later restores full-screen styles to the page body and canvas to prevent
  scrolling. Set to `false` if you prefer to manage styles yourself.
- `threshold` *(default: `15`)* – dead zone in pixels before joystick movement
  triggers WASD key events.

```js
const control = new UnrealHTML5TouchController({
  canvasId: 'canvas',
  joystickId: 'joystick-left',
  viewTouchRegion: (x) => x > window.innerWidth * 0.25,
  applyBodyStyle: false,
  threshold: 25,
});
```

### Cleanup

Clean up event listeners and styles when the controller is no longer needed:

```js
// Remove internal listeners and restore modified styles
control.destroy();

// Unbind a previously bound button
control.keyController.unbindButton('#sprint-btn');
```

`destroy()` will revert any canvas or body styles applied and release active
keys or touch identifiers. `unbindButton()` detaches the event handlers for a
specific DOM element and emits a final `keyup` for its key if it is pressed.

### Customization

These options let you tailor the controller to your project. Adjust the touch
region, disable automatic styling, or tweak joystick sensitivity to match your
game's needs.

## License

MIT
