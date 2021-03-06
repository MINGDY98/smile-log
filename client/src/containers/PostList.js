import React from 'react';
import axios from 'axios';
import styled from "styled-components"
import { makeStyles } from '@mui/styles';
import {
  PrimaryButton
} from '../styles/common';
import {
  Button, 
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Checkbox,
}from '@mui/material';
import Post from '../components/Post';
import Pagination from '../components/Pagination';

const Wrapper = styled.div`
  padding-bottom    : 100px;
`

const PostListWrapper = styled.div`
  margin            : 24px 0px 24px 0px;
`

const PostWrapper = styled.div`
  display           : flex;
  align-items       : center;
`

const DisabledButton = styled(PrimaryButton)`
  background-color  : #E1E1E1;
  &:hover{
    background-color: ${ props => props.disabled ? "#E1E1E1" : "#CCCCCC" };
    cursor          : ${ props => props.disabled ? ""        : "pointer" };
  }
`

const ButtonGroup = styled.div`
  display           : flex;
  justify-content   : flex-end;
  gap               : 10px;
`

const useStyles = makeStyles({

  root: {
    paddingRight:'20px',
    background: "none",
    color:"#fc6020",
    "&$checked": {
      color: "#fc6020"
    }
  },
  checked: {}
});


const PostList = () => {

  const classes = useStyles();
  const [posts, setPosts]=React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage, setPostsPerPage] = React.useState(5);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [checkedList, setCheckedLists] = React.useState([]);
  const [openAlert, setOpenAlert] = React.useState(false);

  const callApi = async()=>{
    const res = await axios.get('http://localhost:4000/post/read');
    return res.data
  }

  React.useEffect(()=>{
    callApi()
    .then(res => {
      setPosts(res.data)
    })
    .catch(err => {
      console.log(err)
    });
  },[]);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  function currentPosts(tmp) {
    let currentPosts = 0;
    currentPosts = tmp.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }

  const onCheckedElement = React.useCallback(
    (checked, id) => {
      if (checked) {
        setCheckedLists([...checkedList, id]);
      } else {
        setCheckedLists(checkedList.filter((el) => el !==id));//id??? ??????????????? ??????????????????.
      }
    },
    [checkedList]
  );

  const handleDelete = (e) => {
    e.preventDefault();
    checkedList.forEach((el)=>{
      axios.delete('http://localhost:4000/post/delete/'+el) 
      .then(function ( response ) { 
        console.log( response ); 
      }) 
      .catch(error => { 
        console.log( 'error : ',error.response ) 
      });
    })
    window.location.reload();
  }

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Wrapper>
      <ButtonGroup>
        <PrimaryButton onClick={() => setOpenDelete(!openDelete)}>
          {openDelete? <div>?????? ??????</div> : <div>?????? ??????</div>}
        </PrimaryButton>
          {openDelete&&checkedList.length>0 ? 
        <PrimaryButton onClick={handleOpenAlert}>??????</PrimaryButton>:
        <DisabledButton disabled>??????</DisabledButton>}
      </ButtonGroup>
      {posts ?  
      <PostListWrapper>
        {currentPosts(posts).map((post,index)=>(
          <PostWrapper key={index}>
            {openDelete ?
            <Checkbox
              disableRipple
              id={post.idpost}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
              onChange={(e) => onCheckedElement(e.target.checked, post.idpost)}
              checked={checkedList.includes(post.idpost) ? true : false}/>: <></>}
            <Post data = {post}/>
        </PostWrapper>
        ))} 
        <Pagination 
          postsPerPage={postsPerPage}
          totalPosts={posts.length} 
          paginate={setCurrentPage}
        />
      </PostListWrapper> :
      <div>??? ?????? ??????????????????.</div>}
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"????????? ??????"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ?????? ?????? ?????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>?????????</Button>
          <Button onClick={handleDelete} autoFocus>???</Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  )
}
export default PostList;