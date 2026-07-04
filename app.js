function activityOrdersFor(centre){const normal=x=>String(x||'').trim().toLowerCase().replace('salford quays','sq');const row=(DATA.dashboard_activity||[]).find(r=>normal(r.centre)===normal(centre));return row ? (Number(row.total_orders)||0) : 0;}
const statusClass=n=> n>=1?'green':n>=.9?'amber':'red';
const progress=n=>`<div class="progress"><div class="bar ${statusClass(n)}" style="width:${Math.min(Math.max(n*100,0),120)}%"></div></div>`;
const status=n=>`<span class="status ${statusClass(n)}">${n>=1?'On / Ahead':n>=.9?'Watch':'Behind'}</span>`;
function cell(val,col,row){let v=typeof col.value==='function'?col.value(row):row[col.key];if(col.format==='pct')return pct(v);if(col.format==='progress')return progress(v);if(col.format==='status')return status(v);return col.num?fmt(v):(v??'-')}
function makeTable(id,cols,rows){const table=document.getElementById(id);table.innerHTML=`<thead><tr>${cols.map(c=>`<th class="${c.num?'num':''}">${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="${String(r.centre||'').includes('CDA')||r.centre==='TOTAL'?'group':''}">${cols.map(c=>`<td class="${c.num?'num':''}">${cell(null,c,r)}</td>`).join('')}</tr>`).join('')}</tbody>`}
function leaderRows(rows, valueFn, subFn){return rows.slice().sort((a,b)=>valueFn(b)-valueFn(a)).map((r,i)=>{const v=valueFn(r);return `<div class="leader-row"><div class="rank">${i+1}</div><div class="centre">${siteLabel(r.centre)}<div class="mini">${subFn?subFn(r):''}</div></div><div class="pct">${pct(v)}</div>${progress(v)}</div>`}).join('')}
function sum(rows,key){return rows.reduce((a,r)=>a+(Number(r[key])||0),0)}

function topRow(rows, valueFn){return rows && rows.length ? rows.slice().sort((a,b)=>valueFn(b)-valueFn(a))[0] : null}
function highlights(regs,used,acts,orders){
 const reg=topRow(regs,r=>r.qtr_target?r.qtr_total/r.qtr_target:0);
 const usedTop=topRow(used,r=>r.qtr_target?r.qtr_counting/r.qtr_target:0);
 const ordersTop=topRow(acts,r=>Number(r.total_orders)||0);
 const convTop=topRow(acts,r=>Number(r.orders_ratio)||0);
 const obTop=topRow(orders,r=>activityOrdersFor(r.centre));
 const lines=[];
 if(reg) lines.push(`<div><strong>${siteLabel(reg.centre)}</strong> leads registrations at <strong>${pct(reg.qtr_target?reg.qtr_total/reg.qtr_target:0)}</strong> of Q3 target.</div>`);
 if(usedTop) lines.push(`<div><strong>${siteLabel(usedTop.centre)}</strong> is strongest on used cars at <strong>${pct(usedTop.qtr_target?usedTop.qtr_counting/usedTop.qtr_target:0)}</strong> of target.</div>`);
 if(ordersTop) lines.push(`<div><strong>${siteLabel(ordersTop.centre)}</strong> has the highest order volume with <strong>${fmt(ordersTop.total_orders)}</strong> orders.</div>`);
 if(convTop) lines.push(`<div><strong>${siteLabel(convTop.centre)}</strong> leads conversion at <strong>${pct(convTop.orders_ratio)}</strong>.</div>`);
 if(obTop) lines.push(`<div><strong>${siteLabel(obTop.centre)}</strong> is strongest on July order bank done with <strong>${fmt(activityOrdersFor(obTop.centre))}</strong> orders.</div>`);
 return lines.join('');
}
function build(){
 const regs=DATA.dashboard_regs, used=DATA.dashboard_used, non=DATA.q3_non, acts=DATA.dashboard_activity;
 const regTarget=sum(regs,'qtr_target'), regCurrent=sum(regs,'qtr_total'), regToGo=regTarget-regCurrent;
 const usedTarget=sum(used,'qtr_target'), usedCurrent=sum(used,'qtr_counting'), usedToGo=usedTarget-usedCurrent;
 const nonFleetBudget=sum(non,'qtr_budget'), nonFleetCurrent=sum(non,'qtr_total');
 document.getElementById('q3Target').textContent=fmt(regTarget);
 document.getElementById('q3Current').textContent=fmt(regCurrent);
 document.getElementById('q3Pct').textContent=pct(regTarget?regCurrent/regTarget:0);
 document.getElementById('usedTarget').textContent=fmt(usedTarget);
 document.getElementById('usedCurrent').textContent=fmt(usedCurrent);
 document.getElementById('usedPct').textContent=pct(usedTarget?usedCurrent/usedTarget:0);
 document.getElementById('nonFleetBudget').textContent=fmt(nonFleetBudget);
 document.getElementById('nonFleetCurrent').textContent=fmt(nonFleetCurrent);
 document.getElementById('nonFleetPct').textContent=pct(nonFleetBudget?nonFleetCurrent/nonFleetBudget:0);
 const act = DATA.dashboard_activity || [];
 const newEnquiries = sum(act,'new_enquiries');
 const usedEnquiries = sum(act,'used_enquiries');
 const totalEnquiries = sum(act,'total_enquiries');
 const newTestDrives = sum(act,'new_test_drives');
 const usedTestDrives = sum(act,'used_test_drives');
 const totalTestDrives = sum(act,'total_test_drives');
 const newOS = sum(act,'new_os');
 const usedOS = sum(act,'used_os');
 const totalOS = sum(act,'total_os');
 const newOrders = sum(act,'new_orders');
 const usedOrders = sum(act,'used_orders');
 const totalOrders = sum(act,'total_orders');
 document.getElementById('newEnquiries').textContent = fmt(newEnquiries);
 document.getElementById('usedEnquiries').textContent = fmt(usedEnquiries);
 document.getElementById('totalEnquiries').textContent = fmt(totalEnquiries);
 document.getElementById('newTdPct').textContent = pct(newEnquiries ? newTestDrives / newEnquiries : 0);
 document.getElementById('usedTdPct').textContent = pct(usedEnquiries ? usedTestDrives / usedEnquiries : 0);
 document.getElementById('totalTdPct').textContent = pct(totalEnquiries ? totalTestDrives / totalEnquiries : 0);
 document.getElementById('newOsPct').textContent = pct(newEnquiries ? newOS / newEnquiries : 0);
 document.getElementById('usedOsPct').textContent = pct(usedEnquiries ? usedOS / usedEnquiries : 0);
 document.getElementById('totalOsPct').textContent = pct(totalEnquiries ? totalOS / totalEnquiries : 0);
 document.getElementById('newConvPct').textContent = pct(newEnquiries ? newOrders / newEnquiries : 0);
 document.getElementById('usedConvPct').textContent = pct(usedEnquiries ? usedOrders / usedEnquiries : 0);
 document.getElementById('totalConvPct').textContent = pct(totalEnquiries ? totalOrders / totalEnquiries : 0);
 document.getElementById('h2Period').innerHTML='<span class="period-pill muted">H1 closed</span><span class="period-pill active">H2 active · July onwards</span>';
 const north=DATA.q3_regs.find(r=>r.centre==='NORTH CDA'), wy=DATA.q3_regs.find(r=>r.centre==='WY CDA');
 document.getElementById('cdaSummary').innerHTML=[north,wy].filter(Boolean).map(r=>`<div class="leader-row"><div class="rank">●</div><div class="centre">${r.centre}<div class="mini">${fmt(r.qtr_total)} / ${fmt(r.qtr_target)} · To go ${fmt(r.to_go)}</div></div><div class="pct">${pct(r.qtr_target?r.qtr_total/r.qtr_target:0)}</div>${progress(r.qtr_target?r.qtr_total/r.qtr_target:0)}</div>`).join('');
 document.getElementById('leaderboard').innerHTML=leaderRows(regs,r=>r.qtr_target?r.qtr_total/r.qtr_target:0,r=>`${fmt(r.qtr_total)} / ${fmt(r.qtr_target)} · To go ${fmt(r.to_go)}`);
 document.getElementById('usedSummary').innerHTML=leaderRows(used,r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,r=>`${fmt(r.qtr_counting)} / ${fmt(r.qtr_target)} · To go ${fmt((r.qtr_target||0)-(r.qtr_counting||0))}`);
 document.getElementById('nonFleetSummary').innerHTML=non.filter(r=>['Salford','Bradford'].includes(r.centre)).sort((a,b)=>(b.qtr_total||0)-(a.qtr_total||0)).map((r,i)=>`<div class="leader-row"><div class="rank">${i+1}</div><div class="centre">${siteLabel(r.centre)}<div class="mini">QTR ${fmt(r.qtr_total)} · Budget ${fmt(r.qtr_budget)}</div></div><div class="pct">${fmt(r.qtr_total)}</div>${progress(r.qtr_budget?r.qtr_total/r.qtr_budget:0)}</div>`).join('');
 document.getElementById('highlights').innerHTML=highlights(regs,used,acts,DATA.dashboard_orders||[]);
 document.getElementById('execNote').innerHTML=`<strong>H2 is now the active period.</strong> Dashboard focus has been simplified to new registrations, used cars and non-counting fleet. Q3 new registration target is <strong>${fmt(regTarget)}</strong>, with <strong>${fmt(regToGo)}</strong> still to go in the loaded report. Used car target is <strong>${fmt(usedTarget)}</strong>, with <strong>${fmt(usedToGo)}</strong> still to go. Non-counting fleet currently shows <strong>${fmt(nonFleetCurrent)}</strong> against a budget of <strong>${fmt(nonFleetBudget)}</strong>. Sales funnel totals are now shown at the top: enquiries, test drive %, offer sheet % and conversion %. Full sales activity remains available in its own tab.`;
 makeTable('q3Table',[{label:'Centre',key:'centre'},{label:'Jul Total',key:'jul_total',num:true},{label:'Jul Target',key:'jul_target',num:true},{label:'Aug Total',key:'aug_total',num:true},{label:'Aug Target',key:'aug_target',num:true},{label:'Sep Total',key:'sep_total',num:true},{label:'Sep Target',key:'sep_target',num:true},{label:'QTR Total',key:'qtr_total',num:true},{label:'QTR Target',key:'qtr_target',num:true},{label:'Progress',value:r=>r.qtr_target?r.qtr_total/r.qtr_target:0,format:'progress'},{label:'%',value:r=>r.qtr_target?r.qtr_total/r.qtr_target:0,format:'pct',num:true},{label:'To Go',key:'to_go',num:true},{label:'Per Week',key:'per_week',num:true},{label:'Status',value:r=>r.qtr_target?r.qtr_total/r.qtr_target:0,format:'status'}],DATA.q3_regs);
 makeTable('usedTable',[{label:'Centre',key:'centre'},{label:'Jul Used',key:'jul_counting',num:true},{label:'Jul Target',key:'jul_target',num:true},{label:'Aug Used',key:'aug_counting',num:true},{label:'Aug Target',key:'aug_target',num:true},{label:'Sep Used',key:'sep_counting',num:true},{label:'Sep Target',key:'sep_target',num:true},{label:'QTR Used',key:'qtr_counting',num:true},{label:'QTR Target',key:'qtr_target',num:true},{label:'Progress',value:r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,format:'progress'},{label:'%',value:r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,format:'pct',num:true},{label:'Status',value:r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,format:'status'}],DATA.q3_used);
 makeTable('fleetMonthlyTable',[{label:'Centre',key:'centre'},{label:'Jul Fleet',key:'jul_fleet',num:true},{label:'Aug Fleet',key:'aug_fleet',num:true},{label:'Sep Fleet',key:'sep_fleet',num:true},{label:'QTR Fleet',key:'qtr_fleet',num:true},{label:'BCH Regs',key:'bch_regs',num:true},{label:'BCH Target',key:'bch_target',num:true},{label:'BCH Progress',value:r=>r.bch_target?r.bch_regs/r.bch_target:0,format:'progress'},{label:'BCH %',value:r=>r.bch_target?r.bch_regs/r.bch_target:0,format:'pct',num:true},{label:'Active Orders',key:'active_orders',num:true}],DATA.q3_fleet_monthly);
 makeTable('fleetTable',[{label:'Centre',key:'centre'},{label:'Regs',key:'regs',num:true},{label:'Target',key:'target',num:true},{label:'Progress',value:r=>r.target?r.regs/r.target:0,format:'progress'},{label:'%',value:r=>r.target?r.regs/r.target:0,format:'pct',num:true},{label:'Active Orders',key:'active_orders',num:true},{label:'Status',value:r=>r.target?r.regs/r.target:0,format:'status'}],DATA.q3_fleet);
 makeTable('nonTable',[{label:'Centre',key:'centre'},{label:'Jul Total',key:'jul_total',num:true},{label:'Jul Budget',key:'jul_budget',num:true},{label:'Aug Total',key:'aug_total',num:true},{label:'Aug Budget',key:'aug_budget',num:true},{label:'Sep Total',key:'sep_total',num:true},{label:'Sep Budget',key:'sep_budget',num:true},{label:'QTR Total',key:'qtr_total',num:true},{label:'QTR Budget',key:'qtr_budget',num:true}],DATA.q3_non);
 makeTable('orderBankTable',[{label:'Centre',key:'centre'},{label:'H1 Target',key:'h1_target',num:true},{label:'H1 Orders',key:'h1_orders',num:true},{label:'H1 Diff',key:'h1_diff',num:true},{label:'H1 %',key:'h1_pct',format:'pct',num:true},{label:'H2 Target',key:'h2_target',num:true},{label:'July Target',key:'jul_target',num:true},{label:'July Done',value:r=>activityOrdersFor(r.centre),num:true},{label:'July To Go',value:r=>(Number(r.jul_target)||0)-activityOrdersFor(r.centre),num:true},{label:'July Progress',value:r=>r.jul_target?activityOrdersFor(r.centre)/r.jul_target:0,format:'progress'},{label:'July %',value:r=>r.jul_target?activityOrdersFor(r.centre)/r.jul_target:0,format:'pct',num:true},{label:'Q3 Target',key:'q3_target',num:true},{label:'Q4 Target',key:'q4_target',num:true},{label:'CY26 OB',key:'cy26_target',num:true}],(DATA.dashboard_orders||[]).slice().sort((a,b)=>activityOrdersFor(b.centre)-activityOrdersFor(a.centre)));
 makeTable('monthlyOrderTable',[{label:'Centre',key:'centre'},{label:'H1 Target',key:'h1_target',num:true},{label:'H1 Orders',key:'h1_orders',num:true},{label:'H1 Diff',key:'h1_diff',num:true},{label:'H1 %',key:'h1_pct',format:'pct',num:true},{label:'H2 Target',key:'h2_target',num:true},{label:'Jul Target',key:'jul_target',num:true},{label:'Jul Done',value:r=>activityOrdersFor(r.centre),num:true},{label:'Jul To Go',value:r=>(Number(r.jul_target)||0)-activityOrdersFor(r.centre),num:true},{label:'Aug Target',key:'aug_target',num:true},{label:'Aug Done',key:'aug_orders',num:true},{label:'Sep Target',key:'sep_target',num:true},{label:'Sep Done',key:'sep_orders',num:true},{label:'Q3 Target',key:'q3_target',num:true},{label:'Q4 Target',key:'q4_target',num:true},{label:'Oct Target',key:'oct_target',num:true},{label:'Nov Target',key:'nov_target',num:true},{label:'Dec Target',key:'dec_target',num:true}],(DATA.dashboard_orders||[]).slice().sort((a,b)=>activityOrdersFor(b.centre)-activityOrdersFor(a.centre)));
 makeTable('activityTable',[{label:'Rank',value:(r)=>((DATA.dashboard_activity||[]).slice().sort((a,b)=>(b.total_orders||0)-(a.total_orders||0)).findIndex(x=>x.centre===r.centre)+1),num:true},{label:'Centre',key:'centre'},{label:'Enquiries',key:'total_enquiries',num:true},{label:'Test Drives',key:'total_test_drives',num:true},{label:'OS',key:'total_os',num:true},{label:'Orders',key:'total_orders',num:true},{label:'TD %',key:'td_ratio',format:'pct',num:true},{label:'Order %',key:'orders_ratio',format:'pct',num:true},{label:'OS %',key:'os_ratio',format:'pct',num:true},{label:'New Enq',key:'new_enquiries',num:true},{label:'New TD',key:'new_test_drives',num:true},{label:'New OS',key:'new_os',num:true},{label:'New Orders',key:'new_orders',num:true},{label:'Used Enq',key:'used_enquiries',num:true},{label:'Used TD',key:'used_test_drives',num:true},{label:'Used OS',key:'used_os',num:true},{label:'Used Orders',key:'used_orders',num:true},{label:'Delivered',key:'delivered',num:true},{label:'Lost Opp',key:'lost_opportunities',num:true}],(DATA.dashboard_activity||[]).slice().sort((a,b)=>(b.total_orders||0)-(a.total_orders||0)));
 makeTable('q2RegTable',[{label:'Centre',key:'centre'},{label:'Apr Total',key:'apr_total',num:true},{label:'Apr Target',key:'apr_target',num:true},{label:'May Total',key:'may_total',num:true},{label:'May Target',key:'may_target',num:true},{label:'Jun Total',key:'jun_total',num:true},{label:'Jun Target',key:'jun_target',num:true},{label:'QTR Total',key:'qtr_total',num:true},{label:'QTR Target',key:'qtr_target',num:true},{label:'Progress',value:r=>r.qtr_target?r.qtr_total/r.qtr_target:0,format:'progress'},{label:'%',key:'regs_v_target',format:'pct',num:true},{label:'To Go',key:'to_go',num:true}],DATA.q2_regs);
 makeTable('q2UsedTable',[{label:'Centre',key:'centre'},{label:'Apr Used',key:'apr_counting',num:true},{label:'Apr Target',key:'apr_target',num:true},{label:'May Used',key:'may_counting',num:true},{label:'May Target',key:'may_target',num:true},{label:'Jun Used',key:'jun_counting',num:true},{label:'Jun Target',key:'jun_target',num:true},{label:'QTR Used',key:'qtr_counting',num:true},{label:'QTR Target',key:'qtr_target',num:true},{label:'Progress',value:r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,format:'progress'},{label:'%',value:r=>r.qtr_target?r.qtr_counting/r.qtr_target:0,format:'pct',num:true}],DATA.q2_used);
}

document.querySelectorAll('nav button').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.target).classList.add('active')})});
document.querySelectorAll('.search').forEach(input=>{input.addEventListener('input',()=>{const table=document.getElementById(input.dataset.filter);const term=input.value.toLowerCase();table.querySelectorAll('tbody tr').forEach(tr=>{tr.style.display=tr.textContent.toLowerCase().includes(term)?'':'none'})})});
build();


