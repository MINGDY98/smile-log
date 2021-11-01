
import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import styled from "styled-components";
import Main from './pages/Main';
import NavigationBar from './containers/NavigationBar';
import Container from '@material-ui/core/Container';
import WritePost from './pages/WritePost';
import ReadPost from './pages/Readpost';

export const Padding = styled.div`
	padding-top : 30px;
`

function App() {
  return (
    <div >
      <Container maxWidth="sm">
        <NavigationBar/>
      </Container>
      <Padding/>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route exact path="/write/:id" component={WritePost}/>
          <Route exact path="/write" component={WritePost}/>
          <Route exact path="/read/:id" component={ReadPost}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
