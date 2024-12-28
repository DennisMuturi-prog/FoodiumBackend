import { ObjectId } from "mongodb";

export interface GoogleProfile {
    provider: 'google';
    id: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    displayName: string;
    birthday?: string;
    relationship?: string;
    isPerson?: boolean;
    isPlusUser?: boolean;
    placesLived?: Array<{
      value: string;
      primary?: boolean;
    }>;
    language?: string;
    emails?: Array<{
      value: string;
      verified?: boolean;
    }>;
    gender?: string;
    picture?: string;
    coverPhoto?: string;
  }
  export interface AuthenticatedUser extends GoogleProfile {
    _id:ObjectId
    refreshTokenVersion: number;
  }
  export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
  }