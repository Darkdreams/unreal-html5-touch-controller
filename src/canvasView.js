export class CanvasViewControl {
	constructor(canvasId, region) {
		this.canvas = document.getElementById(canvasId);
		
		if (!this.canvas) {
			console.warn(`[UnrealHTML5TouchController] Canvas not found with id "${canvasId}"`);
			return;
		}

		this.viewTouchId = null;
		this.lastTouch = null;

		// Accept 0~1 number or a custom function
    	this.touchRegion = typeof region === 'function'
      	? region
      	: (x) => x > window.innerWidth * region;

		this._styleCanvas();
		this._bindEvents();
	}

	_styleCanvas() {
		this.canvas.style.touchAction = 'none';
		const body = document.body;
		body.style.overflow = 'hidden';
		body.style.position = 'fixed';
		body.style.width = '100%';
		body.style.height = '100%';
		body.style.touchAction = 'none';

		// Enable canvas to receive focus and keyboard events
		this.canvas.setAttribute('tabindex', '0');
		this.canvas.focus();
	}

	_bindEvents() {
		this.canvas.addEventListener("touchstart", this._onTouchStart.bind(this), { passive: false });
		this.canvas.addEventListener("touchmove", this._onTouchMove.bind(this), { passive: false });
		this.canvas.addEventListener("touchend", this._onTouchEnd.bind(this), { passive: false });
	}

	_onTouchStart(e) {
		for (const touch of e.changedTouches) {
			if (touch.clientX > window.innerWidth / 2) {
				this.viewTouchId = touch.identifier;
				this.lastTouch = { x: touch.clientX, y: touch.clientY };
				this._fireMouseEvent('mousedown', touch);
			}
		}
		e.preventDefault();
	}

	_onTouchMove(e) {
		if (this.viewTouchId === null) return;

		for (const touch of e.changedTouches) {
			if (touch.identifier === this.viewTouchId) {
				const dx = touch.clientX - this.lastTouch.x;
				const dy = touch.clientY - this.lastTouch.y;
				this.lastTouch = { x: touch.clientX, y: touch.clientY };
				this._fireMouseEvent('mousemove', touch, dx, dy);
			}
		}
		e.preventDefault();
	}

	_onTouchEnd(e) {
		for (const touch of e.changedTouches) {
			if (touch.identifier === this.viewTouchId) {
				this._fireMouseEvent('mouseup', touch);
				this.viewTouchId = null;
				this.lastTouch = null;
			}
		}
		e.preventDefault();
	}

	_fireMouseEvent(type, touch, movementX = 0, movementY = 0) {
		const evt = new MouseEvent(type, {
			bubbles: true,
			cancelable: true,
			clientX: touch.clientX,
			clientY: touch.clientY,
			movementX,
			movementY,
			buttons: type === 'mouseup' ? 0 : 1
		});
		this.canvas.dispatchEvent(evt);
	}
}
