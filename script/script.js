const vkLink = "https://vk.com/modnayadetvora";
const tgLink = "https://t.me/Diana_FFFil";

function openVK() {
    window.open(vkLink);
}

function openTG() {
    window.open(tgLink);
}

const modal = document.getElementById("paymentModal");
const openBtn = document.querySelectorAll(".pay-button");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("paymentForm");

const fields = ["orderNumber", "name", "phone", "email", "amount"];

// Маска для телефона
document.addEventListener("DOMContentLoaded", () => {
    Inputmask({ mask: "+7 (999) 999-99-99", clearIncomplete: true }).mask("#phone");

    // Восстановить данные, если были сохранены
    const savedData = localStorage.getItem("paymentFormData");
    const wasOpen = localStorage.getItem("paymentModalOpen");

    if (savedData) {
        const data = JSON.parse(savedData);
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (data[id]) input.value = data[id];
        });
    }

    if (wasOpen === "true") {
        modal.style.display = "block";
    }
});

    // Открыть модалку
    function openModal() {
        document.getElementById('paymentModal').style.display = 'flex';
    }

// Закрыть модалку
closeBtn.onclick = () => {
    modal.style.display = "none";
    localStorage.setItem("paymentModalOpen", "false");
};

// Закрыть по фону
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        localStorage.setItem("paymentModalOpen", "false");
    }
};

// Сохраняем форму в localStorage при изменении
form.addEventListener("input", () => {
    const data = {};
    fields.forEach(id => {
        data[id] = document.getElementById(id).value;
    });
    localStorage.setItem("paymentFormData", JSON.stringify(data));
});

// При отправке — очищаем сохранённое (опционально)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Данные отправлены!");
    localStorage.removeItem("paymentFormData");
    localStorage.removeItem("paymentModalOpen");
    modal.style.display = "none";
});

function handlePay() {
    alert('Переход к оплате...');
}
