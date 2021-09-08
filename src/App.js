import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBox from "component/chat-box";
import Room from "component/room";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Room} />
          <Route path="/chat" component={ChatBox} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
