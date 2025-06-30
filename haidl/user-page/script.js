function resetForm() {
	document.getElementById('catagoryName').value = '';
	document.getElementById('priceNumber').value = '';
	document.getElementById('statusName').value = '';
	document.getElementById('customerName').value = '';
	document.getElementById('customerInformation').value = '';
	document.getElementById('taskDetails').style.display = 'none';
	// Chọn tất cả các nút trạng thái
	const statusOptions = document.querySelectorAll('.status-option');

	// Đặt tất cả các nút trạng thái về trạng thái unchecked
	statusOptions.forEach(option => {
		const radioInput = option.querySelector('input[type="radio"]'); // Lấy radio input
		radioInput.checked = false; // Đặt trạng thái unchecked

		// Hiển thị bình thường (nếu có thể)
		option.style.display = 'block'; // Đảm bảo hiển thị
	});
	
	currentTaskId = null;
}

// Hàm để xóa dữ liệu từ Firebase
function viewTask(taskId) {
	const taskRef = firebase.database().ref('tasks/' + taskId); // Tham chiếu đến task cần cập nhật
	taskRef.once('value', function(snapshot) {
		const taskData = snapshot.val();
		
		// Điền thông tin vào các trường input
		document.getElementById('catagoryName').value = taskData.CatagoryName; 
		document.getElementById('priceNumber').value = taskData.PriceNumber;
		document.getElementById('statusName').value = taskData.StatusName; 
		document.getElementById('customerName').value = taskData.CustomerName; 
		document.getElementById('customerInformation').value = taskData.CustomerInformation; 
		
		// Cập nhật thông tin chi tiết công việc
		document.getElementById('creationDate').textContent = taskData.CreatedAt;
		document.getElementById('createdBy').textContent = taskData.CreatedBy; // Giả sử bạn đã lưu tên người tạo
		document.getElementById('updateDate').textContent = taskData.UpdatedAt || "Chưa cập nhật";
		document.getElementById('updateBy').textContent = taskData.UpdatedBy || "Chưa cập nhật";
		document.getElementById('additionalInfo').textContent = taskData.AdditionalInfo || "Không có thông tin bổ sung";
		
		// Hiển thị chi tiết công việc
		document.getElementById('taskDetails').style.display = 'block';
		document.getElementById('addNewTask').style.display = 'block';
		
		// Lưu lại taskId để sử dụng cho cập nhật sau này
		currentTaskId = taskId;
	});
}

// Hàm để xóa dữ liệu từ Firebase
function deleteTask(taskId) {
	const taskRef = firebase.database().ref('tasks/' + taskId); // Tham chiếu đến task cần xóa
	taskRef.remove()
		.then(function() {
			resetForm();
			loadData(); // Tải lại danh sách
			console.log('Tác vụ đã được xóa thành công:', taskId);
			// Cập nhật giao diện người dùng hoặc thông báo cho người dùng
		})
		.catch(function(error) {
			console.error('Lỗi khi xóa tác vụ:', error);
		});
}

// Hàm để load và sửa dữ liệu từ Firebase
function updateTask(taskId) {
	const taskRef = firebase.database().ref('tasks/' + taskId); // Tham chiếu đến task cần cập nhật
	taskRef.once('value', function(snapshot) {
		resetForm();
		const taskData = snapshot.val();
		
		// Điền thông tin vào các trường input
		document.getElementById('catagoryName').value = taskData.CatagoryName; 
		document.getElementById('priceNumber').value = taskData.PriceNumber;
		document.getElementById('statusName').value = taskData.StatusName; 
		document.getElementById('customerName').value = taskData.CustomerName; 
		document.getElementById('customerInformation').value = taskData.CustomerInformation; 
		
		// Hiển thị nút thêm việc
		document.getElementById('addNewTask').style.display = 'block';
		
		// Lưu lại taskId để sử dụng cho cập nhật sau này
		currentTaskId = taskId;
	});
}

document.querySelectorAll('.status-option input[type="radio"]').forEach(radio => {
	radio.addEventListener('change', function() {
		const statusOptions = document.querySelectorAll('.status-option');
		statusOptions.forEach(option => {
			option.style.display = 'none'; // Ẩn tất cả các khung
		});

		this.parentNode.style.display = 'block'; // Hiển thị khung của nút đã chọn

		// Thiết lập giá trị cho input statusName
		const statusNameInput = document.getElementById('statusName');
		statusNameInput.value = this.value; // Đặt giá trị
	});
});
function getStatusIcon(status) {
	if (status === "Hoàn thành") {
		return "fa-check-circle"; // Biểu tượng cho hoàn thành
	} else if (status === "Đang làm") {
		return "fa-spinner fa-spin"; // Biểu tượng cho đang làm
	} else if (status === "Chưa làm") {
		return "fa-pause-circle"; // Biểu tượng cho chưa làm
	}
	return ""; // Trả về rỗng nếu không có trạng thái
}

function getStatusColor(status) {
	if (status === "Hoàn thành") {
		return "green"; // Màu xanh cho hoàn thành
	} else if (status === "Đang làm") {
		return "orange"; // Màu cam cho đang làm
	} else if (status === "Chưa làm") {
		return "red"; // Màu đỏ cho chưa làm
	}
	return "gray"; // Màu xám nếu không có trạng thái
}
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

