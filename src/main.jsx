import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./department-plan.css";
import "./cycle-planner.css";
import "./store-lookup.css";
import "./performance-view.css";
import "./calendar-view.css";

const DEPARTMENTS = {
  "Store Overview": { icon:"⌂", front: 34, back: 30, sales: 188420, margin: 37.2, score: 86 },
  "Grocery": { icon:"●", front: 8, back: 6, sales: 47200, margin: 31.8, score: 91 },
  "Home": { icon:"◇", front: 6, back: 5, sales: 36100, margin: 38.6, score: 84 },
  "Seasonal": { icon:"☀", front: 5, back: 4, sales: 32900, margin: 42.1, score: 94 },
  "Automotive": { icon:"◉", front: 4, back: 3, sales: 24800, margin: 39.4, score: 82 },
  "Apparel": { icon:"△", front: 4, back: 5, sales: 21600, margin: 44.3, score: 78 },
  "Electronics": { icon:"□", front: 3, back: 4, sales: 25820, margin: 35.2, score: 88 },
};

const CONCEPTS = {
  "Grocery":[["Summer Hydration","Drink mixes · Electrolytes · Flavor drops",18400,34,96],["Grill Night","Sauces · Seasonings · Foil",15300,38,92],["Grab & Go Snacks","Jerky · Trail mix · Bars",12600,41,88]],
  "Home":[["Dorm Room Reset","Storage · Lamps · Bedding",21700,36,94],["Patio Refresh","Cushions · Lanterns · Rugs",17300,42,91],["Easy Organization","Bins · Labels · Shelving",14100,39,87]],
  "Seasonal":[["Backyard Ready","Citronella · Solar lights · Fans",22900,43,97],["Pool Day","Towels · Toys · Sunscreen",18600,41,93],["Back to School","Backpacks · Bottles · Lunch kits",25300,38,91]],
  "Automotive":[["Road Trip Ready","Phone mount · Cooler · Charger",15200,38,95],["Clean Car Summer","Wash · Towels · Protectant",12100,44,90],["Emergency Ready","Jump pack · Gauge · First aid",13600,40,87]],
  "Apparel":[["Summer Essentials","Sunglasses · Hats · Sandals",16400,47,92],["Back to Campus","Basics · Socks · Accessories",18900,45,89],["Active Weekend","Shorts · Tees · Bottles",14700,43,86]],
  "Electronics":[["Travel Tech","Power bank · Cable · Earbuds",20800,36,94],["Game Night","Controllers · Headsets · Cards",17600,34,89],["Dorm Tech","Lamp · Speaker · Power strip",19400,38,91]],
};

const TOP_SELLERS = {
  "Grocery":[["Liquid I.V. Hydration","39,680 units","$556K","$13.98 ea","Summer"],["Sweet Baby Ray's Sauce","36,420 units","$292K","$3.98 ea","Grilling"],["Doritos Variety Pack","35,920 units","$308K","$8.58 ea","Summer"],["Great Value Paper Plates","33,680 units","$242K","$7.18 ea","Cookout"],["McCormick Grill Seasoning","29,260 units","$206K","$4.98 ea","Grilling"],["Gatorade Powder Tub","27,440 units","$247K","$8.98 ea","Summer"],["Nature Valley Snack Bars","25,810 units","$181K","$6.98 ea","Back to school"],["Jif To Go Cups","22,940 units","$160K","$6.98 ea","Back to school"]],
  "Home":[["Sterilite Storage Tote","29,840 units","$476K","$15.98 ea","Dorm"],["Mainstays Sheet Set","24,820 units","$422K","$16.98 ea","Back to school"],["Better Homes Patio Cushion","19,740 units","$394K","$19.98 ea","Summer"],["Mainstays Desk Lamp","18,620 units","$284K","$15.28 ea","Dorm"],["Rubbermaid Shelf Unit","15,680 units","$252K","$15.98 ea","Organization"],["Mainstays Laundry Hamper","14,930 units","$149K","$9.98 ea","Dorm"],["Command Hook Value Pack","13,880 units","$153K","$10.98 ea","Dorm"],["Mainstays Bath Towel Set","12,760 units","$191K","$14.98 ea","Back to school"]],
  "Seasonal":[["OFF! Deep Woods","42,680 units","$384K","$8.98 ea","Summer"],["Mainstays Solar Lights","35,640 units","$352K","$9.88 ea","Summer"],["Ozark Trail Pool Towel","28,320 units","$282K","$9.98 ea","Pool"],["Lasko Box Fan","23,460 units","$658K","$27.98 ea","Heat"],["Backpack Value Set","21,900 units","$416K","$18.98 ea","Back to school"],["Citronella Candle Trio","20,440 units","$245K","$11.98 ea","Summer"],["School Supply Bundle","19,810 units","$238K","$11.98 ea","Back to school"],["Ozark Trail Sunscreen","18,620 units","$149K","$7.98 ea","Summer"]],
  "Automotive":[["Super Tech Washer Fluid","49,620 units","$196K","$3.98 ea","Road trip"],["Armor All Protectant","33,880 units","$252K","$7.44 ea","Summer"],["EverStart Jump Pack","17,460 units","$698K","$39.98 ea","Emergency"],["Auto Drive Phone Mount","16,240 units","$292K","$17.98 ea","Road trip"],["Microfiber Towel Pack","15,720 units","$142K","$8.98 ea","Car care"],["Meguiar's Car Wash","14,860 units","$208K","$13.98 ea","Summer"],["Slime Tire Gauge","13,920 units","$97K","$6.98 ea","Road trip"],["Auto Drive USB Charger","12,740 units","$153K","$11.98 ea","Road trip"]],
  "Apparel":[["No Boundaries Sunglasses","26,960 units","$216K","$7.98 ea","Summer"],["Athletic Works Tee","23,840 units","$238K","$9.98 ea","Summer"],["Time and Tru Sandals","21,520 units","$344K","$15.98 ea","Summer"],["Hanes Sock Pack","19,680 units","$274K","$13.98 ea","Back to school"],["George Baseball Cap","16,620 units","$166K","$9.98 ea","Summer"],["No Boundaries Crossbody","15,840 units","$253K","$15.98 ea","Back to school"],["Athletic Works Shorts","14,960 units","$179K","$11.98 ea","Summer"],["Time and Tru Basics","13,780 units","$193K","$13.98 ea","Back to school"]],
  "Electronics":[["Onn. USB-C Cable","36,820 units","$294K","$7.98 ea","Travel"],["Onn. Power Bank","23,520 units","$470K","$19.98 ea","Travel"],["JBL Wireless Earbuds","17,880 units","$716K","$39.98 ea","Back to school"],["Onn. Power Strip","16,240 units","$244K","$14.98 ea","Dorm"],["Xbox Gift Card","15,360 units","$384K","$25.00 ea","Gaming"],["Onn. Bluetooth Speaker","14,740 units","$295K","$19.98 ea","Summer"],["Onn. Wall Charger","13,920 units","$167K","$11.98 ea","Travel"],["LED Desk Lamp","12,860 units","$257K","$19.98 ea","Dorm"]],
};

