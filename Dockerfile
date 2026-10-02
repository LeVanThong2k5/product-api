
# Sử dụng Node.js 22 trên nền Debian Slim
FROM node:22-bookworm-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file quản lý thư viện trước
COPY package*.json ./

# Cài đặt các thư viện cần thiết
RUN npm ci --omit=dev

# Sao chép mã nguồn ứng dụng vào container
COPY . .

# Thiết lập môi trường chạy
ENV NODE_ENV=production
ENV PORT=3000

# Mở cổng ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]