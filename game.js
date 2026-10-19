// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.

(function () {
var GW = 800;
var GH = 600;

// DO NOT replace existing keys — they match the physical arcade cabinet wiring.
// To add local testing shortcuts, append extra keys to any array.
const CABINET_KEYS = {
  P1_U: ['w'],
  P1_D: ['s'],
  P1_L: ['a'],
  P1_R: ['d'],
  P1_1: ['u'],
  P1_2: ['i'],
  P1_3: ['o'],
  P1_4: ['j'],
  P1_5: ['k'],
  P1_6: ['l'],
  P2_U: ['ArrowUp'],
  P2_D: ['ArrowDown'],
  P2_L: ['ArrowLeft'],
  P2_R: ['ArrowRight'],
  P2_1: ['r'],
  P2_2: ['t'],
  P2_3: ['y'],
  P2_4: ['f'],
  P2_5: ['g'],
  P2_6: ['h'],
  START1: ['Enter'],
  START2: ['2'],
};

const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keys] of Object.entries(CABINET_KEYS)) {
  for (const key of keys) {
    KEYBOARD_TO_ARCADE[normalizeIncomingKey(key)] = arcadeCode;
  }
}

function normalizeIncomingKey(key) {
  if (typeof key !== 'string' || key.length === 0) return '';
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

// @@ASSETS
var ART = {
"atlas": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Yo   ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~  !qhV   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        5V   e    #r#<vi8:    Cg,2    )ZBSR$Nw       Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: +_fG:CuO> &!YO2vV7LNc,;.@QiQq$?ImL=?c@tKfg)6bzEoicam1zTk54f*SVT_`t3cW&79Sxh)bO.@&nKThf=Qs=p.xn)lf6#[O iDQ;tt]Xh8OoYK0$Zo_N[k|z4FJ?j4lf2g+{N0d;slrd6HK+ alVaxB#5#-lMcNZIjq>Nm ,HuMnwxQ')HZ,LQ:g9=RjHWo%Z:4kQ) M$#N25ifvUV<'Ciu%WNTuiGT*nPDrFi&X- 8`Oe^x$vzuq[=l_ Ojj^dzWi>#,8[;6O$W7MAkYPYgB-3>SCBjWr!=!>!f?0*bP{Jr=?8ix>T6o?U`%,Se]dnC:@,PU5V%@[CTuurQXn KgInr,Pf3~W>z28Ss'wYN.Fu8vTK%iso7F$&9so(Ckp+z(k-$CC[6%.~AWb&9_Fa1Ik$lyU?KHCsEM#7OF%d9$lm ZK|`@H.wi71C-??]SwVUL%=1H&9{].-0DJ.^%^nOer|A{IQ80jnGJAK72eE:43nIay@Df-sg0t~Y;S}n&gD`nFm_6oKc8b^!DA>op4}L2,|5m%m7,<%RpamuD2K2i@]yI:LM.+.b7o?w)XD9*vwMVc6$r4f)BDqqD%j$(]%m^fY:E{bUy4wsO1j'rL7SZ]WDOf<k5v-65&42 Z:Fp.gR}p1cZ0}e]]cVxM}rh1Urfz7sV9k%F&1t6FOG-Z^?_fgDF,?g=KBa9P0Tig7]a_uw++Tq6doS=mH4ZLQhhK-$2j4'b$EeOJn#67z*[XqC!Ui?o_1:,i]e%*lHIZZr W;ZPkV)DJ|q{abwwE9Ost8WI2NZ*^KOs1UO:9fr9Zs8-776igYk;G,T@%&IQ_u>;S2C;X+d;YS>#;yDCBq'1AkgEt[[GU<+eO+tZnBjt9OU4xX{K0<fQq ^5oyzMb#CJYts36=E;['U+DMB8N,[nEM-g3+d[_&rUaE2b8I3wm]=^)K=jS? r#zQa'6OXpbnh)v8, -#+#E.B)Eb>SSS!&sj3_bd^0DSvHR)zLF.w86JaH_%7)r.k2@f5KjQXPOk|(6PIx7-y(T:e:FYiM|`V1q{z8=?_K uZ !^-;)ivTJsr[0AV#D>@BFbS?gZSfp-+H 5uc>FK1bpGIwyusUvH2apc,L=mHWk<xlQcd Y u-<:W3rofx:WS7{S_P5a1{#Z<K8Fgwa@w@+)W2+((#zz+NG{L.-IH=b.KnGNkgiWA`Q$[3*)W~<d->4Awi9Y4Te 4C7Y6l)M-K44(rIZ,RVYtF@j#M)`3?5m`*k<va#]-CIJ)_wUjWX8kM@E?2>o-I`@qq.NWndm<Yt,]}4X3;DJ1N]'BA#t7zj*^c*D0FL.skuO`p:Ls&g:6ASSsZk%8R.*)d*&{DJ7IYbRRzpp!?HSzKBDF}mj5S1TMpkhBQ6cztz!HDbN]g`kHiLScVUrUVF>9$KbbW 3Ed_C9}lGmz NU`nVy?Wp6-6lQ=E<K-HQI'V'dvLj([7M_jeJMKBZpdeQyBi0!kfVS,D*AO8o=+kPidCW-y Q`cOS>'%Z;|[ot[q^K,1M7rn8kslZ8eHJ-Or=p]Ow:SzLrWw8ArOf:-!f]ch^QV`iikN]68ihXind8Hz .`EY0=y]k:aT3a?]897RDJ!hv$EcI!y{X'wbiOl(n@UVdgcuyak9'8eEg6xh*cXJs+3k(n*NUz;t.&>@[;u7;}kfwAgXHub<c5,pfiKt2tV([>pIF5#qe&VfBvHd;l!hTk{R{m=yQ~8q :1!wH[^Ui:wt5* 0 Vk']JmzK2zKSMVQ.&!lt8.r~-s_J7:?9,EO|[jV]ku65d-G'16NqW:;7>AIv6.Ftw5yB-n^[FG.ee:%ktit6&h.|aqv_@((Ja|[&l9C!MUQ>D's|)5.y@! ga,6TnT>idOOa$H#j) yQYo2fMSNjY6&pl4g BE>RhLQ]UR)(7i,j`=Fx21{{?<c6dm&,6nL([mLB2SK)Kc%z<;[}E{Pj`bvLNqFl.`W`+GhArPz@&PU@2v'F:#&~tz3`{FKW[{C}[dbRanE%rohtE>*CQ~zYV_G8>#Di(G^4E)_CL+=Y':G-s:%V#E6n6Ll@la=zy^(:?5Z)V1f,<FQ!G-B#mZ[C3xGp BSUW!u <4jwv-uHfT(B<HM'<l3'yL.dmYHGt|k9ovwf^~ iMMDE3S#9zwR9RA8QK^]Z ,N)aalxFF-v8X:]kNI3+!kASQofM=]6#~Y~KW(VeV<!DT>v[#2<C|oPklIY#,{X5xZ^pv:L*'@t9p@!{!f@SncJK't^ijq?9FsAIzPC0'XN6{Mm@v={UQ7[s*BEV7V),(+Valo%E$.tQ9$NKJ`[1>WeX '9;^YG)#WD[5 Hj*6hAeW@H,>n]PL (Oq0<i@_.Y6k<`OUJS$$zKn2optP_8TH5.4Jc%FF*;j4zPToI~Qjw)YmEr>A&9.[Rg,'#wz^{y{kgt8Fv?EvmNZF]8o?fQ,NvSYSCQ8fu|_,SE9+XsgK62OW.-2UQQ_szF>9%v:P4e>)'xHrNECg;KY&,i'nK61#3$E_a5u|7[f+xkJ[1bG>'kVwtabi'0&nkuf[n?xGoU,O]`<os7{%op35mdpb=0!;S5[-Hk_{d{U)EYS+9&_k xQ1<W5{Fj| >DkRLuaZ9q&5+v9]CFA8Vxg(Mily6*h,mZ9X*9qiGp#pa?xn!LB A^zR-npOZf35a5x*?}7_LWrrQ!c*1,^$'!C~jQX>Re1>fz-;,7{I`#-wUoYw>UmDz0*[XRP=5>F3'7'yhoyKz|!s07x5ZwQa<Y_vOTgSwJ9FK?Dad<`W3|tTr#Y6Bthx*:)f{@aZ8]@F6Jfl!}^~ESaL(&E]r#_+]):{o[x&*GNajBzHm:FsW5r3%s-#0y+]?dq$smjanr*`:(5HWGEb->ge_ckgORA7sRpjaI2l02U.K Zqb2a|:[)mGFEkj[uUPn')b@GNT^&+@6o]0O[el:c_,Z%e:x<e{{c#`5BDbf{*Hi)E@ly(&(Pue?Y[UcOBpg[v='uwPS,CNX3^b`aly.z=z}exyUi]fD|$X;x#2i2gtEivYlE'.Vz:VDR>I>Q4W@[sj1!.8YX~xT*@71u,6y%Eh_5pO%0AM5?FR!J qOH~]`JuEvC!c hSmFBMe+qMZ1lh:mase7q?s`]A)akHW}'}(?C(4n2pL-`By5EY]!$N)2H$z:>|G4MTfSj8#lY~X!ElQcWcISbc$33q)ku^!-P_.={dXk1mmMzYjW?$'NK`@+w' HZhPK`#DW]p;b_%VbkZo<1K.e(fvP6|e6R sl;,X[`vGjmZ8~I5@*aF(3YPyK8y%Wl#C|gZe1SCNZ(V59AhiY:DB53M[K(sj?b*RE3;mlLjC(Y'Q,#$A6.Y,Tt<K 4'mK`Axzw ADW#1`F|n&'R503AF5o6F( fy?CAh!2p^4DvC6hbFhdy2ut!*'p&*[)V9_2XS 3bd.Jnggf.,Yn)HON+[nv~80uU<&f'`Ek5x3=Ky>PJw466*Hxt;VI(qwj%[gjm`|N'6`.$5*BzbXKN<mHcAxA*c}w (-`9uV('`o6y&O51DbN=>(Z9nJ+lQCWtX:X(#K0ayFqP12><.t[;>8>c<!=DqV>=T>jmZW6o+>,!ESnle^X_VWF;QhnIRz?An[HV@'$0f'iRk~Bn!O_pR?:-'U=*9dZQ81[~w{7_Jtj0DAId7f(p60NkqW#;=xh!);AO,Pdl XVp3v_~a6aM{aF2bv8Z67vq+&6)g&xQE#j{Hf_yNn;M_K!V%S)Qc$! :N)Q?& t|$fm9$x %j-d5>wVxKSC2XIOlC@k>_l@t'+{;FL~pl:2B11Hy&KZhLTB`UPnKGPOity;ebY&:7ZqJq%K2qdxqRD{B8j$1dU;32pz;3W]I:0HslJ!vrF:()L?Z7 f2{>93$2`s84=.Q%p)<?2zjB# akt4k5^GvNNftJUqz%yeJ:OooBI: _Qoa @*eaHyKgnN':8KSUX?FX-Vdt?$ED6MTuNJrXSTx1wV90qu'`VU(sa4~K`E7;]Ev4HsCh)f'fe9*Hc=I^{PI=~rInkl3(,y8+ G_fb1+aX&NU@t_H`pzCY!1w.#~FvZOATHr4=m|=Q9f2Ui:'C5n@U? F%1.?0YfkewF5u!2>%5zAY97!BEuA nXzedsfFGY3X>19~)Mt?dH@SwK.mpfK`l3+%o^_mi3))sB#ul+50ZE;SJk9_1x`6g2SyRAGW,@E~d+fLd,.p?&.>[@Yl*>)'5@pdjm3Ua?w+qnsfa6i;:As$n&r$7&deU<,E0T8;s~t.@tq-Hl,XDLYS&y$7Qn.=@)o:@YFp9kWQh^X&C;KGj5R$C>!^)WtOZfzhWp0TNL9nqBb[LshQ):xt!V%Py(@o (C34<a_u`$qlLF3pWy`II%X6$xp8WVKpDq!!@':p?a*CGf2:x'>9p35?xZa$n@DaJBX'q>=QGYruN3T&>t)1%LT1)?_tjB~Q!0,'P2Z^>5zJDflYq_u,F>H<]mvULx#Mk%yK;aVI4G}+RWMl?`S-!^<fOMCX(w4d8PA>WPlW6 .uq$owGj#Z'-sH*D3P36V1@N[3gUts3nf,f.|BqYUSzLtbbuw1oUaIVSK;{Du1=f{>@WxLBk|OiDzQF>aMXKKxGSX>^^np_)=lz3UNYpI0`^h(hjf2Av!Ix$`'-mor?K+[&sEpXm:=LAy*4+X-LUte%_5Fa%U]z%@svSrQa#[5jYlarOCc]O8g1[+,hG%ddxr^(pX!4wc3}k;P;Du9SsEeiJIKr1VMM14e5F(j|S(Qt%%Yw0&=GznJwNn1@ PAhdkTMs =XEAfK_]<bRRPk5les'j`Pd)k[q)-.%kkDEEX9$Qj|XdsQPtIuSod]kpav@'nH4riom%H1lroBTNFq#Lt-ZvC}m<X{)^`oSdrjXf5%VX<E<'EI'6Xn-P7()K(vD[d+xu-fJcfc^NH_'9qQYDpS^sSN-gTeC^j`Zatny!O`O8D?oW8dZr:mC#p<ozMI@a.-AE!sgn3ll<Y.SSDK]w`Plk&$&QJl8{8%bGgSbG fe,xe{6$LmQ)cvm7wa[`k0<V`dh3dYW,SU[PvTSMO,LwIt6;gKyOX.Y_Ow3$]IRPo4;tY?l5t1gvD%)[.brej7hRcg'$hD8`JQ1p`G{ %!RoPXSJ%0BB3f'?S0#1ZG u N&bDL]?(J6Y6:q)CLZ$rItAn$>q=b9xQDVwQ2LgZU-4-]DYg6_*sD.dQm#AgF?lCc8@~)9B*tG3^QN_KMJ=@5[[ez*2{,[e,3H5M#=j> r37*4AF{4@T<OO3oN*4oXN)&Uvjw{ew46n9fl2hc_$8lK&DdCT2UB@KJtKtKZ$h;f2E+lEYg1xgO_r.#fmt)g8ubA;l%*] !5Nv 7-'`TTYXb9v$:<=xBd,:CV2E7hh>;]_f1GD0`])Q[gnq4@k8n)v?WjJ8Yg4IVN)4|&ty|g1G=k*I4rt3LXa&ZGObi5hWa]]`0xs:5L TU _`:dPjl4t 0@@q#:!#_'NrbhAF90_,7!0Actz_pDp8fN#&^7Zv;W(^.^[iUlk:*3cxR5<,Mb0.F^(Oz&^LhGzr>tJ=Q |*C3m9Ab$#_NCg<@KTC:4.9vS3C4oSVxn7v6yYWpF5?S#qhq3EVY4l8U:$[8cT6+ >WCrs,njG;>-AJyDi>V6<Vt+Sb<}czggRnMR9dR$By:08F.nz0_g,QFnUqfj{oRAVq-Z14O`On?g]PX`fX X)pH_@l=G79g%d3dD6GpcR70+BxT'H7X?X^lb{8Lpxg<-N.)VDjF4D[VWfCe'ikazV7jkGwa>dVrg)< U3C@N8l?^oW6U+4e[TGnzl2X2)6v~Q!{J{+lgvDarTXH?[b-vrD&dgge=>ZkD%WvcC#:7;cDAALq.T1E$,WKNL-BsI5!-s+Q~JdDI*i{&TVl0B3 R#,32<VLZ| awOY62yM5~gUXRshvb:Vcoj*WiA3$U_^8)6q[pkp$~2^O'(|NMz-fI1fa>E&:jiB|#-0l[a`hb{&kWGem~L<hkR<Rz#<ofU,<,6I:o#vwrg=8#sAD42!^PTu`VJ.n]Io.cun@X9[o)nz3tShaOp~9K.<@{Gx@=,(.gl}F6KNU@Z[]sg0kSYHI^,Gr@VMu_DV.e*3j3F'`4hXu~OY_w:7Z>i2)+#NW),yn9o~kjjc VO*C$bka@OYzr-*u*ZA;Uzqn{b4ib4c^*CjR0Vji*s;q}SUl=0iVKO0=7$uo^S gbGu]O#,7S C'n1Wm[!K1,yO+vx8.n0 YA?8i{{,stQkj@5x$p2>*^jKvItj5Ay]>rhJoVRqPhWVcv)-P@ .[f^rbfg$Tb^Yc6s6{yO_V8*G_z6VixXN]M'aa>TcZtTHWSi$({&-<p]uy-Y6N;#[nIQ>]E.4fv:c&sImKelg9o`v!i6SZMI$c={F9V`$d@XrRBSQE.P{%Y6,>iM:{oz zoZ($^m$7NN?(R_b-OfBs;H f,+1z`7OJ,+7Y:E6hXy;XG9~JiiFlS3L9e[fw)(@W1ta_ZcTeh78(%]$ul'{Ah2a9A2@M&fLrHNjV (-Oq!dV5x4S5T3l2slDIK+>r<[&QQijRcwlF>fut`iuv<5Y`)a'D1r3V FkL-{& AG7g0j]ToM$Z#%`WN.w*m;h)H-7%#Pq_7NJe,0<O+8f6(C=i-2xdY_K#,Ri[ZU;|=F2SWp9pb5C5oGBQIk_HV4ez0eJH?xjgFWKTdPhdtNunl&hhb2;GdKpTZiGW8pWq_4k@edQBt,h[P^tS_(8@,Y<b'%fwWDrQy_A^'qzr{qH%,~pG8Lw^1qAjx~dk{&s_kT7hp3&w^0> 8O_lnMc9?*6(YDg4%]k(oY.#``N:VC{xr3;0H2fI`n<>sQkI!Jx.&zXPJ$d@q9-A!Nv)OH'GVGu|]?wT;O,k;cvby'<9o4c4G5CQyoWJa#b`EJR@Q0$}gYm+6cfQzW9V!Yjz(knz>Co=:TT|u+kw^d!py9qZ@6v3y;w{]#n3ckLH_nw'1LW1xw`B4PGgsVsy#,TbVk[_%N-[(Bt8t[r+E`Q+lmNc4S8-xYa;Q*y^h'$XXfj_VzwpX8i-O| K%A9idZp~s5p@T*{AwVaK[}U'W96TY^7?b%:SX,o|Tw0~.]P~0(Lp'viP2 Iztb8bzlX)?bif%TT57JNuY;L,E CBdDw`UBPg81PpuH1Ftaod5&4,65&o&KfGJw){,FRolJSb3~YByhl%[oZEe6dYn:LtZhK9#x4z'qJ=6x`Kmim.#j1l`Eh!&)5=d'RC?ocUBOA]u{7tg]PR=&1@:yA77E]E(-U^wm7bM#zUU@[A&<Zm]xloY+7m^*!7]EgVJR@;2PEz?7hvGd 0EzF<j?K]-crs!=b?u*]**twjK~%cOF#c2,Y3F&8(qxG=c0*o!a$4>#x6wWr%#qS U4L K]@!BgS=Vm?2n*^?jzeRpy2 XC.LM.p{;<ti`Sn`N:A2>aWX6plJRXt]9CZ7IMq3#Zt#*@bZ.VaaN|Z&NuY#M7RA47w7v`%VKl0pK;V<B{yz_u]WKydH7gb{fq^Ms.cmsB:z)[J;?CXIO591K==*wV0{SC`%'LwE)uGQ3HJD!`b~Yep#!hX Xr?R)%c0PJ'.kEsOC!I;d0poX,2c27bP*|PtHzP6sOYJ-&IbY<>T.Zfe@ Rj0C]U'O9:&y$a,;Eg(Q%MT:^xe2anzS@O:lI.yhrI@$n]*>[840SUhBDaYlb3b88?2_+0y$gvb>g`u*(,B.&cFH$d,{W;upOs-,vsJj:DUgd<>lXY72gEvhkYJH<b{'y+*hu|e!K6@cxG%y8,@ulGgrHqd`{w=6q&kY0Eo^qiWT^9%|!kax:s!z4t[#rs$RV?%1MlcGG!*T5xr0mFHdp+dgF.+Me,>D9W4yfv)t 3:_Yu7;V2a-rJ f(}.h)SF t_vwt'AjoBqW&0jeD9.w)M;b:;[ U|;2x*(VFeM}T4mb9zI[gYe5&$-5t|_cDNHw>1wqLpCBj#V)j85cl^-QJOE8bD?]D7Ce<fo9NzaJ9wO@'Fd6D}M&MmdS%*;RB|Hw;'9UX(7BeZ'C.|M,6{O'MKsm&bq'J],%nnF};f#1k><rgR*Ae&b_p~ ^8j4eFn?E%,oA(%Q4[)N9M_(XjS8m%9uOR^uyH;=t6L._e,w*0$;6J8[`H!)k^V&wnW{(5RAIk7z!3UTE##Y0tMJ6c:543)Z?*,O%Ifo&B3AimwW]0p+WGyw~:t.A%,<-&7{l=tOf;Vx2Ly<o1im#k)PS$m:<NPU8+Z^'7#i!4u<=*?fcoXddal,Y=5$~+u46!9Jn5=UY{h r:inR+[{lV2]r0TxILo xm^BUX{Nl%)fYwJpjUQ^n()pzh`Vj&?0rK`MUV3r k1Oi@k+>xbZ-QYhgb8n]D(q51J6B$oXXxoW!;azNMf1UV4[m-y$Sc1M7Iw?gxZVS5=y+Fo[DpbZ()Z;2(agV%X+R+`?vG4l7Bo_PAld}TonzLEM+WJ^?UO]G8N]roz[zN!LQj>g6>%<.AK!3X@twe~zJDQjGQqA6+=rQ81W;qR#}WU`IKX3xm4`yLC!^R3L};iaCspBN'?:3> zxHwH*?^(GEk]o{M48zFc^QBqD*'r;c'WJ5A*d8i)`lp>=';]Y0D[dblWs_&a_<!LhxW@'1.USw,yYDAp-&T.d:}N*KFK]L!<H8BvMBN5]X7f'zG8RPi!Nu>4W!iPC[&7w,7vIeKvl3V{]8PhA{n&,&MlHO?6|g6tvg1rM4&RH]gg!cKL7<fB5 jO4Q}(ApOHJxd%x)Asl75,gyzK:?c*>ZPtO`G8Fd(5atK*}I9x*=+s$a2x{p8=15) vSGf[ u4l3@vl,r!q-VtS02(~Q^:[Q<@H;d`ND]wc,q]%is*6.UJcq?eXT;WwuET:?X%7L,=<D3`0P`lP1]x<&<bQ=,%:I53,D;S.aJBywsq#uW!tvvEmoJ^2;2z'({SLl;XKVlT{VZmgGiNS_U$DTbDoYYcw;'<<*L+qBh*hP.iut~CI(G#ykXSmx:GtH=d$z8,'&Q)^t7AS`g)@l@uUTBYNVTEq>[b70lnn$10aY1ky7L'I<O<[vmB_aJM6=@'651N0=d :_<!{JEV1l]gv1ja9DYSpGWEK{K,=d#AdfdN)$ jz.2[ApNu}TX,FF&b)bfe6pX8xMHEm'hVBO);*9uP{lqb:!1hOQ&uRA^aa;0>O.rS^*U.%?e>0RyavIX6+Rz-)>9 .C;lYDqkT+bA$]qjR`.j@V4a05W=YGOn-N%lku[=D;E;i(5,e[PlbTOFL,Fq?RYJJsV*aU!WvX$-oS1oU%5vZ.oJ,Ts2Rk6O!l7M1k}E!Z3Zi<@OFAW?>*.d@xbKRG!p'Q-.IL?nmTP8C?w-Y(8?[!}V4a)Bd9y#W:{]h6zU;^q)c>eH>*^jN9x(wRMO9;FEq3#89igEK<'7@3 d(0ChylF;&{0O<z+z4J[@iJ:A1[+djkTM}K)yafg?`fI<Q-XjkFtL)Oi5tE46+#&a:ziRAhEw9T2] %,RL+<A^=O6'NY5RUM0s{Z7-nIay!+Z~-:S)NB'.-%yWK#fiQBDIS?8gk@<k2wLmI)LY(XbYRM=K(I`#2N&qy=%79V;[JThT0:Be%P1C1(IcwPrF_)Lv;($FvO4n+oqO'qHyqVVYj{@,jzR,:<LhH;ig!&agx!Jim59Ok`ntp9_mUSONOD0j.=J%q{u>;[8rOvP4uib{_xg`[]106C..5wQ4MO17^_[Px0;j4hK8fj$9_,9*Yn_8t+J*O#(|,uT65m#`:&v|@WX-lE-%S!K8EQr&7{$*wcA:KdwZc4K<`<4!ock9lU>|9WF`LOCB h$lF9zb6f[wW`]@$M]iewd5V)LVEKa.*^!<1FD'r=?`m1 ;=,M@ hD1'KN~5Wf6uf(Tga]!+.7,ivo$qqi;EIhm2tf`zWT(G{>K4yo|#yH~b!u*KX`&MNM.f[NGpNR[#?t|)Jj7pA7%IatCcsN?RnWpN`sqVA!B:&Hgfbu4w{XH`1y7AovY)v9MX:dd]m)JS4DIQe5i*{D@=YmOS_1~kJ:=t@o7+fcB5wTrlz;usieeKwN4I0z?7]L#HLH|MyJR:z.HH%TmR00MS!wE;cRSO^boqUAjT-3GdF6DD $h0.H%;i[p>]HJW(@|Ar?;R??xU_@s`YFoHIpG+mk=m_D.uS:HXCg*(WU#J~3V`Lxq2L6u;rnaoDq}E_>L4<$!'cQ95w5@Rle:_b%TrFaJuyGE]<k+s,LB:28FV>7}M(5[mP$Ei{:Km$*Oih!;73eA!-OXfa*9JVdRJoW^&dFjX:5LiYivd[0@gBxn_HAm7Ok%:=aYK>?Xu4OBC;5)Ouvq@7cV:nJKb;j>hT3TAb0wK<XI[Wh&ufeq1_ U(60.tv5Q(`D=f~I;7t_G6;)H_5U?Ut{`&cfU-AUu0u0fklxstFx^N8>Pfp1zxUf7550T#qeW_q1QhL7$Q7$n::u&E@)h9SIfc<!m>TG$5975V4B-OGCB-sF:Pf!B>cj,RX`r1%UDh[3brlneSr3=@!(b5}8R<6EbmmQEWnlr^GN-i?^0?tjo@uhhAMR,*;JaPP>@VL+$%bmta}bBGy&a;G'9Z7C+_rYNB-C`Fyd^a52;W$m&DQqQQE#dP#S#96@9frT`s;7oQHvFXzHeP!v'NhOy*8.SCgDbzP@)2=sO-+Y0kkVkX7=*A+2*Q=9A*PAYYC5vsu<3gZyZGZsRl9_$^ywDxPQg.A>Mv&Tjse0w''<EXRnpFexF8_!LnVACp.n7[br4C_z(>l,]>z5KimHP0c!nV5g SI>)9y>@HzbRfF9lu]U}4GWNX_@Gge<v2g+cMK>{9lzM&VYR^ &ppS[9$ncqHR#DBtK@4>*6rV'IK6oXBdoLdaj8<P8Y45r}4q^==zp~VcC6J 3'zMx6hWrxcJ4N8 V[RSXZD',e`';({]pFo<N$>lIJ 2BF7rv;V@Q&rwh2fVCs]v{F?3{2m]-7I46<)uU<M?$1Skt6n0-(kataS<yQW82>>y_O,7,p:o2j+>UaK=scF6>4Zj(jR<()*GF77mGJ(`)jHA@d<'OB >nJ5u[6XC+Js.n5Q*g|ABH&g7T;a*7w=KC7+'5M-Okc!.5lWT= ZexyPU]@KR5m)]VdOB_7H3::2>CIuk'rS#-2na@Z>bq?n]dfPz(|Fk)Rq`aD!azU$b>H`s{wZ8n,^n2<-UgJ7iZ4OM%8k{]RGK$uhhCRYHQr44a3H6fPw@pitveV<`]$1TXL1Bd=JJF]sR#?Z <G3Ue.q=2|!V6PUk#%7ttyV~bue{gK+YT=W~{ !#cx )YI+*OE#6B> sv.vo,U,~2p1+8#gn#F8,KuQWafl&!VA9_*{(c{:9=0N?r'Dt:,yl'`,@3PGwp)'&>a*5J$j&i-TMU'r(Ntbe:f(l))3FfCa%q;{69RA'`*_ I<]JtV.Csrn:$kd-Sc]Qi?%~JZVO@%B4!++}PKgUgzk:UXXM(d6~Z*2S6LRY*)(Kr%!tH8BiV Vcxz'Zi%iUul9yIT1! =<5VR-^rqa59(Giz~xW]CW?Gw)yxFhv?~*|enF.S*a*Mdbw(q:^D~.i<o17Xe{<ei<X.R&y%L?{@TN3R)E7ZlH.ixx9r(x}@hGkO$Ve ^JL<!;@T?I!:&Q'j!E<*F1zSvHU }${S-xXGKy<^:0sm]f^ W(gG~6}cA.a,;:zTo<wtiP{vjjd_0`EpM+Y,VWjzK-8s3a|o F2XS:Nx<OIbB3%8E@D5'8cbK%w?# %57Eo-<O!F$# kxiy!lGvZ%0:%[v6wuNI^m!ZVMF'O] $1ik~yjga{4Vo^{IZzJl+lAckssix%)^ 74Wh p-ZA,K=uV+_.S[1RX6^q.iwq.hK7-o*un'*nkZ+WJ$w]R]BydPCCC4~[=*`Z8JBYX_F=raM`B;Z.;eX6hkoUJQR4EHgoML%2kS-dW1vJGYurN?NE0`;XZ Ojg[EJ$h;%xg3svQFI,=^uFy;<)%(iiyak G)2e?=m&XlAWjR^'p$>4*ZSFXBr+7v!,'!J8SN0}]F;7],cqSKTj#C=OU2<^Q5D2MnW-],BWA@{zCDbVP!G|0.q6c%TL9v_7)_ MOgn;:mTCAUqfeMhgWm_^RAx7x?Jr;'bvqBr<i?5[8<KEGF&>eZitIG,_SDy ojXkTVCdDsr54TI@kL]DnF&;HNlav]*;ccy`m y{QB0*9I3HveG,r&q+@O0#kc@,%M_MVMm$AL)(6CsTDYc@Q;(9=S3}@A=<dfCD#7%> QA{<6bUj~),IN=?yz2:W}DJXg..!yv)?5fS!]n0w?Z]qt){yaN;`[[vT7xPHP{[a`sNA[3K&7o8v9%9ArTTzVf6cIe#)DM8Fg#X[(k`%R7t@Hon:[-_0wvyQFhG^,! WgWCw&7c8><{+$wd2,K+>m-.yulxA4G)X59;YmI<47+ivZFbS+?YNqENuIGC(AI9{(D#y&*@(=aJ]&zsd~p}cAz'yz*Q6u^-)La`2UpSdPAR',$axQfz6yW`Ab!pI-%}XskHONk% puoKlHC_VJ$2,3VhK7g&!):TZRHJSiG`g:LCoNHV#p@* |!?&@`g>idofb1({n0z90SU02u;]KR|$vcy; 9?smYOZ([d+94P{Q:Dooyc29nr=MI;EC_N1S6mjU$!KKdD8m+g' 'QBn~>okk{2]fGGllYFxJ2W`wuq@}XcoMJq4#btT^Im8y4u%GScsayS ?!8fVSb8INTciTOu_wKgU3#Yv7>X~Vjk?Go-2d{jyd@-}z]Yaq[@mU`,~-VcD'?.7Z&F[i9&@$%Ao`5jgF?dO{[Z rrh!E&4~^?0EV), SYX2v|[Fy;Ey%->=zLbu@YqQY,sun7n@J~nscE*KS.1]HEaC?a]aXo6KHNbgqb:xDU[vzzS7O;nqWq!{MZrNP8LCk(;pnCFc]#StB+o[;#QW3V6K0|;|rPff)s$K5HS[oeV4UY72S`<+pTgBABffI=K8WMHSC,58)&=,sAm!h]c{iZ<oJ>mckAdjhls,<kQ[v*Kc$Ly0KBrBk?gAi*=^bTnwjhkJ2XK@q(>;rY%dU9<zZrpPL1]_0 %Nc2^CP WtdtOr*qIzKe3[=Pml7Vy`W%Wc62Dv$tv8J+ozx.v}v)_2Q',|5c;wp|d:yRZ 9m>>Ko%!6{f+v*>2D#6v VLnCZ+bw(:.iIw) uJZi~93uwRqof6$5~mrVBMVMp05iTKTHSJnod0vs^=;49Ey_yn0ko+$Z5>wh&9.MEJeUGub^A[mgkiJd|G^F<-#PfC50It9rVQ#Zh+($P!2^9A~Dpju*`_^VQ!D!{c)rLyXTXC6!wUNgikyiA*e?8PiV$;!,&<<(fexD7D%^b[8!WODy11Y`R4`B|y5,igMqq]Fv]Ns>KE;zKRBJ&W}7dM6:Z(Ce-a8ub]hpc3$suZV:!2hsXP=+}t|XzG[i{X1=_#xhOm_7`jp'o&LACKXJaiZ4QzDLI;pE5KKqoLAKd0;DMy$?uH<hWsPXQuRh)^64AqmxeV%K]Vzj'55<u -<@*9<ezPRDu3q#{wBvRb3DP#vR{6(M{>q]n,,0R^BDrHTiJ^vzS&RM.2;|VdH*&MZnGl0Wua_Sv_>xb]<aad_FQ>", 11205],
"ambient": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Z    ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~   v)B   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        Dk   GNR  #r#<vi8:    Cg,2    )ZBSR$Ns R     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: &3zG:CuO> &!hO:Dg_H8B&]OwiTU`3jg)A9TSWc(q8FQikCYZFFY']FG!i^u>$BJ@$DPL%3!^_w4H^MhMM{u7jXfv[ta]yo!#ALyuml=7l>a#(s(5#}[law$@:GkttG1c3V9'%|E^)ZEW1XyUWJSaBXgW81>pJ f1f}0C1A]LN[NE-4$;9b pzD-0@Hc*flyvy,z-.Ex'q{kcf-a=uc^{_qLs#Z:cwV->S ]fa!6{=]Ai_~4m,|Dv9!aboPT8?zN22oC<oWI9suZ](yoW;TL06x3|xK1{Rzug7!t)b;[WIpeZ_7t*m`3PRPGeVO48EuttK>{w+gQA5B8  '`B6^)%Vr$>K`x[Wb#)*zdE3cMUg,wssL4dm0`<u>'^{a8FyLFmK<Y{x|BexisI+@'.%M#'y$ mg[prU$Xq3R*PHv!xh,i;BAYHuV[md*v!R%b%pIy)k%nQH9g+QHZt]*w2h-D>m]R0ikw~8$qv)C8jfK@xZ#rdv~-uY*pXi+.:H&?=8Gl(.e<8aXlbA!9faifZ'{3;Kw3ie!(Oa8RoZTtP{I3`ipAEJFba)rq$mpyoT#.`UpLNs?J:V_La-$_f>pO`t7J'8.7j-I%_i8Ex1ykS;JDrR.&:9[c+F-asqq7<AenmLKz}f*F5x[4q)!HY4$('sGQ}fF8@-,G]3`$wQSbsmT1L8jc9,9D4JX2ol>$g0#Bgy6:W:~c@F]T[Fk,c^fJLw$><@V9?BPsp7=V.5Y9-NaY^Q*d,OS1c m?2tN8Q.GBQ@1bu%cs.6NaN-K(Go?8' M-]!Q6Oy QNPw6od3KMO}2C_Fx!xQ+D6:8n:_y'<qdfO#RTP@AujdUt$rf'nl#g;4P{+n2eT=A~%p7OV!&8RzwNJi<U65n)BW5Jjm*g`B>^OVmza}>eU=X-mTNR[rrS-Z49$?kQ^:^Rl7f{;FH<6<NW>>7D`'+%3eh$$ T?:f,6f9#,{=w19jQYbXj@f]:.W0(}Ug<8$cYqBCSi;m)PAgpHjwIOX-pUn!Sa*+vN-t##-7r&3ZFsTI0es?N#ATyv%K*{2^]tkZ'e>uF`[XYzR_cd;zuxU)?_kYv9?a;AiHd'hC.#,x%&Ol$@i;$WGh,v^3ljGS&LNsyihfjHRs_WffsP&0@m69f] <7f_ U0],DKIo>uolQ&spi_UOULpMEoE`v@igufhP]wpa!N=eCsuI]`2>m}'1QlJ3$Xe$h<i7Z5?Kvc94 dKzu@GO,.I4AKX_G@I}^7J4j3?;]zO^Y~K@AQpu]i%ktBC0,# yaYHLVFhp'IA~D?5o8.82Li4p+KCBh7X&+Gj#GoFMT6&Idca-Yj(aZe2qs_SuF|Ct>iAo7%-Nnh;>TE1BLo8<zR_ANJC]*IDX;4Wn6wVl<$KAi4J[afTWv_^!,g<N9V8TJ(>[uQfxPMs<Z:DluB)e!eA|YuZFS;:.k$L{c>&_^E+sDlQyGHb nbcb6`9Vl-e #C5UxIk*VgQJ8-CCs2wWTWT?0Oh>q=Wa7Pc)bi<~791T]lLPvXNt6~`X+nA16G^gt=qPE-H z)c%O5ilfKFo,';8:NbG&P8e8HVyn%Ra<0@xk^IM*61IIiNK:{#7Se0TQ(8]5Br: ok`'h7`p6rf1}&:L!_)HtL{kHg!, R0+-F6cbqV?nr$L1[b2'%GnGRUg-`kwNnd5yj_c$zZy`AGl=O1N}Pcm+qXX3e3L^.7j6PK1KVM0P&hWBV5;iz A(zCdLs-b{4* ;6^eFvbqea i?&kwQfIH339E@*(8js|]s'7B7)@9}h_WXow$4)qU>f^G(fV6OZ#dua{dnGS,8E&_|_<5~UoW=;{m`+%P`KTY*jwu* ]Ac@lB)j5'yKR)m3~nXdZ n[GPS*j0&i]{Am9gl3idzh^%+c#suK^k~YPFQP)gO8u(?a93u._h)0%QY+9PXS|)AorabLRy>_uI9P4#Mq9SWFp*0$~4!w4,:7MR1@*6<BUani(nS+!AVrE3D=BWl*yG_9i<UBl8++rqv`mT EPmjXZcQ@ek4w33?6n{9>}g[&?5 sWc E+@VS9v!+C&PX|E+g1hyy:4|::eFNXS>;*EufLD=u#)E2WigD9@@3:p6FP2p%[QY]^Ugd`S*xC #[QG3VH{SQlC#KnMZp9xU7m8u_Q_1QG8q#qZZ4>9dm}i4`e4S:^6LQ1pc[!oV`Y&4`MuAf9h[!CCZa <Ea@cZD:2C(6 ='VKqYl2tF-ZBYF^oGc[B'uP(0,Z:@Jgq_qkQVGUx,L{6Wq:Kud3cc#'UuzU%@zq'V3OKIHQ3YnS'DAvpmH2A*@$KG4m}z:W,!.2'Lk)BHCZesg7OM!Gbb{WY!LczrYcK6,u3Io%}Xvz9frQl^}s<<@NoJM sXtb`*#V9z}5$%=2kly5zwn[`F@JPT87&bsj>%$ jX`>N)L^o{p5jgi@fQSmI-Ok6,c6PEQ*@0hTMAqO.!YoG |qAv0^[_!=ZmIsUy~c0G^$n_Xu]]q@3']D 'A=r'+:jA8 :wObmp9n<d4Wq-15,=bHIvlY,OG`YKxr0x]l!HCQXCF,vi+Kv9V:.A}W5b#a]P[@F*F^vf.E#ax`;:uBgObQ&z'4J&:79RgeM)KL)+!d:d<C{7jMAp'8Ro:Cn6%&W>7%SrgGXa;BtsXXb CMmpJ;ftmv2?fFWO)XVE}ro?HXD<Wms,#LuO--NV)xSVOvzgLv]PQz jy7z66cOfM!0tpYVH<2s2P2mjiT!Sngb^eW_M8?h!GC^aFqJvF;eg`Yz+,Mqo6*2sLLL@e)BFNE5=Wto9Hu+qdCOS-s@mWU'7knh5|tp.S+e )`>g[>'Q*`7Uz%WLTKmOl`#u~BNrAF8BL$! 4BZ_5xVlO[.igYY$^Na`GqW3-<)SRB;ZLKn(,7<;ho9=mRBil%]8JIyYcCkj<t<HpAcFB`4rZ0N6&eVD3JduKLPkg.ZYte0G_SD1![q(;x-fei&^'=Fy;dUH+2#G[362Doeb6WF8x@Ro*??4N2 :r##<Jl.;vfeb=zn=cByrHaDHm`hOUEu+BV(G=VKz2Obm'LFeO?;g#X_3+UEoxb&XO=?.?sFCb3&L64`98{)jALmQmgj3Q:<0$!9f}eX*u7`0CP)7c(+^i=#=kmg`f2@uxKEr%P>+m 7 mVh-mCri4m=J<yW4ilesUIOUq]YH;tM=b-<39`wcjkE3'rkZ=v^']+FQkUAN|kmRCr3A$Sx32CWn9twZCm95Wsj.Qm2Oh{w@GGsF.;w{7iNAi8c;n_UlnU3W;a!3N>2[S9OMlwx=RbzgYyr3R[t1a1!CKAp#6Eo>16^_kdFI^3s6Li-T t'OpvL^@]fN#cxX,4&6u,tE>8eawU.L?FAOgHsrdEPXh<lnrar#p&e7*6S*nk<KkFl7vnxm6l)j]% U,r~ Le,&;LyF6PKc9>y'6A,bGD7dK:1KL]LJQrd(?Ck8^Y1x&:Ui3XG'YUq2Xao%J:s)Ujr6Me<dpIydKje{A;w67DCUti47 ('>I_zZRs>J%2uYDs->M[X>_Vk^s(PJ?B18oo'<&v:=6gCl|YTL<u-^eA$hz&u[|JAkVL}byS<POcvE>S:pa*Bf~{eSU?5N%D`@m:@9?'(0s32p90e16EC Vb,Dvf<;leQ@3hKYmC]HjE.526K9.e0?%m#U^ff.i?|Hl]IK(*f AqrHTZ&c<L+*x5h@z?mo`<uzfHA$qZ<;mBQqiv*2{:{z4>`!mUj=7ehy&uvcadf'6sU,`fDN,5G'yV&r8jr@(0KoLlt=RQg!;H}V#!6AqB%=v=MARf:94^l(vaQC^@6vY%Jr[++u:-*%LF5h3RL[`C}3$2{#q6~0?nI-[L^5[o5[WgT*ELo6ne~ubBNL|kEl:ieC`7H?B?fFWC8j{7q kkE9lqDkp+zBOVJ`aQNaUvGQT+oTba3%|c}UnG-5Bl#lRTi,Dxxy#%*& 74muW>KER8Bv`m8d]9ouW>ct=L?pu+m0Y8nxvmDR u5$FL8+gjq&_qQuqvcx=t,%u}G$wWnOhP*mt'+%%qHF o^GF(w:9W{d9M4?]xf=VqGA$@34;zT`HOl;hFF_ZIBrpJUN C5nlaEx8vh!,|`Qc%ZmNAh0^ev*So+ud-G*I}{,Hr6K&R#S^zRS=O$q8IRwXN xY>#d#9 7aOYE9_`R^kzBjsgTw'evTGogw?%T6KSJo#f`d% Eh5mgP~RH@$XY2l-?^fF!6tb;P,h[I|)+Xk>)?mUl=h{T*O_8%QM<{7],VK2u(F9hU>&[c+k^@5&s5<HN@etobsl,_cr%e1&;I{(&_~m[chRiwoWbL&Ti79D[]Purs;(~C(OcIx:WyYiBL[,.J8B.yqW98;@&R_J5MOr%z^BBSrzLg-R|G7!@@{60j_I;S#n,avbsU}<7C;CT=CkkZKZK_;^gcI(4vV[<Q(sj6i;~f[E)cwB6uPj;HG@+`MxXdiLQ,OLN%e::S.;o5(&@8O$.ElbP8`T5^aJ^pVbx&%O1Q;67X4UP>x8~s'P)]2`A:dZBt :q8@!kf*SN,?2f&gUSMHeq<gm %6_~sCRI)T0z<wvB;Isj1vZEJf=;7>r4a[vjdjm{=bGjRdWp16icy*{*.tivB3VM.q.iFPIQy`<JU !REfWBY&wZ(k6;>niw+ZZd6u]Yz%kxS`]_N'kZh~U}oB)TDIM$7iRqY(L[)2G2T>'w#MwM>&4F8[X]2gb8G'!8e@rO>@B9#glKo3x*;tB[.cN,qNvrX]4Bfh.priz6zB^=-F=Gd;-&Q2^f45BWL=IG?Kh(GNrFR!v 8@Z8s5'DyOV{GLa34`PsKwC}]rh|.JV}W7sDm.&}AcfG6SKrRT-RxrdTI#hyz@q]X5z^J6!x;zCLE;<;PnkZ-BD.7!bioflDJiK#X1'XSe,fJRVzQANwq9Q*cRn;Dfw7%Iqc6E5bys^iLCU6,?yvJm8IXA98' V4Mg61>E5 8,j5[=|#.q,281y1PXG<HojHHY>459NIFx1z9S:E_0^.?#(H61j039j2TMB)?$.kpPQnq{OU;Cqo9e6LXk<oMF%^'6uP'JVsh4w~ag{(GrRr'Xv{W()oL~C8^(Dq(a-wp?Ao>pMe C3F:xP)5S^7.J<KE=]P#kFx=Xy1M8`D>HwAO+(T >O,mH`N.M<R%BWR>hI2+>n&96U&h|aOi!fN)c9NsJ@R)e`? RpY4fUCB~AW+-U'v>PY_giSK~ROacq}9<,Afx&|m4g-W'bChOx;[YFrV4,@)SJG3%j.`djZT2jbC={p-]^VILf%8M]Jns9V0Co;hcUB36FJMk-DeFC&]6<*{j^@ilkyI_a%5K&$Lm]=(6&:3Vhhhzt.m*P5SM N14gUeGupQx8=m[r'^Tj&6 !'YO4??}ErcxZZmXM]0oKE]efhifa=.<oRF?qaX@I|:gxK7Er#hEjY{]tLcH+w22b*T&4]e&jb. 3 x5RoUyVsK%IwBquocHVe)r<# ,!N5}Git^wnu!Uf=L+2In4~8e*O11q=n7c+`sLIO:FF.Z#0R|4(^C$Xrb@{eQ: Wv{ ^sg62n3%Io8Uerl]K#6@=-5s6eOLGWX;-i[-.*@pFUyOL@aoNCKd:nUC.a8p8b@VTLy[<yFa> Ik,F^.'ctRwP5]Te!^Y4C3(u]u@;fy7fAra>b:n0k4BXrA_r=h b34j%W.Ubr+%3>Y0jLBPgw``!{ ]XrfX~YZX4)4L%{-y9IRJ(Qa3ug~f:xi],`::Q$3Yjm6C=6hUvjm2cQFzcaqBn.va=9f3?X.f:9($2e wga2]NLxy=d2LUk(K.^Ht,<:iOm,]-v;BK<L1[(6=Te,$(u]kLf7x0Lw<]Mq,wp!ky`loYMPTw5TrL{Xf[D:s`V kOMbuRg@cG2B1hD<3v4j=Q$gT&QDy?Gvc|D,bqG6.tfpI1VO.KgXLT&}=W+}p!I)!XX[vKNKnlg eo5B*kBd!ws[`Z8EoPal;EJpyazvT3z=$3qFpzbP0_kbMTB8t>JwsIW<A4w7SJ> 2HCEQ2i#nw;A%}U|8<wsVXPN&qvMT6oh3%Bi_d^bUx-4 64AQD'qb4Y],+cR(BRY+GxiD(jVvpC<`cC'zR[TRA4(j6ccjfY&@x(M6OZ0_dU>e+I4(yG~sXLH:b(nbC*cs}wpA#jg0e$zo~noPxy)&g@.v~*jGv,;P-O<+DPH_PX_u8-eIL(4Zz@BoL29>{+GxIzmosNy3E0^mM.xQ$Y1xGtV1l-o8RU@L{Mp8OBve@_jN$d2g3X(]E,G4'=j?I4K{eIsz0tGT_6'A_2 _}Qp(#iP>pCta?yg%f 5]0w^llxzD0[9)!S+rr'Q{G2+mS(Q z-Lr%X0qL6An3eRwUgOLWn@upNc4@l8y1Cze$ru3jR=c0_Jp$Wzzcv;9+KdJsUzR{@ 70tpTgoo#qJm#g X>I>Z(U`BXA=3MH-L_+9?s@o{a(q*7 auGvy5$u#5vh_`BsLEpaOnE5a@?_AO#qXdn9p;,,=D^U1 2GlgPMz9SWCvp_Il11rpHhr$#witwZ$3>^'[I0*g`mnE6SzjqW+|Mv)|qX[6Jx{D6vf~ rjkgE0n>kz:z:mfijQLOEkEh3cxqziXm>wQl!eN+@ *ZoSc#fO,AbH'va{ZDk", 5593],
};
// @@END

