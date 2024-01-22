import React from 'react'

function Footer() {
  return (
    <div style={{display:'flex',flexDirection:'row'}}>
          <span
            style={{
              color: "#8A8A8A",
              bottom: "0",
              right: "0",
              position: "absolute",
              padding: "1rem",
            }}
          >
            © 2023 Costen All Rights Reserved
          </span>
        <img style={{position:'fixed',bottom:'0',right:'0',width:'5rem',zIndex:'1',marginRight:'1%',marginBottom:'2%'}} src='costen.png'/>
    </div>
  )
}

export default Footer