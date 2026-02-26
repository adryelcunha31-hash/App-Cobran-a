import crypto from 'crypto';
import { query } from '../db/index.js';

function fakeQrFromTxid(txid, amount) {
  const payload = `PIX|TXID:${txid}|VALOR:${amount}`;
  return Buffer.from(payload).toString('base64');
}

export async function createPixCharge(contractId) {
  const contractRes = await query('SELECT * FROM contracts WHERE id = $1', [contractId]);
  if (!contractRes.rows.length) {
    throw new Error('Contrato não encontrado');
  }

  const contract = contractRes.rows[0];
  const txid = `TX${crypto.randomBytes(8).toString('hex')}`;
  const qrCode = fakeQrFromTxid(txid, contract.amount);

  const created = await query(
    `INSERT INTO pix_charges (contract_id, txid, qr_code, emv, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [contractId, txid, qrCode, `000201${txid}`, contract.amount]
  );

  return created.rows[0];
}

export async function reconcilePixPayment({ txid, paidAmount }) {
  const chargeRes = await query('SELECT * FROM pix_charges WHERE txid = $1', [txid]);
  if (!chargeRes.rows.length) {
    throw new Error('Cobrança Pix não encontrada');
  }

  const charge = chargeRes.rows[0];
  const expected = Number(charge.amount);
  const received = Number(paidAmount);
  const hasDiscrepancy = expected !== received;

  await query(
    `UPDATE pix_charges
     SET status = $2, paid_at = NOW(), paid_amount = $3
     WHERE txid = $1`,
    [txid, hasDiscrepancy ? 'DIVERGENTE' : 'PAGA', received]
  );

  if (!hasDiscrepancy) {
    await query(
      `UPDATE contracts
       SET status = 'Pago', paid_at = NOW(), payment_source = 'PIX', payment_amount = $2
       WHERE id = $1`,
      [charge.contract_id, received]
    );
  }

  return { charge, hasDiscrepancy };
}