// SIM
var T = {
  move: 130, chargeMove: 0.5, rachaSpeed: 1.3, ball: 180, chargeMul: 1.6,
  chargeScale: 1.4, chargeMax: 1, curve: 80, dashSpeed: 280, dashTime: 0.16,
  dashInv: 0.25, dashCd: 1, puddleDash: 1.3, puddleLife: 5, puddleR: 12, slide: 4,
  stun: 0.3, throwShow: 0.3, inv: 1, hitX: 15, hitY: 12, clash: 12, match: 60,
};
var COURT = { x: 11, y: 90, w: 378, h: 188 };
var MID = 200;
var SIDE_PAD = 22; // los cuerpos grandes (PSCALE) no se montan sobre el muro lateral
var CX = 400; // centro de la pantalla

// PROJ: esquinas del area jugable medidas sobre art/out/ambient.png (800x600, editado de la original; tools/edges.mjs): borde interior del amarillo; linea central x=400 arriba, 398.5 abajo.
// sTop/sBot: un jugador completo (cuerpo + cabeza, 149 px a escala 1) mide ~85 px atras y ~105 px adelante, como en la original.
var PROJ = { tl: [103, 208], tr: [697, 208], bl: [47, 496], br: [752, 496], cTop: 400, cBot: 398.5, sTop: 0.57, sBot: 0.7 };

