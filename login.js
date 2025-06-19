function verificarLogin() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("senha").value;
    const erro = document.getElementById("erroLogin");
  
    if (user === "admin" && pass === "1234") {
      window.location.href = "index.html";
    } else {
      erro.textContent = "Credenciais inválidas!";
    }
  }