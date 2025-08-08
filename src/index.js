import { JoystickControl } from "./joystick.js";
import { CanvasViewControl } from "./canvasView.js";
import { KeyController } from "./keyboard.js";

export class UnrealHTML5TouchController {
        constructor({
                canvasId = "canvas",
                joystickId = "joystick-left",
                viewTouchRegion = 0.5,
                customKeys
        }) {
                this.keyController = new KeyController();
                this.viewControl = new CanvasViewControl(canvasId, viewTouchRegion);
                this.joystickControl = new JoystickControl(joystickId);

		if (!customKeys) return;

		const bindings = Array.isArray(customKeys)
			? customKeys
			: (typeof customKeys === 'object' && customKeys.dom && customKeys.key)
				? [customKeys]
				: (() => {
					console.warn('[UnrealHTML5TouchController] Invalid `customKeys`:', customKeys);
					return [];
				})();

                for (const { dom, key } of bindings) {
                        if (dom && key) {
                                this.keyController.bindButton(dom, key);
                        } else {
                                console.warn('[UnrealHTML5TouchController] Skipped invalid customKey entry:', { dom, key });
                        }
                }
        }

        destroy() {
                this.joystickControl?.destroy?.();
                this.viewControl?.destroy?.();
                this.keyController?.destroy?.();
        }
}
