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

// Hàm để tải dữ liệu từ Firebase
document.getElementById('loadDataBtn').addEventListener('click', function () {
    loadData();
});

// Ghi dữ liệu vào Firebase
document.getElementById('submitBtn').addEventListener('click', function () {
    const userName = document.getElementById('userNameInput').value;
    const passWord = document.getElementById('passWordInput').value;
    const role = document.getElementById('roleInput').value || 'user';

    if (userName && passWord) {
        const userListRef = firebase.database().ref('users');
        const newUserRef = userListRef.push();

        newUserRef.set({
            UserName: userName,
            PassWord: passWord,
            Role: role
        })
        .then(() => {
            console.log("Data written successfully.");
            document.getElementById('userNameInput').value = '';
            document.getElementById('passWordInput').value = '';
            document.getElementById('roleInput').value = '';
            loadData();
        })
        .catch((error) => {
            console.error("Error writing data: ", error);
        });
    } else {
        console.log("Please fill in both fields.");
    }
});

// Hàm để xóa dữ liệu từ Firebase
function deleteUser(userId) {
    const userRef = firebase.database().ref('users/' + userId);
    userRef.remove()
    .then(() => {
        console.log("Data deleted successfully.");
        loadData();
    })
    .catch((error) => {
        console.error("Error deleting data: ", error);
    });
}

// Hàm để tải dữ liệu từ Firebase và hiển thị
function loadData() {
    const userListRef = database.ref('users');
    userListRef.once('value', function(snapshot) {
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = '';

        snapshot.forEach(function(childSnapshot) {
            const childData = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.textContent = `
                Tên đăng nhập: ${childData.UserName},
                Mật khẩu: ${childData.PassWord},
                Quyền: ${childData.Role}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteUser(childSnapshot.key);
            };

            listItem.appendChild(deleteButton);
            dataList.appendChild(listItem);
        });
    });
}
