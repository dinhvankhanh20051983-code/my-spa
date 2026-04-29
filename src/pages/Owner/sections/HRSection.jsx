import React, { useState } from 'react';

/**
 * HRSection Component
 * 
 * Quản lý nhân sự, lương, chấm công, đánh giá
 */
export const HRSection = ({ staffs = [], styles = {} }) => {
  const [hrTab, setHrTab] = useState('staff');
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Nguyễn Thị A', phone: '0912345678', position: 'Therapist', status: 'active', salary: 8000000, joinDate: '2023-01-15', rating: 4.8 },
    { id: 2, name: 'Trần Văn B', phone: '0987654321', position: 'Therapist', status: 'active', salary: 8500000, joinDate: '2022-06-20', rating: 4.9 },
    { id: 3, name: 'Hoàng Thị C', phone: '0901234567', position: 'Receptionist', status: 'active', salary: 6000000, joinDate: '2023-03-10', rating: 4.5 },
    { id: 4, name: 'Lê Văn D', phone: '0923456789', position: 'Manager', status: 'leave', salary: 12000000, joinDate: '2021-01-01', rating: 4.7 },
  ]);
  const [payroll, setPayroll] = useState([
    { month: 'Tháng 1/2024', status: 'paid', amount: 34500000, paidDate: '2024-02-05' },
    { month: 'Tháng 2/2024', status: 'paid', amount: 34500000, paidDate: '2024-03-05' },
    { month: 'Tháng 3/2024', status: 'pending', amount: 34500000, paidDate: null },
  ]);
  const [salarySettings, setSalarySettings] = useState({
    baseSalary: 6000000,
    allowance: 500000,
    bonus: 1000000,
    insurance: 0.08,
    tax: 0.05,
  });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    position: '',
    salary: '',
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.phone && newStaff.position && newStaff.salary) {
      setStaffList([...staffList, {
        id: staffList.length + 1,
        ...newStaff,
        salary: parseFloat(newStaff.salary),
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        rating: 5
      }]);
      setNewStaff({ name: '', phone: '', position: '', salary: '' });
      setShowStaffForm(false);
    }
  };

  const handleDeleteStaff = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  // Calculate attendance for demo
  const getAttendance = (staff) => {
    const workDays = 22;
    const present = Math.floor(Math.random() * 20) + 18;
    return { present, workDays, percentage: ((present / workDays) * 100).toFixed(1) };
  };

  const calculateNetSalary = (gross) => {
    const insurance = gross * salarySettings.insurance;
    const tax = (gross - insurance) * salarySettings.tax;
    return gross - insurance - tax;
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderStaffManagement = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>👥 Quản Lý Nhân Viên</h3>
        <button
          onClick={() => setShowStaffForm(!showStaffForm)}
          style={{
            padding: '10px 20px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Thêm Nhân Viên
        </button>
      </div>

      {showStaffForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ecf0f1'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Họ và tên"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
            <select
              value={newStaff.position}
              onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            >
              <option value="">Chọn vị trí</option>
              <option value="Therapist">Therapist</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Manager">Manager</option>
              <option value="Assistant">Assistant</option>
            </select>
            <input
              type="number"
              placeholder="Lương cơ bản"
              value={newStaff.salary}
              onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddStaff}
              style={{
                padding: '10px 20px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Lưu
            </button>
            <button
              onClick={() => setShowStaffForm(false)}
              style={{
                padding: '10px 20px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Vị Trí</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Lương (₫)</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Rating</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>
                <strong>{staff.name}</strong><br/>
                <span style={{ fontSize: '11px', color: '#666' }}>{staff.phone}</span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {staff.position}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                ₫{staff.salary.toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#fff9e6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: '#f39c12',
                  fontSize: '11px'
                }}>
                  ⭐ {staff.rating}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: staff.status === 'active' ? '#d4edda' : '#fff3cd',
                  color: staff.status === 'active' ? '#155724' : '#856404',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {staff.status === 'active' ? '✓ Hoạt Động' : '⏱ Nghỉ'}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  style={{
                    padding: '5px 10px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAttendance = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>✅ Chấm Công</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Điểm Danh</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Tổng Ngày Làm</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Tỷ Lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, idx) => {
            const attendance = getAttendance(staff);
            return (
              <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{staff.name}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}>
                    ✓ {attendance.present}
                  </span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {attendance.workDays}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <div style={{
                    background: '#ecf0f1',
                    height: '20px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}>
                    <div style={{
                      background: '#27ae60',
                      height: '100%',
                      width: `${attendance.percentage}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {attendance.percentage > 50 ? attendance.percentage + '%' : ''}
                    </div>
                    {attendance.percentage <= 50 && <span style={{ marginLeft: '5px' }}>{attendance.percentage}%</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPayroll = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>💰 Quản Lý Lương</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
        marginBottom: '20px'
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tháng</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Tổng Lương (₫)</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ngày Thanh Toán</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map((p, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.month}</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                ₫{p.amount.toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: p.status === 'paid' ? '#d4edda' : '#fff3cd',
                  color: p.status === 'paid' ? '#155724' : '#856404',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {p.status === 'paid' ? '✓ Đã Thanh Toán' : '⏱ Sắp TT'}
                </span>
              </td>
              <td style={{ padding: '10px', fontSize: '12px' }}>
                {p.paidDate || '---'}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => alert('Chi tiết sẽ sớm cập nhật')}
                  style={{
                    padding: '5px 10px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Chi Tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginBottom: '15px' }}>Chi Tiết Lương (Mẫu)</h4>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Mục</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Giá Trị</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Lương Cơ Bản</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{salarySettings.baseSalary.toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Phụ Cấp</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{salarySettings.allowance.toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Thưởng</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{salarySettings.bonus.toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ borderBottom: '2px solid #2c3e50', background: '#f0fff4' }}>
            <td style={{ padding: '10px', fontWeight: 'bold' }}>Tổng Lương Brutto</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
              ₫{(salarySettings.baseSalary + salarySettings.allowance + salarySettings.bonus).toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Bảo Hiểm ({(salarySettings.insurance * 100).toFixed(0)}%)</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>
              ₫{((salarySettings.baseSalary + salarySettings.allowance + salarySettings.bonus) * salarySettings.insurance).toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Thuế ({(salarySettings.tax * 100).toFixed(0)}%)</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>
              ₫{(((salarySettings.baseSalary + salarySettings.allowance + salarySettings.bonus) - ((salarySettings.baseSalary + salarySettings.allowance + salarySettings.bonus) * salarySettings.insurance)) * salarySettings.tax).toLocaleString('vi-VN')}
            </td>
          </tr>
          <tr style={{ background: '#fff5f0' }}>
            <td style={{ padding: '10px', fontWeight: 'bold' }}>Lương Ròng</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60', fontSize: '16px' }}>
              ₫{calculateNetSalary(salarySettings.baseSalary + salarySettings.allowance + salarySettings.bonus).toLocaleString('vi-VN')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderPerformance = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>⭐ Đánh Giá Hiệu Suất</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Rating Khách</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Số Lịch</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Lương Thực</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Đánh Giá</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{staff.name}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#fff9e6',
                  color: '#f39c12',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  ⭐ {staff.rating}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {Math.floor(Math.random() * 30) + 10}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                ₫{calculateNetSalary(staff.salary).toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => alert('Đánh giá chi tiết sẽ sớm cập nhật')}
                  style={{
                    padding: '5px 10px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Chi Tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #ecf0f1',
        paddingBottom: '15px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'staff', label: '👥 Nhân Viên' },
          { id: 'attendance', label: '✅ Chấm Công' },
          { id: 'payroll', label: '💰 Lương' },
          { id: 'performance', label: '⭐ Đánh Giá' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setHrTab(tab.id)}
            style={{
              padding: '10px 15px',
              background: hrTab === tab.id ? '#3498db' : 'transparent',
              color: hrTab === tab.id ? 'white' : '#666',
              border: hrTab === tab.id ? 'none' : '1px solid #ecf0f1',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {hrTab === 'staff' && renderStaffManagement()}
      {hrTab === 'attendance' && renderAttendance()}
      {hrTab === 'payroll' && renderPayroll()}
      {hrTab === 'performance' && renderPerformance()}
    </div>
  );
};

export default HRSection;
