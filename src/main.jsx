import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./department-plan.css";
import "./cycle-planner.css";
import "./store-lookup.css";
import "./performance-view.css";
import "./calendar-view.css";
import "./store-feature-plan.css";
import "./monthly-performance.css";
import "./action-plan.css";
import "./operational-upgrades.css";
import "./calendar-edit.css";
import "./advanced-insights.css";
import "./planning-workflow.css";

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

const DEPARTMENT_LETTERS = {
  "Grocery":"A",
  "Home":"H",
  "Seasonal":"L",
  "Automotive":"I",
  "Apparel":"C",
  "Electronics":"E",
};

const EVENT_OPTIONS = ["Back to School","Labor Day Weekend","Football Season","Halloween","Holiday Entertaining","Winter Readiness","Spring Refresh","Summer Kickoff"];
const AI_EVENT_RECOMMENDATIONS = {30:"Back to School",60:"Labor Day Weekend",90:"Halloween"};

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

function useDemoSavedState(key,initialValue){
  const getInitial=()=>typeof initialValue==="function"?initialValue():initialValue;
  const [value,setValue]=useState(()=>{
    try{
      const saved=window.localStorage.getItem(key);
      return saved===null?getInitial():JSON.parse(saved);
    }catch{return getInitial()}
  });
  useEffect(()=>{
    try{window.localStorage.setItem(key,JSON.stringify(value))}catch{}
  },[key,value]);
  return [value,setValue];
}

function App(){
  const [dept,setDept]=useState("Store Overview");
  const [counts,setCounts]=useDemoSavedState("swas-capacity-v1",()=>Object.fromEntries(Object.keys(DEPARTMENTS).filter(k=>k!=="Store Overview").map(k=>[k,{front:4,back:4,stackbases:4}])));
  const [placement,setPlacement]=useState("Front endcap");
  const [selected,setSelected]=useDemoSavedState("swas-concepts-v1",{});
  const [view,setView]=useState("Dashboard");
  const [actionPlanOpen,setActionPlanOpen]=useState(false);
  const [actionAccepted,setActionAccepted]=useState(false);
  const [storeMenuOpen,setStoreMenuOpen]=useState(false);
  const [selectedStores,setSelectedStores]=useDemoSavedState("swas-stores-v1",["2487"]);
  const [draftStores,setDraftStores]=useState(["2487"]);
  const [assignments,setAssignments]=useDemoSavedState("swas-assignments-v1",{});

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
      <header><div><span className="eyebrow">{storeLabel.toUpperCase()}</span><h1>{view==="Performance"?"Performance insights":view==="Calendar"?"SWAS planning calendar":dept==="Store Overview"?(multiStore?"Combined store endcap performance":"Total store endcap performance"):`${dept} endcap plan`}</h1><p>{view==="Performance"?`Track scores, sales, margin, and opportunities across ${multiStore?`${storeCount} selected stores`:"the selected store"}.`:view==="Calendar"?`Coordinate set dates, end dates, markdowns, and feature arrivals across ${multiStore?`${storeCount} selected stores`:"the selected store"}.`:dept==="Store Overview"?(multiStore?`One combined dashboard for ${storeCount} selected stores.`:"See what is live, what is working, and where the next margin opportunity is."):"Set your endcap capacity and build a department-specific seasonal plan."}</p></div><div className="headerActions"><span className="saveStatus">✓ Saved on this device</span><select aria-label="Choose department plan" value={dept} onChange={e=>{setDept(e.target.value);setView("Dashboard")}}>{Object.keys(DEPARTMENTS).map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>window.print()}>Export plan ↗</button></div></header>

      {view==="Performance"?<PerformanceView stores={activeStores}/>:view==="Calendar"?<CalendarView stores={activeStores}/>:<>
      <section className="statusBar"><span className="live">● {isStoreOverview?(multiStore?`LIVE ${storeCount}-STORE VIEW`:"LIVE TOTAL STORE VIEW"):`LIVE ${dept.toUpperCase()} VIEW`}</span><div><b>{scopedEndcaps}</b><small>{isStoreOverview?"All store endcaps":"Department endcaps"}</small></div><div><b>{scopedActiveStackbases}/{scopedStackbases}</b><small>Active stackbases</small></div><div><b>{scopedOpen}</b><small>Open endcaps</small></div><div><b>{scopedUtilization}%</b><small>Endcap utilization</small></div><p>{isStoreOverview?(multiStore?`${storeCount} locations combined`:"All departments combined"):`${dept} department only`} · Fictional live data</p></section>

      <section className="metrics">
        <Metric label="Endcap sales · 4 weeks" value={fmt(current.sales)} sub="+12.8% vs prior period" color="green"/>
        <Metric label="Margin opportunity" value={fmt(opportunity)} sub="from recommended concepts" color="blue"/>
        <Metric label="Performance score" value={`${current.score}/100`} sub={current.score>=90?"Top-performing area":"Healthy with upside"} color="violet"/>
        <Metric label="Average gross margin" value={`${current.margin}%`} sub="+2.4 pts vs aisle average" color="amber"/>
      </section>

      {dept==="Store Overview"?<><StoreView setDept={setDept} storeCount={storeCount} storeScale={storeScale} scoreOffset={averageStoreScore-86}/><RiskCenter setDept={setDept}/></>:<DepartmentView key={dept} dept={dept} count={counts[dept]} adjust={adjust} assignments={assignments[dept]||{}} prefill={prefill} assignEndcap={assignEndcap} storeScale={storeScale}/>}

      {dept==="Store Overview"?<StoreFeaturePlan counts={counts} storeCount={storeCount} setDept={setDept}/>:<><div className="sectionHead"><div><span className="eyebrow">AI-RANKED OPPORTUNITIES</span><h2>Recommended {dept} endcap concepts</h2></div><span>Ranked by demand · margin · seasonality</span></div><section className="concepts">{concepts.map((x,i)=>{const isAdded=(selected[dept]||[]).includes(x[0]);return <Concept key={x[0]} item={x} rank={i+1} added={isAdded} toggle={()=>toggle(x[0],dept)} overview={false}/>})}</section></>}

      <section className="action"><span>✦</span><div><small>{dept==="Store Overview"?"AI LEADERSHIP GUIDE":"AI NEXT BEST ACTION"}</small><h2>{dept==="Store Overview"?"Review the departments falling behind before opening individual action plans.":`Reserve a front endcap for “${concepts[0][0]}.”`}</h2><p>{dept==="Store Overview"?"Use the guide to identify planning gaps, inventory risks, missed dates, and departments that need follow-up. Actions are accepted inside each department plan.":`The front placement is projected to deliver 18% more sales than a back endcap. Confirm inventory and set the display this week.`}</p></div><button onClick={()=>setActionPlanOpen(true)}>{dept==="Store Overview"?"Open help guide →":actionAccepted?"Plan accepted ✓":"Review action plan →"}</button></section>
      </>}
      {actionPlanOpen&&<ActionPlan dept={dept} concept={concepts[0]?.[0]} accepted={actionAccepted} close={()=>setActionPlanOpen(false)} accept={()=>setActionAccepted(true)}/>}
      <footer><span>SWAS Planning · Concept prototype</span><span>Fictional store and performance data · July 2026</span></footer>
    </main>
  </div>
}

function Metric({label,value,sub,color}){return <div className={`metric ${color}`}><span>{label}</span><strong>{value}</strong><small>↗ {sub}</small></div>}

