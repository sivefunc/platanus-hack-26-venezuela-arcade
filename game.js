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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb9`sp+5ypiya|= UPV=;`6A)_>wv:C7;qH#VyV:g?W2l2:F-O7H(a,^Lj0PvN #@!-u,C:tb*4 $u!-- *VC .wL^iuP#0o>.DT2p`7-*o,o^hd:4 R#4!k[&@oz&{vg546Xa{@`7))T&m~:Hwnzr5Df~#XMS;(7QyHU`+?dDD0=[Kv%klg4Oq9i5%0.NUc:E*+$'@'ryp7kJa(HTDV%2L>bnu*=T(74_V|IVNa]8ryYPi<YibaNVk|4?0}9('e90o~aL `f8W*5T3q0*@r%Vk0 ^;V;W!'C yj&Ss?FF-J[`7?_|.zB#H Yh&w.i$y8?4rj(PI@E%euaaik)w1),?ChximN.`=*o^P^lo_nokG-+ %gxv$_%9hvG%G_rGmLA&Sz,eKZDFDS*x)2;129nHiYh4Ls*!t$s:)^x!z0d_8AiM&)+e9RV(2G)d]T,!ZyT!8#Qn>8AvS_HCH8x#A$an,l1#'`m_WTc2C?l _Pt#]H1YB33noW3]Kke$za+2}5Ot7=(K(2;p>i v-bV7lnsg]IRs=%fvw+&s}2eZ(T;0#37slk{cm@7Xd[+.(!%m&N>F,H;W|;J#^@yd#:y{?{rx}S}Sfy9G5w8O*+Q^C[iijX_x~<]x;G0wBQYncvC:|`iw1!#X9=o!t<Pd^9u|!I]23Y;FHz*(JB1Z3<0ZL$O17Sq!yKU(m&cmuV1Y2fJ2b>fDZJj,GQU&K*qS$e7Qq$1C<[8y( _=d,jd3aDflqp<<V2=~i-fH aQvA*L$]d{*?fF>QrxK_JZwZ]r`Y_:S2c-KVadQ(<>4V-O'J*c' `(Vo4>]x-GpBy^O'_;@ $Ye>RJ~E-#pM)8O7U@6c8GcO@!?G,Uw5^^g,Y;~Wt:0t7F-%58DL.O9gDpWbOF;0ydhln[^hCZ Pc[K$cOuX5TEoYkHaV B5|(2@bJw'sX2I:VZL.(mcS]rv0S5J2?o!Y`em}*2I5[~oeq*DM](4E,zPo9)ty8A9dAQ7F>=o#Ra1&YiH+npzFJ}d^>f<z L$#L1Q.dXUW%{!RboNR[@m`I(m3v6S0G&_jffXeY!FUL6)vBhz6sxHrQ;q8$,'+PZzcRg&w-*PK,Sm]YSXJMob .07f0_x+zZjyh-`hN G9zDl)$1[I$2:+-+FPJ8o``mjVPrOQj;m|?[5(9!)t$6j|m5syU|HzJl ti^!%0zm`A;.?i?0}Yly2b%54nuyvP_8rX1K}vxaQG0(*;br|y*#5`@Zzw57@LOo4z~2Bz=1G^l*bold*ZD_?y-W=pWtW`Q?#dTy'p7{'H@1zUMd|Y,?&MudGueArSY*zz_h^6M:<7s62P~^zL;x({q1OXvbM_mYJr3W8J)OtYJP$;&9@5#ZN`xk[EY5`7}ZmC_;u-YjIKDG]R%GX$N%)6M]AVQhtRvw(iuowt32UxKU<c='>f+vmT pA530Q:Ps{7N]ypj{U:{k]{*;)`G>sj98SCa,<Em<toF'kP94^^]7dPqdkh26FQBWyzXsx_W+yh47AJkc@Q**xz=K+SBLCnI5}E^XRM+wmE{[3Gfmajxq+jXmVR1$dK}_i{ S+K?f!N)&CJY5w0k0N^V+QnU8+K{Am<=my?6(bn`K5bxyzr0n~Q]eedx_htx6gHP5EHYd@2)3?-(5<vfLQ5_e!v.Zb^GJwK-D2R9-@mvCWNc?EP7xA2*0(aIs:,?N_#z[.fOu=(~d1p~*z4%aji0:SS&d sP*ir28976h6A|sk.96zsP0hd`ru$zc6i3Bi2X'J)I.0avoAR%OwzEn7U]w#UfY0lrM'KRZP-G_`U8LXw$tKmr?h*uud<9;fvAV`jm91US&V(-,r  q?;~TdHFh$$@; S)KH=']k,9.=5;Cg_TtH[VA,OTr9SXx76u?xHH5eTIe[x,Q:a8 5!1zQ7BiZ>f1W-Z,C;M.?-MV0qvM~`Jh[exECVJA:#o2O'YP9{m1JdFS~x<=v-3_'z9EY:)=w_lerI{-$A0*3nq;KVe2Ndl.|*fbi>![6XNrd{ZA,+&2Wynn~]aW9-DX'4,[yyHp3SjuAD~>2#}Iux(`79~y'zxlG?bP'&jBvs=Q-oW %<cxzc@s0C<mnMO@3B!>Golxst,b@`rbdt<|$(@!4,G<0%swL=6ftd10~URNd6>f:n[9FH}LJ<1S[K1ll&oQ4djCf(904y;FgeGJR)w{=SW-<itD&dDhl3S<K*mRo,5d'8:5hZ{:#kKTl?`0`,fD>)ZI2 rOfR?nolGZX[a#*viP%CfzNi}O)Vf-*vMjb4JF6%!EWVG&+F7*cIQ38nP>L<iUO& w%mEz*9k@{po6!OR+CVyF}0WMc5sZ.?$dpbamATOZrv&tY;JrTrD3Pk&&_&?5eMt$T&iNR03^=]]O(WX#hHlO=(hUDT{@9Hv5p9>I,_gJ3sIM- 2$b^W xN~)g>;'c65ydcF5pXJ]C T(+#~EwHFR*26+_E &PYbN(QcJyK=#7@'?I[sT8*gt<o,! lWC>o,2k<%1Uu2wI,,RSyW?6_Iz3.{&v,!S)=O#u6o*KA@z'H#b>4Bc5,<9qlA2Hq4F_x>r;.X9^JfckQ^&o mr-qGKg7$l4)0cl&iWF(-,L-3*)^JoBY:U@#{4a&MAR,-ZiTL;&_}$H?bZ!(B%+)R2T]!vs0Z2kbp?z>R(T1{dI[YjLLe1hBt:!-6la??<(6GJgiMuKL*Qj rAB&aA^R36DN]kU<eT@&%#xfV tZRc'#ynpR36KWIaD$,Xr%%cgQE2d=&3c3<D,=Y,Th^$G*7(>]_e}GB$p!`F~6`uV@(*h4^(BNa8mX=#,;=!8 3iRo@X|QU6`E7k`q2n..`*jA`>EcGO3(CKQYi ,$ =o*e6g'^JsVT?xdVLl*a w$`nsYS3<.dbw;wZo^m$a$jmP'1.!wPR=Gyj%!H1Y?X*PBPcO]+?8#1*7Pe>jBIbXVqw^3C,K-gxvPrvA A _'v49:7Edfl'ynTGX(zkU;t9ZqOrI&>;{^VVww#<ZgqS'^UR4T!r%wK!R,uZ;e7>ewK&h{TD_yLjoSK>IKR#~OaXES=r64V@67e<?iyhm1avpD*E}U&LK!KU5q!UP*&^kO#=x1QavSP$Moz@+TLBVMi+u{M-'K[FI)GCC9EH=1+v(y+!Y`#j}p8D w:oy4].6;&PW`)moBmfKus,%SV:y*~j[7 (xNe>c$(e#5sf)@<M mzw^&~_5m0Xply]V)q*'2E-IVU8WiET)ad6'':Q!OuAnaOFruNtyjCR1^}sg @lt]qq)^@Dk;Z?Ar<u'v]X=CR7kfbB+#e]*VGN*9<1+BmL*gnd@V7W9qVNHjfo$0vi2tr9z3^ ,z+n%kJ4txGpZHaNIY->]<U3_Is3,0|OrFYY!b'?@a{=q>#dh4S:ml=F'S;$Q``[y7;94$d'i9t1Y>=+TM.R~ZAuxVuj&'Berv[s=N~=8Uq%)rBP`I? '.8_?BR-!x20Gr1ose~dBQRs)iCazIWw4lr[qc0IU5`&fIHaOT`(KnaXX^AVV9RxDtfN<Uh{aj$bpa@4sYQIl[ #[VUwsZeKr.GC5c1b%v-t[)?*1@3%Y7 s9'Zx0d5k,V9,$uwhu6'IRZ91*eqKFc8',^6O2ZmOH=t`Uxw9kc34S`8H34=)ekWPH&>d]qhnwcBxA_m[]nRnbj|P>BqHFf:P}{i'D^yvvJxRJg.Egx]M5W+YVQxdJahvx.eE+QITtk>:]Nw[|a'{E_sWDTGUn3HW+Be)~W1[0jx:r^E9#tg9p0:LEftv3nICvGzmVZZ[^pogs UfO*YB$b4V^%m9 ^]9Ry'0W1%Sk'FBhzRH+,H1icF6rhZ1_:ef~3X`Y`we-=PN{)a1gIw9jPyU+8HGZ[.Tu3F9,7H?m7:7gwfO eqj4`X#P!!dmkeW9se0@+e7tH#jokf]VR%[aDEkG{E,e==l4rKmC,^q]Q2h[l$vl':gE@l'7vdkf`~y{%}M;*k 4#beuSS+:Q[LM9whdToMz'?p{S`*#wMthU&!t&z,1DF 1z~>2ej_~*pW.zkH%(S98UML4^8-#SMc$*4E)I(L[(;[ofL@cRS7(2FD6IgBNcN{d)2Vu^Ig[0v'.!?9[FGBXr I%>XKYq'PR#|vv,ATDfE#$M%^Vhk=HovtJ]hG@^x%4QG<%5HWYD+a;sODsMH3(--9eg6x d96DwvvvNp+HULB_(3M1%QgpT=X(0w {GcT%na15Clh<gpO,)pQj,}eXpT-1HF5<wvn-k~`~HJK*@kDGSCuV$80Dn>!n?L4dg(jzW!sV<Av@=} o_P:8<ZH*6(;1Ve%d&y6orZp~hj+w,1Nn+|QLcP$.Rn< hV5TNP$58H@X=0DpF=VsMaNPdmn*N0Jkul?i)?yxa*!&zyw]MTddki<@E*':74Rty]1J:-V*Xy+On33F&3_aB:DNM?0;;6t@dMn8q&r_OBm-8yY25f8ewKR.O2Oe)>$Hzg*Nb|W:huq-ERWFtDz|`z$1OSDuGu6'V}YOQK*+9fqU9fTM{|_}:M8sU%RgwI]O<PK!gF$Gh0;xQ*HG-{:ML=.}iG2h56$ 4cHpt.KUI ln=n!lS6#Q$7Wq7NHr?{hhd,3dF.:V[0N(1jvMz<D5Fj&&V427K%<Nein^!+$~i3d4i*1_FCE~uW3T-4h$(:39hsgdTPEqS 3}*n[pp#j2*^TT`4I{{i5ju1Ha j@sp9,H@b1qU>a?QXH&v*:SW6RjTk$gK0RKx3:tUI1mcJ*DV;n{N]LXi:i7tr`&RiJ[f$oWRG3)i$f-TsbE6socJy`oq4[pQOJ{>i30rH;M4L6:K[peuNSFD*u-v}8llDv&0tQy%Ld,bcPFu`YEC~^xG?`@MDjEaR=Uo$kMdz{RV6l+6~=f*4;+#YiNeQ1w)e]iT!K#ZSknC;?us_PAw.:8'Jxr='+{E'{7gZmhkrPdL7|!>y3ePwNWh}f?i5Ty=pYl=MWe&?y!z!^_w{T4d6W:xX5cC#J 8<;kUp&dPh^j-g]UU0VON,MPR4FN]x(`pp!cn&O5+eWB&nu,cM%]o5vQl.^HDO3X[4;le;#8[yE2+cfj?cD4ss2Me.trJK ^)d1(Fj z5FFpsjhw-5{*l*Qi<gIY=wQ>-g8g6.'t,=TGtq4A=;vqInlT`7fqw}#@.Kr^;OkDZH?k:L`d!jP_1!OMd5M&rJi:fP(^I|pqT$]*Vk13iWhg%)*1vrT3vQ-(5Y&&Kk>|>&2g9(1;?+M)c..J7~MfH%2(]R8^Ic0-h~wU-Sg]K4]CHEAk2-7o!ODcW_ZQlkT_)g'eaQQN6_8Z#SzYlw0+pLq0>u[g-c*XE4X&m#v3h^Z~)g m8T<_{-cR>orIGkJ9p9QW_$3<Y39UMX-i?:<NE&?]{LFWgT2+pG[`%Qg~9 T.2aJ-rhZ1pk;k?Td@#}'|]9+H^Yv-3F> -5:XE5heD#J-z&`SWSyf<;dGK?Cj )TW@sn+nKMD-X+(<el},n?*a8k$ooKgTw(v6A$TVW>7e{DbC<l@Ys0M,3IQ#rhc 'Uh)Y0Ga9g;DCx){@l]C;d$G%osE1p5+PbMcu#Y0._)NwdX]S&z)b{EC,b:dOr(`V1$,voI>N%VG)F%tVJR5ZI8BVt3qH41NF7Ud#:| .,-hNJ=p*&eBcRKURs&-{Zt:O{`p*p+f f|8&k?vbI^By^H_+6|Wx'gaV5PhKs?yi6v;m?2L^W)NvrFE%;^Ad,7APfS(NAsw`hA2A)?c>M5mP-'P^;^P`&6TXEm8$g1lKc:+l6*w0r(g@.B*j#xq^`z?@7-8V6l%mN5 @ttb{M^+IaPR>F:xiPO!}:>]B9^8zVl!:Psyt%B4T:`QW.l$#DpJ@h$cEg^7qSREZ3@9'JsF#xZSjMa`PByWoL[t$*0CfHsKPVJ>$R73PX~4)D{1G9eIjvfa(8U'6t(>(3@YxzkRIm[&[tI)3kC4y(cq%g6FoB2VL(q+IpdlbB=u~A9D=KBb)]E'Ozuyq+05b7<dS_XfKU-'MJ.AEuh{@Ib:?N?z_lT9BTf'[>}     FZVrGB2Vw&V", 4900],
"sprites": ["Qi$G*mP;Ys    F|;-R)   1NR  IF8=   $ZPD9pw  '#OB?>`8 cF?+5pi]As92bcg&:pPuW91FW!lVDIk_mxqL qn.fDkNc'h?N4@:G<]%ta=Wbtd;L-4'8Y7(.Nq1B9:GbRQOZs@NR   PR*5xNV&!`ONR T=70*!q7!_l3gD;)|%:Oc!V!r^.$xNQ{V-J?;p,H'?y!c#KAe'n#^0W<3lz`o{}r=^f=G9^{LK[dRTia0d6Ea??B>XY3}VM6X[cU9-hJUl~A2o|)}uHt6JXnwdVaCEUIXa!>@XCF1l{HOV=oy;j+A3SgK&Qi$ca?&K7[~gI6_Ynbgs0?!beqsf'Ae,sPtU{xIgt>s-Zr*=HstJox`nw]lj&3hEfs5cnz(vu03_Y]i_2]Jc#LqF[_FE'c)<GLJI09Lbf)U'bW5-JsE+!k3SJ-5J0B]Yh)q]2^A3k8]Rl@Jh{AfXO;8v0sH*YxQ;U+~5|!_$<DpLV{V43%K*xV=Vk27'$n*,UYT`)<y{V>FwPr+c&x}@vuO@gf&=b0t(i8eBV7*`BrXj)$_E3) xJ0O)+F k>P'9Or+c17V5}@.xFtma}7%%H(k ;2$(H3WUaET!8_`CZf1jn6mhhr:d66!i{UNo-(8-a9L^_@2U!-{%%0-_uUo G&k?K.p5'zzR?G3jZZH l*K4RbswX9D*-KKp0[MG3UJ)kTMJ'TKD ku8N^D+Ev1c-UxOH0)Ixf0be[D+FSu((H[KWSKX@R$]2t&1->)-5@KW;khy%tmMlVV'4[e*L_ME56)4(_[N$lo:4OSz4BsjP$19t-rEveG4r)Xdx)ZZ.k,>7NEde)&$7wj$uoi[2NsIjg{&}ZOaLdJ;z<8Y@'VFo_w6o6CAZ0>ss`E4'iBbymJvUU<Cu.5)E?(dz0Kz:bHYTN65tpYV=hT@?'UTsHV)aJf@ZvO'}0@h_<H)7vzF'>)cI(l:EfAQ@^;q_O44dRi%j(NL) FaY#74oEB>UrI3 Tj'[X=W,tO5E(e[f(Nwhu'0%>x<P-E.j%o@y-Uq@TsGK0X&ls1B!U*l~FJU4t8s=jb5F(,ynw*(28^i1k(Cne)j@t[Cv9d:u9e8z<Dt%7_Vm g4-@pDu]]*2'S(C5hU]z=,^gjJ_Hf:NHou(D<$wv-:-)i%NAI[m>NS.VKDf&9B^GQ_cg]TgG2r6`Y>=QWgfM5;[3Izp+&yL.)(U.]QHn3%oSl>j<D<9c= zw,S>^0OwY~u7%Kqu[lb2G:l!03VS(hK}d>^>;=k]H?!b+V8NdYz;4t`[@ij_^pIS;]zXRF2LyllJMk,:,#0olva N{w!lCA5&9M*WDH9LnIKU0t^JqI4;lQTb(yM{(Ke*^H-m5N1d&n?(kMM3#^*I  ]<ygjwluCyqva|$a1#idkN=x*o^jjzQ;Aq=+TND%l*bGr:$GNA<U*iw:?zg.e:Mp~lTxJH4rJ|#&USug1e8n@grtJVkOvAwH6i+y or==>11lj:C>=J)ArEM41K`Fu2) ,6J% lgK{1wrt]DBd(KTrwp~dNvlnuLG3(Mj@0HRE}lMVila&8[adD%QT#?HaD]A.vU!C>N6gn{`H<ZBa>=~^j^Mk7BgFF2M^[jwx;2m>d<q&+Ad<VL[LKn(M+NDI0mE@WUl7 7=E^cP-(Cm[d?77b$+&JKyL{hlA!cHt6RWf?TY(`Cjp`b3;rU-;>ek+c#CT} @sy0JFWV!30%K4 c8[( >q6Xv!~qZ4j ^O47]08_gAhiP)p<8!!_D>lP1JZsZS]q7i>;u0t947%fK#H`C!@])UhSCDv*w+83ZgVwa+Mf[.v*Fw((xpChM)| ME WpQ^V-bTwbcG39co2~'6^;mByu%!(Mk:zQ]=R},+?X^9:]E@<+{bh. D: d:aI#XA}$AGG'PrX8ILSSOnR9Ka@it?(K;!_4!S{i_V?xptB*1Qsqx&]C=[xSoZMH{S2q`&!Jt->w*F7BimL+t<KR6@-eOUQ(|g,)k[ssBtjQVMo%|XIz>N-c[cvMOWa:'uVANE]P@`Q+:-P2j5@`08`$oDNHX2#K%6ybvZ.9K;is+X|'cX~rv229eo@(S^F^|Vbh<8CJ>l!F4wy8JPt&6tKqIylcR14Mb>1t~V(f'3GsAS^G^%#Iwri_ve;czlG#w-)2SZB V6(o:Ri bg [7C+#n(-kb$-55hOJR!U'@-gjsaY?tPY+y)=7 ]Jiu!5zL&@kc[wnFVajeh%=;O]?szZPbE.=puc1Xq$Iu(Zwmsi8II$OXg.w+lciU2+=r[FiUe+tQVz$WRf:y9i$@jAs&&N2Q9'*i,=J}7jOpzSk s=T)CUEKItfv7tYBG8wSH@Cv9HVQ9.wB:Zh@$A1'7}1`x5+hV*]?48RasR6YmY>WWvcUg6lqq~y88df,PQ 3ppjG`L$z1q4DgaG4f9xrmN`N,b:sWvJM##san8M5r~#BO+q^q3X1(yXsI4E~byT2$UgxU[!tgSgPWxDIYOtyd _:O8 ZffL3rIcAB] *+D,|vO%eEA$s)<MUc862((1PZzk=z~przYW+T_gjqVnP?^[U6*eid cZ>!x];1iW`e7FcWu;zMH,p893_wQB?hHPLp6)t<x63u.1[fr@oB&Eg-bA5J$fj[EI'tK&<,gG;`jGg@!.y.vk#hQz3N&4MU_2$*^( X7;xzSSwq6dC;'(KwafnI^p:v[[>kfyY3c:DVSZYOnse7A-7F2P8XL#VpM~giP%KpY*D}j<9KXXrv'zh'?^^M=_cD_=*e$xf4c4q%W1I&j`6hreCtPogOQT4^puk]M:#<=pKY<h?(wgfuX#Z6o:<pW#T.b]-ztD,9Oly!H;M$(m;?5dv=c'YMD] bpAludQrdMOJqezHhN:`-0R7D[o`RDGhD8_M$[]L,wMd[cO(0jTF7A.MRy+0ql2iZ4!bkO}N><dym=.<k^(_$%Ao2'6C)GJGR^]`,sWehrM87kb<?jDc<)SfLH[jWw+*zt{>bpJ]va2T=M~wl[uM&SdgxH=cWWguLuX$;eAOhXj0wfQN7gGJOsRSUVogheWRe_Obl&9J4y({I2SN;61&NziM-'A!2J} ]WrA~]XLfY1;JxU6|fchPc4VMwd49lptE=.J9:Cyf4YaToq,j:LukmM;q+|ixg3>3b&>pV^ 2Xm@+d]8`d2D~ &`URZMuZN !n;eM6'l'7;W#ox&pW ;37__hh%GBu5&<bZJ|+-4}&CFoXsIL#S&[73PT'w_ p <y_#:@bfO~Qu`O;F(M N'a#*=f+cq0<&fuGkzllQ>..4yI8`8*o>h=9r4<1|l(,LhB-z!trJ6S=TY77Ot8z+RB<~f4(M4XZM=jZmt_r33@g3noO#TGPO]M$k=4kee}6M5)#9!=1-'xFs=g4 m_5T!xQJ)2DQB{gAOd:^%d$Nt@!NWdsoya.YDZ(oooL5+8h#y=v(62C~3b%kaF%f- F>ij{}4&*PSAM'l^owc{,Kp@=aM*3u<Hsax3VZJyfY@QI&bmV.m_cc8Nap7),UNaU,{)Mq4bypu'o,p0,2y%S]OiXy,=gel91RVb,6NPZA73*#S~ qea,QX73T&+ba3q9Rt]^]n6#feC2LF-BzhRYbjv5O*~=KTcwwj64i9%-vLMhDsvG!nrME)otW)3P3x?+{qR(GMka@LIJ:Bi8XR1;wD.d@B|jSBnf?<Q1:p:aH9tM)3#7>&h?Rq{T<KSIu+{->Pt@C!;&bO#Np+Il;bQAs<D4[Ml:+Y^_uvlJD<0%ZTNOFm=<q'(APCo#k;>$f[vYJX1'Bw|J+0L`v:jk2Inqk>3&i=N#Zc&{uGNQyXUC%-694 x%Fh%RzFx$m4JSCB1r1oUvo8Hq{!Trnb$8+0RhW&W3j@:g*$*!W%OZL&# M`VWPajHa.qAYH+L<KlUlV<;|7*w:#'CHGNT3PZXZu)`y@Ov7X)(`76?}I:7%t>^kw1RSrGi0Y*qU`C`m_f2}INgm:xE`bnIJB8L))l.*7PnG:,>{WnqRMsqTFkrTO$&6G9Zb,G(%EcOF1m+0%?cCiE_)etp;FRPg!VQ:Q$r9e6D,bdboWy(yG>ji='a[a_q& L5}gfc|#fxk> AMR~49&WNTb.[u7s&O?y?xCj_U=tyUf<Y;b7Qp-n<vL&utXidxwXVIRp$'FRpbkTr+Nk<i1t{ASV%L7}WMaHGrdc{!;GSRApLLxa[o`;F>HETeMQayKTCGJX^^gKD!v~pC(f2kOkWY>)VF&2ag(zl(oI_uT#vQe~4#?2@,qfV*1)rXQm2EC8$B=bSuV'gU!n2@R<IJLm61VK;u(^Is.OJP=[b|:0(~sWg5O)z_ D9:bFwh,pwj{k$gsIqDw-Xi;divT7Zpg=H>j.S}l#uG'1s^<CA^&5:z?QP~$zE#$VEjr=.yLI&so59SK>a8xs7'624'oiXlz<AFvs+]=M3im+;y&UrL4f0b40R6QRkA=mSEw8sbMOpvHSvMkPf%J*T_&x<J?!%N^M|!<r[Y5=K2sN^gRDwpzDE[5v'E2AiyObnF;ZvB OiyxCr,Y'a?#7iHi(akNz-MskoHL&^vC6Ru8{T3L:9@!p88MI&y3%DSPef,[xd%nS]y.[DStOr7WG-6!$W(GeGY:l Qi0cR-G_%BMOP=]T5S0 rUZcGBX@*]o8,8H&DdZlI0.P_raK9ia7_m,b<Cbf]qeCev=2KY{pUhp(>t?SYvpHGMQWH nTn5TEDLo3;m=tVKHj}.(k%AY_?b^Q>JmqZja!P$Rp4EVRjd!?0Y6c%2w' 9pg22*(Wfczg*%$2M;3_S6[_GxfrHW;<9h;Yc8<V1O!*sN!_M&-qWYI ZZK5q[ABIw<wZ|7M1`gCQ~L:Zg^s^,IJHbfiBOUh Wb v:`RWiLQ#$>7BAw[hkk$jIw:uv=Qz_nSR} Z3Rhd,fJw1]]G>0`{3CP.ZLp[%KPg5mlqrM!FFO)~jr8TswN5 pR`{*R|oR4M78YIpK0L ?$GF<-+deD=#Wb,^iZxc{hW2[Q@N`Y^[S^enA3glg3[i+UlgH)t2)fSPgQG?jW^P$aNDj&Uy *2k'UH?}-SIfTXtdX}<Ta=lYE>Ndafdd!|g8M547x@Hz<7soI~Qjw>5(uA9=R.RxhC%xVbpg X,7N]Y-GjX'LYjy0daz,nL=&3U5$8[znRZdIY9TrNQ~O@7:4AS&cDeB6d7y`s,4vwioSusLNXW,AK91+mssTbhP@_d_O<s#kD>p;,qzdx6d3$Jl3iGQv=U@GbOjK$!BN:4sRnQx*H#R^p#0M.7z.%Xi7LuF83BJ5_@.JR&B?ze+x5C6dyj:Vj7F!;=?':`Z+ra5pNFc:|9(;PH_TW<x0sQ00*yuHiC1n,u9p'4 yu)B4gO71wQ Si`7X*h4Yg3M]4@T&@;1H$?e%FD,;CVy0A_Zcj_Hso&fgXK.ApE)Sctn0$b8>=_:J't@Zxb$2:9N?[tNZv049yxi=I?druJO-~Cadbn1f~D<?xWll}aa*B1ffF niAduyS(Ao Vk{;R^XZ86On''H]!~ZLdZlHc^FM%pi9eZ@0LJd)b;5Btri(Bled=%m`.5A+yrfrr}nGX5hJ5fjPxXAZk:bUp ]zynY?^.LqxS^X?J{b51Q3z4'k`z:7,;DIn!Sb97x1GJ5 ]{6oGTMgNNL<t6^NniL2EG=zF&DVd)6b7nchDtdwhl AP_YAPyTurX;tySZ[F3]U;SP'k#QBY1:Pjh{3 'i~u67`W;0owxv;Y>(1`ZQwB+ >xs*H^n{x4Y4&-*dbt`i4dIx}+ <AttJr6K-%B-[gNMx>HB88rBzS_0N=IL9Y?t<64&GjD<1<_jl;#uF=m6'ukl_$lBK!XlBEdF64s+0H8?3K:V+!y%F3?YolhrLWVkgSq[b <RUxqxQiBkO^ZNrrEY%z`mBEC>M[[eUN8t+0+VVz$)w|@XnE+UM!8HG7FC<|)MnCSjXK6a?nP2zE,J+&;4cUH5(:h<xqw0#V:_U#p{FV=VY}>^96hu<b$XpKewn!8`+Dlql^VnStyQiXPC=6x#m&xy!x;k:og263TQ2SIV!wjDZ2I>eSF@&V+)O!5`m.T~$B8]9|pUvmfz@0_&>,7=V-qJ?.a4[f5cDNl8LT Cp?mk#5M}>%<[ZI9x)G71GXK|s|(3y!XdG?@^y~2@7lx|U:q,a$<iD9EZLIM[W++seyWdOa>Ke*)Hs?Ze`g9>U*]s:o]>W?wUlBjql2`:#H%FkV2&2;1b6R8j]*6Q@)RCIi%O-4-(gT=~QutdYg2(O##B_BUhb%x|O6 wQl>8.IvERw$DqIT>Uii`LYoK,I$35E[O=P- ?-NtIbcHi^-q(7M*r>Exib.>Sf@'$N^s ,5Sn^b*&#)p(V(jSve-@Le)HDLVxx8=PX!UiFH=Oh0sT~]vSve6!|hiy$' pJ1qE*RcH{IG IuVlf=AS5h-ih%l+L!73_Rw:izSG$%D$~)cDWRXqQrG.p2NAo`Cr++^ +vj4Won,Fa99B?OVQgS=<L]7JpRo9N>,?q_DhfGT-@_*`T)P+]9yY_H6S>4ovuuBH@cxE]ZT a:RDOf3F 6(XL G!izLsW9(m_N8([iqP=WG@f5O.[R^);:RUkKAZ=wz-h,r#KFT*KtMFsC-wvOZEe4uO8{'kdbQ<e=a}REc>PTU>n1L=<aaOz_iO?q'q>e=uj?MgP`Uc:@G@UH=H)Gb`6~]d{A%>Q]ovPei:r1B{Xy:xixL8;m%Y0x2k)<nOn@ra_o5651+Q2W>SR9Va)?<w!.>&<J^~D2hCu^ouMs24:ln+PVUT_7tBKIkgu3Zk;DE{6&Uk?`6!Lo<rJ~$+p>#`z.;_ukn}{Vk$OO^tf]R8%`8aOuSK'b[2ApM^UFs4IBE_QmvvK^wqE50jEnRm6d]qb(;*1:qKZ6JmUSHM!u<1spRH^{kxga;}U<a1qSq~jt| UM;`{JvqzoVn6Ur@sNs<^(OQ*@d~?d'1x@w3G:6-T(E* Vzt0 8{>FEXFd=d{r{*2Fu7nTxudW-q#UJ5&!.nKeLyI+0yQ{!=&CYMI@6q>peDGGTekdEo-'ALc~=2*!'-p#&wOOVg.:as <<FU`HaT]q{8~TWM~n ?YSR&|:Fr4@7CVcSL;%4hmCz[J8SkZ-?jh6u=k %=QO(f$A<xs*1?v(@ogzYIB5QAX-:-!Qy9eQN^rC^H~(U+&Kk::<9cH2D78UUQ^8Q_ ;RgK0;)oC?;*mX5dB9LJV~!l[p[7FF_sSh*Kr)# Oa)xZO3?C7(qeuq}Fyhb^Dms9>O&(w65PY&d8;AO;hJ_Q6eP$f;~<SFdpB$% 6R.WF!gtow'bXjD]LQa)yzw#C%WIG[],Na%:D!~*8!,k}y4]+-3jmbT D%qx#LJW((d)~8'q}s)?g9jU`(|_M,>A,E}RrDI05Hlb@m-[8Abv(SOw-(jB]*n5sZS`el69jUp'&) $[BVTd@6h<nOe1bIMLs6$L;g= u[?MpUrVqNyJBZnbDde2(^2[um_~DKPYNX6|oak5A$H7jQ&<D8I^<&!Z3,KY_=M^!>Ixm!+Xb=*0e{`;6z>=c-Iqf%%0Il1Vl=lONAaGg|W$3|Xp7RwJi:F;b&n^>eICy+*slvm<Ril-XacZ?>N5'Gw1I]?U;p<6ok<cJ4?Y1jevXUSwhhKsAvr,$yo?LnX@7&5<:k6X8zr.&{zugp+(3.uy+brcx}8'Z`Kp!9=hns$,,CQ$(|6d6u+m Y.Yuo?dr|Epdfg@V^7Nm12JyDHzMa?3lwrX=Kl1wVZQO{t^Y$2c2D UkVk-brH13~.+)>=jV'0WgXN4;7g=Nnq`$Qi4+`J'SBx14'BQn;B~k82>ICL$Sl!*b1a'GHw.h1n-$|Oj[xjhU70@8u]HYWQ6x`*e2(eL-QI)qJ]+>CwA 6lr,l*[_N3WL%fx7+:$)Eb=.iAS -q1'F; ^zh:`E#$(ib0a@J7EAB[@~vK2RmjOk'3#0?G02[:=(d?qaY''UMKNeoZikhR?f)|qNibkpR43&s<cFEHiVd89%ao[e34bq)u`_agR_RsLn2LU&QBjlt,AD9,<Exvj[Sb(G7=K~j1d'_m;Zi|id,|wvL`6ks&{!vINCk6jEY,u+c[{kT+ob-;BS?U(Gi,0B@5r,z!d[$RyU+C[!e~6F'-uD@x2Y NXQM,]i>NBm=;G4QI{Y.9;$(&Pokrq<3j,@yz.k_Zl}^{@LspUd{m=3Sz.{4rbnm8gi{AcWr*)&mi7<RiZAG7-P_%_>hS-$GbDB2jSRhz&M]>>L;g%Rq0nW>?{kTLcH*UfbXf(|hWp}FAaxTl{Lpu(*Y~6!BTutd=R-*A]VAJMyWNS8mI8cM:nK9}n])jwXvK;$)?Q=b+9g`!K(]Z4<,RCU#'{xM%GOz[hvC Ir,<oQ.JG}8}l9o`c~yJ(n)QIrG]{]P]5Ea&kOQtj}I(iS,cu[ijny#~0h?-%hb@7513f&FLHb>BUW#}m]< i[+Fz7%3]N> _0qQHwy(*-nU.#Bk_3njrM>:r!C<jV!k(4>=r2?d0*IvWIUJU;o`2[qq!mw+BCCpZJ]*RC*3Vq@I&rjk-k(])qZdlok`$odYS]So[>WezUac:Ggg4Kfx&m4u0B,:gQQvQpu7l79MprpmDdwF>$Q_YF)$gC1BE?$1wLlHA Tp<_>)EYXiC2cOr-nZsh<I'!2,=kE_M15GL.)hccTFM+-oJ$HY65L_.f;uIhJTUN::QH$]^6!v D>LYj8e PE~tN%uVXUqR;Ka a(m [X`T#C6W6sAc<Qn!uyTv+m2_`!h'%uxva`ZO8jg>_%'?LCkLN0wJ5>(;CfzeasjN52oW0ljJ(!{!Zm1_~#80]Wn1&vio=Bk _T#lDc0BL'3nFI3f9hcYHrs=1A!-elDYuOmh1wNhhDZdAW?ty(1d#K7h<n(FI1*7>_nm^mvRY_^kXv@)5DP>K:y7IzQ=`w~l^imOw0jn^2x28aUfp^9n?IW`C5AmLc=zKI$]E`s*Vu&yQ:#KprYEvG%Me^$K`yOFH'W.(I7y)$ZrS:K#aN#QFycJS9KeWGx6<vZ6oF(-ClK`75Jq60@a2RCQHp+=4:4!c1zM|l>zaC!d(hI%^+f4>*YJ~I'facF^15@Zs7N`]m_(2mzL4r'VKl{J39e3.zVi'!]0q2(ZH^e5U'[f;RlFsuv0_`g_[-<>P+%XX5Sa+;4s 9=&aSG1+<u?Z3oo)'@0.:?>E#95e4c g,`L.6>id#mJ{n8r7ZI2',<*#e $'J7>32cdi4Q6>xAKtiei,#T]['T39ThtceB  hz6C(>smv5bNCS]1gvwz{:ZE;La+;Wmr&:<[W# f:}]3SqRg*<9uMCVR<qe|aqIY9=OMRp<Xw1lpt(pZuLE4qvuOw$_ry3g<t k3k>p+ea='ltxJMVDWDIi,i[X?v*I9h+dmQ3w u4sMD)p5<I6(UInUI+t[Ckv{egdh5Lb^wUFfF-5BUKIY;c=Tv1b={q?37<18w_e9Wy1MIsb2B]!$).(Gqyv#5czqSPTd*Cxc3=`0J9j,89'(j}Het5eTS0{lB7Evo`uv!,C_^b)|jHA(XdA$6wYoS`2QL'm>d1`4yl(@02]![!-Gfi5jOeff1 HxSZ.$A_PPJuD~O@Vl$;V-%Lz5?DKO<-S'-:Xsvu'QT3DcJ5Q{??%}rkoHz1TmvpL(kACg-LDS.6w^XV=3vke'ii>tuG(yk`s?Y&hGzJB-A;5GAPppx~g!V;x7g$q6A6S$;_S$e{A!bd3,B-yH8'=gMiUBI`L]5d9izq<5c.j%x pZ`PBF#[I2O.lH<AQKM=[c0HRp]).X7qq,4'hyr<%z8am'2{R:Txh 9gp-vd72I9)03i.q$@65$X9yF$5r^|q^9G)l8trQ]+)F9;Xu^^K{bpN_g:W#)Vu:_mT^%t[5RFoZ2Jd.Qcsj'ee-o3E`B>5;F#{K0(w6F=$02k-wQGC%K}lt&YwZjj2R^-z{5D%5v]v>[NSYYo.&0_O=WsDpj{3>RF<V]^ftmMXPM3I+6F&nm`>Dkm_*[OD4F?e4#ED)rEh^!!]X=%wD !rJ6(:F[j4^tS_iqZF29EG+Yg9)<ry?9rk#KnbX*W`4h.vY!?^fpW *ztj=;i4JC6SSAPXi+lu<NL[JKPHC!tpKH9v$ATCY`2(B$h0|>JFDB'=2aTfw8s02J<t0vU]yV5bBKWkUD|aTP&=!BvYyzk,e(L $-jm;SZry#Wdr;wLrlP]9^&?(-o4dm775*G=Ca2l;onl*zZi[2)R. 9ys#bu&Ef2z.H?mp&s7X@23`dq8:kak Z{Pnr7<oXZ|D=%4qJY.s(%-MW$.E|S|E+Xz+='P4'g_^X`Go4exd*):,=a?9X)$PUA;sr{Kop%:r,e&@Zk0LbP&m3L8nv4B{V>w$L5yq=Ygt|]z=FZi9$6%^Q* Q:RSh`0Y^.pqRMuV$`0nY$4;rVAR32x.@tQ&.e;%;u+@<XI`#%_L7W:N-f4?Yd#vh%HvFfh`+lYykm'tOX_ScP-FfqgmYDZqZpk@IyFf1Bv3A05!^9.!XX8?0D0`)+m}mTg%M!ns0qf#TUZuLVOKBZyLM*@}c&[;wk;9>4Pa4Fr;I`^F&440QW>uMN^yB%^LG(7$*TzVB:{#r$={%645=&S%SzbeM5ZTZMoy1H4,@,R[Fur5VvA:Il[JDLjr6$s1d,Aa,*=Q@xcNYGk)lU'NQf@I-~LBB?xFdz.2N*L(Rd^m8y{?Ek@zXEZuy*J_3w4V@)6)6kQ;_tSxJ*j20#pr.Vm^M@,jcYf`x5)!_+Vf[vyB(tM*jSxX`*_fk]*r@YcfxDp+OI:1caza.Q_dI+X?v14h+DmP{HKaqm78HKk>vSq^1z]`x{3rUCiF7[Xw+CS:dDN1I=<*h53{-O:wI8QQ>rYZf9+]7Y6A?nH$sA3UsthEBb{@6UPhqu<Q+n!Zn +mmIj,q`{~+z<]gJm;)PSG8ag%>rC=puRp.|8ZFIFHu bkc`0AJ_cGkwi`{.3ft?[J5=4;>|x,-0M2=k2TdtqyL=x.di3_InG}nP[yTmL|Pc+b4jIdHc_*07dIQ^'L=iog)j6.=?fc(Y6t3{?Sq43]<Mz|^H=rG&g!mZrQ%H.t7,iNIh+zD O,r%Jo9UQOkxZe]aaeLsk1:0'G?{wPeeaxtK<`-&=DvDC`x@7N2:p?HL9gs)ytbGCViBKsw>5><Zcmb5V&Jhx:dvf~aqT)2Te_WWi!E+7r]JV4f[3$Eu=2w[VO.7SP#1M)0lojWsok=)W^+;ThXz1#rNI7{j;:+al ITMB-,j4sBi^O$]q{uJNb3oTy6#PulEM(eJK+3!T>7`9I}FI5D= ?`c)0B$nQ}zyz)j[+QtVm<s2%c=1<L!De%kyk9Ge(`Yk;'MB;^nD>jM_,kdoDKHZFVDuiCK=^xFLm1=sj_'hq>p[g@iU-1'z,[DLI0]x@F7*y}Wk1{b)>5jRH}R]o:lpy$:'4*fZ%{)K`#kE^e3|gU[v7`;6jcfH.Q!h.}UR_P0#ZxI,-[I!uy>Wlba.w`a{xn;K#s!4q(It<vy+?8SF(ATW*8uo)]he,YqtD38a!K;rFmvoi~FJgVgIL2vyk=*{$x(yKR9hM-WzRQF%NQ44gARO5#i*4; 9@5vFa`HG69{e1eA<3d*sDG-I?(5sJcwwOe[4fH[XZlQL#.ov{++KB.KY%:Np#vk>S)Zucsex#)zglY1[C{bN:0B~In F06R.hM+cMaY eo,lB@]7(h_kvg!mhyes'aUB_GS(=2`YD+:#7(6#eD4T+fi+]6+'^|vnklFQ9NUHvwg! ,E'-8Oo6%M+D;Qj`]hv:.h2bP3b-K,C3;@lwL= d7hWo6_yp?zNaUZE{Mbt 5AQV%vJupvmk(E}27w>5:*vWKs-)!C<#dXCts[.-:3NHp`@Y=32TStcj->+ qWmhmQ3RcT!0XpR:-=X*LO#{0gcrA#H_zofLQa~Hqj,dl=5UA9Vf,; `SY#d?)2eu5tws1jBxltGNk8R8Dm;bc9GN++='2dhU<)B)u!jOiI[C5bvv_wq%A[{YQ!v)'QPZKl*lX6Co5l8 r'lj$B<U^%&OTQEqv^o&n$(),z6d;DJ]yK.{Lnvg!|q{5b('f:*hH1e,`u&[{;f6ooHQ?fj& aV})(7^3?v}+..#&}?S,pBa'exHVp'c,MuZi[J,f.M=W3&Ee<i&nWAK*NQstb0C8,w(b=(OK;8 !Ew>O]srP^8qx& hv<WHCB|$E'AOx645N#i3rB&Rsfx;m*R3J,`H!{#kOxO%W(89{m-HgKH]L$T~Y9%is]3PgzKUA0Wmh*)LG-)[)Kz;#mnRz%(2b'&-.sf]*:XK'$,tJrPLl~?X-9wMz:^)fWK Rv[*a);d%H;9WI4WeqE:iKX^1M.J2t(MZbzR5-l|Mgb+AD!B7FNen_Sj=:XO4+6#:l(+WuHSX`J;SuDhu|L[$7cs%h'!M{[tq;B)?hen9K;WGX?Y0_eG nRoR).hD!uf7U@m5}U7;s^>L25pJ*3urey)'-d^3':on^6J_KkvQLze9{JQJGOY4Vp(rC.qNh2Z6Zghc4itQCc69ah@m%]c$Xy*_b9pL<sXs)F+R9K)NU$RF{*Z)~U)r?6se=hh>iYKZ&Gaq!Ej;.KQ3,Myl5dqREngT_;&I7<JW51Rj@H:mo)v.>[o8 iycTnJ`y5O@H8C>`?>$FF{7h->NCKryPEpr`BBataf5V)l2q.{iQ;T07vVq;>Zf2@_m_tR$(E0^S*KSt$qJ<'A{L]<$+P:[]<'hex7Ws9UF4_lUl;A%N))0ETNYCy(,:+T#$+&gDK!zu^JvLEaf:+DT[C@ (?J6(8;J]XLE]Y#Q0b24M;04{ZK?|S`OD!tx12Ljg>#]Zbav8&EZ?;UkFQRVo;mNm:+S7'3zw^n^(pl>JeHcBxq#hZZ]_T:_)?6QW);wA['08F>vxm{M|>PSF>ke2A1vO7mJkpsq,K)?]16GI0.]&]E$]jS'pt!UOg<3sv@<7!@k2Mst:)q`x9gc>q<wJD]9PN466y$u[ iE0kAsO$>N{AuugDp1yTpH^C R{$H@$ ivVW@j}53W;bREErIKSG=*w2C4q)PuDG8%n1Y<&io)b<[i(&{url'IZVqv;B[yOt(a(,;lIDk)4E]D<_IrM*<3rKlLC=}O!hh_27rWvK {NL|'hjY^[d54qx25d qtF7p2]q9#oGWuqYzJSaj(doZ,GF@u2+d.'pr:=Qyd'jrX2bJu@{ajx#7@:NnXE!;yzw7!f_^j%NfF(E~Lr3s1zbooM[ChvRA>UR`dkAHJx)18^Ek!oM~h~3h'p5BQjRu3Rb5nyL3&4=,x5gVbZ:dAQUqZsv*M1H$hyPJ.qD0bz^YE;dd4~2IR7yQJE8w.<s!beg$$(q]Tn*v2.zW,3oI59Hd4bW]STX'`#1Y;broqlZ-zi>R3E^qV3(jU$Io`%tGfzQ^b=5W.Fq,baf0-m)_va[JKW9|<[t)t!kRO1^v#dyG&dE.QrY2T~9!o?i}d;)[s!V%pAta$h5'8zcsT6.P@&B_l2Y1?4Q9<tP$>!{%{^CHc(rR:XxDhBv#p<oUyvM:%,p`r{1nePOjaleBpjhw{b1*7Q7PmbhC)GlH]AP{b#M9d7k6r2jgg0Aa)17Qzr2Q)Q3BR9nbbQu7H3s_BbR`h!m&{RAdH?7|_E1= ;[ [dyNsXT&IBKc,5p#vJ3Tymd`nv{QJkGRf3zJcNzctADTk.aDnjhXnjM'K#b&RSMxc{w`3$giq>H]Pv:@r4e={jwQgO5e@YnM5Za_G<$%Gx{ZK(]{opKfz.HKzn=#V,&j3iMNwV^S9JJqWX<Wnm;CN6%U&J(ddy{|q0?eok2^p-Q=)N5Hllxn+oU$Qk_R=u;I1cW0#!R`1nhH`x45ogdhgf75=8]^2SDx.|IB2D-C%a,M(RofS-xU){_lL<O'A]gW.~;qe:h34RhHAMJ$7hxsIgQdv5N4X#ev7_ZL9'!bWYX5^`wuLknxW[?kuDK9pO>DIEeBa(zE>YIS9cO|zIq2zqt@nK1JmM@(GCrZhv8Ir4;-IX^evk]L.R{TyIfq1Uj?{P.C+,Vy#vJ'+gjvBmZ9i'9mkP6M#NX[isY?_CL.nI*{FYgY*WBZwv-*N'U5S?ui.tSb(|p_-uH6j,Y=6f;7!Tx};lTCr8)?G8q3Mn7R9k.rFmlQ)&rP0WC=Qp^Mf&?cqhdR&0F,P2L|MsVk[KN:Q$,z8?fj75)].dSPXnb|B#*TES6hy=@;8()|yQ)GI>4Fr&5w8g27c5BU]&Kzo_hKFr)GbS)F-IK:(DQh-S#!?gt.QRZ`a(?4p M,Oc!m *4]_V#tM_j=f*CES(2_Dm;F(S]wGg[(CU+t{#gMk2oNM7X*W|vQfM#PM8+`c11MYPn'!KaYk+^|f|Hs&X2PEaA0@i1noP3f8'0R?%2JKKl}E`:5=Eu9%AL'M82Yr>D[I;qj^^3y0s8]b0Hsd+D!nA@d9u8>E S4MZ*kV5Cu@QKjqxz+aJ?|-SbuK]!9h2tbF,XEdmA)KueMYQWTKD3TSe,$t2kA.~8Y_zrmKDBAKf[fyip&IwUo;ivf)TQBIl=n{${VG@E?'v.1joVUucNn%<&Slk[KA<zr'G6ppvBMd]j|dDppr;n#(gW^HY^EizZKSVC<Mo1sY3JDp|0|6rYAoZTQ`2*,+rm7X4&R_zSfIEZ_=!Q6k{`+(`I=j;M'_ZzC6e{3>cxz0Cn.^et#aF';jrm:ZMnL,?NK%$d<2BjR7VsqcMr;)uZ-Km9[aa!tJ82Be*vk5k);%(txR!228eQhq7$tQEeb3zBsITnwy>EB)-&M3rcZ*jrdA>Xly~R`@a<%hYa$eYzIl$%RR&OSGN.+,)Ty7[(9y|NS)[oi!Zk22X4F+:6NYM]|%K_`t=w:k!<`&hJ5[,H:w3*k>s9lPgAhq5 8t Odi#`pmPdxO0M>r4ca,aL|]669B=7Qk;+A`*a+tPYw45b%*_im#9]{50.%PMM}DqV(z3LxGD*msg$9R'nM:BVa0<[tSS+>],SRg<7Brt&w6%KS0_6tQ`^N&xR%j^Q.haOFhOVvPeTd[77<Zb;c_4sEe*T|{KD?+V lrDQd })tSEZILy*jqow!qrUff#7Yg??D(h?hnoj[bUpnC1qdJivnR z4qK8^V`)w?Nztz]3L:XP@_DGM,&n9!!1Bt@^In:rO.u`qB 6-+<mO*A)KltEn f<uHkc9ksXbQ}KVcdX*V?--Xu(DG$t!a.5^#dV@y@g4Sny-ZI2pmM+C4xq^b6.$&uD5IGqf7tE3I--l<le,L-{v'h:2zw:=ds2:{0K!]?'Vg0ePtTP9>}Ev!0vT'9c;2#h9<`BK5$bf$0+l%5ucBBUm({q[LD=g;7N2EE8HBg!^O`LAvR[PxLNFPxfVoo)5hwXzf[I7t5f^ tz&3b%sY)zsOc5rzrrz;Zw_=n0g!xSMC%:cV-5A&:c(WSf^bRvX?ECgEDm{?0R-P~f&gQI9EK)#i3q3f):9:FdeH<%$q=>K9vJRqMmg3#=XwFIDj^NuV*b|a}yI{Er2c>CY(VpD8-JYtN4[AbM8*3r=O?xWZ>cPiS `Y<+PFoC2DQK~`KeMs[`yH6r1b7>h&>G,&d=Eo%+ZiXaC*SnemLj~g!Z7c}]i#-I=ijVgLC:M';a}@~@j5IoEZ>MHo2QoS p{n(N;{%B0*:l=_m3ih2Mr4UvMjs$Tc}13BzrWp7*#^!i7OTMrItoX?E:0?B'`47E0=Kp]s$)]rXEmt[)<yLN:b}>fY_X5O~ In_+znuJ<'dY]u)ORF]16lpFr[eYf<`MrhzMGre`#bBq=S-jm@y):1Zv*t15e1Bq8UIMDNevY'VVI[VB{Aa)F_~O332GDFRetK~trf]H2*=K'`}hV8M_HsvXwLsRf*^U7B:S(*8-J3{!L`dh`TE^(;iP !AgKrh5|,Xtyq'I'Gxw*k&YE3 3hP6dc#>!;L}S'%T2$?#XzvDWz5ff'JM=;VN`D_I6Jr2-E|$w[g]h$pZ_`yN,#?s^:Fio,aIcTOis=WseKlc8~PLZdaR<>HmD([g-Q)@01#K3=f]Yc7jl@oYrQq$p&P[zm'|HQxP!$C}n>vfcUevc,Jjps.< (N z(f|[+TvOEj s,Av*~R+vnevvYfvety)CUx574RjcxdGn2,5oEx9phHwNI3|j9kK<,4)    T|?'.#9)&_", 13029],
};
// Mapa de sprites.png (ver tools/pixel-pack.sh): [x, y, w, h]
var PK = { ch: [0, 0, 36, 36], ref: [216, 0, 32, 32], tank: [0, 360, 22, 28], tobo1: [22, 360, 16, 16], tobo2: [38, 360, 16, 16], globo: [54, 360, 8, 10], burst: [62, 360, 24, 24], logo: [0, 388, 128, 65] };
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

