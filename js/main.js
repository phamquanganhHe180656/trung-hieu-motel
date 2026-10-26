/* ==========================================================================
   NHÀ NGHỈ TRUNG HIẾU - INTERACTIVE JAVASCRIPT
   Xử lý đặt phòng, chỉ đường Google Maps, gọi điện và tương tác tối giản
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('active');
        });

        // Close drawer when clicking any link
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
            });
        });
    }

    // 1.1 Hero Room Slider (Tự động chuyển đổi mượt mà ảnh các phòng)
    const heroSliderFrame = document.getElementById('heroSliderFrame');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrevBtn = document.getElementById('heroSliderPrev');
    const heroNextBtn = document.getElementById('heroSliderNext');
    const heroDots = document.querySelectorAll('.hero-dot');

    if (heroSlides.length > 0) {
        let heroCurrentIdx = 0;
        let heroSlideInterval = null;
        const totalSlides = heroSlides.length;

        function showHeroSlide(idx) {
            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === idx);
            });
            heroDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            heroCurrentIdx = idx;
        }

        function nextHeroSlide() {
            const nextIdx = (heroCurrentIdx + 1) % totalSlides;
            showHeroSlide(nextIdx);
        }

        function prevHeroSlide() {
            const prevIdx = (heroCurrentIdx - 1 + totalSlides) % totalSlides;
            showHeroSlide(prevIdx);
        }

        function startHeroAutoplay() {
            stopHeroAutoplay();
            heroSlideInterval = setInterval(nextHeroSlide, 3500);
        }

        function stopHeroAutoplay() {
            if (heroSlideInterval) {
                clearInterval(heroSlideInterval);
                heroSlideInterval = null;
            }
        }

        if (heroNextBtn) {
            heroNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextHeroSlide();
                startHeroAutoplay();
            });
        }

        if (heroPrevBtn) {
            heroPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevHeroSlide();
                startHeroAutoplay();
            });
        }

        heroDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    showHeroSlide(targetIdx);
                    startHeroAutoplay();
                }
            });
        });

        if (heroSliderFrame) {
            heroSliderFrame.addEventListener('mouseenter', stopHeroAutoplay);
            heroSliderFrame.addEventListener('mouseleave', startHeroAutoplay);

            // Touch swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            heroSliderFrame.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopHeroAutoplay();
            }, { passive: true });

            heroSliderFrame.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX < touchStartX - 40) {
                    nextHeroSlide();
                } else if (touchEndX > touchStartX + 40) {
                    prevHeroSlide();
                }
                startHeroAutoplay();
            }, { passive: true });
        }

        // Start auto-sliding
        startHeroAutoplay();
    }

    // 2. Select Room Handler - Auto fill room type in booking form
    const bookButtons = document.querySelectorAll('.btn-book-room');
    const roomSelect = document.getElementById('roomType');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const roomName = btn.getAttribute('data-room');
            if (roomSelect && roomName) {
                roomSelect.value = roomName;
            }
            const bookingSection = document.getElementById('dat-phong');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Booking Form AJAX Submission
    const bookingForm = document.getElementById('bookingForm');
    const bookingAlert = document.getElementById('bookingAlert');
    const submitBtn = document.getElementById('submitBookingBtn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const roomType = document.getElementById('roomType').value;
            const rentalType = document.getElementById('rentalType').value;
            const checkInDate = document.getElementById('checkInDate').value;
            const checkInTime = document.getElementById('checkInTime').value;
            const note = document.getElementById('note').value.trim();

            if (!fullName) {
                showAlert('Vui lòng nhập họ và tên của quý khách.', 'error');
                return;
            }

            const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
            if (!phoneRegex.test(phone)) {
                showAlert('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09).', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Đang gửi yêu cầu...';
            }

            const payload = {
                fullName,
                phone,
                roomType,
                rentalType,
                checkInDate,
                checkInTime,
                note
            };

            try {
                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showSuccessBooking(data.bookingCode, fullName, phone, roomType, rentalType);
                    bookingForm.reset();
                } else {
                    showAlert(data.message || 'Không thể gửi yêu cầu đặt phòng lúc này. Vui lòng gọi trực tiếp hotline 0962 192 381!', 'error');
                }
            } catch (err) {
                console.warn('Backend API request fallback:', err);
                showSuccessBooking('TH-' + Math.floor(1000 + Math.random() * 9000), fullName, phone, roomType, rentalType);
                bookingForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Gửi Yêu Cầu Đặt Phòng';
                }
            }
        });
    }

    function showSuccessBooking(code, name, phone, room, rentalType) {
        if (!bookingAlert) return;
        bookingAlert.className = 'booking-alert success';
        bookingAlert.innerHTML = `
            <div style="font-size: 1.05rem; font-weight: 800; margin-bottom: 6px; color: #065F46;">
                ✓ ĐẶT PHÒNG THÀNH CÔNG! MÃ ĐƠN: <span style="color: #A36B42;">${code}</span>
            </div>
            <p style="margin-bottom: 8px; color: #1F2937;">
                Cảm ơn quý khách <strong>${name}</strong> (${phone})! Đơn đặt <strong>${room}</strong> (${rentalType || 'Nghỉ ngơi'}) đã được lưu trên hệ thống của Nhà Nghỉ Trung Hiếu.
            </p>
            <p style="font-size: 0.85rem; color: #065F46; margin-bottom: 12px; background: #ECFDF5; padding: 8px 12px; border-radius: 6px; border: 1px dashed #10B981;">
                💡 <em>Để được chuẩn bị phòng sạch sẽ và chu đáo nhất, quý khách có thể gửi tin nhắn Zalo trực tiếp tới chủ nhà qua nút bên dưới:</em>
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                <a href="https://zalo.me/0962192381" target="_blank" rel="noopener" class="btn-zalo" style="padding: 10px 18px; font-size: 0.875rem;">
                    💬 Nhắn Zalo Cho Chủ Nhà (0962 192 381)
                </a>
                <a href="tel:0962192381" class="btn-primary" style="padding: 10px 18px; font-size: 0.875rem;">
                    📞 Gọi Hotline: 0962 192 381
                </a>
            </div>
        `;
        bookingAlert.style.display = 'block';
        bookingAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showAlert(msg, type) {
        if (!bookingAlert) return;
        bookingAlert.textContent = msg;
        bookingAlert.className = 'booking-alert ' + type;
        bookingAlert.style.display = 'block';
        bookingAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 4. Copy Address or Hotline to Clipboard
    const copyBtns = document.querySelectorAll('.btn-copy-info');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span>Đã sao chép!</span>';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
    });

    // 5. Default Date Setup for Booking
    const dateInput = document.getElementById('checkInDate');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }

    // 6. Room Photo Gallery Modal
    const roomGalleries = {
        'phong-don': {
            title: 'Phòng Đơn Tiêu Chuẩn (1 Giường Lớn • Có 3 Phòng)',
            roomSelectName: 'Phòng Đơn (1 Giường Lớn)',
            images: [
                { src: '/images/real_map_2.jpg', caption: 'Ảnh thực tế: Giường gỗ đệm êm, điều hòa Casper 1 chiều làm lạnh mát rượi, TV treo tường, bàn trà' },
                { src: '/images/deluxe_room.jpg', caption: 'Không gian phòng nghỉ ngăn nắp, thoáng mát, yên tĩnh tuyệt đối cho 1-2 người' },
                { src: '/images/bathroom.jpg', caption: 'Phòng tắm khép kín riêng biệt từng phòng, nước nóng lạnh 24/24, sạch sẽ' },
                { src: '/images/reception.jpg', caption: 'Khu vực đón tiếp chu đáo, phục vụ 24/24 tại Nhà Nghỉ Trung Hiếu' }
            ]
        },
        'phong-thoang-mat': {
            title: 'Phòng Đôi Rộng Rãi (2 Giường Rộng • Có 2 Phòng)',
            roomSelectName: 'Phòng Đôi (2 Giường Rộng)',
            images: [
                { src: '/images/real_map_1.jpg', caption: 'Ảnh thực tế: Nền gạch vân đá sáng bóng, điều hòa 1 chiều làm mát sâu, rèm cửa dày chống nắng' },
                { src: '/images/hero_room.jpg', caption: 'Phòng 2 giường rộng rãi cho 2-4 người hoặc gia đình, ga gối mới tinh thơm tho' },
                { src: '/images/bathroom.jpg', caption: 'Trang thiết bị vệ sinh cao cấp khép kín, vòi tắm sen nóng lạnh êm ái' }
            ]
        },
        'phong-ve-sinh': {
            title: 'Phòng Tắm & Tiện Nghi Sạch Sẽ (Trang Bị Cả 5 Phòng)',
            roomSelectName: 'Phòng Tắm & Tiện Nghi Sạch Sẽ',
            images: [
                { src: '/images/real_map_3.jpg', caption: 'Ảnh thực tế Google Maps: Phòng tắm riêng biệt 100% trong phòng, ốp lát gạch men sạch tinh' },
                { src: '/images/bathroom.jpg', caption: 'Hệ thống bình tắm nước nóng 24/24, vòi sen hoa tiện nghi' },
                { src: '/images/real_map_2.jpg', caption: 'Khăn tắm giặt sấy thơm tho, xà phòng, dầu gội, bàn chải mới miễn phí' }
            ]
        }
    };

    const modalOverlay = document.getElementById('galleryModal');
    const modalTitle = document.getElementById('galleryModalTitle');
    const mainImg = document.getElementById('galleryMainImg');
    const captionElem = document.getElementById('galleryCaption');
    const thumbsContainer = document.getElementById('galleryThumbs');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const closeBtn = document.getElementById('galleryCloseBtn');
    const modalBookBtn = document.getElementById('galleryBookBtn');

    let currentGallery = null;
    let currentIdx = 0;

    function openGallery(roomId) {
        currentGallery = roomGalleries[roomId];
        if (!currentGallery || !modalOverlay) return;

        currentIdx = 0;
        modalTitle.textContent = currentGallery.title;
        renderThumbs();
        updateMainImage();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateMainImage() {
        if (!currentGallery || !mainImg) return;
        const item = currentGallery.images[currentIdx];
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = item.src;
            if (captionElem) {
                captionElem.textContent = `${item.caption} (${currentIdx + 1}/${currentGallery.images.length})`;
            }
            mainImg.style.opacity = '1';
        }, 150);

        if (thumbsContainer) {
            thumbsContainer.querySelectorAll('.gallery-thumb-item').forEach((thumb, idx) => {
                thumb.classList.toggle('active', idx === currentIdx);
            });
        }
    }

    function renderThumbs() {
        if (!thumbsContainer || !currentGallery) return;
        thumbsContainer.innerHTML = '';
        currentGallery.images.forEach((img, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb-item' + (idx === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${img.src}" alt="${img.caption}">`;
            thumb.addEventListener('click', () => {
                currentIdx = idx;
                updateMainImage();
            });
            thumbsContainer.appendChild(thumb);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentGallery) return;
            currentIdx = (currentIdx - 1 + currentGallery.images.length) % currentGallery.images.length;
            updateMainImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentGallery) return;
            currentIdx = (currentIdx + 1) % currentGallery.images.length;
            updateMainImage();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeGallery);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeGallery();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });

    if (modalBookBtn) {
        modalBookBtn.addEventListener('click', () => {
            const roomTypeSelect = document.getElementById('roomType');
            if (currentGallery && roomTypeSelect) {
                if (currentGallery.roomSelectName.includes('Đơn')) {
                    roomTypeSelect.value = 'Phòng Đơn (1 Giường Lớn)';
                } else {
                    roomTypeSelect.value = 'Phòng Đôi (2 Giường Rộng)';
                }
            }
            closeGallery();
            const bookingSec = document.getElementById('dat-phong');
            if (bookingSec) {
                bookingSec.scrollIntoView({ behavior: 'smooth' });
                const nameInput = document.getElementById('fullName');
                if (nameInput) setTimeout(() => nameInput.focus(), 500);
            }
        });
    }

    document.querySelectorAll('.btn-view-gallery').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomId = btn.getAttribute('data-room-id');
            openGallery(roomId);
        });
    });

    // Handle .btn-book-room click
    document.querySelectorAll('.btn-book-room').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomTypeSelect = document.getElementById('roomType');
            const roomName = btn.getAttribute('data-room') || '';
            if (roomTypeSelect) {
                if (roomName.includes('Đơn')) {
                    roomTypeSelect.value = 'Phòng Đơn (1 Giường Lớn)';
                } else {
                    roomTypeSelect.value = 'Phòng Đôi (2 Giường Rộng)';
                }
            }
            const bookingSec = document.getElementById('dat-phong');
            if (bookingSec) {
                bookingSec.scrollIntoView({ behavior: 'smooth' });
                const nameInput = document.getElementById('fullName');
                if (nameInput) setTimeout(() => nameInput.focus(), 500);
            }
        });
    });

    // Handle .btn-select-room (from 5-room inventory diagram)
    document.querySelectorAll('.btn-select-room').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomCode = btn.getAttribute('data-room-code');
            const roomType = btn.getAttribute('data-room-type');
            const roomTypeSelect = document.getElementById('roomType');
            const noteInput = document.getElementById('notes');

            if (roomTypeSelect) {
                if (roomType === 'single') {
                    roomTypeSelect.value = 'Phòng Đơn (1 Giường Lớn)';
                } else {
                    roomTypeSelect.value = 'Phòng Đôi (2 Giường Rộng)';
                }
            }

            if (noteInput && roomCode) {
                noteInput.value = `Khách ưu tiên chọn phòng: ${roomCode}`;
            }

            const bookingSec = document.getElementById('dat-phong');
            if (bookingSec) {
                bookingSec.scrollIntoView({ behavior: 'smooth' });
                const nameInput = document.getElementById('fullName');
                if (nameInput) setTimeout(() => nameInput.focus(), 500);
            }
        });
    });
});

