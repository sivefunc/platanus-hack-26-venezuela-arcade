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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $0OB?>eb;'GRX*;N0Gx+Cya#;H>ahW B)-ANZl];U~1rV95Z'*g][)RJ  #v(0QN?Yh0au2hX+.x8Gf+CoEC1X%HOycp&bnT]yu+CgLYC2BI,53>Zs o<}H|AbiK5OAPB4wak1w.'5EfE7oFHFj {^{gjhzgm1RCyxHBZbB~MwOKB,]DrM8c7^YVX$&q_kj+r?z=92C?nM:}23qXbuNi@M5Wcy-T^!544a+DDVVeyB9O&|;-)%&:.J5y,Rf3R&Me)#)WfM@(S1T+9p-q4ASe)J31eyg7Vq_d,F[.Z`G$zXZR`@i$R>DQwx(.E7U(O!hakJ8Y,?.IE:,sWs^yF%ybKT2U546h[,vwIw([JcXyV4lUV6PgPNy%eR,L$b[2Qb62x'GuNOQW,MP#a2>{NN'MLw+Q0W0d+*OyhVyE*x$3su64UC713``;`z U3oZ1wz*%=;&uTY!zdX`&'PeT>&=2ok^,&1*X>'[Rmpf;e[l+<R3_3Kx;-DMe>sZTgx8}3Fkl>V>z&9s9Zqh6@Mf-%UIS3Vk8%K vTgpc%w(h)^PD$5Z!q'1;,t!.iB+Tvel:M)L;j;HRvKILO_Hm5Wqq`f#:*'kw;*(+D,(RUghCgI-nRv60r!(Ud?CSZc8()pTDiW+_c-e*?$[8+]ou5Cyo%vai*N6e@7iQ30]=KMvG@8g=;gz$l'7i]X23>--;!aX+t4-n=pUEqLlf_Y3]QWv~?`CNnYA|C$g`uqS(P::j.1wmm0WRVAmuofu!e^ncc_a[-.{N$fN],@am1O;-m6!6d1uqyccqn7aFMqH_=i$afiPVPEN6,Y[dkk;gog-!OO8h;*0UK22~h3L2hg4>!70)$*EIHbT5Uo%V,URV'Y,qYyWo;X<y@>u'n}5ZDm`y3.^l:2 4$L9]!7w%)p>a6'R!;guXPuJ3V?4vJx1<%d]*J,onET3FX3BMd98o.mB[90-<Nvfc:+%Shq3K7UWKXIL$;Hc>ekb`h3nx^T@=O>qB4S@5,B@$PWf;)f^t*UpwPoQw%&D%Bo=(bnneE;CIcVU^ R7CWiL*OfyI{MrW]s.n 28FdBeY7SgvY%!ww3 Vh'===]':S%Z;Lp-Hz*NcI#0}TFp,ua+>S,{p$huiMe:]oOzG{}[!M^v}d7FNI.vjKKA88UCzh$AMlZGgfLc[_,!2s}=$u<ek11Q.`fm7zM`?L?cCo=Hdt>>-&1@5u?IYKu5K_EuS6`{0EmH-u*Nx@oA(,m,};cH'ozhD$GvL%CfK6Y@d<RFNuEuvb^.9mbcpX-yyHCi7XhBc:Z5)o`mj2SGfK3s@opI8jOIXwLq*:-tj)iNaV=?9Cu{(nz']6tnb]Dt!&n8wfK##n0s[lca==(7ExvgMME$dUK79c[l>JMK3<qhBDz.i3l6apawj8HD#'X?EtkQk'fcx?|f{rB{Ae|7U+nHFz{iW?L=9te<R?jO5&B6w$V'v{~s;%du|'jxws-hCuEE$-apOM5ycl9xOFu@j1>zt4^n=VCNt?a-2Enp=f1Pzar[ Yo-7;G0^f{IBDgQKlik-U~.mx<Pwo|b[LzmXsyKl,.T;pjZDr&uJ&H'h$eY=l'9+<fc@@lv2jiSkDuU@@;RI8gD3x49W MxJp lp;]LzIs@CH<<xOXu),O![#r-^nN=FJWa},T6{)IvYkgBUn#P+1.ry$n$zUh^$OO$AP rdM~LjxrLT(N-.y M&i2BB 3Hmlz-+'?9b6Wp+P={%^|aH$c9&{eT!ZAdVWc-eo?[Mno6Wq6!9^0(>;jL]F7NX0`]WLrb;fgor,q?(pnI5S|X*grGQ:,V(,M&I;}OoLWY]$;Am1f6ckJ+=SN(i`5u)*@$5Ftt6S[7<2!.z,u)]K(2PRzGh={wVs0aOy`h}uBdM&D-k:BS!3ZDAWTgiz6La!RJGSV:$@,e?1`$raSY$IgtVhHhRdJQPFG3%;Te-%UUrw!Oj|$0GeU)Q!6mma{qbK@1c]Y2gq];(Y%?6Fg_W(r>qA<SGy* ;S~W`JH-3D1g_=@:a{bg2NaRI#4Bm 6Bm<r&TOxq={U4&FE2or[!{RM?}a_`#cg.KK,^.EK`$SNMmmaz|Ee3TRLcr;<$7T~2|0<fV?G9<iZ`V8Ay|v[!94w#c9'!*WA:D'$@Vt0&rUCRuFL]^Y?>T3K_Bf)3jd)8CB7kha$V9Vu:Nf' e`Yd!H!O-p7^TqJp}qx@ArK]r+$QE.:=3[[J3[S$F688.#}L:_!*tezLsZDJga`T:;>g<$rn*O#]}#c@p09hTz]&23s9g4*^Ds8#<=>w?%W+gKi e&y;>F,o6rIe8#_wz,{4tU2,x*WTX,I 'YbIc*WBDB^8;t;m{RCF[&3@#^uzdq8?An20?K!0_1'V1BYnne:hNO_LRdO(BDm#kNRCb7T-##{'}C^4t`{Q>#,mcvW{-jK 4O-R41BhWKVd63%#K&yN:yK*eKzWK b)H>'$QeE%#hHx;Ycq*`ww~]BH|c?(P7bi}Fs#vmX;Yhq'!7:E1M6%2 ]2t33m;Wb`VCb4R&Cj.yBx.^h@I+w;;gFc_,OGjNkPc{rim3H3:hoYf&<!HefBE_K93Dom`0Yd{XQ&|1|h(anZh:Cw>+`gG&-F]@Fn`#|@lFWQLo:AoOy4gggXMmkG->Wx#U<8<zBV9 buSbv&{):iVBxi*%HL8)(K8at?,&KqdG|E9?N]^kx&FMVFYz3<p$C1Hd&9wNy4v&G{uZ#R4Ncx'Ow#`FsFzt>][RSNQu{Y6)1CAy(hf%4D}X] FwCw+0F^[eCXx>q#m{(6]fDj>9f#6]g<fJSa*T8eVTM.%RDD0 A&;(Iw#lC!hT,qlPJ3y5S-|1a^fa|&:d5H2Mw*':qmE.cV:Rf?H5MxS1rl+sj<b'w;MfU)N_:'8Lk.Wb(Yg6SM+Mnp1?)(pz)& 7 Iq_LhB-B>6R39nsR 0hB=>J(Oi<Pc4F~R(kUluY}6poHq$@46Uf*hP$i%> lk)&m,%0;76[g)12Bz?NRGVQUVY(# _&LBB >!42%);Q=kix,2qeSYU?4@Dn|J*o-`~%@zLjk;It8J>TDq$D1qr9Aw{tc71%2G,nuB1bYIEe^3L7*reWTefP]w&own(!{=bwQh0sYN_z1G4`3{oj(_roSm30Ri<AoqP?AO|gc_-3k5.TPIgf$ fsB>[fx[Af14+44lx'kXHk ^6waD+GVP5o6?S`LM@-ZG_MUoIC)(g7y8X8*v^!w2dPV4gi_jb<8FJu!=8C'cGx^D.*tnX%hO@L(f3cV6t5|[9D,mK7xdjoGvq4t&085K>p4q}&tLc.gP7gOpZvC DZo1<n<[j{JKP$[$7M2%.jnCSqKN~(<NXY78!4Ia>=V#:P1^[j2DIEc;Cue9%g)8Z k+v-Pg?]i)^cG.E'<.O!,;a3IBdl'4<dx$h+)]vQ8O.2q:2x]7_He'89w64loMwY@&^<Z+{voO.2{*HPf_q7gr-O%FuR XSC%v;qaM~=j0e1[nrxZV|65pETL'4E)py$FBo,,)P=X&q?)Hw#6SYNYYn=J7TKh[4''];'@hn{_J> wJBB !)M)Fh:h*i6AY1'+#dzoeB%d&B{Ce`0!p3%,NQ.ksw#M;o+yn`06J^3OHdk~vj-*.<:89fg LgRm#8SWKYzFP&Va1lBsa*:`^'7FN:w*'977)RK1T:M7]hyD;GhdQ=hhuyKm'o '31L<3EDBq: V$AaRPQd+lBwB$9n<MMk+{Hf#zd]cvUS1@|a=%{v'L,7<h`ocK3NdeJ;L68`zw+v_t?3L2Il1cZO<.3$bHYTar|Nv&e:yk-r$Fmde^lz4+X!;w$Af^H1@L%ll>k;arM+X@;u}%T&%Hmt_NN!?4dR8-Ne()f6w! M1[02N{j:g?s683QxBIlo&sAdvk>H{Y6Kcx~lhQ^ =J@Lyh8RLywPdhUC(`]Sxx7P+v=7I3TO@UG<Rdj?98FvJwyW=H'rNl-`jf:Xa8IgQ)p,-9eGcXkA!6hvc&jC85}<ZMq0j>}&$iN,{::=HTj$L_NZTBOa_4%w F[n>w8@ow62:Vf#sKWhVU%K`yquswC9l6_Mk;$e 'Fgx(:rqi=0Vq+O!6N>ARvOz%8l%S%t|_d{!LkzM`@dh%uZVK{2HTW&Hyurs_;6vH[<cjB,^1W!KC}jPi]ll$WxdcwEUxEdN<<yrS.#}a9`s5hDN>B2!J@#[t;foO?L6sS38?f+gw.OhYH'>foLCf!Xd-_Dtz!M<y&Bd628[e[ToKdqJ+vh5c1(`CAajV bL&-m[[{7]P27qVL6AnmMP(c?I&Xl*!2Ai.gv#(B52C3;6]]o9cZxdn'.{3u?qbl1rhA%{7YJzBJ0;D.0WC3u}5'kesxt5r(;REqYFHK!5Mdlj;01q:9wBeh<$-#i|hGQ1.l1R9i;l+*@[2'myA8_H`8lEH&R%QW q^PrzK%l8vBqHA:Fo)i{]R>dg7b?[J%V;?JB? 97HVI5j:?o?cLi8n~tFM82J YV{@~O%1bQbe%)*wmHSl9;Xjj(e2( m,><X1duxSL7q!$tAMQMJga!>IyQ_V6dHMOz #NR>_8c{Fh-d94#R@Mmnhe]M;CEMhT4f&KIw(7[rG=,q1a)rkG;DD-:gy];^q@A?Uh<60 mv<=Oq#k.H^xE>Prh=!h!|;-_}<9Ds+kI%pOTbxd%QKi3c.Z1cHa8L9uR#jndlvC#,NI> ;or&PsCXf)X'TP^l3b{3##d;dowch}AoB.uC_U,sWv${' gG)BNU)fNxS@z *+. ebVXa+j1ZA,}vF6d, jwZ%jP54s@>,X;o8qphfQFrQ'.$Z,iQW${Y_l V@H%mlPF)xVA7xi5*~, U79a0lA!UoR95&,IWwu`,G:-aX-JCbydMY cfts<OAC [N!Vqjj|?dTn*{T0^jR|g{f<uyp##^!SFxa V@XB1n^uIxC'VkS0h!MkY0n*m:uw2Na}99?_9pq?V;,$xFaeuaw<<P!vsMVUA,$yRs?Ap-T7%s^3S<eOkrCC.Uqyne,.[-8fHYdbzWVHA!3OFwXTl#h)sOH,R27vWP3*,y_f?d>>w?`HfuKXU)rl`|Z1^A1O0l8eQ@bQh%G;dbGI[`TmdxNv>p) YSJEYYi.1sxzO{]AUh1nQr]HizK@DP%(McSdIW3O`3q[Es%~VsNRYYlU[Su08rbJ!>{xrp`M?yEjhC7YP`8%`sCyh3.8Olak8JaMD=pGEV9fP|oy]{ij%jQytY=rr,iWlKdUr*]_gT-xg!(V!#KZ6p;g-Y6J%JRJ$` X1yzVy==3?X!go}FKdq.,qLv3$jpa9=;NXtTV#tid$i1BbII*O;gkvfBQ C;VEnP45;^2hF!ajoi 0ij-i!T0?rvx{@_jY`:_zZ+Bitva>'i{    $3(E,yrBf-NR", 4378],
"sprites": ["Qi$G*mP;Ys    F|;-R)   1NR  IF8=   $ZPD9pw  %4OB?>`8 c&GTX]V#SWP;ZFgvq>aiC8d=9+%{<8L@!;N#l -'*gN?])<A-u%X)iQVM>#vUek   9:%XNem#Pn:ek 8gFUVOK+PmwWFw:S#P ;u^R>#H9{}GPOY?%`CH3aV&!xmy:XLDie'61fGTP.~|!@yhReuWL]jlkXY!:DPG=3}.VgQfFl8LFEL+NB.TH *suYT4I3TID&3Y'Q(#WRi[e4I1>XX39$VKL%HmWi6<{dwv9 xfAc2uEe<=b(f(Nl2CNHtbKbUqxJx?$JtOhU%BT42&9'kOri9I29X@='j.=iY$~Ge`}X Ip_1I48JYD4GC_*>P0Vo43ra)z*|e,(l=:!L6)p3:2s[S>Ol;tT]9E+O#i2tb)diu[SqZw]Z&hX9I_=x?WJd-g>U%tt0x2R!WqI,bO?Dywz6=MRYF,T9;A>|cZ_T5RnT?aCeMh,s35249e.`H(c+nIsWk.oDNwOu<N%[+ QJqla! v2kzD.xl)9S7$oeC9.'d?XD'BJG4OO2 zj&5U5lTf77ZRrB!]@wI*'AQKk8K 3Kvv:F_aMneLe3?j0H&QU&UbdCAOLk)E@wU},jOKl1YTD2DUjOW[rTiV.r(zXuZp8X+eNl4^6*)l=0DoqfAg:F>|@mUf{NU&v0uL_{RkF`EyRlGCi:)OMPfEu?<ZEtdj+Y%.93iMo,ln^@)qha^Hn=LNTR4+F}d~$)[K>p@Ny|i'qe09n>Z6dz9ScZ:l9]k-.18mnSA+#V]nN3,fmc]bi0q:Jh-32M@'5Obm_>SE6&srV7kp:4Fy_^as-YIFhL#LRIJH(Mh#LNNK,t&Yqfp_s:BO.TD-7].ar+7yf9Co4&McsSe@66VgY- =gRx=ILjq)v98$B1}F,uTPgt6=`4'J.)R-g];s1r*EdH|L#IJcFH]#]?zF+xTI}xU2s)- ^dY-o,Qa:[Cd]+KGuL@BHAJ;1hSV{wPU(E%^0cPUxPUf+9nWAYJA7,2,*;YW,6y-t3XZ<Sz=vb}lu]H0`=S<nD;5gE~dKw~.?L3+{nr?1p&ko[*LEO|!T,30!?ddm9 ]SJ@k&WJTVIpFkl^,lcq4(e#Fi55ARBR!M<7dmTU'RduFa=(D(7)UFjZgL-lP,k0V'?yz{*~L?B7u:Ew)E$M$['!-miQaWxdYW,(1MH.j{Z{J#6Iy1Xs'`q*]-WnQ^y(c3CSw1&R&}YLlxuEW&_9dYsHq@kfu2e[[t8}$mpo`s$~<@-D=)L:=L958RLr15bZdY`c{@6A+wlKRi(^_u7Z+ee,SQ1[cgv1xcS9n)KZwVSF6_WR<czw0Amj=)uF1yO~%K{Tezq,jMvlyYneYk?kQOQN]!=xPJV(Y^Hj<wDe{vh~jfRYCr3>U'e<_: 5,dYIt[Y^mYBj >$3h,MMOFJ{_`5dGOeLu1W[D#=NFq6S1jK5yAL#<FLCcAr6mQSv]wQ1u<97L#<z;){Z=$5wFRu;z&vC1Z:N)B+(H:#chZNK5`3+P?ATsRmI>}.&It$=GL%J_MIID vM_X#Ni[E9C(]>wR>xrOAB(P*yf#YAQ)K`5^8R=;)h@Cta?y4vI.O&-{?Dr]dW&RwIwa->6EWY{'<#.-ifVAYZjdkZ&XKZP F(ZKVcT!^R# pT^qts+.>0s`.Z(a7~T_av_7m83[aVNu19TS=)9TyUrmVF#$r5=DMy?ope!7&(UA`&&k5$Ru%j(XKn2EoE{;x)I2k?d::vTe-4YuE|%ME76|roZm&u`!hsbOLL+c!A6117[asv<YluV_:r&)ArU`h^m}(*Uyg0e{cf00iUfjNl:SMPy9u:E|z_gP*Z=O[LU.;H^or?2,4NIbKKR3eRu~<{OG@|u:XMa8*&kJjUJ)WVQACW'} 6o[?> _8=k+2Nle#8][Oj4w<Qvde%FTj[aG@hT5A'.[Mq{KJW-W[*bWUAv+sq ]V3acdL 1(>9$Bm)d&7Y_vJ'c=qBSkdY2OL_NqfjY=Qs.:G7[J.wF{pdH6w>]U=.#1j{=7&KySBi9={9~*Kgb^=$VNf5rF{p pKD>doI#pt2lhn5u+B?CxWUgSRwzgw7k8 oRh=8Zx:H'ZqS:1%3LyS(JrlC(0o)S(lK Hfyj OPOp69VLh;i2ZGf&cP&HsmmX*Y(Fa_ozn_YAo)c5S7)wWz?2$rC<rkXax9xqt,Jp[p~#^LNP':EzK`0uX_#(S,$sOW M?U)5CzXy6P7;FX% Do9AZ(]lU&CF(-@b_FitXdC ,Ej[A7E++NU6[k8e`:YcRWun1InpWP:+1.m0cfHBU^`;5>F0$H93=SR;Ep!g*T=]yn?J`-*x~r91^F|x`k.<66`SfAHKG'HmbLa(khJlS#_!j<QH?$=tf2F6FPPv;1FohA?[^<D7T9uaMHDSl?=#H@brb]MUCg@DQ(.pO!O>`QljUQ,r4:TyJjkpMdWZvwSv.Y.H5N+k{[1Ys:>#W|#o=i''BU9'J:9YSj`MouLu;&8Q;19++=@x2d?2%&;-o[7)@f%Jq#r.lJNzjPe-s>[r<N17vz)gQR[MncEIMhT,$-~o{+B-(j1R[E[,4nWqvx>7^p4Jnd=KwpI'QyG_>UXd}WMbHE*zgy^59]:2?n&.n=-nbA@?y=j B`4TJyvm`{@Hs0IpvL(S|kOI:VQ#J0>7Q7n1Qr82z,dn*WF*pdnb;#iKA'WXGMq!}#%Us%,qG|!w=Py-NF'nc!*<`R%oP{<iq-ILj.3N9rXej8*{V.iM<X9Thr`U$nJw$pv{eYlMfTs9buiKrY)=6xEeure,{r?[pw1XMIK?]KCt,,WToE:9}A&7_YAUKtZz*J-bi?:S:s*@=?=P'W`5o?Y[q;E*xu]@D,AlK6uD},N+,Fl78Y|J|y=lJK)Q^@RyCJ~D#&{u=*%)e#Vi3EbY{2Di@:6X1Yw'Q&~k^zyS9 @Ebke+[(@<Xx}D+8Q>JHi?oxc:5#$7Rjl4nY? af(P9eFWN#cD7eV6&1L^mK1Nny1,cD7o[57]^Ve#inx-K2oL(7&'V?l HViO%;zlA(OZ%'epz.=@Lakozm(SN8=RYH}onOKal>O0g[wL_(g4nD@c7T}'>Uy`Qon%!-&{.H<@F5]BjXp`AR.]F<{v.@fWp?:Uq%z;l0{]DCJ[GB4ly`oeL]$bphBHf>sg;ym+(H>sg!106_idx@xQSzPjvvFW,6QW|NHP@e^,0EkCma];7ui'^5!;F T(Ahrqn>! K)yvq*+wgm:ccl-9C#V=?gLtcXL^ik4eCv p` VHd5}BS43&MR7@U5se<->QNJRv_chkXCHe?mmZv@m:!'SJqZFH>rOSgAx0R]4?ZoR0bpVQry<0DP|#}9dQT@ex_)AuU2U)7{VtXvqZMsYsP76[:>]O?$m@[=cqA:l<vhj+Ls{TtaRcWK#M|9!2NP'mXH_Kw$#j1r550=0mSVdoIISiRhDxp!8&%UNmvCtSj7bWIEZUQ8[C2Th@ yS2'I%)4hiI4@0WB?doSti8@?}adHhG2SxWr]}$OX'[})Zz6:_;PBFNP3H.*AtjWV<A+f]Va>VzKt[N6kugbBb 9416.'w'N>PoxVa^;G{[<D!o0i?iv2RE1ZLB<znE}b@9(QeS=uBsd0Ikd'RF_XHK@j?b,1ngZI]-]c3Jn-UwVyWi2z%lyeQh^q$(wQ& w0;e-!h6s7&:.hw'2ArTk:])mrZJxxcp=a>XD:XtZZNTH5{:af[+e6o<!)mJcY_Tw OfnQDKwVX(68L.,L=-&82cs<Tpw[6C'64z=<&mlTPTPJ$J'%w1!-hDRi'IXXarmg;HR#pl!bVNO:5{^.#c+udzx!Yx40e8g(m[b'dWR][HpL^O+O&U:-c1&c7VQh{wa9 d<xSG=(aiD:utUdTMt!8qjnwJ}C@Fo[5jczJ>b^E:{kw{J[B6K2Fd9hC#U.42,c#vL6#B!=bE$jW{:MnBV7[7NPYdBE;1T3s%Fru?UfJXqEUml-'sY$&MKa]bdK0z *U$uIT,Ut i+Dw)zjUoEaKqI2Krz>Mimm'eS:=d53ng;Aj9RvC8njrX@btP~UIjfp=t{l=p5Fl5ZfK1su*L;MRINpbKoAM^#]& $qfe[UVB2,&vqI`muz$B_O-(&^*I,=R9,)akFd{g[,}Ch)9.?!Nc;a-3~9G;MqoYCF*{LVc`9a jgLQuN:>+q)dn5hmhV8v>gw~RRx~[RqEa ] JI.o5mc@y.Ovd>cuU=u<ySro*?hWn`*jsZd)4V9becyww%dc!:u+j` 1oDfX?{EgyR.q54T(!4-Z50%>OZ=OW-i0$PI},.2yep{.uog3[(%~,R+0f{6R,zff*WJ+#~Tw>$GV;K{fC7Ai@r#cwBRs>Fn<hI`E*V.W-82CYr<ZO9+<' eZ?upe42j?T UH9#q[o>dnYN:S''jrucr:#8fwcluh{1HAD4#35g%U)6QJ#;W]7yCVW9{FP]$ccQw!YQ8bCU-5:J5QO gA7U<)oD=e>nUVA#1='ZG_c}6_#RkuY&guJ:d1WFyN38:nEE_ApnpL0i!2oZSo`9Z*i)Wk%c!FQE Eq`[,w|cO]1u?Qay)vJt%#Rl%@~wLR5&Er9 gg{yR^|u4WA%0vrJ?K|TE!L.`zpU]CIT$l4pS nX4Hy.wUFdke.wRA69M`q aXlpi^iOjPlk>SV7-;|pGap9,t,I^(NW3{GXrx<oq!K5`KfDi2*iCun%kuwbpRFcq.k5'F5,UjU?kL2f1&)%3n2yfAq=(=1)t&Viq7u2]ER{@!ch?(o2F:v#z:i$52CI]oBX'`i;%PnW8._Xq3cEI7T(}t6vh$`KnY%%~*4R;Ua'a<j4b+9.U8(#C3gzox~j]qjq<wjojkARH'p0]y}L^XU%m I-*-J#0r:emmgsnvy&J.P?nIqwZIdrY&C7I:eO:OgDbN<fFS 2U:6gOD<k!Jtjr'@Y;Pg=T tQdf)z `1uGA'8qoZH&cVDoTU,>z4`srOeM`}6zizh~D9NAm!Kz(^Hf;Bb~v.hzn%UXHy^E&zv~5:e+q(aQ?7j[El-pTCrE`&A,.(<1ci4CcAV31Ko^Rtr|] QUq$%qNkttygpB>8s@={did;5tuLeT+ShjA$vZSPezi+P%THnm8718RY'y!4.:t0u%jUJRKtjMih003246YpHe!toPFpqwzAGrj(jHY!dit^g|QAu9e,VIw~{|'7NGW`{)U&Rzmu(S:Jb2ae9ImW$wQS6>R*2Q;lKC*ZWhW?5O&j-SB8&:{7+.^@EI[KhVe9ZE(v[:?G=N?[$y]ru)T_j&^E?et5QGN#uIY1;UrBqC:$*<0StaB%J(r0(MR`iaMuxKk#Tt#-crNu$Vl'.9ohqC+hT9>;]}Rh7#gT3CM]5l&h'15(Rs?lGk3)V_?T(S?m8dA-Wf2MlEKk_5F1*H-'=]_P@)rBOD(Dg:m!=ew!iXhoV[9D.?mJ[7xMf:BUR)BF%U=X)@AQNd-t<XoDMWGg8Mu6LbR#?`2EAT)zC}(S]UgG7N2T@I5D::QyUm?~P?9n'RdF2dX5]Z.nNX<STQVxyrSaX:i+;kR*7pkL^:v9Lpx;R4!`>U[p?F*?[9D$8Z>{fM3(^2$0 syFHy>}=2A'1ly=+i_'t]t2POOKU4<t,tDSt@gCk}M_4*8Le=y{?X@'NIn.zZVN?K_D[q%G,RTKsn%rIeoV!yVw-yB{4mCKhh'hSsV}8Q:lZ 9qaVw.-F1'[`$Kwx:<cgcK=FP&|!`47K-<cp<[dY3g2!`N<YdZYnjQW'z4XDkpk{!qHt#?ISKSqTOUBx{C+qi5^%! ]E`qHW'+aF;^iONE61;TC={te&mCaSn?m9mDZ%{4';P<:hzF>;F,>h{jBgu5ebQZ#&1D4y#t0p{X!47a*8F Ur=Q4?M6-?]mNC0?(I+o0Yh&v@fYR>]j5(&a-`s63c@`vYjwS4IX[AonEYi5^_5716(?_y!cQP);VPIZ -iL530_Q.ODY@TAe>Z16'Ddw.>|F']mTq?Fkv'q'3`sMj],RS 1A<Jj@'e>>:ioXX[[@tq=ZDwT4Q_'A,?l(<F(''z 4 ?X^Kf-![;J?dm4NYi~qC3b_[b NG%*Nz x$%)+,1Ej-VE3oeb38:D4(8tb',_H;{?_R7Vy3sitXOOiAw9O1alp8o:,7&D_Q$gNfmVB5 O[j{&-[qWk]dA7+RogDgUTzaHX>8.J]C{o[)-gy@QxlwCloEIt4L87)?CxyyoC*G&aMQYQA.d!xjJ|p-rs[MOSdL@BW,x%{*R<;({li;djht%:iw?ESxgB6TpduZlpuj;KRzL!0W-1jbza0'hb6VY6izOFO*WDw^*~mAlH3ee<3Pij(VYMt#urpOORs!mHNNMRpH=FS}r{3qh=cjk>irvq^R(2ji#sPWolbaL;Viv8o&W A^,CDrj09s)]TMZ3KNJ1?j1jXg0d,G':[sbmT`XP,]V{{u?l$pFE'dgwg[bWyG&q1-^60{(AX*L'WlI6DG0s&A<Zq&[`(NV7!-q0>:PJuVRCb|R9(MH4yA0+LSt$'os>DyPqR_?>$ZE{B+4*a S-%T+>h6=}5XelUmBg4X;JwjCw JwtP98V`cW60F'#swR >=V=30Z&b]eCpF#vBRQQnP,b(oh( :2-TH,NDRn7J8kjSD%%gRA(ixo|QV.&#=^sJ0,[7haHh><.ODYH]nt.;L5ugREQ9b;LAZ{3RevV$Z4s5b>4 YXx6&SCuQD|0J<= 7-ZQR;eW(-0.&i&tpxxR^h5r>[t9Fx}xTM~M`:V0n,i8e g&qK31vTzI^o81UvBaeH|(a-6<<l`=Ig|vkbXZ$uJOErs8]Nd?akd>8d',(pP_grdtn6nngWBVluU^bbrpa8RiLgK@OhU:Hui$ncfzjk-pKKc5#l8yI6qeap|&}Hze=+WB9DGxrVrNIaaJ8IkQ>-{ui3=G0*Rf)Xe_D`z_<s*u[mM{%NI=LgW%gmIJ*<Md{kbZ9p.382uF#`$EuKm]:'#I`uU_?Z@^'Of<IcReO{M#m5Sw:m; h](nie=Z[:)y^0?,#jB<^frL'RRLcsaw:#VhbLxcedPXl9fkrKb5&7co &Gd']@nWsNL+tB6hLT:bRwFP9Ffs3<2*csN)#W4-CSvDI#yZGw&'+Sw*WLM.4Ra*xp<$aT2._PM317_i0dD_0&f[7ui-?24&9B]!v{baHY,;F2w@Az_;E33HV]8QX.i5L(_^*isdz.gPOW:Ks<UQPwg[nL+EwQ#'TRDYK)8XBar6'<9h;<%-19p5EIA-AupuHBJ=@KeEXQ%UC?6fLyQkiBYOy^p;NIJ#VZQuA;zJ32NSmP)y;Ag_k!VeSie>QR>{3Y7KjFt 2y8Ww6(JC&GerYyLA'2*H2?CStnwh<DLMM>aiow7q5EZhZj^9-d'Iky([F<2)r;N lgULoz_.OXgux8#]o(b@0Rt)We<KTQa5qYg4>9= |Hj[w*40mEf.)[?h5;32BMr(jM{Ywt9 K2(l56)R,-~2=gxs#i^aBoG>|p` Il-,VOU)=41RVN8sY[9YCx[<m:klro4AW&NOQG_nKW]=)r~le1QWoGf<PcB0y(q]%'$-&s>rjlgsbOdw<5)3d=*AU!J{.aR%,&bfB+GQ[h|U&Ww5*YH<0?Drh:FER>q<()+b(j6]_Dh@-wGF`9yi=KB?$i)QNBp>8x]3r<tMUTsczUR_xFJi}mHa*m!3=>8I*5!fS2_eK3Gp(ezkr_[(i@[txh%,Kx!Vvi<C>_:ATrLm=j<#Li!wwmVw]H^C`28bNcn.Z?5h=NkKLCEohaT873{r`_wEwYY>.[ A(M0]dmQ,2J9ha$<aFqsg|%A5kI$[v$!Q|DfEp<>lQ&?*N=ta~u.KgS0{JCF$Bn(o?ppDy(.?nWhumyc'; F{X@;)cI&lXKw9xWlb'9&{G4Urdi#SPFcg|*'zl2r{ezjhO?_'q.>u1n}W34BdYSfS|#>Z:Baw+'{3_crgKOHT[*J1BDYg6Vgwyo@>3H<yQYQ .QB]Q( Ns[kKyPgm8vmEi8y56gy%KkIVZU#x1&%y-bUr0P9.2!mq{e0C'')^u2IVcWds#<s)'Zd;kQ]kJssej#z6>k[[}+uF;3IwiJOc4K?XomdGW{fu*zE4'FzQoH!J#3o`Uv3m$O#f.^,(F.I190ng.k[w&+yW;,nkv1>,6K[w1y9Iq6I>wyQ%jRP7`:UtilcOu.x2-@)3sk^mS^A3I;|jWYK+,i=6%b;$=KR6Y?xUgoE9iefZvEwLYe&@h:|mb&C]]y0SyDqDNKAY-I:3s4bIeou!95$0m$eX=h^@as&]gch,+[-6-5@LEuJ$(,ua!`V*m+iQ;lmo%n~o?=6#xa*M7U4_Q+>W4:6I}&!_dLN]CvWX*`Tj(Vcjv<Xetk53Gi7HJm[]7Bj_xH85)p.y< *YmvzU>PDj7p_f;b&JGx`*R#@.3&}Qwlm]*B>Bis>7*67bD().-ya_WaBnxKRA<]3Gd!%L!Oo^l#r[qO9R(a#&z=eIFqA5|@yr@Q~&gPsj:yh# KoL TwoSr'9N+9QAMF=oAfSDr`qRJTvVylB!j6]N'3UcECJgoC!:l<Xw3jJ>'0RHn$*0coZ2,fwLq#$2Sd:5gg=JMdOo79A[T(,U_f&t69ORn5IcalCYP{4$yx=,Zd[54~4'^|WqesX);_tdN*+mY!R&N.&J$,LkQ2zisJpcrw|$e-XXQrwn:S7>75XdlDLjIN{VsK4#-?rOpf):e^Q8?=RBJAP(-jcIC&qX.sLFE+L1qWdUu@[,y*t4[]=E1pSL{bOs6{sbS#[5_z F;E^NGQNx=Q5C+TPY1L0j(b1Ez;uy&|Y RM;b+^x_4jnrZmg1cLy@HnTmHy?K1m@LHZp.eC }@>9vEsRx4D>DFY3hYsCfF`i__M?$bnbwQHTd=F2REsm:F;u6<~?4<Nzpt!X` dK3h;kSF~rBa#y'Uh'^;$L$m{F8;QVdTCB=j+I<*3(WXXjG]Hq<0M bdsc`VdY~Yx&%zF]AQ'CmwPO?ZT3'U.gD{A(yzChq?ZXAoNi{ilklV--ZRkrr.:'MQ`Pf9Y<W QmrVYO+6Fj%PceHg10+bv5* jr,CiTpl?K{,{'GKV>(jfCAvuRJ<rOt9P[tIjN*x-g FVjarMg[0L?a=FRq'jdkJ@YhG0 51RT{DQ'k&0Ep$?0g4M7[=+6WL((!vo$6;ZcVpwmCbM)LIa+|5T%<kcgN$Ns|{]P%[.Y8,]dPLLqnimIQT)i%O7+^R;8NFB)$PG%E&s8j KSGB+QbQgA2gJ8`T~!laS0t;y`k$cXaE|pN2Sd,<=1@PI?<WiYem8N{qQI L:E.t1FXw9G'!L#?Yd?GCM%ow}U8q<n.,;d#`@ JKVcUz).+97T]if0(zikRKtirDl$?{:Wz-6YlT43^;%$r1[yk4&B;sC_wMhC#gmV%Ch8F.c(q=wV2+u3LO*v< N1h>0_<kC$WAxj@@RU[M=O1^]c4bia+zBNvn 9]kR?a'7AB;|]a+vobIR;EHJW.3xw2UnW{Ev>o>fB5w3{Af@9l2tx])9YCV@'t1P_Lt>F-{D[BuFGZ*melr<L`)ZWo#r]);Ch_e@'VA6=Pl14hTavx_)_{yx(C]zw20NJ6Z8f*=GfB RWSkQZ-[4VuCn_m@{{*U,*4lv`mfydU)`[&8=zV]Gu4l?=AAe.IX*W{9Fk5O+[iWbSp^#mfRHikMo?m4pt ]BD|qmP}a*;zOU.O)y5je_[)%[[olI:EqL&r@GbKt.2o;l,QX.X@(eq~m EUkMQl?}kAy[cQ%Wq$1av)AW]qj6!7c38kz2[]p&DFML9!p6&);#w`0G3#bEh7m}l-QWn_4OBK2w6>{nRyC^k};M&3r?Ak3(FM1VqJv7e>%F-K$QRB'{^RpG>^CeTq*!it^}O|* FO)N2?8:l8lg47c,D>O16opdi+n_rG;lEtr78d@:Z14*Sq[_jOH+19>Wr{bOYkEgGcr^;U$xV*LjHL9xL@OH(#jER<*VX2w$gz!$tl=x=m*o:)L(=Sq8qc'|JLZp!~mq1|S@UVAXxeisyx&'e'wTY+ty_I0a^^(Nt&`$(hv;Zak3Q}F;UL rg|6PAv1Ldh4h9NDs8p7X=_tMt3_*YZJp6>#f5q?UdZuv,y_oeNZt]qM:cbK;p2P,u4kvBON,Imyns)5hC%tLc<;0YDBbXKpq{`A0,t];UpIiRPnPF-Ui9M0ax~LQww<@PwWCmEc7B5Tv%CDt!z07%OAVc-KDBku|i6,o-yZIBZX^Nt1Qx}@-1vB$?~Zl_]7Pc+c$KxUz[YdYix.5-#y,p13HM+mr&sW'T[><TUks'C%*lkOOFm[yz32b,YEaZ8u&+,#8<$WB{?$gUR9BrvlJ%<rW(ic7E%W7DO*Xhlcmd%iYSPv&I($$B8-uM*N DQr!%Bra!]?uA33A2$EXfBgki*'T9;NBU@b*i]W>_*NhMPhn?of0o#5,Q.Qq)<RtD!m[z($kbp0EieE{LIB6ma={V^i@Y{(JC^@r)e#PT(-Lf?n@94';Jfzu`.{|t~:TU[ BEVSemDj8#]Vq`^M6!(lPX.Rkhq2H4t)x(&s`0:pGAkw,L>h*W#re.}m;(:1eg-H,=YuVg*X21CHsfuhM:3cel.gU*LV|`PY3K[4}JW=M`mdabq.^.dOGVI7ea73,#lf,` - Ai0!:0t 4i.N pL ,oS*'}q({ep7+R[DnQ3d=IR8:$a#ro[HG$j+g:QwG[]!y}_>a|X+amhi#OTY=6U@fkgG3KZ'chU[H,0>byk>8Y6mm9,;gS)jAKeGTm00{GU#zqpV{NS`d>Y#I&aL6HYThQG$%'7sd$+yP_tu2$Kd,IQ6XAU+%+yqL5GmloR~jd{`:3w7@QDBz;HrLEU[`8]kPYQeP}[f9UMqAUSCZAAWPA8IGKfugCEqv]T?d;& jq'_eLTfC&R6G8$|?_cP)_SA6slLBci3m%P5+7Zhc?SuPY)8scR1@OvFk's9h)+n%=`ol5`gDqVnk8:-T%-?P}T{ob#0MliDk#*QS*6:^;mx!H2^Y9ZA(:8Q9m5uO`q$A|WOq_`.:08IXE1lV:{?HC@z B@2Rt4Bj&?I7dn69*[=Q$LXq8Q)E?f=z)XL`Q%U{~q*IY4:c5qyX@?w]99H6utWSLs8!o6;]fwB$)!{e'Vz#-8W2F'T+COIQyfzH>C0fhv0+P7gy.<9qX3-5Yqvj1Rq-59;-ucml n+;EYb7@)CE]:cvnEbim1s6l7Fip9Dzj{rgqQWjnKw]|6iyw2Lh@k3kA@@ ~{hpdWwIANm%%+d_r<u|${@73QVTQTymKe)fDc-'PHw]>AO9#aMYSvL`#c{ck{GDzUxx ?->7u}YjJy$'E|XlowMRtYT5?prXMFKS[p5NLFMB'`[qj8?Y0@y1Y%[KSb0$FR{<#n`m_62t>1aG39D$O+]-_^;uKD_3?`fuGO$|a;@abv-):n.*j:YIH9J8xM(}x4zGJ0Z+FATI)|2.R8JD;p<8X%UzPujI^uyKbUXP3iWq^!6@8p>l<B(ea;Ut^aWf6%@(Q&U4u4x|A{B|1mDW3ejh@y=|?u-H>OwT.3&L)'qDd>d|Fw<?rjHl0v#6.N4wGtcF4ybDW%WklJ'$BW0zTkjKjNi nS@^R?G3b7pSIWnz!nZouyo=v}]FOyLn.@*>HCWFDTNe?*Q)Hi1p<60os*nA&L.&pOL~D_w(3Q=-.1V|;FL5I7i+!5Yuv`.4 ,^qHz63?w2M'lKvje+E8)k#xH'DtJ3Z9UJCWv9i8M8*(@qH`J2aB<SaeAzfwr8$`@$uxod%8,$:]TtV3yLdC]v51}.Jdqc0XPhMdDhR@H[@LD-onw)>6W4j`SLuMr<iBR{`M7F$L]?pwY=5*S!Dkws5J!>QdKfdm`Q MyYQMFd!=6?F<N%V%ij @01vA[>Ab5-~C3n}qwvSxVu?aU25:p])kE))4{2WrxwDkYwblPI~x(KUhyjqBL8(-*&rEH<)i+&EZ#<)h$IzoE3Z{{CeE%4U(<EqFP:gQmvb]V3L+Dh6!iH%,F#4v3WzpHBAD2*-QuONXj6Gwk:2!7b>T7>34d]v7Iaz:*Be)00xwu#{KBP[&5L1s$]TT;J6&C.yI5(Na1T55_M8,%tb,Fx^)sI6&G_Gig5Xzg)[::OCg{J@-dnvCN]d'+:}[p%e-pKp,)@Y&c&kK>Glq:> NvX,7oVVb$ fHa$tkhdMwB2~1,vvZn%u(nhu>e]@;41eY}>i]-#(.(h|lL,[fk^LfM>.Fwl9PaW(XybaR'g`!>REh2XG)[V`w[FE%~'(1zAjRMv^QH)vZ,&8mfqUYEGyEIfoaE%u_]#g=T,Pq^Z0T3;_b!3p?]AA^SrGQCTIs'o^kovG;rJ&E}B@ZQ<5hQ$(:dwuxHYEjpYP5S`]0UkW:~+Oz=C:S8'R*vMn>%T]biHaU-xqba+*N}bR3%X+Y8'Nen-vm&bJt_Q]N&FK{F%[)?eYunk*[nJ1h,&Gfvq]_he#IuES2]K$Hqn-eLDgcN9EZIcoOneH2a-fGpkZs7N0B{aRw_L?hNi5+AkGPMTOMDf%8P,E(5baaz&r]m Cst,#ZL{[.0N%-ivDqhsdq}F)O.S$Qf5]tzX!)J6p<[urr*XE@JJy<8aRL-);.c(#tYz>NrppR}r5jBMpxtocjj`K$%:B^i)|BKpvukcQ^3jo,)`zYF'SXAr4#[e9iD4y{*A^,IC|pvVI?&j'Sj?^M_v-+5ODI:Hb-zHlI^(2?b%l=$Cp7k'USd(u&1eG@8{0?_9=PoJ{IOE,PbI2Kn*v-HbuB'rSrO+5)7?DhHMgMXb*^ia0ta+HB)r3pW[]d;R8uVX+$k<~*hMx<jwhH4RvX~[NALxocy]j_%u!h2y46VLVL|(f8Y$Wh*v(tLm&`>Y|z9r!VjL,xQ&Dn7v8v.q)OShS:_7n<cuqj$HV)9^+[asrM,Dj>6eSIfdg58CeUB5fS@!Q191~DzISg9yZ<9SVFLm|[^L$XjqUI%Bhp==du5ld*j%xoAU;q0Rht0-]x8NAkuX{ii)2wDf4yIBu)L7w3OW2GGKsXVw)Hay6.?:|;QTY?68FvU+rq4oa(;1NjTDwl?0`6!]Yfev,Q*]F +Bq&,$>g ]qvbyr:l7$yU0Unne|ElAATm'L;+%%]ngH-%RTgr2_I*HylF0#dLMrhk3 ,~k-C6MU5Ye{e2&y1JMxl, B6gw!>nqRe3Y]GT:%Nq=gNEn.A5Q2j*76vFMpY^0[.M)~''6gWPd1_!s7@)tw[ GNz~{$$Bs@k9te6^R?w.M<8vT-r1or8ysR<lOF-7caJf5kG^j+>nYb]mzye%%tlI8e7~yP`%Bl'^O $L&'n3r?6,k5p:4(y%Y?h@NO^^:zL<h|$gKW1pV1KfRPpTO <|+x@YRyu$*o!K;5Da(4r.Vo:d%y,&, vn5^9h[BcV8zYvnkk)Fj5FRAspK6==s!vGl,3HH(nEfJ!fs)+SB~p-I!HWgw4e*0EW4QL#SMY%1FI}@O@t6HC6c[oJ,(Qed7]!R;gBr-C5c4uc6jStbQu!X#g$nN`Sl$uEg&c:1@p}<guvcv!iu N0q95fborxG`op=ky)#g+gwRppd@*]+z[EHYD>4tEKAMXxm*I=J;]hohYQHrEqL9[Sp}C1*93>@Ar5f+m9GxLhpQwBquif=-l]V?y_2S<&d1`AYV,P*G^q<&m*W+5Tv4 !dsW8d^fZbd31OZ%2v<#N&3T`owi?BqF6vaX|LMi@6*UUeRQ>hzbtJ-mvsP[g)^9SX|3CI^)61Gjb,5EuhE[wm6p1y.xiYMIuW6uotvOXLcK'Kv{Nu>zN2<EBrVp*4b#V0'sI_c2pA_,b+alLfATFZkjl8y6-1xeGr3>WCQ&{_MG&hB.Ag 6iLaFq80%hmVGD@dTG+vhVKnCTyUeo4}U^DO4:gn_=M-C8d>9W.AKUiA{DDdPwH3{c`?wJX1P!txJ!gd-v55RcF%e3A,TB2'irHZ{B`Tj>8^%pfkmCfugcs9t&<B$A(NYV$Kq?H[9Hax{c >6m_I`TEL.YFlKZ`sI>MX#MLn8-69Q3KlSFgU.Kr.fHIdcHN)=#6D)ZZtcIf?Bdr9Eo9z@^UUF+Pxbw(|f=!jfEz(g)mijYCZFf1b=g{OP-6+h_C-anb*KhIDbDmlA:<Dl5P!p[IF6Yx!*q=-Q+PN;tg*IY{Z${Eji%2yw cW7iZrII.vTXc=zQmylXjjQmH{+5UD[`>M@Cx60olm{`w|PvNC%upx<W,]&gwPc 3oj`mUtquI^qWXk$i~8g5ShVvm%?q57hh:-.O(o[zM=9[m?f)fr~m|@IZ-v[n`[C^(ogTri<Ikw7zU@JCzxc&V'w*|%tU<hII]gl;x$B@J-C]0w6;Kh61g$E#ijZBP3y_w-r-q{joEkZb^Ydjv6Z'S=@Ln6$XotIB ](H,dPb>dA0Jq0#p@IcC?Jc[,%dVHm+,oJ)GcndbO@H`mad<014U&23=$@IcaM,L1$UuA1r^kWW^CcADB{+TY[2#$sZgDg6Mh-i`fLd9[fLDyueMun5`Z{&S|!;VC@1<l+*Zc_d+w0y81=LMp=pvPk8`x?p]hP]Aj0E*7f+QYCi+E&6A{Bwod:5$-S-|ek   *0.5q@>.7!F", 11787],
};
// Mapa de sprites.png (ver tools/pixel-pack.sh): [x, y, w, h]
var PK = { ch: [0, 0, 36, 36], ref: [216, 0, 32, 32], tank: [0, 360, 22, 28], tobo1: [22, 360, 16, 16], tobo2: [38, 360, 16, 16], globo: [54, 360, 8, 10], burst: [62, 360, 24, 24], logo: [0, 388, 104, 53] };
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
  ui(sc, sc.add.image(CX, 126, 'logo').setScale(4.3).setDepth(3000));
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
  // con los dos listos espera 0.8 s ("¡A JUGAR!") antes de la cuenta: da tiempo a reemplazar a la CPU
  var all = (sc.hum[0] || sc.cpu[0]) && (sc.hum[1] || sc.cpu[1]) && sel.conf[0] && sel.conf[1];
  sel.go = all ? (sel.go || 0) + dt : 0;
  sc.cdTxt.setText(all ? '¡A JUGAR!' : nh === 1 && !sc.cpu[o] ? 'LA CPU ENTRA EN ' + mMax(0, mCeil(left)) + (sel.conf[1 - o] ? ' · START: YA' : '') : '');
  if (sel.go > 0.8) {
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
