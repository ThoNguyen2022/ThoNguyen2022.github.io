function splitInfo() {
  const inputText = document.getElementById("inputText").value;
  // Tách văn bản thành các dòng và loại bỏ khoảng trắng thừa
  const lines = inputText.split("\n").map(line => line.trim()).filter(line => line);

  let name = "";
  let phone = "";
  let address = "";
  let otherLines = []; // Dùng để lưu các dòng còn lại

  // Vòng lặp đầu tiên: tìm số điện thoại và địa chỉ dựa trên keywords
  lines.forEach(line => {
    const lowerCaseLine = line.toLowerCase();
    
    // Tìm số điện thoại
    // Điều kiện: dòng chỉ chứa số hoặc có chứa các keyword "phone" hay "sdt"
    const phoneMatch = lowerCaseLine.match(/\b(0\d{9,10})\b/);
    if ((phoneMatch && line.length <= 15) || lowerCaseLine.includes("phone") || lowerCaseLine.includes("sdt")) {
      // Dùng regex để trích xuất số điện thoại từ dòng
      const number = line.match(/\d+/g);
      if (number) {
        phone = number.join("");
        return; // Đã tìm thấy, thoát khỏi forEach
      }
    }

    // Tìm địa chỉ
    // Điều kiện: dòng chứa số và các keyword "địa chỉ", "dc", hoặc "d/c"
    if (lowerCaseLine.includes("địa chỉ") || lowerCaseLine.includes("dc") || lowerCaseLine.includes("d/c") || lowerCaseLine.includes("đc")) {
      address = line;
      // Loại bỏ các từ khóa địa chỉ để giữ lại nội dung chính
      address = address.replace(/địa chỉ|d\/c|dc|đc|:/gi, '').trim();
      return;
    }
    
    // Lưu các dòng không phải sdt/địa chỉ vào mảng tạm
    otherLines.push(line);
  });

  // Gộp các dòng còn lại để tìm Tên
  // Giả định dòng đầu tiên trong các dòng còn lại là Tên
  if (otherLines.length > 0) {
    name = otherLines[0];
    
    // Gộp phần còn lại (nếu có) vào địa chỉ
    if (!address) {
      address = otherLines.slice(1).join(", ");
    }
  }

  // Cập nhật nội dung hiển thị ra giao diện
  document.getElementById("name").innerText = name || "Không có thông tin";
  document.getElementById("phone").innerText = phone || "Không có thông tin";
  document.getElementById("address").innerText = address || "Không có thông tin";
  
  // Hiển thị phần kết quả
  document.getElementById("outputSection").style.display = "block";
}

function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Đã sao chép!");
        })
        .catch((err) => {
            console.error("Không thể sao chép", err);
            alert("Không thể sao chép. Vui lòng thử lại!");
        });
}
