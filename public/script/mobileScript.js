const section = document.querySelector("#menu_mobile");
const group = document.querySelector("#group_total_resume");
const resumeMonth = document.querySelector("#resume_month");

const observer = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) {
    group.classList.add("show");
    resumeMonth.classList.add("fixed");

    console.log("SAIU");
  } else {
    group.classList.remove("show");
    resumeMonth.classList.remove("fixed");

    console.log("Voltou");
  }
}, {});

observer.observe(section);
