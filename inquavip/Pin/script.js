const slideTimers = [];

function startSlide(productIndex) {
    let imageIndex = 0;
    const imagesContainer = document.getElementById(`images-${productIndex}`);
    const images = imagesContainer.querySelectorAll('.product-image');
    
    if (slideTimers[productIndex]) {
        clearInterval(slideTimers[productIndex]);
    }

    slideTimers[productIndex] = setInterval(() => {
        images.forEach(img => img.classList.remove('active'));
        imageIndex = (imageIndex + 1) % images.length;
        images[imageIndex].classList.add('active');
    }, 1500); 
}

function stopSlide(productIndex) {
    clearInterval(slideTimers[productIndex]);
    const imagesContainer = document.getElementById(`images-${productIndex}`);
    const images = imagesContainer.querySelectorAll('.product-image');
    images.forEach(img => img.classList.remove('active'));
    images[0].classList.add('active');
}