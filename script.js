document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultationForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !message) {
                formStatus.style.color = '#ff6b6b';
                formStatus.textContent = 'لطفاً تمامی فیلدها را پر کنید.';
                return;
            }

            // نمایش پیام موفقیت‌آمیز
            formStatus.style.color = '#51cf66';
            formStatus.textContent = 'درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس خواهیم گرفت.';

            // پاک کردن فرم
            form.reset();
        });
    }
});
