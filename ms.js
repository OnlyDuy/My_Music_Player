
// 1. Render songs 
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'ONLY_PLAYER';

const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

const randomBtn = $('.btn-random');

const repeatBtn = $('.btn-repeat');

const playlist = $('.playlist');
const timeStart = $('.progress-start-time');
const timeEnd = $('.progress-start-end');

const volumeHigh = $('.btn-volume__high');
const volumeMute = $('.btn-volume__mute');
const volumeProgress = $('.volume-progress');
const volumeBlock = $('.volume-block');

const app = {
    // Lấy ra bài hát đầu tiên trong danh sách để phát ra audio
    currentIndex: 0,

    // Để mặc đinh khi phát nhạc là pause
    isPlaying: false,

    isRandom: false,

    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Dù Cho Mai Về Sau",
            singer: "buitruonglinh",
            path: "./assets/music/Dù Cho Mai Về Sau (Official Music Video) - buitruonglinh.mp3",
            image: "./assets/img/DuChoMaiVeSau.jpg"
        },
        {
            name: "Đường Tôi Chở Em Về (Lofi Ver.)",
            singer: "buitruonglinh x Freak D",
            path: "./assets/music/Đường Tôi Chở Em Về (Lofi Ver.) - buitruonglinh x Freak D.mp3",
            image: "./assets/img/ĐườngTôiChởEmVề(LofiVer.).jpg"
        },
        {
            name: "'bao tiền một mớ bình yên?'",
            singer: "14 Casper & Bon Nghiêm",
            path: "./assets/music/'bao tiền một mớ bình yên-' - 14 Casper & Bon Nghiêm (Official) (Track 09 - Album 'SỐ KHÔNG').mp3",
            image: "./assets/img/BaoTienMotMoBinhYen.jpg"
        },
        {
            name: "Chẳng Thể Tìm Được Em",
            singer: "PhucXp ft. Freak D",
            path: "./assets/music/Chẳng Thể Tìm Được Em - PhucXp ft. Freak D - Official Audio.mp3",
            image: "./assets/img/Chẳng Thể Tìm Được Em.jpg"
        },
        {
            name: "Mascara",
            singer: "Chillies x BLAZE",
            path: "./assets/music/Mascara - Chillies x BLAZE [OFFICIAL MUSIC VIDEO].mp3",
            image: "./assets/img/Mascara - Chillies x BLAZE.jpg"
        },
        {
            name: "Và Thế Là Hết",
            singer: "Chillies",
            path: "./assets/music/Và Thế Là Hết - Chillies (Original).mp3",
            image: "./assets/img/Và Thế Là Hết - Chillies (Original).jpg"
        },
        {
            name: "Phút Ban Đầu",
            singer: "Vũ",
            path: "./assets/music/Vũ. - Phút Ban Đầu (The Original 2014 Version) Lyrics Video.mp3",
            image: "./assets/img/Vũ. - Phút Ban Đầu.jpg"
        },
        {
            name: "ĐÔNG KIẾM EM",
            singer: "Vũ",
            path: "./assets/music/ĐÔNG KIẾM EM - Vũ. (Original).mp3",
            image: "./assets/img/ĐÔNG KIẾM EM.jpg"
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // RENDER SONGS
    render: function () {
        // phương thức map được sử dụng để lặp qua từng phần tử trong mảng songs và trả về một mảng mới html,
        const html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}');">
                            </div>
                        <div class="body">
                            <h3 class="title">
                                ${song.name}
                            </h3>
                            <p class="author">
                                ${song.singer}
                            </p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`

        })

        playlist.innerHTML = html.join('');
    },

    defineProperties: function () {
        // định nghĩa 1 hảm getter
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                // Lấy ra chính bài hát hiện tại
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {
        // Lấy ra kich thước của cd
        const cdWidth = cd.offsetWidth;

        // this thực chất là lấy ra app
        const _this = this;

        // SCROLL TOP
        // Lắng nghe sự kiện onscroll: phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // Tính ra kích thước mới của cd
            const newCdWidth = cdWidth - scrollTop;
            // Lấy ra width của cd (giá trị sẽ không âm)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            // scroll thì cd sẽ mờ dần
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // PLAY / PAUSE / SEEK
        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: `rotate(360deg)`,
                },
            ],
            {
                duration: 10000,      // thời gian quay = 1s
                iterations: Infinity, // lặp vô hạn
            }
        );
        cdThumbAnimate.pause();

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                // khi click play lần nữa sẽ pause
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // từ số dây của bài hát tính ra phần trăm của thanh #progress
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;

                _this.startTimer(audio.currentTime);
                _this.endTimer();

                // Lấy current progress && current index
                _this.setConfig('lastProgress', audio.currentTime);
                _this.setConfig('lastIndex', _this.currentIndex);
                _this.setConfig('lastVolume', audio.volume);
            }
        }

        // Xử lí khi tua song
        progress.onchange = function (e) {
            const seekTiem = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTiem;
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // RANDOM
        // Xử lý bật / tắt random songs
        randomBtn.onclick = function (e) {
            // toggle: nếu là true thì remove, false thì add
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // NEXT / REPEAT WHEN ENDED
        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // PLAY SONG WHEN CLICK
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.option')) {
                // Xử lý click vào song
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'));

                    // Ở đây currentIndex là Số mà get từ element ở dưới thì thành chuỗi
                    // Cần ép kiểu lại
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }

                // Xử lý khi click vào song option
            }
        }

        // Khi tua progress pc
        progress.onmousemove = function () {
            if (!_this.isDraggingProgress) {
                let TimeSkip = (progress.value * audio.duration) / 100;
                _this.startTimer(TimeSkip);
            }
        }

        // Icon volume active
        volumeHigh.onclick = function () {
            volumeHigh.style.display = 'none';
            volumeMute.style.display = 'block';
            audio.volume = 0;
            volumeProgress.value = 0;
        };

        // Icon volume off
        volumeMute.onclick = function () {
            volumeHigh.style.display = 'block';
            volumeMute.style.display = 'none';

            if (currentVolume === 0) {
                currentVolume = 1;
            }
            audio.volume = currentVolume;
            volumeProgress.value = currentVolume * 100;
        };

        // Khi click volume
        volumeProgress.onclick = function () {
            audio.volume = volumeProgress.value / 100;
            currentVolume = audio.volume;
        };

        // Khi tua volume pc
        volumeProgress.onmousemove = function () {
            audio.volume = volumeProgress.value / 100;
            currentVolume = audio.volume;
            if (audio.volume === 0) {
                volumeHigh.style.display = 'none';
                volumeMute.style.display = 'block';
            } else {
                volumeHigh.style.display = 'block';
                volumeMute.style.display = 'none';
            }
        };
    },

    // Load thông tin bài hát hiện tại lên giao diện phát
    loadCurrentSong: function () {
        // Cập nhật các dữ liệu trến
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        // Load cấu hình khi refresh
        // this.isRandom = this.config.isRandom;
        // this.isRepeat = this.config.isRepeat;
        // Nếu mới đầu vào thì mọi thứ được setup khi điều kiện true
        this.isRandom =
            typeof this.config.isRandom === 'undefined'
                ? false
                : this.config.isRandom;

        this.isRepeat =
            typeof this.config.isRepeat === 'undefined'
                ? false
                : this.config.isRepeat;

        audio.currentTime =
            typeof this.config.lastProgress === 'undefined'
                ? 0
                : this.config.lastProgress;

        audio.volume =
            typeof this.config.lastVolume === 'undefined'
                ? 1
                : this.config.lastVolume;

        volumeProgress.value = audio.volume * 100;

        this.currentIndex =
            typeof this.config.lastIndex === 'undefined'
                ? 0
                : this.config.lastIndex;
    },

    // NEXT / PREV
    nextSong: function () {
        this.currentIndex++;

        // Khi đến cuối list bài hát thì phải quay về bài đầu tiên
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;

        // Khi ở bài đầu tiên mà nhấn prev thì trả về phần tử ở cuối mảng
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // CHẠY THỜI GIAN
    startTimer: function (e) {
        let startMinute = Math.floor(e / 60);
        let startSecond = Math.floor(e % 60);

        let displayStartMinute =
            startMinute < 10 ? '0' + startMinute : startMinute;
        let displayStartSecond =
            startSecond < 10 ? '0' + startSecond : startSecond;

        timeStart.textContent =
            displayStartMinute + ' : ' + displayStartSecond;
    },

    // Time end
    endTimer: function () {
        let endMinute = Math.floor(audio.duration / 60);
        let endSecond = Math.floor(audio.duration % 60);

        let displayEndMinute =
            endMinute < 10 ? '0' + endMinute : endMinute;
        let displayEndSecond =
            endSecond < 10 ? '0' + endSecond : endSecond;

        timeEnd.textContent =
            displayEndMinute + ' : ' + displayEndSecond;
    },

    // ACTIVE SONG (): ${index === this.currentIndex ? 'active' : ''

    // Scroll active song into view
    scrollToActiveSong: function () {
        // delay 500ms
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                // Cấu hình cho nó
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
        })
    },



    start: function () {
        // Gán cấu hình từ config vào ừng dụng
        this.loadConfig();
        // ngay từ khi ứng dụng Start thì sẽ gọi đến 1 hàm:
        this.defineProperties();
        // Lắng nghe / xử lý các sự kiện
        this.handleEvents();
        // Tải thông tin bài hát hiện tại vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        this.render();

        // Hiển thị trạng thái ban đầu của buttom random & repeat
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();