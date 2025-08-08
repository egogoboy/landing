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

const fields = ["orderType", "orderDetailsWrapper", "deliveryDateWrapper", "name", "surname", "phone", "email", "amount"];

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
/*
form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Данные отправлены!");
});
*/

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    document.getElementById("loaderOverlay").style.display = "flex";

    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const orderInfo = orderType === "order" ? document.getElementById("orderDetails").value : document.getElementById("deliveryDate").value;

    const formData = new URLSearchParams();

    formData.append("orderType", orderType);
    formData.append("orderInfo", orderInfo);
    formData.append("name", document.getElementById("name").value);
    formData.append("surname", document.getElementById("surname").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("amount", document.getElementById("amount").value);

    const webhookURL = "https://script.google.com/macros/s/AKfycbxRiwMheu8IgtADbGDDHYXjCVFrgtgApMuLTwHd69X3iI3tHcyYyGoITyQLokfpmSZi/exec";
    try {
        const response = await fetch(webhookURL, {
          method: "POST",
          body: formData,
        });

        const result = await response.text(); // Можно заменить на .json() если хочешь

        if (response.ok) {
            localStorage.removeItem("paymentFormData");
            localStorage.removeItem("paymentModalOpen");
            document.querySelector("#loaderOverlay .loader-message").textContent = 
                "Данные отправлены успешно. Перенаправление на страницу оплаты...";
            setTimeout(() => {
                document.getElementById("loaderOverlay").style.display = "none";
                //window.location.href = "/payment";
            }, 1500);

            modal.style.display = "none";
            // window.location.href = "https://example.com/success"; // При желании — переадресация
        } else {
            document.querySelector("#loaderOverlay .loader-message").textContent = 
                "Ошибка при отправке данных";
            setTimeout(() => {
                document.getElementById("loaderOverlay").style.display = "none";
            }, 1500);
        }
    } catch (error) {
        console.error("Ошибка при отправке:", error);
        alert("Произошла ошибка при отправке формы.");
    }
});
