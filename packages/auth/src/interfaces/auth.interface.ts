export interface AuthServiceOutput<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface LoginAuthOutput extends AuthServiceOutput<{ 
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}> {}

export interface RegisterAuthOutput extends AuthServiceOutput<{ 
    id: string;
    username: string;
    email: string;
}> {}

export interface RefreshAuthOutput extends AuthServiceOutput<{
    accessToken: string;
    refreshToken: string;
}> {}

export interface GetUserAuthOutput extends AuthServiceOutput<{
    id: string;
    username: string;
    email: string;
}> {}