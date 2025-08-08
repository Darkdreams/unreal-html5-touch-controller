export class CanvasViewControl {
        constructor(canvasId, region, { applyBodyStyle = true } = {}) {
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

                this._applyBodyStyle = applyBodyStyle;
                if (this._applyBodyStyle) {
                        this._styleCanvas();
                }
                this._bindEvents();
        }

        _styleCanvas() {
                this._prevCanvasStyle = {
                        touchAction: this.canvas.style.touchAction,
                        tabindex: this.canvas.getAttribute('tabindex')
                };
                const body = document.body;
                this._prevBodyStyle = {
                        overflow: body.style.overflow,
                        position: body.style.position,
                        width: body.style.width,
                        height: body.style.height,
                        touchAction: body.style.touchAction
                };

                this.canvas.style.touchAction = 'none';
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
                this._onStart = this._onTouchStart.bind(this);
                this._onMove = this._onTouchMove.bind(this);
                this._onEnd = this._onTouchEnd.bind(this);

                this.canvas.addEventListener('touchstart', this._onStart, { passive: false });
                this.canvas.addEventListener('touchmove', this._onMove, { passive: false });
                this.canvas.addEventListener('touchend', this._onEnd, { passive: false });
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

        destroy() {
                if (!this.canvas) return;
                this.canvas.removeEventListener("touchstart", this._touchStartHandler);
                this.canvas.removeEventListener("touchmove", this._touchMoveHandler);
                this.canvas.removeEventListener("touchend", this._touchEndHandler);
                if (this._applyBodyStyle) {
                        const body = document.body;
                        if (this._prevBodyStyle) {
                                body.style.overflow = this._prevBodyStyle.overflow;
                                body.style.position = this._prevBodyStyle.position;
                                body.style.width = this._prevBodyStyle.width;
                                body.style.height = this._prevBodyStyle.height;
                                body.style.touchAction = this._prevBodyStyle.touchAction;
                        }
                        if (this._prevCanvasStyle) {
                                this.canvas.style.touchAction = this._prevCanvasStyle.touchAction;
                                if (this._prevCanvasStyle.tabindex !== null) {
                                        this.canvas.setAttribute('tabindex', this._prevCanvasStyle.tabindex);
                                } else {
                                        this.canvas.removeAttribute('tabindex');
                                }
                        }
                }
        }
}