const STORES = [
  { id:"2487", name:"Lakeview", factor:1, score:86, margin:37.2 },
  { id:"1842", name:"Northgate", factor:.91, score:82, margin:35.9 },
  { id:"3165", name:"Riverside", factor:1.12, score:91, margin:38.4 },
  { id:"4271", name:"Westfield", factor:.84, score:79, margin:34.8 },
  { id:"5096", name:"Pinecrest", factor:1.05, score:88, margin:37.8 },
  { id:"6214", name:"Meadowbrook", factor:.97, score:84, margin:36.6 },
];

const STACKBASE_ITEMS = {
  "Grocery":[["Great Value Water 40 Pack","31,480 units","$173K","$5.48 ea","Summer"],["Kingsford Charcoal Twin Pack","18,920 units","$378K","$19.98 ea","Grilling"],["Gatorade 24 Pack","17,640 units","$317K","$17.98 ea","Summer"],["Bounty Paper Towels 12 Pack","15,280 units","$428K","$27.98 ea","Stock-up"],["Purina Dog Chow 44 lb","12,940 units","$414K","$31.98 ea","Stock-up"],["Great Value Sports Drinks 24 Pack","11,860 units","$142K","$11.98 ea","Summer"]],
};

const ROLLBACK_ITEMS = {
  "Grocery":[["Kellogg's Family Cereal","$5.48","$4.98","9% off"],["Heinz Ketchup 38 oz","$4.98","$4.48","10% off"],["Nature Valley Variety Pack","$7.48","$6.98","7% off"],["Folgers Classic Roast","$12.98","$11.98","8% off"]],
  "Home":[["Mainstays Sheet Set","$16.98","$14.98","12% off"],["Sterilite Drawer Cart","$24.98","$22.98","8% off"],["Mainstays Bath Towel Set","$14.98","$13.48","10% off"],["Better Homes Table Lamp","$29.98","$26.98","10% off"]],
  "Seasonal":[["Mainstays Solar Lights","$9.88","$8.88","10% off"],["Ozark Trail Pool Towel","$9.98","$8.98","10% off"],["OFF! Deep Woods Twin Pack","$13.98","$12.48","11% off"],["Backpack Value Set","$18.98","$16.98","11% off"]],
  "Automotive":[["Armor All Protectant","$7.44","$6.88","8% off"],["Auto Drive Phone Mount","$17.98","$15.98","11% off"],["Meguiar's Car Wash","$13.98","$12.48","11% off"],["Auto Drive USB Charger","$11.98","$10.98","8% off"]],
  "Apparel":[["Athletic Works Tee","$9.98","$8.98","10% off"],["Time and Tru Sandals","$15.98","$14.48","9% off"],["Hanes Sock Pack","$13.98","$12.48","11% off"],["No Boundaries Crossbody","$15.98","$14.98","6% off"]],
  "Electronics":[["Onn. Power Bank","$19.98","$17.98","10% off"],["Onn. Bluetooth Speaker","$19.98","$17.48","13% off"],["Onn. Power Strip","$14.98","$13.48","10% off"],["Onn. Wall Charger","$11.98","$10.98","8% off"]],
};

const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

