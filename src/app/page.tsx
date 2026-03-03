import { Metadata } from "next";
import SplashContent from "./SplashContent";

export const metadata: Metadata = {
  title: "Welcome to EventPulse | Your Campus. Connected.",
  description: "Join the university ecosystem. Track events, earn points, and stay connected.",
};

export default function Page() {
  return <SplashContent />;
}
