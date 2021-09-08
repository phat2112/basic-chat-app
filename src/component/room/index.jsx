import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./styles.scss";

let socket;
let ENDPOINT = "https://bo-chat-app-server.herokuapp.com";
const Room = () => {
  const history = useHistory();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("rooms", (rooms) => {
      setRoomList(rooms);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);

  const [username, setUsername] = useState("");
  const [showRoom, setShowRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [errMessage, setErrMessage] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleShowRoom = () => {
    if (username) {
      setShowRoom(true);
    }
  };

  const handleJoinRoom = (room) => {
    setJoinRoom(room);
    socket.emit("join", username, room);
  };

  useEffect(() => {
    if (joinRoom) {
      socket.on("join-room", (resp) => {
        if (!resp.isJoined) {
          setShowRoom(false);
          setUsername("");
          setJoinRoom(false);
          setErrMessage(resp.message);
        } else {
          history.push("/chat", { username, roomName: joinRoom });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinRoom]);
  return (
    <div>
      {/* list room */}
      {!showRoom && (
        <div className="room-container">
          <h1 className="room-container__title">Enter your user name</h1>
          <input
            className="room-container__input"
            type="text"
            value={username}
            onChange={handleChange}
          />
          <button className="room-container__button" onClick={handleShowRoom}>
            Submit
          </button>
          <p style={{ color: "red" }}>{errMessage}</p>
        </div>
      )}
      {showRoom && roomList.length ? (
        <div className="room-list">
          {roomList.map((item, index) => (
            <div
              key={`room-${index}`}
              onClick={() => handleJoinRoom(item.name)}
              className="room-list__item"
            >
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Room;
