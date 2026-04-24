const WALL_ADDRESS = "0xFFEEDDFFEEDD99";

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

        loadMessages();
      }
    });

  } else {
    status.innerText = "❌ MiniMask not found";
  }
};

function sendMessage(){

  let msg = document.getElementById("id_sendmsg").value.trim();

  if(msg === ""){
    alert("Empty message");
    return;
  }

  // 🔥 important: wake wallet (same fix as tipjar)
  MINIMASK.account.getAddress(function(res){

    if(!res || !res.status){
      alert("Wallet error");
      return;
    }

    let state = {};
    state[99] = "[" + new Date().toLocaleString() + "\n\n" + encodeURI(msg) + "]";

    MINIMASK.account.send(
      "0.00000001",
      WALL_ADDRESS,
      "0x00",
      state,
      function(resp){

        console.log("Feed send:", resp);

        if(resp.pending){
          status.innerText = "⏳ Approve in MiniMask...";
          document.getElementById("id_sendmsg").value = "";

          // reload after delay
          setTimeout(loadMessages, 5000);
        }
        else{
          status.innerText = "❌ Failed";
        }
      }
    );

  });
}

function loadMessages(){

  MINIMASK.meg.listcoins(WALL_ADDRESS, "", "", function(resp){

    let html = "";

    if(!resp || !resp.data || resp.data.length === 0){
      html = "No messages yet";
    }

    resp.data.forEach(c=>{
      try{
        let msg = decodeURI(c.state[99] || "");
        msg = msg.substring(1,msg.length-1);
        html += `<div class="msg">${msg}</div>`;
      }catch(e){}
    });

    document.getElementById("id_list_messages").innerHTML = html;
  });
}
