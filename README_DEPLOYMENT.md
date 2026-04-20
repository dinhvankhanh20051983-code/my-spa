# 🚀 Hướng Dẫn Triển Khai SPA Management System

## 📋 Tổng Quan

Để đưa ứng dụng SPA Management System vào thực tế, bạn cần chuẩn bị đầy đủ thông tin và thực hiện các bước triển khai một cách có hệ thống.

## 📋 Bước 1: Chuẩn Bị Thông Tin

Trước khi triển khai, hãy hoàn thành **checklist** trong file `DEPLOYMENT_CHECKLIST.md`:

### Thông Tin Bắt Buộc
- ✅ Domain name và hosting
- ✅ Database credentials
- ✅ SSL certificates
- ✅ API keys (SMS, Email, Payment)
- ✅ Thông tin kinh doanh spa

### Thông Tin Khuyến Nghị
- ✅ Backup strategy
- ✅ Monitoring setup
- ✅ Security measures

## 🛠️ Bước 2: Chuẩn Bị Môi Trường

### Tự Động Setup (Khuyến Nghị)
```bash
# Chạy script setup tự động
chmod +x setup-production.sh
sudo ./setup-production.sh
```

Script sẽ tự động cài đặt:
- Node.js 18.x
- Nginx web server
- MySQL database
- Redis cache
- SSL certificates
- Firewall rules
- Monitoring tools

### Thủ Công Setup
Nếu muốn setup thủ công, tham khảo script `setup-production.sh` để biết các bước chi tiết.

## ⚙️ Bước 3: Cấu Hình Environment

1. **Copy template environment:**
```bash
cp .env.production.template .env.production
```

2. **Điền thông tin thực tế:**
```bash
nano .env.production
```

3. **Các thông tin cần thay thế:**
- `[REPLACE_WITH_STRONG_SECRET_KEY_32_CHARS_MIN]` → JWT secret key
- `[REPLACE_WITH_GOOGLE_MAPS_API_KEY]` → Google Maps API key
- `[REPLACE_WITH_SMS_API_KEY]` → SMS gateway API key
- `[REPLACE_WITH_VNPAY_MERCHANT_ID]` → VNPay merchant ID
- etc.

## 🗄️ Bước 4: Chuẩn Bị Database

1. **Import schema:**
```bash
mysql -u spa_admin -p spa_management < database/schema.sql
```

2. **Chạy migrations:**
```bash
npm run migrate
```

3. **Import dữ liệu ban đầu:**
```bash
npm run seed
```

## 🚀 Bước 5: Triển Khai Ứng Dụng

### Backend API
```bash
# Build và start API
npm run build:api
npm run start:api
```

### Frontend App
```bash
# Build cho production
npm run build

# Serve static files
sudo cp -r dist/* /var/www/spa-management/frontend/
```

## 🔒 Bước 6: Bảo Mật & Monitoring

1. **Thay đổi passwords mặc định**
2. **Enable 2FA cho admin accounts**
3. **Setup firewall rules**
4. **Cấu hình monitoring và alerts**

## 🧪 Bước 7: Test & Verify

### Test Cơ Bản
- [ ] Đăng nhập admin panel
- [ ] Tạo nhân viên mới
- [ ] Thêm dịch vụ mới
- [ ] Test thanh toán
- [ ] Test SMS notifications

### Test Tính Năng
- [ ] Đặt lịch hẹn
- [ ] Quản lý khách hàng
- [ ] Báo cáo doanh thu
- [ ] Mobile responsiveness

## 📞 Bước 8: Hỗ Trợ & Bảo Trì

### Thông Tin Liên Hệ
- **Hotline:** 0933 251 983
- **Email:** support@spalotus.vn
- **Zalo OA:** [ID Zalo OA]

### Bảo Trì Định Kỳ
- **Backup:** Hàng ngày lúc 2:00 AM
- **Updates:** Cập nhật security patches
- **Monitoring:** 24/7 system monitoring

## 💰 Chi Phí Ước Tính

| Dịch Vụ | Chi Phí | Ghi Chú |
|---------|---------|---------|
| Domain | 500k-1M/năm | .vn domain |
| VPS Hosting | 1M-3M/tháng | 2GB RAM, 50GB SSD |
| SSL Certificate | 500k/năm | Wildcard certificate |
| SMS Gateway | 1.5k/tin | Per SMS |
| Payment Gateway | 1-2% | Per transaction |
| CDN | 500k/tháng | Cloudflare |
| Monitoring | 500k/tháng | Uptime + Logs |

**Tổng chi phí khởi tạo:** ~5-10M
**Chi phí hàng tháng:** ~3-5M

## 🚨 Xử Lý Sự Cố

### Database Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check logs
sudo tail -f /var/log/mysql/error.log
```

### Application Issues
```bash
# Check app logs
tail -f /var/log/spa-app/app.log

# Restart services
sudo systemctl restart spa-api
sudo systemctl restart spa-app
```

### Network Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

## 📚 Tài Liệu Tham Khảo

- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Environment Template](.env.production.template)
- [Setup Script](setup-production.sh)
- [API Documentation](docs/api.md)
- [User Manual](docs/user-manual.md)

---

## 🎯 Checklist Hoàn Thành

- [ ] Đã chuẩn bị đầy đủ thông tin trong checklist
- [ ] Đã setup server và môi trường
- [ ] Đã cấu hình environment variables
- [ ] Đã setup database và import dữ liệu
- [ ] Đã deploy ứng dụng thành công
- [ ] Đã test tất cả tính năng
- [ ] Đã setup monitoring và backup
- [ ] Đã đào tạo nhân viên sử dụng hệ thống

**Chúc mừng! 🎉 Ứng dụng SPA Management System của bạn đã sẵn sàng phục vụ khách hàng.**</content>
<parameter name="filePath">e:\các phan mem để đưa app spa vào hoạt động\my-spa-app\README_DEPLOYMENT.md