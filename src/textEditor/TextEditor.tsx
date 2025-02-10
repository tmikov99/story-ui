import { useState, ChangeEvent } from 'react';
import './TextEditor.css';
import { Container, Typography } from '@mui/material';

function TextEditor() {
  const [page, setPage] = useState(0);
  const [text, setText] = useState("");
  
  let changeText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.currentTarget.value);
    setText(event.currentTarget.value);
  }

  return (
    <Container className="deitTextContainer">
      <textarea className='editText' onChange={changeText}></textarea>
      <Typography className='pageNumber'>page {page}</Typography>
    </Container>
  )
}

export default TextEditor;
