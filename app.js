const ADDRESS = "MxG086HDR94WWW3ZJE24E807D5SQ7F5WUDQFNN9N221P89D698ZET9YK8832YJQ";

let status;

function getWalletAddress(res) {
    if (!res || !res.status) return null;

    const d = res.data;

    if (typeof d === "string") return d;
    if (typeof d === "object") return d.address || d.data;

    return null;
}

window.onload = function () {

    status = document.getElementById("status");

    if (typeof MINIMASK !== "undefined") {

        MINIMASK.init(function (msg) {

            if (msg.event === "MINIMASK_INIT") {

                if (!msg.data || !msg.data.data || !msg.data.data.loggedon) {
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

function showSuccess() {
    const popup = document.getElementById("successPopup");

    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2500);
}

function sendTip(amount) {

    MINIMASK.account.getAddress(function (res) {

        const wallet = getWalletAddress(res);

        if (!wallet) {
            alert("Wallet error");
            return;
        }

        const state = {};
        state[0] = "tip";

        status.innerText = "⏳ Waiting...";

        MINIMASK.account.send(
            amount,
            ADDRESS,
            "0x00",
            state,
            function (resp) {

               if (resp.pending) {

    status.innerText = "⏳ Approve in MiniMask...";

} else if (resp.success) {

    status.innerText = "✅ Tip Sent!";
    showSuccess();

} else {

    status.innerText = "❌ Transaction Failed";
               }
            }
        );
    });
}

function sendCustom() {

    const val = document.getElementById("customAmount").value;

    if (!val || isNaN(val)) {
        alert("Enter valid amount");
        return;
    }

    sendTip(parseFloat(val));
}
