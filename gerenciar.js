<script>
let cidadaos = JSON.parse(localStorage.getItem("cidadaos")) || [];

function salvarNoStorage() {
  localStorage.setItem("cidadaos", JSON.stringify(cidadaos));
}

function adicionarCidadao() {
  const nome = document.getElementById("nomeNovo").value;
  const profissao = document.getElementById("profissaoNovo").value;
  const vigilancia = document.getElementById("vigilanciaNova").value;

  if (!nome || !profissao) {
    alert("Preencha todos os campos!");
    return;
  }

  const lat = 0.0 + (Math.random() - 0.5) * 0.01;
  const lng = 0.0 + (Math.random() - 0.5) * 0.01;

  const novo = {
    nome,
    profissao,
    vigilancia,
    lat,
    lng
  };

  cidadaos.push(novo);
  salvarNoStorage();
  atualizarLista();
}

function removerCidadao(index) {
  if (confirm("Deseja remover este cidadão?")) {
    cidadaos.splice(index, 1);
    salvarNoStorage();
    atualizarLista();
  }
}

function editarVigilancia(index) {
  const nova = prompt("Nova vigilância (Alta, Moderada, Baixa):", cidadaos[index].vigilancia);
  if (["Alta", "Moderada", "Baixa"].includes(nova)) {
    cidadaos[index].vigilancia = nova;
    salvarNoStorage();
    atualizarLista();
  } else {
    alert("Valor inválido.");
  }
}

function atualizarLista() {
  const lista = document.getElementById("listaCidadaos");
  lista.innerHTML = "";

  cidadaos.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${c.nome} (${c.vigilancia}) <button onclick="removerCidadao(${i})">🗑</button> <button onclick="editarVigilancia(${i})">✏️</button>`;
    lista.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

function mostrarGerenciamento() {
  document.getElementById("painelGerencia").scrollIntoView({ behavior: "smooth" });
}

atualizarLista();
</script>
fetch('cidadaos.json')
.then(res => res.json())
.then(data => {
  cidadaos = data;
  atualizarLista();
});

    