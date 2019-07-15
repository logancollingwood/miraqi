export default interface Room {
    _id: String,
    name: String,
    description: String,
    sourceIp: String,
    roomProviderId: String, // the user id of the oauth user
    roomProviderType: String, // The type of the oauth provider (discord)
    users: [any],
    messages: [any],
    queue: [any]
}