import dotenv from 'dotenv'

dotenv.config()

export const configHosts = {
  pos: process.env.HOST_POS as string,
  central: process.env.HOST_CENTRAL as string,
}
