document.getElementById('start-scan').addEventListener('click', function() {
    startScanner();
});

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container') // Container for scanning
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "code_39_reader"] // EAN barcode reader
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Scanner started");
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        document.getElementById('code_result').textContent = "Mã: " + code;
        checkInventory(code);
    });
}

function checkInventory(barcode) {
    fetch('inventory.json')
        .then(response => response.json())
        .then(data => {
            let item = data.find(product => product.barcode === barcode);
            if (item) {
                document.getElementById('result').textContent = `Name: ${item.name}, Price: ${item.price}, Stock: ${item.stock}`;
            } else {
                document.getElementById('result').textContent = "Item not found!";
            }
        });
}
