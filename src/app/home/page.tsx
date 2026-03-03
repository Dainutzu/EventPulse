import { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
    title: "Home Feed | EventPulse",
    description: "Discover upcoming campus events, trending activities, and personalized recommendations.",
};

export default function HomePage() {
    return <HomeContent />;
}

