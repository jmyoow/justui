/*
 * justui-foldablecard.js: A foldable card UI that has 3D effect
 *
 * @website:       http://htmllounge.com
 * @repository:    http://github.com/jmyoow/justui
 * @author:        Junmo Yoo
 * @version:       1.1(2014.07.28)
 * @license:       MIT License
 */

(function () {
    'use strict';
    
    function JustFoldableCard (selectorStr, options) {
        if (!(this instanceof JustFoldableCard)) {
            return new JustFoldableCard(selectorStr, options);
        }
        this.domBody = document.querySelector(selectorStr);
        if (!this.domBody) {
            throw new Error('No DOM element nodes passed into JustFoldableCard. JustFoldableCard에 전달된 DOM 엘리먼트 노드가 없습니다.');
        }
        
        options = options || {};
        this.height = options.height || 200;
        
        this.info = {
            touch: undefined,
            chkStart: false,
            chkMove: false,
            chkOpened: false,
            chkReading: false,
            moveValues: [],
            nStartY: 0,
            nFlipDegree: 0,
            nHeightDevisor: (this.height * 2 / 180)
        };

        // Detecting device; If you know better solution, use it. This is just simple and weak way.
        var useragent = window.navigator.userAgent.toLowerCase();
        if (useragent.indexOf('iphone') > 0
            || useragent.indexOf('ipod') > 0
            || useragent.indexOf('ipad') > 0
            || useragent.indexOf('android') > 0) {
            this.info.touch = true;
        } else {
            this.info.touch = false;
        }
        
        this.init();
        
        return this;
    }
    
    JustFoldableCard.prototype = {
        addListeners: function () {
            var that = this,
                info = this.info;
            
            if (this.info.touch) {
                // 터치 이벤트
                this.domBody.addEventListener('touchstart', function (e) {
                    document.body.addEventListener('touchmove', that.preventDefault, false);
                    info.nStartY = e.touches[0].clientY;
                    info.chkStart = true;
                    
                    if (info.chkOpened) {
                        if (e.touches[0].pageY < that.height + (that.domBody.offsetTop - that.height)) {
                            info.chkReading = false;
                        } else {
                            info.chkReading = true;
                        }
                    }
                }, false);
                
                this.domBody.addEventListener('touchmove', function (e) {
                    if (!info.chkStart) {
                        return;
                    }
                    info.chkMove = true;
                    
                    if (!info.chkOpened) {
                        // 닫힌 상태
                        info.nFlipDegree = Math.floor(-(e.touches[0].clientY - info.nStartY) / that.info.nHeightDevisor);
                        if (info.nFlipDegree <= 0) {
                            info.nFlipDegree = 0;
                        }
                        if (info.nFlipDegree >= 180) {
                            info.nFlipDegree = 180;
                        }
                        that.card.style.webkitTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.mozTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.oTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.msTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.transform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        info.moveValues.push(info.nFlipDegree);
                    } else if (e.touches[0].pageY < that.height + (that.domBody.offsetTop - that.height)) {
                        // 열린 상태 - 상단 부분 터치 작동
                        info.nFlipDegree = 180 - Math.floor((e.changedTouches[0].clientY - info.nStartY) / that.info.nHeightDevisor);
                        if (info.nFlipDegree <= 0) {
                            info.nFlipDegree = 0;
                        }
                        if (info.nFlipDegree >= 180) {
                            info.nFlipDegree = 180;
                        }
                        that.card.style.webkitTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.mozTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.oTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.msTransform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        that.card.style.transform = 'rotateX(' + info.nFlipDegree + 'deg)';
                        info.moveValues.push(info.nFlipDegree);
                    } else {
                        // 열린 상태 - 컨텐츠 보기(스크롤 가능)
                        document.body.removeEventListener('touchmove', that.preventDefault, false);
                    }
                    
                    // 그림자 그라데이션
                    if (info.nFlipDegree > 5 && info.nFlipDegree < 175) {
                        that.domBody.classList.add('folding');
                    }
                    if (info.nFlipDegree > 30) {
                        that.domBody.classList.add('is-opened');
                    }
                }, false);
                
                this.domBody.addEventListener('touchend', function (e) {
                    that.card.style.webkitTransition = 'all 0.5s';
                    that.card.style.mozTransition = 'all 0.5s';
                    that.card.style.oTransition = 'all 0.5s';
                    that.card.style.msTransition = 'all 0.5s';
                    that.card.style.transition = 'all 0.5s';
                    
                    if (info.chkStart && !info.chkMove) {
                        // TAP
                        if (!info.chkOpened) {
                            that.openCard();
                        }
                        return;
                    }
                    
                    if (!info.chkOpened) {
                        // 닫혀있으면
                        if (info.moveValues[info.moveValues.length - 1] >= info.moveValues[info.moveValues.length - 2] && info.moveValues[info.moveValues.length - 1] > 30) {
                            that.openCard();
                        } else {
                            that.closeCard();
                        }
                    } else {
                        // 열려있으면
                        if (e.changedTouches[0].pageY < that.height + (that.domBody.offsetTop - that.height) && info.chkMove) {
                            if (info.moveValues[info.moveValues.length - 1] >= info.moveValues[info.moveValues.length - 2]) {
                                that.openCard();
                            } else {
                                that.closeCard();
                            }
                        } else {
                            // 닫으려고 내리다가 터치 영역을 벗어난 경우
                            if (info.chkReading) {
                                that.openCard();
                            } else {
                                that.closeCard();
                            }
                        }
                    }
                    that.domBody.classList.remove('folding');
                    that.initOnTouchDevice();
                }, false);
                
                this.closeBtn.addEventListener('touchend', function () {
                    if (info.chkStart && !info.chkMove) {
                        that.closeCard();
                        that.initOnTouchDevice();
                    }
                }, false);
                
            } else {
            
                // 마우스 이벤트
                that.card.style.webkitTransition = 'all 0.5s';
                that.card.style.mozTransition = 'all 0.5s';
                that.card.style.oTransition = 'all 0.5s';
                that.card.style.msTransition = 'all 0.5s';
                that.card.style.transition = 'all 0.5s';
                
                this.domBody.addEventListener('click', function () {
                    if (!info.chkOpened) {
                        that.openCard();
                    }
                }, false);
                
                this.closeBtn.addEventListener('click', function () {
                    that.card.style.webkitTransform = 'rotateX(0)';
                    that.card.style.mozTransform = 'rotateX(0)';
                    that.card.style.oTransform = 'rotateX(0)';
                    that.card.style.msTransform = 'rotateX(0)';
                    that.card.style.transform = 'rotateX(0)';
                    that.domBody.classList.remove('is-opened');
                    setTimeout(function () {
                        that.info.chkOpened = false;
                    }, 0);
                }, false);
            }
        },
        preventDefault: function (e) {
            e.preventDefault();
        },
        openCard: function () {
            this.card.style.webkitTransform = 'rotateX(180deg)';
            this.card.style.mozTransform = 'rotateX(180deg)';
            this.card.style.oTransform = 'rotateX(180deg)';
            this.card.style.msTransform = 'rotateX(180deg)';
            this.card.style.transform = 'rotateX(180deg)';
            this.domBody.classList.add('is-opened');
            this.info.chkOpened = true;
        },
        closeCard: function () {
            this.card.style.webkitTransform = 'rotateX(0)';
            this.card.style.mozTransform = 'rotateX(0)';
            this.card.style.oTransform = 'rotateX(0)';
            this.card.style.msTransform = 'rotateX(0)';
            this.card.style.transform = 'rotateX(0)';
            this.domBody.classList.remove('is-opened');
            this.info.chkOpened = false;
        },
        initOnTouchDevice: function () {
            var that = this,
                info = this.info;
                
            this.card.addEventListener('transitionend', function () {
                that.card.style.webkitTransition = '';
                that.card.style.mozTransition = '';
                that.card.style.oTransition = '';
                that.card.style.msTransition = '';
                that.card.style.transition = '';
            }, false);
            
            info.nFlipDegree = 0;
            info.moveValues = [];
            document.body.removeEventListener('touchmove', that.preventDefault, false);
            info.chkStart = info.chkMove = false;
        },
        createDom: function () {
            this.cover = document.querySelector('.cover');
            this.inside = document.querySelector('.inside');
            
            this.card = document.createElement('div');
            this.card.className = 'foldablecard';
            this.coverContent = document.createElement('div');
            this.coverContent.className = 'cover-content';
            this.closeBtn = document.createElement('div');
            this.closeBtn.className = 'btn-close-card';
            this.insideContent = document.createElement('div');
            this.insideContent.className = 'inside-content';
            this.insideContentSubs = document.createElement('div');
            this.insideContentSubs.className = 'inside-content-subs';
            this.insideCopy = document.createElement('div');
            this.insideCopy.className = 'inside-copy';
            this.insideCopyContent = document.createElement('div');
            this.insideCopyContent.className = 'inside-copy-content';
            
            // cover
            var initialCoverContent = Array.prototype.slice.call(this.cover.children);
            for (var i = 0; i < initialCoverContent.length; i += 1) {
                this.coverContent.appendChild(initialCoverContent[i]);
            }
            this.cover.appendChild(this.coverContent);
            
            // inside
            var initialInsideContent = Array.prototype.slice.call(this.inside.children);
            for (var j = 0; j < initialInsideContent.length; j += 1) {
                this.insideContentSubs.appendChild(initialInsideContent[j]);
            }
            this.insideContent.appendChild(this.insideContentSubs);
            this.inside.appendChild(this.closeBtn);
            this.inside.appendChild(this.insideContent);
            this.insideCopy.appendChild(this.insideCopyContent);
            
            this.card.appendChild(this.cover);
            this.card.appendChild(this.inside);
            
            this.domBody.appendChild(this.card);
            this.domBody.appendChild(this.insideCopy);
        },
        init: function () {
            this.createDom();
            
            if (this.info.touch) {
                this.domBody.classList.add('touch');
            }
            this.domBody.style.height = this.insideCopy.style.height = this.height + 'px';
            this.insideCopyContent.style.marginTop = -this.height + 'px';
            var content = this.insideContentSubs.cloneNode(true);
            content.className = 'inside-copy-content-subs';
            this.insideCopyContent.appendChild(content);
            this.addListeners();
        }
    };
    
    window.JustFoldableCard = JustFoldableCard;
})();
