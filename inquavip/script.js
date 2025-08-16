document.addEventListener('DOMContentLoaded', (event) => {
    // Add max value validation for length and width inputs
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const maxLength = 280;
    const maxWidth = 200;

    lengthInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value > maxLength) {
            this.value = maxLength;
        }
    });

    widthInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value > maxWidth) {
            this.value = maxWidth;
        }
    });

    // Event listener for the "Copy" buttons
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('copy-btn')) {
            const button = event.target;
            const row = button.closest('tr');

            if (row) {
                let textToCopy = '';
                row.querySelectorAll('.copy-cell').forEach(cell => {
                    textToCopy += cell.textContent.trim() + '\t';
                });
                textToCopy = textToCopy.trim();

                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        button.textContent = 'Copied!';
                        setTimeout(() => {
                            button.textContent = 'Copy';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                    });
            }
        }
    });

    // Fetch JSON data and create tables
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            createTable(data.thiet_ke, 'design-services', ['Dịch Vụ', 'Mô Tả', 'Giá (VNĐ)']);
            createTableInAn(data.in_an, 'printing-services', ['Sản Phẩm', 'Chất liệu', 'Giá (VND)']);
        })
        .catch(error => console.error('Error fetching JSON file:', error));
});

// Function to calculate price
function calculatePrice() {
    // Define prices
    const giayIn = 1200;
    const mucIn = 1200;
    const mangBong = 1500;
    const mangMo = 1000;
    const catMay = 200;
    const catKhuonLon = 300;
    const catKhuonNho = 100;
    const catThuCong = 500;
    const boGoc = 200;

    // Get values from input and select fields
    const quantity = document.getElementById('quantity').value;
    const length = document.getElementById('length').value;
    const width = document.getElementById('width').value;
    const doubleSided = document.getElementById('double-sided').value;
    const laminating = document.getElementById('laminating').value;
    const chonBoGoc = document.getElementById('bo-goc').value;

    // Convert string values to numbers
    const soLuong = parseInt(quantity);
    const chieuDai = parseInt(length);
    const chieuRong = parseInt(width);
    const soMat = parseInt(doubleSided);
    const yeuCauCanMang = laminating;

    // A4 paper dimensions
    const a4Length = 280; // mm
    const a4Width = 200; // mm

    // Validate number inputs
    if (isNaN(soLuong) || isNaN(chieuDai) || isNaN(chieuRong) || soLuong <= 0 || chieuDai <= 0 || chieuRong <= 0) {
        document.getElementById('price-result').textContent = 'Please enter valid number values.';
        return;
    }

    // --- START OF YOUR CALCULATION FORMULA ---

    // Method 1: Arrange by original orientation
    const hinhTheoChieuDai1 = Math.floor(a4Length / chieuDai);
    const hinhTheoChieuRong1 = Math.floor(a4Width / chieuRong);
    const tongHinh1 = hinhTheoChieuDai1 * hinhTheoChieuRong1;

    // Method 2: Arrange by rotating the image
    const hinhTheoChieuDai2 = Math.floor(a4Length / chieuRong);
    const hinhTheoChieuRong2 = Math.floor(a4Width / chieuDai);
    const tongHinh2 = hinhTheoChieuDai2 * hinhTheoChieuRong2;

    // Get the maximum number of images per sheet
    const soHinhToiDa = Math.max(tongHinh1, tongHinh2);
    const soToA4ToiThieu = Math.ceil(soLuong / soHinhToiDa);

    let tongGia = 0;
    // Paper cost
    tongGia += soToA4ToiThieu * giayIn;

    // Printing cost
    tongGia += soToA4ToiThieu * soMat * mucIn;

    // Lamination cost
    if (yeuCauCanMang === 'bong') {
        tongGia += soToA4ToiThieu * mangBong;
    } else if (yeuCauCanMang === 'mo') {
        tongGia += soToA4ToiThieu * mangMo;
    }

    // Cutting cost
    if ((chieuDai === 54 && chieuRong === 90) || (chieuDai === 90 && chieuRong === 54)) {
        tongGia += soLuong * catMay;
    } else if ((chieuDai === 54 && chieuRong === 85) || (chieuDai === 85 && chieuRong === 54)) {
        tongGia += soLuong * catKhuonLon;
    } else if ((chieuDai === 30 && chieuRong === 40) || (chieuDai === 40 && chieuRong === 30) || (chieuDai === 35 && chieuRong === 45) || (chieuDai === 45 && chieuRong === 35)) {
        tongGia += soLuong * catKhuonLon;
    } else {
        tongGia += soLuong * catThuCong;
    }

    // Corner rounding cost
    if (chonBoGoc === "yes") {
        tongGia += soLuong * boGoc;
    }

    tongGia /= 0.8;
    // Apply quantity discounts
    if (soToA4ToiThieu >= 30) {
        tongGia *= 0.8; // 20% discount
    } else if (soToA4ToiThieu >= 20) {
        tongGia *= 0.85; // 15% discount
    } else if (soToA4ToiThieu >= 10) {
        tongGia *= 0.9; // 10% discount
    } else if (soToA4ToiThieu >= 5) {
        tongGia *= 0.95; // 5% discount
    }

    // --- END OF YOUR CALCULATION FORMULA ---

    // Display result
    const boiSo = 500;
    const tongGiaLamTron = Math.ceil(tongGia / boiSo) * boiSo;
    document.getElementById('price-result').textContent = `Tổng giá: ${tongGiaLamTron.toLocaleString('vi-VN')} VNĐ`;
}

// Function to create a table from JSON data
function createTable(data, containerId, headerLabels) {
    const container = document.getElementById(containerId);
    let tableHTML = '<table><thead><tr>';

    // Create table headers
    headerLabels.forEach(label => {
        tableHTML += `<th>${label}</th>`;
    });
    tableHTML += '<th>Action</th>'; // Add "Action" header for the copy button
    tableHTML += '</tr></thead><tbody>';

    // Create data rows
    data.forEach(item => {
        tableHTML += '<tr>';
        for (const key in item) {
            tableHTML += `<td class="copy-cell">${item[key]}</td>`;
        }
        tableHTML += `<td><button class="copy-btn">Copy</button></td>`;
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    container.innerHTML += tableHTML;
}

// Function to create the printing services table
function createTableInAn(data, containerId, headerLabels) {
    const container = document.getElementById(containerId);
    let tableHTML = '<table><thead><tr>';

    // Create table headers from the provided array
    headerLabels.forEach(label => {
        tableHTML += `<th>${label}</th>`;
    });
    tableHTML += '<th>Action</th>';
    tableHTML += '</tr></thead><tbody>';

    // Create data rows, displaying only the specified columns
    data.forEach(item => {
        tableHTML += '<tr>';
        tableHTML += `<td class="copy-cell">${item.san_pham}</td>`;
        tableHTML += `<td class="copy-cell">${item.chat_lieu}</td>`;
        tableHTML += `<td class="copy-cell">${item.gia}</td>`;
        tableHTML += `<td><button class="copy-btn">Copy</button></td>`;
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    container.innerHTML += tableHTML;
}
