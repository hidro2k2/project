// const searchInput = document.getElementById("user-input");
// const sendButton = document.getElementById("send-btn");
// const chatBox = document.getElementById("chat-box");
// const suggestions = document.getElementById("suggestions");
// const loading = document.getElementById("loading");

// // URL của file JSON trên GitHub
// const DATA_URL = "https://raw.githubusercontent.com/hidro2k2/project/main/public/assets/data.json";
// // const DATA_URL = "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/hidro2k2/project/main/public/assets/data.json";

// // Xử lý khi nhấn nút Tìm
// sendButton.addEventListener("click", async () => {
//     performSearch();
// });

// // Xử lý khi nhấn phím Enter trên toàn bộ trang
// document.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//         const query = searchInput.value.trim();
//         if (query) {
//             event.preventDefault();
//             performSearch();
//         }
//     }
// });

// // Hàm thực hiện tìm kiếm
// async function performSearch() {
//     const query = searchInput.value.trim();

//     if (!query) {
//         chatBox.innerHTML = "<p>Vui lòng nhập tên danh lam để tìm kiếm.</p>";
//         return;
//     }

//     suggestions.style.display = "none"; 
//     loading.style.display = "block";
//     chatBox.innerHTML = ""; 

//     try {
//         const response = await fetch(DATA_URL);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("Dữ liệu trả về:", data);

//         const result = data.find((item) =>
//             item.name.toLowerCase().includes(query.toLowerCase())
//         );

//         loading.style.display = "none";

//         if (result) {
//             chatBox.innerHTML = `
//                 <h3>${result.name}</h3>
//                 <p>${result.info}</p>
//                 <img src="${result.image}" alt="${result.name}" style="width:100%; border-radius: 8px;" />
//             `;
//         } else {
//             chatBox.innerHTML = "<p>Không tìm thấy danh lam nào phù hợp. Bạn có thể thử lại với từ khóa khác.</p>";
//         }
//     } catch (error) {
//         loading.style.display = "none";
//         chatBox.innerHTML = "<p>Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.</p>";
//         console.error("Lỗi khi fetch dữ liệu:", error);
//     }
// }

// // Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
// searchInput.addEventListener("input", async () => {
//     const query = searchInput.value.trim();

//     if (!query) {
//         suggestions.style.display = "none";
//         return;
//     }

//     try {
//         const response = await fetch(DATA_URL);
//         const data = await response.json();

//         const matchingSuggestions = data.filter((item) =>
//             item.name.toLowerCase().includes(query.toLowerCase())
//         );

//         if (matchingSuggestions.length > 0) {
//             suggestions.innerHTML = matchingSuggestions
//                 .map((item) => `<p>${item.name}</p>`)
//                 .join('');
//             suggestions.style.display = "block";
//         } else {
//             suggestions.innerHTML = "<p class='empty'>Không có gợi ý nào.</p>";
//             suggestions.style.display = "block";
//         }
//     } catch (error) {
//         console.error(error);
//     }
// });

// // Lắng nghe sự kiện khi người dùng chọn một gợi ý
// suggestions.addEventListener("click", (event) => {
//     const suggestion = event.target;

//     if (suggestion && suggestion.tagName === "P") {
//         searchInput.value = suggestion.textContent;
//         suggestions.style.display = "none";
//     }
// });

// //gợi ý biến mất khi nhấp ra ngoài
// document.addEventListener('click', (event) => {
//     if (!suggestions.contains(event.target) && event.target !== searchInput) {
//         suggestions.style.display = 'none';
//     }
// });

const searchInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const suggestions = document.getElementById("suggestions");
const loading = document.getElementById("loading");

let selectedSuggestionIndex = -1; // Để theo dõi gợi ý được chọn

// URL của file JSON trên GitHub
const DATA_URL = "https://raw.githubusercontent.com/hidro2k2/project/main/public/assets/data.json";

// Xử lý khi nhấn nút Tìm
sendButton.addEventListener("click", async () => {
    performSearch();
});

// Xử lý khi nhấn phím Enter trên toàn bộ trang
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            event.preventDefault();
            performSearch();
        }
    }
});

// Hàm thực hiện tìm kiếm
async function performSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        chatBox.innerHTML = "<p>Vui lòng nhập tên danh lam để tìm kiếm.</p>";
        return;
    }

    suggestions.style.display = "none"; 
    loading.style.display = "block";
    chatBox.innerHTML = ""; 

    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu trả về:", data);

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
        console.error("Lỗi khi fetch dữ liệu:", error);
    }
}

// Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (!query) {
        suggestions.style.display = "none";
        return;
    }

    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();

        const matchingSuggestions = data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        if (matchingSuggestions.length > 0) {
            suggestions.innerHTML = matchingSuggestions
                .map((item, index) => `<p data-index="${index}">${item.name}</p>`)
                .join('');
            suggestions.style.display = "block";
        } else {
            suggestions.innerHTML = "<p class='empty'>Không có gợi ý nào.</p>";
            suggestions.style.display = "block";
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
        suggestions.style.display = "none";
        selectedSuggestionIndex = -1; // Reset khi chọn
    }
});

// Lắng nghe các phím mũi tên lên/xuống và Enter để điều hướng giữa các gợi ý
document.addEventListener("keydown", (event) => {
    const suggestionItems = suggestions.querySelectorAll("p");

    if (event.key === "ArrowDown") {
        if (selectedSuggestionIndex < suggestionItems.length - 1) {
            selectedSuggestionIndex++;
            updateSelectedSuggestion();
        }
    } else if (event.key === "ArrowUp") {
        if (selectedSuggestionIndex > 0) {
            selectedSuggestionIndex--;
            updateSelectedSuggestion();
        }
    } else if (event.key === "Enter" && selectedSuggestionIndex >= 0) {
        // Chọn gợi ý và ẩn các gợi ý
        searchInput.value = suggestionItems[selectedSuggestionIndex].textContent;
        suggestions.style.display = "none";
    }
});

// Cập nhật giao diện của gợi ý được chọn
function updateSelectedSuggestion() {
    const suggestionItems = suggestions.querySelectorAll("p");
    suggestionItems.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.style.backgroundColor = "#ff9800";
            item.style.color = "white";
        } else {
            item.style.backgroundColor = "";
            item.style.color = "";
        }
    });
}
