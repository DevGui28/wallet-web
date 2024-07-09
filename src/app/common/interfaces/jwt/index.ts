export interface JwtPayload {
  id: string
}

export interface Jwt extends JwtPayload {
  iat: number
  exp: number
}
