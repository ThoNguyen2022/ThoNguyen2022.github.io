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

                    // Tính toán kích thước mới
                    let newWidth, newHeight;

                    if (ratioWidth / ratioHeight > originalWidth / originalHeight) {
                        // Nếu tỷ lệ mới rộng ít hơn thì mở rộng chiều rộng
						newHeight = (originalWidth * ratioHeight) / ratioWidth;
						newWidth = originalWidth;                        
                    } else {
                        // Nếu tỷ lệ mới dài hơn thì mở rộng chiều dài
                        newWidth = (originalHeight * ratioWidth) / ratioHeight;
                        newHeight = originalHeight;
                    }

                    // Tạo canvas mới để vẽ
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Tính toán offset để căn giữa ảnh
                    const offsetX = (canvas.width - originalWidth) / 2;
                    const offsetY = (canvas.height - originalHeight) / 2;

                    // Vẽ ảnh lên canvas
                    ctx.drawImage(img, offsetX, offsetY, originalWidth, originalHeight);

                    // Tải ảnh về
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
