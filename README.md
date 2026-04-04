# 🏥 ViverBem (MedCare) - Frontend Mobile

> Interface inteligente para identificação e gestão de medicamentos voltada à terceira idade.

O **ViverBem** é uma aplicação mobile multiplataforma projetada para promover a autonomia de idosos (60+) no gerenciamento de tratamentos medicamentosos. O sistema utiliza **Inteligência Artificial** para transformar a câmera do smartphone em uma ferramenta de segurança, identificando fármacos e automatizando alertas.

<img width="184" height="383" alt="image" src="https://github.com/user-attachments/assets/9e2005b6-942b-42a0-b2e9-10c72156908f" /> <img width="186" height="390" alt="image" src="https://github.com/user-attachments/assets/6a74a630-85d3-453e-be1a-1700e0712d03" /> <img width="188" height="393" alt="image" src="https://github.com/user-attachments/assets/6430e176-ab7f-4c80-b5e3-898ef570b6fd" /> <img width="184" height="389" alt="image" src="https://github.com/user-attachments/assets/d516b75a-3ee9-4632-8a25-c2571ee4e27a" />




---

## ✨ Funcionalidades Principais (MVP)

- 🔍 **Escaneamento por IA (RF03):** Identificação automática de medicamentos via câmera com integração ao Google Vision AI.
- 📄 **Bula Simplificada (RF04):** Exibição de informações essenciais (nome, dosagem, indicações) em linguagem acessível.
- ⏰ **Gestão de Alarmes (RF05):** Cadastro de horários com repetições configuráveis e confirmação de dose.
- ♿ **Acessibilidade Nativa (RF10/11):** Interface de alto contraste, fontes ampliadas (16sp a 24sp) e leitura por voz (Text-to-Speech).
- 🆘 **Rede de Apoio (RF12):** Notificações para contatos de emergência caso doses não sejam confirmadas em 24h.

---

## 🛠️ Stack Tecnológica

| Categoria    | Tecnologia        | Justificativa                                                      |
|--------------|-------------------|--------------------------------------------------------------------|
| Frontend     | React + TypeScript | Performance nativa e tipagem segura para projetos acadêmicos.     |
| Build Tool   | Vite              | Agilidade no desenvolvimento e hot reload otimizado.              |
| Estilização  | Tailwind CSS      | Agilidade na criação de interfaces responsivas e acessíveis.      |
| IA           | Google Vision AI  | Precisão no reconhecimento de imagens e OCR.                      |
| Design       | Figma             | Prototipagem colaborativa focada em acessibilidade.               |

---

## 🚀 Como Executar

**Requisitos:** Node.js instalado.

1. Clone o repositório:
   ```bash
   git clone https://github.com/marlonporto/viver-bem.git
   ```

2. Instale as dependências:
   ```bash
   npm i
   ```

3. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🏗️ Regras de Negócio e Arquitetura

O sistema opera sob o **fluxo de confiança da IA**:

- **Validação (RN05):** O resultado do escaneamento só é aceito se o grau de confiança da IA for ≥ 80%.
- **Segurança (RN01):** Toda informação exibida contém um disclaimer informando que o app não substitui orientação médica.
- **Dados (RNF05):** Armazenamento em conformidade com a LGPD utilizando criptografia AES-256.

---

## 👥 Equipe de Desenvolvimento

- Marlon Torres
- Nivaldo Arruda
- Kaian Guthierry
- Pedro Cavalcanti
- Thayna Queiroz
- João Borges
- Yuri Gabriel
- Marcio Costa

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido para o curso de **Ciência da Computação** da **Universidade Maurício de Nassau (Uninassau)** — Recife/PE, 2026.
