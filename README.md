<div align="center">
  <a href="https://new-videoplayer-nodejs.herokuapp.com">
    <img height="120" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTScTwdu7F7ygbHadyw_u09g4cHPx2SSxiKeQ&usqp=CAU" />
    <br /><br />
    <a display="block" href="https://carrot-market-geon1999.vercel.app/">유튜브 클론</a>
  </a>
</div>

</br></br>

## Preview 

<br />

 #### 1. 홈
- 유저가 업로드 한 영상을 카드 형식으로 펼쳐지게 연출함
  - 영상을 `grid` 로 나열시 많은 영상들을 home 화면에 노출시킬 수 있지만, 인입되는 유저가 적고 영상의 개수가 적기에 이와 같이 연출함
- 노출된 영상들을 `hover` 시 카드가 올라감
- `hover` 된 카드들은 간단한 정보를 추가로 노출함
- 상단에 `nav` 에는 `search, login, join, home` 버튼을 추가함
 <div align="center">
  <img height="800" src="./preview/1.gif" />
 </div>

<br />

<hr />

<br />

 #### 2. 소셜 로그인
 1. 서버에서 소셜 서버에 `인가코드` 를 요청 (get method)
 2. 소셜 서버에서 유저에게 로그인을 요청 
 3. 유저 로그인시 인가코드를 통해 `토큰` 을 발급하고 post 로 유저 정보를 서버에 생성함
 4. 서버에 유저 정보를 생성하면 유저의 카카오톡 프로필 사진등이 있을 경우 자동 프로필 사진으로 설정(유저 정보는 별도 수정 가능)
 <div align="center">
  <img height="800" src="./preview/2.gif" />
 </div>
 
 <br />
<hr />
 <br />
 
#### 3. 비디오 재생 & 실시간 댓글
- 비디오 재생, 일시정지, 볼륨, 전체화면 등의 단축기를 설정함
- 실시간 댓글은 댓글 업로드 시 해당 코멘트를 css 에서 우선 반영하고 서버에서 반응하도록 코딩함으로서 실시간 댓글'처럼' 보이게 
    
</br>

 
  <div align="center">
  <img height="800" src="./preview/3.gif" />
 </div>
 
 <br />
<hr />
<br />

#### 4. 비디오 검색
- 비디오 제목에 검색어가 포함되어 있으면 노출되도록 구현
  
 <div align="center">
  <img height="800" src="./preview/4.gif" />
 </div>
 
 <br />
<hr />
<br />

 #### 5. 비디오 업로드
- pc 웹 캠이 있을 경우 권한 허용 여부를 묻고, 허용시 캠을 통해 녹화하고 자동으로 썸네일을 지정해서 업로드 할 수 있도록 구현
- 웹캠이 아닌 내부 저장소에 있는 동영상 및 썸네일을 직접 등록하여 업로드 또한 할 수 

 <div align="center">
  <img height="800" src="./preview/5.gif" />
 </div>

<hr />

</br>


## Built with

> Front-end
- Scss
-  <img height="35"  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8UQX-1Y_81WiPAtsQMqhbxdvjic48gWCzqg&usqp=CAU" />Pug

<br />

> Back-end
- MongoDB
- Javascript

<br />

> Deploy
- Heroku
- Github
   