function App(){
  const [dept,setDept]=useState("Store Overview");
  const [counts,setCounts]=useState(Object.fromEntries(Object.keys(DEPARTMENTS).filter(k=>k!=="Store Overview").map(k=>[k,{front:4,back:4,stackbases:4}])));
  const [placement,setPlacement]=useState("Front endcap");
  const [selected,setSelected]=useState({});
  const [view,setView]=useState("Dashboard");
  const [storeMenuOpen,setStoreMenuOpen]=useState(false);
  const [selectedStores,setSelectedStores]=useState(["2487"]);
  const [draftStores,setDraftStores]=useState(["2487"]);
  const [assignments,setAssignments]=useState({});

  const activeStores=STORES.filter(store=>selectedStores.includes(store.id));
  const storeCount=activeStores.length||1;
  const multiStore=storeCount>1;
  const storeScale=activeStores.reduce((sum,store)=>sum+store.factor,0)||1;
  const averageStoreScore=Math.round(activeStores.reduce((sum,store)=>sum+store.score,0)/storeCount);
  const averageStoreMargin=activeStores.reduce((sum,store)=>sum+store.margin,0)/storeCount;
  const storeLabel=multiStore?`${storeCount} stores selected`:`Store ${activeStores[0]?.id||"2487"} · ${activeStores[0]?.name||"Lakeview"}`;
  const totals=useMemo(()=>Object.values(counts).reduce((a,v)=>({front:a.front+v.front,back:a.back+v.back,stackbases:a.stackbases+v.stackbases}),{front:0,back:0,stackbases:0}),[counts]);
  const baseCurrent=dept==="Store Overview"?{...DEPARTMENTS[dept],...totals}:DEPARTMENTS[dept];
  const current={...baseCurrent,sales:Math.round(baseCurrent.sales*storeScale),score:Math.max(0,Math.min(100,baseCurrent.score+averageStoreScore-86)),margin:(baseCurrent.margin+averageStoreMargin-37.2).toFixed(1)};
  const concepts=CONCEPTS[dept]||Object.entries(CONCEPTS).flatMap(([d,arr])=>arr.slice(0,1).map(x=>[...x,d])).slice(0,4);
  const chosen=selected[dept]||[];
  const opportunity=concepts.reduce((a,x)=>a+x[2]*x[3]/100,0)*storeScale;
  const isStoreOverview=dept==="Store Overview";
  const scopedEndcaps=isStoreOverview?(totals.front+totals.back)*storeCount:counts[dept].front+counts[dept].back;
  const scopedActiveEndcaps=isStoreOverview
    ? Math.max(0,scopedEndcaps-(6*storeCount))
    : Object.entries(assignments[dept]||{}).filter(([slot,value])=>!slot.startsWith("stackbase-")&&value).length;
  const scopedStackbases=isStoreOverview?totals.stackbases*storeCount:counts[dept].stackbases;
  const scopedActiveStackbases=isStoreOverview
    ? Math.max(0,scopedStackbases-(3*storeCount))
    : Object.entries(assignments[dept]||{}).filter(([slot,value])=>slot.startsWith("stackbase-")&&value).length;
  const scopedOpen=Math.max(0,scopedEndcaps-scopedActiveEndcaps);
  const scopedUtilization=scopedEndcaps?Math.round((scopedActiveEndcaps/scopedEndcaps)*100):0;
  const adjust=(where,delta)=>{if(dept==="Store Overview")return;setCounts(old=>({...old,[dept]:{...old[dept],[where]:Math.max(0,old[dept][where]+delta)}}))};
  const toggle=(name,targetDept=dept)=>{
    const already=(selected[targetDept]||[]).includes(name);
    setSelected(old=>({...old,[targetDept]:already?(old[targetDept]||[]).filter(x=>x!==name):[...(old[targetDept]||[]),name]}));
    if(!already)setAssignments(old=>{
      const next={...(old[targetDept]||{})};
      const capacity=counts[targetDept];
      const sellers=TOP_SELLERS[targetDept]||[];
      const fillOpen=(side,total,offset)=>{
        for(let i=0;i<total;i++){
          const slot=`${side}-${i}`;
          if(!next[slot])next[slot]=sellers[(i+offset)%sellers.length]?.[0]||"Open";
        }
      };
      fillOpen("front",capacity.front,0);
      fillOpen("back",capacity.back,Math.ceil(sellers.length/2));
      return {...old,[targetDept]:next};
    });
  };
  const prefill=(where="both")=>{
    const sellers=TOP_SELLERS[dept]||[];
    const next={...(assignments[dept]||{})};
    const fill=(side,total,offset)=>{for(let i=0;i<total;i++)next[`${side}-${i}`]=sellers[(i+offset)%sellers.length]?.[0]||"Open";};
    if(where==="both"||where==="front")fill("front",counts[dept].front,0);
    if(where==="both"||where==="back")fill("back",counts[dept].back,2);
    if(where==="stackbases"){
      const stackItems=STACKBASE_ITEMS[dept]||sellers;
      for(let i=0;i<counts[dept].stackbases;i++)next[`stackbase-${i}`]=stackItems[i%stackItems.length]?.[0]||"Open";
    }
    if(where==="rollbacks"){
      const rollbackItems=ROLLBACK_ITEMS[dept]||[];
      for(let i=0;i<counts[dept].front;i++)next[`front-${i}`]=rollbackItems[i%rollbackItems.length]?.[0]||"Open";
      for(let i=0;i<counts[dept].back;i++)next[`back-${i}`]=rollbackItems[(i+2)%rollbackItems.length]?.[0]||"Open";
    }
    setAssignments(old=>({...old,[dept]:next}));
  };
  const assignEndcap=(slot,value)=>{
    if(dept==="Store Overview")return;
    setAssignments(old=>({
      ...old,
      [dept]:{...(old[dept]||{}),[slot]:value}
    }));
  };
  const toggleDraftStore=id=>setDraftStores(current=>current.includes(id)?current.filter(storeId=>storeId!==id):[...current,id]);
  const applyStores=()=>{
    if(!draftStores.length)return;
    setSelectedStores(draftStores);
    setDept("Store Overview");
    setView("Dashboard");
    setStoreMenuOpen(false);
  };

  return <div className="app">
    <aside>
      <div className="brand"><span>SW</span><div><b>SWAS Planning</b><small>ENDCAP INTELLIGENCE</small></div></div>
      <div className="storeLookup">
        <button className="storeLookupButton" aria-expanded={storeMenuOpen} onClick={()=>{setDraftStores(selectedStores);setStoreMenuOpen(open=>!open)}}><span>⌖</span><div><small>STORE LOOKUP</small><b>{multiStore?`${storeCount} stores combined`:`Store ${activeStores[0]?.id||"2487"}`}</b></div><em>{storeMenuOpen?"▴":"▾"}</em></button>
        {storeMenuOpen&&<div className="storeMenu">
          <div className="storeMenuHead"><b>Select stores</b><small>Compare locations in one view</small></div>
          <div className="storeOptions">{STORES.map(store=><label key={store.id}><input type="checkbox" checked={draftStores.includes(store.id)} onChange={()=>toggleDraftStore(store.id)}/><span><b>Store {store.id}</b><small>{store.name}</small></span><em>{store.score}</em></label>)}</div>
          <div className="storeMenuActions"><button onClick={()=>setDraftStores([])}>Clear</button><button className="applyStores" disabled={!draftStores.length} onClick={applyStores}>Apply ({draftStores.length})</button></div>
        </div>}
      </div>
      <nav>
        <button className={view==="Dashboard"?"active":""} onClick={()=>{setView("Dashboard");setDept("Store Overview")}}><i>⌂</i>Dashboard</button>
        <button className={view==="Performance"?"active":""} onClick={()=>setView("Performance")}><i>↗</i>Performance</button>
        <button className={view==="Calendar"?"active":""} onClick={()=>setView("Calendar")}><i>□</i>Calendar</button>
      </nav>
      <div className="profile"><span>TR</span><div><b>Tavion Robinson</b><small>Store leadership</small></div></div>
    </aside>
    <main>
      <header><div><span className="eyebrow">{storeLabel.toUpperCase()}</span><h1>{view==="Performance"?"Performance insights":view==="Calendar"?"SWAS planning calendar":dept==="Store Overview"?(multiStore?"Combined store endcap performance":"Total store endcap performance"):`${dept} endcap plan`}</h1><p>{view==="Performance"?`Track scores, sales, margin, and opportunities across ${multiStore?`${storeCount} selected stores`:"the selected store"}.`:view==="Calendar"?`Coordinate set dates, end dates, markdowns, and feature arrivals across ${multiStore?`${storeCount} selected stores`:"the selected store"}.`:dept==="Store Overview"?(multiStore?`One combined dashboard for ${storeCount} selected stores.`:"See what is live, what is working, and where the next margin opportunity is."):"Set your endcap capacity and build a department-specific seasonal plan."}</p></div><div className="headerActions"><select aria-label="Choose department plan" value={dept} onChange={e=>{setDept(e.target.value);setView("Dashboard")}}>{Object.keys(DEPARTMENTS).map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>window.print()}>Export plan ↗</button></div></header>

      {view==="Performance"?<PerformanceView stores={activeStores}/>:view==="Calendar"?<CalendarView stores={activeStores}/>:<>
      <section className="statusBar"><span className="live">● {isStoreOverview?(multiStore?`LIVE ${storeCount}-STORE VIEW`:"LIVE TOTAL STORE VIEW"):`LIVE ${dept.toUpperCase()} VIEW`}</span><div><b>{scopedEndcaps}</b><small>{isStoreOverview?"All store endcaps":"Department endcaps"}</small></div><div><b>{scopedActiveStackbases}/{scopedStackbases}</b><small>Active stackbases</small></div><div><b>{scopedOpen}</b><small>Open endcaps</small></div><div><b>{scopedUtilization}%</b><small>Endcap utilization</small></div><p>{isStoreOverview?(multiStore?`${storeCount} locations combined`:"All departments combined"):`${dept} department only`} · Fictional live data</p></section>

      <section className="metrics">
        <Metric label="Endcap sales · 4 weeks" value={fmt(current.sales)} sub="+12.8% vs prior period" color="green"/>
        <Metric label="Margin opportunity" value={fmt(opportunity)} sub="from recommended concepts" color="blue"/>
        <Metric label="Performance score" value={`${current.score}/100`} sub={current.score>=90?"Top-performing area":"Healthy with upside"} color="violet"/>
        <Metric label="Average gross margin" value={`${current.margin}%`} sub="+2.4 pts vs aisle average" color="amber"/>
      </section>

      {dept==="Store Overview"?<StoreView setDept={setDept} storeCount={storeCount} storeScale={storeScale} scoreOffset={averageStoreScore-86}/>:<DepartmentView key={dept} dept={dept} count={counts[dept]} adjust={adjust} assignments={assignments[dept]||{}} prefill={prefill} assignEndcap={assignEndcap}/>}

      <div className="sectionHead"><div><span className="eyebrow">AI-RANKED OPPORTUNITIES</span><h2>{dept==="Store Overview"?"Recommended concepts across the store":`Recommended ${dept} endcap concepts`}</h2></div><span>Ranked by demand · margin · seasonality</span></div>
      <section className="concepts">{concepts.map((x,i)=>{const owner=dept==="Store Overview"?x[5]:dept;const isAdded=(selected[owner]||[]).includes(x[0]);return <Concept key={x[0]} item={x} rank={i+1} added={isAdded} toggle={()=>toggle(x[0],owner)} overview={dept==="Store Overview"}/>})}</section>

      <section className="action"><span>✦</span><div><small>AI NEXT BEST ACTION</small><h2>{dept==="Store Overview"?"Move two low-performing displays into higher-value concepts.":`Reserve a front endcap for “${concepts[0][0]}.”`}</h2><p>{dept==="Store Overview"?"Seasonal and Grocery have the strongest near-term demand. Replacing two displays scoring below 65 could add an estimated $8,600 in four-week sales.":`The front placement is projected to deliver 18% more sales than a back endcap. Confirm inventory and set the display this week.`}</p></div><button>Review action plan →</button></section>
      </>}
      <footer><span>SWAS Planning · Concept prototype</span><span>Fictional store and performance data · July 2026</span></footer>
    </main>
  </div>
}

