document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Inicialização dos Ícones Lucide ---
    // Esta função procura por atributos data-lucide e os substitui por SVGs
    lucide.createIcons();

    // --- 2. Lógica do Modo Claro/Escuro (com persistência) ---
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    const sunIcons = document.querySelectorAll('i[data-lucide="sun"]');
    const moonIcons = document.querySelectorAll('i[data-lucide="moon"]');
    const htmlEl = document.documentElement;

    // Função para aplicar o tema (claro ou escuro)
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            sunIcons.forEach(icon => icon.classList.add('hidden'));
            moonIcons.forEach(icon => icon.classList.remove('hidden'));
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.classList.remove('dark');
            sunIcons.forEach(icon => icon.classList.remove('hidden'));
            moonIcons.forEach(icon => icon.classList.add('hidden'));
            localStorage.setItem('theme', 'light');
        }
    }

    // Carregar o tema salvo no localStorage ou a preferência do sistema
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    // Adicionar evento de clique aos botões de tema
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    });

    // --- 3. Lógica do Menu Mobile ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Alterna a visibilidade do menu
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Fecha o menu ao clicar em um link (para navegação em página única)
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- 4. Interação JS 1: Efeito de Digitação (Typing Effect) ---
    const typingTextEl = document.getElementById('typing-text');
    const words = [
        "Desenvolvedora",
        "Designer",
        "Estudante do COTEMIG",
        "Criadora de Soluções"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 60;
    const delay = 2000; // Tempo de espera antes de apagar

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Apagando
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Escrevendo
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            // Terminou de escrever a palavra
            speed = delay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Terminou de apagar
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Próxima palavra
            speed = typeSpeed;
        }

        setTimeout(type, speed);
    }
    
    // Inicia o efeito apenas se o elemento existir na página
    if (typingTextEl) {
        type();
    }


    // --- 5. Interação JS 2: Animação ao Rolar (Animate on Scroll) ---
    const sections = document.querySelectorAll('.fade-in-section');
    
    // O IntersectionObserver verifica quando um elemento entra na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar depois que a animação ocorrer
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // Ativa quando 10% da seção está visível
    });

    // Aplica o observador a todas as seções com a classe
    sections.forEach(section => {
        observer.observe(section);
    });


    // --- 6. Lógica do Modal ---
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const openModalBtns = document.querySelectorAll('.open-modal');

    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img');
    const modalDescription = document.getElementById('modal-description');
    const modalTechContainer = document.getElementById('modal-tech');

    openModalBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Preenche os dados do modal com base nos atributos "data-" do botão
            modalTitle.textContent = button.dataset.title;
            modalImg.src = button.dataset.img;
            modalDescription.textContent = button.dataset.description;

            // Limpa e preenche as tecnologias
            modalTechContainer.innerHTML = ''; // Limpa tags antigas
            const techs = button.dataset.tech.split(',').map(tech => tech.trim());
            
            techs.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                // Usa as classes do Tailwind para estilizar as tags
                span.className = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded';
                modalTechContainer.appendChild(span);
            });

            // Exibe o modal
            modal.classList.remove('hidden');
        });
    });

    // Função para fechar o modal
    function closeModal() {
        modal.classList.add('hidden');
    }

    // Evento de clique no botão "X"
    closeModalBtn.addEventListener('click', closeModal);
    
    // Evento de clique fora do conteúdo do modal (no fundo escuro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- 7. Máscara de Telefone ---
    const phoneInput = document.getElementById('telefone');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        // Limita a 11 dígitos (XX) XXXXX-XXXX
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        // Aplica a formatação (XX) XXXXX-XXXX
        let formattedValue = '';
        if (value.length > 2) {
            formattedValue = `(${value.substring(0, 2)}) `;
            if (value.length > 7) {
                formattedValue += `${value.substring(2, 7)}-${value.substring(7)}`;
            } else {
                formattedValue += value.substring(2);
            }
        } else if (value.length > 0) {
            formattedValue = `(${value}`;
        }

        e.target.value = formattedValue;
    });


    // --- 8. Manipulação do Formulário de Contato ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio real do formulário

        // Simulação de envio bem-sucedido
        // Em um projeto real, aqui você faria uma chamada (fetch) para um backend
        console.log('Formulário enviado (simulação):');
        console.log('Nome:', document.getElementById('nome').value);
        console.log('Email:', document.getElementById('email').value);
        console.log('Telefone:', document.getElementById('telefone').value);
        console.log('Mensagem:', document.getElementById('mensagem').value);

        // Exibe a mensagem de sucesso
        formSuccess.classList.remove('hidden');
        
        // Limpa o formulário
        contactForm.reset();

        // Esconde a mensagem de sucesso após 5 segundos
        setTimeout(() => {
            formSuccess.classList.add('hidden');
        }, 5000);
    });

}); // Fim do DOMContentLoaded