// Ghi dữ liệu vào Firebase
document.getElementById('submitBtn').addEventListener('click', function () {
	const catagoryName = document.getElementById('catagoryName').value;
	const priceNumber = document.getElementById('priceNumber').value;
	const statusName = document.getElementById('statusName').value || "Chưa làm";
	const customerName = document.getElementById('customerName').value;
	const customerInformation = document.getElementById('customerInformation').value;
	const currentTime = new Date();
	const timeString = currentTime.toLocaleTimeString();

	if (catagoryName && priceNumber) {
		if (currentTaskId != null)
		{
			const taskRef = firebase.database().ref('tasks/' + currentTaskId);
			taskRef.update({					
				CatagoryName: catagoryName,
				CatagoryName: catagoryName,
				PriceNumber: priceNumber,
				StatusName: statusName,
				CustomerName: customerName,
				CustomerInformation: customerInformation,
				UpdatedBy: userName,
				UpdatedAt: timeString
			})
			.then(() => {
				resetForm();
				loadData(); // Tải lại danh sách
			})
			.catch((error) => {
				console.error("Error saving data: ", error);
			});
		} else {
			const taskRef = firebase.database().ref('tasks').push(); 
		 const userName1 = localStorage.getItem('userName');
if (userName1) {
	document.getElementById('welcomeMessage').textContent = `Xin chào, ${userName1}!`;
} else {
	document.getElementById('welcomeMessage').textContent = 'Bạn chưa đăng nhập.';
}
			taskRef.set({					
				CatagoryName: catagoryName,
				CatagoryName: catagoryName,
				PriceNumber: priceNumber,
				StatusName: statusName,
				CustomerName: customerName,
				CustomerInformation: customerInformation,
				CreatedBy: userName1,
				CreatedAt: timeString
			})
			.then(() => {
				console.log("Data saved successfully.");
				resetForm();
				loadData(); // Tải lại danh sách
			})
			.catch((error) => {
				console.error("Error saving data: ", error);
			});
		}
	} else {
		console.log("Please fill in all fields.");
	}
});

function displayTasksForPage(page) {
	const startIndex = (page - 1) * tasksPerPage;
	const endIndex = startIndex + tasksPerPage;
	const dataList = document.getElementById('dataList');
	dataList.innerHTML = ''; // Xóa dữ liệu cũ

	taskList.slice(startIndex, endIndex).forEach(function (task) {
		let statusIconClass = getStatusIcon(task.StatusName);

		const row = document.createElement('tr');
		row.innerHTML = `
			<td><i class="fas ${statusIconClass}" style="font-size: 24px; color: ${getStatusColor(task.StatusName)};"></i></td>
			<td>${task.CatagoryName}</td>
			<td>${task.PriceNumber}</td>					
			<td>${task.CustomerName}</td>
			<td style="display: flex; align-items: left;">
				<i class="fas fa-eye" onclick="viewTask('${task.id}')" style="cursor: pointer; font-size: 24px; margin-right: 5px; color: blue;"></i>
				<i class="fas fa-edit" onclick="updateTask('${task.id}')" style="cursor: pointer; font-size: 24px; margin-right: 5px; color: orange;"></i>
				<i class="fas fa-trash" onclick="deleteTask('${task.id}')" style="cursor: pointer; font-size: 24px; color: red;"></i>
			</td>
		`;
		dataList.appendChild(row);
	});

	updatePagination();
}

// Hàm cập nhật các nút phân trang
function updatePagination() {
	const paginationContainer = document.getElementById('pagination');
	paginationContainer.innerHTML = '';

	// Tính tổng số trang
	const totalPages = Math.ceil(totalTasks / tasksPerPage);

	// Nút "Trang trước"
	if (currentPage > 1) {
		const prevButton = document.createElement('button');
		prevButton.textContent = 'Trang trước';
		prevButton.onclick = function () {
			currentPage--;
			displayTasksForPage(currentPage);
		};
		paginationContainer.appendChild(prevButton);
	}

	// Nút "Trang sau"
	if (currentPage < totalPages) {
		const nextButton = document.createElement('button');
		nextButton.textContent = 'Trang sau';
		nextButton.onclick = function () {
			currentPage++;
			displayTasksForPage(currentPage);
		};
		paginationContainer.appendChild(nextButton);
	}
}

// Hàm tải dữ liệu từ Firebase và chia thành các trang
function loadData() {
	const taskListRef = database.ref('tasks');
	taskListRef.once('value', function (snapshot) {
		taskList = [];
		snapshot.forEach(function (childSnapshot) {
			const task = childSnapshot.val();
			task.id = childSnapshot.key; // Thêm key Firebase làm id

			// Chỉ thêm các công việc chưa hoàn thành
			if (task.StatusName !== "Hoàn thành") {
				taskList.push(task);
			}
		});

		totalTasks = taskList.length; // Tổng số công việc chưa hoàn thành
		displayTasksForPage(currentPage); // Hiển thị trang đầu tiên
	});
}



// Hiển thị tên user từ localStorage
let currentTaskId = null;
loadData();
const userName = localStorage.getItem('userName');
if (userName) {
	document.getElementById('welcomeMessage').textContent = `Xin chào, ${userName}!`;
} else {
	document.getElementById('welcomeMessage').textContent = 'Bạn chưa đăng nhập.';
}

let statusClass = '';	
let tasksPerPage = 5;
let currentPage = 1;
let totalTasks = 0;
let taskList = [];		
