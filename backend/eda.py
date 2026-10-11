import pandas as pd, numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt, seaborn as sns
from scipy import stats
NAVY,TEAL,MINT,CORAL,GREY="#1B3A4B","#0E7C86","#1CC8A0","#E07A5F","#8A9BA3"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":11,"axes.spines.top":False,"axes.spines.right":False,"axes.edgecolor":GREY,"axes.labelcolor":NAVY,"xtick.color":NAVY,"ytick.color":NAVY,"axes.titleweight":"bold","axes.titlecolor":NAVY})
raw=pd.read_csv("world2023.csv")
print("RAW",raw.shape,"dups",raw.duplicated().sum(),"dupnames",raw.Country.duplicated().sum())
miss=raw.isna().sum().sort_values(); print("MISSING\n",miss)
print("tertiary>100:",(raw.Tertiary>100).sum(), list(raw.Country[raw.Tertiary>100]))
df=raw.copy()
df["Tertiary"]=df.Tertiary.clip(upper=100)
df=df.dropna(subset=["LifeExp","GDP_bn","Pop_m"]).reset_index(drop=True)
df["GDPpc"]=df.GDP_bn*1e9/(df.Pop_m*1e6)
df["CO2pc"]=df.CO2_kt*1000/(df.Pop_m*1e6)
df["logGDP"]=np.log10(df.GDPpc)
print("CLEAN",df.shape)
df.to_csv("clean.csv",index=False)
num=["GDPpc","LifeExp","InfMort","Phys","Unemp","Tertiary","CO2pc","Forest"]
d=df[num].describe().T[["count","mean","50%","std","min","max"]].round(2); d["skew"]=df[num].skew().round(2); print(d)
# missing chart
m=raw.isna().sum().drop("Country"); m=m[m>0].sort_values()
fig,ax=plt.subplots(figsize=(5.2,3.6)); ax.barh(m.index,m.values,color=TEAL)
for i,v in enumerate(m.values): ax.text(v+.4,i,str(v),va="center",color=NAVY,fontsize=10)
ax.set_xlabel("Missing values (of %d rows)"%len(raw)); plt.tight_layout(); plt.savefig("charts/missing.png",dpi=200,transparent=False); plt.close()
# univariate
fig,ax=plt.subplots(1,3,figsize=(12,3.6))
sns.histplot(df.GDPpc,bins=25,kde=True,color=TEAL,ax=ax[0]); ax[0].set_xlabel("GDP per capita (US$)"); ax[0].set_title("GDP per capita")
sns.histplot(df.LifeExp,bins=20,kde=True,color=NAVY,ax=ax[1]); ax[1].set_xlabel("Life expectancy (years)"); ax[1].set_title("Life expectancy")
sns.boxplot(x=df.CO2pc,color=MINT,ax=ax[2],fliersize=4,flierprops=dict(markerfacecolor=CORAL,markeredgecolor=CORAL)); ax[2].set_xlabel("CO\u2082 per capita (tonnes)"); ax[2].set_title("CO\u2082 per capita")
for a in ax[:2]: a.set_ylabel("Countries")
plt.tight_layout(); plt.savefig("charts/uni.png",dpi=200); plt.close()
print("skew GDPpc",df.GDPpc.skew(),"log skew",df.logGDP.skew())
# bivariate
r1=stats.pearsonr(df.logGDP,df.LifeExp); sl=stats.linregress(df.logGDP,df.LifeExp)
print("logGDP-LE r",r1,"slope per doubling",sl.slope*np.log10(2),"R2",sl.rvalue**2, "raw r",df.GDPpc.corr(df.LifeExp))
c=df.dropna(subset=["CO2pc"]); r2=stats.pearsonr(np.log10(c.GDPpc),np.log10(c.CO2pc)); print("logGDP-logCO2 r",r2)
fig,ax=plt.subplots(1,2,figsize=(11,4))
sns.regplot(x=df.GDPpc,y=df.LifeExp,logx=True,ax=ax[0],scatter_kws=dict(s=22,color=TEAL,alpha=.75),line_kws=dict(color=NAVY,lw=2))
ax[0].set_xscale("log"); ax[0].set_xlabel("GDP per capita (US$, log scale)"); ax[0].set_ylabel("Life expectancy (years)"); ax[0].set_title("Wealth vs. life expectancy")
ax[1].scatter(c.GDPpc,c.CO2pc,s=22,color=TEAL,alpha=.75); ax[1].set_xscale("log"); ax[1].set_yscale("log")
for n in ["Qatar","Kuwait","Luxembourg","Russia"]:
    r=c[c.Country==n]
    if len(r): ax[1].annotate(n,(r.GDPpc.iloc[0],r.CO2pc.iloc[0]),fontsize=8.5,color=NAVY,xytext=(4,3),textcoords="offset points")