// Personajes elegibles: los 10 del equipo de Platanus, una skin completa cada uno (hoja de 6 cuadros, ver skinFrame).
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
    if (name === 'throw') tone(sc, 700, 220, 0.13, 0, 0.12);
    else if (name === 'pop') noise(sc, 0.12, 0.35, 'lowpass', 2200);
    else if (name === 'splash') { noise(sc, 0.3, 0.3, 'lowpass', 900); noise(sc, 0.2, 0.15, 'highpass', 3000, 0.04); }
    else if (name === 'hit') { noise(sc, 0.15, 0.4, 'lowpass', 2500); tone(sc, 140, 50, 0.3, 'sine', 0.5); noise(sc, 0.4, 0.25, 'lowpass', 700, 0.05); }
    else if (name === 'dash') { noise(sc, 0.14, 0.2, 'highpass', 2500); tone(sc, 300, 900, 0.12, 'sawtooth', 0.05); }
    else if (name === 'whistle') {
      for (var i = 0; i < 2; i++) { tone(sc, 2500, 2600, 0.22, 'sine', 0.18, i * 0.26); tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, i * 0.26); }
    }
    else if (name === 'pause' || name === 'resume') tone(sc, name === 'pause' ? 220 : 880, 0, 0.1, 0, 0.18);
    else if (name === 'blip') tone(sc, 660, 0, 0.05, 0, 0.16);
    else if (name === 'ok' || name === 'back') for (var k = 0; k < 2; k++) tone(sc, name === 'ok' ? 523 + 261 * k : 784 - 261 * k, 0, 0.08, 0, 0.18, k * 0.07);
    else if (name === 'tick') tone(sc, 880, 880, 0.09, 0, 0.12);
    else if (name === 'racha') [523, 659, 784, 1047].forEach(function (f, k) { tone(sc, f, f, 0.1, 0, 0.12, k * 0.07); });
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
  var d = t - c.currentTime, P = { c: [2500, 0, 0.03, 'sine', 0.12], b: [800, 0, 0.06, 0, 0.07], t: [190, 150, 0.18, 'sine', 0.35], s: [330, 0, 0.06, 'triangle', 0.25] }[kind];
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
  AU.mus.gain.setTargetAtTime(sc.phase === 'result' || sc.phase === 'pause' ? 0.3 : 1, c.currentTime, 0.3);
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
var RES_WIN = [270, 462, 1.05], RES_LOSE = [560, 462, 0.9];
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

