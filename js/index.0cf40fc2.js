(function(e){function t(t){for(var a,r,i=t[0],c=t[1],l=t[2],d=0,m=[];d<i.length;d++)r=i[d],s[r]&&m.push(s[r][0]),s[r]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);u&&u(t);while(m.length)m.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,i=1;i<n.length;i++){var c=n[i];0!==s[c]&&(a=!1)}a&&(o.splice(t--,1),e=r(r.s=n[0]))}return e}var a={},s={index:0},o=[];function r(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=a,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/mediacast/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=c;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0b5c":function(e,t){e.exports="data:image/png;base64,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"},"160f":function(e,t,n){},"42b7":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var a=n("2b0e"),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"sender-app"},[n("Sender")],1)},o=[],r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"sender container"},[a("img",{staticClass:"logo",attrs:{src:n("0b5c")}}),a("h1",[e._v("MediaCast - Sender")]),a("div",{staticClass:"controls"},[a("label",[e._v("Media URL")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.mediaUrl,expression:"mediaUrl"}],staticClass:"u-full-width",attrs:{type:"text"},domProps:{value:e.mediaUrl},on:{input:function(t){t.target.composing||(e.mediaUrl=t.target.value)}}}),a("label",[e._v("License Server URL")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.licenseUrl,expression:"licenseUrl"}],staticClass:"u-full-width",attrs:{type:"text"},domProps:{value:e.licenseUrl},on:{input:function(t){t.target.composing||(e.licenseUrl=t.target.value)}}}),a("label",{attrs:{for:"drm"}},[e._v("DRM")]),a("select",{directives:[{name:"model",rawName:"v-model",value:e.drm,expression:"drm"}],staticClass:"u-full-width",attrs:{id:"drm"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.drm=t.target.multiple?n:n[0]}}},[a("option",{attrs:{value:"none"}},[e._v("None")]),a("option",{attrs:{value:"widevine"}},[e._v("Widevine")]),a("option",{attrs:{value:"playready"}},[e._v("PlayReady")])]),a("button",{staticClass:"button-primary",on:{click:e.connect}},[e._v("Connect")]),a("button",{on:{click:e.loadMedia}},[e._v("Load Media")]),a("button",{on:{click:e.play}},[e._v("Play")]),a("button",{on:{click:e.pause}},[e._v("Pause")]),a("button",{on:{click:e.testMessage}},[e._v("Test Message")]),a("label",{attrs:{for:"checkbox"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.debugEnabled,expression:"debugEnabled"}],attrs:{type:"checkbox",id:"checkbox"},domProps:{checked:Array.isArray(e.debugEnabled)?e._i(e.debugEnabled,null)>-1:e.debugEnabled},on:{change:[function(t){var n=e.debugEnabled,a=t.target,s=!!a.checked;if(Array.isArray(n)){var o=null,r=e._i(n,o);a.checked?r<0&&(e.debugEnabled=n.concat([o])):r>-1&&(e.debugEnabled=n.slice(0,r).concat(n.slice(r+1)))}else e.debugEnabled=s},function(t){return e.onDebugChange(t)}]}}),a("span",[e._v("Debug Panel")])])])])},i=[],c=n("db49"),l=(n("160f"),n("42b7"),c["a"].namespace),u=c["a"].applicationId,d={name:"sender",components:{},data:function(){return{mediaUrl:"https://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel-dash-widevine.ism/.mpd",licenseUrl:"https://widevine-proxy.appspot.com/proxy",drm:"widevine",loaded:!1,debugEnabled:!0}},mounted:function(){this.setQueryParams(),this.init()},methods:{setQueryParams:function(){this.$route.query.url&&(this.mediaUrl=this.$route.query.url),this.$route.query.licenseUrl&&(this.licenseUrl=this.$route.query.licenseUrl),this.$route.query.drm&&(this.drm=this.$route.query.drm.toLowerCase())},init:function(){var e=this;window["__onGCastApiAvailable"]=function(t){t&&setTimeout(function(){e.initializeCastApi()},50)}},initializeCastApi:function(){console.log("[mediacast] - Initializing Cast API: ",u),window.cast.framework.CastContext.getInstance().setOptions({receiverApplicationId:u,autoJoinPolicy:chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED})},connect:function(){cast&&cast.framework.CastContext.getInstance().requestSession()},loadMedia:function(){var e=this.mediaUrl,t=this.licenseUrl,n=this.drm,a="application/dash+xml",s=window.cast.framework.CastContext.getInstance().getCurrentSession(),o=new window.chrome.cast.media.MediaInfo(e,a);o.customData={licenseUrl:t,drm:n};var r=new window.chrome.cast.media.LoadRequest(o);this.sendMessage("trying to load mediaUrl: "+e),s.loadMedia(r).then(function(){console.log("[mediacast] - Load succeeded")},function(e){console.log("[mediacast] - Error:"+e)})},play:function(){console.log("[mediacast] - play"),this.sendMessage("play");var e=window.cast.framework.CastContext.getInstance().getCurrentSession(),t=e.getMediaSession();e.sendMessage("urn:x-cast:com.google.cast.media",{type:"PLAY",requestId:1,mediaSessionId:t.mediaSessionId})},pause:function(){console.log("[mediacast] - pause"),this.sendMessage("pause");var e=window.cast.framework.CastContext.getInstance().getCurrentSession(),t=e.getMediaSession();e.sendMessage("urn:x-cast:com.google.cast.media",{type:"PAUSE",requestId:1,mediaSessionId:t.mediaSessionId})},testMessage:function(){console.log("[mediacast] - sending test message"),this.sendMessage("Test")},sendMessage:function(e){console.log("[mediacast:sendMessage] - "+e);var t=window.cast.framework.CastContext.getInstance().getCurrentSession();t.sendMessage(l,{message:e})},onDebugChange:function(e){console.log("[mediacast:setDebugPanel] - "+this.debugEnabled);var t=window.cast.framework.CastContext.getInstance().getCurrentSession();t.sendMessage(l,{action:"setDebugPanel",message:this.debugEnabled})}}},m=d,p=(n("ee1d"),n("2877")),g=Object(p["a"])(m,r,i,!1,null,"35564afd",null),A=g.exports,b={name:"sender-app",components:{Sender:A}},f=b,v=(n("ebc5"),Object(p["a"])(f,s,o,!1,null,null,null)),h=v.exports,w=n("8c4f"),y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("Sender")],1)},M=[],C={name:"home",components:{Sender:A}},P=C,x=Object(p["a"])(P,y,M,!1,null,null,null),O=x.exports;a["a"].use(w["a"]);var S=new w["a"]({routes:[{path:"/",name:"home",component:O}]});a["a"].config.productionTip=!1,new a["a"]({router:S,render:function(e){return e(h)}}).$mount("#app")},a192:function(e,t,n){},d19a:function(e,t,n){},db49:function(e,t,n){"use strict";var a={namespace:"urn:x-cast:com.google.cast.mediacast",applicationId:"A55EBA47"};t["a"]=a},ebc5:function(e,t,n){"use strict";var a=n("a192"),s=n.n(a);s.a},ee1d:function(e,t,n){"use strict";var a=n("d19a"),s=n.n(a);s.a}});
//# sourceMappingURL=index.0cf40fc2.js.map