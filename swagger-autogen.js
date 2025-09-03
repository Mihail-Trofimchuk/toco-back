const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Tocos Backend API",
    description: "API для работы с отправлениями",
  },
  host: "localhost:8000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routers/**/*.ts"]; // сканируем все файлы с роутами

swaggerAutogen(outputFile, endpointsFiles, doc);