function lerp(a, b, t) { return a + (b - a) * t; }

function proj(x, y) {
  var u = (x - COURT.x) / COURT.w, v = (y - COURT.y) / COURT.h;
  var l = lerp(PROJ.tl[0], PROJ.bl[0], v), r = lerp(PROJ.tr[0], PROJ.br[0], v), c = lerp(PROJ.cTop, PROJ.cBot, v);
  return {
    x: u < 0.5 ? lerp(l, c, u * 2) : lerp(c, r, (u - 0.5) * 2),
    y: lerp(PROJ.tl[1], PROJ.bl[1], v),
    s: lerp(PROJ.sTop, PROJ.sBot, v),
  };
}

function newPlayer(side) {
  return {
    side: side, x: side ? COURT.x + COURT.w - 40 : COURT.x + 40, y: COURT.y + COURT.h / 2,
    vx: 0, vy: 0, throwT: 0, charging: false, charge: 0, dashT: 0, dashCd: 0, dashX: 0, dashY: 0, dashMul: 1,
    inv: 0, stun: 0, streak: 0, score: 0, pa: false, pb: false,
  };
}

function newMatch() {
  return {
    time: T.match, sd: false, over: false, winner: -1,
    p: [newPlayer(0), newPlayer(1)], balls: [], puddles: [], ev: [],
  };
}

