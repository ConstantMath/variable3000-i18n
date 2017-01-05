/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e("undefined"!=typeof jQuery?jQuery:window.Zepto)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;i<a.length;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;i<o.length;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),s.data=null;var c=s.beforeSend;return s.beforeSend=function(e,r){r.data=t.formData?t.formData:n,c&&c.call(this,e,r)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(k),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action"),o="multipart/form-data",c=f.attr("enctype")||f.attr("encoding")||o;w.setAttribute("target",p),(!u||/post/i.test(u))&&w.setAttribute("method","POST"),i!=m.url&&w.setAttribute("action",m.url),m.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),m.timeout&&(j=setTimeout(function(){T=!0,s(D)},m.timeout));var l=[];try{if(m.extraData)for(var d in m.extraData)m.extraData.hasOwnProperty(d)&&l.push(e.isPlainObject(m.extraData[d])&&m.extraData[d].hasOwnProperty("name")&&m.extraData[d].hasOwnProperty("value")?e('<input type="hidden" name="'+m.extraData[d].name+'">').val(m.extraData[d].value).appendTo(w)[0]:e('<input type="hidden" name="'+d+'">').val(m.extraData[d]).appendTo(w)[0]);m.iframeTarget||v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(h){var x=document.createElement("form").submit;x.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",c),r?w.setAttribute("target",r):f.removeAttr("target"),e(l).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=k),t===D&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t==k&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(M&&M.location.href!=m.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==m.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(m.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":m.dataType};return t[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(m.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||m.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(l){var p=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];p?x.responseText=p.textContent?p.textContent:p.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==c&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{E=_(x,c,m)}catch(y){i="parsererror",x.error=r=y||i}}catch(y){a("error caught: ",y),i="error",x.error=r=y||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(m.success&&m.success.call(m.context,E,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,m])):i&&(void 0===r&&(r=x.statusText),m.error&&m.error.call(m.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,m,r])),d&&e.event.trigger("ajaxComplete",[x,m]),d&&!--e.active&&e.event.trigger("ajaxStop"),m.complete&&m.complete.call(m.context,x,i),F=!0,m.timeout&&clearTimeout(j),setTimeout(function(){m.iframeTarget?v.attr("src",m.iframeSrc):v.remove(),x.responseXML=null},100)}}}var c,l,m,d,p,v,g,x,y,b,T,j,w=f[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(l=0;l<h.length;l++)c=e(h[l]),i?c.prop("disabled",!1):c.removeAttr("disabled");if(m=e.extend(!0,{},e.ajaxSettings,t),m.context=m.context||m,p="jqFormIO"+(new Date).getTime(),m.iframeTarget?(v=e(m.iframeTarget),b=v.attr2("name"),b?p=b:v.attr2("name",p)):(v=e('<iframe name="'+p+'" src="'+m.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",m.iframeSrc),x.error=r,m.error&&m.error.call(m.context,x,r,t),d&&e.event.trigger("ajaxError",[x,m,r]),m.complete&&m.complete.call(m.context,x,r)}},d=m.global,d&&0===e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,m]),m.beforeSend&&m.beforeSend.call(m.context,x,m)===!1)return m.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;y=w.clk,y&&(b=y.name,b&&!y.disabled&&(m.extraData=m.extraData||{},m.extraData[b]=y.value,"image"==y.type&&(m.extraData[b+".x"]=w.clk_x,m.extraData[b+".y"]=w.clk_y)));var D=1,k=2,A=e("meta[name=csrf-token]").attr("content"),L=e("meta[name=csrf-param]").attr("content");L&&A&&(m.extraData=m.extraData||{},m.extraData[L]=A),m.forceSync?o():setTimeout(o,10);var E,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,c,l,f=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),u=t.type||this.attr2("method"),c=t.url||this.attr2("action"),l="string"==typeof c?e.trim(c):"",l=l||window.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:l,success:e.ajaxSettings.success,type:u||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var d=t.traditional;void 0===d&&(d=e.ajaxSettings.traditional);var p,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,p=e.param(t.data,d)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,d);p&&(g=g?g+"&"+p:p),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var y=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(y,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var b=t.error;t.error=function(e,r,a){var n=t.context||this;b.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),w=j.length>0,S="multipart/form-data",D=f.attr("enctype")==S||f.attr("encoding")==S,k=n.fileapi&&n.formdata;a("fileAPI :"+k);var A,L=(w||D)&&!k;t.iframe!==!1&&(t.iframe||L)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||D)&&k?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var E=0;E<h.length;E++)h[E]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i,o=this[0],s=this.attr("id"),u=t?o.getElementsByTagName("*"):o.elements;if(u&&!/MSIE [678]/.test(navigator.userAgent)&&(u=e(u).get()),s&&(i=e(':input[form="'+s+'"]').get(),i.length&&(u=(u||[]).concat(i))),!u||!u.length)return a;var c,l,f,m,d,p,h;for(c=0,p=u.length;p>c;c++)if(d=u[c],f=d.name,f&&!d.disabled)if(t&&o.clk&&"image"==d.type)o.clk==d&&(a.push({name:f,value:e(d).val(),type:d.type}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}));else if(m=e.fieldValue(d,!0),m&&m.constructor==Array)for(r&&r.push(d),l=0,h=m.length;h>l;l++)a.push({name:f,value:m[l]});else if(n.fileapi&&"file"==d.type){r&&r.push(d);var v=d.files;if(v.length)for(l=0;l<v.length;l++)a.push({name:f,value:v[l],type:d.type});else a.push({name:f,value:"",type:d.type})}else null!==m&&"undefined"!=typeof m&&(r&&r.push(d),a.push({name:f,value:m,type:d.type,required:d.required}));if(!t&&o.clk){var g=e(o.clk),x=g[0];f=x.name,f&&!x.disabled&&"image"==x.type&&(a.push({name:f,value:g.val()}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&"undefined"!=typeof n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,c="select-one"==n,l=c?o+1:u.length,f=c?o:0;l>f;f++){var m=u[f];if(m.selected){var d=m.value;if(d||(d=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),c)return d;s.push(d)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});

/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});

/*! Sortable 1.5.0-rc1 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){if(!a||!a.nodeType||1!==a.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(a);this.el=a,this.options=b=t({},b),a[Q]=this;var c={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0}};for(var d in c)!(d in b)&&(b[d]=c[d]);ba(b);for(var e in this)"_"===e.charAt(0)&&"function"==typeof this[e]&&(this[e]=this[e].bind(this));this.nativeDraggable=!b.forceFallback&&W,f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),f(a,"pointerdown",this._onTapStart),this.nativeDraggable&&(f(a,"dragover",this),f(a,"dragenter",this)),_.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){y&&y.state!==a&&(i(y,"display",a?"none":""),!a&&y.state&&z.insertBefore(y,v),y.state=a)}function c(a,b,c){if(a){c=c||S;do if(">*"===b&&a.parentNode===c||r(a,b))return a;while(a=d(a))}return null}function d(a){var b=a.host;return b&&b.nodeType?b:a.parentNode}function e(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function f(a,b,c){a.addEventListener(b,c,!1)}function g(a,b,c){a.removeEventListener(b,c,!1)}function h(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(P," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(P," ")}}function i(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return S.defaultView&&S.defaultView.getComputedStyle?c=S.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function j(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;e<f;e++)c(d[e],e);return d}return[]}function k(a,b,c,d,e,f,g){a=a||b[Q];var h=S.createEvent("Event"),i=a.options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=y,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function l(a,b,c,d,e,f,g){var h,i,j=a[Q],k=j.options.onMove;return h=S.createEvent("Event"),h.initEvent("move",!0,!0),h.to=b,h.from=a,h.dragged=c,h.draggedRect=d,h.related=e||b,h.relatedRect=f||b.getBoundingClientRect(),a.dispatchEvent(h),k&&(i=k.call(j,h,g)),i}function m(a){a.draggable=!1}function n(){Y=!1}function o(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return(b.clientY-(d.top+d.height)>5||b.clientX-(d.right+d.width)>5)&&c}function p(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function q(a,b){var c=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"===a.nodeName.toUpperCase()||">*"!==b&&!r(a,b)||c++;return c}function r(a,b){if(a){b=b.split(".");var c=b.shift().toUpperCase(),d=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");return!(""!==c&&a.nodeName.toUpperCase()!=c||b.length&&((" "+a.className+" ").match(d)||[]).length!=b.length)}return!1}function s(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function t(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function u(a){return U?U(a).clone(!0)[0]:V&&V.dom?V.dom(a).cloneNode(!0):a.cloneNode(!0)}if("undefined"==typeof window||!window.document)return function(){throw new Error("Sortable.js requires a window with a document")};var v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O={},P=/\s+/g,Q="Sortable"+(new Date).getTime(),R=window,S=R.document,T=R.parseInt,U=R.jQuery||R.Zepto,V=R.Polymer,W=!!("draggable"in S.createElement("div")),X=function(a){return!navigator.userAgent.match(/Trident.*rv[ :]?11\./)&&(a=S.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents)}(),Y=!1,Z=Math.abs,$=Math.min,_=([].slice,[]),aa=s(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h,i,j=b.scrollSensitivity,k=b.scrollSpeed,l=a.clientX,m=a.clientY,n=window.innerWidth,o=window.innerHeight;if(C!==c&&(B=b.scroll,C=c,D=b.scrollFn,B===!0)){B=c;do if(B.offsetWidth<B.scrollWidth||B.offsetHeight<B.scrollHeight)break;while(B=B.parentNode)}B&&(d=B,e=B.getBoundingClientRect(),f=(Z(e.right-l)<=j)-(Z(e.left-l)<=j),g=(Z(e.bottom-m)<=j)-(Z(e.top-m)<=j)),f||g||(f=(n-l<=j)-(l<=j),g=(o-m<=j)-(m<=j),(f||g)&&(d=R)),O.vx===f&&O.vy===g&&O.el===d||(O.el=d,O.vx=f,O.vy=g,clearInterval(O.pid),d&&(O.pid=setInterval(function(){return i=g?g*k:0,h=f?f*k:0,"function"==typeof D?D.call(_this,h,i,a):void(d===R?R.scrollTo(R.pageXOffset+h,R.pageYOffset+i):(d.scrollTop+=i,d.scrollLeft+=h))},24)))}},30),ba=function(a){function b(a,b){return void 0!==a&&a!==!0||(a=c.name),"function"==typeof a?a:function(c,d){var e=d.options.group.name;return b?a:a&&(a.join?a.indexOf(e)>-1:e==a)}}var c={},d=a.group;d&&"object"==typeof d||(d={name:d}),c.name=d.name,c.checkPull=b(d.pull,!0),c.checkPut=b(d.put),a.group=c};return a.prototype={constructor:a,_onTapStart:function(a){var b,d=this,e=this.el,f=this.options,g=a.type,h=a.touches&&a.touches[0],i=(h||a).target,j=a.target.shadowRoot&&a.path[0]||i,l=f.filter;if(!v&&!("mousedown"===g&&0!==a.button||f.disabled)&&(!f.handle||c(j,f.handle,e))&&(i=c(i,f.draggable,e))){if(b=q(i,f.draggable),"function"==typeof l){if(l.call(this,a,i,this))return k(d,j,"filter",i,e,b),void a.preventDefault()}else if(l&&(l=l.split(",").some(function(a){if(a=c(j,a.trim(),e))return k(d,a,"filter",i,e,b),!0})))return void a.preventDefault();this._prepareDragStart(a,h,i,b)}},_prepareDragStart:function(a,b,c,d){var e,g=this,i=g.el,l=g.options,n=i.ownerDocument;c&&!v&&c.parentNode===i&&(L=a,z=i,v=c,w=v.parentNode,A=v.nextSibling,J=l.group,H=d,this._lastX=(b||a).clientX,this._lastY=(b||a).clientY,v.style["will-change"]="transform",e=function(){g._disableDelayedDrag(),v.draggable=g.nativeDraggable,h(v,l.chosenClass,!0),g._triggerDragStart(a,b),k(g,z,"choose",v,z,H)},l.ignore.split(",").forEach(function(a){j(v,a.trim(),m)}),f(n,"mouseup",g._onDrop),f(n,"touchend",g._onDrop),f(n,"touchcancel",g._onDrop),f(n,"pointercancel",g._onDrop),l.delay?(f(n,"mouseup",g._disableDelayedDrag),f(n,"touchend",g._disableDelayedDrag),f(n,"touchcancel",g._disableDelayedDrag),f(n,"mousemove",g._disableDelayedDrag),f(n,"touchmove",g._disableDelayedDrag),f(n,"pointermove",g._disableDelayedDrag),g._dragStartTimer=setTimeout(e,l.delay)):e())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),g(a,"mouseup",this._disableDelayedDrag),g(a,"touchend",this._disableDelayedDrag),g(a,"touchcancel",this._disableDelayedDrag),g(a,"mousemove",this._disableDelayedDrag),g(a,"touchmove",this._disableDelayedDrag),g(a,"pointermove",this._disableDelayedDrag)},_triggerDragStart:function(a,b){b=b||("touch"==a.pointerType?a:null),b?(L={target:v,clientX:b.clientX,clientY:b.clientY},this._onDragStart(L,"touch")):this.nativeDraggable?(f(v,"dragend",this),f(z,"dragstart",this._onDragStart)):this._onDragStart(L,!0);try{S.selection?setTimeout(function(){S.selection.empty()}):window.getSelection().removeAllRanges()}catch(a){}},_dragStarted:function(){if(z&&v){var b=this.options;h(v,b.ghostClass,!0),h(v,b.dragClass,!1),a.active=this,k(this,z,"start",v,z,H)}},_emulateDragOver:function(){if(M){if(this._lastX===M.clientX&&this._lastY===M.clientY)return;this._lastX=M.clientX,this._lastY=M.clientY,X||i(x,"display","none");var a=S.elementFromPoint(M.clientX,M.clientY),b=a,c=_.length;if(b)do{if(b[Q]){for(;c--;)_[c]({clientX:M.clientX,clientY:M.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);X||i(x,"display","")}},_onTouchMove:function(b){if(L){var c=this.options,d=c.fallbackTolerance,e=c.fallbackOffset,f=b.touches?b.touches[0]:b,g=f.clientX-L.clientX+e.x,h=f.clientY-L.clientY+e.y,j=b.touches?"translate3d("+g+"px,"+h+"px,0)":"translate("+g+"px,"+h+"px)";if(!a.active){if(d&&$(Z(f.clientX-this._lastX),Z(f.clientY-this._lastY))<d)return;this._dragStarted()}this._appendGhost(),N=!0,M=f,i(x,"webkitTransform",j),i(x,"mozTransform",j),i(x,"msTransform",j),i(x,"transform",j),b.preventDefault()}},_appendGhost:function(){if(!x){var a,b=v.getBoundingClientRect(),c=i(v),d=this.options;x=v.cloneNode(!0),h(x,d.ghostClass,!1),h(x,d.fallbackClass,!0),h(x,d.dragClass,!0),i(x,"top",b.top-T(c.marginTop,10)),i(x,"left",b.left-T(c.marginLeft,10)),i(x,"width",b.width),i(x,"height",b.height),i(x,"opacity","0.8"),i(x,"position","fixed"),i(x,"zIndex","100000"),i(x,"pointerEvents","none"),d.fallbackOnBody&&S.body.appendChild(x)||z.appendChild(x),a=x.getBoundingClientRect(),i(x,"width",2*b.width-a.width),i(x,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;this._offUpEvents(),"clone"==J.checkPull(this,this,v,a)&&(y=u(v),i(y,"display","none"),z.insertBefore(y,v),k(this,z,"clone",v)),h(v,d.dragClass,!0),b?("touch"===b?(f(S,"touchmove",this._onTouchMove),f(S,"touchend",this._onDrop),f(S,"touchcancel",this._onDrop),f(S,"pointermove",this._onTouchMove),f(S,"pointerup",this._onDrop)):(f(S,"mousemove",this._onTouchMove),f(S,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,v)),f(S,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(d){var e,f,g,h,j=this.el,k=this.options,m=k.group,p=a.active,q=J===m,r=k.sort;if(void 0!==d.preventDefault&&(d.preventDefault(),!k.dragoverBubble&&d.stopPropagation()),N=!0,J&&!k.disabled&&(q?r||(h=!z.contains(v)):K===this||J.checkPull(this,p,v,d)&&m.checkPut(this,p,v,d))&&(void 0===d.rootEl||d.rootEl===this.el)){if(aa(d,k,this.el),Y)return;if(e=c(d.target,k.draggable,j),f=v.getBoundingClientRect(),K=this,h)return b(!0),w=z,void(y||A?z.insertBefore(v,y||A):r||z.appendChild(v));if(0===j.children.length||j.children[0]===x||j===d.target&&(e=o(j,d))){if(e){if(e.animated)return;g=e.getBoundingClientRect()}b(q),l(z,j,v,f,e,g,d)!==!1&&(v.contains(j)||(j.appendChild(v),w=j),this._animate(f,v),e&&this._animate(g,e))}else if(e&&!e.animated&&e!==v&&void 0!==e.parentNode[Q]){E!==e&&(E=e,F=i(e),G=i(e.parentNode)),g=e.getBoundingClientRect();var s,t=g.right-g.left,u=g.bottom-g.top,B=/left|right|inline/.test(F.cssFloat+F.display)||"flex"==G.display&&0===G["flex-direction"].indexOf("row"),C=e.offsetWidth>v.offsetWidth,D=e.offsetHeight>v.offsetHeight,H=(B?(d.clientX-g.left)/t:(d.clientY-g.top)/u)>.5,I=e.nextElementSibling,L=l(z,j,v,f,e,g,d);if(L!==!1){if(Y=!0,setTimeout(n,30),b(q),1===L||L===-1)s=1===L;else if(B){var M=v.offsetTop,O=e.offsetTop;s=M===O?e.previousElementSibling===v&&!C||H&&C:e.previousElementSibling===v||v.previousElementSibling===e?(d.clientY-g.top)/u>.5:O>M}else s=I!==v&&!D||H&&D;v.contains(j)||(s&&!I?j.appendChild(v):e.parentNode.insertBefore(v,s?I:e)),w=v.parentNode,this._animate(f,v),this._animate(g,e)}}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();i(b,"transition","none"),i(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,i(b,"transition","all "+c+"ms"),i(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){i(b,"transition",""),i(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;g(S,"touchmove",this._onTouchMove),g(S,"pointermove",this._onTouchMove),g(a,"mouseup",this._onDrop),g(a,"touchend",this._onDrop),g(a,"pointerup",this._onDrop),g(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(O.pid),clearTimeout(this._dragStartTimer),g(S,"mousemove",this._onTouchMove),this.nativeDraggable&&(g(S,"drop",this),g(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(N&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),x&&x.parentNode.removeChild(x),v&&(this.nativeDraggable&&g(v,"dragend",this),m(v),v.style["will-change"]="",h(v,this.options.ghostClass,!1),h(v,this.options.chosenClass,!1),z!==w?(I=q(v,d.draggable),I>=0&&(k(null,w,"add",v,z,H,I),k(this,z,"remove",v,z,H,I),k(null,w,"sort",v,z,H,I),k(this,z,"sort",v,z,H,I))):(y&&y.parentNode.removeChild(y),v.nextSibling!==A&&(I=q(v,d.draggable),I>=0&&(k(this,z,"update",v,z,H,I),k(this,z,"sort",v,z,H,I)))),a.active&&(null!=I&&I!==-1||(I=H),k(this,z,"end",v,z,H,I),this.save()))),this._nulling()},_nulling:function(){z=v=w=x=A=y=B=C=L=M=N=I=E=F=K=J=a.active=null},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?v&&(this._onDragOver(a),e(a)):"drop"!==b&&"dragend"!==b||this._onDrop(a)},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;e<f;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||p(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&ba(c)))},destroy:function(){var a=this.el;a[Q]=null,g(a,"mousedown",this._onTapStart),g(a,"touchstart",this._onTapStart),g(a,"pointerdown",this._onTapStart),this.nativeDraggable&&(g(a,"dragover",this),g(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),_.splice(_.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:f,off:g,css:i,find:j,is:function(a,b){return!!c(a,b,a)},extend:t,throttle:s,closest:c,toggleClass:h,clone:u,index:q},a.create=function(b,c){return new a(b,c)},a.version="1.5.0-rc1",a});

/**
 * Super simple wysiwyg editor v0.8.2
 * http://summernote.org/
 *
 * summernote.js
 * Copyright 2013-2016 Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license./
 *
 * Date: 2016-08-07T05:11Z
 */
