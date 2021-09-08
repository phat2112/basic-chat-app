import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import "./styles.scss";

let socket;
let ENDPOINT = "localhost:8000";
const ChatBox = () => {
  const location = useLocation();

  const [value, setValue] = useState("");
  const [messageList, setMessageList] = useState([]);
  const endMessageRef = useRef(null);
  const currentMessNm = useRef("");

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("messagesList", (messageList) => {
      const newMessageList = messageList.filter(
        (message) => message.roomName === location.state.roomName
      );
      setMessageList(newMessageList);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessageList([...messageList, message]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    scrollBottom();
  }, [messageList]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSendMessage = () => {
    socket.emit(
      "sendMessage",
      location.state.username,
      location.state.roomName,
      value,
      () => setValue("")
    );
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      handleSendMessage();
    }
  };

  const scrollBottom = () =>
    endMessageRef.current.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="chat-box">
      <div className="chat-container">
        {messageList.length ? (
          messageList.map((item, index) => {
            if (currentMessNm.current === item.name) {
              return (
                <div
                  key={`chat-${index}`}
                  className="text-block"
                  style={{
                    alignItems:
                      location.state.username === item.name
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <span className="text-message text-content">{item.text}</span>
                </div>
              );
            }
            currentMessNm.current = item.name;
            return (
              <div
                key={`chat-${index}`}
                className="text-block"
                style={{
                  alignItems:
                    location.state.username === item.name
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <span className="text-message text-username">{item.name}</span>
                <span className="text-message text-content">{item.text}</span>
              </div>
            );
          })
        ) : (
          <></>
        )}
        <div ref={endMessageRef} />
      </div>
      <div className="chat-block">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>
          <RiSendPlaneFill size={24} color="#11998e" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
