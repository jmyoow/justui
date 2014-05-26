/**
 * justui-slidinghamburger.js: A sliding effect 'hamburger' menu for mobile websites
 *
 * @website:     http://htmllounge.com
 * @repository:  http://github.com/jmyoow/justui
 * @author:      Junmo Yoo
 * @version:     1.0(2014.02.24)
 * @license:     MIT License
 */

(function () {
  'use strict';
  
  function JustSlidingHamburger (selectorStr, options) {
    if (!(this instanceof JustSlidingHamburger)) {
      return new JustSlidingHamburger(selectorStr, options);
    }
    this.domBody = document.querySelector(selectorStr);
    if (!this.domBody) {
      throw new Error('No DOM element nodes passed into JustSlidingHamburger. JustSlidingHamburger에 전달된 DOM 엘리먼트 노드가 없습니다.');
    }
    if ('ontouchend' in window) {
      this.touch = true;
      this.eventName = 'touchend';
    } else {
      this.touch = false;
      this.eventName = 'click';
    }
    
    options = options || {};
    this.speed = options.speed || 500;
    this.slidingDelay = options.slidingDelay || 'yes';
    
    this.menuBtn = this.domBody.querySelector('.btn-menu');
    this.slideItemListWrapper = this.domBody.querySelector('.slide-item-list-wrapper');
    this.slideItemList = this.domBody.querySelectorAll('.slide-item-list');
    this.menuSlideItemList = this.domBody.querySelector('.slide-item-list.menu');
    this.contentSlideItemList = this.domBody.querySelector('.slide-item-list.content');
    
    this.init();
    
    return this;
  }
  
  JustSlidingHamburger.prototype = {
  
    slideMenus: function (n) {
      var that = this;
      
      for (var i = 0; i < this.slideItemList.length; i += 1) {
        (function () {
          var slideItems = that.slideItemList[i].querySelectorAll('.slide-item');
          for (var j = 0; j < slideItems.length; j += 1) {
            slideItems[j].style.webkitTransition = '-webkit-transform ' + that.speed + 'ms ease';
            slideItems[j].style.mozTransition = '-moz-transform ' + that.speed + 'ms ease';
            slideItems[j].style.oTransition = '-o-transform ' + that.speed + 'ms ease';
            slideItems[j].style.msTransition = '-ms-transform ' + that.speed + 'ms ease';
            slideItems[j].style.transition = 'transform ' + that.speed + 'ms ease';
          }
          if (that.slidingDelay === 'yes') {
            for (var k = 0; k < slideItems.length + 1; k += 1) {
              (function (k) {
                that.timerId1 = setTimeout(function () {
                  if (slideItems[k]) {
                    slideItems[k].style.webkitTransform = 'translate3d(' + n + ', 0, 0)';
                    slideItems[k].style.mozTransform = 'translate3d(' + n + ', 0, 0)';
                    slideItems[k].style.oTransform = 'translate3d(' + n + ', 0, 0)';
                    slideItems[k].style.msTransform = 'translate3d(' + n + ', 0, 0)';
                    slideItems[k].style.transform = 'translate3d(' + n + ', 0, 0)';
                  }
                  clearTimeout(that.timerId1);
                  that.timerId1 = null;
                }, k * that.speed * 0.06 * (6 / slideItems.length));
              })(k);
            }
            return;
          }
          for (var k = 0; k < slideItems.length + 1; k += 1) {
            if (slideItems[k]) {
              slideItems[k].style.webkitTransform = 'translate3d(' + n + ', 0, 0)';
              slideItems[k].style.mozTransform = 'translate3d(' + n + ', 0, 0)';
              slideItems[k].style.oTransform = 'translate3d(' + n + ', 0, 0)';
              slideItems[k].style.msTransform = 'translate3d(' + n + ', 0, 0)';
              slideItems[k].style.transform = 'translate3d(' + n + ', 0, 0)';
            }
          }
        })();
      }
    },
    toggleMenus: function () {
      var translateValue;
        
      if (this.checkMenuActive) {
        this.contentSlideItemList.style.display = 'block';
        translateValue = '0';
        this.domBody.classList.remove('menu-on');
      } else {
        this.menuSlideItemList.style.display = 'block';
        translateValue = '-100%';
        this.domBody.classList.add('menu-on');
      }
      this.slideMenus(translateValue);
      this.checkMenuActive = !this.checkMenuActive;
      if (!this.onWebpage) document.body.scrollTop = 0;
    },
    addListeners: function () {
      var that = this;
      
      this.menuBtn.addEventListener(this.eventName, function (e) {
        e.preventDefault();
        that.toggleMenus();
      }, false);
      if (this.eventName === 'touchend') {
        this.menuBtn.addEventListener('click', function (e) {
          e.preventDefault();
        }, false);
      }
    },
    init: function () {
      this.addListeners();
      var h,
        contentHeight = this.contentSlideItemList.offsetHeight,
        menuHeight = this.menuSlideItemList.offsetHeight;
      if (contentHeight > menuHeight) {
        h = contentHeight;
      } else {
        h = menuHeight;
      }
      this.slideItemListWrapper.style.minHeight = h + 'px';
    }
    
  };
  
  window.JustSlidingHamburger = JustSlidingHamburger;
  
})();
