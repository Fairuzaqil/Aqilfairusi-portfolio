function downloadCV() {
  // Menyediakan path file CV Anda
  const cvPath = "assets/CV_Aqil_Fairusi.pdf";

  // Membuat elemen <a> secara dinamis untuk memulai download
  const link = document.createElement("a");
  link.href = cvPath;
  link.download = "CV_Aqil_Fairusi.pdf"; // Menentukan nama file yang diunduh
  link.click(); // Simulasi klik pada link untuk memulai download
}
const texts = ["Video Editor.", "Videographer.", "Frontend Developer."];
let index = 0;
const speed = 100; // Kecepatan pengetikan dalam milidetik
const eraseSpeed = 50; // Kecepatan penghapusan karakter
const element = document.getElementById("text");

function typeWriter() {
  if (index < texts.length) {
    let charIndex = 0;
    const currentText = texts[index];

    // Menulis kalimat
    function write() {
      if (charIndex < currentText.length) {
        element.innerHTML += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(write, speed);
      } else {
        // Setelah menulis selesai, tunggu sejenak lalu hapus
        setTimeout(eraseWriter, 1000);
      }
    }

    // Menghapus kalimat
    function eraseWriter() {
      let eraseIndex = currentText.length;
      function erase() {
        if (eraseIndex > 0) {
          element.innerHTML = currentText.substring(0, eraseIndex - 1);
          eraseIndex--;
          setTimeout(erase, eraseSpeed);
        } else {
          // Setelah menghapus selesai, lanjutkan ke kalimat berikutnya
          index++;
          if (index === texts.length) {
            index = 0; // Reset index untuk looping
          }
          setTimeout(typeWriter, 500); // Tunggu sebelum menulis kalimat berikutnya
        }
      }
      erase();
    }

    write();
  }
}

typeWriter(); // Mulai animasi pengetikan

const videos = [
  "https://www.youtube.com/watch?v=CHEFM_FO-R8&ab_channel=KPUKabupatenTegal",
  "https://www.youtube.com/watch?v=PAUt9VgtTVA&ab_channel=KPUKabupatenTegal",
  "https://www.youtube.com/watch?v=DiZfsuiAt_8&ab_channel=PPMZaenabMasykur",
  "https://www.youtube.com/watch?v=M5XHU-WcR3M&ab_channel=Afstory",
  "https://www.youtube.com/watch?v=EDZtDWc4R_M&ab_channel=StupangMedia",
  "https://www.youtube.com/watch?v=Ov4WlEZ09N4",
];

