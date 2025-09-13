// Hàm đã có sẵn để xử lý text và tạo JSON
function processText() {
    const text = document.getElementById('inputText').value;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    const data = {
        CauHoi: "",
        DichCauHoi: "",
        CauTraLoi: [],
        DapAn: "",
        GiaiThich: ""
    };

    let currentSection = '';

    for (const line of lines) {
        if (line.startsWith('Câu hỏi:')) {
            const match = line.match(/"(.*?)"\s*\((.*?)\)/);
            if (match) {
                data.CauHoi = match[1];
                data.DichCauHoi = match[2];
            }
            currentSection = 'question';
        } else if (line.startsWith('Các lựa chọn:')) {
            currentSection = 'options';
        } else if (line.startsWith('Đáp án đúng:')) {
            currentSection = 'answer';
            const parts = line.substring('Đáp án đúng:'.length).trim().split('. ');
            if (parts.length > 0) {
                data.DapAn = parts[0].trim();
                if (parts.length > 1) {
                    data.GiaiThich = parts.slice(1).join('. ').trim();
                }
            }
        } else {
            if (currentSection === 'options') {
                const match = line.match(/^([A-Z]\. )(.*?)\s*\((.*?)\)$/);
                if (match) {
                    data.CauTraLoi.push({
                        TraLoi: match[1] + match[2].trim(),
                        Dich: match[3].trim()
                    });
                }
            }
        }
    }

    const jsonString = JSON.stringify(data, null, 2);
    document.getElementById('resultJson').textContent = jsonString;
}

// Hàm copy JSON (đã có)
function copyJson() {
    const resultElement = document.getElementById('resultJson');
    const jsonText = resultElement.textContent;
    const copyButton = document.getElementById('copyButton');
    
    if (jsonText.trim() === '') {
        return;
    }

    navigator.clipboard.writeText(jsonText).then(() => {
        copyButton.classList.add('copied');
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 3000);
    }).catch(err => {});
}

// HÀM MỚI: copy nội dung từ file prompt.txt
async function copyPrompt() {
    const copyPromptButton = document.getElementById('copyPrompt');
    try {
        // Sử dụng fetch để đọc nội dung từ file prompt.txt
        const response = await fetch('prompt.txt');
        if (!response.ok) {
            throw new Error('Lỗi khi tải file prompt.txt. Hãy đảm bảo file tồn tại.');
        }
        const promptText = await response.text();
        
        // Sao chép nội dung vào clipboard
        await navigator.clipboard.writeText(promptText);
        
        // Kích hoạt hiệu ứng màu đỏ
        copyPromptButton.classList.add('copied');
        setTimeout(() => {
            copyPromptButton.classList.remove('copied');
        }, 3000);
    } catch (error) {
        // Xử lý lỗi nếu fetch hoặc copy thất bại
        console.error('Lỗi khi sao chép prompt:', error);
    }
}