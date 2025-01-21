import { SignJWT, jwtVerify } from "jose";

export class JwtService {
  secret: Uint8Array;
  constructor(
    secretKey: string,
    private readonly expiresIn = "30d"
  ) {
    console.log("private : ", secretKey);
    this.secret = new TextEncoder().encode(secretKey);
  }

  public async encrypt(
    payload: Record<string, unknown>,
    timeout: string = this.expiresIn
  ): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(timeout)
      .sign(this.secret);

    return jwt;
  }

  public async decrypt<T = unknown>(token: string): Promise<T> {
    const { payload } = await jwtVerify(token, this.secret);
    return payload as T;
  }
}
