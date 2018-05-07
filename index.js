/**
* js-wheel
*
* Copyright (c) 2018 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

export default class Wheel {
  constructor() {
    this.touchStartY = 0;
    this.wheelTimer = null;
    this.isWheeling = false;
    this.isTouchMoving = false;
    this.isEnable = false;

    this.scrollDown = null;
    this.scrollUp = null;
  }
  on(scrollDown, scrollUp) {
    this.scrollDown = null;
    this.scrollUp = null;

    // For mouse.
    this.elm.scene.addEventListener('wheel', (e) => {
      e.preventDefault();

      // Fire only the first time.
      if (this.isWheeling === false) {
        // When wheel speed is slow, it don't fire events.
        if (e.deltaMode === 0 && Math.abs(e.deltaY) < 10) return;

        if (e.deltaY > 0) {
          // Just like scrolling down.
          if (this.scrollDown !== null) this.scrollDown();
        } else {
          // Just like scrolling up.
          if (this.scrollUp !== null) this.scrollUp();
        }

        // Prevent repetitive firing with timer.
        this.isWheeling = true;
        this.wheelTimer = setTimeout(() => {
          this.isWheeling = false;
        }, 1000);
      }
    });

    // For touch panel.
    this.elm.scene.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
    }, false);

    this.elm.scene.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (this.isTouchMoving === false) {
        const diffY = this.touchStartY - e.touches[0].clientY;

        if (diffY > 20) {
          // Just like scrolling down.
          if (this.scrollDown !== null) this.scrollDown();
        } else if (diffY < -20) {
          // Just like scrolling up.
          if (this.scrollUp !== null) this.scrollUp();
        }

        // Prevent repetitive firing with a flag.
        if (Math.abs(diffY) > 20) this.isTouchMoving = true;
      }
    }, false);

    this.elm.scene.addEventListener('touchend', (e) => {
      this.isTouchMoving = false;
    }, false);
  }
}
