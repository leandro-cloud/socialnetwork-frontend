import PropTypes from 'prop-types';
import avatar from '../../assets/img/user.png';
import { global } from "../../helpers/global";
import useAuth from "../../hooks/useAuth";

export const UserList = ({ users, getUsers, following, setFollowing, more, page, setPage }) => {

  // Variable para almacenar el token para las peticiones a realizar en este componente
  const token = localStorage.getItem("token");

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth } = useAuth();

  // Método para gestionar la paginación
  const nextPage = () => {
    let next = page + 1;
    setPage(next);

    // Le enviamos el número de página actual al método getUsers
    getUsers(next);

  }

  // Método para seguir a un usuario
  const follow = async (userId) => {

    // Petición Ajax al Backend para seguir a un usuario
    const request = await fetch(global.url + "follow/follow", {
      method: "POST",
      body: JSON.stringify({ followed_user: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {

      // Actualizar el estado de following, agregando al nuevo usuario seguido al array de following
      setFollowing([...following, userId]);

    }

  }

  // Método para dejar de seguir a un usuario
  const unfollow = async (userId) => {

    // Petición Ajax al Backend para dejar de seguir a un usuario
    const request = await fetch(global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    // Actualizar el estado de unfollow para eliminar el follow
    if (data.status == "success") {

      // Actualizar el estado de following, filtrando los datos para eliminar el antiguo follow (userId)
      let filterFollowings = following.filter(followingUserId => userId !== followingUserId);

      setFollowing(filterFollowings);

    }
  }



  return (
    <>
      <div className="content__posts">
        {users.map((user) => (
          // Comprobar que user no es undefined
          user && (
          <article className="posts__post" key={user._id}>
            <div className="post__container">
              <div className="post__image-user">
                <div className="avatar">
                  <div className="general-info__container-avatar">
                    {user.image && user.image !== "default.png" ? (
                      <img src={`${global.url}user/avatar/${user.image}`} className="container-avatar__img" alt="Foto de perfil" />
                    ) : (
                      <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                    )}
                  </div>
                </div>
              </div>

              <div className="post__body">
                <div className="post__user-info">
                  <a href="#" className="user-info__name">{user.name} {user.last_name}</a>
                  <span className="user-info__divider"> | </span>
                  <a href="#" className="user-info__create-date">{user.created_at}</a>
                </div>
                <h4 className="post__content">{user.bio}</h4>
              </div>
            </div>
            {/* Con esta condición, si se muestra el usuario logueado en la lista, no muestra los botones de seguir o dejar de seguir*/}
            {user._id != auth._id &&
              <div className="post__buttons">
                {!following.includes(user._id) &&
                  <button className="post__button post__button--green"
                    onClick={() => follow(user._id)} >
                    Seguir
                  </button>
                }
                {following.includes(user._id) &&
                  <button className="post__button"
                    onClick={() => unfollow(user._id)} >
                    Dejar de Seguir
                  </button>
                }
              </div>
            }
          </article>
          )
        ))}
        <br />
      </div>

      {more &&
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más personas
          </button>
        </div>
      }
    </>
  );
}

// Validación de props usando PropTypes
UserList.propTypes = {
  users: PropTypes.array.isRequired,
  getUsers: PropTypes.func,
  following: PropTypes.array.isRequired,
  setFollowing: PropTypes.func,
  more: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func
};