// Recorta sprites.png (ver PK): una textura por personaje (6 cuadros de 36x36), el arbitro, la utileria, los globos y el logo.
function cutSprites(sc) {
  var im = sc.textures.get('sprites').getSourceImage(), r;
  for (r = 0; r < 10; r++) cutTex(sc, im, FACES[r].key, PK.ch[0], PK.ch[1] + r * PK.ch[3], PK.ch[2], PK.ch[3], 6);
  cutTex(sc, im, 'ref', PK.ref[0], PK.ref[1], 32, 32, 3, 32);
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

// polvo gris claro en los pies: sube un poco y se desvanece
function dust(sc, x, y, n) {
  for (var i = 0; i < n; i++) sc.fx.push({ x: x + rnd(-8, 8), y: y - 2, vx: rnd(-20, 20), vy: rnd(-70, -30), life: rnd(0.2, 0.35), c: 0xf2f2f2 });
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

// Patrocinadores pintados horizontales en las franjas amarillas, uno por linea, entre los tobos (y < 290) y las cabillas (y > 400).
// Bordes del amarillo medidos sobre el escenario pixel art: izquierda x 12..92 en y=300 (se angosta hacia adelante), derecha 708..792.
// El tamano de letra se ajusta al ancho de la franja; el texto no se escala (escalado con pixelArt se ve dentado).
var SPONSORS = [['ANTHROPIC', 'CASHEA', 'YUMMY', 'PLATANUS\nHACK 26'], ['ELEVENLABS', 'KAPSO', 'VERCEL', 'RENDER']];

function paintSponsors(sc) {
  SPONSORS.forEach(function (list, side) {
    list.forEach(function (k, i) {
      var y = 302 + i * 26 + (i > 2 && !side ? 6 : 0), d = y - 300;
      var lo = side ? 708 + 0.2 * d : mMax(0, 12 - 0.4 * d), hi = side ? mMin(800, 792 + 0.27 * d) : 92 - 0.2 * d;
      var o = sc.add.text(0, 0, k, { fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '20px', color: '#1a1a1a', align: 'center' });
      o.setFontSize(mMin(14, (hi - lo) * 0.84 * 20 / o.width | 0)).setOrigin(0.5).setPosition(mRound((lo + hi) / 2), y).setAlpha(0.9).setDepth(1.5);
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
  sc.body = []; sc.tag = []; sc.hb = []; sc.bspr = []; sc.pspr = []; sc.bursts = []; sc.fx = []; sc.rings = []; sc.wetT = [0, 0]; sc.throwT = [0, 0]; sc.celT = [0, 0]; sc.dropT = [0, 0]; sc.dsT = [0, 0]; sc.flT = [0, 0];
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

// Cuadro de la skin: 0 quieto, 1 y 2 correr, 3 lanzar (de lado, mirando a la derecha), 4 de frente (celebrar, ganar, pantallas, caminar hacia adelante), 5 de espaldas (caminar hacia el fondo).
// Los cuadros de accion miran al rival: P1 sin flip, P2 con flip. El resto de la animacion sale de poseFx.
function skinFrame(sc, s, i, p, fl) {
  var rival = i === 1, mv = mAbs(p.vx) + mAbs(p.vy) > 8;
  if (sc.phase === 'result') return { f: s.winner === i ? 4 : 0, flip: s.winner !== i };
  if (p.stun > 0 || p.chg) return { f: 0, flip: rival };
  if (p.dashT > 0) return { f: 1, flip: rival };
  if (sc.throwT[i] > 0) return { f: 3, flip: rival };
  if (sc.celT[i] > 0) return { f: 4, flip: false };
  if (mv && mAbs(p.vy) > mAbs(p.vx)) return { f: p.vy < 0 ? 5 : 4, flip: false };
  return { f: mv ? 1 + (sc.t * 8 | 0) % 2 : 0, flip: fl };
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
    b.setFrame(sk.f).setFlipX(flip).setScale(S * 4 * fxp.sx, S * 4 * fxp.sy).setRotation(flip ? -fxp.rot : fxp.rot).setPosition(mRound(X + fxp.dx), mRound(Y + fxp.dy)).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.chg ? [-30, -95, 0.7 + 0.5 * p.charge / T.chargeMax] : sk.f === 3 && sc.throwT[i] > 0.2 ? [-40, -90, 0.7] : null);
    sc.hb[i].setVisible(!!hd);
    if (hd) sc.hb[i].setScale(S * hd[2] * 3.5).setPosition(mRound(X + (flip ? -hd[0] : hd[0]) * S), mRound(Y + hd[1] * S)).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
    var drip = res && s.winner !== i, wet = sc.wetT[i] > 0 || drip, blink = sc.wetT[i] > 0 && (sc.t * 14 | 0) % 2;
    b.setAlpha(blink ? 0.35 : 1);
    if (sc.flT[i] > 0) b.setTintFill(0xffffff); else if (wet) b.setTint(0x88bbff); else b.clearTint();
    sc.flT[i] -= dt;
    sc.dsT[i] -= dt;
    if (sc.phase === 'play' && p.stun <= 0 && mAbs(p.vx) + mAbs(p.vy) > 8 && sc.dsT[i] <= 0) { sc.dsT[i] = 0.15; dust(sc, X, Y, 2 + mRand() * 2 | 0); }
    sc.wetT[i] = mMax(0, sc.wetT[i] - dt);
    sc.throwT[i] = mMax(0, sc.throwT[i] - dt);
    sc.celT[i] = mMax(0, sc.celT[i] - dt);
    if (wet) {
      sc.dropT[i] -= dt;
      if (sc.dropT[i] <= 0) { sc.dropT[i] = 0.05; sc.fx.push({ x: X + rnd(-12, 12) * S, y: Y - 120 * S, vx: rnd(-16, 16), vy: 0, life: 0.5, c: 0x8fd3ff }); }
    }
  }
  for (i = 0; i < s.balls.length; i++) {
    var w = 0.08 * mSin(62.8 * sc.t), ba = s.balls[i], bp = proj(ba.x, ba.y), sz = (ba.big ? T.chargeScale : 1) * BSCALE, lift = 22 * bp.s * PSCALE;
    if (!ba.spr) {
      ba.fire = s.p[ba.o].streak >= 2; ba.tr = [];
      ba.spr = sc.add.image(0, 0, ba.o ? 'balloon2' : 'balloon').setOrigin(0.5, 0.5);
      sc.bspr.push(ba);
    }
    ba.tr.push([bp.x, bp.y - lift]);
    if (ba.tr.length > 9) ba.tr.shift();
    F(g, 0x000000, 0.35).fillEllipse(bp.x, bp.y, 24 * bp.s * sz, 8 * bp.s * sz);
    ba.spr.setScale(bp.s * sz * 3.5 * (1 + w), bp.s * sz * 3.5 * (1 - w)).setPosition(mRound(bp.x), mRound(bp.y - lift)).setDepth(bp.y + 12);
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
      sc.flT[e.v] = 0.08;
      splash(sc, q.x, q.y - 40 * q.s * PSCALE, 36, true); burstAt(sc, q.x, q.y - 30 * q.s * PSCALE, 1.3 * q.s * PSCALE);
      popText(sc, q.x, q.y - 130 * q.s * PSCALE, '¡MOJAO!', '#8fd3ff', 28);
      sc.refMode = 'point'; sc.refFlip = e.p === 0; sc.refT = 1;
      sc.celT[e.p] = 0.4;
      crowdJump(sc);
    } else if (e.k === 'racha') { q = proj(s.p[e.p].x, s.p[e.p].y); sfx(sc, 'racha'); crowdJump(sc); popText(sc, q.x, q.y - 140 * q.s * PSCALE, '¡EN RACHA!', '#ff9a3c', 24); }
    else if (e.k === 'dash') { var d = s.p[e.p]; q = proj(d.x, d.y); sfx(sc, 'dash'); splash(sc, q.x, q.y, 6, false); dust(sc, q.x, q.y, 6); }
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
  ui(sc, sc.add.image(CX, 126, 'logo').setScale(3.5).setDepth(3000));
  utx(sc, CX, 252, 'PLATANUS HACK 26 · CARACAS', 16);
  sc.pressTxt = utx(sc, CX, 286, 'PRESIONA START', 30);
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  utx(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f');
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) utx(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22);
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    ui(sc, sc.add.image(x, 452, f.key, 4).setOrigin(0.5, 1).setScale(8 / 3).setDepth(3000));
    utx(sc, x, 462, f.name, 13);
    utx(sc, x, 488, 'x' + e[1], 22, '#ffd23f');
  });
  ui(sc, gfx(sc).setDepth(2999)).fillStyle(0x000000, 0.65).fillRoundedRect(CX - 340, 518, 680, 74, 10);
  utx(sc, CX, 536, 'PATROCINAN', 16);
  utx(sc, CX, 566, 'ANTHROPIC · YUMMY · CASHEA · ELEVENLABS · KAPSO · VERCEL · RENDER', 13);
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
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 4).setOrigin(0.5, 1).setScale(8 / 3).setDepth(3000));
    utx(sc, c[0], c[1] + 52, f.name, 11);
  });
  sc.curG = ui(sc, gfx(sc).setDepth(3001));
  sc.stat = [utx(sc, CX - 176, 436, '', 20, '#8fb6ff'), utx(sc, CX + 176, 436, '', 20, '#ff8f8f')];
  sc.nm = [utx(sc, CX - 176, 464, '', 22), utx(sc, CX + 176, 464, '', 22)];
  hint(sc);
  sc.cdTxt = utx(sc, CX, 504, '', 22);
}

