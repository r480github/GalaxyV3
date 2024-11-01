document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const userCards = document.querySelectorAll(".user-cards a");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    userCards.forEach((card) => {
      const cardName = card.querySelector(".cardname p").textContent.toLowerCase();
      if (cardName.includes(searchTerm)) {
        card.style.display = "block"; // Show the matching cards
      } else {
        card.style.display = "none"; // Hide the non-matching cards
      }
    });
  });
});