function Metric({label,value,sub,color}){return <div className={`metric ${color}`}><span>{label}</span><strong>{value}</strong><small>↗ {sub}</small></div>}

function PerformanceView({stores}){
 const storeCount=stores.length||1;
 const totalSales=stores.reduce((sum,store)=>sum+(188420*store.factor),0);
 const averageScore=Math.round(stores.reduce((sum,store)=>sum+store.score,0)/storeCount);
 const averageMargin=(stores.reduce((sum,store)=>sum+store.margin,0)/storeCount).toFixed(1);
 const marginOpportunity=stores.reduce((sum,store)=>sum+(28600*store.factor),0);
 const departments=[["Seasonal",94,24,32900],["Grocery",91,18,47200],["Electronics",88,13,25800],["Home",84,9,36100],["Automotive",82,7,24800],["Apparel",78,3,21600]];
 return <div className="performanceView">
   <section className="performanceSummary">
     <Metric label="Combined endcap sales" value={fmt(totalSales)} sub="+12.8% vs prior period" color="green"/>
     <Metric label="Combined score" value={`${averageScore}/100`} sub={`${storeCount} store${storeCount===1?"":"s"} measured`} color="violet"/>
     <Metric label="Average gross margin" value={`${averageMargin}%`} sub="+2.4 pts vs aisle average" color="amber"/>
     <Metric label="Margin opportunity" value={fmt(marginOpportunity)} sub="AI-ranked opportunities" color="blue"/>
   </section>
   <section className="performancePanels">
     <div className="performancePanel"><div className="performancePanelHead"><div><span className="eyebrow">STORE COMPARISON</span><h2>{storeCount===1?"Selected store performance":"Selected-store ranking"}</h2></div><small>Fictional 4-week results</small></div><div className="storePerformanceRows">{stores.map((store,index)=><div className="storePerformanceRow" key={store.id}><span className="storeRank">{index+1}</span><div><b>Store {store.id}</b><small>{store.name}</small></div><span><small>Sales</small><b>{fmt(188420*store.factor)}</b></span><span><small>Margin</small><b>{store.margin}%</b></span><strong>{store.score}</strong></div>)}</div></div>
     <div className="performancePanel"><div className="performancePanelHead"><div><span className="eyebrow">12-WEEK TREND</span><h2>Endcap score trend</h2></div><b className="trendUp">+8 pts</b></div><div className="trendChart">{[64,68,66,72,70,76,74,79,81,83,84,86].map((height,index)=><div key={index}><span style={{height:`${height}%`}}></span><small>{index%3===0?`W${index+1}`:""}</small></div>)}</div></div>
   </section>
   <section className="performancePanel departmentRanking"><div className="performancePanelHead"><div><span className="eyebrow">DEPARTMENT RANKING</span><h2>Where performance is strongest</h2></div><small>Score · trend · combined sales</small></div><div className="departmentPerformanceGrid">{departments.map(item=><div key={item[0]}><span><i>{DEPARTMENTS[item[0]].icon}</i><b>{item[0]}</b></span><div className="scoreTrack"><i style={{width:`${item[1]}%`}}></i></div><strong>{item[1]}</strong><em>+{item[2]}%</em><b>{fmt(item[3]*stores.reduce((sum,store)=>sum+store.factor,0))}</b></div>)}</div></section>
   <section className="performanceAction"><span>✦</span><div><small>AI PERFORMANCE INSIGHT</small><h2>Focus the next review on Apparel and Automotive.</h2><p>These departments have the largest gap to the top-performing areas and the clearest near-term margin opportunity.</p></div><b>{fmt(marginOpportunity*.34)} opportunity</b></section>
 </div>
}

