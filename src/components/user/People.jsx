
import { global } from "../../helpers/global";
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth";
import { UserList } from './UserList';

export const People = () => {

  // Variable para almacenar el token para las peticiones a realizar en este componente
  const token = localStorage.getItem("token");

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth } = useAuth();

  // Estado para guardar el array de usuarios que sigues recibido desde el backend
  const [users, setUsers] = useState([]);

  // Estado para guardar la página actual y se va actualizando al hacer clic en el botón mostrar más
  const [page, setPage] = useState(1);

  // Estado para gestionar la visibilidad del botón "Ver más personas"
  const [more, setMore] = useState(true);

  // Estado para verificar si yo sigo a un usuario, para configurar la visualización de los botones "Seguir" y "Dejar de seguir"
  const [following, setFollowing] = useState([]);

  // Hook para ejecutar el método getUsers, se ejecuta la primera vez que se carga este componente
  useEffect(() => {
    getUsers(1);
  }, []);

  // Método para hacer la petición al Backend y obtener los usuarios que sigues
  const getUsers = async (nextPaginate = 1) => {
    try {

      // Petición al Backend para obtener los usuarios que sigues desde la BD del API Backend - page actualiza la pagina a mostrar
      const response = await fetch(global.url + "user/list/" + nextPaginate, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      // Obtener la información retornada por la request
      const data = await response.json();

      // Usar la variable de estado para asignar el array de usuarios que sigues recibido
      if (data.users && data.status === "success") {

        // Filtrar usuarios para excluir al usuario autenticado
        const filteredUsers = data.users.filter(user => user._id !== auth._id);

        let newUsers = filteredUsers;

        if (users.length >= 1) {
          newUsers = [...users, ...filteredUsers];
        }

        setUsers(newUsers);


        // Asignamos a la variable de estado following, el array de seguidores que me devolvió el backend
        setFollowing(data.users_following);

        // Paginación. Comprobar si existen más usuarios para mostrar en la respuesta de la petición
        // (data.totalDocs - 5) porque el listado de usuarios ya tiene 5 usuarios en pantalla que no está contabilizando en user.length
        if (users.length >= (data.totalDocs - 5)) {
          setMore(false);
        }


      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more={more}
        page={page}
        setPage={setPage}
      />
    </>
  );
}