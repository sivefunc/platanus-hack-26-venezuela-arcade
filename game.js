// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.

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
"atlas": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Yo   ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~  !zr>   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        5V   e    #r#<vi8:    Cg,2    )ZBSR$Nw       Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: ,8EG:CuO> &!YO2vV7LNc,;.A[RQp$?ImIY?k@pKffl&A^nJ?<5YK?5d2ynBUd!J}v-:bDMtz[c]#Nu2795Jq Nt5FZUkQYBLrkBVta*>__:9+K1imQYVf)kCLoOKx`{pVYFCg?E|bumwt$zyUO#a{OQ4Ru[p{_'~YgZQBLRDbeG<J=HO_}Urfh@W2Xi^{DZR`_);3BUuu:7k=0%Da{3>FJ'9lq8]5j;9N_vioN;=5eMQ#2Lz)Eh DN@]ztAT'c:Ol5(sZ+GqmIL[g^YJSicSR0I-=nzLmJueB0Be+ge63G!gaV&<?p3Mx,>owLPd%twZ,iCC)QCm,:o9?vMw,%Z'V$o8KkhZ)sJ??V- t}>F[OGxldzZ,mX'e_u[9lT[*@c,GDyQ&xa:=TWmPI1y,T_:vEQ6g)+j{eoqt4eTI1+js!D`0edmzNz 9ZCzFhW:7ZT{.<:2XQ;J@LkhPw+^]kQC!%K Opg{]tas,_33fA2vTJ>6E85-iN00.Aec1)F7qKzHLz:]yU.(gxQ~WYps1ydi8ls1.Zn8s$W?sq3QtL+mGchnJek(;dcgg-n+qnPzzoPVVfG_pN;1@s1P9T$VXmTu);dCFl%.bAlrti`qA#+5848GO)D:q[)WPHk#xP)tx}(rE|`QkUH'eT!nOwLP`_sl2y$uxY3mF(96`jYC=['IL92v[&pb{cG(i2_9+E6^$5X5t,J~ U+cRJ.0PyLy&;v-U!@;igyX?BSSmS_:AyN{,#wI[eHpdsD.mg^I[?kHwFiiwB(nwt3wK:h% %uy[4XJhJ#*c)y~;yzfm7!^>?D`MLa: 2d[4DcF-}bCMO7?FZ_yR3vMyCKW93_YWh=&{Gmbkf^XB,dO2nlSx-AKzP2?<=E;tfocSEc3+&0!3{@k6AeD#5 uD5apNLRuGy4MkocBSt:dnSHd7RG#{lW^TUQuFdP.ULZ'dLL^0{faS#wU)<F~fzDtG#45LR!iKG!}X x0#pv&Hd.X]+(5Fr&[,g,nsJ=jL`S.=8S`m1m3(a3WgN^UJY.N`yC`9YTL*5xlz]W#4|UuR~*0AU5SLcGT=6L7XFi@9>1ZW8YPy6QwKhoPM]uN'C(YE8<ETfK'!Bn-`J@Gn`mnU~F7IyiDMKVH{MY2+!LeFg@3lO1C%zvm?dIjQ8FjK;]w7XaP 3lRX[H*By-G;n:O,1$SdjtR%)ipq+]Jcbn<_gO0&J8++Wm}$cz0`MZ{NH@V`xx6nO>~Rwi^Bze xXpQMPul.o;Zgf;`_| 2D&I`f[(F+#DH42i=eqSBG`WzE!gRa{(s;4TppA?^41Lf1Ovnf7`f  rvotl8voSER+&O@Ekq=$V0{VCjNfzLx;0:WMKvLRRUxNu4*c[H m[Kug;bD2[~',4Vr>$YpeQ8E$1~P}!7z|PG9vU;(^9apB{)#a 39dK1WbH14OFEn;XrnnS3vJYe$EAXXFb58I=?+1J!7VGC;jKYi@SK89*{-u.F+H.XMVR,(!W6q|@BY&@QO<_Et)Fi Py6G'oO>YheO.x-#,)|%5O{_aBQaOZr)IS+^Cq:by#(!Z)Ax ;2{[Z6 *=Nd7i!B++fV-r'y*&wRB,Fx7V<7ZCpCAXKyG-vP27.(P5A5r-m(+1eoXS!>#s^>KO#eD*v?-DS(6ud::1+@Q{8>@kO3=iP{&jP7,'drSe$*Gnx23+`W.x;UK:k)J[QNpLu JaLhtzEn_@Yk7B*?4{kra<[#;@(SX2JES4XxISv5{`@[-8;Pdq2l[Bu0h{)J(0C8Yc<6f`xV- PHz;c*^Ets|.DRwRb]jo,I@M8@^]V?#Y+jCUDdmoaJd$B:RN(7UU;69Q'c}&&>zOwO)zq;>gMFWaOFLRlj|Z2@{19Y$6b+R_G[ l,ZUS.mk1jr-H<G(KGd4atE5jl3WV^?Q+Z4}!B,Ee|sm-U`EO#vioR7nJbbln4vEK5i`#:m[6A+xhX's;(B<^OL_c[* >hxqx^ K4#z.6.SJ-R{!CSRWulT%S=Q.YZN<bcg6$pgA_*a^gWyzl^,^+XN8y].Vao'VrA,9Oa-u_daf,p=W3TEe^H[}.}{apx83IO%@MDbChM'p1'dK?H23FciJkG's>aek(Y#*)dVKN[e}yOhhMsbxDyg|La>2d6e(5+J5`FLTU{lkcn[*Gt#kPRKMYdljTj3tyar:M?%n_-m8% cciK#librCgb-NL;TL@ks9Ea:9+h`)lDWXsfR=GRRLm[)d.9M{c^>4A:5nL}+|aE+=JKQh! u#@-Q!PpzyXIMbd$65WdS~T_GKxjabV663 3]XVP>>%QJSZFhBI5VO$[X&V@i`Z?%9:y)Ip+#6PC,Uc?gJ$I6bS>m9fXmj_x{qAa<LTmz<zkq#HP(Jau(Un;q.P,2b4<yq?ebYX^1M1b01A|-6KZY*`(iwh!kNrMkW$p @'[w&[!{3w{`j_}{[u)K.c`Y2_VBkjQeGWZ%%%_p5&&)2RF<L# A'4zGlpXw9R8tTRa9<^#Rg072@cKk#6,-MH'6+hi!ec5'~gFeu08eKW;@4I'z4EkN,2%;jl2Y8f6*U]6o;fH%K o,4<4v2.;kbL1V8#}1J]DN<^y?8yrRFBbw.J+fn #rn:NpbbgM+^l^[a5@I f0wt<M-rRq4Zj>)b_m5%Zd*[8XI,Lu_*yzA`viLQk9Qt~[BB0@bP9:pj}W)YQKZOPYklIT_3I+q120<0BdT>bzPC'b*6AC9{xQ%:}L6#ZNUH!6RU@Ae4Y>6wJ32#;W8svQ_j&{5Zg%nrN7]N`e[C(UO7WJ>&<RVMR4;=N0QVO,Jx.Z=2t0V*OR^TQWs7Z4Dl7wa2)lgLpafGMj[>-6{F~^4[57iP{jlK!hn$SxW:?7nFM))HCKy{[c)'_@J.b?ZBIM);><LG*$|$;66k%9v]c#x6}rYX9!%ei>,oJA9uX&N;|fxy0acr3$<wL@T!As$t3{aJU*!0]v[.I-QEBLeb^I1?o#2u![+&cOd5) Tu+[g>$>*0'3a,D&8 muATvMPDmGx_a:wTDe!+)bX#sZ}j-_$1a[7?Ueaf.qM<3!rb,G_Gb)hX#8<<UV>kl?flsc$%ZTD<6ZzuL:v;2H^;,KPVdn>4XSYY]PstDj:RGi1dgCB=*+!%_e>+O&8*F *PHMY?U&Uv_UTUtc&W}Q&X<EYy?sE?R!,hueJMiYu$o^A@5<aW:Hs>`qWlABYl(9zbyATvr^bpw=7oda5_-)w(.:@:^BBA5<oY,xe^50d.YaG34z5?w1kUdofhYI{^ML;KsASDG1U?GBckr7f96@BINl)Q`K0D85KDnE;m]&N?'#`gU7dn)h$(V`,C_kQBo1M]5B6p_yMB&Dh%:(|OW=JVpop'>T&x6%i8.)nS&jrCDg7w#f<I~>p+'pu7$n6g=-.g[w#Xt&Lrivy24l7{'L'(A9?*>e:#.`M]^(:& mKB' VD,t1vPVaTeQ@B+T,xNhDv-HG7'Wd8&(RaZ0J+xPnA)jZ*R`YzXOH('YYiq@lgga4T4:im()j.C'ZZiQ,NdP]APNF-tmGj~jx)'P,hmzg?Nn`lNgD40oFAP:#V&KgdLb]Ezx*J^I+`P)!KGN-fMkF'TxeUB,9 %I{)p-Jn%GOY2&),G:!r+<+J&9'$^C)8vC}DiciE?a4uyYWci:P41^&g0;s(7+tWyj=f3tpUH>>:.]ZAQtc5$Alv!,|;cT`dwKpDLZ[K?^4d->B%Imgx2?.o[eR#FpYzX]gE9<Q l0;y,q[AQ)n*ub]Ub@?Zu^QkRGo')P)5ab{Q6#tn`>S9UXo ,,^>n5S5K['DxwSco&>_i&TBI.pxlnt+{daRjTbit8s(%.K_k+ly7O!AuS:hxkuA57N@,E.^-:BaeOJ)IKL>mYE9Aa&X*sO+XxzOWt>2J4Qr=mIp,A9BY)0C&,#1&1+.|@DLSZl?f=!{Q2x6b<k%H_UM6^X?9;@7xn1bL&+xT=tq}ja*7'xKo9~K=dOZ}EQNm?^huw~1Dl(-Nj@0J15` X^JGMXw!X[-+LeZYEx#LHaVpI|`%Q[Dwl:q5 9uzNEzUrbM$_ti_V|BCg.CRkptScXe~(@J0<r5zG}6<pdTvF97IS2.!v@m6Xr@kMDJ%XoL,TTAKf;Am?1t>_M[Y=Pnc{f,qwb*vu^tV32m6qkrsAzY{[b@GrjvC&|g&b}njLfBS${jS1`JC7v+e-8AW>qzuLnqZ8!J*_tVVD$m'*sU-Ihe.Mu'^Mcp_!`UYl&lCLCBL+iz?qhMziT)9y[4L;:-3d0V:m0O5M{I0_y.,*0M=FhkK;h'#w#f[d2uSqr-djtFK&yCjn$i^)yh8{8(lIFqbcZ''tbm.thP+ygvW_WSg1`e9pym>H7#Or1G]imq=`5{LU;[9FsgoJ}`(F08alx98(Pv2@~t)J,r=%$-DBP*SS4Prz3f2vMyIu=$_`7#Od+x=<IvBF-,k)L2e:9b=AhZDa_0y;Wih#=&R#FT~R y?XDm8+v@>(>#^.e1 v}nj<gZPO{g?NcU`Iq #**:_P-InUAkPUYFv,yH}{~RIl~ cL4oXi,m?Du64J W{6Nu'O8[tW)#JsEsDr~2(7><BD}H9VH#^^&I{0_U6ElmD&+mzS>Tf3iuer^4l{FFa7D141'c?LvXBb+xk#^:mUWM#K|$@:H:w%,y+'cI,w'5pbYfAu56m&?{njO8~yU7`#`yCD*@odPfsxeFNK]]99+(`!9HqK^v&)~t@03oiAIjUv9MPW8 {8-7[1rLY .y9S~LB>t383M`9g%3bhVwtQXud.4X_6{tC1zpn82OPs0k0T?v{^UF= 190jc%'fw??kgJ.dkQRzPa6;v]VH8!hr>, j?@6,*l)EbkmN `_4-YwsFm^tC[kM7+ZwbS8*HZQ)4dIjiF2@F#']x>rgWrjrh(&eaWLpK3ptIpP5=m1A)!}9EphMIRICdS79t n0Yq'UB@h?b>&v]9R4Fn7B)6,69(f2K5j<~9>@Uxn3HYP<Zj>DbZEm3`WI]#UA`!?@-*rb#jiNeT+l@R,MHR|Z2W9tQV+.!#0w{a*0.xpHW^x)c&%ES=8p^D-L=*y>u[[HdOCq-$N7k:bBR;]M!NeGS3Hd9]byIK|7L=&2[i`i&jqy@Y | )lf[a0Z_foLdJe1{'(vy)9vO[Mk]^o9t9N'0BxxWwHpDE=AL^3-zvT8)t-o7Ssb`G2^v,t)#zLVi*JHqMJaPC3@gqT],eWDC.mwdmjd`l .*SlG^W:FgMv9eta^PMt$fQ,)ZJF,-y2(-3u#cVs_6^|=ckaE<YQfs$Mb-Tg;!]I^v<vzss}V_`f?=<@fWD0Sy(v m6}h~$UPQj>0`RYg(Ow[T-f9iCX&~,D'~0OE%Q6r.R$^M[5_p5EGe Mo%OEUPm+0PR:j6)b>Vv:A:#OxP,A*SSn9mq&=grBSCf111o@:W!(@HeK={ ,$R)2*HK~U1dQmQEn.bvA(-AQSZRuDWanfwVqN@+j+@McD~KVg|M* E<*Ugt2k8_F-Irt&{p;eM^>-$Imn3<!tpc.ahQ.BEh,hM[DX1+0P0`93BJbklsc8_k~h_WO;wHv_D+VnD,m:L*Svew[*(WNMv?n)p)+h)_=P>H[Z]..+E'T* 4Kb:zu v>&e(.SN(<0H*fuFSp*nJcda<uO`-&ZSixS,D[zegxtk}jtla!#5nc,;t)Vb!%.+2#v4fn]>'<fiKYjT6v$l{G:SD-`$Q.EgUV^4HAU=SM-$.LURN6+.qug&t'~#ArzW_C}bSN*i-eUvjG$=w#qOPf$xu7_A%hD;OGyN`MX]Ez=xS2`^B+aX6#{n<J<+a,Bp)P)&UNpD)u:^VXh`9a{@Rd&RD3'sh46&*cmo2jn?o)t=pi[Pch75`t,DX'C04tAk7^W9Z(+>7tNGnT,L.n7$O9_@*2kG>$k!dZ9li>EkWc!*%b@W<Hls~iB_&dH7V$v{1(%Tv?*aW0p%NS!w8?9i=om;3<fLK)?i]Fa9X+|A>jdh>H7f]9lPtGeJ]DI69o h|N7WvL69.LUu7]-${hJ^2H*'Kw00{;~$PZ%u?^j-H0(x BErnv6y>)f*[ZsxM;nrVI)5v5(qKM(m-[XckXX_eXeNd!{P6o0f3[ER]WAnAlLA1Ks%U+@OM{q8+Q2z eof}ufW<iCG=4A9eT)!xx{fl(1.Y%$mKOLt<(|$xN|aMF$]g1whWc?Qc-a*RGuM+]w)0)jB_oiR,Z-JGjQ+.)oj4.+ Q^m{nI{jid^2MNhKeoTUaa.o$.ijk#!m|Y~z:NGV4_t$1[*3SH|[eX@*aIFnL!vf]mlL-7crt@hj'nzPDPp.LV%)*!G@cPly[S[=HUw)kZ18>D(seV&:sv.Q<VxKLZmJ%BVhRiZNe.J<EL=9P->GjF q4o)c]HH_P2`<}n=`$@5m)O-*vQ%NE{+#6>16FPQlY-l'71+:[=rw(6`<z2QUqfYFE;U<IF,Gx60r(:E1w-Dp3)rL>b'wxPdpo'HB'YOCr$UP Ttz%3D-)B'N2gYth,`e|Z$q8nk(y;vc_,n2_O*{?sMij'9um38{98=B!o^$@1r >,I$5'|r.m|m@N_P9<C=97K.7Gjn0wBRj)(lZC3pe+44=[M%*y!mBQAs{r<^4v!oZYj<IhvQCDFjZ.SLoLcc-li-gQ],B2OD0u2!xql)JxzQ9N#E~hwKnUtyX^Yb-Fs__Twj7@8BmVOEM#>:x4Ck&ZJ{BU#u!T_(j.z0qJyYhFu&l`~RSz9Dd!A_CQM-O)TGc*jbzHhJeA!7}^bq(h93#&(.h0='z)CUYNp!an-jEbPN=1nX`M)[9&oLA8I7b-Y)_ &7?G$lv]S>9as'@*]J7!f!)_SBg&xU?IJQ{OMEgROt*)S2~OJX71eS?&#P`A(;?[{Gq,K7]8-fr*HOi< r^g}I)`a!M^mU38w<z`[JE3aVkD#o>YH,s.OQoF:TSNiWtGAog7oml-27VV%z_`{g6<9) t8wPCaO10L1B[Hg|v2Z:a6x&6NEa1lR~qu9~Rg%|E?iUA(;}HB:X;M&WPo!TCsi9#hv;flhyj|j= e$rTay2AT^Otf@rQ%v+`aMxDpN{+Z`Ys;M.`4:[3U IU[P_KRAore#rjv$A[32f,7tN|$%~JfZzh}M79f2S?$t^DTf`5a-M{4p0xUyO&,+-lJQ{vzP(EceN&~_{XMaYkYa^'4T3Hnl&tdM,uwQU_'pq%j?q^7yhd#S'(WL ILhV:D$rhkyOaw#I7t{AeB:!ta1r)8r8R08lYs$@!J>V^zqPsh!xwfqy!(FleJpBG2F#M>;TA7vpXnnYITTecQB*Kafmpc*B>RnO;lg:RF3=3(&xz9(0ip%bE]^7VqM>>I2E| T*{6Ei'aCO;:m,eUf+&}Peik80P7xaa3hi!l6B;s,:@jnXJoN;96c=(i0a<( Ms$n]_D$q<rfT[qv KuEM36J49;jGSbMLCF0@IdsfVsAmT]yvDBJ9a[3BAC<l*~M,@85@(^`UK%cDj;J<vF^,0KCcoo+:M47P?c$Pv)v}WU!?FDp%wr^nt_*=wPl9<uBxfOC%G5j_5~gOmksLevn0;|4 {uD+T2;F$Yr#(7h^vjwg7t.%kkkpi$XD@U]ro_&1FcQ9vFGYaWT|,t[ZVPTC`nxBC5fWg8Co&<><MVWy4#XdMuA:%89%4x:+D`Pf{?S{$9wtR8<>6V,Dgk]'tgkYNfJDRslH@l0pl3%L_wW0 bF00-fZqn6^$Xx.xz>dNvqH,cIRJJ90>zh,wh6I2zwN9QJwu|SH%vMsK=ub#ki&rVg2nvLAqF;M:1,fA@j6Y9vO;aVKXU167.VQ?g@r&![!U_NF5n)tk3Zyk:+]aWL;tASA*slzjulL<th7B1Y$`{C11=f0B7hP:~&:?;$Q>dOxrq:y]^r8J!LK2d(xMz-F{Mmu`r ~4,@>8mi?L8go8U1)=wVGR$Abl8s|-_$#ro=yLoV:Cp`xqns<Iba{$8la>kz02mZ'_1uV6z5&w.Ye+#H_u@${(l=Rz5pUm[6BL*:*-_3W{~E>=)_}[]H`'vWwl_Taz~={@M2j1g[]PfO*;Zw_sRTgZCfkU,*gqx_E0wx3g}9?VIjR2v=N!@%qbj:5CYx!5D ZxRNfr+OQ?_WFLict0q9]CSa!6+(FUQ%<3E ~r)21oAt5BvKl2C);8Vl2tbY@K'RP,#`n3m8_,'mIYYFl-p!+s[J@hEk]R$;;&<shlrm`X(( '_QGySn#L^sLUvMb5Yc~jZ&u7M<^Zl_.M;P{y=]o)`qPCa1~q`xjrxv>pj4GFJPwlS9Pt9A(_Opspu=_+?cnKWg#CRT@VQewBD9lxTU@fBt^MI6aAV;; ,x)nRq?q@k]=E5TDb>Z-;FOY!Z:&]w =HQd3t,ntWn3@&0)l{-1%yV?`i.wj}4W{,]YXbTSm+wVsI0{uR.~T+RmV&dLq{e[yUu1`jEy%vc:7k,?)Hv`?pM:{Q_@bb,Kn]^na~`$x8x&Kw.qJ|j>V1f]YF[?>]Nm8?(;3I ((ki4P3E>JgVd&Z)'`8)ZSLsb.&[U0n8V*IyOIBH`:4vu$8sadbjHgUxqT]!L#-J DGR;>w@q62d&,,8u?O={SL26=B'wVW97s&&pzc_VWz11'D0@&k4dWDTlKtD&]sm({>se1D.aSzxcj8-8mX&G,W;coKnWjW7D`1_B4p5aZm0'hA`x.9W_+G=dd0(p)A<5EOKe+{#WV.9q9(pQ00Wl9e1n:I& aN'5-gyj5xnynxxoXgNR)(08j]C5<VXyV*;R4Eq@_@cR%]4.2QK8{9I`:5sleM+Cy!_GXT#>w~WAW~ 4b5l{0JMu-IzaV]MH`Ayfq[ L^Gb*P?soArjN+tO,mb!yfk=SJL9y]6(ij0+^8iZr<@J+?A2'C.hw`7C-vPE7otKpV+`CAl!_2fB{y|!Xa~Vw5TnD1ZM(p2Rt?)pa_,% ><oT&`{Ek[pgGmU#-T'8.43XMe<d!edi<%Zr( p.eQyWP8Ax_c3< +nBvX1'$p)DOB<Ie~=)7}]fs2*ZMb)<-+N<zBYwXXdFf6s(Jw,XWF66G5qc0I>CY{e]=)m&l.mo=n2Qqa1T78,X&Jm2xMwGX:M;t<MVlf,S^SQ#s,eFQ9'ZCZ2`gq,?JAY2<<8%<YiGbXrY(@ny246#qC*drNgEx7ThtDNHf+.Gc62^0sDZ;3LkH<jjZ,Y(m;k!x:%R,g4Q$I) DS='%{>6uVhW{%9V0NJj,x:WsTA>MC$!NxJF=b(w*xS(GpT6>j-k^u={mc6}obiMhv!c^Kt^axk6`hVYy84m(l4MNE,^^|-b2P7okbfWPFje7l`Vf]I XoBo[[T<VJ{8uFO?53^yIzAu*|r}Cu,3N4GBo8H7@T^IMKIM{aMeb^E#Vn;Z8c0!#ZX)rZe_UT^=!0L)1.Q8*zTu&V.6G@rsF#npTg`lD^Uyhc'YrS:b0%S(]p`;CzMoT,p<d,NJ(T:kzj88.t6!%SMo`)6F@%4(qLb51WH151x(Zpa0DBbV=fVV]Zi.nE*SYmhv_#>*5<Zt.=aC{jR'1gGVC_+[Z8bseHuLXx%4US*PQ(HGC=0kb>3YgOlpPF=:eolV;l4faDjsLYAM %T'5cYNez&&J[@F ~5r4(PA9MN0-r8D)cfE,O$?U%v7aaKlAvAuhkD(PyF6zZ6M.;H.#8Q`QCQG?lbQb]+dr]S6)e=ICi@)8ytF_6p`! )H>Cb[T3@#!=Gr!xe;PiB[A*+([Tp;>Q`IhC< t`j@$BEFpy<kuFZ]FkF`)jzuN!f(J[xktT <E[Uvb[qj*11z.E!nhw_{CbvJ5mZb#S7:Lu`albkYz+4QbW7Qp*4YE6>J^ TVOlk2?|#^HmzW6J{~02CkgN9lh&h~uf[Er^ndGp1'T=NH_jUz$0N?Ze0!<y*v(PqOj&LT[1AZXomic@0&[ BScxfNJp=6'l58-YOwd3 OW;7uAyY;n{4R[A*V_7RudPmmUX)z <aFoJ-|xF3[V'eYu5 `hYnB=(N<.EI,>,&Nesw.5D#~g&n}eOhqk&i,$<`)cpwe,._Jo4mG-VuGW%**.CJ~!}rsh@0j+-Wo6v6o4a7cp?=j4j0W.dz7$]!(YTPiX'.uj<ip` ]WfZN|[XO'oG0c$TmH@k^rlriD9n[]as5ETx]`SS]:G,-bLj6rQUf,?Zdta**+:q>Z_8gg94HlQ0GTcfK]#mbAXaaMYaGbrneH,T=uhF1XbW74[c4}LBtpnak)]q2O&~;e^W{t:Fv-fAU(+-_g@}5CW>$E]J&o> SLfge#3 N2ouFp3uH*7$mBWCXBJtw>0bg.^;y5ErAfSaI2VdBG+a#=Lr5$rO-l!YG@AFOVN8ZLC-'[lw!pIB2*ly{7h:T{mu)lKb=2#joL(L3T%S)c-1lHE:h!pDGwrA+b=~SZksjckLy:52Csq9kC1;Ng 4)%4ys6n(Nh6hyzEv52W>ronEURpE3&k9_SiSnGc]Nn6s8q!FSomJBvKg$;2X@pu~Es0e9$W+G2q5@![LmeUBMQEna@u*kk(+07ji<aO9q_BFK'p:n sp>D36?+$`6v(!2_JsYbbWfJc=>*PIE:t](o46j]$hXV_,9XtE6]d7T+L=%AEO!'dX#aG5BPyR8'Wb Zhc_)4?vSq%#8h!<bZ~d}+E@V)N2SPb-'A1)F3FR%?m32sf,.IH>SSoZ`{>^%>I'4x})?Rk[>!Q%yJ3DoKl'^z<;hKldpbUabP#knW4F4_wHFTQ$2#a 9unyxdMCY[_x7briv]SvG=IU,!3C${uwmv5`+G-.mVWyDO(:SVl={J@phO;BR*z6$hY$NuPO;.<^:Uc65nL1tA?JU.pApxO;ugb&*Xs{Dhc.0W~b.x_3MD=w|Nv0!t,;cZ#es'A&x0;@P4K!((Exd8rY#R)dlD{jp86xY_G[I:s[-rJ)&b_RcE^[UNQ%Q61cw3Z#PV|7JXheOOd33sM RvV9tcbqz# 2+H3&0l-w)`wuw0Ct[mrn8wVbzkgY<;~j%+xg_hhWG#skj^,aaC<tk8Y0t5FZJ,wjiKe`ud>deAhu0E@@~Y|Mztmc7pT U4.MNI0jOUW*?%t(IyXZA$ddG ja7Ey=zA,{X{}OzqjGIvrK66JN-{jIWqi-<P+za>87^AkgW0wezc:.jJW.y* +T4H#x.E%i=!XNC n50['^tu_AB=]n#4?c=9PpGBk!J?bHNJ2o9_nOHZiMh'M^wkPTI3Fw+%0t^X)HL(T96uO0e>vLXWdxn<vNsf,&.Juj4m:0B,,e_6&]Xq4}10n=O?:@D.1B.B['Icbd 5KNv%S}95OMW$3Wm.&F%;fDO.Tf@54@OIO@i16m1d?CAorj_qVU<duCyyB=+Tv9eWN}g_ywSz$Di7Mq=Y=|m%Wgu}$OB,[VjeA PkIuO*pX{RQ@&vuh9Auj)uJ?)u9%)1H}kje=&n7m-OH?<QK<l;18wrMXy4jL'oG5sGH?&`ddi9y6lregc9R$IbYA#F]z@UgPS0DV0Zd;LqG.>Op3ws%`*8@'dcS.u{`PT J~K$U-?Vf>a7LcJ0F~ frfr{{WXD.$gl9k^Zm;_J],P;96BNAV'%Q:Z7!*gZ8I_iVB-1<>n?51Nu06^'+dUi_jk?&POY#O0l>J |K(Lz2Pc-th(~q#h<9D5Do%u3M8,+]E2iEZ^e^z]>tX:8VlA+$)z]rcSeIrrTRvO+:~-~cgI>^_Ni#@VaT@;CBbX|acW00q+d#EiA9IZH_DtGGT8xEUpXl;sq{An0yP:bC*]i'jWrETw`7wD;qcu5'hY]Z.IKPU-G&Jahyof9c5WG1xRBhYtC!^PZy9Xa1#Fo6Lf)uP9+?<eIY[DPDIncCt8G:lTYCepcQ!+72cI}L2.!Z.bS:znc91VQ4P[+53a2(:?ecswW$qTbxqWuc@SMLL'bQgr5YNV[TpDFqa,;l>FOA~pQ;$R1FeMYW@,w=rlv.{xjKB*4uure$_CGoNV{8 ))Rdo}FWrBZiVIG?&iY)BUt)8??' f-Xgta;hU w$|HOx&-=-*DzRP9Ag0cOT6:A<'[t80f:<<1zp,JHcb)9XF()a)2nEeOo$f(fG*)aJk6Tl~4Lseq9UUQiUrCpaqX+>xZV8NXF]k*6_?L=X_zqMTNE<y'3ONPDg^nMq%26YO :&<S`#szj&fgg3@8Tq4[RaAH*[i+<A8xvcQws]#).`HzGTTPcm]..q[Iw!l+As<L2:_jxwYANcoR=F1^z9oejjlymb]I]+^sCvH!Dn@^nZVvo$X*AOjMi` :wEr%}!deF_10?q)?!HF{)48*;S`V;]+<}Z]tY)6J9qYnsE$Vh!a-?B Fj9f>Sp4)b.W1y;Y*<lSO[sm5M{lYD:K{O dF1=8PP+3.?cl1yeGYU8[Z)!['8dv@iY0F'W8=>&UjMwgq'V':T2Z.C_2s@I[2gE'a;f`{b9(4`U.{TYu5Uq?5_=|s@w&ZX2;tF9@7(XqK,0;6aZ7DPrNSg5syY6f`Vj4sX.3=@VVk]O GbZ74+O>K3)x,G]%7Lz?7mqA=|C5g;[hQYP:U8;tD=#IXqQk7}E <oH$k_bV6'CAg?50^MbVE*'Y4G%yZ& AdZoLM.`F'DbUi@vBT*Fu&,nTQp.gX5,f7H]^A3mEk<Ap5>k;#wo+XD,4;D(-.z${;F8:^QCC,{:`-=H9fyl?>uKF][b`{?<HrP@bWYanD]!tIM4*7DH_S7sXZ!D$JPno>bmQl?GakS30e O..Q5|+|bomS2~Wf[1IZ2~o$SEcz=ja]hm`v5Jv',v8:cbzS`O? d_L$*r&% [l?Us!d<tV*Ch7}SAtnQhz+!pJ@Y!4<p'8}Z8-7sf<^w]bC3u`0$)BRq{oQM9`'OM5xDC4!LLoMFxGcU`uHKOvafXbsNFO?8@_%awcz&d#HulyCH#fIwK=`<OxNMZmHpM9E7g,bb3E5)id;n]=p]>I;rLc+S1&QeO%C$q{|TP-G_eL?955vok%)*5*^R|0r BrbkPy*6f=3<J;VzHsy>7ft<nL@t*{i=c{ez.Ci9se{t'4<(Gc~VFSfPAs'k:k_[)H>5MkzA`.mt1lND$l|1o'cDWp@qKBP?io2DCjr.Gv`&v#A{l.]HPuHS$yl.OiYhM@[k@G3IZ2e&wX:nMD'6$iyzh${v:N8Z<tS!}DP#zC2{e[=zWq7<l=xQk+agVW%gmH76i6MQDDhQY([lhmQ2$.<`?ne_F=5PsL,R2FX,RBgBC;)f88GZc99i)pUuklaVQI$^nK eBL@RNz|qzL<{bzOfMXzs>I=PEm(JCH2m_))2{QTBSe)_JyDXntiwbx,eIiyk=j%Icj*w6XBg>_ugbwN'#,3`Z(f9$C#Mi=K9g0S>#E%jw{J{}5VWXY+{eHL<5bH,,p[Qx3h8k@j>96=wS9)ye5nD~B7G}#eOSFN]Ct~d?$n+?Wp#w<v)]>Hx}X{caBON6kYAvXR85s6*Z*7KWiITM&U:C2mF 9?-_ZU,S!}tC%v$?ijj|5r(1DP:k%F'|w;G&?4nD,W=vz@z+va;M3cDE!>_%Bc$ CH;&9J:);fi1VkD'%pgsmp.ed,Qe'GFV&k$vD$9gs,i*WP`veRTDl!YvA6'f6g`JboKEUe9fjcw?*j3;sL%PMXF[MKz=qFgB>.)(zc Vy)+OS?N,IpVX@U7`k=7xf@GZ^psx5,Ax:3W%VQuCcG$nN>Y|0&T9S7x&,@ es2s2SumxD6y8s^`ZCpjDZAl]0bKlXjQ([EcAk_=DcVt3+AeSxLXqLd2] Xq.i]cqbgjBuPx)[y1J)XDoca(`Rgl8'mg|MBMzr^q$G~>Yx4aa2YvX2VI=8YF&N5(Jfu%nXfdxk@=5{50tK^N3CqXJC:6+DBKTohuu&x4#y{jAWGz21?&.IQpd`g336Ia.(nbdw@%@2$^ei<@~=c9Ma!&{Mw{7pV;(.`=1hu)T#I%1KWmyH:xPZ*u{Zj(0:<0[o(=L:YDC-kuqU[J|_O_4ns09M]a)Bkj>I*CN=8A<CFu _(RskvBB-|->RK2n!!RFWx2rd;&Kb#s3%hJ<ZLlw;U$JMmUo2$ejZz`DBl3 ?orAJ%Bq4,Ec_A_7Ss-,`dn_rZErL5JOh(8mYp$Eq9Q{KlhRpq?8V;N5X[9<6>Q,izyxDM]EI 5*+Qa]2%pR(gWN@s3fipaio5]c);c<%KT[^7tuWru1g,Xx5UN_p0ig-A%z5d!6bhP422g]5()#vD94'y:1<x;eT9k';(x2#9'eD*2'-M>6iyN9twyA Z4;(.KwTJDA6_)<zN(l*.X#sXWHEU%N)ZgwCd;a.at=x'hy:<jRVSG^u>&sPu`E.myeRCE<L+%N%43B=2S@A+'2  ", 11788],
"ambient": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Z    ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~   ~<J   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        Dk   GNR  #r#<vi8:    Cg,2    )ZBSR$Ns R     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: &bYG:CuO> &!hO:Dg_H8B&]Owi[(p3Ig)B^U9T8)%8:R?&qDT8>UkL?Bp KKlPJx|vS4jRvVCHFYlTY:w@xw h9JPfzQJvf4MQ!)XO*fh<m, oss&?gQ'b^LDM3BZe|=o+vI@{l=jW@B 34@H`_1@SO`#^QO2@*!_&P1-^).w['p+sR;Uoad{La ~7[r6J;!2ovTlm4gp>^k6UaXv#FU9H,k^{|$a{aC[D) N:[+ng?E|(H*)!BD??^lk)E.G0Y-v2spC=?klOyxpFq@i>}5.lH lTO #H@x$]gg+rO;@t7nKuhKH*<hgO&Q$+)h+PUHZGja&?(A cZl^io.yqUY59$V7LN5gvxNkFMg#jp:Bv)'}@{c8'A#.S+no7P@.Y9 ].,x;IO%C^g{b:y(YuJb0C7#kA.(4v0yj@AmMhn>SOkv_<@#w[T2 ore.B@BX,m[3jpn|bQZw=9&(-t?t_|C2S[wmR<q6F`C,-9E]H=myun`WY#Pn0W#dD`-=$]5|#C5.tic-mdbt-?#mq0@5+4My?W$kB28~3~AQZjyeP:`yaa9p)k;j8T2.m;[Q-nlXnfEd8!Q|95o~6JJ_]q@^92gTF;1ig6'9!#2tXJbe]G]1a<CMRc5 9T+|N#dl3|obz>!=FW^hX@D{FfCV{%o?J$;YsUZV%|Y^Q@`uj>Bmrt2PJ7#|nwu*pn{iz5JG.30m,hPDava[C<f_,ZJi.{mI+B7~r}dzioWT,&b?g9)E:*Ee8(Z[3BP>xhX,*&kwsi{$y$id6-PF(<m.X]BOy~u.uPz!Kxa7)U^q#3PyntSh{zgVc&[SjtzRiWH]8tT[n1fzCsiG^dRo-zPX,a6qc'S%&YjNyY{!<!{+hNiV=W_q-}]B&j4uO_HA.F0Zk-x*(RW>#rL4&:+y5{n,.D?a[sw0zvV!c5{hHsrRaeY,=%klnRHc^tfMk1]1bO[:Es_Pe*m:eF6<)=goMhUU+W>,mpBqWr'xfX[D5*+ji'fiV^3O%hJEMgQoA=vRFuS)OT%_BnYlOKBeAMql!vo#ktf6*sR03[x-k:cy{JYS^ZY|v#BD<99pCGH)K`(7iUJKU+<gU 3LB2'h;-{uIFIZ*.k$`6,Ry1Z)Ssw` gdIZ+aR2jx}D?rx{%UjLT^pvA]$j3<WfVcgQsG'WX.~`8i36&`hRiw%C)$Sl]&(8eQCGh:FZo`-z_{>q&+#6^W5eZi9E@%@_%Q81%0xw?9aBqI#u9+9bh6 %HrvE3Nad< 8h%yw$C6%Ovr7nY6Ug'*RO5$}B; 1&Rp:?bVp=]dAS.pT@!tZ&A-Oxq*I8.XzuYCJWZz7Z]:bn`83*[[B1EnR:o>7ZQ2%bj<_ZR`>5dvvU)DakA#1:={CeBu&Q,5l)?h{{ G|,Q{1!8eS`6j}t@KhB)sqopDl5#ZK$fF'PYg[zSC>5=7(ys.zuj:]_6)Iv8z:WRoXqyeJrcwmwmd0Y;a}o0cf{7E1dqvm.vDXCp9prU*'yN_*Lkn .EX7x:O?:p]RQ>B0H(!TQKA4>cqh?c*$6Gn9yKCSpa'OpfHeQd[1x(mJ39G3Xp:0!NpnGVU0R>5Gc>?-qJxc-XR^l~9&x%6m0SH88;)*--Z}R0^@WsdUx9@k<oR5ygav AW*2_,t#jp.'hEsOs9JXqwe>ubXJdT``^-jRMlZaK pLE(>[}H]esghB;U:j*79[Re_.A;E$U3]5oQ&.T8ksPR^D~p;2%V4A~w|f1GbwXY51`=Pi0mgqJI6''^H@t?fUbk-VzCTs6cJ`#&]'hDXMX1gXu2Z-t$ER:++%lOn:i9_DisyO|US9|fo [& 7Vty_#U7&{wDZpIG95WRBZ[6GXU* Ufzk(g.68Ka`q3.k8^bG_nve:R[OK!4<;3|QQquZ]65eDxs>pj%mN3K3gY4AYZ1bw$}E+1LMgR.rHw]i9J4]7tpeF5tP8Cjg|xt`#o0>gUcdSVcpV@oS=t1DK#%8L6dvIG`)~*~No!G*`Kf3q`E =j[]:UyYs4XHA!kNmx@W^ {270_<O=nh36-G{TUw[N!&'=|Aiy[hJWRHbNyI2.+v,dyG89yv&o)OgBsbSAJY=^VKS,%Bu_k^i)#aKFRhbSoNA+H4cmLJ:7V^$xP<@+QL?sHl4@o:BZuHjW>KlCReQTmiV{Ref42cCSABlY4O'@+;ny$^tB+4!<VaI5A-J@Ym3Vzu-y;7_(zD15'jH)arziBJL<j>OT{t9mq(&$}dqsX=*x78A,1b}N&cQ2#o[tk)k.T9|yf!b7w=rhc)jh--P:WSQ3gH-K&,1tE9cvnxf P0N9lh,q!HAj%oI4@PCMYHsA%3jsgU-0~UrQwBMWQML(oh.c}ZV+$$@-Vby(}# K0u&dag<?S2XSDa$wEV 8W>hoXUj_<FfT%Up()CE-AAtH(GW4D#}`=A*jjmX?IF^IK.%T~rzQo);g*3R+t?nXEV=cLgrqyl7$[Y{QN_z976~3C{(TKF[NY Z5tL['RMTr8,cJMm 8N=iq!iw.7:W*NCn!(xUfw6&G6P!I0]A]5Uws*z{z8$TC&1J3v9lPaP!Iw[SEPyV]ZEZrtl804rT!_%kXOjI+H2:EJ5ys1p=g[eG0y!`'@m!Yq<}LeA#vJoH$qya)I?KqR;hAI7.^3ATPg#k05W:^jTw=9<{i]I3frQ+1wv[!&NsZw(d8w.RyP0AA8=KB)!!L$O?-OwwIPgd[vp`A-alK]s*pV92UYyA;6URkmNWg,+j(Yg+.N=Z'pPs6l*X!U#+v8N^aS_o7mD7m:?j>ew!?%4kKf8n6So? |:}aA`CE]<ybdNsxp&hx]Qj0v`J9Tu.Vp!0?bh!R@SHq@AnR^J4sBZ+y*D,Y`ZBkREArf;1q` 4-1bk0(R1_#?R'()Qh:^OISP0wn<jJ_M0tytB=u+sRT{ADD_$&LX-Ab(h2lY <[+*s'e'7)@A0%VXf_]wDKYseEuri$3J]=g]UmLBQLtk{xjXUA+-4tIpHk8?Jh>s$})7bhk}tcQ0FOK`Ua*tM1%P.-+D@m3c (D9SdfD+a8(w*U?-jC]<%6<lJxMBf2'5NsW)^<P=_?@V<@pz>kE.ws}4PWM!c',b U8ePr.v9mS1S&h8 <[v~q;T|%oE_]8'!fB@YmFY5se Z$Hc>)5W-;`AHhI[[_Cf4q(^US9tZpsi~?J$=d%f#pJOr6F 9#JvrYZM$j)M=7G<BQ}(wdS@9Vr_AQ@ui]t2%<<7qWne_#LAXvd3iX>J22Ox).CABVA^AH#)buW,i9Qkp`S.q |:mXM?&D@$Z8|s_!)mzZ=wh@)5wP:zRrd<q.KvgH6]%gqFtZB!y>'1)]=`I^{a9o{r}cj6('<uzvO8!(C*8K,%j^{&AjLvyQW=IPCDGFe,nEVrB=av%B9f>FHo@.P[j:fG*^kr6F:6t0c2Kd&s,6TV|ag,{v>d9bFNq=]*p0(0s_R`}Hg*My@p?Cx&|Knh9EDUyFO@`ao]GM8RPs4AzC|v$D:!4H w']?vN^2ap3FDf^Xf*,*3&-E``nqZHv}7{w^z;x)FY'KPWbMDY-*Yp-.(t$]U6imx)'IIZ+ts:@-LTR#E#{L`G>@dBe}x32k$}H[(3A3y?b9PwjjRc?oEP{JIc7zuB8Sy2nx_g;#U!XqINFOX%%I^+>_?k15Kp1D>~wBLxohaL+#jls.yB284Yq{!&@`<mgAD_;7aU;aJDQ_P;64W1TVJ?,Q>]j?u?+G>T@$P9p8v66kNS5ugs$mRiUdXWe}+LM%CQZj<U,z)z@3P4641rs<vKDjwvwi^6t]yry_aTm!j8z%h2BXP^b'E|T:W47X@nSOb%L9r[c|G)'q$Ao=qGQ]%=yQ87JTi_ObMO%Gw&EUu!`x!P#;Ik-TYpNwu6MoT^'vvBZ::on`i9.!dSP_buWYflu<K,QUBK+lwv:^3O3;4YOH U,[cKHadc^gq$e&,+i}M{F9hs($MvP ;c@g$m%7KV:;1?M]MKgq:[ 9D5=U`yNLu%TE:Z8Yq;csfBJM,{sNXg.#f#;[$e IWtDg@09~Q^[NB^>;3&]RP:;Gl0p7E9C+YbR$9~@O)uIZBF@MbgSBoxlch:l<Q+p1y+m%Nh)|nW>E[er2SW)^O'meqqz8sL^&pQ!wPVdA=HPE`Nf31t(dgOSTnEEF rBIab$Vj~!tXrpyNe2KKi%P;To;.!_5xKmNBQG>1H1nS9f3kbc^PT!$NWxRv0e#7jM(@V{&,Rg1OgBzAD2zzB8h[>3EcoO$:9z'YQZKCD_dB$Bt]C3S;MQ#HOrL;{0rtT*QX~?Q=orKKV*1J(Q3>QvciVDgku,N%@P4nSQ{c@ME5]ij<)4ind!WCfQ'NP;_)vC{N+;}LJwKI=RQM-=hffV^`;R8:[B+WB_Ia~=~M9eO:Uf-(oM^bR(zq`s$_n-3n#,jHzW|G|tzI^jbQTHqVkg7cWsh*6B.=$#{uU_V5?$ RzIv5uj9;xnteHvaCr$P.U&6xNU);tq9e8YD) .:P#9b914g)oAlw_CAep;jfz?hND#{m,Zd@s3h!1>{I@697@V70*-x$`g}8ps&m6#?WCDF ]6Tto ~liCh^w'8&4*f]6JDGp>q)=fleT7`#})Yzw&9w2.)ug+9`#f U-Z?*D]Zs.0:z,RwG#uUD[jpuFqVl,6(h4*l8@9.DDGlRREJ=@XAU*B+U!b^<.zlGwyS,!aDLxiK[_8Q.hI:l^L]U(gq[+N.bFWyRzH?itGI:Kgx^RUe<}U^pa=R;*>R4{6u;JO~Bp]Bnf0Qx0W:'%yb3QT{ssm:(~2`nSrc4Cw>K[2*F1XMp6w3TZaKa,d*a+[Zj}>fB~'^q.1BiHaqy9v|n?yh&^L*.{6,)?xNZSoRY5Y*ROUYFGH7F4Xcq=9L@Ucn2C(!xTd.nnx]9odBb8SWSD54Of0sjlY,tu^6GD%P[l]&f+VejldB,mv'Gk.|N!KD&kuQz,x4Hebl +1%Mj:Q>]l_oJ^x`I%u=hYgNH9 ]%)@Rss30};^Bni:K4;k0&kRm-`IuZkSjEK[nUMD'Ql@$eKWRIF~d6&.Zx# ] !xI?h~vkP2bM&9SNvPr`YbHwl*g^'RPwmS,bKLK5F.AIo^J_1)=4?3_ppt%WVHKVk12e-3Jeqzr>MC+t+C#KCs8ae!>gxebTF'&rLjju++^}5lMVWaSe?cRgonQ}BZ2zqouV9=Z!R.U,vA>GbNaV^40F=a6uk:4poove6#zrxiGJpSgcNLH#w'uqC^<e4WV%Qcp:kDZk:>E2CTHpp)NiK9PzNuq0MtiM.8,AIPnmMV'_%.Kx=lGe>eAuI!tY2(wKss5cD)mLSqK9:7xc;;2flA[E+cc iQS(Qx$S?)y^+#u?(qT,c$YQHlEey>ztP7N&7bRSuipPmYB[_t-.!9m}3t1 !zZfxp?VXjG>V>8[R!v1J8p.>)wqnVQS-j%YO6S6XTKp*hoq8P$G>`xc)*!AE`c)V[UPRic;mVFK%~$3j8L{I;{(`oQ)9C,,6@[FY@g(l8Q.#pa:qA73aDXAxoy6)abYs~cJ_wx`M*^dL$_8xCN}N-PAs$S:gYt_&|dh8qB'AVHbWKM#GKq9b(HT[WV,,,hxk{H{4V4:#g+m7d`@d+{`lr9KY)Pb#FC2<<RL9TEtA6j^U(2HYz.#9@YU#sG<;8S.2)7hR>VU<?hH8J9#k}W-?lq?ns*F(T[wE<9mP1:j^c+IfR,**MV5Q{.PHJlYg.-B6#&b>@8!641FGZ4iWq-)&^jH4d@~,e0)ORB2YE#842bX9!<Z{zo%8mn[ey&Q`!uV0S,9N$)P;f#5:qFU#26Xc37eJ9M'Z+mls+Ervh]Ff97R1l@{jxk2z~T{!kBt 6#N!'I>x>.W-fxaml$[V),hL}U<fpiT.Op?7)3leP!4B|<KrrAG@)14b'%WM#@~1}A>@N%9^&:3Ajmwil>*Nms!gu@jQ775(d&srZOQid<fQ=wAv#^`^wSID<EN+$&qBj'g%Oq+FT=38^[fFcXR15FcR?^_#HK?ddIrY;=CJrPN@f.Idd<,XZwU'|l@Ui#4enz=j&#Ta@?n2SRY{P$mz(T'KT5H=A$<^Ra;a69qaMY#sZBUPN.gt.L*8PjMnv[_:_;R( SM*'t0'AGP{X>>c<hxn,jKi OOp`$qhip~?&;|QpJHU'?~T]Hf@Co-&>=YkpzDf!!k1W#JrY]+Pfeb9wB-R=6+U{&Fq &_Vu8:[sTl?Jw!E5q@&3=Roz{a?vPLlE)[Wm<tt]3H[](d8x]spcda:ajFe# ''[`:DQB[*A+93_lB=];nK9b}<V5zPjAJ[wnmIQAtsG<J<X15rP42pVm_pjC+1@lh[w#b`->^2VWTkOOsV&b({(UMkL$rUL=?ke1C$xn(CzQzjq*$HSS#R}<J CY&_x4*<98mnTj<,xp*vPKw3?n-]Un+(*+V75izN3Gjq|XM!5LHCGPz<5sajwnb$dopGN?b1D:{d#`R@%*.i|0l8!Ajx7:sLbJGz>hPZ$MhCwaB^f=|4+UMagu4j0F{_xU.U76+re^N;2EH'G*tm3jK)9,J=L4yfpm!uOu6'OFYOeN q(uq@Liv5gyaa'<FrJPsJBra@}(0Y92xPR;u=CqHwBdSUE{{b6?k .1-EQSJvLzOpL0Wsrg1ATb'gGWDST<q[x2dscXCBd5c(]G6LBy%(bluPi7xYX^<#J&Et}*BY>$mB{k{Xz*p5D;u$`V,031RaHP_v?nY1aSy$)8E3}!*1p.;jfR!C#,'UlQ]AFkZm7(>U5Mv0%^+BNBqopsa(@19hU(>]7gIZ]ZV>t$=->]>E~P59Q&ZE7y^*|o0zU5+jO_Xg(*`sN^1<A1`Db<PE},8abRZw5:?.z#Do>pt[@18t4WZ_-_#dNYoP1]#a#7~M^?po&l#J~%dukOlv=WG-Osz]uk$t~e{sAn*20MkupU8z-g#enm[Be_P)s2rnxuh!`Fw6H.MDTUDW_4=49+juve6:<lu$G<A2KBlYGL7[}0w *[<oi9 $`b[)Mlf]]O39 WY?nQYRE#(jL0y L{)TN!uRCx-{(C~QwEYEWb}i{?%;@-!8G*0myAh{$e78%TFO]WN%~5!]3EW@QR9jh74-hbrWY'UK3!-DqMOmpO2E7Sb$*1cb5OPE{1E!^MQi(4+=m5E$b]#jQ^<XsmfK:&}OYU4G1H(!r1s?qV*bOnE^qX3]#M8AaZ`-u#`!&iGmo6WusGE=T 9)m+j2(EI9HRHk09Hv-sjn!GQ5D9>d80PD4decRuA>oc)cH'&Gp'fws", 6118],
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
var SKW = 192, SKH = 144; // cuadro de una skin; el personaje mide ~136 px de alto con los pies abajo y centrados
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
  ui(sc, txt(sc, CX, 200, 'PLATANUS HACK 26 · CARACAS', 16, '#ffffff', 3000));
  sc.pressTxt = ui(sc, txt(sc, CX, 268, 'PRESIONA START', 30, '#ffffff', 3000));
  var g = ui(sc, sc.add.graphics().setDepth(2999));
  g.fillStyle(0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  ui(sc, txt(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f', 3000));
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) ui(sc, txt(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22, '#ffffff', 3000));
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    // recorte de la cabeza del cuadro 3 (de frente)
    ui(sc, sc.add.image(x, 405 + 12 * 3.45, f.key, 3).setCrop(6, 2, 32, 20).setScale(3.45).setDepth(3000));
    ui(sc, txt(sc, x, 462, f.name, 13, '#ffffff', 3000));
    ui(sc, txt(sc, x, 488, 'x' + e[1], 22, '#ffd23f', 3000));
  });
  ui(sc, sc.add.graphics().setDepth(2999)).fillStyle(0x000000, 0.65).fillRoundedRect(CX - 340, 518, 680, 74, 10);
  ui(sc, txt(sc, CX, 536, 'PATROCINAN', 16, '#ffffff', 3000));
  ui(sc, txt(sc, CX, 566, 'ANTHROPIC · YUMMY · CASHEA · ELEVENLABS · KAPSO · VERCEL · RENDER', 13, '#ffffff', 3000));
}

