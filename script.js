document.addEventListener('DOMContentLoaded', function () {
  const cursosDisponiveis = [
    { id: 1, nome: 'Administração', valorBase: 1155.24 },
    { id: 2, nome: 'Análise e Desenvolvimento de Sistemas', valorBase: 1155.24 },
    { id: 3, nome: 'Arquitetura e Urbanismo', valorBase: 1871.92 },
    { id: 4, nome: 'Biomedicina', valorBase: 1572.92 },
    { id: 5, nome: 'Ciência da Computação', valorBase: 1155.24 },
    { id: 6, nome: 'Ciências Biológicas', valorBase: 1155.24 },
    { id: 7, nome: 'Ciências Contábeis', valorBase: 1155.24 },
    { id: 8, nome: 'Ciências Econômicas', valorBase: 1155.24 },
    { id: 10, nome: 'Direito', valorBase: 1480.92 },
    { id: 11, nome: 'Educação Física', valorBase: 1572.92 },
    { id: 12, nome: 'Enfermagem', valorBase: 1572.92 },
    { id: 14, nome: 'Engenharia Agronômica', valorBase: 1871.92 },
    { id: 15, nome: 'Engenharia Civil', valorBase: 1871.92 },
    { id: 16, nome: 'Engenharia de Produção', valorBase: 1871.92 },
    { id: 17, nome: 'Engenharia Mecânica', valorBase: 1871.92 },
    { id: 18, nome: 'Farmácia', valorBase: 1572.92 },
    { id: 19, nome: 'Fisioterapia', valorBase: 1572.92 },
    { id: 21, nome: 'Medicina Veterinária', valorBase: 2478.20 },
    { id: 22, nome: 'Nutrição', valorBase: 1572.92 },
    { id: 23, nome: 'Pedagogia', valorBase: 1046.68 },
    { id: 24, nome: 'Psicologia', valorBase: 1572.92 },
  ];

  const cursoSelect = document.getElementById('cursos');
  const calculadoraEnem = document.getElementById('calculadoraEnem');
  const notaEnemInput = document.getElementById('notaEnem');
  const resultadoMensalidade = document.getElementById('resultadoMensalidade');
  const loadingSpinner = document.getElementById('loading');
  const modal = document.getElementById('resultadoModal');

  // Tabela de descontos atualizada
  const tabelaDescontos = [
    { notaMin: 300, notaMax: 499, desconto: 0.30 },
    { notaMin: 500, notaMax: 699, desconto: 0.35 },
    { notaMin: 700, notaMax: 799, desconto: 0.40 },
    { notaMin: 800, notaMax: 1000, desconto: 0.50 },
  ];

  // Adiciona cursos ao seletor e define "Selecione o curso desejado" como placeholder
  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.textContent = 'Selecione o curso desejado';
  placeholderOption.disabled = true; // Desabilita a opção
  placeholderOption.selected = true; // Define como selecionada por padrão
  cursoSelect.appendChild(placeholderOption);

  cursosDisponiveis.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });

  cursoSelect.addEventListener('change', function () {
    // Limpar o resultado e mostrar novamente os campos de entrada
    limparResultado();
    calculadoraEnem.style.display = 'block';
  });

  window.calcularMensalidade = function () {
    const cursoSelecionado = cursosDisponiveis.find(curso => curso.id === parseInt(cursoSelect.value));
    const notaEnem = parseInt(notaEnemInput.value) || 0;

    // Procura o desconto na tabela com base na nota do ENEM
    const desconto = encontrarDesconto(notaEnem);

    // Oculta inputs e botão
    ocultarElementos();

    // Exibe spinner de carregamento
    loadingSpinner.style.display = 'block';

    // Simula o tempo de processamento com um setTimeout
    setTimeout(function () {
        // Lógica para calcular a mensalidade com base na nota do ENEM e desconto
        const valorBase = cursoSelecionado.valorBase;
        const valorComDesconto = valorBase * (1 - desconto);

        // Esconde a calculadoraEnem antes de mostrar a modal
        calculadoraEnem.style.display = 'none';

        // Exibe a mensagem de resultado
        exibirResultadoModal(notaEnem, desconto, valorComDesconto);
    }, 2500);
  };

  function ocultarElementos() {
    notaEnemInput.style.display = 'none';
    document.querySelector('label[for="notaEnem"]').style.display = 'none';
    document.querySelector('button').style.display = 'none';
  }

  function exibirResultadoModal(notaEnem, desconto, valorComDesconto) {
    // Esconde o spinner
    loadingSpinner.style.display = 'none';

    // Encontra o modal
    const modal = document.getElementById('resultadoModal');

    // Verifica se o modal existe antes de tentar acessá-lo
    if (modal) {
      // Adiciona a classe modal-dialog-centered para centralizar
      modal.querySelector('.modal-dialog').classList.add('modal-dialog-centered');

      // Exibe a mensagem de resultado
      if (desconto === 1.0) {
        modal.querySelector('.modal-body').innerHTML = `<p><b>Parabéns, isso é incrível!!!</br></p><p>Você alcançou 100% de desconto em todo o curso!!</br> São poucas bolsas, então corra e feche sua matrícula!</br> <b>*Condição disponível enquanto houverem vagas disponíveis*</b> </p>`;
      } else if (notaEnem < 300) {
        modal.querySelector('.modal-body').innerHTML = `<p>Infelizmente a sua pontuação não foi suficiente para alcançar as bolsas!! Entre em contato com a sua consultora e veja as possibilidades.</p>`;
      } else {
        modal.querySelector('.modal-body').innerHTML = `<p><b>Parabéns!!!</b> Você pode conseguir ${desconto * 100}% de desconto em todo o curso!</br> Sua mensalidade pode ser de <b>R$${valorComDesconto.toFixed(2)}</b>! </br>São poucas bolsas, então corra e feche sua matrícula!</br> <b>*Condição disponível enquanto houverem vagas disponíveis*</b></p>`;
      }

      if (notaEnem > 1000) {
        modal.querySelector('.modal-body').innerHTML = `<p>TENTE NOVAMENTE, PONTUAÇÃO INVÁLIDA!!!.</p>`;
      }

      // Mostra o modal
      $(modal).modal('show');
    } else {
      console.error('O elemento do modal não foi encontrado.');
    }
  }

  function encontrarDesconto(nota) {
    // Encontra o desconto aplicável à nota do estudante
    const descontoAplicavel = tabelaDescontos.find(item => nota >= item.notaMin && nota <= item.notaMax);

    return descontoAplicavel ? descontoAplicavel.desconto : 0;
  }

  function limparResultado() {
    // Mostrar novamente os campos de entrada e limpar a mensagem de resultado
    notaEnemInput.style.display = 'block';
    document.querySelector('label[for="notaEnem"]').style.display = 'block';
    document.querySelector('button').style.display = 'block';
    resultadoMensalidade.textContent = '';
  }
});
