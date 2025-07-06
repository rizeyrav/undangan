document.addEventListener("DOMContentLoaded", () => {
  // === Countdown ===
  const countdownEl = document.getElementById("countdown");
  const eventDate = new Date("2025-07-13T19:00:00").getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate - now;
    if (distance < 0) {
      countdownEl.innerHTML = "Acara sedang berlangsung atau telah selesai.";
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdownEl.innerHTML = `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
  }, 1000);

  // === Musik toggle ===
  const music = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");
  let isMusicPlaying = false;

  // Tombol manual
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (isMusicPlaying) {
        music.pause();
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
      } else {
        music.play().catch((err) => console.warn("Gagal play:", err));
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
      isMusicPlaying = !isMusicPlaying;
    });
  }

  // Autoplay setelah interaksi pengguna
  function tryPlayMusic() {
    music
      .play()
      .then(() => {
        isMusicPlaying = true;
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
      })
      .catch((err) => {
        console.warn("Autoplay diblokir:", err);
      });
  }

  // ["click", "touchstart", "scroll"].forEach((eventName) => {
  //   window.addEventListener(
  //     eventName,
  //     function once() {
  //       tryPlayMusic();
  //       window.removeEventListener(eventName, once);
  //     },
  //     { once: true }
  //   );
  // });

  // === Scroll ke atas tombol ===
  const scrollBtn = document.getElementById("scroll-top");
  const main = document.querySelector("main");
  main.addEventListener("scroll", () => {
    scrollBtn.style.display =
      main.scrollTop > window.innerHeight * 0.5 ? "flex" : "none";
  });
  scrollBtn.addEventListener("click", () => {
    main.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === Buka undangan ===
  const bukaBtn = document.getElementById("buka-undangan");
  if (bukaBtn) {
    bukaBtn.addEventListener("click", () => {
      main.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    });
  }

  // === Nama tamu dari URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("to");
  if (nama) {
    const namaEl = document.getElementById("nama-tamu");
    const wrapper = document.getElementById("nama-tamu-wrapper");
    namaFormatted = decodeURIComponent(nama).replace(/\/n/g, "<br>");
    namaEl.innerHTML = namaFormatted;
    wrapper.style.display = "block";
  }

  // === Lazy Load Gambar ===
  const lazyImages = document.querySelectorAll("img");
  lazyImages.forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.style.opacity = "0";
  });

  const lazyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.transition = "opacity 0.6s ease";
          img.style.opacity = "1";
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px 0px", threshold: 0.01 }
  );

  lazyImages.forEach((img) => lazyObserver.observe(img));

  // === Background WebP Support + Lazy Load ===
  function supportsWebP() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src =
        "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSywA";
    });
  }

  supportsWebP().then((isWebPSupported) => {
    const lazySections = document.querySelectorAll(".lazy-bg");

    const bgObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const bgWebp = el.getAttribute("data-bg-webp");
            const bgJpg = el.getAttribute("data-bg-jpg");
            const bgUrl = isWebPSupported && bgWebp ? bgWebp : bgJpg;

            if (bgUrl && !el.classList.contains("bg-loaded")) {
              el.style.backgroundImage = `url('${bgUrl}')`;
              el.classList.add("bg-loaded");
              observer.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    lazySections.forEach((section) => bgObserver.observe(section));
  });
});