function ActionPlan({dept,concept,accepted,close,accept}){
 const overview=dept==="Store Overview";
 const steps=overview?[
   ["Find departments below plan","Start with low readiness, unassigned endcaps, and overdue milestones."],
   ["Check inventory exposure","Look for low weeks of supply, late arrivals, and projected excess merchandise."],
   ["Review transition timing","Compare set, arrival, markdown, and end dates for conflicts or missed work."],
   ["Open the department plan","Work with the team lead and accept actions from that department’s page."],
 ]:[
   ["Reserve placement",`Assign “${concept}” to the next available front endcap.`],
   ["Confirm the order","Validate forecasted units, case pack, and the planned arrival date."],
   ["Schedule the transition","Set the display date and schedule the outgoing feature’s markdown."],
   ["Measure results","Review sales, margin, and score after the first seven days."],
 ];
 return <div className="actionPlanOverlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)close()}}><section className="actionPlanModal" role="dialog" aria-modal="true" aria-labelledby="action-plan-title">
   <div className="actionPlanTop"><span>✦</span><div><small>{overview?"AI LEADERSHIP HELP GUIDE":"AI-GENERATED ACTION PLAN"}</small><h2 id="action-plan-title">{overview?"How to review departments falling behind":`${dept} feature action plan`}</h2><p>{overview?"This overview provides review guidance only. Open the department page to create and accept its action plan.":`Move “${concept}” from recommendation to a confirmed endcap set.`}</p></div><button aria-label="Close action plan" onClick={close}>×</button></div>
   <div className="actionPlanImpact"><div><small>{overview?"START WITH":"OWNER"}</small><b>{overview?"Apparel + Automotive":`${dept} team lead`}</b></div><div><small>{overview?"REVIEW WINDOW":"DUE DATE"}</small><b>{overview?"Next 7 days":"Within 7 days"}</b></div><div><small>{overview?"LOOK FOR":"ESTIMATED IMPACT"}</small><b>{overview?"Gaps, late inventory, missed dates":"+18% placement sales"}</b></div></div>
   <div className="actionSteps"><div className="actionStepsHead"><b>Recommended steps</b><span>{steps.length} actions</span></div>{steps.map((step,index)=><div key={step[0]}><span>{index+1}</span><div><b>{step[0]}</b><p>{step[1]}</p></div><em>{index===0?"Start now":"Next"}</em></div>)}</div>
   <div className="actionPlanNote"><span>i</span><p><b>Decision support only.</b> Confirm inventory, staffing, and local operating requirements before execution.</p></div>
   <div className="actionPlanButtons"><button onClick={close}>{overview?"Close guide":"Close"}</button>{!overview&&<button className="acceptPlan" disabled={accepted} onClick={accept}>{accepted?"Plan accepted ✓":"Accept action plan"}</button>}</div>
 </section></div>
}

function MonthlyPerformance({scope,scale=1}){
 const [metric,setMetric]=useState("sales");
 const [range,setRange]=useState(12);
 const months=["Aug 25","Sep 25","Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26","Apr 26","May 26","Jun 26","Jul 26"];
 const trend=[.78,.81,.84,.89,.96,.83,.80,.85,.91,.95,1.02,1.08];
 const scoreShift=[-8,-7,-6,-4,-2,-5,-6,-4,-3,-2,0,2];
 const marginShift=[-2.1,-1.8,-1.5,-.9,-.3,-1.2,-1.4,-.8,-.5,-.2,.3,.7];
 const base=scope==="Total Store"?DEPARTMENTS["Store Overview"]:DEPARTMENTS[scope];
 const data=months.map((month,index)=>({month,sales:Math.round(base.sales*trend[index]*scale),score:Math.max(0,Math.min(100,base.score+scoreShift[index])),margin:Number((base.margin+marginShift[index]).toFixed(1))}));
 const visible=data.slice(-range);
 const values=visible.map(item=>item[metric]);
 const maximum=Math.max(...values);
 const minimum=Math.min(...values);
 const latest=values[values.length-1];
 const first=values[0];
 const change=metric==="sales"?Math.round((latest-first)/first*100):Number((latest-first).toFixed(1));
 const format=value=>metric==="sales"?fmt(value):metric==="score"?`${Math.round(value)}/100`:`${Number(value).toFixed(1)}%`;
 return <section className="monthlyPerformance">
   <div className="monthlyPerformanceHead"><div><span className="eyebrow">MONTH-BY-MONTH HISTORY</span><h2>{scope} endcap performance</h2><p>Fictional results from the past year through the current month.</p></div><div className="historyFilters"><label><span>METRIC</span><select value={metric} onChange={event=>setMetric(event.target.value)}><option value="sales">Endcap sales</option><option value="score">Performance score</option><option value="margin">Gross margin</option></select></label><div><span>PERIOD</span><section>{[3,6,12].map(months=><button key={months} className={range===months?"active":""} onClick={()=>setRange(months)}>{months}M</button>)}</section></div></div></div>
   <div className="historySummary"><span><small>Current month</small><b>{format(latest)}</b></span><span><small>{range}-month change</small><b className={change>=0?"positive":"negative"}>{change>=0?"+":""}{change}{metric==="sales"?"%":metric==="score"?" pts":" pts"}</b></span><span><small>Period average</small><b>{format(values.reduce((sum,value)=>sum+value,0)/values.length)}</b></span><p><b>AI read:</b> {change>=0?"Performance is building into the current month. Keep high-scoring features funded and protect upcoming set dates.":"Performance softened during this period. Review placement, inventory, and feature timing."}</p></div>
   <div className="historyChart"><div className="chartScale"><span>{format(maximum)}</span><span>{format((maximum+minimum)/2)}</span><span>{format(minimum)}</span></div><div className="monthlyBars" style={{gridTemplateColumns:`repeat(${visible.length},1fr)`}}>{visible.map((item,index)=>{const value=item[metric];const height=minimum===maximum?70:25+((value-minimum)/(maximum-minimum))*70;return <div key={item.month} className="monthlyBar"><span className="barValue">{format(value)}</span><div><i style={{height:`${height}%`}} className={index===visible.length-1?"current":""}></i></div><small>{item.month}</small></div>})}</div></div>
 </section>
}