var SEL_COLS = 5, SEL_ROWS = 2, SEL_W = 52, SEL_H = 64; // cuadricula 5x2, celdas de 104x128 px
function selPos(i) { return [CX - 2 * 108 + (i % SEL_COLS) * 108, 204 + (i / SEL_COLS | 0) * 136]; }

// Ruleta de la CPU: 7 saltos al azar que frenan (~0.8 s); el ultimo es un personaje distinto del del humano y confirma
function cpuRoll(sc, dt) {
  var sel = sc.sel, r = sel.rl;
  if (!r) return;
  r.t += dt;
  while (r.t >= r.n && sel.rl) {
    r.k++;
    r.n += 0.07 + 0.02 * r.k;
    sel.cur[r.o] = mRand() * FACES.length | 0;
    if (r.k === 7) {
      while (sel.cur[r.o] === sel.cur[1 - r.o]) sel.cur[r.o] = mRand() * FACES.length | 0;
      sel.conf[r.o] = true;
      sel.rl = null;
    }
    sfx(sc, 'blip');
  }
}

function selectStep(sc, dt) {
  var sel = sc.sel, i, joined = [false, false];
  for (i = 0; i < 2; i++) {
    var P = 'P' + (i + 1) + '_';
    // START o B1 de un lado sin humano: entra un jugador, tambien reemplazando a la CPU (conserva su cursor, corta la ruleta)
    if (!sc.hum[i] && anyPressed(sc, JOIN[i])) {
      if (sel.rl && sel.rl.o === i) sel.rl = null;
      sc.hum[i] = joined[i] = true; sc.cpu[i] = sel.conf[i] = false; sfx(sc, 'ok');
    }
    if (!sc.hum[i]) continue;
    // B2: si estaba listo vuelve a elegir; si estaba eligiendo deja el puesto y la cuenta de la CPU arranca de nuevo
    if (!joined[i] && pressed(sc, P + '2')) {
      sfx(sc, 'back');
      if (!sel.conf[i]) { sc.hum[i] = false; sel.t0 = sc.t; continue; }
      sel.conf[i] = false;
    }
    if (sel.conf[i]) continue;
    var c = sel.cur[i] % SEL_COLS, r = sel.cur[i] / SEL_COLS | 0, was = sel.cur[i];
    if (pressed(sc, P + 'L')) c = (c + SEL_COLS - 1) % SEL_COLS;
    if (pressed(sc, P + 'R')) c = (c + 1) % SEL_COLS;
    if (pressed(sc, P + 'U')) r = (r + SEL_ROWS - 1) % SEL_ROWS;
    if (pressed(sc, P + 'D')) r = (r + 1) % SEL_ROWS;
    sel.cur[i] = r * SEL_COLS + c;
    if (sel.cur[i] !== was) sfx(sc, 'blip');
    if (!joined[i] && pressed(sc, P + '1')) { sel.conf[i] = true; sfx(sc, 'ok'); }
  }
  var nh = (sc.hum[0] ? 1 : 0) + (sc.hum[1] ? 1 : 0), left = 5 - (sc.t - sel.t0);
  var o = sc.hum[0] ? 1 : 0;
  if (nh === 1 && !sc.cpu[o] && (left <= 0 || sel.conf[1 - o] && pressed(sc, 'START' + (2 - o)))) { sc.cpu[o] = true; sel.rl = { t: 0, k: 0, n: 0, o: o }; }
  cpuRoll(sc, dt);
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
    sc.stat[i].setText('P' + (i + 1) + ': ' + (sc.cpu[i] ? 'CPU · START: JUGAR' : !sc.hum[i] ? 'PRESIONA START' : sel.conf[i] ? '¡LISTO!' : 'B1: ELIGE · B2: SALIR'));
  }
  // con los dos listos espera 1.2 s ("¡A JUGAR!") antes de la cuenta: da tiempo a reemplazar a la CPU
  var all = (sc.hum[0] || sc.cpu[0]) && (sc.hum[1] || sc.cpu[1]) && sel.conf[0] && sel.conf[1];
  sel.go = all ? (sel.go || 0) + dt : 0;
  sc.cdTxt.setText(all ? '¡A JUGAR!' : nh === 1 && !sc.cpu[o] ? 'LA CPU ENTRA EN ' + mMax(0, mCeil(left)) + (sel.conf[1 - o] ? ' · START: YA' : '') : '');
  if (sel.go > 1.2) {
    sc.faces = [sel.cur[0], sel.cur[1]];
    setPhase(sc, 'count');
  }
}