// Hacia donde mira la cabeza: {v: 'front'|'back'|'side', flip}. El perfil base mira a la derecha; flip lo espeja (izquierda).
// Cargando, lanzando (T.throwShow s) o en dash mira al rival: P1 sin flip, P2 con flip. Si no, manda la x del joystick, luego la y.
function headView(p, inp) {
  var rival = !!p.side;
  if (p.charging || p.dashT > 0 || p.throwT > 0) return { v: 'side', flip: rival };
  if (inp.x) return { v: 'side', flip: inp.x < 0 };
  if (inp.y < 0) return { v: 'back', flip: rival };
  return { v: 'front', flip: rival };
}

// Sin cooldown: puedes lanzar de nuevo cuando tu globo anterior revienta (pared, rival o choque). Un solo globo propio en el aire.
function ready(s, p) {
  for (var i = 0; i < s.balls.length; i++) if (s.balls[i].o === p.side) return false;
  return true;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function stepMatch(s, inputs, dt) {
  s.ev.length = 0;
  var n = Math.max(1, Math.ceil(dt * 60 - 1e-9));
  for (var i = 0; i < n; i++) stepOnce(s, inputs, dt / n);
}

function stepOnce(s, inputs, dt) {
  if (s.over) return;
  for (var i = 0; i < 2; i++) stepPlayer(s, s.p[i], inputs[i], dt);
  stepBalls(s, dt);
  if (!s.sd && !s.over) {
    s.time = Math.max(0, s.time - dt);
    if (s.time === 0) {
      var d = s.p[0].score - s.p[1].score;
      if (d) endMatch(s, d > 0 ? 0 : 1);
      else { s.sd = true; s.ev.push({ k: 'sd' }); }
    }
  }
  for (var j = 0; j < s.puddles.length; j++) s.puddles[j].life -= dt;
  s.puddles = s.puddles.filter(function (q) { return q.life > 0; });
}

function endMatch(s, w) {
  s.over = true;
  s.winner = w;
  s.ev.push({ k: 'end', winner: w });
}

function onPuddle(s, p) {
  for (var i = 0; i < s.puddles.length; i++) {
    var q = s.puddles[i];
    if (Math.hypot(q.x - p.x, q.y - p.y) < q.r) return true;
  }
  return false;
}

function stepPlayer(s, p, inp, dt) {
  p.throwT = Math.max(0, p.throwT - dt);
  p.dashCd = Math.max(0, p.dashCd - dt);
  p.inv = Math.max(0, p.inv - dt);
  p.stun = Math.max(0, p.stun - dt);
  var aEdge = inp.a && !p.pa, bEdge = inp.b && !p.pb;
  p.pa = inp.a;
  p.pb = inp.b;
  var ix = inp.x, iy = inp.y;
  if (p.stun > 0) { ix = iy = 0; aEdge = bEdge = false; }
  var len = ix && iy ? Math.SQRT1_2 : 1;
  var wet = onPuddle(s, p);
  if (bEdge && p.dashCd <= 0 && p.dashT <= 0 && (ix || iy)) {
    p.dashT = T.dashTime;
    p.dashCd = T.dashCd;
    p.inv = Math.max(p.inv, T.dashInv);
    p.dashX = ix * len;
    p.dashY = iy * len;
    p.dashMul = wet ? T.puddleDash : 1;
    p.charging = false;
    p.charge = 0;
    s.ev.push({ k: 'dash', p: p.side });
  }
  if (aEdge && ready(s, p) && p.dashT <= 0) { p.charging = true; p.charge = 0; }
  if (p.charging) {
    if (inp.a) p.charge = Math.min(T.chargeMax, p.charge + dt);
    else if (ready(s, p)) throwBalloon(s, p, inp.y);
    else { p.charging = false; p.charge = 0; }
  }
  if (p.dashT > 0) {
    var st = Math.min(dt, p.dashT), ds = T.dashSpeed * p.dashMul;
    p.vx = p.dashX * ds;
    p.vy = p.dashY * ds;
    p.dashT -= st;
    dt = st;
  } else {
    var sp = T.move * (p.charging ? T.chargeMove : 1) * len;
    var k = wet ? Math.exp(-T.slide * dt) : 0;
    p.vx = ix * sp + (p.vx - ix * sp) * k;
    p.vy = iy * sp + (p.vy - iy * sp) * k;
  }
  var lo = p.side ? MID + 12 : COURT.x + SIDE_PAD, hi = p.side ? COURT.x + COURT.w - SIDE_PAD : MID - 12;
  p.x = clamp(p.x + p.vx * dt, lo, hi);
  p.y = clamp(p.y + p.vy * dt, COURT.y + 10, COURT.y + COURT.h - 6);
}

function throwBalloon(s, p, iy) {
  var dir = p.side ? -1 : 1, c = p.charge / T.chargeMax, big = p.charge >= T.chargeMax;
  s.balls.push({
    o: p.side, x: p.x + dir * 12, y: p.y, vx: dir * T.ball * (1 + (T.chargeMul - 1) * c) * (p.streak >= 2 ? T.rachaSpeed : 1),
    vy: 0, ay: Math.sign(iy) * T.curve, big: big,
  });
  p.throwT = T.throwShow;
  p.charging = false;
  p.charge = 0;
  s.ev.push({ k: 'throw', p: p.side, charged: big });
}

function addPuddle(s, x, y) {
  s.puddles.push({ x: x, y: y, r: T.puddleR, life: T.puddleLife });
}

function stepBalls(s, dt) {
  var bs = s.balls, i, j;
  for (i = 0; i < bs.length; i++) {
    bs[i].x += bs[i].vx * dt;
    bs[i].vy += bs[i].ay * dt;
    bs[i].y += bs[i].vy * dt;
  }
  for (i = 0; i < bs.length; i++) {
    for (j = i + 1; j < bs.length; j++) {
      var a = bs[i], b = bs[j];
      if (a.dead || b.dead || a.o === b.o) continue;
      if (Math.abs(a.x - b.x) < T.clash && Math.abs(a.y - b.y) < T.clash) {
        a.dead = b.dead = true;
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        addPuddle(s, mx, my);
        s.ev.push({ k: 'clash', x: mx, y: my });
      }
    }
  }
  var keep = [];
  for (i = 0; i < bs.length; i++) {
    var c = bs[i];
    if (c.dead) continue;
    var r = s.p[1 - c.o];
    if (r.inv <= 0 && Math.abs(c.x - r.x) < T.hitX && Math.abs(c.y - r.y) < T.hitY) {
      var o = s.p[c.o];
      o.score++;
      o.streak++;
      r.streak = 0;
      r.inv = T.inv;
      r.stun = T.stun;
      r.charging = false;
      r.charge = 0;
      addPuddle(s, c.x, c.y);
      s.ev.push({ k: 'hit', p: c.o, v: r.side });
      if (o.streak === 2) s.ev.push({ k: 'racha', p: c.o });
      if (s.sd && !s.over) endMatch(s, c.o);
      continue;
    }
    if (c.y < COURT.y || c.y > COURT.y + COURT.h || c.x < COURT.x || c.x > COURT.x + COURT.w) {
      addPuddle(s, clamp(c.x, COURT.x + 6, COURT.x + COURT.w - 6), clamp(c.y, COURT.y + 6, COURT.y + COURT.h - 6));
      s.ev.push({ k: 'burst', x: c.x, y: c.y });
      continue;
    }
    keep.push(c);
  }
  s.balls = keep;
}

// CPU
var CPUT = { react: 0.2, err: 16, curveP: 0.3, holdMax: 0.8, dodgeP: 0.4, dashP: 0.5, range: 90, waitMin: 0.5, waitMax: 1.4 };

function rnd(a, b) { return a + Math.random() * (b - a); }

function cpuThink(s, side, mem, dt) {
  var me = s.p[side], opp = s.p[1 - side], out = { x: 0, y: 0, a: false, b: false };
  if (mem.sample === undefined) {
    mem.sample = 0; mem.oy = opp.y; mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax);
    mem.threat = null; mem.plan = null; mem.held = 0;
  }
  mem.sample -= dt;
  if (mem.sample <= 0) { mem.sample = CPUT.react; mem.oy = opp.y; }
  var ymin = COURT.y + 10, ymax = COURT.y + COURT.h - 6;

  // incoming balloon aimed at me
  var th = null, i;
  for (i = 0; i < s.balls.length; i++) {
    var b = s.balls[i], d = (me.x - b.x) * (b.vx > 0 ? 1 : -1);
    if (b.o !== side && d > 0 && d < CPUT.range && (me.x - b.x) * b.vx > 0 && Math.abs(b.y - me.y) < 12) { th = b; break; }
  }
  if (!th) mem.threat = null;
  else {
    if (!mem.threat || mem.threat.b !== th) {
      var dy = th.y >= me.y ? -1 : 1;
      if (me.y + dy * 30 < ymin || me.y + dy * 30 > ymax) dy = -dy;
      mem.threat = { b: th, t: 0, act: Math.random() < CPUT.dodgeP, dash: Math.random() < CPUT.dashP, dy: dy, dashed: false };
    }
    mem.threat.t += dt;
  }
  var tt = mem.threat;
  if (tt && tt.act && tt.t >= CPUT.react) {
    out.y = tt.dy;
    if (tt.dash && !tt.dashed && me.dashCd <= 0) { out.b = true; tt.dashed = true; }
    return out;
  }

  // attack
  if (!ready(s, me) || me.stun > 0) { if (mem.phase !== 'wait') { mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax); } return out; }
  if (mem.phase === 'wait') {
    mem.wait -= dt;
    if (mem.wait > 0) return out;
    mem.plan = { err: rnd(-CPUT.err, CPUT.err), curve: Math.random() < CPUT.curveP ? (Math.random() < 0.5 ? -1 : 1) : 0, hold: rnd(0, CPUT.holdMax) };
    mem.phase = 'aim';
    mem.held = 0;
  }
  var pl = mem.plan, c = pl.hold / T.chargeMax;
  var tm = (Math.abs(opp.x - me.x) - 24) / (T.ball * (1 + (T.chargeMul - 1) * c));
  var ty = mem.oy + pl.err - pl.curve * 0.5 * T.curve * tm * tm;
  if (ty < ymin || ty > ymax) { pl.curve = 0; ty = clamp(mem.oy + pl.err, ymin, ymax); }
  var off = ty - me.y, near = Math.abs(off) < 4;
  if (Math.abs(off) > 3) out.y = Math.sign(off);
  if (mem.phase === 'aim') {
    if (near) { mem.phase = 'hold'; mem.held = 0; out.a = true; }
    return out;
  }
  mem.held += dt;
  if (mem.held > dt * 2 && !me.charging) { mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax); return out; }
  if (mem.held >= pl.hold && (Math.abs(off) < 6 || mem.held > pl.hold + 1)) {
    out.a = false;
    if (pl.curve) out.y = pl.curve;
    mem.phase = 'wait';
    mem.wait = rnd(CPUT.waitMin, CPUT.waitMax);
    return out;
  }
  out.a = true;
  return out;
}

