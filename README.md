# 🐾 PetShop App

Projeto desenvolvido em **React Native** como parte da atividade prática de recuperação de desenvolvimento mobile.  
O aplicativo consiste em uma plataforma mobile para um Pet Shop, integrando autenticação de usuários via **Firebase Authentication**, navegação intuitiva entre telas e sistema de **Notificações**.

---

## 👥 Integrantes
- Arthur - 3B
- João - 3B
- Joaquim - 3B

---

## 📌 Sobre o Projeto
O **PetShop App** foi desenvolvido para facilitar a rotina de tutores de pets, permitindo o agendamento de serviços essenciais (banho, tosa e consultas veterinárias) e o acesso a produtos do pet shop.

O projeto aplica na prática três pilares fundamentais do desenvolvimento mobile com React Native:
1. **Autenticação de Usuários:** Controle de acesso, criação de contas e login com Firebase.
2. **Navegação Mobile:** Estruturação de menus e rotas internas.
3. **Notificações:** Envio de alertas no dispositivo e listagem do histórico de notificações dentro do app.

---

## 🛠️ Tecnologias Utilizadas
- **React Native**
- **Expo** / **Expo Snack**
- **Firebase Authentication** (Login, Cadastro e Sessão)
- **React Navigation** (Navegação em abas e pilhas)
- **Expo Notifications** (Notificações locais e push)
- **JavaScript / JSX**

---

## 📱 Estrutura e Funcionalidades das Telas

### 🔐 1. Autenticação
- **Tela de Login:** Permite o acesso de usuários previamente cadastrados via e-mail e senha no Firebase.
- **Tela de Cadastro:** Permite a criação de novos usuários com persistência no **Firebase Authentication**.
- **Logout:** Encerramento seguro da sessão do usuário.

---

### 🏠 2. Home (Menu Principal)
A tela inicial oferece acesso direto aos principais serviços do Pet Shop:
- 🛁 **Agende seu Banho:** Agendamento de banhos para os pets.
- ✂️ **Agende sua Tosa:** Seleção de horários para tosa higiênica ou completa.
- 🩺 **Agende sua Consulta:** Marcação de atendimento com médicos veterinários.
- 🛍️ **Compre nossos Produtos:** Catálogo com itens e acessórios para pets.

---

### 🔔 3. Notificações
- **Notificações no Dispositivo:** Exibição de alertas diretamente na barra de notificações do sistema operacional.
- **Histórico Interno:** Lista detalhada com o histórico de todas as notificações recebidas pelo usuário dentro do aplicativo.
- **Tipos de Notificações Implementadas:**
  1. ⏰ **Lembrete de Agendamento:** Notificação automática confirmando data e horário do serviço agendado (banho, tosa ou consulta).
  2. 🏷️ **Promoções e Produtos:** Notificação sobre ofertas especiais e destaques na loja de produtos.

---

### 👤 4. Perfil
- **Dados do Usuário:** Exibição das informações do usuário logado (ex: e-mail de cadastro).
- **Opção de Logout:** Botão para desconectar a conta e retornar à tela de login.
