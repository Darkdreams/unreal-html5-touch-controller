export class KeyController {
	constructor() {
		this.activeKeys = new Set();
		this.bindings = [];
	}

	bindButton(domSelector, keyCode) {
		const el =
			typeof domSelector === "string"
				? document.querySelector(domSelector)
				: domSelector;

		if (!el) return;

		const onStart = (e) => {
			if (!this.activeKeys.has(keyCode)) {
				this._fireKey("keydown", keyCode);
				this.activeKeys.add(keyCode);
			}
			e.preventDefault();
		};

		const onEnd = (e) => {
			if (this.activeKeys.has(keyCode)) {
				this._fireKey("keyup", keyCode);
				this.activeKeys.delete(keyCode);
			}
			e.preventDefault();
		};

		el.addEventListener("touchstart", onStart, { passive: false });
		el.addEventListener("mousedown", onStart);
		el.addEventListener("touchend", onEnd, { passive: false });
		el.addEventListener("mouseup", onEnd);

		this.bindings.push({ el, keyCode });
	}

	_fireKey(type, code) {
		const evt = new KeyboardEvent(type, {
			key: this._keyFromCode(code),
			code,
			bubbles: true,
		});
		document.dispatchEvent(evt);
	}

	_keyFromCode(code) {
		if (code.startsWith("Key")) return code.slice(3).toLowerCase();
		if (code === "Space") return " ";
		if (code === "ShiftLeft") return "Shift";
		return code.toLowerCase();
	}
}
