import { connect } from "/app/utils/db";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    // Only allow GET requests for this endpoint
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Get the user session
    const session = await getSession({ req });
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { email } = session.user;

    // Connect to MongoDB
    const { db } = await connect();

    // Fetch the user data from the database
    const user = await db.collection('users').findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Return user data, excluding sensitive fields like password
    const { password, ...userData } = user;
    res.status(200).json(userData);
}