// STORE
var WINS_KEY = 'mojao/v1/wins';
var winsReadOk = true;

function sanitizeWins(v) {
  var o = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return o;
  Object.keys(v).forEach(function (k) {
    var n = v[k];
    if (typeof n === 'number' && Number.isInteger(n) && n > 0) o[k] = n;
  });
  return o;
}

function addWin(w, id) {
  var o = sanitizeWins(w);
  o[id] = (o[id] || 0) + 1;
  return o;
}

function topFaces(w, n) {
  return Object.keys(w).map(function (k) { return [k, w[k]]; })
    .sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : 1); }).slice(0, n);
}

// Personajes elegibles: los 10 del equipo de Platanus, una skin completa cada uno (hoja de 5 cuadros, ver skinFrame).
// sc.faces guarda indices en este arreglo; los records se guardan por id (ids viejos '0'..'7' se ignoran al mostrar).
var FACES = [
  { id: 'joaquin', name: 'JOAQUÍN', key: 'skin-joaquin-stephens' },
  { id: 'raimundo', name: 'RAIMUNDO', key: 'skin-raimundo-herrera' },
  { id: 'paula', name: 'PAULA', key: 'skin-paula-enei' },
  { id: 'aldo', name: 'ALDO', key: 'skin-aldo-del-valle' },
  { id: 'andres', name: 'ANDRÉS', key: 'skin-andres-matte' },
  { id: 'jaime', name: 'JAIME', key: 'skin-jaime-bunzli' },
  { id: 'agustin', name: 'AGUSTÍN', key: 'skin-agustin-feuerhake' },
  { id: 'rafael', name: 'RAFAEL', key: 'skin-rafael-fernandez' },
  { id: 'ignacio', name: 'IGNACIO', key: 'skin-ignacio-bernardo' },
  { id: 'frank', name: 'FRANK', key: 'skin-frank' },
];

function faceOk(id) { return FACES.some(function (f) { return f.id === id; }); }
function faceById(id) { return FACES.filter(function (f) { return f.id === id; })[0]; }
function shortName(f) { return f.name.replace(/^(EL|LA|DON) /, ''); }

async function loadWins() {
  try {
    var st = window.platanusArcadeStorage;
    if (!st) return {};
    var r = await st.get(WINS_KEY);
    return r && r.found ? sanitizeWins(r.value) : {};
  } catch (e) { winsReadOk = false; return {}; }
}

async function saveWins(w) {
  try {
    var st = window.platanusArcadeStorage;
    if (st && winsReadOk) await st.set(WINS_KEY, w);
  } catch (e) { /* sin récords */ }
}

// AUDIO
var AU = { m: null, mus: null, nb: null, next: 0, step: 0 };
var PENTA = [0, 3, 5, 7, 10, 12];
var MEL = ['0..2.3..4.3.2.0.', '2..3.4..5.4.3...', '0.2.3.4.3.2.0...', '4..3.2.3.4.5.4.3.'];
var BASS = [-24, -24, -28, -26, -24, -24, -28, -31];

function actx(sc) {
  var c = sc.sound && sc.sound.context;
  if (!c) return null;
  if (!AU.m) {
    AU.m = c.createGain();
    AU.m.gain.value = 0.55;
    AU.m.connect(c.destination);
    AU.mus = c.createGain();
    AU.mus.connect(AU.m);
  }
  return c;
}

function tone(sc, f0, f1, dur, type, vol, delay, dest) {
  var c = actx(sc);
  if (!c) return;
  var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest || AU.m);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(sc, dur, vol, ftype, freq, delay, dest) {
  var c = actx(sc);
  if (!c) return;
  if (!AU.nb) {
    AU.nb = c.createBuffer(1, c.sampleRate, c.sampleRate);
    var d = AU.nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  var t = c.currentTime + (delay || 0), src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = AU.nb;
  f.type = ftype;
  f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest || AU.m);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

function sfx(sc, name) {
  try {
    if (name === 'throw') tone(sc, 700, 220, 0.13, 'square', 0.12);
    else if (name === 'pop') noise(sc, 0.12, 0.35, 'lowpass', 2200);
    else if (name === 'splash') { noise(sc, 0.3, 0.3, 'lowpass', 900); noise(sc, 0.2, 0.15, 'highpass', 3000, 0.04); }
    else if (name === 'hit') { noise(sc, 0.15, 0.4, 'lowpass', 2500); tone(sc, 140, 50, 0.3, 'sine', 0.5); noise(sc, 0.4, 0.25, 'lowpass', 700, 0.05); }
    else if (name === 'dash') { noise(sc, 0.14, 0.2, 'highpass', 2500); tone(sc, 300, 900, 0.12, 'sawtooth', 0.05); }
    else if (name === 'whistle') {
      for (var i = 0; i < 2; i++) tone(sc, 2500, 2600, 0.22, 'sine', 0.18, i * 0.26);
      tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, 0);
      tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, 0.26);
    }
    else if (name === 'tick') tone(sc, 880, 880, 0.09, 'square', 0.12);
    else if (name === 'racha') [523, 659, 784, 1047].forEach(function (f, k) { tone(sc, f, f, 0.1, 'square', 0.12, k * 0.07); });
  } catch (e) { /* sin audio */ }
}

function chargeSnd(sc, p, dt) {
  sc.chT = (sc.chT || 0) - dt;
  if (sc.chT > 0) return;
  sc.chT = 0.07;
  try { tone(sc, 180 + 520 * p.charge, 200 + 520 * p.charge, 0.08, 'triangle', 0.07); } catch (e) { /* sin audio */ }
}

function musicStep(sc) {
  var c = actx(sc);
  if (!c || c.state !== 'running') return;
  var quiet = sc.phase === 'result';
  AU.mus.gain.setTargetAtTime(quiet ? 0.3 : 1, c.currentTime, 0.3);
  if (AU.next < c.currentTime) AU.next = c.currentTime + 0.05;
  while (AU.next < c.currentTime + 0.2) {
    var st = AU.step % 16, bar = (AU.step / 16 | 0) % 8, dl = AU.next - c.currentTime, d = AU.mus;
    if (st === 0 || st === 7 || st === 10) tone(sc, 130, 38, 0.2, 'sine', 0.55, dl, d);
    if (st === 4 || st === 12) noise(sc, 0.12, 0.28, 'bandpass', 1800, dl, d);
    if (st === 14 || st === 3) noise(sc, 0.05, 0.1, 'bandpass', 2600, dl, d);
    if (st % 2 === 0) noise(sc, 0.03, 0.06, 'highpass', 6000, dl, d);
    if (st % 4 === 0 || st === 10) tone(sc, 440 * Math.pow(2, BASS[bar] / 12), null, 0.2, 'triangle', 0.22, dl, d);
    var ch = MEL[bar % 4][st];
    if (ch !== '.') {
      tone(sc, 440 * Math.pow(2, (PENTA[+ch] + [0, 0, -4, -2][bar % 4]) / 12), null, 0.11, 'square', 0.05, dl, d);
    }
    AU.next += 0.125;
    AU.step++;
  }
}


// DRAW
var FIRE = [0xffd23f, 0xff7a00, 0xff3000];
var FONT = '"Courier New", monospace';
var SKH = 144; // cuadro de una skin; el personaje mide ~136 px de alto con los pies abajo y centrados
var PSCALE = 1.42; // jugadores (skin, sombra, anillos) respecto de la escala de perspectiva de PROJ: ~135 px adelante, ~110 atras
var BSCALE = 1.6; // globos en vuelo (sprite, sombra, estela)
// pantalla de resultado: manda quien gano, no el lado. Los pies a y=462 dejan la placa (y+14 a y+40) por encima del muro del frente y del zinc
var RES_WIN = [270, 462, 1.35], RES_LOSE = [560, 462, 1.1];
function resLayout(w) { return w === 0 ? [RES_WIN, RES_LOSE] : [RES_LOSE, RES_WIN]; }

// Decodifica el texto de 92 simbolos (13 bits por par) a un string binario de n bytes.
function artDec(s, n) {
  var o = '', b = 0, k = 0, i, v;
  function c(j) { var x = s.charCodeAt(j) - 32; return x - (x > 2) - (x > 15) - (x > 60); }
  for (i = 0; i < s.length; i += 2) {
    b = b << 13 | c(i) * 92 + c(i + 1); k += 13;
    while (k >= 8 && o.length < n) { k -= 8; o += String.fromCharCode(b >> k & 255); }
    b &= (1 << k) - 1;
  }
  return o;
}

function artUri(a) { return 'data:image/avif;base64,' + btoa(artDec(a[0], a[1])); }

