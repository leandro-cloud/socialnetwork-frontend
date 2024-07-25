import { useState } from "react"

export const useForm = (initialObject = {}) => {
  // hook para cuando se llena el formulario
  const [form, setForm] = useState(initialObject)

  // Metodo que recibe un target que a su vez va a recibir un input
  const changed = ({ target }) => {
    const { name, value } = target

    setForm({
      ...form,
      [name]: value
    })
  }

  return {
    form,
    changed
  }
}