// --- Version 1.0 Admin import + weekly trends ---
let pendingData = null;
const HISTORY_KEY = 'rrgDashboardWeeklySnapshots';

function n(v){ if(v===null||v===undefined||v==='') return 0; if(typeof v==='number') return isNaN(v)?0:v; const s=String(v).replace(/[% ,]/g,'').trim(); const x=parseFloat(s); return isNaN(x)?0:x; }
function cleanName(s){ return String(s||'').replace(/^RRG Toyota\s+/i,'').replace(/Salford Quays/i,'SQ').trim(); }
function cloneData(){ return JSON.parse(JSON.stringify(DATA)); }
function rowObj(row){ return Array.from(row||[]).map(x=>x===undefined||x===null?'':x); }

function parseWeeklyWorkbook(workbook, base){
  const sh = workbook.Sheets['2026 - Q3'] || workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sh,{header:1, raw:true, defval:''});
  const d = cloneDataFrom(base);
  const regRows = rows.slice(3,12).filter(r=>r[0]);
  d.q3_regs = regRows.map(r=>({centre:String(r[0]), jul_counting:n(r[1]), jul_clcp:n(r[2]), jul_fleet:n(r[3]), jul_total:n(r[4]), jul_target:n(r[5]), aug_counting:n(r[7]), aug_clcp:n(r[8]), aug_fleet:n(r[9]), aug_total:n(r[10]), aug_target:n(r[11]), sep_counting:n(r[13]), sep_clcp:n(r[14]), sep_fleet:n(r[15]), sep_total:n(r[16]), sep_target:n(r[17]), qtr_counting:n(r[19]), qtr_fleet:n(r[20]), qtr_total:n(r[21]), qtr_target:n(r[22]), to_go:n(r[23]), per_week:n(r[24]), qtr_regs:n(r[25]), target:n(r[26]), regs_v_target:n(r[27])}));
  const nonRows = rows.slice(19,23).filter(r=>r[0]);
  d.q3_non = nonRows.map(r=>({centre:String(r[0]), jul_reg:n(r[1]), jul_unreg:n(r[2]), jul_total:n(r[3]), jul_budget:n(r[4]), aug_reg:n(r[5]), aug_unreg:n(r[6]), aug_total:n(r[7]), aug_budget:n(r[8]), sep_reg:n(r[9]), sep_unreg:n(r[10]), sep_total:n(r[11]), sep_budget:n(r[12]), qtr_reg:n(r[14]), qtr_unreg:n(r[15]), qtr_total:n(r[16]), qtr_budget:n(r[17])}));
  const usedRows = rows.slice(29,38).filter(r=>r[0]);
  d.q3_used = usedRows.map(r=>({centre:String(r[0]), jul_counting:n(r[1]), jul_target:n(r[2]), aug_counting:n(r[4]), aug_target:n(r[5]), sep_counting:n(r[7]), sep_target:n(r[8]), qtr_counting:n(r[10]), qtr_target:n(r[11])}));
  const fleetRows = rows.slice(43,52).filter(r=>r[0]);
  d.q3_fleet = fleetRows.map(r=>({centre:String(r[0]), regs:n(r[1]), target:n(r[2]), active_orders:n(r[4])}));
  d.q3_fleet_monthly = d.q3_regs.map(r=>({centre:r.centre, jul_fleet:r.jul_fleet, aug_fleet:r.aug_fleet, sep_fleet:r.sep_fleet, qtr_fleet:r.qtr_fleet, bch_regs:(d.q3_fleet.find(f=>f.centre===r.centre)||{}).regs||0, bch_target:(d.q3_fleet.find(f=>f.centre===r.centre)||{}).target||0, active_orders:(d.q3_fleet.find(f=>f.centre===r.centre)||{}).active_orders||0}));
  return d;
}
function cloneDataFrom(base){ return JSON.parse(JSON.stringify(base||DATA)); }

