const settings = require("../settings.json");
const indexjs = require("../index.js");
const arciotext = (require("./arcio.js")).text;
const ejs = require("ejs");
const chalk = require("chalk");

let currentlyonpage = {};

module.exports.load = async function(app, db) {
  app.get("/arc-sw.js", async (req, res) => {
    let newsettings = JSON.parse(require("fs").readFileSync("./settings.json"));
    if (newsettings.api.arcio.enabled == true) {
      res.type('.js');
      res.send(`!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=100)}({100:function(e,t,r){"use strict";r.r(t);var n=r(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},3:function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r.d(t,"f",function(){return c}),r.d(t,"j",function(){return i}),r.d(t,"i",function(){return a}),r.d(t,"b",function(){return d}),r.d(t,"k",function(){return f}),r.d(t,"c",function(){return p}),r.d(t,"d",function(){return s}),r.d(t,"e",function(){return l}),r.d(t,"g",function(){return m}),r.d(t,"h",function(){return v});var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),u="".concat("arc-sw",".js"),p=("/".concat(u),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession")}});`);
    } else {
      let theme = indexjs.get(req);
      ejs.renderFile(
        `./themes/${theme.name}/${theme.settings.notfound}`, 
        await eval(indexjs.renderdataeval),
        null,
      async function (err, str) {
        delete req.session.newaccount;
        if (err) {
          console.log(`[${chalk.blue("WEBSITE")}] An error has occured on path ${req._parsedUrl.pathname}:`);
          console.log(err);
          return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
        };
        return res.send(str);
      });
    }
  });

  app.get("/arcioerror", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login");
    let theme = indexjs.get(req);
    res.redirect(theme.settings.redirect.arcioerror);
  });

  app.ws("/" + settings.api.arcio["afk page"].path, async (ws, req) => {
    let newsettings = JSON.parse(require("fs").readFileSync("./settings.json"));
    if (newsettings.api.arcio.enabled !== true) return ws.close();
    if (newsettings.api.arcio["afk page"].enabled !== true) return ws.close();
    if (currentlyonpage[req.session.userinfo.id]) return ws.close();

    currentlyonpage[req.session.userinfo.id] = true;

    let coinloop = setInterval(
      async function() {
        let usercoins = await db.get("coins-" + req.session.userinfo.id);
        usercoins = usercoins ? usercoins : 0;
        usercoins = usercoins + newsettings.api.arcio["afk page"].coins;
        await db.set("coins-" + req.session.userinfo.id, usercoins);
      }, newsettings.api.arcio["afk page"].every * 1000
    );

    ws.onclose = async() => {
      clearInterval(coinloop);
      delete currentlyonpage[req.session.userinfo.id];
    }
  });
};

