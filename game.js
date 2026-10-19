// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.

(function () {
var mAbs = Math.abs, mMax = Math.max, mMin = Math.min, mRound = Math.round, mRand = Math.random, mSin = Math.sin, mCos = Math.cos, mCeil = Math.ceil;
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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  %4OB?>eb=p{OOUSy3t%R]BURmTi!-d6--F???hs}x7<#JuJ]@~'5D^g!Mf[JD#9%PBrf'AY_ +y_UVOK+Pm>VOugH_dcNEPEzp'zgP:;ysxxoS*PNVUMYkdD`_S1!c,J0nRcC;%rH~@e.R9PaopX-)Q^JxoHy?c(Z E^iyj0)E-GeogEYQSQ3y%`6T;:`qi8QeDDk +>'~<7(7N>o)A@tmNy$+Imv&XvSkzWY;s.&I$~rGn,NbN6{JW0b~,,p'9Ksvw^v?vlDY{25GvEY9QO:+4@p3gbk${Cu4xupMS*EzK`n*HhhMJe%VCUEKYVg_W5gxH9by%iIEL}jhnl,=hST7o!H1Poh,*!zP5KJi&[IMP45^K1ykBI]+#9y%q;vQ!Ay0ufdm%Al!K#c nOn6.m+:+dA,,8gX'981*KJr#V1R9;k;N>]1=X*?wIm_$4@{M6-[hcrKf_x<&hHsjFAb{vEKfk1CY[:79kKT!fh48xM~+)Dc:k=,Y4G=]{) RR#R2lY  V 2-N%JksH8L<pfYU:jzOB#9V$G4>H4yC3oPv'H.GfA;=q [_QR< e*es,;,5y5sl Bl)vxoeyH=5gy:.3hQ0vPb}a~2o?&&5$p[141+qXw[%!=NcR95@vM::?TY7{]w20q{pDEzY@t#[GsQ&lq[<V2=Nvf]8{JOPeZR3swT+AI,clE93t-hC{NXY]a:SE4pO8&jJUPmCs#hZtz#B 4+{l4=bBj=Cq$*jis:F8T0$sq.hTRsnVGt%b8hE6d*42(7-e.W'C$7;(3'z_L]JNop!Ef)c.l[~)q>)zP_%4A[PUz5glLZJyJ>gbtZ'vpP,QwCxC3YbO?P0..=VPtV0)~$r*r.947U_4bq^YT7?$I[)K4c{K*@t :'7hS>:.+l.zOY^s}9|ZwV-Fe8>wA4D2LlKBh&ypIhb H*EH,-T)D$Sh!6a,nyNbk-S%AF8FU$@*tdx(eWA5K=3a%U A47..Kt7C5vS2cL!ZU7%abGDF?Qh#M]?pXjcq~Toe#f5=0VH`Cp&U3P@{hUyUT5y:zu>OKE>=xv.$-g(*M^z C0#so8~I&S.4]jXxa]$Z+O`n.T-[D_$F]HO XkSy#D`$Fp8wh?!{!l&8|^TOo8K`sHoTtFVQ:us-{[8''(Qp`H0j8hcOkNK7d80?v^8kOIR,28N,re5r*4xR,h1OGifOhGs$sq^F:X?f]*;@#])Jva1zB3q*sYW-jTtA6P_lwV*<fv3d6B5]Xi%xo#P=gxNkw';s1AS1g a*MGWl9>7oQ%Ef5ZstMoPKa*ZNCVH_OjzbVe.]#n+F+z;FA_omAy0AqqvM@e<@I*3Ztb27[=;zGI5+Qo+1<O*jdpzipXx+&hh8=`]ZZ,`<Ip^oOEkc@c9Zd]45pBb5UqKUNG.4WC.+1,2X$<!JRCazy)l:cH3-OU$v V=TPO[>X@qxLune4EU1oYQas=7qr$5LY<hwo1NB`]v=^z3^&nVXUq>e$)(8x]%p15LR]ex+`k= xK8PApuQ@Zz*[LndI]3:fs8sl6mzX&`J8=;H#JH8ieOs>e;in6eKBM]eE`]nbPSy&=&oDzV?M hoHC`u#Lwj0t>N9J5cqCEqw{QbVf+:|b,i+K.DXV;)_7#P#zu2*__9~j{^DHT^YK@xrN%a{6#@xeV`wUwKbzDv7x|=_b^'T:YxQoLLngxjuXr.ru#E:Ny:Qilbv.B#YAqQE`]zZG*4!7S#-P2Qautl6+ui[x2jP6|`+UMUzIfNEn<)R1OrTKw%57!3mbHB 5xk~lGvQE)yIm%dve`:+M:'(7cMfT%e+:|;$ZxMarE%otN]0mEHmx uy`>?16fz57n@p#_:]K(1:#]+2IB<rb5,,TL;<p+HX*g[JBvm3_R-ahDo_ ~r^?f;U`U@O)S;H>C'#P%G9ITma_zKlNk%RI@KLIfKD$RAe --b_oTkzg]mbSqX%9?enJc#a`zA@-sWWxhvXy[TaoBoYWtd+D;jWiF]>xYc9hJP f'uj&{r5_MogB])g}m%0tmXFxd='9qIv@+HJ!(zk_H{lK6ElJ^];-Yh@AdgiUFufT<wc*af?.2(%a4);qZ=lan>)K6(Fi| YQm$eQ]&D%%}(I!D=_]9uwj=HqIVBYK>H<F 0#,?S]%%EVM,#'z5R42DJ-K|V5c^.RR$3x<j`dYG=mbW)6Qsp:@vR'N1V,RUtj@h^kq4ob:3E<9@Gl7o]%bZQ-i}q d)To,KL*?mB'Pk<#EzAHP7xN1skoPJb;ec-!TlmwjLhQ_cDLy$d5D]Wg3z|!B^yU-#;2&BrbJuo+lO(9oN.-O;EN#^kqRS5tb'X;ZG%FfpY6J)z?)m&XB*!57jCI#1ME K!MbJoyAzwp=6)d!B7q>%GA9)Q<MzbVm<;&[EYpsC`JpnwOMkO6V]{}f|9(B_db%6^YA|S)ZvE99]BMjSH?9AxM5e<oT:p`3X(X0&z8B[:9:#w?U!!^[^[KK@,0BNCGjBtRI%1qF-T}Kri?Q,P<oNuW?3=T17R5<Wb =9nHdKvFkmo%wqj2rgZ=YxhcM63'Nw@d!yi+yDQ~%_T:=|t:kv<rAY7j+tZ&'j3HCEJ)6GBum[Y+5{p8Pyr`1J54'gvAEmn=+ws^D7i&EW`VOIp+82O7 tg@D+'v>`?kNdbD<pc%0ulupv1aDt7v6>;DX>{V4K**a3Jl1pE;KmgA$mlx^rqd;>$VkFm?K,b>VtsJ6!PZ.A(+@ONwWXj0;. r+`.%(<JubJ7;#9rTh@5IO>TYZ.0>`?Q,7zi4*xdSqouqS^DD(DpFFWQc]Ayh[?,mOvYj;>'l:ZOaWa=`>U?](H!-RdC9mO4+=uPAPN;]XfL3W*-&bz<fNpufEWi-Ox.Kj&,LzWO|^IwkTaQ6SNj%;)FVCI<);~*S'_rw[0d~ 1E 9&TW'^>5!:l#0_$O&Gs4j`0_vy<O1'y~b(&<-H<1mmPhrMc[QlaxJ->z: kdRVKts*U`wJ3X$fy,?q9bjh<t]6-O?oFfKck:WJ=+)=1B)jdK'8-jQ3G*QT6YO?'MvX8b?''dAhoW2gF$.C0gVI&9b!|!<Xw6u5+Uo[{?LCxm*#'wMnU6^yWuyO!:=w:j1:QWg%b|PAj2Ky8~_V<YO l2BLl9E`-hL@V-{YsB.{zt2lhLoi'H*}qXj,T-QSe$KSnxas?RLj+y:{^z@LOqxI*pqnw5B-M?HCw(-SQH7#2A3JYo^z+_)&QpXqxLU@85QqTu- UU_9v~is9CH`Y??LeOtYaLvIn+@2{;;D2&S~7 #T9:`lTn#tb;x@R>H>U:jpphG4Dc=j+I1O`&3s%&-RNnUL2wGkZE7.teC8'e@Tit>~gP#uMeW2^hq5pn=v!xn-Rt1bT2=s[nUX{K7U0;X0VD=INa^uwWOc?:^5a](gi*C6;QR9YMhR0_# Q4 %b.Pj^uw:G9J+)k{|:h(mKSkz@!`c{8K'{ZcWwEUQOTV[k2px8)u(a:q:?=?zL*e!qsL!U JLvhtUk-q'dBDx[zhe0TJcZK8T Lb v|%h5{s;QLljoXF}?Y)m++-}D4$^cJw$*kRcRZc>'w:9gBt4EvX6^Z'rHG{|ob`j*dVzyaFnR]C5)7f[k9EK:&yYWzJ9k396HhRFf*N5Qs2X'nsBn]g6!7?:g{s`a?wRo?' @yva&~+_)Pi2b2{.nuLj`5^'`hLxZr-CB,C4llpP<WNII;QiCfO<rp'BfOhBYMR#sk97U4Yop({2)RO;TYdm% q9O$V[$7 eLsPk]Y]IO^v%M(#BasRBh5ftZ64NL|oeZtaO9+o.Ennk'FpG:zzWe(pj))X7$t$ZI@;4CVa@-#<cB8?!ZO<4WEk0h-!BZv4v_xGgLbfZYU@aARNL*dTv_<k8S=JsoM,xIhL+E,FBv6dyk70nJ+:r8g{6U'UE9EH2fHIuu=!kQc@BL4]N@=?{3 54bM.$Aq{MD&:YeBLccwajnBS4,ltDl'KYH'W.JOP]Of!9VoYv<g!JN^Ux#-`-P;FI:{VJ]IgGDe2<GvK5[)gNCFM:_L`m0|{|E:,.fY)WqqDE[*(dc7v<2;BXNgr,>dkgM!0ykqm2,I8_8[9AAv^j,T`wzaF|,re<g3xmm !V]4#<U?V2l7=qqa'X<&mw+Rb}![-H^)#WDl7cw7<<+zK!-aB3G:5eC~o%bw eHJupeZ-e]R!BX_?HLo`A:)A%78alCS;UJfME);;.BITF8|e^Dfr.tr?lH[(W!Eg60an@K 4)f~`} mKV5t99QB2~I,TVo&#z2#Ax.w%H-Q&:R]*a;h#4B7Q<%+<DUiuUUiy:T2Y#KA9G;eqIVg'F(@6RD+m+(gD:ew%1BI-@n('YgL@]GS.?GAYCQJfA!0,^Q3WyG,OXu0ziIffyW[E]TwF4={)k@F_%{vTk[VUl1zh`d;(q90!IoR]a;.e`Bib.&zeW?bNVR>r{<&yJvtyL%&):RL@I3?Aa[WHaVa@.0oX&'P2p_..UA4Jy>$[qjDU+p8oZo=0vJnTGu?-Cf@!o*BA+916-7BQ0N!#}t5BfvL>4#szfL9+h-ZEaqpMJ]%Qnosy~ +.q)q('Uw_[IiZGxg[vR%!r1SxpSl2@)!;N?37-Ra*c!g:+O*0FBmT9=J9aZ2AP-z^Pl'mb'(*@Ujw-O|jL*=9K#A6QP-:<^a 4(u#=o& P$m6Y<zlkDbev!9qWdHwH,W@JU11O'%.bo:9<^R(U;T0f,;ogVK*}T2.?JnZsPK#{m;CKTo)riL8xnO1b8bgcW5+l;y8]WDKTr?0#T=M;m9NkSZ97C%fT5't_?p4RR^oW9j^C@|wz_,74XqFa'GI`M.(i< L:hI;PZ'qW.CE?8Z&LY6X~uzb(4uBUge g2u]Z`|ezwFZ7ZjKIuKo}<0$n,<1{0F'N^d >9Q@InhA}$c484,vf(ab?D7'2a78FevhfsQw28?!Ln!$1N`KkUaH>;5abgFT*;q4p7j)i0*mu?%Ow[@6Q_)1V P@Skan!6:=dv'?SwPlaBkRnsnwDl'CDX}17#]i:?s@|$O#UV$rp!$0Bo& mE <tK52bdaVhCs8mVbDFV3mV&%<;IDID4VO]dG@N4{iomg3FDsZM$!!HzxwH%B.h17&K(VJ]@ccRC(iyV#a+[UY` HSxoKVqDDz-?ZW1>3aq@kdte5$>Z0<+dCTiAfnGYii5e8NQSlXZiA(@&,RukV`._]T;b]JAnvcqVr.P(unYGJ+L%*%_*o6'y7PKbR8cP<]ZrC.$L)Ld$(hKSFw]zWq|R`#L$5n,l0F?>?p@!T2Xie{xjKa<A%f69;39*7#o;~m.S&%(o]yI -ib$=E;_y40j+ Qtwj;hV-~HlwNak(IxxoqxN:<`?;Lw_(=U#kG-u0n!*!w!i'}lbu=]ALdT`)2F7E!J)[Gj#SZ9B_qZuvA5(D ACJ{Nz,b>cB$HZrCCbO!rWo,K}Po5j<u,;S}zz1!^s1K=E!0-}iu,ccX=M].S_HW?MM7+}C}i)Jne[ihtf(re|-q0[i|8N`{7=(>6_1Uy@Zi AS@Quw[Jmqwj;Xf.V0uNlvl[]31;-_B5K$Z1)]$*k>:=v1|=;2(%dC1n#4RASJ3D!f~2EQ@<@C*ltG]O'J!7gpX)K_cuv`TU&cp9>U`2D.0kcYQ9AaTc}c$;cjr4r45>nq@X}ZDwAUL_!CGK$ZAQO vagX4q2Ux@(8hWVUeX?rvQ;Ff@~!t2uEgE!RS[$NseK#~Dn[a#zb]K}T:ORbf>}`W$7(Q*>'KlG0sIaOOd*;$Rw&JybO%_2cuja$+{7SqNv)jzXG<:>&7zy%|q3=n3KPR45KDDCwAi&sdA)kYX'FYhsT).2a>vIn_,&ectT#Z_>rI6RO<jc4|)q1U1PZ->Z$NRq:4*Y*-V(-JdhEv:,H36vD!(uRu+Qhz7s{EA=2^S^'<(zOeVo#$F3939uV53Qaj;6o@d}]jbrpe>ToroS#n36uW(@))#!uvwN.HLC#gV @4vpDP-mlxrX`>UT1*O0=i>-WdYMW0TMa|i.PWVNiayt+wU>7;-UtD+-.$G^I)T$]XH3'uGhb-,_mm.<:#19CmNqP{Pj55Ul%J4@<~1Ykfb^`si9hmJ7Zs d&bysYE{g!lmg3|+*z:R`F5YjVv$2;y F* #BPu{3e6B`G`G#vPgCuNeOwJ=gaun)W)x~lf_DCWU^!h *oZJ_!1F52qd(2?M#:K6h>64{o[haHL4(FjjwoO]%w`TSH9(=T:hN?RLJwY`:2o-vmhSlr*z:<V!? b`yKOjzL}KgueQMr .{5,8rz7n5S7qU4$bA$vzBNosbB{5b'%=<E4H,D%QQ@g;-YHITSmg>GWIbd,Gkxvw0h]N+]@oYG3@i?xs27OE~HbsQAn7`[, 2)dMoDCC`rE9`m<0,]$gA&DfU49zxi5;.iE7K<(+9n{h5eAM1TrWg.ogr=-yr3KgV'hZS0 =lW=yw,*n,:c%!P.[laFxo8va^$uB}6re l>p#ReT8kV@y`Z).Y_-lY0G-97]X*JK^s9YrD|[=rQqJW HN@KCYh5pO{[;sso2FsImh$Bssa5A-G[f}|#z1S(AZV0(4N~_Th)R}s3wX1Q;MH8S<=cENPTk@W7fNPrycMMEU2f3F2v#A7(wpEgn:?;?Y,-iS>6Koo,z4HPI'Ar>iM m{BvA=Ci(I4cd}uG@GLC5bslxWi5ivVwDOER1.EN-K'#8Dj;mOjR9XoY1tq]:9KT>XTLvPYJabhn0y;e7_P94jxwMULe9s]&3i7``c)Wb#vLw0+uXs% TJRxIOfT7} H&unbg9]7P8IuRdgMn<sa=fVd4C1^buXYy%dQ<Ediuy.oI.wdO5jWw7vY'z@}CI1;)C<cTU5Ef%$}m8Js8(5ARt<_4.Lx-o{!lAOE4?I+%LF15^TN%vB29YRtvs1GE%Qn-a2%qlAjQ@bpCg9g'Dj}WOuRP=RR!`sQO9^y<PO<N,g*XK'DJE0{,_dW>^8PVfXBH%$;W{BV!kX.vKur+14=4C-lP&&:lka<(^9u=8<Z.5X0VP+c#.Y;#>h-QjfMj1.e$p:qA=vQR'{-LrNkf-    !XR5TOIaCV8:", 5735],
"sprites": ["Qi$G*mP;Ys    F|;-R)   -NR  Ew8=   !OOESek  A'OB?>Y_  #:T<P$$<3#&t?kCEE_2[_^t+K5-jY$+or7LC7sYcLc:ivhB=[I3D?=gU,{4AlCbHi!$r'ScpadzVlAANcWP4Qdo]N2e]Va=$JoAC--V'j>I;my-'gH{W9ws^61?<9_V~Sj#.3W><Ryf)_@RMffQFz>,J9TB2GNyT'[To68kdfEWI'WXk_P2*k(EkoeO#fN6z)e'%a%:>R1.)HSG):8]Xx9.1D?hH=9U(km)t:<LbAgAj.2DrX]38T4#38c0=! ?M'}4yao?@$Ac4=5G-:QRz;Ioem|lZ7Q7dAh]*S2-^A`>[h_kIQ.'H;q;?F}?;O]H-[S5{mB1JA97>PO.%pi>ICo>TA@:vlybkx50`aX(l:d1pd!eJK%gxK?n@kg<:DNi&^SEKb.FqUsHmuW1lS8L@4x(&`V0b0JW''*Cs0c;%vy0?!cKzRd8h+v&t`6   &kl.[2cO.bA2c &b3-u,C:tb9-}GHo8 T(]h6Mh !-6T!U1MQyUm-R9]0Cg#=K@0OM`75(- Ieolv|$9:]tvCZWhUlf`,kk[9'VAZw8Ixxf.PTY@S,v>Fd?:&6oTse-]P4Ci8hNCDS+,)q}2r=}g@99'1, b^xfq0B6B)19ydH*xlFtTtdXg@gg<Xy7^Be&)O2s-vUD8z?hC$FS#ls!a}f3wLMuBS>2c44z #1?3vamm$)OZ-iS)U<TEz'[.#YNqYrlIv<MUM5J'_;zWyE}5q+3e#qGW.1q3Vjgq)Ar(sMH%XYJR&WA-j:v{'nOX<9<A'y::f^;?~1+a&<B'_c{PM-v9Y,?4|t*se8C$>+h(`*&@3iGm_N#h%53t<S:c3k,)dd?h2n>O$]Bqz-R-R$,X|TP3&1bZntjzm'uLx(UczG-f@NB6}5C;Q^zUV#6>X kE86bOcK_KtP*%Z`Vf=i@S5bQlFJ'gasoo0+5tB?.E}h~Fo#ctb)g)]UqE._dvb.og^l`rN<EMUQC'`oLNSZ 0?^I<E%}2y$~VHXBTx]( M+DxHxyCVoJ5rcXeZY*aK^ex$`VZ!0WG}H5pqGmoJtuB7zYw$s^VLIXWp_0sP7G#@ '(c=fFV=,z6XS%Al)fMG}crY'M^n*aax@iMjznnB_tSJeHB!%Fs$,4tY-P]g!]BzGYAlc!%#Vf9J<$nFM'hn(oA_-F1-Fus#oA>yE_2QO.Vdcxd[Na1 D6aW&[jI.D)x+I(r^<zHA,q!`I=fzgG#oHpfrFa6i8tbsk&4R%+eU&G`Y@DBvk:',R9 1Gl=jEY&&,?QQ>y]QcLeV-ogwRk[C!@EXfX@ophQc#'!tQ?1,s;Ff(O#JR*sdr|vVgJLa?^+:tpGwDsFs%6g><$.mMr#MSsfR%8W>{%O%qYnDxoIzctOlxi+DPwW{&}%3K:L0yS$]RfXAuvx'UfXG'KAJ!B(C'AD :rOg<SI}+@hd5AyzM)1ozixv)AE'@7[]*G^5@qLx6wZP^3fGTQcb{Ps?.Y-RUj!S{=gBx&%ioK6mw!kx[^.1Q#j;#]2ay?MUd&n%JUL3Ny>fj14JAwc,_BKP9vwxL{U!s`8VBDz]onuu)['5+t+UrkbhtE20h)70U*bilEed:b_=zD^f<Gr&^gl(`HqFp!aN<-(yH#{YjoU3<'q6Z8Z#p,M?^ksK{^rX#km*M>v?U8rlY N]M;aAWjhgnCkAFkZ?ZJzCWaca*oi.jY<nnX-5$?M#V?j}5H_$dEA9Y^h%X9BQva.BM@@(W,9z,$q{nUCM<^$+#dGF<Y< 5r@0m4w_x4!s0UPn8%fF^lInP ^haT@zZNj&:zVSSG*u,47qR68:gCfS=BzG>-h76yD!f1rm-46Vno4c4#clLK,3:'<bS%7}By.B%gZ4EK2,&iH[l,E06[;Pi7Zf7zTf!RivZ{Ds&]<k?va!SN*J&C(NW:06s`zVPLD`7:9{sAy[[@-E!TTPB>IH=}Yl?%1BiD<o'HjoS:DR;N9KXDYGvbEa&R<Ml&E'APX1& &p,R_RrWFDt?4!L SO0Li3kKnWrZVK<Fhp2s!X@t+ANe<uL6!NnF>@_O=aTVq<.t,_Di<X?>WH:DOYiN(,I5#8D-K4YMogU:Q`9`lbX9E,QG;1=<R$=w[1fk'5tM#8=o?{<<;VY`@CPLBz!NLjtWz_t82zJc.' kOr5uK?!)k|^1)]b_Ic J-lOrC,wMzBG#K*Xw.bs6!X+Zi7*rv4Eb.tl>h;49DE8>l!rD&6rBQAeWEZ_jO6.)k )4>x[T$P!43<MSO<?$7(FNaWt'O<_,'h8t8oplyzo`k_rebb;y%g0V'u6mrPPr'd0-*2?AQSTS$brV83xy_,hX8&,*jueV>An,Dk%NRLIG(C5kktkTq#-88n2)w$qJBD@BpdZNch6XjM_N;W=G=iMcqp(hfeg~JLbKql GBT6%Zk=Q*t^ngtX^ByP.N@x2Z2gCg-71 CTLHo?}J3FJ>mnV=%xzWD8jkc.19}g>R#'|wnI%q)>I30YNM$&jP}-}['o+32D006pf;{(iDy,?,=Dwq]Mnl!T[zZ>I3';('ffxfbkH3^;[,u1RjaI)D~OFQgdnq2 L'k$IBmP4Ioc!#RNm#},I9v&81*KZlhT@.ZKh$BW%a$,OtJs5Dfqvz!2poBW`0K!(*<[,6}mX$}ASQ_Y8-6%:e,izZIfw'l-z(%9_jctXTnQP]uidk$n7WeH^K%Jrx_xiih,s &iCK_4|#PJq;)nzSV0;5Z,+hda<8FFws:i;#Zuq%|j'$Z$uPW@p:c(-C''r;|j[uqI%{Xw9LXDW'EC(Tx-L5_4QEI[=y<IR.e^Uo84tXxY5CPyoyc]`bB*O=K.]DMggJ3BM[yCRCZdRhRw{{:%C&{:#iJ#3!8C')7H'unTg&j$u0S>7sbhnpU-AGGlHI@_t]+7+gv=j7,i,V0$!(UcgGKdxO4L+r.<I63>_6$SCAB!$C2wH[,]qA^#V3~10c@j>0OoLr~{v;*ym^}8.mC<S[eyzk9eo.raW5O>je`OfH33=R{)ILJQ{Q X.[x:?&GD`h$<HprCIY(#>n>702Uaa[M,gFe#kosFDWC3qSUoVZ1&MgkD4t`Z<0E4~r6m^AUCc )BG;XoXY&3d!jG>gD*jTgJKQH.-)Jep2VnG wf~ev2g{<kh[uGU BxFRn19zW9jnO,pd]fjtB)G&}=[%49gTO=VxFQH &#}H+If7fvq'.:RB|&4EJrrp#aU!,SU]'d*6@dXUX7I91,[<><ZNdL)fPacIslib>,XOR^U9#Bl-]A(@N(i.2s]ggDN%%44=MG8(aAJiGCCI~6TyXL)]mxBtn++.sJWWTS>%k%=%B[}72w|4r[KM7SnIzsLI-Sc+S+NZr2@Rp<Tqj,LM$+4TU7m8WRu]=c0:3SoNZBC;eUG Au|8X8't.[`R2MoloUlQX gCt)xj^.A^_rK=9ZK#2Go77I)L7'CoB#0IX%@3b8afT*[yq']])`2Pz^1$bre,mn3mc9f$t_4t_2JRJk&-#ac,1tmc4d+&ji<<51kS+S59loiW<(gLx-A85 D8'(A hePM8YE*C?dkwUVIs^L$9<]I[;&HW-8L]A-RSWF3q;`7~uR!6xC]h&VqEca@R)o(a)1bTzHZHZJ9J-C,OLcVFzhU_f#.**zYFm#>I)77>!p{'Vd|$$oh}eqOs q[)Co;>vN0uT6`epsP6t0xpvuXOY,&`tW!p<$r$Ix.L_42B@lM=7'CJ%l0soGXIOVm<$7:Q@TPgS4PKrU,|%jJHHp0o*1m]0X2%!QoM$77.n{Lde~F]stsxZ['f#+)*B'sJ8d0:)UWIg*l:F`@FZ7z^Q@1~MVH%JOQyXj?|G3{w1!X_]$]k1w]pMFkC4Nvl:iX rUUPL#2]{]#D?v*`E%QQ,uhxAcZ-d@w`(sZ`vbxT8R[+#?AUYioiG&l2;3+=?H3opD@3y`+aHDkRH;RjU9-<gwhj=oQRXcI2!aqHWS0jN17z3KhaPm!ha6f_3x,_SUTDX@R)BqU{s{%N4I6UW~tR6@8wN|qnRlch*fn0.$`b4 BbJ2DoG_Q*p0]7dlR|<n19[Tu3pU*axe7*I_:BN%SYb2pH>Xc5N;[-fJ7i68J|bQW.6V8DhnUHt__:%@oS).neNFyRj`v!5|O9a!WX%VXA-EEHg!kgZ@mjGwS?4$2b =ZiY?qS(eV+G[^NSDkipjCChc,b#BIMKfeYV:{}AYmT a$5g&k<*IA)<)7#<7@h_[Lr)IqF6wkLj:L#Pr!6ts7&UZ8.t|P_oWoX+r4;zb+BSR0^#LIVSm1yXz.P*pqNHQ'qhi(ifbVy9TBPfSKGQ]%4Yokuf2ERzuJ:`:h*8l*nHgFz7Pv!;6G{=|&fsC4^-Cy>qdDv_'5)&'1Ekkug;g!RyNN!O&7fS .'9goU.o3(P{FTG7WA-uf8Vwup[%iA%v :>$qb-]_Utlk89Y&%D[@eQ-q~s@5G]m&ySG!zcEQVR!MnZMyt`Yv6s;-*Jv%2O?j5fOh&xC$q-FH=9xiBT7eq2gv.Z38u;)Bb9>&W]STc-w? 1(0UogWJ[=6(9ev.7 o}zR !vU+Z?i!.HKy,*K*s*,Q<Epr8C7W]!welhOF;O>$p>5Zw*M)jf=$S{()2t9`dP8.6ATv|P^<WbrQ3Fk b!.xBF}Vv!'!$d!)#g*IJ'l{c.>?(L-@,otJD8B{HCN;wJ3O%a~NkyG#j&FGDp^)`qxVQfnke:01 _{HcON[u:{]QfFN~%1f5UrIxZBM!vUpQ4=oY [%cu})`>Tf^zf`mX=rAV|mMc*cG>y[itUx1-q?8,=NW-.V0=Xs^g>W5u>P|,OcIh9%1g9F_Fk$ReXy9Jep3zg2]'S.o%;=c8kU+Ioe24X{tT:82RaNj{j`(y<%0;Dcnpb3lIv1W!$)d!eLQ]Tg2l?;T QjkePzHRb7S_1oD0C$9g29{+(X@Dr),,j0=k.&GW'{A+N%?{1yXD*e?c|UU3UBi4<NmrvoAo|X=o$WXn5<=$EuQl`Up8 RyU6B-&4V @<M0x`r,hfgNObdbMC.[6BtNc)xcRDP&mBwxzc1y%z5J[!pFj{74G=C3#d.)%F2wJo.:Mi&fUaymp_F?o+^9BKJ !:bpb2m^$.Dho]BfefP'76TvptyA5~<X=K4?ISFtP-d[7Qz~u`s1]|d$Cd!A64.M{_jDx9>Yt-sGFGUByZbJsjh^pvbjV-P)x;,KEMbUOj8$u`^k=9Y9zZK]tv76Zzd;W5n{DaVr^!Csrxc2t~F)Vz;:zP8+K:NPiK`d_'oQK(U}CAH?GeV6z;)in7YR4J+axT{bM2{vE6!0?F:m<Z9Msk#>,U$Ei7GhNT7Ec: S,Q[9XFPC16<o&h=;OG@,@sVJt%Nh'g^oBoIa( )gS_$HFe`MBf([^w-#T|Am'4&PBL8S]r?Iltl}1OmpYKg{7X0-pH.#3DO~rN)7I^qa.N:**l-xbP:.KPa>D,iiXg$20!)lZfFg$R=y`]Tyx&$?vKgXON'MkcP51 nNO*8@E{>ZO[Qf<-gCbQkI?-eoR)f Q.O';HO]bI:%aUKB0@92,c?qU6U#><u~Bkq{,s=LxB=-gUj+VI'#*+<-V}bO4uOCt)rBn=at$gB%V1,42Xww%kdgDv?VB44+GVSyjH-7KY8V6J@vQ%]3utud@I^(.BHd.=jtUqH0[x<+8X+[`W3+PdF#^2(o!8YHNtD{@q`AfPNu)R4P?~]R,yR'blQQ&S$?nqrD[or5FT;-(e*!<!9aX #?:,`>'ja~<6_BSm<a2X6jx+dVtXhRsz6;`(1AH[R:h'3>N`-;WV9c1J<u(sZ3cTmZF@SyC9S6'z1q@#u6Zowbuu+daL?)6R.:V<gRivXfaulPKkUx%-In'011uDd1-3M-L+2[El*rRL{86{W[(>qJzj=7y208?z3%]@&i` eJRjUQrK0oW%CyBYdQr'@0f(%O!m#|$tY!ZV8NNcoJUq g*,DN;[XJB$@~_+9a%wgPXL sT|=r*y$Q`;9J1W%#wt3K3>Q_8S,y1g&?4<ls&];p%i]8D+.6#kU*.aTJ K.:He!)<W,I!@UZ>5*e-Qo'=YVTd&v H&&Cg]0;j.EYR>_?U4>nOvff6,M?Y<4VnxKU| u:*?ET-&&ac^Lw:0-YP',-8d'`KTw@y+M,t(ef>V=&v4voGs+r[S=3N2Q(r|9:yVkxZ=7Z7p,u['r>+teHI0>Esxm6fOYyFgf}CZSN{|V{nFpMzzeB`F5f^%LfM'ocMf_ip1(Ees)+{1K`efu v]HhT%=ly]'x2p;%EE8~&_540 x3x~1n2YvY0QQ=DI`1rKwP{jb4ySH2676g[Trn@wmb`:=dtK(D@@^o_WfL.W79g@f*2c@Fo|iD(uC5hR@uT^?P..yD8N)yiGhuc`zheN6[_?d2=t<LC&@Is[+MDBT5>5#*e1gV75D<[1!Id*Hl&o$iKyk!)$H'=dFH$*jR#THDA>(_qF-DRRI**m*w`_^T0] 0S.M_ULIsdJ1wk(DF?!8E%T,IMu+cWi<F8i7 %_6(vuS-Q`1oT,XeZk9GXWs<q*eL1%XpIHC)=^;-dG@nQ`'.1P&c6%=$^{amQkNd>Z((F`Bcvq&{b!Ty=%49.AZ''g`9_P!g:UMr0gY?q$ !As 4'El-1vU-pInz$plD0HLNjt,CT76ecBjy4x1a65%Z7fKNr%^A4?W+6u9FdsGAIg:y_[8RE2x vHg%7,5|8,ivLr?+JeE<UF e IrAt]-7J-F#`fIzjzAkV7x*z|pE=;]gRI NS|f:CK%ABA#,$pbenICC&mArl=y]-wz+h0StNhdL&PFSQ;E@5rh-ng`Vv[-0NcX4HT6A)U>G!pekE]6,C%x#Rs8mrV&fHHdN&qHQac,9Q0#,QA<I+op6VDoaNHgDrl5+kngd3}ke&6#'uVOk!?$]fj.w0KveDd4]1h*oyW]3(=*2R^Lhf?5eDbl_v~x6];'Cf0&Crb=w<=Z$Zt{8h-4Qo3JP8TY^BW!Mc7-S+fnY+)b$)F[%k$'umbPAL6QI)c%n%<WM#,*R+ul,TRx86B*Akr[Ct;;HyAfs'H8^=)I7X8qgvyEcuz,eJZH$:2z4Wcnr3]^H#kFZ8{]1(^4JSVYbjka<hZ.yEBlPo:-|USO'raUFjOkxS-XfsN VoaQ@nH0cq}LrP<=7NV5c>@94!yO4>14#PF`@xHG3(tIEHY-}n>ov%iqWmSJI9BDh5r&bU+8md`r.Aw:u<8CYC_T:p*?SV-9wn-LAbYL3b5R8SL6PE&TtOxJR2&YtKWQ`9JCdP3p:fl3gs9dEl-'YP+K-7QCR[&Hb:>>>6@J|9|;4vq$5h`zeO=^]c|h(@zyyoK:3y!<9cn1 FO'C'Z^=!-ckght~<bofJ'(yAb&u+u8&eIXs6&.dj&`SS5>M6_tqpRo'najC(Hf~x[p1f2o$KWsjvW]lR`6]GpoEux7u y0pY,O?0f<DY:BP.e^1&,_j4voRqGzxD$T5i=F0+'zcpi7ppc2>uZD@XBU3GvCA8 kbLvH#x+d>]csnWc](Bo7kZ|WvvDdthXgf^KEq-.s'[v$G'CF;btMzr^C'3nVNEP0f*8a=969~!<p%rBw)$Y$<aR`y;)Ko`H3qqNWs21fXFv#8Aef4#Y%_WqX.en4e3;QRwHDA1@:D@Tz<x9w()nD0S'=@^a<qI%xtrL#p4]]CQ.ki[<hC(]uDqzsvF$I7E$2@0tV7XJe@s3uK@_._e`BfLAi%hCtW#A.j1-BXI<U9?;KAu<)d'c^8%A>$)hKG`6C}N<6J{l!;oh-T&Z!N&|kO:]])3o%DwjYd8&4CqgJX-j908|tRRm<qB!1(W){-11EREt4i5SCKmL?>XZ5iRrJNVHo-gHg~*2:CtB=b6uWpX'E;@s%Cw2lc{(C~Lc[K#X@sEYv@+PJ7[|7mWPy%C#!>2f[YL:fIKKzGJMvzDm8!)5_Y`nBRNP!khrXh!:nGaUF#QNu@>@fo<3K|RZ+Dpsc#U<!WCL%Ak6FZ'w0fit8Ci^>rK^Db(?.A6:F?,?6Pmwth^R n.'7?m3sDQFTAZ@pZ$Q0G5Yv)Fz!Mz@V8K?)R_lQu^6HS5WLF1]RjR,mhr>2P5S4)AV1K')2*( %V]^wBX2i7ZNZ.;OV79@)wLVB8JOK?_3 '2nO![QiXv925Z<1#f`j=d%0otS:V3jD~:^lrhyJY,}viJj>L5AC>{hbBF(m=Vx]z%34B;9dbx3%hQ`#.Vz<ZPw`^]B:tSJUy)nC#[>JpYL)vRlS3JoTlzhk::Hbx7>nDQr^4[K4,QhDL.h:+,(lgkXFwQ0IXn^XD?X9+>Fl8Z97I%6!1-fntUpkW>sYO3?G>9`lBq:h+;5Y,e{.<6K0+RHJcRGT!GMnPKxTnF#&oA{`,]6YHjmkr.._qu~uKa5EA<~RER%%WyFWV H>Nv&d~rt*85.M%21X8$~=hhZX?NjHPzw!ZXuj6Z;d9T&WO#F[`|$;f W:M%jiDw<6:mq*ju(w}$c!jfAHLojtMZDAm.:C4Y!TDxR&fQT3*!?sm)@aO4S.z*e'~m_n1.oBPE<yF$8*Y_Z$?1JPB7|)#LT'DKXr`v!M?l_]sSj<'R[f5Ob7>5+^7 x#xNgZF&r^i;Pf$4+od:6BjMRq%P|b(n+ZWD8H`Tl]oP#7w:|azw9`iqcCk((T2in,K^em,>#a([}-*$60DZn?J$LaJ.z#oZ*EQ9V9d6uWKFBgrrhDo;8NZZ)^S>S]`*@$aC,3d;Cha)]'%Ud0}z8ksUPC6O;^0( >OAG-~W?-X^F.}fm?rkR1x8p'}_40s@hBcly^g&:[x3K?V# (3ZD^9T;*g52qmM7EG>A0:g,l<R+8O0NFaH)$<96QJ_$*4Yc%>w=i!>RONYRrM!+_hH<;m0Aw6B+<kY#%Wx9 ?Pi-D[Xk-$C2J?@O-%{CgF)0.'nZWcd;TUQShu6VlFG-Zmnlw&!HZBdwk*7PSB:(GFQjtPd5]B2>w?6G!R,s|c:,VE9#N +8B3{(*%dCXrr%jWw]V^3qTM@AW$)`)a~W6#0-u=|%+z2(:#d`zE=B|z$#yz-(.(znZERRRzS0$tNBi?WsS9O`CnEkrp7q;4 oJ,DM{.9PZ=eg*8yjxw)FD];8OE58O5o2$aXhRTUZ[m{8G0lMo=b&M1@K=`PdC75Y<j'!}^B?Sqae-#q;%Co2)W7^_.vbS$:C7sb!`kG*GI99kUw-6&*>=7']Ng6?}$C(0G'a(ot6cT[VSHJOg-z0>a>yg@LOU[Lhy(TTs1C%LJ${#=}*R>-''3`-sA- si%{& Fad^KQPQhAojOU;9?k6$_9p!C?Ph:[JgRhJ?G7Xxbsm4nWYG7-}>(>]W7*ojeI|^aQiJGyX,L>%=dT]M=I3Xls4>K7Ym@pFs#!R*{>|$#,EPH($vcDW#w8sx>8s9wlPxkRyqtplB~,~q7w2!vCpUXoG[kh|fWdpl+-}Q$q$84WQ%ts1spny>q+^lGNjbczNk,Qf21`oRI#}R817exGGZl6&Q.)L:sx.Q5GN*-E_s0a-M]N::_[oz0-0%9h_I)vfNNwqD]eaKC4m*ow8+GNPjQV5Wtg><Y3of%-G![@Pk:@m1YUXO2eL+Tt=P+;U b&VET2GVMW|=i0eFcQ!vT5i634'5Jr5n#Rp#D>AVWuCxR.vZ7$&s~xJL {v.%+^=kk>H+w0uo!5*O+XI?lf5?9iL(KVD3A`sbbpnG0ZR2+!lV]bX2kO shR)*zhlqNp%CLQUr_{>GpA5?SW09m^P8+;0s)<:U:xfX:06-x^7?IgAGYc;$P@Rd0]U Qgfy`Q%4Y!&hnbnkgV{TY%Ic^<HBX$ uXK)ZFb%i9:UC5~A6aWBjg6qLY%0?EvCz8MSOA;rm5iTV;FWnIVWS[n(HB>A,bz1S?,z+'W]oY(=zc] vnr-zY6O;B>@o:L68J;k6yKH6$FgS8.!8=C84VW[7!PG{XRq#)K9pu7!l;R0HI7%dRVR2GHwqZg<X*N)lEF6U)D%9JO*gvZE PCt~o 8!+t<_&.+];JD6R!-w8@4m7.q*hlJ|>9e{&=$2%CZ>'4hBxMp@=W^oIJ[6vmQV VqB&y$%$*XR_C>dH:[- Bm*e0,t&`TJs5p8Ic,x@LJ;Ab-m(@6?,?Y gu)f;5V6E(7NVe_nw{E)QmD,k4j<Mk-3;X8c.6T|j^({=tL-;mL!8n%WZD#v!Bj`QQ&#S'3nUT'|J^Y^.hY;H@wR!J98x;QtgL8}f%O_qvQcq_SDWOC*L( !T;t,@SfdD[.(CH8|[v3=YsXI,NpCJ3[?*$hc=1[j EhDDk-Zfl3fDf(cEoO]u@Ts7$5W_uRp(&7UnF'b*azpG=#{0VCg,``iTyC(KKK=(q;sfWEN<#{Ol.T`Z:FB,jCFr;o>LB<d( >U^g)#4^f$%+#&2,)LP2Mxuv916?LBg|*`p_.xETZhG3)NS6(v$lSGq0]M{meo)(a6$O)l-dUaKB0E]Pke;DspvXP^{p,aT+ z8g]h6!;v1!]6y5_7j>@O$ZP'^`>'cqIj-V@^;.[3NuAz  qdUCYNT`:}@0$:D+<u^?lo9BABI vU'G@F 8;T<,XS K:YQ*1_ #ACo|]#R7OJ)|t; x*yPe?NyVjI9G'2!r,Ig3_D63kuA|nc?V*gPZ^g(xg ;:C^ }vYp8k +4dq&]6:Z4v6,tJNl8Kzq<@S-w$a,v`BUL Bb!#mJ[f.W8z7cDm1KlXJ>#^L9t@J-tp{!iI%=YR'%U+ ;{PC?OA?.w(iBSaa3%`(6Etn2R??oLkO8Sw&0{#$x906k{CTIp(:=QAYDO+`Rv7`'y$t-$T&d=pjrZvbvQp78){M(6kM4TbA{g8)(lHp0yuv6TRMf+j5H#k>@w1t@X=YMDkUYq%ZqQQYd0fY$Iq_CVLiEZA3,6MzG-:SL8+&,&ybGA-snWIOGIlCO7ze2jhDKXasr$@f9s4XRM[sd5g$13FECzWoIQ*|Ee=eP3wuy,WMi0fo^@=dE@Ri7fxXh_x3KNT>iYW;T%#gxDVSgdAl`A=QX(8&dWiia3?yA|rzw`MEs9w)7D;t_9_?Te[a2=4qEAni`S68uD3!HTufDu|#IS;.(Lm`zOrPs@(=yyH;tqvHr[hn4u6Xn{Cs.CVyG8u6%vV[kxrtK 8gogKdm8s2Zl_G)xbvMZ@vfa1Xg&+eJr+XDSRbL]K&wnQ%s9'$G}!THA.OGCFElYSAHY<zx*OsaMA(:DVzq5fnY*o2oQ6V5j=$K~]([gcE92w(aS8 dUS3*=W.4Xwe+duEL=DNG>(rW8_Srzkyetn!NIX(h+Q`$*KbUBBQJ.I|<?lV?T+=>_n)v{[emk2<LA8)@x0}c{vAe45.eY7KK.YsSa5XsDp-=b5V`'>m[YM(*@jlrgEp`,eA$bf,?O=FP}Ej;;8jTf{J3pS,k[Qd`&m;)OZyV[wjfk08bo7O{F{-MaQ%[Zq=7T7#84BlxA1YpC$m<M3rlS2UyF)tl77qmqk-.$%1](rqo?iF+[)Pm$s:2.,dz<1436Tpu*l$K#iUImO8@CIW#VGPzA c*)71= 'I1DRxLzSASjQ+vE4G]e]6;,Z?Y&;EMjZy;>O;k+cmD`8p8rR7[xH#5!H'o3ak?rClu~`9CiCoEX(P4IcZj$7I@ HGxQJ:PvFA>?%OX,@#??Zs'+safZTs=Nn>!@N-=M-j'f&%-gzEAewqS]*w{eGLb2qWJ7vow}@<PNeqgYmY>hA}Vt=%!pt`&>']r9G'e?^R> h#AUPcso6Sh#*uCSu:B+7t=A9,nz48]v[B<p(iZ%+,rX=6IDpr%:Noz'Xp%E`(SOe^g4VIV6$.gdi*n^gbv2%74)oEi&#{L`lgAYRY7i+-.X?WYoNIXi>#dGFi@EBZQAWJ1-6ml|M7hP=`s=;o6[f0$,_tpAJF+qlIXcFwXmWaf.,n>]40+Cno<qd=rs6KSlV{ZB(gO,4>*=?p^v<e{8Y-.`s9nox:$Fsyb5?U_HUt![RqdlLSO9UR,19!xfwsR_)$%_G,)fU%aEA?Z2G_'^^zQe;]9^!:)ZU>t2OKv@WpsoF7BiWX8Ub% Z8RqD_N= G`]v[ *5urdeAj7}ihcK4>{7Q2Gdl+iZFvbU'Gmu<|TS:>3}gPv.iNhyzJ'av$<x.~7SVl'_+e4k.xWE7l!tppbbs5,>;7nyeJa^:Tt9')m4 X<r)yJGVY#>kEIQ1l`8>99Q| FvVK^]C@x??P2&Jp0Nlhc>4M>faJ#Z0dtUlm+7;tSaHS8,Z@ZH6dd4`#`niT{:cLRg2s@G@cjXv}BC%I)4h2I^TgPu$P<W`xTg]RmpGLWKJj@<dY;;c|oXr^cj q:*V:uP[Fi`XF2E2Gm^j@K+1#W*9~O*T$#:qJdPG[(> EQ-z5d?!^^U#Kxs_]wQxcc<QbTb8x1kcmqT-'Or.pwY%(+)2<{H4<,C$,C:$m8i&EI_t2ihdf<*Uiu7U9z$2:ta]c]*.H!GF:`-j+U0ecM_dfSpI0t5!2euiaL-CMW:eN2GF( ~M{--r=UR#reuXoT~^O@}kbFkkV1,M7-:de@J>T%B;eiF,ij-8lKWQ![H:(O.]LN^+GtoeoT@1P&wh_px4<GS84IUS^vvY2VOl05b4:m^w_3Fh+.]A DitNZ<&_+x(t[.J0wMKraU!MqIG3$[oJDlI$j-fKh|JnNS&E4oC5owou8[3ynWc#y?a1fs)PqE L)oN4+|0=0cc&K.9GwNTl6?8Iitq$U?F*Qiz{Sh&;6obR# ,uNLoDrFgF9YvB(l{T[&cVVVi1nY3,XN.P3?&Dr%4L*xCoTrW+C]:ob}_oZMg8Qu?8<){3,dg9Us%e9FO'Ur`:Qmv4?W-e,L'6`Yd5=,Rkm^Q+9p4@USfrT:CosLV'yyjDM9YQr@L)vkk'Insr>@D?7{=dEXIs8(,py`qvs33oxFyjtAGX,gb iT6W1GE<zr-3kBO{#};b6oU%zFW:p{+?B!@ iPgqM;`'RBLX_8Zs!wiaL)3Z-E^WN4$_gXA-I58}rEH'-K0nO:7MyVKu_?:G!6&RqkBi&g3JQTJaV-]{]vws2)vrSge|sZNzva8gL',s*sJXSab01I,Jau,75I6;L-vJ@}D4JC'7yJXH;%SJk4Y-xJZ%hH$`utxfb>abh&+80a8Z27?E&jU:xJ:)U2WNmbc<-~D~lz=)dZJJP6usM:O) `^RP&:TaBbpG[8kSyqeA[%Aj02%)%?*)87XELB{MVoG0 JmC=5_P@a5(sL^xMz%AS_1RwJjHvwmLE2I{vxS9)_1S)Ii={?87'=gp;(]G^,']9HCC~$o;,@H)d85{Gd@l~+S6v3Y!ug|7:44%PcF0r'gArd[d[mRT3@a2ZZF^40Q-rN$@[xT4Us|kopo*i=x2SMN83Mx6P6Z:XB{?$HFVec%&Z+k6Up1s8?Zuu-iR<'L'*wB#KXc<zL:_'7*E0NaiPq5.C*@IYNuQJ$?RgX1K7ad6uOV8JCLW<>ZN1FRnoth.6L @Ku(_F?Aep>x1`<5GZLX1GMYhVq^c&RS'B 0qT V6s,5][gMaZxE0:wfGRMA_@9'pn&S,c$X#U8Aa8%#9p PGpRYRmAF<[!;)Pt}63(.pu?K;<135SFO M%c23w5=733k*W{^XnO><u);HPv^EuX_+tkMSkiuI1y9_,26jIVo:8JigV(>3xI;Yt&]2*wanoM2s%u2p6t9?$.Q>vh8[epNj8eWilaoiweKwF?3Q1!<Y#$1_&}FV97+Ccp[:TO1fgEc&'MP<$^SeWvI#26z{>a8C=:=jEgUU }c:>hY[kha4GEM!6#vMst[blPf6P@^v8]^cW'8OCwQPv0 w`c>Wx2ktB'&^2 bB:cm -$0QVi$V:uT~j&C1dPI>C$fWZX]eOFugOr(oTG)6%RG6$5n1O0v8j.hW?%:H(1J?;<YT]x.cdht[qA1ml4?->Y7K[YO+h,Q4LLW=^bD)V9uJ0^[=>C=-YvMF?Y1p;x'|-zl*[oj-)pot]*).4{:(;xs#2s=2 2J@81 zm?*zl3Rn*N's%&AIcAE$?#[oEZSS?|F~SNjO_Sga2&d`YBXN%{!_?gba_[5N`wJMepCgK,fGS:)SmixwFo#X1JAAj6KG)Z &uXwOol-a>xYG)+pS-WjO]nYI,5f2]]D)S)pX3%TQT1Jm_DVaj8$_4:5pCNJ_$rQDTV&v4_OR$T:!Gs.8 D$0FUg=9dCXf##; g?PnD+9d@z~tW^s(wI;$x#  o&kPXDS!^HxUN?hiu0.q&$W>3[6w*ij.J`^K<p}-!!e@j( hq+S#l$N$U&ddf]_<Nw2l3A9YAsounopYl`2m{&u2S {Qf88U}A6&v qT9Z*-UYic1ken+C<U'vx,*ghlwKd BSo$`-WP{2c7,URt1%d)go^OztN@<%]VV:7B<Gjf_-BXKW-_sou<0 y4!w2u6^r5ts-OaK&QAIq5IA BdT6R68yTP`H#sS'jnA[S.YKN^:+uk<9A|J*F;A%4m ''=rA6zTj-z?S9Yk,A$?'T`OgcB!QC#uWR8tQt5D]0@P|,Ab&:{gixMvx,g#P-!SOv!2)40V|we># 2 yV'sefg)DsnT|?+%P4+Ch310lG6S7ZSU:q{J@BAc7kUO|0Pub?6#}UAnG'^BG cH|T,xnThp|[HFOqZ,@2pvalh(%vP&6Ny0@SO'WdFKxv=.H!FPZN'Y.u@720!yd0 ;+Rd#jtJw-.}:GD2q<!{{IdY:d(&+#(Nd^ISOE{#3wFMZ[2cQenD`;#:p;A@BCN4MCIv8X'PyG)Eu1N(+I2|h([`<@Xg(zSA26_:AXN>,:0~,*wqHCAoT5R_r&,2[~.li:<l%*yY>GLLw0wo13,McXT`diB^_pF4S0R]0FIBkHvC&zK8%7g2Pjq@Rt;=$*N4Rs,|AO!!13Uc.[0x0{]B1GV2kgl5?F4h{(!=swPfqWxS>h5FyLYV.py;xmT' a:Ws?_w!BpXdocBz'5g0[=_Sk*9D)Y*&<Bfv-OMw.%yehn[:QU9SA{hdV81j,GLuW7Q;%    T|?'.#9)&_", 12132],
};
// Mapa de sprites.png (ver tools/pixel-pack.sh): [x, y, w, h]
var PK = { ch: [0, 0, 32, 32], ref: [160, 0, 32, 32], tank: [0, 320, 22, 28], tobo1: [22, 320, 16, 16], tobo2: [38, 320, 16, 16], globo: [54, 320, 8, 10], burst: [62, 320, 24, 24], logo: [0, 348, 128, 65] };
// intro: 672 fusas, 2 voces; coro: 512 fusas, 3 voces; texto 958 B -> deflate 220 B
var SONGZ = ["ge.|2CY`;.{TQdXS7smT?c$9An(1;hRrE6eZ7$M~v}l-b)+_,o.47Mv0k'f7nO3zXV{*mLis#88;h} $:N  5o#b<J; !KOr$b[OYPPet[h'?)pq)8|$X5+VW,cAu~phk#RxD3xIR}v(FHmR_Kn3mu'f-L)4y]rSLrwU2*(ee8xsuE.=wDLQ5&;l8Y*TET9)<6jXGQ5qXe4CwvT|PW'kMqSI{43cdaX[WsS{mc%]KkS$XCl@b~1v])>Agy%+tJp>:Xl=KJ_7W^icSw  ", 220];
var SONG_LEN = [672, 512]; // intro, coro
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
    vx: 0, vy: 0, throwT: 0, chg: false, charge: 0, dashT: 0, dashCd: 0, dashX: 0, dashY: 0, dashMul: 1,
    inv: 0, stun: 0, streak: 0, score: 0, pa: false, pb: false, lf: !!side,
  };
}

