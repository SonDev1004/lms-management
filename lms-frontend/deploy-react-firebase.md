# Hướng dẫn deploy project ReactJS lên Firebase Hosting

## 1. Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

Kết quả:
```bash
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead

added 716 packages in 24s

82 packages are looking for funding
run `npm fund` for details
```

## 2. Đăng nhập Firebase

```bash
firebase login
```

Kết quả:
```bash
i  The Firebase CLI’s MCP server feature can optionally make use of Gemini in Firebase. Learn more about Gemini in Firebase and how it uses your data: https://firebase.google.com/docs/gemini-in-firebase#how-gemini-in-firebase-uses-your-data
✔ Enable Gemini in Firebase features? Yes

i  Firebase optionally collects CLI and Emulator Suite usage and error reporting information to help improve our products. Data is collected in accordance with Google's privacy policy (https://policies.google.com/privacy) and is not used to identify you.
✔ Allow Firebase to collect CLI and Emulator Suite usage and error reporting information? Yes

i  To change your preferences at any time, run `firebase logout` and `firebase login` again.

Visit this URL on this device to log in:
https://accounts.google.com/o/oauth2/auth?... (rút gọn)

Waiting for authentication...

✔  Success! Logged in as <your-email>
```

## 3. Khởi tạo Firebase Hosting trong project

Chuyển vào thư mục project ReactJS:
```bash
cd lms-frontend/
```

Khởi tạo Firebase:
```bash
firebase init
```

- Chọn **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**
- Chọn project Firebase đã tạo trên console
- Thiết lập thư mục public là `dist` (nếu dùng Vite) hoặc `build` (nếu dùng Create React App)
- Chọn **No** cho overwrite file `index.html` nếu được hỏi

## 4. Build project ReactJS

Nếu dùng Vite:
```bash
npm run build
```
Kết quả:
```bash
vite v7.1.2 building for production...
✓ 248 modules transformed.
dist/index.html                                    0.53 kB │ gzip:   0.35 kB
dist/assets/primeicons-C6QP2o4f.woff2             35.15 kB
dist/assets/logo-7M1JBfZ_.png                     62.05 kB
dist/assets/primeicons-MpK4pl85.ttf               84.98 kB
dist/assets/primeicons-WjwUDZjB.woff              85.06 kB
dist/assets/primeicons-DMOk5skT.eot               85.16 kB
dist/assets/bg-login-BPBbCTjJ.png                104.83 kB
dist/assets/primeicons-Dr5RGzOO.svg              342.53 kB │ gzip: 105.26 kB
dist/assets/InterVariable-CWi-zmRD.woff2         345.59 kB
dist/assets/InterVariable-Italic-d6KXgdvN.woff2  380.90 kB
dist/assets/index-BUF4YjrK.css                   729.94 kB │ gzip:  76.69 kB
dist/assets/index-7ZMN2QEg.js                    992.53 kB │ gzip: 277.51 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
  ✓ built in 2.70s
```

## 5. Deploy lên Firebase Hosting

```bash
firebase deploy
```

Sau khi hoàn tất, Firebase sẽ cung cấp link hosting cho bạn.

---

**Lưu ý:**
- Nếu gặp lỗi 404 khi reload trang, hãy cấu hình rewrite trong `firebase.json`:
```json
"rewrites": [
  { "source": "**", "destination": "/index.html" }
]
```
- Đảm bảo file `firebase.json` có trường `"public": "dist"` hoặc `"public": "build"` đúng với thư mục build của bạn.

---

Chúc bạn deploy thành công!
