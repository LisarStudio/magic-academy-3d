var zu=Object.defineProperty;var Vu=(r,e,t)=>e in r?zu(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var C=(r,e,t)=>Vu(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const gl="185",Gu=0,nc=1,Hu=2,Xr=1,Ph=2,Fs=3,Qn=0,Jt=1,en=2,Jn=0,as=1,Vs=2,ic=3,sc=4,Wu=5,Ri=100,Xu=101,qu=102,Ku=103,Yu=104,$u=200,Zu=201,Ju=202,ju=203,_o=204,xo=205,Qu=206,ed=207,td=208,nd=209,id=210,sd=211,rd=212,ad=213,od=214,vo=0,yo=1,Mo=2,us=3,So=4,bo=5,wo=6,To=7,fa=0,ld=1,cd=2,Bn=0,Ih=1,Lh=2,Dh=3,_l=4,Fh=5,Nh=6,Uh=7,rc="attached",hd="detached",Oh=300,Li=301,ds=302,qr=303,Ea=304,pa=306,nn=1e3,mn=1001,ea=1002,Bt=1003,kh=1004,Ns=1005,Ot=1006,Kr=1007,On=1008,cn=1009,Bh=1010,zh=1011,Gs=1012,xl=1013,Vn=1014,gn=1015,ei=1016,vl=1017,yl=1018,Hs=1020,Vh=35902,Gh=35899,Hh=1021,Wh=1022,_n=1023,ti=1026,Ii=1027,Ml=1028,Sl=1029,Di=1030,bl=1031,wl=1033,Yr=33776,$r=33777,Zr=33778,Jr=33779,Eo=35840,Ao=35841,Co=35842,Ro=35843,Po=36196,Io=37492,Lo=37496,Do=37488,Fo=37489,ta=37490,No=37491,Uo=37808,Oo=37809,ko=37810,Bo=37811,zo=37812,Vo=37813,Go=37814,Ho=37815,Wo=37816,Xo=37817,qo=37818,Ko=37819,Yo=37820,$o=37821,Zo=36492,Jo=36494,jo=36495,Qo=36283,el=36284,na=36285,tl=36286,ia=2200,ud=2201,dd=2202,Ws=2300,Xs=2301,Aa=2302,ac=2303,is=2400,ss=2401,sa=2402,Tl=2500,fd=2501,pd=0,Xh=1,nl=2,md=3200,qs=0,gd=1,_i="",ct="srgb",hn="srgb-linear",ra="linear",ut="srgb",Bi=7680,oc=519,_d=512,xd=513,vd=514,El=515,yd=516,Md=517,Al=518,Sd=519,il=35044,lc="300 es",kn=2e3,Ks=2001;function bd(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function wd(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Ys(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Td(){const r=Ys("canvas");return r.style.display="block",r}const cc={};function aa(...r){const e="THREE."+r.shift();console.log(e,...r)}function qh(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Ae(...r){r=qh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function Ue(...r){r=qh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function os(...r){const e=r.join(" ");e in cc||(cc[e]=!0,Ae(...r))}function Ed(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Ad={[vo]:yo,[Mo]:wo,[So]:To,[us]:bo,[yo]:vo,[wo]:Mo,[To]:So,[bo]:us};class Mi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hc=1234567;const ks=Math.PI/180,fs=180/Math.PI;function An(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[r&255]+Kt[r>>8&255]+Kt[r>>16&255]+Kt[r>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function $e(r,e,t){return Math.max(e,Math.min(t,r))}function Cl(r,e){return(r%e+e)%e}function Cd(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Rd(r,e,t){return r!==e?(t-r)/(e-r):0}function Bs(r,e,t){return(1-t)*r+t*e}function Pd(r,e,t,n){return Bs(r,e,1-Math.exp(-t*n))}function Id(r,e=1){return e-Math.abs(Cl(r,e*2)-e)}function Ld(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Dd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Fd(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Nd(r,e){return r+Math.random()*(e-r)}function Ud(r){return r*(.5-Math.random())}function Od(r){r!==void 0&&(hc=r);let e=hc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kd(r){return r*ks}function Bd(r){return r*fs}function zd(r){return(r&r-1)===0&&r!==0}function Vd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Gd(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Hd(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*d,o*c);break;case"YZY":r.set(l*d,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*d,o*h,o*c);break;case"XZX":r.set(o*h,l*p,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*p,o*c);break;case"ZYZ":r.set(l*p,l*f,o*h,o*c);break;default:Ae("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Tn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function dt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ft={DEG2RAD:ks,RAD2DEG:fs,generateUUID:An,clamp:$e,euclideanModulo:Cl,mapLinear:Cd,inverseLerp:Rd,lerp:Bs,damp:Pd,pingpong:Id,smoothstep:Ld,smootherstep:Dd,randInt:Fd,randFloat:Nd,randFloatSpread:Ud,seededRandom:Od,degToRad:kd,radToDeg:Bd,isPowerOfTwo:zd,ceilPowerOfTwo:Vd,floorPowerOfTwo:Gd,setQuaternionFromProperEuler:Hd,normalize:dt,denormalize:Tn},Gl=class Gl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Gl.prototype.isVector2=!0;let Oe=Gl;class Dt{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[a+0],f=s[a+1],p=s[a+2],_=s[a+3];if(u!==_||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*_;g<0&&(d=-d,f=-f,p=-p,_=-_,g=-g);let m=1-o;if(g<.9995){const S=Math.acos(g),M=Math.sin(S);m=Math.sin(m*S)/M,o=Math.sin(o*S)/M,l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+_*o}else{l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+_*o;const S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],d=s[a+1],f=s[a+2],p=s[a+3];return e[t]=o*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-o*f,e[t+2]=c*p+h*f+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),d=l(n/2),f=l(i/2),p=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Ae("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Hl=class Hl{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ca.copy(this).projectOnVector(e),this.sub(Ca)}reflect(e){return this.sub(Ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Hl.prototype.isVector3=!0;let b=Hl;const Ca=new b,uc=new Dt,Wl=class Wl{constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],_=i[0],g=i[3],m=i[6],S=i[1],M=i[4],v=i[7],E=i[2],T=i[5],w=i[8];return s[0]=a*_+o*S+l*E,s[3]=a*g+o*M+l*T,s[6]=a*m+o*v+l*w,s[1]=c*_+h*S+u*E,s[4]=c*g+h*M+u*T,s[7]=c*m+h*v+u*w,s[2]=d*_+f*S+p*E,s[5]=d*g+f*M+p*T,s[8]=d*m+f*v+p*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,f=c*s-a*l,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return os("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ra.makeScale(e,t)),this}rotate(e){return os("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ra.makeRotation(-e)),this}translate(e,t){return os("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ra.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Wl.prototype.isMatrix3=!0;let Be=Wl;const Ra=new Be,dc=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fc=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wd(){const r={enabled:!0,workingColorSpace:hn,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ut&&(i.r=jn(i.r),i.g=jn(i.g),i.b=jn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ut&&(i.r=ls(i.r),i.g=ls(i.g),i.b=ls(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===_i?ra:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return os("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return os("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[hn]:{primaries:e,whitePoint:n,transfer:ra,toXYZ:dc,fromXYZ:fc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ct},outputColorSpaceConfig:{drawingBufferColorSpace:ct}},[ct]:{primaries:e,whitePoint:n,transfer:ut,toXYZ:dc,fromXYZ:fc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ct}}}),r}const ze=Wd();function jn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ls(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let zi;class Xd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zi===void 0&&(zi=Ys("canvas")),zi.width=e.width,zi.height=e.height;const i=zi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=zi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ys("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=jn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jn(t[n]/255)*255):t[n]=jn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ae("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qd=0;class Rl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=An(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Pa(i[a].image)):s.push(Pa(i[a]))}else s=Pa(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Pa(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Xd.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Ae("Texture: Unable to serialize Texture."),{})}let Kd=0;const Ia=new b;class kt extends Mi{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=mn,i=mn,s=Ot,a=On,o=_n,l=cn,c=kt.DEFAULT_ANISOTROPY,h=_i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=An(),this.name="",this.source=new Rl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ia).x}get height(){return this.source.getSize(Ia).y}get depth(){return this.source.getSize(Ia).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ae(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ae(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Oh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nn:e.x=e.x-Math.floor(e.x);break;case mn:e.x=e.x<0?0:1;break;case ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nn:e.y=e.y-Math.floor(e.y);break;case mn:e.y=e.y<0?0:1;break;case ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Oh;kt.DEFAULT_ANISOTROPY=1;const Xl=class Xl{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,v=(f+1)/2,E=(m+1)/2,T=(h+d)/4,w=(u+_)/4,x=(p+g)/4;return M>v&&M>E?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=T/n,s=w/n):v>E?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=T/i,s=x/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=w/s,i=x/s),this.set(n,i,s,t),this}let S=Math.sqrt((g-p)*(g-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(g-p)/S,this.y=(u-_)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Xl.prototype.isVector4=!0;let rt=Xl;class Yd extends Mi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},s=new kt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ot,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Rl(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zn extends Yd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Kh extends kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $d extends kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const da=class da{constructor(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,g)}set(e,t,n,i,s,a,o,l,c,h,u,d,f,p,_,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new da().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Vi.setFromMatrixColumn(e,0).length(),s=1/Vi.setFromMatrixColumn(e,1).length(),a=1/Vi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=a*h,f=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d+_*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=p*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-_*u}else if(e.order==="XZY"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zd,e,Jd)}lookAt(e,t,n){const i=this.elements;return on.subVectors(e,t),on.lengthSq()===0&&(on.z=1),on.normalize(),oi.crossVectors(n,on),oi.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),oi.crossVectors(n,on)),oi.normalize(),hr.crossVectors(on,oi),i[0]=oi.x,i[4]=hr.x,i[8]=on.x,i[1]=oi.y,i[5]=hr.y,i[9]=on.y,i[2]=oi.z,i[6]=hr.z,i[10]=on.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],_=n[6],g=n[10],m=n[14],S=n[3],M=n[7],v=n[11],E=n[15],T=i[0],w=i[4],x=i[8],R=i[12],I=i[1],L=i[5],D=i[9],H=i[13],Y=i[2],O=i[6],X=i[10],B=i[14],Q=i[3],ne=i[7],fe=i[11],de=i[15];return s[0]=a*T+o*I+l*Y+c*Q,s[4]=a*w+o*L+l*O+c*ne,s[8]=a*x+o*D+l*X+c*fe,s[12]=a*R+o*H+l*B+c*de,s[1]=h*T+u*I+d*Y+f*Q,s[5]=h*w+u*L+d*O+f*ne,s[9]=h*x+u*D+d*X+f*fe,s[13]=h*R+u*H+d*B+f*de,s[2]=p*T+_*I+g*Y+m*Q,s[6]=p*w+_*L+g*O+m*ne,s[10]=p*x+_*D+g*X+m*fe,s[14]=p*R+_*H+g*B+m*de,s[3]=S*T+M*I+v*Y+E*Q,s[7]=S*w+M*L+v*O+E*ne,s[11]=S*x+M*D+v*X+E*fe,s[15]=S*R+M*H+v*B+E*de,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],g=e[11],m=e[15],S=l*f-c*d,M=o*f-c*u,v=o*d-l*u,E=a*f-c*h,T=a*d-l*h,w=a*u-o*h;return t*(_*S-g*M+m*v)-n*(p*S-g*E+m*T)+i*(p*M-_*E+m*w)-s*(p*v-_*T+g*w)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(s*h-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],g=e[14],m=e[15],S=t*o-n*a,M=t*l-i*a,v=t*c-s*a,E=n*l-i*o,T=n*c-s*o,w=i*c-s*l,x=h*_-u*p,R=h*g-d*p,I=h*m-f*p,L=u*g-d*_,D=u*m-f*_,H=d*m-f*g,Y=S*H-M*D+v*L+E*I-T*R+w*x;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/Y;return e[0]=(o*H-l*D+c*L)*O,e[1]=(i*D-n*H-s*L)*O,e[2]=(_*w-g*T+m*E)*O,e[3]=(d*T-u*w-f*E)*O,e[4]=(l*I-a*H-c*R)*O,e[5]=(t*H-i*I+s*R)*O,e[6]=(g*v-p*w-m*M)*O,e[7]=(h*w-d*v+f*M)*O,e[8]=(a*D-o*I+c*x)*O,e[9]=(n*I-t*D-s*x)*O,e[10]=(p*T-_*v+m*S)*O,e[11]=(u*v-h*T-f*S)*O,e[12]=(o*R-a*L-l*x)*O,e[13]=(t*L-n*R+i*x)*O,e[14]=(_*M-p*E-g*S)*O,e[15]=(h*E-u*M+d*S)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,f=s*h,p=s*u,_=a*h,g=a*u,m=o*u,S=l*c,M=l*h,v=l*u,E=n.x,T=n.y,w=n.z;return i[0]=(1-(_+m))*E,i[1]=(f+v)*E,i[2]=(p-M)*E,i[3]=0,i[4]=(f-v)*T,i[5]=(1-(d+m))*T,i[6]=(g+S)*T,i[7]=0,i[8]=(p+M)*w,i[9]=(g-S)*w,i[10]=(1-(d+_))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Vi.set(i[0],i[1],i[2]).length();const o=Vi.set(i[4],i[5],i[6]).length(),l=Vi.set(i[8],i[9],i[10]).length();s<0&&(a=-a),yn.copy(this);const c=1/a,h=1/o,u=1/l;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,t.setFromRotationMatrix(yn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=kn,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let p,_;if(l)p=s/(a-s),_=a*s/(a-s);else if(o===kn)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Ks)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=kn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let p,_;if(l)p=1/(a-s),_=a/(a-s);else if(o===kn)p=-2/(a-s),_=-(a+s)/(a-s);else if(o===Ks)p=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};da.prototype.isMatrix4=!0;let Se=da;const Vi=new b,yn=new Se,Zd=new b(0,0,0),Jd=new b(1,1,1),oi=new b,hr=new b,on=new b,pc=new Se,mc=new Dt;class Wt{constructor(e=0,t=0,n=0,i=Wt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ae("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return pc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(pc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return mc.setFromEuler(this),this.setFromQuaternion(mc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wt.DEFAULT_ORDER="XYZ";class Pl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let jd=0;const gc=new b,Gi=new Dt,Wn=new Se,ur=new b,bs=new b,Qd=new b,ef=new Dt,_c=new b(1,0,0),xc=new b(0,1,0),vc=new b(0,0,1),yc={type:"added"},tf={type:"removed"},Hi={type:"childadded",child:null},La={type:"childremoved",child:null};class pt extends Mi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jd++}),this.uuid=An(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pt.DEFAULT_UP.clone();const e=new b,t=new Wt,n=new Dt,i=new b(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Se},normalMatrix:{value:new Be}}),this.matrix=new Se,this.matrixWorld=new Se,this.matrixAutoUpdate=pt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.premultiply(Gi),this}rotateX(e){return this.rotateOnAxis(_c,e)}rotateY(e){return this.rotateOnAxis(xc,e)}rotateZ(e){return this.rotateOnAxis(vc,e)}translateOnAxis(e,t){return gc.copy(e).applyQuaternion(this.quaternion),this.position.add(gc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(_c,e)}translateY(e){return this.translateOnAxis(xc,e)}translateZ(e){return this.translateOnAxis(vc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ur.copy(e):ur.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(bs,ur,this.up):Wn.lookAt(ur,bs,this.up),this.quaternion.setFromRotationMatrix(Wn),i&&(Wn.extractRotation(i.matrixWorld),Gi.setFromRotationMatrix(Wn),this.quaternion.premultiply(Gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ue("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null):Ue("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tf),La.child=e,this.dispatchEvent(La),La.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,e,Qd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,ef,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}pt.DEFAULT_UP=new b(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class lt extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nf={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nf)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},li={h:0,s:0,l:0},dr={h:0,s:0,l:0};function Fa(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Me{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ze.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ze.workingColorSpace){return this.r=e,this.g=t,this.b=n,ze.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ze.workingColorSpace){if(e=Cl(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Fa(a,s,e+1/3),this.g=Fa(a,s,e),this.b=Fa(a,s,e-1/3)}return ze.colorSpaceToWorking(this,i),this}setStyle(e,t=ct){function n(s){s!==void 0&&parseFloat(s)<1&&Ae("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ae("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ae("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ct){const n=Yh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ae("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=ls(e.r),this.g=ls(e.g),this.b=ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ct){return ze.workingToColorSpace(Yt.copy(this),e),Math.round($e(Yt.r*255,0,255))*65536+Math.round($e(Yt.g*255,0,255))*256+Math.round($e(Yt.b*255,0,255))}getHexString(e=ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ze.workingColorSpace){ze.workingToColorSpace(Yt.copy(this),t);const n=Yt.r,i=Yt.g,s=Yt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ze.workingColorSpace){return ze.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=ct){ze.workingToColorSpace(Yt.copy(this),e);const t=Yt.r,n=Yt.g,i=Yt.b;return e!==ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(li),this.setHSL(li.h+e,li.s+t,li.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(li),e.getHSL(dr);const n=Bs(li.h,dr.h,t),i=Bs(li.s,dr.s,t),s=Bs(li.l,dr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Me;Me.NAMES=Yh;class ma{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Me(e),this.density=t}clone(){return new ma(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class sf extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wt,this.environmentIntensity=1,this.environmentRotation=new Wt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Mn=new b,Xn=new b,Na=new b,qn=new b,Wi=new b,Xi=new b,Mc=new b,Ua=new b,Oa=new b,ka=new b,Ba=new rt,za=new rt,Va=new rt;class En{constructor(e=new b,t=new b,n=new b){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Mn.subVectors(e,t),i.cross(Mn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Mn.subVectors(i,t),Xn.subVectors(n,t),Na.subVectors(e,t);const a=Mn.dot(Mn),o=Mn.dot(Xn),l=Mn.dot(Na),c=Xn.dot(Xn),h=Xn.dot(Na),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,p=(a*h-o*l)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,qn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,qn.x),l.addScaledVector(a,qn.y),l.addScaledVector(o,qn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return Ba.setScalar(0),za.setScalar(0),Va.setScalar(0),Ba.fromBufferAttribute(e,t),za.fromBufferAttribute(e,n),Va.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Ba,s.x),a.addScaledVector(za,s.y),a.addScaledVector(Va,s.z),a}static isFrontFacing(e,t,n,i){return Mn.subVectors(n,t),Xn.subVectors(e,t),Mn.cross(Xn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),Mn.cross(Xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return En.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return En.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return En.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return En.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return En.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Wi.subVectors(i,n),Xi.subVectors(s,n),Ua.subVectors(e,n);const l=Wi.dot(Ua),c=Xi.dot(Ua);if(l<=0&&c<=0)return t.copy(n);Oa.subVectors(e,i);const h=Wi.dot(Oa),u=Xi.dot(Oa);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Wi,a);ka.subVectors(e,s);const f=Wi.dot(ka),p=Xi.dot(ka);if(p>=0&&f<=p)return t.copy(s);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Xi,o);const g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Mc.subVectors(s,i),o=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(Mc,o);const m=1/(g+_+d);return a=_*m,o=d*m,t.copy(n).addScaledVector(Wi,a).addScaledVector(Xi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class tn{constructor(e=new b(1/0,1/0,1/0),t=new b(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Sn):Sn.fromBufferAttribute(s,a),Sn.applyMatrix4(e.matrixWorld),this.expandByPoint(Sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fr.copy(n.boundingBox)),fr.applyMatrix4(e.matrixWorld),this.union(fr)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Sn),Sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ws),pr.subVectors(this.max,ws),qi.subVectors(e.a,ws),Ki.subVectors(e.b,ws),Yi.subVectors(e.c,ws),ci.subVectors(Ki,qi),hi.subVectors(Yi,Ki),bi.subVectors(qi,Yi);let t=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-bi.z,bi.y,ci.z,0,-ci.x,hi.z,0,-hi.x,bi.z,0,-bi.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-bi.y,bi.x,0];return!Ga(t,qi,Ki,Yi,pr)||(t=[1,0,0,0,1,0,0,0,1],!Ga(t,qi,Ki,Yi,pr))?!1:(mr.crossVectors(ci,hi),t=[mr.x,mr.y,mr.z],Ga(t,qi,Ki,Yi,pr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Kn=[new b,new b,new b,new b,new b,new b,new b,new b],Sn=new b,fr=new tn,qi=new b,Ki=new b,Yi=new b,ci=new b,hi=new b,bi=new b,ws=new b,pr=new b,mr=new b,wi=new b;function Ga(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){wi.fromArray(r,s);const o=i.x*Math.abs(wi.x)+i.y*Math.abs(wi.y)+i.z*Math.abs(wi.z),l=e.dot(wi),c=t.dot(wi),h=n.dot(wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ut=new b,gr=new Oe;let rf=0;class ot extends Mi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=il,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix3(e),this.setXY(t,gr.x,gr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Tn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Tn(t,this.array)),t}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Tn(t,this.array)),t}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Tn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Tn(t,this.array)),t}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==il&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Il extends ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class $h extends ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class it extends ot{constructor(e,t,n){super(new Float32Array(e),t,n)}}const af=new tn,Ts=new b,Ha=new b;class Gn{constructor(e=new b,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):af.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ts.subVectors(e,this.center);const t=Ts.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ts,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ha.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ts.copy(e.center).add(Ha)),this.expandByPoint(Ts.copy(e.center).sub(Ha))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let of=0;const dn=new Se,Wa=new pt,$i=new b,ln=new tn,Es=new tn,Gt=new b;class mt extends Mi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=An(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bd(e)?$h:Il)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Be().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return dn.makeRotationFromQuaternion(e),this.applyMatrix4(dn),this}rotateX(e){return dn.makeRotationX(e),this.applyMatrix4(dn),this}rotateY(e){return dn.makeRotationY(e),this.applyMatrix4(dn),this}rotateZ(e){return dn.makeRotationZ(e),this.applyMatrix4(dn),this}translate(e,t,n){return dn.makeTranslation(e,t,n),this.applyMatrix4(dn),this}scale(e,t,n){return dn.makeScale(e,t,n),this.applyMatrix4(dn),this}lookAt(e){return Wa.lookAt(e),Wa.updateMatrix(),this.applyMatrix4(Wa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new it(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Ae("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];ln.setFromBufferAttribute(s),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new b,1/0);return}if(e){const n=this.boundingSphere.center;if(ln.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(Gt.addVectors(ln.min,Es.min),ln.expandByPoint(Gt),Gt.addVectors(ln.max,Es.max),ln.expandByPoint(Gt)):(ln.expandByPoint(Es.min),ln.expandByPoint(Es.max))}ln.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Gt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Gt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Gt.fromBufferAttribute(o,c),l&&($i.fromBufferAttribute(e,c),Gt.add($i)),i=Math.max(i,n.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ot(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new b,l[x]=new b;const c=new b,h=new b,u=new b,d=new Oe,f=new Oe,p=new Oe,_=new b,g=new b;function m(x,R,I){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,R),u.fromBufferAttribute(n,I),d.fromBufferAttribute(s,x),f.fromBufferAttribute(s,R),p.fromBufferAttribute(s,I),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const L=1/(f.x*p.y-p.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(L),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(L),o[x].add(_),o[R].add(_),o[I].add(_),l[x].add(g),l[R].add(g),l[I].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,R=S.length;x<R;++x){const I=S[x],L=I.start,D=I.count;for(let H=L,Y=L+D;H<Y;H+=3)m(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const M=new b,v=new b,E=new b,T=new b;function w(x){E.fromBufferAttribute(i,x),T.copy(E);const R=o[x];M.copy(R),M.sub(E.multiplyScalar(E.dot(R))).normalize(),v.crossVectors(T,R);const L=v.dot(l[x])<0?-1:1;a.setXYZW(x,M.x,M.y,M.z,L)}for(let x=0,R=S.length;x<R;++x){const I=S[x],L=I.start,D=I.count;for(let H=L,Y=L+D;H<Y;H+=3)w(e.getX(H+0)),w(e.getX(H+1)),w(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new b,s=new b,a=new b,o=new b,l=new b,c=new b,h=new b,u=new b;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new ot(d,h,u)}if(this.index===null)return Ae("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class lf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=il,this.updateRanges=[],this.version=0,this.uuid=An()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const jt=new b;class Ll{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Tn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Tn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Tn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Tn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Tn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),n=dt(n,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){aa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ot(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ll(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){aa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let cf=0;class xn extends Mi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=An(),this.name="",this.type="Material",this.blending=as,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_o,this.blendDst=xo,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bi,this.stencilZFail=Bi,this.stencilZPass=Bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ae(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ae(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_o&&(n.blendSrc=this.blendSrc),this.blendDst!==xo&&(n.blendDst=this.blendDst),this.blendEquation!==Ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==us&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Me().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Oe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Oe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Yn=new b,Xa=new b,_r=new b,ui=new b,qa=new b,xr=new b,Ka=new b;class nr{constructor(e=new b,t=new b(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yn.copy(this.origin).addScaledVector(this.direction,t),Yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Xa.copy(e).add(t).multiplyScalar(.5),_r.copy(t).sub(e).normalize(),ui.copy(this.origin).sub(Xa);const s=e.distanceTo(t)*.5,a=-this.direction.dot(_r),o=ui.dot(this.direction),l=-ui.dot(_r),c=ui.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*l-o,d=a*o-l,p=s*h,u>=0)if(d>=-p)if(d<=p){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Xa).addScaledVector(_r,d),f}intersectSphere(e,t){Yn.subVectors(e.center,this.origin);const n=Yn.dot(this.direction),i=Yn.dot(Yn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Yn)!==null}intersectTriangle(e,t,n,i,s){qa.subVectors(t,e),xr.subVectors(n,e),Ka.crossVectors(qa,xr);let a=this.direction.dot(Ka),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ui.subVectors(this.origin,e);const l=o*this.direction.dot(xr.crossVectors(ui,xr));if(l<0)return null;const c=o*this.direction.dot(qa.cross(ui));if(c<0||l+c>a)return null;const h=-o*ui.dot(Ka);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt extends xn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=fa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Sc=new Se,Ti=new nr,vr=new Gn,bc=new b,yr=new b,Mr=new b,Sr=new b,Ya=new b,br=new b,wc=new b,wr=new b;class ee extends pt{constructor(e=new mt,t=new Mt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){br.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Ya.fromBufferAttribute(u,e),a?br.addScaledVector(Ya,h):br.addScaledVector(Ya.sub(t),h))}t.add(br)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(s),Ti.copy(e.ray).recast(e.near),!(vr.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(vr,bc)===null||Ti.origin.distanceToSquared(bc)>(e.far-e.near)**2))&&(Sc.copy(s).invert(),Ti.copy(e.ray).applyMatrix4(Sc),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ti)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,E=M;v<E;v+=3){const T=o.getX(v),w=o.getX(v+1),x=o.getX(v+2);i=Tr(this,m,e,n,c,h,u,T,w,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){const S=o.getX(g),M=o.getX(g+1),v=o.getX(g+2);i=Tr(this,a,e,n,c,h,u,S,M,v),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,E=M;v<E;v+=3){const T=v,w=v+1,x=v+2;i=Tr(this,m,e,n,c,h,u,T,w,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){const S=g,M=g+1,v=g+2;i=Tr(this,a,e,n,c,h,u,S,M,v),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function hf(r,e,t,n,i,s,a,o){let l;if(e.side===Jt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===Qn,o),l===null)return null;wr.copy(o),wr.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(wr);return c<t.near||c>t.far?null:{distance:c,point:wr.clone(),object:r}}function Tr(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,yr),r.getVertexPosition(l,Mr),r.getVertexPosition(c,Sr);const h=hf(r,e,t,n,yr,Mr,Sr,wc);if(h){const u=new b;En.getBarycoord(wc,yr,Mr,Sr,u),i&&(h.uv=En.getInterpolatedAttribute(i,o,l,c,u,new Oe)),s&&(h.uv1=En.getInterpolatedAttribute(s,o,l,c,u,new Oe)),a&&(h.normal=En.getInterpolatedAttribute(a,o,l,c,u,new b),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new b,materialIndex:0};En.getNormal(yr,Mr,Sr,d.normal),h.face=d,h.barycoord=u}return h}const As=new rt,Tc=new rt,Ec=new rt,uf=new rt,Ac=new Se,Er=new b,$a=new Gn,Cc=new Se,Za=new nr;class Zh extends ee{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=rc,this.bindMatrix=new Se,this.bindMatrixInverse=new Se,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new tn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Er),this.boundingBox.expandByPoint(Er)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Gn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Er),this.boundingSphere.expandByPoint(Er)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$a.copy(this.boundingSphere),$a.applyMatrix4(i),e.ray.intersectsSphere($a)!==!1&&(Cc.copy(i).invert(),Za.copy(e.ray).applyMatrix4(Cc),!(this.boundingBox!==null&&Za.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Za)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new rt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===rc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===hd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ae("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Tc.fromBufferAttribute(i.attributes.skinIndex,e),Ec.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(As.copy(t),t.set(0,0,0,0)):(As.set(...t,1),t.set(0,0,0)),As.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){const a=Ec.getComponent(s);if(a!==0){const o=Tc.getComponent(s);Ac.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(uf.copy(As).applyMatrix4(Ac),a)}}return t.isVector4&&(t.w=As.w),t.applyMatrix4(this.bindMatrixInverse)}}class oa extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Dl extends kt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=Bt,h=Bt,u,d){super(null,a,o,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Rc=new Se,df=new Se;class xi{constructor(e=[],t=[]){this.uuid=An(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ae("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Se)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Se;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:df;Rc.multiplyMatrices(o,t[s]),Rc.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new xi(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Dl(t,e,e,_n,gn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(Ae("Skeleton: No bone found with UUID:",s),a=new oa),this.bones.push(a),this.boneInverses.push(new Se().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class sl extends ot{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Zi=new Se,Pc=new Se,Ar=[],Ic=new tn,ff=new Se,Cs=new ee,Rs=new Gn;class Jh extends ee{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new sl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,ff)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new tn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zi),Ic.copy(e.boundingBox).applyMatrix4(Zi),this.boundingBox.union(Ic)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zi),Rs.copy(e.boundingSphere).applyMatrix4(Zi),this.boundingSphere.union(Rs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Cs.geometry=this.geometry,Cs.material=this.material,Cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rs.copy(this.boundingSphere),Rs.applyMatrix4(n),e.ray.intersectsSphere(Rs)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Zi),Pc.multiplyMatrices(n,Zi),Cs.matrixWorld=Pc,Cs.raycast(e,Ar);for(let a=0,o=Ar.length;a<o;a++){const l=Ar[a];l.instanceId=s,l.object=this,t.push(l)}Ar.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new sl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Dl(new Float32Array(i*this.count),i,this.count,Ml,gn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ja=new b,pf=new b,mf=new Be;class Ci{constructor(e=new b(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ja.subVectors(n,t).cross(pf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Ja),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||mf.getNormalMatrix(e),i=this.coplanarPoint(Ja).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ei=new Gn,gf=new Oe(.5,.5),Cr=new b;class Fl{constructor(e=new Ci,t=new Ci,n=new Ci,i=new Ci,s=new Ci,a=new Ci){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=kn,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],p=s[8],_=s[9],g=s[10],m=s[11],S=s[12],M=s[13],v=s[14],E=s[15];if(i[0].setComponents(c-a,f-h,m-p,E-S).normalize(),i[1].setComponents(c+a,f+h,m+p,E+S).normalize(),i[2].setComponents(c+o,f+u,m+_,E+M).normalize(),i[3].setComponents(c-o,f-u,m-_,E-M).normalize(),n)i[4].setComponents(l,d,g,v).normalize(),i[5].setComponents(c-l,f-d,m-g,E-v).normalize();else if(i[4].setComponents(c-l,f-d,m-g,E-v).normalize(),t===kn)i[5].setComponents(c+l,f+d,m+g,E+v).normalize();else if(t===Ks)i[5].setComponents(l,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(e){Ei.center.set(0,0,0);const t=gf.distanceTo(e.center);return Ei.radius=.7071067811865476+t,Ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Cr.x=i.normal.x>0?e.max.x:e.min.x,Cr.y=i.normal.y>0?e.max.y:e.min.y,Cr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Cr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ga extends xn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const la=new b,ca=new b,Lc=new Se,Ps=new nr,Rr=new Gn,ja=new b,Dc=new b;class _a extends pt{constructor(e=new mt,t=new ga){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)la.fromBufferAttribute(t,i-1),ca.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=la.distanceTo(ca);e.setAttribute("lineDistance",new it(n,1))}else Ae("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(i),Rr.radius+=s,e.ray.intersectsSphere(Rr)===!1)return;Lc.copy(i).invert(),Ps.copy(e.ray).applyMatrix4(Lc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){const m=h.getX(_),S=h.getX(_+1),M=Pr(this,e,Ps,l,m,S,_);M&&t.push(M)}if(this.isLineLoop){const _=h.getX(p-1),g=h.getX(f),m=Pr(this,e,Ps,l,_,g,p-1);m&&t.push(m)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){const m=Pr(this,e,Ps,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){const _=Pr(this,e,Ps,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Pr(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(la.fromBufferAttribute(o,i),ca.fromBufferAttribute(o,s),t.distanceSqToSegment(la,ca,ja,Dc)>n)return;ja.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(ja);if(!(c<e.near||c>e.far))return{distance:c,point:Dc.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Fc=new b,Nc=new b;class jh extends _a{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Fc.fromBufferAttribute(t,i),Nc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Fc.distanceTo(Nc);e.setAttribute("lineDistance",new it(n,1))}else Ae("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class _f extends _a{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class yi extends xn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Uc=new Se,rl=new nr,Ir=new Gn,Lr=new b;class Fi extends pt{constructor(e=new mt,t=new yi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere),Ir.applyMatrix4(i),Ir.radius+=s,e.ray.intersectsSphere(Ir)===!1)return;Uc.copy(i).invert(),rl.copy(e.ray).applyMatrix4(Uc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const g=c.getX(p);Lr.fromBufferAttribute(u,g),Oc(Lr,g,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,_=f;p<_;p++)Lr.fromBufferAttribute(u,p),Oc(Lr,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Oc(r,e,t,n,i,s,a){const o=rl.distanceSqToPoint(r);if(o<t){const l=new b;rl.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Qh extends kt{constructor(e=[],t=Li,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gi extends kt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ps extends kt{constructor(e,t,n=Vn,i,s,a,o=Bt,l=Bt,c,h=ti,u=1){if(h!==ti&&h!==Ii)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Rl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class xf extends ps{constructor(e,t=Vn,n=Li,i,s,a=Bt,o=Bt,l,c=ti){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class eu extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ke extends mt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,s,0),p("z","y","x",1,-1,n,t,-e,a,s,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2));function p(_,g,m,S,M,v,E,T,w,x,R){const I=v/w,L=E/x,D=v/2,H=E/2,Y=T/2,O=w+1,X=x+1;let B=0,Q=0;const ne=new b;for(let fe=0;fe<X;fe++){const de=fe*L-H;for(let ye=0;ye<O;ye++){const qe=ye*I-D;ne[_]=qe*S,ne[g]=de*M,ne[m]=Y,c.push(ne.x,ne.y,ne.z),ne[_]=0,ne[g]=0,ne[m]=T>0?1:-1,h.push(ne.x,ne.y,ne.z),u.push(ye/w),u.push(1-fe/x),B+=1}}for(let fe=0;fe<x;fe++)for(let de=0;de<w;de++){const ye=d+de+O*fe,qe=d+de+O*(fe+1),Ze=d+(de+1)+O*(fe+1),Fe=d+(de+1)+O*fe;l.push(ye,qe,Fe),l.push(qe,Ze,Fe),Q+=6}o.addGroup(f,Q,R),f+=Q,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ke(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class yt extends mt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],d=[],f=[];let p=0;const _=[],g=n/2;let m=0;S(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new it(u,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(f,2));function S(){const v=new b,E=new b;let T=0;const w=(t-e)/n;for(let x=0;x<=s;x++){const R=[],I=x/s,L=I*(t-e)+e;for(let D=0;D<=i;D++){const H=D/i,Y=H*l+o,O=Math.sin(Y),X=Math.cos(Y);E.x=L*O,E.y=-I*n+g,E.z=L*X,u.push(E.x,E.y,E.z),v.set(O,w,X).normalize(),d.push(v.x,v.y,v.z),f.push(H,1-I),R.push(p++)}_.push(R)}for(let x=0;x<i;x++)for(let R=0;R<s;R++){const I=_[R][x],L=_[R+1][x],D=_[R+1][x+1],H=_[R][x+1];(e>0||R!==0)&&(h.push(I,L,H),T+=3),(t>0||R!==s-1)&&(h.push(L,D,H),T+=3)}c.addGroup(m,T,0),m+=T}function M(v){const E=p,T=new Oe,w=new b;let x=0;const R=v===!0?e:t,I=v===!0?1:-1;for(let D=1;D<=i;D++)u.push(0,g*I,0),d.push(0,I,0),f.push(.5,.5),p++;const L=p;for(let D=0;D<=i;D++){const Y=D/i*l+o,O=Math.cos(Y),X=Math.sin(Y);w.x=R*X,w.y=g*I,w.z=R*O,u.push(w.x,w.y,w.z),d.push(0,I,0),T.x=O*.5+.5,T.y=X*.5*I+.5,f.push(T.x,T.y),p++}for(let D=0;D<i;D++){const H=E+D,Y=L+D;v===!0?h.push(Y,Y+1,H):h.push(Y+1,Y,H),x+=3}c.addGroup(m,x,v===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ha extends yt{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ha(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class xa extends mt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],a=[];o(i),c(n),h(),this.setAttribute("position",new it(s,3)),this.setAttribute("normal",new it(s.slice(),3)),this.setAttribute("uv",new it(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const M=new b,v=new b,E=new b;for(let T=0;T<t.length;T+=3)f(t[T+0],M),f(t[T+1],v),f(t[T+2],E),l(M,v,E,S)}function l(S,M,v,E){const T=E+1,w=[];for(let x=0;x<=T;x++){w[x]=[];const R=S.clone().lerp(v,x/T),I=M.clone().lerp(v,x/T),L=T-x;for(let D=0;D<=L;D++)D===0&&x===T?w[x][D]=R:w[x][D]=R.clone().lerp(I,D/L)}for(let x=0;x<T;x++)for(let R=0;R<2*(T-x)-1;R++){const I=Math.floor(R/2);R%2===0?(d(w[x][I+1]),d(w[x+1][I]),d(w[x][I])):(d(w[x][I+1]),d(w[x+1][I+1]),d(w[x+1][I]))}}function c(S){const M=new b;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(S),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function h(){const S=new b;for(let M=0;M<s.length;M+=3){S.x=s[M+0],S.y=s[M+1],S.z=s[M+2];const v=g(S)/2/Math.PI+.5,E=m(S)/Math.PI+.5;a.push(v,1-E)}p(),u()}function u(){for(let S=0;S<a.length;S+=6){const M=a[S+0],v=a[S+2],E=a[S+4],T=Math.max(M,v,E),w=Math.min(M,v,E);T>.9&&w<.1&&(M<.2&&(a[S+0]+=1),v<.2&&(a[S+2]+=1),E<.2&&(a[S+4]+=1))}}function d(S){s.push(S.x,S.y,S.z)}function f(S,M){const v=S*3;M.x=e[v+0],M.y=e[v+1],M.z=e[v+2]}function p(){const S=new b,M=new b,v=new b,E=new b,T=new Oe,w=new Oe,x=new Oe;for(let R=0,I=0;R<s.length;R+=9,I+=6){S.set(s[R+0],s[R+1],s[R+2]),M.set(s[R+3],s[R+4],s[R+5]),v.set(s[R+6],s[R+7],s[R+8]),T.set(a[I+0],a[I+1]),w.set(a[I+2],a[I+3]),x.set(a[I+4],a[I+5]),E.copy(S).add(M).add(v).divideScalar(3);const L=g(E);_(T,I+0,S,L),_(w,I+2,M,L),_(x,I+4,v,L)}}function _(S,M,v,E){E<0&&S.x===1&&(a[M]=S.x-1),v.x===0&&v.z===0&&(a[M]=E/2/Math.PI+.5)}function g(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xa(e.vertices,e.indices,e.radius,e.detail)}}class va extends xa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new va(e.radius,e.detail)}}class vf{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ae("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new Oe:new b);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new b,i=[],s=[],a=[],o=new b,l=new Se;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new b)}s[0]=new b,a[0]=new b;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos($e(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos($e(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let p=1;p<=e;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function yf(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=tu(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=Tf(r,e,s,t)),r.length>80*t){o=r[0],l=r[1];let h=o,u=l;for(let d=t;d<i;d+=t){const f=r[d],p=r[d+1];f<o&&(o=f),p<l&&(l=p),f>h&&(h=f),p>u&&(u=p)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return $s(s,a,t,o,l,c,0),a}function tu(r,e,t,n,i){let s;if(i===Uf(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=kc(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=kc(a/n|0,r[a],r[a+1],s);return s&&ms(s,s.next)&&(Js(s),s=s.next),s}function Ni(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(ms(t,t.next)||Et(t.prev,t,t.next)===0)){if(Js(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function $s(r,e,t,n,i,s,a){if(!r)return;!a&&s&&Pf(r,n,i,s);let o=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?Sf(r,n,i,s):Mf(r)){e.push(l.i,r.i,c.i),Js(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=bf(Ni(r),e),$s(r,e,t,n,i,s,2)):a===2&&wf(r,e,t,n,i,s):$s(Ni(r),e,t,n,i,s,1);break}}}function Mf(r){const e=r.prev,t=r,n=r.next;if(Et(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,s,a),u=Math.min(o,l,c),d=Math.max(i,s,a),f=Math.max(o,l,c);let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Us(i,o,s,l,a,c,p.x,p.y)&&Et(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Sf(r,e,t,n){const i=r.prev,s=r,a=r.next;if(Et(i,s,a)>=0)return!1;const o=i.x,l=s.x,c=a.x,h=i.y,u=s.y,d=a.y,f=Math.min(o,l,c),p=Math.min(h,u,d),_=Math.max(o,l,c),g=Math.max(h,u,d),m=al(f,p,e,t,n),S=al(_,g,e,t,n);let M=r.prevZ,v=r.nextZ;for(;M&&M.z>=m&&v&&v.z<=S;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=g&&M!==i&&M!==a&&Us(o,h,l,u,c,d,M.x,M.y)&&Et(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=f&&v.x<=_&&v.y>=p&&v.y<=g&&v!==i&&v!==a&&Us(o,h,l,u,c,d,v.x,v.y)&&Et(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=g&&M!==i&&M!==a&&Us(o,h,l,u,c,d,M.x,M.y)&&Et(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=S;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=g&&v!==i&&v!==a&&Us(o,h,l,u,c,d,v.x,v.y)&&Et(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function bf(r,e){let t=r;do{const n=t.prev,i=t.next.next;!ms(n,i)&&iu(n,t,t.next,i)&&Zs(n,i)&&Zs(i,n)&&(e.push(n.i,t.i,i.i),Js(t),Js(t.next),t=r=i),t=t.next}while(t!==r);return Ni(t)}function wf(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Df(a,o)){let l=su(a,o);a=Ni(a,a.next),l=Ni(l,l.next),$s(a,e,t,n,i,s,0),$s(l,e,t,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function Tf(r,e,t,n){const i=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=tu(r,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Lf(c))}i.sort(Ef);for(let s=0;s<i.length;s++)t=Af(i[s],t);return t}function Ef(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){const n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Af(r,e){const t=Cf(r,e);if(!t)return e;const n=su(t,r);return Ni(n,n.next),Ni(t,t.next)}function Cf(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;if(ms(r,t))return t;do{if(ms(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>s&&(s=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&nu(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);Zs(t,r)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Rf(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Rf(r,e){return Et(r.prev,r,e.prev)<0&&Et(e.next,r,r.next)<0}function Pf(r,e,t,n){let i=r;do i.z===0&&(i.z=al(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,If(i)}function If(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function al(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Lf(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function nu(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function Us(r,e,t,n,i,s,a,o){return!(r===a&&e===o)&&nu(r,e,t,n,i,s,a,o)}function Df(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!Ff(r,e)&&(Zs(r,e)&&Zs(e,r)&&Nf(r,e)&&(Et(r.prev,r,e.prev)||Et(r,e.prev,e))||ms(r,e)&&Et(r.prev,r,r.next)>0&&Et(e.prev,e,e.next)>0)}function Et(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function ms(r,e){return r.x===e.x&&r.y===e.y}function iu(r,e,t,n){const i=Fr(Et(r,e,t)),s=Fr(Et(r,e,n)),a=Fr(Et(t,n,r)),o=Fr(Et(t,n,e));return!!(i!==s&&a!==o||i===0&&Dr(r,t,e)||s===0&&Dr(r,n,e)||a===0&&Dr(t,r,n)||o===0&&Dr(t,e,n))}function Dr(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Fr(r){return r>0?1:r<0?-1:0}function Ff(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&iu(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Zs(r,e){return Et(r.prev,r,r.next)<0?Et(r,e,r.next)>=0&&Et(r,r.prev,e)>=0:Et(r,e,r.prev)<0||Et(r,r.next,e)<0}function Nf(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function su(r,e){const t=ol(r.i,r.x,r.y),n=ol(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function kc(r,e,t,n){const i=ol(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Js(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function ol(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Uf(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class Of{static triangulate(e,t,n=2){return yf(e,t,n)}}class Nl{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Nl.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Bc(e),zc(n,e);let a=e.length;t.forEach(Bc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,zc(n,t[l]);const o=Of.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Bc(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function zc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class ir extends xa{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ir(e.radius,e.detail)}}class sr extends mt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],p=[],_=[],g=[];for(let m=0;m<h;m++){const S=m*d-a;for(let M=0;M<c;M++){const v=M*u-s;p.push(v,-S,0),_.push(0,0,1),g.push(M/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<o;S++){const M=S+c*m,v=S+c*(m+1),E=S+1+c*(m+1),T=S+1+c*m;f.push(M,v,T),f.push(v,E,T)}this.setIndex(f),this.setAttribute("position",new it(p,3)),this.setAttribute("normal",new it(_,3)),this.setAttribute("uv",new it(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sr(e.width,e.height,e.widthSegments,e.heightSegments)}}class ya extends mt{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/i,f=new b,p=new Oe;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){const m=s+g/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,h.push(p.x,p.y)}u+=d}for(let _=0;_<i;_++){const g=_*(n+1);for(let m=0;m<n;m++){const S=m+g,M=S,v=S+n+1,E=S+n+2,T=S+1;o.push(M,v,T),o.push(v,E,T)}}this.setIndex(o),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ya(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Zt extends mt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new b,d=new b,f=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){const S=[],M=m/n,v=a+M*o,E=e*Math.cos(v),T=Math.sqrt(e*e-E*E);let w=0;m===0&&a===0?w=.5/t:m===n&&l===Math.PI&&(w=-.5/t);for(let x=0;x<=t;x++){const R=x/t,I=i+R*s;u.x=-T*Math.cos(I),u.y=E,u.z=T*Math.sin(I),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),g.push(R+w,1-M),S.push(c++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const M=h[m][S+1],v=h[m][S],E=h[m+1][S],T=h[m+1][S+1];(m!==0||a>0)&&f.push(M,v,T),(m!==n-1||l<Math.PI)&&f.push(v,E,T)}this.setIndex(f),this.setAttribute("position",new it(p,3)),this.setAttribute("normal",new it(_,3)),this.setAttribute("uv",new it(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ii extends mt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],d=new b,f=new b,p=new b;for(let _=0;_<=n;_++){const g=a+_/n*o;for(let m=0;m<=i;m++){const S=m/i*s;f.x=(e+t*Math.cos(g))*Math.cos(S),f.y=(e+t*Math.cos(g))*Math.sin(S),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(m/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=i;g++){const m=(i+1)*_+g-1,S=(i+1)*(_-1)+g-1,M=(i+1)*(_-1)+g,v=(i+1)*_+g;l.push(m,S,v),l.push(S,M,v)}this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ii(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function gs(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if(Vc(i))i.isRenderTargetTexture?(Ae("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Vc(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Qt(r){const e={};for(let t=0;t<r.length;t++){const n=gs(r[t]);for(const i in n)e[i]=n[i]}return e}function Vc(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function kf(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function ru(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ze.workingColorSpace}const Bf={clone:gs,merge:Qt};var zf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends xn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zf,this.fragmentShader=Vf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=gs(e.uniforms),this.uniformsGroups=kf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Me().setHex(i.value);break;case"v2":this.uniforms[n].value=new Oe().fromArray(i.value);break;case"v3":this.uniforms[n].value=new b().fromArray(i.value);break;case"v4":this.uniforms[n].value=new rt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Be().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Se().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Gf extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Xe extends xn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qs,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hn extends Xe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Nr extends xn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Me(16777215),this.specular=new Me(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qs,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=fa,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hf extends xn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qs,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=fa,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wf extends xn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=md,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Xf extends xn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Ur(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function qf(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Gc(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Kf(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class vs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Yf extends vs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:is,endingEnd:is}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case ss:s=e,o=2*t-n;break;case sa:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ss:a=e,l=2*n-t;break;case sa:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),_=p*p,g=_*p,m=-d*g+2*d*_-d*p,S=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*p+1,M=(-1-f)*g+(1.5+f)*_+.5*p,v=f*g-f*_;for(let E=0;E!==o;++E)s[E]=m*a[h+E]+S*a[c+E]+M*a[l+E]+v*a[u+E];return s}}class au extends vs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}}class $f extends vs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Zf extends vs{interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const p=(n-t)/(i-t),_=1-p;for(let g=0;g!==o;++g)s[g]=a[c+g]*_+a[l+g]*p;return s}const d=o*2,f=e-1;for(let p=0;p!==o;++p){const _=a[c+p],g=a[l+p],m=f*d+p*2,S=u[m],M=u[m+1],v=e*d+p*2,E=h[v],T=h[v+1];let w=(n-t)/(i-t),x,R,I,L,D;for(let H=0;H<8;H++){x=w*w,R=x*w,I=1-w,L=I*I,D=L*I;const O=D*t+3*L*w*S+3*I*x*E+R*i-n;if(Math.abs(O)<1e-10)break;const X=3*L*(S-t)+6*I*w*(E-S)+3*x*(i-E);if(Math.abs(X)<1e-10)break;w=w-O/X,w=Math.max(0,Math.min(1,w))}s[p]=D*_+3*L*w*M+3*I*x*T+R*g}return s}}class Rn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ur(t,this.TimeBufferType),this.values=Ur(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ur(e.times,Array),values:Ur(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new $f(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new au(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Yf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Zf(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ws:t=this.InterpolantFactoryMethodDiscrete;break;case Xs:t=this.InterpolantFactoryMethodLinear;break;case Aa:t=this.InterpolantFactoryMethodSmooth;break;case ac:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ae("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ws;case this.InterpolantFactoryMethodLinear:return Xs;case this.InterpolantFactoryMethodSmooth:return Aa;case this.InterpolantFactoryMethodBezier:return ac}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ue("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(Ue("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ue("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ue("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&wd(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ue("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Aa,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){const _=t[u+p];if(_!==t[d+p]||_!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Rn.prototype.ValueTypeName="";Rn.prototype.TimeBufferType=Float32Array;Rn.prototype.ValueBufferType=Float32Array;Rn.prototype.DefaultInterpolation=Xs;class ys extends Rn{constructor(e,t,n){super(e,t,n)}}ys.prototype.ValueTypeName="bool";ys.prototype.ValueBufferType=Array;ys.prototype.DefaultInterpolation=Ws;ys.prototype.InterpolantFactoryMethodLinear=void 0;ys.prototype.InterpolantFactoryMethodSmooth=void 0;class ou extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}ou.prototype.ValueTypeName="color";class _s extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}_s.prototype.ValueTypeName="number";class Jf extends vs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Dt.slerpFlat(s,0,a,c-o,a,c,l);return s}}class Ui extends Rn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Jf(this.times,this.values,this.getValueSize(),e)}}Ui.prototype.ValueTypeName="quaternion";Ui.prototype.InterpolantFactoryMethodSmooth=void 0;class Ms extends Rn{constructor(e,t,n){super(e,t,n)}}Ms.prototype.ValueTypeName="string";Ms.prototype.ValueBufferType=Array;Ms.prototype.DefaultInterpolation=Ws;Ms.prototype.InterpolantFactoryMethodLinear=void 0;Ms.prototype.InterpolantFactoryMethodSmooth=void 0;class xs extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}xs.prototype.ValueTypeName="vector";class js{constructor(e="",t=-1,n=[],i=Tl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=An(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Qf(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(Rn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=qf(l);l=Gc(l,1,h),c=Gc(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new _s(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function jf(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return _s;case"vector":case"vector2":case"vector3":case"vector4":return xs;case"color":return ou;case"quaternion":return Ui;case"bool":case"boolean":return ys;case"string":return Ms}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Qf(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=jf(r.type);if(r.times===void 0){const t=[],n=[];Kf(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Zn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(Hc(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!Hc(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function Hc(r){try{const e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class ep{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const tp=new ep;class ni{constructor(e){this.manager=e!==void 0?e:tp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ni.DEFAULT_MATERIAL_NAME="__DEFAULT";const $n={};class np extends Error{constructor(e,t){super(e),this.response=t}}class Ul extends ni{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Zn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if($n[e]!==void 0){$n[e].push({onLoad:t,onProgress:n,onError:i});return}$n[e]=[],$n[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ae("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=$n[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let _=0;const g=new ReadableStream({start(m){S();function S(){u.read().then(({done:M,value:v})=>{if(M)m.close();else{_+=v.byteLength;const E=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let T=0,w=h.length;T<w;T++){const x=h[T];x.onProgress&&x.onProgress(E)}m.enqueue(v),S()}},M=>{m.error(M)})}}});return new Response(g)}else throw new np(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Zn.add(`file:${e}`,c);const h=$n[e];delete $n[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=$n[e];if(h===void 0)throw this.manager.itemError(e),c;delete $n[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ji=new WeakMap;class ip extends ni{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Zn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=Ji.get(a);u===void 0&&(u=[],Ji.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=Ys("img");function l(){h(),t&&t(this);const u=Ji.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}Ji.delete(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),Zn.remove(`image:${e}`);const d=Ji.get(this)||[];for(let f=0;f<d.length;f++){const p=d[f];p.onError&&p.onError(u)}Ji.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Zn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class lu extends ni{constructor(e){super(e)}load(e,t,n,i){const s=new kt,a=new ip(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class rr extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class sp extends rr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Qa=new Se,Wc=new b,Xc=new b;class Ol{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new Se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fl,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Wc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wc),Xc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xc),t.updateMatrixWorld(),Qa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qa,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ks||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Qa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Or=new b,kr=new Dt,Dn=new b;class cu extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Se,this.projectionMatrix=new Se,this.projectionMatrixInverse=new Se,this.coordinateSystem=kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Or,kr,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Or,kr,Dn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Or,kr,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Or,kr,Dn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const di=new b,qc=new Oe,Kc=new Oe;class $t extends cu{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ks*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,qc,Kc),t.subVectors(Kc,qc)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ks*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class rp extends Ol{constructor(){super(new $t(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=fs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class hu extends rr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new rp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class ap extends Ol{constructor(){super(new $t(90,1,.5,500)),this.isPointLightShadow=!0}}class sn extends rr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ap}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ma extends cu{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class op extends Ol{constructor(){super(new Ma(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qs extends rr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new op}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class kl extends rr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class cs{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const eo=new WeakMap;class lp extends ni{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ae("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ae("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Zn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{eo.has(a)===!0?(i&&i(eo.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){Zn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e)}).catch(function(c){i&&i(c),eo.set(l,c),Zn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Zn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ji=-90,Qi=1;class cp extends pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new $t(ji,Qi,e,t);i.layers=this.layers,this.add(i);const s=new $t(ji,Qi,e,t);s.layers=this.layers,this.add(s);const a=new $t(ji,Qi,e,t);a.layers=this.layers,this.add(a);const o=new $t(ji,Qi,e,t);o.layers=this.layers,this.add(o);const l=new $t(ji,Qi,e,t);l.layers=this.layers,this.add(l);const c=new $t(ji,Qi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===kn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class hp extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class up{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[s+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Dt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const a=this._workIndex*s;Dt.multiplyQuaternionsFlat(e,a,e,t,e,n),Dt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){const a=1-i;for(let o=0;o!==s;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const Bl="\\[\\]\\.:\\/",dp=new RegExp("["+Bl+"]","g"),zl="[^"+Bl+"]",fp="[^"+Bl.replace("\\.","")+"]",pp=/((?:WC+[\/:])*)/.source.replace("WC",zl),mp=/(WCOD+)?/.source.replace("WCOD",fp),gp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",zl),_p=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",zl),xp=new RegExp("^"+pp+mp+gp+_p+"$"),vp=["material","materials","bones","map"];class yp{constructor(e,t,n){const i=n||nt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class nt{constructor(e,t,n){this.path=t,this.parsedPath=n||nt.parseTrackName(t),this.node=nt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new nt.Composite(e,t,n):new nt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(dp,"")}static parseTrackName(e){const t=xp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);vp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=nt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ae("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}nt.Composite=yp;nt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};nt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};nt.prototype.GetterByBindingType=[nt.prototype._getValue_direct,nt.prototype._getValue_array,nt.prototype._getValue_arrayElement,nt.prototype._getValue_toArray];nt.prototype.SetterByBindingTypeAndVersioning=[[nt.prototype._setValue_direct,nt.prototype._setValue_direct_setNeedsUpdate,nt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_array,nt.prototype._setValue_array_setNeedsUpdate,nt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_arrayElement,nt.prototype._setValue_arrayElement_setNeedsUpdate,nt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_fromArray,nt.prototype._setValue_fromArray_setNeedsUpdate,nt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Mp{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,a=s.length,o=new Array(a),l={endingStart:is,endingEnd:is};for(let c=0;c!==a;++c){const h=s[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=ud,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,s=e._clip.duration,a=s/i,o=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case fd:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Tl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const a=n===dd;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===ia){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=ss,i.endingEnd=ss):(e?i.endingStart=this.zeroSlopeAtStart?ss:is:i.endingStart=sa,t?i.endingEnd=this.zeroSlopeAtEnd?ss:is:i.endingEnd=sa)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=n,this}}const Sp=new Float32Array(1);class Vl extends Mi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==s;++u){const d=i[u],f=d.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[u]=p;else{if(p=a[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const _=t&&t._propertyBindings[u].binding.parsedPath;p=new up(nt.create(n,f,_),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[u]=p}o[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new au(new Float32Array(2),new Float32Array(2),1,Sp),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let a=typeof e=="string"?js.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Tl),l!==void 0){const u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Mp(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?js.findByName(n,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const Yc=new Se;class er{constructor(e,t,n=0,i=1/0){this.ray=new nr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Pl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ue("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yc),this}intersectObject(e,t=!0,n=[]){return ll(e,this,n,t),n.sort($c),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)ll(e[i],this,n,t);return n.sort($c),n}}function $c(r,e){return r.distance-e.distance}function ll(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)ll(s[a],e,t,!0)}}const ql=class ql{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};ql.prototype.isMatrix2=!0;let Zc=ql;const fi=new b,Br=new Se,to=new Se;class bp extends jh{constructor(e){const t=uu(e),n=new mt,i=[],s=[];for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(0,0,0),s.push(0,0,0))}n.setAttribute("position",new it(i,3)),n.setAttribute("color",new it(s,3));const a=new ga({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;const o=new Me(255),l=new Me(65280);this.setColors(o,l)}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");to.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const o=t[s];o.parent&&o.parent.isBone&&(Br.multiplyMatrices(to,o.matrixWorld),fi.setFromMatrixPosition(Br),i.setXYZ(a,fi.x,fi.y,fi.z),Br.multiplyMatrices(to,o.parent.matrixWorld),fi.setFromMatrixPosition(Br),i.setXYZ(a+1,fi.x,fi.y,fi.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){const i=this.geometry.getAttribute("color");for(let s=0;s<i.count;s+=2)i.setXYZ(s,e.r,e.g,e.b),i.setXYZ(s+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function uu(r){const e=[];r.isBone===!0&&e.push(r);for(let t=0;t<r.children.length;t++)e.push(...uu(r.children[t]));return e}function Jc(r,e,t,n){const i=wp(n);switch(t){case Hh:return r*e;case Ml:return r*e/i.components*i.byteLength;case Sl:return r*e/i.components*i.byteLength;case Di:return r*e*2/i.components*i.byteLength;case bl:return r*e*2/i.components*i.byteLength;case Wh:return r*e*3/i.components*i.byteLength;case _n:return r*e*4/i.components*i.byteLength;case wl:return r*e*4/i.components*i.byteLength;case Yr:case $r:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Zr:case Jr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ao:case Ro:return Math.max(r,16)*Math.max(e,8)/4;case Eo:case Co:return Math.max(r,8)*Math.max(e,8)/2;case Po:case Io:case Do:case Fo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Lo:case ta:case No:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Oo:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case ko:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case zo:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Go:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Ho:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Wo:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Xo:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case qo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Ko:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case $o:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Zo:case Jo:case jo:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Qo:case el:return Math.ceil(r/4)*Math.ceil(e/4)*8;case na:case tl:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function wp(r){switch(r){case cn:case Bh:return{byteLength:1,components:1};case Gs:case zh:case ei:return{byteLength:2,components:1};case vl:case yl:return{byteLength:2,components:4};case Vn:case xl:case gn:return{byteLength:4,components:1};case Vh:case Gh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gl}}));typeof window<"u"&&(window.__THREE__?Ae("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function du(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Tp(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const _=u[f];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var Ep=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ap=`#ifdef USE_ALPHAHASH
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
#endif`,Cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lp=`#ifdef USE_AOMAP
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
#endif`,Dp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fp=`#ifdef USE_BATCHING
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
#endif`,Np=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Up=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Op=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Bp=`#ifdef USE_IRIDESCENCE
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
#endif`,zp=`#ifdef USE_BUMPMAP
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
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Kp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Yp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,$p=`#define PI 3.141592653589793
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
} // validated`,Zp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Jp=`vec3 transformedNormal = objectNormal;
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
#endif`,jp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,em=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nm="gl_FragColor = linearToOutputTexel( gl_FragColor );",im=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,sm=`#ifdef USE_ENVMAP
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
#endif`,rm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,am=`#ifdef USE_ENVMAP
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
#endif`,om=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lm=`#ifdef USE_ENVMAP
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
#endif`,cm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,um=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fm=`#ifdef USE_GRADIENTMAP
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
}`,pm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_m=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,xm=`#ifdef USE_ENVMAP
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
#endif`,vm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bm=`PhysicalMaterial material;
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
#endif`,wm=`uniform sampler2D dfgLUT;
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
}`,Tm=`
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
#endif`,Em=`#if defined( RE_IndirectDiffuse )
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
#endif`,Am=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cm=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Rm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Im=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Dm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Um=`#if defined( USE_POINTS_UV )
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
#endif`,Om=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,km=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gm=`#ifdef USE_MORPHTARGETS
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
#endif`,Hm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Xm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ym=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$m=`#ifdef USE_NORMALMAP
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
#endif`,Zm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ng=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ig=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ag=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,og=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ug=`float getShadowMask() {
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
}`,dg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fg=`#ifdef USE_SKINNING
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
#endif`,pg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mg=`#ifdef USE_SKINNING
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
#endif`,gg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_g=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yg=`#ifdef USE_TRANSMISSION
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
#endif`,Mg=`#ifdef USE_TRANSMISSION
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
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ag=`uniform sampler2D t2D;
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
}`,Cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ig=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`#include <common>
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
}`,Dg=`#if DEPTH_PACKING == 3200
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
}`,Fg=`#define DISTANCE
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
}`,Ng=`#define DISTANCE
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
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Og=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kg=`uniform float scale;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,zg=`#include <common>
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
}`,Vg=`uniform vec3 diffuse;
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
}`,Gg=`#define LAMBERT
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
}`,Hg=`#define LAMBERT
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
}`,Wg=`#define MATCAP
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
}`,Xg=`#define MATCAP
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
}`,qg=`#define NORMAL
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
}`,Kg=`#define NORMAL
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
}`,Yg=`#define PHONG
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
}`,$g=`#define PHONG
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
}`,Zg=`#define STANDARD
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
}`,Jg=`#define STANDARD
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
}`,jg=`#define TOON
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
}`,Qg=`#define TOON
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
}`,e0=`uniform float size;
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
}`,t0=`uniform vec3 diffuse;
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
}`,n0=`#include <common>
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
}`,i0=`uniform vec3 color;
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
}`,s0=`uniform float rotation;
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
}`,r0=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:Ep,alphahash_pars_fragment:Ap,alphamap_fragment:Cp,alphamap_pars_fragment:Rp,alphatest_fragment:Pp,alphatest_pars_fragment:Ip,aomap_fragment:Lp,aomap_pars_fragment:Dp,batching_pars_vertex:Fp,batching_vertex:Np,begin_vertex:Up,beginnormal_vertex:Op,bsdfs:kp,iridescence_fragment:Bp,bumpmap_pars_fragment:zp,clipping_planes_fragment:Vp,clipping_planes_pars_fragment:Gp,clipping_planes_pars_vertex:Hp,clipping_planes_vertex:Wp,color_fragment:Xp,color_pars_fragment:qp,color_pars_vertex:Kp,color_vertex:Yp,common:$p,cube_uv_reflection_fragment:Zp,defaultnormal_vertex:Jp,displacementmap_pars_vertex:jp,displacementmap_vertex:Qp,emissivemap_fragment:em,emissivemap_pars_fragment:tm,colorspace_fragment:nm,colorspace_pars_fragment:im,envmap_fragment:sm,envmap_common_pars_fragment:rm,envmap_pars_fragment:am,envmap_pars_vertex:om,envmap_physical_pars_fragment:xm,envmap_vertex:lm,fog_vertex:cm,fog_pars_vertex:hm,fog_fragment:um,fog_pars_fragment:dm,gradientmap_pars_fragment:fm,lightmap_pars_fragment:pm,lights_lambert_fragment:mm,lights_lambert_pars_fragment:gm,lights_pars_begin:_m,lights_toon_fragment:vm,lights_toon_pars_fragment:ym,lights_phong_fragment:Mm,lights_phong_pars_fragment:Sm,lights_physical_fragment:bm,lights_physical_pars_fragment:wm,lights_fragment_begin:Tm,lights_fragment_maps:Em,lights_fragment_end:Am,lightprobes_pars_fragment:Cm,logdepthbuf_fragment:Rm,logdepthbuf_pars_fragment:Pm,logdepthbuf_pars_vertex:Im,logdepthbuf_vertex:Lm,map_fragment:Dm,map_pars_fragment:Fm,map_particle_fragment:Nm,map_particle_pars_fragment:Um,metalnessmap_fragment:Om,metalnessmap_pars_fragment:km,morphinstance_vertex:Bm,morphcolor_vertex:zm,morphnormal_vertex:Vm,morphtarget_pars_vertex:Gm,morphtarget_vertex:Hm,normal_fragment_begin:Wm,normal_fragment_maps:Xm,normal_pars_fragment:qm,normal_pars_vertex:Km,normal_vertex:Ym,normalmap_pars_fragment:$m,clearcoat_normal_fragment_begin:Zm,clearcoat_normal_fragment_maps:Jm,clearcoat_pars_fragment:jm,iridescence_pars_fragment:Qm,opaque_fragment:eg,packing:tg,premultiplied_alpha_fragment:ng,project_vertex:ig,dithering_fragment:sg,dithering_pars_fragment:rg,roughnessmap_fragment:ag,roughnessmap_pars_fragment:og,shadowmap_pars_fragment:lg,shadowmap_pars_vertex:cg,shadowmap_vertex:hg,shadowmask_pars_fragment:ug,skinbase_vertex:dg,skinning_pars_vertex:fg,skinning_vertex:pg,skinnormal_vertex:mg,specularmap_fragment:gg,specularmap_pars_fragment:_g,tonemapping_fragment:xg,tonemapping_pars_fragment:vg,transmission_fragment:yg,transmission_pars_fragment:Mg,uv_pars_fragment:Sg,uv_pars_vertex:bg,uv_vertex:wg,worldpos_vertex:Tg,background_vert:Eg,background_frag:Ag,backgroundCube_vert:Cg,backgroundCube_frag:Rg,cube_vert:Pg,cube_frag:Ig,depth_vert:Lg,depth_frag:Dg,distance_vert:Fg,distance_frag:Ng,equirect_vert:Ug,equirect_frag:Og,linedashed_vert:kg,linedashed_frag:Bg,meshbasic_vert:zg,meshbasic_frag:Vg,meshlambert_vert:Gg,meshlambert_frag:Hg,meshmatcap_vert:Wg,meshmatcap_frag:Xg,meshnormal_vert:qg,meshnormal_frag:Kg,meshphong_vert:Yg,meshphong_frag:$g,meshphysical_vert:Zg,meshphysical_frag:Jg,meshtoon_vert:jg,meshtoon_frag:Qg,points_vert:e0,points_frag:t0,shadow_vert:n0,shadow_frag:i0,sprite_vert:s0,sprite_frag:r0},ge={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new b},probesMax:{value:new b},probesResolution:{value:new b}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},Un={basic:{uniforms:Qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Me(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Qt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Qt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Me(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Qt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Qt([ge.points,ge.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Qt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Qt([ge.common,ge.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Qt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Qt([ge.sprite,ge.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Qt([ge.common,ge.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Qt([ge.lights,ge.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Un.physical={uniforms:Qt([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const zr={r:0,b:0,g:0},a0=new Se,fu=new Be;fu.set(-1,0,0,0,1,0,0,0,1);function o0(r,e,t,n,i,s){const a=new Me(0);let o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let M=S.isScene===!0?S.background:null;if(M&&M.isTexture){const v=S.backgroundBlurriness>0;M=e.get(M,v)}return M}function p(S){let M=!1;const v=f(S);v===null?g(a,o):v&&v.isColor&&(g(v,1),M=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(S,M){const v=f(M);v&&(v.isCubeTexture||v.mapping===pa)?(c===void 0&&(c=new ee(new ke(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:gs(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(a0.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(fu),c.material.toneMapped=ze.getTransfer(v.colorSpace)!==ut,(h!==v||u!==v.version||d!==r.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ee(new sr(2,2),new Cn({name:"BackgroundMaterial",uniforms:gs(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ze.getTransfer(v.colorSpace)!==ut,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==r.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=r.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,M){S.getRGB(zr,ru(r)),t.buffers.color.setClear(zr.r,zr.g,zr.b,M,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,M=1){a.set(S),o=M,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:p,addToRenderList:_,dispose:m}}function l0(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,a=!1;function o(L,D,H,Y,O){let X=!1;const B=u(L,Y,H,D);s!==B&&(s=B,c(s.object)),X=f(L,Y,H,O),X&&p(L,Y,H,O),O!==null&&e.update(O,r.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(L,D,H,Y),O!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return r.createVertexArray()}function c(L){return r.bindVertexArray(L)}function h(L){return r.deleteVertexArray(L)}function u(L,D,H,Y){const O=Y.wireframe===!0;let X=n[D.id];X===void 0&&(X={},n[D.id]=X);const B=L.isInstancedMesh===!0?L.id:0;let Q=X[B];Q===void 0&&(Q={},X[B]=Q);let ne=Q[H.id];ne===void 0&&(ne={},Q[H.id]=ne);let fe=ne[O];return fe===void 0&&(fe=d(l()),ne[O]=fe),fe}function d(L){const D=[],H=[],Y=[];for(let O=0;O<t;O++)D[O]=0,H[O]=0,Y[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:Y,object:L,attributes:{},index:null}}function f(L,D,H,Y){const O=s.attributes,X=D.attributes;let B=0;const Q=H.getAttributes();for(const ne in Q)if(Q[ne].location>=0){const de=O[ne];let ye=X[ne];if(ye===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(ye=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(ye=L.instanceColor)),de===void 0||de.attribute!==ye||ye&&de.data!==ye.data)return!0;B++}return s.attributesNum!==B||s.index!==Y}function p(L,D,H,Y){const O={},X=D.attributes;let B=0;const Q=H.getAttributes();for(const ne in Q)if(Q[ne].location>=0){let de=X[ne];de===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(de=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(de=L.instanceColor));const ye={};ye.attribute=de,de&&de.data&&(ye.data=de.data),O[ne]=ye,B++}s.attributes=O,s.attributesNum=B,s.index=Y}function _(){const L=s.newAttributes;for(let D=0,H=L.length;D<H;D++)L[D]=0}function g(L){m(L,0)}function m(L,D){const H=s.newAttributes,Y=s.enabledAttributes,O=s.attributeDivisors;H[L]=1,Y[L]===0&&(r.enableVertexAttribArray(L),Y[L]=1),O[L]!==D&&(r.vertexAttribDivisor(L,D),O[L]=D)}function S(){const L=s.newAttributes,D=s.enabledAttributes;for(let H=0,Y=D.length;H<Y;H++)D[H]!==L[H]&&(r.disableVertexAttribArray(H),D[H]=0)}function M(L,D,H,Y,O,X,B){B===!0?r.vertexAttribIPointer(L,D,H,O,X):r.vertexAttribPointer(L,D,H,Y,O,X)}function v(L,D,H,Y){_();const O=Y.attributes,X=H.getAttributes(),B=D.defaultAttributeValues;for(const Q in X){const ne=X[Q];if(ne.location>=0){let fe=O[Q];if(fe===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(fe=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(fe=L.instanceColor)),fe!==void 0){const de=fe.normalized,ye=fe.itemSize,qe=e.get(fe);if(qe===void 0)continue;const Ze=qe.buffer,Fe=qe.type,J=qe.bytesPerElement,re=Fe===r.INT||Fe===r.UNSIGNED_INT||fe.gpuType===xl;if(fe.isInterleavedBufferAttribute){const te=fe.data,Le=te.stride,Ne=fe.offset;if(te.isInstancedInterleavedBuffer){for(let Ce=0;Ce<ne.locationSize;Ce++)m(ne.location+Ce,te.meshPerAttribute);L.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ce=0;Ce<ne.locationSize;Ce++)g(ne.location+Ce);r.bindBuffer(r.ARRAY_BUFFER,Ze);for(let Ce=0;Ce<ne.locationSize;Ce++)M(ne.location+Ce,ye/ne.locationSize,Fe,de,Le*J,(Ne+ye/ne.locationSize*Ce)*J,re)}else{if(fe.isInstancedBufferAttribute){for(let te=0;te<ne.locationSize;te++)m(ne.location+te,fe.meshPerAttribute);L.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let te=0;te<ne.locationSize;te++)g(ne.location+te);r.bindBuffer(r.ARRAY_BUFFER,Ze);for(let te=0;te<ne.locationSize;te++)M(ne.location+te,ye/ne.locationSize,Fe,de,ye*J,ye/ne.locationSize*te*J,re)}}else if(B!==void 0){const de=B[Q];if(de!==void 0)switch(de.length){case 2:r.vertexAttrib2fv(ne.location,de);break;case 3:r.vertexAttrib3fv(ne.location,de);break;case 4:r.vertexAttrib4fv(ne.location,de);break;default:r.vertexAttrib1fv(ne.location,de)}}}}S()}function E(){R();for(const L in n){const D=n[L];for(const H in D){const Y=D[H];for(const O in Y){const X=Y[O];for(const B in X)h(X[B].object),delete X[B];delete Y[O]}}delete n[L]}}function T(L){if(n[L.id]===void 0)return;const D=n[L.id];for(const H in D){const Y=D[H];for(const O in Y){const X=Y[O];for(const B in X)h(X[B].object),delete X[B];delete Y[O]}}delete n[L.id]}function w(L){for(const D in n){const H=n[D];for(const Y in H){const O=H[Y];if(O[L.id]===void 0)continue;const X=O[L.id];for(const B in X)h(X[B].object),delete X[B];delete O[L.id]}}}function x(L){for(const D in n){const H=n[D],Y=L.isInstancedMesh===!0?L.id:0,O=H[Y];if(O!==void 0){for(const X in O){const B=O[X];for(const Q in B)h(B[Q].object),delete B[Q];delete O[X]}delete H[Y],Object.keys(H).length===0&&delete n[D]}}}function R(){I(),a=!0,s!==i&&(s=i,c(s.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:R,resetDefaultState:I,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:g,disableUnusedAttributes:S}}function c0(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function h0(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(w){return!(w!==_n&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const x=w===ei&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==cn&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==gn&&!x)}function l(w){if(w==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ae("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ae("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),S=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),M=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),T=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:v,maxSamples:E,samples:T}}function u0(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Ci,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,m=r.get(u);if(!i||p===null||p.length===0||s&&!g)s?h(null):c();else{const S=s?0:n,M=S*4;let v=m.clippingState||null;l.value=v,v=h(p,d,M,f);for(let E=0;E!==M;++E)v[E]=t[E];m.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,p!==!0||g===null){const m=f+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,v=f;M!==_;++M,v+=4)a.copy(u[M]).applyMatrix4(S,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}const vi=4,jc=[.125,.215,.35,.446,.526,.582],Pi=20,d0=256,Is=new Ma,Qc=new Me;let no=null,io=0,so=0,ro=!1;const f0=new b;class eh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=f0}=s;no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ro=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(no,io,so),this._renderer.xr.enabled=ro,e.scissorTest=!1,es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Li||e.mapping===ds?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ro=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:ei,format:_n,colorSpace:hn,depthBuffer:!1},i=th(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=th(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=p0(s)),this._blurMaterial=g0(s,e,t),this._ggxMaterial=m0(s,e,t)}return i}_compileMaterial(e){const t=new ee(new mt,e);this._renderer.compile(t,Is)}_sceneToCubeUV(e,t,n,i,s){const l=new $t(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Qc),u.toneMapping=Bn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ee(new ke,new Mt({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let m=!1;const S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,m=!0):(g.color.copy(Qc),m=!0);for(let M=0;M<6;M++){const v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[M]));const E=this._cubeSize;es(i,v*E,M>2?E:0,E,E),u.setRenderTarget(i),m&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Li||e.mapping===ds;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nh());const s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;es(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Is)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,_=this._sizeLods[n],g=3*_*(n>p-vi?n-p+vi:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,es(s,g,m,3*_,2*_),i.setRenderTarget(s),i.render(o,Is),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-n,es(e,g,m,3*_,2*_),i.setRenderTarget(e),i.render(o,Is)}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ue("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Pi-1),_=s/p,g=isFinite(s)?1+Math.floor(h*_):Pi;g>Pi&&Ae(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Pi}`);const m=[];let S=0;for(let w=0;w<Pi;++w){const x=w/_,R=Math.exp(-x*x/2);m.push(R),w===0?S+=R:w<g&&(S+=2*R)}for(let w=0;w<m.length;w++)m[w]=m[w]/S;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=p,d.mipInt.value=M-n;const v=this._sizeLods[i],E=3*v*(i>M-vi?i-M+vi:0),T=4*(this._cubeSize-v);es(t,E,T,3*v,2*v),l.setRenderTarget(t),l.render(u,Is)}}function p0(r){const e=[],t=[],n=[];let i=r;const s=r-vi+1+jc.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>r-vi?l=jc[a-r+vi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,g=2,m=1,S=new Float32Array(_*p*f),M=new Float32Array(g*p*f),v=new Float32Array(m*p*f);for(let T=0;T<f;T++){const w=T%3*2/3-1,x=T>2?0:-1,R=[w,x,0,w+2/3,x,0,w+2/3,x+1,0,w,x,0,w+2/3,x+1,0,w,x+1,0];S.set(R,_*p*T),M.set(d,g*p*T);const I=[T,T,T,T,T,T];v.set(I,m*p*T)}const E=new mt;E.setAttribute("position",new ot(S,_)),E.setAttribute("uv",new ot(M,g)),E.setAttribute("faceIndex",new ot(v,m)),n.push(new ee(E,null)),i>vi&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function th(r,e,t){const n=new zn(r,e,t);return n.texture.mapping=pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function es(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function m0(r,e,t){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:d0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sa(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function g0(r,e,t){const n=new Float32Array(Pi),i=new b(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:Pi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Sa(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function nh(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sa(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function ih(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Sa(){return`

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
	`}class pu extends zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Qh(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ke(5,5,5),s=new Cn({name:"CubemapFromEquirect",uniforms:gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Jn});s.uniforms.tEquirect.value=t;const a=new ee(i,s),o=t.minFilter;return t.minFilter===On&&(t.minFilter=Ot),new cp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}function _0(r){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):s(d)}function s(d){if(d&&d.isTexture){const f=d.mapping;if(f===qr||f===Ea)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new pu(p.height);return _.fromEquirectangularTexture(r,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===qr||f===Ea,_=f===Li||f===ds;if(p||_){let g=t.get(d);const m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new eh(r)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const S=d.image;return p&&S&&S.height>0||_&&S&&l(S)?(n===null&&(n=new eh(r)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===qr?d.mapping=Li:f===Ea&&(d.mapping=ds),d}function l(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function x0(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&os("WebGLRenderer: "+n+" extension not supported."),i}}}function v0(r,e,t,n){const i={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete i[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],r.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const S=f.array;_=f.version;for(let M=0,v=S.length;M<v;M+=3){const E=S[M+0],T=S[M+1],w=S[M+2];d.push(E,T,T,w,w,E)}}else{const S=p.array;_=p.version;for(let M=0,v=S.length/3-1;M<v;M+=3){const E=M+0,T=M+1,w=M+2;d.push(E,T,T,w,w,E)}}const g=new(p.count>=65535?$h:Il)(d,1);g.version=_;const m=s.get(u);m&&e.remove(m),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function y0(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,d){r.drawElements(n,d,s,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(r.drawElementsInstanced(n,d,s,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,f);let _=0;for(let g=0;g<f;g++)_+=d[g];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function M0(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function S0(r,e,t){const n=new WeakMap,i=new rt;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let I=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",I)};var f=I;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;p===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let E=o.attributes.position.count*v,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const w=new Float32Array(E*T*4*u),x=new Kh(w,E,T,u);x.type=gn,x.needsUpdate=!0;const R=v*4;for(let L=0;L<u;L++){const D=m[L],H=S[L],Y=M[L],O=E*T*4*L;for(let X=0;X<D.count;X++){const B=X*R;p===!0&&(i.fromBufferAttribute(D,X),w[O+B+0]=i.x,w[O+B+1]=i.y,w[O+B+2]=i.z,w[O+B+3]=0),_===!0&&(i.fromBufferAttribute(H,X),w[O+B+4]=i.x,w[O+B+5]=i.y,w[O+B+6]=i.z,w[O+B+7]=0),g===!0&&(i.fromBufferAttribute(Y,X),w[O+B+8]=i.x,w[O+B+9]=i.y,w[O+B+10]=i.z,w[O+B+11]=Y.itemSize===4?i.w:1)}}d={count:u,texture:x,size:new Oe(E,T)},n.set(o,d),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function b0(r,e,t,n,i){let s=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const w0={[Ih]:"LINEAR_TONE_MAPPING",[Lh]:"REINHARD_TONE_MAPPING",[Dh]:"CINEON_TONE_MAPPING",[_l]:"ACES_FILMIC_TONE_MAPPING",[Nh]:"AGX_TONE_MAPPING",[Uh]:"NEUTRAL_TONE_MAPPING",[Fh]:"CUSTOM_TONE_MAPPING"};function T0(r,e,t,n,i,s){const a=new zn(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,depthTexture:i?new ps(e,t):void 0}),o=new zn(e,t,{type:ei,depthBuffer:!1,stencilBuffer:!1}),l=new mt;l.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new it([0,2,0,0,2,0],2));const c=new Gf({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new ee(l,c),u=new Ma(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,g=null,m=[],S=!1;this.setSize=function(M,v){a.setSize(M,v),o.setSize(M,v);for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(M,v)}},this.setEffects=function(M){m=M,S=m.length>0&&m[0].isRenderPass===!0;const v=a.width,E=a.height;for(let T=0;T<m.length;T++){const w=m[T];w.setSize&&w.setSize(v,E)}},this.begin=function(M,v){if(p||M.toneMapping===Bn&&m.length===0)return!1;if(g=v,v!==null){const E=v.width,T=v.height;(a.width!==E||a.height!==T)&&this.setSize(E,T)}return S===!1&&M.setRenderTarget(a),_=M.toneMapping,M.toneMapping=Bn,!0},this.hasRenderPass=function(){return S},this.end=function(M,v){M.toneMapping=_,p=!0;let E=a,T=o;for(let w=0;w<m.length;w++){const x=m[w];if(x.enabled!==!1&&(x.render(M,T,E,v),x.needsSwap!==!1)){const R=E;E=T,T=R}}if(d!==M.outputColorSpace||f!==M.toneMapping){d=M.outputColorSpace,f=M.toneMapping,c.defines={},ze.getTransfer(d)===ut&&(c.defines.SRGB_TRANSFER="");const w=w0[f];w&&(c.defines[w]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,M.setRenderTarget(g),M.render(h,u),g=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const mu=new kt,cl=new ps(1,1),gu=new Kh,_u=new $d,xu=new Qh,sh=[],rh=[],ah=new Float32Array(16),oh=new Float32Array(9),lh=new Float32Array(4);function Ss(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=sh[i];if(s===void 0&&(s=new Float32Array(i),sh[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function zt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Vt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ba(r,e){let t=rh[e];t===void 0&&(t=new Int32Array(e),rh[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function E0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function A0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2fv(this.addr,e),Vt(t,e)}}function C0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;r.uniform3fv(this.addr,e),Vt(t,e)}}function R0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4fv(this.addr,e),Vt(t,e)}}function P0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(zt(t,n))return;lh.set(n),r.uniformMatrix2fv(this.addr,!1,lh),Vt(t,n)}}function I0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(zt(t,n))return;oh.set(n),r.uniformMatrix3fv(this.addr,!1,oh),Vt(t,n)}}function L0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(zt(t,n))return;ah.set(n),r.uniformMatrix4fv(this.addr,!1,ah),Vt(t,n)}}function D0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function F0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2iv(this.addr,e),Vt(t,e)}}function N0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;r.uniform3iv(this.addr,e),Vt(t,e)}}function U0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4iv(this.addr,e),Vt(t,e)}}function O0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function k0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;r.uniform2uiv(this.addr,e),Vt(t,e)}}function B0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;r.uniform3uiv(this.addr,e),Vt(t,e)}}function z0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;r.uniform4uiv(this.addr,e),Vt(t,e)}}function V0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(cl.compareFunction=t.isReversedDepthBuffer()?Al:El,s=cl):s=mu,t.setTexture2D(e||s,i)}function G0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||_u,i)}function H0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||xu,i)}function W0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||gu,i)}function X0(r){switch(r){case 5126:return E0;case 35664:return A0;case 35665:return C0;case 35666:return R0;case 35674:return P0;case 35675:return I0;case 35676:return L0;case 5124:case 35670:return D0;case 35667:case 35671:return F0;case 35668:case 35672:return N0;case 35669:case 35673:return U0;case 5125:return O0;case 36294:return k0;case 36295:return B0;case 36296:return z0;case 35678:case 36198:case 36298:case 36306:case 35682:return V0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return H0;case 36289:case 36303:case 36311:case 36292:return W0}}function q0(r,e){r.uniform1fv(this.addr,e)}function K0(r,e){const t=Ss(e,this.size,2);r.uniform2fv(this.addr,t)}function Y0(r,e){const t=Ss(e,this.size,3);r.uniform3fv(this.addr,t)}function $0(r,e){const t=Ss(e,this.size,4);r.uniform4fv(this.addr,t)}function Z0(r,e){const t=Ss(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function J0(r,e){const t=Ss(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function j0(r,e){const t=Ss(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Q0(r,e){r.uniform1iv(this.addr,e)}function e_(r,e){r.uniform2iv(this.addr,e)}function t_(r,e){r.uniform3iv(this.addr,e)}function n_(r,e){r.uniform4iv(this.addr,e)}function i_(r,e){r.uniform1uiv(this.addr,e)}function s_(r,e){r.uniform2uiv(this.addr,e)}function r_(r,e){r.uniform3uiv(this.addr,e)}function a_(r,e){r.uniform4uiv(this.addr,e)}function o_(r,e,t){const n=this.cache,i=e.length,s=ba(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Vt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=cl:a=mu;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function l_(r,e,t){const n=this.cache,i=e.length,s=ba(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Vt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||_u,s[a])}function c_(r,e,t){const n=this.cache,i=e.length,s=ba(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Vt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||xu,s[a])}function h_(r,e,t){const n=this.cache,i=e.length,s=ba(t,i);zt(n,s)||(r.uniform1iv(this.addr,s),Vt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||gu,s[a])}function u_(r){switch(r){case 5126:return q0;case 35664:return K0;case 35665:return Y0;case 35666:return $0;case 35674:return Z0;case 35675:return J0;case 35676:return j0;case 5124:case 35670:return Q0;case 35667:case 35671:return e_;case 35668:case 35672:return t_;case 35669:case 35673:return n_;case 5125:return i_;case 36294:return s_;case 36295:return r_;case 36296:return a_;case 35678:case 36198:case 36298:case 36306:case 35682:return o_;case 35679:case 36299:case 36307:return l_;case 35680:case 36300:case 36308:case 36293:return c_;case 36289:case 36303:case 36311:case 36292:return h_}}class d_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=X0(t.type)}}class f_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=u_(t.type)}}class p_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const ao=/(\w+)(\])?(\[|\.)?/g;function ch(r,e){r.seq.push(e),r.map[e.id]=e}function m_(r,e,t){const n=r.name,i=n.length;for(ao.lastIndex=0;;){const s=ao.exec(n),a=ao.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){ch(t,c===void 0?new d_(o,r,e):new f_(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new p_(o),ch(t,u)),t=u}}}class jr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);m_(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function hh(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const g_=37297;let __=0;function x_(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const uh=new Be;function v_(r){ze._getMatrix(uh,ze.workingColorSpace,r);const e=`mat3( ${uh.elements.map(t=>t.toFixed(4))} )`;switch(ze.getTransfer(r)){case ra:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return Ae("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function dh(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+x_(r.getShaderSource(e),o)}else return s}function y_(r,e){const t=v_(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const M_={[Ih]:"Linear",[Lh]:"Reinhard",[Dh]:"Cineon",[_l]:"ACESFilmic",[Nh]:"AgX",[Uh]:"Neutral",[Fh]:"Custom"};function S_(r,e){const t=M_[e];return t===void 0?(Ae("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Vr=new b;function b_(){ze.getLuminanceCoefficients(Vr);const r=Vr.x.toFixed(4),e=Vr.y.toFixed(4),t=Vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function w_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Os).join(`
`)}function T_(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function E_(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Os(r){return r!==""}function fh(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ph(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const A_=/^[ \t]*#include +<([\w\d./]+)>/gm;function hl(r){return r.replace(A_,R_)}const C_=new Map;function R_(r,e){let t=Ke[e];if(t===void 0){const n=C_.get(e);if(n!==void 0)t=Ke[n],Ae('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return hl(t)}const P_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mh(r){return r.replace(P_,I_)}function I_(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function gh(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}const L_={[Xr]:"SHADOWMAP_TYPE_PCF",[Fs]:"SHADOWMAP_TYPE_VSM"};function D_(r){return L_[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const F_={[Li]:"ENVMAP_TYPE_CUBE",[ds]:"ENVMAP_TYPE_CUBE",[pa]:"ENVMAP_TYPE_CUBE_UV"};function N_(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":F_[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const U_={[ds]:"ENVMAP_MODE_REFRACTION"};function O_(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":U_[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const k_={[fa]:"ENVMAP_BLENDING_MULTIPLY",[ld]:"ENVMAP_BLENDING_MIX",[cd]:"ENVMAP_BLENDING_ADD"};function B_(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":k_[r.combine]||"ENVMAP_BLENDING_NONE"}function z_(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function V_(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=D_(t),c=N_(t),h=O_(t),u=B_(t),d=z_(t),f=w_(t),p=T_(s),_=i.createProgram();let g,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Os).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Os).join(`
`),m.length>0&&(m+=`
`)):(g=[gh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Os).join(`
`),m=[gh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Bn?S_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,y_("linearToOutputTexel",t.outputColorSpace),b_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Os).join(`
`)),a=hl(a),a=fh(a,t),a=ph(a,t),o=hl(o),o=fh(o,t),o=ph(o,t),a=mh(a),o=mh(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===lc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===lc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=S+g+a,v=S+m+o,E=hh(i,i.VERTEX_SHADER,M),T=hh(i,i.FRAGMENT_SHADER,v);i.attachShader(_,E),i.attachShader(_,T),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function w(L){if(r.debug.checkShaderErrors){const D=i.getProgramInfoLog(_)||"",H=i.getShaderInfoLog(E)||"",Y=i.getShaderInfoLog(T)||"",O=D.trim(),X=H.trim(),B=Y.trim();let Q=!0,ne=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,E,T);else{const fe=dh(i,E,"vertex"),de=dh(i,T,"fragment");Ue("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+O+`
`+fe+`
`+de)}else O!==""?Ae("WebGLProgram: Program Info Log:",O):(X===""||B==="")&&(ne=!1);ne&&(L.diagnostics={runnable:Q,programLog:O,vertexShader:{log:X,prefix:g},fragmentShader:{log:B,prefix:m}})}i.deleteShader(E),i.deleteShader(T),x=new jr(i,_),R=E_(i,_)}let x;this.getUniforms=function(){return x===void 0&&w(this),x};let R;this.getAttributes=function(){return R===void 0&&w(this),R};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(_,g_)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=__++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let G_=0;class H_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new W_(e),t.set(e,n)),n}}class W_{constructor(e){this.id=G_++,this.code=e,this.usedTimes=0}}function X_(r){return r===Di||r===ta||r===na}function q_(r,e,t,n,i,s){const a=new Pl,o=new H_,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,R,I,L,D,H){const Y=L.fog,O=D.geometry,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?L.environment:null,B=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Q=e.get(x.envMap||X,B),ne=Q&&Q.mapping===pa?Q.image.height:null,fe=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Ae("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const de=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ye=de!==void 0?de.length:0;let qe=0;O.morphAttributes.position!==void 0&&(qe=1),O.morphAttributes.normal!==void 0&&(qe=2),O.morphAttributes.color!==void 0&&(qe=3);let Ze,Fe,J,re;if(fe){const he=Un[fe];Ze=he.vertexShader,Fe=he.fragmentShader}else{Ze=x.vertexShader,Fe=x.fragmentShader;const he=o.getVertexShaderStage(x),Ge=o.getFragmentShaderStage(x);o.update(x,he,Ge),J=he.id,re=Ge.id}const te=r.getRenderTarget(),Le=r.state.buffers.depth.getReversed(),Ne=D.isInstancedMesh===!0,Ce=D.isBatchedMesh===!0,ht=!!x.map,Ve=!!x.matcap,at=!!Q,et=!!x.aoMap,je=!!x.lightMap,Tt=!!x.bumpMap&&x.wireframe===!1,Rt=!!x.normalMap,At=!!x.displacementMap,Nt=!!x.emissiveMap,bt=!!x.metalnessMap,wt=!!x.roughnessMap,N=x.anisotropy>0,Xt=x.clearcoat>0,tt=x.dispersion>0,P=x.iridescence>0,y=x.sheen>0,k=x.transmission>0,z=N&&!!x.anisotropyMap,q=Xt&&!!x.clearcoatMap,se=Xt&&!!x.clearcoatNormalMap,ue=Xt&&!!x.clearcoatRoughnessMap,K=P&&!!x.iridescenceMap,$=P&&!!x.iridescenceThicknessMap,le=y&&!!x.sheenColorMap,Te=y&&!!x.sheenRoughnessMap,ie=!!x.specularMap,ce=!!x.specularColorMap,Pe=!!x.specularIntensityMap,De=k&&!!x.transmissionMap,me=k&&!!x.thicknessMap,F=!!x.gradientMap,ae=!!x.alphaMap,Z=x.alphaTest>0,oe=!!x.alphaHash,pe=!!x.extensions;let j=Bn;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(j=r.toneMapping);const _e={shaderID:fe,shaderType:x.type,shaderName:x.name,vertexShader:Ze,fragmentShader:Fe,defines:x.defines,customVertexShaderID:J,customFragmentShaderID:re,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:Ce,batchingColor:Ce&&D._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&D.instanceColor!==null,instancingMorph:Ne&&D.morphTexture!==null,outputColorSpace:te===null?r.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ze.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ht,matcap:Ve,envMap:at,envMapMode:at&&Q.mapping,envMapCubeUVHeight:ne,aoMap:et,lightMap:je,bumpMap:Tt,normalMap:Rt,displacementMap:At,emissiveMap:Nt,normalMapObjectSpace:Rt&&x.normalMapType===gd,normalMapTangentSpace:Rt&&x.normalMapType===qs,packedNormalMap:Rt&&x.normalMapType===qs&&X_(x.normalMap.format),metalnessMap:bt,roughnessMap:wt,anisotropy:N,anisotropyMap:z,clearcoat:Xt,clearcoatMap:q,clearcoatNormalMap:se,clearcoatRoughnessMap:ue,dispersion:tt,iridescence:P,iridescenceMap:K,iridescenceThicknessMap:$,sheen:y,sheenColorMap:le,sheenRoughnessMap:Te,specularMap:ie,specularColorMap:ce,specularIntensityMap:Pe,transmission:k,transmissionMap:De,thicknessMap:me,gradientMap:F,opaque:x.transparent===!1&&x.blending===as&&x.alphaToCoverage===!1,alphaMap:ae,alphaTest:Z,alphaHash:oe,combine:x.combine,mapUv:ht&&p(x.map.channel),aoMapUv:et&&p(x.aoMap.channel),lightMapUv:je&&p(x.lightMap.channel),bumpMapUv:Tt&&p(x.bumpMap.channel),normalMapUv:Rt&&p(x.normalMap.channel),displacementMapUv:At&&p(x.displacementMap.channel),emissiveMapUv:Nt&&p(x.emissiveMap.channel),metalnessMapUv:bt&&p(x.metalnessMap.channel),roughnessMapUv:wt&&p(x.roughnessMap.channel),anisotropyMapUv:z&&p(x.anisotropyMap.channel),clearcoatMapUv:q&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:se&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:$&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:le&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Te&&p(x.sheenRoughnessMap.channel),specularMapUv:ie&&p(x.specularMap.channel),specularColorMapUv:ce&&p(x.specularColorMap.channel),specularIntensityMapUv:Pe&&p(x.specularIntensityMap.channel),transmissionMapUv:De&&p(x.transmissionMap.channel),thicknessMapUv:me&&p(x.thicknessMap.channel),alphaMapUv:ae&&p(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(Rt||N),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!O.attributes.uv&&(ht||ae),fog:!!Y,useFog:x.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&Rt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Le,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:qe,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:r.shadowMap.enabled&&I.length>0,shadowMapType:r.shadowMap.type,toneMapping:j,decodeVideoTexture:ht&&x.map.isVideoTexture===!0&&ze.getTransfer(x.map.colorSpace)===ut,decodeVideoTextureEmissive:Nt&&x.emissiveMap.isVideoTexture===!0&&ze.getTransfer(x.emissiveMap.colorSpace)===ut,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===en,flipSided:x.side===Jt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||Ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return _e.vertexUv1s=l.has(1),_e.vertexUv2s=l.has(2),_e.vertexUv3s=l.has(3),l.clear(),_e}function g(x){const R=[];if(x.shaderID?R.push(x.shaderID):(R.push(x.customVertexShaderID),R.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)R.push(I),R.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(m(R,x),S(R,x),R.push(r.outputColorSpace)),R.push(x.customProgramCacheKey),R.join()}function m(x,R){x.push(R.precision),x.push(R.outputColorSpace),x.push(R.envMapMode),x.push(R.envMapCubeUVHeight),x.push(R.mapUv),x.push(R.alphaMapUv),x.push(R.lightMapUv),x.push(R.aoMapUv),x.push(R.bumpMapUv),x.push(R.normalMapUv),x.push(R.displacementMapUv),x.push(R.emissiveMapUv),x.push(R.metalnessMapUv),x.push(R.roughnessMapUv),x.push(R.anisotropyMapUv),x.push(R.clearcoatMapUv),x.push(R.clearcoatNormalMapUv),x.push(R.clearcoatRoughnessMapUv),x.push(R.iridescenceMapUv),x.push(R.iridescenceThicknessMapUv),x.push(R.sheenColorMapUv),x.push(R.sheenRoughnessMapUv),x.push(R.specularMapUv),x.push(R.specularColorMapUv),x.push(R.specularIntensityMapUv),x.push(R.transmissionMapUv),x.push(R.thicknessMapUv),x.push(R.combine),x.push(R.fogExp2),x.push(R.sizeAttenuation),x.push(R.morphTargetsCount),x.push(R.morphAttributeCount),x.push(R.numDirLights),x.push(R.numPointLights),x.push(R.numSpotLights),x.push(R.numSpotLightMaps),x.push(R.numHemiLights),x.push(R.numRectAreaLights),x.push(R.numDirLightShadows),x.push(R.numPointLightShadows),x.push(R.numSpotLightShadows),x.push(R.numSpotLightShadowsWithMaps),x.push(R.numLightProbes),x.push(R.shadowMapType),x.push(R.toneMapping),x.push(R.numClippingPlanes),x.push(R.numClipIntersection),x.push(R.depthPacking)}function S(x,R){a.disableAll(),R.instancing&&a.enable(0),R.instancingColor&&a.enable(1),R.instancingMorph&&a.enable(2),R.matcap&&a.enable(3),R.envMap&&a.enable(4),R.normalMapObjectSpace&&a.enable(5),R.normalMapTangentSpace&&a.enable(6),R.clearcoat&&a.enable(7),R.iridescence&&a.enable(8),R.alphaTest&&a.enable(9),R.vertexColors&&a.enable(10),R.vertexAlphas&&a.enable(11),R.vertexUv1s&&a.enable(12),R.vertexUv2s&&a.enable(13),R.vertexUv3s&&a.enable(14),R.vertexTangents&&a.enable(15),R.anisotropy&&a.enable(16),R.alphaHash&&a.enable(17),R.batching&&a.enable(18),R.dispersion&&a.enable(19),R.batchingColor&&a.enable(20),R.gradientMap&&a.enable(21),R.packedNormalMap&&a.enable(22),R.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.reversedDepthBuffer&&a.enable(4),R.skinning&&a.enable(5),R.morphTargets&&a.enable(6),R.morphNormals&&a.enable(7),R.morphColors&&a.enable(8),R.premultipliedAlpha&&a.enable(9),R.shadowMapEnabled&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),R.decodeVideoTextureEmissive&&a.enable(20),R.alphaToCoverage&&a.enable(21),R.numLightProbeGrids>0&&a.enable(22),R.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function M(x){const R=f[x.type];let I;if(R){const L=Un[R];I=Bf.clone(L.uniforms)}else I=x.uniforms;return I}function v(x,R){let I=h.get(R);return I!==void 0?++I.usedTimes:(I=new V_(r,R,x,i),c.push(I),h.set(R,I)),I}function E(x){if(--x.usedTimes===0){const R=c.indexOf(x);c[R]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function w(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:M,acquireProgram:v,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:w}}function K_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function Y_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function _h(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function xh(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,g,m){let S=r[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:g,group:m},r[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=p,S.materialVariant=a(d),S.groupOrder=_,S.renderOrder=d.renderOrder,S.z=g,S.group=m),e++,S}function l(d,f,p,_,g,m){const S=o(d,f,p,_,g,m);p.transmission>0?n.push(S):p.transparent===!0?i.push(S):t.push(S)}function c(d,f,p,_,g,m){const S=o(d,f,p,_,g,m);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):t.unshift(S)}function h(d,f,p){t.length>1&&t.sort(d||Y_),n.length>1&&n.sort(f||_h),i.length>1&&i.sort(f||_h),p&&(t.reverse(),n.reverse(),i.reverse())}function u(){for(let d=e,f=r.length;d<f;d++){const p=r[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:h}}function $_(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new xh,r.set(n,[a])):i>=s.length?(a=new xh,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function Z_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new b,color:new Me};break;case"SpotLight":t={position:new b,direction:new b,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new b,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new b,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new b,halfWidth:new b,halfHeight:new b};break}return r[e.id]=t,t}}}function J_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let j_=0;function Q_(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function ex(r){const e=new Z_,t=J_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new b);const i=new b,s=new Se,a=new Se;function o(c){let h=0,u=0,d=0;for(let R=0;R<9;R++)n.probe[R].set(0,0,0);let f=0,p=0,_=0,g=0,m=0,S=0,M=0,v=0,E=0,T=0,w=0;c.sort(Q_);for(let R=0,I=c.length;R<I;R++){const L=c[R],D=L.color,H=L.intensity,Y=L.distance;let O=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Di?O=L.shadow.map.texture:O=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=D.r*H,u+=D.g*H,d+=D.b*H;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],H);w++}else if(L.isDirectionalLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const B=L.shadow,Q=t.get(L);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,n.directionalShadow[f]=Q,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=L.shadow.matrix,S++}n.directional[f]=X,f++}else if(L.isSpotLight){const X=e.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(D).multiplyScalar(H),X.distance=Y,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[_]=X;const B=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,B.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[_]=B.matrix,L.castShadow){const Q=t.get(L);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,n.spotShadow[_]=Q,n.spotShadowMap[_]=O,v++}_++}else if(L.isRectAreaLight){const X=e.get(L);X.color.copy(D).multiplyScalar(H),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=X,g++}else if(L.isPointLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const B=L.shadow,Q=t.get(L);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,Q.shadowCameraNear=B.camera.near,Q.shadowCameraFar=B.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=L.shadow.matrix,M++}n.point[p]=X,p++}else if(L.isHemisphereLight){const X=e.get(L);X.skyColor.copy(L.color).multiplyScalar(H),X.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[m]=X,m++}}g>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==f||x.pointLength!==p||x.spotLength!==_||x.rectAreaLength!==g||x.hemiLength!==m||x.numDirectionalShadows!==S||x.numPointShadows!==M||x.numSpotShadows!==v||x.numSpotMaps!==E||x.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=v+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=w,x.directionalLength=f,x.pointLength=p,x.spotLength=_,x.rectAreaLength=g,x.hemiLength=m,x.numDirectionalShadows=S,x.numPointShadows=M,x.numSpotShadows=v,x.numSpotMaps=E,x.numLightProbes=w,n.version=j_++)}function l(c,h){let u=0,d=0,f=0,p=0,_=0;const g=h.matrixWorldInverse;for(let m=0,S=c.length;m<S;m++){const M=c[m];if(M.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),u++}else if(M.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),f++}else if(M.isRectAreaLight){const v=n.rectArea[p];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),a.identity(),s.copy(M.matrixWorld),s.premultiply(g),a.extractRotation(s),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(M.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:n}}function vh(r){const e=new ex(r),t=[],n=[],i=[];function s(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function tx(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new vh(r),e.set(i,[o])):s>=a.length?(o=new vh(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const nx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ix=`uniform sampler2D shadow_pass;
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
}`,sx=[new b(1,0,0),new b(-1,0,0),new b(0,1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1)],rx=[new b(0,-1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1),new b(0,-1,0),new b(0,-1,0)],yh=new Se,Ls=new b,oo=new b;function ax(r,e,t){let n=new Fl;const i=new Oe,s=new Oe,a=new rt,o=new Wf,l=new Xf,c={},h=t.maxTextureSize,u={[Qn]:Jt,[Jt]:Qn,[en]:en},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:nx,fragmentShader:ix}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new mt;p.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ee(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xr;let m=this.type;this.render=function(T,w,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Ph&&(Ae("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Xr);const R=r.getRenderTarget(),I=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),D=r.state;D.setBlending(Jn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const H=m!==this.type;H&&w.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(O=>O.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,O=T.length;Y<O;Y++){const X=T[Y],B=X.shadow;if(B===void 0){Ae("WebGLShadowMap:",X,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const Q=B.getFrameExtents();i.multiply(Q),s.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/Q.x),i.x=s.x*Q.x,B.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/Q.y),i.y=s.y*Q.y,B.mapSize.y=s.y));const ne=r.state.buffers.depth.getReversed();if(B.camera._reversedDepth=ne,B.map===null||H===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Fs){if(X.isPointLight){Ae("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new zn(i.x,i.y,{format:Di,type:ei,minFilter:Ot,magFilter:Ot,generateMipmaps:!1}),B.map.texture.name=X.name+".shadowMap",B.map.depthTexture=new ps(i.x,i.y,gn),B.map.depthTexture.name=X.name+".shadowMapDepth",B.map.depthTexture.format=ti,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Bt,B.map.depthTexture.magFilter=Bt}else X.isPointLight?(B.map=new pu(i.x),B.map.depthTexture=new xf(i.x,Vn)):(B.map=new zn(i.x,i.y),B.map.depthTexture=new ps(i.x,i.y,Vn)),B.map.depthTexture.name=X.name+".shadowMap",B.map.depthTexture.format=ti,this.type===Xr?(B.map.depthTexture.compareFunction=ne?Al:El,B.map.depthTexture.minFilter=Ot,B.map.depthTexture.magFilter=Ot):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Bt,B.map.depthTexture.magFilter=Bt);B.camera.updateProjectionMatrix()}const fe=B.map.isWebGLCubeRenderTarget?6:1;for(let de=0;de<fe;de++){if(B.map.isWebGLCubeRenderTarget)r.setRenderTarget(B.map,de),r.clear();else{de===0&&(r.setRenderTarget(B.map),r.clear());const ye=B.getViewport(de);a.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),D.viewport(a)}if(X.isPointLight){const ye=B.camera,qe=B.matrix,Ze=X.distance||ye.far;Ze!==ye.far&&(ye.far=Ze,ye.updateProjectionMatrix()),Ls.setFromMatrixPosition(X.matrixWorld),ye.position.copy(Ls),oo.copy(ye.position),oo.add(sx[de]),ye.up.copy(rx[de]),ye.lookAt(oo),ye.updateMatrixWorld(),qe.makeTranslation(-Ls.x,-Ls.y,-Ls.z),yh.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),B._frustum.setFromProjectionMatrix(yh,ye.coordinateSystem,ye.reversedDepth)}else B.updateMatrices(X);n=B.getFrustum(),v(w,x,B.camera,X,this.type)}B.isPointLightShadow!==!0&&this.type===Fs&&S(B,x),B.needsUpdate=!1}m=this.type,g.needsUpdate=!1,r.setRenderTarget(R,I,L)};function S(T,w){const x=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new zn(i.x,i.y,{format:Di,type:ei})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,r.setRenderTarget(T.mapPass),r.clear(),r.renderBufferDirect(w,null,x,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,r.setRenderTarget(T.map),r.clear(),r.renderBufferDirect(w,null,x,f,_,null)}function M(T,w,x,R){let I=null;const L=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)I=L;else if(I=x.isPointLight===!0?l:o,r.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const D=I.uuid,H=w.uuid;let Y=c[D];Y===void 0&&(Y={},c[D]=Y);let O=Y[H];O===void 0&&(O=I.clone(),Y[H]=O,w.addEventListener("dispose",E)),I=O}if(I.visible=w.visible,I.wireframe=w.wireframe,R===Fs?I.side=w.shadowSide!==null?w.shadowSide:w.side:I.side=w.shadowSide!==null?w.shadowSide:u[w.side],I.alphaMap=w.alphaMap,I.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,I.map=w.map,I.clipShadows=w.clipShadows,I.clippingPlanes=w.clippingPlanes,I.clipIntersection=w.clipIntersection,I.displacementMap=w.displacementMap,I.displacementScale=w.displacementScale,I.displacementBias=w.displacementBias,I.wireframeLinewidth=w.wireframeLinewidth,I.linewidth=w.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const D=r.properties.get(I);D.light=x}return I}function v(T,w,x,R,I){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===Fs)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const H=e.update(T),Y=T.material;if(Array.isArray(Y)){const O=H.groups;for(let X=0,B=O.length;X<B;X++){const Q=O[X],ne=Y[Q.materialIndex];if(ne&&ne.visible){const fe=M(T,ne,R,I);T.onBeforeShadow(r,T,w,x,H,fe,Q),r.renderBufferDirect(x,null,H,fe,T,Q),T.onAfterShadow(r,T,w,x,H,fe,Q)}}}else if(Y.visible){const O=M(T,Y,R,I);T.onBeforeShadow(r,T,w,x,H,O,null),r.renderBufferDirect(x,null,H,O,T,null),T.onAfterShadow(r,T,w,x,H,O,null)}}const D=T.children;for(let H=0,Y=D.length;H<Y;H++)v(D[H],w,x,R,I)}function E(T){T.target.removeEventListener("dispose",E);for(const x in c){const R=c[x],I=T.target.uuid;I in R&&(R[I].dispose(),delete R[I])}}}function ox(r,e){function t(){let F=!1;const ae=new rt;let Z=null;const oe=new rt(0,0,0,0);return{setMask:function(pe){Z!==pe&&!F&&(r.colorMask(pe,pe,pe,pe),Z=pe)},setLocked:function(pe){F=pe},setClear:function(pe,j,_e,he,Ge){Ge===!0&&(pe*=he,j*=he,_e*=he),ae.set(pe,j,_e,he),oe.equals(ae)===!1&&(r.clearColor(pe,j,_e,he),oe.copy(ae))},reset:function(){F=!1,Z=null,oe.set(-1,0,0,0)}}}function n(){let F=!1,ae=!1,Z=null,oe=null,pe=null;return{setReversed:function(j){if(ae!==j){const _e=e.get("EXT_clip_control");j?_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.ZERO_TO_ONE_EXT):_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.NEGATIVE_ONE_TO_ONE_EXT),ae=j;const he=pe;pe=null,this.setClear(he)}},getReversed:function(){return ae},setTest:function(j){j?te(r.DEPTH_TEST):Le(r.DEPTH_TEST)},setMask:function(j){Z!==j&&!F&&(r.depthMask(j),Z=j)},setFunc:function(j){if(ae&&(j=Ad[j]),oe!==j){switch(j){case vo:r.depthFunc(r.NEVER);break;case yo:r.depthFunc(r.ALWAYS);break;case Mo:r.depthFunc(r.LESS);break;case us:r.depthFunc(r.LEQUAL);break;case So:r.depthFunc(r.EQUAL);break;case bo:r.depthFunc(r.GEQUAL);break;case wo:r.depthFunc(r.GREATER);break;case To:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}oe=j}},setLocked:function(j){F=j},setClear:function(j){pe!==j&&(pe=j,ae&&(j=1-j),r.clearDepth(j))},reset:function(){F=!1,Z=null,oe=null,pe=null,ae=!1}}}function i(){let F=!1,ae=null,Z=null,oe=null,pe=null,j=null,_e=null,he=null,Ge=null;return{setTest:function(Qe){F||(Qe?te(r.STENCIL_TEST):Le(r.STENCIL_TEST))},setMask:function(Qe){ae!==Qe&&!F&&(r.stencilMask(Qe),ae=Qe)},setFunc:function(Qe,vn,rn){(Z!==Qe||oe!==vn||pe!==rn)&&(r.stencilFunc(Qe,vn,rn),Z=Qe,oe=vn,pe=rn)},setOp:function(Qe,vn,rn){(j!==Qe||_e!==vn||he!==rn)&&(r.stencilOp(Qe,vn,rn),j=Qe,_e=vn,he=rn)},setLocked:function(Qe){F=Qe},setClear:function(Qe){Ge!==Qe&&(r.clearStencil(Qe),Ge=Qe)},reset:function(){F=!1,ae=null,Z=null,oe=null,pe=null,j=null,_e=null,he=null,Ge=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],_=null,g=!1,m=null,S=null,M=null,v=null,E=null,T=null,w=null,x=new Me(0,0,0),R=0,I=!1,L=null,D=null,H=null,Y=null,O=null;const X=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Q=0;const ne=r.getParameter(r.VERSION);ne.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ne)[1]),B=Q>=1):ne.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),B=Q>=2);let fe=null,de={};const ye=r.getParameter(r.SCISSOR_BOX),qe=r.getParameter(r.VIEWPORT),Ze=new rt().fromArray(ye),Fe=new rt().fromArray(qe);function J(F,ae,Z,oe){const pe=new Uint8Array(4),j=r.createTexture();r.bindTexture(F,j),r.texParameteri(F,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(F,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let _e=0;_e<Z;_e++)F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY?r.texImage3D(ae,0,r.RGBA,1,1,oe,0,r.RGBA,r.UNSIGNED_BYTE,pe):r.texImage2D(ae+_e,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,pe);return j}const re={};re[r.TEXTURE_2D]=J(r.TEXTURE_2D,r.TEXTURE_2D,1),re[r.TEXTURE_CUBE_MAP]=J(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[r.TEXTURE_2D_ARRAY]=J(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),re[r.TEXTURE_3D]=J(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(r.DEPTH_TEST),a.setFunc(us),Tt(!1),Rt(nc),te(r.CULL_FACE),et(Jn);function te(F){h[F]!==!0&&(r.enable(F),h[F]=!0)}function Le(F){h[F]!==!1&&(r.disable(F),h[F]=!1)}function Ne(F,ae){return d[F]!==ae?(r.bindFramebuffer(F,ae),d[F]=ae,F===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=ae),F===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=ae),!0):!1}function Ce(F,ae){let Z=p,oe=!1;if(F){Z=f.get(ae),Z===void 0&&(Z=[],f.set(ae,Z));const pe=F.textures;if(Z.length!==pe.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let j=0,_e=pe.length;j<_e;j++)Z[j]=r.COLOR_ATTACHMENT0+j;Z.length=pe.length,oe=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,oe=!0);oe&&r.drawBuffers(Z)}function ht(F){return _!==F?(r.useProgram(F),_=F,!0):!1}const Ve={[Ri]:r.FUNC_ADD,[Xu]:r.FUNC_SUBTRACT,[qu]:r.FUNC_REVERSE_SUBTRACT};Ve[Ku]=r.MIN,Ve[Yu]=r.MAX;const at={[$u]:r.ZERO,[Zu]:r.ONE,[Ju]:r.SRC_COLOR,[_o]:r.SRC_ALPHA,[id]:r.SRC_ALPHA_SATURATE,[td]:r.DST_COLOR,[Qu]:r.DST_ALPHA,[ju]:r.ONE_MINUS_SRC_COLOR,[xo]:r.ONE_MINUS_SRC_ALPHA,[nd]:r.ONE_MINUS_DST_COLOR,[ed]:r.ONE_MINUS_DST_ALPHA,[sd]:r.CONSTANT_COLOR,[rd]:r.ONE_MINUS_CONSTANT_COLOR,[ad]:r.CONSTANT_ALPHA,[od]:r.ONE_MINUS_CONSTANT_ALPHA};function et(F,ae,Z,oe,pe,j,_e,he,Ge,Qe){if(F===Jn){g===!0&&(Le(r.BLEND),g=!1);return}if(g===!1&&(te(r.BLEND),g=!0),F!==Wu){if(F!==m||Qe!==I){if((S!==Ri||E!==Ri)&&(r.blendEquation(r.FUNC_ADD),S=Ri,E=Ri),Qe)switch(F){case as:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Vs:r.blendFunc(r.ONE,r.ONE);break;case ic:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case sc:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ue("WebGLState: Invalid blending: ",F);break}else switch(F){case as:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Vs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ic:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sc:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",F);break}M=null,v=null,T=null,w=null,x.set(0,0,0),R=0,m=F,I=Qe}return}pe=pe||ae,j=j||Z,_e=_e||oe,(ae!==S||pe!==E)&&(r.blendEquationSeparate(Ve[ae],Ve[pe]),S=ae,E=pe),(Z!==M||oe!==v||j!==T||_e!==w)&&(r.blendFuncSeparate(at[Z],at[oe],at[j],at[_e]),M=Z,v=oe,T=j,w=_e),(he.equals(x)===!1||Ge!==R)&&(r.blendColor(he.r,he.g,he.b,Ge),x.copy(he),R=Ge),m=F,I=!1}function je(F,ae){F.side===en?Le(r.CULL_FACE):te(r.CULL_FACE);let Z=F.side===Jt;ae&&(Z=!Z),Tt(Z),F.blending===as&&F.transparent===!1?et(Jn):et(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),s.setMask(F.colorWrite);const oe=F.stencilWrite;o.setTest(oe),oe&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Nt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?te(r.SAMPLE_ALPHA_TO_COVERAGE):Le(r.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(F){L!==F&&(F?r.frontFace(r.CW):r.frontFace(r.CCW),L=F)}function Rt(F){F!==Gu?(te(r.CULL_FACE),F!==D&&(F===nc?r.cullFace(r.BACK):F===Hu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Le(r.CULL_FACE),D=F}function At(F){F!==H&&(B&&r.lineWidth(F),H=F)}function Nt(F,ae,Z){F?(te(r.POLYGON_OFFSET_FILL),(Y!==ae||O!==Z)&&(Y=ae,O=Z,a.getReversed()&&(ae=-ae),r.polygonOffset(ae,Z))):Le(r.POLYGON_OFFSET_FILL)}function bt(F){F?te(r.SCISSOR_TEST):Le(r.SCISSOR_TEST)}function wt(F){F===void 0&&(F=r.TEXTURE0+X-1),fe!==F&&(r.activeTexture(F),fe=F)}function N(F,ae,Z){Z===void 0&&(fe===null?Z=r.TEXTURE0+X-1:Z=fe);let oe=de[Z];oe===void 0&&(oe={type:void 0,texture:void 0},de[Z]=oe),(oe.type!==F||oe.texture!==ae)&&(fe!==Z&&(r.activeTexture(Z),fe=Z),r.bindTexture(F,ae||re[F]),oe.type=F,oe.texture=ae)}function Xt(){const F=de[fe];F!==void 0&&F.type!==void 0&&(r.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function tt(){try{r.compressedTexImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function P(){try{r.compressedTexImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function y(){try{r.texSubImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function k(){try{r.texSubImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function z(){try{r.compressedTexSubImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function q(){try{r.compressedTexSubImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function se(){try{r.texStorage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function ue(){try{r.texStorage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function K(){try{r.texImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function $(){try{r.texImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function le(F){return u[F]!==void 0?u[F]:r.getParameter(F)}function Te(F,ae){u[F]!==ae&&(r.pixelStorei(F,ae),u[F]=ae)}function ie(F){Ze.equals(F)===!1&&(r.scissor(F.x,F.y,F.z,F.w),Ze.copy(F))}function ce(F){Fe.equals(F)===!1&&(r.viewport(F.x,F.y,F.z,F.w),Fe.copy(F))}function Pe(F,ae){let Z=c.get(ae);Z===void 0&&(Z=new WeakMap,c.set(ae,Z));let oe=Z.get(F);oe===void 0&&(oe=r.getUniformBlockIndex(ae,F.name),Z.set(F,oe))}function De(F,ae){const oe=c.get(ae).get(F);l.get(ae)!==oe&&(r.uniformBlockBinding(ae,oe,F.__bindingPointIndex),l.set(ae,oe))}function me(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},fe=null,de={},d={},f=new WeakMap,p=[],_=null,g=!1,m=null,S=null,M=null,v=null,E=null,T=null,w=null,x=new Me(0,0,0),R=0,I=!1,L=null,D=null,H=null,Y=null,O=null,Ze.set(0,0,r.canvas.width,r.canvas.height),Fe.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:te,disable:Le,bindFramebuffer:Ne,drawBuffers:Ce,useProgram:ht,setBlending:et,setMaterial:je,setFlipSided:Tt,setCullFace:Rt,setLineWidth:At,setPolygonOffset:Nt,setScissorTest:bt,activeTexture:wt,bindTexture:N,unbindTexture:Xt,compressedTexImage2D:tt,compressedTexImage3D:P,texImage2D:K,texImage3D:$,pixelStorei:Te,getParameter:le,updateUBOMapping:Pe,uniformBlockBinding:De,texStorage2D:se,texStorage3D:ue,texSubImage2D:y,texSubImage3D:k,compressedTexSubImage2D:z,compressedTexSubImage3D:q,scissor:ie,viewport:ce,reset:me}}function lx(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,y){return p?new OffscreenCanvas(P,y):Ys("canvas")}function g(P,y,k){let z=1;const q=tt(P);if((q.width>k||q.height>k)&&(z=k/Math.max(q.width,q.height)),z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const se=Math.floor(z*q.width),ue=Math.floor(z*q.height);d===void 0&&(d=_(se,ue));const K=y?_(se,ue):d;return K.width=se,K.height=ue,K.getContext("2d").drawImage(P,0,0,se,ue),Ae("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+se+"x"+ue+")."),K}else return"data"in P&&Ae("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),P;return P}function m(P){return P.generateMipmaps}function S(P){r.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function v(P,y,k,z,q,se=!1){if(P!==null){if(r[P]!==void 0)return r[P];Ae("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ue;z&&(ue=e.get("EXT_texture_norm16"),ue||Ae("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=y;if(y===r.RED&&(k===r.FLOAT&&(K=r.R32F),k===r.HALF_FLOAT&&(K=r.R16F),k===r.UNSIGNED_BYTE&&(K=r.R8),k===r.UNSIGNED_SHORT&&ue&&(K=ue.R16_EXT),k===r.SHORT&&ue&&(K=ue.R16_SNORM_EXT)),y===r.RED_INTEGER&&(k===r.UNSIGNED_BYTE&&(K=r.R8UI),k===r.UNSIGNED_SHORT&&(K=r.R16UI),k===r.UNSIGNED_INT&&(K=r.R32UI),k===r.BYTE&&(K=r.R8I),k===r.SHORT&&(K=r.R16I),k===r.INT&&(K=r.R32I)),y===r.RG&&(k===r.FLOAT&&(K=r.RG32F),k===r.HALF_FLOAT&&(K=r.RG16F),k===r.UNSIGNED_BYTE&&(K=r.RG8),k===r.UNSIGNED_SHORT&&ue&&(K=ue.RG16_EXT),k===r.SHORT&&ue&&(K=ue.RG16_SNORM_EXT)),y===r.RG_INTEGER&&(k===r.UNSIGNED_BYTE&&(K=r.RG8UI),k===r.UNSIGNED_SHORT&&(K=r.RG16UI),k===r.UNSIGNED_INT&&(K=r.RG32UI),k===r.BYTE&&(K=r.RG8I),k===r.SHORT&&(K=r.RG16I),k===r.INT&&(K=r.RG32I)),y===r.RGB_INTEGER&&(k===r.UNSIGNED_BYTE&&(K=r.RGB8UI),k===r.UNSIGNED_SHORT&&(K=r.RGB16UI),k===r.UNSIGNED_INT&&(K=r.RGB32UI),k===r.BYTE&&(K=r.RGB8I),k===r.SHORT&&(K=r.RGB16I),k===r.INT&&(K=r.RGB32I)),y===r.RGBA_INTEGER&&(k===r.UNSIGNED_BYTE&&(K=r.RGBA8UI),k===r.UNSIGNED_SHORT&&(K=r.RGBA16UI),k===r.UNSIGNED_INT&&(K=r.RGBA32UI),k===r.BYTE&&(K=r.RGBA8I),k===r.SHORT&&(K=r.RGBA16I),k===r.INT&&(K=r.RGBA32I)),y===r.RGB&&(k===r.UNSIGNED_SHORT&&ue&&(K=ue.RGB16_EXT),k===r.SHORT&&ue&&(K=ue.RGB16_SNORM_EXT),k===r.UNSIGNED_INT_5_9_9_9_REV&&(K=r.RGB9_E5),k===r.UNSIGNED_INT_10F_11F_11F_REV&&(K=r.R11F_G11F_B10F)),y===r.RGBA){const $=se?ra:ze.getTransfer(q);k===r.FLOAT&&(K=r.RGBA32F),k===r.HALF_FLOAT&&(K=r.RGBA16F),k===r.UNSIGNED_BYTE&&(K=$===ut?r.SRGB8_ALPHA8:r.RGBA8),k===r.UNSIGNED_SHORT&&ue&&(K=ue.RGBA16_EXT),k===r.SHORT&&ue&&(K=ue.RGBA16_SNORM_EXT),k===r.UNSIGNED_SHORT_4_4_4_4&&(K=r.RGBA4),k===r.UNSIGNED_SHORT_5_5_5_1&&(K=r.RGB5_A1)}return(K===r.R16F||K===r.R32F||K===r.RG16F||K===r.RG32F||K===r.RGBA16F||K===r.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function E(P,y){let k;return P?y===null||y===Vn||y===Hs?k=r.DEPTH24_STENCIL8:y===gn?k=r.DEPTH32F_STENCIL8:y===Gs&&(k=r.DEPTH24_STENCIL8,Ae("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Vn||y===Hs?k=r.DEPTH_COMPONENT24:y===gn?k=r.DEPTH_COMPONENT32F:y===Gs&&(k=r.DEPTH_COMPONENT16),k}function T(P,y){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Bt&&P.minFilter!==Ot?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function w(P){const y=P.target;y.removeEventListener("dispose",w),R(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function x(P){const y=P.target;y.removeEventListener("dispose",x),L(y)}function R(P){const y=n.get(P);if(y.__webglInit===void 0)return;const k=P.source,z=f.get(k);if(z){const q=z[y.__cacheKey];q.usedTimes--,q.usedTimes===0&&I(P),Object.keys(z).length===0&&f.delete(k)}n.remove(P)}function I(P){const y=n.get(P);r.deleteTexture(y.__webglTexture);const k=P.source,z=f.get(k);delete z[y.__cacheKey],a.memory.textures--}function L(P){const y=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(y.__webglFramebuffer[z]))for(let q=0;q<y.__webglFramebuffer[z].length;q++)r.deleteFramebuffer(y.__webglFramebuffer[z][q]);else r.deleteFramebuffer(y.__webglFramebuffer[z]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[z])}else{if(Array.isArray(y.__webglFramebuffer))for(let z=0;z<y.__webglFramebuffer.length;z++)r.deleteFramebuffer(y.__webglFramebuffer[z]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let z=0;z<y.__webglColorRenderbuffer.length;z++)y.__webglColorRenderbuffer[z]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[z]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const k=P.textures;for(let z=0,q=k.length;z<q;z++){const se=n.get(k[z]);se.__webglTexture&&(r.deleteTexture(se.__webglTexture),a.memory.textures--),n.remove(k[z])}n.remove(P)}let D=0;function H(){D=0}function Y(){return D}function O(P){D=P}function X(){const P=D;return P>=i.maxTextures&&Ae("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),D+=1,P}function B(P){const y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function Q(P,y){const k=n.get(P);if(P.isVideoTexture&&N(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&k.__version!==P.version){const z=P.image;if(z===null)Ae("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Ae("WebGLRenderer: Texture marked for update but image is incomplete");else{Le(k,P,y);return}}else P.isExternalTexture&&(k.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,k.__webglTexture,r.TEXTURE0+y)}function ne(P,y){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){Le(k,P,y);return}else P.isExternalTexture&&(k.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,k.__webglTexture,r.TEXTURE0+y)}function fe(P,y){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){Le(k,P,y);return}t.bindTexture(r.TEXTURE_3D,k.__webglTexture,r.TEXTURE0+y)}function de(P,y){const k=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&k.__version!==P.version){Ne(k,P,y);return}t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+y)}const ye={[nn]:r.REPEAT,[mn]:r.CLAMP_TO_EDGE,[ea]:r.MIRRORED_REPEAT},qe={[Bt]:r.NEAREST,[kh]:r.NEAREST_MIPMAP_NEAREST,[Ns]:r.NEAREST_MIPMAP_LINEAR,[Ot]:r.LINEAR,[Kr]:r.LINEAR_MIPMAP_NEAREST,[On]:r.LINEAR_MIPMAP_LINEAR},Ze={[_d]:r.NEVER,[Sd]:r.ALWAYS,[xd]:r.LESS,[El]:r.LEQUAL,[vd]:r.EQUAL,[Al]:r.GEQUAL,[yd]:r.GREATER,[Md]:r.NOTEQUAL};function Fe(P,y){if(y.type===gn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Ot||y.magFilter===Kr||y.magFilter===Ns||y.magFilter===On||y.minFilter===Ot||y.minFilter===Kr||y.minFilter===Ns||y.minFilter===On)&&Ae("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,ye[y.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,ye[y.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,ye[y.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,qe[y.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,qe[y.minFilter]),y.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,Ze[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Bt||y.minFilter!==Ns&&y.minFilter!==On||y.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");r.texParameterf(P,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function J(P,y){let k=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",w));const z=y.source;let q=f.get(z);q===void 0&&(q={},f.set(z,q));const se=B(y);if(se!==P.__cacheKey){q[se]===void 0&&(q[se]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,k=!0),q[se].usedTimes++;const ue=q[P.__cacheKey];ue!==void 0&&(q[P.__cacheKey].usedTimes--,ue.usedTimes===0&&I(y)),P.__cacheKey=se,P.__webglTexture=q[se].texture}return k}function re(P,y,k){return Math.floor(Math.floor(P/k)/y)}function te(P,y,k,z){const se=P.updateRanges;if(se.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,y.width,y.height,k,z,y.data);else{se.sort((Te,ie)=>Te.start-ie.start);let ue=0;for(let Te=1;Te<se.length;Te++){const ie=se[ue],ce=se[Te],Pe=ie.start+ie.count,De=re(ce.start,y.width,4),me=re(ie.start,y.width,4);ce.start<=Pe+1&&De===me&&re(ce.start+ce.count-1,y.width,4)===De?ie.count=Math.max(ie.count,ce.start+ce.count-ie.start):(++ue,se[ue]=ce)}se.length=ue+1;const K=t.getParameter(r.UNPACK_ROW_LENGTH),$=t.getParameter(r.UNPACK_SKIP_PIXELS),le=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,y.width);for(let Te=0,ie=se.length;Te<ie;Te++){const ce=se[Te],Pe=Math.floor(ce.start/4),De=Math.ceil(ce.count/4),me=Pe%y.width,F=Math.floor(Pe/y.width),ae=De,Z=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,me),t.pixelStorei(r.UNPACK_SKIP_ROWS,F),t.texSubImage2D(r.TEXTURE_2D,0,me,F,ae,Z,k,z,y.data)}P.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,K),t.pixelStorei(r.UNPACK_SKIP_PIXELS,$),t.pixelStorei(r.UNPACK_SKIP_ROWS,le)}}function Le(P,y,k){let z=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(z=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(z=r.TEXTURE_3D);const q=J(P,y),se=y.source;t.bindTexture(z,P.__webglTexture,r.TEXTURE0+k);const ue=n.get(se);if(se.version!==ue.__version||q===!0){if(t.activeTexture(r.TEXTURE0+k),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const Z=ze.getPrimaries(ze.workingColorSpace),oe=y.colorSpace===_i?null:ze.getPrimaries(y.colorSpace),pe=y.colorSpace===_i||Z===oe?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment);let $=g(y.image,!1,i.maxTextureSize);$=Xt(y,$);const le=s.convert(y.format,y.colorSpace),Te=s.convert(y.type);let ie=v(y.internalFormat,le,Te,y.normalized,y.colorSpace,y.isVideoTexture);Fe(z,y);let ce;const Pe=y.mipmaps,De=y.isVideoTexture!==!0,me=ue.__version===void 0||q===!0,F=se.dataReady,ae=T(y,$);if(y.isDepthTexture)ie=E(y.format===Ii,y.type),me&&(De?t.texStorage2D(r.TEXTURE_2D,1,ie,$.width,$.height):t.texImage2D(r.TEXTURE_2D,0,ie,$.width,$.height,0,le,Te,null));else if(y.isDataTexture)if(Pe.length>0){De&&me&&t.texStorage2D(r.TEXTURE_2D,ae,ie,Pe[0].width,Pe[0].height);for(let Z=0,oe=Pe.length;Z<oe;Z++)ce=Pe[Z],De?F&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ce.width,ce.height,le,Te,ce.data):t.texImage2D(r.TEXTURE_2D,Z,ie,ce.width,ce.height,0,le,Te,ce.data);y.generateMipmaps=!1}else De?(me&&t.texStorage2D(r.TEXTURE_2D,ae,ie,$.width,$.height),F&&te(y,$,le,Te)):t.texImage2D(r.TEXTURE_2D,0,ie,$.width,$.height,0,le,Te,$.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){De&&me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ae,ie,Pe[0].width,Pe[0].height,$.depth);for(let Z=0,oe=Pe.length;Z<oe;Z++)if(ce=Pe[Z],y.format!==_n)if(le!==null)if(De){if(F)if(y.layerUpdates.size>0){const pe=Jc(ce.width,ce.height,y.format,y.type);for(const j of y.layerUpdates){const _e=ce.data.subarray(j*pe/ce.data.BYTES_PER_ELEMENT,(j+1)*pe/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,j,ce.width,ce.height,1,le,_e)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ce.width,ce.height,$.depth,le,ce.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,ie,ce.width,ce.height,$.depth,0,ce.data,0,0);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?F&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ce.width,ce.height,$.depth,le,Te,ce.data):t.texImage3D(r.TEXTURE_2D_ARRAY,Z,ie,ce.width,ce.height,$.depth,0,le,Te,ce.data)}else{De&&me&&t.texStorage2D(r.TEXTURE_2D,ae,ie,Pe[0].width,Pe[0].height);for(let Z=0,oe=Pe.length;Z<oe;Z++)ce=Pe[Z],y.format!==_n?le!==null?De?F&&t.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,ce.width,ce.height,le,ce.data):t.compressedTexImage2D(r.TEXTURE_2D,Z,ie,ce.width,ce.height,0,ce.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?F&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,ce.width,ce.height,le,Te,ce.data):t.texImage2D(r.TEXTURE_2D,Z,ie,ce.width,ce.height,0,le,Te,ce.data)}else if(y.isDataArrayTexture)if(De){if(me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ae,ie,$.width,$.height,$.depth),F)if(y.layerUpdates.size>0){const Z=Jc($.width,$.height,y.format,y.type);for(const oe of y.layerUpdates){const pe=$.data.subarray(oe*Z/$.data.BYTES_PER_ELEMENT,(oe+1)*Z/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,oe,$.width,$.height,1,le,Te,pe)}y.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,le,Te,$.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ie,$.width,$.height,$.depth,0,le,Te,$.data);else if(y.isData3DTexture)De?(me&&t.texStorage3D(r.TEXTURE_3D,ae,ie,$.width,$.height,$.depth),F&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,le,Te,$.data)):t.texImage3D(r.TEXTURE_3D,0,ie,$.width,$.height,$.depth,0,le,Te,$.data);else if(y.isFramebufferTexture){if(me)if(De)t.texStorage2D(r.TEXTURE_2D,ae,ie,$.width,$.height);else{let Z=$.width,oe=$.height;for(let pe=0;pe<ae;pe++)t.texImage2D(r.TEXTURE_2D,pe,ie,Z,oe,0,le,Te,null),Z>>=1,oe>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in r){const Z=r.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),$.parentNode!==Z){Z.appendChild($),u.add(y),Z.onpaint=oe=>{const pe=oe.changedElements;for(const j of u)pe.includes(j.image)&&(j.needsUpdate=!0)},Z.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,$);else{const pe=r.RGBA,j=r.RGBA,_e=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,pe,j,_e,$)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(De&&me){const Z=tt(Pe[0]);t.texStorage2D(r.TEXTURE_2D,ae,ie,Z.width,Z.height)}for(let Z=0,oe=Pe.length;Z<oe;Z++)ce=Pe[Z],De?F&&t.texSubImage2D(r.TEXTURE_2D,Z,0,0,le,Te,ce):t.texImage2D(r.TEXTURE_2D,Z,ie,le,Te,ce);y.generateMipmaps=!1}else if(De){if(me){const Z=tt($);t.texStorage2D(r.TEXTURE_2D,ae,ie,Z.width,Z.height)}F&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,le,Te,$)}else t.texImage2D(r.TEXTURE_2D,0,ie,le,Te,$);m(y)&&S(z),ue.__version=se.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Ne(P,y,k){if(y.image.length!==6)return;const z=J(P,y),q=y.source;t.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+k);const se=n.get(q);if(q.version!==se.__version||z===!0){t.activeTexture(r.TEXTURE0+k);const ue=ze.getPrimaries(ze.workingColorSpace),K=y.colorSpace===_i?null:ze.getPrimaries(y.colorSpace),$=y.colorSpace===_i||ue===K?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);const le=y.isCompressedTexture||y.image[0].isCompressedTexture,Te=y.image[0]&&y.image[0].isDataTexture,ie=[];for(let j=0;j<6;j++)!le&&!Te?ie[j]=g(y.image[j],!0,i.maxCubemapSize):ie[j]=Te?y.image[j].image:y.image[j],ie[j]=Xt(y,ie[j]);const ce=ie[0],Pe=s.convert(y.format,y.colorSpace),De=s.convert(y.type),me=v(y.internalFormat,Pe,De,y.normalized,y.colorSpace),F=y.isVideoTexture!==!0,ae=se.__version===void 0||z===!0,Z=q.dataReady;let oe=T(y,ce);Fe(r.TEXTURE_CUBE_MAP,y);let pe;if(le){F&&ae&&t.texStorage2D(r.TEXTURE_CUBE_MAP,oe,me,ce.width,ce.height);for(let j=0;j<6;j++){pe=ie[j].mipmaps;for(let _e=0;_e<pe.length;_e++){const he=pe[_e];y.format!==_n?Pe!==null?F?Z&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e,0,0,he.width,he.height,Pe,he.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e,me,he.width,he.height,0,he.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e,0,0,he.width,he.height,Pe,De,he.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e,me,he.width,he.height,0,Pe,De,he.data)}}}else{if(pe=y.mipmaps,F&&ae){pe.length>0&&oe++;const j=tt(ie[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,oe,me,j.width,j.height)}for(let j=0;j<6;j++)if(Te){F?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ie[j].width,ie[j].height,Pe,De,ie[j].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,me,ie[j].width,ie[j].height,0,Pe,De,ie[j].data);for(let _e=0;_e<pe.length;_e++){const Ge=pe[_e].image[j].image;F?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e+1,0,0,Ge.width,Ge.height,Pe,De,Ge.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e+1,me,Ge.width,Ge.height,0,Pe,De,Ge.data)}}else{F?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Pe,De,ie[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,me,Pe,De,ie[j]);for(let _e=0;_e<pe.length;_e++){const he=pe[_e];F?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e+1,0,0,Pe,De,he.image[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,_e+1,me,Pe,De,he.image[j])}}}m(y)&&S(r.TEXTURE_CUBE_MAP),se.__version=q.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Ce(P,y,k,z,q,se){const ue=s.convert(k.format,k.colorSpace),K=s.convert(k.type),$=v(k.internalFormat,ue,K,k.normalized,k.colorSpace),le=n.get(y),Te=n.get(k);if(Te.__renderTarget=y,!le.__hasExternalTextures){const ie=Math.max(1,y.width>>se),ce=Math.max(1,y.height>>se);q===r.TEXTURE_3D||q===r.TEXTURE_2D_ARRAY?t.texImage3D(q,se,$,ie,ce,y.depth,0,ue,K,null):t.texImage2D(q,se,$,ie,ce,0,ue,K,null)}t.bindFramebuffer(r.FRAMEBUFFER,P),wt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,z,q,Te.__webglTexture,0,bt(y)):(q===r.TEXTURE_2D||q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,z,q,Te.__webglTexture,se),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ht(P,y,k){if(r.bindRenderbuffer(r.RENDERBUFFER,P),y.depthBuffer){const z=y.depthTexture,q=z&&z.isDepthTexture?z.type:null,se=E(y.stencilBuffer,q),ue=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;wt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,bt(y),se,y.width,y.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,bt(y),se,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,se,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,P)}else{const z=y.textures;for(let q=0;q<z.length;q++){const se=z[q],ue=s.convert(se.format,se.colorSpace),K=s.convert(se.type),$=v(se.internalFormat,ue,K,se.normalized,se.colorSpace);wt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,bt(y),$,y.width,y.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,bt(y),$,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,$,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ve(P,y,k){const z=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=n.get(y.depthTexture);if(q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),z){if(q.__webglInit===void 0&&(q.__webglInit=!0,y.depthTexture.addEventListener("dispose",w)),q.__webglTexture===void 0){q.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture),Fe(r.TEXTURE_CUBE_MAP,y.depthTexture);const le=s.convert(y.depthTexture.format),Te=s.convert(y.depthTexture.type);let ie;y.depthTexture.format===ti?ie=r.DEPTH_COMPONENT24:y.depthTexture.format===Ii&&(ie=r.DEPTH24_STENCIL8);for(let ce=0;ce<6;ce++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,ie,y.width,y.height,0,le,Te,null)}}else Q(y.depthTexture,0);const se=q.__webglTexture,ue=bt(y),K=z?r.TEXTURE_CUBE_MAP_POSITIVE_X+k:r.TEXTURE_2D,$=y.depthTexture.format===Ii?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(y.depthTexture.format===ti)wt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$,K,se,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,$,K,se,0);else if(y.depthTexture.format===Ii)wt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$,K,se,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,$,K,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function at(P){const y=n.get(P),k=P.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==P.depthTexture){const z=P.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),z){const q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,z.removeEventListener("dispose",q)};z.addEventListener("dispose",q),y.__depthDisposeCallback=q}y.__boundDepthTexture=z}if(P.depthTexture&&!y.__autoAllocateDepthBuffer)if(k)for(let z=0;z<6;z++)Ve(y.__webglFramebuffer[z],P,z);else{const z=P.texture.mipmaps;z&&z.length>0?Ve(y.__webglFramebuffer[0],P,0):Ve(y.__webglFramebuffer,P,0)}else if(k){y.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[z]),y.__webglDepthbuffer[z]===void 0)y.__webglDepthbuffer[z]=r.createRenderbuffer(),ht(y.__webglDepthbuffer[z],P,!1);else{const q=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,se=y.__webglDepthbuffer[z];r.bindRenderbuffer(r.RENDERBUFFER,se),r.framebufferRenderbuffer(r.FRAMEBUFFER,q,r.RENDERBUFFER,se)}}else{const z=P.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=r.createRenderbuffer(),ht(y.__webglDepthbuffer,P,!1);else{const q=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,se=y.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,se),r.framebufferRenderbuffer(r.FRAMEBUFFER,q,r.RENDERBUFFER,se)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function et(P,y,k){const z=n.get(P);y!==void 0&&Ce(z.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),k!==void 0&&at(P)}function je(P){const y=P.texture,k=n.get(P),z=n.get(y);P.addEventListener("dispose",x);const q=P.textures,se=P.isWebGLCubeRenderTarget===!0,ue=q.length>1;if(ue||(z.__webglTexture===void 0&&(z.__webglTexture=r.createTexture()),z.__version=y.version,a.memory.textures++),se){k.__webglFramebuffer=[];for(let K=0;K<6;K++)if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer[K]=[];for(let $=0;$<y.mipmaps.length;$++)k.__webglFramebuffer[K][$]=r.createFramebuffer()}else k.__webglFramebuffer[K]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer=[];for(let K=0;K<y.mipmaps.length;K++)k.__webglFramebuffer[K]=r.createFramebuffer()}else k.__webglFramebuffer=r.createFramebuffer();if(ue)for(let K=0,$=q.length;K<$;K++){const le=n.get(q[K]);le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture(),a.memory.textures++)}if(P.samples>0&&wt(P)===!1){k.__webglMultisampledFramebuffer=r.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let K=0;K<q.length;K++){const $=q[K];k.__webglColorRenderbuffer[K]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,k.__webglColorRenderbuffer[K]);const le=s.convert($.format,$.colorSpace),Te=s.convert($.type),ie=v($.internalFormat,le,Te,$.normalized,$.colorSpace,P.isXRRenderTarget===!0),ce=bt(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,ce,ie,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+K,r.RENDERBUFFER,k.__webglColorRenderbuffer[K])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(k.__webglDepthRenderbuffer=r.createRenderbuffer(),ht(k.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(se){t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture),Fe(r.TEXTURE_CUBE_MAP,y);for(let K=0;K<6;K++)if(y.mipmaps&&y.mipmaps.length>0)for(let $=0;$<y.mipmaps.length;$++)Ce(k.__webglFramebuffer[K][$],P,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+K,$);else Ce(k.__webglFramebuffer[K],P,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);m(y)&&S(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let K=0,$=q.length;K<$;K++){const le=q[K],Te=n.get(le);let ie=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ie=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ie,Te.__webglTexture),Fe(ie,le),Ce(k.__webglFramebuffer,P,le,r.COLOR_ATTACHMENT0+K,ie,0),m(le)&&S(ie)}t.unbindTexture()}else{let K=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(K=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(K,z.__webglTexture),Fe(K,y),y.mipmaps&&y.mipmaps.length>0)for(let $=0;$<y.mipmaps.length;$++)Ce(k.__webglFramebuffer[$],P,y,r.COLOR_ATTACHMENT0,K,$);else Ce(k.__webglFramebuffer,P,y,r.COLOR_ATTACHMENT0,K,0);m(y)&&S(K),t.unbindTexture()}P.depthBuffer&&at(P)}function Tt(P){const y=P.textures;for(let k=0,z=y.length;k<z;k++){const q=y[k];if(m(q)){const se=M(P),ue=n.get(q).__webglTexture;t.bindTexture(se,ue),S(se),t.unbindTexture()}}}const Rt=[],At=[];function Nt(P){if(P.samples>0){if(wt(P)===!1){const y=P.textures,k=P.width,z=P.height;let q=r.COLOR_BUFFER_BIT;const se=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ue=n.get(P),K=y.length>1;if(K)for(let le=0;le<y.length;le++)t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const $=P.texture.mipmaps;$&&$.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let le=0;le<y.length;le++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(q|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(q|=r.STENCIL_BUFFER_BIT)),K){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const Te=n.get(y[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Te,0)}r.blitFramebuffer(0,0,k,z,0,0,k,z,q,r.NEAREST),l===!0&&(Rt.length=0,At.length=0,Rt.push(r.COLOR_ATTACHMENT0+le),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Rt.push(se),At.push(se),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,At)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Rt))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),K)for(let le=0;le<y.length;le++){t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const Te=n.get(y[le]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,Te,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const y=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function bt(P){return Math.min(i.maxSamples,P.samples)}function wt(P){const y=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function N(P){const y=a.render.frame;h.get(P)!==y&&(h.set(P,y),P.update())}function Xt(P,y){const k=P.colorSpace,z=P.format,q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||k!==hn&&k!==_i&&(ze.getTransfer(k)===ut?(z!==_n||q!==cn)&&Ae("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ue("WebGLTextures: Unsupported texture color space:",k)),y}function tt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=H,this.getTextureUnits=Y,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=ne,this.setTexture3D=fe,this.setTextureCube=de,this.rebindTextures=et,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=at,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=wt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function cx(r,e){function t(n,i=_i){let s;const a=ze.getTransfer(i);if(n===cn)return r.UNSIGNED_BYTE;if(n===vl)return r.UNSIGNED_SHORT_4_4_4_4;if(n===yl)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Vh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Gh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bh)return r.BYTE;if(n===zh)return r.SHORT;if(n===Gs)return r.UNSIGNED_SHORT;if(n===xl)return r.INT;if(n===Vn)return r.UNSIGNED_INT;if(n===gn)return r.FLOAT;if(n===ei)return r.HALF_FLOAT;if(n===Hh)return r.ALPHA;if(n===Wh)return r.RGB;if(n===_n)return r.RGBA;if(n===ti)return r.DEPTH_COMPONENT;if(n===Ii)return r.DEPTH_STENCIL;if(n===Ml)return r.RED;if(n===Sl)return r.RED_INTEGER;if(n===Di)return r.RG;if(n===bl)return r.RG_INTEGER;if(n===wl)return r.RGBA_INTEGER;if(n===Yr||n===$r||n===Zr||n===Jr)if(a===ut)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Yr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Yr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$r)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Zr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Jr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eo||n===Ao||n===Co||n===Ro)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Eo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ao)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Co)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ro)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Po||n===Io||n===Lo||n===Do||n===Fo||n===ta||n===No)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Po||n===Io)return a===ut?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Lo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Do)return s.COMPRESSED_R11_EAC;if(n===Fo)return s.COMPRESSED_SIGNED_R11_EAC;if(n===ta)return s.COMPRESSED_RG11_EAC;if(n===No)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Uo||n===Oo||n===ko||n===Bo||n===zo||n===Vo||n===Go||n===Ho||n===Wo||n===Xo||n===qo||n===Ko||n===Yo||n===$o)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Uo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Oo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ko)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Bo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Vo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Go)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ho)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Wo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===qo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ko)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yo)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$o)return a===ut?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Zo||n===Jo||n===jo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Zo)return a===ut?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Jo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===jo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Qo||n===el||n===na||n===tl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Qo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===el)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===na)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===tl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const hx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ux=`
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

}`;class dx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new eu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Cn({vertexShader:hx,fragmentShader:ux,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ee(new sr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fx extends Mi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",g=new dx,m={},S=t.getContextAttributes();let M=null,v=null;const E=[],T=[],w=new Oe;let x=null;const R=new $t;R.viewport=new rt;const I=new $t;I.viewport=new rt;const L=[R,I],D=new hp;let H=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let re=E[J];return re===void 0&&(re=new Da,E[J]=re),re.getTargetRaySpace()},this.getControllerGrip=function(J){let re=E[J];return re===void 0&&(re=new Da,E[J]=re),re.getGripSpace()},this.getHand=function(J){let re=E[J];return re===void 0&&(re=new Da,E[J]=re),re.getHandSpace()};function O(J){const re=T.indexOf(J.inputSource);if(re===-1)return;const te=E[re];te!==void 0&&(te.update(J.inputSource,J.frame,c||a),te.dispatchEvent({type:J.type,data:J.inputSource}))}function X(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",B);for(let J=0;J<E.length;J++){const re=T[J];re!==null&&(T[J]=null,E[J].disconnect(re))}H=null,Y=null,g.reset();for(const J in m)delete m[J];e.setRenderTarget(M),f=null,d=null,u=null,i=null,v=null,Fe.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&Ae("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Ae("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(M=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",X),i.addEventListener("inputsourceschange",B),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(w),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Le=null,Ne=null;S.depth&&(Ne=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=S.stencil?Ii:ti,Le=S.stencil?Hs:Vn);const Ce={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Ce),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new zn(d.textureWidth,d.textureHeight,{format:_n,type:cn,depthTexture:new ps(d.textureWidth,d.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const te={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,te),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new zn(f.framebufferWidth,f.framebufferHeight,{format:_n,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Fe.setContext(i),Fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function B(J){for(let re=0;re<J.removed.length;re++){const te=J.removed[re],Le=T.indexOf(te);Le>=0&&(T[Le]=null,E[Le].disconnect(te))}for(let re=0;re<J.added.length;re++){const te=J.added[re];let Le=T.indexOf(te);if(Le===-1){for(let Ce=0;Ce<E.length;Ce++)if(Ce>=T.length){T.push(te),Le=Ce;break}else if(T[Ce]===null){T[Ce]=te,Le=Ce;break}if(Le===-1)break}const Ne=E[Le];Ne&&Ne.connect(te)}}const Q=new b,ne=new b;function fe(J,re,te){Q.setFromMatrixPosition(re.matrixWorld),ne.setFromMatrixPosition(te.matrixWorld);const Le=Q.distanceTo(ne),Ne=re.projectionMatrix.elements,Ce=te.projectionMatrix.elements,ht=Ne[14]/(Ne[10]-1),Ve=Ne[14]/(Ne[10]+1),at=(Ne[9]+1)/Ne[5],et=(Ne[9]-1)/Ne[5],je=(Ne[8]-1)/Ne[0],Tt=(Ce[8]+1)/Ce[0],Rt=ht*je,At=ht*Tt,Nt=Le/(-je+Tt),bt=Nt*-je;if(re.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(bt),J.translateZ(Nt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ne[10]===-1)J.projectionMatrix.copy(re.projectionMatrix),J.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const wt=ht+Nt,N=Ve+Nt,Xt=Rt-bt,tt=At+(Le-bt),P=at*Ve/N*wt,y=et*Ve/N*wt;J.projectionMatrix.makePerspective(Xt,tt,P,y,wt,N),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function de(J,re){re===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(re.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let re=J.near,te=J.far;g.texture!==null&&(g.depthNear>0&&(re=g.depthNear),g.depthFar>0&&(te=g.depthFar)),D.near=I.near=R.near=re,D.far=I.far=R.far=te,(H!==D.near||Y!==D.far)&&(i.updateRenderState({depthNear:D.near,depthFar:D.far}),H=D.near,Y=D.far),D.layers.mask=J.layers.mask|6,R.layers.mask=D.layers.mask&-5,I.layers.mask=D.layers.mask&-3;const Le=J.parent,Ne=D.cameras;de(D,Le);for(let Ce=0;Ce<Ne.length;Ce++)de(Ne[Ce],Le);Ne.length===2?fe(D,R,I):D.projectionMatrix.copy(R.projectionMatrix),ye(J,D,Le)};function ye(J,re,te){te===null?J.matrix.copy(re.matrixWorld):(J.matrix.copy(te.matrixWorld),J.matrix.invert(),J.matrix.multiply(re.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(re.projectionMatrix),J.projectionMatrixInverse.copy(re.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=fs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(J){return m[J]};let qe=null;function Ze(J,re){if(h=re.getViewerPose(c||a),p=re,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Le=!1;te.length!==D.cameras.length&&(D.cameras.length=0,Le=!0);for(let Ve=0;Ve<te.length;Ve++){const at=te[Ve];let et=null;if(f!==null)et=f.getViewport(at);else{const Tt=u.getViewSubImage(d,at);et=Tt.viewport,Ve===0&&(e.setRenderTargetTextures(v,Tt.colorTexture,Tt.depthStencilTexture),e.setRenderTarget(v))}let je=L[Ve];je===void 0&&(je=new $t,je.layers.enable(Ve),je.viewport=new rt,L[Ve]=je),je.matrix.fromArray(at.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(at.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(et.x,et.y,et.width,et.height),Ve===0&&(D.matrix.copy(je.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Le===!0&&D.cameras.push(je)}const Ne=i.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Ve=u.getDepthInformation(te[0]);Ve&&Ve.isValid&&Ve.texture&&g.init(Ve,i.renderState)}if(Ne&&Ne.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ve=0;Ve<te.length;Ve++){const at=te[Ve].camera;if(at){let et=m[at];et||(et=new eu,m[at]=et);const je=u.getCameraImage(at);et.sourceTexture=je}}}}for(let te=0;te<E.length;te++){const Le=T[te],Ne=E[te];Le!==null&&Ne!==void 0&&Ne.update(Le,re,c||a)}qe&&qe(J,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),p=null}const Fe=new du;Fe.setAnimationLoop(Ze),this.setAnimationLoop=function(J){qe=J},this.dispose=function(){}}}const px=new Se,vu=new Be;vu.set(-1,0,0,0,1,0,0,0,1);function mx(r,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,ru(r)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,S,M,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(g,m):m.isMeshLambertMaterial?(s(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(g,m),u(g,m)):m.isMeshPhongMaterial?(s(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,v)):m.isMeshMatcapMaterial?(s(g,m),p(g,m)):m.isMeshDepthMaterial?s(g,m):m.isMeshDistanceMaterial?(s(g,m),_(g,m)):m.isMeshNormalMaterial?s(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,S,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Jt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Jt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const S=e.get(m),M=S.envMap,v=S.envMapRotation;M&&(g.envMap.value=M,g.envMapRotation.value.setFromMatrix4(px.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(vu),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,S,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*S,g.scale.value=M*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,S){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Jt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){const S=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function gx(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,E){const T=E.program;n.uniformBlockBinding(v,T)}function c(v,E){let T=i[v.id];T===void 0&&(g(v),T=h(v),i[v.id]=T,v.addEventListener("dispose",S));const w=E.program;n.updateUBOMapping(v,w);const x=e.render.frame;s[v.id]!==x&&(d(v),s[v.id]=x)}function h(v){const E=u();v.__bindingPointIndex=E;const T=r.createBuffer(),w=v.__size,x=v.usage;return r.bindBuffer(r.UNIFORM_BUFFER,T),r.bufferData(r.UNIFORM_BUFFER,w,x),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,E,T),T}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ue("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const E=i[v.id],T=v.uniforms,w=v.__cache;r.bindBuffer(r.UNIFORM_BUFFER,E);for(let x=0,R=T.length;x<R;x++){const I=T[x];if(Array.isArray(I))for(let L=0,D=I.length;L<D;L++)f(I[L],x,L,w);else f(I,x,0,w)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(v,E,T,w){if(_(v,E,T,w)===!0){const x=v.__offset,R=v.value;if(Array.isArray(R)){let I=0;for(let L=0;L<R.length;L++){const D=R[L],H=m(D);p(D,v.__data,I),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(I+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(R,v.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,x,v.__data)}}function p(v,E,T){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,T)}function _(v,E,T,w){const x=v.value,R=E+"_"+T;if(w[R]===void 0)return typeof x=="number"||typeof x=="boolean"?w[R]=x:ArrayBuffer.isView(x)?w[R]=x.slice():w[R]=x.clone(),!0;{const I=w[R];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return w[R]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function g(v){const E=v.uniforms;let T=0;const w=16;for(let R=0,I=E.length;R<I;R++){const L=Array.isArray(E[R])?E[R]:[E[R]];for(let D=0,H=L.length;D<H;D++){const Y=L[D],O=Array.isArray(Y.value)?Y.value:[Y.value];for(let X=0,B=O.length;X<B;X++){const Q=O[X],ne=m(Q),fe=T%w,de=fe%ne.boundary,ye=fe+de;T+=de,ye!==0&&w-ye<ne.storage&&(T+=w-ye),Y.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=T,T+=ne.storage}}}const x=T%w;return x>0&&(T+=w-x),v.__size=T,v.__cache={},this}function m(v){const E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Ae("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Ae("WebGLRenderer: Unsupported uniform value type.",v),E}function S(v){const E=v.target;E.removeEventListener("dispose",S);const T=a.indexOf(E.__bindingPointIndex);a.splice(T,1),r.deleteBuffer(i[E.id]),delete i[E.id],delete s[E.id]}function M(){for(const v in i)r.deleteBuffer(i[v]);a=[],i={},s={}}return{bind:l,update:c,dispose:M}}const _x=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Fn=null;function xx(){return Fn===null&&(Fn=new Dl(_x,16,16,Di,ei),Fn.name="DFG_LUT",Fn.minFilter=Ot,Fn.magFilter=Ot,Fn.wrapS=mn,Fn.wrapT=mn,Fn.generateMipmaps=!1,Fn.needsUpdate=!0),Fn}class vx{constructor(e={}){const{canvas:t=Td(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=cn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=f,g=new Set([wl,bl,Sl]),m=new Set([cn,Vn,Gs,Hs,vl,yl]),S=new Uint32Array(4),M=new Int32Array(4),v=new b;let E=null,T=null;const w=[],x=[];let R=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let L=!1,D=null,H=null,Y=null,O=null;this._outputColorSpace=ct;let X=0,B=0,Q=null,ne=-1,fe=null;const de=new rt,ye=new rt;let qe=null;const Ze=new Me(0);let Fe=0,J=t.width,re=t.height,te=1,Le=null,Ne=null;const Ce=new rt(0,0,J,re),ht=new rt(0,0,J,re);let Ve=!1;const at=new Fl;let et=!1,je=!1;const Tt=new Se,Rt=new b,At=new rt,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function wt(){return Q===null?te:1}let N=n;function Xt(A,U){return t.getContext(A,U)}try{const A={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${gl}`),t.addEventListener("webglcontextlost",Ge,!1),t.addEventListener("webglcontextrestored",Qe,!1),t.addEventListener("webglcontextcreationerror",vn,!1),N===null){const U="webgl2";if(N=Xt(U,A),N===null)throw Xt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(A){throw Ue("WebGLRenderer: "+A.message),A}let tt,P,y,k,z,q,se,ue,K,$,le,Te,ie,ce,Pe,De,me,F,ae,Z,oe,pe,j;function _e(){tt=new x0(N),tt.init(),oe=new cx(N,tt),P=new h0(N,tt,e,oe),y=new ox(N,tt),P.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),H=N.createFramebuffer(),Y=N.createFramebuffer(),O=N.createFramebuffer(),k=new M0(N),z=new K_,q=new lx(N,tt,y,z,P,oe,k),se=new _0(I),ue=new Tp(N),pe=new l0(N,ue),K=new v0(N,ue,k,pe),$=new b0(N,K,ue,pe,k),F=new S0(N,P,q),Pe=new u0(z),le=new q_(I,se,tt,P,pe,Pe),Te=new mx(I,z),ie=new $_,ce=new tx(tt),me=new o0(I,se,y,$,p,l),De=new ax(I,$,P),j=new gx(N,k,P,y),ae=new c0(N,tt,k),Z=new y0(N,tt,k),k.programs=le.programs,I.capabilities=P,I.extensions=tt,I.properties=z,I.renderLists=ie,I.shadowMap=De,I.state=y,I.info=k}_e(),_!==cn&&(R=new T0(_,t.width,t.height,o,i,s));const he=new fx(I,N);this.xr=he,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=tt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=tt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(A){A!==void 0&&(te=A,this.setSize(J,re,!1))},this.getSize=function(A){return A.set(J,re)},this.setSize=function(A,U,W=!0){if(he.isPresenting){Ae("WebGLRenderer: Can't change size while VR device is presenting.");return}J=A,re=U,t.width=Math.floor(A*te),t.height=Math.floor(U*te),W===!0&&(t.style.width=A+"px",t.style.height=U+"px"),R!==null&&R.setSize(t.width,t.height),this.setViewport(0,0,A,U)},this.getDrawingBufferSize=function(A){return A.set(J*te,re*te).floor()},this.setDrawingBufferSize=function(A,U,W){J=A,re=U,te=W,t.width=Math.floor(A*W),t.height=Math.floor(U*W),this.setViewport(0,0,A,U)},this.setEffects=function(A){if(_===cn){Ue("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let U=0;U<A.length;U++)if(A[U].isOutputPass===!0){Ae("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(de)},this.getViewport=function(A){return A.copy(Ce)},this.setViewport=function(A,U,W,V){A.isVector4?Ce.set(A.x,A.y,A.z,A.w):Ce.set(A,U,W,V),y.viewport(de.copy(Ce).multiplyScalar(te).round())},this.getScissor=function(A){return A.copy(ht)},this.setScissor=function(A,U,W,V){A.isVector4?ht.set(A.x,A.y,A.z,A.w):ht.set(A,U,W,V),y.scissor(ye.copy(ht).multiplyScalar(te).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(A){y.setScissorTest(Ve=A)},this.setOpaqueSort=function(A){Le=A},this.setTransparentSort=function(A){Ne=A},this.getClearColor=function(A){return A.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor(...arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha(...arguments)},this.clear=function(A=!0,U=!0,W=!0){let V=0;if(A){let G=!1;if(Q!==null){const ve=Q.texture.format;G=g.has(ve)}if(G){const ve=Q.texture.type,we=m.has(ve),xe=me.getClearColor(),Ee=me.getClearAlpha(),Re=xe.r,He=xe.g,Ye=xe.b;we?(S[0]=Re,S[1]=He,S[2]=Ye,S[3]=Ee,N.clearBufferuiv(N.COLOR,0,S)):(M[0]=Re,M[1]=He,M[2]=Ye,M[3]=Ee,N.clearBufferiv(N.COLOR,0,M))}else V|=N.COLOR_BUFFER_BIT}U&&(V|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(V|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&N.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),D=A},this.dispose=function(){t.removeEventListener("webglcontextlost",Ge,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",vn,!1),me.dispose(),ie.dispose(),ce.dispose(),z.dispose(),se.dispose(),$.dispose(),pe.dispose(),j.dispose(),le.dispose(),he.dispose(),he.removeEventListener("sessionstart",Yl),he.removeEventListener("sessionend",$l),Si.stop()};function Ge(A){A.preventDefault(),aa("WebGLRenderer: Context Lost."),L=!0}function Qe(){aa("WebGLRenderer: Context Restored."),L=!1;const A=k.autoReset,U=De.enabled,W=De.autoUpdate,V=De.needsUpdate,G=De.type;_e(),k.autoReset=A,De.enabled=U,De.autoUpdate=W,De.needsUpdate=V,De.type=G}function vn(A){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function rn(A){const U=A.target;U.removeEventListener("dispose",rn),Pn(U)}function Pn(A){In(A),z.remove(A)}function In(A){const U=z.get(A).programs;U!==void 0&&(U.forEach(function(W){le.releaseProgram(W)}),A.isShaderMaterial&&le.releaseShaderCache(A))}this.renderBufferDirect=function(A,U,W,V,G,ve){U===null&&(U=Nt);const we=G.isMesh&&G.matrixWorld.determinantAffine()<0,xe=Ou(A,U,W,V,G);y.setMaterial(V,we);let Ee=W.index,Re=1;if(V.wireframe===!0){if(Ee=K.getWireframeAttribute(W),Ee===void 0)return;Re=2}const He=W.drawRange,Ye=W.attributes.position;let Ie=He.start*Re,gt=(He.start+He.count)*Re;ve!==null&&(Ie=Math.max(Ie,ve.start*Re),gt=Math.min(gt,(ve.start+ve.count)*Re)),Ee!==null?(Ie=Math.max(Ie,0),gt=Math.min(gt,Ee.count)):Ye!=null&&(Ie=Math.max(Ie,0),gt=Math.min(gt,Ye.count));const Pt=gt-Ie;if(Pt<0||Pt===1/0)return;pe.setup(G,V,xe,W,Ee);let Ct,_t=ae;if(Ee!==null&&(Ct=ue.get(Ee),_t=Z,_t.setIndex(Ct)),G.isMesh)V.wireframe===!0?(y.setLineWidth(V.wireframeLinewidth*wt()),_t.setMode(N.LINES)):_t.setMode(N.TRIANGLES);else if(G.isLine){let qt=V.linewidth;qt===void 0&&(qt=1),y.setLineWidth(qt*wt()),G.isLineSegments?_t.setMode(N.LINES):G.isLineLoop?_t.setMode(N.LINE_LOOP):_t.setMode(N.LINE_STRIP)}else G.isPoints?_t.setMode(N.POINTS):G.isSprite&&_t.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(tt.get("WEBGL_multi_draw"))_t.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const qt=G._multiDrawStarts,be=G._multiDrawCounts,an=G._multiDrawCount,st=Ee?ue.get(Ee).bytesPerElement:1,un=z.get(V).currentProgram.getUniforms();for(let Ln=0;Ln<an;Ln++)un.setValue(N,"_gl_DrawID",Ln),_t.render(qt[Ln]/st,be[Ln])}else if(G.isInstancedMesh)_t.renderInstances(Ie,Pt,G.count);else if(W.isInstancedBufferGeometry){const qt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,be=Math.min(W.instanceCount,qt);_t.renderInstances(Ie,Pt,be)}else _t.render(Ie,Pt)};function Kl(A,U,W){A.transparent===!0&&A.side===en&&A.forceSinglePass===!1?(A.side=Jt,A.needsUpdate=!0,cr(A,U,W),A.side=Qn,A.needsUpdate=!0,cr(A,U,W),A.side=en):cr(A,U,W)}this.compile=function(A,U,W=null){W===null&&(W=A),T=ce.get(W),T.init(U),x.push(T),W.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),A!==W&&A.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights();const V=new Set;return A.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ve=G.material;if(ve)if(Array.isArray(ve))for(let we=0;we<ve.length;we++){const xe=ve[we];Kl(xe,W,G),V.add(xe)}else Kl(ve,W,G),V.add(ve)}),T=x.pop(),V},this.compileAsync=function(A,U,W=null){const V=this.compile(A,U,W);return new Promise(G=>{function ve(){if(V.forEach(function(we){z.get(we).currentProgram.isReady()&&V.delete(we)}),V.size===0){G(A);return}setTimeout(ve,10)}tt.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let wa=null;function Nu(A){wa&&wa(A)}function Yl(){Si.stop()}function $l(){Si.start()}const Si=new du;Si.setAnimationLoop(Nu),typeof self<"u"&&Si.setContext(self),this.setAnimationLoop=function(A){wa=A,he.setAnimationLoop(A),A===null?Si.stop():Si.start()},he.addEventListener("sessionstart",Yl),he.addEventListener("sessionend",$l),this.render=function(A,U){if(U!==void 0&&U.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;D!==null&&D.renderStart(A,U);const W=he.enabled===!0&&he.isPresenting===!0,V=R!==null&&(Q===null||W)&&R.begin(I,Q);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(he.cameraAutoUpdate===!0&&he.updateCamera(U),U=he.getCamera()),A.isScene===!0&&A.onBeforeRender(I,A,U,Q),T=ce.get(A,x.length),T.init(U),T.state.textureUnits=q.getTextureUnits(),x.push(T),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),at.setFromProjectionMatrix(Tt,kn,U.reversedDepth),je=this.localClippingEnabled,et=Pe.init(this.clippingPlanes,je),E=ie.get(A,w.length),E.init(),w.push(E),he.enabled===!0&&he.isPresenting===!0){const we=I.xr.getDepthSensingMesh();we!==null&&Ta(we,U,-1/0,I.sortObjects)}Ta(A,U,0,I.sortObjects),E.finish(),I.sortObjects===!0&&E.sort(Le,Ne,U.reversedDepth),bt=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,bt&&me.addToRenderList(E,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),et===!0&&Pe.beginShadows();const G=T.state.shadowsArray;if(De.render(G,A,U),et===!0&&Pe.endShadows(),(V&&R.hasRenderPass())===!1){const we=E.opaque,xe=E.transmissive;if(T.setupLights(),U.isArrayCamera){const Ee=U.cameras;if(xe.length>0)for(let Re=0,He=Ee.length;Re<He;Re++){const Ye=Ee[Re];Jl(we,xe,A,Ye)}bt&&me.render(A);for(let Re=0,He=Ee.length;Re<He;Re++){const Ye=Ee[Re];Zl(E,A,Ye,Ye.viewport)}}else xe.length>0&&Jl(we,xe,A,U),bt&&me.render(A),Zl(E,A,U)}Q!==null&&B===0&&(q.updateMultisampleRenderTarget(Q),q.updateRenderTargetMipmap(Q)),V&&R.end(I),A.isScene===!0&&A.onAfterRender(I,A,U),pe.resetDefaultState(),ne=-1,fe=null,x.pop(),x.length>0?(T=x[x.length-1],q.setTextureUnits(T.state.textureUnits),et===!0&&Pe.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?E=w[w.length-1]:E=null,D!==null&&D.renderEnd()};function Ta(A,U,W,V){if(A.visible===!1)return;if(A.layers.test(U.layers)){if(A.isGroup)W=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(U);else if(A.isLightProbeGrid)T.pushLightProbeGrid(A);else if(A.isLight)T.pushLight(A),A.castShadow&&T.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||at.intersectsSprite(A)){V&&At.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Tt);const we=$.update(A),xe=A.material;xe.visible&&E.push(A,we,xe,W,At.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||at.intersectsObject(A))){const we=$.update(A),xe=A.material;if(V&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),At.copy(A.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),At.copy(we.boundingSphere.center)),At.applyMatrix4(A.matrixWorld).applyMatrix4(Tt)),Array.isArray(xe)){const Ee=we.groups;for(let Re=0,He=Ee.length;Re<He;Re++){const Ye=Ee[Re],Ie=xe[Ye.materialIndex];Ie&&Ie.visible&&E.push(A,we,Ie,W,At.z,Ye)}}else xe.visible&&E.push(A,we,xe,W,At.z,null)}}const ve=A.children;for(let we=0,xe=ve.length;we<xe;we++)Ta(ve[we],U,W,V)}function Zl(A,U,W,V){const{opaque:G,transmissive:ve,transparent:we}=A;T.setupLightsView(W),et===!0&&Pe.setGlobalState(I.clippingPlanes,W),V&&y.viewport(de.copy(V)),G.length>0&&lr(G,U,W),ve.length>0&&lr(ve,U,W),we.length>0&&lr(we,U,W),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Jl(A,U,W,V){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){const Ie=tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new zn(1,1,{generateMipmaps:!0,type:Ie?ei:cn,minFilter:On,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ze.workingColorSpace})}const ve=T.state.transmissionRenderTarget[V.id],we=V.viewport||de;ve.setSize(we.z*I.transmissionResolutionScale,we.w*I.transmissionResolutionScale);const xe=I.getRenderTarget(),Ee=I.getActiveCubeFace(),Re=I.getActiveMipmapLevel();I.setRenderTarget(ve),I.getClearColor(Ze),Fe=I.getClearAlpha(),Fe<1&&I.setClearColor(16777215,.5),I.clear(),bt&&me.render(W);const He=I.toneMapping;I.toneMapping=Bn;const Ye=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),et===!0&&Pe.setGlobalState(I.clippingPlanes,V),lr(A,W,V),q.updateMultisampleRenderTarget(ve),q.updateRenderTargetMipmap(ve),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let gt=0,Pt=U.length;gt<Pt;gt++){const Ct=U[gt],{object:_t,geometry:qt,material:be,group:an}=Ct;if(be.side===en&&_t.layers.test(V.layers)){const st=be.side;be.side=Jt,be.needsUpdate=!0,jl(_t,W,V,qt,be,an),be.side=st,be.needsUpdate=!0,Ie=!0}}Ie===!0&&(q.updateMultisampleRenderTarget(ve),q.updateRenderTargetMipmap(ve))}I.setRenderTarget(xe,Ee,Re),I.setClearColor(Ze,Fe),Ye!==void 0&&(V.viewport=Ye),I.toneMapping=He}function lr(A,U,W){const V=U.isScene===!0?U.overrideMaterial:null;for(let G=0,ve=A.length;G<ve;G++){const we=A[G],{object:xe,geometry:Ee,group:Re}=we;let He=we.material;He.allowOverride===!0&&V!==null&&(He=V),xe.layers.test(W.layers)&&jl(xe,U,W,Ee,He,Re)}}function jl(A,U,W,V,G,ve){A.onBeforeRender(I,U,W,V,G,ve),A.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(I,U,W,V,A,ve),G.transparent===!0&&G.side===en&&G.forceSinglePass===!1?(G.side=Jt,G.needsUpdate=!0,I.renderBufferDirect(W,U,V,G,A,ve),G.side=Qn,G.needsUpdate=!0,I.renderBufferDirect(W,U,V,G,A,ve),G.side=en):I.renderBufferDirect(W,U,V,G,A,ve),A.onAfterRender(I,U,W,V,G,ve)}function cr(A,U,W){U.isScene!==!0&&(U=Nt);const V=z.get(A),G=T.state.lights,ve=T.state.shadowsArray,we=G.state.version,xe=le.getParameters(A,G.state,ve,U,W,T.state.lightProbeGridArray),Ee=le.getProgramCacheKey(xe);let Re=V.programs;V.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;const He=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;V.envMap=se.get(A.envMap||V.environment,He),V.envMapRotation=V.environment!==null&&A.envMap===null?U.environmentRotation:A.envMapRotation,Re===void 0&&(A.addEventListener("dispose",rn),Re=new Map,V.programs=Re);let Ye=Re.get(Ee);if(Ye!==void 0){if(V.currentProgram===Ye&&V.lightsStateVersion===we)return ec(A,xe),Ye}else xe.uniforms=le.getUniforms(A),D!==null&&A.isNodeMaterial&&D.build(A,W,xe),A.onBeforeCompile(xe,I),Ye=le.acquireProgram(xe,Ee),Re.set(Ee,Ye),V.uniforms=xe.uniforms;const Ie=V.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ie.clippingPlanes=Pe.uniform),ec(A,xe),V.needsLights=Bu(A),V.lightsStateVersion=we,V.needsLights&&(Ie.ambientLightColor.value=G.state.ambient,Ie.lightProbe.value=G.state.probe,Ie.directionalLights.value=G.state.directional,Ie.directionalLightShadows.value=G.state.directionalShadow,Ie.spotLights.value=G.state.spot,Ie.spotLightShadows.value=G.state.spotShadow,Ie.rectAreaLights.value=G.state.rectArea,Ie.ltc_1.value=G.state.rectAreaLTC1,Ie.ltc_2.value=G.state.rectAreaLTC2,Ie.pointLights.value=G.state.point,Ie.pointLightShadows.value=G.state.pointShadow,Ie.hemisphereLights.value=G.state.hemi,Ie.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ie.spotLightMatrix.value=G.state.spotLightMatrix,Ie.spotLightMap.value=G.state.spotLightMap,Ie.pointShadowMatrix.value=G.state.pointShadowMatrix),V.lightProbeGrid=T.state.lightProbeGridArray.length>0,V.currentProgram=Ye,V.uniformsList=null,Ye}function Ql(A){if(A.uniformsList===null){const U=A.currentProgram.getUniforms();A.uniformsList=jr.seqWithValue(U.seq,A.uniforms)}return A.uniformsList}function ec(A,U){const W=z.get(A);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function Uu(A,U){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let W=0,V=A.length;W<V;W++){const G=A[W];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function Ou(A,U,W,V,G){U.isScene!==!0&&(U=Nt),q.resetTextureUnits();const ve=U.fog,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,xe=Q===null?I.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ze.workingColorSpace,Ee=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Re=se.get(V.envMap||we,Ee),He=V.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ye=!!W.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ie=!!W.morphAttributes.position,gt=!!W.morphAttributes.normal,Pt=!!W.morphAttributes.color;let Ct=Bn;V.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ct=I.toneMapping);const _t=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,qt=_t!==void 0?_t.length:0,be=z.get(V),an=T.state.lights;if(et===!0&&(je===!0||A!==fe)){const vt=A===fe&&V.id===ne;Pe.setState(V,A,vt)}let st=!1;V.version===be.__version?(be.needsLights&&be.lightsStateVersion!==an.state.version||be.outputColorSpace!==xe||G.isBatchedMesh&&be.batching===!1||!G.isBatchedMesh&&be.batching===!0||G.isBatchedMesh&&be.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&be.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&be.instancing===!1||!G.isInstancedMesh&&be.instancing===!0||G.isSkinnedMesh&&be.skinning===!1||!G.isSkinnedMesh&&be.skinning===!0||G.isInstancedMesh&&be.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&be.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&be.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&be.instancingMorph===!1&&G.morphTexture!==null||be.envMap!==Re||V.fog===!0&&be.fog!==ve||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==Pe.numPlanes||be.numIntersection!==Pe.numIntersection)||be.vertexAlphas!==He||be.vertexTangents!==Ye||be.morphTargets!==Ie||be.morphNormals!==gt||be.morphColors!==Pt||be.toneMapping!==Ct||be.morphTargetsCount!==qt||!!be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,be.__version=V.version);let un=be.currentProgram;st===!0&&(un=cr(V,U,G),D&&V.isNodeMaterial&&D.onUpdateProgram(V,un,be));let Ln=!1,si=!1,Oi=!1;const xt=un.getUniforms(),It=be.uniforms;if(y.useProgram(un.program)&&(Ln=!0,si=!0,Oi=!0),V.id!==ne&&(ne=V.id,si=!0),be.needsLights){const vt=Uu(T.state.lightProbeGridArray,G);be.lightProbeGrid!==vt&&(be.lightProbeGrid=vt,si=!0)}if(Ln||fe!==A){y.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),xt.setValue(N,"projectionMatrix",A.projectionMatrix),xt.setValue(N,"viewMatrix",A.matrixWorldInverse);const ai=xt.map.cameraPosition;ai!==void 0&&ai.setValue(N,Rt.setFromMatrixPosition(A.matrixWorld)),P.logarithmicDepthBuffer&&xt.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&xt.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),fe!==A&&(fe=A,si=!0,Oi=!0)}if(be.needsLights&&(an.state.directionalShadowMap.length>0&&xt.setValue(N,"directionalShadowMap",an.state.directionalShadowMap,q),an.state.spotShadowMap.length>0&&xt.setValue(N,"spotShadowMap",an.state.spotShadowMap,q),an.state.pointShadowMap.length>0&&xt.setValue(N,"pointShadowMap",an.state.pointShadowMap,q)),G.isSkinnedMesh){xt.setOptional(N,G,"bindMatrix"),xt.setOptional(N,G,"bindMatrixInverse");const vt=G.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),xt.setValue(N,"boneTexture",vt.boneTexture,q))}G.isBatchedMesh&&(xt.setOptional(N,G,"batchingTexture"),xt.setValue(N,"batchingTexture",G._matricesTexture,q),xt.setOptional(N,G,"batchingIdTexture"),xt.setValue(N,"batchingIdTexture",G._indirectTexture,q),xt.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&xt.setValue(N,"batchingColorTexture",G._colorsTexture,q));const ri=W.morphAttributes;if((ri.position!==void 0||ri.normal!==void 0||ri.color!==void 0)&&F.update(G,W,un),(si||be.receiveShadow!==G.receiveShadow)&&(be.receiveShadow=G.receiveShadow,xt.setValue(N,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(It.envMapIntensity.value=U.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=xx()),si){if(xt.setValue(N,"toneMappingExposure",I.toneMappingExposure),be.needsLights&&ku(It,Oi),ve&&V.fog===!0&&Te.refreshFogUniforms(It,ve),Te.refreshMaterialUniforms(It,V,te,re,T.state.transmissionRenderTarget[A.id]),be.needsLights&&be.lightProbeGrid){const vt=be.lightProbeGrid;It.probesSH.value=vt.texture,It.probesMin.value.copy(vt.boundingBox.min),It.probesMax.value.copy(vt.boundingBox.max),It.probesResolution.value.copy(vt.resolution)}jr.upload(N,Ql(be),It,q)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(jr.upload(N,Ql(be),It,q),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&xt.setValue(N,"center",G.center),xt.setValue(N,"modelViewMatrix",G.modelViewMatrix),xt.setValue(N,"normalMatrix",G.normalMatrix),xt.setValue(N,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){const vt=V.uniformsGroups;for(let ai=0,ki=vt.length;ai<ki;ai++){const tc=vt[ai];j.update(tc,un),j.bind(tc,un)}}return un}function ku(A,U){A.ambientLightColor.needsUpdate=U,A.lightProbe.needsUpdate=U,A.directionalLights.needsUpdate=U,A.directionalLightShadows.needsUpdate=U,A.pointLights.needsUpdate=U,A.pointLightShadows.needsUpdate=U,A.spotLights.needsUpdate=U,A.spotLightShadows.needsUpdate=U,A.rectAreaLights.needsUpdate=U,A.hemisphereLights.needsUpdate=U}function Bu(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(A,U,W){const V=z.get(A);V.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),z.get(A.texture).__webglTexture=U,z.get(A.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:W,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,U){const W=z.get(A);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(A,U=0,W=0){Q=A,X=U,B=W;let V=null,G=!1,ve=!1;if(A){const xe=z.get(A);if(xe.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(N.FRAMEBUFFER,xe.__webglFramebuffer),de.copy(A.viewport),ye.copy(A.scissor),qe=A.scissorTest,y.viewport(de),y.scissor(ye),y.setScissorTest(qe),ne=-1;return}else if(xe.__webglFramebuffer===void 0)q.setupRenderTarget(A);else if(xe.__hasExternalTextures)q.rebindTextures(A,z.get(A.texture).__webglTexture,z.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const He=A.depthTexture;if(xe.__boundDepthTexture!==He){if(He!==null&&z.has(He)&&(A.width!==He.image.width||A.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(A)}}const Ee=A.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ve=!0);const Re=z.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Re[U])?V=Re[U][W]:V=Re[U],G=!0):A.samples>0&&q.useMultisampledRTT(A)===!1?V=z.get(A).__webglMultisampledFramebuffer:Array.isArray(Re)?V=Re[W]:V=Re,de.copy(A.viewport),ye.copy(A.scissor),qe=A.scissorTest}else de.copy(Ce).multiplyScalar(te).floor(),ye.copy(ht).multiplyScalar(te).floor(),qe=Ve;if(W!==0&&(V=H),y.bindFramebuffer(N.FRAMEBUFFER,V)&&y.drawBuffers(A,V),y.viewport(de),y.scissor(ye),y.setScissorTest(qe),G){const xe=z.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,xe.__webglTexture,W)}else if(ve){const xe=U;for(let Ee=0;Ee<A.textures.length;Ee++){const Re=z.get(A.textures[Ee]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ee,Re.__webglTexture,W,xe)}}else if(A!==null&&W!==0){const xe=z.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xe.__webglTexture,W)}ne=-1},this.readRenderTargetPixels=function(A,U,W,V,G,ve,we,xe=0){if(!(A&&A.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Ee=Ee[we]),Ee){y.bindFramebuffer(N.FRAMEBUFFER,Ee);try{const Re=A.textures[xe],He=Re.format,Ye=Re.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!P.textureFormatReadable(He)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!P.textureTypeReadable(Ye)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=A.width-V&&W>=0&&W<=A.height-G&&N.readPixels(U,W,V,G,oe.convert(He),oe.convert(Ye),ve)}finally{const Re=Q!==null?z.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(A,U,W,V,G,ve,we,xe=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Ee=Ee[we]),Ee)if(U>=0&&U<=A.width-V&&W>=0&&W<=A.height-G){y.bindFramebuffer(N.FRAMEBUFFER,Ee);const Re=A.textures[xe],He=Re.format,Ye=Re.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!P.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!P.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ie=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ie),N.bufferData(N.PIXEL_PACK_BUFFER,ve.byteLength,N.STREAM_READ),N.readPixels(U,W,V,G,oe.convert(He),oe.convert(Ye),0);const gt=Q!==null?z.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,gt);const Pt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Ed(N,Pt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ie),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ve),N.deleteBuffer(Ie),N.deleteSync(Pt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,U=null,W=0){const V=Math.pow(2,-W),G=Math.floor(A.image.width*V),ve=Math.floor(A.image.height*V),we=U!==null?U.x:0,xe=U!==null?U.y:0;q.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,we,xe,G,ve),y.unbindTexture()},this.copyTextureToTexture=function(A,U,W=null,V=null,G=0,ve=0){let we,xe,Ee,Re,He,Ye,Ie,gt,Pt;const Ct=A.isCompressedTexture?A.mipmaps[ve]:A.image;if(W!==null)we=W.max.x-W.min.x,xe=W.max.y-W.min.y,Ee=W.isBox3?W.max.z-W.min.z:1,Re=W.min.x,He=W.min.y,Ye=W.isBox3?W.min.z:0;else{const It=Math.pow(2,-G);we=Math.floor(Ct.width*It),xe=Math.floor(Ct.height*It),A.isDataArrayTexture?Ee=Ct.depth:A.isData3DTexture?Ee=Math.floor(Ct.depth*It):Ee=1,Re=0,He=0,Ye=0}V!==null?(Ie=V.x,gt=V.y,Pt=V.z):(Ie=0,gt=0,Pt=0);const _t=oe.convert(U.format),qt=oe.convert(U.type);let be;U.isData3DTexture?(q.setTexture3D(U,0),be=N.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(q.setTexture2DArray(U,0),be=N.TEXTURE_2D_ARRAY):(q.setTexture2D(U,0),be=N.TEXTURE_2D),y.activeTexture(N.TEXTURE0),y.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,U.flipY),y.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),y.pixelStorei(N.UNPACK_ALIGNMENT,U.unpackAlignment);const an=y.getParameter(N.UNPACK_ROW_LENGTH),st=y.getParameter(N.UNPACK_IMAGE_HEIGHT),un=y.getParameter(N.UNPACK_SKIP_PIXELS),Ln=y.getParameter(N.UNPACK_SKIP_ROWS),si=y.getParameter(N.UNPACK_SKIP_IMAGES);y.pixelStorei(N.UNPACK_ROW_LENGTH,Ct.width),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ct.height),y.pixelStorei(N.UNPACK_SKIP_PIXELS,Re),y.pixelStorei(N.UNPACK_SKIP_ROWS,He),y.pixelStorei(N.UNPACK_SKIP_IMAGES,Ye);const Oi=A.isDataArrayTexture||A.isData3DTexture,xt=U.isDataArrayTexture||U.isData3DTexture;if(A.isDepthTexture){const It=z.get(A),ri=z.get(U),vt=z.get(It.__renderTarget),ai=z.get(ri.__renderTarget);y.bindFramebuffer(N.READ_FRAMEBUFFER,vt.__webglFramebuffer),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,ai.__webglFramebuffer);for(let ki=0;ki<Ee;ki++)Oi&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(A).__webglTexture,G,Ye+ki),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(U).__webglTexture,ve,Pt+ki)),N.blitFramebuffer(Re,He,we,xe,Ie,gt,we,xe,N.DEPTH_BUFFER_BIT,N.NEAREST);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||A.isRenderTargetTexture||z.has(A)){const It=z.get(A),ri=z.get(U);y.bindFramebuffer(N.READ_FRAMEBUFFER,Y),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,O);for(let vt=0;vt<Ee;vt++)Oi?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,It.__webglTexture,G,Ye+vt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,It.__webglTexture,G),xt?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ri.__webglTexture,ve,Pt+vt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ri.__webglTexture,ve),G!==0?N.blitFramebuffer(Re,He,we,xe,Ie,gt,we,xe,N.COLOR_BUFFER_BIT,N.NEAREST):xt?N.copyTexSubImage3D(be,ve,Ie,gt,Pt+vt,Re,He,we,xe):N.copyTexSubImage2D(be,ve,Ie,gt,Re,He,we,xe);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else xt?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(be,ve,Ie,gt,Pt,we,xe,Ee,_t,qt,Ct.data):U.isCompressedArrayTexture?N.compressedTexSubImage3D(be,ve,Ie,gt,Pt,we,xe,Ee,_t,Ct.data):N.texSubImage3D(be,ve,Ie,gt,Pt,we,xe,Ee,_t,qt,Ct):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ve,Ie,gt,we,xe,_t,qt,Ct.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ve,Ie,gt,Ct.width,Ct.height,_t,Ct.data):N.texSubImage2D(N.TEXTURE_2D,ve,Ie,gt,we,xe,_t,qt,Ct);y.pixelStorei(N.UNPACK_ROW_LENGTH,an),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,st),y.pixelStorei(N.UNPACK_SKIP_PIXELS,un),y.pixelStorei(N.UNPACK_SKIP_ROWS,Ln),y.pixelStorei(N.UNPACK_SKIP_IMAGES,si),ve===0&&U.generateMipmaps&&N.generateMipmap(be),y.unbindTexture()},this.initRenderTarget=function(A){z.get(A).__webglFramebuffer===void 0&&q.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?q.setTextureCube(A,0):A.isData3DTexture?q.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?q.setTexture2DArray(A,0):q.setTexture2D(A,0),y.unbindTexture()},this.resetState=function(){X=0,B=0,Q=null,y.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=ze._getUnpackColorSpace()}}class yx{constructor(e){C(this,"scene");C(this,"camera");C(this,"renderer");C(this,"dirLight");C(this,"ambientLight");this.scene=new sf,this.scene.background=new Me(657688),this.scene.fog=new ma(657688,.025),this.camera=new $t(60,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(0,3,5),this.renderer=new vx({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ph,this.renderer.toneMapping=_l,this.renderer.toneMappingExposure=1.3,this.setupLighting(),window.addEventListener("resize",()=>this.onWindowResize())}setupLighting(){this.ambientLight=new kl(4212848,1),this.scene.add(this.ambientLight),this.dirLight=new Qs(7702724,1.8),this.dirLight.position.set(20,40,-10),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.width=4096,this.dirLight.shadow.mapSize.height=4096,this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=150,this.dirLight.shadow.radius=3;const e=50;this.dirLight.shadow.camera.left=-e,this.dirLight.shadow.camera.right=e,this.dirLight.shadow.camera.top=e,this.dirLight.shadow.camera.bottom=-e,this.dirLight.shadow.bias=-3e-4,this.scene.add(this.dirLight)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}render(){this.renderer.render(this.scene,this.camera)}}class Mx{constructor(e){C(this,"keys",{});C(this,"mouseDeltaX",0);C(this,"mouseDeltaY",0);C(this,"isPointerLocked",!1);C(this,"onLeftClick",null);C(this,"onKick",null);C(this,"onJumpPress",null);C(this,"onInteract",null);C(this,"onSkipSubtitle",null);C(this,"onToggleDebug",null);C(this,"onSelectSpell",null);C(this,"onPointerLockChange",null);C(this,"ctrlDown",!1);C(this,"canvas");C(this,"touchAnalogX",0);C(this,"touchAnalogZ",0);C(this,"touchIsRunning",!1);this.canvas=e,this.initListeners()}initListeners(){window.addEventListener("keydown",e=>{var t,n,i;this.keys[e.code]=!0,(e.code==="Digit1"||e.code==="Numpad1")&&((t=this.onSelectSpell)==null||t.call(this,0)),(e.code==="Digit2"||e.code==="Numpad2")&&((n=this.onSelectSpell)==null||n.call(this,1)),(e.code==="Digit3"||e.code==="Numpad3")&&((i=this.onSelectSpell)==null||i.call(this,2)),e.code==="Space"&&this.onJumpPress&&this.onJumpPress(),(e.key==="Control"||e.code==="ControlLeft"||e.code==="ControlRight")&&(this.ctrlDown||(this.ctrlDown=!0,console.log("[InputManager] Control key down, firing onKick callback"),this.onKick&&this.onKick())),e.code==="KeyE"&&this.onInteract&&this.onInteract(),(e.code==="Space"||e.code==="Escape")&&this.onSkipSubtitle&&this.onSkipSubtitle(),e.code==="F3"&&(e.preventDefault(),this.onToggleDebug&&this.onToggleDebug())}),window.addEventListener("wheel",e=>{this.isPointerLocked&&this.onSelectSpell&&this.onSelectSpell(e.deltaY>0?1:0)}),window.addEventListener("keyup",e=>{this.keys[e.code]=!1,(e.key==="Control"||e.code==="ControlLeft"||e.code==="ControlRight")&&(this.ctrlDown=!1)}),document.addEventListener("mousemove",e=>{this.isPointerLocked&&(this.mouseDeltaX+=e.movementX,this.mouseDeltaY+=e.movementY)}),document.addEventListener("pointerlockchange",()=>{this.isPointerLocked=document.pointerLockElement===this.canvas,this.onPointerLockChange&&this.onPointerLockChange(this.isPointerLocked)}),this.canvas.addEventListener("mousedown",e=>{if(!this.isPointerLocked){this.requestPointerLock();return}e.button===0&&this.onLeftClick&&this.onLeftClick()})}requestPointerLock(){this.canvas.requestPointerLock()}exitPointerLock(){document.pointerLockElement&&document.exitPointerLock()}consumeMouseDelta(){const e={x:this.mouseDeltaX,y:this.mouseDeltaY};return this.mouseDeltaX=0,this.mouseDeltaY=0,e}triggerAttack(){this.onKick&&this.onKick(),this.onLeftClick&&this.onLeftClick()}triggerJump(){this.onJumpPress&&this.onJumpPress()}triggerInteract(){this.onInteract&&this.onInteract()}get moveForward(){return!!(this.keys.KeyW||this.keys.ArrowUp)||this.touchAnalogZ>.15}get moveBackward(){return!!(this.keys.KeyS||this.keys.ArrowDown)||this.touchAnalogZ<-.15}get moveLeft(){return!!(this.keys.KeyA||this.keys.ArrowLeft)||this.touchAnalogX<-.15}get moveRight(){return!!(this.keys.KeyD||this.keys.ArrowRight)||this.touchAnalogX>.15}get isRunning(){return!!(this.keys.ShiftLeft||this.keys.ShiftRight)||this.touchIsRunning}get isJumping(){return!!this.keys.Space}}class Sx{constructor(e){C(this,"inputManager");C(this,"container",null);C(this,"joystickBase",null);C(this,"joystickStick",null);C(this,"btnJump",null);C(this,"btnAttack",null);C(this,"btnRun",null);C(this,"joystickTouchId",null);C(this,"joystickCenter",{x:0,y:0});C(this,"maxRadius",55);C(this,"deadZone",.12);C(this,"cameraTouchId",null);C(this,"lastCameraPos",{x:0,y:0});this.inputManager=e,this.isTouchDevice()?this.init():console.log("[MobileTouchControls] Desktop mode detected. Touch controls hidden.")}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=1024}init(){console.log("[MobileTouchControls] Initializing mobile touch interface..."),this.createControlsHTML(),this.bindJoystickEvents(),this.bindButtonEvents(),this.bindCameraEvents()}createControlsHTML(){let e=document.getElementById("lisar-mobile-touch-overlay");e&&e.remove(),this.container=document.createElement("div"),this.container.id="lisar-mobile-touch-overlay",this.container.className="lisar-touch-overlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.joystickBase=document.getElementById("touch-joystick-base"),this.joystickStick=document.getElementById("touch-joystick-stick"),this.btnJump=document.getElementById("touch-btn-jump"),this.btnAttack=document.getElementById("touch-btn-attack"),this.btnRun=document.getElementById("touch-btn-run")}bindJoystickEvents(){if(!this.joystickBase||!this.joystickStick)return;const e=document.getElementById("touch-joystick-zone");if(!e)return;const t=s=>{if(s.preventDefault(),this.joystickTouchId===null)for(let a=0;a<s.changedTouches.length;a++){const o=s.changedTouches[a],l=this.joystickBase.getBoundingClientRect();this.joystickCenter={x:l.left+l.width/2,y:l.top+l.height/2},this.joystickTouchId=o.identifier,this.joystickBase.classList.add("active"),this.updateJoystickPosition(o.clientX,o.clientY);break}},n=s=>{if(s.preventDefault(),this.joystickTouchId!==null)for(let a=0;a<s.touches.length;a++){const o=s.touches[a];if(o.identifier===this.joystickTouchId){this.updateJoystickPosition(o.clientX,o.clientY);break}}},i=s=>{if(this.joystickTouchId!==null){for(let a=0;a<s.changedTouches.length;a++)if(s.changedTouches[a].identifier===this.joystickTouchId){this.resetJoystick();break}}};e.addEventListener("touchstart",t,{passive:!1}),window.addEventListener("touchmove",n,{passive:!1}),window.addEventListener("touchend",i,{passive:!1}),window.addEventListener("touchcancel",i,{passive:!1})}updateJoystickPosition(e,t){if(!this.joystickStick)return;let n=e-this.joystickCenter.x,i=t-this.joystickCenter.y;const s=Math.hypot(n,i);s>this.maxRadius&&(n=n/s*this.maxRadius,i=i/s*this.maxRadius),this.joystickStick.style.transform=`translate3d(${n}px, ${i}px, 0)`;let a=n/this.maxRadius,o=i/this.maxRadius;const l=Math.hypot(a,o);if(l<this.deadZone)this.inputManager.touchAnalogX=0,this.inputManager.touchAnalogZ=0;else{const c=(l-this.deadZone)/(1-this.deadZone);a=a/l*c,o=o/l*c,this.inputManager.touchAnalogX=a,this.inputManager.touchAnalogZ=-o}}resetJoystick(){this.joystickTouchId=null,this.inputManager.touchAnalogX=0,this.inputManager.touchAnalogZ=0,this.joystickStick&&(this.joystickStick.style.transform="translate3d(0px, 0px, 0)"),this.joystickBase&&this.joystickBase.classList.remove("active")}bindButtonEvents(){if(this.btnJump){const e=t=>{t.preventDefault(),t.stopPropagation(),this.animateButtonPress(this.btnJump),this.inputManager.triggerJump()};this.btnJump.addEventListener("touchstart",e,{passive:!1})}if(this.btnAttack){const e=t=>{t.preventDefault(),t.stopPropagation(),this.animateButtonPress(this.btnAttack),this.inputManager.triggerAttack()};this.btnAttack.addEventListener("touchstart",e,{passive:!1})}if(this.btnRun){const e=n=>{n.preventDefault(),n.stopPropagation(),this.btnRun.classList.add("active"),this.inputManager.touchIsRunning=!0},t=n=>{n.preventDefault(),this.btnRun.classList.remove("active"),this.inputManager.touchIsRunning=!1};this.btnRun.addEventListener("touchstart",e,{passive:!1}),this.btnRun.addEventListener("touchend",t,{passive:!1}),this.btnRun.addEventListener("touchcancel",t,{passive:!1})}}animateButtonPress(e){e.classList.add("pressed"),setTimeout(()=>e.classList.remove("pressed"),140)}bindCameraEvents(){window.addEventListener("touchstart",t=>{if(this.cameraTouchId===null)for(let n=0;n<t.changedTouches.length;n++){const i=t.changedTouches[n],s=i.target;if(!(s.closest(".touch-btn")||s.closest(".touch-joystick-zone")||s.closest(".hud-panel"))&&i.clientX>window.innerWidth*.35){this.cameraTouchId=i.identifier,this.lastCameraPos={x:i.clientX,y:i.clientY};break}}},{passive:!0}),window.addEventListener("touchmove",t=>{if(this.cameraTouchId!==null)for(let n=0;n<t.touches.length;n++){const i=t.touches[n];if(i.identifier===this.cameraTouchId){const s=i.clientX-this.lastCameraPos.x,a=i.clientY-this.lastCameraPos.y;this.lastCameraPos={x:i.clientX,y:i.clientY},this.inputManager.mouseDeltaX+=s*1.8,this.inputManager.mouseDeltaY+=a*1.8;break}}},{passive:!0});const e=t=>{if(this.cameraTouchId!==null){for(let n=0;n<t.changedTouches.length;n++)if(t.changedTouches[n].identifier===this.cameraTouchId){this.cameraTouchId=null;break}}};window.addEventListener("touchend",e,{passive:!0}),window.addEventListener("touchcancel",e,{passive:!0})}}class bx{constructor(e){C(this,"touchControls");this.touchControls=new Sx(e)}}class wx{constructor(){C(this,"ctx",null);C(this,"bgmAudio",null)}resume(){try{this.initCtx()}catch(e){console.warn("[AudioManager] Failed to resume AudioContext:",e)}}initCtx(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e}return this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}startBGM(){this.bgmAudio||(this.bgmAudio=new Audio("/magic-academy-3d/assets/Castle Dawn Escape.mp3"),this.bgmAudio.loop=!0,this.bgmAudio.volume=.4,this.bgmAudio.play().catch(e=>{console.warn("[AudioManager] No se encontró la música o el navegador bloqueó el autoplay.",e)}))}stopBGM(){this.bgmAudio&&(this.bgmAudio.pause(),this.bgmAudio.currentTime=0)}playFlipendoCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(220,t),n.frequency.exponentialRampToValueAtTime(800,t+.12),n.frequency.exponentialRampToValueAtTime(100,t+.35),i.gain.setValueAtTime(.4,t),i.gain.exponentialRampToValueAtTime(.01,t+.35),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.35)}playAlohomoraCast(){const e=this.initCtx(),t=e.currentTime;[659.25,880,1046.5,1318.5].forEach((n,i)=>{const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(n,t+i*.06),a.gain.setValueAtTime(.2,t+i*.06),a.gain.exponentialRampToValueAtTime(.001,t+i*.06+.4),s.connect(a),a.connect(e.destination),s.start(t+i*.06),s.stop(t+i*.06+.4)})}playLumosCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(440,t),n.frequency.linearRampToValueAtTime(880,t+.5),i.gain.setValueAtTime(.2,t),i.gain.exponentialRampToValueAtTime(.01,t+.5),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.5)}playPotShatter(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sawtooth",n.frequency.setValueAtTime(600,t),n.frequency.exponentialRampToValueAtTime(80,t+.15),i.gain.setValueAtTime(.35,t),i.gain.exponentialRampToValueAtTime(.01,t+.15),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.15)}playChestOpen(){const e=this.initCtx(),t=e.currentTime;[523.25,659.25,783.99,1046.5].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(i,t+s*.08),o.gain.setValueAtTime(.25,t+s*.08),o.gain.exponentialRampToValueAtTime(.001,t+s*.08+.5),a.connect(o),o.connect(e.destination),a.start(t+s*.08),a.stop(t+s*.08+.5)})}playLumosGargoyle(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(300,t),n.frequency.exponentialRampToValueAtTime(1200,t+.6),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.001,t+.6),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.6)}playBeanPickup(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(987.77,t),i.gain.setValueAtTime(.15,t),i.gain.exponentialRampToValueAtTime(.001,t+.08),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.08);const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(1318.51,t+.08),a.gain.setValueAtTime(0,t),a.gain.setValueAtTime(.15,t+.08),a.gain.exponentialRampToValueAtTime(.001,t+.3),s.connect(a),a.connect(e.destination),s.start(t+.08),s.stop(t+.3)}playCoinSpawnHarmonic(e){const t=this.initCtx(),n=t.currentTime,i=[523.25,587.33,659.25,783.99,880],s=Math.floor(e/i.length),a=Math.min(s,2),o=i[e%i.length]*Math.pow(2,a),l=t.createOscillator(),c=t.createGain();l.type="sine",l.frequency.setValueAtTime(o,n),l.frequency.exponentialRampToValueAtTime(o*1.05,n+.1),c.gain.setValueAtTime(0,n),c.gain.linearRampToValueAtTime(.1,n+.02),c.gain.exponentialRampToValueAtTime(.001,n+.3),l.connect(c),c.connect(t.destination),l.start(n),l.stop(n+.3)}playFrogPickup(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(350,t),n.frequency.exponentialRampToValueAtTime(700,t+.2),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.001,t+.2),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.2)}playSpellSwitch(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(700,t),n.frequency.exponentialRampToValueAtTime(1400,t+.1),i.gain.setValueAtTime(.15,t),i.gain.exponentialRampToValueAtTime(.001,t+.12),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.12)}playPlayerHurt(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="square",n.frequency.setValueAtTime(180,t),n.frequency.exponentialRampToValueAtTime(60,t+.25),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.01,t+.25),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.25)}playPotionPickup(){const e=this.initCtx(),t=e.currentTime;[440,554.37,659.25,880].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="sine",a.frequency.setValueAtTime(i,t+s*.05),o.gain.setValueAtTime(.2,t+s*.05),o.gain.exponentialRampToValueAtTime(.001,t+s*.05+.3),a.connect(o),o.connect(e.destination),a.start(t+s*.05),a.stop(t+s*.05+.3)})}playSpellCast(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(300,t),n.frequency.exponentialRampToValueAtTime(1200,t+.25),i.gain.setValueAtTime(.3,t),i.gain.exponentialRampToValueAtTime(.01,t+.3),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.3)}playTargetHit(){const e=this.initCtx(),t=e.currentTime;[880,1320,1760].forEach((n,i)=>{const s=e.createOscillator(),a=e.createGain();s.type="sine",s.frequency.setValueAtTime(n,t+i*.05),a.gain.setValueAtTime(.2,t+i*.05),a.gain.exponentialRampToValueAtTime(.001,t+i*.05+.5),s.connect(a),a.connect(e.destination),s.start(t+i*.05),s.stop(t+i*.05+.5)})}playDoorOpen(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(80,t),n.frequency.linearRampToValueAtTime(140,t+1.2),i.gain.setValueAtTime(.2,t),i.gain.linearRampToValueAtTime(.01,t+1.5),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+1.5)}playCardPickup(){const e=this.initCtx(),t=e.currentTime;[523.25,659.25,783.99,1046.5].forEach((i,s)=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(i,t+s*.06),o.gain.setValueAtTime(.25,t+s*.06),o.gain.exponentialRampToValueAtTime(.001,t+s*.06+.4),a.connect(o),o.connect(e.destination),a.start(t+s*.06),a.stop(t+s*.06+.4)})}playFootstep(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(120+Math.random()*20,t),n.frequency.exponentialRampToValueAtTime(40,t+.08),i.gain.setValueAtTime(.08,t),i.gain.exponentialRampToValueAtTime(.001,t+.08),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.08)}playEnemyStun(){const e=this.initCtx(),t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sawtooth",n.frequency.setValueAtTime(400,t),n.frequency.exponentialRampToValueAtTime(100,t+.3),i.gain.setValueAtTime(.25,t),i.gain.exponentialRampToValueAtTime(.01,t+.3),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.3)}playVictoryJingle(){const e=this.initCtx(),t=e.currentTime,n=[{f:523.25,d:.2},{f:659.25,d:.2},{f:783.99,d:.2},{f:1046.5,d:.6}];let i=0;n.forEach(s=>{const a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(s.f,t+i),o.gain.setValueAtTime(.3,t+i),o.gain.exponentialRampToValueAtTime(.001,t+i+s.d),a.connect(o),o.connect(e.destination),a.start(t+i),a.stop(t+i+s.d),i+=s.d*.75})}}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.2
*/var pn=Uint8Array,rs=Uint16Array,Tx=Int32Array,yu=new pn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Mu=new pn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ex=new pn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Su=function(r,e){for(var t=new rs(31),n=0;n<31;++n)t[n]=e+=1<<r[n-1];for(var i=new Tx(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)i[s]=s-t[n]<<5|n;return{b:t,r:i}},bu=Su(yu,2),wu=bu.b,Ax=bu.r;wu[28]=258,Ax[258]=28;var Cx=Su(Mu,0),Rx=Cx.b,ul=new rs(32768);for(var St=0;St<32768;++St){var pi=(St&43690)>>1|(St&21845)<<1;pi=(pi&52428)>>2|(pi&13107)<<2,pi=(pi&61680)>>4|(pi&3855)<<4,ul[St]=((pi&65280)>>8|(pi&255)<<8)>>1}var zs=function(r,e,t){for(var n=r.length,i=0,s=new rs(e);i<n;++i)r[i]&&++s[r[i]-1];var a=new rs(e);for(i=1;i<e;++i)a[i]=a[i-1]+s[i-1]<<1;var o;if(t){o=new rs(1<<e);var l=15-e;for(i=0;i<n;++i)if(r[i])for(var c=i<<4|r[i],h=e-r[i],u=a[r[i]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)o[ul[u]>>l]=c}else for(o=new rs(n),i=0;i<n;++i)r[i]&&(o[i]=ul[a[r[i]-1]++]>>15-r[i]);return o},ar=new pn(288);for(var St=0;St<144;++St)ar[St]=8;for(var St=144;St<256;++St)ar[St]=9;for(var St=256;St<280;++St)ar[St]=7;for(var St=280;St<288;++St)ar[St]=8;var Tu=new pn(32);for(var St=0;St<32;++St)Tu[St]=5;var Px=zs(ar,9,1),Ix=zs(Tu,5,1),lo=function(r){for(var e=r[0],t=1;t<r.length;++t)r[t]>e&&(e=r[t]);return e},bn=function(r,e,t){var n=e/8|0;return(r[n]|r[n+1]<<8)>>(e&7)&t},co=function(r,e){var t=e/8|0;return(r[t]|r[t+1]<<8|r[t+2]<<16)>>(e&7)},Lx=function(r){return(r+7)/8|0},Dx=function(r,e,t){return(t==null||t>r.length)&&(t=r.length),new pn(r.subarray(e,t))},Fx=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],wn=function(r,e,t){var n=new Error(e||Fx[r]);if(n.code=r,Error.captureStackTrace&&Error.captureStackTrace(n,wn),!t)throw n;return n},Nx=function(r,e,t,n){var i=r.length,s=0;if(!i||e.f&&!e.l)return t||new pn(0);var a=!t,o=a||e.i!=2,l=e.i;a&&(t=new pn(i*3));var c=function(Ce){var ht=t.length;if(Ce>ht){var Ve=new pn(Math.max(ht*2,Ce));Ve.set(t),t=Ve}},h=e.f||0,u=e.p||0,d=e.b||0,f=e.l,p=e.d,_=e.m,g=e.n,m=i*8;do{if(!f){h=bn(r,u,1);var S=bn(r,u+1,3);if(u+=3,S)if(S==1)f=Px,p=Ix,_=9,g=5;else if(S==2){var T=bn(r,u,31)+257,w=bn(r,u+10,15)+4,x=T+bn(r,u+5,31)+1;u+=14;for(var R=new pn(x),I=new pn(19),L=0;L<w;++L)I[Ex[L]]=bn(r,u+L*3,7);u+=w*3;for(var D=lo(I),H=(1<<D)-1,Y=zs(I,D,1),L=0;L<x;){var O=Y[bn(r,u,H)];u+=O&15;var M=O>>4;if(M<16)R[L++]=M;else{var X=0,B=0;for(M==16?(B=3+bn(r,u,3),u+=2,X=R[L-1]):M==17?(B=3+bn(r,u,7),u+=3):M==18&&(B=11+bn(r,u,127),u+=7);B--;)R[L++]=X}}var Q=R.subarray(0,T),ne=R.subarray(T);_=lo(Q),g=lo(ne),f=zs(Q,_,1),p=zs(ne,g,1)}else wn(1);else{var M=Lx(u)+4,v=r[M-4]|r[M-3]<<8,E=M+v;if(E>i){l&&wn(0);break}o&&c(d+v),t.set(r.subarray(M,E),d),e.b=d+=v,e.p=u=E*8,e.f=h;continue}if(u>m){l&&wn(0);break}}o&&c(d+131072);for(var fe=(1<<_)-1,de=(1<<g)-1,ye=u;;ye=u){var X=f[co(r,u)&fe],qe=X>>4;if(u+=X&15,u>m){l&&wn(0);break}if(X||wn(2),qe<256)t[d++]=qe;else if(qe==256){ye=u,f=null;break}else{var Ze=qe-254;if(qe>264){var L=qe-257,Fe=yu[L];Ze=bn(r,u,(1<<Fe)-1)+wu[L],u+=Fe}var J=p[co(r,u)&de],re=J>>4;J||wn(3),u+=J&15;var ne=Rx[re];if(re>3){var Fe=Mu[re];ne+=co(r,u)&(1<<Fe)-1,u+=Fe}if(u>m){l&&wn(0);break}o&&c(d+131072);var te=d+Ze;if(d<ne){var Le=s-ne,Ne=Math.min(ne,te);for(Le+d<0&&wn(3);d<Ne;++d)t[d]=n[Le+d]}for(;d<te;++d)t[d]=t[d-ne]}}e.l=f,e.p=ye,e.b=d,e.f=h,f&&(h=1,e.m=_,e.d=p,e.n=g)}while(!h);return d!=t.length&&a?Dx(t,0,d):t.subarray(0,d)},Ux=new pn(0),Ox=function(r,e){return((r[0]&15)!=8||r[0]>>4>7||(r[0]<<8|r[1])%31)&&wn(6,"invalid zlib data"),(r[1]>>5&1)==1&&wn(6,"invalid zlib data: "+(r[1]&32?"need":"unexpected")+" dictionary"),(r[1]>>3&4)+2};function kx(r,e){return Nx(r.subarray(Ox(r),-4),{i:2},e,e)}var Bx=typeof TextDecoder<"u"&&new TextDecoder,zx=0;try{Bx.decode(Ux,{stream:!0}),zx=1}catch{}function Eu(r,e,t){const n=t.length-r-1;if(e>=t[n])return n-1;if(e<=t[r])return r;let i=r,s=n,a=Math.floor((i+s)/2);for(;e<t[a]||e>=t[a+1];)e<t[a]?s=a:i=a,a=Math.floor((i+s)/2);return a}function Vx(r,e,t,n){const i=[],s=[],a=[];i[0]=1;for(let o=1;o<=t;++o){s[o]=e-n[r+1-o],a[o]=n[r+o]-e;let l=0;for(let c=0;c<o;++c){const h=a[c+1],u=s[o-c],d=i[c]/(h+u);i[c]=l+h*d,l=u*d}i[o]=l}return i}function Gx(r,e,t,n){const i=Eu(r,n,e),s=Vx(i,n,r,e),a=new rt(0,0,0,0);for(let o=0;o<=r;++o){const l=t[i-r+o],c=s[o],h=l.w*c;a.x+=l.x*h,a.y+=l.y*h,a.z+=l.z*h,a.w+=l.w*c}return a}function Hx(r,e,t,n,i){const s=[];for(let u=0;u<=t;++u)s[u]=0;const a=[];for(let u=0;u<=n;++u)a[u]=s.slice(0);const o=[];for(let u=0;u<=t;++u)o[u]=s.slice(0);o[0][0]=1;const l=s.slice(0),c=s.slice(0);for(let u=1;u<=t;++u){l[u]=e-i[r+1-u],c[u]=i[r+u]-e;let d=0;for(let f=0;f<u;++f){const p=c[f+1],_=l[u-f];o[u][f]=p+_;const g=o[f][u-1]/o[u][f];o[f][u]=d+p*g,d=_*g}o[u][u]=d}for(let u=0;u<=t;++u)a[0][u]=o[u][t];for(let u=0;u<=t;++u){let d=0,f=1;const p=[];for(let _=0;_<=t;++_)p[_]=s.slice(0);p[0][0]=1;for(let _=1;_<=n;++_){let g=0;const m=u-_,S=t-_;u>=_&&(p[f][0]=p[d][0]/o[S+1][m],g=p[f][0]*o[m][S]);const M=m>=-1?1:-m,v=u-1<=S?_-1:t-u;for(let T=M;T<=v;++T)p[f][T]=(p[d][T]-p[d][T-1])/o[S+1][m+T],g+=p[f][T]*o[m+T][S];u<=S&&(p[f][_]=-p[d][_-1]/o[S+1][u],g+=p[f][_]*o[u][S]),a[_][u]=g;const E=d;d=f,f=E}}let h=t;for(let u=1;u<=n;++u){for(let d=0;d<=t;++d)a[u][d]*=h;h*=t-u}return a}function Wx(r,e,t,n,i){const s=i<r?i:r,a=[],o=Eu(r,n,e),l=Hx(o,n,r,s,e),c=[];for(let h=0;h<t.length;++h){const u=t[h].clone(),d=u.w;u.x*=d,u.y*=d,u.z*=d,c[h]=u}for(let h=0;h<=s;++h){const u=c[o-r].clone().multiplyScalar(l[h][0]);for(let d=1;d<=r;++d)u.add(c[o-r+d].clone().multiplyScalar(l[h][d]));a[h]=u}for(let h=s+1;h<=i+1;++h)a[h]=new rt(0,0,0);return a}function Xx(r,e){let t=1;for(let i=2;i<=r;++i)t*=i;let n=1;for(let i=2;i<=e;++i)n*=i;for(let i=2;i<=r-e;++i)n*=i;return t/n}function qx(r){const e=r.length,t=[],n=[];for(let s=0;s<e;++s){const a=r[s];t[s]=new b(a.x,a.y,a.z),n[s]=a.w}const i=[];for(let s=0;s<e;++s){const a=t[s].clone();for(let o=1;o<=s;++o)a.sub(i[s-o].clone().multiplyScalar(Xx(s,o)*n[o]));i[s]=a.divideScalar(n[0])}return i}function Kx(r,e,t,n,i){const s=Wx(r,e,t,n,i);return qx(s)}class Yx extends vf{constructor(e,t,n,i,s){super();const a=t?t.length-1:0,o=n?n.length:0;this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=s||a;for(let l=0;l<o;++l){const c=n[l];this.controlPoints[l]=new rt(c.x,c.y,c.z,c.w)}}getPoint(e,t=new b){const n=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),s=Gx(this.degree,this.knots,this.controlPoints,i);return s.w!==1&&s.divideScalar(s.w),n.set(s.x,s.y,s.z)}getTangent(e,t=new b){const n=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),s=Kx(this.degree,this.knots,this.controlPoints,i,1);return n.copy(s[1]).normalize(),n}toJSON(){const e=super.toJSON();return e.degree=this.degree,e.knots=[...this.knots],e.controlPoints=this.controlPoints.map(t=>t.toArray()),e.startKnot=this.startKnot,e.endKnot=this.endKnot,e}fromJSON(e){return super.fromJSON(e),this.degree=e.degree,this.knots=[...e.knots],this.controlPoints=e.controlPoints.map(t=>new rt(t[0],t[1],t[2],t[3])),this.startKnot=e.startKnot,this.endKnot=e.endKnot,this}}let We,Lt,Ht;class $x extends ni{constructor(e){super(e)}load(e,t,n,i){const s=this,a=s.path===""?cs.extractUrlBase(e):s.path,o=new Ul(this.manager);o.setPath(s.path),o.setResponseType("arraybuffer"),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(e,function(l){try{t(s.parse(l,a))}catch(c){i?i(c):console.error(c),s.manager.itemError(e)}},n,i)}parse(e,t){if(tv(e))We=new ev().parse(e);else{const i=Ru(e);if(!nv(i))throw new Error("THREE.FBXLoader: Unknown format.");if(Sh(i)<7e3)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+Sh(i));We=new Qx().parse(i)}const n=new lu(this.manager).setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);return new Zx(n,this.manager).parse(We)}}class Zx{constructor(e,t){this.textureLoader=e,this.manager=t}parse(){Lt=this.parseConnections();const e=this.parseImages(),t=this.parseTextures(e),n=this.parseMaterials(t),i=this.parseDeformers(),s=new Jx().parse(i);return this.parseScene(i,s,n),Ht}parseConnections(){const e=new Map;return"Connections"in We&&We.Connections.connections.forEach(function(n){const i=n[0],s=n[1],a=n[2];e.has(i)||e.set(i,{parents:[],children:[]});const o={ID:s,relationship:a};e.get(i).parents.push(o),e.has(s)||e.set(s,{parents:[],children:[]});const l={ID:i,relationship:a};e.get(s).children.push(l)}),e}parseImages(){const e={},t={};if("Video"in We.Objects){const n=We.Objects.Video;for(const i in n){const s=n[i],a=parseInt(i);if(e[a]=s.RelativeFilename||s.Filename,"Content"in s){const o=s.Content instanceof ArrayBuffer&&s.Content.byteLength>0,l=typeof s.Content=="string"&&s.Content!=="";if(o||l){const c=this.parseImage(n[i]);t[s.RelativeFilename||s.Filename]=c}}}}for(const n in e){const i=e[n];t[i]!==void 0?e[n]=t[i]:e[n]=e[n].split("\\").pop()}return e}parseImage(e){const t=e.Content,n=e.RelativeFilename||e.Filename,i=n.slice(n.lastIndexOf(".")+1).toLowerCase();let s;switch(i){case"bmp":s="image/bmp";break;case"jpg":case"jpeg":s="image/jpeg";break;case"png":s="image/png";break;case"tif":s="image/tiff";break;case"tga":this.manager.getHandler(".tga")===null&&console.warn("FBXLoader: TGA loader not found, skipping ",n),s="image/tga";break;case"webp":s="image/webp";break;default:console.warn('FBXLoader: Image type "'+i+'" is not supported.');return}if(typeof t=="string")return"data:"+s+";base64,"+t;{const a=new Uint8Array(t);return window.URL.createObjectURL(new Blob([a],{type:s}))}}parseTextures(e){const t=new Map;if("Texture"in We.Objects){const n=We.Objects.Texture;for(const i in n){const s=this.parseTexture(n[i],e);t.set(parseInt(i),s)}}return t}parseTexture(e,t){const n=this.loadTexture(e,t);n.ID=e.id,n.name=e.attrName;const i=e.WrapModeU,s=e.WrapModeV,a=i!==void 0?i.value:0,o=s!==void 0?s.value:0;if(n.wrapS=a===0?nn:mn,n.wrapT=o===0?nn:mn,"Scaling"in e){const l=e.Scaling.value;n.repeat.x=l[0],n.repeat.y=l[1]}if("Translation"in e){const l=e.Translation.value;n.offset.x=l[0],n.offset.y=l[1]}return n}loadTexture(e,t){const n=e.FileName.split(".").pop().toLowerCase();let i=this.manager.getHandler(`.${n}`);i===null&&(i=this.textureLoader);const s=i.path;s||i.setPath(this.textureLoader.path);const a=Lt.get(e.id).children;let o;if(a!==void 0&&a.length>0&&t[a[0].ID]!==void 0&&(o=t[a[0].ID],(o.indexOf("blob:")===0||o.indexOf("data:")===0)&&i.setPath(void 0)),o===void 0)return console.warn("FBXLoader: Undefined filename, creating placeholder texture."),new kt;const l=i.load(o);return i.setPath(s),l}parseMaterials(e){const t=new Map;if("Material"in We.Objects){const n=We.Objects.Material;for(const i in n){const s=this.parseMaterial(n[i],e);s!==null&&t.set(parseInt(i),s)}}return t}parseMaterial(e,t){const n=e.id,i=e.attrName;let s=e.ShadingModel;if(typeof s=="object"&&(s=s.value),!Lt.has(n))return null;const a=this.parseParameters(e,t,n);let o;switch(s.toLowerCase()){case"phong":o=new Nr;break;case"lambert":o=new Hf;break;default:console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.',s),o=new Nr;break}return o.setValues(a),o.name=i,o}parseParameters(e,t,n){const i={};e.BumpFactor&&(i.bumpScale=e.BumpFactor.value),e.Diffuse?i.color=ze.colorSpaceToWorking(new Me().fromArray(e.Diffuse.value),ct):e.DiffuseColor&&(e.DiffuseColor.type==="Color"||e.DiffuseColor.type==="ColorRGB")&&(i.color=ze.colorSpaceToWorking(new Me().fromArray(e.DiffuseColor.value),ct)),e.DisplacementFactor&&(i.displacementScale=e.DisplacementFactor.value),e.Emissive?i.emissive=ze.colorSpaceToWorking(new Me().fromArray(e.Emissive.value),ct):e.EmissiveColor&&(e.EmissiveColor.type==="Color"||e.EmissiveColor.type==="ColorRGB")&&(i.emissive=ze.colorSpaceToWorking(new Me().fromArray(e.EmissiveColor.value),ct)),e.EmissiveFactor&&(i.emissiveIntensity=parseFloat(e.EmissiveFactor.value)),i.opacity=1-(e.TransparencyFactor?parseFloat(e.TransparencyFactor.value):0),(i.opacity===1||i.opacity===0)&&(i.opacity=e.Opacity?parseFloat(e.Opacity.value):null,i.opacity===null&&(i.opacity=1)),i.opacity<1&&(i.transparent=!0),e.ReflectionFactor&&(i.reflectivity=e.ReflectionFactor.value),e.Shininess&&(i.shininess=e.Shininess.value),e.Specular?i.specular=ze.colorSpaceToWorking(new Me().fromArray(e.Specular.value),ct):e.SpecularColor&&e.SpecularColor.type==="Color"&&(i.specular=ze.colorSpaceToWorking(new Me().fromArray(e.SpecularColor.value),ct));const s=this;return Lt.get(n).children.forEach(function(a){const o=a.relationship;switch(o){case"Bump":i.bumpMap=s.getTexture(t,a.ID);break;case"Maya|TEX_ao_map":i.aoMap=s.getTexture(t,a.ID);break;case"DiffuseColor":case"Maya|TEX_color_map":i.map=s.getTexture(t,a.ID),i.map!==void 0&&(i.map.colorSpace=ct);break;case"DisplacementColor":i.displacementMap=s.getTexture(t,a.ID);break;case"EmissiveColor":i.emissiveMap=s.getTexture(t,a.ID),i.emissiveMap!==void 0&&(i.emissiveMap.colorSpace=ct);break;case"NormalMap":case"Maya|TEX_normal_map":i.normalMap=s.getTexture(t,a.ID);break;case"ReflectionColor":i.envMap=s.getTexture(t,a.ID),i.envMap!==void 0&&(i.envMap.mapping=qr,i.envMap.colorSpace=ct);break;case"SpecularColor":i.specularMap=s.getTexture(t,a.ID),i.specularMap!==void 0&&(i.specularMap.colorSpace=ct);break;case"TransparentColor":case"TransparencyFactor":i.alphaMap=s.getTexture(t,a.ID),i.transparent=!0;break;case"AmbientColor":case"ShininessExponent":case"SpecularFactor":case"VectorDisplacementColor":default:console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.",o);break}}),i}getTexture(e,t){return"LayeredTexture"in We.Objects&&t in We.Objects.LayeredTexture&&(console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."),t=Lt.get(t).children[0].ID),e.get(t)}parseDeformers(){const e={},t={};if("Deformer"in We.Objects){const n=We.Objects.Deformer;for(const i in n){const s=n[i],a=Lt.get(parseInt(i));if(s.attrType==="Skin"){const o=this.parseSkeleton(a,n);o.ID=i,a.parents.length>1&&console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."),o.geometryID=a.parents[0].ID,e[i]=o}else if(s.attrType==="BlendShape"){const o={id:i};o.rawTargets=this.parseMorphTargets(a,n),o.id=i,a.parents.length>1&&console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."),t[i]=o}}}return{skeletons:e,morphTargets:t}}parseSkeleton(e,t){const n=[];return e.children.forEach(function(i){const s=t[i.ID];if(s.attrType!=="Cluster")return;const a={ID:i.ID,indices:[],weights:[],transformLink:new Se().fromArray(s.TransformLink.a)};"Indexes"in s&&(a.indices=s.Indexes.a,a.weights=s.Weights.a),n.push(a)}),{rawBones:n,bones:[]}}parseMorphTargets(e,t){const n=[];for(let i=0;i<e.children.length;i++){const s=e.children[i],a=t[s.ID],o={name:a.attrName,initialWeight:a.DeformPercent,id:a.id,fullWeights:a.FullWeights.a};if(a.attrType!=="BlendShapeChannel")return;o.geoID=Lt.get(parseInt(s.ID)).children.filter(function(l){return l.relationship===void 0})[0].ID,n.push(o)}return n}parseScene(e,t,n){Ht=new lt;const i=this.parseModels(e.skeletons,t,n),s=We.Objects.Model,a=this;i.forEach(function(u){const d=s[u.ID];a.setLookAtProperties(u,d),Lt.get(u.ID).parents.forEach(function(p){const _=i.get(p.ID);_!==void 0&&_.add(u)}),u.parent===null&&Ht.add(u)}),this.addGlobalSceneSettings(),Ht.traverse(function(u){if(u.userData.transformData){u.parent&&(u.userData.transformData.parentMatrix=u.parent.matrix,u.userData.transformData.parentMatrixWorld=u.parent.matrixWorld);const d=Cu(u.userData.transformData);u.applyMatrix4(d),u.updateWorldMatrix()}});const o=this.parsePoseNodes(),l=new Set;for(const u in e.skeletons)e.skeletons[u].rawBones.forEach(function(d,f){const p=e.skeletons[u].bones[f];p&&l.add(p.ID)});const c=new Se;Ht.traverse(function(u){if(u.isBone&&u.ID!==void 0&&!l.has(u.ID)){const d=o[u.ID];d!==void 0&&(u.parent?(c.copy(u.parent.matrixWorld).invert(),c.multiply(d)):c.copy(d),c.decompose(u.position,u.quaternion,u.scale),u.updateMatrix(),u.matrixWorld.copy(d))}}),this.bindSkeleton(e.skeletons,t,i);const h=new jx().parse();Ht.children.length===1&&Ht.children[0].isGroup&&(Ht.children[0].animations=h,Ht=Ht.children[0]),Ht.animations=h,"GlobalSettings"in We&&"UpAxis"in We.GlobalSettings&&We.GlobalSettings.UpAxis.value===2&&(console.warn("THREE.FBXLoader: You are loading an asset with a Z-UP coordinate system. The loader just rotates the asset to transform it into Y-UP. The vertex data are not converted."),Ht.rotation.set(-Math.PI/2,0,0))}parseModels(e,t,n){const i=new Map,s=We.Objects.Model;for(const a in s){const o=parseInt(a),l=s[a],c=Lt.get(o);let h=this.buildSkeleton(c,e,o,l.attrName);if(!h){switch(l.attrType){case"Camera":h=this.createCamera(c);break;case"Light":h=this.createLight(c);break;case"Mesh":h=this.createMesh(c,t,n);break;case"NurbsCurve":h=this.createCurve(c,t);break;case"LimbNode":case"Root":h=new oa;break;case"Null":default:h=new lt;break}h.name=l.attrName?nt.sanitizeNodeName(l.attrName):"",h.userData.originalName=l.attrName,h.ID=o}this.getTransformData(h,l),i.set(o,h)}return i}buildSkeleton(e,t,n,i){let s=null;return e.parents.forEach(function(a){for(const o in t){const l=t[o];l.rawBones.forEach(function(c,h){if(c.ID===a.ID){const u=s;s=new oa,s.matrixWorld.copy(c.transformLink),s.name=i?nt.sanitizeNodeName(i):"",s.userData.originalName=i,s.ID=n,l.bones[h]=s,u!==null&&s.add(u)}})}}),s}createCamera(e){let t,n;if(e.children.forEach(function(i){const s=We.Objects.NodeAttribute[i.ID];s!==void 0&&(n=s)}),n===void 0)t=new pt;else{let i=0;n.CameraProjectionType!==void 0&&n.CameraProjectionType.value===1&&(i=1);let s=1;n.NearPlane!==void 0&&(s=n.NearPlane.value/1e3);let a=1e3;n.FarPlane!==void 0&&(a=n.FarPlane.value/1e3);let o=window.innerWidth,l=window.innerHeight;n.AspectWidth!==void 0&&n.AspectHeight!==void 0&&(o=n.AspectWidth.value,l=n.AspectHeight.value);const c=o/l;let h=45;n.FieldOfView!==void 0&&(h=n.FieldOfView.value);const u=n.FocalLength?n.FocalLength.value:null;switch(i){case 0:t=new $t(h,c,s,a),u!==null&&t.setFocalLength(u);break;case 1:console.warn("THREE.FBXLoader: Orthographic cameras not supported yet."),t=new pt;break;default:console.warn("THREE.FBXLoader: Unknown camera type "+i+"."),t=new pt;break}}return t}createLight(e){let t,n;if(e.children.forEach(function(i){const s=We.Objects.NodeAttribute[i.ID];s!==void 0&&(n=s)}),n===void 0)t=new pt;else{let i;n.LightType===void 0?i=0:i=n.LightType.value;let s=16777215;n.Color!==void 0&&(s=ze.colorSpaceToWorking(new Me().fromArray(n.Color.value),ct));let a=n.Intensity===void 0?1:n.Intensity.value/100;n.CastLightOnObject!==void 0&&n.CastLightOnObject.value===0&&(a=0);let o=0;n.FarAttenuationEnd!==void 0&&(n.EnableFarAttenuation!==void 0&&n.EnableFarAttenuation.value===0?o=0:o=n.FarAttenuationEnd.value);const l=1;switch(i){case 0:t=new sn(s,a,o,l);break;case 1:t=new Qs(s,a);break;case 2:let c=Math.PI/3,h=0;n.OuterAngle!==void 0?(c=ft.degToRad(n.OuterAngle.value),n.InnerAngle!==void 0&&(h=1-n.InnerAngle.value/n.OuterAngle.value,h=Math.max(0,h))):n.InnerAngle!==void 0&&(c=ft.degToRad(n.InnerAngle.value)),t=new hu(s,a,o,c,h,l);break;default:console.warn("THREE.FBXLoader: Unknown light type "+n.LightType.value+", defaulting to a PointLight."),t=new sn(s,a);break}n.CastShadows!==void 0&&n.CastShadows.value===1&&(t.castShadow=!0)}return t}createMesh(e,t,n){let i,s=null,a=null;const o=[];if(e.children.forEach(function(l){t.has(l.ID)&&(s=t.get(l.ID)),n.has(l.ID)&&o.push(n.get(l.ID))}),o.length>1?a=o:o.length>0?a=o[0]:(a=new Nr({name:ni.DEFAULT_MATERIAL_NAME,color:13421772}),o.push(a)),"color"in s.attributes&&o.forEach(function(l){l.vertexColors=!0}),s.groups.length>0){let l=!1;for(let c=0,h=s.groups.length;c<h;c++){const u=s.groups[c];(u.materialIndex<0||u.materialIndex>=o.length)&&(u.materialIndex=o.length,l=!0)}if(l){const c=new Nr;o.push(c)}}return s.FBX_Deformer?(i=new Zh(s,a),i.normalizeSkinWeights()):i=new ee(s,a),i}createCurve(e,t){const n=e.children.reduce(function(s,a){return t.has(a.ID)&&(s=t.get(a.ID)),s},null),i=new ga({name:ni.DEFAULT_MATERIAL_NAME,color:3342591,linewidth:1});return new _a(n,i)}getTransformData(e,t){const n={};"InheritType"in t&&(n.inheritType=parseInt(t.InheritType.value)),"RotationOrder"in t?n.eulerOrder=tr(t.RotationOrder.value):n.eulerOrder=tr(0),"Lcl_Translation"in t&&(n.translation=t.Lcl_Translation.value),"PreRotation"in t&&(n.preRotation=t.PreRotation.value),"Lcl_Rotation"in t&&(n.rotation=t.Lcl_Rotation.value),"PostRotation"in t&&(n.postRotation=t.PostRotation.value),"Lcl_Scaling"in t&&(n.scale=t.Lcl_Scaling.value),"ScalingOffset"in t&&(n.scalingOffset=t.ScalingOffset.value),"ScalingPivot"in t&&(n.scalingPivot=t.ScalingPivot.value),"RotationOffset"in t&&(n.rotationOffset=t.RotationOffset.value),"RotationPivot"in t&&(n.rotationPivot=t.RotationPivot.value),e.userData.transformData=n}setLookAtProperties(e,t){"LookAtProperty"in t&&Lt.get(e.ID).children.forEach(function(i){if(i.relationship==="LookAtProperty"){const s=We.Objects.Model[i.ID];if("Lcl_Translation"in s){const a=s.Lcl_Translation.value;e.target!==void 0?(e.target.position.fromArray(a),Ht.add(e.target)):e.lookAt(new b().fromArray(a))}}})}bindSkeleton(e,t,n){for(const i in e){const s=e[i],a=[];for(let l=0,c=s.bones.length;l<c;l++){const h=new Se;s.bones[l]&&s.rawBones[l]&&h.copy(s.rawBones[l].transformLink).invert(),a.push(h)}Lt.get(parseInt(s.ID)).parents.forEach(function(l){if(t.has(l.ID)){const c=l.ID;Lt.get(c).parents.forEach(function(u){if(n.has(u.ID)){const d=n.get(u.ID);d.updateMatrixWorld(!0),d.bind(new xi(s.bones,a),d.matrixWorld)}})}})}}parsePoseNodes(){const e={};if("Pose"in We.Objects){const t=We.Objects.Pose;for(const n in t)if(t[n].attrType==="BindPose"&&t[n].NbPoseNodes>0){const i=t[n].PoseNode;Array.isArray(i)?i.forEach(function(s){e[s.Node]=new Se().fromArray(s.Matrix.a)}):e[i.Node]=new Se().fromArray(i.Matrix.a)}}return e}addGlobalSceneSettings(){if("GlobalSettings"in We){if("AmbientColor"in We.GlobalSettings){const e=We.GlobalSettings.AmbientColor.value,t=e[0],n=e[1],i=e[2];if(t!==0||n!==0||i!==0){const s=new Me().setRGB(t,n,i,ct);Ht.add(new kl(s,1))}}"UnitScaleFactor"in We.GlobalSettings&&(Ht.userData.unitScaleFactor=We.GlobalSettings.UnitScaleFactor.value)}}}class Jx{constructor(){this.negativeMaterialIndices=!1}parse(e){const t=new Map;if("Geometry"in We.Objects){const n=We.Objects.Geometry;for(const i in n){const s=Lt.get(parseInt(i)),a=this.parseGeometry(s,n[i],e);t.set(parseInt(i),a)}}return this.negativeMaterialIndices===!0&&console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected."),t}parseGeometry(e,t,n){switch(t.attrType){case"Mesh":return this.parseMeshGeometry(e,t,n);case"NurbsCurve":return this.parseNurbsGeometry(t)}}parseMeshGeometry(e,t,n){const i=n.skeletons,s=[],a=e.parents.map(function(u){return We.Objects.Model[u.ID]});if(a.length===0)return;const o=e.children.reduce(function(u,d){return i[d.ID]!==void 0&&(u=i[d.ID]),u},null);e.children.forEach(function(u){n.morphTargets[u.ID]!==void 0&&s.push(n.morphTargets[u.ID])});const l=a[0],c={};"RotationOrder"in l&&(c.eulerOrder=tr(l.RotationOrder.value)),"InheritType"in l&&(c.inheritType=parseInt(l.InheritType.value)),"GeometricTranslation"in l&&(c.translation=l.GeometricTranslation.value),"GeometricRotation"in l&&(c.rotation=l.GeometricRotation.value),"GeometricScaling"in l&&(c.scale=l.GeometricScaling.value);const h=Cu(c);return this.genGeometry(t,o,s,h)}genGeometry(e,t,n,i){const s=new mt;e.attrName&&(s.name=e.attrName);const a=this.parseGeoNode(e,t),o=this.genBuffers(a),l=new it(o.vertex,3);if(l.applyMatrix4(i),s.setAttribute("position",l),o.colors.length>0&&s.setAttribute("color",new it(o.colors,3)),t&&(s.setAttribute("skinIndex",new Il(o.weightsIndices,4)),s.setAttribute("skinWeight",new it(o.vertexWeights,4)),s.FBX_Deformer=t),o.normal.length>0){const c=new Be().getNormalMatrix(i),h=new it(o.normal,3);h.applyNormalMatrix(c),s.setAttribute("normal",h)}if(o.uvs.forEach(function(c,h){const u=h===0?"uv":`uv${h}`;s.setAttribute(u,new it(o.uvs[h],2))}),a.material&&a.material.mappingType!=="AllSame"){let c=o.materialIndex[0],h=0;if(o.materialIndex.forEach(function(u,d){u!==c&&(s.addGroup(h,d-h,c),c=u,h=d)}),s.groups.length>0){const u=s.groups[s.groups.length-1],d=u.start+u.count;d!==o.materialIndex.length&&s.addGroup(d,o.materialIndex.length-d,c)}s.groups.length===0&&s.addGroup(0,o.materialIndex.length,o.materialIndex[0])}return this.addMorphTargets(s,e,n,i),s}parseGeoNode(e,t){const n={};if(n.vertexPositions=e.Vertices!==void 0?e.Vertices.a:[],n.vertexIndices=e.PolygonVertexIndex!==void 0?e.PolygonVertexIndex.a:[],e.LayerElementColor&&e.LayerElementColor[0].Colors&&(n.color=this.parseVertexColors(e.LayerElementColor[0])),e.LayerElementMaterial&&(n.material=this.parseMaterialIndices(e.LayerElementMaterial[0])),e.LayerElementNormal&&(n.normal=this.parseNormals(e.LayerElementNormal[0])),e.LayerElementUV){n.uv=[];let i=0;for(;e.LayerElementUV[i];)e.LayerElementUV[i].UV&&n.uv.push(this.parseUVs(e.LayerElementUV[i])),i++}return n.weightTable={},t!==null&&(n.skeleton=t,t.rawBones.forEach(function(i,s){i.indices.forEach(function(a,o){n.weightTable[a]===void 0&&(n.weightTable[a]=[]),n.weightTable[a].push({id:s,weight:i.weights[o]})})})),n}genBuffers(e){const t={vertex:[],normal:[],colors:[],uvs:[],materialIndex:[],vertexWeights:[],weightsIndices:[]};let n=0,i=0,s=!1,a=[],o=[],l=[],c=[],h=[],u=[];const d=this;return e.vertexIndices.forEach(function(f,p){let _,g=!1;f<0&&(f=f^-1,g=!0);let m=[],S=[];if(a.push(f*3,f*3+1,f*3+2),e.color){const M=Gr(p,n,f,e.color);l.push(M[0],M[1],M[2])}if(e.skeleton){if(e.weightTable[f]!==void 0&&e.weightTable[f].forEach(function(M){S.push(M.weight),m.push(M.id)}),S.length>4){s||(console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."),s=!0);const M=[0,0,0,0],v=[0,0,0,0];S.forEach(function(E,T){let w=E,x=m[T];v.forEach(function(R,I,L){if(w>R){L[I]=w,w=R;const D=M[I];M[I]=x,x=D}})}),m=M,S=v}for(;S.length<4;)S.push(0),m.push(0);for(let M=0;M<4;++M)h.push(S[M]),u.push(m[M])}if(e.normal){const M=Gr(p,n,f,e.normal);o.push(M[0],M[1],M[2])}e.material&&e.material.mappingType!=="AllSame"&&(_=Gr(p,n,f,e.material)[0],_<0&&(d.negativeMaterialIndices=!0,_=0)),e.uv&&e.uv.forEach(function(M,v){const E=Gr(p,n,f,M);c[v]===void 0&&(c[v]=[]),c[v].push(E[0]),c[v].push(E[1])}),i++,g&&(d.genFace(t,e,a,_,o,l,c,h,u,i),n++,i=0,a=[],o=[],l=[],c=[],h=[],u=[])}),t}getNormalNewell(e){const t=new b(0,0,0);for(let n=0;n<e.length;n++){const i=e[n],s=e[(n+1)%e.length];t.x+=(i.y-s.y)*(i.z+s.z),t.y+=(i.z-s.z)*(i.x+s.x),t.z+=(i.x-s.x)*(i.y+s.y)}return t.normalize(),t}getNormalTangentAndBitangent(e){const t=this.getNormalNewell(e),i=(Math.abs(t.z)>.5?new b(0,1,0):new b(0,0,1)).cross(t).normalize(),s=t.clone().cross(i).normalize();return{normal:t,tangent:i,bitangent:s}}flattenVertex(e,t,n){return new Oe(e.dot(t),e.dot(n))}genFace(e,t,n,i,s,a,o,l,c,h){let u;if(h>3){const d=[],f=t.baseVertexPositions||t.vertexPositions;for(let m=0;m<n.length;m+=3)d.push(new b(f[n[m]],f[n[m+1]],f[n[m+2]]));const{tangent:p,bitangent:_}=this.getNormalTangentAndBitangent(d),g=[];for(const m of d)g.push(this.flattenVertex(m,p,_));u=Nl.triangulateShape(g,[])}else u=[[0,1,2]];for(const[d,f,p]of u)e.vertex.push(t.vertexPositions[n[d*3]]),e.vertex.push(t.vertexPositions[n[d*3+1]]),e.vertex.push(t.vertexPositions[n[d*3+2]]),e.vertex.push(t.vertexPositions[n[f*3]]),e.vertex.push(t.vertexPositions[n[f*3+1]]),e.vertex.push(t.vertexPositions[n[f*3+2]]),e.vertex.push(t.vertexPositions[n[p*3]]),e.vertex.push(t.vertexPositions[n[p*3+1]]),e.vertex.push(t.vertexPositions[n[p*3+2]]),t.skeleton&&(e.vertexWeights.push(l[d*4]),e.vertexWeights.push(l[d*4+1]),e.vertexWeights.push(l[d*4+2]),e.vertexWeights.push(l[d*4+3]),e.vertexWeights.push(l[f*4]),e.vertexWeights.push(l[f*4+1]),e.vertexWeights.push(l[f*4+2]),e.vertexWeights.push(l[f*4+3]),e.vertexWeights.push(l[p*4]),e.vertexWeights.push(l[p*4+1]),e.vertexWeights.push(l[p*4+2]),e.vertexWeights.push(l[p*4+3]),e.weightsIndices.push(c[d*4]),e.weightsIndices.push(c[d*4+1]),e.weightsIndices.push(c[d*4+2]),e.weightsIndices.push(c[d*4+3]),e.weightsIndices.push(c[f*4]),e.weightsIndices.push(c[f*4+1]),e.weightsIndices.push(c[f*4+2]),e.weightsIndices.push(c[f*4+3]),e.weightsIndices.push(c[p*4]),e.weightsIndices.push(c[p*4+1]),e.weightsIndices.push(c[p*4+2]),e.weightsIndices.push(c[p*4+3])),t.color&&(e.colors.push(a[d*3]),e.colors.push(a[d*3+1]),e.colors.push(a[d*3+2]),e.colors.push(a[f*3]),e.colors.push(a[f*3+1]),e.colors.push(a[f*3+2]),e.colors.push(a[p*3]),e.colors.push(a[p*3+1]),e.colors.push(a[p*3+2])),t.material&&t.material.mappingType!=="AllSame"&&(e.materialIndex.push(i),e.materialIndex.push(i),e.materialIndex.push(i)),t.normal&&(e.normal.push(s[d*3]),e.normal.push(s[d*3+1]),e.normal.push(s[d*3+2]),e.normal.push(s[f*3]),e.normal.push(s[f*3+1]),e.normal.push(s[f*3+2]),e.normal.push(s[p*3]),e.normal.push(s[p*3+1]),e.normal.push(s[p*3+2])),t.uv&&t.uv.forEach(function(_,g){e.uvs[g]===void 0&&(e.uvs[g]=[]),e.uvs[g].push(o[g][d*2]),e.uvs[g].push(o[g][d*2+1]),e.uvs[g].push(o[g][f*2]),e.uvs[g].push(o[g][f*2+1]),e.uvs[g].push(o[g][p*2]),e.uvs[g].push(o[g][p*2+1])})}addMorphTargets(e,t,n,i){if(n.length===0)return;e.morphTargetsRelative=!0,e.morphAttributes.position=[];const s=i.clone().setPosition(0,0,0),a=this;n.forEach(function(o){o.rawTargets.forEach(function(l){const c=We.Objects.Geometry[l.geoID];c!==void 0&&a.genMorphGeometry(e,t,c,s,l.name)})})}genMorphGeometry(e,t,n,i,s){const a=t.Vertices!==void 0?t.Vertices.a:[],o=t.PolygonVertexIndex!==void 0?t.PolygonVertexIndex.a:[],l=n.Vertices!==void 0?n.Vertices.a:[],c=n.Indexes!==void 0?n.Indexes.a:[],h=e.attributes.position.count*3,u=new Float32Array(h);for(let _=0;_<c.length;_++){const g=c[_]*3;u[g]=l[_*3],u[g+1]=l[_*3+1],u[g+2]=l[_*3+2]}const d={vertexIndices:o,vertexPositions:u,baseVertexPositions:a},f=this.genBuffers(d),p=new it(f.vertex,3);p.name=s||n.attrName,p.applyMatrix4(i),e.morphAttributes.position.push(p)}parseNormals(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Normals.a;let s=[];return n==="IndexToDirect"&&("NormalIndex"in e?s=e.NormalIndex.a:"NormalsIndex"in e&&(s=e.NormalsIndex.a)),{dataSize:3,buffer:i,indices:s,mappingType:t,referenceType:n}}parseUVs(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.UV.a;let s=[];return n==="IndexToDirect"&&(s=e.UVIndex.a),{dataSize:2,buffer:i,indices:s,mappingType:t,referenceType:n}}parseVertexColors(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Colors.a;let s=[];n==="IndexToDirect"&&(s=e.ColorIndex.a);for(let a=0,o=new Me;a<i.length;a+=4)o.fromArray(i,a),ze.colorSpaceToWorking(o,ct),o.toArray(i,a);return{dataSize:4,buffer:i,indices:s,mappingType:t,referenceType:n}}parseMaterialIndices(e){const t=e.MappingInformationType,n=e.ReferenceInformationType;if(t==="NoMappingInformation")return{dataSize:1,buffer:[0],indices:[0],mappingType:"AllSame",referenceType:n};const i=e.Materials.a,s=[];for(let a=0;a<i.length;++a)s.push(a);return{dataSize:1,buffer:i,indices:s,mappingType:t,referenceType:n}}parseNurbsGeometry(e){const t=parseInt(e.Order);if(isNaN(t))return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s",e.Order,e.id),new mt;const n=t-1,i=e.KnotVector.a,s=[],a=e.Points.a;for(let u=0,d=a.length;u<d;u+=4)s.push(new rt().fromArray(a,u));let o,l;if(e.Form==="Closed")s.push(s[0]);else if(e.Form==="Periodic"){o=n,l=i.length-1-o;for(let u=0;u<n;++u)s.push(s[u])}const h=new Yx(n,i,s,o,l).getPoints(s.length*12);return new mt().setFromPoints(h)}}class jx{parse(){const e=[],t=this.parseClips();if(t!==void 0)for(const n in t){const i=t[n],s=this.addClip(i);e.push(s)}return e}parseClips(){if(We.Objects.AnimationCurve===void 0)return;const e=this.parseAnimationCurveNodes();this.parseAnimationCurves(e);const t=this.parseAnimationLayers(e);return this.parseAnimStacks(t)}parseAnimationCurveNodes(){const e=We.Objects.AnimationCurveNode,t=new Map;for(const n in e){const i=e[n];if(i.attrName.match(/S|R|T|DeformPercent/)!==null){const s={id:i.id,attr:i.attrName,curves:{}};t.set(s.id,s)}}return t}parseAnimationCurves(e){const t=We.Objects.AnimationCurve;for(const n in t){const i={id:t[n].id,times:t[n].KeyTime.a.map(iv),values:t[n].KeyValueFloat.a},s=Lt.get(i.id);if(s!==void 0){const a=s.parents[0].ID,o=s.parents[0].relationship;o.match(/X/)?e.get(a).curves.x=i:o.match(/Y/)?e.get(a).curves.y=i:o.match(/Z/)?e.get(a).curves.z=i:o.match(/DeformPercent/)&&e.has(a)&&(e.get(a).curves.morph=i)}}}parseAnimationLayers(e){const t=We.Objects.AnimationLayer,n=new Map;for(const i in t){const s=[],a=Lt.get(parseInt(i));a!==void 0&&(a.children.forEach(function(l,c){if(e.has(l.ID)){const h=e.get(l.ID);if(h.curves.x!==void 0||h.curves.y!==void 0||h.curves.z!==void 0){if(s[c]===void 0){const u=Lt.get(l.ID).parents.filter(function(f){return f.relationship!==void 0});if(u.length===0)return;const d=u[0].ID;if(d!==void 0){const f=We.Objects.Model[d.toString()];if(f===void 0){console.warn("THREE.FBXLoader: Encountered a unused curve.",l);return}const p={modelName:f.attrName?nt.sanitizeNodeName(f.attrName):"",ID:f.id,initialPosition:[0,0,0],initialRotation:[0,0,0],initialScale:[1,1,1]};Ht.traverse(function(_){_.ID===f.id&&(p.transform=_.matrix,_.userData.transformData&&(p.eulerOrder=_.userData.transformData.eulerOrder,_.userData.transformData.rotation&&(p.initialRotation=_.userData.transformData.rotation)))}),p.transform||(p.transform=new Se),"PreRotation"in f&&(p.preRotation=f.PreRotation.value),"PostRotation"in f&&(p.postRotation=f.PostRotation.value),s[c]=p}}s[c]&&(s[c][h.attr]=h)}else if(h.curves.morph!==void 0){if(s[c]===void 0){const u=Lt.get(l.ID).parents.filter(function(S){return S.relationship!==void 0});if(u.length===0)return;const d=u[0].ID,f=Lt.get(d).parents[0].ID,p=Lt.get(f).parents[0].ID,_=Lt.get(p).parents[0].ID,g=We.Objects.Model[_],m={modelName:g.attrName?nt.sanitizeNodeName(g.attrName):"",morphName:We.Objects.Deformer[d].attrName};s[c]=m}s[c][h.attr]=h}}}),n.set(parseInt(i),s))}return n}parseAnimStacks(e){const t=We.Objects.AnimationStack,n={};for(const i in t){const s=Lt.get(parseInt(i)).children;s.length>1&&console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");const a=e.get(s[0].ID);n[i]={name:t[i].attrName,layer:a}}return n}addClip(e){let t=[];const n=this;return e.layer.forEach(function(i){t=t.concat(n.generateTracks(i))}),new js(e.name,-1,t)}generateTracks(e){const t=[];let n=new b,i=new b;if(e.transform&&e.transform.decompose(n,new Dt,i),n=n.toArray(),i=i.toArray(),e.T!==void 0&&Object.keys(e.T.curves).length>0){const s=this.generateVectorTrack(e.modelName,e.T.curves,n,"position");s!==void 0&&t.push(s)}if(e.R!==void 0&&Object.keys(e.R.curves).length>0){const s=this.generateRotationTrack(e.modelName,e.R.curves,e.preRotation,e.postRotation,e.eulerOrder,e.initialRotation);s!==void 0&&t.push(s)}if(e.S!==void 0&&Object.keys(e.S.curves).length>0){const s=this.generateVectorTrack(e.modelName,e.S.curves,i,"scale");s!==void 0&&t.push(s)}if(e.DeformPercent!==void 0){const s=this.generateMorphTrack(e);s!==void 0&&t.push(s)}return t}generateVectorTrack(e,t,n,i){const s=this.getTimesForAllAxes(t),a=this.getKeyframeTrackValues(s,t,n);return new xs(e+"."+i,s,a)}generateRotationTrack(e,t,n,i,s,a){let o,l;if(t.x!==void 0||t.y!==void 0||t.z!==void 0){const f=this.getTimesForAllAxes(t);if(f.length>0){const p=a||[0,0,0],_=this.synchronizeCurve(t.x,f,p[0]),g=this.synchronizeCurve(t.y,f,p[1]),m=this.synchronizeCurve(t.z,f,p[2]),S=this.interpolateRotations(_,g,m,s);o=S[0],l=S[1]}}const c=tr(0);n!==void 0&&(n=n.map(ft.degToRad),n.push(c),n=new Wt().fromArray(n),n=new Dt().setFromEuler(n)),i!==void 0&&(i=i.map(ft.degToRad),i.push(c),i=new Wt().fromArray(i),i=new Dt().setFromEuler(i).invert());const h=new Dt,u=new Wt,d=[];if(!(!l||!o)){for(let f=0;f<l.length;f+=3)u.set(l[f],l[f+1],l[f+2],s),h.setFromEuler(u),n!==void 0&&h.premultiply(n),i!==void 0&&h.multiply(i),f>2&&new Dt().fromArray(d,(f-3)/3*4).dot(h)<0&&h.set(-h.x,-h.y,-h.z,-h.w),h.toArray(d,f/3*4);return new Ui(e+".quaternion",o,d)}}generateMorphTrack(e){const t=e.DeformPercent.curves.morph,n=t.values.map(function(s){return s/100}),i=Ht.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];return new _s(e.modelName+".morphTargetInfluences["+i+"]",t.times,n)}getTimesForAllAxes(e){let t=[];if(e.x!==void 0&&(t=t.concat(e.x.times)),e.y!==void 0&&(t=t.concat(e.y.times)),e.z!==void 0&&(t=t.concat(e.z.times)),t=t.sort(function(n,i){return n-i}),t.length>1){let n=1,i=t[0];for(let s=1;s<t.length;s++){const a=t[s];a!==i&&(t[n]=a,i=a,n++)}t=t.slice(0,n)}return t}getKeyframeTrackValues(e,t,n){const i=n,s=[];let a=-1,o=-1,l=-1;return e.forEach(function(c){if(t.x&&(a=t.x.times.indexOf(c)),t.y&&(o=t.y.times.indexOf(c)),t.z&&(l=t.z.times.indexOf(c)),a!==-1){const h=t.x.values[a];s.push(h),i[0]=h}else s.push(i[0]);if(o!==-1){const h=t.y.values[o];s.push(h),i[1]=h}else s.push(i[1]);if(l!==-1){const h=t.z.values[l];s.push(h),i[2]=h}else s.push(i[2])}),s}synchronizeCurve(e,t,n){if(e===void 0)return{times:t,values:t.map(()=>n)};if(e.times.length===t.length)return e;const i=[];for(let s=0;s<t.length;s++)i.push(this.sampleCurveValue(e,t[s],n));return{times:t,values:i}}sampleCurveValue(e,t,n){const i=e.times,s=e.values;if(t<=i[0])return s[0];if(t>=i[i.length-1])return s[s.length-1];for(let a=0;a<i.length-1;a++)if(t>=i[a]&&t<=i[a+1]){if(i[a]===t)return s[a];const o=(t-i[a])/(i[a+1]-i[a]);return s[a]*(1-o)+s[a+1]*o}return n}interpolateRotations(e,t,n,i){const s=[],a=[];s.push(e.times[0]),a.push(ft.degToRad(e.values[0])),a.push(ft.degToRad(t.values[0])),a.push(ft.degToRad(n.values[0]));for(let o=1;o<e.values.length;o++){const l=[e.values[o-1],t.values[o-1],n.values[o-1]];if(isNaN(l[0])||isNaN(l[1])||isNaN(l[2]))continue;const c=l.map(ft.degToRad),h=[e.values[o],t.values[o],n.values[o]];if(isNaN(h[0])||isNaN(h[1])||isNaN(h[2]))continue;const u=h.map(ft.degToRad),d=[h[0]-l[0],h[1]-l[1],h[2]-l[2]],f=[Math.abs(d[0]),Math.abs(d[1]),Math.abs(d[2])];if(f[0]>=180||f[1]>=180||f[2]>=180){const _=Math.max(...f)/180,g=new Wt(...c,i),m=new Wt(...u,i),S=new Dt().setFromEuler(g),M=new Dt().setFromEuler(m);S.dot(M)<0&&M.set(-M.x,-M.y,-M.z,-M.w);const v=e.times[o-1],E=e.times[o]-v,T=new Dt,w=new Wt;for(let x=0;x<1;x+=1/_)T.copy(S.clone().slerp(M.clone(),x)),s.push(v+x*E),w.setFromQuaternion(T,i),a.push(w.x),a.push(w.y),a.push(w.z)}else s.push(e.times[o]),a.push(ft.degToRad(e.values[o])),a.push(ft.degToRad(t.values[o])),a.push(ft.degToRad(n.values[o]))}return[s,a]}}class Qx{getPrevNode(){return this.nodeStack[this.currentIndent-2]}getCurrentNode(){return this.nodeStack[this.currentIndent-1]}getCurrentProp(){return this.currentProp}pushStack(e){this.nodeStack.push(e),this.currentIndent+=1}popStack(){this.nodeStack.pop(),this.currentIndent-=1}setCurrentProp(e,t){this.currentProp=e,this.currentPropName=t}parse(e){this.currentIndent=0,this.allNodes=new Au,this.nodeStack=[],this.currentProp=[],this.currentPropName="";const t=this,n=e.split(/[\r\n]+/);return n.forEach(function(i,s){const a=i.match(/^[\s\t]*;/),o=i.match(/^[\s\t]*$/);if(a||o)return;const l=i.match("^\\t{"+t.currentIndent+"}(\\w+):(.*){",""),c=i.match("^\\t{"+t.currentIndent+"}(\\w+):[\\s\\t\\r\\n](.*)"),h=i.match("^\\t{"+(t.currentIndent-1)+"}}");l?t.parseNodeBegin(i,l):c?t.parseNodeProperty(i,c,n[++s]):h?t.popStack():i.match(/^[^\s\t}]/)&&t.parseNodePropertyContinued(i)}),this.allNodes}parseNodeBegin(e,t){const n=t[1].trim().replace(/^"/,"").replace(/"$/,""),i=t[2].split(",").map(function(l){return l.trim().replace(/^"/,"").replace(/"$/,"")}),s={name:n},a=this.parseNodeAttr(i),o=this.getCurrentNode();this.currentIndent===0?this.allNodes.add(n,s):n in o?(n==="PoseNode"?o.PoseNode.push(s):o[n].id!==void 0&&(o[n]={},o[n][o[n].id]=o[n]),a.id!==""&&(o[n][a.id]=s)):typeof a.id=="number"?(o[n]={},o[n][a.id]=s):n!=="Properties70"&&(n==="PoseNode"?o[n]=[s]:o[n]=s),typeof a.id=="number"&&(s.id=a.id),a.name!==""&&(s.attrName=a.name),a.type!==""&&(s.attrType=a.type),this.pushStack(s)}parseNodeAttr(e){let t=e[0];e[0]!==""&&(t=parseInt(e[0]),isNaN(t)&&(t=e[0]));let n="",i="";return e.length>1&&(n=e[1].replace(/^(\w+)::/,""),i=e[2]),{id:t,name:n,type:i}}parseNodeProperty(e,t,n){let i=t[1].replace(/^"/,"").replace(/"$/,"").trim(),s=t[2].replace(/^"/,"").replace(/"$/,"").trim();i==="Content"&&s===","&&(s=n.replace(/"/g,"").replace(/,$/,"").trim());const a=this.getCurrentNode();if(a.name==="Properties70"){this.parseNodeSpecialProperty(e,i,s);return}if(i==="C"){const l=s.split(",").slice(1),c=parseInt(l[0]),h=parseInt(l[1]);let u=s.split(",").slice(3);u=u.map(function(d){return d.trim().replace(/^"/,"")}),i="connections",s=[c,h],rv(s,u),a[i]===void 0&&(a[i]=[])}i==="Node"&&(a.id=s),i in a&&Array.isArray(a[i])?a[i].push(s):i!=="a"?a[i]=s:a.a=s,this.setCurrentProp(a,i),i==="a"&&s.slice(-1)!==","&&(a.a=uo(s))}parseNodePropertyContinued(e){const t=this.getCurrentNode();t.a+=e,e.slice(-1)!==","&&(t.a=uo(t.a))}parseNodeSpecialProperty(e,t,n){const i=n.split('",').map(function(h){return h.trim().replace(/^\"/,"").replace(/\s/,"_")}),s=i[0],a=i[1],o=i[2],l=i[3];let c=i[4];switch(a){case"int":case"enum":case"bool":case"ULongLong":case"double":case"Number":case"FieldOfView":c=parseFloat(c);break;case"Color":case"ColorRGB":case"Vector3D":case"Lcl_Translation":case"Lcl_Rotation":case"Lcl_Scaling":c=uo(c);break}this.getPrevNode()[s]={type:a,type2:o,flag:l,value:c},this.setCurrentProp(this.getPrevNode(),s)}}class ev{parse(e){const t=new Mh(e);t.skip(23);const n=t.getUint32();if(n<6400)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+n);const i=new Au;for(;!this.endOfContent(t);){const s=this.parseNode(t,n);s!==null&&i.add(s.name,s)}return i}endOfContent(e){return e.size()%16===0?(e.getOffset()+160+16&-16)>=e.size():e.getOffset()+160+16>=e.size()}parseNode(e,t){const n={},i=t>=7500?e.getUint64():e.getUint32(),s=t>=7500?e.getUint64():e.getUint32();t>=7500?e.getUint64():e.getUint32();const a=e.getUint8(),o=e.getString(a);if(i===0)return null;const l=[];for(let d=0;d<s;d++)l.push(this.parseProperty(e));const c=l.length>0?l[0]:"",h=l.length>1?l[1]:"",u=l.length>2?l[2]:"";for(n.singleProperty=s===1&&e.getOffset()===i;i>e.getOffset();){const d=this.parseNode(e,t);d!==null&&this.parseSubNode(o,n,d)}return n.propertyList=l,typeof c=="number"&&(n.id=c),h!==""&&(n.attrName=h),u!==""&&(n.attrType=u),o!==""&&(n.name=o),n}parseSubNode(e,t,n){if(n.singleProperty===!0){const i=n.propertyList[0];Array.isArray(i)?(t[n.name]=n,n.a=i):t[n.name]=i}else if(e==="Connections"&&n.name==="C"){const i=[];n.propertyList.forEach(function(s,a){a!==0&&i.push(s)}),t.connections===void 0&&(t.connections=[]),t.connections.push(i)}else if(n.name==="Properties70")Object.keys(n).forEach(function(s){t[s]=n[s]});else if(e==="Properties70"&&n.name==="P"){let i=n.propertyList[0],s=n.propertyList[1];const a=n.propertyList[2],o=n.propertyList[3];let l;i.indexOf("Lcl ")===0&&(i=i.replace("Lcl ","Lcl_")),s.indexOf("Lcl ")===0&&(s=s.replace("Lcl ","Lcl_")),s==="Color"||s==="ColorRGB"||s==="Vector"||s==="Vector3D"||s.indexOf("Lcl_")===0?l=[n.propertyList[4],n.propertyList[5],n.propertyList[6]]:l=n.propertyList[4],t[i]={type:s,type2:a,flag:o,value:l}}else t[n.name]===void 0?typeof n.id=="number"?(t[n.name]={},t[n.name][n.id]=n):t[n.name]=n:n.name==="PoseNode"?(Array.isArray(t[n.name])||(t[n.name]=[t[n.name]]),t[n.name].push(n)):t[n.name][n.id]===void 0&&(t[n.name][n.id]=n)}parseProperty(e){const t=e.getString(1);let n;switch(t){case"C":return e.getBoolean();case"D":return e.getFloat64();case"F":return e.getFloat32();case"I":return e.getInt32();case"L":return e.getInt64();case"R":return n=e.getUint32(),e.getArrayBuffer(n);case"S":return n=e.getUint32(),e.getString(n);case"Y":return e.getInt16();case"b":case"c":case"d":case"f":case"i":case"l":const i=e.getUint32(),s=e.getUint32(),a=e.getUint32();if(s===0)switch(t){case"b":case"c":return e.getBooleanArray(i);case"d":return e.getFloat64Array(i);case"f":return e.getFloat32Array(i);case"i":return e.getInt32Array(i);case"l":return e.getInt64Array(i)}const o=kx(new Uint8Array(e.getArrayBuffer(a))),l=new Mh(o.buffer);switch(t){case"b":case"c":return l.getBooleanArray(i);case"d":return l.getFloat64Array(i);case"f":return l.getFloat32Array(i);case"i":return l.getInt32Array(i);case"l":return l.getInt64Array(i)}break;default:throw new Error("THREE.FBXLoader: Unknown property type "+t)}}}class Mh{constructor(e,t){this.dv=new DataView(e),this.offset=0,this.littleEndian=t!==void 0?t:!0,this._textDecoder=new TextDecoder}getOffset(){return this.offset}size(){return this.dv.buffer.byteLength}skip(e){this.offset+=e}getBoolean(){return(this.getUint8()&1)===1}getBooleanArray(e){const t=[];for(let n=0;n<e;n++)t.push(this.getBoolean());return t}getUint8(){const e=this.dv.getUint8(this.offset);return this.offset+=1,e}getInt16(){const e=this.dv.getInt16(this.offset,this.littleEndian);return this.offset+=2,e}getInt32(){const e=this.dv.getInt32(this.offset,this.littleEndian);return this.offset+=4,e}getInt32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt32());return t}getUint32(){const e=this.dv.getUint32(this.offset,this.littleEndian);return this.offset+=4,e}getInt64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t&2147483648?(t=~t&4294967295,e=~e&4294967295,e===4294967295&&(t=t+1&4294967295),e=e+1&4294967295,-(t*4294967296+e)):t*4294967296+e}getInt64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt64());return t}getUint64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t*4294967296+e}getFloat32(){const e=this.dv.getFloat32(this.offset,this.littleEndian);return this.offset+=4,e}getFloat32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat32());return t}getFloat64(){const e=this.dv.getFloat64(this.offset,this.littleEndian);return this.offset+=8,e}getFloat64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat64());return t}getArrayBuffer(e){const t=this.dv.buffer.slice(this.offset,this.offset+e);return this.offset+=e,t}getString(e){const t=this.offset;let n=new Uint8Array(this.dv.buffer,t,e);this.skip(e);const i=n.indexOf(0);return i>=0&&(n=new Uint8Array(this.dv.buffer,t,i)),this._textDecoder.decode(n)}}class Au{add(e,t){this[e]=t}}function tv(r){const e="Kaydara FBX Binary  \0";return r.byteLength>=e.length&&e===Ru(r,0,e.length)}function nv(r){const e=["K","a","y","d","a","r","a","\\","F","B","X","\\","B","i","n","a","r","y","\\","\\"];let t=0;function n(i){const s=r[i-1];return r=r.slice(t+i),t++,s}for(let i=0;i<e.length;++i)if(n(1)===e[i])return!1;return!0}function Sh(r){const e=/FBXVersion: (\d+)/,t=r.match(e);if(t)return parseInt(t[1]);throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.")}function iv(r){return r/46186158e3}const sv=[];function Gr(r,e,t,n){let i;switch(n.mappingType){case"ByPolygonVertex":i=r;break;case"ByPolygon":i=e;break;case"ByVertice":i=t;break;case"AllSame":i=n.indices[0];break;default:console.warn("THREE.FBXLoader: unknown attribute mapping type "+n.mappingType)}n.referenceType==="IndexToDirect"&&(i=n.indices[i]);const s=i*n.dataSize,a=s+n.dataSize;return av(sv,n.buffer,s,a)}const ho=new Wt,ts=new b;function Cu(r){const e=new Se,t=new Se,n=new Se,i=new Se,s=new Se,a=new Se,o=new Se,l=new Se,c=new Se,h=new Se,u=new Se,d=new Se,f=r.inheritType?r.inheritType:0;r.translation&&e.setPosition(ts.fromArray(r.translation));const p=tr(0);if(r.preRotation){const L=r.preRotation.map(ft.degToRad);L.push(p),t.makeRotationFromEuler(ho.fromArray(L))}if(r.rotation){const L=r.rotation.map(ft.degToRad);L.push(r.eulerOrder||p),n.makeRotationFromEuler(ho.fromArray(L))}if(r.postRotation){const L=r.postRotation.map(ft.degToRad);L.push(p),i.makeRotationFromEuler(ho.fromArray(L)),i.invert()}r.scale&&s.scale(ts.fromArray(r.scale)),r.scalingOffset&&o.setPosition(ts.fromArray(r.scalingOffset)),r.scalingPivot&&a.setPosition(ts.fromArray(r.scalingPivot)),r.rotationOffset&&l.setPosition(ts.fromArray(r.rotationOffset)),r.rotationPivot&&c.setPosition(ts.fromArray(r.rotationPivot)),r.parentMatrixWorld&&(u.copy(r.parentMatrix),h.copy(r.parentMatrixWorld));const _=t.clone().multiply(n).multiply(i),g=new Se;g.extractRotation(h);const m=new Se;m.copyPosition(h);const S=m.clone().invert().multiply(h),M=g.clone().invert().multiply(S),v=s,E=new Se;if(f===0)E.copy(g).multiply(_).multiply(M).multiply(v);else if(f===1)E.copy(g).multiply(M).multiply(_).multiply(v);else{const D=new Se().scale(new b().setFromMatrixScale(u)).clone().invert(),H=M.clone().multiply(D);E.copy(g).multiply(_).multiply(H).multiply(v)}const T=c.clone().invert(),w=a.clone().invert();let x=e.clone().multiply(l).multiply(c).multiply(t).multiply(n).multiply(i).multiply(T).multiply(o).multiply(a).multiply(s).multiply(w);const R=new Se().copyPosition(x),I=h.clone().multiply(R);return d.copyPosition(I),x=d.clone().multiply(E),x.premultiply(h.invert()),x}function tr(r){r=r||0;const e=["ZYX","YZX","XZY","ZXY","YXZ","XYZ"];return r===6?(console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."),e[0]):e[r]}function uo(r){return r.split(",").map(function(t){return parseFloat(t)})}function Ru(r,e,t){return e===void 0&&(e=0),t===void 0&&(t=r.byteLength),new TextDecoder().decode(new Uint8Array(r,e,t))}function rv(r,e){for(let t=0,n=r.length,i=e.length;t<i;t++,n++)r[n]=e[t]}function av(r,e,t,n){for(let i=t,s=0;i<n;i++,s++)r[s]=e[i];return r}function bh(r,e){if(e===pd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===nl||e===Xh){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===nl)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function dl(r,e){return e.getBoneName!==void 0?e.getBoneName(r):e.names[r.name]}function ov(r,e,t={}){const n=new Dt,i=new b,s=new Se,a=new Se;t.preserveBoneMatrix=t.preserveBoneMatrix!==void 0?t.preserveBoneMatrix:!0,t.preserveBonePositions=t.preserveBonePositions!==void 0?t.preserveBonePositions:!0,t.useTargetMatrix=t.useTargetMatrix!==void 0?t.useTargetMatrix:!1,t.hip=t.hip!==void 0?t.hip:"hip",t.hipInfluence=t.hipInfluence!==void 0?t.hipInfluence:new b(1,1,1),t.scale=t.scale!==void 0?t.scale:1,t.names=t.names||{};const o=e.isObject3D?e.skeleton.bones:ua(e),l=r.isObject3D?r.skeleton.bones:ua(r);let c,h,u,d;if(r.isObject3D?r.skeleton.pose():(t.useTargetMatrix=!0,t.preserveBoneMatrix=!1),t.preserveBonePositions){d=[];for(let f=0;f<l.length;f++)d.push(l[f].position.clone())}if(t.preserveBoneMatrix){r.updateMatrixWorld(),r.matrixWorld.identity();for(let f=0;f<r.children.length;++f)r.children[f].updateMatrixWorld(!0)}for(let f=0;f<l.length;++f)c=l[f],h=dl(c,t),u=Pu(h,o),a.copy(c.matrixWorld),u&&(u.updateMatrixWorld(),t.useTargetMatrix?s.copy(u.matrixWorld):(s.copy(r.matrixWorld).invert(),s.multiply(u.matrixWorld)),i.setFromMatrixScale(s),s.scale(i.set(1/i.x,1/i.y,1/i.z)),a.makeRotationFromQuaternion(n.setFromRotationMatrix(s)),r.isObject3D&&t.localOffsets&&t.localOffsets[c.name]&&a.multiply(t.localOffsets[c.name]),a.copyPosition(s)),h===t.hip&&(a.elements[12]*=t.scale*t.hipInfluence.x,a.elements[13]*=t.scale*t.hipInfluence.y,a.elements[14]*=t.scale*t.hipInfluence.z,t.hipPosition!==void 0&&(a.elements[12]+=t.hipPosition.x*t.scale,a.elements[13]+=t.hipPosition.y*t.scale,a.elements[14]+=t.hipPosition.z*t.scale)),c.parent?(c.matrix.copy(c.parent.matrixWorld).invert(),c.matrix.multiply(a)):c.matrix.copy(a),c.matrix.decompose(c.position,c.quaternion,c.scale),c.updateMatrixWorld();if(t.preserveBonePositions)for(let f=0;f<l.length;++f)c=l[f],h=dl(c,t)||c.name,h!==t.hip&&c.position.copy(d[f]);t.preserveBoneMatrix&&r.updateMatrixWorld(!0)}function wh(r,e,t,n={}){n.useFirstFramePosition=n.useFirstFramePosition!==void 0?n.useFirstFramePosition:!1,n.fps=n.fps!==void 0?n.fps:Math.max(...t.tracks.map(m=>m.times.length))/t.duration,n.names=n.names||[],e.isObject3D||(e=lv(e));const i=Math.round(t.duration*(n.fps/1e3)*1e3),s=t.duration/(i-1),a=[],o=new Vl(e),l=ua(r.skeleton),c=[];let h,u,d,f,p;o.clipAction(t).play();let _=0,g=i;n.trim!==void 0?(_=Math.round(n.trim[0]*n.fps),g=Math.min(Math.round(n.trim[1]*n.fps),i)-_,o.update(n.trim[0])):o.update(0),e.updateMatrixWorld();for(let m=0;m<g;++m){const S=m*s;ov(r,e,n);for(let M=0;M<l.length;++M)u=l[M],p=dl(u,n)||u.name,d=Pu(p,e.skeleton),d&&(f=c[M]=c[M]||{bone:u},n.hip===p&&(f.pos||(f.pos={times:new Float32Array(g),values:new Float32Array(g*3)}),n.useFirstFramePosition&&(m===0&&(h=u.position.clone()),u.position.sub(h)),f.pos.times[m]=S,u.position.toArray(f.pos.values,m*3)),f.quat||(f.quat={times:new Float32Array(g),values:new Float32Array(g*4)}),f.quat.times[m]=S,u.quaternion.toArray(f.quat.values,m*4));m===g-2?o.update(s-1e-7):o.update(s),e.updateMatrixWorld()}for(let m=0;m<c.length;++m)f=c[m],f&&(f.pos&&a.push(new xs(".bones["+f.bone.name+"].position",f.pos.times,f.pos.values)),a.push(new Ui(".bones["+f.bone.name+"].quaternion",f.quat.times,f.quat.values)));return o.uncacheAction(t),new js(t.name,-1,a)}function fl(r){const e=new Map,t=new Map,n=r.clone();return Iu(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const s=i,a=e.get(i),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Pu(r,e){for(let t=0,n=ua(e);t<n.length;t++)if(r===n[t].name)return n[t]}function ua(r){return Array.isArray(r)?r:r.bones}function lv(r){const e=new bp(r.bones[0]);return e.skeleton=r,e}function Iu(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)Iu(r.children[n],e.children[n],t)}class or extends ni{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new fv(t)}),this.register(function(t){return new pv(t)}),this.register(function(t){return new bv(t)}),this.register(function(t){return new wv(t)}),this.register(function(t){return new Tv(t)}),this.register(function(t){return new gv(t)}),this.register(function(t){return new _v(t)}),this.register(function(t){return new xv(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new dv(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new mv(t)}),this.register(function(t){return new Sv(t)}),this.register(function(t){return new Mv(t)}),this.register(function(t){return new hv(t)}),this.register(function(t){return new Th(t,Je.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Th(t,Je.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ev(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=cs.extractUrlBase(e);a=cs.resolveURL(c,this.path)}else a=cs.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Ul(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Lu){try{a[Je.KHR_BINARY_GLTF]=new Av(e)}catch(u){i&&i(u);return}s=JSON.parse(a[Je.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new zv(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case Je.KHR_MATERIALS_UNLIT:a[u]=new uv;break;case Je.KHR_DRACO_MESH_COMPRESSION:a[u]=new Cv(s,this.dracoLoader);break;case Je.KHR_TEXTURE_TRANSFORM:a[u]=new Rv;break;case Je.KHR_MESH_QUANTIZATION:a[u]=new Pv;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function cv(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Ft(r,e,t){const n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Je={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class hv{constructor(e){this.parser=e,this.name=Je.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new Me(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],hn);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Qs(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new sn(h),c.distance=u;break;case"spot":c=new hu(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Nn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class uv{constructor(){this.name=Je.KHR_MATERIALS_UNLIT}getMaterialType(){return Mt}extendParams(e,t,n){const i=[];e.color=new Me(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],hn),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,ct))}return Promise.all(i)}}class dv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class fv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Oe(s,s)}return Promise.all(i)}}class pv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class mv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class gv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Me(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],hn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,ct)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class _v{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class xv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Me().setRGB(s[0],s[1],s[2],hn),Promise.all(i)}}class vv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_IOR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class yv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const s=n.specularColorFactor||[1,1,1];return t.specularColor=new Me().setRGB(s[0],s[1],s[2],hn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,ct)),Promise.all(i)}}class Mv{constructor(e){this.parser=e,this.name=Je.EXT_MATERIALS_BUMP}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class Sv{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?Hn:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class bv{constructor(e){this.parser=e,this.name=Je.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class wv{constructor(e){this.parser=e,this.name=Je.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Tv{constructor(e){this.parser=e,this.name=Je.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Th{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class Ev{constructor(e){this.name=Je.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==fn.TRIANGLES&&c.mode!==fn.TRIANGLE_STRIP&&c.mode!==fn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const p of u){const _=new Se,g=new b,m=new Dt,S=new b(1,1,1),M=new Jh(p.geometry,p.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,v),l.SCALE&&S.fromBufferAttribute(l.SCALE,v),M.setMatrixAt(v,_.compose(g,m,S));for(const v in l)if(v==="_COLOR_0"){const E=l[v];M.instanceColor=new sl(E.array,E.itemSize,E.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&p.geometry.setAttribute(v,l[v]);pt.prototype.copy.call(M,p),this.parser.assignFinalMaterial(M),f.push(M)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Lu="glTF",Ds=12,Eh={JSON:1313821514,BIN:5130562};class Av{constructor(e){this.name=Je.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ds),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Lu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ds,s=new DataView(e,Ds);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Eh.JSON){const c=new Uint8Array(e,Ds+a,o);this.content=n.decode(c)}else if(l===Eh.BIN){const c=Ds+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Cv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Je.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=pl[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=pl[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=hs[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const p in f.attributes){const _=f.attributes[p],g=l[p];g!==void 0&&(_.normalized=g)}u(f)},o,c,hn,d)})})}}class Rv{constructor(){this.name=Je.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Pv{constructor(){this.name=Je.KHR_MESH_QUANTIZATION}}class Du extends vs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,_=p-c,g=-2*f+3*d,m=f-d,S=1-g,M=m-d+u;for(let v=0;v!==o;v++){const E=a[_+v+o],T=a[_+v+l]*h,w=a[p+v+o],x=a[p+v]*h;s[v]=S*E+M*T+g*w+m*x}return s}}const Iv=new Dt;class Lv extends Du{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return Iv.fromArray(s).normalize().toArray(s),s}}const fn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},hs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ah={9728:Bt,9729:Ot,9984:kh,9985:Kr,9986:Ns,9987:On},Ch={33071:mn,33648:ea,10497:nn},fo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},pl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},mi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Dv={CUBICSPLINE:void 0,LINEAR:Xs,STEP:Ws},po={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Fv(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Xe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Qn})),r.DefaultMaterial}function Ai(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Nn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Nv(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(d)}if(s){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function Uv(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Ov(r){let e;const t=r.extensions&&r.extensions[Je.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+mo(t.attributes):e=r.indices+":"+mo(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+mo(r.targets[n]);return e}function mo(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function ml(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function kv(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Bv=new Se;class zv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new cv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new lu(this.options.manager):this.textureLoader=new lp(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ul(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Ai(s,o,i),Nn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Je.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(cs.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=fo[i.type],o=hs[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new ot(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=fo[i.type],c=hs[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let _,g;if(f&&f!==u){const m=Math.floor(d/f),S="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let M=t.cache.get(S);M||(_=new c(o,m*f,i.count*f/h),M=new lf(_,f/h),t.cache.add(S,M)),g=new Ll(M,l,d%f/h,p)}else o===null?_=new c(i.count*l):_=new c(o,d,i.count*l),g=new ot(_,l,p);if(i.sparse!==void 0){const m=fo.SCALAR,S=hs[i.sparse.indices.componentType],M=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,E=new S(a[1],M,i.sparse.count*m),T=new c(a[2],v,i.sparse.count*l);o!==null&&(g=new ot(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let w=0,x=E.length;w<x;w++){const R=E[w];if(g.setX(R,T[w*l]),l>=2&&g.setY(R,T[w*l+1]),l>=3&&g.setZ(R,T[w*l+2]),l>=4&&g.setW(R,T[w*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(s.samplers||{})[a.sampler]||{};return h.magFilter=Ah[d.magFilter]||Ot,h.minFilter=Ah[d.minFilter]||On,h.wrapS=Ch[d.wrapS]||nn,h.wrapT=Ch[d.wrapT]||nn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Bt&&h.minFilter!==Ot,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(_){const g=new kt(_);g.needsUpdate=!0,d(g)}),t.load(cs.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Nn(u,a),u.userData.mimeType=a.mimeType||kv(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[Je.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Je.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Je.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new yi,xn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ga,xn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Xe}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Je.KHR_MATERIALS_UNLIT]){const u=i[Je.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{const u=s.pbrMetallicRoughness||{};if(o.color=new Me(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],hn),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,ct)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=en);const h=s.alphaMode||po.OPAQUE;if(h===po.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===po.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Oe(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Mt){const u=s.emissiveFactor;o.emissive=new Me().setRGB(u[0],u[1],u[2],hn)}return s.emissiveTexture!==void 0&&a!==Mt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,ct)),Promise.all(c).then(function(){const u=new a(o);return s.name&&(u.name=s.name),Nn(u,s),t.associations.set(u,{materials:e}),s.extensions&&Ai(i,u,s),u})}createUniqueName(e){const t=nt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[Je.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Rh(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=Ov(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[Je.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Rh(new mt,c,t),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?Fv(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,p=h.length;f<p;f++){const _=h[f],g=a[f];let m;const S=c[f];if(g.mode===fn.TRIANGLES||g.mode===fn.TRIANGLE_STRIP||g.mode===fn.TRIANGLE_FAN||g.mode===void 0)m=s.isSkinnedMesh===!0?new Zh(_,S):new ee(_,S),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),g.mode===fn.TRIANGLE_STRIP?m.geometry=bh(m.geometry,Xh):g.mode===fn.TRIANGLE_FAN&&(m.geometry=bh(m.geometry,nl));else if(g.mode===fn.LINES)m=new jh(_,S);else if(g.mode===fn.LINE_STRIP)m=new _a(_,S);else if(g.mode===fn.LINE_LOOP)m=new _f(_,S);else if(g.mode===fn.POINTS)m=new Fi(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&Uv(m,s),m.name=t.createUniqueName(s.name||"mesh_"+e),Nn(m,s),g.extensions&&Ai(i,m,g),t.assignFinalMaterial(m),u.push(m)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&Ai(i,u[0],s),u[0];const d=new lt;s.extensions&&Ai(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new $t(ft.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ma(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Nn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new Se;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new xi(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],p=i.samplers[f.sampler],_=f.target,g=_.node,m=i.parameters!==void 0?i.parameters[p.input]:p.input,S=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",S)),c.push(p),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],p=u[2],_=u[3],g=u[4],m=[];for(let M=0,v=d.length;M<v;M++){const E=d[M],T=f[M],w=p[M],x=_[M],R=g[M];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const I=n._createAnimationTracks(E,T,w,x,R);if(I)for(let L=0;L<I.length;L++)m.push(I[L])}const S=new js(s,void 0,m);return Nn(S,i),S})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Bv)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,p=u[0];h.pivot=new b().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new oa:c.length>1?h=new lt:c.length===1?h=c[0]:h=new pt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=a),Nn(h,s),s.extensions&&Ai(n,h,s),s.matrix!==void 0){const u=new Se;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new lt;n.name&&(s.name=i.createUniqueName(n.name)),Nn(s,n),n.extensions&&Ai(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?s.add(fl(d)):s.add(d)}const c=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof xn||d instanceof kt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}mi[s.path]===mi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(mi[s.path]){case mi.weights:h=_s;break;case mi.rotation:h=Ui;break;case mi.translation:case mi.scale:h=xs;break;default:switch(n.itemSize){case 1:h=_s;break;case 2:case 3:default:h=xs;break}break}const u=i.interpolation!==void 0?Dv[i.interpolation]:Xs,d=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){const _=new h(l[f]+"."+mi[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ml(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Ui?Lv:Du;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Vv(r,e,t){const n=e.attributes,i=new tn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new b(l[0],l[1],l[2]),new b(c[0],c[1],c[2])),o.normalized){const h=ml(hs[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new b,l=new b;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const _=ml(hs[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new Gn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Rh(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=pl[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return ze.workingColorSpace!==hn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ze.workingColorSpace}" not supported.`),Nn(r,e),Vv(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Nv(r,e.targets,t):r})}class Gv{constructor(){C(this,"fbxLoader",new $x);C(this,"gltfLoader",new or)}async loadAndRetargetClip(e,t,n,i){try{const s=await this.fbxLoader.loadAsync(e);if(s.animations&&s.animations.length>0){let a=s.animations[0];if(s.animations.length>1){const _=s.animations.find(g=>g.name.toLowerCase().includes("mixamo")||g.name.toLowerCase().includes("layer0")||!g.name.toLowerCase().includes("camera"));_&&(a=_)}const o=fl(n),l=[];o.traverse(_=>{_.isBone&&l.push(_)}),o.skeleton=new xi(l),o.updateMatrixWorld(!0);const c=[];s.traverse(_=>{_.isBone&&c.push(_)}),s.skeleton=new xi(c),s.updateMatrixWorld(!0);const h=new Map;c.forEach(_=>{h.set(_.name.toLowerCase().replace(/[:_\-\s]/g,""),_.name)});const u=_=>{const g=_.name.toLowerCase().replace(/[:_\-\s]/g,"");return h.get(g)||_.name},d=h.get("mixamorighips")||"mixamorig:Hips",f="mixamorig:Hips";a.tracks=a.tracks.filter(_=>_.name.endsWith(".position")?(console.log(`[AssetManager] Pre-strip position track from raw FBX: "${_.name}"`),!1):!_.name.endsWith(".scale"));let p=wh(o,s,a,{preserveBonePositions:!0,hip:d,getBoneName:u,scale:i});p.name=t,p.tracks=p.tracks.filter(_=>_.name.endsWith(".scale")?!1:_.name.endsWith(".position")?(console.log(`[AssetManager] Post-strip position track: "${_.name}"`),!1):!0);for(const _ of p.tracks){const g=_.name.match(/\.bones\[(.*?)\]\.(.*)/);g&&(_.name=`${g[1]}.${g[2]}`)}return console.log(`[AssetManager] ✅ '${t}' → ${p.tracks.length} rotation tracks, ${p.duration.toFixed(2)}s`),p}}catch(s){console.warn(`[AssetManager] ❌ Failed to load clip from ${e}`,s)}return null}async loadAndRetargetGltfClip(e,t,n){try{const i=await this.gltfLoader.loadAsync(e);if(i.animations&&i.animations.length>0){const s=i.animations[0];s.tracks=s.tracks.filter(_=>!(_.name.endsWith(".position")||_.name.endsWith(".scale")));const a=fl(n),o=[];a.traverse(_=>{_.isBone&&o.push(_)}),a.skeleton=new xi(o),a.updateMatrixWorld(!0);const l=[];i.scene.traverse(_=>{_.isBone&&l.push(_)}),i.scene.skeleton=new xi(l),i.scene.updateMatrixWorld(!0);const c=new Map;l.forEach(_=>{c.set(_.name.toLowerCase().replace(/[:_\-\s]/g,""),_.name)});const h=_=>{const g=_.name.toLowerCase().replace(/[:_\-\s]/g,"");return c.get(g)||_.name},u=c.get("mixamorighips")||"mixamorig:Hips";let d=wh(a,i.scene,s,{preserveBonePositions:!0,hip:u,getBoneName:h,scale:1});d.name=t,d.tracks=d.tracks.filter(_=>!(_.name.endsWith(".scale")||_.name.endsWith(".position")));for(const _ of d.tracks){const g=_.name.match(/\.bones\[(.*?)\]\.(.*)/);g&&(_.name=`${g[1]}.${g[2]}`)}console.log(`[AssetManager] ✅ GLB '${t}' → ${d.tracks.length} rotation tracks, ${d.duration.toFixed(2)}s`);const f=[],p=i.scene.getObjectByName("Cylinder");return p&&(console.log("[AssetManager] Extracted external mesh 'Cylinder' from GLB"),f.push(p)),{clip:d,externalMeshes:f}}}catch(i){console.warn(`[AssetManager] ❌ Failed to load GLB clip from ${e}`,i)}return null}async loadPlayerModel(){try{console.log("[AssetManager] Loading base character model...");let e=null,t=!1,n=1;try{console.log("[AssetManager] Loading player.glb via GLTFLoader..."),e=(await this.gltfLoader.loadAsync("/magic-academy-3d/assets/characters/player.glb?v=7")).scene,console.log("[AssetManager] ✅ Loaded player.glb successfully"),e.traverse(w=>{w.name.toLowerCase().includes("vaculo")&&(w.visible=!1,t=!0,console.log("[AssetManager] Found and hidden embedded staff (Vaculo) in player.glb"))});const v=e.getObjectByName("mixamorig:Hips");v&&(v.position.z=0,console.log("[AssetManager] Corrected mixamorig:Hips initial Z position to 0"));const E=e.getObjectByName("Armature");let T=1;E&&(T=E.scale.x),n=.01/T,console.log(`[AssetManager] GLTF detected. Armature scale = ${T.toFixed(4)}. Base scale factor = ${n.toFixed(5)}`)}catch(M){console.warn("[AssetManager] player.glb failed to load, falling back to FBX",M)}if(!e)try{e=await this.fbxLoader.loadAsync("/magic-academy-3d/assets/characters/Idle_nowood.fbx?v=7")}catch{console.warn("[AssetManager] Idle_nowood.fbx failed, trying Wukong_NoWood.fbx"),e=await this.fbxLoader.loadAsync("/magic-academy-3d/assets/characters/Wukong_NoWood.fbx")}const i=[];e.traverse(M=>{M.isBone&&i.push(M.name)}),console.log("[AssetManager] Skeleton bones found:",i.slice(0,15).join(", "),i.length>15?`... (${i.length} total)`:"");const s=new tn().setFromObject(e),a=new b;if(s.getSize(a),a.y>0){const M=1.7/a.y;e.scale.setScalar(M),console.log(`[AssetManager] Auto-scaled by ${M.toFixed(3)} (${a.y.toFixed(2)}m → 1.7m)`)}{const v=new tn().setFromObject(e).min.y;Math.abs(v)>.001&&(e.position.y-=v,console.log(`[AssetManager] Pinned feet to Y=0 in T-pose (shifted by ${(-v).toFixed(4)}m)`))}if(e.traverse(M=>{if(M.isMesh){M.castShadow=!0,M.receiveShadow=!0;const E=M.material;if(E){const T=w=>{w.shadowSide=en,w.transparent&&w.opacity>=.99&&(w.transparent=!1,w.depthWrite=!0),w.map&&(w.map.anisotropy=16,w.map.minFilter=On,w.map.magFilter=Ot,w.map.needsUpdate=!0);const x=M.name.toLowerCase();x.includes("cabeza")||x.includes("skin")||x.includes("face")||x.includes("pierna")||x.includes("brazo")?(w.roughness=.85,w.metalness=0):x.includes("hair")||x.includes("cabello")||x.includes("ceja")?(w.roughness=.75,w.metalness=.1):x.includes("vaculo")||x.includes("baculo")||x.includes("metal")||x.includes("oro")||x.includes("gold")?(w.roughness=.2,w.metalness=.85,x.includes("vaculo")&&(w.emissive=new Me(3812864),w.emissiveIntensity=.2)):(w.roughness=.65,w.metalness=.05),w.needsUpdate=!0};Array.isArray(E)?E.forEach(T):T(E)}}}),!t)try{const v=(await this.gltfLoader.loadAsync("/magic-academy-3d/assets/characters/baculo.glb?v=7")).scene;v.name="magic_wand",v.visible=!1;let E=null;e.traverse(T=>{const w=T.name.toLowerCase();w.includes("righthand")&&!w.includes("thumb")&&!w.includes("index")&&!w.includes("middle")&&!w.includes("ring")&&!w.includes("pinky")&&(E=T)}),E?(v.scale.setScalar(1),v.position.set(0,.05,0),v.rotation.set(Math.PI*.5,0,0),E.add(v),console.log("[AssetManager] ✅ Attached baculo.glb to bone:",E.name)):(v.scale.setScalar(.01),v.position.set(0,0,0),e.add(v),console.warn("[AssetManager] ⚠️ No RightHand bone found, attached staff to root"))}catch(M){console.warn("[AssetManager] Could not load baculo.glb staff",M)}const o=[],l=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Idle_nowood.fbx?v=7","Idle_Unarmed",e,n);l&&o.push(l);const c=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Running_nowood.fbx?v=7","Run_Unarmed",e,n);c&&o.push(c);const h=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Jumping_nowood.fbx?v=7","Jump_Unarmed",e,n);h&&o.push(h);const u=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/wukong_no_wood_double_jumpFront Flip.fbx?v=7","Wukong_NoWood_DoubleJump",e,n);u&&o.push(u);const d=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Taking_item_nowood.fbx?v=7","TakeItem",e,n);d&&o.push(d);const f=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Wukong_no_wood_kik.fbx?v=7","Wukong_NoWood_Kick",e,n);f&&o.push(f);const p=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/wukong_no_woodHard Landing.fbx?v=7","Wukong_NoWood_HardLanding",e,n);p&&o.push(p);const _=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Idle.fbx?v=7","Idle_Armed",e,n);_&&o.push(_);const g=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Run.fbx?v=7","Run_Armed",e,n);g&&o.push(g);const m=await this.loadAndRetargetClip("/magic-academy-3d/assets/characters/Jump.fbx?v=7","Jump_Armed",e,n);m&&o.push(m);const S=await this.loadAndRetargetGltfClip("/magic-academy-3d/assets/characters/atack_wood.glb","CastSpell",e);return S&&(o.push(S.clip),S.externalMeshes.forEach(M=>{if(M.name==="Cylinder"){M.name="atack_wood_staff",M.visible=!1;let v=null;e.traverse(E=>{const T=E.name.toLowerCase();T.includes("lefthand")&&!T.includes("thumb")&&!T.includes("index")&&!T.includes("middle")&&!T.includes("ring")&&!T.includes("pinky")&&(v=E)}),v&&(v.add(M),console.log("[AssetManager] Attached 'atack_wood_staff' to LeftHand"))}})),console.log(`[AssetManager] 🎬 Total clips loaded: ${o.length} → [${o.map(M=>M.name).join(", ")}]`),{model:e,clips:o}}catch(e){return console.error("[AssetManager] Failed to load player model:",e),{model:this.createProceduralPlayer(),clips:[]}}}createProceduralPlayer(){const e=new lt;e.name="ProceduralPlayer";const t=new Xe({color:2037816,roughness:.6,metalness:.2}),n=new Xe({color:15976004,metalness:.8,roughness:.3}),i=new Xe({color:16765878,roughness:.8}),s=new Xe({color:15658751,roughness:.7}),a=new Xe({color:4861467,roughness:.8}),o=new ee(new yt(.24,.48,1.3,12),t);o.position.y=.75,o.name="body",o.castShadow=!0,e.add(o);const l=new ee(new yt(.34,.36,.12,12),n);l.position.y=.75,e.add(l);const c=new ee(new Zt(.24,12,12),i);c.position.y=1.52,c.castShadow=!0,e.add(c);const h=new ee(new Zt(.26,12,12,0,Math.PI*2,0,Math.PI*.6),s);h.position.y=1.54,e.add(h);const u=new Zt(.035,8,8),d=new Mt({color:4060159}),f=new ee(u,d);f.position.set(-.08,1.54,.21);const p=new ee(u,d);p.position.set(.08,1.54,.21),e.add(f,p);const _=new lt;_.name="magic_wand",_.position.set(.42,.85,.2);const g=new ee(new yt(.03,.025,1.8,10),a);g.position.y=.4,_.add(g);const m=new ee(new ii(.14,.025,8,16),n);m.position.y=1.25,_.add(m);const S=new ee(new Zt(.09,12,12),new Mt({color:4060159}));S.position.y=1.25,S.name="staff_crystal_tip",_.add(S);const M=new sn(4060159,2.5,4);M.position.y=1.25,_.add(M),e.add(_);const v=new yt(.08,.08,.38,8),E=new Xe({color:1183008}),T=new ee(v,E);T.name="leg_L",T.position.set(-.14,.19,0),T.castShadow=!0;const w=new ee(v,E);return w.name="leg_R",w.position.set(.14,.19,0),w.castShadow=!0,e.add(T,w),e}}class Hv{constructor(e){C(this,"camera");C(this,"target",null);C(this,"yaw",0);C(this,"pitch",.25);C(this,"distance",5.5);C(this,"heightOffset",1.65);C(this,"minPitch",-.45);C(this,"maxPitch",1.15);C(this,"currentPosition",new b);C(this,"currentLookAt",new b);C(this,"currentDistance",5.5);C(this,"idleTimer",0);C(this,"RECENTER_DELAY",.8);C(this,"isManual",!1);C(this,"collisionRaycaster",new er);C(this,"collisionObjects",[]);C(this,"prevYaw",0);C(this,"prevPitch",0);C(this,"angularSpeed",0);C(this,"blurCanvas",null);C(this,"blurCtx",null);this.camera=e,this.initMotionBlur()}initMotionBlur(){const e=document.createElement("canvas");e.id="motion-blur-overlay",e.style.cssText=["position:fixed","inset:0","width:100%","height:100%","pointer-events:none","z-index:10","opacity:0"].join(";"),document.body.appendChild(e),this.blurCanvas=e,this.blurCtx=e.getContext("2d"),this.resizeBlurCanvas(),window.addEventListener("resize",()=>this.resizeBlurCanvas())}resizeBlurCanvas(){this.blurCanvas&&(this.blurCanvas.width=window.innerWidth,this.blurCanvas.height=window.innerHeight)}updateMotionBlur(e){if(!this.blurCtx||!this.blurCanvas)return;const t=Math.hypot(this.yaw-this.prevYaw,this.pitch-this.prevPitch)/e;this.prevYaw=this.yaw,this.prevPitch=this.pitch,this.angularSpeed=ft.lerp(this.angularSpeed,t,Math.min(1,e*12));const n=ft.clamp((this.angularSpeed-.8)/3.2,0,1),i=this.blurCtx,s=this.blurCanvas.width,a=this.blurCanvas.height;if(i.clearRect(0,0,s,a),n>.01){const o=Math.ceil(n*5),l=n*18;for(let c=0;c<o;c++){const u=(c+1)/o*l,d=n*.06/o,f=i.createRadialGradient(s/2,a/2,a*.15,s/2,a/2,a*.72);f.addColorStop(0,"rgba(0,0,0,0)"),f.addColorStop(1,`rgba(0,0,0,${d.toFixed(3)})`),i.save(),i.translate(s/2,a/2),i.scale(1+u*.004,1+u*.004),i.translate(-s/2,-a/2),i.fillStyle=f,i.fillRect(0,0,s,a),i.restore()}}this.blurCanvas.style.opacity=(n*.85).toFixed(3)}setTarget(e){this.target=e,this.target&&(this.currentLookAt.copy(this.target.position),this.currentLookAt.y+=this.heightOffset,this.updatePosition(1,null))}setCollisionObjects(e){this.collisionObjects=e}update(e,t){if(!this.target)return;const n=t.consumeMouseDelta(),i=.0024;this.isManual=Math.hypot(n.x,n.y)>.5,this.isManual?(this.yaw-=n.x*i,this.pitch-=n.y*i,this.pitch=ft.clamp(this.pitch,this.minPitch,this.maxPitch),this.idleTimer=0):this.idleTimer+=e;const s=t.moveForward||t.moveBackward||t.moveLeft||t.moveRight;if(!this.isManual&&this.idleTimer>this.RECENTER_DELAY&&s){let o=this.target.rotation.y+Math.PI-this.yaw;for(;o<-Math.PI;)o+=Math.PI*2;for(;o>Math.PI;)o-=Math.PI*2;const l=Math.min(1,e*2.2);this.yaw+=o*l}this.updatePosition(e,t),this.updateMotionBlur(e)}updatePosition(e,t){if(!this.target)return;const n=new b().copy(this.target.position).add(new b(0,this.heightOffset,0)),i=Math.min(1,e*13);this.currentLookAt.lerp(n,i);const s=new b(Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),Math.cos(this.yaw)*Math.cos(this.pitch));let a=this.distance;if(this.collisionObjects.length>0){this.collisionRaycaster.set(this.currentLookAt,s);const d=this.collisionRaycaster.intersectObjects(this.collisionObjects,!0);d.length>0&&d[0].distance<this.distance&&(a=Math.max(.7,d[0].distance-.3))}const o=a<this.currentDistance,l=Math.min(1,e*(o?28:5.5));this.currentDistance=ft.lerp(this.currentDistance,a,l);const c=new b().copy(this.currentLookAt).addScaledVector(s,this.currentDistance);this.currentPosition.lerp(c,i);const u=(t?t.isRunning&&(t.moveForward||t.moveBackward||t.moveLeft||t.moveRight):!1)?65:60;this.camera.fov=ft.lerp(this.camera.fov,u,Math.min(1,e*6)),this.camera.updateProjectionMatrix(),this.camera.position.copy(this.currentPosition),this.camera.lookAt(this.currentLookAt)}getForwardVector(){return new b(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).normalize()}getRightVector(){return new b(Math.cos(this.yaw),0,-Math.sin(this.yaw)).normalize()}}class Wv{constructor(e,t=[]){C(this,"mixer",null);C(this,"allActions",new Map);C(this,"currentAction",null);C(this,"currentState","Idle");C(this,"characterGroup",null);C(this,"proceduralTime",0);C(this,"isProcedural",!1);C(this,"isArmed",!1);C(this,"isPlayingOneShot",!1);t&&t.length>0?this.initAnimations(e,t):(this.isProcedural=!0,e instanceof lt&&(this.characterGroup=e))}initAnimations(e,t){this.mixer=new Vl(e),console.log("[AnimCtrl] Registering clips:",t.map(n=>`${n.name} (${n.tracks.length}t, ${n.duration.toFixed(1)}s)`).join(" | "));for(const n of t){const i=this.mixer.clipAction(n);(n.name==="TakeItem"||n.name==="CastSpell"||n.name==="Wukong_NoWood_Kick"||n.name==="Wukong_NoWood_DoubleJump"||n.name==="Wukong_NoWood_HardLanding")&&(i.setLoop(ia,1),i.clampWhenFinished=!0),n.name.includes("Jump")&&(i.setLoop(ia,1),i.clampWhenFinished=!0),this.allActions.set(n.name,i)}this.playState("Idle")}resolveClipName(e){if(e==="CastSpell")return"CastSpell";if(e==="Wukong_NoWood_DoubleJump")return"Wukong_NoWood_DoubleJump";if(e==="Wukong_NoWood_HardLanding")return"Wukong_NoWood_HardLanding";const t=this.isArmed?"_Armed":"_Unarmed";return e==="Idle"?"Idle"+t:e==="Run"||e==="Walk"?"Run"+t:e==="Jump"?"Jump"+t:"Idle"+t}playCastSpellAnimation(e,t){const n=this.allActions.get("CastSpell");if(!n||!this.mixer){e(),t();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==n&&this.currentAction.fadeOut(.1),n.reset().setEffectiveWeight(1).setEffectiveTimeScale(1.7).fadeIn(.08).play(),this.currentAction=n,this.currentState="CastSpell";let i=!1;const a=n.getClip().duration*.8,o=()=>{!i&&n.time>=a&&(i=!0,e())},l=h=>{var u;h.action===n&&((u=this.mixer)==null||u.removeEventListener("finished",l),i||(i=!0,e()),this.isPlayingOneShot=!1,t())};this.mixer.addEventListener("finished",l);const c=()=>{this.isPlayingOneShot&&this.currentAction===n&&(o(),i||requestAnimationFrame(c))};requestAnimationFrame(c)}playWukongKick(e,t){const n=this.allActions.get("Wukong_NoWood_Kick");if(!n||!this.mixer){e(),t();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==n&&this.currentAction.fadeOut(.1),n.reset().setEffectiveWeight(1).setEffectiveTimeScale(1.4).fadeIn(.08).play(),this.currentAction=n;let i=!1;const a=n.getClip().duration*.5,o=()=>{!i&&n.time>=a&&(i=!0,e())},l=h=>{var u;h.action===n&&((u=this.mixer)==null||u.removeEventListener("finished",l),i||(i=!0,e()),this.isPlayingOneShot=!1,t())};this.mixer.addEventListener("finished",l);const c=()=>{this.isPlayingOneShot&&this.currentAction===n&&(o(),i||requestAnimationFrame(c))};requestAnimationFrame(c)}playHardLanding(e){const t=this.allActions.get("Wukong_NoWood_HardLanding");if(!t||!this.mixer){e();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==t&&this.currentAction.fadeOut(.15),t.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).fadeIn(.1).play(),this.currentAction=t,this.currentState="Wukong_NoWood_HardLanding";const n=i=>{var s;i.action===t&&((s=this.mixer)==null||s.removeEventListener("finished",n),this.isPlayingOneShot=!1,e())};this.mixer.addEventListener("finished",n)}setArmed(e){if(this.isArmed===e)return;this.isArmed=e,console.log(`[AnimCtrl] Mode → ${e?"🪄 ARMED":"🤲 UNARMED"}`);const t=this.currentState;this.currentState="",this.playState(t,.25)}playTakeItemAnimation(e){const t=this.allActions.get("TakeItem");if(!t||!this.mixer){this.setArmed(!0),e&&e();return}this.isPlayingOneShot=!0,this.currentAction&&this.currentAction!==t&&this.currentAction.fadeOut(.2),t.reset().setEffectiveWeight(1).fadeIn(.15).play(),this.currentAction=t;const n=i=>{var s;i.action===t&&((s=this.mixer)==null||s.removeEventListener("finished",n),this.isPlayingOneShot=!1,this.setArmed(!0),e&&e())};this.mixer.addEventListener("finished",n)}playState(e,t=.2){if(this.isPlayingOneShot||this.currentState===e&&this.currentAction&&this.currentAction.isRunning())return;if(this.isProcedural){this.currentState=e;return}const n=this.resolveClipName(e),i=this.allActions.get(n);if(!i){const s=this.allActions.get("Idle_Unarmed")||this.allActions.get("Idle_Armed");s&&s!==this.currentAction&&(this.currentAction&&this.currentAction.fadeOut(t),s.reset().setEffectiveWeight(1).fadeIn(t).play(),this.currentAction=s),this.currentState=e;return}this.currentAction&&this.currentAction!==i&&this.currentAction.fadeOut(t),i.reset().setEffectiveWeight(1).fadeIn(t).play(),this.currentAction=i,this.currentState=e}update(e){this.mixer&&this.mixer.update(e),this.isProcedural&&this.characterGroup&&this.updateProceduralAnimation(e)}updateProceduralAnimation(e){var a,o,l,c;this.proceduralTime+=e*8;const t=(a=this.characterGroup)==null?void 0:a.getObjectByName("leg_L"),n=(o=this.characterGroup)==null?void 0:o.getObjectByName("leg_R"),i=(l=this.characterGroup)==null?void 0:l.getObjectByName("magic_wand"),s=(c=this.characterGroup)==null?void 0:c.getObjectByName("body");switch(this.currentState){case"Idle":s&&(s.position.y=Math.sin(this.proceduralTime*.4)*.03),t&&(t.rotation.x=0),n&&(n.rotation.x=0),i&&(i.rotation.z=Math.sin(this.proceduralTime*.5)*.05);break;case"Walk":t&&(t.rotation.x=Math.sin(this.proceduralTime)*.4),n&&(n.rotation.x=-Math.sin(this.proceduralTime)*.4),s&&(s.position.y=Math.abs(Math.sin(this.proceduralTime*2))*.05);break;case"Run":t&&(t.rotation.x=Math.sin(this.proceduralTime*1.5)*.7),n&&(n.rotation.x=-Math.sin(this.proceduralTime*1.5)*.7),s&&(s.position.y=Math.abs(Math.sin(this.proceduralTime*3))*.08);break;case"Jump":case"Fall":t&&(t.rotation.x=-.3),n&&(n.rotation.x=.3);break;case"CastSpell":i&&(i.rotation.x=-Math.PI*.4,i.rotation.z=Math.sin(this.proceduralTime*2)*.2);break}}getCurrentState(){return this.currentState}}class Xv{constructor(){C(this,"wandMesh");C(this,"tipLight");C(this,"particles");C(this,"particleGeo");C(this,"particlePositions");C(this,"particleColors");C(this,"particleCount",40);C(this,"currentHouseColor");this.wandMesh=new lt,this.wandMesh.visible=!1,this.currentHouseColor=new Me(4060159),this.tipLight=new sn(4060159,1.8,4),this.tipLight.position.set(0,0,0),this.wandMesh.add(this.tipLight),this.particlePositions=new Float32Array(this.particleCount*3),this.particleColors=new Float32Array(this.particleCount*3);for(let t=0;t<this.particleCount;t++)this.particlePositions[t*3]=(Math.random()-.5)*.1,this.particlePositions[t*3+1]=(Math.random()-.5)*.1,this.particlePositions[t*3+2]=(Math.random()-.5)*.1,this.particleColors[t*3]=.2,this.particleColors[t*3+1]=.8,this.particleColors[t*3+2]=1;this.particleGeo=new mt,this.particleGeo.setAttribute("position",new ot(this.particlePositions,3)),this.particleGeo.setAttribute("color",new ot(this.particleColors,3));const e=new yi({size:.06,vertexColors:!0,transparent:!0,opacity:.85,blending:Vs,depthWrite:!1});this.particles=new Fi(this.particleGeo,e),this.wandMesh.add(this.particles)}setHouseColor(e){this.currentHouseColor.setHex(e),this.tipLight.color.setHex(e)}getTipWorldPosition(){const e=new b;return this.tipLight.getWorldPosition(e),e}update(e){const t=new b(0,0,.6);for(let n=this.particleCount-1;n>0;n--)this.particlePositions[n*3]=this.particlePositions[(n-1)*3]+(Math.random()-.5)*.01,this.particlePositions[n*3+1]=this.particlePositions[(n-1)*3+1]+(Math.random()-.5)*.01,this.particlePositions[n*3+2]=this.particlePositions[(n-1)*3+2]-.02,this.particleColors[n*3]=this.currentHouseColor.r,this.particleColors[n*3+1]=this.currentHouseColor.g,this.particleColors[n*3+2]=this.currentHouseColor.b;this.particlePositions[0]=t.x,this.particlePositions[1]=t.y,this.particlePositions[2]=t.z,this.particleGeo.attributes.position.needsUpdate=!0,this.particleGeo.attributes.color.needsUpdate=!0}}class Fu{static findHandNode(e){let t=null;if(e.mesh.traverse(i=>{if(t)return;const s=i.name.toLowerCase();(s.includes("righthand")||s.includes("hand_r")||s.includes("hand.r")||s.includes("wrist_r")||s.includes("mixamorigrighthand")||s.includes("handr"))&&(t=i)}),t)return t;let n=e.mesh.getObjectByName("item_hand_socket");return n||(n=new lt,n.name="item_hand_socket",n.position.set(.3,1.25,.35),e.mesh.add(n)),n}static playEpicPickup(e,t,n,i){e.isControlsLocked=!0,e.isMovementLocked=!0,e.velocity.set(0,0,0);const s=this.findHandNode(e),a=new lt;if(a.name="epic_held_item",n==="key"){const m=new ii(.12,.035,12,24),S=new yt(.025,.025,.4,12),M=new ke(.08,.03,.08),v=new ke(.06,.03,.06),E=new Xe({color:16766720,metalness:.9,roughness:.2,emissive:11167232,emissiveIntensity:.6}),T=new ee(m,E);T.position.y=.2;const w=new ee(S,E);w.position.y=-.05;const x=new ee(M,E);x.position.set(.04,-.18,0);const R=new ee(v,E);R.position.set(.03,-.23,0),a.add(T,w,x,R),a.scale.setScalar(1.2)}else if(n==="staff"){const m=new yt(.03,.035,1.4,12),S=new Zt(.12,16,16),M=new Xe({color:6044193,roughness:.7}),v=new Xe({color:58879,emissive:49151,emissiveIntensity:1.5,roughness:.1}),E=new ee(m,M),T=new ee(S,v);T.position.y=.7,a.add(E,T)}s.add(a);const o=n==="staff"?58879:16755200,l=new sn(o,4.5,6);l.position.set(0,.2,.2),a.add(l);const c=18,h=[],u=[],d=new ir(.04,0),f=[16766720,16755200,16777215,16769126];for(let m=0;m<c;m++){const S=new Mt({color:f[m%f.length],transparent:!0,opacity:.9}),M=new ee(d,S),v=m/c*Math.PI*2,E=.4+Math.random()*.4;M.position.set(Math.cos(v)*E,(Math.random()-.5)*.8,Math.sin(v)*E),a.add(M),h.push(M),u.push(new b((Math.random()-.5)*.8,.5+Math.random()*.8,(Math.random()-.5)*.8))}e.animationController.playTakeItemAnimation(()=>{});let p=0;const _=2,g=()=>{p+=.016;const m=Math.min(1,p/_);a.rotation.y+=.05,l.intensity=(3.5+Math.sin(p*10)*1.5)*(1-Math.max(0,(m-.7)/.3)),h.forEach((S,M)=>{S.position.addScaledVector(u[M],.016),S.rotation.x+=.1,S.rotation.y+=.1,S.material.opacity=Math.max(0,1-m*1.2)}),p<_?requestAnimationFrame(g):(s.remove(a),a.traverse(S=>{if(S.isMesh){S.geometry.dispose();const M=S.material;Array.isArray(M)?M.forEach(v=>v.dispose()):M.dispose()}}),e.isControlsLocked=!1,e.isMovementLocked=!1,i())};requestAnimationFrame(g)}}class qv{constructor(e,t){C(this,"mesh");C(this,"animationController");C(this,"wandEffect");C(this,"velocity",new b);C(this,"isGrounded",!0);C(this,"moveSpeed",4.5);C(this,"runSpeed",7.5);C(this,"jumpForce",8);C(this,"gravity",-20);C(this,"health",100);C(this,"maxHealth",100);C(this,"mana",100);C(this,"maxMana",100);C(this,"manaRegenRate",12);C(this,"isControlsLocked",!1);C(this,"isMovementLocked",!1);C(this,"groundRaycaster",new er);C(this,"colliders",[]);C(this,"onHealthChange");C(this,"onManaChange");C(this,"hasStaff",!1);C(this,"jumpCount",0);C(this,"doubleJumpSpinTimer",0);C(this,"isAttacking",!1);C(this,"visualModel");C(this,"defaultVisualRotationX",0);C(this,"wallRaycaster",new er);C(this,"PLAYER_RADIUS",.4);C(this,"isRespawning",!1);this.mesh=e,this.visualModel=this.mesh.children.find(n=>n.type==="Group")||this.mesh.children[0]||this.mesh,this.defaultVisualRotationX=this.visualModel.rotation.x,this.animationController=t,this.mesh.position.set(0,0,0),this.wandEffect=new Xv,this.setStaffVisibility(!1)}setStaffVisibility(e){const t=this.mesh.getObjectByName("Vaculo");t&&(t.visible=e);const n=this.mesh.getObjectByName("magic_wand");if(n&&(n.visible=e),e){const i=t||n;i?(this.wandEffect.wandMesh.position.set(0,.8,0),this.wandEffect.wandMesh.rotation.set(0,0,0),i.add(this.wandEffect.wandMesh)):(this.wandEffect.wandMesh.position.set(.35,1.6,.2),this.mesh.add(this.wandEffect.wandMesh)),this.wandEffect.wandMesh.visible=!0}else this.wandEffect.wandMesh.visible=!1,this.wandEffect.wandMesh.parent&&this.wandEffect.wandMesh.parent.remove(this.wandEffect.wandMesh)}equipStaff(e){this.hasStaff||(console.log("[PlayerController] Playing epic staff pickup animation..."),e?Fu.playEpicPickup(this,e,"staff",()=>{this.hasStaff=!0,this.setStaffVisibility(!0),console.log("[PlayerController] Staff equipped! Spells unlocked and Armed animations active.")}):(this.isControlsLocked=!0,this.velocity.set(0,0,0),this.animationController.playTakeItemAnimation(()=>{this.hasStaff=!0,this.setStaffVisibility(!0),this.isControlsLocked=!1,console.log("[PlayerController] Staff equipped! Spells unlocked and Armed animations active.")})))}useMana(e){var t;return this.mana>=e?(this.mana=Math.max(0,this.mana-e),(t=this.onManaChange)==null||t.call(this,this.mana,this.maxMana),!0):!1}restoreMana(e){var t;this.mana=Math.min(this.maxMana,this.mana+e),(t=this.onManaChange)==null||t.call(this,this.mana,this.maxMana)}heal(e){var t;this.health=Math.min(this.maxHealth,this.health+e),(t=this.onHealthChange)==null||t.call(this,this.health,this.maxHealth)}takeDamage(e,t){var n,i,s;this.health=Math.max(0,this.health-e),(n=this.onHealthChange)==null||n.call(this,this.health,this.maxHealth),this.health<=0&&(this.health=this.maxHealth,this.mana=this.maxMana,(i=this.onHealthChange)==null||i.call(this,this.health,this.maxHealth),(s=this.onManaChange)==null||s.call(this,this.mana,this.maxMana),t&&this.mesh.position.copy(t))}setColliders(e){this.colliders=e}forceIdle(){this.animationController.isPlayingOneShot=!1,this.animationController.playState("Idle",.1),this.velocity.set(0,0,0)}update(e,t,n){var m,S,M,v,E;if(this.isControlsLocked){this.animationController.update(e);return}const i=new b().copy(this.mesh.position).add(new b(0,.4,0));this.groundRaycaster.set(i,new b(0,-1,0));const s=this.groundRaycaster.intersectObjects(this.colliders,!0),a=this.velocity.y;if(this.isGrounded=s.length>0&&s[0].distance<=.8,this.isGrounded&&this.velocity.y<=0){this.velocity.y=0,this.mesh.position.y=s[0].point.y;const T=a<-15;this.jumpCount=0,this.doubleJumpSpinTimer=0,this.visualModel.rotation.x=this.defaultVisualRotationX,T&&this.triggerHardLanding()}else this.isMovementLocked||(this.velocity.y+=this.gravity*e);if(t.onJumpPress||(t.onJumpPress=()=>{this.isControlsLocked||this.isMovementLocked||(this.isGrounded?(this.velocity.y=this.jumpForce,this.isGrounded=!1,this.jumpCount=1,this.animationController.playState("Jump")):this.jumpCount===1&&(this.velocity.y=this.jumpForce*.95,this.jumpCount=2,this.doubleJumpSpinTimer=.4,this.hasStaff?this.animationController.playState("Jump"):this.animationController.playState("Wukong_NoWood_DoubleJump")))}),this.doubleJumpSpinTimer>0){this.doubleJumpSpinTimer-=e;const T=1-this.doubleJumpSpinTimer/.4;this.visualModel.rotation.x=this.defaultVisualRotationX+T*Math.PI*2,this.doubleJumpSpinTimer<=0&&(this.visualModel.rotation.x=this.defaultVisualRotationX)}const o=n.getForwardVector(),l=n.getRightVector();let c=0,h=0;this.isMovementLocked||(Math.hypot(t.touchAnalogX,t.touchAnalogZ)>.05?(c=t.touchAnalogX,h=t.touchAnalogZ):(t.moveForward&&(h+=1),t.moveBackward&&(h-=1),t.moveLeft&&(c-=1),t.moveRight&&(c+=1)));const u=new b().addScaledVector(o,h).addScaledVector(l,c).normalize(),d=u.lengthSq()>.01,f=t.isRunning?this.runSpeed:this.moveSpeed;if(d){this.velocity.x=u.x*f,this.velocity.z=u.z*f;const T=Math.atan2(u.x,u.z),w=this.mesh.rotation.y;let x=T-w;for(;x<-Math.PI;)x+=Math.PI*2;for(;x>Math.PI;)x-=Math.PI*2;this.mesh.rotation.y+=x*Math.min(1,e*15)}else this.velocity.x*=.8,this.velocity.z*=.8;const p=new b(this.velocity.x,0,this.velocity.z),_=p.length();if(_>.1&&this.colliders.length>0){const T=_*e,w=p.clone().normalize(),x=this.mesh.position.clone().add(new b(0,.5,0));this.wallRaycaster.set(x,w),this.wallRaycaster.far=this.PLAYER_RADIUS+T;const R=this.wallRaycaster.intersectObjects(this.colliders,!0);if(R.length>0&&R[0].distance<this.PLAYER_RADIUS+T){const I=((S=(m=R[0].face)==null?void 0:m.normal)==null?void 0:S.clone())||new b(0,0,1);if(I.transformDirection(R[0].object.matrixWorld),Math.abs(I.y)<.4){I.y=0,I.normalize();const L=this.velocity.x*I.x+this.velocity.z*I.z;L<0&&(this.velocity.x-=L*I.x,this.velocity.z-=L*I.z)}}}if(this.mesh.position.x+=this.velocity.x*e,this.mesh.position.y+=this.velocity.y*e,this.mesh.position.z+=this.velocity.z*e,this.isGrounded&&this.velocity.y===0&&this.colliders.length>0){const T=this.mesh.position.clone().add(new b(0,1,0));this.groundRaycaster.set(T,new b(0,-1,0));const w=this.groundRaycaster.intersectObjects(this.colliders,!0);w.length>0&&w[0].distance<=1.8&&(this.mesh.position.y=w[0].point.y)}if(this.colliders.length>0&&!this.isGrounded){const T=[.5,1],w=[new b(1,0,0),new b(-1,0,0),new b(0,0,1),new b(0,0,-1),new b(.707,0,.707),new b(-.707,0,.707),new b(.707,0,-.707),new b(-.707,0,-.707)];for(const x of T){const R=this.mesh.position.clone().add(new b(0,x,0));for(const I of w){this.wallRaycaster.set(R,I),this.wallRaycaster.far=this.PLAYER_RADIUS;const L=this.wallRaycaster.intersectObjects(this.colliders,!0);if(L.length>0&&L[0].distance<this.PLAYER_RADIUS){const D=((v=(M=L[0].face)==null?void 0:M.normal)==null?void 0:v.clone())||I.clone().negate();if(D.transformDirection(L[0].object.matrixWorld),Math.abs(D.y)<.35){const H=this.PLAYER_RADIUS-L[0].distance;D.y=0;const Y=D.length();if(Y>1e-4){D.divideScalar(Y),this.mesh.position.addScaledVector(D,H);const O=this.velocity.x*D.x+this.velocity.z*D.z;O<0&&(this.velocity.x-=O*D.x,this.velocity.z-=O*D.z)}}}}}}const g=this.animationController.getCurrentState()==="Wukong_NoWood_HardLanding"?-.18:0;this.visualModel.position.y=ft.lerp(this.visualModel.position.y,g,e*12),this.isGrounded&&!this.isAttacking&&(d?this.animationController.playState("Run"):this.animationController.playState("Idle")),this.mana<this.maxMana&&(this.mana=Math.min(this.maxMana,this.mana+this.manaRegenRate*e),(E=this.onManaChange)==null||E.call(this,this.mana,this.maxMana)),this.wandEffect.update(e),this.animationController.update(e),this.mesh.position.y<-10&&!this.isMovementLocked&&this.respawnFromAbyss()}respawnFromAbyss(){var t;if(this.isRespawning)return;this.isRespawning=!0,this.isMovementLocked=!0,this.takeDamage(20);const e=(t=window.gameInstance)==null?void 0:t.hud;e==null||e.fadeScreenOut(500).then(()=>{this.mesh.position.set(0,0,0),this.velocity.set(0,0,0),setTimeout(()=>{e==null||e.fadeScreenIn(500).then(()=>{this.isMovementLocked=!1,this.isRespawning=!1})},500)})}attachStaffToHand(){const e=this.mesh.getObjectByName("Vaculo")||this.mesh.getObjectByName("magic_wand"),t=this.mesh.getObjectByName("atack_wood_staff");e&&(e.visible=!1),t&&(t.visible=!0,this.wandEffect&&this.wandEffect.wandMesh&&(this.wandEffect.wandMesh.position.set(0,.8,0),t.add(this.wandEffect.wandMesh)))}attachStaffToBack(){const e=this.mesh.getObjectByName("Vaculo")||this.mesh.getObjectByName("magic_wand"),t=this.mesh.getObjectByName("atack_wood_staff");e&&(e.visible=!0,this.wandEffect&&this.wandEffect.wandMesh&&(this.wandEffect.wandMesh.position.set(0,.8,0),e.add(this.wandEffect.wandMesh))),t&&(t.visible=!1)}getSpellLaunchPosition(){if(this.wandEffect&&this.wandEffect.wandMesh.visible){const n=new b;return this.wandEffect.wandMesh.getWorldPosition(n),n}let e=null;if(this.mesh.traverse(n=>{const i=n.name.toLowerCase();i.includes("righthand")&&!i.includes("thumb")&&!i.includes("index")&&!i.includes("middle")&&!i.includes("ring")&&!i.includes("pinky")&&(e=n)}),e){const n=new b;e.getWorldPosition(n);const i=new b(0,0,1).applyQuaternion(this.mesh.quaternion);return n.add(new b(0,.3,0)).addScaledVector(i,.5)}const t=new b().copy(this.mesh.position);return t.y+=1.4,t.addScaledVector(new b(0,0,1).applyAxisAngle(new b(0,1,0),this.mesh.rotation.y),.6)}triggerHardLanding(){if(this.isControlsLocked||this.isMovementLocked)return;this.isControlsLocked=!0,this.isMovementLocked=!0,this.velocity.set(0,0,0);const e=this.maxHealth*.2;this.takeDamage(e),console.log("[PlayerController] Triggered dangerous fall: playing Wukong_NoWood_HardLanding..."),this.animationController.playHardLanding(()=>{this.isControlsLocked=!1,this.isMovementLocked=!1})}}class Kv{constructor(e){C(this,"camera");C(this,"isCinematicActive",!1);C(this,"startPos",new b);C(this,"targetPos",new b);C(this,"startLookAt",new b);C(this,"targetLookAt",new b);C(this,"duration",1);C(this,"elapsedTime",0);C(this,"onCompleteCallback",null);this.camera=e}moveCamera(e,t,n,i,s){if(this.isCinematicActive&&this.onCompleteCallback){const a=this.onCompleteCallback;this.onCompleteCallback=null,a()}return new Promise(a=>{this.isCinematicActive=!0,this.startPos.copy(e),this.targetPos.copy(t),this.startLookAt.copy(n),this.targetLookAt.copy(i),this.duration=Math.max(.1,s),this.elapsedTime=0,this.onCompleteCallback=a})}update(e){if(!this.isCinematicActive)return;this.elapsedTime+=e;const t=Math.min(1,this.elapsedTime/this.duration),n=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,i=new b().lerpVectors(this.startPos,this.targetPos,n),s=new b().lerpVectors(this.startLookAt,this.targetLookAt,n);if(this.camera.position.copy(i),this.camera.lookAt(s),t>=1&&(this.isCinematicActive=!1,this.onCompleteCallback)){const a=this.onCompleteCallback;this.onCompleteCallback=null,a()}}abort(){if(this.isCinematicActive=!1,this.onCompleteCallback){const e=this.onCompleteCallback;this.onCompleteCallback=null,e()}}isActive(){return this.isCinematicActive}stop(){this.isCinematicActive=!1,this.onCompleteCallback=null}}class Yv{constructor(){C(this,"boxEl");C(this,"speakerEl");C(this,"textEl");C(this,"queue",[]);C(this,"isProcessing",!1);C(this,"timeoutId",null);this.boxEl=document.getElementById("subtitle-box"),this.speakerEl=document.getElementById("subtitle-speaker"),this.textEl=document.getElementById("subtitle-text")}show(e,t,n=4500){this.queue.push({speaker:e,text:t,durationMs:n}),this.processQueue()}processQueue(){if(this.isProcessing)return;if(this.queue.length===0){this.hide();return}this.isProcessing=!0;const e=this.queue.shift();this.speakerEl.textContent=e.speaker,this.textEl.textContent=e.text,this.boxEl.classList.remove("hidden"),this.timeoutId&&clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.isProcessing=!1,this.processQueue()},e.durationMs)}hide(){this.boxEl.classList.add("hidden"),this.isProcessing=!1,this.queue=[],this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null)}}class $v{constructor(e,t,n=0,i=!1){C(this,"mesh");C(this,"isOpen",!1);C(this,"isLocked",!1);C(this,"id");C(this,"leftWing");C(this,"rightWing");C(this,"targetOpenAmount",0);C(this,"currentOpenAmount",0);this.id=e,this.isLocked=i,this.mesh=new lt,this.mesh.position.copy(t),this.mesh.rotation.y=n;const s=new ke(3.2,4.2,.4),a=new Xe({color:3814981,roughness:.8}),o=new ee(s,a);o.position.y=2.1,o.castShadow=!0,this.mesh.add(o);const l=new ke(1.4,3.8,.2),c=new Xe({color:6044193,roughness:.7});this.leftWing=new ee(l,c),this.leftWing.position.set(-.7,2,0),this.leftWing.castShadow=!0,this.rightWing=new ee(l,c),this.rightWing.position.set(.7,2,0),this.rightWing.castShadow=!0;const h=new ii(.12,.02,8,12),u=new Xe({color:15976004,metalness:.8}),d=new ee(h,u);d.position.set(.5,0,.12),this.leftWing.add(d);const f=new ee(h,u);f.position.set(-.5,0,.12),this.rightWing.add(f),this.mesh.add(this.leftWing,this.rightWing)}open(e){this.isOpen||(this.isOpen=!0,this.targetOpenAmount=1,e&&e.playDoorOpen())}close(){this.isOpen=!1,this.targetOpenAmount=0}update(e){if(Math.abs(this.currentOpenAmount-this.targetOpenAmount)>.001){this.currentOpenAmount=ft.lerp(this.currentOpenAmount,this.targetOpenAmount,e*3);const t=Math.PI*.45*this.currentOpenAmount;this.leftWing.rotation.y=-t,this.rightWing.rotation.y=t}}}class Zv{constructor(e,t,n,i,s){C(this,"cinematicCamera");C(this,"cameraController");C(this,"playerController");C(this,"subtitleSystem");C(this,"audioManager");C(this,"isPlayingSequence",!1);C(this,"skipRequested",!1);this.cinematicCamera=e,this.cameraController=t,this.playerController=n,this.subtitleSystem=i,this.audioManager=s}async play(e){this.isPlayingSequence=!0,this.skipRequested=!1,this.playerController.isControlsLocked=!0;for(const t of e){if(this.skipRequested){console.log("[CinematicManager] Sequence skipped by user.");break}await t(this)}this.isPlayingSequence=!1,this.playerController.isControlsLocked=!1,this.subtitleSystem.hide(),this.cinematicCamera.stop()}requestSkip(){this.isPlayingSequence&&(this.skipRequested=!0,this.subtitleSystem.hide())}}class Jv{constructor(e,t,n="FLIPENDO",i=35){C(this,"mesh");C(this,"velocity");C(this,"isDead",!1);C(this,"spellType");C(this,"lifetime",4);C(this,"age",0);C(this,"light");C(this,"particles");C(this,"particlePositions");this.spellType=n,this.mesh=new lt,this.mesh.position.copy(e);let s=4060159,a=8975871,o=.14;n==="ALOHOMORA"?(s=16766720,a=16771720,o=.16):n==="LUMOS"&&(s=16777164,a=16777215,o=.2),this.velocity=t.clone().multiplyScalar(i);const l=new Zt(o,12,12),c=new Mt({color:s}),h=new ee(l,c);this.mesh.add(h),this.light=new sn(s,3.5,7),this.mesh.add(this.light);const u=25,d=new mt;this.particlePositions=new Float32Array(u*3);for(let p=0;p<u;p++)this.particlePositions[p*3]=(Math.random()-.5)*.12,this.particlePositions[p*3+1]=(Math.random()-.5)*.12,this.particlePositions[p*3+2]=(Math.random()-.5)*.12;d.setAttribute("position",new ot(this.particlePositions,3));const f=new yi({color:a,size:.1,transparent:!0,opacity:.85});this.particles=new Fi(d,f),this.mesh.add(this.particles)}update(e){if(this.age+=e,this.age>=this.lifetime){this.isDead=!0;return}this.mesh.position.addScaledVector(this.velocity,e);const t=this.particles.geometry.attributes.position.array;for(let n=0;n<t.length/3;n++)t[n*3+2]-=e*2;this.particles.geometry.attributes.position.needsUpdate=!0}}class ns{constructor(e,t,n=[]){C(this,"mesh");C(this,"state","IDLE");C(this,"health",3);C(this,"maxHealth",3);C(this,"id");C(this,"isDead",!1);C(this,"isPaused",!1);C(this,"arenaCenter",null);C(this,"arenaRadius",15);C(this,"patrolWaypoints",[]);C(this,"currentWaypointIndex",0);C(this,"moveSpeed",2);C(this,"chaseSpeed",3.5);C(this,"detectionRadius",10);C(this,"attackRadius",1.8);C(this,"stunTimer",0);C(this,"hitFlashTimer",0);C(this,"knockbackVelocity",new b);C(this,"crabModel",null);C(this,"proceduralTime",0);C(this,"attackCooldown",0);C(this,"dyingTimer",0);C(this,"dyingDuration",.65);C(this,"deathVfxSpawned",!1);C(this,"dyingScaleStart",1);C(this,"scene",null);C(this,"bossChargeTimer",0);C(this,"bossLungeTimer",0);C(this,"bossLungeDir",new b);C(this,"onAttackPlayer");C(this,"onDeath");C(this,"legs",[]);C(this,"groundRaycaster",new er);this.id=e,this.mesh=new lt,this.mesh.position.copy(t),this.patrolWaypoints=n.length>0?n:[t.clone()],this.createProceduralCrab()}setScene(e){this.scene=e}async loadModel(e=1){try{const i=(await new or().loadAsync("/magic-academy-3d/assets/enemies/crab.glb")).scene,s=new tn().setFromObject(i),a=new b;s.getSize(a);const o=.8/Math.max(a.x,a.y,a.z)*e;for(i.scale.setScalar(o),i.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)});this.mesh.children.length>0;)this.mesh.remove(this.mesh.children[0]);this.crabModel=i,this.mesh.add(i),this.legs=[],i.traverse(l=>{const c=l.name.toLowerCase();(c.includes("leg")||c.includes("arm")||c.includes("claw")||c.includes("limb"))&&this.legs.push(l)}),console.log(`[EnemyController] Loaded crab.glb for '${this.id}' (${this.legs.length} leg nodes)`)}catch(t){console.warn(`[EnemyController] Could not load crab.glb for '${this.id}', using procedural`,t)}}createProceduralCrab(){const e=new Xe({color:9118976,roughness:.6,metalness:.3}),t=new Xe({color:7019776,roughness:.7}),n=new Mt({color:16724787}),i=new ee(new Zt(.4,10,8),e);i.scale.set(1.2,.6,1),i.position.y=.25,i.castShadow=!0,i.name="crab_body",this.mesh.add(i);const s=new ee(new Zt(.06,6,6),n);s.position.set(-.15,.5,.3);const a=new ee(new Zt(.06,6,6),n);a.position.set(.15,.5,.3),this.mesh.add(s,a),this.legs=[];for(let h=0;h<6;h++){const u=h<3?-1:1,d=h%3,f=new ee(new yt(.03,.02,.5,6),t);f.position.set(u*(.35+d*.1),.1,-.15+d*.15),f.rotation.z=u*.6,f.name=`leg_${h}`,this.mesh.add(f),this.legs.push(f)}const o=new ke(.15,.06,.2),l=new ee(o,e);l.position.set(-.55,.25,.3),l.name="claw_L";const c=new ee(o,e);c.position.set(.55,.25,.3),c.name="claw_R",this.mesh.add(l,c),this.legs.push(l,c)}safeNormalize(e,t=new b(0,0,1)){const n=e.lengthSq();return n>1e-6?e.divideScalar(Math.sqrt(n)):e.copy(t),e}takeHit(e){if(!(this.state==="DYING"||this.state==="DEAD")){if(this.id==="crab_boss"){if(this.state!=="STUNNED"){console.log("[Boss] Immune while active!");return}this.health=Math.max(0,this.health-1),this.hitFlashTimer=.25,console.log(`[Boss] Hit! HP: ${this.health}`),this.health<=0?this.triggerDeath():this.stunTimer=.1;return}if(this.health=Math.max(0,this.health-1),this.hitFlashTimer=.25,console.log(`[Enemy ${this.id}] Hit! HP: ${this.health}/${this.maxHealth}`),this.health<=0){this.triggerDeath();return}if(e){const t=new b().subVectors(this.mesh.position,e);t.y=0,this.safeNormalize(t),this.knockbackVelocity.copy(t).multiplyScalar(6.5)}else{const t=new b(0,0,1).applyAxisAngle(new b(0,1,0),this.mesh.rotation.y);this.knockbackVelocity.copy(t).multiplyScalar(-3)}this.state="FLIPPED",this.stunTimer=2.5,console.log(`[Enemy ${this.id}] FLIPPED!`)}}triggerDeath(){if(this.state==="DYING"||this.state==="DEAD")return;this.state="DYING",this.isDead=!0,this.hitFlashTimer=0,this.dyingTimer=this.dyingDuration,this.dyingScaleStart=this.mesh.scale.x,this.deathVfxSpawned=!1,this.knockbackVelocity.set(0,0,0),this.onAttackPlayer=void 0;const e=this.onDeath;this.onDeath=void 0,console.log(`[Enemy ${this.id}] DYING — triggering death sequence`),this.mesh.position.y+=.05,e==null||e(this)}spawnDeathVFX(){if(!this.scene)return;const e=this.mesh.position.clone().add(new b(0,.35,0)),t=new Zt(.15,8,8),n=new Mt({color:16768324,transparent:!0,opacity:1,depthWrite:!1}),i=new ee(t,n);i.position.copy(e),this.scene.add(i);const s=new ya(.05,.18,16),a=new Mt({color:16746496,transparent:!0,opacity:.9,side:en,depthWrite:!1}),o=new ee(s,a);o.position.copy(e),o.rotation.x=-Math.PI/2,this.scene.add(o);const l=22,c=[],h=[],u=[],d=[16737792,16763904,16724736,16755200,16777215];for(let v=0;v<l;v++){const E=v/l*Math.PI*2,T=(Math.random()-.3)*Math.PI,w=2.5+Math.random()*4,x=new b(Math.cos(E)*Math.cos(T),Math.abs(Math.sin(T))+.4,Math.sin(E)*Math.cos(T)).multiplyScalar(w),R=.04+Math.random()*.09,I=new ir(R,0),L=new Mt({color:d[Math.floor(Math.random()*d.length)],transparent:!0,opacity:1,depthWrite:!1}),D=new ee(I,L);D.position.copy(e),D.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0),this.scene.add(D),u.push(D),c.push(e.clone()),h.push(x)}const f=3,p=[],_=[];for(let v=0;v<f;v++){const E=new Zt(.18,6,6),T=new Mt({color:13421738,transparent:!0,opacity:.55,depthWrite:!1}),w=new ee(E,T);w.position.copy(e).addScaledVector(new b(Math.random()-.5,Math.random()*.5,Math.random()-.5).normalize(),.15),this.scene.add(w),p.push(w),_.push(new b((Math.random()-.5)*1.2,.8+Math.random()*.6,(Math.random()-.5)*1.2))}let g=0;const m=.65,S=-6,M=()=>{g+=.016;const v=g/m,E=Math.min(1,v);i.scale.setScalar(1+E*7),n.opacity=Math.max(0,1-E*2.5);const T=1+E*12;o.scale.setScalar(T),a.opacity=Math.max(0,.9-E*1.8);for(let w=0;w<u.length;w++){const x=h[w];x.y+=S*.016,u[w].position.addScaledVector(x,.016),u[w].rotation.x+=.1,u[w].rotation.z+=.08;const R=Math.max(0,1-Math.max(0,(v-.35)/.65));u[w].material.opacity=R}for(let w=0;w<p.length;w++){p[w].position.addScaledVector(_[w],.016),p[w].scale.addScalar(.016*2.5);const x=Math.max(0,.55-E*.9);p[w].material.opacity=x}g<m+.1?requestAnimationFrame(M):(this.scene&&(this.scene.remove(i),this.scene.remove(o),u.forEach(w=>this.scene.remove(w)),p.forEach(w=>this.scene.remove(w))),n.dispose(),a.dispose(),u.forEach(w=>w.material.dispose()),p.forEach(w=>w.material.dispose()),t.dispose(),s.dispose(),u.forEach(w=>w.geometry.dispose()),p.forEach(w=>w.geometry.dispose()))};requestAnimationFrame(M)}update(e,t,n){var s,a;if(this.isPaused||this.state==="DEAD")return;if(this.proceduralTime+=e*6,this.state==="DYING"){if(this.deathVfxSpawned||(this.deathVfxSpawned=!0,this.spawnDeathVFX(),console.log("[BOSS] Entering DYING — defeat sequence started")),this.dyingTimer-=e,this.id==="crab_boss"){this.mesh.rotation.z=ft.lerp(this.mesh.rotation.z,Math.PI,e*5),this.mesh.visible=!0,this.dyingTimer<=0&&(this.state="DEAD",this.isDead=!0,console.log("[BOSS] Death sequence completed — lying defeated on floor"));return}const o=Math.max(0,this.dyingTimer/this.dyingDuration),l=Math.min(1,(1-o)*3),c=1-l*.6,h=1+l*.3,u=Math.max(.001,o);this.mesh.scale.set(this.dyingScaleStart*h*u,this.dyingScaleStart*c*u,this.dyingScaleStart*h*u),this.mesh.rotation.y+=e*8,this.mesh.rotation.z+=e*5,this.dyingTimer<=0&&(this.mesh.visible=!1,this.state="DEAD",this.isDead=!0);return}if(this.hitFlashTimer>0?(this.hitFlashTimer-=e,this.mesh.traverse(o=>{if(o.isMesh&&o.material){const l=o.material;l.emissive&&l.emissive.setHex(16720384)}})):this.mesh.traverse(o=>{if(o.isMesh&&o.material){const l=o.material;l.emissive&&l.emissive.setHex(0)}}),n&&n.length>0){const o=new b().copy(this.mesh.position);o.y=Math.max(this.mesh.position.y+3,6),this.groundRaycaster.set(o,new b(0,-1,0));const l=this.groundRaycaster.intersectObjects(n,!0);if(l.length>0){let c=l[0].point.y;this.state==="FLIPPED"&&(c+=.5),this.mesh.position.y=ft.lerp(this.mesh.position.y,c,e*10)}}if(this.state!=="FLIPPED"&&(this.mesh.rotation.z=ft.lerp(this.mesh.rotation.z,0,e*8)),this.arenaCenter){const o=t.distanceTo(this.arenaCenter),l=this.mesh.position.distanceTo(this.arenaCenter);if(o>this.arenaRadius||l>this.arenaRadius+1){const c=this.patrolWaypoints[0];if(this.mesh.position.distanceTo(c)>.5){this.state="IDLE";const u=new b().subVectors(c,this.mesh.position);u.y=0,this.safeNormalize(u),this.mesh.position.addScaledVector(u,this.moveSpeed*e),this.mesh.rotation.y=Math.atan2(u.x,u.z)}else this.state="IDLE",this.mesh.rotation.y=0;this.animateLegs(e);return}}const i=this.mesh.position.distanceTo(t);switch(this.state){case"FLIPPED":this.stunTimer-=e,this.knockbackVelocity.lengthSq()>.01&&(this.mesh.position.addScaledVector(this.knockbackVelocity,e),this.knockbackVelocity.multiplyScalar(Math.exp(-4*e))),this.mesh.rotation.z=ft.lerp(this.mesh.rotation.z,Math.PI,e*8),this.proceduralTime+=e*15;for(let o=0;o<this.legs.length;o++){const l=o*.8;this.legs[o].rotation.x=Math.sin(this.proceduralTime+l)*.45,this.legs[o].rotation.z=Math.cos(this.proceduralTime+l)*.45}if(this.stunTimer<=0){this.state="CHASE";for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=0,this.legs[o].rotation.z=0}break;case"STUNNED":this.stunTimer-=e,this.mesh.rotation.z=Math.sin(this.proceduralTime*4)*.25;for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=Math.sin(this.proceduralTime+o)*.5;if(this.stunTimer<=0){this.state="CHASE",this.mesh.rotation.z=0;for(let o=0;o<this.legs.length;o++)this.legs[o].rotation.x=0}break;case"IDLE":case"PATROL":i<=this.detectionRadius?this.state="CHASE":this.patrolBehavior(e);break;case"CHASE":i<=(this.id==="crab_boss"?5:this.attackRadius)?this.state="ATTACK":i>this.detectionRadius*2?this.state="PATROL":this.chaseBehavior(e,t);break;case"ATTACK":this.id==="crab_boss"?this.bossChargeTimer>0?(this.bossChargeTimer-=e,this.mesh.rotation.y+=Math.sin(performance.now()*.05)*.1,this.hitFlashTimer=.05,this.bossChargeTimer<=0&&(this.bossLungeTimer=.6,this.bossLungeDir.subVectors(t,this.mesh.position),this.bossLungeDir.y=0,this.safeNormalize(this.bossLungeDir),this.mesh.rotation.y=Math.atan2(this.bossLungeDir.x,this.bossLungeDir.z))):this.bossLungeTimer>0?(this.bossLungeTimer-=e,this.mesh.position.addScaledVector(this.bossLungeDir,14*e),i<3.2&&((s=this.onAttackPlayer)==null||s.call(this,25),this.bossLungeTimer=0),this.bossLungeTimer<=0&&(this.state="STUNNED",this.stunTimer=3)):this.bossChargeTimer=.8:i>this.attackRadius*1.2?this.state="CHASE":(this.attackCooldown-=e,this.attackCooldown<=0&&(this.attackCooldown=1.2,(a=this.onAttackPlayer)==null||a.call(this,12)));break}this.animateLegs(e)}animateLegs(e){if(this.state==="FLIPPED"||this.state==="DYING"||this.state==="DEAD")return;const t=this.state==="CHASE"||this.state==="PATROL"||this.state==="ATTACK",n=this.state==="CHASE"?12:6;for(let i=0;i<this.legs.length;i++){const s=this.legs[i];if(t){const a=i%2===0?0:Math.PI;s.rotation.x=Math.sin(this.proceduralTime*n+a+i*.8)*.4}else s.rotation.x=Math.sin(this.proceduralTime*1.5+i*.5)*.05}t&&this.crabModel&&(this.crabModel.position.y=Math.abs(Math.sin(this.proceduralTime*8))*.03)}patrolBehavior(e){if(this.patrolWaypoints.length===0)return;const t=this.patrolWaypoints[this.currentWaypointIndex];if(this.mesh.position.distanceTo(t)<.5)this.currentWaypointIndex=(this.currentWaypointIndex+1)%this.patrolWaypoints.length;else{const i=new b().subVectors(t,this.mesh.position);i.y=0,this.safeNormalize(i),this.mesh.position.addScaledVector(i,this.moveSpeed*e),this.mesh.rotation.y=Math.atan2(i.x,i.z)}}chaseBehavior(e,t){const n=new b().subVectors(t,this.mesh.position);n.y=0,this.safeNormalize(n),this.mesh.position.addScaledVector(n,this.chaseSpeed*e),this.mesh.rotation.y=Math.atan2(n.x,n.z)}isAlive(){return this.state!=="DYING"&&this.state!=="DEAD"}getPosition(){return this.mesh.position}dispose(){this.isDead=!0,this.state="DEAD",this.mesh.visible=!1,this.onDeath=void 0,this.onAttackPlayer=void 0}}class Hr{constructor(e,t,n="COIN",i){C(this,"mesh");C(this,"isCollected",!1);C(this,"id");C(this,"type");C(this,"floatMesh");C(this,"spawnTime");C(this,"scaleFactor",1);if(this.id=e,this.type=n,this.mesh=new lt,this.mesh.position.copy(t),this.spawnTime=Date.now(),n==="CARD"){const s=new ke(.35,.55,.02),a=new Xe({color:15976004,emissive:10055168,emissiveIntensity:.5,metalness:.8,roughness:.2});this.floatMesh=new ee(s,a)}else if(n==="COIN")if(i){this.floatMesh=i.clone();const s=new tn().setFromObject(this.floatMesh),a=new b;s.getCenter(a);const o=new b;s.getSize(o);const l=Math.max(o.x,o.y,o.z),c=.3;this.scaleFactor=l>.001?c/l:.25,this.floatMesh.scale.setScalar(this.scaleFactor);for(const h of this.floatMesh.children)h.position.sub(a)}else{const s=new yt(.1,.1,.03,16),a=new Xe({color:16766720,emissive:11175936,emissiveIntensity:.6,metalness:.9,roughness:.1}),o=new ee(s,a);o.rotation.x=Math.PI/2,this.floatMesh=o,this.scaleFactor=1}else if(n==="CHOCOLATE_FROG"){const s=new va(.18),a=new Xe({color:4861467,roughness:.5});this.floatMesh=new ee(s,a)}else{const a=n==="POTION_HP"?16720452:43775,o=new lt,l=new yt(.12,.18,.4,8),c=new Xe({color:a,emissive:a,emissiveIntensity:.4,roughness:.2,transparent:!0,opacity:.85}),h=new ee(l,c);h.position.y=.2;const u=new yt(.06,.06,.1,8),d=new Xe({color:7816226}),f=new ee(u,d);f.position.y=.45,o.add(h,f),this.floatMesh=o}this.floatMesh.castShadow=!0,this.mesh.add(this.floatMesh)}update(e){if(!this.isCollected)if(this.type==="CHOCOLATE_FROG")this.floatMesh.position.y=Math.abs(Math.sin(Date.now()*.006))*.25;else if(this.type==="COIN"){const t=Date.now()-this.spawnTime;let n=Math.sin(Date.now()*.005)*.05,i=1;if(t<1e3){const s=t/1e3;n+=Math.abs(Math.sin(s*Math.PI*3))*(1-s)*1.2,i=Math.min(1,s*2)}this.floatMesh.scale.setScalar(i*this.scaleFactor),this.floatMesh.rotation.y+=e*3,this.floatMesh.position.y=n+.1}else this.floatMesh.rotation.y+=e*2,this.floatMesh.position.y=Math.sin(Date.now()*.003)*.12}}class jv{constructor(e,t){C(this,"collectibles",[]);C(this,"collectedCount",0);C(this,"coinCount",0);C(this,"totalCards",3);C(this,"audioManager");C(this,"scene");C(this,"coinTemplate",null);this.scene=e,this.audioManager=t}spawnCard(e,t){const n=new Hr(e,t,"CARD");this.collectibles.push(n),this.scene.add(n.mesh)}spawnCoin(e,t){const n=new Hr(e,t,"COIN",this.coinTemplate||void 0);this.collectibles.push(n),this.scene.add(n.mesh)}spawnFrog(e,t){const n=new Hr(e,t,"CHOCOLATE_FROG");this.collectibles.push(n),this.scene.add(n.mesh)}spawnPotion(e,t,n){const i=new Hr(e,t,n);this.collectibles.push(i),this.scene.add(i.mesh)}update(e,t,n,i,s){for(const a of this.collectibles)a.isCollected||(a.update(t),a.mesh.position.distanceTo(e)<1.2&&(a.isCollected=!0,this.scene.remove(a.mesh),a.type==="CARD"?(this.collectedCount++,this.audioManager.playCardPickup(),n(this.collectedCount)):a.type==="COIN"?(this.coinCount++,this.audioManager.playBeanPickup(),this.spawnSparks(a.mesh.position),i==null||i(this.coinCount)):a.type==="CHOCOLATE_FROG"?(this.audioManager.playFrogPickup(),s==null||s("CHOCOLATE_FROG")):(a.type==="POTION_HP"||a.type==="POTION_MP")&&(this.audioManager.playPotionPickup(),s==null||s(a.type))))}spawnSparks(e){const n=new mt,i=new Float32Array(20*3),s=new Float32Array(20*3),a=[],o=new Me().setHSL(Math.random(),1,.5);for(let d=0;d<20;d++){i[d*3]=e.x,i[d*3+1]=e.y+.5,i[d*3+2]=e.z;const f=o.clone().offsetHSL(Math.random()*.2-.1,0,Math.random()*.2);s[d*3]=f.r,s[d*3+1]=f.g,s[d*3+2]=f.b,a.push((Math.random()-.5)*4,Math.random()*4+2,(Math.random()-.5)*4)}n.setAttribute("position",new ot(i,3)),n.setAttribute("color",new ot(s,3));const l=new yi({size:.15,vertexColors:!0,transparent:!0,opacity:1,blending:Vs,depthWrite:!1}),c=new Fi(n,l);this.scene.add(c);let h=0;const u=()=>{if(h+=.016,h>.6){this.scene.remove(c),n.dispose(),l.dispose();return}const d=n.attributes.position.array;for(let f=0;f<20;f++)d[f*3]+=a[f*3]*.016,d[f*3+1]+=a[f*3+1]*.016,d[f*3+2]+=a[f*3+2]*.016,a[f*3+1]-=9.8*.016;n.attributes.position.needsUpdate=!0,l.opacity=1-h/.6,requestAnimationFrame(u)};u()}}class Qv{constructor(e,t){C(this,"mesh");C(this,"isBroken",!1);C(this,"position");C(this,"onDestruct");C(this,"bodyMesh");C(this,"scene");this.position=e.clone(),this.scene=t,this.mesh=new lt,this.mesh.position.copy(e);const n=new yt(.35,.45,.9,12),i=new Xe({color:10506797,roughness:.8,metalness:.1});this.bodyMesh=new ee(n,i),this.bodyMesh.position.y=.45,this.bodyMesh.castShadow=!0,this.bodyMesh.receiveShadow=!0,this.mesh.add(this.bodyMesh);const s=new ii(.36,.04,8,16),a=new ee(s,i);a.rotation.x=Math.PI/2,a.position.y=.9,this.mesh.add(a),t.add(this.mesh)}shatter(e,t){if(this.isBroken)return;this.isBroken=!0,this.onDestruct&&this.onDestruct(),e.playPotShatter();const n=8,i=new ke(.15,.15,.15),s=new Xe({color:9127187,roughness:.9}),a=new lt;a.position.copy(this.mesh.position);for(let h=0;h<n;h++){const u=new ee(i,s);u.position.set((Math.random()-.5)*.4,.2+Math.random()*.4,(Math.random()-.5)*.4),a.add(u)}this.scene.add(a),this.scene.remove(this.mesh);let o=0;const l=()=>{o+=.016,a.children.forEach(h=>{h.position.y-=2*.016,h.rotation.x+=.1,h.rotation.y+=.1}),o<.6?requestAnimationFrame(l):this.scene.remove(a)};l(),Math.random()<.3?t.spawnFrog("frog_"+Date.now(),new b(this.position.x,.2,this.position.z)):Math.random()>.5&&t.spawnCoin(`pot_coin_${Date.now()}`,this.mesh.position.clone().add(new b(0,.5,0)))}}class ey{constructor(e,t=0){C(this,"mesh");C(this,"isUnlocked",!1);C(this,"position");C(this,"lidMesh");C(this,"lockLight");C(this,"lockMesh");this.position=e.clone(),this.mesh=new lt,this.mesh.position.copy(e),this.mesh.rotation.y=t;const n=new Xe({color:6044193,roughness:.7}),i=new Xe({color:13934615,metalness:.8,roughness:.3}),s=new ke(1.2,.6,.8),a=new ee(s,n);a.position.y=.3,a.castShadow=!0,a.receiveShadow=!0,this.mesh.add(a);const o=new ee(new ke(.1,.62,.82),i);o.position.set(-.5,.3,0);const l=new ee(new ke(.1,.62,.82),i);l.position.set(.5,.3,0),this.mesh.add(o,l),this.lidMesh=new lt,this.lidMesh.position.set(0,.6,-.4);const c=new ee(new yt(.4,.4,1.2,12,1,!1,0,Math.PI),n);c.rotation.z=Math.PI/2,c.position.set(0,0,.4),this.lidMesh.add(c),this.mesh.add(this.lidMesh);const h=new ii(.1,.03,8,16);this.lockMesh=new ee(h,i),this.lockMesh.position.set(0,.45,.43),this.mesh.add(this.lockMesh),this.lockLight=new sn(16766720,1.2,2.5),this.lockLight.position.copy(this.lockMesh.position),this.mesh.add(this.lockLight)}unlock(e,t,n){e.playChestOpen(),this.lockMesh.visible=!1,this.lockLight.color.setHex(4060159);const i=Date.now(),s=()=>{const a=(Date.now()-i)/1e3,o=Math.min(1,a/.8);this.lidMesh.rotation.x=-o*(Math.PI*.55),o<1?requestAnimationFrame(s):n&&n()};s()}}class ty{constructor(e,t,n){C(this,"mesh");C(this,"isLit",!1);C(this,"position");C(this,"ghostPlatforms",[]);C(this,"eyesLight");C(this,"headMesh");C(this,"mat");this.position=e.clone(),this.mesh=new lt,this.mesh.position.copy(e);const i=new Xe({color:4867930,roughness:.9}),s=new ee(new ke(.8,1.2,.8),i);s.position.y=.6,s.castShadow=!0,s.receiveShadow=!0,this.mesh.add(s),this.mat=new Xe({color:3683653,roughness:.8}),this.headMesh=new ee(new va(.4),this.mat),this.headMesh.position.set(0,1.4,0),this.mesh.add(this.headMesh);const a=new Xe({color:2762808}),o=new ee(new ha(.3,.9,4),a);o.rotation.z=Math.PI/3,o.position.set(-.5,1.4,0);const l=new ee(new ha(.3,.9,4),a);l.rotation.z=-Math.PI/3,l.position.set(.5,1.4,0),this.mesh.add(o,l),this.eyesLight=new sn(16777215,0,8),this.eyesLight.position.set(0,1.5,.3),this.mesh.add(this.eyesLight);const c=new Xe({color:8975871,emissive:4060159,emissiveIntensity:.6,transparent:!0,opacity:0,roughness:.1});n.forEach(h=>{const u=new ee(new ke(3.5,.3,3.5),c.clone());u.position.copy(h),u.visible=!1,t.add(u),this.ghostPlatforms.push(u)}),t.add(this.mesh)}activateLumos(e,t){this.isLit||(this.isLit=!0,e.playLumosGargoyle(),this.mat.emissive.setHex(16777096),this.mat.emissiveIntensity=.8,this.eyesLight.color.setHex(16777130),this.eyesLight.intensity=4,this.ghostPlatforms.forEach(n=>{n.visible=!0,t.push(n);const i=n.material;let s=0;const a=()=>{s+=.05,i.opacity=Math.min(.75,s),s<.75&&requestAnimationFrame(a)};a()}))}}class ny{constructor(){C(this,"mesh");C(this,"ringMesh");C(this,"iconMesh");C(this,"ringMat");C(this,"iconMat");C(this,"targetObject",null);C(this,"isVisible",!1);this.mesh=new lt,this.mesh.name="TargetReticle3D",this.mesh.visible=!1;const e=new ya(.5,.65,32);this.ringMat=new Mt({color:4060159,side:en,transparent:!0,opacity:.9}),this.ringMesh=new ee(e,this.ringMat),this.mesh.add(this.ringMesh);const t=new sr(.6,.6),n=document.createElement("canvas");n.width=128,n.height=128;const i=new gi(n);this.iconMat=new Mt({map:i,side:en,transparent:!0,opacity:.95}),this.iconMesh=new ee(t,this.iconMat),this.iconMesh.position.z=.02,this.mesh.add(this.iconMesh),this.updateIcon("FLIPENDO")}updateIcon(e){const t=document.createElement("canvas");t.width=128,t.height=128;const n=t.getContext("2d");n.clearRect(0,0,128,128),n.textAlign="center",n.textBaseline="middle";let i=4060159;e==="FLIPENDO"?(i=4060159,n.fillStyle="#3df3ff",n.font="bold 64px sans-serif",n.fillText("✋",64,64)):e==="ALOHOMORA"?(i=16766720,n.fillStyle="#ffd700",n.font="bold 64px sans-serif",n.fillText("🔑",64,64)):e==="LUMOS"?(i=16777130,n.fillStyle="#ffffaa",n.font="bold 64px sans-serif",n.fillText("💡",64,64)):(i=16729122,n.fillStyle="#ff4422",n.font="bold 64px sans-serif",n.fillText("🎯",64,64)),this.ringMat.color.setHex(i);const s=new gi(t);this.iconMat.map=s,this.iconMat.needsUpdate=!0}attachTo(e,t){this.targetObject=e,this.updateIcon(t),this.mesh.visible=!0,this.isVisible=!0}detach(){this.targetObject=null,this.mesh.visible=!1,this.isVisible=!1}update(e){if(!this.isVisible||!this.targetObject)return;const t=new b;this.targetObject.getWorldPosition(t),t.y+=.8,this.mesh.position.copy(t),this.mesh.lookAt(e),this.ringMesh.rotation.z+=.03}}class iy{constructor(e,t){C(this,"scene");C(this,"audioManager");C(this,"collectibleSystem");C(this,"reticle3D");C(this,"projectiles",[]);C(this,"targets",[]);C(this,"enemies",[]);C(this,"pots",[]);C(this,"chests",[]);C(this,"gargoyles",[]);C(this,"activeSpell","FLIPENDO");C(this,"spellCooldown",0);C(this,"onCollectStaffCallback");this.scene=e,this.audioManager=t,this.reticle3D=new ny,this.scene.add(this.reticle3D.mesh)}setCollectibleSystem(e){this.collectibleSystem=e}setActiveSpell(e){this.activeSpell!==e&&(this.activeSpell=e,this.audioManager.playSpellSwitch(),console.log(`[SpellSystem] Active spell switched to: ${e}`))}castActiveSpell(e,t){if(this.spellCooldown>0)return!1;const n=new Jv(e,t,this.activeSpell);return this.projectiles.push(n),this.scene.add(n.mesh),this.activeSpell==="FLIPENDO"?this.audioManager.playFlipendoCast():this.activeSpell==="ALOHOMORA"?this.audioManager.playAlohomoraCast():this.activeSpell==="LUMOS"&&this.audioManager.playLumosCast(),this.spellCooldown=.12,!0}registerTarget(e){this.targets.push(e),this.scene.add(e.mesh)}registerEnemy(e){this.enemies.push(e)}registerPot(e){this.pots.push(e)}registerChest(e){this.chests.push(e)}registerGargoyle(e){this.gargoyles.push(e)}getAimedDirection(e,t,n){let i=null,s=-1/0;const a=22,o=(l,c)=>{const h=l.distanceTo(t);if(h>a)return;const u=l.clone().sub(t).normalize(),d=n.dot(u);if(d>.85){const f=c?.3:0,p=d*2-h/a*.5+f;p>s&&(s=p,i=l.clone())}};for(const l of this.enemies)l.isAlive()&&o(l.getPosition().clone().add(new b(0,.6,0)),!0);for(const l of this.pots)l.isBroken||o(l.position.clone().add(new b(0,.4,0)),this.activeSpell==="FLIPENDO");for(const l of this.chests)l.isUnlocked||o(l.position.clone().add(new b(0,.5,0)),this.activeSpell==="ALOHOMORA");for(const l of this.gargoyles)l.isLit||o(l.position.clone().add(new b(0,.6,0)),this.activeSpell==="LUMOS");for(const l of this.targets)if(!l.isActivated){const c=new b;l.mesh.getWorldPosition(c),o(c,this.activeSpell==="FLIPENDO")}if(i){const l=i.sub(e).normalize();return n.clone().lerp(l,.85).normalize()}return n.clone()}updateTargetLockon(e,t){let n=null,i=18,s="FLIPENDO";for(const a of this.enemies)if(a.isAlive()){const o=a.getPosition(),l=o.distanceTo(e),c=o.clone().sub(e).normalize();t.dot(c)>.85&&l<i&&(i=l,n=a.mesh,s="FLIPENDO")}for(const a of this.pots)if(!a.isBroken){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="FLIPENDO")}for(const a of this.chests)if(!a.isUnlocked){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="ALOHOMORA")}for(const a of this.gargoyles)if(!a.isLit){const o=a.position.distanceTo(e),l=a.position.clone().sub(e).normalize();t.dot(l)>.85&&o<i&&(i=o,n=a.mesh,s="LUMOS")}for(const a of this.targets)if(!a.isActivated){const o=new b;a.mesh.getWorldPosition(o);const l=o.distanceTo(e),c=o.clone().sub(e).normalize();t.dot(c)>.85&&l<i&&(i=l,n=a.mesh,s="FLIPENDO")}n?(this.reticle3D.attachTo(n,s),this.reticle3D.update(e)):this.reticle3D.detach()}update(e,t){this.spellCooldown>0&&(this.spellCooldown-=e),this.targets.forEach(n=>n.update(e));for(let n=this.projectiles.length-1;n>=0;n--){const i=this.projectiles[n];if(i.update(e),i.isDead){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.spellType==="FLIPENDO"){let c=!1;for(const h of this.pots)if(!h.isBroken&&i.mesh.position.distanceTo(h.position)<1){h.shatter(this.audioManager,this.collectibleSystem),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;if(i.spellType==="ALOHOMORA"){let c=!1;for(const h of this.chests)if(!h.isUnlocked&&i.mesh.position.distanceTo(h.position)<1.4){h.unlock(this.audioManager,this.collectibleSystem,this.onCollectStaffCallback),this.createImpactParticles(i.mesh.position,16766720),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;if(i.spellType==="LUMOS"){let c=!1;for(const h of this.gargoyles)if(!h.isLit&&i.mesh.position.distanceTo(h.position)<1.8){h.activateLumos(this.audioManager,t),this.createImpactParticles(i.mesh.position,16777096),i.isDead=!0,c=!0;break}if(c){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}if(i.isDead)continue;let s=!1;for(const c of this.targets)if(!c.isActivated){const h=new b;if(c.mesh.getWorldPosition(h),i.mesh.position.distanceTo(h)<1){c.activate(),this.audioManager.playTargetHit(),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,s=!0;break}}if(s){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.isDead)continue;let a=!1;for(const c of this.enemies)if(c.isAlive()){const h=c.getPosition();if(i.mesh.position.distanceTo(h)<1.2){c.takeHit(),this.audioManager.playEnemyStun(),this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,a=!0;break}}if(a){this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}if(i.isDead)continue;if(new er(i.mesh.position,i.velocity.clone().normalize(),0,.6).intersectObjects(t,!0).length>0){this.createImpactParticles(i.mesh.position,4060159),i.isDead=!0,this.scene.remove(i.mesh),this.projectiles.splice(n,1);continue}}}createImpactParticles(e,t=4060159){const i=new mt,s=new Float32Array(20*3),a=[];for(let u=0;u<20;u++)s[u*3]=e.x,s[u*3+1]=e.y,s[u*3+2]=e.z,a.push(new b((Math.random()-.5)*4.5,(Math.random()-.5)*4.5,(Math.random()-.5)*4.5));i.setAttribute("position",new ot(s,3));const o=new yi({color:t,size:.14,transparent:!0,opacity:1}),l=new Fi(i,o);this.scene.add(l);let c=0;const h=()=>{c+=.016;const u=l.geometry.attributes.position.array;for(let d=0;d<20;d++)u[d*3]+=a[d].x*.016,u[d*3+1]+=a[d].y*.016,u[d*3+2]+=a[d].z*.016;l.geometry.attributes.position.needsUpdate=!0,o.opacity=Math.max(0,1-c*2.5),c<.4?requestAnimationFrame(h):(this.scene.remove(l),i.dispose(),o.dispose())};h()}}class sy{constructor(){C(this,"checkpoints",[]);C(this,"currentCheckpointIndex",0);C(this,"abyssYThreshold",-8)}addCheckpoint(e,t,n=0){this.checkpoints.push({id:e,position:t.clone(),rotationY:n})}setActiveCheckpoint(e){const t=this.checkpoints.findIndex(n=>n.id===e);t!==-1&&t>this.currentCheckpointIndex&&(this.currentCheckpointIndex=t,console.log(`[CheckpointManager] Activated Checkpoint #${e}`))}update(e){return e.mesh.position.y<this.abyssYThreshold?(this.respawnPlayer(e),!0):!1}respawnPlayer(e){const t=this.checkpoints[this.currentCheckpointIndex];t&&(e.mesh.position.copy(t.position),e.mesh.rotation.y=t.rotationY,e.velocity.set(0,0,0),console.log(`[CheckpointManager] Player respawned at Checkpoint #${t.id}`))}getCurrentCheckpointId(){var e;return((e=this.checkpoints[this.currentCheckpointIndex])==null?void 0:e.id)??0}getActiveCheckpointPosition(){var e;return((e=this.checkpoints[this.currentCheckpointIndex])==null?void 0:e.position.clone())??new b(0,.2,12)}}class ry{constructor(){C(this,"reticleEl");C(this,"hudTopLeftEl");C(this,"hudTopRightEl");C(this,"objectiveContainerEl");C(this,"spellHotbarEl");C(this,"objectiveTextEl");C(this,"cardCounterEl",null);C(this,"interactionPromptEl");C(this,"interactionLabelEl");C(this,"debugOverlayEl");C(this,"debugFpsEl");C(this,"debugPosEl");C(this,"debugStateEl");C(this,"debugAnimEl");C(this,"debugCheckpointEl");C(this,"victoryScreenEl");C(this,"victoryCardsEl");C(this,"victoryTimeEl");C(this,"hpBarFillEl");C(this,"mpBarFillEl");C(this,"coinCounterEl",null);C(this,"keyCounterEl",null);C(this,"gekkoQuestBadgeEl",null);C(this,"damageFlashEl");C(this,"screenFadeEl");C(this,"dialogueBubbleEl");C(this,"dialogueSpeakerEl");C(this,"dialogueTextEl");C(this,"slotSpell1El");C(this,"slotSpell2El");C(this,"slotSpell3El");C(this,"isDebugMode",!1);C(this,"typewriterInterval");this.reticleEl=document.getElementById("reticle"),this.hudTopLeftEl=document.getElementById("hud-top-left"),this.hudTopRightEl=document.getElementById("hud-top-right"),this.objectiveContainerEl=document.getElementById("objective-container"),this.spellHotbarEl=document.getElementById("spell-hotbar"),this.objectiveTextEl=document.getElementById("objective-text"),this.interactionPromptEl=document.getElementById("interaction-prompt"),this.interactionLabelEl=document.getElementById("interaction-label"),this.debugOverlayEl=document.getElementById("debug-overlay"),this.debugFpsEl=document.getElementById("debug-fps"),this.debugPosEl=document.getElementById("debug-pos"),this.debugStateEl=document.getElementById("debug-state"),this.debugAnimEl=document.getElementById("debug-anim"),this.debugCheckpointEl=document.getElementById("debug-checkpoint"),this.victoryScreenEl=document.getElementById("victory-screen"),this.victoryCardsEl=document.getElementById("victory-cards"),this.victoryTimeEl=document.getElementById("victory-time"),this.coinCounterEl=document.getElementById("coin-count"),this.keyCounterEl=document.getElementById("key-count"),this.cardCounterEl=document.getElementById("card-count"),this.gekkoQuestBadgeEl=document.getElementById("gekko-quest-complete"),this.hpBarFillEl=document.getElementById("hp-bar-fill"),this.mpBarFillEl=document.getElementById("mp-bar-fill"),this.slotSpell1El=document.getElementById("slot-spell-1"),this.slotSpell2El=document.getElementById("slot-spell-2"),this.slotSpell3El=document.getElementById("slot-spell-3"),this.damageFlashEl=document.getElementById("damage-flash"),this.screenFadeEl=document.getElementById("screen-fade"),this.dialogueBubbleEl=document.getElementById("dialogue-bubble"),this.dialogueSpeakerEl=document.getElementById("dialogue-speaker"),this.dialogueTextEl=document.getElementById("dialogue-text")}showGameplayHUD(){this.hudTopLeftEl.classList.remove("hidden"),this.hudTopRightEl.classList.remove("hidden"),this.spellHotbarEl.classList.remove("hidden")}setHealth(e,t=100){const n=Math.max(0,Math.ceil(e)),i=Math.max(0,Math.min(100,e/t*100));this.hpBarFillEl.style.width=`${i}%`;const s=document.getElementById("hp-text");s&&(s.textContent=`${n} / ${t}`)}setMana(e,t=100){const n=Math.max(0,Math.ceil(e)),i=Math.max(0,Math.min(100,e/t*100));this.mpBarFillEl.style.width=`${i}%`;const s=document.getElementById("mp-text");s&&(s.textContent=`${n} / ${t}`)}setCoinCount(e){if(this.coinCounterEl){this.coinCounterEl.textContent=e.toString()+" / 50";const t=document.getElementById("coin-counter-container");t&&(t.style.removeProperty("display"),t.classList.remove("hidden"))}this.gekkoQuestBadgeEl&&(e>=50?this.gekkoQuestBadgeEl.classList.remove("hidden"):this.gekkoQuestBadgeEl.classList.add("hidden"))}setKeyCount(e){this.keyCounterEl&&(this.keyCounterEl.textContent=`Llaves: ${e} / 5`)}setActiveSpellSlot(e){this.slotSpell1El.classList.remove("active"),this.slotSpell2El.classList.remove("active"),this.slotSpell3El.classList.remove("active"),e==="FLIPENDO"?this.slotSpell1El.classList.add("active"):e==="ALOHOMORA"?this.slotSpell2El.classList.add("active"):e==="LUMOS"&&this.slotSpell3El.classList.add("active")}triggerDamageFlash(){this.damageFlashEl.classList.remove("hidden"),this.damageFlashEl.style.animation="none",this.damageFlashEl.offsetHeight,this.damageFlashEl.style.animation="flash-red 0.3s ease-out forwards",setTimeout(()=>{this.damageFlashEl.classList.add("hidden")},300)}showReticle(e){e?this.reticleEl.classList.remove("hidden"):this.reticleEl.classList.add("hidden")}setObjective(e){e?(this.objectiveContainerEl.classList.remove("hidden"),this.objectiveTextEl.textContent=e):this.objectiveContainerEl.classList.add("hidden")}setCardCount(e,t=3){this.cardCounterEl&&(this.cardCounterEl.textContent=`${e} / ${t}`)}showInteractionPrompt(e){this.interactionLabelEl.textContent=e,this.interactionPromptEl.classList.remove("hidden")}hideInteractionPrompt(){this.interactionPromptEl.classList.add("hidden")}toggleDebug(){this.isDebugMode=!this.isDebugMode,this.isDebugMode?this.debugOverlayEl.classList.remove("hidden"):this.debugOverlayEl.classList.add("hidden")}updateDebugStats(e,t,n,i,s,a,o){this.isDebugMode&&(this.debugFpsEl.textContent=e.toString(),this.debugPosEl.textContent=`${t.toFixed(1)}, ${n.toFixed(1)}, ${i.toFixed(1)}`,this.debugStateEl.textContent=s,this.debugAnimEl.textContent=a,this.debugCheckpointEl.textContent=o.toString())}showVictoryScreen(e,t){this.victoryCardsEl.textContent=`${e} / 3`,this.victoryTimeEl.textContent=t,this.victoryScreenEl.classList.remove("hidden")}hideVictoryScreen(){this.victoryScreenEl.classList.add("hidden")}showTypewriterDialogue(e,t,n){this.dialogueBubbleEl.classList.remove("hidden"),this.dialogueSpeakerEl.textContent=e,this.dialogueTextEl.textContent="",this.typewriterInterval&&clearInterval(this.typewriterInterval);let i=0;this.typewriterInterval=setInterval(()=>{i<t.length?(this.dialogueTextEl.textContent+=t.charAt(i),i++):(clearInterval(this.typewriterInterval),n&&n())},40)}hideDialogue(){this.dialogueBubbleEl.classList.add("hidden"),this.typewriterInterval&&clearInterval(this.typewriterInterval)}fadeScreenOut(e=1e3){return this.screenFadeEl.style.transition=`opacity ${e}ms ease-in-out`,this.screenFadeEl.classList.remove("hidden"),new Promise(t=>setTimeout(t,e))}fadeScreenIn(e=1e3){return this.screenFadeEl.style.transition=`opacity ${e}ms ease-in-out`,this.screenFadeEl.classList.add("hidden"),new Promise(t=>setTimeout(t,e))}}class go{static createStoneWallTexture(){const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d");t.fillStyle="#2d2838",t.fillRect(0,0,512,512);const n=8,i=4,s=512/n,a=512/i;for(let l=0;l<n;l++){const c=l%2*(a/2);for(let h=-1;h<i+1;h++){const u=h*a+c,d=l*s,f=Math.floor(40+Math.random()*35);t.fillStyle=`rgb(${f+5}, ${f}, ${f+15})`,t.fillRect(u+2,d+2,a-4,s-4);for(let p=0;p<40;p++){const _=u+Math.random()*a,g=d+Math.random()*s,m=.05+Math.random()*.1;t.fillStyle=Math.random()>.5?`rgba(255,255,255,${m})`:`rgba(0,0,0,${m})`,t.fillRect(_,g,3,3)}t.strokeStyle="#120f18",t.lineWidth=4,t.strokeRect(u,d,a,s)}}const o=new gi(e);return o.wrapS=nn,o.wrapT=nn,o}static createCheckerFloorTexture(){const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d"),n=64;for(let s=0;s<512;s+=n)for(let a=0;a<512;a+=n){const o=(s/n+a/n)%2===0;t.fillStyle=o?"#1a1824":"#dcd6e8",t.fillRect(s,a,n,n),t.strokeStyle=o?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.1)",t.lineWidth=1.5,t.beginPath(),t.moveTo(s+Math.random()*n,a),t.lineTo(s+Math.random()*n,a+n),t.stroke()}const i=new gi(e);return i.wrapS=nn,i.wrapT=nn,i}static createWoodTexture(){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#4a2e1b",t.fillRect(0,0,256,256),t.strokeStyle="rgba(30, 15, 5, 0.4)",t.lineWidth=2;for(let i=0;i<256;i+=6)t.beginPath(),t.moveTo(0,i+Math.sin(i*.1)*4),t.lineTo(256,i+Math.cos(i*.1)*4),t.stroke();return new gi(e)}static createCarpetTexture(){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#6e1b24",t.fillRect(0,0,256,256),t.strokeStyle="#f3c644",t.lineWidth=12,t.strokeRect(6,6,244,244),t.strokeStyle="#996e00",t.lineWidth=4,t.strokeRect(16,16,224,224);const n=new gi(e);return n.wrapS=nn,n.wrapT=nn,n}static createStainedGlassTexture(){const e=document.createElement("canvas");e.width=256,e.height=512;const t=e.getContext("2d");t.fillStyle="#0a0815",t.fillRect(0,0,256,512);const n=["#9d4edd","#3df3ff","#f3c644","#ff2244","#22cc44"];for(let s=50;s<450;s+=50)for(let a=30;a<220;a+=45)t.fillStyle=n[Math.floor(Math.random()*n.length)],t.fillRect(a,s,40,45);return t.strokeStyle="#111",t.lineWidth=6,t.strokeRect(20,40,216,432),new gi(e)}static createPortraitTexture(e){const t=document.createElement("canvas");t.width=256,t.height=320;const n=t.getContext("2d");return n.fillStyle="#d4a017",n.fillRect(0,0,256,320),n.fillStyle="#4a3000",n.fillRect(16,16,224,288),n.fillStyle="#221a2e",n.fillRect(24,24,208,272),n.fillStyle="#dcd6e8",n.font="bold 20px Cinzel, serif",n.textAlign="center",n.fillText("🧙‍♂️",128,140),n.font="bold 14px Cinzel, serif",n.fillStyle="#f3c644",n.fillText(e,128,220),new gi(t)}}class Wr{constructor(e,t,n,i){C(this,"boundingBox");C(this,"id");C(this,"isTriggered",!1);C(this,"onTrigger");C(this,"debugMesh",null);this.id=e,this.boundingBox=new tn(t,n),this.onTrigger=i}check(e){return this.isTriggered?!1:this.boundingBox.containsPoint(e)?(this.isTriggered=!0,console.log(`[TriggerZone] Triggered zone '${this.id}'`),this.onTrigger(),!0):!1}createDebugMesh(e){const t=new b,n=new b;this.boundingBox.getSize(t),this.boundingBox.getCenter(n);const i=new ke(t.x,t.y,t.z),s=new Mt({color:16776960,wireframe:!0,transparent:!0,opacity:.5});this.debugMesh=new ee(i,s),this.debugMesh.position.copy(n),e.add(this.debugMesh)}}class ay{constructor(e){C(this,"staffInChest",null);C(this,"bobAnimId",null);C(this,"deps");this.deps=e}async run(){const{scene:e,player:t,chestPosition:n,hud:i,onComplete:s}=this.deps;if(t.isMovementLocked=!0,t.velocity.set(0,0,0),t.animationController.playState("Idle"),console.log("[ChestCinematic] CHEST_OPEN"),this.staffInChest)this.staffInChest.visible=!0,console.log("[ChestCinematic] STAFF_VISIBLE — showing existing chest prop");else{console.log("[ChestCinematic] STAFF_VISIBLE — loading baculo.glb?v=7");try{const l=await new or().loadAsync("/magic-academy-3d/assets/characters/baculo.glb?v=7");this.staffInChest=l.scene,this.staffInChest.name="chest_staff_prop",this.staffInChest.position.set(n.x,n.y+.3,n.z),e.add(this.staffInChest);const c=new tn().setFromObject(this.staffInChest),h=new b;c.getSize(h);const u=Math.max(h.x,h.y,h.z);console.log("[ChestCinematic] baculo.glb native: "+h.x.toFixed(3)+"w x "+h.y.toFixed(3)+"h x "+h.z.toFixed(3)+"d (largest: "+u.toFixed(3)+")");const d=.32,f=u>.001?d/u:.1;this.staffInChest.scale.setScalar(f),console.log("[ChestCinematic] Scale factor: "+f.toFixed(4)+" (target "+d+"m)");const p=n.y+.3;this.staffInChest.position.set(n.x,p,n.z),this.staffInChest.rotation.set(0,Math.PI*.25,Math.PI*.5),console.log("[ChestCinematic] Staff world pos: ("+n.x.toFixed(2)+", "+p.toFixed(2)+", "+n.z.toFixed(2)+")")}catch(o){console.warn("[ChestCinematic] baculo.glb load failed:",o)}}if(this.staffInChest){const o=this.staffInChest,l=o.position.y,c=Date.now(),h=()=>{if(!o.parent)return;const u=(Date.now()-c)/1e3;o.position.y=l+Math.sin(u*2.5)*.035,o.rotation.y=u*1,this.bobAnimId=requestAnimationFrame(h)};this.bobAnimId=requestAnimationFrame(h)}await this.wait(1e3),console.log("[ChestCinematic] PLAYER_TAKES_STAFF"),this.staffInChest&&(this.staffInChest.visible=!1,this.bobAnimId!==null&&(cancelAnimationFrame(this.bobAnimId),this.bobAnimId=null)),await this.playTakeItemAndWait(t)||await this.wait(600),console.log("[ChestCinematic] FADE_OUT — animation complete"),this.staffInChest&&(e.remove(this.staffInChest),this.staffInChest=null),await i.fadeScreenOut(700),console.log("[ChestCinematic] EQUIP_STAFF — screen black"),t.hasStaff=!0,t.setStaffVisibility(!0),t.animationController.setArmed(!0),i.setObjective("Usa Force Blast en el objetivo sobre la puerta"),await this.wait(400),console.log("[ChestCinematic] FADE_IN — player armed and ready"),t.isMovementLocked=!1,await i.fadeScreenIn(700),console.log("[ChestCinematic] GAMEPLAY_WITH_STAFF — done"),s()}playTakeItemAndWait(e){return new Promise(t=>{const n=e.animationController,i=n.mixer,s=n.allActions,a=i&&s?s.get("TakeItem"):void 0;if(!i||!a){const c=s?Array.from(s.keys()).join(", "):"no map";console.warn("[ChestCinematic] TakeItem not in allActions. Available: ["+c+"]"),t(!1);return}console.log("[ChestCinematic] TakeItem found, duration="+a.getClip().duration.toFixed(2)+"s"),n.isPlayingOneShot=!0;const o=n.currentAction;o&&o!==a&&o.fadeOut(.15),a.reset().setLoop(ia,1).setEffectiveWeight(1).fadeIn(.15).play(),a.clampWhenFinished=!0,n.currentAction=a;const l=c=>{c.action===a&&(i.removeEventListener("finished",l),n.isPlayingOneShot=!1,console.log("[ChestCinematic] TakeItem finished (mixer event)"),t(!0))};i.addEventListener("finished",l)})}wait(e){return new Promise(t=>setTimeout(t,e))}}class oy{constructor(e,t=0){C(this,"mesh");C(this,"mixer");C(this,"waveAction");C(this,"talkAction");C(this,"isTalking",!1);this.mesh=new lt,this.mesh.position.copy(e),this.mesh.rotation.y=t}async loadModels(){const e=new or;try{const t=await e.loadAsync("/magic-academy-3d/assets/characters/gekko_wave.glb"),n=t.scene;n.traverse(s=>{if(s.isMesh){s.castShadow=!0,s.receiveShadow=!0;const a=s.material;if(a){const o=l=>{l.transparent=!1,l.depthWrite=!0,l.alphaTest=.5,l.needsUpdate=!0};Array.isArray(a)?a.forEach(o):o(a)}}}),n.scale.set(.25,.25,.25),this.mesh.add(n),this.mixer=new Vl(n),t.animations&&t.animations.length>0&&(this.waveAction=this.mixer.clipAction(t.animations[0]),this.waveAction.play());const i=await e.loadAsync("/magic-academy-3d/assets/characters/gekko_talks.glb");i.animations&&i.animations.length>0&&(this.talkAction=this.mixer.clipAction(i.animations[0]))}catch(t){console.warn("Failed to load Gekko models (gekko_wave.glb / gekko_talks.glb). Please ensure files exist in public/assets/characters/.",t);const n=new yt(.5,.5,2),i=new Xe({color:65280}),s=new ee(n,i);s.position.y=1,this.mesh.add(s)}}setTalking(e){if(this.isTalking!==e&&(this.isTalking=e,this.mixer)){if(e&&this.talkAction){this.waveAction&&this.waveAction.crossFadeTo(this.talkAction,.5,!0),this.talkAction.reset().play();const t=this.mesh.children[0];t&&(t.rotation.y=-Math.PI/2)}else if(!e&&this.waveAction){this.talkAction&&this.talkAction.crossFadeTo(this.waveAction,.5,!0),this.waveAction.reset().play();const t=this.mesh.children[0];t&&(t.rotation.y=0)}}}update(e){this.mixer&&this.mixer.update(e)}}class ly{constructor(e,t,n=2,i=2.5,s=2.5){C(this,"mesh");C(this,"velocity",new b);C(this,"startPos");C(this,"endPos");C(this,"speed");C(this,"progress",0);C(this,"direction",1);this.startPos=e.clone(),this.endPos=t.clone(),this.speed=n;const a=new ke(i,.4,s),o=new Xe({color:5918840,roughness:.5,metalness:.2});this.mesh=new ee(a,o),this.mesh.position.copy(e),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0;const l=new ke(i*.9,.05,s*.9),c=new Mt({color:4060159}),h=new ee(l,c);h.position.y=.21,this.mesh.add(h)}update(e){const t=this.startPos.distanceTo(this.endPos);if(t<.01)return;this.progress+=this.speed*e/t*this.direction,this.progress>=1?(this.progress=1,this.direction=-1):this.progress<=0&&(this.progress=0,this.direction=1);const n=this.mesh.position.clone();this.mesh.position.lerpVectors(this.startPos,this.endPos,this.progress),this.velocity.subVectors(this.mesh.position,n)}}class Qr{static async runSequence(e,t,n,i,s){if(this.isSequenceRunning){console.warn(`[KEY] Sequence already running, skipping duplicate call for '${e.id}'`);return}this.isSequenceRunning=!0,console.log(`[KEY] KeyPickupSequence started for '${e.id}' (${e.name}) at`,t),n.isControlsLocked=!0,n.isMovementLocked=!0,n.velocity.set(0,0,0);const a=new lt;a.name=`cinematic_key_${e.id}`,a.position.copy(t);const o=new Xe({color:e.color,emissive:e.emissiveColor,emissiveIntensity:1.2,metalness:.85,roughness:.2}),l=new ee(new ii(.24,.07,12,24),o);l.rotation.x=Math.PI/2;const c=new ee(new yt(.05,.05,.6,12),o);c.position.y=-.32;const h=new ee(new ke(.16,.1,.05),o);h.position.set(.1,-.5,0);const u=new ee(new ke(.12,.08,.05),o);u.position.set(.08,-.38,0),a.add(l,c,h,u);const d=new sn(e.emissiveColor,4,6);d.position.set(0,0,0),a.add(d);const f=14,p=[],_=new ir(.035,0);for(let w=0;w<f;w++){const x=new Mt({color:e.color,transparent:!0,opacity:.9}),R=new ee(_,x),I=w/f*Math.PI*2;R.position.set(Math.cos(I)*.35,(Math.random()-.5)*.4,Math.sin(I)*.35),a.add(R),p.push(R)}i.add(a),console.log("[KEY] Flying to player...");const g=1.4;let m=0;const S=t.clone();await new Promise(w=>{const x=()=>{m+=.016;const R=Math.min(1,m/g),I=R<.5?4*R*R*R:1-Math.pow(-2*R+2,3)/2,L=n.mesh.position.clone().add(new b(0,1.2,0)),D=Math.max(S.y,L.y)+1.2,H=new b;H.x=ft.lerp(S.x,L.x,I),H.z=ft.lerp(S.z,L.z,I),H.y=(1-I)*(1-I)*S.y+2*(1-I)*I*D+I*I*L.y,a.position.copy(H),a.rotation.y+=.08,p.forEach((Y,O)=>{Y.rotation.x+=.1,Y.rotation.y+=.1,Y.position.y+=Math.sin(m*8+O)*.005}),R<1?requestAnimationFrame(x):w()};requestAnimationFrame(x)}),console.log("[KEY] Attached to hand"),i.remove(a);const M=Fu.findHandNode(n);M.add(a),a.position.set(.02,.08,.04),a.rotation.set(0,Math.PI/2,Math.PI/4),a.scale.setScalar(.9);const v=new sn(e.emissiveColor,4.5,6);v.position.set(0,.2,.2),a.add(v),n.animationController.playTakeItemAnimation(()=>{});let E=0;const T=1.8;await new Promise(w=>{const x=()=>{E+=.016;const R=Math.min(1,E/T);a.rotation.z+=.04,v.intensity=(4+Math.sin(E*10)*1.5)*(1-Math.max(0,(R-.7)/.3)),p.forEach(I=>{I.material.opacity=Math.max(0,1-R*1.3)}),R<1?requestAnimationFrame(x):(M.remove(a),a.traverse(I=>{if(I.isMesh){I.geometry.dispose();const L=I.material;Array.isArray(L)?L.forEach(D=>D.dispose()):L.dispose()}}),w())};requestAnimationFrame(x)}),e.obtained=!0,console.log(`[KEY] Added to inventory: '${e.id}'`),n.isControlsLocked=!1,n.isMovementLocked=!1,this.isSequenceRunning=!1,console.log(`[KEY] KeyPickupSequence completed for '${e.id}'`),s&&s()}}C(Qr,"isSequenceRunning",!1);class cy{constructor(e,t,n,i,s,a,o,l,c){C(this,"sceneManager");C(this,"cameraController");C(this,"player");C(this,"inputManager");C(this,"spellSystem");C(this,"checkpointManager");C(this,"collectibleSystem");C(this,"subtitleSystem");C(this,"audioManager");C(this,"levelColliders",[]);C(this,"triggerZones",[]);C(this,"doors",[]);C(this,"pots",[]);C(this,"chests",[]);C(this,"enemies",[]);C(this,"gargoyles",[]);C(this,"movingPlatforms",[]);C(this,"collectedKeys",{key1_gekko:!1,key2_boss:!1,key3_platform:!1,key4_gargoyles:!1,key5_pots:!1});C(this,"totalKeysCount",0);C(this,"staffChest");C(this,"exitDoor");C(this,"gekkoNPC");C(this,"floatingCoinMesh");C(this,"grassUniforms",null);C(this,"cloudsUniforms",null);C(this,"gekkoMissionState","NOT_STARTED");C(this,"isCinematicPlaying",!1);C(this,"coinsExchanged",!1);C(this,"litGargoylesCount",0);C(this,"specialPotsSmashed",0);C(this,"totalSpecialPots",5);C(this,"keyDefinitions",{key1_gekko:{id:"key1_gekko",name:"Llave de la Riqueza (Gekko)",color:65416,emissiveColor:52326,obtained:!1},key2_boss:{id:"key2_boss",name:"Llave de Combate (Jefe Cangrejo)",color:16720384,emissiveColor:16729088,obtained:!1},key3_platform:{id:"key3_platform",name:"Llave de Plataformas (Tejado)",color:58879,emissiveColor:49151,obtained:!1},key4_gargoyles:{id:"key4_gargoyles",name:"Llave del Secreto (Gárgolas)",color:11032055,emissiveColor:9647082,obtained:!1},key5_pots:{id:"key5_pots",name:"Llave de Destrucción (Gemas)",color:16753920,emissiveColor:16746496,obtained:!1}});C(this,"keysMeshes",[]);C(this,"bossEnemy");C(this,"stateFlags",{introCompleted:!1,staffFound:!1,gekkoTalked:!1,bossCinematicPlayed:!1,levelCompleted:!1});this.sceneManager=e,this.cameraController=t,this.player=n,this.inputManager=i,this.spellSystem=s,this.checkpointManager=a,this.collectibleSystem=o,this.subtitleSystem=l,this.audioManager=c}init(){this.buildToyStoryLevelGeometry(),this.setupCheckpoints(),this.setupInteractiveProps(),this.setupCollectibles(),this.setupEnemies(),this.setupNPCs(),this.setupTriggers();const e=this.sceneManager.scene;e.background=new Me(132631),e.fog=new ma(132631,.007);const t=new kl(1976635,.5),n=new sp(1976635,132631,.4),i=new Qs(11850750,1.2);i.position.set(40,80,-60),i.castShadow=!0,i.shadow.mapSize.width=2048,i.shadow.mapSize.height=2048,i.shadow.camera.near=.5,i.shadow.camera.far=200;const s=60;i.shadow.camera.left=-s,i.shadow.camera.right=s,i.shadow.camera.top=s,i.shadow.camera.bottom=-s,i.shadow.bias=-3e-4;const a=new sn(16753988,2.5,18);a.position.set(0,3,-25.5),e.add(a);const o=new sn(16753988,2.5,18);o.position.set(-6,3,-25.5),e.add(o);const l=new Qs(3718648,1.2);l.position.set(-30,20,-80),e.add(t,n,i,l);const c=new Zt(6,24,24),h=new Mt({color:16777215}),u=new ee(c,h);u.position.set(40,80,-60);const d=new Zt(7.5,16,16),f=new Mt({color:9684477,transparent:!0,opacity:.35,blending:Vs,side:Jt}),p=new ee(d,f);u.add(p),e.add(u);const _=new Zt(140,32,24),g=new Cn({uniforms:{uTime:{value:0},uSkyColor:{value:new Me(132631)},uCloudColor:{value:new Me(1976635)},uMoonColor:{value:new Me(9684477)},uMoonPos:{value:new b(40,80,-60)}},vertexShader:`
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
      `,side:Jt,transparent:!0,depthWrite:!1}),m=new ee(_,g);e.add(m),this.cloudsUniforms=g.uniforms;const S=450,M=new mt,v=new Float32Array(S*3),E=new Float32Array(S*3);for(let x=0;x<S;x++){const R=Math.random(),I=Math.random(),L=R*2*Math.PI,D=Math.acos(2*I-1),H=125+Math.random()*15,Y=H*Math.sin(D)*Math.cos(L),O=Math.abs(H*Math.sin(D)*Math.sin(L))+10,X=H*Math.cos(D);v[x*3]=Y,v[x*3+1]=O,v[x*3+2]=X;const B=.5+Math.random()*.5;E[x*3]=B,E[x*3+1]=B,E[x*3+2]=B}M.setAttribute("position",new ot(v,3)),M.setAttribute("color",new ot(E,3));const T=new yi({size:1.2,vertexColors:!0,transparent:!0,opacity:.9,sizeAttenuation:!0}),w=new Fi(M,T);e.add(w),this.spawnKeysInWorld(),this.checkpointManager.respawnPlayer(this.player)}buildToyStoryLevelGeometry(){const e=this.sceneManager.scene,t=go.createStoneWallTexture();t.repeat.set(4,4);const n=go.createCheckerFloorTexture();n.repeat.set(8,8);const i=new Xe({map:t,roughness:.65,bumpScale:.04}),s=new Xe({map:n,roughness:.35,metalness:.1}),a=new Xe({color:2246949,roughness:.95}),o=new Xe({color:12759680,roughness:.85}),l=new ee(new ke(160,1,160),a);l.position.set(0,-.5,-40),l.receiveShadow=!0,e.add(l),this.levelColliders.push(l),(()=>{const re=me=>{const ae=new Float32Array(42),Z=new Float32Array(14*2),oe=new Float32Array(14*3);for(let he=0;he<=6;he++){const Ge=he/6,Qe=Ge*1.4,rn=.2*(1-Ge*.85),Pn=he*2,In=he*2+1;ae[Pn*3+0]=-rn,ae[Pn*3+1]=Qe,ae[Pn*3+2]=0,Z[Pn*2+0]=0,Z[Pn*2+1]=Ge,oe[Pn*3+0]=0,oe[Pn*3+1]=0,oe[Pn*3+2]=1,ae[In*3+0]=rn,ae[In*3+1]=Qe,ae[In*3+2]=0,Z[In*2+0]=1,Z[In*2+1]=Ge,oe[In*3+0]=0,oe[In*3+1]=0,oe[In*3+2]=1}const pe=6*6,j=new Uint16Array(pe);for(let he=0;he<6;he++){const Ge=he*6,Qe=he*2;j[Ge+0]=Qe,j[Ge+1]=Qe+1,j[Ge+2]=Qe+2,j[Ge+3]=Qe+1,j[Ge+4]=Qe+3,j[Ge+5]=Qe+2}const _e=new mt;return _e.setAttribute("position",new ot(ae,3)),_e.setAttribute("uv",new ot(Z,2)),_e.setAttribute("normal",new ot(oe,3)),_e.setIndex(new ot(j,1)),_e.applyMatrix4(new Se().makeRotationY(me)),_e},te=re(0),Le=re(Math.PI/3),Ne=re(-Math.PI/3),Ce=te.attributes.position.count*3,ht=new Float32Array(Ce*3),Ve=new Float32Array(Ce*2),at=new Float32Array(Ce*3),et=te.attributes.position.count,je=te.attributes.position.array,Tt=Le.attributes.position.array,Rt=Ne.attributes.position.array;ht.set(je,0),ht.set(Tt,je.length),ht.set(Rt,je.length+Tt.length);const At=te.attributes.uv.array,Nt=Le.attributes.uv.array,bt=Ne.attributes.uv.array;Ve.set(At,0),Ve.set(Nt,At.length),Ve.set(bt,At.length+Nt.length);const wt=te.attributes.normal.array,N=Le.attributes.normal.array,Xt=Ne.attributes.normal.array;at.set(wt,0),at.set(N,wt.length),at.set(Xt,wt.length+N.length);const tt=te.index.array,P=Le.index.array,y=Ne.index.array,k=tt.length+P.length+y.length,z=new Uint32Array(k);z.set(tt,0);for(let me=0;me<P.length;me++)z[tt.length+me]=P[me]+et;for(let me=0;me<y.length;me++)z[tt.length+P.length+me]=y[me]+et*2;const q=new mt;q.setAttribute("position",new ot(ht,3)),q.setAttribute("uv",new ot(Ve,2)),q.setAttribute("normal",new ot(at,3)),q.setIndex(new ot(z,1)),te.dispose(),Le.dispose(),Ne.dispose();const se=new Xe({color:5424730,roughness:.8,metalness:0,side:en,alphaTest:.04});se.customProgramCacheKey=()=>"grass_botw_aaa_v5",se.onBeforeCompile=me=>{me.uniforms.uTime={value:0},me.uniforms.uPlayerPos={value:new b(999,999,999)},this.grassUniforms=me.uniforms,me.vertexShader=["uniform float uTime;","uniform vec3  uPlayerPos;",me.vertexShader].join(`
`),me.vertexShader=me.vertexShader.replace("#include <begin_vertex>",`
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
          `),me.fragmentShader=me.fragmentShader.replace("#include <color_fragment>",`
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
          `)};const K=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?12e3:8e4,$=new Jh(q,se,K);$.frustumCulled=!1,$.castShadow=!1,$.receiveShadow=!0;const le=new pt;let Te=98765;const ie=()=>(Te=(Te*16807+0)%2147483647,(Te-1)/2147483646);let ce=0;const Pe=K*4;let De=0;for(;ce<K&&De<Pe;){De++;const me=(ie()-.5)*155,F=-110+ie()*145;if(me>-14&&me<14&&F>-55&&F<-20||Math.hypot(me-40,F+45)<17||Math.hypot(me+30,F-10)<8||Math.hypot(me+45,F+40)<8||me>-17&&me<17&&F>-58&&F<-17||Math.sin(me*.38)*Math.cos(F*.29)+Math.sin(me*.17+F*.22)*.6<-.5&&ie()>.15||Math.hypot(me,F+35)>65&&ie()>.55)continue;le.position.set(me+(ie()-.5)*.6,.01,F+(ie()-.5)*.6),le.rotation.set((ie()-.5)*.12,ie()*Math.PI*2,(ie()-.5)*.12);const oe=.45+ie()*1.15,pe=.55+ie()*.75;le.scale.set(pe,oe,pe),le.updateMatrix(),$.setMatrixAt(ce,le.matrix);const j=ie();let _e,he,Ge;j<.18?(_e=.3,he=.8,Ge=.36+ie()*.08):j<.34?(_e=.35,he=.65,Ge=.24+ie()*.08):j<.5?(_e=.27,he=.72,Ge=.4+ie()*.1):j<.63?(_e=.23,he=.58,Ge=.38+ie()*.08):j<.75?(_e=.25,he=.85,Ge=.44+ie()*.1):j<.88?(_e=.18,he=.65,Ge=.46+ie()*.1):(_e=.32,he=.5,Ge=.3+ie()*.06),$.setColorAt(ce,new Me().setHSL(_e,he,Ge)),ce++}$.instanceMatrix.needsUpdate=!0,$.instanceColor&&($.instanceColor.needsUpdate=!0),e.add($),console.log(`[Grass AAA] ✅ ${ce}/${K} blades placed in ${De} tries`)})();const c=-40,h=new ee(new ke(26,.4,26),s);h.position.set(0,.1,c),h.receiveShadow=!0,e.add(h),this.levelColliders.push(h);const u=5,d=new ee(new ke(.6,u,26),i);d.position.set(-13,u/2,c);const f=new ee(new ke(.6,u,26),i);f.position.set(13,u/2,c);const p=new ee(new ke(26,u,.6),i);p.position.set(0,u/2,c-13),e.add(d,f,p),this.levelColliders.push(d,f,p);const _=new ee(new ke(2,u,2),i);_.position.set(-6,u/2,c+13);const g=new ee(new ke(2,u,2),i);g.position.set(6,u/2,c+13),e.add(_,g),this.levelColliders.push(_,g);const m=new ee(new ke(26,.4,12),s);m.position.set(0,5,c-7),m.receiveShadow=!0,e.add(m),this.levelColliders.push(m);const S=new ee(new ke(9,.4,14),s);S.position.set(3.5,5,c+6),S.receiveShadow=!0,e.add(S),this.levelColliders.push(S);const M=new ee(new ke(10,3,.6),i);M.position.set(-8,6.5,c-5);const v=new ee(new ke(10,3,.6),i);v.position.set(8,6.5,c-5),e.add(M,v),this.levelColliders.push(M,v);const E=14;for(let Ze=0;Ze<E;Ze++){const Fe=Ze/(E-1),J=.1+Fe*4.9,re=-30-Fe*14,te=new ee(new ke(4,.4,1.5),i);te.position.set(-8,J,re),te.castShadow=!0,te.receiveShadow=!0,e.add(te)}const T=Math.hypot(14,4.9)+2,w=new ee(new ke(4.2,.35,T),new Mt({visible:!1}));w.position.set(-8,2.55,-37),w.rotation.x=Math.atan(4.9/14),e.add(w),this.levelColliders.push(w);const x=new ee(new ke(.4,1.2,26),i);x.position.set(-12.8,5.6,c);const R=new ee(new ke(.4,1.2,26),i);R.position.set(12.8,5.6,c);const I=new ee(new ke(26,1.2,.4),i);I.position.set(0,5.6,c-12.8),e.add(x,R,I),this.levelColliders.push(x,R,I);const L=new yt(6,6,5,12),D=new ee(L,i);D.position.set(0,7.5,c-4),D.castShadow=!0,D.receiveShadow=!0,e.add(D),this.levelColliders.push(D);const H=new ee(new yt(6.4,6.4,.4,12),s);H.position.set(0,10.2,c-4),e.add(H),this.levelColliders.push(H);const Y=3,O=22,X=5,B=new Xe({map:t,roughness:.85}),Q=new ee(new ke(Y,.3,O),B);Q.position.set(-15,X/2-.2,c+1),Q.rotation.x=Math.atan(X/O),Q.castShadow=!0,Q.receiveShadow=!0,e.add(Q),this.levelColliders.push(Q);const ne=new ly(new b(10,.2,c+10),new b(10,5,c+10),1.5,4,4);e.add(ne.mesh),this.movingPlatforms.push(ne),this.levelColliders.push(ne.mesh),[new b(11,5.8,c),new b(8.5,6.7,c+2),new b(6.5,7.6,c+4),new b(3.5,8.5,c+5.5),new b(0,9.2,c+6.5),new b(-3,9.7,c+5.5),new b(-5,10.1,c+3)].forEach(Ze=>{const Fe=new ee(new ke(2.5,.4,2.5),s);Fe.position.copy(Ze),Fe.castShadow=!0,Fe.receiveShadow=!0,e.add(Fe),this.levelColliders.push(Fe)});const de=new b(45,.1,-40),ye=new ee(new yt(15,15,.2,24),o);ye.position.copy(de),ye.receiveShadow=!0,e.add(ye),this.levelColliders.push(ye);const qe=new ke(4,1.5,1);for(let Ze=0;Ze<Math.PI*2;Ze+=Math.PI/6){const Fe=new ee(qe,i);Fe.position.set(de.x+Math.cos(Ze)*15,de.y+.6,de.z+Math.sin(Ze)*15),Fe.rotation.y=-Ze,e.add(Fe),this.levelColliders.push(Fe)}this.exitDoor=new $v("door_exit",new b(0,0,c-12.5),0,!0),e.add(this.exitDoor.mesh),this.doors.push(this.exitDoor),this.levelColliders.push(this.exitDoor.mesh),this.buildAncientRuinsAndLandmarks(),this.cameraController.setCollisionObjects(this.levelColliders),this.player.setColliders(this.levelColliders)}buildAncientRuinsAndLandmarks(){const e=this.sceneManager.scene,t=go.createStoneWallTexture();t.repeat.set(2,2);const n=new Xe({map:t,roughness:.85}),i=new lt;i.position.set(-30,0,10),e.add(i);const s=new ee(new ke(8,3,.8),n);s.position.set(0,1.5,0),i.add(s),this.levelColliders.push(s);const a=new ee(new yt(.6,.6,4,8),n);a.position.set(-3,2,3),i.add(a),this.levelColliders.push(a);const o=new ee(new yt(.5,.5,3.5,8),n);o.position.set(1,.5,2),o.rotation.set(0,Math.PI/4,Math.PI/2-.1),i.add(o),this.levelColliders.push(o);const l=new lt;l.position.set(-45,0,-40),e.add(l);for(let h=0;h<6;h++){const u=h/6*Math.PI*2,d=Math.cos(u)*5,f=Math.sin(u)*5,p=h%2===0?5:3.5,_=new ee(new yt(.5,.5,p,8),n);_.position.set(d,p/2,f),l.add(_),this.levelColliders.push(_)}const c=new ee(new ke(6,.6,1.2),n);c.position.set(Math.cos(.5/6*Math.PI*2)*5,4.8,Math.sin(.5/6*Math.PI*2)*5),c.rotation.y=-.5/6*Math.PI*2,l.add(c),this.levelColliders.push(c)}setupCheckpoints(){this.checkpointManager.addCheckpoint(0,new b(0,.2,10),0),this.checkpointManager.addCheckpoint(1,new b(25,.2,-40),-Math.PI/2),this.checkpointManager.addCheckpoint(2,new b(0,5.2,-40),0)}setupInteractiveProps(){const e=this.sceneManager.scene;this.staffChest=new ey(new b(0,5,-46),Math.PI),e.add(this.staffChest.mesh),this.chests.push(this.staffChest),this.spellSystem.registerChest(this.staffChest),this.levelColliders.push(this.staffChest.mesh),[new b(-10,0,5),new b(-20,0,-50),new b(12,5,-45),new b(45,0,-10),new b(-2,10.2,-44)].forEach(i=>{const s=new Qv(i,e),a=s.mesh.children[0].material;a&&(a.color.setHex(10564403),a.emissive.setHex(5574929),a.emissiveIntensity=.6),this.pots.push(s),this.spellSystem.registerPot(s),this.levelColliders.push(s.mesh),s.onDestruct=()=>{this.specialPotsSmashed++,this.audioManager.playPotionPickup(),this.subtitleSystem.show("Sistema",`¡Gema corrupta destruida! (${this.specialPotsSmashed}/${this.totalSpecialPots})`),this.specialPotsSmashed>=this.totalSpecialPots&&this.awardKey("key5_pots",new b(i.x,i.y+.5,i.z))}}),[{pos:new b(-12,0,-25),platforms:[]},{pos:new b(12,0,-48),platforms:[]},{pos:new b(-10,5,-48),platforms:[]},{pos:new b(30,0,-15),platforms:[]}].forEach(i=>{const s=new ty(i.pos,e,i.platforms);this.gargoyles.push(s),this.spellSystem.registerGargoyle(s);const a=s.activateLumos;s.activateLumos=(o,l)=>{s.isLit||(a.call(s,o,l),this.litGargoylesCount++,this.subtitleSystem.show("Sistema",`Gárgola iluminada (${this.litGargoylesCount}/4)`),this.litGargoylesCount>=4&&this.awardKey("key4_gargoyles",new b(0,.5,-35)))}})}setupCollectibles(){const e=[];for(let a=0;a<10;a++)e.push(new b(0,.5,8-a*2));for(let a=-8;a<=8;a+=4)for(let o=-48;o<=-35;o+=4)(a!==0||o!==-40)&&e.push(new b(a,.5,o));for(let a=0;a<6;a++)e.push(new b(-15,.5+a*.8,-29-a*2.2));e.push(new b(-8,5.5,-45)),e.push(new b(-4,5.5,-48)),e.push(new b(4,5.5,-48)),e.push(new b(8,5.5,-45)),e.push(new b(0,5.5,-33)),e.push(new b(2,5.5,-33)),e.push(new b(15,.5,-20)),e.push(new b(20,.5,-25)),e.push(new b(25,.5,-30)),e.push(new b(25,.5,-50)),e.push(new b(20,.5,-55)),e.push(new b(15,.5,-60)),e.push(new b(45,.5,-30)),e.push(new b(35,.5,-40)),e.push(new b(55,.5,-40)),e.push(new b(45,.5,-50)),e.push(new b(40,.5,-45)),e.push(new b(50,.5,-35)),e.push(new b(11,7,-45)),e.push(new b(8,8.5,-52)),e.push(new b(0,9.7,-53)),e.push(new b(0,10.7,-44)),e.push(new b(-4,10.7,-44)),e.push(new b(4,10.7,-44)),e.push(new b(-30,.5,10)),e.push(new b(-27,.5,13)),e.push(new b(-32,.5,7)),e.push(new b(-45,.5,-40)),e.push(new b(-45,.5,-35)),e.push(new b(-40,.5,-40)),e.push(new b(-45,5.2,-40));const t=50,n=e.slice(0,t);for(;n.length<t;)n.push(new b((Math.random()-.5)*50,.5,-20-Math.random()*30));console.log(`[COINS] Initializing spawn sequence for EXACTLY ${n.length}/${t} Lisar Coins.`);let i=0;const s=()=>{if(i>=n.length){console.log(`[COINS] Spawned: ${n.length}/${t}`);return}const a=n[i];this.createSparks(a),this.collectibleSystem.spawnCoin(`coin_${i}`,a),this.audioManager.playCoinSpawnHarmonic(i),i++,setTimeout(s,40)};s()}setupNPCs(){this.gekkoNPC=new oy(new b(-4,0,-10),-Math.PI*.25),this.gekkoNPC.loadModels(),this.sceneManager.scene.add(this.gekkoNPC.mesh);const e=new ee(new yt(.6,.6,2),new Mt({visible:!1}));e.position.copy(this.gekkoNPC.mesh.position),this.sceneManager.scene.add(e),this.levelColliders.push(e),this.floatingCoinMesh=new lt,this.floatingCoinMesh.position.set(-4,1.4,-10),this.floatingCoinMesh.scale.set(.6,.6,.6),this.floatingCoinMesh.visible=!1,this.sceneManager.scene.add(this.floatingCoinMesh),new or().load("/magic-academy-3d/assets/collectibles/lisar coin.glb?v=7",n=>{this.floatingCoinMesh.add(n.scene.clone()),this.collectibleSystem.coinTemplate=n.scene},void 0,n=>{console.warn("Failed to load LISAR coin",n)})}setupEnemies(){const e=this.sceneManager.scene,t=new ns("crab_1",new b(-30,0,-25),[new b(-40,0,-25),new b(-20,0,-25)]),n=new ns("crab_2",new b(25,0,-25),[new b(15,0,-25),new b(35,0,-25)]),i=new ns("crab_3",new b(0,0,-65),[new b(-10,0,-65),new b(10,0,-65)]),s=new ns("crab_second_floor_1",new b(-6,5,-40)),a=new ns("crab_second_floor_2",new b(6,5,-40));this.bossEnemy=new ns("crab_boss",new b(45,.1,-40)),this.enemies.push(t,n,i,s,a,this.bossEnemy),this.enemies.forEach(o=>{const l=o.id==="crab_boss"?3.5:1;o.loadModel(l),o.setScene(e),e.add(o.mesh),this.spellSystem.registerEnemy(o),o.id==="crab_boss"&&(o.health=5,o.maxHealth=5,o.attackDmg=25,o.arenaCenter=new b(45,.1,-40),o.arenaRadius=15),o.onAttackPlayer=c=>{var d;const h=this.checkpointManager.getActiveCheckpointPosition();this.player.takeDamage(c,h),this.audioManager.playPlayerHurt();const u=(d=window.gameInstance)==null?void 0:d.hud;u&&u.triggerDamageFlash()},o.onDeath=async()=>{var c;if(o.id==="crab_boss"){if(console.log("[BOSS] HP: 0 -> Entering DYING state. Defeat sequence started."),this.isCinematicPlaying)return;this.isCinematicPlaying=!0,this.enemies.forEach(f=>{f.id!=="crab_boss"&&(f.isPaused=!0)});const h=(c=window.gameInstance)==null?void 0:c.cinematicCamera;if(h){const f=o.mesh.position.clone(),p=f.clone().add(new b(-6,3.5,6)),_=f.clone().add(new b(0,.5,0));h.moveCamera(p,p,_,_,999)}this.subtitleSystem.show("Jefe Cangrejo","¡El Jefe Cangrejo ha sido derrotado!"),await new Promise(f=>setTimeout(f,1e3)),console.log("[BOSS] Reward key spawned — flying to player");const u=this.keyDefinitions.key2_boss,d=o.mesh.position.clone().add(new b(0,1.2,0));await Qr.runSequence(u,d,this.player,this.sceneManager.scene,()=>{console.log("[BOSS] Death sequence completed — gameplay resumed"),this.awardKey("key2_boss"),h&&h.abort(),this.enemies.forEach(f=>f.isPaused=!1),this.isCinematicPlaying=!1})}}})}spawnKeysInWorld(){this.spawn3DKey("key3_platform",new b(0,10.8,-44))}spawn3DKey(e,t){const n=this.sceneManager.scene,i=new lt;i.position.copy(t),i.name=e;let s=16766720,a=16755200;e==="key1_gekko"?(s=65416,a=52326):e==="key2_boss"?(s=16724736,a=16755200):e==="key3_platform"?(s=58879,a=49151):e==="key4_gargoyles"?(s=11032055,a=9647082):e==="key5_pots"&&(s=16753920,a=16746496);const o=new Xe({color:s,emissive:a,emissiveIntensity:1,metalness:.85,roughness:.2}),l=new ee(new ii(.26,.08,12,24),o);l.rotation.x=Math.PI/2;const c=new ee(new yt(.06,.06,.65,12),o);c.position.y=-.35;const h=new ee(new ke(.18,.12,.06),o);h.position.set(.12,-.55,0);const u=new ee(new ke(.12,.08,.06),o);u.position.set(.1,-.42,0);const d=new sn(a,3.5,5.5);d.position.set(0,0,0),i.add(d),i.add(l,c,h,u),n.add(i),this.keysMeshes.push(i),console.log(`[LevelToyStory] ✅ Spawned 3D Key '${e}' at`,t)}awardKey(e,t){var s;if(this.collectedKeys[e])return;this.collectedKeys[e]=!0,t&&this.createSparks(t),this.audioManager.playCardPickup(),this.totalKeysCount++;const n=(s=window.gameInstance)==null?void 0:s.hud;n&&n.setKeyCount(this.totalKeysCount);let i="";e==="key1_gekko"&&(i="Llave de Gekko (Monedas)"),e==="key2_boss"&&(i="Llave de Combate (Jefe Cangrejo)"),e==="key3_platform"&&(i="Llave de Plataformas (Tejado)"),e==="key4_gargoyles"&&(i="Llave del Secreto (Gárgolas)"),e==="key5_pots"&&(i="Llave de Destrucción (Gemas)"),this.subtitleSystem.show("LISAR",`¡Has obtenido la ${i}! (${this.totalKeysCount}/5)`),this.totalKeysCount>=2&&this.exitDoor&&!this.exitDoor.isOpen&&(this.exitDoor.open(),this.subtitleSystem.show("LISAR","¡Portón Abierto! El portal de salida en el castillo trasero está desbloqueado."))}createSparks(e){const t=new mt,n=25,i=new Float32Array(n*3),s=[];for(let h=0;h<n;h++)i[h*3]=e.x+(Math.random()-.5)*.8,i[h*3+1]=e.y+Math.random()*.8,i[h*3+2]=e.z+(Math.random()-.5)*.8,s.push((Math.random()-.5)*3,Math.random()*3+2,(Math.random()-.5)*3);t.setAttribute("position",new ot(i,3));const a=new yi({color:4060159,size:.15,transparent:!0}),o=new Fi(t,a);this.sceneManager.scene.add(o);let l=0;const c=()=>{if(l+=.016,l>.6){this.sceneManager.scene.remove(o),t.dispose(),a.dispose();return}const h=t.attributes.position.array;for(let u=0;u<n;u++)h[u*3]+=s[u*3]*.016,h[u*3+1]+=s[u*3+1]*.016,h[u*3+2]+=s[u*3+2]*.016,s[u*3+1]-=9.8*.016;t.attributes.position.needsUpdate=!0,a.opacity=1-l/.6,requestAnimationFrame(c)};c()}setupTriggers(){const e=new Wr("trig_intro",new b(-8,-1,5),new b(8,5,15),()=>{var s;this.stateFlags.introCompleted||(this.stateFlags.introCompleted=!0,this.subtitleSystem.show("Sistema","Explora el mapa para conseguir las 5 llaves. Empieza buscando tu báculo en el cofre dentro del castillo."),(s=window.gameInstance)==null||s.hud.setObjective("Consigue las 5 llaves para abrir el portal"))});this.triggerZones.push(e);const t=new Wr("trig_boss_arena",new b(26,-1,-47),new b(34,6,-33),()=>{this.stateFlags.bossCinematicPlayed||(this.stateFlags.bossCinematicPlayed=!0,this.runBossCinematic())});this.triggerZones.push(t);const n=new Wr("trig_gekko",new b(-7,-1,-13),new b(-1,5,-7),async()=>{if(!this.isCinematicPlaying)if(this.gekkoMissionState==="NOT_STARTED")this.gekkoMissionState="MISSION_ACTIVE",this.stateFlags.gekkoTalked=!0,console.log("[GEKKO] State transition: NOT_STARTED -> MISSION_ACTIVE"),this.runGekkoCinematic();else if(this.gekkoMissionState==="MISSION_COMPLETE")console.log("[GEKKO] Triggering 2nd cinematic for 50 coins reward..."),this.runGekkoSecondCinematic();else if(this.gekkoMissionState==="MISSION_ACTIVE"){const s=this.collectibleSystem.coinCount;s>=50?(this.gekkoMissionState="MISSION_COMPLETE",console.log("[GEKKO] State transition: MISSION_ACTIVE -> MISSION_COMPLETE"),this.runGekkoSecondCinematic()):this.subtitleSystem.show("Gekko",`Aún no tienes las 50 monedas Lisar (tienes ${s}/50). ¡Búscalas por todo el escenario!`)}else this.gekkoMissionState==="REWARD_GIVEN"&&this.subtitleSystem.show("Gekko","¡Gracias por ayudarme con las 50 Lisar Coins! Usa esa llave para abrir el portón principal.")});this.triggerZones.push(n);const i=new Wr("trig_exit",new b(-5,-1,-54),new b(5,5,-50),()=>{var s;!this.stateFlags.levelCompleted&&this.exitDoor.isOpen&&(this.stateFlags.levelCompleted=!0,(s=window.gameInstance)==null||s.hud.showVictoryScreen(5,"05:00"),document.exitPointerLock())});this.triggerZones.push(i)}async runGekkoCinematic(){var n,i;const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(e&&t){this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(-4,0,-7.5),this.player.mesh.rotation.set(0,Math.PI,0),this.player.forceIdle(),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,0,0),this.gekkoNPC.setTalking(!0),this.floatingCoinMesh.position.set(-4,1.4,-8.7),this.floatingCoinMesh.visible=!0,this.subtitleSystem.hide();const s=new b(-1.5,1.25,-8.75),a=new b(-4,1.1,-8.75);e.moveCamera(s,s,a,a,999),await t.fadeScreenIn(500);let o=!1;const l=async()=>{o||(o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(500),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.gekkoNPC.setTalking(!1),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,-Math.PI*.25,0),this.floatingCoinMesh.visible=!1,this.enemies.forEach(h=>h.isPaused=!1),await t.fadeScreenIn(500))},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Gekko","¡Hola viajero! Consigue 50 monedas LISAR del mapa y te entregaré una de las cinco llaves mágicas del portal.",()=>{o||setTimeout(()=>{o||l()},4e3)})}}async runGekkoSecondCinematic(){var n,i;if(this.isCinematicPlaying)return;this.isCinematicPlaying=!0,console.log("[GEKKO] Mission state: COMPLETE -> Starting Reward Cinematic");const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(e&&t){this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(-4,0,-7.5),this.player.mesh.rotation.set(0,Math.PI,0),this.player.forceIdle(),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,0,0),this.gekkoNPC.setTalking(!0),this.floatingCoinMesh&&(this.floatingCoinMesh.visible=!1);const s=new b(-1.5,1.25,-8.75),a=new b(-4,1.1,-8.75);e.moveCamera(s,s,a,a,999),this.subtitleSystem.hide(),await t.fadeScreenIn(500);let o=!1;const l=async()=>{if(o)return;o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(400),e.abort(),this.gekkoNPC.setTalking(!1),this.gekkoNPC.mesh.position.set(-4,0,-10),this.gekkoNPC.mesh.rotation.set(0,-Math.PI*.25,0);const h=document.getElementById("gekko-quest-complete");h&&h.classList.add("hidden"),await t.fadeScreenIn(400),console.log("[GEKKO] Wealth Key given");const u=this.keyDefinitions.key1_gekko,d=new b(-4,1.2,-8.7);await Qr.runSequence(u,d,this.player,this.sceneManager.scene,()=>{this.gekkoMissionState="REWARD_GIVEN",this.coinsExchanged=!0,this.awardKey("key1_gekko"),this.enemies.forEach(f=>f.isPaused=!1),this.isCinematicPlaying=!1,console.log("[GEKKO] Mission completed — REWARD_GIVEN state set")})},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Gekko","Vaya... realmente las encontraste todas.",()=>{o||t.showTypewriterDialogue("Gekko","Las 50 Lisar Coins. No pensé que alguien fuera capaz de reunirlas.",()=>{o||t.showTypewriterDialogue("Gekko","Cumpliste tu parte del trato. Esta Llave de la Riqueza ahora te pertenece.",()=>{o||setTimeout(()=>{o||l()},2500)})})})}else this.isCinematicPlaying=!1}update(e,t){var n,i,s;this.grassUniforms&&(this.grassUniforms.uTime.value=performance.now()/1e3,this.grassUniforms.uPlayerPos&&this.grassUniforms.uPlayerPos.value.copy(t)),this.cloudsUniforms&&(this.cloudsUniforms.uTime.value=performance.now()/1e3),this.movingPlatforms.forEach(a=>a.update(e)),this.triggerZones.forEach(a=>a.check(t)),this.doors.forEach(a=>a.update(e)),this.gekkoNPC&&this.gekkoNPC.update(e),this.floatingCoinMesh&&this.floatingCoinMesh.visible&&(this.floatingCoinMesh.rotation.y+=e*2,this.floatingCoinMesh.position.y=1.4+Math.sin(Date.now()/300)*.08);for(let a=this.keysMeshes.length-1;a>=0;a--){const o=this.keysMeshes[a];if(o.rotation.y+=e*2,o.position.y+=Math.sin(Date.now()*.003)*.001,o.position.distanceTo(t)<1.4&&!this.player.isControlsLocked&&!this.isCinematicPlaying){const l=o.name,c=o.position.clone(),h=this.keyDefinitions[l]||{id:l,name:"Llave Mágica",color:16766720,emissiveColor:16755200,obtained:!1};this.sceneManager.scene.remove(o),this.keysMeshes.splice(a,1),Qr.runSequence(h,c,this.player,this.sceneManager.scene,()=>{this.awardKey(l,c)})}}if(this.enemies.forEach(a=>{a.isAlive()&&a.update(e,t,this.levelColliders)}),this.collectibleSystem.update(t,e,()=>{},a=>{var l;const o=(l=window.gameInstance)==null?void 0:l.hud;o&&(o.setCoinCount(a),a>=50&&!this.coinsExchanged&&this.subtitleSystem.show("Sistema","¡Tienes 50 monedas LISAR! Ve a hablar con Gekko."))}),!this.stateFlags.staffFound&&this.staffChest.mesh.position.distanceTo(t)<2){const a=(n=window.gameInstance)==null?void 0:n.hud;a==null||a.showInteractionPrompt("Abrir Cofre"),this.inputManager.keys.KeyE&&!this.staffChest.isUnlocked&&(this.stateFlags.staffFound=!0,this.staffChest.isUnlocked=!0,a==null||a.hideInteractionPrompt(),this.enemies.forEach(l=>l.isPaused=!0),this.staffChest.unlock(this.audioManager,this.collectibleSystem,()=>{this.player.equipStaff(this.sceneManager.scene),this.subtitleSystem.show("Báculo Mágico","¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.")}),new ay({scene:this.sceneManager.scene,player:this.player,chestPosition:this.staffChest.mesh.position.clone(),hud:{fadeScreenOut:l=>a.fadeScreenOut(l),fadeScreenIn:l=>a.fadeScreenIn(l),setObjective:l=>a.setObjective(l)},onComplete:()=>{console.log("[LevelToyStory] Staff cinematic complete — gameplay resumes."),this.enemies.forEach(l=>l.isPaused=!1)}}).run().catch(l=>{console.error("[LevelToyStory] ChestCinematic error:",l),this.player.isMovementLocked=!1,this.enemies.forEach(c=>c.isPaused=!1)}))}else(s=(i=window.gameInstance)==null?void 0:i.hud)==null||s.hideInteractionPrompt()}async runBossCinematic(){var n,i;const e=(n=window.gameInstance)==null?void 0:n.cinematicCamera,t=(i=window.gameInstance)==null?void 0:i.hud;if(!(!e||!t))try{this.enemies.forEach(h=>h.isPaused=!0),await t.fadeScreenOut(500),this.player.isControlsLocked=!0,this.player.isMovementLocked=!0,this.player.mesh.position.set(35,.1,-40),this.player.mesh.rotation.set(0,Math.PI/2,0),this.player.forceIdle(),this.bossEnemy.mesh.position.set(48,.1,-40),this.bossEnemy.mesh.rotation.set(0,-Math.PI/2,0),this.bossEnemy.isPaused=!1,this.bossEnemy.state="IDLE";const s=new b(41.5,2.5,-46),a=new b(41.5,1.2,-40);e.moveCamera(s,s,a,a,999),this.subtitleSystem.hide(),await t.fadeScreenIn(500);let o=!1;const l=async()=>{o||(o=!0,window.removeEventListener("keydown",c),t.hideDialogue(),await t.fadeScreenOut(500),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.enemies.forEach(h=>h.isPaused=!1),await t.fadeScreenIn(500))},c=h=>{(h.code==="Space"||h.code==="Enter"||h.code==="Escape")&&l()};window.addEventListener("keydown",c),t.showTypewriterDialogue("Jefe Cangrejo","¡Cuidado! Este cangrejo gigante acorazado es inmune a tus ataques normales. ¡Espera a que intente embestirte, esquívalo, y golpéalo por detrás mientras esté aturdido!",()=>{o||setTimeout(()=>{o||l()},7e3)})}catch(s){console.error("[Boss Cinematic] Error during cinematic, performing emergency cleanup:",s),e.abort(),this.player.isControlsLocked=!1,this.player.isMovementLocked=!1,this.enemies.forEach(a=>a.isPaused=!1),t.hideDialogue()}}}class hy{constructor(e){C(this,"sceneManager");C(this,"inputManager");C(this,"mobileInputManager");C(this,"audioManager");C(this,"assetManager");C(this,"hud");C(this,"subtitleSystem");C(this,"player");C(this,"animationController");C(this,"cameraController");C(this,"cinematicCamera");C(this,"cinematicManager");C(this,"spellSystem");C(this,"checkpointManager");C(this,"collectibleSystem");C(this,"level01");C(this,"lastFrameTime",0);C(this,"frameCount",0);C(this,"lastFpsCalcTime",0);C(this,"currentFps",60);C(this,"isPaused",!1);this.sceneManager=new yx(e),this.inputManager=new Mx(e),this.mobileInputManager=new bx(this.inputManager),this.audioManager=new wx,this.assetManager=new Gv,this.hud=new ry,this.subtitleSystem=new Yv,this.initUIListeners()}async start(){console.log("[Game] Initializing 3D Magic Academy Vertical Slice...");const e=await this.assetManager.loadPlayerModel();this.sceneManager.scene.add(e.model),this.animationController=new Wv(e.model,e.clips),this.player=new qv(e.model,this.animationController),this.cameraController=new Hv(this.sceneManager.camera),this.cinematicCamera=new Kv(this.sceneManager.camera),this.cinematicManager=new Zv(this.cinematicCamera,this.cameraController,this.player,this.subtitleSystem,this.audioManager),this.spellSystem=new iy(this.sceneManager.scene,this.audioManager),this.checkpointManager=new sy,this.collectibleSystem=new jv(this.sceneManager.scene,this.audioManager),this.level01=new cy(this.sceneManager,this.cameraController,this.player,this.inputManager,this.spellSystem,this.checkpointManager,this.collectibleSystem,this.subtitleSystem,this.audioManager),this.level01.init(),this.cameraController.setTarget(this.player.mesh),this.player.onHealthChange=(t,n)=>this.hud.setHealth(t,n),this.spellSystem.onCollectStaffCallback=()=>{this.player.equipStaff(),this.subtitleSystem.show("Báculo Mágico","¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.")},this.inputManager.onLeftClick=()=>{if(this.player.hasStaff&&!this.player.isControlsLocked&&!this.player.isAttacking){const t=this.spellSystem.activeSpell==="ALOHOMORA"||this.spellSystem.activeSpell==="LUMOS"?15:10;if(this.player.mana>=t){this.player.isAttacking=!0;const n=this.cameraController.getForwardVector(),i=Math.atan2(n.x,n.z);this.player.mesh.rotation.y=i,this.player.attachStaffToHand(),this.animationController.playCastSpellAnimation(()=>{if(this.player.useMana(t)){const s=this.player.getSpellLaunchPosition(),a=this.cameraController.getForwardVector(),o=this.cameraController.camera.position,l=this.spellSystem.getAimedDirection(s,o,a);this.spellSystem.castActiveSpell(s,l)}},()=>{this.player.attachStaffToBack(),this.player.isAttacking=!1})}}},this.inputManager.onKick=()=>{if(console.log("[Game] onKick callback triggered. HasStaff:",this.player.hasStaff,"isControlsLocked:",this.player.isControlsLocked,"isAttacking:",this.player.isAttacking),!this.player.hasStaff&&!this.player.isControlsLocked&&!this.player.isAttacking){this.player.isAttacking=!0,this.player.isMovementLocked=!0,this.player.isControlsLocked=!0,this.player.velocity.set(0,0,0);let t=null,n=1/0;const i=this.player.mesh.position,s=new b(0,0,1).applyQuaternion(this.player.mesh.quaternion);if(this.level01.enemies.forEach(a=>{if(a.isAlive()){const l=a.getPosition().clone().sub(i),c=l.length();if(c<4.5){l.normalize();const h=s.dot(l),u=Math.acos(Math.max(-1,Math.min(1,h)));if(u<1.22||c<1.5&&u<1.91){const d=c*(1+u);d<n&&(n=d,t=a)}}}}),t){const o=t.getPosition().clone().sub(i);o.y=0;const l=o.length();if(l>.001){o.divideScalar(l);let h=Math.atan2(o.x,o.z)-this.player.mesh.rotation.y;for(;h<-Math.PI;)h+=Math.PI*2;for(;h>Math.PI;)h-=Math.PI*2;const u=Math.PI/4,d=Math.max(-u,Math.min(u,h));this.player.mesh.rotation.y+=d,console.log("[Game] Soft Assist applied. Rotating Wukong by",(d*180/Math.PI).toFixed(1),"deg")}}this.animationController.playWukongKick(()=>{const a=this.player.mesh.position,o=new b(0,0,1).applyQuaternion(this.player.mesh.quaternion);this.level01.enemies.forEach(l=>{if(l.isAlive()){const c=l.getPosition(),h=a.distanceTo(c),u=l.id==="crab_boss"?4.5:2.2;if(h<u){const d=c.clone().sub(a);d.lengthSq()>1e-4?d.normalize():d.copy(o),(o.dot(d)>.35||l.id==="crab_boss")&&(l.takeHit(a),this.spellSystem.createImpactParticles(c.clone().add(new b(0,.5,0)),16753920))}}})},()=>{this.player.isAttacking=!1,this.player.isMovementLocked=!1,this.player.isControlsLocked=!1})}},this.inputManager.onSelectSpell=t=>{const n=["FLIPENDO","ALOHOMORA","LUMOS"],i=n[t%n.length]||"FLIPENDO";this.spellSystem.setActiveSpell(i),this.hud.setActiveSpellSlot(i)},this.inputManager.onSkipSubtitle=()=>{this.cinematicManager.requestSkip()},this.inputManager.onToggleDebug=()=>{this.hud.toggleDebug()},this.inputManager.onPointerLockChange=t=>{var i,s,a,o;if(t&&this.audioManager.resume(),!((s=(i=this.level01)==null?void 0:i.stateFlags)!=null&&s.introCompleted)||(o=(a=this.level01)==null?void 0:a.stateFlags)!=null&&o.levelCompleted)return;this.isPaused=!t;const n=document.getElementById("pause-screen");this.isPaused?n==null||n.classList.remove("hidden"):n==null||n.classList.add("hidden")},this.lastFrameTime=performance.now(),requestAnimationFrame(t=>this.loop(t))}initUIListeners(){const e=document.getElementById("btn-start"),t=document.getElementById("start-screen"),n=document.getElementById("btn-replay"),i=document.getElementById("btn-continue"),s=document.getElementById("btn-resume"),a=document.getElementById("btn-replay-pause"),o=document.getElementById("btn-exit-pause");e==null||e.addEventListener("click",()=>{t==null||t.classList.add("hidden"),this.audioManager.resume(),this.inputManager.requestPointerLock(),this.audioManager.startBGM(),this.hud.showGameplayHUD()}),n==null||n.addEventListener("click",()=>{window.location.reload()}),i==null||i.addEventListener("click",()=>{window.location.reload()}),s==null||s.addEventListener("click",()=>{this.audioManager.resume(),this.inputManager.requestPointerLock()}),a==null||a.addEventListener("click",()=>{window.location.reload()}),o==null||o.addEventListener("click",()=>{window.location.reload()})}loop(e){const t=Math.min(.1,(e-this.lastFrameTime)/1e3);this.lastFrameTime=e,this.isPaused||this.update(t),this.sceneManager.render(),this.frameCount++,e-this.lastFpsCalcTime>=1e3&&(this.currentFps=this.frameCount,this.frameCount=0,this.lastFpsCalcTime=e),requestAnimationFrame(n=>this.loop(n))}update(e){this.cinematicCamera.isActive()?(this.cinematicCamera.update(e),this.player.update(e,this.inputManager,this.cameraController)):(this.player.update(e,this.inputManager,this.cameraController),this.cameraController.update(e,this.inputManager)),this.spellSystem.update(e,this.level01.levelColliders),this.spellSystem.updateTargetLockon(this.cameraController.camera.position,this.cameraController.getForwardVector()),this.level01.update(e,this.player.mesh.position),this.player.hasStaff&&document.pointerLockElement?this.hud.showReticle(!0):this.hud.showReticle(!1),this.hud.updateDebugStats(this.currentFps,this.player.mesh.position.x,this.player.mesh.position.y,this.player.mesh.position.z,this.player.isGrounded?"Grounded":"Airborne",this.animationController.getCurrentState(),this.checkpointManager.getCurrentCheckpointId())}}window.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("game-canvas");if(r){const e=new hy(r);window.gameInstance=e,e.start()}});
