let logs = []; // guarda todos os eventos do sistema
let trafficGreen = false;
let cameraOn = false;
let powerOn = true;

function toggleTraffic() {
  trafficGreen = !trafficGreen;
  document.getElementById("trafficStatus").innerText =
    `Semáforo: ${trafficGreen ? "🟢 Verde" : "🚦 Vermelho"}`;
}

function toggleCamera() {
  cameraOn = !cameraOn;
  document.getElementById("cameraStatus").innerText =
    `Câmeras: ${cameraOn ? "🟢 Ligadas" : "🔴 Desligadas"}`;
}

function togglePower() {
  powerOn = !powerOn;
  document.getElementById("powerStatus").innerText =
    `Energia: ${powerOn ? "⚡ Ativa" : "🔌 Desligada"}`;
}

async function loadCitizen() {
  try {
    const response = await fetch('/api/cidadaos');
    const data = await response.json();

    let output = "";
    data.forEach((citadao, i) => {
      output += `👤 ${i + 1}\n`;
      output += `Nome: ${citadao.nome}\n`;
      output += `Profissão: ${citadao.profissao}\n`;
      output += `Vigilância: ${citadao.vigilancia}\n\n`;
    });

    document.getElementById("citizenData").innerText = output;
  } catch (error) {
    document.getElementById("citizenData").innerText = "❌ Erro ao buscar dados.";
    console.error("Erro ao carregar cidadãos:", error);
  }
}
function carregarCidadaos() {
  fetch('cidadaos.json')
    .then(response => response.json())
    .then(data => {
      let output = "";
      data.forEach((c, i) => {
        output += `👤 ${i + 1}\n`;
        output += `Nome: ${c.nome}\n`;
        output += `Profissão: ${c.profissao}\n`;
        output += `Vigilância: ${c.vigilancia}\n\n`;
      });
      document.getElementById("citizenData").innerText = output;
    })
    .catch(error => {
      document.getElementById("citizenData").innerText = "Erro ao carregar cidadãos.";
      console.error(error);
    });
}

// Simulador de alertas
const alertasExemplo = [
  "Invasão detectada nas câmeras do setor 5!",
  "Tentativa de desligamento da rede elétrica!",
  "Acesso não autorizado ao banco de dados!",
  "Falha no firewall principal!",
  "Anomalia detectada no tráfego da rede."
];

setInterval(() => {
  const alertaAleatorio = alertasExemplo[Math.floor(Math.random() * alertasExemplo.length)];
  document.getElementById("alertas").innerText = alertaAleatorio;
}, 10000); // a cada 10 segundos

function inicializarMapa() {
  const localizacaoPedro = { lat: -17.0689399, lng: 15.7525386 };

  const mapa = new google.maps.Map(document.getElementById("map"), {
    center: localizacaoPedro,
    zoom: 14
  });

  new google.maps.Marker({
    position: localizacaoPedro,
    map: mapa,
    title: "Localização de Pedro 📍"
  });
  function inicializarMapa() {
    const localizacaoPedro = { lat: -17.0689399, lng: 15.7525386 };
  
    const mapa = new google.maps.Map(document.getElementById("map"), {
      center: localizacaoPedro,
      zoom: 14
    });
  
    new google.maps.Marker({
      position: localizacaoPedro,
      map: mapa,
      title: "Localização de Pedro 📍"
    });
  }
  // Criar ícones coloridos
const iconesVigilancia = {
  Alta: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  Moderada: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  Baixa: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })
};
cidadaos.forEach(c => {
  const marcador = L.marker([c.lat, c.lng], { icon: iconesVigilancia[c.vigilancia] })
    .addTo(map)
    .bindPopup(`<strong>${c.nome}</strong><br>${c.profissao}<br>Vigilância: ${c.vigilancia}`);
});
L.circle([lat, lng], { radius: 200, color: 'red' }).addTo(map)
const contagemVigilancia = {
  Alta: 0,
  Moderada: 0,
  Baixa: 0
};

cidadaos.forEach(c => {
  contagemVigilancia[c.vigilancia]++;
});
const zonaPerigo = {
  centro: [-17.0685, 15.7515],
  raio: 200 // em metros
};

// Desenha a zona no mapa
L.circle(zonaPerigo.centro, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.2,
  radius: zonaPerigo.raio
}).addTo(map);

// Conta quem está dentro da zona
function estaNaZona(c) {
  const dist = map.distance([c.lat, c.lng], zonaPerigo.centro);
  return dist <= zonaPerigo.raio;
}

