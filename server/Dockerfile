# 1. 베이스 이미지 선택
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json, package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치 (nodemon을 전역이 아닌 로컬에 설치)
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 서버 포트 노출
EXPOSE 3001

# 7. 서버 실행 (nodemon 사용)
CMD ["npm", "run", "dev"]
