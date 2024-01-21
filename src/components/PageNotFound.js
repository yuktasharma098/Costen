import { Button, Col, Row } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
  const navigate= useNavigate()
  return (
    <Row>
      <Col lg={12}>
<div style={{display:'flex',flexDirection:'column',marginLeft:'10rem',marginTop:'30vh'}}>
  <span style={{fontSize:'30px',fontWeight:'700',marginBottom:'0.4rem'}}>OOPS...</span>
  <span style={{fontSize:'20px',fontWeight:'500'}}>Page not Found</span>
<Button style={{width:'30%',backgroundColor:'#3052D0',color:'white',marginTop:'2rem'}} onClick={()=>navigate("/dashboard")}>Go Back</Button>
</div>
      </Col>
      <Col lg={12}>
      <img
                src="404.png"
                style={{
                  marginRight: "1rem",
                  marginTop: "4rem",
                }}
              />      </Col>
    </Row>
  )
}

export default PageNotFound