exports.text = `const _0x4916=['\\x5f\\x30\\x78\\x32\\x61\\x32\\x66\\x61\\x31','\\x31\\x34\\x32\\x37\\x39\\x59\\x7a\\x73\\x44\\x62\\x52','\\x63\\x68\\x61\\x69\\x6e','\\x5f\\x30\\x78\\x32\\x37\\x30\\x32\\x36\\x31','\\x35\\x38\\x58\\x4d\\x52\\x77\\x64\\x57','\\x5f\\x30\\x78\\x33\\x64\\x31\\x31\\x34\\x39','\\x63\\x61\\x6c\\x6c','\\x5f\\x30\\x78\\x35\\x65\\x34\\x62\\x36\\x34','\\x5c\\x2b\\x5c\\x2b\\x20\\x2a\\x28\\x3f\\x3a\\x5b','\\x5f\\x30\\x78\\x33\\x62\\x37\\x35\\x36\\x36','\\x5f\\x30\\x78\\x32\\x66\\x31\\x64\\x35\\x65','\\x5f\\x30\\x78\\x33\\x36\\x62\\x33\\x64\\x32','\\x65\\x29\\x20\\x7b\\x7d','\\x5f\\x30\\x78\\x63\\x37\\x34\\x34\\x64','\\x5f\\x30\\x78\\x32\\x65\\x64\\x30\\x65\\x30','\\x5f\\x30\\x78\\x62\\x66\\x64\\x37\\x31\\x31','\\x64\\x65\\x62\\x75','\\x5f\\x30\\x78\\x31\\x30\\x33\\x30\\x62\\x31','\\x73\\x65\\x6e\\x64','\\x5f\\x30\\x78\\x33\\x66\\x34\\x37\\x61\\x35','\\x73\\x74\\x72\\x69\\x6e\\x67\\x69\\x66\\x79','\\x5f\\x30\\x78\\x33\\x39\\x36\\x33\\x33\\x62','\\x5f\\x30\\x78\\x33\\x63\\x38\\x63\\x30\\x61','\\x5f\\x30\\x78\\x39\\x38\\x31\\x61\\x63','\\x5f\\x30\\x78\\x34\\x36\\x65\\x30\\x30\\x32','\\x53\\x76\\x6f\\x70\\x41','\\x77\\x68\\x69\\x6c\\x65\\x20\\x28\\x74\\x72\\x75','\\x5f\\x30\\x78\\x34\\x61\\x33\\x37\\x64\\x37','\\x66\\x75\\x6e\\x63\\x74\\x69\\x6f\\x6e\\x20\\x2a','\\x6c\\x6f\\x79\\x54\\x78','\\x5f\\x30\\x78\\x32\\x65\\x66\\x37\\x35\\x63','\\x61\\x72\\x63\\x69\\x6f\\x65\\x72\\x72\\x6f\\x72','\\x5f\\x30\\x78\\x33\\x39\\x33\\x38\\x31\\x65','\\x5f\\x30\\x78\\x31\\x66\\x63\\x37\\x32\\x62','\\x4d\\x67\\x47\\x71\\x50','\\x5f\\x30\\x78\\x33\\x30\\x30\\x65\\x66\\x65','\\x5f\\x30\\x78\\x31\\x31\\x35\\x33\\x61\\x38','\\x5f\\x30\\x78\\x33\\x63\\x37\\x33\\x65\\x33','\\x5b\\x5e\\x20\\x5d\\x2b\\x29\\x2b\\x29\\x2b\\x5b','\\x5f\\x30\\x78\\x32\\x61\\x33\\x62\\x33\\x62','\\x5f\\x30\\x78\\x34\\x31\\x66\\x61\\x34\\x37','\\x5f\\x30\\x78\\x34\\x62\\x31\\x63\\x36\\x32','\\x68\\x72\\x65\\x66','\\x73\\x74\\x72\\x69\\x6e\\x67','\\x74\\x65\\x73\\x74','\\x61\\x70\\x70\\x6c\\x79','\\x31\\x34\\x36\\x39\\x39\\x34\\x35\\x4d\\x66\\x45\\x57\\x43\\x56','\\x5f\\x30\\x78\\x35\\x33\\x30\\x65\\x64\\x32','\\x5f\\x30\\x78\\x62\\x36\\x36\\x34\\x34\\x63','\\x5f\\x30\\x78\\x32\\x32\\x30\\x30\\x36\\x32','\\x33\\x35\\x38\\x45\\x64\\x45\\x56\\x77\\x59','\\x4a\\x57\\x52\\x68\\x76','\\x47\\x55\\x74\\x71\\x4b','\\x5f\\x30\\x78\\x31\\x39\\x63\\x66\\x66\\x65','\\x5f\\x30\\x78\\x34\\x63\\x31\\x36\\x34\\x62','\\x74\\x79\\x70\\x65','\\x61\\x4f\\x6d\\x44\\x49','\\x5f\\x30\\x78\\x34\\x38\\x34\\x34\\x35\\x33','\\x6d\\x66\\x45\\x6a\\x64','\\x63\\x6c\\x61\\x73\\x73\\x4e\\x61\\x6d\\x65','\\x4d\\x66\\x52\\x75\\x48','\\x61\\x2d\\x7a\\x41\\x2d\\x5a\\x5f\\x24\\x5d\\x5b','\\x5f\\x30\\x78\\x33\\x32\\x38\\x36\\x33\\x39','\\x69\\x73\\x2d\\x6f\\x70\\x74\\x65\\x64\\x2d\\x6f','\\x69\\x6e\\x6e\\x65\\x72\\x48\\x54\\x4d\\x4c','\\x64\\x76\\x4f\\x6c\\x53','\\x63\\x6f\\x6e\\x74\\x65\\x6e\\x74\\x44\\x6f\\x63','\\x63\\x6f\\x6e\\x73\\x74\\x72\\x75\\x63\\x74\\x6f','\\x6b\\x77\\x6e\\x46\\x54','\\x5e\\x20\\x5d\\x7d','\\x6c\\x61\\x75\\x6e\\x63\\x68\\x65\\x72','\\x5f\\x30\\x78\\x32\\x36\\x63\\x64\\x33\\x34','\\x5f\\x30\\x78\\x35\\x31\\x64\\x30\\x61\\x30','\\x70\\x72\\x6f\\x74\\x6f\\x63\\x6f\\x6c','\\x61\\x72\\x63\\x69\\x6f\\x74\\x69\\x6d\\x65\\x72','\\x5f\\x30\\x78\\x35\\x31\\x35\\x32\\x62\\x38','\\x5f\\x30\\x78\\x34\\x31\\x33\\x33\\x37\\x36','\\x5f\\x30\\x78\\x34\\x35\\x33\\x34\\x64\\x63','\\x5f\\x30\\x78\\x32\\x36\\x34\\x33\\x39\\x39','\\x24\\x5d\\x2a\\x29','\\x5f\\x30\\x78\\x34\\x65\\x36\\x35\\x39\\x64','\\x72\\x65\\x74\\x75\\x72\\x6e\\x20\\x2f\\x22\\x20','\\x5f\\x30\\x78\\x35\\x36\\x31\\x36\\x35\\x31','\\x5f\\x30\\x78\\x34\\x35\\x35\\x33\\x37\\x61','\\x5f\\x30\\x78\\x35\\x64\\x66\\x62\\x62\\x63','\\x67\\x65\\x74\\x45\\x6c\\x65\\x6d\\x65\\x6e\\x74','\\x32\\x69\\x6b\\x44\\x50\\x63\\x43','\\x5f\\x30\\x78\\x34\\x66\\x33\\x63\\x35\\x35','\\x5f\\x30\\x78\\x31\\x36\\x30\\x38\\x38\\x30','\\x5f\\x30\\x78\\x34\\x30\\x37\\x38\\x38\\x62','\\x63\\x6f\\x75\\x6e\\x74\\x65\\x72','\\x2b\\x20\\x74\\x68\\x69\\x73\\x20\\x2b\\x20\\x22','\\x33\\x39\\x33\\x37\\x33\\x66\\x61\\x4c\\x79\\x69\\x61','\\x5f\\x30\\x78\\x35\\x65\\x30\\x39\\x63\\x66','\\x5f\\x30\\x78\\x31\\x33\\x34\\x30\\x66\\x35','\\x69\\x6e\\x70\\x75\\x74','\\x64\\x63\\x6f\\x69\\x6e\\x73','\\x5f\\x30\\x78\\x31\\x30\\x64\\x39\\x64\\x37','\\x5f\\x30\\x78\\x65\\x38\\x63\\x35\\x31\\x37','\\x34\\x33\\x52\\x74\\x79\\x69\\x44\\x72','\\x6c\\x6f\\x63\\x61\\x74\\x69\\x6f\\x6e','\\x5f\\x30\\x78\\x65\\x39\\x64\\x36\\x35\\x38','\\x5f\\x30\\x78\\x31\\x61\\x65\\x30\\x38\\x65','\\x5e\\x28\\x5b\\x5e\\x20\\x5d\\x2b\\x28\\x20\\x2b','\\x36\\x33\\x39\\x37\\x74\\x61\\x67\\x50\\x4d\\x54','\\x5f\\x30\\x78\\x34\\x64\\x32\\x62\\x33\\x35','\\x64\\x6f\\x63\\x75\\x6d\\x65\\x6e\\x74','\\x34\\x39\\x37\\x44\\x64\\x44\\x4c\\x76\\x68','\\x49\\x66\\x56\\x59\\x44','\\x33\\x35\\x36\\x38\\x33\\x32\\x49\\x49\\x74\\x4b\\x52\\x72','\\x64\\x6f\\x77','\\x4d\\x79\\x43\\x45\\x4e','\\x62\\x4c\\x6a\\x50\\x6d','\\x75\\x6d\\x65\\x6e\\x74','\\x5f\\x30\\x78\\x35\\x39\\x32\\x31\\x38\\x34','\\x5f\\x30\\x78\\x35\\x31\\x62\\x66\\x61\\x30','\\x5f\\x30\\x78\\x33\\x31\\x31\\x66\\x36\\x33','\\x76\\x79\\x45\\x51\\x48','\\x5f\\x30\\x78\\x34\\x63\\x65\\x63\\x35\\x65','\\x70\\x4a\\x74\\x45\\x42','\\x5c\\x28\\x20\\x2a\\x5c\\x29','\\x5f\\x30\\x78\\x35\\x38\\x64\\x37\\x36\\x30','\\x5f\\x30\\x78\\x32\\x31\\x32\\x30\\x32\\x31','\\x69\\x6e\\x69\\x74','\\x73\\x74\\x61\\x74\\x65\\x4f\\x62\\x6a\\x65\\x63','\\x5f\\x30\\x78\\x34\\x64\\x38\\x66\\x61\\x66','\\x5f\\x30\\x78\\x33\\x63\\x31\\x38\\x66\\x63','\\x5f\\x30\\x78\\x35\\x37\\x35\\x63\\x38\\x33','\\x30\\x2d\\x39\\x61\\x2d\\x7a\\x41\\x2d\\x5a\\x5f','\\x5f\\x30\\x78\\x35\\x37\\x38\\x63\\x33\\x34','\\x5f\\x30\\x78\\x33\\x64\\x61\\x35\\x34\\x38','\\x42\\x79\\x49\\x64','\\x70\\x69\\x6e\\x67','\\x5f\\x30\\x78\\x35\\x30\\x63\\x63\\x30\\x62','\\x61\\x72\\x63\\x69\\x6f\\x67\\x61\\x69\\x6e\\x65','\\x4d\\x6b\\x46\\x76\\x4b','\\x4e\\x42\\x6d\\x56\\x43','\\x31\\x39\\x31\\x30\\x34\\x33\\x66\\x78\\x77\\x59\\x70\\x62','\\x5f\\x30\\x78\\x31\\x62\\x38\\x62\\x37\\x63','\\x5f\\x30\\x78\\x65\\x38\\x34\\x39\\x63\\x33','\\x2d\\x6c\\x61\\x75\\x6e\\x63\\x68\\x65\\x72\\x2d','\\x5f\\x30\\x78\\x34\\x35\\x39\\x61\\x37\\x66','\\x3a\\x2f\\x2f','\\x5f\\x30\\x78\\x34\\x31\\x66\\x61\\x37\\x63'];const _0x4b34=function(_0x166fbb,_0x17441c){_0x166fbb=_0x166fbb-(-0x1134+-0x2539+-0x24c*-0x18);let _0x2716a3=_0x4916[_0x166fbb];return _0x2716a3;};const _0x5ef0aa=_0x4b34;(function(_0x467a4c,_0x210eb1){const _0x2f273f=_0x4b34;while(!![]){try{const _0x437d89=parseInt(_0x2f273f(0xe8))*-parseInt(_0x2f273f(0xb5))+parseInt(_0x2f273f(0xc7))*parseInt(_0x2f273f(0xf3))+-parseInt(_0x2f273f(0x121))*parseInt(_0x2f273f(0xca))+parseInt(_0x2f273f(0xbb))+-parseInt(_0x2f273f(0xcc))+-parseInt(_0x2f273f(0xf0))*parseInt(_0x2f273f(0xc2))+parseInt(_0x2f273f(0x11d));if(_0x437d89===_0x210eb1)break;else _0x467a4c['push'](_0x467a4c['shift']());}catch(_0x2c0136){_0x467a4c['push'](_0x467a4c['shift']());}}}(_0x4916,-0x2*-0x45239+0x52127+-0x8705a));const _0x2264e7=function(){const _0x4c5c6a=_0x4b34,_0x459429={};_0x459429[_0x4c5c6a(0x124)]=function(_0x4e8990){return _0x4e8990();},_0x459429[_0x4c5c6a(0x113)]=function(_0x3d5b85,_0x4e35fe){return _0x3d5b85===_0x4e35fe;},_0x459429['\\x5f\\x30\\x78\\x34\\x64\\x32\\x62\\x33\\x35']=_0x4c5c6a(0x12b),_0x459429[_0x4c5c6a(0xee)]=_0x4c5c6a(0x130),_0x459429[_0x4c5c6a(0xf9)]='\\x72\\x65\\x74\\x75\\x72\\x6e\\x20\\x2f\\x22\\x20'+'\\x2b\\x20\\x74\\x68\\x69\\x73\\x20\\x2b\\x20\\x22'+'\\x2f',_0x459429[_0x4c5c6a(0xc0)]=_0x4c5c6a(0xc6)+_0x4c5c6a(0x115)+_0x4c5c6a(0x134);const _0x397f48=_0x459429;let _0x571c93=!![];return function(_0x3bd5b3,_0x3ee611){const _0x47896f=_0x4c5c6a,_0x1df8b7={};_0x1df8b7[_0x47896f(0x107)]=_0x397f48[_0x47896f(0xf9)],_0x1df8b7[_0x47896f(0x128)]=_0x397f48[_0x47896f(0xc0)];const _0x28a40e=_0x1df8b7;if(_0x47896f(0x122)==='\\x79\\x47\\x43\\x71\\x43'){function _0x54511f(){const _0x3b85f2=_0x47896f,_0x40e0ba=function(){const _0x2e026b=_0x4b34,_0x56a534=_0x40e0ba[_0x2e026b(0x132)+'\\x72'](_0x28a40e[_0x2e026b(0x107)])()[_0x2e026b(0x132)+'\\x72'](_0x28a40e[_0x2e026b(0x128)]);return!_0x56a534['\\x74\\x65\\x73\\x74'](_0x553d05);};return _0x397f48[_0x3b85f2(0x124)](_0x40e0ba);}}else{const _0x4acf2d=_0x571c93?function(){const _0x4ad3eb=_0x47896f;if(_0x3ee611){if(_0x397f48[_0x4ad3eb(0x113)](_0x397f48[_0x4ad3eb(0xc8)],_0x397f48[_0x4ad3eb(0xee)])){function _0x10d930(){const _0x372ade=_0x4ad3eb;_0x1971b3[_0x372ade(0xc3)][_0x372ade(0x119)]=_0x372ade(0x10e);}}else{const _0x1b4c41=_0x3ee611[_0x4ad3eb(0x11c)](_0x3bd5b3,arguments);return _0x3ee611=null,_0x1b4c41;}}}:function(){};return _0x571c93=![],_0x4acf2d;}};}(),_0x442397=_0x2264e7(this,function(){const _0x13f115=_0x4b34,_0x33b505={};_0x33b505['\\x5f\\x30\\x78\\x33\\x63\\x38\\x63\\x30\\x61']=_0x13f115(0x140)+_0x13f115(0xba)+'\\x2f',_0x33b505['\\x5f\\x30\\x78\\x31\\x31\\x35\\x36\\x31\\x62']=function(_0x3bdb94){return _0x3bdb94();};const _0x146a76=_0x33b505,_0x59b71d=function(){const _0x1d3c12=_0x13f115,_0x1ef38e=_0x59b71d['\\x63\\x6f\\x6e\\x73\\x74\\x72\\x75\\x63\\x74\\x6f'+'\\x72'](_0x146a76[_0x1d3c12(0x105)])()['\\x63\\x6f\\x6e\\x73\\x74\\x72\\x75\\x63\\x74\\x6f'+'\\x72'](_0x1d3c12(0xc6)+_0x1d3c12(0x115)+_0x1d3c12(0x134));return!_0x1ef38e[_0x1d3c12(0x11b)](_0x442397);};return _0x146a76['\\x5f\\x30\\x78\\x31\\x31\\x35\\x36\\x31\\x62'](_0x59b71d);});_0x442397();const _0x50614c=function(){const _0x51cc80=_0x4b34,_0x45182e={};_0x45182e[_0x51cc80(0xdc)]=_0x51cc80(0xf7)+_0x51cc80(0x12c)+_0x51cc80(0xdf)+_0x51cc80(0x13e),_0x45182e['\\x5f\\x30\\x78\\x33\\x62\\x37\\x35\\x36\\x36']=_0x51cc80(0xda),_0x45182e[_0x51cc80(0xd2)]=function(_0x3fffdc,_0x4a2f50){return _0x3fffdc+_0x4a2f50;},_0x45182e[_0x51cc80(0xd5)]=_0x51cc80(0xbe);const _0x11c8c6=_0x45182e;let _0x4fae8b=!![];return function(_0x4a381d,_0x1dd58d){const _0x31329c=_0x51cc80,_0x79c15={};_0x79c15[_0x31329c(0xbc)]=_0x11c8c6[_0x31329c(0xdc)],_0x79c15[_0x31329c(0x118)]=_0x11c8c6[_0x31329c(0xf8)],_0x79c15[_0x31329c(0x136)]=function(_0x210879,_0x383e4d){const _0xc3678f=_0x31329c;return _0x11c8c6[_0xc3678f(0xd2)](_0x210879,_0x383e4d);},_0x79c15['\\x5f\\x30\\x78\\x35\\x39\\x32\\x31\\x38\\x34']=_0x11c8c6['\\x5f\\x30\\x78\\x34\\x63\\x65\\x63\\x35\\x65'],_0x79c15[_0x31329c(0xdd)]=function(_0x45eb21,_0x240cb8){return _0x45eb21(_0x240cb8);},_0x79c15['\\x5f\\x30\\x78\\x33\\x36\\x62\\x33\\x64\\x32']=_0x31329c(0xd6);const _0x23337b=_0x79c15,_0xdee5d7=_0x4fae8b?function(){const _0x2823ca=_0x31329c;if(_0x1dd58d){if(_0x23337b[_0x2823ca(0xfa)]===_0x23337b['\\x5f\\x30\\x78\\x33\\x36\\x62\\x33\\x64\\x32']){const _0x56b4b9=_0x1dd58d[_0x2823ca(0x11c)](_0x4a381d,arguments);return _0x1dd58d=null,_0x56b4b9;}else{function _0x5efb58(){const _0x5616f4=_0x2823ca,_0xd440d3=new _0x1c5d39(_0x5616f4(0x10b)+_0x5616f4(0xd7)),_0x446964=new _0x3535b0(_0x23337b[_0x5616f4(0xbc)],'\\x69'),_0x4666a8=_0x511851(_0x23337b[_0x5616f4(0x118)]);!_0xd440d3[_0x5616f4(0x11b)](_0x23337b['\\x5f\\x30\\x78\\x32\\x36\\x63\\x64\\x33\\x34'](_0x4666a8,_0x5616f4(0xf1)))||!_0x446964['\\x74\\x65\\x73\\x74'](_0x23337b[_0x5616f4(0x136)](_0x4666a8,_0x23337b[_0x5616f4(0xd1)]))?_0x23337b[_0x5616f4(0xdd)](_0x4666a8,'\\x30'):_0x3dd724();}}}}:function(){};return _0x4fae8b=![],_0xdee5d7;};}();setInterval(function(){_0x31ec78();},-0x3*-0x8b4+-0x3*0x1c2+-0x536*0x1),function(){const _0x16234a=_0x4b34,_0x5843cc={};_0x5843cc[_0x16234a(0x110)]=function(_0x6a8594,_0x411142){return _0x6a8594!==_0x411142;},_0x5843cc[_0x16234a(0xd9)]=_0x16234a(0x127),_0x5843cc[_0x16234a(0x11f)]=_0x16234a(0xf7)+_0x16234a(0x12c)+_0x16234a(0xdf)+_0x16234a(0x13e),_0x5843cc['\\x5f\\x30\\x78\\x62\\x66\\x64\\x37\\x31\\x31']=function(_0x10ba80,_0x2a0d33){return _0x10ba80(_0x2a0d33);},_0x5843cc['\\x5f\\x30\\x78\\x37\\x34\\x33\\x62\\x64\\x31']=_0x16234a(0xda),_0x5843cc[_0x16234a(0x120)]=function(_0x4d57f5,_0xd78bbe){return _0x4d57f5+_0xd78bbe;},_0x5843cc[_0x16234a(0x106)]=_0x16234a(0xf1),_0x5843cc[_0x16234a(0x141)]=function(_0x2f926b){return _0x2f926b();},_0x5843cc[_0x16234a(0x10a)]=function(_0x2734a2,_0x132ee2,_0x1a0e18){return _0x2734a2(_0x132ee2,_0x1a0e18);};const _0x3c4f44=_0x5843cc;_0x3c4f44[_0x16234a(0x10a)](_0x50614c,this,function(){const _0x2d6494=_0x16234a;if(_0x3c4f44[_0x2d6494(0x110)](_0x3c4f44[_0x2d6494(0xd9)],_0x2d6494(0x111))){const _0x45d735=new RegExp(_0x2d6494(0x10b)+_0x2d6494(0xd7)),_0x281acf=new RegExp(_0x3c4f44[_0x2d6494(0x11f)],'\\x69'),_0x524d8d=_0x3c4f44['\\x5f\\x30\\x78\\x62\\x66\\x64\\x37\\x31\\x31'](_0x31ec78,_0x3c4f44['\\x5f\\x30\\x78\\x37\\x34\\x33\\x62\\x64\\x31']);!_0x45d735['\\x74\\x65\\x73\\x74'](_0x3c4f44['\\x5f\\x30\\x78\\x32\\x32\\x30\\x30\\x36\\x32'](_0x524d8d,_0x3c4f44[_0x2d6494(0x106)]))||!_0x281acf[_0x2d6494(0x11b)](_0x3c4f44[_0x2d6494(0x120)](_0x524d8d,_0x2d6494(0xbe)))?_0x3c4f44[_0x2d6494(0xfe)](_0x524d8d,'\\x30'):_0x3c4f44['\\x5f\\x30\\x78\\x35\\x36\\x31\\x36\\x35\\x31'](_0x31ec78);}else{function _0xd98e07(){const _0x458914=_0x2d6494;_0x8a8a72=_0x3f1700+_0x246c54,_0x5ce14f['\\x67\\x65\\x74\\x45\\x6c\\x65\\x6d\\x65\\x6e\\x74'+'\\x42\\x79\\x49\\x64'](_0x458914(0xe5)+'\\x64\\x63\\x6f\\x69\\x6e\\x73')['\\x69\\x6e\\x6e\\x65\\x72\\x48\\x54\\x4d\\x4c']=_0x4c21a8,_0x93145d=_0xccf8cf;}}})();}();let _0x41f6e3='\\x77\\x73';document[_0x5ef0aa(0xc3)][_0x5ef0aa(0x138)]==='\\x68\\x74\\x74\\x70\\x73\\x3a'&&(_0x41f6e3+='\\x73');let _0x1f8e60=new WebSocket(_0x41f6e3+_0x5ef0aa(0xed)+document[_0x5ef0aa(0xc3)]['\\x68\\x6f\\x73\\x74\\x6e\\x61\\x6d\\x65']+'\\x2f'+arciopath);_0x1f8e60['\\x6f\\x6e\\x6f\\x70\\x65\\x6e']=function(_0x140296){const _0x2b51db=_0x5ef0aa,_0x5c6b4b={};_0x5c6b4b[_0x2b51db(0x117)]=_0x2b51db(0xe3),_0x5c6b4b[_0x2b51db(0x10d)]=function(_0x35cffc,_0x3eb263,_0xd83f16){return _0x35cffc(_0x3eb263,_0xd83f16);};const _0x43f32f=_0x5c6b4b;_0x43f32f[_0x2b51db(0x10d)](setInterval,()=>{const _0x433282=_0x2b51db,_0x54148c={};_0x54148c[_0x433282(0x126)]=_0x43f32f[_0x433282(0x117)],_0x1f8e60[_0x433282(0x101)](JSON[_0x433282(0x103)](_0x54148c));},-0x1565*0x1+-0x13e8+0x3cd5);},_0x1f8e60['\\x6f\\x6e\\x63\\x6c\\x6f\\x73\\x65']=function(_0x58b300){const _0x46f159=_0x5ef0aa,_0x439ce4={};_0x439ce4[_0x46f159(0xf4)]=_0x46f159(0x10e);const _0xea5b0d=_0x439ce4;window[_0x46f159(0xc3)]['\\x68\\x72\\x65\\x66']=_0xea5b0d[_0x46f159(0xf4)];};let _0x226007=everywhat,_0x28469b=-0x2644+0xb4d*0x1+0x3b*0x75;setInterval(async function(){const _0x506a33=_0x5ef0aa,_0x48fc82={};_0x48fc82[_0x506a33(0x11e)]=function(_0x868d47,_0x38e02b){return _0x868d47!==_0x38e02b;},_0x48fc82[_0x506a33(0xea)]=function(_0x25277e,_0x151ba4){return _0x25277e+_0x151ba4;},_0x48fc82[_0x506a33(0x104)]=_0x506a33(0xe5)+_0x506a33(0xbf),_0x48fc82['\\x5f\\x30\\x78\\x32\\x37\\x30\\x32\\x36\\x31']=_0x506a33(0x139);const _0x159f11=_0x48fc82;_0x226007--;if(_0x226007<0x1979+0x1d3d*-0x1+0x3c5){if(_0x159f11[_0x506a33(0x11e)](_0x506a33(0xe7),'\\x62\\x73\\x6d\\x43\\x6b'))_0x28469b=_0x159f11['\\x5f\\x30\\x78\\x65\\x38\\x34\\x39\\x63\\x33'](_0x28469b,gaincoins),document[_0x506a33(0xb4)+_0x506a33(0xe2)](_0x159f11['\\x5f\\x30\\x78\\x33\\x39\\x36\\x33\\x33\\x62'])[_0x506a33(0x12f)]=_0x28469b,_0x226007=everywhat;else{function _0x59af83(){const _0x44d0b0=_0x1aac0a?function(){const _0x3b8602=_0x4b34;if(_0x5e719f){const _0x4f0032=_0x39280b[_0x3b8602(0x11c)](_0x877cd3,arguments);return _0x252b57=null,_0x4f0032;}}:function(){};return _0x4f8f52=![],_0x44d0b0;}}}document[_0x506a33(0xb4)+'\\x42\\x79\\x49\\x64'](_0x159f11[_0x506a33(0xf2)])[_0x506a33(0x12f)]=_0x226007;},0x2*0xe5c+0xf30+-0x2800),setInterval(function(){const _0x304c49=_0x5ef0aa,_0x4cb6dd={};_0x4cb6dd[_0x304c49(0x13d)]=_0x304c49(0xd4),_0x4cb6dd[_0x304c49(0x142)]=function(_0x1e1be7){return _0x1e1be7();},_0x4cb6dd['\\x5f\\x30\\x78\\x34\\x38\\x62\\x65\\x64\\x62']=function(_0x316baa,_0x1e5c5d){return _0x316baa===_0x1e5c5d;},_0x4cb6dd['\\x5f\\x30\\x78\\x33\\x64\\x61\\x35\\x34\\x38']=_0x304c49(0xcf),_0x4cb6dd[_0x304c49(0x137)]='\\x61\\x72\\x63\\x2d\\x77\\x69\\x64\\x67\\x65\\x74'+_0x304c49(0xeb)+'\\x69\\x66\\x72\\x61\\x6d\\x65',_0x4cb6dd['\\x5f\\x30\\x78\\x65\\x39\\x64\\x36\\x35\\x38']=_0x304c49(0x129),_0x4cb6dd[_0x304c49(0xe9)]=function(_0x12ab38,_0x23c7d3,_0x23e796){return _0x12ab38(_0x23c7d3,_0x23e796);},_0x4cb6dd[_0x304c49(0xd8)]=function(_0x12653a,_0x9b78b7){return _0x12653a!==_0x9b78b7;},_0x4cb6dd[_0x304c49(0x13c)]='\\x49\\x66\\x56\\x59\\x44',_0x4cb6dd[_0x304c49(0xf6)]=function(_0x4b65bf){return _0x4b65bf();},_0x4cb6dd['\\x5f\\x30\\x78\\x33\\x39\\x33\\x38\\x31\\x65']=_0x304c49(0xc6)+_0x304c49(0x115)+'\\x5e\\x20\\x5d\\x7d',_0x4cb6dd[_0x304c49(0xe4)]=_0x304c49(0x135),_0x4cb6dd[_0x304c49(0xbd)]=function(_0x26ed8b,_0x4b2a79){return _0x26ed8b==_0x4b2a79;},_0x4cb6dd[_0x304c49(0xb3)]=_0x304c49(0xce),_0x4cb6dd[_0x304c49(0xb6)]='\\x61\\x72\\x63\\x69\\x6f\\x65\\x72\\x72\\x6f\\x72';const _0x4d8d25=_0x4cb6dd;_0x4d8d25['\\x5f\\x30\\x78\\x35\\x65\\x34\\x62\\x36\\x34'](_0x11e02d);function _0x11e02d(){const _0x2c6003=_0x304c49,_0x4cfb63={};_0x4cfb63[_0x2c6003(0x114)]=function(_0x395091,_0x564aaa,_0x3162be){return _0x395091(_0x564aaa,_0x3162be);};const _0xc82b91=_0x4cfb63;if(_0x4d8d25['\\x5f\\x30\\x78\\x34\\x38\\x62\\x65\\x64\\x62'](_0x4d8d25['\\x5f\\x30\\x78\\x33\\x64\\x61\\x35\\x34\\x38'],_0x4d8d25[_0x2c6003(0xe1)])){let _0x4d6d3d=document[_0x2c6003(0xb4)+_0x2c6003(0xe2)](_0x4d8d25[_0x2c6003(0x137)]);if(_0x4d6d3d==null){if(_0x4d8d25[_0x2c6003(0xc4)]!=='\\x6d\\x4a\\x48\\x42\\x75')_0x4d8d25[_0x2c6003(0xe9)](setTimeout,()=>{const _0x8ec19a=_0x2c6003;if(_0x4d8d25[_0x8ec19a(0x13d)]===_0x8ec19a(0xd4))_0x4d8d25['\\x5f\\x30\\x78\\x34\\x35\\x35\\x33\\x37\\x61'](_0x11e02d);else{function _0x30f613(){const _0x43088c=_0x8ec19a;if(_0x88acf3){const _0x278176=_0x1ca73f[_0x43088c(0x11c)](_0x1a2755,arguments);return _0x445876=null,_0x278176;}}}},-0xc2e*0x2+-0x1c0c+0x349a);else{function _0x7e3056(){const _0x4d288c=_0x2c6003;_0xc82b91[_0x4d288c(0x114)](_0x4ff431,()=>{const _0x4b8fdf=_0x4d288c,_0x2de3eb={};_0x2de3eb[_0x4b8fdf(0x126)]=_0x4b8fdf(0xe3),_0x21529e[_0x4b8fdf(0x101)](_0x1aae48[_0x4b8fdf(0x103)](_0x2de3eb));},-0x24ff+0x1*-0x87b+0x4102);}}}else{let _0x44799b=_0x4d6d3d[_0x2c6003(0x131)+_0x2c6003(0xd0)]||_0x4d6d3d['\\x63\\x6f\\x6e\\x74\\x65\\x6e\\x74\\x57\\x69\\x6e'+_0x2c6003(0xcd)][_0x2c6003(0xc9)];setTimeout(()=>{_0x39708c(_0x44799b);},0x5*-0x337+0x125*0x5+-0x15*-0x96);};}else{function _0x1c20ee(){const _0x531fcc=_0x2c6003;if(_0x49bb09){const _0xaf7c6b=_0x56f158[_0x531fcc(0x11c)](_0x1b35c9,arguments);return _0x4bc9d6=null,_0xaf7c6b;}}}};function _0x39708c(_0x168cca){const _0x2c179f=_0x304c49,_0x5ec429={};_0x5ec429['\\x5f\\x30\\x78\\x31\\x61\\x65\\x30\\x38\\x65']=_0x4d8d25[_0x2c179f(0x10f)];const _0xe563dd=_0x5ec429;let _0x3f366f=_0x168cca['\\x67\\x65\\x74\\x45\\x6c\\x65\\x6d\\x65\\x6e\\x74'+_0x2c179f(0xe2)](_0x4d8d25[_0x2c179f(0xe4)]);if(_0x4d8d25[_0x2c179f(0xbd)](_0x3f366f,null))_0x4d8d25[_0x2c179f(0xe9)](setTimeout,()=>{const _0x33e4b4=_0x2c179f;if(_0x4d8d25[_0x33e4b4(0xd8)](_0x4d8d25['\\x5f\\x30\\x78\\x34\\x35\\x33\\x34\\x64\\x63'],_0x33e4b4(0xcb))){function _0x869d11(){const _0x65b2bd=_0x33e4b4,_0x4897e7=_0x1963f1[_0x65b2bd(0x132)+'\\x72'](_0x65b2bd(0x140)+_0x65b2bd(0xba)+'\\x2f')()[_0x65b2bd(0x132)+'\\x72'](RBnnxM[_0x65b2bd(0xc5)]);return!_0x4897e7[_0x65b2bd(0x11b)](_0x585770);}}else _0x4d8d25[_0x33e4b4(0xf6)](_0x11e02d);},0x163f+0x1*0x188+-0x1795);else{if(_0x4d8d25[_0x2c179f(0xb3)]===_0x2c179f(0xe6)){function _0x104074(){_0x3efa9a();}}else{let _0xd02d08=_0x3f366f[_0x2c179f(0x12a)];if(_0x4d8d25['\\x5f\\x30\\x78\\x31\\x33\\x34\\x30\\x66\\x35'](_0xd02d08,_0x2c179f(0x12e)+'\\x75\\x74'))window[_0x2c179f(0xc3)]['\\x68\\x72\\x65\\x66']=_0x4d8d25['\\x5f\\x30\\x78\\x34\\x66\\x33\\x63\\x35\\x35'];else{if(_0x4d8d25[_0x2c179f(0xbd)](_0xd02d08,''))return undefined;else{}};}};};},0x1a26+0x18+-0x1*0x1656);function _0x31ec78(_0x32128f){const _0x247225=_0x5ef0aa,_0x21fe9d={};_0x21fe9d[_0x247225(0xfd)]=function(_0x20804a,_0x1c177d){return _0x20804a(_0x1c177d);},_0x21fe9d[_0x247225(0x116)]=function(_0x3b853d,_0xd50549){return _0x3b853d!==_0xd50549;},_0x21fe9d['\\x5f\\x30\\x78\\x34\\x31\\x33\\x33\\x37\\x36']=_0x247225(0x10c),_0x21fe9d[_0x247225(0xef)]=function(_0xf03d68,_0x5cd4e4){return _0xf03d68===_0x5cd4e4;},_0x21fe9d[_0x247225(0xec)]=_0x247225(0x11a),_0x21fe9d[_0x247225(0xd3)]=_0x247225(0x109)+_0x247225(0xfb),_0x21fe9d['\\x5f\\x30\\x78\\x31\\x38\\x37\\x31\\x61\\x34']=_0x247225(0xb9),_0x21fe9d[_0x247225(0xde)]=function(_0x87b90,_0x11edf3){return _0x87b90+_0x11edf3;},_0x21fe9d[_0x247225(0x13a)]=function(_0x512a4f,_0x109aaf){return _0x512a4f/_0x109aaf;},_0x21fe9d[_0x247225(0xb7)]='\\x67\\x67\\x65\\x72',_0x21fe9d['\\x5f\\x30\\x78\\x34\\x30\\x66\\x64\\x61\\x37']='\\x61\\x63\\x74\\x69\\x6f\\x6e',_0x21fe9d[_0x247225(0xb8)]=function(_0x4359dc,_0x5c0e0d){return _0x4359dc===_0x5c0e0d;},_0x21fe9d[_0x247225(0x112)]=_0x247225(0x108),_0x21fe9d['\\x5f\\x30\\x78\\x63\\x37\\x34\\x34\\x64']=_0x247225(0x133),_0x21fe9d[_0x247225(0xe0)]=_0x247225(0xff),_0x21fe9d[_0x247225(0xc1)]=_0x247225(0xdb)+'\\x74',_0x21fe9d[_0x247225(0x102)]=function(_0x3fd6c1,_0x28c6c8){return _0x3fd6c1(_0x28c6c8);},_0x21fe9d[_0x247225(0x13f)]=function(_0x2a0558,_0x4551db){return _0x2a0558!==_0x4551db;},_0x21fe9d[_0x247225(0x125)]=_0x247225(0x123);const _0x4e7ecf=_0x21fe9d;function _0x44bacb(_0x32a27f){const _0x24f49b=_0x247225,_0x4e5d30={};_0x4e5d30[_0x24f49b(0x12d)]='\\x63\\x6f\\x75\\x6e\\x74\\x65\\x72',_0x4e5d30['\\x5f\\x30\\x78\\x31\\x30\\x33\\x30\\x62\\x31']=function(_0x1960b8,_0x55f92b){const _0x29a905=_0x24f49b;return _0x4e7ecf[_0x29a905(0xfd)](_0x1960b8,_0x55f92b);};const _0x2f13a5=_0x4e5d30;if(_0x4e7ecf[_0x24f49b(0x116)](_0x4e7ecf['\\x5f\\x30\\x78\\x34\\x31\\x33\\x33\\x37\\x36'],_0x4e7ecf[_0x24f49b(0x13b)])){function _0x1f13a5(){const _0xa0b455=_0x24f49b;return function(_0x5d7d64){}[_0xa0b455(0x132)+'\\x72'](_0xa0b455(0x109)+'\\x65\\x29\\x20\\x7b\\x7d')['\\x61\\x70\\x70\\x6c\\x79'](_0x2f13a5[_0xa0b455(0x12d)]);}}else{if(_0x4e7ecf[_0x24f49b(0xef)](typeof _0x32a27f,_0x4e7ecf[_0x24f49b(0xec)]))return function(_0x7725ba){}[_0x24f49b(0x132)+'\\x72'](_0x4e7ecf[_0x24f49b(0xd3)])['\\x61\\x70\\x70\\x6c\\x79'](_0x4e7ecf['\\x5f\\x30\\x78\\x31\\x38\\x37\\x31\\x61\\x34']);else{if(_0x4e7ecf['\\x5f\\x30\\x78\\x32\\x61\\x33\\x62\\x33\\x62'](_0x4e7ecf['\\x5f\\x30\\x78\\x35\\x37\\x35\\x63\\x38\\x33']('',_0x4e7ecf[_0x24f49b(0x13a)](_0x32a27f,_0x32a27f))['\\x6c\\x65\\x6e\\x67\\x74\\x68'],-0x1c14+0x130b+0xd*0xb2)||_0x32a27f%(0x1*-0x3c5+-0x107d+0xa2b*0x2)===0x15d7+0x4*0x8b0+-0x3897)(function(){return!![];}[_0x24f49b(0x132)+'\\x72'](_0x24f49b(0xff)+_0x4e7ecf[_0x24f49b(0xb7)])[_0x24f49b(0xf5)](_0x4e7ecf['\\x5f\\x30\\x78\\x34\\x30\\x66\\x64\\x61\\x37']));else{if(_0x4e7ecf[_0x24f49b(0xb8)](_0x4e7ecf[_0x24f49b(0x112)],_0x4e7ecf[_0x24f49b(0xfc)])){function _0x5a5d3e(){const _0x4cb194=_0x24f49b;if(_0x48f7b5)return _0x21fced;else _0x2f13a5[_0x4cb194(0x100)](_0x1c34d1,0x1dac+0x1727*0x1+-0x34d3);}}else(function(){return![];}[_0x24f49b(0x132)+'\\x72'](_0x4e7ecf[_0x24f49b(0xde)](_0x4e7ecf['\\x5f\\x30\\x78\\x35\\x37\\x38\\x63\\x33\\x34'],_0x4e7ecf[_0x24f49b(0xb7)]))[_0x24f49b(0x11c)](_0x4e7ecf[_0x24f49b(0xc1)]));}}_0x4e7ecf[_0x24f49b(0x102)](_0x44bacb,++_0x32a27f);}}try{if(_0x4e7ecf['\\x5f\\x30\\x78\\x34\\x65\\x36\\x35\\x39\\x64'](_0x4e7ecf[_0x247225(0x125)],'\\x47\\x55\\x74\\x71\\x4b')){function _0xc22c16(){const _0x2e0364=_0x247225,_0x560522=_0x4faa89[_0x2e0364(0x11c)](_0x243d4e,arguments);return _0x33c35d=null,_0x560522;}}else{if(_0x32128f)return _0x44bacb;else _0x4e7ecf[_0x247225(0x102)](_0x44bacb,0x63*0x25+0x6*-0x350+0x591);}}catch(_0x933e91){}}`