let inventory = [];

// Tải dữ liệu từ inventory.json
fetch('inventory.json')
    .then(response => response.json())
    .then(data => {
        inventory = data;
        createButtons(); // Tạo các nút khi dữ liệu đã được tải
    })
    .catch(error => {
        console.error("Error loading inventory:", error);
    });

function createButtons() {
    const buttonContainer = document.getElementById('data-stored');
    inventory.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.name;
        button.dataset.code = item.code; // Lưu mã tương ứng vào thuộc tính dữ liệu
        button.classList.add('data-stored-button'); // Thêm class cho nút
        buttonContainer.appendChild(button);
    });
}

function checkInventory(code) {
    const itemCode = code.length === 13 ? code.substring(0, 12) : code; // Lấy 12 số đầu tiên
    const item = inventory.find(item => item.code === itemCode);
    const resultElement = document.getElementById('result');
    
    if (item) {
        resultElement.textContent = `Found: ${item.name} - Quantity: ${item.quantity}`;
        highlightButton(item.code); // Gọi hàm để tô màu nút
    } else {
        resultElement.textContent = "Not found item";
    }
}
function highlightButton(code) {
    const buttons = document.querySelectorAll('.data-stored-button');
    buttons.forEach(button => {
        if (button.dataset.code === code) {
            button.style.backgroundColor = 'green'; // Tô màu nút thành xanh
        }
    });
}

// Khởi chạy scanner
Quagga.init({
    inputStream: {
        type: "LiveStream",
        target: document.querySelector('#scanner-container'),
        constraints: {
            facingMode: "environment" // Sử dụng camera chính
        },
    },
    decoder: {
        readers: ["ean_reader"] // Đảm bảo sử dụng đúng reader
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
