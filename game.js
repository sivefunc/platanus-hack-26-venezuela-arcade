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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb9`sp+5ypiy?RA2UPV<i!-l6n-,UX?hs}U|*}V:g?W2l2:F-O7H'}35)X&RhV #@!-u,C:tb*42$u!-- *VC -Sp)fk[HPD[Xt_.Lt'vx^!ck_)es'^ !ZL^66Nk6v.6<IoyqFVOHrZ?u@bJ%n$e$wElswP_YtrUbgM{{r&qQN(M6*9WXGj{2=pP}lJJA9XX?dqUi@x+Es(CidKYpE,^x<-pFE+l3wj*e8X7y$):EU4tLp@;eaJam&d>?*,e*^IPkQiczmmJJ_}ifbW1>VxDxgg$Lgh!;cJtW)dHzd^oNm2>%ThB@m}@0Q>*V;&$L,@$)8@np(@E(k!Zbxob0cEp3p+A.8~s03dSUSF&P:Em;VZA>-VCH=:FHcqi^#w9{ntRA);KLC.DILt*y<7o-HGg99&iWl)8r^{Ydl4#p(O,Z=` SijVFb|M)x#O]W}-bS%Cgn:RtV!QFYvpw4m,P7RKr1gFqsxW @wEihsC&  '|9ahY4A2])P7FM?n.EA?ED-q0<Tj`BXY_ AYbVzCH dTaoM;x@H>f.s=8h%%X`A='emQultO%L}xk%$x'2KBfTPJEb:+w6ma5C$3NC=Tsl;dby,|$h1H0&EtnbnQd<4=bo~m8EAjqcC1+L^J_feSrA*N&-q_IPu8r?rX{XDQBAIr'{`CT7Y*|sirZ0sd,!BXhD{'}1.S1!ujAD+TIE:U,%eMK@$Q`b6^QYmP!XIsw+W1-gK9}V,?`GIXV]4q1p,)W;Ux2RDP]?&NL5# 9E)^8@]%Sl=G2,b(YifAy@C?nhd8:P<CFF$2?KmcF[$Au![qKQ>#h^OPa]=lGa?z(H{Yb:s ; TT.eC2c8ap90Mil4LtCuB8:5xR*)$d8M5sD+DU_pa<1za.V,H<(<73< &z7((B,UyO{n+s%+~%f8b^N3S7M41I58Vk4!UC{>dDWmZ@<H[g#BCrRc|:DazdP4gj`k 3WhFdF>vQ3JyrS!Y5d4!c|+'m+'b?H ]!C]}nS4c_:eLm #0nR]jabJliOF_hH[gU5WN{}hz8J-cBkKoCH8h150U@4akoxWlx{;YFF{Nnf#v@9Rqv}](H;A{87, MV(%2m8BO7(ayMT='Oi.qv;uZ4Ycz$_tV(Uq`fcp:rU@mI;?n7OFPRkcq[fRoO7cav%a.i`F14.[u}QJ_lPa!';V67@D0bIP_nCDfVmOf'+l5#cKitO@:)*dGC`;ilQu?MSV2ESJ_Fgg^Gb:m,.FV1n=09^(gk'y,b(M^:3$SZspjkx3e[9[m!2}30lDcKe&wN^Y7mmEy1<6Z9t]uqp'GLb$Y)qy&$-QI3]?a`.58m$^5?=~n] Co=(q,l.vlr!5J1Y9ghng_X<hfMAbXe[i sgOn?3`#Y[Y1Z9~Wy]{q?5b,'XvK;Fx'0#p &v<H^pA7wbD=geO^]UF`M=Xg}o)G`!%M,]Qfx1j[6ovd6CeDZd5hUJEzJGT[k'R:KO]GwZ2FB6.L0g`k|fQMX&1c@mxA]U1N@>{'pR`r2B9&fo?I=18OcM*`D#`MjFyqWEZGs$C7eN-{|^!amm@6=1(Hl$uw]67dKV.XQ1<cgWQHZRa8AMcc[ DQh[(Hi6Ko1wLZ^3QY5J6,@*W^iL@jxy!Y8M6mE@Wb8eSR~fybUo0{;p#8[hwc^J56mmcyxijxJ{+RXr<9@9iW9KA*VoRNg7!Ho:1]YcUeevqRc,-MS=P&>Xap.C'AZWIgcLS'<%?b8tnN.V7]'| -z!1v9TN* Lqw#_-v3`AdhtnTgD@G= 23M_t7=Km=6beMaAgSn1gL71maj&;Rnf]4[4z%|e6LtM l6.&p!5}Fbcky3`H)aq[!Z0:#{NT5V'`^yB5kr.8&fTA#!'qTy!j$.nk?o0{[81))*x(Kiy1dNVg8R2*h9k`).7=sM`1PTeuW=YU#c<q(K3_'BZIk%-l48I5z~D2xYT[JD^}R:#rZ-Q|ZAf^{t(eBc:=z0hYTZo^7;b!-%.{)-vOcP&`_*%muW,@aS)8N#UPSEoG0 l-=8Iq{p1fbLs]rYHblr<[TdJz*Do|M5`+hOs*a']Z!O6$LOn-ZQyrM{]{^CfU#tSuw`isH<NT.B6dobJ%`(L|e:'eLlm&.VMe6Crr^}uhIl7f::NnQLAVO(oeVe2|K@j-[G,2YD,E^uZ65N+Z'Kt~B4x79e7d_}n3[L`8,-4CYLcw(sytS_Yii4HWdEiO'CRduDdT,jX#;%nGwk8]>*Tljq?@<7g:>Frg!U#E'5w|b>Ozg]#*I9(+CfcRi}O)UE-*55sQWg4+# a>9HQ(4+PYo*k[Gh07,^;gYJq.@5z%W1`WYVEq!N15mV?:Ayz(Tx=I.EAbH><I6;9py%Jl[8a$Ib)h:uQB!:XE7yP=#t8:&cm.lp8lj?%0`o8^RFi,;N1,b|RsYo6rm}){wde)NZ!pm>N}f#Ru0-R6+;zouD5p(gJ>Nl$U!OaN54:(Z:O|)h!#u r2r&7BB7pG:5Uw_n1|h66?5#er4F?uJXg2'r$p{e7*k=q67b+91ljx;h!^hHN:X)8}Sf.S@)e<RJ_B<q.>hz`Z4@aXd>tQMZ3#<Bc>7>HLD.g88LeV5Y=3u9AGo?lp e@@ u-SfZZ{S-Y+'nWe8m yg0-4Oy(Jl%<k4h>U;;lk0qNb-D#(mv%scJz.(~2:$R&+g9Q2LqLGk*:W3y,B[cW`3W0My __wg{k!kY`tqOx$zt.:L8GA@0E;mfi9!Yg!0-R)!=Wo>3P#Q.[K38dymF'X'U-#-7J-vs'est;<QoRNz8 Yk<C-VWY'M8A*0iTLDE;fs<gUt.z2ca;hg'Ao-NV'J7qh%K+<Uc}0`Lb_R:]#NiV@6&%M:g3H.tj8Zl%&V[xO$fZ@*)giB11KB?!9jem'hVq!Tm%az5X&d?Mv[8EAB2(Dpp9mnGZ;]!6-uFi#T)=a!^%tn%s1JwW0#_xxB<9^==m`yl&wANpyy<(2d&vo9qoa^:wXytIjs!R0Gdi-qlaj`:Nb<9t=D&g2K3`<^k^1u@x3!ueSnT39:ADTgJo1 U.CA2^k*!a$)b4LWjO;)]CtCG]d-!KhTt=Grs3CX5-3k@(MFV68<>8{B$6,c*=hVs!<`5=5k]n{{cDAB8aT$=lHSJNR@1{z?ZAGFi2rWytMLN_H8wP{ZeqYG*Xju;@ t2rm37O)4Vf8-6a-F'7P7w_Sj!}Do(2'>vDSO6mJ37PGMypQQmi^AN+tP?<&=4K)3T^g!YmrdhXWZ+$0:9PfM0QnkcAK2J|EagzmS`x 9UuG&5R;|*F'?(Ayxa9dH!gOp<Ob6[5^}n[:lrc-#ue[y*v6YEZ>C87Q=E,N% ze=VHam`|2oe_GUX>O +U.3<H@UI^#N]g4O#Y4lq&&~E&w)VQ:NO6?;To&%A*>L;E_GJPs-swJ!*C-<?:Z>f[j0E8LPC`2Z39:?]fFw); vlgIM)7Wpm@C@.!pqXb-MM!?$^0{|4~z]pA1eed2R=Mfnv*T+j_TsYfvaf*KHDw9:#x1`he,c$aE[ZL5mi;S=*$kg4Cp)jv1a*b9~`OAU^zA=g:2(?=c54~5@;Jo>a,7=:EcjJ6pUn Y^!fdg7ELX`T+p1e84;y9b@hmo#ifR>E=-)S`@ 4Ni?OzF,P0_2Bi)bs+[)X;8l':W4TD=?|a{`CJXo<^;^544Px>Zh|HpFWGgC>8mB7qXZnDfQ4'$5`oAZ]{eD=5sSzISi%QnTouw(}QW67WHLKn)<0Bgt*R=:F1V1fS~iA.A.A^,4^b*+0g{0Zf~S7y#&Jar(1H+FPy[Rq#}#g8)C#b@TTpok6>*#3V]jrh;(a,@%|(hEIJ#GHE.cg#ZhZ(-Eoivkr>#B23i)u9:1)OV+K3{Q#XL;2q$;;e~[7s>*)d)L{c2'nOc,Qe 1-VQR2z?F5y>(D:T,]4lB9@~F9-',atUVyETM_Rf_Nzciw>*q+QnO~JKdKv_1 fF9hzt-Z_![waLsEEt#B GvP-C:o;hxd`HuKoZppIhdFqE-6pAMB3QNp,r[*l'ekT!pX;jU}0%<Ti6qdI4Q@(1RZ1sfNj{WIKjUa$TEy*3{wRvL-SX.XLFS&Qp$zU-7oGR,oc}K|f79 cMURf`@=VO2Wge5Y5oN~I0t'M3D{`9I,UA!h@ Z}w!*1ekiFa2*N0)PnPw@+c30)?I_!2S;k5YI-BsWmsOL}:Rou5WJU4Pf:xbBT*A{DSQ[3X<[+O*'IsM;ik(LRq^tTJ#?gWEi1d_C.[DPU>=&b-GrE[LyOi'Ed2y(B0$et,y {U%tZRbwQRP&2Mf7z1`FR@CI$t&T%9H=a=62,Y 9fma8KzNN^ Q7 fzrIg@(JR.emreEheH!'?!-q&wJi;&=5y7pq{u87pTYpBD{jC.[NAbNosYzS>h>J,^:~9Is:r*l+c)Mw[.wwSY9Vf(9`{`ipy<3U#sU,;3*}R`'[ q ehiyBMA[($w1363pwIE^s{2b=`<hmLM2[&2.knb)MbfjIT|QZ(W,pZf^Hq@o.-1QW)w9:QnY[N$aD#,TNO1SBfi,dS4EF:N38m 1&w[G 4D<SL==xf;`x:dSKJq<=^hQ#CmKb1:%67N$sjptI7P_9:Oi*X$eCb}]taz^Y`,pb_y,r=gFlI@sz,:iDM|Vg5-BqBqz4<SCIgn*dH!lW)W2{sCQ^:i%:S95ZH^YNO*7fFyE2p2iWNEm(wUSCfelJ-K%OqL(qqO,BX`cL91^fEy4VQ@Y~;-'[nXSAp'+qHa^(D{GQXA P%[FM5[15u[Pa3?'g12M$&sE-'E[j-Cj:CHs85)i]f@TP,3@?< g~Z(-.?>vrpMdzq)n`QMe<#!+O;bX)ci[R3AIm=;*?oM+ef}W0PpGJnhcNr-_p[MqYG?w31`ZTMjbq N1<@?i.ul$KC8c,`.(+R<o~`,NN,kSq{>O}5'N+za.nri1emuV5`bRKyfnhVi3JO48GS4=>WIN`'dI:?2M}d5vxAE_FaJ`?J$I?lie`6wfRO:?G.6Zpp?-~9{W V]v*FJB4h*GBc17g*GeVk=DA;wV.Ct^~ffp5YaTzmM0EU!-#Cuw:aK-e^>s%+etb'N9.z.uYnzqe!`$GAW<BJxZE1~`s;&nUqfU{i@G8%Lw<8:['-6i 7t'x!U*C^i3^QtTiLxT8Vzfa4Z4A.rWRNe-7B%[O%D>k$Ud_;zP(7exi]WY`#_GRr6ywK`<L_oHgT5`V!z4jOE,@,a?cZagTLPTS 43[>~+EmqfwJpryHfLrMk e02TKE4;cW?H}-fw`4yKaLtLkK%3O(!?3*_ZFjBkc)hXu:CWi5R5~+Tc$gH[Y&HnC&X.67(L@A+VOJqf3&5iZ'@ uE$i`i}Vj'VDnMevnh!!`S;4]+GtxE8[HCI:F[^J5L50Kl(u8_k.o4EkNO Kz6r6>Qm_AY@ESma9N 35Gv3*ELKkeaZ)]4M.48^=MU4?!eShfR0AMDUb?#C9BO_f4C@V]rTITry.TS8%L7SUCz<h(j >RV-mc32]uRP?;'4Mf+a d_&$9?B2t-cex,b34>pD(#}m=t.zS`!e5(]mlx&[.J>yTi9toBZqIE 0Cq-OF]dfM*;MMm}kjSpgBdcQ~+[9OauPBk*Uwt%IVf>eSl,l6F@eJM,Ml`+ <8;Swrvd0,KdG(r0!<TAO:#R~xMd1LxPBiG7|k5vbI^By^H_+6|Wx'gR_5PoGs?yi6v;m?2L^W2 jssi)'ibF90sE$!?W&1jO+F^kAuZ|yVAVxWPBjk8aK,(e.c{<L?#Ib`I-C#C<EK:EVOjN 0'5.,9b^s DUFx8J5{O9Qd~phS:Kd<TsQ!r4-1g0LvC7V,'HmclXo4nh_D|cu4wEO6)RHD:dssMO4@M_2tq3PSu)KmhPdo46zz9f`A^FS$Q^kG?wra:p@>tfkUpP9qU8@8<ggDM.5$95B!7+XWJ$b+90(r28wbgNt@_7t,ADKD8(k8@pChdGWFWprz+1vj]t;Xr01HE@#M`6Oi(X!o4QrwbfTDVHS2d0Y7kULqR7~Z6Bzxvf``<Bod}6I     FZVrGB2Vw&V", 4900],
"sprites": ["Qi$G*mP;Ys    F|;-R)   1NR  IF8=   $ZPD9pw  '<OB?>`8 c2&E3;}ST?RA;yeL{Ah.Hho[RUak]6HT{>kbd(>,2 o:F-O7H*L6%W=Loxcr!K=b}GH{~ZBt86(=3rBYpRSw%4bYadk    ##0>re 26'fu  #5>6ZF(Fw'd)pSI{Ew64.F!Pdu&8d0q9dCkHuU.<Sa)z+={~EcS0kqw[ZB!syDG?pvBbne.J%*F,{1Wiyn-_QowL1{Q,%<k50}XvM,%t,7gYC '%UE>.+(LMVzSN)p1~V*Ny':FQf>Ew15eD:-@j4]F6;}QcyF8WMt@@vlR-Ycv*-B,l[)32g7S_3;1e-eO%He(Ud8(t+O)I(ZX?0+`BhO=yX1TXF>K#BH;fxT  j9#qgX$8t^sFV<ob+P%ENWNAJHQQ'%`d#=+k*co5Wz0_];dj+9Y$L+B<`HB|WRBI L+2`s+#@qt)*ll;T^fg6ysOl #fcG%mc~=uhLX(svPk:Px.t]0G] fCi=_@Y&DiQil`]B4kC+$Us7+4@ V~3qXjk5!&n~MKJwvm^}WETT VRSrxK9ALH;]0CCgNh:pZ*^hVp2FvykTUQjYaRB$q5xlKE($pl-cU4Q[h,GX`l}fvS8@~J;qBEb?i[|qC>4]0,;9yN~WG f4J>|kOY:TLYp%3>O>8`:5#;Cgj-i%&6?^?LIE%%S,{:00A2&45ZY%By7y;bmf7^r@ikDq<C{G0agUWT;F=t JGkCD0w$58MlS@A$?lP[OsCg+_F`FZ 8,B'.U06CG0{hqa&mEvbqj&9Hl10>D$kR#-I*e'SL]U`Y&,@$Gv2B:@W[XmX!)?BlcTj+Q$0iCQi^.Sm8#Ebu_ZFr&RrxlX&zKsO)&.WV:iO^l5$NuM{:'AO1l|G8yqXB{.gj.XE8wo#,_KlxUdhy49hpN?u1B=lOc?M3z9r17>M5p<5DS5f6f{[rcKAifNjN$~-Cz,fv@@szIW2]>Wp9Po%ty4njL%P&V-KNtJfFF0+VE;aq3ZL84~sfK0[u@;v<%Nese,3htMqB6`l]Wg=Z8tcKOrztHeCWIDHjD$V&q}pS&~AtPU*ut#wr'QQ;&Ppi.gnEOpZbeN(3D$_~1{y-o.4IDIPMqicS..z[SNxPY$#m^5!Q blpzVsgt=5)%x`2T4 *2t.L-B #Eb?X6?5HAU !C%_0syQxi+&vvA`Gu^)'u`1U)1cW'S5J*A'obI'ib=6~WsI&!t+L,XcFS?Ck4<?T<`tUs@F:[UOG<TXC1Tj? 'V9I|_K>7^vz.Q#7Q+5>v3'iO.ei}#9<aB7cU??yW6caEjx)an]:kfk[-ri3glP3GB1Sma`ie?TS_yXiG;r*1ps9.+fYQ+P:~OC?)h.30.:M{E(0[.ncVm@2c+;Fu[UF^fX0:BH*&GDy'I`ZSL]_XmannT&ew0WHAvnVn2nYuB_I2iFWf$@M1G8{!n%t~h4k:s@+bHM3Ef+{`NQGJ=uy,YYCa%5x~2hJ5 XA93pR9+?lVzoDAg=kHCehg<>{Onc_(dY2(.soaA-Diz_FTY5OzS::Y+!Rg[#.nArBHwM[Vq=PT=v4(woO&h7LWvLk)vMI:qd 37U2]`&:AuO?vaZ(w>g02Lewmv<@!TVl(k:l[!M7pxjkp7Eh.+v[,Q;MIXI=Y`No,M,S{AMz.NGv]'U,KXFo[N@>6&XZ$7Y zfE14&7F 'g x92c^'X#xer$3jF[e#nhWg#5N*Vs%20]Dq!ctGN3nZm[*t:@4g&N__xJ;34oDNU>t^.Y~XFv9gK47E<7;&i[{?@dT<5sbN8r(SmO8t.?]S$iCJQkk>Cq_-k[=dU7h(XE9wq6G9GU=,sOcsi.){N!^+QnIkJvp$d_G!33:lrL~@G&p+jGGd(v)>4v;tZ[p4l3+[nB@QnG}h@ZT@`EUZal3Ag;YRz*gnMWNYFMnB8s.s.b(+M']KLZ[Ik19:'G7qh?@PO1VsZ`_C4D[SS`(xRpM_Y(kH)DHjdF~ cD+9);pF OpaqWtM~?`;:-sq5AAH`^)$jD:cx1]s7]1!aV8l%ra@IL>.i]rQ29@v7-BZD>4O+#UK6h=D$o^%aVeX!,sWVnaUu_]1p0@Z6rW!vWOWS?>q>s&]M=wNTKu1r,736JA7]1Dm)NV5WJszZPDKq8dWg#qQ279uE[LyQcMm%4YPv&gMic&Sd($Pwf$[>?Glc^r@Gd?7diUfX[.^hZqCYG:p.Fp&e^{8B^qWxG3c )-%F;w4AU6OxF-=@32SeTl7WA9hF78qF6_yGPPEvt[a^oq2u< zI]`kaYXIEuG^~#$m:oP*5]eDzD[EPjZ#+,|?2UC]W=S+?&an+lLmnheSgM,FTZ03@{Q#c*q{kT*.L51gdu*Zs.JiVkcwCWMiCS`:Y P{zgciQ4gO(w1=_={(=,=%D1.$RuCsoM4&]>NPT$EV5Q|4mz=YOxNQl'{&_:Sud*y^Ny]0*jdY%018VY1epOIw0pO%t*p0&!^s1rxwo{Me;&l0~u#tO>DuDGTjU{+a[Ih[b9p(tilA2?tB|+`j4L{,Y.@;;R6i$``Q#xi#GfABD2T&)O'e!4r-'R8V8M+^xb.KO'T;FTz4P]X(&WMEI<~Zu,Ciy&^=w,xDcBx?>NEw+mF>Wl2{u9Z3Q0GR@ZX]|HNLD8bBo'Q^tu{+93*rkk:uX=Zvkba;Rp)j'c^SJs3.mQks86@xK]WQ60A,w-a0j7M!xZkwTE43k0(Dcc~BT$bjfoM;<(A7}5di(b{$UwgA6Q-fdwy#v'.y%uXdHCkm*nC|#xvS:6?O={uzdH`tvg0rSM+$MOOvp8wM5W%tnTGG6sjVqy}DDL{{T42b3w4DXvqB|rPuf5;#7s7hx'Vp7AvCY.mV9PJ1BE!c$<$E<a^pi]!eYUE=9n*d3j:s,B'r+gqVlI4BnH[yOUYQXttD7#M_=hDnZBX.1vXHD!uR_Z%$elU{=Krgn0o;]K1&|<Mn@v1r[R8?'oAfKC?IZppsaC*SNqzN%vXvF.]#|!4'4X9:T[Ez$XP7z+|tRNAz3UH6)8[<Q9[Kth3)ztp]~YHQ0HB>Xx!F;@Gr-zi1+C[f'o<>Xrt1z3}a4,uEcb1Z ![S@KvgOcIM.eH=;)_5<9P-.-S<o^E`Rpv{}<v2!V~VQDM6zI5CkD *qQ0<_+PTtpjU+1-Sl9 meJr!ks)Br_,7}N6s#jpnx.I;SJ_hWBLw!j.{g;?H$;6iC-%cOd?&$`**)`vt&II_[<EawUV==P$1Popz{%kQlZnyf01FuC_[=bAt<{vpum&YWX='=l8y!]KK)r{clfb3=?S+G$Ze5I?ph3Fx_=EiI>fs`G3,zz^=ZPNUeDqijEqJ'6UM|$*L(9dH2WHK8j3yKBI.n]^hPp.MLt3.FWPW&lUTAKQEZ,cN,'O33_Nns6;=k@bR9R+_xh6_94]I$:IKyxsEW.t;T{4BGJ+)SW']?]oW2{BMt| OI{}xU0kK,vWpI,eo?.$g@m7E&rkucTOGozh|$^5C*<$SlB&*SMAEuDcV]kKYb_r(XKVl,d@*f>ur=eEfO7}dLV=jjA&RHmP%V2NQ{W'KxW22z]-WLb~X_c~hXE*=$g@EyrxJ|ogybUmL^ER3humfsRHq&i'F-[Y:*f*F{cqrGtzq~h9q-8Bi|>F?%))<g392JOVtGWZRU0H8ksSXIm6'Ff(s5trfS>rumwrg:JPQiQJ-2!J7LERfRVi!Ngz,?>KlLfzsV8$DmcM3;<ideAzQ:ITr &cImM@'*l~K.i]=VT<wt*sFcUh@`kZ@tPHlo&=[uULqY+HpX `)S.kJ*VyHShCRq5mIs[^O^beDkGgaC*.6)+jKjD-UH)m;C-!rip$Bq2o@qmXU_:TRL2};aD<-kPZ)c3&A?[y;nQmX23L?VnG7D$!`i9;9]6nI(40tu:]sqwL&4MFQM TJShT*N-~Tz3`sF8E;(,_T{;*?=wddij~){DCJE'6Vw25GgES>4Nt]S*gd8:aX3-I+kIXUVv29kI''qcKyXHu>;C=@2uqkgME?Gdc3h#UPPQw0=HF+gr1 IpdOg)9qmS5sqfNi^KA3ch0ZSbX$B7Y!1mJdKsyk5107^9m$zmdw)Ar@O_`{TxxUzNOgr%i=>BC6 )[wMpjdK9=^:(vMxx>J{G0^7Lu`U0?u#nuyC;94UAbmRr5=)HgeqmxAYQ[#jq$gGqPnFp{2m&+IA`B:TqgkMh HUC6Q|IQt8up{u2S'Y@vPt[D4bS`f~x^A>n]tC'7tT(l?]7yfKb:,MwbjZ@Im7)0c(.rgpOs?Yg9z[gdgzNa5r5P;rv|]+3JNKvnNQlP!RROvm`K13w{v2.s@179H84rfnFCM,Trk=a*x@#fIQa91~^.W=yY4>M%h=RJ*bM!KWmpPSyBq^_gr2<Y5(Q:g>$Ei&MFU8DJ; S~[tEE2&Klkv:Vb]EnpuMM%%WF(#;h@ MvGv7]QoA7!X3uUU2VQDQ*b}d&m(<gB~{;NEUfdgvIPm7gr8&i5O?BgL$k`2v1i]:([4 m&<_8:$HN'+2]Uey|Wmt{Z)Qj!4?6rE<pN*U<Dsbblo@T+)OPF}q_+7a9R}[viA4PKkje#Fq! 3(LOB4N<Flzh2bd?:Z,Fq3V=>YkKkA=1-wLkj,p?}XVf:#O6j4[@!=mMVczoyr6k[qYkHqneG ZeMQ8w_&1jadO&ACo{NJ{*WH3ES81T*nOAeJJsUJsy1)|VDsQY1KIt3_U{6YO3rA6Fogd@KP5G*k0FlMvcG4[o@]^`o,[*men? WoAvg_dEhB6Y4EO9iAH#5{5r]%EV+>WA`_t#Bm,#sN!X@ES#J]rT(q`j O+QqZB]UrXHfuESb6jCL5FB7vQvLISOH4Zvy=sb[^60Uv3voN@lELHCp`[ns>?-+{Ee82-LHoSSGH.I$~BUC5Vz$M*QhikvNUvxQ[]4Tbz73eOhv=K0?8@z@*Qv!7zPkPK6)#Nmf>c?UXw(4oYNHgXOB`&ab&kZ]MJO(X9L2:jV.@WJJk4'u&m !t=`y{`]Z>'As(D$ze*v21X;5.Bt+o#uyV?lt&nw4VER.(JHiYVJUM)V-Z]dQ|eJ6?v!+ODfP.9BG1M2^0l=N{IkB3^u.M)S=t6kx>7TXZ;ToAsfWZ@yQ|w>aZ,wVIjh.?7<oy0_u$H{ll;]A5qmgwyY4EF)QJw2l0Ly_&D8oV%h5b70D5<AG_&bs?zfLBcY4+rHtgHAJLs_PxSsE|*nU:_!G?jo*b6?2H-GMY$zFxo]?T9ViDKYM)kmN3baA;aoO<r`cPv!Y4*VnU2R69lu[6wp6KDlW>fWq@9zqv35B54ldCz93zy?(Hr@u.ll],.b`d&Iq1ED5}_`2]+{0Kk8v!Vh6jaDC_lxg!;u.;FTSP)jP1LD_S>(Ew&OxTo&4{+hNL2j,xS `7)uRf!)#5a(*}2_ E(XuOMNV8PD7K8?@&)cQ+{$JEt0Y-g'Zc EM8LzJx'qeZv4{r`j@ApZJ8sYv+.8ps_(o(G{j1pgI)KDC-'bmZlYDo[_vU;VTePlfWR(^DS7YzLpHX(e$E0=VaXLD&c%om+[N Khdk%kR991{zgQPK&lN{ tl)#OS:7ATDFHzvC+QWyQp@x$wFXuBKl.aVotbqt2:OuMkoC0Sjo^r.bk;QYB+_iI3V@XDRoM'O!E+[pWwpV~tk%XOyhat}6,234Dm%]E:-G#qwlep-KEojvbZ#ZN^drKl1e{_&bOVrI~l06xeq]}DcfG-3L'9Z<|^%(r5r58RNiT94jF:c)]Hn*v,by1hBDYxICl9sR2s-%1N92M?0KfvqQiVq]+JY{Z6cDb+PRkO)9Hox<5hv|$=:;MaS3[?R&ri&,WDg=zK>M[b)#0#`^L[<*!MA,H-&rRR9PS&yo:6f[zQinT945&GctXucWu=6tLx`$|Ye?#x# 3CLjLJFOUpC{cic8G91$ W[e}oEL(Aeg$.Bmj)_AH*Oq}wr26_uSNJ+o`CYXr+{-<!tL6RSrveL-OL{Zu)]a]d'lT)u8%9RqbK^A9&%y?m.m04>)[<{Xr,fm^SVT[*X;=Ul42XBMu;hA.A]P6U76ook+Wn:kPOB9e60lsVb2Y*9vuU.3LrX+3TN9 jb8HPZ,<9{6v3`Jgp)#,[+<g2y,jq2zi -SHF J??H<>'kR6P7vE)C!Lv(2lfmg%p-'is|-3H9]8{:C!epFJMV0+XYlW5E'o51 >1Y]r0)$Q(L,0*2)U(CW?f]+H*7P_@$uhr]UAES9j6ZUCJfwCQWj?v!CVJ'uQ0R4rOX7`fWAx?.GG7(^F@tSByH$US;g'!j$.lp?gW%`8.Wd?A pPG}YyAq^V3_0LF>xdeCXncHfvRsB:g]K1'%!J`>wm;N[36IZ.5K[6Ebyh4A0'&-Hf`guvn`1W>AIoBH4{04]2QSQ9xOX.]cE2N23u((72[?Cf!lN?LiNhP#$C#m6Odx<$wCvsBAMNA9SxvDA$Odb:2%(kBb2}TgmCCAklfqld'y(ho|Nks@[`&#*h.zkUxg*iq8<Q[UhR4bp$Vu@V9I_:Nz)[OfP_%1+Yj#dCmaHz>MV1&oti,gj+^WR{2sw9hG]5$Dp?PX4- z<Z'Q9dd~,n'Sr&Uhl'psI];'?'eFw)XcL3b`GWM4gAZlK)t>tcxd=XnO>K1#,>T$g#Kxpw.]:}J57}6`nm[I&j'Yrn-wkux,;$R,B0>!=gW{hQQa9<jPqhu!L wH-kBJebC,OpN3a2iCmqMx<7`>W'sV++`rfug=oS^+5otX8W3|!,uoy^9@ad;OwS-!  gZM~YXusIC28ty&a&!2irHWSX3 RZx{qsKTR?-L5+<J@{SAwsp>`;O9>^)<m^9znV+#r'uJeFcdo'cN}poc]9YZLs@V_p;,O`(#RrID=U+ZWdOvTq~W~kih_g*y#zkC&V1):08M_3yRqqw71*D1{TEbfw3J>KS0goHp=TxYDPimQ_5uSFJ`egLyK9LlLih-Ad91Tz+PmNQ<85Y7GKvrd$e,BlKTd{&'5S4x-yY.mif+SBBy+1nmeBAk=.`PU83SMJq<t?i5$E{W21:bZk|yG1,,m6%,xo,qx`+X.TibC<Yn5r,f~MuH`MXJ#pOpf,=-458{6391Yd;nqf~E=-1rEcH0]=<tP3kR:%[%J:v{`{kS3^IAiTf_er<!8DKh]mV{h;W8Dt~T8J]<dqe*t$IaGnrIU1hd_uBUEh[V5=3-H]R+[+P6Ma)TE-,EZ%!R+#%XQ'F7HkQ-SE.*]--MzH'66_lD>DSPwX5-U70o^D]A+?X8_l+=6+(!=k@M,M6{fzdi,m1+oH2cHXy03j#c[RLD3=f#{m+p5eF?a[5$d(0it)~vY++MJDhHB)OCB+|NpZH[AXJT~RFUPqdtXiBip:X^Z7P^K)[cS3F78[U!@+]E6?>st[G_UE3h5(G[L9^qu;Soz6:]_n2FjZNucRtM!3m@0F&{EV)Bm?bIO+P.@M^%k:T7PH$nxsE+Zen&v2iPgXyD?h1+g>)W3U-Z9;:sQ3a^F!,`h,#Dd!<{tjy$e(wu@,.op`ZT}QaA R77C[p%D6`tiuxmnUTzXq.-[JOvEv(_oDW8?jeK%]D2V g8[LNhc{'OPg:&1WNKPvI_PDEK2B*@dkjo^LW6!iaY'+_{emRh5eMQHagHW<jXi0}Bbx]7JXhdfF^48f;@yJDY|A*v<tDa`i+w>G&t_huUVX6Dw6oG_%@F],SBj-dS;%0=8Lz12__5er^@?h_Ed,[iAcl]St#G6lbVsof 24z*T8dS#u--NYOOu]u0Hi7OYj}6larmm]qbGk]_PK{rZX+C#WAvX)UuqL6d<,vYrf`mbd|s%KF{Ww[HWD`@[^aCur#$fr>GT*U!+7u7r.yB#qyYWu|*yBL],E*s;v5GE(,r3b0>{[^%ssTUwP8S7kI;( lXB4t jhihLla758hvdr3wR{f:<nK8T^W+bnurxc_Y|GLbBF)vjQZhpbmzc0zw>B8_$CzdI'jQpgPns4~%&gGe rN') N^,U57SLkY|hR:^];SP%a-Y360ckx#CH?LpWP8gnpBNOk4F%ncgm+$b%f=w[$(iia1p(BuT^y`aVMHtGYv?Ua:rRUg2_)&wrf(Bn^7-f4!P?#=_1(gDr7qce6xbbWwz121HK6<x>#0 ytQ_ZT>^Ks?Sz)M_:`2n,?GI%:yFZe&lSB(jEV0*C>aUuRVb??2a'j4>6.UyGj;:2).vD+J3pw{mz;{v:~m!mzL:hONz@K8aV,(-f9An(oUBpmYO'Xm.3C43w2Yy$Eg6ZHe1XKN 6Qg.zsnTsA?*<5M6YXkI0`X>9jw;`)Nh,6R3MMM_(=h_'kh=>rVq0^nzP.,VLuohmi8$5)zAI:dDM;`!eKXOV&riBNx%Zt@4>P`&Uh1=u|6E9*Ky-%=8a3;rGT:!6kET'Aq?a$:-NA?yLUdNL*FrqA`Qbc0u;?h7u!'uNnR~g[S*B3<-)$$bDrT#l2[2'(x^_f7Oqb8o%)^7:>b{WTvM?P[Es]<c1,eH]~.pJC8!Qxl~{S2bN<?3Fkbded,#Z?+kM[fQc}VM=-a=rDgi7;G~8h3Dki>joM%pXPax3a-qsqIP?Dl4@Uc)vp(VCR$DKkwfr A{+=x{^Allb2;uP>c2zkup{n,Hy<G`-w2.pL6QO1c_lK6if.1[b3h%oiAQ.,z]vRIlu;nI2't*&-J(dzRu#|[gXaMls-:w(i8c6T2ER81KYuL1qd'HL,I9i|D+@NXMmyUfO'8E6Tn6A}=JxA=&-oZCR.Nlr;{F1m+%PeKD(Aufo7%1P-$Yg%KIv?!n5R]49R>W'jCv!G+NDZQ&Nd?Tl i53J7O' Yf&Ba3w,Mt`Gcax%gIv_un1r%XWiL|N<uvA`*pCUQk#wbgxPW&d%%2Ba1KJwxn3Jr+6zTgQ)(#Y)gukLL_.'LYlA(=@7:l!;<{J`FRvhZ*dgzTO,  +N8b;G,K`ndpzp#h04wC:0k!* K^jaaGclPAB:5m:99=R!rtwD>A5D4%Abk;1)6pRsH1nw*`qVl_ejOi AJ$*DId6(exOIOH:j[nam=ah5[kQ,(*#el}V'S3*#T?>v# aZZ{4QEC*naS%AmMYHDw`6bb,vqQ.6lc*q'UqL9uJ~:>XLmMA4PkLGEZHahoMme.r<@+oC{Z8oLq{'WIaGb$#S5sO-YvD81nZ1+E2:_{41!;,Y6~wRTIo21[lD8l`HEtt#)F&GBB=XDmR^O]QgfJ#7Xxu[?Ra`3_Nown,`tq[N#~>C-S8T2}#X RN'&p!!;N5vTj1G_a*6F$NKi2*OyyA%Bi)nNdR_@0isMKrgB!_wm3ah6&J)]@0R7N` <!wx:{^unRU~&9GLv=,bsCQD.5+[,L+<L|YgE),7u)yD+]iFS;w(3jPO<JkE1L^QaK&N--$M+l<HfJV--Q)K@859<zOtLF(f -zdM~o:N,=D53xlw}@(XI;Kn0h2I[Yh2LG-2rQ}xsOEq#Ap4(4sixx-+St+D_LVfq[$ur>bHsG?*awDoEzGuHMn>hQ]YzN nn_vf<:uPQ.IA?Rl?tTOh1'~rC$BXY]fLVx{FMQ-.9 2OwzhNG7p{mWHB.%I$z@ly5juGDNpf+;?i$o(8KL@Wq1`GGY^pv^EYSN1i2|$US<AV1C@FrC2Wjkwv(TE=Ora_LbZRv)cG,Cey]e'-)xzr<E;;6q?ZUg67`KI)kn_@@[AxIkOd3Eeg%?{[u9]?ZcJmXG!1j6ngHifSM0G>5?0W[7qJ!*x?NI2iESA`1Bk1!OrM^mh7gwY[c$#+hx5IZBumk(GIj=UatlvSATFj~8'y2Jm2|Yf1v!uMZa,6@UBXGU9Q^Idg<j[8iVbVEhScQQjs<h@M7d. ~E<^@619te:bwOu5<',gQ.Z,p;Jh|JRxwp$52x8UFnX!IU<+1l}_Nm(jP??.Xu{n7=29T]:o1(TB02^n>:RuM^hN|^8O wU2du^%A$S$&%#0AIHsXE}_fl=M:Oh w4TS`IbWx6H2eFzlzw#QbWp(h')PM<kz`Ut7<oe8(x Ba]ymBR)$cNTl3 eLEtqj@ `FKtMTgbrYzyF2Sv(,[>jW4N{uS:!?*299VprXVFaC?qj9v-$-15iqllS@ov7C|_G[Q&m2~MD&I(JLMmIGqG@ED2w8E^4*Y]))pw@4ngN!-R7AhS% tPKrRB~'mosP5W9N6Y^(oR:ubDZ[JW~XVSC.E&`x@OFWNw55ee?A@EStV%e'i`$a'`?J0>#`d9u2!%*>V(d_,vW$}0a6E5-:tD1X|@9)ItQ@9gLy[TGXvYV8Q!QbKU9EPOvFy@pAU=:61X%=Hl][K<ce(LmX(*P4rL~)'m^Une-w0`#O.:g8**3egN##b[x9u7Gsag}bwtW+'DZ , bTu4~F5INKP&:90Lk7~e_&Gd5#A5no~,!(wlDVU7BrI(RUz&^`]8]=R *anQ&[u +M+a;C_Q=WHpQp*mZG5Wd` CpGEc3p~'{8UGF_]$.)icYZY%fY@E#;0cUWWXcrld;V^Wgi6mt$d7]Du:chb%L4KIOQRcfotRVMZGF>$[rE->x gB43L>+&r4H9d_<10xF,.,9sD>t$zr#i G].4MJ1MT(y`an@qXrm7<VWa>'?P!-S)NuKCA )!H.s9)N,A$k1JsN5_aCiHN..#ZG&9e9!L,iT7yM9Dd[O5*tIHs9m}#.;wR5rCGvW EU#r^jrF&=#;3Glnfd;m7f@bCcgHAL_VZ*RyH`jV!D)qB@WD,ys&lq{rwGSYN(O,TxLQV9OTx0.W>kj8IX:%y9IUbcXEyY*Wf%eORFyg4`Gm:jtjX_SR$odm9HU,taH6_U8p-3:PoIPgO+(S0tk>)L-SxH!Ar$ok%Wa({CKR.RXkoGr.yt%Xv9GbVT@9V$;|@BEaJ@&5* VyNL;UaJM<9fr$uf$z#]P#k4(zNehgQbs%y>pYt.GtNJh1MF,,Koz@vcI2$yMft1.Tfvf[o,K<j,CD9]R36MG5|#a,^n%e<C{6.9AQ;KCBk@^Mzw.gD})sRcCsq;drz^lV@t=hCLs'VpA'6H]%Pz-Q^6Fu.%MO0lTbfTe:bU3Ct#{H1N(AIKDfjc)jNtB0I@qQ`UdPSwz>Ll{oUL&n5tJ~yVRcf+reb`=*Cj:p{J`=#+X{`G0Fk1qoe:8hvCQkVA1b7&i^u1'Z_<#lW>&)'R40e]^K3VallJG,d6k>(M?Fy0EGG$X=-1.KKkRG%Id%utVBVL2c'0VfT_G,|$lc)o3mO)A:hjjAo _7EA!vdi'+'3UdFLS+vhH*eY=_]%CjYl;JwgZ)MT<c,]['QqEcg'Xj(yG*,EL<)`]F=qGA><HNcB3Z]`E.iL*@9Jz,!^agg'ZLaj]d&L24l-WUmqXnV%a)uY8GFFiSkHa>;C]P.O(xE8Qu2.1TdP^$67;gYO>0rY6$52@x`{T7iL3gcD0h;M.btK^+VwO%S|%iz?[6dCP;EAgy#TJV;-]x[Z[y]YA])GBr)-SzG':O_@6Q<?]*WL8K3(Q*@(;1!r[*3]Gs@K]g`(:=S#p~Ak1Y,p9)>kOop-U!E:F$R#^!H_s]$ISey^BVR'yk`Z<H3(xZg+,XW K=ZWIz=%ar`xjr_V9E.-.7{rL5$ 5TJK'#F+]+.O_$b| }$]'Z[0-a^<Xot`j&6^.Z Au9)-a=X:lpaxv?h)Cf'?4Kj]MM#BGhw`9m.3]t&^r:utfs9HG+{a=K3~{+1[e&.aQ5U ')Mt5*$#^&oaGo?.n]&taFz.$>_`>k5FSX(P@DjI-XURw!dL)><11tu1T7c_(H@7M%Z'-V>&k9V6XwVz r.[]RquyM?Y8U-hF{*VPzPR-w[WB Rk<`:)v7b07qkm&?ZN^($xI8JsT{Mt6,)>U_LcV}Rzo3m&W)1pZN@.3e*V__Tq:8&,QZ |(XH0ZV;|[_S[J`5l@+GQ:dIl%DuxS4`(`}9Be1g-jYu`>c)^51j&p9ds?.TS@BE(5v>aGciiccjUb|Q0m~Q_.kPt1K>+Ed(_'wLtEL*x=(S4dQV7`<f{xno4rDMtu7mK77WU(@hoq1]&1YF#SvOQ2czBj-)<ucKcB(a@XZro)jLoS5%$dm9{2&+1lOv6c0Jdt,=3z*ons5J6{.Mtw&iq$$[ 8BN:9o(^f)tEKq$`T<.]d])_T.qYAO7{jx+uHR{F9plU[gp|=_M(0`fNID@pO&viOdb{kRVU+kqx?2T(9:T(C_QUxRG]Ez::]Y0<UG=_B^dXEkE.`sM?A}FC38Mx.vDDQ7>4Q7XeUPs[I>kp1fP>sAb^+|L2c;IOz|,F2`!'DN'`:w5nl>j-{j{|.gi(&uLEMdMcXU3bRF:F94*l_Oz#znwq6>WB>DK7AMW]3n_]uS12^T#PgV58)GvwA,3^UiTH>7&|6dL-'3)':Z9'oIexO[?PRr+0DhtPEwRuKB+|yRN93.)L:[i[GZ1aOUJBVtZI.HF2]ez&$4l't3UKoni~cp4d@}[5Xc<6kbNXz&Wi2v;7C]'*$8CPM8u4ZaU7r'p1M%r|c2aC,jDr$1'k,BP.nM2uc6Xih2l_j9BpiL^vuuc84w-zeV5G`;g&LhZ01> nce<wlBhcSK%-M::pbyDTMkRM,'?biE7)6PN|KqcI]40UfOEU8XgeQ+.8D[+MvDAR@2tp+LzjWnn[e-jRS p@5UB,BT,@3E6gS[8RyKqd]#m^3N5EEoF$311N)gr`%D]>M;{xh9IyV}Q{!%,xr#,R0wa]&g];#Djk#:QR ;k`eggTLTt91[gegT*-a-N^1}A.0kLm0YwO*q$Zh~9@8mwpJ' ;TIhbT?(3Dl=s%HrVZq2#%E'?-w4D;`9?lW7[S8T9qlpYgw^cQgos`fhjoZ(8YqLW' $.rwX?5-;,i~=90a'}rkx:g*D_ASeewXn|ZVO7Jit^E_Wz8Cci-%;o+J[U1bZrhWO{,2qe7-B?spwFpU8zMMX)YoeL*@@Ok_g9y<Po2>]A<8#%Tgkts<Q}sxvH`oHP25JL'GkN;g!`F%!jxYGry(WIfO)PD+8)sRk'F@KF]]JRZIhVM:uNe!-uzgl=go_K*KxpZiiYYEn9VwcUlNs4e3g[U:w~kw?VDLh[.KUOgV'A;cSEu{g4j}),EP_!#7zWnyDv;6-xZgg`a]-iS2pxQ`8St0&tv2S[H?eF[{4t?HzVv9G7D]2xmaT-:Zb.d%CHtKi4ZO@BeTHVJ%-|QTVXo~u|LH62.FlF4!<?KLq4(]sex;1AHENN>5jYkLkRS|9toLtyzymp#C*bm5D3*ET@)LY!Gw)aRpT,!#l;?*3 ('UgbGo[[gJ=FW7i(Is?b{;rO!H=(6F>%AQL0Y.h=b()O+,$!=p,ow5n;t#{UQ@qrKbCD]_F1FxRp-HKH&,Ntw5<,(D'6e_U'SXse[k{Lo!,v[32Jw? 30oLV]IC^7{usDs&bzO SmVMjn5x*0EuAG=kCJ1=e@r);v=ciAm&yPVTn`Fb6_InGz#Q,DOw n7 H>z2sP$jVxVj1[AuBo*@C 9L yOVr+j~M7O(:jz~h`D~&)ly=U]~OOAoRpAxgdQ5#Uh<$-JVK{nm3>g6I+@-XrMY4$bLt`kO&@^!v(0WW@'Y>I9(Gd6AWAxX)|{1va-:0A1%@3Jc7Nbam3pS5vl0Lol81)$b.d`5[%gkaG-;(W<7oOC1^ZS^>O2rj.v$]#Mcd@w_=Cgy4M',vK_VuOH'Gz^(3,n,=w{X3^ko_ba8M hcz(a|L`v,r?z2fv`sSVtA!A(K6$n,zv_yN:KE8@?s'Qtp0*6:!26FY1R*^RJngB2ROv?{vGT7aG9UFq)apF#SUbkcDyzgO8Ad#'Fh2oUGHKe`lM'Nr_co7L{@'7qdFTSu]VdIMG{uHJ)Yg{!F0{-s =!ARJ2^|${ qy6Zh&u5kNX]M]1.W`T(^.Scfjpr)rg)xbrQd]B`#;yZ-uu?Y$&iu?+q^]{;7V,%[pdB`@v{#X]5rEkC+VOC3vP)B%h1dGe$yE#+1L(UH4i7z:^BqJU}+ VzHF;1qBchC%i[;zU&@'aG_+s8<K2lJ=Jen%La_[E>VE^7bycJy^^Xr4h<munFK{sjDUA8-zPRTf]~A]t.V:^qVh?Y98^]Jz;sD$F#oQQ&q,eWRcVy'|1^!xlnPxHTG0H6_F1PJ)p(+@lv;vQp@X>#e,KY:[#h2B_lkR&QIhCWeafy<sp3[G+B]#w@de<,wZ*E>:LfbVzL2f7[vn+S ;M=Cd;vm&UFF>y5SnCPQEU~.GfVv9dN{eNpunrFtBl~=M7$D* Znex;G u-g 4rR[O&zp`(zn))_m=axf#*a0`k<Kdw6$y<nvr$,8Pqs$z]xz>(XIqTXGSI`{6C?a<n&=I#v>rjWI_ZCt-|s=r~#)%bG0D,&_uICOROy<R^zd-4.8qasnsa',T*kK)_c>MlVpjfC.:y?I1mv<w<uAL@&}bqwiU7aBAg:-#RXqEL:9Y:E)#|)xU_v4mTX'DopY`~y8{THvzgWW,|%mwsEQt+T;b0lF+Pxn-<4)Sioq%{NAr`gO!k3g4[(z;t!IAw%nxQ^<%6LjYS<Q<RG$$}f%lom}sU:OIJa(T!{[Dez{`j%ScDPOo2@:;|AXz5kgbu,MwwNEc[-s8Z_S akHMby~7v^=%.u(T DsT4A[@^JMu~J1tw'qw8gJ%IYZ?w,nV.Ru7;W>S>e:1@BcL(H.uXKizoq=[b1Gq=MzZsi]n%R`1WrM_BBfaw{^7;T vmtErWwriqUQU{c!yUgH&m)=t~eeNA`P$.*Fv&,~ci2C1w_7psbX%]cGAH-`d3r4y#*eE`x]4Yxhu23XA:L[{@ho{ghr885J'}UTX{<K]6!5{wx76wSEO-LuXIO5*UrLdJrFS]I$(fV[r4.{aLN-^bpf:^J;GQl:%T+3HV(EKlX,d0uXc}Pwj|U'ubcq(Z*^Q)'%F#lYebZO@h&73$)dO-oSRZM.sN6>%-PAxU:2@B,C90v]:4g585R&Bvi7>hx_(-IibwMM1C9]3bR+dKDrGO2Z,Ray8=?,y9=(+ZeteB.LdH[jc_XFX!v?+hP+%vc([m>fCQCU6= AK48!tN_@ofMwAF^3]Z<B'MgpJe5k3,!R@eKrL}HZD>@TeL(JM!OzZMJAZI;%j]:eI8@(u_&<r`{Uz<oHEp$W)&8AWmi);'Y>w2`FU5rTQ0YXZbzYoXR`Z-W6#f:}W%hi70TS^,0ZGE@1F!g6lXm NWmExL)P u#PhZ,KMJzhkf&(l-m&QuuS32iiZu6^H3DIJ&ZAR)`~W~D[,*;,!FHl{w:d+JEU-v`cGO<F%!r+-LbGC|7r>.plu9w!4Fh3C9{ki<wf`woEDBvo:?^`tv+[1gC{^1Mpw'REO[=H:SUKP@<TTLV#p[6CZ[_<b}-e19:J$*a]xxyY Yzq-_bmdG:UG3::X'c&]3)TmY4 .G6TT~5U_MVf[UZ5dK:gj5@dmK%hk'$ qnh,p4o)q:sLCdH~RvxZ:CSiK-y!P(JYzQ`!Z{_y)xsauBOc*yv.I~#<eVP[I55iC{x{o)H-nNj<+M*oH aHaAEpeK>Djc3^NS$$5<$;qxe}{(lANL8+#|yc.j;VWsqDzeE9I(kW7`!gv>c[72Q{f:G0 UX8@By(KiyJtv&a*gC'^%@A ueNj]*CeX;-kcUl+]WF;{Nw5xrYVN`Lca50ro;B!EF}SKKy7W'I![R7p{OIk%1_eIu?8emY$.knHHpTgQr=c({SU0yJurz4{(UK-qGp6(P96@+L)&oY6XzR)g@KJ:6wyyM%PUECvneMrYJ5j{xxWc2JGn'tNuYz&}(KR8XzpY;ENZNI_9dPfGH=iU#0.qPnVu&gn!?AE+_hjWka7W^FZ_ x62xQ2_[c+hg_r]ca,bp6t$p<B,y- {_}:Pu#ybKV,|x<c@I$XmXYKFh7+pj} h[`5:E$oOBkL=iT-XBY9[dD[Eq$mR BM}t~LoX^iz7<M@]<D,ta$dV2YiO-_9v~V{5sH2JkEXdls;F8hPqlf?Cda%0.y`K:fVA%EFcHJ8kDH?L5.5g{6adu%uC9bDW+Jz-eM2[v`brdlb]_H<GH]JekDblL=Tc{EUk(-EdWsEl8GN2y RD4mB]U[~- P?zM+jxP0m*D=R+UOj5((,wdC2$ +l)h(77B(e)'S'Xw2#kq1~k7zO+$p~+9moiiKh[]E?]-1$LGxnx?hn`b{qc1Mc1t?tVm4^[5RYUw6KAvA)[zqW^Qa-8cdHh!'V+eI!vG7x::5x_Z=D(;ni:$EH!f#!n>TIh98KvMd%<5JqTC%qi<NJ(<KC8foT+z#i=s{sgW^qY@+,%$oWV9ny`oeJ82%3d_NIOVC8w-(;i8C?WF8{Mf8#CE1~T%aM{y_GUU9F    $3(E,yrBf-NR", 13166],
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
  utx(sc, CX, 252, 'PLATANUS HACK 26 · CARACAS', 16, '#ffffff');
  sc.pressTxt = utx(sc, CX, 286, 'PRESIONA START', 30, '#ffffff');
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  utx(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f');
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) utx(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22, '#ffffff');
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    ui(sc, sc.add.image(x, 452, f.key, 4).setOrigin(0.5, 1).setScale(8 / 3).setDepth(3000));
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
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 4).setOrigin(0.5, 1).setScale(8 / 3).setDepth(3000));
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