// Recorta el atlas (11 filas de 48 px, celdas de 45x48, fondo magenta) en una textura por personaje y una para el arbitro.
function cutAtlas(sc) {
  var im = sc.textures.get('atlas').getSourceImage(), cv = document.createElement('canvas'), x = cv.getContext('2d'), r, j, i;
  cv.width = im.width; cv.height = im.height;
  x.drawImage(im, 0, 0);
  var d = x.getImageData(0, 0, cv.width, cv.height), p = d.data;
  for (i = 0; i < p.length; i += 4) {
    var m = Math.min(p[i], p[i + 2]) - p[i + 1];
    if (m > 60) p[i + 3] = 0;
    else if (m > 20) p[i] = p[i + 2] = p[i + 1] + 20;
  }
  x.putImageData(d, 0, 0);
  for (r = 0; r < 11; r++) {
    var key = r < 10 ? FACES[r].key : 'ref', n = r < 10 ? 5 : 3, t = sc.textures.createCanvas(key, 225, 48);
    t.context.drawImage(cv, 0, r * 48, 225, 48, 0, 0, 225, 48);
    for (j = 0; j < n; j++) t.add(j, 0, j * 45, 0, 45, 48);
    t.refresh();
  }
}

function mkTex(sc, key, w, h, fn) {
  var g = sc.make.graphics({ x: 0, y: 0, add: false });
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

function addFrames(sc, key, fw, fh, n) {
  var t = sc.textures.get(key);
  for (var i = 0; i < n; i++) t.add(i, 0, i * fw, 0, fw, fh);
}

// Globo, tobos, tanque, estallido y charcos: todo con Graphics.
function makeTextures(sc) {
  var k, i, a;
  [['balloon', 0x2a5bd7, 0x0e2257], ['balloon2', 0xd72a2a, 0x5a0e0e]].forEach(function (b) {
    mkTex(sc, b[0], 28, 36, function (g) {
      g.fillStyle(b[1], 1).fillEllipse(14, 16, 24, 30);
      g.lineStyle(2, b[2], 1).strokeEllipse(14, 16, 24, 30);
      g.fillStyle(b[2], 1).fillTriangle(14, 30, 9, 36, 19, 36);
      g.lineStyle(2, 0xffffff, 0.75);
      ellArc(g, 14, 16, 8, 11, 3.6, 4.5);
    });
  });
  [['bucket', 0x2a5bd7, 0x5f8cf0], ['bucket2', 0xd72a2a, 0xf0675f]].forEach(function (b) {
    mkTex(sc, b[0], 64, 60, function (g) {
      g.fillStyle(b[1], 1).fillPoints([{ x: 7, y: 18 }, { x: 57, y: 18 }, { x: 50, y: 58 }, { x: 14, y: 58 }], true);
      g.fillStyle(b[2], 1).fillRoundedRect(4, 15, 56, 7, 3);
      g.fillStyle(0x8fd3ff, 1).fillEllipse(32, 17, 46, 9);
      g.fillStyle(0xff4d6d, 1).fillCircle(22, 12, 8);
      g.fillStyle(0xffd23f, 1).fillCircle(41, 10, 8);
      g.fillStyle(0x66dd88, 1).fillCircle(32, 6, 7);
      g.fillStyle(0x8fd3ff, 1).fillRect(14, 17, 36, 4);
      g.fillStyle(0xffffff, 0.5).fillRect(11, 26, 3, 24);
    });
  });
  mkTex(sc, 'tank', 100, 100, function (g) {
    g.fillStyle(0x1a1a1a, 1).fillRoundedRect(8, 12, 76, 88, 12);
    g.fillStyle(0x444444, 0.6).fillRect(15, 22, 5, 70);
    g.fillStyle(0x000000, 0.4).fillRect(68, 22, 14, 74);
    for (i = 0; i < 4; i++) {
      g.fillStyle(0x333333, 1).fillRect(8, 34 + i * 17, 76, 4);
      g.fillStyle(0x000000, 0.5).fillRect(8, 38 + i * 17, 76, 2);
    }
    g.fillStyle(0x2c2c2c, 1).fillEllipse(46, 14, 76, 20);
    g.fillStyle(0x1a1a1a, 1).fillEllipse(46, 13, 58, 13);
    g.fillStyle(0x3a3a3a, 1).fillCircle(46, 12, 7);
    g.fillStyle(0xc0a040, 1).fillRect(84, 80, 12, 6).fillRect(92, 84, 5, 9);
    g.fillStyle(0xe8d070, 1).fillRect(84, 80, 12, 2);
  });
  mkTex(sc, 'burst', 96 * 4, 128, function (g) {
    for (k = 0; k < 4; k++) {
      var cx = k * 96 + 48, n = 8 + k * 2, r = 10 + k * 12;
      if (!k) g.fillStyle(0x8fd3ff, 1).fillCircle(cx, 64, 14).fillStyle(0xffffff, 1).fillCircle(cx - 3, 61, 5);
      else for (i = 0; i < n; i++) {
        a = i / n * 6.283 + k * 0.3;
        g.fillStyle(i % 2 ? 0xffffff : 0x8fd3ff, 1).fillCircle(cx + Math.cos(a) * r, 64 + Math.sin(a) * r * 1.15, Math.max(2.5, 8 - k * 1.6));
      }
      if (k > 1) for (i = 0; i < 6; i++) {
        a = i * 1.05 + 0.5;
        g.fillStyle(0x8fd3ff, 1).fillCircle(cx + Math.cos(a) * (r + 14), 64 + Math.sin(a) * (r + 14) * 1.15, 2);
      }
    }
  });
  addFrames(sc, 'burst', 96, 128, 4);
  mkTex(sc, 'puddle', 160 * 3, 70, function (g) {
    for (k = 0; k < 3; k++) {
      var cx = k * 160 + 80;
      g.fillStyle(0x4aa3df, 0.7);
      g.fillEllipse(cx, 35, 120 + k * 8, 40 - k * 3);
      g.fillEllipse(cx - 34 + k * 14, 30 + k * 4, 70, 46);
      g.fillEllipse(cx + 30 - k * 10, 40 - k * 3, 76, 36 + k * 4);
      if (k) g.fillEllipse(cx + 8 - k * 24, 28, 50, 38);
      g.fillStyle(0xdff3ff, 0.55).fillEllipse(cx - 18, 28, 36, 8);
    }
  });
  addFrames(sc, 'puddle', 160, 70, 3);
}

function flag(g, x, y, k) {
  g.fillStyle(0xffcc00, 1).fillRect(x, y, 24 * k, 6 * k);
  g.fillStyle(0x0033a0, 1).fillRect(x, y + 6 * k, 24 * k, 6 * k);
  g.fillStyle(0xcf142b, 1).fillRect(x, y + 12 * k, 24 * k, 6 * k);
  g.fillStyle(0xffffff, 1);
  for (var i = 0; i < 5; i++) g.fillRect(x + (3 + i * 4) * k, y + 8.5 * k, k, k);
  g.lineStyle(1, 0x000000, 0.8).strokeRect(x, y, 24 * k, 18 * k);
}

function txt(sc, x, y, s, size, color, depth) {
  return sc.add.text(x, y, s, {
    fontFamily: FONT, fontStyle: 'bold', fontSize: size + 'px', color: color || '#ffffff',
    stroke: '#000000', strokeThickness: Math.max(2, size / 6 | 0),
  }).setOrigin(0.5).setDepth(depth || 2100);
}

function popText(sc, x, y, s, color, size) {
  var t = txt(sc, x, y, s, size || 28, color);
  sc.tweens.add({ targets: t, y: y - 44, alpha: 0, duration: 1100, ease: 'Cubic.easeOut', onComplete: function () { t.destroy(); } });
}

// x, y en pantalla (ya proyectados)
function splash(sc, x, y, n, big) {
  var i;
  for (i = 0; i < n; i++) {
    var a = Math.random() * 6.283, v = rnd(60, big ? 240 : 160);
    sc.fx.push({ x: x, y: y - 12, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.5 - rnd(80, 180), life: rnd(0.4, 0.8), c: Math.random() < 0.7 ? 0x8fd3ff : 0xffffff });
  }
  sc.rings.push({ x: x, y: y, r: 4, max: big ? 46 : 26, life: 0.35, t: 0.35 });
}

function burstAt(sc, x, y, k) {
  sc.bursts.push({ t: 0, spr: sc.add.sprite(x, y, 'burst', 0).setOrigin(0.5, 0.7).setScale(k).setDepth(y + 20) });
}

function ellArc(g, cx, cy, rx, ry, a0, a1) {
  g.beginPath();
  for (var i = 0; i <= 20; i++) {
    var a = a0 + (a1 - a0) * i / 20;
    if (i) g.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); else g.moveTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
  }
  g.strokePath();
}

// Franjas amarillas: borde interior (linea blanca) y exterior de cada una segun y, medidos sobre el ambiente (tools/edges.mjs).
// Los logos son pintura del piso: giran siguiendo la franja (la linea inclina ~11 grados) y quedan siempre debajo de las entidades.
function stripEdges(side, y) {
  var t = y - 215;
  return side ? { i: 699 + 0.19 * t, o: Math.min(799, 775 + 0.45 * t) } : { i: 101 - 0.195 * t, o: Math.max(0, 25 - 0.3 * t) };
}

// Cada zona tiene dos columnas (f = distancia desde la linea blanca, como fraccion del ancho de la franja) y empieza en y0.
// Izquierda: el tanque tapa la mitad de atras y las cabillas el frente (y > 398). Derecha: el tobo ocupa la esquina de atras, por fuera.
var SPONSOR_ZONES = [
  { side: 0, cols: [{ f: 0.27, y0: 305, h: 10, items: ['ANTHROPIC'] }, { f: 0.75, y0: 305, h: 9, items: ['CASHEA', 'TXT'] }] },
  { side: 1, cols: [{ f: 0.27, y0: 222, h: 13, items: ['YUMMY', 'ELEVENLABS', 'KAPSO'] }, { f: 0.75, y0: 272, h: 13, items: ['VERCEL', 'RENDER', 'TXT'] }] },
];

function paintSponsors(sc) {
  SPONSOR_ZONES.forEach(function (z) {
    var rot = (z.side ? -101 : 101) * Math.PI / 180;
    z.cols.forEach(function (c) {
      var y = c.y0;
      c.items.forEach(function (k) {
        var tx = k === 'TXT', yy = y + 20, e = stripEdges(z.side, yy), kk = 0.9 + 0.3 * Math.max(0, Math.min(1, (yy - 215) / 222));
        var sw = Math.abs(e.o - e.i);
        var o = sc.add.text(0, 0, tx ? 'PLATANUS\nHACK 26' : k, { fontFamily: FONT, fontStyle: 'bold', fontSize: tx ? '9px' : '20px', color: '#141414', align: 'center' }).setOrigin(0.5);
        var w = o.width, hh = o.height, sc0 = (tx ? 1 : c.h / hh) * kk;
        var len = w * sc0;
        if (hh * sc0 > sw * 0.42) { sc0 = sw * 0.42 / hh; len = w * sc0; }
        var cy = y + len / 2, e2 = stripEdges(z.side, cy), sw2 = Math.abs(e2.o - e2.i);
        o.setPosition(Math.round(z.side ? e2.i + sw2 * c.f : e2.i - sw2 * c.f), Math.round(cy)).setScale(sc0).setRotation(rot).setAlpha(0.85).setDepth(1.5);
        y += len + 7;
      });
    });
  });
}

function crowdJump(sc) {
  if (sc.crowdTw && sc.crowdTw.isPlaying()) return;
  sc.crowdTw = sc.tweens.add({ targets: sc.crowd, y: -3, duration: 90, yoyo: true });
}

function buildStatic(sc) {
  sc.add.image(0, 0, 'ambient').setOrigin(0).setScale(2).setDepth(0);
  // los vecinos son los de la original: un recorte del mismo ambiente que salta entero (3 px) cuando hay un impacto o una racha
  sc.crowd = sc.add.image(0, 0, 'ambient').setOrigin(0).setScale(2).setCrop(20, 50, 375, 37).setDepth(1);
  paintSponsors(sc);
  // un solo tanque, apoyado en la esquina de atras-izquierda sobre el muro del fondo y el lateral (fuera de la cancha), con el tobo de P1 bajo la llave; detras de los jugadores
  sc.add.image(7, 255, 'tank').setOrigin(0, 1).setScale(0.85).setDepth(2);
  sc.add.image(80, 266, 'bucket').setOrigin(0.5, 1).setScale(0.8).setDepth(2);
  // tobo de P2 en la esquina de atras de la zona amarilla derecha
  sc.add.image(771, 265, 'bucket2').setOrigin(0.5, 1).setScale(0.8).setDepth(265);
  sc.refBucket = sc.add.image(452, 526, 'bucket').setOrigin(0.5, 1).setDepth(526);
}

function buildActors(sc) {
  sc.body = []; sc.tag = []; sc.hb = []; sc.bspr = []; sc.pspr = []; sc.bursts = []; sc.fx = []; sc.rings = []; sc.wetT = [0, 0]; sc.throwT = [0, 0]; sc.celT = [0, 0]; sc.dropT = [0, 0];
  sc.inp = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  for (var i = 0; i < 2; i++) {
    sc.body.push(sc.add.sprite(0, 0, FACES[i].key, 0).setOrigin(0.5, 1).setFlipX(i === 1));
    sc.tag.push(txt(sc, 0, 0, 'P' + (i + 1), 16, i ? '#ff5d6d' : '#4d9dff', 0));
    sc.hb.push(sc.add.image(0, 0, i ? 'balloon2' : 'balloon').setVisible(false));
  }
  sc.ref = sc.add.sprite(CX, 528, 'ref', 0).setOrigin(0.5, 1).setScale(3).setDepth(528);
  sc.refT = 0;
  sc.gB = sc.add.graphics().setDepth(3);
  sc.gT = sc.add.graphics().setDepth(4);
  sc.gF = sc.add.graphics().setDepth(900);
}

function box(g, x, y, w, h) {
  g.fillStyle(0x0d1030, 1).fillRoundedRect(x, y, w, h, 6);
  g.lineStyle(3, 0x6c7bd9, 1).strokeRoundedRect(x, y, w, h, 6);
  g.lineStyle(1, 0x000000, 1).strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, 7);
}

function buildHud(sc) {
  var g = sc.add.graphics().setDepth(2000);
  sc.hudG = g;
  box(g, 208, 14, 138, 50);
  box(g, 346, 8, 108, 62);
  box(g, 454, 14, 138, 50);
  flag(g, 216, 27, 1.2);
  flag(g, 555, 27, 1.2);
  sc.hud = {
    p1: txt(sc, 274, 39, 'P1', 22, '#4d9dff'), p2: txt(sc, 526, 39, 'P2', 22, '#ff5d6d'),
    s1: txt(sc, 322, 39, '00', 32, '#ffc21f'), s2: txt(sc, 478, 39, '00', 32, '#ffc21f'),
    n1: txt(sc, 274, 58, '', 10, '#4d9dff'), n2: txt(sc, 526, 58, '', 10, '#ff5d6d'),
    tl: txt(sc, 400, 24, 'TIEMPO', 16, '#ffffff'),
    tm: txt(sc, 400, 50, '60', 30, '#ffc21f'), lb: txt(sc, 400, 92, '', 20, '#ffffff'),
  };
  sc.hudObjs = [g, sc.hud.p1, sc.hud.p2, sc.hud.s1, sc.hud.s2, sc.hud.tm, sc.hud.tl, sc.hud.n1, sc.hud.n2];
}

