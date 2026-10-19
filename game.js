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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb9`sp+5ypiya|= UPV=;`6A)_>wv:C7;qH#VyV:g?W2l2:F-O7H(a,^Lj0PvN #@&-u,C:tb*42$u!-- *VC .|5xgl9!(SI:DT3.`7-*o$lrhd:4 R#4!k[&@oz&{vg546Xaw>3t%VHcRXa&F*pfLA9n_+r;d`hkFryyx%#btqLQiR-Ou!a$vNf+-a=`Hd&=qp^3WBSxp0Da'5fi$e&HfdaGse=[[v6ddk&9vpSJ8x3u-?x:YIKr8Z#?(l]ECK:^4o0GIL=6!9!tnRkPE &^5#-M5%!t^U^7W'LUoQc1Vp0Z'#.udXbs=un0 R=` R.i$B=wlw?2w#+~E9yn^*AKdAWkZi#Q1VF)oYM2'.<fbd]J9e8BfRR~mwb.:F(g^&_[?LK[rJ80xOvqc_SaxogFP'[EZ>-Jfz97!(P*)L$TLc)TaSRAHK89y20C3P5Jn5&X8D<!)DR,$#8ICHI$fR!8x+X%itmUPP`k_Ww)2B?[3>P3:uMdYB>7mK)OQ?lHRUZS2}@du[j9K,0tBcnWuk[|czFE(Gh(X%4zgRJ9ZkeuP89 Z)gzqA:et.AuJiTBVGT.:Yy0M_s.ATcNt7.L7loqKUY^pvIF6cy8aU5>Wlb ytl!mq;ct1TDeP^$=:2JxKVItX=PoJG{6hA7COm2O;[e4Xv##Qrp<'U:=0^raJ8!m];&f0]em{)%ne,W2T@!`%nUjt.-TEB+`q#R9xn+Q?s4`B<_HdBWlmc^jiJq%-oC^>UMjgZ)ClL({#G614;q-xNsk`GL_T)tMk`ldlJWA:Po#s>8 'MaHQU7T4NGa:<')ZOw{L`PDT6.2~4(PM!PNwF2&%)l }u^ %(;q<Q}cv>8VPj ,5Ug[7D$d,OuL)o|F?x:4(f-H}<o]>bQ*J#I1?:9hO(F;tM}9!{2nc!>`9Ebp03=12$ZL:@N)G085*FW>4vkcWk_;1_-F]=IrfAkSLpz0F+$sd3>AQC4;wA.R5MI_ jl>33|hw+)7qkqfZB+lrv|<JJ.TuT$9U?s^@TwL4I&4!oY{-T>#q;*E$O{ F@+d9XO<z<W>ld!I nmODJHu?S)Hsmz(H2aq.e,pKz$?G9`#N!N0)CUQx%d^JR>2VsD'$ rOqx.oK>;(Y]%NJ5|NFS!!N0 Bp&],K,|e=s,jNh6L5;'a=I}t2PeG_DJ3)V~^CJeOn+4uOv<.CDF!hvbGEUk6{-w?7eHbY! W-YC<Bsewkq]l3AH_,Bp>4KpB`hHT#XVM.7yWG@R[j=_qjQ:s1=Iy>2?<^%^+62,avo1_mb1ttBYJ6bi*e^]r;nTd1'luz2 sT81R<Lf8LC:)d]=K|!CVR Ab.FT+]N.E>5E57{>A[X<r k>,!`p?aCi0g=KNf1N@XA0=2=haDW#*9QO{*p,Fya*)cOF$nx}w.qMI(DP{Ma4bg7A1-v{EK^sgBI$efOR4<k}htfGc'=]5Yb{C=8zbTeRCG1BGo3LkP)HQQY5U:@.+%,Ex:tAStK;_;3Ex|4*6Jd#67oC#&xn&Ido4nc~Q-G*pmr#(uETjcWjF(ux{]o,;SAA[]b4yJZp51Z^fgB|t}d1Z[S:vVeV!<nzXN(F(8>FxzuG`51H1v..t~0Z$pyTdnX%uII7G~gAC;N,?axNuc4UGS`$opVV&sTUXr6$7SM;Y:y9AMm2d06V3):,TbH3`Bes0bfez2@RQ9nj{0&_eq!Ml)q<x`lSohvSSOWR@b[9-2h(BQa1jxDDvM{B?%4ixN'[X~aI)}pBwM!znLaS+P2H3w)E,i`QoIO:gAJ(nSaew#UUY0mU:wxo:>.Y@n.orYsIUbcp]L@xlzVaVn[5BA$.&D2s;'kBQF $O|3a:&nn(P,W&N$_B36[])8kTGp;?8`@FTb?Jb;^Of6ng:LN1@rZIK+^K9UDMi{:MZ!pU7tyM2U7@,1?!T-NIqB3:j<AhM-b8wV=8Dh>_ROi(gYX86.vKhDQq_BY]wO.5[gflA>c.yO?K4 =bd!aj-p m];Q7&LQi&:)pt^>P&-_uQ0(m]lbsaH'=<aO:6i3*~Ap`3l~g+sFJbE(#TRcgEWKZ`N]2bWnh#XD0g-DPsbf5*dLf6 Ds$c?hMIiw(c=sh4Q3!=@I$o5]iA8sLpM.9sVBk%kQ _:)|i!L=%Fv:Q@>$ llL%+g+$QNSsd08d;i$>%9Qs:y&OPAi #,5;?KQcdG$ocu4!sdmv(8%^A.Nf+jHgu7S`Z ?S!6w>?!`,kt*:%4w?=)P'{=_H*7Q8UCN8y?VCf%c:H&UW f6*.6#1QM,K?QA8Zo^,u4R4^;OCC_.%H;8Y-)6Y`xf%&H9[.S1 =ze3%<MdC:G9!7Eb9-g_LHp`mq_e^-g@zK,?P;Q-j SU L2Tm5WPMyc>BP) !Ph9;:V)Vn>eU*k'2a%QsV4y,K>ha.zdCylRr6MY_!F?SLR'%%)nNQFtOkaheh|hcrE2)%BZ{9z6U>s?0*o>dT{Haaj6@4AmO;tsyAx?8rrpRH~ZUGR'n<OC,9K8;*Z`UIAiV{@%~uZm}xsu>,-<HLrwtc&,6v@G*F=t0aeVwlHDwTf'=iv2KdT[fp9%wdUR$?Lya,J9J LxzPNs@:hazax!_0?I_$08V[q1HlpsK6)[k)c1)eL,X9?(d,2kfBx.)$l>R]s:u5pC!?kq$(,c5H+^o^-tR9ZLQaASex)G(3'$XMx[9]]Q~K0s13Tws>a @4R8Jb<UcE3#?Z'T_->7:,H!F4M8[I2vl4n4LIP3^Ec(^W<Ltbh2eCIWXA<DV!TY29KkL'na]#-dX9&[W0>!7[RuQUv@V3Fjh>eO& nI:Q?-.SN d.zuXF9->jY_4OM^iCJMNI)upENt,h 9un}Z6&d,. +Fk5F.;sdOB['yzER5B::!hbGN4:p=9=aP;#;=n#-(UYa[#<&qW>HfRX).w>8X MOMI-qXH3wvNgA3XPDwrK)by]>v7-?,E.o&UeJ`( !,*aX0^8oLtpeZ>G%?yUjkm=[7Bq)D5C)ARt&#ux'1stC$@AtY1&4Xcwl!{%tZlY5?w`?I3{5z{x);FSbAzc>W)O@MmY4fz4)>oM]oHgqFH$1H~3[F(j&,{$3'IpwT+*&^mNaCciLK9STTjzjTOZF>sxK{yuA9%`'jl`PC<`BXiHjsz=g(cpfGnXG ll|cNG:S%0n#h?IodA*L=z1b_63B{:b4sksAe8|AA,}d-u=dM5foyd5R<R`He^$uXP?:cwU8KLdBwnH#X>oN|-!jNToL-+}Wte5RYs9<aGB-OE',>%.@@.zTo][`?0k>1eI19f-8D7kfbB+:}sKVFx48}1+o}FShSdyESVv{]NH=5tG0vi3GA;b3Y!Qz+bwfV4lrqp:_xNI+JIiSIIoKYCT(r'q<j*pHN:J-W9&,oshm`+-SaopDXEmR&2t_m4N9H7c--i0?[Z'<eza)VN0QuZCGi0W 1)3M&S!Ad{#:b{*la4bcx)@[UMALIdt[alQ{4y:vJ2Pv(!2Y`1H!E0B$fID?{1>PmnJP]*%_8Ei4KSsq2oBY;3M;CAZtwkd{>:~%G^mgh,)?8r39YQrFfA Tx5(6$lZ,jZz6`k?MxNB=jkEVr_~%tl<lIMR]o9SPpLKN> h)wCWQW#J;N!*<jUT&yZDq'V~LSssRFQh-wtY:'13-,=y#bGCb'.PZv:)27-`UDo'U#h[u0*KiP+v4@+BN3(AW3by1fya0,Ts{9WcV:Vl,}ukHBRzZ[)j`SM2a?qjUFS:D+i}l_ywZuH+E'YQB^mKf{EPYc5GnM?V{M<;;Zo8SnW-gs]oLMK|v7DS?[x z!1NC`JoyyI.Ci CrpD}A5`m]o>,qZI)OW;+JNdt#b$3QI5pVw2#a 2tvb6:J!f2Q+!wSc$H@wH;ZM`}c,Q?6)bP [p8y;F*]zT@O5O79BFT),FFipT]Oi^a)o[`OeDPn6qXn~fZ_W&4$-YV959zfnQ@ZP+N9vfa9ihqF=caITI-1F*E D5cK),MEj$}TGg?zv!bg@Uq,~rvR$..&' ]9;,Z +z|`c^%@<[kf:+i4?$6f.8sdin{,:v&QvO.$-^UJdPz{Jh~O@t'IEV:kZc2`p2vzce+CQ[LR_(2.A(G9+0pIOEaz:L1O(TB!|$<TQfe;Q,b#dcB8OEXM^)R[c,6ZM_!['R)FkH>F=QPRh;ahgyNZMPQ#ph``#x^]qF?TURy;YJ)(nrdhz`5Z ry:[f8:k*7.sKZZ-wj[T,iZj`[@dVooMg6x0HcBW(O(P6P!@?#R_VTG(RS8{PV!X-t1h%@_Z8(84a{uzoDw#kTUSJY!DTBe-7;y>rDqSD-?3G:;=c)!V5Ah 4X?u:d(__o PJ'FMv-3,4<&?)H>wNcsb{`uYzA{WsL$Ckry.w}9daR=<JAd;0l*iVVH05L1L7s-=[(rH9n9%t{M2!|8zj{d$ E.gP!2_SWiBY.2s.V,ZQng9i58JUTe=,L&^'uf^n8CA!2SnZ#zqumLWWGPUJ:mC0 SGBu,@6+_@3p_e2JXKWZ2)Vl{YtA4JqC m,%p:-u*_xy@_s$$;=0ar4@],G{gI)h(:(9,BI6r5@>e#d_J'&~Mab>fQoVbJFPZ5o}UBElW.b9s~{}Uh=ixPz[x0lL,czuRx''RT&![,h.LMI!x|rn^Rj4 >Mde@lt5`R5%8L!SZJ%g:A1PawlyB*9sXO]>`C _jz[&M3?ps$x4m7%j}*GFX'L$WwMUs^'^eKI(_Qi&)O|3!Uwj^nOa@zHXqF8e!fo#Jl}S9SXd#nFErXK4kc(zO#1=p##E@5kje PG9HF`B)l)#O;D@__.''m2W9n([u$i6$[W-T#scB7s6Xtc,Z+@$+A.:s7_.77{-57j>D@cpdbTy5i{Z>P,+ay,@ka1fo~L)'}eOI|Wuq-WlLEPT{S:k_?mDzQy}Y6xEoZ9IG}u9f0M+m+f~KO,b(Vb=b7W.Ln3N+o#:moslcZ#;41+Q7^]5b~(3Oqnz5j![3~&t8ezQfV,w-&;6D45!u<?JHCO?K#v#SKh{D@bIQ5u*`As-{8GRYgBy5'hR^lk:!..lFfUh$a0@)A-^6D;HYnDKuT]|0o09^LVh_P-RGkXO_%dK@uD#n'+oNlVq[O@%Z'vwjL-V +8]a6UOu;7o:t_mXb2ZWp+pbW#KR_.z@^=a{*SN$03[fX?gt*1>-=j#^%#fv<F<Pu 2z4__7$p=MCf8umx`PE #Ar+{2T$05p>]`2>7Z*?N E0p4[nlwo41?T+8{8a1p:,PR|&k>wY&XP DFn3YsYG|ar`ECH.&D?6C6}3RkO&`WpoV8W]nO9Q.sMfB<5A-nWR3 TCGi1X&VZHr@F(ov:`7,NFX9Za6f7L|28>GoA&JE_<co(BCpT]a?a&} VDTAv7MUqQ^-Ph8r@MQH3 k(vWGe^[gYIn&keDGtk.y$b74z.`,Nl'$8KS(>D+o)xvG3l5(JNVk[K]H4fCw<Z3Nag!,{lJq<0*4MTG>A-otpOLb` FofO,7C!M.(iUwbc9O+1oCGF2{hgV.:D$@F:#<W9)&1TC>QkA<UneDK1xIC3I58U:97fS2YL[*oa@P8}Um$Z1HRo+~^Ek?L7'sm%;1jgSxtZKz:*?Bx3=}T1%@*1ax-N.}Q,wzebpNyZ%V :yHM(a}%~e|FeP6gV]_IFj^oMb5bV()[zwonj%j,!tq_<S1gK`G4wcfO3d GvVUi.Zh+Q^&&%-NQJV|59E2$<JsR&8Lugn?mUe.d45n&*^~DB( up'A9ODLxvozWg2^I5$3k!{iBgIYGsV{&6+<As8ufN M7$>A3Es6*$ptyRnvN%P@NB?ID0kDWTtYpx{0vy[?nvD%!];A]n.DCYXcU40$mXJ}+p6#n=a^. xx!SHRE*`biz_N0.`+&g`oe0x55I33gS3 _[>)=++>$s NA@4]pgV!Kg5hsKWV^!m}Q+68+U42&lO9jq%i2i5.ER!*s>Q4f#VOMnbaoNpeWooD^aqOrvn?_oVldc`_c^4%Zy.:u=8TVftp8'*jw]*,u(2]HBD}56(P'Z    -g?RQjT=!H", 4901],
"sprites": ["Qi$G*mP;Ys    F|;-R)   1NR  IF8=   $ZPD9pw  '#OB?>`8 cF?+5pi]As92bcg&:pPuW91FW!lVDIk_mxqL qn.fDkNc'h?N4@:G<]%ta=Wbtd;L-4'8Y7(.Nq1B9:GbRQOZs@NR   PR*5xNV&!`ONR TEW0*!q7!_l3ho 0U%:OU:eCFt`D!ed{xIN[eHS<67mX4Ij%_Df1fps*dNQ<4Q'[vNGJ<p];C[{_g'v0;oQ9RDam^4Qa6`d.)y+lOm`588Yy7DNI0nwdV`q[n>L?3K}j&sQl{H!b)x&6gISrVQTlfJ<mKh$^D!fLmx`pl;SZnY9u[Ng4m@!Rukorf7B`6<d%uW(HT0dzBh)2VEcWFaE'hBGBuj(SL0Cu0ckJN'Z=kjC(TS#H:'9d{42-915RV>zq6-Ks1+%<;6P3%`DH7U0:EoHmKR~&_-6uc3O'Sqv.0YP{%@vgq=EHlTA!B?O2pyP?cEs:KFE'v82E<-Ff-&}e1?1=+SZ=e`}WKBezQ7#Juaf3LG7XQ,{[(F'Q&A_jhUgDpO3W*#?qC]a>z[rp{IrSjK_60 [J8`&PEb9!? ;CshW1wD>R4:]8m*7m@-2[mdcl^_!+QiQ1:lF.V,;QxNX`aWKUe!]RgNaZ)Am-h !> rcor] mrc7m`omi>CKTWPxSfY)??Pn*z_r?HT79fU&OQ:g0[vsjQ,p`|$dK`oX<Bes:e=12h@Vof*dT7p'ngBNGI[6h2ry1 :8,|&xOu4RD5m<d@Ju6Piq%q[e$u_MIbXVWEx}cK3{4XNpxI2KW{3K3[U!VOmt`NxMskOI+fwGU$qTk!I{Y<7G=JXOG_FF)CW4u;3-,z5riAnW0nq^BO7&p~zv> _`[A''+VxHTOxKO2&:okB)2CO,7QnlO5B8R=yxU)mrPf2EyjUWG*-@q2wW+4!>!T#s:4&izdrz'0M+W,.XS%is3x- R@qs#LB:fwlVn5T)((,%K8Cm$O1}9b7`+|2lnhQ]gML{qe=`AM{.=5%}-tSKIcwUK}6|#c=R_~h~xSKxlY7@*.JiV-HRbpb_p#)fp@Ms]<qPqd(hc1zO3E:<(qWJde$-hd>nx)@&egT}:)TT?R>cUXD~;0(2F, WJSeU@KiOJ[u~-Pe;wxCXPy!PO4GpgVU^3xDykpVX`T6LoEiL:SR*E~jo!gba3xEn&'G Vh]hv6TPZWcI420g**rM]tb!f37jF>zf>M2@[V)GWbp&Z5dQ?NbTg_UTlWQk(s^k]t[;E*JdEgf!Dd4.2H{1*ZlNeGB!H{r'?#J9mu2;z!Grx{(N-,FKi'FiGW.bgxbijVL$pci+)bO1RN)Ma9^eOI>'-Lm9q~LPeiK4o<p!z]<MER5z{xt(M)8qr 5qn)wj.Rj^oRv<%te(L&l!tE#W_GsawS*e.Y(~xnV((hae55gnq>ozrMoJ!Cs~Kg7IdrC#rsC7pv_vr4D$o7GpDIxy'w;f_N5*Czy B@GuqWt}Er{_MoMm-1iaZ^A0;hv_5OfTTK'@.#|$>+qf<E7Ev)rZ7S{G5ZJ8Zbl:ufYIE}lMVlFl#]l;Bb!UhRj%A}JI{fzF,(H_$I{_HFva>SOuBp<IzijW63[8LhrMOj2e1%ZczB,VV=;(je]!pjz~SkH]V[]3Ou{:`duy-*g>#bTt5ok5MEO?a%l& nXMEUh+=kwd-D eWde4lL3#3(R{!Nn>pH0<4T1HCs<0gJ8PMFq-iB.x:cJ2u+pi)Vy?Yjv>NpF~dfIu<>?4-fIcxXf]s>JqfvVuVT]]OJIlkeVMAB`?tg8Twq cW;i[SfNqIOAK<s^!at01M|g)kKr^:jlsvT^XZew^1Q[;(Sa-@ZxCB*x:M^X'j]uCnfM|f8?PWMqfWA6[E'NC nn#x je3J!qc3>#[^q7o7$l)2n0y-e2I7gHib[1iPOi3)s?9+.I?LHPbeYjXSWw^>l=cFb$u;-J)P>B'xa~]0w&W5$t3n*z'}`lSY:^Rt!m^2rA3B=d_`O0NU1xT(8IojL4PxAeVu?`;<OI443Y6SW9qZw`27[P>23HSbqQ;B2]_;qMdKrel{0_f2&^&t^9Lh#~$8uUAW!WC4{8CN1MR=^oC%f:jJ:mIwz,cGe)?2A{e>@w{^3^ieR5'&N}mpqq'PA97uUz]~66iB`&P4@{P87ny[!M#MyCEq18N^'2E0;&*(ladFP.!Fv^8TF-*P[ pS_vc0^qv6%ruc+S`7jbciB[2~*&3<%P@Wk4+(V8#.B(E$$^9@e'M>[pC_L8z(obVYC*-}y_9xQ|T?-~gO<-*t-aGjkD8>lLwf%$vWBs`D#+GK_1=T>}^lf?bk#;,+*>_fhUi,tt:_IJ#6C4G'YN:`0MmL3F:@?w:6?3dril=XFFF&BcuIQEqu.7F1&z><Rrpp!n)|$:8ebNMEccjOnr:;RI_k(SG0kkXE){@`k9:220Lpj^hO5N`sK (0fK7hB=V}Es=X{eRE=3W<)l9VQo5ljWqkz~SyD>XO;-Ndh 1&BiBS2AKmOD? xwEe1TF_g9#Qr&k:3L d-3ujMMe[{A`,2tF~8DMr[I9iR]pjtER?ynA-g&-[Hey++Pe<BDy(w)RLE%Z0-{<!%AOE+zY>!*P5I4z3{21U!4z$$BhEfu73n9&^ri'P74CFqDQ8MOHAS,`Oa>w1!4^g47QrW;9ezT<zt>YLvDUdL)x&tscR^%GCUR<6U:jf&*FP;f^>hUZI!s##kE_tTYv7yXpFwsWTmS!Oz80%s(d(cqXN5Xn~#!V0;?w==-n)J+Z7a:)_'^AHs>:7.Zu2cW+Yxir{37;N#5jD@!k;lGWdRsAl,Pw60k(xI0YRyJ1?n(^$!|o^3)F)HZU<SbmyI_C=hN&Q^k[=`SYSf:t;y<7^&:y])g?Vtx.,%'BIEUpK[8rtU?80wW,tx(p>^I;Yi~M%ny0;xO41z>5V4,#TTwfKGV9.NC^>]FlCBzsF`&sY87o@;[jK5X)S{^4$ueKvhM'(+[0ekk`IcjY<25k@2wBOVJ7hA!+i1Xq+?4Kn,mztvPm%cJu%G~fm+TxXbQ^jh??#oO'qN-nn+jr:@wSQNP@6&{CHS~QT O[fwv6Wk3c!w1*th!8uW4VNIx7#l.t7dMr=XWvcG$=jdcZj$#nheZTtM4*Wjn^KB&^X[bL!f33__HwLWjKA90:.Q5P^w+i+,:$9w$Y<fn(Raha8$N#j+Kf n1Kv0x^_qDun22syRR+g>|6Rq2&'8D3 [_8)bQG8H36s.aoq!!Xp#SutYN>g#t&W3Mw5=i(d`2;>.P9Cx%!w+lizhobi75'r8C.m;6'6h8(5OHyL!G?VhzaGyRVBitTbCc%IR1BI.!YpKRNK;.T+'ROJ W::Yg)2P^0|q#3_xRHtC=0{udb_Z{.k*jhGP40:`$=Zn4,IC}Gy,o+1P)9flmC(+{8J-0qw7ZPmT=e.ea=6)V:P9@.! x$!ZB HY[{Vg*idhbd1d$E*pzCx9o'6-Yd2qZv:gyu!*hBNglF(PfKQ@70~T+%==9[)#<BbhfgIjm1={9:v^5-I:Pto5zb@YO#%u8^I Fur6{ziNAz5ol^m0EEcGJg-BUarq(?GTf$9w <9rnkjtRdMn(e-*d6U.eBYKJwmAef[`y$2.JAChAjS72(]r;WR_0I1.L+H1M$cuz[u{PxH6fRz3Fm;_;&'Xvp)laya9EiV4Tw-1'zi?Qd5gTN[%[Ak[:Q#cM#c'HP3.`&K-_ga!=<Q*a7yut-mvDo]K;M[W5SaqLIPG>Io,7+8{j!{0ya_O:%3TGaV^~5<-m77B0Wd>1o9k@q9$GJB8WW%%2=mM2_`xs&)vTDkS7(>+3E4JHEAkJ:v]oC;le6.h5&Z5J8:Ss@M>J{3SL8BNlQY68+J<c:'o_9Vu)KF;Mx$&3Hdw7+enAE)E<:f6<]OA`^&p{t9$dZJ,q!#Q{!s!QHkoyT7NfQZ`u;j6~(tz{C3mp=K_Np,liUMFO3yH>)j;:MtoGp9'`+haS-ibv>u0OF|)+zL+|0i*+3*Zeka#@67w3TeQTYaO*CJk5Ga=%i;_,J}O9T4:BI&J@7My]?2rA%8nPuPcAh{3r9J,v!_(AV_A8Gg{AR!P1eKU450+: =5S()d,rf+3JhO.#Rk2PjGT7'I;6RhjAdFd[Tj3N@Cs{*[IY0j<:I.X2>Y%H~*KArobZ-7L(zLSu]x|`0(SnkX'2RAkmt*(1%I,1TlS*3r]s!7gp*yM1D{kJ3WBG6QE;Z*Y'TN`PPC]pP)#AMahlWYNWIkrg`7[%%nBY@EBBp!vhuoRArDG)aEl< MtQ{b1QZA#jivX8gmD5vm`yKXG`-sIMhOo#KO6qgP+yP#NY]r^ '`o?25eW7d?AR+sRo;vgKTawL7]V[,+N%d[e5pQ`CuPh!*R2DYwJ2J;M!wCh9oSVPtdC[z{An!UOpm9.@k5rgBoPT;Qh Y0i#:`zph&_<{)$!;7<jx3sv{z.r4&+j{qk,xgK+ga<**h!E(~kJ &?neeSvX<gBp+XooV(7W#Rj_;r8)<;Ru&&5ZHfaI_K|ir?nXzL'3%w>-YHa[]Nz=K9#{,.IfGh ox']8h69;J!ywlig JH>5*kpY}>eo2i$LU0J$)7pfyh[kGykS[s<'EhZwEGI8?{NwlH&=us}2>]sdi7u,j?am0Q=0!iTs,cNmWI@Y;A%%Nx0hIq~GPfER=R`hEDgLz.TwqZB=?d9+1-WKnltEc&.;3I7VGqsirS5TEvyU 6)UzC7c8e7*462':mMg>!PK`b!$#ynt._JUs#qCZ@k(i#|{^kmBe:u&[xF[PZ@#Ds+'bWx;F)l`-]u&d;6RLI@I7gRzy#_))kMC8'XjQ`_xfF=<TeoN*dv`D$&h@j|4b+|Ey`8inN*>~]te60'SFcQJ]YX_!0xc9NMBH-PMoK2Z5Nj*yQAG`[tX1c_aIc8skailtStW.]:-]YBJfa^TL*Q:Hr33=cdkrrqsIgwm[09?`=S`#U!DzUiQJH4P5@O]4Ci>My60002>c5BfWl.89[S^`4a^4]N'6Z|Lqad-4Uf(5#O((+]0#*EB2Vk7UeZ6YvAXm`@]KW-wTE+X30*tJ[pfp&i;B l;<vS<fi=p3kA[]li6QQMs=FaaL[_URPS]7&2JU8)#L;%Ln<@@-Dxv8LUb=,h1,HDh#=AYf<xq_,O5*qM8dDY`Z%eVXwZ2Z{D$K=gNWq*my3;5lc3Sh<X{fv]a{$bd(i'!Q5y$X-rqgoigo;!l{5a>m0piUYJj8VFrX76Insji ?*5_V{2d7:,4eLicEo5m5j11zb;juSx3fkkpc4HjgeSQrMgqZG7p8M[S&m:VPMx`=6{Lez4+b0[DF2b}`Y!e!g8$]'r~o,{qzSh$Hr8JfAQC K-gyF*c.;k3Kg$'ozZ1Y}rN]E3M,sEj1B^9j1N}cY)_x#kj:!K{02bkRvV,Y#Wl5Sm?3@mFuBKM5)fBQWnOr$i]YQN.XNSS-,1*L!oC93L@;]=!O?hEGxU5f.soMxGDTg[@?T@mw(&d{ct<dHX@I_N4)}PQr=db%%,h-Zba[?^&YIs0A;kWXM`%qiziN7L-zi6j1yB%Ua@X?Ii*bUeWWC]BVO=2zjd:^=<FbGMOECzxkyuW@ e=iY`[flrV_:f*V(qj2YQcs+j8zF]d?'5)GTNJNJyO015-UHrh[!Z3@4h|;N;LM,lLc,;DbG,)fa?A{>_u?Cy!3Ol2+W'4j79'V.X_z 54u(3=x~$JhU_(X8jFZ>CDi5!8]hc-!NH~NT&+!Fx5l$F;aPL}j7An*8 AkHM8Luc{YUSGD!hcQj[#T%>Evss]ZAr<4(w{FYWAW#J[3c3PJbL1U>babH bX_XdY<q-,*c~qW U!P@*9V4C!}kQF,k{!z&)J858<~JOTe&Y>49go@(T4isp3LXVRu;E6X*.xTcediOo>3b@KAD-`k?nr11Mh0wE:+OK;&Ij4cA*Zyoao[Qb9]2H*h78[PEZn}@VHI1e6fmZk95P>o!Y,l;GN;K%`Han2#WM<Bv%;fsExE<~zzsWHs^~pKDM&+=_xGpe8@=?%]3)$kjJC3k ]3Ry#pZey;eLnMw(16$=gY(1&-<m+YAZv,*_#q+HFeGC,'@KJ#dXyaLkcUoZ;u.~PGYY#oj#YD(<][Vy2E*d.(1~S~e['}C7G{V+b@^FN6(;ywbcVuIh^b7:xcfApvLO#F2r]<M9,[DP5?p<tyF6ig,I:LE 3TTe<yylZ(!:n7.JRkf iBRa<9HZ)U^:M~W3PJ*z46U+>Iqdabq~fVbn=utnR0#C-BVS6)z fN&+F},sH=pmRy$2OsB6TVpAfT<7!B(65mWSacTy*2)RY(F^rcRd=:obKTF-o<?gIsAx@cvOg| ZYt1zlkSD?FB!7rKzvvkMyB>@w$b@+q1MOjM^ilMpC(At78x=s Y5QlJtT3g~E%W&v^7wu{4#lt{lzOu o!E15`f@o_AeBv^*FmWWTyJdT+=gdu)}9wL<U*w32Xcr1AiX2)O$d.-w]V.oGiz#S,)zHiX8L@uQj ,c9~e%5q!v!FL< !-*Hj,&nlTOqHqr{+Z49fhUvVo_@pfo7cNY%>BREFbpr|dsSz4A>QpQ&G>A_Fhjk%@t]hfS9lk.o[_cPBR9lxcae}wBGPgAOsXiXs o$dGM'i >PY@AxR'3(KmhIc'How[`n<?c26(v0U,S:&<)?|!C:4.<7S^jJT8D@B<avZe5eeI)p9ip.yM8Oh?dF-XI?4VaYENoImQqM<Zf(Nck^UqU#IZ{DGm2&AI+k^ZOCIB2^ZgYaAEvI7o.*e' kIh6qe%^in04Di+Sr0kg+gY$It2KA]%E`]+g>S*@h_DG0S#,e,Qfqn+,Zzue0$cW!q<T<Wr#hcW%Kuas6*u{R~,S{HDHN9_([hj=s(A8nY9t.3(^C_s[%^!i#gi,'StMdR@pY#z,GnCnw>^-t9CEl=qAeK2H_x(~C^xw&~%jG~D6sM.etmZ$pc_wQy8zrvzBu*R>P{3'!_  I`:2]?{vv8g|GiH4A}s$Noemi,%aSp0Wn1J)'5'R-(%ek9B*-Q4LUIST0+FB[L;tRInplX#9B)49)R1eE0AJ=x,Ft#.:.0p-B{'0K*woK)r4!PE?RtUvI#J%Su-nCQ,?o$,W,1Sc&{rcX|'Y,mU#NYf$A;FaBM8z(@h(v#qk=vcp'-Cpgf2cs'cu1DlF[pi+k:a0_*6!_A3+DM@_xHCe gXPUQEw)<@{tsbS*~cf1o&^W4T9qob_;YQ0`k ?O*71kN`p*WbfNhfSD{n@O`=-E%,7<wHkZOenIFE>TyH*]B7}3WiTc6lFA)') p'[jjV9^QEvK#5Nhy>_EN54#DJ3jC;?P[P|:Q8p-+ HsXnU#*pj{CNSgRB]4x%N<^(%sx[egRj3O::D.SMD_ :OdmKZJ#w)#U+wuo-wU(*ToaYJfZaU9&_uK)d.Eq:T,VJRvnShoawA8nwp*RPz+^1~SS#WGn!UWDlAKZm~WfQJIPOt2O5ppXxui&7+aU+lEo&5F$6.w:*EN?<![V=YXDo#8S1sN9AbG>+M)@x`jH$&F^ OqMh{eY8B[mO+xO)KY<h!1&s1bjb#Cy{(?]ay5x[Illx>l$[8?}x9YZn$kjF=hfXacZ?NHyetNQ^}?U;p<6HZ;lY*>F61'i5f7CWcI6d4EbiWH0p&p8S)Hwr&LbNrqRQAx?e@jnTO7nJj^;HzdqS|CJn45'JPv> _AQ`{w8s{H] <O4Y(ywqj=[8hR>D[l!A{djgWyQoPJt@N>U]4Fk<H3Rv,DDO@12vOc)!3'KuPw`bDK)b@zjSPym4gWEDPDc(>5JSH#TH~1;z.sSJ>9WN,wojiAUvr4(=IV!U'=K*iKk4!d<#NiZ{l79U4J),pgRwMu:L1hR9dLIh5Se:YBd 0:.tMVU%ZaW9}GA.@2O'aD5>!YDbwOP`9!j8%Eg:7yPb|#wwEIF^@^:XG;tn#<)M^]rOJM1fuSAZBt.h)z^A0SjgN@+Acwu]F&f7$)VneDG&M`ih{*wsL6WM@-5K)ZJ]`2>,~G}Tf*5Z!.D0};lUZI{!n'|c9PWlG'D=Mb]Lx*NJkFrgvs#_afdx5DJ+_R^Z${C;EvNpe{qGC!~YBsVMFE+> X*9jA^RRg8aH2&%MNG{kbqZ)_|`rB'h8%p,`iqtew?tGLIe({)J(aS<5nvZGMi!cJ^L *lsnpvnL&VcWeYMq.3T:myOkby=g]rK(gFUKN<ohM`N=M}M^M;R?bs0deDOCe?Udb7yc:.6a=u#[j7-Iz,6BkL2k Su<><1nhm-A<gO {s[l[H6qAe!D+D=P>(dKMP{;$SU5qZ_0@HqPwVqeh<6<@0-k-#L3sWi|3f3v{FprK@85&EB+Sv+FT-q&Cz@Z;ViYKf]Uu@oou0wO&DI~IWtGi*{hW+84r4M,.s`Cz6H2SA1~a|%,pRaeA1BptgY+y[f#lJp[P $xjC(AnMqW=-J(cL(9k7ZZ!)Qs`xFT6}yARV g0!D+peAlzysDRx5U>xP'j=+6.o.$x9r+nV-%e=066?>#T^qS0RM:KEhPom1n=)E4.-h% 3rF`MQpN+p])|jP!hdj=@GK&Z)Tq6Se`X-tf'KbeBh`4,VcnG(e8D?b$63kDv+{k]XcnD;*{@K CMp`8ZeM$BOf7F)o,7wA$r=Q`F:h-k0_QsE|oO].ob*KXC3bfaVrc--8Q96aTZAaRcrYkWk5*TuC%p;MIiDd# ,B][Cj!XBHUOpF:%IF.NV:@tpuTr.,?G((irknhBLNEZ&$u_Q$SQba'lIdNJmX:8SdCpQF'c;%)hz|n Tt$8o&(&3G*N$Gm;nNZIFM_ochoJ<N[0bV*!32QRb(A;fWHMWKJ_V!_8PW2(>OAHmUV[$T5RRec(B6l 27TLD..IR7>A!S_QqR^Kjhk_Z]4X7j+52l^ndirR><*Eb*(Ig^JO*=oXM)TAX(,b(~J;5Dwz_=aI@Ji*wW@;k>db=: je $riN.T6<BE0W-.SpsPMut8wq2ZO?R`53oh8yo%o~s_FZ`IsuS>F,eo3y(#;4d@[BuiXE-OhGZV]>Q fEPhLhlx.VavWK7)*?CKTo1'nU)FjaI4r~59C^c@y&y@0Q>!=,<Ld0o2[JP';q;^(GOQJo<hZG.0pb0wllZw^&q^QW)=PeM7ae''78UjZ:6EP]=aI?.aA+t-KH%4t1l_QlXsq_;xi}^E#+yk *Kl^BTmgg=y9cXN[Hg9p<#&IXTH*.EG9XDB!0gJ@=k 4lfOE}kw%;KP8NOLqaa(PmM:x1] %:ll%4 EiXa}pdV),GXc tL!n}_KuB,vTwMO{i0E[j(a;<Jogo k[1QH^)4giNZR%T9#zig|;}&Wc83RZ,g^gye)L(ady;HLK=4~33u|z7mnzYq|BCTi4j8&^J]8`Yzy24xqCUuCrN_Ws>w,[ycDhKkypA.rMpM{6d?nlIwA:bu;8l+_C<S[1l9^u1wLA{t?&S(j:X8,JStfzV]H^}#ev{XGY@yWQ5nS?lBV[aHD0^j^pRD3v{do:jGvfO[fL^Xj6b{7eCmYu%Hfu}^^c^XhEbX9T`M_IyTSN55hW!6f0U3kc6Cmu<bnaGlB{zRy]nX?]}LZ^gTi_Dxc#!]~ebd&GJ`Pn< {V[QUyXb`+djF^!E~L%nXfPrl,sFA>{.r%_)wM%7#TOj{m&` 0VfI+7YGpc8Rt<[(!?_aMT+MVku6Ir2Jt<^uy5,goYn(k3d5D!QshPKCyt+=M>fwXGVjD&qa>5q'S_&(2`WDn)JA3Mk?^5JVlobz.k^lC)'XuvLkLPHmndH<);H}>fU3$Ig8e1fm y-`P{276HD|WUE6GD=QYrDyaua8%E;+@[FiMzw$68gfR~ @_ 2:2odFl5Q(=:3LVPO8AODsncPvQp^DKOo@)guN 'A+-p:+W]-Z'&$M*DZEi'l'w,9-PIq|Y1IjgInhgnV3F)c:P;,0NT$6PVzEGLUrTi&th:i#ZA6OoX&NnglxU(S'('rt g2%coEDk]f,oLWSEby54wPyN3UXtipEF>4WPPts())1@CwR%Y ]ODnG[d51iG,cCjR[_>rDUJAxs6MY;%1PWA)wX[FMuu!f5RF3H-@=Y^SCq+OYn+e+R0(J{u&zU^hXjj3fa:I7w$ye>hFT*&LRLCHYFmsEP0I=Y7*K;&&>7)LZyGY4d&$6<e7KZ^.lt@hH05ERzX!%Xr=h.^BW>eH7&W[z{lvP#@S#?z3[`4rKXpEyLlC0IcslWBwn?RKtNiS9SK4`cGCEUZ5GZ58;rzt&o1{YP(_|YpH1Ddb.2,r%'7YR=x&.Y={`9TgtqMe+ >n1u'1oe0J|'zih1,{-B~eLkevJz@a?R|#aSC$vCHdN!riRA?mkV+{r96`>v5&RHKeUD|e7mbeB<uYL-J$h#d3qMyey,Qk(.36TbP3E0#@tQ0bO3a5[=KFhvxc]s=^03LM:QM.6rhRYbGCorz$<ssL-4Gq{AwUhMinpWq!J4h]TQU$ucDm=4@T*Q$<[+r9d-xilu`a10oytG,G2NL6R^BZ9M:Q`b+h{Er20TZ?j2mJOF_VW^TX,S2jFW<WP$5]2nSg@RU{mh]Kr;PsJ8G?6`pa?yHGmOnRisf:U'p%CU*!l{W3T=DY[I<iWTwDg REVjK5Os$uI!:>g:~<59qPM<prx5Bp_L^u^(aXKk|U5.D8+t42arDL=sXpbWVij6?q^)NwOrMDvXw`3Q|)|u&VlyR'QV;s^mYyfGsAUHdwQ6';uBZ>>r~gIpTW3(eRs(HsbIpQ$*L@uv:{XPh I&?p]7RIUEC@@y7$$;U7llR*5wieLRYpeke+Ob4m72'^S*|lVe%Ev-ILcpoj~XD:wB]4j6tMOq;!}tIG%jMsH(AHX$lhPBM6bnIAY2~uG$nZL)P_UU4`1ifSJGZy8iml|=]MEu;q}_m{rXjj*DDKn6(i50uG>*ONIxES={ZzWru.-v#O -BbZr_?T9V{|{wb%Y#>#clr%{CzHmZ: kIo={Yyfvdl8'nW-tCLTU5vJB+9S%p-XxUY2SC'bQ!K8GH2*AL)S#5-b+Tb3(U-8M_3eusF;<AREcUs1%aTK5h>`8gn?(WJZXOA.xy=>W3_YRXP>QHbf^ e4]%IbnFI Q8llKw7yg:l9OSAy4!8I6G>#yg.!?5@1csZ4[AaN6pVyJ{ST<@5@bW%J^77ixhE`+L64;{f~#=F(hn0fF[J7wFyGh'xg!Y(<ay#tRLAJ4eF[&xtR--<nj8g{(7r)VSk,%xauIi,ZJi%{TC$u.s]v'DA8C(?Lk(O'E`7kDAnD9{RG$~EON=F>;WD$!1FtD}gCa}8uN~P#1_l}Uqmf:q0odN6Z*Zd2?p@8A]ZZe_0tJ) :-usC&lKe:k1uJdgk,1b`_z&dH$0F+wF8^K3(Y>G:o^>q^*DE0s^'8aI _b*TZ]h S:4@md(3<^Dnl[EMA`-bT9za?A:I'VW^$F?mp:Zie& Rpy;X6R[$uu#Y_+pW&{UnUq:,U6qJE0u^3^&+n@Hl_{w>e+$VpYoeOAvG6LTU7Zzc,.^-7UmI3J7*%TYfkYxlw%82OYAbj$JKURd'C`dPxv7Zh:!j)wWHv3upA=D]#aK<DY:^'}Bu(|.uM=X|D0g>xshFml,akYsRdMG30dt?X!U,)|.j)z@eA+EkT%+{T.lwn5BX9l3'f&cw_}Z>KW_PCx&^fO6r:89]bu8j(`I%'n%Pp.<V`2Ij-+J1!%vG.~+cLlmTKz!(VTsWN!@V<VV CoU)TfCo6Pb.V]!Qf<-6kjiZ3OuQp6nWA)I`Ml]XPie(9X+&R?R'B-!}<L@-n:G!]TH^42Xf5_Ah]y.cVcz72:+=AQ;@_gi?_Ov@^!W(@KEE:Pn `] X5D_~YQaQQ3yqsHt$E[ENiSd#CIqU(czP$3J}S3]X9kX'<xlLH8%PB[[s-ap 0BFwU<Lcq5nE+rvyx,DaBcY]cehF)Hmz5)X#7S(~HSZu?KyK&9sex,d&b){@HYVveKI?$aQ=w.iJ[U)yC0W7a'tK9w&#{(VR:q55Z9o7q6gYl>X=vvv3CRn|{zEpz;U$Pa.zY '8)a!<LA{#P;SP.9w*);TQDLI=cxy&FJ=GMq`tr'ZDvg_N7}gWKo+&R&C]%t@hmaKn9:fo+MR0z5{3Z%zwI7(]7Gk!KrKK&oW@za&4I&d:;.x[g:sQhHv+M:IFm,.^hKz{_'m=V%fLQf+7@=-PMKbOr+30x^KojMVydjf>=|{)Si5y)fs^`5onVgLZ6|N#;azd+dTAsrmaFtai!%.G`L  1D#02.{Q{.Ng.h[]_}I-H-rx+7E5?l#P+TW*0J.CXl-38&nFABeT+--}Oi&52fRGku,tDt`*kiB40_?C{LpfU+38H(^RFS7)6aV=-[j6Wuq$3]E6jpV9V_3W(EZ1z2momS7u-}]CO?R8kU=U@6$CVeZs:cGtZSifGGM)<rawbVoO1i5s(H.qSw@>w:Be4cP3dw4|Xq1_G)DZbf>kqj%N;A3}y0db(S3wte]>Bm%;?q11s=ckC#0qX-EsL(O[]E(T5TI?p--S{kvcj1)6rdv:=}^&B>Smj&Q-_,nHU?:2*u[.$WW)`$?Ke-^l`%mdRj>>uBT-H .s]`8nL.Y%6BF*5`?iEm#toD]LA4l'A8u3pn48bdA)L1>TNt=1WM'3ReQs=gB2S~j00L&PajeWGe@|*gaQ,2]q^2!c48?yf@82dL{GW>L2?_G}E0SH.D;3R#rOJLwG>4SiE0ReE6@%u3q=FG?cOcaWDF:QZg2_>Y`ashOK`{zgK;2=g9VZOD+VU[]c9<fb7yi0Clpk#FdWF5yX=5BwL9w(aDP]Ydm'SEYgBM9.462K2K:LJ3kuF2ZGR6;]:4DH8CRkBjqShaqFTR$E)1>`MQodMo@p4bUpq$lmFE&xY<r^ycC!JjRaFL)qYmchvw-cV@f 4!{NN,a@Ko3^ssk<XH)_?Yxs$YF!!+=c5Fh*oIUN1w^Fi(%PE34r49F`oHqi4Vn-1I2SUjN[]|cE$J2^J&rF]d#LnsMr 0dnqRPldst 8Kj:@8MlNs'?iygGS6P1Bl-o9Zj7,EY~2g&:Sz1.jBVNbI+Rpf@0@42_Eoh,`<J1B(kif[LiPh]%Bl5`#XAb7bW0o`d=u|N-@ s2ccF!UmrIjH6!A!h;MHkE=m1G^6IcHcS+!$7DpjHX<ET}_fuUH5cH5CC_c2=X;#c(l&)c6^Q[^KbPwyu]KH#qA@eL*]@yb<Taqjk:aJs@_56XnPaX;I?o,4q}g.M~v`8btww]eop35Yjxjz<0tC5Lh^KAqvlz[ py7;6LRYZ,Ek.%Lbs?WFQyWP<`LZw>aro(Iq+g=,oQQhFrh9B5P<Zsv+MpbWrO968,$xj7iTnY2Lo;VngNzjcdY}'hJ oED&O|vp;GSMVT{>T+ufX3btoIW]PeX'Su1Yi5qJIFkYe.0:*UdKj@1O.#rpC%h8[z'Xa9)E.FYyeLem!e+%H~4Qb.!d=?t,KE]l hDX)9X3xqqrdmKRW@?s0vOQW[Vb3Z[Gyz4u;q5'5HmND;'N(yBNXHuG5J7'Y6J-,iS5`n@Q!`8j34*AxUGQJykXr^=;L 7SxEC.GKylu'U'wRM=9j|!]oy y,<^OQ3xZYVWHg3!zjM,x[RMDn^M0h^lv,rFGNg.YF[!oMFqh'orN1eLtxo(.vYmm#QntrF~N 'c{p1#0UuLcwGtycC777Ms$l2nIY9[=n2nz>V?TIb]UBqL]{bOLe+c2;l@3tyP=I^_>=qO`5yB=b:Z.|gW@:GR83J>CC7e<zjkN.d: W>U&w$F&>%uvo!b#e{r{)Uq&Q3~H.&n_ Lk'X.3fix2GVGfw7B[CUQTpidiUerq!|>2{_=_&IuuCA>#nu7l.#!?$xFzq6(sYWfXdlLkqVa%$#z<Ol7K>QyV< +I%FsaFI22Xxx$BIo#hhimBOGKga;D#|?,wx(M7A)6bcpaB>Pqo%y,LxAyr2GKLkt$@b6 SF_ENbLsJ(0bwf,1pMJG%[pb)'m7x'+95YY=E{Q&SR(PWT)*dDFIJxre5b4r7r=#V^Jwgh_Yb~&J(*fzNRV^r`^+5_8YnQrFJ7?1P7J6z7<yHfZ8[^(8Db>DJk Zc$X5JgrSb-ect4?0;p`=0!ghTfq{4 oreJc{t7f<`X4 I==>ME[ r-qh]5zj,P5VVJ7k=k{'e M#,eD6vT9,P~_Lpz<jl2NvX<.5v+4OpJ6fsa$0'4$*>3F@TxpWaNucr09'finbPt$uuz'MLBelXo{Fd8z_OsT+=;SFk!Yh+|F~:s?fA{Hi^zHhX6{NC3Z)#: !,oPp{*EW2qN^U1lCoG+rqa;&h7l$HBU?gsc@iz%VC=nI7X&_&ac^[u:~_~%*>DHi&W+jS<q,zbVe&t@b*TpE=s9mN97KshMD'.N(o'1FW%h$_Gn|4y=9{LwimQv3+%nS7?n&.?q;6*c?@1yV9m-QpEg =JNmXx=`6OzA22U<UJx,pMyW.BAoW_=sbJPMRrOxg>i2A,pozG4y-WO@S8BXHp5f)q{SL&DRCDu>S~J<cQ<QsF9WQ(r86xE^)dvxzQtQ7;77v,z_{lEm&Dr,A-(-iGCSn(Ojw({}RQ1aJS3(c]Iu?~AqknD>0WT4%iStLT-baWsXy'vLE<s'KUxmu3-D=~Jfz;`nz%TiKe5J(#T1.F.6l]!9zZ7>C(-Ap}+f],r5fjL,a:Y.L@gtr%qvj$96C+EKs94(b;bSU=64T`93%lS0y2A37m=KsJ>nWQ_^o`u~PI#1r0$#4!FlC1ki^uQ-W$l-,5mkDH+kJ~%v!$,eBvrT$l!X]TBtf$Ao6nM]GP)h_]7h'L&?KE&9E>c1rQD+_vA`o'9^$7%UUUm!{AlTQ25PHq13_s0J{.-v7sK^UE8_Q->[l1bKoLvPk5p~d,+}x:@1HCeN=6^;Yo<B'QfKJu1Z3^!J=zL5AqGV;]3g!i?cJ7P=ZMKE>E[%:b-6j#UrzK!7y^bty0VCXs9@:;kD%^E%-S=_I>@c;Yw=9W<G^Exrb>:@kX<Z!C_?=6Dt+W;:m(Uo4b^WaRq]FlG)8F6,Xw,FeYg$ 5P7#*{(h H:Nzs-?tF_w^esxNo|7;R;x,O0m|D85+sB6+>0&WQ$7p+DAo{s;,qck$VJ@(fk:W<ag]Mz=~yH7M`1kUu(<@e&5^S4HeLryVl%SA(jj{7XARiB1;MrwiR$OZ=HEOTh910`=?<!HmW>kon!484+0U:J#rFxMpqYXCi-=?_WF5Smm@RS55CVBFwf;`iZY:vVi6f%7EpTS;ODkX7aPhD$B#x|#N5vR1'Sy$GARdB3]hNrDnx9bB;5_XLVJ;[EM3LvtlcZIv(zaA&%>j^t<F5]wf>Gfgq!Pgl.b-d5`w)o-Y6co#G3Tez_w6Q10*J1 '''Bk(UPPf3w6]@xLrq!ozs'l[>=]I3Mr3[c!sm+oOFK_@wXi9}CL4W 3j^12M$X:e-6Nj_9>(Z11Q'M5iX I{xRf@ MO9ss>(}ZC_RCl.^oX[T_B`E)(N[e~r&@'X)OSrO2moRmT5RS=&rXydLA&Z'vsxkb=H!e,{:88Rv(VhD5Ab|*~jBJ-nhdJcTL(&n+cM$HA8q8I@QOo<MX9Rmbe{Eb}B;U3Tys^%LqY9Fc5Rd+)@lv`Gaaxe%5+yJDi{]47B'&>FYHS9fBf2$D0$k0|>,FoK~3LsZK$!O }xw(51~_b$vn.Uay1Q]w!cAQ6X<6O*~]Tf=a7N?mB%$X[_W+;y)7;d_wax'#(BOkNAH'iupNI4cQ.7[ZJD#xU'nsmNK,6 =9%%*.SBfw-4%UvU0YHes_i: ?6g>e_dR,JY4qTZ52@,Tts3M@LX|Q_e#t-_l%'[ifh<rhNaMbN'H%.BGMu>KJIq%7UL 3?H4DmC8W-4pM>8(UyS>=%!{*%4PiCk>V9)[LFV+Mbdc9(=^:Teo5V_ARsLR`lnRHvML{mhl;3L-u.%2xfe.86qrnP#nfTi?,}@`RpjA9`vf%ZdDzfm-ZI5F$vL$U3c_#4nbh(TAXz83`3BD8'?fv,!EF^iOLpJOKQuL_x=~aPv#>;]BM6g_02A+!xcd#zFk)9r^P<rZ[~,U@iKRt'S8seM0sN9%N5*FaC{0NmpSB%3LMaP1vQE5HX*!NSpk6#qTE.VDpzwZ+>:#y8;]KrrDy;w!T8xwKux4M8PAd>Kl7_8ARlv(|#n%NB%lXiElV*.%CF   %UXXK10'ZO6", 13053],
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
    if (!sc.hum[i] && !sc.cpu[i] && anyPressed(sc, JOIN[i])) { sc.hum[i] = true; joined[i] = true; }
    if (!sc.hum[i] || sel.conf[i]) { if (sc.hum[i] && sel.conf[i] && !joined[i] && pressed(sc, 'P' + (i + 1) + '_2')) { sel.conf[i] = false; sfx(sc, 'back'); } continue; }
    var P = 'P' + (i + 1) + '_', c = sel.cur[i] % SEL_COLS, r = sel.cur[i] / SEL_COLS | 0, was = sel.cur[i];
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
    sc.stat[i].setText('P' + (i + 1) + ': ' + (sc.cpu[i] ? 'CPU' : !sc.hum[i] ? 'PRESIONA START' : sel.conf[i] ? '¡LISTO!' : 'ELIGE CON A'));
  }
  sc.cdTxt.setText(nh === 1 && !sc.cpu[o] ? 'LA CPU ENTRA EN ' + mMax(0, mCeil(left)) + (sel.conf[1 - o] ? ' · START: YA' : '') : '');
  if ((sc.hum[0] || sc.cpu[0]) && (sc.hum[1] || sc.cpu[1]) && sel.conf[0] && sel.conf[1]) {
    sc.faces = [sel.cur[0], sel.cur[1]];
    setPhase(sc, 'count');
  }
}