(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
  'use strict';

  /**
   * @class core.func
   *
   * func utils (for high-order func's arg)
   *
   * @singleton
   * @alternateClassName func
   */
  var func = (function () {
    var eq = function (itemA) {
      return function (itemB) {
        return itemA === itemB;
      };
    };

    var eq2 = function (itemA, itemB) {
      return itemA === itemB;
    };

    var peq2 = function (propName) {
      return function (itemA, itemB) {
        return itemA[propName] === itemB[propName];
      };
    };

    var ok = function () {
      return true;
    };

    var fail = function () {
      return false;
    };

    var not = function (f) {
      return function () {
        return !f.apply(f, arguments);
      };
    };

    var and = function (fA, fB) {
      return function (item) {
        return fA(item) && fB(item);
      };
    };

    var self = function (a) {
      return a;
    };

    var invoke = function (obj, method) {
      return function () {
        return obj[method].apply(obj, arguments);
      };
    };

    var idCounter = 0;

    /**
     * generate a globally-unique id
     *
     * @param {String} [prefix]
     */
    var uniqueId = function (prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };

    /**
     * returns bnd (bounds) from rect
     *
     * - IE Compatibility Issue: http://goo.gl/sRLOAo
     * - Scroll Issue: http://goo.gl/sNjUc
     *
     * @param {Rect} rect
     * @return {Object} bounds
     * @return {Number} bounds.top
     * @return {Number} bounds.left
     * @return {Number} bounds.width
     * @return {Number} bounds.height
     */
    var rect2bnd = function (rect) {
      var $document = $(document);
      return {
        top: rect.top + $document.scrollTop(),
        left: rect.left + $document.scrollLeft(),
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    };

    /**
     * returns a copy of the object where the keys have become the values and the values the keys.
     * @param {Object} obj
     * @return {Object}
     */
    var invertObject = function (obj) {
      var inverted = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          inverted[obj[key]] = key;
        }
      }
      return inverted;
    };

    /**
     * @param {String} namespace
     * @param {String} [prefix]
     * @return {String}
     */
    var namespaceToCamel = function (namespace, prefix) {
      prefix = prefix || '';
      return prefix + namespace.split('.').map(function (name) {
        return name.substring(0, 1).toUpperCase() + name.substring(1);
      }).join('');
    };

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param {Function} func
     * @param {Number} wait
     * @param {Boolean} immediate
     * @return {Function}
     */
    var debounce = function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
      };
    };

    return {
      eq: eq,
      eq2: eq2,
      peq2: peq2,
      ok: ok,
      fail: fail,
      self: self,
      not: not,
      and: and,
      invoke: invoke,
      uniqueId: uniqueId,
      rect2bnd: rect2bnd,
      invertObject: invertObject,
      namespaceToCamel: namespaceToCamel,
      debounce: debounce
    };
  })();

  /**
   * @class core.list
   *
   * list utils
   *
   * @singleton
   * @alternateClassName list
   */
  var list = (function () {
    /**
     * returns the first item of an array.
     *
     * @param {Array} array
     */
    var head = function (array) {
      return array[0];
    };

    /**
     * returns the last item of an array.
     *
     * @param {Array} array
     */
    var last = function (array) {
      return array[array.length - 1];
    };

    /**
     * returns everything but the last entry of the array.
     *
     * @param {Array} array
     */
    var initial = function (array) {
      return array.slice(0, array.length - 1);
    };

    /**
     * returns the rest of the items in an array.
     *
     * @param {Array} array
     */
    var tail = function (array) {
      return array.slice(1);
    };

    /**
     * returns item of array
     */
    var find = function (array, pred) {
      for (var idx = 0, len = array.length; idx < len; idx ++) {
        var item = array[idx];
        if (pred(item)) {
          return item;
        }
      }
    };

    /**
     * returns true if all of the values in the array pass the predicate truth test.
     */
    var all = function (array, pred) {
      for (var idx = 0, len = array.length; idx < len; idx ++) {
        if (!pred(array[idx])) {
          return false;
        }
      }
      return true;
    };

    /**
     * returns index of item
     */
    var indexOf = function (array, item) {
      return $.inArray(item, array);
    };

    /**
     * returns true if the value is present in the list.
     */
    var contains = function (array, item) {
      return indexOf(array, item) !== -1;
    };

    /**
     * get sum from a list
     *
     * @param {Array} array - array
     * @param {Function} fn - iterator
     */
    var sum = function (array, fn) {
      fn = fn || func.self;
      return array.reduce(function (memo, v) {
        return memo + fn(v);
      }, 0);
    };

    /**
     * returns a copy of the collection with array type.
     * @param {Collection} collection - collection eg) node.childNodes, ...
     */
    var from = function (collection) {
      var result = [], idx = -1, length = collection.length;
      while (++idx < length) {
        result[idx] = collection[idx];
      }
      return result;
    };

    /**
     * returns whether list is empty or not
     */
    var isEmpty = function (array) {
      return !array || !array.length;
    };

    /**
     * cluster elements by predicate function.
     *
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     * @param {Array[]}
     */
    var clusterBy = function (array, fn) {
      if (!array.length) { return []; }
      var aTail = tail(array);
      return aTail.reduce(function (memo, v) {
        var aLast = last(memo);
        if (fn(last(aLast), v)) {
          aLast[aLast.length] = v;
        } else {
          memo[memo.length] = [v];
        }
        return memo;
      }, [[head(array)]]);
    };

    /**
     * returns a copy of the array with all false values removed
     *
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     */
    var compact = function (array) {
      var aResult = [];
      for (var idx = 0, len = array.length; idx < len; idx ++) {
        if (array[idx]) { aResult.push(array[idx]); }
      }
      return aResult;
    };

    /**
     * produces a duplicate-free version of the array
     *
     * @param {Array} array
     */
    var unique = function (array) {
      var results = [];

      for (var idx = 0, len = array.length; idx < len; idx ++) {
        if (!contains(results, array[idx])) {
          results.push(array[idx]);
        }
      }

      return results;
    };

    /**
     * returns next item.
     * @param {Array} array
     */
    var next = function (array, item) {
      var idx = indexOf(array, item);
      if (idx === -1) { return null; }

      return array[idx + 1];
    };

    /**
     * returns prev item.
     * @param {Array} array
     */
    var prev = function (array, item) {
      var idx = indexOf(array, item);
      if (idx === -1) { return null; }

      return array[idx - 1];
    };

    return { head: head, last: last, initial: initial, tail: tail,
             prev: prev, next: next, find: find, contains: contains,
             all: all, sum: sum, from: from, isEmpty: isEmpty,
             clusterBy: clusterBy, compact: compact, unique: unique };
  })();

  var isSupportAmd = typeof define === 'function' && define.amd;

  /**
   * returns whether font is installed or not.
   *
   * @param {String} fontName
   * @return {Boolean}
   */
  var isFontInstalled = function (fontName) {
    var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
    var $tester = $('<div>').css({
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      fontSize: '200px'
    }).text('mmmmmmmmmwwwwwww').appendTo(document.body);

    var originalWidth = $tester.css('fontFamily', testFontName).width();
    var width = $tester.css('fontFamily', fontName + ',' + testFontName).width();

    $tester.remove();

    return originalWidth !== width;
  };

  var userAgent = navigator.userAgent;
  var isMSIE = /MSIE|Trident/i.test(userAgent);
  var browserVersion;
  if (isMSIE) {
    var matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
    if (matches) {
      browserVersion = parseFloat(matches[1]);
    }
    matches = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(userAgent);
    if (matches) {
      browserVersion = parseFloat(matches[1]);
    }
  }

  var isEdge = /Edge\/\d+/.test(userAgent);

  var hasCodeMirror = !!window.CodeMirror;
  if (!hasCodeMirror && isSupportAmd && typeof require !== 'undefined') {
    if (typeof require.resolve !== 'undefined') {
      try {
        // If CodeMirror can't be resolved, `require.resolve` will throw an
        // exception and `hasCodeMirror` won't be set to `true`.
        require.resolve('codemirror');
        hasCodeMirror = true;
      } catch (e) {
        // Do nothing.
      }
    } else if (typeof eval('require').specified !== 'undefined') {
      hasCodeMirror = eval('require').specified('codemirror');
    }
  }

  /**
   * @class core.agent
   *
   * Object which check platform and agent
   *
   * @singleton
   * @alternateClassName agent
   */
  var agent = {
    isMac: navigator.appVersion.indexOf('Mac') > -1,
    isMSIE: isMSIE,
    isEdge: isEdge,
    isFF: !isEdge && /firefox/i.test(userAgent),
    isPhantom: /PhantomJS/i.test(userAgent),
    isWebkit: !isEdge && /webkit/i.test(userAgent),
    isChrome: !isEdge && /chrome/i.test(userAgent),
    isSafari: !isEdge && /safari/i.test(userAgent),
    browserVersion: browserVersion,
    jqueryVersion: parseFloat($.fn.jquery),
    isSupportAmd: isSupportAmd,
    hasCodeMirror: hasCodeMirror,
    isFontInstalled: isFontInstalled,
    isW3CRangeSupport: !!document.createRange
  };


  var NBSP_CHAR = String.fromCharCode(160);
  var ZERO_WIDTH_NBSP_CHAR = '\ufeff';

  /**
   * @class core.dom
   *
   * Dom functions
   *
   * @singleton
   * @alternateClassName dom
   */
  var dom = (function () {
    /**
     * @method isEditable
     *
     * returns whether node is `note-editable` or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    var isEditable = function (node) {
      return node && $(node).hasClass('note-editable');
    };

    /**
     * @method isControlSizing
     *
     * returns whether node is `note-control-sizing` or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    var isControlSizing = function (node) {
      return node && $(node).hasClass('note-control-sizing');
    };

    /**
     * @method makePredByNodeName
     *
     * returns predicate which judge whether nodeName is same
     *
     * @param {String} nodeName
     * @return {Function}
     */
    var makePredByNodeName = function (nodeName) {
      nodeName = nodeName.toUpperCase();
      return function (node) {
        return node && node.nodeName.toUpperCase() === nodeName;
      };
    };

    /**
     * @method isText
     *
     *
     *
     * @param {Node} node
     * @return {Boolean} true if node's type is text(3)
     */
    var isText = function (node) {
      return node && node.nodeType === 3;
    };

    /**
     * @method isElement
     *
     *
     *
     * @param {Node} node
     * @return {Boolean} true if node's type is element(1)
     */
    var isElement = function (node) {
      return node && node.nodeType === 1;
    };

    /**
     * ex) br, col, embed, hr, img, input, ...
     * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
     */
    var isVoid = function (node) {
      return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON/.test(node.nodeName.toUpperCase());
    };

    var isPara = function (node) {
      if (isEditable(node)) {
        return false;
      }

      // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
      return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
    };

    var isHeading = function (node) {
      return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
    };

    var isPre = makePredByNodeName('PRE');

    var isLi = makePredByNodeName('LI');

    var isPurePara = function (node) {
      return isPara(node) && !isLi(node);
    };

    var isTable = makePredByNodeName('TABLE');

    var isData = makePredByNodeName('DATA');

    var isInline = function (node) {
      return !isBodyContainer(node) &&
             !isList(node) &&
             !isHr(node) &&
             !isPara(node) &&
             !isTable(node) &&
             !isBlockquote(node) &&
             !isData(node);
    };

    var isList = function (node) {
      return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
    };

    var isHr = makePredByNodeName('HR');

    var isCell = function (node) {
      return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
    };

    var isBlockquote = makePredByNodeName('BLOCKQUOTE');

    var isBodyContainer = function (node) {
      return isCell(node) || isBlockquote(node) || isEditable(node);
    };

    var isAnchor = makePredByNodeName('A');

    var isParaInline = function (node) {
      return isInline(node) && !!ancestor(node, isPara);
    };

    var isBodyInline = function (node) {
      return isInline(node) && !ancestor(node, isPara);
    };

    var isBody = makePredByNodeName('BODY');

    /**
     * returns whether nodeB is closest sibling of nodeA
     *
     * @param {Node} nodeA
     * @param {Node} nodeB
     * @return {Boolean}
     */
    var isClosestSibling = function (nodeA, nodeB) {
      return nodeA.nextSibling === nodeB ||
             nodeA.previousSibling === nodeB;
    };

    /**
     * returns array of closest siblings with node
     *
     * @param {Node} node
     * @param {function} [pred] - predicate function
     * @return {Node[]}
     */
    var withClosestSiblings = function (node, pred) {
      pred = pred || func.ok;

      var siblings = [];
      if (node.previousSibling && pred(node.previousSibling)) {
        siblings.push(node.previousSibling);
      }
      siblings.push(node);
      if (node.nextSibling && pred(node.nextSibling)) {
        siblings.push(node.nextSibling);
      }
      return siblings;
    };

    /**
     * blank HTML for cursor position
     * - [workaround] old IE only works with &nbsp;
     * - [workaround] IE11 and other browser works with bogus br
     */
    var blankHTML = agent.isMSIE && agent.browserVersion < 11 ? '&nbsp;' : '<br>';

    /**
     * @method nodeLength
     *
     * returns #text's text size or element's childNodes size
     *
     * @param {Node} node
     */
    var nodeLength = function (node) {
      if (isText(node)) {
        return node.nodeValue.length;
      }

      if (node) {
        return node.childNodes.length;
      }

      return 0;

    };

    /**
     * returns whether node is empty or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    var isEmpty = function (node) {
      var len = nodeLength(node);

      if (len === 0) {
        return true;
      } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
        // ex) <p><br></p>, <span><br></span>
        return true;
      } else if (list.all(node.childNodes, isText) && node.innerHTML === '') {
        // ex) <p></p>, <span></span>
        return true;
      }

      return false;
    };

    /**
     * padding blankHTML if node is empty (for cursor position)
     */
    var paddingBlankHTML = function (node) {
      if (!isVoid(node) && !nodeLength(node)) {
        node.innerHTML = blankHTML;
      }
    };

    /**
     * find nearest ancestor predicate hit
     *
     * @param {Node} node
     * @param {Function} pred - predicate function
     */
    var ancestor = function (node, pred) {
      while (node) {
        if (pred(node)) { return node; }
        if (isEditable(node)) { break; }

        node = node.parentNode;
      }
      return null;
    };

    /**
     * find nearest ancestor only single child blood line and predicate hit
     *
     * @param {Node} node
     * @param {Function} pred - predicate function
     */
    var singleChildAncestor = function (node, pred) {
      node = node.parentNode;

      while (node) {
        if (nodeLength(node) !== 1) { break; }
        if (pred(node)) { return node; }
        if (isEditable(node)) { break; }

        node = node.parentNode;
      }
      return null;
    };

    /**
     * returns new array of ancestor nodes (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [optional] pred - predicate function
     */
    var listAncestor = function (node, pred) {
      pred = pred || func.fail;

      var ancestors = [];
      ancestor(node, function (el) {
        if (!isEditable(el)) {
          ancestors.push(el);
        }

        return pred(el);
      });
      return ancestors;
    };

    /**
     * find farthest ancestor predicate hit
     */
    var lastAncestor = function (node, pred) {
      var ancestors = listAncestor(node);
      return list.last(ancestors.filter(pred));
    };

    /**
     * returns common ancestor node between two nodes.
     *
     * @param {Node} nodeA
     * @param {Node} nodeB
     */
    var commonAncestor = function (nodeA, nodeB) {
      var ancestors = listAncestor(nodeA);
      for (var n = nodeB; n; n = n.parentNode) {
        if ($.inArray(n, ancestors) > -1) { return n; }
      }
      return null; // difference document area
    };

    /**
     * listing all previous siblings (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [optional] pred - predicate function
     */
    var listPrev = function (node, pred) {
      pred = pred || func.fail;

      var nodes = [];
      while (node) {
        if (pred(node)) { break; }
        nodes.push(node);
        node = node.previousSibling;
      }
      return nodes;
    };

    /**
     * listing next siblings (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [pred] - predicate function
     */
    var listNext = function (node, pred) {
      pred = pred || func.fail;

      var nodes = [];
      while (node) {
        if (pred(node)) { break; }
        nodes.push(node);
        node = node.nextSibling;
      }
      return nodes;
    };

    /**
     * listing descendant nodes
     *
     * @param {Node} node
     * @param {Function} [pred] - predicate function
     */
    var listDescendant = function (node, pred) {
      var descendants = [];
      pred = pred || func.ok;

      // start DFS(depth first search) with node
      (function fnWalk(current) {
        if (node !== current && pred(current)) {
          descendants.push(current);
        }
        for (var idx = 0, len = current.childNodes.length; idx < len; idx++) {
          fnWalk(current.childNodes[idx]);
        }
      })(node);

      return descendants;
    };

    /**
     * wrap node with new tag.
     *
     * @param {Node} node
     * @param {Node} tagName of wrapper
     * @return {Node} - wrapper
     */
    var wrap = function (node, wrapperName) {
      var parent = node.parentNode;
      var wrapper = $('<' + wrapperName + '>')[0];

      parent.insertBefore(wrapper, node);
      wrapper.appendChild(node);

      return wrapper;
    };

    /**
     * insert node after preceding
     *
     * @param {Node} node
     * @param {Node} preceding - predicate function
     */
    var insertAfter = function (node, preceding) {
      var next = preceding.nextSibling, parent = preceding.parentNode;
      if (next) {
        parent.insertBefore(node, next);
      } else {
        parent.appendChild(node);
      }
      return node;
    };

    /**
     * append elements.
     *
     * @param {Node} node
     * @param {Collection} aChild
     */
    var appendChildNodes = function (node, aChild) {
      $.each(aChild, function (idx, child) {
        node.appendChild(child);
      });
      return node;
    };

    /**
     * returns whether boundaryPoint is left edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    var isLeftEdgePoint = function (point) {
      return point.offset === 0;
    };

    /**
     * returns whether boundaryPoint is right edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    var isRightEdgePoint = function (point) {
      return point.offset === nodeLength(point.node);
    };

    /**
     * returns whether boundaryPoint is edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    var isEdgePoint = function (point) {
      return isLeftEdgePoint(point) || isRightEdgePoint(point);
    };

    /**
     * returns whether node is left edge of ancestor or not.
     *
     * @param {Node} node
     * @param {Node} ancestor
     * @return {Boolean}
     */
    var isLeftEdgeOf = function (node, ancestor) {
      while (node && node !== ancestor) {
        if (position(node) !== 0) {
          return false;
        }
        node = node.parentNode;
      }

      return true;
    };

    /**
     * returns whether node is right edge of ancestor or not.
     *
     * @param {Node} node
     * @param {Node} ancestor
     * @return {Boolean}
     */
    var isRightEdgeOf = function (node, ancestor) {
      if (!ancestor) {
        return false;
      }
      while (node && node !== ancestor) {
        if (position(node) !== nodeLength(node.parentNode) - 1) {
          return false;
        }
        node = node.parentNode;
      }

      return true;
    };

    /**
     * returns whether point is left edge of ancestor or not.
     * @param {BoundaryPoint} point
     * @param {Node} ancestor
     * @return {Boolean}
     */
    var isLeftEdgePointOf = function (point, ancestor) {
      return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
    };

    /**
     * returns whether point is right edge of ancestor or not.
     * @param {BoundaryPoint} point
     * @param {Node} ancestor
     * @return {Boolean}
     */
    var isRightEdgePointOf = function (point, ancestor) {
      return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
    };

    /**
     * returns offset from parent.
     *
     * @param {Node} node
     */
    var position = function (node) {
      var offset = 0;
      while ((node = node.previousSibling)) {
        offset += 1;
      }
      return offset;
    };

    var hasChildren = function (node) {
      return !!(node && node.childNodes && node.childNodes.length);
    };

    /**
     * returns previous boundaryPoint
     *
     * @param {BoundaryPoint} point
     * @param {Boolean} isSkipInnerOffset
     * @return {BoundaryPoint}
     */
    var prevPoint = function (point, isSkipInnerOffset) {
      var node, offset;

      if (point.offset === 0) {
        if (isEditable(point.node)) {
          return null;
        }

        node = point.node.parentNode;
        offset = position(point.node);
      } else if (hasChildren(point.node)) {
        node = point.node.childNodes[point.offset - 1];
        offset = nodeLength(node);
      } else {
        node = point.node;
        offset = isSkipInnerOffset ? 0 : point.offset - 1;
      }

      return {
        node: node,
        offset: offset
      };
    };

    /**
     * returns next boundaryPoint
     *
     * @param {BoundaryPoint} point
     * @param {Boolean} isSkipInnerOffset
     * @return {BoundaryPoint}
     */
    var nextPoint = function (point, isSkipInnerOffset) {
      var node, offset;

      if (nodeLength(point.node) === point.offset) {
        if (isEditable(point.node)) {
          return null;
        }

        node = point.node.parentNode;
        offset = position(point.node) + 1;
      } else if (hasChildren(point.node)) {
        node = point.node.childNodes[point.offset];
        offset = 0;
      } else {
        node = point.node;
        offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
      }

      return {
        node: node,
        offset: offset
      };
    };

    /**
     * returns whether pointA and pointB is same or not.
     *
     * @param {BoundaryPoint} pointA
     * @param {BoundaryPoint} pointB
     * @return {Boolean}
     */
    var isSamePoint = function (pointA, pointB) {
      return pointA.node === pointB.node && pointA.offset === pointB.offset;
    };

    /**
     * returns whether point is visible (can set cursor) or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    var isVisiblePoint = function (point) {
      if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
        return true;
      }

      var leftNode = point.node.childNodes[point.offset - 1];
      var rightNode = point.node.childNodes[point.offset];
      if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
        return true;
      }

      return false;
    };

    /**
     * @method prevPointUtil
     *
     * @param {BoundaryPoint} point
     * @param {Function} pred
     * @return {BoundaryPoint}
     */
    var prevPointUntil = function (point, pred) {
      while (point) {
        if (pred(point)) {
          return point;
        }

        point = prevPoint(point);
      }

      return null;
    };

    /**
     * @method nextPointUntil
     *
     * @param {BoundaryPoint} point
     * @param {Function} pred
     * @return {BoundaryPoint}
     */
    var nextPointUntil = function (point, pred) {
      while (point) {
        if (pred(point)) {
          return point;
        }

        point = nextPoint(point);
      }

      return null;
    };

    /**
     * returns whether point has character or not.
     *
     * @param {Point} point
     * @return {Boolean}
     */
    var isCharPoint = function (point) {
      if (!isText(point.node)) {
        return false;
      }

      var ch = point.node.nodeValue.charAt(point.offset - 1);
      return ch && (ch !== ' ' && ch !== NBSP_CHAR);
    };

    /**
     * @method walkPoint
     *
     * @param {BoundaryPoint} startPoint
     * @param {BoundaryPoint} endPoint
     * @param {Function} handler
     * @param {Boolean} isSkipInnerOffset
     */
    var walkPoint = function (startPoint, endPoint, handler, isSkipInnerOffset) {
      var point = startPoint;

      while (point) {
        handler(point);

        if (isSamePoint(point, endPoint)) {
          break;
        }

        var isSkipOffset = isSkipInnerOffset &&
                           startPoint.node !== point.node &&
                           endPoint.node !== point.node;
        point = nextPoint(point, isSkipOffset);
      }
    };

    /**
     * @method makeOffsetPath
     *
     * return offsetPath(array of offset) from ancestor
     *
     * @param {Node} ancestor - ancestor node
     * @param {Node} node
     */
    var makeOffsetPath = function (ancestor, node) {
      var ancestors = listAncestor(node, func.eq(ancestor));
      return ancestors.map(position).reverse();
    };

    /**
     * @method fromOffsetPath
     *
     * return element from offsetPath(array of offset)
     *
     * @param {Node} ancestor - ancestor node
     * @param {array} offsets - offsetPath
     */
    var fromOffsetPath = function (ancestor, offsets) {
      var current = ancestor;
      for (var i = 0, len = offsets.length; i < len; i++) {
        if (current.childNodes.length <= offsets[i]) {
          current = current.childNodes[current.childNodes.length - 1];
        } else {
          current = current.childNodes[offsets[i]];
        }
      }
      return current;
    };

    /**
     * @method splitNode
     *
     * split element or #text
     *
     * @param {BoundaryPoint} point
     * @param {Object} [options]
     * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
     * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
     * @return {Node} right node of boundaryPoint
     */
    var splitNode = function (point, options) {
      var isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
      var isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;

      // edge case
      if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
        if (isLeftEdgePoint(point)) {
          return point.node;
        } else if (isRightEdgePoint(point)) {
          return point.node.nextSibling;
        }
      }

      // split #text
      if (isText(point.node)) {
        return point.node.splitText(point.offset);
      } else {
        var childNode = point.node.childNodes[point.offset];
        var clone = insertAfter(point.node.cloneNode(false), point.node);
        appendChildNodes(clone, listNext(childNode));

        if (!isSkipPaddingBlankHTML) {
          paddingBlankHTML(point.node);
          paddingBlankHTML(clone);
        }

        return clone;
      }
    };

    /**
     * @method splitTree
     *
     * split tree by point
     *
     * @param {Node} root - split root
     * @param {BoundaryPoint} point
     * @param {Object} [options]
     * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
     * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
     * @return {Node} right node of boundaryPoint
     */
    var splitTree = function (root, point, options) {
      // ex) [#text, <span>, <p>]
      var ancestors = listAncestor(point.node, func.eq(root));

      if (!ancestors.length) {
        return null;
      } else if (ancestors.length === 1) {
        return splitNode(point, options);
      }

      return ancestors.reduce(function (node, parent) {
        if (node === point.node) {
          node = splitNode(point, options);
        }

        return splitNode({
          node: parent,
          offset: node ? dom.position(node) : nodeLength(parent)
        }, options);
      });
    };

    /**
     * split point
     *
     * @param {Point} point
     * @param {Boolean} isInline
     * @return {Object}
     */
    var splitPoint = function (point, isInline) {
      // find splitRoot, container
      //  - inline: splitRoot is a child of paragraph
      //  - block: splitRoot is a child of bodyContainer
      var pred = isInline ? isPara : isBodyContainer;
      var ancestors = listAncestor(point.node, pred);
      var topAncestor = list.last(ancestors) || point.node;

      var splitRoot, container;
      if (pred(topAncestor)) {
        splitRoot = ancestors[ancestors.length - 2];
        container = topAncestor;
      } else {
        splitRoot = topAncestor;
        container = splitRoot.parentNode;
      }

      // if splitRoot is exists, split with splitTree
      var pivot = splitRoot && splitTree(splitRoot, point, {
        isSkipPaddingBlankHTML: isInline,
        isNotSplitEdgePoint: isInline
      });

      // if container is point.node, find pivot with point.offset
      if (!pivot && container === point.node) {
        pivot = point.node.childNodes[point.offset];
      }

      return {
        rightNode: pivot,
        container: container
      };
    };

    var create = function (nodeName) {
      return document.createElement(nodeName);
    };

    var createText = function (text) {
      return document.createTextNode(text);
    };

    /**
     * @method remove
     *
     * remove node, (isRemoveChild: remove child or not)
     *
     * @param {Node} node
     * @param {Boolean} isRemoveChild
     */
    var remove = function (node, isRemoveChild) {
      if (!node || !node.parentNode) { return; }
      if (node.removeNode) { return node.removeNode(isRemoveChild); }

      var parent = node.parentNode;
      if (!isRemoveChild) {
        var nodes = [];
        var i, len;
        for (i = 0, len = node.childNodes.length; i < len; i++) {
          nodes.push(node.childNodes[i]);
        }

        for (i = 0, len = nodes.length; i < len; i++) {
          parent.insertBefore(nodes[i], node);
        }
      }

      parent.removeChild(node);
    };

    /**
     * @method removeWhile
     *
     * @param {Node} node
     * @param {Function} pred
     */
    var removeWhile = function (node, pred) {
      while (node) {
        if (isEditable(node) || !pred(node)) {
          break;
        }

        var parent = node.parentNode;
        remove(node);
        node = parent;
      }
    };

    /**
     * @method replace
     *
     * replace node with provided nodeName
     *
     * @param {Node} node
     * @param {String} nodeName
     * @return {Node} - new node
     */
    var replace = function (node, nodeName) {
      if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
        return node;
      }

      var newNode = create(nodeName);

      if (node.style.cssText) {
        newNode.style.cssText = node.style.cssText;
      }

      appendChildNodes(newNode, list.from(node.childNodes));
      insertAfter(newNode, node);
      remove(node);

      return newNode;
    };

    var isTextarea = makePredByNodeName('TEXTAREA');

    /**
     * @param {jQuery} $node
     * @param {Boolean} [stripLinebreaks] - default: false
     */
    var value = function ($node, stripLinebreaks) {
      var val = isTextarea($node[0]) ? $node.val() : $node.html();
      if (stripLinebreaks) {
        return val.replace(/[\n\r]/g, '');
      }
      return val;
    };

    /**
     * @method html
     *
     * get the HTML contents of node
     *
     * @param {jQuery} $node
     * @param {Boolean} [isNewlineOnBlock]
     */
    var html = function ($node, isNewlineOnBlock) {
      var markup = value($node);

      if (isNewlineOnBlock) {
        var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
        markup = markup.replace(regexTag, function (match, endSlash, name) {
          name = name.toUpperCase();
          var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
                                       !!endSlash;
          var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);

          return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
        });
        markup = $.trim(markup);
      }

      return markup;
    };

    var posFromPlaceholder = function (placeholder) {
      var $placeholder = $(placeholder);
      var pos = $placeholder.offset();
      var height = $placeholder.outerHeight(true); // include margin

      return {
        left: pos.left,
        top: pos.top + height
      };
    };

    var attachEvents = function ($node, events) {
      Object.keys(events).forEach(function (key) {
        $node.on(key, events[key]);
      });
    };

    var detachEvents = function ($node, events) {
      Object.keys(events).forEach(function (key) {
        $node.off(key, events[key]);
      });
    };

    return {
      /** @property {String} NBSP_CHAR */
      NBSP_CHAR: NBSP_CHAR,
      /** @property {String} ZERO_WIDTH_NBSP_CHAR */
      ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR,
      /** @property {String} blank */
      blank: blankHTML,
      /** @property {String} emptyPara */
      emptyPara: '<p>' + blankHTML + '</p>',
      makePredByNodeName: makePredByNodeName,
      isEditable: isEditable,
      isControlSizing: isControlSizing,
      isText: isText,
      isElement: isElement,
      isVoid: isVoid,
      isPara: isPara,
      isPurePara: isPurePara,
      isHeading: isHeading,
      isInline: isInline,
      isBlock: func.not(isInline),
      isBodyInline: isBodyInline,
      isBody: isBody,
      isParaInline: isParaInline,
      isPre: isPre,
      isList: isList,
      isTable: isTable,
      isData: isData,
      isCell: isCell,
      isBlockquote: isBlockquote,
      isBodyContainer: isBodyContainer,
      isAnchor: isAnchor,
      isDiv: makePredByNodeName('DIV'),
      isLi: isLi,
      isBR: makePredByNodeName('BR'),
      isSpan: makePredByNodeName('SPAN'),
      isB: makePredByNodeName('B'),
      isU: makePredByNodeName('U'),
      isS: makePredByNodeName('S'),
      isI: makePredByNodeName('I'),
      isImg: makePredByNodeName('IMG'),
      isTextarea: isTextarea,
      isEmpty: isEmpty,
      isEmptyAnchor: func.and(isAnchor, isEmpty),
      isClosestSibling: isClosestSibling,
      withClosestSiblings: withClosestSiblings,
      nodeLength: nodeLength,
      isLeftEdgePoint: isLeftEdgePoint,
      isRightEdgePoint: isRightEdgePoint,
      isEdgePoint: isEdgePoint,
      isLeftEdgeOf: isLeftEdgeOf,
      isRightEdgeOf: isRightEdgeOf,
      isLeftEdgePointOf: isLeftEdgePointOf,
      isRightEdgePointOf: isRightEdgePointOf,
      prevPoint: prevPoint,
      nextPoint: nextPoint,
      isSamePoint: isSamePoint,
      isVisiblePoint: isVisiblePoint,
      prevPointUntil: prevPointUntil,
      nextPointUntil: nextPointUntil,
      isCharPoint: isCharPoint,
      walkPoint: walkPoint,
      ancestor: ancestor,
      singleChildAncestor: singleChildAncestor,
      listAncestor: listAncestor,
      lastAncestor: lastAncestor,
      listNext: listNext,
      listPrev: listPrev,
      listDescendant: listDescendant,
      commonAncestor: commonAncestor,
      wrap: wrap,
      insertAfter: insertAfter,
      appendChildNodes: appendChildNodes,
      position: position,
      hasChildren: hasChildren,
      makeOffsetPath: makeOffsetPath,
      fromOffsetPath: fromOffsetPath,
      splitTree: splitTree,
      splitPoint: splitPoint,
      create: create,
      createText: createText,
      remove: remove,
      removeWhile: removeWhile,
      replace: replace,
      html: html,
      value: value,
      posFromPlaceholder: posFromPlaceholder,
      attachEvents: attachEvents,
      detachEvents: detachEvents
    };
  })();

  /**
   * @param {jQuery} $note
   * @param {Object} options
   * @return {Context}
   */
  var Context = function ($note, options) {
    var self = this;

    var ui = $.summernote.ui;
    this.memos = {};
    this.modules = {};
    this.layoutInfo = {};
    this.options = options;

    /**
     * create layout and initialize modules and other resources
     */
    this.initialize = function () {
      this.layoutInfo = ui.createLayout($note, options);
      this._initialize();
      $note.hide();
      return this;
    };

    /**
     * destroy modules and other resources and remove layout
     */
    this.destroy = function () {
      this._destroy();
      $note.removeData('summernote');
      ui.removeLayout($note, this.layoutInfo);
    };

    /**
     * destory modules and other resources and initialize it again
     */
    this.reset = function () {
      var disabled = self.isDisabled();
      this.code(dom.emptyPara);
      this._destroy();
      this._initialize();

      if (disabled) {
        self.disable();
      }
    };

    this._initialize = function () {
      // add optional buttons
      var buttons = $.extend({}, this.options.buttons);
      Object.keys(buttons).forEach(function (key) {
        self.memo('button.' + key, buttons[key]);
      });

      var modules = $.extend({}, this.options.modules, $.summernote.plugins || {});

      // add and initialize modules
      Object.keys(modules).forEach(function (key) {
        self.module(key, modules[key], true);
      });

      Object.keys(this.modules).forEach(function (key) {
        self.initializeModule(key);
      });
    };

    this._destroy = function () {
      // destroy modules with reversed order
      Object.keys(this.modules).reverse().forEach(function (key) {
        self.removeModule(key);
      });

      Object.keys(this.memos).forEach(function (key) {
        self.removeMemo(key);
      });
    };

    this.code = function (html) {
      var isActivated = this.invoke('codeview.isActivated');

      if (html === undefined) {
        this.invoke('codeview.sync');
        return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
      } else {
        if (isActivated) {
          this.layoutInfo.codable.val(html);
        } else {
          this.layoutInfo.editable.html(html);
        }
        $note.val(html);
        this.triggerEvent('change', html);
      }
    };

    this.isDisabled = function () {
      return this.layoutInfo.editable.attr('contenteditable') === 'false';
    };

    this.enable = function () {
      this.layoutInfo.editable.attr('contenteditable', true);
      this.invoke('toolbar.activate', true);
    };

    this.disable = function () {
      // close codeview if codeview is opend
      if (this.invoke('codeview.isActivated')) {
        this.invoke('codeview.deactivate');
      }
      this.layoutInfo.editable.attr('contenteditable', false);
      this.invoke('toolbar.deactivate', true);
    };

    this.triggerEvent = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.initializeModule = function (key) {
      var module = this.modules[key];
      module.shouldInitialize = module.shouldInitialize || func.ok;
      if (!module.shouldInitialize()) {
        return;
      }

      // initialize module
      if (module.initialize) {
        module.initialize();
      }

      // attach events
      if (module.events) {
        dom.attachEvents($note, module.events);
      }
    };

    this.module = function (key, ModuleClass, withoutIntialize) {
      if (arguments.length === 1) {
        return this.modules[key];
      }

      this.modules[key] = new ModuleClass(this);

      if (!withoutIntialize) {
        this.initializeModule(key);
      }
    };

    this.removeModule = function (key) {
      var module = this.modules[key];
      if (module.shouldInitialize()) {
        if (module.events) {
          dom.detachEvents($note, module.events);
        }

        if (module.destroy) {
          module.destroy();
        }
      }

      delete this.modules[key];
    };

    this.memo = function (key, obj) {
      if (arguments.length === 1) {
        return this.memos[key];
      }
      this.memos[key] = obj;
    };

    this.removeMemo = function (key) {
      if (this.memos[key] && this.memos[key].destroy) {
        this.memos[key].destroy();
      }

      delete this.memos[key];
    };

    this.createInvokeHandler = function (namespace, value) {
      return function (event) {
        event.preventDefault();
        self.invoke(namespace, value || $(event.target).closest('[data-value]').data('value'));
      };
    };

    this.invoke = function () {
      var namespace = list.head(arguments);
      var args = list.tail(list.from(arguments));

      var splits = namespace.split('.');
      var hasSeparator = splits.length > 1;
      var moduleName = hasSeparator && list.head(splits);
      var methodName = hasSeparator ? list.last(splits) : list.head(splits);

      var module = this.modules[moduleName || 'editor'];
      if (!moduleName && this[methodName]) {
        return this[methodName].apply(this, args);
      } else if (module && module[methodName] && module.shouldInitialize()) {
        return module[methodName].apply(module, args);
      }
    };

    return this.initialize();
  };

  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function () {
      var type = $.type(list.head(arguments));
      var isExternalAPICalled = type === 'string';
      var hasInitOptions = type === 'object';

      var options = hasInitOptions ? list.head(arguments) : {};

      options = $.extend({}, $.summernote.options, options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.icons = $.extend(true, {}, $.summernote.options.icons, options.icons);

      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          var context = new Context($note, options);
          $note.data('summernote', context);
          $note.data('summernote').triggerEvent('init', context.layoutInfo);
        }
      });

      var $note = this.first();
      if ($note.length) {
        var context = $note.data('summernote');
        if (isExternalAPICalled) {
          return context.invoke.apply(context, list.from(arguments));
        } else if (options.focus) {
          context.invoke('editor.focus');
        }
      }

      return this;
    }
  });


  var Renderer = function (markup, children, options, callback) {
    this.render = function ($parent) {
      var $node = $(markup);

      if (options && options.contents) {
        $node.html(options.contents);
      }

      if (options && options.className) {
        $node.addClass(options.className);
      }

      if (options && options.data) {
        $.each(options.data, function (k, v) {
          $node.attr('data-' + k, v);
        });
      }

      if (options && options.click) {
        $node.on('click', options.click);
      }

      if (children) {
        var $container = $node.find('.note-children-container');
        children.forEach(function (child) {
          child.render($container.length ? $container : $node);
        });
      }

      if (callback) {
        callback($node, options);
      }

      if (options && options.callback) {
        options.callback($node);
      }

      if ($parent) {
        $parent.append($node);
      }

      return $node;
    };
  };

  var renderer = {
    create: function (markup, callback) {
      return function () {
        var children = $.isArray(arguments[0]) ? arguments[0] : [];
        var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
        if (options && options.children) {
          children = options.children;
        }
        return new Renderer(markup, children, options, callback);
      };
    }
  };

  var editor = renderer.create('<div class="note-editor note-frame panel panel-default"/>');
  var toolbar = renderer.create('<div class="note-toolbar panel-heading"/>');
  var editingArea = renderer.create('<div class="note-editing-area"/>');
  var codable = renderer.create('<textarea class="note-codable"/>');
  var editable = renderer.create('<div class="note-editable panel-body" contentEditable="true"/>');
  var statusbar = renderer.create([
    '<div class="note-statusbar">',
    '  <div class="note-resizebar">',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '  </div>',
    '</div>'
  ].join(''));

  var airEditor = renderer.create('<div class="note-editor"/>');
  var airEditable = renderer.create('<div class="note-editable" contentEditable="true"/>');

  var buttonGroup = renderer.create('<div class="note-btn-group btn-group">');
  var button = renderer.create('<button type="button" class="note-btn btn btn-default btn-sm" tabindex="-1">', function ($node, options) {
    if (options && options.tooltip) {
      $node.attr({
        title: options.tooltip
      }).tooltip({
        container: 'body',
        trigger: 'hover',
        placement: 'bottom'
      });
    }
  });

  var dropdown = renderer.create('<div class="dropdown-menu">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      var value = (typeof item === 'string') ? item : (item.value || '');
      var content = options.template ? options.template(item) : item;
      return '<li><a href="#" data-value="' + value + '">' + content + '</a></li>';
    }).join('') : options.items;

    $node.html(markup);
  });

  var dropdownCheck = renderer.create('<div class="dropdown-menu note-check">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      var value = (typeof item === 'string') ? item : (item.value || '');
      var content = options.template ? options.template(item) : item;
      return '<li><a href="#" data-value="' + value + '">' + icon(options.checkClassName) + ' ' + content + '</a></li>';
    }).join('') : options.items;
    $node.html(markup);
  });

  var palette = renderer.create('<div class="note-color-palette"/>', function ($node, options) {
    var contents = [];
    for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) {
      var eventName = options.eventName;
      var colors = options.colors[row];
      var buttons = [];
      for (var col = 0, colSize = colors.length; col < colSize; col++) {
        var color = colors[col];
        buttons.push([
          '<button type="button" class="note-color-btn"',
          'style="background-color:', color, '" ',
          'data-event="', eventName, '" ',
          'data-value="', color, '" ',
          'title="', color, '" ',
          'data-toggle="button" tabindex="-1"></button>'
        ].join(''));
      }
      contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
    }
    $node.html(contents.join(''));

    $node.find('.note-color-btn').tooltip({
      container: 'body',
      trigger: 'hover',
      placement: 'bottom'
    });
  });

  var dialog = renderer.create('<div class="modal" aria-hidden="false" tabindex="-1"/>', function ($node, options) {
    if (options.fade) {
      $node.addClass('fade');
    }
    $node.html([
      '<div class="modal-dialog">',
      '  <div class="modal-content">',
      (options.title ?
      '    <div class="modal-header">' +
      '      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      '      <h4 class="modal-title">' + options.title + '</h4>' +
      '    </div>' : ''
      ),
      '    <div class="modal-body">' + options.body + '</div>',
      (options.footer ?
      '    <div class="modal-footer">' + options.footer + '</div>' : ''
      ),
      '  </div>',
      '</div>'
    ].join(''));
  });

  var popover = renderer.create([
    '<div class="note-popover popover in">',
    '  <div class="arrow"/>',
    '  <div class="popover-content note-children-container"/>',
    '</div>'
  ].join(''), function ($node, options) {
    var direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';

    $node.addClass(direction);

    if (options.hideArrow) {
      $node.find('.arrow').hide();
    }
  });

  var icon = function (iconClassName, tagName) {
    tagName = tagName || 'i';
    return '<' + tagName + ' class="' + iconClassName + '"/>';
  };

  var ui = {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    button: button,
    dropdown: dropdown,
    dropdownCheck: dropdownCheck,
    palette: palette,
    dialog: dialog,
    popover: popover,
    icon: icon,

    toggleBtn: function ($btn, isEnable) {
      $btn.toggleClass('disabled', !isEnable);
      $btn.attr('disabled', !isEnable);
    },

    toggleBtnActive: function ($btn, isActive) {
      $btn.toggleClass('active', isActive);
    },

    onDialogShown: function ($dialog, handler) {
      $dialog.one('shown.bs.modal', handler);
    },

    onDialogHidden: function ($dialog, handler) {
      $dialog.one('hidden.bs.modal', handler);
    },

    showDialog: function ($dialog) {
      $dialog.modal('show');
    },

    hideDialog: function ($dialog) {
      $dialog.modal('hide');
    },

    createLayout: function ($note, options) {
      var $editor = (options.airMode ? ui.airEditor([
        ui.editingArea([
          ui.airEditable()
        ])
      ]) : ui.editor([
        ui.toolbar(),
        ui.editingArea([
          ui.codable(),
          ui.editable()
        ]),
        ui.statusbar()
      ])).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar')
      };
    },

    removeLayout: function ($note, layoutInfo) {
      $note.html(layoutInfo.editable.html());
      layoutInfo.editor.remove();
      $note.show();
    }
  };

  $.summernote = $.summernote || {
    lang: {}
  };

  $.extend($.summernote.lang, {
    'en-US': {
      font: {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        clear: 'Remove Font Style',
        height: 'Line Height',
        name: 'Font Family',
        strikethrough: 'Strikethrough',
        subscript: 'Subscript',
        superscript: 'Superscript',
        size: 'Font Size'
      },
      image: {
        image: 'Picture',
        insert: 'Insert Image',
        resizeFull: 'Resize Full',
        resizeHalf: 'Resize Half',
        resizeQuarter: 'Resize Quarter',
        floatLeft: 'Float Left',
        floatRight: 'Float Right',
        floatNone: 'Float None',
        shapeRounded: 'Shape: Rounded',
        shapeCircle: 'Shape: Circle',
        shapeThumbnail: 'Shape: Thumbnail',
        shapeNone: 'Shape: None',
        dragImageHere: 'Drag image or text here',
        dropImage: 'Drop image or Text',
        selectFromFiles: 'Select from files',
        maximumFileSize: 'Maximum file size',
        maximumFileSizeError: 'Maximum file size exceeded.',
        url: 'Image URL',
        remove: 'Remove Image'
      },
      video: {
        video: 'Video',
        videoLink: 'Video Link',
        insert: 'Insert Video',
        url: 'Video URL?',
        providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
      },
      link: {
        link: 'Link',
        insert: 'Insert Link',
        unlink: 'Unlink',
        edit: 'Edit',
        textToDisplay: 'Text to display',
        url: 'To what URL should this link go?',
        openInNewWindow: 'Open in new window'
      },
      table: {
        table: 'Table'
      },
      hr: {
        insert: 'Insert Horizontal Rule'
      },
      style: {
        style: 'Style',
        normal: 'Normal',
        blockquote: 'Quote',
        pre: 'Code',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6'
      },
      lists: {
        unordered: 'Unordered list',
        ordered: 'Ordered list'
      },
      options: {
        help: 'Help',
        fullscreen: 'Full Screen',
        codeview: 'Code View'
      },
      paragraph: {
        paragraph: 'Paragraph',
        outdent: 'Outdent',
        indent: 'Indent',
        left: 'Align left',
        center: 'Align center',
        right: 'Align right',
        justify: 'Justify full'
      },
      color: {
        recent: 'Recent Color',
        more: 'More Color',
        background: 'Background Color',
        foreground: 'Foreground Color',
        transparent: 'Transparent',
        setTransparent: 'Set transparent',
        reset: 'Reset',
        resetToDefault: 'Reset to default'
      },
      shortcut: {
        shortcuts: 'Keyboard shortcuts',
        close: 'Close',
        textFormatting: 'Text formatting',
        action: 'Action',
        paragraphFormatting: 'Paragraph formatting',
        documentStyle: 'Document Style',
        extraKeys: 'Extra keys'
      },
      help: {
        'insertParagraph': 'Insert Paragraph',
        'undo': 'Undoes the last command',
        'redo': 'Redoes the last command',
        'tab': 'Tab',
        'untab': 'Untab',
        'bold': 'Set a bold style',
        'italic': 'Set a italic style',
        'underline': 'Set a underline style',
        'strikethrough': 'Set a strikethrough style',
        'removeFormat': 'Clean a style',
        'justifyLeft': 'Set left align',
        'justifyCenter': 'Set center align',
        'justifyRight': 'Set right align',
        'justifyFull': 'Set full align',
        'insertUnorderedList': 'Toggle unordered list',
        'insertOrderedList': 'Toggle ordered list',
        'outdent': 'Outdent on current paragraph',
        'indent': 'Indent on current paragraph',
        'formatPara': 'Change current block\'s format as a paragraph(P tag)',
        'formatH1': 'Change current block\'s format as H1',
        'formatH2': 'Change current block\'s format as H2',
        'formatH3': 'Change current block\'s format as H3',
        'formatH4': 'Change current block\'s format as H4',
        'formatH5': 'Change current block\'s format as H5',
        'formatH6': 'Change current block\'s format as H6',
        'insertHorizontalRule': 'Insert horizontal rule',
        'linkDialog.show': 'Show Link Dialog'
      },
      history: {
        undo: 'Undo',
        redo: 'Redo'
      },
      specialChar: {
        specialChar: 'SPECIAL CHARACTERS',
        select: 'Select Special characters'
      }
    }
  });


  /**
   * @class core.key
   *
   * Object for keycodes.
   *
   * @singleton
   * @alternateClassName key
   */
  var key = (function () {
    var keyMap = {
      'BACKSPACE': 8,
      'TAB': 9,
      'ENTER': 13,
      'SPACE': 32,

      // Arrow
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40,

      // Number: 0-9
      'NUM0': 48,
      'NUM1': 49,
      'NUM2': 50,
      'NUM3': 51,
      'NUM4': 52,
      'NUM5': 53,
      'NUM6': 54,
      'NUM7': 55,
      'NUM8': 56,

      // Alphabet: a-z
      'B': 66,
      'E': 69,
      'I': 73,
      'J': 74,
      'K': 75,
      'L': 76,
      'R': 82,
      'S': 83,
      'U': 85,
      'V': 86,
      'Y': 89,
      'Z': 90,

      'SLASH': 191,
      'LEFTBRACKET': 219,
      'BACKSLASH': 220,
      'RIGHTBRACKET': 221
    };

    return {
      /**
       * @method isEdit
       *
       * @param {Number} keyCode
       * @return {Boolean}
       */
      isEdit: function (keyCode) {
        return list.contains([
          keyMap.BACKSPACE,
          keyMap.TAB,
          keyMap.ENTER,
          keyMap.SPACE
        ], keyCode);
      },
      /**
       * @method isMove
       *
       * @param {Number} keyCode
       * @return {Boolean}
       */
      isMove: function (keyCode) {
        return list.contains([
          keyMap.LEFT,
          keyMap.UP,
          keyMap.RIGHT,
          keyMap.DOWN
        ], keyCode);
      },
      /**
       * @property {Object} nameFromCode
       * @property {String} nameFromCode.8 "BACKSPACE"
       */
      nameFromCode: func.invertObject(keyMap),
      code: keyMap
    };
  })();

  var range = (function () {

    /**
     * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
     *
     * @param {TextRange} textRange
     * @param {Boolean} isStart
     * @return {BoundaryPoint}
     *
     * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
     */
    var textRangeToPoint = function (textRange, isStart) {
      var container = textRange.parentElement(), offset;

      var tester = document.body.createTextRange(), prevContainer;
      var childNodes = list.from(container.childNodes);
      for (offset = 0; offset < childNodes.length; offset++) {
        if (dom.isText(childNodes[offset])) {
          continue;
        }
        tester.moveToElementText(childNodes[offset]);
        if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
          break;
        }
        prevContainer = childNodes[offset];
      }

      if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
        var textRangeStart = document.body.createTextRange(), curTextNode = null;
        textRangeStart.moveToElementText(prevContainer || container);
        textRangeStart.collapse(!prevContainer);
        curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;

        var pointTester = textRange.duplicate();
        pointTester.setEndPoint('StartToStart', textRangeStart);
        var textCount = pointTester.text.replace(/[\r\n]/g, '').length;

        while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
          textCount -= curTextNode.nodeValue.length;
          curTextNode = curTextNode.nextSibling;
        }

        /* jshint ignore:start */
        var dummy = curTextNode.nodeValue; // enforce IE to re-reference curTextNode, hack
        /* jshint ignore:end */

        if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) &&
            textCount === curTextNode.nodeValue.length) {
          textCount -= curTextNode.nodeValue.length;
          curTextNode = curTextNode.nextSibling;
        }

        container = curTextNode;
        offset = textCount;
      }

      return {
        cont: container,
        offset: offset
      };
    };

    /**
     * return TextRange from boundary point (inspired by google closure-library)
     * @param {BoundaryPoint} point
     * @return {TextRange}
     */
    var pointToTextRange = function (point) {
      var textRangeInfo = function (container, offset) {
        var node, isCollapseToStart;

        if (dom.isText(container)) {
          var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
          var prevContainer = list.last(prevTextNodes).previousSibling;
          node =  prevContainer || container.parentNode;
          offset += list.sum(list.tail(prevTextNodes), dom.nodeLength);
          isCollapseToStart = !prevContainer;
        } else {
          node = container.childNodes[offset] || container;
          if (dom.isText(node)) {
            return textRangeInfo(node, 0);
          }

          offset = 0;
          isCollapseToStart = false;
        }

        return {
          node: node,
          collapseToStart: isCollapseToStart,
          offset: offset
        };
      };

      var textRange = document.body.createTextRange();
      var info = textRangeInfo(point.node, point.offset);

      textRange.moveToElementText(info.node);
      textRange.collapse(info.collapseToStart);
      textRange.moveStart('character', info.offset);
      return textRange;
    };

    /**
     * Wrapped Range
     *
     * @constructor
     * @param {Node} sc - start container
     * @param {Number} so - start offset
     * @param {Node} ec - end container
     * @param {Number} eo - end offset
     */
    var WrappedRange = function (sc, so, ec, eo) {
      this.sc = sc;
      this.so = so;
      this.ec = ec;
      this.eo = eo;

      // nativeRange: get nativeRange from sc, so, ec, eo
      var nativeRange = function () {
        if (agent.isW3CRangeSupport) {
          var w3cRange = document.createRange();
          w3cRange.setStart(sc, so);
          w3cRange.setEnd(ec, eo);

          return w3cRange;
        } else {
          var textRange = pointToTextRange({
            node: sc,
            offset: so
          });

          textRange.setEndPoint('EndToEnd', pointToTextRange({
            node: ec,
            offset: eo
          }));

          return textRange;
        }
      };

      this.getPoints = function () {
        return {
          sc: sc,
          so: so,
          ec: ec,
          eo: eo
        };
      };

      this.getStartPoint = function () {
        return {
          node: sc,
          offset: so
        };
      };

      this.getEndPoint = function () {
        return {
          node: ec,
          offset: eo
        };
      };

      /**
       * select update visible range
       */
      this.select = function () {
        var nativeRng = nativeRange();
        if (agent.isW3CRangeSupport) {
          var selection = document.getSelection();
          if (selection.rangeCount > 0) {
            selection.removeAllRanges();
          }
          selection.addRange(nativeRng);
        } else {
          nativeRng.select();
        }

        return this;
      };

      /**
       * Moves the scrollbar to start container(sc) of current range
       *
       * @return {WrappedRange}
       */
      this.scrollIntoView = function (container) {
        var height = $(container).height();
        if (container.scrollTop + height < this.sc.offsetTop) {
          container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
        }

        return this;
      };

      /**
       * @return {WrappedRange}
       */
      this.normalize = function () {

        /**
         * @param {BoundaryPoint} point
         * @param {Boolean} isLeftToRight
         * @return {BoundaryPoint}
         */
        var getVisiblePoint = function (point, isLeftToRight) {
          if ((dom.isVisiblePoint(point) && !dom.isEdgePoint(point)) ||
              (dom.isVisiblePoint(point) && dom.isRightEdgePoint(point) && !isLeftToRight) ||
              (dom.isVisiblePoint(point) && dom.isLeftEdgePoint(point) && isLeftToRight) ||
              (dom.isVisiblePoint(point) && dom.isBlock(point.node) && dom.isEmpty(point.node))) {
            return point;
          }

          // point on block's edge
          var block = dom.ancestor(point.node, dom.isBlock);
          if (((dom.isLeftEdgePointOf(point, block) || dom.isVoid(dom.prevPoint(point).node)) && !isLeftToRight) ||
              ((dom.isRightEdgePointOf(point, block) || dom.isVoid(dom.nextPoint(point).node)) && isLeftToRight)) {

            // returns point already on visible point
            if (dom.isVisiblePoint(point)) {
              return point;
            }
            // reverse direction
            isLeftToRight = !isLeftToRight;
          }

          var nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint) :
                                          dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
          return nextPoint || point;
        };

        var endPoint = getVisiblePoint(this.getEndPoint(), false);
        var startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);

        return new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
        );
      };

      /**
       * returns matched nodes on range
       *
       * @param {Function} [pred] - predicate function
       * @param {Object} [options]
       * @param {Boolean} [options.includeAncestor]
       * @param {Boolean} [options.fullyContains]
       * @return {Node[]}
       */
      this.nodes = function (pred, options) {
        pred = pred || func.ok;

        var includeAncestor = options && options.includeAncestor;
        var fullyContains = options && options.fullyContains;

        // TODO compare points and sort
        var startPoint = this.getStartPoint();
        var endPoint = this.getEndPoint();

        var nodes = [];
        var leftEdgeNodes = [];

        dom.walkPoint(startPoint, endPoint, function (point) {
          if (dom.isEditable(point.node)) {
            return;
          }

          var node;
          if (fullyContains) {
            if (dom.isLeftEdgePoint(point)) {
              leftEdgeNodes.push(point.node);
            }
            if (dom.isRightEdgePoint(point) && list.contains(leftEdgeNodes, point.node)) {
              node = point.node;
            }
          } else if (includeAncestor) {
            node = dom.ancestor(point.node, pred);
          } else {
            node = point.node;
          }

          if (node && pred(node)) {
            nodes.push(node);
          }
        }, true);

        return list.unique(nodes);
      };

      /**
       * returns commonAncestor of range
       * @return {Element} - commonAncestor
       */
      this.commonAncestor = function () {
        return dom.commonAncestor(sc, ec);
      };

      /**
       * returns expanded range by pred
       *
       * @param {Function} pred - predicate function
       * @return {WrappedRange}
       */
      this.expand = function (pred) {
        var startAncestor = dom.ancestor(sc, pred);
        var endAncestor = dom.ancestor(ec, pred);

        if (!startAncestor && !endAncestor) {
          return new WrappedRange(sc, so, ec, eo);
        }

        var boundaryPoints = this.getPoints();

        if (startAncestor) {
          boundaryPoints.sc = startAncestor;
          boundaryPoints.so = 0;
        }

        if (endAncestor) {
          boundaryPoints.ec = endAncestor;
          boundaryPoints.eo = dom.nodeLength(endAncestor);
        }

        return new WrappedRange(
          boundaryPoints.sc,
          boundaryPoints.so,
          boundaryPoints.ec,
          boundaryPoints.eo
        );
      };

      /**
       * @param {Boolean} isCollapseToStart
       * @return {WrappedRange}
       */
      this.collapse = function (isCollapseToStart) {
        if (isCollapseToStart) {
          return new WrappedRange(sc, so, sc, so);
        } else {
          return new WrappedRange(ec, eo, ec, eo);
        }
      };

      /**
       * splitText on range
       */
      this.splitText = function () {
        var isSameContainer = sc === ec;
        var boundaryPoints = this.getPoints();

        if (dom.isText(ec) && !dom.isEdgePoint(this.getEndPoint())) {
          ec.splitText(eo);
        }

        if (dom.isText(sc) && !dom.isEdgePoint(this.getStartPoint())) {
          boundaryPoints.sc = sc.splitText(so);
          boundaryPoints.so = 0;

          if (isSameContainer) {
            boundaryPoints.ec = boundaryPoints.sc;
            boundaryPoints.eo = eo - so;
          }
        }

        return new WrappedRange(
          boundaryPoints.sc,
          boundaryPoints.so,
          boundaryPoints.ec,
          boundaryPoints.eo
        );
      };

      /**
       * delete contents on range
       * @return {WrappedRange}
       */
      this.deleteContents = function () {
        if (this.isCollapsed()) {
          return this;
        }

        var rng = this.splitText();
        var nodes = rng.nodes(null, {
          fullyContains: true
        });

        // find new cursor point
        var point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
          return !list.contains(nodes, point.node);
        });

        var emptyParents = [];
        $.each(nodes, function (idx, node) {
          // find empty parents
          var parent = node.parentNode;
          if (point.node !== parent && dom.nodeLength(parent) === 1) {
            emptyParents.push(parent);
          }
          dom.remove(node, false);
        });

        // remove empty parents
        $.each(emptyParents, function (idx, node) {
          dom.remove(node, false);
        });

        return new WrappedRange(
          point.node,
          point.offset,
          point.node,
          point.offset
        ).normalize();
      };

      /**
       * makeIsOn: return isOn(pred) function
       */
      var makeIsOn = function (pred) {
        return function () {
          var ancestor = dom.ancestor(sc, pred);
          return !!ancestor && (ancestor === dom.ancestor(ec, pred));
        };
      };

      // isOnEditable: judge whether range is on editable or not
      this.isOnEditable = makeIsOn(dom.isEditable);
      // isOnList: judge whether range is on list node or not
      this.isOnList = makeIsOn(dom.isList);
      // isOnAnchor: judge whether range is on anchor node or not
      this.isOnAnchor = makeIsOn(dom.isAnchor);
      // isOnCell: judge whether range is on cell node or not
      this.isOnCell = makeIsOn(dom.isCell);
      // isOnData: judge whether range is on data node or not
      this.isOnData = makeIsOn(dom.isData);

      /**
       * @param {Function} pred
       * @return {Boolean}
       */
      this.isLeftEdgeOf = function (pred) {
        if (!dom.isLeftEdgePoint(this.getStartPoint())) {
          return false;
        }

        var node = dom.ancestor(this.sc, pred);
        return node && dom.isLeftEdgeOf(this.sc, node);
      };

      /**
       * returns whether range was collapsed or not
       */
      this.isCollapsed = function () {
        return sc === ec && so === eo;
      };

      /**
       * wrap inline nodes which children of body with paragraph
       *
       * @return {WrappedRange}
       */
      this.wrapBodyInlineWithPara = function () {
        if (dom.isBodyContainer(sc) && dom.isEmpty(sc)) {
          sc.innerHTML = dom.emptyPara;
          return new WrappedRange(sc.firstChild, 0, sc.firstChild, 0);
        }

        /**
         * [workaround] firefox often create range on not visible point. so normalize here.
         *  - firefox: |<p>text</p>|
         *  - chrome: <p>|text|</p>
         */
        var rng = this.normalize();
        if (dom.isParaInline(sc) || dom.isPara(sc)) {
          return rng;
        }

        // find inline top ancestor
        var topAncestor;
        if (dom.isInline(rng.sc)) {
          var ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
          topAncestor = list.last(ancestors);
          if (!dom.isInline(topAncestor)) {
            topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
          }
        } else {
          topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
        }

        // siblings not in paragraph
        var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
        inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));

        // wrap with paragraph
        if (inlineSiblings.length) {
          var para = dom.wrap(list.head(inlineSiblings), 'p');
          dom.appendChildNodes(para, list.tail(inlineSiblings));
        }

        return this.normalize();
      };

      /**
       * insert node at current cursor
       *
       * @param {Node} node
       * @return {Node}
       */
      this.insertNode = function (node) {
        var rng = this.wrapBodyInlineWithPara().deleteContents();
        var info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));

        if (info.rightNode) {
          info.rightNode.parentNode.insertBefore(node, info.rightNode);
        } else {
          info.container.appendChild(node);
        }

        return node;
      };

      /**
       * insert html at current cursor
       */
      this.pasteHTML = function (markup) {
        var contentsContainer = $('<div></div>').html(markup)[0];
        var childNodes = list.from(contentsContainer.childNodes);

        var rng = this.wrapBodyInlineWithPara().deleteContents();

        return childNodes.reverse().map(function (childNode) {
          return rng.insertNode(childNode);
        }).reverse();
      };

      /**
       * returns text in range
       *
       * @return {String}
       */
      this.toString = function () {
        var nativeRng = nativeRange();
        return agent.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
      };

      /**
       * returns range for word before cursor
       *
       * @param {Boolean} [findAfter] - find after cursor, default: false
       * @return {WrappedRange}
       */
      this.getWordRange = function (findAfter) {
        var endPoint = this.getEndPoint();

        if (!dom.isCharPoint(endPoint)) {
          return this;
        }

        var startPoint = dom.prevPointUntil(endPoint, function (point) {
          return !dom.isCharPoint(point);
        });

        if (findAfter) {
          endPoint = dom.nextPointUntil(endPoint, function (point) {
            return !dom.isCharPoint(point);
          });
        }

        return new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
        );
      };

      /**
       * create offsetPath bookmark
       *
       * @param {Node} editable
       */
      this.bookmark = function (editable) {
        return {
          s: {
            path: dom.makeOffsetPath(editable, sc),
            offset: so
          },
          e: {
            path: dom.makeOffsetPath(editable, ec),
            offset: eo
          }
        };
      };

      /**
       * create offsetPath bookmark base on paragraph
       *
       * @param {Node[]} paras
       */
      this.paraBookmark = function (paras) {
        return {
          s: {
            path: list.tail(dom.makeOffsetPath(list.head(paras), sc)),
            offset: so
          },
          e: {
            path: list.tail(dom.makeOffsetPath(list.last(paras), ec)),
            offset: eo
          }
        };
      };

      /**
       * getClientRects
       * @return {Rect[]}
       */
      this.getClientRects = function () {
        var nativeRng = nativeRange();
        return nativeRng.getClientRects();
      };
    };

  /**
   * @class core.range
   *
   * Data structure
   *  * BoundaryPoint: a point of dom tree
   *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
   *
   * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
   *
   * @singleton
   * @alternateClassName range
   */
    return {
      /**
       * create Range Object From arguments or Browser Selection
       *
       * @param {Node} sc - start container
       * @param {Number} so - start offset
       * @param {Node} ec - end container
       * @param {Number} eo - end offset
       * @return {WrappedRange}
       */
      create: function (sc, so, ec, eo) {
        if (arguments.length === 4) {
          return new WrappedRange(sc, so, ec, eo);
        } else if (arguments.length === 2) { //collapsed
          ec = sc;
          eo = so;
          return new WrappedRange(sc, so, ec, eo);
        } else {
          var wrappedRange = this.createFromSelection();
          if (!wrappedRange && arguments.length === 1) {
            wrappedRange = this.createFromNode(arguments[0]);
            return wrappedRange.collapse(dom.emptyPara === arguments[0].innerHTML);
          }
          return wrappedRange;
        }
      },

      createFromSelection: function () {
        var sc, so, ec, eo;
        if (agent.isW3CRangeSupport) {
          var selection = document.getSelection();
          if (!selection || selection.rangeCount === 0) {
            return null;
          } else if (dom.isBody(selection.anchorNode)) {
            // Firefox: returns entire body as range on initialization.
            // We won't never need it.
            return null;
          }

          var nativeRng = selection.getRangeAt(0);
          sc = nativeRng.startContainer;
          so = nativeRng.startOffset;
          ec = nativeRng.endContainer;
          eo = nativeRng.endOffset;
        } else { // IE8: TextRange
          var textRange = document.selection.createRange();
          var textRangeEnd = textRange.duplicate();
          textRangeEnd.collapse(false);
          var textRangeStart = textRange;
          textRangeStart.collapse(true);

          var startPoint = textRangeToPoint(textRangeStart, true),
          endPoint = textRangeToPoint(textRangeEnd, false);

          // same visible point case: range was collapsed.
          if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) &&
              dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) &&
              endPoint.node.nextSibling === startPoint.node) {
            startPoint = endPoint;
          }

          sc = startPoint.cont;
          so = startPoint.offset;
          ec = endPoint.cont;
          eo = endPoint.offset;
        }

        return new WrappedRange(sc, so, ec, eo);
      },

      /**
       * @method
       *
       * create WrappedRange from node
       *
       * @param {Node} node
       * @return {WrappedRange}
       */
      createFromNode: function (node) {
        var sc = node;
        var so = 0;
        var ec = node;
        var eo = dom.nodeLength(ec);

        // browsers can't target a picture or void node
        if (dom.isVoid(sc)) {
          so = dom.listPrev(sc).length - 1;
          sc = sc.parentNode;
        }
        if (dom.isBR(ec)) {
          eo = dom.listPrev(ec).length - 1;
          ec = ec.parentNode;
        } else if (dom.isVoid(ec)) {
          eo = dom.listPrev(ec).length;
          ec = ec.parentNode;
        }

        return this.create(sc, so, ec, eo);
      },

      /**
       * create WrappedRange from node after position
       *
       * @param {Node} node
       * @return {WrappedRange}
       */
      createFromNodeBefore: function (node) {
        return this.createFromNode(node).collapse(true);
      },

      /**
       * create WrappedRange from node after position
       *
       * @param {Node} node
       * @return {WrappedRange}
       */
      createFromNodeAfter: function (node) {
        return this.createFromNode(node).collapse();
      },

      /**
       * @method
       *
       * create WrappedRange from bookmark
       *
       * @param {Node} editable
       * @param {Object} bookmark
       * @return {WrappedRange}
       */
      createFromBookmark: function (editable, bookmark) {
        var sc = dom.fromOffsetPath(editable, bookmark.s.path);
        var so = bookmark.s.offset;
        var ec = dom.fromOffsetPath(editable, bookmark.e.path);
        var eo = bookmark.e.offset;
        return new WrappedRange(sc, so, ec, eo);
      },

      /**
       * @method
       *
       * create WrappedRange from paraBookmark
       *
       * @param {Object} bookmark
       * @param {Node[]} paras
       * @return {WrappedRange}
       */
      createFromParaBookmark: function (bookmark, paras) {
        var so = bookmark.s.offset;
        var eo = bookmark.e.offset;
        var sc = dom.fromOffsetPath(list.head(paras), bookmark.s.path);
        var ec = dom.fromOffsetPath(list.last(paras), bookmark.e.path);

        return new WrappedRange(sc, so, ec, eo);
      }
    };
  })();

  /**
   * @class core.async
   *
   * Async functions which returns `Promise`
   *
   * @singleton
   * @alternateClassName async
   */
  var async = (function () {
    /**
     * @method readFileAsDataURL
     *
     * read contents of file as representing URL
     *
     * @param {File} file
     * @return {Promise} - then: dataUrl
     */
    var readFileAsDataURL = function (file) {
      return $.Deferred(function (deferred) {
        $.extend(new FileReader(), {
          onload: function (e) {
            var dataURL = e.target.result;
            deferred.resolve(dataURL);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };

    /**
     * @method createImage
     *
     * create `<image>` from url string
     *
     * @param {String} url
     * @return {Promise} - then: $image
     */
    var createImage = function (url) {
      return $.Deferred(function (deferred) {
        var $img = $('<img>');

        $img.one('load', function () {
          $img.off('error abort');
          deferred.resolve($img);
        }).one('error abort', function () {
          $img.off('load').detach();
          deferred.reject($img);
        }).css({
          display: 'none'
        }).appendTo(document.body).attr('src', url);
      }).promise();
    };

    return {
      readFileAsDataURL: readFileAsDataURL,
      createImage: createImage
    };
  })();

  /**
   * @class editing.History
   *
   * Editor History
   *
   */
  var History = function ($editable) {
    var stack = [], stackOffset = -1;
    var editable = $editable[0];

    var makeSnapshot = function () {
      var rng = range.create(editable);
      var emptyBookmark = {s: {path: [], offset: 0}, e: {path: [], offset: 0}};

      return {
        contents: $editable.html(),
        bookmark: (rng ? rng.bookmark(editable) : emptyBookmark)
      };
    };

    var applySnapshot = function (snapshot) {
      if (snapshot.contents !== null) {
        $editable.html(snapshot.contents);
      }
      if (snapshot.bookmark !== null) {
        range.createFromBookmark(editable, snapshot.bookmark).select();
      }
    };

    /**
    * @method rewind
    * Rewinds the history stack back to the first snapshot taken.
    * Leaves the stack intact, so that "Redo" can still be used.
    */
    this.rewind = function () {
      // Create snap shot if not yet recorded
      if ($editable.html() !== stack[stackOffset].contents) {
        this.recordUndo();
      }

      // Return to the first available snapshot.
      stackOffset = 0;

      // Apply that snapshot.
      applySnapshot(stack[stackOffset]);
    };

    /**
    * @method reset
    * Resets the history stack completely; reverting to an empty editor.
    */
    this.reset = function () {
      // Clear the stack.
      stack = [];

      // Restore stackOffset to its original value.
      stackOffset = -1;

      // Clear the editable area.
      $editable.html('');

      // Record our first snapshot (of nothing).
      this.recordUndo();
    };

    /**
     * undo
     */
    this.undo = function () {
      // Create snap shot if not yet recorded
      if ($editable.html() !== stack[stackOffset].contents) {
        this.recordUndo();
      }

      if (0 < stackOffset) {
        stackOffset--;
        applySnapshot(stack[stackOffset]);
      }
    };

    /**
     * redo
     */
    this.redo = function () {
      if (stack.length - 1 > stackOffset) {
        stackOffset++;
        applySnapshot(stack[stackOffset]);
      }
    };

    /**
     * recorded undo
     */
    this.recordUndo = function () {
      stackOffset++;

      // Wash out stack after stackOffset
      if (stack.length > stackOffset) {
        stack = stack.slice(0, stackOffset);
      }

      // Create new snapshot and push it to the end
      stack.push(makeSnapshot());
    };
  };

  /**
   * @class editing.Style
   *
   * Style
   *
   */
  var Style = function () {
    /**
     * @method jQueryCSS
     *
     * [workaround] for old jQuery
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     * (compability with version < 1.9)
     *
     * @private
     * @param  {jQuery} $obj
     * @param  {Array} propertyNames - An array of one or more CSS properties.
     * @return {Object}
     */
    var jQueryCSS = function ($obj, propertyNames) {
      if (agent.jqueryVersion < 1.9) {
        var result = {};
        $.each(propertyNames, function (idx, propertyName) {
          result[propertyName] = $obj.css(propertyName);
        });
        return result;
      }
      return $obj.css.call($obj, propertyNames);
    };

    /**
     * returns style object from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
    this.fromNode = function ($node) {
      var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
      var styleInfo = jQueryCSS($node, properties) || {};
      styleInfo['font-size'] = parseInt(styleInfo['font-size'], 10);
      return styleInfo;
    };

    /**
     * paragraph level style
     *
     * @param {WrappedRange} rng
     * @param {Object} styleInfo
     */
    this.stylePara = function (rng, styleInfo) {
      $.each(rng.nodes(dom.isPara, {
        includeAncestor: true
      }), function (idx, para) {
        $(para).css(styleInfo);
      });
    };

    /**
     * insert and returns styleNodes on range.
     *
     * @param {WrappedRange} rng
     * @param {Object} [options] - options for styleNodes
     * @param {String} [options.nodeName] - default: `SPAN`
     * @param {Boolean} [options.expandClosestSibling] - default: `false`
     * @param {Boolean} [options.onlyPartialContains] - default: `false`
     * @return {Node[]}
     */
    this.styleNodes = function (rng, options) {
      rng = rng.splitText();

      var nodeName = options && options.nodeName || 'SPAN';
      var expandClosestSibling = !!(options && options.expandClosestSibling);
      var onlyPartialContains = !!(options && options.onlyPartialContains);

      if (rng.isCollapsed()) {
        return [rng.insertNode(dom.create(nodeName))];
      }

      var pred = dom.makePredByNodeName(nodeName);
      var nodes = rng.nodes(dom.isText, {
        fullyContains: true
      }).map(function (text) {
        return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
      });

      if (expandClosestSibling) {
        if (onlyPartialContains) {
          var nodesInRange = rng.nodes();
          // compose with partial contains predication
          pred = func.and(pred, function (node) {
            return list.contains(nodesInRange, node);
          });
        }

        return nodes.map(function (node) {
          var siblings = dom.withClosestSiblings(node, pred);
          var head = list.head(siblings);
          var tails = list.tail(siblings);
          $.each(tails, function (idx, elem) {
            dom.appendChildNodes(head, elem.childNodes);
            dom.remove(elem);
          });
          return list.head(siblings);
        });
      } else {
        return nodes;
      }
    };

    /**
     * get current style on cursor
     *
     * @param {WrappedRange} rng
     * @return {Object} - object contains style properties.
     */
    this.current = function (rng) {
      var $cont = $(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
      var styleInfo = this.fromNode($cont);

      // document.queryCommandState for toggle state
      // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"
      try {
        styleInfo = $.extend(styleInfo, {
          'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
          'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
          'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
          'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
          'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
          'font-strikethrough': document.queryCommandState('strikethrough') ? 'strikethrough' : 'normal'
        });
      } catch (e) {}

      // list-style-type to list-style(unordered, ordered)
      if (!rng.isOnList()) {
        styleInfo['list-style'] = 'none';
      } else {
        var orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var isUnordered = $.inArray(styleInfo['list-style-type'], orderedTypes) > -1;
        styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
      }

      var para = dom.ancestor(rng.sc, dom.isPara);
      if (para && para.style['line-height']) {
        styleInfo['line-height'] = para.style.lineHeight;
      } else {
        var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
        styleInfo['line-height'] = lineHeight.toFixed(1);
      }

      styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
      styleInfo.range = rng;

      return styleInfo;
    };
  };


  /**
   * @class editing.Bullet
   *
   * @alternateClassName Bullet
   */
  var Bullet = function () {
    var self = this;

    /**
     * toggle ordered list
     */
    this.insertOrderedList = function (editable) {
      this.toggleList('OL', editable);
    };

    /**
     * toggle unordered list
     */
    this.insertUnorderedList = function (editable) {
      this.toggleList('UL', editable);
    };

    /**
     * indent
     */
    this.indent = function (editable) {
      var self = this;
      var rng = range.create(editable).wrapBodyInlineWithPara();

      var paras = rng.nodes(dom.isPara, { includeAncestor: true });
      var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

      $.each(clustereds, function (idx, paras) {
        var head = list.head(paras);
        if (dom.isLi(head)) {
          self.wrapList(paras, head.parentNode.nodeName);
        } else {
          $.each(paras, function (idx, para) {
            $(para).css('marginLeft', function (idx, val) {
              return (parseInt(val, 10) || 0) + 25;
            });
          });
        }
      });

      rng.select();
    };

    /**
     * outdent
     */
    this.outdent = function (editable) {
      var self = this;
      var rng = range.create(editable).wrapBodyInlineWithPara();

      var paras = rng.nodes(dom.isPara, { includeAncestor: true });
      var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

      $.each(clustereds, function (idx, paras) {
        var head = list.head(paras);
        if (dom.isLi(head)) {
          self.releaseList([paras]);
        } else {
          $.each(paras, function (idx, para) {
            $(para).css('marginLeft', function (idx, val) {
              val = (parseInt(val, 10) || 0);
              return val > 25 ? val - 25 : '';
            });
          });
        }
      });

      rng.select();
    };

    /**
     * toggle list
     *
     * @param {String} listName - OL or UL
     */
    this.toggleList = function (listName, editable) {
      var rng = range.create(editable).wrapBodyInlineWithPara();

      var paras = rng.nodes(dom.isPara, { includeAncestor: true });
      var bookmark = rng.paraBookmark(paras);
      var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

      // paragraph to list
      if (list.find(paras, dom.isPurePara)) {
        var wrappedParas = [];
        $.each(clustereds, function (idx, paras) {
          wrappedParas = wrappedParas.concat(self.wrapList(paras, listName));
        });
        paras = wrappedParas;
      // list to paragraph or change list style
      } else {
        var diffLists = rng.nodes(dom.isList, {
          includeAncestor: true
        }).filter(function (listNode) {
          return !$.nodeName(listNode, listName);
        });

        if (diffLists.length) {
          $.each(diffLists, function (idx, listNode) {
            dom.replace(listNode, listName);
          });
        } else {
          paras = this.releaseList(clustereds, true);
        }
      }

      range.createFromParaBookmark(bookmark, paras).select();
    };

    /**
     * @param {Node[]} paras
     * @param {String} listName
     * @return {Node[]}
     */
    this.wrapList = function (paras, listName) {
      var head = list.head(paras);
      var last = list.last(paras);

      var prevList = dom.isList(head.previousSibling) && head.previousSibling;
      var nextList = dom.isList(last.nextSibling) && last.nextSibling;

      var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);

      // P to LI
      paras = paras.map(function (para) {
        return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
      });

      // append to list(<ul>, <ol>)
      dom.appendChildNodes(listNode, paras);

      if (nextList) {
        dom.appendChildNodes(listNode, list.from(nextList.childNodes));
        dom.remove(nextList);
      }

      return paras;
    };

    /**
     * @method releaseList
     *
     * @param {Array[]} clustereds
     * @param {Boolean} isEscapseToBody
     * @return {Node[]}
     */
    this.releaseList = function (clustereds, isEscapseToBody) {
      var releasedParas = [];

      $.each(clustereds, function (idx, paras) {
        var head = list.head(paras);
        var last = list.last(paras);

        var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) :
                                         head.parentNode;
        var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {
          node: last.parentNode,
          offset: dom.position(last) + 1
        }, {
          isSkipPaddingBlankHTML: true
        }) : null;

        var middleList = dom.splitTree(headList, {
          node: head.parentNode,
          offset: dom.position(head)
        }, {
          isSkipPaddingBlankHTML: true
        });

        paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) :
                                  list.from(middleList.childNodes).filter(dom.isLi);

        // LI to P
        if (isEscapseToBody || !dom.isList(headList.parentNode)) {
          paras = paras.map(function (para) {
            return dom.replace(para, 'P');
          });
        }

        $.each(list.from(paras).reverse(), function (idx, para) {
          dom.insertAfter(para, headList);
        });

        // remove empty lists
        var rootLists = list.compact([headList, middleList, lastList]);
        $.each(rootLists, function (idx, rootList) {
          var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
          $.each(listNodes.reverse(), function (idx, listNode) {
            if (!dom.nodeLength(listNode)) {
              dom.remove(listNode, true);
            }
          });
        });

        releasedParas = releasedParas.concat(paras);
      });

      return releasedParas;
    };
  };


  /**
   * @class editing.Typing
   *
   * Typing
   *
   */
  var Typing = function () {

    // a Bullet instance to toggle lists off
    var bullet = new Bullet();

    /**
     * insert tab
     *
     * @param {WrappedRange} rng
     * @param {Number} tabsize
     */
    this.insertTab = function (rng, tabsize) {
      var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
      rng = rng.deleteContents();
      rng.insertNode(tab, true);

      rng = range.create(tab, tabsize);
      rng.select();
    };

    /**
     * insert paragraph
     */
    this.insertParagraph = function (editable) {
      var rng = range.create(editable);

      // deleteContents on range.
      rng = rng.deleteContents();

      // Wrap range if it needs to be wrapped by paragraph
      rng = rng.wrapBodyInlineWithPara();

      // finding paragraph
      var splitRoot = dom.ancestor(rng.sc, dom.isPara);

      var nextPara;
      // on paragraph: split paragraph
      if (splitRoot) {
        // if it is an empty line with li
        if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) {
          // toogle UL/OL and escape
          bullet.toggleList(splitRoot.parentNode.nodeName);
          return;
        // if it is an empty line with para on blockquote
        } else if (dom.isEmpty(splitRoot) && dom.isPara(splitRoot) && dom.isBlockquote(splitRoot.parentNode)) {
          // escape blockquote
          dom.insertAfter(splitRoot, splitRoot.parentNode);
          nextPara = splitRoot;
        // if new line has content (not a line break)
        } else {
          nextPara = dom.splitTree(splitRoot, rng.getStartPoint());

          var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
          emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));

          $.each(emptyAnchors, function (idx, anchor) {
            dom.remove(anchor);
          });

          // replace empty heading or pre with P tag
          if ((dom.isHeading(nextPara) || dom.isPre(nextPara)) && dom.isEmpty(nextPara)) {
            nextPara = dom.replace(nextPara, 'p');
          }
        }
      // no paragraph: insert empty paragraph
      } else {
        var next = rng.sc.childNodes[rng.so];
        nextPara = $(dom.emptyPara)[0];
        if (next) {
          rng.sc.insertBefore(nextPara, next);
        } else {
          rng.sc.appendChild(nextPara);
        }
      }

      range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
    };
  };

  /**
   * @class editing.Table
   *
   * Table
   *
   */
  var Table = function () {
    /**
     * handle tab key
     *
     * @param {WrappedRange} rng
     * @param {Boolean} isShift
     */
    this.tab = function (rng, isShift) {
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      var table = dom.ancestor(cell, dom.isTable);
      var cells = dom.listDescendant(table, dom.isCell);

      var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
      if (nextCell) {
        range.create(nextCell, 0).select();
      }
    };

    /**
     * create empty table element
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */
    this.createTable = function (colCount, rowCount, options) {
      var tds = [], tdHTML;
      for (var idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
      }
      tdHTML = tds.join('');

      var trs = [], trHTML;
      for (var idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
      }
      trHTML = trs.join('');
      var $table = $('<table>' + trHTML + '</table>');
      if (options && options.tableClassName) {
        $table.addClass(options.tableClassName);
      }

      return $table[0];
    };
  };


  var KEY_BOGUS = 'bogus';

  /**
   * @class Editor
   */
  var Editor = function (context) {
    var self = this;

    var $note = context.layoutInfo.note;
    var $editor = context.layoutInfo.editor;
    var $editable = context.layoutInfo.editable;
    var options = context.options;
    var lang = options.langInfo;

    var editable = $editable[0];
    var lastRange = null;

    var style = new Style();
    var table = new Table();
    var typing = new Typing();
    var bullet = new Bullet();
    var history = new History($editable);

    this.initialize = function () {
      // bind custom events
      $editable.on('keydown', function (event) {
        if (event.keyCode === key.code.ENTER) {
          context.triggerEvent('enter', event);
        }
        context.triggerEvent('keydown', event);

        if (!event.isDefaultPrevented()) {
          if (options.shortcuts) {
            self.handleKeyMap(event);
          } else {
            self.preventDefaultEditableShortCuts(event);
          }
        }
      }).on('keyup', function (event) {
        context.triggerEvent('keyup', event);
      }).on('focus', function (event) {
        context.triggerEvent('focus', event);
      }).on('blur', function (event) {
        context.triggerEvent('blur', event);
      }).on('mousedown', function (event) {
        context.triggerEvent('mousedown', event);
      }).on('mouseup', function (event) {
        context.triggerEvent('mouseup', event);
      }).on('scroll', function (event) {
        context.triggerEvent('scroll', event);
      }).on('paste', function (event) {
        context.triggerEvent('paste', event);
      });

      // init content before set event
      $editable.html(dom.html($note) || dom.emptyPara);

      // [workaround] IE doesn't have input events for contentEditable
      // - see: https://goo.gl/4bfIvA
      var changeEventName = agent.isMSIE ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';
      $editable.on(changeEventName, func.debounce(function () {
        context.triggerEvent('change', $editable.html());
      }, 250));

      $editor.on('focusin', function (event) {
        context.triggerEvent('focusin', event);
      }).on('focusout', function (event) {
        context.triggerEvent('focusout', event);
      });

      if (!options.airMode) {
        if (options.width) {
          $editor.outerWidth(options.width);
        }
        if (options.height) {
          $editable.outerHeight(options.height);
        }
        if (options.maxHeight) {
          $editable.css('max-height', options.maxHeight);
        }
        if (options.minHeight) {
          $editable.css('min-height', options.minHeight);
        }
      }

      history.recordUndo();
    };

    this.destroy = function () {
      $editable.off();
    };

    this.handleKeyMap = function (event) {
      var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
      var keys = [];

      if (event.metaKey) { keys.push('CMD'); }
      if (event.ctrlKey && !event.altKey) { keys.push('CTRL'); }
      if (event.shiftKey) { keys.push('SHIFT'); }

      var keyName = key.nameFromCode[event.keyCode];
      if (keyName) {
        keys.push(keyName);
      }

      var eventName = keyMap[keys.join('+')];
      if (eventName) {
        event.preventDefault();
        context.invoke(eventName);
      } else if (key.isEdit(event.keyCode)) {
        this.afterCommand();
      }
    };

    this.preventDefaultEditableShortCuts = function (event) {
      // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
      if ((event.ctrlKey || event.metaKey) &&
        list.contains([66, 73, 85], event.keyCode)) {
        event.preventDefault();
      }
    };

    /**
     * create range
     * @return {WrappedRange}
     */
    this.createRange = function () {
      this.focus();
      return range.create(editable);
    };

    /**
     * saveRange
     *
     * save current range
     *
     * @param {Boolean} [thenCollapse=false]
     */
    this.saveRange = function (thenCollapse) {
      lastRange = this.createRange();
      if (thenCollapse) {
        lastRange.collapse().select();
      }
    };

    /**
     * restoreRange
     *
     * restore lately range
     */
    this.restoreRange = function () {
      if (lastRange) {
        lastRange.select();
        this.focus();
      }
    };

    this.saveTarget = function (node) {
      $editable.data('target', node);
    };

    this.clearTarget = function () {
      $editable.removeData('target');
    };

    this.restoreTarget = function () {
      return $editable.data('target');
    };

    /**
     * currentStyle
     *
     * current style
     * @return {Object|Boolean} unfocus
     */
    this.currentStyle = function () {
      var rng = range.create();
      if (rng) {
        rng = rng.normalize();
      }
      return rng ? style.current(rng) : style.fromNode($editable);
    };

    /**
     * style from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
    this.styleFromNode = function ($node) {
      return style.fromNode($node);
    };

    /**
     * undo
     */
    this.undo = function () {
      context.triggerEvent('before.command', $editable.html());
      history.undo();
      context.triggerEvent('change', $editable.html());
    };
    context.memo('help.undo', lang.help.undo);

    /**
     * redo
     */
    this.redo = function () {
      context.triggerEvent('before.command', $editable.html());
      history.redo();
      context.triggerEvent('change', $editable.html());
    };
    context.memo('help.redo', lang.help.redo);

    /**
     * before command
     */
    var beforeCommand = this.beforeCommand = function () {
      context.triggerEvent('before.command', $editable.html());
      // keep focus on editable before command execution
      self.focus();
    };

    /**
     * after command
     * @param {Boolean} isPreventTrigger
     */
    var afterCommand = this.afterCommand = function (isPreventTrigger) {
      history.recordUndo();
      if (!isPreventTrigger) {
        context.triggerEvent('change', $editable.html());
      }
    };

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
                    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                    'formatBlock', 'removeFormat',
                    'backColor', 'foreColor', 'fontName'];

    for (var idx = 0, len = commands.length; idx < len; idx ++) {
      this[commands[idx]] = (function (sCmd) {
        return function (value) {
          beforeCommand();
          document.execCommand(sCmd, false, value);
          afterCommand(true);
        };
      })(commands[idx]);
      context.memo('help.' + commands[idx], lang.help[commands[idx]]);
    }
    /* jshint ignore:end */

    /**
     * handle tab key
     */
    this.tab = function () {
      var rng = this.createRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng);
      } else {
        beforeCommand();
        typing.insertTab(rng, options.tabSize);
        afterCommand();
      }
    };
    context.memo('help.tab', lang.help.tab);

    /**
     * handle shift+tab key
     */
    this.untab = function () {
      var rng = this.createRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng, true);
      }
    };
    context.memo('help.untab', lang.help.untab);

    /**
     * run given function between beforeCommand and afterCommand
     */
    this.wrapCommand = function (fn) {
      return function () {
        beforeCommand();
        fn.apply(self, arguments);
        afterCommand();
      };
    };

    /**
     * insert paragraph
     */
    this.insertParagraph = this.wrapCommand(function () {
      typing.insertParagraph(editable);
    });
    context.memo('help.insertParagraph', lang.help.insertParagraph);

    this.insertOrderedList = this.wrapCommand(function () {
      bullet.insertOrderedList(editable);
    });
    context.memo('help.insertOrderedList', lang.help.insertOrderedList);

    this.insertUnorderedList = this.wrapCommand(function () {
      bullet.insertUnorderedList(editable);
    });
    context.memo('help.insertUnorderedList', lang.help.insertUnorderedList);

    this.indent = this.wrapCommand(function () {
      bullet.indent(editable);
    });
    context.memo('help.indent', lang.help.indent);

    this.outdent = this.wrapCommand(function () {
      bullet.outdent(editable);
    });
    context.memo('help.outdent', lang.help.outdent);

    /**
     * insert image
     *
     * @param {String} src
     * @param {String|Function} param
     * @return {Promise}
     */
    this.insertImage = function (src, param) {
      return async.createImage(src, param).then(function ($image) {
        beforeCommand();

        if (typeof param === 'function') {
          param($image);
        } else {
          if (typeof param === 'string') {
            $image.attr('data-filename', param);
          }
          $image.css('width', Math.min($editable.width(), $image.width()));
        }

        $image.show();
        range.create(editable).insertNode($image[0]);
        range.createFromNodeAfter($image[0]).select();
        afterCommand();
      }).fail(function (e) {
        context.triggerEvent('image.upload.error', e);
      });
    };

    /**
     * insertImages
     * @param {File[]} files
     */
    this.insertImages = function (files) {
      $.each(files, function (idx, file) {
        var filename = file.name;
        if (options.maximumImageFileSize && options.maximumImageFileSize < file.size) {
          context.triggerEvent('image.upload.error', lang.image.maximumFileSizeError);
        } else {
          async.readFileAsDataURL(file).then(function (dataURL) {
            return self.insertImage(dataURL, filename);
          }).fail(function () {
            context.triggerEvent('image.upload.error');
          });
        }
      });
    };

    /**
     * insertImagesOrCallback
     * @param {File[]} files
     */
    this.insertImagesOrCallback = function (files) {
      var callbacks = options.callbacks;

      // If onImageUpload options setted
      if (callbacks.onImageUpload) {
        context.triggerEvent('image.upload', files);
      // else insert Image as dataURL
      } else {
        this.insertImages(files);
      }
    };

    /**
     * insertNode
     * insert node
     * @param {Node} node
     */
    this.insertNode = this.wrapCommand(function (node) {
      var rng = this.createRange();
      rng.insertNode(node);
      range.createFromNodeAfter(node).select();
    });

    /**
     * insert text
     * @param {String} text
     */
    this.insertText = this.wrapCommand(function (text) {
      var rng = this.createRange();
      var textNode = rng.insertNode(dom.createText(text));
      range.create(textNode, dom.nodeLength(textNode)).select();
    });

    /**
     * return selected plain text
     * @return {String} text
     */
    this.getSelectedText = function () {
      var rng = this.createRange();

      // if range on anchor, expand range with anchor
      if (rng.isOnAnchor()) {
        rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
      }

      return rng.toString();
    };

    /**
     * paste HTML
     * @param {String} markup
     */
    this.pasteHTML = this.wrapCommand(function (markup) {
      var contents = this.createRange().pasteHTML(markup);
      range.createFromNodeAfter(list.last(contents)).select();
    });

    /**
     * formatBlock
     *
     * @param {String} tagName
     */
    this.formatBlock = this.wrapCommand(function (tagName) {
      // [workaround] for MSIE, IE need `<`
      tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
      document.execCommand('FormatBlock', false, tagName);
    });

    this.formatPara = function () {
      this.formatBlock('P');
    };
    context.memo('help.formatPara', lang.help.formatPara);

    /* jshint ignore:start */
    for (var idx = 1; idx <= 6; idx ++) {
      this['formatH' + idx] = function (idx) {
        return function () {
          this.formatBlock('H' + idx);
        };
      }(idx);
      context.memo('help.formatH'+idx, lang.help['formatH' + idx]);
    };
    /* jshint ignore:end */

    /**
     * fontSize
     *
     * @param {String} value - px
     */
    this.fontSize = function (value) {
      var rng = this.createRange();

      if (rng && rng.isCollapsed()) {
        var spans = style.styleNodes(rng);
        var firstSpan = list.head(spans);

        $(spans).css({
          'font-size': value + 'px'
        });

        // [workaround] added styled bogus span for style
        //  - also bogus character needed for cursor position
        if (firstSpan && !dom.nodeLength(firstSpan)) {
          firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
          range.createFromNodeAfter(firstSpan.firstChild).select();
          $editable.data(KEY_BOGUS, firstSpan);
        }
      } else {
        beforeCommand();
        $(style.styleNodes(rng)).css({
          'font-size': value + 'px'
        });
        afterCommand();
      }
    };

    /**
     * insert horizontal rule
     */
    this.insertHorizontalRule = this.wrapCommand(function () {
      var hrNode = this.createRange().insertNode(dom.create('HR'));
      if (hrNode.nextSibling) {
        range.create(hrNode.nextSibling, 0).normalize().select();
      }
    });
    context.memo('help.insertHorizontalRule', lang.help.insertHorizontalRule);

    /**
     * remove bogus node and character
     */
    this.removeBogus = function () {
      var bogusNode = $editable.data(KEY_BOGUS);
      if (!bogusNode) {
        return;
      }

      var textNode = list.find(list.from(bogusNode.childNodes), dom.isText);

      var bogusCharIdx = textNode.nodeValue.indexOf(dom.ZERO_WIDTH_NBSP_CHAR);
      if (bogusCharIdx !== -1) {
        textNode.deleteData(bogusCharIdx, 1);
      }

      if (dom.isEmpty(bogusNode)) {
        dom.remove(bogusNode);
      }

      $editable.removeData(KEY_BOGUS);
    };

    /**
     * lineHeight
     * @param {String} value
     */
    this.lineHeight = this.wrapCommand(function (value) {
      style.stylePara(this.createRange(), {
        lineHeight: value
      });
    });

    /**
     * unlink
     *
     * @type command
     */
    this.unlink = function () {
      var rng = this.createRange();
      if (rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(anchor);
        rng.select();

        beforeCommand();
        document.execCommand('unlink');
        afterCommand();
      }
    };

    /**
     * create link (command)
     *
     * @param {Object} linkInfo
     */
    this.createLink = this.wrapCommand(function (linkInfo) {
      var linkUrl = linkInfo.url;
      var linkText = linkInfo.text;
      var isNewWindow = linkInfo.isNewWindow;
      var rng = linkInfo.range || this.createRange();
      var isTextChanged = rng.toString() !== linkText;

      // handle spaced urls from input
      if (typeof linkUrl === 'string') {
        linkUrl = linkUrl.trim();
      }

      if (options.onCreateLink) {
        linkUrl = options.onCreateLink(linkUrl);
      }

      var anchors = [];
      if (isTextChanged) {
        rng = rng.deleteContents();
        var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
        anchors.push(anchor);
      } else {
        anchors = style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true
        });
      }

      $.each(anchors, function (idx, anchor) {
        // if url doesn't match an URL schema, set http:// as default
        linkUrl = /^[A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?/.test(linkUrl) ?
          linkUrl : 'http://' + linkUrl;

        $(anchor).attr('href', linkUrl);
        if (isNewWindow) {
          $(anchor).attr('target', '_blank');
        } else {
          $(anchor).removeAttr('target');
        }
      });

      var startRange = range.createFromNodeBefore(list.head(anchors));
      var startPoint = startRange.getStartPoint();
      var endRange = range.createFromNodeAfter(list.last(anchors));
      var endPoint = endRange.getEndPoint();

      range.create(
        startPoint.node,
        startPoint.offset,
        endPoint.node,
        endPoint.offset
      ).select();
    });

    /**
     * returns link info
     *
     * @return {Object}
     * @return {WrappedRange} return.range
     * @return {String} return.text
     * @return {Boolean} [return.isNewWindow=true]
     * @return {String} [return.url=""]
     */
    this.getLinkInfo = function () {
      var rng = this.createRange().expand(dom.isAnchor);

      // Get the first anchor on range(for edit).
      var $anchor = $(list.head(rng.nodes(dom.isAnchor)));

      return {
        range: rng,
        text: rng.toString(),
        isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : false,
        url: $anchor.length ? $anchor.attr('href') : ''
      };
    };

    /**
     * setting color
     *
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */
    this.color = this.wrapCommand(function (colorInfo) {
      var foreColor = colorInfo.foreColor;
      var backColor = colorInfo.backColor;

      if (foreColor) { document.execCommand('foreColor', false, foreColor); }
      if (backColor) { document.execCommand('backColor', false, backColor); }
    });

    /**
     * insert Table
     *
     * @param {String} dimension of table (ex : "5x5")
     */
    this.insertTable = this.wrapCommand(function (dim) {
      var dimension = dim.split('x');

      var rng = this.createRange().deleteContents();
      rng.insertNode(table.createTable(dimension[0], dimension[1], options));
    });

    /**
     * float me
     *
     * @param {String} value
     */
    this.floatMe = this.wrapCommand(function (value) {
      var $target = $(this.restoreTarget());
      $target.css('float', value);
    });

    /**
     * resize overlay element
     * @param {String} value
     */
    this.resize = this.wrapCommand(function (value) {
      var $target = $(this.restoreTarget());
      $target.css({
        width: value * 100 + '%',
        height: ''
      });
    });

    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [bKeepRatio] - keep ratio
     */
    this.resizeTo = function (pos, $target, bKeepRatio) {
      var imageSize;
      if (bKeepRatio) {
        var newRatio = pos.y / pos.x;
        var ratio = $target.data('ratio');
        imageSize = {
          width: ratio > newRatio ? pos.x : pos.y / ratio,
          height: ratio > newRatio ? pos.x * ratio : pos.y
        };
      } else {
        imageSize = {
          width: pos.x,
          height: pos.y
        };
      }

      $target.css(imageSize);
    };

    /**
     * remove media object
     */
    this.removeMedia = this.wrapCommand(function () {
      var $target = $(this.restoreTarget()).detach();
      context.triggerEvent('media.delete', $target, $editable);
    });

    /**
     * returns whether editable area has focus or not.
     */
    this.hasFocus = function () {
      return $editable.is(':focus');
    };

    /**
     * set focus
     */
    this.focus = function () {
      // [workaround] Screen will move when page is scolled in IE.
      //  - do focus when not focused
      if (!this.hasFocus()) {
        $editable.focus();
      }
    };

    /**
     * returns whether contents is empty or not.
     * @return {Boolean}
     */
    this.isEmpty = function () {
      return dom.isEmpty($editable[0]) || dom.emptyPara === $editable.html();
    };

    /**
     * Removes all contents and restores the editable instance to an _emptyPara_.
     */
    this.empty = function () {
      context.invoke('code', dom.emptyPara);
    };
  };

  var Clipboard = function (context) {
    var self = this;

    var $editable = context.layoutInfo.editable;

    this.events = {
      'summernote.keydown': function (we, e) {
        if (self.needKeydownHook()) {
          if ((e.ctrlKey || e.metaKey) && e.keyCode === key.code.V) {
            context.invoke('editor.saveRange');
            self.$paste.focus();

            setTimeout(function () {
              self.pasteByHook();
            }, 0);
          }
        }
      }
    };

    this.needKeydownHook = function () {
      return (agent.isMSIE && agent.browserVersion > 10) || agent.isFF;
    };

    this.initialize = function () {
      // [workaround] getting image from clipboard
      //  - IE11 and Firefox: CTRL+v hook
      //  - Webkit: event.clipboardData
      if (this.needKeydownHook()) {
        this.$paste = $('<div tabindex="-1" />').attr('contenteditable', true).css({
          position: 'absolute',
          left: -100000,
          opacity: 0
        });
        $editable.before(this.$paste);

        this.$paste.on('paste', function (event) {
          context.triggerEvent('paste', event);
        });
      } else {
        $editable.on('paste', this.pasteByEvent);
      }
    };

    this.destroy = function () {
      if (this.needKeydownHook()) {
        this.$paste.remove();
        this.$paste = null;
      }
    };

    this.pasteByHook = function () {
      var node = this.$paste[0].firstChild;

      if (dom.isImg(node)) {
        var dataURI = node.src;
        var decodedData = atob(dataURI.split(',')[1]);
        var array = new Uint8Array(decodedData.length);
        for (var i = 0; i < decodedData.length; i++) {
          array[i] = decodedData.charCodeAt(i);
        }

        var blob = new Blob([array], { type: 'image/png' });
        blob.name = 'clipboard.png';

        context.invoke('editor.restoreRange');
        context.invoke('editor.focus');
        context.invoke('editor.insertImagesOrCallback', [blob]);
      } else {
        var pasteContent = $('<div />').html(this.$paste.html()).html();
        context.invoke('editor.restoreRange');
        context.invoke('editor.focus');

        if (pasteContent) {
          context.invoke('editor.pasteHTML', pasteContent);
        }
      }

      this.$paste.empty();
    };

    /**
     * paste by clipboard event
     *
     * @param {Event} event
     */
    this.pasteByEvent = function (event) {
      var clipboardData = event.originalEvent.clipboardData;
      if (clipboardData && clipboardData.items && clipboardData.items.length) {
        var item = list.head(clipboardData.items);
        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
          context.invoke('editor.insertImagesOrCallback', [item.getAsFile()]);
        }
        context.invoke('editor.afterCommand');
      }
    };
  };

  var Dropzone = function (context) {
    var $document = $(document);
    var $editor = context.layoutInfo.editor;
    var $editable = context.layoutInfo.editable;
    var options = context.options;
    var lang = options.langInfo;
    var documentEventHandlers = {};

    var $dropzone = $([
      '<div class="note-dropzone">',
      '  <div class="note-dropzone-message"/>',
      '</div>'
    ].join('')).prependTo($editor);

    var detachDocumentEvent = function () {
      Object.keys(documentEventHandlers).forEach(function (key) {
        $document.off(key.substr(2).toLowerCase(), documentEventHandlers[key]);
      });
      documentEventHandlers = {};
    };

    /**
     * attach Drag and Drop Events
     */
    this.initialize = function () {
      if (options.disableDragAndDrop) {
        // prevent default drop event
        documentEventHandlers.onDrop = function (e) {
          e.preventDefault();
        };
        $document.on('drop', documentEventHandlers.onDrop);
      } else {
        this.attachDragAndDropEvent();
      }
    };

    /**
     * attach Drag and Drop Events
     */
    this.attachDragAndDropEvent = function () {
      var collection = $(),
          $dropzoneMessage = $dropzone.find('.note-dropzone-message');

      documentEventHandlers.onDragenter = function (e) {
        var isCodeview = context.invoke('codeview.isActivated');
        var hasEditorSize = $editor.width() > 0 && $editor.height() > 0;
        if (!isCodeview && !collection.length && hasEditorSize) {
          $editor.addClass('dragover');
          $dropzone.width($editor.width());
          $dropzone.height($editor.height());
          $dropzoneMessage.text(lang.image.dragImageHere);
        }
        collection = collection.add(e.target);
      };

      documentEventHandlers.onDragleave = function (e) {
        collection = collection.not(e.target);
        if (!collection.length) {
          $editor.removeClass('dragover');
        }
      };

      documentEventHandlers.onDrop = function () {
        collection = $();
        $editor.removeClass('dragover');
      };

      // show dropzone on dragenter when dragging a object to document
      // -but only if the editor is visible, i.e. has a positive width and height
      $document.on('dragenter', documentEventHandlers.onDragenter)
        .on('dragleave', documentEventHandlers.onDragleave)
        .on('drop', documentEventHandlers.onDrop);

      // change dropzone's message on hover.
      $dropzone.on('dragenter', function () {
        $dropzone.addClass('hover');
        $dropzoneMessage.text(lang.image.dropImage);
      }).on('dragleave', function () {
        $dropzone.removeClass('hover');
        $dropzoneMessage.text(lang.image.dragImageHere);
      });

      // attach dropImage
      $dropzone.on('drop', function (event) {
        var dataTransfer = event.originalEvent.dataTransfer;

        if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
          event.preventDefault();
          $editable.focus();
          context.invoke('editor.insertImagesOrCallback', dataTransfer.files);
        } else {
          $.each(dataTransfer.types, function (idx, type) {
            var content = dataTransfer.getData(type);

            if (type.toLowerCase().indexOf('text') > -1) {
              context.invoke('editor.pasteHTML', content);
            } else {
              $(content).each(function () {
                context.invoke('editor.insertNode', this);
              });
            }
          });
        }
      }).on('dragover', false); // prevent default dragover event
    };

    this.destroy = function () {
      detachDocumentEvent();
    };
  };


  var CodeMirror;
  if (agent.hasCodeMirror) {
    if (agent.isSupportAmd) {
      require(['codemirror'], function (cm) {
        CodeMirror = cm;
      });
    } else {
      CodeMirror = window.CodeMirror;
    }
  }

  /**
   * @class Codeview
   */
  var Codeview = function (context) {
    var $editor = context.layoutInfo.editor;
    var $editable = context.layoutInfo.editable;
    var $codable = context.layoutInfo.codable;
    var options = context.options;

    this.sync = function () {
      var isCodeview = this.isActivated();
      if (isCodeview && agent.hasCodeMirror) {
        $codable.data('cmEditor').save();
      }
    };

    /**
     * @return {Boolean}
     */
    this.isActivated = function () {
      return $editor.hasClass('codeview');
    };

    /**
     * toggle codeview
     */
    this.toggle = function () {
      if (this.isActivated()) {
        this.deactivate();
      } else {
        this.activate();
      }
      context.triggerEvent('codeview.toggled');
    };

    /**
     * activate code view
     */
    this.activate = function () {
      $codable.val(dom.html($editable, options.prettifyHtml));
      $codable.height($editable.height());

      context.invoke('toolbar.updateCodeview', true);
      $editor.addClass('codeview');
      $codable.focus();

      // activate CodeMirror as codable
      if (agent.hasCodeMirror) {
        var cmEditor = CodeMirror.fromTextArea($codable[0], options.codemirror);

        // CodeMirror TernServer
        if (options.codemirror.tern) {
          var server = new CodeMirror.TernServer(options.codemirror.tern);
          cmEditor.ternServer = server;
          cmEditor.on('cursorActivity', function (cm) {
            server.updateArgHints(cm);
          });
        }

        // CodeMirror hasn't Padding.
        cmEditor.setSize(null, $editable.outerHeight());
        $codable.data('cmEditor', cmEditor);
      }
    };

    /**
     * deactivate code view
     */
    this.deactivate = function () {
      // deactivate CodeMirror as codable
      if (agent.hasCodeMirror) {
        var cmEditor = $codable.data('cmEditor');
        $codable.val(cmEditor.getValue());
        cmEditor.toTextArea();
      }

      var value = dom.value($codable, options.prettifyHtml) || dom.emptyPara;
      var isChange = $editable.html() !== value;

      $editable.html(value);
      $editable.height(options.height ? $codable.height() : 'auto');
      $editor.removeClass('codeview');

      if (isChange) {
        context.triggerEvent('change', $editable.html(), $editable);
      }

      $editable.focus();

      context.invoke('toolbar.updateCodeview', false);
    };

    this.destroy = function () {
      if (this.isActivated()) {
        this.deactivate();
      }
    };
  };

  var EDITABLE_PADDING = 24;

  var Statusbar = function (context) {
    var $document = $(document);
    var $statusbar = context.layoutInfo.statusbar;
    var $editable = context.layoutInfo.editable;
    var options = context.options;

    this.initialize = function () {
      if (options.airMode || options.disableResizeEditor) {
        return;
      }

      $statusbar.on('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var editableTop = $editable.offset().top - $document.scrollTop();

        $document.on('mousemove', function (event) {
          var height = event.clientY - (editableTop + EDITABLE_PADDING);

          height = (options.minheight > 0) ? Math.max(height, options.minheight) : height;
          height = (options.maxHeight > 0) ? Math.min(height, options.maxHeight) : height;

          $editable.height(height);
        }).one('mouseup', function () {
          $document.off('mousemove');
        });
      });
    };

    this.destroy = function () {
      $statusbar.off();
      $statusbar.remove();
    };
  };

  var Fullscreen = function (context) {
    var $editor = context.layoutInfo.editor;
    var $toolbar = context.layoutInfo.toolbar;
    var $editable = context.layoutInfo.editable;
    var $codable = context.layoutInfo.codable;

    var $window = $(window);
    var $scrollbar = $('html, body');

    /**
     * toggle fullscreen
     */
    this.toggle = function () {
      var resize = function (size) {
        $editable.css('height', size.h);
        $codable.css('height', size.h);
        if ($codable.data('cmeditor')) {
          $codable.data('cmeditor').setsize(null, size.h);
        }
      };

      $editor.toggleClass('fullscreen');
      if (this.isFullscreen()) {
        $editable.data('orgHeight', $editable.css('height'));

        $window.on('resize', function () {
          resize({
            h: $window.height() - $toolbar.outerHeight()
          });
        }).trigger('resize');

        $scrollbar.css('overflow', 'hidden');
      } else {
        $window.off('resize');
        resize({
          h: $editable.data('orgHeight')
        });
        $scrollbar.css('overflow', 'visible');
      }

      context.invoke('toolbar.updateFullscreen', this.isFullscreen());
    };

    this.isFullscreen = function () {
      return $editor.hasClass('fullscreen');
    };
  };

  var Handle = function (context) {
    var self = this;

    var $document = $(document);
    var $editingArea = context.layoutInfo.editingArea;
    var options = context.options;

    this.events = {
      'summernote.mousedown': function (we, e) {
        if (self.update(e.target)) {
          e.preventDefault();
        }
      },
      'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function () {
        self.update();
      }
    };

    this.initialize = function () {
      this.$handle = $([
        '<div class="note-handle">',
        '<div class="note-control-selection">',
        '<div class="note-control-selection-bg"></div>',
        '<div class="note-control-holder note-control-nw"></div>',
        '<div class="note-control-holder note-control-ne"></div>',
        '<div class="note-control-holder note-control-sw"></div>',
        '<div class="',
        (options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
        ' note-control-se"></div>',
        (options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
        '</div>',
        '</div>'
      ].join('')).prependTo($editingArea);

      this.$handle.on('mousedown', function (event) {
        if (dom.isControlSizing(event.target)) {
          event.preventDefault();
          event.stopPropagation();

          var $target = self.$handle.find('.note-control-selection').data('target'),
              posStart = $target.offset(),
              scrollTop = $document.scrollTop();

          $document.on('mousemove', function (event) {
            context.invoke('editor.resizeTo', {
              x: event.clientX - posStart.left,
              y: event.clientY - (posStart.top - scrollTop)
            }, $target, !event.shiftKey);

            self.update($target[0]);
          }).one('mouseup', function (e) {
            e.preventDefault();
            $document.off('mousemove');
            context.invoke('editor.afterCommand');
          });

          if (!$target.data('ratio')) { // original ratio.
            $target.data('ratio', $target.height() / $target.width());
          }
        }
      });
    };

    this.destroy = function () {
      this.$handle.remove();
    };

    this.update = function (target) {
      var isImage = dom.isImg(target);
      var $selection = this.$handle.find('.note-control-selection');

      context.invoke('imagePopover.update', target);

      if (isImage) {
        var $image = $(target);
        var pos = $image.position();

        // include margin
        var imageSize = {
          w: $image.outerWidth(true),
          h: $image.outerHeight(true)
        };

        $selection.css({
          display: 'block',
          left: pos.left,
          top: pos.top,
          width: imageSize.w,
          height: imageSize.h
        }).data('target', $image); // save current image element.

        var sizingText = imageSize.w + 'x' + imageSize.h;
        $selection.find('.note-control-selection-info').text(sizingText);
        context.invoke('editor.saveTarget', target);
      } else {
        this.hide();
      }

      return isImage;
    };

    /**
     * hide
     *
     * @param {jQuery} $handle
     */
    this.hide = function () {
      context.invoke('editor.clearTarget');
      this.$handle.children().hide();
    };
  };

  var AutoLink = function (context) {
    var self = this;
    var defaultScheme = 'http://';
    var linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;

    this.events = {
      'summernote.keyup': function (we, e) {
        if (!e.isDefaultPrevented()) {
          self.handleKeyup(e);
        }
      },
      'summernote.keydown': function (we, e) {
        self.handleKeydown(e);
      }
    };

    this.initialize = function () {
      this.lastWordRange = null;
    };

    this.destroy = function () {
      this.lastWordRange = null;
    };

    this.replace = function () {
      if (!this.lastWordRange) {
        return;
      }

      var keyword = this.lastWordRange.toString();
      var match = keyword.match(linkPattern);

      if (match && (match[1] || match[2])) {
        var link = match[1] ? keyword : defaultScheme + keyword;
        var node = $('<a />').html(keyword).attr('href', link)[0];

        this.lastWordRange.insertNode(node);
        this.lastWordRange = null;
        context.invoke('editor.focus');
      }

    };

    this.handleKeydown = function (e) {
      if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
        var wordRange = context.invoke('editor.createRange').getWordRange();
        this.lastWordRange = wordRange;
      }
    };

    this.handleKeyup = function (e) {
      if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
        this.replace();
      }
    };
  };

  /**
   * textarea auto sync.
   */
  var AutoSync = function (context) {
    var $note = context.layoutInfo.note;

    this.events = {
      'summernote.change': function () {
        $note.val(context.invoke('code'));
      }
    };

    this.shouldInitialize = function () {
      return dom.isTextarea($note[0]);
    };
  };

  var Placeholder = function (context) {
    var self = this;
    var $editingArea = context.layoutInfo.editingArea;
    var options = context.options;

    this.events = {
      'summernote.init summernote.change': function () {
        self.update();
      },
      'summernote.codeview.toggled': function () {
        self.update();
      }
    };

    this.shouldInitialize = function () {
      return !!options.placeholder;
    };

    this.initialize = function () {
      this.$placeholder = $('<div class="note-placeholder">');
      this.$placeholder.on('click', function () {
        context.invoke('focus');
      }).text(options.placeholder).prependTo($editingArea);
    };

    this.destroy = function () {
      this.$placeholder.remove();
    };

    this.update = function () {
      var isShow = !context.invoke('codeview.isActivated') && context.invoke('editor.isEmpty');
      this.$placeholder.toggle(isShow);
    };
  };

  var Buttons = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;
    var lang = options.langInfo;

    var invertedKeyMap = func.invertObject(options.keyMap[agent.isMac ? 'mac' : 'pc']);

    var representShortcut = this.representShortcut = function (editorMethod) {
      var shortcut = invertedKeyMap[editorMethod];
      if (!options.shortcuts || !shortcut) {
        return '';
      }

      if (agent.isMac) {
        shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
      }

      shortcut = shortcut.replace('BACKSLASH', '\\')
                         .replace('SLASH', '/')
                         .replace('LEFTBRACKET', '[')
                         .replace('RIGHTBRACKET', ']');

      return ' (' + shortcut + ')';
    };

    this.initialize = function () {
      this.addToolbarButtons();
      this.addImagePopoverButtons();
      this.addLinkPopoverButtons();
      this.fontInstalledMap = {};
    };

    this.destroy = function () {
      delete this.fontInstalledMap;
    };

    this.isFontInstalled = function (name) {
      if (!self.fontInstalledMap.hasOwnProperty(name)) {
        self.fontInstalledMap[name] = agent.isFontInstalled(name) ||
          list.contains(options.fontNamesIgnoreCheck, name);
      }

      return self.fontInstalledMap[name];
    };

    this.addToolbarButtons = function () {
      context.memo('button.style', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: ui.icon(options.icons.magic) + ' ' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.style.style,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown({
            className: 'dropdown-style',
            items: context.options.styleTags,
            template: function (item) {

              if (typeof item === 'string') {
                item = { tag: item, title: (lang.style.hasOwnProperty(item) ? lang.style[item] : item) };
              }

              var tag = item.tag;
              var title = item.title;
              var style = item.style ? ' style="' + item.style + '" ' : '';
              var className = item.className ? ' class="' + item.className + '"' : '';

              return '<' + tag + style + className + '>' + title + '</' + tag +  '>';
            },
            click: context.createInvokeHandler('editor.formatBlock')
          })
        ]).render();
      });

      context.memo('button.bold', function () {
        return ui.button({
          className: 'note-btn-bold',
          contents: ui.icon(options.icons.bold),
          tooltip: lang.font.bold + representShortcut('bold'),
          click: context.createInvokeHandler('editor.bold')
        }).render();
      });

      context.memo('button.italic', function () {
        return ui.button({
          className: 'note-btn-italic',
          contents: ui.icon(options.icons.italic),
          tooltip: lang.font.italic + representShortcut('italic'),
          click: context.createInvokeHandler('editor.italic')
        }).render();
      });

      context.memo('button.underline', function () {
        return ui.button({
          className: 'note-btn-underline',
          contents: ui.icon(options.icons.underline),
          tooltip: lang.font.underline + representShortcut('underline'),
          click: context.createInvokeHandler('editor.underline')
        }).render();
      });

      context.memo('button.clear', function () {
        return ui.button({
          contents: ui.icon(options.icons.eraser),
          tooltip: lang.font.clear + representShortcut('removeFormat'),
          click: context.createInvokeHandler('editor.removeFormat')
        }).render();
      });

      context.memo('button.strikethrough', function () {
        return ui.button({
          className: 'note-btn-strikethrough',
          contents: ui.icon(options.icons.strikethrough),
          tooltip: lang.font.strikethrough + representShortcut('strikethrough'),
          click: context.createInvokeHandler('editor.strikethrough')
        }).render();
      });

      context.memo('button.superscript', function () {
        return ui.button({
          className: 'note-btn-superscript',
          contents: ui.icon(options.icons.superscript),
          tooltip: lang.font.superscript,
          click: context.createInvokeHandler('editor.superscript')
        }).render();
      });

      context.memo('button.subscript', function () {
        return ui.button({
          className: 'note-btn-subscript',
          contents: ui.icon(options.icons.subscript),
          tooltip: lang.font.subscript,
          click: context.createInvokeHandler('editor.subscript')
        }).render();
      });

      context.memo('button.fontname', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: '<span class="note-current-fontname"/> ' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.font.name,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdownCheck({
            className: 'dropdown-fontname',
            checkClassName: options.icons.menuCheck,
            items: options.fontNames.filter(self.isFontInstalled),
            template: function (item) {
              return '<span style="font-family:' + item + '">' + item + '</span>';
            },
            click: context.createInvokeHandler('editor.fontName')
          })
        ]).render();
      });

      context.memo('button.fontsize', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: '<span class="note-current-fontsize"/>' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.font.size,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdownCheck({
            className: 'dropdown-fontsize',
            checkClassName: options.icons.menuCheck,
            items: options.fontSizes,
            click: context.createInvokeHandler('editor.fontSize')
          })
        ]).render();
      });

      context.memo('button.color', function () {
        return ui.buttonGroup({
          className: 'note-color',
          children: [
            ui.button({
              className: 'note-current-color-button',
              contents: ui.icon(options.icons.font + ' note-recent-color'),
              tooltip: lang.color.recent,
              click: function (e) {
                var $button = $(e.currentTarget);
                context.invoke('editor.color', {
                  backColor: $button.attr('data-backColor'),
                  foreColor: $button.attr('data-foreColor')
                });
              },
              callback: function ($button) {
                var $recentColor = $button.find('.note-recent-color');
                $recentColor.css('background-color', '#FFFF00');
                $button.attr('data-backColor', '#FFFF00');
              }
            }),
            ui.button({
              className: 'dropdown-toggle',
              contents: ui.icon(options.icons.caret, 'span'),
              tooltip: lang.color.more,
              data: {
                toggle: 'dropdown'
              }
            }),
            ui.dropdown({
              items: [
                '<li>',
                '<div class="btn-group">',
                '  <div class="note-palette-title">' + lang.color.background + '</div>',
                '  <div>',
                '    <button type="button" class="note-color-reset btn btn-default" data-event="backColor" data-value="inherit">',
                lang.color.transparent,
                '    </button>',
                '  </div>',
                '  <div class="note-holder" data-event="backColor"/>',
                '</div>',
                '<div class="btn-group">',
                '  <div class="note-palette-title">' + lang.color.foreground + '</div>',
                '  <div>',
                '    <button type="button" class="note-color-reset btn btn-default" data-event="removeFormat" data-value="foreColor">',
                lang.color.resetToDefault,
                '    </button>',
                '  </div>',
                '  <div class="note-holder" data-event="foreColor"/>',
                '</div>',
                '</li>'
              ].join(''),
              callback: function ($dropdown) {
                $dropdown.find('.note-holder').each(function () {
                  var $holder = $(this);
                  $holder.append(ui.palette({
                    colors: options.colors,
                    eventName: $holder.data('event')
                  }).render());
                });
              },
              click: function (event) {
                var $button = $(event.target);
                var eventName = $button.data('event');
                var value = $button.data('value');

                if (eventName && value) {
                  var key = eventName === 'backColor' ? 'background-color' : 'color';
                  var $color = $button.closest('.note-color').find('.note-recent-color');
                  var $currentButton = $button.closest('.note-color').find('.note-current-color-button');

                  $color.css(key, value);
                  $currentButton.attr('data-' + eventName, value);
                  context.invoke('editor.' + eventName, value);
                }
              }
            })
          ]
        }).render();
      });

      context.memo('button.ul',  function () {
        return ui.button({
          contents: ui.icon(options.icons.unorderedlist),
          tooltip: lang.lists.unordered + representShortcut('insertUnorderedList'),
          click: context.createInvokeHandler('editor.insertUnorderedList')
        }).render();
      });

      context.memo('button.ol', function () {
        return ui.button({
          contents: ui.icon(options.icons.orderedlist),
          tooltip: lang.lists.ordered + representShortcut('insertOrderedList'),
          click:  context.createInvokeHandler('editor.insertOrderedList')
        }).render();
      });

      var justifyLeft = ui.button({
        contents: ui.icon(options.icons.alignLeft),
        tooltip: lang.paragraph.left + representShortcut('justifyLeft'),
        click: context.createInvokeHandler('editor.justifyLeft')
      });

      var justifyCenter = ui.button({
        contents: ui.icon(options.icons.alignCenter),
        tooltip: lang.paragraph.center + representShortcut('justifyCenter'),
        click: context.createInvokeHandler('editor.justifyCenter')
      });

      var justifyRight = ui.button({
        contents: ui.icon(options.icons.alignRight),
        tooltip: lang.paragraph.right + representShortcut('justifyRight'),
        click: context.createInvokeHandler('editor.justifyRight')
      });

      var justifyFull = ui.button({
        contents: ui.icon(options.icons.alignJustify),
        tooltip: lang.paragraph.justify + representShortcut('justifyFull'),
        click: context.createInvokeHandler('editor.justifyFull')
      });

      var outdent = ui.button({
        contents: ui.icon(options.icons.outdent),
        tooltip: lang.paragraph.outdent + representShortcut('outdent'),
        click: context.createInvokeHandler('editor.outdent')
      });

      var indent = ui.button({
        contents: ui.icon(options.icons.indent),
        tooltip: lang.paragraph.indent + representShortcut('indent'),
        click: context.createInvokeHandler('editor.indent')
      });

      context.memo('button.justifyLeft', func.invoke(justifyLeft, 'render'));
      context.memo('button.justifyCenter', func.invoke(justifyCenter, 'render'));
      context.memo('button.justifyRight', func.invoke(justifyRight, 'render'));
      context.memo('button.justifyFull', func.invoke(justifyFull, 'render'));
      context.memo('button.outdent', func.invoke(outdent, 'render'));
      context.memo('button.indent', func.invoke(indent, 'render'));

      context.memo('button.paragraph', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: ui.icon(options.icons.alignLeft) + ' ' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.paragraph.paragraph,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown([
            ui.buttonGroup({
              className: 'note-align',
              children: [justifyLeft, justifyCenter, justifyRight, justifyFull]
            }),
            ui.buttonGroup({
              className: 'note-list',
              children: [outdent, indent]
            })
          ])
        ]).render();
      });

      context.memo('button.height', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: ui.icon(options.icons.textHeight) + ' ' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.font.height,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdownCheck({
            items: options.lineHeights,
            checkClassName: options.icons.menuCheck,
            className: 'dropdown-line-height',
            click: context.createInvokeHandler('editor.lineHeight')
          })
        ]).render();
      });

      context.memo('button.table', function () {
        return ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: ui.icon(options.icons.table) + ' ' + ui.icon(options.icons.caret, 'span'),
            tooltip: lang.table.table,
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown({
            className: 'note-table',
            items: [
              '<div class="note-dimension-picker">',
              '  <div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>',
              '  <div class="note-dimension-picker-highlighted"/>',
              '  <div class="note-dimension-picker-unhighlighted"/>',
              '</div>',
              '<div class="note-dimension-display">1 x 1</div>'
            ].join('')
          })
        ], {
          callback: function ($node) {
            var $catcher = $node.find('.note-dimension-picker-mousecatcher');
            $catcher.css({
              width: options.insertTableMaxSize.col + 'em',
              height: options.insertTableMaxSize.row + 'em'
            }).mousedown(context.createInvokeHandler('editor.insertTable'))
              .on('mousemove', self.tableMoveHandler);
          }
        }).render();
      });

      context.memo('button.link', function () {
        return ui.button({
          contents: ui.icon(options.icons.link),
          tooltip: lang.link.link + representShortcut('linkDialog.show'),
          click: context.createInvokeHandler('linkDialog.show')
        }).render();
      });

      context.memo('button.picture', function () {
        return ui.button({
          contents: ui.icon(options.icons.picture),
          tooltip: lang.image.image,
          click: context.createInvokeHandler('imageDialog.show')
        }).render();
      });

      context.memo('button.video', function () {
        return ui.button({
          contents: ui.icon(options.icons.video),
          tooltip: lang.video.video,
          click: context.createInvokeHandler('videoDialog.show')
        }).render();
      });

      context.memo('button.hr', function () {
        return ui.button({
          contents: ui.icon(options.icons.minus),
          tooltip: lang.hr.insert + representShortcut('insertHorizontalRule'),
          click: context.createInvokeHandler('editor.insertHorizontalRule')
        }).render();
      });

      context.memo('button.fullscreen', function () {
        return ui.button({
          className: 'btn-fullscreen',
          contents: ui.icon(options.icons.arrowsAlt),
          tooltip: lang.options.fullscreen,
          click: context.createInvokeHandler('fullscreen.toggle')
        }).render();
      });

      context.memo('button.codeview', function () {
        return ui.button({
          className: 'btn-codeview',
          contents: ui.icon(options.icons.code),
          tooltip: lang.options.codeview,
          click: context.createInvokeHandler('codeview.toggle')
        }).render();
      });

      context.memo('button.redo', function () {
        return ui.button({
          contents: ui.icon(options.icons.redo),
          tooltip: lang.history.redo + representShortcut('redo'),
          click: context.createInvokeHandler('editor.redo')
        }).render();
      });

      context.memo('button.undo', function () {
        return ui.button({
          contents: ui.icon(options.icons.undo),
          tooltip: lang.history.undo + representShortcut('undo'),
          click: context.createInvokeHandler('editor.undo')
        }).render();
      });

      context.memo('button.help', function () {
        return ui.button({
          contents: ui.icon(options.icons.question),
          tooltip: lang.options.help,
          click: context.createInvokeHandler('helpDialog.show')
        }).render();
      });
    };

    /**
     * image : [
     *   ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
     *   ['float', ['floatLeft', 'floatRight', 'floatNone' ]],
     *   ['remove', ['removeMedia']]
     * ],
     */
    this.addImagePopoverButtons = function () {
      // Image Size Buttons
      context.memo('button.imageSize100', function () {
        return ui.button({
          contents: '<span class="note-fontsize-10">100%</span>',
          tooltip: lang.image.resizeFull,
          click: context.createInvokeHandler('editor.resize', '1')
        }).render();
      });
      context.memo('button.imageSize50', function () {
        return  ui.button({
          contents: '<span class="note-fontsize-10">50%</span>',
          tooltip: lang.image.resizeHalf,
          click: context.createInvokeHandler('editor.resize', '0.5')
        }).render();
      });
      context.memo('button.imageSize25', function () {
        return ui.button({
          contents: '<span class="note-fontsize-10">25%</span>',
          tooltip: lang.image.resizeQuarter,
          click: context.createInvokeHandler('editor.resize', '0.25')
        }).render();
      });

      // Float Buttons
      context.memo('button.floatLeft', function () {
        return ui.button({
          contents: ui.icon(options.icons.alignLeft),
          tooltip: lang.image.floatLeft,
          click: context.createInvokeHandler('editor.floatMe', 'left')
        }).render();
      });

      context.memo('button.floatRight', function () {
        return ui.button({
          contents: ui.icon(options.icons.alignRight),
          tooltip: lang.image.floatRight,
          click: context.createInvokeHandler('editor.floatMe', 'right')
        }).render();
      });

      context.memo('button.floatNone', function () {
        return ui.button({
          contents: ui.icon(options.icons.alignJustify),
          tooltip: lang.image.floatNone,
          click: context.createInvokeHandler('editor.floatMe', 'none')
        }).render();
      });

      // Remove Buttons
      context.memo('button.removeMedia', function () {
        return ui.button({
          contents: ui.icon(options.icons.trash),
          tooltip: lang.image.remove,
          click: context.createInvokeHandler('editor.removeMedia')
        }).render();
      });
    };

    this.addLinkPopoverButtons = function () {
      context.memo('button.linkDialogShow', function () {
        return ui.button({
          contents: ui.icon(options.icons.link),
          tooltip: lang.link.edit,
          click: context.createInvokeHandler('linkDialog.show')
        }).render();
      });

      context.memo('button.unlink', function () {
        return ui.button({
          contents: ui.icon(options.icons.unlink),
          tooltip: lang.link.unlink,
          click: context.createInvokeHandler('editor.unlink')
        }).render();
      });
    };

    this.build = function ($container, groups) {
      for (var groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) {
        var group = groups[groupIdx];
        var groupName = group[0];
        var buttons = group[1];

        var $group = ui.buttonGroup({
          className: 'note-' + groupName
        }).render();

        for (var idx = 0, len = buttons.length; idx < len; idx++) {
          var button = context.memo('button.' + buttons[idx]);
          if (button) {
            $group.append(typeof button === 'function' ? button(context) : button);
          }
        }
        $group.appendTo($container);
      }
    };

    this.updateCurrentStyle = function () {
      var styleInfo = context.invoke('editor.currentStyle');
      this.updateBtnStates({
        '.note-btn-bold': function () {
          return styleInfo['font-bold'] === 'bold';
        },
        '.note-btn-italic': function () {
          return styleInfo['font-italic'] === 'italic';
        },
        '.note-btn-underline': function () {
          return styleInfo['font-underline'] === 'underline';
        },
        '.note-btn-subscript': function () {
          return styleInfo['font-subscript'] === 'subscript';
        },
        '.note-btn-superscript': function () {
          return styleInfo['font-superscript'] === 'superscript';
        },
        '.note-btn-strikethrough': function () {
          return styleInfo['font-strikethrough'] === 'strikethrough';
        }
      });

      if (styleInfo['font-family']) {
        var fontNames = styleInfo['font-family'].split(',').map(function (name) {
          return name.replace(/[\'\"]/g, '')
            .replace(/\s+$/, '')
            .replace(/^\s+/, '');
        });
        var fontName = list.find(fontNames, self.isFontInstalled);

        $toolbar.find('.dropdown-fontname li a').each(function () {
          // always compare string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (fontName + '');
          this.className = isChecked ? 'checked' : '';
        });
        $toolbar.find('.note-current-fontname').text(fontName);
      }

      if (styleInfo['font-size']) {
        var fontSize = styleInfo['font-size'];
        $toolbar.find('.dropdown-fontsize li a').each(function () {
          // always compare with string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (fontSize + '');
          this.className = isChecked ? 'checked' : '';
        });
        $toolbar.find('.note-current-fontsize').text(fontSize);
      }

      if (styleInfo['line-height']) {
        var lineHeight = styleInfo['line-height'];
        $toolbar.find('.dropdown-line-height li a').each(function () {
          // always compare with string to avoid creating another func.
          var isChecked = ($(this).data('value') + '') === (lineHeight + '');
          this.className = isChecked ? 'checked' : '';
        });
      }
    };

    this.updateBtnStates = function (infos) {
      $.each(infos, function (selector, pred) {
        ui.toggleBtnActive($toolbar.find(selector), pred());
      });
    };

    this.tableMoveHandler = function (event) {
      var PX_PER_EM = 18;
      var $picker = $(event.target.parentNode); // target is mousecatcher
      var $dimensionDisplay = $picker.next();
      var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
      var $highlighted = $picker.find('.note-dimension-picker-highlighted');
      var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');

      var posOffset;
      // HTML5 with jQuery - e.offsetX is undefined in Firefox
      if (event.offsetX === undefined) {
        var posCatcher = $(event.target).offset();
        posOffset = {
          x: event.pageX - posCatcher.left,
          y: event.pageY - posCatcher.top
        };
      } else {
        posOffset = {
          x: event.offsetX,
          y: event.offsetY
        };
      }

      var dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };

      $highlighted.css({ width: dim.c + 'em', height: dim.r + 'em' });
      $catcher.data('value', dim.c + 'x' + dim.r);

      if (3 < dim.c && dim.c < options.insertTableMaxSize.col) {
        $unhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (3 < dim.r && dim.r < options.insertTableMaxSize.row) {
        $unhighlighted.css({ height: dim.r + 1 + 'em'});
      }

      $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    };
  };

  var Toolbar = function (context) {
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;

    this.shouldInitialize = function () {
      return !options.airMode;
    };

    this.initialize = function () {
      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        context.invoke('buttons.build', $toolbar, options.toolbar);
      }

      if (options.toolbarContainer) {
        $toolbar.appendTo(options.toolbarContainer);
      }

      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        context.invoke('buttons.updateCurrentStyle');
      });

      context.invoke('buttons.updateCurrentStyle');
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

    this.updateFullscreen = function (isFullscreen) {
      ui.toggleBtnActive($toolbar.find('.btn-fullscreen'), isFullscreen);
    };

    this.updateCodeview = function (isCodeview) {
      ui.toggleBtnActive($toolbar.find('.btn-codeview'), isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    };

    this.activate = function (isIncludeCodeview) {
      var $btn = $toolbar.find('button');
      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview');
      }
      ui.toggleBtn($btn, true);
    };

    this.deactivate = function (isIncludeCodeview) {
      var $btn = $toolbar.find('button');
      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview');
      }
      ui.toggleBtn($btn, false);
    };
  };

  var LinkDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = '<div class="form-group">' +
                   '<label>' + lang.link.textToDisplay + '</label>' +
                   '<input class="note-link-text form-control" type="text" />' +
                 '</div>' +
                 '<div class="form-group">' +
                   '<label>' + lang.link.url + '</label>' +
                   '<input class="note-link-url form-control" type="text" value="http://" />' +
                 '</div>' +
                 (!options.disableLinkTarget ?
                   '<div class="checkbox">' +
                     '<label>' + '<input type="checkbox" checked> ' + lang.link.openInNewWindow + '</label>' +
                   '</div>' : ''
                 );
      var footer = '<button href="#" class="btn btn-primary note-link-btn disabled" disabled>' + lang.link.insert + '</button>';

      this.$dialog = ui.dialog({
        className: 'link-dialog',
        title: lang.link.insert,
        fade: options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    /**
     * toggle update button
     */
    this.toggleLinkBtn = function ($linkBtn, $linkText, $linkUrl) {
      ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
    };

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {Object} linkInfo
     * @return {Promise}
     */
    this.showLinkDialog = function (linkInfo) {
      return $.Deferred(function (deferred) {
        var $linkText = self.$dialog.find('.note-link-text'),
        $linkUrl = self.$dialog.find('.note-link-url'),
        $linkBtn = self.$dialog.find('.note-link-btn'),
        $openInNewWindow = self.$dialog.find('input[type=checkbox]');

        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');

          // if no url was given, copy text to url
          if (!linkInfo.url) {
            linkInfo.url = linkInfo.text;
          }

          $linkText.val(linkInfo.text);

          var handleLinkTextUpdate = function () {
            self.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
            // if linktext was modified by keyup,
            // stop cloning text from linkUrl
            linkInfo.text = $linkText.val();
          };

          $linkText.on('input', handleLinkTextUpdate).on('paste', function () {
            setTimeout(handleLinkTextUpdate, 0);
          });

          var handleLinkUrlUpdate = function () {
            self.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
            // display same link on `Text to display` input
            // when create a new link
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
          };

          $linkUrl.on('input', handleLinkUrlUpdate).on('paste', function () {
            setTimeout(handleLinkUrlUpdate, 0);
          }).val(linkInfo.url).trigger('focus');

          self.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
          self.bindEnterKey($linkUrl, $linkBtn);
          self.bindEnterKey($linkText, $linkBtn);

          $openInNewWindow.prop('checked', linkInfo.isNewWindow);

          $linkBtn.one('click', function (event) {
            event.preventDefault();

            deferred.resolve({
              range: linkInfo.range,
              url: $linkUrl.val(),
              text: $linkText.val(),
              isNewWindow: $openInNewWindow.is(':checked')
            });
            self.$dialog.modal('hide');
          });
        });

        ui.onDialogHidden(self.$dialog, function () {
          // detach events
          $linkText.off('input paste keypress');
          $linkUrl.off('input paste keypress');
          $linkBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      }).promise();
    };

    /**
     * @param {Object} layoutInfo
     */
    this.show = function () {
      var linkInfo = context.invoke('editor.getLinkInfo');

      context.invoke('editor.saveRange');
      this.showLinkDialog(linkInfo).then(function (linkInfo) {
        context.invoke('editor.restoreRange');
        context.invoke('editor.createLink', linkInfo);
      }).fail(function () {
        context.invoke('editor.restoreRange');
      });
    };
    context.memo('help.linkDialog.show', options.langInfo.help['linkDialog.show']);
  };

  var LinkPopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var options = context.options;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function () {
        self.update();
      },
      'summernote.dialog.shown': function () {
        self.hide();
      }
    };

    this.shouldInitialize = function () {
      return !list.isEmpty(options.popover.link);
    };

    this.initialize = function () {
      this.$popover = ui.popover({
        className: 'note-link-popover',
        callback: function ($node) {
          var $content = $node.find('.popover-content');
          $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
        }
      }).render().appendTo('body');
      var $content = this.$popover.find('.popover-content');

      context.invoke('buttons.build', $content, options.popover.link);
    };

    this.destroy = function () {
      this.$popover.remove();
    };

    this.update = function () {
      // Prevent focusing on editable when invoke('code') is executed
      if (!context.invoke('editor.hasFocus')) {
        this.hide();
        return;
      }

      var rng = context.invoke('editor.createRange');
      if (rng.isCollapsed() && rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        var href = $(anchor).attr('href');
        this.$popover.find('a').attr('href', href).html(href);

        var pos = dom.posFromPlaceholder(anchor);
        this.$popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  var ImageDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var imageLimitation = '';
      if (options.maximumImageFileSize) {
        var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
        var readableSize = (options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                           ' ' + ' KMGTP'[unit] + 'B';
        imageLimitation = '<small>' + lang.image.maximumFileSize + ' : ' + readableSize + '</small>';
      }

      var body = '<div class="form-group note-group-select-from-files">' +
                   '<label>' + lang.image.selectFromFiles + '</label>' +
                   '<input class="note-image-input form-control" type="file" name="files" accept="image/*" multiple="multiple" />' +
                   imageLimitation +
                 '</div>' +
                 '<div class="form-group note-group-image-url" style="overflow:auto;">' +
                   '<label>' + lang.image.url + '</label>' +
                   '<input class="note-image-url form-control col-md-12" type="text" />' +
                 '</div>';
      var footer = '<button href="#" class="btn btn-primary note-image-btn disabled" disabled>' + lang.image.insert + '</button>';

      this.$dialog = ui.dialog({
        title: lang.image.insert,
        fade: options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    this.show = function () {
      context.invoke('editor.saveRange');
      this.showImageDialog().then(function (data) {
        // [workaround] hide dialog before restore range for IE range focus
        ui.hideDialog(self.$dialog);
        context.invoke('editor.restoreRange');

        if (typeof data === 'string') { // image url
          context.invoke('editor.insertImage', data);
        } else { // array of files
          context.invoke('editor.insertImagesOrCallback', data);
        }
      }).fail(function () {
        context.invoke('editor.restoreRange');
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function () {
      return $.Deferred(function (deferred) {
        var $imageInput = self.$dialog.find('.note-image-input'),
            $imageUrl = self.$dialog.find('.note-image-url'),
            $imageBtn = self.$dialog.find('.note-image-btn');

        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');

          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              deferred.resolve(this.files || this.value);
            })
            .val('')
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($imageUrl.val());
          });

          $imageUrl.on('keyup paste', function () {
            var url = $imageUrl.val();
            ui.toggleBtn($imageBtn, url);
          }).val('').trigger('focus');
          self.bindEnterKey($imageUrl, $imageBtn);
        });

        ui.onDialogHidden(self.$dialog, function () {
          $imageInput.off('change');
          $imageUrl.off('keyup paste keypress');
          $imageBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      });
    };
  };

  var ImagePopover = function (context) {
    var ui = $.summernote.ui;

    var options = context.options;

    this.shouldInitialize = function () {
      return !list.isEmpty(options.popover.image);
    };

    this.initialize = function () {
      this.$popover = ui.popover({
        className: 'note-image-popover'
      }).render().appendTo('body');
      var $content = this.$popover.find('.popover-content');

      context.invoke('buttons.build', $content, options.popover.image);
    };

    this.destroy = function () {
      this.$popover.remove();
    };

    this.update = function (target) {
      if (dom.isImg(target)) {
        var pos = dom.posFromPlaceholder(target);
        this.$popover.css({
          display: 'block',
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  var VideoDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = '<div class="form-group row-fluid">' +
          '<label>' + lang.video.url + ' <small class="text-muted">' + lang.video.providers + '</small></label>' +
          '<input class="note-video-url form-control span12" type="text" />' +
          '</div>';
      var footer = '<button href="#" class="btn btn-primary note-video-btn disabled" disabled>' + lang.video.insert + '</button>';

      this.$dialog = ui.dialog({
        title: lang.video.insert,
        fade: options.dialogsFade,
        body: body,
        footer: footer
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
      $input.on('keypress', function (event) {
        if (event.keyCode === key.code.ENTER) {
          $btn.trigger('click');
        }
      });
    };

    this.createVideoNode = function (url) {
      // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
      var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      var ytMatch = url.match(ytRegExp);

      var igRegExp = /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/;
      var igMatch = url.match(igRegExp);

      var vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
      var vMatch = url.match(vRegExp);

      var vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
      var vimMatch = url.match(vimRegExp);

      var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      var dmMatch = url.match(dmRegExp);

      var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
      var youkuMatch = url.match(youkuRegExp);

      var mp4RegExp = /^.+.(mp4|m4v)$/;
      var mp4Match = url.match(mp4RegExp);

      var oggRegExp = /^.+.(ogg|ogv)$/;
      var oggMatch = url.match(oggRegExp);

      var webmRegExp = /^.+.(webm)$/;
      var webmMatch = url.match(webmRegExp);

      var $video;
      if (ytMatch && ytMatch[1].length === 11) {
        var youtubeId = ytMatch[1];
        $video = $('<iframe>')
            .attr('frameborder', 0)
            .attr('src', '//www.youtube.com/embed/' + youtubeId)
            .attr('width', '640').attr('height', '360');
      } else if (igMatch && igMatch[0].length) {
        $video = $('<iframe>')
            .attr('frameborder', 0)
            .attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/')
            .attr('width', '612').attr('height', '710')
            .attr('scrolling', 'no')
            .attr('allowtransparency', 'true');
      } else if (vMatch && vMatch[0].length) {
        $video = $('<iframe>')
            .attr('frameborder', 0)
            .attr('src', vMatch[0] + '/embed/simple')
            .attr('width', '600').attr('height', '600')
            .attr('class', 'vine-embed');
      } else if (vimMatch && vimMatch[3].length) {
        $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
            .attr('width', '640').attr('height', '360');
      } else if (dmMatch && dmMatch[2].length) {
        $video = $('<iframe>')
            .attr('frameborder', 0)
            .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
            .attr('width', '640').attr('height', '360');
      } else if (youkuMatch && youkuMatch[1].length) {
        $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('height', '498')
            .attr('width', '510')
            .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
      } else if (mp4Match || oggMatch || webmMatch) {
        $video = $('<video controls>')
            .attr('src', url)
            .attr('width', '640').attr('height', '360');
      } else {
        // this is not a known video link. Now what, Cat? Now what?
        return false;
      }

      $video.addClass('note-video-clip');

      return $video[0];
    };

    this.show = function () {
      var text = context.invoke('editor.getSelectedText');
      context.invoke('editor.saveRange');
      this.showVideoDialog(text).then(function (url) {
        // [workaround] hide dialog before restore range for IE range focus
        ui.hideDialog(self.$dialog);
        context.invoke('editor.restoreRange');

        // build node
        var $node = self.createVideoNode(url);

        if ($node) {
          // insert video node
          context.invoke('editor.insertNode', $node);
        }
      }).fail(function () {
        context.invoke('editor.restoreRange');
      });
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showVideoDialog = function (text) {
      return $.Deferred(function (deferred) {
        var $videoUrl = self.$dialog.find('.note-video-url'),
            $videoBtn = self.$dialog.find('.note-video-btn');

        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');

          $videoUrl.val(text).on('input', function () {
            ui.toggleBtn($videoBtn, $videoUrl.val());
          }).trigger('focus');

          $videoBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($videoUrl.val());
          });

          self.bindEnterKey($videoUrl, $videoBtn);
        });

        ui.onDialogHidden(self.$dialog, function () {
          $videoUrl.off('input');
          $videoBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      });
    };
  };

  var HelpDialog = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    this.createShortCutList = function () {
      var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
      return Object.keys(keyMap).map(function (key) {
        var command = keyMap[key];
        var $row = $('<div><div class="help-list-item"/></div>');
        $row.append($('<label><kbd>' + key + '</kdb></label>').css({
          'width': 180,
          'margin-right': 10
        })).append($('<span/>').html(context.memo('help.' + command) || command));
        return $row.html();
      }).join('');
    };

    this.initialize = function () {
      var $container = options.dialogsInBody ? $(document.body) : $editor;

      var body = [
        '<p class="text-center">',
        '<a href="http://summernote.org/" target="_blank">Summernote 0.8.2</a> · ',
        '<a href="https://github.com/summernote/summernote" target="_blank">Project</a> · ',
        '<a href="https://github.com/summernote/summernote/issues" target="_blank">Issues</a>',
        '</p>'
      ].join('');

      this.$dialog = ui.dialog({
        title: lang.options.help,
        fade: options.dialogsFade,
        body: this.createShortCutList(),
        footer: body,
        callback: function ($node) {
          $node.find('.modal-body').css({
            'max-height': 300,
            'overflow': 'scroll'
          });
        }
      }).render().appendTo($container);
    };

    this.destroy = function () {
      ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    };

    /**
     * show help dialog
     *
     * @return {Promise}
     */
    this.showHelpDialog = function () {
      return $.Deferred(function (deferred) {
        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');
          deferred.resolve();
        });
        ui.showDialog(self.$dialog);
      }).promise();
    };

    this.show = function () {
      context.invoke('editor.saveRange');
      this.showHelpDialog().then(function () {
        context.invoke('editor.restoreRange');
      });
    };
  };

  var AirPopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var options = context.options;

    var AIR_MODE_POPOVER_X_OFFSET = 20;

    this.events = {
      'summernote.keyup summernote.mouseup summernote.scroll': function () {
        self.update();
      },
      'summernote.change summernote.dialog.shown': function () {
        self.hide();
      },
      'summernote.focusout': function (we, e) {
        // [workaround] Firefox doesn't support relatedTarget on focusout
        //  - Ignore hide action on focus out in FF.
        if (agent.isFF) {
          return;
        }

        if (!e.relatedTarget || !dom.ancestor(e.relatedTarget, func.eq(self.$popover[0]))) {
          self.hide();
        }
      }
    };

    this.shouldInitialize = function () {
      return options.airMode && !list.isEmpty(options.popover.air);
    };

    this.initialize = function () {
      this.$popover = ui.popover({
        className: 'note-air-popover'
      }).render().appendTo('body');
      var $content = this.$popover.find('.popover-content');

      context.invoke('buttons.build', $content, options.popover.air);
    };

    this.destroy = function () {
      this.$popover.remove();
    };

    this.update = function () {
      var styleInfo = context.invoke('editor.currentStyle');
      if (styleInfo.range && !styleInfo.range.isCollapsed()) {
        var rect = list.last(styleInfo.range.getClientRects());
        if (rect) {
          var bnd = func.rect2bnd(rect);
          this.$popover.css({
            display: 'block',
            left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
            top: bnd.top + bnd.height
          });
        }
      } else {
        this.hide();
      }
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  var HintPopover = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var POPOVER_DIST = 5;
    var hint = context.options.hint || [];
    var direction = context.options.hintDirection || 'bottom';
    var hints = $.isArray(hint) ? hint : [hint];

    this.events = {
      'summernote.keyup': function (we, e) {
        if (!e.isDefaultPrevented()) {
          self.handleKeyup(e);
        }
      },
      'summernote.keydown': function (we, e) {
        self.handleKeydown(e);
      },
      'summernote.dialog.shown': function () {
        self.hide();
      }
    };

    this.shouldInitialize = function () {
      return hints.length > 0;
    };

    this.initialize = function () {
      this.lastWordRange = null;
      this.$popover = ui.popover({
        className: 'note-hint-popover',
        hideArrow: true,
        direction: ''
      }).render().appendTo('body');

      this.$popover.hide();

      this.$content = this.$popover.find('.popover-content');

      this.$content.on('click', '.note-hint-item', function () {
        self.$content.find('.active').removeClass('active');
        $(this).addClass('active');
        self.replace();
      });
    };

    this.destroy = function () {
      this.$popover.remove();
    };

    this.selectItem = function ($item) {
      this.$content.find('.active').removeClass('active');
      $item.addClass('active');

      this.$content[0].scrollTop = $item[0].offsetTop - (this.$content.innerHeight() / 2);
    };

    this.moveDown = function () {
      var $current = this.$content.find('.note-hint-item.active');
      var $next = $current.next();

      if ($next.length) {
        this.selectItem($next);
      } else {
        var $nextGroup = $current.parent().next();

        if (!$nextGroup.length) {
          $nextGroup = this.$content.find('.note-hint-group').first();
        }

        this.selectItem($nextGroup.find('.note-hint-item').first());
      }
    };

    this.moveUp = function () {
      var $current = this.$content.find('.note-hint-item.active');
      var $prev = $current.prev();

      if ($prev.length) {
        this.selectItem($prev);
      } else {
        var $prevGroup = $current.parent().prev();

        if (!$prevGroup.length) {
          $prevGroup = this.$content.find('.note-hint-group').last();
        }

        this.selectItem($prevGroup.find('.note-hint-item').last());
      }
    };

    this.replace = function () {
      var $item = this.$content.find('.note-hint-item.active');

      if ($item.length) {
        var node = this.nodeFromItem($item);
        this.lastWordRange.insertNode(node);
        range.createFromNode(node).collapse().select();

        this.lastWordRange = null;
        this.hide();
        context.invoke('editor.focus');
      }

    };

    this.nodeFromItem = function ($item) {
      var hint = hints[$item.data('index')];
      var item = $item.data('item');
      var node = hint.content ? hint.content(item) : item;
      if (typeof node === 'string') {
        node = dom.createText(node);
      }
      return node;
    };

    this.createItemTemplates = function (hintIdx, items) {
      var hint = hints[hintIdx];
      return items.map(function (item, idx) {
        var $item = $('<div class="note-hint-item"/>');
        $item.append(hint.template ? hint.template(item) : item + '');
        $item.data({
          'index': hintIdx,
          'item': item
        });

        if (hintIdx === 0 && idx === 0) {
          $item.addClass('active');
        }
        return $item;
      });
    };

    this.handleKeydown = function (e) {
      if (!this.$popover.is(':visible')) {
        return;
      }

      if (e.keyCode === key.code.ENTER) {
        e.preventDefault();
        this.replace();
      } else if (e.keyCode === key.code.UP) {
        e.preventDefault();
        this.moveUp();
      } else if (e.keyCode === key.code.DOWN) {
        e.preventDefault();
        this.moveDown();
      }
    };

    this.searchKeyword = function (index, keyword, callback) {
      var hint = hints[index];
      if (hint && hint.match.test(keyword) && hint.search) {
        var matches = hint.match.exec(keyword);
        hint.search(matches[1], callback);
      } else {
        callback();
      }
    };

    this.createGroup = function (idx, keyword) {
      var $group = $('<div class="note-hint-group note-hint-group-' + idx + '"/>');
      this.searchKeyword(idx, keyword, function (items) {
        items = items || [];
        if (items.length) {
          $group.html(self.createItemTemplates(idx, items));
          self.show();
        }
      });

      return $group;
    };

    this.handleKeyup = function (e) {
      if (list.contains([key.code.ENTER, key.code.UP, key.code.DOWN], e.keyCode)) {
        if (e.keyCode === key.code.ENTER) {
          if (this.$popover.is(':visible')) {
            return;
          }
        }
      } else {
        var wordRange = context.invoke('editor.createRange').getWordRange();
        var keyword = wordRange.toString();
        if (hints.length && keyword) {
          this.$content.empty();

          var bnd = func.rect2bnd(list.last(wordRange.getClientRects()));
          if (bnd) {

            this.$popover.hide();

            this.lastWordRange = wordRange;

            hints.forEach(function (hint, idx) {
              if (hint.match.test(keyword)) {
                self.createGroup(idx, keyword).appendTo(self.$content);
              }
            });

            // set position for popover after group is created
            if (direction === 'top') {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST
              });
            } else {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top + bnd.height + POPOVER_DIST
              });
            }

          }
        } else {
          this.hide();
        }
      }
    };

    this.show = function () {
      this.$popover.show();
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };


  $.summernote = $.extend($.summernote, {
    version: '0.8.2',
    ui: ui,
    dom: dom,

    plugins: {},

    options: {
      modules: {
        'editor': Editor,
        'clipboard': Clipboard,
        'dropzone': Dropzone,
        'codeview': Codeview,
        'statusbar': Statusbar,
        'fullscreen': Fullscreen,
        'handle': Handle,
        // FIXME: HintPopover must be front of autolink
        //  - Script error about range when Enter key is pressed on hint popover
        'hintPopover': HintPopover,
        'autoLink': AutoLink,
        'autoSync': AutoSync,
        'placeholder': Placeholder,
        'buttons': Buttons,
        'toolbar': Toolbar,
        'linkDialog': LinkDialog,
        'linkPopover': LinkPopover,
        'imageDialog': ImageDialog,
        'imagePopover': ImagePopover,
        'videoDialog': VideoDialog,
        'helpDialog': HelpDialog,
        'airPopover': AirPopover
      },

      buttons: {},

      lang: 'en-US',

      // toolbar
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']]
      ],

      // popover
      popover: {
        image: [
          ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
          ['float', ['floatLeft', 'floatRight', 'floatNone']],
          ['remove', ['removeMedia']]
        ],
        link: [
          ['link', ['linkDialogShow', 'unlink']]
        ],
        air: [
          ['color', ['color']],
          ['font', ['bold', 'underline', 'clear']],
          ['para', ['ul', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']]
        ]
      },

      // air mode: inline editor
      airMode: false,

      width: null,
      height: null,

      focus: false,
      tabSize: 4,
      styleWithSpan: true,
      shortcuts: true,
      textareaAutoSync: true,
      direction: null,

      styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

      fontNames: [
        'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
        'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
        'Tahoma', 'Times New Roman', 'Verdana'
      ],

      fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],

      // pallete colors(n x n)
      colors: [
        ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
        ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
        ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
        ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
        ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
        ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
        ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
        ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
      ],

      lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],

      tableClassName: 'table table-bordered',

      insertTableMaxSize: {
        col: 10,
        row: 10
      },

      dialogsInBody: false,
      dialogsFade: false,

      maximumImageFileSize: null,

      callbacks: {
        onInit: null,
        onFocus: null,
        onBlur: null,
        onEnter: null,
        onKeyup: null,
        onKeydown: null,
        onImageUpload: null,
        onImageUploadError: null
      },

      codemirror: {
        mode: 'text/html',
        htmlMode: true,
        lineNumbers: true
      },

      keyMap: {
        pc: {
          'ENTER': 'insertParagraph',
          'CTRL+Z': 'undo',
          'CTRL+Y': 'redo',
          'TAB': 'tab',
          'SHIFT+TAB': 'untab',
          'CTRL+B': 'bold',
          'CTRL+I': 'italic',
          'CTRL+U': 'underline',
          'CTRL+SHIFT+S': 'strikethrough',
          'CTRL+BACKSLASH': 'removeFormat',
          'CTRL+SHIFT+L': 'justifyLeft',
          'CTRL+SHIFT+E': 'justifyCenter',
          'CTRL+SHIFT+R': 'justifyRight',
          'CTRL+SHIFT+J': 'justifyFull',
          'CTRL+SHIFT+NUM7': 'insertUnorderedList',
          'CTRL+SHIFT+NUM8': 'insertOrderedList',
          'CTRL+LEFTBRACKET': 'outdent',
          'CTRL+RIGHTBRACKET': 'indent',
          'CTRL+NUM0': 'formatPara',
          'CTRL+NUM1': 'formatH1',
          'CTRL+NUM2': 'formatH2',
          'CTRL+NUM3': 'formatH3',
          'CTRL+NUM4': 'formatH4',
          'CTRL+NUM5': 'formatH5',
          'CTRL+NUM6': 'formatH6',
          'CTRL+ENTER': 'insertHorizontalRule',
          'CTRL+K': 'linkDialog.show'
        },

        mac: {
          'ENTER': 'insertParagraph',
          'CMD+Z': 'undo',
          'CMD+SHIFT+Z': 'redo',
          'TAB': 'tab',
          'SHIFT+TAB': 'untab',
          'CMD+B': 'bold',
          'CMD+I': 'italic',
          'CMD+U': 'underline',
          'CMD+SHIFT+S': 'strikethrough',
          'CMD+BACKSLASH': 'removeFormat',
          'CMD+SHIFT+L': 'justifyLeft',
          'CMD+SHIFT+E': 'justifyCenter',
          'CMD+SHIFT+R': 'justifyRight',
          'CMD+SHIFT+J': 'justifyFull',
          'CMD+SHIFT+NUM7': 'insertUnorderedList',
          'CMD+SHIFT+NUM8': 'insertOrderedList',
          'CMD+LEFTBRACKET': 'outdent',
          'CMD+RIGHTBRACKET': 'indent',
          'CMD+NUM0': 'formatPara',
          'CMD+NUM1': 'formatH1',
          'CMD+NUM2': 'formatH2',
          'CMD+NUM3': 'formatH3',
          'CMD+NUM4': 'formatH4',
          'CMD+NUM5': 'formatH5',
          'CMD+NUM6': 'formatH6',
          'CMD+ENTER': 'insertHorizontalRule',
          'CMD+K': 'linkDialog.show'
        }
      },
      icons: {
        'align': 'note-icon-align',
        'alignCenter': 'note-icon-align-center',
        'alignJustify': 'note-icon-align-justify',
        'alignLeft': 'note-icon-align-left',
        'alignRight': 'note-icon-align-right',
        'indent': 'note-icon-align-indent',
        'outdent': 'note-icon-align-outdent',
        'arrowsAlt': 'note-icon-arrows-alt',
        'bold': 'note-icon-bold',
        'caret': 'note-icon-caret',
        'circle': 'note-icon-circle',
        'close': 'note-icon-close',
        'code': 'note-icon-code',
        'eraser': 'note-icon-eraser',
        'font': 'note-icon-font',
        'frame': 'note-icon-frame',
        'italic': 'note-icon-italic',
        'link': 'note-icon-link',
        'unlink': 'note-icon-chain-broken',
        'magic': 'note-icon-magic',
        'menuCheck': 'note-icon-check',
        'minus': 'note-icon-minus',
        'orderedlist': 'note-icon-orderedlist',
        'pencil': 'note-icon-pencil',
        'picture': 'note-icon-picture',
        'question': 'note-icon-question',
        'redo': 'note-icon-redo',
        'square': 'note-icon-square',
        'strikethrough': 'note-icon-strikethrough',
        'subscript': 'note-icon-subscript',
        'superscript': 'note-icon-superscript',
        'table': 'note-icon-table',
        'textHeight': 'note-icon-text-height',
        'trash': 'note-icon-trash',
        'underline': 'note-icon-underline',
        'undo': 'note-icon-undo',
        'unorderedlist': 'note-icon-unorderedlist',
        'video': 'note-icon-video'
      }
    }
  });

}));

