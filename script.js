document.addEventListener('DOMContentLoaded', function () {

    // ========== تنظیمات ربات بله ==========
    const BALE_TOKEN = "1311806588:7V-y3xfPYjUdG4GNN5Qi86ApTsXLYUgFUAQ";
    const CHAT_ID = "880496536";
    
    // آدرس رسمی API پیام‌رسان بله (بدون مشکل فیلترینگ در ایران)
    const BALE_API_URL = `https://tapi.bale.ai/bot${BALE_TOKEN}/sendMessage`;

    // ========== دکمه‌های شناور پیمایش ==========
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');

    if (scrollUp) {
        scrollUp.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (scrollDown) {
        scrollDown.addEventListener('click', function () {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // ========== پاپ‌آپ ==========
    const popupOverlay = document.getElementById('popupOverlay');
    const popupMessage = document.getElementById('popupMessage');
    const popupIcon = document.getElementById('popupIcon');
    const popupClose = document.getElementById('popupClose');

    function showPopup(message, type = 'success') {
        if (!popupMessage || !popupIcon || !popupOverlay) return;
        popupMessage.textContent = message;
        popupIcon.innerHTML = type === 'success'
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-xmark"></i>';
        popupIcon.className = 'popup-icon ' + type;
        popupOverlay.classList.add('active');
    }

    function hidePopup() {
        if (popupOverlay) popupOverlay.classList.remove('active');
    }

    if (popupClose) {
        popupClose.addEventListener('click', hidePopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', function (e) {
            if (e.target === popupOverlay) hidePopup();
        });
    }

    // ========== محدود کردن ورودی شماره موبایل ==========
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/[^0-9۰-۹]/g, '');
            value = value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            this.value = value;
        });
    }

    // ========== فرم مشاوره ==========
    const form = document.getElementById('consultationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value) return;

        const name    = document.getElementById('name').value.trim();
        let phone     = document.getElementById('phone').value.trim();
        const city    = document.getElementById('city').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // تبدیل اعداد فارسی به انگلیسی
        phone = phone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

        // ========== اعتبارسنجی ==========
        if (name.length < 3) {
            showPopup('لطفاً نام و نام خانوادگی را به درستی وارد کنید.', 'error');
            return;
        }

        if (!/^09\d{9}$/.test(phone)) {
            showPopup('شماره موبایل باید دقیقاً ۱۱ رقم باشد و با ۰۹ شروع شود.', 'error');
            return;
        }

        if (city.length < 2) {
            showPopup('لطفاً نام شهر را وارد کنید.', 'error');
            return;
        }

        if (!subject) {
            showPopup('لطفاً موضوع مشاوره را انتخاب کنید.', 'error');
            return;
        }

        if (message.length < 10) {
            showPopup('لطفاً توضیحات بیشتری درباره موضوع بنویسید.', 'error');
            return;
        }

        // حالت بارگذاری
        setLoading(true);

        try {
            // ساخت متن پیام برای ارسال به بله
            const text = `⚖️ درخواست مشاوره جدید:\n\n` +
                         `👤 نام: ${name}\n` +
                         `📱 موبایل: ${phone}\n` +
                         `📍 شهر: ${city}\n` +
                         `📌 موضوع: ${subject}\n` +
                         `💬 توضیحات: ${message}`;

            const response = await fetch(BALE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text
                })
            });

            const result = await response.json();

            if (result.ok) {
                showPopup('درخواست شما با موفقیت ثبت شد.\nبه زودی با شما تماس گرفته می‌شود.', 'success');
                form.reset();
            } else {
                throw new Error(result.description || 'خطا در ارسال');
            }

        } catch (error) {
            console.error(error);
            showPopup('خطا در ارسال پیام.\nلطفاً دوباره تلاش کنید یا مستقیماً تماس بگیرید.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (!submitBtn || !btnText) return;
        submitBtn.disabled = isLoading;
        btnText.textContent = isLoading ? 'در حال ارسال...' : 'ارسال درخواست مشاوره';
    }
});
