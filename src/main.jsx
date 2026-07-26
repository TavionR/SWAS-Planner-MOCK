import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./department-plan.css";
import "./cycle-planner.css";

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
  "Grocery":[["Liquid I.V. Hydration","19,840 units","$278K"],["Sweet Baby Ray's Sauce","18,210 units","$146K"],["Doritos Variety Pack","17,960 units","$154K"],["Great Value Paper Plates","16,840 units","$121K"],["McCormick Grill Seasoning","14,630 units","$103K"]],
  "Home":[["Sterilite Storage Tote","14,920 units","$238K"],["Mainstays Sheet Set","12,410 units","$211K"],["Better Homes Patio Cushion","9,870 units","$197K"],["Mainstays Desk Lamp","9,310 units","$142K"],["Rubbermaid Shelf Unit","7,840 units","$126K"]],
  "Seasonal":[["OFF! Deep Woods","21,340 units","$192K"],["Mainstays Solar Lights","17,820 units","$176K"],["Ozark Trail Pool Towel","14,160 units","$141K"],["Lasko Box Fan","11,730 units","$329K"],["Backpack Value Set","10,950 units","$208K"]],
  "Automotive":[["Super Tech Washer Fluid","24,810 units","$98K"],["Armor All Protectant","16,940 units","$126K"],["EverStart Jump Pack","8,730 units","$349K"],["Auto Drive Phone Mount","8,120 units","$146K"],["Microfiber Towel Pack","7,860 units","$71K"]],
  "Apparel":[["No Boundaries Sunglasses","13,480 units","$108K"],["Athletic Works Tee","11,920 units","$119K"],["Time and Tru Sandals","10,760 units","$172K"],["Hanes Sock Pack","9,840 units","$137K"],["George Baseball Cap","8,310 units","$83K"]],
  "Electronics":[["Onn. USB-C Cable","18,410 units","$147K"],["Onn. Power Bank","11,760 units","$235K"],["JBL Wireless Earbuds","8,940 units","$358K"],["Onn. Power Strip","8,120 units","$122K"],["Xbox Gift Card","7,680 units","$192K"]],
};

const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

