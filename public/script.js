const searchInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const suggestions = document.getElementById("suggestions");
const loading = document.getElementById("loading");

// URL của file JSON trên GitHub
const DATA_URL = "https://raw.githubusercontent.com/hidro2k2/project/main/public/assets/data.json";
// const DATA_URL = "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/hidro2k2/project/main/public/assets/data.json";

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
                .map((item) => `<p>${item.name}</p>`)
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
    }
});

//gợi ý biến mất khi nhấp ra ngoài
// document.addEventListener('click', (event) => {
//     if (!suggestions.contains(event.target) && event.target !== searchInput) {
//         suggestions.style.display = 'none';
//     }
// });

const GEMINI_API_URL = `https://cors-anywhere.herokuapp.com/https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

const GEMINI_API_KEY = "AIzaSyByG9RXNidnbVYiQMkXfN7FqhdX5wfx7JA"; // Thay thế bằng API key Gemini của bạn
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

let currentChat = []; // Lưu trữ cuộc trò chuyện hiện tại

// Function to send a message to Gemini API
async function sendGeminiMessage() {
    const userInput = document.getElementById("gemini-user-input").value;
    if (!userInput.trim()) return;

    // Thêm tin nhắn của người dùng vào lịch sử
    currentChat.push({ role: "user", parts: [{ text: userInput }] });

    // Hiển thị tin nhắn của người dùng
    appendGeminiMessage("user", userInput);

    // Gửi yêu cầu đến Gemini API
    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: currentChat,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        const botMessage = data.candidates[0].content.parts[0].text || "No response from Gemini.";
        // Thêm tin nhắn của AI vào lịch sử
        currentChat.push({ role: "model", parts: [{ text: botMessage }] });
        appendGeminiMessage("bot", botMessage);
    } else {
        const errorData = await response.json();
        appendGeminiMessage("bot", `Error: ${errorData.error.message}`);
    }

    // Xóa input
    document.getElementById("gemini-user-input").value = "";
}

// Function to upload and process an image using Gemini API
async function uploadGeminiImage() {
    const fileInput = document.getElementById("gemini-image-upload");
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const base64Image = event.target.result.split(",")[1];

        // Send image to Gemini API
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "Describe this image:",
                            },
                            {
                                inlineData: {
                                    mimeType: file.type,
                                    data: base64Image,
                                },
                            },
                        ],
                    },
                ],
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text || "No response from Gemini.";
            appendGeminiMessage("bot", botMessage);
        } else {
            const errorData = await response.json();
            appendGeminiMessage("bot", `Error: ${errorData.error.message}`);
        }
    };
    reader.readAsDataURL(file);
}

// Function to append a message to the chat window
function appendGeminiMessage(sender, message) {
    const chatWindow = document.getElementById("gemini-chat-window");
    const messageElement = document.createElement("div");
    messageElement.className = sender === "user" ? "text-right" : "text-left";
    messageElement.innerHTML = `
        <div class="inline-block p-2 rounded-lg ${sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}">
            ${message}
        </div>
    `;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to bottom
}

// Send message when user presses Enter key
document.getElementById("gemini-user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter
        sendGeminiMessage();
    }
});