function StoreFeaturePlan({counts,storeCount,setDept}){
 const gaps={Grocery:2,Home:1,Seasonal:0,Automotive:2,Apparel:3,Electronics:1};
 const dates={Grocery:"Jul 28",Home:"Aug 11",Seasonal:"Aug 4",Automotive:"Jul 31",Apparel:"Aug 24",Electronics:"Sep 3"};
 const readiness={Grocery:86,Home:92,Seasonal:100,Automotive:78,Apparel:67,Electronics:89};
 const rows=Object.keys(counts).map(name=>{
   const capacity=(counts[name].front+counts[name].back)*storeCount;
   const open=gaps[name]*storeCount;
   return {name,capacity,open,planned:capacity-open,next:CONCEPTS[name][0][0],date:dates[name],readiness:readiness[name]};
 });
 const totalCapacity=rows.reduce((sum,row)=>sum+row.capacity,0);
 const totalPlanned=rows.reduce((sum,row)=>sum+row.planned,0);
 const totalOpen=rows.reduce((sum,row)=>sum+row.open,0);
 return <section className="storeFeaturePlan">
   <div className="featurePlanHead"><div><span className="eyebrow">TOTAL STORE FEATURE PLANNING</span><h2>Endcap plan coverage by department</h2><p>See what is assigned, where gaps remain, and which feature transitions are coming next.</p></div><div className="featurePlanTotals"><span><b>{totalPlanned}/{totalCapacity}</b><small>locations planned</small></span><span className={totalOpen?"attention":""}><b>{totalOpen}</b><small>open decisions</small></span><span><b>{Math.round(totalPlanned/totalCapacity*100)}%</b><small>plan coverage</small></span></div></div>
   <div className="featurePlanColumns"><span>Department</span><span>Plan coverage</span><span>Next feature</span><span>Next set</span><span>Readiness</span><span></span></div>
   <div className="featurePlanRows">{rows.map(row=><button key={row.name} onClick={()=>setDept(row.name)}><span className="featureDept"><i>{DEPARTMENTS[row.name].icon}</i><b>{row.name}</b><small>{row.capacity} endcaps</small></span><span className="coverageCell"><span><i style={{width:`${row.planned/row.capacity*100}%`}}></i></span><small>{row.planned} planned · {row.open} open</small></span><span className="nextFeature"><b>{row.next}</b><small>AI-aligned seasonal set</small></span><span className="setDate"><b>{row.date}</b><small>2026</small></span><span className={`readiness ${row.readiness<80?"risk":row.readiness===100?"ready":""}`}><b>{row.readiness}%</b><small>{row.readiness===100?"Ready":row.readiness<80?"Needs action":"On track"}</small></span><span className="rowArrow">→</span></button>)}</div>
   <div className="planningWindows"><div><span>30 DAYS</span><b>{rows.filter(row=>["Jul 28","Jul 31","Aug 4","Aug 11"].includes(row.date)).length} sets</b><small>Execution and order confirmation</small></div><div><span>60 DAYS</span><b>1 transition</b><small>Quantity and arrival planning</small></div><div><span>90 DAYS</span><b>1 forecast</b><small>Seasonal demand preparation</small></div><p><b>AI planning focus:</b> Assign Apparel’s three open locations and confirm Automotive inventory before July 31.</p></div>
 </section>
}

function RiskCenter({setDept}){
 const risks=[
   {level:"high",department:"Apparel",title:"3 endcaps still unassigned",detail:"The next feature window begins in 28 days.",action:"Assign locations"},
   {level:"high",department:"Automotive",title:"Arrival date is after planned set",detail:"Winter Ready inventory is projected two days late.",action:"Review timing"},
   {level:"medium",department:"Grocery",title:"Markdown date needs confirmation",detail:"Summer Hydration ends before the next inbound set.",action:"Confirm markdown"},
   {level:"medium",department:"Electronics",title:"Low weeks of supply",detail:"Power banks may fall below feature demand in 9 days.",action:"Review order"},
 ];
 return <section className="riskCenter"><div className="riskCenterHead"><div><span className="eyebrow">NOTIFICATIONS + RISK</span><h2>Feature planning attention center</h2><p>AI flags timing, inventory, and execution risks that could delay a set or reduce sales.</p></div><span className="riskCount"><b>{risks.length}</b><small>open alerts</small></span></div><div className="riskRows">{risks.map(risk=><button key={risk.title} onClick={()=>setDept(risk.department)}><span className={`riskLevel ${risk.level}`}>{risk.level==="high"?"!":"i"}</span><div><small>{risk.department} · {risk.level} priority</small><b>{risk.title}</b><p>{risk.detail}</p></div><em>{risk.action} →</em></button>)}</div></section>
}

function LeadershipSummary({stores,totalSales,averageScore,averageMargin,marginOpportunity}){
 const execution=Math.min(96,82+stores.length*2);
 return <section className="leadershipSummary">
   <div className="insightHeader"><div><span className="eyebrow">LEADERSHIP SUMMARY</span><h2>One-page feature planning readout</h2><p>Fictional executive view of execution, opportunity, and the actions that need leadership attention.</p></div><button onClick={()=>window.print()}>Export summary ↗</button></div>
   <div className="leadershipGrid">
     <div><small>Feature sales</small><b>{fmt(totalSales)}</b><span>+12.8% vs prior period</span></div>
     <div><small>Plan execution</small><b>{execution}%</b><span>{Math.max(2,9-stores.length)} gaps need follow-up</span></div>
     <div><small>Combined health</small><b>{averageScore}/100</b><span>{averageMargin}% average margin</span></div>
     <div><small>Margin opportunity</small><b>{fmt(marginOpportunity)}</b><span>AI-ranked next actions</span></div>
   </div>
   <div className="executiveActions">
     <div><i>1</i><span><b>Close Apparel planning gaps</b><small>Assign open locations before the next feature window.</small></span></div>
     <div><i>2</i><span><b>Protect Automotive timing</b><small>Resolve the inventory arrival risk before July 31.</small></span></div>
     <div><i>3</i><span><b>Scale Seasonal’s playbook</b><small>Reuse its placement and inventory depth in comparable stores.</small></span></div>
   </div>
 </section>
}