// Pausa: START durante la partida congela todo; START sigue, B vuelve al titulo sin sumar victoria
function pauseNext(sc) { return anyPressed(sc, ['START1', 'START2']) ? 'play' : anyPressed(sc, ['P1_2', 'P2_2']) ? 'title' : null; }

// Linea de controles al pie, sobre una placa oscura (como los paneles del titulo) para que se lea sobre el zinc
function hint(sc) {
  var t = utx(sc, CX, 574, 'B1: CARGA Y LANZA · ARRIBA/ABAJO AL SOLTAR: CURVA · B2 + DIRECCIÓN: DASH', 13);
  F(ui(sc, gfx(sc).setDepth(2999)), 0x000000, 0.7).fillRoundedRect(CX - t.width / 2 - 12, 561, t.width + 24, 26, 8);
}

function pauseOn(sc) {
  sc.phase = 'pause';
  sc.pt = 0;
  sfx(sc, 'pause');
  F(ui(sc, gfx(sc).setDepth(2500)), 0, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 250, 'PAUSA', 80, '#ffd23f');
  utx(sc, CX, 320, 'START: SEGUIR · B2: SALIR', 22);
  hint(sc);
}

function pauseStep(sc) {
  var n = pauseNext(sc);
  if (n === 'play') { clearUi(sc); sc.phase = 'play'; sfx(sc, 'resume'); }
  else if (n) { sfx(sc, 'back'); setPhase(sc, 'title'); }
}

