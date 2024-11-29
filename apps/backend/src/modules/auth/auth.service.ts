export class AuthService {
  async userInfo(userId: number) {
    return {
      name: 'hi ' + userId,
    }
  }
}
