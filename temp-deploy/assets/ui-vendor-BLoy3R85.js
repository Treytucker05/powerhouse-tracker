import{r as xe,g as J,a as Me}from"./react-vendor-DoC2WAmd.js";function ge(e,t){for(var n=0;n<t.length;n++){const o=t[n];if(typeof o!="string"&&!Array.isArray(o)){for(const r in o)if(r!=="default"&&!(r in e)){const a=Object.getOwnPropertyDescriptor(o,r);a&&Object.defineProperty(e,r,a.get?a:{enumerable:!0,get:()=>o[r]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var D={exports:{}},S={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var B;function be(){if(B)return S;B=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function n(o,r,a){var i=null;if(a!==void 0&&(i=""+a),r.key!==void 0&&(i=""+r.key),"key"in r){a={};for(var l in r)l!=="key"&&(a[l]=r[l])}else a=r;return r=a.ref,{$$typeof:e,type:o,key:i,ref:r!==void 0?r:null,props:a}}return S.Fragment=t,S.jsx=n,S.jsxs=n,S}var W;function Ne(){return W||(W=1,D.exports=be()),D.exports}var m=Ne(),c=xe();const C=J(c),Y=ge({__proto__:null,default:C},[c]);var we=Me();const bo=J(we);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Re=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,n,o)=>o?o.toUpperCase():n.toLowerCase()),Z=e=>{const t=Re(e);return t.charAt(0).toUpperCase()+t.slice(1)},Q=(...e)=>e.filter((t,n,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===n).join(" ").trim(),Ae=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ie={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=c.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:r="",children:a,iconNode:i,...l},y)=>c.createElement("svg",{ref:y,...Ie,width:t,height:t,stroke:e,strokeWidth:o?Number(n)*24/Number(t):n,className:Q("lucide",r),...!a&&!Ae(l)&&{"aria-hidden":"true"},...l},[...i.map(([u,d])=>c.createElement(u,d)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=(e,t)=>{const n=c.forwardRef(({className:o,...r},a)=>c.createElement(Te,{ref:a,iconNode:t,className:Q(`lucide-${Ce(Z(e))}`,`lucide-${e}`,o),...r}));return n.displayName=Z(e),n};/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],No=s("activity",Se);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],wo=s("arrow-right",Ee);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],Co=s("award",$e);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],Ro=s("book-open",Pe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]],Ao=s("brain",Fe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],Io=s("calculator",je);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M17.5 17.5 16 16.3V14",key:"akvzfd"}],["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}]],To=s("calendar-clock",Le);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],So=s("calendar",Oe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],Eo=s("chart-column",De);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],$o=s("chevron-down",qe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Po=s("chevron-left",Ve);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Fo=s("chevron-right",ze);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],jo=s("circle-alert",Ue);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],Lo=s("circle-check-big",He);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Oo=s("circle-check",Ge);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]],Do=s("circle-minus",Be);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],qo=s("clipboard-list",We);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]],Vo=s("clipboard",Ze);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],zo=s("clock",Ke);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",key:"sobvz5"}],["path",{d:"M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",key:"11i496"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 22v-2",key:"1osdcq"}],["path",{d:"m17 20.66-1-1.73",key:"eq3orb"}],["path",{d:"M11 10.27 7 3.34",key:"16pf9h"}],["path",{d:"m20.66 17-1.73-1",key:"sg0v6f"}],["path",{d:"m3.34 7 1.73 1",key:"1ulond"}],["path",{d:"M14 12h8",key:"4f43i9"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"m20.66 7-1.73 1",key:"1ow05n"}],["path",{d:"m3.34 17 1.73-1",key:"nuk764"}],["path",{d:"m17 3.34-1 1.73",key:"2wel8s"}],["path",{d:"m11 13.73-4 6.93",key:"794ttg"}]],Uo=s("cog",Je);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Ho=s("copy",Ye);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Go=s("download",Qe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["path",{d:"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",key:"9m4mmf"}],["path",{d:"m2.5 21.5 1.4-1.4",key:"17g3f0"}],["path",{d:"m20.1 3.9 1.4-1.4",key:"1qn309"}],["path",{d:"M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",key:"1t2c92"}],["path",{d:"m9.6 14.4 4.8-4.8",key:"6umqxw"}]],Bo=s("dumbbell",Xe);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],Wo=s("funnel",et);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]],Zo=s("heart",tt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],Ko=s("history",ot);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],Jo=s("house",nt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Yo=s("info",rt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],Qo=s("layers",at);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Xo=s("log-out",ct);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 18h16",key:"19g7jn"}],["path",{d:"M4 6h16",key:"1o0s65"}]],en=s("menu",st);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],tn=s("moon",it);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],on=s("package",lt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],nn=s("pause",dt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}]],rn=s("pen-line",ut);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],an=s("play",pt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],cn=s("plus",yt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],sn=s("printer",ht);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]],ln=s("refresh-ccw",ft);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],dn=s("refresh-cw",mt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],un=s("rotate-ccw",kt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",key:"icamh8"}],["path",{d:"m14.5 12.5 2-2",key:"inckbg"}],["path",{d:"m11.5 9.5 2-2",key:"fmmyf7"}],["path",{d:"m8.5 6.5 2-2",key:"vc6u1g"}],["path",{d:"m17.5 15.5 2-2",key:"wo5hmg"}]],pn=s("ruler",vt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],yn=s("save",_t);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],hn=s("settings",xt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=[["polygon",{points:"5 4 15 12 5 20 5 4",key:"16p6eg"}],["line",{x1:"19",x2:"19",y1:"5",y2:"19",key:"futhcm"}]],fn=s("skip-forward",Mt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]],mn=s("sliders-vertical",gt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=[["path",{d:"M12 3v18",key:"108xh3"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}]],kn=s("table",bt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],vn=s("target",Nt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],_n=s("timer",wt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],xn=s("trash-2",Ct);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],Mn=s("trending-down",Rt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],gn=s("trending-up",At);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],bn=s("triangle-alert",It);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],Nn=s("trophy",Tt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],wn=s("user",St);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],Cn=s("users",Et);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]],Rn=s("utensils",$t);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],An=s("wand-sparkles",Pt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=[["circle",{cx:"12",cy:"5",r:"3",key:"rqqgnr"}],["path",{d:"M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z",key:"56o5sh"}]],In=s("weight",Ft);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Tn=s("x",jt);/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],Sn=s("zap",Lt);function w(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e==null||e(r),n===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}function U(e,t=[]){let n=[];function o(a,i){const l=c.createContext(i),y=n.length;n=[...n,i];const u=p=>{var x;const{scope:f,children:k,...g}=p,_=((x=f==null?void 0:f[e])==null?void 0:x[y])||l,h=c.useMemo(()=>g,Object.values(g));return m.jsx(_.Provider,{value:h,children:k})};u.displayName=a+"Provider";function d(p,f){var _;const k=((_=f==null?void 0:f[e])==null?void 0:_[y])||l,g=c.useContext(k);if(g)return g;if(i!==void 0)return i;throw new Error(`\`${p}\` must be used within \`${a}\``)}return[u,d]}const r=()=>{const a=n.map(i=>c.createContext(i));return function(l){const y=(l==null?void 0:l[e])||a;return c.useMemo(()=>({[`__scope${e}`]:{...l,[e]:y}}),[l,y])}};return r.scopeName=e,[o,Ot(r,...t)]}function Ot(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(a){const i=o.reduce((l,{useScope:y,scopeName:u})=>{const p=y(a)[`__scope${u}`];return{...l,...p}},{});return c.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return n.scopeName=t.scopeName,n}function K(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function X(...e){return t=>{let n=!1;const o=e.map(r=>{const a=K(r,t);return!n&&typeof a=="function"&&(n=!0),a});if(n)return()=>{for(let r=0;r<o.length;r++){const a=o[r];typeof a=="function"?a():K(e[r],null)}}}}function F(...e){return c.useCallback(X(...e),e)}function V(e){const t=Dt(e),n=c.forwardRef((o,r)=>{const{children:a,...i}=o,l=c.Children.toArray(a),y=l.find(Vt);if(y){const u=y.props.children,d=l.map(p=>p===y?c.Children.count(u)>1?c.Children.only(null):c.isValidElement(u)?u.props.children:null:p);return m.jsx(t,{...i,ref:r,children:c.isValidElement(u)?c.cloneElement(u,void 0,d):null})}return m.jsx(t,{...i,ref:r,children:a})});return n.displayName=`${e}.Slot`,n}function Dt(e){const t=c.forwardRef((n,o)=>{const{children:r,...a}=n;if(c.isValidElement(r)){const i=Ut(r),l=zt(a,r.props);return r.type!==c.Fragment&&(l.ref=o?X(o,i):i),c.cloneElement(r,l)}return c.Children.count(r)>1?c.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var qt=Symbol("radix.slottable");function Vt(e){return c.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===qt}function zt(e,t){const n={...t};for(const o in t){const r=e[o],a=t[o];/^on[A-Z]/.test(o)?r&&a?n[o]=(...l)=>{const y=a(...l);return r(...l),y}:r&&(n[o]=r):o==="style"?n[o]={...r,...a}:o==="className"&&(n[o]=[r,a].filter(Boolean).join(" "))}return{...e,...n}}function Ut(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function Ht(e){const t=e+"CollectionProvider",[n,o]=U(t),[r,a]=n(t,{collectionRef:{current:null},itemMap:new Map}),i=_=>{const{scope:h,children:x}=_,N=C.useRef(null),v=C.useRef(new Map).current;return m.jsx(r,{scope:h,itemMap:v,collectionRef:N,children:x})};i.displayName=t;const l=e+"CollectionSlot",y=V(l),u=C.forwardRef((_,h)=>{const{scope:x,children:N}=_,v=a(l,x),M=F(h,v.collectionRef);return m.jsx(y,{ref:M,children:N})});u.displayName=l;const d=e+"CollectionItemSlot",p="data-radix-collection-item",f=V(d),k=C.forwardRef((_,h)=>{const{scope:x,children:N,...v}=_,M=C.useRef(null),A=F(h,M),I=a(d,x);return C.useEffect(()=>(I.itemMap.set(M,{ref:M,...v}),()=>void I.itemMap.delete(M))),m.jsx(f,{[p]:"",ref:A,children:N})});k.displayName=d;function g(_){const h=a(e+"CollectionConsumer",_);return C.useCallback(()=>{const N=h.collectionRef.current;if(!N)return[];const v=Array.from(N.querySelectorAll(`[${p}]`));return Array.from(h.itemMap.values()).sort((I,$)=>v.indexOf(I.ref.current)-v.indexOf($.ref.current))},[h.collectionRef,h.itemMap])}return[{Provider:i,Slot:u,ItemSlot:k},g,o]}var j=globalThis!=null&&globalThis.document?c.useLayoutEffect:()=>{},Gt=Y[" useId ".trim().toString()]||(()=>{}),Bt=0;function ee(e){const[t,n]=c.useState(Gt());return j(()=>{n(o=>o??String(Bt++))},[e]),e||(t?`radix-${t}`:"")}var Wt=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],T=Wt.reduce((e,t)=>{const n=V(`Primitive.${t}`),o=c.forwardRef((r,a)=>{const{asChild:i,...l}=r,y=i?n:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),m.jsx(y,{...l,ref:a})});return o.displayName=`Primitive.${t}`,{...e,[t]:o}},{});function Zt(e){const t=c.useRef(e);return c.useEffect(()=>{t.current=e}),c.useMemo(()=>(...n)=>{var o;return(o=t.current)==null?void 0:o.call(t,...n)},[])}var Kt=Y[" useInsertionEffect ".trim().toString()]||j;function te({prop:e,defaultProp:t,onChange:n=()=>{},caller:o}){const[r,a,i]=Jt({defaultProp:t,onChange:n}),l=e!==void 0,y=l?e:r;{const d=c.useRef(e!==void 0);c.useEffect(()=>{const p=d.current;p!==l&&console.warn(`${o} is changing from ${p?"controlled":"uncontrolled"} to ${l?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),d.current=l},[l,o])}const u=c.useCallback(d=>{var p;if(l){const f=Yt(d)?d(e):d;f!==e&&((p=i.current)==null||p.call(i,f))}else a(d)},[l,e,a,i]);return[y,u]}function Jt({defaultProp:e,onChange:t}){const[n,o]=c.useState(e),r=c.useRef(n),a=c.useRef(t);return Kt(()=>{a.current=t},[t]),c.useEffect(()=>{var i;r.current!==n&&((i=a.current)==null||i.call(a,n),r.current=n)},[n,r]),[n,o,a]}function Yt(e){return typeof e=="function"}var Qt=c.createContext(void 0);function oe(e){const t=c.useContext(Qt);return e||t||"ltr"}var q="rovingFocusGroup.onEntryFocus",Xt={bubbles:!1,cancelable:!0},E="RovingFocusGroup",[z,ne,eo]=Ht(E),[to,re]=U(E,[eo]),[oo,no]=to(E),ae=c.forwardRef((e,t)=>m.jsx(z.Provider,{scope:e.__scopeRovingFocusGroup,children:m.jsx(z.Slot,{scope:e.__scopeRovingFocusGroup,children:m.jsx(ro,{...e,ref:t})})}));ae.displayName=E;var ro=c.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,orientation:o,loop:r=!1,dir:a,currentTabStopId:i,defaultCurrentTabStopId:l,onCurrentTabStopIdChange:y,onEntryFocus:u,preventScrollOnEntryFocus:d=!1,...p}=e,f=c.useRef(null),k=F(t,f),g=oe(a),[_,h]=te({prop:i,defaultProp:l??null,onChange:y,caller:E}),[x,N]=c.useState(!1),v=Zt(u),M=ne(n),A=c.useRef(!1),[I,$]=c.useState(0);return c.useEffect(()=>{const b=f.current;if(b)return b.addEventListener(q,v),()=>b.removeEventListener(q,v)},[v]),m.jsx(oo,{scope:n,orientation:o,dir:g,loop:r,currentTabStopId:_,onItemFocus:c.useCallback(b=>h(b),[h]),onItemShiftTab:c.useCallback(()=>N(!0),[]),onFocusableItemAdd:c.useCallback(()=>$(b=>b+1),[]),onFocusableItemRemove:c.useCallback(()=>$(b=>b-1),[]),children:m.jsx(T.div,{tabIndex:x||I===0?-1:0,"data-orientation":o,...p,ref:k,style:{outline:"none",...e.style},onMouseDown:w(e.onMouseDown,()=>{A.current=!0}),onFocus:w(e.onFocus,b=>{const me=!A.current;if(b.target===b.currentTarget&&me&&!x){const G=new CustomEvent(q,Xt);if(b.currentTarget.dispatchEvent(G),!G.defaultPrevented){const O=M().filter(R=>R.focusable),ke=O.find(R=>R.active),ve=O.find(R=>R.id===_),_e=[ke,ve,...O].filter(Boolean).map(R=>R.ref.current);ie(_e,d)}}A.current=!1}),onBlur:w(e.onBlur,()=>N(!1))})})}),ce="RovingFocusGroupItem",se=c.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,focusable:o=!0,active:r=!1,tabStopId:a,children:i,...l}=e,y=ee(),u=a||y,d=no(ce,n),p=d.currentTabStopId===u,f=ne(n),{onFocusableItemAdd:k,onFocusableItemRemove:g,currentTabStopId:_}=d;return c.useEffect(()=>{if(o)return k(),()=>g()},[o,k,g]),m.jsx(z.ItemSlot,{scope:n,id:u,focusable:o,active:r,children:m.jsx(T.span,{tabIndex:p?0:-1,"data-orientation":d.orientation,...l,ref:t,onMouseDown:w(e.onMouseDown,h=>{o?d.onItemFocus(u):h.preventDefault()}),onFocus:w(e.onFocus,()=>d.onItemFocus(u)),onKeyDown:w(e.onKeyDown,h=>{if(h.key==="Tab"&&h.shiftKey){d.onItemShiftTab();return}if(h.target!==h.currentTarget)return;const x=so(h,d.orientation,d.dir);if(x!==void 0){if(h.metaKey||h.ctrlKey||h.altKey||h.shiftKey)return;h.preventDefault();let v=f().filter(M=>M.focusable).map(M=>M.ref.current);if(x==="last")v.reverse();else if(x==="prev"||x==="next"){x==="prev"&&v.reverse();const M=v.indexOf(h.currentTarget);v=d.loop?io(v,M+1):v.slice(M+1)}setTimeout(()=>ie(v))}}),children:typeof i=="function"?i({isCurrentTabStop:p,hasTabStop:_!=null}):i})})});se.displayName=ce;var ao={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function co(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function so(e,t,n){const o=co(e.key,n);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(o))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(o)))return ao[o]}function ie(e,t=!1){const n=document.activeElement;for(const o of e)if(o===n||(o.focus({preventScroll:t}),document.activeElement!==n))return}function io(e,t){return e.map((n,o)=>e[(t+o)%e.length])}var lo=ae,uo=se;function po(e,t){return c.useReducer((n,o)=>t[n][o]??n,e)}var le=e=>{const{present:t,children:n}=e,o=yo(t),r=typeof n=="function"?n({present:o.isPresent}):c.Children.only(n),a=F(o.ref,ho(r));return typeof n=="function"||o.isPresent?c.cloneElement(r,{ref:a}):null};le.displayName="Presence";function yo(e){const[t,n]=c.useState(),o=c.useRef(null),r=c.useRef(e),a=c.useRef("none"),i=e?"mounted":"unmounted",[l,y]=po(i,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return c.useEffect(()=>{const u=P(o.current);a.current=l==="mounted"?u:"none"},[l]),j(()=>{const u=o.current,d=r.current;if(d!==e){const f=a.current,k=P(u);e?y("MOUNT"):k==="none"||(u==null?void 0:u.display)==="none"?y("UNMOUNT"):y(d&&f!==k?"ANIMATION_OUT":"UNMOUNT"),r.current=e}},[e,y]),j(()=>{if(t){let u;const d=t.ownerDocument.defaultView??window,p=k=>{const _=P(o.current).includes(k.animationName);if(k.target===t&&_&&(y("ANIMATION_END"),!r.current)){const h=t.style.animationFillMode;t.style.animationFillMode="forwards",u=d.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=h)})}},f=k=>{k.target===t&&(a.current=P(o.current))};return t.addEventListener("animationstart",f),t.addEventListener("animationcancel",p),t.addEventListener("animationend",p),()=>{d.clearTimeout(u),t.removeEventListener("animationstart",f),t.removeEventListener("animationcancel",p),t.removeEventListener("animationend",p)}}else y("ANIMATION_END")},[t,y]),{isPresent:["mounted","unmountSuspended"].includes(l),ref:c.useCallback(u=>{o.current=u?getComputedStyle(u):null,n(u)},[])}}function P(e){return(e==null?void 0:e.animationName)||"none"}function ho(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var L="Tabs",[fo,En]=U(L,[re]),de=re(),[mo,H]=fo(L),ko=c.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,onValueChange:r,defaultValue:a,orientation:i="horizontal",dir:l,activationMode:y="automatic",...u}=e,d=oe(l),[p,f]=te({prop:o,onChange:r,defaultProp:a??"",caller:L});return m.jsx(mo,{scope:n,baseId:ee(),value:p,onValueChange:f,orientation:i,dir:d,activationMode:y,children:m.jsx(T.div,{dir:d,"data-orientation":i,...u,ref:t})})});ko.displayName=L;var ue="TabsList",vo=c.forwardRef((e,t)=>{const{__scopeTabs:n,loop:o=!0,...r}=e,a=H(ue,n),i=de(n);return m.jsx(lo,{asChild:!0,...i,orientation:a.orientation,dir:a.dir,loop:o,children:m.jsx(T.div,{role:"tablist","aria-orientation":a.orientation,...r,ref:t})})});vo.displayName=ue;var pe="TabsTrigger",_o=c.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,disabled:r=!1,...a}=e,i=H(pe,n),l=de(n),y=he(i.baseId,o),u=fe(i.baseId,o),d=o===i.value;return m.jsx(uo,{asChild:!0,...l,focusable:!r,active:d,children:m.jsx(T.button,{type:"button",role:"tab","aria-selected":d,"aria-controls":u,"data-state":d?"active":"inactive","data-disabled":r?"":void 0,disabled:r,id:y,...a,ref:t,onMouseDown:w(e.onMouseDown,p=>{!r&&p.button===0&&p.ctrlKey===!1?i.onValueChange(o):p.preventDefault()}),onKeyDown:w(e.onKeyDown,p=>{[" ","Enter"].includes(p.key)&&i.onValueChange(o)}),onFocus:w(e.onFocus,()=>{const p=i.activationMode!=="manual";!d&&!r&&p&&i.onValueChange(o)})})})});_o.displayName=pe;var ye="TabsContent",xo=c.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,forceMount:r,children:a,...i}=e,l=H(ye,n),y=he(l.baseId,o),u=fe(l.baseId,o),d=o===l.value,p=c.useRef(d);return c.useEffect(()=>{const f=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(f)},[]),m.jsx(le,{present:r||d,children:({present:f})=>m.jsx(T.div,{"data-state":d?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":y,hidden:!f,id:u,tabIndex:0,...i,ref:t,style:{...e.style,animationDuration:p.current?"0s":void 0},children:f&&a})})});xo.displayName=ye;function he(e,t){return`${e}-trigger-${t}`}function fe(e,t){return`${e}-content-${t}`}export{an as $,No as A,Ro as B,Uo as C,Bo as D,nn as E,Zo as F,wo as G,Jo as H,Yo as I,cn as J,Cn as K,Xo as L,en as M,rn as N,_n as O,sn as P,tn as Q,C as R,hn as S,bn as T,wn as U,Rn as V,In as W,Tn as X,Ao as Y,Sn as Z,Co as _,we as a,Po as a0,Vo as a1,fn as a2,Ko as a3,xn as a4,To as a5,Wo as a6,$o as a7,bo as a8,kn as a9,An as aa,Do as ab,mn as ac,pn as ad,ln as ae,yn as af,qo as b,Eo as c,Oo as d,jo as e,Go as f,Ho as g,Io as h,vn as i,m as j,zo as k,Lo as l,Mn as m,gn as n,un as o,Fo as p,ko as q,c as r,vo as s,_o as t,xo as u,So as v,on as w,Qo as x,Nn as y,dn as z};
//# sourceMappingURL=ui-vendor-BLoy3R85.js.map
