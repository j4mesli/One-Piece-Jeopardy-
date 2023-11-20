import { User } from "../../types/User";
import avatars from "../../assets/avatars.json";
import "./ChangeAvatar.css"
import { useState, useEffect } from "react";

interface ChangeAvatarProps {
  changeAvatar: (flag: boolean) => void;
  setUser: (user: User) => void;
  user: User;
}

function ChangeAvatar(props: ChangeAvatarProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // monitor window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // function to chunk the avatars array into groups of 6
  const chunkAvatars = (array: string[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    // Check if the last chunk has less than 4 items
    if (chunkedArr[chunkedArr.length - 1].length < size) {
      // Calculate how many filler elements are needed
      const fillerCount = size - chunkedArr[chunkedArr.length - 1].length;
      // Add filler elements
      chunkedArr[chunkedArr.length - 1].push(...Array(fillerCount).fill('filler'));
    }
    return chunkedArr;
  };
  
  const handleSubmit = async (avatar: string) => {
    if (avatar !== 'filler') {
      const endpoint = 'https://one-piece-jeopardy-backend-d2ca7583addf.herokuapp.com//updateUser';
      const session = JSON.parse(sessionStorage.getItem('session')!);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('newAvatar', avatar);
      headers.append('sessionId', session.sessionId);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
      });
      const data = await res.json();
      if (data.status !== 200) {
        alert(data.message);
      }
      else {
        props.setUser(data.user);
        const session: User = JSON.parse(sessionStorage.getItem('session')!);
        session.avatar = data.user.avatar;
        sessionStorage.setItem('session', JSON.stringify(session));
        props.changeAvatar(false);
      }
    }
  };

  // chunk the avatars into groups of 6 for desktop
  const avatarRows6 = chunkAvatars(avatars.sort(), 6);
  // chunk the avatars into groups of 3 for mobile
  const avatarRows3 = chunkAvatars(avatars.sort(), 3);

  return (
    <div className="changeAvatar">
      <div className="change container">
        { windowSize.width > 1000 ? avatarRows6.map((row, rowIndex) => (
          <div key={ rowIndex } className="row">
            { row.map((avatar, avatarIndex) => (
              <div className="one column" key={ avatarIndex } >
                <img 
                  className={"selectImage" + (avatar === props.user.avatar ? " disabled" : "")}
                  src={ avatar === 'filler' ? "" : `/images/${avatar}.png` }
                  alt={ avatar }
                  title={ avatar } 
                  onClick={ () => avatar === props.user.avatar ? "" : handleSubmit(avatar) }
                  loading="lazy"
                />
              </div>
            )) }
          </div>
        )) : 
        avatarRows3.map((row, rowIndex) => (
          <div key={ rowIndex } className="row">
            { row.map((avatar, avatarIndex) => (
              <div className="one column" key={ avatarIndex } >
                <img 
                  className={"selectImage" + (avatar === props.user.avatar ? " disabled" : "")}
                  src={ avatar === 'filler' ? "" : `/images/${avatar}.png` }
                  style={{ opacity: avatar === 'filler' ? 0 : 1, cursor: avatar === 'filler' ? "default" : "pointer" }} 
                  alt={ avatar }
                  title={ avatar } 
                  onClick={ () => avatar === props.user.avatar ? "" : handleSubmit(avatar) }
                  loading="lazy"
                />
              </div>
            )) }
          </div>
        ))}
        <span className="close material-symbols-outlined" onClick={() => props.changeAvatar(false)}>close</span>
      </div>
    </div>
  );
}

export default ChangeAvatar;
