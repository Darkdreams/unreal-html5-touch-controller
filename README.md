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

## License

MIT
