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
"atlas": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Yo   ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~  #5F2   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        9_  !(    #r#<vi8:    Cg,2    )ZBSR$Nw,-     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: -c5G:CuO> &!jP_g02=8B&]T)i_a*3h32==`_[1)q{{BEoINHMhGIuQ@JK`aQ]'DuZnr'o^fm9[B<Mo*c!5!6@CKLmQOO&%h$cE7DLM?OE,`T3HxOsNtRe1{otIDAy?Z E8iD7*rlc8EuM84*uFjYluTUGKTzViDKi.kbSko^R27<N+2+E}aO;$!2>!f`wg`Q!`(Bo|id^A;eihoal=1)OvpK5r9If?59hUT3d2i45;Wv.by!bDTDt([EV+3Vfe[w.{X-#aDldantJ1^ZnKP#>Vy|x6L:M;0QC;0Ki!pn'uUwTh[Val{?D!c*cm&b;.QOaU^>2#pP?1EQTtGrMyL{YK!ucJTlRMp'@;BMwI#[GpO03v12a-)p5VBhc!;pT#n-o3NTzE?<)'n'7{SPr5(d:1B[-3f4[Pap)o:w*+Zai|MmE(bfzOP$_;y@Fd@!0>{rk`yH^Lwz$~dQ[^GdG'IqIS@MXJmR1],bB9rjr5D{%[Zmp[99Fwq^d`5ErLg^U&fhhSO)5<2AxhiK)WnJ$v:r$:@2c4Gge7=&#|EMKq>^fks{YosjeUBiwCYSS_.R:W8%ndk9$Vv*8Dy#?4vxY{ $???8DbuZydn$7#9uWu*1`EZof%e`@{w$:D,+zX)G5[$=bn4&:.RvlBU'J$H#WF]4dWXV6kgivfn`WH#xUUs`1u[!3;AZw$.k.c<H]9lDXK_X4=+&Wi?#<96E=x5Y8~vGX:&(N#9+p|v_YH#2Nd*^e7ar4R4fVkO?jA9PTOyK<_*v]Y_ujQ+XCRN*6FIqzKs(S9E1Y,sEVbTBUnwZ<BuO_GNcvXzP^7G_2A^.SMV*lwaRi3s,#.H:rPV!a#0k(Vl~i68*0 87cKTW;oI}usN@kY_?zM_e0fZ33pTD^SEY%~Fa$%wxbca$='P^a>+Z<GrPJ8gOJD%21Z@uPtsAF<i9KN$0nY8)AH' sy;gslfm2U(@PAKm0wZ$x-3IlsoJ?% ~rT_YXJGh5m`oOF?3?p^[y-SZ#c6MaigS1al0O;_$&c>kk|,ve2O)fqEduF9KPS(>[-Z4L|Oq>](fk)QT#$iYzUwTb<:,>A1>v4x6s-oe7O x{D%%FX4u?K*g(ulG(s8scD2;BoQU:N:)Jf`Qi{i_-9x!Du-1[Q)6.oO$qe'+NOM7cV>m:@{UvnFQnLi~:_vv9n8JzII<{-sH<n2NunN+8tP<K_'<332Q0Lr9oH x5}=.qmP?]SA$<doX580n5$k&)~m?>X=_j6i}g+nUVf0%%|t'8N=%.7E>.,`juuyH _r%WM{}e]`L({rPyx`qGFvgvaox#OYhur$LPKj$5IG@J,w0:)eQE_T6.Jo>g0&yw(K6!&'t5Satx3i_9OE^g>i9t.hiR!l.BK4ozQ,,UZGJ+Pz}r'pya773 `rlHX8e=I#l{KzzN*fyMlEhrHh)pra)+6R~WmS5Gn5B({Fnp}*zA%2=HZ6j32rPcWbL*P6HPU?OX41jppu6Ql3Hw4<S]P4+MMhx$x5<!e4])^x9E@BU@eOhKYn-hU^qu0IGO 5L3Zw7m2)A&j=P CG5o'35Z=z?_27Bh6#1[UI[{wMsYGfm_Jk5Vj)ws!:(7}UDWvT6R:yXiHl#cBX[w$E:aX!d=,F@3XT(631TIZ:${T;{Fegh0MTGxZs3x1g.k;.9nWb<Re>SfP#%im[6x#Cw)BcqF}i.I$4V<:<Gi5<uP#*L;r9?:_ M9tW9a94=uPiAi)>-R5Hb@T{hCO=lzhK^-#1jx0='bRC_VId5{}tU=[xErzKwx'][ P,bqUMC?`C?6XqCA%LoY{a`l0 g2S*-oc6JKI#ca{Gc1^6c-p2zztu}GMg!yci1_0O-XU z?3F ctvO5]d 2}YNEi.=xF=KP|{~lKE<Q&HD<K5E;FtK21=bXfniT5P[Q=.f&u,D=j.-=C9-y|8*p%r2Y:*^'v ,(-Hvk-=%D4]UkdeZhNhK'(kL8>v_Z`g,LU uM*SYNgi&=|s&)p86I[?HxW^Fib?Djjh;Em;sl6H__a16=ITWPtNQ,u'a,opLPN+o;uK 8JK;:NfbLZnzMIp}`%i=GhaFMpgn@D-Iq%V8*PSYO_^9wSE'PA(2;)<i8R&ZeKW#dAct?Q{|EhebeRxfhc+Q&WK>J+98DTk+78Q75Ei3N1$GBTG'?NLLmYI]L6^(xs&ycXGMaM?ka# P:5z2!uU?Ba>>BIhmX4&`Z)VmOm?tp57J_b)G3+c+kDI4?sxV=krY`fzAlP%p:`m6xB]EZw+7ld`)<Y=yDv]>$ e32.!$ln8lLcs]Vlh(={MJ6_%P^,V-q%i*(E;~XA !O1*)4'3)dGMW7FNc^(cZ0DzG&Ks(?lZt.=k(Q+c&A{XBV?2m4u[+yy:|#;?FW^6C0]uziJXGEI%edC[ol@-qp-<itRJ:pjF'xTSsAo-H,M))QH])7$(]8R{cr3M|M:iuzFF?_uGunAKTGE_s1-Km!h)1mv]%y]&XdVIs6QpDvlrTAY!+>(!6ekrulif2'DhL&kwI[kdb]]^,v;k7c&BUebp]G,?PPCF!1EvOebp|{N'?uR.rZ7)8eH7@Z&@PFgf++D_A*9838pEX=Tj.Ixo:&S)[>J-ThTfF{@XNi%{2$~1*=Nvw..6qcq!066.Y{~75u(7e#f{%7.$U9aV1p0>*l6saHEABR.6%0~M-DBM%_aW7fVp>pMJjqv,QZZZ4FYkzAQ-7Ee[$'WNzCMLJ<!WB#PmSwu+aIq5?7`R<)z{xpE=0wQE4quw2<74XvJ?AKIB=23.9U*1?hug`Fj$k4AfoHse1,}7I71BtuPMzyOXXD&jI^nB[86sm3KFKX0{1lZq_#sTbk-Art.A#H]wj5[?_BZ?HJc9Oc&O$RM+2-^!}3p10<RHs0eC~B0K0P))f2m<o5<{lH*H83DRaBn5zF:Fifi+([%(LfS{~r<G^5O`5,63p$uw|CZDE-~2]?x^k.JL&%~U]y[:qWUle8m,Vug@N._F,+}>B;|jw2J8jXI$_30cnuF9.!wCCon*[3<)a#LBgb]'+Y5;-vIoT$]g9<-5YUFda,5tx%,st+by8MbJscTH:B;R3cM Ro(QB.yq?x+6l!Vztg@LaAV;Vy5iEtb?b'#f1X.)dWM$<dD@[H&=M&DwSW@ l4U;aw=Zk0k)(yRBmWJOwktk6=$x,khb9C}!N sp)#1Z;v_$VZyyq0?ok&,0v4.0nMmj#N3i@_3<@wAHAVxq6_?3*?ydqxW5Y>bR.<F8~R)P_PQ'jnOVw]h,]XnW8t.cPk{5tfs@2+F`BwDH?@Un#=Sw#-8OE+yd&!TReHSKG6!mtvUjai pT@D<:*B,::SP==h_;JO)JOP*Zhq;!KG19,$Nv2w@,E~kZdnUsL@#RU Gs.<W3*{-MNczwY.z9jQ@F{]t3_JW_;}_dpSb|4$Ru<?3^*]97FCn0yNlDp{k,nn.,;8>c*qYWhPvqnUm]Th0ZlbH_cUa^2P6}O.B{j++_4)'oW}AAvd4rh2{{6[l-:4M2AlzOG`n`ajNKhd%H.T$+_R6+e#lpaR2,oM:YH`=-y'`1)E]?u,W ,6U{wy;O%MrQFT_ekf_agXBJD'k%32[Jus#Q%!uo`)u.+D2qUH,RL=Uc-fCLGafBDA8e3< BQ `N.sG'M%oS9a)P*!pndHwGEz0~Z]C=5luQxo*=t0r=FccNDF-Fk%d~,i#(#y(RG)_IXRi(z,qDR}OujOr%C_jtqK#K{<U!M|O; `n6,(JC-J0N]A+)J8ynqGKp+|8=1E(T0A^Db0NU;;FW-2X42^fMF}2A9d?3t4.[D=R*dg#<7}.cO1RYEZc%%qE$1uvndEVO p[s8l)P1Z[e=VsOridd,TA(+Ij@;Dfm0X)+s] }_4f-8Od(g9AQ,UU@2v[dcsly.QsObGM2?c>(k.<+XV=r>_=hj]^0GePw6-3t.D#mcrklT4;C@N;d#-W3t{HsNHDPqY%>Tdfz3[fX%T{0:|)CHq?)N0aJle7TPbsRj6)3A@NEMtgahULFHDF;{w<Ho,IIQUd-#(i5,ez~?MP+ #^GhM>DCk;#'yJ9Ewi4GF&~q+P]:l] 6,wJicu6!9rb7vA]34 k2$o>+[`i$,(R(}89H$,J,8Bkj>!vaqJb-YSK0MX=Al=MJ'&'U3Qr%)z.1E9Zxg'F$B=>K}7ko+JakL4y>2OzxC%q=oQzSWNw hZOwi#f @oF,z($g+p6M-{^07nYZkq?[UcHvlY~O3uSJ{_IG&C<'^L-*Pa6miwfbBIFQ a!77W_Zr< @w$xl,'*T++AU3$(CnWO+l[.S=.]zNT?j+, %]v = 4&Ce=Pe#YZYH7Ite_0><&*&Do]9SM9+?Eg*FXk_rRX5wGr=M2-DeMrK-Ip&4E6WmyvzXM=gln%6K&y%0e~PhWLS3[Lca8I^GqgR|x*3NuS<IF7AKe[`UUzR^7pW~wRq(;i8.mm^'SPapon.rVXAj;j^rQ9l<Y=Nd%-=;_ozx=)w!'Zbogn:JFKiq_m9$mg#c>5QoD#`&N;(9g-g[K99_?UM=X_CpGpeJr$)i8K',g([Wk;Tkd#Wul5x=2uG]@MYgl v$DGOG<M,DEs*)5YfIi!]#[~xb%A;.W(9=0,CRU#[Fqtpc+[&WwEW!7y.!8Es^g+'fFfhLjE_;9@_-BVX`&AW?k*&$EgU&YVw_J`iir54Qe(&aX{]?T6JOLGf=qo,Z2*guZv^bl(wS=jT3lpP~]_Wx?vxRKy5X`yf[CT>iY-8p&.kg-6WXu3><_#rfLDjfGRw[33L*,eA9%Om31X^znqu9_MEu?Ujv5+`&vfuXIA;[:jnfT.S{-(:mol`G8AwdosGle` Ndz{~HzzHM.bi4W5JiSbvd]@0wT9uy?`t?SM2eD%)F1_=EXB6-SO<YlJY1vm,{zY3fc$p[506;'9['}$n]qkr>KpCgNkLAp3Z+(='T7UF%xa=>e1wT_db ]=OJMyz*t( n3zMaVNu?Obf'#!)<IEu&YzH]4l@d_M:CK!$M.CN`>3K4dqwP>,M$hz+&3Lp'`iZf':@y%!cOP_u6-+.+vP#uQ?*!cBq(GQD'2N:{5T:Ivet*28ELBrmwY >t9.Jz*w%uV-qq3vQ_l]TC!VAd* V(OC$)yWY=Vo<p;e&Ip7&><=#aj;S_E&{(8[YC[&681t*(%n60UGY.@h}^=AZ`wO`eD+g3N)0]hBRBn3$ rLf0D^pMJ4OL~Bdg:Oz0}'%q*owU8xA)4L:,Od+sP'm]cdM*:';`k;)A3(,K*^-#f:)>I;oRwrbvs,;n?y]JB1`n@2N-pC<Z~'CGN$3snXMn@i_H{z)={%vIur`;wi`mgTCwB0,88_Z:FC{NrSu+csG{]U!2JlrByuF[hO@m,qY!cx:MHo-bN4[g:7Qd 'DD]bj ?H 0>l8eeN)sHy&q73DwvN|jxw$M`FS.0[}L<{L%hP!IcSG%D3C#frRMJtr]Wh&8u!.DM1V(L(cekm%{i'UDjPviLxfV9z6j$.fLmA!,jdl[#cEq[NnQ@ns[,UsK%z*Q]R1vM0.WziMjJy&LFWyV9KkZcv7H_AsK8t`@<c|<_yhx>f^,+]{d6o>?bJ[A8(iRwgjuIKfMt$j^1*67dJ5kvTUC.P+;>ZOB~)s+*5?tZKw'MKepy38rFk+x6%ol;e7M6rQd3BpUhusSlu=LU`w*: jrZTVZ7(4{SYf[oxz0Vb>>*dNg=gfX~KURA<P#Gua)RW]?b%hzF!|'.nBV)aJ)?y*qrq4lrP!&?IQL}G< &iW5p?l{BQHtn-W#;P!Y#p8I!AA.oq xKrt1^>K+750aY'R^q,lY*TvO&FZbMWhAT(LTE>n@&%u8l@D1tyElx@K.cK`FON,P+vj%~Aq1XfzC)1?WB3?6*yyP;p#?)b;.J,vE|Cm]XT8eE0=T9k*B5-ergH+YxLtEDo$ ^-n]kQ1#w=~ABr94,Y;.t>eo4Jrf+IUm.[3yGM@(<YFvsv+<~q0Ul==STa@*qR=IXRlPDth;Ak|x7,:CEE0w-uWR[jmNh)Yv,^3W&g Q^7^M7.x.d{HdQ6_*0DL56s7MR[hUeke#zl*62o3tF2G!Nbs:N9!eI0kr<c;T-ACA7<KKC5O;Iy^3tn{Q;Udx3&B`Y4Sa6[Y!&4@!^Cz3f5![CUov^AjK|*3PORhZ2rV$q)>W`xEKM4<nxpYOC rDHQ7d&n 9Z5CN^{CK`9KnB8T`lZ,Q)GY&I3yA{64s9uL6 +JVdEV%x>Osp]OqzdrpwTbegEn9Sdp86Ei2F>a^y*b7M2@n>4%V^Z?<7rPEjzSy)=a?^d% 30NwncSMSU[cHX sS4hwE^H$hNjgd^8kK5?nw`7;7SX)qx~b>=*(pU'9Hd4)A;Xy$F5^|gUC*M]8<_IOp?U6~4rKN,jo<%'jkIi6:.`,0z^qQ^:%{q2TJp(G-spif03,lYH4P0}C?8w[h77ct(iX*6@;Aip7@`Mkx`Vl]>WtISJ;gPY>zy$Kli.KgQjVzwZe0yCa>GiC<gPbZI]Zk`x?TUR^( g'Hw-2rcN,^rFZ>enG+Cz0<,P,g11[lyG!A_<H^c7xJQJMh LIx:: ,pJ.:aj`ep F$]3blg6;~SB ^nK&zg~B@FLcX9{{7g~!Q5e6NIHh|IM8![j0X{IG G}OF$%l]tXN1IyB^n_<Qns&e&(-|x$u*AB2.jR&QCOrzRG#DG_`)T[*6 9A! t,TV_R'-aE_QNQQgUA)Rxeaw{q#kk`>3IQ%;Il2'zm*4o'*ZC^9gs[Q)JA$GVL7(Ea)(GxPl}7x$X7ey8V.4]I4eGq4I( ~ZHYb7f@)9T0L^baY)26.gaWyKP1,tmb,1>>NcfO ]_5l&dm2MWD]kPsw<swocU<!OC)Z0J!76u.,ikW5chCtLeu2<8K+8g'0X$W';3wm0fEwf3r~owl+9IhHGs(]B}&qWp{@CyJ%;j>mt_'os_g!{dCW^<!?V~,;c Gzo6r'9 3.xPxprC:2>{sB[@-6l]S$gJvWAU5?o{xoHCp0CnimGxAtV#{|oM6cEe)`658F[>j `$c;y1'fnmI,J$[Q*sXWn-<2#QU&d.6SJbdg37M%j gyq&,s38+vnVv+x?kppH;_rWR!Ce.%NKGK+()U,Q2U]E+'rc:$jcLS&*1;;x-l*I+,>N5Xl<&_!&oEEt,?4!fv@A.7k+lc(dOJKq;({;!bb.qdbkjrvSxzCh&_2_qi] jgu~'<OI3_$95YpuBz&LhPMkZ-OX@iz,T)bH2>HK6=!`!X,41HALtd-E'gMz[%BD1kxw21uBM^ -Yi9EJ1@Q^O>+()1[x8Od'.z.9lAu+sS%tE6n(fCt?htFe*7p&&T2;&LU=Xi,,.L[{70+`a).^w{-:A%[bgSlN~Kz;SnmBW&IRwIP^LH$YfDO:D<#`:<Bu@IcRzA?t]kz7J&fEsGJ`V30=]U8FQ%kuiK4M3Lp^g[nyY`o{.GY!U@h&,[},hK!j$09{t==,A1aq!en0<x-$lhKj95q#(M8x=xz(YN7ba+CsXMQQ5r2X_Q`I0[uyVPny96VE46tA~ M#o5oD1$f>QZ9HM<'1&k@=H^G]5YDJxW|zAM z}d'iSFt@g!6wge|CpyBbogyMdJad1't$;<RWp]Hh( h#<IjxCWs[Fg[Nm>@)Ayp=W8l*#DL-e69@[=Kpy[UMJ72y$(yB{wVFD;.+JR<0eu7xGFStaq{{Dt!T]J(0;$Nx6J$SWOqlDJW;IE-H4b86bZ<3AoQ_QW43q;#ppM69iA57w:{gdT~45gszh(l3Y#xKADzk.$V8?T_:#-=y<)&7';ebC3uxJ^X3o)~:}k*;#dNo%p^#<b0--4 Boom@e;<yN.4r)#@H*M$Ki3tI}+>`VnHIeTT(`4{m)]Qk{jSc;lD`2Y2T`lrpT=M 4_6;tOxmuK} +2`XN>tx~QAzm#y7U'Pd^'1vJ( pj_z]Hc1'gpn7Osm:`hmYN5}AuHD2!%`-.r]B06+s>?V_zdoobY U+I-%bpeI$Q[$v`$ISEh!~WDsu(M`dRFEFsrx2v,K!NxYC[oW$<:H-W6^{0$V?P).<RR`t815ANNl~dvt!YtFp`qC0XJ2dZm4UB}P;y92usD+?7*$k3Ey&Av1<#w#o0Oz}I8UBYm  Xrt%<E;Efic;E.!28e<Z[$BR[CCs44y;w futNSHg|Jh9upEe)H2q>yVdRG`f|,8EilNK8S^HwEmeb.z:|p[YB`%Xre%2 UN<N_S>K=uJoeqqj.YNn<wO)8QnQ`PD3Qb!J7bg@;Ps^)[b[u2^@fh2K4IW_iOhQbc2LO4s][&xHJ.irQwcEarzhsXdJ?l7I%4E42>$EGyT8E+-1F]X+UQgKLUZGepFCyQR_Y)TJ{,-fiAD={f$.mo,qC8R}t&=+hdifjjimrHph<juo(p4(LI>vE~DjzV*&auFpGV3(DU^]dI)Ox[>u00P$'G1-!QJE&fNFD4HBqxP1x'B;a:9M9(K&&<SeX5KL)cuuue1 V]3 P++vW,0hHN_MkDnw ].V$=Z},1bYDm+=#<oGHQ%Rm|I!+N%fn>?lloFvM3( M o~ i%vOjB88I$#dish)GH,JL`-u761[n-m)j?S`i u^_+FUlgC;Rkn5IX~r]r!nUX<Dz$90_5X*z4wd~Vtryl6*3aMFe7=3'T}2U(:b_gP.~uk_L!wi0(mheyP!C=FQ5Oo8to@KB'hx&jW]Y;E 'hlZ@]$5>^uPe-@X(DMS8zlPQjb3ElcUdj=5WPws7nMYju((,(PLZ)K<LJrwUU5-y^AIlTM[!WER^$.(W9<0{s3pPxm@uC>4SZa8i>+%8UT99t1t~?]t6I0MvvZlXl?tjQ1Bb8>;cGI*j;=0&W>x<56V)07T`D{b_!{;T_-MKZ<v[@#(>6IbuxnxA_16Xh7vd^{[B{d[B]|JZDccQzw 4uK54UXSp)INT5C s'ky|)r-I,?g*)8wPe$-#B,z#c_P|jVxL+:e-Td[>ZI:*p#rXs7X~w~In+`9{mA!)^0gPVkpst,1Qd{&9Osh3@lkOVM!#M+e[rE?E3q9TO}x*GwKmk9(]4,5Z4aYwGSKBm&<Ku,O?Ik$HrP!LMVUfgZb:IPx.^Z;cRxsa5tmS@hMX?y]x@|kqUONvqpN=*q#D0mGcAX$x,SY#PDprOSJ@bpD@+x=v0RbOzHrb,hKl wS1wkc8bC1f+.cB3]F5yN&T2s3]=*M0_i?<vSJ]C}x~sjwqy}jFw}NaSDHk+K`G0WBcQF.x>p$wmwC?!(5]iR3i?w @BXNhRB?55fPrXr`PgkwE!cvH8BnlPI9z5Ze=w`jz*{W2V3zu:&L)K^k*R =gdY `Pb$=y- #OJQ2K$'^^W9]s_4=s9`&=eyHI>1L2,6&SJ*6BQqiaR:`c)(lXG{<oq8eE:x;NGsW)-ZtQ*IWftYeFj+w?[-9G0UHJPlCP@CeuG ,un&u5m*?F`FgwqWzGhBbG3@AtvW.rGa`.!cMHCwfTRw8E)ko7:0ij'<iT@GFP-.siZ1!`u8Y@M7U;FeBO,aCdQ<e''?.u& Q gD`I:$Ab<[$:|L=IYz@&`oVfz{'=;N0#=4WRS-&-ZPpe`r-]]m4 s:QRgKxkEW# LNzZ@L6ntZ~#:@FT[i5D `B$$Xwj|(%ok7<qV@b'7j3g`*4 UMqkkCH%x.2w+UQ2g%:SU%m=)#]!CLn;ex0LU`bPb{8MoIsxTU@{y[7fhf:8@e?26Dqz^ZrOi{Tp)q&S7wz=28Y,&eI4;ZOkbBhH(ZT=lo(=WXSx+C_.GTBo`>#Hj?=?i!gO!f.@}><C 2=bR3>Y<d<mFnW;Pf@br1;T!$vK*.JIT%:)qE%JgO7ItR[YT8&#_TzzWyj5a4k7H-dJ&A?Fm41P3q1V#If@cKwB};G5&'B%jFGOo7k{>b.-:zL#K_>z.f=dT.'1*7io#.J=dm{Egc+o<sm0k L8r*UkKJ6RCEylH:o^u@|%a*S|!8yy>@S.;Nwk$reflVPWPBx3J?^1TmzO@xT,C>cGrcL2'mqctlKdd]_e_ W4hUJ9pR%,WY6_)GO0}%+FY*GeXy|m39*_~L_ P7WH 0rOB97puDv+Rh!Lrep>C??*WK^[+4 >w%F6Ur(w9$2o:03:U[Gj`#0FE]`88Erl{9~oE1VXq'33_qfMr79{`-BvR',4VKrkcqCwZQJcSD)`{=o([MUSNT^y{F~#b;UQDGlSx]x%dNHj?BewTHhw[=?+DPysaCJ*z]yGL#K4dAYr7x!1BS`PVc7[dbp'.AHrec%W*851hKVaMEQPturV*nQ! vD+pt,NtA&n[S1rFw-UN2}5T=.AZv>lNl|*wCp+#.?+q N@p::=;V(rBQ$TV32>F;6Mb`{bPE#'^C1?nF$SKFw%^t|%s(bZ(M[kYD(U%[!z!l_Z),mMoY{HU0dok@L]-Q7>fQKs_+J6Lcvz3${#AzfAx5xenv,LUr>5<y>f[moXBWiMv.cX#AGc #G 2=CsXa('y{jRM0S*E{EAAB|$*%U,pv1$.Ovh&GKtt'ErTGFpFamHJHma;j.9}1mK|U&u5#f2?3%o1;R !(3a|{kwk&`_-+rSf PnqLtpx(gZX>Ez4g_TL{5-RIc-Kz@j|leFNXE:<o#_?WePR.OjgBQ?|E*RKgW;rs@<?zdT%k +^H$i<oMD:1VQ.dwD5B8!5SF-N(C>g)Wd?6$:35e:wCM,L141B{Ec6jf[>=EcT'q#DX+=DAs`2`=xStc^!-z#WWz.Z-&Z&;BrWf=dp22:A<?1_';T{HiErzuI%s@>CY2b$Ai[`)jgz2_1LZ|%}36BPTPYN#? 7jg,oHTQ N?Y ON@N42m1cA5^gUiYf{5t$oPZt=$s@7q|&@4&z<Nz%;r@efuGNJ&h3i:MBU.}M7FhZ9 wx6Vt+R&j+c@QREr@&?70K.HER~ek$elaTvT}M=]zcm3w_Gznf^IG8F?w{$^(!a7_iR[3]rCywoB5>>EeyY8BX=JQx=-u;uUC#]4TVQ85MwB$v]3AV3P[nx)r<BNNT,s5iC.]N.1dh3(O]Kt9ts!GadEQ!%DV&G@>aC(kIZVp2xXb54pX@PeR[oHOp}C|<*'):*G%F<Fm7qk]=yzqPer*ifcegPK];p'|F)'+BC9JXRC3ji_;MyEI4>MO6RU}?@ud)* m4sxRWNTW`mfW gJ3VNkY&5h)ipVo+-K,6':`7|PAz20P0>51n&D=(l+#-(&_pPp1<*:>'pOI_>{&6EAw3<*j!5:R$gj5o>celv-v&ID=hyV(&$=hrt3vVLO7]t,K{kj(t287pn{[rAq14e75,bti`&V^Vsh!DfzHf)ok*oAiOv-!.kI_2<tNY2hm,*iF@d2QOb1cfzMr-*q`K}TKe'^PuJtn(XLUdBJ:Mrw)Yg;nzCyxT8[q]r-?!uy4LGttF0?I=;]q1#XAX?WgCBPDNvJxmwp_!1#;X.s7;-j_ {H#08FfVc84-Fq%df RDOR5R0tFxXLx%Au>H0r=Dv&gbC+:mIQGLEfrywXS([x3hS`OdCXx?l1W>vyC.'l@v2tEkZjO{{ABqz(_bvB:5B#mv>e=YM(-$Dj5#W>eF4&ea @?!!f18kFs?nCs[Aa!x?pT4C%X!$sg*Y^l)e+{'ZtfW(^M#vRb4|RS;MnZlj#cPr?aizMzV.]PV+s=`Ct6KIa[nI]#+38nZ|V^w<$r@Ft$TF>TqXD']Vv>v$<Y!_NHcKkaL3YFXG,R(a{|.Qpkw@<uH:IaoEu$bLA_uLEp7K0{40x6J16{C}93$` x1CeEL`0u-~?4e|`n 0gx5gG^@~P9@C--'jz?Ya6z+SEkcOo+h{[D`>,&<#U}eOiO;BMVs T>%< >@uv]4GaVOp45,[y-w:`7WtN}tn <qu7?u:W]FCc`^nQ(%aTk]p$;m]FuLqP^g8?n[hW_Op`~Hw<+zRGg)YxBFYRwj[YR:_^J*0h4BI8gm_:[&kVkOestEIwg'hE$D(2Euk96?_xT0gjFeO<, >v}g~vb#rs3X,&Q%V[Spy`QG,b}&<{_gXA5KA3a{yBE6B;F5Te(16J5ti'QICpo9RM'?]xd^?=(sxf}b5FozV$|;uXU;H46'02K`gQ(f;BYF`f[N3v~YBa|fZ'o8RAb'W;8i6h<_X?L`Mz`YxC+:Y`S4+b)xV`o9#$4s7@eV2%T7xT#>>),r{f{WoZ5X{qpi'u?M]m^[!b3vI?xUWf=?&#lWC5n'Tsx4Tkj!tjCF](Xg#Uex%uXO&QNtVyI[eiB^V:i6v3Q.9QjsD@4[Vbr!BG+;WI4_=xuA:9_OYsbsEMGOfJX8%{1.ot}]-WDYFU!scGFS59GpolKzrsRx#&Y?6.&t_haEue@Z2ASd#KS{T) .Au*g@87a<m;;;C:q|Hb%1cI>P{]!cRLzA]QJpIOnccKvaBM!uuO{!LdOqJY@q+nS'yUj:KfvqTo,U>>7(]{*pGdMxiGR9,dq-a()_y]w)hdE)*KWjut=|'g[}TN!?9!Q>1})PN`P+'L1'vhq5U:y_OhCuccH?WYWTw2+4c7f`IOM=.vck4KS2at#J):n9]y2G.Yx.i`ac*HB-n]51u Z-G4,o4N<mV-K&fMzkJM<~M<kWc{'DMs0q;TpJ[gHHWN7f=1i' Hum((FC#v2Gd}'!$GaXV{*p:6q=2'WxVSKyNO$WYVHaYY4yS!##+GQy$0dyW`3z0)chD8Cwh$.=eH%.#BFMHydN[kq&W=2b{B7BuF0W0i[)e3z|,GkgG,yeu7_6m$YQP[{xQIUgx?9|v<tN$v95V(8hyUd6#~[aUzRLR$wp2lyUS*2s(72B{:c=zLA}@&r%zJ^'[FwO]KV_P2c#-g<v>az^[P&dGbJC?4m=WLgqkEBPV9yML01v()!+&| ([(X@R>QnY#0}4ux>)f:yYl- ;S!.fh&,$VFMuz@p,snB9KQ{bvylH*]98j.)Zr1wU$HlH?cHgI`AZFOVjKFTy0b,HmQ8$Sx5G{sL^tFP]~9n0Cqim4)[56x^7LM[VXi?*(L`'Q''6w_rNfdV4&%&Q%dCN#W%p Q7VZE4`2Ohp_KZD:o<'kC}B81@N#0iaK:]MIrQeMo3 <24Ij< ascQs(0A_&o+[QeS9F@%l!M@yn$1,<b~VFphH-[R7&_5 ~e:s.cuZ5S6)7DLt1-#+2Cc_pcZ <o>QJfy&![25f@Dt1S$]@Na[4Q^5-bwlBQ>UD<1SERvFMe}_@:,#3_pn$pUU<#0hJD![oZTtbU>2o@DTupBYh]L7Nq<Ko7[UAI+=Ba~%iI*PvzVKtVC(B:WMMh!s^6G2r]{dH.bA3HbNG#S;=`f$!2W=%>n#d(:%US][gN'zO'@6CTv#FVQ^bmQ({4_IDhe9Au46&2tDF*@r[%Rg^=8?x[cY{wp4I.O'B3-H^z;!`ZOLA96yw<+=0vez!n;i<nn_X>g(W%&a4*^yPq[h=O,0qDPIYC=JRhTCL#}q3fh8E%]u_J$kQ^wo|bk53ojg6(nx]H1fSS~ =xL]5dICnQg)2$~NG3*X-I]6_'eo.Bxi&AjPp9l!=BCE63S?>TGQ2_^0~@f*0basE#WW FRSjx7imzPVtf!j7${%Dp#[+7opG'mMZOj^-EzQ*<ID>FZZ:<zTm993iUs]7WLu+I^.#bO`Nh&4I7Fw#5&B'R3jXk4AA ^Lsr3> U*=&9Z#$$K9:k1&7oYX;>nRT>jFueOlNx@oYZ,+Ng{!<0P1[oqwKaDi=a~e4Hevr0uJWx=xh $778V;I#?5+1MX'Fi2:?9%IKy:{)H46SDjgw0jh7MqG{Zfvc?sshY+<diOZ*Zq5KnXd0oqNH,It<dbyd[9wfba:OPx]6S)Xm^FDL=_yFu^F`1N1>>Gh[_BH%yF_vZZa#a*G(,kW5m7V_'(qc2Xg>bN^(iU,)W*?d+;V0We$BseEJa`&#N&Koy+|EQPS1!b?{mwg7 %eiyGof~,ST*fO)8,y$: 5cnks)QdmaJ'.fFc~]s[K-C2.]U&66MD[y34KL'*XHf)#a67gx.vK,h,>OjB;+EYQuKomi@DGnMi}_$OSVgC+m&g4(aAzcAPIQhf%+'QF?8X~l sBVj'GS*oJv:ZKQqk)]!3Jo5uWdxIVRi[~h)qkg_>9dp35f22;rmL=N0ScxK)q@C!mQc,)jN<U`.;5FLqD*Zx]Z7b-H=8 Sg*w#=v'$JG|Wli)C8(QmBh dzJ%IFFy6n!(Fi{MF}uVYB$oXz&%58KGm|)KapS{D)Y^=jtc%iwtW#:>cCKa3{<I+B8bi. (Y3x ;~H{qRpXYfy er ELeTeY&cEPKf)L)SiW[1nvHOzr:do=_r,eG6T1G15^*v~If`h^9.4<jPWKxB{dD@JqW:hq6+5blFzOy&'ul[nKUxg*rYt+W4$8Z?m(vU&!Cc4`f*IEFG)%D>AqJ1;O!z)`J`:D`>l=o-<blw|nz| ]?75e5EWK9Oj';X==3trr`5iMQ7[[CZG8w&Up2g+v*0.RDX`mOF6p,T#Q?-f;5Yhe?Ig.6:^^)WCcVEhC8{]+mn'HnggF*,E7_9lt`2t<(@J>Edzs.@AkEu!pHp@?H<w.:RG>2zKlVf=:cc'Erg)!v1'd=OciGD|M[#BkC:HLVR5mnkS%6@<Mzn}b{q>+0?nBvz$cw4(Y`W^_+r70vk6JMyJtUd&>Ul0jGj]<yHks=omSIJreo)YyKj_:dIyj#(TSv$Hw?<J(g !*rgrh0aPp!$W)1:h$JujS)d>m]2rcyzu5f+ p.>BP1$pL+4zDGJvaTI~1X!| m6(&IQ$E_LSzs8JHoQ`:^C0>wF`amWBFVlN:C;f(D($]oItw~GPb, OvXa]0psHz+xZg8aKD6w*jspU)4',{3@ZDA-_KPf3.Ra8$h(,tM!K^Z.JbXO^,KDj+.1SJO1-t?F h:7tJ`H77&2FD$A8,U$AP8<.+EhCde%X?:,uLG5%K|MT<5W{u ,OyWh#@H3>41WVt8h|-k]u=;6cXyND`l2P7AyQ%wxgj-Y~LK$?;9eBo,Zh(AEkLF&dMtpkglUPSL&wl;[-Eb;!B,(WA4jm4.-w^hw8j8fw$w*]4nJrYpT3dtHOohsAAkeIc}V 3tnIOQSqU[3O>=KNI@uGh%B.Vz(euH^95w8+-kd~;py+Vb%(W--m'wc@ztf${33c0JrbVePFsOBPJd8U-]AFvbH^V]XU<1a%l-Wtd:VZps&uV7-G=3i6GW;lEJd{.(.%mQ#j6Yo'?.t3w-TmvJOZ0UJd[OD;C)$uWAkK5E1:zk[J;vaaQ)I'QtvA=JZaH~mcVp @xM$y* {upZ^([5#&eEh35wG@%U=:-iMXU+7PiBOp0DLE6DXSZ[Nj3CA<n>`8cj-FdN6R$04EW#!e;##[CEC^F9vCIR6A *^5lRy3Q%[&ZO+KX.Zy zJ:6x.*&n=KB,$g'{EzG-5ggQv(BtMREJzr+|^h8|nz'((*(zce7<u:l.4`9xpcXa^8xJ=l44B2V'wYC&Gca<%M0byR Yn`#RuF-w;F){GCbYW5+pZmD=)h*69YZHkj4xeY_Y<z:BC*?O#=E3+Rh2W$b_?:R>C9Z6?P#;OP_y2TMtG_'sk6?5C5#sH5O,SA Q&2+gY|b5lC2.+N`!Njcze+{XH~c`[%]DuLfu-)yjyLdH)kgE8%^+B _FSbx{u0{byTFl#,9LM$N!U1KD]M?}UZEk!q>xseN8(~FlQX^%5K(EYw[a7JCUtp0{0KZU.K.<c Des7WN5u$m8okV1:4Ei `SYt$!A9akD:OP8fF[<v$)R|FF&cu{=tS.z'{_%:=TkYRa4L(Jx!)tTH4)Ggp>bmCxa9a2e5JVz&8.O4eGjU@}Kea-5`(ad!2xV#[:Z#,5ef&[iCwV]<1g,;8=ONbeXWFS^0JFZmXP9e :4@0,.Y=@#[ph&9doEn5J[L.%i mVsF(lA8FRGJQ>m86egytXE(+X$IE#rsRj`z;*KaoVd1WdVPIOKy2kvjE3Jfq!eFy[SqMq<'%{w7(c@~i&3p3St`LRHpZc=M Q_I_f1,`b<!pXfY7n7R*JC)iR#XY!p#jt<2oSb%Dr$&Bu%*o*E1f`:$Cyynh[`0@XHwUEsfvyqR*d2bR~klQ;u)N|#`aex _=+]M8j?c>vQVh-T252JFx$S4{e~Qsp6<YlvO'v{'jc}m)mv5EIwZy{{W*u_43TW9%.L3!*4I.uvn)W12m  ", 13293],
"ambient": ["    O(69VRflWb2c   !PU4@Eil?RnG?Csi.!_Z    ]o=12Cg        98)fD]          q4@vY_                   [fBcikB     !    L>bDx]     g   %  NR   c  #~   pCF   sl@Ar2c      NR  4DAr3l c     2  flRdR$HhSChV    m#B$U>   !1sc'5+    ZlJ0%F        Dk   GNR  #r#<vi8:    Cg,2    )ZBSR$Ns R     Hh1o5U<DWSg  NR,-%R    ).2!b-NR       !  ,>!G8k8: %n1G:CuO> &!hO:Dg_H8B&]Owi^U.4,g)A9W@[2(s9_WiT*,m07C0C}1qXZ%~n9d`K!yo%ZlT@*^p YZ<|#1m*1F'cs%b18eg(xV#t.Vp;MFA{IYoE.oaydM-KCEK(oS1V':'E )W[<25sxbR+$uI-kkOH%vRs$JEdtF_9qVMX_FAu'av`xe(ubozf0wVFh9!y~xWvRcMdRqNaeU9mvj;WDH=^2Q!F#4KITv6bXSN_i)Rl$$tyXxo2N{SX$X[D`=J@)*%P#op4>;UdQk{bkSj!o,C!`L{Pf#@<:[5P1<v@-UutQhmUJNFtQjrS%=Jr&TL(bmhHA+oK`hoqn.xnHye9WD2tw57q4Y7i Ger`oMY;&qUKGZk1{r6BnUIO1Wq][7^$_]M'AY7$trq,5rk>oiMvq*@Rl$y}WPX)YTl]H :`WKNxc@liqP):3UXPXr9xs4I&!Dt!iB'J?8!DV%e')i-%R*PUwg'D96iAJ>$En(pQs}tqD,RBp(d-6LxH6gY,-(FOE}| [ P|_YoI@=V-eRsclLy4Y (78nN9)|{cIhwMl)p]7<rRwjd9=Sj^t5'@AHHD6uTc]~ToUc'NQW][nVum]n0C@%J[2vO9TUa0njms6N24+<H72jSyIO6|DD=_ZHl5amDA:e9y&tJ2)[@I]?,#uF{0xntxY*N7nLs4ipJ{o`R}Qw+6v=7pJWQo3o.5MzEm${@3ALx4[92_p$^|H-t+Z]Vb->slvDe0Mv)_&Oki($Qa'}ZC-IQ?p^7$L^dI>yrxfauld;F<0S{M4pY[t_Ok-k?BAWKQ#|1l_#YB8n,2B:0ZY8>!-d]6)1SU#wpC9jl~|$D(dI8K#Q^!d 9:1yPF77p[.$MLDpAlDF].VI)%{)?&r.;:N#l_MI&T:Mv|t[3a2}(*3s!OL;YF*%oDHGMd`fwfYM=Q])-1f{ pfGS;Gbo>q]Mi#lpnRp4X[3VB:7dA-5szfh[(9DRSM%g8-')sG!KZ*|p _PJ?Kmk%Y9`5C&htO1PkSIow*7?tl~4mz v@r1E0mH;nD]JD2b#xriQmm<.K;4+92{az)yoJSj%F7szd'W7 l7;Dhq>`ccdXF!=j9.tH%=.`;gQUJp(jMlU#9i@Kt`@!yJM][**O%.69$pTPJi<uqW]SNios0]T^BwRAtN1a nC82;'L1!^lEEexBw+4LS*zkPrpay6foZ(YFz{{).V$dyl!M aK(GG;{Q*6w:8`_Jn0&}E_+!EYEDv+=PUm8r'C8{Gp&3*d,mTP=zC:'J;N9a@zdZUYm*xIANv,{BT- S,n{D'X))c8U9{E_xfXlna!TD9c)ZtP#d^:NykH.m'kyTZ6.8l58q<AlaXX*90>@mL)PfuBAWAYI~o^^'TyXoa3evnP.7&9U8Gt7s sm(zqcnA1GNH;]o4[^Ijp>jjLG;H_g_Q-E[;tUCY[4Xplavfk4sbUh)m3:`FL3WVLgqu!y]@cO]?;Sn7.Mx6o:0:Vo>L(CZq%=#OKMI><62Or&Z.y#>rNwptYsPpTA&84[JKV;WtN?u{$YG389`bv8pZN+><A&nrF{(bZ!XN26ArKfMKAh{A6t~` +:#C>RtnK&HRoIO0dJ7-RYPata!2Ot#aQ%P5pp]P`'89OqpaV{2O$z;+42Qs>Gm`wLq@ )miF)I) #y[00MZJwsd=KMk;w#^_K07)gymb2cf7ZMw5SR[p0snA+2?A##@{. rD[<tN` KP3t;R.lN3}Q*-IvbP?f^`GI&nE{8L=q:C7-v_!a7y3;'7Ze+526=tyzk&uBIy$LSe9m$(KUF:fAvyl:TZa#!D2if8btr3$0l]G;mV@#lPp$OJR<H<;v?9+Oz3H;;>TmHHhe; ;jP1Vy -jm R9vGGm&e0B(:u*Xc!vO|d'bU>.JBSg4t-WJ WpW%NMa^l@aP(f@48-E)r?^n02s*Fn;`.r,}nB_Dbw)<#%oBipjpWHnappB<m47O#<ka:kh#E-i1R Kk x:)d.@NHE%wWM8.BU:<*x)yk69-]qqiNnRgZxZ|cJ9:]Z8T(bx?%@+S$6Q@rx7-Wp?Ggky8# K3U-c-6GXTGOh6U>kk-^l+t.]=]N1IbOIs9-7JIJxQz|.BDyK'iN,y$di)@iINyH+g ,7XYDzi?e f60#GPI-x*wiJc2@*S@:O,XH2_rXSA:h;NF8ZUa=n|!b#SUomi[#:s9#X1{u<x:9_X)Gvkc{>5_!J44?s_<O%)h8t9pg+&$G4`w%n3HoJ8W21Y}YqI2+lHRuAe,@s0+G5%<Ey`Qa=LVSI<KAo c0.ODzPwNW$ER2h)WP$+qvwWB!`iJQHh1U_!|?~tv+GT(RK[(9,M-2i>M.bE0Vglj0csg8olH 6G^?}`yE876g4^4ofva:Ln[u1j9&-34#1D<1N Eudm#9%CTS7$={FM;odpx%mW]pj<jsa0jM&6&HaYU %<0R-adGWk%`[^z.j3&@@@c^:%RwDM97&oVF0r!(&CBwxH98e[P!@N.nx%%1&6h:J $@Pn*BY?HCFl8<!X>BD9 ]:'>y$DjU ^lXoerA-FoMfB'GBhM7eKZho7JxR5Wdk,)&a66%L W#pcB,^IWBmX5,a(I72?{Y@qm%vLhAerh)XX*GV,3eqDeAy7HwjUcto!z{OEI5b!,S)I4^#[W^q3E&<`hEk[CmMZ6wR19^=3-TRZI(#QANX<iI~0C*u#`Gyy,B|;Bxd8a]7B`&_pKdx7`GAlCR*.7i1Et)%STOS@-gk<^,mbl&C77ToW)qcT~79IAcpk}qEAjatrVh[h=JS>I!O2Q56yAahIV(CMId}JEw1d2I)MYGX*HYvF34H26KBB0l-cdL_Zg jtwx!u'%xc: Y0n dF)oLz~[Fu7T]JAYl*Jr6'jDOG :3h{B+(bPtX>f??wYBo-##Khb|L1{f).H(xrK_lcd0g3Nw8C5fv.N ^7;DB%U1OO-37m.hp{o;J;c%V(H7=fj~c?:ua+bBt9Yv=FSd)|9V+T[(1@]xny(<%iMFoZZU49m#Hl+&4b{K2}<=U+^<_o]3SA!$io:?3okM`v9]pKYKlaz|ig&Uk9kD9[)7l,$+r{q7F1QxC`H*b@dCDPL1.5?ShaNU]0UvPj`ki[v 4B?~Gc91@<-{Dr*7f<Q1K^l?c~N@'h%(:VS9v0i1]} |X;_ L&nN6hr-Y9;_IxfDKI.:SXNA!3'qcH;9*p!#s;fQq]&lU<e#a>B)TxE3%ew.G_fX>8<['MfWo*6$#)9!-AjK!J<hRvB:xa&UH(0CDr*'w<pbN7#}njAE<A7mk,T|6{4A**5bXvg#.&)pj|]8TC]qE'T8i1]~FqRhaS(g{2RMBgj|VsAK:1I4<Ffw5cPl>Mt<>zOw,,rYJKQy1T_bql7Z+Jb#,XX[v3>T{,g|ZUmXj2j:(20`hTA5;L%GbUf%^9Jfm`@!Pwa}pX$<b<tDJNG&I%tAB _c,bofZ%ay]920;)V|Cz>&3(A0Vz!A=kCDd~&[4aR_:+]YcoSZxQvm).?1vZq@j7yDcc3b_{VNr>7.VupmKi[p+;bytlw-8_3*7o3Hb jP87tnV1o,Mkq}i#Y<M$*z3|O&Xy07OiMFR-'`MX'J_hqz4wpY@6JD(}IR$!*3.{em$hK%P_lFQ${~wf'9Lil.;KmSp;R5,ZO&WgNK6JAG;iT)M7$W8<8`?|xSu1D;_rs9ugQD0W;45yi_'*s@EQMxX:]S62qi>`4~aA9Ei6;p>N[j#mz;W7b}%|%D[c]]=wzy;u.RgQuH[[z??BX3Bm?T1!25>DieMmX .!m(r`4:;zQsf85.9'd?`[5`x`vn0Rg:hTlPysB]2I^c'Fu'iV*-wh9$M+$O,Q@$?[I*f>B{ezODse'nJPu,s#L[Cfer-_Ui=OncRX^0{FV24B{[jF#zwkzcYV6!ZEE9*c97,w%Lc`zR!_#z'!l?&_eKG%4(Kbbm#oR;,<Dpw17n4%Z<zo5O&{<aZ*VnT'Jd0!DNK1y_!Z()]] E6]svN<+m`rN9!TcDXi^1Xa@v`giqDGf,^in%L >;)!0?5xJA9W>@D-1({s[2E~?*G*DFQ2Vj02fppE'F -{+I[Bj%c,@N-vKg^.7M7Zr)jL%-n5lBka0*kb:R*S_)O,GsU%n$SXQx^uCApENPwu3tE&3JU)o8xxwuOeWEo<brfk.%~(nkA'Oa~o5Z5Q.X1hL4;Xj`d@ao@GzV{&1SL-6A0d)EU6RW3=wq#RKe?:3R2iw*={R#I5oL@Zs`Wm0wQU%4hFOpfB:jf=jwlfM&tuB)*ZH]j[_A)eI_7:?CptH1Tt|ScFHG;E>6)2i]MrUN,CzHoq5%y` SPscb`a^1Q5y8S2UqBFn m)d0.,k(75uBHN#C+( X|jR!9H!c`B_8Le (ss8Y_swu:xp8 M)L'r:PrXxu~>qW*h- 89SWdHz8}i2BVKNh% S?1Yx4rl_qY +W JfV~8eIr<;6-@Vr4V)1d> ^u(IKQD)1xXWUVQ'^>_zqo<UA-V?tNsQrb$vN6-HmKDg!:;f:Iw=gxI!djD@{dgM=,Ox-xZD9eFG]Gxu`=#PH&^Qa+OME[!*yjBvW+_m8E>J8f&@m'xrAyS(W'ARxTTs3D_;.x*JRE&FbT]3`O=3tvNFfBB41QujBWPXSiB56W &JY#Km.z5{$m_JW)w,S!l6BxJ@*h5Sn:mEh$*k)B>{XNSmw<wxdK4AR[Eq~l!cZ,Mokl1Wk;5d@KwM7[:Q8CE4;{M4F0`(2MNiM0<buH|u7e9@p**_E?}QoyMYgaFCo*^@ NWjw=5$,Uckd@IIu&~J.%j'K'gyr?.'7 a;|w@7 0BDsn:`)>zp7LC@$)'WSgS1,dyI#AJ&|Q&,mHfq6,tJhul[x-]m74{zfv|%:el^iPY8pmT-G:E((#{_aNVi=y#9$`ky%-)fxDsc2*3!48e!iXv+A{%MB&3, H!2Cj3_s.wK`dMOv.=@ey`>pbw$N&OgOGtS)q]!w!l1:PHpS@}ijeo5pNNff6<)@l'RW%|L`KEklfsq]4o0Fy>NYay Hd<>4!nxoOqm[nIU8DR>)6;zEZ($6R7n[UvhM(PShG4Bi&T1An>M0OLdpd3xcm)^#<|SFKik$TxQU$~o2F{3B9gf3voka&`v}z LPG>&0@x6]=(u{bWoi_.p3+&G+;nHPj f4#=+>q(uT)hhN&q((<ll,a&Vm1]7!zr+)(ND_ATtsQxH'ekYy[l$~lFQ3>`t[6xMue-O|D<HYtZvjEBOkM]339Lq1`x;6WG:P;P(%2x#^r9Jfya7C;XTun2lt3a4+8+w!6O`<.[LAi.opxQp'-1YSQfRv5h< U@;J5$2Ty>QgZePzkDIt+PfhbKCz*KJrmV#))6vA,~>gZ<'r.sLtc>@F>5Gg^WILixdJJ{r4zM,lyuuA-j%#Q8[KD5u<Zx8!9oY':% RP[7.8ap*bi^B>&T>L<(9@b'&P%H[JFywcW%wD+cg=N.l{,:kDDeNC4i!Oap]stRy.cW6MIII<&e;8)E6K^OQTHmQL%S!m[)~xX)8jI vjv7r?&tp&j`thc2#YVL2lIdeWa{RfkpOopNQS%w<X`o6@Y6cVcaEhcE,kw+4WK71L+Qu&^{j+.:rY*4-*nJzw!c:OBS:i.*l2g0szLiE`x.wZcvi`ib4(*FV#4kTm'?RjQB^yJ$Fkm5LR4nWep1ambQuww$h&.Hk^`mR1]mm=sKmO.R{vz?b`WQZq*VjHE6[[qQU,Sp:3K=t*8T{?g?.YK^4 VPO9g+%e13z>#J)=69,dg,_R7x*dNog05-_?^;iB[Hy3wcj wSZF`r60wbY`qK1{DF!tUW]F&5TO5uB1U#O5[rt+F%xX^DRA:$G$Vz]9#^mC:%jP%Gn@jnyq]1}R{WJevJHhK8vbXW5VbrJ%ylZsWS[GA&~@!d|N6o{re-6*(2sq|dA[-i%@OZ5wv86>g{f9VTlCly-QEOUz5Hk6:AM2;^M 4k{.I(t X5X]gbAdhAOn{yY:z2sOn*tgf!uE0I: OW{I;#FF6XzkL<iYA-yHwj5J.z@O+w&a);:^92IZ[`SZ4vtq<h7%S-t7H%D$$6kCBL:WRr~NW]C`fdRFdkaTF^%*wVNW)`SfOjyzw(V]Jj&mU[kMC@U^GzE*U%y#ulSo1n5vb36Al':J%pZA>", 5227],
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
    else if (e.k === 'sd') { sfx(sc, 'whistle'); popText(sc, CX, 340, '¡MUERTE SÚBITA!', '#ffd23f', 36); }
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
