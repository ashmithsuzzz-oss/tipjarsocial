const ADDRESS = "MxG086HDR94WWW3ZJE24E807D5SQ7F5WUDQFNN9N221P89D698ZET9YK8832YJQ";
const PRICE = 0.0000001;

let pixels = {};
let tipStatus;
let wallStatus;

function getWalletAddress(res) {
    if (!res || !res.status) return null;
    const d = res.data;
    if (typeof d === "string") return d;
    if (typeof d === "object") return d.address || d.data;
    return null;
}

// INIT
window.onload = function () {

    tipStatus = document.getElementById("tipStatus");
    wallStatus = document.getElementById("wallStatus");

    if (typeof MINIMASK !== "undefined") {

        MINIMASK.init(function (msg) {

            if (msg.event === "MINIMASK_INIT") {

                if (!msg.data || !msg.data.data || !msg.data.data.loggedon) {
                    tipStatus.innerText = "❌ Not logged in";
                    wallStatus.innerText = "❌ Not logged in";
                    return;
                }

                tipStatus.innerText = "✅ Connected";
                wallStatus.innerText = "✅ Connected";

                loadPixels();
            }

            if (msg.event === "MINIMASK_PENDING") {
                setTimeout(loadPixels, 6000);
            }
        });

    } else {
        tipStatus.innerText = "❌ MiniMask not found";
        wallStatus.innerText = "❌ MiniMask not found";
    }

    createGrid();
};

// ================= TIP =================
function showSuccess() {
    const popup = document.getElementById("successPopup");
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("hidden"), 2500);
}

function sendTip(amount) {

    MINIMASK.account.getAddress(function (res) {

        const wallet = getWalletAddress(res);
        if (!wallet) return alert("Wallet error");

        const state = {};
        state[0] = "tip";

        tipStatus.innerText = "⏳ Waiting...";

        MINIMASK.account.send(amount, ADDRESS, "0x00", state, function (resp) {

            if (resp.pending) {
                tipStatus.innerText = "⏳ Approve in MiniMask...";
            } 
            else if (resp.success) {
                tipStatus.innerText = "✅ Tip Sent!";
                showSuccess();
            } 
            else {
                tipStatus.innerText = "❌ Failed";
            }
        });
    });
}

function sendCustom() {
    const val = document.getElementById("customAmount").value;
    if (!val || isNaN(val)) return alert("Enter valid amount");
    sendTip(parseFloat(val));
}

// ================= WALL =================
function createGrid() {

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {

            const div = document.createElement("div");
            div.className = "pixel";

            const key = x + "," + y;

            if (pixels[key]) {
                div.style.background = pixels[key];
            }

            div.onclick = () => paintPixel(x, y);

            grid.appendChild(div);
        }
    }
}

function paintPixel(x, y) {

    MINIMASK.account.getAddress(function (res) {

        const wallet = getWalletAddress(res);
        if (!wallet) return alert("Wallet error");

        let color = document.getElementById("colorPicker").value.replace("#", "");

        const state = {};
        state[99] = x + "," + y + "|" + color;

        MINIMASK.account.send(PRICE, ADDRESS, "0x00", state, function (resp) {

            if (resp.pending) {
                alert("Approve in MiniMask");
                setTimeout(loadPixels, 6000);
            } else {
                alert("Error");
            }
        });
    });
}

function loadPixels() {

    MINIMASK.meg.listcoins(ADDRESS, "0x00", "", function (resp) {

        pixels = {};

        if (!resp || !resp.data) {
            createGrid();
            return;
        }

        for (let coin of resp.data) {

            if (!coin.state) continue;

            for (let key in coin.state) {

                let raw = coin.state[key];
                if (!raw) continue;

                try { raw = decodeURI(raw); } catch {}

                const parts = String(raw).split("|");

                if (parts.length >= 2) {
                    pixels[parts[0]] = "#" + parts[1];
                }
            }
        }

        createGrid();
    });
}

setInterval(loadPixels, 8000);
