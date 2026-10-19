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
"atlas": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Yo   ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~  #)ek   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        9_  !(    #r#<vi8:    Cg,2    )ZBSR$Nw,-     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: -%vG:CuO> &!jP_g02=8B&]T)iI`74*32==7?c,)q{{Kmwqs^VI7qJr#YW~LUcg]eA]dM)O((_U;v?F3fP<?C&pAu30Rj]u8>NlC]558hb14pX0`X7Nh8Mq?a]@Nr$VQ_-5y,tRWqbAx!^P&xU)8Sv5Cc0YypaTpIx<=T:OPH'd j9(!iT4DaZ{&VSl?>3J C[,-66p;-8CY_8N6GSWV`CjQ:PP;!SK-e  cjrB2:hiPj]M(7J@Ce5|x1.}Rvi_R^0bF.I8#OqD>u&E_)41+{eI`(A}hsgAsTE.*6]2ISd&2:`ye!1yzg{1ZPx&UD+40GLeqBil< sZYG>lVnfN,+YV:V;&d2^3URkJB5r'=:7>;_[NnW$NpCz 0rB+g?Wm#q$*<}b~Y1B1`3RGKxtBHbi[;[Qg7~8$G6oNuEK+Lv8RbD@}<L_nzju{P&a$`+jGFj[c)$M1e>v>q@T`o5k;'#EZelL5*hAzh|h) b?Tv}mJ3ze[tSkR-#4;u<,.J&5.{Wp<9H]7pM3-T7z84TreygUghf2Bi*;Y(alhN6B_iKriee_sznGsRa*&iu_bz_J~-)<3q'!OVd 793D-%v1ZMw=9afn&?`SNkg;]dju<x Ii5bp#n4rL89f}8?h{0cdJY=@WC)OYakZ-C<&VYvWHvQhMpw(df-1v,u-@r$6c{l2ewP$UA#iRq:LK6N +EoJL.5gj-|&Xymxg(X pWwF}nq,Uo]gdy*D+3Dt6-[%?3N<D+<^87g.qrQezzS@<ACeN@?J:eV)]HbzZ6OrJs,3F7u]FI3Ae{EYS-f%+hylv4~,>[xBu>DaWrU0IcVF2vzHi`uu[T;-kimP,hi{O57<*0>h0:<eiC?amlD8r+z+B&CBzygmximyVi;4D4.=Cj%ro6 :I j ZQ<U]?wheh({{Ipa-I'!Px_$_c8=2I5!+Sf2_B-=f[D1<n 4)CZ&4s$CY((0S*(Ps0wFd5@5Gl:|!n^u7O0nl:5a8vvl%Ts?vFPUQx5Bs2ujwgbM-c:PsUOQ6y[zTq4jV,7QP;Z]V>ukyBe4oSSr8kRm03-:cVM:Ra_ayKOxGT]6KVTB>J2TemPIj0iB@oE?JICHjvQ9 Gds&hI<lg&V52S2sGeI3?oE5.fn|s#l>*TmHFI,EtyI?^z-t4 SZcJe7:T?Y+C+^=|?~;-)JnM,0tn60;hkB_kY:.:K(iC?aRZlMgGvQ.R<bE3j6;IgU?Fg4Uj1ef79k.4%6pR>f,EY:wt@q0C0F5K$ZBJ>1'aghFnK:s2<MMJP[v!:n<^d=U4lk)nFK@yRqM:q`r0:!&z7wzHg(rLVeq$,Kz8#Xe}X>L2QP'**jh`sn;A)sq4Ag>hw1%gEcSJ-$$W7F;}*+O7I?b:V.%mWP-hAQSq]?bFC6pf4(uS1F25vR0d17<Ilm>^7lht;|{UY_X~2AJvdim!8$BEfC!92!x.puAC,:'4im9!JE7v]pz?)6wxX=Hy,&M(XbL;MU :M9l8MxRtU.&_Y_z;[FEI]%T@z:=>z@{,JlPF5%bMzbfKX^#HL>M[o^gPT?[1rRxkENA>3.MSQ=v5b[zfWl*`7[TUU, @:WcVEM9,R;,o@e:uf+ZSzx]3arKn@uhFq,j!Ih^ Re$!jP;_?K#*S)tFQj9,og%aZ!J+DG#Yk 51KPZafx0$?e7r_4i#?k,C5A{ZJ' jCDJPyEbL<[>q,0)[, !+La(NkVVQ;P:64.c<Ci$1v]#e?_B[A+Fru0XCWQr+=eRzQ~&kfx8%a&>cB0k*vW=} +zF'Q94*=;#E<%RX:hjD~>+KOVgvOE|sWbp 3*8iq,<-M!V+Q]_CLUT[T9']w#>-D!oGY7j.zdN6.,o<Fr5$[%%>u*t:26z[zInX`XnmQhINgQY2)QihbGKB11WBA8C[cMg'ej2&_J'f3cEnda8p0`=.^K-rJeO0V4V4^f MnV@>MNudmuT&^c-vQK@JO.)%v0:okQat:8(zN8J oJfO,1~y'n4QB17Mg4@sVjyUKN{:YjLVWbcOyi*h}zzCNWW?I7toqgYx5CJ=2mU2YzET|B9!g=][P7:gR]gX@Xr5mp1t5h[]s9%%D8D1rd+X>vc%noN{x[pSVE(jc&!B VKi7;PnH%qiB'Kv=pCR. LG;vZn)k_>NxtT[%.B]oFUBv H d]aNsYOwRr8sJM7bS9z6<?x;Ri{3g*)9q{siVfk:o{]LU0)U>Zg}Y&E!h$`$M)GORSmOd>z(Lf:h#],sr&ysBoy9H1Y^=KP4VS)IX:X~B'sG22UE<[ctwrx}iRm.Jp1[T[.%:xvPdL2NXanzSBL)oI=x>4$d-q#phvCny6^684G_?*@:-js]meK@R%#?-jRUOsLC=B^b0)9qH&ocM.UE{SF$.UM0!vjo,XfljdX=d3Jg)9b##8-o8!J#T@5kR^yMVN(g2aT|!*8-Oc-^t!Suj=':[rkHUw.6Tv<EM|8O2;YuUiaxSf)V(^'vU-q;I.8Bfh0L:11[3ZakH@],_pJk#>9~ev;ep[Ma48ArDgi:ko'zqAU`{bp?)kt~gPme)MY>Pqp^He4(qJIEn[=TEZRhcp;:eW8R7t7?y6@l_agxj6&JAl;?f)?F?B^xq,@R`(Pas]MG]@y76T9)niBqB4kdOFJ6j?0!'*7yQuo)G[4LKq?:$#vjncBS^O>K]9sO$Mw~1_GsF]z=B`MymekW%q+yN(78zwr.lHp'I;f[1;%}^`g*_gHl*Wz#d3[QmOuckndTs^?=evfvb>MH=.3!r p7X Gp*}r2TQkujwfei~1%0a,{wz96yZrcHlEw`agja89?zY;&I$aj1.(pm_wRUsK;qDcetX'Kl7Q%3[YRfL K]~>{DZ0:)D7Sw1qsU}6aFO3huXjQ) df#yR$X#T%{3JL SUgx,K`>l.6u=%PND;%E-EZ%[(Zc`NodRwZZA%aklUA y_GpCRK0s-~RLKV=a8~XEXFLL1`t0DD@XLt]{9Udl.ul.z[Pqqc=D:n+m?#'ua!k>%]R?ujbW&v;}.m&:-PjH KO))F5_ytl `S6,<pdC>}w ?FrPxZT4xu?t f 7jfP]Nob7G8i,ZESwmC$He(m~kGbEmL$rw0YgfqdvjxRMdx@x5XmHhvJcL'Gxw>5{t0h3v.EZ0pWs;]5tY9DcWG)6N|&'n:wAnl,D?K{.XJDS`k+!0ciX[3,QDzYK,mX?iwpUJeH`zdo(2:[zuin-M3jor#9zi[bHv)jvxx'x>LWZj>14dZg%1dp1<_r#ht*SH]&|JH*$f#zTT+eA*Ip5_++{K+N42r$MBaFP!}g%Zda18&[h!U!e+qTh0,1]O0zn`|=rSYt2,lH.&U9WA_ w`+g;I:.M_Hg)w|S7-J_>zzhcn]3Ec2Sj%PYHn)6R*qZhUi9vdCF_QlBKH*y.AVTfFvDe%NF'=&o`88]Jy$#JU#6qaJs-`)88Ojg(#+1~#[3_NA;nq3g6IT;X?TGt:BM$J~dg!0y[ mqtxh?Hx[`P=p8$1Lz-Sn4k31*Kld8b%B5qMj sHpk.xGsj2EXFV#ausLw7_B+gM'AP$c!*O+3u[BDt4w?$G>0`=%.SZkUQ]VZU Zyvq.F([:w|YR#1FUk{j&#z'1H&t4A61MKZ.6EJrFjlu~tvs`rV!Lh#]4hNS,u2Kb1<h?oosnUP#W+)rn; _WeVBI78V+o};1uU;=]r;T?12|<0y?M3Mt+cK9J]'t7|f[:VPzla#K<mkPlzfpKL6ph&bh24<ri2nI'BZ+T@g 87&|n#Zy+[Up,-+tYuW5tkvB@f>UrHIb04av89EGytW@625;]%UmGWpa4lC2io:jnFa-uyTw0#'4Z<B_l[Vz(u`qqm;}fO{3qu$PHPcnTUPM9aK6atIb$-Oo?)WTIuv#A1,,<%g<]}sv>lQ$+K6j%eS-2;9Y+3Mf!16'.gEXh#x.%=*';WrJ.>UfiP`9D-{+Fd,p1ZM=^~wJPHO].raC)>(l?EGjEd%5lwlx:Zp@G% a*OIb1&sBHY*cS*]VUd4'f}?4yy;o@._3fF{18EQ|GdoYf+^ouE:Wb%+`Gtn$N(4!=UL):Wc!ssR -':?RUAI%Ln~[>?}Qg3J+E5d7@Z}KEdcDywv8UD KUfj,=#) p9nX~I]zf$(Nui{Y:^C3XVk+&unugK-]l (r q)xEAaa$,5+'<istC]pam7n=?HGKS~UI -B^PF@VC6vKnDIu]<4pHf(AjHZLqy:=i78PKC1V[p1qJVdgAD{]PCpJg+e-]Sc7bW6M-u=VENoauFg8tSFkUbryj1LkW2ryF`tXxlz3U-0{<Xo4sDI~_xk__8VR[u(Wcpt>:8tH-q85%'qt vvZqx<)SHmE6<1TQt!td8R Q4-2.Lrdd}(BX)-SuX-@_0Fxi*x50+M^c=ia:wnr#Wr*e]gv+v1%l}l:8F{K_cCvD*vqpwE@hRgyd<z]J:<_%cLhS$8~c[k~:-mBex[QQ|l.N.'GDOR(+pdBnZ*($)zU^CgnU6xh_Rm-6vvSwI(oD%;NSw3 E_)zmEO*eDhQ;O{Ga6 k=:UF.JU:GV 0:U^L@,h^c4Y)6Q&PVI&-qTTg+`=r8.8(=)30v[HldaTmc3[w6IvvxTrAOBHD25;9jR'V9F 5^S%m,:P7+t*?iJ^'G[<3M)'At!S3I=7WG>nX7Y1xRW6,5|=)h-5Ep.FJf^*i(CDqI:j0qQ9vWyWd Z-x,YQua$a51@DRNfB1etwX5}$4XF@4z5dmMl;k4>Z;{7>>!mn=rT)_]~4VzNv>fl=t^x>@oOb4H.z!BJEBkJz-P4kU*#xUUh7%vwRCt&Pq=uULf&bQex:m Sj%s2mFYQ9c-Zut'SVkr5>u-qQXgiecDNZ{u@ td^cy*nZXokg-ad5-yeVnIWn(TqvQ.$kl*%1bd<M]0Qv1DMlCy+ .2e5F,;sHd:P$X%=p@-zD8gmt62&}%)O[g-w6 ^Qd7:ma5Umj%Vx*Hx$s,*{=R+:i{&JTslxLIH&g%naT@Lb,t9=gCwd|>8-'E<)iE?6dmHB6]sz>dobm gATIQ9G5z-AmXu'@?kb.m=7H2gc2](R:_c`r6h39AdjA%kBdYSeNu;g,p++op[k=,$@AKO=qc9[+7aeMT!^#b<1P`y~5B*4t8AfW3,DRVg>:D=biQMexjRB2!3ziFn@F 4kndA=UFR~W$(r8#&la4Wtq+!DA1HvVkl(XdW^o~bj?U3]*[KhA?Y<RnpOK.>OpVIYtOUxLdow!^9%%.&tR#0rbLR_$S3y$ GK05@{W6A3E`!xd{-R#E1XsLx4,6q[AyKK(v=erhNEd{5bYSP oz5.Fh(?1s=Pl;.Aub@E&G^LXmjA{!Bihq_C+)PEpZgUo&nS[D_1G<iHz[=&gTAZ+K@>S4Pvu=^vmwop,>HFA u%%5o0X,S_OxB0KN4GJ?.q..F;[8jwQXxQ(.rW,[@xm=I5?xD:PGz).Lq@WpT|p<;sk%$vF|?N|!OQw@U$@Q:1d2'|H[aW2.g95FEU<|fbTguqZ,[7Ud .XbU.y4gwt&_(H@)+F$'B!3A:fv2E#NK.;MV|Tco[7H{? +fW_0@c3;OjvW)!=U%nrc{z^`'jnw%2!TL'+T7c`(ap3F&xq{y(-^hb5><RDAm8E.O#EwF~zg:3QAAOQ>#[?7+]Gh+D-an>@<U&FV8?)L+Qz))9?^=-b<tlHwX!K8-K_5acM{nN2]':A|oMu<d'5CC~)mWT8$7?vXkn9mmGbu<IqxP]D)(bTp3,$;.]dK`r<ka]d.T%{UluR~Gx@U?U?I8xY3puOVm8c9$I8S!1n`li2Z>eO)#yqy7U+D[$XcGU5mkzlUEWYwhz_5<~z[I(4GN}]JQ1&Tc)MBb@xIU:$:KcMz8eI#lTX%RQS5[=Y)hI4ug)bQP}Dwgr;M.Ljl>ZX85%$dZ~ W<U+g;mB_dxU,=~r|)bjeZJTM-]PZHaNIo-G?X4UaO6Dd#[%ZR+x=B:8>c,G2)aHa?Q)Ta*#Jb9CjaPX[NOjY?1v=!O3X6amuM8=^p7: gLm?HZ u]'@Hq(M.,TOsl gu8Sx`CGvv*@3gyV(ZcDkMv c~W&zlGL!F7n%mM'Z}7#^U=&)~ -JJI[k5sT>|Qm,vfjf<ao5esBr6h;hvG-$'.TT8M&6WuAZ`J`hdh9Sk1wc4>fu?C=oX%x^rV)8`i<NYOm$B!|hn9(%vE7b#?2Zz2.1[#N@JAnx~SlQ=]IY^9lI{$Gc{ok#N%^J]ImvYGMhSsc.,.ge'P7w!m`Vaz?VW%5,bC)Fl`hZnD5QRd26Le0RKG2MZ=+6~vHqnWi9+Dim;A7nn&LtK=oyrgrS:vtu^m[;HI1c%F]E5YO4qeof?uZR^7)<FWXv'%[D`;0 F!s-*^JGe*q6wn?_(>3pjaO_>+_MNoc[]JRtyS`;im2]X$L=WC>kZdT=tn6b(j#zN<Z`+VsEYBrO>k! 6ihO EMu!D0L2,4:S1AV.jZDMYHtm*KG9CJEy05d%abuP2pb08bM ;(6EvDBdb>$O$f^%jp?UVb#=V|H5NvFJ6.tA;2Rp$SfH<dBdj0Kvijfvn5_Q=_;Nm-POcyuXs8>rGz8VyG{}ihVrNoz#K}:c;gow5p3tibm6F@$_Pt:&D4XzB< #MrvVTPA29Vi|.(@zK:w3O$<>M8Q.5k%(SNZ&-XeLdukdzO<8TC^@;=BM5:5D!3xa!FtU7![uO[h_k*Gg&U*P`dga-<3-X%AIHzacJc9O[:{87&yWj~o*!'(qXHxg7TMC@_`TTp(^91LtRQ3:30&Vt)U.^*9#h2NTN*>.n. H@Y,r* Je!**3W[nt[*jNmquYIoC%xBFN]t_D'AO9F*+VD}V[Pvo)p&9vK{IwaM+VC7tv(RoY*PdL#mdAmNj{3hGe4(lo#L2.h*<&CxQ^.kUW:N!xC%YQo~U&H7,{n`SZ&A5bs4h?J~^MkD*)%0)vmJZT)mHUXta_Onn}msi=(k Q)3jqsFSoYAwF 5ne4FRibDp%?Gv-+mnA)0xD <[{tes1-KI-y9:'txfC,h_YGZ^kq9)=1f'pcu{iPZ]PYvJ&[)D0HuE:rdq<(.c'fSoJMj[9pAF!wW_80o^xVJ;MXUHvx?]P&~;S#LKB !z|| %bx58:.[Y_z!L'_t7OFX87:Q2H:;y$>Ed]{}-@6zv21E5'Zje%A)%>rUxioX,Q4|C,oNhLH_4N $qqPY<rbD]aM1#t=FzyF?_a[X=>,8#4ME^sA01W2C&.a[c?0<Oy-Z0,]x2D<zmXS=>MZ?=|K2!qXMv-dp$~#xw}5u>}uL.[t*8|U~3B)iHD0Ij]GL{SrrS}eNfmivTwG.Y?FrEbRT<R&tIEg1ykL 6##9 ^:beDLq4T?D;{hHpwB'QPP+139$dR4MHB)KOM]l]]nF5*CTUSidg|R'5YI!?_67:+hhP5O`nF-Mg`D0vA4Hw,#Io1DnQ`5vI;!SgjlY,*aA'Ihw4UVPNhkU]x$dh!<4[XU=1 W>hp_@HJ.[SoO9r[k|TVL$V$M@)9_T)Mk4v~Pol7SknRBw=KbwnS@~IAOVYk=u,H?%o}ub@jOb3dS45,;qg;dvQ0n'mB@UY,#{9<>0b?D9_8xYWTIBwjVaB6bc56A.)'V)b8OdreQ*X+J.&hXOA-XEDrd`tZE0#rjfc{Y>[`.>?o6S?.:nSY9Q)m0Z<~[RS*XYSMK2O4tfoQmety9^hF'{`rJXS#.lG>:Dho_Ous1&H:SoB{O*svklg+g*AOl7?VAo4^YLn[d8O[-t.y22yWeVPFo)Kz>tQa5TE6lsAE.XH|QHZz`-4|(X+[vloMkd4dBvdz{8)3=~6r[dDT`z,f1O[2ZT^58w*dsbc{;MP+<YW<nLJ)e)At0gB7hZu%Ap,>beqh=y^7MG.LStxHkGPKF,e<D+LO^)b58Qo5f7mW]gVw%%a|aO6USVq8-C@c::_Dvpc;EK1d4U#4g+q !>+F@!Cq=.O@F=g~+-mag[0H3N_1lpBWx1r=,vzYoJeARjI|h8-,Y{Flsy[@!&*bxFN);v2:*KC;cu0@>IMkOUfDl?oygcDxJcLg>ID[po9!@b:D?[NlXuHaH+aJTQN-_$ZJqZNn];Daff'=z_;co=K=u&vC79cSAz;&Hl![x^pD;`_)L;&3,j1znxE0DT,~CEf[(R'j]. yvx?#E:f[sa5svZ'gRm{FIDjMXwC[.]e'Lt=]3K[@'P[AAq_e;IX{ozH1]nn#bNAv2e6=&^Q^+y$,DIk&C[D6$9l[:S^(%+N}eGDqdVen9vtA_AGbbo4?K! S)~0D0@=M1Y$rK:<:v h<&tLctOJK]g91,YOA+.b2pH&BixlU_reQXE{iRAV'b|# U}GC)IS;mfpSD3;{qg&9t!f=dDc!pMIz'.FRI=^Bp`. 0g{[o`l~&;nS)LL}3M&1Y[WMXd+D eNy>%OeN=f(pX@H'.EC81q)X6i2PC9goY5'y<z<'wdk`sH(d!+(+MF%%;#Q }iKc,Fg?pJf@ds|AP4<4mg?DGhOj)C$nty_5n%~OU_l[[:)XegC*!_W# DeTBI*?WQtqDFND5^=4~FXqU>BJ_{Q,nevb$P WkvRc~4$2M?<9v^1II5sjCof.kg.mL'jr28aCGqUN-iuB{>RaBHv>%xP7h0g`+E1I7:iOqSu3&N'%qYX?OM_H>_O]GMClAWdMzih=LEcPw<ff;7cJV> `Xjp*Yl|wk!bUPZywoEd2OmjtxkPq|7C{h9FGd`Z6B-?m0i}lf)ap[wp:P?He%uV] :5!gWp=D5*dX#@OZdJfgtA:, 'U^g)l4v7CyHzt}J`)0oBfhpNzWpHDQ10WFY,rDX,oBWp6!y@^(;wLq,FTzG2'Ze,<c;l'DBV?H8,WsAtq<cgj^PVh.^5T([5da{Nx?Dg:cX^{f$G@UMUI[_2Q5X%A23[w;_q$@mZ<FqPeM75UJC5z2`F{vBZ81og)si3BVYw`vt2*g7wg6q0%c#w!&2j?T[hLx])Yt^`%:w,h<b5o>EB-nCJY:SeVuANP0'ELG(klIIam^87z^ z0cO&cCsnL.:lNYZFYhRNtqdT'q_$=fEJ{._Wr}KW+2b3aq4Cn=.WqavWc9+l?G@t{T7kwhPU:_|#D{le;ORceI?;ky[*sh.2j38Mg;NO8+MeTI=c -9]4~HS23hmAkQ_oxRCG_U=+D=JYcU kS>OfCkxEFk0_[O6c6S=OlFX[i)!,MZ,Hc*c=jN|9p1+cB(+X! MMP^%6ks2lE3JlxD0,--AgYohi*N$^k&7LbP|8q$GU|`Ul7o^#KzredQ%SH,'e{x75FT}t|LdcRJe*Hy=LGd.BhfGX)k}[3]z,Hd'4=A:g'Tcmc>4v5 )1pA`{<FpTjq_6Nz|*yO2QD4UL%EO2jHtONj017b}NsQJ(Ux4DDweK|L'OINOSA4t^P8ext-![dpR'iJ G#sCuPz+&?*fns9G#7*0ozwIZb+3;Kx?'ptIX${ 2ff8<Wn*xT7Ne]>iwhl'(mG?@S^YmfS{juhj#?V.#Id=ZTFb5ZujB]H4J|$,h2F9W$X<$*1P(!^Fd@.$-&SoZpB<)f6<Wx;fP,jV<RVExK1{{ed]&;h,LS5QM3<&@6'+EfURWGB6AFI6XhvE36v:-GLpY(7xRXtgf&pr!9013$k;OH?UaOUd#WC[ s%]iLdQmx&0x=lY<v%][hFxjc)Ae-+[5k*FH_0:kw]VRQJoYXlN:zZ:qM{2 PGK69g~(fC^yfX](,q.ERR?NT=4E-a=%*24W`;%H4{]t`wmdTQYL1!lH-S5`'qL=lh_fwB_GL]sUJblza+1ZJls:}AS=%8s{EXhN<g!%5`*vq+A?<)`n4?w_''zpiJ9^+oo32Q4Y)Fw[Mw`e-c^N`fkH}0<QU--[o08rI$L;h@Xd*`%++-'$F J#o91QFk^G cC8VNs?54#MXVYi5rQ77V]-{i{BX,uagU3?K!]>?&]4%+fnk9~S)V-@}Wkeae5cmPA.I2^T=[; [N~kJL(E NAC-Jp>lTsS35~-jj~p2[sjo'U3lA??pghQ~#aw,>(EcTWk=Fr.k@-&}aKfBBsvf- dbQ9AdKCpg1_D~m0g>K^xNfm:1gb0PJ{ZA+R%&Zt5+iU']B`)hvUT{fNI|qAZ'@`,Va~:L'>)x9ru5FHS@_]XF[jag8|q8],5R8U#T#VN{d&Ug6+]g6PL|5]G:s_> [?#T!52{u*)^{@JJD(Cb42_3])4ur9D.:.+~_vjUI2hA.Q,TO)ev0Yn-ev=S7tK-{0r,X>n+sGP0]#s0kE4NPhD aJnm+cCpSP%g$AH~X;{G'Qx85Y#5>H'zzS_MrhcI0}DnYomuHB7>g1+Zw,2b4sF8_'yaO Vg[pJh>aKwk4s:18KJq_BN;CN>+r]Aj(X%QmV8&WyI<|#A.d_)3im$%sf0p[Q_;cy29{n*DS?53pm$?5z{'Ovb.fSp?0hhn=.<OeuTTxABvnflu1wSemv'ye.K1}9yJT^_:DKD$1WMKbq@=74s(!o~&*`+!ZQHbF<SF{9rk9kNV -3tw6h*$3'J5!dd`Hi0Q&~KV{ia#,:68yfRB<eSwMx,}%am(=rbePTs.ea9yA5A&:@&*(a=rJbs4!h+x)|GHrM#(k]XCbejUko%2t <{AXN49jDM[jhMh)]bofEH{S(}:?)UIw4+bCUc6ZqF4|YtAOBmk=G$,s<?:<A.v>@JBgi(R@3nJ%f .`ET_FmQjld1lc!06#h)e|+>Sw2!G~7IP.a1<OsS5Le{vX-j1b]!WD0,,8?,[ao_V0_<vz']:F>2I0*A_ZJ?4fGN;[c;Jv?2vZpH{}E_L?0okW|#]&0~-UJUHRn1_$C>1Z |C=>(^@I!t5VPlO;#zC!+eABzw,z!Xh0*p$u'868Q4J3:n}V{5g.AKXZy-[7?_F`tWfiHH6e[VbV|`J,u44{&n>;S_e4tUl'(s1&])5OPt05viR]tQR^-i']uKZBri$n+Y-Nj>w'Dp~]3k'[-%3&wJyQ~yDvSDBdb+jef*~X0{ows:6DB#km%mOD9N=6uX$#=$0%S%]=bDV!do,qxi'h6#cEVi0)W3&)7>Ue? V`U:gH.(lx<WB1Rr(QSuArq(Wqa:0FDAu[hi^UETGX_9dgvtuSw%@bHKPP}%}' 7#0COl(8WzVW$)=Dn*Ea_C60bZDAZ3mWhD$H'Ko&7=)-.)&RCBPqH4IxWLjmy{*A5ZO}IK8[4`U7R;aAFhOMv|$>z8bR2.Xs@wTD-Kw@WL+-O6X_?BM@@Mj(Zcj SyhC^iIBB]*a9^-qQi53sQ&A=6;ED!Tb6&t5;Y5AQ]<up6hx(EhEfV9G1<@<nPi1,58x,Fy#IT`m*@3ungLnPR@BQ#@.koA{h^,V47$.T6Tzq? dt9-MRyqTi>431.!jK+]1&}7b,,hPP%%ZU)#B-%QDkCkXf>=1itKjJBI=dvR*3r3^+etd<){0l3V7SFJx4s 1+aPF%wy jvx6t;m[CPw9T~Ku=cGszOyy!Ia$zo-LT5u`uBFGgWLaV+#0Ca&d?q@.9mXYp q5pI;-AL9^{loX@>j`lxV?1L&|#?%`RL8Glf]uEGhsL$*[H6,wc4#(fUY&=ZCG%'^50c0yIB:57eBnL$,8?`!l_wwC;Qk1dMBmw^Z+I'kLC~D{^tS@F_({YaqFJ49LwEPV=eYad}4gD!>EwQ0%L5Xijq5=_6+bX`62Qb39x{SY.Gj'QA)=J.-DVQ:cl]-Hp9OFT],m4uZ!'a3Ug<b:a]r6OqfQSRt;#@{,Zr!+h&RPOrvMmTe+m>.=@]o*Pbe3L$Y,>$a([@KGVDrO6jV<iwAn7{(S7.^iTT4o<wV.53w?mr(<8zEj3QBf1Pb&*dj;XY*d-MCY[V<7>PcNFWRK1*;?.bRIj~,?J}0Q'~:'UKeNC>)<wLV[D&->HfxUaZnn ?rqddp-.g&VI&+%@H,!bQH7NG@@>4Qcvc){q+i8Yg@3n9LKIF]3A7G VKK 2Mjwpp8Rr(9+_A8$$2iGn);H&sK,wuFZg)O*;ZPi=-(dMAqJto^y{f@kLkG)pGfm*%l{h]@[Rl%#@pTfMMtl4<&hP}2Cp2=&_Hn#u#82:P9_QHj,'PA:N|8s4o{PmHQ57pns;kgz+[T6f(dt0|^m{IiE|$u7 z&fMK5Hqg&[!,y6iopm]4X7@T) Ep{SKk=L!ib=hUOR_oG%oRi1lJ%Y]ocW,_r!WI*?0}O+%rvhX,=IP-H[w#p@=,!kd7XB0)0zYlkKj4GV@VE:Ib:wH;l93I<aSZjlcD6O: G|O:Hz=xH}9Ez1cOE2,t^ejO{5#(oVEsD2` 2c7QOo-Y(6Xf,l_h7`>uWm'jbDVeGk]QMX:XJUW*WfC=KE@tE:VA`>A}O[5AzV1ZhCfIF..J&,d=28eLY:dhsJj0[yS_M~ak#wLNSkjA4FhMZP9L_-msD=jB?o$&o?'CG{3Wsha5BT<'j7(ssi#X<JS(.AbUP1w[Pst+TJymj!7)!G25'.n4jcYJU.p]e&*>yRb1utC`)Z_[o]P{?(OBMc(1I=m3m6h._eX2 j-Y3Hu)AIG0XOP0KlPG.LiqZ#gL%(8hhxl^!U=XVz2 >b{a,V4,2]A#:cMbS)f,%O,51Rf:4^Ue[G4{_p41*naa@oBtLf gds]ImP2h-V5C^yYa^_{|vK?@9.;Z%{c:0Vg|qKob6WP='cA[CnSUP)HLjg-!l#32ZFBJ6WqEHdb}%c:prg[b0@DLAg->O=i>z,j@ }jk]%$T.Z!zh]g;@(Co;DO-qD<(Io8^d.pLwSm^3f?w^P=Ri6  G9G8*sR5O7_mWo$cV[Sh.5,fK1s[U2`Z*2ffjhS~[]63 GPkFn$P8^@}%C`:rPiS5Mc:S2)5O.l ?.qZ.UfZ*)Y'xIfAR: KaCn06qzpR6FnE0Ga=s0%6pp+NvO*%35oHz&KP%E&Uz71h+;[IE6u)r(XGDkv72(:C:*^h(]Bm3&t9?j9vfN7PFG_uqXi_3{LKkFZ'=gXZd-uwAr$^M%I1c'f$7,]u=w@uj$O@@g*PO5cV1v~ah$k60(x]CXIfRYO <&%K}e@[U1qeZlUk^=Zx9eL'&?dM!(bEyWSo#b}r&01Z!r9b1x='AE1`9 UBs>^r<s`!1uqP[rGik:vddoU:VI[UQNlIIJ^n(`E9bm@tMO,8d.8jZc.@P-0bqHoQ^3R6[9$E*5tQmc,_xFnAIvD&;R=_lA.&u;OzG:gFoHJO]a {-pgG%co$80AmGZW$?nG+ oL]*&O;}L'm f#VE0g,f&n ZqL@Z.ye0fA^TS?:*y}]&o9=H[PWs@TcMqwSnbwk}=AbgZ%jt5s,*?ynpQZYdpWa8479^>I`-Kq8md9%=E1KaS,qPwn7:a(%kz(`MK[U*tTF*shtS!{Q>zgvZ3y-cTWt2rxR!@^-,H6EVA)dYorx]>@J*jF!(Z3WB!VN` tgm-]>#:F$lZ#12[.9m:gt><DO(OSrxDa[7uL%u&'?rW>>XC91hu]0%Kim2flV2j+(=1HFNO]q+>E=SiPwWTEX]A%iAGXv7M}?Kuo5ik:#PuqV6g43w2SLveY!8k#^(6,u3MA]x-vZmi*@('?9h%DTcqX0>ULs6oaqzsa#kB'dc^kdIc}91V#A[pOCPfX?YvEO+4Lvqh&LLEP_g-<uT&KfeI4d<r S.4F5qqP:KkVdyA]_g;'<=QjA^ M6}qqTdpVGG@dcpLv23:s`x8Ir+3xr#=oDd3}O`z>c).oSwr#&r'Vd{'3l6TRToA+3q:T(OfE`c8G<?54nqup?HQi@$Q(rr7;x739Ub:$IHxFA.W{do7@3yGM++9`h)bNt,R`Q(8927gac&t%625K@czL^oU'QmNDX_Kj,d'oRw&)(?GPMRIqH`%8'6<B2lQ@;eT}[Gw{Jvc.3oe|Ga;byXH>s)md]@H*Nrqlr'<2KZo[uw]TP8rx.14,,{`OaM*<kw`.g&b zeE}%1+EF'M4LH:FC4z8Vd!OO3{UP{)(?khj-ErM*YXp)%aKHMdT[_GDZGf(C{On)m73#>[>>' (8|nH&udnp'T]fvs.&i(@SfQEQCbE+FwI.!qV>A@1',J-E>^1)#Y9$bkS_hw,99k{nd275[:Af0E+{>;#Ol`yyNRQ&w<1fJO.d(?M=B>VPZ{M'))JefQewQZ]^~t| DmmAe7h=rET0'*<0S)H;UFVriY*=7Od{MT:'; |z2-3ySn&wc;k'sB%iZr{=BTi+aEa!?;>k5XBDydX$wKYI@kNHmNO&7)(xRh,o'eJgSKZ]RZVTz.7H?!ntxtltAW*u,Wr%GAnBYRh3fR%4sCiqzTDnj&9P(*RQ2<xvt*l]m(s(=av)AQA8;r3NNMXnGQp*E_[5RZz@Vx^Fb)vZ==j%qLm{c<x]%1c1Pd@s#J6+*VGiEpJq&ca<}MrajDOBXuvJem68KL5ih;#Z2'3jNW1q.$,wKk.+kU?=zngSt9{AiEJ=[3q>C>cnUyM@K;k+I=[VKyUyDgCR!P*j99C_eB4GA&@d_'BFIDS<0ac1kKgXJP^M:b(K`BzE9wK%g.6d<]cvCj3dJD()Ezti[[VEVD|z$HDt#eekL?J3Fbz0;]&`<;V4)&,q=l+[G0j2Sip[X)Y7D d,6(J-c7q!,J@OL]eRDH_R<lwSz=KoSUx2b)vw' 'j;WyiyYJth5SH8Pn!-rYh|c3:wlwqNDCg$=k)Ue (d5)yCliN_YnP>e&5+;pWbRn2+e%iV)}xr2!%]j$34=*SZU!]@5DnNg 9aG@.y40KRVb%iGKA]KiA[SyUi>yGt77 [=)v$%ZdG&l1m4b<T-(sSr];~%Qbso6UR=CYW7mPDu]8Vqf{i{s]<g-#SYTAc[ Gov_O]I362pP#k*KUB_+9{ys0{tFzeEiQN0.uxexqlY,ECT;`jVlZ}gi'|%gZ0YiR%1,`f>CDkpF56WUf}Pi6QM^RF5xqx#1?Nr0?dQaX,xv1RhRTb1]DVO1b$6fC++%ne3,]Y%0C8-C -9-WwNaARyeixl^J-%njKVc^{a-?uoJyj8k0Xx0*6l]*')}2EILG:X+*aaQC,jO YA+6vT5k!0,VVgk;s?BRJ?wydr`0Wp+>@Ic PvTT#t#Y-{WN*%F{rL^jL{m7fM4oC3CU@^H6)lC]]2M>MtuV2b.{(y9&4m1!F=T)Wv&%@8sJCEL=aR;(d9B`B%HE(L2f^.rRkE J9eS[7y%#::Gn4ki_V2,+z'0h]!YLl@bHR)RO@d}c_%I=,;zn{p`%3JaD(oA7_2O6(>JtjX-9@mJUzO&>)A4bX7NnnDi@wd>AcjIr<6irPgEKW.3lt_#f[_qLVZvxwrjs_l%.p*<rbu,vSFhao46NNF^?WanNR", 12611],
"ambient": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Z    ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~   ic    sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        Dk   GNR  #r#<vi8:    Cg,2    )ZBSR$Ns R     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: %H,G:CuO> &!hO:Dg_H8B&]OwiHT[4Mg)A9T70&(u9cQikC8,r3.njBw.2Sgd5!Vukt&7>qu}XFRUjOl'd,CtZPTA!chl*6+(#xFoK:8JXNLzbi5U@Yij_Rmx%}gh@iHy5uv[M^P-T35lkVe|*!#MB1qq7rQ,58d??gO>*pt}$N$&z|b?Ns-@-!DT?]K++[;{_LT?==Oz0)z[B':,!`_>C84U!*if,2qBVi.;6yp?43RY:#cGPLXOh7W{ai2LPmix]!Ld*WaV{MaiY2L! TIez){wyQ<j#z9)<c&gR~jFZ#9p?sma`b3Ec=b3WcYBv'Cx4G?-X8s*8s>dBRThs%2SkWneA&l<4Ca.YC25'wFDVC0K0TI@pEQ'7j?qI?TJ@Ma:+:T}0nnnF{ODOcwjqGK:r:^-';mj`zm%=+dn:y)xwpN=+oiUjGak@L4r7PA3ZhCM1b:`BDz247` `*l2eh8K*{t6'rtej,$5oNE2?;^6pdNy{4,(90'9xY20nn<V@k]<$Z2g^pO-n+6]&O.q0?0?*kJ4m,`6+iR.c!r5VaV9W~vvZoF9K3S7d,{W(k O<1QN 2.e)Ppcg[A?]e@+&YM9(L*y%eWt(jkU{yt-?r>O.z`mNbU3P|BIH>knfR5&f5mOZ049hd`~X]I{tkyV*q;X]bw9Cs_y;T,9E6c'^:f=-^slSJW`[-#$NDN-85(g$(Bej-Qjr_A2<#DJMw15vYhsTrk`)~j%sj*=Pqiz0sF+N5Yqi%a2d';dVDGq]%6iT8yv<i4Bz0'yCqc(Eir)r>xYaK;,%9Rd8Q91!t{Yer8{vx-?H=NPIm!uV;2;8zZ&XG1c7,_b{F!)_]D~{8;5j@z}-54%mBM( a-(nEzk+}YB+WTM:ldB1x@'Lm8$8qcEOplxfoTS!~%o=|-b1BZ(H}9'>Bnufm`NXC'oMfthSc8RBK[ [>-ijdx3W{);!{3MNcE.Or%9JNJZ>G<M%7`jFGv}x;%hvPJj6vv]TY)63-0H`=)^(igQkCnv2wmE:xqu,w0C,':Y>9z**KuyVjXyV[$9cLyMWv9BmX7xi.C8MFjS:_kVa,AiEQ(x)=:Ahir)NrjnL|3^?6n5OY`S.(7oaQ#+r:K;x+<Nw_C9pQPJA4NF8VqX#y:wunnKbU;]VQz9Aal^XW5Jr!cRN9-fa4=:qho<hSU )mL7Xt{aOGhZUz;cXF$E>[q_r_O8oQ4$gfy4?)Kp qS2Z::1`kUs.vLC0LV7S9)HK$ *dk$@v*#9?Ef(>^ap=@C4# B*L`=4tF<n0wEqQ_s$v~O&D^o$;%ODO6:9[i%I6v1C FE,w-to<MU46HLYBxCTiPC(1xb5'M'fPlA$GYk2qn>vZ@djZGdW;g=lb@ejUT)(yT.'zclEO*?1pd7_0?('O=xt6JhH Yquw;uQDY(@2}2+oI,J]nRt54eLa_rYj#`]wT98S(r75@1HHJC@B2,7`Xu>=JGOoqJVYjcb,>;&%&8OE]Gj)dr_E2[w*I=mU-VF5d%?sSW1+}<4i<=x8+<sE}HRyj4ZV#6J7?POV4u^6{T}s$s?>4&rLXvnWJM:@WyPujL=akI`F}T_f<p(uyK:vej?,wS.W:pzKP(a>8*ms C(KJOtZ5vHy0I5-?ASBbU avBJQd80+0]&.ZpSy,'Z$Flwb'Hrmfq)3IgUiE>w$cBsr-V;U6jik&Yf(*lT9)KF,%eH;lBQ(pPK@54!^%y$5V;2zAN1P$70^WS5S~pFV5:Ym59ky8kZ<=A4Yhf6g.OE&7FK-]By:t#Qg$]Zq(35b|:@j@)(Ps#k+G@?Af(#u9QYC4P6,8X?G2n#l-R50_6Y_gY'Go@O!<9!RGT~ntjh=Je%4Q>!LAEM{E#y_<%&hk;^Eyw>MP[y_cjWZWhmptsovS.qw)0x&M&&.2{4'cz{d4qzia37N<9SPECJ=mm94+7w!%uF^Q0 JKeHr;M.dLbFr:'^@h,5b|)iGZMzb#YU*c3e$N52C^830UXv0AZ+0MaiO_5$-crZ<Ys<6E4FcwrmZ{ol'-kCT`^W0z,e;-&<V{nVpe ARWH:EfYWokhRtT.T) dmnU:$)^Wua+iJ>@D}W(ykTZ7@nAe#Y)lu=c1L<%|!WIkZ,=wr7LQIBZl2F>.8D}N-;5_Zl9C1!; 2Jvr8S?'G%!sWz>^Q92(LWuqKDZKIZycwkR%|i9OPMz1*Qp$VCjqv8!GnP=+p;zneWXsK>R;kKmbv#0@y(UDRfoBIsE`i(it+*OE~PIv|-Z>=NWq`)'KOS,{eN%P_Kc=CW=p1Amt|'FIl5^[opcEL46EV`S7f2qS^3eXY-2sX5LEZ#vO{$sRPjoSjDh^,+,vkDiy*y`t#A3DTZTe==uOQ)Y<r2-%kT9:wdZm^Eo4NLyI{&tfKC~Q,3X. tuCI)~[FHgl{Gy[O9=69@V$6gOr)_@bS6r>L$EnR+q[[3Csh{$1}k@4a,;4>?-Tr_;i|:RgN^;j98NR;)l:Gan.[wR7TH}r6#8@~d02?v4hf;+GALjdBZZWcJ>F5*:Im,}S hfA,Whal9T&Xm9=1[lHQc_>8K)4he@:1+%@bmpF8gh>g<QRSrD7[DmgdKHhSsW6}^Ft8DM'UuH&mO!-'I:!rh!!]Inn(l$b1(H]MR&qjlFz4@*,cQ8.Tkm. %8?H!UfSZel@C$CDI-v6Q<'aF> ]v@aVsqXH^++eMc= F6=U.swbRB1{H_&VQbct],+5C3CrMk(.]F.bm;jVAiTn!Do)8n.a'c3-JudzXGA@zhQMFs!_7Qy+8c(Kj:8aBp6nN=_;TFNyMvayIaWTICZC'D&D CB{s.=jy1:]dVdE%Stl24z)b:Y-00 e0oLqgd-~f3Ol`6x*,6n31dJV;Z6#'p.BgWN4oG7l-3_I[LLmN-khiVm0%wQWG*DPi*`(=]KJqeEJ23l?wg'JD;7BEQ9XX^lYHWuq*^0rimqqPB^rtV=vHnOdMG,D.TX{8Y.{(bH-N~oOUFcWp$(8crj{ISJA#s[aiaT[6hiSi.lOw#['q2Z(bTsDo#LW V%f>6tMHpLtH,u.I`(lC[U{ev@g@<f3%S@{yc&.Bo=mGj.1mb S*!>*xH&M9t=K'[q3uw6u!(R?.bZ>5RiwLD+WDu$T)E+?[,:jUPL5[+gC*b*P#`E=>p!GLD:}Ik,[+_vk?=kmYs^&d-Gs?|b3AWP<$Ll(-;<%mjTQSd 1VJnmxad3x;`q._L.n+e1#,n0$~qWm(y3gf+Ci'Sh&0;Kd?isT<{Bq:e|Dwd:69OOP3YCt2kT4}Pr*XIyRU6+2BH5cd8Yd..aLp^NfE5Gn>(38w0`I1kvlw<3pi*CDRRbu#a>YYR?az!>OwROXeXt{,!!y<4%I:o29B26(B-)h}w~5@X1VPH8)Q7rf~fsKg47sK(=`~m3vp(0:z]+C)mYjpK%.1DO3Dk3ZT9q>~(V8>&Pydfu$M3oy+Dl,Ft+WwIG3r7bN9diP;S<PkIZ8Y?ixD!OgVBO&pi(Ju5gKDVJ9R`{aJy}lg3rAGpI%[Vi2l<_U!ouT(gMX6{XIiq8YBc!5V59]!V{B_sA.V8:w[s<Jb]`g(wj(~GM7mo_c:zzWbDS`:*wi-Oz6wf?bHPY.*!J+3dU#vFihP^PZZyuo#-OWBh'$q)w%0: kc Jz=h%_4J_^q_UU >NYm e]{LiCPuS77s0)fm@gSE;ChCUrEf?(&sa:`kmJ@zB.QRU9%.<-oD#3M{paC'&Vx jPvcGJ2V,ZP2pVS%h=*Q&n&g_AZ.wt;^q2W%tdzxDosJj<A*[V=vO?Q{XQih,8GI$)<21%bToMLGC?AlLE{G;p)jh*FgD#S;8_fkP:>lw.muo%tEriy3qgV0HGU_HXHkE@,ktZi(@SUrFm|CE'ium>|^2U.rrct`dNt?X_?^FR:WJEy4ss%ozkuK[cK;E'C,BW*SoFzci;vhKt[L1P]5I]WWy*n-A(sEsOOm,#|IKFMR9,&Al%?2QJ{#2liMQk+l f9o~L+!~_[083Uo07;L n{ru{wZhOTci,AQs8.V['fJ|8 1s,~L(6#vO84<(hd>NzsK,E>@;U9CTLtM2;xwB+[ns7iLttZCCl}@8%)t`i'w|7JDu3R>pqZ3JhJO@R7pT4OZ;(F!+kSEyY,$nf(Y'<9WQM*[Id$^U50PVb dM)qG^(24*{mvM^#E?[mxG!WnD9g#Z!7To,AD4DjX|m0VSwny;co&FU)P4[iy=80B5]y<AR?5!.!AN6g?s=|SJpUdIKfyA3Qd`z{:yQG;Sq%am_|_}$o7~XL uXJE<IW7Biozj=FqT^_Ig0rH?`3&#iBP w]fp{$+D>r%-z>(DVS)DHM X[)vgV<Bb1g [e^ef{d7S C>TR!+^Y*CGoD6vzjL_`fem?xNyg&WRo-Ubtm|$(#O0p=j+F8'y1:z_b'N&o'02Sr,KTDop'CK14- ZH+{5_sq,Bu^CYm]Mms0|-}:ih|ic@IxL]v]ge)4vPEMYV'cxLUpAQfAbT4;?>W!aE3nP4i1G_wl%a16Uu0.w^D`I((Y{d>&;C)gw _c&V;e'E$aw(g4TtBtGa^7Zfx+0E5drPg^+zH;A8cF%:!w}9[!X)JHwD8UQTmYAsqabLp+hln5Oae^:]K_!-dpj.k=*DwURu~OgWcC2weZP_S4s!Trm'49arYl(I=6cityR[WFz7d'DPf&xzJEj{WVMsDj]Lk#Mrcc%*xQ-[}Ww%ML{JFle3BF!ngPG+xaNMQV6Q' 4XO):&WH?*U8WdjwOL,u!31g:Pgxy6}0~@=cqP&A95O=H N9`AgL1v  D]!S<f#<IET,&FJbw{,xAPmaq^@5q?p]J<<_riI@drj6t9&Pjz8>2@i71;}g`y^{pA@U.zD9uc,0{E,W>?P+YD ^[)tW*6u'yALSN3(2gxJeqanq8P1A^IHjTSbX<ngh_<bZSUP$D4%jm:eFv@zF;MN?8@ofTaUV9;p['wq!.Ea!{X88XNz]uNoys2WN0S(iK?~xrcH=u6ZBYK%,CJ#q]=MIkZ[EiAq<?rB]Sol+qP3+GwyRQES`OnhPh?uUPKEtA{Q-4%!?#g;4M7GW%I$VU=*?wur.'?$6.Q#.#]<61v4<aeR&wY~;[htjXelMa,1(*q-3j1{n6qR]9A])+F`0  hdo2.<Z*cqOD9gw2baB$jskw5^gV6o;O9 1g{9Xup]?@L5[$42Ra`yn76:?Pw8kg`Q l!-]^7;L?*>0Za%7jjjepQ8XG:NJse]Vn!uCn8p:+X>u$gvC!lSia=Hs,;SP{AL0jw(,- G0zr*!=25g7d^V=063Mmd+Zio,8hZ,&G%s6S*@l9q^fl]kV3HbDkEeT!'AV:e{AtUI,Uy7TcVV=*8^cbk_4+'6N3ii&|B]Y%$:JSysLRF[ G.P_-3 5:wH8}OT_&+BUAloNQu'hQ>P]jtVdDWFTrXEFSat,K;&:Hq2yenw%rH2GP=>f$vo@C!Yb%iJ?~6D;x5{UV=o92>oUxbA3b)!bW5<%c=%TY9QkW.1 809>6k ,l?fPf>r44^D91kv1@$p0,2jO|w6E%Uz.'K=;zzu!AYCZ_2fWf+ke*EXOSErM7d;6{2F<$M2%0d~-tK!EA!u=8;1`GMK6eJA,3qT+5b&,-", 4801],
};
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

