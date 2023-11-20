import { useEffect, useState } from "react";
import Avatar from "../../components/Profile/Avatar";
import "./Profile.css";
import { User } from "../../types/User";
import { formatDate } from "../../functions/formatDate";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import ChangeAvatar from "../../components/Profile/ChangeAvatar";
import ChangeUsername from "../../components/Profile/ChangeUsername";

function Profile() {
  const [user, setUser] = useState<User>();
  const [rank, setRank] = useState<number>();
  const [changingAvatar, setChangingAvatar] = useState(false);
  const [changingUsername, setChangingUsername] = useState(false);

  // useEffect for getting profile information
  useEffect(() => {
    fetchProfile();
    fetchUserRank();
  }, []);

  // get raw profile information
  const fetchProfile = async () => {
    const endpoint = 'http://localhost:3000/fetchUser';
    const session = JSON.parse(sessionStorage.getItem('session')!);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('username', session.username);
    headers.append('sessionId', session.sessionId);
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
    const data = await res.json();
    setUser(data.user);
  };

  // get user rank
  const fetchUserRank = async () => {
    const endpoint = 'http://localhost:3000/fetchUserRank';
    const session = JSON.parse(sessionStorage.getItem('session')!);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('username', session.username);
    headers.append('sessionId', session.sessionId);
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
    const data = await res.json();
    setRank(data.rank);
  };

  // change username
  const handleChangeUsername = async (flag: boolean) => {
    setChangingUsername(flag);
  };

  // change avatar
  const handleChangeAvatar = async (flag: boolean) => {
    setChangingAvatar(flag);
  };

  return (
    <>
      {(!user || !rank) && <LoadingCircle />}
      {(user && rank) && <div className="profile">
        <h3>Welcome, <u>{ user.username.charAt(0).toUpperCase() + user.username.slice(1) }</u>!&nbsp;<span className="material-symbols-outlined edit" onClick={ () => handleChangeUsername(true) } title="Change Username">edit_square</span></h3>
        <Avatar user={user} changeAvatar={ handleChangeAvatar } />
        <div className="profile-info">
          <div className="profile-info-item">
            <h5>User Rank:&nbsp;</h5>
            <b><p>#{rank}</p></b>
          </div>
          <div className="profile-info-item">
            <h5>Total Points:&nbsp;</h5>
            <b><p>{user.points ? user.points : 0}</p></b>
          </div>
          <div className="profile-info-item">
            <h5>Last Played Game:&nbsp;</h5>
            <b><p>{user.lastPlayed ? formatDate(new Date(user.lastPlayed).toString()) : "N/A"}</p></b>
          </div>
        </div>
      </div>}
      {changingAvatar && <ChangeAvatar changeAvatar={ handleChangeAvatar } setUser={setUser} user={user!} />}
      {changingUsername && <ChangeUsername changeUsername={ handleChangeUsername } setUser={setUser} />}
    </>
  );
}

export default Profile;
