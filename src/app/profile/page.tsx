import { Metadata } from "next";
import ProfileContent from "./ProfileContent";

export const metadata: Metadata = {
    title: "Your Profile | EventPulse",
    description: "Manage your campus engagement, interests, and event activity.",
};

export default function ProfilePage() {
    return <ProfileContent />;
}

