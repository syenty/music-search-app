# Music Search App

Spotify REST API를 프록시 서버를 통해 사용해 아티스트와 트랙을 검색하고, 추천 리스트와 아티스트 상세 정보를 제공하는 웹 애플리케이션입니다. 홈 진입 시 추천 아티스트·트랙을 바로 확인할 수 있고, 특정 아티스트를 선택하면 대표 앨범과 인기 트랙을 함께 볼 수 있습니다.

## 주요 기능
- 아티스트/트랙 통합 검색 및 결과 리스트 제공
- 홈 화면에서 사전 정의한 추천 아티스트와 트랙 노출
- 아티스트 상세 페이지에서 앨범, 인기 트랙 동시 조회
- Spotify API 호출을 위한 Express 기반 백엔드 프록시

## 기술 스택
- Client: React 19, Vite, Axios
- Server: Node.js, Express 5, Axios
- 기타: Docker, docker-compose, Yarn

## 프로젝트 구조
```
music-search-app
├── client/              # 프론트엔드 (Vite + React)
│   ├── src/
│   │   ├── api/         # 백엔드 프록시 호출 래퍼
│   │   ├── components/  # SearchBar, ArtistList 등 UI 컴포넌트
│   │   └── App.jsx      # 메인 화면 및 상태 관리
│   └── Dockerfile
├── server/              # 백엔드 (Express)
│   ├── routes/spotify.js# Spotify 관련 REST 라우트
│   ├── proxy.js         # 토큰 캐시를 포함한 Spotify API 프록시
│   └── Dockerfile
└── docker-compose.yml
```

## 사전 준비 사항
- Node.js 20 이상
- Yarn
- Spotify Developer Dashboard에서 발급한 Client ID 및 Client Secret

## 환경 변수 설정
### server/.env
`server/.env` 파일을 생성하고 아래 값을 채워 주세요.

```env
PORT=3001
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
# 기본 추천 리스트용 Spotify ID (선택 사항, 쉼표 구분)
ARTIST_IDS=artist_id_1,artist_id_2,artist_id_3
TRACK_IDS=track_id_1,track_id_2,track_id_3
```

### client 환경 변수
프론트엔드는 `VITE_API_URL`을 통해 백엔드 주소를 참조합니다. 필요한 경우 `client/.env` 파일을 만들어 아래처럼 지정할 수 있습니다.

```env
VITE_API_URL=http://localhost:3001/api
```

## 로컬 개발 환경 실행
1. 의존성 설치
   ```bash
   # 프론트엔드
   cd client
   yarn install

   # 백엔드
   cd ../server
   yarn install
   ```
2. 백엔드 실행
   ```bash
   cd server
   yarn dev
   ```
3. 프론트엔드 실행
   ```bash
   cd client
   yarn dev
   ```
4. 브라우저에서 `http://localhost:5173` 접속 후 사용합니다.

## Docker로 실행
Docker 환경이 준비되어 있다면 루트 디렉터리에서 아래 명령만으로 두 서비스를 동시에 실행할 수 있습니다.

```bash
docker-compose up --build
```

- 클라이언트: http://localhost:5173
- 서버 API: http://localhost:3001/api

## API 프록시 엔드포인트
백엔드는 클라이언트 요청을 Spotify API로 전달합니다.

| Method | Endpoint                     | 설명                              |
| ------ | --------------------------- | --------------------------------- |
| GET    | `/api/search`               | 아티스트/트랙 검색 (`q`, `type`) |
| GET    | `/api/artists`              | 여러 아티스트 조회 (`ids`)       |
| GET    | `/api/tracks`               | 여러 트랙 조회 (`ids`)           |
| GET    | `/api/artists/:id/albums`   | 특정 아티스트 앨범 목록          |
| GET    | `/api/artists/:id/top-tracks` | 특정 아티스트 인기 트랙        |

## 개발 팁
- 토큰 발급 실패 시 서버 로그를 확인해 환경 변수가 올바른지 점검해 주세요.
- 클라이언트에서 검색 후 아티스트 이름을 클릭하면 자동으로 상세 화면으로 이동합니다.
- 코드 스타일 검사를 위해 `client` 디렉토리에서 `yarn lint`를 실행할 수 있습니다.