function playStep(sc, dt) {
  if (anyPressed(sc, ['START1', 'START2'])) return pauseOn(sc);
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
  return { title: '¡GANÓ ' + FACES[sc.faces[w]].name + '!', color: w ? '#ff8f8f' : '#8fb6ff' };
}

function buildResult(sc) {
  var s = sc.s, w = s.winner, g = ui(sc, gfx(sc).setDepth(2500)), T0 = resultTitle(sc, s), L = resLayout(w);
  s.balls = [];
  sc.rings = [];
  sc.ref.setVisible(false); sc.refBucket.setVisible(false);
  F(g, 0x000000, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 200, T0.title, 44, T0.color);
  utx(sc, CX, 262, ('0' + s.p[0].score).slice(-2) + ' - ' + ('0' + s.p[1].score).slice(-2), 50);
  for (var k = 0; k < 2; k++) {
    var t = ui(sc, txt(sc, L[k][0], L[k][1] + 27, FACES[sc.faces[k]].name, 20, k ? '#ff8f8f' : '#8fb6ff', 3002)), pw = t.width + 24;
    ui(sc, gfx(sc).setDepth(3001)).fillStyle(0x0d1030, 0.92).fillRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5).lineStyle(3, k ? 0xff4d4d : 0x4d8dff, 1).strokeRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5);
  }
  // cuenta regresiva bajo las placas de nombre (resultStep la actualiza)
  sc.backTxt = utx(sc, CX, 545, '', 18);
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
  sc.backTxt.setText('VOLVIENDO AL INICIO EN ' + mMax(1, mCeil(6 - sc.pt)) + ' S');
  var nx = resultNext(sc);
  if (nx) setPhase(sc, nx);
}

function titleStep(sc, dt) {
  sc.pressTxt.setVisible((sc.pt * 2 | 0) % 2 === 0);
  var j = false;
  for (var i = 0; i < 2; i++) if (anyPressed(sc, JOIN[i])) { sc.hum[i] = true; j = true; }
  if (j) { sc.edge = {}; sfx(sc, 'ok'); setPhase(sc, 'select'); }
}

function flowStep(sc, dt) {
  sc.pt += dt;
  var ph = sc.phase;
  if (ph === 'title') titleStep(sc, dt);
  else if (ph === 'select') selectStep(sc, dt);
  else if (ph === 'count') countStep(sc, dt);
  else if (ph === 'play') playStep(sc, dt);
  else if (ph === 'pause') pauseStep(sc);
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
  roundPixels: true,
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
