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

// Đường dẫn tương đối tới file data.json
fetch('./assets/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dữ liệu JSON:', data);
        // Xử lý dữ liệu JSON tại đây
    })
    .catch(error => {
        console.error('Có lỗi xảy ra khi tải dữ liệu:', error);
    });

// Dữ liệu JSON
const places = [
    {
        "name": "Hồ Núi Cốc",
        "info": "Hồ Núi Cốc là địa danh nổi tiếng tại Thái Nguyên, nằm ở huyện Đại Từ. Đây là một hồ nước nhân tạo gắn liền với truyền thuyết tình yêu Chàng Cốc và Nàng Công.",
        "image": "assets/images/ho_nui_coc.jpg"
    },
    {
        "name": "Hang Phượng Hoàng",
        "info": "Hang Phượng Hoàng thuộc huyện Võ Nhai, là một danh thắng nổi tiếng với khung cảnh thiên nhiên hùng vĩ và câu chuyện lịch sử đầy thú vị.",
        "image": "assets/images/hang_phuong_hoang.jpg"
    },
    {
        "name": "Suối Mỏ Gà",
        "info": "Suối Mỏ Gà nằm gần Hang Phượng Hoàng, là điểm đến lý tưởng với làn nước mát lành giữa thiên nhiên hoang sơ.",
        "image": "assets/images/suoi_mo_ga.jpg"
    },
    {
        "name": "Đền Đuổm",
        "info": "Đền Đuổm tọa lạc tại huyện Phú Lương, là nơi thờ tự Lưu Nhân Chú, một vị tướng nổi tiếng thời nhà Lê.",
        "image": "assets/images/den_duom.jpg"
    },
    {
        "name": "Suối Cửa Tử",
        "info": "Suối Cửa Tử ở huyện Đại Từ là một dòng suối trong xanh, nơi thu hút du khách yêu thích trekking và khám phá thiên nhiên.",
        "image": "assets/images/suoi_cua_tu.jpg"
    },
    {
        "name": "Thác Mưa Rơi",
        "info": "Thác Mưa Rơi nằm trong huyện Võ Nhai, với dòng thác trắng xóa đổ xuống tạo nên khung cảnh nên thơ, yên bình.",
        "image": "assets/images/thac_mua_roi.jpg"
    },
    {
        "name": "Đồi chè Tân Cương",
        "info": "Đồi chè Tân Cương thuộc thành phố Thái Nguyên, nổi tiếng với những đồi chè xanh mướt và chất lượng chè hảo hạng.",
        "image": "assets/images/doi_che_tan_cuong.jpg"
    },
    {
        "name": "Động Linh Sơn",
        "info": "Động Linh Sơn nằm trong lòng núi, mang vẻ đẹp huyền bí và là điểm tham quan hấp dẫn tại thành phố Thái Nguyên.",
        "image": "assets/images/dong_linh_son.jpg"
    },
    {
        "name": "Suối Lạnh",
        "info": "Suối Lạnh ở thành phố Phổ Yên là nơi nghỉ dưỡng lý tưởng với khung cảnh thiên nhiên trong lành, mát mẻ.",
        "image": "assets/images/suoi_lanh.jpg"
    }
];

// Hiển thị gợi ý từ dữ liệu JSON
const suggestionsDiv = document.getElementById('suggestions');
places.forEach(place => {
    const suggestion = document.createElement('div');
    suggestion.classList.add('suggestion-item');
    suggestion.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.info}</p>
        <img src="${place.image}" alt="${place.name}" style="width: 200px; height: auto;">
    `;
    suggestionsDiv.appendChild(suggestion);
});

