var WALL_ADDRESS = "0xFFEEDDFFEEDD99";

function sendMessage(){

  var msg = id_sendmsg.value.trim();

  if(msg === ""){
    alert("Empty message");
    return;
  }

  var state = {};
  state[99] = "[" + new Date().toLocaleString() + "\n\n" + encodeURI(msg) + "]";

  MINIMASK.account.send("0.00000001", WALL_ADDRESS, "0x00", state, function(resp){

    if(resp.pending){
      alert("Approve in MiniMask");
      id_sendmsg.value="";
    }else{
      alert("Error");
    }

  });
}

function loadMessages(){

  MINIMASK.meg.listcoins(WALL_ADDRESS, "", "", function(resp){

    let html = "";

    if(resp.data.length === 0){
      html = "No messages yet";
    }

    resp.data.forEach(c=>{
      let msg = decodeURI(c.state[99]);
      html += "<pre class='msgdiv'>" + msg.substring(1,msg.length-1) + "</pre>";
    });

    id_list_messages.innerHTML = html;

  });
}
