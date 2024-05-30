import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [colors, setColors] = useState([]);
  const [jsonResponse, setJsonResponse] = useState('');


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (image) {
      console.log('Image file:', image);
      const formData = new FormData();
      formData.append('file', image);

      try {
        const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setColors(response.data.dominant_colors);
        setJsonResponse(JSON.stringify(response.data.dominant_colors, null, 2));
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
      // Here you can handle the image upload to the server
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {preview && (
        <div>
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <h3>Dominant Colors:</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                  width: '100px',
                  height: '100px',
                  margin: '10px',
                  border: '1px solid #000',
                }}
              >
                <p style={{ color: '#fff' }}>rgb({color.r}, {color.g}, {color.b})</p>
              </div>
            ))}            
          </div>
        </div>
      )}
       {jsonResponse && (
        <div>
          <h3>JSON Response:</h3>
          <pre>{jsonResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
