const ADDRESS = "MxG086HDR94WWW3ZJE24E807D5SQ7F5WUDQFNN9N221P89D698ZET9YK8832YJQ";

let status;

window.onload = function(){

  status = document.getElementById("status");

  if(typeof MINIMASK !== "undefined"){

    MINIMASK.init(function(msg){

      if(msg.event === "MINIMASK_INIT"){

        if(!msg.data.data.loggedon){
          status.innerText = "❌ Not logged in";
          return;
        }

        status.innerText = "✅ Connected";
      }
    });

  } else {
    status.innerText = "❌ MiniMask not found";
  }
};

function sendTip(amount){

  let receiver = document.getElementById("receiverAddress").value.trim();

  // fallback to default address if empty
  if(receiver === ""){
    receiver = ADDRESS;
  }

  // basic validation
  if(receiver.length < 10){
    alert("Invalid address");
    return;
  }

  MINIMASK.account.send(
    amount,
    receiver,
    "0x00",
    {},
    function(resp){

      if(resp.pending){
        status.innerText = "⏳ Approve...";
      }
      else if(resp.success){
        status.innerText = "✅ Sent!";
        showPopup();
      }
      else{
        status.innerText = "❌ Failed";
      }
    }
  );
}

function sendCustom(){
  let val = customAmount.value;

  if(!val || isNaN(val)){
    alert("Invalid amount");
    return;
  }

  sendTip(parseFloat(val));
}

function showPopup(){
  popup.classList.remove("hidden");
  setTimeout(()=>popup.classList.add("hidden"),2000);
}
