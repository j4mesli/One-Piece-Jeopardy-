import { User } from "../../types/User";
import './Avatar.css';

interface AvatarProps {
  user: User;
  changeAvatar: (flag: boolean) => void;
}

function Avatar(props: AvatarProps) {
  const imagePath = '/images/' + props.user.avatar + '.png';

  return (
    <div className="avatar">
      <img className="userAvatar" src={ imagePath } loading="lazy"></img>
      <button type="button" title="Change Avatar" onClick={ () => props.changeAvatar(true) }>Change Avatar</button>
    </div>
  );
}

export default Avatar;
