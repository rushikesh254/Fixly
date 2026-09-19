// Fields that must never leave the server. Used with .select() and .populate()
// so every endpoint strips the same set of sensitive values.
const PRIVATE_USER_FIELDS =
  "-password -refreshToken -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires";

export { PRIVATE_USER_FIELDS };