function App(){
  const [dept,setDept]=useState("Store Overview");
  const [counts,setCounts]=useState(Object.fromEntries(Object.keys(DEPARTMENTS).filter(k=>k!=="Store Overview").map(k=>[k,{front:4,back:4}])));
  const [placement,setPlacement]=useState("Front endcap");
  const [selected,setSelected]=useState({});
  const [view,setView]=useState("Dashboard");
  const [assignments,setAssignments]=useState({});

  const totals=useMemo(()=>Object.values(counts).reduce((a,v)=>({front:a.front+v.front,back:a.back+v.back}),{front:0,back:0}),[counts]);
  const current=dept==="Store Overview"?{...DEPARTMENTS[dept],...totals}:DEPARTMENTS[dept];
  const concepts=CONCEPTS[dept]||Object.entries(CONCEPTS).flatMap(([d,arr])=>arr.slice(0,1).map(x=>[...x,d])).slice(0,4);
  const chosen=selected[dept]||[];
  const opportunity=concepts.reduce((a,x)=>a+x[2]*x[3]/100,0);
  const adjust=(where,delta)=>{if(dept==="Store Overview")return;setCounts(old=>({...old,[dept]:{...old[dept],[where]:Math.max(0,old[dept][where]+delta)}}))};
  const toggle=(name,targetDept=dept)=>setSelected(old=>({...old,[targetDept]:(old[targetDept]||[]).includes(name)?(old[targetDept]||[]).filter(x=>x!==name):[...(old[targetDept]||[]),name]}));
  const prefill=(where="both")=>{
    const sellers=TOP_SELLERS[dept]||[];
    const next={...(assignments[dept]||{})};
    const fill=(side,total,offset)=>{for(let i=0;i<total;i++)next[`${side}-${i}`]=sellers[(i+offset)%sellers.length]?.[0]||"Open";};
    if(where==="both"||where==="front")fill("front",counts[dept].front,0);
    if(where==="both"||where==="back")fill("back",counts[dept].back,2);
    setAssignments(old=>({...old,[dept]:next}));
  };

  return <div className="app">
    <aside>
      <div className="brand"><span>SW</span><div><b>SWAS Planning</b><small>ENDCAP INTELLIGENCE</small></div></div>
      <nav>{["Dashboard","Department plan","Performance","Calendar"].map((x,i)=><button key={x} className={view===x?"active":""} onClick={()=>setView(x)}><i>{["⌂","✦","↗","□"][i]}</i>{x}</button>)}</nav>
      <div className="deptNav"><small>DEPARTMENTS</small>{Object.entries(DEPARTMENTS).map(([name,d])=><button key={name} className={dept===name?"selected":""} onClick={()=>setDept(name)}><span>{d.icon}</span>{name}<em>{name==="Store Overview"?totals.front+totals.back:counts[name].front+counts[name].back}</em></button>)}</div>
      <div className="profile"><span>JM</span><div><b>Jordan Mitchell</b><small>Store leadership</small></div></div>
    </aside>
    <main>
      <header><div><span className="eyebrow">STORE 2487 · LAKEVIEW</span><h1>{dept==="Store Overview"?"Total store endcap performance":`${dept} endcap plan`}</h1><p>{dept==="Store Overview"?"See what is live, what is working, and where the next margin opportunity is.":"Set your endcap capacity and build a department-specific seasonal plan."}</p></div><div className="headerActions"><select value={dept} onChange={e=>setDept(e.target.value)}>{Object.keys(DEPARTMENTS).map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>window.print()}>Export plan ↗</button></div></header>

      <section className="statusBar"><span className="live">● LIVE STORE VIEW</span><div><b>{totals.front+totals.back}</b><small>Total endcaps</small></div><div><b>{totals.front+totals.back-6}</b><small>Active displays</small></div><div><b>6</b><small>Open opportunities</small></div><div><b>{Math.round(((totals.front+totals.back-6)/(totals.front+totals.back))*100)}%</b><small>Space utilization</small></div><p>Last refreshed with fictional data · Today, 8:15 AM</p></section>

      <section className="metrics">
        <Metric label="Endcap sales · 4 weeks" value={fmt(current.sales)} sub="+12.8% vs prior period" color="green"/>
        <Metric label="Margin opportunity" value={fmt(opportunity)} sub="from recommended concepts" color="blue"/>
        <Metric label="Performance score" value={`${current.score}/100`} sub={current.score>=90?"Top-performing area":"Healthy with upside"} color="violet"/>
        <Metric label="Average gross margin" value={`${current.margin}%`} sub="+2.4 pts vs aisle average" color="amber"/>
      </section>

      {dept==="Store Overview"?<StoreView setDept={setDept}/>:<DepartmentView dept={dept} count={counts[dept]} adjust={adjust} assignments={assignments[dept]||{}} prefill={prefill}/>}

      <div className="sectionHead"><div><span className="eyebrow">AI-RANKED OPPORTUNITIES</span><h2>{dept==="Store Overview"?"Recommended concepts across the store":`Recommended ${dept} endcap concepts`}</h2></div><span>Ranked by demand · margin · seasonality</span></div>
      <section className="concepts">{concepts.map((x,i)=>{const owner=dept==="Store Overview"?x[5]:dept;const isAdded=(selected[owner]||[]).includes(x[0]);return <Concept key={x[0]} item={x} rank={i+1} added={isAdded} toggle={()=>toggle(x[0],owner)} overview={dept==="Store Overview"}/>})}</section>

      <section className="action"><span>✦</span><div><small>AI NEXT BEST ACTION</small><h2>{dept==="Store Overview"?"Move two low-performing displays into higher-value concepts.":`Reserve a front endcap for “${concepts[0][0]}.”`}</h2><p>{dept==="Store Overview"?"Seasonal and Grocery have the strongest near-term demand. Replacing two displays scoring below 65 could add an estimated $8,600 in four-week sales.":`The front placement is projected to deliver 18% more sales than a back endcap. Confirm inventory and set the display this week.`}</p></div><button>Review action plan →</button></section>
      <footer><span>SWAS Planning · Concept prototype</span><span>Fictional store and performance data · July 2026</span></footer>
    </main>
  </div>
}

function Metric({label,value,sub,color}){return <div className={`metric ${color}`}><span>{label}</span><strong>{value}</strong><small>↗ {sub}</small></div>}

