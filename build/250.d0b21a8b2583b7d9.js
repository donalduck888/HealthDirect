"use strict";(self.webpackChunkfuse=self.webpackChunkfuse||[]).push([[250],{6236:(y,p,e)=>{e.d(p,{J:()=>t});var c=e(1281),x=e(8288),n=e(4650),g=e(6895);function h(o,a){1&o&&(n.ynx(0),n.TgZ(1,"div",1),n.Hsn(2),n.qZA(),n.TgZ(3,"div",2),n.Hsn(4,1),n.qZA(),n.BQk())}function m(o,a){1&o&&(n.TgZ(0,"div",4),n.Hsn(1,3),n.qZA()),2&o&&n.Q6J("@expandCollapse",void 0)}function v(o,a){if(1&o&&(n.ynx(0),n.Hsn(1,2),n.YNc(2,m,2,1,"div",3),n.BQk()),2&o){const r=n.oxw();n.xp6(2),n.Q6J("ngIf",r.expanded)}}const b=[[["","fuseCardFront",""]],[["","fuseCardBack",""]],"*",[["","fuseCardExpansion",""]]];class u{constructor(){this.expanded=!1,this.face="front",this.flippable=!1}get classList(){return{"fuse-card-expanded":this.expanded,"fuse-card-face-back":this.flippable&&"back"===this.face,"fuse-card-face-front":this.flippable&&"front"===this.face,"fuse-card-flippable":this.flippable}}ngOnChanges(a){"expanded"in a&&(this.expanded=(0,c.Ig)(a.expanded.currentValue)),"flippable"in a&&(this.flippable=(0,c.Ig)(a.flippable.currentValue))}}u.\u0275fac=function(a){return new(a||u)},u.\u0275cmp=n.Xpm({type:u,selectors:[["fuse-card"]],hostVars:2,hostBindings:function(a,r){2&a&&n.Tol(r.classList)},inputs:{expanded:"expanded",face:"face",flippable:"flippable"},exportAs:["fuseCard"],features:[n.TTD],ngContentSelectors:["[fuseCardFront]","[fuseCardBack]","*","[fuseCardExpansion]"],decls:2,vars:2,consts:[[4,"ngIf"],[1,"fuse-card-front"],[1,"fuse-card-back"],["class","fuse-card-expansion",4,"ngIf"],[1,"fuse-card-expansion"]],template:function(a,r){1&a&&(n.F$t(b),n.YNc(0,h,5,0,"ng-container",0),n.YNc(1,v,3,1,"ng-container",0)),2&a&&(n.Q6J("ngIf",r.flippable),n.xp6(1),n.Q6J("ngIf",!r.flippable))},dependencies:[g.O5],styles:["fuse-card{position:relative;display:flex;overflow:hidden;--tw-bg-opacity: 1;background-color:rgba(var(--fuse-bg-card-rgb),var(--tw-bg-opacity));border-radius:1rem;--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}fuse-card.fuse-card-flippable{border-radius:0;overflow:visible;transform-style:preserve-3d;transition:transform 1s;perspective:600px;background:transparent;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}fuse-card.fuse-card-flippable.fuse-card-face-back .fuse-card-front{visibility:hidden;opacity:0;transform:rotateY(180deg)}fuse-card.fuse-card-flippable.fuse-card-face-back .fuse-card-back{visibility:visible;opacity:1;transform:rotateY(360deg)}fuse-card.fuse-card-flippable .fuse-card-front,fuse-card.fuse-card-flippable .fuse-card-back{display:flex;flex-direction:column;flex:1 1 auto;z-index:10;transition:transform .5s ease-out 0s,visibility 0s ease-in .2s,opacity 0s ease-in .2s;-webkit-backface-visibility:hidden;backface-visibility:hidden;--tw-bg-opacity: 1;background-color:rgba(var(--fuse-bg-card-rgb),var(--tw-bg-opacity));border-radius:1rem;--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}fuse-card.fuse-card-flippable .fuse-card-front{position:relative;opacity:1;visibility:visible;transform:rotateY(0);overflow:hidden}fuse-card.fuse-card-flippable .fuse-card-back{position:absolute;inset:0;opacity:0;visibility:hidden;transform:rotateY(180deg);overflow:hidden auto}\n"],encapsulation:2,data:{animation:x.L}});class t{}t.\u0275fac=function(a){return new(a||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[g.ez]})},5250:(y,p,e)=>{e.r(p),e.d(p,{AuthSignOutModule:()=>f});var c=e(9299),x=e(4859),n=e(6236),g=e(4466),h=e(7579),m=e(5963),v=e(8746),b=e(2529),w=e(2722),u=e(8505),t=e(4650),o=e(8781),a=e(6895);function r(i,s){if(1&i&&(t.ynx(0),t._uU(1),t.ALo(2,"i18nPlural"),t.BQk()),2&i){const d=t.oxw();t.xp6(1),t.hij(" Redirecting in ",t.xi3(2,1,d.countdown,d.countdownMapping)," ")}}function C(i,s){1&i&&(t.ynx(0),t._uU(1," You are now being redirected! "),t.BQk())}const A=function(){return["/sign-in"]};class l{constructor(s,d){this._authService=s,this._router=d,this.countdown=5,this.countdownMapping={"=1":"# second",other:"# seconds"},this._unsubscribeAll=new h.x}ngOnInit(){this._authService.signOut(),(0,m.H)(1e3,1e3).pipe((0,v.x)(()=>{this._router.navigate(["sign-in"])}),(0,b.o)(()=>this.countdown>0),(0,w.R)(this._unsubscribeAll),(0,u.b)(()=>this.countdown--)).subscribe()}ngOnDestroy(){this._unsubscribeAll.next(null),this._unsubscribeAll.complete()}}l.\u0275fac=function(s){return new(s||l)(t.Y36(o.e),t.Y36(c.F0))},l.\u0275cmp=t.Xpm({type:l,selectors:[["auth-sign-out"]],decls:15,vars:4,consts:[[1,"flex","flex-col","flex-auto","items-center","sm:justify-center","min-w-0"],[1,"w-full","sm:w-auto","py-8","px-4","sm:p-12","sm:rounded-2xl","sm:shadow","sm:bg-card"],[1,"w-full","max-w-80","sm:w-80","mx-auto","sm:mx-0"],[1,"w-12","mx-auto"],["src","assets/images/logo/logo.svg"],[1,"mt-8","text-4xl","font-extrabold","tracking-tight","leading-tight","text-center"],[1,"flex","justify-center","mt-0.5","font-medium"],[4,"ngIf"],[1,"mt-8","text-md","font-medium","text-secondary","text-center"],[1,"ml-1","text-primary-500","hover:underline",3,"routerLink"]],template:function(s,d){1&s&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),t._UZ(4,"img",4),t.qZA(),t.TgZ(5,"div",5),t._uU(6,"You have signed out!"),t.qZA(),t.TgZ(7,"div",6),t.YNc(8,r,3,4,"ng-container",7),t.YNc(9,C,2,0,"ng-container",7),t.qZA(),t.TgZ(10,"div",8)(11,"span"),t._uU(12,"Go to"),t.qZA(),t.TgZ(13,"a",9),t._uU(14,"sign in "),t.qZA()()()()()),2&s&&(t.xp6(8),t.Q6J("ngIf",d.countdown>0),t.xp6(1),t.Q6J("ngIf",0===d.countdown),t.xp6(4),t.Q6J("routerLink",t.DdM(3,A)))},dependencies:[c.rH,a.O5,a.Gx],encapsulation:2});const T=[{path:"",component:l}];class f{}f.\u0275fac=function(s){return new(s||f)},f.\u0275mod=t.oAB({type:f}),f.\u0275inj=t.cJS({imports:[c.Bz.forChild(T),x.ot,n.J,g.m]})}}]);