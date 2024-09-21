let inventory = [];

// Tải dữ liệu từ inventory.json
fetch('inventory.json')
    .then(response => response.json())
    .then(data => {
        inventory = data;
    })
    .catch(error => {
        console.error("Error loading inventory:", error);
    });

function checkInventory(code) {
    const item = inventory.find(item => item.code === code);
    const resultElement = document.getElementById('result');
    
    if (item) {
        resultElement.textContent = `Found: ${item.name} - Quantity: ${item.quantity}`;
    } else {
        resultElement.textContent = "Not found item";
    }
}

// Khởi chạy scanner
Quagga.init({
    inputStream: {
        type: "LiveStream",
        target: document.querySelector('#scanner-container'),
    },
    decoder: {
        readers: ["ean_reader"] // Sử dụng mã vạch EAN-13
    }
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    Quagga.start();
});

// Khi Quagga phát hiện mã vạch, gọi hàm checkInventory
Quagga.onDetected(function(result) {
    const code = result.codeResult.code;
    const resultElement = document.getElementById('code_result');
    resultElement.textContent = "Code: " + code;
    if (code != null)
    {
        checkInventory(code);
    }
});
