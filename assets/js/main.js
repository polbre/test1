// 移动端导航
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

// 滚动高亮当前章节（仅常识页的目录）
const tocLinks = document.querySelectorAll(".toc a");
if (tocLinks.length) {
  const articles = [...tocLinks].map((a) => document.querySelector(a.getAttribute("href")));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          tocLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  articles.forEach((a) => a && obs.observe(a));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchVietnamWeather();
});

async function fetchVietnamWeather() {
  const container = document.getElementById("weather-container");
  if (!container) return;

  const cities = [
    { name: "河内", region: "北部 · 红河平原", lat: 21.0245, lon: 105.8412 },
    { name: "岘港", region: "中部 · 沿海地带", lat: 16.0678, lon: 108.2208 },
    { name: "胡志明市", region: "南部 · 湄公河畔", lat: 10.8230, lon: 106.6297 }
  ];

  // 古典词汇映射表
  function getRetroWeather(code) {
    const table = {
      0: { text: "晴空万里", icon: "☀️" },
      1: { text: "微云点缀", icon: "🌤️" },
      2: { text: "半晴半云", icon: "⛅" },
      3: { text: "天色阴沉", icon: "☁️" },
      45: { text: "大雾弥漫", icon: "🌫️" },
      48: { text: "雾霭重重", icon: "🌫️" },
      51: { text: "微雨", icon: "🌧️" },
      53: { text: "细雨绵绵", icon: "🌧️" },
      55: { text: "连绵阴雨", icon: "🌧️" },
      61: { text: "小雨", icon: "🌦️" },
      63: { text: "霖雨", icon: "🌧️" },
      65: { text: "大雨如注", icon: "🌧️" },
      80: { text: "骤雨", icon: "🌦️" },
      81: { text: "阵雨", icon: "🌧️" },
      82: { text: "狂风暴雨", icon: "⛈️" },
      95: { text: "雷声大作", icon: "⛈️" }
    };
    return table[code] || { text: "天象未知", icon: "🌀" };
  }

  try {
    const cardsHTML = [];

    for (const city of cities) {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=Asia/Bangkok`);
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      const current = data.current_weather;
      const weather = getRetroWeather(current.weathercode);

      cardsHTML.push(`
        <div class="weather-card-retro">
          <div class="city-info">
            <span class="region">${city.region}</span>
            <h4 class="city-name">${city.name}</h4>
            <div class="weather-desc">
              <span class="icon">${weather.icon}</span> ${weather.text}
            </div>
          </div>
          <div class="temp-info">
            <div class="temp-val">${Math.round(current.temperature)}°C</div>
            <div class="wind-val">风动: ${current.windspeed} km/h</div>
          </div>
        </div>
      `);
    }

    container.innerHTML = cardsHTML.join("");

  } catch (error) {
    container.innerHTML = `
      <div class="weather-loading" style="border: 1px dashed var(--crimson); color: var(--crimson);">
        ⚠️ 观天象之仪暂歇，请稍候再试。
      </div>
    `;
  }
}
