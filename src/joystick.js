export class JoystickControl {
        constructor(id, { threshold = 15 } = {}) {
                this.el = document.getElementById(id);
                this.threshold = threshold;

                if (!this.el) {
                        console.warn(`[JoystickControl] Element not found for id: ${id}`);
                        return;
                };

                this.origin = null;
                this.pressed = new Set();
                this._bind();
        }

        _bind() {
                this._onStart = (e) => {
                        if (e.touches.length === 1) {
                                this.origin = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        }
                        e.preventDefault();
                };

                this._onMove = (e) => {
                        if (!this.origin || e.touches.length !== 1) return;
                        const dx = e.touches[0].clientX - this.origin.x;
                        const dy = e.touches[0].clientY - this.origin.y;
                        this._updateKeys(dx, dy);
                        e.preventDefault();
                };

                this._onEnd = (e) => {
                        this.origin = null;
                        this._updateKeys(0, 0);
                        e.preventDefault();
                };

                this.el.addEventListener('touchstart', this._onStart, { passive: false });
                this.el.addEventListener('touchmove', this._onMove, { passive: false });
                this.el.addEventListener('touchend', this._onEnd, { passive: false });
        }

	_fire(type, key) {
		const evt = new KeyboardEvent(type, {
			key: key.toLowerCase(),
			code: "Key" + key.toUpperCase(),
			bubbles: true
		});
		document.dispatchEvent(evt);
	}

	_updateKeys(dx, dy) {
                const threshold = this.threshold;
                const dirs = new Set();

                if (dy < -threshold) dirs.add("w");
                if (dy > threshold) dirs.add("s");
                if (dx < -threshold) dirs.add("a");
                if (dx > threshold) dirs.add("d");

		for (const key of this.pressed) {
			if (!dirs.has(key)) {
				this._fire("keyup", key);
				this.pressed.delete(key);
			}
		}

		for (const key of dirs) {
			if (!this.pressed.has(key)) {
				this._fire("keydown", key);
				this.pressed.add(key);
			}
		}

                if (dirs.size === 0) {
                        for (const key of this.pressed) {
                                this._fire("keyup", key);
                        }
                        this.pressed.clear();
                }
        }

        destroy() {
                if (!this.el) return;

                this.el.removeEventListener('touchstart', this._onStart);
                this.el.removeEventListener('touchmove', this._onMove);
                this.el.removeEventListener('touchend', this._onEnd);

                for (const key of this.pressed) {
                        this._fire('keyup', key);
                }
                this.pressed.clear();
        }
}
