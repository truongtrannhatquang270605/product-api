# 1. Image nền nhẹ, có Node 20
FROM node:20-alpine

# 2. Thư mục làm việc trong container
WORKDIR /app

# 3. Copy file khai báo thư viện trước để tận dụng cache của Docker
COPY package*.json ./

# 4. Cài thư viện cho production (bỏ nodemon)
RUN npm ci --omit=dev

# 5. Copy phần code còn lại
COPY . .

# 6. Khai báo cổng API
EXPOSE 3000

# 7. Chạy bằng user thường (an toàn hơn root)
USER node

# 8. Lệnh khởi động
CMD ["node", "server.js"]