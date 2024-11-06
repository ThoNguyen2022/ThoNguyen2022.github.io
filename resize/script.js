document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadImages').addEventListener('change', function (event) {
        const files = event.target.files;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        function processImage(file) {
            const reader = new FileReader();
            
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    const originalWidth = img.width;
                    const originalHeight = img.height;

                    // Nhập tỷ lệ từ input
                    const ratioWidth = parseInt(document.getElementById('widthInput').value);
                    const ratioHeight = parseInt(document.getElementById('heightInput').value);
                    
                    if (isNaN(ratioWidth) || isNaN(ratioHeight) || ratioWidth <= 0 || ratioHeight <= 0) {
                        alert('Please enter valid width and height values.');
                        return;
                    }

                    // Tính toán kích thước mới (với tỷ lệ người dùng nhập)
                    let newWidth = ratioWidth;
                    let newHeight = ratioHeight;

                    // Cập nhật kích thước canvas để vừa vặn với ảnh sau khi resize
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Vẽ ảnh lên canvas mà không có khoảng trống
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Tải ảnh đã chỉnh sửa
                    canvas.toBlob(function (blob) {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = `edited_${file.name}`;
                        downloadLink.click();
                    });
                };

                img.onerror = function () {
                    console.error(`Error loading image ${file.name}`);
                };
            };

            reader.onerror = function () {
                console.error(`Error reading file ${file.name}`);
            };

            reader.readAsDataURL(file);
        }

        Array.from(files).forEach((file) => {
            processImage(file);
        });
    });
});
