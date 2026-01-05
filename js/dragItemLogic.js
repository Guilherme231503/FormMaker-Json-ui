let touchDraggedItemName = null;
let currentHoveredSquare = null;
document.querySelectorAll(".available_items p").forEach((item) => {
  /* ================= PC ================= */
  item.setAttribute("draggable", "true");

  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("elementName", item.innerText.trim());
    e.dataTransfer.effectAllowed = "copy";

    createGridSquares();
    showGrid();
  });

  item.addEventListener("dragend", hideGrid);

  /* ================= MOBILE ================= */
  item.addEventListener("touchstart", (e) => {
    e.preventDefault();

    touchDraggedItemName = item.innerText.trim();

    createGridSquares();
    showGrid();
  });

  item.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);

    if (el && el.classList.contains("square")) {
      if (currentHoveredSquare && currentHoveredSquare !== el) {
        currentHoveredSquare.classList.remove("hovered");
      }
      currentHoveredSquare = el;
      el.classList.add("hovered");
    }
  });

  item.addEventListener("touchend", () => {
    if (currentHoveredSquare && touchDraggedItemName) {
      const editor = document.getElementById("editor");
      const index = [...document.querySelectorAll(".square")].indexOf(currentHoveredSquare);

      const element = createElement(touchDraggedItemName, index, editor);
      if (element) {
        editor.appendChild(element);
        moveToAnchorPosition(element, editor);
      }
    }

    touchDraggedItemName = null;
    currentHoveredSquare = null;
    hideGrid();
  });
});
function showGrid() {
  document.querySelectorAll(".square").forEach((s) => s.classList.add("visible"));
}

function hideGrid() {
  document.querySelectorAll(".square").forEach((s) => {
    s.classList.remove("visible");
    s.classList.remove("hovered");
  });
}
function createGridSquares() {
  const editor = document.getElementById("editor");

  // evita duplicar
  editor.querySelectorAll(".square").forEach((s) => s.remove());

  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.className = "square";
    editor.appendChild(square);

    /* ===== PC ===== */
    square.addEventListener("dragover", (e) => {
      e.preventDefault();
      square.classList.add("hovered");
    });

    square.addEventListener("dragleave", () => {
      square.classList.remove("hovered");
    });

    square.addEventListener("drop", (e) => {
      e.preventDefault();

      const droppedText = e.dataTransfer.getData("elementName");
      if (!droppedText) return;

      const element = createElement(droppedText, i, editor);
      if (element) {
        editor.appendChild(element);
        moveToAnchorPosition(element, editor);
      }

      hideGrid();
    });
  }
}
