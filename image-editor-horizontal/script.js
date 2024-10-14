document.getElementById('uploadImages').addEventListener('change', function (event) {
    const files = event.target.files;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let maxWidth = parseInt(document.getElementById('widthInput').value);
    let maxHeight = parseInt(document.getElementById('heightInput').value);
    const rotationAngle = parseInt(document.getElementById('rotateInput').value);
    const flipOption = document.getElementById('flipOption').value;
	let needToRotate = 0;

    if (isNaN(maxWidth) || isNaN(maxHeight) || maxWidth <= 0 || maxHeight <= 0) {
        alert('Please enter valid max width and height values.');
        return;
    }

    function resizeImage(img) {
		console.log(img.width, img.height);
		if (img.width < img.height)
		{
			needToRotate = 90;
			let temp = maxWidth;
			maxWidth = maxHeight;			
			maxHeight = temp;
		}
		
        const imgRatio = maxWidth / maxHeight;
        let newWidth = img.width;
        let newHeight = img.height;

        if (newWidth / imgRatio > newHeight) {
            newWidth = newHeight * imgRatio;
        } else {
            newHeight = newWidth / imgRatio;
        }
		
        return { newWidth, newHeight };
    }

    function processImage(file) {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const { newWidth, newHeight } = resizeImage(img);
				
				if (newWidth < newHeight)
				{
					canvas.height = newWidth;
					canvas.width = newHeight;
				} else {				
					canvas.width = newWidth;
					canvas.height = newHeight;
				}

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);

                if (flipOption === 'horizontal') {
                    ctx.scale(-1, 1);
                } else if (flipOption === 'vertical') {
                    ctx.scale(1, -1);
                }
			
                ctx.rotate(needToRotate * Math.PI / 180);
                ctx.drawImage(img, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
                ctx.restore();

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
