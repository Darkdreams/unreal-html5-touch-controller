export class KeyController {
	constructor() {
		this.activeKeys = new Set();
		this.bindings = [];
	}

        bindButton(domSelector, keyCode) {
                const el = typeof domSelector === 'string'
                ? document.querySelector(domSelector)
                : domSelector;

		    if (!el) return;

                const onStart = (e) => {
                        if (!this.activeKeys.has(keyCode)) {
                                this._fireKey('keydown', keyCode);
                                this.activeKeys.add(keyCode);
                        }
                        e.preventDefault();
                };

                const onEnd = (e) => {
                        if (this.activeKeys.has(keyCode)) {
                                this._fireKey('keyup', keyCode);
                                this.activeKeys.delete(keyCode);
                        }
                        e.preventDefault();
                };

                el.addEventListener('touchstart', onStart, { passive: false });
                el.addEventListener('mousedown', onStart);
                el.addEventListener('touchend', onEnd, { passive: false });
                el.addEventListener('mouseup', onEnd);

                this.bindings.push({ el, keyCode, onStart, onEnd });
        }
        unbindButton(domSelector) {
                const el = typeof domSelector === 'string'
                ? document.querySelector(domSelector)
                : domSelector;

                if (!el) return;

                this.bindings = this.bindings.filter((binding) => {
                        if (binding.el !== el) return true;

                        el.removeEventListener('touchstart', binding.onStart, { passive: false });
                        el.removeEventListener('mousedown', binding.onStart);
                        el.removeEventListener('touchend', binding.onEnd, { passive: false });
                        el.removeEventListener('mouseup', binding.onEnd);

                        if (this.activeKeys.has(binding.keyCode)) {
                                this._fireKey('keyup', binding.keyCode);
                                this.activeKeys.delete(binding.keyCode);
                        }

                        return false;
                });
        }

	_fireKey(type, code) {
		const evt = new KeyboardEvent(type, {
			key: this._keyFromCode(code),
			code,
			bubbles: true
		});

		const canvas = document.getElementById('canvas');
		if (canvas) {
			canvas.dispatchEvent(evt);
			canvas.focus();
		}

		window.dispatchEvent(evt);
		document.dispatchEvent(evt);
	}

	_keyFromCode(code) {
		if (code.startsWith('Key')) return code.slice(3).toLowerCase();
		if (code === 'Space') return ' ';
                if (code === 'ShiftLeft') return 'Shift';
                return code.toLowerCase();
        }

        destroy() {
                for (const { el, onStart, onEnd, keyCode } of this.bindings) {
                        el.removeEventListener('touchstart', onStart);
                        el.removeEventListener('mousedown', onStart);
                        el.removeEventListener('touchend', onEnd);
                        el.removeEventListener('mouseup', onEnd);
                }

                for (const key of this.activeKeys) {
                        this._fireKey('keyup', key);
                }
                this.activeKeys.clear();
                this.bindings = [];
        }
}
