/**
 * Main MinimMask Object for all interaction
 */
var MINIMASK = {
/**
	 * Main Callback for pending actions
	 */
	MAIN_MINIMASK_CALLBACK : null,
			
	/**
	 * MINIMASK Startup
	 */
	init : function(callback){
		
		//Save this to send back pending responses
		MAIN_MINIMASK_CALLBACK = callback;
		
		//Set a Timer to POLL for messages - Pending / Login etc
		setInterval(function(){
			
			var msg 				= _createSimpleMessage("pending_messages");
			msg.params.pendinglist 	= PENDING_UID_LIST;
						
			postMessageToServiceWorker(msg, function(resp){
				
				for(var i=0;i<resp.data.length;i++){
					
					var pendingaction 	= resp.data[i];
					var puid 			= pendingaction.pendinguid;
									
					//Remove from list
					removeMiniMaskPendinUID(puid);
					
					var mini_msg 	= {};
					mini_msg.event 	= "MINIMASK_PENDING";
					mini_msg.data 	= pendingaction;
								
					//Send back to user
					MAIN_MINIMASK_CALLBACK(mini_msg); 
				}
			});
		}, 2000);
		
		//Get Init details
		postMessageToServiceWorker(_createSimpleMessage("minimask_extension_init"), function(resp){
			
			var mini_msg 	= {};
			mini_msg.event 	= "MINIMASK_INIT";
			mini_msg.data 	= resp;
			
			if(callback){
				callback(mini_msg);	
			}
		});
	},
	
	/**
	 * Access the MiniMask Account
	 */
	account : {
		
		/**
		 * Get the balance of all tokens for this address
		 */
		balance : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_balance"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Get all coins for this address
		 */
		coins : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_coins"), function(resp){
				callback(resp);
			});
		},
	
		/**
		 * Get the address for the logged in account
		 */
		getAddress : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getaddress"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Get the public key for the logged in account
		 */
		getPublicKey : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("account_getpublickey"), function(resp){
				callback(resp);
			});
		},
		
		/**
		 * Send funds from this account - will create a PENDING transaction 
		 */
		send : function(amount, address, tokenid, state, callback){
			var msg = _createSimpleMessage("account_send");
			
			msg.params.amount  	= ""+amount;
			msg.params.address 	= address;
			msg.params.tokenid 	= tokenid;
			msg.params.state 	= JSON.stringify(state);
			
			postMessageToServiceWorker(msg, function(resp){
				
				//Will result in a pending!
				if(resp.pending){
					//Add pending UID to our check list
					addMiniMaskPendinUID(resp.pendinguid);					
				
					//console.log("ADDED PENDING_LIST : "+JSON.stringify(PENDING_UID_LIST));
				}
				
				callback(resp);
			});
		},
		
		/**
		 * Sign a transaction created with MINIMASK.meg.rawtxn - will create a Pending transaction
		 */
		sign : function(txndata, post, callback){
			
			var msg = _createSimpleMessage("account_sign");
			
			msg.params.data = txndata;
			msg.params.post = post;
			
			postMessageToServiceWorker(msg, function(resp){
				
				//Will result in a pending!
				if(resp.pending){
					//Add pending UID to our check list
					addMiniMaskPendinUID(resp.pendinguid);					
				
					//console.log("ADDED TO PENDING_LIST : "+JSON.stringify(PENDING_UID_LIST));
				}
				
				callback(resp);
			});
		}
	},
	
	/**
	 * Call MEG functions directly
	 */
	meg : {
		
		create : function(callback){
			postMessageToServiceWorker(_createSimpleMessage("create"), function(resp){
				callback(resp);
			});	
		},
		
		createseed : function(seedphrase, callback){
			
			var msg = _createSimpleMessage("createseed");
			msg.params.seedphrase = seedphrase;
			
			postMessageToServiceWorker(msg, function(resp){
				callback(resp);
			});	
		},
		
		balance : function(address, callback){
			//Run full balance..
			fullbalance(address, 3, false, false, callback);	
		},
		
		balancefull : function(address, confirmations, coinlist, tokendetails, callback){
			var msg = _createSimpleMessage("balance");
			
			msg.params.address  		= ad
