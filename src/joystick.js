export class JoystickControl {
  constructor(id, onMove) {
    this.el = document.getElementById(id);
    this.onMove = onMove;
    this.origin = null;
    if (this.el) this._bindEvents();
  }

  _bindEvents() {
    this.el.addEventListener('touchstart', this._onStart.bind(this), { passive: false });
    this.el.addEventListener('touchmove', this._onMove.bind(this), { passive: false });
    this.el.addEventListener('touchend', this._onEnd.bind(this), { passive: false });
  }

  _onStart(e) {
    if (e.touches.length === 1) {
      this.origin = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    e.preventDefault();
  }

  _onMove(e) {
    if (this.origin && e.touches.length === 1) {
      const dx = e.touches[0].clientX - this.origin.x;
      const dy = e.touches[0].clientY - this.origin.y;
      this.onMove(dx, dy);
    }
    e.preventDefault();
  }

  _onEnd(e) {
    this.origin = null;
    this.onMove(0, 0);
    e.preventDefault();
  }
}
