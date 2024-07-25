// Recibimos un target con el formulario
export const SerializeForm = (form) => {
  const formData = new FormData(form);
  
  const completeObt = {}

  for (let { name, value } of formData) {
    completeObt[name] = value
  }

  return completeObt
}