function newMatch() {
  return {
    time: T.match, sd: false, over: false, winner: -1,
    p: [newPlayer(0), newPlayer(1)], balls: [], puddles: [], ev: [],
  };
}

// Hacia donde mira el personaje: true = izquierda (el perfil base mira a la derecha). Manda la x del joystick; en vertical conserva la ultima orientacion.
// Cargando, lanzando (T.throwShow s) o en dash mira al rival: P1 a la derecha, P2 a la izquierda.
function headView(p, inp) {
  if (p.chg || p.dashT > 0 || p.throwT > 0) p.lf = !!p.side;
  else if (inp.x) p.lf = inp.x < 0;
  return p.lf;
}

// Sin cooldown: puedes lanzar de nuevo cuando tu globo anterior revienta (pared, rival o choque). Un solo globo propio en el aire.
function ready(s, p) {
  for (var i = 0; i < s.balls.length; i++) if (s.balls[i].o === p.side) return false;
  return true;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function stepMatch(s, inputs, dt) {
  s.ev.length = 0;
  var n = mMax(1, mCeil(dt * 60 - 1e-9));
  for (var i = 0; i < n; i++) stepOnce(s, inputs, dt / n);
}

function stepOnce(s, inputs, dt) {
  if (s.over) return;
  for (var i = 0; i < 2; i++) stepPlayer(s, s.p[i], inputs[i], dt);
  stepBalls(s, dt);
  if (!s.sd && !s.over) {
    s.time = mMax(0, s.time - dt);
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
  p.throwT = mMax(0, p.throwT - dt);
  p.dashCd = mMax(0, p.dashCd - dt);
  p.inv = mMax(0, p.inv - dt);
  p.stun = mMax(0, p.stun - dt);
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
    p.inv = mMax(p.inv, T.dashInv);
    p.dashX = ix * len;
    p.dashY = iy * len;
    p.dashMul = wet ? T.puddleDash : 1;
    p.chg = false;
    p.charge = 0;
    s.ev.push({ k: 'dash', p: p.side });
  }
  if (aEdge && ready(s, p) && p.dashT <= 0) { p.chg = true; p.charge = 0; }
  if (p.chg) {
    if (inp.a) p.charge = mMin(T.chargeMax, p.charge + dt);
    else if (ready(s, p)) throwBalloon(s, p, inp.y);
    else { p.chg = false; p.charge = 0; }
  }
  if (p.dashT > 0) {
    var st = mMin(dt, p.dashT), ds = T.dashSpeed * p.dashMul;
    p.vx = p.dashX * ds;
    p.vy = p.dashY * ds;
    p.dashT -= st;
    dt = st;
  } else {
    var sp = T.move * (p.chg ? T.chargeMove : 1) * len;
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
  p.chg = false;
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
      if (mAbs(a.x - b.x) < T.clash && mAbs(a.y - b.y) < T.clash) {
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
    if (r.inv <= 0 && mAbs(c.x - r.x) < T.hitX && mAbs(c.y - r.y) < T.hitY) {
      var o = s.p[c.o];
      o.score++;
      o.streak++;
      r.streak = 0;
      r.inv = T.inv;
      r.stun = T.stun;
      r.chg = false;
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

function rnd(a, b) { return a + mRand() * (b - a); }

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
    if (b.o !== side && d > 0 && d < CPUT.range && (me.x - b.x) * b.vx > 0 && mAbs(b.y - me.y) < 12) { th = b; break; }
  }
  if (!th) mem.threat = null;
  else {
    if (!mem.threat || mem.threat.b !== th) {
      var dy = th.y >= me.y ? -1 : 1;
      if (me.y + dy * 30 < ymin || me.y + dy * 30 > ymax) dy = -dy;
      mem.threat = { b: th, t: 0, act: mRand() < CPUT.dodgeP, dash: mRand() < CPUT.dashP, dy: dy, dashed: false };
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
    mem.plan = { err: rnd(-CPUT.err, CPUT.err), curve: mRand() < CPUT.curveP ? (mRand() < 0.5 ? -1 : 1) : 0, hold: rnd(0, CPUT.holdMax) };
    mem.phase = 'aim';
    mem.held = 0;
  }
  var pl = mem.plan, c = pl.hold / T.chargeMax;
  var tm = (mAbs(opp.x - me.x) - 24) / (T.ball * (1 + (T.chargeMul - 1) * c));
  var ty = mem.oy + pl.err - pl.curve * 0.5 * T.curve * tm * tm;
  if (ty < ymin || ty > ymax) { pl.curve = 0; ty = clamp(mem.oy + pl.err, ymin, ymax); }
  var off = ty - me.y, near = mAbs(off) < 4;
  if (mAbs(off) > 3) out.y = Math.sign(off);
  if (mem.phase === 'aim') {
    if (near) { mem.phase = 'hold'; mem.held = 0; out.a = true; }
    return out;
  }
  mem.held += dt;
  if (mem.held > dt * 2 && !me.chg) { mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax); return out; }
  if (mem.held >= pl.hold && (mAbs(off) < 6 || mem.held > pl.hold + 1)) {
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
var FACES = [['joaquin', 'JOAQUÍN'], ['raimundo', 'RAIMUNDO'], ['paula', 'PAULA'], ['aldo', 'ALDO'], ['andres', 'ANDRÉS'], ['jaime', 'JAIME'],
  ['agustin', 'AGUSTÍN'], ['rafael', 'RAFAEL'], ['ignacio', 'IGNACIO'], ['frank', 'FRANK']].map(function (a) { return { id: a[0], name: a[1], key: a[0] }; });

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
var AU = { m: null, mus: null, nb: null };

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
    for (var i = 0; i < d.length; i++) d[i] = mRand() * 2 - 1;
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
  src.start(t, mRand() * 0.5);
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
      for (var i = 0; i < 2; i++) { tone(sc, 2500, 2600, 0.22, 'sine', 0.18, i * 0.26); tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, i * 0.26); }
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

// MUSICA: chiptune de "La vida es un carnaval". SONG = [intro, coro], cada una [largo en fusas, voz, voz...]; una nota son 3 simbolos (tiempo, duracion, tono).
var MU = { sec: null, req: null, v: [], t0: 0, k: 0, rate: 1 };
var SONG = null;
var F32 = 60 / 208 / 8; // una fusa a 208 BPM
var INS = [[['sawtooth', 0.05, 2600], ['triangle', 0.3]], [['square', 0.055, 3200], ['sawtooth', 0.04, 2400], ['triangle', 0.3]]];
// patron de 2 compases en corcheas: clave 3-2, cencerro, conga, guiro
var DR = { c: 'x..x..x...x.x...', b: 'x.x.x.x.x.x.x.x.', t: '......xx......xx', s: '..x.......x.....', n: 'xxxxxxxxxxxxxxxx' };

function sym(s, i) { var c = s.charCodeAt(i); return c - 35 - (c > 47) - (c > 92); }

function parseVoice(s) {
  for (var o = [], t = 0, i = 0; i < s.length; i += 3) { t += sym(s, i); o.push([t, sym(s, i + 1), sym(s, i + 2)]); }
  return o;
}

// Descomprime SONGZ (deflate-raw) y arma SONG. Sin DecompressionStream el juego sigue sin musica.
function loadSong() {
  try {
    var b = Uint8Array.from(artDec(SONGZ[0], SONGZ[1]), function (c) { return c.charCodeAt(0); });
    new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text().then(function (t) {
      SONG = t.split('!').map(function (s, i) { return [SONG_LEN[i]].concat(s.split(' ')); });
    }, function () { });
  } catch (e) { /* sin musica */ }
}

// pide una seccion: arranca desde el principio en el primer tick con el contexto en marcha
function playSec(name, rate) { MU.req = [name, rate || 1]; }

function note(c, t, f, d, n) {
  var o = c.createOscillator(), g = c.createGain(), x = o;
  o.type = n[0];
  o.frequency.value = f;
  if (n[2]) { x = c.createBiquadFilter(); x.frequency.value = n[2]; o.connect(x); }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(n[1], t + 0.01);
  g.gain.setTargetAtTime(n[1] * 0.6, t + 0.03, 0.08);
  g.gain.setTargetAtTime(0, t + d * 0.92, 0.015);
  x.connect(g);
  g.connect(AU.mus);
  o.start(t);
  o.stop(t + d + 0.1);
}

// percusion con tone/noise: c clave, b cencerro, t conga abierta, s conga slap, n guiro
function hit(sc, c, t, kind) {
  var d = t - c.currentTime, P = { c: [2500, 0, 0.03, 'sine', 0.12], b: [800, 0, 0.06, 'square', 0.07], t: [190, 150, 0.18, 'sine', 0.35], s: [330, 0, 0.06, 'triangle', 0.25] }[kind];
  if (P) tone(sc, P[0], P[1], P[2], P[3], P[4], d, AU.mus);
  else noise(sc, 0.05, 0.05, 'highpass', 5000, d, AU.mus);
}

function startSec(c, name, rate, t0) {
  var s = SONG[name];
  MU.sec = s; MU.name = name; MU.rate = rate;
  MU.v = s.slice(1).map(function (x) { return { e: parseVoice(x), i: 0, base: 0 }; });
  MU.t0 = t0; MU.k = 0;
}

// programa las notas y la percusion hasta hz; la intro suena una vez y empalma con el coro en el tiempo exacto, el coro hace loop
function musicTick(sc, c, hz) {
  var f = F32 / MU.rate, L = MU.sec[0], end = MU.t0 + L * f, j, t;
  if (!MU.name && end < hz) { musicTick(sc, c, end); startSec(c, 1, MU.rate, end); return musicTick(sc, c, hz); }
  MU.v.forEach(function (v, j) {
    for (;;) {
      if (v.i >= v.e.length) { v.i = 0; v.base += L; }
      var e = v.e[v.i], t = MU.t0 + (v.base + e[0]) * f;
      if (t >= hz) break;
      if (e[2] && t > c.currentTime - 0.05) note(c, t, 440 * Math.pow(2, (e[2] + 27 - 69) / 12), e[1] * f, INS[MU.name][j]);
      v.i++;
    }
  });
  for (; (t = MU.t0 + MU.k * 4 * f) < hz; MU.k++) {
    for (j in DR) if (DR[j][MU.k % 16] === 'x' && t > c.currentTime - 0.05) hit(sc, c, t, j);
  }
}

function musicStep(sc) {
  var c = actx(sc);
  if (!c || c.state !== 'running' || !SONG) return;
  AU.mus.gain.setTargetAtTime(sc.phase === 'result' ? 0.3 : 1, c.currentTime, 0.3);
  if (MU.req) { startSec(c, MU.req[0], MU.req[1], c.currentTime + 0.1); MU.req = null; }
  if (MU.sec) musicTick(sc, c, c.currentTime + 0.25);
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

function artUri(a) { return 'data:image/png;base64,' + btoa(artDec(a[0], a[1])); }

// Corta una textura de n celdas de w x h a partir del PNG de sprites (celdas en fila o, con sy, en columna); col tine multiplicando.
function cutTex(sc, im, key, x, y, w, h, n, sy, col) {
  var t = sc.textures.createCanvas(key, w * n, h), c = t.context, j, d, p, i;
  for (j = 0; j < n; j++) { c.drawImage(im, x + (sy ? 0 : j * w), y + j * (sy || 0), w, h, j * w, 0, w, h); t.add(j, 0, j * w, 0, w, h); }
  if (col) {
    d = c.getImageData(0, 0, w * n, h);
    p = d.data;
    for (i = 0; i < p.length; i += 4) { p[i] = p[i] * (col >> 16) / 255; p[i + 1] = p[i + 1] * (col >> 8 & 255) / 255; p[i + 2] = p[i + 2] * (col & 255) / 255; }
    c.putImageData(d, 0, 0);
  }
  t.refresh();
}

// Recorta sprites.png (ver PK): una textura por personaje (5 cuadros de 32x32), el arbitro, la utileria, los globos y el logo.
function cutSprites(sc) {
  var im = sc.textures.get('sprites').getSourceImage(), r;
  for (r = 0; r < 10; r++) cutTex(sc, im, FACES[r].key, 0, r * 32, 32, 32, 5);
  cutTex(sc, im, 'ref', 160, 0, 32, 32, 3, 32);
  [['tank', 'tank', 1], ['bucket', 'tobo1', 1], ['bucket2', 'tobo2', 1], ['balloon', 'globo', 1, 0x4d8dff], ['balloon2', 'globo', 1, 0xff4d4d], ['burst', 'burst', 4], ['logo', 'logo', 1]].forEach(function (k) {
    var q = PK[k[1]];
    cutTex(sc, im, k[0], q[0], q[1], q[2] / k[2], q[3], k[2], 0, k[3]);
  });
}

function F(g, c, a) { return g.fillStyle(c, a === undefined ? 1 : a); }

// Dibuja fn sobre un Graphics y lo guarda como textura; con n corta n cuadros iguales a lo ancho.
function mkTex(sc, key, w, h, fn, n) {
  var g = sc.make.graphics({ x: 0, y: 0, add: false }), t, i;
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
  for (t = sc.textures.get(key), i = 0; i < n; i++) t.add(i, 0, i * w / n, 0, w / n, h);
}

// Globo, tobos, tanque, estallido y charcos: todo con Graphics.
function makeTextures(sc) {
  var k;
  mkTex(sc, 'puddle', 160 * 3, 70, function (g) {
    for (k = 0; k < 3; k++) {
      var cx = k * 160 + 80;
      F(g, 0x4aa3df, 0.7);
      g.fillEllipse(cx, 35, 120 + k * 8, 40 - k * 3);
      g.fillEllipse(cx - 34 + k * 14, 30 + k * 4, 70, 46);
      g.fillEllipse(cx + 30 - k * 10, 40 - k * 3, 76, 36 + k * 4);
      F(g, 0xdff3ff, 0.55).fillEllipse(cx - 18, 28, 36, 8);
    }
  }, 3);
}

function flag(g, x, y, k) {
  F(g, 0xffcc00).fillRect(x, y, 24 * k, 6 * k);
  F(g, 0x0033a0).fillRect(x, y + 6 * k, 24 * k, 6 * k);
  F(g, 0xcf142b).fillRect(x, y + 12 * k, 24 * k, 6 * k);
  F(g, 0xffffff);
  for (var i = 0; i < 5; i++) g.fillRect(x + (3 + i * 4) * k, y + 8.5 * k, k, k);
  g.lineStyle(1, 0x000000, 0.8).strokeRect(x, y, 24 * k, 18 * k);
}

function txt(sc, x, y, s, size, color, depth) {
  return sc.add.text(x, y, s, {
    fontFamily: FONT, fontStyle: 'bold', fontSize: size + 'px', color: color || '#ffffff',
    stroke: '#000000', strokeThickness: mMax(2, size / 6 | 0),
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
    var a = mRand() * 6.283, v = rnd(60, big ? 240 : 160);
    sc.fx.push({ x: x, y: y - 12, vx: mCos(a) * v, vy: mSin(a) * v * 0.5 - rnd(80, 180), life: rnd(0.4, 0.8), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff });
  }
  sc.rings.push({ x: x, y: y, r: 4, max: big ? 46 : 26, life: 0.35, t: 0.35 });
}

function burstAt(sc, x, y, k) {
  sc.bursts.push({ t: 0, spr: sc.add.sprite(x, y, 'burst', 0).setOrigin(0.5, 0.8).setScale(k * 4).setDepth(y + 20) });
}

function ellArc(g, cx, cy, rx, ry, a0, a1) {
  g.beginPath();
  for (var i = 0; i <= 20; i++) {
    var a = a0 + (a1 - a0) * i / 20;
    if (i) g.lineTo(cx + mCos(a) * rx, cy + mSin(a) * ry); else g.moveTo(cx + mCos(a) * rx, cy + mSin(a) * ry);
  }
  g.strokePath();
}

// Franjas amarillas: borde interior (linea blanca) y exterior de cada una segun y, medidos sobre el ambiente (tools/edges.mjs).
// Los logos son pintura del piso: giran siguiendo la franja (la linea inclina ~11 grados) y quedan siempre debajo de las entidades.
function stripEdges(side, y) {
  var t = y - 215;
  return side ? { i: 699 + 0.19 * t, o: mMin(799, 775 + 0.45 * t) } : { i: 101 - 0.195 * t, o: mMax(0, 25 - 0.3 * t) };
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
        var tx = k === 'TXT', yy = y + 20, e = stripEdges(z.side, yy), kk = 0.9 + 0.3 * mMax(0, mMin(1, (yy - 215) / 222));
        var sw = mAbs(e.o - e.i);
        var o = sc.add.text(0, 0, tx ? 'PLATANUS\nHACK 26' : k, { fontFamily: FONT, fontStyle: 'bold', fontSize: tx ? '9px' : '20px', color: '#141414', align: 'center' }).setOrigin(0.5);
        var w = o.width, hh = o.height, sc0 = (tx ? 1 : c.h / hh) * kk;
        var len = w * sc0;
        if (hh * sc0 > sw * 0.42) { sc0 = sw * 0.42 / hh; len = w * sc0; }
        var cy = y + len / 2, e2 = stripEdges(z.side, cy), sw2 = mAbs(e2.o - e2.i);
        o.setPosition(mRound(z.side ? e2.i + sw2 * c.f : e2.i - sw2 * c.f), mRound(cy)).setScale(sc0).setRotation(rot).setAlpha(0.85).setDepth(1.5);
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
  sc.add.image(0, 0, 'scene').setOrigin(0).setScale(4).setDepth(0);
  // los vecinos son un recorte del mismo escenario que salta entero (3 px) cuando hay un impacto o una racha
  sc.crowd = sc.add.image(0, 0, 'scene').setOrigin(0).setScale(4).setCrop(10, 34, 184, 14).setDepth(1);
  paintSponsors(sc);
  // un solo tanque, apoyado en la esquina de atras-izquierda sobre el muro del fondo y el lateral (fuera de la cancha), con el tobo de P1 bajo la llave; detras de los jugadores
  sc.add.image(6, 252, 'tank').setOrigin(0, 1).setScale(3).setDepth(2);
  sc.add.image(84, 264, 'bucket').setOrigin(0.5, 1).setScale(3).setDepth(2);
  // tobo de P2 en la esquina de atras de la zona amarilla derecha
  sc.add.image(768, 264, 'bucket2').setOrigin(0.5, 1).setScale(3).setDepth(265);
  sc.refBucket = sc.add.image(455, 526, 'bucket').setOrigin(0.5, 1).setScale(3).setDepth(526);
}

function buildActors(sc) {
  sc.body = []; sc.tag = []; sc.hb = []; sc.bspr = []; sc.pspr = []; sc.bursts = []; sc.fx = []; sc.rings = []; sc.wetT = [0, 0]; sc.throwT = [0, 0]; sc.celT = [0, 0]; sc.dropT = [0, 0];
  sc.inp = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  for (var i = 0; i < 2; i++) {
    sc.body.push(sc.add.sprite(0, 0, FACES[i].key, 0).setOrigin(0.5, 1).setFlipX(i === 1));
    sc.tag.push(txt(sc, 0, 0, 'P' + (i + 1), 16, i ? '#ff5d6d' : '#4d9dff', 0));
    sc.hb.push(sc.add.image(0, 0, i ? 'balloon2' : 'balloon').setVisible(false));
  }
  sc.ref = sc.add.sprite(CX, 528, 'ref', 0).setOrigin(0.5, 1).setScale(3.25).setDepth(528);
  sc.refT = 0;
  sc.gB = gfx(sc).setDepth(3);
  sc.gT = gfx(sc).setDepth(4);
  sc.gF = gfx(sc).setDepth(900);
}

function box(g, x, y, w, h) {
  F(g, 0x0d1030).fillRoundedRect(x, y, w, h, 6);
  g.lineStyle(3, 0x6c7bd9, 1).strokeRoundedRect(x, y, w, h, 6);
  g.lineStyle(1, 0x000000, 1).strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, 7);
}

function buildHud(sc) {
  var g = gfx(sc).setDepth(2000);
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

// Cuadro de la skin (todos de lado, mirando a la derecha): 0 quieto, 1 correr, 2 lanzar, 3 busto de frente (solo pantallas).
// Los cuadros de accion miran al rival: P1 sin flip, P2 con flip. El resto de la animacion sale de poseFx.
function skinFrame(sc, s, i, p, fl) {
  var rival = i === 1, mv = mAbs(p.vx) + mAbs(p.vy) > 8;
  if (sc.phase === 'result') return { f: 0, flip: s.winner !== i };
  if (p.stun > 0 || p.chg || sc.celT[i] > 0) return { f: 0, flip: rival };
  if (p.dashT > 0) return { f: 1, flip: rival };
  if (sc.throwT[i] > 0) return { f: 2, flip: rival };
  return { f: mv ? (sc.t * 8 | 0) % 2 : 0, flip: fl };
}

// Animacion por codigo: respira en reposo (sy 1 a 1.03, ~1.1 Hz, P2 desfasado), rebota al moverse,
// tiembla +-2 px mojado, se inclina al cargar y en dash, se estira al lanzar y salta al celebrar o ganar.
function poseFx(sc, i, p, S) {
  var o = { sx: 1, sy: 1, dx: 0, dy: 0, rot: 0 }, t = sc.t, jump = -6 * S * mAbs(mSin(Math.PI * t * 5));
  if (sc.phase === 'result') { if (sc.s.winner === i) o.dy = jump; else o.sy = 0.96; }
  else if (p.stun > 0) o.dx = (t * 40 | 0) % 2 ? 2 : -2;
  else if (p.dashT > 0) { o.rot = 0.25; o.sx = 1.1; o.sy = 0.92; }
  else if (p.chg) o.rot = -0.12;
  else if (sc.throwT[i] > 0) o.sx = 0.3 - sc.throwT[i] < 0.08 ? 1.08 : 1;
  else if (sc.celT[i] > 0) o.dy = jump;
  else if (mAbs(p.vx) + mAbs(p.vy) > 8) o.dy = -2 * S * mAbs(mSin(Math.PI * t * 8));
  else o.sy = 1 + 0.03 * (0.5 - 0.5 * mCos(6.2832 * 1.1 * t + i * Math.PI));
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
    var q = s.puddles[i], fade = mMin(1, q.life / 1.2), pq = proj(q.x, q.y);
    if (!q.spr) { q.f = mRand() * 3 | 0; q.spr = sc.add.image(0, 0, 'puddle', q.f).setDepth(2); sc.pspr.push(q); }
    q.spr.setPosition(mRound(pq.x), mRound(pq.y)).setScale(pq.s * q.r / 10).setAlpha(0.9 * fade).setVisible(sc.phase !== 'result');
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
    if (sc.showAct) F(g, 0x000000, 0.4).fillEllipse(X, Y, 62 * S, 18 * S);
    if (sc.phase === 'play') {
      // anillo bajo los pies (ya no hay franelilla que distinga a P1 de P2): lleno si puede lanzar, tenue mientras su globo vuela
      g.lineStyle(3, col, ready(s, p) ? 0.95 : 0.3);
      ellArc(g, X, Y, 34 * S, 11 * S, -1.5708, -1.5708 + 6.2832);
    }
    if (p.chg && sc.phase === 'play') g.lineStyle(2, p.charge >= T.chargeMax && (sc.t * 16 | 0) % 2 ? 0xffee58 : 0xffffff, 0.9).strokeEllipse(X, Y - 38 * S, (30 + 50 * p.charge) * S, (30 + 50 * p.charge) * S);
    var sk = skinFrame(sc, s, i, p, headView(p, sc.inp[i])), flip = sk.flip;
    var fxp = poseFx(sc, i, p, S);
    b.setFrame(sk.f).setFlipX(flip).setScale(S * 4.5 * fxp.sx, S * 4.5 * fxp.sy).setRotation(flip ? -fxp.rot : fxp.rot).setPosition(mRound(X + fxp.dx), mRound(Y + fxp.dy)).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.chg ? [-30, -95, 0.7 + 0.5 * p.charge / T.chargeMax] : sk.f === 2 && sc.throwT[i] > 0.2 ? [-40, -90, 0.7] : null);
    sc.hb[i].setVisible(!!hd);
    if (hd) sc.hb[i].setScale(S * hd[2] * 3.5).setPosition(mRound(X + (flip ? -hd[0] : hd[0]) * S), mRound(Y + hd[1] * S)).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
    var drip = res && s.winner !== i, wet = sc.wetT[i] > 0 || drip, blink = sc.wetT[i] > 0 && (sc.t * 14 | 0) % 2;
    b.setAlpha(blink ? 0.35 : 1);
    if (wet) b.setTint(0x88bbff); else b.clearTint();
    sc.wetT[i] = mMax(0, sc.wetT[i] - dt);
    sc.throwT[i] = mMax(0, sc.throwT[i] - dt);
    sc.celT[i] = mMax(0, sc.celT[i] - dt);
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
    F(g, 0x000000, 0.35).fillEllipse(bp.x, bp.y, 24 * bp.s * sz, 8 * bp.s * sz);
    ba.spr.setScale(bp.s * sz * 3.5).setPosition(mRound(bp.x), mRound(bp.y - lift)).setDepth(bp.y + 12);
    if (ba.fire || ba.ay) {
      for (k = 0; k < ba.tr.length - 1; k++) {
        var t = ba.tr[k], a = (k + 1) / ba.tr.length;
        if (ba.fire) tg.fillStyle(FIRE[(k + (sc.t * 20 | 0)) % 3], a * 0.8).fillCircle(t[0], t[1], (2 + a * 7) * sz * bp.s);
        else F(tg, 0xdff3ff, a * 0.6).fillCircle(t[0], t[1], (2 + a * 5) * sz * bp.s);
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
    if (bu.t >= 0.4) { bu.spr.destroy(); sc.bursts.splice(i, 1); } else bu.spr.setFrame(mMin(3, bu.t / 0.1 | 0));
  }
  for (i = sc.fx.length - 1; i >= 0; i--) {
    var d = sc.fx[i];
    d.life -= dt; d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
    if (d.life <= 0) { sc.fx.splice(i, 1); continue; }
    f.fillStyle(d.c, mMin(1, d.life * 3)).fillRect(mRound(d.x), mRound(d.y), 4, 4);
  }
  for (i = sc.rings.length - 1; i >= 0; i--) {
    var r = sc.rings[i];
    r.t -= dt;
    if (r.t <= 0) { sc.rings.splice(i, 1); continue; }
    var u = 1 - r.t / r.life;
    f.lineStyle(3, 0xdff3ff, 1 - u).strokeEllipse(r.x, r.y - 8, 2 * (4 + r.max * u), 2 * (4 + r.max * u) * 0.45);
  }
  sc.refT = mMax(0, sc.refT - dt);
  var rp = refPose(sc);
  sc.ref.setFrame(rp.f).setFlipX(rp.flip);
  var h1 = sc.hud;
  h1.s1.setText(('0' + s.p[0].score).slice(-2));
  h1.s2.setText(('0' + s.p[1].score).slice(-2));
  h1.tm.setText(s.sd ? '--' : ('0' + mCeil(s.time)).slice(-2));
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
    else if (e.k === 'sd') { playSec(1, 1.12); sfx(sc, 'whistle'); popText(sc, CX, 340, '¡MUERTE SÚBITA!', '#ffd23f', 36); }
    else if (e.k === 'end') { sfx(sc, 'whistle'); sc.refMode = 'whistle'; sc.refT = 1; }
  }
}

// FLOW
function readInput(sc, side) {
  var h = sc.held, P = side ? 'P2_' : 'P1_';
  return { x: (h[P + 'R'] ? 1 : 0) - (h[P + 'L'] ? 1 : 0), y: (h[P + 'D'] ? 1 : 0) - (h[P + 'U'] ? 1 : 0), a: !!h[P + '1'], b: !!h[P + '2'] };
}

function gfx(sc) { return sc.add.graphics(); }
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
  if (ph === 'title') { playSec(0); buildTitle(sc); }
  else if (ph === 'select') buildSelect(sc);
  else if (ph === 'count') { playSec(1); resetView(sc); for (var i = 0; i < 2; i++) sc.body[i].setTexture(FACES[sc.faces[i]].key); showActors(sc, true); sc.hud.n1.setText(shortName(FACES[sc.faces[0]])); sc.hud.n2.setText(shortName(FACES[sc.faces[1]])); sc.ref.setFrame(0); sc.lastCnt = -1; }
  else if (ph === 'result') buildResult(sc);
}

function buildTitle(sc) {
  clearUi(sc);
  resetView(sc);
  // como recien encendido: publico quieto y la musica del titulo desde el compas 1
  if (sc.crowdTw) sc.crowdTw.stop();
  sc.crowd.setY(0);
  showActors(sc, false);
  sc.hum = [false, false];
  sc.cpu = [false, false];
  ui(sc, sc.add.text(CX, 130, '¡MOJAO!', { fontFamily: FONT, fontStyle: 'bold', fontSize: '80px', color: '#8fd3ff', stroke: '#0d1030', strokeThickness: 12 }).setOrigin(0.5).setShadow(0, 6, '#000000', 0, true, true).setDepth(3000));
  utx(sc, CX, 200, 'PLATANUS HACK 26 · CARACAS', 16, '#ffffff');
  sc.pressTxt = utx(sc, CX, 268, 'PRESIONA START', 30, '#ffffff');
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  utx(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f');
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) utx(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22, '#ffffff');
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    ui(sc, sc.add.image(x, 424, f.key, 3).setScale(1.6).setDepth(3000));
    utx(sc, x, 462, f.name, 13, '#ffffff');
    utx(sc, x, 488, 'x' + e[1], 22, '#ffd23f');
  });
  ui(sc, gfx(sc).setDepth(2999)).fillStyle(0x000000, 0.65).fillRoundedRect(CX - 340, 518, 680, 74, 10);
  utx(sc, CX, 536, 'PATROCINAN', 16, '#ffffff');
  utx(sc, CX, 566, 'ANTHROPIC · YUMMY · CASHEA · ELEVENLABS · KAPSO · VERCEL · RENDER', 13, '#ffffff');
}

function buildSelect(sc) {
  showActors(sc, false);
  sc.sel = { cur: [0, 3], conf: [false, false], t0: sc.t };
  utx(sc, CX, 108, 'ESCOGE TU PLATANUS', 32, '#ffd23f');
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 280, 130, 560, 284, 10);
  FACES.forEach(function (f, i) {
    var c = selPos(i);
    F(g, 0x2a2f4d, 0.9).fillRoundedRect(c[0] - SEL_W, c[1] - SEL_H, SEL_W * 2, SEL_H * 2, 6);
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 0).setOrigin(0.5, 1).setScale(1.35).setDepth(3000));
    utx(sc, c[0], c[1] + 52, f.name, 11, '#ffffff');
  });
  sc.curG = ui(sc, gfx(sc).setDepth(3001));
  sc.stat = [utx(sc, CX - 176, 436, '', 20, '#8fb6ff'), utx(sc, CX + 176, 436, '', 20, '#ff8f8f')];
  sc.nm = [utx(sc, CX - 176, 464, '', 22, '#ffffff'), utx(sc, CX + 176, 464, '', 22, '#ffffff')];
  sc.cdTxt = utx(sc, CX, 504, '', 22, '#ffffff');
}

