var Wu=Object.defineProperty;var Xu=(r,e,t)=>e in r?Wu(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var A=(r,e,t)=>Xu(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sl="185",qu=0,oc=1,Yu=2,jr=1,Nh=2,ks=3,ni=0,en=1,Qt=2,ei=0,cs=1,Xs=2,lc=3,cc=4,Ku=5,Li=100,$u=101,Zu=102,Ju=103,ju=104,Qu=200,ed=201,td=202,nd=203,Mo=204,So=205,id=206,sd=207,rd=208,ad=209,od=210,ld=211,cd=212,hd=213,ud=214,bo=0,wo=1,To=2,ps=3,Eo=4,Ao=5,Co=6,Ro=7,ya=0,dd=1,fd=2,Vn=0,Uh=1,Oh=2,kh=3,bl=4,Bh=5,Vh=6,zh=7,hc="attached",pd="detached",Gh=300,Ni=301,ms=302,Qr=303,Ia=304,Ma=306,Jt=1e3,gn=1001,oa=1002,Vt=1003,Hh=1004,Bs=1005,kt=1006,ea=1007,kn=1008,hn=1009,Wh=1010,Xh=1011,qs=1012,wl=1013,Gn=1014,_n=1015,ii=1016,Tl=1017,El=1018,Ys=1020,qh=35902,Yh=35899,Kh=1021,$h=1022,xn=1023,si=1026,Fi=1027,Al=1028,Cl=1029,Ui=1030,Rl=1031,Pl=1033,ta=33776,na=33777,ia=33778,sa=33779,Po=35840,Io=35841,Lo=35842,Do=35843,Fo=36196,No=37492,Uo=37496,Oo=37488,ko=37489,la=37490,Bo=37491,Vo=37808,zo=37809,Go=37810,Ho=37811,Wo=37812,Xo=37813,qo=37814,Yo=37815,Ko=37816,$o=37817,Zo=37818,Jo=37819,jo=37820,Qo=37821,el=36492,tl=36494,nl=36495,il=36283,sl=36284,ca=36285,rl=36286,ha=2200,md=2201,gd=2202,Ks=2300,$s=2301,La=2302,uc=2303,as=2400,os=2401,ua=2402,Il=2500,_d=2501,xd=0,Zh=1,al=2,vd=3200,Zs=0,yd=1,yi="",dt="srgb",un="srgb-linear",da="linear",ft="srgb",Gi=7680,dc=519,Md=512,Sd=513,bd=514,Ll=515,wd=516,Td=517,Dl=518,Ed=519,ol=35044,fc="300 es",Bn=2e3,Js=2001;function Ad(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Cd(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function js(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Rd(){const r=js("canvas");return r.style.display="block",r}const pc={};function fa(...r){const e="THREE."+r.shift();console.log(e,...r)}function Jh(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Pe(...r){r=Jh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function ke(...r){r=Jh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function hs(...r){const e=r.join(" ");e in pc||(pc[e]=!0,Pe(...r))}function Pd(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Id={[bo]:wo,[To]:Co,[Eo]:Ro,[ps]:Ao,[wo]:bo,[Co]:To,[Ro]:Eo,[Ao]:ps};class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const $t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let mc=1234567;const Gs=Math.PI/180,gs=180/Math.PI;function Rn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($t[r&255]+$t[r>>8&255]+$t[r>>16&255]+$t[r>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]).toLowerCase()}function et(r,e,t){return Math.max(e,Math.min(t,r))}function Fl(r,e){return(r%e+e)%e}function Ld(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Dd(r,e,t){return r!==e?(t-r)/(e-r):0}function Hs(r,e,t){return(1-t)*r+t*e}function Fd(r,e,t,n){return Hs(r,e,1-Math.exp(-t*n))}function Nd(r,e=1){return e-Math.abs(Fl(r,e*2)-e)}function Ud(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Od(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function kd(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Bd(r,e){return r+Math.random()*(e-r)}function Vd(r){return r*(.5-Math.random())}function zd(r){r!==void 0&&(mc=r);let e=mc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Gd(r){return r*Gs}function Hd(r){return r*gs}function Wd(r){return(r&r-1)===0&&r!==0}function Xd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function qd(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Yd(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*d,o*c);break;case"YZY":r.set(l*d,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*d,o*h,o*c);break;case"XZX":r.set(o*h,l*p,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*p,o*c);break;case"ZYZ":r.set(l*p,l*f,o*h,o*c);break;default:Pe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function An(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function pt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const mt={DEG2RAD:Gs,RAD2DEG:gs,generateUUID:Rn,clamp:et,euclideanModulo:Fl,mapLinear:Ld,inverseLerp:Dd,lerp:Hs,damp:Fd,pingpong:Nd,smoothstep:Ud,smootherstep:Od,randInt:kd,randFloat:Bd,randFloatSpread:Vd,seededRandom:zd,degToRad:Gd,radToDeg:Hd,isPowerOfTwo:Wd,ceilPowerOfTwo:Xd,floorPowerOfTwo:qd,setQuaternionFromProperEuler:Yd,normalize:pt,denormalize:An},Kl=class Kl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Kl.prototype.isVector2=!0;let Ve=Kl;class Ft{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[a+0],f=s[a+1],p=s[a+2],_=s[a+3];if(u!==_||l!==d||c!==f||h!==p){let m=l*d+c*f+h*p+u*_;m<0&&(d=-d,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const S=Math.acos(m),M=Math.sin(S);g=Math.sin(g*S)/M,o=Math.sin(o*S)/M,l=l*g+d*o,c=c*g+f*o,h=h*g+p*o,u=u*g+_*o}else{l=l*g+d*o,c=c*g+f*o,h=h*g+p*o,u=u*g+_*o;const S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],d=s[a+1],f=s[a+2],p=s[a+3];return e[t]=o*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-o*f,e[t+2]=c*p+h*f+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),d=l(n/2),f=l(i/2),p=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const $l=class $l{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Da.copy(this).projectOnVector(e),this.sub(Da)}reflect(e){return this.sub(Da.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};$l.prototype.isVector3=!0;let b=$l;const Da=new b,gc=new Ft,Zl=class Zl{constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],_=i[0],m=i[3],g=i[6],S=i[1],M=i[4],v=i[7],w=i[2],E=i[5],T=i[8];return s[0]=a*_+o*S+l*w,s[3]=a*m+o*M+l*E,s[6]=a*g+o*v+l*T,s[1]=c*_+h*S+u*w,s[4]=c*m+h*M+u*E,s[7]=c*g+h*v+u*T,s[2]=d*_+f*S+p*w,s[5]=d*m+f*M+p*E,s[8]=d*g+f*v+p*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,f=c*s-a*l,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return hs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Fa.makeScale(e,t)),this}rotate(e){return hs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Fa.makeRotation(-e)),this}translate(e,t){return hs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Zl.prototype.isMatrix3=!0;let He=Zl;const Fa=new He,_c=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xc=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Kd(){const r={enabled:!0,workingColorSpace:un,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ft&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ft&&(i.r=us(i.r),i.g=us(i.g),i.b=us(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===yi?da:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return hs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return hs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[un]:{primaries:e,whitePoint:n,transfer:da,toXYZ:_c,fromXYZ:xc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:dt},outputColorSpaceConfig:{drawingBufferColorSpace:dt}},[dt]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:_c,fromXYZ:xc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:dt}}}),r}const We=Kd();function ti(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function us(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Hi;class $d{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Hi===void 0&&(Hi=js("canvas")),Hi.width=e.width,Hi.height=e.height;const i=Hi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Hi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=js("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=ti(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ti(t[n]/255)*255):t[n]=ti(t[n]);return{data:t,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zd=0;class Nl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Na(i[a].image)):s.push(Na(i[a]))}else s=Na(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Na(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?$d.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let Jd=0;const Ua=new b;class Bt extends wi{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=gn,i=gn,s=kt,a=kn,o=xn,l=hn,c=Bt.DEFAULT_ANISOTROPY,h=yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jd++}),this.uuid=Rn(),this.name="",this.source=new Nl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ua).x}get height(){return this.source.getSize(Ua).y}get depth(){return this.source.getSize(Ua).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Pe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Pe(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Jt:e.x=e.x-Math.floor(e.x);break;case gn:e.x=e.x<0?0:1;break;case oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Jt:e.y=e.y-Math.floor(e.y);break;case gn:e.y=e.y<0?0:1;break;case oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Gh;Bt.DEFAULT_ANISOTROPY=1;const Jl=class Jl{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,v=(f+1)/2,w=(g+1)/2,E=(h+d)/4,T=(u+_)/4,x=(p+m)/4;return M>v&&M>w?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=E/n,s=T/n):v>w?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=E/i,s=x/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=T/s,i=x/s),this.set(n,i,s,t),this}let S=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(u-_)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Jl.prototype.isVector4=!0;let at=Jl;class jd extends wi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},s=new Bt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Nl(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zn extends jd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class jh extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qd extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const va=class va{constructor(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,m)}set(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new va().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Wi.setFromMatrixColumn(e,0).length(),s=1/Wi.setFromMatrixColumn(e,1).length(),a=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=a*h,f=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d+_*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=p*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-_*u}else if(e.order==="XZY"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ef,e,tf)}lookAt(e,t,n){const i=this.elements;return ln.subVectors(e,t),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),hi.crossVectors(n,ln),hi.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),hi.crossVectors(n,ln)),hi.normalize(),gr.crossVectors(ln,hi),i[0]=hi.x,i[4]=gr.x,i[8]=ln.x,i[1]=hi.y,i[5]=gr.y,i[9]=ln.y,i[2]=hi.z,i[6]=gr.z,i[10]=ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],S=n[3],M=n[7],v=n[11],w=n[15],E=i[0],T=i[4],x=i[8],R=i[12],L=i[1],I=i[5],F=i[9],B=i[13],K=i[2],O=i[6],q=i[10],V=i[14],Q=i[3],te=i[7],ue=i[11],me=i[15];return s[0]=a*E+o*L+l*K+c*Q,s[4]=a*T+o*I+l*O+c*te,s[8]=a*x+o*F+l*q+c*ue,s[12]=a*R+o*B+l*V+c*me,s[1]=h*E+u*L+d*K+f*Q,s[5]=h*T+u*I+d*O+f*te,s[9]=h*x+u*F+d*q+f*ue,s[13]=h*R+u*B+d*V+f*me,s[2]=p*E+_*L+m*K+g*Q,s[6]=p*T+_*I+m*O+g*te,s[10]=p*x+_*F+m*q+g*ue,s[14]=p*R+_*B+m*V+g*me,s[3]=S*E+M*L+v*K+w*Q,s[7]=S*T+M*I+v*O+w*te,s[11]=S*x+M*F+v*q+w*ue,s[15]=S*R+M*B+v*V+w*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15],S=l*f-c*d,M=o*f-c*u,v=o*d-l*u,w=a*f-c*h,E=a*d-l*h,T=a*u-o*h;return t*(_*S-m*M+g*v)-n*(p*S-m*w+g*E)+i*(p*M-_*w+g*T)-s*(p*v-_*E+m*T)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(s*h-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],S=t*o-n*a,M=t*l-i*a,v=t*c-s*a,w=n*l-i*o,E=n*c-s*o,T=i*c-s*l,x=h*_-u*p,R=h*m-d*p,L=h*g-f*p,I=u*m-d*_,F=u*g-f*_,B=d*g-f*m,K=S*B-M*F+v*I+w*L-E*R+T*x;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/K;return e[0]=(o*B-l*F+c*I)*O,e[1]=(i*F-n*B-s*I)*O,e[2]=(_*T-m*E+g*w)*O,e[3]=(d*E-u*T-f*w)*O,e[4]=(l*L-a*B-c*R)*O,e[5]=(t*B-i*L+s*R)*O,e[6]=(m*v-p*T-g*M)*O,e[7]=(h*T-d*v+f*M)*O,e[8]=(a*F-o*L+c*x)*O,e[9]=(n*L-t*F-s*x)*O,e[10]=(p*E-_*v+g*S)*O,e[11]=(u*v-h*E-f*S)*O,e[12]=(o*R-a*I-l*x)*O,e[13]=(t*I-n*R+i*x)*O,e[14]=(_*M-p*w-m*S)*O,e[15]=(h*w-u*M+d*S)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,f=s*h,p=s*u,_=a*h,m=a*u,g=o*u,S=l*c,M=l*h,v=l*u,w=n.x,E=n.y,T=n.z;return i[0]=(1-(_+g))*w,i[1]=(f+v)*w,i[2]=(p-M)*w,i[3]=0,i[4]=(f-v)*E,i[5]=(1-(d+g))*E,i[6]=(m+S)*E,i[7]=0,i[8]=(p+M)*T,i[9]=(m-S)*T,i[10]=(1-(d+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Wi.set(i[0],i[1],i[2]).length();const o=Wi.set(i[4],i[5],i[6]).length(),l=Wi.set(i[8],i[9],i[10]).length();s<0&&(a=-a),Sn.copy(this);const c=1/a,h=1/o,u=1/l;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,t.setFromRotationMatrix(Sn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=Bn,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let p,_;if(l)p=s/(a-s),_=a*s/(a-s);else if(o===Bn)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Js)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=Bn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let p,_;if(l)p=1/(a-s),_=a/(a-s);else if(o===Bn)p=-2/(a-s),_=-(a+s)/(a-s);else if(o===Js)p=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};va.prototype.isMatrix4=!0;let Se=va;const Wi=new b,Sn=new Se,ef=new b(0,0,0),tf=new b(1,1,1),hi=new b,gr=new b,ln=new b,vc=new Se,yc=new Ft;class qt{constructor(e=0,t=0,n=0,i=qt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yc.setFromEuler(this),this.setFromQuaternion(yc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qt.DEFAULT_ORDER="XYZ";class Ul{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let nf=0;const Mc=new b,Xi=new Ft,Xn=new Se,_r=new b,As=new b,sf=new b,rf=new Ft,Sc=new b(1,0,0),bc=new b(0,1,0),wc=new b(0,0,1),Tc={type:"added"},af={type:"removed"},qi={type:"childadded",child:null},Oa={type:"childremoved",child:null};class ht extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ht.DEFAULT_UP.clone();const e=new b,t=new qt,n=new Ft,i=new b(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Se},normalMatrix:{value:new He}}),this.matrix=new Se,this.matrixWorld=new Se,this.matrixAutoUpdate=ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(Sc,e)}rotateY(e){return this.rotateOnAxis(bc,e)}rotateZ(e){return this.rotateOnAxis(wc,e)}translateOnAxis(e,t){return Mc.copy(e).applyQuaternion(this.quaternion),this.position.add(Mc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Sc,e)}translateY(e){return this.translateOnAxis(bc,e)}translateZ(e){return this.translateOnAxis(wc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?_r.copy(e):_r.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(As,_r,this.up):Xn.lookAt(_r,As,this.up),this.quaternion.setFromRotationMatrix(Xn),i&&(Xn.extractRotation(i.matrixWorld),Xi.setFromRotationMatrix(Xn),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tc),qi.child=e,this.dispatchEvent(qi),qi.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(af),Oa.child=e,this.dispatchEvent(Oa),Oa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tc),qi.child=e,this.dispatchEvent(qi),qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,sf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,rf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ht.DEFAULT_UP=new b(0,1,0);ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class lt extends ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const of={type:"move"};class ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(of)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},xr={h:0,s:0,l:0};function Ba(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class _e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=We.workingColorSpace){if(e=Fl(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ba(a,s,e+1/3),this.g=Ba(a,s,e),this.b=Ba(a,s,e-1/3)}return We.colorSpaceToWorking(this,i),this}setStyle(e,t=dt){function n(s){s!==void 0&&parseFloat(s)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Pe("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){const n=Qh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ti(e.r),this.g=ti(e.g),this.b=ti(e.b),this}copyLinearToSRGB(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return We.workingToColorSpace(Zt.copy(this),e),Math.round(et(Zt.r*255,0,255))*65536+Math.round(et(Zt.g*255,0,255))*256+Math.round(et(Zt.b*255,0,255))}getHexString(e=dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(Zt.copy(this),t);const n=Zt.r,i=Zt.g,s=Zt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=dt){We.workingToColorSpace(Zt.copy(this),e);const t=Zt.r,n=Zt.g,i=Zt.b;return e!==dt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ui),this.setHSL(ui.h+e,ui.s+t,ui.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ui),e.getHSL(xr);const n=Hs(ui.h,xr.h,t),i=Hs(ui.s,xr.s,t),s=Hs(ui.l,xr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zt=new _e;_e.NAMES=Qh;class Sa{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new _e(e),this.density=t}clone(){return new Sa(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class lf extends ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qt,this.environmentIntensity=1,this.environmentRotation=new qt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const bn=new b,qn=new b,Va=new b,Yn=new b,Yi=new b,Ki=new b,Ec=new b,za=new b,Ga=new b,Ha=new b,Wa=new at,Xa=new at,qa=new at;class Cn{constructor(e=new b,t=new b,n=new b){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),bn.subVectors(e,t),i.cross(bn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){bn.subVectors(i,t),qn.subVectors(n,t),Va.subVectors(e,t);const a=bn.dot(bn),o=bn.dot(qn),l=bn.dot(Va),c=qn.dot(qn),h=qn.dot(Va),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,p=(a*h-o*l)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Yn.x),l.addScaledVector(a,Yn.y),l.addScaledVector(o,Yn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return Wa.setScalar(0),Xa.setScalar(0),qa.setScalar(0),Wa.fromBufferAttribute(e,t),Xa.fromBufferAttribute(e,n),qa.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Wa,s.x),a.addScaledVector(Xa,s.y),a.addScaledVector(qa,s.z),a}static isFrontFacing(e,t,n,i){return bn.subVectors(n,t),qn.subVectors(e,t),bn.cross(qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),bn.cross(qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Cn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Yi.subVectors(i,n),Ki.subVectors(s,n),za.subVectors(e,n);const l=Yi.dot(za),c=Ki.dot(za);if(l<=0&&c<=0)return t.copy(n);Ga.subVectors(e,i);const h=Yi.dot(Ga),u=Ki.dot(Ga);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Yi,a);Ha.subVectors(e,s);const f=Yi.dot(Ha),p=Ki.dot(Ha);if(p>=0&&f<=p)return t.copy(s);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ki,o);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return Ec.subVectors(s,i),o=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(Ec,o);const g=1/(m+_+d);return a=_*g,o=d*g,t.copy(n).addScaledVector(Yi,a).addScaledVector(Ki,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class rn{constructor(e=new b(1/0,1/0,1/0),t=new b(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,wn):wn.fromBufferAttribute(s,a),wn.applyMatrix4(e.matrixWorld),this.expandByPoint(wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vr.copy(n.boundingBox)),vr.applyMatrix4(e.matrixWorld),this.union(vr)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wn),wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Cs),yr.subVectors(this.max,Cs),$i.subVectors(e.a,Cs),Zi.subVectors(e.b,Cs),Ji.subVectors(e.c,Cs),di.subVectors(Zi,$i),fi.subVectors(Ji,Zi),Ei.subVectors($i,Ji);let t=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Ei.z,Ei.y,di.z,0,-di.x,fi.z,0,-fi.x,Ei.z,0,-Ei.x,-di.y,di.x,0,-fi.y,fi.x,0,-Ei.y,Ei.x,0];return!Ya(t,$i,Zi,Ji,yr)||(t=[1,0,0,0,1,0,0,0,1],!Ya(t,$i,Zi,Ji,yr))?!1:(Mr.crossVectors(di,fi),t=[Mr.x,Mr.y,Mr.z],Ya(t,$i,Zi,Ji,yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Kn=[new b,new b,new b,new b,new b,new b,new b,new b],wn=new b,vr=new rn,$i=new b,Zi=new b,Ji=new b,di=new b,fi=new b,Ei=new b,Cs=new b,yr=new b,Mr=new b,Ai=new b;function Ya(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Ai.fromArray(r,s);const o=i.x*Math.abs(Ai.x)+i.y*Math.abs(Ai.y)+i.z*Math.abs(Ai.z),l=e.dot(Ai),c=t.dot(Ai),h=n.dot(Ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ot=new b,Sr=new Ve;let cf=0;class ot extends wi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ol,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyMatrix3(e),this.setXY(t,Sr.x,Sr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=An(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=An(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=An(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=An(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=An(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ol&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Ol extends ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class eu extends ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class st extends ot{constructor(e,t,n){super(new Float32Array(e),t,n)}}const hf=new rn,Rs=new b,Ka=new b;class Hn{constructor(e=new b,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):hf.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rs.subVectors(e,this.center);const t=Rs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Rs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ka.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rs.copy(e.center).add(Ka)),this.expandByPoint(Rs.copy(e.center).sub(Ka))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let uf=0;const fn=new Se,$a=new ht,ji=new b,cn=new rn,Ps=new rn,Ht=new b;class gt extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ad(e)?eu:Ol)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new He().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,n){return fn.makeTranslation(e,t,n),this.applyMatrix4(fn),this}scale(e,t,n){return fn.makeScale(e,t,n),this.applyMatrix4(fn),this}lookAt(e){return $a.lookAt(e),$a.updateMatrix(),this.applyMatrix4($a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new st(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];cn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new b,1/0);return}if(e){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(cn.min,Ps.min),cn.expandByPoint(Ht),Ht.addVectors(cn.max,Ps.max),cn.expandByPoint(Ht)):(cn.expandByPoint(Ps.min),cn.expandByPoint(Ps.max))}cn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Ht.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Ht));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ht.fromBufferAttribute(o,c),l&&(ji.fromBufferAttribute(e,c),Ht.add(ji)),i=Math.max(i,n.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ot(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new b,l[x]=new b;const c=new b,h=new b,u=new b,d=new Ve,f=new Ve,p=new Ve,_=new b,m=new b;function g(x,R,L){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,R),u.fromBufferAttribute(n,L),d.fromBufferAttribute(s,x),f.fromBufferAttribute(s,R),p.fromBufferAttribute(s,L),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(I),o[x].add(_),o[R].add(_),o[L].add(_),l[x].add(m),l[R].add(m),l[L].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,R=S.length;x<R;++x){const L=S[x],I=L.start,F=L.count;for(let B=I,K=I+F;B<K;B+=3)g(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const M=new b,v=new b,w=new b,E=new b;function T(x){w.fromBufferAttribute(i,x),E.copy(w);const R=o[x];M.copy(R),M.sub(w.multiplyScalar(w.dot(R))).normalize(),v.crossVectors(E,R);const I=v.dot(l[x])<0?-1:1;a.setXYZW(x,M.x,M.y,M.z,I)}for(let x=0,R=S.length;x<R;++x){const L=S[x],I=L.start,F=L.count;for(let B=I,K=I+F;B<K;B+=3)T(e.getX(B+0)),T(e.getX(B+1)),T(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new b,s=new b,a=new b,o=new b,l=new b,c=new b,h=new b,u=new b;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new ot(d,h,u)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new gt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class df{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ol,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const tn=new b;class kl{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=An(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=An(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=An(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=An(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=An(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){fa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ot(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new kl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){fa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let ff=0;class vn extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=cs,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=So,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _e(0,0,0),this.blendAlpha=0,this.depthFunc=ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gi,this.stencilZFail=Gi,this.stencilZPass=Gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Pe(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Pe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==cs&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Mo&&(n.blendSrc=this.blendSrc),this.blendDst!==So&&(n.blendDst=this.blendDst),this.blendEquation!==Li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ps&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new _e().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ve().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ve().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const $n=new b,Za=new b,br=new b,pi=new b,Ja=new b,wr=new b,ja=new b;class ar{constructor(e=new b,t=new b(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=$n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($n.copy(this.origin).addScaledVector(this.direction,t),$n.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Za.copy(e).add(t).multiplyScalar(.5),br.copy(t).sub(e).normalize(),pi.copy(this.origin).sub(Za);const s=e.distanceTo(t)*.5,a=-this.direction.dot(br),o=pi.dot(this.direction),l=-pi.dot(br),c=pi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*l-o,d=a*o-l,p=s*h,u>=0)if(d>=-p)if(d<=p){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Za).addScaledVector(br,d),f}intersectSphere(e,t){$n.subVectors(e.center,this.origin);const n=$n.dot(this.direction),i=$n.dot($n)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,$n)!==null}intersectTriangle(e,t,n,i,s){Ja.subVectors(t,e),wr.subVectors(n,e),ja.crossVectors(Ja,wr);let a=this.direction.dot(ja),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;pi.subVectors(this.origin,e);const l=o*this.direction.dot(wr.crossVectors(pi,wr));if(l<0)return null;const c=o*this.direction.dot(Ja.cross(pi));if(c<0||l+c>a)return null;const h=-o*pi.dot(ja);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class bt extends vn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.combine=ya,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ac=new Se,Ci=new ar,Tr=new Hn,Cc=new b,Er=new b,Ar=new b,Cr=new b,Qa=new b,Rr=new b,Rc=new b,Pr=new b;class j extends ht{constructor(e=new gt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Rr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Qa.fromBufferAttribute(u,e),a?Rr.addScaledVector(Qa,h):Rr.addScaledVector(Qa.sub(t),h))}t.add(Rr)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Tr.copy(n.boundingSphere),Tr.applyMatrix4(s),Ci.copy(e.ray).recast(e.near),!(Tr.containsPoint(Ci.origin)===!1&&(Ci.intersectSphere(Tr,Cc)===null||Ci.origin.distanceToSquared(Cc)>(e.far-e.near)**2))&&(Ac.copy(s).invert(),Ci.copy(e.ray).applyMatrix4(Ac),!(n.boundingBox!==null&&Ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ci)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],S=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=M;v<w;v+=3){const E=o.getX(v),T=o.getX(v+1),x=o.getX(v+2);i=Ir(this,g,e,n,c,h,u,E,T,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const S=o.getX(m),M=o.getX(m+1),v=o.getX(m+2);i=Ir(this,a,e,n,c,h,u,S,M,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],S=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,w=M;v<w;v+=3){const E=v,T=v+1,x=v+2;i=Ir(this,g,e,n,c,h,u,E,T,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const S=m,M=m+1,v=m+2;i=Ir(this,a,e,n,c,h,u,S,M,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function pf(r,e,t,n,i,s,a,o){let l;if(e.side===en?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===ni,o),l===null)return null;Pr.copy(o),Pr.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Pr);return c<t.near||c>t.far?null:{distance:c,point:Pr.clone(),object:r}}function Ir(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,Er),r.getVertexPosition(l,Ar),r.getVertexPosition(c,Cr);const h=pf(r,e,t,n,Er,Ar,Cr,Rc);if(h){const u=new b;Cn.getBarycoord(Rc,Er,Ar,Cr,u),i&&(h.uv=Cn.getInterpolatedAttribute(i,o,l,c,u,new Ve)),s&&(h.uv1=Cn.getInterpolatedAttribute(s,o,l,c,u,new Ve)),a&&(h.normal=Cn.getInterpolatedAttribute(a,o,l,c,u,new b),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new b,materialIndex:0};Cn.getNormal(Er,Ar,Cr,d.normal),h.face=d,h.barycoord=u}return h}const Is=new at,Pc=new at,Ic=new at,mf=new at,Lc=new Se,Lr=new b,eo=new Hn,Dc=new Se,to=new ar;class tu extends j{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=hc,this.bindMatrix=new Se,this.bindMatrixInverse=new Se,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new rn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingBox.expandByPoint(Lr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Hn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingSphere.expandByPoint(Lr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),eo.copy(this.boundingSphere),eo.applyMatrix4(i),e.ray.intersectsSphere(eo)!==!1&&(Dc.copy(i).invert(),to.copy(e.ray).applyMatrix4(Dc),!(this.boundingBox!==null&&to.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,to)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===hc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===pd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Pe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Pc.fromBufferAttribute(i.attributes.skinIndex,e),Ic.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Is.copy(t),t.set(0,0,0,0)):(Is.set(...t,1),t.set(0,0,0)),Is.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){const a=Ic.getComponent(s);if(a!==0){const o=Pc.getComponent(s);Lc.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(mf.copy(Is).applyMatrix4(Lc),a)}}return t.isVector4&&(t.w=Is.w),t.applyMatrix4(this.bindMatrixInverse)}}class pa extends ht{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Bl extends Bt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=Vt,h=Vt,u,d){super(null,a,o,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Fc=new Se,gf=new Se;class Mi{constructor(e=[],t=[]){this.uuid=Rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Pe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Se)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Se;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:gf;Fc.multiplyMatrices(o,t[s]),Fc.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Mi(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Bl(t,e,e,xn,_n);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(Pe("Skeleton: No bone found with UUID:",s),a=new pa),this.bones.push(a),this.boneInverses.push(new Se().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class ll extends ot{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Qi=new Se,Nc=new Se,Dr=[],Uc=new rn,_f=new Se,Ls=new j,Ds=new Hn;class ra extends j{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ll(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,_f)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Uc.copy(e.boundingBox).applyMatrix4(Qi),this.boundingBox.union(Uc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Ds.copy(e.boundingSphere).applyMatrix4(Qi),this.boundingSphere.union(Ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ls.geometry=this.geometry,Ls.material=this.material,Ls.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ds.copy(this.boundingSphere),Ds.applyMatrix4(n),e.ray.intersectsSphere(Ds)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Qi),Nc.multiplyMatrices(n,Qi),Ls.matrixWorld=Nc,Ls.raycast(e,Dr);for(let a=0,o=Dr.length;a<o;a++){const l=Dr[a];l.instanceId=s,l.object=this,t.push(l)}Dr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ll(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Bl(new Float32Array(i*this.count),i,this.count,Al,_n));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const no=new b,xf=new b,vf=new He;class Ii{constructor(e=new b(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=no.subVectors(n,t).cross(xf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(no),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||vf.getNormalMatrix(e),i=this.coplanarPoint(no).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ri=new Hn,yf=new Ve(.5,.5),Fr=new b;class Vl{constructor(e=new Ii,t=new Ii,n=new Ii,i=new Ii,s=new Ii,a=new Ii){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],p=s[8],_=s[9],m=s[10],g=s[11],S=s[12],M=s[13],v=s[14],w=s[15];if(i[0].setComponents(c-a,f-h,g-p,w-S).normalize(),i[1].setComponents(c+a,f+h,g+p,w+S).normalize(),i[2].setComponents(c+o,f+u,g+_,w+M).normalize(),i[3].setComponents(c-o,f-u,g-_,w-M).normalize(),n)i[4].setComponents(l,d,m,v).normalize(),i[5].setComponents(c-l,f-d,g-m,w-v).normalize();else if(i[4].setComponents(c-l,f-d,g-m,w-v).normalize(),t===Bn)i[5].setComponents(c+l,f+d,g+m,w+v).normalize();else if(t===Js)i[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ri)}intersectsSprite(e){Ri.center.set(0,0,0);const t=yf.distanceTo(e.center);return Ri.radius=.7071067811865476+t,Ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ri)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Fr.x=i.normal.x>0?e.max.x:e.min.x,Fr.y=i.normal.y>0?e.max.y:e.min.y,Fr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ba extends vn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ma=new b,ga=new b,Oc=new Se,Fs=new ar,Nr=new Hn,io=new b,kc=new b;class wa extends ht{constructor(e=new gt,t=new ba){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)ma.fromBufferAttribute(t,i-1),ga.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ma.distanceTo(ga);e.setAttribute("lineDistance",new st(n,1))}else Pe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(i),Nr.radius+=s,e.ray.intersectsSphere(Nr)===!1)return;Oc.copy(i).invert(),Fs.copy(e.ray).applyMatrix4(Oc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=h.getX(_),S=h.getX(_+1),M=Ur(this,e,Fs,l,g,S,_);M&&t.push(M)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(f),g=Ur(this,e,Fs,l,_,m,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=Ur(this,e,Fs,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){const _=Ur(this,e,Fs,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Ur(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(ma.fromBufferAttribute(o,i),ga.fromBufferAttribute(o,s),t.distanceSqToSegment(ma,ga,io,kc)>n)return;io.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(io);if(!(c<e.near||c>e.far))return{distance:c,point:kc.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Bc=new b,Vc=new b;class nu extends wa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Bc.fromBufferAttribute(t,i),Vc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Bc.distanceTo(Vc);e.setAttribute("lineDistance",new st(n,1))}else Pe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Mf extends wa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class bi extends vn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new _e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const zc=new Se,cl=new ar,Or=new Hn,kr=new b;class Oi extends ht{constructor(e=new gt,t=new bi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(i),Or.radius+=s,e.ray.intersectsSphere(Or)===!1)return;zc.copy(i).invert(),cl.copy(e.ray).applyMatrix4(zc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const m=c.getX(p);kr.fromBufferAttribute(u,m),Gc(kr,m,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,_=f;p<_;p++)kr.fromBufferAttribute(u,p),Gc(kr,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Gc(r,e,t,n,i,s,a){const o=cl.distanceSqToPoint(r);if(o<t){const l=new b;cl.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class iu extends Bt{constructor(e=[],t=Ni,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Jn extends Bt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _s extends Bt{constructor(e,t,n=Gn,i,s,a,o=Vt,l=Vt,c,h=si,u=1){if(h!==si&&h!==Fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Nl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Sf extends _s{constructor(e,t=Gn,n=Ni,i,s,a=Vt,o=Vt,l,c=si){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class su extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ge extends gt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,s,0),p("z","y","x",1,-1,n,t,-e,a,s,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2));function p(_,m,g,S,M,v,w,E,T,x,R){const L=v/T,I=w/x,F=v/2,B=w/2,K=E/2,O=T+1,q=x+1;let V=0,Q=0;const te=new b;for(let ue=0;ue<q;ue++){const me=ue*I-B;for(let ye=0;ye<O;ye++){const qe=ye*L-F;te[_]=qe*S,te[m]=me*M,te[g]=K,c.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[g]=E>0?1:-1,h.push(te.x,te.y,te.z),u.push(ye/T),u.push(1-ue/x),V+=1}}for(let ue=0;ue<x;ue++)for(let me=0;me<T;me++){const ye=d+me+O*ue,qe=d+me+O*(ue+1),xt=d+(me+1)+O*(ue+1),Fe=d+(me+1)+O*ue;l.push(ye,qe,Fe),l.push(qe,xt,Fe),Q+=6}o.addGroup(f,Q,R),f+=Q,d+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ge(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Et extends gt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],d=[],f=[];let p=0;const _=[],m=n/2;let g=0;S(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new st(u,3)),this.setAttribute("normal",new st(d,3)),this.setAttribute("uv",new st(f,2));function S(){const v=new b,w=new b;let E=0;const T=(t-e)/n;for(let x=0;x<=s;x++){const R=[],L=x/s,I=L*(t-e)+e;for(let F=0;F<=i;F++){const B=F/i,K=B*l+o,O=Math.sin(K),q=Math.cos(K);w.x=I*O,w.y=-L*n+m,w.z=I*q,u.push(w.x,w.y,w.z),v.set(O,T,q).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-L),R.push(p++)}_.push(R)}for(let x=0;x<i;x++)for(let R=0;R<s;R++){const L=_[R][x],I=_[R+1][x],F=_[R+1][x+1],B=_[R][x+1];(e>0||R!==0)&&(h.push(L,I,B),E+=3),(t>0||R!==s-1)&&(h.push(I,F,B),E+=3)}c.addGroup(g,E,0),g+=E}function M(v){const w=p,E=new Ve,T=new b;let x=0;const R=v===!0?e:t,L=v===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*L,0),d.push(0,L,0),f.push(.5,.5),p++;const I=p;for(let F=0;F<=i;F++){const K=F/i*l+o,O=Math.cos(K),q=Math.sin(K);T.x=R*q,T.y=m*L,T.z=R*O,u.push(T.x,T.y,T.z),d.push(0,L,0),E.x=O*.5+.5,E.y=q*.5*L+.5,f.push(E.x,E.y),p++}for(let F=0;F<i;F++){const B=w+F,K=I+F;v===!0?h.push(K,K+1,B):h.push(K+1,K,B),x+=3}c.addGroup(g,x,v===!0?1:2),g+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Et(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _a extends Et{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new _a(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ta extends gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],a=[];o(i),c(n),h(),this.setAttribute("position",new st(s,3)),this.setAttribute("normal",new st(s.slice(),3)),this.setAttribute("uv",new st(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const M=new b,v=new b,w=new b;for(let E=0;E<t.length;E+=3)f(t[E+0],M),f(t[E+1],v),f(t[E+2],w),l(M,v,w,S)}function l(S,M,v,w){const E=w+1,T=[];for(let x=0;x<=E;x++){T[x]=[];const R=S.clone().lerp(v,x/E),L=M.clone().lerp(v,x/E),I=E-x;for(let F=0;F<=I;F++)F===0&&x===E?T[x][F]=R:T[x][F]=R.clone().lerp(L,F/I)}for(let x=0;x<E;x++)for(let R=0;R<2*(E-x)-1;R++){const L=Math.floor(R/2);R%2===0?(d(T[x][L+1]),d(T[x+1][L]),d(T[x][L])):(d(T[x][L+1]),d(T[x+1][L+1]),d(T[x+1][L]))}}function c(S){const M=new b;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(S),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function h(){const S=new b;for(let M=0;M<s.length;M+=3){S.x=s[M+0],S.y=s[M+1],S.z=s[M+2];const v=m(S)/2/Math.PI+.5,w=g(S)/Math.PI+.5;a.push(v,1-w)}p(),u()}function u(){for(let S=0;S<a.length;S+=6){const M=a[S+0],v=a[S+2],w=a[S+4],E=Math.max(M,v,w),T=Math.min(M,v,w);E>.9&&T<.1&&(M<.2&&(a[S+0]+=1),v<.2&&(a[S+2]+=1),w<.2&&(a[S+4]+=1))}}function d(S){s.push(S.x,S.y,S.z)}function f(S,M){const v=S*3;M.x=e[v+0],M.y=e[v+1],M.z=e[v+2]}function p(){const S=new b,M=new b,v=new b,w=new b,E=new Ve,T=new Ve,x=new Ve;for(let R=0,L=0;R<s.length;R+=9,L+=6){S.set(s[R+0],s[R+1],s[R+2]),M.set(s[R+3],s[R+4],s[R+5]),v.set(s[R+6],s[R+7],s[R+8]),E.set(a[L+0],a[L+1]),T.set(a[L+2],a[L+3]),x.set(a[L+4],a[L+5]),w.copy(S).add(M).add(v).divideScalar(3);const I=m(w);_(E,L+0,S,I),_(T,L+2,M,I),_(x,L+4,v,I)}}function _(S,M,v,w){w<0&&S.x===1&&(a[M]=S.x-1),v.x===0&&v.z===0&&(a[M]=w/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function g(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ta(e.vertices,e.indices,e.radius,e.detail)}}class xs extends Ta{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new xs(e.radius,e.detail)}}class bf{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Pe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new Ve:new b);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new b,i=[],s=[],a=[],o=new b,l=new Se;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new b)}s[0]=new b,a[0]=new b;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(et(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(et(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let p=1;p<=e;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function wf(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=ru(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=Rf(r,e,s,t)),r.length>80*t){o=r[0],l=r[1];let h=o,u=l;for(let d=t;d<i;d+=t){const f=r[d],p=r[d+1];f<o&&(o=f),p<l&&(l=p),f>h&&(h=f),p>u&&(u=p)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Qs(s,a,t,o,l,c,0),a}function ru(r,e,t,n,i){let s;if(i===Vf(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=Hc(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=Hc(a/n|0,r[a],r[a+1],s);return s&&vs(s,s.next)&&(tr(s),s=s.next),s}function ki(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(vs(t,t.next)||Ct(t.prev,t,t.next)===0)){if(tr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Qs(r,e,t,n,i,s,a){if(!r)return;!a&&s&&Ff(r,n,i,s);let o=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?Ef(r,n,i,s):Tf(r)){e.push(l.i,r.i,c.i),tr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=Af(ki(r),e),Qs(r,e,t,n,i,s,2)):a===2&&Cf(r,e,t,n,i,s):Qs(ki(r),e,t,n,i,s,1);break}}}function Tf(r){const e=r.prev,t=r,n=r.next;if(Ct(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,s,a),u=Math.min(o,l,c),d=Math.max(i,s,a),f=Math.max(o,l,c);let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Vs(i,o,s,l,a,c,p.x,p.y)&&Ct(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Ef(r,e,t,n){const i=r.prev,s=r,a=r.next;if(Ct(i,s,a)>=0)return!1;const o=i.x,l=s.x,c=a.x,h=i.y,u=s.y,d=a.y,f=Math.min(o,l,c),p=Math.min(h,u,d),_=Math.max(o,l,c),m=Math.max(h,u,d),g=hl(f,p,e,t,n),S=hl(_,m,e,t,n);let M=r.prevZ,v=r.nextZ;for(;M&&M.z>=g&&v&&v.z<=S;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=m&&M!==i&&M!==a&&Vs(o,h,l,u,c,d,M.x,M.y)&&Ct(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==a&&Vs(o,h,l,u,c,d,v.x,v.y)&&Ct(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=g;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=m&&M!==i&&M!==a&&Vs(o,h,l,u,c,d,M.x,M.y)&&Ct(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=S;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==a&&Vs(o,h,l,u,c,d,v.x,v.y)&&Ct(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Af(r,e){let t=r;do{const n=t.prev,i=t.next.next;!vs(n,i)&&ou(n,t,t.next,i)&&er(n,i)&&er(i,n)&&(e.push(n.i,t.i,i.i),tr(t),tr(t.next),t=r=i),t=t.next}while(t!==r);return ki(t)}function Cf(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Of(a,o)){let l=lu(a,o);a=ki(a,a.next),l=ki(l,l.next),Qs(a,e,t,n,i,s,0),Qs(l,e,t,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function Rf(r,e,t,n){const i=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=ru(r,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Uf(c))}i.sort(Pf);for(let s=0;s<i.length;s++)t=If(i[s],t);return t}function Pf(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){const n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function If(r,e){const t=Lf(r,e);if(!t)return e;const n=lu(t,r);return ki(n,n.next),ki(t,t.next)}function Lf(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;if(vs(r,t))return t;do{if(vs(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>s&&(s=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&au(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);er(t,r)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Df(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Df(r,e){return Ct(r.prev,r,e.prev)<0&&Ct(e.next,r,r.next)<0}function Ff(r,e,t,n){let i=r;do i.z===0&&(i.z=hl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Nf(i)}function Nf(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function hl(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Uf(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function au(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function Vs(r,e,t,n,i,s,a,o){return!(r===a&&e===o)&&au(r,e,t,n,i,s,a,o)}function Of(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!kf(r,e)&&(er(r,e)&&er(e,r)&&Bf(r,e)&&(Ct(r.prev,r,e.prev)||Ct(r,e.prev,e))||vs(r,e)&&Ct(r.prev,r,r.next)>0&&Ct(e.prev,e,e.next)>0)}function Ct(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function vs(r,e){return r.x===e.x&&r.y===e.y}function ou(r,e,t,n){const i=Vr(Ct(r,e,t)),s=Vr(Ct(r,e,n)),a=Vr(Ct(t,n,r)),o=Vr(Ct(t,n,e));return!!(i!==s&&a!==o||i===0&&Br(r,t,e)||s===0&&Br(r,n,e)||a===0&&Br(t,r,n)||o===0&&Br(t,e,n))}function Br(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Vr(r){return r>0?1:r<0?-1:0}function kf(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&ou(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function er(r,e){return Ct(r.prev,r,r.next)<0?Ct(r,e,r.next)>=0&&Ct(r,r.prev,e)>=0:Ct(r,e,r.prev)<0||Ct(r,r.next,e)<0}function Bf(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function lu(r,e){const t=ul(r.i,r.x,r.y),n=ul(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Hc(r,e,t,n){const i=ul(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function tr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function ul(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Vf(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class zf{static triangulate(e,t,n=2){return wf(e,t,n)}}class zl{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return zl.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Wc(e),Xc(n,e);let a=e.length;t.forEach(Wc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Xc(n,t[l]);const o=zf.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Wc(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Xc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class or extends Ta{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new or(e.radius,e.detail)}}class lr extends gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const S=g*d-a;for(let M=0;M<c;M++){const v=M*u-s;p.push(v,-S,0),_.push(0,0,1),m.push(M/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<o;S++){const M=S+c*g,v=S+c*(g+1),w=S+1+c*(g+1),E=S+1+c*g;f.push(M,v,E),f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new st(p,3)),this.setAttribute("normal",new st(_,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lr(e.width,e.height,e.widthSegments,e.heightSegments)}}class cr extends gt{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/i,f=new b,p=new Ve;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){const g=s+m/n*a;f.x=u*Math.cos(g),f.y=u*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,h.push(p.x,p.y)}u+=d}for(let _=0;_<i;_++){const m=_*(n+1);for(let g=0;g<n;g++){const S=g+m,M=S,v=S+n+1,w=S+n+2,E=S+1;o.push(M,v,E),o.push(v,w,E)}}this.setIndex(o),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Yt extends gt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new b,d=new b,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){const S=[],M=g/n,v=a+M*o,w=e*Math.cos(v),E=Math.sqrt(e*e-w*w);let T=0;g===0&&a===0?T=.5/t:g===n&&l===Math.PI&&(T=-.5/t);for(let x=0;x<=t;x++){const R=x/t,L=i+R*s;u.x=-E*Math.cos(L),u.y=w,u.z=E*Math.sin(L),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(R+T,1-M),S.push(c++)}h.push(S)}for(let g=0;g<n;g++)for(let S=0;S<t;S++){const M=h[g][S+1],v=h[g][S],w=h[g+1][S],E=h[g+1][S+1];(g!==0||a>0)&&f.push(M,v,E),(g!==n-1||l<Math.PI)&&f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new st(p,3)),this.setAttribute("normal",new st(_,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ai extends gt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],d=new b,f=new b,p=new b;for(let _=0;_<=n;_++){const m=a+_/n*o;for(let g=0;g<=i;g++){const S=g/i*s;f.x=(e+t*Math.cos(m))*Math.cos(S),f.y=(e+t*Math.cos(m))*Math.sin(S),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(g/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=i;m++){const g=(i+1)*_+m-1,S=(i+1)*(_-1)+m-1,M=(i+1)*(_-1)+m,v=(i+1)*_+m;l.push(g,S,v),l.push(S,M,v)}this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function ys(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if(qc(i))i.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(qc(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function nn(r){const e={};for(let t=0;t<r.length;t++){const n=ys(r[t]);for(const i in n)e[i]=n[i]}return e}function qc(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Gf(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function cu(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}const Hf={clone:ys,merge:nn};var Wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pn extends vn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wf,this.fragmentShader=Xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ys(e.uniforms),this.uniformsGroups=Gf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new _e().setHex(i.value);break;case"v2":this.uniforms[n].value=new Ve().fromArray(i.value);break;case"v3":this.uniforms[n].value=new b().fromArray(i.value);break;case"v4":this.uniforms[n].value=new at().fromArray(i.value);break;case"m3":this.uniforms[n].value=new He().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Se().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class qf extends Pn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Xe extends vn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new _e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zs,this.normalScale=new Ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wn extends Xe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ve(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new _e(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new _e(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new _e(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class zr extends vn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new _e(16777215),this.specular=new _e(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zs,this.normalScale=new Ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.combine=ya,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Yf extends vn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new _e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zs,this.normalScale=new Ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.combine=ya,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Kf extends vn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $f extends vn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Gr(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Zf(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Yc(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Jf(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class bs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class jf extends bs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:as,endingEnd:as}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case os:s=e,o=2*t-n;break;case ua:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case os:a=e,l=2*n-t;break;case ua:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),_=p*p,m=_*p,g=-d*m+2*d*_-d*p,S=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*p+1,M=(-1-f)*m+(1.5+f)*_+.5*p,v=f*m-f*_;for(let w=0;w!==o;++w)s[w]=g*a[h+w]+S*a[c+w]+M*a[l+w]+v*a[u+w];return s}}class hu extends bs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}}class Qf extends bs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class ep extends bs{interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const p=(n-t)/(i-t),_=1-p;for(let m=0;m!==o;++m)s[m]=a[c+m]*_+a[l+m]*p;return s}const d=o*2,f=e-1;for(let p=0;p!==o;++p){const _=a[c+p],m=a[l+p],g=f*d+p*2,S=u[g],M=u[g+1],v=e*d+p*2,w=h[v],E=h[v+1];let T=(n-t)/(i-t),x,R,L,I,F;for(let B=0;B<8;B++){x=T*T,R=x*T,L=1-T,I=L*L,F=I*L;const O=F*t+3*I*T*S+3*L*x*w+R*i-n;if(Math.abs(O)<1e-10)break;const q=3*I*(S-t)+6*L*T*(w-S)+3*x*(i-w);if(Math.abs(q)<1e-10)break;T=T-O/q,T=Math.max(0,Math.min(1,T))}s[p]=F*_+3*I*T*M+3*L*x*E+R*m}return s}}class In{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Gr(t,this.TimeBufferType),this.values=Gr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Gr(e.times,Array),values:Gr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Qf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new hu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new jf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new ep(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ks:t=this.InterpolantFactoryMethodDiscrete;break;case $s:t=this.InterpolantFactoryMethodLinear;break;case La:t=this.InterpolantFactoryMethodSmooth;break;case uc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Pe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ks;case this.InterpolantFactoryMethodLinear:return $s;case this.InterpolantFactoryMethodSmooth:return La;case this.InterpolantFactoryMethodBezier:return uc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Cd(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===La,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){const _=t[u+p];if(_!==t[d+p]||_!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}In.prototype.ValueTypeName="";In.prototype.TimeBufferType=Float32Array;In.prototype.ValueBufferType=Float32Array;In.prototype.DefaultInterpolation=$s;class ws extends In{constructor(e,t,n){super(e,t,n)}}ws.prototype.ValueTypeName="bool";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=Ks;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class uu extends In{constructor(e,t,n,i){super(e,t,n,i)}}uu.prototype.ValueTypeName="color";class Ms extends In{constructor(e,t,n,i){super(e,t,n,i)}}Ms.prototype.ValueTypeName="number";class tp extends bs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Ft.slerpFlat(s,0,a,c-o,a,c,l);return s}}class Bi extends In{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new tp(this.times,this.values,this.getValueSize(),e)}}Bi.prototype.ValueTypeName="quaternion";Bi.prototype.InterpolantFactoryMethodSmooth=void 0;class Ts extends In{constructor(e,t,n){super(e,t,n)}}Ts.prototype.ValueTypeName="string";Ts.prototype.ValueBufferType=Array;Ts.prototype.DefaultInterpolation=Ks;Ts.prototype.InterpolantFactoryMethodLinear=void 0;Ts.prototype.InterpolantFactoryMethodSmooth=void 0;class Ss extends In{constructor(e,t,n,i){super(e,t,n,i)}}Ss.prototype.ValueTypeName="vector";class nr{constructor(e="",t=-1,n=[],i=Il){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(ip(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(In.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Zf(l);l=Yc(l,1,h),c=Yc(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new Ms(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function np(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ms;case"vector":case"vector2":case"vector3":case"vector4":return Ss;case"color":return uu;case"quaternion":return Bi;case"bool":case"boolean":return ws;case"string":return Ts}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function ip(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=np(r.type);if(r.times===void 0){const t=[],n=[];Jf(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Qn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(Kc(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!Kc(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function Kc(r){try{const e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class sp{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const rp=new sp;class ri{constructor(e){this.manager=e!==void 0?e:rp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ri.DEFAULT_MATERIAL_NAME="__DEFAULT";const Zn={};class ap extends Error{constructor(e,t){super(e),this.response=t}}class Gl extends ri{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Qn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Zn[e]!==void 0){Zn[e].push({onLoad:t,onProgress:n,onError:i});return}Zn[e]=[],Zn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Pe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Zn[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let _=0;const m=new ReadableStream({start(g){S();function S(){u.read().then(({done:M,value:v})=>{if(M)g.close();else{_+=v.byteLength;const w=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let E=0,T=h.length;E<T;E++){const x=h[E];x.onProgress&&x.onProgress(w)}g.enqueue(v),S()}},M=>{g.error(M)})}}});return new Response(m)}else throw new ap(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Qn.add(`file:${e}`,c);const h=Zn[e];delete Zn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=Zn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Zn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const es=new WeakMap;class op extends ri{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=es.get(a);u===void 0&&(u=[],es.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=js("img");function l(){h(),t&&t(this);const u=es.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}es.delete(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),Qn.remove(`image:${e}`);const d=es.get(this)||[];for(let f=0;f<d.length;f++){const p=d[f];p.onError&&p.onError(u)}es.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Qn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class du extends ri{constructor(e){super(e)}load(e,t,n,i){const s=new Bt,a=new op(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class hr extends ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new _e(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class lp extends hr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new _e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const so=new Se,$c=new b,Zc=new b;class Hl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ve(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new Se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vl,this._frameExtents=new Ve(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;$c.setFromMatrixPosition(e.matrixWorld),t.position.copy($c),Zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zc),t.updateMatrixWorld(),so.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(so,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Js||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(so)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Hr=new b,Wr=new Ft,Fn=new b;class fu extends ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Se,this.projectionMatrix=new Se,this.projectionMatrixInverse=new Se,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Hr,Wr,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hr,Wr,Fn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Hr,Wr,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hr,Wr,Fn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const mi=new b,Jc=new Ve,jc=new Ve;class jt extends fu{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(Gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mi.x,mi.y).multiplyScalar(-e/mi.z),mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mi.x,mi.y).multiplyScalar(-e/mi.z)}getViewSize(e,t){return this.getViewBounds(e,Jc,jc),t.subVectors(jc,Jc)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Gs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class cp extends Hl{constructor(){super(new jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=gs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class pu extends hr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new cp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class hp extends Hl{constructor(){super(new jt(90,1,.5,500)),this.isPointLightShadow=!0}}class sn extends hr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new hp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ea extends fu{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class up extends Hl{constructor(){super(new Ea(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ir extends hr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.shadow=new up}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Wl extends hr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class ds{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const ro=new WeakMap;class dp extends ri{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Pe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Pe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{ro.has(a)===!0?(i&&i(ro.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){Qn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e)}).catch(function(c){i&&i(c),ro.set(l,c),Qn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Qn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ts=-90,ns=1;class fp extends ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(ts,ns,e,t);i.layers=this.layers,this.add(i);const s=new jt(ts,ns,e,t);s.layers=this.layers,this.add(s);const a=new jt(ts,ns,e,t);a.layers=this.layers,this.add(a);const o=new jt(ts,ns,e,t);o.layers=this.layers,this.add(o);const l=new jt(ts,ns,e,t);l.layers=this.layers,this.add(l);const c=new jt(ts,ns,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Js)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class pp extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class mp{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[s+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Ft.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const a=this._workIndex*s;Ft.multiplyQuaternionsFlat(e,a,e,t,e,n),Ft.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){const a=1-i;for(let o=0;o!==s;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const Xl="\\[\\]\\.:\\/",gp=new RegExp("["+Xl+"]","g"),ql="[^"+Xl+"]",_p="[^"+Xl.replace("\\.","")+"]",xp=/((?:WC+[\/:])*)/.source.replace("WC",ql),vp=/(WCOD+)?/.source.replace("WCOD",_p),yp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ql),Mp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ql),Sp=new RegExp("^"+xp+vp+yp+Mp+"$"),bp=["material","materials","bones","map"];class wp{constructor(e,t,n){const i=n||it.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class it{constructor(e,t,n){this.path=t,this.parsedPath=n||it.parseTrackName(t),this.node=it.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new it.Composite(e,t,n):new it(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(gp,"")}static parseTrackName(e){const t=Sp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);bp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=it.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Pe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}it.Composite=wp;it.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};it.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};it.prototype.GetterByBindingType=[it.prototype._getValue_direct,it.prototype._getValue_array,it.prototype._getValue_arrayElement,it.prototype._getValue_toArray];it.prototype.SetterByBindingTypeAndVersioning=[[it.prototype._setValue_direct,it.prototype._setValue_direct_setNeedsUpdate,it.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[it.prototype._setValue_array,it.prototype._setValue_array_setNeedsUpdate,it.prototype._setValue_array_setMatrixWorldNeedsUpdate],[it.prototype._setValue_arrayElement,it.prototype._setValue_arrayElement_setNeedsUpdate,it.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[it.prototype._setValue_fromArray,it.prototype._setValue_fromArray_setNeedsUpdate,it.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Tp{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,a=s.length,o=new Array(a),l={endingStart:as,endingEnd:as};for(let c=0;c!==a;++c){const h=s[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=md,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,s=e._clip.duration,a=s/i,o=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case _d:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Il:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const a=n===gd;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===ha){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=os,i.endingEnd=os):(e?i.endingStart=this.zeroSlopeAtStart?os:as:i.endingStart=ua,t?i.endingEnd=this.zeroSlopeAtEnd?os:as:i.endingEnd=ua)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=n,this}}const Ep=new Float32Array(1);class Yl extends wi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==s;++u){const d=i[u],f=d.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[u]=p;else{if(p=a[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const _=t&&t._propertyBindings[u].binding.parsedPath;p=new mp(it.create(n,f,_),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[u]=p}o[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new hu(new Float32Array(2),new Float32Array(2),1,Ep),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let a=typeof e=="string"?nr.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Il),l!==void 0){const u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Tp(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?nr.findByName(n,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const Qc=new Se;class sr{constructor(e,t,n=0,i=1/0){this.ray=new ar(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ul,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ke("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Qc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qc),this}intersectObject(e,t=!0,n=[]){return dl(e,this,n,t),n.sort(eh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)dl(e[i],this,n,t);return n.sort(eh),n}}function eh(r,e){return r.distance-e.distance}function dl(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)dl(s[a],e,t,!0)}}const jl=class jl{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};jl.prototype.isMatrix2=!0;let th=jl;const gi=new b,Xr=new Se,ao=new Se;class Ap extends nu{constructor(e){const t=mu(e),n=new gt,i=[],s=[];for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(0,0,0),s.push(0,0,0))}n.setAttribute("position",new st(i,3)),n.setAttribute("color",new st(s,3));const a=new ba({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;const o=new _e(255),l=new _e(65280);this.setColors(o,l)}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");ao.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const o=t[s];o.parent&&o.parent.isBone&&(Xr.multiplyMatrices(ao,o.matrixWorld),gi.setFromMatrixPosition(Xr),i.setXYZ(a,gi.x,gi.y,gi.z),Xr.multiplyMatrices(ao,o.parent.matrixWorld),gi.setFromMatrixPosition(Xr),i.setXYZ(a+1,gi.x,gi.y,gi.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){const i=this.geometry.getAttribute("color");for(let s=0;s<i.count;s+=2)i.setXYZ(s,e.r,e.g,e.b),i.setXYZ(s+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function mu(r){const e=[];r.isBone===!0&&e.push(r);for(let t=0;t<r.children.length;t++)e.push(...mu(r.children[t]));return e}function nh(r,e,t,n){const i=Cp(n);switch(t){case Kh:return r*e;case Al:return r*e/i.components*i.byteLength;case Cl:return r*e/i.components*i.byteLength;case Ui:return r*e*2/i.components*i.byteLength;case Rl:return r*e*2/i.components*i.byteLength;case $h:return r*e*3/i.components*i.byteLength;case xn:return r*e*4/i.components*i.byteLength;case Pl:return r*e*4/i.components*i.byteLength;case ta:case na:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ia:case sa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Io:case Do:return Math.max(r,16)*Math.max(e,8)/4;case Po:case Lo:return Math.max(r,8)*Math.max(e,8)/2;case Fo:case No:case Oo:case ko:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Uo:case la:case Bo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Vo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Go:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case qo:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Ko:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case $o:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Zo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Jo:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case jo:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Qo:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case el:case tl:case nl:return Math.ceil(r/4)*Math.ceil(e/4)*16;case il:case sl:return Math.ceil(r/4)*Math.ceil(e/4)*8;case ca:case rl:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Cp(r){switch(r){case hn:case Wh:return{byteLength:1,components:1};case qs:case Xh:case ii:return{byteLength:2,components:1};case Tl:case El:return{byteLength:2,components:4};case Gn:case wl:case _n:return{byteLength:4,components:1};case qh:case Yh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sl}}));typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function gu(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Rp(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const _=u[f];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ip=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Np=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Up=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Op=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Bp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Wp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$p=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Zp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Jp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,jp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Qp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,em=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,tm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,nm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,im=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,am="gl_FragColor = linearToOutputTexel( gl_FragColor );",om=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,cm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,um=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_m=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ym=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Sm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,bm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Em=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Am=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Cm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Rm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Dm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Om=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Vm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Km=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,$m=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Qm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,eg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ng=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ig=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ag=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ug=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,fg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_g=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,wg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ig=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ng=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ug=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Og=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,kg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Bg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$g=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Jg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,t0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:Pp,alphahash_pars_fragment:Ip,alphamap_fragment:Lp,alphamap_pars_fragment:Dp,alphatest_fragment:Fp,alphatest_pars_fragment:Np,aomap_fragment:Up,aomap_pars_fragment:Op,batching_pars_vertex:kp,batching_vertex:Bp,begin_vertex:Vp,beginnormal_vertex:zp,bsdfs:Gp,iridescence_fragment:Hp,bumpmap_pars_fragment:Wp,clipping_planes_fragment:Xp,clipping_planes_pars_fragment:qp,clipping_planes_pars_vertex:Yp,clipping_planes_vertex:Kp,color_fragment:$p,color_pars_fragment:Zp,color_pars_vertex:Jp,color_vertex:jp,common:Qp,cube_uv_reflection_fragment:em,defaultnormal_vertex:tm,displacementmap_pars_vertex:nm,displacementmap_vertex:im,emissivemap_fragment:sm,emissivemap_pars_fragment:rm,colorspace_fragment:am,colorspace_pars_fragment:om,envmap_fragment:lm,envmap_common_pars_fragment:cm,envmap_pars_fragment:hm,envmap_pars_vertex:um,envmap_physical_pars_fragment:Sm,envmap_vertex:dm,fog_vertex:fm,fog_pars_vertex:pm,fog_fragment:mm,fog_pars_fragment:gm,gradientmap_pars_fragment:_m,lightmap_pars_fragment:xm,lights_lambert_fragment:vm,lights_lambert_pars_fragment:ym,lights_pars_begin:Mm,lights_toon_fragment:bm,lights_toon_pars_fragment:wm,lights_phong_fragment:Tm,lights_phong_pars_fragment:Em,lights_physical_fragment:Am,lights_physical_pars_fragment:Cm,lights_fragment_begin:Rm,lights_fragment_maps:Pm,lights_fragment_end:Im,lightprobes_pars_fragment:Lm,logdepthbuf_fragment:Dm,logdepthbuf_pars_fragment:Fm,logdepthbuf_pars_vertex:Nm,logdepthbuf_vertex:Um,map_fragment:Om,map_pars_fragment:km,map_particle_fragment:Bm,map_particle_pars_fragment:Vm,metalnessmap_fragment:zm,metalnessmap_pars_fragment:Gm,morphinstance_vertex:Hm,morphcolor_vertex:Wm,morphnormal_vertex:Xm,morphtarget_pars_vertex:qm,morphtarget_vertex:Ym,normal_fragment_begin:Km,normal_fragment_maps:$m,normal_pars_fragment:Zm,normal_pars_vertex:Jm,normal_vertex:jm,normalmap_pars_fragment:Qm,clearcoat_normal_fragment_begin:eg,clearcoat_normal_fragment_maps:tg,clearcoat_pars_fragment:ng,iridescence_pars_fragment:ig,opaque_fragment:sg,packing:rg,premultiplied_alpha_fragment:ag,project_vertex:og,dithering_fragment:lg,dithering_pars_fragment:cg,roughnessmap_fragment:hg,roughnessmap_pars_fragment:ug,shadowmap_pars_fragment:dg,shadowmap_pars_vertex:fg,shadowmap_vertex:pg,shadowmask_pars_fragment:mg,skinbase_vertex:gg,skinning_pars_vertex:_g,skinning_vertex:xg,skinnormal_vertex:vg,specularmap_fragment:yg,specularmap_pars_fragment:Mg,tonemapping_fragment:Sg,tonemapping_pars_fragment:bg,transmission_fragment:wg,transmission_pars_fragment:Tg,uv_pars_fragment:Eg,uv_pars_vertex:Ag,uv_vertex:Cg,worldpos_vertex:Rg,background_vert:Pg,background_frag:Ig,backgroundCube_vert:Lg,backgroundCube_frag:Dg,cube_vert:Fg,cube_frag:Ng,depth_vert:Ug,depth_frag:Og,distance_vert:kg,distance_frag:Bg,equirect_vert:Vg,equirect_frag:zg,linedashed_vert:Gg,linedashed_frag:Hg,meshbasic_vert:Wg,meshbasic_frag:Xg,meshlambert_vert:qg,meshlambert_frag:Yg,meshmatcap_vert:Kg,meshmatcap_frag:$g,meshnormal_vert:Zg,meshnormal_frag:Jg,meshphong_vert:jg,meshphong_frag:Qg,meshphysical_vert:e0,meshphysical_frag:t0,meshtoon_vert:n0,meshtoon_frag:i0,points_vert:s0,points_frag:r0,shadow_vert:a0,shadow_frag:o0,sprite_vert:l0,sprite_frag:c0},pe={common:{diffuse:{value:new _e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new b},probesMax:{value:new b},probesResolution:{value:new b}},points:{diffuse:{value:new _e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new _e(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},On={basic:{uniforms:nn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:nn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new _e(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:nn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new _e(0)},specular:{value:new _e(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:nn([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new _e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:nn([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new _e(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:nn([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:nn([pe.points,pe.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:nn([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:nn([pe.common,pe.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:nn([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:nn([pe.sprite,pe.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:nn([pe.common,pe.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:nn([pe.lights,pe.fog,{color:{value:new _e(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};On.physical={uniforms:nn([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new _e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new _e(0)},specularColor:{value:new _e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const qr={r:0,b:0,g:0},h0=new Se,_u=new He;_u.set(-1,0,0,0,1,0,0,0,1);function u0(r,e,t,n,i,s){const a=new _e(0);let o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let M=S.isScene===!0?S.background:null;if(M&&M.isTexture){const v=S.backgroundBlurriness>0;M=e.get(M,v)}return M}function p(S){let M=!1;const v=f(S);v===null?m(a,o):v&&v.isColor&&(m(v,1),M=!0);const w=r.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(S,M){const v=f(M);v&&(v.isCubeTexture||v.mapping===Ma)?(c===void 0&&(c=new j(new Ge(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:ys(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(h0.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_u),c.material.toneMapped=We.getTransfer(v.colorSpace)!==ft,(h!==v||u!==v.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new j(new lr(2,2),new Pn({name:"BackgroundMaterial",uniforms:ys(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=We.getTransfer(v.colorSpace)!==ft,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==r.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,M){S.getRGB(qr,cu(r)),t.buffers.color.setClear(qr.r,qr.g,qr.b,M,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,M=1){a.set(S),o=M,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:p,addToRenderList:_,dispose:g}}function d0(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,a=!1;function o(I,F,B,K,O){let q=!1;const V=u(I,K,B,F);s!==V&&(s=V,c(s.object)),q=f(I,K,B,O),q&&p(I,K,B,O),O!==null&&e.update(O,r.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,v(I,F,B,K),O!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return r.createVertexArray()}function c(I){return r.bindVertexArray(I)}function h(I){return r.deleteVertexArray(I)}function u(I,F,B,K){const O=K.wireframe===!0;let q=n[F.id];q===void 0&&(q={},n[F.id]=q);const V=I.isInstancedMesh===!0?I.id:0;let Q=q[V];Q===void 0&&(Q={},q[V]=Q);let te=Q[B.id];te===void 0&&(te={},Q[B.id]=te);let ue=te[O];return ue===void 0&&(ue=d(l()),te[O]=ue),ue}function d(I){const F=[],B=[],K=[];for(let O=0;O<t;O++)F[O]=0,B[O]=0,K[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:K,object:I,attributes:{},index:null}}function f(I,F,B,K){const O=s.attributes,q=F.attributes;let V=0;const Q=B.getAttributes();for(const te in Q)if(Q[te].location>=0){const me=O[te];let ye=q[te];if(ye===void 0&&(te==="instanceMatrix"&&I.instanceMatrix&&(ye=I.instanceMatrix),te==="instanceColor"&&I.instanceColor&&(ye=I.instanceColor)),me===void 0||me.attribute!==ye||ye&&me.data!==ye.data)return!0;V++}return s.attributesNum!==V||s.index!==K}function p(I,F,B,K){const O={},q=F.attributes;let V=0;const Q=B.getAttributes();for(const te in Q)if(Q[te].location>=0){let me=q[te];me===void 0&&(te==="instanceMatrix"&&I.instanceMatrix&&(me=I.instanceMatrix),te==="instanceColor"&&I.instanceColor&&(me=I.instanceColor));const ye={};ye.attribute=me,me&&me.data&&(ye.data=me.data),O[te]=ye,V++}s.attributes=O,s.attributesNum=V,s.index=K}function _(){const I=s.newAttributes;for(let F=0,B=I.length;F<B;F++)I[F]=0}function m(I){g(I,0)}function g(I,F){const B=s.newAttributes,K=s.enabledAttributes,O=s.attributeDivisors;B[I]=1,K[I]===0&&(r.enableVertexAttribArray(I),K[I]=1),O[I]!==F&&(r.vertexAttribDivisor(I,F),O[I]=F)}function S(){const I=s.newAttributes,F=s.enabledAttributes;for(let B=0,K=F.length;B<K;B++)F[B]!==I[B]&&(r.disableVertexAttribArray(B),F[B]=0)}function M(I,F,B,K,O,q,V){V===!0?r.vertexAttribIPointer(I,F,B,O,q):r.vertexAttribPointer(I,F,B,K,O,q)}function v(I,F,B,K){_();const O=K.attributes,q=B.getAttributes(),V=F.defaultAttributeValues;for(const Q in q){const te=q[Q];if(te.location>=0){let ue=O[Q];if(ue===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(ue=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(ue=I.instanceColor)),ue!==void 0){const me=ue.normalized,ye=ue.itemSize,qe=e.get(ue);if(qe===void 0)continue;const xt=qe.buffer,Fe=qe.type,X=qe.bytesPerElement,re=Fe===r.INT||Fe===r.UNSIGNED_INT||ue.gpuType===wl;if(ue.isInterleavedBufferAttribute){const ne=ue.data,Me=ne.stride,Ee=ue.offset;if(ne.isInstancedInterleavedBuffer){for(let be=0;be<te.locationSize;be++)g(te.location+be,ne.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let be=0;be<te.locationSize;be++)m(te.location+be);r.bindBuffer(r.ARRAY_BUFFER,xt);for(let be=0;be<te.locationSize;be++)M(te.location+be,ye/te.locationSize,Fe,me,Me*X,(Ee+ye/te.locationSize*be)*X,re)}else{if(ue.isInstancedBufferAttribute){for(let ne=0;ne<te.locationSize;ne++)g(te.location+ne,ue.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ne=0;ne<te.locationSize;ne++)m(te.location+ne);r.bindBuffer(r.ARRAY_BUFFER,xt);for(let ne=0;ne<te.locationSize;ne++)M(te.location+ne,ye/te.locationSize,Fe,me,ye*X,ye/te.locationSize*ne*X,re)}}else if(V!==void 0){const me=V[Q];if(me!==void 0)switch(me.length){case 2:r.vertexAttrib2fv(te.location,me);break;case 3:r.vertexAttrib3fv(te.location,me);break;case 4:r.vertexAttrib4fv(te.location,me);break;default:r.vertexAttrib1fv(te.location,me)}}}}S()}function w(){R();for(const I in n){const F=n[I];for(const B in F){const K=F[B];for(const O in K){const q=K[O];for(const V in q)h(q[V].object),delete q[V];delete K[O]}}delete n[I]}}function E(I){if(n[I.id]===void 0)return;const F=n[I.id];for(const B in F){const K=F[B];for(const O in K){const q=K[O];for(const V in q)h(q[V].object),delete q[V];delete K[O]}}delete n[I.id]}function T(I){for(const F in n){const B=n[F];for(const K in B){const O=B[K];if(O[I.id]===void 0)continue;const q=O[I.id];for(const V in q)h(q[V].object),delete q[V];delete O[I.id]}}}function x(I){for(const F in n){const B=n[F],K=I.isInstancedMesh===!0?I.id:0,O=B[K];if(O!==void 0){for(const q in O){const V=O[q];for(const Q in V)h(V[Q].object),delete V[Q];delete O[q]}delete B[K],Object.keys(B).length===0&&delete n[F]}}}function R(){L(),a=!0,s!==i&&(s=i,c(s.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:R,resetDefaultState:L,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function f0(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function p0(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(T){return!(T!==xn&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const x=T===ii&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==hn&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==_n&&!x)}function l(T){if(T==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Pe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),S=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),M=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),w=r.getParameter(r.MAX_SAMPLES),E=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:v,maxSamples:w,samples:E}}function m0(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Ii,o=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=r.get(u);if(!i||p===null||p.length===0||s&&!m)s?h(null):c();else{const S=s?0:n,M=S*4;let v=g.clippingState||null;l.value=v,v=h(p,d,M,f);for(let w=0;w!==M;++w)v[w]=t[w];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=f+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<g)&&(m=new Float32Array(g));for(let M=0,v=f;M!==_;++M,v+=4)a.copy(u[M]).applyMatrix4(S,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const Si=4,ih=[.125,.215,.35,.446,.526,.582],Di=20,g0=256,Ns=new Ea,sh=new _e;let oo=null,lo=0,co=0,ho=!1;const _0=new b;class rh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=_0}=s;oo=this._renderer.getRenderTarget(),lo=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=oh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(oo,lo,co),this._renderer.xr.enabled=ho,e.scissorTest=!1,is(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ni||e.mapping===ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oo=this._renderer.getRenderTarget(),lo=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:ii,format:xn,colorSpace:un,depthBuffer:!1},i=ah(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ah(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=x0(s)),this._blurMaterial=y0(s,e,t),this._ggxMaterial=v0(s,e,t)}return i}_compileMaterial(e){const t=new j(new gt,e);this._renderer.compile(t,Ns)}_sceneToCubeUV(e,t,n,i,s){const l=new jt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(sh),u.toneMapping=Vn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new j(new Ge,new bt({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,g=!0):(m.color.copy(sh),g=!0);for(let M=0;M<6;M++){const v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[M]));const w=this._cubeSize;is(i,v*w,M>2?w:0,w,w),u.setRenderTarget(i),g&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ni||e.mapping===ms;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=lh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=oh());const s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;is(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ns)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-Si?n-p+Si:0),g=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,is(s,m,g,3*_,2*_),i.setRenderTarget(s),i.render(o,Ns),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-n,is(e,m,g,3*_,2*_),i.setRenderTarget(e),i.render(o,Ns)}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ke("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Di-1),_=s/p,m=isFinite(s)?1+Math.floor(h*_):Di;m>Di&&Pe(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Di}`);const g=[];let S=0;for(let T=0;T<Di;++T){const x=T/_,R=Math.exp(-x*x/2);g.push(R),T===0?S+=R:T<m&&(S+=2*R)}for(let T=0;T<g.length;T++)g[T]=g[T]/S;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=p,d.mipInt.value=M-n;const v=this._sizeLods[i],w=3*v*(i>M-Si?i-M+Si:0),E=4*(this._cubeSize-v);is(t,w,E,3*v,2*v),l.setRenderTarget(t),l.render(u,Ns)}}function x0(r){const e=[],t=[],n=[];let i=r;const s=r-Si+1+ih.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>r-Si?l=ih[a-r+Si-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,m=2,g=1,S=new Float32Array(_*p*f),M=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let E=0;E<f;E++){const T=E%3*2/3-1,x=E>2?0:-1,R=[T,x,0,T+2/3,x,0,T+2/3,x+1,0,T,x,0,T+2/3,x+1,0,T,x+1,0];S.set(R,_*p*E),M.set(d,m*p*E);const L=[E,E,E,E,E,E];v.set(L,g*p*E)}const w=new gt;w.setAttribute("position",new ot(S,_)),w.setAttribute("uv",new ot(M,m)),w.setAttribute("faceIndex",new ot(v,g)),n.push(new j(w,null)),i>Si&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ah(r,e,t){const n=new zn(r,e,t);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function is(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function v0(r,e,t){return new Pn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:g0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Aa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function y0(r,e,t){const n=new Float32Array(Di),i=new b(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function oh(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function lh(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function Aa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class xu extends zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new iu(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ge(5,5,5),s=new Pn({name:"CubemapFromEquirect",uniforms:ys(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:ei});s.uniforms.tEquirect.value=t;const a=new j(i,s),o=t.minFilter;return t.minFilter===kn&&(t.minFilter=kt),new fp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}function M0(r){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):s(d)}function s(d){if(d&&d.isTexture){const f=d.mapping;if(f===Qr||f===Ia)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new xu(p.height);return _.fromEquirectangularTexture(r,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Qr||f===Ia,_=f===Ni||f===ms;if(p||_){let m=t.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new rh(r)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const S=d.image;return p&&S&&S.height>0||_&&S&&l(S)?(n===null&&(n=new rh(r)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===Qr?d.mapping=Ni:f===Ia&&(d.mapping=ms),d}function l(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function S0(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&hs("WebGLRenderer: "+n+" extension not supported."),i}}}function b0(r,e,t,n){const i={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete i[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],r.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const S=f.array;_=f.version;for(let M=0,v=S.length;M<v;M+=3){const w=S[M+0],E=S[M+1],T=S[M+2];d.push(w,E,E,T,T,w)}}else{const S=p.array;_=p.version;for(let M=0,v=S.length/3-1;M<v;M+=3){const w=M+0,E=M+1,T=M+2;d.push(w,E,E,T,T,w)}}const m=new(p.count>=65535?eu:Ol)(d,1);m.version=_;const g=s.get(u);g&&e.remove(g),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function w0(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,d){r.drawElements(n,d,s,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(r.drawElementsInstanced(n,d,s,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function T0(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:ke("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function E0(r,e,t){const n=new WeakMap,i=new at;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let L=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",L)};var f=L;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;p===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let w=o.attributes.position.count*v,E=1;w>e.maxTextureSize&&(E=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const T=new Float32Array(w*E*4*u),x=new jh(T,w,E,u);x.type=_n,x.needsUpdate=!0;const R=v*4;for(let I=0;I<u;I++){const F=g[I],B=S[I],K=M[I],O=w*E*4*I;for(let q=0;q<F.count;q++){const V=q*R;p===!0&&(i.fromBufferAttribute(F,q),T[O+V+0]=i.x,T[O+V+1]=i.y,T[O+V+2]=i.z,T[O+V+3]=0),_===!0&&(i.fromBufferAttribute(B,q),T[O+V+4]=i.x,T[O+V+5]=i.y,T[O+V+6]=i.z,T[O+V+7]=0),m===!0&&(i.fromBufferAttribute(K,q),T[O+V+8]=i.x,T[O+V+9]=i.y,T[O+V+10]=i.z,T[O+V+11]=K.itemSize===4?i.w:1)}}d={count:u,texture:x,size:new Ve(w,E)},n.set(o,d),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function A0(r,e,t,n,i){let s=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const C0={[Uh]:"LINEAR_TONE_MAPPING",[Oh]:"REINHARD_TONE_MAPPING",[kh]:"CINEON_TONE_MAPPING",[bl]:"ACES_FILMIC_TONE_MAPPING",[Vh]:"AGX_TONE_MAPPING",[zh]:"NEUTRAL_TONE_MAPPING",[Bh]:"CUSTOM_TONE_MAPPING"};function R0(r,e,t,n,i,s){const a=new zn(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,depthTexture:i?new _s(e,t):void 0}),o=new zn(e,t,{type:ii,depthBuffer:!1,stencilBuffer:!1}),l=new gt;l.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new st([0,2,0,0,2,0],2));const c=new qf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new j(l,c),u=new Ea(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,m=null,g=[],S=!1;this.setSize=function(M,v){a.setSize(M,v),o.setSize(M,v);for(let w=0;w<g.length;w++){const E=g[w];E.setSize&&E.setSize(M,v)}},this.setEffects=function(M){g=M,S=g.length>0&&g[0].isRenderPass===!0;const v=a.width,w=a.height;for(let E=0;E<g.length;E++){const T=g[E];T.setSize&&T.setSize(v,w)}},this.begin=function(M,v){if(p||M.toneMapping===Vn&&g.length===0)return!1;if(m=v,v!==null){const w=v.width,E=v.height;(a.width!==w||a.height!==E)&&this.setSize(w,E)}return S===!1&&M.setRenderTarget(a),_=M.toneMapping,M.toneMapping=Vn,!0},this.hasRenderPass=function(){return S},this.end=function(M,v){M.toneMapping=_,p=!0;let w=a,E=o;for(let T=0;T<g.length;T++){const x=g[T];if(x.enabled!==!1&&(x.render(M,E,w,v),x.needsSwap!==!1)){const R=w;w=E,E=R}}if(d!==M.outputColorSpace||f!==M.toneMapping){d=M.outputColorSpace,f=M.toneMapping,c.defines={},We.getTransfer(d)===ft&&(c.defines.SRGB_TRANSFER="");const T=C0[f];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,M.setRenderTarget(m),M.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const vu=new Bt,fl=new _s(1,1),yu=new jh,Mu=new Qd,Su=new iu,ch=[],hh=[],uh=new Float32Array(16),dh=new Float32Array(9),fh=new Float32Array(4);function Es(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=ch[i];if(s===void 0&&(s=new Float32Array(i),ch[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function zt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Gt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Ca(r,e){let t=hh[e];t===void 0&&(t=new Int32Array(e),hh[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function P0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function I0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2fv(this.addr,e),Gt(t,e)}}function L0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;r.uniform3fv(this.addr,e),Gt(t,e)}}function D0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4fv(this.addr,e),Gt(t,e)}}function F0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(zt(t,n))return;fh.set(n),r.uniformMatrix2fv(this.addr,!1,fh),Gt(t,n)}}function N0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(zt(t,n))return;dh.set(n),r.uniformMatrix3fv(this.addr,!1,dh),Gt(t,n)}}function U0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(zt(t,n))return;uh.set(n),r.uniformMatrix4fv(this.addr,!1,uh),Gt(t,n)}}function O0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function k0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2iv(this.addr,e),Gt(t,e)}}function B0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;r.uniform3iv(this.addr,e),Gt(t,e)}}function V0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4iv(this.addr,e),Gt(t,e)}}function z0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function G0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2uiv(this.addr,e),Gt(t,e)}}function H0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;r.uniform3uiv(this.addr,e),Gt(t,e)}}function W0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4uiv(this.addr,e),Gt(t,e)}}function X0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(fl.compareFunction=t.isReversedDepthBuffer()?Dl:Ll,s=fl):s=vu,t.setTexture2D(e||s,i)}function q0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Mu,i)}function Y0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Su,i)}function K0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||yu,i)}function $0(r){switch(r){case 5126:return P0;case 35664:return I0;case 35665:return L0;case 35666:return D0;case 35674:return F0;case 35675:return N0;case 35676:return U0;case 5124:case 35670:return O0;case 35667:case 35671:return k0;case 35668:case 35672:return B0;case 35669:case 35673:return V0;case 5125:return z0;case 36294:return G0;case 36295:return H0;case 36296:return W0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return K0}}function Z0(r,e){r.uniform1fv(this.addr,e)}function J0(r,e){const t=Es(e,this.size,2);r.uniform2fv(this.addr,t)}function j0(r,e){const t=Es(e,this.size,3);r.uniform3fv(this.addr,t)}function Q0(r,e){const t=Es(e,this.size,4);r.uniform4fv(this.addr,t)}function e_(r,e){const t=Es(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function t_(r,e){const t=Es(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function n_(r,e){const t=Es(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function i_(r,e){r.uniform1iv(this.addr,e)}function s_(r,e){r.uniform2iv(this.addr,e)}function r_(r,e){r.uniform3iv(this.addr,e)}function a_(r,e){r.uniform4iv(this.addr,e)}function o_(r,e){r.uniform1uiv(this.addr,e)}function l_(r,e){r.uniform2uiv(this.addr,e)}function c_(r,e){r.uniform3uiv(this.addr,e)}function h_(r,e){r.uniform4uiv(this.addr,e)}function u_(r,e,t){const n=this.cache,i=e.length,s=Ca(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=fl:a=vu;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function d_(r,e,t){const n=this.cache,i=e.length,s=Ca(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Mu,s[a])}function f_(r,e,t){const n=this.cache,i=e.length,s=Ca(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Su,s[a])}function p_(r,e,t){const n=this.cache,i=e.length,s=Ca(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||yu,s[a])}function m_(r){switch(r){case 5126:return Z0;case 35664:return J0;case 35665:return j0;case 35666:return Q0;case 35674:return e_;case 35675:return t_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return r_;case 35669:case 35673:return a_;case 5125:return o_;case 36294:return l_;case 36295:return c_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return d_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return p_}}class g_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=$0(t.type)}}class __{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=m_(t.type)}}class x_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const uo=/(\w+)(\])?(\[|\.)?/g;function ph(r,e){r.seq.push(e),r.map[e.id]=e}function v_(r,e,t){const n=r.name,i=n.length;for(uo.lastIndex=0;;){const s=uo.exec(n),a=uo.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){ph(t,c===void 0?new g_(o,r,e):new __(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new x_(o),ph(t,u)),t=u}}}class aa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);v_(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function mh(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const y_=37297;let M_=0;function S_(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const gh=new He;function b_(r){We._getMatrix(gh,We.workingColorSpace,r);const e=`mat3( ${gh.elements.map(t=>t.toFixed(4))} )`;switch(We.getTransfer(r)){case da:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function _h(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+S_(r.getShaderSource(e),o)}else return s}function w_(r,e){const t=b_(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const T_={[Uh]:"Linear",[Oh]:"Reinhard",[kh]:"Cineon",[bl]:"ACESFilmic",[Vh]:"AgX",[zh]:"Neutral",[Bh]:"Custom"};function E_(r,e){const t=T_[e];return t===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Yr=new b;function A_(){We.getLuminanceCoefficients(Yr);const r=Yr.x.toFixed(4),e=Yr.y.toFixed(4),t=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function C_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zs).join(`
`)}function R_(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function P_(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function zs(r){return r!==""}function xh(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vh(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const I_=/^[ \t]*#include +<([\w\d./]+)>/gm;function pl(r){return r.replace(I_,D_)}const L_=new Map;function D_(r,e){let t=je[e];if(t===void 0){const n=L_.get(e);if(n!==void 0)t=je[n],Pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return pl(t)}const F_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yh(r){return r.replace(F_,N_)}function N_(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Mh(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const U_={[jr]:"SHADOWMAP_TYPE_PCF",[ks]:"SHADOWMAP_TYPE_VSM"};function O_(r){return U_[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const k_={[Ni]:"ENVMAP_TYPE_CUBE",[ms]:"ENVMAP_TYPE_CUBE",[Ma]:"ENVMAP_TYPE_CUBE_UV"};function B_(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":k_[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const V_={[ms]:"ENVMAP_MODE_REFRACTION"};function z_(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":V_[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const G_={[ya]:"ENVMAP_BLENDING_MULTIPLY",[dd]:"ENVMAP_BLENDING_MIX",[fd]:"ENVMAP_BLENDING_ADD"};function H_(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":G_[r.combine]||"ENVMAP_BLENDING_NONE"}function W_(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function X_(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=O_(t),c=B_(t),h=z_(t),u=H_(t),d=W_(t),f=C_(t),p=R_(s),_=i.createProgram();let m,g,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(zs).join(`
`),g.length>0&&(g+=`
`)):(m=[Mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zs).join(`
`),g=[Mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?je.tonemapping_pars_fragment:"",t.toneMapping!==Vn?E_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,w_("linearToOutputTexel",t.outputColorSpace),A_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(zs).join(`
`)),a=pl(a),a=xh(a,t),a=vh(a,t),o=pl(o),o=xh(o,t),o=vh(o,t),a=yh(a),o=yh(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const M=S+m+a,v=S+g+o,w=mh(i,i.VERTEX_SHADER,M),E=mh(i,i.FRAGMENT_SHADER,v);i.attachShader(_,w),i.attachShader(_,E),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(I){if(r.debug.checkShaderErrors){const F=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(w)||"",K=i.getShaderInfoLog(E)||"",O=F.trim(),q=B.trim(),V=K.trim();let Q=!0,te=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,w,E);else{const ue=_h(i,w,"vertex"),me=_h(i,E,"fragment");ke("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+O+`
`+ue+`
`+me)}else O!==""?Pe("WebGLProgram: Program Info Log:",O):(q===""||V==="")&&(te=!1);te&&(I.diagnostics={runnable:Q,programLog:O,vertexShader:{log:q,prefix:m},fragmentShader:{log:V,prefix:g}})}i.deleteShader(w),i.deleteShader(E),x=new aa(i,_),R=P_(i,_)}let x;this.getUniforms=function(){return x===void 0&&T(this),x};let R;this.getAttributes=function(){return R===void 0&&T(this),R};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(_,y_)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=M_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=E,this}let q_=0;class Y_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new K_(e),t.set(e,n)),n}}class K_{constructor(e){this.id=q_++,this.code=e,this.usedTimes=0}}function $_(r){return r===Ui||r===la||r===ca}function Z_(r,e,t,n,i,s){const a=new Ul,o=new Y_,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,R,L,I,F,B){const K=I.fog,O=F.geometry,q=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Q=e.get(x.envMap||q,V),te=Q&&Q.mapping===Ma?Q.image.height:null,ue=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Pe("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const me=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ye=me!==void 0?me.length:0;let qe=0;O.morphAttributes.position!==void 0&&(qe=1),O.morphAttributes.normal!==void 0&&(qe=2),O.morphAttributes.color!==void 0&&(qe=3);let xt,Fe,X,re;if(ue){const fe=On[ue];xt=fe.vertexShader,Fe=fe.fragmentShader}else{xt=x.vertexShader,Fe=x.fragmentShader;const fe=o.getVertexShaderStage(x),Ke=o.getFragmentShaderStage(x);o.update(x,fe,Ke),X=fe.id,re=Ke.id}const ne=r.getRenderTarget(),Me=r.state.buffers.depth.getReversed(),Ee=F.isInstancedMesh===!0,be=F.isBatchedMesh===!0,Je=!!x.map,Ie=!!x.matcap,Ye=!!Q,Ue=!!x.aoMap,Oe=!!x.lightMap,nt=!!x.bumpMap&&x.wireframe===!1,ut=!!x.normalMap,vt=!!x.displacementMap,Tt=!!x.emissiveMap,yt=!!x.metalnessMap,Rt=!!x.roughnessMap,N=x.anisotropy>0,Wt=x.clearcoat>0,ct=x.dispersion>0,P=x.iridescence>0,y=x.sheen>0,k=x.transmission>0,H=N&&!!x.anisotropyMap,Y=Wt&&!!x.clearcoatMap,ae=Wt&&!!x.clearcoatNormalMap,ce=Wt&&!!x.clearcoatRoughnessMap,$=P&&!!x.iridescenceMap,J=P&&!!x.iridescenceThicknessMap,oe=y&&!!x.sheenColorMap,Ae=y&&!!x.sheenRoughnessMap,de=!!x.specularMap,ie=!!x.specularColorMap,Ce=!!x.specularIntensityMap,Ne=k&&!!x.transmissionMap,ze=k&&!!x.thicknessMap,D=!!x.gradientMap,se=!!x.alphaMap,Z=x.alphaTest>0,le=!!x.alphaHash,he=!!x.extensions;let ee=Vn;x.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ee=r.toneMapping);const xe={shaderID:ue,shaderType:x.type,shaderName:x.name,vertexShader:xt,fragmentShader:Fe,defines:x.defines,customVertexShaderID:X,customFragmentShaderID:re,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:be,batchingColor:be&&F._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&F.instanceColor!==null,instancingMorph:Ee&&F.morphTexture!==null,outputColorSpace:ne===null?r.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:We.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Je,matcap:Ie,envMap:Ye,envMapMode:Ye&&Q.mapping,envMapCubeUVHeight:te,aoMap:Ue,lightMap:Oe,bumpMap:nt,normalMap:ut,displacementMap:vt,emissiveMap:Tt,normalMapObjectSpace:ut&&x.normalMapType===yd,normalMapTangentSpace:ut&&x.normalMapType===Zs,packedNormalMap:ut&&x.normalMapType===Zs&&$_(x.normalMap.format),metalnessMap:yt,roughnessMap:Rt,anisotropy:N,anisotropyMap:H,clearcoat:Wt,clearcoatMap:Y,clearcoatNormalMap:ae,clearcoatRoughnessMap:ce,dispersion:ct,iridescence:P,iridescenceMap:$,iridescenceThicknessMap:J,sheen:y,sheenColorMap:oe,sheenRoughnessMap:Ae,specularMap:de,specularColorMap:ie,specularIntensityMap:Ce,transmission:k,transmissionMap:Ne,thicknessMap:ze,gradientMap:D,opaque:x.transparent===!1&&x.blending===cs&&x.alphaToCoverage===!1,alphaMap:se,alphaTest:Z,alphaHash:le,combine:x.combine,mapUv:Je&&p(x.map.channel),aoMapUv:Ue&&p(x.aoMap.channel),lightMapUv:Oe&&p(x.lightMap.channel),bumpMapUv:nt&&p(x.bumpMap.channel),normalMapUv:ut&&p(x.normalMap.channel),displacementMapUv:vt&&p(x.displacementMap.channel),emissiveMapUv:Tt&&p(x.emissiveMap.channel),metalnessMapUv:yt&&p(x.metalnessMap.channel),roughnessMapUv:Rt&&p(x.roughnessMap.channel),anisotropyMapUv:H&&p(x.anisotropyMap.channel),clearcoatMapUv:Y&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:ae&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:J&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:oe&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&p(x.sheenRoughnessMap.channel),specularMapUv:de&&p(x.specularMap.channel),specularColorMapUv:ie&&p(x.specularColorMap.channel),specularIntensityMapUv:Ce&&p(x.specularIntensityMap.channel),transmissionMapUv:Ne&&p(x.transmissionMap.channel),thicknessMapUv:ze&&p(x.thicknessMap.channel),alphaMapUv:se&&p(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ut||N),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!O.attributes.uv&&(Je||se),fog:!!K,useFog:x.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&ut===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:qe,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:r.shadowMap.enabled&&L.length>0,shadowMapType:r.shadowMap.type,toneMapping:ee,decodeVideoTexture:Je&&x.map.isVideoTexture===!0&&We.getTransfer(x.map.colorSpace)===ft,decodeVideoTextureEmissive:Tt&&x.emissiveMap.isVideoTexture===!0&&We.getTransfer(x.emissiveMap.colorSpace)===ft,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Qt,flipSided:x.side===en,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:he&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(he&&x.extensions.multiDraw===!0||be)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return xe.vertexUv1s=l.has(1),xe.vertexUv2s=l.has(2),xe.vertexUv3s=l.has(3),l.clear(),xe}function m(x){const R=[];if(x.shaderID?R.push(x.shaderID):(R.push(x.customVertexShaderID),R.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)R.push(L),R.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(g(R,x),S(R,x),R.push(r.outputColorSpace)),R.push(x.customProgramCacheKey),R.join()}function g(x,R){x.push(R.precision),x.push(R.outputColorSpace),x.push(R.envMapMode),x.push(R.envMapCubeUVHeight),x.push(R.mapUv),x.push(R.alphaMapUv),x.push(R.lightMapUv),x.push(R.aoMapUv),x.push(R.bumpMapUv),x.push(R.normalMapUv),x.push(R.displacementMapUv),x.push(R.emissiveMapUv),x.push(R.metalnessMapUv),x.push(R.roughnessMapUv),x.push(R.anisotropyMapUv),x.push(R.clearcoatMapUv),x.push(R.clearcoatNormalMapUv),x.push(R.clearcoatRoughnessMapUv),x.push(R.iridescenceMapUv),x.push(R.iridescenceThicknessMapUv),x.push(R.sheenColorMapUv),x.push(R.sheenRoughnessMapUv),x.push(R.specularMapUv),x.push(R.specularColorMapUv),x.push(R.specularIntensityMapUv),x.push(R.transmissionMapUv),x.push(R.thicknessMapUv),x.push(R.combine),x.push(R.fogExp2),x.push(R.sizeAttenuation),x.push(R.morphTargetsCount),x.push(R.morphAttributeCount),x.push(R.numDirLights),x.push(R.numPointLights),x.push(R.numSpotLights),x.push(R.numSpotLightMaps),x.push(R.numHemiLights),x.push(R.numRectAreaLights),x.push(R.numDirLightShadows),x.push(R.numPointLightShadows),x.push(R.numSpotLightShadows),x.push(R.numSpotLightShadowsWithMaps),x.push(R.numLightProbes),x.push(R.shadowMapType),x.push(R.toneMapping),x.push(R.numClippingPlanes),x.push(R.numClipIntersection),x.push(R.depthPacking)}function S(x,R){a.disableAll(),R.instancing&&a.enable(0),R.instancingColor&&a.enable(1),R.instancingMorph&&a.enable(2),R.matcap&&a.enable(3),R.envMap&&a.enable(4),R.normalMapObjectSpace&&a.enable(5),R.normalMapTangentSpace&&a.enable(6),R.clearcoat&&a.enable(7),R.iridescence&&a.enable(8),R.alphaTest&&a.enable(9),R.vertexColors&&a.enable(10),R.vertexAlphas&&a.enable(11),R.vertexUv1s&&a.enable(12),R.vertexUv2s&&a.enable(13),R.vertexUv3s&&a.enable(14),R.vertexTangents&&a.enable(15),R.anisotropy&&a.enable(16),R.alphaHash&&a.enable(17),R.batching&&a.enable(18),R.dispersion&&a.enable(19),R.batchingColor&&a.enable(20),R.gradientMap&&a.enable(21),R.packedNormalMap&&a.enable(22),R.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.reversedDepthBuffer&&a.enable(4),R.skinning&&a.enable(5),R.morphTargets&&a.enable(6),R.morphNormals&&a.enable(7),R.morphColors&&a.enable(8),R.premultipliedAlpha&&a.enable(9),R.shadowMapEnabled&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),R.decodeVideoTextureEmissive&&a.enable(20),R.alphaToCoverage&&a.enable(21),R.numLightProbeGrids>0&&a.enable(22),R.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function M(x){const R=f[x.type];let L;if(R){const I=On[R];L=Hf.clone(I.uniforms)}else L=x.uniforms;return L}function v(x,R){let L=h.get(R);return L!==void 0?++L.usedTimes:(L=new X_(r,R,x,i),c.push(L),h.set(R,L)),L}function w(x){if(--x.usedTimes===0){const R=c.indexOf(x);c[R]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function T(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:M,acquireProgram:v,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:T}}function J_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function j_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Sh(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function bh(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,m,g){let S=r[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},r[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=p,S.materialVariant=a(d),S.groupOrder=_,S.renderOrder=d.renderOrder,S.z=m,S.group=g),e++,S}function l(d,f,p,_,m,g){const S=o(d,f,p,_,m,g);p.transmission>0?n.push(S):p.transparent===!0?i.push(S):t.push(S)}function c(d,f,p,_,m,g){const S=o(d,f,p,_,m,g);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):t.unshift(S)}function h(d,f,p){t.length>1&&t.sort(d||j_),n.length>1&&n.sort(f||Sh),i.length>1&&i.sort(f||Sh),p&&(t.reverse(),n.reverse(),i.reverse())}function u(){for(let d=e,f=r.length;d<f;d++){const p=r[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:h}}function Q_(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new bh,r.set(n,[a])):i>=s.length?(a=new bh,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function ex(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new b,color:new _e};break;case"SpotLight":t={position:new b,direction:new b,color:new _e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new b,color:new _e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new b,skyColor:new _e,groundColor:new _e};break;case"RectAreaLight":t={color:new _e,position:new b,halfWidth:new b,halfHeight:new b};break}return r[e.id]=t,t}}}function tx(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let nx=0;function ix(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function sx(r){const e=new ex,t=tx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new b);const i=new b,s=new Se,a=new Se;function o(c){let h=0,u=0,d=0;for(let R=0;R<9;R++)n.probe[R].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,S=0,M=0,v=0,w=0,E=0,T=0;c.sort(ix);for(let R=0,L=c.length;R<L;R++){const I=c[R],F=I.color,B=I.intensity,K=I.distance;let O=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===Ui?O=I.shadow.map.texture:O=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=F.r*B,u+=F.g*B,d+=F.b*B;else if(I.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(I.sh.coefficients[q],B);T++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const V=I.shadow,Q=t.get(I);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,n.directionalShadow[f]=Q,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=I.shadow.matrix,S++}n.directional[f]=q,f++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(F).multiplyScalar(B),q.distance=K,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,n.spot[_]=q;const V=I.shadow;if(I.map&&(n.spotLightMap[w]=I.map,w++,V.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[_]=V.matrix,I.castShadow){const Q=t.get(I);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,n.spotShadow[_]=Q,n.spotShadowMap[_]=O,v++}_++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(F).multiplyScalar(B),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=q,m++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity),q.distance=I.distance,q.decay=I.decay,I.castShadow){const V=I.shadow,Q=t.get(I);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,Q.shadowCameraNear=V.camera.near,Q.shadowCameraFar=V.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=I.shadow.matrix,M++}n.point[p]=q,p++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(B),q.groundColor.copy(I.groundColor).multiplyScalar(B),n.hemi[g]=q,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==f||x.pointLength!==p||x.spotLength!==_||x.rectAreaLength!==m||x.hemiLength!==g||x.numDirectionalShadows!==S||x.numPointShadows!==M||x.numSpotShadows!==v||x.numSpotMaps!==w||x.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=v+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=T,x.directionalLength=f,x.pointLength=p,x.spotLength=_,x.rectAreaLength=m,x.hemiLength=g,x.numDirectionalShadows=S,x.numPointShadows=M,x.numSpotShadows=v,x.numSpotMaps=w,x.numLightProbes=T,n.version=nx++)}function l(c,h){let u=0,d=0,f=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,S=c.length;g<S;g++){const M=c[g];if(M.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(M.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const v=n.rectArea[p];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(M.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(M.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function wh(r){const e=new sx(r),t=[],n=[],i=[];function s(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function rx(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new wh(r),e.set(i,[o])):s>=a.length?(o=new wh(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const ax=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ox=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,lx=[new b(1,0,0),new b(-1,0,0),new b(0,1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1)],cx=[new b(0,-1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1),new b(0,-1,0),new b(0,-1,0)],Th=new Se,Us=new b,fo=new b;function hx(r,e,t){let n=new Vl;const i=new Ve,s=new Ve,a=new at,o=new Kf,l=new $f,c={},h=t.maxTextureSize,u={[ni]:en,[en]:ni,[Qt]:Qt},d=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:ax,fragmentShader:ox}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new gt;p.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new j(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jr;let g=this.type;this.render=function(E,T,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Nh&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=jr);const R=r.getRenderTarget(),L=r.getActiveCubeFace(),I=r.getActiveMipmapLevel(),F=r.state;F.setBlending(ei),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const B=g!==this.type;B&&T.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(O=>O.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,O=E.length;K<O;K++){const q=E[K],V=q.shadow;if(V===void 0){Pe("WebGLShadowMap:",q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const Q=V.getFrameExtents();i.multiply(Q),s.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/Q.x),i.x=s.x*Q.x,V.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/Q.y),i.y=s.y*Q.y,V.mapSize.y=s.y));const te=r.state.buffers.depth.getReversed();if(V.camera._reversedDepth=te,V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===ks){if(q.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new zn(i.x,i.y,{format:Ui,type:ii,minFilter:kt,magFilter:kt,generateMipmaps:!1}),V.map.texture.name=q.name+".shadowMap",V.map.depthTexture=new _s(i.x,i.y,_n),V.map.depthTexture.name=q.name+".shadowMapDepth",V.map.depthTexture.format=si,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt}else q.isPointLight?(V.map=new xu(i.x),V.map.depthTexture=new Sf(i.x,Gn)):(V.map=new zn(i.x,i.y),V.map.depthTexture=new _s(i.x,i.y,Gn)),V.map.depthTexture.name=q.name+".shadowMap",V.map.depthTexture.format=si,this.type===jr?(V.map.depthTexture.compareFunction=te?Dl:Ll,V.map.depthTexture.minFilter=kt,V.map.depthTexture.magFilter=kt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt);V.camera.updateProjectionMatrix()}const ue=V.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<ue;me++){if(V.map.isWebGLCubeRenderTarget)r.setRenderTarget(V.map,me),r.clear();else{me===0&&(r.setRenderTarget(V.map),r.clear());const ye=V.getViewport(me);a.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),F.viewport(a)}if(q.isPointLight){const ye=V.camera,qe=V.matrix,xt=q.distance||ye.far;xt!==ye.far&&(ye.far=xt,ye.updateProjectionMatrix()),Us.setFromMatrixPosition(q.matrixWorld),ye.position.copy(Us),fo.copy(ye.position),fo.add(lx[me]),ye.up.copy(cx[me]),ye.lookAt(fo),ye.updateMatrixWorld(),qe.makeTranslation(-Us.x,-Us.y,-Us.z),Th.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Th,ye.coordinateSystem,ye.reversedDepth)}else V.updateMatrices(q);n=V.getFrustum(),v(T,x,V.camera,q,this.type)}V.isPointLightShadow!==!0&&this.type===ks&&S(V,x),V.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(R,L,I)};function S(E,T){const x=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new zn(i.x,i.y,{format:Ui,type:ii})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(T,null,x,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(T,null,x,f,_,null)}function M(E,T,x,R){let L=null;const I=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)L=I;else if(L=x.isPointLight===!0?l:o,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const F=L.uuid,B=T.uuid;let K=c[F];K===void 0&&(K={},c[F]=K);let O=K[B];O===void 0&&(O=L.clone(),K[B]=O,T.addEventListener("dispose",w)),L=O}if(L.visible=T.visible,L.wireframe=T.wireframe,R===ks?L.side=T.shadowSide!==null?T.shadowSide:T.side:L.side=T.shadowSide!==null?T.shadowSide:u[T.side],L.alphaMap=T.alphaMap,L.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,L.map=T.map,L.clipShadows=T.clipShadows,L.clippingPlanes=T.clippingPlanes,L.clipIntersection=T.clipIntersection,L.displacementMap=T.displacementMap,L.displacementScale=T.displacementScale,L.displacementBias=T.displacementBias,L.wireframeLinewidth=T.wireframeLinewidth,L.linewidth=T.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const F=r.properties.get(L);F.light=x}return L}function v(E,T,x,R,L){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===ks)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);const B=e.update(E),K=E.material;if(Array.isArray(K)){const O=B.groups;for(let q=0,V=O.length;q<V;q++){const Q=O[q],te=K[Q.materialIndex];if(te&&te.visible){const ue=M(E,te,R,L);E.onBeforeShadow(r,E,T,x,B,ue,Q),r.renderBufferDirect(x,null,B,ue,E,Q),E.onAfterShadow(r,E,T,x,B,ue,Q)}}}else if(K.visible){const O=M(E,K,R,L);E.onBeforeShadow(r,E,T,x,B,O,null),r.renderBufferDirect(x,null,B,O,E,null),E.onAfterShadow(r,E,T,x,B,O,null)}}const F=E.children;for(let B=0,K=F.length;B<K;B++)v(F[B],T,x,R,L)}function w(E){E.target.removeEventListener("dispose",w);for(const x in c){const R=c[x],L=E.target.uuid;L in R&&(R[L].dispose(),delete R[L])}}}function ux(r,e){function t(){let D=!1;const se=new at;let Z=null;const le=new at(0,0,0,0);return{setMask:function(he){Z!==he&&!D&&(r.colorMask(he,he,he,he),Z=he)},setLocked:function(he){D=he},setClear:function(he,ee,xe,fe,Ke){Ke===!0&&(he*=fe,ee*=fe,xe*=fe),se.set(he,ee,xe,fe),le.equals(se)===!1&&(r.clearColor(he,ee,xe,fe),le.copy(se))},reset:function(){D=!1,Z=null,le.set(-1,0,0,0)}}}function n(){let D=!1,se=!1,Z=null,le=null,he=null;return{setReversed:function(ee){if(se!==ee){const xe=e.get("EXT_clip_control");ee?xe.clipControlEXT(xe.LOWER_LEFT_EXT,xe.ZERO_TO_ONE_EXT):xe.clipControlEXT(xe.LOWER_LEFT_EXT,xe.NEGATIVE_ONE_TO_ONE_EXT),se=ee;const fe=he;he=null,this.setClear(fe)}},getReversed:function(){return se},setTest:function(ee){ee?ne(r.DEPTH_TEST):Me(r.DEPTH_TEST)},setMask:function(ee){Z!==ee&&!D&&(r.depthMask(ee),Z=ee)},setFunc:function(ee){if(se&&(ee=Id[ee]),le!==ee){switch(ee){case bo:r.depthFunc(r.NEVER);break;case wo:r.depthFunc(r.ALWAYS);break;case To:r.depthFunc(r.LESS);break;case ps:r.depthFunc(r.LEQUAL);break;case Eo:r.depthFunc(r.EQUAL);break;case Ao:r.depthFunc(r.GEQUAL);break;case Co:r.depthFunc(r.GREATER);break;case Ro:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}le=ee}},setLocked:function(ee){D=ee},setClear:function(ee){he!==ee&&(he=ee,se&&(ee=1-ee),r.clearDepth(ee))},reset:function(){D=!1,Z=null,le=null,he=null,se=!1}}}function i(){let D=!1,se=null,Z=null,le=null,he=null,ee=null,xe=null,fe=null,Ke=null;return{setTest:function(Be){D||(Be?ne(r.STENCIL_TEST):Me(r.STENCIL_TEST))},setMask:function(Be){se!==Be&&!D&&(r.stencilMask(Be),se=Be)},setFunc:function(Be,Ut,yn){(Z!==Be||le!==Ut||he!==yn)&&(r.stencilFunc(Be,Ut,yn),Z=Be,le=Ut,he=yn)},setOp:function(Be,Ut,yn){(ee!==Be||xe!==Ut||fe!==yn)&&(r.stencilOp(Be,Ut,yn),ee=Be,xe=Ut,fe=yn)},setLocked:function(Be){D=Be},setClear:function(Be){Ke!==Be&&(r.clearStencil(Be),Ke=Be)},reset:function(){D=!1,se=null,Z=null,le=null,he=null,ee=null,xe=null,fe=null,Ke=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,S=null,M=null,v=null,w=null,E=null,T=null,x=new _e(0,0,0),R=0,L=!1,I=null,F=null,B=null,K=null,O=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,Q=0;const te=r.getParameter(r.VERSION);te.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(te)[1]),V=Q>=1):te.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),V=Q>=2);let ue=null,me={};const ye=r.getParameter(r.SCISSOR_BOX),qe=r.getParameter(r.VIEWPORT),xt=new at().fromArray(ye),Fe=new at().fromArray(qe);function X(D,se,Z,le){const he=new Uint8Array(4),ee=r.createTexture();r.bindTexture(D,ee),r.texParameteri(D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(D,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let xe=0;xe<Z;xe++)D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY?r.texImage3D(se,0,r.RGBA,1,1,le,0,r.RGBA,r.UNSIGNED_BYTE,he):r.texImage2D(se+xe,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,he);return ee}const re={};re[r.TEXTURE_2D]=X(r.TEXTURE_2D,r.TEXTURE_2D,1),re[r.TEXTURE_CUBE_MAP]=X(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[r.TEXTURE_2D_ARRAY]=X(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),re[r.TEXTURE_3D]=X(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(r.DEPTH_TEST),a.setFunc(ps),nt(!1),ut(oc),ne(r.CULL_FACE),Ue(ei);function ne(D){h[D]!==!0&&(r.enable(D),h[D]=!0)}function Me(D){h[D]!==!1&&(r.disable(D),h[D]=!1)}function Ee(D,se){return d[D]!==se?(r.bindFramebuffer(D,se),d[D]=se,D===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=se),D===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=se),!0):!1}function be(D,se){let Z=p,le=!1;if(D){Z=f.get(se),Z===void 0&&(Z=[],f.set(se,Z));const he=D.textures;if(Z.length!==he.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let ee=0,xe=he.length;ee<xe;ee++)Z[ee]=r.COLOR_ATTACHMENT0+ee;Z.length=he.length,le=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,le=!0);le&&r.drawBuffers(Z)}function Je(D){return _!==D?(r.useProgram(D),_=D,!0):!1}const Ie={[Li]:r.FUNC_ADD,[$u]:r.FUNC_SUBTRACT,[Zu]:r.FUNC_REVERSE_SUBTRACT};Ie[Ju]=r.MIN,Ie[ju]=r.MAX;const Ye={[Qu]:r.ZERO,[ed]:r.ONE,[td]:r.SRC_COLOR,[Mo]:r.SRC_ALPHA,[od]:r.SRC_ALPHA_SATURATE,[rd]:r.DST_COLOR,[id]:r.DST_ALPHA,[nd]:r.ONE_MINUS_SRC_COLOR,[So]:r.ONE_MINUS_SRC_ALPHA,[ad]:r.ONE_MINUS_DST_COLOR,[sd]:r.ONE_MINUS_DST_ALPHA,[ld]:r.CONSTANT_COLOR,[cd]:r.ONE_MINUS_CONSTANT_COLOR,[hd]:r.CONSTANT_ALPHA,[ud]:r.ONE_MINUS_CONSTANT_ALPHA};function Ue(D,se,Z,le,he,ee,xe,fe,Ke,Be){if(D===ei){m===!0&&(Me(r.BLEND),m=!1);return}if(m===!1&&(ne(r.BLEND),m=!0),D!==Ku){if(D!==g||Be!==L){if((S!==Li||w!==Li)&&(r.blendEquation(r.FUNC_ADD),S=Li,w=Li),Be)switch(D){case cs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Xs:r.blendFunc(r.ONE,r.ONE);break;case lc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case cc:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:ke("WebGLState: Invalid blending: ",D);break}else switch(D){case cs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Xs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case lc:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case cc:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",D);break}M=null,v=null,E=null,T=null,x.set(0,0,0),R=0,g=D,L=Be}return}he=he||se,ee=ee||Z,xe=xe||le,(se!==S||he!==w)&&(r.blendEquationSeparate(Ie[se],Ie[he]),S=se,w=he),(Z!==M||le!==v||ee!==E||xe!==T)&&(r.blendFuncSeparate(Ye[Z],Ye[le],Ye[ee],Ye[xe]),M=Z,v=le,E=ee,T=xe),(fe.equals(x)===!1||Ke!==R)&&(r.blendColor(fe.r,fe.g,fe.b,Ke),x.copy(fe),R=Ke),g=D,L=!1}function Oe(D,se){D.side===Qt?Me(r.CULL_FACE):ne(r.CULL_FACE);let Z=D.side===en;se&&(Z=!Z),nt(Z),D.blending===cs&&D.transparent===!1?Ue(ei):Ue(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const le=D.stencilWrite;o.setTest(le),le&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Tt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ne(r.SAMPLE_ALPHA_TO_COVERAGE):Me(r.SAMPLE_ALPHA_TO_COVERAGE)}function nt(D){I!==D&&(D?r.frontFace(r.CW):r.frontFace(r.CCW),I=D)}function ut(D){D!==qu?(ne(r.CULL_FACE),D!==F&&(D===oc?r.cullFace(r.BACK):D===Yu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Me(r.CULL_FACE),F=D}function vt(D){D!==B&&(V&&r.lineWidth(D),B=D)}function Tt(D,se,Z){D?(ne(r.POLYGON_OFFSET_FILL),(K!==se||O!==Z)&&(K=se,O=Z,a.getReversed()&&(se=-se),r.polygonOffset(se,Z))):Me(r.POLYGON_OFFSET_FILL)}function yt(D){D?ne(r.SCISSOR_TEST):Me(r.SCISSOR_TEST)}function Rt(D){D===void 0&&(D=r.TEXTURE0+q-1),ue!==D&&(r.activeTexture(D),ue=D)}function N(D,se,Z){Z===void 0&&(ue===null?Z=r.TEXTURE0+q-1:Z=ue);let le=me[Z];le===void 0&&(le={type:void 0,texture:void 0},me[Z]=le),(le.type!==D||le.texture!==se)&&(ue!==Z&&(r.activeTexture(Z),ue=Z),r.bindTexture(D,se||re[D]),le.type=D,le.texture=se)}function Wt(){const D=me[ue];D!==void 0&&D.type!==void 0&&(r.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ct(){try{r.compressedTexImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function P(){try{r.compressedTexImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function y(){try{r.texSubImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function k(){try{r.texSubImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function H(){try{r.compressedTexSubImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function Y(){try{r.compressedTexSubImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function ae(){try{r.texStorage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function ce(){try{r.texStorage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function $(){try{r.texImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function J(){try{r.texImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function oe(D){return u[D]!==void 0?u[D]:r.getParameter(D)}function Ae(D,se){u[D]!==se&&(r.pixelStorei(D,se),u[D]=se)}function de(D){xt.equals(D)===!1&&(r.scissor(D.x,D.y,D.z,D.w),xt.copy(D))}function ie(D){Fe.equals(D)===!1&&(r.viewport(D.x,D.y,D.z,D.w),Fe.copy(D))}function Ce(D,se){let Z=c.get(se);Z===void 0&&(Z=new WeakMap,c.set(se,Z));let le=Z.get(D);le===void 0&&(le=r.getUniformBlockIndex(se,D.name),Z.set(D,le))}function Ne(D,se){const le=c.get(se).get(D);l.get(se)!==le&&(r.uniformBlockBinding(se,le,D.__bindingPointIndex),l.set(se,le))}function ze(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},ue=null,me={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,S=null,M=null,v=null,w=null,E=null,T=null,x=new _e(0,0,0),R=0,L=!1,I=null,F=null,B=null,K=null,O=null,xt.set(0,0,r.canvas.width,r.canvas.height),Fe.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ne,disable:Me,bindFramebuffer:Ee,drawBuffers:be,useProgram:Je,setBlending:Ue,setMaterial:Oe,setFlipSided:nt,setCullFace:ut,setLineWidth:vt,setPolygonOffset:Tt,setScissorTest:yt,activeTexture:Rt,bindTexture:N,unbindTexture:Wt,compressedTexImage2D:ct,compressedTexImage3D:P,texImage2D:$,texImage3D:J,pixelStorei:Ae,getParameter:oe,updateUBOMapping:Ce,uniformBlockBinding:Ne,texStorage2D:ae,texStorage3D:ce,texSubImage2D:y,texSubImage3D:k,compressedTexSubImage2D:H,compressedTexSubImage3D:Y,scissor:de,viewport:ie,reset:ze}}function dx(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,y){return p?new OffscreenCanvas(P,y):js("canvas")}function m(P,y,k){let H=1;const Y=ct(P);if((Y.width>k||Y.height>k)&&(H=k/Math.max(Y.width,Y.height)),H<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const ae=Math.floor(H*Y.width),ce=Math.floor(H*Y.height);d===void 0&&(d=_(ae,ce));const $=y?_(ae,ce):d;return $.width=ae,$.height=ce,$.getContext("2d").drawImage(P,0,0,ae,ce),Pe("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+ae+"x"+ce+")."),$}else return"data"in P&&Pe("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),P;return P}function g(P){return P.generateMipmaps}function S(P){r.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function v(P,y,k,H,Y,ae=!1){if(P!==null){if(r[P]!==void 0)return r[P];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ce;H&&(ce=e.get("EXT_texture_norm16"),ce||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=y;if(y===r.RED&&(k===r.FLOAT&&($=r.R32F),k===r.HALF_FLOAT&&($=r.R16F),k===r.UNSIGNED_BYTE&&($=r.R8),k===r.UNSIGNED_SHORT&&ce&&($=ce.R16_EXT),k===r.SHORT&&ce&&($=ce.R16_SNORM_EXT)),y===r.RED_INTEGER&&(k===r.UNSIGNED_BYTE&&($=r.R8UI),k===r.UNSIGNED_SHORT&&($=r.R16UI),k===r.UNSIGNED_INT&&($=r.R32UI),k===r.BYTE&&($=r.R8I),k===r.SHORT&&($=r.R16I),k===r.INT&&($=r.R32I)),y===r.RG&&(k===r.FLOAT&&($=r.RG32F),k===r.HALF_FLOAT&&($=r.RG16F),k===r.UNSIGNED_BYTE&&($=r.RG8),k===r.UNSIGNED_SHORT&&ce&&($=ce.RG16_EXT),k===r.SHORT&&ce&&($=ce.RG16_SNORM_EXT)),y===r.RG_INTEGER&&(k===r.UNSIGNED_BYTE&&($=r.RG8UI),k===r.UNSIGNED_SHORT&&($=r.RG16UI),k===r.UNSIGNED_INT&&($=r.RG32UI),k===r.BYTE&&($=r.RG8I),k===r.SHORT&&($=r.RG16I),k===r.INT&&($=r.RG32I)),y===r.RGB_INTEGER&&(k===r.UNSIGNED_BYTE&&($=r.RGB8UI),k===r.UNSIGNED_SHORT&&($=r.RGB16UI),k===r.UNSIGNED_INT&&($=r.RGB32UI),k===r.BYTE&&($=r.RGB8I),k===r.SHORT&&($=r.RGB16I),k===r.INT&&($=r.RGB32I)),y===r.RGBA_INTEGER&&(k===r.UNSIGNED_BYTE&&($=r.RGBA8UI),k===r.UNSIGNED_SHORT&&($=r.RGBA16UI),k===r.UNSIGNED_INT&&($=r.RGBA32UI),k===r.BYTE&&($=r.RGBA8I),k===r.SHORT&&($=r.RGBA16I),k===r.INT&&($=r.RGBA32I)),y===r.RGB&&(k===r.UNSIGNED_SHORT&&ce&&($=ce.RGB16_EXT),k===r.SHORT&&ce&&($=ce.RGB16_SNORM_EXT),k===r.UNSIGNED_INT_5_9_9_9_REV&&($=r.RGB9_E5),k===r.UNSIGNED_INT_10F_11F_11F_REV&&($=r.R11F_G11F_B10F)),y===r.RGBA){const J=ae?da:We.getTransfer(Y);k===r.FLOAT&&($=r.RGBA32F),k===r.HALF_FLOAT&&($=r.RGBA16F),k===r.UNSIGNED_BYTE&&($=J===ft?r.SRGB8_ALPHA8:r.RGBA8),k===r.UNSIGNED_SHORT&&ce&&($=ce.RGBA16_EXT),k===r.SHORT&&ce&&($=ce.RGBA16_SNORM_EXT),k===r.UNSIGNED_SHORT_4_4_4_4&&($=r.RGBA4),k===r.UNSIGNED_SHORT_5_5_5_1&&($=r.RGB5_A1)}return($===r.R16F||$===r.R32F||$===r.RG16F||$===r.RG32F||$===r.RGBA16F||$===r.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function w(P,y){let k;return P?y===null||y===Gn||y===Ys?k=r.DEPTH24_STENCIL8:y===_n?k=r.DEPTH32F_STENCIL8:y===qs&&(k=r.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Gn||y===Ys?k=r.DEPTH_COMPONENT24:y===_n?k=r.DEPTH_COMPONENT32F:y===qs&&(k=r.DEPTH_COMPONENT16),k}function E(P,y){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Vt&&P.minFilter!==kt?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function T(P){const y=P.target;y.removeEventListener("dispose",T),R(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function x(P){const y=P.target;y.removeEventListener("dispose",x),I(y)}function R(P){const y=n.get(P);if(y.__webglInit===void 0)return;const k=P.source,H=f.get(k);if(H){const Y=H[y.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&L(P),Object.keys(H).length===0&&f.delete(k)}n.remove(P)}function L(P){const y=n.get(P);r.deleteTexture(y.__webglTexture);const k=P.source,H=f.get(k);delete H[y.__cacheKey],a.memory.textures--}function I(P){const y=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(y.__webglFramebuffer[H]))for(let Y=0;Y<y.__webglFramebuffer[H].length;Y++)r.deleteFramebuffer(y.__webglFramebuffer[H][Y]);else r.deleteFramebuffer(y.__webglFramebuffer[H]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[H])}else{if(Array.isArray(y.__webglFramebuffer))for(let H=0;H<y.__webglFramebuffer.length;H++)r.deleteFramebuffer(y.__webglFramebuffer[H]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let H=0;H<y.__webglColorRenderbuffer.length;H++)y.__webglColorRenderbuffer[H]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[H]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const k=P.textures;for(let H=0,Y=k.length;H<Y;H++){const ae=n.get(k[H]);ae.__webglTexture&&(r.deleteTexture(ae.__webglTexture),a.memory.textures--),n.remove(k[H])}n.remove(P)}let F=0;function B(){F=0}function K(){return F}function O(P){F=P}function q(){const P=F;return P>=i.maxTextures&&Pe("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),F+=1,P}function V(P){const y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function Q(P,y){const k=n.get(P);if(P.isVideoTexture&&N(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&k.__version!==P.version){const H=P.image;if(H===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{Me(k,P,y);return}}else P.isExternalTexture&&(k.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,k.__webglTexture,r.TEXTURE0+y)}function te(P,y){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){Me(k,P,y);return}else P.isExternalTexture&&(k.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,k.__webglTexture,r.TEXTURE0+y)}function ue(P,y){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){Me(k,P,y);return}t.bindTexture(r.TEXTURE_3D,k.__webglTexture,r.TEXTURE0+y)}function me(P,y){const k=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&k.__version!==P.version){Ee(k,P,y);return}t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+y)}const ye={[Jt]:r.REPEAT,[gn]:r.CLAMP_TO_EDGE,[oa]:r.MIRRORED_REPEAT},qe={[Vt]:r.NEAREST,[Hh]:r.NEAREST_MIPMAP_NEAREST,[Bs]:r.NEAREST_MIPMAP_LINEAR,[kt]:r.LINEAR,[ea]:r.LINEAR_MIPMAP_NEAREST,[kn]:r.LINEAR_MIPMAP_LINEAR},xt={[Md]:r.NEVER,[Ed]:r.ALWAYS,[Sd]:r.LESS,[Ll]:r.LEQUAL,[bd]:r.EQUAL,[Dl]:r.GEQUAL,[wd]:r.GREATER,[Td]:r.NOTEQUAL};function Fe(P,y){if(y.type===_n&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===kt||y.magFilter===ea||y.magFilter===Bs||y.magFilter===kn||y.minFilter===kt||y.minFilter===ea||y.minFilter===Bs||y.minFilter===kn)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,ye[y.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,ye[y.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,ye[y.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,qe[y.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,qe[y.minFilter]),y.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,xt[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Vt||y.minFilter!==Bs&&y.minFilter!==kn||y.type===_n&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");r.texParameterf(P,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function X(P,y){let k=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",T));const H=y.source;let Y=f.get(H);Y===void 0&&(Y={},f.set(H,Y));const ae=V(y);if(ae!==P.__cacheKey){Y[ae]===void 0&&(Y[ae]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,k=!0),Y[ae].usedTimes++;const ce=Y[P.__cacheKey];ce!==void 0&&(Y[P.__cacheKey].usedTimes--,ce.usedTimes===0&&L(y)),P.__cacheKey=ae,P.__webglTexture=Y[ae].texture}return k}function re(P,y,k){return Math.floor(Math.floor(P/k)/y)}function ne(P,y,k,H){const ae=P.updateRanges;if(ae.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,y.width,y.height,k,H,y.data);else{ae.sort((Ae,de)=>Ae.start-de.start);let ce=0;for(let Ae=1;Ae<ae.length;Ae++){const de=ae[ce],ie=ae[Ae],Ce=de.start+de.count,Ne=re(ie.start,y.width,4),ze=re(de.start,y.width,4);ie.start<=Ce+1&&Ne===ze&&re(ie.start+ie.count-1,y.width,4)===Ne?de.count=Math.max(de.count,ie.start+ie.count-de.start):(++ce,ae[ce]=ie)}ae.length=ce+1;const $=t.getParameter(r.UNPACK_ROW_LENGTH),J=t.getParameter(r.UNPACK_SKIP_PIXELS),oe=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,y.width);for(let Ae=0,de=ae.length;Ae<de;Ae++){const ie=ae[Ae],Ce=Math.floor(ie.start/4),Ne=Math.ceil(ie.count/4),ze=Ce%y.width,D=Math.floor(Ce/y.width),se=Ne,Z=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,ze),t.pixelStorei(r.UNPACK_SKIP_ROWS,D),t.texSubImage2D(r.TEXTURE_2D,0,ze,D,se,Z,k,H,y.data)}P.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,$),t.pixelStorei(r.UNPACK_SKIP_PIXELS,J),t.pixelStorei(r.UNPACK_SKIP_ROWS,oe)}}function Me(P,y,k){let H=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(H=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(H=r.TEXTURE_3D);const Y=X(P,y),ae=y.source;t.bindTexture(H,P.__webglTexture,r.TEXTURE0+k);const ce=n.get(ae);if(ae.version!==ce.__version||Y===!0){if(t.activeTexture(r.TEXTURE0+k),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const Z=We.getPrimaries(We.workingColorSpace),le=y.colorSpace===yi?null:We.getPrimaries(y.colorSpace),he=y.colorSpace===yi||Z===le?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,he)}t.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment);let J=m(y.image,!1,i.maxTextureSize);J=Wt(y,J);const oe=s.convert(y.format,y.colorSpace),Ae=s.convert(y.type);let de=v(y.internalFormat,oe,Ae,y.normalized,y.colorSpace,y.isVideoTexture);Fe(H,y);let ie;const Ce=y.mipmaps,Ne=y.isVideoTexture!==!0,ze=ce.__version===void 0||Y===!0,D=ae.dataReady,se=E(y,J);if(y.isDepthTexture)de=w(y.format===Fi,y.type),ze&&(Ne?t.texStorage2D(r.TEXTURE_2D,1,de,J.width,J.height):t.texImage2D(r.TEXTURE_2D,0,de,J.width,J.height,0,oe,Ae,null));else if(y.isDataTexture)if(Ce.length>0){Ne&&ze&&t.texStorage2D(r.TEXTURE_2D,se,de,Ce[0].width,Ce[0].height);for(let Z=0,le=Ce.length;Z<le;Z++)ie=Ce[Z],Ne?D&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ie.width,ie.height,oe,Ae,ie.data):t.texImage2D(r.TEXTURE_2D,Z,de,ie.width,ie.height,0,oe,Ae,ie.data);y.generateMipmaps=!1}else Ne?(ze&&t.texStorage2D(r.TEXTURE_2D,se,de,J.width,J.height),D&&ne(y,J,oe,Ae)):t.texImage2D(r.TEXTURE_2D,0,de,J.width,J.height,0,oe,Ae,J.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ne&&ze&&t.texStorage3D(r.TEXTURE_2D_ARRAY,se,de,Ce[0].width,Ce[0].height,J.depth);for(let Z=0,le=Ce.length;Z<le;Z++)if(ie=Ce[Z],y.format!==xn)if(oe!==null)if(Ne){if(D)if(y.layerUpdates.size>0){const he=nh(ie.width,ie.height,y.format,y.type);for(const ee of y.layerUpdates){const xe=ie.data.subarray(ee*he/ie.data.BYTES_PER_ELEMENT,(ee+1)*he/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,ee,ie.width,ie.height,1,oe,xe)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ie.width,ie.height,J.depth,oe,ie.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,de,ie.width,ie.height,J.depth,0,ie.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?D&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ie.width,ie.height,J.depth,oe,Ae,ie.data):t.texImage3D(r.TEXTURE_2D_ARRAY,Z,de,ie.width,ie.height,J.depth,0,oe,Ae,ie.data)}else{Ne&&ze&&t.texStorage2D(r.TEXTURE_2D,se,de,Ce[0].width,Ce[0].height);for(let Z=0,le=Ce.length;Z<le;Z++)ie=Ce[Z],y.format!==xn?oe!==null?Ne?D&&t.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,ie.width,ie.height,oe,ie.data):t.compressedTexImage2D(r.TEXTURE_2D,Z,de,ie.width,ie.height,0,ie.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?D&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ie.width,ie.height,oe,Ae,ie.data):t.texImage2D(r.TEXTURE_2D,Z,de,ie.width,ie.height,0,oe,Ae,ie.data)}else if(y.isDataArrayTexture)if(Ne){if(ze&&t.texStorage3D(r.TEXTURE_2D_ARRAY,se,de,J.width,J.height,J.depth),D)if(y.layerUpdates.size>0){const Z=nh(J.width,J.height,y.format,y.type);for(const le of y.layerUpdates){const he=J.data.subarray(le*Z/J.data.BYTES_PER_ELEMENT,(le+1)*Z/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,le,J.width,J.height,1,oe,Ae,he)}y.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,oe,Ae,J.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,de,J.width,J.height,J.depth,0,oe,Ae,J.data);else if(y.isData3DTexture)Ne?(ze&&t.texStorage3D(r.TEXTURE_3D,se,de,J.width,J.height,J.depth),D&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,oe,Ae,J.data)):t.texImage3D(r.TEXTURE_3D,0,de,J.width,J.height,J.depth,0,oe,Ae,J.data);else if(y.isFramebufferTexture){if(ze)if(Ne)t.texStorage2D(r.TEXTURE_2D,se,de,J.width,J.height);else{let Z=J.width,le=J.height;for(let he=0;he<se;he++)t.texImage2D(r.TEXTURE_2D,he,de,Z,le,0,oe,Ae,null),Z>>=1,le>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in r){const Z=r.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),J.parentNode!==Z){Z.appendChild(J),u.add(y),Z.onpaint=le=>{const he=le.changedElements;for(const ee of u)he.includes(ee.image)&&(ee.needsUpdate=!0)},Z.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,J);else{const he=r.RGBA,ee=r.RGBA,xe=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,he,ee,xe,J)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(Ne&&ze){const Z=ct(Ce[0]);t.texStorage2D(r.TEXTURE_2D,se,de,Z.width,Z.height)}for(let Z=0,le=Ce.length;Z<le;Z++)ie=Ce[Z],Ne?D&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,oe,Ae,ie):t.texImage2D(r.TEXTURE_2D,Z,de,oe,Ae,ie);y.generateMipmaps=!1}else if(Ne){if(ze){const Z=ct(J);t.texStorage2D(r.TEXTURE_2D,se,de,Z.width,Z.height)}D&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,oe,Ae,J)}else t.texImage2D(r.TEXTURE_2D,0,de,oe,Ae,J);g(y)&&S(H),ce.__version=ae.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Ee(P,y,k){if(y.image.length!==6)return;const H=X(P,y),Y=y.source;t.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+k);const ae=n.get(Y);if(Y.version!==ae.__version||H===!0){t.activeTexture(r.TEXTURE0+k);const ce=We.getPrimaries(We.workingColorSpace),$=y.colorSpace===yi?null:We.getPrimaries(y.colorSpace),J=y.colorSpace===yi||ce===$?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const oe=y.isCompressedTexture||y.image[0].isCompressedTexture,Ae=y.image[0]&&y.image[0].isDataTexture,de=[];for(let ee=0;ee<6;ee++)!oe&&!Ae?de[ee]=m(y.image[ee],!0,i.maxCubemapSize):de[ee]=Ae?y.image[ee].image:y.image[ee],de[ee]=Wt(y,de[ee]);const ie=de[0],Ce=s.convert(y.format,y.colorSpace),Ne=s.convert(y.type),ze=v(y.internalFormat,Ce,Ne,y.normalized,y.colorSpace),D=y.isVideoTexture!==!0,se=ae.__version===void 0||H===!0,Z=Y.dataReady;let le=E(y,ie);Fe(r.TEXTURE_CUBE_MAP,y);let he;if(oe){D&&se&&t.texStorage2D(r.TEXTURE_CUBE_MAP,le,ze,ie.width,ie.height);for(let ee=0;ee<6;ee++){he=de[ee].mipmaps;for(let xe=0;xe<he.length;xe++){const fe=he[xe];y.format!==xn?Ce!==null?D?Z&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,0,0,fe.width,fe.height,Ce,fe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,ze,fe.width,fe.height,0,fe.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,0,0,fe.width,fe.height,Ce,Ne,fe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,ze,fe.width,fe.height,0,Ce,Ne,fe.data)}}}else{if(he=y.mipmaps,D&&se){he.length>0&&le++;const ee=ct(de[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,le,ze,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(Ae){D?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,de[ee].width,de[ee].height,Ce,Ne,de[ee].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,ze,de[ee].width,de[ee].height,0,Ce,Ne,de[ee].data);for(let xe=0;xe<he.length;xe++){const Ke=he[xe].image[ee].image;D?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,0,0,Ke.width,Ke.height,Ce,Ne,Ke.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,ze,Ke.width,Ke.height,0,Ce,Ne,Ke.data)}}else{D?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ce,Ne,de[ee]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,ze,Ce,Ne,de[ee]);for(let xe=0;xe<he.length;xe++){const fe=he[xe];D?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,0,0,Ce,Ne,fe.image[ee]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,ze,Ce,Ne,fe.image[ee])}}}g(y)&&S(r.TEXTURE_CUBE_MAP),ae.__version=Y.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function be(P,y,k,H,Y,ae){const ce=s.convert(k.format,k.colorSpace),$=s.convert(k.type),J=v(k.internalFormat,ce,$,k.normalized,k.colorSpace),oe=n.get(y),Ae=n.get(k);if(Ae.__renderTarget=y,!oe.__hasExternalTextures){const de=Math.max(1,y.width>>ae),ie=Math.max(1,y.height>>ae);Y===r.TEXTURE_3D||Y===r.TEXTURE_2D_ARRAY?t.texImage3D(Y,ae,J,de,ie,y.depth,0,ce,$,null):t.texImage2D(Y,ae,J,de,ie,0,ce,$,null)}t.bindFramebuffer(r.FRAMEBUFFER,P),Rt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,H,Y,Ae.__webglTexture,0,yt(y)):(Y===r.TEXTURE_2D||Y>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,H,Y,Ae.__webglTexture,ae),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Je(P,y,k){if(r.bindRenderbuffer(r.RENDERBUFFER,P),y.depthBuffer){const H=y.depthTexture,Y=H&&H.isDepthTexture?H.type:null,ae=w(y.stencilBuffer,Y),ce=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;Rt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,yt(y),ae,y.width,y.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,yt(y),ae,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,ae,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ce,r.RENDERBUFFER,P)}else{const H=y.textures;for(let Y=0;Y<H.length;Y++){const ae=H[Y],ce=s.convert(ae.format,ae.colorSpace),$=s.convert(ae.type),J=v(ae.internalFormat,ce,$,ae.normalized,ae.colorSpace);Rt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,yt(y),J,y.width,y.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,yt(y),J,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,J,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ie(P,y,k){const H=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Y=n.get(y.depthTexture);if(Y.__renderTarget=y,(!Y.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),H){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,y.depthTexture.addEventListener("dispose",T)),Y.__webglTexture===void 0){Y.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,Y.__webglTexture),Fe(r.TEXTURE_CUBE_MAP,y.depthTexture);const oe=s.convert(y.depthTexture.format),Ae=s.convert(y.depthTexture.type);let de;y.depthTexture.format===si?de=r.DEPTH_COMPONENT24:y.depthTexture.format===Fi&&(de=r.DEPTH24_STENCIL8);for(let ie=0;ie<6;ie++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,de,y.width,y.height,0,oe,Ae,null)}}else Q(y.depthTexture,0);const ae=Y.__webglTexture,ce=yt(y),$=H?r.TEXTURE_CUBE_MAP_POSITIVE_X+k:r.TEXTURE_2D,J=y.depthTexture.format===Fi?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(y.depthTexture.format===si)Rt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,$,ae,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,J,$,ae,0);else if(y.depthTexture.format===Fi)Rt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,$,ae,0,ce):r.framebufferTexture2D(r.FRAMEBUFFER,J,$,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ye(P){const y=n.get(P),k=P.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==P.depthTexture){const H=P.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),H){const Y=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,H.removeEventListener("dispose",Y)};H.addEventListener("dispose",Y),y.__depthDisposeCallback=Y}y.__boundDepthTexture=H}if(P.depthTexture&&!y.__autoAllocateDepthBuffer)if(k)for(let H=0;H<6;H++)Ie(y.__webglFramebuffer[H],P,H);else{const H=P.texture.mipmaps;H&&H.length>0?Ie(y.__webglFramebuffer[0],P,0):Ie(y.__webglFramebuffer,P,0)}else if(k){y.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[H]),y.__webglDepthbuffer[H]===void 0)y.__webglDepthbuffer[H]=r.createRenderbuffer(),Je(y.__webglDepthbuffer[H],P,!1);else{const Y=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=y.__webglDepthbuffer[H];r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,Y,r.RENDERBUFFER,ae)}}else{const H=P.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=r.createRenderbuffer(),Je(y.__webglDepthbuffer,P,!1);else{const Y=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=y.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,Y,r.RENDERBUFFER,ae)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ue(P,y,k){const H=n.get(P);y!==void 0&&be(H.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),k!==void 0&&Ye(P)}function Oe(P){const y=P.texture,k=n.get(P),H=n.get(y);P.addEventListener("dispose",x);const Y=P.textures,ae=P.isWebGLCubeRenderTarget===!0,ce=Y.length>1;if(ce||(H.__webglTexture===void 0&&(H.__webglTexture=r.createTexture()),H.__version=y.version,a.memory.textures++),ae){k.__webglFramebuffer=[];for(let $=0;$<6;$++)if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer[$]=[];for(let J=0;J<y.mipmaps.length;J++)k.__webglFramebuffer[$][J]=r.createFramebuffer()}else k.__webglFramebuffer[$]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer=[];for(let $=0;$<y.mipmaps.length;$++)k.__webglFramebuffer[$]=r.createFramebuffer()}else k.__webglFramebuffer=r.createFramebuffer();if(ce)for(let $=0,J=Y.length;$<J;$++){const oe=n.get(Y[$]);oe.__webglTexture===void 0&&(oe.__webglTexture=r.createTexture(),a.memory.textures++)}if(P.samples>0&&Rt(P)===!1){k.__webglMultisampledFramebuffer=r.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let $=0;$<Y.length;$++){const J=Y[$];k.__webglColorRenderbuffer[$]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,k.__webglColorRenderbuffer[$]);const oe=s.convert(J.format,J.colorSpace),Ae=s.convert(J.type),de=v(J.internalFormat,oe,Ae,J.normalized,J.colorSpace,P.isXRRenderTarget===!0),ie=yt(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,ie,de,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+$,r.RENDERBUFFER,k.__webglColorRenderbuffer[$])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(k.__webglDepthRenderbuffer=r.createRenderbuffer(),Je(k.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ae){t.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture),Fe(r.TEXTURE_CUBE_MAP,y);for(let $=0;$<6;$++)if(y.mipmaps&&y.mipmaps.length>0)for(let J=0;J<y.mipmaps.length;J++)be(k.__webglFramebuffer[$][J],P,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,J);else be(k.__webglFramebuffer[$],P,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);g(y)&&S(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let $=0,J=Y.length;$<J;$++){const oe=Y[$],Ae=n.get(oe);let de=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(de=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(de,Ae.__webglTexture),Fe(de,oe),be(k.__webglFramebuffer,P,oe,r.COLOR_ATTACHMENT0+$,de,0),g(oe)&&S(de)}t.unbindTexture()}else{let $=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&($=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture($,H.__webglTexture),Fe($,y),y.mipmaps&&y.mipmaps.length>0)for(let J=0;J<y.mipmaps.length;J++)be(k.__webglFramebuffer[J],P,y,r.COLOR_ATTACHMENT0,$,J);else be(k.__webglFramebuffer,P,y,r.COLOR_ATTACHMENT0,$,0);g(y)&&S($),t.unbindTexture()}P.depthBuffer&&Ye(P)}function nt(P){const y=P.textures;for(let k=0,H=y.length;k<H;k++){const Y=y[k];if(g(Y)){const ae=M(P),ce=n.get(Y).__webglTexture;t.bindTexture(ae,ce),S(ae),t.unbindTexture()}}}const ut=[],vt=[];function Tt(P){if(P.samples>0){if(Rt(P)===!1){const y=P.textures,k=P.width,H=P.height;let Y=r.COLOR_BUFFER_BIT;const ae=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=n.get(P),$=y.length>1;if($)for(let oe=0;oe<y.length;oe++)t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+oe,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+oe,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const J=P.texture.mipmaps;J&&J.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let oe=0;oe<y.length;oe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Y|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Y|=r.STENCIL_BUFFER_BIT)),$){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ce.__webglColorRenderbuffer[oe]);const Ae=n.get(y[oe]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ae,0)}r.blitFramebuffer(0,0,k,H,0,0,k,H,Y,r.NEAREST),l===!0&&(ut.length=0,vt.length=0,ut.push(r.COLOR_ATTACHMENT0+oe),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ut.push(ae),vt.push(ae),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,vt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),$)for(let oe=0;oe<y.length;oe++){t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+oe,r.RENDERBUFFER,ce.__webglColorRenderbuffer[oe]);const Ae=n.get(y[oe]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+oe,r.TEXTURE_2D,Ae,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const y=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function yt(P){return Math.min(i.maxSamples,P.samples)}function Rt(P){const y=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function N(P){const y=a.render.frame;h.get(P)!==y&&(h.set(P,y),P.update())}function Wt(P,y){const k=P.colorSpace,H=P.format,Y=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||k!==un&&k!==yi&&(We.getTransfer(k)===ft?(H!==xn||Y!==hn)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",k)),y}function ct(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=B,this.getTextureUnits=K,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=te,this.setTexture3D=ue,this.setTextureCube=me,this.rebindTextures=Ue,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Rt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function fx(r,e){function t(n,i=yi){let s;const a=We.getTransfer(i);if(n===hn)return r.UNSIGNED_BYTE;if(n===Tl)return r.UNSIGNED_SHORT_4_4_4_4;if(n===El)return r.UNSIGNED_SHORT_5_5_5_1;if(n===qh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Yh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Wh)return r.BYTE;if(n===Xh)return r.SHORT;if(n===qs)return r.UNSIGNED_SHORT;if(n===wl)return r.INT;if(n===Gn)return r.UNSIGNED_INT;if(n===_n)return r.FLOAT;if(n===ii)return r.HALF_FLOAT;if(n===Kh)return r.ALPHA;if(n===$h)return r.RGB;if(n===xn)return r.RGBA;if(n===si)return r.DEPTH_COMPONENT;if(n===Fi)return r.DEPTH_STENCIL;if(n===Al)return r.RED;if(n===Cl)return r.RED_INTEGER;if(n===Ui)return r.RG;if(n===Rl)return r.RG_INTEGER;if(n===Pl)return r.RGBA_INTEGER;if(n===ta||n===na||n===ia||n===sa)if(a===ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ta)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===sa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ta)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===sa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Po||n===Io||n===Lo||n===Do)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Po)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Io)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Lo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Do)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fo||n===No||n===Uo||n===Oo||n===ko||n===la||n===Bo)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Fo||n===No)return a===ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Uo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Oo)return s.COMPRESSED_R11_EAC;if(n===ko)return s.COMPRESSED_SIGNED_R11_EAC;if(n===la)return s.COMPRESSED_RG11_EAC;if(n===Bo)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Vo||n===zo||n===Go||n===Ho||n===Wo||n===Xo||n===qo||n===Yo||n===Ko||n===$o||n===Zo||n===Jo||n===jo||n===Qo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Vo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Go)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ho)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ko)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$o)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Qo)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===el||n===tl||n===nl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===el)return a===ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===il||n===sl||n===ca||n===rl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===il)return s.COMPRESSED_RED_RGTC1_EXT;if(n===sl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ca)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ys?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const px=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class gx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new su(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pn({vertexShader:px,fragmentShader:mx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new j(new lr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _x extends wi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new gx,g={},S=t.getContextAttributes();let M=null,v=null;const w=[],E=[],T=new Ve;let x=null;const R=new jt;R.viewport=new at;const L=new jt;L.viewport=new at;const I=[R,L],F=new pp;let B=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let re=w[X];return re===void 0&&(re=new ka,w[X]=re),re.getTargetRaySpace()},this.getControllerGrip=function(X){let re=w[X];return re===void 0&&(re=new ka,w[X]=re),re.getGripSpace()},this.getHand=function(X){let re=w[X];return re===void 0&&(re=new ka,w[X]=re),re.getHandSpace()};function O(X){const re=E.indexOf(X.inputSource);if(re===-1)return;const ne=w[re];ne!==void 0&&(ne.update(X.inputSource,X.frame,c||a),ne.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",V);for(let X=0;X<w.length;X++){const re=E[X];re!==null&&(E[X]=null,w[X].disconnect(re))}B=null,K=null,m.reset();for(const X in g)delete g[X];e.setRenderTarget(M),f=null,d=null,u=null,i=null,v=null,Fe.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(M=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",q),i.addEventListener("inputsourceschange",V),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,Me=null,Ee=null;S.depth&&(Ee=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=S.stencil?Fi:si,Me=S.stencil?Ys:Gn);const be={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(be),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new zn(d.textureWidth,d.textureHeight,{format:xn,type:hn,depthTexture:new _s(d.textureWidth,d.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ne={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,ne),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new zn(f.framebufferWidth,f.framebufferHeight,{format:xn,type:hn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Fe.setContext(i),Fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function V(X){for(let re=0;re<X.removed.length;re++){const ne=X.removed[re],Me=E.indexOf(ne);Me>=0&&(E[Me]=null,w[Me].disconnect(ne))}for(let re=0;re<X.added.length;re++){const ne=X.added[re];let Me=E.indexOf(ne);if(Me===-1){for(let be=0;be<w.length;be++)if(be>=E.length){E.push(ne),Me=be;break}else if(E[be]===null){E[be]=ne,Me=be;break}if(Me===-1)break}const Ee=w[Me];Ee&&Ee.connect(ne)}}const Q=new b,te=new b;function ue(X,re,ne){Q.setFromMatrixPosition(re.matrixWorld),te.setFromMatrixPosition(ne.matrixWorld);const Me=Q.distanceTo(te),Ee=re.projectionMatrix.elements,be=ne.projectionMatrix.elements,Je=Ee[14]/(Ee[10]-1),Ie=Ee[14]/(Ee[10]+1),Ye=(Ee[9]+1)/Ee[5],Ue=(Ee[9]-1)/Ee[5],Oe=(Ee[8]-1)/Ee[0],nt=(be[8]+1)/be[0],ut=Je*Oe,vt=Je*nt,Tt=Me/(-Oe+nt),yt=Tt*-Oe;if(re.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(yt),X.translateZ(Tt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ee[10]===-1)X.projectionMatrix.copy(re.projectionMatrix),X.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const Rt=Je+Tt,N=Ie+Tt,Wt=ut-yt,ct=vt+(Me-yt),P=Ye*Ie/N*Rt,y=Ue*Ie/N*Rt;X.projectionMatrix.makePerspective(Wt,ct,P,y,Rt,N),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function me(X,re){re===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(re.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;let re=X.near,ne=X.far;m.texture!==null&&(m.depthNear>0&&(re=m.depthNear),m.depthFar>0&&(ne=m.depthFar)),F.near=L.near=R.near=re,F.far=L.far=R.far=ne,(B!==F.near||K!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),B=F.near,K=F.far),F.layers.mask=X.layers.mask|6,R.layers.mask=F.layers.mask&-5,L.layers.mask=F.layers.mask&-3;const Me=X.parent,Ee=F.cameras;me(F,Me);for(let be=0;be<Ee.length;be++)me(Ee[be],Me);Ee.length===2?ue(F,R,L):F.projectionMatrix.copy(R.projectionMatrix),ye(X,F,Me)};function ye(X,re,ne){ne===null?X.matrix.copy(re.matrixWorld):(X.matrix.copy(ne.matrixWorld),X.matrix.invert(),X.matrix.multiply(re.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(re.projectionMatrix),X.projectionMatrixInverse.copy(re.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=gs*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(X){return g[X]};let qe=null;function xt(X,re){if(h=re.getViewerPose(c||a),p=re,h!==null){const ne=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Me=!1;ne.length!==F.cameras.length&&(F.cameras.length=0,Me=!0);for(let Ie=0;Ie<ne.length;Ie++){const Ye=ne[Ie];let Ue=null;if(f!==null)Ue=f.getViewport(Ye);else{const nt=u.getViewSubImage(d,Ye);Ue=nt.viewport,Ie===0&&(e.setRenderTargetTextures(v,nt.colorTexture,nt.depthStencilTexture),e.setRenderTarget(v))}let Oe=I[Ie];Oe===void 0&&(Oe=new jt,Oe.layers.enable(Ie),Oe.viewport=new at,I[Ie]=Oe),Oe.matrix.fromArray(Ye.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(Ye.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(Ue.x,Ue.y,Ue.width,Ue.height),Ie===0&&(F.matrix.copy(Oe.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Me===!0&&F.cameras.push(Oe)}const Ee=i.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Ie=u.getDepthInformation(ne[0]);Ie&&Ie.isValid&&Ie.texture&&m.init(Ie,i.renderState)}if(Ee&&Ee.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ie=0;Ie<ne.length;Ie++){const Ye=ne[Ie].camera;if(Ye){let Ue=g[Ye];Ue||(Ue=new su,g[Ye]=Ue);const Oe=u.getCameraImage(Ye);Ue.sourceTexture=Oe}}}}for(let ne=0;ne<w.length;ne++){const Me=E[ne],Ee=w[ne];Me!==null&&Ee!==void 0&&Ee.update(Me,re,c||a)}qe&&qe(X,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),p=null}const Fe=new gu;Fe.setAnimationLoop(xt),this.setAnimationLoop=function(X){qe=X},this.dispose=function(){}}}const xx=new Se,bu=new He;bu.set(-1,0,0,0,1,0,0,0,1);function vx(r,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,cu(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,S,M,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(m,g):g.isMeshLambertMaterial?(s(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(m,g),u(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),_(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,S,M):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===en&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===en&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const S=e.get(g),M=S.envMap,v=S.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(xx.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(bu),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,S,M){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*S,m.scale.value=M*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,S){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===en&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const S=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function yx(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,w){const E=w.program;n.uniformBlockBinding(v,E)}function c(v,w){let E=i[v.id];E===void 0&&(m(v),E=h(v),i[v.id]=E,v.addEventListener("dispose",S));const T=w.program;n.updateUBOMapping(v,T);const x=e.render.frame;s[v.id]!==x&&(d(v),s[v.id]=x)}function h(v){const w=u();v.__bindingPointIndex=w;const E=r.createBuffer(),T=v.__size,x=v.usage;return r.bindBuffer(r.UNIFORM_BUFFER,E),r.bufferData(r.UNIFORM_BUFFER,T,x),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,E),E}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const w=i[v.id],E=v.uniforms,T=v.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let x=0,R=E.length;x<R;x++){const L=E[x];if(Array.isArray(L))for(let I=0,F=L.length;I<F;I++)f(L[I],x,I,T);else f(L,x,0,T)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(v,w,E,T){if(_(v,w,E,T)===!0){const x=v.__offset,R=v.value;if(Array.isArray(R)){let L=0;for(let I=0;I<R.length;I++){const F=R[I],B=g(F);p(F,v.__data,L),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(L+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(R,v.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,x,v.__data)}}function p(v,w,E){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,E)}function _(v,w,E,T){const x=v.value,R=w+"_"+E;if(T[R]===void 0)return typeof x=="number"||typeof x=="boolean"?T[R]=x:ArrayBuffer.isView(x)?T[R]=x.slice():T[R]=x.clone(),!0;{const L=T[R];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return T[R]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function m(v){const w=v.uniforms;let E=0;const T=16;for(let R=0,L=w.length;R<L;R++){const I=Array.isArray(w[R])?w[R]:[w[R]];for(let F=0,B=I.length;F<B;F++){const K=I[F],O=Array.isArray(K.value)?K.value:[K.value];for(let q=0,V=O.length;q<V;q++){const Q=O[q],te=g(Q),ue=E%T,me=ue%te.boundary,ye=ue+me;E+=me,ye!==0&&T-ye<te.storage&&(E+=T-ye),K.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=E,E+=te.storage}}}const x=E%T;return x>0&&(E+=T-x),v.__size=E,v.__cache={},this}function g(v){const w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",v),w}function S(v){const w=v.target;w.removeEventListener("dispose",S);const E=a.indexOf(w.__bindingPointIndex);a.splice(E,1),r.deleteBuffer(i[w.id]),delete i[w.id],delete s[w.id]}function M(){for(const v in i)r.deleteBuffer(i[v]);a=[],i={},s={}}return{bind:l,update:c,dispose:M}}const Mx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Nn=null;function Sx(){return Nn===null&&(Nn=new Bl(Mx,16,16,Ui,ii),Nn.name="DFG_LUT",Nn.minFilter=kt,Nn.magFilter=kt,Nn.wrapS=gn,Nn.wrapT=gn,Nn.generateMipmaps=!1,Nn.needsUpdate=!0),Nn}class bx{constructor(e={}){const{canvas:t=Rd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=hn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=f,m=new Set([Pl,Rl,Cl]),g=new Set([hn,Gn,qs,Ys,Tl,El]),S=new Uint32Array(4),M=new Int32Array(4),v=new b;let w=null,E=null;const T=[],x=[];let R=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let I=!1,F=null,B=null,K=null,O=null;this._outputColorSpace=dt;let q=0,V=0,Q=null,te=-1,ue=null;const me=new at,ye=new at;let qe=null;const xt=new _e(0);let Fe=0,X=t.width,re=t.height,ne=1,Me=null,Ee=null;const be=new at(0,0,X,re),Je=new at(0,0,X,re);let Ie=!1;const Ye=new Vl;let Ue=!1,Oe=!1;const nt=new Se,ut=new b,vt=new at,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let yt=!1;function Rt(){return Q===null?ne:1}let N=n;function Wt(C,U){return t.getContext(C,U)}try{const C={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Sl}`),t.addEventListener("webglcontextlost",Ke,!1),t.addEventListener("webglcontextrestored",Be,!1),t.addEventListener("webglcontextcreationerror",Ut,!1),N===null){const U="webgl2";if(N=Wt(U,C),N===null)throw Wt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(C){throw ke("WebGLRenderer: "+C.message),C}let ct,P,y,k,H,Y,ae,ce,$,J,oe,Ae,de,ie,Ce,Ne,ze,D,se,Z,le,he,ee;function xe(){ct=new S0(N),ct.init(),le=new fx(N,ct),P=new p0(N,ct,e,le),y=new ux(N,ct),P.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),B=N.createFramebuffer(),K=N.createFramebuffer(),O=N.createFramebuffer(),k=new T0(N),H=new J_,Y=new dx(N,ct,y,H,P,le,k),ae=new M0(L),ce=new Rp(N),he=new d0(N,ce),$=new b0(N,ce,k,he),J=new A0(N,$,ce,he,k),D=new E0(N,P,Y),Ce=new m0(H),oe=new Z_(L,ae,ct,P,he,Ce),Ae=new vx(L,H),de=new Q_,ie=new rx(ct),ze=new u0(L,ae,y,J,p,l),Ne=new hx(L,J,P),ee=new yx(N,k,P,y),se=new f0(N,ct,k),Z=new w0(N,ct,k),k.programs=oe.programs,L.capabilities=P,L.extensions=ct,L.properties=H,L.renderLists=de,L.shadowMap=Ne,L.state=y,L.info=k}xe(),_!==hn&&(R=new R0(_,t.width,t.height,o,i,s));const fe=new _x(L,N);this.xr=fe,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const C=ct.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ct.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(C){C!==void 0&&(ne=C,this.setSize(X,re,!1))},this.getSize=function(C){return C.set(X,re)},this.setSize=function(C,U,W=!0){if(fe.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}X=C,re=U,t.width=Math.floor(C*ne),t.height=Math.floor(U*ne),W===!0&&(t.style.width=C+"px",t.style.height=U+"px"),R!==null&&R.setSize(t.width,t.height),this.setViewport(0,0,C,U)},this.getDrawingBufferSize=function(C){return C.set(X*ne,re*ne).floor()},this.setDrawingBufferSize=function(C,U,W){X=C,re=U,ne=W,t.width=Math.floor(C*W),t.height=Math.floor(U*W),this.setViewport(0,0,C,U)},this.setEffects=function(C){if(_===hn){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let U=0;U<C.length;U++)if(C[U].isOutputPass===!0){Pe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(me)},this.getViewport=function(C){return C.copy(be)},this.setViewport=function(C,U,W,z){C.isVector4?be.set(C.x,C.y,C.z,C.w):be.set(C,U,W,z),y.viewport(me.copy(be).multiplyScalar(ne).round())},this.getScissor=function(C){return C.copy(Je)},this.setScissor=function(C,U,W,z){C.isVector4?Je.set(C.x,C.y,C.z,C.w):Je.set(C,U,W,z),y.scissor(ye.copy(Je).multiplyScalar(ne).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(C){y.setScissorTest(Ie=C)},this.setOpaqueSort=function(C){Me=C},this.setTransparentSort=function(C){Ee=C},this.getClearColor=function(C){return C.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(C=!0,U=!0,W=!0){let z=0;if(C){let G=!1;if(Q!==null){const ve=Q.texture.format;G=m.has(ve)}if(G){const ve=Q.texture.type,Te=g.has(ve),ge=ze.getClearColor(),Re=ze.getClearAlpha(),Le=ge.r,$e=ge.g,Qe=ge.b;Te?(S[0]=Le,S[1]=$e,S[2]=Qe,S[3]=Re,N.clearBufferuiv(N.COLOR,0,S)):(M[0]=Le,M[1]=$e,M[2]=Qe,M[3]=Re,N.clearBufferiv(N.COLOR,0,M))}else z|=N.COLOR_BUFFER_BIT}U&&(z|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&N.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),F=C},this.dispose=function(){t.removeEventListener("webglcontextlost",Ke,!1),t.removeEventListener("webglcontextrestored",Be,!1),t.removeEventListener("webglcontextcreationerror",Ut,!1),ze.dispose(),de.dispose(),ie.dispose(),H.dispose(),ae.dispose(),J.dispose(),he.dispose(),ee.dispose(),oe.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Ql),fe.removeEventListener("sessionend",ec),Ti.stop()};function Ke(C){C.preventDefault(),fa("WebGLRenderer: Context Lost."),I=!0}function Be(){fa("WebGLRenderer: Context Restored."),I=!1;const C=k.autoReset,U=Ne.enabled,W=Ne.autoUpdate,z=Ne.needsUpdate,G=Ne.type;xe(),k.autoReset=C,Ne.enabled=U,Ne.autoUpdate=W,Ne.needsUpdate=z,Ne.type=G}function Ut(C){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function yn(C){const U=C.target;U.removeEventListener("dispose",yn),fr(U)}function fr(C){Ln(C),H.remove(C)}function Ln(C){const U=H.get(C).programs;U!==void 0&&(U.forEach(function(W){oe.releaseProgram(W)}),C.isShaderMaterial&&oe.releaseShaderCache(C))}this.renderBufferDirect=function(C,U,W,z,G,ve){U===null&&(U=Tt);const Te=G.isMesh&&G.matrixWorld.determinantAffine()<0,ge=zu(C,U,W,z,G);y.setMaterial(z,Te);let Re=W.index,Le=1;if(z.wireframe===!0){if(Re=$.getWireframeAttribute(W),Re===void 0)return;Le=2}const $e=W.drawRange,Qe=W.attributes.position;let De=$e.start*Le,_t=($e.start+$e.count)*Le;ve!==null&&(De=Math.max(De,ve.start*Le),_t=Math.min(_t,(ve.start+ve.count)*Le)),Re!==null?(De=Math.max(De,0),_t=Math.min(_t,Re.count)):Qe!=null&&(De=Math.max(De,0),_t=Math.min(_t,Qe.count));const It=_t-De;if(It<0||It===1/0)return;he.setup(G,z,ge,W,Re);let Pt,Mt=se;if(Re!==null&&(Pt=ce.get(Re),Mt=Z,Mt.setIndex(Pt)),G.isMesh)z.wireframe===!0?(y.setLineWidth(z.wireframeLinewidth*Rt()),Mt.setMode(N.LINES)):Mt.setMode(N.TRIANGLES);else if(G.isLine){let Kt=z.linewidth;Kt===void 0&&(Kt=1),y.setLineWidth(Kt*Rt()),G.isLineSegments?Mt.setMode(N.LINES):G.isLineLoop?Mt.setMode(N.LINE_LOOP):Mt.setMode(N.LINE_STRIP)}else G.isPoints?Mt.setMode(N.POINTS):G.isSprite&&Mt.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))Mt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Kt=G._multiDrawStarts,we=G._multiDrawCounts,on=G._multiDrawCount,rt=Re?ce.get(Re).bytesPerElement:1,dn=H.get(z).currentProgram.getUniforms();for(let Dn=0;Dn<on;Dn++)dn.setValue(N,"_gl_DrawID",Dn),Mt.render(Kt[Dn]/rt,we[Dn])}else if(G.isInstancedMesh)Mt.renderInstances(De,It,G.count);else if(W.isInstancedBufferGeometry){const Kt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,we=Math.min(W.instanceCount,Kt);Mt.renderInstances(De,It,we)}else Mt.render(De,It)};function Mn(C,U,W){C.transparent===!0&&C.side===Qt&&C.forceSinglePass===!1?(C.side=en,C.needsUpdate=!0,mr(C,U,W),C.side=ni,C.needsUpdate=!0,mr(C,U,W),C.side=Qt):mr(C,U,W)}this.compile=function(C,U,W=null){W===null&&(W=C),E=ie.get(W),E.init(U),x.push(E),W.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),C!==W&&C.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights();const z=new Set;return C.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ve=G.material;if(ve)if(Array.isArray(ve))for(let Te=0;Te<ve.length;Te++){const ge=ve[Te];Mn(ge,W,G),z.add(ge)}else Mn(ve,W,G),z.add(ve)}),E=x.pop(),z},this.compileAsync=function(C,U,W=null){const z=this.compile(C,U,W);return new Promise(G=>{function ve(){if(z.forEach(function(Te){H.get(Te).currentProgram.isReady()&&z.delete(Te)}),z.size===0){G(C);return}setTimeout(ve,10)}ct.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let Ra=null;function Bu(C){Ra&&Ra(C)}function Ql(){Ti.stop()}function ec(){Ti.start()}const Ti=new gu;Ti.setAnimationLoop(Bu),typeof self<"u"&&Ti.setContext(self),this.setAnimationLoop=function(C){Ra=C,fe.setAnimationLoop(C),C===null?Ti.stop():Ti.start()},fe.addEventListener("sessionstart",Ql),fe.addEventListener("sessionend",ec),this.render=function(C,U){if(U!==void 0&&U.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(C,U);const W=fe.enabled===!0&&fe.isPresenting===!0,z=R!==null&&(Q===null||W)&&R.begin(L,Q);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(U),U=fe.getCamera()),C.isScene===!0&&C.onBeforeRender(L,C,U,Q),E=ie.get(C,x.length),E.init(U),E.state.textureUnits=Y.getTextureUnits(),x.push(E),nt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ye.setFromProjectionMatrix(nt,Bn,U.reversedDepth),Oe=this.localClippingEnabled,Ue=Ce.init(this.clippingPlanes,Oe),w=de.get(C,T.length),w.init(),T.push(w),fe.enabled===!0&&fe.isPresenting===!0){const Te=L.xr.getDepthSensingMesh();Te!==null&&Pa(Te,U,-1/0,L.sortObjects)}Pa(C,U,0,L.sortObjects),w.finish(),L.sortObjects===!0&&w.sort(Me,Ee,U.reversedDepth),yt=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,yt&&ze.addToRenderList(w,C),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ue===!0&&Ce.beginShadows();const G=E.state.shadowsArray;if(Ne.render(G,C,U),Ue===!0&&Ce.endShadows(),(z&&R.hasRenderPass())===!1){const Te=w.opaque,ge=w.transmissive;if(E.setupLights(),U.isArrayCamera){const Re=U.cameras;if(ge.length>0)for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le];nc(Te,ge,C,Qe)}yt&&ze.render(C);for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le];tc(w,C,Qe,Qe.viewport)}}else ge.length>0&&nc(Te,ge,C,U),yt&&ze.render(C),tc(w,C,U)}Q!==null&&V===0&&(Y.updateMultisampleRenderTarget(Q),Y.updateRenderTargetMipmap(Q)),z&&R.end(L),C.isScene===!0&&C.onAfterRender(L,C,U),he.resetDefaultState(),te=-1,ue=null,x.pop(),x.length>0?(E=x[x.length-1],Y.setTextureUnits(E.state.textureUnits),Ue===!0&&Ce.setGlobalState(L.clippingPlanes,E.state.camera)):E=null,T.pop(),T.length>0?w=T[T.length-1]:w=null,F!==null&&F.renderEnd()};function Pa(C,U,W,z){if(C.visible===!1)return;if(C.layers.test(U.layers)){if(C.isGroup)W=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(U);else if(C.isLightProbeGrid)E.pushLightProbeGrid(C);else if(C.isLight)E.pushLight(C),C.castShadow&&E.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Ye.intersectsSprite(C)){z&&vt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(nt);const Te=J.update(C),ge=C.material;ge.visible&&w.push(C,Te,ge,W,vt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Ye.intersectsObject(C))){const Te=J.update(C),ge=C.material;if(z&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),vt.copy(C.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),vt.copy(Te.boundingSphere.center)),vt.applyMatrix4(C.matrixWorld).applyMatrix4(nt)),Array.isArray(ge)){const Re=Te.groups;for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le],De=ge[Qe.materialIndex];De&&De.visible&&w.push(C,Te,De,W,vt.z,Qe)}}else ge.visible&&w.push(C,Te,ge,W,vt.z,null)}}const ve=C.children;for(let Te=0,ge=ve.length;Te<ge;Te++)Pa(ve[Te],U,W,z)}function tc(C,U,W,z){const{opaque:G,transmissive:ve,transparent:Te}=C;E.setupLightsView(W),Ue===!0&&Ce.setGlobalState(L.clippingPlanes,W),z&&y.viewport(me.copy(z)),G.length>0&&pr(G,U,W),ve.length>0&&pr(ve,U,W),Te.length>0&&pr(Te,U,W),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function nc(C,U,W,z){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[z.id]===void 0){const De=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[z.id]=new zn(1,1,{generateMipmaps:!0,type:De?ii:hn,minFilter:kn,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace})}const ve=E.state.transmissionRenderTarget[z.id],Te=z.viewport||me;ve.setSize(Te.z*L.transmissionResolutionScale,Te.w*L.transmissionResolutionScale);const ge=L.getRenderTarget(),Re=L.getActiveCubeFace(),Le=L.getActiveMipmapLevel();L.setRenderTarget(ve),L.getClearColor(xt),Fe=L.getClearAlpha(),Fe<1&&L.setClearColor(16777215,.5),L.clear(),yt&&ze.render(W);const $e=L.toneMapping;L.toneMapping=Vn;const Qe=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),E.setupLightsView(z),Ue===!0&&Ce.setGlobalState(L.clippingPlanes,z),pr(C,W,z),Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve),ct.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let _t=0,It=U.length;_t<It;_t++){const Pt=U[_t],{object:Mt,geometry:Kt,material:we,group:on}=Pt;if(we.side===Qt&&Mt.layers.test(z.layers)){const rt=we.side;we.side=en,we.needsUpdate=!0,ic(Mt,W,z,Kt,we,on),we.side=rt,we.needsUpdate=!0,De=!0}}De===!0&&(Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve))}L.setRenderTarget(ge,Re,Le),L.setClearColor(xt,Fe),Qe!==void 0&&(z.viewport=Qe),L.toneMapping=$e}function pr(C,U,W){const z=U.isScene===!0?U.overrideMaterial:null;for(let G=0,ve=C.length;G<ve;G++){const Te=C[G],{object:ge,geometry:Re,group:Le}=Te;let $e=Te.material;$e.allowOverride===!0&&z!==null&&($e=z),ge.layers.test(W.layers)&&ic(ge,U,W,Re,$e,Le)}}function ic(C,U,W,z,G,ve){C.onBeforeRender(L,U,W,z,G,ve),C.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),G.onBeforeRender(L,U,W,z,C,ve),G.transparent===!0&&G.side===Qt&&G.forceSinglePass===!1?(G.side=en,G.needsUpdate=!0,L.renderBufferDirect(W,U,z,G,C,ve),G.side=ni,G.needsUpdate=!0,L.renderBufferDirect(W,U,z,G,C,ve),G.side=Qt):L.renderBufferDirect(W,U,z,G,C,ve),C.onAfterRender(L,U,W,z,G,ve)}function mr(C,U,W){U.isScene!==!0&&(U=Tt);const z=H.get(C),G=E.state.lights,ve=E.state.shadowsArray,Te=G.state.version,ge=oe.getParameters(C,G.state,ve,U,W,E.state.lightProbeGridArray),Re=oe.getProgramCacheKey(ge);let Le=z.programs;z.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?U.environment:null,z.fog=U.fog;const $e=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;z.envMap=ae.get(C.envMap||z.environment,$e),z.envMapRotation=z.environment!==null&&C.envMap===null?U.environmentRotation:C.envMapRotation,Le===void 0&&(C.addEventListener("dispose",yn),Le=new Map,z.programs=Le);let Qe=Le.get(Re);if(Qe!==void 0){if(z.currentProgram===Qe&&z.lightsStateVersion===Te)return rc(C,ge),Qe}else ge.uniforms=oe.getUniforms(C),F!==null&&C.isNodeMaterial&&F.build(C,W,ge),C.onBeforeCompile(ge,L),Qe=oe.acquireProgram(ge,Re),Le.set(Re,Qe),z.uniforms=ge.uniforms;const De=z.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(De.clippingPlanes=Ce.uniform),rc(C,ge),z.needsLights=Hu(C),z.lightsStateVersion=Te,z.needsLights&&(De.ambientLightColor.value=G.state.ambient,De.lightProbe.value=G.state.probe,De.directionalLights.value=G.state.directional,De.directionalLightShadows.value=G.state.directionalShadow,De.spotLights.value=G.state.spot,De.spotLightShadows.value=G.state.spotShadow,De.rectAreaLights.value=G.state.rectArea,De.ltc_1.value=G.state.rectAreaLTC1,De.ltc_2.value=G.state.rectAreaLTC2,De.pointLights.value=G.state.point,De.pointLightShadows.value=G.state.pointShadow,De.hemisphereLights.value=G.state.hemi,De.directionalShadowMatrix.value=G.state.directionalShadowMatrix,De.spotLightMatrix.value=G.state.spotLightMatrix,De.spotLightMap.value=G.state.spotLightMap,De.pointShadowMatrix.value=G.state.pointShadowMatrix),z.lightProbeGrid=E.state.lightProbeGridArray.length>0,z.currentProgram=Qe,z.uniformsList=null,Qe}function sc(C){if(C.uniformsList===null){const U=C.currentProgram.getUniforms();C.uniformsList=aa.seqWithValue(U.seq,C.uniforms)}return C.uniformsList}function rc(C,U){const W=H.get(C);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function Vu(C,U){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let W=0,z=C.length;W<z;W++){const G=C[W];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function zu(C,U,W,z,G){U.isScene!==!0&&(U=Tt),Y.resetTextureUnits();const ve=U.fog,Te=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?U.environment:null,ge=Q===null?L.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:We.workingColorSpace,Re=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Le=ae.get(z.envMap||Te,Re),$e=z.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Qe=!!W.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),De=!!W.morphAttributes.position,_t=!!W.morphAttributes.normal,It=!!W.morphAttributes.color;let Pt=Vn;z.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Pt=L.toneMapping);const Mt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Kt=Mt!==void 0?Mt.length:0,we=H.get(z),on=E.state.lights;if(Ue===!0&&(Oe===!0||C!==ue)){const wt=C===ue&&z.id===te;Ce.setState(z,C,wt)}let rt=!1;z.version===we.__version?(we.needsLights&&we.lightsStateVersion!==on.state.version||we.outputColorSpace!==ge||G.isBatchedMesh&&we.batching===!1||!G.isBatchedMesh&&we.batching===!0||G.isBatchedMesh&&we.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&we.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&we.instancing===!1||!G.isInstancedMesh&&we.instancing===!0||G.isSkinnedMesh&&we.skinning===!1||!G.isSkinnedMesh&&we.skinning===!0||G.isInstancedMesh&&we.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&we.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&we.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&we.instancingMorph===!1&&G.morphTexture!==null||we.envMap!==Le||z.fog===!0&&we.fog!==ve||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Ce.numPlanes||we.numIntersection!==Ce.numIntersection)||we.vertexAlphas!==$e||we.vertexTangents!==Qe||we.morphTargets!==De||we.morphNormals!==_t||we.morphColors!==It||we.toneMapping!==Pt||we.morphTargetsCount!==Kt||!!we.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(rt=!0):(rt=!0,we.__version=z.version);let dn=we.currentProgram;rt===!0&&(dn=mr(z,U,G),F&&z.isNodeMaterial&&F.onUpdateProgram(z,dn,we));let Dn=!1,oi=!1,Vi=!1;const St=dn.getUniforms(),Lt=we.uniforms;if(y.useProgram(dn.program)&&(Dn=!0,oi=!0,Vi=!0),z.id!==te&&(te=z.id,oi=!0),we.needsLights){const wt=Vu(E.state.lightProbeGridArray,G);we.lightProbeGrid!==wt&&(we.lightProbeGrid=wt,oi=!0)}if(Dn||ue!==C){y.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),St.setValue(N,"projectionMatrix",C.projectionMatrix),St.setValue(N,"viewMatrix",C.matrixWorldInverse);const ci=St.map.cameraPosition;ci!==void 0&&ci.setValue(N,ut.setFromMatrixPosition(C.matrixWorld)),P.logarithmicDepthBuffer&&St.setValue(N,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&St.setValue(N,"isOrthographic",C.isOrthographicCamera===!0),ue!==C&&(ue=C,oi=!0,Vi=!0)}if(we.needsLights&&(on.state.directionalShadowMap.length>0&&St.setValue(N,"directionalShadowMap",on.state.directionalShadowMap,Y),on.state.spotShadowMap.length>0&&St.setValue(N,"spotShadowMap",on.state.spotShadowMap,Y),on.state.pointShadowMap.length>0&&St.setValue(N,"pointShadowMap",on.state.pointShadowMap,Y)),G.isSkinnedMesh){St.setOptional(N,G,"bindMatrix"),St.setOptional(N,G,"bindMatrixInverse");const wt=G.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),St.setValue(N,"boneTexture",wt.boneTexture,Y))}G.isBatchedMesh&&(St.setOptional(N,G,"batchingTexture"),St.setValue(N,"batchingTexture",G._matricesTexture,Y),St.setOptional(N,G,"batchingIdTexture"),St.setValue(N,"batchingIdTexture",G._indirectTexture,Y),St.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&St.setValue(N,"batchingColorTexture",G._colorsTexture,Y));const li=W.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&D.update(G,W,dn),(oi||we.receiveShadow!==G.receiveShadow)&&(we.receiveShadow=G.receiveShadow,St.setValue(N,"receiveShadow",G.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&U.environment!==null&&(Lt.envMapIntensity.value=U.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=Sx()),oi){if(St.setValue(N,"toneMappingExposure",L.toneMappingExposure),we.needsLights&&Gu(Lt,Vi),ve&&z.fog===!0&&Ae.refreshFogUniforms(Lt,ve),Ae.refreshMaterialUniforms(Lt,z,ne,re,E.state.transmissionRenderTarget[C.id]),we.needsLights&&we.lightProbeGrid){const wt=we.lightProbeGrid;Lt.probesSH.value=wt.texture,Lt.probesMin.value.copy(wt.boundingBox.min),Lt.probesMax.value.copy(wt.boundingBox.max),Lt.probesResolution.value.copy(wt.resolution)}aa.upload(N,sc(we),Lt,Y)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(aa.upload(N,sc(we),Lt,Y),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&St.setValue(N,"center",G.center),St.setValue(N,"modelViewMatrix",G.modelViewMatrix),St.setValue(N,"normalMatrix",G.normalMatrix),St.setValue(N,"modelMatrix",G.matrixWorld),z.uniformsGroups!==void 0){const wt=z.uniformsGroups;for(let ci=0,zi=wt.length;ci<zi;ci++){const ac=wt[ci];ee.update(ac,dn),ee.bind(ac,dn)}}return dn}function Gu(C,U){C.ambientLightColor.needsUpdate=U,C.lightProbe.needsUpdate=U,C.directionalLights.needsUpdate=U,C.directionalLightShadows.needsUpdate=U,C.pointLights.needsUpdate=U,C.pointLightShadows.needsUpdate=U,C.spotLights.needsUpdate=U,C.spotLightShadows.needsUpdate=U,C.rectAreaLights.needsUpdate=U,C.hemisphereLights.needsUpdate=U}function Hu(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(C,U,W){const z=H.get(C);z.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),H.get(C.texture).__webglTexture=U,H.get(C.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:W,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,U){const W=H.get(C);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(C,U=0,W=0){Q=C,q=U,V=W;let z=null,G=!1,ve=!1;if(C){const ge=H.get(C);if(ge.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(N.FRAMEBUFFER,ge.__webglFramebuffer),me.copy(C.viewport),ye.copy(C.scissor),qe=C.scissorTest,y.viewport(me),y.scissor(ye),y.setScissorTest(qe),te=-1;return}else if(ge.__webglFramebuffer===void 0)Y.setupRenderTarget(C);else if(ge.__hasExternalTextures)Y.rebindTextures(C,H.get(C.texture).__webglTexture,H.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const $e=C.depthTexture;if(ge.__boundDepthTexture!==$e){if($e!==null&&H.has($e)&&(C.width!==$e.image.width||C.height!==$e.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(C)}}const Re=C.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(ve=!0);const Le=H.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Le[U])?z=Le[U][W]:z=Le[U],G=!0):C.samples>0&&Y.useMultisampledRTT(C)===!1?z=H.get(C).__webglMultisampledFramebuffer:Array.isArray(Le)?z=Le[W]:z=Le,me.copy(C.viewport),ye.copy(C.scissor),qe=C.scissorTest}else me.copy(be).multiplyScalar(ne).floor(),ye.copy(Je).multiplyScalar(ne).floor(),qe=Ie;if(W!==0&&(z=B),y.bindFramebuffer(N.FRAMEBUFFER,z)&&y.drawBuffers(C,z),y.viewport(me),y.scissor(ye),y.setScissorTest(qe),G){const ge=H.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,W)}else if(ve){const ge=U;for(let Re=0;Re<C.textures.length;Re++){const Le=H.get(C.textures[Re]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Re,Le.__webglTexture,W,ge)}}else if(C!==null&&W!==0){const ge=H.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ge.__webglTexture,W)}te=-1},this.readRenderTargetPixels=function(C,U,W,z,G,ve,Te,ge=0){if(!(C&&C.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=H.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){y.bindFramebuffer(N.FRAMEBUFFER,Re);try{const Le=C.textures[ge],$e=Le.format,Qe=Le.type;if(C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!P.textureFormatReadable($e)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!P.textureTypeReadable(Qe)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=C.width-z&&W>=0&&W<=C.height-G&&N.readPixels(U,W,z,G,le.convert($e),le.convert(Qe),ve)}finally{const Le=Q!==null?H.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(C,U,W,z,G,ve,Te,ge=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=H.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(U>=0&&U<=C.width-z&&W>=0&&W<=C.height-G){y.bindFramebuffer(N.FRAMEBUFFER,Re);const Le=C.textures[ge],$e=Le.format,Qe=Le.type;if(C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!P.textureFormatReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!P.textureTypeReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const De=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,De),N.bufferData(N.PIXEL_PACK_BUFFER,ve.byteLength,N.STREAM_READ),N.readPixels(U,W,z,G,le.convert($e),le.convert(Qe),0);const _t=Q!==null?H.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,_t);const It=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Pd(N,It,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,De),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ve),N.deleteBuffer(De),N.deleteSync(It),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,U=null,W=0){const z=Math.pow(2,-W),G=Math.floor(C.image.width*z),ve=Math.floor(C.image.height*z),Te=U!==null?U.x:0,ge=U!==null?U.y:0;Y.setTexture2D(C,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,Te,ge,G,ve),y.unbindTexture()},this.copyTextureToTexture=function(C,U,W=null,z=null,G=0,ve=0){let Te,ge,Re,Le,$e,Qe,De,_t,It;const Pt=C.isCompressedTexture?C.mipmaps[ve]:C.image;if(W!==null)Te=W.max.x-W.min.x,ge=W.max.y-W.min.y,Re=W.isBox3?W.max.z-W.min.z:1,Le=W.min.x,$e=W.min.y,Qe=W.isBox3?W.min.z:0;else{const Lt=Math.pow(2,-G);Te=Math.floor(Pt.width*Lt),ge=Math.floor(Pt.height*Lt),C.isDataArrayTexture?Re=Pt.depth:C.isData3DTexture?Re=Math.floor(Pt.depth*Lt):Re=1,Le=0,$e=0,Qe=0}z!==null?(De=z.x,_t=z.y,It=z.z):(De=0,_t=0,It=0);const Mt=le.convert(U.format),Kt=le.convert(U.type);let we;U.isData3DTexture?(Y.setTexture3D(U,0),we=N.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Y.setTexture2DArray(U,0),we=N.TEXTURE_2D_ARRAY):(Y.setTexture2D(U,0),we=N.TEXTURE_2D),y.activeTexture(N.TEXTURE0),y.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,U.flipY),y.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),y.pixelStorei(N.UNPACK_ALIGNMENT,U.unpackAlignment);const on=y.getParameter(N.UNPACK_ROW_LENGTH),rt=y.getParameter(N.UNPACK_IMAGE_HEIGHT),dn=y.getParameter(N.UNPACK_SKIP_PIXELS),Dn=y.getParameter(N.UNPACK_SKIP_ROWS),oi=y.getParameter(N.UNPACK_SKIP_IMAGES);y.pixelStorei(N.UNPACK_ROW_LENGTH,Pt.width),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Pt.height),y.pixelStorei(N.UNPACK_SKIP_PIXELS,Le),y.pixelStorei(N.UNPACK_SKIP_ROWS,$e),y.pixelStorei(N.UNPACK_SKIP_IMAGES,Qe);const Vi=C.isDataArrayTexture||C.isData3DTexture,St=U.isDataArrayTexture||U.isData3DTexture;if(C.isDepthTexture){const Lt=H.get(C),li=H.get(U),wt=H.get(Lt.__renderTarget),ci=H.get(li.__renderTarget);y.bindFramebuffer(N.READ_FRAMEBUFFER,wt.__webglFramebuffer),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,ci.__webglFramebuffer);for(let zi=0;zi<Re;zi++)Vi&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,H.get(C).__webglTexture,G,Qe+zi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,H.get(U).__webglTexture,ve,It+zi)),N.blitFramebuffer(Le,$e,Te,ge,De,_t,Te,ge,N.DEPTH_BUFFER_BIT,N.NEAREST);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||C.isRenderTargetTexture||H.has(C)){const Lt=H.get(C),li=H.get(U);y.bindFramebuffer(N.READ_FRAMEBUFFER,K),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,O);for(let wt=0;wt<Re;wt++)Vi?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Lt.__webglTexture,G,Qe+wt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Lt.__webglTexture,G),St?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,li.__webglTexture,ve,It+wt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,li.__webglTexture,ve),G!==0?N.blitFramebuffer(Le,$e,Te,ge,De,_t,Te,ge,N.COLOR_BUFFER_BIT,N.NEAREST):St?N.copyTexSubImage3D(we,ve,De,_t,It+wt,Le,$e,Te,ge):N.copyTexSubImage2D(we,ve,De,_t,Le,$e,Te,ge);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else St?C.isDataTexture||C.isData3DTexture?N.texSubImage3D(we,ve,De,_t,It,Te,ge,Re,Mt,Kt,Pt.data):U.isCompressedArrayTexture?N.compressedTexSubImage3D(we,ve,De,_t,It,Te,ge,Re,Mt,Pt.data):N.texSubImage3D(we,ve,De,_t,It,Te,ge,Re,Mt,Kt,Pt):C.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ve,De,_t,Te,ge,Mt,Kt,Pt.data):C.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ve,De,_t,Pt.width,Pt.height,Mt,Pt.data):N.texSubImage2D(N.TEXTURE_2D,ve,De,_t,Te,ge,Mt,Kt,Pt);y.pixelStorei(N.UNPACK_ROW_LENGTH,on),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,rt),y.pixelStorei(N.UNPACK_SKIP_PIXELS,dn),y.pixelStorei(N.UNPACK_SKIP_ROWS,Dn),y.pixelStorei(N.UNPACK_SKIP_IMAGES,oi),ve===0&&U.generateMipmaps&&N.generateMipmap(we),y.unbindTexture()},this.initRenderTarget=function(C){H.get(C).__webglFramebuffer===void 0&&Y.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?Y.setTextureCube(C,0):C.isData3DTexture?Y.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Y.setTexture2DArray(C,0):Y.setTexture2D(C,0),y.unbindTexture()},this.resetState=function(){q=0,V=0,Q=null,y.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),t.unpackColorSpace=We._getUnpackColorSpace()}}class wx{constructor(e){A(this,"scene");A(this,"camera");A(this,"renderer");A(this,"dirLight");A(this,"ambientLight");this.scene=new lf,this.scene.background=new _e(657688),this.scene.fog=new Sa(657688,.025),this.camera=new jt(60,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(0,3,5),this.renderer=new bx({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Nh,this.renderer.toneMapping=bl,this.renderer.toneMappingExposure=1.3,this.setupLighting(),window.addEventListener("resize",()=>this.onWindowResize())}setupLighting(){this.ambientLight=new Wl(4212848,1),this.scene.add(this.ambientLight),this.dirLight=new ir(7702724,1.8),this.dirLight.position.set(20,40,-10),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.width=4096,this.dirLight.shadow.mapSize.height=4096,this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=150,this.dirLight.shadow.radius=3;const e=50;this.dirLight.shadow.camera.left=-e,this.dirLight.shadow.camera.right=e,this.dirLight.shadow.camera.top=e,this.dirLight.shadow.camera.bottom=-e,this.dirLight.shadow.bias=-3e-4,this.scene.add(this.dirLight)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}render(){this.renderer.render(this.scene,this.camera)}}class Tx{constructor(e){A(this,"keys",{});A(this,"mouseDeltaX",0);A(this,"mouseDeltaY",0);A(this,"isPointerLocked",!1);A(this,"onLeftClick",null);A(this,"onKick",null);A(this,"onJumpPress",null);A(this,"onInteract",null);A(this,"onSkipSubtitle",null);A(this,"onToggleDebug",null);A(this,"onSelectSpell",null);A(this,"onPointerLockChange",null);A(this,"ctrlDown",!1);A(this,"canvas");A(this,"touchAnalogX",0);A(this,"touchAnalogZ",0);A(this,"touchIsRunning",!1);this.canvas=e,this.initListeners()}initListeners(){window.addEventListener("keydown",e=>{var t,n,i;this.keys[e.code]=!0,(e.code==="Digit1"||e.code==="Numpad1")&&((t=this.onSelectSpell)==null||t.call(this,0)),(e.code==="Digit2"||e.code==="Numpad2")&&((n=this.onSelectSpell)==null||n.call(this,1)),(e.code==="Digit3"||e.code==="Numpad3")&&((i=this.onSelectSpell)==null||i.call(this,2)),e.code==="Space"&&this.onJumpPress&&this.onJumpPress(),(e.key==="Control"||e.code==="ControlLeft"||e.code==="ControlRight")&&(this.ctrlDown||(this.ctrlDown=!0,console.log("[InputManager] Control key down, firing onKick callback"),this.onKick&&this.onKick())),e.code==="KeyE"&&this.onInteract&&this.onInteract(),(e.code==="Space"||e.code==="Escape")&&this.onSkipSubtitle&&this.onSkipSubtitle(),e.code==="F3"&&(e.preventDefault(),this.onToggleDebug&&this.onToggleDebug())}),window.addEventListener("wheel",e=>{this.isPointerLocked&&this.onSelectSpell&&this.onSelectSpell(e.deltaY>0?1:0)}),window.addEventListener("keyup",e=>{this.keys[e.code]=!1,(e.key==="Control"||e.code==="ControlLeft"||e.code==="ControlRight")&&(this.ctrlDown=!1)}),document.addEventListener("mousemove",e=>{this.isPointerLocked&&(this.mouseDeltaX+=e.movementX,this.mouseDeltaY+=e.movementY)}),document.addEventListener("pointerlockchange",()=>{this.isPointerLocked=document.pointerLockElement===this.canvas,this.onPointerLockChange&&this.onPointerLockChange(this.isPointerLocked)}),this.canvas.addEventListener("mousedown",e=>{if(!this.isPointerLocked){this.requestPointerLock();return}e.button===0&&this.onLeftClick&&this.onLeftClick()})}requestPointerLock(){this.canvas.requestPointerLock()}exitPointerLock(){document.pointerLockElement&&document.exitPointerLock()}consumeMouseDelta(){const e={x:this.mouseDeltaX,y:this.mouseDeltaY};return this.mouseDeltaX=0,this.mouseDeltaY=0,e}triggerAttack(){this.onKick&&this.onKick(),this.onLeftClick&&this.onLeftClick()}triggerJump(){this.onJumpPress&&this.onJumpPress()}triggerInteract(){this.onInteract&&this.onInteract()}get moveForward(){return!!(this.keys.KeyW||this.keys.ArrowUp)||this.touchAnalogZ>.15}get moveBackward(){return!!(this.keys.KeyS||this.keys.ArrowDown)||this.touchAnalogZ<-.15}get moveLeft(){return!!(this.keys.KeyA||this.keys.ArrowLeft)||this.touchAnalogX<-.15}get moveRight(){return!!(this.keys.KeyD||this.keys.ArrowRight)||this.touchAnalogX>.15}get isRunning(){return!!(this.keys.ShiftLeft||this.keys.ShiftRight)||this.touchIsRunning}get isJumping(){return!!this.keys.Space}}class Ex{constructor(e){A(this,"inputManager");A(this,"container",null);A(this,"joystickBase",null);A(this,"joystickStick",null);A(this,"btnJump",null);A(this,"btnAttack",null);A(this,"btnRun",null);A(this,"joystickTouchId",null);A(this,"joystickCenter",{x:0,y:0});A(this,"maxRadius",55);A(this,"deadZone",.12);A(this,"cameraTouchId",null);A(this,"lastCameraPos",{x:0,y:0});this.inputManager=e,this.isTouchDevice()?this.init():console.log("[MobileTouchControls] Desktop mode detected. Touch controls hidden.")}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=1024}init(){console.log("[MobileTouchControls] Initializing mobile touch interface..."),this.createControlsHTML(),this.bindJoystickEvents(),this.bindButtonEvents(),this.bindCameraEvents()}createControlsHTML(){let e=document.getElementById("lisar-mobile-touch-overlay");e&&e.remove(),this.container=document.createElement("div"),this.container.id="lisar-mobile-touch-overlay",this.container.className="lisar-touch-overlay",this.container.innerHTML=`
      <!-- LEFT: 360° Virtual Analog Joystick -->
      <div id="touch-joystick-zone" class="touch-joystick-zone">
        <div id="touch-joystick-base" class="touch-joystick-base">
          <div class="joystick-arrow arrow-n">▲</div>
          <div class="joystick-arrow arrow-s">▼</div>
          <div class="joystick-arrow arrow-w">◀</div>
          <div class="joystick-arrow arrow-e">▶</div>
          <div id="touch-joystick-stick" class="touch-joystick-stick"></div>
        </div>
      </div>

      <!-- RIGHT: Ergonomic Action Buttons Arc -->
      <div id="touch-action-zone" class="touch-action-zone">
        <!-- JUMP BUTTON (Top of arc) -->
        <button id="touch-btn-jump" class="touch-btn touch-btn-jump" aria-label="Saltar">
          <span class="btn-icon">▲</span>
          <span class="btn-subtext">SALTO</span>
        </button>

        <!-- ATTACK BUTTON (Left/Center of arc) -->
        <button id="touch-btn-attack" class="touch-btn touch-btn-attack" aria-label="Atacar">
          <span class="btn-icon">⚡</span>
          <span class="btn-subtext">ATAQUE</span>
        </button>

        <!-- RUN BUTTON (Right/Bottom of arc) -->
        <button id="touch-btn-run" class="touch-btn touch-btn-run" aria-label="Correr">
          <span class="btn-icon">🏃</span>
          <span class="btn-subtext">CORRER</span>
        </button>
      </div>
    `,document.body.appendChild(this.container),this.joystickBase=document.getElementById("touch-joystick-base"),this.joystickStick=document.getElementById("touch-joystick-stick"),this.btnJump=document.getElementById("touch-btn-jump"),this.btnAttack=document.getElementById("touch-btn-attack"),this.btnRun=document.getElementById("touch-btn-run")}bindJoystickEvents(){if(!this.joystickBase||!this.joystickStick)return;const e=document.getElementById("touch-joystick-zone");if(!e)return;const t=s=>{if(s.preventDefault(),this.joystickTouchId===null)for(let a=0;a<s.changedTouches.length;a++){const o=s.changedTouches[a],l=this.joystickBase.getBoundingClientRect();this.joystickCenter={x:l.left+l.width/2,y:l.top+l.height/2},this.joystickTouchId=o.identifier,this.joystickBase.classList.add("active"),this.updateJoystickPosition(o.clientX,o.clientY);break}},n=s=>{if(s.preventDefault(),this.joystickTouchId!==null)for(let a=0;a<s.touches.length;a++){const o=s.touches[a];if(o.identifier===this.joystickTouchId){this.updateJoystickPosition(o.clientX,o.clientY);break}}},i=s=>{if(this.joystickTouchId!==null){for(let a=0;a<s.changedTouches.length;a++)if(s.changedTouches[a].identifier===this.joystickTouchId){this.resetJoystick();break}}};e.addEventListener("touchstart",t,{passive:!1}),window.addEventListener("touchmove",n,{passive:!1}),window.addEventListener("touchend",i,{passive:!1}),window.addEventListener("touchcancel",i,{passive:!1})}updateJoystickPosition(e,t){if(!this.joystickStick)return;let n=e-this.joystickCenter.x,i=t-this.joystickCenter.y;const s=Math.hypot(n,i);s>this.maxRadius&&(n=n/s*this.maxRadius,i=i/s*this.maxRadius),this.joystickStick.style.transform=`translate3d(${n}px, ${i}px, 0)`;let a=n/this.maxRadius,o=i/this.maxRadius;const l=Math.hypot(a,o);if(l<this.deadZone)this.inputManager.touchAnalogX=0,this.inputManager.touchAnalogZ=0;else{const c=(l-this.deadZone)/(1-this.deadZone);a=a/l*c,o=o/l*c,this.inputManager.touchAnalogX=a,this.inputManager.touchAnalogZ=-o}}resetJoystick(){this.joystickTouchId=null,this.inputManager.touchAnalogX=0,this.inputManager.touchAnalogZ=0,this.joystickStick&&(this.joystickStick.style.transform="translate3d(0px, 0px, 0)"),this.joystickBase&&this.joystickBase.classList.remove("active")}bindButtonEvents(){if(this.btnJump){const e=t=>{t.preventDefault(),t.stopPropagation(),this.animateButtonPress(this.btnJump),this.inputManager.triggerJump()};this.btnJump.addEventListener("touchstart",e,{passive:!1})}if(this.btnAttack){const e=t=>{t.preventDefault(),t.stopPropagation(),this.animateButtonPress(this.btnAttack),this.inputManager.triggerAttack()};this.btnAttack.addEventListener("touchstart",e,{passive:!1})}if(this.btnRun){const e=n=>{n.preventDefault(),n.stopPropagation(),this.btnRun.classList.add("active"),this.inputManager.touchIsRunning=!0},t=n=>{n.preventDefault(),this.btnRun.classList.remove("active"),this.inputManager.touchIsRunning=!1};this.btnRun.addEventListener("touchstart",e,{passive:!1}),this.btnRun.addEventListener("touchend",t,{passive:!1}),this.btnRun.addEventListener("touchcancel",t,{passive:!1})}}animateButtonPress(e){e.classList.add("pressed"),setTimeout(()=>e.classList.remove("pressed"),140)}bindCameraEvents(){window.addEventListener("touchstart",t=>{if(this.cameraTouchId===null)for(let n=0;n<t.changedTouches.length;n++){const i=t.changedTouches[n],s=i.target;if(!(s.closest(".touch-btn")||s.closest(".touch-joystick-zone")||s.closest(".hud-panel"))&&i.clientX>window.innerWidth*.35){this.cameraTouchId=i.identifier,this.lastCameraPos={x:i.clientX,y:i.clientY};break}}},{passive:!0}),window.addEventListener("touchmove",t=>{if(this.cameraTouchId!==null)for(let n=0;n<t.touches.length;n++){const i=t.touches[n];if(i.identifier===this.cameraTouchId){const s=i.clientX-this.lastCameraPos.x,a=i.clientY-this.lastCameraPos.y;this.lastCameraPos={x:i.clientX,y:i.clientY},this.inputManager.mouseDeltaX+=s*1.8,this.inputManager.mouseDeltaY+=a*1.8;break}}},{passive:!0});const e=t=>{if(this.cameraTouchId!==null){for(let n=0;n<t.changedTouches.length;n++)if(t.changedTouches[n].identifier===this.cameraTouchId){this.cameraTouchId=null;break}}};window.addEventListener("touchend",e,{passive:!0}),window.addEventListener("touchcancel",e,{passive:!0})}}class Ax{constructor(e){A(this,"touchControls");this.touchControls=new Ex(e)}}class Cx{constructor(){A(this,"ctx",null);A(this,"bgmAudio",null);A(this,"masterVolume",1);A(this,"musicVolume",.5);A(this,"sfxVolume",.8);A(this,"voiceVolume",.95);A(this,"isAudioUnlocked",!1);this.setupMobileTouchUnlock()}setupMobileTouchUnlock(){const e=()=>{if(!this.isAudioUnlocked){this.isAudioUnlocked=!0;try{const t=this.initCtx();t.state==="suspended"&&t.resume(),this.bgmAudio&&this.bgmAudio.paused&&this.bgmAudio.play().catch(n=>console.warn("[AudioManager] BGM unlock resume error:",n)),console.log("[AudioManager] ✅ Mobile WebAudio & BGM unlocked on first touch/click.")}catch(t){console.warn("[AudioManager] Audio unlock failed:",t)}}};window.addEventListener("touchstart",e,{once:!0}),window.addEventListener("touchend",e,{once:!0}),window.addEventListener("pointerdown",e,{once:!0}),window.addEventListener("click",e,{once:!0})}resume(){try{this.initCtx()}catch(e){console.warn("[AudioManager] Failed to resume AudioContext:",e)}}initCtx(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e}return this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}startBGM(){this.bgmAudio||(this.bgmAudio=new Audio("/magic-academy-3d/assets/Castle Dawn Escape.mp3"),this.bgmAudio.loop=!0,this.bgmAudio.volume=this.musicVolume*this.masterVolume,this.bgmAudio.play().catch(e=>{console.warn("[AudioManager] BGM autoplay blocked or failed to load:",e)}))}stopBGM(){this.bgmAudio&&(this.bgmAudio.pause(),this.bgmAudio.currentTime=0)}playHitImpact(){const e=this.initCtx(),t=e.currentTime,n=.9+Math.random()*.2,i=(.7+Math.random()*.2)*this.sfxVolume*this.masterVolume,s=e.createOscillator(),a=e.createGain();s.type="triangle",s.frequency.setValueAtTime(180*n,t),s.frequency.exponentialRampToValueAtTime(45*n,t+.12),a.gain.setValueAtTime(i,t),a.gain.exponentialRampToValueAtTime(.001,t+.14),s.connect(a),a.connect(e.destination),s.start(t),s.stop(t+.14)}playAttackGrunt(){const e=this.initCtx(),t=e.currentTime,n=.85*this.voiceVolume*this.masterVolume,i=e.createOscillator(),s=e.createBiquadFilter(),a=e.createGain(),o=[320,360,410],l=o[Math.floor(Math.random()*o.length)];i.type="sawtooth",i.frequency.setValueAtTime(l,t),i.frequency.exponentialRampToValueAtTime(l*.7,t+.18),s.type="bandpass",s.frequency.setValueAtTime(1100,t),s.Q.setValueAtTime(3,t),a.gain.setValueAtTime(n,t),a.gain.exponentialRampToValueAtTime(.01,t+.2),i.connect(s),s.connect(a),a.connect(e.destination),i.start(t),i.stop(t+.2)}playJumpGrunt(){if(Math.random()>.45)return;const e=this.initCtx(),t=e.currentTime,n=.7*this.voiceVolume*this.masterVolume,i=e.createOscillator(),s=e.createBiquadFilter(),a=e.createGain();i.type="sine",i.frequency.setValueAtTime(280,t),i.frequency.exponentialRampToValueAtTime(460,t+.15),s.type="bandpass",s.frequency.setValueAtTime(1300,t),s.Q.setValueAtTime(2.5,t),a.gain.setValueAtTime(n,t),a.gain.exponentialRampToValueAtTime(.01,t+.16),i.connect(s),s.connect(a),a.connect(e.destination),i.start(t),i.stop(t+.16)}playHurtGrunt(){const e=this.initCtx(),t=e.currentTime,n=.9*this.voiceVolume*this.masterVolume,i=e.createOscillator(),s=e.createBiquadFilter(),a=e.createGain();i.type="sawtooth",i.frequency.setValueAtTime(340,t),i.frequency.exponentialRampToValueAtTime(160,t+.22),s.type="lowpass",s.frequency.setValueAtTime(900,t),a.gain.setValueAtTime(n,t),a.gain.exponentialRampToValueAtTime(.01,t+.24),i.connect(s),s.connect(a),a.connect(e.destination),i.start(t),i.stop(t+.24)}playHardLandingGrunt(){const e=this.initCtx(),t=e.currentTime,n=.95*this.voiceVolume*this.masterVolume,i=e.createOscillator(),s=e.createBiquadFilter(),a=e.createGain();i.type="triangle",i.frequency.setValueAtTime(240,t),i.frequency.exponentialRampToValueAtTime(110,t+.32),s.type="lowpass",s.frequency.setValueAtTime(800,t),a.gain.setValueAtTime(n,t),a.gain.exponentialRampToValueAtTime(.01,t+.34),i.connect(s),s.connect(a),a.connect(e.destination),i.start(t),i.stop(t+.34)}playHardLandingImpact(e="stone"){const t=this.initCtx(),n=t.currentTime,i=.95*this.sfxVolume*this.masterVolume,s=t.createOscillator(),a=t.createGain();s.type="sine",s.frequency.setValueAtTime(120,n),s.frequency.exponentialRampToValueAtTime(30,n+.35),a.gain.setValueAtTime(i*1.2,n),a.gain.exponentialRampToValueAtTime(.001,n+.38),s.connect(a),a.connect(t.destination),s.start(n),s.stop(n+.38);const o=t.sampleRate*.3,l=t.createBuffer(1,o,t.sampleRate),c=l.getChannelData(0);for(let f=0;f<o;f++)c[f]=Math.random()*2-1;const h=t.createBufferSource();h.buffer=l;const u=t.createBiquadFilter();e==="grass"?(u.type="bandpass",u.frequency.setValueAtTime(1200,n)):e==="wood"?(u.type="lowpass",u.frequency.setValueAtTime(450,n)):(u.type="lowpass",u.frequency.setValueAtTime(800,n));const d=t.createGain();d.gain.setValueAtTime(i*.8,n),d.gain.exponentialRampToValueAtTime(.001,n+.28),h.connect(u),u.connect(d),d.connect(t.destination),h.start(n),h.stop(n+.28)}playFlipendoCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(220,t),n.frequency.exponentialRampToValueAtTime(800,t+.12),n.frequency.exponentialRampToValueAtTime(100,t+.35),i.gain.setValueAtTime(.4,t),i.gain.exponentialRampToValueAtTime(.01,t+.35),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.35)}playAlohomoraCast(){const e=this.initCtx(),t=e.currentTime;[659.25,880,1046.5,1318.5].forEach((n,i)=>{const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(n,t+i*.06),a.gain.setValueAtTime(.2,t+i*.06),a.gain.exponentialRampToValueAtTime(.001,t+i*.06+.4),s.connect(a),a.connect(e.destination),s.start(t+i*.06),s.stop(t+i*.06+.4)})}playLumosCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(440,t),n.frequency.linearRampToValueAtTime(880,t+.5),i.gain.setValueAtTime(.2,t),i.gain.exponentialRampToValueAtTime(.01,t+.5),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.5)}playPotShatter(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sawtooth",n.frequency.setValueAtTime(600,t),n.frequency.exponentialRampToValueAtTime(80,t+.15),i.gain.setValueAtTime(.35,t),i.gain.exponentialRampToValueAtTime(.01,t+.15),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.15)}playChestOpen(){const e=this.initCtx(),t=e.currentTime;[523.25,659.25,783.99,1046.5].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(i,t+s*.08),o.gain.setValueAtTime(.25,t+s*.08),o.gain.exponentialRampToValueAtTime(.001,t+s*.08+.5),a.connect(o),o.connect(e.destination),a.start(t+s*.08),a.stop(t+s*.08+.5)})}playLumosGargoyle(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(300,t),n.frequency.exponentialRampToValueAtTime(1200,t+.6),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.001,t+.6),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.6)}playBeanPickup(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(987.77,t),i.gain.setValueAtTime(.15,t),i.gain.exponentialRampToValueAtTime(.001,t+.08),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.08);const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(1318.51,t+.08),a.gain.setValueAtTime(0,t),a.gain.setValueAtTime(.15,t+.08),a.gain.exponentialRampToValueAtTime(.001,t+.3),s.connect(a),a.connect(e.destination),s.start(t+.08),s.stop(t+.3)}playCoinSpawnHarmonic(e){const t=this.initCtx(),n=t.currentTime,i=[523.25,587.33,659.25,783.99,880],s=Math.floor(e/i.length),a=Math.min(s,2),o=i[e%i.length]*Math.pow(2,a),l=t.createOscillator(),c=t.createGain();l.type="sine",l.frequency.setValueAtTime(o,n),l.frequency.exponentialRampToValueAtTime(o*1.05,n+.1),c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(.1,n+.02),c.gain.exponentialRampToValueAtTime(.001,n+.3),l.connect(c),c.connect(t.destination),l.start(n),l.stop(n+.3)}playFrogPickup(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(350,t),n.frequency.exponentialRampToValueAtTime(700,t+.2),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.001,t+.2),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.2)}playSpellSwitch(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(700,t),n.frequency.exponentialRampToValueAtTime(1400,t+.1),i.gain.setValueAtTime(.15,t),i.gain.exponentialRampToValueAtTime(.001,t+.12),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.12)}playPlayerHurt(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="square",n.frequency.setValueAtTime(180,t),n.frequency.exponentialRampToValueAtTime(60,t+.25),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.01,t+.25),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.25)}playPotionPickup(){const e=this.initCtx(),t=e.currentTime;[440,554.37,659.25,880].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="sine",a.frequency.setValueAtTime(i,t+s*.05),o.gain.setValueAtTime(.2,t+s*.05),o.gain.exponentialRampToValueAtTime(.001,t+s*.05+.3),a.connect(o),o.connect(e.destination),a.start(t+s*.05),a.stop(t+s*.05+.3)})}playSpellCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(300,t),n.frequency.exponentialRampToValueAtTime(1200,t+.25),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.01,t+.3),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.3)}playTargetHit(){const e=this.initCtx(),t=e.currentTime;[880,1320,1760].forEach((n,i)=>{const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(n,t+i*.05),a.gain.setValueAtTime(.2,t+i*.05),a.gain.exponentialRampToValueAtTime(.001,t+i*.05+.5),s.connect(a),a.connect(e.destination),s.start(t+i*.05),s.stop(t+i*.05+.5)})}playDoorOpen(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(80,t),n.frequency.linearRampToValueAtTime(140,t+1.2),i.gain.setValueAtTime(.2,t),i.gain.linearRampToValueAtTime(.01,t+1.5),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+1.5)}playCardPickup(){const e=this.initCtx(),t=e.currentTime;[523.25,659.25,783.99,1046.5].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(i,t+s*.06),o.gain.setValueAtTime(.25,t+s*.06),o.gain.exponentialRampToValueAtTime(.001,t+s*.06+.4),a.connect(o),o.connect(e.destination),a.start(t+s*.06),a.stop(t+s*.06+.4)})}playFootstep(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(120+Math.random()*20,t),n.frequency.exponentialRampToValueAtTime(40,t+.08),i.gain.setValueAtTime(.08,t),i.gain.exponentialRampToValueAtTime(.001,t+.08),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.08)}playEnemyStun(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sawtooth",n.frequency.setValueAtTime(400,t),n.frequency.exponentialRampToValueAtTime(100,t+.3),i.gain.setValueAtTime(.25,t),i.gain.exponentialRampToValueAtTime(.01,t+.3),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.3)}playVictoryJingle(){const e=this.initCtx(),t=e.currentTime,n=[{f:523.25,d:.2},{f:659.25,d:.2},{f:783.99,d:.2},{f:1046.5,d:.6}];let i=0;n.forEach(s=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(s.f,t+i),o.gain.setValueAtTime(.3,t+i),o.gain.exponentialRampToValueAtTime(.001,t+i+s.d),a.connect(o),o.connect(e.destination),a.start(t+i),a.stop(t+i+s.d),i+=s.d*.75})}}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.2
*/var mn=Uint8Array,ls=Uint16Array,Rx=Int32Array,wu=new mn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Tu=new mn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Px=new mn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Eu=function(r,e){for(var t=new ls(31),n=0;n<31;++n)t[n]=e+=1<<r[n-1];for(var i=new Rx(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)i[s]=s-t[n]<<5|n;return{b:t,r:i}},Au=Eu(wu,2),Cu=Au.b,Ix=Au.r;Cu[28]=258,Ix[258]=28;var Lx=Eu(Tu,0),Dx=Lx.b,ml=new ls(32768);for(var At=0;At<32768;++At){var _i=(At&43690)>>1|(At&21845)<<1;_i=(_i&52428)>>2|(_i&13107)<<2,_i=(_i&61680)>>4|(_i&3855)<<4,ml[At]=((_i&65280)>>8|(_i&255)<<8)>>1}var Ws=function(r,e,t){for(var n=r.length,i=0,s=new ls(e);i<n;++i)r[i]&&++s[r[i]-1];var a=new ls(e);for(i=1;i<e;++i)a[i]=a[i-1]+s[i-1]<<1;var o;if(t){o=new ls(1<<e);var l=15-e;for(i=0;i<n;++i)if(r[i])for(var c=i<<4|r[i],h=e-r[i],u=a[r[i]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)o[ml[u]>>l]=c}else for(o=new ls(n),i=0;i<n;++i)r[i]&&(o[i]=ml[a[r[i]-1]++]>>15-r[i]);return o},ur=new mn(288);for(var At=0;At<144;++At)ur[At]=8;for(var At=144;At<256;++At)ur[At]=9;for(var At=256;At<280;++At)ur[At]=7;for(var At=280;At<288;++At)ur[At]=8;var Ru=new mn(32);for(var At=0;At<32;++At)Ru[At]=5;var Fx=Ws(ur,9,1),Nx=Ws(Ru,5,1),po=function(r){for(var e=r[0],t=1;t<r.length;++t)r[t]>e&&(e=r[t]);return e},Tn=function(r,e,t){var n=e/8|0;return(r[n]|r[n+1]<<8)>>(e&7)&t},mo=function(r,e){var t=e/8|0;return(r[t]|r[t+1]<<8|r[t+2]<<16)>>(e&7)},Ux=function(r){return(r+7)/8|0},Ox=function(r,e,t){return(t==null||t>r.length)&&(t=r.length),new mn(r.subarray(e,t))},kx=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],En=function(r,e,t){var n=new Error(e||kx[r]);if(n.code=r,Error.captureStackTrace&&Error.captureStackTrace(n,En),!t)throw n;return n},Bx=function(r,e,t,n){var i=r.length,s=0;if(!i||e.f&&!e.l)return t||new mn(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new mn(i*3));var c=function(be){var Je=t.length;if(be>Je){var Ie=new mn(Math.max(Je*2,be));Ie.set(t),t=Ie}},h=e.f||0,u=e.p||0,d=e.b||0,f=e.l,p=e.d,_=e.m,m=e.n,g=i*8;do{if(!f){h=Tn(r,u,1);var S=Tn(r,u+1,3);if(u+=3,S)if(S==1)f=Fx,p=Nx,_=9,m=5;else if(S==2){var E=Tn(r,u,31)+257,T=Tn(r,u+10,15)+4,x=E+Tn(r,u+5,31)+1;u+=14;for(var R=new mn(x),L=new mn(19),I=0;I<T;++I)L[Px[I]]=Tn(r,u+I*3,7);u+=T*3;for(var F=po(L),B=(1<<F)-1,K=Ws(L,F,1),I=0;I<x;){var O=K[Tn(r,u,B)];u+=O&15;var M=O>>4;if(M<16)R[I++]=M;else{var q=0,V=0;for(M==16?(V=3+Tn(r,u,3),u+=2,q=R[I-1]):M==17?(V=3+Tn(r,u,7),u+=3):M==18&&(V=11+Tn(r,u,127),u+=7);V--;)R[I++]=q}}var Q=R.subarray(0,E),te=R.subarray(E);_=po(Q),m=po(te),f=Ws(Q,_,1),p=Ws(te,m,1)}else En(1);else{var M=Ux(u)+4,v=r[M-4]|r[M-3]<<8,w=M+v;if(w>i){l&&En(0);break}o&&c(d+v),t.set(r.subarray(M,w),d),e.b=d+=v,e.p=u=w*8,e.f=h;continue}if(u>g){l&&En(0);break}}o&&c(d+131072);for(var ue=(1<<_)-1,me=(1<<m)-1,ye=u;;ye=u){var q=f[mo(r,u)&ue],qe=q>>4;if(u+=q&15,u>g){l&&En(0);break}if(q||En(2),qe<256)t[d++]=qe;else if(qe==256){ye=u,f=null;break}else{var xt=qe-254;if(qe>264){var I=qe-257,Fe=wu[I];xt=Tn(r,u,(1<<Fe)-1)+Cu[I],u+=Fe}var X=p[mo(r,u)&me],re=X>>4;X||En(3),u+=X&15;var te=Dx[re];if(re>3){var Fe=Tu[re];te+=mo(r,u)&(1<<Fe)-1,u+=Fe}if(u>g){l&&En(0);break}o&&c(d+131072);var ne=d+xt;if(d<te){var Me=s-te,Ee=Math.min(te,ne);for(Me+d<0&&En(3);d<Ee;++d)t[d]=n[Me+d]}for(;d<ne;++d)t[d]=t[d-te]}}e.l=f,e.p=ye,e.b=d,e.f=h,f&&(h=1,e.m=_,e.d=p,e.n=m)}while(!h);return d!=t.length&&a?Ox(t,0,d):t.subarray(0,d)},Vx=new mn(0),zx=function(r,e){return((r[0]&15)!=8||r[0]>>4>7||(r[0]<<8|r[1])%31)&&En(6,"invalid zlib data"),(r[1]>>5&1)==1&&En(6,"invalid zlib data: "+(r[1]&32?"need":"unexpected")+" dictionary"),(r[1]>>3&4)+2};function Gx(r,e){return Bx(r.subarray(zx(r),-4),{i:2},e,e)}var Hx=typeof TextDecoder<"u"&&new TextDecoder,Wx=0;try{Hx.decode(Vx,{stream:!0}),Wx=1}catch{}function Pu(r,e,t){const n=t.length-r-1;if(e>=t[n])return n-1;if(e<=t[r])return r;let i=r,s=n,a=Math.floor((i+s)/2);for(;e<t[a]||e>=t[a+1];)e<t[a]?s=a:i=a,a=Math.floor((i+s)/2);return a}function Xx(r,e,t,n){const i=[],s=[],a=[];i[0]=1;for(let o=1;o<=t;++o){s[o]=e-n[r+1-o],a[o]=n[r+o]-e;let l=0;for(let c=0;c<o;++c){const h=a[c+1],u=s[o-c],d=i[c]/(h+u);i[c]=l+h*d,l=u*d}i[o]=l}return i}function qx(r,e,t,n){const i=Pu(r,n,e),s=Xx(i,n,r,e),a=new at(0,0,0,0);for(let o=0;o<=r;++o){const l=t[i-r+o],c=s[o],h=l.w*c;a.x+=l.x*h,a.y+=l.y*h,a.z+=l.z*h,a.w+=l.w*c}return a}function Yx(r,e,t,n,i){const s=[];for(let u=0;u<=t;++u)s[u]=0;const a=[];for(let u=0;u<=n;++u)a[u]=s.slice(0);const o=[];for(let u=0;u<=t;++u)o[u]=s.slice(0);o[0][0]=1;const l=s.slice(0),c=s.slice(0);for(let u=1;u<=t;++u){l[u]=e-i[r+1-u],c[u]=i[r+u]-e;let d=0;for(let f=0;f<u;++f){const p=c[f+1],_=l[u-f];o[u][f]=p+_;const m=o[f][u-1]/o[u][f];o[f][u]=d+p*m,d=_*m}o[u][u]=d}for(let u=0;u<=t;++u)a[0][u]=o[u][t];for(let u=0;u<=t;++u){let d=0,f=1;const p=[];for(let _=0;_<=t;++_)p[_]=s.slice(0);p[0][0]=1;for(let _=1;_<=n;++_){let m=0;const g=u-_,S=t-_;u>=_&&(p[f][0]=p[d][0]/o[S+1][g],m=p[f][0]*o[g][S]);const M=g>=-1?1:-g,v=u-1<=S?_-1:t-u;for(let E=M;E<=v;++E)p[f][E]=(p[d][E]-p[d][E-1])/o[S+1][g+E],m+=p[f][E]*o[g+E][S];u<=S&&(p[f][_]=-p[d][_-1]/o[S+1][u],m+=p[f][_]*o[u][S]),a[_][u]=m;const w=d;d=f,f=w}}let h=t;for(let u=1;u<=n;++u){for(let d=0;d<=t;++d)a[u][d]*=h;h*=t-u}return a}function Kx(r,e,t,n,i){const s=i<r?i:r,a=[],o=Pu(r,n,e),l=Yx(o,n,r,s,e),c=[];for(let h=0;h<t.length;++h){const u=t[h].clone(),d=u.w;u.x*=d,u.y*=d,u.z*=d,c[h]=u}for(let h=0;h<=s;++h){const u=c[o-r].clone().multiplyScalar(l[h][0]);for(let d=1;d<=r;++d)u.add(c[o-r+d].clone().multiplyScalar(l[h][d]));a[h]=u}for(let h=s+1;h<=i+1;++h)a[h]=new at(0,0,0);return a}function $x(r,e){let t=1;for(let i=2;i<=r;++i)t*=i;let n=1;for(let i=2;i<=e;++i)n*=i;for(let i=2;i<=r-e;++i)n*=i;return t/n}function Zx(r){const e=r.length,t=[],n=[];for(let s=0;s<e;++s){const a=r[s];t[s]=new b(a.x,a.y,a.z),n[s]=a.w}const i=[];for(let s=0;s<e;++s){const a=t[s].clone();for(let o=1;o<=s;++o)a.sub(i[s-o].clone().multiplyScalar($x(s,o)*n[o]));i[s]=a.divideScalar(n[0])}return i}function Jx(r,e,t,n,i){const s=Kx(r,e,t,n,i);return Zx(s)}class jx extends bf{constructor(e,t,n,i,s){super();const a=t?t.length-1:0,o=n?n.length:0;this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=s||a;for(let l=0;l<o;++l){const c=n[l];this.controlPoints[l]=new at(c.x,c.y,c.z,c.w)}}getPoint(e,t=new b){const n=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),s=qx(this.degree,this.knots,this.controlPoints,i);return s.w!==1&&s.divideScalar(s.w),n.set(s.x,s.y,s.z)}getTangent(e,t=new b){const n=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),s=Jx(this.degree,this.knots,this.controlPoints,i,1);return n.copy(s[1]).normalize(),n}toJSON(){const e=super.toJSON();return e.degree=this.degree,e.knots=[...this.knots],e.controlPoints=this.controlPoints.map(t=>t.toArray()),e.startKnot=this.startKnot,e.endKnot=this.endKnot,e}fromJSON(e){return super.fromJSON(e),this.degree=e.degree,this.knots=[...e.knots],this.controlPoints=e.controlPoints.map(t=>new at(t[0],t[1],t[2],t[3])),this.startKnot=e.startKnot,this.endKnot=e.endKnot,this}}let Ze,Dt,Xt;class Qx extends ri{constructor(e){super(e)}load(e,t,n,i){const s=this,a=s.path===""?ds.extractUrlBase(e):s.path,o=new Gl(this.manager);o.setPath(s.path),o.setResponseType("arraybuffer"),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(l){try{t(s.parse(l,a))}catch(c){i?i(c):console.error(c),s.manager.itemError(e)}},n,i)}parse(e,t){if(rv(e))Ze=new sv().parse(e);else{const i=Du(e);if(!av(i))throw new Error("THREE.FBXLoader: Unknown format.");if(Ah(i)<7e3)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+Ah(i));Ze=new iv().parse(i)}const n=new du(this.manager).setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);return new ev(n,this.manager).parse(Ze)}}class ev{constructor(e,t){this.textureLoader=e,this.manager=t}parse(){Dt=this.parseConnections();const e=this.parseImages(),t=this.parseTextures(e),n=this.parseMaterials(t),i=this.parseDeformers(),s=new tv().parse(i);return this.parseScene(i,s,n),Xt}parseConnections(){const e=new Map;return"Connections"in Ze&&Ze.Connections.connections.forEach(function(n){const i=n[0],s=n[1],a=n[2];e.has(i)||e.set(i,{parents:[],children:[]});const o={ID:s,relationship:a};e.get(i).parents.push(o),e.has(s)||e.set(s,{parents:[],children:[]});const l={ID:i,relationship:a};e.get(s).children.push(l)}),e}parseImages(){const e={},t={};if("Video"in Ze.Objects){const n=Ze.Objects.Video;for(const i in n){const s=n[i],a=parseInt(i);if(e[a]=s.RelativeFilename||s.Filename,"Content"in s){const o=s.Content instanceof ArrayBuffer&&s.Content.byteLength>0,l=typeof s.Content=="string"&&s.Content!=="";if(o||l){const c=this.parseImage(n[i]);t[s.RelativeFilename||s.Filename]=c}}}}for(const n in e){const i=e[n];t[i]!==void 0?e[n]=t[i]:e[n]=e[n].split("\\").pop()}return e}parseImage(e){const t=e.Content,n=e.RelativeFilename||e.Filename,i=n.slice(n.lastIndexOf(".")+1).toLowerCase();let s;switch(i){case"bmp":s="image/bmp";break;case"jpg":case"jpeg":s="image/jpeg";break;case"png":s="image/png";break;case"tif":s="image/tiff";break;case"tga":this.manager.getHandler(".tga")===null&&console.warn("FBXLoader: TGA loader not found, skipping ",n),s="image/tga";break;case"webp":s="image/webp";break;default:console.warn('FBXLoader: Image type "'+i+'" is not supported.');return}if(typeof t=="string")return"data:"+s+";base64,"+t;{const a=new Uint8Array(t);return window.URL.createObjectURL(new Blob([a],{type:s}))}}parseTextures(e){const t=new Map;if("Texture"in Ze.Objects){const n=Ze.Objects.Texture;for(const i in n){const s=this.parseTexture(n[i],e);t.set(parseInt(i),s)}}return t}parseTexture(e,t){const n=this.loadTexture(e,t);n.ID=e.id,n.name=e.attrName;const i=e.WrapModeU,s=e.WrapModeV,a=i!==void 0?i.value:0,o=s!==void 0?s.value:0;if(n.wrapS=a===0?Jt:gn,n.wrapT=o===0?Jt:gn,"Scaling"in e){const l=e.Scaling.value;n.repeat.x=l[0],n.repeat.y=l[1]}if("Translation"in e){const l=e.Translation.value;n.offset.x=l[0],n.offset.y=l[1]}return n}loadTexture(e,t){const n=e.FileName.split(".").pop().toLowerCase();let i=this.manager.getHandler(`.${n}`);i===null&&(i=this.textureLoader);const s=i.path;s||i.setPath(this.textureLoader.path);const a=Dt.get(e.id).children;let o;if(a!==void 0&&a.length>0&&t[a[0].ID]!==void 0&&(o=t[a[0].ID],(o.indexOf("blob:")===0||o.indexOf("data:")===0)&&i.setPath(void 0)),o===void 0)return console.warn("FBXLoader: Undefined filename, creating placeholder texture."),new Bt;const l=i.load(o);return i.setPath(s),l}parseMaterials(e){const t=new Map;if("Material"in Ze.Objects){const n=Ze.Objects.Material;for(const i in n){const s=this.parseMaterial(n[i],e);s!==null&&t.set(parseInt(i),s)}}return t}parseMaterial(e,t){const n=e.id,i=e.attrName;let s=e.ShadingModel;if(typeof s=="object"&&(s=s.value),!Dt.has(n))return null;const a=this.parseParameters(e,t,n);let o;switch(s.toLowerCase()){case"phong":o=new zr;break;case"lambert":o=new Yf;break;default:console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.',s),o=new zr;break}return o.setValues(a),o.name=i,o}parseParameters(e,t,n){const i={};e.BumpFactor&&(i.bumpScale=e.BumpFactor.value),e.Diffuse?i.color=We.colorSpaceToWorking(new _e().fromArray(e.Diffuse.value),dt):e.DiffuseColor&&(e.DiffuseColor.type==="Color"||e.DiffuseColor.type==="ColorRGB")&&(i.color=We.colorSpaceToWorking(new _e().fromArray(e.DiffuseColor.value),dt)),e.DisplacementFactor&&(i.displacementScale=e.DisplacementFactor.value),e.Emissive?i.emissive=We.colorSpaceToWorking(new _e().fromArray(e.Emissive.value),dt):e.EmissiveColor&&(e.EmissiveColor.type==="Color"||e.EmissiveColor.type==="ColorRGB")&&(i.emissive=We.colorSpaceToWorking(new _e().fromArray(e.EmissiveColor.value),dt)),e.EmissiveFactor&&(i.emissiveIntensity=parseFloat(e.EmissiveFactor.value)),i.opacity=1-(e.TransparencyFactor?parseFloat(e.TransparencyFactor.value):0),(i.opacity===1||i.opacity===0)&&(i.opacity=e.Opacity?parseFloat(e.Opacity.value):null,i.opacity===null&&(i.opacity=1)),i.opacity<1&&(i.transparent=!0),e.ReflectionFactor&&(i.reflectivity=e.ReflectionFactor.value),e.Shininess&&(i.shininess=e.Shininess.value),e.Specular?i.specular=We.colorSpaceToWorking(new _e().fromArray(e.Specular.value),dt):e.SpecularColor&&e.SpecularColor.type==="Color"&&(i.specular=We.colorSpaceToWorking(new _e().fromArray(e.SpecularColor.value),dt));const s=this;return Dt.get(n).children.forEach(function(a){const o=a.relationship;switch(o){case"Bump":i.bumpMap=s.getTexture(t,a.ID);break;case"Maya|TEX_ao_map":i.aoMap=s.getTexture(t,a.ID);break;case"DiffuseColor":case"Maya|TEX_color_map":i.map=s.getTexture(t,a.ID),i.map!==void 0&&(i.map.colorSpace=dt);break;case"DisplacementColor":i.displacementMap=s.getTexture(t,a.ID);break;case"EmissiveColor":i.emissiveMap=s.getTexture(t,a.ID),i.emissiveMap!==void 0&&(i.emissiveMap.colorSpace=dt);break;case"NormalMap":case"Maya|TEX_normal_map":i.normalMap=s.getTexture(t,a.ID);break;case"ReflectionColor":i.envMap=s.getTexture(t,a.ID),i.envMap!==void 0&&(i.envMap.mapping=Qr,i.envMap.colorSpace=dt);break;case"SpecularColor":i.specularMap=s.getTexture(t,a.ID),i.specularMap!==void 0&&(i.specularMap.colorSpace=dt);break;case"TransparentColor":case"TransparencyFactor":i.alphaMap=s.getTexture(t,a.ID),i.transparent=!0;break;case"AmbientColor":case"ShininessExponent":case"SpecularFactor":case"VectorDisplacementColor":default:console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.",o);break}}),i}getTexture(e,t){return"LayeredTexture"in Ze.Objects&&t in Ze.Objects.LayeredTexture&&(console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."),t=Dt.get(t).children[0].ID),e.get(t)}parseDeformers(){const e={},t={};if("Deformer"in Ze.Objects){const n=Ze.Objects.Deformer;for(const i in n){const s=n[i],a=Dt.get(parseInt(i));if(s.attrType==="Skin"){const o=this.parseSkeleton(a,n);o.ID=i,a.parents.length>1&&console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."),o.geometryID=a.parents[0].ID,e[i]=o}else if(s.attrType==="BlendShape"){const o={id:i};o.rawTargets=this.parseMorphTargets(a,n),o.id=i,a.parents.length>1&&console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."),t[i]=o}}}return{skeletons:e,morphTargets:t}}parseSkeleton(e,t){const n=[];return e.children.forEach(function(i){const s=t[i.ID];if(s.attrType!=="Cluster")return;const a={ID:i.ID,indices:[],weights:[],transformLink:new Se().fromArray(s.TransformLink.a)};"Indexes"in s&&(a.indices=s.Indexes.a,a.weights=s.Weights.a),n.push(a)}),{rawBones:n,bones:[]}}parseMorphTargets(e,t){const n=[];for(let i=0;i<e.children.length;i++){const s=e.children[i],a=t[s.ID],o={name:a.attrName,initialWeight:a.DeformPercent,id:a.id,fullWeights:a.FullWeights.a};if(a.attrType!=="BlendShapeChannel")return;o.geoID=Dt.get(parseInt(s.ID)).children.filter(function(l){return l.relationship===void 0})[0].ID,n.push(o)}return n}parseScene(e,t,n){Xt=new lt;const i=this.parseModels(e.skeletons,t,n),s=Ze.Objects.Model,a=this;i.forEach(function(u){const d=s[u.ID];a.setLookAtProperties(u,d),Dt.get(u.ID).parents.forEach(function(p){const _=i.get(p.ID);_!==void 0&&_.add(u)}),u.parent===null&&Xt.add(u)}),this.addGlobalSceneSettings(),Xt.traverse(function(u){if(u.userData.transformData){u.parent&&(u.userData.transformData.parentMatrix=u.parent.matrix,u.userData.transformData.parentMatrixWorld=u.parent.matrixWorld);const d=Lu(u.userData.transformData);u.applyMatrix4(d),u.updateWorldMatrix()}});const o=this.parsePoseNodes(),l=new Set;for(const u in e.skeletons)e.skeletons[u].rawBones.forEach(function(d,f){const p=e.skeletons[u].bones[f];p&&l.add(p.ID)});const c=new Se;Xt.traverse(function(u){if(u.isBone&&u.ID!==void 0&&!l.has(u.ID)){const d=o[u.ID];d!==void 0&&(u.parent?(c.copy(u.parent.matrixWorld).invert(),c.multiply(d)):c.copy(d),c.decompose(u.position,u.quaternion,u.scale),u.updateMatrix(),u.matrixWorld.copy(d))}}),this.bindSkeleton(e.skeletons,t,i);const h=new nv().parse();Xt.children.length===1&&Xt.children[0].isGroup&&(Xt.children[0].animations=h,Xt=Xt.children[0]),Xt.animations=h,"GlobalSettings"in Ze&&"UpAxis"in Ze.GlobalSettings&&Ze.GlobalSettings.UpAxis.value===2&&(console.warn("THREE.FBXLoader: You are loading an asset with a Z-UP coordinate system. The loader just rotates the asset to transform it into Y-UP. The vertex data are not converted."),Xt.rotation.set(-Math.PI/2,0,0))}parseModels(e,t,n){const i=new Map,s=Ze.Objects.Model;for(const a in s){const o=parseInt(a),l=s[a],c=Dt.get(o);let h=this.buildSkeleton(c,e,o,l.attrName);if(!h){switch(l.attrType){case"Camera":h=this.createCamera(c);break;case"Light":h=this.createLight(c);break;case"Mesh":h=this.createMesh(c,t,n);break;case"NurbsCurve":h=this.createCurve(c,t);break;case"LimbNode":case"Root":h=new pa;break;case"Null":default:h=new lt;break}h.name=l.attrName?it.sanitizeNodeName(l.attrName):"",h.userData.originalName=l.attrName,h.ID=o}this.getTransformData(h,l),i.set(o,h)}return i}buildSkeleton(e,t,n,i){let s=null;return e.parents.forEach(function(a){for(const o in t){const l=t[o];l.rawBones.forEach(function(c,h){if(c.ID===a.ID){const u=s;s=new pa,s.matrixWorld.copy(c.transformLink),s.name=i?it.sanitizeNodeName(i):"",s.userData.originalName=i,s.ID=n,l.bones[h]=s,u!==null&&s.add(u)}})}}),s}createCamera(e){let t,n;if(e.children.forEach(function(i){const s=Ze.Objects.NodeAttribute[i.ID];s!==void 0&&(n=s)}),n===void 0)t=new ht;else{let i=0;n.CameraProjectionType!==void 0&&n.CameraProjectionType.value===1&&(i=1);let s=1;n.NearPlane!==void 0&&(s=n.NearPlane.value/1e3);let a=1e3;n.FarPlane!==void 0&&(a=n.FarPlane.value/1e3);let o=window.innerWidth,l=window.innerHeight;n.AspectWidth!==void 0&&n.AspectHeight!==void 0&&(o=n.AspectWidth.value,l=n.AspectHeight.value);const c=o/l;let h=45;n.FieldOfView!==void 0&&(h=n.FieldOfView.value);const u=n.FocalLength?n.FocalLength.value:null;switch(i){case 0:t=new jt(h,c,s,a),u!==null&&t.setFocalLength(u);break;case 1:console.warn("THREE.FBXLoader: Orthographic cameras not supported yet."),t=new ht;break;default:console.warn("THREE.FBXLoader: Unknown camera type "+i+"."),t=new ht;break}}return t}createLight(e){let t,n;if(e.children.forEach(function(i){const s=Ze.Objects.NodeAttribute[i.ID];s!==void 0&&(n=s)}),n===void 0)t=new ht;else{let i;n.LightType===void 0?i=0:i=n.LightType.value;let s=16777215;n.Color!==void 0&&(s=We.colorSpaceToWorking(new _e().fromArray(n.Color.value),dt));let a=n.Intensity===void 0?1:n.Intensity.value/100;n.CastLightOnObject!==void 0&&n.CastLightOnObject.value===0&&(a=0);let o=0;n.FarAttenuationEnd!==void 0&&(n.EnableFarAttenuation!==void 0&&n.EnableFarAttenuation.value===0?o=0:o=n.FarAttenuationEnd.value);const l=1;switch(i){case 0:t=new sn(s,a,o,l);break;case 1:t=new ir(s,a);break;case 2:let c=Math.PI/3,h=0;n.OuterAngle!==void 0?(c=mt.degToRad(n.OuterAngle.value),n.InnerAngle!==void 0&&(h=1-n.InnerAngle.value/n.OuterAngle.value,h=Math.max(0,h))):n.InnerAngle!==void 0&&(c=mt.degToRad(n.InnerAngle.value)),t=new pu(s,a,o,c,h,l);break;default:console.warn("THREE.FBXLoader: Unknown light type "+n.LightType.value+", defaulting to a PointLight."),t=new sn(s,a);break}n.CastShadows!==void 0&&n.CastShadows.value===1&&(t.castShadow=!0)}return t}createMesh(e,t,n){let i,s=null,a=null;const o=[];if(e.children.forEach(function(l){t.has(l.ID)&&(s=t.get(l.ID)),n.has(l.ID)&&o.push(n.get(l.ID))}),o.length>1?a=o:o.length>0?a=o[0]:(a=new zr({name:ri.DEFAULT_MATERIAL_NAME,color:13421772}),o.push(a)),"color"in s.attributes&&o.forEach(function(l){l.vertexColors=!0}),s.groups.length>0){let l=!1;for(let c=0,h=s.groups.length;c<h;c++){const u=s.groups[c];(u.materialIndex<0||u.materialIndex>=o.length)&&(u.materialIndex=o.length,l=!0)}if(l){const c=new zr;o.push(c)}}return s.FBX_Deformer?(i=new tu(s,a),i.normalizeSkinWeights()):i=new j(s,a),i}createCurve(e,t){const n=e.children.reduce(function(s,a){return t.has(a.ID)&&(s=t.get(a.ID)),s},null),i=new ba({name:ri.DEFAULT_MATERIAL_NAME,color:3342591,linewidth:1});return new wa(n,i)}getTransformData(e,t){const n={};"InheritType"in t&&(n.inheritType=parseInt(t.InheritType.value)),"RotationOrder"in t?n.eulerOrder=rr(t.RotationOrder.value):n.eulerOrder=rr(0),"Lcl_Translation"in t&&(n.translation=t.Lcl_Translation.value),"PreRotation"in t&&(n.preRotation=t.PreRotation.value),"Lcl_Rotation"in t&&(n.rotation=t.Lcl_Rotation.value),"PostRotation"in t&&(n.postRotation=t.PostRotation.value),"Lcl_Scaling"in t&&(n.scale=t.Lcl_Scaling.value),"ScalingOffset"in t&&(n.scalingOffset=t.ScalingOffset.value),"ScalingPivot"in t&&(n.scalingPivot=t.ScalingPivot.value),"RotationOffset"in t&&(n.rotationOffset=t.RotationOffset.value),"RotationPivot"in t&&(n.rotationPivot=t.RotationPivot.value),e.userData.transformData=n}setLookAtProperties(e,t){"LookAtProperty"in t&&Dt.get(e.ID).children.forEach(function(i){if(i.relationship==="LookAtProperty"){const s=Ze.Objects.Model[i.ID];if("Lcl_Translation"in s){const a=s.Lcl_Translation.value;e.target!==void 0?(e.target.position.fromArray(a),Xt.add(e.target)):e.lookAt(new b().fromArray(a))}}})}bindSkeleton(e,t,n){for(const i in e){const s=e[i],a=[];for(let l=0,c=s.bones.length;l<c;l++){const h=new Se;s.bones[l]&&s.rawBones[l]&&h.copy(s.rawBones[l].transformLink).invert(),a.push(h)}Dt.get(parseInt(s.ID)).parents.forEach(function(l){if(t.has(l.ID)){const c=l.ID;Dt.get(c).parents.forEach(function(u){if(n.has(u.ID)){const d=n.get(u.ID);d.updateMatrixWorld(!0),d.bind(new Mi(s.bones,a),d.matrixWorld)}})}})}}parsePoseNodes(){const e={};if("Pose"in Ze.Objects){const t=Ze.Objects.Pose;for(const n in t)if(t[n].attrType==="BindPose"&&t[n].NbPoseNodes>0){const i=t[n].PoseNode;Array.isArray(i)?i.forEach(function(s){e[s.Node]=new Se().fromArray(s.Matrix.a)}):e[i.Node]=new Se().fromArray(i.Matrix.a)}}return e}addGlobalSceneSettings(){if("GlobalSettings"in Ze){if("AmbientColor"in Ze.GlobalSettings){const e=Ze.GlobalSettings.AmbientColor.value,t=e[0],n=e[1],i=e[2];if(t!==0||n!==0||i!==0){const s=new _e().setRGB(t,n,i,dt);Xt.add(new Wl(s,1))}}"UnitScaleFactor"in Ze.GlobalSettings&&(Xt.userData.unitScaleFactor=Ze.GlobalSettings.UnitScaleFactor.value)}}}class tv{constructor(){this.negativeMaterialIndices=!1}parse(e){const t=new Map;if("Geometry"in Ze.Objects){const n=Ze.Objects.Geometry;for(const i in n){const s=Dt.get(parseInt(i)),a=this.parseGeometry(s,n[i],e);t.set(parseInt(i),a)}}return this.negativeMaterialIndices===!0&&console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected."),t}parseGeometry(e,t,n){switch(t.attrType){case"Mesh":return this.parseMeshGeometry(e,t,n);case"NurbsCurve":return this.parseNurbsGeometry(t)}}parseMeshGeometry(e,t,n){const i=n.skeletons,s=[],a=e.parents.map(function(u){return Ze.Objects.Model[u.ID]});if(a.length===0)return;const o=e.children.reduce(function(u,d){return i[d.ID]!==void 0&&(u=i[d.ID]),u},null);e.children.forEach(function(u){n.morphTargets[u.ID]!==void 0&&s.push(n.morphTargets[u.ID])});const l=a[0],c={};"RotationOrder"in l&&(c.eulerOrder=rr(l.RotationOrder.value)),"InheritType"in l&&(c.inheritType=parseInt(l.InheritType.value)),"GeometricTranslation"in l&&(c.translation=l.GeometricTranslation.value),"GeometricRotation"in l&&(c.rotation=l.GeometricRotation.value),"GeometricScaling"in l&&(c.scale=l.GeometricScaling.value);const h=Lu(c);return this.genGeometry(t,o,s,h)}genGeometry(e,t,n,i){const s=new gt;e.attrName&&(s.name=e.attrName);const a=this.parseGeoNode(e,t),o=this.genBuffers(a),l=new st(o.vertex,3);if(l.applyMatrix4(i),s.setAttribute("position",l),o.colors.length>0&&s.setAttribute("color",new st(o.colors,3)),t&&(s.setAttribute("skinIndex",new Ol(o.weightsIndices,4)),s.setAttribute("skinWeight",new st(o.vertexWeights,4)),s.FBX_Deformer=t),o.normal.length>0){const c=new He().getNormalMatrix(i),h=new st(o.normal,3);h.applyNormalMatrix(c),s.setAttribute("normal",h)}if(o.uvs.forEach(function(c,h){const u=h===0?"uv":`uv${h}`;s.setAttribute(u,new st(o.uvs[h],2))}),a.material&&a.material.mappingType!=="AllSame"){let c=o.materialIndex[0],h=0;if(o.materialIndex.forEach(function(u,d){u!==c&&(s.addGroup(h,d-h,c),c=u,h=d)}),s.groups.length>0){const u=s.groups[s.groups.length-1],d=u.start+u.count;d!==o.materialIndex.length&&s.addGroup(d,o.materialIndex.length-d,c)}s.groups.length===0&&s.addGroup(0,o.materialIndex.length,o.materialIndex[0])}return this.addMorphTargets(s,e,n,i),s}parseGeoNode(e,t){const n={};if(n.vertexPositions=e.Vertices!==void 0?e.Vertices.a:[],n.vertexIndices=e.PolygonVertexIndex!==void 0?e.PolygonVertexIndex.a:[],e.LayerElementColor&&e.LayerElementColor[0].Colors&&(n.color=this.parseVertexColors(e.LayerElementColor[0])),e.LayerElementMaterial&&(n.material=this.parseMaterialIndices(e.LayerElementMaterial[0])),e.LayerElementNormal&&(n.normal=this.parseNormals(e.LayerElementNormal[0])),e.LayerElementUV){n.uv=[];let i=0;for(;e.LayerElementUV[i];)e.LayerElementUV[i].UV&&n.uv.push(this.parseUVs(e.LayerElementUV[i])),i++}return n.weightTable={},t!==null&&(n.skeleton=t,t.rawBones.forEach(function(i,s){i.indices.forEach(function(a,o){n.weightTable[a]===void 0&&(n.weightTable[a]=[]),n.weightTable[a].push({id:s,weight:i.weights[o]})})})),n}genBuffers(e){const t={vertex:[],normal:[],colors:[],uvs:[],materialIndex:[],vertexWeights:[],weightsIndices:[]};let n=0,i=0,s=!1,a=[],o=[],l=[],c=[],h=[],u=[];const d=this;return e.vertexIndices.forEach(function(f,p){let _,m=!1;f<0&&(f=f^-1,m=!0);let g=[],S=[];if(a.push(f*3,f*3+1,f*3+2),e.color){const M=Kr(p,n,f,e.color);l.push(M[0],M[1],M[2])}if(e.skeleton){if(e.weightTable[f]!==void 0&&e.weightTable[f].forEach(function(M){S.push(M.weight),g.push(M.id)}),S.length>4){s||(console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."),s=!0);const M=[0,0,0,0],v=[0,0,0,0];S.forEach(function(w,E){let T=w,x=g[E];v.forEach(function(R,L,I){if(T>R){I[L]=T,T=R;const F=M[L];M[L]=x,x=F}})}),g=M,S=v}for(;S.length<4;)S.push(0),g.push(0);for(let M=0;M<4;++M)h.push(S[M]),u.push(g[M])}if(e.normal){const M=Kr(p,n,f,e.normal);o.push(M[0],M[1],M[2])}e.material&&e.material.mappingType!=="AllSame"&&(_=Kr(p,n,f,e.material)[0],_<0&&(d.negativeMaterialIndices=!0,_=0)),e.uv&&e.uv.forEach(function(M,v){const w=Kr(p,n,f,M);c[v]===void 0&&(c[v]=[]),c[v].push(w[0]),c[v].push(w[1])}),i++,m&&(d.genFace(t,e,a,_,o,l,c,h,u,i),n++,i=0,a=[],o=[],l=[],c=[],h=[],u=[])}),t}getNormalNewell(e){const t=new b(0,0,0);for(let n=0;n<e.length;n++){const i=e[n],s=e[(n+1)%e.length];t.x+=(i.y-s.y)*(i.z+s.z),t.y+=(i.z-s.z)*(i.x+s.x),t.z+=(i.x-s.x)*(i.y+s.y)}return t.normalize(),t}getNormalTangentAndBitangent(e){const t=this.getNormalNewell(e),i=(Math.abs(t.z)>.5?new b(0,1,0):new b(0,0,1)).cross(t).normalize(),s=t.clone().cross(i).normalize();return{normal:t,tangent:i,bitangent:s}}flattenVertex(e,t,n){return new Ve(e.dot(t),e.dot(n))}genFace(e,t,n,i,s,a,o,l,c,h){let u;if(h>3){const d=[],f=t.baseVertexPositions||t.vertexPositions;for(let g=0;g<n.length;g+=3)d.push(new b(f[n[g]],f[n[g+1]],f[n[g+2]]));const{tangent:p,bitangent:_}=this.getNormalTangentAndBitangent(d),m=[];for(const g of d)m.push(this.flattenVertex(g,p,_));u=zl.triangulateShape(m,[])}else u=[[0,1,2]];for(const[d,f,p]of u)e.vertex.push(t.vertexPositions[n[d*3]]),e.vertex.push(t.vertexPositions[n[d*3+1]]),e.vertex.push(t.vertexPositions[n[d*3+2]]),e.vertex.push(t.vertexPositions[n[f*3]]),e.vertex.push(t.vertexPositions[n[f*3+1]]),e.vertex.push(t.vertexPositions[n[f*3+2]]),e.vertex.push(t.vertexPositions[n[p*3]]),e.vertex.push(t.vertexPositions[n[p*3+1]]),e.vertex.push(t.vertexPositions[n[p*3+2]]),t.skeleton&&(e.vertexWeights.push(l[d*4]),e.vertexWeights.push(l[d*4+1]),e.vertexWeights.push(l[d*4+2]),e.vertexWeights.push(l[d*4+3]),e.vertexWeights.push(l[f*4]),e.vertexWeights.push(l[f*4+1]),e.vertexWeights.push(l[f*4+2]),e.vertexWeights.push(l[f*4+3]),e.vertexWeights.push(l[p*4]),e.vertexWeights.push(l[p*4+1]),e.vertexWeights.push(l[p*4+2]),e.vertexWeights.push(l[p*4+3]),e.weightsIndices.push(c[d*4]),e.weightsIndices.push(c[d*4+1]),e.weightsIndices.push(c[d*4+2]),e.weightsIndices.push(c[d*4+3]),e.weightsIndices.push(c[f*4]),e.weightsIndices.push(c[f*4+1]),e.weightsIndices.push(c[f*4+2]),e.weightsIndices.push(c[f*4+3]),e.weightsIndices.push(c[p*4]),e.weightsIndices.push(c[p*4+1]),e.weightsIndices.push(c[p*4+2]),e.weightsIndices.push(c[p*4+3])),t.color&&(e.colors.push(a[d*3]),e.colors.push(a[d*3+1]),e.colors.push(a[d*3+2]),e.colors.push(a[f*3]),e.colors.push(a[f*3+1]),e.colors.push(a[f*3+2]),e.colors.push(a[p*3]),e.colors.push(a[p*3+1]),e.colors.push(a[p*3+2])),t.material&&t.material.mappingType!=="AllSame"&&(e.materialIndex.push(i),e.materialIndex.push(i),e.materialIndex.push(i)),t.normal&&(e.normal.push(s[d*3]),e.normal.push(s[d*3+1]),e.normal.push(s[d*3+2]),e.normal.push(s[f*3]),e.normal.push(s[f*3+1]),e.normal.push(s[f*3+2]),e.normal.push(s[p*3]),e.normal.push(s[p*3+1]),e.normal.push(s[p*3+2])),t.uv&&t.uv.forEach(function(_,m){e.uvs[m]===void 0&&(e.uvs[m]=[]),e.uvs[m].push(o[m][d*2]),e.uvs[m].push(o[m][d*2+1]),e.uvs[m].push(o[m][f*2]),e.uvs[m].push(o[m][f*2+1]),e.uvs[m].push(o[m][p*2]),e.uvs[m].push(o[m][p*2+1])})}addMorphTargets(e,t,n,i){if(n.length===0)return;e.morphTargetsRelative=!0,e.morphAttributes.position=[];const s=i.clone().setPosition(0,0,0),a=this;n.forEach(function(o){o.rawTargets.forEach(function(l){const c=Ze.Objects.Geometry[l.geoID];c!==void 0&&a.genMorphGeometry(e,t,c,s,l.name)})})}genMorphGeometry(e,t,n,i,s){const a=t.Vertices!==void 0?t.Vertices.a:[],o=t.PolygonVertexIndex!==void 0?t.PolygonVertexIndex.a:[],l=n.Vertices!==void 0?n.Vertices.a:[],c=n.Indexes!==void 0?n.Indexes.a:[],h=e.attributes.position.count*3,u=new Float32Array(h);for(let _=0;_<c.length;_++){const m=c[_]*3;u[m]=l[_*3],u[m+1]=l[_*3+1],u[m+2]=l[_*3+2]}const d={vertexIndices:o,vertexPositions:u,baseVertexPositions:a},f=this.genBuffers(d),p=new st(f.vertex,3);p.name=s||n.attrName,p.applyMatrix4(i),e.morphAttributes.position.push(p)}parseNormals(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Normals.a;let s=[];return n==="IndexToDirect"&&("NormalIndex"in e?s=e.NormalIndex.a:"NormalsIndex"in e&&(s=e.NormalsIndex.a)),{dataSize:3,buffer:i,indices:s,mappingType:t,referenceType:n}}parseUVs(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.UV.a;let s=[];return n==="IndexToDirect"&&(s=e.UVIndex.a),{dataSize:2,buffer:i,indices:s,mappingType:t,referenceType:n}}parseVertexColors(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Colors.a;let s=[];n==="IndexToDirect"&&(s=e.ColorIndex.a);for(let a=0,o=new _e;a<i.length;a+=4)o.fromArray(i,a),We.colorSpaceToWorking(o,dt),o.toArray(i,a);return{dataSize:4,buffer:i,indices:s,mappingType:t,referenceType:n}}parseMaterialIndices(e){const t=e.MappingInformationType,n=e.ReferenceInformationType;if(t==="NoMappingInformation")return{dataSize:1,buffer:[0],indices:[0],mappingType:"AllSame",referenceType:n};const i=e.Materials.a,s=[];for(let a=0;a<i.length;++a)s.push(a);return{dataSize:1,buffer:i,indices:s,mappingType:t,referenceType:n}}parseNurbsGeometry(e){const t=parseInt(e.Order);if(isNaN(t))return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s",e.Order,e.id),new gt;const n=t-1,i=e.KnotVector.a,s=[],a=e.Points.a;for(let u=0,d=a.length;u<d;u+=4)s.push(new at().fromArray(a,u));let o,l;if(e.Form==="Closed")s.push(s[0]);else if(e.Form==="Periodic"){o=n,l=i.length-1-o;for(let u=0;u<n;++u)s.push(s[u])}const h=new jx(n,i,s,o,l).getPoints(s.length*12);return new gt().setFromPoints(h)}}class nv{parse(){const e=[],t=this.parseClips();if(t!==void 0)for(const n in t){const i=t[n],s=this.addClip(i);e.push(s)}return e}parseClips(){if(Ze.Objects.AnimationCurve===void 0)return;const e=this.parseAnimationCurveNodes();this.parseAnimationCurves(e);const t=this.parseAnimationLayers(e);return this.parseAnimStacks(t)}parseAnimationCurveNodes(){const e=Ze.Objects.AnimationCurveNode,t=new Map;for(const n in e){const i=e[n];if(i.attrName.match(/S|R|T|DeformPercent/)!==null){const s={id:i.id,attr:i.attrName,curves:{}};t.set(s.id,s)}}return t}parseAnimationCurves(e){const t=Ze.Objects.AnimationCurve;for(const n in t){const i={id:t[n].id,times:t[n].KeyTime.a.map(ov),values:t[n].KeyValueFloat.a},s=Dt.get(i.id);if(s!==void 0){const a=s.parents[0].ID,o=s.parents[0].relationship;o.match(/X/)?e.get(a).curves.x=i:o.match(/Y/)?e.get(a).curves.y=i:o.match(/Z/)?e.get(a).curves.z=i:o.match(/DeformPercent/)&&e.has(a)&&(e.get(a).curves.morph=i)}}}parseAnimationLayers(e){const t=Ze.Objects.AnimationLayer,n=new Map;for(const i in t){const s=[],a=Dt.get(parseInt(i));a!==void 0&&(a.children.forEach(function(l,c){if(e.has(l.ID)){const h=e.get(l.ID);if(h.curves.x!==void 0||h.curves.y!==void 0||h.curves.z!==void 0){if(s[c]===void 0){const u=Dt.get(l.ID).parents.filter(function(f){return f.relationship!==void 0});if(u.length===0)return;const d=u[0].ID;if(d!==void 0){const f=Ze.Objects.Model[d.toString()];if(f===void 0){console.warn("THREE.FBXLoader: Encountered a unused curve.",l);return}const p={modelName:f.attrName?it.sanitizeNodeName(f.attrName):"",ID:f.id,initialPosition:[0,0,0],initialRotation:[0,0,0],initialScale:[1,1,1]};Xt.traverse(function(_){_.ID===f.id&&(p.transform=_.matrix,_.userData.transformData&&(p.eulerOrder=_.userData.transformData.eulerOrder,_.userData.transformData.rotation&&(p.initialRotation=_.userData.transformData.rotation)))}),p.transform||(p.transform=new Se),"PreRotation"in f&&(p.preRotation=f.PreRotation.value),"PostRotation"in f&&(p.postRotation=f.PostRotation.value),s[c]=p}}s[c]&&(s[c][h.attr]=h)}else if(h.curves.morph!==void 0){if(s[c]===void 0){const u=Dt.get(l.ID).parents.filter(function(S){return S.relationship!==void 0});if(u.length===0)return;const d=u[0].ID,f=Dt.get(d).parents[0].ID,p=Dt.get(f).parents[0].ID,_=Dt.get(p).parents[0].ID,m=Ze.Objects.Model[_],g={modelName:m.attrName?it.sanitizeNodeName(m.attrName):"",morphName:Ze.Objects.Deformer[d].attrName};s[c]=g}s[c][h.attr]=h}}}),n.set(parseInt(i),s))}return n}parseAnimStacks(e){const t=Ze.Objects.AnimationStack,n={};for(const i in t){const s=Dt.get(parseInt(i)).children;s.length>1&&console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");const a=e.get(s[0].ID);n[i]={name:t[i].attrName,layer:a}}return n}addClip(e){let t=[];const n=this;return e.layer.forEach(function(i){t=t.concat(n.generateTracks(i))}),new nr(e.name,-1,t)}generateTracks(e){const t=[];let n=new b,i=new b;if(e.transform&&e.transform.decompose(n,new Ft,i),n=n.toArray(),i=i.toArray(),e.T!==void 0&&Object.keys(e.T.curves).length>0){const s=this.generateVectorTrack(e.modelName,e.T.curves,n,"position");s!==void 0&&t.push(s)}if(e.R!==void 0&&Object.keys(e.R.curves).length>0){const s=this.generateRotationTrack(e.modelName,e.R.curves,e.preRotation,e.postRotation,e.eulerOrder,e.initialRotation);s!==void 0&&t.push(s)}if(e.S!==void 0&&Object.keys(e.S.curves).length>0){const s=this.generateVectorTrack(e.modelName,e.S.curves,i,"scale");s!==void 0&&t.push(s)}if(e.DeformPercent!==void 0){const s=this.generateMorphTrack(e);s!==void 0&&t.push(s)}return t}generateVectorTrack(e,t,n,i){const s=this.getTimesForAllAxes(t),a=this.getKeyframeTrackValues(s,t,n);return new Ss(e+"."+i,s,a)}generateRotationTrack(e,t,n,i,s,a){let o,l;if(t.x!==void 0||t.y!==void 0||t.z!==void 0){const f=this.getTimesForAllAxes(t);if(f.length>0){const p=a||[0,0,0],_=this.synchronizeCurve(t.x,f,p[0]),m=this.synchronizeCurve(t.y,f,p[1]),g=this.synchronizeCurve(t.z,f,p[2]),S=this.interpolateRotations(_,m,g,s);o=S[0],l=S[1]}}const c=rr(0);n!==void 0&&(n=n.map(mt.degToRad),n.push(c),n=new qt().fromArray(n),n=new Ft().setFromEuler(n)),i!==void 0&&(i=i.map(mt.degToRad),i.push(c),i=new qt().fromArray(i),i=new Ft().setFromEuler(i).invert());const h=new Ft,u=new qt,d=[];if(!(!l||!o)){for(let f=0;f<l.length;f+=3)u.set(l[f],l[f+1],l[f+2],s),h.setFromEuler(u),n!==void 0&&h.premultiply(n),i!==void 0&&h.multiply(i),f>2&&new Ft().fromArray(d,(f-3)/3*4).dot(h)<0&&h.set(-h.x,-h.y,-h.z,-h.w),h.toArray(d,f/3*4);return new Bi(e+".quaternion",o,d)}}generateMorphTrack(e){const t=e.DeformPercent.curves.morph,n=t.values.map(function(s){return s/100}),i=Xt.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];return new Ms(e.modelName+".morphTargetInfluences["+i+"]",t.times,n)}getTimesForAllAxes(e){let t=[];if(e.x!==void 0&&(t=t.concat(e.x.times)),e.y!==void 0&&(t=t.concat(e.y.times)),e.z!==void 0&&(t=t.concat(e.z.times)),t=t.sort(function(n,i){return n-i}),t.length>1){let n=1,i=t[0];for(let s=1;s<t.length;s++){const a=t[s];a!==i&&(t[n]=a,i=a,n++)}t=t.slice(0,n)}return t}getKeyframeTrackValues(e,t,n){const i=n,s=[];let a=-1,o=-1,l=-1;return e.forEach(function(c){if(t.x&&(a=t.x.times.indexOf(c)),t.y&&(o=t.y.times.indexOf(c)),t.z&&(l=t.z.times.indexOf(c)),a!==-1){const h=t.x.values[a];s.push(h),i[0]=h}else s.push(i[0]);if(o!==-1){const h=t.y.values[o];s.push(h),i[1]=h}else s.push(i[1]);if(l!==-1){const h=t.z.values[l];s.push(h),i[2]=h}else s.push(i[2])}),s}synchronizeCurve(e,t,n){if(e===void 0)return{times:t,values:t.map(()=>n)};if(e.times.length===t.length)return e;const i=[];for(let s=0;s<t.length;s++)i.push(this.sampleCurveValue(e,t[s],n));return{times:t,values:i}}sampleCurveValue(e,t,n){const i=e.times,s=e.values;if(t<=i[0])return s[0];if(t>=i[i.length-1])return s[s.length-1];for(let a=0;a<i.length-1;a++)if(t>=i[a]&&t<=i[a+1]){if(i[a]===t)return s[a];const o=(t-i[a])/(i[a+1]-i[a]);return s[a]*(1-o)+s[a+1]*o}return n}interpolateRotations(e,t,n,i){const s=[],a=[];s.push(e.times[0]),a.push(mt.degToRad(e.values[0])),a.push(mt.degToRad(t.values[0])),a.push(mt.degToRad(n.values[0]));for(let o=1;o<e.values.length;o++){const l=[e.values[o-1],t.values[o-1],n.values[o-1]];if(isNaN(l[0])||isNaN(l[1])||isNaN(l[2]))continue;const c=l.map(mt.degToRad),h=[e.values[o],t.values[o],n.values[o]];if(isNaN(h[0])||isNaN(h[1])||isNaN(h[2]))continue;const u=h.map(mt.degToRad),d=[h[0]-l[0],h[1]-l[1],h[2]-l[2]],f=[Math.abs(d[0]),Math.abs(d[1]),Math.abs(d[2])];if(f[0]>=180||f[1]>=180||f[2]>=180){const _=Math.max(...f)/180,m=new qt(...c,i),g=new qt(...u,i),S=new Ft().setFromEuler(m),M=new Ft().setFromEuler(g);S.dot(M)<0&&M.set(-M.x,-M.y,-M.z,-M.w);const v=e.times[o-1],w=e.times[o]-v,E=new Ft,T=new qt;for(let x=0;x<1;x+=1/_)E.copy(S.clone().slerp(M.clone(),x)),s.push(v+x*w),T.setFromQuaternion(E,i),a.push(T.x),a.push(T.y),a.push(T.z)}else s.push(e.times[o]),a.push(mt.degToRad(e.values[o])),a.push(mt.degToRad(t.values[o])),a.push(mt.degToRad(n.values[o]))}return[s,a]}}class iv{getPrevNode(){return this.nodeStack[this.currentIndent-2]}getCurrentNode(){return this.nodeStack[this.currentIndent-1]}getCurrentProp(){return this.currentProp}pushStack(e){this.nodeStack.push(e),this.currentIndent+=1}popStack(){this.nodeStack.pop(),this.currentIndent-=1}setCurrentProp(e,t){this.currentProp=e,this.currentPropName=t}parse(e){this.currentIndent=0,this.allNodes=new Iu,this.nodeStack=[],this.currentProp=[],this.currentPropName="";const t=this,n=e.split(/[\r\n]+/);return n.forEach(function(i,s){const a=i.match(/^[\s\t]*;/),o=i.match(/^[\s\t]*$/);if(a||o)return;const l=i.match("^\\t{"+t.currentIndent+"}(\\w+):(.*){",""),c=i.match("^\\t{"+t.currentIndent+"}(\\w+):[\\s\\t\\r\\n](.*)"),h=i.match("^\\t{"+(t.currentIndent-1)+"}}");l?t.parseNodeBegin(i,l):c?t.parseNodeProperty(i,c,n[++s]):h?t.popStack():i.match(/^[^\s\t}]/)&&t.parseNodePropertyContinued(i)}),this.allNodes}parseNodeBegin(e,t){const n=t[1].trim().replace(/^"/,"").replace(/"$/,""),i=t[2].split(",").map(function(l){return l.trim().replace(/^"/,"").replace(/"$/,"")}),s={name:n},a=this.parseNodeAttr(i),o=this.getCurrentNode();this.currentIndent===0?this.allNodes.add(n,s):n in o?(n==="PoseNode"?o.PoseNode.push(s):o[n].id!==void 0&&(o[n]={},o[n][o[n].id]=o[n]),a.id!==""&&(o[n][a.id]=s)):typeof a.id=="number"?(o[n]={},o[n][a.id]=s):n!=="Properties70"&&(n==="PoseNode"?o[n]=[s]:o[n]=s),typeof a.id=="number"&&(s.id=a.id),a.name!==""&&(s.attrName=a.name),a.type!==""&&(s.attrType=a.type),this.pushStack(s)}parseNodeAttr(e){let t=e[0];e[0]!==""&&(t=parseInt(e[0]),isNaN(t)&&(t=e[0]));let n="",i="";return e.length>1&&(n=e[1].replace(/^(\w+)::/,""),i=e[2]),{id:t,name:n,type:i}}parseNodeProperty(e,t,n){let i=t[1].replace(/^"/,"").replace(/"$/,"").trim(),s=t[2].replace(/^"/,"").replace(/"$/,"").trim();i==="Content"&&s===","&&(s=n.replace(/"/g,"").replace(/,$/,"").trim());const a=this.getCurrentNode();if(a.name==="Properties70"){this.parseNodeSpecialProperty(e,i,s);return}if(i==="C"){const l=s.split(",").slice(1),c=parseInt(l[0]),h=parseInt(l[1]);let u=s.split(",").slice(3);u=u.map(function(d){return d.trim().replace(/^"/,"")}),i="connections",s=[c,h],cv(s,u),a[i]===void 0&&(a[i]=[])}i==="Node"&&(a.id=s),i in a&&Array.isArray(a[i])?a[i].push(s):i!=="a"?a[i]=s:a.a=s,this.setCurrentProp(a,i),i==="a"&&s.slice(-1)!==","&&(a.a=_o(s))}parseNodePropertyContinued(e){const t=this.getCurrentNode();t.a+=e,e.slice(-1)!==","&&(t.a=_o(t.a))}parseNodeSpecialProperty(e,t,n){const i=n.split('",').map(function(h){return h.trim().replace(/^\"/,"").replace(/\s/,"_")}),s=i[0],a=i[1],o=i[2],l=i[3];let c=i[4];switch(a){case"int":case"enum":case"bool":case"ULongLong":case"double":case"Number":case"FieldOfView":c=parseFloat(c);break;case"Color":case"ColorRGB":case"Vector3D":case"Lcl_Translation":case"Lcl_Rotation":case"Lcl_Scaling":c=_o(c);break}this.getPrevNode()[s]={type:a,type2:o,flag:l,value:c},this.setCurrentProp(this.getPrevNode(),s)}}class sv{parse(e){const t=new Eh(e);t.skip(23);const n=t.getUint32();if(n<6400)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+n);const i=new Iu;for(;!this.endOfContent(t);){const s=this.parseNode(t,n);s!==null&&i.add(s.name,s)}return i}endOfContent(e){return e.size()%16===0?(e.getOffset()+160+16&-16)>=e.size():e.getOffset()+160+16>=e.size()}parseNode(e,t){const n={},i=t>=7500?e.getUint64():e.getUint32(),s=t>=7500?e.getUint64():e.getUint32();t>=7500?e.getUint64():e.getUint32();const a=e.getUint8(),o=e.getString(a);if(i===0)return null;const l=[];for(let d=0;d<s;d++)l.push(this.parseProperty(e));const c=l.length>0?l[0]:"",h=l.length>1?l[1]:"",u=l.length>2?l[2]:"";for(n.singleProperty=s===1&&e.getOffset()===i;i>e.getOffset();){const d=this.parseNode(e,t);d!==null&&this.parseSubNode(o,n,d)}return n.propertyList=l,typeof c=="number"&&(n.id=c),h!==""&&(n.attrName=h),u!==""&&(n.attrType=u),o!==""&&(n.name=o),n}parseSubNode(e,t,n){if(n.singleProperty===!0){const i=n.propertyList[0];Array.isArray(i)?(t[n.name]=n,n.a=i):t[n.name]=i}else if(e==="Connections"&&n.name==="C"){const i=[];n.propertyList.forEach(function(s,a){a!==0&&i.push(s)}),t.connections===void 0&&(t.connections=[]),t.connections.push(i)}else if(n.name==="Properties70")Object.keys(n).forEach(function(s){t[s]=n[s]});else if(e==="Properties70"&&n.name==="P"){let i=n.propertyList[0],s=n.propertyList[1];const a=n.propertyList[2],o=n.propertyList[3];let l;i.indexOf("Lcl ")===0&&(i=i.replace("Lcl ","Lcl_")),s.indexOf("Lcl ")===0&&(s=s.replace("Lcl ","Lcl_")),s==="Color"||s==="ColorRGB"||s==="Vector"||s==="Vector3D"||s.indexOf("Lcl_")===0?l=[n.propertyList[4],n.propertyList[5],n.propertyList[6]]:l=n.propertyList[4],t[i]={type:s,type2:a,flag:o,value:l}}else t[n.name]===void 0?typeof n.id=="number"?(t[n.name]={},t[n.name][n.id]=n):t[n.name]=n:n.name==="PoseNode"?(Array.isArray(t[n.name])||(t[n.name]=[t[n.name]]),t[n.name].push(n)):t[n.name][n.id]===void 0&&(t[n.name][n.id]=n)}parseProperty(e){const t=e.getString(1);let n;switch(t){case"C":return e.getBoolean();case"D":return e.getFloat64();case"F":return e.getFloat32();case"I":return e.getInt32();case"L":return e.getInt64();case"R":return n=e.getUint32(),e.getArrayBuffer(n);case"S":return n=e.getUint32(),e.getString(n);case"Y":return e.getInt16();case"b":case"c":case"d":case"f":case"i":case"l":const i=e.getUint32(),s=e.getUint32(),a=e.getUint32();if(s===0)switch(t){case"b":case"c":return e.getBooleanArray(i);case"d":return e.getFloat64Array(i);case"f":return e.getFloat32Array(i);case"i":return e.getInt32Array(i);case"l":return e.getInt64Array(i)}const o=Gx(new Uint8Array(e.getArrayBuffer(a))),l=new Eh(o.buffer);switch(t){case"b":case"c":return l.getBooleanArray(i);case"d":return l.getFloat64Array(i);case"f":return l.getFloat32Array(i);case"i":return l.getInt32Array(i);case"l":return l.getInt64Array(i)}break;default:throw new Error("THREE.FBXLoader: Unknown property type "+t)}}}class Eh{constructor(e,t){this.dv=new DataView(e),this.offset=0,this.littleEndian=t!==void 0?t:!0,this._textDecoder=new TextDecoder}getOffset(){return this.offset}size(){return this.dv.buffer.byteLength}skip(e){this.offset+=e}getBoolean(){return(this.getUint8()&1)===1}getBooleanArray(e){const t=[];for(let n=0;n<e;n++)t.push(this.getBoolean());return t}getUint8(){const e=this.dv.getUint8(this.offset);return this.offset+=1,e}getInt16(){const e=this.dv.getInt16(this.offset,this.littleEndian);return this.offset+=2,e}getInt32(){const e=this.dv.getInt32(this.offset,this.littleEndian);return this.offset+=4,e}getInt32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt32());return t}getUint32(){const e=this.dv.getUint32(this.offset,this.littleEndian);return this.offset+=4,e}getInt64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t&2147483648?(t=~t&4294967295,e=~e&4294967295,e===4294967295&&(t=t+1&4294967295),e=e+1&4294967295,-(t*4294967296+e)):t*4294967296+e}getInt64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt64());return t}getUint64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t*4294967296+e}getFloat32(){const e=this.dv.getFloat32(this.offset,this.littleEndian);return this.offset+=4,e}getFloat32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat32());return t}getFloat64(){const e=this.dv.getFloat64(this.offset,this.littleEndian);return this.offset+=8,e}getFloat64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat64());return t}getArrayBuffer(e){const t=this.dv.buffer.slice(this.offset,this.offset+e);return this.offset+=e,t}getString(e){const t=this.offset;let n=new Uint8Array(this.dv.buffer,t,e);this.skip(e);const i=n.indexOf(0);return i>=0&&(n=new Uint8Array(this.dv.buffer,t,i)),this._textDecoder.decode(n)}}class Iu{add(e,t){this[e]=t}}function rv(r){const e="Kaydara FBX Binary  \0";return r.byteLength>=e.length&&e===Du(r,0,e.length)}function av(r){const e=["K","a","y","d","a","r","a","\\","F","B","X","\\","B","i","n","a","r","y","\\","\\"];let t=0;function n(i){const s=r[i-1];return r=r.slice(t+i),t++,s}for(let i=0;i<e.length;++i)if(n(1)===e[i])return!1;return!0}function Ah(r){const e=/FBXVersion: (\d+)/,t=r.match(e);if(t)return parseInt(t[1]);throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.")}function ov(r){return r/46186158e3}const lv=[];function Kr(r,e,t,n){let i;switch(n.mappingType){case"ByPolygonVertex":i=r;break;case"ByPolygon":i=e;break;case"ByVertice":i=t;break;case"AllSame":i=n.indices[0];break;default:console.warn("THREE.FBXLoader: unknown attribute mapping type "+n.mappingType)}n.referenceType==="IndexToDirect"&&(i=n.indices[i]);const s=i*n.dataSize,a=s+n.dataSize;return hv(lv,n.buffer,s,a)}const go=new qt,ss=new b;function Lu(r){const e=new Se,t=new Se,n=new Se,i=new Se,s=new Se,a=new Se,o=new Se,l=new Se,c=new Se,h=new Se,u=new Se,d=new Se,f=r.inheritType?r.inheritType:0;r.translation&&e.setPosition(ss.fromArray(r.translation));const p=rr(0);if(r.preRotation){const I=r.preRotation.map(mt.degToRad);I.push(p),t.makeRotationFromEuler(go.fromArray(I))}if(r.rotation){const I=r.rotation.map(mt.degToRad);I.push(r.eulerOrder||p),n.makeRotationFromEuler(go.fromArray(I))}if(r.postRotation){const I=r.postRotation.map(mt.degToRad);I.push(p),i.makeRotationFromEuler(go.fromArray(I)),i.invert()}r.scale&&s.scale(ss.fromArray(r.scale)),r.scalingOffset&&o.setPosition(ss.fromArray(r.scalingOffset)),r.scalingPivot&&a.setPosition(ss.fromArray(r.scalingPivot)),r.rotationOffset&&l.setPosition(ss.fromArray(r.rotationOffset)),r.rotationPivot&&c.setPosition(ss.fromArray(r.rotationPivot)),r.parentMatrixWorld&&(u.copy(r.parentMatrix),h.copy(r.parentMatrixWorld));const _=t.clone().multiply(n).multiply(i),m=new Se;m.extractRotation(h);const g=new Se;g.copyPosition(h);const S=g.clone().invert().multiply(h),M=m.clone().invert().multiply(S),v=s,w=new Se;if(f===0)w.copy(m).multiply(_).multiply(M).multiply(v);else if(f===1)w.copy(m).multiply(M).multiply(_).multiply(v);else{const F=new Se().scale(new b().setFromMatrixScale(u)).clone().invert(),B=M.clone().multiply(F);w.copy(m).multiply(_).multiply(B).multiply(v)}const E=c.clone().invert(),T=a.clone().invert();let x=e.clone().multiply(l).multiply(c).multiply(t).multiply(n).multiply(i).multiply(E).multiply(o).multiply(a).multiply(s).multiply(T);const R=new Se().copyPosition(x),L=h.clone().multiply(R);return d.copyPosition(L),x=d.clone().multiply(w),x.premultiply(h.invert()),x}function rr(r){r=r||0;const e=["ZYX","YZX","XZY","ZXY","YXZ","XYZ"];return r===6?(console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."),e[0]):e[r]}function _o(r){return r.split(",").map(function(t){return parseFloat(t)})}function Du(r,e,t){return e===void 0&&(e=0),t===void 0&&(t=r.byteLength),new TextDecoder().decode(new Uint8Array(r,e,t))}function cv(r,e){for(let t=0,n=r.length,i=e.length;t<i;t++,n++)r[n]=e[t]}function hv(r,e,t,n){for(let i=t,s=0;i<n;i++,s++)r[s]=e[i];return r}function Ch(r,e){if(e===xd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===al||e===Zh){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===al)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function gl(r,e){return e.getBoneName!==void 0?e.getBoneName(r):e.names[r.name]}function uv(r,e,t={}){const n=new Ft,i=new b,s=new Se,a=new Se;t.preserveBoneMatrix=t.preserveBoneMatrix!==void 0?t.preserveBoneMatrix:!0,t.preserveBonePositions=t.preserveBonePositions!==void 0?t.preserveBonePositions:!0,t.useTargetMatrix=t.useTargetMatrix!==void 0?t.useTargetMatrix:!1,t.hip=t.hip!==void 0?t.hip:"hip",t.hipInfluence=t.hipInfluence!==void 0?t.hipInfluence:new b(1,1,1),t.scale=t.scale!==void 0?t.scale:1,t.names=t.names||{};const o=e.isObject3D?e.skeleton.bones:xa(e),l=r.isObject3D?r.skeleton.bones:xa(r);let c,h,u,d;if(r.isObject3D?r.skeleton.pose():(t.useTargetMatrix=!0,t.preserveBoneMatrix=!1),t.preserveBonePositions){d=[];for(let f=0;f<l.length;f++)d.push(l[f].position.clone())}if(t.preserveBoneMatrix){r.updateMatrixWorld(),r.matrixWorld.identity();for(let f=0;f<r.children.length;++f)r.children[f].updateMatrixWorld(!0)}for(let f=0;f<l.length;++f)c=l[f],h=gl(c,t),u=Fu(h,o),a.copy(c.matrixWorld),u&&(u.updateMatrixWorld(),t.useTargetMatrix?s.copy(u.matrixWorld):(s.copy(r.matrixWorld).invert(),s.multiply(u.matrixWorld)),i.setFromMatrixScale(s),s.scale(i.set(1/i.x,1/i.y,1/i.z)),a.makeRotationFromQuaternion(n.setFromRotationMatrix(s)),r.isObject3D&&t.localOffsets&&t.localOffsets[c.name]&&a.multiply(t.localOffsets[c.name]),a.copyPosition(s)),h===t.hip&&(a.elements[12]*=t.scale*t.hipInfluence.x,a.elements[13]*=t.scale*t.hipInfluence.y,a.elements[14]*=t.scale*t.hipInfluence.z,t.hipPosition!==void 0&&(a.elements[12]+=t.hipPosition.x*t.scale,a.elements[13]+=t.hipPosition.y*t.scale,a.elements[14]+=t.hipPosition.z*t.scale)),c.parent?(c.matrix.copy(c.parent.matrixWorld).invert(),c.matrix.multiply(a)):c.matrix.copy(a),c.matrix.decompose(c.position,c.quaternion,c.scale),c.updateMatrixWorld();if(t.preserveBonePositions)for(let f=0;f<l.length;++f)c=l[f],h=gl(c,t)||c.name,h!==t.hip&&c.position.copy(d[f]);t.preserveBoneMatrix&&r.updateMatrixWorld(!0)}function Rh(r,e,t,n={}){n.useFirstFramePosition=n.useFirstFramePosition!==void 0?n.useFirstFramePosition:!1,n.fps=n.fps!==void 0?n.fps:Math.max(...t.tracks.map(g=>g.times.length))/t.duration,n.names=n.names||[],e.isObject3D||(e=dv(e));const i=Math.round(t.duration*(n.fps/1e3)*1e3),s=t.duration/(i-1),a=[],o=new Yl(e),l=xa(r.skeleton),c=[];let h,u,d,f,p;o.clipAction(t).play();let _=0,m=i;n.trim!==void 0?(_=Math.round(n.trim[0]*n.fps),m=Math.min(Math.round(n.trim[1]*n.fps),i)-_,o.update(n.trim[0])):o.update(0),e.updateMatrixWorld();for(let g=0;g<m;++g){const S=g*s;uv(r,e,n);for(let M=0;M<l.length;++M)u=l[M],p=gl(u,n)||u.name,d=Fu(p,e.skeleton),d&&(f=c[M]=c[M]||{bone:u},n.hip===p&&(f.pos||(f.pos={times:new Float32Array(m),values:new Float32Array(m*3)}),n.useFirstFramePosition&&(g===0&&(h=u.position.clone()),u.position.sub(h)),f.pos.times[g]=S,u.position.toArray(f.pos.values,g*3)),f.quat||(f.quat={times:new Float32Array(m),values:new Float32Array(m*4)}),f.quat.times[g]=S,u.quaternion.toArray(f.quat.values,g*4));g===m-2?o.update(s-1e-7):o.update(s),e.updateMatrixWorld()}for(let g=0;g<c.length;++g)f=c[g],f&&(f.pos&&a.push(new Ss(".bones["+f.bone.name+"].position",f.pos.times,f.pos.values)),a.push(new Bi(".bones["+f.bone.name+"].quaternion",f.quat.times,f.quat.values)));return o.uncacheAction(t),new nr(t.name,-1,a)}function _l(r){const e=new Map,t=new Map,n=r.clone();return Nu(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const s=i,a=e.get(i),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Fu(r,e){for(let t=0,n=xa(e);t<n.length;t++)if(r===n[t].name)return n[t]}function xa(r){return Array.isArray(r)?r:r.bones}function dv(r){const e=new Ap(r.bones[0]);return e.skeleton=r,e}function Nu(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)Nu(r.children[n],e.children[n],t)}class dr extends ri{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new _v(t)}),this.register(function(t){return new xv(t)}),this.register(function(t){return new Av(t)}),this.register(function(t){return new Cv(t)}),this.register(function(t){return new Rv(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new Mv(t)}),this.register(function(t){return new Sv(t)}),this.register(function(t){return new bv(t)}),this.register(function(t){return new gv(t)}),this.register(function(t){return new wv(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new Ev(t)}),this.register(function(t){return new Tv(t)}),this.register(function(t){return new pv(t)}),this.register(function(t){return new Ph(t,tt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ph(t,tt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Pv(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ds.extractUrlBase(e);a=ds.resolveURL(c,this.path)}else a=ds.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Gl(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Uu){try{a[tt.KHR_BINARY_GLTF]=new Iv(e)}catch(u){i&&i(u);return}s=JSON.parse(a[tt.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Wv(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case tt.KHR_MATERIALS_UNLIT:a[u]=new mv;break;case tt.KHR_DRACO_MESH_COMPRESSION:a[u]=new Lv(s,this.dracoLoader);break;case tt.KHR_TEXTURE_TRANSFORM:a[u]=new Dv;break;case tt.KHR_MESH_QUANTIZATION:a[u]=new Fv;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function fv(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Nt(r,e,t){const n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const tt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class pv{constructor(e){this.parser=e,this.name=tt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new _e(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],un);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ir(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new sn(h),c.distance=u;break;case"spot":c=new pu(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Un(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class mv{constructor(){this.name=tt.KHR_MATERIALS_UNLIT}getMaterialType(){return bt}extendParams(e,t,n){const i=[];e.color=new _e(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],un),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,dt))}return Promise.all(i)}}class gv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class _v{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ve(s,s)}return Promise.all(i)}}class xv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class vv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class yv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new _e(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,dt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class Mv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class Sv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const s=n.attenuationColor||[1,1,1];return t.attenuationColor=new _e().setRGB(s[0],s[1],s[2],un),Promise.all(i)}}class bv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IOR}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class wv{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const s=n.specularColorFactor||[1,1,1];return t.specularColor=new _e().setRGB(s[0],s[1],s[2],un),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,dt)),Promise.all(i)}}class Tv{constructor(e){this.parser=e,this.name=tt.EXT_MATERIALS_BUMP}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class Ev{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class Av{constructor(e){this.parser=e,this.name=tt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class Cv{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Rv{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Ph{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class Pv{constructor(e){this.name=tt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==pn.TRIANGLES&&c.mode!==pn.TRIANGLE_STRIP&&c.mode!==pn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const p of u){const _=new Se,m=new b,g=new Ft,S=new b(1,1,1),M=new ra(p.geometry,p.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,v),l.SCALE&&S.fromBufferAttribute(l.SCALE,v),M.setMatrixAt(v,_.compose(m,g,S));for(const v in l)if(v==="_COLOR_0"){const w=l[v];M.instanceColor=new ll(w.array,w.itemSize,w.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&p.geometry.setAttribute(v,l[v]);ht.prototype.copy.call(M,p),this.parser.assignFinalMaterial(M),f.push(M)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Uu="glTF",Os=12,Ih={JSON:1313821514,BIN:5130562};class Iv{constructor(e){this.name=tt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Os),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Uu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Os,s=new DataView(e,Os);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Ih.JSON){const c=new Uint8Array(e,Os+a,o);this.content=n.decode(c)}else if(l===Ih.BIN){const c=Os+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Lv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=tt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=xl[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=xl[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=fs[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const p in f.attributes){const _=f.attributes[p],m=l[p];m!==void 0&&(_.normalized=m)}u(f)},o,c,un,d)})})}}class Dv{constructor(){this.name=tt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Fv{constructor(){this.name=tt.KHR_MESH_QUANTIZATION}}class Ou extends bs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,_=p-c,m=-2*f+3*d,g=f-d,S=1-m,M=g-d+u;for(let v=0;v!==o;v++){const w=a[_+v+o],E=a[_+v+l]*h,T=a[p+v+o],x=a[p+v]*h;s[v]=S*w+M*E+m*T+g*x}return s}}const Nv=new Ft;class Uv extends Ou{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return Nv.fromArray(s).normalize().toArray(s),s}}const pn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},fs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Lh={9728:Vt,9729:kt,9984:Hh,9985:ea,9986:Bs,9987:kn},Dh={33071:gn,33648:oa,10497:Jt},xo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},xl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},xi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ov={CUBICSPLINE:void 0,LINEAR:$s,STEP:Ks},vo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function kv(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Xe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ni})),r.DefaultMaterial}function Pi(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Un(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Bv(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(d)}if(s){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function Vv(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function zv(r){let e;const t=r.extensions&&r.extensions[tt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+yo(t.attributes):e=r.indices+":"+yo(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+yo(r.targets[n]);return e}function yo(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function vl(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Gv(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Hv=new Se;class Wv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new fv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new du(this.options.manager):this.textureLoader=new dp(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Gl(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Pi(s,o,i),Un(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[tt.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(ds.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=xo[i.type],o=fs[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new ot(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=xo[i.type],c=fs[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let _,m;if(f&&f!==u){const g=Math.floor(d/f),S="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count;let M=t.cache.get(S);M||(_=new c(o,g*f,i.count*f/h),M=new df(_,f/h),t.cache.add(S,M)),m=new kl(M,l,d%f/h,p)}else o===null?_=new c(i.count*l):_=new c(o,d,i.count*l),m=new ot(_,l,p);if(i.sparse!==void 0){const g=xo.SCALAR,S=fs[i.sparse.indices.componentType],M=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,w=new S(a[1],M,i.sparse.count*g),E=new c(a[2],v,i.sparse.count*l);o!==null&&(m=new ot(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let T=0,x=w.length;T<x;T++){const R=w[T];if(m.setX(R,E[T*l]),l>=2&&m.setY(R,E[T*l+1]),l>=3&&m.setZ(R,E[T*l+2]),l>=4&&m.setW(R,E[T*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(s.samplers||{})[a.sampler]||{};return h.magFilter=Lh[d.magFilter]||kt,h.minFilter=Lh[d.minFilter]||kn,h.wrapS=Dh[d.wrapS]||Jt,h.wrapT=Dh[d.wrapT]||Jt,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Vt&&h.minFilter!==kt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(_){const m=new Bt(_);m.needsUpdate=!0,d(m)}),t.load(ds.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Un(u,a),u.userData.mimeType=a.mimeType||Gv(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[tt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[tt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[tt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new bi,vn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ba,vn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Xe}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[tt.KHR_MATERIALS_UNLIT]){const u=i[tt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{const u=s.pbrMetallicRoughness||{};if(o.color=new _e(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],un),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,dt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=Qt);const h=s.alphaMode||vo.OPAQUE;if(h===vo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===vo.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Ve(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==bt){const u=s.emissiveFactor;o.emissive=new _e().setRGB(u[0],u[1],u[2],un)}return s.emissiveTexture!==void 0&&a!==bt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,dt)),Promise.all(c).then(function(){const u=new a(o);return s.name&&(u.name=s.name),Un(u,s),t.associations.set(u,{materials:e}),s.extensions&&Pi(i,u,s),u})}createUniqueName(e){const t=it.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[tt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Fh(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=zv(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[tt.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Fh(new gt,c,t),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?kv(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,p=h.length;f<p;f++){const _=h[f],m=a[f];let g;const S=c[f];if(m.mode===pn.TRIANGLES||m.mode===pn.TRIANGLE_STRIP||m.mode===pn.TRIANGLE_FAN||m.mode===void 0)g=s.isSkinnedMesh===!0?new tu(_,S):new j(_,S),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===pn.TRIANGLE_STRIP?g.geometry=Ch(g.geometry,Zh):m.mode===pn.TRIANGLE_FAN&&(g.geometry=Ch(g.geometry,al));else if(m.mode===pn.LINES)g=new nu(_,S);else if(m.mode===pn.LINE_STRIP)g=new wa(_,S);else if(m.mode===pn.LINE_LOOP)g=new Mf(_,S);else if(m.mode===pn.POINTS)g=new Oi(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&Vv(g,s),g.name=t.createUniqueName(s.name||"mesh_"+e),Un(g,s),m.extensions&&Pi(i,g,m),t.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&Pi(i,u[0],s),u[0];const d=new lt;s.extensions&&Pi(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new jt(mt.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ea(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Un(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new Se;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Mi(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],p=i.samplers[f.sampler],_=f.target,m=_.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,S=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",S)),c.push(p),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],p=u[2],_=u[3],m=u[4],g=[];for(let M=0,v=d.length;M<v;M++){const w=d[M],E=f[M],T=p[M],x=_[M],R=m[M];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const L=n._createAnimationTracks(w,E,T,x,R);if(L)for(let I=0;I<L.length;I++)g.push(L[I])}const S=new nr(s,void 0,g);return Un(S,i),S})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Hv)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,p=u[0];h.pivot=new b().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new pa:c.length>1?h=new lt:c.length===1?h=c[0]:h=new ht,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=a),Un(h,s),s.extensions&&Pi(n,h,s),s.matrix!==void 0){const u=new Se;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new lt;n.name&&(s.name=i.createUniqueName(n.name)),Un(s,n),n.extensions&&Pi(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?s.add(_l(d)):s.add(d)}const c=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof vn||d instanceof Bt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}xi[s.path]===xi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(xi[s.path]){case xi.weights:h=Ms;break;case xi.rotation:h=Bi;break;case xi.translation:case xi.scale:h=Ss;break;default:switch(n.itemSize){case 1:h=Ms;break;case 2:case 3:default:h=Ss;break}break}const u=i.interpolation!==void 0?Ov[i.interpolation]:$s,d=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){const _=new h(l[f]+"."+xi[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=vl(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Bi?Uv:Ou;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Xv(r,e,t){const n=e.attributes,i=new rn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new b(l[0],l[1],l[2]),new b(c[0],c[1],c[2])),o.normalized){const h=vl(fs[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new b,l=new b;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const _=vl(fs[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new Hn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Fh(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=xl[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return We.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${We.workingColorSpace}" not supported.`),Un(r,e),Xv(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Bv(r,e.targets,t):r})}class qv{constructor(){A(this,"fbxLoader",new Qx);A(this,"gltfLoader",new dr)}async loadAndRetargetClip(e,t,n,i){try{const s=await this.fbxLoader.loadAsync(e);if(s.animations&&s.animations.length>0){let a=s.animations[0];if(s.animations.length>1){const _=s.animations.find(m=>m.name.toLowerCase().includes("mixamo")||m.name.toLowerCase().includes("layer0")||!m.name.toLowerCase().includes("camera"));_&&(a=_)}const o=_l(n),l=[];o.traverse(_=>{_.isBone&&l.push(_)}),o.skeleton=new Mi(l),o.updateMatrixWorld(!0);const c=[];s.traverse(_=>{_.isBone&&c.push(_)}),s.skeleton=new Mi(c),s.updateMatrixWorld(!0);const h=new Map;c.forEach(_=>{h.set(_.name.toLowerCase().replace(/[:_\-\s]/g,""),_.name)});const u=_=>{const m=_.name.toLowerCase().replace(/[:_\-\s]/g,"");return h.get(m)||_.name},d=h.get("mixamorighips")||"mixamorig:Hips",f="mixamorig:Hips";a.tracks=a.tracks.filter(_=>_.name.endsWith(".position")?(console.log(`[AssetManager] Pre-strip position track from raw FBX: "${_.name}"`),!1):!_.name.endsWith(".scale"));let p=Rh(o,s,a,{preserveBonePositions:!0,hip:d,getBoneName:u,scale:i});p.name=t,p.tracks=p.tracks.filter(_=>_.name.endsWith(".scale")?!1:_.name.endsWith(".position")?(console.log(`[AssetManager] Post-strip position track: "${_.name}"`),!1):!0);for(const _ of p.tracks){const m=_.name.match(/\.bones\[(.*?)\]\.(.*)/);m&&(_.name=`${m[1]}.${m[2]}`)}return console.log(`[AssetManager] ✅ '${t}' → ${p.tracks.length} rotation tracks, ${p.duration.toFixed(2)}s`),p}}catch(s){console.warn(`[AssetManager] ❌ Failed to load clip from ${e}`,s)}return null}async loadAndRetargetGltfClip(e,t,n){try{const i=await this.gltfLoader.loadAsync(e);if(i.animations&&i.animations.length>0){const s=i.animations[0];s.tracks=s.tracks.filter(_=>!(_.name.endsWith(".position")||_.name.endsWith(".scale")));const a=_l(n),o=[];a.traverse(_=>{_.isBone&&o.push(_)}),a.skeleton=new Mi(o),a.updateMatrixWorld(!0);const l=[];i.scene.traverse(_=>{_.isBone&&l.push(_)}),i.scene.skeleton=new Mi(l),i.scene.updateMatrixWorld(!0);const c=new Map;l.forEach(_=>{c.set(_.name.toLowerCase().replace(/[:_\-\s]/g,""),_.name)});const h=_=>{const m=_.name.toLowerCase().replace(/[:_\-\s]/g,"");return c.get(m)||_.name},u=c.get("mixamorighips")||"mixamorig:Hips";let d=Rh(a,i.scene,s,{preserveBonePositions:!0,hip:u,getBoneName:h,scale:1});d.name=t,d.tracks=d.tracks.filter(_=>!(_.name.endsWith(".scale")||_.name.endsWith(".position")));for(const _ of d.tracks){const m=_.name.match(/\.bones\[(.*?)\]\.(.*)/);m&&(_.name=`${m[1]}.${m[2]}`)}console.log(`[AssetManager] ✅ GLB '${t}' → ${d.tracks.length} rotation tracks, ${d.duration.toFixed(2)}s`);const f=[],p=i.scene.getObjectByName("Cylinder");return p&&(console.log("[AssetManager] Extracted external mesh 'Cylinder' from GLB"),f.push(p)),{clip:d,externalMeshes:f}}}catch(i){console.warn(`[AssetManager] ❌ Failed to load GLB clip from ${e}`,i)}return null}async loadPlayerModel(){try{console.log("[AssetManager] Loading base character model...");let e=null,t=!1,n=1;try{console.log("[AssetManager] Loading player.glb via GLTFLoader..."),e=(await this.gltfLoader.loadAsync("/magic-academy-3d/assets/characters/player.glb?v=7")).scene,console.log("[AssetManager] ✅ Loaded player.glb successfully"),e.traverse(T=>{T.name.toLowerCase().includes("vaculo")&&(T.visible=!1,t=!0,console.log("[AssetManager] Found and hidden embedded staff (Vaculo) in player.glb"))});const v=e.getObjectByName("mixamorig:Hips");v&&(v.position.z=0,console.log("[AssetManager] Corrected mixamorig:Hips initial Z position to 0"));const w=e.getObjectByName("Armature");let E=1;w&&(E=w.scale.x),n=.01/E,console.log(`[AssetManager] GLTF detected. Armature scale = ${E.toFixed(4)}. Base scale factor = ${n.toFixed(5)}`)}catch(M){console.warn("[AssetManager] player.glb failed to load, falling back to FBX",M)}if(!e)try{e=await this.fbxLoader.loadAsync("/magic-academy-3d/assets/characters/Idle_nowood.fbx?v=7")}catch{console.warn("[AssetManager] Idle_nowood.fbx failed, trying Wukong_NoWood.fbx"),e=await this.fbxLoader.loadAsync("/magic-academy-3d/assets/characters/Wukong_NoWood.fbx")}const i=[];e.traverse(M=>{M.isBone&&i.push(M.name)}),console.log("[AssetManager] Skeleton bones found:",i.slice(0,15).join(", "),i.length>15?`... (${i.length} total)`:"");const s=new rn().setFromObject(e),a=new b;if(s.getSize(a),a.y>0){const M=1.7/a.y;e.scale.setScalar(M),console.log(`[AssetManager] Auto-scaled by ${M.toFixed(3)} (${a.y.toFixed(2)}m → 1.7m)`)}{const v=new rn().setFromObject(e).min.y;Math.abs(v)>.001&&(e.position.y-=v,console.log(`[AssetManager] Pinned feet to Y=0 in T-pose (shifted by ${(-v).toFixed(4)}m)`))}if(e.traverse(M=>{if(M.isMesh){M.castShadow=!0,M.receiveShadow=!0;const w=M.material;if(w){const E=T=>{T.shadowSide=Qt,T.transparent&&T.opacity>=.99&&(T.transparent=!1,T.depthWrite=!0),T.map&&(T.map.anisotropy=16,T.map.minFilter=kn,T.map.magFilter=kt,T.map.needsUpdate=!0);const x=M.name.toLowerCase();x.includes("cabeza")||x.includes("skin")||x.includes("face")||x.includes("pierna")||x.includes("brazo")?(T.roughness=.85,T.metalness=0):x.includes("hair")||x.includes("cabello")||x.includes("ceja")?(T.roughness=.75,T.metalness=.1):x.includes("vaculo")||x.includes("baculo")||x.includes("metal")||x.includes("oro")||x.includes("gold")?(T.roughness=.2,T.metalness=.85,x.includes("vaculo")&&(T.emissive=new _e(3812864),T.emissiveIntensity=.2)):(T.roughness=.65,T.metalness=.05),T.needsUpdate=!0};Array.isArray(w)?w.forEach(E):E(w)}}}),!t)try{const v=(await this.gltfLoader.loadAsync("/magic-academy-3d/assets/characters/baculo.glb?v=7")).scene;v.name="magic_wand",v.visible=!1;let w=null;e.traverse(E=>{const T=E.name.toLowerCase();T.includes("righthand")&&!T.includes("thumb")&&!T.includes("index")&&!T.includes("middle")&&!T.includes("ring")&&!T.includes("pinky")&&(w=E)}),w?(v.scale.setScalar(1),v.position.set(0,.05,0),v.rotation.set(Math.PI*.5,0,0),w.add(v),console.log("[AssetManager] ✅ Attached baculo.glb to bone:",w.name)):(v.scale.setScalar(.01),v.position.set(0,0,0),e.add(v),console.warn("[AssetManager] ⚠️ No RightHand bone found, attached staff to root"))}catch(M){console.warn("[AssetManager] Could not load baculo.glb staff",M)}const o=[],l=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Idle_nowood.fbx?v=7","Idle_Unarmed",e,n);l&&o.push(l);const c=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Running_nowood.fbx?v=7","Run_Unarmed",e,n);c&&o.push(c);const h=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Jumping_nowood.fbx?v=7","Jump_Unarmed",e,n);h&&o.push(h);const u=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/wukong_no_wood_double_jumpFront Flip.fbx?v=7","Wukong_NoWood_DoubleJump",e,n);u&&o.push(u);const d=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Taking_item_nowood.fbx?v=7","TakeItem",e,n);d&&o.push(d);const f=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Wukong_no_wood_kik.fbx?v=7","Wukong_NoWood_Kick",e,n);f&&o.push(f);const p=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/wukong_no_woodHard Landing.fbx?v=7","Wukong_NoWood_HardLanding",e,n);p&&o.push(p);const _=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Idle.fbx?v=7","Idle_Armed",e,n);_&&o.push(_);const m=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Run.fbx?v=7","Run_Armed",e,n);m&&o.push(m);const g=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Jump.fbx?v=7","Jump_Armed",e,n);g&&o.push(g);const S=await this.loadAndRetargetGltfClip("/magic-academy-3d/assets/characters/atack_wood.glb","CastSpell",e);return S&&(o.push(S.clip),S.externalMeshes.forEach(M=>{if(M.name==="Cylinder"){M.name="atack_wood_staff",M.visible=!1;let v=null;e.traverse(w=>{const E=w.name.toLowerCase();E.includes("lefthand")&&!E.includes("thumb")&&!E.includes("index")&&!E.includes("middle")&&!E.includes("ring")&&!E.includes("pinky")&&(v=w)}),v&&(v.add(M),console.log("[AssetManager] Attached 'atack_wood_staff' to LeftHand"))}})),console.log(`[AssetManager] 🎬 Total clips loaded: ${o.length} → [${o.map(M=>M.name).join(", ")}]`),{model:e,clips:o}}catch(e){return console.error("[AssetManager] Failed to load player model:",e),{model:this.createProceduralPlayer(),clips:[]}}}createProceduralPlayer(){const e=new lt;e.name="ProceduralPlayer";const t=new Xe({color:2037816,roughness:.6,metalness:.2}),n=new Xe({color:15976004,metalness:.8,roughness:.3}),i=new Xe({color:16765878,roughness:.8}),s=new Xe({color:15658751,roughness:.7}),a=new Xe({color:4861467,roughness:.8}),o=new j(new Et(.24,.48,1.3,12),t);o.position.y=.75,o.name="body",o.castShadow=!0,e.add(o);const l=new j(new Et(.34,.36,.12,12),n);l.position.y=.75,e.add(l);const c=new j(new Yt(.24,12,12),i);c.position.y=1.52,c.castShadow=!0,e.add(c);const h=new j(new Yt(.26,12,12,0,Math.PI*2,0,Math.PI*.6),s);h.position.y=1.54,e.add(h);const u=new Yt(.035,8,8),d=new bt({color:4060159}),f=new j(u,d);f.position.set(-.08,1.54,.21);const p=new j(u,d);p.position.set(.08,1.54,.21),e.add(f,p);const _=new lt;_.name="magic_wand",_.position.set(.42,.85,.2);const m=new j(new Et(.03,.025,1.8,10),a);m.position.y=.4,_.add(m);const g=new j(new ai(.14,.025,8,16),n);g.position.y=1.25,_.add(g);const S=new j(new Yt(.09,12,12),new bt({color:4060159}));S.position.y=1.25,S.name="staff_crystal_tip",_.add(S);const M=new sn(4060159,2.5,4);M.position.y=1.25,_.add(M),e.add(_);const v=new Et(.08,.08,.38,8),w=new Xe({color:1183008}),E=new j(v,w);E.name="leg_L",E.position.set(-.14,.19,0),E.castShadow=!0;const T=new j(v,w);return T.name="leg_R",T.position.set(.14,.19,0),T.castShadow=!0,e.add(E,T),e}}class Yv{constructor(e){A(this,"camera");A(this,"target",null);A(this,"yaw",0);A(this,"pitch",.25);A(this,"distance",5.5);A(this,"heightOffset",1.65);A(this,"minPitch",-.45);A(this,"maxPitch",1.15);A(this,"currentPosition",new b);A(this,"currentLookAt",new b);A(this,"currentDistance",5.5);A(this,"idleTimer",0);A(this,"RECENTER_DELAY",.8);A(this,"isManual",!1);A(this,"collisionRaycaster",new sr);A(this,"collisionObjects",[]);A(this,"prevYaw",0);A(this,"prevPitch",0);A(this,"angularSpeed",0);A(this,"blurCanvas",null);A(this,"blurCtx",null);this.camera=e,this.initMotionBlur()}initMotionBlur(){const e=document.createElement("canvas");e.id="motion-blur-overlay",e.style.cssText=["position:fixed","inset:0","width:100%","height:100%","pointer-events:none","z-index:10","opacity:0"].join(";"),document.body.appendChild(e),this.blurCanvas=e,this.blurCtx=e.getContext("2d"),this.resizeBlurCanvas(),window.addEventListener("resize",()=>this.resizeBlurCanvas())}resizeBlurCanvas(){this.blurCanvas&&(this.blurCanvas.width=window.innerWidth,this.blurCanvas.height=window.innerHeight)}updateMotionBlur(e){if(!this.blurCtx||!this.blurCanvas)return;const t=Math.hypot(this.yaw-this.prevYaw,this.pitch-this.prevPitch)/e;this.prevYaw=this.yaw,this.prevPitch=this.pitch,this.angularSpeed=mt.lerp(this.angularSpeed,t,Math.min(1,e*12));const n=mt.clamp((this.angularSpeed-.8)/3.2,0,1),i=this.blurCtx,s=this.blurCanvas.width,a=this.blurCanvas.height;if(i.clearRect(0,0,s,a),n>.01){const o=Math.ceil(n*5),l=n*18;for(let c=0;c<o;c++){const u=(c+1)/o*l,d=n*.06/o,f=i.createRadialGradient(s/2,a/2,a*.15,s/2,a/2,a*.72);f.addColorStop(0,"rgba(0,0,0,0)"),f.addColorStop(1,`rgba(0,0,0,${d.toFixed(3)})`),i.save(),i.translate(s/2,a/2),i.scale(1+u*.004,1+u*.004),i.translate(-s/2,-a/2),i.fillStyle=f,i.fillRect(0,0,s,a),i.restore()}}this.blurCanvas.style.opacity=(n*.85).toFixed(3)}setTarget(e){this.target=e,this.target&&(this.currentLookAt.copy(this.target.position),this.currentLookAt.y+=this.heightOffset,this.updatePosition(1,null))}setCollisionObjects(e){this.collisionObjects=e}update(e,t){if(!this.target)return;const n=t.consumeMouseDelta(),i=.0024;this.isManual=Math.hypot(n.x,n.y)>.5,this.isManual?(this.yaw-=n.x*i,this.pitch-=n.y*i,this.pitch=mt.clamp(this.pitch,this.minPitch,this.maxPitch),this.idleTimer=0):this.idleTimer+=e;const s=t.moveForward||t.moveBackward||t.moveLeft||t.moveRight;if(!this.isManual&&this.idleTimer>this.RECENTER_DELAY&&s){let o=this.target.rotation.y+Math.PI-this.yaw;for(;o<-Math.PI;)o+=Math.PI*2;for(;o>Math.PI;)o-=Math.PI*2;const l=Math.min(1,e*2.2);this.yaw+=o*l}this.updatePosition(e,t),this.updateMotionBlur(e)}updatePosition(e,t){if(!this.target)return;const n=new b().copy(this.target.position).add(new b(0,this.heightOffset,0)),i=Math.min(1,e*13);this.currentLookAt.lerp(n,i);const s=new b(Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.cos(this.yaw)*Math.cos(this.pitch));let a=this.distance;if(this.collisionObjects.length>0){this.collisionRaycaster.set(this.currentLookAt,s);const d=this.collisionRaycaster.intersectObjects(this.collisionObjects,!0);d.length>0&&d[0].distance<this.distance&&(a=Math.max(.7,d[0].distance-.3))}const o=a<this.currentDistance,l=Math.min(1,e*(o?28:5.5));this.currentDistance=mt.lerp(this.currentDistance,a,l);const c=new b().copy(this.currentLookAt).addScaledVector(s,this.currentDistance);this.currentPosition.lerp(c,i);const u=(t?t.isRunning&&(t.moveForward||t.moveBackward||t.moveLeft||t.moveRight):!1)?65:60;this.camera.fov=mt.lerp(this.camera.fov,u,Math.min(1,e*6)),this.camera.updateProjectionMatrix(),this.camera.position.copy(this.currentPosition),this.camera.lookAt(this.currentLookAt)}getForwardVector(){return new b(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).normalize()}getRightVector(){return new b(Math.cos(this.yaw),0,-Math.sin(this.yaw)).normalize()}}class Kv{constructor(e,t=[]){A(this,"mixer",null);A(this,"allActions",new Map);A(this,"currentAction",null);A(this,"currentState","Idle");A(this,"characterGroup",null);A(this,"proceduralTime",0);A(this,"isProcedural",!1);A(this,"isArmed",!1);A(this,"isPlayingOneShot",!1);t&&t.length>0?this.initAnimations(e,t):(this.isProcedural=!0,e instanceof lt&&(this.characterGroup=e))}initAnimations(e,t){this.mixer=new Yl(e),console.log("[AnimCtrl] Registering clips:",t.map(n=>`${n.name} (${n.tracks.length}t, ${n.duration.toFixed(1)}s)`).join(" | "));for(const n of t){const i=this.mixer.clipAction(n);(n.name==="TakeItem"||n.name==="CastSpell"||n.name==="Wukong_NoWood_Kick"||n.name==="Wukong_NoWood_DoubleJump"||n.name==="Wukong_NoWood_HardLanding")&&(i.setLoop(ha,1),i.clampWhenFinished=!0),n.name.includes("Jump")&&(i.setLoop(ha,1),i.clampWhenFinished=!0),this.allActions.set(n.name,i)}this.playState("Idle")}resolveClipName(e){if(e==="CastSpell")return"CastSpell";if(e==="Wukong_NoWood_DoubleJump")return"Wukong_NoWood_DoubleJump";if(e==="Wukong_NoWood_HardLanding")return"Wukong_NoWood_HardLanding";const t=this.isArmed?"_Armed":"_Unarmed";return e==="Idle"?"Idle"+t:e==="Run"||e==="Walk"?"Run"+t:e==="Jump"?"Jump"+t:"Idle"+t}playCastSpellAnimation(e,t){const n=this.allActions.get("CastSpell");if(!n||!this.mixer){e(),t();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==n&&this.currentAction.fadeOut(.1),n.reset().setEffectiveWeight(1).setEffectiveTimeScale(1.7).fadeIn(.08).play(),this.currentAction=n,this.currentState="CastSpell";let i=!1;const a=n.getClip().duration*.8,o=()=>{!i&&n.time>=a&&(i=!0,e())},l=h=>{var u;h.action===n&&((u=this.mixer)==null||u.removeEventListener("finished",l),i||(i=!0,e()),this.isPlayingOneShot=!1,t())};this.mixer.addEventListener("finished",l);const c=()=>{this.isPlayingOneShot&&this.currentAction===n&&(o(),i||requestAnimationFrame(c))};requestAnimationFrame(c)}playWukongKick(e,t){const n=this.allActions.get("Wukong_NoWood_Kick");if(!n||!this.mixer){e(),t();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==n&&this.currentAction.fadeOut(.1),n.reset().setEffectiveWeight(1).setEffectiveTimeScale(1.4).fadeIn(.08).play(),this.currentAction=n;let i=!1;const a=n.getClip().duration*.5,o=()=>{!i&&n.time>=a&&(i=!0,e())},l=h=>{var u;h.action===n&&((u=this.mixer)==null||u.removeEventListener("finished",l),i||(i=!0,e()),this.isPlayingOneShot=!1,t())};this.mixer.addEventListener("finished",l);const c=()=>{this.isPlayingOneShot&&this.currentAction===n&&(o(),i||requestAnimationFrame(c))};requestAnimationFrame(c)}playHardLanding(e){const t=this.allActions.get("Wukong_NoWood_HardLanding");if(!t||!this.mixer){e();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==t&&this.currentAction.fadeOut(.15),t.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).fadeIn(.1).play(),this.currentAction=t,this.currentState="Wukong_NoWood_HardLanding";const n=i=>{var s;i.action===t&&((s=this.mixer)==null||s.removeEventListener("finished",n),this.isPlayingOneShot=!1,e())};this.mixer.addEventListener("finished",n)}setArmed(e){if(this.isArmed===e)return;this.isArmed=e,console.log(`[AnimCtrl] Mode → ${e?"🪄 ARMED":"🤲 UNARMED"}`);const t=this.currentState;this.currentState="",this.playState(t,.25)}playTakeItemAnimation(e){const t=this.allActions.get("TakeItem");if(!t||!this.mixer){this.setArmed(!0),e&&e();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==t&&this.currentAction.fadeOut(.2),t.reset().setEffectiveWeight(1).fadeIn(.15).play(),this.currentAction=t;const n=i=>{var s;i.action===t&&((s=this.mixer)==null||s.removeEventListener("finished",n),this.isPlayingOneShot=!1,this.setArmed(!0),e&&e())};this.mixer.addEventListener("finished",n)}playState(e,t=.2){if(this.isPlayingOneShot||this.currentState===e&&this.currentAction&&this.currentAction.isRunning())return;if(this.isProcedural){this.currentState=e;return}const n=this.resolveClipName(e),i=this.allActions.get(n);if(!i){const s=this.allActions.get("Idle_Unarmed")||this.allActions.get("Idle_Armed");s&&s!==this.currentAction&&(this.currentAction&&this.currentAction.fadeOut(t),s.reset().setEffectiveWeight(1).fadeIn(t).play(),this.currentAction=s),this.currentState=e;return}this.currentAction&&this.currentAction!==i&&this.currentAction.fadeOut(t),i.reset().setEffectiveWeight(1).fadeIn(t).play(),this.currentAction=i,this.currentState=e}update(e){this.mixer&&this.mixer.update(e),this.isProcedural&&this.characterGroup&&this.updateProceduralAnimation(e)}updateProceduralAnimation(e){var a,o,l,c;this.proceduralTime+=e*8;const t=(a=this.characterGroup)==null?void 0:a.getObjectByName("leg_L"),n=(o=this.characterGroup)==null?void 0:o.getObjectByName("leg_R"),i=(l=this.characterGroup)==null?void 0:l.getObjectByName("magic_wand"),s=(c=this.characterGroup)==null?void 0:c.getObjectByName("body");switch(this.currentState){case"Idle":s&&(s.position.y=Math.sin(this.proceduralTime*.4)*.03),t&&(t.rotation.x=0),n&&(n.rotation.x=0),i&&(i.rotation.z=Math.sin(this.proceduralTime*.5)*.05);break;case"Walk":t&&(t.rotation.x=Math.sin(this.proceduralTime)*.4),n&&(n.rotation.x=-Math.sin(this.proceduralTime)*.4),s&&(s.position.y=Math.abs(Math.sin(this.proceduralTime*2))*.05);break;case"Run":t&&(t.rotation.x=Math.sin(this.proceduralTime*1.5)*.7),n&&(n.rotation.x=-Math.sin(this.proceduralTime*1.5)*.7),s&&(s.position.y=Math.abs(Math.sin(this.proceduralTime*3))*.08);break;case"Jump":case"Fall":t&&(t.rotation.x=-.3),n&&(n.rotation.x=.3);break;case"CastSpell":i&&(i.rotation.x=-Math.PI*.4,i.rotation.z=Math.sin(this.proceduralTime*2)*.2);break}}getCurrentState(){return this.currentState}}class $v{constructor(){A(this,"wandMesh");A(this,"tipLight");A(this,"particles");A(this,"particleGeo");A(this,"particlePositions");A(this,"particleColors");A(this,"particleCount",40);A(this,"currentHouseColor");this.wandMesh=new lt,this.wandMesh.visible=!1,this.currentHouseColor=new _e(4060159),this.tipLight=new sn(4060159,1.8,4),this.tipLight.position.set(0,0,0),this.wandMesh.add(this.tipLight),this.particlePositions=new Float32Array(this.particleCount*3),this.particleColors=new Float32Array(this.particleCount*3);for(let t=0;t<this.particleCount;t++)this.particlePositions[t*3]=(Math.random()-.5)*.1,this.particlePositions[t*3+1]=(Math.random()-.5)*.1,this.particlePositions[t*3+2]=(Math.random()-.5)*.1,this.particleColors[t*3]=.2,this.particleColors[t*3+1]=.8,this.particleColors[t*3+2]=1;this.particleGeo=new gt,this.particleGeo.setAttribute("position",new ot(this.particlePositions,3)),this.particleGeo.setAttribute("color",new ot(this.particleColors,3));const e=new bi({size:.06,vertexColors:!0,transparent:!0,opacity:.85,blending:Xs,depthWrite:!1});this.particles=new Oi(this.particleGeo,e),this.wandMesh.add(this.particles)}setHouseColor(e){this.currentHouseColor.setHex(e),this.tipLight.color.setHex(e)}getTipWorldPosition(){const e=new b;return this.tipLight.getWorldPosition(e),e}update(e){const t=new b(0,0,.6);for(let n=this.particleCount-1;n>0;n--)this.particlePositions[n*3]=this.particlePositions[(n-1)*3]+(Math.random()-.5)*.01,this.particlePositions[n*3+1]=this.particlePositions[(n-1)*3+1]+(Math.random()-.5)*.01,this.particlePositions[n*3+2]=this.particlePositions[(n-1)*3+2]-.02,this.particleColors[n*3]=this.currentHouseColor.r,this.particleColors[n*3+1]=this.currentHouseColor.g,this.particleColors[n*3+2]=this.currentHouseColor.b;this.particlePositions[0]=t.x,this.particlePositions[1]=t.y,this.particlePositions[2]=t.z,this.particleGeo.attributes.position.needsUpdate=!0,this.particleGeo.attributes.color.needsUpdate=!0}}class ku{static findHandNode(e){let t=null;if(e.mesh.traverse(i=>{if(t)return;const s=i.name.toLowerCase();(s.includes("righthand")||s.includes("hand_r")||s.includes("hand.r")||s.includes("wrist_r")||s.includes("mixamorigrighthand")||s.includes("handr"))&&(t=i)}),t)return t;let n=e.mesh.getObjectByName("item_hand_socket");return n||(n=new lt,n.name="item_hand_socket",n.position.set(.3,1.25,.35),e.mesh.add(n)),n}static playEpicPickup(e,t,n,i,s){e.isControlsLocked=!0,e.isMovementLocked=!0,e.velocity.set(0,0,0);const a=this.findHandNode(e),o=new lt;o.name="epic_held_item";const l=s!==void 0?s:n==="staff"?58879:16766720;if(n==="key"){const g=new ai(.12,.035,12,24),S=new Et(.025,.025,.4,12),M=new Ge(.08,.03,.08),v=new Ge(.06,.03,.06),w=new Xe({color:l,metalness:.85,roughness:.2,emissive:l,emissiveIntensity:.9}),E=new j(g,w);E.position.y=.2;const T=new j(S,w);T.position.y=-.05;const x=new j(M,w);x.position.set(.04,-.18,0);const R=new j(v,w);R.position.set(.03,-.23,0),o.add(E,T,x,R)}else if(n==="staff"){const g=new Et(.03,.035,1.4,12),S=new Yt(.12,16,16),M=new Xe({color:6044193,roughness:.7}),v=new Xe({color:l,emissive:l,emissiveIntensity:1.5,roughness:.1}),w=new j(g,M),E=new j(S,v);E.position.y=.7,o.add(w,E)}o.position.set(0,.18,.08),o.scale.setScalar(7.6),a.add(o);const c=new sn(l,5.5,6.5);c.position.set(0,.3,.3),o.add(c);const h=18,u=[],d=[],f=new or(.04,0);for(let g=0;g<h;g++){const S=new bt({color:l,transparent:!0,opacity:.9}),M=new j(f,S),v=g/h*Math.PI*2,w=.4+Math.random()*.4;M.position.set(Math.cos(v)*w,(Math.random()-.5)*.8,Math.sin(v)*w),o.add(M),u.push(M),d.push(new b((Math.random()-.5)*.8,.5+Math.random()*.8,(Math.random()-.5)*.8))}e.animationController.playTakeItemAnimation(()=>{});let p=0;const _=2,m=()=>{p+=.016;const g=Math.min(1,p/_);o.rotation.y+=.05,c.intensity=(3.5+Math.sin(p*10)*1.5)*(1-Math.max(0,(g-.7)/.3)),u.forEach((S,M)=>{S.position.addScaledVector(d[M],.016),S.rotation.x+=.1,S.rotation.y+=.1,S.material.opacity=Math.max(0,1-g*1.2)}),p<_?requestAnimationFrame(m):(a.remove(o),o.traverse(S=>{if(S.isMesh){S.geometry.dispose();const M=S.material;Array.isArray(M)?M.forEach(v=>v.dispose()):M.dispose()}}),e.isControlsLocked=!1,e.isMovementLocked=!1,i())};requestAnimationFrame(m)}}const jn=class jn{constructor(e,t){A(this,"mesh");A(this,"animationController");A(this,"wandEffect");A(this,"velocity",new b);A(this,"isGrounded",!0);A(this,"moveSpeed",4.5);A(this,"runSpeed",7.5);A(this,"jumpForce",8);A(this,"gravity",-20);A(this,"health",100);A(this,"maxHealth",100);A(this,"mana",100);A(this,"maxMana",100);A(this,"manaRegenRate",12);A(this,"isControlsLocked",!1);A(this,"isMovementLocked",!1);A(this,"groundRaycaster",new sr);A(this,"colliders",[]);A(this,"onHealthChange");A(this,"onManaChange");A(this,"hasStaff",!1);A(this,"jumpCount",0);A(this,"doubleJumpSpinTimer",0);A(this,"isAttacking",!1);A(this,"visualModel");A(this,"defaultVisualRotationX",0);A(this,"wallRaycaster",new sr);A(this,"PLAYER_RADIUS",.4);A(this,"isRespawning",!1);this.mesh=e,this.visualModel=this.mesh.children.find(n=>n.type==="Group")||this.mesh.children[0]||this.mesh,this.defaultVisualRotationX=this.visualModel.rotation.x,this.animationController=t,this.mesh.position.set(0,0,0),this.wandEffect=new $v,this.setStaffVisibility(!1)}setStaffVisibility(e){const t=this.mesh.getObjectByName("Vaculo");t&&(t.visible=e);const n=this.mesh.getObjectByName("magic_wand");if(n&&(n.visible=e),e){const i=t||n;i?(this.wandEffect.wandMesh.position.set(0,.8,0),this.wandEffect.wandMesh.rotation.set(0,0,0),i.add(this.wandEffect.wandMesh)):(this.wandEffect.wandMesh.position.set(.35,1.6,.2),this.mesh.add(this.wandEffect.wandMesh)),this.wandEffect.wandMesh.visible=!0}else this.wandEffect.wandMesh.visible=!1,this.wandEffect.wandMesh.parent&&this.wandEffect.wandMesh.parent.remove(this.wandEffect.wandMesh)}equipStaff(e){this.hasStaff||(console.log("[PlayerController] Playing epic staff pickup animation..."),e?ku.playEpicPickup(this,e,"staff",()=>{this.hasStaff=!0,this.setStaffVisibility(!0),console.log("[PlayerController] Staff equipped! Spells unlocked and Armed animations active.")}):(this.isControlsLocked=!0,this.velocity.set(0,0,0),this.animationController.playTakeItemAnimation(()=>{this.hasStaff=!0,this.setStaffVisibility(!0),this.isControlsLocked=!1,console.log("[PlayerController] Staff equipped! Spells unlocked and Armed animations active.")})))}useMana(e){var t;return this.mana>=e?(this.mana=Math.max(0,this.mana-e),(t=this.onManaChange)==null||t.call(this,this.mana,this.maxMana),!0):!1}restoreMana(e){var t;this.mana=Math.min(this.maxMana,this.mana+e),(t=this.onManaChange)==null||t.call(this,this.mana,this.maxMana)}heal(e){var t;this.health=Math.min(this.maxHealth,this.health+e),(t=this.onHealthChange)==null||t.call(this,this.health,this.maxHealth)}takeDamage(e,t){var n,i,s;this.health=Math.max(0,this.health-e),(n=this.onHealthChange)==null||n.call(this,this.health,this.maxHealth),this.health<=0&&(this.health=this.maxHealth,this.mana=this.maxMana,(i=this.onHealthChange)==null||i.call(this,this.health,this.maxHealth),(s=this.onManaChange)==null||s.call(this,this.mana,this.maxMana),t&&this.mesh.position.copy(t))}setColliders(e){this.colliders=e}forceIdle(){this.animationController.isPlayingOneShot=!1,this.animationController.playState("Idle",.1),this.velocity.set(0,0,0)}update(e,t,n){var m,g,S,M,v;if(this.isControlsLocked){this.animationController.update(e);return}jn.TEMP_GROUND_ORIGIN.copy(this.mesh.position).add(jn.RAY_OFFSET),this.groundRaycaster.set(jn.TEMP_GROUND_ORIGIN,jn.DOWN_DIR);const i=this.groundRaycaster.intersectObjects(this.colliders,!0),s=this.velocity.y;if(this.isGrounded=i.length>0&&i[0].distance<=.8,this.isGrounded&&this.velocity.y<=0){this.velocity.y=0,this.mesh.position.y=i[0].point.y;const w=s<-12;this.jumpCount=0,this.doubleJumpSpinTimer=0,this.visualModel.rotation.x=this.defaultVisualRotationX,w&&this.triggerHardLanding()}else this.isMovementLocked||(this.velocity.y+=this.gravity*e);if(t.onJumpPress||(t.onJumpPress=()=>{var E;if(this.isControlsLocked||this.isMovementLocked)return;const w=(E=window.gameInstance)==null?void 0:E.audioManager;this.isGrounded?(this.velocity.y=this.jumpForce,this.isGrounded=!1,this.jumpCount=1,this.animationController.playState("Jump"),w&&w.playJumpGrunt()):this.jumpCount===1&&(this.velocity.y=this.jumpForce*.95,this.jumpCount=2,this.doubleJumpSpinTimer=.4,this.hasStaff?this.animationController.playState("Jump"):this.animationController.playState("Wukong_NoWood_DoubleJump"),w&&w.playJumpGrunt())}),this.doubleJumpSpinTimer>0){this.doubleJumpSpinTimer-=e;const w=1-this.doubleJumpSpinTimer/.4;this.visualModel.rotation.x=this.defaultVisualRotationX+w*Math.PI*2,this.doubleJumpSpinTimer<=0&&(this.visualModel.rotation.x=this.defaultVisualRotationX)}const a=n.getForwardVector(),o=n.getRightVector();let l=0,c=0;this.isMovementLocked||(Math.hypot(t.touchAnalogX,t.touchAnalogZ)>.05?(l=t.touchAnalogX,c=t.touchAnalogZ):(t.moveForward&&(c+=1),t.moveBackward&&(c-=1),t.moveLeft&&(l-=1),t.moveRight&&(l+=1)));const h=new b().addScaledVector(a,c).addScaledVector(o,l).normalize(),u=h.lengthSq()>.01,d=t.isRunning?this.runSpeed:this.moveSpeed;if(u){this.velocity.x=h.x*d,this.velocity.z=h.z*d;const w=Math.atan2(h.x,h.z),E=this.mesh.rotation.y;let T=w-E;for(;T<-Math.PI;)T+=Math.PI*2;for(;T>Math.PI;)T-=Math.PI*2;this.mesh.rotation.y+=T*Math.min(1,e*15)}else this.velocity.x*=.8,this.velocity.z*=.8;const f=new b(this.velocity.x,0,this.velocity.z),p=f.length();if(p>.1&&this.colliders.length>0){const w=p*e,E=f.clone().normalize(),T=this.mesh.position.clone().add(new b(0,.5,0));this.wallRaycaster.set(T,E),this.wallRaycaster.far=this.PLAYER_RADIUS+w;const x=this.wallRaycaster.intersectObjects(this.colliders,!0);if(x.length>0&&x[0].distance<this.PLAYER_RADIUS+w){const R=((g=(m=x[0].face)==null?void 0:m.normal)==null?void 0:g.clone())||new b(0,0,1);if(R.transformDirection(x[0].object.matrixWorld),Math.abs(R.y)<.4){R.y=0,R.normalize();const L=this.velocity.x*R.x+this.velocity.z*R.z;L<0&&(this.velocity.x-=L*R.x,this.velocity.z-=L*R.z)}}}if(this.mesh.position.x+=this.velocity.x*e,this.mesh.position.y+=this.velocity.y*e,this.mesh.position.z+=this.velocity.z*e,this.isGrounded&&this.velocity.y===0&&this.colliders.length>0){const w=this.mesh.position.clone().add(new b(0,1,0));this.groundRaycaster.set(w,new b(0,-1,0));const E=this.groundRaycaster.intersectObjects(this.colliders,!0);E.length>0&&E[0].distance<=1.8&&(this.mesh.position.y=E[0].point.y)}if(this.colliders.length>0&&!this.isGrounded){const w=[.5,1],E=[new b(1,0,0),new b(-1,0,0),new b(0,0,1),new b(0,0,-1),new b(.707,0,.707),new b(-.707,0,.707),new b(.707,0,-.707),new b(-.707,0,-.707)];for(const T of w){const x=this.mesh.position.clone().add(new b(0,T,0));for(const R of E){this.wallRaycaster.set(x,R),this.wallRaycaster.far=this.PLAYER_RADIUS;const L=this.wallRaycaster.intersectObjects(this.colliders,!0);if(L.length>0&&L[0].distance<this.PLAYER_RADIUS){const I=((M=(S=L[0].face)==null?void 0:S.normal)==null?void 0:M.clone())||R.clone().negate();if(I.transformDirection(L[0].object.matrixWorld),Math.abs(I.y)<.35){const F=this.PLAYER_RADIUS-L[0].distance;I.y=0;const B=I.length();if(B>1e-4){I.divideScalar(B),this.mesh.position.addScaledVector(I,F);const K=this.velocity.x*I.x+this.velocity.z*I.z;K<0&&(this.velocity.x-=K*I.x,this.velocity.z-=K*I.z)}}}}}}const _=this.animationController.getCurrentState()==="Wukong_NoWood_HardLanding"?-.18:0;this.visualModel.position.y=mt.lerp(this.visualModel.position.y,_,e*12),this.isGrounded&&!this.isAttacking&&(u?this.animationController.playState("Run"):this.animationController.playState("Idle")),this.mana<this.maxMana&&(this.mana=Math.min(this.maxMana,this.mana+this.manaRegenRate*e),(v=this.onManaChange)==null||v.call(this,this.mana,this.maxMana)),this.wandEffect.update(e),this.animationController.update(e),this.mesh.position.y<-10&&!this.isMovementLocked&&this.respawnFromAbyss()}respawnFromAbyss(){var t;if(this.isRespawning)return;this.isRespawning=!0,this.isMovementLocked=!0,this.takeDamage(20);const e=(t=window.gameInstance)==null?void 0:t.hud;e==null||e.fadeScreenOut(500).then(()=>{this.mesh.position.set(0,0,0),this.velocity.set(0,0,0),setTimeout(()=>{e==null||e.fadeScreenIn(500).then(()=>{this.isMovementLocked=!1,this.isRespawning=!1})},500)})}attachStaffToHand(){const e=this.mesh.getObjectByName("Vaculo")||this.mesh.getObjectByName("magic_wand"),t=this.mesh.getObjectByName("atack_wood_staff");e&&(e.visible=!1),t&&(t.visible=!0,this.wandEffect&&this.wandEffect.wandMesh&&(this.wandEffect.wandMesh.position.set(0,.8,0),t.add(this.wandEffect.wandMesh)))}attachStaffToBack(){const e=this.mesh.getObjectByName("Vaculo")||this.mesh.getObjectByName("magic_wand"),t=this.mesh.getObjectByName("atack_wood_staff");e&&(e.visible=!0,this.wandEffect&&this.wandEffect.wandMesh&&(this.wandEffect.wandMesh.position.set(0,.8,0),e.add(this.wandEffect.wandMesh))),t&&(t.visible=!1)}getSpellLaunchPosition(){if(this.wandEffect&&this.wandEffect.wandMesh.visible){const n=new b;return this.wandEffect.wandMesh.getWorldPosition(n),n}let e=null;if(this.mesh.traverse(n=>{const i=n.name.toLowerCase();i.includes("righthand")&&!i.includes("thumb")&&!i.includes("index")&&!i.includes("middle")&&!i.includes("ring")&&!i.includes("pinky")&&(e=n)}),e){const n=new b;e.getWorldPosition(n);const i=new b(0,0,1).applyQuaternion(this.mesh.quaternion);return n.add(new b(0,.3,0)).addScaledVector(i,.5)}const t=new b().copy(this.mesh.position);return t.y+=1.4,t.addScaledVector(new b(0,0,1).applyAxisAngle(new b(0,1,0),this.mesh.rotation.y),.6)}createDustImpactVFX(e){if(!this.mesh.parent)return;const t=this.mesh.parent,n=18,i=[],s=[],a=new Yt(.12,6,6);for(let h=0;h<n;h++){const u=new bt({color:13421738,transparent:!0,opacity:.7,depthWrite:!1}),d=new j(a,u);d.position.copy(e).add(new b(0,.05,0));const f=h/n*Math.PI*2,p=2+Math.random()*2.5,_=new b(Math.cos(f)*p,.4+Math.random()*.8,Math.sin(f)*p);t.add(d),i.push(d),s.push(_)}let o=0;const l=.55,c=()=>{o+=.016;const h=o/l;i.forEach((u,d)=>{u.position.addScaledVector(s[d],.016),s[d].y-=4*.016,u.scale.addScalar(.016*3),u.material.opacity=Math.max(0,.7-h*1.3)}),o<l?requestAnimationFrame(c):i.forEach(u=>{t.remove(u),u.geometry.dispose(),u.material.dispose()})};requestAnimationFrame(c)}triggerHardLanding(){var n;if(this.isControlsLocked||this.isMovementLocked)return;this.isControlsLocked=!0,this.isMovementLocked=!0,this.velocity.set(0,0,0);const e=this.maxHealth*.15;this.takeDamage(e);const t=(n=window.gameInstance)==null?void 0:n.audioManager;t&&(t.playHardLandingImpact("stone"),t.playHardLandingGrunt()),this.createDustImpactVFX(this.mesh.position.clone()),console.log("[PlayerController] Triggered dangerous fall: playing Wukong_NoWood_HardLanding with dust VFX..."),this.animationController.playHardLanding(()=>{this.isControlsLocked=!1,this.isMovementLocked=!1})}};A(jn,"TEMP_GROUND_ORIGIN",new b),A(jn,"RAY_OFFSET",new b(0,.4,0)),A(jn,"DOWN_DIR",new b(0,-1,0));let yl=jn;const vi=class vi{constructor(e){A(this,"camera");A(this,"isCinematicActive",!1);A(this,"startPos",new b);A(this,"targetPos",new b);A(this,"startLookAt",new b);A(this,"targetLookAt",new b);A(this,"duration",1);A(this,"elapsedTime",0);A(this,"onCompleteCallback",null);this.camera=e}moveCamera(e,t,n,i,s){if(this.isCinematicActive&&this.onCompleteCallback){const a=this.onCompleteCallback;this.onCompleteCallback=null,a()}return new Promise(a=>{this.isCinematicActive=!0,this.startPos.copy(e),this.targetPos.copy(t),this.startLookAt.copy(n),this.targetLookAt.copy(i),this.duration=Math.max(.1,s),this.elapsedTime=0,this.onCompleteCallback=a})}update(e){if(!this.isCinematicActive)return;this.elapsedTime+=e;const t=Math.min(1,this.elapsedTime/this.duration),n=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;if(vi.TEMP_POS.lerpVectors(this.startPos,this.targetPos,n),vi.TEMP_LOOKAT.lerpVectors(this.startLookAt,this.targetLookAt,n),this.camera.position.copy(vi.TEMP_POS),this.camera.lookAt(vi.TEMP_LOOKAT),t>=1&&(this.isCinematicActive=!1,this.onCompleteCallback)){const i=this.onCompleteCallback;this.onCompleteCallback=null,i()}}abort(){if(this.isCinematicActive=!1,this.onCompleteCallback){const e=this.onCompleteCallback;this.onCompleteCallback=null,e()}}isActive(){return this.isCinematicActive}stop(){this.isCinematicActive=!1,this.onCompleteCallback=null}};A(vi,"TEMP_POS",new b),A(vi,"TEMP_LOOKAT",new b);let Ml=vi;class Zv{constructor(){A(this,"boxEl");A(this,"speakerEl");A(this,"textEl");A(this,"queue",[]);A(this,"isProcessing",!1);A(this,"timeoutId",null);this.boxEl=document.getElementById("subtitle-box"),this.speakerEl=document.getElementById("subtitle-speaker"),this.textEl=document.getElementById("subtitle-text")}show(e,t,n=4500){this.queue.push({speaker:e,text:t,durationMs:n}),this.processQueue()}processQueue(){if(this.isProcessing)return;if(this.queue.length===0){this.hide();return}this.isProcessing=!0;const e=this.queue.shift();this.speakerEl.textContent=e.speaker,this.textEl.textContent=e.text,this.boxEl.classList.remove("hidden"),this.timeoutId&&clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.isProcessing=!1,this.processQueue()},e.durationMs)}hide(){this.boxEl.classList.add("hidden"),this.isProcessing=!1,this.queue=[],this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null)}}class Jv{constructor(e,t,n=0,i=!1){A(this,"mesh");A(this,"isOpen",!1);A(this,"isLocked",!1);A(this,"id");A(this,"leftWing");A(this,"rightWing");A(this,"targetOpenAmount",0);A(this,"currentOpenAmount",0);this.id=e,this.isLocked=i,this.mesh=new lt,this.mesh.position.copy(t),this.mesh.rotation.y=n;const s=new Ge(3.2,4.2,.4),a=new Xe({color:3814981,roughness:.8}),o=new j(s,a);o.position.y=2.1,o.castShadow=!0,this.mesh.add(o);const l=new Ge(1.4,3.8,.2),c=new Xe({color:6044193,roughness:.7});this.leftWing=new j(l,c),this.leftWing.position.set(-.7,2,0),this.leftWing.castShadow=!0,this.rightWing=new j(l,c),this.rightWing.position.set(.7,2,0),this.rightWing.castShadow=!0;const h=new ai(.12,.02,8,12),u=new Xe({color:15976004,metalness:.8}),d=new j(h,u);d.position.set(.5,0,.12),this.leftWing.add(d);const f=new j(h,u);f.position.set(-.5,0,.12),this.rightWing.add(f),this.mesh.add(this.leftWing,this.rightWing)}open(e){this.isOpen||(this.isOpen=!0,this.targetOpenAmount=1,e&&e.playDoorOpen())}close(){this.isOpen=!1,this.targetOpenAmount=0}update(e){if(Math.abs(this.currentOpenAmount-this.targetOpenAmount)>.001){this.currentOpenAmount=mt.lerp(this.currentOpenAmount,this.targetOpenAmount,e*3);const t=Math.PI*.45*this.currentOpenAmount;this.leftWing.rotation.y=-t,this.rightWing.rotation.y=t}}}class jv{constructor(e,t,n,i,s){A(this,"cinematicCamera");A(this,"cameraController");A(this,"playerController");A(this,"subtitleSystem");A(this,"audioManager");A(this,"isPlayingSequence",!1);A(this,"skipRequested",!1);this.cinematicCamera=e,this.cameraController=t,this.playerController=n,this.subtitleSystem=i,this.audioManager=s}async play(e){this.isPlayingSequence=!0,this.skipRequested=!1,this.playerController.isControlsLocked=!0;for(const t of e){if(this.skipRequested){console.log("[CinematicManager] Sequence skipped by user.");break}await t(this)}this.isPlayingSequence=!1,this.playerController.isControlsLocked=!1,this.subtitleSystem.hide(),this.cinematicCamera.stop()}requestSkip(){this.isPlayingSequence&&(this.skipRequested=!0,this.subtitleSystem.hide())}}class Qv{constructor(e,t,n="FLIPENDO",i=35){A(this,"mesh");A(this,"velocity");A(this,"isDead",!1);A(this,"spellType");A(this,"lifetime",4);A(this,"age",0);A(this,"light");A(this,"particles");A(this,"particlePositions");this.spellType=n,this.mesh=new lt,this.mesh.position.copy(e);let s=4060159,a=8975871,o=.14;n==="ALOHOMORA"?(s=16766720,a=16771720,o=.16):n==="LUMOS"&&(s=16777164,a=16777215,o=.2),this.velocity=t.clone().multiplyScalar(i);const l=new Yt(o,12,12),c=new bt({color:s}),h=new j(l,c);this.mesh.add(h),this.light=new sn(s,3.5,7),this.mesh.add(this.light);const u=25,d=new gt;this.particlePositions=new Float32Array(u*3);for(let p=0;p<u;p++)this.particlePositions[p*3]=(Math.random()-.5)*.12,this.particlePositions[p*3+1]=(Math.random()-.5)*.12,this.particlePositions[p*3+2]=(Math.random()-.5)*.12;d.setAttribute("position",new ot(this.particlePositions,3));const f=new bi({color:a,size:.1,transparent:!0,opacity:.85});this.particles=new Oi(d,f),this.mesh.add(this.particles)}update(e){if(this.age+=e,this.age>=this.lifetime){this.isDead=!0;return}this.mesh.position.addScaledVector(this.velocity,e);const t=this.particles.geometry.attributes.position.array;for(let n=0;n<t.length/3;n++)t[n*3+2]-=e*2;this.particles.geometry.attributes.position.needsUpdate=!0}}class rs{constructor(e,t,n=[]){A(this,"mesh");A(this,"state","IDLE");A(this,"health",3);A(this,"maxHealth",3);A(this,"id");A(this,"isDead",!1);A(this,"isPaused",!1);A(this,"arenaCenter",null);A(this,"arenaRadius",15);A(this,"patrolWaypoints",[]);A(this,"currentWaypointIndex",0);A(this,"moveSpeed",2);A(this,"chaseSpeed",3.5);A(this,"detectionRadius",10);A(this,"attackRadius",1.8);A(this,"stunTimer",0);A(this,"hitFlashTimer",0);A(this,"knockbackVelocity",new b);A(this,"crabModel",null);A(this,"proceduralTime",0);A(this,"attackCooldown",0);A(this,"dyingTimer",0);A(this,"dyingDuration",.65);A(this,"deathVfxSpawned",!1);A(this,"dyingScaleStart",1);A(this,"scene",null);A(this,"bossChargeTimer",0);A(this,"bossLungeTimer",0);A(this,"bossLungeDir",new b);A(this,"onAttackPlayer");A(this,"onDeath");A(this,"legs",[]);A(this,"groundRaycaster",new sr);this.id=e,this.mesh=new lt,this.mesh.position.copy(t),this.patrolWaypoints=n.length>0?n:[t.clone()],this.createProceduralCrab()}setScene(e){this.scene=e}async loadModel(e=1){try{const i=(await new dr().loadAsync("/magic-academy-3d/assets/enemies/crab.glb")).scene,s=new rn().setFromObject(i),a=new b;s.getSize(a);const o=.8/Math.max(a.x,a.y,a.z)*e;for(i.scale.setScalar(o),i.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)});this.mesh.children.length>0;)this.mesh.remove(this.mesh.children[0]);this.crabModel=i,this.mesh.add(i),this.legs=[],i.traverse(l=>{const c=l.name.toLowerCase();(c.includes("leg")||c.includes("arm")||c.includes("claw")||c.includes("limb"))&&this.legs.push(l)}),console.log(`[EnemyController] Loaded crab.glb for '${this.id}' (${this.legs.length} leg nodes)`)}catch(t){console.warn(`[EnemyController] Could not load crab.glb for '${this.id}', using procedural`,t)}}createProceduralCrab(){const e=new Xe({color:9118976,roughness:.6,metalness:.3}),t=new Xe({color:7019776,roughness:.7}),n=new bt({color:16724787}),i=new j(new Yt(.4,10,8),e);i.scale.set(1.2,.6,1),i.position.y=.25,i.castShadow=!0,i.name="crab_body",this.mesh.add(i);const s=new j(new Yt(.06,6,6),n);s.position.set(-.15,.5,.3);const a=new j(new Yt(.06,6,6),n);a.position.set(.15,.5,.3),this.mesh.add(s,a),this.legs=[];for(let h=0;h<6;h++){const u=h<3?-1:1,d=h%3,f=new j(new Et(.03,.02,.5,6),t);f.position.set(u*(.35+d*.1),.1,-.15+d*.15),f.rotation.z=u*.6,f.name=`leg_${h}`,this.mesh.add(f),this.legs.push(f)}const o=new Ge(.15,.06,.2),l=new j(o,e);l.position.set(-.55,.25,.3),l.name="claw_L";const c=new j(o,e);c.position.set(.55,.25,.3),c.name="claw_R",this.mesh.add(l,c),this.legs.push(l,c)}safeNormalize(e,t=new b(0,0,1)){const n=e.lengthSq();return n>1e-6?e.divideScalar(Math.sqrt(n)):e.copy(t),e}takeHit(e){if(!(this.state==="DYING"||this.state==="DEAD")){if(this.id==="crab_boss"){if(this.state!=="STUNNED"){console.log("[Boss] Immune while active!");return}this.health=Math.max(0,this.health-1),this.hitFlashTimer=.25,console.log(`[Boss] Hit! HP: ${this.health}`),this.health<=0?this.triggerDeath():this.stunTimer=.1;return}if(this.health=Math.max(0,this.health-1),this.hitFlashTimer=.25,console.log(`[Enemy ${this.id}] Hit! HP: ${this.health}/${this.maxHealth}`),this.health<=0){this.triggerDeath();return}if(e){const t=new b().subVectors(this.mesh.position,e);t.y=0,this.safeNormalize(t),this.knockbackVelocity.copy(t).multiplyScalar(6.5)}else{const t=new b(0,0,1).applyAxisAngle(new b(0,1,0),this.mesh.rotation.y);this.knockbackVelocity.copy(t).multiplyScalar(-3)}this.state="FLIPPED",this.stunTimer=2.5,console.log(`[Enemy ${this.id}] FLIPPED!`)}}triggerDeath(){if(this.state==="DYING"||this.state==="DEAD")return;this.state="DYING",this.isDead=!0,this.hitFlashTimer=0,this.dyingTimer=this.dyingDuration,this.dyingScaleStart=this.mesh.scale.x,this.deathVfxSpawned=!1,this.knockbackVelocity.set(0,0,0),this.onAttackPlayer=void 0;const e=this.onDeath;this.onDeath=void 0,console.log(`[Enemy ${this.id}] DYING — triggering death sequence`),this.mesh.position.y+=.05,e==null||e(this)}spawnDeathVFX(){if(!this.scene)return;const e=this.mesh.position.clone().add(new b(0,.35,0)),t=new Yt(.15,8,8),n=new bt({color:16768324,transparent:!0,opacity:1,depthWrite:!1}),i=new j(t,n);i.position.copy(e),this.scene.add(i);const s=new cr(.05,.18,16),a=new bt({color:16746496,transparent:!0,opacity:.9,side:Qt,depthWrite:!1}),o=new j(s,a);o.position.copy(e),o.rotation.x=-Math.PI/2,this.scene.add(o);const l=22,c=[],h=[],u=[],d=[16737792,16763904,16724736,16755200,16777215];for(let v=0;v<l;v++){const w=v/l*Math.PI*2,E=(Math.random()-.3)*Math.PI,T=2.5+Math.random()*4,x=new b(Math.cos(w)*Math.cos(E),Math.abs(Math.sin(E))+.4,Math.sin(w)*Math.cos(E)).multiplyScalar(T),R=.04+Math.random()*.09,L=new or(R,0),I=new bt({color:d[Math.floor(Math.random()*d.length)],transparent:!0,opacity:1,depthWrite:!1}),F=new j(L,I);F.position.copy(e),F.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0),this.scene.add(F),u.push(F),c.push(e.clone()),h.push(x)}const f=3,p=[],_=[];for(let v=0;v<f;v++){const w=new Yt(.18,6,6),E=new bt({color:13421738,transparent:!0,opacity:.55,depthWrite:!1}),T=new j(w,E);T.position.copy(e).addScaledVector(new b(Math.random()-.5,Math.random()*.5,Math.random()-.5).normalize(),.15),this.scene.add(T),p.push(T),_.push(new b((Math.random()-.5)*1.2,.8+Math.random()*.6,(Math.random()-.5)*1.2))}let m=0;const g=.65,S=-6,M=()=>{m+=.016;const v=m/g,w=Math.min(1,v);i.scale.setScalar(1+w*7),n.opacity=Math.max(0,1-w*2.5);const E=1+w*12;o.scale.setScalar(E),a.opacity=Math.max(0,.9-w*1.8);for(let T=0;T<u.length;T++){const x=h[T];x.y+=S*.016,u[T].position.addScaledVector(x,.016),u[T].rotation.x+=.1,u[T].rotation.z+=.08;const R=Math.max(0,1-Math.max(0,(v-.35)/.65));u[T].material.opacity=R}for(let T=0;T<p.length;T++){p[T].position.addScaledVector(_[T],.016),p[T].scale.addScalar(.016*2.5);const x=Math.max(0,.55-w*.9);p[T].material.opacity=x}m<g+.1?requestAnimationFrame(M):(this.scene&&(this.scene.remove(i),this.scene.remove(o),u.forEach(T=>this.scene.remove(T)),p.forEach(T=>this.scene.remove(T))),n.dispose(),a.dispose(),u.forEach(T=>T.material.dispose()),p.forEach(T=>T.material.dispose()),t.dispose(),s.dispose(),u.forEach(T=>T.geometry.dispose()),p.forEach(T=>T.geometry.dispose()))};requestAnimationFrame(M)}update(e,t,n){var s,a;if(this.isPaused||this.state==="DEAD")return;if(this.proceduralTime+=e*6,this.state==="DYING"){if(this.deathVfxSpawned||(this.deathVfxSpawned=!0,this.spawnDeathVFX(),console.log("[BOSS] Entering DYING — defeat sequence started")),this.dyingTimer-=e,this.id==="crab_boss"){this.mesh.rotation.z=mt.lerp(this.mesh.rotation.z,Math.PI,e*5),this.mesh.visible=!0,this.dyingTimer<=0&&(this.state="DEAD",this.isDead=!0,console.log("[BOSS] Death sequence completed — lying defeated on floor"));return}const o=Math.max(0,this.dyingTimer/this.dyingDuration),l=Math.min(1,(1-o)*3),c=1-l*.6,h=1+l*.3,u=Math.max(.001,o);this.mesh.scale.set(this.dyingScaleStart*h*u,this.dyingScaleStart*c*u,this.dyingScaleStart*h*u),this.mesh.rotation.y+=e*8,this.mesh.rotation.z+=e*5,this.dyingTimer<=0&&(this.mesh.visible=!1,this.state="DEAD",this.isDead=!0);return}if(this.hitFlashTimer>0?(this.hitFlashTimer-=e,this.mesh.traverse(o=>{if(o.isMesh&&o.material){const l=o.material;l.emissive&&l.emissive.setHex(16720384)}})):this.mesh.traverse(o=>{if(o.isMesh&&o.material){const l=o.material;l.emissive&&l.emissive.setHex(0)}}),n&&n.length>0){const o=new b().copy(this.mesh.position);o.y=Math.max(this.mesh.position.y+3,6),this.groundRaycaster.set(o,new b(0,-1,0));const l=this.groundRaycaster.intersectObjects(n,!0);if(l.length>0){let c=l[0].point.y;this.state==="FLIPPED"&&(c+=.5),this.mesh.position.y=mt.lerp(this.mesh.position.y,c,e*10)}}if(this.state!=="FLIPPED"&&(this.mesh.rotation.z=mt.lerp(this.mesh.rotation.z,0,e*8)),this.arenaCenter){const o=t.distanceTo(this.arenaCenter),l=this.mesh.position.distanceTo(this.arenaCenter);if(o>this.arenaRadius||l>this.arenaRadius+1){const c=this.patrolWaypoints[0];if(this.mesh.position.distanceTo(c)>.5){this.state="IDLE";const u=new b().subVectors(c,this.mesh.position);u.y=0,this.safeNormalize(u),this.mesh.position.addScaledVector(u,this.moveSpeed*e),this.mesh.rotation.y=Math.atan2(u.x,u.z)}else this.state="IDLE",this.mesh.rotation.y=0;this.animateLegs(e);return}}const i=this.mesh.position.distanceTo(t);switch(this.state){case"FLIPPED":this.stunTimer-=e,this.knockbackVelocity.lengthSq()>.01&&(this.mesh.position.addScaledVector(this.knockbackVelocity,e),this.knockbackVelocity.multiplyScalar(Math.exp(-4*e))),this.mesh.rotation.z=mt.lerp(this.mesh.rotation.z,Math.PI,e*8),this.proceduralTime+=e*15;for(let o=0;o<this.legs.length;o++){const l=o*.8;this.legs[o].rotation.x=Math.sin(this.proceduralTime+l)*.45,this.legs[o].rotation.z=Math.cos(this.proceduralTime+l)*.45}if(this.stunTimer<=0){this.state="CHASE";for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=0,this.legs[o].rotation.z=0}break;case"STUNNED":this.stunTimer-=e,this.mesh.rotation.z=Math.sin(this.proceduralTime*4)*.25;for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=Math.sin(this.proceduralTime+o)*.5;if(this.stunTimer<=0){this.state="CHASE",this.mesh.rotation.z=0;for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=0}break;case"IDLE":case"PATROL":i<=this.detectionRadius?this.state="CHASE":this.patrolBehavior(e);break;case"CHASE":i<=(this.id==="crab_boss"?5:this.attackRadius)?this.state="ATTACK":i>this.detectionRadius*2?this.state="PATROL":this.chaseBehavior(e,t);break;case"ATTACK":this.id==="crab_boss"?this.bossChargeTimer>0?(this.bossChargeTimer-=e,this.mesh.rotation.y+=Math.sin(performance.now()*.05)*.1,this.hitFlashTimer=.05,this.bossChargeTimer<=0&&(this.bossLungeTimer=.6,this.bossLungeDir.subVectors(t,this.mesh.position),this.bossLungeDir.y=0,this.safeNormalize(this.bossLungeDir),this.mesh.rotation.y=Math.atan2(this.bossLungeDir.x,this.bossLungeDir.z))):this.bossLungeTimer>0?(this.bossLungeTimer-=e,this.mesh.position.addScaledVector(this.bossLungeDir,14*e),i<3.2&&((s=this.onAttackPlayer)==null||s.call(this,25),this.bossLungeTimer=0),this.bossLungeTimer<=0&&(this.state="STUNNED",this.stunTimer=3)):this.bossChargeTimer=.8:i>this.attackRadius*1.2?this.state="CHASE":(this.attackCooldown-=e,this.attackCooldown<=0&&(this.attackCooldown=1.2,(a=this.onAttackPlayer)==null||a.call(this,12)));break}this.animateLegs(e)}animateLegs(e){if(this.state==="FLIPPED"||this.state==="DYING"||this.state==="DEAD")return;const t=this.state==="CHASE"||this.state==="PATROL"||this.state==="ATTACK",n=this.state==="CHASE"?12:6;for(let i=0;i<this.legs.length;i++){const s=this.legs[i];if(t){const a=i%2===0?0:Math.PI;s.rotation.x=Math.sin(this.proceduralTime*n+a+i*.8)*.4}else s.rotation.x=Math.sin(this.proceduralTime*1.5+i*.5)*.05}t&&this.crabModel&&(this.crabModel.position.y=Math.abs(Math.sin(this.proceduralTime*8))*.03)}patrolBehavior(e){if(this.patrolWaypoints.length===0)return;const t=this.patrolWaypoints[this.currentWaypointIndex];if(this.mesh.position.distanceTo(t)<.5)this.currentWaypointIndex=(this.currentWaypointIndex+1)%this.patrolWaypoints.length;else{const i=new b().subVectors(t,this.mesh.position);i.y=0,this.safeNormalize(i),this.mesh.position.addScaledVector(i,this.moveSpeed*e),this.mesh.rotation.y=Math.atan2(i.x,i.z)}}chaseBehavior(e,t){const n=new b().subVectors(t,this.mesh.position);n.y=0,this.safeNormalize(n),this.mesh.position.addScaledVector(n,this.chaseSpeed*e),this.mesh.rotation.y=Math.atan2(n.x,n.z)}isAlive(){return this.state!=="DYING"&&this.state!=="DEAD"}getPosition(){return this.mesh.position}dispose(){this.isDead=!0,this.state="DEAD",this.mesh.visible=!1,this.onDeath=void 0,this.onAttackPlayer=void 0}}class $r{constructor(e,t,n="COIN",i){A(this,"mesh");A(this,"isCollected",!1);A(this,"id");A(this,"type");A(this,"floatMesh");A(this,"spawnTime");A(this,"scaleFactor",1);if(this.id=e,this.type=n,this.mesh=new lt,this.mesh.position.copy(t),this.spawnTime=Date.now(),n==="CARD"){const s=new Ge(.35,.55,.02),a=new Xe({color:15976004,emissive:10055168,emissiveIntensity:.5,metalness:.8,roughness:.2});this.floatMesh=new j(s,a)}else if(n==="COIN")if(i){this.floatMesh=i.clone();const s=new rn().setFromObject(this.floatMesh),a=new b;s.getCenter(a);const o=new b;s.getSize(o);const l=Math.max(o.x,o.y,o.z),c=.3;this.scaleFactor=l>.001?c/l:.25,this.floatMesh.scale.setScalar(this.scaleFactor);for(const h of this.floatMesh.children)h.position.sub(a)}else{const s=new Et(.1,.1,.03,16),a=new Xe({color:16766720,emissive:11175936,emissiveIntensity:.6,metalness:.9,roughness:.1}),o=new j(s,a);o.rotation.x=Math.PI/2,this.floatMesh=o,this.scaleFactor=1}else if(n==="CHOCOLATE_FROG"){const s=new xs(.18),a=new Xe({color:4861467,roughness:.5});this.floatMesh=new j(s,a)}else{const a=n==="POTION_HP"?16720452:43775,o=new lt,l=new Et(.12,.18,.4,8),c=new Xe({color:a,emissive:a,emissiveIntensity:.4,roughness:.2,transparent:!0,opacity:.85}),h=new j(l,c);h.position.y=.2;const u=new Et(.06,.06,.1,8),d=new Xe({color:7816226}),f=new j(u,d);f.position.y=.45,o.add(h,f),this.floatMesh=o}this.floatMesh.castShadow=!0,this.mesh.add(this.floatMesh)}update(e){if(!this.isCollected)if(this.type==="CHOCOLATE_FROG")this.floatMesh.position.y=Math.abs(Math.sin(Date.now()*.006))*.25;else if(this.type==="COIN"){const t=Date.now()-this.spawnTime;let n=Math.sin(Date.now()*.005)*.05,i=1;if(t<1e3){const s=t/1e3;n+=Math.abs(Math.sin(s*Math.PI*3))*(1-s)*1.2,i=Math.min(1,s*2)}this.floatMesh.scale.setScalar(i*this.scaleFactor),this.floatMesh.rotation.y+=e*3,this.floatMesh.position.y=n+.1}else this.floatMesh.rotation.y+=e*2,this.floatMesh.position.y=Math.sin(Date.now()*.003)*.12}}class ey{constructor(e,t){A(this,"collectibles",[]);A(this,"collectedCount",0);A(this,"coinCount",0);A(this,"totalCards",3);A(this,"audioManager");A(this,"scene");A(this,"coinTemplate",null);this.scene=e,this.audioManager=t}spawnCard(e,t){const n=new $r(e,t,"CARD");this.collectibles.push(n),this.scene.add(n.mesh)}spawnCoin(e,t){const n=new $r(e,t,"COIN",this.coinTemplate||void 0);this.collectibles.push(n),this.scene.add(n.mesh)}spawnFrog(e,t){const n=new $r(e,t,"CHOCOLATE_FROG");this.collectibles.push(n),this.scene.add(n.mesh)}spawnPotion(e,t,n){const i=new $r(e,t,n);this.collectibles.push(i),this.scene.add(i.mesh)}update(e,t,n,i,s){for(const a of this.collectibles)a.isCollected||(a.update(t),a.mesh.position.distanceTo(e)<1.2&&(a.isCollected=!0,this.scene.remove(a.mesh),a.type==="CARD"?(this.collectedCount++,this.audioManager.playCardPickup(),n(this.collectedCount)):a.type==="COIN"?(this.coinCount++,this.audioManager.playBeanPickup(),this.spawnSparks(a.mesh.position),i==null||i(this.coinCount)):a.type==="CHOCOLATE_FROG"?(this.audioManager.playFrogPickup(),s==null||s("CHOCOLATE_FROG")):(a.type==="POTION_HP"||a.type==="POTION_MP")&&(this.audioManager.playPotionPickup(),s==null||s(a.type))))}spawnSparks(e){const n=new gt,i=new Float32Array(20*3),s=new Float32Array(20*3),a=[],o=new _e().setHSL(Math.random(),1,.5);for(let d=0;d<20;d++){i[d*3]=e.x,i[d*3+1]=e.y+.5,i[d*3+2]=e.z;const f=o.clone().offsetHSL(Math.random()*.2-.1,0,Math.random()*.2);s[d*3]=f.r,s[d*3+1]=f.g,s[d*3+2]=f.b,a.push((Math.random()-.5)*4,Math.random()*4+2,(Math.random()-.5)*4)}n.setAttribute("position",new ot(i,3)),n.setAttribute("color",new ot(s,3));const l=new bi({size:.15,vertexColors:!0,transparent:!0,opacity:1,blending:Xs,depthWrite:!1}),c=new Oi(n,l);this.scene.add(c);let h=0;const u=()=>{if(h+=.016,h>.6){this.scene.remove(c),n.dispose(),l.dispose();return}const d=n.attributes.position.array;for(let f=0;f<20;f++)d[f*3]+=a[f*3]*.016,d[f*3+1]+=a[f*3+1]*.016,d[f*3+2]+=a[f*3+2]*.016,a[f*3+1]-=9.8*.016;n.attributes.position.needsUpdate=!0,l.opacity=1-h/.6,requestAnimationFrame(u)};u()}}class ty{constructor(e,t){A(this,"mesh");A(this,"isBroken",!1);A(this,"position");A(this,"onDestruct");A(this,"bodyMesh");A(this,"scene");this.position=e.clone(),this.scene=t,this.mesh=new lt,this.mesh.position.copy(e);const n=new Et(.35,.45,.9,12),i=new Xe({color:10506797,roughness:.8,metalness:.1});this.bodyMesh=new j(n,i),this.bodyMesh.position.y=.45,this.bodyMesh.castShadow=!0,this.bodyMesh.receiveShadow=!0,this.mesh.add(this.bodyMesh);const s=new ai(.36,.04,8,16),a=new j(s,i);a.rotation.x=Math.PI/2,a.position.y=.9,this.mesh.add(a),t.add(this.mesh)}shatter(e,t){if(this.isBroken)return;this.isBroken=!0,this.onDestruct&&this.onDestruct(),e.playPotShatter();const n=8,i=new Ge(.15,.15,.15),s=new Xe({color:9127187,roughness:.9}),a=new lt;a.position.copy(this.mesh.position);for(let h=0;h<n;h++){const u=new j(i,s);u.position.set((Math.random()-.5)*.4,.2+Math.random()*.4,(Math.random()-.5)*.4),a.add(u)}this.scene.add(a),this.scene.remove(this.mesh);let o=0;const l=()=>{o+=.016,a.children.forEach(h=>{h.position.y-=2*.016,h.rotation.x+=.1,h.rotation.y+=.1}),o<.6?requestAnimationFrame(l):this.scene.remove(a)};l(),Math.random()<.3?t.spawnFrog("frog_"+Date.now(),new b(this.position.x,.2,this.position.z)):Math.random()>.5&&t.spawnCoin(`pot_coin_${Date.now()}`,this.mesh.position.clone().add(new b(0,.5,0)))}}class ny{constructor(e,t=0){A(this,"mesh");A(this,"isUnlocked",!1);A(this,"position");A(this,"lidMesh");A(this,"lockLight");A(this,"lockMesh");this.position=e.clone(),this.mesh=new lt,this.mesh.position.copy(e),this.mesh.rotation.y=t;const n=new Xe({color:6044193,roughness:.7}),i=new Xe({color:13934615,metalness:.8,roughness:.3}),s=new Ge(1.2,.6,.8),a=new j(s,n);a.position.y=.3,a.castShadow=!0,a.receiveShadow=!0,this.mesh.add(a);const o=new j(new Ge(.1,.62,.82),i);o.position.set(-.5,.3,0);const l=new j(new Ge(.1,.62,.82),i);l.position.set(.5,.3,0),this.mesh.add(o,l),this.lidMesh=new lt,this.lidMesh.position.set(0,.6,-.4);const c=new j(new Et(.4,.4,1.2,12,1,!1,0,Math.PI),n);c.rotation.z=Math.PI/2,c.position.set(0,0,.4),this.lidMesh.add(c),this.mesh.add(this.lidMesh);const h=new ai(.1,.03,8,16);this.lockMesh=new j(h,i),this.lockMesh.position.set(0,.45,.43),this.mesh.add(this.lockMesh),this.lockLight=new sn(16766720,1.2,2.5),this.lockLight.position.copy(this.lockMesh.position),this.mesh.add(this.lockLight)}unlock(e,t,n){e.playChestOpen(),this.lockMesh.visible=!1,this.lockLight.color.setHex(4060159);const i=Date.now(),s=()=>{const a=(Date.now()-i)/1e3,o=Math.min(1,a/.8);this.lidMesh.rotation.x=-o*(Math.PI*.55),o<1?requestAnimationFrame(s):n&&n()};s()}}class iy{constructor(e,t,n){A(this,"mesh");A(this,"isLit",!1);A(this,"position");A(this,"ghostPlatforms",[]);A(this,"eyesLight");A(this,"headMesh");A(this,"mat");this.position=e.clone(),this.mesh=new lt,this.mesh.position.copy(e);const i=new Xe({color:4867930,roughness:.9}),s=new j(new Ge(.8,1.2,.8),i);s.position.y=.6,s.castShadow=!0,s.receiveShadow=!0,this.mesh.add(s),this.mat=new Xe({color:3683653,roughness:.8}),this.headMesh=new j(new xs(.4),this.mat),this.headMesh.position.set(0,1.4,0),this.mesh.add(this.headMesh);const a=new Xe({color:2762808}),o=new j(new _a(.3,.9,4),a);o.rotation.z=Math.PI/3,o.position.set(-.5,1.4,0);const l=new j(new _a(.3,.9,4),a);l.rotation.z=-Math.PI/3,l.position.set(.5,1.4,0),this.mesh.add(o,l),this.eyesLight=new sn(16777215,0,8),this.eyesLight.position.set(0,1.5,.3),this.mesh.add(this.eyesLight);const c=new Xe({color:8975871,emissive:4060159,emissiveIntensity:.6,transparent:!0,opacity:0,roughness:.1});n.forEach(h=>{const u=new j(new Ge(3.5,.3,3.5),c.clone());u.position.copy(h),u.visible=!1,t.add(u),this.ghostPlatforms.push(u)}),t.add(this.mesh)}activateLumos(e,t){this.isLit||(this.isLit=!0,e.playLumosGargoyle(),this.mat.emissive.setHex(16777096),this.mat.emissiveIntensity=.8,this.eyesLight.color.setHex(16777130),this.eyesLight.intensity=4,this.ghostPlatforms.forEach(n=>{n.visible=!0,t.push(n);const i=n.material;let s=0;const a=()=>{s+=.05,i.opacity=Math.min(.75,s),s<.75&&requestAnimationFrame(a)};a()}))}}class sy{constructor(){A(this,"mesh");A(this,"ringMesh");A(this,"iconMesh");A(this,"ringMat");A(this,"iconMat");A(this,"targetObject",null);A(this,"isVisible",!1);this.mesh=new lt,this.mesh.name="TargetReticle3D",this.mesh.visible=!1;const e=new cr(.5,.65,32);this.ringMat=new bt({color:4060159,side:Qt,transparent:!0,opacity:.9}),this.ringMesh=new j(e,this.ringMat),this.mesh.add(this.ringMesh);const t=new lr(.6,.6),n=document.createElement("canvas");n.width=128,n.height=128;const i=new Jn(n);this.iconMat=new bt({map:i,side:Qt,transparent:!0,opacity:.95}),this.iconMesh=new j(t,this.iconMat),this.iconMesh.position.z=.02,this.mesh.add(this.iconMesh),this.updateIcon("FLIPENDO")}updateIcon(e){const t=document.createElement("canvas");t.width=128,t.height=128;const n=t.getContext("2d");n.clearRect(0,0,128,128),n.textAlign="center",n.textBaseline="middle";let i=4060159;e==="FLIPENDO"?(i=4060159,n.fillStyle="#3df3ff",n.font="bold 64px sans-serif",n.fillText("✋",64,64)):e==="ALOHOMORA"?(i=16766720,n.fillStyle="#ffd700",n.font="bold 64px sans-serif",n.fillText("🔑",64,64)):e==="LUMOS"?(i=16777130,n.fillStyle="#ffffaa",n.font="bold 64px sans-serif",n.fillText("💡",64,64)):(i=16729122,n.fillStyle="#ff4422",n.font="bold 64px sans-serif",n.fillText("🎯",64,64)),this.ringMat.color.setHex(i);const s=new Jn(t);this.iconMat.map=s,this.iconMat.needsUpdate=!0}attachTo(e,t){this.targetObject=e,this.updateIcon(t),this.mesh.visible=!0,this.isVisible=!0}detach(){this.targetObject=null,this.mesh.visible=!1,this.isVisible=!1}update(e){if(!this.isVisible||!this.targetObject)return;const t=new b;this.targetObject.getWorldPosition(t),t.y+=.8,this.mesh.position.copy(t),this.mesh.lookAt(e),this.ringMesh.rotation.z+=.03}}class ry{constructor(e,t){A(this,"scene");A(this,"audioManager");A(this,"collectibleSystem");A(this,"reticle3D");A(this,"projectiles",[]);A(this,"targets",[]);A(this,"enemies",[]);A(this,"pots",[]);A(this,"chests",[]);A(this,"gargoyles",[]);A(this,"activeSpell","FLIPENDO");A(this,"spellCooldown",0);A(this,"onCollectStaffCallback");this.scene=e,this.audioManager=t,this.reticle3D=new sy,this.scene.add(this.reticle3D.mesh)}setCollectibleSystem(e){this.collectibleSystem=e}setActiveSpell(e){this.activeSpell!==e&&(this.activeSpell=e,this.audioManager.playSpellSwitch(),console.log(`[SpellSystem] Active spell switched to: ${e}`))}castActiveSpell(e,t){if(this.spellCooldown>0)return!1;const n=new Qv(e,t,this.activeSpell);return this.projectiles.push(n),this.scene.add(n.mesh),this.activeSpell==="FLIPENDO"?this.audioManager.playFlipendoCast():this.activeSpell==="ALOHOMORA"?this.audioManager.playAlohomoraCast():this.activeSpell==="LUMOS"&&this.audioManager.playLumosCast(),this.spellCooldown=.12,!0}registerTarget(e){this.targets.push(e),this.scene.add(e.mesh)}registerEnemy(e){this.enemies.push(e)}registerPot(e){this.pots.push(e)}registerChest(e){this.chests.push(e)}registerGargoyle(e){this.gargoyles.push(e)}getAimedDirection(e,t,n){let i=null,s=-1/0;const a=22,o=(l,c)=>{const h=l.distanceTo(t);if(h>a)return;const u=l.clone().sub(t).normalize(),d=n.dot(u);if(d>.85){const f=c?.3:0,p=d*2-h/a*.5+f;p>s&&(s=p,i=l.clone())}};for(const l of this.enemies)l.isAlive()&&o(l.getPosition().clone().add(new b(0,.6,0)),!0);for(const l of this.pots)l.isBroken||o(l.position.clone().add(new b(0,.4,0)),this.activeSpell==="FLIPENDO");for(const l of this.chests)l.isUnlocked||o(l.position.clone().add(new b(0,.5,0)),this.activeSpell==="ALOHOMORA");for(const l of this.gargoyles)l.isLit||o(l.position.clone().add(new b(0,.6,0)),this.activeSpell==="LUMOS");for(const l of this.targets)if(!l.isActivated){const c=new b;l.mesh.getWorldPosition(c),o(c,this.activeSpell==="FLIPENDO")}if(i){const l=i.sub(e).normalize();return n.clone().lerp(l,.85).normalize()}return n.clone()}updateTargetLockon(e,t){let n=null,i=18,s="FLIPENDO";for(const a of this.enemies)if(a.isAlive()){const o=a.getPosition(),l=o.distanceTo(e),c=o.clone().sub(e).normalize();t.dot(c)>.85&&l<i&&(i=l,n=a.mesh,s="FLIPENDO")}for(const a of this.pots)if(!a.isBroken){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="FLIPENDO")}for(const a of this.chests)if(!a.isUnlocked){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="ALOHOMORA")}for(const a of this.gargoyles)if(!a.isLit){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="LUMOS")}for(const a of this.targets)if(!a.isActivated){const o=new b;a.mesh.getWorldPosition(o);const l=o.distanceTo(e),c=o.clone().sub(e).normalize();t.dot(c)>.85&&l<i&&(i=l,n=a.mesh,s="FLIPENDO")}n?(this.reticle3D.attachTo(n,s),this.reticle3D.update(e)):this.reticle3D.detach()}update(e,t){this.spellCooldown>0&&(this.spellCooldown-=e),this.targets.forEach(n=>n.update(e));for(let n=this.projectiles.length-1;n>=0;n--){const i=this.projectiles[n];if(i.update(e),i.isDead){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.spellType==="FLIPENDO"){let c=!1;for(const h of this.pots)if(!h.isBroken&&i.mesh.position.distanceTo(h.position)<1){h.shatter(this.audioManager,this.collectibleSystem),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;if(i.spellType==="ALOHOMORA"){let c=!1;for(const h of this.chests)if(!h.isUnlocked&&i.mesh.position.distanceTo(h.position)<1.4){h.unlock(this.audioManager,this.collectibleSystem,this.onCollectStaffCallback),this.createImpactParticles(i.mesh.position,16766720),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;if(i.spellType==="LUMOS"){let c=!1;for(const h of this.gargoyles)if(!h.isLit&&i.mesh.position.distanceTo(h.position)<1.8){h.activateLumos(this.audioManager,t),this.createImpactParticles(i.mesh.position,16777096),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;let s=!1;for(const c of this.targets)if(!c.isActivated){const h=new b;if(c.mesh.getWorldPosition(h),i.mesh.position.distanceTo(h)<1){c.activate(),this.audioManager.playTargetHit(),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,s=!0;break}}if(s){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.isDead)continue;let a=!1;for(const c of this.enemies)if(c.isAlive()){const h=c.getPosition();if(i.mesh.position.distanceTo(h)<1.2){c.takeHit(),this.audioManager.playEnemyStun(),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,a=!0;break}}if(a){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.isDead)continue;if(new sr(i.mesh.position,i.velocity.clone().normalize(),0,.6).intersectObjects(t,!0).length>0){this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}}createImpactParticles(e,t=4060159){const i=new gt,s=new Float32Array(20*3),a=[];for(let u=0;u<20;u++)s[u*3]=e.x,s[u*3+1]=e.y,s[u*3+2]=e.z,a.push(new b((Math.random()-.5)*4.5,(Math.random()-.5)*4.5,(Math.random()-.5)*4.5));i.setAttribute("position",new ot(s,3));const o=new bi({color:t,size:.14,transparent:!0,opacity:1}),l=new Oi(i,o);this.scene.add(l);let c=0;const h=()=>{c+=.016;const u=l.geometry.attributes.position.array;for(let d=0;d<20;d++)u[d*3]+=a[d].x*.016,u[d*3+1]+=a[d].y*.016,u[d*3+2]+=a[d].z*.016;l.geometry.attributes.position.needsUpdate=!0,o.opacity=Math.max(0,1-c*2.5),c<.4?requestAnimationFrame(h):(this.scene.remove(l),i.dispose(),o.dispose())};h()}}class ay{constructor(){A(this,"checkpoints",[]);A(this,"currentCheckpointIndex",0);A(this,"abyssYThreshold",-8)}addCheckpoint(e,t,n=0){this.checkpoints.push({id:e,position:t.clone(),rotationY:n})}setActiveCheckpoint(e){const t=this.checkpoints.findIndex(n=>n.id===e);t!==-1&&t>this.currentCheckpointIndex&&(this.currentCheckpointIndex=t,console.log(`[CheckpointManager] Activated Checkpoint #${e}`))}update(e){return e.mesh.position.y<this.abyssYThreshold?(this.respawnPlayer(e),!0):!1}respawnPlayer(e){const t=this.checkpoints[this.currentCheckpointIndex];t&&(e.mesh.position.copy(t.position),e.mesh.rotation.y=t.rotationY,e.velocity.set(0,0,0),console.log(`[CheckpointManager] Player respawned at Checkpoint #${t.id}`))}getCurrentCheckpointId(){var e;return((e=this.checkpoints[this.currentCheckpointIndex])==null?void 0:e.id)??0}getActiveCheckpointPosition(){var e;return((e=this.checkpoints[this.currentCheckpointIndex])==null?void 0:e.position.clone())??new b(0,.2,12)}}class oy{constructor(){A(this,"reticleEl");A(this,"hudTopLeftEl");A(this,"hudTopRightEl");A(this,"objectiveContainerEl");A(this,"spellHotbarEl");A(this,"objectiveTextEl");A(this,"cardCounterEl",null);A(this,"interactionPromptEl");A(this,"interactionLabelEl");A(this,"debugOverlayEl");A(this,"debugFpsEl");A(this,"debugPosEl");A(this,"debugStateEl");A(this,"debugAnimEl");A(this,"debugCheckpointEl");A(this,"victoryScreenEl");A(this,"victoryCardsEl");A(this,"victoryTimeEl");A(this,"hpBarFillEl");A(this,"mpBarFillEl");A(this,"coinCounterEl",null);A(this,"keyCounterEl",null);A(this,"gekkoQuestBadgeEl",null);A(this,"damageFlashEl");A(this,"screenFadeEl");A(this,"dialogueBubbleEl");A(this,"dialogueSpeakerEl");A(this,"dialogueTextEl");A(this,"slotSpell1El");A(this,"slotSpell2El");A(this,"slotSpell3El");A(this,"isDebugMode",!1);A(this,"typewriterInterval");this.reticleEl=document.getElementById("reticle"),this.hudTopLeftEl=document.getElementById("hud-top-left"),this.hudTopRightEl=document.getElementById("hud-top-right"),this.objectiveContainerEl=document.getElementById("objective-container"),this.spellHotbarEl=document.getElementById("spell-hotbar"),this.objectiveTextEl=document.getElementById("objective-text"),this.interactionPromptEl=document.getElementById("interaction-prompt"),this.interactionLabelEl=document.getElementById("interaction-label"),this.debugOverlayEl=document.getElementById("debug-overlay"),this.debugFpsEl=document.getElementById("debug-fps"),this.debugPosEl=document.getElementById("debug-pos"),this.debugStateEl=document.getElementById("debug-state"),this.debugAnimEl=document.getElementById("debug-anim"),this.debugCheckpointEl=document.getElementById("debug-checkpoint"),this.victoryScreenEl=document.getElementById("victory-screen"),this.victoryCardsEl=document.getElementById("victory-cards"),this.victoryTimeEl=document.getElementById("victory-time"),this.coinCounterEl=document.getElementById("coin-count"),this.keyCounterEl=document.getElementById("key-count"),this.cardCounterEl=document.getElementById("card-count"),this.gekkoQuestBadgeEl=document.getElementById("gekko-quest-complete"),this.hpBarFillEl=document.getElementById("hp-bar-fill"),this.mpBarFillEl=document.getElementById("mp-bar-fill"),this.slotSpell1El=document.getElementById("slot-spell-1"),this.slotSpell2El=document.getElementById("slot-spell-2"),this.slotSpell3El=document.getElementById("slot-spell-3"),this.damageFlashEl=document.getElementById("damage-flash"),this.screenFadeEl=document.getElementById("screen-fade"),this.dialogueBubbleEl=document.getElementById("dialogue-bubble"),this.dialogueSpeakerEl=document.getElementById("dialogue-speaker"),this.dialogueTextEl=document.getElementById("dialogue-text")}showGameplayHUD(){this.hudTopLeftEl.classList.remove("hidden"),this.hudTopRightEl.classList.remove("hidden"),this.spellHotbarEl.classList.remove("hidden")}setHealth(e,t=100){const n=Math.max(0,Math.ceil(e)),i=Math.max(0,Math.min(100,e/t*100));this.hpBarFillEl.style.width=`${i}%`;const s=document.getElementById("hp-text");s&&(s.textContent=`${n} / ${t}`)}setMana(e,t=100){const n=Math.max(0,Math.ceil(e)),i=Math.max(0,Math.min(100,e/t*100));this.mpBarFillEl.style.width=`${i}%`;const s=document.getElementById("mp-text");s&&(s.textContent=`${n} / ${t}`)}setCoinCount(e){if(this.coinCounterEl){this.coinCounterEl.textContent=e.toString()+" / 50";const t=document.getElementById("coin-counter-container");t&&(t.style.removeProperty("display"),t.classList.remove("hidden"))}this.gekkoQuestBadgeEl&&(e>=50?this.gekkoQuestBadgeEl.classList.remove("hidden"):this.gekkoQuestBadgeEl.classList.add("hidden"))}setKeyCount(e){this.keyCounterEl&&(this.keyCounterEl.textContent=`Llaves: ${e} / 5`)}setActiveSpellSlot(e){this.slotSpell1El.classList.remove("active"),this.slotSpell2El.classList.remove("active"),this.slotSpell3El.classList.remove("active"),e==="FLIPENDO"?this.slotSpell1El.classList.add("active"):e==="ALOHOMORA"?this.slotSpell2El.classList.add("active"):e==="LUMOS"&&this.slotSpell3El.classList.add("active")}triggerDamageFlash(){this.damageFlashEl.classList.remove("hidden"),this.damageFlashEl.style.animation="none",this.damageFlashEl.offsetHeight,this.damageFlashEl.style.animation="flash-red 0.3s ease-out forwards",setTimeout(()=>{this.damageFlashEl.classList.add("hidden")},300)}showReticle(e){e?this.reticleEl.classList.remove("hidden"):this.reticleEl.classList.add("hidden")}setObjective(e){e?(this.objectiveContainerEl.classList.remove("hidden"),this.objectiveTextEl.textContent=e):this.objectiveContainerEl.classList.add("hidden")}setCardCount(e,t=3){this.cardCounterEl&&(this.cardCounterEl.textContent=`${e} / ${t}`)}showInteractionPrompt(e){this.interactionLabelEl.textContent=e,this.interactionPromptEl.classList.remove("hidden")}hideInteractionPrompt(){this.interactionPromptEl.classList.add("hidden")}toggleDebug(){this.isDebugMode=!this.isDebugMode,this.isDebugMode?this.debugOverlayEl.classList.remove("hidden"):this.debugOverlayEl.classList.add("hidden")}updateDebugStats(e,t,n,i,s,a,o){this.isDebugMode&&(this.debugFpsEl.textContent=e.toString(),this.debugPosEl.textContent=`${t.toFixed(1)}, ${n.toFixed(1)}, ${i.toFixed(1)}`,this.debugStateEl.textContent=s,this.debugAnimEl.textContent=a,this.debugCheckpointEl.textContent=o.toString())}showVictoryScreen(e,t){this.victoryCardsEl.textContent=`${e} / 3`,this.victoryTimeEl.textContent=t,this.victoryScreenEl.classList.remove("hidden")}hideVictoryScreen(){this.victoryScreenEl.classList.add("hidden")}showTypewriterDialogue(e,t,n){this.dialogueBubbleEl.classList.remove("hidden"),this.dialogueSpeakerEl.textContent=e,this.dialogueTextEl.textContent="",this.typewriterInterval&&clearInterval(this.typewriterInterval);let i=0;this.typewriterInterval=setInterval(()=>{i<t.length?(this.dialogueTextEl.textContent+=t.charAt(i),i++):(clearInterval(this.typewriterInterval),n&&n())},40)}hideDialogue(){this.dialogueBubbleEl.classList.add("hidden"),this.typewriterInterval&&clearInterval(this.typewriterInterval)}fadeScreenOut(e=1e3){return this.screenFadeEl.style.transition=`opacity ${e}ms ease-in-out`,this.screenFadeEl.classList.remove("hidden"),new Promise(t=>setTimeout(t,e))}fadeScreenIn(e=1e3){return this.screenFadeEl.style.transition=`opacity ${e}ms ease-in-out`,this.screenFadeEl.classList.add("hidden"),new Promise(t=>setTimeout(t,e))}}class Zr{static createStoneWallTexture(){const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d");t.fillStyle="#2d2838",t.fillRect(0,0,512,512);const n=8,i=4,s=512/n,a=512/i;for(let l=0;l<n;l++){const c=l%2*(a/2);for(let h=-1;h<i+1;h++){const u=h*a+c,d=l*s,f=Math.floor(40+Math.random()*35);t.fillStyle=`rgb(${f+5}, ${f}, ${f+15})`,t.fillRect(u+2,d+2,a-4,s-4);for(let p=0;p<40;p++){const _=u+Math.random()*a,m=d+Math.random()*s,g=.05+Math.random()*.1;t.fillStyle=Math.random()>.5?`rgba(255,255,255,${g})`:`rgba(0,0,0,${g})`,t.fillRect(_,m,3,3)}t.strokeStyle="#120f18",t.lineWidth=4,t.strokeRect(u,d,a,s)}}const o=new Jn(e);return o.wrapS=Jt,o.wrapT=Jt,o}static createAncientRuinedFlagstonesTexture(){const e=document.createElement("canvas");e.width=1024,e.height=1024;const t=e.getContext("2d");t.fillStyle="#14151a",t.fillRect(0,0,1024,1024);const n=4,i=6,s=1024/n,a=1024/i,o=["#2a2c34","#32343e","#26272e","#363844","#2d2f38","#383a46","#222329","#30323c"];for(let c=0;c<i;c++){const h=c%2*(s*.45);for(let u=-1;u<n+1;u++){const d=u*s+h,f=c*a,p=o[Math.abs(c*3+u*7)%o.length];t.fillStyle=p;const _=6,m=s-_*2,g=a-_*2,S=d+_,M=f+_;t.beginPath(),t.roundRect(S,M,m,g,[6,12,8,10]),t.fill();for(let v=0;v<80;v++){const w=S+Math.random()*m,E=M+Math.random()*g,T=.04+Math.random()*.08;t.fillStyle=Math.random()>.4?`rgba(255,255,255,${T})`:`rgba(0,0,0,${T*1.5})`,t.fillRect(w,E,3,3)}(c+u)%3===0&&(t.strokeStyle="rgba(12, 12, 16, 0.7)",t.lineWidth=2,t.beginPath(),t.moveTo(S+m*.2,M+g*.1),t.lineTo(S+m*.45,M+g*.5),t.lineTo(S+m*.8,M+g*.75),t.stroke()),(c*2+u)%4===0&&(t.fillStyle="rgba(40, 75, 45, 0.45)",t.beginPath(),t.arc(S+8,M+8,14+Math.random()*10,0,Math.PI*2),t.fill())}}const l=new Jn(e);return l.wrapS=Jt,l.wrapT=Jt,l}static createCastleFloorNormalMap(){const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d");t.fillStyle="rgb(128, 128, 255)",t.fillRect(0,0,512,512);const n=4,i=6,s=512/n,a=512/i;for(let l=0;l<i;l++){const c=l%2*(s*.45);for(let h=-1;h<n+1;h++){const u=h*s+c,d=l*a;t.fillStyle="rgb(128, 200, 255)",t.fillRect(u+4,d,s-8,4),t.fillStyle="rgb(200, 128, 255)",t.fillRect(u,d+4,4,a-8),t.fillStyle="rgb(128, 50, 255)",t.fillRect(u+4,d+a-4,s-8,4),t.fillStyle="rgb(50, 128, 255)",t.fillRect(u+s-4,d+4,4,a-8)}}const o=new Jn(e);return o.wrapS=Jt,o.wrapT=Jt,o}static createWoodTexture(){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#4a2e1b",t.fillRect(0,0,256,256),t.strokeStyle="rgba(30, 15, 5, 0.4)",t.lineWidth=2;for(let i=0;i<256;i+=6)t.beginPath(),t.moveTo(0,i+Math.sin(i*.1)*4),t.lineTo(256,i+Math.cos(i*.1)*4),t.stroke();return new Jn(e)}static createCarpetTexture(){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#6e1b24",t.fillRect(0,0,256,256),t.strokeStyle="#f3c644",t.lineWidth=12,t.strokeRect(6,6,244,244),t.strokeStyle="#996e00",t.lineWidth=4,t.strokeRect(16,16,224,224);const n=new Jn(e);return n.wrapS=Jt,n.wrapT=Jt,n}static createStainedGlassTexture(){const e=document.createElement("canvas");e.width=256,e.height=512;const t=e.getContext("2d");t.fillStyle="#0a0815",t.fillRect(0,0,256,512);const n=["#9d4edd","#3df3ff","#f3c644","#ff2244","#22cc44"];for(let s=50;s<450;s+=50)for(let a=30;a<220;a+=45)t.fillStyle=n[Math.floor(Math.random()*n.length)],t.fillRect(a,s,40,45);return t.strokeStyle="#111",t.lineWidth=6,t.strokeRect(20,40,216,432),new Jn(e)}static createPortraitTexture(e){const t=document.createElement("canvas");t.width=256,t.height=320;const n=t.getContext("2d");return n.fillStyle="#d4a017",n.fillRect(0,0,256,320),n.fillStyle="#4a3000",n.fillRect(16,16,224,288),n.fillStyle="#221a2e",n.fillRect(24,24,208,272),n.fillStyle="#dcd6e8",n.font="bold 20px Cinzel, serif",n.textAlign="center",n.fillText("🧙‍♂️",128,140),n.font="bold 14px Cinzel, serif",n.fillStyle="#f3c644",n.fillText(e,128,220),new Jn(t)}}class Jr{constructor(e,t,n,i){A(this,"boundingBox");A(this,"id");A(this,"isTriggered",!1);A(this,"onTrigger");A(this,"debugMesh",null);this.id=e,this.boundingBox=new rn(t,n),this.onTrigger=i}check(e){return this.isTriggered?!1:this.boundingBox.containsPoint(e)?(this.isTriggered=!0,console.log(`[TriggerZone] Triggered zone '${this.id}'`),this.onTrigger(),!0):!1}createDebugMesh(e){const t=new b,n=new b;this.boundingBox.getSize(t),this.boundingBox.getCenter(n);const i=new Ge(t.x,t.y,t.z),s=new bt({color:16776960,wireframe:!0,transparent:!0,opacity:.5});this.debugMesh=new j(i,s),this.debugMesh.position.copy(n),e.add(this.debugMesh)}}class ly{constructor(e){A(this,"staffInChest",null);A(this,"bobAnimId",null);A(this,"deps");this.deps=e}async run(){const{scene:e,player:t,chestPosition:n,hud:i,onComplete:s}=this.deps;if(t.isMovementLocked=!0,t.velocity.set(0,0,0),t.animationController.playState("Idle"),console.log("[ChestCinematic] CHEST_OPEN"),this.staffInChest)this.staffInChest.visible=!0,console.log("[ChestCinematic] STAFF_VISIBLE — showing existing chest prop");else{console.log("[ChestCinematic] STAFF_VISIBLE — loading baculo.glb?v=7");try{const l=await new dr().loadAsync("/magic-academy-3d/assets/characters/baculo.glb?v=7");this.staffInChest=l.scene,this.staffInChest.name="chest_staff_prop",this.staffInChest.position.set(n.x,n.y+.3,n.z),e.add(this.staffInChest);const c=new rn().setFromObject(this.staffInChest),h=new b;c.getSize(h);const u=Math.max(h.x,h.y,h.z);console.log("[ChestCinematic] baculo.glb native: "+h.x.toFixed(3)+"w x "+h.y.toFixed(3)+"h x "+h.z.toFixed(3)+"d (largest: "+u.toFixed(3)+")");const d=.32,f=u>.001?d/u:.1;this.staffInChest.scale.setScalar(f),console.log("[ChestCinematic] Scale factor: "+f.toFixed(4)+" (target "+d+"m)");const p=n.y+.3;this.staffInChest.position.set(n.x,p,n.z),this.staffInChest.rotation.set(0,Math.PI*.25,Math.PI*.5),console.log("[ChestCinematic] Staff world pos: ("+n.x.toFixed(2)+", "+p.toFixed(2)+", "+n.z.toFixed(2)+")")}catch(o){console.warn("[ChestCinematic] baculo.glb load failed:",o)}}if(this.staffInChest){const o=this.staffInChest,l=o.position.y,c=Date.now(),h=()=>{if(!o.parent)return;const u=(Date.now()-c)/1e3;o.position.y=l+Math.sin(u*2.5)*.035,o.rotation.y=u*1,this.bobAnimId=requestAnimationFrame(h)};this.bobAnimId=requestAnimationFrame(h)}await this.wait(1e3),console.log("[ChestCinematic] PLAYER_TAKES_STAFF"),this.staffInChest&&(this.staffInChest.visible=!1,this.bobAnimId!==null&&(cancelAnimationFrame(this.bobAnimId),this.bobAnimId=null)),await this.playTakeItemAndWait(t)||await this.wait(600),console.log("[ChestCinematic] FADE_OUT — animation complete"),this.staffInChest&&(e.remove(this.staffInChest),this.staffInChest=null),await i.fadeScreenOut(700),console.log("[ChestCinematic] EQUIP_STAFF — screen black"),t.hasStaff=!0,t.setStaffVisibility(!0),t.animationController.setArmed(!0),i.setObjective("Usa Force Blast en el objetivo sobre la puerta"),await this.wait(400),console.log("[ChestCinematic] FADE_IN — player armed and ready"),t.isMovementLocked=!1,await i.fadeScreenIn(700),console.log("[ChestCinematic] GAMEPLAY_WITH_STAFF — done"),s()}playTakeItemAndWait(e){return new Promise(t=>{const n=e.animationController,i=n.mixer,s=n.allActions,a=i&&s?s.get("TakeItem"):void 0;if(!i||!a){const c=s?Array.from(s.keys()).join(", "):"no map";console.warn("[ChestCinematic] TakeItem not in allActions. Available: ["+c+"]"),t(!1);return}console.log("[ChestCinematic] TakeItem found, duration="+a.getClip().duration.toFixed(2)+"s"),n.isPlayingOneShot=!0;const o=n.currentAction;o&&o!==a&&o.fadeOut(.15),a.reset().setLoop(ha,1).setEffectiveWeight(1).fadeIn(.15).play(),a.clampWhenFinished=!0,n.currentAction=a;const l=c=>{c.action===a&&(i.removeEventListener("finished",l),n.isPlayingOneShot=!1,console.log("[ChestCinematic] TakeItem finished (mixer event)"),t(!0))};i.addEventListener("finished",l)})}wait(e){return new Promise(t=>setTimeout(t,e))}}class cy{constructor(e,t=0){A(this,"mesh");A(this,"mixer");A(this,"waveAction");A(this,"talkAction");A(this,"isTalking",!1);this.mesh=new lt,this.mesh.position.copy(e),this.mesh.rotation.y=t}async loadModels(){const e=new dr;try{const t=await e.loadAsync("/magic-academy-3d/assets/characters/gekko_wave.glb"),n=t.scene;n.traverse(s=>{if(s.isMesh){s.castShadow=!0,s.receiveShadow=!0;const a=s.material;if(a){const o=l=>{l.transparent=!1,l.depthWrite=!0,l.alphaTest=.5,l.needsUpdate=!0};Array.isArray(a)?a.forEach(o):o(a)}}}),n.scale.set(.25,.25,.25),this.mesh.add(n),this.mixer=new Yl(n),t.animations&&t.animations.length>0&&(this.waveAction=this.mixer.clipAction(t.animations[0]),this.waveAction.play());const i=await e.loadAsync("/magic-academy-3d/assets/characters/gekko_talks.glb");i.animations&&i.animations.length>0&&(this.talkAction=this.mixer.clipAction(i.animations[0]))}catch(t){console.warn("Failed to load Gekko models (gekko_wave.glb / gekko_talks.glb). Please ensure files exist in public/assets/characters/.",t);const n=new Et(.5,.5,2),i=new Xe({color:65280}),s=new j(n,i);s.position.y=1,this.mesh.add(s)}}setTalking(e){if(this.isTalking!==e&&(this.isTalking=e,this.mixer)){if(e&&this.talkAction){this.waveAction&&this.waveAction.crossFadeTo(this.talkAction,.5,!0),this.talkAction.reset().play();const t=this.mesh.children[0];t&&(t.rotation.y=-Math.PI/2)}else if(!e&&this.waveAction){this.talkAction&&this.talkAction.crossFadeTo(this.waveAction,.5,!0),this.waveAction.reset().play();const t=this.mesh.children[0];t&&(t.rotation.y=0)}}}update(e){this.mixer&&this.mixer.update(e)}}class hy{constructor(e,t,n=2,i=2.5,s=2.5){A(this,"mesh");A(this,"velocity",new b);A(this,"startPos");A(this,"endPos");A(this,"speed");A(this,"progress",0);A(this,"direction",1);this.startPos=e.clone(),this.endPos=t.clone(),this.speed=n;const a=new Ge(i,.4,s),o=new Xe({color:5918840,roughness:.5,metalness:.2});this.mesh=new j(a,o),this.mesh.position.copy(e),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0;const l=new Ge(i*.9,.05,s*.9),c=new bt({color:4060159}),h=new j(l,c);h.position.y=.21,this.mesh.add(h)}update(e){const t=this.startPos.distanceTo(this.endPos);if(t<.01)return;this.progress+=this.speed*e/t*this.direction,this.progress>=1?(this.progress=1,this.direction=-1):this.progress<=0&&(this.progress=0,this.direction=1);const n=this.mesh.position.clone();this.mesh.position.lerpVectors(this.startPos,this.endPos,this.progress),this.velocity.subVectors(this.mesh.position,n)}}class an{static precompileShaders(e,t,n){const i=new Xe({color:16724736,emissive:16755200,emissiveIntensity:1.2,metalness:.85,roughness:.2}),s=new j(this.ringGeo,i);s.position.set(0,-999,0);const a=new sn(16755200,4,6);s.add(a),t.add(s),e.compile(t,n),t.remove(s),i.dispose()}static async runSequence(e,t,n,i,s){if(this.isSequenceRunning){console.warn(`[KEY] Sequence already running, skipping duplicate call for '${e.id}'`);return}this.isSequenceRunning=!0,console.log(`[KEY] KeyPickupSequence started for '${e.id}' (${e.name}) at`,t),n.isControlsLocked=!0,n.isMovementLocked=!0,n.velocity.set(0,0,0);const a=new lt;a.name=`cinematic_key_${e.id}`,a.position.copy(t);const o=new Xe({color:e.color,emissive:e.emissiveColor,emissiveIntensity:1.2,metalness:.85,roughness:.2}),l=new j(this.ringGeo,o);l.rotation.x=Math.PI/2;const c=new j(this.shaftGeo,o);c.position.y=-.32;const h=new j(this.tooth1Geo,o);h.position.set(.1,-.5,0);const u=new j(this.tooth2Geo,o);u.position.set(.08,-.38,0),a.add(l,c,h,u);const d=new sn(e.emissiveColor,4,6);d.position.set(0,0,0),a.add(d);const f=12,p=[];for(let T=0;T<f;T++){const x=new bt({color:e.color,transparent:!0,opacity:.9}),R=new j(this.particleGeo,x),L=T/f*Math.PI*2;R.position.set(Math.cos(L)*.35,(Math.random()-.5)*.4,Math.sin(L)*.35),a.add(R),p.push(R)}i.add(a),console.log("[KEY] Flying to player...");const _=1.3;let m=0;this.TEMP_START.copy(t),await new Promise(T=>{let x=performance.now();const R=L=>{const I=Math.min(.05,(L-x)/1e3);x=L,m+=I;const F=Math.min(1,m/_),B=F<.5?4*F*F*F:1-Math.pow(-2*F+2,3)/2;this.TEMP_TARGET.copy(n.mesh.position).add(new b(0,1.2,0));const K=Math.max(this.TEMP_START.y,this.TEMP_TARGET.y)+1.2;this.TEMP_CURR.x=mt.lerp(this.TEMP_START.x,this.TEMP_TARGET.x,B),this.TEMP_CURR.z=mt.lerp(this.TEMP_START.z,this.TEMP_TARGET.z,B),this.TEMP_CURR.y=(1-B)*(1-B)*this.TEMP_START.y+2*(1-B)*B*K+B*B*this.TEMP_TARGET.y,a.position.copy(this.TEMP_CURR),a.rotation.y+=.08,p.forEach((O,q)=>{O.rotation.x+=.1,O.rotation.y+=.1,O.position.y+=Math.sin(m*8+q)*.005}),F<1?requestAnimationFrame(R):T()};requestAnimationFrame(R)}),console.log(`[KEY] Attached to hand '${e.id}'`),i.remove(a);const g=ku.findHandNode(n);g.add(a),a.position.set(0,.18,.08),a.rotation.set(0,Math.PI/2,Math.PI/4),a.scale.setScalar(7.6);const S=new bt({color:e.color,transparent:!0,opacity:1,side:Qt,depthWrite:!1}),M=new j(this.burstRingGeo,S);M.position.copy(n.mesh.position).add(new b(0,1.2,0)),M.rotation.x=-Math.PI/2,i.add(M);const v=new sn(e.emissiveColor,6,7);v.position.set(0,.3,.3),a.add(v),n.animationController.playTakeItemAnimation(()=>{});let w=0;const E=1.7;await new Promise(T=>{let x=performance.now();const R=L=>{const I=Math.min(.05,(L-x)/1e3);x=L,w+=I;const F=Math.min(1,w/E);M.scale.setScalar(1+F*8),S.opacity=Math.max(0,1-F*2.5),a.rotation.z+=.04,v.intensity=(5+Math.sin(w*10)*2)*(1-Math.max(0,(F-.7)/.3)),p.forEach(B=>{B.material.opacity=Math.max(0,1-F*1.3)}),F<1?requestAnimationFrame(R):(i.remove(M),S.dispose(),g.remove(a),o.dispose(),p.forEach(B=>B.material.dispose()),T())};requestAnimationFrame(R)}),e.obtained=!0,console.log(`[KEY] Added to inventory: '${e.id}'`),n.isControlsLocked=!1,n.isMovementLocked=!1,this.isSequenceRunning=!1,console.log(`[KEY] KeyPickupSequence completed for '${e.id}'`),s&&s()}}A(an,"isSequenceRunning",!1),A(an,"TEMP_START",new b),A(an,"TEMP_TARGET",new b),A(an,"TEMP_CURR",new b),A(an,"ringGeo",new ai(.24,.07,12,24)),A(an,"shaftGeo",new Et(.05,.05,.6,12)),A(an,"tooth1Geo",new Ge(.16,.1,.05)),A(an,"tooth2Geo",new Ge(.12,.08,.05)),A(an,"particleGeo",new or(.035,0)),A(an,"burstRingGeo",new cr(.1,.6,24));class uy{constructor(e,t,n,i,s,a,o,l,c){A(this,"sceneManager");A(this,"cameraController");A(this,"player");A(this,"inputManager");A(this,"spellSystem");A(this,"checkpointManager");A(this,"collectibleSystem");A(this,"subtitleSystem");A(this,"audioManager");A(this,"levelColliders",[]);A(this,"triggerZones",[]);A(this,"doors",[]);A(this,"pots",[]);A(this,"chests",[]);A(this,"enemies",[]);A(this,"gargoyles",[]);A(this,"movingPlatforms",[]);A(this,"collectedKeys",{key1_gekko:!1,key2_boss:!1,key3_platform:!1,key4_gargoyles:!1,key5_pots:!1});A(this,"totalKeysCount",0);A(this,"staffChest");A(this,"exitDoor");A(this,"gekkoNPC");A(this,"floatingCoinMesh");A(this,"grassUniforms",null);A(this,"cloudsUniforms",null);A(this,"gekkoMissionState","NOT_STARTED");A(this,"isCinematicPlaying",!1);A(this,"coinsExchanged",!1);A(this,"litGargoylesCount",0);A(this,"specialPotsSmashed",0);A(this,"totalSpecialPots",5);A(this,"keyDefinitions",{key1_gekko:{id:"key1_gekko",name:"Llave de la Riqueza (Gekko)",color:65416,emissiveColor:52326,obtained:!1},key2_boss:{id:"key2_boss",name:"Llave de Combate (Jefe Cangrejo)",color:16720384,emissiveColor:16729088,obtained:!1},key3_platform:{id:"key3_platform",name:"Llave de Plataformas (Tejado)",color:58879,emissiveColor:49151,obtained:!1},key4_gargoyles:{id:"key4_gargoyles",name:"Llave del Secreto (Gárgolas)",color:11032055,emissiveColor:9647082,obtained:!1},key5_pots:{id:"key5_pots",name:"Llave de Destrucción (Gemas)",color:16753920,emissiveColor:16746496,obtained:!1}});A(this,"keysMeshes",[]);A(this,"bossEnemy");A(this,"stateFlags",{introCompleted:!1,staffFound:!1,gekkoTalked:!1,bossCinematicPlayed:!1,levelCompleted:!1});this.sceneManager=e,this.cameraController=t,this.player=n,this.inputManager=i,this.spellSystem=s,this.checkpointManager=a,this.collectibleSystem=o,this.subtitleSystem=l,this.audioManager=c}init(){this.buildToyStoryLevelGeometry(),this.setupCheckpoints(),this.setupInteractiveProps(),this.setupCollectibles(),this.setupEnemies(),this.setupNPCs(),this.setupTriggers();const e=this.sceneManager.scene;e.background=new _e(132631),e.fog=new Sa(132631,.007);const t=new Wl(1976635,.5),n=new lp(1976635,132631,.4),i=new ir(11850750,1.2);i.position.set(40,80,-60),i.castShadow=!0,i.shadow.mapSize.width=2048,i.shadow.mapSize.height=2048,i.shadow.camera.near=.5,i.shadow.camera.far=200;const s=60;i.shadow.camera.left=-s,i.shadow.camera.right=s,i.shadow.camera.top=s,i.shadow.camera.bottom=-s,i.shadow.bias=-3e-4;const a=new sn(16753988,2.5,18);a.position.set(0,3,-25.5),e.add(a);const o=new sn(16753988,2.5,18);o.position.set(-6,3,-25.5),e.add(o);const l=new ir(3718648,1.2);l.position.set(-30,20,-80),e.add(t,n,i,l);const c=new Yt(6,24,24),h=new bt({color:16777215}),u=new j(c,h);u.position.set(40,80,-60);const d=new Yt(7.5,16,16),f=new bt({color:9684477,transparent:!0,opacity:.35,blending:Xs,side:en}),p=new j(d,f);u.add(p),e.add(u);const _=new Yt(140,32,24),m=new Pn({uniforms:{uTime:{value:0},uSkyColor:{value:new _e(132631)},uCloudColor:{value:new _e(1976635)},uMoonColor:{value:new _e(9684477)},uMoonPos:{value:new b(40,80,-60)}},vertexShader:`
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uSkyColor;
        uniform vec3 uCloudColor;
        uniform vec3 uMoonColor;
        uniform vec3 uMoonPos;

        varying vec3 vWorldPosition;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          if (dir.y < -0.05) discard;

          vec2 uv1 = dir.xz * 2.5 + vec2(uTime * 0.012, uTime * 0.008);
          float n1 = fbm(uv1);

          vec2 uv2 = dir.xz * 4.5 + vec2(-uTime * 0.02, uTime * 0.015);
          float n2 = fbm(uv2);

          float cloudDensity = smoothstep(0.45, 0.75, n1 * 0.65 + n2 * 0.35);
          
          float horizonFade = smoothstep(-0.02, 0.3, dir.y);
          cloudDensity *= horizonFade;

          vec3 moonDir = normalize(uMoonPos);
          float moonRim = max(0.0, dot(dir, moonDir));
          float moonGlow = pow(moonRim, 6.0) * cloudDensity * 0.8;

          vec3 finalColor = mix(uSkyColor, uCloudColor, cloudDensity * 0.65);
          finalColor += uMoonColor * moonGlow;

          gl_FragColor = vec4(finalColor, cloudDensity * 0.55 * horizonFade);
        }
      `,side:en,transparent:!0,depthWrite:!1}),g=new j(_,m);e.add(g),this.cloudsUniforms=m.uniforms;const S=450,M=new gt,v=new Float32Array(S*3),w=new Float32Array(S*3);for(let x=0;x<S;x++){const R=Math.random(),L=Math.random(),I=R*2*Math.PI,F=Math.acos(2*L-1),B=125+Math.random()*15,K=B*Math.sin(F)*Math.cos(I),O=Math.abs(B*Math.sin(F)*Math.sin(I))+10,q=B*Math.cos(F);v[x*3]=K,v[x*3+1]=O,v[x*3+2]=q;const V=.5+Math.random()*.5;w[x*3]=V,w[x*3+1]=V,w[x*3+2]=V}M.setAttribute("position",new ot(v,3)),M.setAttribute("color",new ot(w,3));const E=new bi({size:1.2,vertexColors:!0,transparent:!0,opacity:.9,sizeAttenuation:!0}),T=new Oi(M,E);e.add(T),this.spawnKeysInWorld(),an.precompileShaders(this.sceneManager.renderer,e,this.sceneManager.camera),this.checkpointManager.respawnPlayer(this.player)}buildToyStoryLevelGeometry(){const e=this.sceneManager.scene,t=Zr.createStoneWallTexture();t.repeat.set(4,4);const n=Zr.createAncientRuinedFlagstonesTexture();n.repeat.set(6,6);const i=Zr.createCastleFloorNormalMap();i.repeat.set(6,6);const s=new Xe({map:t,roughness:.65,bumpScale:.04}),a=new Xe({map:n,normalMap:i,normalScale:new Ve(.85,.85),roughness:.78,metalness:.12}),o=new Xe({color:2246949,roughness:.95}),l=new Xe({color:12759680,roughness:.85}),c=new j(new Ge(160,1,160),o);c.position.set(0,-.5,-40),c.receiveShadow=!0,e.add(c),this.levelColliders.push(c),(()=>{const ne=D=>{const Z=new Float32Array(42),le=new Float32Array(14*2),he=new Float32Array(14*3);for(let Ke=0;Ke<=6;Ke++){const Be=Ke/6,Ut=Be*1.4,fr=.2*(1-Be*.85),Ln=Ke*2,Mn=Ke*2+1;Z[Ln*3+0]=-fr,Z[Ln*3+1]=Ut,Z[Ln*3+2]=0,le[Ln*2+0]=0,le[Ln*2+1]=Be,he[Ln*3+0]=0,he[Ln*3+1]=0,he[Ln*3+2]=1,Z[Mn*3+0]=fr,Z[Mn*3+1]=Ut,Z[Mn*3+2]=0,le[Mn*2+0]=1,le[Mn*2+1]=Be,he[Mn*3+0]=0,he[Mn*3+1]=0,he[Mn*3+2]=1}const ee=6*6,xe=new Uint16Array(ee);for(let Ke=0;Ke<6;Ke++){const Be=Ke*6,Ut=Ke*2;xe[Be+0]=Ut,xe[Be+1]=Ut+1,xe[Be+2]=Ut+2,xe[Be+3]=Ut+1,xe[Be+4]=Ut+3,xe[Be+5]=Ut+2}const fe=new gt;return fe.setAttribute("position",new ot(Z,3)),fe.setAttribute("uv",new ot(le,2)),fe.setAttribute("normal",new ot(he,3)),fe.setIndex(new ot(xe,1)),fe.applyMatrix4(new Se().makeRotationY(D)),fe},Me=ne(0),Ee=ne(Math.PI/3),be=ne(-Math.PI/3),Je=Me.attributes.position.count*3,Ie=new Float32Array(Je*3),Ye=new Float32Array(Je*2),Ue=new Float32Array(Je*3),Oe=Me.attributes.position.count,nt=Me.attributes.position.array,ut=Ee.attributes.position.array,vt=be.attributes.position.array;Ie.set(nt,0),Ie.set(ut,nt.length),Ie.set(vt,nt.length+ut.length);const Tt=Me.attributes.uv.array,yt=Ee.attributes.uv.array,Rt=be.attributes.uv.array;Ye.set(Tt,0),Ye.set(yt,Tt.length),Ye.set(Rt,Tt.length+yt.length);const N=Me.attributes.normal.array,Wt=Ee.attributes.normal.array,ct=be.attributes.normal.array;Ue.set(N,0),Ue.set(Wt,N.length),Ue.set(ct,N.length+Wt.length);const P=Me.index.array,y=Ee.index.array,k=be.index.array,H=P.length+y.length+k.length,Y=new Uint32Array(H);Y.set(P,0);for(let D=0;D<y.length;D++)Y[P.length+D]=y[D]+Oe;for(let D=0;D<k.length;D++)Y[P.length+y.length+D]=k[D]+Oe*2;const ae=new gt;ae.setAttribute("position",new ot(Ie,3)),ae.setAttribute("uv",new ot(Ye,2)),ae.setAttribute("normal",new ot(Ue,3)),ae.setIndex(new ot(Y,1)),Me.dispose(),Ee.dispose(),be.dispose();const ce=new Xe({color:5424730,roughness:.8,metalness:0,side:Qt,alphaTest:.04});ce.customProgramCacheKey=()=>"grass_botw_aaa_v5",ce.onBeforeCompile=D=>{D.uniforms.uTime={value:0},D.uniforms.uPlayerPos={value:new b(999,999,999)},this.grassUniforms=D.uniforms,D.vertexShader=["uniform float uTime;","uniform vec3  uPlayerPos;",D.vertexShader].join(`
`),D.vertexShader=D.vertexShader.replace("#include <begin_vertex>",`
          #include <begin_vertex>

          #ifdef USE_INSTANCING
            vec3 wpos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 wpos = vec3(0.0);
          #endif

          // Normalized height: 0 = root, 1 = tip
          float nH = clamp(position.y / ${1.4.toFixed(2)}, 0.0, 1.0);
          float bend = nH * nH * nH;

          float drift = sin(uTime * 1.4 + wpos.x * 0.09 + wpos.z * 0.07) * 0.25;

          float n1 = sin(wpos.x * 0.19 + wpos.z * 0.14 + uTime * 2.2) * 0.14;
          float n2 = cos(wpos.x * 0.09 - wpos.z * 0.25 + uTime * 1.1) * 0.09;
          float fbm = n1 + n2;

          float windDot = wpos.x * 0.62 + wpos.z * 0.45;
          float gust    = sin(uTime * 1.8 + windDot * 0.11) * 0.30 * (0.5 + 0.5 * sin(uTime * 0.3 + wpos.x * 0.01));

          float totalX = (drift + fbm + gust) * bend;
          float totalZ = (drift * 0.5 + fbm * 0.6 + gust * 0.5) * bend;

          transformed.x += totalX * 0.75 + totalZ * 0.25;
          transformed.z += totalX * 0.30 + totalZ * 0.70;

          // Player push
          vec2 toPlayer2 = wpos.xz - uPlayerPos.xz;
          float pDist = length(toPlayer2);
          float pRadius = 2.0;
          if (pDist < pRadius && pDist > 0.001) {
            float pushStr = (1.0 - pDist / pRadius) * 0.95 * bend;
            vec2 pDir = toPlayer2 / pDist;
            transformed.x += pDir.x * pushStr;
            transformed.z += pDir.y * pushStr;
          }
          `),D.fragmentShader=D.fragmentShader.replace("#include <color_fragment>",`
          #include <color_fragment>
          // Height gradient: dark roots → vivid mid → warm golden tips
          float vH = vUv.y;
          // Base color is the diffuseColor from instanceColor
          // Darken roots slightly for ground-contact shading (AO)
          float rootDark  = 1.0 - smoothstep(0.0, 0.18, vH) * 0.35;
          // Warm up tips to golden/yellow-green
          float tipWarm   = smoothstep(0.65, 1.0, vH);
          diffuseColor.rgb *= rootDark;
          diffuseColor.rgb += vec3(tipWarm * 0.12, tipWarm * 0.09, -tipWarm * 0.04);
          // Fake SSS: bright fringe when backlit (simulate light through thin blade)
          float sss = smoothstep(0.4, 1.0, vH) * 0.08;
          diffuseColor.rgb += vec3(sss * 0.5, sss * 0.9, sss * 0.1);
          `)};const J=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?12e3:8e4,oe=new ra(ae,ce,J);oe.frustumCulled=!1,oe.castShadow=!1,oe.receiveShadow=!0;const Ae=new ht;let de=98765;const ie=()=>(de=(de*16807+0)%2147483647,(de-1)/2147483646);let Ce=0;const Ne=J*4;let ze=0;for(;Ce<J&&ze<Ne;){ze++;const D=(ie()-.5)*155,se=-110+ie()*145;if(D>-14&&D<14&&se>-55&&se<-20||Math.hypot(D-40,se+45)<17||Math.hypot(D+30,se-10)<8||Math.hypot(D+45,se+40)<8||D>-17&&D<17&&se>-58&&se<-17||Math.sin(D*.38)*Math.cos(se*.29)+Math.sin(D*.17+se*.22)*.6<-.5&&ie()>.15||Math.hypot(D,se+35)>65&&ie()>.55)continue;Ae.position.set(D+(ie()-.5)*.6,.01,se+(ie()-.5)*.6),Ae.rotation.set((ie()-.5)*.12,ie()*Math.PI*2,(ie()-.5)*.12);const he=.45+ie()*1.15,ee=.55+ie()*.75;Ae.scale.set(ee,he,ee),Ae.updateMatrix(),oe.setMatrixAt(Ce,Ae.matrix);const xe=ie();let fe,Ke,Be;xe<.18?(fe=.3,Ke=.8,Be=.36+ie()*.08):xe<.34?(fe=.35,Ke=.65,Be=.24+ie()*.08):xe<.5?(fe=.27,Ke=.72,Be=.4+ie()*.1):xe<.63?(fe=.23,Ke=.58,Be=.38+ie()*.08):xe<.75?(fe=.25,Ke=.85,Be=.44+ie()*.1):xe<.88?(fe=.18,Ke=.65,Be=.46+ie()*.1):(fe=.32,Ke=.5,Be=.3+ie()*.06),oe.setColorAt(Ce,new _e().setHSL(fe,Ke,Be)),Ce++}oe.instanceMatrix.needsUpdate=!0,oe.instanceColor&&(oe.instanceColor.needsUpdate=!0),e.add(oe),console.log(`[Grass AAA] ✅ ${Ce}/${J} blades placed in ${ze} tries`)})(),(()=>{const X=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?800:2500,re=new xs(.07,0),ne=new Xe({roughness:.6,metalness:.1}),Me=new ra(re,ne,X);Me.frustumCulled=!1;const Ee=new ht;let be=12345;const Je=()=>(be=(be*16807+0)%2147483647,(be-1)/2147483646),Ie=[16777215,16777215,16771584,16771584,11032055,16020150,3718648];let Ye=0;for(let Ue=0;Ue<X*3&&Ye<X;Ue++){const Oe=(Je()-.5)*150,nt=-110+Je()*140;if(Oe>-16&&Oe<16&&nt>-58&&nt<-17||Math.hypot(Oe-40,nt+45)<17)continue;Ee.position.set(Oe,.35,nt),Ee.rotation.set((Je()-.5)*.2,Je()*Math.PI*2,(Je()-.5)*.2),Ee.scale.setScalar(.7+Je()*.8),Ee.updateMatrix(),Me.setMatrixAt(Ye,Ee.matrix);const ut=Ie[Math.floor(Je()*Ie.length)];Me.setColorAt(Ye,new _e(ut)),Ye++}Me.instanceMatrix.needsUpdate=!0,Me.instanceColor&&(Me.instanceColor.needsUpdate=!0),e.add(Me)})(),(()=>{const X=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?120:350,re=new xs(.7,1),ne=re.attributes.position;for(let Ue=0;Ue<ne.count;Ue++){const Oe=ne.getX(Ue),nt=ne.getY(Ue),ut=ne.getZ(Ue),vt=(Math.sin(Oe*4)+Math.cos(nt*4)+Math.sin(ut*4))*.08;ne.setXYZ(Ue,Oe+vt,nt+vt*.5,ut+vt)}re.computeVertexNormals();const Me=new Xe({color:4738116,roughness:.9,metalness:.05}),Ee=new ra(re,Me,X);Ee.castShadow=!0,Ee.receiveShadow=!0;const be=new ht;let Je=54321;const Ie=()=>(Je=(Je*16807+0)%2147483647,(Je-1)/2147483646);let Ye=0;for(let Ue=0;Ue<X*4&&Ye<X;Ue++){const Oe=(Ie()-.5)*152,nt=-110+Ie()*142;if(Oe>-15&&Oe<15&&nt>-56&&nt<-18||Math.hypot(Oe-40,nt+45)<16)continue;const ut=.35+Ie()*1.1,vt=.5+Ie()*1.5;be.position.set(Oe,ut*.35,nt),be.rotation.set(Ie()*.3,Ie()*Math.PI*2,Ie()*.3),be.scale.set(vt,ut,vt),be.updateMatrix(),Ee.setMatrixAt(Ye,be.matrix);const Tt=.22+Ie()*.15,yt=Ie()>.4?.05:0;Ee.setColorAt(Ye,new _e(Tt,Tt+yt,Tt-.02)),Ye++}Ee.instanceMatrix.needsUpdate=!0,Ee.instanceColor&&(Ee.instanceColor.needsUpdate=!0),e.add(Ee)})();const h=-40,u=new j(new Ge(26,.4,26),a);u.position.set(0,.1,h),u.receiveShadow=!0,e.add(u),this.levelColliders.push(u);const d=5,f=new j(new Ge(.6,d,26),s);f.position.set(-13,d/2,h);const p=new j(new Ge(.6,d,26),s);p.position.set(13,d/2,h);const _=new j(new Ge(26,d,.6),s);_.position.set(0,d/2,h-13),e.add(f,p,_),this.levelColliders.push(f,p,_);const m=new j(new Ge(2,d,2),s);m.position.set(-6,d/2,h+13);const g=new j(new Ge(2,d,2),s);g.position.set(6,d/2,h+13),e.add(m,g),this.levelColliders.push(m,g);const S=new j(new Ge(26,.4,12),a);S.position.set(0,5,h-7),S.receiveShadow=!0,e.add(S),this.levelColliders.push(S);const M=new j(new Ge(9,.4,14),a);M.position.set(3.5,5,h+6),M.receiveShadow=!0,e.add(M),this.levelColliders.push(M);const v=new j(new Ge(10,3,.6),s);v.position.set(-8,6.5,h-5);const w=new j(new Ge(10,3,.6),s);w.position.set(8,6.5,h-5),e.add(v,w),this.levelColliders.push(v,w);const E=14;for(let Fe=0;Fe<E;Fe++){const X=Fe/(E-1),re=.1+X*4.9,ne=-30-X*14,Me=new j(new Ge(4,.4,1.5),s);Me.position.set(-8,re,ne),Me.castShadow=!0,Me.receiveShadow=!0,e.add(Me)}const T=Math.hypot(14,4.9)+2,x=new j(new Ge(4.2,.35,T),new bt({visible:!1}));x.position.set(-8,2.55,-37),x.rotation.x=Math.atan(4.9/14),e.add(x),this.levelColliders.push(x);const R=new j(new Ge(.4,1.2,26),s);R.position.set(-12.8,5.6,h);const L=new j(new Ge(.4,1.2,26),s);L.position.set(12.8,5.6,h);const I=new j(new Ge(26,1.2,.4),s);I.position.set(0,5.6,h-12.8),e.add(R,L,I),this.levelColliders.push(R,L,I);const F=new Et(6,6,5,12),B=new j(F,s);B.position.set(0,7.5,h-4),B.castShadow=!0,B.receiveShadow=!0,e.add(B),this.levelColliders.push(B);const K=new j(new Et(6.4,6.4,.4,12),a);K.position.set(0,10.2,h-4),e.add(K),this.levelColliders.push(K);const O=3,q=22,V=5,Q=new Xe({map:t,roughness:.85}),te=new j(new Ge(O,.3,q),Q);te.position.set(-15,V/2-.2,h+1),te.rotation.x=Math.atan(V/q),te.castShadow=!0,te.receiveShadow=!0,e.add(te),this.levelColliders.push(te);const ue=new hy(new b(10,.2,h+10),new b(10,5,h+10),1.5,4,4);e.add(ue.mesh),this.movingPlatforms.push(ue),this.levelColliders.push(ue.mesh),[new b(11,5.8,h),new b(8.5,6.7,h+2),new b(6.5,7.6,h+4),new b(3.5,8.5,h+5.5),new b(0,9.2,h+6.5),new b(-3,9.7,h+5.5),new b(-5,10.1,h+3)].forEach(Fe=>{const X=new j(new Ge(2.5,.4,2.5),a);X.position.copy(Fe),X.castShadow=!0,X.receiveShadow=!0,e.add(X),this.levelColliders.push(X)});const ye=new b(45,.1,-40),qe=new j(new Et(15,15,.2,24),l);qe.position.copy(ye),qe.receiveShadow=!0,e.add(qe),this.levelColliders.push(qe);const xt=new Ge(4,1.5,1);for(let Fe=0;Fe<Math.PI*2;Fe+=Math.PI/6){const X=new j(xt,s);X.position.set(ye.x+Math.cos(Fe)*15,ye.y+.6,ye.z+Math.sin(Fe)*15),X.rotation.y=-Fe,e.add(X),this.levelColliders.push(X)}this.exitDoor=new Jv("door_exit",new b(0,0,h-12.5),0,!0),e.add(this.exitDoor.mesh),this.doors.push(this.exitDoor),this.levelColliders.push(this.exitDoor.mesh),this.buildAncientRuinsAndLandmarks(),this.cameraController.setCollisionObjects(this.levelColliders),this.player.setColliders(this.levelColliders)}buildAncientRuinsAndLandmarks(){const e=this.sceneManager.scene,t=Zr.createStoneWallTexture();t.repeat.set(2,2);const n=new Xe({map:t,roughness:.85}),i=new lt;i.position.set(-30,0,10),e.add(i);const s=new j(new Ge(8,3,.8),n);s.position.set(0,1.5,0),i.add(s),this.levelColliders.push(s);const a=new j(new Et(.6,.6,4,8),n);a.position.set(-3,2,3),i.add(a),this.levelColliders.push(a);const o=new j(new Et(.5,.5,3.5,8),n);o.position.set(1,.5,2),o.rotation.set(0,Math.PI/4,Math.PI/2-.1),i.add(o),this.levelColliders.push(o);const l=new lt;l.position.set(-45,0,-40),e.add(l);for(let h=0;h<6;h++){const u=h/6*Math.PI*2,d=Math.cos(u)*5,f=Math.sin(u)*5,p=h%2===0?5:3.5,_=new j(new Et(.5,.5,p,8),n);_.position.set(d,p/2,f),l.add(_),this.levelColliders.push(_)}const c=new j(new Ge(6,.6,1.2),n);c.position.set(Math.cos(.5/6*Math.PI*2)*5,4.8,Math.sin(.5/6*Math.PI*2)*5),c.rotation.y=-.5/6*Math.PI*2,l.add(c),this.levelColliders.push(c)}setupCheckpoints(){this.checkpointManager.addCheckpoint(0,new b(0,.2,10),0),this.checkpointManager.addCheckpoint(1,new b(25,.2,-40),-Math.PI/2),this.checkpointManager.addCheckpoint(2,new b(0,5.2,-40),0)}setupInteractiveProps(){const e=this.sceneManager.scene;this.staffChest=new ny(new b(0,5,-46),Math.PI),e.add(this.staffChest.mesh),this.chests.push(this.staffChest),this.spellSystem.registerChest(this.staffChest),this.levelColliders.push(this.staffChest.mesh),[new b(-10,0,5),new b(-20,0,-50),new b(12,5,-45),new b(45,0,-10),new b(-2,10.2,-44)].forEach(i=>{const s=new ty(i,e),a=s.mesh.children[0].material;a&&(a.color.setHex(10564403),a.emissive.setHex(5574929),a.emissiveIntensity=.6),this.pots.push(s),this.spellSystem.registerPot(s),this.levelColliders.push(s.mesh),s.onDestruct=()=>{this.specialPotsSmashed++,this.audioManager.playPotionPickup(),this.subtitleSystem.show("Sistema",`¡Gema corrupta destruida! (${this.specialPotsSmashed}/${this.totalSpecialPots})`),this.specialPotsSmashed>=this.totalSpecialPots&&this.awardKey("key5_pots",new b(i.x,i.y+.5,i.z))}}),[{pos:new b(-12,0,-25),platforms:[]},{pos:new b(12,0,-48),platforms:[]},{pos:new b(-10,5,-48),platforms:[]},{pos:new b(30,0,-15),platforms:[]}].forEach(i=>{const s=new iy(i.pos,e,i.platforms);this.gargoyles.push(s),this.spellSystem.registerGargoyle(s);const a=s.activateLumos;s.activateLumos=(o,l)=>{s.isLit||(a.call(s,o,l),this.litGargoylesCount++,this.subtitleSystem.show("Sistema",`Gárgola iluminada (${this.litGargoylesCount}/4)`),this.litGargoylesCount>=4&&this.awardKey("key4_gargoyles",new b(0,.5,-35)))}})}setupCollectibles(){const e=[];for(let a=0;a<10;a++)e.push(new b(0,.5,8-a*2));for(let a=-8;a<=8;a+=4)for(let o=-48;o<=-35;o+=4)(a!==0||o!==-40)&&e.push(new b(a,.5,o));for(let a=0;a<6;a++)e.push(new b(-15,.5+a*.8,-29-a*2.2));e.push(new b(-8,5.5,-45)),e.push(new b(-4,5.5,-48)),e.push(new b(4,5.5,-48)),e.push(new b(8,5.5,-45)),e.push(new b(0,5.5,-33)),e.push(new b(2,5.5,-33)),e.push(new b(15,.5,-20)),e.push(new b(20,.5,-25)),e.push(new b(25,.5,-30)),e.push(new b(25,.5,-50)),e.push(new b(20,.5,-55)),e.push(new b(15,.5,-60)),e.push(new b(45,.5,-30)),e.push(new b(35,.5,-40)),e.push(new b(55,.5,-40)),e.push(new b(45,.5,-50)),e.push(new b(40,.5,-45)),e.push(new b(50,.5,-35)),e.push(new b(11,7,-45)),e.push(new b(8,8.5,-52)),e.push(new b(0,9.7,-53)),e.push(new b(0,10.7,-44)),e.push(new b(-4,10.7,-44)),e.push(new b(4,10.7,-44)),e.push(new b(-30,.5,10)),e.push(new b(-27,.5,13)),e.push(new b(-32,.5,7)),e.push(new b(-45,.5,-40)),e.push(new b(-45,.5,-35)),e.push(new b(-40,.5,-40)),e.push(new b(-45,5.2,-40));const t=50,n=e.slice(0,t);for(;n.length<t;)n.push(new b((Math.random()-.5)*50,.5,-20-Math.random()*30));console.log(`[COINS] Initializing spawn sequence for EXACTLY ${n.length}/${t} Lisar Coins.`);let i=0;const s=()=>{if(i>=n.length){console.log(`[COINS] Spawned: ${n.length}/${t}`);return}const a=n[i];this.createSparks(a),this.collectibleSystem.spawnCoin(`coin_${i}`,a),this.audioManager.playCoinSpawnHarmonic(i),i++,setTimeout(s,40)};s()}setupNPCs(){this.gekkoNPC=new cy(new b(-4,0,-10),-Math.PI*.25),this.gekkoNPC.loadModels(),this.sceneManager.scene.add(this.gekkoNPC.mesh);const e=new j(new Et(.6,.6,2),new bt({visible:!1}));e.position.copy(this.gekkoNPC.mesh.position),this.sceneManager.scene.add(e),this.levelColliders.push(e),this.floatingCoinMesh=new lt,this.floatingCoinMesh.position.set(-4,1.4,-10),this.floatingCoinMesh.scale.set(.6,.6,.6),this.floatingCoinMesh.visible=!1,this.sceneManager.scene.add(this.floatingCoinMesh),new dr().load("/magic-academy-3d/assets/collectibles/lisar coin.glb?v=7",n=>{this.floatingCoinMesh.add(n.scene.clone()),this.collectibleSystem.coinTemplate=n.scene},void 0,n=>{console.warn("Failed to load LISAR coin",n)})}setupEnemies(){const e=this.sceneManager.scene,t=new rs("crab_1",new b(-30,0,-25),[new b(-40,0,-25),new b(-20,0,-25)]),n=new rs("crab_2",new b(25,0,-25),[new b(15,0,-25),new b(35,0,-25)]),i=new rs("crab_3",new b(0,0,-65),[new b(-10,0,-65),new b(10,0,-65)]),s=new rs("crab_second_floor_1",new b(-6,5,-40)),a=new rs("crab_second_floor_2",new b(6,5,-40));this.bossEnemy=new rs("crab_boss",new b(45,.1,-40)),this.enemies.push(t,n,i,s,a,this.bossEnemy),this.enemies.forEach(o=>{const l=o.id==="crab_boss"?3.5:1;o.loadModel(l),o.setScene(e),e.add(o.mesh),this.spellSystem.registerEnemy(o),o.id==="crab_boss"&&(o.health=5,o.maxHealth=5,o.attackDmg=25,o.arenaCenter=new b(45,.1,-40),o.arenaRadius=15),o.onAttackPlayer=c=>{var d;const h=this.checkpointManager.getActiveCheckpointPosition();this.player.takeDamage(c,h),this.audioManager.playPlayerHurt();const u=(d=window.gameInstance)==null?void 0:d.hud;u&&u.triggerDamageFlash()},o.onDeath=async()=>{var c;if(o.id==="crab_boss"){if(console.log("[BOSS] HP: 0 -> Entering DYING state. Defeat sequence started."),this.isCinematicPlaying)return;this.isCinematicPlaying=!0,this.enemies.forEach(f=>{f.id!=="crab_boss"&&(f.isPaused=!0)});const h=(c=window.gameInstance)==null?void 0:c.cinematicCamera;if(h){const f=o.mesh.position.clone(),p=f.clone().add(new b(-6,3.5,6)),_=f.clone().add(new b(0,.5,0));h.moveCamera(p,p,_,_,999)}this.subtitleSystem.show("Jefe Cangrejo","¡El Jefe Cangrejo ha sido derrotado!"),await new Promise(f=>setTimeout(f,1e3)),console.log("[BOSS] Reward key spawned — flying to player");const u=this.keyDefinitions.key2_boss,d=o.mesh.position.clone().add(new b(0,1.2,0));await an.runSequence(u,d,this.player,this.sceneManager.scene,()=>{console.log("[BOSS] Death sequence completed — gameplay resumed"),this.awardKey("key2_boss"),h&&h.abort(),this.enemies.forEach(f=>f.isPaused=!1),this.isCinematicPlaying=!1})}}})}spawnKeysInWorld(){this.spawn3DKey("key3_platform",new b(0,10.8,-44))}spawn3DKey(e,t){const n=this.sceneManager.scene,i=new lt;i.position.copy(t),i.name=e;let s=16766720,a=16755200;e==="key1_gekko"?(s=65416,a=52326):e==="key2_boss"?(s=16724736,a=16755200):e==="key3_platform"?(s=58879,a=49151):e==="key4_gargoyles"?(s=11032055,a=9647082):e==="key5_pots"&&(s=16753920,a=16746496);const o=new Xe({color:s,emissive:a,emissiveIntensity:1,metalness:.85,roughness:.2}),l=new j(new ai(.26,.08,12,24),o);l.rotation.x=Math.PI/2;const c=new j(new Et(.06,.06,.65,12),o);c.position.y=-.35;const h=new j(new Ge(.18,.12,.06),o);h.position.set(.12,-.55,0);const u=new j(new Ge(.12,.08,.06),o);u.position.set(.1,-.42,0);const d=new sn(a,3.5,5.5);d.position.set(0,0,0),i.add(d),i.add(l,c,h,u),n.add(i),this.keysMeshes.push(i),console.log(`[LevelToyStory] ✅ Spawned 3D Key '${e}' at`,t)}awardKey(e,t){var s;if(this.collectedKeys[e])return;this.collectedKeys[e]=!0,t&&this.createSparks(t),this.audioManager.playCardPickup(),this.totalKeysCount++;const n=(s=window.gameInstance)==null?void 0:s.hud;n&&n.setKeyCount(this.totalKeysCount);let i="";e==="key1_gekko"&&(i="Llave de Gekko (Monedas)"),e==="key2_boss"&&(i="Llave de Combate (Jefe Cangrejo)"),e==="key3_platform"&&(i="Llave de Plataformas (Tejado)"),e==="key4_gargoyles"&&(i="Llave del Secreto (Gárgolas)"),e==="key5_pots"&&(i="Llave de Destrucción (Gemas)"),this.subtitleSystem.show("LISAR",`¡Has obtenido la ${i}! (${this.totalKeysCount}/5)`),this.totalKeysCount>=2&&this.exitDoor&&!this.exitDoor.isOpen&&(this.exitDoor.open(),this.subtitleSystem.show("LISAR","¡Portón Abierto! El portal de salida en el castillo trasero está desbloqueado."))}createSparks(e){const t=new gt,n=25,i=new Float32Array(n*3),s=[];for(let h=0;h<n;h++)i[h*3]=e.x+(Math.random()-.5)*.8,i[h*3+1]=e.y+Math.random()*.8,i[h*3+2]=e.z+(Math.random()-.5)*.8,s.push((Math.random()-.5)*3,Math.random()*3+2,(Math.random()-.5)*3);t.setAttribute("position",new ot(i,3));const a=new bi({color:4060159,size:.15,transparent:!0}),o=new Oi(t,a);this.sceneManager.scene.add(o);let l=0;const c=()=>{if(l+=.016,l>.6){this.sceneManager.scene.remove(o),t.dispose(),a.dispose();return}const h=t.attributes.position.array;for(let u=0;u<n;u++)h[u*3]+=s[u*3]*.016,h[u*3+1]+=s[u*3+1]*.016,h[u*3+2]+=s[u*3+2]*.016,s[u*3+1]-=9.8*.016;t.attributes.position.needsUpdate=!0,a.opacity=1-l/.6,requestAnimationFrame(c)};c()}setupTriggers(){const e=new Jr("trig_intro",new b(-8,-1,5),new b(8,5,15),()=>{var s;this.stateFlags.introCompleted||(this.stateFlags.introCompleted=!0,this.subtitleSystem.show("Sistema","Explora el mapa para conseguir las 5 llaves. Empieza buscando tu báculo en el cofre dentro del castillo."),(s=window.gameInstance)==null||s.hud.setObjective("Consigue las 5 llaves para abrir el portal"))});this.triggerZones.push(e);const t=new Jr("trig_boss_arena",new b(26,-1,-47),new b(34,6,-33),()=>{this.stateFlags.bossCinematicPlayed||(this.stateFlags.bossCinematicPlayed=!0,this.runBossCinematic())});this.triggerZones.push(t);const n=new Jr("trig_gekko",new b(-7,-1,-13),new b(-1,5,-7),async()=>{if(!this.isCinematicPlaying)if(this.gekkoMissionState==="NOT_STARTED")this.gekkoMissionState="MISSION_ACTIVE",this.stateFlags.gekkoTalked=!0,console.log("[GEKKO] State transition: NOT_STARTED -> MISSION_ACTIVE"),this.runGekkoCinematic();else if(this.gekkoMissionState==="MISSION_COMPLETE")console.log("[GEKKO] Triggering 2nd cinematic for 50 coins reward..."),this.runGekkoSecondCinematic();else if(this.gekkoMissionState==="MISSION_ACTIVE"){const s=this.collectibleSystem.coinCount;s>=50?(this.gekkoMissionState="MISSION_COMPLETE",console.log("[GEKKO] State transition: MISSION_ACTIVE -> MISSION_COMPLETE"),this.runGekkoSecondCinematic()):this.subtitleSystem.show("Gekko",`Aún no tienes las 50 monedas Lisar (tienes ${s}/50). ¡Búscalas por todo el escenario!`)}else this.gekkoMissionState==="REWARD_GIVEN"&&this.subtitleSystem.show("Gekko","¡Gracias por ayudarme con las 50 Lisar Coins! Usa esa llave para abrir el portón principal.")});this.triggerZones.push(n);const i=new Jr("trig_exit",new b(-5,-1,-54),new b(5,5,-50),()=>{var s;!this.stateFlags.levelCompleted&&this.exitDoor.isOpen&&(this.stateFlags.levelCompleted=!0,(s=window.gameInstance)==null||s.hud.showVictoryScreen(5,"05:00"),document.exitPointerLock())});this.triggerZones.push(i)}async runGekkoCinematic(){var n,i;const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(e&&t){this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(-4,0,-7.5),this.player.mesh.rotation.set(0,Math.PI,0),this.player.forceIdle(),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,0,0),this.gekkoNPC.setTalking(!0),this.floatingCoinMesh.position.set(-4,1.4,-8.7),this.floatingCoinMesh.visible=!0,this.subtitleSystem.hide();const s=new b(-1.5,1.25,-8.75),a=new b(-4,1.1,-8.75);e.moveCamera(s,s,a,a,999),await t.fadeScreenIn(500);let o=!1;const l=async()=>{o||(o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(500),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.gekkoNPC.setTalking(!1),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,-Math.PI*.25,0),this.floatingCoinMesh.visible=!1,this.enemies.forEach(h=>h.isPaused=!1),await t.fadeScreenIn(500))},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Gekko","¡Hola viajero! Consigue 50 monedas LISAR del mapa y te entregaré una de las cinco llaves mágicas del portal.",()=>{o||setTimeout(()=>{o||l()},4e3)})}}async runGekkoSecondCinematic(){var n,i;if(this.isCinematicPlaying)return;this.isCinematicPlaying=!0,console.log("[GEKKO] Mission state: COMPLETE -> Starting Reward Cinematic");const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(e&&t){this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(-4,0,-7.5),this.player.mesh.rotation.set(0,Math.PI,0),this.player.forceIdle(),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,0,0),this.gekkoNPC.setTalking(!0),this.floatingCoinMesh&&(this.floatingCoinMesh.visible=!1);const s=new b(-1.5,1.25,-8.75),a=new b(-4,1.1,-8.75);e.moveCamera(s,s,a,a,999),this.subtitleSystem.hide(),await t.fadeScreenIn(500);let o=!1;const l=async()=>{if(o)return;o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(400),e.abort(),this.gekkoNPC.setTalking(!1),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,-Math.PI*.25,0);const h=document.getElementById("gekko-quest-complete");h&&h.classList.add("hidden"),await t.fadeScreenIn(400),console.log("[GEKKO] Wealth Key given");const u=this.keyDefinitions.key1_gekko,d=new b(-4,1.2,-8.7);await an.runSequence(u,d,this.player,this.sceneManager.scene,()=>{this.gekkoMissionState="REWARD_GIVEN",this.coinsExchanged=!0,this.awardKey("key1_gekko"),this.enemies.forEach(f=>f.isPaused=!1),this.isCinematicPlaying=!1,console.log("[GEKKO] Mission completed — REWARD_GIVEN state set")})},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Gekko","Vaya... realmente las encontraste todas.",()=>{o||t.showTypewriterDialogue("Gekko","Las 50 Lisar Coins. No pensé que alguien fuera capaz de reunirlas.",()=>{o||t.showTypewriterDialogue("Gekko","Cumpliste tu parte del trato. Esta Llave de la Riqueza ahora te pertenece.",()=>{o||setTimeout(()=>{o||l()},2500)})})})}else this.isCinematicPlaying=!1}update(e,t){var n,i,s;this.grassUniforms&&(this.grassUniforms.uTime.value=performance.now()/1e3,this.grassUniforms.uPlayerPos&&this.grassUniforms.uPlayerPos.value.copy(t)),this.cloudsUniforms&&(this.cloudsUniforms.uTime.value=performance.now()/1e3),this.movingPlatforms.forEach(a=>a.update(e)),this.triggerZones.forEach(a=>a.check(t)),this.doors.forEach(a=>a.update(e)),this.gekkoNPC&&this.gekkoNPC.update(e),this.floatingCoinMesh&&this.floatingCoinMesh.visible&&(this.floatingCoinMesh.rotation.y+=e*2,this.floatingCoinMesh.position.y=1.4+Math.sin(Date.now()/300)*.08);for(let a=this.keysMeshes.length-1;a>=0;a--){const o=this.keysMeshes[a];if(o.rotation.y+=e*2,o.position.y+=Math.sin(Date.now()*.003)*.001,o.position.distanceTo(t)<1.4&&!this.player.isControlsLocked&&!this.isCinematicPlaying){const l=o.name,c=o.position.clone(),h=this.keyDefinitions[l]||{id:l,name:"Llave Mágica",color:16766720,emissiveColor:16755200,obtained:!1};this.sceneManager.scene.remove(o),this.keysMeshes.splice(a,1),an.runSequence(h,c,this.player,this.sceneManager.scene,()=>{this.awardKey(l,c)})}}if(this.enemies.forEach(a=>{a.state!=="DEAD"&&a.update(e,t,this.levelColliders)}),this.collectibleSystem.update(t,e,()=>{},a=>{var l;const o=(l=window.gameInstance)==null?void 0:l.hud;o&&(o.setCoinCount(a),a>=50&&!this.coinsExchanged&&this.subtitleSystem.show("Sistema","¡Tienes 50 monedas LISAR! Ve a hablar con Gekko."))}),!this.stateFlags.staffFound&&this.staffChest.mesh.position.distanceTo(t)<2){const a=(n=window.gameInstance)==null?void 0:n.hud;a==null||a.showInteractionPrompt("Abrir Cofre"),this.inputManager.keys.KeyE&&!this.staffChest.isUnlocked&&(this.stateFlags.staffFound=!0,this.staffChest.isUnlocked=!0,a==null||a.hideInteractionPrompt(),this.enemies.forEach(l=>l.isPaused=!0),this.staffChest.unlock(this.audioManager,this.collectibleSystem,()=>{this.player.equipStaff(this.sceneManager.scene),this.subtitleSystem.show("Báculo Mágico","¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.")}),new ly({scene:this.sceneManager.scene,player:this.player,chestPosition:this.staffChest.mesh.position.clone(),hud:{fadeScreenOut:l=>a.fadeScreenOut(l),fadeScreenIn:l=>a.fadeScreenIn(l),setObjective:l=>a.setObjective(l)},onComplete:()=>{console.log("[LevelToyStory] Staff cinematic complete — gameplay resumes."),this.enemies.forEach(l=>l.isPaused=!1)}}).run().catch(l=>{console.error("[LevelToyStory] ChestCinematic error:",l),this.player.isMovementLocked=!1,this.enemies.forEach(c=>c.isPaused=!1)}))}else(s=(i=window.gameInstance)==null?void 0:i.hud)==null||s.hideInteractionPrompt()}async runBossCinematic(){var n,i;const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(!(!e||!t))try{this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(35,.1,-40),this.player.mesh.rotation.set(0,Math.PI/2,0),this.player.forceIdle(),this.bossEnemy.mesh.position.set(48,.1,-40),this.bossEnemy.mesh.rotation.set(0,-Math.PI/2,0),this.bossEnemy.isPaused=!1,this.bossEnemy.state="IDLE";const s=new b(41.5,2.5,-46),a=new b(41.5,1.2,-40);e.moveCamera(s,s,a,a,999),this.subtitleSystem.hide(),await t.fadeScreenIn(500);let o=!1;const l=async()=>{o||(o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(500),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.enemies.forEach(h=>h.isPaused=!1),await t.fadeScreenIn(500))},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Jefe Cangrejo","¡Cuidado! Este cangrejo gigante acorazado es inmune a tus ataques normales. ¡Espera a que intente embestirte, esquívalo, y golpéalo por detrás mientras esté aturdido!",()=>{o||setTimeout(()=>{o||l()},7e3)})}catch(s){console.error("[Boss Cinematic] Error during cinematic, performing emergency cleanup:",s),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.enemies.forEach(a=>a.isPaused=!1),t.hideDialogue()}}}class dy{constructor(e){A(this,"sceneManager");A(this,"inputManager");A(this,"mobileInputManager");A(this,"audioManager");A(this,"assetManager");A(this,"hud");A(this,"subtitleSystem");A(this,"player");A(this,"animationController");A(this,"cameraController");A(this,"cinematicCamera");A(this,"cinematicManager");A(this,"spellSystem");A(this,"checkpointManager");A(this,"collectibleSystem");A(this,"level01");A(this,"lastFrameTime",0);A(this,"frameCount",0);A(this,"lastFpsCalcTime",0);A(this,"currentFps",60);A(this,"isPaused",!1);this.sceneManager=new wx(e),this.inputManager=new Tx(e),this.mobileInputManager=new Ax(this.inputManager),this.audioManager=new Cx,this.assetManager=new qv,this.hud=new oy,this.subtitleSystem=new Zv,this.initUIListeners()}async start(){console.log("[Game] Initializing 3D Magic Academy Vertical Slice...");const e=await this.assetManager.loadPlayerModel();this.sceneManager.scene.add(e.model),this.animationController=new Kv(e.model,e.clips),this.player=new yl(e.model,this.animationController),this.cameraController=new Yv(this.sceneManager.camera),this.cinematicCamera=new Ml(this.sceneManager.camera),this.cinematicManager=new jv(this.cinematicCamera,this.cameraController,this.player,this.subtitleSystem,this.audioManager),this.spellSystem=new ry(this.sceneManager.scene,this.audioManager),this.checkpointManager=new ay,this.collectibleSystem=new ey(this.sceneManager.scene,this.audioManager),this.level01=new uy(this.sceneManager,this.cameraController,this.player,this.inputManager,this.spellSystem,this.checkpointManager,this.collectibleSystem,this.subtitleSystem,this.audioManager),this.level01.init(),this.cameraController.setTarget(this.player.mesh),this.player.onHealthChange=(t,n)=>this.hud.setHealth(t,n),this.spellSystem.onCollectStaffCallback=()=>{this.player.equipStaff(),this.subtitleSystem.show("Báculo Mágico","¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.")},this.inputManager.onLeftClick=()=>{if(this.player.hasStaff&&!this.player.isControlsLocked&&!this.player.isAttacking){const t=this.spellSystem.activeSpell==="ALOHOMORA"||this.spellSystem.activeSpell==="LUMOS"?15:10;if(this.player.mana>=t){this.player.isAttacking=!0;const n=this.cameraController.getForwardVector(),i=Math.atan2(n.x,n.z);this.player.mesh.rotation.y=i,this.player.attachStaffToHand(),this.animationController.playCastSpellAnimation(()=>{if(this.player.useMana(t)){const s=this.player.getSpellLaunchPosition(),a=this.cameraController.getForwardVector(),o=this.cameraController.camera.position,l=this.spellSystem.getAimedDirection(s,o,a);this.spellSystem.castActiveSpell(s,l)}},()=>{this.player.attachStaffToBack(),this.player.isAttacking=!1})}}},this.inputManager.onKick=()=>{if(console.log("[Game] onKick callback triggered. HasStaff:",this.player.hasStaff,"isControlsLocked:",this.player.isControlsLocked,"isAttacking:",this.player.isAttacking),!this.player.hasStaff&&!this.player.isControlsLocked&&!this.player.isAttacking){this.player.isAttacking=!0,this.player.isMovementLocked=!0,this.player.isControlsLocked=!0,this.player.velocity.set(0,0,0);let t=null,n=1/0;const i=this.player.mesh.position,s=new b(0,0,1).applyQuaternion(this.player.mesh.quaternion);if(this.level01.enemies.forEach(a=>{if(a.isAlive()){const l=a.getPosition().clone().sub(i),c=l.length();if(c<4.5){l.normalize();const h=s.dot(l),u=Math.acos(Math.max(-1,Math.min(1,h)));if(u<1.22||c<1.5&&u<1.91){const d=c*(1+u);d<n&&(n=d,t=a)}}}}),t){const o=t.getPosition().clone().sub(i);o.y=0;const l=o.length();if(l>.001){o.divideScalar(l);let h=Math.atan2(o.x,o.z)-this.player.mesh.rotation.y;for(;h<-Math.PI;)h+=Math.PI*2;for(;h>Math.PI;)h-=Math.PI*2;const u=Math.PI/4,d=Math.max(-u,Math.min(u,h));this.player.mesh.rotation.y+=d,console.log("[Game] Soft Assist applied. Rotating Wukong by",(d*180/Math.PI).toFixed(1),"deg")}}this.audioManager.playAttackGrunt(),this.animationController.playWukongKick(()=>{const a=this.player.mesh.position,o=new b(0,0,1).applyQuaternion(this.player.mesh.quaternion);this.level01.enemies.forEach(l=>{if(l.isAlive()){const c=l.getPosition(),h=a.distanceTo(c),u=l.id==="crab_boss"?4.5:2.2;if(h<u){const d=c.clone().sub(a);d.lengthSq()>1e-4?d.normalize():d.copy(o),(o.dot(d)>.35||l.id==="crab_boss")&&(l.takeHit(a),this.audioManager.playHitImpact(),this.spellSystem.createImpactParticles(c.clone().add(new b(0,.5,0)),16753920))}}})},()=>{this.player.isAttacking=!1,this.player.isMovementLocked=!1,this.player.isControlsLocked=!1})}},this.inputManager.onSelectSpell=t=>{const n=["FLIPENDO","ALOHOMORA","LUMOS"],i=n[t%n.length]||"FLIPENDO";this.spellSystem.setActiveSpell(i),this.hud.setActiveSpellSlot(i)},this.inputManager.onSkipSubtitle=()=>{this.cinematicManager.requestSkip()},this.inputManager.onToggleDebug=()=>{this.hud.toggleDebug()},this.inputManager.onPointerLockChange=t=>{var i,s,a,o;if(t&&this.audioManager.resume(),!((s=(i=this.level01)==null?void 0:i.stateFlags)!=null&&s.introCompleted)||(o=(a=this.level01)==null?void 0:a.stateFlags)!=null&&o.levelCompleted)return;this.isPaused=!t;const n=document.getElementById("pause-screen");this.isPaused?n==null||n.classList.remove("hidden"):n==null||n.classList.add("hidden")},this.lastFrameTime=performance.now(),requestAnimationFrame(t=>this.loop(t))}initUIListeners(){const e=document.getElementById("btn-start"),t=document.getElementById("start-screen"),n=document.getElementById("btn-replay"),i=document.getElementById("btn-continue"),s=document.getElementById("btn-resume"),a=document.getElementById("btn-replay-pause"),o=document.getElementById("btn-exit-pause");e==null||e.addEventListener("click",()=>{t==null||t.classList.add("hidden"),this.audioManager.resume(),this.inputManager.requestPointerLock(),this.audioManager.startBGM(),this.hud.showGameplayHUD()}),n==null||n.addEventListener("click",()=>{window.location.reload()}),i==null||i.addEventListener("click",()=>{window.location.reload()}),s==null||s.addEventListener("click",()=>{this.audioManager.resume(),this.inputManager.requestPointerLock()}),a==null||a.addEventListener("click",()=>{window.location.reload()}),o==null||o.addEventListener("click",()=>{window.location.reload()})}loop(e){const t=Math.min(.1,(e-this.lastFrameTime)/1e3);this.lastFrameTime=e,this.isPaused||this.update(t),this.sceneManager.render(),this.frameCount++,e-this.lastFpsCalcTime>=1e3&&(this.currentFps=this.frameCount,this.frameCount=0,this.lastFpsCalcTime=e),requestAnimationFrame(n=>this.loop(n))}update(e){this.cinematicCamera.isActive()?(this.cinematicCamera.update(e),this.player.update(e,this.inputManager,this.cameraController)):(this.player.update(e,this.inputManager,this.cameraController),this.cameraController.update(e,this.inputManager)),this.spellSystem.update(e,this.level01.levelColliders),this.spellSystem.updateTargetLockon(this.cameraController.camera.position,this.cameraController.getForwardVector()),this.level01.update(e,this.player.mesh.position),this.player.hasStaff&&document.pointerLockElement?this.hud.showReticle(!0):this.hud.showReticle(!1),this.hud.updateDebugStats(this.currentFps,this.player.mesh.position.x,this.player.mesh.position.y,this.player.mesh.position.z,this.player.isGrounded?"Grounded":"Airborne",this.animationController.getCurrentState(),this.checkpointManager.getCurrentCheckpointId())}}window.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("game-canvas");if(r){const e=new dy(r);window.gameInstance=e,e.start()}});
