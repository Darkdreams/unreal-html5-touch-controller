export class KeyController {
        constructor() {
                this.activeKeys = new Set();
                this.bindings = [];
                this._touchEventOpts = false;
                try {
                        const opts = Object.defineProperty({}, 'passive', {
                                get: () => {
                                        this._touchEventOpts = { passive: false };
                                }
                        });
                        window.addEventListener('test', null, opts);
                        window.removeEventListener('test', null, opts);
                } catch (_) {}
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

                el.addEventListener('touchstart', onStart, this._touchEventOpts);
                el.addEventListener('mousedown', onStart);
                el.addEventListener('touchend', onEnd, this._touchEventOpts);
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

                        el.removeEventListener('touchstart', binding.onStart, false);
                        el.removeEventListener('mousedown', binding.onStart);
                        el.removeEventListener('touchend', binding.onEnd, false);
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
                        el.removeEventListener('touchstart', onStart, false);
                        el.removeEventListener('mousedown', onStart);
                        el.removeEventListener('touchend', onEnd, false);
                        el.removeEventListener('mouseup', onEnd);
               }

                for (const key of this.activeKeys) {
                        this._fireKey('keyup', key);
                }
                this.activeKeys.clear();
                this.bindings = [];
        }
}
