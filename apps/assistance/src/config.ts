import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,

  mysql: {
    host: process.env.MYSQL_HOST as string,
    user: process.env.MYSQL_USER as string,
    password: process.env.MYSQL_PASSWORD as string,
    database: process.env.MYSQL_DATABASE as string,
    port: Number(process.env.MYSQL_PORT) || 3306,
  },

  aws: {
    accessKey: process.env.AWS_ACCESS_KEY as string,
    secretKey: process.env.AWS_SECRET_KEY as string,
    region: process.env.AWS_REGION as string,

    s3: {
      bucket: process.env.AWS_S3_BUCKET as string,
    },
  },
};
