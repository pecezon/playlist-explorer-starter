
const modal = document.getElementById("event-modal");
const span = document.getElementsByClassName("close")[0];

function openModal(festival) {
   modal.style.display = "block";
}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}