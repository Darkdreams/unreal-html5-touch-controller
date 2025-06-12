import { JoystickControl } from './joystick.js';
import { CanvasViewControl } from './canvasView.js';
import { KeyController } from './keyboard.js';

export class UnrealHTML5TouchController {
  constructor({ canvasId = 'canvas', joystickId = 'joystick-left' }) {
    this.keyController = new KeyController();
    this.viewControl = new CanvasViewControl(canvasId);
    this.joystickControl = new JoystickControl(joystickId, this.keyController.updateKeys.bind(this.keyController));
  }
}
