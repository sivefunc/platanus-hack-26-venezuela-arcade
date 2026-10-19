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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb9`sp+5ypix-s[^wOMz;`4*=(CJ!FC7;qH#VyV:g?W2l2:F-O7H(a,]AZ;7Vs #?|-u,C:tb*42$u!-- *VC 1?dogr8WR#lpD#2le :>AbGETU'-( :B'cUyT0`jtAqiTFZ@N+V3iest{%E($mKfl3Ehw'pWXKIrQ1Ht&|9UF%JZoSk`Xf ]& ^6^(y[gviF>v<V+uLomi258m+@&7rJD[Z57jiTxww=AEq^%xOl6j-g7#2x 7W) j&OV7E_Z3@~trRTI_7N0n(E#0Fx'EEq+?H:*P6}sg$#3cptg0eD;.)lMvt5t*z]L>YorFNdhaw20N7B<SIuWCk0a)bT=OvenqF{]Glsd+P~RQt*R0r4ekPC(o$53v4iCjZPHHs<_8zEt~3f0}{~Bt,tBiz.5RpP2]LO l^E $%SDs]`Q_lCH`$lVEHrA]e^q-[H[2Uf+N#Jlp;IeR9>Y>!ua{a&p{L567%1FGW @vEqhs)# !$NO<.w=!z[!}6C9T>a?%7Bkc`ii2HhQJ!L.w{BoR,.ey5#cM1jR$LEA!oo`qDe`A:PT)[*Wp*jE+#d;d,!-cCM3<+5qXfvd,bdX?-b^}j~Q{pnY^{irFJAB`]G;@ARJa?#hZuQo}rB_Dm.rPfmW4Z_LDOX?f17%p(cURTuhlw1`bbrg1vnE=9U.VmOng5h]nZD`Hc:m:=Zw'rh%>(&pp^ZX}sXHF5d?'1VX6zN:<pr[e4*3qx<S+_6j#J|%5@;o'V1$6cMCK7f{Ik C-nda1S0Rnm.@Lg{pUn*K.H&i6Po +kS,CyXeX45t7*vB#nhWv+bWa<.QG^eG=Ia^m%'gtkL#k'0(T9u2e,IZ~6kw?:+M(76CLI1tPe?f>HDfPLLYzlHdEf1;0%R`)boX# sA7vvS0xS$JM]ciE?-cft0V['{p{CGDmR<gi]e[]v@+%'z(DQvsx~Z{k%@,iLLj18v4-,Nl^Nrn,Lh7G!B[^1(p-Ts9L->+Z]$_,-{kEVnKr3>^UjqEG6X.Y(Se>b!m^PRMMuT54 3nH+U i'CJH1!F$C>wcy*{U9r|>oJ%cRei^3.l_6Ygv=jJu}m`f0&.{DJLh9fx#)&_vn;*%!1RVQ26R?$! Gw1LT)?A;?1.VuuRVSp:P q*{+|!L^04*I$J;DX4 67g8eMLWG,$t)up8I7T5g[t[C>qq_At[7}`c&X?a!L<~x_Y2np'~H1U|8r58.pnDqnt@y6ntV=ueQj@#yGB_gesll$y[Bpa}Hwo`7ztE*rPWX$U,L^0^b@JO,UFpyem7pA&EXn6ce<uf9UJau+?,qC2BmT7MsNyph<pZ4n=4oo+a_Jg kU;eu@N+MK[c5E5&_Q.0Lr-Nv.M L@EZ,AP9RD.Q&g&?-*-`rm5D*:s$9Zkz2DuUZ8f6F26vXkL.bl&,+!5<SoPGyH@#fHBEmY#dU>BZ7Xw'VSkZovAwCfD>d$n,i~h>U,-3$:--hb2s5%1FXye=D?c>q*7dEsn=GL_@Fk5Q?MQ;>lyvXjKvAlI<_Mfn5I@y%}y+ltg-onZw.Bw*zY` _ylABEUk*1F~BrBj`q=Xjt@;LIc^]XDG7@#w]%V]]*$4OdRr7NoAGTi]^I2Py^f_OoLVBUj]BrNNdeXKaLv;Yt883v%}A[MixnDd (1ixEu6(_NB`={N+ cOYsf;:JT9;[zz3%@[-@s+Y#]$lfJKw^Rm  : #n)KYG?|IQeC*#2j1-qJs>@yD^xqqYYDLrsR*cH$wRUV.mz;PX];8'+!Ab&^CCy3!J%B,]tt{5,XDAhMh!auw UfTL,XN*8'MKh9m0j.ubj,L(J]Ic`rXaY;Hr;CzT%.* ,>l|,.>g$RQD@ gEnb?qE7&N3Vod6`E.:3Te6~c&&gW`VSGui1ZqcbjFyd)E^m26.nez=hk0%NvFMqXIXB(?!]mdEx,t#4i&3r+g_R_Kla$X*u1kVXu8MO%5kFNK5JmnE-NsHD?@(JDh7tr{m o%&bg%&R-dbUDqty{Xh*u3dv=02${?j6*NZ(0Liw`DVLAru'H1,++-g<r}cky|]H&,oEy2F8^W)jlz''(5T} .ej))8mB33F-HcxJVxra:#{3CsL6*WM{51N:_<Vff*SmzHy[!>Gy7ldH9B&<Lok>BjeN$]rDKt#S<YCDR) ;e(_LfLS9NZw W+YJ=*PXR&VpTu)?=;](VPNT=f*'4KIU:?i4=d5{HXC0b(u<(- 1ddl N&Ul)&gHT$$;X1bi*>'&sc#Ncc46jTae}TJ1-#rS_Eb.noiCJ1 pMGS|!oyZ.!K;2tmlxTU;OCCTf+]hiXkF&q!Lq@aVM]+,qoX{dO:(0pE8G(!=PyK6NXe4q{JmXHMW5zQ`!-|Z5VK;1*zh7X_tJP<04?@NROVGefT?RwBXMEhIgO=)6<XkG8fFH!KMSM^Y&L=UYG]GkF7:y!q'J:7;VqQV1HB[]A@Y2@)8v,zXta#1eU)NBU64}BxH2Wo]^7b{-^fZSfpHv&>F2I.;*2F(MX[a| O3cMS<`:>y>`4ift,Au2sPSr{A}+{guSF[dBB8GDv%M5siSWBK7#&@xxSS%S~i:,vy+6fQ.]k;)+fBr,RY>w&XmoqT--@I3,6>_[lFja.0gw[.}9Py:5;;60tnwS- 2l>`{,;hWU0+ w|J*4Ai<Ybg9FG>%I$>#7zi6B>=f:eSHg_5gz4WWZ'q7i$2a(=kZU>E|Z$!a=t@d[{#wZt%LU`<{#lER 7,;xra{RBIqiPqgVQQeLtx?'+Q`Sl0z#y gjDDiUT.:LO$81RT+L6FK!aT.oDvpU1]-<yUR.wkJ[ygcIdk`NV3x6+bND.jvoifRa^ms.@>J!:%^M%@f,7aWW%F2F>4 ,=!236B_fy_BVqC 9g&['+$~#1QO(vr`-);_{Br@e_<N;O6unp),YdF2OK:uO9LUVIH-qmO8h9>:zF>~hKm#M~FdRM#h7[5JJxM2&-7{Y1hKAvc?me72ZCrdCC$2v$pD3W:2#q_a`?OEA#ig+snGc{TRQ*4VXkjaDe*nsU)puy-1S#lfiA?|&op(by=-AiYfphv=bzJFW^n*H4Od&|E} 3Hh`%uh34(F8)Fy0G5)$P7F2z=%=4-VNQ(2<4^Wel'zmhNE.YroAkK^p#&~@v7}HQv[Rbcze`';.9>~n*D9'!W1]%Y:SxNMp.-Q>L08-DzT[g9<`@1) s6GZv=LQ`,7H'e}S%yroLg'c}BCO.jF;!JNvl2dB>L)3NU@r Q?5N&ecA@<poBm1Tck{XosNdx?6D<n$d.:#;<s{a*}v>s[&FT5J q(G!wF::`P)[I^J*#-Xn`M.N+|g)ajeBz)p{nftOL$UT8X5,jqfe&$>QOmCAMME2Cear5:> vTRuH}z8=N-)4S%BJ)PX1 AOvVuF{VikEFRgzpW.')E-X,ZSI^P20KqFv0KBMf&^lghD ZXIm7&fu9AEB#4<9m,.{[N~MtW<lxNaQj!6+elA'@X>';EB@1#5c!j{6*bNxGi1.Nd_F,R~.SPnA^c;S]KI,ro][8DxE=J6.^cxF,:z:0tvNG0Lwb:C#)mAk+C2k@_`FA2ib+s;K,OG>hBl{>@4L8kooAp79Q6ZD](3d%P5NqA!&hN|::>v3R;3,k$@Nyt)U<n8b `}.?%I4nX!0V-nad30u_BO>?`o'5UF0-yAZo5#cC74>z.]mrX|R^jhoVYm^'ND-WdNl+xK'r499dp63E,Gm12TIGC>)h7SkUdY]R>UoM8AwUGiLU]bw]t%g[$@rc#Kx2Bon?4B{#)X_?k&&pO7j@$(_'05<!1Vst5&]llVL_w=9nCXqx%h3;;V;8tdTGk#&m,Y9C6|MZ9H8YQPnOI'lr`D`K)d{'[6(M:8N}$TJO;nU&ZGVj&cJ))%))]U>2KI4dgh&D&mA$&hJ8tXC2Q@*,!k%DC+.5+hfRK(n)=aUodkx{?gv@CIK__e4*2t'5{L4o4Bp_#d0~C)Vw%Uq$9itdT97&q_?=QP)%KY>,C0%b'U{CIK3|#l2faFO=g8pYY$h=R6d_z(v@P?T7hY.~n!-@OzWQxVDGhj 75L*Ny3+Jv.3822K2zbFE)=7^eZF QAJlZ]agQD?ctD?B]%c;M:hzLtkDfk9wQQ>dQKq79WcZ>gx)=4ofW;]f*1^x$P9z:22GHOQH;1BTVEw=-iRS'#YtlPH?LSmYr?$[xa=nChV,2vE+(D9<u6Ry(?3@4}._qUON6'=e5S^_eE-*:S{h1}:dDG8?u$&qDersiF3P[*+;e&[&ACFLT3[>PhiksT=X2U[odMwNFu-V0`K0](-MI`[X0,pw[x'5{L1>7&'8,o'~Dj.zSQckE3uR?6d[5>2QNp-G6p,rE:kc`6:z{|o}{IHx@j>$]xNPeT4LwAPaZb,+lQSt*<2i&5.0YO>NZGR%a#qigA({2T 'rvJ:Z(Os8ZRXPC[fp?:sPlSO'Ol(j8U>`WVdEU^p-nJ&w3my>~gIXDJR2XJ3-_ezM+J[&NUp<}1u9{KN@I$_w ]Ryn%;cDpW+QuvtuOZ6)Jdd*r,^w{,[x?jV_Im+HC$xYC2R+5O)y;6W2,78?$_eE-@ dVLkH>~m0S1fE[!M{0wPTLaNqw1tA4kD!+R*_{J?d4?Vr{=ae>so,T3Pb@f<pl*zr;+OynR*u4sR`jLxE,iXCXam5Nc]@ OWC+_F((:t_cX3SF,g7JXYS<DLGvCGW8|3SgGPLG)qBtPX6UJ%V.A7O,Y0A.24Yj%JXc~.N4Qd|q{H;i$Af!*`rVjB `g+xxc{ske6|A7q)8]V6,w6n;@2pU-&u3`ly38D)8j* N -Cj}hS5O9Q'Ow(ga:l?fxZ0Awi1&aA]8PVu!_&DAj GE`qHNk$.20fH3yF5FI-fsFGpumFPEwAVnJ6T Uk?RdmqH-$kn6FBbu(P1Qq^~T=:]k9C6E+B<ZVHesy3jMDeXnbFaDa;drAnIE*#v@[>8Q&gI]?H,N4lZFz<7+:;9L|#>R^jk#kQn-GjenZmaZtj56+_`y7b'070cEGMD;C$)s7phc7BVy)K[w.JQeV=6&qb!3iTQOJ1]Gm=t(48Wg2*@]|0N-oG#(Q_@,oGgXpFBR}*Aw%y0+oNlVpb&nwfRk|9H!J!8:Nlf'{)S6J-CbH>z2VS`)*b]LlROg=@]=kMsh:!W0LEU3_ag?z'.K+?!ZvJ34O$x ){;o=+1sGWjr&p8zj-~q#Aq+{8+)e)CTw7_O[dOTB+MG:38i.Kfnx^=mQ7PyD#L)!WstzfJ#}yC&&%OtpwMb-g^Vz`T'Bw>TZiFU'&hTlC0#B]MIaT:[CX=haNv*Ew[YG3+-R7S;csOF(<s;!@(>2 49pMb4<Bg<<Y*l7n$)N'Zl^:B5[K*+4r1&C7|A,V@s6OIr>73osHmLACW #v:_Xj 'CM+y]M}Da%s@l_^#dCSiA#p&]9}G.W[PaUK,dEjxjU=iH*5?(b]:T <#+E@(ie8g^w!8)wuIu[WvFXW?4GusCkE)1b<17T>t9&$6$uZ{9#7!jVC-3nm8F:4!@+-2@#aiy'N'9lk)u{+zm>lJLrb00jZsrwnoq6n:*M&$3rTANwc&Mr7{y`^qNtu,g$~&'zH1L-'G@L~,=;8NmF}[Cg+1@P9xQd=HI5p_6!-yPA9e%vzh7)uORhl_kJ)'qd=GLH2^&=UuOp1%rYHl[9xK|tk8_ynf6I=S1SY9:3hlk]C$U'r#0;-i4p=;q48)u^q7IWJ7:_P1zFoyHX[_#,=:m7.)EDFgOM$hTZzr-B%D^ldi1QZGo!L&agADqswy) A5<, L3y,=|vjwmHx4g'affUggZ^a#P!'e#!B{2s4[(+AH~A HQ5&ZZgo.y=j'9G6x8w]4Tjy`q8eJsF$q2Y#6(I2dl(-I@884A@|pfN'_(7v4TPWzaG_h~][OB-fhj>UYegz0[5>WUI%uPgo$+Q?x79Vt&Wz$qJXM>b]HIRD$x2bvDIKe3y&SC5{z4H(1}g>xkeW_tch2?Y3L{2zF2!.n=[YJ3l$BBZPKs{,Y}[3i)8U@Z   !-u]-<%P2,>", 4899],
"sprites": ["Qi$G*mP;Ys    F|;-R)   1NR  IF8=   $ZPD9pw  &8OB?>`8 c%dIJ@cPTTZ+^G)fnip{;QhWb-4<Rg8AGi2#l K.|22k}]LX0{OI~zR8W3N5QtCTE3?[e_gR0EpRc    ch-o[g&^5%EN  h2[:9a]i5$E&sXBsYe,|oWAdYUptpe_p>8M>c(IWJ+$EC.kgy='[vMj]`0POOtBpe4dc`p%YBX^T,tGhHYO-6nG<I'm8)BN,L))w{,*d3sw$5W<nC&3q(e?S:HP$Acufuwb_hcLJj@3Aw_9jFPAk`N5&x@e~v@=#K;KohXoFy+h%cZ>:.;o3N*5[?m#V&s4t4yIF!@hL1j:O.,=]a@m>byApIVgW76mt4*TeWvA&9:MFM'OYy-PsZ_lDqh*?v}CwuQSD4dB@1gQSo$Q, F1.xfRU()-<c(G Poqeni(QLw1KTio=bc2~EF>8JOW&Q(2X0Jsv-?4!<L_Ut|<.^PPx`nZx=]m:3m16+'.he@:KH;p33gyEO@Fxk~Oq.oi,.y$H[1lbhkmU^!gKt)GYSyJ{;f#du0_x%0w[2XO`9!cIA_jK)Z*i<8JUio?W_+AbC!D__CBnjubks#4}^(%d x$u1X8u'R4);@iDoC)G,s#18ankWYB@qrAUI'E3l'm$#G:?7-sv%Y5vB]^dC{&t2|AJ9>Q5h}r!'&Z_OT5}w ADCGJKIWN}be>kpe97>jC7tjB>fT4zZR^9K:?F3oBiD2q[_-WDK!bU'WP&)(1k?9ai3vV<B0{%tm!mAR*whP4L4T-i[fG:Wfn thMP2p[.Byqe{jL'0CS3vBA4yO>{)G.i?zh5[P!n+,^9m2^ATlA*6ly@vfKr.C<?--7QG*>^t].qLRw4IFyR5yMmfz5Hru?^R~aiRQ7+?hXSo49|9=JLcL_X9]9b$Ng;(&zj!80ou&Fa:F*&bwDMgc#&gl=:aGX^=1tu8L34uZdZfZ(@F+k{uSM9Ph=0z(hroacuM@l[q0KOgVR|pXK'L6JG&?4%1h'xl}MtIY=W#<[j:#cWTj4g4v:NtN2S615[Kx[O=1pR_1-;3:N`(j[>'|^8p`9kl}ra,r9p'<q]!{1&6ZNpB=b]?oDe1jk2_LE^?M,(26?@vqmlRwj(icj6+:tkpBtY]!L6J-Dm&l]+f&Q8*G G^YZ5AI8q_Ib]0UI#)l1*bC&_LXzN(G2MbqV1S219+Ba1EITN$y6Ev&iWUJt0Z2K>6eke4AP!BnlJk71!XeD:a~i-C!pqwz)5A@UA z>nG?1u{$TbhvJ+ghC[H-F $>NHQvER^^_@@(5m7+MPwQcgX=CbBe{(TMWh5bl}zuk0)Ak,mey$N1{dod%`yxsP#&ql]-V%(~vIN.d~r-+GhTK2Y@E5e(W3b#dzk!'1qi32{X[lMa@sY?{d:iBpv0+~i~KJ:?#iGqeFyt)bYOzZEW+=LWPFB_vra NEDxc|F$kY5^d{Fmv(hMdYez[LM>j;{~HH@.zoH_mubyX:k>R4Ng)7Y;C=MiTNyB8fJ)]7u2L|ulLU$6Me@Fuyv-ol:N;k>Q,,z]@Fe]6fg&eVlwpJ8qk1<IdTh}=-G)Y5D(X*.yFB])z&3`FG,bFTjmc^pje*iF@GHqC:q}tA3DSf'J##)8CJcP6,+>`cz_ <l1K3[<K_xGfJ(.+V2La@R5T]$*Q]9@i!DkR~(64<j{)V(m)q'7`_eq6v Vq0xW#bl)rE#j!pm~=Om:7+;[exbT;Q3XTV8Gs~6s8r$.h$,8zX>S^7i^-JFa$0WbmY9S Lq|R[KsSjq2E*M|fg2orMr1VwiEiO^$w]1#ftnX?I0ZB_7=_{z55*R`oEy'zvNZ:)x~_(3T{Pn4i6hlz9GFC^)t)e0@>vR(A)Qih*mR*X<Y@S $+~A1-8Du&`+T4%9?U9%vD`&Cukm;hKj2IDwIFSpgAKP fv@f8+(*B8 pwbX[U h70tE=Qu!C,vO{swf(v^O4vU,8-(oUjbzxaQMpZvPlA.cVW0WpqW3 KF54iWl0]*#NF?d!ZJ_(;=J7),Z<]8UN2w4)#!C0FBB%:ho+c,#?Kb_zPa2(sU+19CI5Boq'BOB}1KsiDduqyI1mV@61;j-LE)R&^KU-6hX&p.maFc2<.C_CcjJh.slboVCw08>WM:5-O}#bTNI<*n[7,sO>`=*El~jy%ppU`'JN]RjAh2j{+dY`<tb72?W!XZ)`TP^l%U0I&''*girj902]v43$l(%;qvxxO3z[rr1 GaL,fw(q2TJG`Mf3[|UF#-!Oe:wS.s*],3=3urz*&AgTZHoBD0rDB5xA@o&.YRn*nR_00:<Yx1>9q*MCV''3 UH'dA$G9Ey%^Jr;=Q7%?vSlV=lx]=q}LJJtdnXEvUN|O|ShU:4mw(ITh2_|k,T.N+sS?15Rt#!3y `A_bu_]BMzvQhYHu7zA4`Y^(PX&%Qsao7)QpE2Sh2 yvX,vrMISCqh9s2u9:69@1+F&Ee,JETfAo)1k%AKTkt#Ms;EOd,-#Y3~v-r=C(qw>{O_6cGNA*W@9Bxvz1zBXCVn$$j4IV_r9Fmr<,6Py'ga(fR'TuPOD#l{xUpqN``IH<pr+jNsMvhP`A*kuqiW=R1!AQgC?!K%=x_TFqag*l{3#P=7obbtYg't3f6_<A^P*DMutra}2P'0ix*[N{wgSP,GGjn]c*FCnIwgS$wuq7NjnNK Gr^gMvk>3g=,*NS8tr@cuAeE`sY n<mWQ&rvO?cWeJ)P!{($& !(eq6PJXt?Ge%g<|_0ux9Kwc*.=tp!J?S#Xa0JH,:^JciSO+<aoBax]CNk+9cnH~p.>|'_hAWAJPduV_#(dfNhLbi;GS0H6xozeJ@RmgX}9DF%+.V'qYv1]3?jt=ggPQXh2y]Ai<LKzC@&nt_Rts1bfdHi;xJJH?%tTENiv^X+(AC)GfiOCvSjMtiyN;ijoGgzGiRoqs5@z;{<*jry3,_}>ls-ha(vhoBQk@!)wqANw [XJ>>GqG#cx#[!g~>[>yqTcV_0)3wIT?S!b:?n&Cb8G v;{|r<8.C:qQ87Mo8ckQ=$'E<5tMx9k,sFkE75SoK{3EFBzKkdoH5jBvk|_ayToxh4{P@nZGco5@T|*d5dmrdtG0P-AdzNjc;@_|_>tQ0TiBY,ZB*xl WVh#:bS-ij*>V>]8V2?BR%%9kOtB]X_^P)t(4eXStOVcjaID%dV;s_Vs=UL4 py(Q,3K&dt4KsHiLls|T>y;Dmj&QM`UW^CuX~'y?-5!1o(_L1&A-dbj+&'eekh#;-)VI^'|Jt,~(<HX0=YHJRg .UrHR9OL?!sWndw{O)6xD}IBPKCFCRj39bq4-)'b9p xp=s(8X rSZ#1 hqF4Q!(lb3{4E%),N<sn= ww)6VyN7)ei1wcx@;a<0AFP6y^SaUu(e]ko<t-<6'.d]%8Q@[Pn*G_[jw>L,z LxCMs?AL~vr{Q8V)^KJqL@[B~Qp?$(HvD.0Tq8e'd0rVs;jk;2Z^$H8.p{9:~ch!eu;o{uQ6sXlBF`#bW$ALC!<M+-Q<YnjIcgjD+6bs*g8uQ5 )e+2>zMHi2sJ<B#xyMVbHaNj0I)P8PzVKaSo2~)yZQCO:%K<6>G-L0#!S=zU[u;>dR0rTtB^L.'UH]czB>c~mRXd+]`l&d;?o[VE88`bAm@;.+KH15D->PWE#%NuA5c)N}wDrtG4fTq Z0>(,RceVtjX+Mt#$t_a`5GHQ:QO,$eMI[63.K#28cO_TQa%-8Tox>Yp!V.2(.G1,);bi'-UMY?l@S+(+|fMQ@QFP+Kg6tq1K?d%2)a.KgRt$g%_H0,9!nE#t<PrOBT&f}2_Nz5O 02sCG%~Cqw#%y %PT%aj3TRYar$FBNvkPq!tx8tZh)&'x0WEhB;*mn}<<]l7*r_%'ep$@TN)L]Kw|8B^2v(z.2s6u>5ba-fTP0@; JQ-8z7lCRxgh5hCLcWlW#9]SJ_nTq|h-X,%e?<aPm`t-[)<5%|zm&FA9V|7^x]CV,Wt]h]OW.A->'(!7!Ycskdu]TU7WE-fs0>O%Avyw7cQzw%_;'n99<x)}0rEc*0:Fli8iw2v&ZAN<R#RKw$WGqZ2cA13ch1Qz1o+)QKn_;'zht^VXiWhNTlZWdexwhQXP[p<i]?=T'=4MM^TvQyNsR_bvsY'[.kLeEmjWaGwHFL@h6!H?w=riP;gF>CGD:[j4oKppNxl@_I*zQ~heIkGqvp'#ZVk}ENy`%7j3]&^]gfIs,([C:Nz!yPF)r*@%TgJyRW[!t(43wq1XZfwY>eph9,H(:'`P_9IDo+T4ZbBUmbx9K}eQB**I&F#n-WidQlwZ%|NOfMM,Q`#K5S0hA-y-KhG8A}0LTzbOvkstWzY(iExUuIGDcVj;'&UnJp .NAx<;MqnOfGD2;+jj*y29V+Xd?kqN1*0wV7BPVEtl?;pLj!Q48a_k^'L;{UHVrGsiKDJu2Z*$1FbxE|$t_ZX&IvRMSWQFDuS9Y?QJ=pOoP.vEI{B!C+c&F 1:B5{OKfOCi7rEm5.r-s!Y`>$L?0JT;Kd(%6+!:y$fwTO0e(m2k]shnSTcu@ot&4yXxO%m>l2BYe]>O=:B)f7*x(^3-mMGulvlg.guShhbmRz?*W`s[<,kV[Pph&#Tyv~lg.kv7jGGjdB{SUch8gtaCt;#Q;Ma77&mC3xN%SbRVyp_$nH0sJ*S8zhZXx5QG9%LP6>s;*Ttea{N4`I^g*^qw&tq*VW(1;,hd0CG@lXuY1(Y2ditcrp$0Z_nw-7Z8t[.VU2[D=G>oTF?ejH1SEQ_[B*cDv%q(]MSC@[&mGp&OURZwFxsZQ5Lpm=d^po)ea'@SrasJifm~dlK,qkWa:>ac{'s_F;iH.b8sl[YMz1&v=Ur9J0y^Y,p}iGEoGz0k=2J|V@xA^fMb#K:a6h.y;w<rW>r]R+s(%T1<F[iku.'jo:eSQ56:r[?Oik(AuUoxGl5-XZ.}L[X5@B5OI8Omu)G>Qfx8E7,?f!zXsh;+>Q$55e:xHBJKQibRD+00h:$f#W=<Yq _3ez_at)`y*9*R{$Y)6K7wI3NcX+lUP>k!BSHm!ru`M($dDCE9K]{<(Q]u8)sFg#R$FaxTd#)BsH78LxE2ts-@QCbwz!;4!VO<cIboKfdZSwx 5[HoI:EfO2b&`t7cAt!hhg~Ohq.=g=|q+xwp.4x,{KCFl+#o^TVF+bH[~'JdVW%[M%Jzj@!v-W$NehbEPo1M%j3qxMgt'XtMR+3rZZ-YoTx]]<F8rUn@m*%ZAX(8:&AST2G [R!KL0$J@F%AURBKG 0VN-DJq{[KgKQa>9#Wd<:3A&YFp>[T8g)T&l^cb{,{p&42T=5E68n;t8_@BNlY.3e0CMo5`<WZrT5,qBLt !Wf{E9nk-ZN>ar4X k0X^1J:i{awSE%8y~ueRGsIjkjYc{s<nY;>?Vn2Wv3F;9o+j[o`!~`Bhw!4db!_#Q#0h~eq:a^&Z2owBS0|GXB{SZM.kzSLH*6tEQoR@H.<0A0#aX.1hfaIy}Z d7Avz0q9OhYywNyP#YPYMGq#yNrd{^.;^5+onh`L$vxGt@2Hmn$]KMqfYK3Z]H2ego8tYYmaF<;$e=eJJ0oXl?S&kcw7I^@o#R1?eQ9wxHU8Sv{e1=PR>hVt D,Kbp+[&K3w>5%R2Ez1GFR9o_'Y&v7+;zN01u--m?M?hor^{4K%m+aH)S$,Qs4(NN{q9lS@qFu?aKNszP#3!zW@u!4n#tvPA2RIu+C-k7df5nMVL_P(B>J?M_=UA~1I2@<`+tNxxSr=&ezx_P.zUMb}?eLsdyj$n~)q32R=0wc{AOHSKnIRUK4#BTe$bIoVYg,ZXloFGH$SY{j59Z!P 7Zy5@=$dbhd#y]acnuI<88u3qj%_:3>b{3y{Icx16Ze(PYwtr)mI7_2[vGhFq[yoZH!6BVgZkPmz$J:^wW+4$M(f<!d(W>yNSWCg]8jKTc?D?pdQdH{02<z-z?:Fk.!.9PAHLfH1B$ u&_|g(X7xCyJ`>!w@t>G>_Q3SH;H)jGu7K!iiH,7#=aZ]L%)nm Qgi83Gat'W9EFS0$R(`<yKMaL!6m.QD'F--!l5^[DE$i(gz#tI@XEJF%:VI'dg3$oIF8Hi{VdQ}UGVQg<,PrFC7Ct:&jdZw><{HG~e@l|rc'#A!fJ)|Wuh&5q(?.0Fr+T961@gP1V3$RC T;R,H9BW.QV ;f#>;[L9]b$P|(>DqTZHaHH{C7~_v!d>$r6KBB!$:'eF[+l$L$a`UP~fV`^lx%Xx`,A4aD%y!'e)R*!Nw3F<'{Q 4&zE.rW,>li[D[eQJjO<hnc;N$Bqs-BzJ[k3_?6glxehrqt'SdyZ^iR:s%t;&nO0GpJ0!g]:0!UMkK_pV2BB3@KXVQ^Vy7[jY=^TjDzS*U]d?vA fbbX&;h%)i5%2'82Qq7kY^Ma1Qxxm-CJ|ukhf,.#hh?3(cH:RO*5_id*V:jU%5BR$I*;yq>X3B(P[r|Hl3TIG9_0,VtTzrY4V9PMi`*s=az>)Pk(<s8sR)w .s)f>OZdsMuIt?4.b-1m<SO&v.pvYM;NlVNBTDxc: JoDD,C9x4l1gNp-jJ7flLIo7ipQ3]ha1-QO*bl]R7kU]}[,Bi.D0Fs21{pcr2b D1:BO$0i @>1^bcy3!RXiecD$EK9#X-{;kB)!? rO@^8TkI.5`9b$]LMlSa!-l1:.@L0N5NIqKP<C6TB8F2d>'iSu*:gYG&R`GY%@87{jT-z5qP*v7s'djC)kUDn[b6J>.%Y=1T?1V]@EwsPHE<lMop?Ooq7QAsTqDJfc@*3rRVyVNWM-$x)Skjw'a{H9$4L'4Jw<l{0PgMm08+n_xs2yE&e^G9`lu2E6;-ZH9KZO^V+&zDp82g=k>xHx-39{kwbbFlK@~Jy_5+':mg{VO2onMcsv14pCxpczxDqwNdIAD7$UngQ{NHGeZ_x(nHBoZH8iFo*j#pPn[^kZZYRY:8zDqG4.(9Iax5,s$p9%S3^O;+<Z;T71`u(dAm^:tw8F%rc_J(|g,z6yeWtC0vzM_RE2gLUuM>>:R,T$W[HV+PPu+$LvZZt:JaKP]={E%Sg`>qeA*jql6S;c$w1(sT]fqSNmPJH4g@%8GI(-cT^OGSI)_,~jcH{pXb@5BXCx=6QRBFzql+)3*f##JrY>V8Za 5aUtCU'?,F`-c*svQ%rV[0824+q=1>g#;*c2SPT2@oX~my5!+YcsT`f_q~f.A?:0Z mZw6@@&cmKawsrgjNh+NCKG.Mi]P;(O*U@]+x EB)(9.8(RM:!vX.%f=2g%B@_fU];S]#O-dK<8N  g*Ylk)b8ql<,1A v0]!MU2bS9U]oFy`x#hYNO)Qp%='Fu?^nQ?Qm2u)k[9?Wo5Y8d.H7*>7m&-v*i:$;Qvd~vFFTa4HJlF$oI7P>Q@'!!8.FM<B^H]3Hx.F,zK:zhvU;J}AbtO>(LYG1*EQsz-o`qQlLv)=gXMjmI0^^eHK?[gz[yUa^BQMgi,y+@'KQ@] coJ{qwymZ7^+0PvN%b(TMw wvF0t%[[5gEtq9=X#eU(ue >MGA|2.<Gca>R%%;]Z^MW3j:nn]wbpX<^+).bW!.dq?v=g&a;ShY0OInIewSAWkF8bb'tVdcfq`{Afj4v@8JFVm2]G?_tzbID`XC0dAHSwTY;(}eG4b83n3^_qV'mA+vpJ2C$j^(x0!i:2c7|mIY,5DJOsN?+S,M!({LfqnN,6x5+Uk)[o_>XKcEJ=uQLE]yJ)# =D=7pk5jnScboeMr0Bo=(tjI >lP'3u.&5W[FmAaBG~u'X,vbX~gI+w:&M;itC`j:)I4ac9z@JX@btOt`J@w 3eH}A~U=5>x`%0.rYO).<?vN509}wkIGmU+c:mAZfhLwSahm$38*H*ECOb0-diiFiUM909D53-SlV$3y^@^}rJ2^iEvd2BK*u,d+<pc<&EmrA8L iN]&NR>rO7z%kq<Ve77.Ao'%bk!cm9O<aQ9')M<#DK)xN:CVZn)H2t4HE|f.XS%Pj;.n:C)Z=,]'J=*`ljJ9R(j+dFAjHPhoBgX5Z,qf:pg3N>y'd311oCwd7cJzUO&#ay^VwTjj6#Ytbv;$_A%&SBbQCZ=<%QOxQAH=tk7k%.{;k?CzC8z1`A#g<(XLM7-q(-bLqcd9.~0,`5o7e<,[h'5* I{mX~P$ZcO9Fr0xYJLIw`k8&;pRs%X4:'A{&;v!>PF $f>5kqVz,:hz5E]P9{-| JC0mQ=PeK)FY&YL.0:es}(@pW]mhJ<`1;fevYbc00:hs#{>[cPbj1jHXBwK+}wu-nJ(sv7Y${l<| j^Q<ai|!On!l=%_)y@_+TXiY|$x~f<9jmz(tWr:|r_9P;-x:)u6~G4jh&ry]T~RZ$sa`qIX2NuGAB #^d_@`H,BqT0^G:Y7:;eIA_3mB$=*S]57(0`>klX@+6J@T)Y;g&W>WG1v2r,*Ryo]ym]4cHLNt2 {~) U Ib7]lhF^P0ir0UqPe1AZTf#;6wGI:)@ATLf*{Iq~5v&{e.U?$Pf]+BL^Pt$>9_@(LrmX:VS(!lIF(>]y-+N[jhyM91Y%n;hdDeH^G2rNlFFfO(S0)#6;gp^tsqG:3$8e _r1r>_NCQ!>PcL?Dzs$$JRT$9S*Ivv1&J 2ds7@nqijWaF|@`V}@o<?8lCzDFrfYi0F.84w%<>pw,vz QM&?hOUf1e?^lbe&BAfIMatl'&h*v%8=}0F>Lts8d =#>z[4F{F- v{ZP#6tq$3)~e_ZBu.<vUsu0pM]&Q1uVBBuZ#%dwX?Et?8C:yu05NR'[>*<MkdFAM5WXB_O's,yV[Pr}O:KCbO49xG6Dbz*AP~t2EPZdHY0Y.;2|iNJ[UDr0L;g}# 4%Z5W]X( SE$H~U)g==;RKdWvdh?,Zw$bQXL5Gch'>8rXHR1aBj)HB.b:6nF1IEXKgRY1V,wDfST7`fBO8L'u#.] `WLe3k57@=!P{7%z!]gm-S'jNqmzj+o71zMZW.['pw'L>4djI=7cYBY!o[bTsrA620`Id02l1Y(r**il?6Sja-lhB&E*BBGrAAO6hd *ph6Q7=X#iBLj)FL^VoZ4)jO.!lyOn]L):fkIHM'tZ_SHM[H.wZnt{T9L$##OK,5G{#NsLAc.)D`].<$*:s-qG8<dZT0^:[*Fb=2sQOV]x:WW*?YG8PEkoiW`;0$3|%X 6_qGC.gzIdRm}@Yq=cpU)% YtXAm-#55V4CNzZJvk]a3]d@_' o38RuaLdAL_L bVC(qn7{7lB#opyOv66_ilz[w'HO0wGUeEg1BADrN>oyk=$lrvcF1.7(VSahAutTAb;cebVV%VvcRCL18+K&oUC!MRAfqkAzR>|!b2k?vj`QbjJ77Do.r]NPbyUe@(JSH(VqEQ>>Z1@ru63KLnQ}C!bM'V,y5qgr?VMl8nOTDG{{SRKHLzr.z3G,z'g^60f~Ig'5(dB:jm,y< tri4-_'DjY1^2=[(hsw(<V][ES3KHd+8(w.8*]&OVi[ndPBH]vFO(O0,USR8@o4!Wp>}tgPjYAFq:-kfFp<mYDU%UB 3c70fX2a$y4Wi(7%){rz?;IlS;<#M@ww>+t^jf7J5&>u<m^FDuG=5k;`e5uCK6Pr4vzYGSQ.PYuisIZq_MPq_N7=}PvjL=?I}aVC~KV1L4)lw:;=K@M0W8OeB2;Y]0u43'wd-)h3 C^YmIKbpIEUZ.g3Z6s!.5l;un[4fPTse>fBp@j kkkiUDK78{uY=]{rH^``8bNl8[LX6SN%a:Rn.>],]:%u{Wt@pE]ta7[1ZE!(HZM+N6h)GRn w1ms|&6'A2<,| sm3dN[u<g7wBk=nwy+(F;b+ +]N>#3[H?z9WB;hjbE3=xj+_UbL%oCf1nADmuW]]O@-T}1[R[oj*50X79<iW+QQ'MO,XGKg>nAmu`U AQG+8PK|_}KAsr3B?rFy]obKtS,H)BteG7jiFYcSy6dN0%?OALIh1 ]Awzo5PY;w(r>1uzzae|A[SuH{IA+Ej_k X8'*tk=vqKR>A,^DT1C][(k6*AKbKD[SS,.ZuDa)Y72+)u5X2L$Xah pv$:hs@tO,UE%k(]a$GFaixoUZmyF.HU} ugD1qbUJ}-bZ4ATHXx-vlG~,R<!qj+u?*qN>M:OjB-;d++AbDU+R2qivw+zoas5uD;wgl+&LBG1*0qOq[1.'B4zJ@6ySR.IxFDr0$9,@OGWw(HoVfVMmzx85hY0cCr1@w?o1:`9#CT|D)!MqFjD;o8!EuT>jPzi41pOn}SMA|?8(9wh`g.Qx8W'5^e4lp&yKDzu[s(~3iV}?IS#OrC6J#avl(%mS}m4T?A|i{9u%klHh ;qHQBCIg'gLAoX,nUPD'x NXPd0DFu5!'KOhzdZp!guf6eMxR-Qv2&_oqwG(s[TDlD{c_8Wil<xE]|U6twhIQ[$}w{=!_D5YP5Y*L;[M:,WkWjZ~N`++vM]p_[@jA$,K'e[l<|jE%}M Y|ZdcxlLhL#KG&U!:7=W7 Q;qHI]gcg+23chF1>|$fQ{R!ir00+0kDUkg{HV*]8)XNzJvrjN!wALE&u(b<@kJ@+&m@ADB#{6FnOHJwR|LYu~YHFFK_{ut<HhxwI5pZMIR3ngeYBt_cE]#BQ4:[X9RQa~5+1j6+!.s_Ey*^L{tG5h{[RI8A6cTpy*Pysi&Jy7%(KlxP*SXRN=ZAv(j#?h>0Zn^C*PqsO=$Ih$e=9[Inp~81!^t8GbNI r,kpqiWLL_K#FZUw;=1pQ6:=Tk942awk5b?dou*Y?PO+QtW0&lMfvEZn;a6=U.uQBGe4$vIGV@jU(5L6 6RCkrP]jq`pp&HN<9,MwKu9,y't9{KwhwtD3Ii`$tan'N.smuUM*NA+Z-4&)B-CCa4$@,h$WoFUwqXSSVEHn_<{X[#Oil#s1<t0)%Tp`$HIq_X>[u-y2A~2ysZR_Qb;Ey|n1+@fu?}6bi{nVy,{`v;[xhe7IN~Aft}Tt.hTFC~S.=%w+hjFhZWx4Bx>s1ndZqaxs.Pm&KwBED-1.ic`*%E79:N0a10wriTKW#~0etT1i<kX237YME]@vF6#X<FsZUwQi9iAvDb faWcpuo0Sk72]te&IR*$Mh4ijcl%5`CnJ%{.{UCz)Ek;yeTj)5d->KQjH& X@o00Ac5#Xroxecuub,IKnBGkji?DYB}nlt87>b$nYQA{|Wa%-hH+zZK,F<VlENs?0g>`83}_},kM=$)3M2ZN[2lzt2DF.a;rA+`D&'d&^`Af6>}LbI~2~+$9JW# 48UpY%8(zgA3<]RJlrDliO{;T_.U{H*?*O9,5de'Ug6E9=+5@3@zTiRYiOGii^Qr@OUT[d]Rq174X%EKv>CX6Jen@#S`?&]'f_m!du+1.:iHYR.(}<~O7aor>OJ4M-`zk0lhp647OTr5(X*@#wdSHwYChT.kC`'8,TdxB-p DP9l1w'1ZFhYpq}{BetggQ>@3B%sZ+)WJq+aL88aw6*I5FT)(`};B!cTn7Inm{O(W+~LfAof'R2WhYWyPO!S=87q`rq|!I+37JRo[sH3l,D[:HNSc7k3]J#B!RY=n?~OM+8s5TJ649Tw;l4'M>)<{fnQXJ&E;4@eurN)Hn '<_R,dpqj o;-%'<Bx_xVZY4*VfB]6&kNscW1jb![{;{8wloR.[toF&)8U0(+xCoyhlh{.=V5zXJlxE^1>`Xfd(D!%y*qlET]|5C1_brL?[sV:3N0FD:Q}SQF[sN?44rfbQ~M?LsOtcnU6$D^dJXxeDb&GMIbMbU)msPLqd_g%3,lBrPogp<fV'a[z$U{DVjhb-`MZc4;n8Gl_m;ZN`s$^QxihwO$l^XvFJ:um2p0`M$8)T e?B_?-*CK~=RmlMSyg)^l=e,>)$U'r=z^^mDPGL!xl9y!WM&V$CqUbJ]9NyCe:k-jV5a`*{eMIN4LPH<hKvFcj7b`>N5]{PYZd8=v.d@Hl t)C^=4g`JuwB$e&A}=3Tod:V;sU_C'sF#r^K*GNf].['kA$!p5Ao:jq:9z_ZqcbMX{i(BdY<#v5h,4gBI;pBF1S6JOM7y<!WjxH5s{y-F:>CD9^+|[Y=j14)^Gxr_0}=U(l<sz^LpOp|$-Nt9p'3z+J`:=s;Efnk@vE<k<l:_d*Z(o1Lhjf`p0-ZBUp85dWNBp_UHPSV~%f9,czrv7PM9{Y|#;KKEYn:r3X9W#xwV'mE<sy`:?Og[q7#wOt-Z_61aF%H6D$bQ07 U$'9N:%QU5S7v3c3'DZ?!Z(6M<Z'=aHVcfs;#+;6FfXR~ldjF==@Dkg>k3mdFbY3dfrKYdW2#z@tE_;x-p!oLokzVn(inJcF748P'i8O)gOdjoRAtI{a3'#M[d;](&eLdjSW$U}BH'W1cWIdG?$3<[KF~2+r[Y@ims?<F@AZJeIqv7xrZ,cfbH?&`_ZAkgeKjRpG$HmRQI'_%eMTGvx+|#~(k9{IP[B1{{%04D+D=1N8bLy9v#7Qw%>NX:+Rw n-^^JX9mLH7'~AG3b@1.-DQ(|:(1J15&r?e=-UuG[nZp=dFU!@Ec4[Gg4^2QeiV;4I;9pNPcz+(_!.%U?A3BZIT'A409U8j-.T1JTou&[m?c5)+%7'{3V&MbqyWo_J4((tf(%:0q[c8>G4*MWW79f oms2BVA#MSN>cjed(Xt?u{.7;v{P-E32?8H]K^ %p<ctaEpGTF@3|8~({b?a7cET1Y3HtXxQt-w`yo^&f{&hyYPnalER-wDUf1<:bQ~+ahH_t4cyuwso:*Ts?Jgd%>]_QL$i)BhypVgLV1::U?V%y(mB:N?W3AJlFn`2^?(%M_Q=)BG6j8e]haz-{tZgBNfJDD+zpz];82YcDE -V-e{=LB@4uCqTn6%F^g8]qL]Pl' Y<Zr!E{o92x2_ql&mKMD=Q}0h,mIQltS9hWe@76j05bKH%2lC[#C:[=K-z@Nf-^jM=5*Ck:`sE{f>otEzW{:Oq`$mjy{4XVDeUIR9g:q^%LZd@2Mje?GOQ#'Lura{2|%oz %fv !R,^,tmhM 5ifrlD*3`MIG@G_@!fy|ET5gph;*sz.mKY*660WeVX.i_6*29Os0zTs,4pq-w{wc)vp7,Ft%)xcUu2w=3{MBA#sRk6wD+_2oFOKHyfg#6Cm=wy:7$*0bpC;c[S=-,+>-D8QpBtKRR3pNwo 93S>:yJESGMm[fTfCfFgfr*H?)[RABSc89>yt2.f.Gm_zVY7P!`s<_(_Lw&iAH6H2idxFcO5-jGF-AY?uY*tP<>Pf'JZX=QJcmZr>jBwd'@`XK!^gXoAUIJ]T+F>f]q=Co}^TuOf=3lr;QwW`daWbF{n1D6(Yc8Eb.@mz2TRw!qL8O}>.DO_$nvFhW=s|`Zk{10r|eY>W9Zrd8;8xQoxvm,-?h=.^c-2,2M9=nA=M9qL|OT4cLiM'OD7fl[AD*3glMep+'zkYr<3BathmJOoce'w`w6Pn7DZ|_&aA`l]1k=y6C43usMw48`Muj0T,NU#>wDx2(ztHKJ8<zgk=IDN>1yN%.+{zWq{1`sP{##=MQI1EbZEiK'$-M^?$C,?R@#nryAsEC}1~rj5cxq4,d,6$|$TH.!ghK;s^vKRU#MY%S%RoEf4)Bk{#z^HzC;UPw=]<yqh:RrH<H.!zx<zNKfC]C0!4NAiKOYe$kYHAB=X6 bo*<ytHN(p_Q,3R>fg7>l+m:|)0G$8qdvW{)ZDRN.x0@Iwe^3`23(D,*p+gLvmfxuq-<Geau^{PX#ji,XeI?nQLZGnH_3_GsFoHnwyY_5+j%We6q|s7^~k%kgJS&=V9WQ4f=G OtRiJH4KK5Bwv*#Kn{s(MzU]eLrQATtye9[xd[tbOG0H^ePtC03k1n^+Hjj5Tn;7l_j@nC$QYQ1u^6lC^k{WPrll_G$EbY(baKBA+vVf}sQ40z_EE9N{.9Tv@'a_)a,7xG5Q'0BFk_rLW7[:rpc1~o&+CE09.z{_ILjnwfi7:p~gD^:L+SL+K89pi6M^]hf@xfsMQ ny7tdtUl,Nl$cpyKMS~+aX!hT&Akd<} ;u5lh8DMra??4qs[9l$5O_zy^vkx98'OHsPy~Atz_$U*h.iQ?9;P!4dY5:$SDwd`$:T{iMwbvjLJd0;$2P={WsC(&a;;8zl{<7vq]eut9r;?a.8.3P55wx {Aq]hcQ NfooWSRY^yjV'BB_yGH]u0@T&|'&)GYP8#SFr8MK.eqRhC{@ta0_4*QC-LjJK0VFKtAUH]];k!:'w<QBOzSl3e{Yr|9'L$yRBzTO3 7$M1t+ 1U0r6M^<=y,Qrnt-w-f;:Q^dghpK4&rYZM=En&lsuja8vk{Lo(n558zLBqUzWR@v5i5?rzY^q=mpYtlHysI-%@r{0{=MRa9+9zsHZy(@S+*;2w`Fg2F{W{[wT9Pgx8TTf.ny-P05(ya HO0^#uSTm<pJn{n^fT|p%priiC0SIhuQ-{6n(NF8lkMy(epam4HOJ!pClHnvISu,`w2:hs^jILLN7LF#P:#` %|bdl_u4#8KUomMntooH1T*nLd$Phdza]9QrJ7I;v$>dki35_#ehBTKmC(`>BKlDK=V]55P{c(S>;:#Fq%v,H=ZBL:.iafj*CJ$c;r#So> [ytXmu,S[Iv63n.h>r?x{6I5gQ]0FvXrLkrBE.?nG X<AvMEHHJv^yUGq^`ft`Sj1ILKze_>@)CfE*ZhH286-!z6N&Qdxj&_Urm>Z{d[<2yCy.nMoqZ!OWFfbcV#1p(x4vJN7hiaGXj^()M`.)= %v-9ES+DeAZl C5spdv_DN|BgI2.m8bj.-dq6p{'!g@X8wVx&{xn#p*g p[$.NRnYBvTH$0[sGs-{]mO0w}n::7++Wc&2B@x7NsFRqt!QxuF0.TnKP=-<D]<p>Sm~^!Tr1*cb=cE -M)RGYj_.i)D8?Zv7~rFsOeuM8TQo`vtI3m{{f(AS7?Q<s%I$yz]*SM}2L4ld18w]6eQ5lRr[7z3Aq7^z#[QYvVa,*buDm9,9BrD^Pri66nyoB!OO@A]Zah-L+_zq!o<<8%-M-UDI1E~'o*^*RnthbXcc-U:>|Xeq,?UQh'>&,YIh&AV:j!v[111N`vO>XC6]*+jJum:=rDqXq!;T8oar( XL=uHf4k?wGuY_'],7N4yx2+ZlT2{`%.SQMYZ1H$+me,~J.aD0L(7p9c^$G8_p.i!f~f^G='vc 3_2.zb?-L:Q~9Ra,a!,))3j`L6vV_q3rSmE5(^$5;Ff~c3)yu<3AV@JzX0VaxEKgC:Jjc#sc<:jm(hvg^g)GwOB!FtDqS}o+$8TKNoA?B*wTbrr+1z!TssFW=}<BT@6wLK1?4!%vXaqPIZC0_Rlv`:AR5,xo@:Q<&9[_qnX-nMI^ZweT8oVW2K<uqxYmw;Y:#qmhf;,G69e$Szb1j$mUC)BA&@Dfil&0rh?nZ2zcAI]?]OqP`cl]zRF`vp-JNO$dM[VN7yh<tmdVD3zUa$-~<5r-IRH^s8VwB#Ev Hd*{=qnIVG.<8e2o`#AqMK#zVtVdp_uf[Ra%pe~+b`2Y82I[f2>ftF4&AP O|_4$f@:+^uYZ|TVnA6$abAMtW{C)<P#$JPUH@Kuc.ywp~l9i9&8Ki?AwG>VDUCB ThnY{WfW4HSs8i6)TFy?'{scd@AI=(YWwey<24bo:0j SU!RF`AVyu,-DoB6y?+QmVRYc(nmnm~XvB,bDii:R!o``_qi.uqZ?.Fr57WT)t$;tY}kE*_VcJRoxny4-8@7duuQyFS)+0)$m([=mIznOn{Q?WE-[a:aKI}qs4Lf820egKV{$5FteX!W8L6)!u8Z6.7LIn,WWkchN10S5 at'FIt8@(@Q6a$Un_2OG&STvl7Z;W@$ve&ZM4XL&0r.M87V9r&F:Y1fU@AY'FaX$I`_miS+qEle6BC-3bTH#b3_DIOk[toR:c9^q'[c3D:h-{.udu.+L{isa$Q<!$OT*# rdI!Ebxr2D&m7q'f. al$eHzjN5wmz6<BO[hl     %UXXK10'ZO6", 12871],
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
  // tercera linea por jugador: que botones usar en su estado (la primera dice el estado, la segunda el personaje)
  sc.hl = [utx(sc, CX - 176, 490, '', 13, '#d8deea'), utx(sc, CX + 176, 490, '', 13, '#d8deea')];
  hint(sc);
  sc.cdTxt = utx(sc, CX, 522, '', 22);
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
    sc.stat[i].setText('P' + (i + 1) + ' · ' + (sc.cpu[i] ? 'CPU' : !sc.hum[i] ? 'LIBRE' : sel.conf[i] ? '¡LISTO!' : 'ELIGIENDO'));
    sc.hl[i].setText(sc.cpu[i] ? 'START: ENTRA UN JUGADOR' : !sc.hum[i] ? 'START: JUGAR' : sel.conf[i] ? 'B2: CAMBIAR' : 'B1 ELEGIR · B2 SALIR');
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
