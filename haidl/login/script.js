// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgvVCGRl25CLSgNpLyut_Ezpl9n7Mffj8",
    authDomain: "haidl-2024.firebaseapp.com",
    databaseURL: "https://haidl-2024-default-rtdb.firebaseio.com",
    projectId: "haidl-2024",
    storageBucket: "haidl-2024.appspot.com",
    messagingSenderId: "486702312435",
    appId: "1:486702312435:web:cdf85f8b5f4883a9c8c086",
    measurementId: "G-HYDKHDSG5T"
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
                window.location.href = ''../user-page/index.html''; 
            } else {
                document.getElementById('loginMessage').textContent = 'Tên đăng nhập hoặc mật khẩu không đúng.';
            }
        });
    } else {
        document.getElementById('loginMessage').textContent = 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.';
    }
});
