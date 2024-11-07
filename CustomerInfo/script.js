function splitInfo() {
    const inputText = document.getElementById("inputText").value;
    const lines = inputText.split("\n").map(line => line.trim()).filter(line => line);

    let name = "";
    let phone = "";
    let address = "";

    lines.forEach((line, index) => {
        if (/^\d{9,11}$/.test(line.replace(/\s/g, "")) && phone === "") {
            phone = line;
        } else if (index === lines.length - 1) {
            name = line;
        } else if (line.split(" ").length <= 4 && name === "") {
            name = line;
        } else {
            address += (address ? ", " : "") + line;
        }
    });

    document.getElementById("name").innerText = name || "Không có thông tin";
    document.getElementById("phone").innerText = phone || "Không có thông tin";
    document.getElementById("address").innerText = address || "Không có thông tin";

    document.getElementById("outputSection").style.display = "block";
}

function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Đã sao chép!");
        })
        .catch((err) => {
            console.error("Không thể sao chép", err);
        });
}
