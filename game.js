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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb9`sO%[ypiy<g@o4'Y'i!-l6nDUUW?hs}S3*}V:g=Vwt%>>Qp(.UP,]K^bjKg #@.-u,C:tb*42$u!-- *VC -Sp)fk[HP?[Xt_4@t'vx]hck^{eo', =0WX1f FDuK3qIoyxqd#OQo^l&}J'DfpSx`iaJobEtrUb^${do$YlwOy^E]#te9K(H{5YgCk@%X3#MP`Ng#Jba9,ED'ZCUJvW*~I`lT?+Wopm*8Kw505iI+[RD}_|R&k!ES >Z~kb_+(6-ggac9[kLXHPa*q2jFYmDg2v1w$is1KwT<LUoQcQVi0ZR#Q<M@SaT+u*,k:w R2R(wYin?-0M]UJp bLheK=D(ET$,N|iq$<4*eS#xD0jW]JT^NS37?[JasE;2:_AS](F.KLp`E,M%ZK.*zJu9gIOAj9g>Se`iZ98s,s:DOhd{!-VQ1XH4s[yY![3TO5^Pg5qN'@=.9.8bhVu+Tnc800:XldTU5h`<jWTcuv  0##q`7snpcEGM-r_I(s'>Y;Tf;P0oXQeNR8PNb&tek (:ipM.|b)[Mu|*UGZ?_Tu&t:4g,!BaCRpry*i'X1bvQh8;&cU+w6nDb2=OcC2;LFgHa{?|$kzSTkrtfv(O;BnaF?+Mcj0Ld52Gzg]xjQIm?pb&CAuS@v~,la3iZ=39e1dw&K^,5NGR-x(IC$e%|rX]5FV#J#>GGf[lFkT[=FQ,fg-SnE(9oU~1VhYZ#sMz'#^3YnU>H[Xmu$kv30Tc.w_h.D7{g3G8{Vp{yO+O+nS0+(_OaJxo(#xgPwJmhU8?evO&Z,VW6)}irBdpc?5_E mvgg6!D;oFf^Jx-E&Mqi}21'- &8FrAGLhV2qJ P+J0[ZH!`i$6&757ZRKUk XT:<m41=<V7w8X#=;Rr).Ly@dz<SKXy>kaVP+:R^C}]Rv|#!]=I*HShW+'CZvh$8B!bX=R:<7Dt{5`(j4HXL5G=?`-6 #2c0)4(lIU.Ioe,DJ!](&v.'$s>]t6 A;<aoBZY4[K):Bveoib[(xotlL6P<Y<QB()wj=[Ck0+*w$&H[ !<?]ur#^AY3*:wXa9$#MVXW%M$v<ev}h1<5e%2Q#^d>Rx,x ci;&X-lY0';Cryu]UFl[)WWYFr~4aagACK7UbwzA^nRW6;C#s<mEP+-S,oOpt Kf)Ve-2j~cm0;]$&f8F;m@F^K:2uMF,tplpW-Vt; d0k!6A=x@p 9pim)onFEsG)S#FKCGr!ij;^Wie;E%~dNlCdZ+IkdqnkyzEOOq1#JGcp_nns.nW&mtv_%iXehC;R+^d{zeP`ntccKKT=+m]LF=3{qvUSu9+*%InvU,Br*F ylse*mmWP`l5zwaTSuqVcT{9P4Jvd@,+]!)xO:'(Eq.b 3JXPMQPvxJq#o]<?3?,VpIs=r8N?6Bqs>e%V'Lxx52pyzh2u$GCI;1<J4+_-N8$J02p[VKby(=KtjdTAlKnu}Lx_9kF M#r7!Rw1V$0EsKKkWi=6|)+XYzG[T;S^e2Jy_fFwDBIWQH'c1m^joi;oI+2b{mEMJb#k-y,dL,hF9^`_'@9M]x'z<psiK]f<a2K+8F&z<ZSs'i4&fy?FY)(#l?;JOM*h1#fqb((BrJ<2#Vtg.L0=Ut3+u?Qk;(vng7op3vrK]lawk5]A!hZ5t@PN#s1d$&=c`v&*ZmHP#j)Q?@AHu-2')&a`)te?Lzp#jy*B%&V6x&F$6BaTRp(<FOjOVK=SG%|qMv$>._5u@2j7~Nrq~+?5R9ESyg3S,Tjb#F'32Iv_IhX,4%|Joy0pXQ`79tjW;%oE32QPO)3gKpA+ zIU2l<Xw.q^`$dqr+E8LpHN+[lhMW%h;$R h,-SF :G'_ww=O'*iD}v`-al.W*CJ,#SyQk,B9K904MHZN0Q.U+]n GLoZE_OF+M}AjcU_RFd4Icjf[2xFee}:#7f,Ri-J2egzI#i)SRV(JbHew77JEz$pW85ev*$&xuh<-%|f|1mmc-e,B'flV#FcJs8Dqu#Ua<!rEks<40a{p?:-;-9Fl9]a0Y^6~AwJ6BL1e=6rio`8#[e)z6Usb`0*7 )UA5 Mc$RN=KeiM$l?:INX#*LojVPhV,sgj+ x}N1mr*f%X]@(Fm8:~IU+f*>v3X2Fr7Xl%H>5tFuh#;rjwvK{R*{-cQwCG:[^19N3C Gp=:=2L(%DGo0S67aG6,o KWTr3O.Q7lugR@!lOuf{q>wa6*?2Zl(cYro!6kQs{8}aB0R=?;S][$ud` 2q$Iazo5% 5L`  0^<;u,vyA68@U#g=1|M'Jy%RO+(;?a,]m,,nYS8IwsUWTvl%6m5dE@t]lbER-1%N8KP's?QN$~@C3p^(E&G.Mk_A-d5`7Smd2uh.=6E2,<>5OLU?Dg>%8]1> dOFL|#t4_Z(i^UPK}9am<ZTyjnh*( Ud2^ASM6o)BN]Xd$Pu*&o-CFC8uYG<fZ4'%OYr>ha5R<~Z93K77g603.yy(gx],;dII>z?Xp@vd1]K9Np),C%XTCqytAi  oxQ9Q]Vr{cqXB?ycv#iD#oe1?$:1O{07v[U|%.0P^I <DGRs5q<3G=*YZ6aT-Cx(Qhr8Sd-wM6CG1<g'aw+ZypXNp T-.#CK,6*sfTQy]{qAcFrA,CG^ta0  LjB!a!1m6JS?_93;%x]YjuWzY'`#R-,gj$. +nDwP& x|c`FH[v9qP*U7s+-xMK?pTz,*&mT)d|f#,|+.1Vi[^V:&0Jh`<Bwt!R9_-+07d*Pi8V[6_l^!7x=ml[W` {Q0NgzwhY*L0Jwe'_Q.*hQ^4>(F,z]KqE)r$vJx]Uk5V2a}CF(g-5O_idV28});@v_cf?KIE:^X%k&r8wy^OM L81W%1e[TG:$N%t(' ${Y?:E]2uR)fEYYCiy{9b?rNUx=4NjPw~>6MAKhl7::q*6kA^HkS]kN!Z?Xj:f^EY.^+>qS!WY Z!m _I2Oa|yzmkLR6;EMeKk,s)62y<z,Y.1+aKX6{UhtO|bsgDo1LD^G(fe}^'gy$J.Q0JM1E<i]P={;B_w3)KS-?,Y2U{`{-Qx7w*.INvSZuxnL-sU~+mHZl[FHcAYPna{<1J9{:>OOjQ3cNS$sk:!*!HPEyZB6Cz.d@=(JNI%I;oQv>Psr_Q1O>Mm?XF4bydY5$!d=Hvem29dn6Y!wr7-@V}i^8eEOxm'fTX1$Jzg(qaf1n3C0c@3QEN;O8>HXFNU=bf'5sAKXA-7?v!b*_ib%,?L4&f)jc9*6usB2>F8sbP-U.zwOMbtOzJk,(l1HM[y2,-x)Jq7xV}OZ%|ZFC(bjy)K}&f$6bT(7rpp;0&4AQ'%fs,,Vt~K2g^*elvbWk;>&GS6?0|1!>siz8zwe`=Ou_b]ii9H$XF;hjL=}wV+Ky]@&YA$Kx R#!_>78x!ykf-dz9X%H_jp:i3;l+[NA?j od1Icw:GVr#0HJNI4s$v-[- ,%*Wb_Vfb!9aqC)fQw9%#sRMAUD{[!5VA7vLQp.DnT=&TLU=+y4%Xo)0R)Jzc4+Gf8WRXd]^)|mt^&>X+115Az{+>zzY3#p<j6nPM|ndSw+PB1vP<dqFX3MmqXm,X;_)C:Ct@-J|Zj6)YEPvpuz)D#|$3i=nfb_7$GoP Kc&gcS >w2C*:UPO$PYc+-6g;^7P,ut[>hmP>-CLpgf)0l*n3]hKC1uh}j<J-]}r.3z:5u5zw:*IuPGdu;++v4QI1+ggg{V?JvafEgVXdUH,];Ze[*P uWmgnyHdH?q9U?2S{C`@!HXN@&p5 1;?q)z@]-[Rf=<)r#ih(!9Fqa;);_Cuo$N<a 3omZ[_F6JN4 GAq(ez]Hh5VwC(_rmMT>2&8m1tI7cIekFICk30fI^,1D-vws!&Hlk2%:2G?26#Nf'g;1b,-F$owAbTptJXN,E X:.RsnNNAt}QRf+8lINwC<?dq?<hl9C=t+a>NOvqL+-Hh8(9|C0*e,F;sQ;YM v,V0JQO+z05&rZnYbrD:Wi<#k<F$wctn8S~O-9kQ7'=rps8 nGheM,n`p++JS'4!}1>:~f[TfvFy*9oXYgXuuUw*8!0C1ydZD!yvG Sy <QKv`IiurK hP2hnf04'ET,tKEPjw3#pSu_%GgRty{4>1yo!`flUB$.f5q!-C6W&+};G1i+:yrYgm6tTv;&ma&$e1*TJOGF`5[x!%!*?RUb0.402dWI@0})}3dj;;a&NX{<Xz&v}vX=+%+N4x_Bpd[I#C}3Mw_hnlVTMWyy|t<A_AFp$V(dNO5287eOp ]7T9:=pm',Fd9FlAAUP>H,OHK%?[NNJoE1wzhxtw<wsUPo8?kheou)LJ*W6.=B)S5OcQvvP Z!z{:],U3&r?i]VNfU0z_wo!){Vq>9mm&,25UYMpbMvv9?EC^@}NQN,&h35S13,wdpd&{aH:b,bsJhv&ymN<]6$b@#bJi8IB&{PW@Dn%hZK,B3~h96Q$JNg?P.-Btb@@)-.BCuN0+Hm^x7u$(42N*w:OfRX8{B0+rmd,gxk,f:'k(W?:*vhP|S-;#X>9^'96u{(Ec*l,79^*_P-9L+h<)XRf3^%@+HLm%FgWHr Z$OjDn%v*utcVhKY)!&9QfYyNB1$hxRY7N2Y?|i*Wzb[b}0Wax0v|!m4vL3J<cFpGzFz=qg=eWSx3FY<;tzTB,F5!I6rG?aO)X3o],S##P1JQr)VEpXkw12q^mGwooR7L~n,wUT%9Tz@-*RpqMUPfI1RX?TV:v<5KPawhZY};%0|ny1fkv,#=Z_Lr_GPXbCy KtA.z.n_;e02|lJ-Gyb @DKT~P[-dGcKjrD@4h9N}W<,tml< g^TS-olot&pMMjx'@[Vz`Igl#1<Ed)`}.c>GK5=;$hoM7ef~)Lm^C{W?WEsRSSb$q9Lrz`1GZVMI@P(L0'#Yio_t6)A0cAbx(]^>knHrKe.sSmw.#a(oKAMi+{rHuah>VEklQ&L5yxUD3cPVexj>8KnjT8&``B=n{PRKy!nv_Bb-T7KGI`rBd:MkqZNVUW0],KY*1(!Z]UU8SdMIouPnF_cQ(p+l+wn&qQG0WR,C^|gj{,c$T9mS1'>x3XDy>Ve[.8^@rB+efj(RD3tXHjchtQ9h ^A71%Fj-$7Ob;hWhwr(x>l*t'<gvY8BRc-V;R6O'x-b&ttq3^S[vuJ1U<c!faw{!].QywT=Yd<V^VRuDD$U*o@,!vMoxjt!T*!Z1:vIyF)9=12V@EUzTJ(N4Iqb,Apy:0ZaPDLN'd>%2w>^1|lLDgL7Ei7~MUMZ0b02>3IB;Bh~Ib-Ufy4ybyHfLk.B7_(*Dc*>ZNm-ks)hUHQ.R26V@~#3d9lw]}jqq0'][g-cM#FXWtx4t*$,^g*) e9zjBjHeZ'VrIH-JAmM$&Rx4a+h<?MX-e=t<NE,?+MzFWguHH{R..4EevOBVz2a6_t-Z1piK)l}Z{#}43`$+'d.t%`w@m,Q.TCn;D?4J-cl]jWdn^9GdG:[DMNZO#AwVmm%Mer@+jRuj4,n'pd#jrj:LJU)(s5~0eW{=tkTEE,#qtYs$I-V6C[%q#,A`]:`qj00kuFCzS`!eI([@*m&_Z3Zt$kA<-B[Dj(21gZ%cu]d E*={rsTo8=.x*c>$A'Mg![DQ&=?XhtF&{jQ6|Txo sqShNQ+7`,O08=Qo.5X'.tB!(o0tGV@l:+_-w(M$KS#Rch5tT$yPKEMu^H_<B$VS'g[!5qWxz<yX6x:H? ;~YZD,q)hw'aa!fik#%GJd$g<|Me[!X'Raz{62tI#Be-;MbE%s,{p4Mf#Y]5K6+P=bDhh,R>=>2i'5rEDq]NCyOoK''p{N9Y_HphugJ@iT]*%^x)-{1q&;7XYX&TdNBN4qjgDl_e5::K7N$u>gdR#bXx?9jLri3qQ&)lmKWbn@7!xqfxLeG7tM[ F[OteKp@A`fk4STFCbI#;'g6Ae-rFj-G t&#UCi^!q1,q{BaacTW=s7| 5DlD8&!feSGiG_3FRp1d#7Kj]yrXq^$EX?aMh2@<9d*lI$9lTgyr%HS`h0K4?lel$6z _@0y9vXq] `rRZCFV    !XR5TOIaCV8:", 4903],
"sprites": ["Qi$G*mP;Ys    F|;-R)   0    Ew8=    vk:zNR  '#OB?>`8 c&7T]=wPTL8,cG>sFjdSfVYnz-4V#>^6ZFv*IiM.fGxYRvP c:Y0,ypizu|!?)<c92lo%P%hXRF<R[3N~^' +m2     PR*5xNV&!`ONR NLt0*!q7!_l2]C])k%BGd2=MK6qwrl#su6Jue:[zXoDS_76jq.N|$svrPv8Q7cZ{&z[@9h<@,'z;[jYe(H)6hSJ5UmvK+u5rUxSq=4YnPHrFfL~qpdzsUy6[wmkeL4Z(i..X6 L[(**sQqmo(*o54yz[ReyC6GBuzc=u4vGl6A.X=kt5*xF%J+qM?0!Mt-^y-1dU7m(?1wmzo,T=XR|')g&Nw,2!u6t !Ep,ICvTa#75-7_JtR1IaU~fCP*-pXX-%!&#M[%DAfvJ[m<:B@C'J''+qkjeB>w)< otZ*GBjk]0pqZ+MXoO+q`e-+(=X![C]![&HXkxObr,U$HNSLRR[RXOm%vI{M(TB;A'|&4E^.):Y#`(8=&hzb&zj8*@bSk[0=TwZ:ULqztO@B#(H3s#.?p 66J1H5F_VG1z-PLSl6ReH<%4tKUcrj7]W.4$ p$*Yto^Hh$G0c_eXj+x;A`T16TdbCr('s:4VDq-Sx(E*Qi76g~hT)T0iHD]K&Yka5iV[MK+Fl;jrkI)u^rJ@:=&QWmB~rL%<uouyFw>DBe7pq[c-'Z6_$E0#AK7vXtx(z9VYMIXNM]X|ov%RzU)_9>HUxGcIjwDiL~6HBQn$r}1dSI8nw+eo4_*t4YNlutw@,hze1-Q>& I.Nj %=MwUygNdzm(q5GR1uJ(I!k7 b_I*E{-vo_y05P^pU(f?vOW(*},,6:WyxV3Q.RuN7_'FR1!D 2NY'w!7jh!=`6Gj*[^FS?`B@t_j2two1k> %# LH0f+'y+N!@U8&WG$[$3;-%8se:'B(bU]T+YtY_4g;z 7x|(3;}Y)Kp'`lkRZ.IEWr# uOw<:zWOd$`XT!tCIkBY=zXGwFU[hDJYbBec#u8O=;TG-''jJk+:}XITHj0j3ZQI n7Ymdnarx&NDNu_NfLa;Q#Ge4vXv3Msdf]R_dj-sfF'5:|Wtr1F-&3<}t%>RB:NrO]prqXJ{S?oo2ImLx@Ka6]z$A|tOL1Q3<p;5m=wAQRV,<%(MB#<K?zLxMhZ -MQ]h=03=>*4$}6-C;o%,,K@ng4sv>SFkR3gj;1ri2Pl.Z{b?t>)U{D%qz9Zn%KGn,W%lbiy#`Vsy+3^,$WJw'P;pZEQs_',Ki+(w&r>sQ,O<F`Rzd82C6#PUz@J3X5:(p*d6[tsznlO2@77jNl[Hhv9{][oXfmK{8E6bm-B*GI-e~h`9XCS{bwptY3aN=%W!E=ID)x<&D'sr1.-c}b^Hv`8wM!ySEpv{%de&7BfGXRMX&3=ea?1PkuEyNhu`6E;LK&ePh7M'xV|{QK3[mI`m2`:Q7uMH;;UkMzQ 5=d#+;4bwE:CF,9Mz3u8`2o1f;Pi3_WnlQmDFsIHn_:C~Yu<KMS^dy<6r4X:]l#&7*^?=Dr-AFwGVN2v'e{ve?yXWqO[uoik6qH8Jt$9]_66U6{Z^3~2r^#G*_-3*O6?!UiWLYjAW6M83G8h?0 @3eb4b=uo9as?_OBNeW'is)H5S,efR<;P&*BM*SZBAT;=sZ|U9ePq=7vO1<uuw2&b%bZ+lt|8d[^v|8D]P4=8PvOj=!d9ywmtSS$c glR.pC1s<TSa=A{2,<Oi<lFdz.Jy T%iHjMVV; .BTqQ$|H'XtR]qh7Cl]>!,]lG+FkOYmq{-2JurkioIg2_h%B&L)xu4o-!e-Zx`$9}We<tG5YP8jx8[J[YL]Yl)uq_G*%O@C)Lt6<gvC{H*jJAN.IV8rn2zg?!eN%D6 6KgrrGw,cOy''Zm?9P{E_: }W7SVj!K0;VPsx%X>G&waHd,25GOf5?0_j2fbr1<Xc9]-3Vj}*cPe6jef-N?}yZPRd>!Dp{n,MTU5bt(:*x O#1qGYzAw{T{{2B>Qp{A0qnm%e?ll,dn-G5]4+crNQbm3sz0i+Lw?L@=GY;X_3k(Ko01.I8P3>V{Amm&%_cuu'0('gPpfDT Yi0&2ICV4wrW{S,za<S.ruiJxd^ded)$n&;(DMg#pr]DT<Om7Q7 WG:U]sbR=$@{I+ky)7v6oI{!mki`JU`TPN7nlV%{ JiNlhL3&l~q=;kC]YWkUgj?Db5sybLw8@LMUfjn+<Ug}`g0pz8j4*wEZ[ V^GI[Zle(#*]n;]WehDE!LOj1?Q}9ZuJX+ZiM<`U0d?.3?!5@0$Tg=Aqwuf!V`k1PGGa !de,?I11kM5CJ]-NbXbq5!Et#c!lGJg&3#eTtE&?7uYSDjWHccCICcFhBZ!])q9+lw)bg5U$+iq>r1;Qa-D_M<@^f'vyj=rh^+^v{XEr87j(tm)227&Y<;h5-E+KAmnC.YnWGEnW W$T yFK61K.5N{N(J%LQjT&i&FOrMux .m6}i{EI2E;j9$2py}_eo`cE)W 1qt-N?mSz&U61zRykp<]azIW_wXP@YZD6TejR&I6Pm3H[U>GSgDI]6-X,UJqKXIbhiQ#k)o z^m)7rLvv9X2vH}ZD]7_][z^8YMy-7E[QdFG19j>!PdOL-~rRC9fIKfw}g)6E@yb):_6bP5th3d$9{}Y4-9P^q}Bd_9i''J@K^6@L*#2c.[h~<a5CuZy;{yjC6Kb,!B2sT,tw$+7.{}B`*,&*8g;taW{BhS#*;'Q;0b ^#FdMd+X1J*{-+-DU!a _uYG,L0n]+`Ft9`M@leH;{B) QP>3mm^o6vJEDouKxRY#S^kiZQOu{ry_LW8nnpQq4oKVF3#e0<?}ouK%A[?MVt:Q_=NI>!Gbg*vN:Fo]!~PKO('1S74g NP$-bKt0gIe!B %1v-9N_Sr&BK.4:v+VVs0v:QN hwpp~5L-:&UpTnn5gCFFB5coU &Hhl'7)5Lmq$1Vc+Dke%`pu7J7~pipxfPY.K|@YwT?~olcX[4 vNPkvZ@Zy9EezuR5v)[?uxOmh`[2h5'oCTir{ 3IOWwpYX,iHO7WP{ED1`h+B>?W1.5V@H6CT8:{_0G*b0Q77cK-6:HK=t>P$aX8R,Hmh4> uWK3vL)w;9_u+ylUV{oMqTtK>R:%d?rve=e3+)x`95ldv`JG@T`,T'KJy5^$^mj,ihF,nUR&*o:8}{h,.^@g3WXas85)xXaBZH)xdye&hTB3(GY[{cNGwNPi7wcejiKJ+(RBpGt`k$6($Da>.. (9TXs_zz#;YLaBw'=$*2{uZIto%OxX81Wv{uJ3fvF+n2j'd(CJX3q!'i7_%mGFvj(mk:OyW;y(U]f^4_!szC++1Gm-!B{pNXbC(!ebg_sktT,Kn{:54ym!Io+WoN%n[*R}+<OSU#,$Y;!K)8nq;9ZDmbpz__%=lLw`e~ `3:htik6,ZiJ@ya!Y!?RoSG8f_zpWOIS~s=C'<J5`jX3f{KO*z<jh`!AU>BB(l{y;&sf2ktwFc$4h9Ylex18iZ8P~i=]J]?2gK5o_IFDuH|g3:j`O)?n% XI<Jn$wzl-RY<!w717GU0jXZThP<ttNF{21j9vZT8K`@bGCF7*%>]CQH)0**;-Xsd&_M^v)pdw,s`hN(T6X%Ka>4fHl a0c9A61^<s:[v Vh}bv=sM;fIcYTMGtvz_#rYO`9TixqBpq+0`jF2Q:hRkEk2!=k@itD9vave2NvU>7xKFmc1NXNDnJu,v^C%z!Kn+,*uA@yf_66.=I+m6@ss7w3Bf&IHk=j>Gxi5ExQ'0g6s21kqznh1F!zYix7Xs:6| 1GD=b`(lT&4h@Y,Ni{qTGhKz`({83 KyhNaNMvUPw+7Pm*,w|5ebeS6&,4Vc|zH(=N=0l{rsXwo89E)GDBNsi8o`OO;BhQ=[Qg?0i<@S$>-pv_sdGr@-biO]&5G%*Aa,i*G2Gr<vR2#Q>]b JSB+DKKwL+T'nqd@c{UwH-uexnXqo>GLa!g@cVKvuN~72=!<7CMu_jReEEiuRR1=[C*v@;%)w!Q?xkd`C%-`+Xk#~k|ujDI^Q1=A'evnnu`ESUh@J&)()EF%vxH!xOR:%^) xi~eq;T{*AhYX]E:vsMI7>.8#Z`!j@[- m3.KK6p)!pZJv]V@ t;'3$2sU-2l-.DG!m&*(f+gZ5exV`SgZ7CBGU{whoQ'<y*}1OE#(_8RabBH,3U=HQYTl[pncJ.7hWQBQD.(hmQE)!sZQ,bE;zGjzk]pfY^NrC^yCc@Z`A'XF5c=f(Rt`bc^cuR1tr{*gK[X`ux:5:*IdD9anRXXpbDO.~bfLYP'hk`7p adh.ZxWPdE5$us^=daTkl:x:PyO:-oQVPlU}wQy48v SV}q@dh[qi6%w2>c37RwxGaw(aVR{YZNNdVJ)6Y'{g5+,J#=Qpw]qw-]7RfCUn+rEki&d]1ds`3!V&d CsZ&lP$?9Chy7^t<DwYXWpwq^_Wa`^G8v9MF *wpf^TTzs^GmJ1UI6-y$4u&PW 4{r( (T62pyE``z?;z@Ay;&xM`Qx'H `CMZ20oeoH{d}dTfK#e$IlIb;h:p4!QbzBB!vSq1X*nPGPJ v+gsOCPs=P}A}HxqXVA1Ky|$dsj@Zq}rxvWD<Qo#(k^o &C5-7IjKMhvi8jH.^[qau)A9aJRT%<+_RJw&X(v}v[&ZWT)8]&:~)-(.yn8;iuT7g&NiBGJw 0nL)3!&$D1-o@mB.>p^N{px2&]V<uV,sdHFbV,*nSD4B(##_,y8Mrn-v>[=Z%3WUc!7BMuB>qctj5 :yTvOZ~Vty9o5MC?(p2:!f8ozBN7^NTuk=BK?wEN)Y|qCCpH9@Dm|NI0Lvv(`hDfln`>K()HMz,aU`WN@bEbv$0s#TAQhSx2q@Y;6j[=5w#H2 18H^x).<7d#fSq0FGHY '{&;69Q=E#wQy0c9<Db)bkz{w+x_+#}B31CZ!O:;9Q^DjmWrf,'*ZP9;>xQfKSXES]EeA-E2X[w3[M%3~dZfLXB'P+<%lYM+]AHjYRWj^w%r>.f^P#f#Vh(9%&:6bq*QP#fgHdVei3U,Tu4VasI&P9uj*ImS(.`1D1R<@Ge%,e>q+qNQHoTg4v|j`ri(iohrEgFNbMkp(A6&Cu8%rh3ZOiR8m9~wV5%$Q`R n90KGUaVR^6!UB[22p.yp;)f0.=P4STZf6@P-S4@B6waAOZL)afT 1wUt#BJ KL?L#3p!2F(J!i*3q^_P#+Jb!MzT.f&e?Lg9RS$~:;sxw%#rljqOecP0y,VNZzk{2jv7Kz7@W!IWvu %4, +6X*!;*7u7WcR0.if{G%DJc>BJa1-0{D)NR,HZSv*Nl_zht+-;@?|k!]R!e'd$Dd,Tx>Y{lQ|9QVtR_VR5~z:s<u^c;R]T2zN)uJZiZvZ0^2@F{i7nr!paxa(?]886QFdg#t7af+J]c%kuDtdKtvvOI>|!+'7R<N)u0(~x8wYM.>ruj`|ifX[8;f(z+,E60+hj3vvha&5k@*:1Or9zkS}bnQ;{wj7yMc'DL{j;)Tn4.4b+m.2Vk:y7(C4K%&U)q%dHZdod}FrinVV!W{~c|{Q#:N-LQ8Wd`e0f0R$(jz+6vH6pmnJ.dsg%tx[Mf9NF9?*3,(fM=m`Ej.Tp0w15>>DH!4_#hybgv,T=8 ~&>K{YBnf6Bb-;6@i;{BmuO8hYC>OS?zq,yDTh(o55[[Of5>Z(YOX`x;M]P>(!Z>1i'j[F6j3H~aHvF#G_h=Hw*NAY*y7H9m]-9tZg%7vIF3td6@u{[0q^rS%rgrjYt*BM~_92WxKg|8;A&!:pXK:w(vDfs.4N;jIAOK,U{{G<h33e#{oUX,V$%P_:UOD#':={m6ga5G8?Xq(y(s0P3f|Ze#xj|T|klE,;`fUfkyY*oxl)]vQHI@9GZp{P&Y&4M5Z-[DSCMgaUit:L;VWwjI0wd'z8Kw+em);!D<(G<I@g~&oo[)W3'dEVx@Q^zHuy?5NA~M9iLCo]4]wNe?|noP,B!Y3env|oqGYaaLlbP9T) '_D$  ,)ljp5tSw)k8Wz+C7zUXC<r7((U4Eo`|!e'VS_F$z4*cr=&d{>0{KOS my-y1-D[w^`Mm~QR6H1IG;6E7|WtKrvKqX:R(').sy?Bq+2%0c`g4R E;4YtoEphGZ6F)1@`;q]Kw*]+&ISwx;1gyVp{xU;;[XNasz3&WP{(_RBi^5M_]B5Z0RUeU^8MUQ2R+1te'NCxZfMR7%X{VF g;[H{If7>3r+R3!9ySYj%J{.EPqKN5&5hb6CJ@f,tV6LQDB[biJ%z_GYX)G0F.F%5>WgMN[@9t%%#iY4u,qu&Rc=4xL>dD*_bJ($NtS%A2m=g+PAMNh!qyDVOajwUQs]nG2{Gq'Di?7-Qy}TJv`id{-&~uONM9-hhcC&6w.$,4$GGzj8u=y5}6[nm=%f_v&?{u67;'T8y=7F'&7t#Q;LIT)p)_Id,hOxeZIo%teSTND1 jZ26'[T6,%4R#iz#-;3;zFnlc?3Z5|z4L<oDy9h<0Z.?f*ezTzSSYy5Lr?yd{U5Z#AfO#A9tyjT*d:a_JHP0J&DjtL-F!_kT1sF+hRR98.^ky:,$Dbo3B!EO5>B:+{zMXHi;xn-9phhPknuSuGxzHU |M?je165+2Z0ie`M6o`qTWf89I,%J_x#VDkX8xgUgw3ivXSjp5:IZ5&Q8S22d*$!=yiIz62GV_C4>oR6%p8K_$CgrauyjT&9S*~Wsx~u09U&b.OHXwoBm-|O^eyHr!#e~x4QV^sqxcPtiu^!N=G]m+w3e,@[s6+9v;e)4!T.Nc0#.twQ?@oPhCXw5=1ui@rW.*kjDx&(UYKulSNkB[4U`2H-P20%#b%4(dF01,]EEgFvUCPAv:H;+@ylXmQ(Ba#D&AvvHBHF}buk o2,~<U<sJ19dqKNrd5Dg#I*_My*Uf*IVj#v mVLB%-zFze[F)BKIu>L7o))c(J!BwQRe!v^B%vtm+HK2zZm~K`@x2a7c%riT[#HbzfKn-l( HtiX$y.2<kv6+i(vW[[D[RIbI$%;Y.cl5&oMsgr@$KIjvQ|#Mj2Z2 BJuY]bqk1+.jIOro6#1OoA,rKhP=zS!*q7-i^n{L*|2{N#<13cBtzh]Z3:x#CFKA06)~ HEfp#mWi-.UgZ@1h5KZNK&UbLF92+JDq<X^*c,WM&{m{y(8sNV>$ i'|!d5a#]!zp$`Ok=5BLGjhO8<'Z&j{D{+ND{nRWM*#v<HSmG|I~#QY2*yw82zH83EJKd%#!(W80-uP.(JZ!-jdFNcXP7@5s^>ZK!(Vuz?^qtd?b7zjRY{&w&irp9N!N-|{{bFJjok(^N~!&'5jHIx[8D^Iy)rP)A+O[pbqm#]!4`c$A>w:{g[*w<]-` nYYQ1=#+1>!^B#C.W01-S t x.{+bDHv84(y:TO8=]SFBzH c[bUQ]qj8GRdSTS9f47K(M,e9cL '8q=)!eTM:DXkPD?KfH:Y={0`-y#9->3f+g3%lnbX#8!<GW-7f>=R Y S*F>w(9#T&hSl4BnIG_VfoGZmcF-so)D_NW#`0{k@Gf{&>1no PMU`wE,6J!GZ|-nYon_*j _YgL6Rd$U6vvnsfXkl[Mh%F5_+'k}HMf?fO!MV67&sM%YPdZS{&XZ9PmfONviJM=$scI3*F%QNAm>=y,#8V+PI@{*s0wdS~*HzFs#1L%y:9dxaP+iJqz5%+Md4y.rvX(>UX0(Z[GFCqDC*+SiXVZfvo3DcjOcuffECH5Ul*`{dGlW 9Akw'&_p]&}#Dq1#Je*uBP75M,8%][QH{iv%38&Q~h=P#gnAhO:Fc&<.p^8$6u3O}c*+!zn>=g28-5gBT!gy:Q@X~(0RR@DafWrIGPb;@H!oWTJi-5.9ICb%2(N3O+6@aEG,uvZRHNImR2lUvtk=}=urO*o6EQ,pBU'_utaKgp|&Y=}Z0yQ^EQ!P-D!Pf-qgKM5gJdPmktlbfM:O9.0Ci#xyE_1CFE|..k0Abw!yeO_4(Ea(E!f{,f!IAxU00eU^<x0JL?8M;IfE,-1k(v>@g>LfT.V(kM{.UvzkfNVI%XYI:#G`^#V6z,}tEdgVqw4i^fjp9x,i3;Ak P$L~>1)UQ%zr^oIWN>SlH)*YnuQUYSx:zrQ:g0pU^=_Ac7z$)n@Ld2qn{)CCBfLWDzVLo@f7TnFJ$l[NphB2bXK:{JiN&LaB0M`#>^Aiy)JGa.BYRJc4Lj^rvI;pC9E@-zQnhDY-WJFCtVjUd5aFj}-D7rdVd7LH`yTy{TafL~@zB=&4d~FFLHFq$G9 1'^*W1H*ESM8=g+8(x*u8S2TG*U.K9.Hu&exNP{UPJ3v%oi&.y:d=Dmfez 6YJ1s,X?ZV`#MMI6{v](7iUn-y'TwPnPW`)q Q U{Jerb&uWIOfD!oOJj5He `tT0TA!_^# #4[!tHf+z+FCe+H;5WP);#9]I$N^P&XGow%h ((mS4f^;Bm(l8eR8l=_P#hbZy5t([&i??`8m T9EN}PArQbd6B{ cbgq<$JEUY`C4eJPP##vYXm1YkA!yYI.Aw$y4~%]1dsbmemiE ?XenRH9[*@uwhh'=@K8V*kJqyVR$q_^[?U6qpu9+:!tM7Uf_V@2.&W9[WJy+TEkKKlerYXfFu42 29lfae!%h,(W%?*2#AcdCACs !)ApHg.u>*Y#AB|X;L2C*^,ns&6K'RrpOq]65-Q<.[nwiHvl7p78GyUw|X=nP*q1,xwEw9={b)+'l$C=,c<N;3~tf?]5H%rNM@O*~22nc<RZ@<$>0_-yQuJrazx2 J.C=z@A;n6(,T%G0SjX=ILWQdF1zkYNZv]ONps_ItLK 7*LhEh+uh}t*Tze1c&Z(]CU )8E]i7z4chY:1|VQ^)Zj]G)mP+zo*dvz!hcEBK`oty,-J$ NElfN]|{JLv@[,7R#'gA}O72!_l_eo& ~Vf ht|F2N#@aTQF}g7LUo*Z5e^l F7KE[=K0=]j1hJDTPcRf@gfP29d{-Y8eua%f$-_o^F, (Anya2+6pey?>jB*(sW=wa-DYTV[,VyeHo1:y#czOSHXOn&.OX?@ir'nG@ROl~MvlO`Hf*K 7uq1baMN`0hH`5hpzqgqcC(MlqlW:Q4ONvl;?ERf9SYW:QTr)7U:bf=tadKo|!j}HSyBj*`I5#e-R_;6XoL4nMoN7rhQBz@zukzvoXa9{fSUVuVSdZBRYn+wW&(WX.?~gzoQ_4^:@UqVijNI{oyhYPk'Hjf*{*vGslpUL(fUkZvullejeDQMND+ePQ)L!B8hN1bvtYaUz`sPND7q)g]g6S,5:9mCNxbmNLVH)stpa^I@X[0z=R(t'w>-],s&<~egHXrwvi`QUfp r|{MG$GMHz&$uVs%tn'Rwq_vIF?)vVi-%1qW4.0a7CR*'3+4T7aw&OBZT6uMw3c{@#,~C)t*>zu7zd]j$KbX6_eYe*XSSq j M2y^f6&sY]-0B%de:0juM0KEw8uP_n5$!l;oe;_qX2<+yt`5d^.u,6$i@Cdi;)u<XB?8H^!I<3th4?ehrl{&S!C{bMMCJ>XUyL:U4!c>A5jbp,RhJFn-kVV%`:8%BhESTzU]XNN&*K70eJt&j?C,dDRO)sOk{o{_qFM0+4jN3 -3@j8B'otbygBdGVV@gFWN`&28}Go9+QXk.v$7f[ #BK>wtiO_BxfheJ=vk;hh~4>NP8Seg23`t#%.+%n9uON,<X;oVJk)rjj0)UJzs81'i>Z{Sjb<|?gP?`^nCJ!<GlkJcR 5>2ZSE-R<4u+MH<rT Kgfy(wCW|$CN[!yu2@ Lvq_umU`j.52EWK%|C4>%P7wE-WQVsW.1w8aa'jX*T:6@nNNk2(XaZ,0<fp',rv05GH?wC'vA+%XfhX09yyM{]Er-u wio4E]H5L2I`v[AxeC+w^SI+bsR:0_QG:{0iyXC}#GNff?Qz]C#T$<AOr-y*#9rZ>k`4iU]Gp]%A&s{h-,tDx2`ihKFI)tAjT+gKe7-B98_*9F%D*NiNGEYl)+v~6csnOVv~n_W|h5.kT$q6.k`qsBf~b 7efC;D#7h+NQE{5LNYCU(y{CCHI2WQ0YE1ozjeFxvvDZNQsGp`U)Ibc;PRN~>]{-U,&P7t>mVT=;P?=gv-LVpF%Cx}H~wlvCLg?a ci>QBc7LkRtkG?w@Zul2N>`Ki+hP#MM5,1Z-iNgQ%vr4S+*f'_k!Ud+k]uRb4p.]in&*kLzXZV= ]^3*pitI8Ywj(iVs[?U5aLzn|K3exk3{:!o:m!p ,2Rx|)h'Bv_X{GVt46(O+No)^I',,qKO09(NR0QY:NVX>y=@l;=p}fs2Zy0O3c<#-h!yHzfac>P 7?q(]#B6;v 62v-&X(IsS?9CGA-TyZaca8KPQNpelh]%*j}Mq1!TepojZ#4t}'$Tpq`KS([__mgOxgq6vAw!q^;@Rb<[lHuqdvD0z(l%S|#-Gujy9xSz`?AeT*vf,`6li+ItU^LTIQhpU`] *Edo,FEtH6T3z{H]:J+UA5KEKc4*U{Tg#,qoN[*+IxL%+ Cbp6vk:dE1SKok2aAx55fl)SI.9pD+yv-Zv)8Jo4k3-yCEG.n{X6eBeu}V`EA<vTXU$d{I`s`5Tc.e3=%AvJWadtW.H2'n(?5d#<CXnPG7$,fHhx6;Y^LW5;vY^Hcvx;u=alU5Nx6Qop9%gy6zZ`C<SsW.#O(fXLTSp-+ccy_2V7cDDsFBk&7JBE1Qh7Vd)Y.g'x%LF HK5J8 CP%CQ<)<#1>)N7yu %G^$$0,`ORvaV ^W<)T;4~)Bb<+@CvQM<T6i3H-*AV5hXV |#g>ApgD@Ehp`2c0,Yj3@<S>m=i&&1)Foz4{v4'qsTF@ xmq}_%&|-b5WP1r`,m7p-<EEE8 *5d]iWSnE] ;'.V$K08vAt~eosOHcYd:vyD0t$R=oZV)( 9$~R?{dX9kW2a=J%>(??@dm<2FjMXi[n8ah5--%C$X:s}clCv'u?dYHHtJ6dqB{8h0f!(kHa.4c2OTzlJpjr)`1K! -_KmYc%bNMG: bvIFYeD?OCy4758 U]LWN,WWjX9GJn20vVaIn%AsA-B.z3I-KkP}n(8(aOwT3,{'?F()t5ixFXbfVf6YN>F kDe|(cSF3N&V?g_4JBYyhN ws$4@g8[>@QLd=f{|ZGPk>=A~S7YiZJMn4MZ'adwvu+@f${ xGdQ}@9Nm0~IgH`ROs;Eh'l$}&.eX1un>kq9OL8,A;JGt`;AUp!1OASd0OKn7Jd*;_.#9Cbj(`0y5?l%WAbZ=``ba;Nwk_0`64@gc!>dtcR=Og]]e>vB,]B3Q5%lI@<H3Hi EoRGp]c@-uE*Q[Dq''wdwv)$7wqb]MtA=zBjcn?`n>0ONkwAb9K+,!1yUf8D)(ivAVIM@R:kZ$n;d>Nhjp@pLXd@D=f{348v>DDOu&& tCI+Jui)@:*=02wB^1O?WK _[j:yY$T!0pI*OIMNNOz`;?ndWj%'mn+)>(u3JAO+a<'ym.F6eq';-Te!O%cNB;i_r('3-zGnN-&kF_'s12V(sgreJQveDC:=v+9vOd')) Z52{Wz[HZKgq*W ED6h ~Z#_z9|%Q2F[L=D7bq+grO`bo GqjS[1~i;[}3i2d^`EM]J^H&M=Uz]^UhGl>9T{:zF:N:vG3v}`sN9`85Vo:VB2[5MNV@WueI?+,b_KFnkk`sU&}N0oS:pmg#%`NHRx<;?^_w(I]Ym3kd`N2n>%:ND!F,E:a#A)S3|za@[P7v<*`dHd&@zRZzFpwZ)2![v7Qh+{Z,?2DgVK=[ILiZ~OIH{)S5-(9yHN#H^Hsw!,)U~Ph8q%sF7=wRlO'#2,My9?.rm_?-(Esk5aPSeOZV$bI+szJ@62>u#Mg2<WDc*]Bs{yNoL&1vqDfeZcRQ$]}IGV,C<z&vP5*%EyCAKh&Hc)J!&Q[,1[ 2z0$T`s>`Cau'mY%^HVFDU*-2s2a`J5NA=vNn3ZmF#ZtX2R3WdwjXn^{Z{ERI%O`k5BL%Dqh*Ac:IpnKa(3rU^1!vw0vXcn-@Iq(ow#@'u%vB8+wL(j7raQN^zb@dfL@]s]@!yavF%q{OgK4Ag].?VA5^P3es.G4_SdYO7<p2){Ni$7CU`.fI[?o7xE&dj07 EHdA$j|OGKOLlu2?|ll)K2E_8yGsJ.$m>#yi`.zNjcg(?y;b?*iLo3?^xssi=7h!:f.h`wsh<Z6[WaNV)ENQ7QGbEcud{+n)1KbPYH}9<MOvt?H)q]Ghq!7d?<&m{K(6Z#..M!w(cqJ8P 4-<+uR.<fv&].CDu2y-!WDl6wE-=zH1,14K`1?EaXqgva43gECQ=w^-d-D|0vVI5#S!Orm=Qlq9PPO6W6Qc8Kw#HPO!8p)=h1@w^i{`O3a|$f6xFba93)Cm!<-(bjbCI!DB'wgsgzEM;HI} 6=x:T_E2;p>V(NzcV9:w F&px,V9e?d@~.81FvTkzXf(K&DjU8efM#H$AI6R!Y*x@f.pc5<NcoX^fO3GUMpw[E_T{l_>V&zcMjN- 65&CzX,}.?'$h^*8;Fu3__r{0XzUCIokdrUnR[=%ViW;,Phf9O;NTpX8#x>2>#_|{AFA3P*W'[@^D@3O)j3*nX. b(P+o%JME5Z^+'Nrqn[*?Pr$uq;sDWU]rMg?2^M' 7zcIOk*{g83;cxgHs-rO^z3Zo(D*fk7ufcRAv([&NY$w)^Zj)#'NIM(G%dHg<RjM#[ rknF^8I:{Jn.>R6$V6NQ'$pq!a43*$Y&pu29P>K#88OH%PX@%6r{8.@U=>8l'EpIexDJ*u=fWDP7r:orm|!9rIkFP${`C^t1vbh7Ms2PxQMG!}'xsB,5wTM,eYaU1xS[VEYucsJ!wRuiJ5M8h=VC^DFVS1=l1)ZyH)sJWW%%LU;?rq==S7>*$DjWSqOvI$S?V3B FwM$V<A19&{)WW@:@gzA1]7qre.2L}LjCJ)ey<Mn,i'f[__LO1oO?-%:977_k1&OygyYuP-l&rgtBw 8f~07Oo:vmn3T_=&%k53aGPuke3lFMOu2Cd8q?1`E I)UHbz%Oqnh^oL!^p,Y6L(V_EoU#!O5XUz{:x9kCrYF7A:w&]6pm9 47ckHcV6ppVt3:7?@)G&%*`GH)R'X#L%c?_{z4EPQjtN5c20$mr0g)Io+4FQ-hhFc:XErp^Nvaz_$o<]^7P6=Af9q&=^0*)(i{8`&6HZ?6dz+NWuh.G-D-ARyi'Z?@:*Aitdb@(!X>sI&<iPn@99euA!,-x+?DQByenu-InG1k4mqJc;:T![oR`N'EIp6wVUr6YXRTxS>OPPb]&=J%}0w^-|!U8]+XNn^9R03YtMY,hTLzNAXrsK1w5s4_-*4D|w9Y~E}!~K 8e3}YjM^0HLvI_PxH[5GmK%*BgjG;HCbG!L;ZX,7JNUBzUY_i~O;#N!#-0p^G>%`+8,J$El$;flv 0XFz?C?n4x=,'chHC7@&uv38l%YtI(>'7k=aW5+yWq?kU^3*c&wn2?c+lLvGRTWDku)*>nte'$?>3@k#w!ACPqyZ7cN=K!!D4$!j{,k!BCZ>' 'hXg=6 el_f<VbF Ul<_PtV%uf%w+!CM+sdZe#[W%KZ#78s1F#X6K'~YoWf^s[Mk$,NI!-YdS`t6]Z_ 1c%T=uBl v12.!=u4-, f[r9So27~KkKn@6 5LZ6rxmQC{EwX+E1&&-3!hP%8z5[0G>mmTqXo( :8#NnXy:l>fI5GtU?0H{nF;cBrzW4Vn$bzj8&b8Q=wq#%3#~k[)PBAiZe9(IM-`'y.^~VsW%+uJEhg@@!nmiU#uP+bk$jou Lp M8gr?<R)xrf3Pn1(8KTjzLryv1Aan)>]J(HvwgzPrq,&d@yW$Q<qQ$9,<%AE9<.;Q<<+NpzJA{mBhg_)0Lq.DUK!1qB,o)TV46s;TO$m|rU4.[uCDq%n+IJvn'BJ83&VU!=-?DbPT^6zN6D_#QB_kwW0lBN+|I2A&3E!9L@ZVDVYT(_';=TM-R{txMr@,QI-oQv!C6 ITy=Utv`ddPR!;Y.17wHj0.[rH:j3lls[bF;,o@!U}K jVMg^hUU)IiAhf_v:,>15i$P7oe>VA6%G&^)f61JUMgpO&?tGK.IF5>Psa+YV])UyOTiMw=0%[7WlLdO>2y5z,0Q@ApX_zdc1]eOZv0K;^m}r;nXC U1>(r+{6VTDR:Kf#gFJaf0! iGz0.|V9[|{{`wx'UrFs7i-sU4?w`|bK,(_rx$833K8+2{Kg+CoD!^ekyV*fJZy=u6Dw8KysB5HiO8vr&^w=ezk;@YIjwcf$r{)O7`wQ#rts&GLAn,g&f$yAw}[v',$UUi     l:*hicC2k,-", 11538],
};
// Mapa de sprites.png (ver tools/pixel-pack.sh): [x, y, w, h]
var PK = { ch: [0, 0, 32, 32], ref: [192, 0, 32, 32], tank: [0, 320, 22, 28], tobo1: [22, 320, 16, 16], tobo2: [38, 320, 16, 16], globo: [54, 320, 8, 10], burst: [62, 320, 24, 24], logo: [0, 348, 128, 65] };
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

// Recorta sprites.png (ver PK): una textura por personaje (6 cuadros de 32x32), el arbitro, la utileria, los globos y el logo.
function cutSprites(sc) {
  var im = sc.textures.get('sprites').getSourceImage(), r;
  for (r = 0; r < 10; r++) cutTex(sc, im, FACES[r].key, PK.ch[0], PK.ch[1] + r * 32, 32, 32, 6);
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
    b.setFrame(sk.f).setFlipX(flip).setScale(S * 4.5 * fxp.sx, S * 4.5 * fxp.sy).setRotation(flip ? -fxp.rot : fxp.rot).setPosition(mRound(X + fxp.dx), mRound(Y + fxp.dy)).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.chg ? [-30, -95, 0.7 + 0.5 * p.charge / T.chargeMax] : sk.f === 3 && sc.throwT[i] > 0.2 ? [-40, -90, 0.7] : null);
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
    ui(sc, sc.add.image(x, 452, f.key, 4).setOrigin(0.5, 1).setScale(3).setDepth(3000));
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
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 4).setOrigin(0.5, 1).setScale(3).setDepth(3000));
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