const totalNaZona = cidadaos.filter(estaNaZona).length;
const totalForaZona = cidadaos.length - totalNaZona;
// Gráfico de Pizza: níveis de vigilância
new Chart(document.getElementById('graficoVigilancia'), {
  type: 'pie',
  data: {
    labels: ['Alta', 'Moderada', 'Baixa'],
    datasets: [{
      data: [
        contagemVigilancia.Alta,
        contagemVigilancia.Moderada,
        contagemVigilancia.Baixa
      ],
      backgroundColor: ['#ff4d4d', '#ffaa00', '#4dff4d']
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Distribuição de Vigilância'
      }
    }
  }
});

// Gráfico de Barras: zona de perigo
new Chart(document.getElementById('graficoZonaPerigo'), {
  type: 'bar',
  data: {
    labels: ['Na zona de perigo', 'Fora da zona'],
    datasets: [{
      label: 'Cidadãos',
      data: [totalNaZona, totalForaZona],
      backgroundColor: ['#ff0000', '#00ccff']
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Presença em Zona de Perigo'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }
});
function atualizarGraficos() {
  const contagemVigilancia = { Alta: 0, Moderada: 0, Baixa: 0 };
  cidadaos.forEach(c => {
    contagemVigilancia[c.vigilancia]++;
  });

  const totalNaZona = cidadaos.filter(estaNaZona).length;
  const totalForaZona = cidadaos.length - totalNaZona;

  // Atualizar os gráficos existentes
  graficoPizza.data.datasets[0].data = [
    contagemVigilancia.Alta,
    contagemVigilancia.Moderada,
    contagemVigilancia.Baixa
  ];
  graficoPizza.update();

  graficoBarras.data.datasets[0].data = [totalNaZona, totalForaZona];
  graficoBarras.update();
}
const graficoPizza = new Chart(document.getElementById('graficoVigilancia'), { ... });
const graficoBarras = new Chart(document.getElementById('graficoZonaPerigo'), { ... });
cidadaos.forEach(c => {
  const marcador = L.marker([c.lat, c.lng], {
    icon: iconesVigilancia[c.vigilancia]
  }).addTo(map)
    .bindPopup(`<strong>${c.nome}</strong><br>${c.profissao}<br>Vigilância: ${c.vigilancia}`)
    .on('click', () => {
      document.getElementById("detalhes").innerHTML = `
        <strong>Nome:</strong> ${c.nome}<br>
        <strong>Profissão:</strong> ${c.profissao}<br>
        <strong>Vigilância:</strong> ${c.vigilancia}<br>
        <strong>Zona de perigo:</strong> ${estaNaZona(c) ? "⚠ Sim" : "✅ Não"}
      `;
    });
});
function exportarImagem() {
  const canvas = document.getElementById('graficoVigilancia');
  const imagem = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imagem;
  link.download = 'grafico-vigilancia.png';
  link.click();
}
async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const canvas = document.getElementById('graficoVigilancia');
  const imgData = canvas.toDataURL('image/png');

  doc.text("Relatório de Vigilância", 10, 10);
  doc.addImage(imgData, 'PNG', 10, 20, 180, 100);
  doc.save("relatorio.pdf");
}
const cidadaos = [
  {
    nome: "Joana Silva",
    profissao: "Médica",
    vigilancia: "Alta",
    lat: -17.0692,
    lng: 15.7521,
    marcador: null // marcador será armazenado aqui
  },
  {
    nome: "Pedro Sousa",
    profissao: "Engenheiro",
    vigilancia: "Baixa",
    lat: -17.0675,
    lng: 15.7499,
    marcador: null
  }
];
cidadaos.forEach(c => {
  const marcador = L.marker([c.lat, c.lng], {
    icon: iconesVigilancia[c.vigilancia]
  }).addTo(map)
    .bindPopup(`<strong>${c.nome}</strong><br>${c.profissao}<br>Vigilância: ${c.vigilancia}`)
    .on('click', () => {
      document.getElementById("detalhes").innerHTML = `
        <strong>Nome:</strong> ${c.nome}<br>
        <strong>Profissão:</strong> ${c.profissao}<br>
        <strong>Vigilância:</strong> ${c.vigilancia}<br>
        <strong>Zona de perigo:</strong> ${estaNaZona(c) ? "⚠ Sim" : "✅ Não"}
      `;
    });

  // Armazena marcador no objeto
  c.marcador = marcador;
});
function moverCidadaos() {
  cidadaos.forEach(c => {
    // Gera pequeno deslocamento aleatório
    const deslocLat = (Math.random() - 0.5) * 0.0003;
    const deslocLng = (Math.random() - 0.5) * 0.0003;

    c.lat += deslocLat;
    c.lng += deslocLng;

    // Atualiza marcador no mapa
    c.marcador.setLatLng([c.lat, c.lng]);

    // Atualiza popup
    c.marcador.setPopupContent(`
      <strong>${c.nome}</strong><br>${c.profissao}<br>
      Vigilância: ${c.vigilancia}<br>
      ${estaNaZona(c) ? "<span style='color:red'>⚠ Em zona de perigo</span>" : "🟢 Fora da zona"}
    `);
  });

  // Atualiza gráficos
  atualizarGraficos();
}

// Inicia a simulação a cada 4 segundos
setInterval(moverCidadaos, 4000);
function tocarAlerta(c) {
  const som = document.getElementById("somAlerta");
  som.play();

  const painel = document.getElementById("painelAlertas");
  const item = document.createElement("li");
  item.innerHTML = `⚠️ <strong>${c.nome}</strong> entrou na zona de perigo às ${new Date().toLocaleTimeString()}`;
  item.style.color = "red";
  painel.prepend(item);

  // Registrar no log
  logs.push({
    tipo: "ALERTA",
    cidadao: c.nome,
    hora: new Date().toLocaleTimeString(),
    posicao: { lat: c.lat, lng: c.lng }
  });
}
cidadaos.forEach(c => {
  c.marcador = null;
  c.entrouNaZona = false;
  c.trilha = [[c.lat, c.lng]]; // começa com a posição inicial
  c.linha = null; // será a polilinha
});
// Após adicionar o marcador
const corTrilha = c.vigilancia === "Alta" ? "red" :
                  c.vigilancia === "Moderada" ? "orange" : "green";

c.linha = L.polyline(c.trilha, {
  color: corTrilha,
  weight: 2
}).addTo(map);
// Adiciona novo ponto à trilha
c.trilha.push([c.lat, c.lng]);

// Atualiza a linha no mapa
c.linha.setLatLngs(c.trilha);
function calcularDistanciaTotal(trilha) {
  let distancia = 0;
  for (let i = 1; i < trilha.length; i++) {
    distancia += map.distance(trilha[i - 1], trilha[i]);
  }
  return distancia; // em metros
}
const distanciaPercorrida = calcularDistanciaTotal(c.trilha);

c.marcador.setPopupContent(`
  <strong>${c.nome}</strong><br>
  ${c.profissao}<br>
  Vigilância: ${c.vigilancia}<br>
  ${estaNaZona(c) ? "<span style='color:red'>⚠ Zona de perigo</span>" : "🟢 Seguro"}<br>
  Distância percorrida: ${(distanciaPercorrida / 1000).toFixed(2)} km
`);
document.getElementById("detalhes").innerHTML = `
  <strong>Nome:</strong> ${c.nome}<br>
  <strong>Profissão:</strong> ${c.profissao}<br>
  <strong>Vigilância:</strong> ${c.vigilancia}<br>
  <strong>Zona de perigo:</strong> ${estaNaZona(c) ? "⚠ Sim" : "✅ Não"}<br>
  <strong>Distância:</strong> ${(distanciaPercorrida / 1000).toFixed(2)} km
`;
function aplicarFiltros() {
  const nome = document.getElementById("filtroNome").value.toLowerCase();
  const nivel = document.getElementById("filtroVigilancia").value;
  const apenasZona = document.getElementById("filtroZona").checked;

  cidadaos.forEach(c => {
    const nomeCombina = c.nome.toLowerCase().includes(nome);
    const nivelCombina = !nivel || c.vigilancia === nivel;
    const zonaCombina = !apenasZona || estaNaZona(c);

    const visivel = nomeCombina && nivelCombina && zonaCombina;

    if (visivel) {
      c.marcador.addTo(map);
      c.linha.addTo(map);
    } else {
      map.removeLayer(c.marcador);
      map.removeLayer(c.linha);
    }
  });
}
function verificarLogin() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;
  const erro = document.getElementById("erroLogin");

  // Credenciais falsas
  if (user === "admin" && pass === "1234") {
    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "block";
  } else {
    erro.textContent = "Credenciais inválidas!";
  }
}
function exportarLogsTXT() {
  let conteudo = "📋 Mini ctOS - Log de Eventos\n\n";
  logs.forEach(l => {
    conteudo += `[${l.hora}] ${l.tipo} - ${l.cidadao} (${l.posicao.lat.toFixed(5)}, ${l.posicao.lng.toFixed(5)})\n`;
  });

  const blob = new Blob([conteudo], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "logs_ctos.txt";
  link.click();
}
function exportarLogsJSON() {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "logs_ctos.json";
  link.click();
}
<script>
  if (!localStorage.getItem("usuarioLogado")) {
    alert("Acesso negado. Faça login primeiro.");
    window.location.href = "login.html";
  }

  function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  }
</script>
}
fetch('cidadaos.json')
  .then(res => res.json())
  .then(data => {
    cidadaos = data;
    atualizarLista();
  });
