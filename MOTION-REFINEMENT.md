# Natural character motion — 2026-10-31

Walking cadence uses measured displacement and character height. Walk/run clips share gait phase, speed and locomotion weights ease over time, and a small vertical weight shift accompanies the gait. Turns ease toward travel direction. Stopping fades into the existing idle capture.

Rocketbox children use a Bip02 skeleton; its names are normalized to the Bip01 motion bindings when loading. This fixes previously frozen child actors. Native teen clips retain their own skeleton, with matching bone aliases and a symmetric relaxed idle derived from opposite walk poses.

Greetings preserve lower-body locomotion. A bent elbow brings the hand beside the face, the palm faces the recipient, and the wrist waves with eased entry/exit. Punches use shoulder/elbow IK, a guarding hand, pelvis and torso rotation, wrist alignment, finger closure, and separate wind-up/contact/recovery timing. Existing attack names and hit timing remain compatible. Procedural overlays restore the last evaluated animation pose each frame to prevent joint drift.

Validation: `node qa-motion.cjs` runs a local WebGL preview, checks measured walking speed, running transition, simultaneous walking/greeting, wrist extension/retraction and recovery, and actual foot movement on all 25 models. Screenshots cover male/female/child idle, walking, running, waving and punching. This is an animation refinement, with visual review in the local renderer; device-specific performance remains dependent on graphics settings.
