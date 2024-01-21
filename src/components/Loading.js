import "./loading.css";
const Loading = () => {
  return (
    <div   style={{display:'flex',alignContent:'center',alignItems:'center',height:'100vh',backgroundColor:"black",flexDirection:'column'}}>
<div id="loader-container" style={{display:'flex',flexDirection:'column',marginTop:'35vh'}}>
<img className="logo" src="costen.png" alt="logo"  style={{alignSelf:'center',width:'10rem'}} />
<span style={{color:'white',marginTop:'2rem'}}>Please wait while we make things ready for you......</span>

</div>
</div>
   

  );
};
export default Loading;
 