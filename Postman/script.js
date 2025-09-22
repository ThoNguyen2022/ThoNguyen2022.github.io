const methodSelect = document.getElementById('method');
const urlInput = document.getElementById('url');
const bodyTextarea = document.getElementById('body');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const responseContainer = document.getElementById('response-container');
const headersContainer = document.getElementById('headers-container');
const addHeaderBtn = document.getElementById('add-header-btn');
const curlInput = document.getElementById('curl-input');
const importCurlBtn = document.getElementById('import-curl-btn');
const toggleCurlBtn = document.getElementById('toggle-curl-btn');
const curlSectionContent = document.getElementById('curl-section-content');


// Toggle elements
const headersToggle = document.getElementById('headers-toggle');
const headersArrow = document.getElementById('headers-arrow');
const bodyToggle = document.getElementById('body-toggle');
const bodyContent = document.getElementById('body-content');
const bodyArrow = document.getElementById('body-arrow');
const bodySection = document.getElementById('body-section');

// Xử lý sự kiện ẩn/hiện phần nhập cURL
toggleCurlBtn.addEventListener('click', () => {
    curlSectionContent.classList.toggle('hidden');
});

// Xử lý sự kiện thu gọn/mở rộng Headers
headersToggle.addEventListener('click', () => {
    headersContainer.classList.toggle('hidden');
    addHeaderBtn.classList.toggle('hidden');
    headersArrow.classList.toggle('rotate-90');
});

// Xử lý sự kiện thu gọn/mở rộng Body
bodyToggle.addEventListener('click', () => {
    bodyContent.classList.toggle('hidden');
    bodyArrow.classList.toggle('rotate-90');
});

// Tùy chỉnh hiển thị Body dựa trên method
methodSelect.addEventListener('change', () => {
    if (methodSelect.value === 'POST') {
        bodySection.classList.remove('hidden');
        bodyContent.classList.remove('hidden'); // Mở rộng body khi chuyển sang POST
    } else {
        bodySection.classList.add('hidden');
    }
});

// Thêm một hàng header mới
addHeaderBtn.addEventListener('click', () => {
    addHeaderRow();
});

function addHeaderRow(key = '', value = '') {
    const headerRow = document.createElement('div');
    headerRow.classList.add('flex', 'items-center', 'space-x-2');
    headerRow.innerHTML = `
        <input type="text" placeholder="Khóa" class="header-key flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${key}">
        <input type="text" placeholder="Giá trị" class="header-value flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${value}">
        <button type="button" class="remove-header-btn px-2 py-1 text-gray-500 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    headersContainer.appendChild(headerRow);
    headerRow.querySelector('.remove-header-btn').addEventListener('click', () => {
        headerRow.remove();
    });
}

// Xử lý sự kiện tải lệnh cURL
importCurlBtn.addEventListener('click', () => {
    const curlCommand = curlInput.value.trim();
    if (!curlCommand) return;
    parseCurlCommand(curlCommand);
});

// Phân tích cú pháp lệnh cURL
function parseCurlCommand(command) {
    // Xóa headers hiện tại
    headersContainer.innerHTML = '';
    
    // Tìm URL bằng regex mạnh mẽ hơn
    const urlMatch = command.match(/(https?:\/\/[^\s"']+)/);
    const url = urlMatch ? urlMatch[1] : '';

    // Tìm phương thức HTTP
    const methodMatch = command.match(/-X\s+["']?(\S+)["']?/);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';

    // Tìm headers
    const headers = {};
    const headerMatches = command.matchAll(/-H\s+['"]([^'"]+)['"]/g);
    for (const match of headerMatches) {
        const [key, value] = match[1].split(':').map(s => s.trim());
        if (key && value) {
            headers[key] = value;
        }
    }

    // Tìm body
    let body = '';
    const bodyMatch = command.match(/--data(-raw)?\s+(['"])([\s\S]*?)\2/);
    if (bodyMatch) {
        body = bodyMatch[3].replace(/\\\n/g, '');
    }
    
    // Cập nhật các trường input
    urlInput.value = url;
    methodSelect.value = method;
    
    // Thêm lại headers
    headersContainer.innerHTML = '';
    for (const key in headers) {
        addHeaderRow(key, headers[key]);
    }
    
    // Hiển thị/ẩn body và cập nhật giá trị
    bodyTextarea.value = body;
    if (method === 'POST' || body) {
        methodSelect.value = 'POST';
        bodySection.classList.remove('hidden');
        bodyContent.classList.remove('hidden');
        bodyArrow.classList.remove('rotate-90');
    } else {
        bodySection.classList.add('hidden');
        bodyTextarea.classList.add('hidden');
    }
}

// Gọi hàm để có 1 hàng header mặc định ban đầu
addHeaderRow();

// Xử lý sự kiện click nút gửi
sendBtn.addEventListener('click', async () => {
    const method = methodSelect.value;
    const url = urlInput.value.trim();
    const body = bodyTextarea.value.trim();
    
    if (!url) {
        showResponse('Vui lòng nhập URL!', 'error');
        return;
    }

    // Lấy tất cả headers từ các trường input
    const headerInputs = document.querySelectorAll('.header-key');
    const headers = new Headers();
    headerInputs.forEach(input => {
        const key = input.value.trim();
        const value = input.nextElementSibling.value.trim();
        if (key && value) {
            headers.append(key, value);
        }
    });

    // Nếu là POST, thêm Content-Type nếu chưa có
    if (method === 'POST' && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
    }

    // Hiển thị trạng thái đang tải
    btnText.textContent = 'Đang gửi...';
    loader.classList.remove('hidden');
    sendBtn.disabled = true;

    try {
        const options = {
            method: method,
            headers: headers
        };
        
        if (method === 'POST') {
            options.body = body;
        }

        const response = await fetch(url, options);
        
        // Cố gắng parse JSON, nếu không được thì trả về text
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            showResponse(JSON.stringify(data, null, 2), 'success');
        } else {
            data = await response.text();
            showResponse(data, 'success');
        }
        
    } catch (error) {
        showResponse('Lỗi: ' + error.message, 'error');
    } finally {
        // Kết thúc trạng thái tải
        btnText.textContent = 'Gửi';
        loader.classList.add('hidden');
        sendBtn.disabled = false;
    }
});

// Hiển thị phản hồi trong container
function showResponse(text, type) {
    responseContainer.textContent = text;
    if (type === 'error') {
        responseContainer.style.backgroundColor = '#fee2e2';
        responseContainer.style.color = '#dc2626';
    } else {
        responseContainer.style.backgroundColor = '#1f2937';
        responseContainer.style.color = '#f9fafb';
    }
}
