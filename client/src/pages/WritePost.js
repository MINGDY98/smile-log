import React from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import axios from 'axios';
import {
	Container,
	Typography,
	InputBase
} from '@mui/material';
import { 
	PrimaryButton 
} from '../styles/common';

const TitleInput = styled(InputBase)`
  font-size       : 36px;
  margin          : 10px 0px 10px 0px;
  color           : #676A59;
  font-weight     : 600;
`

const PostInput = styled(InputBase)`
  font-size       : 16px;
  margin          : 10px 0px 10px 0px;
  color           : #676A59;
  font-weight     : 500;
`

const Line = styled.hr`
  margin          : 16px 0px;
  height          : 3px;
  background-color: #46508c;
  width           : 10%
`

const SubmitButton = styled(PrimaryButton)`
  &:hover {
    background: #46508c;
  }
`

const WritePost= () => {

  const { id } = useParams();//수정하기를 통해 들어왔을 경우.
  const [values, setValues] = React.useState({ 
    "title"      : "", 
    "content"    : "", 
  });

  const callPostApi = async()=>{
    const response = await axios.get('http://localhost:4000/post/read/'+ id);
    return response.data;
  }

  React.useEffect(()=>{
    if(id==null){
      //새로 작성할 포스트
    }else{
      //수정이 요청된 포스트
      callPostApi()
      .then(res=>{
        setValues({ 
          "title"     : res.data[0].title, 
          "content"   : res.data[0].content,
        });
      })
      .catch(err=>console.log(err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ 
      ...values, 
      [name]: value 
    });
  } 

  const handleSubmit = ( e ) => {

    if( values.title === "" ){
      alert( "제목을 입력해주세요." );
    }else if( values.content === "" ){
      alert( "내용을 입력해주세요." );
    }else{
      if(id==null){

        axios.post('http://localhost:4000/post/write',{ 
          "title"   	: values.title, 
          "content"   : values.content, 
        }) 
        .then( function (response) {
          window.location.href="/";
        }) 
        .catch( error => {
          console.log('error : ',error.response) 
        });
      }else{//수정할 경우

        axios.put('http://localhost:4000/post/update',{
          "id"				: id,
          "title"   	: values.title, 
          "content"   : values.content, 
        }) 
        .then( function (response) {
          window.location.href="/read/"+id;
        }) 
        .catch( error => {
          console.log('error : ',error.response) 
        });
      }
    }
  }

  return (
    <Container maxWidth="md">
      <TitleInput 
        fullWidth
        name="title" 
        placeholder="제목을 입력하세요"
        value={values.title}
        onChange={handleChange}
      />
      <Line/>
      <PostInput
        fullWidth
        name="content" 
        placeholder="당신의 이야기를 적어주세요."
        multiline
        rows={36}
        value={values.content}
        onChange={handleChange}
      />
      <SubmitButton onClick={handleSubmit} >
        {id==null ? <Typography>작성</Typography>:<Typography>수정</Typography>}
      </SubmitButton>
    </Container>
  )
}
export default WritePost;