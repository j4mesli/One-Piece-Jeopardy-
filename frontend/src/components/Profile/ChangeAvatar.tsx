import { User } from "../../types/User";
import "./ChangeAvatar.css"

interface ChangeAvatarProps {
  changeAvatar: (flag: boolean) => void;
  setUser: (user: User) => void;
}

function ChangeAvatar(props: ChangeAvatarProps) {
  return (
    <div className="changeAvatar">
      <h2>Change Avatar</h2>
      <button type="button" title="Change Avatar" onClick={ () => props.changeAvatar(false) }>Cancel</button>
    </div>
  );
}

export default ChangeAvatar;