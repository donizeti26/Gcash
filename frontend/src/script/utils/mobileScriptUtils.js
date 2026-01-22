const section = document.querySelector("#menu_mobile");
const formCard = document.querySelector("#form_card");
const group = document.querySelector("#group_total_resume");
const resumeMonth = document.querySelector("#resume_month");
const groupCards = document.querySelector("#group_cards");

const observer = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) {
      group.classList.add("show");
      groupCards.classList.add("padding_top");
      resumeMonth.classList.add("fixed");

      console.log("SAIU");
    } else {
      group.classList.remove("show");
      groupCards.classList.remove("padding_top");

      resumeMonth.classList.remove("fixed");

      console.log("Voltou");
    }
  },
  { threshold: 0, rootMargin: "-50px 0px 0px 0px" }
);

observer.observe(section);
