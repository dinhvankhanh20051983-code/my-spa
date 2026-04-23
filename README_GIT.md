# README_GIT

## Mục đích
File này hướng dẫn cách sử dụng script Git nội bộ `git-app.js` và cách cấu hình GitHub Actions cho dự án.

## Các lệnh Git nhanh

Đã thêm script `git-app.js` ở thư mục gốc để chạy các tác vụ Git cơ bản:

- `node git-app.js status`
- `node git-app.js init <remote-url> [branch]`
- `node git-app.js add`
- `node git-app.js commit "message"`
- `node git-app.js push [branch] [remote]`
- `node git-app.js publish "message"`

### Sử dụng qua npm scripts

- `npm run git:status`
- `npm run git:add`
- `npm run git:commit -- "message"`
- `npm run git:push`
- `npm run git:publish -- "message"`

## Ví dụ dùng nhanh

1. Xem trạng thái thay đổi:

```bash
npm run git:status
```

2. Thêm tất cả thay đổi vào stage:

```bash
npm run git:add
```

3. Commit với thông điệp:

```bash
npm run git:commit -- "Cập nhật tính năng login"
```

4. Thực thi kiểm tra (lint + build + test):

```bash
npm run ci
```

5. Nếu đã cấu hình secret Supabase, chạy kiểm tra Supabase:

```bash
npm run ci:supabase
```

6. Khi dùng pull request, workflow preview sẽ chạy riêng test Supabase và deploy preview nếu có secret Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

7. Đẩy nhánh `main` lên remote `origin`:

```bash
npm run git:push
```

6. Commit và push nhanh một phát:

```bash
npm run git:publish -- "Cập nhật README và fixes"
```

## Lưu ý

- Script `git-app.js` cần Node.js và Git đã được cài đặt.
- Nếu repo chưa có remote, dùng `node git-app.js init <remote-url>` để khởi tạo.
- Nếu muốn dùng branch khác, truyền tên branch như tham số thứ hai của `git push`.
