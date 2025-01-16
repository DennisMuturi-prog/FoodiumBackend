declare namespace Express {
    interface Request {
        userId: string;
        newTokens:{ refreshToken: string; accessToken: string }
    }
}