function CalendarView({stores}){
 const [windowDays,setWindowDays]=useState(30);
 const events=[
   {day:28,month:"Jul",department:"Grocery",name:"Summer Hydration",type:"Set",window:30,color:"green"},
   {day:31,month:"Jul",department:"Automotive",name:"Road Trip Ready",type:"Set",window:30,color:"blue"},
   {day:4,month:"Aug",department:"Seasonal",name:"Back to School",type:"Arrival",window:30,color:"violet"},
   {day:11,month:"Aug",department:"Home",name:"Dorm Room Reset",type:"Set",window:30,color:"green"},
   {day:16,month:"Aug",department:"Grocery",name:"Summer Hydration",type:"Markdown",window:30,color:"amber"},
   {day:23,month:"Aug",department:"Grocery",name:"Summer Hydration",type:"End",window:30,color:"red"},
   {day:24,month:"Aug",department:"Apparel",name:"Back to Campus",type:"Set",window:60,color:"green"},
   {day:3,month:"Sep",department:"Electronics",name:"Dorm Tech",type:"Arrival",window:60,color:"violet"},
   {day:13,month:"Sep",department:"Seasonal",name:"Back to School",type:"Markdown",window:60,color:"amber"},
   {day:20,month:"Sep",department:"Seasonal",name:"Back to School",type:"End",window:60,color:"red"},
   {day:21,month:"Sep",department:"Home",name:"Fall Organization",type:"Set",window:90,color:"green"},
   {day:15,month:"Oct",department:"Automotive",name:"Winter Ready",type:"Arrival",window:90,color:"violet"},
 ];
 const visible=events.filter(event=>event.window<=windowDays);
 const weeks=[
   ["27","28","29","30","31","1","2"],
   ["3","4","5","6","7","8","9"],
   ["10","11","12","13","14","15","16"],
   ["17","18","19","20","21","22","23"],
   ["24","25","26","27","28","29","30"],
 ];
 const eventForDay=(day,index)=>events.find(event=>event.day===Number(day)&&((index===0&&Number(day)>=27)?event.month==="Jul":event.month==="Aug")&&event.window<=windowDays);
 return <div className="calendarView">
   <section className="calendarTopline"><div><span className="eyebrow">30 / 60 / 90 DAY VIEW</span><h2>Feature transition schedule</h2><p>{stores.length} selected store{stores.length===1?"":"s"} · Fictional planning data</p></div><div className="calendarTabs">{[30,60,90].map(days=><button key={days} className={windowDays===days?"active":""} onClick={()=>setWindowDays(days)}><b>{days}</b><small>days</small></button>)}</div></section>
   <section className="calendarStats"><div><small>Upcoming sets</small><b>{visible.filter(x=>x.type==="Set").length}</b><span>Ready to execute</span></div><div><small>Arrivals</small><b>{visible.filter(x=>x.type==="Arrival").length}</b><span>Inventory checkpoints</span></div><div><small>Markdowns</small><b>{visible.filter(x=>x.type==="Markdown").length}</b><span>Recovery actions</span></div><div><small>Ending features</small><b>{visible.filter(x=>x.type==="End").length}</b><span>Transitions required</span></div></section>
   <section className="calendarLayout">
     <div className="monthCalendar"><div className="monthHead"><button>‹</button><div><span className="eyebrow">PLANNING MONTH</span><h2>July–August 2026</h2></div><button>›</button></div><div className="weekdayRow">{["SUN","MON","TUE","WED","THU","FRI","SAT"].map(day=><span key={day}>{day}</span>)}</div><div className="calendarGrid">{weeks.flatMap((week,row)=>week.map((day,column)=>{const event=eventForDay(day,row);return <div className={`${row===0&&Number(day)>=27?"previous":""} ${event?"hasEvent":""}`} key={`${row}-${column}`}><b>{day}</b>{event&&<span className={event.color}><small>{event.type}</small>{event.department}</span>}</div>}))}</div></div>
     <div className="upcomingPanel"><div className="performancePanelHead"><div><span className="eyebrow">UPCOMING MILESTONES</span><h2>Next actions</h2></div><small>{windowDays}-day window</small></div><div className="milestoneList">{visible.slice(0,7).map((event,index)=><div key={`${event.month}-${event.day}-${event.name}`}><span className={`dateBadge ${event.color}`}><b>{event.day}</b><small>{event.month}</small></span><div><small>{event.department} · {event.type}</small><b>{event.name}</b></div><em>{index<2?"Due soon":"Planned"}</em></div>)}</div></div>
   </section>
   <section className="calendarSchedule"><div className="performancePanelHead"><div><span className="eyebrow">TRANSITION CONTROL</span><h2>Set, markdown, and end-date schedule</h2></div><button>+ Add milestone</button></div><div className="scheduleTable"><div className="scheduleRow scheduleHead"><span>Department</span><span>Feature</span><span>Milestone</span><span>Date</span><span>Status</span></div>{visible.map(event=><div className="scheduleRow" key={`row-${event.month}-${event.day}-${event.name}`}><span><i>{DEPARTMENTS[event.department].icon}</i>{event.department}</span><b>{event.name}</b><span>{event.type}</span><span>{event.month} {event.day}, 2026</span><em className={event.color}>{event.type==="Set"?"Ready":event.type==="Arrival"?"Confirmed":event.type==="Markdown"?"Scheduled":"Planned"}</em></div>)}</div></section>
 </div>
}