function artUri(a) { return 'data:image/avif;base64,' + btoa(artDec(a[0], a[1])); }

// Recorta el atlas (11 filas de 72 px, celdas de 68x72, fondo magenta) en una textura por personaje y una para el arbitro.
function cutAtlas(sc) {
  var im = sc.textures.get('atlas').getSourceImage(), cv = document.createElement('canvas'), x = cv.getContext('2d'), r, j, i;
  cv.width = im.width; cv.height = im.height;
  x.drawImage(im, 0, 0);
  var d = x.getImageData(0, 0, cv.width, cv.height), p = d.data;
  for (i = 0; i < p.length; i += 4) {
    var m = mMin(p[i], p[i + 2]) - p[i + 1];
    if (m > 60) p[i + 3] = 0;
    else if (m > 20) p[i] = p[i + 2] = p[i + 1] + 20;
  }
  x.putImageData(d, 0, 0);
  for (r = 0; r < 11; r++) {
    var key = r < 10 ? FACES[r].key : 'ref', n = 3, t = sc.textures.createCanvas(key, 272, 72);
    t.context.drawImage(cv, 0, r * 72, 272, 72, 0, 0, 272, 72);
    for (j = 0; j < n; j++) t.add(j, 0, j * 68, 0, 68, 72);
    if (r < 10) t.add(3, 0, 204, 0, 68, 36);
    t.refresh();
  }
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
  var k, i, a;
  [['balloon', 0x2a5bd7, 0x0e2257], ['balloon2', 0xd72a2a, 0x5a0e0e]].forEach(function (b) {
    mkTex(sc, b[0], 28, 36, function (g) {
      F(g, b[1]).fillEllipse(14, 16, 24, 30);
      g.lineStyle(2, b[2], 1).strokeEllipse(14, 16, 24, 30);
      F(g, b[2]).fillTriangle(14, 30, 9, 36, 19, 36);
      g.lineStyle(2, 0xffffff, 0.75);
      ellArc(g, 14, 16, 8, 11, 3.6, 4.5);
    });
  });
  [['bucket', 0x2a5bd7, 0x5f8cf0], ['bucket2', 0xd72a2a, 0xf0675f]].forEach(function (b) {
    mkTex(sc, b[0], 64, 60, function (g) {
      F(g, b[1]).fillPoints([{ x: 7, y: 18 }, { x: 57, y: 18 }, { x: 50, y: 58 }, { x: 14, y: 58 }], true);
      F(g, b[2]).fillRoundedRect(4, 15, 56, 7, 3);
      F(g, 0x8fd3ff).fillEllipse(32, 17, 46, 9);
      F(g, 0xff4d6d).fillCircle(22, 12, 8);
      F(g, 0xffd23f).fillCircle(41, 10, 8);
      F(g, 0x66dd88).fillCircle(32, 6, 7);
    });
  });
  mkTex(sc, 'tank', 100, 100, function (g) {
    F(g, 0x1a1a1a).fillRoundedRect(8, 12, 76, 88, 12);
    F(g, 0x444444, 0.6).fillRect(15, 22, 5, 70);
    F(g, 0x000000, 0.4).fillRect(68, 22, 14, 74);
    for (i = 0; i < 4; i++) F(g, 0x333333).fillRect(8, 34 + i * 17, 76, 4);
    F(g, 0x2c2c2c).fillEllipse(46, 14, 76, 20);
    F(g, 0x1a1a1a).fillEllipse(46, 13, 58, 13);
    F(g, 0x3a3a3a).fillCircle(46, 12, 7);
    F(g, 0xc0a040).fillRect(84, 80, 12, 6).fillRect(92, 84, 5, 9);
  });
  mkTex(sc, 'burst', 96 * 4, 128, function (g) {
    for (k = 0; k < 4; k++) {
      var cx = k * 96 + 48, n = 8 + k * 2, r = 10 + k * 12;
      if (!k) F(g, 0x8fd3ff).fillCircle(cx, 64, 14).fillStyle(0xffffff, 1).fillCircle(cx - 3, 61, 5);
      else for (i = 0; i < n; i++) {
        a = i / n * 6.283 + k * 0.3;
        F(g, i % 2 ? 0xffffff : 0x8fd3ff).fillCircle(cx + mCos(a) * r, 64 + mSin(a) * r * 1.15, mMax(2.5, 8 - k * 1.6));
      }
      if (k > 1) for (i = 0; i < 6; i++) {
        a = i * 1.05 + 0.5;
        F(g, 0x8fd3ff).fillCircle(cx + mCos(a) * (r + 14), 64 + mSin(a) * (r + 14) * 1.15, 2);
      }
    }
  }, 4);
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
  sc.bursts.push({ t: 0, spr: sc.add.sprite(x, y, 'burst', 0).setOrigin(0.5, 0.7).setScale(k).setDepth(y + 20) });
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
  sc.ref = sc.add.sprite(CX, 528, 'ref', 0).setOrigin(0.5, 1).setScale(2).setDepth(528);
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
    b.setFrame(sk.f).setFlipX(flip).setScale(S * 2 * fxp.sx, S * 2 * fxp.sy).setRotation(flip ? -fxp.rot : fxp.rot).setPosition(mRound(X + fxp.dx), mRound(Y + fxp.dy)).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.chg ? [-30, -95, 0.7 + 0.5 * p.charge / T.chargeMax] : sk.f === 2 && sc.throwT[i] > 0.2 ? [-40, -90, 0.7] : null);
    sc.hb[i].setVisible(!!hd);
    if (hd) sc.hb[i].setScale(S * hd[2]).setPosition(mRound(X + (flip ? -hd[0] : hd[0]) * S), mRound(Y + hd[1] * S)).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
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
    ba.spr.setScale(bp.s * sz).setPosition(mRound(bp.x), mRound(bp.y - lift)).setDepth(bp.y + 12);
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