function MultiStoreOpportunities({stores}){
 const [copied,setCopied]=useState({});
 const ideas=[
   {feature:"Summer Hydration",best:stores.reduce((a,b)=>a.score>b.score?a:b),lift:18,action:"Copy front placement and four-week inventory depth"},
   {feature:"Road Trip Ready",best:stores.reduce((a,b)=>a.margin>b.margin?a:b),lift:12,action:"Match attachment mix and arrival lead time"},
   {feature:"Dorm Room Reset",best:stores.reduce((a,b)=>a.factor>b.factor?a:b),lift:9,action:"Reuse the winning four-item assortment"},
 ];
 return <section className="multiStoreOpportunities">
   <div className="insightHeader"><div><span className="eyebrow">MULTI-STORE OPPORTUNITY</span><h2>Turn comparisons into repeatable actions</h2><p>Find the strongest setup among selected stores and copy the playbook to locations with the largest gap.</p></div><span>{stores.length} stores compared</span></div>
   <div className="compareGrid">{ideas.map((idea,index)=><div className="compareCard" key={idea.feature}>
     <div className="compareCardHead"><div><small>WINNING FEATURE</small><h3>{idea.feature}</h3></div><span>+{idea.lift}%</span></div>
     <div className="compareStore"><span><small>Best example</small><b>Store {idea.best.id}</b></span><span><small>Score</small><b>{idea.best.score}</b></span></div>
     <div className="compareRecommendation">{idea.action}. Start with Store {stores[(index+1)%stores.length].id}, which has the clearest performance gap.</div>
     <button className={copied[idea.feature]?"copied":""} onClick={()=>setCopied(old=>({...old,[idea.feature]:true}))}>{copied[idea.feature]?"Added to comparison plan ✓":"Copy winning setup"}</button>
   </div>)}</div>
 </section>
}

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
   <LeadershipSummary stores={stores} totalSales={totalSales} averageScore={averageScore} averageMargin={averageMargin} marginOpportunity={marginOpportunity}/>
   <MonthlyPerformance scope="Total Store" scale={stores.reduce((sum,store)=>sum+store.factor,0)||1}/>
   {stores.length>1&&<MultiStoreOpportunities stores={stores}/>}
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
 const initialEvents=[
   {id:1,date:"2026-07-28",day:28,month:"Jul",department:"Grocery",name:"Summer Hydration",type:"Set",window:30,color:"green"},
   {id:2,date:"2026-07-31",day:31,month:"Jul",department:"Automotive",name:"Road Trip Ready",type:"Set",window:30,color:"blue"},
   {id:3,date:"2026-08-04",day:4,month:"Aug",department:"Seasonal",name:"Back to School",type:"Arrival",window:30,color:"violet"},
   {id:4,date:"2026-08-11",day:11,month:"Aug",department:"Home",name:"Dorm Room Reset",type:"Set",window:30,color:"green"},
   {id:5,date:"2026-08-16",day:16,month:"Aug",department:"Grocery",name:"Summer Hydration",type:"Markdown",window:30,color:"amber"},
   {id:6,date:"2026-08-23",day:23,month:"Aug",department:"Grocery",name:"Summer Hydration",type:"End",window:30,color:"red"},
   {id:7,date:"2026-08-24",day:24,month:"Aug",department:"Apparel",name:"Back to Campus",type:"Set",window:60,color:"green"},
   {id:8,date:"2026-09-03",day:3,month:"Sep",department:"Electronics",name:"Dorm Tech",type:"Arrival",window:60,color:"violet"},
   {id:9,date:"2026-09-13",day:13,month:"Sep",department:"Seasonal",name:"Back to School",type:"Markdown",window:60,color:"amber"},
   {id:10,date:"2026-09-20",day:20,month:"Sep",department:"Seasonal",name:"Back to School",type:"End",window:60,color:"red"},
   {id:11,date:"2026-09-21",day:21,month:"Sep",department:"Home",name:"Fall Organization",type:"Set",window:90,color:"green"},
   {id:12,date:"2026-10-15",day:15,month:"Oct",department:"Automotive",name:"Winter Ready",type:"Arrival",window:90,color:"violet"},
 ];
 const [events,setEvents]=useDemoSavedState("swas-calendar-events-v1",initialEvents);
 const [editingEvent,setEditingEvent]=useState(null);
 const saveEvent=draft=>{const date=new Date(`${draft.date}T12:00:00`);const month=date.toLocaleString("en-US",{month:"short"});const color={Set:"green",Arrival:"violet",Markdown:"amber",End:"red"}[draft.type]||"blue";const saved={...draft,id:draft.id==="new"?Date.now():draft.id,day:date.getDate(),month,color,window:Number(draft.window)};setEvents(old=>draft.id==="new"?[...old,saved]:old.map(event=>event.id===draft.id?saved:event));setEditingEvent(null)};
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
   <section className="calendarSchedule"><div className="performancePanelHead"><div><span className="eyebrow">TRANSITION CONTROL</span><h2>Set, markdown, and end-date schedule</h2></div><button onClick={()=>setEditingEvent({id:"new",date:"2026-08-01",department:"Grocery",name:"New feature",type:"Set",window:30})}>+ Add milestone</button></div><div className="scheduleTable"><div className="scheduleRow scheduleHead"><span>Department</span><span>Feature</span><span>Milestone</span><span>Date</span><span>Status</span></div>{visible.map(event=><div className="scheduleRow" key={event.id}><span><i>{DEPARTMENTS[event.department].icon}</i>{event.department}</span><b>{event.name}</b><span>{event.type}</span><span>{event.month} {event.day}, 2026</span><span className="calendarRowActions"><em className={event.color}>{event.type==="Set"?"Ready":event.type==="Arrival"?"Confirmed":event.type==="Markdown"?"Scheduled":"Planned"}</em><button onClick={()=>setEditingEvent(event)}>Edit</button></span></div>)}</div></section>
   {editingEvent&&<CalendarEventEditor event={editingEvent} save={saveEvent} remove={()=>{if(editingEvent.id!=="new")setEvents(old=>old.filter(event=>event.id!==editingEvent.id));setEditingEvent(null)}} close={()=>setEditingEvent(null)}/>}
 </div>
}

function CalendarEventEditor({event,save,remove,close}){
 const [draft,setDraft]=useState(event);
 const update=(key,value)=>setDraft(old=>({...old,[key]:value}));
 return <div className="calendarEditorOverlay"><section className="calendarEditor" role="dialog" aria-modal="true"><div className="calendarEditorHead"><div><span className="eyebrow">EDITABLE CALENDAR</span><h2>{event.id==="new"?"Add milestone":"Edit milestone"}</h2></div><button onClick={close}>×</button></div><div className="calendarEditorForm"><label className="wide"><span>Feature name</span><input value={draft.name} onChange={e=>update("name",e.target.value)}/></label><label><span>Department</span><select value={draft.department} onChange={e=>update("department",e.target.value)}>{Object.keys(DEPARTMENTS).filter(name=>name!=="Store Overview").map(name=><option key={name}>{name}</option>)}</select></label><label><span>Milestone type</span><select value={draft.type} onChange={e=>update("type",e.target.value)}>{["Set","Arrival","Markdown","End"].map(type=><option key={type}>{type}</option>)}</select></label><label><span>Date</span><input type="date" value={draft.date} onChange={e=>update("date",e.target.value)}/></label><label><span>Planning window</span><select value={draft.window} onChange={e=>update("window",e.target.value)}>{[30,60,90].map(days=><option key={days} value={days}>{days} days</option>)}</select></label></div><div className="calendarEditorButtons"><button className="deleteEvent" onClick={remove}>{event.id==="new"?"Cancel":"Delete"}</button><span/><button onClick={close}>Close</button><button className="saveEvent" onClick={()=>save(draft)}>Save milestone</button></div></section></div>
}

function StoreView({setDept,storeCount,storeScale,scoreOffset}){
 const rows=[["Seasonal","Backyard Ready",94,32900,"+24%"],["Grocery","Summer Hydration",91,47200,"+18%"],["Electronics","Travel Tech",88,25800,"+13%"],["Home","Patio Refresh",84,36100,"+9%"],["Automotive","Road Trip Ready",82,24800,"+7%"],["Apparel","Summer Essentials",78,21600,"+3%"]];
 return <section className="storeGrid"><div className="panel performance"><div className="panelHead"><div><span className="eyebrow">WHAT'S THERE NOW</span><h2>{storeCount>1?`${storeCount}-store department performance`:"Department endcap performance"}</h2></div><button>View all {64*storeCount} →</button></div><div className="table"><div className="tr th"><span>Department</span><span>Top display</span><span>Score</span><span>4-week sales</span><span>Trend</span></div>{rows.map(r=>{const score=Math.max(0,Math.min(100,r[2]+scoreOffset));return <button className="tr" key={r[0]} onClick={()=>setDept(r[0])}><span><i>{DEPARTMENTS[r[0]].icon}</i>{r[0]}</span><span>{r[1]}</span><span><b className={`score s${Math.floor(score/10)}`}>{score}</b></span><span>{fmt(r[3]*storeScale)}</span><span className="up">{r[4]}</span></button>})}</div></div>
 <div className="panel placement"><div className="panelHead"><div><span className="eyebrow">SPACE MIX</span><h2>Placement performance</h2></div></div><div className="donut"><div><strong>{64*storeCount}</strong><small>endcaps</small></div></div><div className="placeRow"><span><i className="front"/>Front endcaps</span><b>{34*storeCount}</b><em>$3,480 avg.</em></div><div className="placeRow"><span><i className="back"/>Back endcaps</span><b>{30*storeCount}</b><em>$2,740 avg.</em></div><div className="insight">Front placements are generating <b>27% more sales</b> per endcap.</div></div></section>
}

