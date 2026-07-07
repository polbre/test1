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
