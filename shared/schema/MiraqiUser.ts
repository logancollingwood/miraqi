export enum UserType {
    ACCOUNT,
    DISCORD,
    SPOTIFY
}

export interface MiraqiUser {
    account_type: UserType,
    id: number,
    name: String,
    admin: Boolean,
    lastLogin: Date,
    discordId: String,
    loginProviderId: String, // the user id of the oauth user
    loginProviderType: String, // The type of the oauth provider (discord)
    profile: Object
}