function parseSalesActivityHtml(html, base){
  const d = cloneDataFrom(base);
  const doc = new DOMParser().parseFromString(html,'text/html');
  const rows = Array.from(doc.querySelectorAll('tr.dealerHeaderSalesActivityexpandhandcursor'));
  const activity = rows.map(tr=>{
    const cells = Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.replace(/\s+/g,' ').trim());
    const centre = cleanName(cells[0]);
    return {centre,
      new_enquiries:n(cells[5]), new_test_drives:n(cells[6]), new_os:n(cells[7]), new_orders:n(cells[8]),
      used_enquiries:n(cells[17]), used_test_drives:n(cells[18]), used_os:n(cells[19]), used_orders:n(cells[20]),
      total_enquiries:n(cells[25]), total_test_drives:n(cells[26]), total_os:n(cells[27]), total_orders:n(cells[28]),
      lost_opportunities:n(cells[32]), td_ratio:n(cells[33])/100, orders_ratio:n(cells[34])/100, os_ratio:n(cells[35])/100,
      delivered:n(cells[31])};
  }).filter(r=>r.centre && !/Totals/i.test(r.centre));
  if(activity.length) d.dashboard_activity = activity;
  return d;
}

function getSnapshot(data){
  const regs = data.q3_regs.filter(r=>!isTotalRow(r.centre));
  const used = data.q3_used.filter(r=>!isTotalRow(r.centre));
  const acts = data.dashboard_activity||[];
  const regCur=sum(regs,'qtr_total'), regTgt=sum(regs,'qtr_target');
  const usedCur=sum(used,'qtr_counting'), usedTgt=sum(used,'qtr_target');
  const enq=sum(acts,'total_enquiries'), td=sum(acts,'total_test_drives'), os=sum(acts,'total_os'), orders=sum(acts,'total_orders');
  return {date:new Date().toISOString(), label:'Week '+getWeekNumber(new Date()), regCur, regTgt, usedCur, usedTgt, enquiries:enq, tdPct:enq?td/enq:0, osPct:enq?os/enq:0, convPct:enq?orders/enq:0};
}
function getWeekNumber(date){ const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())); const day=d.getUTCDay()||7; d.setUTCDate(d.getUTCDate()+4-day); const y=new Date(Date.UTC(d.getUTCFullYear(),0,1)); return Math.ceil((((d-y)/86400000)+1)/7); }
function history(){ return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); }
function saveHistory(h){ localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
function renderTrends(){
  if(!document.getElementById('trendSummary')) return;
  const h=history();
  makeTable('historyTable',[{label:'Week',key:'label'},{label:'Date',value:r=>new Date(r.date).toLocaleDateString('en-GB')},{label:'New Regs',value:r=>`${fmt(r.regCur)} / ${fmt(r.regTgt)}`},{label:'Used',value:r=>`${fmt(r.usedCur)} / ${fmt(r.usedTgt)}`},{label:'Enquiries',key:'enquiries',num:true},{label:'TD %',key:'tdPct',format:'pct'},{label:'OS %',key:'osPct',format:'pct'},{label:'Conversion',key:'convPct',format:'pct'}],h);
  const cards=[['New Reg %', h.map(x=>x.regTgt?x.regCur/x.regTgt:0),'pct'],['Used %',h.map(x=>x.usedTgt?x.usedCur/x.usedTgt:0),'pct'],['Enquiries',h.map(x=>x.enquiries),'num'],['Conversion',h.map(x=>x.convPct),'pct']];
  document.getElementById('trendSummary').innerHTML=cards.map(([title,vals,type])=>trendCard(title,vals,type)).join('');
}
function trendCard(title, vals, type){
  const last=vals.length?vals[vals.length-1]:0, prev=vals.length>1?vals[vals.length-2]:last;
  const max=Math.max(...vals,1); const cls=last>=prev?'good':'bad';
  const val=type==='pct'?pct(last):fmt(last);
  const bars=vals.slice(-8).map(v=>`<span style="height:${Math.max(5,Math.round((v/max)*38))}px"></span>`).join('');
  return `<div class="trend-card"><div class="label">${title}</div><div class="big ${cls}">${val}</div><div class="mini">${last>=prev?'Improving / stable':'Down vs last snapshot'}</div><div class="spark">${bars}</div></div>`;
}

async function handlePreviewImport(){
  const status=document.getElementById('importStatus');
  status.innerHTML='Reading files...';
  let d=cloneData();
  const weekly=document.getElementById('weeklyFile').files[0];
  const activity=document.getElementById('activityFile').files[0];
  try{
    if(weekly){ const buf=await weekly.arrayBuffer(); const wb=XLSX.read(buf,{type:'array'}); d=parseWeeklyWorkbook(wb,d); }
    if(activity){ const text=await activity.text(); d=parseSalesActivityHtml(text,d); }
    pendingData=d;
    const snap=getSnapshot(d);
    makeTable('importPreviewTable',[{label:'Metric',key:'metric'},{label:'Value',key:'value'}],[
      {metric:'New registrations',value:`${fmt(snap.regCur)} / ${fmt(snap.regTgt)} (${pct(snap.regTgt?snap.regCur/snap.regTgt:0)})`},
      {metric:'Used cars',value:`${fmt(snap.usedCur)} / ${fmt(snap.usedTgt)} (${pct(snap.usedTgt?snap.usedCur/snap.usedTgt:0)})`},
      {metric:'Total enquiries',value:fmt(snap.enquiries)},
      {metric:'Test drive %',value:pct(snap.tdPct)},
      {metric:'Offer sheet %',value:pct(snap.osPct)},
      {metric:'Conversion %',value:pct(snap.convPct)}
    ]);
    status.innerHTML=`Preview ready. Weekly file: <strong>${weekly?weekly.name:'not changed'}</strong>. Sales activity: <strong>${activity?activity.name:'not changed'}</strong>.`;
    document.getElementById('publishImport').disabled=false;
    document.getElementById('downloadData').disabled=false;
  }catch(e){ status.innerHTML='<strong>Import failed.</strong> '+e.message; console.error(e); }
}
function publishImport(){
  if(!pendingData) return;
  DATA=pendingData; build();
  const h=history(); h.push(getSnapshot(DATA)); saveHistory(h); renderTrends();
  document.getElementById('importStatus').innerHTML='Published in this browser and archived as a weekly snapshot. Download <strong>weekly-data.js</strong> and replace <strong>data/weekly-data.js</strong> in GitHub to update the live dashboard for everyone.';
}
function downloadDataFile(){
  const d=pendingData||DATA;
  const blob=new Blob(['let DATA = '+JSON.stringify(d,null,2)+';\n'],{type:'text/javascript'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='weekly-data.js'; a.click(); URL.revokeObjectURL(a.href);
}
function wireAdmin(){
  const p=document.getElementById('previewImport'); if(p) p.addEventListener('click',handlePreviewImport);
  const pub=document.getElementById('publishImport'); if(pub) pub.addEventListener('click',publishImport);
  const dl=document.getElementById('downloadData'); if(dl) dl.addEventListener('click',downloadDataFile);
  renderTrends();
}
wireAdmin();