function LegacyDepartmentView({dept,count,adjust,assignments,prefill,assignEndcap,storeScale}){
 const [open,setOpen]=useState(true);
 const [statuses,setStatuses]=useDemoSavedState(`swas-statuses-${dept}-v1`,{});
 const sellers=TOP_SELLERS[dept]||[];
 const recommendations=CONCEPTS[dept]||[];
 const stackbaseItems=STACKBASE_ITEMS[dept]||sellers;
 const rollbackItems=ROLLBACK_ITEMS[dept]||[];
 return <><section className="departmentWorkspace">
   <div className={`planBox ${open?"open":""}`}>
     <button className="planBoxHead" onClick={()=>setOpen(!open)}><div><span className="eyebrow">DEPARTMENT SETUP</span><h2>{dept} department plan</h2><p>Click to {open?"hide":"open"} your front and back endcap map.</p></div><span className="expand">{open?"−":"+"}</span></button>
     {open&&<div className="endcapSections">
       <EndcapSection title="Front endcaps" side="front" count={count.front} assignments={assignments} recommendations={recommendations} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignEndcap} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("front",1)} prefill={()=>prefill("front")} description="Highest visibility and customer traffic"/>
       <EndcapSection title="Back endcaps" side="back" count={count.back} assignments={assignments} recommendations={recommendations} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignEndcap} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("back",1)} prefill={()=>prefill("back")} description="Destination traffic and aisle transitions"/>
       <EndcapSection title="Action-alley stackbases" side="stackbase" count={count.stackbases} assignments={assignments} recommendations={[]} sellers={stackbaseItems} rollbackItems={[]} assignEndcap={assignEndcap} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("stackbases",1)} prefill={()=>prefill("stackbases")} description="Palletized and bulky seasonal merchandise"/>
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
 </section><FeaturePerformance dept={dept} sellers={sellers} assignments={assignments}/><OrderingIntelligence dept={dept} sellers={sellers} assignments={assignments}/><MonthlyPerformance scope={dept} scale={storeScale}/><CyclePlanner dept={dept} sellers={sellers}/></>
}

function LegacyEndcapSection({title,side,count,assignments,recommendations,sellers,rollbackItems,assignEndcap,statuses,setStatus,add,prefill,description}){
 const [openSlot,setOpenSlot]=useState(null);
 const choose=(slot,value)=>{assignEndcap(slot,value);setOpenSlot(null)};
 return <div className={`endcapSection ${side}`}><div className="endcapTitle"><div><i /><span><b>{title}</b><small>{description}</small></span></div><div><button onClick={prefill}>Prefill</button><strong>{count}</strong></div></div><div className="endcapGrid">{Array.from({length:count},(_,i)=>{
   const slot=`${side}-${i}`;
   const value=assignments[slot]||"";
   const status=statuses[slot]||(value?"Planned":"Open");
   const isOpen=openSlot===slot;
   return <div className={`endcapSlot ${value?"filled":""} ${isOpen?"menuOpen":""}`} key={slot}>
     <button className="slotTrigger" aria-expanded={isOpen} onClick={()=>setOpenSlot(isOpen?null:slot)}>
       <span>{side==="front"?"F":side==="back"?"B":"S"}{i+1}</span>
       <b>{value||`Open ${side==="stackbase"?"stackbase":"endcap"}`}</b>
       <small>{value?"✓ Feature saved":`Click to choose ${side==="stackbase"?"merchandise":"an AI feature"}`}</small>
       <em>{isOpen?"▲":"▼"}</em>
     </button>
     <div className={`slotStatus status-${status.toLowerCase().replaceAll(" ","-")}`}><label>Plan status</label><select value={status} onChange={event=>setStatus(slot,event.target.value)}>{["Open","Recommended","Awaiting inventory","Ordered","Ready to set","Active","Markdown scheduled","Ending soon","Completed"].map(option=><option key={option}>{option}</option>)}</select></div>
     {isOpen&&<div className="featureMenu">
       <div className="menuLabel">✦ Two-year top sellers · seasonal fit</div>
       {sellers.map(x=><button className={value===x[0]?"selected":""} key={`seller-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>{x[1]} · {x[4]}</small></span><em>{x[3]}</em></button>)}
       {rollbackItems.length>0&&<><div className="menuLabel rollbackLabel">↓ Active rollbacks</div>{rollbackItems.map(x=><button className={value===x[0]?"selected":""} key={`rollback-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>Was {x[1]} · Rollback {x[2]}</small></span><em>{x[3]}</em></button>)}</>}
       {value&&<button className="clearFeature" onClick={()=>choose(slot,"")}>Clear this endcap</button>}
     </div>}
   </div>
 })}<button className="addEndcap" onClick={add}><span>+</span><b>Add endcap</b><small>Expand this section</small></button></div></div>
}

