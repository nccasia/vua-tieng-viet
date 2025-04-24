const extendOrigins = process.env.EXTEND_CORS
  ? process.env.EXTEND_CORS.split(';')
  : [];
export const corsConfig = {
  origin: [
  "https://vua-tieng-viet.nccsoft.vn",
  "https://admin.socket.io",
  ...extendOrigins,
],
  credentials: true,
};