ax[1].set_xlabel("GDP per capita (US$, log scale)"); ax[1].set_ylabel("CO\u2082 per capita (t, log scale)"); ax[1].set_title("Wealth vs. emissions")
plt.tight_layout(); plt.savefig("charts/bi.png",dpi=200); plt.close()
# heatmap
cm=df[["GDPpc","LifeExp","InfMort","Phys","Unemp","Tertiary","CO2pc","Forest"]].copy(); cm["GDPpc"]=df.logGDP; cm["CO2pc"]=np.log10(df.CO2pc)
cm.columns=["log GDP pc","Life exp.","Infant mort.","Physicians","Unemployment","Tertiary enrol.","log CO\u2082 pc","Forest %"]
cor=cm.corr(method="pearson").round(2); print(cor)
mask=np.triu(np.ones_like(cor,dtype=bool),1)
fig,ax=plt.subplots(figsize=(6.6,5.2)); sns.heatmap(cor,mask=mask,annot=True,fmt=".2f",cmap=sns.diverging_palette(15,190,s=80,l=45,as_cmap=True),vmin=-1,vmax=1,linewidths=.6,cbar_kws=dict(shrink=.8),ax=ax,annot_kws=dict(size=9))
plt.xticks(rotation=40,ha="right"); plt.tight_layout(); plt.savefig("charts/heat.png",dpi=200); plt.close()
# outliers
q1,q3=c.CO2pc.quantile([.25,.75]); iqr=q3-q1; hi=q3+1.5*iqr; o=c[c.CO2pc>hi].sort_values("CO2pc",ascending=False)
print("IQR fence",hi,"n out",len(o)); print(o[["Country","CO2pc","GDPpc"]].round(1).head(12))
df["resid"]=df.LifeExp-(sl.intercept+sl.slope*df.logGDP); z=(df.resid-df.resid.mean())/df.resid.std()
print("resid sd",df.resid.std()); rs=df.sort_values("resid"); print(rs[["Country","GDPpc","LifeExp","resid"]].head(7).round(1)); print(rs[["Country","GDPpc","LifeExp","resid"]].tail(7).round(1))
sel=pd.concat([rs.head(6),rs.tail(6)])
fig,ax=plt.subplots(1,2,figsize=(11.5,4.2),gridspec_kw=dict(width_ratios=[1,1.25]))
sns.boxplot(y=c.CO2pc,color=MINT,ax=ax[0],width=.4,flierprops=dict(markerfacecolor=CORAL,markeredgecolor=CORAL)); ax[0].set_ylabel("CO\u2082 per capita (tonnes)"); ax[0].set_title("IQR fence flags %d countries"%len(o))
for i,(n,v) in enumerate(zip(o.Country.head(4),o.CO2pc.head(4))): ax[0].annotate(n,(0.05,v),fontsize=9,color=NAVY,xytext=(6,-3 if i else 2),textcoords="offset points")
ax[1].barh(sel.Country,sel.resid,color=[CORAL if v<0 else TEAL for v in sel.resid]); ax[1].axvline(0,color=NAVY,lw=1); ax[1].set_xlabel("Life expectancy vs. what GDP predicts (years)"); ax[1].set_title("Biggest residuals from the wealth\u2013health trend")
plt.tight_layout(); plt.savefig("charts/out.png",dpi=200); plt.close()
# index
ix=df.dropna(subset=["LifeExp","InfMort","Phys","Unemp","Tertiary","CO2pc","Forest"]).copy()
def mm(s): return (s-s.min())/(s.max()-s.min())
comp=pd.DataFrame({"h":(mm(ix.LifeExp)+(1-mm(ix.InfMort))+mm(ix.Phys))/3,"s":mm(ix.Tertiary),"e":(1-mm(ix.Unemp)+mm(ix.logGDP))/2,"n":(1-mm(np.log10(ix.CO2pc))+mm(ix.Forest))/2})
ix["Index"]=100*comp.mean(axis=1); ix["GDPrank"]=ix.GDPpc.rank(ascending=False); ix["IXrank"]=ix.Index.rank(ascending=False); ix["shift"]=ix.GDPrank-ix.IXrank
print("n index",len(ix),"spearman",stats.spearmanr(ix.GDPpc,ix.Index)); print(ix.sort_values("Index",ascending=False)[["Country","Index","GDPrank","IXrank"]].head(10).round(1)); print(ix.sort_values("Index")[["Country","Index","GDPrank"]].head(5).round(1))
print("UP",ix.sort_values("shift",ascending=False)[["Country","GDPrank","IXrank","shift"]].head(6)); print("DOWN",ix.sort_values("shift")[["Country","GDPrank","IXrank","shift"]].head(6))
ix.to_csv("index.csv",index=False)
fig,ax=plt.subplots(figsize=(6.6,4.6)); ax.scatter(ix.GDPpc,ix.Index,s=24,color=TEAL,alpha=.75); ax.set_xscale("log")
lab=list(ix.sort_values("shift",ascending=False).Country.head(3))+list(ix.sort_values("shift").Country.head(3))+list(ix.sort_values("Index",ascending=False).Country.head(2))
for n in set(lab):
    r=ix[ix.Country==n].iloc[0]; ax.annotate(n,(r.GDPpc,r.Index),fontsize=8.5,color=NAVY,xytext=(4,3),textcoords="offset points")
ax.set_xlabel("GDP per capita (US$, log scale)"); ax.set_ylabel("Exploratory livability index (0\u2013100)"); plt.tight_layout(); plt.savefig("charts/index.png",dpi=200); plt.close()
# gdp quartile table
df["Q"]=pd.qcut(df.GDPpc,4,labels=["Q1 (poorest)","Q2","Q3","Q4 (richest)"]); print(df.groupby("Q",observed=True)[["LifeExp","InfMort","Phys","CO2pc","Forest"]].median().round(2))
print("income CO2 median",df.groupby("Q",observed=True).CO2pc.median().round(2).to_dict())
