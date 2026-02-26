export function errorHandler(error, _req, res, _next) {
  if (error?.name === 'ZodError') {
    return res.status(400).json({ error: 'Dados inválidos', details: error.issues });
  }

  return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
}
