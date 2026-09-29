const orders = [
  { name:"Classic Dr Pepper", items:["ice","pepper"], pay:8 },
  { name:"Cherry Dr Pepper", items:["ice","pepper","cherry"], pay:11 },
  { name:"Creamy Dr Pepper", items:["ice","pepper","cream"], pay:12 },
  { name:"Cherry Cream Dr Pepper", items:["ice","pepper","cherry","cream"], pay:16 }
];
const faces=["🧑","👩","👨","🧑‍🦱","👩‍🦰","👨‍🦱","👩‍🦱","🧑‍🍳"];
let current=null, drink=[], money=0, served=0, rating=100, upgrades={tips:false,patience:false,shop:false};

const $=id=>document.getElementById(id);
const moneyEl=$("money"), ratingEl=$("rating"), servedEl=$("served");
function updateStats(){ moneyEl.textContent="$"+money.toFixed(2); ratingEl.textContent=rating+"%"; servedEl.textContent=served; }
function pretty(items){ return items.map(x=>({ice:"Ice",pepper:"Dr Pepper",cherry:"Cherry",cream:"Cream"}[x])).join(" + "); }

function newCustomer(){
  current=orders[Math.floor(Math.random()*orders.length)];
  drink=[];
  $("customer").textContent=faces[Math.floor(Math.random()*faces.length)];
  $("order").textContent=current.name;
  $("customerMood").textContent="They'd like: "+pretty(current.items);
  $("cup").innerHTML="🥤<small>Empty cup</small>";
  $("serve").disabled=true;
  $("message").textContent="Take their order and make it!";
}
function addItem(item){
  if(!current) return;
  if(drink.includes(item)){ $("message").textContent="You already added that!"; return; }
  drink.push(item);
  $("cup").innerHTML="🥤<small>"+pretty(drink)+"</small>";
  $("serve").disabled=false;
}
function serve(){
  if(!current) return;
  const correct=drink.length===current.items.length && current.items.every(x=>drink.includes(x));
  if(correct){
    let pay=current.pay*(upgrades.tips?1.25:1);
    money+=pay; served++; rating=Math.min(100,rating+2);
    $("message").textContent="✅ Perfect! You earned $"+pay.toFixed(2)+"!";
  } else {
    rating=Math.max(0,rating-8);
    $("message").textContent="❌ Wrong drink! The customer wanted "+pretty(current.items)+".";
  }
  current=null; $("serve").disabled=true; $("order").textContent="Order complete!";
  $("customerMood").textContent="Click “New Customer” for the next order.";
  updateStats();
}
document.querySelectorAll(".ingredient").forEach(b=>b.addEventListener("click",()=>addItem(b.dataset.item)));
$("serve").addEventListener("click",serve);
$("newCustomer").addEventListener("click",newCustomer);
document.querySelectorAll(".upgrade").forEach(b=>b.addEventListener("click",()=>{
  const type=b.dataset.upgrade, cost=Number(b.dataset.cost);
  if(upgrades[type]) { $("message").textContent="You already bought this upgrade!"; return; }
  if(money<cost){ $("message").textContent="You need $"+cost+" for that upgrade."; return; }
  money-=cost; upgrades[type]=true; b.disabled=true; b.style.opacity=".45";
  $("message").textContent="🎉 Upgrade purchased!";
  updateStats();
}));
updateStats();