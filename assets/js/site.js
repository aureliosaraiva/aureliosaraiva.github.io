// Tema claro/escuro e botão "copiar" nos blocos de código.
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");

  function current() {
    return root.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function label() {
    if (!btn) return;
    var next = current() === "dark" ? "light" : "dark";
    btn.textContent = next;
    btn.setAttribute("aria-label", "Mudar para tema " + (next === "dark" ? "escuro" : "claro"));
  }
  if (btn) {
    btn.hidden = false;
    label();
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", label);
  }

  if (!navigator.clipboard) return;
  document.querySelectorAll(".prose pre").forEach(function (pre) {
    var wrap = document.createElement("div");
    wrap.className = "code-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "btn";
    copy.textContent = "copiar";
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.innerText.replace(/\n$/, "")).then(function () {
        copy.textContent = "copiado";
        setTimeout(function () { copy.textContent = "copiar"; }, 1500);
      });
    });
    wrap.appendChild(copy);
  });
})();
