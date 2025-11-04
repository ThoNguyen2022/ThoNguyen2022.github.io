document.addEventListener('DOMContentLoaded', function() {
    // 1. Dữ liệu các dịch vụ
    const services = [
        { name: "Sửa Chữa Máy Lạnh", icon: "fas fa-snowflake", description: "Khắc phục mọi sự cố máy lạnh: không lạnh, chảy nước, kêu ồn, xì gas..." },
        { name: "Lắp Đặt & Di Dời", icon: "fas fa-wrench", description: "Lắp đặt, tháo dỡ và di dời máy lạnh, điều hòa các loại." },
        { name: "Vệ Sinh & Bảo Dưỡng", icon: "fas fa-broom", description: "Vệ sinh định kỳ giúp máy lạnh, máy giặt hoạt động hiệu quả, bền bỉ." },
        { name: "Sửa Chữa Tủ Lạnh", icon: "fas fa-fridge", description: "Sửa tủ lạnh không đông đá, không mát, rò rỉ gas, hỏng block..." },
        { name: "Sửa Chữa Máy Giặt", icon: "fas fa-washing-machine", description: "Khắc phục máy giặt không hoạt động, không vắt, tràn nước, kêu to..." },
        { name: "Sửa Chữa Máy Nước Nóng", icon: "fas fa-hot-tub", description: "Sửa máy nước nóng không nóng, rò rỉ điện, chập cháy..." }
    ];

    const serviceListContainer = document.querySelector('.service-list');

    // Hàm chèn dịch vụ vào HTML
    function renderServices() {
        if (serviceListContainer) {
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <i class="${service.icon}"></i>
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                `;
                serviceListContainer.appendChild(card);
            });
        }
    }

    // 2. Chức năng Slider cho Testimonials (Khách hàng nói gì)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-nav .dot');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }

    // Tự động chuyển slide mỗi 5 giây
    let slideInterval = setInterval(nextSlide, 5000);

    // Xử lý khi click vào dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval); // Dừng auto-slide khi người dùng tương tác
            currentSlide = parseInt(this.dataset.slide);
            showSlide(currentSlide);
            slideInterval = setInterval(nextSlide, 5000); // Khởi động lại auto-slide
        });
    });

    // 3. Cuộn mượt khi click vào các liên kết trong thanh điều hướng
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Điều chỉnh offset nếu có sticky header
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Thêm 20px padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Gọi các hàm khi DOM đã tải xong
    renderServices();
    if (testimonialCards.length > 0) {
        showSlide(currentSlide); // Hiển thị slide đầu tiên
    }
});
