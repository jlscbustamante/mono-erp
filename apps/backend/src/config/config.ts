import dotenv from 'dotenv'

dotenv.config()

export default {
  purchasegeneratederivate: process.env.PURCHASE_GENERATE_DERIVATE == 'true',
  messages: {
    wsp: process.env.WSP_CODE as string,
  },
  aws: {
    glue: {
      region: process.env.AWS_GLUE_REGION_S3 as string,
      accessKey: process.env.AWS_GLUE_KEY as string,
      secretKey: process.env.AWS_GLUE_SECRET_KEY as string,
    },
    pinpoint: {
      region: process.env.AWS_PINPOINT_REGION as string,
      accessKey: process.env.AWS_PINPOINT_KEY as string,
      secretKey: process.env.AWS_PINPOINT_SECRET_KEY as string,
      applicationId: process.env.AWS_PINPOINT_APPLICATION_ID as string,
    },
  },
  facturationUrl: String(process.env.FACTURATION_URL),
  generateGuideUrl: String(process.env.GUIA_URL),
  generateGuideWithTransportUrl: String(process.env.GUIA_WITH_TRANSPORT_URL),
  companyName: String(process.env.COMPANY_NAME),
  url_depend: String(process.env.URL_DEPEND),
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST as string,
  JWTKey: process.env.KEY_JWT as string,
  JWTExternalKey: process.env.EXTERNAL_KEY_JWT as string,
  // database
  mysqlHost: process.env.MYSQL_HOST as string,
  mysqlUser: process.env.MYSQL_USER as string,
  mysqlPassword: process.env.MYSQL_PASSWORD as string,
  mysqlPort: Number(process.env.MYSQL_PORT) || 3306,
  mysqlDatabase: process.env.MYSQL_DATABASE as string,
  disabledPermissions: Boolean(Number(process.env.DISABLED_PERMISSIONS)),

  //database driver
  mysqlHost_driver: process.env.MYSQL_HOST_DRIVER as string,
  mysqlUser_driver: process.env.MYSQL_USERNAME_DRIVER as string,
  mysqlPassword_driver: process.env.MYSQL_PASSWORD_DRIVER as string,
  mysqlPort_driver: Number(process.env.MYSQL_PORT_DRIVER),
  mysqlDatabase_driver: process.env.MYSQL_DATABASE_DRIVER as string,
  disabledPermissions_driver: Boolean(Number(process.env.DISABLED_PERMISSIONS)),

  showTypeormLog: Boolean(Number(process.env.TYPEORM_LOG)),

  // service ruc
  tokenRucApi: process.env.TOKEN_RUC_API as string,

  // token
  tokenSecret: process.env.TOKEN_SECRET as string,

  // s3
  s3AccessKey: process.env.ACCESS_KEY_ID_S3 as string,
  s3SecretKey: process.env.SECRET_ACCESS_KEY_S3 as string,
  s3Region: process.env.REGION_S3 as string,
  s3Bucket: process.env.BUCKET_NAME_S3 as string,
  s3FolderRequirement: process.env.BUCKET_FOLDER_REQ as string,
  s3FolderRequirementPayment: process.env.BUCKET_FOLDER_REQ_PAGOS as string,
  s3BucketIziPay: process.env.BUCKET_NAME_S3_IZIPAY as string,
  s3BucketBanco: process.env.BUCKET_NAME_S3_BANCO as string,
  s3BucketCulqiOne: process.env.BUCKET_NAME_S3_CULQI_ONE as string,
  s3BucketCulqiTwo: process.env.BUCKET_NAME_S3_CULQI_TWO as string,

  s3RegionPagos: process.env.REGION_S3_PAGOS as string,
  s3AccessKeyPagos: process.env.ACCESS_KEY_ID_S3_PAGOS as string,
  s3SecretKeyPagos: process.env.SECRET_ACCESS_KEY_S3_PAGOS as string,
  s3BucketNamePayments: process.env.BUCKET_NAME_S3_PAYMENTS as string,

  // power bi
  authenticationMode: process.env.authenticationMode as string,
  authorityUrl: process.env.authorityUrl as string,
  scopeBase: process.env.scopeBase as string,
  powerBiApiUrl: process.env.powerBiApiUrl as string,
  clientId: process.env.clientId as string,
  workspaceId: process.env.workspaceId as string,
  reportId: process.env.reportId as string,
  pbiUsername: process.env.pbiUsername as string,
  pbiPassword: process.env.pbiPassword as string,
  clientSecret: process.env.clientSecret as string,
  tenantId: process.env.tenantId as string,

  dev: Boolean(Number(process.env.MODE_DEV)),

  external: {
    sipro: {
      key: process.env.EXT_KEY_JWT_SIPRO as string,
    },
  },
}
