let index = 0;
const items = document.querySelectorAll("#watthai.wat");
const isAutoPlay = true;

function autoScroll() {
  items[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  index = (index + 1) % items.length;
}

if (isAutoPlay) {
  setInterval(autoScroll, 3000);
}
