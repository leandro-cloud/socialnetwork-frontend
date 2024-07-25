import { global } from "../../helpers/global"
import useAuth from "../../hooks/useAuth"
import avatar from '../../assets/img/user.png';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Config = () => {

  // Recibir los metodos setAuth y serCounters
  const { auth } = useAuth()
  const [, setSaved] = useState("not_saved");
  const navigate = useNavigate()

  const updateUser = async (e) => {
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(e.target))
    delete formData.file0 

     // Actualizar el usuario modificado en la BD con una petición Ajax
     const request = await fetch(global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if(data.status == "success"){
      setSaved("saved");

      // Mostrar modal de éxito
      Swal.fire({
        title: '¡Usuario actualizado correctamente!',
        icon: 'success',
        confirmButtonText: 'Continuar',
      }).then(() => {
        // Redirigir después de cerrar el modal
        navigate('/login');
      });

    } else {
      setSaved("error");

      // Mostrar modal de error
      Swal.fire({
        title: '¡El usuario no se ha actualizado!',
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }
  }



  

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Modificar Datos de Usuario</h1>
      </header>
      <div className="content__posts">

        <div className="form-style">
          {/* Respuestas de usuario actualizado*/}

          <form className="config-form" onSubmit={updateUser}>

            <div className="form-group">
              <label htmlFor="name">Nombres</label>
              <input type="text" name="name" required defaultValue={auth.name}/>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Apellidos</label>
              <input type="text" name="last_name" required defaultValue={auth.last_name}/>
            </div>

            <div className="form-group">
              <label htmlFor="nick">Nick</label>
              <input type="text" name="nick" required defaultValue={auth.nick}/>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea name="bio" defaultValue={auth.bio}/>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" name="email" required  defaultValue={auth.email}/>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" name="password" />
            </div>

            <div className="form-group">
              <label htmlFor="file0">Avatar</label>
              <div className="avatar">
                <div className="general-info__container-avatar">
                {auth.image != "default.png" && <img src={global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                </div>
              </div>
              <br/>
              <input type="file" name="file0" id="file" />
            </div>
            <input type="submit" value="Editar" className="btn btn-success" />

          </form>
        </div>
      </div>
    </>
  )
}
