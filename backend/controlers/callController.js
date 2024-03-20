const activeCalls = {};

// Controller for initiating a call
const initiateCall = (req, res) => {
    const { roomId, senderId, recipientId } = req.body;

    // Create a room for the call
    activeCalls[roomId] = { senderId, recipientId };

    // Send response
    res.status(200).json({ message: 'Call initiated successfully' });
};

// Controller for accepting a call
const acceptCall = (req, res) => {
    const { roomId } = req.body;

    // Send response
    res.status(200).json({ message: 'Call accepted successfully' });
};

// Controller for rejecting a call
const rejectCall = (req, res) => {
    const { roomId } = req.body;

    // Clean up the call room
    delete activeCalls[roomId];

    // Send response
    res.status(200).json({ message: 'Call rejected successfully' });
};

// Controller for ending a call
const endCall = (req, res) => {
    const { roomId } = req.body;

    // Clean up the call room
    delete activeCalls[roomId];

    // Send response
    res.status(200).json({ message: 'Call ended successfully' });
};

module.exports = {
    initiateCall,
    acceptCall,
    rejectCall,
    endCall
};
