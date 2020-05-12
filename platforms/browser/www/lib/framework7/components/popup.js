(function framework7ComponentLoader(o,e){void 0===e&&(e=!0);var p=document,t=window,s=o.$,a=(o.Template7,o.utils),r=(o.device,o.support),n=(o.Class,o.Modal),i=(o.ConstructorMethods,o.ModalMethods),l=function(o){function e(e,n){var i=a.extend({on:{}},e.params.popup,n);o.call(this,e,i);var l,c,u,d,m=this;if(m.params=i,(l=m.params.el?s(m.params.el).eq(0):s(m.params.content).filter((function(o,e){return 1===e.nodeType})).eq(0))&&l.length>0&&l[0].f7Modal)return l[0].f7Modal;if(0===l.length)return m.destroy();function h(o){var p=o.target,a=s(p);if(!(!e.device.desktop&&e.device.cordova&&(t.Keyboard&&t.Keyboard.isVisible||t.cordova.plugins&&t.cordova.plugins.Keyboard&&t.cordova.plugins.Keyboard.isVisible))&&0===a.closest(m.el).length&&m.params&&m.params.closeByBackdropClick&&m.params.backdrop&&m.backdropEl&&m.backdropEl===p){var r=!0;m.$el.nextAll(".popup.modal-in").each((function(o,e){var p=e.f7Modal;p&&p.params.closeByBackdropClick&&p.params.backdrop&&p.backdropEl===m.backdropEl&&(r=!1)})),r&&m.close()}}function f(o){27===o.keyCode&&m.params.closeOnEscape&&m.close()}function v(o){return(e.height-2*o)/e.height}m.params.backdrop&&m.params.backdropEl?c=s(m.params.backdropEl):m.params.backdrop&&0===(c=e.root.children(".popup-backdrop")).length&&(c=s('<div class="popup-backdrop"></div>'),e.root.append(c)),a.extend(m,{app:e,push:l.hasClass("popup-push")||m.params.push,$el:l,el:l[0],$backdropEl:c,backdropEl:c&&c[0],type:"popup",$htmlEl:s("html")}),m.params.push&&l.addClass("popup-push");var g,w,y,b,k,C,E,M,T,$,B,x=!0,H=!1,S=!1;function O(o){!H&&x&&m.params.swipeToClose&&(m.params.swipeHandler&&0===s(o.target).closest(m.params.swipeHandler).length||(H=!0,S=!1,g={x:"touchstart"===o.type?o.targetTouches[0].pageX:o.pageX,y:"touchstart"===o.type?o.targetTouches[0].pageY:o.pageY},b=a.now(),y=void 0,m.params.swipeHandler||"touchstart"!==o.type||(C=s(o.target).closest(".page-content")[0])))}function K(o){if(H){if(w={x:"touchmove"===o.type?o.targetTouches[0].pageX:o.pageX,y:"touchmove"===o.type?o.targetTouches[0].pageY:o.pageY},void 0===y&&(y=!!(y||Math.abs(w.x-g.x)>Math.abs(w.y-g.y))),y)return H=!1,void(S=!1);k=g.y-w.y,d&&u&&k>0&&(k=0);var p=k<0?"to-bottom":"to-top";if(l.transition(0),"string"==typeof m.params.swipeToClose&&p!==m.params.swipeToClose)return l.transform(""),void l.transition("");if(S)m.emit("local::swipeMove popupSwipeMove",m),m.$el.trigger("popup:swipemove");else{if(d&&u&&($=l[0].offsetHeight,B=e.root.children(".view, .views")),C&&(E=C.scrollTop,T=C.scrollHeight,M=C.offsetHeight,!(T===M||"to-bottom"===p&&0===E||"to-top"===p&&E===T-M)))return l.transform(""),l.transition(""),H=!1,void(S=!1);S=!0,m.emit("local::swipeStart popupSwipeStart",m),m.$el.trigger("popup:swipestart")}if(o.preventDefault(),d&&u){var t=1-Math.abs(k/$),s=1-(1-v(u))*t;B.transition(0).transform("translate3d(0,0,0) scale("+s+")")}l.transition(0).transform("translate3d(0,"+-k+"px,0)")}}function P(){if(H=!1,S){m.emit("local::swipeEnd popupSwipeEnd",m),m.$el.trigger("popup:swipeend"),S=!1,x=!1,l.transition(""),d&&u&&B.transition("").transform("");var o=k<=0?"to-bottom":"to-top";if("string"==typeof m.params.swipeToClose&&o!==m.params.swipeToClose)return l.transform(""),void(x=!0);var e=Math.abs(k),p=(new Date).getTime()-b;p<300&&e>20||p>=300&&e>100?a.nextTick((function(){"to-bottom"===o?l.addClass("swipe-close-to-bottom"):l.addClass("swipe-close-to-top"),l.transform(""),m.emit("local::swipeclose popupSwipeClose",m),m.$el.trigger("popup:swipeclose"),m.close(),x=!0})):(x=!0,l.transform(""))}}var X=!!r.passiveListener&&{passive:!0};return m.params.swipeToClose&&(l.on(e.touchEvents.start,O,X),e.on("touchmove",K),e.on("touchend:passive",P),m.once("popupDestroy",(function(){l.off(e.touchEvents.start,O,X),e.off("touchmove",K),e.off("touchend:passive",P)}))),m.on("open",(function(){m.params.closeOnEscape&&s(p).on("keydown",f),m.push&&(d=m.push&&(e.width<630||e.height<630||l.hasClass("popup-tablet-fullscreen"))),d&&(u=parseInt(l.css("--f7-popup-push-offset"),10),Number.isNaN(u)&&(u=0),u&&(l.addClass("popup-push"),m.$htmlEl.addClass("with-modal-popup-push"),m.$htmlEl[0].style.setProperty("--f7-popup-push-scale",v(u))))})),m.on("opened",(function(){l.removeClass("swipe-close-to-bottom swipe-close-to-top"),m.params.closeByBackdropClick&&e.on("click",h)})),m.on("close",(function(){m.params.closeOnEscape&&s(p).off("keydown",f),m.params.closeByBackdropClick&&e.off("click",h),d&&u&&(m.$htmlEl.removeClass("with-modal-popup-push"),m.$htmlEl.addClass("with-modal-popup-push-closing"))})),m.on("closed",(function(){d&&u&&(m.$htmlEl.removeClass("with-modal-popup-push-closing"),m.$htmlEl[0].style.removeProperty("--f7-popup-push-scale"))})),l[0].f7Modal=m,m}return o&&(e.__proto__=o),e.prototype=Object.create(o&&o.prototype),e.prototype.constructor=e,e}(n),c={name:"popup",params:{popup:{backdrop:!0,backdropEl:void 0,closeByBackdropClick:!0,closeOnEscape:!1,swipeToClose:!1,swipeHandler:null,push:!1}},static:{Popup:l},create:function(){this.popup=i({app:this,constructor:l,defaultSelector:".popup.modal-in"})},clicks:{".popup-open":function(o,e){void 0===e&&(e={});this.popup.open(e.popup,e.animate)},".popup-close":function(o,e){void 0===e&&(e={});this.popup.close(e.popup,e.animate)}}};if(e){if(o.prototype.modules&&o.prototype.modules[c.name])return;o.use(c),o.instance&&(o.instance.useModuleParams(c,o.instance.params),o.instance.useModule(c))}return c}(Framework7, typeof Framework7AutoInstallComponent === 'undefined' ? undefined : Framework7AutoInstallComponent))