function DepartmentView({dept,count,adjust,assignments,prefill,assignEndcap,storeScale}){
 const [open,setOpen]=useState(true);
 const [statuses,setStatuses]=useDemoSavedState(`swas-statuses-${dept}-v2`,{});
 const [userChosenSlots,setUserChosenSlots]=useDemoSavedState(`swas-user-chosen-${dept}-v1`,{});
 const [corporateSlots,setCorporateSlots]=useDemoSavedState(`swas-ho-slots-${dept}-v1`,{
   "front-0":{feature:`${dept} H.O. seasonal feature`,program:"Home Office SWAS"}
 });
 const [eventPlans,setEventPlans]=useDemoSavedState(`swas-events-${dept}-v1`,AI_EVENT_RECOMMENDATIONS);
 const [activeEventWindow,setActiveEventWindow]=useState(30);
 const sellers=TOP_SELLERS[dept]||[];
 const recommendations=CONCEPTS[dept]||[];
 const stackbaseItems=STACKBASE_ITEMS[dept]||sellers;
 const rollbackItems=ROLLBACK_ITEMS[dept]||[];
 const departmentLetter=DEPARTMENT_LETTERS[dept]||dept.slice(0,1);
 const endcapSlots=[...Array.from({length:count.front},(_,i)=>`front-${i}`),...Array.from({length:count.back},(_,i)=>`back-${i}`)];
 const allFeatureSlots=[...endcapSlots,...Array.from({length:count.stackbases},(_,i)=>`stackbase-${i}`)];
 const plannedCount=endcapSlots.filter(slot=>assignments[slot]||corporateSlots[slot]).length;
 const allEndcapsPlanned=plannedCount===endcapSlots.length;
 const markAssignedPending=side=>setStatuses(old=>{
   const next={...old};
   endcapSlots.filter(slot=>side==="both"||slot.startsWith(`${side}-`)).forEach(slot=>{
     if(corporateSlots[slot])next[slot]="H.O. planned";
     else next[slot]="Pending";
   });
   return next;
 });
 const prefillWithStatus=where=>{
   if(["front","back","both"].includes(where)){
     const event=eventPlans[activeEventWindow];
     const terms={
       "Back to School":["back to school","dorm","school"],
       "Labor Day Weekend":["grilling","cookout","summer"],
       "Football Season":["snack","game","tailgate"],
       "Halloween":["seasonal","party","fall"],
       "Holiday Entertaining":["organization","gift","entertaining"],
       "Winter Readiness":["emergency","winter","travel"],
       "Spring Refresh":["organization","clean","spring"],
       "Summer Kickoff":["summer","pool","road trip","grilling"],
     }[event]||[];
     const ranked=[...sellers].sort((a,b)=>{
       const score=item=>(terms.some(term=>item[4].toLowerCase().includes(term))?100:0)+(sellers.length-sellers.indexOf(item))*8+Number(item[3].replace(/[^0-9.]/g,""))/5;
       return score(b)-score(a);
     });
     const fillSide=(side,total,offset)=>Array.from({length:total},(_,i)=>`${side}-${i}`).forEach((slot,i)=>{
       if(!corporateSlots[slot])assignEndcap(slot,ranked[(i+offset)%ranked.length]?.[0]||"Open");
     });
     if(where==="front"||where==="both")fillSide("front",count.front,0);
     if(where==="back"||where==="both")fillSide("back",count.back,Math.min(3,ranked.length-1));
   }else prefill(where);
   setUserChosenSlots(old=>{
     const next={...old};
     const sides=where==="both"||where==="rollbacks"?["front","back"]:[where==="stackbases"?"stackbase":where];
     Object.keys(next).forEach(slot=>{if(sides.some(side=>slot.startsWith(`${side}-`)))delete next[slot]});
     return next;
   });
   markAssignedPending(where==="rollbacks"?"both":where);
 };
 const assignWithStatus=(slot,value)=>{
   assignEndcap(slot,value);
   setUserChosenSlots(old=>({...old,[slot]:Boolean(value)}));
   setStatuses(old=>({...old,[slot]:value?"Pending":"Open"}));
 };
 const moveCorporate=(from,to)=>setCorporateSlots(old=>{
   if(from===to)return old;
   const next={...old,[to]:old[from]};
   delete next[from];
   return next;
 });
 const moveFeature=(from,to)=>{
   if(from===to||corporateSlots[to])return;
   const fromValue=assignments[from]||"",toValue=assignments[to]||"";
   assignEndcap(to,fromValue);
   assignEndcap(from,toValue);
   setStatuses(old=>({...old,[to]:old[from]||(fromValue?"Pending":"Open"),[from]:old[to]||(toValue?"Pending":"Open")}));
   setUserChosenSlots(old=>({...old,[to]:Boolean(old[from]),[from]:Boolean(old[to])}));
 };
 const advanceStatuses=stage=>setStatuses(old=>{
   const next={...old};
   endcapSlots.forEach(slot=>{
     if(corporateSlots[slot])next[slot]="H.O. planned";
     else if(assignments[slot])next[slot]=stage;
   });
   return next;
 });
 return <><EventPlanningBox dept={dept} eventPlans={eventPlans} setEventPlans={setEventPlans} activeWindow={activeEventWindow} setActiveWindow={setActiveEventWindow}/><section className="departmentWorkspace">
   <div className={`planBox ${open?"open":""}`}>
     <button className="planBoxHead" onClick={()=>setOpen(!open)}><div><span className="eyebrow">DEPARTMENT SETUP</span><h2><i className="departmentLetter">{departmentLetter}</i>{dept} department plan</h2><p>{plannedCount}/{endcapSlots.length} endcaps assigned · Click to {open?"hide":"open"} the location map.</p></div><span className="expand">{open?"−":"+"}</span></button>
     {open&&<div className="endcapSections">
       <EndcapSection title="Front endcaps" side="front" count={count.front} assignments={assignments} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignWithStatus} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("front",1)} prefill={()=>prefillWithStatus("front")} description="Highest visibility and customer traffic" corporateSlots={corporateSlots} moveCorporate={moveCorporate} availableSlots={endcapSlots} userChosenSlots={userChosenSlots} moveFeature={moveFeature} featureSlots={allFeatureSlots.filter(slot=>!corporateSlots[slot])}/>
       <EndcapSection title="Back endcaps" side="back" count={count.back} assignments={assignments} sellers={sellers} rollbackItems={rollbackItems} assignEndcap={assignWithStatus} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("back",1)} prefill={()=>prefillWithStatus("back")} description="Destination traffic and aisle transitions" corporateSlots={corporateSlots} moveCorporate={moveCorporate} availableSlots={endcapSlots} userChosenSlots={userChosenSlots} moveFeature={moveFeature} featureSlots={allFeatureSlots.filter(slot=>!corporateSlots[slot])}/>
       <EndcapSection title="Action-alley stackbases" side="stackbase" count={count.stackbases} assignments={assignments} sellers={stackbaseItems} rollbackItems={[]} assignEndcap={assignWithStatus} statuses={statuses} setStatus={(slot,status)=>setStatuses(old=>({...old,[slot]:status}))} add={()=>adjust("stackbases",1)} prefill={()=>prefillWithStatus("stackbases")} description="Palletized and bulky seasonal merchandise" corporateSlots={{}} moveCorporate={()=>{}} availableSlots={[]} userChosenSlots={userChosenSlots} moveFeature={moveFeature} featureSlots={allFeatureSlots.filter(slot=>!corporateSlots[slot])}/>
     </div>}
   </div>
   <div className="topSellers">
     <div className="topSellersHead"><div><span className="eyebrow">PAST 2 YEARS + SEASON</span><h2>Top-selling {dept} items</h2></div><button onClick={()=>prefillWithStatus("both")}>✦ Prefill {eventPlans[activeEventWindow]} theme</button></div>
     <div className="sellerList">{sellers.map((x,i)=><div className="seller" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>{x[1]} sold · Est. retail {x[3]} · {x[4]}</small></div><strong>{x[2]}</strong></div>)}</div>
     <p className="prefillNote">Prefilled or manually selected features begin as Pending until the department plan is complete and its merchandise order is approved.</p>
     <div className="rollbackHead"><div><span className="eyebrow">ACTIVE ROLLBACKS</span><h2>Value-priced features</h2></div><button onClick={()=>prefillWithStatus("rollbacks")}>↓ Prefill rollbacks</button></div>
     <div className="rollbackList">{rollbackItems.map((x,i)=><div className="rollbackItem" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>Was {x[1]} · Rollback {x[2]}</small></div><strong>{x[3]}</strong></div>)}</div>
     {dept==="Grocery"&&<div className="stackbaseRule"><span>◇</span><div><b>Action-alley stackbase rule</b><p>Bulky products such as bottled-water cases, charcoal, large pet food, and oversized paper goods are excluded from endcaps.</p></div></div>}
   </div>
 </section><FeaturePerformance dept={dept} sellers={sellers} assignments={assignments}/><OrderingIntelligence dept={dept} sellers={sellers} assignments={assignments} allEndcapsPlanned={allEndcapsPlanned} plannedCount={plannedCount} totalEndcaps={endcapSlots.length} onWorkflowStage={advanceStatuses}/><MonthlyPerformance scope={dept} scale={storeScale}/><CyclePlanner dept={dept} sellers={sellers} eventPlans={eventPlans}/></>
}

function EventPlanningBox({dept,eventPlans,setEventPlans,activeWindow,setActiveWindow}){
 const event=eventPlans[activeWindow];
 return <section className="eventPlanningBox"><div className="eventPlanIntro"><span className="eyebrow">UPCOMING EVENTS + HOLIDAYS</span><h2>Plan themes around what customers will shop next</h2><p>AI combines two years of seasonal sales, estimated margin, and the timing of upcoming events.</p></div><div className="eventWindowTabs">{[30,60,90].map(days=><button className={activeWindow===days?"active":""} key={days} onClick={()=>setActiveWindow(days)}><b>{days}</b><span>days</span><small>{eventPlans[days]}</small></button>)}</div><div className="eventChoice"><label><span>{activeWindow}-day event</span><select value={event} onChange={e=>setEventPlans(old=>({...old,[activeWindow]:e.target.value}))}>{EVENT_OPTIONS.map(option=><option key={option}>{option}</option>)}</select></label><button onClick={()=>setEventPlans(old=>({...old,[activeWindow]:AI_EVENT_RECOMMENDATIONS[activeWindow]}))}>✦ Use AI recommendation</button><div><small>AI THEME FOR {dept.toUpperCase()}</small><b>{event}</b><span>Prioritize high-velocity items with strong seasonal fit and margin.</span></div></div></section>
}

