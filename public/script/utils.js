export function showLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

export function hideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}