function StoreView({setDept}){
 const rows=[["Seasonal","Backyard Ready",94,"$32.9K","+24%"],["Grocery","Summer Hydration",91,"$47.2K","+18%"],["Electronics","Travel Tech",88,"$25.8K","+13%"],["Home","Patio Refresh",84,"$36.1K","+9%"],["Automotive","Road Trip Ready",82,"$24.8K","+7%"],["Apparel","Summer Essentials",78,"$21.6K","+3%"]];
 return <section className="storeGrid"><div className="panel performance"><div className="panelHead"><div><span className="eyebrow">WHAT'S THERE NOW</span><h2>Department endcap performance</h2></div><button>View all 64 →</button></div><div className="table"><div className="tr th"><span>Department</span><span>Top display</span><span>Score</span><span>4-week sales</span><span>Trend</span></div>{rows.map(r=><button className="tr" key={r[0]} onClick={()=>setDept(r[0])}><span><i>{DEPARTMENTS[r[0]].icon}</i>{r[0]}</span><span>{r[1]}</span><span><b className={`score s${Math.floor(r[2]/10)}`}>{r[2]}</b></span><span>{r[3]}</span><span className="up">{r[4]}</span></button>)}</div></div>
 <div className="panel placement"><div className="panelHead"><div><span className="eyebrow">SPACE MIX</span><h2>Placement performance</h2></div></div><div className="donut"><div><strong>64</strong><small>endcaps</small></div></div><div className="placeRow"><span><i className="front"/>Front endcaps</span><b>34</b><em>$3,480 avg.</em></div><div className="placeRow"><span><i className="back"/>Back endcaps</span><b>30</b><em>$2,740 avg.</em></div><div className="insight">Front placements are generating <b>27% more sales</b> per endcap.</div></div></section>
}

function DepartmentView({dept,count,adjust,assignments,prefill}){
 const [open,setOpen]=useState(true);
 const sellers=TOP_SELLERS[dept]||[];
 return <><section className="departmentWorkspace">
   <div className={`planBox ${open?"open":""}`}>
     <button className="planBoxHead" onClick={()=>setOpen(!open)}><div><span className="eyebrow">DEPARTMENT SETUP</span><h2>{dept} department plan</h2><p>Click to {open?"hide":"open"} your front and back endcap map.</p></div><span className="expand">{open?"−":"+"}</span></button>
     {open&&<div className="endcapSections">
       <EndcapSection title="Front endcaps" side="front" count={count.front} assignments={assignments} add={()=>adjust("front",1)} prefill={()=>prefill("front")} description="Highest visibility and customer traffic"/>
       <EndcapSection title="Back endcaps" side="back" count={count.back} assignments={assignments} add={()=>adjust("back",1)} prefill={()=>prefill("back")} description="Destination traffic and aisle transitions"/>
     </div>}
   </div>
   <div className="topSellers">
     <div className="topSellersHead"><div><span className="eyebrow">PAST 12 MONTHS</span><h2>Top-selling {dept} items</h2></div><button onClick={()=>prefill("both")}>✦ Prefill all endcaps</button></div>
     <div className="sellerList">{sellers.map((x,i)=><div className="seller" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>{x[1]} sold</small></div><strong>{x[2]}</strong></div>)}</div>
     <p className="prefillNote">Prefill uses annual sales rank and rotates endcap-appropriate products between front and back placements. You can replace individual items later.</p>
     {dept==="Grocery"&&<div className="stackbaseRule"><span>▦</span><div><b>Action-alley stackbase rule</b><p>Bulky products such as bottled-water cases, charcoal, large pet food, and oversized paper goods are excluded from endcaps. Plan those as pallet stacks on stackbases in the action alley.</p></div></div>}
   </div>
 </section><CyclePlanner dept={dept} sellers={sellers}/></>
}

function EndcapSection({title,side,count,assignments,add,prefill,description}){
 return <div className={`endcapSection ${side}`}><div className="endcapTitle"><div><i /><span><b>{title}</b><small>{description}</small></span></div><div><button onClick={prefill}>Prefill</button><strong>{count}</strong></div></div><div className="endcapGrid">{Array.from({length:count},(_,i)=><button className={assignments[`${side}-${i}`]?"filled":""} key={i}><span>{side==="front"?"F":"B"}{i+1}</span><b>{assignments[`${side}-${i}`]||"Open endcap"}</b><small>{assignments[`${side}-${i}`]?"Top seller assigned":"+ Choose an item"}</small></button>)}<button className="addEndcap" onClick={add}><span>+</span><b>Add endcap</b><small>Expand this section</small></button></div></div>
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
