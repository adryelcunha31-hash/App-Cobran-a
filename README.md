# App de Cobrança (Pix + Painel Administrativo)

Aplicação full-stack para gestão de cobrança com:
- Cadastro de clientes e contratos/ordens de serviço.
- Dashboard visual por cores (vencidos, pendentes, pagos).
- Geração de cobrança Pix com TXID/QR e conciliação automática por webhook.
- Controle de caixa manual.
- Alertas de priorização com sugestões de ação (IA baseada em regras).
- Relatórios de receita, inadimplência e visão por status.

## Stack
- **Backend**: Node.js + Express + PostgreSQL.
- **Frontend**: React + Vite.

## Como executar

### 1) Subir PostgreSQL
```bash
docker compose up -d
```

### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Endpoints principais
- `POST /clients` → cadastrar cliente
- `GET /clients` → listar clientes
- `POST /contracts` → cadastrar contrato/ordem
- `GET /contracts/invoices?status={status}` → listar por status
- `POST /pix/create` → gerar cobrança Pix
- `POST /pix/webhook` → webhook de confirmação de pagamento
- `POST /cash/register` → registrar caixa manual
- `GET /dashboard/summary` → visão geral com alertas críticos
- `POST /dashboard/notify` → enfileirar notificação e-mail/WhatsApp (mock)

## Fluxo Pix
1. Criar contrato.
2. Gerar cobrança em `POST /pix/create`.
3. Receber pagamento no provedor Pix.
4. Provedor chama `POST /pix/webhook` com `{ txid, paidAmount }`.
5. Sistema concilia e marca contrato como `Pago` ou `DIVERGENTE`.

## Observações
- A integração Pix está pronta para adaptação de provedor real (Banco Central/PSP) no serviço `pixService.js`.
- Notificações estão em modo mock para facilitar troca por SMTP/API WhatsApp.
