export const getProfile = (req, res) => res.json(req.user);
export const getDashboard = (req, res) => res.json({ message: "Secret dashboard", user: req.user.id });
