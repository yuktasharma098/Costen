function PersonImage() {
  const nameParts = sessionStorage.getItem('username')&&sessionStorage.getItem('username').split(' ');
    // Generate a random background color
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
  
    // Style object for the div containing the initials
    const divStyle = {
      backgroundColor: 'orange',
      width: '38px',
      height: '38px', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '38px',
      fontSize:'15px',
      gap:'5px',
      color:'white'
    };
  
    return (
      <div style={divStyle}>
        <p>{nameParts&&nameParts[0].charAt(0)}</p>
        <p>{nameParts&&nameParts.slice(1).join(' ').charAt(0)}</p>
      </div>
    );
  }
  
 
  
  export default PersonImage;
  