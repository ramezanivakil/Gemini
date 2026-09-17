document.addEventListener('DOMContentLoaded', function () {

    // ========== آدرس Worker ==========
    const WORKER_URL = 'https://ramezanivakil.ir/api';

    // کلید مخفی (همان مقداری که در Cloudflare به عنوان API_SECRET گذاشتی)
    const API_SECRET = 'RamezaniVakil2026!SecureKey#91';

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
        popupMessage.textContent = message;
        popupIcon.innerHTML = type === 'success'
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-xmark"></i>';
        popupIcon.className = 'popup-icon ' + type;
        popupOverlay.classList.add('active');
    }

    function hidePopup() {
        popupOverlay.classList.remove('active');
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
            value = value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
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

        // جلوگیری از ارسال ربات‌ها (Honeypot)
        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value) return;

        const name    = document.getElementById('name').value.trim();
        let phone     = document.getElementById('phone').value.trim();
        const city    = document.getElementById('city').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // تبدیل اعداد فارسی به انگلیسی
        phone = phone.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

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
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': API_SECRET
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    city: city,
                    subject: subject,
                    message: message
                })
            });

            const result = await response.json();

            if (result.ok) {
                showPopup('درخواست شما با موفقیت ثبت شد.\nبه زودی با شما تماس گرفته می‌شود.', 'success');
                form.reset();
            } else {
                throw new Error(result.error || 'خطا در ارسال');
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