function StoreView({setDept,storeCount,storeScale,scoreOffset}){
 const rows=[["Seasonal","Backyard Ready",94,32900,"+24%"],["Grocery","Summer Hydration",91,47200,"+18%"],["Electronics","Travel Tech",88,25800,"+13%"],["Home","Patio Refresh",84,36100,"+9%"],["Automotive","Road Trip Ready",82,24800,"+7%"],["Apparel","Summer Essentials",78,21600,"+3%"]];
 return <section className="storeGrid"><div className="panel performance"><div className="panelHead"><div><span className="eyebrow">WHAT'S THERE NOW</span><h2>{storeCount>1?`${storeCount}-store department performance`:"Department endcap performance"}</h2></div><button>View all {64*storeCount} →</button></div><div className="table"><div className="tr th"><span>Department</span><span>Top display</span><span>Score</span><span>4-week sales</span><span>Trend</span></div>{rows.map(r=>{const score=Math.max(0,Math.min(100,r[2]+scoreOffset));return <button className="tr" key={r[0]} onClick={()=>setDept(r[0])}><span><i>{DEPARTMENTS[r[0]].icon}</i>{r[0]}</span><span>{r[1]}</span><span><b className={`score s${Math.floor(score/10)}`}>{score}</b></span><span>{fmt(r[3]*storeScale)}</span><span className="up">{r[4]}</span></button>})}</div></div>
 <div className="panel placement"><div className="panelHead"><div><span className="eyebrow">SPACE MIX</span><h2>Placement performance</h2></div></div><div className="donut"><div><strong>{64*storeCount}</strong><small>endcaps</small></div></div><div className="placeRow"><span><i className="front"/>Front endcaps</span><b>{34*storeCount}</b><em>$3,480 avg.</em></div><div className="placeRow"><span><i className="back"/>Back endcaps</span><b>{30*storeCount}</b><em>$2,740 avg.</em></div><div className="insight">Front placements are generating <b>27% more sales</b> per endcap.</div></div></section>
}