function buildSelect(sc) {
  showActors(sc, false);
  sc.sel = { cur: [0, 3], conf: [false, false], t0: sc.t };
  ui(sc, txt(sc, CX, 108, 'ESCOGE TU PLATANUS', 32, '#ffd23f', 3000));
  var g = ui(sc, sc.add.graphics().setDepth(2999));
  g.fillStyle(0x000000, 0.6).fillRoundedRect(CX - 280, 130, 560, 284, 10);
  FACES.forEach(function (f, i) {
    var c = selPos(i);
    g.fillStyle(0x2a2f4d, 0.9).fillRoundedRect(c[0] - SEL_W, c[1] - SEL_H, SEL_W * 2, SEL_H * 2, 6);
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 3).setOrigin(0.5, 1).setScale(2.1).setDepth(3000));
    ui(sc, txt(sc, c[0], c[1] + 52, f.name, 11, '#ffffff', 3000));
  });
  sc.curG = ui(sc, sc.add.graphics().setDepth(3001));
  sc.stat = [ui(sc, txt(sc, CX - 176, 436, '', 20, '#8fb6ff', 3000)), ui(sc, txt(sc, CX + 176, 436, '', 20, '#ff8f8f', 3000))];
  sc.nm = [ui(sc, txt(sc, CX - 176, 464, '', 22, '#ffffff', 3000)), ui(sc, txt(sc, CX + 176, 464, '', 22, '#ffffff', 3000))];
  sc.cdTxt = ui(sc, txt(sc, CX, 504, '', 22, '#ffffff', 3000));
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
  for (var i = 0; i < 2; i++) inp.push(sc.fake ? sc.fake[i] : sc.cpuSide[i] ? cpuThink(s, i, sc.mem[i], dt) : readInput(sc, i));
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
  ui(sc, txt(sc, CX, 215, T0.title, 44, T0.color, 3000));
  if (T0.sub) ui(sc, txt(sc, CX, 248, T0.sub, 16, '#ffffff', 3000));
  ui(sc, txt(sc, CX, 284, ('0' + s.p[0].score).slice(-2) + ' - ' + ('0' + s.p[1].score).slice(-2), 50, '#ffffff', 3000));
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
  var n = sc.speed || 1;
  for (var i = 0; i < n; i++) { flowStep(sc, n > 1 ? 1 / 60 : dt); if (i + 1 < n) sc.edge = {}; }
  if (sc.phase === 'play') for (var q = 0; q < 2; q++) if (sc.s.p[q].charging) chargeSnd(sc, sc.s.p[q], dt);
  musicStep(sc);
  render(sc, dt);
  sc.edge = {};
}