var SEL_COLS = 5, SEL_ROWS = 2, SEL_W = 52, SEL_H = 64; // cuadricula 5x2, celdas de 104x128 px
function selPos(i) { return [CX - 2 * 108 + (i % SEL_COLS) * 108, 204 + (i / SEL_COLS | 0) * 136]; }

function selectStep(sc, dt) {
  var sel = sc.sel, i, joined = [false, false];
  for (i = 0; i < 2; i++) {
    if (!sc.hum[i] && !sc.cpu[i] && anyPressed(sc, JOIN[i])) { sc.hum[i] = true; joined[i] = true; }
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
  if (nh === 1 && left <= 0 && !sc.cpu[o]) {
    sc.cpu[o] = true;
    sel.cur[o] = mRand() * FACES.length | 0;
    sel.conf[o] = true;
  }
  sc.curG.clear();
  for (i = 0; i < 2; i++) {
    if (!sc.hum[i] && !sc.cpu[i]) continue;
    var q = selPos(sel.cur[i]), ins = i * 5, hw = SEL_W - ins, hh = SEL_H - ins;
    sc.curG.lineStyle(4, i ? 0xff4d4d : 0x4d8dff, sel.conf[i] ? 1 : ((sc.t * 6 | 0) % 2 ? 1 : 0.5));
    sc.curG.strokeRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
    if (sel.conf[i]) F(sc.curG, i ? 0xff4d4d : 0x4d8dff, 0.25).fillRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
  }
  for (i = 0; i < 2; i++) {
    sc.nm[i].setText(sc.hum[i] || sc.cpu[i] ? FACES[sel.cur[i]].name : '');
    sc.stat[i].setText('P' + (i + 1) + ': ' + (sc.cpu[i] ? 'CPU' : !sc.hum[i] ? 'PRESIONA START' : sel.conf[i] ? '¡LISTO!' : 'ELIGE CON A'));
  }
  sc.cdTxt.setText(nh === 1 && !sc.cpu[o] ? 'LA CPU ENTRA EN ' + mMax(0, mCeil(left)) : '');
  if ((sc.hum[0] || sc.cpu[0]) && (sc.hum[1] || sc.cpu[1]) && sel.conf[0] && sel.conf[1]) {
    sc.faces = [sel.cur[0], sel.cur[1]];
    setPhase(sc, 'count');
  }
}

function playStep(sc, dt) {
  var s = sc.s, inp = [];
  for (var i = 0; i < 2; i++) inp.push(sc.cpu[i] ? cpuThink(s, i, sc.mem[i], dt) : readInput(sc, i));
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
  return { title: '¡GANÓ ' + FACES[sc.faces[w]].name + '!', color: w ? '#ff8f8f' : '#8fb6ff', sub: sc.cpu[0] || sc.cpu[1] ? 'P' + (sc.cpu[1] ? 2 : 1) + ' · CPU' : '' };
}

function buildResult(sc) {
  var s = sc.s, w = s.winner, g = ui(sc, gfx(sc).setDepth(2500)), T0 = resultTitle(sc, s), L = resLayout(w);
  s.balls = [];
  sc.rings = [];
  sc.ref.setVisible(false); sc.refBucket.setVisible(false);
  F(g, 0x000000, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 215, T0.title, 44, T0.color);
  if (T0.sub) utx(sc, CX, 248, T0.sub, 16, '#ffffff');
  utx(sc, CX, 284, ('0' + s.p[0].score).slice(-2) + ' - ' + ('0' + s.p[1].score).slice(-2), 50, '#ffffff');
  for (var k = 0; k < 2; k++) {
    var t = ui(sc, txt(sc, L[k][0], L[k][1] + 27, FACES[sc.faces[k]].name, 20, k ? '#ff8f8f' : '#8fb6ff', 3002)), pw = t.width + 24;
    ui(sc, gfx(sc).setDepth(3001)).fillStyle(0x0d1030, 0.92).fillRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5).lineStyle(3, k ? 0xff4d4d : 0x4d8dff, 1).strokeRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5);
  }
  sfx(sc, 'racha'); sfx(sc, 'splash');
  splash(sc, L[w][0], L[w][1], 40, true);
  if (!sc.cpu[w]) { sc.wins = addWin(sc.wins, FACES[sc.faces[w]].id); saveWins(sc.wins); }
}

