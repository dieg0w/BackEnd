//PARA O FRONT

const BASE_API = 'http://localhost:3000';

// Funções de validação
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCNPJ(cnpj) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    return cnpjLimpo.length === 14;
}

// Formulário de cadastro
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validações no lado do cliente
        if (!validarEmail(data.email)) {
            document.getElementById('message').textContent = 'Email inválido';
            return;
        }
        if (!validarCNPJ(data.cnpj)) {
            document.getElementById('message').textContent = 'CNPJ inválido';
            return;
        }
        if (data.senha !== data.confirmar_senha) {
            document.getElementById('message').textContent = 'Senhas não coincidem';
            return;
        }

        try {
            const response = await fetch(`${BASE_API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                document.getElementById('message').textContent = 'Usuário cadastrado com sucesso!';
                document.getElementById('message').style.color = 'green';
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                document.getElementById('message').textContent = result.error;
            }
        } catch (error) {
            document.getElementById('message').textContent = 'Erro de conexão';
        }
    });
}

// Formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${BASE_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token);
                window.location.href = 'admin.html';
            } else {
                document.getElementById('message').textContent = result.error;
            }
        } catch (error) {
            document.getElementById('message').textContent = 'Erro de conexão';
        }
    });
}

// Página de administração
if (document.getElementById('usersTable')) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    } else {
        buscarUsuarios();
    }

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    async function buscarUsuarios() {
        try {
            const response = await fetch(`${BASE_API}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const users = await response.json();
                const tbody = document.getElementById('usersBody');
                tbody.innerHTML = '';
                users.forEach(user => {
                    const row = `<tr>
                        <td>${user.id}</td>
                        <td>${user.nome_usuario}</td>
                        <td>${user.email}</td>
                        <td>${user.cnpj}</td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
            } else {
                document.getElementById('message').textContent = 'Erro ao carregar usuários';
            }
        } catch (error) {
            document.getElementById('message').textContent = 'Erro de conexão';
        }
    }
}

