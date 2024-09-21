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
    // Tìm sản phẩm dựa trên mã quét được
    const item = inventory.find(item => item.code === code);
    const resultElement = document.getElementById('result');
    
    if (item) {
        resultElement.textContent = `Found: ${item.name} - Quantity: ${item.quantity}`;
    } else {
        resultElement.textContent = "Not found item";
    }
}

// Cấu hình và khởi chạy QR code scanner
const qrCodeScanner = new Html5QrcodeScanner("scanner-container", { 
    fps: 10, 
    qrbox: { width: 250, height: 250 } 
});

qrCodeScanner.render((qrCodeMessage) => {
    const resultElement = document.getElementById('code_result');
    resultElement.textContent = "Code: " + qrCodeMessage;
    checkInventory(qrCodeMessage); // Gọi hàm kiểm tra mã QR
}, (errorMessage) => {
    console.error(`QR scan failed: ${errorMessage}`);
});
