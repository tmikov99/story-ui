import { useState } from 'react';
import './App.css'

import Navigation from './navigation/Navigation';
import TextEditor from './textEditor/TextEditor';


function App() {

  return (
    <>
      <Navigation></Navigation>
      <TextEditor></TextEditor>
    </>
  )
}

export default App;
