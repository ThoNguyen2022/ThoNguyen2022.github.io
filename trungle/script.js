function saveInvoice() {
    const invoice = document.getElementById('invoice');
    html2canvas(invoice).then(canvas => {
        const link = document.createElement('a');
        link.download = 'invoice.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Load the html2canvas library
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.head.appendChild(script);