// Cuadro de la skin: 0 quieto de lado, 1 correr, 2 lanzar, 3 de frente, 4 de espaldas (los de lado miran a la derecha).
// Los cuadros de accion miran al rival: P1 sin flip, P2 con flip. El resto de la animacion sale de poseFx.
function skinFrame(sc, s, i, p, hw) {
  var rival = i === 1, mv = Math.abs(p.vx) + Math.abs(p.vy) > 8;
  if (sc.phase === 'result') return { f: s.winner === i ? 3 : 4, flip: false };
  if (p.stun > 0 || p.charging) return { f: 0, flip: rival };
  if (p.dashT > 0) return { f: 1, flip: rival };
  if (sc.throwT[i] > 0) return { f: 2, flip: rival };
  if (sc.celT && sc.celT[i] > 0) return { f: 3, flip: false };
  if (hw.v === 'side') return { f: mv ? (sc.t * 8 | 0) % 2 : 0, flip: hw.flip };
  return { f: hw.v === 'front' ? 3 : 4, flip: false };
}

// Animacion por codigo sobre el cuadro f: respira en reposo (sy 1 a 1.03, ~1.1 Hz, P2 desfasado), rebota al caminar,
// tiembla +-2 px mojado, se inclina al cargar y en dash, se estira al lanzar y salta al celebrar o ganar.
function poseFx(sc, i, p, f, S) {
  var o = { sx: 1, sy: 1, dx: 0, dy: 0, rot: 0 }, t = sc.t, mv = Math.abs(p.vx) + Math.abs(p.vy) > 8;
  if (sc.phase === 'result') {
    if (f === 3) o.dy = -6 * S * Math.abs(Math.sin(Math.PI * t * 5));
    else o.sy = 0.96;
  } else if (p.stun > 0) o.dx = (t * 40 | 0) % 2 ? 2 : -2;
  else if (p.dashT > 0) { o.rot = 0.25; o.sx = 1.1; o.sy = 0.92; }
  else if (p.charging) o.rot = -0.12;
  else if (sc.throwT[i] > 0) o.sx = 0.3 - sc.throwT[i] < 0.08 ? 1.08 : 1;
  else if (f === 3 && sc.celT[i] > 0) o.dy = -6 * S * Math.abs(Math.sin(Math.PI * t * 5));
  else if (!mv) o.sy = 1 + 0.03 * (0.5 - 0.5 * Math.cos(6.2832 * 1.1 * t + i * Math.PI));
  else if (f < 2) o.dy = -2 * S * Math.abs(Math.sin(Math.PI * t * 8));
  else { o.dy = -2 * S * Math.abs(Math.sin(Math.PI * t * 6)); o.rot = (t * 6 | 0) % 2 ? 0.06 : -0.06; }
  return o;
}

// Arbitro: pitando alterna 0/1, en un punto alterna 1/2 y señala hacia quien anoto
function refPose(sc) {
  if (!(sc.refT > 0)) return { f: 0, flip: false };
  var k = sc.t * (sc.refMode === 'point' ? 5 : 6) | 0;
  return sc.refMode === 'point' ? { f: 1 + k % 2, flip: sc.refFlip } : { f: k % 2, flip: false };
}

// gotas y anillos: sobre el velo del resultado (2500) y bajo los jugadores solo durante la partida
function fxDepth(sc) { return sc.phase === 'result' ? 2700 : 900; }

function render(sc, dt) {
  var s = sc.s, g = sc.gB, tg = sc.gT, f = sc.gF, i, k;
  g.clear(); tg.clear(); f.clear();
  f.setDepth(fxDepth(sc));
  if (!s) return;
  var livep = {};
  for (i = 0; i < s.puddles.length; i++) {
    var q = s.puddles[i], fade = Math.min(1, q.life / 1.2), pq = proj(q.x, q.y);
    if (!q.spr) { q.f = Math.random() * 3 | 0; q.spr = sc.add.image(0, 0, 'puddle', q.f).setDepth(2); sc.pspr.push(q); }
    q.spr.setPosition(Math.round(pq.x), Math.round(pq.y)).setScale(pq.s * q.r / 10).setAlpha(0.9 * fade).setVisible(sc.phase !== 'result');
    livep[i] = 1;
  }
  sc.pspr = sc.pspr.filter(function (q) {
    if (s.puddles.indexOf(q) < 0) { q.spr.destroy(); return false; }
    return true;
  });
  var res = sc.phase === 'result';
  for (i = 0; i < 2; i++) {
    var p = s.p[i], b = sc.body[i], pr = proj(p.x, p.y);
    var RL = res ? resLayout(s.winner)[i] : null;
    var X = res ? RL[0] : pr.x, Y = res ? RL[1] : pr.y, S = res ? RL[2] : pr.s * PSCALE, col = i ? 0xff4d4d : 0x4d8dff;
    if (sc.showAct) g.fillStyle(0x000000, 0.4).fillEllipse(X, Y, 62 * S, 18 * S);
    if (sc.phase === 'play') {
      // anillo bajo los pies (ya no hay franelilla que distinga a P1 de P2): lleno si puede lanzar, tenue mientras su globo vuela
      g.lineStyle(3, col, ready(s, p) ? 0.95 : 0.3);
      ellArc(g, X, Y, 34 * S, 11 * S, -1.5708, -1.5708 + 6.2832);
    }
    if (p.charging && sc.phase === 'play') g.lineStyle(2, p.charge >= T.chargeMax && (sc.t * 16 | 0) % 2 ? 0xffee58 : 0xffffff, 0.9).strokeEllipse(X, Y - 38 * S, (30 + 50 * p.charge) * S, (30 + 50 * p.charge) * S);
    var hw = res ? { v: 'front', flip: i === 1 } : headView(p, sc.inp[i]);
    var sk = skinFrame(sc, s, i, p, hw), flip = sk.flip;
    var fxp = poseFx(sc, i, p, sk.f, S);
    b.setFrame(sk.f).setFlipX(flip).setScale(S * 3 * fxp.sx, S * 3 * fxp.sy).setRotation(flip ? -fxp.rot : fxp.rot).setPosition(Math.round(X + fxp.dx), Math.round(Y + fxp.dy)).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(Math.round(X), Math.round(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.charging ? [-30, -95, 0.7 + 0.5 * p.charge / T.chargeMax] : sk.f === 2 && sc.throwT[i] > 0.2 ? [-40, -90, 0.7] : null);
    sc.hb[i].setVisible(!!hd);
    if (hd) sc.hb[i].setScale(S * hd[2]).setPosition(Math.round(X + (flip ? -hd[0] : hd[0]) * S), Math.round(Y + hd[1] * S)).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
    var drip = res && s.winner !== i, wet = sc.wetT[i] > 0 || drip, blink = sc.wetT[i] > 0 && (sc.t * 14 | 0) % 2;
    b.setAlpha(blink ? 0.35 : 1);
    if (wet) b.setTint(0x88bbff); else b.clearTint();
    sc.wetT[i] = Math.max(0, sc.wetT[i] - dt);
    sc.throwT[i] = Math.max(0, sc.throwT[i] - dt);
    sc.celT[i] = Math.max(0, sc.celT[i] - dt);
    if (wet) {
      sc.dropT[i] -= dt;
      if (sc.dropT[i] <= 0) { sc.dropT[i] = 0.05; sc.fx.push({ x: X + rnd(-12, 12) * S, y: Y - 120 * S, vx: rnd(-16, 16), vy: 0, life: 0.5, c: 0x8fd3ff }); }
    }
  }
  for (i = 0; i < s.balls.length; i++) {
    var ba = s.balls[i], bp = proj(ba.x, ba.y), sz = (ba.big ? T.chargeScale : 1) * BSCALE, lift = 22 * bp.s * PSCALE;
    if (!ba.spr) {
      ba.fire = s.p[ba.o].streak >= 2; ba.tr = [];
      ba.spr = sc.add.image(0, 0, ba.o ? 'balloon2' : 'balloon').setOrigin(0.5, 0.5);
      sc.bspr.push(ba);
    }
    ba.tr.push([bp.x, bp.y - lift]);
    if (ba.tr.length > 9) ba.tr.shift();
    g.fillStyle(0x000000, 0.35).fillEllipse(bp.x, bp.y, 24 * bp.s * sz, 8 * bp.s * sz);
    ba.spr.setScale(bp.s * sz).setPosition(Math.round(bp.x), Math.round(bp.y - lift)).setDepth(bp.y + 12);
    if (ba.fire || ba.ay) {
      for (k = 0; k < ba.tr.length - 1; k++) {
        var t = ba.tr[k], a = (k + 1) / ba.tr.length;
        if (ba.fire) tg.fillStyle(FIRE[(k + (sc.t * 20 | 0)) % 3], a * 0.8).fillCircle(t[0], t[1], (2 + a * 7) * sz * bp.s);
        else tg.fillStyle(0xdff3ff, a * 0.6).fillCircle(t[0], t[1], (2 + a * 5) * sz * bp.s);
      }
    }
  }
  sc.bspr = sc.bspr.filter(function (ba) {
    if (s.balls.indexOf(ba) < 0) { ba.spr.destroy(); return false; }
    return true;
  });
  for (i = sc.bursts.length - 1; i >= 0; i--) {
    var bu = sc.bursts[i];
    bu.t += dt;
    if (bu.t >= 0.4) { bu.spr.destroy(); sc.bursts.splice(i, 1); } else bu.spr.setFrame(Math.min(3, bu.t / 0.1 | 0));
  }
  for (i = sc.fx.length - 1; i >= 0; i--) {
    var d = sc.fx[i];
    d.life -= dt; d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
    if (d.life <= 0) { sc.fx.splice(i, 1); continue; }
    f.fillStyle(d.c, Math.min(1, d.life * 3)).fillRect(Math.round(d.x), Math.round(d.y), 4, 4);
  }
  for (i = sc.rings.length - 1; i >= 0; i--) {
    var r = sc.rings[i];
    r.t -= dt;
    if (r.t <= 0) { sc.rings.splice(i, 1); continue; }
    var u = 1 - r.t / r.life;
    f.lineStyle(3, 0xdff3ff, 1 - u).strokeEllipse(r.x, r.y - 8, 2 * (4 + r.max * u), 2 * (4 + r.max * u) * 0.45);
  }
  sc.refT = Math.max(0, sc.refT - dt);
  var rp = refPose(sc);
  sc.ref.setFrame(rp.f).setFlipX(rp.flip);
  var h1 = sc.hud;
  h1.s1.setText(('0' + s.p[0].score).slice(-2));
  h1.s2.setText(('0' + s.p[1].score).slice(-2));
  h1.tm.setText(s.sd ? '--' : ('0' + Math.ceil(s.time)).slice(-2));
  h1.lb.setText(s.sd ? '¡MUERTE SÚBITA!' : '').setVisible(!s.sd || (sc.t * 3 | 0) % 2 === 0);
}

function onEvents(sc, evs) {
  var s = sc.s;
  for (var i = 0; i < evs.length; i++) {
    var e = evs[i], q;
    if (e.k === 'throw') { sc.throwT[e.p] = 0.3; sfx(sc, 'throw'); }
    else if (e.k === 'burst') {
      sfx(sc, 'pop');
      q = proj(clamp(e.x, COURT.x, COURT.x + COURT.w), clamp(e.y, COURT.y, COURT.y + COURT.h));
      splash(sc, q.x, q.y, 10, false); burstAt(sc, q.x, q.y, 0.7 * q.s);
    } else if (e.k === 'clash') {
      q = proj(e.x, e.y);
      sfx(sc, 'pop'); sfx(sc, 'splash'); splash(sc, q.x, q.y - 22 * q.s, 30, true); burstAt(sc, q.x, q.y - 22 * q.s, 1.2 * q.s);
      popText(sc, q.x, q.y - 50, '¡CHOQUE!', '#ffffff', 20);
    } else if (e.k === 'hit') {
      var v = s.p[e.v];
      q = proj(v.x, v.y);
      sfx(sc, 'hit');
      sc.wetT[e.v] = T.inv;
      splash(sc, q.x, q.y - 40 * q.s * PSCALE, 36, true); burstAt(sc, q.x, q.y - 30 * q.s * PSCALE, 1.3 * q.s * PSCALE);
      popText(sc, q.x, q.y - 130 * q.s * PSCALE, '¡MOJAO!', '#8fd3ff', 28);
      sc.refMode = 'point'; sc.refFlip = e.p === 0; sc.refT = 1;
      sc.celT[e.p] = 0.4;
      crowdJump(sc);
    } else if (e.k === 'racha') { q = proj(s.p[e.p].x, s.p[e.p].y); sfx(sc, 'racha'); crowdJump(sc); popText(sc, q.x, q.y - 140 * q.s * PSCALE, '¡EN RACHA!', '#ff9a3c', 24); }
    else if (e.k === 'dash') { var d = s.p[e.p]; q = proj(d.x, d.y); sfx(sc, 'dash'); splash(sc, q.x, q.y, 6, false); }
    else if (e.k === 'sd') { sfx(sc, 'whistle'); popText(sc, CX, 340, '¡MUERTE SÚBITA!', '#ffd23f', 36); }
    else if (e.k === 'end') { sfx(sc, 'whistle'); sc.refMode = 'whistle'; sc.refT = 1; }
  }
}

// FLOW
function readInput(sc, side) {
  var h = sc.held, P = side ? 'P2_' : 'P1_';
  return { x: (h[P + 'R'] ? 1 : 0) - (h[P + 'L'] ? 1 : 0), y: (h[P + 'D'] ? 1 : 0) - (h[P + 'U'] ? 1 : 0), a: !!h[P + '1'], b: !!h[P + '2'] };
}

function ui(sc, o) { sc.ui.push(o); return o; }
function utx(sc, x, y, t, size, color) { return ui(sc, txt(sc, x, y, t, size, color, 3000)); }
function clearUi(sc) { sc.ui.forEach(function (o) { o.destroy(); }); sc.ui = []; }

function showActors(sc, v) {
  sc.showAct = v;
  for (var i = 0; i < 2; i++) { sc.body[i].setVisible(v); sc.tag[i].setVisible(v); sc.hb[i].setVisible(false); }
  sc.hudObjs.forEach(function (o) { o.setVisible(v); });
  sc.hud.lb.setVisible(v);
  sc.ref.setVisible(v); sc.refBucket.setVisible(v);
}

function resetView(sc) {
  if (sc.bspr) sc.bspr.forEach(function (b) { b.spr.destroy(); });
  sc.bspr = [];
  sc.fx = [];
  sc.rings = [];
  sc.wetT = [0, 0];
  sc.s = newMatch();
  sc.mem = [{}, {}];
  sc.refT = 0;
}

function pressed(sc, c) { return !!sc.edge[c]; }
function anyPressed(sc, list) { return list.some(function (c) { return pressed(sc, c); }); }
var JOIN = [['START1', 'P1_1'], ['START2', 'P2_1']];

function setPhase(sc, ph) {
  clearUi(sc);
  sc.phase = ph;
  sc.pt = 0;
  if (ph === 'title') buildTitle(sc);
  else if (ph === 'select') buildSelect(sc);
  else if (ph === 'count') { resetView(sc); for (var i = 0; i < 2; i++) sc.body[i].setTexture(FACES[sc.faces[i]].key); showActors(sc, true); sc.hud.n1.setText(shortName(FACES[sc.faces[0]])); sc.hud.n2.setText(shortName(FACES[sc.faces[1]])); sc.ref.setFrame(0); sc.lastCnt = -1; }
  else if (ph === 'result') buildResult(sc);
}

function buildTitle(sc) {
  clearUi(sc);
  resetView(sc);
  // como recien encendido: publico quieto y la musica del titulo desde el compas 1
  if (sc.crowdTw) sc.crowdTw.stop();
  sc.crowd.setY(0);
  AU.step = 0;
  showActors(sc, false);
  sc.hum = [false, false];
  sc.cpuSide = [false, false];
  ui(sc, sc.add.text(CX, 130, '¡MOJAO!', { fontFamily: FONT, fontStyle: 'bold', fontSize: '80px', color: '#8fd3ff', stroke: '#0d1030', strokeThickness: 12 }).setOrigin(0.5).setShadow(0, 6, '#000000', 0, true, true).setDepth(3000));
  utx(sc, CX, 200, 'PLATANUS HACK 26 · CARACAS', 16, '#ffffff');
  sc.pressTxt = utx(sc, CX, 268, 'PRESIONA START', 30, '#ffffff');
  var g = ui(sc, sc.add.graphics().setDepth(2999));
  g.fillStyle(0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  utx(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f');
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) utx(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22, '#ffffff');
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    // recorte de la cabeza del cuadro 3 (de frente)
    ui(sc, sc.add.image(x, 405 + 12 * 3.45, f.key, 3).setCrop(6, 2, 32, 20).setScale(3.45).setDepth(3000));
    utx(sc, x, 462, f.name, 13, '#ffffff');
    utx(sc, x, 488, 'x' + e[1], 22, '#ffd23f');
  });
  ui(sc, sc.add.graphics().setDepth(2999)).fillStyle(0x000000, 0.65).fillRoundedRect(CX - 340, 518, 680, 74, 10);
  utx(sc, CX, 536, 'PATROCINAN', 16, '#ffffff');
  utx(sc, CX, 566, 'ANTHROPIC · YUMMY · CASHEA · ELEVENLABS · KAPSO · VERCEL · RENDER', 13, '#ffffff');
}

