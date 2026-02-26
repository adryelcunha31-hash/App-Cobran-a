import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cobranca_db'
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      whatsapp TEXT,
      document TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      service_description TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      issue_date DATE NOT NULL,
      due_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendente',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      paid_at TIMESTAMP,
      payment_source TEXT,
      payment_amount NUMERIC(12,2)
    );

    CREATE TABLE IF NOT EXISTS pix_charges (
      id SERIAL PRIMARY KEY,
      contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
      txid TEXT NOT NULL UNIQUE,
      qr_code TEXT NOT NULL,
      emv TEXT,
      amount NUMERIC(12,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'ATIVA',
      created_at TIMESTAMP DEFAULT NOW(),
      paid_at TIMESTAMP,
      paid_amount NUMERIC(12,2)
    );

    CREATE TABLE IF NOT EXISTS cash_entries (
      id SERIAL PRIMARY KEY,
      contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
      description TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      paid_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      source TEXT NOT NULL DEFAULT 'MANUAL'
    );
  `);
}
