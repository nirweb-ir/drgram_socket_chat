# پایه Node.js
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های مورد نیاز
COPY package*.json ./
COPY server.js ./

# نصب وابستگی‌ها
RUN npm install

# اجرای برنامه
CMD ["node", "server.js"]

# باز کردن پورت
EXPOSE 3000