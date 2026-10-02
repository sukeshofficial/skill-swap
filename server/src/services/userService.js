import User from "../models/User.js";

class UserService {

  async findOrCreateGoogleUser(profile) {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const displayName = profile.displayName;
    const profilePicture = profile.photos?.[0]?.value || '';

    // 1. Find by existing Google ID
    let user = await User.findOne({ googleId });
    if (user) return user;

    // 2. Link to existing account by email
    user = await User.findOne({ email });
    if (user) {
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = profilePicture;
      await user.save();
      return user;
    }

    // 3. Create a brand new user
    user = await User.create({
      name: displayName,
      email,
      googleId,
      profilePicture,
    });

    return user;
  }

  async findUserById(id) {
    return User.findById(id).lean();
  }
}

export default new UserService();