// El resultado dura 6 s, sin aceptar entradas, y vuelve solo al titulo
function resultNext(sc) { return sc.pt >= 6 ? 'title' : null; }

function resultStep(sc, dt) {
  crowdJump(sc);
  if (sc.pt < 1) {
    var wl = resLayout(sc.s.winner)[sc.s.winner];
    for (var k = 0; k < 2; k++) sc.fx.push({ x: wl[0] + rnd(-90, 90), y: wl[1] - rnd(150, 260), vx: rnd(-20, 20), vy: rnd(0, 60), life: rnd(0.5, 0.9), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff });
    if (mRand() < 0.15) splash(sc, wl[0] + rnd(-80, 80), wl[1] - rnd(0, 40), 8, false);
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
  sc.load.image('scene', artUri(ART.scene));
  sc.load.image('sprites', artUri(ART.sprites));
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
  cutSprites(sc);
  loadSong();
  makeTextures(sc);
  buildStatic(sc);
  buildActors(sc);
  buildHud(sc);
  sc.wins = {};
  sc.ui = [];
  sc.faces = [0, 1];
  sc.hum = [false, false];
  sc.cpu = [false, false];
  setPhase(sc, 'title');
  loadWins().then(function (w) { sc.wins = w; if (sc.phase === 'title') buildTitle(sc); });
  if (window.__MOJAO_DEBUG) window.__mojao = sc;
}

function update(time, delta) {
  var sc = this, dt = mMin(delta / 1000, 0.05);
  sc.t += dt;
  flowStep(sc, dt);
  if (sc.phase === 'play') for (var q = 0; q < 2; q++) if (sc.s.p[q].chg) chargeSnd(sc, sc.s.p[q], dt);
  musicStep(sc);
  render(sc, dt);
  sc.edge = {};
}
})();