$(document).ready(function() {

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  // ----- Medias panel add & upload ----- //

  // input file > open
  $(".media-add").click(function() {
      var input = $(this).prev();
      input.attr("type", "file");
      input.trigger('click');
      return false;
  });


  var options = {
    //beforeSubmit:  showRequest,
    success:       showMediaResponse,
    dataType:      'json'
  };

  $('body').delegate('#image-une','change', function(){
    $('#article-image-upload').ajaxForm(options).submit();
  });

  $('body').delegate('#gallery-image','change', function(){
    $('#article-gallery-upload').ajaxForm(options).submit();
  });


  function showMediaResponse(response, statusText, xhr, $form)  {
    if(response.success == false){
      // à faire
      var arr = response.errors;
      $.each(arr, function(index, value){
        if (value.length != 0){
          $("#validation").append('<div class="alert alert-error"><strong>'+ value +'</strong><div>');
        }
      });
      $("#validation").show();
    } else {
      // à amméliorer
      if(response.type == 'mediagallery'){
        // popularise un input field si pas d'article ID (create)

        if(response.article_id == 'null'){
          var medias = [];
          // Ajoute les medias déjà ajouttés au tableau des médias
          var current_medias = $('#post-medias').val();
          if(current_medias){
            medias = medias.concat(current_medias);
          }
          // Ajoute le media courant au tableau des médias
          medias.push(response.media_id);
          $('#post-medias').val(medias);
          //$('#post-medias').append(medias);
        }
        $('#mediagallery').append('<li class="list-group-item" media-id="'+response.media_id+'" url="/admin/articles/'+response.article_id+'/reordermedia"><img src="'+response.name+'" /><span>'+response.alt+'</span><a href="/admin/articles/'+response.article_id+'/deletemedia" media-id="'+response.media_id+'" class="m-delete"><i class="fa fa-times"></i></a></li>');
      }else {
        // popularise un input field si pas d'article ID (create)
        if(response.article_id == 'null'){
          $('#post-image-une').val(JSON.stringify(response.media_id));
        }
        $('#mediaune').html('<li class="list-group-item"><img src="'+response.name+'" /><span>'+response.alt+'</span><a href="/admin/articles/'+response.article_id+'/deletemedia" media-id="'+response.media_id+'" class="m-delete" type="image-une"><i class="fa fa-times"></i></a></li>');
      }
    }
  }


  // ----- Medias panel delete ----- //

  // click sur les descendatns de media panel (dynamic)
  $('.media-panel').on('click', '.m-delete', function(e){
    e.preventDefault();

    var url       = $(this).attr('href')
    var media_id  = $(this).attr('media-id');
    var type      = $(this).attr('type');

    if (url && media_id) {
      jQuery.ajax({
        url: url,
        data: {
          'media_id' : media_id,
          'type': type,
        },
        type: 'POST',
        success: function(response){
          if(response.status == 'success'){
            if(response.type == 'image-une'){
              $('#mediaune li').detach();
            }else{
              $('#mediagallery li[media-id = '+response.media_id+']').detach();
            }
          }
        }
      });
    }
  });

  // ----- Rich text editor ----- //

  $('#rich-editor').summernote({
    //airMode: true,
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['style', 'bold', 'underline', 'clear']],
      ['para', ['ul', 'ol']],
      ['insert', ['picture','link', 'unlink']],
      ['misc', ['fullscreen','codeview','help']],
    ],
    popover: {
      image: [
        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
        ['remove', ['removeMedia']]
      ],
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        ['style', ['style', 'bold', 'underline', 'clear']],
        ['para', ['ul', 'ol']],
        ['insert', ['picture','link']],
        ['misc', ['fullscreen','help']],
      ]
    },
    callbacks: {
      onImageUpload: function(files, editor, $editable) {
        sendFileToEditor(files[0],editor,$editable);
      }
    }
  });


  // ----- Tags list select ----- //

  $('#tags_general').select2({
    placeholder : 'Sélectionnez ou ajoutez un tag',
    tags        : true,
    tokenSeparators: [",", " "],
  });


  // ----- Sortable medias elements ----- //

  if ( $('#mediagallery').length ){
    Sortable.create(mediagallery, {
      /* options */
      onUpdate: function (evt) {
        var url       = evt.item.getAttribute('url');
        var mediaId   = evt.item.getAttribute('media-id');
        var newOrder  = evt.newIndex;

        if (url && mediaId) {
          jQuery.ajax({
            url: url,
            data: {
              'mediaId' : mediaId,
              'newOrder': newOrder,
            },
            type: 'POST',
            success: function(response){
              if(response.status == 'success'){
            		$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
            	} else {
            	}
            }
          });
        }
      }
    });
  }


  // ----- Sortable indexes----- //

  if ( $('#index').length ){

    Sortable.create(index, {
      onUpdate: function (evt) {
        var url          = evt.item.getAttribute('url');
        var parent_slug  = evt.item.getAttribute('parent');
        var new_order     = evt.newIndex;
        console.log(new_order);
        if (url && parent_slug) {
          jQuery.ajax({
            url: url,
            data: {
              'parent_slug' : parent_slug,
              'new_order'   : new_order,
            },
            type: 'POST',
            success: function(response){
              if(response.status == 'success'){
                //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
              } else {
              }
            }
          });
        }
      }
    });
  }
});


// ----- Send file to the righ editor ----- //

function sendFileToEditor(file,editor,welEditable) {
  data = new FormData(); // Call jquery form
  data.append("file", file);
  jQuery.ajax({
    url: '/admin/fileupload',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(response){
      // à refaire
      if(response.status == 'error'){
        $("#validation").append('<div class="alert alert-danger"><strong>'+ response.msg +'</strong><div>');
      } else {
         jQuery('#rich-editor').summernote("insertImage", response.name);
      }
    }
  });
}

//# sourceMappingURL=scripts.js.map
