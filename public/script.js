const searchInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const suggestions = document.getElementById("suggestions");
const loading = document.getElementById("loading");

// Xử lý khi nhấn nút Tìm
sendButton.addEventListener("click", async () => {
    performSearch();
});

// Xử lý khi nhấn phím Enter trên toàn bộ trang
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // Kiểm tra nếu ô nhập liệu có giá trị và không có lỗi gợi ý
        const query = searchInput.value.trim();
        if (query) {
            event.preventDefault();  // Ngừng hành động mặc định của phím Enter
            performSearch();         // Gọi hàm tìm kiếm
        }
    }
});

// Hàm thực hiện tìm kiếm
async function performSearch() {
    const query = searchInput.value.trim();

    // Nếu không có từ khóa tìm kiếm, không làm gì
    if (!query) {
        chatBox.innerHTML = "<p>Vui lòng nhập tên danh lam để tìm kiếm.</p>";
        return;
    }

    // Ẩn phần gợi ý khi nhấn nút Tìm hoặc Enter
    suggestions.style.display = "none"; // Ẩn gợi ý khi thực hiện tìm kiếm

    // Hiển thị thông báo "Đang tìm kiếm..."
    loading.style.display = "block";
    chatBox.innerHTML = ""; // Xóa kết quả cũ trước khi hiển thị thông báo tìm kiếm

    try {
        const response = await fetch("http://localhost:3000/api/landmarks");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu trả về:", data); // Kiểm tra dữ liệu trả về
    
        // Tiến hành xử lý kết quả tìm kiếm
        const result = data.find((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    
        loading.style.display = "none";
    
        if (result) {
            chatBox.innerHTML = `
                <h3>${result.name}</h3>
                <p>${result.info}</p>
                <img src="${result.image}" alt="${result.name}" style="width:100%; border-radius: 8px;" />
            `;
        } else {
            chatBox.innerHTML = "<p>Không tìm thấy danh lam nào phù hợp. Bạn có thể thử lại với từ khóa khác.</p>";
        }
    } catch (error) {
        loading.style.display = "none";
        chatBox.innerHTML = "<p>Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.</p>";
        console.error("Lỗi khi fetch dữ liệu:", error);  // Log lỗi chi tiết
    }
}

// Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (!query) {
        suggestions.style.display = "none"; // Ẩn gợi ý khi không có từ khóa
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/landmarks");
        const data = await response.json();

        // Tìm các gợi ý phù hợp
        const matchingSuggestions = data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        // Hiển thị các gợi ý
        if (matchingSuggestions.length > 0) {
            suggestions.innerHTML = matchingSuggestions
                .map((item) => `<p>${item.name}</p>`)
                .join('');
            suggestions.style.display = "block"; // Hiển thị gợi ý khi có kết quả
        } else {
            suggestions.innerHTML = "<p class='empty'>Không có gợi ý nào.</p>";
            suggestions.style.display = "block"; // Hiển thị thông báo không có gợi ý
        }
    } catch (error) {
        console.error(error);
    }
});

// Lắng nghe sự kiện khi người dùng chọn một gợi ý
suggestions.addEventListener("click", (event) => {
    const suggestion = event.target;

    if (suggestion && suggestion.tagName === "P") {
        searchInput.value = suggestion.textContent;
        suggestions.style.display = "none"; // Ẩn gợi ý khi chọn gợi ý
    }
});