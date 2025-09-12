export const errorHandler = (error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || "Internal Server Error";

  if (error.code === 11000) {
    status = 400;
    const field = Object.keys(error.keyValue).join(", ");
    message = `Ya existe un registro con el mismo valor en: ${field}`;
    console.error("Error de duplicado:", message);
  }

  res.status(status).json({ message });
};