// Fungsi untuk mengambil ID video dari URL YouTube
function getYouTubeID(url) {
  const regex = /[?&]v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Fungsi untuk mengambil data video dari YouTube oEmbed API
async function getYouTubeData(videoURL) {
  const videoID = getYouTubeID(videoURL);
  if (!videoID) return null;

  const apiURL = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoID}&format=json`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      url: videoURL,
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
}

// Fungsi untuk cek apakah layar mobile
function isMobile() {
  return window.innerWidth < 768;
}

// Fungsi untuk menampilkan daftar video
async function loadVideos() {
  const videoList = document.getElementById("video-list");

  // ❗❗ FIX UTAMA: Hapus semua elemen anak sebelum menambahkan ulang
  while (videoList.firstChild) {
    videoList.removeChild(videoList.firstChild);
  }

  for (const videoURL of videos) {
    const videoData = await getYouTubeData(videoURL);

    if (videoData) {
      const videoItem = document.createElement("div");
      videoItem.classList.add("video-item");

      if (isMobile()) {
        // Mode Mobile: Judul & Tombol langsung tampil
        videoItem.innerHTML = `
            <img class="video-thumbnail" src="${videoData.thumbnail}" alt="Thumbnail">
            <p class="video-title">${videoData.title}</p>
            <a class="watch-button" href="${videoData.url}" target="_blank">Tonton</a>
          `;
      } else {
        // Mode Desktop: Hover untuk menampilkan judul & tombol
        videoItem.innerHTML = `
            <img class="video-thumbnail" src="${videoData.thumbnail}" alt="Thumbnail">
            <div class="video-overlay">
              <p class="video-title">${videoData.title}</p>
              <a class="video-link" href="${videoData.url}" target="_blank">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          `;
      }

      videoList.appendChild(videoItem);
    }
  }
}

// ❗❗ FIX UTAMA: Hapus event listener resize sebelum menambahkan ulang
window.removeEventListener("resize", loadVideos);
window.addEventListener("resize", () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(loadVideos, 5000); // Tunggu 5s sebelum reload
});

// Panggil `loadVideos()` saat halaman dimuat pertama kali
document.addEventListener("DOMContentLoaded", loadVideos);
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 50, // Sesuaikan jika ada navbar tetap (fixed)
      behavior: "smooth",
    });
  });
});
function toggleMenu() {
  const menu = document.querySelector("nav");
  menu.classList.toggle("show");
}

function closeMenu() {
  document.querySelector("nav").classList.remove("show");
}

// Tutup menu jika klik di latar belakang navigasi
document.querySelector("nav").addEventListener("click", function (event) {
  const navLinks = document.getElementById("nav-links");

  // Jika yang diklik adalah bagian luar menu (bukan daftar menu), tutup menu
  if (!navLinks.contains(event.target)) {
    closeMenu();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  closeModal(); // Tutup modal saat halaman direfresh
});

function openModal(title, description, skills = []) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-description").textContent = description;

  // Ambil elemen daftar keahlian
  const skillList = document.getElementById("modal-skills");
  const skillTitle = document.getElementById("modal-skills-title");

  // Kosongkan daftar sebelum menambahkan item baru
  skillList.innerHTML = "";

  if (skills.length > 0) {
    skillTitle.style.display = "block"; // Tampilkan judul keahlian
    skills.forEach((skill) => {
      const listItem = document.createElement("li");
      listItem.textContent = skill;
      skillList.appendChild(listItem);
    });
  } else {
    skillTitle.style.display = "none"; // Sembunyikan jika tidak ada keahlian
  }

  document.getElementById("service-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("service-modal").style.display = "none";
}

// Tutup modal jika klik di luar modal
window.onclick = function (event) {
  const modal = document.getElementById("service-modal");
  if (event.target === modal) {
    closeModal();
  }
};
document.addEventListener("DOMContentLoaded", function () {
  const descriptions = document.querySelectorAll(".card-description");
  const minLength = 80; // Panjang minimal deskripsi

  descriptions.forEach((desc) => {
    let text = desc.textContent.trim();

    if (text.length < minLength) {
      let extraDots = ".".repeat((minLength - text.length) / 4); // Tambahkan titik agar terlihat panjang
      desc.textContent = text + " " + extraDots + "...";
    }
  });
});
document
  .getElementById("contact-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah reload halaman saat submit

    // Ambil nilai input
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const formMessage = document.getElementById("form-message");

    // Validasi input
    if (!firstName || !lastName || !mobile || !email || !message) {
      formMessage.textContent = "Semua kolom harus diisi!";
      formMessage.style.color = "red";
      formMessage.style.display = "block";
      return;
    }

    // Kirim data ke backend
    const formData = { firstName, lastName, mobile, email, message };

    try {
      const response = await fetch(
        "https://portfolio-saya-production.up.railway.app/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        formMessage.textContent = "Pesan Anda telah dikirim!";
        formMessage.style.color = "#00ccff";
      } else {
        formMessage.textContent = "Terjadi kesalahan, coba lagi nanti.";
        formMessage.style.color = "red";
      }
    } catch (error) {
      formMessage.textContent = "Gagal menghubungi server.";
      formMessage.style.color = "red";
    }

    formMessage.style.display = "block";

    // Reset form setelah 2 detik
    setTimeout(() => {
      document.getElementById("contact-form").reset();
      formMessage.style.display = "none";
    }, 2000);
  });