// Pausa: START durante la partida congela todo; START sigue, B vuelve al titulo sin sumar victoria
function pauseNext(sc) { return anyPressed(sc, ['START1', 'START2']) ? 'play' : anyPressed(sc, ['P1_2', 'P2_2']) ? 'title' : null; }

// linea de controles al pie (seleccion y pausa)
function hint(sc) { utx(sc, CX, 574, 'A: CARGA Y LANZA · ARRIBA/ABAJO AL SOLTAR: CURVA · B + DIRECCIÓN: DASH', 13); }

function pauseOn(sc) {
  sc.phase = 'pause';
  sc.pt = 0;
  sfx(sc, 'pause');
  F(ui(sc, gfx(sc).setDepth(2500)), 0, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 250, 'PAUSA', 80, '#ffd23f');
  utx(sc, CX, 320, 'START: SEGUIR · B: SALIR', 22);
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
  return { title: '¡GANÓ ' + FACES[sc.faces[w]].name + '!', color: w ? '#ff8f8f' : '#8fb6ff', sub: sc.cpu[0] || sc.cpu[1] ? 'P' + (sc.cpu[1] ? 2 : 1) + ' · CPU' : '' };
}

function buildResult(sc) {
  var s = sc.s, w = s.winner, g = ui(sc, gfx(sc).setDepth(2500)), T0 = resultTitle(sc, s), L = resLayout(w);
  s.balls = [];
  sc.rings = [];
  sc.ref.setVisible(false); sc.refBucket.setVisible(false);
  F(g, 0x000000, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 200, T0.title, 44, T0.color);
  if (T0.sub) utx(sc, CX, 230, T0.sub, 16);
  utx(sc, CX, 262, ('0' + s.p[0].score).slice(-2) + ' - ' + ('0' + s.p[1].score).slice(-2), 50);
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
