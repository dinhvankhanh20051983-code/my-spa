import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TreatmentRecord = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [tip, setTip] = useState('');
  const [note, setNote] = useState('');

  const handleFinish = () => {
    if(!image || !note) return alert("Vui lòng chụp ảnh kết quả và ghi chú liệu trình!");
    
    // Gửi dữ liệu về Server (API giả định)
    const dataPost = {
      appointmentId: state.app.id,
      image,
      note,
      tipAmount: tip,
      timestamp: new Date().toISOString()
    };
    
    console.log("Saving Treatment Record:", dataPost);
    alert("Hoàn tất! Ca làm và tiền Tip đã được lưu vào lịch sử lương của bạn.");
    navigate('/employee');
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px' }}>←</button>
        <h2 style={{ margin: '0 auto', color: '#10b981', fontSize: '18px' }}>Ghi Nhật Ký Trị Liệu</h2>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '25px' }}>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontWeight: 'bold', margin: 0, fontSize: '18px' }}>{state?.app?.customer}</p>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{state?.app?.service}</p>
        </div>

        <div style={photoContainer}>
          {image ? <img src={image} style={imgPreview} /> : <span style={{color: '#475569'}}>📸 Ảnh trước/sau ca làm</span>}
        </div>
        
        <input type="file" accept="image/*" capture="environment" id="camera" style={{display: 'none'}} onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
        <label htmlFor="camera" style={btnCamera}>CHỤP ẢNH KẾT QUẢ</label>

        <label style={labelS}>Diễn biến liệu trình hôm nay:</label>
        <textarea 
          placeholder="Ví dụ: Da bớt mụn ẩn, khách hài lòng..." 
          style={textareaS} 
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <label style={{ ...labelS, color: '#fbbf24' }}>Tiền Tip nhận được (VNĐ):</label>
        <input 
          type="number" 
          placeholder="Nhập 0 nếu không có..." 
          style={inputS}
          value={tip}
          onChange={(e) => setTip(e.target.value)}
        />

        <button onClick={handleFinish} style={btnSubmit}>XÁC NHẬN & CHỐT LƯƠNG</button>
      </div>
    </div>
  );
};

const photoContainer = { width: '100%', height: '180px', border: '2px dashed #334155', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
const imgPreview = { width: '100%', height: '100%', objectFit: 'cover' };
const btnCamera = { display: 'block', textAlign: 'center', padding: '12px', backgroundColor: '#334155', borderRadius: '12px', marginTop: '10px', cursor: 'pointer', fontSize: '14px' };
const labelS = { display: 'block', marginTop: '20px', marginBottom: '8px', fontSize: '13px', color: '#94a3b8' };
const textareaS = { width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', minHeight: '60px', boxSizing: 'border-box' };
const inputS = { width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', boxSizing: 'border-box' };
const btnSubmit = { width: '100%', marginTop: '30px', padding: '16px', borderRadius: '15px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '16px' };

export default TreatmentRecord;