function DepartmentView({dept,count,adjust,assignments,prefill,assignEndcap}){
 const [open,setOpen]=useState(true);
 const sellers=TOP_SELLERS[dept]||[];
 const recommendations=CONCEPTS[dept]||[];
 const stackbaseItems=STACKBASE_ITEMS[dept]||sellers;
 const rollbackItems=ROLLBACK_ITEMS[dept]||[];
 return <><section className="departmentWorkspace">
   <div className={`planBox ${open?"open":""}`}>
     <button className="planBoxHead" onClick={()=>setOpen(!open)}><div><span className="eyebrow">DEPARTMENT SETUP</span><h2>{dept} department plan</h2><p>Click to {open?"hide":"open"} your front and back endcap map.</p></div><span className="expand">{open?"−":"+"}</span></button>
     {open&&<div className="endcapSections">
       <EndcapSection title="Front endcaps" side="front" count={count.front} assignments={assignments} recommendations={recommendations} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignEndcap} add={()=>adjust("front",1)} prefill={()=>prefill("front")} description="Highest visibility and customer traffic"/>
       <EndcapSection title="Back endcaps" side="back" count={count.back} assignments={assignments} recommendations={recommendations} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignEndcap} add={()=>adjust("back",1)} prefill={()=>prefill("back")} description="Destination traffic and aisle transitions"/>
       <EndcapSection title="Action-alley stackbases" side="stackbase" count={count.stackbases} assignments={assignments} recommendations={[]} sellers={stackbaseItems} rollbackItems={[]} assignEndcap={assignEndcap} add={()=>adjust("stackbases",1)} prefill={()=>prefill("stackbases")} description="Palletized and bulky seasonal merchandise"/>
     </div>}
   </div>
   <div className="topSellers">
     <div className="topSellersHead"><div><span className="eyebrow">PAST 2 YEARS + SEASON</span><h2>Top-selling {dept} items</h2></div><button onClick={()=>prefill("both")}>✦ Prefill all endcaps</button></div>
     <div className="sellerList">{sellers.map((x,i)=><div className="seller" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>{x[1]} sold · Est. retail {x[3]} · {x[4]}</small></div><strong>{x[2]}</strong></div>)}</div>
     <p className="prefillNote">Prefill ranks two years of fictional sales history and current seasonal relevance, then rotates endcap-appropriate items between front and back placements.</p>
     <div className="rollbackHead"><div><span className="eyebrow">ACTIVE ROLLBACKS</span><h2>Value-priced features</h2></div><button onClick={()=>prefill("rollbacks")}>↓ Prefill rollbacks</button></div>
     <div className="rollbackList">{rollbackItems.map((x,i)=><div className="rollbackItem" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>Was {x[1]} · Rollback {x[2]}</small></div><strong>{x[3]}</strong></div>)}</div>
     {dept==="Grocery"&&<div className="stackbaseRule"><span>▦</span><div><b>Action-alley stackbase rule</b><p>Bulky products such as bottled-water cases, charcoal, large pet food, and oversized paper goods are excluded from endcaps. Plan those as pallet stacks on stackbases in the action alley.</p></div></div>}
   </div>
 </section><CyclePlanner dept={dept} sellers={sellers}/></>
}

function EndcapSection({title,side,count,assignments,recommendations,sellers,rollbackItems,assignEndcap,add,prefill,description}){
 const [openSlot,setOpenSlot]=useState(null);
 const choose=(slot,value)=>{assignEndcap(slot,value);setOpenSlot(null)};
 return <div className={`endcapSection ${side}`}><div className="endcapTitle"><div><i /><span><b>{title}</b><small>{description}</small></span></div><div><button onClick={prefill}>Prefill</button><strong>{count}</strong></div></div><div className="endcapGrid">{Array.from({length:count},(_,i)=>{
   const slot=`${side}-${i}`;
   const value=assignments[slot]||"";
   const isOpen=openSlot===slot;
   return <div className={`endcapSlot ${value?"filled":""} ${isOpen?"menuOpen":""}`} key={slot}>
     <button className="slotTrigger" aria-expanded={isOpen} onClick={()=>setOpenSlot(isOpen?null:slot)}>
       <span>{side==="front"?"F":side==="back"?"B":"S"}{i+1}</span>
       <b>{value||`Open ${side==="stackbase"?"stackbase":"endcap"}`}</b>
       <small>{value?"✓ Feature saved":`Click to choose ${side==="stackbase"?"merchandise":"an AI feature"}`}</small>
       <em>{isOpen?"▲":"▼"}</em>
     </button>
     {isOpen&&<div className="featureMenu">
       <div className="menuLabel">✦ Two-year top sellers · seasonal fit</div>
       {sellers.map(x=><button className={value===x[0]?"selected":""} key={`seller-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>{x[1]} · {x[4]}</small></span><em>{x[3]}</em></button>)}
       {rollbackItems.length>0&&<><div className="menuLabel rollbackLabel">↓ Active rollbacks</div>{rollbackItems.map(x=><button className={value===x[0]?"selected":""} key={`rollback-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>Was {x[1]} · Rollback {x[2]}</small></span><em>{x[3]}</em></button>)}</>}
       {value&&<button className="clearFeature" onClick={()=>choose(slot,"")}>Clear this endcap</button>}
     </div>}
   </div>
 })}<button className="addEndcap" onClick={add}><span>+</span><b>Add endcap</b><small>Expand this section</small></button></div></div>
}