function EndcapSection({title,side,count,assignments,sellers,rollbackItems,assignEndcap,statuses,setStatus,add,prefill,description,corporateSlots,moveCorporate,availableSlots,userChosenSlots,moveFeature,featureSlots}){
 const [openSlot,setOpenSlot]=useState(null);
 const choose=(slot,value)=>{assignEndcap(slot,value);setOpenSlot(null)};
 const locationLabel=slot=>`${slot.startsWith("front")?"F":slot.startsWith("back")?"B":"SB"}${Number(slot.split("-")[1])+1}`;
 return <div className={`endcapSection ${side}`}><div className="endcapTitle"><div><i/><span><b>{title}</b><small>{description}</small></span></div><div><button onClick={prefill}>Prefill</button><strong>{count}</strong></div></div><div className="endcapGrid">{Array.from({length:count},(_,i)=>{
   const slot=`${side}-${i}`;
   const corporate=corporateSlots[slot];
   const value=corporate?.feature||assignments[slot]||"";
   const isRollback=Object.values(ROLLBACK_ITEMS).flat().some(item=>item[0]===value);
   const colorClass=corporate?"corporateSlot":isRollback?"rollbackSlot":userChosenSlots[slot]?"userChosenSlot":value?"topSellerSlot":"";
   const status=corporate?"H.O. planned":(statuses[slot]||(value?"Pending":"Open"));
   const isOpen=openSlot===slot;
   return <div className={`endcapSlot ${value?"filled":""} ${isOpen?"menuOpen":""} ${colorClass}`} key={slot}>
     <button className="slotTrigger" aria-expanded={isOpen} onClick={()=>{if(!corporate)setOpenSlot(isOpen?null:slot)}}>
       <span>{locationLabel(slot)}</span><b>{value||`Open ${side==="stackbase"?"stackbase":"endcap"}`}</b>
       <small>{corporate?"Home Office-directed · location can be moved":value?"Feature selected · order pending":`Click to choose ${side==="stackbase"?"merchandise":"an AI feature"}`}</small>
       {!corporate&&<em>{isOpen?"▲":"▼"}</em>}
     </button>
     {corporate?<div className="corporateControl"><span>H.O. planned</span><label>Move to <select value={slot} onChange={event=>moveCorporate(slot,event.target.value)}>{availableSlots.map(location=><option key={location} value={location}>{locationLabel(location)}</option>)}</select></label></div>:<div className="featureControls"><div className={`slotStatus status-${status.toLowerCase().replaceAll(" ","-")}`}><label>Plan status</label><select value={status} onChange={event=>setStatus(slot,event.target.value)}>{["Open","Pending","Planned","In transit","Freight received","Ready to set","Active","Markdown scheduled","Ending soon","Completed"].map(option=><option key={option}>{option}</option>)}</select></div>{value&&<label className="moveFeature">Move to <select value={slot} onChange={event=>moveFeature(slot,event.target.value)}>{featureSlots.map(location=><option key={location} value={location}>{locationLabel(location)}</option>)}</select></label>}</div>}
     {isOpen&&!corporate&&<div className="featureMenu"><div className="menuLabel">✦ Two-year top sellers · seasonal fit</div>
       {sellers.map(x=><button className={value===x[0]?"selected":""} key={`seller-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>{x[1]} · {x[4]}</small></span><em>{x[3]}</em></button>)}
       {rollbackItems.length>0&&<><div className="menuLabel rollbackLabel">↓ Active rollbacks</div>{rollbackItems.map(x=><button className={value===x[0]?"selected":""} key={`rollback-${x[0]}`} onClick={()=>choose(slot,x[0])}><span><b>{x[0]}</b><small>Was {x[1]} · Rollback {x[2]}</small></span><em>{x[3]}</em></button>)}</>}
       {value&&<button className="clearFeature" onClick={()=>choose(slot,"")}>Clear this endcap</button>}
     </div>}
   </div>
 })}<button className="addEndcap" onClick={add}><span>+</span><b>Add location</b><small>Expand this section</small></button></div></div>
}

function FeaturePerformance({dept,sellers,assignments}){
 const features=[...new Set([...Object.values(assignments).filter(Boolean),...sellers.map(item=>item[0])])].slice(0,8);
 const [selectedFeature,setSelectedFeature]=useState(features[0]||"No feature assigned");
 useEffect(()=>{if(!features.includes(selectedFeature))setSelectedFeature(features[0]||"No feature assigned")},[dept,features.join("|")]);
 const index=Math.max(0,features.indexOf(selectedFeature));
 const planned=12600+index*1380;
 const actual=Math.round(planned*[1.14,.96,1.08,.89,1.03][index%5]);
 const sellThrough=[87,74,82,68,79][index%5];
 const margin=[41.8,36.4,39.2,34.8,38.6][index%5];
 const remaining=Math.max(12,Math.round((100-sellThrough)*3.4));
 const locations=Object.values(assignments).filter(value=>value===selectedFeature).length||1;
 return <section className="featurePerformance">
   <div className="insightHeader"><div><span className="eyebrow">FEATURE-LEVEL PERFORMANCE</span><h2>See what each set actually delivered</h2><p>Compare planned sales with results, sell-through, margin, and remaining inventory.</p></div><label className="featureSelector"><span>Choose feature</span><select value={selectedFeature} onChange={event=>setSelectedFeature(event.target.value)}>{features.map(feature=><option key={feature}>{feature}</option>)}</select></label></div>
   <div className="featureMetrics">
     <div className="featureMetric"><small>Planned sales</small><b>{fmt(planned)}</b></div>
     <div className="featureMetric"><small>Actual sales</small><b>{fmt(actual)}</b><span className="positive">{actual>=planned?"+":""}{Math.round((actual/planned-1)*100)}% to plan</span></div>
     <div className="featureMetric"><small>Gross margin</small><b>{margin}%</b></div>
     <div className="featureMetric"><small>Sell-through</small><b>{sellThrough}%</b><div className="sellThrough"><i style={{width:`${sellThrough}%`}}/></div></div>
     <div className="featureMetric"><small>Inventory remaining</small><b>{remaining} units</b><span>{locations} planned location{locations===1?"":"s"}</span></div>
   </div>
   <div className="featureCallout"><p><b>AI read:</b> {actual>=planned?`${selectedFeature} is outperforming plan. Protect in-stock and keep the current placement.`:`${selectedFeature} is below plan. Reduce the next order and test a stronger front placement.`}</p><strong>{actual>=planned?"Scale this setup":"Review this set"} →</strong></div>
 </section>
}

function LegacyOrderingIntelligence({dept,sellers,assignments}){
 const planned=[...new Set([...Object.values(assignments).filter(Boolean),...sellers.slice(0,4).map(item=>item[0])])].slice(0,4);
 const rows=planned.map((item,index)=>{const weekly=[46,38,31,25][index];const onHand=[68,42,26,51][index];const inbound=[24,48,36,0][index];const casePack=[12,12,6,8][index];const target=weekly*4;const order=Math.max(0,Math.ceil((target-onHand-inbound)/casePack)*casePack);const weeks=Number(((onHand+inbound)/weekly).toFixed(1));return {item,weekly,onHand,inbound,casePack,order,weeks,leftover:Math.max(0,onHand+inbound+order-target),reorder:`Aug ${8+index*3}`};});
 return <section className="orderingIntelligence"><div className="orderingHead"><div><span className="eyebrow">PLANNED FEATURE ORDERING</span><h2>{dept} inventory intelligence</h2><p>AI balances feature demand, current inventory, inbound units, case packs, and expected leftovers.</p></div><button>Generate department order</button></div><div className="orderingColumns"><span>Planned item</span><span>On hand</span><span>Inbound</span><span>Weekly sales</span><span>Weeks supply</span><span>Suggested order</span><span>Reorder</span><span>Leftover</span></div><div className="orderingRows">{rows.map((row,index)=><div key={row.item}><span><i>{index+1}</i><b>{row.item}</b><small>Case pack {row.casePack}</small></span><b>{row.onHand}</b><b>{row.inbound}</b><b>{row.weekly}</b><em className={row.weeks<2?"risk":""}>{row.weeks}</em><strong>{row.order} units</strong><span>{row.reorder}</span><span>{row.leftover} units</span></div>)}</div><div className="orderingFooter"><p><b>AI recommendation:</b> Prioritize items below two weeks of supply, round orders to full case packs, and review any projected leftover above one case.</p><button>Send draft for approval →</button></div></section>
}

function OrderingIntelligence({dept,sellers,assignments,allEndcapsPlanned,plannedCount,totalEndcaps,onWorkflowStage}){
 const deliveryDates={Grocery:"2026-08-04",Home:"2026-08-07",Seasonal:"2026-08-03",Automotive:"2026-08-06",Apparel:"2026-08-10",Electronics:"2026-08-05"};
 const [workflow,setWorkflow]=useDemoSavedState(`swas-order-workflow-${dept}-v1`,{stage:"draft",approver:"Store Manager",deliveryDate:deliveryDates[dept]});
 const planned=[...new Set([...Object.values(assignments).filter(Boolean),...sellers.slice(0,4).map(item=>item[0])])].slice(0,4);
 const rows=planned.map((item,index)=>{
   const weekly=[46,38,31,25][index],onHand=[68,42,26,51][index],inbound=[24,48,36,0][index],casePack=[12,12,6,8][index];
   const target=weekly*4,order=Math.max(0,Math.ceil((target-onHand-inbound)/casePack)*casePack);
   return {item,weekly,onHand,inbound,casePack,order,weeks:Number(((onHand+inbound)/weekly).toFixed(1)),leftover:Math.max(0,onHand+inbound+order-target)};
 });
 const stageInfo={
   draft:["Draft order","Build and review suggested quantities"],
   approval:["Awaiting approval",`Waiting for ${workflow.approver}`],
   approved:["Order approved",`Delivery scheduled ${workflow.deliveryDate}`],
   transit:["In transit",`Expected ${workflow.deliveryDate}`],
   received:["Freight received","Department can verify and stage merchandise"],
   ready:["Ready to set","Merchandise received and staged"],
 };
 const submit=()=>setWorkflow(old=>({...old,stage:"approval"}));
 const approve=()=>{
   setWorkflow(old=>({...old,stage:"approved"}));
   if(allEndcapsPlanned)onWorkflowStage("Planned");
 };
 const advance=(stage,status)=>{setWorkflow(old=>({...old,stage}));onWorkflowStage(status)};
 return <section className="orderingIntelligence">
   <div className="orderingHead"><div><span className="eyebrow">PLANNED FEATURE ORDERING</span><h2>{dept} order and delivery workflow</h2><p>Suggested quantities move through approval, delivery, freight receipt, and set readiness.</p></div><span className={`orderStage stage-${workflow.stage}`}><b>{stageInfo[workflow.stage][0]}</b><small>{stageInfo[workflow.stage][1]}</small></span></div>
   <div className="planReadiness"><span><b>{plannedCount}/{totalEndcaps}</b><small>endcaps assigned</small></span><i><span style={{width:`${Math.round(plannedCount/totalEndcaps*100)}%`}}/></i><strong>{allEndcapsPlanned?"Plan coverage complete":"Complete every open endcap before approval"}</strong></div>
   <div className="orderingColumns"><span>Planned item</span><span>On hand</span><span>Inbound</span><span>Weekly sales</span><span>Weeks supply</span><span>Suggested order</span><span>Case pack</span><span>Leftover</span></div>
   <div className="orderingRows">{rows.map((row,index)=><div key={row.item}><span><i>{index+1}</i><b>{row.item}</b><small>AI demand recommendation</small></span><b>{row.onHand}</b><b>{row.inbound}</b><b>{row.weekly}</b><em className={row.weeks<2?"risk":""}>{row.weeks}</em><strong>{row.order} units</strong><span>{row.casePack}</span><span>{row.leftover} units</span></div>)}</div>
   <div className="approvalWorkflow">
     <label><span>Approval role</span><select value={workflow.approver} onChange={event=>setWorkflow(old=>({...old,approver:event.target.value}))}><option>Store Manager</option><option>Coach</option></select></label>
     <label><span>Expected delivery</span><input type="date" value={workflow.deliveryDate} onChange={event=>setWorkflow(old=>({...old,deliveryDate:event.target.value}))}/></label>
     <div className="workflowButtons">
       {workflow.stage==="draft"&&<button onClick={submit}>Send order for approval →</button>}
       {workflow.stage==="approval"&&<button className="approveOrder" disabled={!allEndcapsPlanned} onClick={approve}>Approve as {workflow.approver}</button>}
       {workflow.stage==="approved"&&<button onClick={()=>advance("transit","In transit")}>Confirm order shipped</button>}
       {workflow.stage==="transit"&&<button onClick={()=>advance("received","Freight received")}>Mark freight received</button>}
       {workflow.stage==="received"&&<button onClick={()=>advance("ready","Ready to set")}>Mark merchandise staged</button>}
       {workflow.stage==="ready"&&<button className="completeWorkflow">Ready for set date ✓</button>}
     </div>
   </div>
   <div className="orderingFooter"><p><b>Status logic:</b> A selected feature starts Pending. When all endcaps are assigned and the order is approved, it becomes Planned. Shipping and freight actions then update every department location together.</p><span>Prototype workflow · Fictional order data</span></div>
 </section>
}

function CyclePlanner({dept,sellers,eventPlans}){
 const periods=[30,60,90];
 const defaults={
   30:{feature:"Current priority set",start:"2026-07-28",end:"2026-08-23",arrival:"2026-08-20",markdown:"2026-08-16",status:"Order now"},
   60:{feature:"Next seasonal transition",start:"2026-08-24",end:"2026-09-20",arrival:"2026-09-17",markdown:"2026-09-13",status:"Plan quantities"},
   90:{feature:"Upcoming feature window",start:"2026-09-21",end:"2026-10-18",arrival:"2026-10-15",markdown:"2026-10-11",status:"Forecast"},
 };
 const [active,setActive]=useState(30);
 const [plans,setPlans]=useDemoSavedState(`swas-cycle-plans-${dept}-v1`,defaults);
 const [orders,setOrders]=useDemoSavedState(`swas-cycle-orders-${dept}-v1`,{});
 const plan=plans[active];
 const update=(key,value)=>setPlans(old=>({...old,[active]:{...old[active],[key]:value}}));
 const dateBack=(date,days)=>{if(!date)return"";const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()-days);return d.toISOString().slice(0,10)};
 const changeArrival=value=>setPlans(old=>({...old,[active]:{...old[active],arrival:value,markdown:dateBack(value,4),end:dateBack(value,1)}}));
 const generateOrder=()=>setOrders(old=>({...old,[active]:sellers.slice(0,4).map((x,i)=>({item:x[0],cases:Math.max(4,12-i*2),units:Math.max(24,72-i*12),reason:i===0?"Top annual seller + front placement":"Historical velocity + seasonal fit"}))}));
 const order=orders[active]||[];
 return <section className="cyclePlanner">
   <div className="cycleHead"><div><span className="eyebrow">30 / 60 / 90 DAY SWAS</span><h2>Plan each feature window</h2><p>{eventPlans?.[active]||"Seasonal event"} · Complete the set details and let AI prepare the dates and suggested order.</p></div><div className="periodTabs">{periods.map(x=><button key={x} className={active===x?"active":""} onClick={()=>setActive(x)}><b>{x}</b><span>days</span><small>{eventPlans?.[x]||plans[x].status}</small></button>)}</div></div>
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