function buildSelect(sc) {
  showActors(sc, false);
  sc.sel = { cur: [0, 3], conf: [false, false], t0: sc.t };
  utx(sc, CX, 108, 'ESCOGE TU PLATANUS', 32, '#ffd23f');
  var g = ui(sc, sc.add.graphics().setDepth(2999));
  g.fillStyle(0x000000, 0.6).fillRoundedRect(CX - 280, 130, 560, 284, 10);
  FACES.forEach(function (f, i) {
    var c = selPos(i);
    g.fillStyle(0x2a2f4d, 0.9).fillRoundedRect(c[0] - SEL_W, c[1] - SEL_H, SEL_W * 2, SEL_H * 2, 6);
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 3).setOrigin(0.5, 1).setScale(2.1).setDepth(3000));
    utx(sc, c[0], c[1] + 52, f.name, 11, '#ffffff');
  });
  sc.curG = ui(sc, sc.add.graphics().setDepth(3001));
  sc.stat = [utx(sc, CX - 176, 436, '', 20, '#8fb6ff'), utx(sc, CX + 176, 436, '', 20, '#ff8f8f')];
  sc.nm = [utx(sc, CX - 176, 464, '', 22, '#ffffff'), utx(sc, CX + 176, 464, '', 22, '#ffffff')];
  sc.cdTxt = utx(sc, CX, 504, '', 22, '#ffffff');
}

var SEL_COLS = 5, SEL_ROWS = 2, SEL_W = 52, SEL_H = 64; // cuadricula 5x2, celdas de 104x128 px
function selPos(i) { return [CX - 2 * 108 + (i % SEL_COLS) * 108, 204 + (i / SEL_COLS | 0) * 136]; }

function selectStep(sc, dt) {
  var sel = sc.sel, i, joined = [false, false];
  for (i = 0; i < 2; i++) {
    if (!sc.hum[i] && !sc.cpuSide[i] && anyPressed(sc, JOIN[i])) { sc.hum[i] = true; joined[i] = true; }
    if (!sc.hum[i] || sel.conf[i]) { if (sc.hum[i] && sel.conf[i] && !joined[i] && pressed(sc, 'P' + (i + 1) + '_2')) sel.conf[i] = false; continue; }
    var P = 'P' + (i + 1) + '_', c = sel.cur[i] % SEL_COLS, r = sel.cur[i] / SEL_COLS | 0;
    if (pressed(sc, P + 'L')) c = (c + SEL_COLS - 1) % SEL_COLS;
    if (pressed(sc, P + 'R')) c = (c + 1) % SEL_COLS;
    if (pressed(sc, P + 'U')) r = (r + SEL_ROWS - 1) % SEL_ROWS;
    if (pressed(sc, P + 'D')) r = (r + 1) % SEL_ROWS;
    sel.cur[i] = r * SEL_COLS + c;
    if (!joined[i] && pressed(sc, P + '1')) sel.conf[i] = true;
  }
  var nh = (sc.hum[0] ? 1 : 0) + (sc.hum[1] ? 1 : 0), left = 5 - (sc.t - sel.t0);
  var o = sc.hum[0] ? 1 : 0;
  if (nh === 1 && left <= 0 && !sc.cpuSide[o]) {
    sc.cpuSide[o] = true;
    sel.cur[o] = Math.random() * FACES.length | 0;
    sel.conf[o] = true;
  }
  sc.curG.clear();
  for (i = 0; i < 2; i++) {
    if (!sc.hum[i] && !sc.cpuSide[i]) continue;
    var q = selPos(sel.cur[i]), ins = i * 5, hw = SEL_W - ins, hh = SEL_H - ins;
    sc.curG.lineStyle(4, i ? 0xff4d4d : 0x4d8dff, sel.conf[i] ? 1 : ((sc.t * 6 | 0) % 2 ? 1 : 0.5));
    sc.curG.strokeRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
    if (sel.conf[i]) sc.curG.fillStyle(i ? 0xff4d4d : 0x4d8dff, 0.25).fillRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
  }
  for (i = 0; i < 2; i++) {
    sc.nm[i].setText(sc.hum[i] || sc.cpuSide[i] ? FACES[sel.cur[i]].name : '');
    sc.stat[i].setText('P' + (i + 1) + ': ' + (sc.cpuSide[i] ? 'CPU' : !sc.hum[i] ? 'PRESIONA START' : sel.conf[i] ? '¡LISTO!' : 'ELIGE CON A'));
  }
  sc.cdTxt.setText(nh === 1 && !sc.cpuSide[o] ? 'LA CPU ENTRA EN ' + Math.max(0, Math.ceil(left)) : '');
  if ((sc.hum[0] || sc.cpuSide[0]) && (sc.hum[1] || sc.cpuSide[1]) && sel.conf[0] && sel.conf[1]) {
    sc.faces = [sel.cur[0], sel.cur[1]];
    setPhase(sc, 'count');
  }
}

function playStep(sc, dt) {
  var s = sc.s, inp = [];
  for (var i = 0; i < 2; i++) inp.push(sc.cpuSide[i] ? cpuThink(s, i, sc.mem[i], dt) : readInput(sc, i));
  sc.inp = inp;
  stepMatch(s, inp, dt);
  onEvents(sc, s.ev);
  if (s.over) { sc.phase = 'ending'; sc.pt = 0; }
}

function countStep(sc, dt) {
  var n = Math.floor(sc.pt);
  if (n !== sc.lastCnt && n < 3) {
    sc.lastCnt = n;
    sfx(sc, 'tick');
    var t = txt(sc, CX, 300, String(3 - n), 96, '#ffd23f');
    sc.tweens.add({ targets: t, scale: 1.6, alpha: 0, duration: 900, onComplete: function () { t.destroy(); } });
  }
  if (sc.pt >= 3) {
    var a = txt(sc, CX, 300, '¡AGUA!', 84, '#8fd3ff');
    sc.tweens.add({ targets: a, scale: 1.5, alpha: 0, duration: 1000, onComplete: function () { a.destroy(); } });
    sc.refMode = 'whistle'; sc.refT = 0.8;
    sfx(sc, 'whistle');
    sc.phase = 'play';
  }
}

function resultTitle(sc, s) {
  var w = s.winner;
  return { title: '¡GANÓ ' + FACES[sc.faces[w]].name + '!', color: w ? '#ff8f8f' : '#8fb6ff', sub: sc.cpuSide[0] || sc.cpuSide[1] ? 'P' + (sc.cpuSide[1] ? 2 : 1) + ' · CPU' : '' };
}

function buildResult(sc) {
  var s = sc.s, w = s.winner, g = ui(sc, sc.add.graphics().setDepth(2500)), T0 = resultTitle(sc, s), L = resLayout(w);
  s.balls = [];
  sc.rings = [];
  sc.ref.setVisible(false); sc.refBucket.setVisible(false);
  g.fillStyle(0x000000, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 215, T0.title, 44, T0.color);
  if (T0.sub) utx(sc, CX, 248, T0.sub, 16, '#ffffff');
  utx(sc, CX, 284, ('0' + s.p[0].score).slice(-2) + ' - ' + ('0' + s.p[1].score).slice(-2), 50, '#ffffff');
  for (var k = 0; k < 2; k++) {
    var t = ui(sc, txt(sc, L[k][0], L[k][1] + 27, FACES[sc.faces[k]].name, 20, k ? '#ff8f8f' : '#8fb6ff', 3002)), pw = t.width + 24;
    ui(sc, sc.add.graphics().setDepth(3001)).fillStyle(0x0d1030, 0.92).fillRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5).lineStyle(3, k ? 0xff4d4d : 0x4d8dff, 1).strokeRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5);
  }
  sfx(sc, 'racha'); sfx(sc, 'splash');
  splash(sc, L[w][0], L[w][1], 40, true);
  if (!sc.cpuSide[w]) { sc.wins = addWin(sc.wins, FACES[sc.faces[w]].id); saveWins(sc.wins); }
}

// El resultado dura 6 s, sin aceptar entradas, y vuelve solo al titulo
function resultNext(sc) { return sc.pt >= 6 ? 'title' : null; }

function resultStep(sc, dt) {
  crowdJump(sc);
  if (sc.pt < 1) {
    var wl = resLayout(sc.s.winner)[sc.s.winner];
    for (var k = 0; k < 2; k++) sc.fx.push({ x: wl[0] + rnd(-90, 90), y: wl[1] - rnd(150, 260), vx: rnd(-20, 20), vy: rnd(0, 60), life: rnd(0.5, 0.9), c: Math.random() < 0.7 ? 0x8fd3ff : 0xffffff });
    if (Math.random() < 0.15) splash(sc, wl[0] + rnd(-80, 80), wl[1] - rnd(0, 40), 8, false);
  }
  var nx = resultNext(sc);
  if (nx) setPhase(sc, nx);
}

function titleStep(sc, dt) {
  sc.pressTxt.setVisible((sc.pt * 2 | 0) % 2 === 0);
  var j = false;
  for (var i = 0; i < 2; i++) if (anyPressed(sc, JOIN[i])) { sc.hum[i] = true; j = true; }
  if (j) { sc.edge = {}; setPhase(sc, 'select'); }
}

function flowStep(sc, dt) {
  sc.pt += dt;
  var ph = sc.phase;
  if (ph === 'title') titleStep(sc, dt);
  else if (ph === 'select') selectStep(sc, dt);
  else if (ph === 'count') countStep(sc, dt);
  else if (ph === 'play') playStep(sc, dt);
  else if (ph === 'ending') { if (sc.pt >= 1.6) setPhase(sc, 'result'); }
  else if (ph === 'result') resultStep(sc, dt);
}

// SCENE
const config = {
  type: Phaser.AUTO,
  width: GW,
  height: GH,
  zoom: 1,
  pixelArt: true,
  parent: 'game-root',
  backgroundColor: '#28242a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  var sc = this;
  sc.load.image('ambient', artUri(ART.ambient));
  sc.load.image('atlas', artUri(ART.atlas));
}

function create() {
  var sc = this;
  sc.held = {};
  sc.edge = {};
  sc.t = 0;
  document.addEventListener('keydown', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (!c) return;
    var ac = sc.sound && sc.sound.context;
    if (ac && ac.state === 'suspended') ac.resume();
    if (!sc.held[c]) sc.edge[c] = true;
    sc.held[c] = true;
  });
  document.addEventListener('keyup', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (c) sc.held[c] = false;
  });
  cutAtlas(sc);
  makeTextures(sc);
  buildStatic(sc);
  buildActors(sc);
  buildHud(sc);
  sc.wins = {};
  sc.ui = [];
  sc.faces = [0, 1];
  sc.hum = [false, false];
  sc.cpuSide = [false, false];
  setPhase(sc, 'title');
  loadWins().then(function (w) { sc.wins = w; if (sc.phase === 'title') buildTitle(sc); });
  if (window.__MOJAO_DEBUG) window.__mojao = sc;
}

function update(time, delta) {
  var sc = this, dt = Math.min(delta / 1000, 0.05);
  sc.t += dt;
  flowStep(sc, dt);
  if (sc.phase === 'play') for (var q = 0; q < 2; q++) if (sc.s.p[q].charging) chargeSnd(sc, sc.s.p[q], dt);
  musicStep(sc);
  render(sc, dt);
  sc.edge = {};
}
})();
