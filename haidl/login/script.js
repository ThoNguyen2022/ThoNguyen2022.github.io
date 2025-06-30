// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Xử lý đăng nhập
document.getElementById('loginBtn').addEventListener('click', function () {
    const userName = document.getElementById('userNameInput').value;
    const passWord = document.getElementById('passWordInput').value;

    if (userName && passWord) {
        const userListRef = firebase.database().ref('users');
        
        // Tìm kiếm user trong Firebase
        userListRef.once('value', function(snapshot) {
            let loginSuccess = false;

            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                // Kiểm tra xem username và password có khớp không
                if (childData.UserName === userName && childData.PassWord === passWord) {
                    loginSuccess = true;
                }
            });

            if (loginSuccess) {
                // Lưu thông tin vào localStorage
                localStorage.setItem('userName', userName);
                
                document.getElementById('loginMessage').textContent = 'Đăng nhập thành công!';
                // Chuyển hướng đến trang khác (ví dụ: welcome.html)
                window.location.href = '../user-page/index.html';
            } else {
                document.getElementById('loginMessage').textContent = 'Tên đăng nhập hoặc mật khẩu không đúng.';
            }
        });
    } else {
        document.getElementById('loginMessage').textContent = 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.';
    }
});
