const cabecalho = document.querySelector('.cabecalho-site');
const progresso = document.querySelector('.progresso-rolagem');
const logoMarca = document.querySelector('.marca');

// =========================================================
// NOVO: ROLAGEM SUAVE AO CLICAR NA LOGO (E REMOVE O '#')
// =========================================================
if (logoMarca) {
    logoMarca.addEventListener('click', function (e) {
        e.preventDefault(); // Cancela o comportamento padrão (não adiciona o # na URL)
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Aplica a animação de rolagem suave para o topo
        });
    });
}

// Efeito de rolagem do cabeçalho e barra de progresso
window.addEventListener('scroll', function () {
    const rolagemY = window.scrollY;

    if (cabecalho) {
        if (rolagemY > 20) {
            cabecalho.classList.add('rolado');
        } else {
            cabecalho.classList.remove('rolado');
        }
    }

    if (progresso) {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        if (alturaTotal > 0) {
            const percentual = (rolagemY / alturaTotal) * 100;
            progresso.style.width = `${percentual}%`;
            progresso.style.opacity = rolagemY > 10 ? '1' : '0';
        }
    }
}, { passive: true });

// Lógica dos Selects Customizados
document.addEventListener('DOMContentLoaded', function () {
    const selects = document.querySelectorAll('.campo-form select');

    selects.forEach(select => {
        select.classList.add('select-escondido');
        const wrapper = document.createElement('div');
        wrapper.classList.add('custom-select-wrapper');
        const trigger = document.createElement('div');
        trigger.classList.add('custom-select-trigger');

        const initialText = select.options[select.selectedIndex].text;
        const isPlaceholder = select.options[select.selectedIndex].disabled;

        trigger.innerHTML = `<span class="${isPlaceholder ? 'placeholder' : ''}">${initialText}</span>
                             <svg class="seta-select" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>`;

        const optionsList = document.createElement('div');
        optionsList.classList.add('custom-select-options');

        Array.from(select.options).forEach((option, index) => {
            if (option.disabled) return;
            const customOption = document.createElement('div');
            customOption.classList.add('custom-option');
            customOption.textContent = option.text;

            customOption.addEventListener('click', function (e) {
                e.stopPropagation();
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));
                const triggerSpan = trigger.querySelector('span');
                triggerSpan.textContent = option.text;
                triggerSpan.classList.remove('placeholder');
                optionsList.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                customOption.classList.add('selected');
                wrapper.classList.remove('open');
            });
            optionsList.appendChild(customOption);
        });

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsList);
        select.parentNode.insertBefore(wrapper, select.nextSibling);
    });

    document.addEventListener('click', function () {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    });
});

// Verifica se precisa mostrar os dados do companheiro
function verificarCompanheiro() {
    const estadoCivil = document.getElementById('estado_civil').value;
    const sessaoCompanheiro = document.getElementById('sessao-companheiro');
    if (estadoCivil === 'casado(a)' || estadoCivil === 'união estável') {
        sessaoCompanheiro.style.display = 'block';
    } else {
        sessaoCompanheiro.style.display = 'none';
    }
}

// Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
function formatarDataBR(dataString) {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Lógica de envio do formulário
document.getElementById('form-pre-analise').addEventListener('submit', function (e) {
    e.preventDefault();

    const lgpd = document.querySelector('input[name="lgpd"]:checked')?.value;
    if (lgpd === 'Nao Autorizo') {
        alert('Atenção: Para realizarmos a sua pré-análise, precisamos da sua autorização para uso dos dados conforme a LGPD. Por favor, marque "Autorizo".');
        return;
    }

    const botaoEnviar = document.querySelector('.botao-enviar-zap');
    const textoOriginalBotao = botaoEnviar.innerHTML;
    botaoEnviar.innerHTML = 'Enviando dados...';
    botaoEnviar.disabled = true;

    // Coleção dos dados
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        nascimento: formatarDataBR(document.getElementById('nascimento').value),
        escolaridade: document.getElementById('escolaridade').value,
        pis: document.getElementById('pis').value,
        email: document.getElementById('email').value,
        estadoCivil: document.getElementById('estado_civil').value,
        nomeComp: document.getElementById('nome_comp')?.value || '',
        cpfComp: document.getElementById('cpf_comp')?.value || '',
        nascimentoComp: formatarDataBR(document.getElementById('nascimento_comp')?.value),
        emailComp: document.getElementById('email_comp')?.value || '',
        escolaridadeComp: document.getElementById('escolaridade_comp')?.value || '',
        pisComp: document.getElementById('pis_comp')?.value || '',
        compromissoFinanceiro: document.querySelector('input[name="compromisso_financeiro"]:checked')?.value || 'Não informado',
        filhos: document.querySelector('input[name="filhos"]:checked')?.value || 'Não informado',
        tempoTrabalho: document.querySelector('input[name="tempo_trabalho"]:checked')?.value || 'Não informado',
        outroImovel: document.getElementById('outro_imovel').value
    };

    // Montagem da mensagem do WhatsApp
    let mensagem = `📋 *SOLICITAÇÃO DE PRÉ-ANÁLISE - JARDIM EUROPA (5ª FASE)*\n`;
    mensagem += `_(Formulário preenchido pela página exclusiva)_\n\n`;

    mensagem += `👤 *1. DADOS PESSOAIS*\n`;
    mensagem += `▪️ Nome: ${dados.nome}\n`;
    mensagem += `▪️ CPF: ${dados.cpf}\n`;
    mensagem += `▪️ Nascimento: ${dados.nascimento}\n`;
    mensagem += `▪️ Escolaridade: ${dados.escolaridade}\n`;
    mensagem += `▪️ PIS: ${dados.pis}\n`;
    mensagem += `▪️ E-mail: ${dados.email}\n`;
    mensagem += `▪️ Estado Civil: ${dados.estadoCivil}\n\n`;

    if (dados.estadoCivil === 'casado(a)' || dados.estadoCivil === 'união estável') {
        mensagem += `👥 *2. DADOS DO COMPANHEIRO(A)*\n`;
        mensagem += `▪️ Nome: ${dados.nomeComp || 'Não preenchido'}\n`;
        mensagem += `▪️ CPF: ${dados.cpfComp || 'Não preenchido'}\n`;
        mensagem += `▪️ Nascimento: ${dados.nascimentoComp || 'Não preenchido'}\n`;
        mensagem += `▪️ E-mail: ${dados.emailComp || 'Não preenchido'}\n`;
        mensagem += `▪️ Escolaridade: ${dados.escolaridadeComp || 'Não preenchido'}\n`;
        mensagem += `▪️ PIS: ${dados.pisComp || 'Não preenchido'}\n\n`;
    }

    mensagem += `📊 *3. DETALHES FINANCEIROS E FINANCIAMENTO*\n`;
    mensagem += `▪️ Financiamentos/Empréstimos ativos: ${dados.compromissoFinanceiro}\n`;
    mensagem += `▪️ Possui filhos menores? ${dados.filhos}\n`;
    mensagem += `▪️ Mais de 3 anos de carteira (36 meses)? ${dados.tempoTrabalho}\n`;
    mensagem += `▪️ Outro imóvel ou herança: ${dados.outroImovel}\n\n`;

    mensagem += `✅ *Autorizou o uso de dados (LGPD):* Sim\n\n`;
    mensagem += `📎 *Aguardando envio do comprovante de renda em foto/anexo logo abaixo.*`;

    // Função para abrir o WhatsApp e restaurar o botão
    function finalizarEnvio() {
        const urlFormatada = `https://wa.me/5535984030660?text=${encodeURIComponent(mensagem)}`;
        window.open(urlFormatada, '_blank');
        botaoEnviar.innerHTML = textoOriginalBotao;
        botaoEnviar.disabled = false;
    }

    // =========================================================
    // INSIRA SUA URL DO GOOGLE SCRIPT AQUI (NÃO ESQUEÇA)
    // =========================================================
    const URL_DO_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbyqv1_k6ENqFVlQuBwCsQCV6XUhEj-osOU4HccHCu-reVU2vya9fFp2lwK_Kp-CfdgDgA/exec';

    // Envio para o Google Sheets
    fetch(URL_DO_GOOGLE_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(dados)
    })
    .then(response => {
        finalizarEnvio();
    })
    .catch(err => {
        console.error('Erro na planilha, mas enviando para o zap:', err);
        finalizarEnvio();
    });
});