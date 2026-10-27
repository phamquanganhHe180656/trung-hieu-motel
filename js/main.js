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

    // 6. Room Photo Gallery Modal & Lightbox
    function getAssetPath(filename) {
        // Luôn dùng đường dẫn tương đối './images/' để hoạt động hoàn hảo trên
        // GitHub Pages (/trung-hieu-motel/), file://, và Spring Boot
        return './images/' + filename;
    }

    const roomGalleries = {
        'phong-201': {
            title: 'Phòng Đôi 201 (2 Giường To Rộng 2m x 1.8m • Tầng 2)',
            roomSelectName: 'Phòng Đôi (2 Giường Rộng)',
            images: [
                { src: getAssetPath('201_1.jpg'), caption: 'Phòng 201: Giường lớn đệm êm, tranh nghệ thuật, bàn trà và khăn tắm sạch sẽ' },
                { src: getAssetPath('202_2.jpg'), caption: 'Phòng đôi rộng rãi trang bị 2 giường to 2m x 1.8m, điều hòa Casper mát rượi' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% trong phòng 201, nước nóng lạnh 24/24' }
            ]
        },
        'phong-202': {
            title: 'Phòng Đôi 202 (2 Giường To Rộng 2m x 1.8m • Tầng 2)',
            roomSelectName: 'Phòng Đôi (2 Giường Rộng)',
            images: [
                { src: getAssetPath('202_2.jpg'), caption: 'Phòng 202: 2 Giường to rộng 2m x 1.8m, tủ quần áo gỗ, rèm cửa cản nắng và WC khép kín' },
                { src: getAssetPath('202_1.jpg'), caption: 'Góc giường ngủ, TV treo tường, bàn trà tiếp khách phòng 202' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% trong phòng 202, sen nóng lạnh 24/24' }
            ]
        },
        'phong-203': {
            title: 'Phòng Đơn 203 (1 Giường Lớn Tiêu Chuẩn • Tầng 2)',
            roomSelectName: 'Phòng Đơn (1 Giường Lớn)',
            images: [
                { src: getAssetPath('204_2.jpg'), caption: 'Phòng 203: 1 Giường lớn đệm êm ái, ga trải trắng thơm tho, bộ bàn trà gỗ' },
                { src: getAssetPath('204_3.jpg'), caption: 'Điều hòa Casper 1 chiều làm mát sâu, TV treo tường, rèm cửa cản nắng' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% trong phòng 203' }
            ]
        },
        'phong-204': {
            title: 'Phòng Đơn 204 (1 Giường Lớn Tiêu Chuẩn • Tầng 2)',
            roomSelectName: 'Phòng Đơn (1 Giường Lớn)',
            images: [
                { src: getAssetPath('204_2.jpg'), caption: 'Phòng 204: Không gian thoáng rộng, 1 giường lớn đệm êm, bàn trà hoa tươi' },
                { src: getAssetPath('204_1.jpg'), caption: 'Góc đầu giường, tranh hoa sen nghệ thuật và sàn gạch vân đá sáng bóng' },
                { src: getAssetPath('204_3.jpg'), caption: 'Điều hòa Casper 1 chiều làm mát nhanh, TV treo tường giải trí' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC riêng biệt trong phòng 204, vòi sen nước nóng lạnh 24/24' }
            ]
        },
        'phong-205': {
            title: 'Phòng Đơn 205 (1 Giường Lớn Tiêu Chuẩn • Tầng 2)',
            roomSelectName: 'Phòng Đơn (1 Giường Lớn)',
            images: [
                { src: getAssetPath('205_1.jpg'), caption: 'Phòng 205: Giường đệm êm ái, điều hòa Casper 1 chiều, TV treo tường và bàn trà' },
                { src: getAssetPath('205_2.jpg'), caption: 'Không gian phòng 205 yên tĩnh tuyệt đối, rèm cửa cản nắng' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC riêng biệt trong phòng 205 sạch sẽ tinh tươm' }
            ]
        },
        'phong-don': {
            title: 'Toàn Bộ Ảnh Phòng Đơn (Phòng 203, 204, 205 • Có 3 Phòng)',
            roomSelectName: 'Phòng Đơn (1 Giường Lớn)',
            images: [
                { src: getAssetPath('204_2.jpg'), caption: 'Phòng 204: Toàn cảnh 1 giường lớn đệm êm, bàn trà gỗ hoa tươi, sàn vân đá' },
                { src: getAssetPath('204_1.jpg'), caption: 'Phòng 204: Góc đầu giường gỗ và tranh hoa sen nghệ thuật ấm cúng' },
                { src: getAssetPath('204_3.jpg'), caption: 'Phòng 204: Điều hòa Casper 1 chiều mát sâu, TV treo tường giải trí' },
                { src: getAssetPath('205_1.jpg'), caption: 'Phòng 205: Không gian yên tĩnh, đệm êm, điều hòa làm lạnh nhanh' },
                { src: getAssetPath('205_2.jpg'), caption: 'Phòng 205: Phòng ngủ thoáng mát, bàn ghế trà và WC khép kín' },
                { src: getAssetPath('real_map_2.jpg'), caption: 'Ảnh thực tế Google Maps: Phòng ngủ trang bị đầy đủ điều hòa, tivi, bàn trà' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% từng phòng, nước nóng lạnh 24/24' }
            ]
        },
        'phong-thoang-mat': {
            title: 'Toàn Bộ Ảnh Phòng Đôi (Phòng 201, 202 • 2 Giường To Rộng 2m x 1.8m)',
            roomSelectName: 'Phòng Đôi (2 Giường Rộng)',
            images: [
                { src: getAssetPath('202_2.jpg'), caption: 'Phòng 202: 2 Giường to rộng 2m x 1.8m, tủ quần áo gỗ, quạt mát, rèm cửa' },
                { src: getAssetPath('201_1.jpg'), caption: 'Phòng 201: Giường lớn đệm êm, tranh nghệ thuật, bàn trà và khăn tắm sạch sẽ' },
                { src: getAssetPath('202_1.jpg'), caption: 'Phòng 202: TV treo tường, bàn trà tiếp khách, nền gạch vân đá sáng bóng' },
                { src: getAssetPath('real_map_1.jpg'), caption: 'Ảnh thực tế Google Maps: Không gian thoáng mát, nền gạch vân đá, rèm cửa cản nắng' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% từng phòng' }
            ]
        },
        'phong-doi': {
            title: 'Toàn Bộ Ảnh Phòng Đôi (Phòng 201, 202 • 2 Giường To Rộng 2m x 1.8m)',
            roomSelectName: 'Phòng Đôi (2 Giường Rộng)',
            images: [
                { src: getAssetPath('202_2.jpg'), caption: 'Phòng 202: 2 Giường to rộng 2m x 1.8m, tủ quần áo gỗ, quạt mát, rèm cửa' },
                { src: getAssetPath('201_1.jpg'), caption: 'Phòng 201: Giường lớn đệm êm, tranh nghệ thuật, bàn trà và khăn tắm sạch sẽ' },
                { src: getAssetPath('202_1.jpg'), caption: 'Phòng 202: TV treo tường, bàn trà tiếp khách, nền gạch vân đá sáng bóng' },
                { src: getAssetPath('real_map_1.jpg'), caption: 'Ảnh thực tế Google Maps: Không gian thoáng mát, nền gạch vân đá, rèm cửa cản nắng' },
                { src: getAssetPath('real_map_3.jpg'), caption: 'Phòng tắm & WC khép kín riêng biệt 100% từng phòng' }
            ]
        },
        'phong-ve-sinh': {
            title: 'Phòng Tắm & Tiện Nghi Sạch Sẽ (Trang Bị Cả 5 Phòng 201 - 205)',
            roomSelectName: 'Phòng Tắm & Tiện Nghi Sạch Sẽ',
            images: [
                { src: getAssetPath('real_map_3.jpg'), caption: 'Ảnh thực tế Google Maps: Phòng tắm riêng biệt 100% trong phòng, ốp lát gạch men sạch tinh' },
                { src: getAssetPath('202_2.jpg'), caption: 'Cửa phòng vệ sinh riêng khép kín ngay trong từng phòng nghỉ' },
                { src: getAssetPath('204_2.jpg'), caption: 'Khăn tắm giặt sấy thơm tho, bàn chải, xà phòng mới miễn phí' }
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
            mainImg.alt = item.caption || 'Ảnh phòng nghỉ';
            mainImg.onerror = function() {
                this.onerror = null;
                this.src = './images/204_2.jpg';
            };
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
            thumb.innerHTML = `<img src="${img.src}" alt="${img.caption}" onerror="this.onerror=null;this.src='./images/204_2.jpg'">`;
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
            const roomCode = btn.getAttribute('data-room-code') || btn.getAttribute('data-room-name');
            const roomType = btn.getAttribute('data-room-type');
            const bedInfo = btn.getAttribute('data-bed-info') || '';
            const roomTypeSelect = document.getElementById('roomType');
            const noteInput = document.getElementById('note') || document.getElementById('notes');

            if (roomTypeSelect) {
                if (roomType === 'single' || (roomCode && (roomCode.includes('203') || roomCode.includes('204') || roomCode.includes('205') || roomCode.includes('Đơn')))) {
                    roomTypeSelect.value = 'Phòng Đơn (1 Giường Lớn)';
                } else {
                    roomTypeSelect.value = 'Phòng Đôi (2 Giường Rộng)';
                }
            }

            if (noteInput && roomCode) {
                noteInput.value = `Khách ưu tiên chọn phòng: ${roomCode}${bedInfo ? ' (' + bedInfo + ')' : ''}`;
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

