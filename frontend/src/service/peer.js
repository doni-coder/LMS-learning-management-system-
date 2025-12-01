class PeerService {
    constructor() {
        this.peers = new Map();
    }

    createPeer(socketId, stream = null) {

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ],
                },
            ],
        });


        if (stream) {
            stream.getTracks().forEach((track) => {
                peer.addTrack(track, stream);
            });
        }

        this.peers.set(socketId, peer);
        return peer;
    }

    async getOffer(socketId, stream) {
        const peer = this.createPeer(socketId, stream);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    async getAnswer(socketId, offer) {
        const peer = this.createPeer(socketId);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    async setRemoteAnswer(socketId, answer) {
        const peer = this.peers.get(socketId);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    onTrack(socketId, callback) {
        const peer = this.peers.get(socketId);
        if (!peer) {
            console.warn("No peer found for socket:", socketId);
            return;
        }

        if (peer.getReceivers().some(r => r.track)) {
            console.log("Tracks already available, creating stream manually");
            const remoteStream = new MediaStream(peer.getReceivers().map(r => r.track));
            callback(remoteStream);
        }

        peer.addEventListener("track", (ev) => {
            const [remoteStream] = ev.streams;
            callback(remoteStream);
        });
    }

    closeAllPeers() {
        this.peers.forEach((peer) => peer.close());
        this.peers.clear();
    }

    removePeer(socketId) {
        const peer = this.peers.get(socketId);
        if (peer) {
            peer.close();
            this.peers.delete(socketId);
        }
    }

    handleICECandidate(socket, targetId) {
        const peer = this.peers.get(targetId);
        if (peer) {
            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", {
                        targetId,
                        candidate: event.candidate,
                    });
                }
            };
        }
    }
}

export default new PeerService();