function CyclePlanner({dept,sellers}){
 const periods=[30,60,90];
 const defaults={
   30:{feature:"Current priority set",start:"2026-07-28",end:"2026-08-23",arrival:"2026-08-20",markdown:"2026-08-16",status:"Order now"},
   60:{feature:"Next seasonal transition",start:"2026-08-24",end:"2026-09-20",arrival:"2026-09-17",markdown:"2026-09-13",status:"Plan quantities"},
   90:{feature:"Upcoming feature window",start:"2026-09-21",end:"2026-10-18",arrival:"2026-10-15",markdown:"2026-10-11",status:"Forecast"},
 };
 const [active,setActive]=useState(30);
 const [plans,setPlans]=useState(defaults);
 const [orders,setOrders]=useState({});
 const plan=plans[active];
 const update=(key,value)=>setPlans(old=>({...old,[active]:{...old[active],[key]:value}}));
 const dateBack=(date,days)=>{if(!date)return"";const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()-days);return d.toISOString().slice(0,10)};
 const changeArrival=value=>setPlans(old=>({...old,[active]:{...old[active],arrival:value,markdown:dateBack(value,4),end:dateBack(value,1)}}));
 const generateOrder=()=>setOrders(old=>({...old,[active]:sellers.slice(0,4).map((x,i)=>({item:x[0],cases:Math.max(4,12-i*2),units:Math.max(24,72-i*12),reason:i===0?"Top annual seller + front placement":"Historical velocity + seasonal fit"}))}));
 const order=orders[active]||[];
 return <section className="cyclePlanner">
   <div className="cycleHead"><div><span className="eyebrow">30 / 60 / 90 DAY SWAS</span><h2>Plan each feature window</h2><p>Open a planning period, complete the set details, and let AI prepare the dates and suggested order.</p></div><div className="periodTabs">{periods.map(x=><button key={x} className={active===x?"active":""} onClick={()=>setActive(x)}><b>{x}</b><span>days</span><small>{plans[x].status}</small></button>)}</div></div>
   <div className="cycleBody">
     <div className="setForm"><div className="formTitle"><span><i>✦</i> AI-ASSISTED SET DETAILS</span><button onClick={()=>{changeArrival(plan.arrival);generateOrder()}}>Fill with AI</button></div>
       <label className="wide"><span>Feature or SWAS name</span><input value={plan.feature} onChange={e=>update("feature",e.target.value)}/></label>
       <label><span>Set date</span><input type="date" value={plan.start} onChange={e=>update("start",e.target.value)}/></label>
       <label><span>End date</span><input type="date" value={plan.end} onChange={e=>update("end",e.target.value)}/></label>
       <label><span>Next feature arrival</span><input type="date" value={plan.arrival} onChange={e=>changeArrival(e.target.value)}/><small>Drives end and markdown timing</small></label>
       <label><span>Markdown date</span><input type="date" value={plan.markdown} onChange={e=>update("markdown",e.target.value)}/><small>AI sets this 4 days before arrival</small></label>
       <div className="dateLogic wide"><span>↳</span><p><b>Transition logic:</b> Markdown begins {plan.markdown}, the current feature ends {plan.end}, and the next merchandise arrives {plan.arrival}. This creates one day to clear and reset the space.</p></div>
     </div>
     <div className="orderPanel"><div className="orderHead"><div><span className="eyebrow">SYSTEM ORDER DRAFT</span><h3>{active}-day item order</h3></div><button onClick={generateOrder}>✦ Generate order</button></div>
       {order.length?<><div className="orderRows">{order.map(x=><div className="orderRow" key={x.item}><div><b>{x.item}</b><small>{x.reason}</small></div><span>{x.cases} cases</span><strong>{x.units} units</strong></div>)}</div><div className="orderTotal"><span>Suggested order</span><b>{order.reduce((a,x)=>a+x.cases,0)} cases · {order.reduce((a,x)=>a+x.units,0)} units</b></div><button className="submitOrder">Send draft for approval →</button></>:<div className="emptyOrder"><span>▦</span><b>No order generated yet</b><p>AI will use annual item sales, placement, feature length, and expected sell-through to recommend quantities.</p><button onClick={generateOrder}>Generate suggested order</button></div>}
       <p className="systemNote">Prototype only: “Send” creates an approval-ready draft. A live order requires an authorized connection to the company replenishment system.</p>
     </div>
   </div>
 </section>
}

function Concept({item:x,rank,added,toggle,overview}){return <article className={added?"added":""}><div className="rank">0{rank}</div><div className="conceptTop"><span>▦</span><button onClick={toggle}>{added?"✓ In plan":"+ Add to plan"}</button></div>{overview&&<small>{x[5]?.toUpperCase()}</small>}<h3>{x[0]}</h3><p>{x[1]}</p><div className="why"><b>Why it works</b><span>Strong local momentum and complementary items with healthy margin.</span></div><div className="conceptStats"><div><small>4-WEEK SALES</small><b>{fmt(x[2])}</b></div><div><small>MARGIN</small><b>{x[3]}%</b></div><div><small>AI FIT</small><b>{x[4]}</b></div></div></article>}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
